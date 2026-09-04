import React, { useEffect, useRef, useState } from 'react';
import { useInView, animate } from 'framer-motion';

export default function AnimatedCountUp({ target, duration = 2, prefix = '', suffix = '', decimals = 0 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(0, target, {
      duration,
      ease: [0.16, 1, 0.3, 1], // Smooth exponential ease-out
      onUpdate: (value) => {
        setCount(value);
      }
    });

    return () => controls.stop();
  }, [isInView, target, duration]);

  const formattedCount = count.toFixed(decimals);

  return (
    <span ref={ref}>
      {prefix}
      {formattedCount}
      {suffix}
    </span>
  );
}
