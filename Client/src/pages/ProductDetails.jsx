import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import useAxios from "../utils/useAxios";
import Spinner from "../components/Spinner";
import { UserContext } from "../main";
import FetchData from "../utils/FetchData";
import ErrorHandler from "../utils/ErrorHandler";
import toast from "react-hot-toast";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const ProductDetails = () => {
    const { id } = useParams();
    const { user, setUser } = useContext(UserContext);
    const { loading, data } = useAxios({
        method: "GET",
        endpoint: `product/${id}`,
        data: null,
    });
    const [productDetails, setProductDetails] = useState({
        name: "",
        description: "",
        price: "",
        images: [],
    });
    const [productUpdateLoading, setProductUpdateLoading] = useState(false);
    const [src, selectedFile] = useState(null);
    const [crop, setCrop] = useState(null);
    const [image, setImage] = useState(null);
    const [resultImage, setResultImage] = useState(null);

    function getCroppedImg(e) {
        e.preventDefault();
        if (src) {
            const img = new Image();
            img.src = src;
            img.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
          
                const ctx = canvas.getContext("2d");
          
                // Adjust cropping coordinates based on original dimensions
                ctx.drawImage(
                  img,
                  crop.x * img.naturalWidth / img.width,  // Adjust X using naturalWidth
                  crop.y * img.naturalHeight / img.height, // Adjust Y using naturalHeight
                  crop.width * img.naturalWidth / img.width,  // Adjust width using naturalWidth
                  crop.height * img.naturalHeight / img.height, // Adjust height using naturalHeight
                  0,
                  0,
                  crop.width * img.naturalWidth / img.width,
                  crop.height * img.naturalHeight / img.height
                );
                const base64Image = canvas.toDataURL("image/jpeg");
                setResultImage(base64Image);
            };
        }
    }

    const handleFileChange = (e) => {
        selectedFile(URL.createObjectURL(e.target.files[0]));

        // const file = e.target.files[0];
        // const reader = new FileReader();
        // reader.onload = () => {
        //     selectedFile(reader.result);
        // };
        // reader.readAsDataURL(file);
    };

    useEffect(() => {
        if (data?.response) {
            const response = JSON.parse(JSON.stringify(data.response));
            setProductDetails(response);
        }
    }, [data]);

    const onChangeHandler = (key, value) => {
        setProductDetails((prevState) => {
            return {
                ...prevState,
                [key]: value,
            };
        });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            setProductUpdateLoading(true);
            const data = await FetchData({
                method: "PATCH",
                endpoint: `product/${id}`,
                data: {
                    name: productDetails.name,
                    description: productDetails.description,
                    price: productDetails.price,
                    images: productDetails.images,
                },
            });
            setProductUpdateLoading(false);
            toast.success(data.message);
        } catch (err) {
            setProductUpdateLoading(false);
            ErrorHandler(err);
        }
    };

    return (
        <>
            {loading ? (
                <Spinner />
            ) : (
                <form className="text-center w-full p-4 flex flex-col gap-4 flex-wrap justify-evenly items-center text-gray-900">
                    <div className="w-full flex gap-6 justify-evenly">
                        <div className="flex flex-col gap-2">
                            {productDetails.images?.length > 0 ? (
                                <img
                                    src={productDetails?.images[0]}
                                    alt="image"
                                    className=" h-60 w-60 rounded"
                                />
                            ) : (
                                <p>No image present</p>
                            )}
                            {/* <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleFileChange}
                            />
                            <div>
                                {src && (
                                    <>
                                        <ReactCrop
                                            crop={crop}
                                            onChange={(c) => setCrop(c)}
                                        >
                                            <img
                                                src={src}
                                                onLoad={setImage}
                                                className=""
                                            />
                                        </ReactCrop>
                                        <button
                                            className="bg-red-500 p-3 rounded cursor-pointer"
                                            onClick={getCroppedImg}
                                        >
                                            Crop Image
                                        </button>
                                    </>
                                )}
                                {resultImage && (
                                    <img
                                        src={resultImage}
                                        className=" h-44 w-52"
                                    />
                                )}
                            </div> */}
                        </div>
                        <div className="flex flex-col gap-2 text-base">
                            <div className="flex justify-between items-center flex-wrap">
                                <p className=" font-bold">Name: </p>
                                <input
                                    type="string"
                                    value={productDetails?.name}
                                    className="w-full p-2"
                                    onChange={(e) =>
                                        onChangeHandler("name", e.target.value)
                                    }
                                />
                            </div>
                            <div className="flex justify-between items-center flex-wrap">
                                <p className=" font-bold">Description: </p>
                                <textarea
                                    rows={10}
                                    type="string"
                                    value={productDetails?.description}
                                    className="w-full p-2"
                                    onChange={(e) =>
                                        onChangeHandler(
                                            "description",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                            <div className="flex justify-between items-center flex-wrap">
                                <p className=" font-bold">Price: </p>
                                <input
                                    type="number"
                                    value={productDetails?.price}
                                    className="w-full p-2"
                                    onChange={(e) =>
                                        onChangeHandler("price", e.target.value)
                                    }
                                />
                            </div>
                        </div>
                    </div>
                    <button
                        type="submit"
                        onClick={submitHandler}
                        className=" bg-indigo-600 text-white p-4 rounded cursor-pointer disabled:cursor-not-allowed"
                        disabled={productUpdateLoading}
                    >
                        {productUpdateLoading
                            ? "Processing..."
                            : `${
                                  user?.role === "admin"
                                      ? "Update Product"
                                      : "Submit Changes for Approval"
                              }`}
                    </button>
                </form>
            )}
        </>
    );
};

export default ProductDetails;

// function getCroppedImg() {
//     const canvas = document.createElement("canvas");
//     const scaleX = image.naturalWidth / image.width;
//     const scaleY = image.naturalHeight / image.height;
//     canvas.width = crop.width;
//     canvas.height = crop.height;
//     const ctx = canvas.getContext("2d");

//     ctx.drawImage(
//         image,
//         crop.x * scaleX,
//         crop.y * scaleY,
//         crop.width * scaleX,
//         crop.height * scaleY,
//         0,
//         0,
//         crop.width,
//         crop.height
//     );
// const base64Image = canvas.toDataURL('image/jpeg')
// setResultImage(base64Image)

// }
