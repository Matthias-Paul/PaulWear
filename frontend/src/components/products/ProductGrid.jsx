import { Link } from "react-router-dom";

const ProductGrid = ({ products }) => {
  return (
    <>
      <div className="grid grid-cols-1   gap-x-[25px] mt-12 gap-y-[25px] sm:grid-cols-2 lg:grid-cols-4  ">
        {products?.map((product) => (
          <div key={product._id} className="bg-white  block  ">
            <Link
              to={`/products/${product._id}`}
              key={product?._id}
              className="   "
            >
              <div className="w-full  mb-4 ">
                <img className="object-cover mb-2 rounded-md flex-shrink-0 h-110 " src={product?.image} alt={product?.name} />
                <div className="text-sm  " > {product.name} </div>
                <div className="text-sm text-gray-500 tracking-tighter font-medium  " > ${product.price} </div>

              </div>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
};

export default ProductGrid;
