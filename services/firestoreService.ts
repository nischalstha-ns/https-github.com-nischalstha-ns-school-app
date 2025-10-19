import { db, auth } from '../firebaseConfig';
import { Student, Teacher, AttendanceData, AttendanceStatus, FeeCollection, UserAccount, Announcement, Book, UserRole, BulkGenerateAccountsResult, Expense, Result } from '../types';
import { 
    STUDENTS as mockStudents, 
    TEACHERS as mockTeachers, 
    FEE_COLLECTION_DATA as mockFinanceData, 
    USERS as mockUsers, 
    ANNOUNCEMENTS as mockAnnouncements, 
    BOOKS as mockBooks,
    EXPENSES as mockExpenses,
    RESULTS as mockResults
} from '../constants';
// Fix: Use scoped firebase packages for consistency.
import { 
    collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, 
    query, where, setDoc, getDocs, writeBatch, Unsubscribe
} from '@firebase/firestore';
import { createUserWithEmailAndPassword } from '@firebase/auth';

// --- Student Functions ---
// Fix: Changed onSnapshot call to use an observer object to resolve overload ambiguity.
export const onStudentsChange = (callback: (students: Student[]) => void, onError: (error: Error) => void): Unsubscribe => {
    return onSnapshot(collection(db, 'students'), {
        next: (snapshot) => {
            const students = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Student));
            callback(students);
        },
        error: onError
    });
};
export const addStudent = (studentData: Omit<Student, 'id'>) => addDoc(collection(db, 'students'), studentData);
export const updateStudent = (id: string, studentData: Partial<Omit<Student, 'id'>>) => updateDoc(doc(db, 'students', id), studentData);
export const deleteStudent = (id: string) => deleteDoc(doc(db, 'students', id));

// --- Teacher Functions ---
// Fix: Changed onSnapshot call to use an observer object to resolve overload ambiguity.
export const onTeachersChange = (callback: (teachers: Teacher[]) => void, onError: (error: Error) => void): Unsubscribe => {
    return onSnapshot(collection(db, 'teachers'), {
        next: (snapshot) => {
            const teachers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Teacher));
            callback(teachers);
        },
        error: onError
    });
};
export const addTeacher = (teacherData: Omit<Teacher, 'id'>) => addDoc(collection(db, 'teachers'), teacherData);
export const updateTeacher = (id: string, teacherData: Partial<Omit<Teacher, 'id'>>) => updateDoc(doc(db, 'teachers', id), teacherData);
export const deleteTeacher = (id: string) => deleteDoc(doc(db, 'teachers', id));

// --- Attendance Functions ---
// Fix: Changed onSnapshot call to use an observer object to resolve overload ambiguity.
export const onAttendanceChange = (year: number, month: number, callback: (data: AttendanceData[]) => void, onError: (error: Error) => void): Unsubscribe => {
    const q = query(collection(db, 'attendance'), where('monthYear', '==', `${year}-${month}`));
    return onSnapshot(q, {
        next: (snapshot) => {
            const attendance = snapshot.docs.map(doc => doc.data() as AttendanceData);
            callback(attendance);
        },
        error: onError
    });
};

export const upsertAttendance = async (studentId: string, date: string, status: AttendanceStatus) => {
    const [year, monthNum] = date.split('-').map(Number);
    const month = monthNum - 1;
    const attendanceId = `${studentId}_${date}`;
    const docRef = doc(db, 'attendance', attendanceId);
    return setDoc(docRef, { studentId, date, status, monthYear: `${year}-${month}` }, { merge: true });
};

// --- Finance Functions ---
// Fix: Changed onSnapshot call to use an observer object to resolve overload ambiguity.
export const onFinanceDataChange = (callback: (data: FeeCollection[]) => void, onError: (error: Error) => void): Unsubscribe => {
    return onSnapshot(collection(db, 'finance'), {
        next: (snapshot) => {
            callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FeeCollection)));
        },
        error: onError
    });
};
export const addFinanceRecord = (data: Omit<FeeCollection, 'id'>) => addDoc(collection(db, 'finance'), data);
export const updateFinanceRecord = (id: string, data: Partial<Omit<FeeCollection, 'id'>>) => updateDoc(doc(db, 'finance', id), data);
export const deleteFinanceRecord = (id: string) => deleteDoc(doc(db, 'finance', id));

// --- Expense Functions ---
// Fix: Changed onSnapshot call to use an observer object to resolve overload ambiguity.
export const onExpensesChange = (callback: (data: Expense[]) => void, onError: (error: Error) => void): Unsubscribe => {
    return onSnapshot(collection(db, 'expenses'), {
        next: (snapshot) => {
            callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Expense)));
        },
        error: onError
    });
};
export const addExpense = (data: Omit<Expense, 'id'>) => addDoc(collection(db, 'expenses'), data);
export const updateExpense = (id: string, data: Partial<Omit<Expense, 'id'>>) => updateDoc(doc(db, 'expenses', id), data);
export const deleteExpense = (id: string) => deleteDoc(doc(db, 'expenses', id));

// --- User Account Functions ---
// Fix: Changed onSnapshot call to use an observer object to resolve overload ambiguity.
export const onUsersChange = (callback: (users: UserAccount[]) => void, onError: (error: Error) => void): Unsubscribe => {
    return onSnapshot(collection(db, 'users'), {
        next: (snapshot) => {
            callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserAccount)));
        },
        error: onError
    });
};

export const addUser = async (data: Omit<UserAccount, 'id'>) => {
    if (!data.password) {
        throw new Error("Password is required to create a new user account.");
    }
    
    try {
        await createUserWithEmailAndPassword(auth, data.email, data.password);
        const { password, ...firestoreData } = data;
        return addDoc(collection(db, 'users'), firestoreData);
    } catch (error) {
        console.error("Error creating user account:", error);
        throw error;
    }
};
export const updateUser = (id: string, data: Partial<Omit<UserAccount, 'id'>>) => updateDoc(doc(db, 'users', id), data);
export const deleteUser = (id: string) => deleteDoc(doc(db, 'users', id));

// --- Announcement Functions ---
// Fix: Changed onSnapshot call to use an observer object to resolve overload ambiguity.
export const onAnnouncementsChange = (callback: (data: Announcement[]) => void, onError: (error: Error) => void): Unsubscribe => {
    return onSnapshot(collection(db, 'announcements'), {
        next: (snapshot) => {
            const announcements = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Announcement));
            callback(announcements.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        },
        error: onError
    });
};
export const addAnnouncement = (data: Omit<Announcement, 'id'>) => addDoc(collection(db, 'announcements'), data);
export const deleteAnnouncement = (id: string) => deleteDoc(doc(db, 'announcements', id));

// --- Library Book Functions ---
// Fix: Changed onSnapshot call to use an observer object to resolve overload ambiguity.
export const onBooksChange = (callback: (data: Book[]) => void, onError: (error: Error) => void): Unsubscribe => {
    return onSnapshot(collection(db, 'books'), {
        next: (snapshot) => {
            callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Book)));
        },
        error: onError
    });
};
export const addBook = (data: Omit<Book, 'id'>) => addDoc(collection(db, 'books'), data);
export const updateBook = (id: string, data: Partial<Omit<Book, 'id'>>) => updateDoc(doc(db, 'books', id), data);
export const deleteBook = (id: string) => deleteDoc(doc(db, 'books', id));

// --- Result Functions ---
// Fix: Changed onSnapshot call to use an observer object to resolve overload ambiguity.
export const onResultsChange = (callback: (results: Result[]) => void, onError: (error: Error) => void): Unsubscribe => {
    return onSnapshot(collection(db, 'results'), {
        next: (snapshot) => {
            const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Result));
            callback(results);
        },
        error: onError
    });
};
export const addResult = (resultData: Omit<Result, 'id'>) => addDoc(collection(db, 'results'), resultData);
export const updateResult = (id: string, resultData: Partial<Omit<Result, 'id'>>) => updateDoc(doc(db, 'results', id), resultData);
export const deleteResult = (id: string) => deleteDoc(doc(db, 'results', id));

// --- Seeding ---
const seedCollection = async (collectionName: string, mockData: any[]) => {
    const collectionRef = collection(db, collectionName);
    const snapshot = await getDocs(collectionRef);
    if (!snapshot.empty) {
        console.log(`Collection ${collectionName} already has data. Deleting existing data...`);
        const deleteBatch = writeBatch(db);
        snapshot.docs.forEach(doc => deleteBatch.delete(doc.ref));
        await deleteBatch.commit();
        console.log(`Existing data in ${collectionName} deleted.`);
    }

    const addBatch = writeBatch(db);
    mockData.forEach(item => {
        const docRef = doc(collectionRef); // Automatically generate ID
        addBatch.set(docRef, item);
    });
    await addBatch.commit();
    console.log(`Seeded ${mockData.length} documents into ${collectionName}`);
};

export const seedAllData = async () => {
    await seedCollection('students', mockStudents);
    await seedCollection('teachers', mockTeachers);
    await seedCollection('finance', mockFinanceData);
    await seedCollection('announcements', mockAnnouncements);
    await seedCollection('books', mockBooks);
    await seedCollection('expenses', mockExpenses);
    await seedCollection('results', mockResults);

    const collectionName = 'users';
    const mockData = mockUsers;
    
    const collectionRef = collection(db, collectionName);
    const snapshot = await getDocs(collectionRef);
    if (!snapshot.empty) {
        console.log(`Deleting existing data in ${collectionName}...`);
        const deleteBatch = writeBatch(db);
        snapshot.docs.forEach(doc => deleteBatch.delete(doc.ref));
        await deleteBatch.commit();
        console.log(`Existing data in ${collectionName} deleted.`);
    }

    console.log(`Seeding ${collectionName} and syncing with Firebase Auth...`);
    for (const userData of mockData) {
        try {
            await createUserWithEmailAndPassword(auth, userData.email, userData.password as string);
            console.log(`Created Auth user for ${userData.email}`);
        } catch (error: any) {
            if (error.code === 'auth/email-already-in-use') {
                console.log(`Auth user for ${userData.email} already exists.`);
            } else {
                console.error(`Error creating Auth user for ${userData.email}:`, error);
            }
        }

        try {
            const { password, ...firestoreDoc } = userData;
            await addDoc(collection(db, collectionName), firestoreDoc);
        } catch (error) {
            console.error(`Error creating Firestore doc for ${userData.email}:`, error);
        }
    }
    console.log(`Seeding for ${collectionName} complete.`);
};

export const seedAttendanceData = async (year: number, month: number) => {
     const studentsSnapshot = await getDocs(collection(db, 'students'));
    if (studentsSnapshot.empty) {
        console.log("No students to seed attendance for.");
        return;
    }
    
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const batch = writeBatch(db);

    studentsSnapshot.docs.forEach(studentDoc => {
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateString = date.toISOString().split('T')[0];
            const dayOfWeek = date.getDay();
            let status: AttendanceStatus = (dayOfWeek === 0 || dayOfWeek === 6) ? 'Holiday' : date > today ? 'Future' : 'Present';
            
            const attendanceId = `${studentDoc.id}_${dateString}`;
            const docRef = doc(db, 'attendance', attendanceId);
            batch.set(docRef, { studentId: studentDoc.id, date: dateString, status, monthYear: `${year}-${month}` });
        }
    });

    await batch.commit();
};

export const bulkCreateUsers = async (usersToCreate: Omit<UserAccount, 'id'>[]) => {
    const batch = writeBatch(db);
    usersToCreate.forEach(user => {
        const docRef = doc(collection(db, 'users'));
        batch.set(docRef, user);
    });
    await batch.commit();
};

export const bulkUpdateUserStatus = async (userIds: string[], status: 'Active' | 'Inactive') => {
    const batch = writeBatch(db);
    userIds.forEach(id => {
        const docRef = doc(db, 'users', id);
        batch.update(docRef, { status });
    });
    await batch.commit();
};