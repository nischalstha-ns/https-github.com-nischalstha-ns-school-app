import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, writeBatch, getDoc, onSnapshot } from "firebase/firestore";
import { db, auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Student, Teacher, AttendanceData, AttendanceStatus, FeeCollection, UserAccount, Announcement, Book, UserRole, BulkGenerateAccountsResult } from '../types';
import { 
    STUDENTS as mockStudents, 
    TEACHERS as mockTeachers, 
    FEE_COLLECTION_DATA as mockFinanceData, 
    USERS as mockUsers, 
    ANNOUNCEMENTS as mockAnnouncements, 
    BOOKS as mockBooks 
} from '../constants';

const getCollectionData = <T>(collectionName: string, idField: string = 'id'): Promise<T[]> => {
    return new Promise((resolve, reject) => {
        const q = query(collection(db, collectionName));
        onSnapshot(q, (querySnapshot) => {
            const data: T[] = [];
            querySnapshot.forEach((doc) => {
                data.push({ [idField]: doc.id, ...doc.data() } as T);
            });
            resolve(data);
        }, reject);
    });
};

const addCollectionDoc = async <T>(collectionName: string, data: T) => {
    const docRef = await addDoc(collection(db, collectionName), data);
    return { id: docRef.id };
};

const updateCollectionDoc = (collectionName: string, id: string, data: any) => {
    const docRef = doc(db, collectionName, id);
    return updateDoc(docRef, data);
};

const deleteCollectionDoc = (collectionName: string, id: string) => {
    return deleteDoc(doc(db, collectionName, id));
};

// --- Student Functions ---
export const onStudentsChange = (callback: (students: Student[]) => void) => {
    return onSnapshot(collection(db, 'students'), (snapshot) => {
        const students = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Student));
        callback(students);
    });
};
export const addStudent = (studentData: Omit<Student, 'id'>) => addCollectionDoc('students', studentData);
export const updateStudent = (id: string, studentData: Partial<Omit<Student, 'id'>>) => updateCollectionDoc('students', id, studentData);
export const deleteStudent = (id: string) => deleteCollectionDoc('students', id);

// --- Teacher Functions ---
export const onTeachersChange = (callback: (teachers: Teacher[]) => void) => {
    return onSnapshot(collection(db, 'teachers'), (snapshot) => {
        const teachers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Teacher));
        callback(teachers);
    });
};
export const addTeacher = (teacherData: Omit<Teacher, 'id'>) => addCollectionDoc('teachers', teacherData);
export const updateTeacher = (id: string, teacherData: Partial<Omit<Teacher, 'id'>>) => updateCollectionDoc('teachers', id, teacherData);
export const deleteTeacher = (id: string) => deleteCollectionDoc('teachers', id);

// --- Attendance Functions ---
export const onAttendanceChange = (year: number, month: number, callback: (data: AttendanceData[]) => void) => {
    const q = query(collection(db, 'attendance'), where('monthYear', '==', `${year}-${month}`));
    return onSnapshot(q, (snapshot) => {
        const attendance = snapshot.docs.map(doc => doc.data() as AttendanceData);
        callback(attendance);
    });
};

export const upsertAttendance = async (studentId: string, date: string, status: AttendanceStatus) => {
    const [year, monthNum] = date.split('-').map(Number);
    const month = monthNum - 1;
    const attendanceId = `${studentId}_${date}`;
    const docRef = doc(db, 'attendance', attendanceId);
    return updateDoc(docRef, { studentId, date, status, monthYear: `${year}-${month}` }, { merge: true });
};

// --- Finance Functions ---
export const onFinanceDataChange = (callback: (data: FeeCollection[]) => void) => {
    return onSnapshot(collection(db, 'finance'), (snapshot) => {
        callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FeeCollection)));
    });
};
export const addFinanceRecord = (data: Omit<FeeCollection, 'id'>) => addCollectionDoc('finance', data);
export const updateFinanceRecord = (id: string, data: Partial<Omit<FeeCollection, 'id'>>) => updateCollectionDoc('finance', id, data);
export const deleteFinanceRecord = (id: string) => deleteCollectionDoc('finance', id);

// --- User Account Functions ---
export const onUsersChange = (callback: (users: UserAccount[]) => void) => {
    return onSnapshot(collection(db, 'users'), (snapshot) => {
        callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserAccount)));
    });
};
export const addUser = (data: Omit<UserAccount, 'id'>) => addCollectionDoc('users', data);
export const updateUser = (id: string, data: Partial<Omit<UserAccount, 'id'>>) => updateCollectionDoc('users', id, data);
export const deleteUser = (id: string) => deleteCollectionDoc('users', id);

// --- Announcement Functions ---
export const onAnnouncementsChange = (callback: (data: Announcement[]) => void) => {
    return onSnapshot(query(collection(db, 'announcements')), (snapshot) => {
        const announcements = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Announcement));
        callback(announcements.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    });
};
export const addAnnouncement = (data: Omit<Announcement, 'id'>) => addCollectionDoc('announcements', data);
export const deleteAnnouncement = (id: string) => deleteCollectionDoc('announcements', id);

// --- Library Book Functions ---
export const onBooksChange = (callback: (data: Book[]) => void) => {
    return onSnapshot(collection(db, 'books'), (snapshot) => {
        callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Book)));
    });
};
export const addBook = (data: Omit<Book, 'id'>) => addCollectionDoc('books', data);
export const updateBook = (id: string, data: Partial<Omit<Book, 'id'>>) => updateCollectionDoc('books', id, data);
export const deleteBook = (id: string) => deleteCollectionDoc('books', id);

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
    // Seed non-user collections
    await seedCollection('students', mockStudents);
    await seedCollection('teachers', mockTeachers);
    await seedCollection('finance', mockFinanceData);
    await seedCollection('announcements', mockAnnouncements);
    await seedCollection('books', mockBooks);

    // Custom seeding for users to sync with Firebase Auth
    const collectionName = 'users';
    const mockData = mockUsers;
    
    // 1. Clear existing Firestore user documents
    const collectionRef = collection(db, collectionName);
    const snapshot = await getDocs(collectionRef);
    if (!snapshot.empty) {
        console.log(`Deleting existing data in ${collectionName}...`);
        const deleteBatch = writeBatch(db);
        snapshot.docs.forEach(doc => deleteBatch.delete(doc.ref));
        await deleteBatch.commit();
        console.log(`Existing data in ${collectionName} deleted.`);
    }

    // 2. Iterate through mock users, create Auth user, then Firestore doc
    console.log(`Seeding ${collectionName} and syncing with Firebase Auth...`);
    // Note: We cannot delete auth users from the client SDK. This process is additive.
    // If you need a full reset, you must clear users from the Firebase Auth console.
    for (const userData of mockData) {
        try {
            // Create user in Firebase Authentication
            await createUserWithEmailAndPassword(auth, userData.email, userData.password);
            console.log(`Created Auth user for ${userData.email}`);
        } catch (error: any) {
            if (error.code === 'auth/email-already-in-use') {
                // This is expected if seeding more than once. We can ignore it and continue.
                console.log(`Auth user for ${userData.email} already exists.`);
            } else {
                // Log other auth errors but don't stop the entire seeding process
                console.error(`Error creating Auth user for ${userData.email}:`, error);
            }
        }

        // Create user document in Firestore, omitting the password for security
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