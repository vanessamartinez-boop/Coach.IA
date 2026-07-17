import React from "react";
import { HelpCircle, Sparkles, AlertCircle } from "lucide-react";

interface CoachTipProps {
  title?: string;
  content: string;
  type?: "tip" | "warning" | "info";
}

export default function CoachTip({ title = "Dica do Coach", content, type = "tip" }: CoachTipProps) {
  const styles = {
    tip: {
      bg: "bg-blue-600/5",
      border: "border-blue-500/20",
      text: "text-blue-400",
      icon: Sparkles,
    },
    warning: {
      bg: "bg-amber-600/5",
      border: "border-amber-500/20",
      text: "text-amber-400",
      icon: AlertCircle,
    },
    info: {
      bg: "bg-slate-800/40",
      border: "border-slate-700/60",
      text: "text-slate-300",
      icon: HelpCircle,
    },
  };

  const activeStyle = styles[type] || styles.tip;
  const Icon = activeStyle.icon;

  return (
    <div className={`p-4 rounded-xl border ${activeStyle.bg} ${activeStyle.border} flex gap-3 text-left`}>
      <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${activeStyle.text}`} />
      <div>
        <h4 className={`text-xs font-semibold ${activeStyle.text} uppercase tracking-wider mb-1 font-display`}>
          {title}
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed font-light">
          {content}
        </p>
      </div>
    </div>
  );
}
