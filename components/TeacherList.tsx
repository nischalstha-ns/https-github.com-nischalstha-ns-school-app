// Fix: Create the content for the missing TeacherList.tsx file.
// This component provides a full-featured UI for managing the list of teachers.
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Teacher } from '../types';
import { SearchIcon, PlusIcon, EditIcon, DeleteIcon, ArrowUpIcon, ArrowDownIcon, UploadIcon, DownloadIcon } from './icons';
import TeacherModal from './TeacherModal';
import ConfirmationModal from './ConfirmationModal';
import ImportModal from './ImportModal';
import { getTeachers, addTeacher, updateTeacher, deleteTeacher, seedTeachersDatabase, getTeachersCollectionSize } from '../services/firestoreService';


const TeacherList: React.FC = () => {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSeeding, setIsSeeding] = useState(false);
    const [isSeedButtonDisabled, setIsSeedButtonDisabled] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof Teacher; direction: 'ascending' | 'descending' } | null>({ key: 'name', direction: 'ascending' });
    
    const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
    const [teacherToDelete, setTeacherToDelete] = useState<string | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const fetchTeachers = useCallback(async () => {
        setIsLoading(true);
        try {
            const teachersFromDb = await getTeachers();
            setTeachers(teachersFromDb);
        } catch (error) {
            console.error("Error fetching teachers:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTeachers();
        getTeachersCollectionSize().then(size => {
            if (size > 0) {
                setIsSeedButtonDisabled(true);
            }
        });
    }, [fetchTeachers]);

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

    const handleDeleteTeacher = (id: string) => {
        setTeacherToDelete(id);
        setIsConfirmModalOpen(true);
    };

    const confirmDelete = async () => {
        if (teacherToDelete) {
            await deleteTeacher(teacherToDelete);
            fetchTeachers();
        }
        setIsConfirmModalOpen(false);
        setTeacherToDelete(null);
    };
    
    const handleSaveTeacher = async (teacherData: Omit<Teacher, 'id' | 'assignedClasses'> & { id?: string; assignedClasses: string }) => {
        const { id, ...data } = teacherData;
        const processedData = {
            ...data,
            assignedClasses: data.assignedClasses.split(',').map(s => s.trim()).filter(Boolean),
        };

        if (id) {
            await updateTeacher(id, processedData);
        } else {
            await addTeacher(processedData);
        }
        fetchTeachers();
        setIsTeacherModalOpen(false);
    };

    const handleSeedDatabase = async () => {
        setIsSeeding(true);
        try {
            await seedTeachersDatabase();
            await fetchTeachers();
            setIsSeedButtonDisabled(true);
        } catch(e) {
            console.error("Failed to seed database: ", e);
            alert("Failed to seed database. Check console for errors.");
        } finally {
            setIsSeeding(false);
        }
    }

    const handleExport = () => {
        if (sortedTeachers.length === 0) {
            alert("No data to export.");
            return;
        }

        const headers = ['teacherId', 'name', 'email', 'phone', 'department', 'assignedClasses', 'joiningDate', 'status', 'yearsOfExperience'];

        const rows = sortedTeachers.map(teacher => [
            teacher.teacherId,
            `"${teacher.name.replace(/"/g, '""')}"`,
            teacher.email,
            teacher.phone,
            teacher.department,
            `"${teacher.assignedClasses.join('; ')}"`, // Use semicolon to avoid conflicts with CSV comma
            teacher.joiningDate,
            teacher.status,
            teacher.yearsOfExperience
        ].join(','));

        const csvContent = [headers.join(','), ...rows].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'teachers.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleImport = (file: File) => {
        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const csv = event.target?.result as string;
                const lines = csv.split(/\r\n|\n/);
                const headers = lines[0].split(',').map(h => h.trim());
                
                const newTeachersData: Omit<Teacher, 'id'>[] = lines.slice(1).map(line => {
                    if (!line.trim()) return null;
                    const values = line.split(',');
                    const teacherObj = headers.reduce((obj, header, index) => {
                        obj[header] = values[index] ? values[index].trim() : '';
                        return obj;
                    }, {} as any);

                    return {
                        teacherId: teacherObj.teacherId || `T-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
                        name: teacherObj.name,
                        avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
                        email: teacherObj.email,
                        phone: teacherObj.phone,
                        department: teacherObj.department,
                        assignedClasses: (teacherObj.assignedClasses || '').split(';').map((s: string) => s.trim()).filter(Boolean),
                        joiningDate: teacherObj.joiningDate || new Date().toISOString().split('T')[0],
                        status: teacherObj.status || 'Active',
                        yearsOfExperience: Number(teacherObj.yearsOfExperience) || 0,
                    };
                }).filter((t): t is Omit<Teacher, 'id'> => t !== null && !!t.name && !!t.email);
                
                if (newTeachersData.length > 0) {
                    setIsLoading(true);
                    await Promise.all(newTeachersData.map(teacher => addTeacher(teacher)));
                    await fetchTeachers();
                }
            } catch (error) {
                console.error("Error importing teachers:", error);
                alert("Failed to import teachers. Please check the file format and content.");
            } finally {
                setIsLoading(false);
            }
        };
        reader.readAsText(file);
    };
    
    const renderSortArrow = (key: keyof Teacher) => {
        if (!sortConfig || sortConfig.key !== key) return null;
        if (sortConfig.direction === 'ascending') return <ArrowUpIcon className="w-4 h-4" />;
        return <ArrowDownIcon className="w-4 h-4" />;
    };
    
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-3xl font-bold text-neutral-800">Teachers</h1>
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                     <div className="relative flex-grow">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                        <input
                            type="text"
                            placeholder="Search teachers..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            className="pl-10 pr-4 py-2 w-full border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                     <button onClick={() => setIsImportModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-300 text-neutral-700 font-semibold rounded-lg hover:bg-neutral-50">
                        <UploadIcon className="w-5 h-5" />
                        <span className="hidden sm:inline">Import</span>
                    </button>
                    <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-300 text-neutral-700 font-semibold rounded-lg hover:bg-neutral-50">
                        <DownloadIcon className="w-5 h-5" />
                        <span className="hidden sm:inline">Export</span>
                    </button>
                    <button onClick={handleAddTeacher} className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark">
                        <PlusIcon className="w-5 h-5" />
                         <span className="hidden sm:inline">Add Teacher</span>
                    </button>
                </div>
            </div>

            {!isSeedButtonDisabled && (
                 <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                    <div className="flex">
                        <div className="py-1">
                            <p className="font-bold">Database is Empty</p>
                            <p className="text-sm">Click the seed button to populate your Firestore database with initial teacher data.</p>
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
                            {(['name', 'teacherId', 'department', 'phone', 'status', 'yearsOfExperience'] as Array<keyof Teacher>).map((key) => (
                                <th key={key} scope="col" className="px-6 py-4 font-semibold cursor-pointer hover:bg-neutral-100" onClick={() => requestSort(key as keyof Teacher)}>
                                    <div className="flex items-center gap-1">
                                        {key === 'teacherId' ? 'Teacher ID' : key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                        {renderSortArrow(key as keyof Teacher)}
                                    </div>
                                </th>
                            ))}
                            <th scope="col" className="px-6 py-4 font-semibold text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan={7} className="text-center p-8 text-neutral-500">Loading teachers...</td></tr>
                        ) : paginatedTeachers.length === 0 ? (
                            <tr><td colSpan={7} className="text-center p-8 text-neutral-500">No teachers found.</td></tr>
                        ) : (
                            paginatedTeachers.map(teacher => (
                                <tr key={teacher.id} className="odd:bg-white even:bg-neutral-50/70 border-b border-neutral-200 last:border-b-0 hover:bg-primary-light/30 transition-colors duration-150">
                                    <td className="px-6 py-4 font-medium text-neutral-900 whitespace-nowrap flex items-center gap-3">
                                        <img src={teacher.avatar} alt={teacher.name} className="w-10 h-10 rounded-full object-cover"/>
                                        {teacher.name}
                                    </td>
                                    <td className="px-6 py-4">{teacher.teacherId}</td>
                                    <td className="px-6 py-4">{teacher.department}</td>
                                    <td className="px-6 py-4">{teacher.phone}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            teacher.status === 'Active' ? 'bg-green-100 text-green-800' :
                                            teacher.status === 'On Leave' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-neutral-100 text-neutral-800'
                                        }`}>
                                            {teacher.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">{teacher.yearsOfExperience}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-4">
                                            <button onClick={() => handleEditTeacher(teacher)} className="text-neutral-500 hover:text-accent-yellow transition-colors"><EditIcon className="w-5 h-5"/></button>
                                            <button onClick={() => handleDeleteTeacher(teacher.id)} className="text-neutral-500 hover:text-accent-red transition-colors"><DeleteIcon className="w-5 h-5"/></button>
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
                    Showing <span className="font-semibold">{Math.min((currentPage - 1) * itemsPerPage + 1, sortedTeachers.length)}</span> to <span className="font-semibold">{Math.min(currentPage * itemsPerPage, sortedTeachers.length)}</span> of <span className="font-semibold">{sortedTeachers.length}</span> results
                </span>
                <div className="flex items-center gap-2">
                    <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1 || isLoading} className="px-3 py-1 border rounded-md disabled:opacity-50">Previous</button>
                    <span className="text-sm">{currentPage} / {totalPages || 1}</span>
                    <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages || isLoading} className="px-3 py-1 border rounded-md disabled:opacity-50">Next</button>
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
                title="Import Teachers from CSV"
                templateUrl="/teacher_template.csv"
            />
        </div>
    );
};

export default TeacherList;