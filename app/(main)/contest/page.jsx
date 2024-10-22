"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Swords, X, Copy } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchProblemList } from '@/utils/githubProblemFetcher';
import { auth, db } from '@/firebaseConfig';
import { collection, doc, getDoc, setDoc, updateDoc, arrayUnion, serverTimestamp, deleteDoc, getDocs, query, where, onSnapshot } from 'firebase/firestore';

const ContestPage = () => {
  const router = useRouter();
  const [isSearching, setIsSearching] = useState(false);
  const [problemList, setProblemList] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [loadingPopup, setLoadingPopup] = useState(false); // New state for loading popup
  const [battleId, setBattleId] = useState(null); // Track battleId for canceling search

  useEffect(() => {
    const loadProblemList = async () => {
      try {
        const problems = await fetchProblemList();
        setProblemList(problems);
      } catch (error) {
        console.error("Error fetching problem list:", error);
        toast.error("Failed to load problems. Please try again later.");
      }
    };

    loadProblemList();
  }, []);



  const monitorBattleStatus = (battleId) => {
    const battleRef = doc(db, '1v1-battles', battleId);

    const unsubscribe = onSnapshot(battleRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const battleData = docSnapshot.data();

        if (battleData.status === 'found') {
          setLoadingPopup(false); // Hide loading when found
          const pid = battleData.pid; // Get the problem ID
          // Redirect both users to the battle page once the status is 'found'
          router.push(`/contest/1v1-battle/${battleId}/${pid}`);
        }
      }
    });

    return unsubscribe;
  };

  const handleFindOpponent = async () => {
    if (!auth.currentUser) {
      toast.warning("Please log in to find an opponent");
      return;
    }

    if (problemList.length === 0) {
      toast.error("No problems available. Please try again later.");
      return;
    }

    setIsSearching(true); // Set searching state
    setLoadingPopup(true); // Show loading popup
    const userId = auth.currentUser.uid;

    // Check for existing opponents
    const q = query(collection(db, '1v1-battles'), where('status', '==', 'search in progress'));
    const querySnapshot = await getDocs(q);

    let existingBattleDoc = null;

    // Look for a document with status 'search in progress'
    querySnapshot.forEach((doc) => {
      if (doc.id !== userId) {
        existingBattleDoc = doc; // Found an opponent
      }
    });

    if (existingBattleDoc) {
      // Append the current user to the existing users array
      const userInfo = {
        displayName: auth.currentUser.displayName,
        joinTime: new Date().toISOString(),
        uid: userId,
        totalSolved: 0,
        totalTimeTaken: 0
      };

      try {
        // Update the existing document's users array and status
        await updateDoc(existingBattleDoc.ref, {
          status: "found",
          users: arrayUnion(userInfo)
        });

        // Monitor battle status for both users
        monitorBattleStatus(existingBattleDoc.id);

        // Redirect to matched problem page
        const battleData = existingBattleDoc.data();
        const pid = battleData.pid;

        if (pid) {
          router.push(`/contest/1v1-battle/${existingBattleDoc.id}/${pid}`);
        } else {
          console.error("Problem ID not found in existing battle.");
        }
      } catch (error) {
        console.error("Error updating existing battle:", error);
        toast.error("Failed to join the battle. Please try again.");
      }
    } else {
      // No existing battle found, create a new battle document for the current user
      const userRef = doc(db, '1v1-battles', userId);
      console.log("Creating a new battle document...");

      const userInfo = {
        displayName: auth.currentUser.displayName,
        joinTime: new Date().toISOString(),
        uid: userId,
        totalSolved: 0,
        totalTimeTaken: 0
      };

      // Select a random problem ID from the problem list
      const randomIndex = Math.floor(Math.random() * problemList.length);
      const pid = problemList[randomIndex]?.id || 'defaultProblemId';

      try {
        await setDoc(userRef, {
          status: "search in progress",
          uid: userId,
          email: auth.currentUser.email,
          pid: pid, // Store the problem ID
          users: arrayUnion(userInfo)
        }, { merge: true });

        console.log("New battle document created with pid:", pid);
        setBattleId(userId); // Set battleId for canceling later

        // Monitor battle status for the current user
        monitorBattleStatus(userId);
      } catch (error) {
        console.error("Error creating new battle document:", error);
        toast.error("Failed to create a new battle. Please try again.");
      }
    }
  };

  const handleCancelSearch = async () => {
    try {
      if (battleId) {
        // Delete the battle document if the user wants to cancel the search
        await deleteDoc(doc(db, '1v1-battles', battleId));
        setIsSearching(false); // Reset searching state
        setLoadingPopup(false); // Hide loading popup
        setBattleId(null); // Reset battleId
        toast.info("Search canceled.");
      }
    } catch (error) {
      console.error("Error canceling the search:", error);
      toast.error("Failed to cancel search. Please try again.");
    }
  };


  const handleCreateRoom = () => {
    setShowPopup(true);
  };

  // const handle1v1Battle = () => {
  //   if (!auth.currentUser) {
  //     toast.warning("Please log in to participate");
  //     return;
  //   }

  //   if (problemList.length === 0) {
  //     toast.error("No problems available. Please try again later.");
  //     return;
  //   }

  //   const randomProblem = problemList[Math.floor(Math.random() * problemList.length)];

  //   router.push(`/contest/1v1-battle/${randomProblem.id}`);
  // };

  const handleJoinRoom = async () => {
    if (roomCode.trim() === '') {
      toast.error("Please enter a room code");
      return;
    }

    try {
      const roomRef = doc(db, 'rooms', roomCode);
      const roomSnapshot = await getDoc(roomRef);

      if (!roomSnapshot.exists()) {
        toast.error("Room code not found");
        return;
      }

      if (!auth.currentUser) {
        toast.warning("Please log in to join the room");
        return;
      }

      const roomData = roomSnapshot.data();
      const userAlreadyInRoom = roomData.users.some(user => user.uid === auth.currentUser.uid);

      if (userAlreadyInRoom) {
        // User is already in the room, just redirect them
        router.push(`/contest/room/${roomCode}`);
        return;
      }

      const now = new Date();

      await updateDoc(roomRef, {
        users: arrayUnion({
          uid: auth.currentUser.uid,
          displayName: auth.currentUser.displayName || "Unknown User",
          joinTime: now.toISOString(),
          solvedProblems: [],
          totalSolved: 0,
          totalTimeTaken: 0
        }),
      });

      router.push(`/contest/room/${roomCode}`);
    } catch (error) {
      console.error('Error joining room:', error);
      toast.error("Failed to join the room. Please try again.");
    }
  };

  const handleCreateNewRoom = async () => {
    const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    setGeneratedCode(newCode);

    try {
      if (!auth.currentUser) {
        toast.warning("Please log in to create a room");
        return;
      }

      const now = new Date();

      const roomData = {
        roomCode: newCode,
        createdAt: serverTimestamp(),
        createdBy: auth.currentUser.uid,
        status: "not-started",
        startedAt: null,
        topics: [],
        numProblems: 0,
        problems: [],
        users: [{
          uid: auth.currentUser.uid,
          displayName: auth.currentUser.displayName || "Unknown User",
          joinTime: now.toISOString(),
          solvedProblems: [],
          totalSolved: 0,
          totalTimeTaken: 0
        }]
      };

      await setDoc(doc(db, 'rooms', newCode), roomData);
      console.log('Room created successfully');
      router.push(`/contest/room/${newCode}`);
    } catch (error) {
      console.error('Error creating room:', error);
      toast.error('Failed to create room. Please try again.');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode).then(() => {
      toast.success("Copied to clipboard!");
    }, (err) => {
      console.error('Could not copy text: ', err);
      toast.error("Failed to copy room code");
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <h1 className="text-4xl font-bold my-12 text-[#DEA03C]">Contest Mode</h1>
      <div className="flex flex-col sm:flex-row gap-8">
        <button
          onClick={handleCreateRoom}
          className="bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white font-bold py-6 px-8 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 flex flex-col items-center"
        >
          <Users size={48} className="mb-4 text-[#DEA03C]" />
          <span className="text-xl">Join Room</span>
        </button>
        <button
          onClick={handleFindOpponent}
          className="bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white font-bold py-6 px-8 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 flex flex-col items-center"
        >
          <Swords size={48} className="mb-4 text-[#DEA03C]" />
          <span className="text-xl">1v1 Battle</span>
        </button>
      </div>

      {loadingPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-[#1a1a1a] p-8 rounded-lg shadow-lg w-96">
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#DEA03C]"></div>
            </div>
            <p className="text-center text-white mt-4">Searching for an opponent...</p>
            <button
              onClick={handleCancelSearch}
              className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
            >
              Cancel Search
            </button>
          </div>
        </div>
      )}

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-[#1a1a1a] p-8 rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#DEA03C]">Create or Join Room</h2>
              <button onClick={() => setShowPopup(false)} className="text-gray-500 hover:text-white">
                <X size={24} />
              </button>
            </div>
            <div className="flex mb-4">
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                placeholder="Enter room code"
                className="flex-grow px-3 py-2 bg-[#2a2a2a] text-white rounded-l-lg focus:outline-none"
              />
              <button
                onClick={handleJoinRoom}
                className="bg-[#DEA03C] text-black px-4 py-2 rounded-r-lg hover:bg-[#c78f35] transition duration-300"
              >
                Join
              </button>
            </div>
            <button
              onClick={handleCreateNewRoom}
              className="w-full bg-[#DEA03C] text-black px-4 py-2 rounded-lg hover:bg-[#c78f35] transition duration-300 mb-4"
            >
              Create New Room
            </button>
            {generatedCode && (
              <div className="flex items-center justify-between bg-[#2a2a2a] p-2 rounded-lg">
                <span className="text-white">{generatedCode}</span>
                <button onClick={copyToClipboard} className="text-[#DEA03C] hover:text-white transition duration-300">
                  <Copy size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContestPage;