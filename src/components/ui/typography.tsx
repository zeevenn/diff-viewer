import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const typographyVariants = cva('', {
  variants: {
    variant: {
      h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
      h2: 'scroll-m-20 text-3xl font-semibold tracking-tight',
      h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
      h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
      p: 'leading-7 [&:not(:first-child)]:mt-6',
      lead: 'text-xl text-muted-foreground',
      large: 'text-lg font-semibold',
      small: 'text-sm font-medium leading-none',
      muted: 'text-sm text-muted-foreground',
      code: 'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
    },
  },
  defaultVariants: {
    variant: 'p',
  },
})

interface TypographyProps
  extends React.HTMLAttributes<HTMLElement>,
  VariantProps<typeof typographyVariants> {}

function Typography({ variant = 'p', className, ...props }: TypographyProps) {
  const classes = cn(typographyVariants({ variant, className }))

  switch (variant) {
    case 'h1':
      return <h1 data-slot="typography" className={classes} {...props} />
    case 'h2':
      return <h2 data-slot="typography" className={classes} {...props} />
    case 'h3':
      return <h3 data-slot="typography" className={classes} {...props} />
    case 'h4':
      return <h4 data-slot="typography" className={classes} {...props} />
    case 'small':
      return <small data-slot="typography" className={classes} {...props} />
    case 'code':
      return <code data-slot="typography" className={classes} {...props} />
    default:
      return <p data-slot="typography" className={classes} {...props} />
  }
}

export { Typography, typographyVariants }
