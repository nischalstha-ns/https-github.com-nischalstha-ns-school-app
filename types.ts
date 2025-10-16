// Fix: Create type definitions for the application
export enum View {
    Dashboard = 'Dashboard',
    Teachers = 'Teachers',
    Students = 'Students',
    Attendance = 'Attendance',
    Finance = 'Finance',
    Notice = 'Notice',
    Calendar = 'Calendar',
    Library = 'Library',
    Message = 'Message',
    Profile = 'Profile',
    Setting = 'Setting',
    Logout = 'Logout',
}

export interface AgendaItem {
    id: number;
    time: string;
    title: string;
    subtitle: string;
    color: string;
}

export interface Message {
    id: number;
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
    id: number;
    icon: 'trophy' | 'debate' | 'science';
    title: string;
    description: string;
    time: string;
}

export interface NoticeBoardItem {
    id: number;
    image: string;
    title: string;
    author: string;
    date: string;
    views: string;
}

export interface RecentActivityItem {
    id: number;
    avatar: string;
    user: string;
    action: string;
    subject: string;
    time: string;
}

export interface Student {
    id: number;
    studentId: string;
    rollNo: number;
    name: string;
    avatar: string;
    class: number;
    section: 'A' | 'B' | 'C';
    gender: 'Male' | 'Female' | 'Other';
    parentName: string;
    contact: string;
    admissionDate: string;
    status: 'Active' | 'Graduated' | 'Suspended';
    email: string;
    attendance: number;
}


export interface Teacher {
    id: number;
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
    id: number;
    title: string;
    content: string;
    date: string;
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Leave' | 'Holiday' | 'Future';

export interface AttendanceData {
    studentId: number;
    date: string; // YYYY-MM-DD format
    status: AttendanceStatus;
}