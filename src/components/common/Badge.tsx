import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'green' | 'blue' | 'purple' | 'amber' | 'red' | 'gray';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'gray', size = 'md' }) => {
  const styles = {
    green: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    blue: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    purple: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    amber: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    red: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    gray: 'bg-slate-800 text-slate-300 border-slate-700'
  };

  const sizeStyles = size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span className={`inline-flex items-center font-medium rounded-full border ${styles[variant]} ${sizeStyles}`}>
      {children}
    </span>
  );
};
