import React from 'react';
import { cn } from '@/lib/utils';

const Input = React.forwardRef(({ className, type, icon, ...props }, ref) => {
  const hasIcon = Boolean(icon);
  return (
    <div className={cn('relative flex items-center w-full', className)}>
      {icon && <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">{React.cloneElement(icon, { className: "w-5 h-5"})}</span>}
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          hasIcon ? 'pl-10' : '',
          className
        )}
        ref={ref}
        {...props}
      />
    </div>
  );
});
Input.displayName = 'Input';

export { Input };