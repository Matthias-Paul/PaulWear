import { useState, useEffect } from "react"
import pic from "../assets/pic.jpg";


const CollectionPage = () => {
    const [products, setProducts] = useState([])

    useEffect(()=>{

        const fetchProducts = [
            {
              _id: 1,
              name: "cloth 1",
              price: 100,
              image: pic,
            },
            {
              _id: 2,
              name: "cloth 2",
              price: 100,
              image: pic,
            },
            {
              _id: 3,
              name: "cloth 3",
              price: 100,
              image: pic,
            },
            {
              _id: 4,
              name: "cloth 4",
              price: 100,
              image: pic,
            },
            {
              _id: 5,
              name: "cloth 5",
              price: 100,
              image: pic,
            },
            {
              _id: 6,
              name: "cloth 6",
              price: 100,
              image: pic,
            },
            {
              _id: 7,
              name: "cloth 7",
              price: 100,
              image: pic,
            },
            {
              _id: 8,
              name: "cloth 8",
              price: 100,
              image: pic,
            },
          ];
          
          setProducts(fetchProducts)
    },[])
    

  return (
    <>
      <div className="container px-[12px]  pt-[90px]  pb-[50px] max-w-[1400px] mx-auto  " >
        <div>

        hello
        </div>
     </div>
    </>
  )
}

export default CollectionPage
