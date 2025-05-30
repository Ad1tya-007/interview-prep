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

interface SavedMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export default function Interview() {
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

    const onError = (error: Error) => {
      console.log('Error:', error);
    };

    vapi.on('call-start', onCallStart);
    vapi.on('call-end', onCallEnd);
    vapi.on('message', onMessage);
    vapi.on('speech-start', onSpeechStart);
    vapi.on('speech-end', onSpeechEnd);
    vapi.on('error', onError);

    return () => {
      vapi.off('call-start', onCallStart);
      vapi.off('call-end', onCallEnd);
      vapi.off('message', onMessage);
      vapi.off('speech-start', onSpeechStart);
      vapi.off('speech-end', onSpeechEnd);
      vapi.off('error', onError);
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
      console.log('=== STARTING VAPI CALL ===');

      // Check environment variables
      console.log(
        'Vapi token exists:',
        !!process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN
      );
      console.log(
        'Vapi token length:',
        process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN?.length
      );

      console.log('User:', user);
      console.log('UserId:', userId);
      console.log('User metadata:', user?.user_metadata);

      if (!user) {
        console.error('No user found');
        return;
      }

      if (!userId) {
        console.error('No userId found');
        return;
      }

      // Validate generator
      if (!generator) {
        console.error('Generator is undefined');
        return;
      }

      if (!generator.nodes || !generator.edges) {
        console.error('Generator is missing nodes or edges');
        return;
      }

      // Validate Vapi instance
      if (!vapi) {
        console.error('Vapi instance is undefined');
        return;
      }

      console.log('Generator nodes count:', generator.nodes.length);
      console.log('Generator edges count:', generator.edges.length);

      setCallStatus(CallStatus.CONNECTING);

      // Test with minimal config first
      console.log('Testing with minimal Vapi configuration...');

      const vapiConfig = {
        variableValues: {
          name: user?.user_metadata.name?.split(' ')?.[0] || 'User',
          userid: userId,
        },
        clientMessages: ['transcript'] as any,
        serverMessages: [] as any,
      };

      console.log('Vapi config:', vapiConfig);
      console.log('Generator name:', generator.name);

      // Let's try with a minimal workflow first to isolate the issue
      console.log('Using minimal workflow for testing...');

      console.log('=== VAPI.START PARAMETERS ===');
      console.log('1. assistantId:', undefined);
      console.log('2. vapiConfig:', JSON.stringify(vapiConfig, null, 2));
      console.log('3. phoneNumberId:', undefined);
      console.log('4. workflow:', JSON.stringify(generator, null, 2));

      // Try the call
      const result = await vapi.start(
        undefined, // assistantId
        vapiConfig, // assistant config
        undefined, // phoneNumberId
        generator as any // Use original generator workflow
      );

      console.log('Vapi call started successfully');
      console.log('Vapi result:', result);
    } catch (error) {
      console.error('Error in handleCall:', error);
      console.error('Error type:', typeof error);
      console.error('Error constructor:', error?.constructor?.name);
      console.error(
        'Error message:',
        error instanceof Error ? error.message : 'No message'
      );

      // Check if it's a Vapi API response error
      if (error && typeof error === 'object' && 'response' in error) {
        console.error('Vapi API Error Response:', error);
        const response = (error as any).response;
        if (response) {
          console.error('Response status:', response.status);
          console.error('Response data:', response.data);
          if (
            response.data &&
            response.data.error &&
            response.data.error.message
          ) {
            console.error(
              'Specific Vapi error messages:',
              response.data.error.message
            );
            alert('Vapi Error: ' + JSON.stringify(response.data.error.message));
          }
        }
      }

      // Check if error has a 'data' property (another common error format)
      if (error && typeof error === 'object' && 'data' in error) {
        console.error('Error data:', (error as any).data);
      }

      console.error('Error details:', JSON.stringify(error, null, 2));
      console.error(
        'Error stack:',
        error instanceof Error ? error.stack : 'No stack trace'
      );

      // More detailed error inspection
      if (error && typeof error === 'object') {
        console.error('Error keys:', Object.keys(error));
        console.error('Error prototype:', Object.getPrototypeOf(error));
      }

      setCallStatus(CallStatus.FINISHED);

      // Re-throw for debugging
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
