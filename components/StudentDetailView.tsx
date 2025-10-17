import React from 'react';
import { Student } from '../types';
import { XIcon, MapPinIcon } from './icons';

interface StudentDetailViewProps {
    student: Student | null;
    onClose: () => void;
    isOpen: boolean;
}

const classDisplayMap: { [key: number]: string } = {
    '-2': 'Nursery',
    '-1': 'LKG',
    '0': 'UKG',
};
const getClassDisplayName = (classNum: number) => classDisplayMap[classNum] || `Class ${classNum}`;


const DetailItem: React.FC<{ label: string; value: React.ReactNode; }> = ({ label, value }) => (
    <div>
        <p className="text-sm text-neutral-500">{label}</p>
        <p className="font-semibold text-neutral-800">{value}</p>
    </div>
);

const StudentDetailView: React.FC<StudentDetailViewProps> = ({ student, onClose, isOpen }) => {
    if (!isOpen || !student) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl relative max-h-[90vh] flex flex-col">
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-neutral-900">Student Details</h2>
                    <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6 space-y-6 overflow-y-auto">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <img src={student.avatar} alt={student.name} className="w-24 h-24 rounded-full border-4 border-primary-light" />
                        <div className="text-center sm:text-left">
                            <h3 className="text-2xl font-bold text-neutral-900">{student.name}</h3>
                            <p className="text-neutral-500">{student.studentId}</p>
                             <span className={`mt-2 inline-block px-3 py-1 rounded-full text-sm font-medium ${
                                student.status === 'Active' ? 'bg-green-100 text-green-800' :
                                student.status === 'Suspended' ? 'bg-red-100 text-red-800' :
                                'bg-neutral-100 text-neutral-800'
                            }`}>
                                {student.status}
                            </span>
                        </div>
                    </div>

                    <div className="border-t border-neutral-200 pt-6">
                         <h4 className="text-lg font-semibold text-neutral-800 mb-4">Academic Information</h4>
                         <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <DetailItem label="Class" value={`${getClassDisplayName(student.class)} - ${student.section}`} />
                            <DetailItem label="Roll Number" value={student.rollNo} />
                            <DetailItem label="Admission Date" value={new Date(student.admissionDate).toLocaleDateString()} />
                            <DetailItem label="Attendance" value={`${student.attendance}%`} />
                         </div>
                    </div>
                    
                    <div className="border-t border-neutral-200 pt-6">
                        <h4 className="text-lg font-semibold text-neutral-800 mb-4">Personal Information</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <DetailItem label="Gender" value={student.gender} />
                            <DetailItem label="Date of Birth" value={new Date(student.dob).toLocaleDateString()} />
                            <DetailItem label="Email Address" value={<a href={`mailto:${student.email}`} className="text-primary hover:underline">{student.email}</a>} />
                        </div>
                         <div className="mt-4 flex items-start gap-4">
                            <MapPinIcon className="w-5 h-5 text-neutral-500 mt-1 flex-shrink-0" />
                            <DetailItem label="Address" value={student.address} />
                         </div>
                    </div>

                    <div className="border-t border-neutral-200 pt-6">
                        <h4 className="text-lg font-semibold text-neutral-800 mb-4">Guardian Information</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <DetailItem label="Parent/Guardian" value={student.parentName} />
                            <DetailItem label="Contact Number" value={<a href={`tel:${student.contact}`} className="text-primary hover:underline">{student.contact}</a>} />
                        </div>
                    </div>

                </div>
                 <div className="p-6 border-t bg-neutral-50 flex justify-end">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark shadow-sm">Close</button>
                </div>
            </div>
        </div>
    );
};

export default StudentDetailView;
