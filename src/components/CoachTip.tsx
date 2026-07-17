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
      bg: "bg-blue-50",
      border: "border-blue-100",
      titleText: "text-blue-900",
      bodyText: "text-blue-800",
      iconColor: "text-blue-600",
      icon: Sparkles,
    },
    warning: {
      bg: "bg-amber-50",
      border: "border-amber-100",
      titleText: "text-amber-900",
      bodyText: "text-amber-800",
      iconColor: "text-amber-700",
      icon: AlertCircle,
    },
    info: {
      bg: "bg-slate-100",
      border: "border-slate-200",
      titleText: "text-slate-900",
      bodyText: "text-slate-600",
      iconColor: "text-slate-500",
      icon: HelpCircle,
    },
  };

  const activeStyle = styles[type] || styles.tip;
  const Icon = activeStyle.icon;

  return (
    <div className={`p-5 rounded-2xl border ${activeStyle.bg} ${activeStyle.border} flex gap-4 text-left shadow-xs`}>
      <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${activeStyle.iconColor}`} />
      <div>
        <h4 className={`text-sm font-bold ${activeStyle.titleText} mb-1 font-display`}>
          {title}
        </h4>
        <p className={`text-xs ${activeStyle.bodyText} leading-relaxed font-light`}>
          {content}
        </p>
      </div>
    </div>
  );
}
