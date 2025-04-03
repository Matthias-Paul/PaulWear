import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Toaster } from "react-hot-toast";

import UserLayout from "./components/layout/UserLayout.jsx"
import Home from "./pages/Home"
function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
     
          <Route path="/" element={ <UserLayout />}  >
                <Route index element={ <Home />}    />

                
          </Route>
       

        <Route> 
          {/* Admin route */}
        </Route>

      </Routes> 
        <Toaster position=" top-right" />
 </BrowserRouter>
    </>
  );
}

export default App;
