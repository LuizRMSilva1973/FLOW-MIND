
import React, { useRef, useState, useEffect } from 'react';
import { FlowNode, NodeProvider } from '../types';

interface ConfigPanelProps {
  node: FlowNode;
  onUpdate: (updatedNode: FlowNode) => void;
  onClose: () => void;
}

const CANONICAL_FIELDS = [
  { key: 'contact.name', label: 'Nome Completo', icon: '👤' },
  { key: 'contact.phone', label: 'Telefone / WhatsApp', icon: '📱' },
  { key: 'contact.email', label: 'E-mail', icon: '✉️' },
  { key: 'event.date', label: 'Data do Evento', icon: '📅' },
  { key: 'event.value', label: 'Valor', icon: '💰' },
  { key: 'event.status', label: 'Status', icon: '🏷️' },
];

const EVENT_TYPES = [
  { value: 'lead', label: 'Novo Lead' },
  { value: 'pedido', label: 'Pedido Realizado' },
  { value: 'vencimento', label: 'Vencimento de Fatura' },
  { value: 'agendamento', label: 'Novo Agendamento' },
  { value: 'outro', label: 'Outro Evento' },
];

const ConfigPanel: React.FC<ConfigPanelProps> = ({ node, onUpdate, onClose }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);

  // Inicializa campos de webhook se não existirem
  useEffect(() => {
    if (node.provider === NodeProvider.WEBHOOK && !node.config.webhookUrl) {
      const randomId = Math.random().toString(36).substring(7);
      const randomSecret = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      onUpdate({
        ...node,
        config: {
          ...node.config,
          webhookName: node.config.webhookName || 'Minha Integração API',
          webhookUrl: `https://api.flowmind.com/v1/wh/${randomId}`,
          webhookSecret: randomSecret,
          eventType: node.config.eventType || 'lead',
          payloadExample: node.config.payloadExample || '{\n  "nome": "João Silva",\n  "telefone": "5511999999999",\n  "status": "pago"\n}'
        }
      });
    }
  }, [node.provider]);

  const handleFieldChange = (key: string, value: string) => {
    const updatedFields = (node.config.fields || []).map(f => 
      f.key === key ? { ...f, value } : f
    );
    onUpdate({
      ...node,
      config: { ...node.config, fields: updatedFields }
    });
  };

  const handleConfigValueChange = (key: string, value: any) => {
    onUpdate({
      ...node,
      config: { ...node.config, [key]: value }
    });
  };

  const handleBaseChange = (field: string, value: any) => {
    onUpdate({ ...node, [field]: value });
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n');
      if (lines.length > 0) {
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        const initialMapping: Record<string, string> = {};
        headers.forEach(header => {
          const lower = header.toLowerCase();
          if (lower.includes('nome') || lower.includes('name')) initialMapping['contact.name'] = header;
          if (lower.includes('tel') || lower.includes('phone') || lower.includes('whatsapp') || lower.includes('cel')) initialMapping['contact.phone'] = header;
          if (lower.includes('email') || lower.includes('mail')) initialMapping['contact.email'] = header;
          if (lower.includes('data') || lower.includes('date')) initialMapping['event.date'] = header;
          if (lower.includes('valor') || lower.includes('price') || lower.includes('value')) initialMapping['event.value'] = header;
          if (lower.includes('status')) initialMapping['event.status'] = header;
        });

        onUpdate({
          ...node,
          config: {
            ...node.config,
            csvHeaders: headers,
            csvMapping: initialMapping
          }
        });
      }
    };
    reader.readAsText(file);
  };

  const handleMappingChange = (canonicalKey: string, csvColumn: string) => {
    onUpdate({
      ...node,
      config: {
        ...node.config,
        csvMapping: {
          ...(node.config.csvMapping || {}),
          [canonicalKey]: csvColumn
        }
      }
    });
  };

  const runSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => setIsSimulating(false), 2000);
  };

  const testWebhook = () => {
    setIsTestingWebhook(true);
    setTimeout(() => setIsTestingWebhook(false), 1500);
  };

  const renderWebhookConfig = () => (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <label className="block text-[10px] font-bold text-indigo-500 uppercase tracking-widest border-b border-indigo-50 pb-2 mb-4">
          Configuração do Webhook
        </label>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-2">Nome da Integração</label>
            <input
              type="text"
              value={node.config.webhookName || ''}
              onChange={(e) => handleConfigValueChange('webhookName', e.target.value)}
              placeholder="Ex: Checkout Hotmart, Typeform..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-2">URL do Webhook</label>
            <div className="relative group">
              <input
                type="text"
                readOnly
                value={node.config.webhookUrl || ''}
                className="w-full bg-slate-100 border border-slate-200 rounded-xl p-3 pr-10 text-xs font-mono text-slate-500 outline-none cursor-not-allowed"
              />
              <button 
                onClick={() => navigator.clipboard.writeText(node.config.webhookUrl || '')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white rounded-lg transition-colors text-slate-400 hover:text-indigo-600"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-2">Segredo (HMAC Key)</label>
            <input
              type="text"
              readOnly
              value={node.config.webhookSecret || ''}
              className="w-full bg-slate-100 border border-slate-200 rounded-xl p-3 text-xs font-mono text-slate-500 outline-none cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-2">Tipo de Evento</label>
            <select
              value={node.config.eventType || 'lead'}
              onChange={(e) => handleConfigValueChange('eventType', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              {EVENT_TYPES.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-2">Exemplo de Payload JSON</label>
            <textarea
              value={node.config.payloadExample || ''}
              onChange={(e) => handleConfigValueChange('payloadExample', e.target.value)}
              placeholder='{"id": 123, "email": "contato@exemplo.com"}'
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs font-mono text-indigo-300 outline-none focus:ring-2 focus:ring-indigo-500 min-h-[120px]"
            />
          </div>

          <button 
            onClick={testWebhook}
            disabled={isTestingWebhook}
            className={`w-full py-3 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
              isTestingWebhook 
                ? 'bg-slate-100 text-slate-400' 
                : 'bg-white border-2 border-indigo-100 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200'
            }`}
          >
            {isTestingWebhook ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Aguardando Teste...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Enviar Evento de Teste
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  const renderCsvConfig = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-[10px] font-bold text-indigo-500 uppercase tracking-widest border-b border-indigo-50 pb-2 mb-4">
          Configuração de Planilha
        </label>
        
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleCsvUpload} 
          accept=".csv" 
          className="hidden" 
        />
        
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-slate-200 rounded-2xl hover:border-indigo-400 hover:bg-indigo-50 transition-all text-slate-500 hover:text-indigo-600 mb-4"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          <span className="text-sm font-semibold">Carregar Arquivo CSV</span>
        </button>

        {node.config.csvHeaders && (
          <div className="bg-green-50 text-green-700 p-3 rounded-xl text-xs font-medium flex items-center mb-6">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Arquivo detectado: {node.config.csvHeaders.length} colunas encontradas.
          </div>
        )}
      </div>

      {node.config.csvHeaders && (
        <div className="space-y-4">
          <label className="block text-xs font-bold text-slate-600">Mapeamento de Dados</label>
          <p className="text-[10px] text-slate-400 -mt-2 mb-4">Relacione as colunas da sua planilha com os campos do sistema.</p>
          
          {CANONICAL_FIELDS.map(field => (
            <div key={field.key} className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-700 flex items-center">
                  <span className="mr-1.5">{field.icon}</span> {field.label}
                </label>
                {node.config.csvMapping?.[field.key] && (
                  <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-bold">Auto</span>
                )}
              </div>
              <select 
                value={node.config.csvMapping?.[field.key] || ''}
                onChange={(e) => handleMappingChange(field.key, e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="">Não mapeado</option>
                {node.config.csvHeaders?.map(header => (
                  <option key={header} value={header}>{header}</option>
                ))}
              </select>
            </div>
          ))}

          <div className="pt-4 space-y-4">
            <label className="block text-xs font-bold text-slate-600">Agendamento</label>
            <select className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-indigo-500 outline-none">
              <option>Execução Única (Agora)</option>
              <option>Diário (08:00 AM)</option>
              <option>Semanal (Segundas)</option>
              <option>Mensal (Dia 01)</option>
            </select>

            <button 
              onClick={runSimulation}
              disabled={isSimulating}
              className="w-full py-2.5 border border-indigo-200 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
            >
              {isSimulating ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Simulando...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Testar com 5 primeiras linhas
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-white shadow-2xl">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white sticky top-0 z-10">
        <h2 className="text-sm font-bold text-slate-800 flex items-center">
          <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mr-2.5 text-base shadow-sm">{node.icon}</span>
          Configurar Bloco
        </h2>
        <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-8 pb-24">
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Identificação Visual</label>
          <input
            type="text"
            value={node.title}
            onChange={(e) => handleBaseChange('title', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
          />
        </div>

        {node.provider === NodeProvider.CSV ? renderCsvConfig() : 
         node.provider === NodeProvider.WEBHOOK ? renderWebhookConfig() : (
          node.config.fields?.length > 0 && (
            <div className="space-y-6">
              <label className="block text-[10px] font-bold text-indigo-500 uppercase tracking-widest border-b border-indigo-50 pb-2">Campos do Bloco</label>
              {node.config.fields.map(field => (
                <div key={field.key}>
                  <label className="block text-xs font-bold text-slate-600 mb-2">{field.label}</label>
                  {field.type === 'textarea' ? (
                    <textarea
                      value={field.value}
                      onChange={(e) => handleFieldChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none min-h-[120px] resize-none"
                    />
                  ) : (
                    <input
                      type={field.type}
                      value={field.value}
                      onChange={(e) => handleFieldChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  )}
                  <p className="mt-1.5 text-[10px] text-slate-400 italic">Dica: Use <b>{"{{nome}}"}</b> para personalizar automaticamente.</p>
                </div>
              ))}
            </div>
          )
        )}

        <div className="pt-8 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Atraso de Execução</label>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">+{node.config?.delay || 0}s</span>
          </div>
          <input
            type="range"
            min="0"
            max="60"
            step="1"
            value={node.config?.delay || 0}
            onChange={(e) => onUpdate({ ...node, config: { ...node.config, delay: parseInt(e.target.value) } })}
            className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
        </div>
      </div>

      <div className="p-4 border-t border-slate-100 bg-white absolute bottom-0 left-0 right-0">
        <button 
          onClick={onClose}
          className="w-full py-3.5 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
        >
          Salvar Configurações
        </button>
      </div>
    </div>
  );
};

export default ConfigPanel;
