import React, { useState, useEffect, useMemo } from 'react';
import { Result, Student, SubjectResult } from '../types';
import { XIcon, PlusIcon, DeleteIcon } from './icons';
import { useAppContext } from '../state/AppContext';

interface ResultModalProps {
    result: Result | null;
    onSave: (resultData: Omit<Result, 'id'> & { id?: string }) => void;
    onClose: () => void;
    isOpen: boolean;
}

const getGradeFromPercentage = (percentage: number): string => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
};

const ResultModal: React.FC<ResultModalProps> = ({ result, onSave, onClose, isOpen }) => {
    const { students } = useAppContext();
    const getInitialFormData = (): Omit<Result, 'id' | 'studentName' | 'class' | 'section' | 'totalMarksObtained' | 'totalPossibleMarks' | 'percentage' | 'grade'> => ({
        studentId: '',
        examType: 'Mid-term',
        date: new Date().toISOString().split('T')[0],
        subjects: [{ name: '', marksObtained: 0, totalMarks: 100 }],
        remarks: '',
    });

    const [formData, setFormData] = useState(getInitialFormData());

    useEffect(() => {
        if (result) {
            setFormData({
                studentId: result.studentId,
                examType: result.examType,
                date: result.date,
                subjects: result.subjects,
                remarks: result.remarks || '',
            });
        } else {
            setFormData(getInitialFormData());
        }
    }, [result, isOpen]);

    const { totalMarksObtained, totalPossibleMarks, percentage, grade } = useMemo(() => {
        const totalMarksObtained = formData.subjects.reduce((sum, s) => sum + (Number(s.marksObtained) || 0), 0);
        const totalPossibleMarks = formData.subjects.reduce((sum, s) => sum + (Number(s.totalMarks) || 0), 0);
        const percentage = totalPossibleMarks > 0 ? (totalMarksObtained / totalPossibleMarks) * 100 : 0;
        const grade = getGradeFromPercentage(percentage);
        return { totalMarksObtained, totalPossibleMarks, percentage, grade };
    }, [formData.subjects]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubjectChange = (index: number, field: keyof SubjectResult, value: string | number) => {
        const newSubjects = [...formData.subjects];
        // Ensure value is treated as a number for marks fields
        const numericValue = typeof value === 'string' ? parseInt(value, 10) || 0 : value;
        newSubjects[index] = { ...newSubjects[index], [field]: field === 'name' ? value : numericValue };
        setFormData(prev => ({ ...prev, subjects: newSubjects }));
    };

    const addSubject = () => {
        setFormData(prev => ({
            ...prev,
            subjects: [...prev.subjects, { name: '', marksObtained: 0, totalMarks: 100 }]
        }));
    };

    const removeSubject = (index: number) => {
        setFormData(prev => ({
            ...prev,
            subjects: formData.subjects.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const selectedStudent = students.find(s => s.id === formData.studentId);
        if (!selectedStudent) {
            alert("Please select a valid student.");
            return;
        }

        const finalData: Omit<Result, 'id'> = {
            ...formData,
            studentName: selectedStudent.name,
            class: selectedStudent.class,
            section: selectedStudent.section,
            totalMarksObtained,
            totalPossibleMarks,
            percentage,
            grade,
        };
        onSave({ ...finalData, id: result?.id });
    };
    
    const inputStyles = "mt-1 block w-full px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent";
    const labelStyles = "block text-sm font-medium text-neutral-700";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl relative max-h-[90vh] flex flex-col">
                <div className="p-6 border-b">
                    <button onClick={onClose} className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600"><XIcon className="w-6 h-6" /></button>
                    <h2 className="text-2xl font-bold text-neutral-900">{result ? 'Edit Result' : 'Add New Result'}</h2>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="studentId" className={labelStyles}>Student</label>
                            <select name="studentId" id="studentId" value={formData.studentId} onChange={handleChange} required className={inputStyles}>
                                <option value="" disabled>Select a student</option>
                                {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.studentId})</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="examType" className={labelStyles}>Exam Type</label>
                            <select name="examType" id="examType" value={formData.examType} onChange={handleChange} required className={inputStyles}>
                                <option value="Unit Test">Unit Test</option>
                                <option value="Mid-term">Mid-term</option>
                                <option value="Final">Final</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="border-t pt-4">
                        <h3 className="text-lg font-medium text-neutral-800 mb-2">Subjects & Marks</h3>
                        <div className="space-y-2">
                            {formData.subjects.map((subject, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <input type="text" placeholder="Subject Name" value={subject.name} onChange={e => handleSubjectChange(index, 'name', e.target.value)} className={inputStyles} />
                                    <input type="number" placeholder="Marks" value={subject.marksObtained} onChange={e => handleSubjectChange(index, 'marksObtained', e.target.value)} className={`${inputStyles} w-24`} />
                                    <span className="text-neutral-500">/</span>
                                    <input type="number" placeholder="Total" value={subject.totalMarks} onChange={e => handleSubjectChange(index, 'totalMarks', e.target.value)} className={`${inputStyles} w-24`} />
                                    <button type="button" onClick={() => removeSubject(index)} className="text-red-500 hover:text-red-700 p-2"><DeleteIcon className="w-5 h-5"/></button>
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={addSubject} className="mt-2 flex items-center gap-2 text-sm font-semibold text-primary hover:underline"><PlusIcon className="w-4 h-4" /> Add Subject</button>
                    </div>

                    <div className="border-t pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                        <div><p className={labelStyles}>Total Obtained</p><p className="font-bold text-lg">{totalMarksObtained}</p></div>
                        <div><p className={labelStyles}>Total Possible</p><p className="font-bold text-lg">{totalPossibleMarks}</p></div>
                        <div><p className={labelStyles}>Percentage</p><p className="font-bold text-lg">{percentage.toFixed(2)}%</p></div>
                        <div><p className={labelStyles}>Grade</p><p className="font-bold text-lg">{grade}</p></div>
                    </div>

                    <div>
                        <label htmlFor="remarks" className={labelStyles}>Remarks (Optional)</label>
                        <textarea name="remarks" id="remarks" value={formData.remarks} onChange={handleChange} rows={2} className={inputStyles}></textarea>
                    </div>
                </form>
                <div className="p-6 border-t bg-neutral-50 flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-neutral-100 text-neutral-700 font-semibold rounded-lg hover:bg-neutral-200">Cancel</button>
                    <button type="submit" onClick={handleSubmit} className="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark shadow-sm">Save Result</button>
                </div>
            </div>
        </div>
    );
};

export default ResultModal;