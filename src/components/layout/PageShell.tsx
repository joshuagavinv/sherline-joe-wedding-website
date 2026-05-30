import { cn } from '@/lib/utils'

interface PageShellProps {
  children: React.ReactNode
  className?: string
}

export function PageShell({ children, className }: PageShellProps) {
  return (
    <div className="w-full flex justify-center">
      <div className={cn('w-full max-w-canvas', className)}>{children}</div>
    </div>
  )
}
