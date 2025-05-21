"use client";

import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NavBar = () => {
  const pathname = usePathname();
  const router = useRouter()
  const { loggedIn, setLoggedIn } = useAuth();

  const signOut = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    if (response.status === 200) {
      setLoggedIn(false);
      router.push("/")
    }
  };

  return (
    <nav className="mx-auto max-w-[82rem] px-10 py-8 flex items-center w-full">
      <Link href={"/"}>
        <Image height={37} width={150} src="/logo.svg" alt="logo" />
      </Link>
      {pathname !== "/login" && (
        <>
          <div className="ml-20 gap-4 items-center flex">
            <Link href={loggedIn ? "/dogs" : "/login"} className="font-medium">
              Adopt Now
            </Link>
          </div>
          {loggedIn ? (
            <button
              onClick={signOut}
              type="button"
              className="ml-auto bg-primary rounded px-4 py-2 font-medium text-white hover:bg-purple-900 duration-100 transition-colors text-sm"
            >
              Sign Out
            </button>
          ) : (
            <Link
              href={"/login"}
              className="ml-auto bg-primary rounded px-4 py-2 font-medium text-white hover:bg-purple-900 duration-100 transition-colors text-sm"
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
