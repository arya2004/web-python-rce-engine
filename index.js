// Import the necessary modules
const { loadPyodide, micropip } = require("pyodide");

// Define an asynchronous function to execute the Python code
async function executePythonCode(code) {
  // Load Pyodide
  const pyodide = await loadPyodide();

  // Load the micropip package
  await pyodide.loadPackage("micropip");

  // Install the regex package using micropip
  await pyodide.runPythonAsync(`
    import micropip
    await micropip.install('regex')
 
  `);

  // Execute the Python code and return the result
  return pyodide.runPythonAsync(code);
}

// Define the Python code as a string
const pythonCode = `
import regex as re


# Define a sample string
text = "The quick brown fox jumps over the lazy dog. The quick brown fox is quick."

# Find all occurrences of 'quick' in the text
matches = re.findall(r'quick', text)

# Join the matches into a single string for output
result = "\\n".join(matches)

result
`;

// Execute the Python code and log the result
executePythonCode(pythonCode)
  .then(result => {
    console.log("Python code execution result:\n", result);
  })
  .catch(error => {
    console.error("Error executing Python code:", error);
  });
