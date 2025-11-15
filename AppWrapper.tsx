import React from 'react';
import { useAuth } from './contexts/AuthContext';
import AuthPage from './components/auth/AuthPage';
import App from './App';
import Spinner from './components/common/Spinner';

const AppWrapper: React.FC = () => {
    const { currentUser, isLocalMode, loading, logout, deleteAccount } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                <Spinner />
            </div>
        );
    }

    // If we are not in local mode and there's no logged-in user, show the auth page.
    if (!isLocalMode && !currentUser) {
        return <AuthPage />;
    }

    // Otherwise, show the main app.
    // In local mode, currentUser is null.
    // In Firebase mode, currentUser is the actual Firebase user.
    return <App 
        firebaseUser={isLocalMode ? null : currentUser} 
        onLogout={logout} 
        onDeleteAccount={deleteAccount}
    />;
};

export default AppWrapper;
