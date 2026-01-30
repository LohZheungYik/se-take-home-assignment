#!/bin/bash

# ===============================
# FeedMe Assignment - test.sh
# Unit test execution for Node.js CLI
# ===============================

RESULT_FILE="scripts/result.txt"
SIMULATION_FILE="$(dirname "$0")/../index.js"

echo "Running CLI simulation..."
# Run the Node.js CLI simulation
node "$SIMULATION_FILE"

if [ $? -ne 0 ]; then
    echo "Simulation failed to execute!"
    exit 1
fi

echo "Simulation completed. Checking result.txt..."

# Expected counts
EXPECTED_TOTAL_ORDERS=5
EXPECTED_VIP_ORDERS=3
EXPECTED_NORMAL_ORDERS=2
EXPECTED_COMPLETED_ORDERS=5
EXPECTED_ACTIVE_BOTS=1
EXPECTED_PENDING_ORDERS=0

# Extract numbers from result.txt using grep + awk
TOTAL_ORDERS=$(grep "Total Orders Processed" "$RESULT_FILE" | awk -F: '{print $2}' | awk '{print $1}')
VIP_ORDERS=$(grep "Total Orders Processed" "$RESULT_FILE" | awk -F'(' '{print $2}' | awk '{print $1}')
NORMAL_ORDERS=$(grep "Total Orders Processed" "$RESULT_FILE" | awk -F',' '{print $2}' | awk '{print $1}')
COMPLETED_ORDERS=$(grep "Orders Completed" "$RESULT_FILE" | awk -F': ' '{print $2}')
ACTIVE_BOTS=$(grep "Active Bots" "$RESULT_FILE" | awk -F': ' '{print $2}')
PENDING_ORDERS=$(grep "Pending Orders" "$RESULT_FILE" | awk -F': ' '{print $2}')

PASS=true

# Compare each value
if [ "$TOTAL_ORDERS" -ne "$EXPECTED_TOTAL_ORDERS" ]; then
    echo "[FAIL] Total Orders mismatch: $TOTAL_ORDERS (expected $EXPECTED_TOTAL_ORDERS)"
    PASS=false
fi

if [ "$VIP_ORDERS" -ne "$EXPECTED_VIP_ORDERS" ]; then
    echo "[FAIL] VIP Orders mismatch: $VIP_ORDERS (expected $EXPECTED_VIP_ORDERS)"
    PASS=false
fi

if [ "$NORMAL_ORDERS" -ne "$EXPECTED_NORMAL_ORDERS" ]; then
    echo "[FAIL] Normal Orders mismatch: $NORMAL_ORDERS (expected $EXPECTED_NORMAL_ORDERS)"
    PASS=false
fi

if [ "$COMPLETED_ORDERS" -ne "$EXPECTED_COMPLETED_ORDERS" ]; then
    echo "[FAIL] Completed Orders mismatch: $COMPLETED_ORDERS (expected $EXPECTED_COMPLETED_ORDERS)"
    PASS=false
fi

if [ "$ACTIVE_BOTS" -ne "$EXPECTED_ACTIVE_BOTS" ]; then
    echo "[FAIL] Active Bots mismatch: $ACTIVE_BOTS (expected $EXPECTED_ACTIVE_BOTS)"
    PASS=false
fi

if [ "$PENDING_ORDERS" -ne "$EXPECTED_PENDING_ORDERS" ]; then
    echo "[FAIL] Pending Orders mismatch: $PENDING_ORDERS (expected $EXPECTED_PENDING_ORDERS)"
    PASS=false
fi

if [ "$PASS" = true ]; then
    echo "[PASS] All checks passed!"
    exit 0
else
    echo "[FAIL] Some checks failed!"
    exit 1
fi