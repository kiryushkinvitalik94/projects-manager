"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import { Provider } from "react-redux";
import SecurePage from "app/secure-page/page";
import store from "store/store";
import { Header } from "components";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider store={store}>
          <Header />
          <SecurePage>{children}</SecurePage>
        </Provider>
      </body>
    </html>
  );
}
