// utils/githubProblemFetcher.js
import axios from 'axios';

const API_BASE_URL = '/api/github-proxy';

const LANGUAGE_EXTENSIONS = {
  cpp: 'cpp',
  java: 'java',
  javascript: 'js',
  rust: 'rs'
};

export async function fetchProblemList() {
    const response = await fetchProblemFromGithub('problems');
    
    return response
        .filter(item => item.type === 'dir')
        .map(item => ({
            id: item.name,
            name: item.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
        }));
}

export async function fetchProblemFromGithub(path) {
    const url = `${API_BASE_URL}?path=${encodeURIComponent(path)}`;
    console.log('Fetching from:', url);
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching from GitHub:', error);
        console.error('Error response:', error.response?.data);
        throw error;
    }
}

export async function fetchProblemContent(problemId) {
    return await fetchProblemFromGithub(`problems/${problemId}/Problem.md`);
}

export async function fetchBoilerplate(problemId, language = 'cpp') {
    const extension = LANGUAGE_EXTENSIONS[language] || 'cpp';
    return await fetchProblemFromGithub(`problems/${problemId}/boilerplate/function.${extension}`);
}

export async function fetchTestCases(problemId, limit = 3) {
    const testCases = [];
    
    for (let i = 0; i < limit; i++) {
        try {
            const [input, output] = await Promise.all([
                fetchProblemFromGithub(`problems/${problemId}/tests/inputs/${i}.txt`),
                fetchProblemFromGithub(`problems/${problemId}/tests/outputs/${i}.txt`)
            ]);

            // Ensure input and output are strings
            const inputString = typeof input === 'string' ? input : JSON.stringify(input);
            const outputString = typeof output === 'string' ? output : JSON.stringify(output);

            testCases.push({ 
                input: inputString.trim(), 
                expectedOutput: outputString.trim() 
            });
        } catch (error) {
            if (error.response && error.response.status === 404) {
                // We've reached the end of available test cases
                break;
            } else {
                console.error(`Error fetching test case ${i} for problem ${problemId}:`, error);
                throw error;
            }
        }
    }

    return testCases;
}

export async function fetchProblemStructure(problemId) {
    const structureContent = await fetchProblemFromGithub(`problems/${problemId}/Structure.md`);
    const structureLines = structureContent.split('\n');
    const structure = {};

    structureLines.forEach(line => {
        const [key, value] = line.split(':').map(s => s.trim());
        if (key && value) {
            structure[key] = value;
        }
    });

    return structure;
}

export async function fetchFullBoilerplate(problemId, language = 'cpp') {
    const extension = LANGUAGE_EXTENSIONS[language] || 'cpp';
    return await fetchProblemFromGithub(`problems/${problemId}/boilerplate-full/function.${extension}`);
}

export async function fetchAllBoilerplates(problemId) {
    const boilerplates = {};
    const fullBoilerplates = {};

    for (const language of Object.keys(LANGUAGE_EXTENSIONS)) {
        try {
            boilerplates[language] = await fetchBoilerplate(problemId, language);
            fullBoilerplates[language] = await fetchFullBoilerplate(problemId, language);
        } catch (error) {
            console.error(`Error fetching boilerplate for ${language}:`, error);
            // If a language is not available, set it to an empty string
            boilerplates[language] = '';
            fullBoilerplates[language] = '';
        }
    }

    return { boilerplates, fullBoilerplates };
}