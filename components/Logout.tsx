import React from 'react';
import { View } from '../types';
import { CheckCircleIcon } from './icons';

interface LogoutProps {
    setView: (view: View) => void;
}

const Logout: React.FC<LogoutProps> = ({ setView }) => {
    return (
        <div className="flex items-center justify-center h-full p-4">
            <div className="text-center bg-white p-12 rounded-xl shadow-md">
                <CheckCircleIcon className="w-16 h-16 mx-auto text-green-500" />
                <h1 className="text-3xl font-bold text-neutral-800 mt-4">Logged Out Successfully</h1>
                <p className="text-neutral-500 mt-2">You have been securely logged out of SchoolHub.</p>
                <button 
                    onClick={() => setView(View.Dashboard)}
                    className="mt-8 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark shadow-sm transition-colors"
                >
                    Log In Again
                </button>
            </div>
        </div>
    );
};

export default Logout;
