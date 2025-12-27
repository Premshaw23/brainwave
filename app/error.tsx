// app/error.tsx
'use client';
import React from 'react';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50">
      <h1 className="text-4xl font-bold text-red-700 mb-4">Something went wrong</h1>
      <p className="text-lg text-gray-700 mb-6">{error.message || 'An unexpected error occurred.'}</p>
      <button
        className="bg-red-600 text-white px-6 py-2 rounded font-semibold"
        onClick={() => reset()}
      >
        Try Again
      </button>
    </div>
  );
}
