import { BrowserRouter, Routes, Route } from "react-router-dom"
import UserLayout from "./components/layout/UserLayout.jsx"
function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route> 
          <Route path="/" element={ <UserLayout />}    />
        </Route>

        <Route>  </Route>

      </Routes> 
    </BrowserRouter>
    </>
  );
}

export default App;
