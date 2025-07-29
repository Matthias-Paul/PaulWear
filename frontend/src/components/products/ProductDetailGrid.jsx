import { Link } from "react-router-dom";
import SkeletonLoading from "./SkeletonLoading";

const ProductDetailsGrid = ({ products }) => {
  const skeletonArray = Array.from({ length: 10 });

  return (
    <div className="flex flex-wrap justify-center w-full gap-6 pt-8 pb-5">
      { products?.map((product) => {
            const mainImage = product.images?.[0]?.url;
            const altText = product.images?.[0]?.altText || product.name;

            return (
              <div
                key={product._id}
                className="group w-full sm:w-[264px]  relative bg-white border border-gray-400 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
              >
                <Link to={`/product/${product._id}`} className="block">
                  <div className="relative w-full aspect-[4/5] overflow-hidden">
                    <img
                      src={mainImage}
                      alt={altText}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-4">
                    <h3 className="text-base font-semibold text-gray-800 truncate">
                      {product.name}
                    </h3>

                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm font-bold text-gray-800">
                          ₦{product.price.toLocaleString()}
                        </span>
                    </div>
                      <div className="mt-3 flex items-center gap-2">
                        <img
                          src={product.vendorStoreLogo}
                          alt={product.vendorStoreName}
                          className="h-6 w-6 rounded-full flex-shrink-0 object-cover"
                        />
                        <span className="text-sm text-gray-500 truncate ">
                          {product.vendorStoreName}
                        </span>
                      </div>
                  </div>
                </Link>
              </div>
            );
          })}
    </div>
  );
};

export default ProductDetailsGrid;




