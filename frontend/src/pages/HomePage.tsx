import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Gift, Trophy, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { campaignService } from '../services/api';
import type { Campaign } from '../types';

export default function HomePage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      const response = await campaignService.getAll();
      setCampaigns(response.data.filter((c) => c.status === 'active'));
    } catch (error) {
      console.error('Failed to load campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Enter to Win - Amazing Prizes Await!</title>
        <meta
          name="description"
          content="Enter our exciting promotional campaigns for a chance to win amazing prizes. Easy entry, incredible rewards!"
        />
        <meta
          name="keywords"
          content="sweepstakes, giveaway, contest, win prizes, enter to win"
        />
        <meta property="og:title" content="Enter to Win - Amazing Prizes Await!" />
        <meta
          property="og:description"
          content="Enter our exciting promotional campaigns for a chance to win amazing prizes."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="container py-20 md:py-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="inline-block mb-6"
              >
                <Sparkles className="w-16 h-16 text-primary-600 mx-auto" />
              </motion.div>
              <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                Enter to Win
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Participate in our exciting promotional campaigns and stand a chance to win
                incredible prizes!
              </p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <a href="#campaigns" className="btn btn-primary text-lg inline-flex items-center gap-2">
                  <Gift className="w-5 h-5" />
                  View Active Campaigns
                </a>
              </motion.div>
            </motion.div>
          </div>

          {/* Animated background elements */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
            <motion.div
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute top-20 left-10 w-20 h-20 bg-primary-200 rounded-full opacity-20 blur-xl"
            />
            <motion.div
              animate={{
                y: [0, 20, 0],
                rotate: [0, -5, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute bottom-20 right-10 w-32 h-32 bg-primary-300 rounded-full opacity-20 blur-xl"
            />
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="container">
            <h2 className="text-4xl font-display font-bold text-center mb-12">Why Enter?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Gift,
                  title: 'Amazing Prizes',
                  description: 'Win incredible prizes from top brands and exclusive rewards.',
                },
                {
                  icon: Trophy,
                  title: 'Easy Entry',
                  description: 'Simple forms and quick entry process. Your chance to win is just clicks away!',
                },
                {
                  icon: Sparkles,
                  title: 'Regular Campaigns',
                  description: 'New campaigns launched regularly. More chances to win throughout the year!',
                },
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="card text-center hover:shadow-xl transition-shadow"
                >
                  <feature.icon className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Active Campaigns Section */}
        <section id="campaigns" className="py-20 bg-gray-50">
          <div className="container">
            <h2 className="text-4xl font-display font-bold text-center mb-12">
              Active Campaigns
            </h2>
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
                <p className="mt-4 text-gray-600">Loading campaigns...</p>
              </div>
            ) : campaigns.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {campaigns.map((campaign, idx) => (
                  <motion.div
                    key={campaign.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Link
                      to={`/campaign/${campaign.id}`}
                      className="block card hover:shadow-2xl transition-all hover:-translate-y-1"
                    >
                      {campaign.bannerImage && (
                        <img
                          src={campaign.bannerImage}
                          alt={campaign.title}
                          className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                      )}
                      <h3 className="text-2xl font-semibold mb-3">{campaign.title}</h3>
                      <p className="text-gray-600 mb-4">{campaign.description}</p>
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>Ends: {new Date(campaign.endDate).toLocaleDateString()}</span>
                        <span className="btn btn-primary text-sm">Enter Now</span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600">
                  No active campaigns at the moment. Check back soon!
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="container text-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} Promotions Platform. All rights reserved.
            </p>
            <div className="mt-4">
              <Link to="/admin/login" className="text-gray-400 hover:text-white transition-colors">
                Admin Login
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
