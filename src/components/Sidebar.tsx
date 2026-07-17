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
    <aside id="app-sidebar" className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col justify-between h-full shrink-0">
      <div className="p-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 p-2.5 rounded-xl shadow-lg shadow-blue-500/20">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl tracking-tight text-white leading-tight">
              Interview Coach <span className="text-blue-400">AI</span>
            </h1>
            <span className="text-[10px] font-mono tracking-wider text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700 uppercase">
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
                className={`w-full flex items-start gap-3.5 px-4 py-3.5 rounded-xl transition-all text-left group ${
                  isActive
                    ? "bg-blue-600/10 border-l-4 border-blue-500 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border-l-4 border-transparent"
                }`}
              >
                <Icon
                  className={`w-5 h-5 mt-0.5 shrink-0 transition-transform duration-200 ${
                    isActive ? "text-blue-400" : "text-slate-500 group-hover:text-slate-400"
                  }`}
                />
                <div>
                  <div className="font-medium text-sm text-slate-100">{item.name}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5 font-light">
                    {item.description}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Coach Box */}
      <div className="p-6 border-t border-slate-800/80 bg-slate-950/40">
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs font-medium text-slate-300">Sua Mentalidade de Hoje</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed font-light">
            "A ansiedade diminui onde a preparação aumenta. Foque nas ações concretas que tomou e no valor gerado."
          </p>
        </div>
        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-800/80">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center border border-slate-600 text-slate-300 text-xs font-semibold">
            IC
          </div>
          <div className="truncate">
            <div className="text-xs font-medium text-slate-200">Coach Mentor</div>
            <div className="text-[10px] text-slate-400 truncate">SaaS Premium Edition</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
