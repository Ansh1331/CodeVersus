"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/firebaseConfig';
import { doc, onSnapshot, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';

const ContestRoomPage = ({ params }) => {
  const router = useRouter();
  const [participants, setParticipants] = useState([]);
  const [isCreator, setIsCreator] = useState(false);
  const [roomStatus, setRoomStatus] = useState('');
  const [topics, setTopics] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [problemCount, setProblemCount] = useState(1);
  const [difficulties, setDifficulties] = useState([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState([]);

  // Available difficulty levels (you can modify or fetch these from the database if needed)
  const difficultyOptions = [
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' },
  ];

  useEffect(() => {
    if (!auth.currentUser) {
      toast.error("Please log in to view this room");
      router.push('/');
      return;
    }

    const roomRef = doc(db, "rooms", params.id);

    const unsubscribe = onSnapshot(roomRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const roomData = docSnapshot.data();
        const currentUserIsCreator = roomData.createdBy === auth.currentUser.uid;
        setIsCreator(currentUserIsCreator);
        setRoomStatus(roomData.status || 'not-started');
        setParticipants(roomData.users || []);
        if (roomData.topics) setSelectedTopics(roomData.topics.map(topic => ({ value: topic, label: topic })));
        if (roomData.numProblems) setProblemCount(roomData.numProblems);

        // Redirect all users when contest is in progress
        if (roomData.status === 'in-progress') {
          router.push(`/contest/room/${params.id}/problems`);
        }
      } else {
        toast.error("Room not found");
        router.push('/contest');
      }
    }, (error) => {
      console.error("Error fetching room data:", error);
      toast.error("Error fetching room data. Please try again.");
    });

    // Fetch available topics
    const fetchTopics = async () => {
      try {
        const topicsSet = new Set();
        const problemsRef = collection(db, 'problems');
        const problemsSnapshot = await getDocs(problemsRef);
        problemsSnapshot.forEach(doc => {
          const problemData = doc.data();
          if (problemData.topics) {
            problemData.topics.forEach(topic => topicsSet.add(topic));
          }
        });
        setTopics(Array.from(topicsSet).map(topic => ({ value: topic, label: topic })));
      } catch (error) {
        console.error("Error fetching topics:", error);
        toast.error("Failed to load topics. Please try again.");
      }
    };

    fetchTopics();

    return () => unsubscribe();
  }, [params.id, router]);

  const handleStartContest = async () => {
    if (!isCreator) {
      toast.error("Only the room creator can start the contest");
      return;
    }

    if (selectedTopics.length === 0 || selectedDifficulties.length === 0) {
      toast.error("Please select at least one topic and one difficulty level");
      return;
    }

    try {
      const roomRef = doc(db, "rooms", params.id);

      // Fetch problems based on selected topics and difficulties
      const problemsRef = collection(db, 'problems');
      const q = query(
        problemsRef,
        where('topics', 'array-contains-any', selectedTopics.map(t => t.value)),
        where('difficulty', 'in', selectedDifficulties.map(d => d.value))
      );
      const problemsSnapshot = await getDocs(q);
      const availableProblems = problemsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Randomly select problems
      const selectedProblems = [];
      for (let i = 0; i < problemCount; i++) {
        if (availableProblems.length > 0) {
          const randomIndex = Math.floor(Math.random() * availableProblems.length);
          selectedProblems.push(availableProblems.splice(randomIndex, 1)[0]);
        }
      }

      await updateDoc(roomRef, {
        status: "in-progress",
        startedAt: new Date(),
        topics: selectedTopics.map(t => t.value),
        difficulties: selectedDifficulties.map(d => d.value),
        numProblems: problemCount,
        problems: selectedProblems
      });

      // The redirection will be handled by the useEffect hook
    } catch (error) {
      console.error("Error starting contest:", error);
      toast.error("Failed to start contest. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-8">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      
      <h1 className="text-4xl font-bold mb-8 text-[#DEA03C]">Contest Room: {params.id}</h1>
      
      <div className="bg-[#1a1a1a] p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-semibold mb-4 text-white">Participants:</h2>
        
        <ul className="space-y-2 mb-8">
          {participants.length > 0 ? (
            participants.map((participant) => (
              <li key={participant.uid} className="text-white">
                {participant.displayName || "Unknown User"}
              </li>
            ))
          ) : (
            <li className="text-white">No participants yet.</li>
          )}
        </ul>
        
        {isCreator && roomStatus === 'not-started' ? (
          <>
            <div className="mb-4">
              <label className="block text-white mb-2">Select Topics:</label>
              <Select
                isMulti
                options={topics}
                value={selectedTopics}
                onChange={setSelectedTopics}
                className="text-black"
              />
            </div>

            <div className="mb-4">
              <label className="block text-white mb-2">Select Difficulty:</label>
              <Select
                isMulti
                options={difficultyOptions}
                value={selectedDifficulties}
                onChange={setSelectedDifficulties}
                className="text-black"
              />
            </div>

            <div className="mb-4">
              <label className="block text-white mb-2">Number of Problems (1-4):</label>
              <input
                type="number"
                min="1"
                max="4"
                value={problemCount}
                onChange={(e) => setProblemCount(Math.min(4, Math.max(1, parseInt(e.target.value))))}
                className="w-full px-3 py-2 text-black rounded"
              />
            </div>

            <button
              onClick={handleStartContest}
              className="w-full bg-[#DEA03C] text-black px-4 py-2 rounded-lg hover:bg-[#c78f35] transition duration-300"
            >
              Start Contest
            </button>
          </>
        ) : (
          <p className="text-white text-center">
            {isCreator ? "You are the room creator." : "You are a participant."} 
            Waiting for the contest to start...
          </p>
        )}
      </div>
    </div>
  );
};

export default ContestRoomPage;
