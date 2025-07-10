import { Link } from "react-router-dom";
import StoreLoading from "../products/StoreLoading";

const StoreGrid = ({ stores, isLoading }) => {
  const skeletonArray = Array.from({ length: 4 });

  return (
    <div className="grid grid-cols-1 gap-6 pb-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {isLoading
        ? skeletonArray.map((_, i) => <StoreLoading key={i} />)
        : stores?.map((store) => (
            <div
              key={store._id}
              className="bg-white border border-gray-200 rounded-2xl shadow hover:shadow-lg transition-shadow p-4 md:p-8 flex flex-col h-full"
            >
              <div className="flex justify-center mb-4">
                <img
                  src={store.storeLogo}
                  alt={store.storeName}
                  className="h-16 w-16 rounded-full object-cover border border-gray-300"
                />
              </div>

              <h3 className="text-lg font-semibold truncate text-gray-900 text-center">
                {store.storeName}
              </h3>

              <p className="text-sm text-gray-600 text-center mt-2 line-clamp-2">
                {store.bio}
              </p>

              <div className="mt-3 text-sm text-gray-500 text-center">
                <p>{store.campus}, {store.state}</p>
              </div>

              <div className="mt-2 text-xs py-2 text-gray-400 text-center">
                <p>{store.email}</p>
                <p>{store.contactNumber}</p>
              </div>

              <Link
                to={`/stores/${store._id}`}
                className="mt-auto inline-block bg-green-500 text-white text-sm font-medium text-center py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
              >
                Visit Store
              </Link>
            </div>
          ))}

         
    </div>
  );
};

export default StoreGrid;
