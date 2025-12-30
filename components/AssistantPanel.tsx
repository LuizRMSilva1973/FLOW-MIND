
import React, { useState } from 'react';
import { generateFlowFromPrompt } from '../services/geminiService';
import { AIResponse } from '../types';

interface AssistantPanelProps {
  onFlowGenerated: (flowData: AIResponse) => void;
}

const AssistantPanel: React.FC<AssistantPanelProps> = ({ onFlowGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateFlowFromPrompt(prompt);
      onFlowGenerated(result);
      setPrompt('');
    } catch (err) {
      console.error(err);
      setError("Falha ao gerar o fluxo. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-80 border-l border-slate-200 bg-slate-50 h-full flex flex-col">
      <div className="p-4 border-b border-slate-200 bg-white">
        <h2 className="text-sm font-bold text-indigo-600 flex items-center">
          <span className="mr-2">✨</span> Assistente de Fluxo IA
        </h2>
        <p className="text-xs text-slate-500 mt-1">Descreva o que você deseja automatizar.</p>
      </div>

      <div className="flex-1 p-4 flex flex-col justify-end gap-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs rounded-lg">
            {error}
          </div>
        )}
        
        <div className="flex-1 overflow-y-auto flex flex-col gap-3">
          <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm border border-slate-100">
            <p className="text-sm text-slate-700">Olá! Sou seu especialista em automação. Tente algo como:</p>
            <p className="text-xs italic text-indigo-500 mt-2">"Criar um sistema de clínica onde leads do WhatsApp são enviados por e-mail e salvos no CRM."</p>
          </div>
        </div>

        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isLoading}
            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none min-h-[100px] resize-none pr-10"
            placeholder="Diga-me o que você precisa..."
          />
          <button
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim()}
            className="absolute bottom-3 right-3 p-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssistantPanel;
