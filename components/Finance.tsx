import React, { useState, useMemo } from 'react';
import { FEE_COLLECTION_DATA, FEES_CHART_DATA } from '../constants';
import { FeeCollection } from '../types';
import { SearchIcon, ChevronDownIcon, EditIcon, ChevronRightIcon, ChevronLeftIcon, TrendingUpIcon, FileTextIcon } from './icons';

const FinanceStatCard: React.FC<{ title: string; value: string; percentage: number; }> = ({ title, value, percentage }) => {
    const isPositive = percentage >= 0;
    return (
        <div className="bg-sky-50 border border-sky-100 p-4 rounded-xl flex flex-col justify-between h-full">
            <div className="flex justify-between items-center">
                <TrendingUpIcon className="w-8 h-8 text-sky-300" />
                <div className={`flex items-center text-xs px-2 py-1 rounded-full ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {isPositive ? '↑' : '↓'} {Math.abs(percentage)}%
                </div>
            </div>
            <div>
                <p className="font-bold text-2xl text-slate-800">{value}</p>
                <p className="text-sm text-slate-500">{title}</p>
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
                        <stop offset="0%" stopColor="#FEF3C7" stopOpacity={0.8}/>
                        <stop offset="100%" stopColor="#FEF3C7" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                {/* Y-axis grid lines and labels */}
                {[0, 1000, 2500, 5000, 7500].map(val => (
                    <g key={val}>
                         <text x={padding - 8} y={height - padding - (val / maxY * (height - padding * 2))} textAnchor="end" fontSize="10" fill="#A098AE">{val === 0 ? '0' : `${val/1000}k`}</text>
                    </g>
                ))}
                {/* X-axis labels */}
                {data.map((d, i) => (
                    <text key={d.month} x={padding + i * xStep} y={height - padding + 15} textAnchor="middle" fontSize="10" fill="#A098AE">{d.month}</text>
                ))}
                
                <path d={areaPath} fill="url(#areaGradient)" />
                <path d={linePath} fill="none" stroke="#FBBF24" strokeWidth="2" />

                {/* Highlighted point */}
                <line x1={highlightedPoint.x} y1={highlightedPoint.y} x2={highlightedPoint.x} y2={height - padding} stroke="#FBBF24" strokeWidth="1" strokeDasharray="3 3"/>
                <circle cx={highlightedPoint.x} cy={highlightedPoint.y} r="5" fill="#FBBF24" stroke="white" strokeWidth="2" />
            </svg>
             <div className="absolute bg-white p-2 rounded-md shadow-lg text-xs text-center border" style={{ left: `${(highlightedPoint.x / width * 100)}%`, top: `${(highlightedPoint.y / height * 100) - 25}%`, transform: 'translateX(-50%)', pointerEvents: 'none' }}>
                <p className="font-bold text-slate-800">$152,927</p>
                <p className="text-slate-500">Aug 19, 2030</p>
            </div>
        </div>
    );
};

const Finance: React.FC = () => {
    const [fees, setFees] = useState<FeeCollection[]>(FEE_COLLECTION_DATA);
    const [selectedRow, setSelectedRow] = useState<number | null>(2);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const paginatedFees = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return fees.slice(startIndex, startIndex + itemsPerPage);
    }, [fees, currentPage]);

    const totalPages = Math.ceil(fees.length / itemsPerPage);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);
    }
    
    const getStatusPill = (status: FeeCollection['status']) => {
        const baseClasses = "flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full";
        switch (status) {
            case 'Paid': return <span className={`${baseClasses} bg-sky-100 text-sky-700`}><span className="w-2 h-2 rounded-full bg-sky-500"></span>Paid</span>;
            case 'Pending': return <span className={`${baseClasses} bg-yellow-100 text-yellow-700`}><span className="w-2 h-2 rounded-full bg-yellow-500"></span>Pending</span>;
            case 'Overdue': return <span className={`${baseClasses} bg-red-100 text-red-700`}><span className="w-2 h-2 rounded-full bg-red-500"></span>Overdue</span>;
            default: return null;
        }
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 bg-white p-4 rounded-xl shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-800 mb-2">Fees Collection</h2>
                    <FeesLineChart />
                </div>
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <FinanceStatCard title="Total Amount" value="$126,450" percentage={15} />
                    <FinanceStatCard title="Total Tuition" value="$67,200" percentage={10} />
                    <FinanceStatCard title="Total Activities" value="$8,000" percentage={0} />
                    <FinanceStatCard title="Total Miscellaneous" value="$6,150" percentage={0} />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                 <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
                    <h2 className="text-lg font-semibold text-slate-800">Fees Collection</h2>
                     <div className="flex items-center gap-2 flex-wrap">
                        <div className="relative">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
                            <input type="text" placeholder="Search by Name or ID" className="pl-9 pr-3 py-2 w-full sm:w-40 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue"/>
                        </div>
                        <select className="px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-1 focus:ring-brand-blue"><option>Today</option></select>
                        <select className="px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-1 focus:ring-brand-blue"><option>All Classes</option></select>
                        <select className="px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-1 focus:ring-brand-blue"><option>All Status</option></select>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-slate-500">
                            <tr className="border-b border-slate-200">
                                <th className="p-3 w-4"><input type="checkbox" className="rounded border-slate-300 text-brand-purple focus:ring-brand-purple"/></th>
                                <th className="p-3 font-medium">Student Name</th>
                                <th className="p-3 font-medium">Class</th>
                                <th className="p-3 font-medium">Tuition Fee</th>
                                <th className="p-3 font-medium">Activities Fee</th>
                                <th className="p-3 font-medium">Miscellaneous</th>
                                <th className="p-3 font-medium">Amount</th>
                                <th className="p-3 font-medium">Status</th>
                                <th className="p-3 font-medium text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-700">
                            {paginatedFees.map(fee => (
                                <tr key={fee.id} onClick={() => setSelectedRow(fee.id)} className={`border-b border-slate-100 cursor-pointer ${selectedRow === fee.id ? 'bg-brand-purple-light' : 'hover:bg-slate-50'}`}>
                                    <td className="p-3"><input type="checkbox" checked={selectedRow === fee.id} readOnly className="rounded border-slate-300 text-brand-purple focus:ring-brand-purple"/></td>
                                    <td className="p-3 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <img src={fee.avatar} alt={fee.studentName} className="w-9 h-9 rounded-full"/>
                                            <div>
                                                <p className="font-semibold text-slate-800">{fee.studentName}</p>
                                                <p className="text-xs text-slate-500">{fee.studentId}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-3">{fee.class}</td>
                                    <td className="p-3">{formatCurrency(fee.tuitionFee)}</td>
                                    <td className="p-3">{formatCurrency(fee.activitiesFee)}</td>
                                    <td className="p-3">{formatCurrency(fee.miscellaneousFee)}</td>
                                    <td className="p-3 font-semibold">{formatCurrency(fee.totalAmount)}</td>
                                    <td className="p-3">{getStatusPill(fee.status)}</td>
                                    <td className="p-3">
                                        <div className="flex items-center justify-center gap-3">
                                            <button className="text-slate-400 hover:text-brand-purple"><EditIcon className="w-5 h-5"/></button>
                                            <button className="text-slate-400 hover:text-brand-purple"><FileTextIcon className="w-5 h-5"/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                 <div className="flex justify-between items-center pt-4">
                    <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 border border-slate-300 rounded-md text-sm font-medium disabled:opacity-50 flex items-center gap-2"><ChevronLeftIcon className="w-4 h-4"/> Previous</button>
                    <span className="text-sm text-slate-500">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1 border border-slate-300 rounded-md text-sm font-medium disabled:opacity-50 flex items-center gap-2">Next <ChevronRightIcon className="w-4 h-4"/></button>
                </div>
            </div>
        </div>
    );
};

export default Finance;
