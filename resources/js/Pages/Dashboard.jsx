import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ user, stats }) {
    const isSuperAdmin = user.role === 'super_admin';
    const isAdmin = user.role === 'admin';
    const isUser = user.role === 'user';

    const cards = [
        {
            label: 'Admins',
            value: stats.admins ?? 0,
            show: isSuperAdmin,
        },
        {
            label: 'Users',
            value: stats.users ?? 0,
            show: isSuperAdmin || isAdmin,
        },
        {
            label: 'Active Users',
            value: stats.active_users ?? 0,
            show: isSuperAdmin || isAdmin,
        },
        {
            label: 'My Team',
            value: stats.team_users ?? 0,
            show: isAdmin,
        },
        {
            label: 'Peers',
            value: stats.peers ?? 0,
            show: isUser,
        },
    ].filter((card) => card.show);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-4 md:grid-cols-3">
                        {cards.map((card) => (
                            <div
                                key={card.label}
                                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
                            >
                                <div className="text-sm text-gray-500">
                                    {card.label}
                                </div>
                                <div className="mt-2 text-3xl font-bold text-gray-900">
                                    {card.value}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900">
                            {isSuperAdmin && 'System overview'}
                            {isAdmin && 'Team overview'}
                            {isUser && 'My directory'}
                        </h3>
                        <div className="mt-4 flex flex-wrap gap-3">
                            {isSuperAdmin && (
                                <>
                                    <Link
                                        href={route('admin.index')}
                                        className="rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
                                    >
                                        Manage Admins
                                    </Link>
                                    <Link
                                        href={route('users.index')}
                                        className="rounded bg-gray-800 px-4 py-2 text-sm font-medium text-white"
                                    >
                                        Manage Users
                                    </Link>
                                </>
                            )}
                            {isAdmin && (
                                <>
                                    <Link
                                        href={route('users.index')}
                                        className="rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
                                    >
                                        View Team Users
                                    </Link>
                                    <Link
                                        href={route('users.trash')}
                                        className="rounded bg-amber-500 px-4 py-2 text-sm font-medium text-white"
                                    >
                                        Trash/Archive
                                    </Link>
                                </>
                            )}
                            {isUser && (
                                <>
                                    <Link
                                        href={route('peers.index')}
                                        className="rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
                                    >
                                        View Peers
                                    </Link>
                                    <Link
                                        href={route('profile.edit')}
                                        className="rounded bg-gray-800 px-4 py-2 text-sm font-medium text-white"
                                    >
                                        Edit Profile
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
