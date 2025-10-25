import React, { useState, useMemo } from 'react';
import { Result as ResultType, UserRole } from '../types';
import { SearchIcon, PlusIcon, EditIcon, DeleteIcon, ArrowUpIcon, ArrowDownIcon, DownloadIcon, EyeIcon } from './icons';
import ResultModal from './ResultModal';
import ConfirmationModal from './ConfirmationModal';
import ReportCard from './ReportCard';
import { useAppContext } from '../state/AppContext';
import { useAuth } from '../state/AuthContext';

const classDisplayMap: { [key: number]: string } = {
    '-2': 'Nursery', '-1': 'LKG', '0': 'UKG',
};
const getClassDisplayName = (classNum: number) => classDisplayMap[classNum] || `Class ${classNum}`;

const Result: React.FC = () => {
    const { user } = useAuth();
    const { results, students, teachers, isLoading, addResult, updateResult, deleteResult, seedAllData } = useAppContext();
    
    const [isSeeding, setIsSeeding] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClass, setSelectedClass] = useState<number | 'all'>('all');
    const [selectedExamType, setSelectedExamType] = useState<'all' | ResultType['examType']>('all');
    const [sortConfig, setSortConfig] = useState<{ key: keyof ResultType; direction: 'ascending' | 'descending' } | null>({ key: 'studentName', direction: 'ascending' });
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isReportCardOpen, setIsReportCardOpen] = useState(false);
    
    const [selectedResult, setSelectedResult] = useState<ResultType | null>(null);
    const [resultToView, setResultToView] = useState<ResultType | null>(null);
    const [resultToDelete, setResultToDelete] = useState<string | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const teacherDetails = useMemo(() => {
        if (user?.role !== UserRole.Teacher) return null;
        return teachers.find(t => t.email === user.email);
    }, [user, teachers]);

    const visibleResults = useMemo(() => {
        if (user?.role === UserRole.Admin) return results;
        if (user?.role === UserRole.Teacher && teacherDetails) {
            const assignedClassSections = new Set(teacherDetails.assignedClasses);
            return results.filter(r => assignedClassSections.has(`${r.class}${r.section}`));
        }
        if (user?.role === UserRole.Student) {
            const studentProfile = students.find(s => s.email === user.email);
            return studentProfile ? results.filter(r => r.studentId === studentProfile.studentId) : [];
        }
        return [];
    }, [user, results, teachers, students, teacherDetails]);

    const filteredResults = useMemo(() => {
        return visibleResults.filter(result =>
            (result.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || result.studentId.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (selectedClass === 'all' || result.class === selectedClass) &&
            (selectedExamType === 'all' || result.examType === selectedExamType)
        );
    }, [visibleResults, searchTerm, selectedClass, selectedExamType]);

    const sortedResults = useMemo(() => {
        let sortableItems = [...filteredResults];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                const valA = a[sortConfig.key];
                const valB = b[sortConfig.key];
                if (typeof valA === 'string' && typeof valB === 'string') return sortConfig.direction === 'ascending' ? valA.localeCompare(valB) : valB.localeCompare(valA);
                // Fix: Added a type guard for number comparison to resolve the TypeScript error.
                // The generic comparison was failing because `valA` and `valB` could be different types from the ResultType interface.
                if (typeof valA === 'number' && typeof valB === 'number') {
                    if (valA < valB) {
                        return sortConfig.direction === 'ascending' ? -1 : 1;
                    }
                    if (valA > valB) {
                        return sortConfig.direction === 'ascending' ? 1 : -1;
                    }
                }
                return 0;
            });
        }
        return sortableItems;
    }, [filteredResults, sortConfig]);

    const paginatedResults = useMemo(() => sortedResults.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage), [sortedResults, currentPage]);
    const totalPages = Math.ceil(sortedResults.length / itemsPerPage);
    const uniqueClasses = useMemo(() => [...new Set(results.map(s => s.class))].sort((a, b) => a - b), [results]);

    const requestSort = (key: keyof ResultType) => setSortConfig(prev => ({ key, direction: prev?.key === key && prev.direction === 'ascending' ? 'descending' : 'ascending' }));
    
    const handleSaveResult = async (resultData: Omit<ResultType, 'id'> & { id?: string }) => {
        await (resultData.id ? updateResult(resultData.id, resultData) : addResult(resultData));
        setIsModalOpen(false);
    };

    const confirmDelete = async () => {
        if (resultToDelete) await deleteResult(resultToDelete);
        setIsConfirmModalOpen(false);
    };
    
    const renderSortArrow = (key: keyof ResultType) => {
        if (!sortConfig || sortConfig.key !== key) return null;
        return sortConfig.direction === 'ascending' ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />;
    };
    
    const getGradePill = (grade: string) => {
        const base = "px-3 py-1 rounded-full text-xs font-bold w-10 text-center ";
        if (grade.startsWith('A')) return base + "bg-green-100 text-green-800";
        if (grade.startsWith('B')) return base + "bg-blue-100 text-blue-800";
        if (grade.startsWith('C')) return base + "bg-yellow-100 text-yellow-800";
        return base + "bg-red-100 text-red-800";
    };

    const isAdmin = user?.role === UserRole.Admin;
    const isTeacher = user?.role === UserRole.Teacher;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-3xl font-bold text-neutral-800">Student Results</h1>
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                     <div className="relative flex-grow"><SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" /><input type="text" placeholder="Search by student..." value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }} className="pl-10 pr-4 py-2 w-full border border-neutral-300 rounded-lg"/></div>
                     <select value={selectedClass} onChange={e => setSelectedClass(e.target.value === 'all' ? 'all' : Number(e.target.value))} className="px-3 py-2 border border-neutral-300 rounded-lg text-sm"><option value="all">All Classes</option>{uniqueClasses.map(c => <option key={c} value={c}>{getClassDisplayName(c)}</option>)}</select>
                     <select value={selectedExamType} onChange={e => setSelectedExamType(e.target.value as any)} className="px-3 py-2 border border-neutral-300 rounded-lg text-sm"><option value="all">All Exams</option><option value="Unit Test">Unit Test</option><option value="Mid-term">Mid-term</option><option value="Final">Final</option></select>
                    {isAdmin && <button onClick={() => { setSelectedResult(null); setIsModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark"><PlusIcon className="w-5 h-5" /> Add Result</button>}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
                <table className="w-full text-sm text-left text-neutral-600">
                    <thead className="text-xs text-neutral-700 uppercase bg-neutral-50/80">
                        <tr>
                            {(['studentName', 'class', 'examType', 'percentage', 'grade', 'status'] as Array<keyof ResultType>).map(key => (<th key={key} scope="col" className="px-6 py-4 font-semibold cursor-pointer" onClick={() => requestSort(key)}><div className="flex items-center gap-1">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}{renderSortArrow(key)}</div></th>))}
                            <th scope="col" className="px-6 py-4 font-semibold text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (<tr><td colSpan={7} className="text-center p-8">Loading results...</td></tr>) : paginatedResults.map(result => (<tr key={result.id} className="border-b last:border-b-0 hover:bg-primary-light/30">
                            <td className="px-6 py-4 font-medium text-neutral-900">{result.studentName}</td><td className="px-6 py-4">{getClassDisplayName(result.class)} {result.section}</td><td className="px-6 py-4">{result.examType}</td><td className="px-6 py-4 font-semibold">{result.percentage.toFixed(2)}%</td>
                            <td className="px-6 py-4"><span className={getGradePill(result.grade)}>{result.grade}</span></td>
                            <td className="px-6 py-4"><span className={`font-semibold ${result.status === 'Passed' ? 'text-green-600' : 'text-red-600'}`}>{result.status}</span></td>
                            <td className="px-6 py-4"><div className="flex items-center justify-center gap-2">
                                <button onClick={() => { setResultToView(result); setIsReportCardOpen(true); }} className="p-2 text-neutral-500 hover:text-primary"><EyeIcon className="w-5 h-5"/></button>
                                {(isAdmin || isTeacher) && <button onClick={() => { setSelectedResult(result); setIsModalOpen(true); }} className="p-2 text-neutral-500 hover:text-accent-yellow"><EditIcon className="w-5 h-5"/></button>}
                                {isAdmin && <button onClick={() => { setResultToDelete(result.id); setIsConfirmModalOpen(true); }} className="p-2 text-neutral-500 hover:text-accent-red"><DeleteIcon className="w-5 h-5"/></button>}
                            </div></td></tr>))}
                    </tbody>
                </table>
            </div>
             
             <div className="flex justify-between items-center pt-4"><span className="text-sm">Showing {Math.min((currentPage - 1) * itemsPerPage + 1, sortedResults.length)} to {Math.min(currentPage * itemsPerPage, sortedResults.length)} of {sortedResults.length}</span><div className="flex items-center gap-2"><button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 border rounded-md disabled:opacity-50">Prev</button><span>{currentPage} / {totalPages || 1}</span><button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1 border rounded-md disabled:opacity-50">Next</button></div></div>

            {isReportCardOpen && resultToView && <ReportCard result={resultToView} student={students.find(s => s.studentId === resultToView.studentId) || null} onClose={() => setIsReportCardOpen(false)} />}
            <ResultModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveResult} result={selectedResult} />
            <ConfirmationModal isOpen={isConfirmModalOpen} onCancel={() => setIsConfirmModalOpen(false)} onConfirm={confirmDelete} title="Delete Result" message="Are you sure you want to delete this result?" />
        </div>
    );
};

export default Result;