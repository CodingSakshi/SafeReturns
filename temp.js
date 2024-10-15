const { spawn } = require('child_process');

// Define the arguments you want to pass to the Python script
const arg1 = 'images/found/60e66a1a-d010-4163-8e3e-7e7ef3a4f57e.jpg';
const arg2 = 'Found Person';

// Spawn the Python process
const pythonProcess = spawn('python', ['temp.py', arg1, arg2]);

// Variables to hold the output from Python
let fullOutput = '';  // Store full output as a string

// Handle output from the Python script
pythonProcess.stdout.on('data', (data) => {
    // Collect full output data (could arrive in chunks)
    fullOutput += data.toString();
});

// Handle errors from the Python script
pythonProcess.stderr.on('data', (data) => {
    console.error(`Python Error: ${data}`);
});

// Handle when the Python process exits
pythonProcess.on('exit', (code) => {
    console.log(`Python process exited with code ${code}`);
    
    // Split the full output by new lines
    const outputLines = fullOutput.trim().split('\n');

    // Assign output lines to x and y, if available
    if (outputLines.length >= 2) {
        const x = outputLines[0]; // First line of output
        const y = outputLines[1]; // Second line of output
        console.log(`x: ${x}`);
        console.log(`y: ${y}`);
    } else {
        console.error('Not enough output from Python script.');
    }
});
