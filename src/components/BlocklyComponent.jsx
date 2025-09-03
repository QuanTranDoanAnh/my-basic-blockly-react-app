import React, { useEffect, useRef, useCallback } from "react";
import * as Blockly from "blockly";
import { Generator } from "blockly/core";
import { javascriptGenerator, Order } from "blockly/javascript";

// --- CUSTOM BLOCK DEFINITION ---
Blockly.defineBlocksWithJsonArray([
  // --- 1. Navigation Actions (Blue) ---
  {
    type: "sap_login",
    message0: "Login to SAP system %1 client %2 user %3 password %4",
    args0: [
      { type: "input_value", name: "SYSTEM_ID", check: "String" },
      { type: "input_value", name: "CLIENT", check: "String" },
      { type: "input_value", name: "USER", check: "String" },
      { type: "input_value", name: "PASSWORD", check: "String" },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 230,
    tooltip: "Logs into a specific SAP system.",
    helpUrl: "",
  },
  {
    type: "sap_execute_transaction",
    message0: "Go to T-code %1",
    args0: [{ type: "input_value", name: "TCODE", check: "String" }],
    previousStatement: null,
    nextStatement: null,
    colour: 230,
    tooltip: "Executes an SAP transaction code (T-code).",
    helpUrl: "",
  },
  {
    type: "sap_click_toolbar_button",
    message0: "Click toolbar button %1",
    args0: [
      {
        type: "field_dropdown",
        name: "BUTTON",
        options: [
          ["Save", "SAVE"],
          ["Back", "BACK"],
          ["Exit", "EXIT"],
          ["Enter", "ENTER"],
          ["Execute", "EXECUTE"],
        ],
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 230,
    tooltip: "Clicks a standard button on the SAP toolbar.",
    helpUrl: "",
  },
  {
    type: "sap_select_tab",
    message0: "Switch to tab named %1",
    args0: [{ type: "input_value", name: "TAB_NAME", check: "String" }],
    previousStatement: null,
    nextStatement: null,
    colour: 230,
    tooltip: "Selects a specific tab within an SAP screen.",
    helpUrl: "",
  },

  // --- 2. Data Entry Actions (Green) ---
  {
    type: "sap_set_field_value",
    message0: "Set field %1 to value %2",
    args0: [
      { type: "input_value", name: "FIELD_ID", check: "String" },
      { type: "input_value", name: "VALUE" },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 160,
    tooltip: "Enters a value into a specified field.",
    helpUrl: "",
  },
  {
    type: "sap_select_dropdown_option",
    message0: "In dropdown %1 select option %2",
    args0: [
      { type: "input_value", name: "FIELD_ID", check: "String" },
      { type: "input_value", name: "OPTION_TEXT", check: "String" },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 160,
    tooltip: "Selects an option from a dropdown field.",
    helpUrl: "",
  },

  // --- 3. Table and Grid Actions (Purple) ---
  {
    type: "sap_in_table_do",
    message0: "In table %1 do %2 %3",
    args0: [
      { type: "input_value", name: "TABLE_ID", check: "String" },
      { type: "input_dummy" },
      { type: "input_statement", name: "DO" },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 290,
    tooltip: "Performs actions within a specific table or grid.",
    helpUrl: "",
  },
  {
    type: "sap_set_cell_value",
    message0: "In row %1 set column %2 to %3",
    args0: [
      { type: "input_value", name: "ROW", check: "Number" },
      { type: "input_value", name: "COLUMN_ID", check: "String" },
      { type: "input_value", name: "VALUE" },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 290,
    tooltip:
      "Sets the value of a specific cell in a table. Must be used inside an 'In table' block.",
    helpUrl: "",
  },

  // --- 4. Validation Actions (Orange) ---
  {
    type: "sap_verify_field_value",
    message0: "Verify field %1 equals %2",
    args0: [
      { type: "input_value", name: "FIELD_ID", check: "String" },
      { type: "input_value", name: "EXPECTED_VALUE" },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 30,
    tooltip: "Checks if a field contains the expected value.",
    helpUrl: "",
  },
  {
    type: "sap_get_status_bar_message",
    message0: "get message from status bar",
    output: "String",
    colour: 30,
    tooltip: "Returns the current message from the SAP status bar.",
    helpUrl: "",
  },
  {
    type: "sap_verify_status_bar_message",
    message0: "Verify status bar message contains %1",
    args0: [{ type: "input_value", name: "TEXT_TO_FIND", check: "String" }],
    previousStatement: null,
    nextStatement: null,
    colour: 30,
    tooltip: "Checks if the status bar contains the specified text.",
    helpUrl: "",
  },

  // --- 8. Logging and Reporting Actions (Yellow) ---
  {
    type: "sap_log_message",
    message0: "Log message %1",
    args0: [{ type: "input_value", name: "MESSAGE" }],
    previousStatement: null,
    nextStatement: null,
    colour: 60,
    tooltip: "Writes a custom message to the execution log.",
    helpUrl: "",
  },
  {
    type: "sap_take_screenshot",
    message0: "Take screenshot and save as %1",
    args0: [{ type: "input_value", name: "FILENAME", check: "String" }],
    previousStatement: null,
    nextStatement: null,
    colour: 60,
    tooltip: "Captures the current screen and saves it to a file.",
    helpUrl: "",
  },
]);

// --- SETUP OUR PRIVATE GENERATOR ---

// Create a true clone of the standard javascriptGenerator to inherit all its helper functions
const sapGenerator = Object.create(javascriptGenerator);
// Give the clone its own copy of the block-to-code functions
sapGenerator.forBlock = Object.assign({}, javascriptGenerator.forBlock);

// Add our custom block's generator to the clone
sapGenerator.forBlock['sap_login'] = function(block, generator) {
    const systemId = generator.valueToCode(block, 'SYSTEM_ID', generator.ORDER_ATOMIC) || '""';
    const client = generator.valueToCode(block, 'CLIENT', generator.ORDER_ATOMIC) || '""';
    const user = generator.valueToCode(block, 'USER', generator.ORDER_ATOMIC) || '""';
    const password = generator.valueToCode(block, 'PASSWORD', generator.ORDER_ATOMIC) || '""';
    return `// engine.login(system='${systemId}', client='${client}', user='${user}', password='${password}');\n`;
};

sapGenerator.forBlock['sap_execute_transaction'] = function(block, generator) {
    const tcode = generator.valueToCode(block, 'TCODE', generator.ORDER_ATOMIC) || '""';
    return `// engine.goToTransaction(tcode=${tcode});\n`;
};

sapGenerator.forBlock['sap_click_toolbar_button'] = function(block) {
    const button = block.getFieldValue('BUTTON');
    return `// engine.clickToolbar('${button}');\n`;
};

sapGenerator.forBlock['sap_select_tab'] = function(block, generator) {
    const tabName = generator.valueToCode(block, 'TAB_NAME', generator.ORDER_ATOMIC) || '""';
    return `// engine.selectTab(name=${tabName});\n`;
};

sapGenerator.forBlock['sap_set_field_value'] = function(block, generator) {
    const fieldId = generator.valueToCode(block, 'FIELD_ID', generator.ORDER_ATOMIC) || '""';
    const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '""';
    return `// engine.setField(id=${fieldId}, value=${value});\n`;
};

sapGenerator.forBlock['sap_select_dropdown_option'] = function(block, generator) {
    const fieldId = generator.valueToCode(block, 'FIELD_ID', generator.ORDER_ATOMIC) || '""';
    const optionText = generator.valueToCode(block, 'OPTION_TEXT', generator.ORDER_ATOMIC) || '""';
    return `// engine.selectDropdown(id=${fieldId}, option=${optionText});\n`;
};

sapGenerator.forBlock['sap_in_table_do'] = function(block, generator) {
    const tableId = generator.valueToCode(block, 'TABLE_ID', generator.ORDER_ATOMIC) || '""';
    const statements = generator.statementToCode(block, 'DO');
    let code = `// --- Start actions in table: ${tableId} ---\n`;
    code += statements;
    code += `// --- End actions in table: ${tableId} ---\n`;
    return code;
};

sapGenerator.forBlock['sap_set_cell_value'] = function(block, generator) {
    const row = generator.valueToCode(block, 'ROW', generator.ORDER_ATOMIC) || '0';
    const columnId = generator.valueToCode(block, 'COLUMN_ID', generator.ORDER_ATOMIC) || '""';
    const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '""';
    return `// engine.setTableCell(row=${row}, column=${columnId}, value=${value});\n`;
};

sapGenerator.forBlock['sap_verify_field_value'] = function(block, generator) {
    const fieldId = generator.valueToCode(block, 'FIELD_ID', generator.ORDER_ATOMIC) || '""';
    const expectedValue = generator.valueToCode(block, 'EXPECTED_VALUE', generator.ORDER_ATOMIC) || '""';
    return `// engine.verifyField(id=${fieldId}, expected=${expectedValue});\n`;
};

sapGenerator.forBlock['sap_get_status_bar_message'] = function(block, generator) {
    const code = `engine.getStatusBarMessage()`;
    return [code, generator.ORDER_FUNCTION_CALL];
};

sapGenerator.forBlock['sap_verify_status_bar_message'] = function(block, generator) {
    const textToFind = generator.valueToCode(block, 'TEXT_TO_FIND', generator.ORDER_ATOMIC) || '""';
    return `// engine.verifyStatusBar(containsText=${textToFind});\n`;
};

sapGenerator.forBlock['sap_log_message'] = function(block, generator) {
    const message = generator.valueToCode(block, 'MESSAGE', generator.ORDER_ATOMIC) || '""';
    return `// engine.log(message=${message});\n`;
};

sapGenerator.forBlock['sap_take_screenshot'] = function(block, generator) {
    const filename = generator.valueToCode(block, 'FILENAME', generator.ORDER_ATOMIC) || '""';
    return `// engine.takeScreenshot(filename=${filename});\n`;
};

// --- TOOLBOX DEFINITION ---
const toolboxXML = `
  <xml>
    <category name="Navigation" colour="230">
      <block type="sap_login"></block>
      <block type="sap_execute_transaction"></block>
      <block type="sap_click_toolbar_button"></block>
      <block type="sap_select_tab"></block>
    </category>
    <category name="Data Entry" colour="160">
      <block type="sap_set_field_value"></block>
      <block type="sap_select_dropdown_option"></block>
    </category>
    <category name="Tables & Grids" colour="290">
      <block type="sap_in_table_do"></block>
      <block type="sap_set_cell_value"></block>
    </category>
    <category name="Validation" colour="30">
      <block type="sap_verify_field_value"></block>
      <block type="sap_verify_status_bar_message"></block>
      <block type="sap_get_status_bar_message"></block>
    </category>
    <category name="Logging" colour="60">
      <block type="sap_log_message"></block>
      <block type="sap_take_screenshot"></block>
    </category>
    <category name="Logic" colour="%{BKY_LOGIC_HUE}">
        <block type="controls_if"></block>
        <block type="logic_compare"></block>
        <block type="logic_operation"></block>
        <block type="logic_negate"></block>
        <block type="logic_boolean"></block>
    </category>
    <category name="Text" colour="%{BKY_TEXTS_HUE}">
        <block type="text"></block>
        <block type="text_join"></block>
    </category>
    <category name="Math" colour="%{BKY_MATH_HUE}">
      <block type="math_number">
          <field name="NUM">123</field>
      </block>
    </category>
  </xml>
`;

// --- REACT COMPONENT ---
function BlocklyComponent({ onCodeChange }) {
  const blocklyDiv = useRef(null);
  const primaryWorkspace = useRef(null);

  const updateCode = useCallback(
    (event) => {
      if (event.isUiEvent) {
        // CHANGE 4: Use our private generator instance to generate the code.
        const code = sapGenerator.workspaceToCode(primaryWorkspace.current);
        onCodeChange(code);
      }
    },
    [onCodeChange]
  );

  useEffect(() => {
    if (blocklyDiv.current && !primaryWorkspace.current) {
      primaryWorkspace.current = Blockly.inject(blocklyDiv.current, {
        toolbox: toolboxXML,
        renderer: "zelos",
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
