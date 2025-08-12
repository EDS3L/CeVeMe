import React from 'react';
import Card from '../ui/Card';

export default function SkeletonCard() {
  return (
    <Card className="p-5 animate-pulse">
      <div className="h-5 w-2/3 bg-ivorymedium rounded"></div>
      <div className="mt-3 h-4 w-1/3 bg-ivorymedium rounded"></div>
      <div className="mt-4 flex gap-2">
        <div className="h-6 w-24 bg-ivorymedium rounded-full"></div>
        <div className="h-6 w-28 bg-ivorymedium rounded-full"></div>
        <div className="h-6 w-32 bg-ivorymedium rounded-full"></div>
      </div>
      <div className="mt-4 h-4 w-1/2 bg-ivorymedium rounded"></div>
    </Card>
  );
}
