import { Nunito } from "next/font/google"
import "./globals.css";
import { AuthProvider } from "./components/sidebar/AuthContext";

export const metadata = {
  title: "Article AI Generater",
  description: "Article AI",
};

const font = Nunito({
  subsets: ["latin"]
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={font.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
