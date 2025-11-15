import React, { useState, useEffect } from 'react';
import { Reading } from '../types';
import { getAIInsights, AIProvider } from '../services/aiService';
import AISettingsModal from './AISettingsModal';
import { BPCategory } from '../types';
import { BP_CATEGORIES_INFO } from '../constants';
import { getBPCategory } from '../utils/bpUtils';
import { SparklesIcon, SettingsIcon } from './Icons';

interface InsightsProps {
  readings: Reading[];
}

const BPCategoryVisualizer: React.FC<{readings: Reading[]}> = ({ readings }) => {
    const latestReading = readings[0];
    const category = latestReading ? getBPCategory(latestReading.systolic, latestReading.diastolic) : BPCategory.Normal;
    const categoryInfo = BP_CATEGORIES_INFO[category];

    return (
        <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4 text-slate-800 dark:text-white">What Your Numbers Mean</h3>
            {latestReading ? (
                 <div className={`p-4 rounded-lg border-l-4 ${categoryInfo.borderColor} ${categoryInfo.color.replace('bg-', 'bg-opacity-10')}`}>
                    <p className={`text-lg font-bold ${categoryInfo.textColor}`}>{category}</p>
                    <p className="font-semibold text-slate-700 dark:text-slate-300">{categoryInfo.range}</p>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{categoryInfo.description}</p>
                </div>
            ) : (
                <p className="text-slate-500 dark:text-slate-400">Your latest reading will be categorized here.</p>
            )}

            <div className="mt-6 space-y-2">
                {Object.entries(BP_CATEGORIES_INFO).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-2">
                        <div className={`w-4 h-4 rounded-full ${value.color}`}></div>
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{key}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};


const Insights: React.FC<InsightsProps> = ({ readings }) => {
  const [insights, setInsights] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [aiProvider, setAiProvider] = useState<AIProvider>('none');
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    try {
        const savedProvider = localStorage.getItem('aiProvider') as AIProvider | null;
        const savedApiKey = localStorage.getItem('apiKey') || '';
        if (savedProvider) {
            setAiProvider(savedProvider);
        }
        setApiKey(savedApiKey);
    } catch (e) {
        console.error("Could not read AI settings from localStorage");
    }
  }, []);

  const handleSaveSettings = (provider: AIProvider, key: string) => {
    try {
        localStorage.setItem('aiProvider', provider);
        localStorage.setItem('apiKey', key);
        setAiProvider(provider);
        setApiKey(key);
        setError(''); // Clear previous errors on save
    } catch (e) {
        setError("Could not save settings. Your browser might be in private mode.");
        console.error("Could not save AI settings to localStorage", e);
    }
  };

  // Using readings.length as a dependency is more reliable than the object itself
  const readingsKey = readings.map(r => r.id).join(',');

  useEffect(() => {
    const fetchInsights = async () => {
      if (readings.length === 0) {
        setInsights('');
        setError('');
        return;
      }
      
      const isKeyNeeded = aiProvider !== 'none' && aiProvider !== 'gemini';
      if (isKeyNeeded && !apiKey) {
          setInsights(`Please configure your API key in the settings to get insights from ${aiProvider}.`);
          setError('');
          setIsLoading(false);
          return;
      }

      setIsLoading(true);
      setError('');
      try {
        const result = await getAIInsights(readings, aiProvider, apiKey);
        setInsights(result);
      } catch (e: any) {
        console.error("Error fetching insights:", e);
        setError(e.message || `Failed to get insights. Please check your API key and network connection.`);
        setInsights('');
      } finally {
        setIsLoading(false);
      }
    };
    
    const debounceTimer = setTimeout(() => {
        fetchInsights();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [readingsKey, aiProvider, apiKey]); // Use key instead of readings object

  return (
    <>
        <BPCategoryVisualizer readings={readings} />
        <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white flex items-center">
                    <SparklesIcon className="h-6 w-6 text-brand-primary mr-2" />
                    {aiProvider === 'none' ? 'Insights' : 'AI-Powered Insights'}
                </h3>
                <button
                    onClick={() => setIsSettingsModalOpen(true)}
                    className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary dark:focus:ring-offset-slate-800"
                    aria-label="Configure AI Insights"
                >
                    <SettingsIcon className="h-5 w-5" />
                </button>
            </div>

            {isLoading ? (
                <div className="animate-pulse space-y-2">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
                </div>
            ) : error ? (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                </div>
            ) : (
                 <>
                    <div className="prose prose-sm dark:prose-invert max-w-none text-slate-600 dark:text-slate-300" dangerouslySetInnerHTML={{ __html: insights.replace(/\n/g, '<br />') }}></div>
                    
                    {aiProvider === 'none' && readings.length >= 3 && (
                        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 text-center">
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Want deeper analysis and personalized wellness tips?</p>
                            <button
                                onClick={() => setIsSettingsModalOpen(true)}
                                className="inline-flex items-center px-4 py-2 rounded-md bg-brand-light dark:bg-brand-dark text-brand-primary font-semibold hover:bg-emerald-100 dark:hover:bg-slate-700 transition"
                            >
                                <SparklesIcon className="h-5 w-5 mr-2" />
                                Configure AI Insights
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
        
        {isSettingsModalOpen && (
            <AISettingsModal
                onClose={() => setIsSettingsModalOpen(false)}
                onSave={handleSaveSettings}
                currentProvider={aiProvider}
                currentApiKey={apiKey}
            />
        )}
    </>
  );
};

export default Insights;