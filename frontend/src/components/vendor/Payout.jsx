import { Link  } from "react-router-dom"
import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";


const Payout = () => {
    const [accountNumber, setAccountNumber] = useState("")
    const [bankCode, setBankCode] = useState("")
    const [bankName, setBankName] = useState("")

    const [banks, setBanks] = useState([])

    const fetchListOfBanks = async () => {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/listOfBanks`, {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error("Failed to fetch bank list");
        }
        return res.json();
      };
    
      const { data, isLoading } = useQuery({
        queryKey: ["listOfBanks"],
        queryFn: fetchListOfBanks,
      });
    
      useEffect(() => {
        if (data) {
            setBanks(data.banks)
        }
      }, [data]);
    
      const handleSelectChange = async(e)=>{
        e.target.value.split("|")
        setBankCode(e.target.value[0])
        setBankName(e.target.value[1])


      }
      console.log(bankCode, accountNumber)

  return (
    <>
        <div className="w-full pt-[90px] md:pt-4 mx-auto pr-[12px] md:pr-0 "  >

        <h1 className="text-2xl font-bold mb-6  " > Payout Management  </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4  " >
                <div className="p-4 rounded-lg shadow-lg  " >
                    <h2 className="text-xl font-semibold mb-2 " >  Total Amount Of Payout </h2>
                    <p className="text-2xl" > ₦10000 </p>
                </div>   

                <div className="p-4 rounded-lg shadow-lg  " >
                    <h2 className="text-xl font-semibold mb-2 " >  Pending Balance </h2>
                    <p className="text-2xl" > ₦200 </p>
                </div> 

                <div className="p-4 rounded-lg shadow-lg  " >
                    <h2 className="text-xl font-semibold mb-2  " >  Total Number Of Payout </h2>
                    <p className="text-2xl" > 100 </p>

                </div>  
            </div>    

            {/* Account details */}

              <h2 className="text-xl font-semibold mb-2 mt-12 " > Update Account Details </h2>  
                <form>
                <div className="mb-8  " >
                    <label  className=" block font-semibold " > Account Number </label>
                    <input required type="number"  value={accountNumber} onChange={(e)=> setAccountNumber(e.target.value)} className="w-full focus:outline-none p-2 rounded border border-gray-400 mt-1 lg:mt-2 " />
                </div>

                <div className="mb-6 " >
                    <label   className=" block font-semibold " > Select Bank </label>
                    <select defaultValue="" className="w-full py-[10px]  cursor-pointer focus:outline-none p-2 rounded border border-gray-400 mt-1 lg:mt-2 " onChange={(e) => handleSelectChange(e)}>
                    <option value="" disabled>
                    Select bank
                    </option>
                        {banks.map((bank) => (
                        <option key={`${bank?.code}-${bank?.name}-${bank?.slug}`} value={`${bank?.code} | ${bank.name}`}>
                            {bank?.name}
                        </option>
                        ))}
                    </select>   
                </div>


                </form>    
        </div>
    </>
  )
}

export default Payout