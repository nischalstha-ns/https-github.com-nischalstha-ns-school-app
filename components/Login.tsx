import React, { useState } from 'react';
import { XIcon, EyeIcon, EyeOffIcon } from './icons';
import { useAuth } from '../state/AuthContext';
import { seedAllData } from '../services/firestoreService';

const ForgotPasswordModal: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
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
                         <button onClick={handleClose} className="mt-4 w-full px-4 py-2 bg-gradient-to-r from-[#3a6ff7] to-[#5f2eea] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity">Close</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <h3 className="text-lg font-bold text-neutral-800">Forgot Password</h3>
                        <p className="mt-2 text-sm text-neutral-600">Enter your email and we'll send you a link to reset your password.</p>
                        <div className="mt-4">
                            <label htmlFor="reset-email" className="block text-sm font-medium text-[#333333]">Email Address</label>
                            <input type="email" id="reset-email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-[#d0d0d0] rounded-md bg-neutral-50 text-neutral-900"/>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button type="submit" className="px-4 py-2 bg-gradient-to-r from-[#3a6ff7] to-[#5f2eea] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity">Send Reset Link</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

const Login: React.FC = () => {
    const { login } = useAuth();
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [isSeeding, setIsSeeding] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoggingIn(true);
        const result = await login(identifier, password);
        if (result !== true) {
            setError(result);
            setPassword('');
        }
        // On success, component will unmount. On error, stop spinner.
        setIsLoggingIn(false);
    };

    const handleSeed = async () => {
        setIsSeeding(true);
        try {
            await seedAllData();
            alert("Database has been reset and seeded with demo data. You can now log in with the default admin credentials.");
        } catch (error) {
            console.error(error);
            setError("Failed to seed database. Check console for errors.");
        } finally {
            setIsSeeding(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-bg flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-md">
                 <h1 className="text-4xl font-bold text-[#1e2a5e] text-center">SchoolHub</h1>
                <p className="text-center text-neutral-500 mt-2">Welcome back! Please sign in.</p>
                 <div className="bg-white mt-8 p-8 rounded-2xl shadow-lg">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label htmlFor="identifier" className="block text-sm font-medium text-[#333333]">Email or Full Name</label>
                            <input 
                                type="text" 
                                id="identifier" 
                                value={identifier} 
                                onChange={(e) => setIdentifier(e.target.value)} 
                                required 
                                className="mt-1 block w-full px-4 py-3 border border-[#d0d0d0] rounded-lg bg-neutral-50 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#3a6ff7] placeholder:text-neutral-500"
                                placeholder=""
                            />
                        </div>
                        <div>
                            <div className="flex justify-between items-baseline">
                                <label htmlFor="password" className="block text-sm font-medium text-[#333333]">Password</label>
                                <button type="button" onClick={() => setIsForgotModalOpen(true)} className="text-sm text-[#3a6ff7] hover:underline font-medium">Forgot password?</button>
                            </div>
                            <div className="relative mt-1">
                                <input 
                                    type={isPasswordVisible ? 'text' : 'password'}
                                    id="password" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    required 
                                    className="block w-full px-4 py-3 border border-[#d0d0d0] rounded-lg bg-neutral-50 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#3a6ff7] placeholder:text-neutral-500 pr-12"
                                    placeholder="••••••••"
                                />
                                <button 
                                    type="button" 
                                    onClick={() => setIsPasswordVisible(!isPasswordVisible)} 
                                    className="absolute inset-y-0 right-0 flex items-center px-4 text-neutral-500 hover:text-neutral-700"
                                    aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                                >
                                    {isPasswordVisible ? (
                                        <EyeOffIcon className="w-5 h-5" />
                                    ) : (
                                        <EyeIcon className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                        
                        <div>
                            <button 
                                type="submit" 
                                disabled={isLoggingIn}
                                className="w-full py-3 px-4 bg-gradient-to-r from-[#3a6ff7] to-[#5f2eea] text-white font-bold rounded-lg hover:opacity-90 transition-opacity shadow-md flex justify-center items-center disabled:opacity-50"
                            >
                                {isLoggingIn && <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                                {isLoggingIn ? 'Signing In...' : 'Sign In'}
                            </button>
                        </div>
                    </form>
                </div>
                 <div className="mt-4 text-center">
                    <button onClick={handleSeed} disabled={isSeeding} className="text-sm text-neutral-500 hover:underline disabled:text-neutral-400">
                        {isSeeding ? 'Resetting Database...' : 'Reset & Seed Demo Data'}
                    </button>
                </div>
            </div>
             <ForgotPasswordModal isOpen={isForgotModalOpen} onClose={() => setIsForgotModalOpen(false)} />
        </div>
    );
};

export default Login;