/**
 * @file SessionStats.tsx
 * @description Displays session statistics including average, min, max BPM, and heart rate trend using Recharts.
 * @module SessionStats
 */

'use client';
import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';


/**
 * @typedef {Object} SessionData
 * @property {number} bpm - Heart rate value
 * @property {string} timestamp - ISO string timestamp
 */
interface SessionData {
  bpm: number;
  timestamp: string;
}


/**
 * @typedef {Object} SessionStatsProps
 * @property {SessionData[]} data - Array of session data points
 * @property {string} [className] - Optional additional class for styling
 */
interface SessionStatsProps {
  data: SessionData[];
  className?: string;
}

/**
 * Component that displays heart rate session stats and a line chart
 * @param {SessionStatsProps} props 
 * @returns {JSX.Element}
 */
const SessionStats: React.FC<SessionStatsProps> = ({ data, className = '' }) => {
  // Process data into chart-friendly format
  const processedData = useMemo(() => {
    return data.map((reading) => ({
      bpm: reading.bpm,
      time: new Date(reading.timestamp).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit' 
      })
    }));
  }, [data]);

    /**
   * Calculates average, min, max BPM and determines trend
   */
  const stats = useMemo(() => {
    if (data.length === 0) return { avg: 0, min: 0, max: 0, trend: 'stable' };
    
    const bpmValues = data.map(item => item.bpm);
    const avg = Math.round(bpmValues.reduce((sum, val) => sum + val, 0) / bpmValues.length);
    const min = Math.min(...bpmValues);
    const max = Math.max(...bpmValues);
    
    // Determine trend based on recent readings
    let trend = 'stable';
    if (data.length >= 3) {
      const recent = bpmValues.slice(-3);
      if (recent[2] > recent[0] + 5) trend = 'increasing';
      else if (recent[2] < recent[0] - 5) trend = 'decreasing';
    }
    
    return { avg, min, max, trend };
  }, [data]);

    /**
   * Returns the appropriate trend icon
   * @returns {JSX.Element}
   */
  const getTrendIcon = () => {
    switch (stats.trend) {
      case 'increasing': 
        return <TrendingUp size={16} className="text-rose-500" />;
      case 'decreasing': 
        return <TrendingDown size={16} className="text-blue-500" />;
      default: 
        return <ArrowRight size={16} className="text-emerald-500" />;
    }
  };

  if (data.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <Activity size={32} className="text-gray-300 mx-auto mb-2" />
        <p className="text-gray-400">No session data available yet</p>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-indigo-50 rounded-xl p-3 text-center">
          <p className="text-xs text-indigo-600 font-medium mb-1">AVERAGE</p>
          <p className="text-2xl font-bold text-indigo-700">{stats.avg}</p>
          <p className="text-xs text-indigo-400">BPM</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-3 text-center">
          <p className="text-xs text-blue-600 font-medium mb-1">MINIMUM</p>
          <p className="text-2xl font-bold text-blue-700">{stats.min}</p>
          <p className="text-xs text-blue-400">BPM</p>
        </div>
        <div className="bg-rose-50 rounded-xl p-3 text-center">
          <p className="text-xs text-rose-600 font-medium mb-1">MAXIMUM</p>
          <p className="text-2xl font-bold text-rose-700">{stats.max}</p>
          <p className="text-xs text-rose-400">BPM</p>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-medium text-gray-600">Heart Rate Trend</p>
        <div className="flex items-center gap-1 text-sm">
          {getTrendIcon()}
          <span className="text-gray-600 capitalize">{stats.trend}</span>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={processedData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 10 }} 
              tickFormatter={(value) => value.split(':')[0] + ':' + value.split(':')[1]}
            />
            <YAxis 
              domain={['dataMin - 10', 'dataMax + 10']} 
              tick={{ fontSize: 10 }}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '8px',
                border: '1px solid #eee',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value) => [`${value} BPM`, 'Heart Rate']}
            />
            <Line 
              type="monotone" 
              dataKey="bpm" 
              stroke="#6366f1" 
              strokeWidth={2}
              dot={{ fill: '#4f46e5', r: 3 }}
              activeDot={{ fill: '#4338ca', r: 5, strokeWidth: 2 }}
              animationDuration={500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SessionStats;
