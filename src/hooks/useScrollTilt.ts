import { useScroll, useVelocity, useTransform, useSpring } from 'framer-motion';
import type { MotionValue } from 'framer-motion';

export function useScrollTilt(strength = 5): MotionValue<number> {
  const { scrollY } = useScroll();
  const velocity   = useVelocity(scrollY);
  const raw  = useTransform(velocity, [-2500, 0, 2500], [strength, 0, -strength]);
  return useSpring(raw, { stiffness: 400, damping: 40 });
}
