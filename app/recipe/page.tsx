// app/recipe/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
// import { toPng } from 'html-to-image'; // ★ 追加：npm install html-to-image が必要
import Link from 'next/link'; // ★ Linkをインポート
import styles from "./recipe.module.css";
import { initialRecipes } from '@/lib/recipes'; // ★ 外部ファイルに分けたレシピデータを読み込む

// 待ち時間に表示する豆知識リスト
const TRIVIA_LIST = [
  "💡 豆知識: 曲がったきゅうりは、水分ストレスなどで甘みが増していることがあります！",
  "💡 豆知識: 日本では年間約200万トンもの規格外野菜が廃棄されています。",
  "💡 豆知識: 傷があるトマトは、自分を治そうとして旨み成分を増やす性質があります。",
  "💡 豆知識: 二股の人参は、栄養たっぷりのふかふかな土壌で元気に育った証拠です。",
  "💡 豆知識: 規格外野菜を食べることは、CO2削減や農家さんの支援に直結します！",
  "🍳 AIがレシピを一生懸命考えています... もう少々お待ちください..."
];

type GeneratedRecipe = {
  title: string;
  time: string;
  ingredients: string[];
  steps: string[];
  point: string;
};

export default function RecipePage() {

  // const recipeRef = useRef<HTMLDivElement>(null);

  // const downloadRecipeImage = async () => {
  //   if (!recipeRef.current) return;
  //   try {
  //     const dataUrl = await toPng(recipeRef.current, { 
  //       cacheBust: true,
  //       backgroundColor: '#ffffff', // 背景を白にする
  //       style: { borderRadius: '16px' } // 保存画像も角丸に
  //     });
  //     const link = document.createElement('a');
  //     link.download = `${generatedRecipe?.title || 'recipe'}.png`;
  //     link.href = dataUrl;
  //     link.click();
  //   } catch (err) {
  //     console.error('保存に失敗しました', err);
  //   }
  // };

  const [ingredients, setIngredients] = useState('');
  const [generatedRecipe, setGeneratedRecipe] = useState<GeneratedRecipe | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [triviaIndex, setTriviaIndex] = useState(0);

  // 既存レシピの検索用ステート
  const [recipeSearch, setRecipeSearch] = useState('');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      interval = setInterval(() => {
        setTriviaIndex((prev) => (prev + 1) % TRIVIA_LIST.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleGenerate = async () => {
    if (!ingredients) {
      alert("野菜の名前を入力してください！");
      return;
    }
    setIsGenerating(true);
    setGeneratedRecipe(null);
    setTriviaIndex(0);

    try {
      const response = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients }),
      });
      const data = await response.json();
      if (response.ok) {
        setGeneratedRecipe(data.recipe);
      } else {
        alert(data.error || "エラーが発生しました");
      }
    } catch (error) {
      console.error(error);
      alert("通信エラーが発生しました");
    } finally {
      setIsGenerating(false);
    }
  };

  // ★ 読み込んだ initialRecipes を使って絞り込みを行う
  const filteredRecipes = initialRecipes.filter(recipe => 
    recipe.title.includes(recipeSearch) || recipe.mainIngredient.includes(recipeSearch)
  );

  return(

    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}><span className={styles.pageTitleIcon}>✨</span> AI搭載レシピ提案</h2>
        <p className={styles.pageSubtitle}>規格外野菜を無駄なく美味しく活用！AIがあなたにぴったりのレシピを提案します。</p>
      </div>

      <div className={styles.features}>
         <div className={styles.featureCard}><div className={styles.featureIcon}>✨</div><h3 className={styles.featureTitle}>AI最適化レシピ</h3><p className={styles.featureDesc}>規格外野菜の特徴を活かした提案</p></div>
         <div className={styles.featureCard}><div className={styles.featureIcon}>🍳</div><h3 className={styles.featureTitle}>形を気にせず調理</h3><p className={styles.featureDesc}>不揃いでも美味しく作れる工夫</p></div>
         <div className={styles.featureCard}><div className={styles.featureIcon}>🔍</div><h3 className={styles.featureTitle}>簡単検索</h3><p className={styles.featureDesc}>あなたに合ったレシピをすぐに発見</p></div>
      </div>

      <div className={styles.generatorBanner}>
        <div className={styles.generatorContent}>
          <h2 className={styles.generatorTitle}>✨ AIレシピジェネレーター</h2>
          <p className={styles.generatorDesc}>お手持ちの野菜を入力すると、AIがレシピを生成します</p>
          <div className={styles.generatorInputGroup}>
            <input 
              type="text" 
              placeholder="例: 曲がった人参、小さいトマト" 
              className={styles.generatorInput} 
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              disabled={isGenerating}
            />
            <button type="button" className={styles.generatorBtn} onClick={handleGenerate} disabled={isGenerating}>
              {isGenerating ? "生成中..." : "レシピ生成"}
            </button>
          </div>
        </div>
      </div>

      {isGenerating && (
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#F3E5F5', borderRadius: '16px', marginBottom: '40px', border: '1px dashed #9C27B0' }}>
          <div style={{ fontSize: '32px', marginBottom: '16px', animation: 'spin 2s linear infinite' }}>⏳</div>
          <p style={{ fontSize: '16px', color: '#9C27B0', fontWeight: 'bold' }}>{TRIVIA_LIST[triviaIndex]}</p>
        </div>
      )}

      {generatedRecipe && !isGenerating && (
      //   <>
      //   {/* 1. 保存ボタン（カードの外側に配置） */}
      //   <div style={{ textAlign: 'right', marginBottom: '15px' }}>
      //     <button 
      //       onClick={downloadRecipeImage}
      //       className={styles.downloadBtn} // スタイルはCSSか直接指定で
      //       style={{
      //         backgroundColor: '#9C27B0',
      //         color: 'white',
      //         padding: '10px 20px',
      //         borderRadius: '30px',
      //         border: 'none',
      //         fontWeight: 'bold',
      //         cursor: 'pointer',
      //         boxShadow: '0 4px 12px rgba(156, 39, 176, 0.3)'
      //       }}
      //     >
      //       📸 レシピを画像で保存
      //     </button>
      //   </div>

      //   <div 
      // ref={recipeRef} 
      // style={{ backgroundColor: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 8px 24px rgba(156, 39, 176, 0.1)', marginBottom: '40px', border: '2px solid #9C27B0' }}>
        <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 8px 24px rgba(156, 39, 176, 0.1)', marginBottom: '40px', border: '2px solid #9C27B0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '2px solid #F3E5F5', paddingBottom: '16px', marginBottom: '24px' }}>
            <h3 style={{ color: '#9C27B0', fontSize: '24px', margin: 0 }}>✨ {generatedRecipe.title}</h3>
            <span style={{ backgroundColor: '#F3E5F5', color: '#9C27B0', padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold', fontSize: '14px' }}>⏱ {generatedRecipe.time}</span>
          </div>
          <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 200px' }}>
              <h4 style={{ color: '#333', fontSize: '18px', marginBottom: '16px' }}>🛒 材料</h4>
              <ul style={{ paddingLeft: '20px', lineHeight: '1.8', color: '#666' }}>
                {generatedRecipe.ingredients.map((item, idx) => <li key={idx}>{item}</li>)}
              </ul>
            </div>
            <div style={{ flex: '2 1 300px' }}>
              <h4 style={{ color: '#333', fontSize: '18px', marginBottom: '16px' }}>🍳 作り方</h4>
              <ol style={{ paddingLeft: '20px', lineHeight: '1.8', color: '#666' }}>
                {generatedRecipe.steps.map((step, idx) => <li key={idx} style={{ marginBottom: '8px' }}>{step}</li>)}
              </ol>
              <div style={{ backgroundColor: '#FFF8E1', padding: '16px', borderRadius: '8px', marginTop: '24px' }}>
                <h5 style={{ color: '#F57F17', margin: '0 0 8px 0', fontSize: '16px' }}>💡 規格外野菜を活かすポイント</h5>
                <p style={{ color: '#333', margin: 0, fontSize: '14px', lineHeight: '1.6' }}>{generatedRecipe.point}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={styles.searchSection}>
        <input 
          type="text" 
          placeholder="🔍 既存レシピを名前や野菜名で検索..." 
          className={styles.searchInput}
          value={recipeSearch}
          onChange={(e) => setRecipeSearch(e.target.value)}
        />
      </div>

      <p className={styles.resultCount}>{filteredRecipes.length}件のレシピが見つかりました</p>
      
      <div className={styles.grid}>
        {filteredRecipes.map((recipe) => (
          
          <Link 
            href={`/recipe/${recipe.id}`} 
            key={recipe.id} 
            className={styles.card}
            style={{ textDecoration: 'none', color: 'inherit', display: 'block' }} 
          >
            <div className={styles.badges}>
              <span className={styles.badgeAi}>✨ おすすめ</span>
              <span className={styles.badgeTag}>{recipe.tag}</span>
            </div>
            <img src={recipe.image} alt={recipe.title} className={styles.cardImage} />
            <div className={styles.cardContent}>
              <h3 className={styles.recipeTitle}>{recipe.title}</h3>
              <p className={styles.recipeDesc}>{recipe.desc}</p>
              <div className={styles.recipeMeta}>
                <span>⏱ {recipe.time}</span>
                <span>👨‍👩‍👧‍👦 {recipe.servings}</span>
                <span>🥕 {recipe.mainIngredient}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}