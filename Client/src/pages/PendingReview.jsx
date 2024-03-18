import React, { useEffect, useState, useContext } from 'react'
import Spinner from "../components/Spinner";
import { Link } from 'react-router-dom';
import { UserContext } from "../main";
import useAxios from "../utils/useAxios";

const PendingReview = () => {
    const { user, setUser } = useContext(UserContext);
    const {loading, data} = useAxios({
        method: "GET",
        endpoint: "review/pending",
    })
    const [reviews, setReviews] = useState([])
    
    useEffect(() => {
        if(data?.response){
            setReviews(JSON.parse(JSON.stringify(data.response)))
        }
    }, [data])

  return (
    <>
    {loading? <Spinner/> : <div className="relative overflow-x-auto p-2">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-900">
                        <thead className="text-xs uppercase bg-gray-300">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Author 
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Product Name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Action
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
                                        {review.author_id?.email}
                                    </td>
                                    <td className="px-6 py-4">
                                        {review.product?.name?.value}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link
                                            to={`/pending-review/${review._id}`} // Navigate to product details page
                                            className="font-medium text-blue-600 hover:underline"
                                        >
                                            View Details
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>}
    </>
  )
}

export default PendingReview