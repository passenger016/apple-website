import React, { useEffect, useRef, useState } from "react";
import { hightlightsSlides } from "../constants";
import { pauseImg, playImg, replayImg } from "../utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function VideoCarousel() {
  const [video, setVideo] = useState({
    isEnd: false,
    isPlaying: false,
    startPlay: false,
    videoId: 0,
    isLastVideo: false,
  });

  /* destructuring the values from the video into individual variables */
  const { isEnd, isPlaying, startPlay, videoId, isLastVideo } = video;

  const [loadedData, setLoadedData] = useState([]);

  const videoRef = useRef([]);
  const videoSpanRef = useRef([]);
  const videoDivRef = useRef([]);

  useGSAP(() => {
    gsap.to("#video", {
      scrollTrigger: {
        trigger: "#video",
        toggleActions: "restart none none none",
      },
      onComplete: () => {
        setVideo((pre) => ({
          ...pre,
          startPlay: true,
          isPlaying: true,
        }));
      },
    });

    // videoId is from 0,1,2.. and we multiply it by 100 to make it 0,100,200... and add a percentage to it
    gsap.to("#slider", {
      transform: `translateX(${-100 * videoId}%)`,
      duration: 2,
      ease: "power2.inOut",
    });
  }, [isEnd, videoId]);

  useEffect(() => {
    let currentProgress = 0;
    let span = videoSpanRef.current;

    if (span[videoId]) {
      // animation to move the indicator
      let anim = gsap.to(span[videoId], {
        onUpdate: () => {
          // get the progress of the video .progress() is a default function of gsap that returns the total progress
          /* Purpose: This line calculates the current progress of the GSAP animation in terms of percentage (0 to 100). It's used to update the visual representation of the progress bar (span[videoId]). */
          const progress = Math.ceil(anim.progress() * 100);

          if (progress != currentProgress) {
            currentProgress = progress;

            // set the width of the progress bar
            gsap.to(videoDivRef.current[videoId], {
              width:
                window.innerWidth < 760
                  ? "10vw" // mobile
                  : window.innerWidth < 1200
                  ? "10vw" // tablet
                  : "4vw", // laptop
            });

            // set the background color of the progress bar
            gsap.to(span[videoId], {
              width: `${currentProgress}%`,
              backgroundColor: "white",
            });
          }
        },

        // when the video is ended, replace the progress bar with the indicator and change the background color
        onComplete: () => {
          if (isPlaying) {
            gsap.to(videoDivRef.current[videoId], {
              width: "12px",
            });
            gsap.to(span[videoId], {
              backgroundColor: "#afafaf",
            });
          }
        },
      });

      if (videoId == 0) {
        anim.restart();
      }

      // update the progress bar
      const animUpdate = () => {
        /* Purpose: This line sets the progress of the GSAP animation based on the actual video playback progress. 
        It updates the position of the progress bar (span[videoId]) to reflect how much of the video has been played. */
        anim.progress(
          videoRef.current[videoId].currentTime /
            hightlightsSlides[videoId].videoDuration
        );
      };

      if (isPlaying) {
        // ticker to update the progress bar
        gsap.ticker.add(animUpdate);
      } else {
        // remove the ticker when the video is paused (progress bar is stopped)
        gsap.ticker.remove(animUpdate);
      }
    }
  }, [videoId, startPlay]);

  // this useEffect() is to control the video playing we are checking if loadedData exists and if it does only then we will start playing the video
  useEffect(() => {
    if (loadedData.length > 3) {
      // if we came to the end of the video carousel and we are no longer playing then pause the video
      if (!isPlaying) {
        videoRef.current[videoId].pause();
      }
      // if startPlay is set to true then we can play the current video
      else {
        startPlay && videoRef.current[videoId].play();
      }
    }
  }, [startPlay, videoId, isPlaying, loadedData]);

  const handleLoadedMetaData = (index, e) => {
    setLoadedData((pre) => [...pre, e]);
  };

  function handleProcess(type, index) {
    switch (type) {
      case "video-end":
        setVideo((pre) => ({ ...pre, isEnd: true, videoId: index + 1 }));
        break;
      case "video-last":
        setVideo((pre) => ({ ...pre, isLastVideo: true }));
        break;
      // if it handleProcess() is being called with "video-reset" then setVideo will start from the first video again with videoId: 0 and isLastVideo set to false
      case "video-reset":
        setVideo((pre) => ({ ...pre, videoId: 0, isLastVideo: false }));
        break;
      case "play":
        setVideo((pre) => ({ ...pre, isPlaying: !pre.isPlaying }));
        break;
      case "pause":
        setVideo((pre) => ({ ...pre, isPlaying: !pre.isPlaying }));
        break;
    }
  }

  return (
    <>
      <div className="flex items-center">
        {hightlightsSlides.map((list, index) => (
          <div key={list.id} id="slider" className="sm:pr-20 pr-10">
            <div className="video-carousel_container">
              <div className="w-full h-full flex-center rounded-3xl overflow-hidden bg-black">
                {/* preload auto is direction to browser that the user will watch the video and hence it has tobbe fetched previoslu itself */}
                <video
                  id="video"
                  playsInline={true}
                  preload="auto"
                  className={`${
                    list.id == 2 && "translate-x-44"
                  } "pointer-events-none" `}
                  muted
                  ref={(el) => (videoRef.current[index] = el)} // Assigning a unique ref to each video element
                  // if it is not the last video then it will pass video-end or else just video-last to restart the sequence
                  // it will directly return instead of a javascript handler
                  onEnded={() =>
                    index !== 3
                      ? handleProcess("video-end", index)
                      : handleProcess("video-last")
                  }
                  onPlay={() => {
                    // when using setVideo() react by default calls for the previous state and then we are spreading the previous video information an also setting isPlaying to true
                    setVideo((pre) => ({ ...pre, isPlaying: true }));
                  }}
                  // when meta data of the video has been loaded we get that data and call the handleLoadedMetaData function
                  onLoadedMetadata={(e) => handleLoadedMetaData(index, e)}
                >
                  <source src={list.video} type="video/mp4" />
                </video>
              </div>
              <div className="absolute top-12 left-[5%] z-10">
                {list.textLists.map((item, index) => (
                  <p key={item} className="md:text-2xl text-xl font-medium">
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="relative flex-center mt-10">
        <div className="flex-center py-5 px-7 bg-gray-300 rounded-full backdrop-blur">
          {videoRef.current.map((_, index) => (
            <span
              key={index}
              ref={(el) => {
                videoDivRef.current[index] = el;
              }}
              className="mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer"
            >
              <span
                className="absolute h-full w-full rounded-full"
                ref={(el) => {
                  videoSpanRef.current[index] = el;
                }}
              ></span>
            </span>
          ))}
        </div>
        <button className="control-btn">
          <img
            src={isLastVideo ? replayImg : isPlaying ? pauseImg : playImg}
            alt={isLastVideo ? "replay" : isPlaying ? "pause" : "play"}
            /* on clicking the button the handleProcess funtion is called which resets the sequence if the  it is the last video of the carousel
            else if video isPlaying then it pauses the video else if it not playing then it plays the video */
            onClick={
              isLastVideo
                ? () => handleProcess("video-reset")
                : isPlaying
                ? () => handleProcess("pause")
                : () => handleProcess("play")
            }
          />
        </button>
      </div>
    </>
  );
}
