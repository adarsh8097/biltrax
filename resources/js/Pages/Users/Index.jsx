import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function UsersIndex({ users, isSuperAdmin, isAdmin }) {
    const roleLabel = isSuperAdmin ? 'Users in system' : 'Users under your management';

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

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-gray-800">{roleLabel}</h2>}
        >
            <Head title="Users" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="rounded bg-white p-6 shadow-sm">
                        <div className="mb-4 flex justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">Users</h3>
                            <Link href={route('dashboard')} className="text-sm text-indigo-600">
                                Dashboard
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2">Name</th>
                                        <th className="px-4 py-2">Email</th>
                                        <th className="px-4 py-2">Role</th>
                                        <th className="px-4 py-2">Status</th>
                                        <th className="px-4 py-2">Action</th>
                                        <th className="px-4 py-2">Delete</th>
                                        <th className="px-4 py-2">Created</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {users.data.map((user) => (
                                        <tr key={user.id}>
                                            <td className="px-4 py-2 font-medium text-gray-900">
                                                <Link href={route('users.show', user.id)} className="text-indigo-600">
                                                    {user.name}
                                                </Link>
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
                                                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                                            : 'bg-green-100 text-green-700 hover:bg-green-200'
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
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
