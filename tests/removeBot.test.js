//unit tests of removeBot()
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
  
  await runTest('Remove idle bot', async () => {

    var orderSystem = new OrderSystem();

    orderSystem.addBot(); // #1
    orderSystem.removeBot(); // remove the only bot

    // Bots array should be empty
    assert.strictEqual(orderSystem.bots.length, 0);

    // Check log mentions idle bot destroyed
    const logs = fs.readFileSync(RESULT_FILE, 'utf8');
    assert.ok(logs.includes('destroyed while IDLE'));
  });

  await runTest('Remove bot while processing an order, switch order status back to PENDING', async () => {
    var orderSystem = new OrderSystem();
    orderSystem.addOrder(OrderType.NORMAL); // #1001
    orderSystem.addBot(); // #1 picks up order

    // Wait briefly to ensure bot picks up order
    await new Promise(resolve => setTimeout(resolve, 100));

    // Bot should have currentOrder
    assert.strictEqual(orderSystem.bots[0].currentOrder.id, 1001);

    // Remove bot while processing
    orderSystem.removeBot();

    // Bots array should be empty
    assert.strictEqual(orderSystem.bots.length, 0);

    // Order should be back in pendingOrders at front
    assert.strictEqual(orderSystem.pendingOrders[0].id, 1001);
    assert.strictEqual(orderSystem.pendingOrders[0].status, 'PENDING');
    assert.strictEqual(orderSystem.pendingOrders[0].botId, null);

    const logs = fs.readFileSync(RESULT_FILE, 'utf8');
    assert.ok(logs.includes('destroyed while processing'));
  });

  await runTest('Remove bot from empty system does nothing', async () => {
    var orderSystem = new OrderSystem();
    orderSystem.removeBot(); // no bot exists
    assert.strictEqual(orderSystem.bots.length, 0);

    const logs = fs.readFileSync(RESULT_FILE, 'utf8');
    // Should not throw, logs may be empty
    assert.ok(true);
  });

}

// Start the tests
runAllTests();