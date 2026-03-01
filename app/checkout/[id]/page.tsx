// app/checkout/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import styles from './checkout.module.css';

// 野菜データの型
type Vegetable = {
  id: string;
  name: string;
  price: number;
  farmer: string;
  image: string;
};

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  
  const [vegetable, setVegetable] = useState<Vegetable | null>(null);
  
  // フォームの入力項目
  const [buyerName, setBuyerName] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('クレジットカード');
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ページが開かれたら、買う予定の野菜データを取ってくる
  useEffect(() => {
    const fetchVegetable = async () => {
      if (params.id) {
        const docRef = doc(db, "vegetables", params.id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setVegetable({ id: docSnap.id, ...docSnap.data() } as Vegetable);
        }
      }
    };
    fetchVegetable();
  }, [params.id]);

  // 注文を確定する処理
  const handleOrder = async () => {
    if (!buyerName || !postalCode || !address || !phone) {
      alert("必須項目をすべて入力してください！");
      return;
    }

    setIsSubmitting(true);

    try {
      // Firebaseの「orders（注文一覧）」コレクションに保存
      await addDoc(collection(db, "orders"), {
        itemId: vegetable?.id,
        itemName: vegetable?.name,
        price: vegetable?.price,
        farmerName: vegetable?.farmer,
        buyerName,
        postalCode,
        address,
        phone,
        paymentMethod,
        status: '注文受付完了', // 今後の管理用
        orderedAt: serverTimestamp(),
      });

      alert("🎉 ご注文ありがとうございます！\n農家さんからの発送をお待ちください。");
      
      // 買い物が終わったらトップページに戻す
      router.push('/');
      
    } catch (error) {
      console.error("注文エラー:", error);
      alert("エラーが発生しました。もう一度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!vegetable) return <div style={{ textAlign: 'center', padding: '100px' }}>読み込み中...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>購入手続き</h1>

      <div className={styles.checkoutLayout}>
        {/* 左側：お届け先フォーム */}
        <div className={styles.formSection}>
          <h2 style={{ fontSize: '20px', borderBottom: '2px solid #EEE', paddingBottom: '8px', marginBottom: '24px' }}>
            🚚 お届け先情報の入力
          </h2>

          <form onSubmit={(e) => e.preventDefault()}>
            <div className={styles.formGroup}>
              <label className={styles.label}>お名前 <span className={styles.required}>*</span></label>
              <input type="text" className={styles.input} placeholder="例: 佐賀 太郎" value={buyerName} onChange={(e) => setBuyerName(e.target.value)} />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>郵便番号 <span className={styles.required}>*</span></label>
              <input type="text" className={styles.input} placeholder="例: 840-0000" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>住所 <span className={styles.required}>*</span></label>
              <input type="text" className={styles.input} placeholder="例: 佐賀県佐賀市〇〇 1-2-3" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>電話番号 <span className={styles.required}>*</span></label>
              <input type="tel" className={styles.input} placeholder="例: 090-0000-0000" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>お支払い方法 <span className={styles.required}>*</span></label>
              <select className={styles.select} value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <option value="クレジットカード">クレジットカード（仮）</option>
                <option value="銀行振込">銀行振込</option>
                <option value="代金引換">代金引換</option>
              </select>
            </div>
          </form>
        </div>

        {/* 右側：注文内容の確認 */}
        <div className={styles.summarySection}>
          <h3 className={styles.summaryTitle}>🛒 ご注文内容</h3>
          
          <div className={styles.itemInfo}>
            <img src={vegetable.image || "https://placehold.jp/150x150.png"} alt={vegetable.name} className={styles.itemImage} />
            <div>
              <p className={styles.itemName}>{vegetable.name}</p>
              <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>販売: {vegetable.farmer}</p>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', margin: '16px 0', color: '#666' }}>
            <span>小計</span>
            <span>¥{vegetable.price}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', margin: '16px 0', color: '#666' }}>
            <span>送料</span>
            <span>¥0 (無料)</span>
          </div>

          <div className={styles.totalRow}>
            <span>合計</span>
            <span>¥{vegetable.price}</span>
          </div>

          <button 
            type="button" 
            className={styles.submitBtn} 
            onClick={handleOrder} 
            disabled={isSubmitting}
          >
            {isSubmitting ? "処理中..." : "注文を確定する"}
          </button>
        </div>
      </div>
    </div>
  );
}