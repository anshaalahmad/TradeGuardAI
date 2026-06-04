const axios = require('axios');
async function run() {
  try {
    const res = await axios.post('https://ethereum-rpc.publicnode.com', {
      jsonrpc: '2.0',
      method: 'eth_getBalance',
      params: ['0x742d35Cc6634C0532925a3b844Bc454e4438f44e', 'latest'],
      id: 1,
    });
    console.log("Status:", res.status);
    console.log("Data:", res.data);
  } catch (e) {
    console.log("Error:", e.response ? e.response.status : e.message);
  }
}
run();
