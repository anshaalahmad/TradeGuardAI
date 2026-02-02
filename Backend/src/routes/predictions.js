const express = require('express');
const router = express.Router();
const axios = require('axios');

// Oracle prediction API endpoint
const ORACLE_PREDICTION_API = 'http://140.245.22.67:5000/api/prediction';

/**
 * @route   GET /api/predictions/:coinId
 * @desc    Proxy prediction requests to Oracle instance
 * @access  Public
 */
router.get('/:coinId', async (req, res) => {
  try {
    const { coinId } = req.params;
    
    // Validate coinId
    if (!coinId || typeof coinId !== 'string') {
      return res.status(400).json({ error: 'Invalid coin ID' });
    }
    
    console.log(`[Predictions Proxy] Fetching prediction for ${coinId} from Oracle API...`);
    
    // Forward request to Oracle instance
    const response = await axios.get(`${ORACLE_PREDICTION_API}/${coinId}`, {
      timeout: 10000, // 10 second timeout
      headers: {
        'Accept': 'application/json',
      },
    });
    
    console.log(`[Predictions Proxy] Successfully fetched prediction for ${coinId}`);
    
    // Return Oracle's response
    res.json(response.data);
  } catch (error) {
    console.error('[Predictions Proxy] Error:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
    });
    
    if (error.response) {
      // Oracle API returned an error
      const status = error.response.status;
      const errorMessage = error.response.data?.error || error.response.data?.message || 'Prediction service error';
      
      return res.status(status).json({
        error: errorMessage,
      });
    }
    
    if (error.code === 'ECONNABORTED') {
      return res.status(504).json({ 
        error: 'Prediction service timeout - please try again' 
      });
    }
    
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({ 
        error: 'Prediction service unavailable' 
      });
    }
    
    // Network or other error
    res.status(503).json({ 
      error: 'Failed to fetch prediction data',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
