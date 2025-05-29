import pic from "../../assets/pic.jpg";
import { useNavigate } from "react-router-dom"
import { useState } from "react";
import PayPalButton from "./PayPalButton"



const Checkout = () => {

const cart = {
    products:[
        {
            _id:0,
            name:"Stylish Jacket",
            size: "M",
            color:"black",
            price:120,
            image:pic
        },
        {
            _id:1,
            name:"Stylish Jacket2",
            size: "L",
            color:"red",
            price:150,
            image:pic
        }
    ],
    totalPrice:270
}


   const [checkoutId, setCheckoutId] = useState(null) 
  const navigate = useNavigate()
    const [ shippingAddress, setShippingAddress ] = useState({
        firstName:"",
        lastName:"",
        address:"",
        city:"",
        postalCode:"",
        country:"",
        phone:""
    })

    const handleCreateCheckout = (e)=>{
        e.preventDefault()


        setCheckoutId(1223)
    }

    const handlePaymentSuccess =(details)=>{
        console.log("Payment Successful", details)

        navigate("/order-confirmation")
    }

  return (
    <>
      <div className=" pt-[90px] max-w-[1400px] tracking-tighter  mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 px-[12px] " >
            {/* left section */}
            <div className="bg-white pt-5 rounded-lg md:p-25 lg:p-10 " >
                <h2 className="text-2xl uppercase mb-5 " > Checkout </h2>
                <form onSubmit={handleCreateCheckout} >
                    <h1 className="text-lg mb-4 " >  Contact Details  </h1>
                    <div className="mb-4" >
                       <label className="text-gray-700 block "  > Email </label> 
                       <input type="email" className="w-full mt-1 rounded p-2 border border-gray-400" value="user@gmail.com" disabled  />                                                                                                                                                                        

                    </div> 
                       <h1 className="text-lg mb-4 " >  Delivery  </h1>
                        <div className="grid grid-cols-2 gap-4 mb-4  " >
                        <div className="  " >
                       <label className="text-gray-700 block "> First Name </label> 
                       <input type="text" required className="w-full p-2 rounded p-2 border border-gray-400 " value={shippingAddress.firstName} onChange={(e) => setShippingAddress({...shippingAddress, firstName: e.target.value})}  />                                                                                                                                                                        
                        </div>

                          <div className="  " >
                       <label className="text-gray-700 block "> Last Name </label> 
                       <input type="text" required className="w-full p-2 rounded p-2 border  border-gray-400" value={shippingAddress.lastName} onChange={(e) => setShippingAddress({...shippingAddress, lastName: e.target.value})}  />                                                                                                                                                                        
                        </div>

                        </div>  
                       <div className="  " >
                       <label className="text-gray-700 block "> Address </label> 
                       <input type="text" required className="w-full p-2 rounded p-2 border border-gray-400" value={shippingAddress.address} onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}  />                                                                                                                                                                        
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4 mt-4  " >
                        <div className="  " >
                       <label className="text-gray-700 block "> City </label> 
                       <input type="text" required className="w-full p-2 rounded p-2 border border-gray-400" value={shippingAddress.city} onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}  />                                                                                                                                                                        
                        </div>

                          <div className="  " >
                       <label className="text-gray-700 block "> Postal Code </label> 
                       <input type="text" required className="w-full p-2 rounded p-2 border border-gray-400" value={shippingAddress.postalCode} onChange={(e) => setShippingAddress({...shippingAddress, postalCode: e.target.value})}  />                                                                                                                                                                        
                        </div>

                        </div>     

                        <div className=" mt-4 " >
                       <label className="text-gray-700 block "> Country </label> 
                       <input type="text" required className="w-full p-2 rounded p-2 border  border-gray-400" value={shippingAddress.country} onChange={(e) => setShippingAddress({...shippingAddress, country: e.target.value})}  />                                                                                                                                                                        
                        </div>
                        <div className="mt-4  " >
                       <label className="text-gray-700 block "> Phone</label> 
                       <input type="tel" required className="w-full p-2 rounded p-2 border border-gray-400" value={shippingAddress.phone} onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})}  />                                                                                                                                                                        
                        </div>

                        <div className="mt-4  " >

                            {!checkoutId ? (
                                <button type="submit" className="w-full py-2 font-medium text-lg cursor-pointer bg-black text-white rounded  " > Continue To Payment  </button>
                            ):(
                                <div>
                                <h1 className="text-lg mb-4" > Pay With Paypal </h1>   
                                <PayPalButton
                                 amount={100}
                                 onSuccess={handlePaymentSuccess} 
                                 onError={(err)=> alert("Payment failed. Try again.")}
                                 /> 
                                </div>
                            )}
                        </div>    
                </form>    
            </div>    

            {/* right section */}
            <div className="bg-gray-50 py-4 lg:px-13 mb-15 lg:mb-0 rounded-lg" >
            <h1 className="text-xl mb-4 mt-5 font-[500] " > Order Summary </h1>
               <div className="border-t border-gray-700 py-4 mb-4 " >
                            {
                              
                                cart?.products?.map((product) => (
                                    <div key={product?._id} className="py-2  border-b border-gray-700 flex items-start justify-between " >
                                        <div className="flex  items-start  " >

                                           <img src={product?.image} alt={product?.name} className="w-20 h-24 object-cover rounded-sm flex-shrink-0 mr-4" />
                                            <div>
                                            <h1 className="text-md" >     {product?.name}   </h1>
                                            <p className="text-gray-500" >    Size: {product?.size}   </p>
                                             <p className="text-gray-500" >    Color: {product?.color}   </p>

                                          </div> 

                                        </div>    
                                     <p className="text-xl" >  ₦{product?.price?.toLocaleString()} </p>   

                                     </div>   
                                ))
                            }
               </div> 

               <div className=" text-lg mb-4 flex justify-between items-center" >
                            <p> SubTotal </p>
                            <p className="text-xl" >  ${cart?.totalPrice?.toLocaleString()} </p>   

               </div> 
                 <div className=" text-lg mb-4 flex justify-between items-center" >
                            <p> Shipping </p>
                            <p className="text-xl" > Free </p>   

               </div> 
                <div className=" text-lg mb-4 flex justify-between items-center pb-4 border-t border-gray-700 " >
                            <p> Total </p>
                            <p className="text-xl" >  ${cart?.totalPrice?.toLocaleString()} </p>   

               </div> 
            </div>    
           </div>  
    </>
  )
}


export default Checkout




