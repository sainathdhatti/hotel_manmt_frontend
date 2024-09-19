"use client";
import React from 'react';

const LoadingSpinner = () => (
<div className="flex items-center justify-center h-screen">
    <div className="relative w-16 h-16">
      <div className="absolute w-4 h-4 bg-blue-500 animate-spin rounded"></div>
      <div className="absolute w-4 h-4 bg-blue-500 animate-spin rounded" style={{animationDelay: '0.2s'}}></div>
      <div className="absolute w-4 h-4 bg-blue-500 animate-spin rounded" style={{animationDelay: '0.4s'}}></div>
      <div className="absolute w-4 h-4 bg-blue-500 animate-spin rounded" style={{animationDelay: '0.6s'}}></div>
    </div>
  </div>
)

export default LoadingSpinner;
