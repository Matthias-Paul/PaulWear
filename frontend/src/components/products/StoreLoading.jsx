

const StoreLoading = () => {

  return (
    <div className="animate-pulse px-3 pt-6 border border-gray-300 rounded-2xl shadow p-4 flex flex-col items-center bg-white h-full">
      {/* Circle for store logo */}
      <div className="h-16 w-16 rounded-full bg-gray-300 mb-4" />

      {/* Store name placeholder */}
      <div className="h-4 w-2/4 bg-gray-300 rounded mt-2" />

      {/* Bio lines */}
      <div className="h-3 w-3/4 bg-gray-300 rounded mt-6" />
      <div className="h-3 w-3/4 bg-gray-300 rounded mt-2" />

      {/* Location line */}
      <div className="h-3 w-2/4 bg-gray-300 rounded mt-5 mb-4 " />

      {/* Contact info lines */}
      <div className="h-2 w-2/4 bg-gray-300 rounded mt-2" />
      <div className="h-2 w-1/4 bg-gray-300 rounded mt-1" />

      {/* Button placeholder */}
      <div className="h-8 w-4/4 bg-gray-300 rounded-lg mt-6" />
    </div>
  );
};

export default StoreLoading;
