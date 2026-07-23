const rateLimit = require("express-rate-limit");

//Auth limiter
const authLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        message: "Too many attempts, try again later"
    },
    standardHeaders: true,
    legacyHeaders: false
});



module.exports = {
    authLimiter,
    
};