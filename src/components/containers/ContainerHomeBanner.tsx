"use client";

import Link from "next/link";
import ImageCuniverse from "../common/ImageCuniverse";
import { S3_IMAGES_URL } from "../../../constants";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useEffect, useState } from "react";

interface ContainerHomeBannerProps {
  banners: Banner[];
}

function ContainerHomeBanner(props: ContainerHomeBannerProps) {
  const { banners } = props;

  const [bannerIdx, setBannerIdx] = useState(0);
  const [currentBanner, setCurrentBanner] = useState<Banner | null>(null);

  useEffect(() => {
    if (banners[0]) setCurrentBanner(banners[0]);
  }, [banners]);

  const handleBanner = (dir: string) => {
    let curIdx = bannerIdx;
    if (dir == "left") curIdx--;
    else curIdx++;

    if (curIdx < 0) curIdx = banners.length - 1;
    else if (curIdx >= banners.length) curIdx = 0;

    setBannerIdx(curIdx);
    setCurrentBanner(banners[curIdx]);
  };

  return (
    <div className="container-home-banner">
      {currentBanner ? (
        <Link
          href={currentBanner.link}
          key={`home-banner-${currentBanner.id}`}
          style={{ backgroundColor: currentBanner.background }}
        >
          <div>
            <ImageCuniverse
              src={S3_IMAGES_URL + "/images/" + currentBanner.image}
              alt="link-banner"
              fill={true}
              objectFit={`cover`}
            />
          </div>
        </Link>
      ) : null}
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
