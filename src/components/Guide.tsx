import React from "react";
import { 
  BookOpen, Compass, Award, ThumbsUp, Sparkles, Brain, 
  CheckCircle, MessageSquare, ShieldAlert, TrendingUp 
} from "lucide-react";
import CoachTip from "./CoachTip";

export default function Guide() {
  const starPhases = [
    {
      letter: "S",
      title: "Situação (Situation)",
      description: "Descreva o contexto do desafio de forma clara e objetiva. O que estava acontecendo? Qual era o problema crítico a ser resolvido?",
      actionable: "Evite rodeios. Diga o nome do projeto, o tamanho da equipe e a dor principal em até 3 frases.",
      badExample: "A gente tinha um monte de código legado ruim e nada funcionava lá na empresa...",
      goodExample: "Como Engenheiro Sênior na TechCorp, enfrentei um aumento súbito de 150% na taxa de falhas do checkout de pagamento durante a Black Friday...",
    },
    {
      letter: "T",
      title: "Tarefa (Task)",
      description: "Esclareça qual era o seu papel individual naquele cenário. O que cabia a você fazer e qual era o objetivo principal que precisava ser batido?",
      actionable: "Defina a meta de forma direta. O que você era cobrado para entregar?",
      badExample: "Aí me falaram pra dar um jeito naquilo lá de qualquer forma...",
      goodExample: "Minha responsabilidade era liderar um diagnóstico de emergência em tempo real e restaurar a estabilidade da API em menos de 2 horas...",
    },
    {
      letter: "A",
      title: "Ação (Action)",
      description: "Esta é a parte principal. Descreva as ações que VOCÊ tomou de forma estratégica e estratégica. Como você organizou, liderou e executou a solução?",
      actionable: "Use verbos de protagonismo na primeira pessoa ('eu decidi', 'eu liderei', 'eu analisei'). Evite esconder-se no coletivo 'nós'.",
      badExample: "Nós sentamos lá e mudamos o banco de dados pra ver se melhorava e deu certo...",
      goodExample: "Eu isolei os microsserviços suspeitos usando Kibana, identifiquei um estouro de conexão no cache Redis e criei imediatamente um fallback resiliente...",
    },
    {
      letter: "R",
      title: "Resultado (Result)",
      description: "Apresente o desfecho bem-sucedido sustentado por dados mensuráveis ou feedbacks qualitativos inquestionáveis.",
      actionable: "Quantifique sempre que possível. Se não tiver números perfeitos, mostre a eficiência conquistada ou a lição aprendida.",
      badExample: "O checkout voltou a funcionar e todo mundo ficou super feliz, principalmente meu chefe.",
      goodExample: "Restabelecemos 100% da operação em 45 minutos (62% abaixo da meta), salvando um faturamento estimado de R$ 120 mil na Black Friday.",
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-display font-bold text-slate-100 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Guia Definitivo de Alta Performance para Entrevistas
        </h2>
        <p className="text-sm text-slate-400 mt-1 font-light">
          Aprenda a estruturar discursos que convertem vagas em propostas reais. Siga as metodologias recomendadas pelos mentores da nossa plataforma.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left main area */}
        <div className="md:col-span-8 space-y-6">
          
          {/* Section: Anxiety Reduction */}
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2 font-display">
              <Brain className="w-5 h-5 text-indigo-400" />
              Como Dominar a Ansiedade Pré-Entrevista?
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-light">
              Sentir nervosismo antes de uma entrevista desafiadora é absolutamente normal. O segredo não é eliminar a ansiedade, mas canalizá-la em energia e presença de palco.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-xl space-y-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-semibold text-slate-200">Simulação Prévia Activa</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed font-light">
                  Estudar de cabeça fria simulações personalizadas pelo nosso robô reduz o elemento-surpresa em até 85% durante o teste real.
                </p>
              </div>

              <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-xl space-y-1.5">
                <Compass className="w-4 h-4 text-blue-400" />
                <h4 className="text-xs font-semibold text-slate-200">Mindset de Abundância</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed font-light">
                  Encare a entrevista como um alinhamento mútuo e uma conversa profissional bilateral, e não como uma prova inquisitória.
                </p>
              </div>
            </div>
          </section>

          {/* Section: STAR Deep Dive */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2 font-display">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              Entendendo o Método STAR na Prática
            </h3>

            <div className="space-y-4">
              {starPhases.map((phase) => (
                <div key={phase.letter} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-4">
                  {/* Phase Head */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-mono text-sm font-bold shrink-0">
                      {phase.letter}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-100 font-display">
                        {phase.title}
                      </h4>
                      <p className="text-xs text-slate-400 font-light">
                        {phase.description}
                      </p>
                    </div>
                  </div>

                  {/* Actions Box */}
                  <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl">
                    <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider font-semibold">Instrução de Ouro:</span>
                    <p className="text-xs text-slate-300 font-light leading-relaxed mt-0.5">
                      {phase.actionable}
                    </p>
                  </div>

                  {/* Bad vs Good */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-[11px]">
                    <div className="p-3 bg-red-950/10 border border-red-500/10 rounded-xl">
                      <span className="font-semibold text-red-400 uppercase tracking-wider block mb-1">❌ Evite dizer:</span>
                      <p className="text-slate-400 font-light italic leading-relaxed">
                        "{phase.badExample}"
                      </p>
                    </div>
                    <div className="p-3 bg-emerald-950/10 border border-emerald-500/10 rounded-xl">
                      <span className="font-semibold text-emerald-400 uppercase tracking-wider block mb-1">✅ Diga isso:</span>
                      <p className="text-slate-300 font-light leading-relaxed">
                        "{phase.goodExample}"
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Right column sidebar tips */}
        <div className="md:col-span-4 space-y-6">
          <CoachTip
            title="SaaS Premium Interview Strategy"
            content="Não invente mentiras ou exagere fatos. O Recrutador Sênior fará perguntas de aprofundamento (Double Click) sobre as ferramentas mencionadas. É melhor assumir vulnerabilidade e focar na lição aprendida do que ser pego em contradição técnica."
          />

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-blue-400" />
              O Segredo do Protagonismo
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Muitos candidatos brilhantes falham porque contam histórias inteiras usando <strong>"NÓS"</strong> ("nós fizemos", "nós entregamos"). O recrutador não está entrevistando sua antiga equipe, ele quer contratar <strong>VOCÊ</strong>. 
            </p>
            <p className="text-xs text-slate-300 leading-relaxed font-light">
              Sempre mude o foco para a sua ação estratégica: "Minha iniciativa foi...", "Liderei o esforço de...", "Escrevi o código que...". Isso duplica o valor percebido do seu perfil profissional.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Impacto nos Resultados
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 font-light">
              <li className="flex gap-2 items-start">
                <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
                <span><strong>Dinheiro:</strong> Economia de custos ou faturamento gerado.</span>
              </li>
              <li className="flex gap-2 items-start">
                <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
                <span><strong>Tempo:</strong> Otimização de processos ou velocidade de entrega.</span>
              </li>
              <li className="flex gap-2 items-start">
                <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
                <span><strong>Qualidade:</strong> Redução de bugs, satisfação (NPS) ou eficiência.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
