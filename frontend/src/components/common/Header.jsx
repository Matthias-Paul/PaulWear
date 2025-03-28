import TopBar from "../layout/TopBar"
import NavBar from "./NavBar"


const Header = () => {
  return (
   <>
   <div  className="border-b-[0.5px]  border-gray-700">
    <TopBar />
    <NavBar />
    </div>      
   </>
  )
}

export default Header
