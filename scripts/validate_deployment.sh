#!/bin/bash
set -e

echo "=== Health Check ==="

# Wait for backend to start
echo "Waiting for backend to start..."
sleep 5

# Check if backend is responding
MAX_RETRIES=30
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if curl -f http://localhost:5000/api/health/ping > /dev/null 2>&1; then
        echo "✓ Backend is healthy!"
        curl -s http://localhost:5000/api/health | python3 -m json.tool || true
        break
    else
        RETRY_COUNT=$((RETRY_COUNT+1))
        echo "Backend not ready yet (attempt $RETRY_COUNT/$MAX_RETRIES)..."
        sleep 2
    fi
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    echo "✗ Backend health check failed after $MAX_RETRIES attempts"
    echo "Checking PM2 status..."
    pm2 status
    echo "Checking PM2 logs..."
    pm2 logs tradeguard-api --lines 50 --nostream || true
    exit 1
fi

# Check PM2 status
echo ""
echo "PM2 Process Status:"
pm2 status

# Check Nginx status
echo ""
echo "Nginx Status:"
sudo systemctl status nginx --no-pager | head -10

echo ""
echo "=== Health Check Complete ==="
