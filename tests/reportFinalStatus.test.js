//unit tests of reportFinalStatus()
// /tests/reportFinalStatus.test.js
import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { OrderSystem, OrderType } from '../orderSystem.js';

const RESULT_FILE = path.join('scripts', 'result.txt');


var orderSystem = new OrderSystem();

// ===== Helper: wait until all bots are idle with info logs =====
async function waitUntilIdle(timeoutMs = 30000) {
  const start = Date.now();
  while (true) {
    const busyBots = orderSystem.bots.some(bot => bot.currentOrder !== null);
    if (!busyBots && orderSystem.pendingOrders.length === 0) return;
    if (Date.now() - start > timeoutMs) {
      throw new Error('Timed out waiting for idle system');
    }
    process.stdout.write('[INFO] Waiting for bots to finish...\r'); // overwrite same line
    await new Promise(resolve => setTimeout(resolve, 500)); // check every 0.5s
  }
}

// ===== Helper to run async test =====
async function runTest(name, fn) {
  try {
    // resetSystem();
    await fn();
    console.log(`[PASS] ${name}`);
  } catch (err) {
    console.error(`[FAIL] ${name}`);
    console.error(err);
  }
}

// ===== Tests =====
async function runAllTests() {
  //No orders, no bots
  await runTest('Report status with no orders and no bots', async () => {
    await orderSystem.reportFinalStatus();
    const logs = fs.readFileSync(RESULT_FILE, 'utf8');
    assert.ok(logs.includes('Total Orders Processed: 0'));
    assert.ok(logs.includes('Orders Completed: 0'));
    assert.ok(logs.includes('Active Bots: 0'));
    assert.ok(logs.includes('Pending Orders: 0'));
  });

  //Orders exist, bots exist
  await runTest('Report status with orders and bots', async () => {
    orderSystem.addOrder(OrderType.NORMAL); // #1001
    orderSystem.addOrder(OrderType.VIP);    // #1002
    orderSystem.addOrder(OrderType.NORMAL); // #1003

    orderSystem.addBot(); // #1
    orderSystem.addBot(); // #2

    // Wait until all orders are processed and bots idle
    await waitUntilIdle();

    await orderSystem.reportFinalStatus(); // logs are now stable
    const logs = fs.readFileSync(RESULT_FILE, 'utf8');

    assert.ok(logs.includes('Total Orders Processed: 3'));
    assert.ok(logs.includes('(1 VIP, 2 Normal)'));
    assert.ok(logs.includes('Orders Completed: 3'));
    assert.ok(logs.includes('Active Bots: 2'));
    assert.ok(logs.includes('Pending Orders: 0'));
  });
}

runAllTests();