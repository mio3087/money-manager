
import "./globals.css";

export const metadata = {
  title: "Money Manager",
  description: "楽しく、心地よく、お金を管理するパーソナルマネーアプリ",
  applicationName: "Money Manager",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f7f8f6",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body className="money-manager-body">
        {children}
      </body>
    </html>
  );
}
