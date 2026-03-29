export interface Item {
  id: string;
  title: string;
  description?: string;
  category: 'revenue' | 'cost' | 'resource' | 'risk' | 'opportunity';
  estimatedValue?: number;
  actualValue?: number;
  probability?: number;
  status: 'pending' | 'in-progress' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueDate?: string;
  completedAt?: string;
  notes?: string;
  businessCaseId: string;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessCase {
  id: string;
  title: string;
  description?: string;
  status: 'draft' | 'active' | 'completed' | 'archived';
  createdAt: string;
  updatedAt: string;
  items?: Item[];
  _count?: {
    items: number;
  };
}

export interface Stats {
  total: number;
  completed: number;
  pending: number;
  inProgress: number;
  blocked: number;
  totalEstimated: number;
  totalActual: number;
  byCategory: {
    revenue: number;
    cost: number;
    resource: number;
    risk: number;
    opportunity: number;
  };
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
