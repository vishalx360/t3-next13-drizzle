import "./globals.css";

import { TrpcProvider } from "@/utils/trpc-provider";

import AuthProvider from "../context/AuthProvider";

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <TrpcProvider>
            {children}
          </TrpcProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
