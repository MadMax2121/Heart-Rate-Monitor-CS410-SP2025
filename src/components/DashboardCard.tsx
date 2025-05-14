/**
 * @file DashboardCard.tsx
 * @description Reusable UI card component with optional icon and action button.
 * @module DashboardCard
 */

'use client';
import React, { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';

/**
 * Props for the DashboardCard component.
 * @typedef {Object} DashboardCardProps
 * @property {string} title - Title of the card
 * @property {ReactNode} [icon] - Optional icon to display next to the title
 * @property {ReactNode} children - Content inside the card
 * @property {{ label: string, onClick: () => void }} [action] - Optional action button with label and handler
 * @property {string} [className] - Optional extra class for styling
 */

interface DashboardCardProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

/**
 * DashboardCard component – a wrapper card with optional icon and CTA button.
 * @param {DashboardCardProps} props
 * @returns {JSX.Element}
 */

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  icon,
  children,
  action,
  className = '',
}) => {
  return (
    <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl ${className}`}>
      <div className="p-4 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            {icon && <span className="text-indigo-500">{icon}</span>}
            {title}
          </h2>
          
          {action && (
            <button
              onClick={action.onClick}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
            >
              {action.label}
              <ChevronRight size={16} />
            </button>
          )}
        </div>
        
        <div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
