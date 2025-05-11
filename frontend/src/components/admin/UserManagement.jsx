import { useState } from "react"

const UserManagement = () => {
    const users = [
        {
            _id:1222,
            name:"Michael Newton",
            email:"Michael@gmail.com",
            role:"Admin"
        },
        {
            _id:122233,
            name:"Michael Joseph",
            email:"Joseph@gmail.com",
            role:"Customer"
        },
    ]

    const [formData, setFormData] = useState({
        name:"",
        email:"",
        password:"",
        role:"Cutomer" //default role is customer
    })

    const handleChange = (e) =>{

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e)=>{
        e.preventDefault()
        console.log(formData)

        setFormData({
                name:"",
                email:"",
                password:"",
                role:"Cutomer" 
        })
    }

    const handleRoleChange= (userId, newRole)=>{
        console.log({id: userId, role: newRole})

    }

    const handleDeleteUser = (userId)=>{
        if(window.confirm("Are you sure you want to delete this user?")){
            console.log("Deleting user with ID", userId)
        }

    }

  return (
    <>
      <div className="mt-3 pt-[60px] md:pt-0 mx-auto " >
        <h1 className="text-2xl font-bold mb-6 " > User Management  </h1>
        {/* Add new user form */}
            <div className="p-6 rounded-lg mb-6  " >
                <h2 className="text-lg font-bold mb-4 " >   Add New User  </h2>
                <form onSubmit={handleSubmit} >
                    <div className="mb-4 " >
                        <label  className="text-gray-700 block  " >  Name </label>
                        <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 rounded border border-gray-400 mt-1 " />
                    </div> 

                    <div className="mb-4 " >
                        <label  className="text-gray-700 block  " >  Email </label>
                        <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 rounded border border-gray-400 mt-1 " />
                    </div>  

                    <div className="mb-4 " >
                        <label  className="text-gray-700 block  " >  Password </label>
                        <input required type="password" name="password" value={formData.password} onChange={handleChange} className="w-full p-2 rounded border border-gray-400 mt-1 " />
                    </div>  

                    <div className="mb-4 " >
                        <label  className="text-gray-700 block  " >  Role </label>
                        <select name="role" value={formData.role} onChange={handleChange} className="w-full p-2 rounded border border-gray-400 mt-1 " >
                            <option value="customer" > Customer </option>
                            <option value="vendor" > Vendor </option>
                            <option value="admin" > Admin </option>

                        </select>    
                     </div>  
                        <button type="submit"  className="text-center w-full bg-green-500 rounded text-white hover:bg-green-600 font-semibold cursor-pointer py-3 mt-4  " >  Add User  </button>
                </form>
            </div>
            {/* Users lists management */}

        {

            users.length > 0 ? (
          <div className={`mb-20 mr-[12px] md:mr-0 shadow-md overflow-hidden overflow-x-auto  relative rounded-sm lg:rounded-md `} >
            <table className="  text-left min-w-[800px] md:min-w-full  text-gray-500 " >
              <thead className="uppercase bg-gray-100 text-xs text-gray-600 " >
                <tr>
                  <th className="py-2 px-4 sm:py-3 " > Name </th>
                  <th className="py-2 px-4 sm:py-3 " > Email </th>
                  <th className="py-2 px-4 sm:py-3 " > Role </th>
                  <th className="py-2 px-4 sm:py-3 " > Actions </th>

                </tr>
  
              </thead>
              <tbody>
                   { users?.map((user, index)=>(
                        <tr key={user?._id} className={`border-b cursor-pointer hover:border-gray-400 ${index === users?.length -1  ? "border-b-0": ""} `} >
                         <td className="py-2 px-4 sm:py-4 sm:px-4 font-medium text-gray-800 " > 
                            {user?.name}
                         </td >
                         <td className="py-2 px-4 sm:py-4 sm:px-4 font-medium text-gray-800 " > 
                            {user?.email}
                         </td >

                         <td className="py-2 px-4 sm:py-4 sm:px-4" > 
                            <select name="role" value={user.role} onChange={ (e)=> handleRoleChange(user._id, e.target.value)} className="w-full p-2  rounded border border-gray-400 mt-1 " >
                                <option value="customer" > Customer </option>
                                <option value="vendor" > Vendor </option>
                                <option value="admin" > Admin </option>

                            </select> 

                         </td >
                        <td className="py-2 px-4 sm:py-4 sm:px-4" > 
                            <button onClick={()=> handleDeleteUser(user._id) } className="py-2 px-4 rounded bg-red-500 hover:bg-red-600 text-white cursor-pointer  "  >
                                Delete
                            </button>    
                         </td >

                        </tr>
  
                    )
                )}
              </tbody>
              
            </table>  
  
        </div>
            ): (
                <div className="text-gray-700 font-semibold text-lg " >
                    No User Found.
                 </div>   
            )
         }  
      </div>  
    </>
  )
}

export default UserManagement
