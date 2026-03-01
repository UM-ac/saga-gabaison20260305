// app/page.tsx
'use client'; 

import { useState, useEffect } from 'react';
import Link from "next/link";
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import styles from "./page.module.css";

export default function HomePage() {
  const [vegCount, setVegCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const snapshot = await getDocs(collection(db, "vegetables"));
        setVegCount(snapshot.size);
      } catch (error) {
        console.error("出品数の取得に失敗しました:", error);
      }
    };

    fetchCount();
  }, []);

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
            src="https://placehold.jp/24/cccccc/ffffff/500x600.png?text=HeroImage" 
            alt="規格外野菜" 
            style={{ borderRadius: '24px', maxWidth: '100%', height: 'auto', boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}
          />
        </div>
      </section>

      {/* ===== 2. 100億人の未来を救う実績セクション（融合版！） ===== */}
      <section className={styles.statsSection} style={{ backgroundColor: '#1A3622', color: 'white', padding: '60px 5%' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '32px', margin: '0 0 16px 0', color: '#4CAF50' }}>PROJECT: 100 BILLION</h2>
          <p style={{ fontSize: '16px', opacity: 0.9, maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
            2050年、世界の人口は100億人を突破します。<br/>
            私たちが規格外野菜を救うごとに、未来の食卓と地球環境が守られます。
          </p>
        </div>

        {/* コミュニティ全体の貢献度メーター */}
        <div style={{ maxWidth: '800px', margin: '0 auto 40px auto', background: 'rgba(255,255,255,0.1)', padding: '24px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontWeight: 'bold' }}>未来へ届けた食糧（推計）</span>
            <span style={{ color: '#4CAF50', fontWeight: 'bold', fontSize: '20px' }}>{vegCount * 5 * 3} 食分</span>
          </div>
          <div style={{ width: '100%', height: '12px', background: 'rgba(255,255,255,0.2)', borderRadius: '6px', overflow: 'hidden' }}>
            <div style={{ width: `${Math.min(((vegCount * 5 * 3) / 10000) * 100, 100)}%`, height: '100%', background: '#4CAF50', transition: 'width 1s ease' }}></div>
          </div>
          <p style={{ textAlign: 'right', fontSize: '12px', opacity: 0.7, margin: '8px 0 0 0' }}>
            目標: 10,000食まで あと{Math.max(10000 - (vegCount * 5 * 3), 0)}食
          </p>
        </div>

        {/* 3つの環境インパクト */}
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '24px', borderRadius: '12px', flex: '1 1 200px', textAlign: 'center', border: '1px solid rgba(76, 175, 80, 0.3)' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>⚖️</div>
            <h3 style={{ fontSize: '28px', margin: '0 0 4px 0', color: '#FFF' }}>{vegCount * 5} <span style={{fontSize: '16px'}}>kg</span></h3>
            <p style={{ fontSize: '12px', color: '#AAA', margin: 0 }}>救ったフードロス</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '24px', borderRadius: '12px', flex: '1 1 200px', textAlign: 'center', border: '1px solid rgba(76, 175, 80, 0.3)' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>☁️</div>
            <h3 style={{ fontSize: '28px', margin: '0 0 4px 0', color: '#FFF' }}>{vegCount * 5 * 2.5} <span style={{fontSize: '16px'}}>kg</span></h3>
            <p style={{ fontSize: '12px', color: '#AAA', margin: 0 }}>削減したCO2排出量</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '24px', borderRadius: '12px', flex: '1 1 200px', textAlign: 'center', border: '1px solid rgba(76, 175, 80, 0.3)' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>💧</div>
            <h3 style={{ fontSize: '28px', margin: '0 0 4px 0', color: '#FFF' }}>{(vegCount * 5 * 2000).toLocaleString()} <span style={{fontSize: '16px'}}>L</span></h3>
            <p style={{ fontSize: '12px', color: '#AAA', margin: 0 }}>節約した水資源</p>
          </div>
        </div>
      </section>

      {/* ===== 3. 私たちが解決する社会課題セクション ===== */}
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

      {/* ===== 4. 私たちのソリューション ===== */}
      <section className={styles.solutionSection}>
        <h2 style={{ fontSize: '28px', color: '#333' }}>私たちのソリューション</h2>
        <p style={{ color: '#666', marginTop: '10px' }}>テクノロジーと農業をかけ合わせ、持続可能な未来へ</p>
        
        <div className={styles.solutionContent}>
          <div className={styles.solutionImage}>
            <img src="https://placehold.jp/24/cccccc/ffffff/600x400.png?text=農園の風景画像" alt="佐賀の農園" />
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

      {/* ===== 5. AI搭載レシピ提案 ===== */}
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

      {/* ===== 6. 今すぐ始めよう（CTA） ===== */}
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