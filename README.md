# CodeVersus

CodeVersus is an interactive coding platform where users can engage in coding challenges, participate in private contests, and track their coding progress. The platform integrates with popular coding sites like LeetCode and Codeforces and offers a leaderboard system for 1v1 coding battles. Users can sign up, compete in challenges, and improve their skills in a competitive environment.

## Features

- **1v1 Coding Battles**: Users can compete against each other in real-time coding challenges.
- **Leaderboard**: Track user performance and ranking based on their battle results.
- **Private Contests**: Create and participate in private contests with friends or colleagues.
- **Problem Bank**: A list of coding problems for users to solve, with difficulty levels and categories.
- **Integration with External Platforms**: Sync coding progress with platforms like LeetCode and Codeforces.
- **User Profiles**: Keep track of coding history, challenges, and progress over time.

## Tech Stack

- **Frontend**: 
  - Next.js
  - React
  - Tailwind CSS
- **Backend**:
  - Firebase (Authentication, Database, Storage)
- **APIs**: 
  - Judge0 (For executing code)
- **Authentication**: Google OAuth (Firebase Authentication)
- **Deployment**: Vercel

## Setup Instructions

### Prerequisites

1. **Node.js** (v18 or higher)
2. **Firebase Project**:
   - Set up a Firebase project at [Firebase Console](https://console.firebase.google.com/).
   - Add a Firebase web app to the project and get the configuration details (API Key, Auth Domain, etc.).
   - Enable Firebase Authentication (Google OAuth) and Firestore Database.

3. **Vercel Account** (for deployment):
   - Set up a Vercel account at [Vercel](https://vercel.com/).

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/codeversus.git
   cd codeversus
