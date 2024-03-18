const ErrorHandler = require("../utils/ErrorHandler");
const { User } = require("../schema/user");

exports.register = ErrorHandler(async (req, res, next) => {
    const { email, password, role } = req.body;
    const newUser = new User({ email, password, role });
    const user = await newUser.save();
    const token = user.generateJWTtoken();
    res.status(200).json({
        message: "User created",
        user: { _id:user._id, email: user.email, role: user.role },
        token,
    });
});

exports.login = ErrorHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        res.status(500).json({
            message: "Please enter email & password to login",
        });

    const user = await User.findOne({ email });
    if (!user) res.status(401).json({ message: "Invalid email or password" });

    const passwordMatched = await user.comparePassword(password);
    if (passwordMatched) {
        const token = user.generateJWTtoken();
        res.status(200).json({
            message: "Logged In",
            user: { _id:user._id, email: user.email, role: user.role },
            token,
        });
    } else {
        res.status(401).json({ message: "Invalid email or password" });
    }
});

exports.getUserDetails = ErrorHandler(async (req, res) => {
    const id = req.user?._id
    const user = await User.findById(id).select('email role')
    res.status(200).json({response : user})
});
exports.deleteAllUsers = ErrorHandler(async (req, res) => {
    const response = await User.deleteMany()
    res.status(200).json({response})
});



