const ErrorHandler = require("../utils/ErrorHandler");
const { Product } = require("../schema/product");
const axios = require("axios");
const { Review } = require("../schema/review");
const multer = require("multer"); // For file upload
const path = require("path"); // For file path manipulation
const fs = require('fs'); // For image storage


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'assets/'); // Replace 'assets' with your desired folder path
    },
    filename: (req, file, cb) => {
      const extension = path.extname(file.originalname);
      const filename = `image-${extension}`;
      cb(null, filename);
    }
  });
  
  // Create a multer instance with the configured storage
const upload = multer({ storage });
  

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
            { name, description, price, images},
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
                images: { value: images, edited: (product.images !== images)? true:false}
            },
        });
        const uploadedImages = [];
        images.forEach((imageData, index) => {
            const filename = `image-${Date.now()}-${index}`;
            const filePath = path.join('assets', filename);
            fs.writeFileSync(filePath, Buffer.from(imageData, 'base64'));
            uploadedImages.push(filename);
        });
    
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
