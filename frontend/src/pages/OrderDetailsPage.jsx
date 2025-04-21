import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import pic from "../assets/pic.jpg"

const OrderDetailsPage = () => {
    const { id } = useParams()
    const [orderDetails, setOrderDetails] = useState(null)

    useEffect(()=>{

        const mockOrdersDetails ={
            _id:id,
            createdAt: new Date(),
            isPaid:true,
            isDelivered:false,
            paymentMethod:"PayPal",
            shippingMethod:"Standard",
            shippingAddress: {
                city:"New York",
                country:"USA"
            },
            orderItems:[
            {
                productId:1,
                name:"T-shirt",
                price:190,
                quantity:2,
                image:pic
            },
            {
                productId:2,
                name:"Skirt",
                price:130,
                quantity:1,
                image:pic
            }
      ],
            

        }
            setOrderDetails(mockOrdersDetails)

    },[id])

    console.log(id)
  return (
    <>
      <div className=" pt-[90px] px-[12px] mx-auto max-w-[1000px] mb-20 " >
                <h2 className="font-bold mb-5 text-xl md:text-2xl mt-6 " > Order Details </h2>
                {
                  !orderDetails  ? (<p className="  " > No Order Details Found. </p>) : (
                        <div className="p-4 sm:p-6 rounded border border-gray-400  " > 
                            <div className="flex flex-col sm:flex-row justify-between mb-7  " >
                                <div className="  " >
                                    <h3 className="text:lg  md:text-xl font-semibold    " > 
                                        Order ID: #{orderDetails._id}
                                    </h3>
                                    <p className="text-gray-600  " > { new Date(orderDetails.createdAt).toLocaleDateString()  } </p>
                                </div>  

                                <div className="flex flex-col items-start sm:items-end mt-4 sm:mt-0  " >
                                    <span className={` ${orderDetails.isPaid? "bg-green-100 text-green-700" : " bg-red-100 text-red-700" } py-1 px-3 rounded-lg text-sm mb-3    `}  > 
                                       { orderDetails.isPaid ? "Approved" : "Pending"} 
                                    </span>
                                    <span className={` ${orderDetails.isDelivered? "bg-green-100 text-green-700" : " bg-yellow-100 text-yellow-700" } py-1 px-3 rounded-lg text-sm mb-3    `}  > 
                                       { orderDetails.isDelivered ? "Delivered" : "Pending Delivery"} 
                                    </span>
                                </div>      
                            </div>    

                            {/* customer, payment, shipping info */}

                        </div>
                    )
                }
            
      </div>  
    </>
  )
}

export default OrderDetailsPage
