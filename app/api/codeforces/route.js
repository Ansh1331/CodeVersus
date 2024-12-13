import axios from 'axios';

// Handle the GET request explicitly
export async function GET(req, res) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get('username');
  
  if (!username) {
    return new Response(JSON.stringify({ error: 'Username is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Fetch user submissions from Codeforces
    const response = await axios.get(`https://codeforces.com/api/user.status?handle=${username}`);
    const submissions = response.data.result;

    // Logging to inspect API response structure
    console.log('Codeforces API response:', submissions);

    // Count the number of solved problems by difficulty
    const solvedProblems = new Set(); // To store unique solved problems
    const difficultyCount = { Easy: 0, Medium: 0, Hard: 0 };

    submissions.forEach((submission) => {
      if (submission.verdict === 'OK') {
        const problemId = `${submission.problem.contestId}-${submission.problem.index}`;
        if (!solvedProblems.has(problemId)) {
          solvedProblems.add(problemId);

          // Determine difficulty level based on problem rating
          const problemRating = submission.problem.rating || 0; // Default to 0 if no rating
          if (problemRating === 0 || problemRating < 1500) {
            difficultyCount.Easy += 1;
          } else if (problemRating < 2000) {
            difficultyCount.Medium += 1;
          } else {
            difficultyCount.Hard += 1;
          }
        }
      }
    });

    // Return total solved and difficulty breakdown
    return new Response(
      JSON.stringify({
        totalSolved: solvedProblems.size,
        easySolved: difficultyCount.Easy,
        mediumSolved: difficultyCount.Medium,
        hardSolved: difficultyCount.Hard,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error fetching data from Codeforces:', error);
    return new Response(JSON.stringify({ error: 'Error fetching data from Codeforces' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
