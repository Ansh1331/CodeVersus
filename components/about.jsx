import React from 'react';
import { Users, Crosshair, Trophy, Star } from 'lucide-react';
import CornerSVG from './cornersvg';
import Link from 'next/link';

const FeatureBox = ({ icon: Icon, text }) => (
  <div className="flex flex-col items-center justify-between p-5 border rounded-lg border-white w-full h-40">
    <div className="w-20 h-20 rounded-full border border-gray-600 flex items-center justify-center mb-2">
      <Icon className="text-[#DEA03C]" size={24} />
    </div>
    <p className="text-center text-gray-300">{text}</p>
  </div>
);

const Testimonial = ({ text, author }) => (
  <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
    <p className="text-gray-300 italic mb-4">"{text}"</p>
    <p className="text-[#DEA03C] font-semibold">- {author}</p>
  </div>
);

const FeatureHighlight = ({ title, description, icon: Icon }) => (
  <div className="flex items-start space-x-4">
    <div className="flex-shrink-0">
      <Icon className="text-[#DEA03C]" size={24} />
    </div>
    <div>
      <h3 className="text-white font-semibold mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  </div>
);

const ChallengeCard = ({ title, difficulty, description }) => (
  <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
    <h3 className="text-white font-semibold mb-2">{title}</h3>
    <p className={`text-sm mb-3 ${
      difficulty === 'Easy' ? 'text-green-400' :
      difficulty === 'Medium' ? 'text-yellow-400' :
      'text-red-400'
    }`}>{difficulty}</p>
    <p className="text-gray-300 text-sm">{description}</p>
  </div>
);

const About = () => {
  return (
    <div className="w-full px-4 md:px-12 relative">
      <div className='flex flex-col justify-center items-center mt-5 absolute left-3 sm:left-11 top-12'>
        <div className='w-5 h-5 rounded-full bg-[#DEA03C]' />
        <div className='w-1 sm:h-80 h-40 black-white-gradient' />
      </div>
      <div className="flex flex-col md:flex-row items-start justify-between mb-12">
        <div className="max-w-2xl text-left mb-6 md:mb-0">
          <h1 className="text-2xl md:text-5xl font-bold mb-6 text-white">
            Code. Compete. Conquer.
          </h1>
          <p className="text-sm md:text-xl text-gray-300 leading-relaxed ml-12">
            We are the next generation of competitive programming platforms,
            bridging the gap between learning and mastery.
          </p>
        </div>
        <div className="flex items-center justify-center border rounded-lg border-white p-8 mr-10">
          <div className="flex items-center justify-center mr-4">
            <span className="text-[#DEA03C] font-bold text-xl">6</span>
          </div>
          <p className="text-white text-lg">Users</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-10 mb-16">
        <Link href='/roadmap'>
          <FeatureBox icon={Users} text="Personalized Roadmap" />
        </Link>
        <Link href='/contest'>
          <FeatureBox icon={Crosshair} text="1v1 Battles" />
        </Link>
        <Link href='/contest'>
          <FeatureBox icon={Trophy} text="Contest Rooms" />
        </Link>
      </div>
      
      {/* Testimonial Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Testimonial 
            text="This platform has revolutionized the way I approach competitive programming. The personalized roadmap is a game-changer!"
            author="Jane Doe, Software Engineer"
          />
          <Testimonial 
            text="The 1v1 battles have significantly improved my problem-solving skills under pressure. Highly recommended!"
            author="John Smith, CS Student"
          />
        </div>
      </div>

      {/* Feature Highlight Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-white mb-8">Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FeatureHighlight 
            icon={Star}
            title="Adaptive Learning"
            description="Our AI-powered system adjusts to your skill level, ensuring you're always challenged but never overwhelmed."
          />
          <FeatureHighlight 
            icon={Users}
            title="Vibrant Community"
            description="Connect with fellow coders, share insights, and grow together in our supportive community."
          />
        </div>
      </div>

      {/* Featured Challenges Section */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Featured Challenges</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ChallengeCard 
            title="Two Sum"
            difficulty="Easy"
            description="Given an array of integers, return indices of the two numbers such that they add up to a specific target."
          />
          <ChallengeCard 
            title="Longest Substring Without Repeating Characters"
            difficulty="Medium"
            description="Find the length of the longest substring without repeating characters in a given string."
          />
          <ChallengeCard 
            title="Median of Two Sorted Arrays"
            difficulty="Hard"
            description="Find the median of two sorted arrays with a runtime complexity of O(log (m+n))."
          />
        </div>
      </div>

      {/* Thank You Message */}
      <div className="text-center mt-16 mb-8">
        <p className="text-2xl text-[#DEA03C] font-semibold">Thank You...</p>
      </div>

      <CornerSVG />
    </div>
  );
};

export default About;