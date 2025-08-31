import React, { useEffect, useRef } from 'react';
import * as Blockly from 'blockly';

// Define the XML for the toolbox as a string.
const toolboxXML = `
  <xml>
    <category name="Logic" colour="%{BKY_LOGIC_HUE}">
      <block type="controls_if"></block>
      <block type="logic_compare"></block>
      <block type="logic_operation"></block>
      <block type="logic_negate"></block>
      <block type="logic_boolean"></block>
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
    <category name="Math" colour="%{BKY_MATH_HUE}">
      <block type="math_number"></block>
      <block type="math_arithmetic"></block>
    </category>
  </xml>
`;

function BlocklyComponent() {
  const blocklyDiv = useRef(null);
  const primaryWorkspace = useRef(null);

  useEffect(() => {
    if (blocklyDiv.current && !primaryWorkspace.current) {
      // Inject the Blockly editor
      primaryWorkspace.current = Blockly.inject(blocklyDiv.current, {
        toolbox: toolboxXML, // Use the XML string here
        renderer: 'zelos'
      });
    }

    // Cleanup function
    return () => {
      if (primaryWorkspace.current) {
        primaryWorkspace.current.dispose();
        primaryWorkspace.current = null;
      }
    };
  }, []);

  // We only need the div for the workspace now.
  return <div ref={blocklyDiv} className="w-full h-full" />;
}

export default BlocklyComponent;