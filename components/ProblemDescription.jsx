'use client';

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import dynamic from 'next/dynamic';

const SyntaxHighlighter = dynamic(
  () => import('react-syntax-highlighter').then((mod) => mod.PrismLight),
  { ssr: false }
);

const ProblemDescription = ({ problemMd }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const renderers = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';

      return !inline && match ? (
        <div className="bg-[#2a2a2a] rounded-lg p-4 my-4">
          {isMounted ? (
            <SyntaxHighlighter
              language={language}
              PreTag="div"
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          )}
        </div>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };

  return (
    <div className="prose prose-invert max-w-none">
      {problemMd ? (
        <ReactMarkdown components={renderers}>
          {problemMd}
        </ReactMarkdown>
      ) : (
        <p className="text-gray-300">No problem description available.</p>
      )}
    </div>
  );
};

export default ProblemDescription;