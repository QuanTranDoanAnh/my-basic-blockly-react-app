import React from 'react';
import BlocklyComponent from './components/BlocklyComponent';

function App() {
  return (
    <div className="flex h-screen">
      {/* Blockly Workspace */}
      <div className="w-full">
        <BlocklyComponent />
      </div>
    </div>
  );
}

export default App;