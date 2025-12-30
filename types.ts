
export enum NodeType {
  TRIGGER = 'TRIGGER',
  ACTION = 'ACTION',
  CONDITION = 'CONDITION'
}

export enum NodeProvider {
  WHATSAPP = 'WHATSAPP',
  EMAIL = 'EMAIL',
  CRM = 'CRM',
  WEBHOOK = 'WEBHOOK',
  SCHEDULE = 'SCHEDULE',
  SYSTEM = 'SYSTEM',
  CSV = 'CSV'
}

export type ViewType = 'FLOWS' | 'RECIPES' | 'CONNECTIONS';

export interface IntegrationField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'password' | 'textarea' | 'select';
  value: string;
  placeholder?: string;
}

export interface FlowNode {
  id: string;
  type: NodeType;
  provider: NodeProvider;
  title: string;
  description: string;
  config: {
    delay: number;
    fields: IntegrationField[];
    csvMapping?: Record<string, string>;
    csvHeaders?: string[];
    [key: string]: any;
  };
  icon: string;
}

export interface Flow {
  id: string;
  name: string;
  description: string;
  nodes: FlowNode[];
  createdAt: number;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  nodes: Omit<FlowNode, 'id'>[];
}

export type PlanType = 'FREE' | 'PRO' | 'ENTERPRISE';

export interface SubscriptionPlan {
  type: PlanType;
  name: string;
  price: string;
  features: string[];
}

export interface AIResponse {
  name: string;
  description: string;
  nodes: Array<{
    provider: string;
    type: string;
    title: string;
    description: string;
    config: Record<string, any>;
  }>;
}
