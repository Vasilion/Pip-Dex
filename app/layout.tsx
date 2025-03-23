import "./globals.css";

export const metadata = {
  title: "Pip-Dex 3000",
  description: "A Fallout 3 inspired pokedex.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
