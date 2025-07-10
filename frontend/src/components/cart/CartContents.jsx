import { useNavigate, Link} from "react-router-dom";
import { useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { RiDeleteBin3Line } from "react-icons/ri";
import { setMyCart, clearMyCart, setCartQuantity } from "../../redux/slice/userSlice.js";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";



const CartContents = ({toggleCartDrawer}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { myCart, loginUser, guestId } = useSelector((state) => state.user);
  const [quantity, setQuantity] = useState(1);
  const [productId, setProductId] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");

  const queryClient = useQueryClient();

  const key = loginUser?.id
  ? ["cart", "user", loginUser.id]
  : ["cart", "guest", guestId];

  const isLoggedIn = Boolean(loginUser?.id);

  const url = isLoggedIn
    ? `${import.meta.env.VITE_BACKEND_URL}/api/cart?userId=${loginUser.id}`
    : `${import.meta.env.VITE_BACKEND_URL}/api/cart?guestId=${guestId}`;


  const fetchCart = async () => {
    console.log("Fetching cart...");
    const res = await fetch(url, {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error("Failed to fetch  products in cart");
    }
    return res.json();
  };

    const cartQueryKey = loginUser?.id
      ? ["cart", "user", loginUser.id]
      : ["cart", "guest", guestId];

    const { data, isLoading } = useQuery({
      queryKey: cartQueryKey,
      queryFn: fetchCart,
    });


    useEffect(() => {
    if (data) {
      dispatch(setMyCart(data.cart))
      dispatch(setCartQuantity(data.cart.products.length || ""))

    }
  }, [data, myCart]);

   const deleteMutation = useMutation({
      mutationFn: async ({ product, userId, guestId }) => {
          const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cart/${product.productId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              productId: product.productId,
              userId,
              guestId,
              color: product.color,
              size: product.size,
              quantity: product.quantity
            }),
          });

          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Failed to remove product from the cart");
          }

          return res.json();
        },
        onSuccess: (data) => {
        const key = loginUser?.id
        ? ["cart", "user", loginUser.id]
        : ["cart", "guest", guestId];

        queryClient.invalidateQueries(key);
        toast.success(data.message);

    },
    onError: (error) => {
      toast.error(error.message);
    },

  })

        const handleDeleteProduct = (product) => {
          if (window.confirm("Are you sure you want to delete this product?")) {
            deleteMutation.mutate({
              product,
              userId: loginUser?.id,
              guestId,
            });
          }
        };

        const updateCartMutation = useMutation({
          mutationFn: async ({ product, quantity, userId, guestId }) => {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({
                productId: product.productId,
                size: product.size,
                color: product.color,
                quantity, 
                userId,
                guestId,
              }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to update cart");

            return data;
          },
          onSuccess: (data) => {
            const key = loginUser?.id
            ? ["cart", "user", loginUser.id]
            : ["cart", "guest", guestId];

            queryClient.invalidateQueries(key);
            toast.success(data.message);

          },
          onError: (err) => {
            toast.error(err.message);
          }
        });

        const handleQuantityChange = (product, action) => {
          setProductId(product?.productId)
          setSize(product?.size)
          setColor(product?.color)
          console.log(productId)
            let newQuantity = product.quantity;
            if (action === "plus") {
              newQuantity += 1;
              console.log(newQuantity)
            } else if (action === "minus" && product.quantity > 1) {
              newQuantity -= 1;
            } else {
              return;
            }

            updateCartMutation.mutate({
              product,
              quantity: newQuantity,
              userId: loginUser?.id,
              guestId
            });
          };

          queryClient.invalidateQueries(key);

          const handleCheckout= ()=>{
              if(!data?.cart){
                queryClient.invalidateQueries(key);
                toast.error("Cart does not exist")
                dispatch(clearMyCart())
              }else{
                navigate("/checkout")
                toggleCartDrawer()
              }

            
          }

  return (
    <>
      <div>

        <div>
        { myCart?.products?.length >= 1 ? (
          myCart?.products?.map((product)=>(
            <div className=" flex overflow-y-auto items-start gap-x-3 justify-between py-4 border-b " key={`${product.productId}-${product.size}-${product.color}`}>
                <div className=" flex items-start " >
                        <img className="w-20 h-24 object-cover flex-shrink-0 mr-4 rounded " src={product?.image} alt={product?.image} />
                        <div>
                            <h3>
                                   {product?.name}
                             </h3>   
                             <div className=" text-sm text-gray-500  ">
                                Size: {product?.size} | {product?.color}
                             </div> 
                            <div className="mt-2 flex items-center gap-x-2 " >
                                 <button onClick={() => handleQuantityChange(product, "minus")} className="text-xl active:bg-gray-200 font-medium cursor-pointer px-2 border rounded " > - </button>    
                                 <span className="mx-4" >
                                 {updateCartMutation?.isPending && product?.productId === productId && product?.size === size && product?.color === color ? (
                                        <div className="flex items-center justify-center ">
                                          <div className="w-5 h-5 border-5 rounded-full animate-spin border-gray-400"></div>
                                        </div>
                                      ) : (
                                       <span> {product?.quantity} </span>
                                      )}
                                   
                                   </span>
                                 <button onClick={() => handleQuantityChange(product, "plus")} className="text-xl active:bg-gray-200 font-medium cursor-pointer px-2 border rounded " > + </button>    

                            </div>    

                        </div>    
                </div>
               <div> 
                <div className=" text-end " >
                <div> ₦{Number(product?.price).toLocaleString()} </div>
                <button onClick={()=> handleDeleteProduct(product) } > <RiDeleteBin3Line className="h-6 cursor-pointer w-6 mt-[4px] text-red-600 " />  </button>
                </div>
              </div>

             


            </div>

                
          ))

         
        ):(
        <>
        <div className="text-center font-medium text-[16px] pb-7  " > No products found in your cart, start shopping!  </div>
        <div className=" px-4 xl:w-[460px] text-center mx-auto  bottom-8  bg-white "> 
            <Link to="/collections/all" >  <button  onClick={toggleCartDrawer} className="w-full transition hover:bg-gray-800 text-white py-2 bg-black cursor-pointer rounded-md font-semibold  "> Start Shopping </button> </Link>
        </div>
        </>
        )
          
        }
        </div>  
        {
          myCart?.products?.length >=1 &&(
          <div className=" px-4 xl:w-[460px] text-center mx-auto  bottom-8 py-7 bg-white "> 
                    <button onClick={handleCheckout} className="w-full transition hover:bg-gray-800 text-white py-2 bg-black cursor-pointer rounded-md font-semibold  "> Checkout </button>
                    <div className="text-sm tracking-tighter text-center mt-2 text-gray-500  " > Total price is calculated at checkout. </div>
        </div>
          )
        }
        

      </div>  
    </>
  );
}




export default CartContents;
