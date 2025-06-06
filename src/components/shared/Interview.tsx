/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Mic, MicOff, Phone, PhoneOff } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage, Button } from '../ui';
import { useAuth } from '@/context/AuthContext';
import { useCallback, useEffect, useState } from 'react';
import { vapi } from '@/lib/vapi';
import { useRouter } from 'next/navigation';
import { generator } from '@/lib/workflow';
import { Loader2Icon } from 'lucide-react';

enum CallStatus {
  INACTIVE = 'INACTIVE',
  CONNECTING = 'CONNECTING',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
  GENERATING_FEEDBACK = 'GENERATING_FEEDBACK',
}

interface InterviewProps {
  questions: string[];
  interviewId: string;
}

interface SavedMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export default function Interview({ questions, interviewId }: InterviewProps) {
  const { user } = useAuth();
  const userId = user?.id;
  const router = useRouter();

  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [callStatus, setCallStatus] = useState(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
    };

    const onMessage = (message: any) => {
      if (message.type === 'transcript' && message.transcriptType === 'final') {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => {
      setIsAgentSpeaking(true);
      setIsUserSpeaking(false);
    };

    const onSpeechEnd = () => {
      setIsAgentSpeaking(false);
      setIsUserSpeaking(true);
    };

    vapi.on('call-start', onCallStart);
    vapi.on('call-end', onCallEnd);
    vapi.on('message', onMessage);
    vapi.on('speech-start', onSpeechStart);
    vapi.on('speech-end', onSpeechEnd);

    return () => {
      vapi.off('call-start', onCallStart);
      vapi.off('call-end', onCallEnd);
      vapi.off('message', onMessage);
      vapi.off('speech-start', onSpeechStart);
      vapi.off('speech-end', onSpeechEnd);
    };
  }, []);

  const generateFeedback = useCallback(async () => {
    try {
      setCallStatus(CallStatus.GENERATING_FEEDBACK);

      // Convert messages to conversation history string
      const conversationHistory = messages
        .map((msg) => `${msg.role}: ${msg.content}`)
        .join('\n');

      // Call our API to generate feedback
      const response = await fetch(`/api/interviews/${interviewId}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationHistory,
          userId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate feedback');
      }

      const result = await response.json();

      // Redirect to feedback results page
      router.push(`/interview/results/${result.reportId}`);
    } catch (error) {
      console.error('Error generating feedback:', error);
      // Fallback: redirect to explore page
      router.push('/explore');
    }
  }, [messages, interviewId, userId, router]);

  useEffect(() => {
    if (callStatus === CallStatus.FINISHED && messages.length > 0) {
      generateFeedback();
    }
  }, [messages, callStatus, generateFeedback]);

  const handleCall = async () => {
    try {
      if (
        !user ||
        !userId ||
        !generator ||
        !generator.nodes ||
        !generator.edges ||
        !vapi
      ) {
        return;
      }

      setCallStatus(CallStatus.CONNECTING);

      // Format questions as a numbered string for better template rendering
      const formattedQuestions = questions
        .map((question, index) => `${index + 1}. ${question}`)
        .join('\n');

      // Create a dynamic workflow with questions embedded directly
      const dynamicWorkflow = {
        ...generator,
        nodes: generator.nodes.map((node) => {
          if (node.name === 'interview_conversation') {
            return {
              ...node,
              prompt: `You are a professional interviewer conducting an interview. You MUST ask the following specific questions and ONLY these questions:

${formattedQuestions}

IMPORTANT RULES:
1. Ask ONLY the questions listed above - do not make up or add any other questions
2. Ask the questions in the exact order they are listed
3. Ask one question at a time and wait for a complete answer before moving to the next
4. You may ask brief clarifying follow-up questions to get more detail on their answer
5. Do not ask general interview questions like 'tell me about yourself' unless it's specifically in the list above
6. Stick strictly to the provided questions
7. Once all questions are answered, move to conclude the interview

Start with the first question from the list above.`,
            };
          }
          return node;
        }),
      };

      const vapiConfig = {
        variableValues: {
          name: user?.user_metadata.name?.split(' ')?.[0] || 'User',
          userid: userId,
        },
        clientMessages: ['transcript'] as any,
        serverMessages: [] as any,
      };

      await vapi.start(
        undefined,
        vapiConfig,
        undefined,
        dynamicWorkflow as any
      );
    } catch (error) {
      console.error('Error in handleCall:', error);
      if (error && typeof error === 'object' && 'response' in error) {
        const response = (error as any).response;
        if (response?.data?.error?.message) {
          alert('Error: ' + response.data.error.message);
        }
      }
      setCallStatus(CallStatus.FINISHED);
      throw error;
    }
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  const getStatusText = () => {
    switch (callStatus) {
      case CallStatus.CONNECTING:
        return 'Connecting...';
      case CallStatus.GENERATING_FEEDBACK:
        return 'Generating your feedback...';
      default:
        return 'Call';
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Main Content */}
      <div className="flex-1 space-y-8">
        {/* Participants Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* AI Assistant Card */}
          <div className="relative">
            <Card
              className={`h-[400px] bg-card/50 backdrop-blur-xl transition-all duration-300 ${
                isAgentSpeaking ? 'ring-2 ring-primary ring-opacity-50' : ''
              }`}>
              <div className="absolute top-4 left-4">
                <div
                  className={`flex items-center gap-2 ${
                    isAgentSpeaking ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                  {isAgentSpeaking ? (
                    <Mic className="h-5 w-5 animate-pulse" />
                  ) : (
                    <MicOff className="h-5 w-5" />
                  )}
                  <span className="text-sm font-medium">
                    {isAgentSpeaking ? 'Speaking' : 'Silent'}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center h-full space-y-6">
                <div className="relative">
                  <div
                    className={`rounded-full bg-primary/10 p-6 ${
                      isAgentSpeaking ? 'animate-pulse' : ''
                    }`}>
                    <Bot className="h-16 w-16 text-primary" />
                  </div>
                  {isAgentSpeaking && (
                    <div className="absolute -bottom-2 -right-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-1 text-foreground">
                    AI Interviewer
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Professional Interview Assistant
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* User Card */}
          <div className="relative">
            <Card
              className={`h-[400px] bg-card/50 backdrop-blur-xl transition-all duration-300 ${
                isUserSpeaking ? 'ring-2 ring-secondary ring-opacity-50' : ''
              }`}>
              <div className="absolute top-4 right-4">
                <div
                  className={`flex items-center gap-2 ${
                    isUserSpeaking ? 'text-secondary' : 'text-muted-foreground'
                  }`}>
                  <span className="text-sm font-medium">
                    {isUserSpeaking ? 'Speaking' : 'Silent'}
                  </span>
                  {isUserSpeaking ? (
                    <Mic className="h-5 w-5 animate-pulse" />
                  ) : (
                    <MicOff className="h-5 w-5" />
                  )}
                </div>
              </div>
              <div className="flex flex-col items-center justify-center h-full space-y-6">
                <div className="relative">
                  <Avatar
                    className={`h-24 w-24 ${
                      isUserSpeaking
                        ? 'ring-4 ring-secondary ring-opacity-50'
                        : ''
                    }`}>
                    <AvatarImage src={user?.user_metadata.avatar_url} />
                    <AvatarFallback className="text-lg">
                      {user?.user_metadata.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {isUserSpeaking && (
                    <div className="absolute -bottom-2 -right-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-secondary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-secondary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-secondary rounded-full animate-bounce"></div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-1 text-foreground">
                    {user?.user_metadata.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">Interviewee</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Call Controls */}
        <div className="w-full flex justify-center mt-8">
          {callStatus === CallStatus.ACTIVE ? (
            <Button
              variant="destructive"
              size="lg"
              className="px-8 py-6 rounded-full hover:scale-105 transition-transform"
              onClick={handleDisconnect}>
              <PhoneOff className="mr-2 h-5 w-5" />
              End Call
            </Button>
          ) : (
            <Button
              size="lg"
              className={`px-8 py-6 rounded-full hover:scale-105 transition-transform ${
                (callStatus === CallStatus.CONNECTING ||
                  callStatus === CallStatus.GENERATING_FEEDBACK) &&
                'opacity-50 cursor-not-allowed'
              }`}
              disabled={
                callStatus === CallStatus.CONNECTING ||
                callStatus === CallStatus.GENERATING_FEEDBACK
              }
              onClick={handleCall}>
              <Phone className="mr-2 h-5 w-5" />
              {callStatus === CallStatus.INACTIVE ||
              callStatus === CallStatus.FINISHED
                ? 'Start Interview'
                : getStatusText()}
            </Button>
          )}
        </div>

        {/* Connection Status */}
        {(callStatus === CallStatus.CONNECTING ||
          callStatus === CallStatus.GENERATING_FEEDBACK) && (
          <div className="w-full flex justify-center">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2Icon className="animate-spin h-4 w-4" />
              <span>{getStatusText()}</span>
            </div>
          </div>
        )}
      </div>

      {/* Chat Section - Hidden on Mobile */}
      <div className="hidden lg:block w-[400px]">
        <Card className="h-[600px] bg-card/50 backdrop-blur-xl">
          <div className="flex flex-col h-full">
            <div className="px-4 py-3 border-b">
              <h3 className="font-semibold text-foreground">
                Interview Transcript
              </h3>
            </div>
            <ScrollArea className="flex-1 p-4 h-[500px]">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === 'assistant'
                        ? 'justify-start'
                        : 'justify-end'
                    }`}>
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        message.role === 'assistant'
                          ? 'bg-primary/10 text-primary-foreground'
                          : 'bg-secondary/10 text-secondary-foreground'
                      }`}>
                      {message.content}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </Card>
      </div>
    </div>
  );
}
