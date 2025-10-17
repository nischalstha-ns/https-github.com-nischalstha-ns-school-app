import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { FEES_CHART_DATA } from '../constants';
import { FeeCollection } from '../types';
import { SearchIcon, EditIcon, PlusIcon, DeleteIcon, TrendingUpIcon, FileTextIcon } from './icons';
import { getFinanceData, addFinanceRecord, updateFinanceRecord, deleteFinanceRecord, seedFinanceDatabase, getFinanceCollectionSize } from '../services/firestoreService';
import ConfirmationModal from './ConfirmationModal';
import FinanceModal from './FinanceModal';


const FinanceStatCard: React.FC<{ title: string; value: string; percentage: number; }> = ({ title, value, percentage }) => {
    const isPositive = percentage >= 0;
    return (
        <div className="bg-white border border-neutral-200/80 p-4 rounded-xl shadow-sm flex flex-col justify-between h-full">
            <div className="flex justify-between items-center">
                <TrendingUpIcon className="w-8 h-8 text-primary-light" />
                <div className={`flex items-center text-xs px-2 py-1 rounded-full ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {isPositive ? '↑' : '↓'} {Math.abs(percentage)}%
                </div>
            </div>
            <div>
                <p className="font-bold text-2xl text-neutral-800">{value}</p>
                <p className="text-sm text-neutral-500">{title}</p>
            </div>
        </div>
    );
};

const FeesLineChart: React.FC = () => {
    const data = FEES_CHART_DATA;
    const width = 600;
    const height = 250;
    const padding = 30;

    const maxY = Math.max(...data.map(d => d.amount)) * 1.1;
    const xStep = (width - padding * 2) / (data.length - 1);

    const getPathPoints = (dataPoints: typeof data) => dataPoints.map((d, i) => ({ x: padding + i * xStep, y: height - padding - (d.amount / maxY * (height - padding * 2)) }));

    const toPath = (points: {x: number, y: number}[]) => {
        return points.reduce((acc, point, i) => {
            if (i === 0) return `M ${point.x},${point.y}`;
            const cp1 = { x: points[i-1].x + xStep / 2, y: points[i-1].y };
            const cp2 = { x: point.x - xStep / 2, y: point.y };
            return `${acc} C ${cp1.x},${cp1.y} ${cp2.x},${cp2.y} ${point.x},${point.y}`;
        }, "");
    };

    const points = getPathPoints(data);
    const linePath = toPath(points);
    const areaPath = `${linePath} L ${width - padding},${height - padding} L ${padding},${height - padding} Z`;
    
    const highlightedPoint = points[7]; // August

    return (
        <div className="relative">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
                <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#e0e7ff" stopOpacity={0.8}/>
                        <stop offset="100%" stopColor="#e0e7ff" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                {data.map((d, i) => (
                    <text key={d.month} x={padding + i * xStep} y={height - padding + 15} textAnchor="middle" fontSize="10" fill="#64748b">{d.month}</text>
                ))}
                
                <path d={areaPath} fill="url(#areaGradient)" />
                <path d={linePath} fill="none" stroke="#4f46e5" strokeWidth="2" />

                <line x1={highlightedPoint.x} y1={highlightedPoint.y} x2={highlightedPoint.x} y2={height - padding} stroke="#4f46e5" strokeWidth="1" strokeDasharray="3 3"/>
                <circle cx={highlightedPoint.x} cy={highlightedPoint.y} r="5" fill="#4f46e5" stroke="white" strokeWidth="2" />
            </svg>
             <div className="absolute bg-white p-2 rounded-md shadow-lg text-xs text-center border" style={{ left: `${(highlightedPoint.x / width * 100)}%`, top: `${(highlightedPoint.y / height * 100) - 25}%`, transform: 'translateX(-50%)', pointerEvents: 'none' }}>
                <p className="font-bold text-neutral-800">$6,500</p>
                <p className="text-neutral-500">August</p>
            </div>
        </div>
    );
};

const Finance: React.FC = () => {
    const [fees, setFees] = useState<FeeCollection[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSeeding, setIsSeeding] = useState(false);
    const [isSeedButtonDisabled, setIsSeedButtonDisabled] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    
    const [selectedRecord, setSelectedRecord] = useState<FeeCollection | null>(null);
    const [recordToDelete, setRecordToDelete] = useState<string | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    
    const fetchFinanceData = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getFinanceData();
            setFees(data);
        } catch (error) {
            console.error("Error fetching finance data:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFinanceData();
        getFinanceCollectionSize().then(size => {
            if (size > 0) setIsSeedButtonDisabled(true);
        });
    }, [fetchFinanceData]);

    const paginatedFees = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return fees.slice(startIndex, startIndex + itemsPerPage);
    }, [fees, currentPage]);

    const totalPages = Math.ceil(fees.length / itemsPerPage);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);
    }
    
    const handleAddRecord = () => {
        setSelectedRecord(null);
        setIsModalOpen(true);
    };

    const handleEditRecord = (record: FeeCollection) => {
        setSelectedRecord(record);
        setIsModalOpen(true);
    };

    const handleDeleteRecord = (id: string) => {
        setRecordToDelete(id);
        setIsConfirmModalOpen(true);
    };
    
    const confirmDelete = async () => {
        if (recordToDelete) {
            await deleteFinanceRecord(recordToDelete);
            fetchFinanceData();
        }
        setIsConfirmModalOpen(false);
        setRecordToDelete(null);
    };

    const handleSaveRecord = async (recordData: Omit<FeeCollection, 'id'> & { id?: string }) => {
        const { id, ...data } = recordData;
        if (id) {
            await updateFinanceRecord(id, data);
        } else {
            await addFinanceRecord(data);
        }
        fetchFinanceData();
        setIsModalOpen(false);
    };

    const handleSeedDatabase = async () => {
        setIsSeeding(true);
        try {
            await seedFinanceDatabase();
            await fetchFinanceData();
            setIsSeedButtonDisabled(true);
        } catch (e) {
            console.error("Failed to seed database:", e);
        } finally {
            setIsSeeding(false);
        }
    };

    const getStatusPill = (status: FeeCollection['status']) => {
        const baseClasses = "flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full w-fit";
        switch (status) {
            case 'Paid': return <span className={`${baseClasses} bg-green-100 text-green-700`}><span className="w-2 h-2 rounded-full bg-green-500"></span>Paid</span>;
            case 'Pending': return <span className={`${baseClasses} bg-yellow-100 text-yellow-700`}><span className="w-2 h-2 rounded-full bg-yellow-500"></span>Pending</span>;
            case 'Overdue': return <span className={`${baseClasses} bg-red-100 text-red-700`}><span className="w-2 h-2 rounded-full bg-red-500"></span>Overdue</span>;
            default: return null;
        }
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 bg-white p-4 rounded-xl shadow-sm">
                    <h2 className="text-lg font-semibold text-neutral-800 mb-2">Fees Collection Overview</h2>
                    <FeesLineChart />
                </div>
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                    <FinanceStatCard title="Total Collected" value="$126,450" percentage={15} />
                    <FinanceStatCard title="Pending Amount" value="$67,200" percentage={-5} />
                </div>
            </div>

            {!isSeedButtonDisabled && (
                 <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                    <div className="flex">
                        <div className="py-1">
                            <p className="font-bold">Database is Empty</p>
                            <p className="text-sm">Click the seed button to populate your Firestore database with initial finance data.</p>
                        </div>
                        <div className="ml-auto pl-3">
                             <button onClick={handleSeedDatabase} disabled={isSeeding || isSeedButtonDisabled} className="px-4 py-2 bg-yellow-400 text-yellow-900 font-semibold rounded-lg hover:bg-yellow-500 disabled:bg-neutral-400 disabled:cursor-not-allowed">
                                {isSeeding ? 'Seeding...' : 'Seed Database'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="bg-white rounded-xl shadow-sm">
                 <div className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-neutral-200">
                    <h2 className="text-lg font-semibold text-neutral-800">Fees Collection Details</h2>
                     <div className="flex items-center gap-2 flex-wrap">
                        <div className="relative">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400"/>
                            <input type="text" placeholder="Search..." className="pl-9 pr-3 py-2 w-full sm:w-40 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"/>
                        </div>
                        <button onClick={handleAddRecord} className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark">
                            <PlusIcon className="w-5 h-5" />
                            <span className="hidden sm:inline">Add Record</span>
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-neutral-600">
                        <thead className="text-xs text-neutral-700 uppercase bg-neutral-50/80">
                            <tr>
                                <th className="p-4 font-semibold">Student Name</th>
                                <th className="p-4 font-semibold">Class</th>
                                <th className="p-4 font-semibold">Amount</th>
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 font-semibold text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan={5} className="text-center p-8 text-neutral-500">Loading data...</td></tr>
                            ) : paginatedFees.length === 0 ? (
                                <tr><td colSpan={5} className="text-center p-8 text-neutral-500">No records found.</td></tr>
                            ) : (
                                paginatedFees.map(fee => (
                                    <tr key={fee.id} className="odd:bg-white even:bg-neutral-50/70 border-b border-neutral-200 last:border-b-0 hover:bg-primary-light/30 transition-colors duration-150">
                                        <td className="p-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <img src={fee.avatar} alt={fee.studentName} className="w-9 h-9 rounded-full"/>
                                                <div>
                                                    <p className="font-semibold text-neutral-800">{fee.studentName}</p>
                                                    <p className="text-xs text-neutral-500">{fee.studentId}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">{fee.class}</td>
                                        <td className="p-4 font-semibold text-neutral-800">{formatCurrency(fee.totalAmount)}</td>
                                        <td className="p-4">{getStatusPill(fee.status)}</td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-center gap-4">
                                                <button onClick={() => handleEditRecord(fee)} className="text-neutral-500 hover:text-accent-yellow"><EditIcon className="w-5 h-5"/></button>
                                                <button className="text-neutral-500 hover:text-primary"><FileTextIcon className="w-5 h-5"/></button>
                                                <button onClick={() => handleDeleteRecord(fee.id)} className="text-neutral-500 hover:text-accent-red"><DeleteIcon className="w-5 h-5"/></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                 <div className="p-4 flex justify-between items-center">
                    <span className="text-sm text-neutral-700">
                        Page <span className="font-semibold">{currentPage}</span> of <span className="font-semibold">{totalPages}</span>
                    </span>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 border rounded-md text-sm font-medium disabled:opacity-50">Previous</button>
                        <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1 border rounded-md text-sm font-medium disabled:opacity-50">Next</button>
                    </div>
                </div>
            </div>
            
            <FinanceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveRecord}
                record={selectedRecord}
            />
            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onCancel={() => setIsConfirmModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Fee Record"
                message="Are you sure you want to delete this fee record? This action cannot be undone."
            />
        </div>
    );
};

export default Finance;