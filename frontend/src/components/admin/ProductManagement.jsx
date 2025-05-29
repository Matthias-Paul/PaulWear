import { Link } from "react-router-dom"



const ProductManagement = () => {
    const products = [
        {
            _id:11,
            name:" Shirt V",
            price:200,
            sku:"65-k6"
        },
        {
            _id:112,
            name:" Shirt K",
            price:250,
            sku:"65ee-k6"
        }, 
        {
            _id:113,
            name:" Skirt V",
            price:300,
            sku:"65-k6"
        }, 
        {
            _id:114,
            name:" Trouser",
            price:800,
            sku:"65ee-k6"
        },
        {
            _id:115,
            name:" T- Shirt",
            price:40,
            sku:"656u-k6"
        }
    ]

        const handleDeleteProduct =(productId)=>{
            if(window.confirm("Are you sure you want to delete this product?")){
                console.log("Deleting product with ID", productId)
            }

        }


  return (
    <>
      <div className="pt-[70px] md:pt-3  "  >
        <h1 className="text-2xl font-bold mb-6 " > Product Management  </h1>

                {

            products.length > 0 ? (
          <div className={`mb-20 max-w-[800px] mr-[12px] md:mr-0 shadow-md overflow-hidden overflow-x-auto  relative rounded-sm lg:rounded-md `} >
            <table className="  text-left min-w-[611px] sm:min-w-[800px] md:min-w-full  text-gray-500 " >
              <thead className="uppercase bg-gray-100 text-xs text-gray-600 " >
                <tr>
                  <th className="py-3 px-4  " > Name </th>
                  <th className="py-3 px-4  " > Price </th>
                  <th className="py-3 px-4  " > SKU </th>
                  <th className="py-3 px-4  " > Actions </th>

                </tr>
  
              </thead>
              <tbody>
                   { products?.map((product, index)=>(
                        <tr key={product?._id} className={`border-b cursor-pointer hover:border-gray-400 ${index === products?.length -1  ? "border-b-0": ""} `} >
                         <td className="py-3 px-4 sm:py-4 sm:px-4 font-medium text-gray-800 " > 
                            {product?.name}
                         </td >
                         <td className="py-3 px-4 sm:py-4 sm:px-4 font-medium text-gray-800 " > 
                            ₦{product?.price.toFixed(2)}
                         </td >

                         <td className="py-3 px-4 sm:py-4 sm:px-4" > 
                            {product?.sku}
                         </td >
                        <td className="py-3 sm:py-4   " > 
                            <Link to={`/admin/products/${product._id}/edit`} >
                            <button  className="py-1 px-2 rounded bg-yellow-500 hover:bg-yellow-600 text-white cursor-pointer  "  >
                                Edit
                            </button> 
                            </Link>
                            <button onClick={()=> handleDeleteProduct(product._id) } className="py-1 px-2 rounded bg-red-500 hover:bg-red-600 text-white cursor-pointer ml-2  "  >
                                Delete
                            </button>    
                         </td >

                        </tr>
  
                    )
                )}
              </tbody>
              
            </table>  
  
        </div>
            ): (
                <div className="text-gray-700 font-semibold text-lg " >
                    No Products Found.
                 </div>   
            )
         }  
      </div>  
    </>
  )
}

export default ProductManagement
