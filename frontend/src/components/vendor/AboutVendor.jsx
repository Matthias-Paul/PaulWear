
const AboutVendor = ({storeDetails, productVendorCount}) => {


function formatDateWithSuffix(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();

  return `${day} ${month}, ${year}`;
}
  return (
    <>
       <div>
            <div className="w-full mx-auto bg-white p-3 sm:p-6 rounded-xl shadow-md mt-6">
            <div className="flex items-center space-x-4">
                <img
                src={storeDetails?.storeLogo}
                alt="Store Logo"
                className=" w-12 sm:w-16 h-12 sm:h-16 flex-shrink-0 rounded-full object-cover"
                />
                <div>
                <h2 className=" text-lg sm:text-xl ">{storeDetails?.storeName}</h2>
                <p className="text-sm text-gray-600">{storeDetails?.bio} </p>
                <div className="flex items-center space-x-2 mt-1">
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded">
                    {storeDetails.isVerified ? "Verified" : "Not Verified"}
                    </span>

                </div>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                <div>
                <h3 className="font-semibold">Store Info</h3>
                <p><strong>Campus:</strong> {storeDetails?.campus}</p>
                <p><strong>State:</strong> {storeDetails?.state}</p>
                <p><strong>Address:</strong> {storeDetails?.address}</p>
                </div>
                <div>
                <h3 className="font-semibold">Contact</h3>
                <p><strong>Phone:</strong> {storeDetails?.contactNumber}</p>
                <p><strong>Email:</strong>{storeDetails?.email}</p>
                </div>
            </div>

            {/* <div className="mt-4">
                <h3 className="font-semibold">Store Documents</h3>
                <ul className="list-disc list-inside">
                <li><a href="" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Certificate</a></li>
                <li><a href="" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">ID Card</a></li>
                </ul>
            </div> */}

            <div className="mt-4 text-gray-600 text-sm">
                <p><strong>Total Products:</strong> {productVendorCount?.totalProducts} </p>
                <p><strong>Joined:</strong> {formatDateWithSuffix(storeDetails?.createdAt)}</p>
            </div>
            </div>


      </div>   
    </>
  )
}

export default AboutVendor