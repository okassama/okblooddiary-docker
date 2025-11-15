import React, { useState } from 'react';
import { UserProfile } from '../types';
import { LogoIcon } from './Icons';
import Spinner from './common/Spinner';

interface CreateProfilePageProps {
    onProfileCreated: (profile: Omit<UserProfile, 'id'>) => void;
    isFirstUser: boolean;
}

const CreateProfilePage: React.FC<CreateProfilePageProps> = ({ onProfileCreated, isFirstUser }) => {
    const [fullName, setFullName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!fullName.trim()) {
          setError('Please enter your full name.');
          return;
        }
        if (!dateOfBirth) {
            setError('Please enter your date of birth.');
            return;
        }
        if (password && password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setError('');
        setLoading(true);
        try {
            await onProfileCreated({ fullName, dateOfBirth, password });
        } catch (err) {
            setError('Could not save profile. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="flex justify-center items-center mb-6 space-x-3">
                    <LogoIcon className="h-12 w-12 text-brand-primary" />
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
                        {isFirstUser ? "Welcome to" : "Create New Profile"} <span className="text-brand-primary">OK Blood Diary</span>
                    </h1>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 md:p-8">
                    <p className="text-center text-slate-600 dark:text-slate-300 mb-6">
                        {isFirstUser 
                            ? "To get started, please create your profile. This information is used for personalizing your data exports."
                            : "Add a new profile to track readings for another person on this device."
                        }
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-sm" role="alert">{error}</div>}
                        
                        <div>
                            <label htmlFor="fullName-welcome" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                            <input 
                                type="text" 
                                id="fullName-welcome" 
                                value={fullName} 
                                onChange={e => setFullName(e.target.value)} 
                                className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-sm focus:border-brand-primary focus:ring focus:ring-brand-primary focus:ring-opacity-50" 
                                required 
                                autoFocus 
                            />
                        </div>
                        <div>
                            <label htmlFor="dob-welcome" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Date of Birth</label>
                            <input 
                                type="date" 
                                id="dob-welcome" 
                                value={dateOfBirth} 
                                onChange={e => setDateOfBirth(e.target.value)} 
                                className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-sm focus:border-brand-primary focus:ring focus:ring-brand-primary focus:ring-opacity-50" 
                                required 
                            />
                        </div>
                        <div>
                            <label htmlFor="password-create" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password (optional, min. 6 chars)</label>
                            <input
                                type="password"
                                id="password-create"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-sm focus:border-brand-primary focus:ring focus:ring-brand-primary focus:ring-opacity-50"
                            />
                        </div>
                        <div>
                            <label htmlFor="confirm-password-create" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Confirm Password</label>
                            <input
                                type="password"
                                id="confirm-password-create"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-sm focus:border-brand-primary focus:ring focus:ring-brand-primary focus:ring-opacity-50"
                                disabled={!password}
                            />
                        </div>

                        <div className="pt-4">
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-brand-primary hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:opacity-50 dark:focus:ring-offset-slate-800"
                            >
                                {loading ? <Spinner /> : isFirstUser ? 'Save Profile and Start' : 'Create Profile'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
             <footer className="text-center py-4 mt-8 text-sm text-slate-500 dark:text-slate-400">
                Created By O Kassama
            </footer>
        </div>
    );
};

export default CreateProfilePage;