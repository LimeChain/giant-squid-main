import path from 'path';
import { spawn } from 'child_process';

const chainName = process.env.CHAIN;

if (!chainName) {
  console.error('CHAIN environment variable is not set.');
  process.exit(1);
}

const scriptPath = path.join(__dirname, 'chain', chainName, 'main.js');

console.log(`Running script at: ${scriptPath}`);

const subprocess = spawn('node', [scriptPath], {
  stdio: 'inherit',
});

subprocess.on('close', (code: number) => {
  process.exit(code);
});
