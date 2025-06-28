import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

const Payout = () => {
  const [accountNumber, setAccountNumber] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [bankName, setBankName] = useState("");
  const [userBankName, setUserBankName] = useState("");
  const [banks, setBanks] = useState([]);
  const [nameError, setNameError] = useState("");

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!accountNumber || !bankCode || !bankName || !userBankName) {
      toast.error("All fields are required and must be valid");
      return;
    }




};
  console.log( userBankName, accountNumber, bankName, bankCode)

  return (
    <div className="w-full pb-20 pt-[90px] md:pt-4 mx-auto pr-[12px] md:pr-0">
      <h1 className="text-2xl font-bold mb-6">Payout Management</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-2">Total Amount Of Payout</h2>
          <p className="text-2xl">₦10000</p>
        </div>
        <div className="p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-2">Pending Balance</h2>
          <p className="text-2xl">₦200</p>
        </div>
        <div className="p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-2">Total Number Of Payout</h2>
          <p className="text-2xl">100</p>
        </div>
      </div>

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


            {/* <button type="submit"  disabled={registrationMutation.isPending } className={`rounded w-full font-semibold text-lg ${registrationMutation.isPending  ? "bg-green-500 cursor-not-allowed text-white " : "bg-green-600 hover:bg-green-500 cursor-pointer text-white"} py-2 mt-5 text-center `} >
              {isFetching ? "Validating..." : "Submit"}
            </button> */}
        <button
          type="submit"
          className="rounded w-full font-semibold text-lg bg-green-600 hover:bg-green-500 cursor-pointer text-white py-2 mt-5 text-center"
        >
          {isFetching ? "Validating..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default Payout;
