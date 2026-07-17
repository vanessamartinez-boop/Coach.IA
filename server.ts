import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey || "MOCK_KEY",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Middleware to check API key
const checkApiKey = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({
      error: "A chave API do Gemini não está configurada nos Secrets do AI Studio.",
      missingKey: true,
    });
  }
  next();
};

// API: Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// API: Generate Questions
app.post("/api/generate-questions", checkApiKey, async (req, res) => {
  try {
    const { role, description } = req.body;
    if (!role) {
      return res.status(400).json({ error: "O cargo é obrigatório." });
    }

    const prompt = `Você é um Recrutador Sênior e Exigente de uma grande empresa global de tecnologia, consultoria ou finanças (estilo FAANG / Big Three / Investment Bank).
Seu objetivo é simular uma entrevista real e altamente desafiadora para testar os limites do candidato ao cargo: "${role}".
${description ? `Descrição da vaga e contexto fornecido: "${description}"` : ""}

Gere exatamente 5 perguntas personalizadas, profundas e realistas.
As perguntas devem seguir estritamente esta divisão de categorias:
- 2 Técnicas: focadas em habilidades práticas específicas, tecnologias relevantes, cenários de engenharia ou tomadas de decisão técnicas fundamentais para o cargo de "${role}".
- 2 Comportamentais: focadas em demonstrar inteligência emocional, resolução de conflitos, liderança, resiliência, gestão de crises ou situações reais do passado.
- 1 "Curva" (Wildcard): uma pergunta inesperada, de raciocínio lógico lateral, quebra-cabeça adaptado, ou cenário hipotético incomum para avaliar a flexibilidade cognitiva, adaptabilidade e capacidade de raciocinar sob pressão do candidato.

Cada pergunta deve conter um identificador de tipo ('technical', 'behavioral' ou 'curva'), a categoria específica testada (por exemplo, "Escalabilidade de Sistemas", "Resolução de Conflitos", "Raciocínio Adaptativo") e uma explicação profunda de por que o recrutador sênior faz essa pergunta (o que ele realmente está avaliando por trás da cortina).

Toda a resposta deve ser em português (Brasil) e seguir rigorosamente o esquema JSON fornecido.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              description: "Lista de exatamente 5 perguntas geradas",
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING, description: "Identificador único da pergunta (ex: q1, q2...)" },
                  text: { type: Type.STRING, description: "A pergunta desafiadora do recrutador sênior" },
                  type: { type: Type.STRING, description: "Categoria do tipo de pergunta. Deve ser exatamente: 'technical' | 'behavioral' | 'curva'" },
                  category: { type: Type.STRING, description: "A competência ou área técnica que está sendo avaliada (ex: 'Gestão de Prioridades')" },
                  explanation: { type: Type.STRING, description: "Explicação do Coach/Recrutador sobre o que é avaliado e o propósito desta pergunta." }
                },
                required: ["id", "text", "type", "category", "explanation"]
              }
            }
          },
          required: ["questions"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Resposta vazia da API do Gemini.");
    }

    const data = JSON.parse(text);
    res.json(data);
  } catch (error: any) {
    console.error("Erro em generate-questions:", error);
    res.status(500).json({ error: error.message || "Erro interno ao gerar as perguntas." });
  }
});

// API: Optimize Answer (STAR Method)
app.post("/api/optimize-star", checkApiKey, async (req, res) => {
  try {
    const { question, draft } = req.body;
    if (!draft) {
      return res.status(400).json({ error: "O rascunho de resposta ou história é obrigatório." });
    }

    const prompt = `Você é um Mentor de Carreira e Coach de Entrevistas altamente experiente e empático. Seu papel é agir como um lapidador profissional que transforma uma história bruta ou desorganizada em um case de sucesso brilhante.
O candidato forneceu o seguinte rascunho de resposta ou relato profissional:
"${draft}"

${question ? `Esta resposta foi formulada para a pergunta: "${question}"` : "Esta é uma resposta genérica de um relato profissional do candidato."}

Sua tarefa é reorganizar e otimizar essa resposta seguindo RIGOROSAMENTE a Metodologia STAR (Situação, Tarefa, Ação e Resultado).

Instruções de Otimização e Lapidação:
1. Reorganize a narrativa de forma extremamente atraente, clara, lógica e fluida.
2. Destaque com muita força o PROTAGONISMO do candidato (use verbos na primeira pessoa do singular: "eu liderei", "eu decidi", "eu analisei", em vez de "nós fizemos").
3. Melhore o tom profissional, elevando o vocabulário para um nível executivo, maduro, técnico e de alto impacto.
4. Enfatize resultados quantitativos ou qualitativos claros. Se o rascunho original não tiver métricas precisas, estruture o "Resultado" com espaços ou estimativas realistas de impacto e adicione uma nota explicativa sobre como o usuário pode preencher esses números (ex: "Aumentando a eficiência em [X]% ou economizando [Y] horas").
5. Divida o resultado estrutural em Situação (S), Tarefa (T), Ação (A) e Resultado (R) para fins de aprendizagem e visualização separada.
6. Forneça também o texto consolidado final completo ('fullOptimized'), fluido e natural, ideal para ser dito na entrevista.
7. Adicione uma Dica prática do Coach ('coachingTip') personalizada contendo conselhos de entrega, linguagem corporal, entonação de voz ou que aspecto chave ressaltar ao contar esse case.

Toda a resposta deve ser em português (Brasil) e seguir rigorosamente o esquema JSON fornecido.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            situation: { type: Type.STRING, description: "O contexto, cenário ou problema que precisava ser resolvido." },
            task: { type: Type.STRING, description: "A missão, meta ou a responsabilidade específica que cabia ao candidato." },
            action: { type: Type.STRING, description: "As ações estratégicas e práticas realizadas pelo candidato, evidenciando seu protagonismo." },
            result: { type: Type.STRING, description: "Os resultados tangíveis ou intangíveis da ação (métricas, eficiência, feedback positivo)." },
            fullOptimized: { type: Type.STRING, description: "O case completo unificado de forma fluida e profissional." },
            coachingTip: { type: Type.STRING, description: "A dica secreta do mentor para brilhar ao contar esta história específica." }
          },
          required: ["situation", "task", "action", "result", "fullOptimized", "coachingTip"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Resposta vazia da API do Gemini.");
    }

    const data = JSON.parse(text);
    res.json(data);
  } catch (error: any) {
    console.error("Erro em optimize-star:", error);
    res.status(500).json({ error: error.message || "Erro interno ao otimizar a resposta." });
  }
});

// Setup Vite or static files
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
