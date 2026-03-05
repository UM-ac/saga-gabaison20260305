// app/search/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import styles from "./search.module.css";
import Link from 'next/link';

type Vegetable = {
  id: string;
  name: string;
  category: string;
  farmer: string;
  location: string;
  tag: string;
  price: number;
  originalPrice: number;
  stock: string;
  image: string;
  status?: string;
};

// ★ 追加：名前から画像ファイル名を判定する関数
const getVegetableImage = (name: string, category: string, defaultImage: string) => {
  const lowerName = name.toLowerCase(); // 小文字に変換して判定しやすくする
  
  // 1. 名前に特定のキーワードが含まれているかチェック
  if (lowerName.includes('トマト')) return '/images/items/tomato.png';
  if (lowerName.includes('ナス') || lowerName.includes('なす')) return '/images/items/eggplant.png';
  if (lowerName.includes('ピーマン')) return '/images/items/pepper.png';
  if (lowerName.includes('キャベツ')) return '/images/items/cabbage.png';
  if (lowerName.includes('じゃがいも') || lowerName.includes('ポテト')) return '/images/items/potato.png';
  if (lowerName.includes('人参') || lowerName.includes('にんじん')) return '/images/items/carrot.png';
  if (lowerName.includes('バナナ')) return '/images/items/banana.png';
  if (lowerName.includes('ブロッコリー')) return '/images/items/broccoli.png';
  if (lowerName.includes('玉ねぎ') || lowerName.includes('タマネギ') || lowerName.includes('たまねぎ')) return '/images/items/onion.png';
  if (lowerName.includes('かぼちゃ') || lowerName.includes('カボチャ')) return '/images/items/pumpkin.png';
  if (lowerName.includes('大根') || lowerName.includes('だいこん')) return '/images/recipe/daikon.png'; // ※大根はレシピ用の画像を使用
  if (lowerName.includes('きゅうり') || lowerName.includes('キュウリ')) return '/images/recipe/pickle.png'; // ※きゅうりはレシピ用の画像を使用

  // 2. キーワードに引っかからなかった場合は、カテゴリーで判定
  if (category === '果菜類') return '/images/items/tomato.png'; // 果菜類の代表としてトマト
  if (category === '根菜類') return '/images/items/carrot.png'; // 根菜類の代表として人参
  if (category === '葉菜類') return '/images/items/cabbage.png'; // 葉菜類の代表としてキャベツ
  
  return defaultImage; // それでもダメなら元の画像（NoImage）
};


export default function SearchPage() {
  const [vegetables, setVegetables] = useState<Vegetable[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    const fetchVegetables = async () => {
      try {
        const q = query(collection(db, "vegetables"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        const vegData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        })) as Vegetable[];
        
        setVegetables(vegData);
      } catch (error) {
        console.error("データの取得に失敗しました:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVegetables();
  }, []);

  const filteredVegetables = vegetables.filter((veg) => {
    const matchSearch = searchTerm === '' || 
      veg.name.includes(searchTerm) || 
      veg.farmer.includes(searchTerm) || 
      veg.location.includes(searchTerm);

    const matchCategory = selectedCategory === '' || veg.category === selectedCategory;

    const currentStatus = veg.status || '審査中'; 
    const matchStatus = selectedStatus === '' || currentStatus === selectedStatus;

    return matchSearch && matchCategory && matchStatus;
  });

  return (
    <div className={styles.container}>
      <h2 className={styles.pageTitle}>規格外野菜を探す</h2>
      <p className={styles.pageSubtitle}>佐賀の農家が丹精込めて育てた、美味しい規格外野菜をお得に購入できます</p>

      {/* ===== 検索フィルター ===== */}
      <div className={styles.filterSection}>
        <input 
          type="text" 
          placeholder="🔍 野菜名、農家名、地域で検索..." 
          className={styles.searchInput} 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
        
        <select 
          className={styles.categorySelect} 
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)} 
        >
          <option value="">▽ すべてのカテゴリー</option>
          <option value="果菜類">果菜類</option>
          <option value="根菜類">根菜類</option>
          <option value="葉菜類">葉菜類</option>
        </select>

        <select 
          className={styles.categorySelect} 
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)} 
        >
          <option value="">▽ すべての状態</option>
          <option value="販売中">販売中</option>
          <option value="審査中">審査中</option>
        </select>
      </div>

      {isLoading ? (
        <p style={{ textAlign: 'center', padding: '40px', color: '#666' }}>データを読み込み中...</p>
      ) : (
        <>
          <p className={styles.resultCount}>{filteredVegetables.length}件の野菜が見つかりました</p>

          <div className={styles.grid}>
            {filteredVegetables.map((veg) => {
              const discountRate = Math.round((1 - veg.price / veg.originalPrice) * 100);
              const statusLabel = veg.status || '審査中';

              // ★ 魔法の関数を使って画像を決定する
              let displayImage = veg.image || "https://placehold.jp/24/cccccc/ffffff/400x300.png?text=NoImage";
              if (statusLabel === '販売中') {
                displayImage = getVegetableImage(veg.name, veg.category, displayImage);
              }

              return (
                <Link 
                  href={`/item/${veg.id}`} 
                  key={veg.id} 
                  className={styles.card}
                  style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                >
                  <div className={styles.discountBadge}>{discountRate}% OFF</div>
                  <div style={{ position: 'absolute', top: 12, left: 12, backgroundColor: statusLabel === '販売中' ? '#00A040' : '#FF9800', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                    {statusLabel}
                  </div>

                  <img src={displayImage} alt={veg.name} className={styles.cardImage} />
                  
                  <div className={styles.cardContent}>
                    <div className={styles.cardHeader}>
                      <h3 className={styles.vegetableName}>{veg.name}</h3>
                      <span className={styles.category}>{veg.category}</span>
                    </div>
                    
                    <div className={styles.farmerInfo}>
                      📍 {veg.farmer} / {veg.location}
                    </div>
                    
                    <div className={styles.tag}>
                      🏷 {veg.tag}
                    </div>
                    
                    <div className={styles.priceRow}>
                      <div>
                        <p className={styles.originalPrice}>通常価格 ¥{veg.originalPrice}</p>
                        <p className={styles.price}>
                          ¥{veg.price} <span className={styles.priceUnit}>/ kg</span>
                        </p>
                      </div>
                      <div className={styles.stock}>
                        残り {veg.stock}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {filteredVegetables.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#666' }}>
              <p>条件に一致する野菜が見つかりませんでした。</p>
              <p>別のキーワードやカテゴリーでお試しください。</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}