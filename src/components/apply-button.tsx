import { Button } from '@/components/ui/button';
import { Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ApplyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  status: 'idle' | 'loading' | 'success';
}

export function ApplyButton({ className, status, ...props }: ApplyButtonProps) {
  return (
    <Button
      type="submit"
      className={cn(
        'relative transition-all duration-300',

        className
      )}
      disabled={status !== 'idle'}
      {...props}
    >
      <span
        className={cn(
          'flex items-center gap-2 transition-opacity duration-200',
          status !== 'idle' && 'opacity-0'
        )}
      >
        Apply
      </span>
      
      {status === 'loading' && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      )}
      
      {status === 'success' && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Check className="h-5 w-5 animate-in zoom-in duration-300" />
        </div>
      )}
    </Button>
  );
}