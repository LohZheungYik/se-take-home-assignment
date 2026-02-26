//unit tests of addOrder()
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
runTest('Normal order is added to the queue', () => {
  var orderSystem = new OrderSystem();
  orderSystem.addOrder(OrderType.NORMAL);

  // Check pendingOrders queue
  assert.strictEqual(orderSystem.pendingOrders.length, 1);
  assert.strictEqual(orderSystem.pendingOrders[0].type, 'NORMAL');
  assert.strictEqual(orderSystem.pendingOrders[0].status, 'PENDING');

  // Check allOrders
  assert.strictEqual(orderSystem.totalOrders, 1);
  // assert.strictEqual(allOrders[0].type, 'Normal');

  // Check log
  const logs = fs.readFileSync(RESULT_FILE, 'utf8');
  assert.ok(logs.includes('NORMAL Order'), 'Log should mention Normal Order');
});

runTest('VIP orders are placed before normal orders', () => {
  var orderSystem = new OrderSystem();
  orderSystem.addOrder(OrderType.NORMAL); 
  orderSystem.addOrder(OrderType.VIP);    
  orderSystem.addOrder(OrderType.NORMAL); 
  orderSystem.addOrder(OrderType.VIP);

  const types = orderSystem.pendingOrders.map(o => o.type);
  
  assert.deepStrictEqual(types, ['VIP', 'VIP', 'NORMAL', 'NORMAL']);
});