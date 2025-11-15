import React from 'react';
import { UserProfile } from '../types';
import { LogoIcon, UserIcon, SunIcon, MoonIcon, LogoutIcon } from './Icons';

interface HeaderProps {
  onOpenProfile: () => void;
  onToggleTheme: () => void;
  theme: 'light' | 'dark';
  currentUser: UserProfile;
  onSwitchUser: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenProfile, onToggleTheme, theme, currentUser, onSwitchUser }) => {
  
  return (
    <header className="bg-white dark:bg-slate-800 shadow-md">
      <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <LogoIcon className="h-10 w-10 text-brand-primary" />
          <h1 className="text-2xl md:text-3xl font-bold text-brand-primary">
            OK Blood Diary
          </h1>
        </div>
         <div className="hidden md:flex items-center space-x-2">
            <UserIcon className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            <span className="font-medium text-slate-700 dark:text-slate-300">{currentUser.fullName}</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary dark:focus:ring-offset-slate-800"
            aria-label="Toggle dark mode"
          >
            {theme === 'light' ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6" />}
          </button>
          <button
            onClick={onOpenProfile}
            className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary dark:focus:ring-offset-slate-800"
            aria-label="Open user profile"
          >
            <UserIcon className="h-6 w-6" />
          </button>
           <button
            onClick={onSwitchUser}
            className="flex items-center space-x-2 p-2 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary dark:focus:ring-offset-slate-800"
            aria-label={'Switch User'}
          >
            <LogoutIcon className="h-6 w-6" />
            <span className="hidden md:inline text-sm font-medium">Switch User</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;