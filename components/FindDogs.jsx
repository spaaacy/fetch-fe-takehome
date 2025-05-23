"use client";

import NavBar from "./NavBar";
import Footer from "./Footer";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Loader from "./Loader";
import Image from "next/image";
import {
  ArrowDown,
  ArrowLeftCircle,
  ArrowRightCircle,
  ArrowUp,
  Bone,
  Calendar,
  Dog,
  Heart,
  MapPin,
  Trash2,
} from "lucide-react";
import FadeIn from "./FadeIn";
import capitalizeWords from "@/utils/capitalizeWords";

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
  const [match, setMatch] = useState();
  const [locations, setLocations] = useState();
  const [showFavorites, setShowFavorites] = useState(false);

  // Inputs
  const [zipInput, setZipInput] = useState("");
  const [zipCodes, setZipCodes] = useState([]);
  const [minAge, setMinAge] = useState(0);
  const [maxAge, setMaxAge] = useState(30);
  const [selectedBreeds, setSelectedBreeds] = useState([]);
  const [sorting, setSorting] = useState("name");
  const sortingRef = useRef("name");
  const [ascending, setAscending] = useState();
  const ascendingRef = useRef(true);

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
  }, [loggedIn, dogs, breeds]);

  const findMatch = async () => {
    try {
      let response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/dogs/match`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(favorite),
        credentials: "include",
      });
      if (response.ok) {
        const { match } = await response.json();
        response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/dogs`, {
          method: "POST",
          body: JSON.stringify([match]),
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        if (response.ok) {
          const dogs = await response.json();
          setMatch(dogs[0]);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Oops, something went wrong!");
    }
  };

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

  const fetchLocations = async (zipCodes) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/locations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(zipCodes),
        credentials: "include",
      });
      if (response.ok) {
        const locations = await response.json();
        setLocations(locations);
      }
    } catch (error) {
      console.error(error);
      toast.error("Oops, something went wrong!");
    }
  };

  const fetchDogs = async (isPrevPage) => {
    try {
      const searchURL = `${process.env.NEXT_PUBLIC_BACKEND_URL}${isPrevPage ? prevPage.current : nextPage.current}`;
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
          const zipCodes = dogs.map((dog) => dog.zip_code);
          fetchLocations(zipCodes);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Oops, something went wrong!");
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/dogs`, {
        method: "POST",
        body: JSON.stringify(favorite),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (response.ok) {
        setShowFavorites(true);
        const dogs = await response.json();
        setDogs(dogs);
        const zipCodes = dogs.map((dog) => dog.zip_code);
        fetchLocations(zipCodes);
        nextPage.current = baseSearchURL;
        prevPage.current = null;
        setShowPrev(false);
        setShowNext(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Oops, something went wrong!");
    }
  };

  const refetchDogs = async () => {
    setLoading(true);
    nextPage.current = `${baseSearchURL}${
      zipCodes.length > 0 ? zipCodes.map((zip) => `&zipCodes=${zip}`).join("") : ""
    }${minAge ? `&ageMin=${minAge}` : ""}${maxAge ? `&ageMax=${maxAge}` : ""}

    

    ${
      selectedBreeds.length > 0
        ? selectedBreeds.map((breed) => `&breeds=${breed}`).join("")
        : `&sort=${sortingRef.current}:${ascendingRef.current ? "asc" : "desc"}`
    }`;

    setShowNext(baseSearchURL);
    await fetchDogs();
    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      {loading ? (
        <Loader />
      ) : !match ? (
        <main>
          {user && (
            <div className="flex justify-between items-center gap-4 max-md:flex-col">
              <h3 className="font-bold text-3xl">
                Hey <span className="text-secondary">{`${capitalizeWords(user.name)}, `}</span>
                find your best buddy!
              </h3>

              <div className="flex-shrink-0 ml-auto flex items-center gap-3">
                {showFavorites && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowFavorites(false);
                      fetchDogs();
                    }}
                    className="max-sm:text-sm text-sm"
                  >
                    View All
                  </button>
                )}
                {!showFavorites && favorite.length > 0 && (
                  <button type="button" onClick={() => fetchFavorites()} className="max-sm:text-sm text-sm">
                    View Favorites
                  </button>
                )}
                {favorite.length > 0 && (
                  <button
                    type="button"
                    onClick={findMatch}
                    className="max-sm:text-sm  flex-shrink-0 ml-auto bg-secondary rounded px-4 py-2 font-medium duration-100 transition-colors text-sm"
                  >
                    Find Match
                  </button>
                )}
              </div>
            </div>
          )}

          {selectedBreeds.length === 0 && (
            <div className="flex w-full justify-end items-center -mb-8 relative ">
              <div className="flex gap-1 items-center">
                <label htmlFor="sort" className="text-sm font-medium">
                  Sort By
                </label>
                <select
                  value={sorting}
                  onChange={(e) => {
                    setSorting(e.target.value);
                    sortingRef.current = e.target.value;
                    refetchDogs();
                  }}
                  id="sort"
                  className="text-sm px-2 py-1 rounded bg-white"
                >
                  <option value="name">Name</option>
                  <option value="age">Age</option>
                  <option value="breed">Breed</option>
                </select>
                <button
                  onClick={() => {
                    setAscending(!ascendingRef.current);
                    ascendingRef.current = !ascendingRef.current;
                    refetchDogs();
                  }}
                  type="button"
                  className="flex items-center text-xs"
                >
                  {ascending === true ? <ArrowUp className="ml-1 w-4 h-4" /> : <ArrowDown className="ml-1 w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          <div className="flex max-md:flex-col gap-4 mt-10 items-start">
            <div className="rounded p-4 bg-gray-200 flex flex-col gap-2  w-full md:max-w-[18rem]">
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
                onClick={() => refetchDogs()}
                type="button"
                className="bg-primary px-4 py-2 rounded text-white ml-auto text-xs"
              >
                Apply
              </button>
            </div>

            <div className="flex flex-col items-center w-full">
              <div className="grid max-sm:grid-cols-1 max-lg:grid-cols-2 max-xl:grid-cols-3 grid-cols-4 gap-4 w-full">
                {dogs &&
                  dogs.map((d, i) => {
                    const location = locations?.find((l) => l?.zip_code === d.zip_code);

                    return (
                      <div key={i} className="relative group flex flex-col mb-auto">
                        <div className="relative w-full h-[200px] overflow-hidden rounded flex items-center justify-center">
                          <Image
                            src={d.img}
                            alt={d.name}
                            className="object-cover h-full w-full transform transition-transform duration-300"
                            fill={true}
                          />
                          {!favorite.includes(d.id) ? (
                            <button
                              onClick={() => {
                                setFavorite((prev) => {
                                  return [...prev, d.id];
                                });
                              }}
                              type="button"
                              className="transition opacity-0 group-hover:opacity-60"
                            >
                              <Heart className={"fill-white"} color={"white"} size={100} />
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setFavorite((prev) => {
                                  return prev.filter((id) => id !== d.id);
                                });
                              }}
                              type="button"
                              className="absolute top-4 right-4"
                            >
                              <Heart className={"fill-red-500"} color={"red"} size={20} />
                            </button>
                          )}
                        </div>

                        <div className="flex flex-col items-start mt-2 gap-1 text-gray-800">
                          <p className="font-bold flex gap-1 items-center text-sm">{d.name}</p>
                          <p className=" flex gap-1 items-center text-xs">
                            <Dog size={12} color="gray" />
                            {d.breed}
                          </p>
                          {location && (
                            <p className=" flex gap-1 items-center text-xs">
                              <MapPin size={12} color="gray" />
                              {location.state}, {location.city}, {d.zip_code}
                            </p>
                          )}
                          <p className=" flex gap-1 items-center text-xs">
                            <Calendar size={12} color="gray" />
                            {d.age} {d.age > 1 ? "years old" : "year old"}
                          </p>
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
      ) : (
        <FadeIn className={"mx-auto flex flex-col"}>
          <div className=" py-2 px-4 rounded-xl text-white gap-2 bg-primary flex flex-col items-center">
            <h3 className="font-bold text-2xl">
              Congrats! You've been matched with
              <span className="text-secondary"> {match.name}!</span>
            </h3>
            <div className="relative group flex flex-col mt-auto">
              <div className="relative w-[600px] h-[600px] overflow-hidden rounded-xl flex items-center justify-center">
                <Image
                  src={match.img}
                  alt={match.name}
                  className="object-cover h-full w-full transform transition-transform duration-300"
                  fill={true}
                />
              </div>
            </div>
            <div className="flex justify-between w-full">
              <p className="font-semibold">
                {match.age} {match.age > 1 ? "years old" : "year old"}
              </p>
              <p className="font-semibold">{match.breed}</p>
            </div>
          </div>

          <button
            className="ml-auto mt-4 max-sm:text-sm  flex-shrink-0 bg-secondary rounded px-4 py-2 font-medium duration-100 transition-colors text-sm"
            onClick={() => {
              setMatch();
            }}
          >
            Restart
          </button>
        </FadeIn>
      )}
      <Footer />
      <Toaster />
    </div>
  );
};

export default FindDogs;
