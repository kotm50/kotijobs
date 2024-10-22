import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <>
      <h1 className="text-center py-4 bg-white drop-shadow">
        <Link
          to={"/"}
          className="text-center text-xl font-neoextra text-teal-600 hover:text-rose-500"
        >
          코리아티엠 Job Portal Alpha
        </Link>
      </h1>
    </>
  );
}

export default Header;
