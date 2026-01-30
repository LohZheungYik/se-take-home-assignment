# FeedMe Take Home Assignment - Backend

## Overview

This project is a **Node.js CLI simulation** of McDonald's automated cooking bots system.  
It demonstrates order management for normal and VIP customers and bot control for processing orders.

## Features

- Add new **Normal** and **VIP** orders.
  - VIP orders are processed **before Normal orders**, but queue behind existing VIPs.
- Add or remove **cooking bots** dynamically.
  - Bots process one order at a time (10 seconds per order).
  - If no orders are pending, bots become **IDLE**.
  - Removing a bot stops its current processing and returns the order to the queue.
- Orders are tracked with **timestamps** in `HH:MM:SS` format.
- All simulation results are written to `scripts/result.txt`.

## Project Structure

se-take-home-assignment/
├── index.js           # Main simulation CLI
├── package.json
├── scripts/
│   ├── test.sh        # Unit test execution
│   ├── build.sh       # Build script
│   ├── run.sh         # Run script
│   └── result.txt     # CLI output
└── README.md

## Getting Started

### Prerequisites

- Node.js v22.x
- Git

### Run the Simulation

**Run the CLI simulation**
./scripts/run.sh

**Or directly**
node index.js

### Check results
cat scripts/result.txt

### Test
./scripts/test.sh

### Example Simulation Flow
1.	Orders in queue:
	-	Normal: #1001
	-	VIP: #1002
2.	Adding a new VIP order (#1003) will queue behind existing VIPs but before Normal orders.
3.	Bots process orders in order:
	-	VIP orders first
	-	Normal orders after VIPs
4.	Removing a bot returns its current order to pending orders.