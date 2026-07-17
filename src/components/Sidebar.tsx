import React from "react";
import { Brain, Briefcase, Sparkles, BookOpen, User, HelpCircle } from "lucide-react";

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export default function Sidebar({ currentTab, setCurrentTab }: SidebarProps) {
  const menuItems = [
    {
      id: "simulator",
      name: "Simulador de Entrevista",
      icon: Briefcase,
      description: "Perguntas personalizadas por cargo",
    },
    {
      id: "optimizer",
      name: "Otimizador STAR",
      icon: Sparkles,
      description: "Lapide seus relatos de carreira",
    },
    {
      id: "guide",
      name: "Guia de Preparação",
      icon: BookOpen,
      description: "Dicas de coaching e método STAR",
    },
  ];

  return (
    <aside id="app-sidebar" className="w-80 bg-white border-r border-slate-200 flex flex-col justify-between h-full shrink-0">
      <div className="p-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-indigo-50 border border-indigo-100 p-2.5 rounded-xl">
            <Brain className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl tracking-tight text-slate-800 leading-tight">
              Interview Coach <span className="text-indigo-600">AI</span>
            </h1>
            <span className="text-[10px] font-mono tracking-wider text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200 uppercase">
              Recrutador Sênior
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-tab-${item.id}`}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-start gap-3.5 px-4 py-3 rounded-xl transition-all text-left group border-l-4 ${
                  isActive
                    ? "bg-indigo-50/60 border-indigo-600 text-indigo-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50 border-transparent"
                }`}
              >
                <Icon
                  className={`w-5 h-5 mt-0.5 shrink-0 transition-transform duration-200 ${
                    isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
                  }`}
                />
                <div>
                  <div className={`font-semibold text-sm ${isActive ? "text-indigo-950" : "text-slate-700"}`}>{item.name}</div>
                  <div className={`text-[11px] mt-0.5 font-light ${isActive ? "text-indigo-700/80" : "text-slate-500"}`}>
                    {item.description}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Coach Box */}
      <div className="p-6 border-t border-slate-100 bg-slate-50/50">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs font-bold text-slate-700">Sua Mentalidade de Hoje</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed font-light">
            &quot;A ansiedade diminui onde a preparação aumenta. Foque nas ações concretas que tomou e no valor gerado.&quot;
          </p>
        </div>
        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center border border-slate-300 text-slate-600 text-xs font-semibold">
            IC
          </div>
          <div className="truncate">
            <div className="text-xs font-semibold text-slate-800">Coach Mentor</div>
            <div className="text-[10px] text-slate-500 truncate">SaaS Premium Edition</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
