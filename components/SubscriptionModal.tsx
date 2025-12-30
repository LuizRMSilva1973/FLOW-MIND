
import React from 'react';
import { PlanType, SubscriptionPlan } from '../types';

interface SubscriptionModalProps {
  currentPlan: PlanType;
  onSelectPlan: (plan: PlanType) => void;
  onClose: () => void;
}

const PLANS: SubscriptionPlan[] = [
  {
    type: 'FREE',
    name: 'Gratuito',
    price: 'R$ 0',
    features: ['1 Fluxo ativo', 'Blocos básicos', 'Suporte via comunidade']
  },
  {
    type: 'PRO',
    name: 'Pro',
    price: 'R$ 49/mês',
    features: ['Fluxos ilimitados', 'IA Assistente avançada', 'Delay customizado', 'Suporte prioritário']
  },
  {
    type: 'ENTERPRISE',
    name: 'Enterprise',
    price: 'Sob consulta',
    features: ['Customizações exclusivas', 'SLA de 99.9%', 'Gerente de conta', 'Integrações nativas']
  }
];

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ currentPlan, onSelectPlan, onClose }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Escolha seu Plano</h2>
            <p className="text-slate-500 text-sm">Escalone suas automações com o plano ideal para seu negócio.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <div 
              key={plan.type}
              className={`border-2 rounded-2xl p-6 flex flex-col transition-all ${
                currentPlan === plan.type 
                ? 'border-indigo-600 bg-indigo-50/30' 
                : 'border-slate-100 hover:border-slate-200'
              }`}
            >
              <div className="mb-4">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">{plan.name}</span>
                <div className="text-2xl font-bold text-slate-900 mt-1">{plan.price}</div>
              </div>
              
              <ul className="flex-1 space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start text-sm text-slate-600">
                    <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => onSelectPlan(plan.type)}
                disabled={currentPlan === plan.type}
                className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
                  currentPlan === plan.type
                  ? 'bg-slate-100 text-slate-400 cursor-default'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100'
                }`}
              >
                {currentPlan === plan.type ? 'Plano Atual' : 'Selecionar'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;
