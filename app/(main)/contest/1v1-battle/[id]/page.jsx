"use client";
import { useState, useEffect } from 'react';
import { fetchProblemContent, fetchBoilerplate, fetchProblemStructure, fetchTestCases, fetchFullBoilerplate } from '@/utils/githubProblemFetcher';
import CodeEditor from '@/components/codeEditor';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig'; // Ensure you have the correct import for your Firestore config

const JUDGE0_API = '/api/judge0';
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export default function ProblemPage() {
    const router = useRouter();
    const { id } = router.query; // Get the problem ID from the router
    const [problemMd, setProblemMd] = useState('');
    const [boilerplate, setBoilerplate] = useState('');
    const [fullBoilerplate, setFullBoilerplate] = useState('');
    const [structure, setStructure] = useState(null);
    const [testCases, setTestCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [code, setCode] = useState('');
    const [testResults, setTestResults] = useState([]);

    useEffect(() => {
        if (!id) return; // Ensure the ID is available

        async function fetchProblem() {
            try {
                const [md, initialCode, fullCode, structureData, cases] = await Promise.all([
                    fetchProblemContent(id),
                    fetchBoilerplate(id),
                    fetchFullBoilerplate(id),
                    fetchProblemStructure(id),
                    fetchTestCases(id, 4).catch(err => {
                        console.error('Error fetching test cases:', err);
                        return []; // Return an empty array if test cases can't be fetched
                    })
                ]);

                setProblemMd(md);
                setBoilerplate(initialCode);
                setFullBoilerplate(fullCode);
                setCode(initialCode);
                setStructure(structureData);
                setTestCases(cases);
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch problem:', err);
                setError(`Failed to load problem. Error: ${err.message}`);
                setLoading(false);
            }
        }

        fetchProblem();
    }, [id]);

    // (remaining code for running code, creating submissions, etc.)

    if (loading) return <div className="text-center text-gray-300 py-20">Loading problem...</div>;
    if (error) return <div className="text-center text-red-500 py-20">{error}</div>;

    return (
        <div className="">
            <div className="max-w-7xl mx-auto bg-[#1a1a1a] rounded-lg shadow-lg overflow-hidden">
                <div className="flex flex-col lg:flex-row">
                    <div className="lg:w-1/2 p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-gray-700">
                        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-[#DEA03C]">
                            {structure?.['Problem Name'] || 'Problem'}
                        </h1>
                        <div className="prose prose-invert max-w-none">
                            <ReactMarkdown
                                components={{
                                    code({ node, inline, className, children, ...props }) {
                                        const match = /language-(\w+)/.exec(className || '');
                                        return !inline && match ? (
                                            <div className="bg-[#272727] rounded-md px-3 py-8 my-4">
                                                <code className={className} {...props}>
                                                    {children}
                                                </code>
                                            </div>
                                        ) : (
                                            <code className="bg-[#272727] px-1 rounded" {...props}>
                                                {children}
                                            </code>
                                        );
                                    }
                                }}
                            >
                                {problemMd || 'No problem description available.'}
                            </ReactMarkdown>
                        </div>
                    </div>
                    <div className="lg:w-1/2 p-6 md:p-8">
                        <CodeEditor
                            language="cpp"
                            initialCode={boilerplate || '// No boilerplate code available'}
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
