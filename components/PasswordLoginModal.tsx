import React, { useState } from 'react';
import { UserProfile } from '../types';

interface PasswordLoginModalProps {
  user: UserProfile;
  onClose: () => void;
  onSuccess: () => void;
}

const PasswordLoginModal: React.FC<PasswordLoginModalProps> = ({ user, onClose, onSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === user.password) {
      onSuccess();
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="p-6">
          <h2 className="text-2xl font-bold mb-2 text-slate-800 dark:text-white">Enter Password</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            For profile: <span className="font-semibold">{user.fullName}</span>
          </p>

          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
          
          <div>
            <label htmlFor="password-login" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
            <input 
              type="password" 
              id="password-login" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-sm focus:border-brand-primary focus:ring focus:ring-brand-primary focus:ring-opacity-50" 
              required 
              autoFocus 
            />
          </div>

          <div className="flex justify-end space-x-3 mt-8">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-500 transition">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-md bg-brand-primary text-white hover:bg-brand-secondary transition">Log In</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordLoginModal;