"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import TeacherLayout from "./components/Universal/TeacherLayout";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <title>ScholarNova | School Management Software</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Innovative School Management Software by ScholarNova" />
        <meta name="keywords" content="school software, management system, ScholarNova, education" />
        <meta name="author" content="ScholarNova" />
      </Head>
      <body className={inter.className}>
        <TeacherLayout>
          {children}
          <ToastContainer position="top-right" />
        </TeacherLayout>
      </body>
    </html>
  );
}
