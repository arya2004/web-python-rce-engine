let worker;

// Creating textDecoder instance
let decoder = new TextDecoder("utf-8");

document.getElementById('runButton').addEventListener('click', () => {
    if (worker) {
        worker.terminate();
    }
    worker = new Worker('worker.js');
    let byteArray = [];
    
    worker.onmessage = (event) => {
        if (event.data.type === 'aByte') {
            byteArray.push(event.data.content);
        }
        if (event.data.type === 'final_output') {
            byteArray.push(event.data.content);
            let byteArray2 = new Uint8Array(byteArray);
            let str = decoder.decode(byteArray2);

            // Display the output
            console.log(str);
            document.getElementById('output').textContent = str;
        } else if (event.data.type === 'error') {
            let byteArray2 = new Uint8Array(byteArray);
            let str = decoder.decode(byteArray2);

            // Display the output
            console.log(str);
            document.getElementById('output').textContent += str + '\nError: ' + event.data.content;
        }
    };

    const code = document.getElementById('codeInput').value;

    worker.postMessage({
        code: code,
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.1/full/'
    });

    // Terminate the worker if it takes more than 6 seconds
    setTimeout(() => {
        if (worker) {
            worker.terminate();
            let byteArray2 = new Uint8Array(byteArray);
            let str = decoder.decode(byteArray2);
            document.getElementById('output').textContent += str + '\nWorker terminated due to timeout.';
        }
    }, 1000);
});
