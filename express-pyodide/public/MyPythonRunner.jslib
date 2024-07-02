// Assuming this is your .jslib file

// Function to initialize the worker
function initialize() {
    if (window.MyPythonRunner) {
        window.MyPythonRunner.initializeWorker();
        console.log("Worker has been initialized by jslib.");
    } else {
        console.error("MyPythonRunner is not available.");
    }
}

// Function to run Python code
function runCode(code) {
    if (window.MyPythonRunner) {
        window.MyPythonRunner.runPythonCode(code);
        console.log("Python code execution started by jslib.");
    } else {
        console.error("MyPythonRunner is not available.");
    }
}

// You might include more functionality or setup specific to your project
