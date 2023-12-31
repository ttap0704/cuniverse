import Header from "@/components/common/Header";
import "@/css/globals.scss";
import type { Metadata } from "next";
import Background from "@/components/common/Background";
import ProviderQueryClient from "@/components/providers/ProviderQueryClient";
import { Noto_Sans_KR } from "next/font/google";
import Tooltip from "@/components/common/Tooltip";
import ModalAlert from "@/components/modals/ModalAlert";
import { CUNIVERSE_METADATA } from "../../constants";

const notnSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});

export const metadata: Metadata = CUNIVERSE_METADATA;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={notnSansKR.className}>
      <body>
        <ProviderQueryClient>
          <Header />
          <Background />
          <div id="main-contents-container">{children}</div>
        </ProviderQueryClient>
        <Tooltip />
        <ModalAlert />
      </body>
    </html>
  );
}
