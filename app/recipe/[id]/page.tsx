// app/recipe/[id]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import { initialRecipes } from '@/lib/recipes'; // ★ さっき切り出したJSONデータを読み込む
import styles from './recipe-detail.module.css';

export default function RecipeDetailPage() {
  const params = useParams();
  const router = useRouter();
  
  // URLのIDと一致するレシピを配列から探し出す
  const recipe = initialRecipes.find((r) => r.id === params.id);

  // もし見つからなかった場合
  if (!recipe) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <h2>レシピが見つかりませんでした</h2>
        <button className={styles.backBtn} onClick={() => router.back()}>← 戻る</button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={() => router.back()}>
        ← レシピ一覧に戻る
      </button>

      {/* 上部：写真とタイトル */}
      <div className={styles.heroSection}>
        <img src={recipe.image} alt={recipe.title} className={styles.image} />
        <div className={styles.headerInfo}>
          <div className={styles.metaTags}>
            <span className={styles.tag}>⏱ {recipe.time}</span>
            <span className={styles.tag}>👨‍👩‍👧‍👦 {recipe.servings}</span>
            <span className={styles.tag} style={{ background: '#E8F5E9', color: '#2E7D32' }}>🥕 {recipe.mainIngredient}</span>
          </div>
          <h1 className={styles.title}>{recipe.title}</h1>
          <p className={styles.desc}>{recipe.desc}</p>
        </div>
      </div>

      {/* 下部：材料と作り方 */}
      <div className={styles.contentSection}>
        <div className={styles.ingredients}>
          <h2 className={styles.sectionTitle}>🛒 材料</h2>
          <ul className={styles.list}>
            {recipe.ingredients.map((item, idx) => (
              <li key={idx} style={{ borderBottom: '1px dashed #E0E0E0', paddingBottom: '8px', marginBottom: '8px' }}>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.steps}>
          <h2 className={styles.sectionTitle}>🍳 作り方</h2>
          <ol className={styles.list}>
            {recipe.steps.map((step, idx) => (
              <li key={idx} style={{ marginBottom: '16px' }}>{step}</li>
            ))}
          </ol>

          <div className={styles.pointBox}>
            <h3 className={styles.pointTitle}>💡 規格外野菜を活かすポイント</h3>
            <p style={{ margin: 0, color: '#444', lineHeight: 1.6 }}>{recipe.point}</p>
          </div>
        </div>
      </div>
    </div>
  );
}