import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";

function MainLayout() {
  return (
    <div>
      <Navbar />
      <div className="pt-4 pb-8">
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;
