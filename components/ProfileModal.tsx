import React, { useState } from 'react';
import { UserProfile } from '../types';

interface ProfileModalProps {
  onClose: () => void;
  onSave: (profile: Omit<UserProfile, 'id'>) => void;
  userProfile: UserProfile;
  onDelete: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ onClose, onSave, userProfile, onDelete }) => {
  const [fullName, setFullName] = useState(userProfile.fullName);
  const [dateOfBirth, setDateOfBirth] = useState(userProfile.dateOfBirth);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!dateOfBirth) {
        setError('Please enter your date of birth.');
        return;
    }

    setError('');
    onSave({
      fullName,
      dateOfBirth,
    });
  };
  
  const handleDelete = () => {
    onDelete();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">Your Profile</h2>

          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
              <input type="text" id="fullName" value={fullName} onChange={e => setFullName(e.target.value)} className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-sm focus:border-brand-primary focus:ring focus:ring-brand-primary focus:ring-opacity-50" required autoFocus />
            </div>
            <div>
              <label htmlFor="dob" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Date of Birth</label>
              <input type="date" id="dob" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-sm focus:border-brand-primary focus:ring focus:ring-brand-primary focus:ring-opacity-50" required />
            </div>
          </div>

          <div className="flex justify-between items-center mt-8">
             <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition text-sm font-medium"
            >
                Delete Profile
            </button>
            <div className="space-x-3">
                <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-500 transition">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-md bg-brand-primary text-white hover:bg-brand-secondary transition">Save Profile</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;