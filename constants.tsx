import { FaInstagram, FaTwitch, FaTwitter, FaYoutube } from "react-icons/fa";
import { PiGlobe } from "react-icons/pi";
import { BsBalloon } from "react-icons/bs";

// Block Chain Network
export const NETWORK_URI = "http://localhost:7545";
export const NETWORK_MAINNET = BigInt(1);
export const NETWORK_SEPOLIA = BigInt(11155111);

// API SERVER
export const SERVER_NAME = "http://localhost:3000";

// AWS Info
export const S3_IMAGES_URL =
  "https://cuniverse-images.s3.ap-northeast-2.amazonaws.com";

// Need Connect Wallet Pages/API
export const ACCOUNT_PAGES = ["/account", "/collections"];
export const ACCOUNT_API = ["/api/accounts/info"];

// Default Account Images
export const DEFAULT_BANNER =
  "https://cuniverse-images.s3.ap-northeast-2.amazonaws.com/images/1690337820720.jpg";
export const DEFAULT_PROFILE =
  "https://cuniverse-images.s3.ap-northeast-2.amazonaws.com/images/1690337935404.jpg";

// Platform Links
export const PLATFORM_LINKS: PlatformLink[] = [
  {
    platform: "website",
    icon: <PiGlobe />,
  },
  {
    platform: "instagram",
    icon: <FaInstagram />,
  },
  {
    platform: "youtube",
    icon: <FaYoutube />,
  },
  {
    platform: "twitter",
    icon: <FaTwitter />,
  },
  {
    platform: "twitch",
    icon: <FaTwitch />,
  },
  {
    platform: "afreecatv",
    icon: <BsBalloon />,
  },
];
