
import React from 'react';

const ConnectionsView: React.FC = () => {
  const connections = [
    { id: 1, name: 'WhatsApp Oficial', status: 'Ativo', icon: '📱', color: 'bg-green-500' },
    { id: 2, name: 'E-mail SMTP', status: 'Pendente', icon: '✉️', color: 'bg-amber-500' },
    { id: 3, name: 'Google Sheets', status: 'Desconectado', icon: '📊', color: 'bg-slate-300' }
  ];

  return (
    <div className="flex-1 bg-slate-50 overflow-y-auto p-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Conexões Externas</h2>
            <p className="text-slate-500 mt-2">Gerencie suas chaves de API e integrações em um só lugar.</p>
          </div>
          <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors">
            + Nova Conexão
          </button>
        </div>

        <div className="space-y-4">
          {connections.map(conn => (
            <div key={conn.id} className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center justify-between shadow-sm">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-2xl mr-4 border border-slate-100">
                  {conn.icon}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{conn.name}</h3>
                  <div className="flex items-center mt-1">
                    <span className={`w-2 h-2 rounded-full mr-2 ${conn.color}`} />
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-tighter">{conn.status}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-lg">Configurar</button>
                <button className="px-4 py-2 text-sm font-semibold text-indigo-600 bg-indigo-50 rounded-lg">Testar</button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-8 bg-amber-50 rounded-3xl border border-amber-200">
          <div className="flex gap-4">
            <div className="text-2xl mt-1">⚠️</div>
            <div>
              <h4 className="font-bold text-amber-900">Dica de Segurança</h4>
              <p className="text-amber-800 text-sm mt-1 leading-relaxed">
                Nunca compartilhe suas chaves "Secret" com terceiros. A FlowMind criptografa todos os tokens de ponta-a-ponta antes de salvá-los no banco de dados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionsView;
