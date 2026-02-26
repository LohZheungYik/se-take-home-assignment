//unit tests of addBot()

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { OrderSystem, OrderType } from '../orderSystem.js';

const RESULT_FILE = path.join('scripts', 'result.txt');

// Helper to run a test
function runTest(name, fn) {
  try {
    fn();
    console.log(`[PASS] ${name}`);
  } catch (err) {
    console.error(`[FAIL] ${name}`);
    console.error(err);
  }
}

// ===== Tests =====
runTest('Bot is added to the system', () => {
  var orderSystem = new OrderSystem();
  orderSystem.addBot();

  // Check bots array
  assert.strictEqual(orderSystem.bots.length, 1);
  assert.strictEqual(orderSystem.bots[0].id, 1);
  assert.strictEqual(orderSystem.bots[0].currentOrder, null);
  
  // Check log
  const logs = fs.readFileSync(RESULT_FILE, 'utf8');
  assert.ok(logs.includes('Bot #1 created'), 'Log should mention Bot #1 created');
});

runTest('Bot picks up a pending order immediately', () => {

  var orderSystem = new OrderSystem();
  // Add a pending order first
  orderSystem.addOrder(OrderType.NORMAL); // #1001

  // Add bot
  orderSystem.addBot(); // #1

  // Bot should immediately pick up the order
  assert.strictEqual(orderSystem.bots[0].currentOrder.id, 1001);
  assert.strictEqual(orderSystem.bots[0].currentOrder.status, 'PROCESSING');

  // pendingOrders should now be empty
  assert.strictEqual(orderSystem.pendingOrders.length, 0);

  // Check log mentions picking up the order
  const logs = fs.readFileSync(RESULT_FILE, 'utf8');
  assert.ok(logs.includes('picked up NORMAL Order'), 'Log should mention the bot picked up the order');
});