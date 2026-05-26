import React, { useRef, useState, useEffect, useId } from "react";

/**
 * Генерирует SVG path суперэллипса (squircle) — скруглённого прямоугольника
 * с плавным, непрерывным переходом кривизны (continuous curvature),
 * как в iOS / Figma corner smoothing.
 *
 * В отличие от CSS border-radius (четверть окружности), суперэллипс
 * использует формулу |x/a|^n + |y/b|^n = 1, где n > 2.
 * При n = 5 кривая проходит ближе к углу, а переход от прямой
 * грани к закруглению — плавнее и длиннее.
 */
function generateSquirclePath(
  w: number,
  h: number,
  r: number,
  n: number = 5,
  steps: number = 16
): string {
  r = Math.min(r, w / 2, h / 2);
  if (r <= 0 || w <= 0 || h <= 0) return "";

  const exp = 2 / n;

  function se(t: number): [number, number] {
    const cosT = Math.cos(t);
    const sinT = Math.sin(t);
    return [
      r * Math.sign(cosT) * Math.pow(Math.abs(cosT), exp),
      r * Math.sign(sinT) * Math.pow(Math.abs(sinT), exp),
    ];
  }

  function corner(cx: number, cy: number, startAngle: number): string {
    let s = "";
    for (let i = 0; i <= steps; i++) {
      const t = startAngle + (Math.PI / 2) * (i / steps);
      const [dx, dy] = se(t);
      s += `L${(cx + dx).toFixed(2)},${(cy + dy).toFixed(2)} `;
    }
    return s;
  }

  return [
    `M${r},0 `,
    `L${w - r},0 `,
    corner(w - r, r, -Math.PI / 2),      // top-right
    `L${w},${h - r} `,
    corner(w - r, h - r, 0),              // bottom-right
    `L${r},${h} `,
    corner(r, h - r, Math.PI / 2),        // bottom-left
    `L0,${r} `,
    corner(r, r, Math.PI),                // top-left
    "Z",
  ].join("");
}

interface SquircleProps {
  /** Corner radius in px (default 20) */
  radius?: number;
  /** Superellipse exponent: 2 = circle, 5 = iOS squircle, higher = more boxy */
  exponent?: number;
  /** Optional border color (CSS color string). Omit for no border */
  borderColor?: string;
  /** Border width in px (default 1) */
  borderWidth?: number;
  /** Background color (CSS). Applied inside the squircle clip */
  bg?: string;
  /** Extra classes for the outer wrapper */
  className?: string;
  /** Extra styles for the outer wrapper */
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function Squircle({
  radius = 20,
  exponent = 5,
  borderColor,
  borderWidth = 1,
  bg,
  className = "",
  style,
  children,
}: SquircleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
  const clipId = useId();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      setSize((prev) => {
        const w = Math.round(rect.width);
        const h = Math.round(rect.height);
        if (prev.w === w && prev.h === h) return prev;
        return { w, h };
      });
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const path = size.w > 0 && size.h > 0
    ? generateSquirclePath(size.w, size.h, radius, exponent)
    : "";

  return (
    <div ref={containerRef} className={`relative ${className}`} style={style}>
      {/* SVG defs: clip-path */}
      <svg
        width={0}
        height={0}
        className="absolute pointer-events-none"
        aria-hidden
      >
        <defs>
          <clipPath id={clipId}>
            <path d={path} />
          </clipPath>
        </defs>
      </svg>

      {/* Clipped content layer */}
      <div
        className="w-full h-full"
        style={{
          clipPath: path ? `url(#${clipId})` : undefined,
          background: bg,
        }}
      >
        {children}
      </div>

      {/* Border overlay (SVG stroke along the same squircle path) */}
      {borderColor && path && (
        <svg
          className="absolute inset-0 pointer-events-none"
          width={size.w}
          height={size.h}
          aria-hidden
        >
          <path
            d={path}
            fill="none"
            stroke={borderColor}
            strokeWidth={borderWidth}
          />
        </svg>
      )}
    </div>
  );
}

export { generateSquirclePath };
