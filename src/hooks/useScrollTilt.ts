import { useScroll, useVelocity, useTransform, useSpring, useReducedMotion } from 'framer-motion';
import type { MotionValue } from 'framer-motion';

/** Rotates a section heading a few degrees against the scroll velocity, so the
 *  type leans as the page moves and settles when it stops.
 *
 *  It is driven by velocity rather than position, which makes it exactly the
 *  kind of motion `prefers-reduced-motion` exists for: the heading tips because
 *  the viewport is moving, not because anything changed. Under the setting the
 *  hook returns a spring pinned at zero — callers still bind `rotateX` to a
 *  motion value, so nothing at the call site has to know.
 */
export function useScrollTilt(strength = 5): MotionValue<number> {
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const raw = useTransform(velocity, [-2500, 0, 2500], [strength, 0, -strength]);
  const flat = useTransform(velocity, () => 0);
  return useSpring(reduced ? flat : raw, { stiffness: 400, damping: 40 });
}
