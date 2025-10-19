import React, { useState, useMemo } from 'react';
import { Result } from '../types';
import { SearchIcon, PlusIcon, EditIcon, DeleteIcon, ArrowUpIcon, ArrowDownIcon } from './icons';
import ResultModal from './ResultModal';
import ConfirmationModal from './ConfirmationModal';
import { useAppContext } from '../state/AppContext';

const classDisplayMap: { [key: number]: string } = {
    '-2': 'Nursery', '-1': 'LKG', '0': 'UKG',
};
const getClassDisplayName = (classNum: number) => classDisplayMap[classNum] || `Class ${classNum}`;

const Result: React.FC = () => {
    const { results, students, isLoading, addResult, updateResult, deleteResult, seedAllData } = useAppContext();
    const [isSeeding, setIsSeeding] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof Result; direction: 'ascending' | 'descending' } | null>({ key: 'studentName', direction: 'ascending' });
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    
    const [selectedResult, setSelectedResult] = useState<Result | null>(null);
    const [resultToDelete, setResultToDelete] = useState<string | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const filteredResults = useMemo(() => {
        return results.filter(result =>
            result.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            result.studentId.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [results, searchTerm]);

    const sortedResults = useMemo(() => {
        let sortableItems = [...filteredResults];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                const valA = a[sortConfig.key];
                const valB = b[sortConfig.key];
                
                if (typeof valA === 'string' && typeof valB === 'string') {
                    return sortConfig.direction === 'ascending' ? valA.localeCompare(valB) : valB.localeCompare(valA);
                }
                if (typeof valA === 'number' && typeof valB === 'number') {
                    if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
                    if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [filteredResults, sortConfig]);

    const paginatedResults = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return sortedResults.slice(startIndex, startIndex + itemsPerPage);
    }, [sortedResults, currentPage]);

    const totalPages = Math.ceil(sortedResults.length / itemsPerPage);

    const requestSort = (key: keyof Result) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const handleAddResult = () => {
        setSelectedResult(null);
        setIsModalOpen(true);
    };

    const handleEditResult = (result: Result) => {
        setSelectedResult(result);
        setIsModalOpen(true);
    };

    const handleDeleteResult = (id: string) => {
        setResultToDelete(id);
        setIsConfirmModalOpen(true);
    };

    const confirmDelete = async () => {
        if (resultToDelete) {
            await deleteResult(resultToDelete);
        }
        setIsConfirmModalOpen(false);
        setResultToDelete(null);
    };
    
    const handleSaveResult = async (resultData: Omit<Result, 'id'> & { id?: string }) => {
        const { id, ...data } = resultData;
        if (id) {
            await updateResult(id, data);
        } else {
            await addResult(data);
        }
        setIsModalOpen(false);
    };

    const handleSeedDatabase = async () => {
        setIsSeeding(true);
        try {
            await seedAllData();
        } catch(e) {
            console.error("Failed to seed database: ", e);
            alert("Failed to seed database. Check console for errors.");
        } finally {
            setIsSeeding(false);
        }
    };
    
    const renderSortArrow = (key: keyof Result) => {
        if (!sortConfig || sortConfig.key !== key) return null;
        if (sortConfig.direction === 'ascending') return <ArrowUpIcon className="w-4 h-4" />;
        return <ArrowDownIcon className="w-4 h-4" />;
    };

    const getGradePill = (grade: string) => {
        const base = "px-3 py-1 rounded-full text-xs font-bold w-10 text-center ";
        if (grade.startsWith('A')) return base + "bg-green-100 text-green-800";
        if (grade.startsWith('B')) return base + "bg-blue-100 text-blue-800";
        if (grade.startsWith('C')) return base + "bg-yellow-100 text-yellow-800";
        return base + "bg-red-100 text-red-800";
    };
    
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-3xl font-bold text-neutral-800">Student Results</h1>
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                     <div className="relative flex-grow">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                        <input
                            type="text"
                            placeholder="Search by student name..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            className="pl-10 pr-4 py-2 w-full border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <button onClick={handleAddResult} className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark">
                        <PlusIcon className="w-5 h-5" />
                         <span className="hidden sm:inline">Add Result</span>
                    </button>
                </div>
            </div>

            {!isLoading && results.length === 0 && (
                 <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                    <div className="flex">
                        <div className="py-1">
                            <p className="font-bold">Database is Empty</p>
                            <p className="text-sm">Click the seed button to populate your database with initial result data.</p>
                        </div>
                        <div className="ml-auto pl-3">
                             <button onClick={handleSeedDatabase} disabled={isSeeding} className="px-4 py-2 bg-yellow-400 text-yellow-900 font-semibold rounded-lg hover:bg-yellow-500 disabled:bg-neutral-400 disabled:cursor-not-allowed">
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
                            {(['studentName', 'class', 'examType', 'percentage', 'grade'] as Array<keyof Result>).map((key) => (
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
                            <tr><td colSpan={6} className="text-center p-8 text-neutral-500">Loading results...</td></tr>
                        ) : paginatedResults.length === 0 ? (
                            <tr><td colSpan={6} className="text-center p-8 text-neutral-500">No results found.</td></tr>
                        ) : (
                            paginatedResults.map(result => (
                                <tr key={result.id} className="odd:bg-white even:bg-neutral-50/70 border-b border-neutral-200 last:border-b-0 hover:bg-primary-light/30 transition-colors duration-150">
                                    <td className="px-6 py-4 font-medium text-neutral-900 whitespace-nowrap">{result.studentName}</td>
                                    <td className="px-6 py-4">{getClassDisplayName(result.class)} {result.section}</td>
                                    <td className="px-6 py-4">{result.examType}</td>
                                    <td className="px-6 py-4 font-semibold">{result.percentage.toFixed(2)}%</td>
                                    <td className="px-6 py-4"><span className={getGradePill(result.grade)}>{result.grade}</span></td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-4">
                                            <button onClick={() => handleEditResult(result)} className="text-neutral-500 hover:text-accent-yellow transition-colors"><EditIcon className="w-5 h-5"/></button>
                                            <button onClick={() => handleDeleteResult(result.id)} className="text-neutral-500 hover:text-accent-red transition-colors"><DeleteIcon className="w-5 h-5"/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
             
             <div className="flex justify-between items-center pt-4">
                <span className="text-sm text-neutral-700">
                    Showing <span className="font-semibold">{Math.min((currentPage - 1) * itemsPerPage + 1, sortedResults.length)}</span> to <span className="font-semibold">{Math.min(currentPage * itemsPerPage, sortedResults.length)}</span> of <span className="font-semibold">{sortedResults.length}</span> results
                </span>
                <div className="flex items-center gap-2">
                    <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1 || isLoading} className="px-3 py-1 border rounded-md disabled:opacity-50">Previous</button>
                    <span className="text-sm">{currentPage} / {totalPages || 1}</span>
                    <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages || isLoading} className="px-3 py-1 border rounded-md disabled:opacity-50">Next</button>
                </div>
            </div>

            <ResultModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveResult}
                result={selectedResult}
            />
            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onCancel={() => setIsConfirmModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Result"
                message="Are you sure you want to delete this result? This action cannot be undone."
            />
        </div>
    );
};

export default Result;