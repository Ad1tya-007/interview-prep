/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Bot } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage, Button } from '../ui';
import { useAuth } from '@/context/AuthContext';
import { useCallback, useEffect, useState } from 'react';
import { vapi } from '@/lib/vapi';
import { useRouter } from 'next/navigation';
import { generator } from '@/lib/workflow';

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
  const [lastMessage, setLastMessage] = useState<string>('');

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

      console.log('Generating feedback for conversation:', conversationHistory);

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
      console.log('Feedback generated:', result);

      // Redirect to feedback results page
      router.push(`/interview/results/${result.reportId}`);
    } catch (error) {
      console.error('Error generating feedback:', error);
      // Fallback: redirect to explore page
      router.push('/explore');
    }
  }, [messages, interviewId, userId, router]);

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }

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

      const vapiConfig = {
        variableValues: {
          name: user?.user_metadata.name?.split(' ')?.[0] || 'User',
          userid: userId,
          questions: questions,
        },
        clientMessages: ['transcript'] as any,
        serverMessages: [] as any,
      };

      await vapi.start(undefined, vapiConfig, undefined, generator as any);
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
    <div>
      <div className="flex flex-row justify-center gap-10 max-w-7xl mx-auto">
        <div className="w-full max-w-md px-4 sm:px-6 md:px-8 lg:px-12">
          <Card
            className={`w-full aspect-square overflow-hidden bg-gradient-to-br from-purple-500/20 via-purple-400/20 to-purple-300/20 border-purple-200/30 ${
              isAgentSpeaking ? 'border-white animate-pulse' : ''
            }`}>
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <CardHeader className="flex items-center justify-center pb-2">
                <div className="rounded-full bg-purple-100 p-3">
                  <Bot className="h-12 w-12 text-purple-600" />
                </div>
              </CardHeader>
              <CardFooter className="text-center">
                <h3 className="font-semibold text-lg mb-1">AI Assistant</h3>
              </CardFooter>
            </div>
          </Card>
        </div>

        <div className="hidden md:block w-full max-w-md px-4 sm:px-6 md:px-8 lg:px-12">
          <Card
            className={`w-full aspect-square overflow-hidden bg-gradient-to-br from-blue-500/20 via-blue-400/20 to-blue-300/20 border-blue-200/30 ${
              isUserSpeaking ? 'border-white animate-pulse' : ''
            }`}>
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <CardHeader className="flex items-center justify-center pb-2">
                <Avatar
                  className={`h-18 w-18 ${
                    isUserSpeaking
                      ? 'animate-pulse duration-700 transition-all'
                      : ''
                  }`}>
                  <AvatarImage src={user?.user_metadata.avatar_url} />
                  <AvatarFallback>
                    {user?.user_metadata.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </CardHeader>
              <CardContent className="text-center">
                <h3 className="font-semibold text-lg mb-1">
                  {user?.user_metadata.name}
                </h3>
              </CardContent>
            </div>
          </Card>
        </div>
      </div>
      {lastMessage && (
        <div className="w-full justify-center flex">
          <div className="rounded-md py-2 w-[80%] text-center items-center border mt-10 bg-gradient-to-br from-blue-900/30 via-blue-800/30 to-blue-700/30 border-blue-600/40">
            {lastMessage}
          </div>
        </div>
      )}
      <div className="w-full justify-center flex mt-4">
        {callStatus === CallStatus.ACTIVE ? (
          <Button variant="destructive" onClick={handleDisconnect}>
            End
          </Button>
        ) : (
          <Button
            className={`bg-green-600 hover:bg-green-600 ${
              (callStatus === CallStatus.CONNECTING ||
                callStatus === CallStatus.GENERATING_FEEDBACK) &&
              'opacity-50 cursor-not-allowed'
            }`}
            onClick={handleCall}
            disabled={
              callStatus === CallStatus.CONNECTING ||
              callStatus === CallStatus.GENERATING_FEEDBACK
            }>
            {callStatus === CallStatus.INACTIVE ||
            callStatus === CallStatus.FINISHED
              ? 'Call'
              : getStatusText()}
          </Button>
        )}
      </div>
    </div>
  );
}
