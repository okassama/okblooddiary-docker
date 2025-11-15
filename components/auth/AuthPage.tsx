import React, { useState } from 'react';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import { LogoIcon } from '../Icons';
import { useAuth } from '../../contexts/AuthContext';

type AuthForm = 'signin' | 'signup';

const AuthPage: React.FC = () => {
  const [activeForm, setActiveForm] = useState<AuthForm>('signin');
  const { continueLocally, firebaseEnabled } = useAuth();

  const tabClasses = (formType: AuthForm) => 
    `w-full py-3 text-center font-semibold cursor-pointer transition-colors duration-300 focus:outline-none ${
      activeForm === formType 
        ? 'text-brand-primary border-b-2 border-brand-primary' 
        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
    }`;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center items-center mb-6 space-x-3">
            <LogoIcon className="h-12 w-12 text-brand-primary" />
            <h1 className="text-3xl font-bold text-brand-primary">
                OK Blood Diary
            </h1>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl overflow-hidden">
          <div className="flex">
            <button onClick={() => setActiveForm('signin')} className={tabClasses('signin')}>
              Sign In
            </button>
            <button onClick={() => setActiveForm('signup')} className={tabClasses('signup')}>
              Sign Up
            </button>
          </div>
          <div className="p-6 md:p-8">
            {!firebaseEnabled && (
                <div className="text-center bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 mb-6 rounded-md">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        <strong>Cloud Sync Not Available</strong>
                        <br/>
                        To enable cloud features, add your Firebase credentials to the <code>services/firebase.ts</code> file.
                        <br/>
                        You can continue with local-only storage.
                    </p>
                </div>
            )}
            {activeForm === 'signin' 
                ? <SignInForm disabled={!firebaseEnabled} /> 
                : <SignUpForm disabled={!firebaseEnabled} />
            }
          </div>
        </div>

        <div className="text-center mt-6">
            <button 
                onClick={continueLocally}
                className="w-full sm:w-auto px-6 py-2 border border-brand-primary text-brand-primary font-semibold rounded-md hover:bg-brand-light dark:hover:bg-brand-dark/50 transition-colors"
            >
                Or continue without an account
            </button>
        </div>
      </div>
       <footer className="text-center py-4 mt-8 text-sm text-slate-500 dark:text-slate-400">
        Created By O Kassama
      </footer>
    </div>
  );
};

export default AuthPage;