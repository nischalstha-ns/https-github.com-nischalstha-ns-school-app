// Fix: Create the content for the missing StudentList.tsx file.
// This component provides a full-featured UI for managing the list of students.
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Student } from '../types';
import { SearchIcon, PlusIcon, UploadIcon, EditIcon, DeleteIcon, ArrowUpIcon, ArrowDownIcon, DownloadIcon, EyeIcon } from './icons';
import StudentModal from './StudentModal';
import StudentDetailView from './StudentDetailView';
import ConfirmationModal from './ConfirmationModal';
import ImportModal from './ImportModal';
import { extractStudentsFromFile } from '../services/geminiService';
import { getStudents, addStudent, updateStudent, deleteStudent, seedStudentsDatabase, getStudentsCollectionSize } from '../services/firestoreService';

const classDisplayMap: { [key: number]: string } = {
    '-2': 'Nursery',
    '-1': 'LKG',
    '0': 'UKG',
};
const getClassDisplayName = (classNum: number) => classDisplayMap[classNum] || `Class ${classNum}`;


const StudentList: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSeeding, setIsSeeding] = useState(false);
    const [isSeedButtonDisabled, setIsSeedButtonDisabled] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof Student; direction: 'ascending' | 'descending' } | null>({ key: 'name', direction: 'ascending' });
    const [selectedClass, setSelectedClass] = useState<number | 'all'>('all');
    
    const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [exportSortConfig, setExportSortConfig] = useState(sortConfig || { key: 'name', direction: 'ascending' });

    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [studentToView, setStudentToView] = useState<Student | null>(null);
    const [studentToDelete, setStudentToDelete] = useState<string | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const fetchStudents = useCallback(async () => {
        setIsLoading(true);
        try {
            const studentsFromDb = await getStudents();
            setStudents(studentsFromDb);
        } catch (error) {
            console.error("Error fetching students: ", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStudents();
        getStudentsCollectionSize().then(size => {
            if (size > 0) {
                setIsSeedButtonDisabled(true);
            }
        });
    }, [fetchStudents]);
    
    const uniqueClasses = useMemo(() => {
        const classNumbers = [...new Set(students.map(s => s.class))].sort((a, b) => a - b);
        const classOptions = [
            ...classNumbers.filter(c => c < 1), // Pre-primary
            ...classNumbers.filter(c => c >= 1) // Primary and above
        ];
        return classOptions;
    }, [students]);

    const filteredStudents = useMemo(() => {
        return students.filter(student => {
             const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.parentName.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesClass = selectedClass === 'all' || student.class === selectedClass;

            return matchesSearch && matchesClass;
        });
    }, [students, searchTerm, selectedClass]);

    const sortedStudents = useMemo(() => {
        let sortableItems = [...filteredStudents];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                const valA = a[sortConfig.key];
                const valB = b[sortConfig.key];

                if (typeof valA === 'string' && typeof valB === 'string') {
                    return sortConfig.direction === 'ascending' ? valA.localeCompare(valB) : valB.localeCompare(valA);
                }
                if (valA < valB) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (valA > valB) {
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

    const handleViewStudent = (student: Student) => {
        setStudentToView(student);
        setIsDetailModalOpen(true);
    };

    const handleEditStudent = (student: Student) => {
        setSelectedStudent(student);
        setIsStudentModalOpen(true);
    };

    const handleDeleteStudent = (id: string) => {
        setStudentToDelete(id);
        setIsConfirmModalOpen(true);
    };

    const confirmDelete = async () => {
        if (studentToDelete !== null) {
            await deleteStudent(studentToDelete);
            fetchStudents(); // Re-fetch
        }
        setIsConfirmModalOpen(false);
        setStudentToDelete(null);
    };
    
    const handleSaveStudent = async (studentData: Omit<Student, 'id'> & { id?: string }) => {
        const { id, ...data } = studentData;

        if (id) {
            await updateStudent(id, data);
        } else {
            await addStudent(data);
        }
        fetchStudents();
        setIsStudentModalOpen(false);
    };

    const handleSaveImportedStudents = async (newStudents: Partial<Student>[]) => {
        setIsLoading(true);
        const addPromises = newStudents.map(student => {
            const studentData: Omit<Student, 'id'> = {
                avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
                studentId: student.studentId || `S-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
                rollNo: student.rollNo || 0,
                name: student.name || 'N/A',
                class: student.class || 1,
                section: student.section || 'A',
                gender: student.gender || 'Other',
                dob: student.dob || '2015-01-01',
                address: student.address || 'N/A',
                parentName: student.parentName || 'N/A',
                contact: student.contact || 'N/A',
                admissionDate: student.admissionDate || new Date().toISOString().split('T')[0],
                status: student.status || 'Active',
                email: student.email || 'N/A',
                attendance: student.attendance || 100,
            };
            return addStudent(studentData);
        });
        await Promise.all(addPromises);
        fetchStudents();
        setIsImportModalOpen(false);
        setIsLoading(false);
    };

    const handleSeedDatabase = async () => {
        setIsSeeding(true);
        try {
            await seedStudentsDatabase();
            await fetchStudents();
            setIsSeedButtonDisabled(true);
        } catch(e) {
            console.error("Failed to seed database: ", e);
            alert("Failed to seed database. Check console for errors.");
        } finally {
            setIsSeeding(false);
        }
    }

    const handleOpenExportModal = () => {
        setExportSortConfig(sortConfig || { key: 'name', direction: 'ascending' });
        setIsExportModalOpen(true);
    };

    const handleConfirmExport = () => {
        if (filteredStudents.length === 0) {
            alert("No data to export.");
            return;
        }

        const exportableStudents = [...filteredStudents].sort((a, b) => {
            const valA = a[exportSortConfig.key];
            const valB = b[exportSortConfig.key];
            if (typeof valA === 'string' && typeof valB === 'string') {
                return exportSortConfig.direction === 'ascending' ? valA.localeCompare(valB) : valB.localeCompare(valA);
            }
            if (valA < valB) return exportSortConfig.direction === 'ascending' ? -1 : 1;
            if (valA > valB) return exportSortConfig.direction === 'ascending' ? 1 : -1;
            return 0;
        });

        const headers = [
            'Student ID', 'Roll No', 'Name', 'Class', 'Section', 'Gender', 'Date of Birth', 'Address',
            'Parent Name', 'Contact', 'Admission Date', 'Status', 'Email', 'Attendance (%)'
        ];

        const rows = exportableStudents.map(student => [
            student.studentId,
            student.rollNo,
            `"${student.name.replace(/"/g, '""')}"`,
            getClassDisplayName(student.class),
            student.section,
            student.gender,
            student.dob,
            `"${student.address.replace(/"/g, '""')}"`,
            `"${student.parentName.replace(/"/g, '""')}"`,
            student.contact,
            student.admissionDate,
            student.status,
            student.email,
            student.attendance
        ].join(','));

        const csvContent = [headers.join(','), ...rows].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `students_${selectedClass === 'all' ? 'all' : `class_${getClassDisplayName(selectedClass)}`}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setIsExportModalOpen(false);
    };
    
    const renderSortArrow = (key: keyof Student) => {
        if (!sortConfig || sortConfig.key !== key) return null;
        if (sortConfig.direction === 'ascending') return <ArrowUpIcon className="w-4 h-4 ml-1 text-neutral-500" />;
        return <ArrowDownIcon className="w-4 h-4 ml-1 text-neutral-500" />;
    };
    
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-3xl font-bold text-neutral-800">Students</h1>
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                     <div className="relative flex-grow">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                        <input
                            type="text"
                            placeholder="Search students..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            className="pl-10 pr-4 py-2 w-full border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                     <select 
                        value={selectedClass} 
                        onChange={(e) => {
                            setSelectedClass(e.target.value === 'all' ? 'all' : Number(e.target.value));
                            setCurrentPage(1);
                        }} 
                        className="px-3 py-2 border border-neutral-300 rounded-lg text-sm text-neutral-600 focus:outline-none focus:ring-1 focus:ring-primary appearance-none pr-8 bg-no-repeat"
                        style={{backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em'}}
                     >
                        <option value="all">All Classes</option>
                        {uniqueClasses.map(c => <option key={c} value={c}>{getClassDisplayName(c)}</option>)}
                    </select>
                     <button onClick={() => setIsImportModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-300 text-neutral-700 font-semibold rounded-lg hover:bg-neutral-50 transition-colors">
                        <UploadIcon className="w-5 h-5" />
                        <span className="hidden sm:inline">Import</span>
                    </button>
                    <button onClick={handleOpenExportModal} className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-300 text-neutral-700 font-semibold rounded-lg hover:bg-neutral-50 transition-colors">
                        <DownloadIcon className="w-5 h-5" />
                        <span className="hidden sm:inline">Export</span>
                    </button>
                    <button onClick={handleAddStudent} className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark shadow-sm transition-colors">
                        <PlusIcon className="w-5 h-5" />
                         <span className="hidden sm:inline">Add Student</span>
                    </button>
                </div>
            </div>
            
            {!isSeedButtonDisabled && (
                 <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                    <div className="flex">
                        <div className="py-1">
                            <p className="font-bold">Database is Empty</p>
                            <p className="text-sm">Click the seed button to populate your Firestore database with initial mock data.</p>
                        </div>
                        <div className="ml-auto pl-3">
                             <button onClick={handleSeedDatabase} disabled={isSeeding || isSeedButtonDisabled} className="px-4 py-2 bg-yellow-400 text-yellow-900 font-semibold rounded-lg hover:bg-yellow-500 disabled:bg-neutral-400 disabled:cursor-not-allowed">
                                {isSeeding ? 'Seeding...' : 'Seed Database'}
                            </button>
                        </div>
                    </div>
                </div>
            )}


            <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
                <table className="w-full text-sm text-left text-neutral-600">
                    <thead className="text-xs text-neutral-700 uppercase bg-neutral-50/80">
                        <tr>
                            {(['name', 'studentId', 'class', 'parentName', 'contact', 'status', 'attendance'] as Array<keyof Student>).map((key) => (
                                <th key={key} scope="col" className="px-6 py-4 font-semibold cursor-pointer hover:bg-neutral-100" onClick={() => requestSort(key)}>
                                    <div className="flex items-center gap-1">
                                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                        {renderSortArrow(key)}
                                    </div>
                                </th>
                            ))}
                            <th scope="col" className="px-6 py-4 font-semibold text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan={8} className="text-center p-8 text-neutral-500">Loading students...</td></tr>
                        ) : paginatedStudents.length === 0 ? (
                            <tr><td colSpan={8} className="text-center p-8 text-neutral-500">No students found.</td></tr>
                        ) : (
                            paginatedStudents.map(student => (
                                <tr key={student.id} className="odd:bg-white even:bg-neutral-50/70 border-b border-neutral-200 last:border-b-0 hover:bg-primary-light/30 transition-colors duration-150" onDoubleClick={() => handleViewStudent(student)}>
                                    <td className="px-6 py-4 font-medium text-neutral-900 whitespace-nowrap flex items-center gap-3">
                                        <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full object-cover"/>
                                        {student.name}
                                    </td>
                                    <td className="px-6 py-4">{student.studentId}</td>
                                    <td className="px-6 py-4">{getClassDisplayName(student.class)} {student.section}</td>
                                    <td className="px-6 py-4">{student.parentName}</td>
                                    <td className="px-6 py-4">{student.contact}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            student.status === 'Active' ? 'bg-green-100 text-green-800' :
                                            student.status === 'Suspended' ? 'bg-red-100 text-red-800' :
                                            'bg-neutral-100 text-neutral-800'
                                        }`}>
                                            {student.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{student.attendance}%</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-4">
                                            <button onClick={() => handleViewStudent(student)} className="text-neutral-500 hover:text-primary transition-colors"><EyeIcon className="w-5 h-5"/></button>
                                            <button onClick={() => handleEditStudent(student)} className="text-neutral-500 hover:text-accent-yellow transition-colors"><EditIcon className="w-5 h-5"/></button>
                                            <button onClick={() => handleDeleteStudent(student.id)} className="text-neutral-500 hover:text-accent-red transition-colors"><DeleteIcon className="w-5 h-5"/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

             {/* Pagination */}
             <div className="flex justify-between items-center pt-4">
                <span className="text-sm text-neutral-700">
                    Showing <span className="font-semibold">{Math.min((currentPage - 1) * itemsPerPage + 1, sortedStudents.length)}</span> to <span className="font-semibold">{Math.min(currentPage * itemsPerPage, sortedStudents.length)}</span> of <span className="font-semibold">{sortedStudents.length}</span> results
                </span>
                <div className="flex items-center gap-2">
                    <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1 || isLoading} className="px-3 py-1 border rounded-md disabled:opacity-50">Previous</button>
                    <span className="text-sm">{currentPage} / {totalPages || 1}</span>
                    <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages || isLoading} className="px-3 py-1 border rounded-md disabled:opacity-50">Next</button>
                </div>
            </div>

            {isExportModalOpen && (() => {
                const sortableKeys: (keyof Student)[] = ['name', 'studentId', 'rollNo', 'class', 'parentName', 'contact', 'status', 'attendance'];
                return (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
                        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                            <h3 className="text-lg font-bold text-neutral-800">Export Student Data</h3>
                            <p className="mt-2 text-sm text-neutral-600">Configure sorting for your CSV export. The current search and class filters will be applied.</p>
                            
                            <div className="mt-4 grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="sortBy" className="block text-sm font-medium text-neutral-700">Sort By</label>
                                    <select
                                        id="sortBy"
                                        value={exportSortConfig.key}
                                        onChange={(e) => setExportSortConfig(prev => ({ ...prev, key: e.target.value as keyof Student }))}
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-neutral-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                                    >
                                        {sortableKeys.map(key => (
                                            <option key={key} value={key}>
                                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="sortDirection" className="block text-sm font-medium text-neutral-700">Direction</label>
                                    <select
                                        id="sortDirection"
                                        value={exportSortConfig.direction}
                                        onChange={(e) => setExportSortConfig(prev => ({ ...prev, direction: e.target.value as 'ascending' | 'descending' }))}
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-neutral-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                                    >
                                        <option value="ascending">Ascending</option>
                                        <option value="descending">Descending</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end space-x-3">
                                <button onClick={() => setIsExportModalOpen(false)} className="px-4 py-2 bg-neutral-200 text-neutral-800 rounded-md hover:bg-neutral-300">Cancel</button>
                                <button onClick={handleConfirmExport} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark">Export CSV</button>
                            </div>
                        </div>
                    </div>
                );
            })()}
            
            <StudentDetailView
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                student={studentToView}
            />
            <StudentModal 
                isOpen={isStudentModalOpen}
                onClose={() => setIsStudentModalOpen(false)}
                onSave={handleSaveStudent}
                student={selectedStudent}
                selectedClass={selectedClass}
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