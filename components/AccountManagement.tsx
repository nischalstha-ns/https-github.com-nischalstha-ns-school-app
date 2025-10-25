import React, { useState, useMemo, useEffect } from 'react';
// Fix: Import the Student type to properly type component props.
import { UserAccount, UserRole, Student } from '../types';
import { SearchIcon, PlusIcon, EditIcon, ArrowUpIcon, ArrowDownIcon, UsersIcon, KeyIcon, UserXIcon, UserCheckIcon, DeleteIcon } from './icons';
import UserAccountModal from './UserAccountModal';
import ConfirmationModal from './ConfirmationModal';
import { useAppContext } from '../state/AppContext';
import { useAuth } from '../state/AuthContext';

const classDisplayMap: { [key: number]: string } = { '-2': 'Nursery', '-1': 'LKG', '0': 'UKG' };
const getClassDisplayName = (classNum: number) => classDisplayMap[classNum] || `Class ${classNum}`;

const AccountManagement: React.FC = () => {
    const { user: currentUser } = useAuth();
    const { users, students, isLoading, addUser, updateUser, deleteUser, bulkGenerateClassAccounts, seedAllData, bulkUpdateUserStatus } = useAppContext();

    const [isSeeding, setIsSeeding] = useState(false);
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof UserAccount; direction: 'ascending' | 'descending' } | null>({ key: 'fullName', direction: 'ascending' });
    const [selectedRole, setSelectedRole] = useState<UserRole | 'all'>('all');
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [confirmationProps, setConfirmationProps] = useState({ title: '', message: '', onConfirm: () => {} });

    const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const { totalUsers, classesCovered, dbStatus } = useMemo(() => {
        const uniqueClasses = new Set(students.map(s => s.class));
        return { totalUsers: users.length, classesCovered: uniqueClasses.size, dbStatus: users.length > 0 ? 'Active' : 'Empty' };
    }, [users, students]);

    const filteredUsers = useMemo(() => {
        return users.filter(user => (user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase())) && (selectedRole === 'all' || user.role === selectedRole));
    }, [users, searchTerm, selectedRole]);

    const sortedUsers = useMemo(() => {
        let sortableItems = [...filteredUsers];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                const valA = a[sortConfig.key] || '';
                const valB = b[sortConfig.key] || '';
                if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }
        return sortableItems;
    }, [filteredUsers, sortConfig]);

    const paginatedUsers = useMemo(() => sortedUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage), [sortedUsers, currentPage]);
    const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);

    const requestSort = (key: keyof UserAccount) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig?.key === key && sortConfig.direction === 'ascending') direction = 'descending';
        setSortConfig({ key, direction });
    };

    const handleAction = (action: () => void, title: string, message: string) => {
        setConfirmationProps({ title, message, onConfirm: action });
        setIsConfirmModalOpen(true);
    };
    
    const handleToggleStatus = (user: UserAccount) => handleAction(
        () => updateUser(user.id, { status: user.status === 'Active' ? 'Inactive' : 'Active' }),
        `${user.status === 'Active' ? 'Deactivate' : 'Activate'} User`,
        `Are you sure you want to ${user.status === 'Active' ? 'deactivate' : 'activate'} this user?`
    );
    
    const handleDeleteUser = (user: UserAccount) => handleAction(
        () => deleteUser(user.id),
        'Delete User',
        `Are you sure you want to permanently delete ${user.fullName}? This cannot be undone.`
    );
    
    const handleSaveUser = async (userData: Omit<UserAccount, 'id'> & { id?: string }) => {
        const { id, ...dataToSave } = userData;
        try {
            if (id) {
                await updateUser(id, dataToSave);
            } else {
                await addUser(dataToSave);
            }
            setIsModalOpen(false);
        } catch (error: any) {
            console.error("Failed to save user:", error);
            alert(`Failed to create user: ${error.message}`);
        }
    };
    
    const handleBulkStatusUpdate = (status: 'Active' | 'Inactive') => handleAction(
        async () => { await bulkUpdateUserStatus(selectedUsers, status); setSelectedUsers([]); },
        `Bulk ${status === 'Active' ? 'Activation' : 'Deactivation'}`,
        `Are you sure you want to ${status === 'Active' ? 'activate' : 'deactivate'} ${selectedUsers.length} selected users?`
    );

    useEffect(() => { setSelectedUsers([]) }, [searchTerm, selectedRole]);
    
    if (currentUser?.role !== UserRole.Admin) {
        return <div className="p-8 text-center bg-white rounded-lg shadow-sm"><h2 className="text-xl font-bold text-red-600">Access Denied</h2><p className="text-neutral-600 mt-2">You do not have permission to view this page.</p></div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-neutral-800">Account Management Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard title="Database Status" value={dbStatus} />
                <StatCard title="Total User Accounts" value={totalUsers.toString()} />
                <StatCard title="Classes with Students" value={classesCovered.toString()} />
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="relative w-full md:w-auto md:flex-grow">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                        <input type="text" placeholder="Search by Name or Email…" value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }} className="pl-10 pr-4 py-2 w-full border border-neutral-300 rounded-lg"/>
                    </div>
                    {selectedUsers.length > 0 ? (
                        <div className="flex items-center gap-2">
                             <span className="text-sm font-semibold">{selectedUsers.length} selected</span>
                             <button onClick={() => handleBulkStatusUpdate('Active')} className="px-3 py-1.5 bg-green-100 text-green-700 text-xs font-semibold rounded-md">Activate</button>
                             <button onClick={() => handleBulkStatusUpdate('Inactive')} className="px-3 py-1.5 bg-red-100 text-red-700 text-xs font-semibold rounded-md">Deactivate</button>
                             <button onClick={() => setSelectedUsers([])} className="px-3 py-1.5 bg-neutral-100 text-neutral-700 text-xs font-semibold rounded-md">Clear</button>
                        </div>
                    ) : (
                        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                            <select value={selectedRole} onChange={e => { setSelectedRole(e.target.value as any); setCurrentPage(1); }} className="px-3 py-2 border border-neutral-300 rounded-lg text-sm bg-no-repeat" style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em' }}>
                                <option value="all">All Roles</option>{Object.values(UserRole).map(role => <option key={role} value={role}>{role}</option>)}
                            </select>
                            <button onClick={() => { setSelectedUser(null); setIsModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-semibold rounded-lg"><PlusIcon className="w-5 h-5" /> Add User</button>
                            <button onClick={() => setIsBulkModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white font-semibold rounded-lg"><UsersIcon className="w-5 h-5" /> Bulk Generate</button>
                        </div>
                    )}
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-neutral-600">
                        <thead className="text-xs text-neutral-700 uppercase bg-neutral-50/80">
                            <tr>
                                <th scope="col" className="p-4"><input type="checkbox" className="rounded" onChange={e => setSelectedUsers(e.target.checked ? paginatedUsers.map(u => u.id) : [])} checked={selectedUsers.length > 0 && selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0} /></th>
                                {(['fullName', 'email', 'role', 'context', 'status'] as Array<keyof UserAccount>).map(key => (
                                    <th key={key} scope="col" className={`px-6 py-4 font-semibold cursor-pointer ${key === 'email' || key === 'context' ? 'hidden md:table-cell' : ''}`} onClick={() => requestSort(key)}>
                                        <div className="flex items-center gap-1">{key === 'context' ? 'Class/Dept' : key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} {sortConfig?.key === key ? (sortConfig.direction === 'ascending' ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />) : null}</div>
                                    </th>
                                ))}
                                <th scope="col" className="px-6 py-4 font-semibold text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (<tr><td colSpan={7} className="text-center p-8">Loading users...</td></tr>) : paginatedUsers.map(user => (
                                <tr key={user.id} className="border-b last:border-b-0 hover:bg-primary-light/30">
                                    <td className="p-4"><input type="checkbox" className="rounded" checked={selectedUsers.includes(user.id)} onChange={e => setSelectedUsers(e.target.checked ? [...selectedUsers, user.id] : selectedUsers.filter(id => id !== user.id))} /></td>
                                    <td className="px-6 py-4 font-medium"><div className="flex items-center gap-3"><img src={user.avatar} alt={user.fullName} className="w-10 h-10 rounded-full object-cover"/>{user.fullName}</div></td>
                                    <td className="px-6 py-4 hidden md:table-cell">{user.email}</td><td className="px-6 py-4">{user.role}</td><td className="px-6 py-4 hidden md:table-cell">{user.context}</td>
                                    <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{user.status}</span></td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-1">
                                            <button onClick={() => { setSelectedUser(user); setIsModalOpen(true); }} className="p-1.5 r-md text-neutral-500 hover:text-accent-yellow"><EditIcon className="w-5 h-5"/></button>
                                            <button onClick={() => handleToggleStatus(user)} className="p-1.5 r-md text-neutral-500">{user.status === 'Active' ? <UserXIcon className="w-5 h-5"/> : <UserCheckIcon className="w-5 h-5"/>}</button>
                                            <button onClick={() => handleDeleteUser(user)} className="p-1.5 r-md text-neutral-500 hover:text-red-600"><DeleteIcon className="w-5 h-5"/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-between items-center pt-4">
                    <span className="text-sm">Showing {Math.min((currentPage - 1) * itemsPerPage + 1, sortedUsers.length)} to {Math.min(currentPage * itemsPerPage, sortedUsers.length)} of {sortedUsers.length}</span>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 border rounded-md disabled:opacity-50">Prev</button>
                        <span>{currentPage} / {totalPages || 1}</span>
                        <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1 border rounded-md disabled:opacity-50">Next</button>
                    </div>
                </div>
            </div>
            
            <BulkGenerateModal isOpen={isBulkModalOpen} onClose={() => setIsBulkModalOpen(false)} students={students} onGenerate={bulkGenerateClassAccounts} />
            <UserAccountModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveUser} user={selectedUser}/>
            <ConfirmationModal isOpen={isConfirmModalOpen} onCancel={() => setIsConfirmModalOpen(false)} {...confirmationProps}/>
        </div>
    );
};

const StatCard: React.FC<{ title: string; value: string; }> = ({ title, value }) => (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-neutral-200/80">
        <p className="text-sm text-neutral-500">{title}</p><p className="font-bold text-2xl text-neutral-800">{value}</p>
    </div>
);

const BulkGenerateModal: React.FC<{isOpen: boolean; onClose: () => void; students: Student[]; onGenerate: (c: number, u: string, p: string) => Promise<{ success: number; failed: number; errors: string[] }>;}> = ({ isOpen, onClose, students, onGenerate }) => {
    const [selectedClass, setSelectedClass] = useState<number | ''>('');
    const [usernamePattern, setUsernamePattern] = useState('{firstName}.{rollNo}');
    const [passwordPattern, setPasswordPattern] = useState('pass@{rollNo}{class}');
    const [isGenerating, setIsGenerating] = useState(false);
    
    // Fix: Explicitly type sort parameters to ensure correct type inference.
    const uniqueClasses = [...new Set(students.map(s => s.class))].sort((a: number, b: number) => a - b);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedClass === '') return;
        setIsGenerating(true);
        try {
            const result = await onGenerate(selectedClass, usernamePattern, passwordPattern);
            let alertMessage = `${result.success} new student accounts were created successfully for ${getClassDisplayName(selectedClass)}.`;
            if (result.failed > 0) {
                const errorDetails = result.errors.slice(0, 3).join('\n');
                alertMessage += `\n\n${result.failed} accounts failed to create.\nCommon Errors:\n${errorDetails}`;
                console.error("Bulk generation errors:", result.errors);
            }
            alert(alertMessage);
            if (result.success > 0) {
                onClose();
            }
        } catch (err) {
            console.error("An unexpected error occurred during bulk generation:", err);
            alert("An unexpected error occurred. Please check the console for details.");
        } finally {
            setIsGenerating(false);
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
                <h3 className="text-lg font-bold">Bulk Generate Class Accounts</h3>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div>
                        <label>Select Class</label>
                        <select value={selectedClass} onChange={e => setSelectedClass(Number(e.target.value))} required className="mt-1 w-full p-2 border rounded">
                            <option value="" disabled>--Select a class--</option>
                            {/* Fix: Explicitly type parameter 'c' to 'number' to prevent type inference issues. */}
                            {uniqueClasses.map((c: number) => <option key={c} value={c}>{getClassDisplayName(c)}</option>)}
                        </select>
                    </div>
                    <div>
                        <label>Username Pattern</label>
                        <input type="text" value={usernamePattern} onChange={e => setUsernamePattern(e.target.value)} required className="mt-1 w-full p-2 border rounded" />
                    </div>
                    <div>
                        <label>Password Pattern</label>
                        <input type="text" value={passwordPattern} onChange={e => setPasswordPattern(e.target.value)} required className="mt-1 w-full p-2 border rounded" />
                        <p className="text-xs text-neutral-500 mt-1">Placeholders: {"{firstName}, {lastName}, {rollNo}, {class}"}</p>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-neutral-200 rounded">Cancel</button>
                        <button type="submit" disabled={isGenerating} className="px-4 py-2 bg-primary text-white rounded disabled:bg-neutral-400">{isGenerating ? 'Generating...' : 'Generate'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AccountManagement;