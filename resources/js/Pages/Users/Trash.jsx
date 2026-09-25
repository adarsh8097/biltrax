import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';

export default function Trash({ users }) {
    const restoreUser = (user) => {
        if (confirm(`Restore ${user.name}?`)) {
            router.post(route('users.restore', user.id), {}, {
                preserveScroll: true,
            });
        }
    };

    const forceDeleteUser = (user) => {
        if (confirm(`Permanently delete ${user.name}? This cannot be undone.`)) {
            router.delete(route('users.force-delete', user.id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-gray-800">Trash / Archive</h2>}
        >
            <Head title="Trash" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="rounded bg-white p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900">Archived Accounts</h3>
                        <div className="mt-4 space-y-3">
                            {users.data.length === 0 ? (
                                <div className="text-gray-600">No archived users found.</div>
                            ) : (
                                users.data.map((user) => (
                                    <div key={user.id} className="flex items-center justify-between rounded border border-gray-200 p-4">
                                        <div>
                                            <div className="font-medium text-gray-900">{user.name}</div>
                                            <div className="text-sm text-gray-600">{user.email}</div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm text-gray-500">{user.deleted_at}</span>
                                            <button
                                                type="button"
                                                onClick={() => restoreUser(user)}
                                                className="rounded bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                                            >
                                                Restore
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => forceDeleteUser(user)}
                                                className="rounded bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
                                            >
                                                Delete Permanently
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
