import Hero from "../components/layout/Hero"
import GenderCollectionSection from "../components/products/GenderCollectionSection"
import NewArrival from "../components/products/NewArrival"
import ProductsDetails from "../components/products/ProductsDetails"

const Home = () => {
  return (
    <>
      <div className="  h-full   text-black  ">
        < Hero />
        <div  className="container px-[12px]  pt-[90px]  pb-[50px] max-w-[1400px] mx-auto  " >

         <GenderCollectionSection />
         <NewArrival />
            
            Best sellers
            
            <h2 className="  text-2 sm:text-3xl font-bold text-center my-4 " > Best seller  </h2>
            < ProductsDetails />
       
        </div>
      </div>  
    </>
  )
}

export default Home
