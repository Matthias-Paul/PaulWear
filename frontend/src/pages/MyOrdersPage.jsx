import pic from "../assets/pic.jpg"
import { useState, useEffect } from "react";


const MyOrdersPage = () => {
  const [orders, setOrders ] = useState()

  useEffect(()=>{
    const mockUsers = [
      {
        _id:126373,
        createdAt: new Date(),
        shippingAddress: {city:"New York", country:"USA"     },
        orderItems:[
          {
          name:"Product 1",
          image:pic
        }
      ],
        totalPrice:100,
        isPaid:true
      },
      {
        _id:133426373,
        createdAt: new Date(),
        shippingAddress: {city:"Califonia", country:"USA"     },
        orderItems:[
          {
          name:"Product 2",
          image:pic
        }
      ],
        totalPrice:100,
        isPaid:true
      },
      {
        _id:126373333223,
        createdAt: new Date(),
        shippingAddress: {city:"New York", country:"USA"     },
        orderItems:[
          {
          name:"Product 3",
          image:pic
        }
      ],
        totalPrice:1300,
        isPaid:false
      },
      {
        _id:126373333,
        createdAt: new Date(),
        shippingAddress: {city:"New York", country:"USA"     },
        orderItems:[
          {
          name:"Product 4",
          image:pic
        }
      ],
        totalPrice:200,
        isPaid:true
      },
      {
        _id:12637266653,
        createdAt: new Date(),
        shippingAddress: {city:"New York", country:"USA"     },
        orderItems:[
          {
          name:"Product 5",
          image:pic
        }
      ],
        totalPrice:100,
        isPaid:true
      }
     ]
     setOrders(mockUsers)

  },[])


  console.log(orders)

  return (
    <>
      <div className="mx-auto w-full " >
        <h1 className="text-xl md:text-2xl font-bold mb-6" > My Orders </h1>

        { orders?.length > 0 ? (
            <div className={` shadow-md overflow-hidden  overflow-x-auto  relative rounded-sm lg:rounded-md `} >
            <table className="w-full  text-left min-w-[800px]  text-gray-500 " >
              <thead className="uppercase bg-gray-100 text-xs text-gray-600 " >
                <tr>
                  <th className="py-2 px-4 sm:py-3 " > Image </th>
                  <th className="py-2 px-4 sm:py-3 " > Order Id </th>
                  <th className="py-2 px-4 sm:py-3 " > Created </th>
                  <th className="py-2 px-4 sm:py-3 " > Shipping Address </th>
                  <th className="py-2 px-4 sm:py-3 " > Items</th>
                  <th className="py-2 px-4 sm:py-3 " > Price </th>
                  <th className="py-2 px-4 sm:py-3 " > Status </th> 
                </tr>
  
              </thead>
              <tbody>
                   { orders?.map((order, index)=>(
                        <tr key={order?._id} className={`border-b  cursor-pointer hover:border-gray-400 ${index === orders?.length -1  ? "border-b-0": ""} `} >
                       <td className="py-2 px-4 sm:py-4 sm:px-4 " > 
                        <img src={order?.orderItems[0]?.image} className="w-12 h-12 xl:w-15 xl:h-15 rounded-lg sm:rounded-md object-cover flex-shrink-0 " alt={order?.orderItems[0]?.name} />
                         </td >
                         <td className="py-2 px-4 sm:py-4 sm:px-4 font-medium text-gray-800 " > 
                            #{order?._id}
                         </td >
                         <td className="py-2 px-4 sm:py-4 sm:px-4" > 
                            { order.createdAt.toLocaleDateString()}{"  "}
                            { order.createdAt.toLocaleTimeString()}
  
                         </td >
                         <td className="py-2 px-4 sm:py-4 sm:px-4" > 
                            {order?.shippingAddress ? ` ${order?.shippingAddress?.city}, ${order?.shippingAddress?.country}` : "N/A"  }
                        
                         </td >
                         <td className="py-2 px-4 sm:py-4 sm:px-4" > 
                            {  order?.orderItems?.length }                      
                         </td >
                         <td className="py-2 px-4 sm:py-4 sm:px-4" > 
                            ${order?.totalPrice}                      
                         </td >
                         <td className="py-2 px-4 sm:py-4 sm:px-4" > 
  
                          <span className={` ${order.isPaid ?  "bg-green-100 text-green-600 ":   " bg-red-100 text-red-600 "} px-3 py-2 rounded text-sm font-medium `} > {order.isPaid ? "Paid" :"Pending"}  </span>
  
  
                         </td >
                        </tr>
  
                    )
                )}
              </tbody>
              
            </table>  
  
          </div>
        

          ):(

            <div className="py-4 text-gray-500 text-xl px-4 text-center" >
            You have no orders yet!
          </div>
          )

        }

      </div>  
    </>
  )
}

export default MyOrdersPage
