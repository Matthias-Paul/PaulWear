
import { RiDeleteBin3Line } from "react-icons/ri";
const CartContents = () => {
  return (
    <>
      <div>
        {
          cartProducts.map((product)=>(
            <div className=" flex overflow-y-auto items-start justify-between py-4 border-b " key={product.id}>
                <div className=" flex items-start " >
                        <img className="w-20 h-24 object-cover flex-shrink-0 mr-4 rounded " src={product.image} alt={product.image} />
                        <div>
                            <h3>
                                   {product.name}
                             </h3>   
                             <div className=" text-sm text-gray-500  ">
                                Size: {product.size} | {product.color}
                             </div> 
                            <div className="mt-2 flex items-center gap-x-2 " >
                                 <button className="text-xl font-medium cursor-pointer px-2 border rounded " > - </button>    
                                 <span className="mx-4  " > {product.quantity} </span>
                                 <button className="text-xl font-medium cursor-pointer px-2 border rounded " > + </button>    

                            </div>    

                        </div>    
                </div>
               <div> 
                <div> ${product.price.toLocaleString()} </div>
                <button> <RiDeleteBin3Line className="h-6 cursor-pointer w-6 mt-[4px] text-red-600 " />  </button>
              </div>
            </div>    
          ))
        }
      </div>  
    </>
  );
}

const cartProducts = [
    {
       productId:1,
       name:"T-Shirt",
       size:"L",
       color:"Red",
       quantity:1,
       price:15,
       image:"https://picsum.photos/200?random=1" 
    },
        {
       productId:2,
       name:"Jean",
       size:"L",
       color:"Blue",
       quantity:2,
       price:35,
       image:"https://picsum.photos/200?random=3" 
    }
]


export default CartContents;
