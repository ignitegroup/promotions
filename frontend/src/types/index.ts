export interface Campaign {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  bannerImage?: string;
  videoUrl?: string;
  status: 'draft' | 'active' | 'ended';
  fields: FormField[];
  integrations?: Integration[];
}

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'email' | 'phone' | 'select' | 'checkbox' | 'textarea';
  required: boolean;
  options?: string[];
  validation?: string;
}

export interface FormSubmission {
  id: string;
  campaignId: string;
  data: Record<string, any>;
  submittedAt: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface Integration {
  id: string;
  type: 'gohighlevel' | 'rampwin' | 'webhook' | 'custom';
  name: string;
  config: Record<string, any>;
  enabled: boolean;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  name?: string;
}
