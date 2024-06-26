const { loadPyodide, micropip } = require('pyodide');

async function initializePyodide() {
    const pyodide = await loadPyodide();
    await pyodide.loadPackage("micropip");
    const micropip = pyodide.pyimport("micropip");

    return pyodide;
}

async function runPythonCode(pyodide, code, timeoutMs) {
    const wrappedCode = `
import asyncio
import time
from async_timeout import timeout

async def run_with_timeout(code, timeout):
    try:
        async with timeout(${timeoutMs / 1000.0}):
            exec(code)
    except asyncio.TimeoutError:
        raise TimeoutError('Code execution timed out')

code = """
${code}
"""

asyncio.run(run_with_timeout(code, ${timeoutMs / 1000.0}))
`;

    try {
        let output = await pyodide.runPythonAsync(wrappedCode);
        return { result: output };
    } catch (err) {
        return { error: err.toString() };
    }
}

async function main() {
    const pyodide = await initializePyodide();
    const code = `
while True:
    print("Hello from Python!")
    await asyncio.sleep(0.1)
`;  // Replace this with your dynamic code input

    const result = await runPythonCode(pyodide, code, 1000);  // 1000 ms = 1 second
    if (result.result) {
        console.log("Output:", result.result);
    } else if (result.error) {
        console.error("Error:", result.error);
    }
}

main();
