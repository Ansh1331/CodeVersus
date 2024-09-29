"use client"
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { auth } from '@/firebaseConfig';
import { signOut } from 'firebase/auth';
import { toast } from 'react-toastify';

export default function Navbar() {
    const [state, setState] = useState(false);
    const [user, setUser] = useState(null);
    const router = useRouter();

    const navigation = [
        { title: "Problems", path: "/problems" },
        { title: "Contest", path: "/contest" },
        { title: "Roadmap", path: "/roadmap" },
        { title: "Events", path: "/events" },
    ];

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
        });

        document.onclick = (e) => {
            const target = e.target;
            if (!target.closest(".menu-btn")) setState(false);
        };

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            toast.success("Logged out successfully");
            router.push('/');
        } catch (error) {
            console.error("Error signing out:", error);
            toast.error("Failed to log out. Please try again.");
        }
    };

    const handleNavigation = (path) => {
        if (!user) {
            toast.warning("Please log in to access this page.");
        } else {
            router.push(path);
        }
    };

    const Brand = () => (
        <div className="flex items-center justify-between py-5 md:block">
            <Link href="/">
                <h1 className="text-white text-2xl font-bold">CodeVersus</h1>
            </Link>
            <div className="md:hidden">
                <button className="menu-btn text-white hover:text-[#DEA03C]"
                    onClick={() => setState(!state)}
                >
                    {
                        state ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        )
                    }
                </button>
            </div>
        </div>
    );

    return (
        <header>
            <div className={`md:hidden ${state ? "mx-2 pb-5" : "hidden"}`}>
                <Brand />
            </div>
            <nav className={`pb-5 md:text-sm ${state ? "absolute top-0 inset-x-0 bg-[#0f0f0f] shadow-lg rounded-xl border mx-2 mt-2 z-50 md:shadow-none md:border-none md:mx-0 md:mt-0 md:relative md:bg-transparent" : ""}`}>
                <div className="gap-x-14 items-center max-w-screen-xl mx-auto px-4 md:flex md:px-8">
                    <Brand />
                    <div className={`flex-1 items-center mt-8 md:mt-0 md:flex ${state ? 'block' : 'hidden'} `}>
                        <ul className="flex-1 justify-start items-center space-y-6 md:flex md:space-x-6 md:space-y-0 ml-6 gap-4">
                            {
                                navigation.map((item, idx) => (
                                    <li key={idx} className="text-white hover:text-[#e8d4bc]">
                                        <button
                                            onClick={() => handleNavigation(item.path)}
                                            className="block font-normal hover:border-b-2 hover:border-[#e8d4bc]"
                                        >
                                            {item.title}
                                        </button>
                                    </li>
                                ))
                            }
                        </ul>
                        <div className="items-center justify-end mt-6 space-y-6 md:flex md:mt-0">
                            {user ? (
                                <button 
                                    onClick={handleLogout} 
                                    className="flex items-center justify-center gap-x-1 py-2 px-4 text-[#0f0f0f] font-medium bg-[#DEA03C] hover:bg-yellow-400 active:bg-yellow-500 rounded-full md:inline-flex"
                                >
                                    Logout
                                </button>
                            ) : (
                                <button 
                                    onClick={() => router.push('/')} 
                                    className="flex items-center justify-center gap-x-1 py-2 px-4 text-[#0f0f0f] font-medium bg-[#DEA03C] hover:bg-yellow-400 active:bg-yellow-500 rounded-full md:inline-flex"
                                >
                                    Login
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                        <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}