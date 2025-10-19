import React, { useState } from 'react';
import { AGENDA, MESSAGES, EARNINGS_DATA, STUDENT_ACTIVITIES, RECENT_ACTIVITIES } from '../constants';
import { AwardIcon, BriefcaseIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, CompetitionIcon, MoreHorizontalIcon, OlympicIcon, ScienceIcon, TeachersIcon, TrophyIcon, UsersIcon, DebateIcon } from './icons';
import { AgendaItem, Message, EarningsDataPoint, StudentActivityItem, NoticeBoardItem, RecentActivityItem, UserRole } from '../types';
import { useAppContext } from '../state/AppContext';

const StatCard: React.FC<{ title: string; value: string; percentage: number; icon: React.ReactNode; color: string; }> = ({ title, value, percentage, icon, color }) => {
    const isPositive = percentage >= 0;
    return (
        <div className={`p-4 rounded-lg flex justify-between items-start text-brand-text-dark ${color}`}>
            <div>
                <p className="font-bold text-2xl">{value}</p>
                <p className="text-sm">{title}</p>
            </div>
            <div className="flex flex-col items-end">
                <button className="text-gray-400">
                    <MoreHorizontalIcon className="w-5 h-5" />
                </button>
                <div className={`mt-2 flex items-center text-xs px-2 py-1 rounded-full ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {isPositive ? '↑' : '↓'} {Math.abs(percentage)}%
                </div>
            </div>
        </div>
    );
};

const DonutChart: React.FC<{ percentage: number; color: string; bgColor: string }> = ({ percentage, color, bgColor }) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <svg width="120" height="120" viewBox="0 0 120 120" className="-rotate-90">
            <circle cx="60" cy="60" r={radius} strokeWidth="15" className={bgColor} fill="transparent" />
            <circle
                cx="60"
                cy="60"
                r={radius}
                strokeWidth="15"
                className={color}
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
            />
        </svg>
    );
};

const StudentsDistribution = () => {
    const { students } = useAppContext();
    const boys = students.filter(s => s.gender === 'Male').length;
    const girls = students.filter(s => s.gender === 'Female').length;
    const totalStudents = students.length;
    const boyPercentage = totalStudents > 0 ? Math.round((boys / totalStudents) * 100) : 0;
    
    return (
        <div className="bg-white p-6 rounded-lg h-full">
            <div className="flex justify-between items-center">
                <h2 className="font-bold text-lg">Students</h2>
                <button className="text-gray-400">
                    <MoreHorizontalIcon className="w-5 h-5" />
                </button>
            </div>
            <div className="flex justify-center items-center my-4 relative">
                <DonutChart percentage={boyPercentage} color="stroke-primary" bgColor="stroke-yellow-300" />
                <div className="absolute flex items-center justify-center bg-white rounded-full w-16 h-16">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fec240" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4a9cff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                </div>
            </div>
            <div className="flex justify-around text-center">
                <div>
                    <p className="font-bold text-lg">{boys.toLocaleString()}</p>
                    <p className="text-sm text-neutral-500 flex items-center">
                        <span className="w-2 h-2 rounded-full bg-primary mr-2"></span>
                        Boys ({boyPercentage}%)
                    </p>
                </div>
                <div>
                    <p className="font-bold text-lg">{girls.toLocaleString()}</p>
                    <p className="text-sm text-neutral-500 flex items-center">
                        <span className="w-2 h-2 rounded-full bg-yellow-300 mr-2"></span>
                        Girls ({100 - boyPercentage}%)
                    </p>
                </div>
            </div>
        </div>
    );
};

const AttendanceChart = () => {
    const data = [{ p: 70, a: 60 }, { p: 80, a: 70 }, { p: 95, a: 75 }, { p: 75, a: 65 }, { p: 78, a: 70 }];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

    return (
        <div className="bg-white p-6 rounded-lg h-full">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <h2 className="font-bold text-lg">Attendance</h2>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                     <div className="text-sm text-neutral-500 flex items-center">
                        <span className="w-2 h-2 rounded-full bg-yellow-300 mr-2"></span>Total Present
                    </div>
                     <div className="text-sm text-neutral-500 flex items-center">
                        <span className="w-2 h-2 rounded-full bg-blue-300 mr-2"></span>Total Absent
                    </div>
                    <button className="text-sm text-neutral-500 bg-gray-100 px-3 py-1 rounded-md flex items-center">
                        Weekly <ChevronDownIcon className="w-4 h-4 ml-1" />
                    </button>
                    <button className="text-sm text-neutral-500 bg-gray-100 px-3 py-1 rounded-md flex items-center">
                        Grade 3 <ChevronDownIcon className="w-4 h-4 ml-1" />
                    </button>
                </div>
            </div>
            <div className="mt-4 h-48 flex justify-between items-end space-x-2 sm:space-x-4 relative">
                {data.map((day, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center h-full justify-end group">
                        {index === 2 && (
                            <div className="absolute top-1/2 -translate-y-1/2 bg-white p-2 rounded-md shadow-lg text-xs text-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <strong>95%</strong><br/>Present
                            </div>
                        )}
                        <div className="flex items-end space-x-1 h-full">
                           <div className="w-3 sm:w-4 bg-yellow-300 rounded-t-md" style={{ height: `${day.p}%` }}></div>
                           <div className="w-3 sm:w-4 bg-blue-300 rounded-t-md" style={{ height: `${day.a}%` }}></div>
                        </div>
                        <p className="text-xs text-neutral-500 mt-2">{days[index]}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const EarningsChart = () => {
    const data = EARNINGS_DATA;
    const width = 500;
    const height = 200;
    const padding = 30;
    const [tooltip, setTooltip] = useState<{ x: number; y: number; data: EarningsDataPoint } | null>(null);

    const maxY = Math.max(...data.map(d => d.income), ...data.map(d => d.expense)) * 1.1;
    const xStep = (width - padding * 2) / (data.length - 1);

    const toPath = (points: {x: number, y: number}[]) => {
        return points.reduce((acc, point, i) => {
            if (i === 0) return `M ${point.x},${point.y}`;
            const cp1 = { x: points[i-1].x + xStep / 2, y: points[i-1].y };
            const cp2 = { x: point.x - xStep / 2, y: point.y };
            return `${acc} C ${cp1.x},${cp1.y} ${cp2.x},${cp2.y} ${point.x},${point.y}`;
        }, "");
    };

    const incomePoints = data.map((d, i) => ({ x: padding + i * xStep, y: height - padding - (d.income / maxY * (height - padding * 2)) }));
    const expensePoints = data.map((d, i) => ({ x: padding + i * xStep, y: height - padding - (d.expense / maxY * (height - padding * 2)) }));

    const incomePath = toPath(incomePoints);
    const expensePath = toPath(expensePoints);

    const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
        const svgRect = e.currentTarget.getBoundingClientRect();
        const mouseX = e.clientX - svgRect.left;
        const index = Math.round(((mouseX / svgRect.width * width) - padding) / xStep);

        if (index >= 0 && index < data.length) {
            const pointData = data[index];
            const tooltipX = (padding + index * xStep) * (svgRect.width / width);
            setTooltip({ x: tooltipX, y: height - padding - (pointData.income / maxY * (height - padding * 2)), data: pointData });
        }
    };
    
    return (
        <div className="bg-white p-6 rounded-lg">
            <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
                <h2 className="font-bold text-lg">Earnings</h2>
                <div className="flex items-center space-x-4">
                    <div className="text-sm text-neutral-500 flex items-center"><span className="w-2 h-2 rounded-full bg-cyan-400 mr-2"></span>Income</div>
                    <div className="text-sm text-neutral-500 flex items-center"><span className="w-2 h-2 rounded-full bg-purple-400 mr-2"></span>Expense</div>
                    <button className="text-gray-400"><MoreHorizontalIcon className="w-5 h-5" /></button>
                </div>
            </div>
            <div className="relative w-full h-auto">
                <svg viewBox={`0 0 ${width} ${height}`} onMouseMove={handleMouseMove} onMouseLeave={() => setTooltip(null)} className="w-full h-auto">
                    {/* Y-axis labels */}
                    {[0, 250, 500, 750, 1000].map(val => (
                        <g key={val}>
                            <text x={padding - 10} y={height - padding - (val / 1000 * (height - padding * 2))} textAnchor="end" fontSize="10" fill="#a098ae">{val}K</text>
                            <line x1={padding} y1={height - padding - (val / 1000 * (height - padding * 2))} x2={width - padding} y2={height - padding - (val / 1000 * (height - padding * 2))} stroke="#e9e9e9" strokeDasharray="2 2" />
                        </g>
                    ))}
                    {/* X-axis labels */}
                    {data.map((d, i) => (
                        <text key={d.month} x={padding + i * xStep} y={height - padding + 15} textAnchor="middle" fontSize="10" fill="#a098ae">{d.month}</text>
                    ))}
                    <path d={incomePath} fill="none" stroke="#22d3ee" strokeWidth="2" />
                    <path d={expensePath} fill="none" stroke="#c084fc" strokeWidth="2" />
                    
                    {tooltip && (
                        <g transform={`scale(${width / (document.querySelector('.relative.w-full.h-auto')?.clientWidth || width)})`}>
                            <line x1={tooltip.x} y1={padding} x2={tooltip.x} y2={height - padding} stroke="#6C64F0" strokeWidth="1" />
                            <circle cx={tooltip.x} cy={height - padding - (tooltip.data.income / maxY * (height - padding * 2))} r="4" fill="#22d3ee" stroke="white" strokeWidth="2" />
                            <circle cx={tooltip.x} cy={height - padding - (tooltip.data.expense / maxY * (height - padding * 2))} r="4" fill="#c084fc" stroke="white" strokeWidth="2" />
                        </g>
                    )}
                </svg>
                 {tooltip && (
                    <div className="absolute bg-white p-2 rounded-md shadow-lg text-xs" style={{ left: `${tooltip.x + 10}px`, top: `10px`, pointerEvents: 'none' }}>
                        <p className="font-bold">Sep 14, 2030</p>
                        <p className="flex items-center"><span className="w-2 h-2 rounded-full bg-cyan-400 mr-2"></span>${tooltip.data.income.toLocaleString()}.000</p>
                        <p className="flex items-center"><span className="w-2 h-2 rounded-full bg-purple-400 mr-2"></span>${tooltip.data.expense.toLocaleString()}.000</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const StudentActivityWidget = () => {
    const icons = {
        trophy: <TrophyIcon className="w-6 h-6 text-yellow-500" />,
        debate: <DebateIcon className="w-6 h-6 text-blue-500" />,
        science: <ScienceIcon className="w-6 h-6 text-green-500" />,
    }
    return (
        <div className="bg-white p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg">Student Activity</h2>
                <button className="text-sm text-primary font-semibold">View All</button>
            </div>
            <div className="space-y-4">
                {STUDENT_ACTIVITIES.map((item: StudentActivityItem) => (
                    <div key={item.id} className="flex items-start space-x-4">
                        <div className="bg-gray-100 p-3 rounded-lg">{icons[item.icon]}</div>
                        <div>
                            <p className="font-semibold">{item.title}</p>
                            <p className="text-sm text-neutral-500">{item.description}</p>
                            <p className="text-xs text-neutral-500 mt-1">{item.time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const NoticeBoardWidget = () => {
    const { announcements } = useAppContext();
    const noticeBoardItems = announcements.slice(0, 3).map(ann => ({
        id: ann.id,
        image: `https://picsum.photos/seed/${ann.id}/200`,
        title: ann.title,
        author: 'Admin',
        date: new Date(ann.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        views: `${(Math.random() * 2 + 0.5).toFixed(1)}k`
    }));

    return (
    <div className="bg-white p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg">Notice Board</h2>
            <button className="text-gray-400"><MoreHorizontalIcon className="w-5 h-5" /></button>
        </div>
        <div className="space-y-3">
            {noticeBoardItems.map((item: NoticeBoardItem) => (
                <div key={item.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg">
                    <img src={item.image} alt={item.title} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1">
                        <p className="font-semibold text-sm">{item.title}</p>
                        <p className="text-xs text-neutral-500">{item.author}</p>
                    </div>
                    <p className="text-xs text-neutral-500">{item.date}</p>
                    <p className="text-sm font-semibold text-neutral-500 w-10 text-right">{item.views}</p>
                </div>
            ))}
        </div>
    </div>
    );
};


const CalendarWidget = () => (
    <div className="bg-white p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
            <button className="p-1 rounded-full hover:bg-gray-100"><ChevronLeftIcon className="w-5 h-5" /></button>
            <h3 className="font-bold">September 2030</h3>
            <button className="p-1 rounded-full hover:bg-gray-100"><ChevronRightIcon className="w-5 h-5" /></button>
        </div>
        <div className="grid grid-cols-7 text-center text-xs sm:text-sm text-neutral-500">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day} className="py-2">{day}</div>)}
            {['', '', '', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30].map((day, i) => {
                const isToday = day === 22;
                return (
                    <div key={i} className={`py-2 ${isToday ? 'bg-primary text-white rounded-lg' : 'hover:bg-gray-100 rounded-lg cursor-pointer'}`}>
                        {day}
                    </div>
                );
            })}
        </div>
    </div>
);

const AgendaWidget = () => (
    <div className="bg-white p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg">Agenda</h2>
             <button className="text-gray-400">
                <MoreHorizontalIcon className="w-5 h-5" />
            </button>
        </div>
        <div className="space-y-3">
            {AGENDA.map((item: AgendaItem) => (
                <div key={item.id} className={`${item.color} p-3 rounded-lg flex items-center`}>
                    <p className="text-sm font-semibold text-neutral-500 mr-4">{item.time}</p>
                    <div className="border-l-2 border-gray-300 pl-4">
                        <p className="text-sm text-neutral-500">{item.title}</p>
                        <p className="font-semibold text-neutral-800">{item.subtitle}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const MessagesWidget = () => (
    <div className="bg-white p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg">Messages</h2>
            <button className="text-sm text-primary font-semibold">View All</button>
        </div>
        <div className="space-y-4">
            {MESSAGES.map((msg: Message) => (
                <div key={msg.id} className="flex items-start space-x-3">
                    <img src={msg.avatar} alt={msg.sender} className="w-10 h-10 rounded-full" />
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                            <p className="font-semibold text-sm truncate">{msg.sender}</p>
                            <p className="text-xs text-neutral-500 flex-shrink-0">{msg.time}</p>
                        </div>
                        <p className="text-sm text-neutral-500 truncate">{msg.text}</p>
                    </div>
                    {msg.unread && (
                        <span className="bg-primary text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">{msg.unread}</span>
                    )}
                </div>
            ))}
        </div>
    </div>
);

const RecentActivityWidget = () => (
    <div className="bg-white p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg">Recent Activity</h2>
            <button className="text-sm text-primary font-semibold">View All</button>
        </div>
        <div className="space-y-4">
            {RECENT_ACTIVITIES.map((item: RecentActivityItem) => (
                <div key={item.id} className="flex items-start space-x-3">
                    <img src={item.avatar} alt={item.user} className="w-10 h-10 rounded-full" />
                    <div>
                        <p className="text-sm">
                            <span className="font-semibold">{item.user}</span> {item.action} <span className="font-semibold">{item.subject}</span>
                        </p>
                        <p className="text-xs text-neutral-500">{item.time}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const Dashboard: React.FC = () => {
    const { students, teachers, users, isLoading } = useAppContext();

    if (isLoading) {
        return <div className="text-center p-8">Loading dashboard data...</div>;
    }

    const staffCount = users.filter(u => u.role === UserRole.Staff || u.role === UserRole.Admin || u.role === UserRole.Finance).length;

    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
            {/* Main Content */}
            <div className="xl:col-span-2 space-y-6 lg:space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="Students" value={students.length.toLocaleString()} percentage={15} icon={<UsersIcon className="w-6 h-6" />} color="bg-blue-100" />
                    <StatCard title="Teachers" value={teachers.length.toLocaleString()} percentage={-3} icon={<TeachersIcon className="w-6 h-6" />} color="bg-yellow-100" />
                    <StatCard title="Staffs" value={staffCount.toLocaleString()} percentage={-3} icon={<BriefcaseIcon className="w-6 h-6" />} color="bg-purple-100" />
                    <StatCard title="Awards" value="95,800" percentage={5} icon={<AwardIcon className="w-6 h-6" />} color="bg-green-100" />
                </div>
                 <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
                    <div className="lg:col-span-2">
                        <StudentsDistribution />
                    </div>
                    <div className="lg:col-span-3">
                        <AttendanceChart />
                    </div>
                </div>
                
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                    <div className="lg:col-span-2">
                        <EarningsChart />
                    </div>
                    <div className="space-y-6">
                        <div className="bg-white p-4 rounded-lg flex items-center space-x-4">
                            <div className="bg-blue-100 p-3 rounded-lg"><OlympicIcon className="w-6 h-6 text-primary" /></div>
                            <div>
                                <p className="font-bold text-xl">24,680</p>
                                <p className="text-sm text-neutral-500">Olympic Students</p>
                                <p className="text-xs text-green-600 font-semibold mt-1">▲ 15%</p>
                            </div>
                        </div>
                         <div className="bg-white p-4 rounded-lg flex items-center space-x-4">
                            <div className="bg-yellow-100 p-3 rounded-lg"><CompetitionIcon className="w-6 h-6 text-yellow-500" /></div>
                            <div>
                                <p className="font-bold text-xl">3,000</p>
                                <p className="text-sm text-neutral-500">Competition</p>
                                <p className="text-xs text-red-600 font-semibold mt-1">▼ 6%</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    <StudentActivityWidget />
                    <NoticeBoardWidget />
                </div>
            </div>

            {/* Right Sidebar Content */}
            <div className="space-y-6 lg:space-y-8">
                <CalendarWidget />
                <AgendaWidget />
                <MessagesWidget />
                <RecentActivityWidget />
            </div>
        </div>
    );
};

export default Dashboard;