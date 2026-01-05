import * as LightweightCharts from 'lightweight-charts'
const { createChart } = LightweightCharts

/**
 * Module to initialise a lightweight-candlestick chart and connect it to
 * Binance REST + websocket. Kept as a separate JS file (not JSX) so it can
 * run independently and be imported by the React component.
 *
 * Usage:
 *   import { initCandleChart } from './CandleChart'
 *   const destroy = initCandleChart(chartContainerEl, priceEl, { symbol, interval, pageLimit, height })
 *   // when unmounting call destroy()
 */

export function initCandleChart(containerEl, priceEl, opts = {}) {
    const SYMBOL = (opts.symbol || 'BTCUSDT').toUpperCase()
    const SYMBOLLOWER = SYMBOL.toLowerCase()
    const INTERVAL = opts.interval || '1m'
    const PAGE_LIMIT = opts.pageLimit || 50
    const height = opts.height || 400

    if (!containerEl) throw new Error('containerEl required')

    let candles = []
    let isLoadingOlder = false
    let noMoreHistorical = false
    let lastprice = null

    const chart = createChart(containerEl, {
        width: containerEl.clientWidth,
        height,
        layout: {
            background: { color: '#121212ff' },
            textColor: 'white',
        },
        timeScale: {
            timeVisible: true,
            secondsVisible: false,
        },
        grid: {
            vertLines: { color: 'rgba(255,255,255,0.1)' },
            horzLines: { color: 'rgba(255,255,255,0.1)' },
        },
    })

    // Create a candlestick series. Different library versions expose
    // different helpers: prefer addCandlestickSeries, otherwise fall back
    // to addSeries('Candlestick', options) which works in some builds.
    let candleSeries
    const candleOptions = {
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderVisible: false,
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350',
    }

    if (typeof chart.addCandlestickSeries === 'function') {
        candleSeries = chart.addCandlestickSeries(candleOptions)
        } else if (typeof chart.addSeries === 'function') {
        try {
                        // some builds expect the series constructor (e.g. LightweightCharts.CandlestickSeries)
                        if (LightweightCharts?.CandlestickSeries) {
                            candleSeries = chart.addSeries(LightweightCharts.CandlestickSeries, candleOptions)
                        } else {
                            // string name fallback (less reliable)
                            candleSeries = chart.addSeries('Candlestick', candleOptions)
                        }
        } catch (err) {
            try {
                // or the implementation may expect a series descriptor (older global API)
                // we attempt to access a constructor-like export from the package if available
                // (chart.addSeries(CandlestickSeries, opts) used to work in some contexts)
                // This block will likely never run in modern ESM builds but is here as a fallback.
                // eslint-disable-next-line no-undef
                candleSeries = chart.addSeries(window?.LightweightCharts?.CandlestickSeries, candleOptions)
            } catch (err2) {
                // give up — at runtime this will surface further errors, but we try best effort
                // eslint-disable-next-line no-console
                console.error('Failed to create candlestick series', err2)
                throw err2
            }
        }
    } else {
        throw new Error('Unsupported chart API: cannot add candlestick series')
    }

    // Helper to convert Binance kline array to lightweight-charts data point
    function klineArrayToPoint(k) {
    // Binance kline array indices: 0=openTime,1=open,2=high,3=low,4=close,5=volume
    return {
        time: Math.floor(k[0] / 1000),
        open: parseFloat(k[1]),
        high: parseFloat(k[2]),
        low: parseFloat(k[3]),
        close: parseFloat(k[4])
    };
}

    async function loadInitial() {
        try {
            const url = `https://api.binance.com/api/v3/klines?symbol=${SYMBOL}&interval=${INTERVAL}&limit=${PAGE_LIMIT}`
            const r = await fetch(url)
            const json = await r.json()
            const initial = Array.isArray(json) ? json.map(klineArrayToPoint) : []
            if (!initial.length) return
            candles = initial
            candleSeries.setData(candles)
            chart.timeScale().fitContent()
            const last = candles[candles.length - 1]
            if (last && priceEl) {
                priceEl.innerText = '$' + last.close.toFixed(4)
            }
            lastprice = last?.close ?? null
        } catch (err) {
            console.error('Failed loading historical klines:', err)
        }
    }

    // Connect Binance websocket for real-time kline updates
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${SYMBOLLOWER}@kline_${INTERVAL}`)

    // When we receive a websocket kline message, update the chart
    ws.onmessage = function (event) {
    try {
        const payload = JSON.parse(event.data);
        // payload.k is the kline object
        const k = payload.k;
        const point = {
            time: Math.floor(k.t / 1000),
            open: parseFloat(k.o),
            high: parseFloat(k.h),
            low: parseFloat(k.l),
            close: parseFloat(k.c)
        };

        // update the series: update() will append or replace the last point as needed
        candleSeries.update(point);

        // keep the local candles array in sync (replace last point if same time or append)
        if (candles.length && candles[candles.length - 1].time === point.time) {
            candles[candles.length - 1] = point;
        } else {
            candles.push(point);
        }

                // update textual price display using the latest close
                if (priceEl) {
                    priceEl.innerText = '$' + point.close.toFixed(4)
                    try {
                        priceEl.style.color = !lastprice || lastprice === point.close ? 'white' : point.close > lastprice ? 'green' : 'red'
                    } catch (err) {
                        // ignore styling errors
                    }
                }
                lastprice = point.close
    } catch (e) {
        console.error('ws message parse error', e);
    }
};

// Convert a visible time item returned by the chart into a unix seconds timestamp
function toTimestampSeconds(t) {
    if (t === null || t === undefined) return null;
    if (typeof t === 'number') return t;
    if (typeof t === 'string') return Math.floor(new Date(t).getTime() / 1000);
    // object form: { rd } timestamp seconds or business day object { year, month, day }
    if (typeof t === 'object') {
        if ('rd' in t && typeof t.rd === 'number') return t.rd;
        if ('time' in t && typeof t.time === 'number') return t.time;
        if ('year' in t && 'month' in t && 'day' in t) return Math.floor(Date.UTC(t.year, t.month - 1, t.day) / 1000);
    }
    return null;
}

// Load older candles (prepend) using Binance REST API with endTime
    async function loadOlderCandles() {
    if (isLoadingOlder || noMoreHistorical || !candles.length) return;
    isLoadingOlder = true;
    try {
        const earliest = candles[0].time; // seconds
        // ask Binance for PAGE_LIMIT candles ending one ms before earliest
        const endTimeMs = earliest * 1000 - 1;
        // Use the canonical upper-case symbol for REST calls (Binance accepts
        // upper or lower but keeping it consistent avoids confusion)
        const url = `https://api.binance.com/api/v3/klines?symbol=${SYMBOL}&interval=${INTERVAL}&limit=${PAGE_LIMIT}&endTime=${endTimeMs}`;
        const r = await fetch(url);
        const data = await r.json();
        if (!Array.isArray(data) || data.length === 0) {
            noMoreHistorical = true;
            return;
        }
        const newPoints = data.map(klineArrayToPoint);
        // Binance returns results in chronological order (older -> newer up to endTime)
        // Only keep those strictly older than our current earliest to avoid overlap
        const filtered = newPoints.filter(p => p.time < earliest);
        if (filtered.length === 0) {
            noMoreHistorical = true;
            return;
        }
        candles = filtered.concat(candles);
        candleSeries.setData(candles);
    } catch (e) {
        console.error('failed loading older klines', e);
    } finally {
        isLoadingOlder = false;
    }
}

    const unsub = chart.timeScale().subscribeVisibleTimeRangeChange((range) => {
        if (!range || noMoreHistorical) return
        const fromTs = toTimestampSeconds(range.from)
        if (fromTs === null) return
        const MARGIN_SECONDS = 60
        if (candles.length && fromTs <= candles[0].time + MARGIN_SECONDS) {
            loadOlderCandles()
        }
    })

    // expose a destroy/cleanup function
    function destroy() {
        try {
            ws.close()
        } catch (e) {
            // ignore
        }
        try {
            if (typeof unsub === 'function') unsub()
        } catch (_) {}
        try { chart.remove() } catch (_) {}
    }

    // start initial load
    loadInitial()

    return {
        destroy,
        chart,
        candleSeries,
    }

}




// This is a function that displays price of BTC.
// let lastprice = null;

// ws.onmessage = function(event) {
//     let cryptoData = JSON.parse(event.data);
//     let price = parseFloat(cryptoData.p).toFixed(4);
//     //changing the inner text of the h1 element to the received price.
//     cryptoPrice.innerText = "$" + price;
//     //Displaying Data in Console.
//     console.log(cryptoData.p);
//     cryptoPrice.style.color = !lastprice || lastprice === price ? 'black' : price > lastprice ? "green" : "red";
//     lastprice = price;
// }