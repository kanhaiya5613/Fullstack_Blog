import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import authService from "./appwrite/auth.js";
import { login, logout } from "./store/authSlice.js";
import { Footer, Header } from "./component/index.js";
import { Outlet } from "react-router-dom";

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const mode = useSelector((state) => state.theme.mode);

  const isDark = mode === "dark";
 
  useEffect(() => {
  authService.getCurrentUser().then((userData) => {

    //console.log("Raw Appwrite user:", userData); 

    if (userData) {
      dispatch(login(userData));
      //console.log("Dispatched user:", userData);
    } else {
      dispatch(logout());
    }
  })
  .finally(() => setLoading(false));
}, []);


  return !loading ? (
    <div
      className={`min-h-screen flex flex-wrap transition-all duration-300 ${
        isDark ? "bg-gray-900 text-gray-100" : "bg-white text-black"
      }`}
    >
      <div className="w-full block">
        <Header />

        <main
          className={`min-h-[80vh] transition-all duration-300 ${
            isDark ? "bg-gray-800" : "bg-gray-100"
          }`}
        >
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  ) : null;
}

export default App;
