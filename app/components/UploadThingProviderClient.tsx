'use client';

import { NextSSRPlugin } from '@uploadthing/react/next-ssr-plugin';
import { ourFileRouter } from '@/app/api/uploadthing/core';

export function UploadThingProviderClient() {
  // Get the router config in the client component
  const routerConfig = {
    // Just pass the core router config needed for client
    uploadthing: {
      endpoint: 'uploadthing'
    },
  };

  return (
    <NextSSRPlugin routerConfig={routerConfig} />
  );
}
