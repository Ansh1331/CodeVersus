// components/NextChallenges.js
export default function NextChallenges({ userData, suggestedProblems }) {
    return (
        <div className="bg-[#1a1a1a] rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Next Challenges</h2>
            <p className="mb-4">
                Based on your progress, we recommend focusing on:
                <span className="text-[#DEA03C] font-bold"> {userData.nextTopic}</span>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {suggestedProblems.map((problem, index) => (
                    <div key={index} className="bg-[#272727] p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">{problem.name}</h3>
                        <p>
                            Difficulty:{" "}
                            <span
                                className={`${problem.difficulty === "Easy" ? "text-green-400" :
                                        problem.difficulty === "Medium" ? "text-yellow-400" :
                                            "text-red-500"
                                    }`}
                            >
                                {problem.difficulty}
                            </span>
                        </p>
                        <p>Topic: {problem.topic}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
