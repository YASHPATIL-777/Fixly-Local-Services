import React, { useEffect, useState } from 'react';
import { useInView } from 'framer-motion';

export default function AnimatedCounter({ value, duration = 1.5, prefix = '', suffix = '' }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    // Check if numeric or float
    const numericTarget = parseFloat(value);
    if (isNaN(numericTarget)) {
      setDisplayValue(value);
      return;
    }

    const isFloat = value.toString().includes('.');
    const steps = 40;
    const increment = numericTarget / steps;
    let current = 0;
    const stepTime = (duration * 1000) / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= numericTarget) {
        setDisplayValue(numericTarget);
        clearInterval(timer);
      } else {
        setDisplayValue(current);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isInView, value, duration]);

  const formatted = typeof displayValue === 'number'
    ? (value.toString().includes('.') ? displayValue.toFixed(1) : Math.floor(displayValue))
    : displayValue;

  return (
    <span ref={ref} className="inline-block">
      {prefix}{formatted}{suffix}
    </span>
  );
}
