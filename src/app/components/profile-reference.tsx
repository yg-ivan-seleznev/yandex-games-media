import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import Component from "../../imports/Профиль";
import { GlassButton } from "./glass-card";

const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 2530;

export function ProfileReference() {
  const navigate = useNavigate();
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      const vw = window.innerWidth;
      setScale(Math.min(vw / DESIGN_WIDTH, 1));
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#141414] overflow-x-hidden relative">
      {/* Floating back button */}
      <div className="fixed top-[16px] left-[16px] z-50">
        <GlassButton
          onClick={() => navigate("/")}
          className="px-[20px] py-[12px] flex items-center gap-[10px]"
        >
          <ArrowLeft size={18} className="text-white/80" />
          <span className="font-['YS_Text',sans-serif] text-[15px] text-white/80" style={{ fontWeight: 500 }}>
            Discovery
          </span>
        </GlassButton>
      </div>

      {/* Fixed label */}
      <div className="fixed top-[16px] left-1/2 -translate-x-1/2 z-50">
        <div className="relative rounded-full overflow-hidden px-[20px] py-[8px]">
          <div className="absolute inset-0 bg-[#f09]/20 backdrop-blur-[16px] rounded-full" />
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              padding: "1px",
              background: "linear-gradient(135deg, rgba(255,0,153,0.4) 0%, transparent 40%, transparent 60%, rgba(255,0,153,0.4) 100%)",
              WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
          />
          <span className="relative z-10 font-['YS_Text',sans-serif] text-[13px] text-[#f09]" style={{ fontWeight: 500 }}>
            Дизайн-референс · pointer-events-none
          </span>
        </div>
      </div>

      <div
        style={{
          width: DESIGN_WIDTH,
          height: DESIGN_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          marginBottom: DESIGN_HEIGHT * scale - DESIGN_HEIGHT + "px",
        }}
        className="relative pointer-events-none select-none"
      >
        <Component />
      </div>
    </div>
  );
}
