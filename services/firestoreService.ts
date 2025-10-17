import { db } from '../firebaseConfig';
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc, writeBatch, getCountFromServer, query, where, setDoc, limit } from 'firebase/firestore';
import { Student, Teacher, AttendanceData, AttendanceStatus, FeeCollection } from '../types';
import { STUDENTS as mockStudents, TEACHERS as mockTeachers, FEE_COLLECTION_DATA as mockFinanceData } from '../constants';

const studentsCollectionRef = collection(db, 'students');
const teachersCollectionRef = collection(db, 'teachers');
const attendanceCollectionRef = collection(db, 'attendance');
const financeCollectionRef = collection(db, 'finance');


// --- Student Functions ---

export const getStudents = async (): Promise<Student[]> => {
    const data = await getDocs(studentsCollectionRef);
    return data.docs.map(doc => ({ ...doc.data(), id: doc.id } as Student));
};

export const addStudent = async (studentData: Omit<Student, 'id'>) => {
    return await addDoc(studentsCollectionRef, studentData);
};

export const updateStudent = async (id: string, studentData: Partial<Omit<Student, 'id'>>) => {
    const studentDoc = doc(db, 'students', id);
    return await updateDoc(studentDoc, studentData);
};

export const deleteStudent = async (id: string) => {
    const studentDoc = doc(db, 'students', id);
    return await deleteDoc(studentDoc);
};

export const getStudentsCollectionSize = async (): Promise<number> => {
    try {
        const snapshot = await getCountFromServer(studentsCollectionRef);
        return snapshot.data().count;
    } catch (e) {
        console.error("Error getting collection size: ", e);
        // Fallback for environments where getCountFromServer might not be available
        const querySnapshot = await getDocs(studentsCollectionRef);
        return querySnapshot.size;
    }
};

export const seedStudentsDatabase = async () => {
    const size = await getStudentsCollectionSize();
    if (size > 0) {
        console.log("Students collection already has data. Seeding skipped.");
        return;
    }

    console.log("Seeding database with mock student data...");
    const batch = writeBatch(db);
    mockStudents.forEach(student => {
        const docRef = doc(studentsCollectionRef); // Create a new doc with a random ID
        batch.set(docRef, student);
    });

    await batch.commit();
    console.log("Database seeded successfully!");
};

// --- Teacher Functions ---

export const getTeachers = async (): Promise<Teacher[]> => {
    const data = await getDocs(teachersCollectionRef);
    return data.docs.map(doc => ({ ...doc.data(), id: doc.id } as Teacher));
};

export const addTeacher = async (teacherData: Omit<Teacher, 'id'>) => {
    return await addDoc(teachersCollectionRef, teacherData);
};

export const updateTeacher = async (id: string, teacherData: Partial<Omit<Teacher, 'id'>>) => {
    const teacherDoc = doc(db, 'teachers', id);
    return await updateDoc(teacherDoc, teacherData);
};

export const deleteTeacher = async (id: string) => {
    const teacherDoc = doc(db, 'teachers', id);
    return await deleteDoc(teacherDoc);
};

export const getTeachersCollectionSize = async (): Promise<number> => {
    try {
        const snapshot = await getCountFromServer(teachersCollectionRef);
        return snapshot.data().count;
    } catch (e) {
        console.error("Error getting collection size: ", e);
        const querySnapshot = await getDocs(teachersCollectionRef);
        return querySnapshot.size;
    }
};

export const seedTeachersDatabase = async () => {
    const size = await getTeachersCollectionSize();
    if (size > 0) {
        console.log("Teachers collection already has data. Seeding skipped.");
        return;
    }

    console.log("Seeding database with mock teacher data...");
    const batch = writeBatch(db);
    mockTeachers.forEach(teacher => {
        const docRef = doc(teachersCollectionRef);
        batch.set(docRef, teacher);
    });

    await batch.commit();
    console.log("Teachers database seeded successfully!");
};

// --- Attendance Functions ---

export const getAttendance = async (year: number, month: number): Promise<AttendanceData[]> => {
    const monthString = String(month + 1).padStart(2, '0');
    const startDate = `${year}-${monthString}-01`;
    const endDate = `${year}-${monthString}-31`;
    
    const q = query(attendanceCollectionRef, where('date', '>=', startDate), where('date', '<=', endDate));
    const data = await getDocs(q);
    return data.docs.map(doc => ({ ...doc.data(), id: doc.id } as AttendanceData));
};

export const upsertAttendance = async (studentId: string, date: string, status: AttendanceStatus) => {
    const docId = `${studentId}_${date}`;
    const attendanceDocRef = doc(db, 'attendance', docId);
    await setDoc(attendanceDocRef, { studentId, date, status }, { merge: true });
};

export const seedAttendanceDatabase = async (year: number, month: number) => {
    const monthString = String(month + 1).padStart(2, '0');
    const startDate = `${year}-${monthString}-01`;
    const q = query(attendanceCollectionRef, where('date', '>=', startDate), limit(1));
    const existingSnapshot = await getDocs(q);

    if (!existingSnapshot.empty) {
        console.log(`Attendance for ${year}-${monthString} already exists. Seeding skipped.`);
        return;
    }

    const students = await getStudents();
    if (students.length === 0) {
        console.log("No students in the database. Cannot seed attendance.");
        return;
    }

    const batch = writeBatch(db);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    students.forEach(student => {
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateString = date.toISOString().split('T')[0];
            const dayOfWeek = date.getDay();

            let status: AttendanceStatus;

            if (date > today) {
                status = 'Future';
            } else if (dayOfWeek === 0 || dayOfWeek === 6) {
                status = 'Holiday';
            } else {
                status = 'Present';
            }
            
            const docId = `${student.id}_${dateString}`;
            const docRef = doc(db, 'attendance', docId);
            batch.set(docRef, { studentId: student.id, date: dateString, status });
        }
    });

    await batch.commit();
    console.log(`Attendance for ${year}-${monthString} seeded successfully.`);
};

// --- Finance Functions ---

export const getFinanceData = async (): Promise<FeeCollection[]> => {
    const data = await getDocs(financeCollectionRef);
    return data.docs.map(doc => ({ ...doc.data(), id: doc.id } as FeeCollection));
};

export const addFinanceRecord = async (recordData: Omit<FeeCollection, 'id'>) => {
    return await addDoc(financeCollectionRef, recordData);
};

export const updateFinanceRecord = async (id: string, recordData: Partial<Omit<FeeCollection, 'id'>>) => {
    const financeDoc = doc(db, 'finance', id);
    return await updateDoc(financeDoc, recordData);
};

export const deleteFinanceRecord = async (id: string) => {
    const financeDoc = doc(db, 'finance', id);
    return await deleteDoc(financeDoc);
};

export const getFinanceCollectionSize = async (): Promise<number> => {
    try {
        const snapshot = await getCountFromServer(financeCollectionRef);
        return snapshot.data().count;
    } catch (e) {
        console.error("Error getting collection size: ", e);
        const querySnapshot = await getDocs(financeCollectionRef);
        return querySnapshot.size;
    }
};

export const seedFinanceDatabase = async () => {
    const size = await getFinanceCollectionSize();
    if (size > 0) {
        console.log("Finance collection already has data. Seeding skipped.");
        return;
    }

    console.log("Seeding database with mock finance data...");
    const batch = writeBatch(db);
    mockFinanceData.forEach(record => {
        const docRef = doc(financeCollectionRef);
        batch.set(docRef, record);
    });

    await batch.commit();
    console.log("Finance database seeded successfully!");
};