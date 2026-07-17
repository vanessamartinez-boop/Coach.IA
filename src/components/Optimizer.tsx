import React, { useState, useEffect } from "react";
import { 
  Sparkles, Loader2, Copy, Check, Info, FileText, 
  HelpCircle, ArrowRight, MessageSquare, AlertCircle, RefreshCw 
} from "lucide-react";
import { STARResponse } from "../types";
import CoachTip from "./CoachTip";

interface OptimizerProps {
  initialQuestion: string;
  initialDraft: string;
  clearPrefills: () => void;
}

export default function Optimizer({ initialQuestion, initialDraft, clearPrefills }: OptimizerProps) {
  // Input State
  const [question, setQuestion] = useState("");
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  // Results State
  const [optimized, setOptimized] = useState<STARResponse | null>(null);
  const [copiedText, setCopiedText] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prefill when redirected from Simulator
  useEffect(() => {
    if (initialQuestion || initialDraft) {
      setQuestion(initialQuestion);
      setDraft(initialDraft);
      setError(null);
      // Automatically trigger optimization if we have a draft sent
      if (initialDraft) {
        handleOptimizeDirectly(initialQuestion, initialDraft);
      }
      clearPrefills();
    }
  }, [initialQuestion, initialDraft]);

  // Loading messages rotation
  const loadingMessages = [
    "Refinando seu discurso profissional...",
    "Estruturando a Situação e contexto inicial...",
    "Definindo a Tarefa e responsabilidade crucial...",
    "Evidenciando suas Ações de protagonismo estratégico...",
    "Formatando Resultados qualitativos e quantitativos...",
    "Finalizando a Dica do Coach para sua apresentação...",
    "Polindo como um diamante bruto..."
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 2500);
    } else {
      setLoadingMessageIndex(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleOptimizeDirectly = async (q: string, d: string) => {
    setLoading(true);
    setError(null);
    setOptimized(null);

    try {
      const response = await fetch("/api/optimize-star", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, draft: d }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Ocorreu um erro ao otimizar sua resposta.");
      }

      setOptimized(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erro de conexão com o servidor. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleOptimize = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    handleOptimizeDirectly(question, draft);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-display font-bold text-slate-800 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-indigo-600" />
          Otimizador de Respostas (Método STAR)
        </h2>
        <p className="text-sm text-slate-500 mt-1 font-light">
          Insira sua história profissional bagunçada ou rascunho de resposta e assista à IA estruturar tudo sob a técnica STAR (Situação, Tarefa, Ação e Resultado).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form / STAR Education */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <h3 className="text-base font-semibold text-slate-800 mb-4 font-display flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Lapidador de Relatos
            </h3>

            <form onSubmit={handleOptimize} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Pergunta da Entrevista (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Conte sobre um projeto desafiador que você entregou..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:bg-white outline-none text-sm text-slate-800 transition-all font-light"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex justify-between">
                  <span>Seu Rascunho / História &quot;Bagunçada&quot; *</span>
                  <span className="text-slate-400 lowercase font-normal">Pode escrever à vontade</span>
                </label>
                <textarea
                  placeholder="Ex: A gente tinha um bug muito chato em produção que estava quebrando o checkout. Eu peguei os logs da AWS, vi que tinha um token que expirou, reconfigurei, e resolveu tudo. O chefe me elogiou bastante..."
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  disabled={loading}
                  rows={6}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:bg-white outline-none text-sm text-slate-800 transition-all font-light resize-none"
                  required
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-700 rounded-xl text-xs flex gap-2 items-start leading-relaxed">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Erro:</span> {error}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !draft.trim()}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold rounded-xl shadow-md shadow-indigo-100 hover:shadow-indigo-200 hover:shadow-lg transition-all text-sm flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-200" />
                    <span>{loadingMessages[loadingMessageIndex]}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Otimizar Resposta</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Coach Advice box */}
          <CoachTip
            title="Por que o Método STAR funciona?"
            content="O STAR é o padrão ouro de entrevistas corporativas porque elimina o 'achismo'. Ele força o candidato a provar competências reais demonstrando causa e efeito. Um recrutador sênior quer ouvir o que VOCÊ fez (Ação) e o impacto mensurável (Resultado), não apenas teoria."
          />

          {/* Educational Cheat Sheet */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-indigo-600" />
              Sua Cola para o Sucesso: STAR
            </h4>
            <div className="space-y-3">
              <div className="flex gap-2.5 items-start">
                <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-mono text-[10px] font-bold shrink-0 mt-0.5 border border-blue-100">S</div>
                <div>
                  <div className="text-xs font-bold text-slate-800">Situação</div>
                  <div className="text-[11px] text-slate-500 font-light mt-0.5">Explique o cenário desafiador de forma curta. Qual era o problema?</div>
                </div>
              </div>
              <div className="flex gap-2.5 items-start">
                <div className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center font-mono text-[10px] font-bold shrink-0 mt-0.5 border border-indigo-100">T</div>
                <div>
                  <div className="text-xs font-bold text-slate-800">Tarefa</div>
                  <div className="text-[11px] text-slate-500 font-light mt-0.5">O que cabia a você resolver? Qual era a sua meta pessoal?</div>
                </div>
              </div>
              <div className="flex gap-2.5 items-start">
                <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-mono text-[10px] font-bold shrink-0 mt-0.5 border border-emerald-100">A</div>
                <div>
                  <div className="text-xs font-bold text-slate-800">Ação</div>
                  <div className="text-[11px] text-slate-500 font-light mt-0.5">Diga exatamente quais ações estratégicas você tomou. Foque no SEU protagonismo.</div>
                </div>
              </div>
              <div className="flex gap-2.5 items-start">
                <div className="w-5 h-5 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center font-mono text-[10px] font-bold shrink-0 mt-0.5 border border-amber-100">R</div>
                <div>
                  <div className="text-xs font-bold text-slate-800">Resultado</div>
                  <div className="text-[11px] text-slate-500 font-light mt-0.5">Mostre o valor final gerado com métricas, eficiência ou feedbacks tangíveis.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Optimized Results Display */}
        <div className="lg:col-span-7 space-y-6">
          {loading && (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm flex flex-col items-center justify-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-indigo-600 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-indigo-600 animate-pulse" />
                </div>
              </div>
              <div>
                <h4 className="font-display font-bold text-slate-800 text-lg">
                  Lapidando seu Discurso de Carreira
                </h4>
                <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto font-light leading-relaxed">
                  "{loadingMessages[loadingMessageIndex]}"
                </p>
              </div>
            </div>
          )}

          {!loading && !optimized && (
            <div className="bg-white border border-slate-200 border-dashed rounded-2xl p-12 text-center shadow-sm">
              <div className="mx-auto w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-slate-400" />
              </div>
              <h4 className="font-display font-bold text-slate-700 text-base">
                Aguardando História
              </h4>
              <p className="text-xs text-slate-400 mt-2 max-w-xs mx-auto leading-relaxed font-light">
                Forneça o rascunho de resposta ou relato na coluna à esquerda para acionar a lapidação profissional de IA.
              </p>
            </div>
          )}

          {!loading && optimized && (
            <div className="space-y-6">
              {/* Core STAR Blocks */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Estrutura Pedagógica (As 4 Partes)
                </h3>

                {/* S - Situation */}
                <div className="bg-white border border-slate-200 hover:border-blue-300 rounded-2xl p-5 transition-all shadow-xs">
                  <div className="flex gap-3.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center font-mono text-xs font-bold shrink-0">
                      S
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wider">
                        Situação (O Cenário)
                      </h4>
                      <p className="text-xs text-slate-700 leading-relaxed font-light mt-1.5">
                        {optimized.situation}
                      </p>
                    </div>
                  </div>
                </div>

                {/* T - Task */}
                <div className="bg-white border border-slate-200 hover:border-indigo-300 rounded-2xl p-5 transition-all shadow-xs">
                  <div className="flex gap-3.5">
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center justify-center font-mono text-xs font-bold shrink-0">
                      T
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-indigo-800 uppercase tracking-wider">
                        Tarefa (A Missão)
                      </h4>
                      <p className="text-xs text-slate-700 leading-relaxed font-light mt-1.5">
                        {optimized.task}
                      </p>
                    </div>
                  </div>
                </div>

                {/* A - Action */}
                <div className="bg-white border border-slate-200 hover:border-emerald-300 rounded-2xl p-5 transition-all shadow-xs">
                  <div className="flex gap-3.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center font-mono text-xs font-bold shrink-0">
                      A
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                        Ação (Seu Protagonismo)
                      </h4>
                      <p className="text-xs text-slate-700 leading-relaxed font-light mt-1.5">
                        {optimized.action}
                      </p>
                    </div>
                  </div>
                </div>

                {/* R - Result */}
                <div className="bg-white border border-slate-200 hover:border-amber-300 rounded-2xl p-5 transition-all shadow-xs">
                  <div className="flex gap-3.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center font-mono text-xs font-bold shrink-0">
                      R
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                        Resultado (Impacto Mensurável)
                      </h4>
                      <p className="text-xs text-slate-700 leading-relaxed font-light mt-1.5">
                        {optimized.result}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Consolidated final narrative */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Discurso Final Consolidado
                    </h3>
                  </div>
                  <button
                    onClick={() => copyToClipboard(optimized.fullOptimized)}
                    className="py-1.5 px-3 hover:bg-slate-50 text-slate-600 hover:text-slate-800 rounded-lg transition-all text-xs flex items-center gap-1.5 border border-slate-200 cursor-pointer shadow-xs"
                  >
                    {copiedText ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600 font-medium">Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Resposta</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-6 bg-white">
                  <p className="text-sm text-slate-800 leading-relaxed font-light whitespace-pre-wrap">
                    {optimized.fullOptimized}
                  </p>
                </div>
              </div>

              {/* Coaching Tip card */}
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 shadow-xs">
                <div className="flex gap-4">
                  <div className="p-2.5 bg-indigo-100 rounded-xl shrink-0 h-fit">
                    <MessageSquare className="w-5 h-5 text-indigo-700" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-indigo-900 font-display">
                      Postura e Entrega (Dica do Coach)
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed font-light mt-1.5">
                      {optimized.coachingTip}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
