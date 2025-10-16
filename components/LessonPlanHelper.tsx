import React, { useState } from 'react';
import { generateLessonPlan } from '../services/geminiService';
import { SparklesIcon } from './icons';

const LessonPlanHelper: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [grade, setGrade] = useState('5th Grade');
    const [duration, setDuration] = useState('45');
    const [lessonPlan, setLessonPlan] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setLessonPlan('');
        const plan = await generateLessonPlan(topic, grade, duration);
        setLessonPlan(plan);
        setIsLoading(false);
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <SparklesIcon className="w-12 h-12 mx-auto text-sky-500" />
                <h1 className="text-3xl font-bold text-slate-800 mt-2">AI Lesson Plan Helper</h1>
                <p className="text-slate-500 mt-2">Describe your lesson topic and let AI assist you in creating a structured plan.</p>
            </div>

            <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="topic" className="block text-sm font-medium text-slate-700">Topic</label>
                        <input
                            type="text"
                            id="topic"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                            placeholder="e.g., The Water Cycle"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="grade" className="block text-sm font-medium text-slate-700">Grade Level</label>
                            <input
                                type="text"
                                id="grade"
                                value={grade}
                                onChange={(e) => setGrade(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="duration" className="block text-sm font-medium text-slate-700">Duration (minutes)</label>
                            <input
                                type="number"
                                id="duration"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:bg-slate-400 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Generating...
                            </>
                        ) : 'Generate Plan'}
                    </button>
                </form>
            </div>

            {(isLoading || lessonPlan) && (
                <div className="max-w-4xl mx-auto mt-6 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Generated Lesson Plan</h2>
                    {isLoading ? (
                         <div className="space-y-4">
                            <div className="animate-pulse bg-slate-200 h-6 w-1/3 rounded"></div>
                            <div className="animate-pulse bg-slate-200 h-4 w-full rounded"></div>
                            <div className="animate-pulse bg-slate-200 h-4 w-3/4 rounded"></div>
                            <div className="animate-pulse bg-slate-200 h-6 w-1/4 rounded mt-4"></div>
                            <div className="animate-pulse bg-slate-200 h-4 w-full rounded"></div>
                         </div>
                    ) : (
                        <div className="prose prose-sky max-w-none text-slate-700 whitespace-pre-wrap">
                           {lessonPlan}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default LessonPlanHelper;
