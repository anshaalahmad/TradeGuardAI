import React, { useEffect, useRef } from 'react'
import { initCandleChart } from './CandleChart'

/**
 * CandleChart React component
 * - Renders a lightweight-charts candlestick chart inside a responsive container
 * - Accepts optional `data` prop (array of candlestick points) and `price` to display above the chart
 *
 * Usage:
 * <CandleChart data={candles} price={currentPrice} />
 */
export default function CandleChart({ data = [], price = '--', height = 400, symbol = 'BTCUSDT', interval = '1m' }) {
    const containerRef = useRef(null)
    const priceRef = useRef(null)
    const instanceRef = useRef(null)

    useEffect(() => {
        if (!containerRef.current) return

        // init the JS-only chart logic. the implementation lives in CandleChart.js
        const instance = initCandleChart(containerRef.current, priceRef.current, { symbol, interval, height })
        instanceRef.current = instance

        return () => {
            // cleanup chart + websocket
            try { instanceRef.current?.destroy() } catch (_) {}
            instanceRef.current = null
        }
    }, [symbol, interval, height])

    return (
        <div style={{ backgroundColor: 'transparent' }}>
            <h1 ref={priceRef} id="cryptoPrice" style={{ color: 'white', fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                {price}
            </h1>
            <div
                ref={containerRef}
                id="chart"
                style={{ width: '100%', height, backgroundColor: 'transparent' }}
            />
        </div>
    )
}