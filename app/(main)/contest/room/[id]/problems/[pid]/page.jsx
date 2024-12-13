"use client"
import { useState, useEffect } from 'react';
import { fetchProblemContent, fetchProblemStructure, fetchTestCases, fetchAllBoilerplates } from '@/utils/githubProblemFetcher';
import CodeEditor from '@/components/codeEditor';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import { auth, db } from '@/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Link from 'next/link';

const JUDGE0_API = '/api/judge0';
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const LANGUAGES = {
  cpp: { id: 54, name: 'C++', extension: 'cpp' },
  java: { id: 62, name: 'Java', extension: 'java' },
  javascript: { id: 63, name: 'JavaScript', extension: 'js' },
  rust: { id: 73, name: 'Rust', extension: 'rs' }
};

export default function ProblemPage({ params }) {
    const router = useRouter();
    const [problemMd, setProblemMd] = useState('');
    const [boilerplate, setBoilerplate] = useState({});
    const [fullBoilerplate, setFullBoilerplate] = useState({});
    const [structure, setStructure] = useState(null);
    const [testCases, setTestCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [code, setCode] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('cpp');
    const [testResults, setTestResults] = useState([]);
    const [timeLeft, setTimeLeft] = useState(90 * 60); // 90 minutes in seconds
    const [contestStartTime, setContestStartTime] = useState(null);

    useEffect(() => {
        async function fetchProblemAndRoomData() {
            try {
                const [md, structureData, cases, roomData, allBoilerplates] = await Promise.all([
                    fetchProblemContent(params.pid),
                    fetchProblemStructure(params.pid),
                    fetchTestCases(params.pid, 2).catch(err => {
                        console.error('Error fetching test cases:', err);
                        return [];
                    }),
                    getDoc(doc(db, "rooms", params.id)).then(doc => doc.data()),
                    fetchAllBoilerplates(params.pid)
                ]);

                setProblemMd(md);
                setStructure(structureData);
                setTestCases(cases);
                setContestStartTime(roomData.startedAt.toDate());

                setBoilerplate(allBoilerplates.boilerplates);
                setFullBoilerplate(allBoilerplates.fullBoilerplates);
                setCode(allBoilerplates.boilerplates.cpp || ''); // Set default to C++

                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch problem or room data:', err);
                setError(`Failed to load problem or room data. Error: ${err.message}`);
                setLoading(false);
            }
        }
        fetchProblemAndRoomData();
    }, [params.pid, params.id]);

    useEffect(() => {
        if (contestStartTime) {
            const timer = setInterval(() => {
                const now = new Date();
                const diff = 90 * 60 - Math.floor((now - contestStartTime) / 1000);
                if (diff <= 0) {
                    clearInterval(timer);
                    setTimeLeft(0);
                    router.push(`/contest/room/${params.id}/leaderboard`);
                } else {
                    setTimeLeft(diff);
                }
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [contestStartTime, params.id, router]);

    const handleLanguageChange = (event) => {
        const newLanguage = event.target.value;
        setSelectedLanguage(newLanguage);
        setCode(boilerplate[newLanguage] || '');
    };

    const runCode = async () => {
        setTestResults([]);
        let allTestsPassed = true;
        for (let i = 0; i < testCases.length; i++) {
            const testCase = testCases[i];
            try {
                const fullCode = fullBoilerplate[selectedLanguage]
                    .replace('##USER_CODE_HERE##', code)
                    .replace('##INPUT_FILE_INDEX##', i.toString());

                const submission = await createSubmission(fullCode, testCase.input, LANGUAGES[selectedLanguage].id);
                if (!submission) {
                    throw new Error("Failed to create submission");
                }

                const result = await getSubmissionResult(submission.token);

                const passed = result.status.description === "Accepted" && result.stdout.trim() === testCase.expectedOutput.trim();
                if (!passed) allTestsPassed = false;
                setTestResults(prev => [...prev, {
                    passed,
                    output: result.stdout || "No output",
                    expected: testCase.expectedOutput,
                    input: testCase.input,
                    error: result.stderr || (result.status.description !== "Accepted" ? result.status.description : "")
                }]);

                await delay(2000);
            } catch (error) {
                console.error('Error in runCode:', error);
                allTestsPassed = false;
                setTestResults(prev => [...prev, {
                    passed: false,
                    error: error.message || "Unknown error occurred",
                    input: testCase.input,
                    expected: testCase.expectedOutput,
                    output: "No output due to error"
                }]);
            }
        }

        if (allTestsPassed) {
            console.log("All tests passed. Updating user progress...");
            await updateUserProgress();
        } else {
            console.log("Not all tests passed. Progress not updated.");
        }
    };

    const updateUserProgress = async () => {
        if (!auth.currentUser) {
            console.error("No authenticated user found");
            toast.error("You must be logged in to update progress");
            return;
        }
    
        try {
            const roomRef = doc(db, "rooms", params.id);
            const roomDoc = await getDoc(roomRef);
            if (!roomDoc.exists()) {
                console.error("Room document not found");
                toast.error("Contest room not found");
                return;
            }
    
            const roomData = roomDoc.data();
            const userIndex = roomData.users.findIndex(user => user.uid === auth.currentUser.uid);
            
            if (userIndex === -1) {
                console.error("User not found in room");
                toast.error("You are not a participant in this contest");
                return;
            }
    
            const currentUser = roomData.users[userIndex];
            const timeTaken = 90 * 60 - timeLeft;
    
            // Check if the problem is already solved
            if (currentUser.solvedProblems && currentUser.solvedProblems.includes(params.pid)) {
                console.log("Problem already solved by user");
                toast.info("You've already solved this problem!");
                return;
            }
    
            // Create a new users array with the updated data
            const updatedUsers = [...roomData.users];
            updatedUsers[userIndex] = {
                ...currentUser,
                solvedProblems: [...(currentUser.solvedProblems || []), params.pid],
                totalSolved: (currentUser.totalSolved || 0) + 1,
                totalTimeTaken: (currentUser.totalTimeTaken || 0) + timeTaken
            };
    
            // Update the entire users array
            await updateDoc(roomRef, { users: updatedUsers });
    
            console.log("User progress updated successfully");
            toast.success("Problem solved! Your progress has been updated.");
        } catch (error) {
            console.error("Error updating user progress:", error);
            toast.error("Failed to update progress. Please try again.");
        }
    };

    const createSubmission = async (sourceCode, stdin, languageId) => {
        try {
            const response = await axios.post(JUDGE0_API, {
                source_code: sourceCode,
                language_id: languageId,
                stdin: stdin
            });
            if (response.data.error) {
                throw new Error(response.data.error);
            }
            return response.data;
        } catch (error) {
            console.error('Error creating submission:', error);
            throw new Error(error.response?.data?.error || error.message || 'Failed to create submission');
        }
    };

    const getSubmissionResult = async (token) => {
        let attempts = 0;
        const maxAttempts = 10;
        const pollingInterval = 2000; // 2 seconds

        while (attempts < maxAttempts) {
            try {
                const response = await axios.get(`${JUDGE0_API}?token=${token}`);
                if (response.data.error) {
                    throw new Error(response.data.error);
                }

                if (response.data.status.id <= 2) { // 1: In Queue, 2: Processing
                    await delay(pollingInterval);
                    attempts++;
                } else {
                    return response.data;
                }
            } catch (error) {
                console.error('Error fetching submission result:', error);
                throw new Error(error.response?.data?.error || error.message || 'Failed to fetch submission result');
            }
        }
        throw new Error('Timed out waiting for submission result');
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (loading) return <div className="text-center text-gray-300 py-20">Loading problem...</div>;
    if (error) return <div className="text-center text-red-500 py-20">{error}</div>;

    return (
        <div className="">
            <div className="max-w-7xl mx-auto bg-[#1a1a1a] rounded-lg shadow-lg overflow-hidden">
                <div className="p-4 bg-[#2a2a2a] text-white flex justify-between items-center">
                    <Link href={`/contest/room/${params.id}/problems`} className="text-[#DEA03C] hover:text-[#C89030]">
                        ← Back to Problems
                    </Link>                    
                    <span className="font-bold">Time Left: </span>{formatTime(timeLeft)}
                </div>
                <div className="flex flex-col lg:flex-row">
                    <div className="lg:w-1/2 p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-gray-700">
                        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-[#DEA03C]">
                            {structure?.['Problem Name'] || 'Problem'}
                        </h1>
                        <div className="prose prose-invert max-w-none">
                            <ReactMarkdown>
                                {problemMd || 'No problem description available.'}
                            </ReactMarkdown>
                        </div>
                    </div>
                    <div className="lg:w-1/2 p-6 md:p-8">
                        <div className="mb-4">
                            {/* <label htmlFor="language-select" className="block text-sm font-medium text-gray-300 mb-2">
                                Select Language:
                            </label> */}
                            <select
                                id="language-select"
                                value={selectedLanguage}
                                onChange={handleLanguageChange}
                                className="bg-[#2a2a2a] text-white border border-gray-600 rounded-md p-2 w-full"
                            >
                                {Object.entries(LANGUAGES).map(([key, lang]) => (
                                    <option key={key} value={key}>{lang.name}</option>
                                ))}
                            </select>
                        </div>
                        <CodeEditor
                            language={selectedLanguage}
                            initialCode={code}
                            onChange={setCode}
                        />
                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                className="px-5 py-2 rounded-md text-sm font-medium text-white bg-[#2a2a2a] hover:bg-[#3a3a3a] transition-colors duration-200"
                                onClick={runCode}
                            >
                                Run
                            </button>
                            <button
                                className="px-5 py-2 rounded-md text-sm font-medium text-white bg-[#DEA03C] hover:bg-[#C89030] transition-colors duration-200"
                                onClick={() => console.log('Submit code')}
                            >
                                Submit
                            </button>
                        </div>
                        {testResults.length > 0 && (
                            <div className="mt-6 bg-[#272727] rounded-md p-4">
                                <h3 className="text-lg font-semibold mb-3 text-[#DEA03C]">Test Results:</h3>
                                {testResults.map((result, index) => (
                                    <div key={index} className={`mt-3 p-3 rounded-md ${result.passed ? 'bg-green-900' : 'bg-red-900'}`}>
                                        <p className="font-medium">Test Case {index + 1}: {result.passed ? 'Passed' : 'Failed'}</p>
                                        <p className="text-sm mt-1"><strong>Input:</strong> {result.input}</p>
                                        <p className="text-sm mt-1"><strong>Expected Output:</strong> {result.expected}</p>
                                        <p className="text-sm mt-1"><strong>Actual Output:</strong> {result.output}</p>
                                        {result.error && <p className="text-sm mt-1 text-red-400"><strong>Error:</strong> {result.error}</p>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}