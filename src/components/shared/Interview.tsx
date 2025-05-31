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
import { useEffect, useState } from 'react';
import { vapi } from '@/lib/vapi';
import { useRouter } from 'next/navigation';
import { generator } from '@/lib/workflow';

enum CallStatus {
  INACTIVE = 'INACTIVE',
  CONNECTING = 'CONNECTING',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
}

interface InterviewProps {
  questions: string[];
}

interface SavedMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export default function Interview({ questions }: InterviewProps) {
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

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }

    if (callStatus === CallStatus.FINISHED) {
      router.push('/explore');
    }
  }, [messages, callStatus, router]);

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
              callStatus === CallStatus.CONNECTING && 'hidden'
            }`}
            onClick={handleCall}>
            {callStatus === CallStatus.INACTIVE ||
            callStatus === CallStatus.FINISHED
              ? 'Call'
              : '...'}
          </Button>
        )}
      </div>
    </div>
  );
}
