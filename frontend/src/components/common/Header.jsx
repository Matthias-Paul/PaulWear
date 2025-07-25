import TopBar from "../layout/TopBar"
import NavBar from "./NavBar"


const Header = () => {
  return (
   <>
   <div  className=" fixed z-1000 w-full ">
    <TopBar />
    <NavBar />
    </div>      
   </>
  )
}

export default Header
