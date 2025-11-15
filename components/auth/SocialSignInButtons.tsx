import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { AppleIcon, GoogleIcon } from '../Icons';

interface SocialSignInButtonsProps {
    setError: (error: string) => void;
    disabled?: boolean;
}

const SocialSignInButtons: React.FC<SocialSignInButtonsProps> = ({ setError, disabled }) => {
    const { loginWithGoogle, loginWithApple } = useAuth();

    const handleSocialSignIn = async (provider: 'google' | 'apple') => {
        if (disabled) return;
        try {
            setError('');
            if (provider === 'google') {
                await loginWithGoogle();
            } else {
                await loginWithApple();
            }
        } catch (error: any) {
            const providerName = provider.charAt(0).toUpperCase() + provider.slice(1);
            switch (error.code) {
                case 'auth/popup-closed-by-user':
                case 'auth/cancelled-popup-request':
                    // User intentionally closed the popup, so we don't show an error.
                    break;
                case 'auth/account-exists-with-different-credential':
                    setError('An account already exists with this email address. Please sign in using the method you originally used.');
                    break;
                default:
                    setError(`Could not sign in with ${providerName}. Please try again.`);
                    console.error(`Sign in with ${providerName} error:`, error);
                    break;
            }
        }
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
                <button
                    onClick={() => handleSocialSignIn('google')}
                    type="button"
                    disabled={disabled}
                    className="w-full inline-flex justify-center py-2 px-4 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-sm font-medium text-slate-500 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed dark:disabled:bg-slate-800 dark:disabled:text-slate-500"
                >
                    <GoogleIcon className="h-5 w-5 mr-2" />
                    Sign in with Google
                </button>
            </div>
             <div>
                <button
                    onClick={() => handleSocialSignIn('apple')}
                    type="button"
                    disabled={disabled}
                    className="w-full inline-flex justify-center py-2 px-4 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-sm font-medium text-slate-500 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed dark:disabled:bg-slate-800 dark:disabled:text-slate-500"
                >
                    <AppleIcon className="h-5 w-5 mr-2" />
                    Sign in with Apple
                </button>
            </div>
        </div>
    );
}

export default SocialSignInButtons;