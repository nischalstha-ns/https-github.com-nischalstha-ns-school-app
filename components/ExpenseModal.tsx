import React, { useState, useEffect, useRef } from 'react';
import { Expense } from '../types';
import { XIcon, UploadIcon } from './icons';
import { uploadImage } from '../services/cloudinaryService';

interface ExpenseModalProps {
    record: Expense | null;
    onSave: (recordData: Omit<Expense, 'id'> & { id?: string }) => void;
    onClose: () => void;
    isOpen: boolean;
}

const ExpenseModal: React.FC<ExpenseModalProps> = ({ record, onSave, onClose, isOpen }) => {
    const getInitialFormData = (): Omit<Expense, 'id'> => ({
        description: '',
        category: 'Other',
        date: new Date().toISOString().split('T')[0],
        amount: 0,
        status: 'Pending',
        receiptUrl: '',
    });

    const [formData, setFormData] = useState<Omit<Expense, 'id'>>(getInitialFormData());
    const [receiptFile, setReceiptFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (record) {
            setFormData(record);
        } else {
            setFormData(getInitialFormData());
        }
        setReceiptFile(null);
    }, [record, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isNumber = type === 'number';
        setFormData(prev => ({
            ...prev,
            [name]: isNumber ? parseFloat(value) || 0 : value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setReceiptFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let finalData = { ...formData };
        if (receiptFile) {
            setIsUploading(true);
            try {
                const imageUrl = await uploadImage(receiptFile);
                finalData.receiptUrl = imageUrl;
            } catch (error) {
                alert(`Receipt upload failed: ${error instanceof Error ? error.message : String(error)}`);
                setIsUploading(false);
                return;
            }
            setIsUploading(false);
        }
        onSave({ ...formData, id: record?.id });
    };

    const inputStyles = "mt-1 block w-full px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent";
    const labelStyles = "block text-sm font-medium text-neutral-700";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg relative max-h-[90vh] flex flex-col">
                <div className="p-6 border-b">
                    <button onClick={onClose} className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600">
                        <XIcon className="w-6 h-6" />
                    </button>
                    <h2 className="text-2xl font-bold text-neutral-900">{record ? 'Edit Expense' : 'Add New Expense'}</h2>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                    <div>
                        <label htmlFor="description" className={labelStyles}>Description</label>
                        <input type="text" name="description" id="description" value={formData.description} onChange={handleChange} required className={inputStyles}/>
                    </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                           <label htmlFor="category" className={labelStyles}>Category</label>
                           <select name="category" id="category" value={formData.category} onChange={handleChange} className={inputStyles}>
                                <option value="Salaries">Salaries</option>
                                <option value="Utilities">Utilities</option>
                                <option value="Supplies">Supplies</option>
                                <option value="Maintenance">Maintenance</option>
                                <option value="Other">Other</option>
                           </select>
                        </div>
                        <div>
                            <label htmlFor="amount" className={labelStyles}>Amount ($)</label>
                            <input type="number" name="amount" id="amount" value={formData.amount} onChange={handleChange} min="0" required className={inputStyles}/>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="date" className={labelStyles}>Date</label>
                            <input type="date" name="date" id="date" value={formData.date} onChange={handleChange} required className={inputStyles}/>
                        </div>
                        <div>
                            <label htmlFor="status" className={labelStyles}>Status</label>
                            <select name="status" id="status" value={formData.status} onChange={handleChange} className={inputStyles}>
                                <option value="Paid">Paid</option>
                                <option value="Pending">Pending</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className={labelStyles}>Attach Receipt</label>
                        <div className="mt-1 flex items-center gap-4">
                            <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-3 py-2 bg-white border border-neutral-300 text-neutral-700 text-sm font-semibold rounded-lg hover:bg-neutral-50">
                                <UploadIcon className="w-4 h-4"/>
                                {receiptFile ? 'Change File' : 'Upload File'}
                            </button>
                            {receiptFile && <span className="text-sm text-neutral-600">{receiptFile.name}</span>}
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*,.pdf" className="hidden" />
                        </div>
                         {formData.receiptUrl && !receiptFile && <div className="mt-2 text-sm">Current receipt: <a href={formData.receiptUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">View</a></div>}
                    </div>
                </form>
                <div className="p-6 border-t bg-neutral-50 flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-neutral-100 text-neutral-700 font-semibold rounded-lg hover:bg-neutral-200">Cancel</button>
                    <button type="submit" onClick={handleSubmit} disabled={isUploading} className="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark shadow-sm disabled:bg-neutral-400">
                        {isUploading ? 'Uploading...' : 'Save Expense'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExpenseModal;