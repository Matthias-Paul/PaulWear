import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Toaster } from "react-hot-toast";

import UserLayout from "./components/layout/UserLayout.jsx"
import AdminLayout from "./components/admin/AdminLayout.jsx"
import VendorLayout from "./components/vendor/VendorLayout.jsx"

import Home from "./pages/Home"
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import CollectionPage from "./pages/CollectionPage.jsx"
import ScrollToTop from "./components/common/ScrollToTop"
import ProductsDetails from "./components/products/ProductsDetails"
import Checkout from "./components/cart/Checkout"
import OrderConfirmationPage from "./pages/OrderConfirmationPage.jsx"
import OrderDetailsPage from "./pages/OrderDetailsPage.jsx"
import MyOrdersPage from "./pages/MyOrdersPage.jsx"
import AdminHomePage from "./pages/AdminHomePage.jsx"
import UserManagement from "./components/admin/UserManagement"
import ProductManagement from "./components/admin/ProductManagement"
import EditProductPage from "./components/admin/EditProductPage"
import OrderManagement from "./components/admin/OrderManagement"
import VendorHomePage from "./pages/VendorHomePage.jsx"
import VendorProductManagement from "./components/vendor/VendorProductManagement"
import VendorEditProductPage from "./components/vendor/VendorEditProductPage"
import VendorOrderManagement from "./components/vendor/VendorOrderManagement"


function App() {
  return (
    <>
    <BrowserRouter>
      <ScrollToTop  />

      <Routes>
     
          <Route path="/" element={ <UserLayout />}  >
                <Route index element={ <Home />}    />
                <Route path="login" element={ <Login />}    />
                <Route path="register" element={ <Register />}    />
                <Route path="profile" element={ <Profile />}    />
                <Route path="collections/:collection" element={ <CollectionPage />}  />
                <Route path="product/:id" element={ <ProductsDetails />} />
                <Route path="checkout" element={ <Checkout />} />
                 <Route path="order-confirmation" element={ <OrderConfirmationPage />} />
                <Route path="order/:id" element={ <OrderDetailsPage />} />
                <Route path="my-orders" element={ <MyOrdersPage />} />


          </Route>

        <Route path="/vendor" element={ <VendorLayout />} > 
          {/* vendor route */}

             <Route index element={ <VendorHomePage />}    />
             <Route path="products" element={ <VendorProductManagement />}    />
             <Route path="products/:id/edit" element={ <VendorEditProductPage />} />
             <Route path="orders" element={ <VendorOrderManagement />}    />

        </Route>

       

        <Route path="/admin" element={ <AdminLayout />} > 
          {/* Admin route */}

             <Route index element={ <AdminHomePage />}    />
             <Route path="users" element={ <UserManagement />}    />
             <Route path="products" element={ <ProductManagement />}    />
             <Route path="products/:id/edit" element={ <EditProductPage />}    />
             <Route path="orders" element={ <OrderManagement />}    />

        </Route>

      </Routes> 
        <Toaster position=" top-right" />
 </BrowserRouter>
    </>
  );
}

export default App;
