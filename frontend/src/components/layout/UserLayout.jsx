import { Outlet } from "react-router-dom"
import Header from "../common/Header"
import Footer from "../common/Footer"
const UserLayout = () => {
  return (
   <>
   
     <Header  />

     <main>
      <Outlet />
     </main>

      <Footer />
   </>
  )
}

export default UserLayout
