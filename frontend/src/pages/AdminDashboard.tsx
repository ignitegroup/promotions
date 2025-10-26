import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Users,
  Settings,
  Plus,
  Download,
  Eye,
  Edit,
  Trash2,
  LogOut,
} from 'lucide-react';
import { campaignService, submissionService, authService } from '../services/api';
import type { Campaign, FormSubmission } from '../types';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [submissions, setSubmissions] = useState<Record<string, FormSubmission[]>>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'campaigns' | 'submissions' | 'integrations'>(
    'campaigns'
  );

  useEffect(() => {
    checkAuth();
    loadData();
  }, []);

  const checkAuth = async () => {
    try {
      await authService.getCurrentUser();
    } catch (error) {
      navigate('/admin/login');
    }
  };

  const loadData = async () => {
    try {
      const campaignsRes = await campaignService.getAll();
      setCampaigns(campaignsRes.data);

      // Load submissions for each campaign
      const submissionsData: Record<string, FormSubmission[]> = {};
      for (const campaign of campaignsRes.data) {
        try {
          const subRes = await submissionService.getByCampaign(campaign.id);
          submissionsData[campaign.id] = subRes.data;
        } catch (err) {
          submissionsData[campaign.id] = [];
        }
      }
      setSubmissions(submissionsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/admin/login');
  };

  const handleExport = async (campaignId: string) => {
    try {
      const response = await submissionService.export(campaignId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `submissions-${campaignId}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Failed to export:', error);
    }
  };

  const totalSubmissions = Object.values(submissions).reduce(
    (sum, subs) => sum + subs.length,
    0
  );

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Promotions Platform</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="container py-4 flex justify-between items-center">
            <h1 className="text-2xl font-display font-bold">Admin Dashboard</h1>
            <button onClick={handleLogout} className="btn btn-secondary flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </header>

        {/* Stats */}
        <section className="container py-8">
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Total Campaigns</p>
                  <p className="text-3xl font-bold">{campaigns.length}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Total Submissions</p>
                  <p className="text-3xl font-bold">{totalSubmissions}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Settings className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Active Campaigns</p>
                  <p className="text-3xl font-bold">
                    {campaigns.filter((c) => c.status === 'active').length}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <section className="container py-8">
          <div className="card">
            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex gap-8">
                {(['campaigns', 'submissions', 'integrations'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                      activeTab === tab
                        ? 'border-primary-600 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            {/* Campaigns Tab */}
            {activeTab === 'campaigns' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">Campaigns</h2>
                  <button className="btn btn-primary flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    New Campaign
                  </button>
                </div>

                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
                  </div>
                ) : campaigns.length > 0 ? (
                  <div className="space-y-4">
                    {campaigns.map((campaign) => (
                      <div
                        key={campaign.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold mb-2">{campaign.title}</h3>
                            <p className="text-gray-600 mb-2">{campaign.description}</p>
                            <div className="flex gap-4 text-sm text-gray-500">
                              <span>Status: {campaign.status}</span>
                              <span>
                                Submissions: {submissions[campaign.id]?.length || 0}
                              </span>
                              <span>
                                Ends: {new Date(campaign.endDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                              <Eye className="w-5 h-5 text-gray-600" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                              <Edit className="w-5 h-5 text-gray-600" />
                            </button>
                            <button
                              onClick={() => handleExport(campaign.id)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <Download className="w-5 h-5 text-gray-600" />
                            </button>
                            <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 className="w-5 h-5 text-red-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-600">No campaigns yet. Create your first campaign!</p>
                  </div>
                )}
              </div>
            )}

            {/* Submissions Tab */}
            {activeTab === 'submissions' && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">Recent Submissions</h2>
                <div className="space-y-6">
                  {campaigns.map((campaign) => {
                    const campaignSubs = submissions[campaign.id] || [];
                    if (campaignSubs.length === 0) return null;

                    return (
                      <div key={campaign.id}>
                        <h3 className="text-lg font-semibold mb-3">{campaign.title}</h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="space-y-2">
                            {campaignSubs.slice(0, 5).map((sub) => (
                              <div
                                key={sub.id}
                                className="bg-white p-3 rounded border border-gray-200"
                              >
                                <div className="flex justify-between items-center">
                                  <div className="text-sm">
                                    <span className="font-medium">
                                      {sub.data.name || sub.data.email}
                                    </span>
                                    <span className="text-gray-500 ml-2">
                                      {new Date(sub.submittedAt).toLocaleString()}
                                    </span>
                                  </div>
                                  <button className="text-primary-600 hover:text-primary-700 text-sm">
                                    View Details
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                          {campaignSubs.length > 5 && (
                            <button className="mt-3 text-primary-600 hover:text-primary-700 text-sm">
                              View all {campaignSubs.length} submissions
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Integrations Tab */}
            {activeTab === 'integrations' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">Integrations</h2>
                  <button className="btn btn-primary flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Integration
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    {
                      name: 'GoHighLevel',
                      description: 'Connect with GoHighLevel CRM',
                      status: 'Not Connected',
                    },
                    {
                      name: 'Rampwin',
                      description: 'Integrate with Rampwin platform',
                      status: 'Not Connected',
                    },
                    {
                      name: 'Custom Webhook',
                      description: 'Send data to custom endpoints',
                      status: 'Not Connected',
                    },
                    {
                      name: 'Email Notifications',
                      description: 'Automated email notifications',
                      status: 'Not Connected',
                    },
                  ].map((integration, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold mb-2">{integration.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{integration.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">{integration.status}</span>
                        <button className="btn btn-secondary text-sm">Configure</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
