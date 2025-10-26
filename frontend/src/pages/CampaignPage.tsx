import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { campaignService, submissionService } from '../services/api';
import type { Campaign } from '../types';

export default function CampaignPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (id) {
      loadCampaign(id);
    }
  }, [id]);

  const loadCampaign = async (campaignId: string) => {
    try {
      const response = await campaignService.getById(campaignId);
      setCampaign(response.data);
      
      // Build dynamic schema
      const schemaFields: any = {};
      response.data.fields.forEach((field) => {
        let fieldSchema = z.string();
        
        if (field.required) {
          fieldSchema = fieldSchema.min(1, `${field.label} is required`);
        }
        
        if (field.type === 'email') {
          fieldSchema = fieldSchema.email('Invalid email address');
        }
        
        if (field.type === 'phone') {
          fieldSchema = fieldSchema.regex(/^\+?[\d\s-()]+$/, 'Invalid phone number');
        }
        
        schemaFields[field.name] = fieldSchema;
      });
      
      setFormSchema(z.object(schemaFields));
    } catch (error) {
      console.error('Failed to load campaign:', error);
    } finally {
      setLoading(false);
    }
  };

  const [formSchema, setFormSchema] = useState<any>(z.object({}));

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: any) => {
    if (!id) return;

    try {
      await submissionService.create(id, data);
      setSubmitted(true);
    } catch (error) {
      console.error('Failed to submit:', error);
      alert('Failed to submit form. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Campaign not found</h1>
          <button onClick={() => navigate('/')} className="btn btn-primary">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <>
        <Helmet>
          <title>Thank You - {campaign.title}</title>
        </Helmet>
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card max-w-lg text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
            </motion.div>
            <h1 className="text-3xl font-display font-bold mb-4">Thank You!</h1>
            <p className="text-lg text-gray-600 mb-8">
              Your entry has been successfully submitted. Good luck!
            </p>
            <button onClick={() => navigate('/')} className="btn btn-primary">
              Back to Home
            </button>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{campaign.title} - Enter to Win</title>
        <meta name="description" content={campaign.description} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="container py-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Campaigns
            </button>
          </div>
        </header>

        <div className="container py-12">
          <div className="max-w-3xl mx-auto">
            {/* Campaign Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              {campaign.bannerImage && (
                <img
                  src={campaign.bannerImage}
                  alt={campaign.title}
                  className="w-full h-64 object-cover rounded-xl mb-6"
                />
              )}
              
              {campaign.videoUrl && (
                <div className="mb-6 rounded-xl overflow-hidden">
                  <video
                    controls
                    className="w-full"
                    poster={campaign.bannerImage}
                  >
                    <source src={campaign.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}

              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
                {campaign.title}
              </h1>
              <p className="text-xl text-gray-600 mb-4">{campaign.description}</p>
              <div className="flex gap-4 text-sm text-gray-500">
                <span>Starts: {new Date(campaign.startDate).toLocaleDateString()}</span>
                <span>Ends: {new Date(campaign.endDate).toLocaleDateString()}</span>
              </div>
            </motion.div>

            {/* Entry Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card"
            >
              <h2 className="text-2xl font-semibold mb-6">Enter to Win</h2>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {campaign.fields.map((field) => (
                  <div key={field.id}>
                    <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    
                    {field.type === 'textarea' ? (
                      <textarea
                        id={field.name}
                        {...register(field.name)}
                        className="input"
                        rows={4}
                      />
                    ) : field.type === 'select' ? (
                      <select
                        id={field.name}
                        {...register(field.name)}
                        className="input"
                      >
                        <option value="">Select an option</option>
                        {field.options?.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : field.type === 'checkbox' ? (
                      <div className="flex items-center">
                        <input
                          id={field.name}
                          type="checkbox"
                          {...register(field.name)}
                          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <label htmlFor={field.name} className="ml-2 text-sm text-gray-600">
                          {field.label}
                        </label>
                      </div>
                    ) : (
                      <input
                        id={field.name}
                        type={field.type}
                        {...register(field.name)}
                        className="input"
                        placeholder={field.label}
                      />
                    )}
                    
                    {errors[field.name] && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors[field.name]?.message as string}
                      </p>
                    )}
                  </div>
                ))}

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn btn-primary"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Entry'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
