"use client";

import Link from "next/link";
import ImageCuniverse from "../common/ImageCuniverse";
import { S3_IMAGES_URL } from "../../../constants";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import {
  DOMAttributes,
  TouchEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";

interface ContainerHomeBannerProps {
  banners: Banner[];
}

function ContainerHomeBanner(props: ContainerHomeBannerProps) {
  const { banners } = props;

  const sliderEl = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);

  const handleBanner = (dir: string) => {
    if (
      !banners ||
      !sliderEl.current ||
      sliderEl.current.getAttribute("moving") === "true"
    )
      return;

    const children = sliderEl.current.children;

    let nextEl: Node | null = null;
    let idx = 0;
    if (dir == "left") {
      nextEl = children[children.length - 1].cloneNode(true);
      sliderEl.current.prepend(nextEl);
      sliderEl.current.style.transition = "unset";
      sliderEl.current.style.left = "-100%";
      idx = children.length - 1;
    } else {
      nextEl = children[0].cloneNode(true);
      sliderEl.current.appendChild(nextEl);
      sliderEl.current.style.transition = "all 0.5s ease 0s";
      sliderEl.current.style.left = "-100%";
    }

    setTimeout(() => {
      if (!sliderEl.current) return;
      sliderEl.current.setAttribute("moving", "true");
      if (dir == "left")
        (sliderEl.current.style.transition = "all 0.5s ease 0s"),
          (sliderEl.current.style.left = "0");
    }, 0);

    setTimeout(() => {
      if (!sliderEl.current) return;
      sliderEl.current.children[idx].remove();
      if (dir == "right")
        (sliderEl.current.style.transition = "unset"),
          (sliderEl.current.style.left = "0");

      sliderEl.current.setAttribute("moving", "false");
    }, 500);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e && e.nativeEvent && e.nativeEvent.touches[0]) {
      touchStartX.current = e.nativeEvent.touches[0].clientX;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e && e.nativeEvent && e.nativeEvent.changedTouches[0]) {
      if (touchStartX.current - e.nativeEvent.changedTouches[0].clientX > 0)
        handleBanner("right");
      else handleBanner("left");
    }
  };

  return (
    <div className="container-home-banner">
      <div
        ref={sliderEl}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {banners.map((banner) => {
          return (
            <Link
              href={banner.link}
              key={`home-banner-${banner.id}`}
              style={{
                backgroundColor: banner.background,
              }}
            >
              <div>
                <ImageCuniverse
                  src={S3_IMAGES_URL + "/images/" + banner.image}
                  alt="link-banner"
                  width={1080}
                  height={450}
                />
              </div>
            </Link>
          );
        })}
      </div>
      {banners.length > 1 ? (
        <>
          <button
            className="slider-button left"
            onClick={() => handleBanner("left")}
          >
            <FiChevronLeft />
          </button>
          <button
            className="slider-button right"
            onClick={() => handleBanner("right")}
          >
            <FiChevronRight />
          </button>
        </>
      ) : null}
    </div>
  );
}

export default ContainerHomeBanner;
