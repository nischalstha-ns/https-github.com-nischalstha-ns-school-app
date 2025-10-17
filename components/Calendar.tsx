import React, { useState, useMemo } from 'react';
import { CalendarEvent, View } from '../types';
import { CALENDAR_EVENTS } from '../constants';
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from './icons';

interface CalendarModalProps {
    event: CalendarEvent | null;
    isOpen: boolean;
    onClose: () => void;
}

const CalendarModal: React.FC<CalendarModalProps> = ({ event, isOpen, onClose }) => {
    if (!isOpen || !event) return null;

    const typeClasses = {
        event: 'bg-primary-light text-primary',
        holiday: 'bg-accent-yellow/20 text-accent-yellow',
        exam: 'bg-accent-red/20 text-accent-red'
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center">
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${typeClasses[event.type]}`}>{event.type}</span>
                    <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600"><XIcon className="w-6 h-6" /></button>
                </div>
                <h3 className="text-2xl font-bold text-neutral-800 mt-4">{event.title}</h3>
                <p className="text-neutral-500 text-sm mt-1">{new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p className="mt-4 text-neutral-600">{event.description}</p>
            </div>
        </div>
    );
};

const Calendar: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date('2030-09-15'));
    const [events] = useState<Omit<CalendarEvent, 'id'>[]>(CALENDAR_EVENTS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

    const { month, year, firstDayOfMonth, daysInMonth } = useMemo(() => {
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();
        return {
            month,
            year,
            firstDayOfMonth: new Date(year, month, 1).getDay(),
            daysInMonth: new Date(year, month + 1, 0).getDate(),
        };
    }, [currentDate]);

    const handleMonthChange = (offset: number) => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
    };

    const handleEventClick = (event: CalendarEvent) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
    };

    const typeClasses = {
        event: 'bg-primary text-white hover:bg-primary-dark',
        holiday: 'bg-accent-yellow text-white hover:bg-yellow-600',
        exam: 'bg-accent-red text-white hover:bg-red-600'
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                    <button onClick={() => handleMonthChange(-1)} className="p-2 rounded-full hover:bg-neutral-100"><ChevronLeftIcon className="w-6 h-6" /></button>
                    <h1 className="text-2xl font-bold text-neutral-800 text-center w-48">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h1>
                    <button onClick={() => handleMonthChange(1)} className="p-2 rounded-full hover:bg-neutral-100"><ChevronRightIcon className="w-6 h-6" /></button>
                </div>
                 <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-primary"></div>Event</span>
                    <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-accent-yellow"></div>Holiday</span>
                    <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-accent-red"></div>Exam</span>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center font-semibold text-neutral-600">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day} className="py-2">{day}</div>)}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} className="border rounded-lg bg-neutral-50"></div>)}
                {Array.from({ length: daysInMonth }).map((_, dayIndex) => {
                    const day = dayIndex + 1;
                    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const dayEvents = events.filter(e => e.date === dateString).map((e, i) => ({ ...e, id: `${dateString}-${i}` }));
                    
                    return (
                        <div key={day} className="border rounded-lg h-32 p-2 flex flex-col">
                            <span className="font-semibold">{day}</span>
                            <div className="flex-1 overflow-y-auto text-xs space-y-1 mt-1">
                                {dayEvents.map(event => (
                                    <button 
                                        key={event.id} 
                                        onClick={() => handleEventClick(event)}
                                        className={`w-full text-left p-1 rounded ${typeClasses[event.type]} truncate`}>
                                        {event.title}
                                    </button>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            <CalendarModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} event={selectedEvent} />
        </div>
    );
};

export default Calendar;
