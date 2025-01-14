import { Outlet } from "react-router-dom";
import Menu from "../../Components/Menu";

function AdminMain() {
  return (
    <>
      <div className="w-full max-w-[1400px] mx-auto flex flex-row justify-start">
        <div className="h-full w-[200px] bg-white border-r min-h-screen pt-[120px]">
          <Menu />
        </div>
        <div className="mt-[120px]">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default AdminMain;
