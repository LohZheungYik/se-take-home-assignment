import { OrderSystem, OrderType } from './orderSystem.js';

var orderSystem = new OrderSystem();

// Example simulation actions
orderSystem.addOrder(OrderType.NORMAL); // Order #1001
orderSystem.addOrder(OrderType.VIP);    // Order #1002
orderSystem.addOrder(OrderType.VIP);    // Order #1003 //EXPECTED Q: #1002, #1003, #1001

setTimeout(() => orderSystem.addOrder(OrderType.NORMAL), 2000); // Order #1004

orderSystem.addBot(); // Bot #1
orderSystem.addBot(); // Bot #2

setTimeout(() => orderSystem.addOrder(OrderType.VIP), 5000);    // Order #1005

// Remove newest bot after 15 seconds
setTimeout(() => orderSystem.removeBot(), 15000);

