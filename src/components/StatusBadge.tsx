'use client';
import React from 'react';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';

type StatusType = 'normal' | 'elevated' | 'low' | 'inactive';

interface StatusBadgeProps {
  status: StatusType;
  animate?: boolean;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  animate = false,
  className = '' 
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'normal':
        return {
          color: 'bg-emerald-100 text-emerald-700',
          icon: <CheckCircle2 size={14} className="text-emerald-500" />,
          label: 'Normal'
        };
      case 'elevated':
        return {
          color: 'bg-rose-100 text-rose-700',
          icon: <AlertCircle size={14} className="text-rose-500" />,
          label: 'Elevated'
        };
      case 'low':
        return {
          color: 'bg-blue-100 text-blue-700',
          icon: <AlertCircle size={14} className="text-blue-500" />,
          label: 'Low'
        };
      case 'inactive':
      default:
        return {
          color: 'bg-gray-100 text-gray-700',
          icon: <Clock size={14} className="text-gray-500" />,
          label: 'Inactive'
        };
    }
  };

  const { color, icon, label } = getStatusConfig();
  const animationClass = animate ? 'animate-pulse' : '';

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${color} ${animationClass} ${className}`}>
      {icon}
      <span>{label}</span>
    </div>
  );
};

export default StatusBadge;