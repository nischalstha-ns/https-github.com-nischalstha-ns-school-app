import React, { useState, useEffect } from 'react';
import { Student } from '../types';
import { XIcon } from './icons';

interface StudentModalProps {
    student: Student | null;
    onSave: (studentData: Omit<Student, 'id'> & { id?: number }) => void;
    onClose: () => void;
    isOpen: boolean;
}

const StudentModal: React.FC<StudentModalProps> = ({ student, onSave, onClose, isOpen }) => {
    const [formData, setFormData] = useState<Omit<Student, 'id'>>({
        studentId: '',
        rollNo: 0,
        name: '',
        avatar: '',
        class: 1,
        section: 'A',
        gender: 'Male',
        parentName: '',
        contact: '',
        admissionDate: new Date().toISOString().split('T')[0],
        status: 'Active',
        email: '',
        attendance: 100,
    });

    useEffect(() => {
        if (student) {
            setFormData({
                studentId: student.studentId,
                rollNo: student.rollNo,
                name: student.name,
                avatar: student.avatar,
                class: student.class,
                section: student.section,
                gender: student.gender,
                parentName: student.parentName,
                contact: student.contact,
                admissionDate: student.admissionDate,
                status: student.status,
                email: student.email,
                attendance: student.attendance,
            });
        } else {
            setFormData({
                studentId: `S-${Math.floor(1000 + Math.random() * 9000)}`,
                rollNo: 0,
                name: '',
                avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
                class: 1,
                section: 'A',
                gender: 'Male',
                parentName: '',
                contact: '',
                admissionDate: new Date().toISOString().split('T')[0],
                status: 'Active',
                email: '',
                attendance: 100,
            });
        }
    }, [student, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isNumber = type === 'number';
        setFormData(prev => ({
            ...prev,
            [name]: isNumber ? parseInt(value, 10) || 0 : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, id: student?.id });
    };

    const inputStyles = "mt-1 block w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
    const labelStyles = "block text-sm font-medium text-gray-700";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl relative max-h-[90vh] flex flex-col">
                <div className="p-6 border-b">
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                        <XIcon className="w-6 h-6" />
                    </button>
                    <h2 className="text-2xl font-bold text-gray-900">{student ? 'Edit Student' : 'Add New Student'}</h2>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className={labelStyles}>Full Name</label>
                            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className={inputStyles}/>
                        </div>
                        <div>
                            <label htmlFor="email" className={labelStyles}>Email Address</label>
                            <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className={inputStyles}/>
                        </div>
                    </div>
                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                           <label htmlFor="class" className={labelStyles}>Class</label>
                           <input type="number" name="class" id="class" value={formData.class} onChange={handleChange} min="1" max="12" required className={inputStyles}/>
                        </div>
                         <div>
                           <label htmlFor="section" className={labelStyles}>Section</label>
                           <select name="section" id="section" value={formData.section} onChange={handleChange} className={inputStyles}>
                               <option value="A">A</option>
                               <option value="B">B</option>
                               <option value="C">C</option>
                           </select>
                        </div>
                        <div>
                            <label htmlFor="rollNo" className={labelStyles}>Roll No.</label>
                            <input type="number" name="rollNo" id="rollNo" value={formData.rollNo} onChange={handleChange} required className={inputStyles}/>
                        </div>
                    </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="parentName" className={labelStyles}>Parent/Guardian Name</label>
                            <input type="text" name="parentName" id="parentName" value={formData.parentName} onChange={handleChange} required className={inputStyles}/>
                        </div>
                         <div>
                            <label htmlFor="contact" className={labelStyles}>Parent Contact</label>
                            <input type="tel" name="contact" id="contact" value={formData.contact} onChange={handleChange} required className={inputStyles}/>
                        </div>
                    </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="gender" className={labelStyles}>Gender</label>
                            <select name="gender" id="gender" value={formData.gender} onChange={handleChange} className={inputStyles}>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="admissionDate" className={labelStyles}>Admission Date</label>
                            <input type="date" name="admissionDate" id="admissionDate" value={formData.admissionDate} onChange={handleChange} required className={inputStyles}/>
                        </div>
                    </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <div>
                            <label htmlFor="status" className={labelStyles}>Status</label>
                            <select name="status" id="status" value={formData.status} onChange={handleChange} className={inputStyles}>
                                <option value="Active">Active</option>
                                <option value="Suspended">Suspended</option>
                                <option value="Graduated">Graduated</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="attendance" className={labelStyles}>Attendance (%)</label>
                            <input type="number" name="attendance" id="attendance" value={formData.attendance} onChange={handleChange} min="0" max="100" required className={inputStyles}/>
                        </div>
                    </div>
                </form>
                <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200">Cancel</button>
                    <button type="button" onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 shadow-sm">Save Student</button>
                </div>
            </div>
        </div>
    );
};

export default StudentModal;