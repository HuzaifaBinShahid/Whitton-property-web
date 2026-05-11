import { motion, type HTMLMotionProps } from 'framer-motion';
import { forwardRef } from 'react';
import { motion as tokens } from '@/theme/tokens';

type Props = HTMLMotionProps<'button'>;

export const AnimatedPressable = forwardRef<HTMLButtonElement, Props>(function AnimatedPressable(
  { children, ...rest },
  ref,
) {
  return (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.97 }}
      transition={tokens.press}
      {...rest}
    >
      {children}
    </motion.button>
  );
});
