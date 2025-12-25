// app/(auth)/login/page.tsx
import LoginForm from '@/components/auth/LoginForm';
import { Brain } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-indigo-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-linear-to-r from-indigo-600 to-purple-600 p-3 rounded-2xl">
              <Brain className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900">BrainWave</h1>
          <p className="mt-2 text-gray-600">AI-Powered Learning Platform</p>
        </div>
        
        <LoginForm />
      </div>
    </div>
  );
}
