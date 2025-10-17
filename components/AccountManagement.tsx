import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { UserAccount, UserRole } from '../types';
import { SearchIcon, PlusIcon, EditIcon, DeleteIcon, ArrowUpIcon, ArrowDownIcon } from './icons';
import UserAccountModal from './UserAccountModal';
import ConfirmationModal from './ConfirmationModal';
import { getUsers, addUser, updateUser, deleteUser, seedUsersDatabase, getUsersCollectionSize } from '../services/firestoreService';

const AccountManagement: React.FC = () => {
    const [users, setUsers] = useState<UserAccount[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSeeding, setIsSeeding] = useState(false);
    const [isSeedButtonDisabled, setIsSeedButtonDisabled] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof UserAccount; direction: 'ascending' | 'descending' } | null>({ key: 'fullName', direction: 'ascending' });
    const [selectedRole, setSelectedRole] = useState<UserRole | 'all'>('all');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);
    const [userToDelete, setUserToDelete] = useState<string | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const usersFromDb = await getUsers();
            setUsers(usersFromDb);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
        getUsersCollectionSize().then(size => {
            if (size > 0) {
                setIsSeedButtonDisabled(true);
            }
        });
    }, [fetchUsers]);

    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesRole = selectedRole === 'all' || user.role === selectedRole;
            return matchesSearch && matchesRole;
        });
    }, [users, searchTerm, selectedRole]);

    const sortedUsers = useMemo(() => {
        let sortableItems = [...filteredUsers];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [filteredUsers, sortConfig]);

    const paginatedUsers = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return sortedUsers.slice(startIndex, startIndex + itemsPerPage);
    }, [sortedUsers, currentPage]);

    const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);

    const requestSort = (key: keyof UserAccount) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const handleAddUser = () => {
        setSelectedUser(null);
        setIsModalOpen(true);
    };

    const handleEditUser = (user: UserAccount) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleDeleteUser = (id: string) => {
        setUserToDelete(id);
        setIsConfirmModalOpen(true);
    };

    const confirmDelete = async () => {
        if (userToDelete) {
            await deleteUser(userToDelete);
            fetchUsers();
        }
        setIsConfirmModalOpen(false);
        setUserToDelete(null);
    };

    const handleSaveUser = async (userData: Omit<UserAccount, 'id'> & { id?: string }) => {
        const { id, password, ...dataToSave } = userData;

        if (id) {
            // Password is not updated unless provided. In a real app, this logic would be more complex.
            await updateUser(id, dataToSave);
        } else {
            // In a real app, you would hash the password before sending it.
            // For now, we are just saving the user data without the password field.
            await addUser(dataToSave);
        }
        fetchUsers();
        setIsModalOpen(false);
    };

    const handleSeedDatabase = async () => {
        setIsSeeding(true);
        try {
            await seedUsersDatabase();
            await fetchUsers();
            setIsSeedButtonDisabled(true);
        } catch (e) {
            console.error("Failed to seed user database:", e);
        } finally {
            setIsSeeding(false);
        }
    };

    const renderSortArrow = (key: keyof UserAccount) => {
        if (!sortConfig || sortConfig.key !== key) return null;
        return sortConfig.direction === 'ascending' ? <ArrowUpIcon className="w-4 h-4 ml-1 text-neutral-500" /> : <ArrowDownIcon className="w-4 h-4 ml-1 text-neutral-500" />;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-3xl font-bold text-neutral-800">Account Management</h1>
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                    <div className="relative flex-grow">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            className="pl-10 pr-4 py-2 w-full border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <select
                        value={selectedRole}
                        onChange={(e) => { setSelectedRole(e.target.value as UserRole | 'all'); setCurrentPage(1); }}
                        className="px-3 py-2 border border-neutral-300 rounded-lg text-sm text-neutral-600 focus:outline-none focus:ring-1 focus:ring-primary appearance-none pr-8 bg-no-repeat"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em' }}
                    >
                        <option value="all">All Roles</option>
                        {Object.values(UserRole).map(role => <option key={role} value={role}>{role}</option>)}
                    </select>
                    <button onClick={handleAddUser} className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark shadow-sm">
                        <PlusIcon className="w-5 h-5" />
                        <span className="hidden sm:inline">Add User</span>
                    </button>
                </div>
            </div>

            {!isSeedButtonDisabled && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                    <div className="flex items-center">
                        <div className="flex-grow">
                            <p className="font-bold">Database is Empty</p>
                            <p className="text-sm">Click the seed button to populate your Firestore database with initial user accounts.</p>
                        </div>
                        <button onClick={handleSeedDatabase} disabled={isSeeding || isSeedButtonDisabled} className="ml-4 px-4 py-2 bg-yellow-400 text-yellow-900 font-semibold rounded-lg hover:bg-yellow-500 disabled:bg-neutral-400 disabled:cursor-not-allowed">
                            {isSeeding ? 'Seeding...' : 'Seed Database'}
                        </button>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
                <table className="w-full text-sm text-left text-neutral-600">
                    <thead className="text-xs text-neutral-700 uppercase bg-neutral-50/80">
                        <tr>
                            {(['fullName', 'email', 'role', 'status'] as Array<keyof UserAccount>).map((key) => (
                                <th key={key} scope="col" className="px-6 py-4 font-semibold cursor-pointer hover:bg-neutral-100" onClick={() => requestSort(key)}>
                                    <div className="flex items-center gap-1">
                                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                        {renderSortArrow(key)}
                                    </div>
                                </th>
                            ))}
                            <th scope="col" className="px-6 py-4 font-semibold text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan={5} className="text-center p-8 text-neutral-500">Loading users...</td></tr>
                        ) : paginatedUsers.length === 0 ? (
                            <tr><td colSpan={5} className="text-center p-8 text-neutral-500">No users found.</td></tr>
                        ) : (
                            paginatedUsers.map(user => (
                                <tr key={user.id} className="odd:bg-white even:bg-neutral-50/70 border-b border-neutral-200 last:border-b-0 hover:bg-primary-light/30">
                                    <td className="px-6 py-4 font-medium text-neutral-900">
                                        <div className="flex items-center gap-3">
                                            <img src={user.avatar || `https://i.pravatar.cc/150?u=${user.id}`} alt={user.fullName} className="w-10 h-10 rounded-full object-cover"/>
                                            {user.fullName}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4">{user.role}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-4">
                                            <button onClick={() => handleEditUser(user)} className="text-neutral-500 hover:text-accent-yellow"><EditIcon className="w-5 h-5"/></button>
                                            <button onClick={() => handleDeleteUser(user.id)} className="text-neutral-500 hover:text-accent-red"><DeleteIcon className="w-5 h-5"/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between items-center pt-4">
                <span className="text-sm text-neutral-700">
                    Showing <span className="font-semibold">{Math.min((currentPage - 1) * itemsPerPage + 1, sortedUsers.length)}</span> to <span className="font-semibold">{Math.min(currentPage * itemsPerPage, sortedUsers.length)}</span> of <span className="font-semibold">{sortedUsers.length}</span> results
                </span>
                <div className="flex items-center gap-2">
                    <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1 || isLoading} className="px-3 py-1 border rounded-md disabled:opacity-50">Previous</button>
                    <span className="text-sm">{currentPage} / {totalPages || 1}</span>
                    <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages || isLoading} className="px-3 py-1 border rounded-md disabled:opacity-50">Next</button>
                </div>
            </div>

            <UserAccountModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveUser}
                user={selectedUser}
            />
            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onCancel={() => setIsConfirmModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete User Account"
                message="Are you sure you want to delete this user account? This action cannot be undone."
            />
        </div>
    );
};

export default AccountManagement;