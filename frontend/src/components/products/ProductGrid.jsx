import { Link } from "react-router-dom";

const ProductGrid = ({ similarProducts }) => {
  return (
    <>
      <div className="grid grid-cols-1  gap-x-[20px] mt-8 sm:grid-cols-2 lg:grid-cols-4  ">
        {similarProducts?.map((product) => (
          <div className="bg-white  block  ">
            <Link
              to={`/products/${product._id}`}
              key={product?._id}
              className="   "
            >
              <div className="w-full  mb-4 ">
                <img className="object-cover rounded-md flex-shrink-0 h-110 " src={product?.image} alt={product?.name} />
                <div> {product.name} </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
};

export default ProductGrid;
