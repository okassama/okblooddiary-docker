
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Reading, UserProfile } from './types';
import Header from './components/Header';
import ReadingFormModal from './components/ReadingFormModal';
import ProfileModal from './components/ProfileModal';
import ReadingsList from './components/ReadingsList';
import BloodPressureChart from './components/BloodPressureChart';
import Insights from './components/Insights';
import ExportControls from './components/ExportControls';
import AIOnboardingModal from './components/AIOnboardingModal';
import { AddIcon } from './components/Icons';
import Spinner from './components/common/Spinner';
import * as dbService from './services/dbService';
import UserSelectionPage from './components/UserSelectionPage';
import CreateProfilePage from './components/CreateProfilePage';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [readings, setReadings] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreatingNewProfile, setIsCreatingNewProfile] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [showAIOnboarding, setShowAIOnboarding] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);
  
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const loadDataForUser = useCallback(async (user: UserProfile) => {
    setLoading(true);
    const userReadings = await dbService.getReadings(user.id);
    setReadings(userReadings);
    setCurrentUser(user);
    try {
      localStorage.setItem('lastUserId', String(user.id));
    } catch(e){ console.error("Could not save last user", e)}
    setLoading(false);
  }, []);

  useEffect(() => {
    const initializeApp = async () => {
      setLoading(true);
      const users = await dbService.getUsers();
      setAllUsers(users);
      
      // Don't force profile creation. Let the user choose from the selection screen.
      try {
        const lastUserId = localStorage.getItem('lastUserId');
        const lastUser = lastUserId ? users.find(u => u.id === parseInt(lastUserId, 10)) : null;
        if (lastUser) {
          await loadDataForUser(lastUser);
        } else {
           // If no last user, stay on selection screen by ensuring currentUser is null
           setCurrentUser(null);
        }
      } catch(e) { console.error("Could not get last user", e)}
      
      if (localStorage.getItem('aiProvider') === null) {
        setShowAIOnboarding(true);
      }
      setLoading(false);
    };
    initializeApp();
  }, [loadDataForUser]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('theme', theme);
    } catch (error) {
      console.error("Failed to save theme to localStorage", error);
    }
  }, [theme]);
  
  const handleAIOnboardingComplete = (provider: string, apiKey: string) => {
    try {
      localStorage.setItem('aiProvider', provider);
      localStorage.setItem('apiKey', apiKey);
      setShowAIOnboarding(false);
    } catch (e) {
      alert('Failed to save settings. Your browser might be in private mode.');
    }
  };
  
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center"><Spinner /></div>;
  }
  
  if (isCreatingNewProfile) {
    const handleCreateProfile = async (profileData: Omit<UserProfile, 'id'>) => {
       const newUserId = await dbService.addUser(profileData);
       const users = await dbService.getUsers();
       const newUser = users.find(u => u.id === newUserId);
       setAllUsers(users);
       if (newUser) {
         await loadDataForUser(newUser);
       }
       setIsCreatingNewProfile(false);
    };
    return <CreateProfilePage onProfileCreated={handleCreateProfile} isFirstUser={allUsers.length === 0} />;
  }
  
  if (!currentUser) {
     const handleDeleteUser = async (userId: number) => {
      if(window.confirm("Are you sure you want to delete this profile and all its data? This is permanent.")) {
        await dbService.deleteUser(userId);
        const updatedUsers = allUsers.filter(u => u.id !== userId);
        setAllUsers(updatedUsers);
      }
    }
    return <UserSelectionPage users={allUsers} onSelectUser={loadDataForUser} onCreateUser={() => setIsCreatingNewProfile(true)} onDeleteUser={handleDeleteUser} />;
  }

  const refreshReadings = async () => {
      if(currentUser) {
          const freshReadings = await dbService.getReadings(currentUser.id);
          setReadings(freshReadings);
      }
  }

  const handleAddReading = async (newReading: Omit<Reading, 'id' | 'userId'>) => {
    if (currentUser) {
      await dbService.addReading(currentUser.id, newReading);
      await refreshReadings();
    }
    setIsModalOpen(false);
  };

  const handleDeleteReading = async (id: number) => {
    await dbService.deleteReading(id);
    await refreshReadings();
  };
  
  const handleDeleteAllReadings = async () => {
    if (currentUser && window.confirm("Are you sure you want to delete all your readings? This action cannot be undone.")) {
      await dbService.deleteAllReadings(currentUser.id);
      await refreshReadings();
    }
  };

  const handleSaveProfile = async (profileData: Omit<UserProfile, 'id'>) => {
    if (currentUser) {
      const updatedProfile = { ...currentUser, ...profileData };
      await dbService.saveUserProfile(updatedProfile);
      setCurrentUser(updatedProfile);
    }
    setIsProfileModalOpen(false);
  };

  const handleSwitchUser = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('lastUserId');
    } catch (e) { console.error("Could not remove last user", e)}
  }
  
  const handleDeleteCurrentUser = async () => {
    if (currentUser) {
      if(window.confirm("Are you sure you want to delete this profile and all its data? This is permanent.")) {
        await dbService.deleteUser(currentUser.id);
        const updatedUsers = allUsers.filter(u => u.id !== currentUser.id);
        setAllUsers(updatedUsers);
        setCurrentUser(null);
        localStorage.removeItem('lastUserId');
        // No longer force profile creation. Fallback to user selection page.
      }
      setIsProfileModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans flex flex-col">
      {showAIOnboarding && <AIOnboardingModal onComplete={handleAIOnboardingComplete} />}
      
      <Header 
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onToggleTheme={toggleTheme}
        theme={theme}
        currentUser={currentUser}
        onSwitchUser={handleSwitchUser}
      />
      <main className="container mx-auto p-4 md:p-6 lg:p-8 space-y-8 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <BloodPressureChart readings={readings} ref={chartRef} />
            <ReadingsList readings={readings} onDelete={handleDeleteReading} />
          </div>
          <div className="space-y-8">
            <Insights readings={readings} />
            <ExportControls 
              readings={readings} 
              deleteAllReadings={handleDeleteAllReadings} 
              userProfile={currentUser}
            />
          </div>
        </div>
      </main>
      
      <footer className="text-center py-4 text-sm text-slate-500 dark:text-slate-400">
        Created By O Kassama
      </footer>

      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 bg-brand-primary hover:bg-brand-secondary text-white rounded-full p-4 shadow-lg transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary dark:focus:ring-offset-slate-900"
        aria-label="Add new blood pressure reading"
      >
        <AddIcon className="h-8 w-8" />
      </button>

      {isModalOpen && (
        <ReadingFormModal
          onClose={() => setIsModalOpen(false)}
          onSave={handleAddReading}
          readings={readings}
        />
      )}

      {isProfileModalOpen && (
        <ProfileModal 
          onClose={() => setIsProfileModalOpen(false)}
          onSave={handleSaveProfile}
          userProfile={currentUser}
          onDelete={handleDeleteCurrentUser}
        />
      )}
    </div>
  );
};

export default App;
