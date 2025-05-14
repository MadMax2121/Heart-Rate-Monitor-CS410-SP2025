/**
 * @file HeartBeat.tsx
 * @description Renders a responsive heart icon that animates based on the current BPM.
 * @module HeartBeat
 */

'use client';
import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';


/**
 * Props for the HeartBeat component
 * @typedef {Object} HeartBeatProps
 * @property {number | null} bpm - The current heart rate in BPM.
 */
const HeartBeat = ({ bpm }: { bpm: number | null }) => {
  const [isBeating, setIsBeating] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [statusColor, setStatusColor] = useState('text-gray-400');
  
  /**
   * Effect hook to update beat animation and heart status color based on bpm.
   */
  useEffect(() => {
    if (!bpm) {
      setStatusText('No signal');
      setStatusColor('text-gray-400');
      return;
    }

    // Update status based on BPM
    if (bpm > 120) {
      setStatusText('Elevated');
      setStatusColor('text-rose-500');
    } else if (bpm < 50) {
      setStatusText('Low');
      setStatusColor('text-blue-500');
    } else {
      setStatusText('Normal');
      setStatusColor('text-emerald-500');
    }

    // Calculate interval based on BPM
    const intervalTime = 60000 / bpm;

    // Create heartbeat animation
    const interval = setInterval(() => {
      setIsBeating(true);
      setTimeout(() => setIsBeating(false), 200);
    }, intervalTime);

    return () => clearInterval(interval);
  }, [bpm]);

  return (
    <div className="flex flex-col items-center justify-center relative">
      {/* Pulse effect */}
      <div className={`absolute inset-0 bg-red-400 rounded-full opacity-0 ${
        isBeating ? 'animate-ping' : ''
      }`} style={{ animation: isBeating ? 'ping 1s cubic-bezier(0, 0, 0.2, 1)' : 'none' }} />
      
      {/* Heart icon with beat animation */}
      <div 
        className={`${isBeating ? 'animate-beat' : ''} transition-all duration-300 relative z-10`}
        style={{ 
          filter: isBeating ? 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.6))' : 'none',
          transition: 'filter 0.3s ease-in-out'
        }}
      >
        <Heart 
          size={64} 
          className="text-red-500" 
          fill="#ef4444" 
          strokeWidth={1.5}
        />
      </div>
      
      {/* BPM display */}
      {bpm && (
        <div className="mt-3 flex flex-col items-center">
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-gray-800">{bpm}</span>
            <span className="text-gray-500 text-lg">BPM</span>
          </div>
          <span className={`text-sm font-medium mt-1 ${statusColor}`}>
            {statusText}
          </span>
        </div>
      )}
    </div>
  );
};

export default HeartBeat;
