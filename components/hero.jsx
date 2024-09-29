"use client"
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { auth,db } from '@/firebaseConfig';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import getStartedBtn from '@/assets/getStartedBtn.svg';
import sideImg from "@/assets/side.svg";
import heroImg from '@/assets/heroImg.svg';
import { Swords } from 'lucide-react';
import Overlay from "./overlay";
// import { auth, db } from '@/firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function Hero() {
    const [state, setState] = useState(false);
    const [showLoginPopup, setShowLoginPopup] = useState(false);
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

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
    
            // Check if the user document already exists
            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);
    
            if (!userDoc.exists()) {
                // If the user document doesn't exist, create it with initial rating
                await setDoc(userDocRef, {
                    email: user.email,
                    displayName: user.displayName,
                    rating: 1000,
                    createdAt: new Date()
                });
                console.log("New user created with initial rating");
            } else {
                console.log("Existing user signed in");
            }
    
            setShowLoginPopup(false);
            router.push('/problems');
        } catch (error) {
            console.error("Error signing in with Google:", error);
            toast.error("Failed to sign in. Please try again.");
        }
    };
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

    const LoginPopup = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-black p-6 rounded-lg shadow-lg relative border border-white w-96 h-40">
                <button
                    onClick={() => setShowLoginPopup(false)}
                    className="absolute top-2 right-2 text-white hover:text-gray-700"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <h2 className="text-2xl font-bold mb-8 text-white">Login</h2>
                <button
                    onClick={handleGoogleSignIn}
                    className="w-full bg-[#DEA03C] text-white px-4 py-2 rounded hover:bg-yellow-400 transition duration-300"
                >
                    Connect with Google
                </button>
            </div>
        </div>
    );

    return (
        <div className="text-white">
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            <div className='absolute inset-0 blur-xl h-[580px]'></div>
            <div className='relative'>
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
                                            onClick={() => setShowLoginPopup(true)}
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
                <section className="relative">
                    <div className="absolute -top-12">
                        <Image src={sideImg} alt="Side decoration" />
                    </div>
                    <div className="max-w-screen-xl mx-auto px-4 py-28 gap-12 text-white overflow-hidden md:px-8 md:flex">
                        <div className='flex-none space-y-5 max-w-xl'>
                            <Link href="/problems" className='inline-flex gap-x-6 items-center rounded-full p-1 pr-6 border border-white text-sm font-medium duration-150 hover:bg-[#e8d4bc] hover:text-[#0f0f0f]'>
                                <span className='inline-block rounded-full px-3 py-1 bg-[#DEA03C] text-[#0f0f0f]'>
                                    New
                                </span>
                                <p className='flex items-center'>
                                    Check out our latest challenges
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                        <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                                    </svg>
                                </p>
                            </Link>
                            <h1 className="text-4xl text-white font-bold sm:text-5xl">
                                Challenge Your Coding Skills with CodeVersus
                            </h1>
                            <p className="text-gray-300">
                                Join our community of coders, compete in exciting contests, and level up your programming skills.
                            </p>
                            <div className='flex items-center gap-x-3 sm:text-sm'>
                                <button
                                    onClick={() => user ? router.push('/problems') : setShowLoginPopup(true)}
                                    className="mt-3"
                                >
                                    <Image src={getStartedBtn} alt="Get Started" />
                                </button>
                            </div>
                        </div>
                        <div className='flex-1 hidden md:block'>
                            <div className="transform -translate-y-16 z-10">
                                <Image src={heroImg} width={500} height={500} alt="Coding challenge" />
                                {/* <Overlay width={560} height={400}/> */}

                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                    <Overlay width={540} height={400} />
                                </div>
                                <div className="absolute top-1/2 left-1/2 transform translate-x-40 translate-y-20">
                                    <Swords size={60} color="white" />
                                </div>
                                {/* <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-96">
                                    <Model />
                                </div> */}
                            </div>
                            {/* <div className="absolute right-20 -bottom-40 -z-10">
                                <Image src={heroImg} width={500} height={500} alt="Coding challenge" />
                            </div> */}
                        </div>
                    </div>
                </section>
            </div>
            {showLoginPopup && <LoginPopup />}
        </div>
    );
}