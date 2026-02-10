class ApiError extends Error {
    constructor(statusCode, message, details = null) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
    }
}

const errorHandler = (err, req, res, next) => {
    console.error(`[${new Date().toISOString()}] Error: ${err.message}`);

    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            error: err.message,
            details: err.details
        });
    }

    // Handle syntax errors (JSON parsing)
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            success: false,
            error: 'Invalid JSON payload'
        });
    }

    // Default server error
    res.status(500).json({
        success: false,
        error: 'Internal Server Error'
    });
};

module.exports = {
    ApiError,
    errorHandler
};
