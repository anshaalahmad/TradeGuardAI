#!/bin/bash

echo "=== Application Stop ==="

# Stop PM2 process
pm2 stop tradeguard-api 2>/dev/null || true

echo "=== Application Stop Complete ==="
