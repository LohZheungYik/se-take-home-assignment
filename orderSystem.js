import fs from 'fs';
import path from 'path';

const RESULT_FILE = path.join('scripts', 'result.txt');
const PROCESSING_DURATION = 10000;

export const OrderType = { NORMAL: 'Normal', VIP: 'VIP' };
// const OrderPriority = {
//     VIP: 1,
//     Normal: 2
// }

export class OrderSystem {
    constructor() {

        // Clear previous result file content
        fs.writeFileSync(RESULT_FILE, '', { flag: 'w' });
        
        this.log("McDonald's Order Management System - Simulation Results", false);
        this.log("", false);


        this.bots = [];

        this.pendingOrders = [];
        this.completedOrders = [];

        this.orderCounter = 1000;

        this.totalOrders = 0;
        this.vipOrders = 0;
        this.normalOrders = 0;

        this.finalStatusReported = false;

    }

    log(msg, needTimeStamp = true) {
        const timestamp = new Date().toLocaleTimeString('en-GB'); // HH:MM:SS
        const line = needTimeStamp ? `[${timestamp}] ${msg}` : msg;
        fs.appendFileSync(RESULT_FILE, line + '\n', { encoding: 'utf8' });
    }

    addOrder(type) {
        this.orderCounter++;

        const order = {
            id: this.orderCounter,
            type: type,
            status: 'PENDING',
            botId: null
        };

        this.totalOrders++;

        if (type === OrderType.VIP) {
            this.vipOrders++;
        } else {
            this.normalOrders++;
        }

        // VIP orders go in front of normal orders but behind other VIPs
        if (type === OrderType.VIP) {
            const firstNormalIndex = this.pendingOrders.findIndex(o => o.type !== OrderType.VIP);
            if (firstNormalIndex === -1) {
                this.pendingOrders.push(order);
            } else {
                this.pendingOrders.splice(firstNormalIndex, 0, order);
            }
        } else {
            this.pendingOrders.push(order);
        }

        this.log(`Created ${type} Order #${order.id} - Status: PENDING`);
        this.processOrders(); // try to assign immediately
    }

    addBot() {
        const bot = {
            id: this.bots.length + 1,
            currentOrder: null,
            isIdleLogged: false
        };
        this.bots.push(bot);
        this.log(`Bot #${bot.id} created - Status: ACTIVE`);
        this.processOrders(); // immediately try to pick up orders
    }

    removeBot() {
        if (this.bots.length === 0) return; // no bots to remove

        const bot = this.bots.pop(); // remove newest bot

        if (bot.currentOrder) {
            // stop the processing
            clearTimeout(bot.timeout);

            bot.currentOrder.status = 'PENDING';
            bot.currentOrder.botId = null;

            // return order to pendingOrders at the front (to be picked quickly)
            this.pendingOrders.unshift(bot.currentOrder);


            this.log(`Bot #${bot.id} destroyed while processing - Order #${bot.currentOrder.id} back to PENDING`);
        } else {
            this.log(`Bot #${bot.id} destroyed while IDLE`);
        }

        this.processOrders(); // let other bots pick up returned order
    }

    processOrders() {

        //loop through bots
        this.bots.forEach(bot => {

            // bot busy
            if (bot.currentOrder) return;

            // no pending orders, log bot IDLE
            if (this.pendingOrders.length === 0) {
                if (!bot.isIdleLogged) {
                    this.log(`Bot #${bot.id} is now IDLE - No pending orders`);
                    bot.isIdleLogged = true;
                    this.checkFinalStatus();
                }

                return;
            }

            const order = this.pendingOrders.shift();
            bot.currentOrder = order;

            //reset IDLE log status
            bot.isIdleLogged = false;

            order.status = 'PROCESSING';
            order.botId = bot.id;
            this.log(`Bot #${bot.id} picked up ${order.type} Order #${order.id} - Status: PROCESSING`);

            bot.timeout = setTimeout(() => {
                order.status = 'COMPLETE';
                order.botId = null;
                bot.currentOrder = null;
                this.completedOrders.push(order);

                this.log(`Bot #${bot.id} completed ${order.type} Order #${order.id} - Status: COMPLETE`);

                this.processOrders();
                this.checkFinalStatus();

            }, PROCESSING_DURATION);
        });
    }

    checkFinalStatus() {
        const allOrdersDone = this.totalOrders === this.completedOrders.length;
        const allBotsIdle = this.bots.every(bot => !bot.currentOrder);

        if (!this.finalStatusReported && allOrdersDone && allBotsIdle) {
            this.finalStatusReported = true; // mark it reported
            this.reportFinalStatus();
        }
    }

    reportFinalStatus() {
        this.log("", false);
        this.log("Final Status:", false);
        this.log(`- Total Orders Processed: ${this.totalOrders} (${this.vipOrders} VIP, ${this.normalOrders} Normal)`, false);
        this.log(`- Orders Completed: ${this.completedOrders.length}`, false);
        this.log(`- Active Bots: ${this.bots.length}`, false);
        this.log(`- Pending Orders: ${this.pendingOrders.length}`, false);
    }
}
