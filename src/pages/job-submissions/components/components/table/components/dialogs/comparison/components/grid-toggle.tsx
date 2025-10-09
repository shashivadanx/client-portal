'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export default function GridToggle({
  value,
  onChange,
}: {
  value: 2 | 3 | 4
  onChange: (v: 2 | 3 | 4) => void
}) {
  const options: Array<2 | 3 | 4> = [2, 3, 4]

  return (
    <div className='flex items-center gap-2'>
      <span className='text-sm text-muted-foreground'>Grid:</span>
      <div className='inline-flex rounded-md border bg-background p-1'>
        {options.map((opt) => {
          const pressed = value === opt
          return (
            <Button
              key={opt}
              type='button'
              size='sm'
              variant={pressed ? 'default' : 'ghost'}
              aria-pressed={pressed}
              className={cn(
                'min-w-9',
                // keep text readable when selected
                pressed && 'text-primary-foreground'
              )}
              onClick={() => onChange(opt)}
            >
              {opt}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
