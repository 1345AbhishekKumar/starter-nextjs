'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';

interface MagneticButtonProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  'onClick'
> {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export function MagneticButton({
  children,
  className,
  href,
  onClick,
  type = 'button',
  disabled = false,
  ...props
}: MagneticButtonProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  const innerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const inner = innerRef.current;
    if (!container || !inner) return;

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
      const rect = container.getBoundingClientRect();
      mouseX = e.clientX - rect.left - rect.width / 2;
      mouseY = e.clientY - rect.top - rect.height / 2;
    };

    const handleMouseLeave = () => {
      mouseX = 0;
      mouseY = 0;
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    const animate = () => {
      btnX += (mouseX * magneticStrength - btnX) * 0.15;
      btnY += (mouseY * magneticStrength - btnY) * 0.15;
      innerX += (mouseX * innerStrength - innerX) * 0.15;
      innerY += (mouseY * innerStrength - innerY) * 0.15;
      container.style.transform = `translate(${btnX}px, ${btnY}px)`;
      inner.style.transform = `translate(${innerX}px, ${innerY}px)`;
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const sharedClasses = `magnetic-btn ${className || ''}`;

  const setRef = (node: HTMLElement | null) => {
    containerRef.current = node;
  };

  if (href) {
    return (
      <Link
        href={href}
        ref={setRef as React.Ref<HTMLAnchorElement>}
        className={sharedClasses}
        onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>}
        {...props}
      >
        <span ref={innerRef} className='magnetic-btn-inner'>
          {children}
        </span>
      </Link>
    );
  }

  return (
    <button
      ref={setRef as React.Ref<HTMLButtonElement>}
      className={sharedClasses}
      onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
      type={type}
      disabled={disabled}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      <span ref={innerRef} className='magnetic-btn-inner'>
        {children}
      </span>
    </button>
  );
}
