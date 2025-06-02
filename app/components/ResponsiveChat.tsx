'use client';

import React, { useEffect, useState } from 'react';
import Chat from './Chat';
import MobileChat from './MobileChat';

interface ResponsiveChatProps {
  username: string;
}

export default function ResponsiveChat({ username }: ResponsiveChatProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return isMobile ? <MobileChat username={username} /> : <Chat username={username} />;
} 