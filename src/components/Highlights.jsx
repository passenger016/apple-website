import React from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger"; // Import ScrollTrigger plugin
import { rightImg, watchImg } from "../utils";
import VideoCarousel from "./VideoCarousel";

// Register ScrollTrigger as a GSAP plugin
gsap.registerPlugin(ScrollTrigger);

function Highlights() {
  useGSAP(() => {
    // GSAP animation for .highlights-title
    gsap.to(".highlights-title", {
      scrollTrigger: {
        trigger: ".highlights-title",
        markers: false,
        start: "top 80%", // Animation starts when top of .highlights-title hits 20% of viewport
        end:"+=20px",
        scrub: 2, // Scrub effect with a sensitivity of 2
        once: false, // runs the animation only once
      },
      opacity: 1,
      y: 0,
      duration: 1,
    });

    // GSAP animation for .link elements
    gsap.to(".link", {
      scrollTrigger:{
        trigger:".highlights-title",
        markers: false,
        start:"top 80%",
        end:"+=30px",
        scrub: 2,
      },
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.2,
    });
  }, []);

  return (
    <section
      className="w-screen overflow-hidden h-full common-padding bg-zinc"
      id="highlights"
    >
      <div className="screen-max-width">
        <div className="mb-12 md:flex w-full items-end justify-between">
          <h1 className="highlights-title section-heading">
            Get the highlights.
          </h1>
          <div className="link-container flex flex-wrap items-end gap-5">
            <div className="link flex items-center justify-center">
              <p>Watch film</p>
              <img src={watchImg} alt="watch" className="ml-2" />
            </div>
            <div className="link flex items-center justify-center">
              <p>Watch the event</p>
              <img src={rightImg} alt="right" className="ml-2" />
            </div>
          </div>
        </div>
        <VideoCarousel />
      </div>
    </section>
  );
}

export default Highlights;
