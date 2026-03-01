// app/mypage/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import styles from './mypage.module.css';

export default function MyPage() {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [myOrders, setMyOrders] = useState<any[]>([]);
  const [myVegetables, setMyVegetables] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // データベースから擬似的に履歴を取ってくる
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. 注文履歴（先ほど作ったordersから取得）
        const ordersSnap = await getDocs(collection(db, "orders"));
        const ordersData = ordersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMyOrders(ordersData);

        // 2. 出品履歴（vegetablesから取得）
        const vegSnap = await getDocs(collection(db, "vegetables"));
        const vegData = vegSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMyVegetables(vegData);
      } catch (error) {
        console.error("データ取得エラー:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>マイページ</h1>

      {/* プロフィールカード（ゲストモード） */}
      <div className={styles.profileCard}>
        <div className={styles.avatar}>🧑‍🌾</div>
        <div className={styles.profileInfo}>
          <h2>ゲストユーザー <span className={styles.badge}>お試し体験中</span></h2>
          <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>
            現在はログインなしのデモモードです。アプリでの出品・購入の流れを体験できます。
          </p>
          <div className={styles.stats}>
            <div className={styles.statItem}>
              <span>貢献したフードロス削減</span>
              <strong>{myOrders.length * 5} kg</strong>
            </div>
            <div className={styles.statItem}>
              <span>現在の出品数</span>
              <strong>{myVegetables.length} 件</strong>
            </div>
          </div>
        </div>
      </div>

      {/* タブ切り替え */}
      <div className={styles.tabs}>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'buy' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('buy')}
        >
          📦 購入履歴
        </button>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'sell' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('sell')}
        >
          🥬 出品した野菜
        </button>
      </div>

      {/* 読み込み中 */}
      {isLoading && <p style={{ textAlign: 'center', padding: '40px', color: '#666' }}>データを読み込み中...</p>}

      {/* 購入履歴タブの中身 */}
      {!isLoading && activeTab === 'buy' && (
        <div className={styles.historyList}>
          {myOrders.length > 0 ? (
            myOrders.map((order) => (
              <div key={order.id} className={styles.historyCard}>
                <div className={styles.historyImage}>📦</div>
                <div className={styles.historyInfo}>
                  <h3 className={styles.historyTitle}>{order.itemName || '規格外野菜'}</h3>
                  <p className={styles.historyMeta}>
                    購入額: ¥{order.price} / 販売元: {order.farmerName || '不明'}
                  </p>
                </div>
                <div className={styles.historyStatus}>{order.status || '処理中'}</div>
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>
              <p>まだ購入履歴がありません。</p>
              <Link href="/search" style={{ color: '#00A040', fontWeight: 'bold' }}>野菜を探しに行く →</Link>
            </div>
          )}
        </div>
      )}

      {/* 出品履歴タブの中身 */}
      {!isLoading && activeTab === 'sell' && (
        <div className={styles.historyList}>
          {myVegetables.length > 0 ? (
            myVegetables.map((veg) => (
              <Link href={`/item/${veg.id}`} key={veg.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className={styles.historyCard}>
                  <img src={veg.image || "https://placehold.jp/150x150.png"} alt={veg.name} className={styles.historyImage} />
                  <div className={styles.historyInfo}>
                    <h3 className={styles.historyTitle}>{veg.name}</h3>
                    <p className={styles.historyMeta}>
                      販売価格: ¥{veg.price} / 在庫: {veg.stock}
                    </p>
                  </div>
                  <div className={styles.historyStatus} style={{ background: '#FFF3E0', color: '#E65100' }}>
                    {veg.status || '審査中'}
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className={styles.emptyState}>
              <p>まだ出品した野菜がありません。</p>
              <Link href="/sell" style={{ color: '#00A040', fontWeight: 'bold' }}>野菜を出品する →</Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}