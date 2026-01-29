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

// ===== ORDERS =====
const OrderType = { NORMAL: 'Normal', VIP: 'VIP' };
let orderCounter = 1000;
let pendingOrders = [];
let allOrders = [];
let completedOrders = [];

// ===== ADD BOT FUNCTION =====
function addBot() {
    const bot = { id: bots.length + 1, currentOrder: null };
    bots.push(bot);
    log(`Bot #${bot.id} created - Status: ACTIVE`);
    processOrders(); // immediately try to pick up orders
}

// ===== ADD ORDER FUNCTION =====
function addOrder(type) {
    orderCounter++;
    const order = { id: orderCounter, type, status: 'PENDING' };
    allOrders.push(order);

    // VIP orders go in front of normal orders
    if (type === OrderType.VIP) {
        const firstNormalIndex = pendingOrders.findIndex(o => o.type !== OrderType.VIP);
        if (firstNormalIndex === -1) {
            pendingOrders.push(order);
        } else {
            pendingOrders.splice(firstNormalIndex, 0, order);
        }
    } else {
        pendingOrders.push(order);
    }

    log(`Created ${type} Order #${order.id} - Status: PENDING`);
    processOrders();
}

// ===== PROCESS ORDERS FUNCTION =====
function processOrders() {
    bots.forEach(bot => {
        // only assign if bot is idle
        if (!bot.currentOrder && pendingOrders.length > 0) {
            const order = pendingOrders.shift();
            bot.currentOrder = order;
            order.status = 'PROCESSING';
            order.bot = bot.id;

            log(`Bot #${bot.id} picked up ${order.type} Order #${order.id} - Status: PROCESSING`);

            bot.timeout = setTimeout(() => {
                order.status = 'COMPLETE';
                order.completed = true;
                completedOrders.push(order);
                bot.currentOrder = null;
                order.bot = null;

                log(`Bot #${bot.id} completed ${order.type} Order #${order.id} - Status: COMPLETE (Processing time: 10s)`);

                processOrders(); // pick next order if any
            }, 10000); // 10 seconds per order
        }
    });
}

// ===== SIMULATION =====
log("McDonald's Order Management System - Simulation Results", false);
log("", false)
// Example simulation actions
addBot(); // Bot #1
addBot(); // Bot #2

addOrder(OrderType.NORMAL); // Order #1001
addOrder(OrderType.VIP);    // Order #1002
setTimeout(() => addOrder(OrderType.NORMAL), 2000); // Order #1003
setTimeout(() => addOrder(OrderType.VIP), 5000);    // Order #1004
