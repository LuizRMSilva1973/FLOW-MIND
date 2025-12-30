
import React, { useState } from 'react';
import { PlanType, ViewType } from '../types';

interface HeaderProps {
  flowName: string;
  onRename: (name: string) => void;
  currentPlan: PlanType;
  onOpenSubscription: () => void;
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const Header: React.FC<HeaderProps> = ({ flowName, onRename, currentPlan, onOpenSubscription, activeView, onViewChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(flowName);

  const handleSave = () => {
    onRename(name);
    setIsEditing(false);
  };

  const planStyles = {
    FREE: 'bg-slate-100 text-slate-600',
    PRO: 'bg-indigo-100 text-indigo-700',
    ENTERPRISE: 'bg-amber-100 text-amber-700'
  };

  const navItems = [
    { id: 'RECIPES', label: 'Receitas Prontas', icon: '🎨' },
    { id: 'FLOWS', label: 'Meus Fluxos', icon: '⚡' },
    { id: 'CONNECTIONS', label: 'Conexões', icon: '🔌' }
  ];

  return (
    <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 z-20">
      <div className="flex items-center gap-8">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="font-bold text-slate-900 tracking-tight text-lg">FlowMind</span>
        </div>

        <nav className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as ViewType)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                activeView === item.id 
                ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' 
                : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={onOpenSubscription}
          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${planStyles[currentPlan]}`}
        >
          Plano {currentPlan}
        </button>

        <div className="h-6 w-px bg-slate-200 mx-2" />
        
        <button className="bg-slate-900 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors shadow-sm">
          Salvar Fluxo
        </button>
      </div>
    </header>
  );
};

export default Header;
