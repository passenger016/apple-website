import React from "react";
import { appleImg, bagImg, searchImg } from "../utils";
import { navLists } from "../constants";

function Navbar() {
  return (
    <header className="w-full py-5 sm:px-10 px-5 flex justify-between items-center">
      <nav className="flex w-full screen-max-width">
        <img src={appleImg} alt="this is the apple logo" />
        {/* for maximum smaller screens the navitems are hidden as there will be ahamburger menu for that */}
        <div className="flex flex-1 justify-center max-sm:hidden">
          {/* key is necessary for react to render the elements in order and each element to have and 
                unique identifier */}
          {navLists.map((navItem, index) => (
            <div
              className="px-5 text-xs cursor-pointer text-gray hover:text-white trasnition transition-all ease-in"
              key={index}
            >
              {navItem}
            </div>
          ))}
        </div>
        <div className="flex items-baseline max-sm:justify-end max-sm:flex-1 gap-7">
          <img src={searchImg} alt="search" width={12} height={12} className="cursor-pointer" />
          <img src={bagImg} alt="bag" width={12} height={12} className="cursor-pointer" />
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
