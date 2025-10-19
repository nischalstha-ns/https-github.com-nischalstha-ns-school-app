import React, { useState, useEffect } from 'react';
import { FeeCollection } from '../types';
import { XIcon } from './icons';

interface FinanceModalProps {
    record: FeeCollection | null;
    onSave: (recordData: Omit<FeeCollection, 'id'> & { id?: string }) => void;
    onClose: () => void;
    isOpen: boolean;
}

const FinanceModal: React.FC<FinanceModalProps> = ({ record, onSave, onClose, isOpen }) => {
    // Fix: Added the missing 'date' property to align with the FeeCollection type.
    const getInitialFormData = (): Omit<FeeCollection, 'id'> => ({
        studentName: '',
        studentId: '',
        avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
        class: '',
        tuitionFee: 0,
        activitiesFee: 0,
        miscellaneousFee: 0,
        totalAmount: 0,
        status: 'Pending',
        date: new Date().toISOString().split('T')[0],
    });

    const [formData, setFormData] = useState<Omit<FeeCollection, 'id'>>(getInitialFormData());

    useEffect(() => {
        if (record) {
            setFormData(record);
        } else {
            setFormData(getInitialFormData());
        }
    }, [record, isOpen]);

    useEffect(() => {
        const total = (formData.tuitionFee || 0) + (formData.activitiesFee || 0) + (formData.miscellaneousFee || 0);
        setFormData(prev => ({ ...prev, totalAmount: total }));
    }, [formData.tuitionFee, formData.activitiesFee, formData.miscellaneousFee]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isNumber = type === 'number';
        setFormData(prev => ({
            ...prev,
            [name]: isNumber ? parseFloat(value) || 0 : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, id: record?.id });
    };

    const inputStyles = "mt-1 block w-full px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent";
    const labelStyles = "block text-sm font-medium text-neutral-700";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl relative max-h-[90vh] flex flex-col">
                <div className="p-6 border-b">
                    <button onClick={onClose} className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600">
                        <XIcon className="w-6 h-6" />
                    </button>
                    <h2 className="text-2xl font-bold text-neutral-900">{record ? 'Edit Fee Record' : 'Add New Fee Record'}</h2>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="studentName" className={labelStyles}>Student Name</label>
                            <input type="text" name="studentName" id="studentName" value={formData.studentName} onChange={handleChange} required className={inputStyles}/>
                        </div>
                        <div>
                            <label htmlFor="studentId" className={labelStyles}>Student ID</label>
                            <input type="text" name="studentId" id="studentId" value={formData.studentId} onChange={handleChange} required className={inputStyles}/>
                        </div>
                    </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <div>
                           <label htmlFor="class" className={labelStyles}>Class</label>
                           <input type="text" name="class" id="class" value={formData.class} onChange={handleChange} required className={inputStyles}/>
                        </div>
                        <div>
                            <label htmlFor="status" className={labelStyles}>Status</label>
                            <select name="status" id="status" value={formData.status} onChange={handleChange} className={inputStyles}>
                                <option value="Paid">Paid</option>
                                <option value="Pending">Pending</option>
                                <option value="Overdue">Overdue</option>
                            </select>
                        </div>
                    </div>
                    <div className="border-t pt-4">
                        <h3 className="text-lg font-medium text-neutral-800">Fee Details</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                             <div>
                                <label htmlFor="tuitionFee" className={labelStyles}>Tuition Fee</label>
                                <input type="number" name="tuitionFee" id="tuitionFee" value={formData.tuitionFee} onChange={handleChange} min="0" required className={inputStyles}/>
                            </div>
                             <div>
                                <label htmlFor="activitiesFee" className={labelStyles}>Activities Fee</label>
                                <input type="number" name="activitiesFee" id="activitiesFee" value={formData.activitiesFee} onChange={handleChange} min="0" required className={inputStyles}/>
                            </div>
                            <div>
                                <label htmlFor="miscellaneousFee" className={labelStyles}>Misc. Fee</label>
                                <input type="number" name="miscellaneousFee" id="miscellaneousFee" value={formData.miscellaneousFee} onChange={handleChange} min="0" required className={inputStyles}/>
                            </div>
                        </div>
                    </div>
                     <div className="text-right pt-4">
                        <p className="text-sm text-neutral-500">Total Amount</p>
                        <p className="text-2xl font-bold text-neutral-900">${formData.totalAmount.toLocaleString()}</p>
                    </div>
                </form>
                <div className="p-6 border-t bg-neutral-50 flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-neutral-100 text-neutral-700 font-semibold rounded-lg hover:bg-neutral-200">Cancel</button>
                    <button type="submit" onClick={handleSubmit} className="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark shadow-sm">Save Record</button>
                </div>
            </div>
        </div>
    );
};

export default FinanceModal;