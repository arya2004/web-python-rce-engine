// Import the necessary modules
const { loadPyodide, micropip } = require("pyodide");

// Define an asynchronous function to execute the Python code
async function executePythonCode(code) {
  // Load Pyodide
  const pyodide = await loadPyodide();

  // Load Pandas and NumPy packages
  await pyodide.loadPackage("pandas");
  await pyodide.loadPackage("numpy");
  //await pyodide.loadPackage("resource");
  //await micropip.install('resource')

  // Execute the Python code and return the result
  return pyodide.runPythonAsync(code);
}

// Define the Python code as a string
const pythonCode = `
import pandas as pd
import numpy as np
import resource

# Create a sample DataFrame
data = {
    'A': np.random.rand(5),
    'B': np.random.rand(5),
    'C': np.random.rand(5)
}
df = pd.DataFrame(data)

# Perform some operations
summary = df.describe().to_string()

summary
`;

// Execute the Python code and log the result
executePythonCode(pythonCode)
  .then(result => {
    console.log("Python code execution result:\n", result);
  })
  .catch(error => {
    console.error("Error executing Python code:", error);
  });


