'use client'; // Add this line at the top

import React, { useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function LeetCodeProfile() {
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

  // Prepare data for the bar chart showing questions by difficulty
  const difficultyData = leetCodeData && codeforcesData ? [
    { difficulty: 'Easy', solved: (leetCodeData.easySolved || 0) + (codeforcesData.easySolved || 0) },
    { difficulty: 'Medium', solved: (leetCodeData.mediumSolved || 0) + (codeforcesData.mediumSolved || 0) },
    { difficulty: 'Hard', solved: (leetCodeData.hardSolved || 0) + (codeforcesData.hardSolved || 0) },
  ] : [];

  return (
    <>
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
    </>
  );
}
