import Modal from '@/Components/Modal';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function UsersIndex({ users, filters = {}, isSuperAdmin, isAdmin }) {
    const roleLabel = isSuperAdmin ? 'Users in system' : 'Users under your management';
    const [search, setSearch] = useState(filters.search || '');
    const [role, setRole] = useState(filters.role || '');
    const [status, setStatus] = useState(filters.status || '');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [userForm, setUserForm] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'user',
        status: 'active',
        avatar: null,
    });
    const [userErrors, setUserErrors] = useState({});

    const buildQuery = (extra = {}) => ({
        search: search || undefined,
        role: role || undefined,
        status: status || undefined,
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
        ...extra,
    });

    const getInitials = (name) => {
        const parts = String(name || '').trim().split(/\s+/).filter(Boolean);

        if (parts.length === 0) {
            return 'U';
        }

        if (parts.length === 1) {
            return parts[0][0]?.toUpperCase() || 'U';
        }

        return `${parts[0][0]?.toUpperCase() || ''}${parts[parts.length - 1][0]?.toUpperCase() || ''}`;
    };

    const toggleStatus = (user) => {
        const nextStatus = user.status === 'active' ? 'suspended' : 'active';

        router.patch(route('users.status', user.id), {
            status: nextStatus,
        }, {
            preserveScroll: true,
        });
    };

    const deleteUser = (user) => {
        if (confirm(`Delete user ${user.name}?`)) {
            router.delete(route('users.destroy', user.id), {
                preserveScroll: true,
            });
        }
    };

    const handleSort = (column) => {
        const nextDirection = filters.sort === column && filters.direction === 'asc' ? 'desc' : 'asc';

        router.get(route('users.index'), {
            ...buildQuery({
                sort: column,
                direction: nextDirection,
                page: 1,
            }),
        }, {
            preserveScroll: true,
            replace: true,
        });
    };

    const applyFilters = (event) => {
        event.preventDefault();

        router.get(route('users.index'), buildQuery({ page: 1 }), {
            preserveScroll: true,
            replace: true,
        });
    };

    const resetFilters = () => {
        setSearch('');
        setRole('');
        setStatus('');
        setDateFrom('');
        setDateTo('');

        router.get(route('users.index'), { page: 1 }, {
            preserveScroll: true,
            replace: true,
        });
    };

    const renderSortIndicator = (column) => {
        if (filters.sort !== column) {
            return '↕';
        }

        return filters.direction === 'asc' ? '↑' : '↓';
    };

    const handleUserFormChange = (event) => {
        const { name, value, type, files } = event.target;

        setUserForm((current) => ({
            ...current,
            [name]: type === 'file' ? (files?.[0] ?? null) : value,
        }));
    };

    const submitCreateUser = (event) => {
        event.preventDefault();

        const payload = new FormData();
        payload.append('name', userForm.name);
        payload.append('email', userForm.email);
        payload.append('password', userForm.password);
        payload.append('password_confirmation', userForm.password_confirmation);
        payload.append('role', userForm.role);
        payload.append('status', userForm.status);

        if (userForm.avatar) {
            payload.append('avatar', userForm.avatar);
        }

        router.post(route('users.store'), payload, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setShowCreateModal(false);
                setUserForm({
                    name: '',
                    email: '',
                    password: '',
                    password_confirmation: '',
                    role: 'user',
                    status: 'active',
                    avatar: null,
                });
                setUserErrors({});
            },
            onError: (errors) => setUserErrors(errors),
        });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-gray-800">{roleLabel}</h2>}
        >
            <Head title="Users" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="rounded bg-white p-6 shadow-sm">
                        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">Users</h3>
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(true)}
                                    className="rounded bg-indigo-600 px-3 py-2 text-xs font-medium text-white hover:bg-indigo-700"
                                >
                                    New User
                                </button>
                                <Link href={route('dashboard')} className="text-sm text-indigo-600">
                                    Dashboard
                                </Link>
                                <Link href={route('users.trash')} className="rounded bg-amber-500 px-3 py-2 text-xs font-medium text-white hover:bg-amber-600">
                                    Trash/Archive
                                </Link>
                            </div>
                        </div>

                        <form onSubmit={applyFilters} className="mb-4 grid gap-3 rounded border border-gray-200 bg-gray-50 p-4 lg:grid-cols-6 lg:items-end">
                            <div className="lg:col-span-2">
                                <label htmlFor="search" className="mb-1 block text-sm font-medium text-gray-700">
                                    Search
                                </label>
                                <input
                                    id="search"
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search by name or email"
                                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label htmlFor="role" className="mb-1 block text-sm font-medium text-gray-700">
                                    Role
                                </label>
                                <select
                                    id="role"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                                >
                                    <option value="">All</option>
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="status" className="mb-1 block text-sm font-medium text-gray-700">
                                    Status
                                </label>
                                <select
                                    id="status"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                                >
                                    <option value="">All</option>
                                    <option value="active">Active</option>
                                    <option value="suspended">Suspended</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="date_from" className="mb-1 block text-sm font-medium text-gray-700">
                                    From
                                </label>
                                <input
                                    id="date_from"
                                    type="date"
                                    value={dateFrom}
                                    onChange={(e) => setDateFrom(e.target.value)}
                                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label htmlFor="date_to" className="mb-1 block text-sm font-medium text-gray-700">
                                    To
                                </label>
                                <input
                                    id="date_to"
                                    type="date"
                                    value={dateTo}
                                    onChange={(e) => setDateTo(e.target.value)}
                                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                                />
                            </div>

                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    className="rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                                >
                                    Search
                                </button>
                                <button
                                    type="button"
                                    onClick={resetFilters}
                                    className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                                >
                                    Reset
                                </button>
                            </div>
                        </form>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2">
                                            <button type="button" onClick={() => handleSort('name')} className="flex items-center gap-1 font-semibold text-gray-700">
                                                Name <span className="text-xs">{renderSortIndicator('name')}</span>
                                            </button>
                                        </th>
                                        <th className="px-4 py-2">
                                            <button type="button" onClick={() => handleSort('email')} className="flex items-center gap-1 font-semibold text-gray-700">
                                                Email <span className="text-xs">{renderSortIndicator('email')}</span>
                                            </button>
                                        </th>
                                        <th className="px-4 py-2">
                                            <button type="button" onClick={() => handleSort('role')} className="flex items-center gap-1 font-semibold text-gray-700">
                                                Role <span className="text-xs">{renderSortIndicator('role')}</span>
                                            </button>
                                        </th>
                                        <th className="px-4 py-2">
                                            <button type="button" onClick={() => handleSort('status')} className="flex items-center gap-1 font-semibold text-gray-700">
                                                Status <span className="text-xs">{renderSortIndicator('status')}</span>
                                            </button>
                                        </th>
                                        <th className="px-4 py-2">Action</th>
                                        <th className="px-4 py-2">Delete</th>
                                        <th className="px-4 py-2">
                                            <button type="button" onClick={() => handleSort('created_at')} className="flex items-center gap-1 font-semibold text-gray-700">
                                                Created <span className="text-xs">{renderSortIndicator('created_at')}</span>
                                            </button>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {users.data.length > 0 ? (
                                        users.data.map((user) => (
                                            <tr key={user.id}>
                                                <td className="px-4 py-2 font-medium text-gray-900">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-gray-100 text-xs font-semibold text-gray-700">
                                                            {user.avatar ? (
                                                                <img
                                                                    src={`/storage/${user.avatar}`}
                                                                    alt={user.name}
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            ) : (
                                                                <span>{getInitials(user.name)}</span>
                                                            )}
                                                        </div>
                                                        <Link href={route('users.show', user.id)} className="text-indigo-600">
                                                            {user.name}
                                                        </Link>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2">{user.email}</td>
                                                <td className="px-4 py-2">{user.role}</td>
                                                <td className="px-4 py-2">{user.status}</td>
                                                <td className="px-4 py-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleStatus(user)}
                                                        className={`rounded px-2 py-1 text-xs font-semibold ${
                                                            user.status === 'active'
                                                                ? 'bg-green-100 text-red-700 hover:bg-red-200'
                                                                : 'bg-red-100 text-green-700 hover:bg-green-200'
                                                        }`}
                                                    >
                                                        {user.status === 'active' ? 'Suspend' : 'Activate'}
                                                    </button>
                                                </td>
                                                <td className="px-4 py-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => deleteUser(user)}
                                                        className="rounded bg-red-600 px-2 py-1 text-xs font-semibold text-white hover:bg-red-700"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                                <td className="px-4 py-2">{new Date(user.created_at).toLocaleDateString()}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                                                No users found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {users.links && users.links.length > 3 && (
                            <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                                <div className="text-sm text-gray-600">
                                    Showing {users.from ?? 0} - {users.to ?? 0} of {users.total ?? 0}
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                    {users.links.map((link, index) => {
                                        const label = link.label.replace('&laquo;', '«').replace('&raquo;', '»');

                                        if (link.url === null) {
                                            return (
                                                <span
                                                    key={index}
                                                    className="cursor-default rounded border border-gray-200 bg-gray-100 px-3 py-1 text-sm text-gray-400"
                                                    dangerouslySetInnerHTML={{ __html: label }}
                                                />
                                            );
                                        }

                                        return (
                                            <Link
                                                key={index}
                                                href={link.url}
                                                className={`rounded border px-3 py-1 text-sm ${
                                                    link.active
                                                        ? 'border-indigo-600 bg-indigo-600 text-white'
                                                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                                                }`}
                                                preserveScroll
                                            >
                                                <span dangerouslySetInnerHTML={{ __html: label }} />
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Modal show={showCreateModal} onClose={() => setShowCreateModal(false)} maxWidth="lg">
                <form onSubmit={submitCreateUser} className="p-6" encType="multipart/form-data">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Create User</h3>
                        <button type="button" onClick={() => setShowCreateModal(false)} className="text-sm text-gray-500 hover:text-gray-700">
                            Close
                        </button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="md:col-span-2">
                            <label htmlFor="user_name" className="mb-1 block text-sm font-medium text-gray-700">
                                Full name
                            </label>
                            <input
                                id="user_name"
                                name="name"
                                type="text"
                                value={userForm.name}
                                onChange={handleUserFormChange}
                                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                            />
                            {userErrors.name && <p className="mt-1 text-xs text-red-600">{userErrors.name}</p>}
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="user_email" className="mb-1 block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                id="user_email"
                                name="email"
                                type="email"
                                value={userForm.email}
                                onChange={handleUserFormChange}
                                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                            />
                            {userErrors.email && <p className="mt-1 text-xs text-red-600">{userErrors.email}</p>}
                        </div>

                        <div>
                            <label htmlFor="user_password" className="mb-1 block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                id="user_password"
                                name="password"
                                type="password"
                                value={userForm.password}
                                onChange={handleUserFormChange}
                                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                            />
                            {userErrors.password && <p className="mt-1 text-xs text-red-600">{userErrors.password}</p>}
                        </div>

                        <div>
                            <label htmlFor="user_password_confirmation" className="mb-1 block text-sm font-medium text-gray-700">
                                Confirm password
                            </label>
                            <input
                                id="user_password_confirmation"
                                name="password_confirmation"
                                type="password"
                                value={userForm.password_confirmation}
                                onChange={handleUserFormChange}
                                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label htmlFor="user_role" className="mb-1 block text-sm font-medium text-gray-700">
                                Role
                            </label>
                            <select
                                id="user_role"
                                name="role"
                                value={userForm.role}
                                onChange={handleUserFormChange}
                                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                            >
                                <option value="user">User</option>
                                {isSuperAdmin && <option value="admin">Admin</option>}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="user_status" className="mb-1 block text-sm font-medium text-gray-700">
                                Status
                            </label>
                            <select
                                id="user_status"
                                name="status"
                                value={userForm.status}
                                onChange={handleUserFormChange}
                                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                            >
                                <option value="active">Active</option>
                                <option value="suspended">Suspended</option>
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="user_avatar" className="mb-1 block text-sm font-medium text-gray-700">
                                Avatar
                            </label>
                            <input
                                id="user_avatar"
                                name="avatar"
                                type="file"
                                accept="image/png,image/jpeg,image/webp"
                                onChange={handleUserFormChange}
                                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                            />
                            {userErrors.avatar && <p className="mt-1 text-xs text-red-600">{userErrors.avatar}</p>}
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button type="button" onClick={() => setShowCreateModal(false)} className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
                            Cancel
                        </button>
                        <button type="submit" className="rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                            Create User
                        </button>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
