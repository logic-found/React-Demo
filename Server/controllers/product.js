const ErrorHandler = require("../utils/ErrorHandler");
const { Product } = require("../schema/product");
const axios = require("axios");
const { Review } = require("../schema/review");
const multer = require("multer"); // For file upload
const path = require("path"); // For file path manipulation

// Configure multer for image upload
const upload = multer({
    dest: path.join(__dirname, "../assets"), // Upload directory (adjust path as needed)
    limits: { fileSize: 1000000 }, // Limit file size to 1MB (adjust as needed)
    fileFilter: (req, file, cb) => {
        const allowedExtensions = [".jpg", ".jpeg", ".png"];
        const extname = path.extname(file.originalname);
        if (!allowedExtensions.includes(extname.toLowerCase())) {
            cb(new Error("Only JPG, JPEG, and PNG images are allowed"));
        } else {
            cb(null, true);
        }
    },
});

exports.getAllProducts = ErrorHandler(async (req, res, next) => {
    const response = await Product.find();
    res.status(200).json({ response });
});

exports.getProductDetails = ErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
        return res.status(500).json({ message: `Invalid Product Id` });
    }
    res.status(200).json({ response: product });
});

exports.updateProductDetails = ErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    const user = req.user;
    const { name, description, price, images } = req.body;
    const product = await Product.findById(id);
    
    if (!product) {
        return res.status(404).json({ message: "Invalid Product" });
    } else if (user.role === "admin") {
        const response = await Product.findByIdAndUpdate(
            id,
            { name, description, price },
            { new: true }
        );
        return res
            .status(200)
            .json({ message: "Product updated successfully" });
    } else {
        const review = new Review({
            author_id: user._id,
            status: "pending",
            product: {
                id: product._id,
                name: {
                    value: name,
                    edited: product.name !== name ? true : false, // Check for existing value using optional chaining
                },
                description: {
                    value: description,
                    edited: product.description !== description ? true : false,
                },
                price: {
                    value: price,
                    edited: product.price !== price ? true : false,
                },
                //images: { value: images, edited: (product.images !== images)? true:false}
            },
        });
        // const uploadedImages = [];
        // const files = req.body.product?.images
        // if (files) {
        //   for (const file of files) {
        //     uploadedImages.push(file.path); // Store image paths
        //   }
        // }
        await review.save();
        return res
            .status(200)
            .json({ message: "Review submitted successfully" });
    }
});
exports.deleteAllProducts = ErrorHandler(async (req, res, next) => {
    const response = await Product.deleteMany();
    res.status(200).json({ response });
});

exports.addProductsInDB = async () => {
    try {
        const existingProducts = await Product.find();
        if (existingProducts.length > 0) {
            return;
        }
        const productAPI = process.env.PRODUCT_API;
        const { data } = await axios.get(productAPI);
        const newData = data.map((product) => ({
            name: product.productName,
            description: product.productDescription,
            images: [product.image],
            price: Number(product.price),
        }));
        await Product.insertMany(newData);
        console.log("Added products in db");
    } catch (err) {
        console.log(err);
    }
};
