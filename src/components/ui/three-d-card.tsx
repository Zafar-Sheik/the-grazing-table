"use client";

import {
  createContext,
  useContext,
  useRef,
  useState,
  type ElementType,
  type ReactNode,
  type ComponentPropsWithoutRef,
} from "react";
import { cn } from "@/lib/utils";

/** Aceternity 3D Card: tilts toward the pointer, children pop forward via CardItem. */
const HoverCtx = createContext(false);

export function CardContainer({
  children,
  className,
  containerClassName,
}: {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 28;
    const y = (e.clientY - top - height / 2) / 28;
    el.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
  };

  const onLeave = () => {
    setHovered(false);
    if (ref.current) ref.current.style.transform = "rotateY(0deg) rotateX(0deg)";
  };

  return (
    <HoverCtx.Provider value={hovered}>
      <div className={cn("flex items-center justify-center", containerClassName)} style={{ perspective: "1200px" }}>
        <div
          ref={ref}
          onMouseEnter={() => setHovered(true)}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          className={cn("relative transition-transform duration-200 ease-linear", className)}
          style={{ transformStyle: "preserve-3d" }}
        >
          {children}
        </div>
      </div>
    </HoverCtx.Provider>
  );
}

export function CardBody({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("[transform-style:preserve-3d] [&>*]:[transform-style:preserve-3d]", className)}>
      {children}
    </div>
  );
}

type CardItemProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
  translateZ?: number;
  rotateZ?: number;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

export function CardItem<T extends ElementType = "div">({
  as,
  children,
  className,
  translateZ = 0,
  rotateZ = 0,
  ...rest
}: CardItemProps<T>) {
  const hovered = useContext(HoverCtx);
  const Tag = (as ?? "div") as ElementType;
  return (
    <Tag
      className={cn("w-fit transition duration-200 ease-linear", className)}
      style={{
        transform: hovered
          ? `translateZ(${translateZ}px) rotateZ(${rotateZ}deg)`
          : "translateZ(0px) rotateZ(0deg)",
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
