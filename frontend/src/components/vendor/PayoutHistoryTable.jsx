import React from 'react'

const PayoutHistoryTable = ({vendorPayoutHistory, isFetchingNextPage, isLoading, hasNextPage, fetchNextPage  }) => {
  return (
    <>
    { !isLoading && vendorPayoutHistory?.length === 0 ? (
      <div className="text-gray-500 text-xl px-4 text-center">
        You have no payout yet!
      </div>
    ) : (
      <>
        {/* Payout Table */}
        <p className="text-sm text-gray-500 mb-3 italic">
          Note: A 3% platform fee is deducted from the order amount before payout.
        </p>
        <div className="shadow-md overflow-x-auto relative rounded-sm lg:rounded-md">
          <table className="w-full text-left min-w-[1100px] md:min-w-full text-gray-500">
          <thead className="uppercase bg-gray-100 text-xs text-gray-600">
            <tr>
                <th className="px-4 py-3">S/N</th>
                <th className="px-4 py-3">Gross Amount (Before Fee)</th>
                <th className="px-4 py-3">Net Amount (After 3% Fee)</th>
                <th className="px-4 py-3">Platform Fee (3%)</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Completed At</th>
            </tr>
            </thead>

            <tbody>
              {vendorPayoutHistory?.map((payout, index) => (
                <tr
                  key={payout?._id}
                  className={`bpayout-b text-[15px] md:text-[17px] cursor-pointer hover:bpayout-gray-400 ${
                    index === vendorPayoutHistory?.length - 1 ? "bpayout-b-0 mb-3" : ""
                  }`}
                >
                  <td className="py-3 px-4 sm:py-4 sm:px-4 font-medium text-gray-800 " > 
                             {index + 1}
                  </td >

                 <td className=" py-4 px-4 font-medium text-gray-800">
                  ₦{(payout?.payoutAmount + payout?.feeDeducted).toLocaleString() }
                  </td>
                  <td className=" py-4 px-4 font-medium text-gray-800">
                  ₦{payout?.payoutAmount.toLocaleString()}
                  </td>
                  <td className="py-4 px-4">
                  ₦{payout?.feeDeducted.toLocaleString()}
                    
                  </td>
                  <td className=" py-4 px-4">
                  <span
                    className={`px-4 py-1 rounded text-md bg-green-100 text-green-700 font-medium`}>
                    {payout?.status}
                    </span>
                    </td>
                
                  <td className=" py-4 px-4">
                   
                  {new Date(payout?.completedAt).toLocaleDateString()}{" "}
                  {new Date(payout?.completedAt).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Load More Button */}
        {hasNextPage && (
          <div className="flex justify-center items-center">
            <button
              className="rounded py-1 px-4 bg-green-600 hover:bg-green-500 my-9 text-white cursor-pointer"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? "Loading more..." : "Load more"}
            </button>
          </div>
        )}
      </>
    )}
    
    </>
  )
}

export default PayoutHistoryTable




