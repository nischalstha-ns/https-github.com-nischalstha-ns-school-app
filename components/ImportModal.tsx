// Fix: Create the content for the missing ImportModal.tsx file.
// This component provides a modal for uploading and importing data from a CSV file.
import React, { useState, useCallback } from 'react';
import { XIcon, UploadCloudIcon, FileIcon } from './icons';

interface ImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    onImport?: (file: File) => void;
    onSave?: (data: any[]) => void; 
    extractionFunction?: (file: File) => Promise<any[]>;
    templateUrl?: string;
}

const ImportModal: React.FC<ImportModalProps> = ({ 
    isOpen, 
    onClose, 
    title, 
    onImport, 
    onSave, 
    extractionFunction, 
    templateUrl 
}) => {
    const [file, setFile] = useState<File | null>(null);
    const [isDragActive, setIsDragActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [extractedData, setExtractedData] = useState<any[]>([]);

    const useAIWorkflow = !!extractionFunction;

    const resetState = useCallback(() => {
        setFile(null);
        setIsLoading(false);
        setError(null);
        setExtractedData([]);
    }, []);

    const handleClose = () => {
        resetState();
        onClose();
    };

    const handleFileSelect = async (selectedFile: File) => {
        if (useAIWorkflow) {
            resetState();
            setFile(selectedFile);
            setIsLoading(true);

            try {
                const data = await extractionFunction(selectedFile);
                if (data && data.length > 0) {
                    setExtractedData(data);
                } else {
                    setError("No data could be extracted from the file. Please check the file's content and format.");
                }
            } catch (e) {
                setError(e instanceof Error ? e.message : "An unknown error occurred during processing.");
            } finally {
                setIsLoading(false);
            }
        } else {
            setFile(selectedFile);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFileSelect(e.target.files[0]);
        }
    };
    
    const handleDrag = (e: React.DragEvent, active: boolean) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(active);
    };

    const handleDrop = (e: React.DragEvent) => {
        handleDrag(e, false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };
    
    const handlePrimaryAction = () => {
        if (file) {
            if (useAIWorkflow) {
                if (extractedData.length > 0 && onSave) {
                    onSave(extractedData);
                    handleClose();
                }
            } else if (onImport) {
                onImport(file);
                handleClose();
            }
        }
    };

    if (!isOpen) return null;

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="text-center p-12">
                    <svg className="animate-spin h-10 w-10 text-sky-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="mt-4 font-semibold text-gray-700">Analyzing document with Gemini AI...</p>
                    <p className="text-sm text-gray-500">This may take a moment.</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="border-l-4 border-red-400 bg-red-50 p-4">
                    <p className="font-medium text-red-800">Error</p>
                    <p className="mt-2 text-sm text-red-700">{error}</p>
                    <button onClick={resetState} className="mt-2 text-sm font-medium text-red-800 hover:underline">Try another file</button>
                </div>
            );
        }

        if (useAIWorkflow && extractedData.length > 0) {
            return (
                <div>
                    <h3 className="font-semibold text-lg text-gray-800">Extracted Data Preview</h3>
                    <p className="text-sm text-gray-500 mb-2">Please review the extracted data before importing.</p>
                    <div className="overflow-auto border rounded-lg max-h-64">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 sticky top-0">
                                <tr>{Object.keys(extractedData[0]).map(key => <th key={key} className="px-4 py-2 text-left font-medium text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</th>)}</tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {extractedData.map((item, index) => (
                                    <tr key={index}>
                                        {Object.values(item).map((value, i) => <td key={i} className="px-4 py-2 whitespace-nowrap text-gray-700">{String(value)}</td>)}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        }

        return (
            <div>
                 <label 
                    className={`relative border-2 border-dashed rounded-lg p-12 text-center cursor-pointer block ${isDragActive ? 'border-sky-500 bg-sky-50' : 'border-gray-300 bg-gray-50'}`}
                    onDragEnter={(e) => handleDrag(e, true)} onDragLeave={(e) => handleDrag(e, false)} onDragOver={(e) => handleDrag(e, true)} onDrop={handleDrop}>
                    <input type="file" accept=".csv,.xls,.xlsx,.pdf,.png,.jpg,.jpeg,.heic" onChange={handleFileChange} className="hidden" />
                    <UploadCloudIcon className="w-12 h-12 mx-auto text-gray-400" />
                    <p className="mt-4 font-semibold text-sky-600">Drag & drop a file here, or click to select</p>
                    <p className="text-xs text-gray-500 mt-1">{useAIWorkflow ? "Supports: PDF, PNG, JPG, etc." : "Supports: CSV, XLSX"}</p>
                </label>
                {file && !useAIWorkflow && (
                     <div className="border rounded-lg p-3 flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3"><FileIcon className="w-6 h-6 text-gray-500" /><div><p className="font-medium text-sm text-gray-800">{file.name}</p><p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p></div></div><button onClick={() => setFile(null)} className="text-gray-400 hover:text-gray-600"><XIcon className="w-5 h-5" /></button>
                    </div>
                )}
                {templateUrl && <p className="text-sm text-center text-gray-600 mt-4">Need a template?{' '}<a href={templateUrl} download className="font-medium text-sky-600 hover:underline">Download CSV Template</a></p>}
            </div>
        );
    };

    const getPrimaryButtonText = () => {
        if (useAIWorkflow) return `Confirm Import (${extractedData.length})`;
        return "Import Data";
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className={`bg-white rounded-xl shadow-xl w-full ${useAIWorkflow && extractedData.length > 0 ? 'max-w-4xl' : 'max-w-lg'} relative max-h-[90vh] flex flex-col`}>
                <div className="p-6 border-b"><button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><XIcon className="w-6 h-6" /></button><h2 className="text-2xl font-bold text-gray-900">{title}</h2></div>
                <div className="p-6 space-y-4 overflow-y-auto">{renderContent()}</div>
                <div className="p-6 border-t bg-gray-50 flex justify-between items-center">
                    {useAIWorkflow && extractedData.length > 0 && !isLoading ? <button type="button" onClick={resetState} className="text-sm font-medium text-gray-600 hover:text-gray-900">← Upload another file</button> : <div />}
                    <div className="flex justify-end space-x-3 w-full">
                        <button type="button" onClick={handleClose} className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200">Cancel</button>
                        <button type="button" onClick={handlePrimaryAction} disabled={!file || isLoading} className="px-4 py-2 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed">{getPrimaryButtonText()}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImportModal;
