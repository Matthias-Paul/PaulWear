import TopBar from "../layout/TopBar"
import NavBar from "./NavBar"


const Header = () => {
  return (
   <>
   <div  className="border-b-[0.5px] fixed z-100 w-full border-gray-700">
    <TopBar />
    <NavBar />
    </div>      
   </>
  )
}

export default Header
