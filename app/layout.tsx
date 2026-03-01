import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import styles from "./layout.module.css"; // ★追加

export const metadata: Metadata = {
  title: "佐賀農業マッチング",
  description: "地球100億人時代を救う、佐賀から世界を救う農業マッチング",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <header className={styles.header}> {}
          <div className={styles.headerLogo}>
            <Link href="/">
              <h1>佐賀農業マッチング</h1>
              <p>地球100億人時代を救う</p>
            </Link>
          </div>
          <nav className={styles.headerNav}>
            <Link href="/search">野菜を探す</Link>
            <Link href="/recipe">レシピ</Link>
            <Link href="/sell" className={styles.sellButton}>出品する</Link>
            <Link href="/mypage">マイページ</Link>
          </nav>
        </header>

        <main className={styles.mainContent}>
          {children}
        </main>

        <footer className={styles.footer}>
          <div className={styles.footerContent}>
            {/* ...中身はそのまま... */}
          </div>
          <div className={styles.footerBottom}>
            <p>© 2026 佐賀農業マッチング. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}