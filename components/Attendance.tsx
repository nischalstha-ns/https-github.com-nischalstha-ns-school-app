import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { AttendanceStatus, UserRole } from '../types';
import { CheckCircleIcon, XCircleIcon, MinusCircleIcon } from './icons';
import { useAppContext } from '../state/AppContext';
import { useAuth } from '../state/AuthContext';

const Attendance: React.FC = () => {
    const { user: authUser } = useAuth();
    const { students, attendance, isLoading, loadAttendanceForMonth, upsertAttendance, seedAttendanceData } = useAppContext();
    const [isSeeding, setIsSeeding] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedClass, setSelectedClass] = useState<number | 'all'>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const { year, month, dateArray, monthKey } = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const dateArray = Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));
        const monthKey = `${year}-${month}`;
        return { year, month, dateArray, monthKey };
    }, [currentDate]);

    useEffect(() => {
        loadAttendanceForMonth(year, month);
    }, [year, month, loadAttendanceForMonth]);
    
    const monthAttendance = useMemo(() => attendance[monthKey] || [], [attendance, monthKey]);
    
    const loggedInStudent = useMemo(() => {
        if (authUser?.role === UserRole.Student && authUser.email) {
            return students.find(s => s.email.toLowerCase() === authUser.email.toLowerCase());
        }
        return null;
    }, [students, authUser]);

    const filteredStudents = useMemo(() => {
        if (loggedInStudent) {
            return [loggedInStudent];
        }
        return students.filter(student => selectedClass === 'all' || student.class === selectedClass);
    }, [students, selectedClass, loggedInStudent]);

    const paginatedStudents = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredStudents.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredStudents, currentPage]);

    const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

    const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const [year, month] = e.target.value.split('-').map(Number);
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const handleStatusChange = async (studentId: string, date: string) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (new Date(date) > today) return;

        const record = monthAttendance.find(a => a.studentId === studentId && a.date === date);
        const currentStatus = record?.status;
        if (currentStatus === 'Holiday' || currentStatus === 'Future') return;

        const statusCycle: AttendanceStatus[] = ['Present', 'Absent', 'Leave'];
        const currentIndex = statusCycle.indexOf(currentStatus || 'Present');
        const nextStatus = statusCycle[(currentIndex + 1) % statusCycle.length];

        await upsertAttendance(studentId, date, nextStatus);
    };

    const getStatusIcon = (status: AttendanceStatus) => {
        switch (status) {
            case 'Present': return <CheckCircleIcon className="w-6 h-6 text-sky-500" />;
            case 'Absent': return <XCircleIcon className="w-6 h-6 text-red-500" />;
            case 'Leave': return <MinusCircleIcon className="w-6 h-6 text-yellow-500" />;
            case 'Holiday': return <span className="text-gray-400">-</span>;
            case 'Future': return <span className="text-gray-300">-</span>;
            default: return null;
        }
    };
    
    const getStudentSummary = useCallback((studentId: string) => {
        const studentAttendance = monthAttendance.filter(a => a.studentId === studentId);
        const present = studentAttendance.filter(a => a.status === 'Present').length;
        const absent = studentAttendance.filter(a => a.status === 'Absent').length;
        const leave = studentAttendance.filter(a => a.status === 'Leave').length;
        return { present, absent, leave };
    }, [monthAttendance]);

    const handleSeed = async () => {
        setIsSeeding(true);
        try {
            await seedAttendanceData(year, month);
        } catch(e) {
            console.error("Failed to seed attendance:", e);
        } finally {
            setIsSeeding(false);
        }
    };
    
    const uniqueClasses = [...new Set(students.map(s => s.class))].sort((a: number, b: number) => a - b);
    const needsSeeding = students.length > 0 && monthAttendance.length === 0 && !isLoading;
    
    if (authUser?.role === UserRole.Student) {
        if (isLoading) return <div className="text-center p-8">Loading your attendance...</div>;
        if (!loggedInStudent) return <div className="text-center p-8 text-red-500">Your student profile could not be found.</div>;
        
        const summary = getStudentSummary(loggedInStudent.id);
        const totalTrackedDays = summary.present + summary.absent + summary.leave;
        const attendancePercentage = totalTrackedDays > 0 ? ((summary.present / totalTrackedDays) * 100).toFixed(1) : 'N/A';

        return (
            <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Your Attendance Dashboard</h1>
                        <p className="text-slate-600 mt-1">Hello, <span className="font-semibold">{loggedInStudent.name}</span>! Here are your attendance records.</p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <input
                            type="month"
                            value={`${year}-${String(month + 1).padStart(2, '0')}`}
                            onChange={handleMonthChange}
                            className="p-2 border rounded-lg bg-gray-50 text-sm"
                        />
                    </div>
                </div>

                <div className="text-sm text-neutral-600 bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p>"Welcome to your Attendance Dashboard. Here, you can view your personal attendance records for each course you're enrolled in. This section is designed exclusively for students and displays only your own attendance data. You can track your daily presence, absences, and overall attendance percentage. Use the filters to view by date range or course. Your data is private and secure—no other student’s attendance is visible."</p>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50">
                            <tr>
                                {dateArray.map(date => <th key={date.getDate()} className="px-4 py-3 font-medium text-slate-600 text-center w-12">{String(date.getDate()).padStart(2, '0')}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            <tr key={loggedInStudent.id}>
                                {dateArray.map(date => {
                                    const dateString = date.toISOString().split('T')[0];
                                    const record = monthAttendance.find(a => a.studentId === loggedInStudent.id && a.date === dateString);
                                    return (
                                        <td key={date.getDate()} className="px-4 py-3 text-center w-12">
                                            <div className="cursor-default flex justify-center">
                                                {record ? getStatusIcon(record.status) : '-'}
                                            </div>
                                        </td>
                                    );
                                })}
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="border-t pt-4 flex justify-center items-center gap-6 flex-wrap">
                    <h3 className="text-lg font-semibold text-slate-800">Monthly Summary:</h3>
                    <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-2"><CheckCircleIcon className="w-5 h-5 text-sky-500" /> Present: <span className="font-bold">{summary.present}</span></span>
                        <span className="flex items-center gap-2"><XCircleIcon className="w-5 h-5 text-red-500" /> Absent: <span className="font-bold">{summary.absent}</span></span>
                        <span className="flex items-center gap-2"><MinusCircleIcon className="w-5 h-5 text-yellow-500" /> Leave: <span className="font-bold">{summary.leave}</span></span>
                        <span className="flex items-center gap-2 font-semibold">Overall: <span className="font-bold">{attendancePercentage}%</span></span>
                    </div>
                </div>
            </div>
        );
    }


    return (
        <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-2xl font-bold text-slate-800">Attendance</h1>
                <div className="flex items-center gap-2 flex-wrap">
                    <input
                        type="month"
                        value={`${year}-${String(month + 1).padStart(2, '0')}`}
                        onChange={handleMonthChange}
                        className="p-2 border rounded-lg bg-gray-50 text-sm"
                    />
                    <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value === 'all' ? 'all' : Number(e.target.value))} className="p-2 border rounded-lg bg-gray-50 text-sm appearance-none pr-8 bg-no-repeat" style={{backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em'}}>
                        <option value="all">All Classes</option>
                        {uniqueClasses.map(c => <option key={c} value={c}>Class {c}</option>)}
                    </select>
                </div>
            </div>

            {needsSeeding && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                    <div className="flex items-center">
                        <div className="flex-grow">
                            <p className="font-bold">No Attendance Data</p>
                            <p className="text-sm">Click the seed button to generate attendance records for the current month.</p>
                        </div>
                        <button onClick={handleSeed} disabled={isSeeding} className="ml-4 px-4 py-2 bg-yellow-400 text-yellow-900 font-semibold rounded-lg hover:bg-yellow-500 disabled:bg-gray-400 disabled:cursor-not-allowed">
                            {isSeeding ? 'Seeding...' : 'Seed Attendance'}
                        </button>
                    </div>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-4 py-3 font-medium text-slate-600 rounded-l-lg sticky left-0 bg-slate-50 z-10 w-48 min-w-[12rem]">Student Name</th>
                            {dateArray.map(date => <th key={date.getDate()} className="px-4 py-3 font-medium text-slate-600 text-center w-12">{String(date.getDate()).padStart(2, '0')}</th>)}
                            <th className="px-4 py-3 font-medium text-slate-600 rounded-r-lg text-center">Summary</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan={dateArray.length + 2} className="text-center p-8 text-slate-500">Loading attendance data...</td></tr>
                        ) : paginatedStudents.length === 0 ? (
                            <tr><td colSpan={dateArray.length + 2} className="text-center p-8 text-slate-500">No students found for this class.</td></tr>
                        ) : (
                            paginatedStudents.map(student => {
                                const summary = getStudentSummary(student.id);
                                return (
                                    <tr key={student.id} className="hover:bg-slate-50">
                                        <td className="px-4 py-3 font-medium text-slate-800 sticky left-0 bg-white hover:bg-slate-50 z-10 w-48 min-w-[12rem]">{student.name}</td>
                                        {dateArray.map(date => {
                                            const dateString = date.toISOString().split('T')[0];
                                            const record = monthAttendance.find(a => a.studentId === student.id && a.date === dateString);
                                            const isClickable = record && record.status !== 'Holiday' && record.status !== 'Future';
                                            return (
                                                <td key={date.getDate()} className="px-4 py-3 text-center w-12">
                                                    <button onClick={() => handleStatusChange(student.id, dateString)} disabled={!isClickable} className={`${isClickable ? 'cursor-pointer' : 'cursor-default'}`}>
                                                        {record ? getStatusIcon(record.status) : '-'}
                                                    </button>
                                                </td>
                                            );
                                        })}
                                        <td className="px-4 py-3 text-center text-xs">
                                            <div className="flex justify-center items-center gap-2">
                                                <span className="text-sky-600 font-semibold">{summary.present}P</span>
                                                <span className="text-red-600 font-semibold">{summary.absent}A</span>
                                                <span className="text-yellow-600 font-semibold">{summary.leave}L</span>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>
            </div>

             <div className="flex justify-between items-center pt-4">
                <span className="text-sm text-slate-700">
                    Showing <span className="font-semibold">{Math.min((currentPage - 1) * itemsPerPage + 1, filteredStudents.length)}</span> to <span className="font-semibold">{Math.min(currentPage * itemsPerPage, filteredStudents.length)}</span> of <span className="font-semibold">{filteredStudents.length}</span> students
                </span>
                <div className="flex items-center gap-2">
                    <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-4 py-2 border rounded-lg text-sm font-medium disabled:opacity-50">Previous</button>
                    <span className="text-sm">{currentPage} / {totalPages || 1}</span>
                    <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-4 py-2 border rounded-lg text-sm font-medium disabled:opacity-50">Next</button>
                </div>
            </div>
        </div>
    );
};

export default Attendance;