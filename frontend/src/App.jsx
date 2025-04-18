import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Toaster } from "react-hot-toast";

import UserLayout from "./components/layout/UserLayout.jsx"
import Home from "./pages/Home"
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import CollectionPage from "./pages/CollectionPage.jsx"

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
     
          <Route path="/" element={ <UserLayout />}  >
                <Route index element={ <Home />}    />
                <Route path="login" element={ <Login />}    />
                <Route path="register" element={ <Register />}    />
                <Route path="profile" element={ <Profile />}    />
                <Route path="collections/:collection" element={ <CollectionPage />}    />

                
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
