import React, { useEffect, useRef } from 'react';
import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript'; // Import the generator

// Define the XML for the toolbox as a string.
const toolboxXML = `
  <xml>
    <category name="Logic" colour="%{BKY_LOGIC_HUE}">
      <block type="controls_if"></block>
      <block type="logic_compare"></block>
    </category>
    <category name="Loops" colour="%{BKY_LOOPS_HUE}">
      <block type="controls_repeat_ext">
        <value name="TIMES">
          <shadow type="math_number">
            <field name="NUM">10</field>
          </shadow>
        </value>
      </block>
    </category>
  </xml>
`;

function BlocklyComponent({ onCodeChange }) { // Accept the onCodeChange prop
  const blocklyDiv = useRef(null);
  const primaryWorkspace = useRef(null);

  useEffect(() => {
    if (blocklyDiv.current && !primaryWorkspace.current) {
      primaryWorkspace.current = Blockly.inject(blocklyDiv.current, {
        toolbox: toolboxXML,
        renderer: 'zelos'
      });

      // --- Add this event listener ---
      // This function will be called every time the workspace changes.
      const updateCode = () => {
        const code = javascriptGenerator.workspaceToCode(primaryWorkspace.current);
        onCodeChange(code); // Pass the generated code to the parent component
      };
      primaryWorkspace.current.addChangeListener(updateCode);
      // --- End of new code ---
    }

    return () => {
      if (primaryWorkspace.current) {
        primaryWorkspace.current.dispose();
        primaryWorkspace.current = null;
      }
    };
  }, []); // onCodeChange is stable, no need to add to dependencies

  return <div ref={blocklyDiv} className="w-full h-full" />;
}

export default BlocklyComponent;