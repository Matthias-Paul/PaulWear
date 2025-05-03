import { useParams, Link } from "react-router-dom"
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
                                <div className="grid mb-13 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-6  " >
                                        <div>
                                            <h3 className="text:lg  mb-2 font-semibold    " > 
                                                    Payment Info
                                            </h3>
                                            <p> Payment Method: { orderDetails.paymentMethod} </p>
                                            <p> Status: { orderDetails.isPaid ? "Paid" : "Unpaid"} </p>

                                         </div>   
                                          <div>
                                            <h3 className="text:lg  mb-2 font-semibold    " > 
                                                    Shipping Info
                                            </h3>
                                            <p> Shipping Method: { orderDetails.shippingMethod} </p>
                                            <p> { ` ${orderDetails.shippingAddress.city}, ${orderDetails.shippingAddress.country} ` } </p>

                                         </div>  

                                </div>

                                {/* products list  */}


         { orderDetails?.orderItems ? (
            <div className={` shadow-md overflow-hidden  overflow-x-auto  relative rounded-sm lg:rounded-md `} >
            <table className="w-full  text-left min-w-[800px]  text-gray-500 " >
              <thead className="uppercase bg-gray-100 text-xs text-gray-600 " >
                <tr>
                  <th className="py-2 px-4 sm:py-3 " > Name </th>
                  <th className="py-2 px-4 sm:py-3 " > Unit Price </th>
                  <th className="py-2 px-4 sm:py-3 " > Quantity </th>
                  <th className="py-2 px-4 sm:py-3 " > Total </th>

                </tr>
  
              </thead>
              <tbody>
                   { orderDetails?.orderItems?.map((item, index)=>(
                        <tr key={item?.productId} className={`border-b cursor-pointer hover:border-gray-400 ${index === orderDetails?.orderItems?.length -1  ? "border-b-0": ""} `} >
                       <td className="py-2 px-4 flex items-center  sm:py-3 sm:px-4 " > 
                        <img src={item?.image} className="w-12 h-12 mr-2 rounded-lg sm:rounded-md object-cover flex-shrink-0 " alt={item?.name} />
                            <Link to={`/product/${item.productId}`} className="text-blue-500 hover:underline" >
                                {item?.name}
                            </Link>
                         </td >
                         <td className="py-2 px-4 sm:py-4 sm:px-4 font-medium text-gray-800 " > 
                            ${item?.price}
                         </td >

                         <td className="py-2 px-4 sm:py-4 sm:px-4" > 
                            {item?.quantity}                      
                         </td >
                        <td className="py-2 px-4 sm:py-4 sm:px-4" > 
                            ${item?.price * item?.quantity}                      
                         </td >

                        </tr>
  
                    )
                )}
              </tbody>
              
            </table>  
  
          </div>
        

          ):(

            <div className="py-4 text-gray-500 text-xl px-4 text-center" >
            You have no order details 
          </div>
          )

        }

                    <div className="mt-5" >    
                        <Link to={`/my-orders`}  className="text-blue-500 pt-4 hover:underline" >
                                Back to my orders
                        </Link>
                    </div>
                        </div>
                    )
                }
            
      </div>  
    </>
  )
}

export default OrderDetailsPage
