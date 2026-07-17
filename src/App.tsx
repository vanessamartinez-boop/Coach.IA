import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Simulator from "./components/Simulator";
import Optimizer from "./components/Optimizer";
import Guide from "./components/Guide";
import { Brain, Menu, X, Sparkles, HelpCircle } from "lucide-react";

export default function App() {
  const [currentTab, setCurrentTab] = useState("simulator");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // States for cross-component pre-filling
  const [optimizerQuestion, setOptimizerQuestion] = useState("");
  const [optimizerDraft, setOptimizerDraft] = useState("");

  const handleSendToOptimizer = (question: string, draft: string) => {
    setOptimizerQuestion(question);
    setOptimizerDraft(draft);
    setCurrentTab("optimizer");
  };

  const clearOptimizerPrefills = () => {
    setOptimizerQuestion("");
    setOptimizerDraft("");
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 z-40">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-lg text-white">Interview Coach AI</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Sidebar - Desktop & Mobile overlay */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <Sidebar
          currentTab={currentTab}
          setCurrentTab={(tab) => {
            setCurrentTab(tab);
            setMobileMenuOpen(false);
          }}
        />
      </div>

      {/* Mobile overlay backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
        />
      )}

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header - Desktop only */}
        <header className="hidden lg:flex h-16 border-b border-slate-200 bg-white items-center justify-between px-8 shrink-0 shadow-xs z-10">
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500 font-medium">
              Dashboard / {currentTab === "simulator" ? "Simulador de Entrevista" : currentTab === "optimizer" ? "Otimizador STAR" : "Guia de Preparação"}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="text-right">
              <p className="font-semibold text-slate-800">Candidato de Sucesso</p>
              <p className="text-xs text-slate-500">Premium Member</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold font-display">
              CS
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto pt-20 lg:pt-8 px-6 lg:px-10 pb-12 w-full">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Active Tab View */}
            {currentTab === "simulator" && (
              <Simulator onSendToOptimizer={handleSendToOptimizer} />
            )}

            {currentTab === "optimizer" && (
              <Optimizer
                initialQuestion={optimizerQuestion}
                initialDraft={optimizerDraft}
                clearPrefills={clearOptimizerPrefills}
              />
            )}

            {currentTab === "guide" && <Guide />}
          </div>
        </main>
      </div>
    </div>
  );
}
