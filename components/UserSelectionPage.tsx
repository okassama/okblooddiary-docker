

import React, { useState } from 'react';
import { UserProfile } from '../types';
import { LogoIcon, UserIcon, DeleteIcon, AddIcon } from './Icons';
import PasswordLoginModal from './PasswordLoginModal';

interface UserSelectionPageProps {
    users: UserProfile[];
    onSelectUser: (user: UserProfile) => void;
    onCreateUser: () => void;
    onDeleteUser: (userId: number) => void;
}

const UserSelectionPage: React.FC<UserSelectionPageProps> = ({ users, onSelectUser, onCreateUser, onDeleteUser }) => {
    
    const [selectedUserForLogin, setSelectedUserForLogin] = useState<UserProfile | null>(null);

    const handleUserClick = (user: UserProfile) => {
        if (user.password) {
            setSelectedUserForLogin(user);
        } else {
            onSelectUser(user);
        }
    };
    
    const handleLoginSuccess = () => {
        if (selectedUserForLogin) {
            onSelectUser(selectedUserForLogin);
        }
        setSelectedUserForLogin(null);
    };

    const handleBubbleClick = (e: React.MouseEvent, user: UserProfile) => {
        if ((e.target as HTMLElement).closest('button.delete-button')) {
            return;
        }
        handleUserClick(user);
    }

    return (
        <>
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-md text-center">
                    <div className="flex justify-center items-center mb-6 space-x-3">
                        <LogoIcon className="h-12 w-12 text-brand-primary" />
                        <h1 className="text-3xl font-bold text-brand-primary">
                            OK Blood Diary
                        </h1>
                    </div>

                    <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-200 mb-8">Who is logging in?</h2>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                        {users.map(user => (
                            <div key={user.id} onClick={(e) => handleBubbleClick(e, user)} className="relative group cursor-pointer flex flex-col items-center p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-200">
                                <div className="w-20 h-20 bg-brand-light dark:bg-brand-dark rounded-full flex items-center justify-center mb-3">
                                    <UserIcon className="h-10 w-10 text-brand-primary dark:text-brand-light" />
                                </div>
                                <p className="font-semibold text-slate-800 dark:text-slate-200 truncate w-full">{user.fullName}</p>
                                <button
                                    onClick={() => onDeleteUser(user.id)}
                                    className="delete-button absolute top-1 right-1 p-1.5 bg-red-100 dark:bg-red-900/50 text-red-500 dark:text-red-400 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-200 dark:hover:bg-red-900 transition-opacity"
                                    aria-label={`Delete profile for ${user.fullName}`}
                                >
                                    <DeleteIcon className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                        <div onClick={onCreateUser} className="cursor-pointer flex flex-col items-center justify-center p-4 bg-slate-100 dark:bg-slate-800/50 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                            <div className="w-20 h-20 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center mb-3">
                                <AddIcon className="h-10 w-10 text-slate-500 dark:text-slate-400" />
                            </div>
                            <p className="font-semibold text-slate-600 dark:text-slate-300">Add Profile</p>
                        </div>
                    </div>
                </div>
                <footer className="text-center py-4 mt-8 text-sm text-slate-500 dark:text-slate-400">
                    Created By O Kassama
                </footer>
            </div>
            {selectedUserForLogin && (
                <PasswordLoginModal
                    user={selectedUserForLogin}
                    onClose={() => setSelectedUserForLogin(null)}
                    onSuccess={handleLoginSuccess}
                />
            )}
        </>
    );
};

export default UserSelectionPage;