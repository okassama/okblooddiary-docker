import React, { useState } from 'react';
import { AIProvider } from '../services/aiService';

interface AISettingsModalProps {
  onClose: () => void;
  onSave: (provider: AIProvider, apiKey: string) => void;
  currentProvider: AIProvider;
  currentApiKey: string;
}

const providerNames: Record<AIProvider, string> = {
    'none': 'None (Basic Insights)',
    'gemini': 'Google Gemini',
    'deepseek': 'DeepSeek',
    'perplexity': 'Perplexity',
    'openrouter': 'OpenRouter'
};

const AISettingsModal: React.FC<AISettingsModalProps> = ({ onClose, onSave, currentProvider, currentApiKey }) => {
    const [provider, setProvider] = useState<AIProvider>(currentProvider);
    const [apiKey, setApiKey] = useState(currentApiKey);

    const handleSave = () => {
        const keyToSave = provider === 'none' ? '' : apiKey;
        onSave(provider, keyToSave);
        onClose();
    };

    const showApiKeyInput = provider !== 'none';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white">AI Insights Settings</h2>
                    
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="ai-provider" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Select Provider
                            </label>
                            <select
                                id="ai-provider"
                                value={provider}
                                onChange={(e) => setProvider(e.target.value as AIProvider)}
                                className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-sm focus:border-brand-primary focus:ring focus:ring-brand-primary focus:ring-opacity-50"
                            >
                                {(Object.keys(providerNames) as AIProvider[]).map((key) => (
                                    <option key={key} value={key}>{providerNames[key]}</option>
                                ))}
                            </select>
                        </div>
                        
                        {showApiKeyInput && (
                            <div>
                                <label htmlFor="api-key" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    API Key for {providerNames[provider]}
                                </label>
                                <input
                                    type="password"
                                    id="api-key"
                                    value={apiKey}
                                    onChange={e => setApiKey(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-sm focus:border-brand-primary focus:ring focus:ring-brand-primary focus:ring-opacity-50"
                                    placeholder="Enter your API key"
                                    autoComplete="off"
                                />
                            </div>
                        )}
                        <div className="text-xs text-slate-500 dark:text-slate-400 p-3 bg-slate-100 dark:bg-slate-700 rounded-md border border-slate-200 dark:border-slate-600">
                            <strong>Privacy Note:</strong> Your API key is stored only in your browser's local storage and is sent directly to the selected AI provider. It never touches our servers.
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-500 transition">Cancel</button>
                        <button onClick={handleSave} className="px-4 py-2 rounded-md bg-brand-primary text-white hover:bg-brand-secondary transition">Save Settings</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AISettingsModal;