'use client';

import React, { useRef, useEffect } from 'react';


// Magnetic Button component with low latency animations
interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}


export function MagneticButton({ children, className, ...props }: MagneticButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const btn = btnRef.current;
    const inner = innerRef.current;
    if (!btn || !inner) return;

    const magneticStrength = 0.3;
    const innerStrength = 0.5;
    let mouseX = 0;
    let mouseY = 0;
    let btnX = 0;
    let btnY = 0;
    let innerX = 0;
    let innerY = 0;
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      mouseX = e.clientX - rect.left - rect.width / 2;
      mouseY = e.clientY - rect.top - rect.height / 2;
    };

    const handleMouseLeave = () => {
      mouseX = 0;
      mouseY = 0;
    };

    btn.addEventListener('mousemove', handleMouseMove);
    btn.addEventListener('mouseleave', handleMouseLeave);

    const animate = () => {
      btnX += (mouseX * magneticStrength - btnX) * 0.15;
      btnY += (mouseY * magneticStrength - btnY) * 0.15;
      innerX += (mouseX * innerStrength - innerX) * 0.15;
      innerY += (mouseY * innerStrength - innerY) * 0.15;
      btn.style.transform = `translate(${btnX}px, ${btnY}px)`;
      inner.style.transform = `translate(${innerX}px, ${innerY}px)`;
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      btn.removeEventListener('mousemove', handleMouseMove);
      btn.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <button ref={btnRef} className={`magnetic-btn ${className || ''}`} {...props}>
      <span ref={innerRef} className="magnetic-btn-inner">
        {children}
      </span>
    </button>
  );
}