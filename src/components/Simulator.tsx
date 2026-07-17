import React, { useState, useEffect } from "react";
import { 
  Briefcase, Sparkles, Loader2, Copy, Check, ChevronDown, 
  ChevronUp, HelpCircle, AlertCircle, RefreshCw, ArrowRight, Brain 
} from "lucide-react";
import { Question } from "../types";
import CoachTip from "./CoachTip";

interface SimulatorProps {
  onSendToOptimizer: (question: string, draft: string) => void;
}

export default function Simulator({ onSendToOptimizer }: SimulatorProps) {
  // Form State
  const [role, setRole] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  
  // Results State
  const [questions, setQuestions] = useState<Question[]>([]);
  const [roleTitle, setRoleTitle] = useState("");
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>("q1");
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // History State
  const [history, setHistory] = useState<{ role: string; questions: Question[]; timestamp: string }[]>([]);

  // Messages to cycle through during Gemini API calls
  const loadingMessages = [
    "Analisando perfil do recrutador...",
    "Definindo os maiores desafios do cargo...",
    "Estruturando 2 perguntas técnicas sob medida...",
    "Elaborando 2 situações comportamentais realistas...",
    "Preparando 1 pergunta curva de raciocínio lateral...",
    "Limpando o briefing de entrevista..."
  ];

  useEffect(() => {
    // Load simulation history from localStorage
    const saved = localStorage.getItem("interview_coach_simulations");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Cycle loading messages
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

  const handleGenerateQuestions = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role.trim()) return;

    setLoading(true);
    setError(null);
    setQuestions([]);

    try {
      const response = await fetch("/api/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, description }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Ocorreu um erro ao gerar perguntas.");
      }

      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        setRoleTitle(role);
        setExpandedQuestion(data.questions[0].id); // expand first by default
        setUserAnswers({});

        // Save to history
        const newHistoryItem = {
          role,
          questions: data.questions,
          timestamp: new Date().toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        const updatedHistory = [newHistoryItem, ...history.slice(0, 4)];
        setHistory(updatedHistory);
        localStorage.setItem("interview_coach_simulations", JSON.stringify(updatedHistory));
      } else {
        throw new Error("O formato das perguntas retornadas é inválido.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erro de conexão com o servidor. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const selectHistoryItem = (item: { role: string; questions: Question[] }) => {
    setQuestions(item.questions);
    setRoleTitle(item.role);
    setRole(item.role);
    setExpandedQuestion(item.questions[0]?.id || null);
    setUserAnswers({});
    setError(null);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("interview_coach_simulations");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-display font-bold text-slate-800 flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-blue-600" />
          Simulador de Perguntas de Recrutador
        </h2>
        <p className="text-sm text-slate-500 mt-1 font-light">
          Simule o processo seletivo de ponta com um Recrutador Sênior e Exigente. Obtenha perguntas exclusivas sob medida para sua vaga.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form / History */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <h3 className="text-base font-semibold text-slate-800 mb-4 font-display flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              Configurar Entrevista
            </h3>

            <form onSubmit={handleGenerateQuestions} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Cargo Almejado *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Engenheiro de Software Frontend, Gerente de Produto Sênior..."
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:bg-white outline-none text-sm text-slate-800 transition-all font-light"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex justify-between">
                  <span>Descrição da Vaga ou Cargo (Opcional)</span>
                  <span className="text-slate-400 lowercase font-normal">Recomendado</span>
                </label>
                <textarea
                  placeholder="Cole aqui os requisitos, responsabilidades ou competências pedidas na vaga para gerar perguntas cirúrgicas e ultra-personalizadas..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={loading}
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:bg-white outline-none text-sm text-slate-800 transition-all font-light resize-none"
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
                disabled={loading || !role.trim()}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold rounded-xl shadow-md shadow-blue-100 hover:shadow-blue-200 hover:shadow-lg transition-all text-sm flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-blue-200" />
                    <span>{loadingMessages[loadingMessageIndex]}</span>
                  </>
                ) : (
                  <>
                    <Briefcase className="w-4 h-4" />
                    <span>Iniciar Simulação</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Coach Advice for Simulator */}
          <CoachTip
            title="Dicas do Coach: Simulador de Recrutador"
            content="Recrutadores exigentes procuram avaliar não apenas sua capacidade de fazer o trabalho (Técnica), mas como você lida com frustração, equipe e mudança (Comportamental). As perguntas curva avaliam sua plasticidade neural e se você sabe pensar alto sob pressão."
          />

          {/* Session History list */}
          {history.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Histórico de Simulações
                </h4>
                <button
                  onClick={clearHistory}
                  className="text-[11px] text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Limpar tudo
                </button>
              </div>
              <div className="space-y-2">
                {history.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => selectHistoryItem(item)}
                    className="w-full p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 rounded-xl transition-all text-left flex justify-between items-center group"
                  >
                    <div className="truncate pr-2">
                      <div className="text-xs font-semibold text-slate-700 group-hover:text-blue-600 transition-colors truncate">
                        {item.role}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{item.timestamp}</div>
                    </div>
                    <RefreshCw className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Questions and Interaction */}
        <div className="lg:col-span-7 space-y-6">
          {loading && (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm flex flex-col items-center justify-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-blue-600 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-blue-600 animate-pulse" />
                </div>
              </div>
              <div>
                <h4 className="font-display font-bold text-slate-800 text-lg">
                  Preparando Entrevista de Alta Performance
                </h4>
                <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto font-light leading-relaxed">
                  "{loadingMessages[loadingMessageIndex]}"
                </p>
              </div>
            </div>
          )}

          {!loading && questions.length === 0 && (
            <div className="bg-white border border-slate-200 border-dashed rounded-2xl p-12 text-center shadow-sm">
              <div className="mx-auto w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-slate-400" />
              </div>
              <h4 className="font-display font-bold text-slate-700 text-base">
                Nenhum Cenário Ativo
              </h4>
              <p className="text-xs text-slate-400 mt-2 max-w-xs mx-auto leading-relaxed font-light">
                Insira o cargo que você deseja simular na coluna ao lado para gerar as 5 perguntas desafiadoras do Recrutador Sênior.
              </p>
            </div>
          )}

          {!loading && questions.length > 0 && (
            <div className="space-y-4">
              {/* Active Simulation Info */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50/50 border border-blue-100 rounded-2xl p-5 flex justify-between items-center shadow-xs">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-blue-700 font-bold bg-blue-100 px-2.5 py-0.5 rounded-md">
                    Entrevista Ativa
                  </span>
                  <h3 className="text-lg font-bold font-display text-slate-800 mt-1.5">
                    {roleTitle}
                  </h3>
                  <p className="text-xs text-slate-500 font-light mt-0.5">
                    5 perguntas calibradas geradas por IA. Clique nelas para responder.
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs font-mono text-slate-500">Progresso</div>
                  <div className="text-sm font-bold text-blue-600 mt-1">
                    {Object.keys(userAnswers).filter(k => userAnswers[k].trim()).length} / 5 Respondidas
                  </div>
                </div>
              </div>

              {/* Questions Stack */}
              <div className="space-y-3">
                {questions.map((question, index) => {
                  const isExpanded = expandedQuestion === question.id;
                  const hasAnswer = (userAnswers[question.id] || "").trim().length > 0;
                  
                  // Style configurations based on type
                  let typeLabel = "Técnica";
                  let typeColor = "badge-tech text-[10px] uppercase font-bold px-2.5 py-0.5 rounded";
                  if (question.type === "behavioral") {
                    typeLabel = "Comportamental";
                    typeColor = "badge-beh text-[10px] uppercase font-bold px-2.5 py-0.5 rounded";
                  } else if (question.type === "curva") {
                    typeLabel = "Pergunta Curva";
                    typeColor = "badge-curve text-[10px] uppercase font-bold px-2.5 py-0.5 rounded";
                  }

                  return (
                    <div
                      key={question.id}
                      className={`bg-white border rounded-2xl transition-all shadow-xs overflow-hidden ${
                        isExpanded ? "border-slate-300 ring-1 ring-slate-200" : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      {/* Accordion Trigger */}
                      <div
                        onClick={() => setExpandedQuestion(isExpanded ? null : question.id)}
                        className="p-5 flex justify-between items-start gap-4 cursor-pointer select-none"
                      >
                        <div className="space-y-2.5 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-mono text-slate-400 font-bold">
                              #0{index + 1}
                            </span>
                            <span className={`${typeColor}`}>
                              {typeLabel}
                            </span>
                            <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                              {question.category}
                            </span>
                            {hasAnswer && (
                              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                                Rascunhada
                              </span>
                            )}
                          </div>
                          <h4 className="text-sm font-semibold text-slate-800 leading-relaxed font-display">
                            {question.text}
                          </h4>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 pt-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(question.id, question.text);
                            }}
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                            title="Copiar Pergunta"
                          >
                            {copiedId === question.id ? (
                              <Check className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                      </div>

                      {/* Accordion Content */}
                      {isExpanded && (
                        <div className="px-5 pb-5 pt-1 border-t border-slate-100 bg-slate-50/50 space-y-4">
                          {/* Explanation (Recruiter Mind) */}
                          <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-xl space-y-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                              <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                              Por que perguntamos isso? (Visão do Recrutador)
                            </span>
                            <p className="text-xs text-slate-600 leading-relaxed font-light">
                              {question.explanation}
                            </p>
                          </div>

                          {/* Interactive draft field */}
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex justify-between">
                              <span>Sua resposta rascunho</span>
                              <span className="text-slate-400 lowercase font-normal">Fale livremente e sem rodeios</span>
                            </label>
                            <textarea
                              rows={4}
                              placeholder="Digite aqui o que você diria na entrevista real. Não se preocupe em falar bonito agora — o nosso Otimizador STAR vai lapidar isso para soar profissional e focado em resultados!"
                              value={userAnswers[question.id] || ""}
                              onChange={(e) => {
                                setUserAnswers({
                                  ...userAnswers,
                                  [question.id]: e.target.value,
                                });
                              }}
                              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-xs text-slate-800 transition-all font-light resize-none placeholder-slate-400"
                            />
                          </div>

                          {/* Submit to STAR optimizer */}
                          <div className="flex justify-end">
                            <button
                              onClick={() => {
                                const draft = userAnswers[question.id] || "";
                                onSendToOptimizer(question.text, draft);
                              }}
                              disabled={!(userAnswers[question.id] || "").trim()}
                              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-400 text-white font-semibold rounded-xl border border-slate-800 transition-all text-xs flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed shadow-xs"
                            >
                              <span>Otimizar com Método STAR</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
