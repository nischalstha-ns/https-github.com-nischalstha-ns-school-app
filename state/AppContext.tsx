import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import * as firestoreService from '../services/firestoreService';
import { Student, Teacher, UserAccount, UserRole, AttendanceData, FeeCollection, Announcement, Book, AttendanceStatus, BulkGenerateAccountsResult, Expense } from '../types';

interface AppState {
    students: Student[];
    teachers: Teacher[];
    users: UserAccount[];
    attendance: { [key: string]: AttendanceData[] };
    financeData: FeeCollection[];
    expenses: Expense[];
    announcements: Announcement[];
    books: Book[];
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
    bulkGenerateClassAccounts: (classNumber: number, usernamePattern: string, passwordPattern: string) => Promise<number>;
    bulkUpdateUserStatus: (userIds: string[], status: 'Active' | 'Inactive') => Promise<void>;
    seedAllData: () => Promise<void>;
    seedAttendanceData: (year: number, month: number) => Promise<void>;
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
        isLoading: true,
        error: null,
    });

    useEffect(() => {
        setState(s => ({ ...s, isLoading: true }));

        const unsubscribers = [
            firestoreService.onStudentsChange(students => setState(s => ({ ...s, students }))),
            firestoreService.onTeachersChange(teachers => setState(s => ({ ...s, teachers }))),
            firestoreService.onUsersChange(users => setState(s => ({ ...s, users }))),
            firestoreService.onFinanceDataChange(financeData => setState(s => ({ ...s, financeData }))),
            firestoreService.onExpensesChange(expenses => setState(s => ({ ...s, expenses }))),
            firestoreService.onAnnouncementsChange(announcements => setState(s => ({ ...s, announcements }))),
            firestoreService.onBooksChange(books => setState(s => ({ ...s, books }))),
        ];

        // Give a bit of time for initial data to load
        setTimeout(() => setState(s => ({...s, isLoading: false})), 1500);

        return () => unsubscribers.forEach(unsub => unsub());
    }, []);
    
    const loadAttendanceForMonth = useCallback(async (year: number, month: number) => {
        const monthKey = `${year}-${month}`;
        // No need to check if loaded, onSnapshot handles updates
        firestoreService.onAttendanceChange(year, month, (data) => {
            setState(s => ({
                ...s,
                attendance: { ...s.attendance, [monthKey]: data }
            }));
        });
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