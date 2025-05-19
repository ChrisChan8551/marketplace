'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
      <p className="text-gray-600 mb-6">
        {error.message || 'An unexpected error occurred'}
      </p>
      <div className="flex gap-4">
        <Button onClick={reset}>Try again</Button>
        <Button variant="outline" asChild>
          <Link href="/">Go home</Link>
        </Button>
      </div>
    </div>
  );
}
