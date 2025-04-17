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
import { Separator } from '@/components/ui/separator';
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
      router.push('/dashboard');
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
              <div className="space-y-2">
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

              <div className="flex items-center space-x-2">
                <Separator className="flex-1" />
                <span className="text-sm text-gray-500">OR</span>
                <Separator className="flex-1" />
              </div>

              <Button variant="outline" className="w-full">
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
