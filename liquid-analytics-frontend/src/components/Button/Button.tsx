// src/components/Button/Button.tsx
import { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'new';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}: ButtonProps) => {
  const baseStyles = 'font-medium rounded-lg transition-all duration-200 hover:ring-2 hover:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-indigo-600 hover:ring-indigo-500 text-white ',
    secondary: 'bg-emerald-600 hover:ring-emerald-500 text-white',
    outline: 'border-2 border-indigo-600 text-indigo-600 hover:ring-indigo-500 ',
    new: "border-2 bg-red-600 border-indigo-600 text-white hover:ring-indigo-500"
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      className={`
        ${baseStyles} 
        ${variants[variant]} 
        ${sizes[size]}
        ${className}
        shadow-sm
        hover:shadow-md
        active:scale-95
      `}
      {...props}
    >
      {children}
    </button>
  );
};