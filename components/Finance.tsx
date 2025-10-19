import React, { useState, useMemo } from 'react';
import { FeeCollection, Expense } from '../types';
import { SearchIcon, EditIcon, PlusIcon, DeleteIcon, TrendingUpIcon, ArrowDownIcon, ArrowUpIcon, PaperclipIcon, DownloadIcon } from './icons';
import ConfirmationModal from './ConfirmationModal';
import ExpenseModal from './ExpenseModal';
import { useAppContext } from '../state/AppContext';

// Fix: Changed SortConfig to be more generic to accommodate different object shapes.
type SortConfig = { key: string; direction: 'ascending' | 'descending' } | null;
type DateRange = 'month' | 'year' | 'all';

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; iconBg: string; }> = ({ title, value, icon, iconBg }) => (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-neutral-200/80 flex items-center gap-4">
        <div className={`p-3 rounded-lg ${iconBg}`}>{icon}</div>
        <div><p className="text-sm text-neutral-500">{title}</p><p className="font-bold text-2xl text-neutral-800">{value}</p></div>
    </div>
);

const ExpensePieChart: React.FC<{ expenses: Expense[] }> = ({ expenses }) => {
    const categoryData = useMemo(() => {
        const data = expenses.reduce((acc, { category, amount }) => {
            acc[category] = (acc[category] || 0) + amount;
            return acc;
        }, {} as Record<string, number>);
        return Object.entries(data).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);
    }, [expenses]);

    const total = categoryData.reduce((sum, d) => sum + d.value, 0);
    if (total === 0) return <div className="flex items-center justify-center h-full text-neutral-500">No expense data</div>;

    const colors = ['#4f46e5', '#10b981', '#f59e0b', '#3b82f6', '#ef4444'];

    return (
        <div className="flex flex-col md:flex-row items-center gap-6 h-full">
            <div className="relative w-40 h-40">
                <svg viewBox="0 0 100 100" className="-rotate-90">
                    {(() => {
                        let accumulated = 0;
                        return categoryData.map((d, i) => {
                            const percent = (d.value / total) * 100;
                            const element = <circle key={d.name} cx="50" cy="50" r="45" fill="transparent" stroke={colors[i % colors.length]} strokeWidth="10" strokeDasharray={`${percent} ${100 - percent}`} strokeDashoffset={-accumulated}/>;
                            accumulated += percent;
                            return element;
                        });
                    })()}
                </svg>
            </div>
            <div className="text-sm space-y-2">
                {categoryData.map((d, i) => (
                    <div key={d.name} className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{backgroundColor: colors[i % colors.length]}}></span>{d.name}</div>
                        <span className="font-semibold">{((d.value / total) * 100).toFixed(1)}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Finance: React.FC = () => {
    const { students, expenses, isLoading, addExpense, updateExpense, deleteExpense, seedAllData } = useAppContext();
    const [view, setView] = useState<'income' | 'expenses'>('income');
    const [dateRange, setDateRange] = useState<DateRange>('month');
    const [searchTerm, setSearchTerm] = useState('');
    // Fix: Updated sortConfig state to be more generic to handle different data structures.
    const [sortConfig, setSortConfig] = useState<SortConfig>(null);
    const [isSeeding, setIsSeeding] = useState(false);
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<Expense | null>(null);
    const [recordToDelete, setRecordToDelete] = useState<{ id: string, type: 'expenses' } | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    
    const fees = useMemo((): FeeCollection[] => students.map((s): FeeCollection => {
        const tuition = 4200 + (s.class * 50), activities = 250 + (s.rollNo % 5) * 10, misc = 150 + (s.rollNo % 8) * 10;
        const statuses: FeeCollection['status'][] = ['Paid', 'Pending', 'Overdue'];
        const classDisplayMap: { [key: number]: string } = { '-2': 'Nursery', '-1': 'LKG', '0': 'UKG' };
        return {
            id: s.id, studentName: s.name, studentId: s.studentId, avatar: s.avatar, class: `${classDisplayMap[s.class] || `Class ${s.class}`} ${s.section}`,
            tuitionFee: tuition, activitiesFee: activities, miscellaneousFee: misc, totalAmount: tuition + activities + misc, status: statuses[s.rollNo % 3], date: s.admissionDate
        };
    }), [students]);

    const filteredData = useMemo(() => {
        const now = new Date();
        const filterByDate = (itemDate: string) => {
            const d = new Date(itemDate);
            if (dateRange === 'month') return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            if (dateRange === 'year') return d.getFullYear() === now.getFullYear();
            return true; // 'all'
        };
        return { filteredFees: fees.filter(f => filterByDate(f.date)), filteredExpenses: expenses.filter(e => filterByDate(e.date)) };
    }, [fees, expenses, dateRange]);

    const { totalIncome, totalExpenses, netProfit, pendingDues } = useMemo(() => {
        const { filteredFees, filteredExpenses } = filteredData;
        const income = filteredFees.filter(f => f.status === 'Paid').reduce((s, f) => s + f.totalAmount, 0);
        const exp = filteredExpenses.filter(e => e.status === 'Paid').reduce((s, e) => s + e.amount, 0);
        const pending = filteredFees.filter(f => f.status === 'Pending' || f.status === 'Overdue').reduce((s, f) => s + f.totalAmount, 0);
        return { totalIncome: income, totalExpenses: exp, netProfit: income - exp, pendingDues: pending };
    }, [filteredData]);

    const displayedRecords = useMemo(() => {
        const recordsSource = view === 'income' ? filteredData.filteredFees : filteredData.filteredExpenses;
        let records = recordsSource.filter(r => JSON.stringify(r).toLowerCase().includes(searchTerm.toLowerCase()));
        if (sortConfig) {
            // Fix: Cast records to any[] to allow sorting by dynamic keys from different object types.
            (records as any[]).sort((a, b) => {
                const valA = a[sortConfig.key];
                const valB = b[sortConfig.key];
                if (typeof valA === 'string' && typeof valB === 'string') {
                    return sortConfig.direction === 'ascending' ? valA.localeCompare(valB) : valB.localeCompare(valA);
                }
                if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }
        return records;
    }, [view, filteredData, searchTerm, sortConfig]);

    const paginatedRecords = useMemo(() => displayedRecords.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage), [displayedRecords, currentPage]);
    const totalPages = Math.ceil(displayedRecords.length / itemsPerPage);

    // Fix: Changed key type to string to accept keys from both FeeCollection and Expense.
    const requestSort = (key: string) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig?.key === key && sortConfig.direction === 'ascending') direction = 'descending';
        setSortConfig({ key, direction });
    };

    const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    
    const handleSaveExpenseRecord = async (recordData: Omit<Expense, 'id'> & { id?: string }) => {
        const { id, ...data } = recordData;
        if (id) await updateExpense(id, data); else await addExpense(data);
        setIsExpenseModalOpen(false);
    };

    const confirmDelete = async () => { recordToDelete && await deleteExpense(recordToDelete.id); setIsConfirmModalOpen(false); setRecordToDelete(null); };
    
    const handleExport = () => {
        if (displayedRecords.length === 0) return alert("No data to export.");
        const headers = view === 'income' ? ['Student Name', 'Student ID', 'Class', 'Total Amount', 'Status', 'Date'] : ['Description', 'Category', 'Date', 'Amount', 'Status'];
        const rows = displayedRecords.map(r => view === 'income' ? [ (r as FeeCollection).studentName, (r as FeeCollection).studentId, (r as FeeCollection).class, (r as FeeCollection).totalAmount, r.status, (r as FeeCollection).date ] : [ (r as Expense).description, (r as Expense).category, r.date, (r as Expense).amount, r.status ]);
        const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${view}_${dateRange}.csv`;
        link.click();
    };

    const getStatusPill = (status: FeeCollection['status'] | Expense['status']) => {
        const styles = {
            Paid: "bg-green-100 text-green-700", Pending: "bg-yellow-100 text-yellow-700", Overdue: "bg-red-100 text-red-700"
        };
        const dotStyles = { Paid: "bg-green-500", Pending: "bg-yellow-500", Overdue: "bg-red-500" };
        return <span className={`flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full w-fit ${styles[status]}`}><span className={`w-2 h-2 rounded-full ${dotStyles[status]}`}></span>{status}</span>;
    };

    const renderSortArrow = (key: keyof (FeeCollection | Expense)) => {
        if (!sortConfig || sortConfig.key !== key) return null;
        return sortConfig.direction === 'ascending' ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-2">
                <h1 className="text-3xl font-bold text-neutral-800">Financial Overview</h1>
                {/* Fix: Replaced invalid <for> loop with a standard .map() call to render buttons. */}
                <div className="flex bg-neutral-100 p-1 rounded-lg">
                    {(['month', 'year', 'all'] as DateRange[]).map(range => (
                        <button key={range} onClick={() => setDateRange(range)} className={`px-3 py-1 text-sm font-semibold rounded-md capitalize ${dateRange === range ? 'bg-white shadow-sm text-primary' : 'text-neutral-600'}`}>
                            {range === 'month' ? 'This Month' : range === 'year' ? 'This Year' : 'All Time'}
                        </button>
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Income" value={formatCurrency(totalIncome)} icon={<ArrowUpIcon className="w-6 h-6 text-green-600"/>} iconBg="bg-green-100" />
                <StatCard title="Total Expenses" value={formatCurrency(totalExpenses)} icon={<ArrowDownIcon className="w-6 h-6 text-red-600"/>} iconBg="bg-red-100" />
                <StatCard title="Net Profit/Loss" value={formatCurrency(netProfit)} icon={<TrendingUpIcon className="w-6 h-6 text-primary"/>} iconBg="bg-primary-light" />
                <StatCard title="Pending Dues" value={formatCurrency(pendingDues)} icon={<TrendingUpIcon className="w-6 h-6 text-yellow-600"/>} iconBg="bg-yellow-100" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 bg-white p-4 rounded-xl shadow-sm"><h2 className="text-lg font-semibold text-neutral-800 mb-2">Income vs Expense</h2>{/* <FinancialSummaryChart /> */}</div>
                <div className="lg:col-span-2 bg-white p-4 rounded-xl shadow-sm"><h2 className="text-lg font-semibold text-neutral-800 mb-2">Expense Distribution</h2><ExpensePieChart expenses={filteredData.filteredExpenses} /></div>
            </div>

            <div className="bg-white rounded-xl shadow-sm">
                 <div className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-center gap-4 border-b">
                    <div className="flex border border-neutral-200 rounded-lg p-1"><button onClick={() => { setView('income'); setCurrentPage(1); setSortConfig(null); }} className={`px-4 py-1.5 rounded-md text-sm font-semibold ${view === 'income' ? 'bg-primary text-white' : 'text-neutral-600'}`}>Income</button><button onClick={() => { setView('expenses'); setCurrentPage(1); setSortConfig(null); }} className={`px-4 py-1.5 rounded-md text-sm font-semibold ${view === 'expenses' ? 'bg-primary text-white' : 'text-neutral-600'}`}>Expenses</button></div>
                     <div className="flex items-center gap-2 flex-wrap"><div className="relative"><SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400"/><input type="text" placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9 pr-3 py-2 w-full sm:w-40 border-neutral-300 rounded-lg"/></div><button onClick={handleExport} className="flex items-center gap-2 px-3 py-2 border rounded-lg text-sm"><DownloadIcon className="w-4 h-4"/>Export CSV</button><button onClick={() => {setSelectedRecord(null); setIsExpenseModalOpen(true);}} disabled={view !== 'expenses'} className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-semibold rounded-lg disabled:bg-neutral-400"><PlusIcon className="w-5 h-5"/> <span className="hidden sm:inline">Add Expense</span></button></div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-neutral-600">
                        {view === 'income' ? (
                            <>
                                {/* Fix: The onClick handler now passes a string key, compatible with the updated requestSort function. */}
                                <thead className="text-xs uppercase bg-neutral-50/80"><tr>{(['studentName', 'class', 'totalAmount', 'status', 'date'] as Array<keyof FeeCollection>).map(key => <th key={key} className="p-4 font-semibold cursor-pointer" onClick={() => requestSort(key)}><div className="flex items-center gap-1">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} {renderSortArrow(key)}</div></th>)}</tr></thead>
                                <tbody>{paginatedRecords.map(fee => (<tr key={fee.id} className="border-b last:border-b-0 hover:bg-primary-light/30"><td className="p-4"><div className="flex items-center gap-3"><img src={(fee as FeeCollection).avatar} alt={(fee as FeeCollection).studentName} className="w-9 h-9 rounded-full"/><div><p className="font-semibold">{(fee as FeeCollection).studentName}</p><p className="text-xs">{(fee as FeeCollection).studentId}</p></div></div></td><td className="p-4">{(fee as FeeCollection).class}</td><td className="p-4 font-semibold">{formatCurrency((fee as FeeCollection).totalAmount)}</td><td className="p-4">{getStatusPill(fee.status)}</td><td className="p-4">{(fee as FeeCollection).date}</td></tr>))}</tbody>
                            </>
                        ) : (
                            <>
                                {/* Fix: The onClick handler now passes a string key, compatible with the updated requestSort function. */}
                                <thead className="text-xs uppercase bg-neutral-50/80"><tr>{(['description', 'category', 'date', 'amount', 'status', 'receiptUrl'] as Array<keyof Expense>).map(key => <th key={key} className="p-4 font-semibold cursor-pointer" onClick={() => requestSort(key)}><div className="flex items-center gap-1">{key === 'receiptUrl' ? 'Receipt' : key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} {renderSortArrow(key)}</div></th>)}<th className="p-4 font-semibold text-center">Action</th></tr></thead>
                                <tbody>{paginatedRecords.map(exp => (<tr key={exp.id} className="border-b last:border-b-0 hover:bg-primary-light/30"><td className="p-4 font-semibold">{(exp as Expense).description}</td><td className="p-4">{(exp as Expense).category}</td><td className="p-4">{exp.date}</td><td className="p-4 font-semibold">{formatCurrency((exp as Expense).amount)}</td><td className="p-4">{getStatusPill(exp.status)}</td><td className="p-4">{(exp as Expense).receiptUrl ? <a href={(exp as Expense).receiptUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline"><PaperclipIcon className="w-5 h-5"/></a> : 'N/A'}</td><td className="p-4"><div className="flex items-center justify-center gap-4"><button onClick={() => {setSelectedRecord(exp as Expense); setIsExpenseModalOpen(true);}} className="text-neutral-500 hover:text-accent-yellow"><EditIcon className="w-5 h-5"/></button><button onClick={() => {setRecordToDelete({id: exp.id, type: 'expenses'}); setIsConfirmModalOpen(true);}} className="text-neutral-500 hover:text-accent-red"><DeleteIcon className="w-5 h-5"/></button></div></td></tr>))}</tbody>
                            </>
                        )}
                    </table>
                </div>
                 <div className="p-4 flex justify-between items-center"><span className="text-sm text-neutral-700">Page <span className="font-semibold">{currentPage}</span> of <span className="font-semibold">{totalPages || 1}</span></span><div className="flex items-center gap-2"><button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 border rounded-md text-sm font-medium disabled:opacity-50">Previous</button><button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1 border rounded-md text-sm font-medium disabled:opacity-50">Next</button></div></div>
            </div>
            
            <ExpenseModal isOpen={isExpenseModalOpen} onClose={() => setIsExpenseModalOpen(false)} onSave={handleSaveExpenseRecord} record={selectedRecord} />
            <ConfirmationModal isOpen={isConfirmModalOpen} onCancel={() => setIsConfirmModalOpen(false)} onConfirm={confirmDelete} title="Delete Expense" message="Are you sure you want to delete this record? This action cannot be undone." />
        </div>
    );
};

export default Finance;