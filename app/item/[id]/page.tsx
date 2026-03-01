// app/item/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import styles from './item.module.css';
import Link from 'next/link';

// データの型
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
  description: string;
  status?: string;
};

export default function ItemDetailPage() {
  const params = useParams(); // URLから[id]の部分を取得する魔法のフック
  const router = useRouter(); // ページ移動に使うフック
  
  const [vegetable, setVegetable] = useState<Vegetable | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVegetable = async () => {
      try {
        const id = params.id as string;
        // 特定のIDのデータだけを狙い撃ちで取得
        const docRef = doc(db, "vegetables", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setVegetable({ id: docSnap.id, ...docSnap.data() } as Vegetable);
        } else {
          console.log("データが見つかりません");
        }
      } catch (error) {
        console.error("エラー:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchVegetable();
    }
  }, [params.id]);

  if (isLoading) return <div style={{ textAlign: 'center', padding: '100px' }}>読み込み中...</div>;
  if (!vegetable) return <div style={{ textAlign: 'center', padding: '100px' }}>商品が見つかりませんでした。</div>;

  const discountRate = Math.round((1 - vegetable.price / vegetable.originalPrice) * 100);
  const statusLabel = vegetable.status || '審査中';

  return (
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={() => router.back()}>
        ← 検索結果に戻る
      </button>

      <div className={styles.content}>
        {/* 左側：画像 */}
        <div className={styles.imageSection}>
          <img 
            src={vegetable.image || "https://placehold.jp/24/cccccc/ffffff/800x600.png?text=NoImage"} 
            alt={vegetable.name} 
            className={styles.mainImage} 
          />
        </div>

        {/* 右側：詳細情報 */}
        <div className={styles.infoSection}>
          <div className={styles.badges}>
            <span className={styles.badge} style={{ backgroundColor: '#E53935' }}>{discountRate}% OFF</span>
            <span className={styles.badge} style={{ backgroundColor: statusLabel === '販売中' ? '#00A040' : '#FF9800' }}>{statusLabel}</span>
            <span className={styles.badge} style={{ backgroundColor: '#1E88E5' }}>{vegetable.category}</span>
          </div>

          <h1 className={styles.title}>{vegetable.name}</h1>

          <div className={styles.priceBox}>
            <p className={styles.originalPrice}>通常価格 ¥{vegetable.originalPrice}</p>
            <p className={styles.price}>
              ¥{vegetable.price} <span className={styles.priceUnit}>/ kg (税込)</span>
            </p>
            <p style={{ margin: '8px 0 0 0', color: '#666', fontSize: '14px' }}>在庫（出品数量）: 残り {vegetable.stock}</p>
          </div>

          <div>
            <span className={styles.sectionTitle}>規格外の理由</span>
            <p className={styles.description}>⚠️ {vegetable.tag}</p>
          </div>

          <div>
            <span className={styles.sectionTitle}>商品説明</span>
            <p className={styles.description}>{vegetable.description || "説明がありません。"}</p>
          </div>

          <div className={styles.farmerBox}>
            <h3 style={{ margin: '0 0 12px 0', color: '#00A040' }}>👨‍🌾 農家さん情報</h3>
            <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>{vegetable.farmer}</p>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>📍 所在地: {vegetable.location}</p>
          </div>

{/* button を Link に変えて href を指定！ ※Linkのインポートを忘れずに！ */}
          <Link href={`/checkout/${vegetable.id}`} style={{ textDecoration: 'none' }}>
            <button className={styles.buyBtn}>
              購入手続きへ進む
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}