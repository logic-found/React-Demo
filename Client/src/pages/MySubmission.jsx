import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import Spinner from "../components/Spinner";
import { UserContext } from "../main";
import useAxios from "../utils/useAxios";

const MySubmission = () => {
    const { user } = useContext(UserContext);
    const { loading, data } = useAxios({
        method: "GET",
        endpoint : 'review/all',
        data: null,
    });
    const [reviews, setReviews] = useState(null);

    useEffect(() => {
        if (data?.response) {
            setReviews(data?.response);
        }
    }, [data]);

    return (
      <>
      {loading ? (
                <Spinner />
            ) : (
                <div className="p-2">
                <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-900">
                        <thead className="text-xs uppercase bg-gray-300">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Product name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Description
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {reviews?.map((review) => (
                                <tr
                                    key={review._id}
                                    className="border-b bg-gray-200"
                                >
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        {review.product?.name.value}
                                    </td>
                                    <td className={`px-6 py-4 ${review.status==="accepted"? "bg-blue-400":(review.status==="rejected"? "bg-red-400": "bg-yellow-400")}`}>
                                        {review.status}
                                    </td>
                                    <td className="px-6 py-4">
                                        {review.product?.description.value}
                                    </td>
                                    
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                </div>
            )}
      </>
    )
};

export default MySubmission;
