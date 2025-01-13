import type { Metadata } from "next";
import "./globals.css";
import { Bebas_Neue, IBM_Plex_Sans  } from 'next/font/google'
import {ReactNode} from "react"
import { Toaster } from "@/components/ui/toaster"
import {SessionProvider} from "next-auth/react"
import { auth } from "@/auth";

const ibmPlexSans = IBM_Plex_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--ibm-plex-sans"
});

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: "--bebas-neue"
});

export const metadata: Metadata = {
  title: "BookWise",
  description: "BookWise is a book borrowing university management solution",
};

const RootLayout = async ({ children }: { children: ReactNode; }) => {
  const session = await auth();
  return (
    <html lang="en">
      <SessionProvider session = {session}>
        <body
          className={`${ibmPlexSans.className} ${bebasNeue.variable} antialiased`}
        >
          {children}
          <Toaster />
        </body>
      </SessionProvider>
    </html>
  );
}


export default RootLayout