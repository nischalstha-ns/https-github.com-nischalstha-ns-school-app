import React, { useState } from 'react';
import { XIcon } from './icons';

interface LoginProps {
    onLoginSuccess: () => void;
}

const ForgotPasswordModal: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate sending a reset link
        console.log(`Password reset link sent to ${email}`);
        setIsSent(true);
    };
    
    const handleClose = () => {
        setIsSent(false);
        setEmail('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
                 <button onClick={handleClose} className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600"><XIcon className="w-6 h-6" /></button>
                {isSent ? (
                    <div className="text-center">
                        <h3 className="text-lg font-bold text-neutral-800">Check your email</h3>
                        <p className="mt-2 text-sm text-neutral-600">We've sent a password reset link to <strong>{email}</strong>.</p>
                         <button onClick={handleClose} className="mt-4 w-full px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark">Close</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <h3 className="text-lg font-bold text-neutral-800">Forgot Password</h3>
                        <p className="mt-2 text-sm text-neutral-600">Enter your email and we'll send you a link to reset your password.</p>
                        <div className="mt-4">
                            <label htmlFor="reset-email" className="block text-sm font-medium text-neutral-700">Email Address</label>
                            <input type="email" id="reset-email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md"/>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button type="submit" className="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark">Send Reset Link</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('linda.adora@school.edu');
    const [password, setPassword] = useState('password123');
    const [error, setError] = useState('');
    const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        // Simple hardcoded authentication for demonstration
        if (email === 'linda.adora@school.edu' && password === 'password123') {
            onLoginSuccess();
        } else {
            setError('Invalid email or password.');
        }
    };

    return (
        <div className="min-h-screen bg-brand-bg flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-md">
                 <h1 className="text-4xl font-bold text-neutral-800 text-center">SchoolHub</h1>
                <p className="text-center text-neutral-500 mt-2">Welcome back! Please sign in.</p>
                 <div className="bg-white mt-8 p-8 rounded-xl shadow-md">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-neutral-700">Email Address</label>
                            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"/>
                        </div>
                        <div>
                            <div className="flex justify-between items-baseline">
                                <label htmlFor="password" className="block text-sm font-medium text-neutral-700">Password</label>
                                <button type="button" onClick={() => setIsForgotModalOpen(true)} className="text-sm text-primary hover:underline">Forgot password?</button>
                            </div>
                            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"/>
                        </div>

                        {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                        
                        <div>
                            <button type="submit" className="w-full py-3 px-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark shadow-sm">Sign In</button>
                        </div>
                    </form>
                </div>
            </div>
             <ForgotPasswordModal isOpen={isForgotModalOpen} onClose={() => setIsForgotModalOpen(false)} />
        </div>
    );
};

export default Login;