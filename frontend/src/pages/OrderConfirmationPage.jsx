import pic from "../assets/pic.jpg";

const OrderConfirmationPage = () => {

    const checkout = {
        _id:1122998,
        createdAt: new Date(),
        checkoutItems:[
            {
                productId:1,
                name:"Jacket",
                color:"Black",
                size:"M",
                price:150,
                quantity:1,
                image:pic
            },
            {
                productId:2,
                name:"T-Shirt",
                color:"Red",
                size:"M",
                price:130,
                quantity:1,
                image:pic
            }
        ],
        shippingAddress:{
             address:"123 Fashion Street",
             city:"New York",
             country:"USA"
        },


    }

    const calculateEstimatedDelivery = (createdAt)=>{
        const orderDate = new Date(createdAt)
        orderDate.setDate(orderDate.getDate() + 10) 
        return orderDate.toLocaleDateString()
    }

  return (
    <>
      <div className="max-w-[800px] py-[120px] mb-15 mx-auto px-[12px] bg-white  " >
            <h1 className=" text-emerald-800 text-2xl lg:text-4xl font-bold text-center mb-4 sm:mb-8 " > Thank you for your order!  </h1>

            {checkout && <div className="  rounded-lg border border-gray-400 p-3 sm:p-6 " >  
                <div className="flex justify-between mb-12 sm:mb-20 " >
                        {/* order id and date */}
                    <div> 
                        <h2 className=" text-md sm:text-xl font-semibold " > Order ID: {checkout._id} </h2>
                        <p className="text-gray-500 text-sm sm:text-[16px]  "> Order Date: {new Date(checkout.createdAt).toLocaleDateString() } </p>
                     </div>

                    {/* Estimated delivery */}

                    <div className=" " >
                        <p className="text-emerald-700 text-sm " > Estimated Delivery: {calculateEstimatedDelivery(checkout.createdAt)} </p>

                    </div>
                 </div>   
                    {/* ordered item */}

                    <div className="mb-10 lg:mb-20   " >
                        {
                            checkout?.checkoutItems.map((item)=>(
                                <div key={item.productId} className="flex mb-4 items-center   "  >
                                        <img src={item.image} alst={item.name} className="w-16 h-16 rounded object-cover mr-4 flex-shrink-0" />
                                            <div>
                                                    <h4 className="text-md font-semibold  " >  { item.name } </h4>
                                                    <p className="text-sm text-gray-500 " > {item.color} | { item.size  } </p>
                                            </div>   
                                            <div className=" ml-auto text-right " >
                                                    <p className="text-md " > ₦{item.price.toFixed(2)}  </p>
                                                    <p className="text-sm text-gray-500 " > Qty: { item.quantity  } </p>

                                            </div>     

                                </div>    
                            ))
                        }

                    </div>    

                    {/* payment and delivery info */}
                    <div className="grid grid-cols-2 gap-8  " >
                        {/* payment info */}

                        <div className="  " >
                            <h4 className="text-mlgd font-bold mb-2 " >  Payment </h4>
                            <p className=" text-gray-600 " > Paystack </p>
                        </div>   

                        {/* Delivery info */}

                        <div className="  ">
                            <h4 className="text-mlgd font-bold mb-2 " >  Delivery </h4>
                            <p className=" text-gray-600 " > {checkout.shippingAddress.address} </p>

                        </div>

                    </div>    
            </div>    
            }
      </div>  
    </>
  )
}

export default OrderConfirmationPage
