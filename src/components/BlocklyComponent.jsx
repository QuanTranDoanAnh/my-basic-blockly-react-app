import React, { useEffect, useRef, useCallback } from 'react';
import * as Blockly from 'blockly';
import { Generator } from 'blockly/core';
import { javascriptGenerator, Order } from 'blockly/javascript';

// --- CUSTOM BLOCK DEFINITION ---
Blockly.defineBlocksWithJsonArray([
  {
    "type": "draw_circle",
    "message0": "Draw Circle at x: %1 y: %2 with radius: %3",
    "args0": [
      { "type": "input_value", "name": "X", "check": "Number" },
      { "type": "input_value", "name": "Y", "check": "Number" },
      { "type": "input_value", "name": "RADIUS", "check": "Number" },
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 230,
    "tooltip": "Draws a circle on the canvas.",
    "helpUrl": "",
  },
]);


// --- SETUP OUR PRIVATE GENERATOR ---

// Create a true clone of the standard javascriptGenerator to inherit all its helper functions
const customGenerator = Object.create(javascriptGenerator);
// Give the clone its own copy of the block-to-code functions
customGenerator.forBlock = Object.assign({}, javascriptGenerator.forBlock);

// Add our custom block's generator to the clone
customGenerator.forBlock['draw_circle'] = function(block) {
  // Use `customGenerator` directly, not `this`
  const x = customGenerator.valueToCode(block, 'X', Order.ATOMIC) || 0;
  const y = customGenerator.valueToCode(block, 'Y', Order.ATOMIC) || 0;
  const radius = customGenerator.valueToCode(block, 'RADIUS', Order.ATOMIC) || 10;
  return `drawCircle(${x}, ${y}, ${radius});\n`;
};

// --- TOOLBOX DEFINITION ---
const toolboxXML = `
  <xml>
    <category name="Logic" colour="%{BKY_LOGIC_HUE}"><block type="controls_if"></block><block type="logic_compare"></block></category>
    <category name="Loops" colour="%{BKY_LOOPS_HUE}"><block type="controls_repeat_ext"><value name="TIMES"><shadow type="math_number"><field name="NUM">10</field></shadow></value></block></category>
    <category name="Drawing" colour="230"><block type="draw_circle"></block></category>
    <sep></sep>
    <category name="Values" colour="100"><block type="math_number"></block></category>
  </xml>
`;

// --- REACT COMPONENT ---
function BlocklyComponent({ onCodeChange }) {
  const blocklyDiv = useRef(null);
  const primaryWorkspace = useRef(null);

  const updateCode = useCallback((event) => {
    if (event.isUiEvent) {
      // CHANGE 4: Use our private generator instance to generate the code.
      const code = customGenerator.workspaceToCode(primaryWorkspace.current);
      onCodeChange(code);
    }
  }, [onCodeChange]);

  useEffect(() => {
    if (blocklyDiv.current && !primaryWorkspace.current) {
      primaryWorkspace.current = Blockly.inject(blocklyDiv.current, {
        toolbox: toolboxXML,
        renderer: 'zelos'
      });
      primaryWorkspace.current.addChangeListener(updateCode);
    }

    return () => {
      if (primaryWorkspace.current) {
        primaryWorkspace.current.dispose();
        primaryWorkspace.current = null;
      }
    };
  }, [updateCode]);

  return <div ref={blocklyDiv} className="w-full h-full" />;
}

export default BlocklyComponent;