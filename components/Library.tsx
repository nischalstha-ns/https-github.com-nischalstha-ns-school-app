import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Book } from '../types';
import { SearchIcon, PlusIcon, EditIcon, DeleteIcon } from './icons';
import ConfirmationModal from './ConfirmationModal';
import { getBooks, addBook, updateBook, deleteBook, seedBooksDatabase, getBooksCollectionSize } from '../services/firestoreService';

const LibraryModal: React.FC<{ isOpen: boolean, onClose: () => void, onSave: (book: Omit<Book, 'id'> & { id?: string }) => void, book: Book | null }> = ({ isOpen, onClose, onSave, book }) => {
    // Fix: Widened the type of 'status' to align with the Book type, resolving the type conflict when setting form data for an existing book.
    const getInitialState = () => ({
        title: '', author: '', isbn: '', genre: '', status: 'Available' as 'Available' | 'Issued'
    });
    const [formData, setFormData] = useState(getInitialState());

    useEffect(() => {
        if (book) {
            setFormData({ title: book.title, author: book.author, isbn: book.isbn, genre: book.genre, status: book.status });
        } else {
            setFormData(getInitialState());
        }
    }, [book, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, id: book?.id });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg space-y-4">
                <h3 className="text-lg font-bold text-neutral-800">{book ? 'Edit Book' : 'Add New Book'}</h3>
                <div>
                    <label className="block text-sm font-medium text-neutral-700">Title</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md"/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-neutral-700">Author</label>
                    <input type="text" name="author" value={formData.author} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md"/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-neutral-700">ISBN</label>
                        <input type="text" name="isbn" value={formData.isbn} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-neutral-700">Genre</label>
                        <input type="text" name="genre" value={formData.genre} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md"/>
                    </div>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-neutral-200 text-neutral-800 rounded-md hover:bg-neutral-300">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark">Save Book</button>
                </div>
            </form>
        </div>
    );
};


const Library: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSeeding, setIsSeeding] = useState(false);
    const [isSeedButtonDisabled, setIsSeedButtonDisabled] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'Available' | 'Issued'>('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [bookToDelete, setBookToDelete] = useState<string | null>(null);

    const fetchBooks = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getBooks();
            setBooks(data);
        } catch (error) {
            console.error("Error fetching books:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBooks();
        getBooksCollectionSize().then(size => {
            if (size > 0) setIsSeedButtonDisabled(true);
        });
    }, [fetchBooks]);

    const filteredBooks = useMemo(() => {
        return books.filter(book => {
            const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) || book.author.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = filterStatus === 'all' || book.status === filterStatus;
            return matchesSearch && matchesStatus;
        });
    }, [books, searchTerm, filterStatus]);
    
    const handleSaveBook = async (bookData: Omit<Book, 'id'> & { id?: string }) => {
        const { id, ...data } = bookData;
        if (id) {
            await updateBook(id, data);
        } else {
            await addBook(data);
        }
        fetchBooks();
        setIsModalOpen(false);
    };

    const handleIssueToggle = async (book: Book) => {
        const newStatus = book.status === 'Available' ? 'Issued' : 'Available';
        const updatedData: Partial<Omit<Book, 'id'>> = { status: newStatus };
        if (newStatus === 'Issued') {
            const studentId = prompt("Enter Student ID to issue this book to:", "S-001");
            if (!studentId) return;
            updatedData.issuedTo = studentId;
            updatedData.dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 14 days from now
        } else {
            updatedData.issuedTo = '';
            updatedData.dueDate = '';
        }
        await updateBook(book.id, updatedData);
        fetchBooks();
    };

    const handleAddBook = () => { setSelectedBook(null); setIsModalOpen(true); };
    const handleEditBook = (book: Book) => { setSelectedBook(book); setIsModalOpen(true); };
    const handleDeleteBook = (id: string) => { setBookToDelete(id); setIsConfirmModalOpen(true); };
    
    const confirmDelete = async () => {
        if (bookToDelete) {
            await deleteBook(bookToDelete);
            fetchBooks();
        }
        setIsConfirmModalOpen(false);
        setBookToDelete(null);
    };

     const handleSeedDatabase = async () => {
        setIsSeeding(true);
        try {
            await seedBooksDatabase();
            await fetchBooks();
            setIsSeedButtonDisabled(true);
        } catch (e) { console.error("Failed to seed database:", e); } 
        finally { setIsSeeding(false); }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-3xl font-bold text-neutral-800">Library Management</h1>
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                    <div className="relative flex-grow"><SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" /><input type="text" placeholder="Search title or author..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 w-full border border-neutral-300 rounded-lg"/></div>
                    <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as any)} className="px-3 py-2 border border-neutral-300 rounded-lg text-sm"><option value="all">All Status</option><option value="Available">Available</option><option value="Issued">Issued</option></select>
                    <button onClick={handleAddBook} className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark"><PlusIcon className="w-5 h-5" /> Add Book</button>
                </div>
            </div>
             {!isSeedButtonDisabled && (
                 <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                    <div className="flex"><div className="py-1"><p className="font-bold">Database is Empty</p><p className="text-sm">Click the seed button to populate your Firestore database with initial library books.</p></div><div className="ml-auto pl-3"><button onClick={handleSeedDatabase} disabled={isSeeding || isSeedButtonDisabled} className="px-4 py-2 bg-yellow-400 text-yellow-900 font-semibold rounded-lg hover:bg-yellow-500 disabled:bg-neutral-400"> {isSeeding ? 'Seeding...' : 'Seed Data'}</button></div></div>
                </div>
            )}
            <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
                <table className="w-full text-sm text-left text-neutral-600">
                    <thead className="text-xs text-neutral-700 uppercase bg-neutral-50/80">
                        <tr>
                            {['Title', 'Author', 'ISBN', 'Genre', 'Status', 'Issued To', 'Due Date'].map(h => <th key={h} className="px-6 py-4 font-semibold">{h}</th>)}
                            <th className="px-6 py-4 font-semibold text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (<tr><td colSpan={8} className="text-center p-8">Loading books...</td></tr>) : filteredBooks.map(book => (
                            <tr key={book.id} className="odd:bg-white even:bg-neutral-50/70 border-b last:border-b-0 hover:bg-primary-light/30">
                                <td className="px-6 py-4 font-medium text-neutral-900">{book.title}</td>
                                <td className="px-6 py-4">{book.author}</td><td className="px-6 py-4">{book.isbn}</td><td className="px-6 py-4">{book.genre}</td>
                                <td className="px-6 py-4">
                                    <button onClick={() => handleIssueToggle(book)} className={`px-2 py-1 rounded-full text-xs font-medium ${book.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{book.status}</button>
                                </td>
                                <td className="px-6 py-4">{book.issuedTo || 'N/A'}</td><td className="px-6 py-4">{book.dueDate || 'N/A'}</td>
                                <td className="px-6 py-4"><div className="flex items-center justify-center gap-4"><button onClick={() => handleEditBook(book)} className="text-neutral-500 hover:text-accent-yellow"><EditIcon className="w-5 h-5"/></button><button onClick={() => handleDeleteBook(book.id)} className="text-neutral-500 hover:text-accent-red"><DeleteIcon className="w-5 h-5"/></button></div></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <LibraryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveBook} book={selectedBook} />
            <ConfirmationModal isOpen={isConfirmModalOpen} title="Delete Book" message="Are you sure you want to delete this book from the library?" onConfirm={confirmDelete} onCancel={() => setIsConfirmModalOpen(false)} />
        </div>
    );
};

export default Library;