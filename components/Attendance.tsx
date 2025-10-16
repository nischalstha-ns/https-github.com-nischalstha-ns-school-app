import React, { useState, useMemo } from 'react';
import { ATTENDANCE_DATA, STUDENTS } from '../constants';
import { AttendanceData, Student, AttendanceStatus } from '../types';
import { CheckCircleIcon, XCircleIcon, MinusCircleIcon, ChevronDownIcon } from './icons';

const Attendance: React.FC = () => {
    const [attendance, setAttendance] = useState<AttendanceData[]>(ATTENDANCE_DATA);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedClass, setSelectedClass] = useState<number | 'all'>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const { daysInMonth, year, month, dateArray } = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const dateArray = Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));
        return { daysInMonth, year, month, dateArray };
    }, [currentDate]);

    const filteredStudents = useMemo(() => {
        return STUDENTS.filter(student => selectedClass === 'all' || student.class === selectedClass);
    }, [selectedClass]);

    const paginatedStudents = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredStudents.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredStudents, currentPage]);

    const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

    const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const [year, month] = e.target.value.split('-').map(Number);
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const handleStatusChange = (studentId: number, date: string) => {
        const today = new Date().toISOString().split('T')[0];
        if (date > today) return; // Cannot change future attendance

        const currentStatus = attendance.find(a => a.studentId === studentId && a.date === date)?.status;
        if (currentStatus === 'Holiday' || currentStatus === 'Future') return;

        const statusCycle: AttendanceStatus[] = ['Present', 'Absent', 'Leave'];
        const currentIndex = statusCycle.indexOf(currentStatus || 'Present');
        const nextStatus = statusCycle[(currentIndex + 1) % statusCycle.length];

        setAttendance(prev => 
            prev.map(a => a.studentId === studentId && a.date === date ? { ...a, status: nextStatus } : a)
        );
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
    
    const getStudentSummary = (studentId: number) => {
        const studentAttendance = attendance.filter(a => a.studentId === studentId && new Date(a.date).getMonth() === month);
        const present = studentAttendance.filter(a => a.status === 'Present').length;
        const absent = studentAttendance.filter(a => a.status === 'Absent').length;
        const leave = studentAttendance.filter(a => a.status === 'Leave').length;
        return { present, absent, leave };
    };

    const uniqueClasses = [...new Set(STUDENTS.map(s => s.class))].sort((a,b) => a-b);

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

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-4 py-3 font-medium text-slate-600 rounded-l-lg sticky left-0 bg-slate-50 z-10 w-48 min-w-[12rem]">Student Name</th>
                            {dateArray.map(date => <th key={date.getDate()} className="px-4 py-3 font-medium text-slate-600 text-center w-12">{String(date.getDate()).padStart(2, '0')}</th>)}
                            <th className="px-4 py-3 font-medium text-slate-600 rounded-r-lg text-center">Summary</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {paginatedStudents.map(student => {
                            const summary = getStudentSummary(student.id);
                            return (
                                <tr key={student.id} className="hover:bg-slate-50">
                                    <td className="px-4 py-3 font-medium text-slate-800 sticky left-0 bg-white hover:bg-slate-50 z-10 w-48 min-w-[12rem]">{student.name}</td>
                                    {dateArray.map(date => {
                                        const dateString = date.toISOString().split('T')[0];
                                        const record = attendance.find(a => a.studentId === student.id && a.date === dateString);
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
                        })}
                    </tbody>
                </table>
                 {paginatedStudents.length === 0 && <div className="text-center py-8 text-slate-500">No students found for this class.</div>}
            </div>
             {/* Pagination */}
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