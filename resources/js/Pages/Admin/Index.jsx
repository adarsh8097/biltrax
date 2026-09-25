import Modal from '@/Components/Modal';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function AdminIndex({ admins, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [adminForm, setAdminForm] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        status: 'active',
    });
    const [adminErrors, setAdminErrors] = useState({});

    const buildQuery = (extra = {}) => ({
        search: search || undefined,
        status: status || undefined,
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
        ...extra,
    });

    const getInitials = (name) => {
        const parts = String(name || '').trim().split(/\s+/).filter(Boolean);

        if (parts.length === 0) {
            return 'A';
        }

        if (parts.length === 1) {
            return parts[0][0]?.toUpperCase() || 'A';
        }

        return `${parts[0][0]?.toUpperCase() || ''}${parts[parts.length - 1][0]?.toUpperCase() || ''}`;
    };

    const toggleStatus = (admin) => {
        const nextStatus = admin.status === 'active' ? 'suspended' : 'active';

        router.patch(route('admin.status', admin.id), {
            status: nextStatus,
        }, {
            preserveScroll: true,
        });
    };

    const deleteAdmin = (admin) => {
        if (confirm(`Delete admin ${admin.name}?`)) {
            router.delete(route('admin.destroy', admin.id), {
                preserveScroll: true,
            });
        }
    };

    const handleSort = (column) => {
        const nextDirection = filters.sort === column && filters.direction === 'asc' ? 'desc' : 'asc';

        router.get(route('admin.index'), {
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

        router.get(route('admin.index'), buildQuery({ page: 1 }), {
            preserveScroll: true,
            replace: true,
        });
    };

    const resetFilters = () => {
        setSearch('');
        setStatus('');
        setDateFrom('');
        setDateTo('');

        router.get(route('admin.index'), { page: 1 }, {
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

    const handleAdminFormChange = (event) => {
        const { name, value } = event.target;
        setAdminForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const submitCreateAdmin = (event) => {
        event.preventDefault();

        router.post(route('admin.store'), adminForm, {
            preserveScroll: true,
            onSuccess: () => {
                setShowCreateModal(false);
                setAdminForm({
                    name: '',
                    email: '',
                    password: '',
                    password_confirmation: '',
                    status: 'active',
                });
                setAdminErrors({});
            },
            onError: (errors) => setAdminErrors(errors),
        });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-gray-800">Admin Management</h2>}
        >
            <Head title="Admins" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="rounded bg-white p-6 shadow-sm">
                        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">Admins</h3>
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(true)}
                                    className="rounded bg-indigo-600 px-3 py-2 text-xs font-medium text-white hover:bg-indigo-700"
                                >
                                    New Admin
                                </button>
                                <Link href={route('dashboard')} className="text-sm text-indigo-600">
                                    Back to dashboard
                                </Link>
                            </div>
                        </div>

                        <form onSubmit={applyFilters} className="mb-4 grid gap-3 rounded border border-gray-200 bg-gray-50 p-4 lg:grid-cols-5 lg:items-end">
                            <div className="lg:col-span-2">
                                <label htmlFor="admin-search" className="mb-1 block text-sm font-medium text-gray-700">
                                    Search
                                </label>
                                <input
                                    id="admin-search"
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search by name or email"
                                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label htmlFor="admin-status" className="mb-1 block text-sm font-medium text-gray-700">
                                    Status
                                </label>
                                <select
                                    id="admin-status"
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
                                <label htmlFor="admin-date-from" className="mb-1 block text-sm font-medium text-gray-700">
                                    From
                                </label>
                                <input
                                    id="admin-date-from"
                                    type="date"
                                    value={dateFrom}
                                    onChange={(e) => setDateFrom(e.target.value)}
                                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label htmlFor="admin-date-to" className="mb-1 block text-sm font-medium text-gray-700">
                                    To
                                </label>
                                <input
                                    id="admin-date-to"
                                    type="date"
                                    value={dateTo}
                                    onChange={(e) => setDateTo(e.target.value)}
                                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                                />
                            </div>

                            <div className="flex gap-2 lg:col-span-5">
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
                                    {admins.data.length > 0 ? admins.data.map((admin) => (
                                        <tr key={admin.id}>
                                            <td className="px-4 py-2 font-medium text-gray-900">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-gray-100 text-xs font-semibold text-gray-700">
                                                        {admin.avatar ? (
                                                            <img
                                                                src={`/storage/${admin.avatar}`}
                                                                alt={admin.name}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <span>{getInitials(admin.name)}</span>
                                                        )}
                                                    </div>
                                                    <Link href={route('admin.show', admin.id)} className="text-indigo-600">
                                                        {admin.name}
                                                    </Link>
                                                </div>
                                            </td>
                                            <td className="px-4 py-2">{admin.email}</td>
                                            <td className="px-4 py-2">{admin.status}</td>
                                            <td className="px-4 py-2">
                                                <button
                                                    type="button"
                                                    onClick={() => toggleStatus(admin)}
                                                    className={`rounded px-2 py-1 text-xs font-semibold ${
                                                        admin.status === 'active'
                                                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                                                    }`}
                                                >
                                                    {admin.status === 'active' ? 'Suspend' : 'Activate'}
                                                </button>
                                            </td>
                                            <td className="px-4 py-2">
                                                <button
                                                    type="button"
                                                    onClick={() => deleteAdmin(admin)}
                                                    className="rounded bg-red-600 px-2 py-1 text-xs font-semibold text-white hover:bg-red-700"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                            <td className="px-4 py-2">{new Date(admin.created_at).toLocaleDateString()}</td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                                                No admins found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {admins.links && admins.links.length > 3 && (
                            <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                                <div className="text-sm text-gray-600">
                                    Showing {admins.from ?? 0} - {admins.to ?? 0} of {admins.total ?? 0}
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                    {admins.links.map((link, index) => {
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
                <form onSubmit={submitCreateAdmin} className="p-6">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Create Admin</h3>
                        <button type="button" onClick={() => setShowCreateModal(false)} className="text-sm text-gray-500 hover:text-gray-700">
                            Close
                        </button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="md:col-span-2">
                            <label htmlFor="admin_name" className="mb-1 block text-sm font-medium text-gray-700">
                                Full name
                            </label>
                            <input
                                id="admin_name"
                                name="name"
                                type="text"
                                value={adminForm.name}
                                onChange={handleAdminFormChange}
                                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                            />
                            {adminErrors.name && <p className="mt-1 text-xs text-red-600">{adminErrors.name}</p>}
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="admin_email" className="mb-1 block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                id="admin_email"
                                name="email"
                                type="email"
                                value={adminForm.email}
                                onChange={handleAdminFormChange}
                                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                            />
                            {adminErrors.email && <p className="mt-1 text-xs text-red-600">{adminErrors.email}</p>}
                        </div>

                        <div>
                            <label htmlFor="admin_password" className="mb-1 block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                id="admin_password"
                                name="password"
                                type="password"
                                value={adminForm.password}
                                onChange={handleAdminFormChange}
                                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                            />
                            {adminErrors.password && <p className="mt-1 text-xs text-red-600">{adminErrors.password}</p>}
                        </div>

                        <div>
                            <label htmlFor="admin_password_confirmation" className="mb-1 block text-sm font-medium text-gray-700">
                                Confirm password
                            </label>
                            <input
                                id="admin_password_confirmation"
                                name="password_confirmation"
                                type="password"
                                value={adminForm.password_confirmation}
                                onChange={handleAdminFormChange}
                                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="admin_status" className="mb-1 block text-sm font-medium text-gray-700">
                                Status
                            </label>
                            <select
                                id="admin_status"
                                name="status"
                                value={adminForm.status}
                                onChange={handleAdminFormChange}
                                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                            >
                                <option value="active">Active</option>
                                <option value="suspended">Suspended</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button type="button" onClick={() => setShowCreateModal(false)} className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
                            Cancel
                        </button>
                        <button type="submit" className="rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                            Create Admin
                        </button>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
