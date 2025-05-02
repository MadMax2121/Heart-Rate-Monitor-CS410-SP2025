'use client';
import React, { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';

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