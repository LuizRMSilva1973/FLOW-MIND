
import React, { useState, useCallback, useMemo } from 'react';
import { Flow, FlowNode, NodeType, NodeProvider, AIResponse, PlanType, ViewType, Recipe } from './types';
import Header from './components/Header';
import NodePalette from './components/NodePalette';
import FlowCanvas from './components/FlowCanvas';
import AssistantPanel from './components/AssistantPanel';
import ConfigPanel from './components/ConfigPanel';
import SubscriptionModal from './components/SubscriptionModal';
import RecipesView from './components/RecipesView';
import ConnectionsView from './components/ConnectionsView';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('FLOWS');
  const [currentFlow, setCurrentFlow] = useState<Flow>({
    id: '1',
    name: 'Novo Fluxo de Automação',
    description: 'Comece a construir seu processo',
    nodes: [],
    createdAt: Date.now()
  });

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<PlanType>('FREE');
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);

  const selectedNode = useMemo(() => 
    currentFlow.nodes.find(n => n.id === selectedNodeId) || null
  , [currentFlow.nodes, selectedNodeId]);

  const handleAddNode = useCallback((nodeTemplate: Omit<FlowNode, 'id'>) => {
    const newNode: FlowNode = {
      ...nodeTemplate,
      id: Math.random().toString(36).substr(2, 9),
      config: { delay: 0, fields: nodeTemplate.config?.fields || [] }
    };
    
    setCurrentFlow(prev => ({
      ...prev,
      nodes: [...prev.nodes, newNode]
    }));
    setSelectedNodeId(newNode.id);
  }, []);

  const handleSelectRecipe = (recipe: Recipe) => {
    const newNodes: FlowNode[] = recipe.nodes.map(node => ({
      ...node,
      id: Math.random().toString(36).substr(2, 9),
      config: { delay: 0, fields: node.config?.fields || [] }
    }));
    
    setCurrentFlow({
      id: Math.random().toString(36).substr(2, 9),
      name: recipe.title,
      description: recipe.description,
      nodes: newNodes,
      createdAt: Date.now()
    });
    setActiveView('FLOWS');
  };

  const handleUpdateNode = useCallback((updatedNode: FlowNode) => {
    setCurrentFlow(prev => ({
      ...prev,
      nodes: prev.nodes.map(n => n.id === updatedNode.id ? updatedNode : n)
    }));
  }, []);

  const handleRemoveNode = useCallback((id: string) => {
    setCurrentFlow(prev => ({
      ...prev,
      nodes: prev.nodes.filter(n => n.id !== id)
    }));
    if (selectedNodeId === id) setSelectedNodeId(null);
  }, [selectedNodeId]);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header 
        flowName={currentFlow.name} 
        onRename={(name) => setCurrentFlow(p => ({ ...p, name }))}
        currentPlan={currentPlan}
        onOpenSubscription={() => setIsSubscriptionModalOpen(true)}
        activeView={activeView}
        onViewChange={setActiveView}
      />
      
      <main className="flex flex-1 overflow-hidden">
        {activeView === 'RECIPES' && <RecipesView onSelectRecipe={handleSelectRecipe} />}
        {activeView === 'CONNECTIONS' && <ConnectionsView />}
        
        {activeView === 'FLOWS' && (
          <>
            <NodePalette onAddNode={handleAddNode} />
            
            <div className="flex-1 flex flex-col overflow-hidden relative">
              <div className="absolute top-4 left-4 z-10">
                 <div className="bg-white/80 backdrop-blur border border-slate-200 rounded-xl px-4 py-2 shadow-sm">
                    <p className="text-xs text-slate-700 font-bold">{currentFlow.name}</p>
                    <p className="text-[10px] text-slate-500 font-medium">{currentFlow.description}</p>
                 </div>
              </div>
              <FlowCanvas 
                nodes={currentFlow.nodes} 
                selectedNodeId={selectedNodeId}
                onSelectNode={setSelectedNodeId}
                onRemoveNode={handleRemoveNode} 
              />
            </div>

            <div className="w-80 flex flex-col border-l border-slate-200 bg-slate-50">
              {selectedNode ? (
                <ConfigPanel 
                  node={selectedNode} 
                  onUpdate={handleUpdateNode} 
                  onClose={() => setSelectedNodeId(null)} 
                />
              ) : (
                <AssistantPanel onFlowGenerated={(data) => {
                  // Mapeia resposta da IA para estrutura local
                  const mappedNodes = data.nodes.map(n => {
                    let icon = '⚙️';
                    if (n.provider === NodeProvider.WHATSAPP) icon = '📱';
                    if (n.provider === NodeProvider.EMAIL) icon = '✉️';
                    if (n.provider === NodeProvider.CRM) icon = '👤';
                    if (n.provider === NodeProvider.WEBHOOK) icon = '🔗';
                    if (n.provider === NodeProvider.CSV) icon = '📊';
                    if (n.provider === NodeProvider.SCHEDULE) icon = '⏰';

                    return {
                      ...n,
                      id: Math.random().toString(36).substr(2, 9),
                      provider: n.provider as NodeProvider,
                      type: n.type as NodeType,
                      icon,
                      config: { delay: 0, fields: [] }
                    };
                  });
                  setCurrentFlow(p => ({ ...p, name: data.name, description: data.description, nodes: mappedNodes as any }));
                }} />
              )}
            </div>
          </>
        )}
      </main>

      {isSubscriptionModalOpen && (
        <SubscriptionModal 
          currentPlan={currentPlan}
          onSelectPlan={(plan) => {
            setCurrentPlan(plan);
            setIsSubscriptionModalOpen(false);
          }}
          onClose={() => setIsSubscriptionModalOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
