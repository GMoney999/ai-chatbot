// build.js
const { exec, spawn } = require('child_process');
const axios = require('axios');

// Step 1: Compile TypeScript code
exec('npx tsc', (error, stdout, stderr) => {
  if (error) {
    console.error(`TypeScript compilation error: ${error.message}`);
    process.exit(1);
  }
  console.log('TypeScript compiled successfully.');

  // Step 2: Start the server (index.js) in detached mode
  const serverProcess = spawn('node', ['index.js'], {
    stdio: 'inherit'
  });
  console.log('Server started.');

  // Cleanup: Ensure server process is killed when build script is interrupted
  process.on('SIGINT', () => {
    console.log("Killing server process...");
    serverProcess.kill('SIGINT');
    process.exit();
  })

  // Step 3: Wait for the server to initialize, then send a test POST request
  setTimeout(() => {
    axios.post('http://127.0.0.1:3000/test-generation')
      .then(response => {
        console.log('Test generation response:', response.data);
      })
      .catch(err => {
        console.error('Error making test generation request:', err.message);
      });
  }, 2000); // Wait 2 seconds before making the request
});