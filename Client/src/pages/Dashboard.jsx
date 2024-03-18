import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import Spinner from "../components/Spinner";
import { UserContext } from "../main";
import useAxios from "../utils/useAxios";


const Dashboard = () => {
    const { user, setUser } = useContext(UserContext);
    const [products, setProducts] = useState([]);
    const {loading, data} = useAxios({
        method: "GET",
        endpoint: "product/all",
    })

    useEffect(() => {
        if(data?.response){
            setProducts(data?.response)
        }
    }, [data])
    
    
    return (
        <>
            {loading ? (
                <Spinner />
            ) : (
                <div className="p-2">
                <p className=" text-2xl font-bold">Hy, {user?.role==="admin"? "Admin": "Team Member"}!</p>
                <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-900">
                        <thead className="text-xs uppercase bg-gray-300">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Product name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Price
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr
                                    key={product._id}
                                    className="border-b bg-gray-200"
                                >
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        {product.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        {product.price}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link
                                            to={`/product/${product._id}`} // Navigate to product details page
                                            className="font-medium text-blue-600 hover:underline"
                                        >
                                            View Details
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                </div>
            )}
        </>
    );
};

export default Dashboard;
