import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function AdminIndex({ admins, filters }) {
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

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-gray-800">Admin Management</h2>}
        >
            <Head title="Admins" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="rounded bg-white p-6 shadow-sm">
                        <div className="mb-4 flex justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">Admins</h3>
                            <Link href={route('dashboard')} className="text-sm text-indigo-600">
                                Back to dashboard
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2">Name</th>
                                        <th className="px-4 py-2">Email</th>
                                        <th className="px-4 py-2">Status</th>
                                        <th className="px-4 py-2">Action</th>
                                        <th className="px-4 py-2">Delete</th>
                                        <th className="px-4 py-2">Created</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {admins.data.map((admin) => (
                                        <tr key={admin.id}>
                                            <td className="px-4 py-2 font-medium text-gray-900">
                                                <Link href={route('admin.show', admin.id)} className="text-indigo-600">
                                                    {admin.name}
                                                </Link>
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
