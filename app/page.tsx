// app/page.tsx
'use client'; 

import Link from "next/link";
import styles from "./page.module.css";
// import Image from 'next/image' // もしNext.jsのImageコンポーネントを使わない場合はコメントアウトでOKです

export default function HomePage() {
  return (
    <div>
      {/* ===== 1. 緑のヒーローセクション ===== */}
      <section className={styles.heroSection}>
        <div className={styles.heroText}>
          <span style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '6px 12px', borderRadius: '20px', fontSize: '12px' }}>
            地球100億人時代を救う
          </span>
          <h2>佐賀から世界を救う<br />農業マッチング</h2>
          <p style={{ lineHeight: '1.8', opacity: 0.9 }}>
            規格外野菜を有効活用し、食糧危機に立ち向かう。<br />
            農家と消費者をつなぐ、持続可能な未来を創造します。
          </p>
          <Link href="/search" className={styles.heroBtn}>
            野菜を探す →
          </Link>
        </div>
        
        <div style={{ flex: 1, textAlign: 'right' }}>
          <img 
            src="/ホーム.png"
            alt="規格外野菜" 
            style={{ borderRadius: '24px', maxWidth: '100%', height: 'auto', boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}
          />
        </div>
      </section>

      {/* ===== 2. 私たちが解決する社会課題セクション ===== */}
      <section className={styles.issuesSection}>
        <h2 style={{ fontSize: '28px', color: '#333' }}>私たちが解決する社会課題</h2>
        <p style={{ color: '#666', marginTop: '10px' }}>持続可能な農業のために、私たちが取り組んでいることです</p>
        
        <div className={styles.issuesCards}>
          <div className={styles.issueCard}>
            <h4 style={{ color: '#E53935', fontSize: '18px', marginBottom: '10px' }}>人口増加と食糧危機</h4>
            <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
              2050年には世界の人口が100億人を突破。深刻化する食糧不足に対して、廃棄されるはずだった野菜を救います。
            </p>
          </div>
          <div className={styles.issueCard}>
            <h4 style={{ color: '#FB8C00', fontSize: '18px', marginBottom: '10px' }}>規格外野菜の廃棄</h4>
            <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
              形が少し曲がっていたり、サイズが不揃いなだけで、味は変わらない美味しい野菜が大量に廃棄されている現状を変えます。
            </p>
          </div>
          <div className={styles.issueCard}>
            <h4 style={{ color: '#1E88E5', fontSize: '18px', marginBottom: '10px' }}>農家の収入減少</h4>
            <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
              丹精込めて育てた野菜を適切な価格で販売できるルートを提供し、農家の方々の安定した収入向上に貢献します。
            </p>
          </div>
        </div>
      </section>

      {/* ===== 3. 私たちのソリューション ===== */}
      <section className={styles.solutionSection}>
        <h2 style={{ fontSize: '28px', color: '#333' }}>私たちのソリューション</h2>
        <p style={{ color: '#666', marginTop: '10px' }}>テクノロジーと農業をかけ合わせ、持続可能な未来へ</p>
        
        <div className={styles.solutionContent}>
          <div className={styles.solutionImage}>
            <img src="/農園.png" alt="佐賀の農園" />
          </div>
          <div className={styles.solutionList}>
            <div className={styles.solutionItem}>
              <div className={styles.solutionIcon}>🤝</div>
              <div>
                <h4 style={{ fontSize: '18px', margin: '0 0 8px' }}>規格外野菜のマッチング</h4>
                <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>形が不揃いなだけで品質は変わらない野菜を、安くで直接お届けします。</p>
              </div>
            </div>
            <div className={styles.solutionItem}>
              <div className={styles.solutionIcon}>📈</div>
              <div>
                <h4 style={{ fontSize: '18px', margin: '0 0 8px' }}>農家の収入向上</h4>
                <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>廃棄ゼロへ。作物を通じた新たな収入源を確保し、農業をより魅力的なものに。</p>
              </div>
            </div>
            <div className={styles.solutionItem}>
              <div className={styles.solutionIcon}>♻️</div>
              <div>
                <h4 style={{ fontSize: '18px', margin: '0 0 8px' }}>フードロス削減</h4>
                <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>食品廃棄物を削減し、環境負荷を抑え、SDGsの目標達成に貢献します。</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 4. AI搭載レシピ提案 ===== */}
      <section className={styles.recipeSection}>
        <h2 style={{ fontSize: '28px', color: '#333' }}>AI搭載レシピ提案</h2>
        <p style={{ color: '#666', marginTop: '10px' }}>規格外野菜を無駄なく、AIが最適化したレシピをご提案</p>
        
        <div className={styles.recipeCards}>
          <div className={styles.recipeCard}>
            <img src="https://placehold.jp/24/ffb6b9/ffffff/400x300.png?text=トマトパスタ" alt="パスタ" className={styles.recipeImage} />
            <div className={styles.recipeInfo}>
              <h4 className={styles.recipeTitle}>規格外トマトの濃厚トマトパスタ</h4>
              <p className={styles.recipeDesc}>形が不揃いなトマトでも、完熟の甘みが広がる本格的なトマトソースパスタ。</p>
              <div className={styles.recipeMeta}>
                <span>⏱ 25分</span>
                <span>👨‍👩‍👧‍👦 2人前</span>
                <span>🍅 トマト</span>
              </div>
            </div>
          </div>
          <div className={styles.recipeCard}>
            <img src="https://placehold.jp/24/ffdfba/ffffff/400x300.png?text=人参スープ" alt="スープ" className={styles.recipeImage} />
            <div className={styles.recipeInfo}>
              <h4 className={styles.recipeTitle}>曲がり人参のポタージュスープ</h4>
              <p className={styles.recipeDesc}>曲がった人参も、スープにすれば形は関係なし。優しい甘さのポタージュ。</p>
              <div className={styles.recipeMeta}>
                <span>⏱ 30分</span>
                <span>👨‍👩‍👧‍👦 4人前</span>
                <span>🥕 人参</span>
              </div>
            </div>
          </div>
          <div className={styles.recipeCard}>
            <img src="https://placehold.jp/24/baffc9/ffffff/400x300.png?text=きゅうりの浅漬け" alt="浅漬け" className={styles.recipeImage} />
            <div className={styles.recipeInfo}>
              <h4 className={styles.recipeTitle}>曲がりきゅうりの即席浅漬け</h4>
              <p className={styles.recipeDesc}>曲がったきゅうりこそ、味が染み込みやすい！簡単で美味しい浅漬け。</p>
              <div className={styles.recipeMeta}>
                <span>⏱ 10分</span>
                <span>👨‍👩‍👧‍👦 2人前</span>
                <span>🥒 きゅうり</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.recipeBtnWrapper}>
          <Link href="/recipe" className={styles.recipeBtn}>
            すべてのレシピを見る ✨
          </Link>
        </div>
      </section>

      {/* ===== 5. 今すぐ始めよう（CTA） ===== */}
      <section className={styles.ctaSection}>
        <h2 style={{ fontSize: '32px', margin: '0 0 16px' }}>今すぐ始めよう</h2>
        <p style={{ fontSize: '16px', opacity: 0.9 }}>あなたも持続可能な社会の実現に参加しませんか？</p>
        <div className={styles.ctaButtons}>
          <Link href="/search" className={styles.btnPrimary}>野菜を探す</Link>
          <Link href="/sell" className={styles.btnOutline}>出品する</Link>
        </div>
      </section>
    </div>
  );
}