"use client";

import NavBar from "./NavBar";
import Footer from "./Footer";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Loader from "./Loader";
import Image from "next/image";
import { ArrowLeftCircle, ArrowRightCircle, Heart, Trash2 } from "lucide-react";
import { Sour_Gummy } from "next/font/google";
const ballet = Sour_Gummy({ subsets: ["latin"] });

const FindDogs = () => {
  const { loggedIn, user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [breeds, setBreeds] = useState([]);
  const [dogs, setDogs] = useState([]);
  const baseSearchURL = "/dogs/search?size=20&from=0";
  const nextPage = useRef(baseSearchURL);
  const prevPage = useRef();
  const [showNext, setShowNext] = useState();
  const [showPrev, setShowPrev] = useState();
  const [favorite, setFavorite] = useState([]);

  // Inputs
  const [zipInput, setZipInput] = useState("");
  const [zipCodes, setZipCodes] = useState([]);
  const [minAge, setMinAge] = useState(0);
  const [maxAge, setMaxAge] = useState(30);
  const [selectedBreeds, setSelectedBreeds] = useState([]);

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

  const fetchDogs = async (isPrevPage) => {
    try {
      const searchURL = `${process.env.NEXT_PUBLIC_BACKEND_URL}${isPrevPage ? prevPage.current : nextPage.current}`;
      console.log(searchURL);
      let response = await fetch(searchURL, {
        credentials: "include",
      });
      if (response.ok) {
        const { prev, next, resultIds, total } = await response.json();
        setShowPrev(prev);
        setShowNext(next);
        prevPage.current = prev;
        nextPage.current = next;
        response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/dogs`, {
          method: "POST",
          body: JSON.stringify(resultIds),
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        if (response.ok) {
          const dogs = await response.json();
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
            <div className="rounded p-4 bg-gray-200 flex flex-col gap-2 max-w-[18rem] w-full">
              <p className="font-semibold">Filters</p>
              <label htmlFor={"breeds"} className="text-sm font-medium">
                Breeds
              </label>
              <select
                onChange={(e) => {
                  const selectedBreed = e.target.value;
                  setSelectedBreeds((prev) => {
                    if (!prev.includes(selectedBreed)) {
                      return [...prev, selectedBreed];
                    }
                    return prev;
                  });
                }}
                id="breeds"
                className="bg-white px-2 py-1 rounded text-xs"
              >
                {breeds.map((b, i) => (
                  <option value={b} key={i}>
                    {b}
                  </option>
                ))}
              </select>
              <div className="flex gap-2 flex-wrap">
                {selectedBreeds.map((z, i) => (
                  <div key={i} className="text-xs flex items-center bg-gray-300 p-1 gap-1 rounded-lg">
                    <p>{z}</p>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedBreeds((prev) => prev.filter((zip) => zip !== z));
                      }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>

              <label htmlFor={"zipCode"} className="text-sm font-medium">
                Zip Code
              </label>
              <input
                id="zipCode"
                type="number"
                maxLength={5}
                value={zipInput}
                onChange={(e) => {
                  setZipInput(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && zipInput.trim() !== "") {
                    setZipCodes((prev) => [...prev, zipInput]);
                    setZipInput("");
                  }
                }}
                className="text-xs px-2 py-1 bg-white rounded focus:ring-0 focus:outline-none"
              />
              <div className="flex gap-2 flex-wrap">
                {zipCodes.map((z, i) => (
                  <div key={i} className="text-xs flex items-center bg-gray-300 p-1 gap-1 rounded-lg">
                    <p>{z}</p>
                    <button
                      type="button"
                      onClick={() => {
                        setZipCodes((prev) => prev.filter((zip) => zip !== z));
                      }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
              <label htmlFor="minAge" className="text-sm font-medium">
                Age Range
              </label>
              <div className="flex gap-2 items-center justify-start">
                <input
                  id="minAge"
                  type="number"
                  min={0}
                  max={maxAge}
                  value={minAge}
                  onChange={(e) => setMinAge(e.target.value)}
                  className="text-xs px-2 py-1 bg-white rounded focus:ring-0 focus:outline-none max-w-14"
                />
                <p className="text-xs">—</p>
                <input
                  type="number"
                  min={minAge}
                  value={maxAge}
                  onChange={(e) => setMaxAge(e.target.value)}
                  className="text-xs px-2 py-1 bg-white rounded focus:ring-0 focus:outline-none max-w-14"
                />
              </div>

              <button
                onClick={() => {
                  setLoading(true);
                  nextPage.current = `${baseSearchURL}${
                    zipCodes.length > 0 ? zipCodes.map((zip) => `&zipCodes=${zip}`).join("") : ""
                  }${minAge ? `&ageMin=${minAge}` : ""}${maxAge ? `&ageMax=${maxAge}` : ""}${
                    selectedBreeds.length > 0 ? selectedBreeds.map((breed) => `&breeds=${breed}`).join("") : ""
                  }`;
                  setShowNext(baseSearchURL);
                  fetchDogs();
                  setLoading(false);
                }}
                type="button"
                className="bg-primary px-4 py-2 rounded text-white ml-auto text-xs"
              >
                Apply
              </button>
            </div>

            <div className="flex flex-col items-center w-full">
              <div className="grid grid-cols-5 gap-4 w-full">
                {dogs &&
                  dogs.map((d, i) => {
                    return (
                      <div key={i} className="relative group flex flex-col mt-auto">
                        <p className={`${ballet.className}`}>
                          <span className={`font-semibold`}>{d.name}</span>
                          {", "}
                          {d.breed}
                        </p>
                        <div className="relative w-full h-[200px] overflow-hidden rounded-xl flex items-center justify-center">
                          <Image
                            src={d.img}
                            alt={d.name}
                            className="object-cover h-full w-full transform transition-transform duration-300"
                            fill={true}
                          />
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
                            className="transition opacity-0 group-hover:opacity-60"
                          >
                            <Heart
                              className={`${favorite.includes(d.id) ? "fill-red-500" : "fill-white"}`}
                              color={`${favorite.includes(d.id) ? "red" : "white"}`}
                              size={100}
                            />
                          </button>
                        </div>
                        <div className="flex flex-col items-start mt-2 gap-1 text-xs">
                          <div className="flex justify-between items-start gap-1 w-full">
                            <p>
                              <span className="font-semibold">Zip Code</span>
                              {": "}
                              {d.zip_code}
                            </p>
                            <p className="flex-shrink-0">
                              <span className="font-semibold">Age</span>
                              {": "}
                              {d.age}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
              <div className="w-full mx-auto flex items-center justify-center my-10 gap-8">
                {showPrev && (
                  <button
                    className="flex items-center gap-2 text-sm font-light"
                    type="button"
                    onClick={async () => {
                      setLoading(true);
                      await fetchDogs(true);
                      setLoading(false);
                    }}
                  >
                    <ArrowLeftCircle size={20} /> Prev Page
                  </button>
                )}
                {showNext && (
                  <button
                    className="flex items-center gap-2 text-sm font-light"
                    type="button"
                    onClick={async () => {
                      setLoading(true);
                      await fetchDogs(false);
                      setLoading(false);
                    }}
                  >
                    Next Page <ArrowRightCircle size={20} />
                  </button>
                )}
              </div>
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
