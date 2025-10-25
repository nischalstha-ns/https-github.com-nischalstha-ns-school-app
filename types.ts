// Fix: Create type definitions for the application
export enum View {
    Dashboard = 'Dashboard',
    Teachers = 'Teachers',
    Students = 'Students',
    Attendance = 'Attendance',
    Finance = 'Finance',
    Result = 'Result',
    Notice = 'Notice',
    Calendar = 'Calendar',
    Library = 'Library',
    Message = 'Message',
    LessonPlan = 'LessonPlan',
    Profile = 'Profile',
    Setting = 'Setting',
    AccountManagement = 'AccountManagement',
}

export interface AgendaItem {
    id: string;
    time: string;
    title: string;
    subtitle: string;
    color: string;
}

export interface Message {
    id: string;
    avatar: string;
    sender: string;
    time: string;
    text: string;
    unread?: number;
}

export interface EarningsDataPoint {
    month: string;
    income: number;
    expense: number;
}

export interface StudentActivityItem {
    id: string;
    icon: 'trophy' | 'debate' | 'science';
    title: string;
    description: string;
    time: string;
}

export interface NoticeBoardItem {
    id: string;
    image: string;
    title: string;
    author: string;
    date: string;
    views: string;
}

export interface RecentActivityItem {
    id: string;
    avatar: string;
    user: string;
    action: string;
    subject: string;
    time: string;
}

export interface Student {
    id: string;
    studentId: string;
    rollNo: number;
    name: string;
    avatar: string;
    class: number;
    section: 'A' | 'B' | 'C';
    gender: 'Male' | 'Female' | 'Other';
    dob: string;
    address: string;
    parentName: string;
    contact: string;
    admissionDate: string;
    status: 'Active' | 'Graduated' | 'Suspended';
    email: string;
    attendance: number;
}


export interface Teacher {
    id: string;
    teacherId: string;
    name: string;
    avatar: string;
    email: string;
    phone: string;
    department: string;
    assignedClasses: string[];
    joiningDate: string;
    status: 'Active' | 'On Leave' | 'Retired';
    yearsOfExperience: number;
}

export interface Announcement {
    id: string;
    title: string;
    content: string;
    date: string;
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Leave' | 'Holiday' | 'Future';

export interface AttendanceData {
    studentId: string; // Changed from number to string to match Student['id']
    date: string; // YYYY-MM-DD format
    status: AttendanceStatus;
}

export interface FeeCollection {
    id: string;
    studentName: string;
    studentId: string;
    avatar: string;
    class: string;
    tuitionFee: number;
    activitiesFee: number;
    miscellaneousFee: number;
    totalAmount: number;
    status: 'Paid' | 'Pending' | 'Overdue';
    date: string; // YYYY-MM-DD format for filtering
}

export interface Expense {
    id: string;
    description: string;
    category: 'Salaries' | 'Utilities' | 'Supplies' | 'Maintenance' | 'Other';
    date: string; // YYYY-MM-DD
    amount: number;
    status: 'Paid' | 'Pending';
    receiptUrl?: string;
}

export interface FeeChartDataPoint {
    month: string;
    amount: number;
}

export enum UserRole {
    Admin = 'Admin',
    Student = 'Student',
    Parent = 'Parent',
    Teacher = 'Teacher',
    Staff = 'Staff',
    Finance = 'Finance',
    Other = 'Other',
}

export interface UserAccount {
    id: string;
    fullName: string;
    email: string;
    role: UserRole;
    status: 'Active' | 'Inactive';
    avatar?: string;
    password?: string; // Only for creation/update, not stored long-term
    context?: string; // e.g., "Class 10 A" for students, "Mathematics" for teachers
    searchableName?: string; // For case-insensitive search
}

export interface CalendarEvent {
    id: string;
    date: string; // YYYY-MM-DD
    title: string;
    description: string;
    type: 'event' | 'holiday' | 'exam';
}

export interface Book {
    id: string;
    title: string;
    author: string;
    isbn: string;
    genre: string;
    status: 'Available' | 'Issued';
    issuedTo?: string; // Student ID
    dueDate?: string; // YYYY-MM-DD
}

export interface Conversation {
    id: string;
    participant: {
        name: string;
        avatar: string;
    };
    lastMessage: string;
    timestamp: string;
    unreadCount: number;
    messages: {
        id: string;
        text: string;
        sender: 'me' | 'other';
        timestamp: string;
    }[];
}

export interface SubjectResult {
    name: string;
    theoryMax: number;
    practicalMax: number;
    theoryObtained: number;
    practicalObtained: number;
}

export interface Result {
    id: string;
    studentId: string;
    studentName: string;
    class: number;
    section: 'A' | 'B' | 'C';
    examType: 'Unit Test' | 'Mid-term' | 'Final';
    date: string; // YYYY-MM-DD
    subjects: SubjectResult[];
    totalMarksObtained: number;
    totalPossibleMarks: number;
    percentage: number;
    grade: string;
    status: 'Passed' | 'Failed';
    remarks?: string;
}


export interface BulkGenerateAccountsResult {
    studentsCreated: number;
    teachersCreated: number;
    staffCreated: number;
    totalCreated: number;
}