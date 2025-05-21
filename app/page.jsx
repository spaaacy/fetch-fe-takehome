'use client'

import FadeIn from "@/components/FadeIn";
import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import Image from "next/image";
import Link from "next/link";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import NextArrow from "@/components/NextArrow";
import PrevArrow from "@/components/PrevArrow";

export default function Home() {
  return (
    <div>
      <NavBar />
      <div className="flex flex-col items-center">
        <FadeIn
          variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
          transition={{ delay: 0.2, type: "linear", duration: 0.3 }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className=" bg-[#F5EDE1] w-full"
        >
          <div className="max-w-[1720px] flex max-lg:flex-col-reverse max-lg:items-center lg:justify-between mx-auto py-10 px-14">
            <div className="flex flex-col lg:mt-[10rem] max-lg:text-center ">
              <h1 className="lg:text-7xl sm:text-5xl max-sm:text-3xl font-medium">
                Find Your
                <br />
                Perfect Companion
              </h1>
              <p className="leading-loose lg:text-lg text-gray-800 mt-8 max-sm:text-sm sm:text-md">
                Discover your ideal furry friend with personalized matching and guidance from trusted adoption experts.
              </p>
              <div className="flex gap-4 items-center mt-8 max-lg:justify-center">
                <Link href={"/dogs"} className="px-10 py-4 rounded-lg text-sm font-medium bg-secondary ">
                  Get Started
                </Link>
              </div>
            </div>
            <div className="relative w-[20rem] h-[20rem] xl:w-[44rem] xl:h-[44rem] md:h-[34rem] md:w-[34rem] flex-shrink-0">
              <Image src={"/hero.png"} alt="hero dog" fill={true} className="object-contain" />
            </div>
          </div>
        </FadeIn>

        <FadeIn className="my-20 w-full">
          <h3 className="text-center font-bold text-4xl mb-10">Checkout Our Dogs!</h3>
          <Slider
            infinite={true}
            dots={true}
            speed={500}
            slidesToShow={5}
            arrows={true}
            nextArrow={<NextArrow to="next" />}
            prevArrow={<PrevArrow to="next" />}
            slidesToScroll={1}
            autoplay={true}
            autoplaySpeed={3000}
            responsive={[
              {
                breakpoint: 1524,
                settings: {
                  slidesToShow: 4,
                  slidesToScroll: 4,
                  infinite: true,
                  dots: true,
                },
              },
              {
                breakpoint: 1280,
                settings: {
                  slidesToShow: 3,
                  slidesToScroll: 3,
                  infinite: true,
                  dots: true,
                },
              },
              {
                breakpoint: 1280,
                settings: {
                  slidesToShow: 2,
                  slidesToScroll: 2,
                },
              },
              {
                breakpoint: 768,
                settings: {
                  slidesToShow: 1,
                  slidesToScroll: 1,
                },
              },
            ]}
          >
            {dogs.map((d, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="relative h-52 w-52 max-lg:h-32 max-sm:w-20 max-lg:w-32 max-sm:h-20 overflow-hidden rounded-full flex-shrink-0 mx-auto">
                  <Image
                    className="object-cover h-full"
                    src={d.img}
                    unoptimized={true}
                    alt="coach image"
                    width={208}
                    height={208}
                  />
                </div>
                <h6 className="mt-4 text-center max-sm:text-sm lg:text-lg font-semibold">{d.name}</h6>
                <p className="text-center max-lg:text-sm max-sm:text-xs">{d.subtitle}</p>
              </div>
            ))}
          </Slider>
        </FadeIn>

        <FadeIn
          variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
          transition={{ delay: 0.2, type: "linear", duration: 0.3 }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col gap-8 my-20 max-w-[1440px] mx-auto px-10"
        >
          <h3 className="w-full text-6xl max-md:text-4xl font-medium text-center">Success Stories</h3>
          <div className="grid lg:grid-cols-2 items-start justify-center max-lg:grid-cols-1 gap-4">
            {testimonials.map((t, i) => {
              return (
                <div
                  key={i}
                  className="border-2 border-black rounded-xl px-6 py-6 h-full md:h-80 flex flex-col justify-between"
                >
                  <p className="text-lg text-gray-800 leading-loose">{t.desc}</p>
                  <hr className="border-0 h-[1px] bg-neutral-300 mt-auto mb-4" />
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{t.name}</p>
                      <p className="font-light">{t.title}</p>
                    </div>
                    <div className="h-20 w-20 relative">
                      <Image src={t.image} alt={t.name} fill={true} className="rounded-full object-cover" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </FadeIn>
      </div>
      <Footer />
    </div>
  );
}

const testimonials = [
  {
    desc: "Adopting Max was the best decision of my life. He's brought so much joy and energy to our home!",
    name: "Sarah Johnson",
    title: "Dog Lover from New York",
    image: "/testimonials/sarah.jpg",
  },
  {
    desc: "Thanks to this platform, we found Bella, the perfect companion for our family. She's amazing with the kids!",
    name: "The Smith Family",
    title: "Happy Adopters from California",
    image: "/testimonials/emily.jpg",
  },
  {
    desc: "I never thought I'd find such a perfect match. Charlie has been my best friend since day one!",
    name: "John Wick",
    title: "Proud Dog Dad from Texas",
    image: "/testimonials/john.jpg",
  },
  {
    desc: "Finding Luna through this service was a dream come true. She's not just a pet—she's family.",
    name: "Emily Nguyen",
    title: "First-Time Adopter from Washington",
    image: "/testimonials/claire.jpg",
  },
];

const dogs = [
  {
    img: "/dogs/1.jpg",
    name: "Buddy",
    subtitle: "Golden Retriever, 2 years old",
  },
  {
    img: "/dogs/2.jpg",
    name: "Max",
    subtitle: "Labrador Retriever, 3 years old",
  },
  {
    img: "/dogs/3.jpg",
    name: "Bella",
    subtitle: "German Shepherd, 4 years old",
  },
  {
    img: "/dogs/4.png",
    name: "Charlie",
    subtitle: "Beagle, 1 year old",
  },
  {
    img: "/dogs/5.jpg",
    name: "Lucy",
    subtitle: "Bulldog, 5 years old",
  },
];