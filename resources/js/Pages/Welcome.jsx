
import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth }) {
    const roles = [
        {
            icon: '🛡️',
            title: 'Administrator',
            description:
                'Manage users, roles, permissions and the complete application from one place.',
            color: 'from-red-500 to-orange-500',
        },
        {
            icon: '👨‍💼',
            title: 'Manager',
            description:
                'Monitor your team, manage activities and keep track of important operations.',
            color: 'from-blue-500 to-cyan-500',
        },
        {
            icon: '👨‍💻',
            title: 'Employee',
            description:
                'Access your assigned tasks, profile, activities and role-specific features.',
            color: 'from-violet-500 to-purple-500',
        },
        {
            icon: '👤',
            title: 'User',
            description:
                'Use the platform according to your assigned permissions and available services.',
            color: 'from-emerald-500 to-teal-500',
        },
    ];

    return (
        <>
            <Head title="Welcome" />

            <div className="min-h-screen bg-slate-950 text-white">
                {/* Background */}
                <div className="pointer-events-none fixed inset-0 overflow-hidden">
                    <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-red-500/20 blur-3xl" />
                    <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
                    <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
                </div>

                {/* Navbar */}
                <header className="relative z-10 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
                        {/* Logo */}
                        <Link
                            href="/"
                            className="flex items-center gap-3"
                        >
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-orange-500 text-xl font-bold shadow-lg shadow-red-500/20">
                                M
                            </div>

                            <div>
                                <h1 className="text-lg font-bold tracking-tight">
                                    MultiRole
                                </h1>
                                <p className="text-xs text-slate-400">
                                    Management Platform
                                </p>
                            </div>
                        </Link>

                        {/* Navigation */}
                        <nav className="flex items-center gap-2">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
                                    >
                                        Login
                                    </Link>

                                    <Link
                                        href={route('register')}
                                        className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-lg transition hover:bg-slate-200"
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                {/* Main */}
                <main className="relative z-10">
                    {/* Hero */}
                    <section className="mx-auto max-w-7xl px-6 pb-20 pt-20 lg:px-8 lg:pb-28 lg:pt-28">
                        <div className="grid items-center gap-14 lg:grid-cols-2">
                            {/* Left */}
                            <div>
                                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 backdrop-blur">
                                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                                    Secure Multi-Role Platform
                                </div>

                                <h2 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                                    One Platform.
                                    <span className="block bg-gradient-to-r from-red-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">
                                        Multiple Roles.
                                    </span>
                                </h2>

                                <p className="mt-6 max-w-xl text-lg leading-8 text-slate-400">
                                    A powerful role-based management system where
                                    every user gets the right access, tools and
                                    dashboard according to their permissions.
                                </p>

                                <div className="mt-8 flex flex-wrap gap-4">
                                    {auth.user ? (
                                        <Link
                                            href={route('dashboard')}
                                            className="rounded-xl bg-gradient-to-r from-red-500 to-orange-500 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-red-500/20 transition hover:-translate-y-0.5 hover:shadow-red-500/30"
                                        >
                                            Go to Dashboard →
                                        </Link>
                                    ) : (
                                        <>
                                            <Link
                                                href={route('register')}
                                                className="rounded-xl bg-gradient-to-r from-red-500 to-orange-500 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-red-500/20 transition hover:-translate-y-0.5 hover:shadow-red-500/30"
                                            >
                                                Create Account →
                                            </Link>

                                            <Link
                                                href={route('login')}
                                                className="rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
                                            >
                                                Sign In
                                            </Link>
                                        </>
                                    )}
                                </div>

                                {/* Stats */}
                                <div className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-white/10 pt-8">
                                    <div>
                                        <p className="text-2xl font-bold">
                                            4+
                                        </p>
                                        <p className="mt-1 text-xs text-slate-500">
                                            User Roles
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-2xl font-bold">
                                            100%
                                        </p>
                                        <p className="mt-1 text-xs text-slate-500">
                                            Role Based
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-2xl font-bold">
                                            24/7
                                        </p>
                                        <p className="mt-1 text-xs text-slate-500">
                                            Accessible
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Right - Dashboard Preview */}
                            <div className="relative">
                                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-red-500/20 to-purple-500/20 blur-2xl" />

                                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] p-4 shadow-2xl backdrop-blur-xl">
                                    {/* Fake browser bar */}
                                    <div className="mb-4 flex items-center gap-2 border-b border-white/10 pb-4">
                                        <span className="h-3 w-3 rounded-full bg-red-400" />
                                        <span className="h-3 w-3 rounded-full bg-yellow-400" />
                                        <span className="h-3 w-3 rounded-full bg-green-400" />

                                        <div className="ml-3 h-7 flex-1 rounded-lg bg-white/5" />
                                    </div>

                                    <div className="grid grid-cols-4 gap-3">
                                        <div className="col-span-1 hidden rounded-xl bg-black/20 p-3 sm:block">
                                            <div className="mb-6 h-8 w-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-500" />

                                            <div className="space-y-3">
                                                <div className="h-2 rounded bg-white/20" />
                                                <div className="h-2 rounded bg-white/10" />
                                                <div className="h-2 rounded bg-white/10" />
                                                <div className="h-2 rounded bg-white/10" />
                                                <div className="h-2 rounded bg-white/10" />
                                            </div>
                                        </div>

                                        <div className="col-span-4 sm:col-span-3">
                                            <div className="mb-4">
                                                <div className="h-3 w-28 rounded bg-white/20" />
                                                <div className="mt-2 h-2 w-44 rounded bg-white/10" />
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="rounded-xl bg-white/5 p-4">
                                                    <div className="h-8 w-8 rounded-lg bg-blue-500/30" />
                                                    <div className="mt-4 h-5 w-16 rounded bg-white/20" />
                                                    <div className="mt-2 h-2 w-24 rounded bg-white/10" />
                                                </div>

                                                <div className="rounded-xl bg-white/5 p-4">
                                                    <div className="h-8 w-8 rounded-lg bg-purple-500/30" />
                                                    <div className="mt-4 h-5 w-16 rounded bg-white/20" />
                                                    <div className="mt-2 h-2 w-24 rounded bg-white/10" />
                                                </div>

                                                <div className="col-span-2 rounded-xl bg-white/5 p-4">
                                                    <div className="mb-4 flex justify-between">
                                                        <div className="h-3 w-24 rounded bg-white/20" />
                                                        <div className="h-3 w-12 rounded bg-white/10" />
                                                    </div>

                                                    <div className="flex h-28 items-end gap-2">
                                                        <div className="h-10 flex-1 rounded-t bg-red-500/40" />
                                                        <div className="h-16 flex-1 rounded-t bg-red-500/50" />
                                                        <div className="h-12 flex-1 rounded-t bg-red-500/40" />
                                                        <div className="h-24 flex-1 rounded-t bg-orange-500/60" />
                                                        <div className="h-20 flex-1 rounded-t bg-orange-500/50" />
                                                        <div className="h-28 flex-1 rounded-t bg-red-500/70" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Roles */}
                    <section className="border-y border-white/10 bg-white/[0.02]">
                        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
                            <div className="mx-auto max-w-2xl text-center">
                                <p className="text-sm font-semibold uppercase tracking-widest text-red-400">
                                    Role Based Access
                                </p>

                                <h3 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                                    Built for every type of user
                                </h3>

                                <p className="mt-4 text-slate-400">
                                    Each role gets its own permissions and
                                    features, keeping your application secure
                                    and organized.
                                </p>
                            </div>

                            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                                {roles.map((role) => (
                                    <div
                                        key={role.title}
                                        className="group rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.07]"
                                    >
                                        <div
                                            className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${role.color} text-2xl shadow-lg`}
                                        >
                                            {role.icon}
                                        </div>

                                        <h4 className="mt-5 text-lg font-bold">
                                            {role.title}
                                        </h4>

                                        <p className="mt-3 text-sm leading-6 text-slate-400">
                                            {role.description}
                                        </p>

                                        <div className="mt-5 text-sm font-semibold text-slate-300 transition group-hover:text-white">
                                            Role Access →
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Features */}
                    <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
                        <div className="grid gap-5 md:grid-cols-3">
                            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-7">
                                <div className="text-3xl">🔐</div>
                                <h4 className="mt-5 text-lg font-bold">
                                    Secure Permissions
                                </h4>
                                <p className="mt-3 text-sm leading-6 text-slate-400">
                                    Users only get access to the features and
                                    resources assigned to their role.
                                </p>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-7">
                                <div className="text-3xl">📊</div>
                                <h4 className="mt-5 text-lg font-bold">
                                    Dedicated Dashboard
                                </h4>
                                <p className="mt-3 text-sm leading-6 text-slate-400">
                                    Show different dashboard information and
                                    actions depending on the logged-in user.
                                </p>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-7">
                                <div className="text-3xl">⚡</div>
                                <h4 className="mt-5 text-lg font-bold">
                                    Fast & Responsive
                                </h4>
                                <p className="mt-3 text-sm leading-6 text-slate-400">
                                    Clean responsive interface designed for
                                    desktop, tablet and mobile devices.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* CTA */}
                    <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
                        <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-red-500/10 via-orange-500/10 to-purple-500/10 p-8 text-center sm:p-12">
                            <h3 className="text-3xl font-bold">
                                Ready to get started?
                            </h3>

                            <p className="mx-auto mt-3 max-w-xl text-slate-400">
                                Login to your account or create a new account
                                to access your role-based dashboard.
                            </p>

                            <div className="mt-7">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="inline-flex rounded-xl bg-white px-6 py-3 font-bold text-slate-900 transition hover:bg-slate-200"
                                    >
                                        Open Dashboard →
                                    </Link>
                                ) : (
                                    <Link
                                        href={route('register')}
                                        className="inline-flex rounded-xl bg-white px-6 py-3 font-bold text-slate-900 transition hover:bg-slate-200"
                                    >
                                        Create Your Account →
                                    </Link>
                                )}
                            </div>
                        </div>
                    </section>
                </main>

                {/* Footer */}
                <footer className="relative z-10 border-t border-white/10">
                    <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm text-slate-500 sm:flex-row lg:px-8">
                        <p>
                            © {new Date().getFullYear()} MultiRole Platform.
                            All rights reserved.
                        </p>

                        <p>
                            Built with Laravel + React + Inertia
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}

