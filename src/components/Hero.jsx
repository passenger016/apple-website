import React, { useEffect, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { heroVideo, smallHeroVideo } from "../utils";

function Hero() {
  // calculate the inner width of the window and if it is a bigger screen then heroVideo will be played or else smallHeroVideo for smaller screens
  const [videoSrc, setVideoSrc] = useState(
    window.innerWidth < 760 ? smallHeroVideo : heroVideo
  );

  const handleVideoSrcChange = () => {
    if (window.innerWidth < 760) setVideoSrc(smallHeroVideo);
    else setVideoSrc(heroVideo);
  };

  useEffect(() => {
    window.addEventListener("resize", handleVideoSrcChange);
    // clean up the event listener
    return () => {
      window.removeEventListener("resize", handleVideoSrcChange);
    };
  }, []);

  useGSAP(() => {
    gsap.to(".hero-title", { opacity: 1, delay: 1.3, ease: "power1.inOut" });
    gsap.to(
      "#cta",
      { opacity: 1, y: -50, delay: 1.2}
    );
  }, []);

  return (
    <section id="hero" className="w-full bg-black relative nav-height">
      {/* flex center is an custom classs mentioned in index.css to make the items flex and center them both horizontally and vertically */}
      <div className="h-5/6 w-full flex-center flex-col">
        <p className="hero-title">iPhone 15 pro</p>
        <div className="md:w-10/12 w-9/12">
          <video
            autoPlay
            muted
            playsInline={true}
            key={videoSrc}
            className="pointer-events-none"
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        </div>
      </div>
      <div
        id="cta"
        className="flex flex-col items-center opacity-0 translate-y-20"
      >
        {/* #highlights means it will jump to the highlights section */}
        <a href="#highlights" className="btn">
          Buy
        </a>
        <p className="font-normal text-xl">From $199/month or $ 999</p>
      </div>
    </section>
  );
}

export default Hero;
