import { Link } from "react-router-dom";
import StoreLoading from "../products/StoreLoading";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";


const StoreGrid = ({ stores, isLoading }) => {
  const skeletonArray = Array.from({ length: 4 });

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const half = rating % 1 >= 0.5;
  
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-green-500" />);
    }
  
    if (half) {
      stars.push(<FaStarHalfAlt key="half" className="text-green-500" />);
    }
  
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-green-500" />);
    }
  
    return stars;
  };

  
  return (
    <div className="grid grid-cols-1 gap-6 pb-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {isLoading
        ? skeletonArray.map((_, i) => <StoreLoading key={i} />)
        : stores?.map((store) => (
            <div
              key={store._id}
              className="bg-white border border-gray-200 rounded-2xl shadow hover:shadow-lg transition-shadow p-5 md:p-6 flex flex-col h-full relative"
            >
              <div className="flex justify-center mb-4">
                <img
                  src={store.storeLogo }
                  alt={store.storeName}
                  className="h-16 w-16 rounded-full object-cover border border-gray-300 shadow"
                />
              </div>

              <h3 className="text-lg font-bold text-center text-gray-900 truncate">
                {store.storeName}
              </h3>

              {/* Ratings */}
              <div className="flex justify-center mt-1 mb-3 space-x-0.5 text-sm">
                {renderStars(store.rating || 0)}
              </div>

              <p className="text-sm text-gray-600 text-center mb-1 line-clamp-2">
                {store.bio || "No bio available"}
              </p>

              <div className="text-xs text-gray-500 text-center">
                <p>{store.campus}, {store.state}</p>
              </div>

              <div className="text-xs text-gray-400 text-center my-1">
                <p>{store.email}</p>
                <p>{store.contactNumber}</p>
              </div>

              <Link
                to={`/stores/${store._id}`}
                className="mt-auto inline-block bg-green-500 text-white text-sm font-semibold text-center py-2 px-4 rounded-lg hover:bg-green-600 transition-colors mt-4"
              >
                Visit Store
              </Link>
            </div>
          ))}
    </div>
  );
};

export default StoreGrid;