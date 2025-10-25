import React from 'react';
import { Result as ResultType, Student, SubjectResult } from '../types';
import { PrintIcon, XIcon } from './icons';

interface ReportCardProps {
    result: ResultType | null;
    student: Student | null;
    onClose: () => void;
}

const schoolInfo = {
    name: 'SchoolHub International Academy',
    logoUrl: 'https://i.imgur.com/puiMAi3.png', // Placeholder logo
    address: '123 Education Lane, Knowledge City, 45678',
    watermarkUrl: 'https://i.imgur.com/puiMAi3.png'
};

const numberToWords = (num: number): string => {
    // Basic implementation for converting number to words
    const a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
    const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    
    // Fix: Type 'string' is not assignable to type 'number'.
    const numAsString = num.toString();
    if (numAsString.length > 9) return 'overflow';
    const n = ('000000000' + numAsString).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return '';
    let str = '';
    str += (parseInt(n[1]) !== 0) ? (a[Number(n[1])] || b[Number(n[1][0])] + ' ' + a[Number(n[1][1])]) + 'crore ' : '';
    str += (parseInt(n[2]) !== 0) ? (a[Number(n[2])] || b[Number(n[2][0])] + ' ' + a[Number(n[2][1])]) + 'lakh ' : '';
    str += (parseInt(n[3]) !== 0) ? (a[Number(n[3])] || b[Number(n[3][0])] + ' ' + a[Number(n[3][1])]) + 'thousand ' : '';
    str += (parseInt(n[4]) !== 0) ? (a[Number(n[4])] || b[Number(n[4][0])] + ' ' + a[Number(n[4][1])]) + 'hundred ' : '';
    str += (parseInt(n[5]) !== 0) ? ((str !== '') ? 'and ' : '') + (a[Number(n[5])] || b[Number(n[5][0])] + ' ' + a[Number(n[5][1])]) : '';
    return str.trim().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

const ReportCard: React.FC<ReportCardProps> = ({ result, student, onClose }) => {
    
    const handlePrint = () => window.print();

    if (!result || !student) return null;

    const getSubjectGrade = (subject: SubjectResult) => {
        const total = subject.theoryMax + subject.practicalMax;
        const obtained = subject.theoryObtained + subject.practicalObtained;
        if (total === 0) return '-';
        const percentage = (obtained / total) * 100;
        if (percentage >= 90) return 'A+';
        if (percentage >= 80) return 'A';
        if (percentage >= 70) return 'B';
        if (percentage >= 60) return 'C';
        if (percentage >= 40) return 'D';
        return 'F';
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-40 flex justify-center items-center p-4 print:p-0 print:bg-white">
            <div className="bg-neutral-100 p-4 rounded-lg no-print">
                <div className="flex justify-end gap-2 mb-2">
                     <button onClick={handlePrint} className="p-2 bg-primary text-white rounded-full hover:bg-primary-dark"><PrintIcon className="w-5 h-5"/></button>
                     <button onClick={onClose} className="p-2 bg-neutral-600 text-white rounded-full hover:bg-neutral-800"><XIcon className="w-5 h-5"/></button>
                </div>
                <div className="print-area bg-white shadow-lg w-[210mm] h-[297mm] p-8 overflow-auto relative">
                     <div className="absolute inset-0 bg-contain bg-center bg-no-repeat opacity-5" style={{backgroundImage: `url(${schoolInfo.watermarkUrl})`}}></div>
                    <header className="flex items-center justify-between border-b-2 border-neutral-800 pb-4">
                        <img src={schoolInfo.logoUrl} alt="School Logo" className="h-24" />
                        <div className="text-right">
                            <h1 className="text-3xl font-bold text-neutral-800">{schoolInfo.name}</h1>
                            <p className="text-neutral-600">{schoolInfo.address}</p>
                            <h2 className="text-2xl font-semibold mt-2">{result.examType} Examination - {new Date(result.date).getFullYear()}</h2>
                        </div>
                    </header>

                    <section className="mt-6">
                        <h3 className="text-xl font-bold text-center bg-neutral-100 p-2">STUDENT'S REPORT CARD</h3>
                        <div className="grid grid-cols-12 gap-x-4 mt-4 border border-neutral-300 p-4">
                            <div className="col-span-10 grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                                <div><strong>Student's Name:</strong> {student.name}</div>
                                <div><strong>Father's Name:</strong> {student.parentName}</div>
                                <div><strong>Class:</strong> {student.class} {student.section}</div>
                                <div><strong>Roll No:</strong> {student.rollNo}</div>
                                <div><strong>Date of Birth:</strong> {new Date(student.dob).toLocaleDateString()}</div>
                            </div>
                            <div className="col-span-2 flex items-center justify-center">
                                <img src={student.avatar} alt="Student Photo" className="w-24 h-24 border-2 border-neutral-300 p-1 object-cover" />
                            </div>
                        </div>
                    </section>
                    
                    <section className="mt-6">
                        <table className="w-full text-sm border-collapse border border-neutral-400">
                            <thead className="bg-neutral-100 font-semibold text-neutral-800 text-center">
                                <tr>
                                    <td rowSpan={2} className="border border-neutral-400 p-2">Subject</td>
                                    <td colSpan={2} className="border border-neutral-400 p-2">Maximum Marks</td>
                                    <td colSpan={3} className="border border-neutral-400 p-2">Marks Obtained</td>
                                    <td rowSpan={2} className="border border-neutral-400 p-2">Grade</td>
                                </tr>
                                <tr>
                                    <td className="border border-neutral-400 p-1">Theory</td><td className="border border-neutral-400 p-1">Practical</td>
                                    <td className="border border-neutral-400 p-1">Theory</td><td className="border border-neutral-400 p-1">Practical</td><td className="border border-neutral-400 p-1">Total</td>
                                </tr>
                            </thead>
                            <tbody>
                                {result.subjects.map(s => (
                                    <tr key={s.name} className="text-center">
                                        <td className="border border-neutral-400 p-2 text-left">{s.name}</td>
                                        <td className="border border-neutral-400 p-2">{s.theoryMax || '-'}</td><td className="border border-neutral-400 p-2">{s.practicalMax || '-'}</td>
                                        <td className="border border-neutral-400 p-2">{s.theoryObtained || '-'}</td><td className="border border-neutral-400 p-2">{s.practicalObtained || '-'}</td>
                                        <td className="border border-neutral-400 p-2 font-semibold">{(s.theoryObtained || 0) + (s.practicalObtained || 0)}</td>
                                        <td className="border border-neutral-400 p-2 font-semibold">{getSubjectGrade(s)}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="font-semibold text-center">
                                <tr>
                                    <td className="border border-neutral-400 p-2 text-right">Total</td>
                                    <td colSpan={4} className="border border-neutral-400 p-2">{result.totalPossibleMarks}</td>
                                    <td className="border border-neutral-400 p-2">{result.totalMarksObtained}</td>
                                    <td className="border border-neutral-400 p-2"></td>
                                </tr>
                            </tfoot>
                        </table>
                    </section>

                    <section className="mt-6 border border-neutral-300 p-4 text-sm">
                        <div className="grid grid-cols-3 gap-4">
                            <div><strong>Total Marks:</strong> {result.totalMarksObtained} / {result.totalPossibleMarks}</div>
                            <div><strong>Percentage:</strong> {result.percentage.toFixed(2)}%</div>
                            <div><strong>Grade:</strong> {result.grade}</div>
                        </div>
                        <div className="mt-2"><strong>Result:</strong> The candidate has <span className="font-bold">{result.status}</span> and obtained Marks {numberToWords(result.totalMarksObtained)}.</div>
                        <div className="mt-2"><strong>Remarks:</strong> {result.remarks || 'N/A'}</div>
                    </section>

                    <footer className="absolute bottom-8 left-8 right-8 text-sm flex justify-between items-end">
                        <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                        <div className="text-center">
                            <div className="border-t-2 border-dotted border-neutral-500 w-48 mt-8"></div>
                            <p>Controller of Examinations</p>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default ReportCard;