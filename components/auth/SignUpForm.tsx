import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import SocialSignInButtons from './SocialSignInButtons';

interface SignUpFormProps {
    disabled?: boolean;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ disabled }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) return;
    setError('');

    if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
    }

    setLoading(true);
    try {
      await signup(email, password);
    } catch (err: any) {
        switch(err.code) {
            case 'auth/email-already-in-use':
                setError('This email address is already in use.');
                break;
            case 'auth/invalid-email':
                setError('Please enter a valid email address.');
                break;
            case 'auth/weak-password':
                setError('Password is too weak. Please choose a stronger password.');
                break;
            default:
                setError('Failed to create an account. Please try again.');
                break;
        }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
        <SocialSignInButtons setError={setError} disabled={disabled}/>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-300 dark:border-slate-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white dark:bg-slate-800 px-2 text-slate-500 dark:text-slate-400">
              Or sign up with email
            </span>
          </div>
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-sm" role="alert">{error}</div>}
      
      <div>
        <label htmlFor="email-signup" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Email address
        </label>
        <div className="mt-1">
          <input
            id="email-signup"
            name="email"
            type="email"
            autoComplete="email"
            required
            disabled={disabled}
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-sm focus:border-brand-primary focus:ring focus:ring-brand-primary focus:ring-opacity-50 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password-signup" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Password
        </label>
        <div className="mt-1">
          <input
            id="password-signup"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            disabled={disabled}
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-sm focus:border-brand-primary focus:ring focus:ring-brand-primary focus:ring-opacity-50 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading || disabled}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:bg-brand-primary/60 disabled:cursor-not-allowed dark:focus:ring-offset-slate-800"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </div>
    </form>
  );
};

export default SignUpForm;