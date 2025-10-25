import React, { useState, useEffect, useMemo } from 'react';
import { Result as ResultType, Student, SubjectResult } from '../types';
import { XIcon, PlusIcon, DeleteIcon } from './icons';
import { useAppContext } from '../state/AppContext';

interface ResultModalProps {
    result: ResultType | null;
    onSave: (resultData: Omit<ResultType, 'id'> & { id?: string }) => void;
    onClose: () => void;
    isOpen: boolean;
}

const getGradeFromPercentage = (percentage: number): string => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 40) return 'D';
    return 'F';
};

const isSubjectPassed = (subject: SubjectResult) => {
    const obtained = (subject.theoryObtained || 0) + (subject.practicalObtained || 0);
    const max = (subject.theoryMax || 0) + (subject.practicalMax || 0);
    return max > 0 ? (obtained / max) >= 0.33 : true;
};

const ResultModal: React.FC<ResultModalProps> = ({ result, onSave, onClose, isOpen }) => {
    const { students } = useAppContext();
    const getInitialFormData = (): Omit<ResultType, 'id' | 'studentName' | 'class' | 'section' | 'totalMarksObtained' | 'totalPossibleMarks' | 'percentage' | 'grade' | 'status'> => ({
        studentId: '',
        examType: 'Mid-term',
        date: new Date().toISOString().split('T')[0],
        subjects: [{ name: '', theoryMax: 100, practicalMax: 0, theoryObtained: 0, practicalObtained: 0 }],
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

    const { totalMarksObtained, totalPossibleMarks, percentage, grade, status } = useMemo(() => {
        const totalMarksObtained = formData.subjects.reduce((sum, s) => sum + (Number(s.theoryObtained) || 0) + (Number(s.practicalObtained) || 0), 0);
        const totalPossibleMarks = formData.subjects.reduce((sum, s) => sum + (Number(s.theoryMax) || 0) + (Number(s.practicalMax) || 0), 0);
        const percentage = totalPossibleMarks > 0 ? (totalMarksObtained / totalPossibleMarks) * 100 : 0;
        const grade = getGradeFromPercentage(percentage);
        const allSubjectsPassed = formData.subjects.every(isSubjectPassed);
        const status: 'Passed' | 'Failed' = percentage >= 40 && allSubjectsPassed ? 'Passed' : 'Failed';
        return { totalMarksObtained, totalPossibleMarks, percentage, grade, status };
    }, [formData.subjects]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubjectChange = (index: number, field: keyof SubjectResult, value: string | number) => {
        const newSubjects = [...formData.subjects];
        const numericValue = typeof value === 'string' ? parseInt(value, 10) || 0 : value;
        newSubjects[index] = { ...newSubjects[index], [field]: field === 'name' ? value : numericValue };
        setFormData(prev => ({ ...prev, subjects: newSubjects }));
    };

    const addSubject = () => setFormData(prev => ({ ...prev, subjects: [...prev.subjects, { name: '', theoryMax: 100, practicalMax: 0, theoryObtained: 0, practicalObtained: 0 }] }));
    const removeSubject = (index: number) => setFormData(prev => ({ ...prev, subjects: prev.subjects.filter((_, i) => i !== index) }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const selectedStudent = students.find(s => s.studentId === formData.studentId);
        if (!selectedStudent) return alert("Please select a valid student.");

        onSave({ ...formData, id: result?.id, studentName: selectedStudent.name, class: selectedStudent.class, section: selectedStudent.section, totalMarksObtained, totalPossibleMarks, percentage, grade, status });
    };
    
    const inputStyles = "block w-full px-2 py-2 bg-neutral-50 border border-neutral-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-primary";
    const labelStyles = "block text-sm font-medium text-neutral-700";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl relative max-h-[90vh] flex flex-col">
                <div className="p-6 border-b"><button onClick={onClose} className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600"><XIcon className="w-6 h-6" /></button><h2 className="text-2xl font-bold text-neutral-900">{result ? 'Edit Result' : 'Add New Result'}</h2></div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="studentId" className={labelStyles}>Student</label>
                            <select name="studentId" id="studentId" value={formData.studentId} onChange={handleChange} required className={`mt-1 ${inputStyles}`}><option value="" disabled>Select a student</option>{students.map(s => <option key={s.id} value={s.studentId}>{s.name} ({s.studentId})</option>)}</select>
                        </div>
                        <div>
                            <label htmlFor="examType" className={labelStyles}>Exam Type</label>
                            <select name="examType" id="examType" value={formData.examType} onChange={handleChange} required className={`mt-1 ${inputStyles}`}><option value="Unit Test">Unit Test</option><option value="Mid-term">Mid-term</option><option value="Final">Final</option></select>
                        </div>
                        <div>
                            <label htmlFor="date" className={labelStyles}>Date</label>
                            <input type="date" name="date" id="date" value={formData.date} onChange={handleChange} required className={`mt-1 ${inputStyles}`} />
                        </div>
                    </div>
                    
                    <div className="border-t pt-4">
                        <h3 className="text-lg font-medium text-neutral-800 mb-2">Subjects & Marks</h3>
                        <div className="space-y-3">
                            <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-center text-neutral-600 px-2">
                                <div className="col-span-3">Subject Name</div><div className="col-span-2">Th. Max</div><div className="col-span-2">Pr. Max</div><div className="col-span-2">Th. Obt.</div><div className="col-span-2">Pr. Obt.</div>
                            </div>
                            {formData.subjects.map((_, index) => (
                                <div key={index} className="grid grid-cols-12 gap-2 items-center">
                                    <input type="text" placeholder="Subject Name" value={formData.subjects[index].name} onChange={e => handleSubjectChange(index, 'name', e.target.value)} className={`${inputStyles} col-span-3`} />
                                    <input type="number" placeholder="Th. Max" value={formData.subjects[index].theoryMax} onChange={e => handleSubjectChange(index, 'theoryMax', e.target.value)} className={`${inputStyles} col-span-2 text-center`} />
                                    <input type="number" placeholder="Pr. Max" value={formData.subjects[index].practicalMax} onChange={e => handleSubjectChange(index, 'practicalMax', e.target.value)} className={`${inputStyles} col-span-2 text-center`} />
                                    <input type="number" placeholder="Th. Obt." value={formData.subjects[index].theoryObtained} onChange={e => handleSubjectChange(index, 'theoryObtained', e.target.value)} className={`${inputStyles} col-span-2 text-center`} />
                                    <input type="number" placeholder="Pr. Obt." value={formData.subjects[index].practicalObtained} onChange={e => handleSubjectChange(index, 'practicalObtained', e.target.value)} className={`${inputStyles} col-span-2 text-center`} />
                                    <button type="button" onClick={() => removeSubject(index)} className="text-red-500 hover:text-red-700 p-2"><DeleteIcon className="w-5 h-5"/></button>
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={addSubject} className="mt-3 flex items-center gap-2 text-sm font-semibold text-primary hover:underline"><PlusIcon className="w-4 h-4" /> Add Subject</button>
                    </div>

                    <div className="border-t pt-4 grid grid-cols-2 sm:grid-cols-5 gap-4 text-center bg-neutral-50 p-4 rounded-lg">
                        <div><p className={labelStyles}>Total Obtained</p><p className="font-bold text-lg">{totalMarksObtained}</p></div>
                        <div><p className={labelStyles}>Total Possible</p><p className="font-bold text-lg">{totalPossibleMarks}</p></div>
                        <div><p className={labelStyles}>Percentage</p><p className="font-bold text-lg">{percentage.toFixed(2)}%</p></div>
                        <div><p className={labelStyles}>Grade</p><p className="font-bold text-lg">{grade}</p></div>
                        <div><p className={labelStyles}>Status</p><p className={`font-bold text-lg ${status === 'Passed' ? 'text-green-600' : 'text-red-600'}`}>{status}</p></div>
                    </div>

                    <div><label htmlFor="remarks" className={labelStyles}>Overall Remarks</label><textarea name="remarks" id="remarks" value={formData.remarks} onChange={handleChange} rows={2} className={`mt-1 ${inputStyles}`}></textarea></div>
                </form>
                <div className="p-6 border-t bg-neutral-50 flex justify-end space-x-3"><button type="button" onClick={onClose} className="px-4 py-2 bg-neutral-200 text-neutral-800 rounded-lg hover:bg-neutral-300">Cancel</button><button type="submit" onClick={handleSubmit} className="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark">Save Result</button></div>
            </div>
        </div>
    );
};

export default ResultModal;