/**
 * @file StatusBadge.tsx
 * @description Renders a pill-style badge indicating heart rate status with optional animation.
 * @module StatusBadge
 */

'use client';
import React from 'react';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';


/**
 * Heart rate status type
 * @typedef {'normal' | 'elevated' | 'low' | 'inactive'} StatusType
 */
/**
 * Props for the StatusBadge component
 * @typedef {Object} StatusBadgeProps
 * @property {StatusType} status - Type of status to display
 * @property {boolean} [animate] - Whether the badge should pulse
 * @property {string} [className] - Additional class for styling
 */
type StatusType = 'normal' | 'elevated' | 'low' | 'inactive';

interface StatusBadgeProps {
  status: StatusType;
  animate?: boolean;
  className?: string;
}


/**
 * StatusBadge component — renders a stylized badge for the given heart rate status.
 * @param {StatusBadgeProps} props
 * @returns {JSX.Element}
 */
const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  animate = false,
  className = '' 
}) => {
  
    /**
   * Returns display configuration (icon, color, label) based on status type.
   * @returns {{ color: string, icon: JSX.Element, label: string }}
   */
  
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
