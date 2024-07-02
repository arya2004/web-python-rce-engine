async function loadPyodideAndPackages() {
    window.pyodide = await loadPyodide();
}

async function runPythonCode() {
    let code = document.getElementById("pythonCode").value;
    try {
        let output = await pyodide.runPythonAsync(code);
        document.getElementById("output").innerText = output;
    } catch (err) {
        document.getElementById("output").innerText = err;
    }
}

loadPyodideAndPackages();
