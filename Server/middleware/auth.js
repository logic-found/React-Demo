const { User } = require("../schema/user");
const ErrorHandler = require("../utils/ErrorHandler");
const jwt = require("jsonwebtoken");

exports.auth = ErrorHandler(async (req, res, next) => {
    const authorizationHeader = req.headers?.authorization;
    if (!authorizationHeader)
        res.status(401).json({
            message: "Please login to access this resource",
        });
    else {
        const token = authorizationHeader?.split(" ")[1];
        if (token) {
            // if token exist
            const { id } = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(id);
            if (user) {
                req.user = user;
                next();
            } else {
                throw new Error("Please login to access this resource", 401);
            }
        } else {
            throw new Error("Please login to access this resource", 401);
        }
    }
});

exports.authorizeRole = ErrorHandler((req, res, next) => {
    const { role } = req.user;
    if (!role || role !== "admin") {
        res.status(403).json({
            message: `Role : ${req.user?.role} is not allowed to perform this action`,
        });
    } else next();
});
