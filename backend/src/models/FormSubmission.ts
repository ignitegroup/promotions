import mongoose, { Schema, Document } from 'mongoose';

export interface IFormSubmission extends Document {
  campaignId: mongoose.Types.ObjectId;
  data: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  submittedAt: Date;
}

const submissionSchema = new Schema(
  {
    campaignId: { type: Schema.Types.ObjectId, ref: 'Campaign', required: true },
    data: { type: Map, of: Schema.Types.Mixed, required: true },
    ipAddress: String,
    userAgent: String,
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

submissionSchema.index({ campaignId: 1, submittedAt: -1 });

export const FormSubmission = mongoose.model<IFormSubmission>('FormSubmission', submissionSchema);
