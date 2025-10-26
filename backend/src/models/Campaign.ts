import mongoose, { Schema, Document } from 'mongoose';

export interface IFormField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'email' | 'phone' | 'select' | 'checkbox' | 'textarea';
  required: boolean;
  options?: string[];
  validation?: string;
}

export interface IIntegration {
  id: string;
  type: 'gohighlevel' | 'rampwin' | 'webhook' | 'custom';
  name: string;
  config: Record<string, any>;
  enabled: boolean;
}

export interface ICampaign extends Document {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  bannerImage?: string;
  videoUrl?: string;
  status: 'draft' | 'active' | 'ended';
  fields: IFormField[];
  integrations?: IIntegration[];
  createdAt: Date;
  updatedAt: Date;
}

const formFieldSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  label: { type: String, required: true },
  type: { type: String, required: true },
  required: { type: Boolean, default: false },
  options: [String],
  validation: String,
});

const integrationSchema = new Schema({
  id: { type: String, required: true },
  type: { type: String, required: true },
  name: { type: String, required: true },
  config: { type: Map, of: Schema.Types.Mixed },
  enabled: { type: Boolean, default: true },
});

const campaignSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    bannerImage: String,
    videoUrl: String,
    status: { type: String, enum: ['draft', 'active', 'ended'], default: 'draft' },
    fields: [formFieldSchema],
    integrations: [integrationSchema],
  },
  { timestamps: true }
);

export const Campaign = mongoose.model<ICampaign>('Campaign', campaignSchema);
