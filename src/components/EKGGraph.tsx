'use client';
import React, { useEffect, useRef } from 'react';

const EKGGraph = ({ bpm }: { bpm: number | null }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const xRef = useRef(0);
  const lastTimestampRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // Set canvas dimensions with higher resolution for retina displays
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const actualWidth = rect.width;
    const actualHeight = rect.height;

    // Generate a more realistic EKG pattern with improved visuals
    const waveformPoints = 600;
    const waveform = Array(waveformPoints).fill(actualHeight / 2).map((_, i) => {
      const mod = i % 150;
      // P wave (atrial depolarization)
      if (mod >= 30 && mod < 45) {
        return actualHeight / 2 - 5 * Math.sin((mod - 30) * 0.4);
      }
      // PR segment
      if (mod >= 45 && mod < 55) {
        return actualHeight / 2;
      }
      // QRS complex (ventricular depolarization)
      if (mod === 55) return actualHeight / 2 + 10;      // Q wave
      if (mod === 60) return actualHeight / 2 - 40;      // R wave peak
      if (mod === 65) return actualHeight / 2 + 15;      // S wave
      // ST segment
      if (mod >= 65 && mod < 80) {
        return actualHeight / 2 + 2;
      }
      // T wave (ventricular repolarization)
      if (mod >= 80 && mod < 110) {
        return actualHeight / 2 - 10 * Math.sin((mod - 80) * 0.1);
      }
      // TP segment (resting)
      return actualHeight / 2 + Math.sin(i * 0.1) * 0.5;  // baseline with slight noise
    });

    // Background grid
    const drawGrid = () => {
      ctx.strokeStyle = 'rgba(40, 40, 40, 0.05)';
      ctx.lineWidth = 0.5;
      
      // Major grid lines
      const majorGridSize = 20;
      ctx.beginPath();
      for (let i = 0; i <= actualWidth; i += majorGridSize) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i, actualHeight);
      }
      for (let i = 0; i <= actualHeight; i += majorGridSize) {
        ctx.moveTo(0, i);
        ctx.lineTo(actualWidth, i);
      }
      ctx.stroke();
      
      // Minor grid lines
      ctx.strokeStyle = 'rgba(40, 40, 40, 0.025)';
      const minorGridSize = 5;
      ctx.beginPath();
      for (let i = 0; i <= actualWidth; i += minorGridSize) {
        if (i % majorGridSize !== 0) {
          ctx.moveTo(i, 0);
          ctx.lineTo(i, actualHeight);
        }
      }
      for (let i = 0; i <= actualHeight; i += minorGridSize) {
        if (i % majorGridSize !== 0) {
          ctx.moveTo(0, i);
          ctx.lineTo(actualWidth, i);
        }
      }
      ctx.stroke();
    };

    const draw = (timestamp: number) => {
      if (!lastTimestampRef.current) lastTimestampRef.current = timestamp;
      const delta = timestamp - lastTimestampRef.current;
      lastTimestampRef.current = timestamp;

      // Calculate speed based on heart rate
      const baselineSpeed = 60; // Default speed at 60bpm
      const speed = ((bpm || baselineSpeed) / baselineSpeed) * 100;
      xRef.current += (speed * delta) / 1000;
      if (xRef.current > actualWidth) xRef.current = 0;

      // Clear and draw background
      ctx.fillStyle = '#111827'; // Dark background
      ctx.fillRect(0, 0, actualWidth, actualHeight);
      
      // Draw grid
      drawGrid();

      // Draw the heart rate line
      ctx.beginPath();
      ctx.strokeStyle = '#10b981'; // Emerald color
      ctx.lineWidth = 2;
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 5;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // Draw the waveform
      for (let i = 0; i < actualWidth; i++) {
        const shiftedIndex = (i + Math.floor(xRef.current)) % waveform.length;
        if (i === 0) {
          ctx.moveTo(i, waveform[shiftedIndex]);
        } else {
          ctx.lineTo(i, waveform[shiftedIndex]);
        }
      }

      ctx.stroke();
      
      // Reset shadow to avoid affecting other elements
      ctx.shadowBlur = 0;
      
      // Add time markers
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.font = '10px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('0s', 5, actualHeight - 5);
      
      const secondsMarker = Math.floor(actualWidth / speed) * baselineSpeed / 60;
      ctx.fillText(`${secondsMarker.toFixed(1)}s`, actualWidth - 30, actualHeight - 5);
      
      // Add BPM indicator
      if (bpm) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '12px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(`${bpm} BPM`, actualWidth - 10, 20);
      }

      requestAnimationFrame(draw);
    };

    requestAnimationFrame(draw);

    return () => {
      lastTimestampRef.current = 0;
    };
  }, [bpm]);

  return (
    <div className="relative w-full h-48">
      <canvas
        ref={canvasRef}
        className="bg-gray-900 rounded-xl shadow-lg w-full h-full"
      />
    </div>
  );
};

export default EKGGraph;