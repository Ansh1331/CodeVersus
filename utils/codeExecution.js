// utils/codeExecution.js
import axios from 'axios';
import { fetchTestCases, fetchFullBoilerplate } from './githubProblemFetcher';

const JUDGE0_API = 'https://judge0-ce.p.rapidapi.com';
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY;
const GITHUB_OWNER = 'gautam-4';
const GITHUB_REPO = 'codeversus';

export async function runCode(userCode, problemId, isSubmission = false) {
    const { inputs, outputs } = await fetchTestCases(GITHUB_OWNER, GITHUB_REPO, problemId);
    const fullBoilerplate = await fetchFullBoilerplate(GITHUB_OWNER, GITHUB_REPO, problemId);
    const testCases = isSubmission ? inputs.length : Math.min(inputs.length, 2);  // Run all for submission, max 2 for 'Run'

    const results = [];

    for (let i = 0; i < testCases; i++) {
        const fullCode = fullBoilerplate.replace('##USER_CODE_HERE##', userCode)
                                        .replace('##INPUT_FILE_INDEX##', i.toString());

        const response = await axios.post(`${JUDGE0_API}/submissions`, {
            source_code: fullCode,
            language_id: 54,  // C++
            stdin: inputs[i],
            expected_output: outputs[i]
        }, {
            headers: {
                'X-RapidAPI-Key': JUDGE0_API_KEY,
                'Content-Type': 'application/json'
            }
        });

        const result = await getSubmissionResult(response.data.token);
        results.push(result);
    }

    return results;
}

async function getSubmissionResult(token) {
    const response = await axios.get(`${JUDGE0_API}/submissions/${token}`, {
        headers: {
            'X-RapidAPI-Key': JUDGE0_API_KEY,
        }
    });

    return response.data;
}