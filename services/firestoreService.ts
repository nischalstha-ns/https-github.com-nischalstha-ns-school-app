import { Student, Teacher, AttendanceData, AttendanceStatus, FeeCollection, UserAccount, Announcement, Book } from '../types';
import { 
    STUDENTS as mockStudents, 
    TEACHERS as mockTeachers, 
    FEE_COLLECTION_DATA as mockFinanceData, 
    USERS as mockUsers, 
    ANNOUNCEMENTS as mockAnnouncements, 
    BOOKS as mockBooks 
} from '../constants';

// --- In-memory database ---
let inMemoryStudents: Student[] = [];
let inMemoryTeachers: Teacher[] = [];
let inMemoryAttendance: AttendanceData[] = [];
let inMemoryFinance: FeeCollection[] = [];
let inMemoryUsers: UserAccount[] = [];
let inMemoryAnnouncements: Announcement[] = [];
let inMemoryBooks: Book[] = [];

const generateId = () => crypto.randomUUID();

// --- Student Functions ---
export const getStudents = async (): Promise<Student[]> => {
    return Promise.resolve([...inMemoryStudents]);
};

export const addStudent = async (studentData: Omit<Student, 'id'>) => {
    const newStudent = { ...studentData, id: generateId() };
    inMemoryStudents.push(newStudent);
    return Promise.resolve({ id: newStudent.id });
};

export const updateStudent = async (id: string, studentData: Partial<Omit<Student, 'id'>>) => {
    inMemoryStudents = inMemoryStudents.map(s => s.id === id ? { ...s, ...studentData } : s);
    return Promise.resolve();
};

export const deleteStudent = async (id: string) => {
    inMemoryStudents = inMemoryStudents.filter(s => s.id !== id);
    return Promise.resolve();
};

export const getStudentsCollectionSize = async (): Promise<number> => {
    return Promise.resolve(inMemoryStudents.length);
};

export const seedStudentsDatabase = async () => {
    if (inMemoryStudents.length > 0) {
        console.log("Students collection already has data. Seeding skipped.");
        return Promise.resolve();
    }
    console.log("Seeding in-memory database with mock student data...");
    inMemoryStudents = mockStudents.map(student => ({
        ...student,
        id: generateId()
    }));
    console.log("In-memory database seeded successfully!");
    return Promise.resolve();
};


// --- Teacher Functions ---
export const getTeachers = async (): Promise<Teacher[]> => Promise.resolve([...inMemoryTeachers]);

export const addTeacher = async (teacherData: Omit<Teacher, 'id'>) => {
    const newTeacher = { ...teacherData, id: generateId() };
    inMemoryTeachers.push(newTeacher);
    return Promise.resolve({ id: newTeacher.id });
};

export const updateTeacher = async (id: string, teacherData: Partial<Omit<Teacher, 'id'>>) => {
    inMemoryTeachers = inMemoryTeachers.map(t => t.id === id ? { ...t, ...teacherData } : t);
    return Promise.resolve();
};

export const deleteTeacher = async (id: string) => {
    inMemoryTeachers = inMemoryTeachers.filter(t => t.id !== id);
    return Promise.resolve();
};

export const getTeachersCollectionSize = async (): Promise<number> => Promise.resolve(inMemoryTeachers.length);

export const seedTeachersDatabase = async () => {
    if (inMemoryTeachers.length > 0) return Promise.resolve();
    inMemoryTeachers = mockTeachers.map(teacher => ({ ...teacher, id: generateId() }));
    return Promise.resolve();
};


// --- Attendance Functions ---
export const getAttendance = async (year: number, month: number): Promise<AttendanceData[]> => {
    const monthString = String(month + 1).padStart(2, '0');
    const startDate = `${year}-${monthString}-01`;
    const endDate = `${year}-${monthString}-31`;
    const filtered = inMemoryAttendance.filter(a => a.date >= startDate && a.date <= endDate);
    return Promise.resolve([...filtered]);
};

export const upsertAttendance = async (studentId: string, date: string, status: AttendanceStatus) => {
    const index = inMemoryAttendance.findIndex(a => a.studentId === studentId && a.date === date);
    if (index > -1) {
        inMemoryAttendance[index].status = status;
    } else {
        inMemoryAttendance.push({ studentId, date, status });
    }
    return Promise.resolve();
};

export const seedAttendanceDatabase = async (year: number, month: number) => {
    const monthString = String(month + 1).padStart(2, '0');
    if (inMemoryAttendance.some(a => a.date.startsWith(`${year}-${monthString}`))) {
        console.log(`Attendance for ${year}-${monthString} already exists. Seeding skipped.`);
        return Promise.resolve();
    }

    if (inMemoryStudents.length === 0) {
        console.log("No students in the database. Cannot seed attendance.");
        return Promise.resolve();
    }

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    inMemoryStudents.forEach(student => {
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateString = date.toISOString().split('T')[0];
            const dayOfWeek = date.getDay();
            let status: AttendanceStatus = (dayOfWeek === 0 || dayOfWeek === 6) ? 'Holiday' : date > today ? 'Future' : 'Present';
            
            inMemoryAttendance.push({ studentId: student.id, date: dateString, status });
        }
    });
    console.log(`Attendance for ${year}-${monthString} seeded successfully.`);
    return Promise.resolve();
};


// --- Finance Functions ---
export const getFinanceData = async (): Promise<FeeCollection[]> => Promise.resolve([...inMemoryFinance]);

export const addFinanceRecord = async (recordData: Omit<FeeCollection, 'id'>) => {
    const newRecord = { ...recordData, id: generateId() };
    inMemoryFinance.push(newRecord);
    return Promise.resolve({ id: newRecord.id });
};

export const updateFinanceRecord = async (id: string, recordData: Partial<Omit<FeeCollection, 'id'>>) => {
    inMemoryFinance = inMemoryFinance.map(r => r.id === id ? { ...r, ...recordData } : r);
    return Promise.resolve();
};

export const deleteFinanceRecord = async (id: string) => {
    inMemoryFinance = inMemoryFinance.filter(r => r.id !== id);
    return Promise.resolve();
};

export const getFinanceCollectionSize = async (): Promise<number> => Promise.resolve(inMemoryFinance.length);

export const seedFinanceDatabase = async () => {
    if (inMemoryFinance.length > 0) return Promise.resolve();
    inMemoryFinance = mockFinanceData.map(record => ({ ...record, id: generateId() }));
    return Promise.resolve();
};


// --- User Account Functions ---
export const getAdminProfile = async (email: string): Promise<UserAccount | null> => {
    if (inMemoryUsers.length === 0) {
        inMemoryUsers = mockUsers.map(u => ({ ...u, id: generateId() } as UserAccount));
    }
    const user = inMemoryUsers.find(u => u.email === email);
    return Promise.resolve(user || null);
};

export const getUsers = async (): Promise<UserAccount[]> => Promise.resolve([...inMemoryUsers]);

export const addUser = async (userData: Omit<UserAccount, 'id' | 'password'>) => {
    const newUser = { ...userData, id: generateId() } as UserAccount;
    inMemoryUsers.push(newUser);
    return Promise.resolve({ id: newUser.id });
};

export const updateUser = async (id: string, userData: Partial<Omit<UserAccount, 'id' | 'password'>>) => {
    inMemoryUsers = inMemoryUsers.map(u => u.id === id ? { ...u, ...userData } : u);
    return Promise.resolve();
};

export const deleteUser = async (id: string) => {
    inMemoryUsers = inMemoryUsers.filter(u => u.id !== id);
    return Promise.resolve();
};

export const getUsersCollectionSize = async (): Promise<number> => Promise.resolve(inMemoryUsers.length);

export const seedUsersDatabase = async () => {
    if (inMemoryUsers.length > 0) return Promise.resolve();
    inMemoryUsers = mockUsers.map(user => ({ ...user, id: generateId() } as UserAccount));
    return Promise.resolve();
};


// --- Announcement Functions ---
export const getAnnouncements = async (): Promise<Announcement[]> => {
    const sorted = [...inMemoryAnnouncements].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return Promise.resolve(sorted);
};

export const addAnnouncement = async (announcementData: Omit<Announcement, 'id'>) => {
    const newAnnouncement = { ...announcementData, id: generateId() };
    inMemoryAnnouncements.push(newAnnouncement);
    return Promise.resolve({ id: newAnnouncement.id });
};

export const deleteAnnouncement = async (id: string) => {
    inMemoryAnnouncements = inMemoryAnnouncements.filter(a => a.id !== id);
    return Promise.resolve();
};

export const getAnnouncementsCollectionSize = async (): Promise<number> => Promise.resolve(inMemoryAnnouncements.length);

export const seedAnnouncementsDatabase = async () => {
    if (inMemoryAnnouncements.length > 0) return Promise.resolve();
    inMemoryAnnouncements = mockAnnouncements.map(a => ({ ...a, id: generateId() }));
    return Promise.resolve();
};


// --- Library Book Functions ---
export const getBooks = async (): Promise<Book[]> => Promise.resolve([...inMemoryBooks]);

export const addBook = async (bookData: Omit<Book, 'id'>) => {
    const newBook = { ...bookData, id: generateId() };
    inMemoryBooks.push(newBook);
    return Promise.resolve({ id: newBook.id });
};

export const updateBook = async (id: string, bookData: Partial<Omit<Book, 'id'>>) => {
    inMemoryBooks = inMemoryBooks.map(b => b.id === id ? { ...b, ...bookData } : b);
    return Promise.resolve();
};

export const deleteBook = async (id: string) => {
    inMemoryBooks = inMemoryBooks.filter(b => b.id !== id);
    return Promise.resolve();
};

export const getBooksCollectionSize = async (): Promise<number> => Promise.resolve(inMemoryBooks.length);

export const seedBooksDatabase = async () => {
    if (inMemoryBooks.length > 0) return Promise.resolve();
    inMemoryBooks = mockBooks.map(book => ({ ...book, id: generateId() }));
    return Promise.resolve();
};