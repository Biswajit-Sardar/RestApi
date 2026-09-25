const mongoose = require('mongoose');

const {APP_VERSION, DEPLOYD_AT} = require('../utils/appVersion');



//Get/api/health
const getHealth = async (req, res) => {
    const dbStatus = mongoose.connection.readyState;
    const dbStatusMap={
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting'  
    };
    res.json({
        status: 'OK',
        massage: 'Backend API is running successfully',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        database: dbStatusMap[dbStatus]||'unknown',
        uptime: process.uptime(),
       memoryUsage: {
      rss: `${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`,
      heapUsed: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
      heapTotal: `${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)} MB`,
    },
});
}
const getVersion = async (req, res) => {
    res.json({
        success:true,
        version : APP_VERSION,
        deployedAt: DEPLOYD_AT,
        nodeVersion: process.version,
        platform: process.platform,
        masssage: 'Backend API version information ',
    });
};

module.exports = {
    getHealth,
    getVersion
};

    



