import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function AdminShow({ admin }) {
    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-gray-800">Admin Detail</h2>}
        >
            <Head title={admin.name} />
            <div className="py-12">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <div className="rounded bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <div className="text-sm uppercase tracking-wide text-gray-500">Admin</div>
                                <h3 className="text-2xl font-bold text-gray-900">{admin.name}</h3>
                            </div>
                            <Link href={route('admin.index')} className="text-sm text-indigo-600">
                                Back to admins
                            </Link>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div><span className="text-gray-500">Email:</span> {admin.email}</div>
                            <div><span className="text-gray-500">Status:</span> {admin.status}</div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
