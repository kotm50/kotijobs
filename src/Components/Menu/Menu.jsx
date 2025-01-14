import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { adMenu, applyMenu } from "../../Data/Menu";

function Menu() {
  const [menuList, setMenuList] = useState([]);
  const thisLocation = useLocation();

  useEffect(() => {
    getMenuList();
    //eslint-disable-next-line
  }, [thisLocation]);
  const getMenuList = () => {
    console.log(applyMenu);
    const url = thisLocation.pathname.split("/")[2];
    console.log(url);
    if (url === "apply") {
      setMenuList(applyMenu);
    } else if (url === "ad") {
      setMenuList(adMenu);
    } else {
      setMenuList([]);
    }
  };
  return (
    <>
      {menuList && menuList.length > 0 ? (
        <div className="flex flex-col justify-start gap-x-0">
          {menuList.map((menu, idx) => (
            <div className="flex flex-col justify-start gap-x-0" key={idx}>
              <div className="p-2 text-sm font-bold bg-gray-100">
                {menu.title}
              </div>
              <div className="flex flex-col justify-start gap-x-0">
                {menu.menu.map((menu, idx) => (
                  <Link
                    to={menu.url}
                    className="p-2 hover:font-bold text-xs"
                    key={idx}
                  >
                    {menu.subTitle}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        "메뉴 불러오는 중"
      )}
    </>
  );
}

export default Menu;
