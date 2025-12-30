
import { NodeProvider, NodeType, FlowNode, Recipe } from './types';

export const RECIPES: Recipe[] = [
  {
    id: 'r1',
    title: 'Lembrete de Consulta (Clínica)',
    description: 'Envia mensagem automática no WhatsApp 24h antes do agendamento.',
    icon: '🏥',
    category: 'Saúde',
    nodes: [
      {
        type: NodeType.TRIGGER,
        provider: NodeProvider.WEBHOOK,
        title: 'Receber Agendamento',
        description: 'Conecte seu sistema de gestão aqui.',
        icon: '🔗',
        config: { delay: 0, fields: [{ key: 'url', label: 'URL de Webhook', type: 'text', value: 'https://api.flowmind.com/wh/123' }] }
      },
      {
        type: NodeType.ACTION,
        provider: NodeProvider.WHATSAPP,
        title: 'Lembrete WhatsApp',
        description: 'Envia mensagem de confirmação.',
        icon: '💬',
        config: { delay: 0, fields: [{ key: 'msg', label: 'Mensagem', type: 'textarea', value: 'Olá {{nome}}, confirmamos sua consulta para amanhã!' }] }
      }
    ]
  },
  {
    id: 'r2',
    title: 'Boas-vindas Novo Cliente',
    description: 'E-mail e WhatsApp de saudação para novos cadastros no CRM.',
    icon: '🤝',
    category: 'Vendas',
    nodes: [
      {
        type: NodeType.TRIGGER,
        provider: NodeProvider.CRM,
        title: 'Novo Cadastro CRM',
        description: 'Detecta novo lead no sistema.',
        icon: '👤',
        config: { delay: 0, fields: [] }
      },
      {
        type: NodeType.ACTION,
        provider: NodeProvider.EMAIL,
        title: 'E-mail de Boas-vindas',
        description: 'Envia apresentação da empresa.',
        icon: '✉️',
        config: { delay: 0, fields: [] }
      }
    ]
  }
];

export const AVAILABLE_NODES: Omit<FlowNode, 'id' | 'config'>[] = [
  {
    type: NodeType.TRIGGER,
    provider: NodeProvider.WHATSAPP,
    title: 'Mensagem de WhatsApp',
    description: 'Ativado quando uma mensagem é recebida',
    icon: '📱'
  },
  {
    type: NodeType.TRIGGER,
    provider: NodeProvider.WEBHOOK,
    title: 'Webhook de Entrada',
    description: 'Integração universal via API',
    icon: '🔗'
  },
  {
    type: NodeType.TRIGGER,
    provider: NodeProvider.CSV,
    title: 'CSV / Planilha',
    description: 'Importar contatos de arquivo CSV',
    icon: '📊'
  },
  {
    type: NodeType.ACTION,
    provider: NodeProvider.WHATSAPP,
    title: 'Enviar WhatsApp',
    description: 'Envia texto ou template',
    icon: '💬'
  },
  {
    type: NodeType.ACTION,
    provider: NodeProvider.EMAIL,
    title: 'Enviar E-mail',
    description: 'Notificação SMTP automática',
    icon: '✉️'
  },
  {
    type: NodeType.ACTION,
    provider: NodeProvider.CRM,
    title: 'Atualizar CRM',
    description: 'Salva dados no cadastro',
    icon: '👤'
  }
];
