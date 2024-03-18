import React, { useEffect, useState, useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import Spinner from "../components/Spinner";
import { UserContext } from "../main";
import useAxios from "../utils/useAxios";

const Profile = () => {
    const { user } = useContext(UserContext);
    const { loading, data } = useAxios({
        method: "GET",
        endpoint : 'review/all',
        data: null,
    });
    const [reviews, setReviews] = useState(null);
    const { totalReviews, acceptedReviews, rejectedReviews } = useMemo(() => {
        let acceptedCount = 0;
        let rejectedCount = 0;
        let totalCount = 0;
        data?.response?.forEach((review) => {
            if (review.status === "accepted") {
                acceptedCount++;
            } else if (review.status === "rejected") {
                rejectedCount++;
            }
            totalCount++;
        });

        return {
            totalReviews: totalCount,
            acceptedReviews: acceptedCount,
            rejectedReviews: rejectedCount,
        };
    }, [data]);

    useEffect(() => {
        if (data?.response) {
            setReviews(data?.response)
        }
    }, [data]);

    return (
        <>
            {loading ? (
                <Spinner />
            ) : (
                <div className="p-2 text-gray-900">
                    
                    <div className="w-full flex justify-center gap-2">
                        <div className="h-28 w-28 text-center font-semibold rounded bg-white p-3 flex flex-col gap-2">
                            <p>Total Request</p>
                            <p>{totalReviews}</p>
                        </div>
                        <div className="h-28 w-28 text-center font-semibold rounded bg-white p-3 flex flex-col gap-2">
                            <p>Accepted Request</p>
                            <p>{acceptedReviews}</p>
                        </div>
                        <div className="h-28 w-28 text-center font-semibold rounded bg-white p-3 flex flex-col gap-2">
                            <p>Rejected Request</p>
                            <p>{rejectedReviews}</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Profile;
