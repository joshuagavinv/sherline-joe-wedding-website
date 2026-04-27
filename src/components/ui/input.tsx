import * as React from 'react'
import { cn } from '@/lib/utils'

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full border border-wedding-dark-brown/30 bg-white px-3 py-2 font-sans text-body text-wedding-dark-brown placeholder:text-wedding-dark-brown/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-wedding-warm-brown disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      ref={ref}
      {...props}
    />
  )
)
Input.displayName = 'Input'

export { Input }
