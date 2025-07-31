import pic from "../../assets/pic.jpg";
import { useNavigate } from "react-router-dom"
import { useState } from "react";
import PayPalButton from "./PayPalButton"
import { useSelector, useDispatch, } from "react-redux";
import Paystack from '@paystack/inline-js'
import toast from "react-hot-toast";
import { clearMyCart }from "../../redux/slice/userSlice.js"; 


const Checkout = () => {

    const { myCart, loginUser } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    console.log(myCart)


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



    const handleCreateCheckout = async (e) => {
        e.preventDefault();
      
        try {
          const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/pay/init`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: loginUser.email,
                userId: myCart.user,
                cartId: myCart._id,
                myCart: myCart.products,
                firstName: shippingAddress.firstName,
                lastName: shippingAddress.lastName,
                phone: shippingAddress.phone,
                address: shippingAddress.address,
              }),
          });
      
          const { access_code,  reference  } = await res.json();
          const key =  import.meta.env.VITE_PAYSTACK_PUBLIC_KEY


          const popup = new Paystack()  

          popup.newTransaction({
            key,
            reference,
            email: loginUser.email,
            onSuccess: (transaction) => {
              console.log("Payment Success:", transaction);
              toast.success("Payment Successful")

              navigate(`/order-confirmation?reference=${transaction.reference}`);
            },
            onCancel: () => {
              toast.error("Transaction canceled");
            },
          });
      
        } catch (err) {
            toast.error("Payment failed!")
          console.error("Payment failed:", err);
        }
      };
      

      console.log("MyCart", myCart)


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
                       <input type="email" className="w-full mt-1 rounded p-2 border border-gray-400" value={loginUser?.email} disabled  />                                                                                                                                                                        

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
                       <label className="text-gray-700 block ">Delivery Address </label> 
                       <input type="text" required className="w-full p-2 rounded p-2 border border-gray-400" value={shippingAddress.address} onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}  />                                                                                                                                                                        
                        </div>

                        <div className="mt-4  " >
                       <label className="text-gray-700 block "> Phone</label> 
                       <input type="tel" required className="w-full p-2 rounded p-2 border border-gray-400" value={shippingAddress.phone} onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})}  />                                                                                                                                                                        
                        </div>

                        <div className="mt-4  " >

                                <button   type="submit" className="w-full active:border active:border-gray-400 active:bg-white active:text-black py-2 font-medium text-lg cursor-pointer bg-black text-white rounded  " > Continue To Payment  </button>
                           
                        </div>    
                </form>    
            </div>    

            {/* right section */}
            <div className="bg-gray-50 py-4 px-2 sm:px-5 lg:px-13 mb-15 lg:mb-0 rounded-lg" >
            <h1 className="text-xl mb-4 mt-5 font-[500] " > Order Summary </h1>
               <div className="border-t border-gray-700 py-4 mb-4 " >
                            {
                              
                                myCart?.products?.map((product) => (
                                    <div key={product?._id} className="py-2 text-sm  border-b border-gray-700 flex items-start justify-between " >
                                        <div className="flex text-sm sm:text-lg  items-start justify-center " >

                                           <img src={product?.image} alt={product?.name} className="w-20 h-24 sm:w-26 sm:h-30 object-cover rounded-sm flex-shrink-0 mr-4" />
                                            <div>
                                            <h1 className=" font-[400] " >     {product?.name}   </h1>
                                            <p className="text-gray-500" >    Size: {product?.size}   </p>
                                             <p className="text-gray-500" >    Color: {product?.color}   </p>
                                             <p className="text-gray-500" >    Quantity: {product?.quantity}   </p>

                                          </div> 

                                        </div>    
                                     <p className=" text-md sm:text-xl" >  ₦{Number(product?.price).toLocaleString()} </p>   

                                     </div>   
                                ))
                            }
               </div> 

               <div className="  text-md sm:text-xl mb-4 flex justify-between items-center" >
                            <p> SubTotal </p>
                            <p className=" " >  ₦{myCart?.totalPrice?.toLocaleString()} </p>   

               </div> 
                 <div  className=" text-md sm:text-xl mb-4 flex justify-between items-center" >
                            <p> Delivery </p>
                            <p className=" " > Free </p>   

               </div> 
                <div className=" text-md sm:text-xl mb-4 flex justify-between items-center pb-4 border-t border-gray-700 " >
                            <p> Total </p>
                            <p className=" " >  ₦{myCart?.totalPrice?.toLocaleString()} </p>   

               </div> 
            </div>    
           </div>  
    </>
  )
}


export default Checkout




