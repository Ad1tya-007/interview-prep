'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { sendOtp, verifyOtp } from './actions';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleOtpSubmit = async () => {
    const result = await sendOtp(email);
    if (result.error) {
      setError(result.error);
      return;
    }
    setShowOtpInput(true);
    setError(null);
  };

  const handleOtpVerify = async () => {
    const result = await verifyOtp(email, token);
    if (result?.error) {
      setError(result.error);
      return;
    }

    if (result?.success) {
      router.push('/interviews');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>{showOtpInput ? 'Enter OTP' : 'Welcome Back'}</CardTitle>
          <CardDescription>
            {showOtpInput
              ? "We've sent a verification code to your email"
              : 'Sign in to your account to continue'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {showOtpInput ? (
            <div className="flex flex-col space-y-2">
              <Input
                type="text"
                placeholder="Enter OTP"
                className="w-full"
                value={token}
                onChange={(e) => setToken(e.target.value)}
              />
              <Button className="w-full" onClick={handleOtpVerify}>
                Verify OTP
              </Button>
              <Button
                variant="link"
                onClick={() => setShowOtpInput(false)}
                className="text-sm hover:cursor-pointer">
                Go Back
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button className="w-full" onClick={handleOtpSubmit}>
                  Send OTP
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
