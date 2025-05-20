import Image from "next/image";
import Link from "next/link";
import React from "react";

const NavBar = () => {
  return (
    <nav className="px-20 py-8 flex items-center">
      <Link href={"/"}>
        <Image height={37} width={150} src="/logo.svg" alt="logo" />
      </Link>
      <div className="ml-20 gap-4 items-center flex">
        <Link href={"/dogs"} className="font-medium">Browse Dogs</Link>
      </div>
      <Link
        href={"/login"}
        className="ml-auto bg-primary rounded-lg px-4 py-2 font-medium text-white hover:bg-pink-800 duration-100 transition-colors"
      >
        Login
      </Link>
    </nav>
  );
};

export default NavBar;
