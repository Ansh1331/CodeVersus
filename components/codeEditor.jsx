import React from 'react';
import MonacoEditor from 'react-monaco-editor';

export default function CodeEditor({ language, initialCode, onChange }) {
    const options = {
        selectOnLineNumbers: true,
        roundedSelection: false,
        readOnly: false,
        cursorStyle: 'line',
        automaticLayout: true,
    };

    return (
        <MonacoEditor
            width="100%"
            height="400"
            language={language}
            theme="vs-dark"
            value={initialCode}
            options={options}
            onChange={onChange}
        />
    );
}