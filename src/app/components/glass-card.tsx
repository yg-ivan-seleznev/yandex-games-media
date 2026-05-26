import React from "react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  as?: "div" | "button" | "article";
  hover?: boolean;
}

export function GlassCard({
  children,
  className = "",
  onClick,
  as: Tag = "div",
  hover = false,
}: GlassCardProps) {
  return (
    <Tag
      onClick={onClick}
      className={`relative rounded-[24px] overflow-hidden ${
        hover
          ? "cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
          : ""
      } ${className}`}
    >
      {/* Glass background */}
      <div className="absolute inset-0 bg-white/[0.06] backdrop-blur-[16px] rounded-[24px]" />
      {/* Gradient border (refraction effect) */}
      <div
        className="absolute inset-0 rounded-[24px] pointer-events-none"
        style={{
          padding: "1px",
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.32) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.32) 100%)",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      {/* Inset shadow highlight */}
      <div className="absolute inset-0 rounded-[24px] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] pointer-events-none" />
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </Tag>
  );
}

interface GlassBadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function GlassBadge({ children, className = "" }: GlassBadgeProps) {
  return (
    <div
      className={`relative inline-flex items-center rounded-full overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 bg-white/[0.1] backdrop-blur-[12px] rounded-full" />
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          padding: "1px",
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.24) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.24) 100%)",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      <span className="relative z-10">{children}</span>
    </div>
  );
}

interface GlassButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  active?: boolean;
}

export function GlassButton({
  children,
  className = "",
  onClick,
  active = false,
}: GlassButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`relative rounded-[16px] overflow-hidden cursor-pointer transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] ${className}`}
    >
      <div
        className={`absolute inset-0 backdrop-blur-[16px] rounded-[16px] ${
          active ? "bg-white/[0.16]" : "bg-white/[0.06]"
        }`}
      />
      <div
        className="absolute inset-0 rounded-[16px] pointer-events-none"
        style={{
          padding: "1px",
          background: active
            ? "linear-gradient(135deg, rgba(255,255,255,0.48) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.48) 100%)"
            : "linear-gradient(135deg, rgba(255,255,255,0.24) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.24) 100%)",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      <div className="absolute inset-0 rounded-[16px] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] pointer-events-none" />
      <span className="relative z-10">{children}</span>
    </button>
  );
}
