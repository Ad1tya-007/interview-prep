'use client';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Bot, User2 } from 'lucide-react';
import { Button } from '../ui';

enum CallStatus {
  INACTIVE = 'INACTIVE',
  CONNECTING = 'CONNECTING',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
}

export default function Interview() {
  const isAgentSpeaking = false;
  const isUserSpeaking = false;

  const callStatus = CallStatus.CONNECTING as CallStatus;

  const messages: string[] = [
    'Hello, how are you?',
    'I am good, thank you!',
    'What is your name?',
    'My name is John Doe',
    'What is your favorite color?',
    'My favorite color is blue',
    'What is your favorite food?',
  ];

  const lastMessage = messages[messages.length - 1] || '';

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
                <div
                  className={`rounded-full bg-blue-100 p-3 ${
                    isUserSpeaking
                      ? 'animate-pulse duration-700 transition-all'
                      : ''
                  }`}>
                  <User2 className="h-12 w-12 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <h3 className="font-semibold text-lg mb-1">You</h3>
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
          <Button variant="destructive">End</Button>
        ) : (
          <Button
            className={`bg-green-600 hover:bg-green-600 ${
              callStatus === CallStatus.CONNECTING && 'hidden'
            }`}>
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
