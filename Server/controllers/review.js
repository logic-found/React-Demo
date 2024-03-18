const ErrorHandler = require("../utils/ErrorHandler");
const { Review } = require("../schema/review");
const { Product } = require("../schema/product");

exports.getReview = ErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    const reviews = await Review.findById(id).populate({
        path: "author_id",
        select: { email: 1 },
    });
    res.status(200).json({ response: reviews });
});

exports.getAllReviews = ErrorHandler(async (req, res, next) => {
    const user = req.user;
    if (user.role === "admin") {                                          // if admin then return all reviews
        const reviews = await Review.find().populate({
            path: "author_id",
            select: { email: 1 },
        });
        return res.status(200).json({ response: reviews });
    } else {                                                             // if team member then return his reviews
        const reviews = await Review.find({ author_id: user._id });
        res.status(200).json({ response: reviews });
    }
});
exports.getAllPendingReviews = ErrorHandler(async (req, res, next) => {
    const reviews = await Review.find({ status: "pending" }).populate({
        path: "author_id",
        select: { email: 1 },
    });
    res.status(200).json({ response: reviews });
});

exports.updateReviewStatus = ErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    const review = await Review.findById(id);
    const data = req.body;
    const { status } = data;

    if (!review) {
        return res.status(500).json({ message: `Invalid Review Id` });
    } else if (review.status === "accepted") {
        return res
            .status(400)
            .json({
                message: `Review is already ACCEPTED, it can't be updated!`,
            });
    }

    if (status === "accepted") {
        const { product } = review;
        const name = product.name?.value;
        const description = product.description?.value;
        const price = product.price?.value;
        //const images = product.images?.value
        const upatedProduct = { name, description, price };
        const updatedProduct = await Product.findByIdAndUpdate(
            product.id,
            upatedProduct,
            { new: true }
        );
        if (!updatedProduct) {
            return res
                .status(400)
                .json({ message: "Failed to update product." });
        }
    }
    review.status = status;
    await review.save();
    res.status(200).json({ message: "Review status updated successfully." });
});

exports.deleteAllReviews = ErrorHandler(async (req, res, next) => {
    const response = await Review.deleteMany();
    res.status(200).json({ response });
});
