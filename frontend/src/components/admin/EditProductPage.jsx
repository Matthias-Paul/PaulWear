import pic from "../../assets/pic.jpg";

import { useState } from "react"


const EditProductPage = () => {
    const [productsData, setProductsData] = useState({
        name:"",
        description:"",
        price:0,
        countInStock:0,
        sku:"",
        category:"",
        brand:"",
        sizes:[],
        colors:[],
        collections:"",
        material:"",
        gender:"",
        images:[
            {
                url:pic
            },
            {
                url:pic
            }
        ]

    })

    const handleChange =(e) =>{
        const { name, value } = e.target

        setProductsData((prevData) => ({...prevData, [name]: value }))

    }

    const handleImageUpload =  async(e)=>{
        const file = e.target.files[0]
        console.log(file)

    }

    const handleSubmit = async(e)=>{
        e.preventDefault()
        console.log(productsData)
    }


  return (
    <>
      <div className="  shadow-md rounded-md mb-30 p-6 mx-auto mt-19 md:mt-6 mr-[12px] md:mr-0 " >
        <h1 className="text-2xl lg:text-3xl font-bold mb-6 " >Edit Product  </h1>
        <form onSubmit={handleSubmit} >
            <div className="mb-6  " >
                <label  className=" block font-semibold " > Product Name </label>
                <input required type="text" name="name" value={productsData.name} onChange={handleChange} className="w-full p-2 rounded border border-gray-400 mt-1 lg:mt-2 " />
            </div>

            <div className="mb-6  " >
                <label  className=" block font-semibold " > Product Description </label>
                <textarea
                    name="description"
                    value={productsData.description}
                    onChange={handleChange}
                    className="w-full p-2 rounded border border-gray-400 mt-1 lg:mt-2 resize-none " 
                    rows={4}
                    required
                />
            </div>

            <div className="mb-6  " >
                <label  className=" block font-semibold " > Product Price </label>
                <input required type="number" name="price" value={productsData.price} onChange={handleChange} className="w-full p-2 rounded border border-gray-400 mt-1 lg:mt-2 " />
            </div>

            <div className="mb-6  " >
                <label  className=" block font-semibold " > Count In Stock </label>
                <input required type="number" name="countInStock" value={productsData.countInStock} onChange={handleChange} className="w-full p-2 rounded border border-gray-400 mt-1 lg:mt-2 " />
            </div>

            <div className="mb-6  " >
                <label  className=" block font-semibold " > Product SKU </label>
                <input required type="text" name="sku" value={productsData.sku} onChange={handleChange} className="w-full p-2 rounded border border-gray-400 mt-1 lg:mt-2 " />
            </div>

            <div className="mb-6  " >
                <label  className=" block font-semibold " > Product Sizes ( comma-seperated ) </label>
                <input required type="text" name="sizes" value={productsData.sizes.join(", ")}
                 onChange={(e)=> setProductsData({...productsData, sizes: e.target.value.split(",").map((size)=> size.trim()),  })  } className="w-full p-2 rounded border border-gray-400 mt-1 lg:mt-2 " />
            </div>

            <div className="mb-6  " >
                <label  className=" block font-semibold " > Product Colors ( comma-seperated ) </label>
                <input required type="text" name="colors" value={productsData.colors.join(", ")}
                 onChange={(e)=> setProductsData({...productsData, colors: e.target.value.split(",").map((color)=> color.trim()),  })  } className="w-full p-2 rounded border border-gray-400 mt-1 lg:mt-2 " />
            </div>

            <div className="mb-6  " >
                <label  className=" block font-semibold " >Upload Product Image  </label>
                <input type="file" accept="image/>*" onChange={handleImageUpload} className=" cursor-pointer mt-2 bg-gray p-1  "    />
                <div className="flex gap-4 mt-4   ">  
                {
                    productsData.images.map((image, index)=>(
                        <div key={index} >
                            <img src={image?.url} alt="product image" className="w-20 h-20 rounded-sm shadow-md object-cover flex-shrink-0 " />
                        </div> 
                    ))
                }    
                </div>
            </div>

            <button type="submit" className="rounded text-white hover:bg-green-600 w-full font-semibold text-lg bg-green-700  cursor-pointer py-2 mt-5 text-center " >
                    Update Product
            </button>
        </form>
      </div>  
    </>
  )
}

export default EditProductPage
