import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import * as firestoreService from '../services/firestoreService';
import { Student, Teacher, UserAccount, UserRole, AttendanceData, FeeCollection, Announcement, Book, AttendanceStatus, BulkGenerateAccountsResult, Expense, Result } from '../types';

interface AppState {
    students: Student[];
    teachers: Teacher[];
    users: UserAccount[];
    attendance: { [key: string]: AttendanceData[] };
    financeData: FeeCollection[];
    expenses: Expense[];
    announcements: Announcement[];
    books: Book[];
    results: Result[];
    isLoading: boolean;
    error: string | null;
}

interface AppContextType extends AppState {
    addStudent: (data: Omit<Student, 'id'>) => Promise<void>;
    updateStudent: (id: string, data: Partial<Omit<Student, 'id'>>) => Promise<void>;
    deleteStudent: (id: string) => Promise<void>;
    addTeacher: (data: Omit<Teacher, 'id'>) => Promise<void>;
    updateTeacher: (id: string, data: Partial<Omit<Teacher, 'id'>>) => Promise<void>;
    deleteTeacher: (id: string) => Promise<void>;
    addUser: (data: Omit<UserAccount, 'id'>) => Promise<void>;
    updateUser: (id: string, data: Partial<Omit<UserAccount, 'id'>>) => Promise<void>;
    deleteUser: (id: string) => Promise<void>;
    upsertAttendance: (studentId: string, date: string, status: AttendanceStatus) => Promise<void>;
    loadAttendanceForMonth: (year: number, month: number) => Promise<void>;
    addFinanceRecord: (data: Omit<FeeCollection, 'id'>) => Promise<void>;
    updateFinanceRecord: (id: string, data: Partial<Omit<FeeCollection, 'id'>>) => Promise<void>;
    deleteFinanceRecord: (id: string) => Promise<void>;
    addExpense: (data: Omit<Expense, 'id'>) => Promise<void>;
    updateExpense: (id: string, data: Partial<Omit<Expense, 'id'>>) => Promise<void>;
    deleteExpense: (id: string) => Promise<void>;
    addAnnouncement: (data: Omit<Announcement, 'id'>) => Promise<void>;
    deleteAnnouncement: (id: string) => Promise<void>;
    addBook: (data: Omit<Book, 'id'>) => Promise<void>;
    updateBook: (id: string, data: Partial<Omit<Book, 'id'>>) => Promise<void>;
    deleteBook: (id: string) => Promise<void>;
    addResult: (data: Omit<Result, 'id'>) => Promise<void>;
    updateResult: (id: string, data: Partial<Omit<Result, 'id'>>) => Promise<void>;
    deleteResult: (id: string) => Promise<void>;
    bulkGenerateClassAccounts: (classNumber: number, usernamePattern: string, passwordPattern: string) => Promise<number>;
    bulkUpdateUserStatus: (userIds: string[], status: 'Active' | 'Inactive') => Promise<void>;
    seedAllData: () => Promise<void>;
    seedAttendanceData: (year: number, month: number) => Promise<void>;
    retryConnection: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, setState] = useState<AppState>({
        students: [],
        teachers: [],
        users: [],
        attendance: {},
        financeData: [],
        expenses: [],
        announcements: [],
        books: [],
        results: [],
        isLoading: true,
        error: null,
    });
    const [retryCount, setRetryCount] = useState(0);

    const retryConnection = () => {
        setState(s => ({ ...s, error: null, isLoading: true }));
        setRetryCount(c => c + 1);
    };

    useEffect(() => {
        setState(s => ({ ...s, isLoading: true, error: null }));

        const handleError = (collectionName: string) => (error: any) => {
             console.error(`Firestore error on ${collectionName}:`, error);
            if (error.code === 'permission-denied') {
                setState(s => ({ ...s, error: `Firestore Permission Denied for '${collectionName}'. Please check your Firestore security rules as per the README.md instructions.` }));
            } else {
                setState(s => ({ ...s, error: `An error occurred while fetching data from '${collectionName}': ${error.message}` }));
            }
            setState(s => ({ ...s, isLoading: false }));
        };

        const unsubscribers = [
            firestoreService.onStudentsChange(students => setState(s => ({ ...s, students })), handleError('students')),
            firestoreService.onTeachersChange(teachers => setState(s => ({ ...s, teachers })), handleError('teachers')),
            firestoreService.onUsersChange(users => setState(s => ({ ...s, users })), handleError('users')),
            firestoreService.onFinanceDataChange(financeData => setState(s => ({ ...s, financeData })), handleError('finance')),
            firestoreService.onExpensesChange(expenses => setState(s => ({ ...s, expenses })), handleError('expenses')),
            firestoreService.onAnnouncementsChange(announcements => setState(s => ({ ...s, announcements })), handleError('announcements')),
            firestoreService.onBooksChange(books => setState(s => ({ ...s, books })), handleError('books')),
            firestoreService.onResultsChange(results => setState(s => ({ ...s, results })), handleError('results')),
        ];

        // Give a bit of time for initial data to load
        setTimeout(() => setState(s => {
            // Only set isLoading to false if no error has occurred
            if (s.error === null) {
                return {...s, isLoading: false};
            }
            return s;
        }), 1500);

        return () => unsubscribers.forEach(unsub => unsub());
    }, [retryCount]);
    
    const loadAttendanceForMonth = useCallback(async (year: number, month: number) => {
        const monthKey = `${year}-${month}`;
        
        const handleError = (error: any) => {
            console.error(`Firestore error on attendance:`, error);
            if (error.code === 'permission-denied') {
                setState(s => ({ ...s, error: `Firestore Permission Denied for 'attendance'. Please check your Firestore security rules as per the README.md instructions.` }));
            } else {
                setState(s => ({ ...s, error: `An error occurred while fetching data from 'attendance': ${error.message}` }));
            }
        };
        
        firestoreService.onAttendanceChange(year, month, (data) => {
            setState(s => ({
                ...s,
                attendance: { ...s.attendance, [monthKey]: data }
            }));
        }, handleError);
    }, []);

    const bulkGenerateClassAccounts = async (classNumber: number, usernamePattern: string, passwordPattern: string): Promise<number> => {
        const targetStudents = state.students.filter(s => s.class === classNumber);
        const existingUserEmails = new Set(state.users.map(u => u.email));
        
        const usersToCreate: Omit<UserAccount, 'id'>[] = [];

        targetStudents.forEach(student => {
            if (student.email && !existingUserEmails.has(student.email)) {
                const [firstName, ...lastNameParts] = student.name.split(' ');
                const lastName = lastNameParts.join(' ');

                const replacePlaceholders = (pattern: string) => pattern
                    .replace('{firstName}', firstName.toLowerCase())
                    .replace('{lastName}', lastName.toLowerCase())
                    .replace('{rollNo}', String(student.rollNo))
                    .replace('{class}', String(student.class));

                const newUser: Omit<UserAccount, 'id'> = {
                    fullName: student.name,
                    email: replacePlaceholders(usernamePattern),
                    password: replacePlaceholders(passwordPattern),
                    role: UserRole.Student,
                    status: 'Active',
                    avatar: student.avatar,
                    context: `Class ${student.class} ${student.section}`,
                };
                usersToCreate.push(newUser);
            }
        });

        if (usersToCreate.length > 0) {
            await firestoreService.bulkCreateUsers(usersToCreate);
        }
        return usersToCreate.length;
    };


    const value: AppContextType = {
        ...state,
        retryConnection,
        addStudent: (data) => firestoreService.addStudent(data).then(),
        updateStudent: firestoreService.updateStudent,
        deleteStudent: firestoreService.deleteStudent,
        addTeacher: (data) => firestoreService.addTeacher(data).then(),
        updateTeacher: firestoreService.updateTeacher,
        deleteTeacher: firestoreService.deleteTeacher,
        addUser: (data) => firestoreService.addUser(data).then(),
        updateUser: firestoreService.updateUser,
        deleteUser: firestoreService.deleteUser,
        addFinanceRecord: (data) => firestoreService.addFinanceRecord(data).then(),
        updateFinanceRecord: firestoreService.updateFinanceRecord,
        deleteFinanceRecord: firestoreService.deleteFinanceRecord,
        addExpense: (data) => firestoreService.addExpense(data).then(),
        updateExpense: firestoreService.updateExpense,
        deleteExpense: firestoreService.deleteExpense,
        addAnnouncement: (data) => firestoreService.addAnnouncement(data).then(),
        deleteAnnouncement: firestoreService.deleteAnnouncement,
        addBook: (data) => firestoreService.addBook(data).then(),
        updateBook: firestoreService.updateBook,
        deleteBook: firestoreService.deleteBook,
        addResult: (data) => firestoreService.addResult(data).then(),
        updateResult: firestoreService.updateResult,
        deleteResult: firestoreService.deleteResult,
        upsertAttendance: firestoreService.upsertAttendance,
        loadAttendanceForMonth,
        bulkGenerateClassAccounts,
        bulkUpdateUserStatus: firestoreService.bulkUpdateUserStatus,
        seedAllData: firestoreService.seedAllData,
        seedAttendanceData: firestoreService.seedAttendanceData,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};