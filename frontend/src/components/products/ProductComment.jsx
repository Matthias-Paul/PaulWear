import { useParams, Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { FaStar, FaRegStar, FaEdit, FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";



const ProductComment = ({id}) => {
    const { loginUser } = useSelector((state) => state.user);
    const [rating, setRating] = useState("");
    const [comment, setComment] = useState("");
    const [isEdit, setIsEdit] = useState(false);
    const [editingReviewId, setEditingReviewId] = useState(null);
    
    const queryClient = useQueryClient()

    const fetchProductReview = async ({ pageParam = 1 }) => {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/product-review/${id}?page=${pageParam}&limit=5`, {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error("Failed to fetch product review");
        }
        return res.json();
      };
    

      const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
      } = useInfiniteQuery({
        queryKey: ["productReviews", id],
        queryFn: fetchProductReview,
        getNextPageParam: (lastPage, pages) => {
          return lastPage.hasNextPage ? pages.length + 1 : undefined;
        },
      });
      const reviews = data?.pages.flatMap((page) => page.reviews) || [];

    
      const renderStars = (rating) => {
        return (
          <div className="flex gap-1 text-green-500">
            {Array.from({ length: 5 }, (_, i) =>
              i < rating ? <FaStar key={i} /> : <FaRegStar key={i} />
            )}
          </div>
            );
        };
    

        const fetchCanUserReview = async () => {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/can-user-review/${id}`, {
              method: "GET",
              credentials: "include",
            });
            if (!res.ok) {
              throw new Error("Failed to fetch can user  review");
            }
            return res.json();
          };
        
          const { data:canUserReviewData } = useQuery({
            queryKey: ["userReview", loginUser.id],
            queryFn: fetchCanUserReview,
          });
        
         console.log(canUserReviewData?.canReview, canUserReviewData?.reason)
        

         const reviewMutation = useMutation({
            mutationFn: async () => {
              const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/product-review/${id}`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ rating: Number(rating), comment }),
              });
          
              if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "Failed to submit review");
              }
          
              return res.json();
            },
            onSuccess: () => {
              toast.success("Review submitted successfully!");
              queryClient.invalidateQueries(["productReviews", id]);
              setRating("");
              setComment("");
            },
            onError: (error) => {
              toast.error(error.message);
            },
          });
          


          const editMutation = useMutation({
            mutationFn: async ({review}) => {
                console.log("userId", review?.user)
              const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/product-review/${id}?userIdFromAdmin=${review?.user?._id}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ rating: Number(rating), comment }),
              });
          
              if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "Failed to update review");
              }
          
              return res.json();
            },
            onSuccess: () => {
              toast.success("Review updated successfully!");
              queryClient.invalidateQueries(["productReviews", id]);
              setRating("");
              setComment("");
              setIsEdit(false);
              setEditingReviewId(null);
            },
            onError: (error) => {
              toast.error(error.message);
            },
          });
          const handleEdit = (review) => {
            setIsEdit(true);
            setEditingReviewId(review._id);
            setRating(review.rating.toString()); 
            setComment(review.comment);
          };
          
          console.log(loginUser)


          const deleteMutation = useMutation({
            mutationFn: async ({review}) => {
                console.log("userId", review?.user)
              const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/product-review/${id}?reviewId=${review?._id}`, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                },
                credentials: "include",
              });
          
              if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "Failed to delete review");
              }
          
              return res.json();
            },
            onSuccess: () => {
              toast.success("Review deleted successfully!");
              queryClient.invalidateQueries(["productReviews", id]);
              
            },
            onError: (error) => {
              toast.error(error.message);
            },
          });

          const handleDelete =(review)=>{
            if(window.confirm("Are you sure you want to delete this review?")){
              console.log("Deleting review with ID", review._id)
             deleteMutation.mutate({review})


          }

          }
  return (
    <>
      <div className="mt-6  max-w-3xl mx-auto flex items-center justify-center flex-col   ">
        {
            reviews && (
                <h2 className="text-xl font-semibold ">Customer Reviews</h2>
            )
        }

      {isLoading && <p className="mt-3 text-gray-500">Loading reviews...</p>}
      {error && <p className="mt-3 text-red-500">Error loading reviews.</p>}

      {reviews?.length === 0 && !isLoading && <p className="mt-3" >No reviews yet.</p>}

        {
            canUserReviewData?.canReview&& (
                    <div className="mt-5   w-full flex items-center justify-center flex-col">
                      <h3 className="text-lg font-semibold mb-2">Write a Review</h3>
                      <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            reviewMutation.mutate();
                        }}
                        className="space-y-4 w-full mt-4"
                        >
                        <div className="mb-4">
                            <label htmlFor="rating" className="block text-sm font-semibold mb-1">
                            Rating
                            </label>
                            <select
                            id="rating"
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                            className="border px-3 py-3 w-full border-gray-400 rounded-md"
                            required
                            >
                            <option value="" disabled>
                                Select Rating
                            </option>
                            {[5, 4, 3, 2, 1].map((val) => (
                                <option key={val} value={val}>
                                {val} Star{val > 1 ? "s" : ""}
                                </option>
                            ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="comment" className="block text-sm font-semibold mb-1">
                            Comment
                            </label>
                            <textarea
                            id="comment"
                            rows={4}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="border px-3 py-3 w-full border-gray-400 rounded-md resize-none"
                            placeholder="Share your experience..."
                            required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={reviewMutation.isPending}
                            className={`w-full text-lg rounded-lg font-semibold p-3 ${
                            reviewMutation.isPending
                                ? "bg-gray-800 cursor-not-allowed text-white"
                                : "bg-black hover:bg-gray-800 cursor-pointer text-white"
                            }`}
                        >
                            {reviewMutation.isPending ? "Submitting..." : "Submit Review"}
                        </button>
                        </form>

                      
                    </div>
                  )}
                  
            

      {reviews?.map((review) => (
        <div
          key={review?._id}
          className="bg-white shadow-sm p-4 mt-10 rounded-lg w-full "
        >
              {isEdit && editingReviewId === review?._id ?(
                <form
                    onSubmit={(e) => {
                    e.preventDefault();
                    editMutation.mutate({review});
                    }}
                    className="space-y-4 w-full mt-4"
                >
                    <div className=" flex mt-[-10px] font-semibold text-lg items-center justify-between " >
                     <h2> Edit Review </h2>   
                    <button
                    type="button"
                    onClick={() => {
                        setIsEdit(false);
                        setEditingReviewId(null);
                        setRating("");
                        setComment("");
                    }}
                    className="px-2 p-1 rounded text-sm sm:text-md bg-red-600 hover:bg-red-500 cursor-pointer text-white   "
                    >
                    Cancel
                    </button>
                    </div>
                    <div className="mb-4">
                    <label htmlFor="rating" className="block text-sm font-semibold mb-1">
                        Rating
                    </label>
                    <select
                        id="rating"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        className="border px-3 py-3 w-full border-gray-400 rounded-md"
                        required
                    >
                        <option value="" disabled>
                        Select Rating
                        </option>
                        {[5, 4, 3, 2, 1].map((val) => (
                        <option key={val} value={val}>
                            {val} Star{val > 1 ? "s" : ""}
                        </option>
                        ))}
                    </select>
                    </div>

                    <div className="mb-4">
                    <label htmlFor="comment" className="block text-sm font-semibold mb-1">
                        Comment
                    </label>
                    <textarea
                        id="comment"
                        rows={4}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="border px-3 py-3 w-full border-gray-400 rounded-md resize-none"
                        placeholder="Update your experience..."
                        required
                    />
                    </div>

                    <button
                    type="submit"
                    disabled={editMutation.isPending}
                    className={`w-full text-lg rounded-lg font-semibold p-3 ${
                        editMutation.isPending
                        ? "bg-gray-800 cursor-not-allowed text-white"
                        : "bg-black hover:bg-gray-800 cursor-pointer text-white"
                    }`}
                    >
                    {editMutation.isPending ? "Updating..." : "Update Review"}
                    </button>
                </form>
                ):(
                    <>
                         <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-gray-800">{review?.user?.name}</h3>
              <span className="text-xs text-green-600 font-semibold">Verified Buyer</span>
            </div>

            {(loginUser?.id === review?.user?._id || loginUser?.role === "admin") && (
              <div className="flex gap-3 text-sm text-blue-600">
                <button
                  className="hover:underline cursor-pointer flex items-center gap-1"
                  onClick={() => handleEdit(review)}
                  >
                  <FaEdit className="text-gray-600" /> Edit
                </button>
                <button
                  className="hover:underline cursor-pointer text-red-600 flex items-center gap-1"
                  onClick={() => handleDelete(review)}
                >
                  <FaTrash /> Delete
                </button>
                </div>
                )}
            </div>

                <div className="mt-2">
                    {renderStars(review?.rating)}
                    <p className="text-gray-700 mt-2">{review?.comment}</p>
                    <p className="text-xs text-gray-400 mt-1">
                    {new Date(review?.createdAt).toLocaleDateString()}
                    </p>
                </div>

                    </>

                )}


         

        </div>
      ))}

        {hasNextPage && (
              <div className="flex justify-center items-center">
                <button
                  className="rounded underline  my-2 text-green-600 cursor-pointer"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                >
                  {isFetchingNextPage ? "Loading more..." : "Load more"}
                </button>
              </div>
            )}
    </div>
 
    </>
  );
}

export default ProductComment;
