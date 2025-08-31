import React, { useState, useRef } from "react";
import BlocklyComponent from "./components/BlocklyComponent";
import Interpreter from "js-interpreter";

function App() {
  const [generatedCode, setGeneratedCode] = useState("");
  const canvasRef = useRef(null); // Ref for our canvas stage

  const runCode = () => {
    // Get the canvas and its 2D rendering context
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    // Clear the canvas before each run
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // This is the API that our sandboxed code can call.
    const initApi = (interpreter, globalObject) => {
      // Wrapper for our drawCircle function
      const drawCircleWrapper = (x, y, radius) => {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fill();
      };

      // Add the wrapper to the interpreter's global scope.
      interpreter.setProperty(
        globalObject,
        "drawCircle",
        interpreter.createNativeFunction(drawCircleWrapper)
      );
    };

    // Create and run the interpreter
    const myInterpreter = new Interpreter(generatedCode, initApi);
    // This function repeatedly calls the interpreter's step method
    function nextStep() {
      // Execute one step of the code.
      if (myInterpreter.step()) {
        // Schedule the next step to run shortly.
        // This is what prevents the browser from freezing.
        window.setTimeout(nextStep, 20); // 20ms delay for animation
      }
    }
    nextStep();
  };

  return (
    <div className="flex h-screen">
      <div className="w-3/5 h-full flex flex-col">
        {/* Blockly Component will take the top part */}
        <div className="flex-grow">
          <BlocklyComponent onCodeChange={setGeneratedCode} />
        </div>
      </div>

      <div className="w-2/5 h-full flex flex-col bg-gray-100">
        {/* Stage/Canvas will be on top */}
        <div className="h-1/2 p-2">
          <h2 className="text-xl font-bold mb-2 text-gray-800">Stage</h2>
          <canvas
            ref={canvasRef}
            className="w-full h-full bg-white border border-gray-400"
          ></canvas>
        </div>

        {/* Code Preview will be below */}
        <div className="h-1/2 bg-gray-800 text-white p-2 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold">Generated Code</h2>
            <button
              onClick={runCode}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Run Code
            </button>
          </div>
          <pre className="flex-grow overflow-auto">
            <code>{generatedCode}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}

export default App;
