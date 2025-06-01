
const AboutVendor = ({storeDetails}) => {
  return (
    <>
       <div>
            <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md mt-6">
            <div className="flex items-center space-x-4">
                <img
                src="https://res.cloudinary.com/drkxtuaeg/image/upload/v1748418956/z8k6xtf45hmpbas5m7aa.jpg"
                alt="Store Logo"
                className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                <h2 className="text-2xl font-bold">Paul's Wear</h2>
                <p className="text-sm text-gray-600">Top sellers of affordable wear for students across Nigeria.</p>
                <div className="flex items-center space-x-2 mt-1">
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded">
                    {true ? "Verified" : "Not Verified"}
                    </span>
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded">
                    {false ? "Featured Store" : ""}
                    </span>
                </div>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                <div>
                <h3 className="font-semibold">Store Info</h3>
                <p><strong>Campus:</strong> LAUTECH</p>
                <p><strong>State:</strong> Oyo</p>
                <p><strong>Address:</strong> Room 16, Shalom Hostel, Under-G LAUTECH</p>
                </div>
                <div>
                <h3 className="font-semibold">Contact</h3>
                <p><strong>Phone:</strong> +2349122637250</p>
                <p><strong>Email:</strong> pauladesina117@gmail.com</p>
                </div>
            </div>

            <div className="mt-4">
                <h3 className="font-semibold">Store Documents</h3>
                <ul className="list-disc list-inside">
                <li><a href="https://yourbucket.s3.amazonaws.com/certificate.pdf" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Certificate</a></li>
                <li><a href="https://yourbucket.s3.amazonaws.com/id-card.jpg" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">ID Card</a></li>
                </ul>
            </div>

            <div className="mt-4 text-gray-600 text-sm">
                <p><strong>Total Products:</strong> 0</p>
                <p><strong>Joined:</strong> May 27, 2025</p>
            </div>
            </div>


      </div>   
    </>
  )
}

export default AboutVendor