import React, { useState } from 'react';
import BlocklyComponent from './components/BlocklyComponent';

function App() {
  // Create a state variable to hold the generated code
  const [generatedCode, setGeneratedCode] = useState('');

  return (
    <div className="flex h-screen">
      {/* Blockly Component will take the left 60% of the screen */}
      <div className="w-3/5 h-full">
        <BlocklyComponent onCodeChange={setGeneratedCode} />
      </div>

      {/* Code Preview will take the right 40% */}
      <div className="w-2/5 h-full bg-gray-800 text-white p-4 overflow-auto">
        <h2 className="text-xl font-bold mb-2">Generated Code</h2>
        <pre>
          <code>{generatedCode}</code>
        </pre>
      </div>
    </div>
  );
}

export default App;