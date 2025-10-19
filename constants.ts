// Fix: Provide mock data for the application
import { AgendaItem, Message, EarningsDataPoint, StudentActivityItem, NoticeBoardItem, RecentActivityItem, Student, Teacher, Announcement, FeeCollection, FeeChartDataPoint, UserAccount, UserRole, CalendarEvent, Book, Conversation, Expense } from './types';

const PLACEHOLDER_AVATAR = 'https://via.placeholder.com/150';

export const AGENDA: AgendaItem[] = [
  { id: '1', time: '08:00', title: 'Mathematics', subtitle: 'Room 201, Mrs. Davis', color: 'bg-orange-100' },
  { id: '2', time: '09:30', title: 'Science Lab', subtitle: 'Lab A, Mr. Brown', color: 'bg-blue-100' },
  { id: '3', time: '11:00', title: 'English Literature', subtitle: 'Room 105, Ms. Smith', color: 'bg-green-100' },
];

export const MESSAGES: Message[] = [
  { id: '1', avatar: `${PLACEHOLDER_AVATAR}/1`, sender: 'John Doe', time: '10:30 AM', text: 'Hi, can we reschedule our meeting?', unread: 2 },
  { id: '2', avatar: `${PLACEHOLDER_AVATAR}/2`, sender: 'Jane Smith', time: 'Yesterday', text: 'Please review the attached documents.' },
  { id: '3', avatar: `${PLACEHOLDER_AVATAR}/3`, sender: 'Robert Brown', time: '2 days ago', text: 'Thank you for your help!' },
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
    { id: '1', icon: 'trophy', title: 'Sports Day Victory', description: 'Won the inter-school football championship.', time: '2 hours ago' },
    { id: '2', icon: 'debate', title: 'Debate Club', description: 'Final round of the annual debate competition.', time: 'Yesterday' },
    { id: '3', icon: 'science', title: 'Science Fair', description: 'Project "Volcano Model" won first prize.', time: '3 days ago' },
];

export const NOTICE_BOARD_ITEMS: NoticeBoardItem[] = [
    { id: '1', image: 'https://picsum.photos/seed/nb1/200', title: 'Annual Sports Day', author: 'Mr. John', date: 'Sep 20', views: '1.2k' },
    { id: '2', image: 'https://picsum.photos/seed/nb2/200', title: 'Parent-Teacher Meeting', author: 'Admin', date: 'Sep 18', views: '2.5k' },
    { id: '3', image: 'https://picsum.photos/seed/nb3/200', title: 'Science Exhibition', author: 'Mrs. Adora', date: 'Sep 15', views: '980' },
];

export const RECENT_ACTIVITIES: RecentActivityItem[] = [
    { id: '1', avatar: `${PLACEHOLDER_AVATAR}/4`, user: 'Linda Adora', action: 'added a new document to', subject: 'Science project', time: '5 mins ago' },
    { id: '2', avatar: `${PLACEHOLDER_AVATAR}/6`, user: 'John Doe', action: 'submitted an assignment for', subject: 'Mathematics', time: '1 hour ago' },
    { id: '3', avatar: `${PLACEHOLDER_AVATAR}/7`, user: 'Jane Smith', action: 'updated her profile picture', subject: '', time: '3 hours ago' },
];

export const STUDENTS: Omit<Student, 'id'>[] = [
    { studentId: 'S-001', rollNo: 1, name: 'Alice Johnson', avatar: `${PLACEHOLDER_AVATAR}/11`, class: 10, section: 'A', gender: 'Female', dob: '2014-05-20', address: '123 Maple Street, Anytown', parentName: 'John Johnson', contact: '123-456-7890', admissionDate: '2022-08-15', status: 'Active', email: 'alice.j@school.com', attendance: 95 },
    { studentId: 'S-002', rollNo: 2, name: 'Bob Williams', avatar: `${PLACEHOLDER_AVATAR}/12`, class: 10, section: 'A', gender: 'Male', dob: '2014-03-15', address: '456 Oak Avenue, Anytown', parentName: 'David Williams', contact: '123-456-7891', admissionDate: '2022-08-15', status: 'Active', email: 'bob.w@school.com', attendance: 88 },
    { studentId: 'S-003', rollNo: 1, name: 'Charlie Brown', avatar: `${PLACEHOLDER_AVATAR}/13`, class: 9, section: 'B', gender: 'Male', dob: '2015-09-01', address: '789 Pine Lane, Anytown', parentName: 'James Brown', contact: '123-456-7892', admissionDate: '2021-08-20', status: 'Active', email: 'charlie.b@school.com', attendance: 92 },
    { studentId: 'S-004', rollNo: 3, name: 'Diana Miller', avatar: `${PLACEHOLDER_AVATAR}/14`, class: 10, section: 'A', gender: 'Female', dob: '2014-07-22', address: '101 Elm Court, Anytown', parentName: 'Robert Miller', contact: '123-456-7893', admissionDate: '2022-08-16', status: 'Suspended', email: 'diana.m@school.com', attendance: 98 },
    { studentId: 'S-005', rollNo: 2, name: 'Ethan Davis', avatar: `${PLACEHOLDER_AVATAR}/15`, class: 9, section: 'B', gender: 'Male', dob: '2015-11-30', address: '212 Birch Road, Anytown', parentName: 'Michael Davis', contact: '123-456-7894', admissionDate: '2021-08-21', status: 'Active', email: 'ethan.d@school.com', attendance: 85 },
    { studentId: 'S-006', rollNo: 1, name: 'Fiona Garcia', avatar: `${PLACEHOLDER_AVATAR}/16`, class: 12, section: 'C', gender: 'Female', dob: '2012-01-18', address: '333 Cedar Blvd, Anytown', parentName: 'William Garcia', contact: '123-456-7895', admissionDate: '2020-09-01', status: 'Graduated', email: 'fiona.g@school.com', attendance: 99 },
    { studentId: 'S-007', rollNo: 4, name: 'George Wilson', avatar: `${PLACEHOLDER_AVATAR}/17`, class: 10, section: 'A', gender: 'Male', dob: '2014-08-10', address: '444 Spruce Way, Anytown', parentName: 'Richard Wilson', contact: '123-456-7896', admissionDate: '2022-08-17', status: 'Active', email: 'george.w@school.com', attendance: 91 },
    { studentId: 'S-008', rollNo: 3, name: 'Hannah Martinez', avatar: `${PLACEHOLDER_AVATAR}/18`, class: 9, section: 'B', gender: 'Female', dob: '2015-06-05', address: '555 Willow Drive, Anytown', parentName: 'Joseph Martinez', contact: '123-456-7897', admissionDate: '2021-08-22', status: 'Active', email: 'hannah.m@school.com', attendance: 78 },
    { studentId: 'S-009', rollNo: 1, name: 'Ian Anderson', avatar: `${PLACEHOLDER_AVATAR}/19`, class: 11, section: 'A', gender: 'Male', dob: '2013-02-25', address: '666 Aspen Circle, Anytown', parentName: 'Thomas Anderson', contact: '123-456-7898', admissionDate: '2021-09-05', status: 'Active', email: 'ian.a@school.com', attendance: 93 },
    { studentId: 'S-010', rollNo: 2, name: 'Jessica Thomas', avatar: `${PLACEHOLDER_AVATAR}/20`, class: 11, section: 'A', gender: 'Female', dob: '2013-04-12', address: '777 Sequoia Trail, Anytown', parentName: 'Charles Thomas', contact: '123-456-7899', admissionDate: '2021-09-06', status: 'Active', email: 'jessica.t@school.com', attendance: 96 },
    { studentId: 'S-011', rollNo: 5, name: 'Kevin White', avatar: `${PLACEHOLDER_AVATAR}/25`, class: 10, section: 'B', gender: 'Male', dob: '2014-10-19', address: '888 Redwood Place, Anytown', parentName: 'Daniel White', contact: '123-456-8900', admissionDate: '2022-08-18', status: 'Active', email: 'kevin.w@school.com', attendance: 89 },
    { studentId: 'S-012', rollNo: 6, name: 'Laura Harris', avatar: `${PLACEHOLDER_AVATAR}/26`, class: 10, section: 'B', gender: 'Female', dob: '2014-12-01', address: '999 Mahogany Court, Anytown', parentName: 'Matthew Harris', contact: '123-456-8901', admissionDate: '2022-08-19', status: 'Suspended', email: 'laura.h@school.com', attendance: 82 },
    { studentId: 'S-013', rollNo: 1, name: 'Mia Clark', avatar: `${PLACEHOLDER_AVATAR}/43`, class: -2, section: 'A', gender: 'Female', dob: '2020-05-10', address: '111 Rose Garden, Anytown', parentName: 'Paul Clark', contact: '123-456-8902', admissionDate: '2023-08-15', status: 'Active', email: 'mia.c@school.com', attendance: 98 },
    { studentId: 'S-014', rollNo: 1, name: 'Noah Lewis', avatar: `${PLACEHOLDER_AVATAR}/44`, class: -1, section: 'B', gender: 'Male', dob: '2019-03-25', address: '222 Lily Pad Lane, Anytown', parentName: 'Chris Lewis', contact: '123-456-8903', admissionDate: '2023-08-15', status: 'Active', email: 'noah.l@school.com', attendance: 97 },
    { studentId: 'S-015', rollNo: 2, name: 'Olivia Walker', avatar: `${PLACEHOLDER_AVATAR}/45`, class: 0, section: 'A', gender: 'Female', dob: '2018-02-14', address: '333 Tulip Terrace, Anytown', parentName: 'Mark Walker', contact: '123-456-8904', admissionDate: '2023-08-15', status: 'Active', email: 'olivia.w@school.com', attendance: 99 },
];

export const TEACHERS: Omit<Teacher, 'id'>[] = [
    { teacherId: 'T-ENG-01', name: 'Elizabeth Johnson', avatar: `${PLACEHOLDER_AVATAR}/21`, email: 'e.johnson@school.edu', phone: '555-0101', department: 'English', assignedClasses: ['9A', '10B'], joiningDate: '2018-08-23', status: 'Active', yearsOfExperience: 10 },
    { teacherId: 'T-SCI-01', name: 'Michael Smith', avatar: `${PLACEHOLDER_AVATAR}/22`, email: 'm.smith@school.edu', phone: '555-0102', department: 'Science', assignedClasses: ['11A', '12B'], joiningDate: '2016-07-15', status: 'Active', yearsOfExperience: 12 },
    { teacherId: 'T-MAT-01', name: 'Maria Garcia', avatar: `${PLACEHOLDER_AVATAR}/23`, email: 'm.garcia@school.edu', phone: '555-0103', department: 'Mathematics', assignedClasses: ['8C', '9B'], joiningDate: '2020-01-30', status: 'Active', yearsOfExperience: 5 },
    { teacherId: 'T-HIS-01', name: 'David Rodriguez', avatar: `${PLACEHOLDER_AVATAR}/24`, email: 'd.rodriguez@school.edu', phone: '555-0104', department: 'History', assignedClasses: ['7A'], joiningDate: '2019-09-01', status: 'On Leave', yearsOfExperience: 7 },
    { teacherId: 'T-ART-01', name: 'Sarah Williams', avatar: `${PLACEHOLDER_AVATAR}/25`, email: 's.williams@school.edu', phone: '555-0105', department: 'Art', assignedClasses: ['All'], joiningDate: '2015-04-12', status: 'Active', yearsOfExperience: 13 },
    { teacherId: 'T-PHY-01', name: 'James Brown', avatar: `${PLACEHOLDER_AVATAR}/26`, email: 'j.brown@school.edu', phone: '555-0106', department: 'Physical Ed.', assignedClasses: ['All'], joiningDate: '2021-08-20', status: 'Active', yearsOfExperience: 4 },
    { teacherId: 'T-MAT-02', name: 'Jennifer Davis', avatar: `${PLACEHOLDER_AVATAR}/27`, email: 'j.davis@school.edu', phone: '555-0107', department: 'Mathematics', assignedClasses: ['10A', '11C'], joiningDate: '2012-06-18', status: 'Retired', yearsOfExperience: 18 },
    { teacherId: 'T-SCI-02', name: 'Robert Miller', avatar: `${PLACEHOLDER_AVATAR}/28`, email: 'r.miller@school.edu', phone: '555-0108', department: 'Science', assignedClasses: ['9A', '10C'], joiningDate: '2017-11-05', status: 'Active', yearsOfExperience: 9 },
    { teacherId: 'T-ENG-02', name: 'Linda Wilson', avatar: `${PLACEHOLDER_AVATAR}/29`, email: 'l.wilson@school.edu', phone: '555-0109', department: 'English', assignedClasses: ['7B', '8A'], joiningDate: '2022-08-25', status: 'Active', yearsOfExperience: 2 },
    { teacherId: 'T-MUS-01', name: 'William Moore', avatar: `${PLACEHOLDER_AVATAR}/30`, email: 'w.moore@school.edu', phone: '555-0110', department: 'Music', assignedClasses: ['All'], joiningDate: '2018-02-14', status: 'Active', yearsOfExperience: 10 },
];

export const ANNOUNCEMENTS: Omit<Announcement, 'id'>[] = [
    { title: 'School Reopens Next Week', content: 'The school will reopen on Monday, September 28th. Please ensure you have all your materials ready.', date: '2030-09-20' },
    { title: 'Annual Sports Day Postponed', content: 'Due to unforeseen weather conditions, the Annual Sports Day has been postponed. A new date will be announced soon.', date: '2030-09-18' },
    { title: 'Library Books Return', content: 'All students are requested to return their library books by the end of this week to avoid any fines.', date: '2030-09-15' },
];

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

export const FEE_COLLECTION_DATA: Omit<FeeCollection, 'id' | 'date'>[] = [
    { studentName: 'Sophia Wilson', studentId: '2019-03-017', avatar: `${PLACEHOLDER_AVATAR}/31`, class: '11A', tuitionFee: 4500, activitiesFee: 300, miscellaneousFee: 200, totalAmount: 5000, status: 'Paid' },
    { studentName: 'Ethan Lee', studentId: '2019-01-016', avatar: `${PLACEHOLDER_AVATAR}/32`, class: '10B', tuitionFee: 4500, activitiesFee: 250, miscellaneousFee: 150, totalAmount: 4900, status: 'Pending' },
    { studentName: 'Michael Brown', studentId: '2019-01-012', avatar: `${PLACEHOLDER_AVATAR}/33`, class: '12 AP Calculus', tuitionFee: 4800, activitiesFee: 300, miscellaneousFee: 200, totalAmount: 5300, status: 'Paid' },
    { studentName: 'Ava Smith', studentId: '2019-01-019', avatar: `${PLACEHOLDER_AVATAR}/34`, class: '9B', tuitionFee: 4500, activitiesFee: 250, miscellaneousFee: 100, totalAmount: 4850, status: 'Overdue' },
    { studentName: 'Lucas Johnson', studentId: '2019-01-004', avatar: `${PLACEHOLDER_AVATAR}/35`, class: '11A', tuitionFee: 4500, activitiesFee: 300, miscellaneousFee: 200, totalAmount: 5000, status: 'Paid' },
    { studentName: 'Isabella Garcia', studentId: '2019-03-012', avatar: `${PLACEHOLDER_AVATAR}/36`, class: '8B', tuitionFee: 4200, activitiesFee: 200, miscellaneousFee: 150, totalAmount: 4550, status: 'Pending' },
    { studentName: 'Oliver Martinez', studentId: '2019-10-014', avatar: `${PLACEHOLDER_AVATAR}/37`, class: 'Drama Club', tuitionFee: 4600, activitiesFee: 350, miscellaneousFee: 100, totalAmount: 4950, status: 'Paid' },
    { studentName: 'Hannah White', studentId: '2019-01-012', avatar: `${PLACEHOLDER_AVATAR}/38`, class: '7C', tuitionFee: 4200, activitiesFee: 200, miscellaneousFee: 100, totalAmount: 4500, status: 'Paid' },
    { studentName: 'Aiden Taylor', studentId: '2019-01-015', avatar: `${PLACEHOLDER_AVATAR}/39`, class: 'Spanish I', tuitionFee: 4200, activitiesFee: 250, miscellaneousFee: 150, totalAmount: 4600, status: 'Overdue' },
    { studentName: 'Emily Peterson', studentId: '2019-02-011', avatar: `${PLACEHOLDER_AVATAR}/40`, class: '10A', tuitionFee: 4500, activitiesFee: 250, miscellaneousFee: 150, totalAmount: 4900, status: 'Pending' },
    { studentName: 'Jacob Rodriguez', studentId: '2019-04-020', avatar: `${PLACEHOLDER_AVATAR}/41`, class: '11B', tuitionFee: 4500, activitiesFee: 300, miscellaneousFee: 200, totalAmount: 5000, status: 'Paid' },
    { studentName: 'Mia Wilson', studentId: '2019-05-021', avatar: `${PLACEHOLDER_AVATAR}/42`, class: '9C', tuitionFee: 4400, activitiesFee: 220, miscellaneousFee: 120, totalAmount: 4740, status: 'Pending' },
];

export const EXPENSES: Omit<Expense, 'id'>[] = [
    { description: 'Teacher Salaries - September', category: 'Salaries', date: '2030-09-30', amount: 55000, status: 'Paid', receiptUrl: '' },
    { description: 'Electricity Bill', category: 'Utilities', date: '2030-09-25', amount: 2500, status: 'Paid', receiptUrl: '' },
    { description: 'Office & Classroom Supplies', category: 'Supplies', date: '2030-09-15', amount: 3200, status: 'Paid', receiptUrl: '' },
    { description: 'Campus Plumbing Repairs', category: 'Maintenance', date: '2030-09-20', amount: 1800, status: 'Pending', receiptUrl: '' },
    { description: 'Internet & Phone Bill', category: 'Utilities', date: '2030-09-28', amount: 800, status: 'Paid', receiptUrl: '' },
    { description: 'Janitorial Staff Salaries', category: 'Salaries', date: '2030-09-30', amount: 8000, status: 'Paid', receiptUrl: '' },
    { description: 'New Library Books Purchase', category: 'Supplies', date: '2030-09-10', amount: 4500, status: 'Paid', receiptUrl: '' },
    { description: 'Annual Software Licensing', category: 'Other', date: '2030-09-05', amount: 7300, status: 'Paid', receiptUrl: '' },
];

export const USERS: Omit<UserAccount, 'id'>[] = [
    { fullName: 'Nischal Admin', email: 'nischalfancystore@gmail.com', password: '112233445566', role: UserRole.Manager, status: 'Active', avatar: `${PLACEHOLDER_AVATAR}/5` },
    { fullName: 'John Johnson', email: 'john.johnson@school.edu', password: 'password123', role: UserRole.Parent, status: 'Active', avatar: `${PLACEHOLDER_AVATAR}/1` },
    { fullName: 'Elizabeth Johnson', email: 'e.johnson@school.edu', password: 'password123', role: UserRole.Teacher, status: 'Active', avatar: `${PLACEHOLDER_AVATAR}/21` },
    { fullName: 'Alice Johnson', email: 'alice.j@school.com', password: 'password123', role: UserRole.Student, status: 'Active', avatar: `${PLACEHOLDER_AVATAR}/11` },
    { fullName: 'Finance Team', email: 'finance@school.edu', password: 'password123', role: UserRole.Finance, status: 'Active', avatar: `${PLACEHOLDER_AVATAR}/50` },
    { fullName: 'Inactive User', email: 'inactive.user@school.edu', password: 'password123', role: UserRole.Staff, status: 'Inactive', avatar: `${PLACEHOLDER_AVATAR}/51` },
];

export const CALENDAR_EVENTS: Omit<CalendarEvent, 'id'>[] = [
    { date: '2030-09-02', title: 'Labor Day', description: 'School closed for Labor Day.', type: 'holiday' },
    { date: '2030-09-18', title: 'Parent-Teacher Meeting', description: 'Meeting for parents of students in grades 9-12.', type: 'event' },
    { date: '2030-09-20', title: 'Annual Sports Day', description: 'All students to participate in the annual sports day events.', type: 'event' },
    { date: '2030-09-25', title: 'Mid-term Exams Start', description: 'Mid-term examinations for all grades begin.', type: 'exam' },
    { date: '2030-09-30', title: 'Mid-term Exams End', description: 'Mid-term examinations for all grades conclude.', type: 'exam' },
];

export const BOOKS: Omit<Book, 'id'>[] = [
    { title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '978-0061120084', genre: 'Fiction', status: 'Available' },
    { title: '1984', author: 'George Orwell', isbn: '978-0451524935', genre: 'Dystopian', status: 'Issued', issuedTo: 'S-001', dueDate: '2030-10-05' },
    { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '978-0743273565', genre: 'Fiction', status: 'Available' },
    { title: 'A Brief History of Time', author: 'Stephen Hawking', isbn: '978-0553380163', genre: 'Science', status: 'Available' },
    { title: 'Sapiens: A Brief History of Humankind', author: 'Yuval Noah Harari', isbn: '978-0062316097', genre: 'History', status: 'Issued', issuedTo: 'S-003', dueDate: '2030-09-28' },
    { title: "The Hitchhiker's Guide to the Galaxy", author: 'Douglas Adams', isbn: '978-0345391803', genre: 'Sci-Fi', status: 'Available' },
    { title: 'Pride and Prejudice', author: 'Jane Austen', isbn: '978-0141439518', genre: 'Romance', status: 'Available' },
];

export const CONVERSATIONS: Conversation[] = [
    {
        id: '1',
        participant: { name: 'John Doe', avatar: 'https://i.pravatar.cc/150?u=john' },
        lastMessage: 'Hi, can we reschedule our meeting?',
        timestamp: '10:30 AM',
        unreadCount: 2,
        messages: [
            { id: 'm1', text: 'Hey, are you free to talk?', sender: 'other', timestamp: '10:25 AM' },
            { id: 'm2', text: 'Hi, can we reschedule our meeting?', sender: 'other', timestamp: '10:30 AM' },
            { id: 'm3', text: 'Sure, how about tomorrow at 2 PM?', sender: 'me', timestamp: '10:31 AM' },
        ]
    },
    {
        id: '2',
        participant: { name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?u=jane' },
        lastMessage: 'Please review the attached documents.',
        timestamp: 'Yesterday',
        unreadCount: 0,
        messages: [
            { id: 'm4', text: 'Please review the attached documents.', sender: 'other', timestamp: 'Yesterday' },
            { id: 'm5', text: 'Will do, thanks!', sender: 'me', timestamp: 'Yesterday' },
        ]
    },
     {
        id: '3',
        participant: { name: 'Robert Brown', avatar: 'https://i.pravatar.cc/150?u=robert' },
        lastMessage: 'Thank you for your help!',
        timestamp: '2 days ago',
        unreadCount: 0,
        messages: [
             { id: 'm6', text: 'Thank you for your help!', sender: 'other', timestamp: '2 days ago' },
        ]
    }
];