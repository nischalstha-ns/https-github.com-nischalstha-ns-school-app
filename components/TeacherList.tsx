// Fix: Create the content for the missing TeacherList.tsx file.
// This component provides a full-featured UI for managing the list of teachers.
import React, { useState, useMemo } from 'react';
import { TEACHERS } from '../constants';
import { Teacher } from '../types';
import { SearchIcon, PlusIcon, UploadIcon, EditIcon, DeleteIcon, ArrowUpIcon, ArrowDownIcon, DownloadIcon } from './icons';
import TeacherModal from './TeacherModal';
import ConfirmationModal from './ConfirmationModal';
import ImportModal from './ImportModal';

const TeacherList: React.FC = () => {
    const [teachers, setTeachers] = useState<Teacher[]>(TEACHERS);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof Teacher; direction: 'ascending' | 'descending' } | null>({ key: 'name', direction: 'ascending' });
    
    const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);

    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
    const [teacherToDelete, setTeacherToDelete] = useState<number | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const filteredTeachers = useMemo(() => {
        return teachers.filter(teacher =>
            teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            teacher.teacherId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            teacher.department.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [teachers, searchTerm]);

    const sortedTeachers = useMemo(() => {
        let sortableItems = [...filteredTeachers];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [filteredTeachers, sortConfig]);

    const paginatedTeachers = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return sortedTeachers.slice(startIndex, startIndex + itemsPerPage);
    }, [sortedTeachers, currentPage]);

    const totalPages = Math.ceil(sortedTeachers.length / itemsPerPage);

    const requestSort = (key: keyof Teacher) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const handleAddTeacher = () => {
        setSelectedTeacher(null);
        setIsTeacherModalOpen(true);
    };

    const handleEditTeacher = (teacher: Teacher) => {
        setSelectedTeacher(teacher);
        setIsTeacherModalOpen(true);
    };

    const handleDeleteTeacher = (id: number) => {
        setTeacherToDelete(id);
        setIsConfirmModalOpen(true);
    };

    const confirmDelete = () => {
        if (teacherToDelete !== null) {
            setTeachers(teachers.filter(t => t.id !== teacherToDelete));
        }
        setIsConfirmModalOpen(false);
        setTeacherToDelete(null);
    };
    
    const handleSaveTeacher = (teacherData: Omit<Teacher, 'id' | 'assignedClasses'> & { id?: number; assignedClasses: string }) => {
        const processedData = {
            ...teacherData,
            assignedClasses: teacherData.assignedClasses.split(',').map(s => s.trim()).filter(Boolean),
        };

        if (processedData.id) {
            setTeachers(teachers.map(t => t.id === processedData.id ? { ...t, ...processedData } as Teacher : t));
        } else {
            const newTeacher: Teacher = { ...processedData, id: Math.max(0, ...teachers.map(t => t.id)) + 1 } as Teacher;
            setTeachers([...teachers, newTeacher]);
        }
        setIsTeacherModalOpen(false);
    };
    
    const handleImport = (file: File) => {
        console.log("Importing file:", file.name);
        // Placeholder for actual import logic
        setIsImportModalOpen(false);
    };
    
    const handleExport = () => {
        const headers = [
            'id', 'teacherId', 'name', 'email', 'phone', 
            'department', 'assignedClasses', 'joiningDate', 
            'status', 'yearsOfExperience'
        ];

        const escapeCsvCell = (cellData: any) => {
            const stringData = String(cellData);
            if (stringData.includes(',') || stringData.includes('"') || stringData.includes('\n')) {
                return `"${stringData.replace(/"/g, '""')}"`;
            }
            return stringData;
        };

        const rows = teachers.map(t => [
            t.id,
            t.teacherId,
            t.name,
            t.email,
            t.phone,
            t.department,
            t.assignedClasses.join(', '),
            t.joiningDate,
            t.status,
            t.yearsOfExperience
        ].map(escapeCsvCell).join(','));

        const csvContent = [headers.join(','), ...rows].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "teachers.csv");
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
    };

    const renderSortArrow = (key: keyof Teacher) => {
        if (!sortConfig || sortConfig.key !== key) return null;
        if (sortConfig.direction === 'ascending') return <ArrowUpIcon className="w-4 h-4" />;
        return <ArrowDownIcon className="w-4 h-4" />;
    };
    
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-3xl font-bold text-slate-800">Teachers</h1>
                <div className="flex items-center gap-2 w-full md:w-auto">
                     <div className="relative flex-grow">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search teachers..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                    </div>
                     <button onClick={() => setIsImportModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-slate-700 font-semibold rounded-lg hover:bg-gray-50">
                        <UploadIcon className="w-5 h-5" />
                        <span className="hidden sm:inline">Import</span>
                    </button>
                    <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-slate-700 font-semibold rounded-lg hover:bg-gray-50">
                        <DownloadIcon className="w-5 h-5" />
                        <span className="hidden sm:inline">Export</span>
                    </button>
                    <button onClick={handleAddTeacher} className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700">
                        <PlusIcon className="w-5 h-5" />
                         <span className="hidden sm:inline">Add Teacher</span>
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                        <tr>
                            {(['name', 'teacherId', 'department', 'phone', 'status', 'yearsOfExperience'] as Array<keyof Teacher>).map((key) => (
                                <th key={key} scope="col" className="px-6 py-3 cursor-pointer" onClick={() => requestSort(key as keyof Teacher)}>
                                    <div className="flex items-center gap-1">
                                        {key === 'teacherId' ? 'Teacher ID' : key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                        {renderSortArrow(key as keyof Teacher)}
                                    </div>
                                </th>
                            ))}
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedTeachers.map(teacher => (
                            <tr key={teacher.id} className="bg-white border-b hover:bg-slate-50">
                                <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap flex items-center gap-3">
                                    <img src={teacher.avatar} alt={teacher.name} className="w-10 h-10 rounded-full"/>
                                    {teacher.name}
                                </td>
                                <td className="px-6 py-4">{teacher.teacherId}</td>
                                <td className="px-6 py-4">{teacher.department}</td>
                                <td className="px-6 py-4">{teacher.phone}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        teacher.status === 'Active' ? 'bg-green-100 text-green-800' :
                                        teacher.status === 'On Leave' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-slate-100 text-slate-800'
                                    }`}>
                                        {teacher.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">{teacher.yearsOfExperience}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <button onClick={() => handleEditTeacher(teacher)} className="text-sky-600 hover:text-sky-800"><EditIcon className="w-5 h-5"/></button>
                                        <button onClick={() => handleDeleteTeacher(teacher.id)} className="text-red-600 hover:text-red-800"><DeleteIcon className="w-5 h-5"/></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             
             {/* Pagination */}
             <div className="flex justify-between items-center pt-4">
                <span className="text-sm text-slate-700">
                    Showing <span className="font-semibold">{Math.min((currentPage - 1) * itemsPerPage + 1, filteredTeachers.length)}</span> to <span className="font-semibold">{Math.min(currentPage * itemsPerPage, filteredTeachers.length)}</span> of <span className="font-semibold">{filteredTeachers.length}</span> results
                </span>
                <div className="flex items-center gap-2">
                    <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 border rounded-md disabled:opacity-50">Previous</button>
                    <span className="text-sm">{currentPage} / {totalPages || 1}</span>
                    <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1 border rounded-md disabled:opacity-50">Next</button>
                </div>
            </div>

            <TeacherModal 
                isOpen={isTeacherModalOpen}
                onClose={() => setIsTeacherModalOpen(false)}
                onSave={handleSaveTeacher}
                teacher={selectedTeacher}
            />
            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onCancel={() => setIsConfirmModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Teacher"
                message="Are you sure you want to delete this teacher? This action cannot be undone."
            />
             <ImportModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                onImport={handleImport}
                title="Import Teachers"
                templateUrl="/teachers-template.csv"
            />
        </div>
    );
};

export default TeacherList;