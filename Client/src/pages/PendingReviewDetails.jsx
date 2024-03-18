import React, { useEffect, useState, useContext } from "react";
import Spinner from "../components/Spinner";
import { Link, useParams } from "react-router-dom";
import { UserContext } from "../main";
import useAxios from "../utils/useAxios";
import toast from "react-hot-toast";
import ErrorHandler from "../utils/ErrorHandler";
import FetchData from "../utils/FetchData";

const PendingReviewDetails = () => {
    const { id } = useParams();
    const { user, setUser } = useContext(UserContext);
    const { loading, data } = useAxios({
        method: "GET",
        endpoint: `review/${id}`,
    });
    const [reviewDetails, setReviewsDetails] = useState(null);
    const [reviewStatus, setReviewStatus] = useState("accepted");
    const [updatePendingReviewLoading, setUpdatePendingReviewLoading] = useState(false)


    useEffect(() => {
        if (data?.response) {
            setReviewsDetails(JSON.parse(JSON.stringify(data.response)));
        }
    }, [data]);


    const handleSubmit = async (e) => {
        try{
          e.preventDefault();
          setUpdatePendingReviewLoading(true)
          const data = await FetchData({
              method : 'PATCH',
              endpoint : `review/${id}`,
              data : {status : reviewStatus}
            })
            setUpdatePendingReviewLoading(false)
            toast.success(data.message)
        }
        catch(err){
            setUpdatePendingReviewLoading(false)
          ErrorHandler(err)
        }
      };


    return (
        <>
            {loading ? (
                <Spinner />
            ) : (
                <div className="p-2 flex flex-col gap-4">
                    <p className=" font-bold text-xl">Author: {reviewDetails?.author_id?.email}</p>
                    <div className="flex flex-col gap-2 text-base">
                        <div className="flex justify-start gap-2 items-center flex-wrap">
                            <p className=" font-bold">Images: </p>
                            <div
                                className={`flex gap-2 flex-wrap p-4 ${
                                    reviewDetails?.product?.images?.edited ===
                                    true
                                        ? "bg-yellow-300"
                                        : ""
                                }`}
                            >
                                {reviewDetails?.product?.images?.value?.map((image) => (
                                    <img src={image} className=" h-44 w-44 border-2 border-solid border-black"/>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-start gap-2 items-center flex-wrap">
                            <p className=" font-bold">Name: </p>
                            <p
                                className={`${
                                    reviewDetails?.product?.name?.edited ===
                                    true
                                        ? "bg-yellow-300"
                                        : ""
                                }`}
                            >
                                {reviewDetails?.product?.name?.value}
                            </p>
                        </div>
                        <div className="flex justify-start gap-2 items-center flex-wrap">
                            <p className=" font-bold">Description: </p>
                            <p
                                className={`${
                                    reviewDetails?.product?.description
                                        ?.edited === true
                                        ? "bg-yellow-300"
                                        : ""
                                }`}
                            >
                                {reviewDetails?.product?.description?.value}
                            </p>
                        </div>
                        <div className="flex justify-start gap-2 items-center flex-wrap">
                            <p className=" font-bold">Price: </p>
                            <p
                                className={`${
                                    reviewDetails?.product?.price?.edited ===
                                    true
                                        ? "bg-yellow-300"
                                        : ""
                                }`}
                            >
                                {reviewDetails?.product?.price?.value}
                            </p>
                        </div>
                    </div>
                    <form className="flex gap-4 flex-col" onSubmit={handleSubmit}>
                        <div className="flex gap-2">
                        <label htmlFor="review-status" className=" text-2xl">Set Review Status:</label>
                        <select
                            id="review-status"
                            value={reviewStatus}
                            onChange={(e) => setReviewStatus(e.target.value)}
                            className=" text-lg"
                        >
                            <option value="accepted">Accepted</option>
                            <option value="rejected">Rejected</option>
                        </select>
                        </div>
                        <button type="submit" className="p-4 rounded bg-red-400 cursor-pointer disabled:cursor-not-allowed" disabled={updatePendingReviewLoading}>{updatePendingReviewLoading? "Processing..": "Update Review Status"}</button>
                    </form>
                </div>
            )}
        </>
    );
};

export default PendingReviewDetails;
