import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "MovieApp",
  description: "Explore movies with Next.js + TMDB API",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-white">
        <Navbar />
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}
