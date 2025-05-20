"use client";

import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";

const Login = () => {
  const { loggedIn, setLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loggedIn) router.push("/");
  }, [loggedIn]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data, e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.email, name: data.name }),
        credentials: "include",
      });
      if (response.status === 200) {
        setLoggedIn(true);
        router.push("/");
      }
    } catch (error) {
      console.error(error);
      toast.error("Oops, something went wrong!");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex flex-col md:w-[480px] my-10 gap-4">
        <h1 className="text-2xl font-bold">Sign In</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm">
            Name
          </label>
          <input
            id="name"
            {...register("name", { required: "Name is required" })}
            type="text"
            className="p-2 text-sm border border-gray-400 rounded focus:ring-0 focus:outline-none"
            aria-invalid={errors.name ? "true" : "false"}
          />
          {errors.name && (
            <p role="alert" className="text-xs text-red-500">
              {errors.name?.message}
            </p>
          )}

          <label htmlFor="email" className="text-sm">
            Email
          </label>
          <input
            id="email"
            {...register("email", { required: "Email is required" })}
            type="text"
            className="p-2 text-sm border border-gray-400 rounded focus:ring-0 focus:outline-none"
            aria-invalid={errors.email ? "true" : "false"}
          />
          {errors.email && (
            <p role="alert" className="text-xs text-red-500">
              {errors.email?.message}
            </p>
          )}

          {/* <label htmlFor="password" className="text-sm">
            Password
          </label>
          <input
            id="password"
            {...register("password", { required: "Password is required" })}
            type="password"
            className="p-2 text-sm border border-gray-400 rounded focus:ring-0 focus:outline-none"
            aria-invalid={errors.password ? "true" : "false"}
          />
          {errors.password && (
            <p role="alert" className="text-xs text-red-500">
              {errors.password?.message}
            </p>
          )} */}

          <button
            type="submit"
            className="text-gray-200 text-sm rounded bg-primary hover:bg-primary-dark py-2 hover:text-gray-200 mt-2"
          >
            Sign in
          </button>
        </form>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
};

export default Login;
