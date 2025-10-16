// Fix: Create the content for the missing StudentList.tsx file.
// This component provides a full-featured UI for managing the list of students.
import React, { useState, useMemo } from 'react';
import { STUDENTS } from '../constants';
import { Student } from '../types';
import { SearchIcon, PlusIcon, UploadIcon, EditIcon, DeleteIcon, ArrowUpIcon, ArrowDownIcon } from './icons';
import StudentModal from './StudentModal';
import ConfirmationModal from './ConfirmationModal';
import ImportModal from './ImportModal';
import { extractStudentsFromFile } from '../services/geminiService';

const StudentList: React.FC = () => {
    const [students, setStudents] = useState<Student[]>(STUDENTS);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof Student; direction: 'ascending' | 'descending' } | null>({ key: 'name', direction: 'ascending' });
    
    const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);

    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [studentToDelete, setStudentToDelete] = useState<number | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const filteredStudents = useMemo(() => {
        return students.filter(student =>
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.parentName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [students, searchTerm]);

    const sortedStudents = useMemo(() => {
        let sortableItems = [...filteredStudents];
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
    }, [filteredStudents, sortConfig]);

    const paginatedStudents = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return sortedStudents.slice(startIndex, startIndex + itemsPerPage);
    }, [sortedStudents, currentPage]);

    const totalPages = Math.ceil(sortedStudents.length / itemsPerPage);

    const requestSort = (key: keyof Student) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const handleAddStudent = () => {
        setSelectedStudent(null);
        setIsStudentModalOpen(true);
    };

    const handleEditStudent = (student: Student) => {
        setSelectedStudent(student);
        setIsStudentModalOpen(true);
    };

    const handleDeleteStudent = (id: number) => {
        setStudentToDelete(id);
        setIsConfirmModalOpen(true);
    };

    const confirmDelete = () => {
        if (studentToDelete !== null) {
            setStudents(students.filter(s => s.id !== studentToDelete));
        }
        setIsConfirmModalOpen(false);
        setStudentToDelete(null);
    };
    
    const handleSaveStudent = (studentData: Omit<Student, 'id'> & { id?: number }) => {
        if (studentData.id) {
            setStudents(students.map(s => s.id === studentData.id ? { ...s, ...studentData } as Student : s));
        } else {
            const newStudent: Student = { ...studentData, id: Math.max(0, ...students.map(s => s.id)) + 1 } as Student;
            setStudents([...students, newStudent]);
        }
        setIsStudentModalOpen(false);
    };

    const handleSaveImportedStudents = (newStudents: Partial<Student>[]) => {
        const studentsWithIds = newStudents.map((student, index) => ({
            ...student,
            id: Math.max(0, ...students.map(s => s.id)) + 1 + index,
            avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`, // Assign a random avatar
            studentId: student.studentId || `S-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
            rollNo: student.rollNo || 0,
            name: student.name || 'N/A',
            class: student.class || 1,
            section: student.section || 'A',
            gender: student.gender || 'Other',
            parentName: student.parentName || 'N/A',
            contact: student.contact || 'N/A',
            admissionDate: student.admissionDate || new Date().toISOString().split('T')[0],
            status: student.status || 'Active',
            email: student.email || 'N/A',
            attendance: student.attendance || 100,
        } as Student));
        setStudents(prev => [...prev, ...studentsWithIds]);
        setIsImportModalOpen(false);
    };
    
    const renderSortArrow = (key: keyof Student) => {
        if (!sortConfig || sortConfig.key !== key) return null;
        if (sortConfig.direction === 'ascending') return <ArrowUpIcon className="w-4 h-4" />;
        return <ArrowDownIcon className="w-4 h-4" />;
    };
    
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-3xl font-bold text-slate-800">Students</h1>
                <div className="flex items-center gap-2 w-full md:w-auto">
                     <div className="relative flex-grow">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search students..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                    </div>
                     <button onClick={() => setIsImportModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-slate-700 font-semibold rounded-lg hover:bg-gray-50">
                        <UploadIcon className="w-5 h-5" />
                        <span className="hidden sm:inline">Import</span>
                    </button>
                    <button onClick={handleAddStudent} className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700">
                        <PlusIcon className="w-5 h-5" />
                         <span className="hidden sm:inline">Add Student</span>
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                        <tr>
                            {(['name', 'studentId', 'class', 'parentName', 'contact', 'status', 'attendance'] as Array<keyof Student>).map((key) => (
                                <th key={key} scope="col" className="px-6 py-3 cursor-pointer" onClick={() => requestSort(key)}>
                                    <div className="flex items-center gap-1">
                                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                        {renderSortArrow(key)}
                                    </div>
                                </th>
                            ))}
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedStudents.map(student => (
                            <tr key={student.id} className="bg-white border-b hover:bg-slate-50">
                                <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap flex items-center gap-3">
                                    <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full"/>
                                    {student.name}
                                </td>
                                <td className="px-6 py-4">{student.studentId}</td>
                                <td className="px-6 py-4">{student.class}{student.section}</td>
                                <td className="px-6 py-4">{student.parentName}</td>
                                <td className="px-6 py-4">{student.contact}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        student.status === 'Active' ? 'bg-green-100 text-green-800' :
                                        student.status === 'Suspended' ? 'bg-red-100 text-red-800' :
                                        'bg-slate-100 text-slate-800'
                                    }`}>
                                        {student.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">{student.attendance}%</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <button onClick={() => handleEditStudent(student)} className="text-sky-600 hover:text-sky-800"><EditIcon className="w-5 h-5"/></button>
                                        <button onClick={() => handleDeleteStudent(student.id)} className="text-red-600 hover:text-red-800"><DeleteIcon className="w-5 h-5"/></button>
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
                    Showing <span className="font-semibold">{Math.min((currentPage - 1) * itemsPerPage + 1, filteredStudents.length)}</span> to <span className="font-semibold">{Math.min(currentPage * itemsPerPage, filteredStudents.length)}</span> of <span className="font-semibold">{filteredStudents.length}</span> results
                </span>
                <div className="flex items-center gap-2">
                    <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 border rounded-md disabled:opacity-50">Previous</button>
                    <span className="text-sm">{currentPage} / {totalPages || 1}</span>
                    <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1 border rounded-md disabled:opacity-50">Next</button>
                </div>
            </div>

            <StudentModal 
                isOpen={isStudentModalOpen}
                onClose={() => setIsStudentModalOpen(false)}
                onSave={handleSaveStudent}
                student={selectedStudent}
            />
            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onCancel={() => setIsConfirmModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Student"
                message="Are you sure you want to delete this student? This action cannot be undone."
            />
             <ImportModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                onSave={handleSaveImportedStudents}
                title="Import Students with AI"
                extractionFunction={extractStudentsFromFile}
            />
        </div>
    );
};

export default StudentList;