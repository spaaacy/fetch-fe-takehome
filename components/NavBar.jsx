"use client";

import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavBar = () => {
  const pathname = usePathname();
  const { loggedIn, setLoggedIn } = useAuth();

  const signOut = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    if (response.status === 200) {
      setLoggedIn(false);
    }
  };

  return (
    <nav className="px-20 py-8 flex items-center">
      <Link href={"/"}>
        <Image height={37} width={150} src="/logo.svg" alt="logo" />
      </Link>
      {pathname !== "/login" && (
        <>
          <div className="ml-20 gap-4 items-center flex">
            <Link href={"/dogs"} className="font-medium">
              Browse Dogs
            </Link>
          </div>
          {loggedIn ? (
            <button
              onClick={signOut}
              type="button"
              className="ml-auto bg-primary rounded-lg px-4 py-2 font-medium text-white hover:bg-pink-800 duration-100 transition-colors"
            >
              Sign Out
            </button>
          ) : (
            <Link
              href={"/login"}
              className="ml-auto bg-primary rounded-lg px-4 py-2 font-medium text-white hover:bg-pink-800 duration-100 transition-colors"
            >
              Login
            </Link>
          )}
        </>
      )}
    </nav>
  );
};

export default NavBar;
