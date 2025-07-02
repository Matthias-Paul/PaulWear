import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useMutation,  useQueryClient, useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import PayoutHistoryTable from "./PayoutHistoryTable"

const Payout = () => {
  const [accountNumber, setAccountNumber] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [bankName, setBankName] = useState("");
  const [userBankName, setUserBankName] = useState("");
  const [banks, setBanks] = useState([]);
  const [nameError, setNameError] = useState("");
  const queryClient = useQueryClient();
  const [changeAccount, setChangeAccount ] = useState(false)
  const { loginUser } = useSelector((state) => state.user);


  const openChangeAccount = ()=>{
    setChangeAccount(true)
  }
  const cancelChangeAccount = ()=>{
    setChangeAccount(false)
  }
  // Fetch banks
  const fetchListOfBanks = async () => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/listOfBanks`, {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch bank list");
    return res.json();
  };

  const { data: bankData } = useQuery({
    queryKey: ["listOfBanks"],
    queryFn: fetchListOfBanks,
  });

  useEffect(() => {
    if (bankData) setBanks(bankData.banks);
  }, [bankData]);

  // Reset account name and errors on input change
  useEffect(() => {
    setUserBankName("");
    setNameError("");
  }, [accountNumber, bankCode]);

  const handleSelectChange = (e) => {
    const [code, name] = e.target.value.split(" | ");
    setBankCode(code);
    setBankName(name);
  };

  // Fetch account name
  const fetchAccountName = async () => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/vendor/resolveName?accountNumber=${accountNumber}&bankCode=${bankCode}`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Account resolution failed");
    }

    return res.json();
  };

  const {
    data: resolvedNameData,
    error: resolveError,
    isError,
    isFetching,
  } = useQuery({
    queryKey: ["resolveBankName", accountNumber, bankCode],
    queryFn: fetchAccountName,
    enabled: !!accountNumber && !!bankCode && accountNumber.length === 10,
    retry: false,
  });

  useEffect(() => {
    if (resolvedNameData?.accountName) {
      setUserBankName(resolvedNameData.accountName);
      setNameError("");
    } else if (resolvedNameData && !resolvedNameData.accountName) {
      setNameError("Invalid account or bank selected.");
    }
  }, [resolvedNameData]);

  useEffect(() => {
    if (resolveError) {
      setNameError("Could not resolve account name. Check parameters or try again.");
    } 
  }, [resolveError]);


  const fetchBankDetails = async () => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/vendor/account`, {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch bank details");
    return res.json();
  };

  const { data: bankDetails, isLoading: bankDetailsIsLoading } = useQuery({
    queryKey: ["bankDetails"],
    queryFn: fetchBankDetails,
    enabled: !!loginUser?.id,
    retry:false,
});

  console.log("bank details", bankDetails)



  const createAccountMutation = useMutation({
    mutationFn: async ()=>{
  
      // Send user details to the backend
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/vendor/account`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          userBankName,
          accountNumber,
          bankName,
          bankCode,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to submit account");
      }

      const data = await res.json();
        
      return data;
    },
     onSuccess: (data) => {
      toast.success("Account submitted successfully");
      console.log("User acc:", data.account);
      queryClient.invalidateQueries(["bankDetails", loginUser.id]);
      setAccountNumber("")
      setBankCode("")
      setBankName("")
      setUserBankName("")

    },
    onError: (error) => {
      toast.error(error.message);
      console.error(error.message)
    },

  })



  const handleSubmit = (e) => {
    e.preventDefault();
    if (!accountNumber || !bankCode || !bankName || !userBankName) {
      toast.error("All fields are required and must be valid");
      return;
    }

    createAccountMutation.mutate({ userBankName, accountNumber, bankName, bankCode });



};

  console.log( userBankName, accountNumber, bankName, bankCode)

  const updateAccountMutation = useMutation({
    mutationFn: async ()=>{
  
      // Send user details to the backend
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/vendor/account/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          userBankName,
          accountNumber,
          bankName,
          bankCode,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to submit account");
      }

      const data = await res.json();
        
      return data;
    },
     onSuccess: (data) => {
      toast.success("Account updated successfully");
      console.log("User acc:", data.account);
      queryClient.invalidateQueries(["bankDetails", loginUser.id]);
      setAccountNumber("")
      setBankCode("")
      setBankName("")
      setUserBankName("")
      setChangeAccount(false)

    },
    onError: (error) => {
      toast.error(error.message);
      console.error(error.message)
    },

  })



    const handleUpdate = (e)=>{
        e.preventDefault()

        if (!accountNumber || !bankCode || !bankName || !userBankName) {
            toast.error("All fields are required and must be valid");
            return;
          }

          updateAccountMutation.mutate({ userBankName, accountNumber, bankName, bankCode });
    }


    const fetchPaymentHistory = async ({ pageParam = 1 }) => {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/vendor/payout/history?page=${pageParam}&limit=15`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!res.ok) throw new Error("Failed to fetch payout history");
    
        return res.json();
      };
    
      const {
        data: payoutHistoryData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
      } = useInfiniteQuery({
        queryKey: ["paymentHistory"],
        queryFn: fetchPaymentHistory,
        getNextPageParam: (lastPage, pages) => {
          return lastPage.hasNextPage ? pages.length + 1 : undefined;
        },
      });
    
       

    
    const vendorPayoutHistory = payoutHistoryData?.pages.flatMap((page) => page.vendorPayoutHistory) || [];
    console.log(vendorPayoutHistory)



  return (
    <div className="w-full pb-20 pt-[90px] md:pt-4 mx-auto pr-[12px] md:pr-0">
      <h1 className="text-2xl font-bold mb-6">Payout Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-2">Total Amount Of Payout</h2>
          <p className="     text-2xl  md:text-[17px] lg:text-[20px] truncate ">₦{bankDetails?.account?.totalBalance
            ? bankDetails.account.totalBalance.toLocaleString()
            : "--"}</p>
        </div>
        <div className="p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-2">Pending Balance</h2>
          <p className="text-2xl md:text-[17px] lg:text-[20px] text-gray-400 truncate  ">₦{bankDetails?.account?.pendingBalance
            ? bankDetails.account.pendingBalance.toLocaleString()
            : "--"}
            </p>
        </div>
        <div className="p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-2">Total Number Of Payout</h2>
          <p className="text-2xl md:text-[17px] lg:text-[20px] truncate ">  {vendorPayoutHistory?.length?.toLocaleString() || "--"  }
          </p>
        </div>
      </div>

        {
           bankDetails?.account   || bankDetailsIsLoading   ?(
            <>
                {
                bankDetails && (
                    <h5 className="mt-10 text-lg  " > Payout Account </h5>  
                )}


                {!changeAccount && bankDetails && (
                <div className="border flex gap-x-2 justify-between items-start border-gray-400 mt-2 p-4 sm:p-6 rounded-lg shadow-md">
                    <div>
                    <h2 className="text-xl font-semibold mb-2">{bankDetails?.account?.accountName}</h2>
                    <h2 className="text-md mb-1">{bankDetails?.account?.bankAccountNumber}</h2>
                    <h2 className="text-md">{bankDetails?.account?.bankName}</h2>
                    </div>
                    <button
                    onClick={openChangeAccount}
                    className="px-2 p-1 cursor-pointer rounded bg-green-600 hover:bg-green-500 text-white"
                    >
                    Change
                    </button>
                </div>
                )}
   
               {
                changeAccount && (
                    <>
                        <div className="  border flex flex-col gap-x-2 justify-between items-start border-gray-400 mt-2 p-4 sm:p-6 rounded-lg shadow-md" >
                        <div className=" flex justify-between items-center w-full gap-x-2 " >
                        <h2 className="text-xl font-semibold mb-2 ">Update Account Details</h2>
                        <button onClick={cancelChangeAccount} className="px-2 p-1 rounded bg-red-600 hover:bg-red-500 cursor-pointer text-white   " >
                            Cancel
                        </button>
                        </div> 
                        <form onSubmit={handleUpdate} >
                        
                        <div className="mb-8">
                            <label className="block font-semibold">Account Number</label>
                            <input
                            required
                            type="number"
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)}
                            className="w-full focus:outline-none p-2 rounded border border-gray-400 mt-1 lg:mt-2"
                            maxLength={10}
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block font-semibold">Select Bank</label>
                            <select
                            required
                            defaultValue=""
                            className="w-full py-[10px] cursor-pointer focus:outline-none p-2 rounded border border-gray-400 mt-1 lg:mt-2"
                            onChange={handleSelectChange}
                            >
                            <option value="" disabled>
                                Select bank
                            </option>
                            {banks.map((bank) => (
                                <option key={`${bank?.code}-${bank?.name}-${bank?.slug}`} value={`${bank?.code} | ${bank?.name}`}>
                                {bank?.name}
                                </option>
                            ))}
                            </select>
                        </div>

                        {/* Account name or error */}
                        {userBankName && !nameError && (
                        <div className="mb-4">
                        <p className="text-md bg-green-100 p-2 rounded border border-green-400">{userBankName}</p>
                        </div>
                        )}
                        {nameError && (
                        <div className="mb-4">
                        <p className="text-md bg-red-100 p-2 rounded border border-red-400 text-red-600">{nameError}</p>
                        </div>
                        )}


                        <button type="submit"  disabled={updateAccountMutation.isPending  } className={`rounded w-full font-semibold text-lg ${updateAccountMutation.isPending  ? "bg-green-500 cursor-not-allowed text-white " : "bg-green-600 hover:bg-green-500 cursor-pointer text-white"} py-2 mt-5 text-center `} >
                        {isFetching ? "Validating..." : "Update"}
                        </button>
                        </form>
                        </div>
                    </>
                )
               }


           </>
           ):(
            <>
            <h2 className="text-xl font-semibold mb-2 mt-12">Submit Account Details</h2>

            <form onSubmit={handleSubmit}>
            <div className="mb-8">
                <label className="block font-semibold">Account Number</label>
                <input
                required
                type="number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full focus:outline-none p-2 rounded border border-gray-400 mt-1 lg:mt-2"
                maxLength={10}
                />
            </div>

            <div className="mb-6">
                <label className="block font-semibold">Select Bank</label>
                <select
                required
                defaultValue=""
                className="w-full py-[10px] cursor-pointer focus:outline-none p-2 rounded border border-gray-400 mt-1 lg:mt-2"
                onChange={handleSelectChange}
                >
                <option value="" disabled>
                    Select bank
                </option>
                {banks.map((bank) => (
                    <option key={`${bank?.code}-${bank?.name}-${bank?.slug}`} value={`${bank?.code} | ${bank?.name}`}>
                    {bank?.name}
                    </option>
                ))}
                </select>
            </div>

            {/* Account name or error */}
        {userBankName && !nameError && (
            <div className="mb-4">
            <p className="text-md bg-green-100 p-2 rounded border border-green-400">{userBankName}</p>
            </div>
        )}
        {nameError && (
            <div className="mb-4">
            <p className="text-md bg-red-100 p-2 rounded border border-red-400 text-red-600">{nameError}</p>
            </div>
        )}


      <button type="submit"  disabled={createAccountMutation.isPending  } className={`rounded w-full font-semibold text-lg ${createAccountMutation.isPending  ? "bg-green-500 cursor-not-allowed text-white " : "bg-green-600 hover:bg-green-500 cursor-pointer text-white"} py-2 mt-5 text-center `} >
        {isFetching ? "Validating..." : "Submit"}
      </button>
    </form>
        </>
           )
        }
      
        <h2 className="mt-8 text-lg mb-2 "  >Payout history</h2>

        <PayoutHistoryTable  vendorPayoutHistory={vendorPayoutHistory} isFetchingNextPage={isFetchingNextPage} isLoading={isLoading} hasNextPage={hasNextPage} fetchNextPage={fetchNextPage} />
    </div>
  );
};

export default Payout;
