// Fix: Provide mock data for the application
import { AgendaItem, Message, EarningsDataPoint, StudentActivityItem, NoticeBoardItem, RecentActivityItem, Student, Teacher, Announcement, AttendanceData, FeeCollection, FeeChartDataPoint } from './types';

export const AGENDA: AgendaItem[] = [
  { id: 1, time: '08:00', title: 'Mathematics', subtitle: 'Room 201, Mrs. Davis', color: 'bg-orange-100' },
  { id: 2, time: '09:30', title: 'Science Lab', subtitle: 'Lab A, Mr. Brown', color: 'bg-blue-100' },
  { id: 3, time: '11:00', title: 'English Literature', subtitle: 'Room 105, Ms. Smith', color: 'bg-green-100' },
];

export const MESSAGES: Message[] = [
  { id: 1, avatar: 'https://i.pravatar.cc/150?img=1', sender: 'John Doe', time: '10:30 AM', text: 'Hi, can we reschedule our meeting?', unread: 2 },
  { id: 2, avatar: 'https://i.pravatar.cc/150?img=2', sender: 'Jane Smith', time: 'Yesterday', text: 'Please review the attached documents.' },
  { id: 3, avatar: 'https://i.pravatar.cc/150?img=3', sender: 'Robert Brown', time: '2 days ago', text: 'Thank you for your help!' },
];

export const EARNINGS_DATA: EarningsDataPoint[] = [
    { month: 'Jan', income: 600, expense: 400 },
    { month: 'Feb', income: 750, expense: 500 },
    { month: 'Mar', income: 800, expense: 650 },
    { month: 'Apr', income: 700, expense: 600 },
    { month: 'May', income: 900, expense: 700 },
    { month: 'Jun', income: 950, expense: 650 },
];

export const STUDENT_ACTIVITIES: StudentActivityItem[] = [
    { id: 1, icon: 'trophy', title: 'Sports Day Victory', description: 'Won the inter-school football championship.', time: '2 hours ago' },
    { id: 2, icon: 'debate', title: 'Debate Club', description: 'Final round of the annual debate competition.', time: 'Yesterday' },
    { id: 3, icon: 'science', title: 'Science Fair', description: 'Project "Volcano Model" won first prize.', time: '3 days ago' },
];

export const NOTICE_BOARD_ITEMS: NoticeBoardItem[] = [
    { id: 1, image: 'https://picsum.photos/seed/nb1/200', title: 'Annual Sports Day', author: 'Mr. John', date: 'Sep 20', views: '1.2k' },
    { id: 2, image: 'https://picsum.photos/seed/nb2/200', title: 'Parent-Teacher Meeting', author: 'Admin', date: 'Sep 18', views: '2.5k' },
    { id: 3, image: 'https://picsum.photos/seed/nb3/200', title: 'Science Exhibition', author: 'Mrs. Adora', date: 'Sep 15', views: '980' },
];

export const RECENT_ACTIVITIES: RecentActivityItem[] = [
    { id: 1, avatar: 'https://i.pravatar.cc/150?img=4', user: 'Linda Adora', action: 'added a new document to', subject: 'Science project', time: '5 mins ago' },
    { id: 2, avatar: 'https://i.pravatar.cc/150?img=6', user: 'John Doe', action: 'submitted an assignment for', subject: 'Mathematics', time: '1 hour ago' },
    { id: 3, avatar: 'https://i.pravatar.cc/150?img=7', user: 'Jane Smith', action: 'updated her profile picture', subject: '', time: '3 hours ago' },
];

export const STUDENTS: Student[] = [
    { id: 1, studentId: 'S-001', rollNo: 1, name: 'Alice Johnson', avatar: 'https://i.pravatar.cc/150?img=11', class: 10, section: 'A', gender: 'Female', parentName: 'John Johnson', contact: '123-456-7890', admissionDate: '2022-08-15', status: 'Active', email: 'alice.j@school.com', attendance: 95 },
    { id: 2, studentId: 'S-002', rollNo: 2, name: 'Bob Williams', avatar: 'https://i.pravatar.cc/150?img=12', class: 10, section: 'A', gender: 'Male', parentName: 'David Williams', contact: '123-456-7891', admissionDate: '2022-08-15', status: 'Active', email: 'bob.w@school.com', attendance: 88 },
    { id: 3, studentId: 'S-003', rollNo: 1, name: 'Charlie Brown', avatar: 'https://i.pravatar.cc/150?img=13', class: 9, section: 'B', gender: 'Male', parentName: 'James Brown', contact: '123-456-7892', admissionDate: '2021-08-20', status: 'Active', email: 'charlie.b@school.com', attendance: 92 },
    { id: 4, studentId: 'S-004', rollNo: 3, name: 'Diana Miller', avatar: 'https://i.pravatar.cc/150?img=14', class: 10, section: 'A', gender: 'Female', parentName: 'Robert Miller', contact: '123-456-7893', admissionDate: '2022-08-16', status: 'Suspended', email: 'diana.m@school.com', attendance: 98 },
    { id: 5, studentId: 'S-005', rollNo: 2, name: 'Ethan Davis', avatar: 'https://i.pravatar.cc/150?img=15', class: 9, section: 'B', gender: 'Male', parentName: 'Michael Davis', contact: '123-456-7894', admissionDate: '2021-08-21', status: 'Active', email: 'ethan.d@school.com', attendance: 85 },
    { id: 6, studentId: 'S-006', rollNo: 1, name: 'Fiona Garcia', avatar: 'https://i.pravatar.cc/150?img=16', class: 12, section: 'C', gender: 'Female', parentName: 'William Garcia', contact: '123-456-7895', admissionDate: '2020-09-01', status: 'Graduated', email: 'fiona.g@school.com', attendance: 99 },
    { id: 7, studentId: 'S-007', rollNo: 4, name: 'George Wilson', avatar: 'https://i.pravatar.cc/150?img=17', class: 10, section: 'A', gender: 'Male', parentName: 'Richard Wilson', contact: '123-456-7896', admissionDate: '2022-08-17', status: 'Active', email: 'george.w@school.com', attendance: 91 },
    { id: 8, studentId: 'S-008', rollNo: 3, name: 'Hannah Martinez', avatar: 'https://i.pravatar.cc/150?img=18', class: 9, section: 'B', gender: 'Female', parentName: 'Joseph Martinez', contact: '123-456-7897', admissionDate: '2021-08-22', status: 'Active', email: 'hannah.m@school.com', attendance: 78 },
    { id: 9, studentId: 'S-009', rollNo: 1, name: 'Ian Anderson', avatar: 'https://i.pravatar.cc/150?img=19', class: 11, section: 'A', gender: 'Male', parentName: 'Thomas Anderson', contact: '123-456-7898', admissionDate: '2021-09-05', status: 'Active', email: 'ian.a@school.com', attendance: 93 },
    { id: 10, studentId: 'S-010', rollNo: 2, name: 'Jessica Thomas', avatar: 'https://i.pravatar.cc/150?img=20', class: 11, section: 'A', gender: 'Female', parentName: 'Charles Thomas', contact: '123-456-7899', admissionDate: '2021-09-06', status: 'Active', email: 'jessica.t@school.com', attendance: 96 },
    { id: 11, studentId: 'S-011', rollNo: 5, name: 'Kevin White', avatar: 'https://i.pravatar.cc/150?img=25', class: 10, section: 'B', gender: 'Male', parentName: 'Daniel White', contact: '123-456-8900', admissionDate: '2022-08-18', status: 'Active', email: 'kevin.w@school.com', attendance: 89 },
    { id: 12, studentId: 'S-012', rollNo: 6, name: 'Laura Harris', avatar: 'https://i.pravatar.cc/150?img=26', class: 10, section: 'B', gender: 'Female', parentName: 'Matthew Harris', contact: '123-456-8901', admissionDate: '2022-08-19', status: 'Suspended', email: 'laura.h@school.com', attendance: 82 },
];

export const TEACHERS: Teacher[] = [
    { id: 1, teacherId: 'T-ENG-01', name: 'Elizabeth Johnson', avatar: 'https://i.pravatar.cc/150?img=21', email: 'e.johnson@school.edu', phone: '555-0101', department: 'English', assignedClasses: ['9A', '10B'], joiningDate: '2018-08-23', status: 'Active', yearsOfExperience: 10 },
    { id: 2, teacherId: 'T-SCI-01', name: 'Michael Smith', avatar: 'https://i.pravatar.cc/150?img=22', email: 'm.smith@school.edu', phone: '555-0102', department: 'Science', assignedClasses: ['11A', '12B'], joiningDate: '2016-07-15', status: 'Active', yearsOfExperience: 12 },
    { id: 3, teacherId: 'T-MAT-01', name: 'Maria Garcia', avatar: 'https://i.pravatar.cc/150?img=23', email: 'm.garcia@school.edu', phone: '555-0103', department: 'Mathematics', assignedClasses: ['8C', '9B'], joiningDate: '2020-01-30', status: 'Active', yearsOfExperience: 5 },
    { id: 4, teacherId: 'T-HIS-01', name: 'David Rodriguez', avatar: 'https://i.pravatar.cc/150?img=24', email: 'd.rodriguez@school.edu', phone: '555-0104', department: 'History', assignedClasses: ['7A'], joiningDate: '2019-09-01', status: 'On Leave', yearsOfExperience: 7 },
    { id: 5, teacherId: 'T-ART-01', name: 'Sarah Williams', avatar: 'https://i.pravatar.cc/150?img=25', email: 's.williams@school.edu', phone: '555-0105', department: 'Art', assignedClasses: ['All'], joiningDate: '2015-04-12', status: 'Active', yearsOfExperience: 13 },
    { id: 6, teacherId: 'T-PHY-01', name: 'James Brown', avatar: 'https://i.pravatar.cc/150?img=26', email: 'j.brown@school.edu', phone: '555-0106', department: 'Physical Ed.', assignedClasses: ['All'], joiningDate: '2021-08-20', status: 'Active', yearsOfExperience: 4 },
    { id: 7, teacherId: 'T-MAT-02', name: 'Jennifer Davis', avatar: 'https://i.pravatar.cc/150?img=27', email: 'j.davis@school.edu', phone: '555-0107', department: 'Mathematics', assignedClasses: ['10A', '11C'], joiningDate: '2012-06-18', status: 'Retired', yearsOfExperience: 18 },
    { id: 8, teacherId: 'T-SCI-02', name: 'Robert Miller', avatar: 'https://i.pravatar.cc/150?img=28', email: 'r.miller@school.edu', phone: '555-0108', department: 'Science', assignedClasses: ['9A', '10C'], joiningDate: '2017-11-05', status: 'Active', yearsOfExperience: 9 },
    { id: 9, teacherId: 'T-ENG-02', name: 'Linda Wilson', avatar: 'https://i.pravatar.cc/150?img=29', email: 'l.wilson@school.edu', phone: '555-0109', department: 'English', assignedClasses: ['7B', '8A'], joiningDate: '2022-08-25', status: 'Active', yearsOfExperience: 2 },
    { id: 10, teacherId: 'T-MUS-01', name: 'William Moore', avatar: 'https://i.pravatar.cc/150?img=30', email: 'w.moore@school.edu', phone: '555-0110', department: 'Music', assignedClasses: ['All'], joiningDate: '2018-02-14', status: 'Active', yearsOfExperience: 10 },
];

export const ANNOUNCEMENTS: Announcement[] = [
    { id: 1, title: 'School Reopens Next Week', content: 'The school will reopen on Monday, September 28th. Please ensure you have all your materials ready.', date: '2030-09-20' },
    { id: 2, title: 'Annual Sports Day Postponed', content: 'Due to unforeseen weather conditions, the Annual Sports Day has been postponed. A new date will be announced soon.', date: '2030-09-18' },
    { id: 3, title: 'Library Books Return', content: 'All students are requested to return their library books by the end of this week to avoid any fines.', date: '2030-09-15' },
];

const generateAttendanceData = (): AttendanceData[] => {
    const data: AttendanceData[] = [];
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    STUDENTS.forEach(student => {
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateString = date.toISOString().split('T')[0];
            const dayOfWeek = date.getDay();

            let status: AttendanceData['status'];

            if (date > today) {
                status = 'Future';
            } else if (dayOfWeek === 0 || dayOfWeek === 6) { // Sunday or Saturday
                status = 'Holiday';
            } else {
                const random = Math.random();
                if (random < 0.9) {
                    status = 'Present';
                } else if (random < 0.98) {
                    status = 'Absent';
                } else {
                    status = 'Leave';
                }
            }
            
            data.push({
                studentId: student.id,
                date: dateString,
                status: status,
            });
        }
    });
    return data;
}

export const ATTENDANCE_DATA: AttendanceData[] = generateAttendanceData();

export const FEES_CHART_DATA: FeeChartDataPoint[] = [
    { month: 'Jan', amount: 2000 },
    { month: 'Feb', amount: 2500 },
    { month: 'Mar', amount: 3000 },
    { month: 'Apr', amount: 2800 },
    { month: 'May', amount: 4000 },
    { month: 'Jun', amount: 3500 },
    { month: 'Jul', amount: 5000 },
    { month: 'Aug', amount: 6500 },
    { month: 'Sep', amount: 6000 },
    { month: 'Oct', amount: 5500 },
    { month: 'Nov', amount: 7000 },
    { month: 'Dec', amount: 6800 },
];

export const FEE_COLLECTION_DATA: FeeCollection[] = [
    { id: 1, studentName: 'Sophia Wilson', studentId: '2019-03-017', avatar: 'https://i.pravatar.cc/150?img=31', class: '11A', tuitionFee: 4500, activitiesFee: 300, miscellaneousFee: 200, totalAmount: 5000, status: 'Paid' },
    { id: 2, studentName: 'Ethan Lee', studentId: '2019-01-016', avatar: 'https://i.pravatar.cc/150?img=32', class: '10B', tuitionFee: 4500, activitiesFee: 250, miscellaneousFee: 150, totalAmount: 4900, status: 'Pending' },
    { id: 3, studentName: 'Michael Brown', studentId: '2019-01-012', avatar: 'https://i.pravatar.cc/150?img=33', class: '12 AP Calculus', tuitionFee: 4800, activitiesFee: 300, miscellaneousFee: 200, totalAmount: 5300, status: 'Paid' },
    { id: 4, studentName: 'Ava Smith', studentId: '2019-01-019', avatar: 'https://i.pravatar.cc/150?img=34', class: '9B', tuitionFee: 4500, activitiesFee: 250, miscellaneousFee: 100, totalAmount: 4850, status: 'Overdue' },
    { id: 5, studentName: 'Lucas Johnson', studentId: '2019-01-004', avatar: 'https://i.pravatar.cc/150?img=35', class: '11A', tuitionFee: 4500, activitiesFee: 300, miscellaneousFee: 200, totalAmount: 5000, status: 'Paid' },
    { id: 6, studentName: 'Isabella Garcia', studentId: '2019-03-012', avatar: 'https://i.pravatar.cc/150?img=36', class: '8B', tuitionFee: 4200, activitiesFee: 200, miscellaneousFee: 150, totalAmount: 4550, status: 'Pending' },
    { id: 7, studentName: 'Oliver Martinez', studentId: '2019-10-014', avatar: 'https://i.pravatar.cc/150?img=37', class: 'Drama Club', tuitionFee: 4600, activitiesFee: 350, miscellaneousFee: 100, totalAmount: 4950, status: 'Paid' },
    { id: 8, studentName: 'Hannah White', studentId: '2019-01-012', avatar: 'https://i.pravatar.cc/150?img=38', class: '7C', tuitionFee: 4200, activitiesFee: 200, miscellaneousFee: 100, totalAmount: 4500, status: 'Paid' },
    { id: 9, studentName: 'Aiden Taylor', studentId: '2019-01-015', avatar: 'https://i.pravatar.cc/150?img=39', class: 'Spanish I', tuitionFee: 4200, activitiesFee: 250, miscellaneousFee: 150, totalAmount: 4600, status: 'Overdue' },
    { id: 10, studentName: 'Emily Peterson', studentId: '2019-02-011', avatar: 'https://i.pravatar.cc/150?img=40', class: '10A', tuitionFee: 4500, activitiesFee: 250, miscellaneousFee: 150, totalAmount: 4900, status: 'Pending' },
    { id: 11, studentName: 'Jacob Rodriguez', studentId: '2019-04-020', avatar: 'https://i.pravatar.cc/150?img=41', class: '11B', tuitionFee: 4500, activitiesFee: 300, miscellaneousFee: 200, totalAmount: 5000, status: 'Paid' },
    { id: 12, studentName: 'Mia Wilson', studentId: '2019-05-021', avatar: 'https://i.pravatar.cc/150?img=42', class: '9C', tuitionFee: 4400, activitiesFee: 220, miscellaneousFee: 120, totalAmount: 4740, status: 'Pending' },
];
