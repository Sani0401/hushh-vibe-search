"use client";
/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from "react";
import Slide1 from "./components/svg/slideImage1.svg";
import Slide3 from "./components/svg/slideImage3.svg";
import { useRouter } from "next/navigation";
import services from "./services/services";
import Resources from "./resources/resources";
import VibeSearchGif from "../app/resources/images/VibeSearch.gif";
import getUserDetails from "./services/authentication/getUserDetails";
import ToBeLaunched from "./components/ToBeLaunched/ToBeLaunched";
import Head from "next/head";
import utilities from "./components/utilities/utilities";
import { HushhButton } from "hushh-button-private-2";
const slides = [
  {
    image: Slide1,
    text: "Shop Smoothly,",
    text2: "Save the Maze for Game Night",
  },
  {
    image: VibeSearchGif,
    text: "Type like you talk,",
    text2: " Vibe gets it",
  },
  {
    image: Slide3,
    text: "Spot a style you love?",
    text2: "Let's find its twin",
  },
];

const metadata = {
  title: "Vibe Search - match your perfect outfit with us",
  description:
    "Find perfect items to express your individuality in just one click with our vibe search",
  keywords:
    "AI shopping, semantic search, personalized shopping, privacy protection, global fashion brands",
  openGraph: {
    title: "Home - Vibe Search",
    description:
      "Explore Vibe Search, a platform that revolutionizes online shopping with AI and privacy-focused features.",
    images: [Resources.images.VibeLogo.src],
    url: "https://www.vibesearch.ai",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userDetails, setUserDetails] = useState(null); // State for user details

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    // Check if the user has just signed up
    if (isSignedUp) {
      setIsModalOpen(true);
    }
  }, [isSignedUp]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const user = await getUserDetails(setUserDetails);
      if (!user) {
      } else {
        return user;
      }
    };
    fetchUserDetails();
  }, []); // Ensure this runs only on component mount

  useEffect(() => {
    setInterval(() => {
      isSignedUp ? "" : services.authentication.isLoggedIn(setIsSignedUp);
    }, 1000);
  }, []);

  useEffect(() => {
    isSignedUp ? setIsModalOpen(true) : "";
  }, [isSignedUp]);

  const handleGoogleSignIn = async () => {
    try {
      await services.authentication.googleSignIn();
    } catch (error) {}
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1000); // Show modal after 1 second

    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 7000); //7 seconds delay for slide change

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    services.authentication.getSession();
  }, []);

  return (
    <>
      {/* <Home2/> */}
      {/* <IntroSlide3/> */}
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <meta property="og:title" content={metadata.openGraph.title} />
        <meta
          property="og:description"
          content={metadata.openGraph.description}
        />
        <meta property="og:image" content={metadata.openGraph.images[0]} />
        <meta property="og:url" content={metadata.openGraph.url} />
        <meta name="twitter:card" content={metadata.twitter.card} />
      </Head>
      {/* {typeof window !== 'undefined' && (
        <HushhButton
          questions={[
            {
              question: "What are you looking for?",
              options: ["Products", "Services", "Information"],
              answer: []
            }
          ]} 
        />
      )} */}
      <ToBeLaunched></ToBeLaunched>

      <utilities.Footer></utilities.Footer>
    </>
  );
}