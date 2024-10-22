"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/firebaseConfig';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';

const ContestProblemsPage = ({ params }) => {
  const router = useRouter();
  const [problems, setProblems] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [isCreator, setIsCreator] = useState(false);
  const [timeLeft, setTimeLeft] = useState(90 * 60); // 90 minutes in seconds
  const [contestStartTime, setContestStartTime] = useState(null);

  useEffect(() => {
    if (!auth.currentUser) {
      toast.error("Please log in to view this contest");
      router.push('/');
      return;
    }

    const roomRef = doc(db, "rooms", params.id);
    
    const unsubscribe = onSnapshot(roomRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const roomData = docSnapshot.data();
        if (roomData.status !== 'in-progress') {
          toast.error("This contest has not started or has ended");
          router.push(`/contest/room/${params.id}`);
          return;
        }
        setProblems(roomData.problems || []);
        setParticipants(roomData.users || []);
        setIsCreator(roomData.createdBy === auth.currentUser.uid);
        if (roomData.startedAt) {
          setContestStartTime(roomData.startedAt.toDate());
        }
      } else {
        toast.error("Room not found");
        router.push('/contest');
      }
    }, (error) => {
      console.error("Error fetching room data:", error);
      toast.error("Error fetching contest data. Please try again.");
    });

    return () => unsubscribe();
  }, [params.id, router]);

  useEffect(() => {
    if (contestStartTime) {
      const timer = setInterval(() => {
        const now = new Date();
        const diff = 90 * 60 - Math.floor((now - contestStartTime) / 1000);
        if (diff <= 0) {
          clearInterval(timer);
          setTimeLeft(0);
          handleContestEnd();
        } else {
          setTimeLeft(diff);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [contestStartTime]);

  
  const formatProblemNameForURL = (name) => {
    return encodeURIComponent(name.toLowerCase().replace(/\s+/g, '-'));
  };


  const handleContestEnd = async () => {
    try {
      const roomRef = doc(db, "rooms", params.id);
      await updateDoc(roomRef, { status: 'completed' });
      toast.info("The contest has ended!");
      router.push(`/contest/room/${params.id}`);
    } catch (error) {
      console.error("Error ending contest:", error);
      toast.error("Failed to end the contest. Please try again.");
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const sortedParticipants = [...participants].sort((a, b) => {
    const aSolved = a.solvedProblems ? a.solvedProblems.length : 0;
    const bSolved = b.solvedProblems ? b.solvedProblems.length : 0;
    if (bSolved !== aSolved) {
      return bSolved - aSolved;
    }
    return a.totalTimeTaken - b.totalTimeTaken;
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-8">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      
      <h1 className="text-4xl font-bold mb-8 text-[#DEA03C]">Contest Problems</h1>
      
      <div className="bg-[#1a1a1a] p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-white">Room: {params.id}</h2>
          <p className="text-white text-xl">Time Left: {formatTime(timeLeft)}</p>
        </div>
        
        <h3 className="text-2xl font-semibold text-white mb-4">Problems</h3>
        <ul className="space-y-4 mb-8">
          {problems.map((problem, index) => (
            <li key={problem.id} className="flex justify-between items-center">
              <div>
                <span className="text-white font-semibold">{index + 1}. {problem.name}</span>
                <span className="text-gray-400 ml-2">({problem.difficulty})</span>
              </div>
              <Link href={`/contest/room/${params.id}/problems/${formatProblemNameForURL(problem.name)}`}>
                <button className="bg-[#DEA03C] text-black px-4 py-2 rounded hover:bg-[#c78f35] transition duration-300">
                  Solve
                </button>
              </Link>
            </li>
          ))}
        </ul>
        
        {isCreator && (
          <button
            onClick={handleContestEnd}
            className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300 mb-8"
          >
            Finish Contest
          </button>
        )}
        
        <h3 className="text-2xl font-semibold text-white mb-4">Leaderboard</h3>
        <ul className="space-y-2">
          {sortedParticipants.map((participant, index) => (
            <li key={participant.uid} className="text-white flex justify-between">
              <span>{index + 1}. {participant.displayName || "Unknown User"}</span>
              <span>{(participant.solvedProblems || []).length} solved ({participant.totalTimeTaken || 0}s)</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ContestProblemsPage;