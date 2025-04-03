import { Link } from "react-router-dom"

const ProductGrid = ({products}) => {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4  " >
       {
        products?.map((product)=>{
          <Link to={`/products/${product._id}`} key={product?._id} className=" block " >
            <div className="bg-white p-4  rounded-lg "  >
              <div className="w-full h-95 mb-4 " >
                  <img src={product?.image} alt={product?.name} />
              </div>
            </div>
          </Link>  
        })
      
       }

      </div>  
    </>
  )
}

export default ProductGrid
