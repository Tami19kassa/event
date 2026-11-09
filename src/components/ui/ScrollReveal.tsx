"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  variant?: "fade-up" | "fade-in" | "scale-up" | "slide-left" | "slide-right";
  delayMs?: number;
  durationMs?: number;
  threshold?: number;
}

export function ScrollReveal({
  children,
  className = "",
  variant = "fade-up",
  delayMs = 0,
  durationMs = 600,
  threshold = 0.15,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // If user prefers reduced motion, show immediately
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsVisible(true);
      return;
    }

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  const getVariantStyles = () => {
    if (isVisible) {
      return "opacity-100 translate-x-0 translate-y-0 scale-100";
    }

    switch (variant) {
      case "fade-up":
        return "opacity-0 translate-y-7 scale-[0.99]";
      case "scale-up":
        return "opacity-0 scale-95";
      case "slide-left":
        return "opacity-0 -translate-x-8";
      case "slide-right":
        return "opacity-0 translate-x-8";
      case "fade-in":
      default:
        return "opacity-0";
    }
  };

  return (
    <div
      ref={ref}
      style={{
        transitionDuration: `${durationMs}ms`,
        transitionDelay: `${delayMs}ms`,
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      className={`transition-all will-change-transform ${getVariantStyles()} ${className}`}
    >
      {children}
    </div>
  );
}
