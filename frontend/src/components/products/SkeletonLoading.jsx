
const SkeletonLoading = () => {
  return (
    <div className="animate-pulse border border-gray-400 rounded-md w-full bg-white shadow-sm">
      <div className="bg-gray-300 h-60 w-full mb-4 rounded-md" />
      <div className="p-2" >
      <div className="h-4 bg-gray-300  rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-300  rounded w-1/2 mb-2" />
      <div className="h-4 bg-gray-300 rounded w-1/4" />
      </div>
    </div>
  );
};

export default SkeletonLoading;



