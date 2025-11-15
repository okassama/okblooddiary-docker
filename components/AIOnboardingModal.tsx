import React, { useState } from 'react';
import { AIProvider } from '../services/aiService';
import { LogoIcon } from './Icons';
import Spinner from './common/Spinner';

interface AIOnboardingModalProps {
    onComplete: (provider: AIProvider, apiKey: string) => void;
}

type ProviderOption = AIProvider | 'select';

const providerInfo: Record<Exclude<AIProvider, 'none'>, { name: string; url: string; }> = {
    gemini: { name: 'Google Gemini', url: 'https://aistudio.google.com/' },
    deepseek: { name: 'DeepSeek', url: 'https://platform.deepseek.com/' },
    perplexity: { name: 'Perplexity', url: 'https://www.perplexity.ai/settings/api' },
    openrouter: { name: 'OpenRouter', url: 'https://openrouter.ai/keys' },
};

const AIOnboardingModal: React.FC<AIOnboardingModalProps> = ({ onComplete }) => {
    const [selectedProvider, setSelectedProvider] = useState<ProviderOption>('select');
    const [apiKey, setApiKey] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSave = () => {
        if (selectedProvider === 'select' || selectedProvider === 'none') {
            setError('Please select an AI provider.');
            return;
        }

        if (!apiKey.trim()) {
            setError('Please enter a valid API key.');
            return;
        }

        setError('');
        setLoading(true);
        setTimeout(() => {
            onComplete(selectedProvider, apiKey);
        }, 300);
    };

    const handleSkip = () => {
        onComplete('none', '');
    };
    
    const showApiKeyInput = selectedProvider !== 'select' && selectedProvider !== 'none';

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="flex justify-center items-center mb-6 space-x-3">
                    <LogoIcon className="h-12 w-12 text-brand-primary" />
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
                        <span className="text-brand-primary">AI-Powered</span> Insights
                    </h1>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 md:p-8">
                    <p className="text-center text-slate-600 dark:text-slate-300 mb-6">
                        Get deeper analysis of your blood pressure trends. Provide your own API key to get started, or skip for basic insights.
                    </p>
                    <div className="space-y-4">
                        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-sm" role="alert">{error}</div>}
                        
                        <div>
                            <label htmlFor="ai-provider-select" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Select Provider</label>
                            <select
                                id="ai-provider-select"
                                value={selectedProvider}
                                onChange={(e) => setSelectedProvider(e.target.value as ProviderOption)}
                                className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-sm focus:border-brand-primary focus:ring focus:ring-brand-primary focus:ring-opacity-50"
                            >
                                <option value="select" disabled>-- Choose an option --</option>
                                {Object.entries(providerInfo).map(([key, { name }]) => (
                                    <option key={key} value={key}>{name}</option>
                                ))}
                            </select>
                        </div>
                        
                        {showApiKeyInput && (
                            <div>
                                <div className="flex justify-between items-baseline">
                                     <label htmlFor="api-key-onboarding" className="block text-sm font-medium text-slate-700 dark:text-slate-300">API Key</label>
                                     <a href={providerInfo[selectedProvider as Exclude<AIProvider, 'none'>].url} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-brand-primary hover:text-brand-secondary">
                                        Get API Key &rarr;
                                     </a>
                                </div>
                                <input 
                                    type="password" 
                                    id="api-key-onboarding"
                                    value={apiKey} 
                                    onChange={e => setApiKey(e.target.value)} 
                                    className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-sm focus:border-brand-primary focus:ring focus:ring-brand-primary focus:ring-opacity-50" 
                                    placeholder="Enter your API key here"
                                    required 
                                    autoFocus 
                                />
                            </div>
                        )}
                        
                         <div className="text-xs text-slate-500 dark:text-slate-400 p-3 bg-slate-100 dark:bg-slate-700 rounded-md border border-slate-200 dark:border-slate-600">
                            <strong>Privacy Note:</strong> Your API key is stored only in your browser's local storage and is never sent to our servers.
                        </div>

                        <div className="pt-4 space-y-3">
                            <button 
                                type="button" 
                                onClick={handleSave}
                                disabled={loading || selectedProvider === 'select'}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-brand-primary hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:opacity-50 disabled:cursor-not-allowed dark:focus:ring-offset-slate-800"
                            >
                                {loading ? <Spinner /> : 'Save and Continue'}
                            </button>
                             <button 
                                type="button" 
                                onClick={handleSkip}
                                className="w-full flex justify-center py-2 px-4 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm text-sm font-medium text-slate-700 dark:text-slate-200 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary dark:focus:ring-offset-slate-800"
                            >
                               Maybe Later
                            </button>
                        </div>
                    </div>
                </div>
            </div>
             <footer className="text-center py-4 mt-8 text-sm text-slate-500 dark:text-slate-400">
                Created By O Kassama
            </footer>
        </div>
    );
};

export default AIOnboardingModal;