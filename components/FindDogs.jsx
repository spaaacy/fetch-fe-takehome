"use client";

import NavBar from "./NavBar";
import Footer from "./Footer";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Loader from "./Loader";
import Image from "next/image";
import { Heart } from "lucide-react";

const FindDogs = () => {
  const { loggedIn, user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [breeds, setBreeds] = useState([]);
  const [dogs, setDogs] = useState([]);
  const [nextPage, setNextPage] = useState();
  const [favorite, setFavorite] = useState([]);

  useEffect(() => {
    if (authLoading) return;
    if (dogs && breeds) setLoading(false);
    if (!loggedIn) {
      router.push("/login");
    } else if (!dataLoaded) {
      setDataLoaded(true);
      fetchDogs();
      fetchBreeds();
    }
  }, [loading, loggedIn, dogs, breeds]);

  const fetchBreeds = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/dogs/breeds`, {
        credentials: "include",
      });
      if (response.ok) {
        const breeds = await response.json();
        setBreeds(breeds);
      }
    } catch (error) {
      console.error(error);
      toast.error("Oops, something went wrong!");
    }
  };

  const fetchDogs = async () => {
    try {
      let response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/dogs/search?size=20`, {
        credentials: "include",
      });
      if (response.ok) {
        const { next, resultIds } = await response.json();
        setNextPage(next);
        response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/dogs`, {
          method: "POST",
          body: JSON.stringify(resultIds),
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        console.log(response);
        if (response.ok) {
          const dogs = await response.json();
          console.log(dogs);
          setDogs(dogs);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Oops, something went wrong!");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      {loading ? (
        <Loader />
      ) : (
        <main>
          {user && (
            <h3 className="font-bold text-3xl">
              Hey <span className="text-secondary">{`${user.name}, `}</span>
              find your best buddy!
            </h3>
          )}

          <div className="flex gap-4 mt-10 items-start">
            <div className="rounded p-4 bg-gray-200 flex flex-col gap-2  max-w-[24rem]">
              <p className="font-semibold">Filters</p>
              <label htmlFor={"breeds"} className="text-sm font-medium">
                Breeds
              </label>
              <select id="breeds" className="bg-white px-2 py-1 rounded text-xs">
                {breeds.map((b, i) => (
                  <option value={b} key={i}>
                    {b}
                  </option>
                ))}
              </select>
              <button type="button" className="bg-primary px-4 py-2 rounded text-white ml-auto text-xs">
                Apply
              </button>
            </div>

            <div className="grid grid-cols-5 gap-4 w-full">
              {dogs &&
                dogs.map((d, i) => {
                  return (
                    <div key={i} className="relative group">
                      <div className="relative w-full h-[200px] overflow-hidden rounded-xl scale-150">
                        <Image
                          src={d.img}
                          alt={d.name}
                          className="object-cover h-full w-full transform transition-transform duration-300"
                          fill={true}
                        />
                      </div>
                      <button
                        onClick={() => {
                          setFavorite((prev) => {
                            if (prev.includes(d.id)) {
                              return prev.filter((id) => id !== d.id);
                            } else {
                              return [...prev, d.id];
                            }
                          });
                        }}
                        type="button"
                        className="absolute top-2 right-2"
                      >
                        <Heart
                          className={`${favorite.includes(d.id) ? "fill-red-500" : "fill-white"}`}
                          color={`${favorite.includes(d.id) ? "red" : "white"}`}
                          size={20}
                        />
                      </button>
                      <div className="flex flex-col items-start mt-2  text-xs">
                        <div className="flex justify-between items-center w-full">
                          <p>
                            <span className="font-semibold">{d.name}</span>
                            {", "}
                            {d.breed}
                          </p>
                          <p>
                            <span className="font-semibold">Age</span>
                            {": "}
                            {d.age}
                          </p>
                        </div>
                        <p>
                          <span className="font-semibold">Zip Code</span>
                          {": "}
                          {d.zip_code}
                        </p>
                        {console.log(d)}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </main>
      )}
      <Footer />
      <Toaster />
    </div>
  );
};

export default FindDogs;
