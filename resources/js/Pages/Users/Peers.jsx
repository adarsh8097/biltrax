import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Peers({ users }) {
    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-gray-800">Peer Directory</h2>}
        >
            <Head title="Peers" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="rounded bg-white p-6 shadow-sm">
                        <div className="mb-4 flex justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">Users in your admin group</h3>
                            <Link href={route('dashboard')} className="text-sm text-indigo-600">
                                Dashboard
                            </Link>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {users.data.map((user) => (
                                <div key={user.id} className="rounded border border-gray-200 p-4">
                                    <div className="font-semibold text-gray-900">{user.name}</div>
                                    <div className="text-sm text-gray-600">{user.email}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
