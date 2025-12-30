
import { GoogleGenAI, Type } from "@google/genai";
import { AIResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateFlowFromPrompt(prompt: string): Promise<AIResponse> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Projete um fluxo de automação baseado nesta solicitação: "${prompt}". 
    Você deve responder estritamente em Português do Brasil.
    Retorne um objeto JSON estruturado descrevendo as etapas.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING },
          nodes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                provider: { 
                  type: Type.STRING, 
                  description: "Um de: WHATSAPP, EMAIL, CRM, WEBHOOK, SCHEDULE, SYSTEM" 
                },
                type: { 
                  type: Type.STRING, 
                  description: "Um de: TRIGGER, ACTION, CONDITION" 
                },
                title: { type: Type.STRING, description: "Título amigável em Português" },
                description: { type: Type.STRING, description: "Breve explicação em Português" },
                config: { type: Type.OBJECT, properties: {} }
              },
              required: ["provider", "type", "title", "description"]
            }
          }
        },
        required: ["name", "description", "nodes"]
      }
    }
  });

  return JSON.parse(response.text || "{}") as AIResponse;
}
