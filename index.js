import fs from 'fs';
import path from 'path';

// ===== RESULT FILE SETUP =====
const RESULT_FILE = path.join('scripts', 'result.txt');
// Clear previous content
fs.writeFileSync(RESULT_FILE, '', { flag: 'w' });

function log(msg, needTimeStamp = true) {
  const timestamp = new Date().toLocaleTimeString('en-GB'); // HH:MM:SS
  const line = needTimeStamp ? `[${timestamp}] ${msg}` : msg;
  // Only write to result.txt
  fs.appendFileSync(RESULT_FILE, line + '\n', { encoding: 'utf8' });
}

// ===== BOTS =====
let bots = [];

// ===== ADD BOT FUNCTION =====
function addBot() {
  const bot = { id: bots.length + 1, currentOrder: null };
  bots.push(bot);
  log(`Bot #${bot.id} created - Status: ACTIVE`);
}

// ===== SIMULATION =====
log("McDonald's Order Management System - Simulation Results", false);
log("", false)
// Example simulation actions
addBot(); // Bot #1
addBot(); // Bot #2