
import React from 'react';
import { FlowNode, NodeType } from '../types';

interface FlowCanvasProps {
  nodes: FlowNode[];
  selectedNodeId: string | null;
  onSelectNode: (id: string) => void;
  onRemoveNode: (id: string) => void;
}

const FlowCanvas: React.FC<FlowCanvasProps> = ({ nodes, selectedNodeId, onSelectNode, onRemoveNode }) => {
  return (
    <div className="flex-1 bg-slate-50 relative overflow-auto p-12">
      <div className="max-w-xl mx-auto flex flex-col items-center">
        {nodes.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl w-full p-8 text-center">
            <div className="text-4xl mb-4">🚀</div>
            <p className="text-sm font-medium">Seu canvas está vazio.</p>
            <p className="text-xs mt-1">Adicione blocos da biblioteca ou use o assistente de IA.</p>
          </div>
        ) : (
          nodes.map((node, index) => {
            const isSelected = node.id === selectedNodeId;
            return (
              <React.Fragment key={node.id}>
                <div 
                  className={`relative w-full group transition-transform duration-200 active:scale-95 cursor-pointer ${node.type === NodeType.TRIGGER ? 'mb-4' : 'mb-4'}`}
                  onClick={() => onSelectNode(node.id)}
                >
                  <div className={`
                    p-6 rounded-2xl border-2 transition-all bg-white shadow-sm
                    ${isSelected ? 'border-indigo-500 ring-4 ring-indigo-50 shadow-lg' : 
                      node.type === NodeType.TRIGGER ? 'border-indigo-100 hover:border-indigo-400' : 'border-slate-100 hover:border-slate-300'}
                  `}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <div className={`
                          w-12 h-12 rounded-xl flex items-center justify-center text-2xl mr-4
                          ${node.type === NodeType.TRIGGER ? 'bg-indigo-50' : 'bg-slate-50'}
                        `}>
                          {node.icon}
                        </div>
                        <div>
                          <div className="flex items-center">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter mr-2">
                              {node.type === NodeType.TRIGGER ? 'GATILHO' : node.type === NodeType.ACTION ? 'AÇÃO' : 'CONDIÇÃO'}
                            </span>
                            <h3 className="font-semibold text-slate-900">{node.title}</h3>
                          </div>
                          <p className="text-sm text-slate-500 mt-1">{node.description}</p>
                        </div>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveNode(node.id);
                        }}
                        className="p-1 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-50 flex flex-wrap gap-2 overflow-x-auto">
                      <div className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-medium text-slate-500 uppercase">Provedor: {node.provider}</div>
                      {node.config?.delay > 0 && (
                        <div className="px-3 py-1 bg-amber-50 rounded-full text-[10px] font-bold text-amber-600 uppercase flex items-center">
                          <span className="mr-1">⏳</span> Atraso: {node.config.delay}s
                        </div>
                      )}
                      <div className="px-3 py-1 bg-green-50 rounded-full text-[10px] font-medium text-green-600 uppercase">Configurado: ✅</div>
                    </div>
                  </div>

                  {index < nodes.length - 1 && (
                    <div className="h-10 w-px bg-slate-200 mx-auto relative">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-slate-300" />
                    </div>
                  )}
                </div>
              </React.Fragment>
            );
          })
        )}

        {nodes.length > 0 && (
          <div className="mt-8 text-center">
            <button className="px-6 py-2 bg-indigo-600 text-white rounded-full font-semibold text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all flex items-center">
              <span className="mr-2">⚡</span> Ativar Automação
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlowCanvas;
