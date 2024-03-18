const ErrorHandler = (theFunc) => {
    return async (req, res, next) => {
        try {
            await theFunc(req, res, next);
        } catch (err) {
            let statusCode = err.statusCode || 500;
            let message = err.message || "Internal Server Error";

            if (err.name === "CastError") {
                // wrong mongoDB id error
                message = `Resource not found. Invalid : ${err.path}`;
                statusCode = 400;
            } else if (err.code === 11000) {
                // mongoose duplicate key error
                message = `Duplicate ${Object.keys(err.keyValue)} value`;
                statusCode = 400;
            } else if (err.name === "JsonWebTokenError") {
                message = `Json Web Token is invalid, Try again`;
                statusCode = 401;
            } else if (err.name === "TokenExpiredError") {
                message = `Json Web Token is Expired, Try again`;
                statusCode = 401;
            }

            res.status(statusCode).json({
                message,
            });
        }
    };
};

module.exports = ErrorHandler;
