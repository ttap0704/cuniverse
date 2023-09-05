"use client";

import Link from "next/link";
import ImageCuniverse from "../common/ImageCuniverse";
import { S3_IMAGES_URL } from "../../../constants";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useEffect, useRef, useState } from "react";

interface ContainerHomeBannerProps {
  banners: Banner[];
}

function ContainerHomeBanner(props: ContainerHomeBannerProps) {
  const { banners } = props;

  const sliderEl = useRef<HTMLDivElement>(null);

  const handleBanner = (dir: string) => {
    if (!banners || !sliderEl.current) return;

    const children = sliderEl.current.children;

    if (dir == "left") {
      sliderEl.current.append(children[children.length - 1]);
    } else {
      sliderEl.current.before(children[0]);
    }
  };

  return (
    <div className="container-home-banner">
      <div style={{ width: banners.length + "00%" }} ref={sliderEl}>
        {banners.map((banner) => {
          return (
            <Link
              href={banner.link}
              key={`home-banner-${banner.id}`}
              style={{
                backgroundColor: banner.background,
                width: 100 / banners.length + "%",
              }}
            >
              <div>
                <ImageCuniverse
                  src={S3_IMAGES_URL + "/images/" + banner.image}
                  alt="link-banner"
                  fill={true}
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
