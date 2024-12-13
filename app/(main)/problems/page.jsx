// app/problems/page.js
"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchProblemList } from '@/utils/githubProblemFetcher';
import { BsCheckCircle } from 'react-icons/bs';

export default function ProblemsPage() {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [solvedProblems, setSolvedProblems] = useState([]); // This should be populated with actual solved problems
    const router = useRouter();

    useEffect(() => {
        async function loadProblems() {
            try {
                const problemList = await fetchProblemList();
                setProblems(problemList);
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch problems:', err);
                setError(`Failed to load problems. Error: ${err.message}`);
                setLoading(false);
            }
        }
        loadProblems();
    }, []);

    const handleRowClick = (problemId) => {
        router.push(`/problems/${problemId}`);
    };

    if (loading) return <div className="text-white">Loading problems...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="min-h-screen bg-transparent text-white">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8 text-[#DEA03C]">Problems</h1>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead className="bg-transparent text-[#DEA03C]">
                            <tr>
                                <th className="w-16"></th>
                                <th className="w-16"></th>
                                <th className="px-6 py-3 text-left">Problem</th>
                            </tr>
                        </thead>
                        <tbody>
                            {problems.map((problem, idx) => (
                                <tr 
                                    key={problem.id} 
                                    onClick={() => handleRowClick(problem.id)}
                                    className="border-b border-gray-800 hover:border-[#DEA03C] transition-colors duration-200 cursor-pointer"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        {solvedProblems.includes(problem.id) && (
                                            <BsCheckCircle className="text-green-500 inline" size={20} />
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                                        {idx + 1}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="hover:text-[#e8d4bc] transition-colors duration-200">
                                            {problem.name}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}