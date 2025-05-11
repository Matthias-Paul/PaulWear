import { Link } from "react-router-dom";

const ProductDetailGrid = ({ products }) => {
  return (
    <>
      <div className="flex flex-wrap justify-center w-full gap-6 pt-8 pb-5">
        {products?.map((product) => (
          <div key={product._id} className="bg-white rounded-md flex flex-col w-full sm:w-[264px] ">
            <Link
              to={`/product/${product._id}`}
              key={product?._id}
              className="   "
            >
              <div className="w-full  mb-4 ">
                <img className="object-cover mb-2 rounded-md flex-shrink-0 h-110 " src={product?.image} alt={product?.name} />
                <div className="text-sm  " > {product.name} </div>
                <div className="text-sm  text-gray-500 tracking-tighter font-medium  " > ${product.price} </div>

              </div>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
};

export default ProductDetailGrid;
