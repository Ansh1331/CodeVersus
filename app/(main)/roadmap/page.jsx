'use client'

import React, { useState } from 'react';
import { Clock, Book, Youtube } from 'lucide-react';
import NextChallenges from '@/components/NextChallenge';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const suggestedProblems = [
  { name: "Find Minimum in Rotated Sorted Array", difficulty: "Medium", topic: "Binary Search" },
  { name: "Search in Rotated Sorted Array", difficulty: "Hard", topic: "Binary Search" },
  { name: "Implement Binary Search", difficulty: "Easy", topic: "Binary Search" },
];
// BarChartComponent with manual proportions and percentage-based bars
// BarChartComponent with manual proportions and percentage-based bars
const BarChartComponent = ({ data, totalQuestions }) => {
  // Assigning manual proportions based on totalQuestions
  const proportions = {
    Arrays: 0.35,        // 35% of total
    'Two Pointers': 0.25, // 25% of total
    Stack: 0.15,         // 15% of total
    Trees: 0.15,         // 15% of total
    Graphs: 0.10         // 10% of total
  };

  // State to track the hovered category
  const [hoveredCategory, setHoveredCategory] = useState(null);

  return (
    <div className="flex flex-col space-y-2">
      {data.map((item, index) => {
        const proportion = proportions[item.name] * totalQuestions;

        return (
          <div key={index} className="flex items-center">
            <div className="w-24 text-sm">{item.name}</div>
            <div 
              className="flex-1 bg-gray-700 h-6 rounded-full overflow-hidden"
              onMouseEnter={() => setHoveredCategory(item.name)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <div
                className="bg-[#DEA03C] h-full rounded-full"
                style={{ width: `${proportion}%` }}
              ></div>
            </div>
            {/* Show the number of solved questions on hover */}
            {hoveredCategory === item.name && (
              <div className="text-sm ml-2 text-[#DEA03C]">
                {Math.round(proportion)} Questions
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};


export default function RoadmapPage() {
  // LeetCodeProfile state management
  const [leetCodeUsername, setLeetCodeUsername] = useState('');
  const [codeforcesUsername, setCodeforcesUsername] = useState('');
  const [leetCodeData, setLeetCodeData] = useState(null);
  const [codeforcesData, setCodeforcesData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Fetch LeetCode data
      const leetCodeResponse = await axios.get(`/api/leetcode?username=${leetCodeUsername}`);
      setLeetCodeData(leetCodeResponse.data);

      // Fetch Codeforces data
      const codeforcesResponse = await axios.get(`/api/codeforces?username=${codeforcesUsername}`);
      setCodeforcesData(codeforcesResponse.data);
    } catch (err) {
      setError('Error fetching user data. Please check the usernames and try again.');
    }

    setLoading(false);
  };

  // Calculate the total questions solved from both LeetCode and Codeforces
  const totalQuestionsSolved = (leetCodeData?.totalSolved || 0) + (codeforcesData?.totalSolved || 0);

  // Prepare userData manually
  const userData = {
    totalSolved: totalQuestionsSolved,
    topicProgress: [
      { name: 'Arrays', solved: leetCodeData?.arraysSolved || 0, total: totalQuestionsSolved * 0.35 },
      { name: 'Two Pointers', solved: leetCodeData?.twoPointersSolved || 0, total: totalQuestionsSolved * 0.25 },
      { name: 'Stack', solved: leetCodeData?.stackSolved || 0, total: totalQuestionsSolved * 0.15 },
      { name: 'Trees', solved: leetCodeData?.treesSolved || 0, total: totalQuestionsSolved * 0.15 },
      { name: 'Graphs', solved: leetCodeData?.graphsSolved || 0, total: totalQuestionsSolved * 0.10 },
    ],
    nextTopic: 'Binary Search', // You can modify this to be dynamic if needed
  };

  // Prepare data for the bar chart showing questions by difficulty
  const difficultyData = leetCodeData && codeforcesData ? [
    { difficulty: 'Easy', solved: (leetCodeData.easySolved || 0) + (codeforcesData.easySolved || 0) },
    { difficulty: 'Medium', solved: (leetCodeData.mediumSolved || 0) + (codeforcesData.mediumSolved || 0) },
    { difficulty: 'Hard', solved: (leetCodeData.hardSolved || 0) + (codeforcesData.hardSolved || 0) },
  ] : [];

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-8">
      {/* This is where your navbar would be */}
      
      {/* LeetCode Profile Section */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-4">
          <Input
            type="text"
            value={leetCodeUsername}
            onChange={(e) => setLeetCodeUsername(e.target.value)}
            placeholder="Enter LeetCode username"
            className="flex-grow"
          />
          <Input
            type="text"
            value={codeforcesUsername}
            onChange={(e) => setCodeforcesUsername(e.target.value)}
            placeholder="Enter Codeforces username"
            className="flex-grow"
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Fetch Data'}
          </Button>
        </div>
      </form>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {(leetCodeData || codeforcesData) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Solved Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-5xl font-bold text-DEA03C">{totalQuestionsSolved}</p>
              <br />
              <p className="text-lg text-[#DEA03C]">LeetCode: {leetCodeData?.totalSolved || 0} questions</p>
              <br />
              <p className="text-lg text-[#DEA03C]">Codeforces: {codeforcesData?.totalSolved || 0} questions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Questions by Difficulty</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={difficultyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="difficulty" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="solved" fill="#DEA03C" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Progress Overview */}
      <div className="bg-[#1a1a1a] rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Progress Overview</h2>
        <p className="text-xl mb-4">Total Problems Solved: <span className="text-[#DEA03C] font-bold">{totalQuestionsSolved}</span></p>
        <BarChartComponent data={userData.topicProgress} totalQuestions={totalQuestionsSolved} />
      </div>

      <NextChallenges userData={userData} suggestedProblems={suggestedProblems} />
      {/* Start a New Topic */}
      <div className="bg-[#1a1a1a] rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Start a New Topic</h2>
        <p className="mb-4">Ready to explore {userData.nextTopic}? Here are some resources to get you started:</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#272727] p-4 rounded-lg flex items-center">
            <Book className="mr-2 text-[#DEA03C]" />
            <span>Introduction to Heaps</span>
          </div>
          <div className="bg-[#272727] p-4 rounded-lg flex items-center">
            <Youtube className="mr-2 text-[#DEA03C]" />
            <span>Heap Implementation Tutorial</span>
          </div>
          <div className="bg-[#272727] p-4 rounded-lg flex items-center">
            <Book className="mr-2 text-[#DEA03C]" />
            <span>Priority Queue Problems</span>
          </div>
        </div>
      </div>

      
      {/* Create Study Plan */}
      <div className="bg-[#1a1a1a] rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Create Your Study Plan</h2>
        <p className="mb-4">Set your learning goals and we'll create a personalized study plan for you.</p>
        <div className="flex flex-col md:flex-row items-end space-y-4 md:space-y-0 md:space-x-4">
          <div className="w-full md:w-1/3">
            <label className="block mb-2">Questions per day</label>
            <input type="number" className="w-full bg-[#272727] rounded px-3 py-2" placeholder="No. of problems" />
          </div>
          <div className="w-full md:w-1/3">
            <label className="block mb-2">Target completion date</label>
            <input type="date" className="w-full bg-[#272727] rounded px-3 py-2" />
          </div>
          <button className="w-full md:w-auto bg-[#DEA03C] text-[#0f0f0f] px-6 py-2 rounded-lg font-semibold
          hover:bg-opacity-90 transition duration-300">
            Commit
          </button>
        </div>
      </div>
    </div>
  );
}
