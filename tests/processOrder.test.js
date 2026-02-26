// /tests/processOrders.test.js
import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { OrderSystem, OrderType } from '../orderSystem.js';

const RESULT_FILE = path.join('scripts', 'result.txt');


// Helper to run a test (async)
async function runTest(name, fn) {
  try {
    await fn();
    console.log(`[PASS] ${name}`);
  } catch (err) {
    console.error(`[FAIL] ${name}`);
    console.error(err);
  }
}

// ===== Sequentially run all tests =====
async function runAllTests() {
  await runTest('Bot picks up order and completes it', async () => {

    var orderSystem = new OrderSystem();

    console.log('[INFO] Waiting for the bot to complete the order...');
    orderSystem.addOrder(OrderType.NORMAL); // #1001
    orderSystem.addBot(); // #1

    // Wait for the bot to finish processing
    await new Promise(resolve => setTimeout(resolve, 11000));

    // Bot should be idle after completion
    assert.strictEqual(orderSystem.bots[0].currentOrder, null);
    assert.strictEqual(orderSystem.bots[0].isIdleLogged, true);

    // Completed orders should include the order
    assert.strictEqual(orderSystem.completedOrders.length, 1);
    assert.strictEqual(orderSystem.completedOrders[0].status, 'COMPLETE');

    const logs = fs.readFileSync(RESULT_FILE, 'utf8');
    assert.ok(logs.includes('picked up Normal Order'));
    assert.ok(logs.includes('completed Normal Order'));
  });

  await runTest('Multiple bots process multiple orders', async () => {
    var orderSystem = new OrderSystem();
    console.log('[INFO] Waiting for both bots to complete their orders...');
    orderSystem.addOrder(OrderType.NORMAL);
    orderSystem.addOrder(OrderType.VIP);
    orderSystem.addBot(); // #1
    orderSystem.addBot(); // #2

    await new Promise(resolve => setTimeout(resolve, 11000));

    // Both orders should be completed
    assert.strictEqual(orderSystem.completedOrders.length, 2);

    // All bots should be idle
    orderSystem.bots.forEach(bot => {
      assert.strictEqual(bot.currentOrder, null);
      assert.strictEqual(bot.isIdleLogged, true);
    });

    const logs = fs.readFileSync(RESULT_FILE, 'utf8');
    assert.ok(logs.includes('completed Normal Order'));
    assert.ok(logs.includes('completed VIP Order'));
  });

  await runTest('Bot logs idle if no orders', async () => {
    var orderSystem = new OrderSystem();
    console.log('[INFO] Waiting for idle bot log...');
    orderSystem.addBot(); // #1

    // Wait briefly to let processOrders run
    await new Promise(resolve => setTimeout(resolve, 1000));

    assert.strictEqual(orderSystem.bots[0].currentOrder, null);
    assert.strictEqual(orderSystem.bots[0].isIdleLogged, true);

    const logs = fs.readFileSync(RESULT_FILE, 'utf8');
    assert.ok(logs.includes('is now IDLE'));
  });

}

// Start the tests
runAllTests();