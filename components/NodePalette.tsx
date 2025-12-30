
import React from 'react';
import { AVAILABLE_NODES } from '../constants';
import { FlowNode, NodeType } from '../types';

interface NodePaletteProps {
  onAddNode: (node: Omit<FlowNode, 'id'>) => void;
}

const NodePalette: React.FC<NodePaletteProps> = ({ onAddNode }) => {
  return (
    <div className="w-64 border-r border-slate-200 bg-white h-full flex flex-col p-4">
      <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Biblioteca</h2>
      
      <div className="space-y-6 overflow-y-auto pr-1">
        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-2">Gatilhos</h3>
          <div className="space-y-2">
            {AVAILABLE_NODES.filter(n => n.type === NodeType.TRIGGER).map((node, i) => (
              <button
                key={i}
                // FIX: Changed 'integrationFields' to 'fields' to align with FlowNode interface and resolve type error.
                onClick={() => onAddNode({ ...node, config: { delay: 0, fields: [] } })}
                className="w-full flex items-center p-3 rounded-lg border border-slate-100 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 transition-all text-left group"
              >
                <span className="text-2xl mr-3">{node.icon}</span>
                <div>
                  <div className="text-sm font-medium text-slate-900 group-hover:text-indigo-700">{node.title}</div>
                  <div className="text-xs text-slate-500 line-clamp-1">{node.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-2">Ações</h3>
          <div className="space-y-2">
            {AVAILABLE_NODES.filter(n => n.type === NodeType.ACTION).map((node, i) => (
              <button
                key={i}
                // FIX: Changed 'integrationFields' to 'fields' to align with FlowNode interface and resolve type error.
                onClick={() => onAddNode({ ...node, config: { delay: 0, fields: [] } })}
                className="w-full flex items-center p-3 rounded-lg border border-slate-100 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 transition-all text-left group"
              >
                <span className="text-2xl mr-3">{node.icon}</span>
                <div>
                  <div className="text-sm font-medium text-slate-900 group-hover:text-indigo-700">{node.title}</div>
                  <div className="text-xs text-slate-500 line-clamp-1">{node.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NodePalette;
