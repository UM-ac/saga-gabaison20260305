// app/search/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import styles from "./search.module.css";
import Link from 'next/link';

// データの型（status を追加！）
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
  status?: string; // ★ 「販売中」や「審査中」などの状態を入れる箱
};

export default function SearchPage() {
  const [vegetables, setVegetables] = useState<Vegetable[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ★ 検索用の「状態（今何が入力されているか）」を覚えておく変数
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // ページが開かれた時にFirebaseからデータを取ってくる
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

  // ★ ここが超重要！「すべての野菜」から「条件に合う野菜」だけをリアルタイムで選び出す魔法
  const filteredVegetables = vegetables.filter((veg) => {
    // 1. 文字検索（野菜名 or 農家名 or 地域 に文字が含まれているか）
    const matchSearch = searchTerm === '' || 
      veg.name.includes(searchTerm) || 
      veg.farmer.includes(searchTerm) || 
      veg.location.includes(searchTerm);

    // 2. カテゴリー検索
    const matchCategory = selectedCategory === '' || veg.category === selectedCategory;

    // 3. 状態（ステータス）検索
    // ※過去に出品したデータにはstatusが入っていないので、仮に「審査中」として扱います
    const currentStatus = veg.status || '審査中'; 
    const matchStatus = selectedStatus === '' || currentStatus === selectedStatus;

    // 3つの条件「すべて」をクリアした野菜だけを画面に残す！
    return matchSearch && matchCategory && matchStatus;
  });

  return (
    <div className={styles.container}>
      <h2 className={styles.pageTitle}>規格外野菜を探す</h2>
      <p className={styles.pageSubtitle}>佐賀の農家が丹精込めて育てた、美味しい規格外野菜をお得に購入できます</p>

      {/* ===== 検索フィルター ===== */}
      <div className={styles.filterSection}>
        {/* 文字入力 */}
        <input 
          type="text" 
          placeholder="🔍 野菜名、農家名、地域で検索..." 
          className={styles.searchInput} 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
        
        {/* カテゴリー選択 */}
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

        {/* 状態（ステータス）選択 */}
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
      {/* ================================================= */}

      {isLoading ? (
        <p style={{ textAlign: 'center', padding: '40px', color: '#666' }}>データを読み込み中...</p>
      ) : (
        <>
          <p className={styles.resultCount}>{filteredVegetables.length}件の野菜が見つかりました</p>

          <div className={styles.grid}>
            {filteredVegetables.map((veg) => {
              const discountRate = Math.round((1 - veg.price / veg.originalPrice) * 100);
              const statusLabel = veg.status || '審査中';

              return (
                <Link 
                  href={`/item/${veg.id}`} 
                  key={veg.id} 
                  className={styles.card}
                  style={{ textDecoration: 'none', color: 'inherit', display: 'block' }} // ★リンクの線を消す
                >
                  <div className={styles.discountBadge}>{discountRate}% OFF</div>
                  <div style={{ position: 'absolute', top: 12, left: 12, backgroundColor: statusLabel === '販売中' ? '#00A040' : '#FF9800', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                    {statusLabel}
                  </div>

                  <img src={veg.image || "https://placehold.jp/24/cccccc/ffffff/400x300.png?text=NoImage"} alt={veg.name} className={styles.cardImage} />
                  
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