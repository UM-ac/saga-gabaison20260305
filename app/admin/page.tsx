// app/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, orderBy, query } from 'firebase/firestore';
import styles from './admin.module.css';

type Vegetable = {
  id: string;
  name: string;
  farmer: string;
  price: number;
  stock: string;
  status?: string;
  image: string;
};

export default function AdminPage() {
  const [vegetables, setVegetables] = useState<Vegetable[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // 1. 全ての出品データを取得する
  useEffect(() => {
    const fetchAllVegetables = async () => {
      try {
        const q = query(collection(db, "vegetables"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const vegData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Vegetable[];
        setVegetables(vegData);
      } catch (error) {
        console.error("データ取得エラー:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllVegetables();
  }, []);

  // 2. 「承認して販売開始」ボタンを押したときの処理
  const handleApprove = async (id: string) => {
    // 確認アラートを出す
    if (!window.confirm("この野菜の審査を完了し、「販売中」に変更しますか？")) return;

    setProcessingId(id); // ボタンを「処理中」にするための目印

    try {
      // Firebaseのデータを「販売中」に上書き更新する！
      const vegRef = doc(db, "vegetables", id);
      await updateDoc(vegRef, {
        status: "販売中"
      });

      // 画面の見た目も「販売中」にサクッと切り替える（再読み込み不要）
      setVegetables(prev => prev.map(veg => 
        veg.id === id ? { ...veg, status: "販売中" } : veg
      ));

      alert("販売を開始しました！");
    } catch (error) {
      console.error("更新エラー:", error);
      alert("エラーが発生しました。");
    } finally {
      setProcessingId(null);
    }
  };

  if (isLoading) return <div style={{ textAlign: 'center', padding: '100px' }}>読み込み中...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>👑 管理者ダッシュボード</h1>
        <span className={styles.dangerBadge}>※関係者外秘</span>
      </div>

      <p style={{ color: '#666', marginBottom: '24px' }}>
        出品された野菜の審査とステータス管理を行います。
      </p>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>商品情報</th>
              <th>農家名</th>
              <th>価格</th>
              <th>現在の状態</th>
              <th>アクション</th>
            </tr>
          </thead>
          <tbody>
            {vegetables.map((veg) => {
              // statusがない古いデータは「審査中」扱いにする
              const currentStatus = veg.status || '審査中';
              const isPending = currentStatus === '審査中';

              return (
                <tr key={veg.id}>
                  <td>
                    <img src={veg.image || "https://placehold.jp/150x150.png"} alt={veg.name} className={styles.itemImage} />
                    <span style={{ fontWeight: 'bold' }}>{veg.name}</span>
                  </td>
                  <td>{veg.farmer}</td>
                  <td>¥{veg.price}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${isPending ? styles.statusPending : styles.statusApproved}`}>
                      {currentStatus}
                    </span>
                  </td>
                  <td>
                    {isPending ? (
                      <button 
                        className={styles.approveBtn} 
                        onClick={() => handleApprove(veg.id)}
                        disabled={processingId === veg.id}
                      >
                        {processingId === veg.id ? "処理中..." : "✓ 承認して販売開始"}
                      </button>
                    ) : (
                      <span style={{ color: '#999', fontSize: '14px', fontWeight: 'bold' }}>承認済み</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}