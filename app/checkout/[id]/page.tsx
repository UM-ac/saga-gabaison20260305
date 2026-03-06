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
  category: string;
  price: number;
  farmer: string;
  image: string;
  status?: string;
};

// ★ 購入画面にも魔法の関数を追加して画像を綺麗に！
const getVegetableImage = (name: string, category: string, defaultImage: string) => {
  const lowerName = name.toLowerCase();
  
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
  if (lowerName.includes('大根') || lowerName.includes('だいこん')) return '/images/recipe/daikon.png';
  if (lowerName.includes('きゅうり') || lowerName.includes('キュウリ')) return '/images/recipe/pickle.png';

  if (category === '果菜類') return 'https://placehold.jp/e53935/ffffff/400x600.png?text=果菜類';
  if (category === '根菜類') return 'https://placehold.jp/f57c00/ffffff/400x600.png?text=根菜類';
  if (category === '葉菜類') return 'https://placehold.jp/43a047/ffffff/400x600.png?text=葉菜類';
  
  return defaultImage;
};

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  
  const [vegetable, setVegetable] = useState<Vegetable | null>(null);
  
  const [buyerName, setBuyerName] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('クレジットカード');
  
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleOrder = async () => {
    if (!buyerName || !postalCode || !address || !phone) {
      alert("必須項目をすべて入力してください！");
      return;
    }

    setIsSubmitting(true);

    try {
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
        status: '注文受付完了',
        orderedAt: serverTimestamp(),
      });

      alert("🎉 ご注文ありがとうございます！\n農家さんからの発送をお待ちください。");
      router.push('/');
      
    } catch (error) {
      console.error("注文エラー:", error);
      alert("エラーが発生しました。もう一度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!vegetable) return <div style={{ textAlign: 'center', padding: '100px' }}>読み込み中...</div>;

  // ★ 画像を決定
  const statusLabel = vegetable.status || '審査中';
  let displayImage = vegetable.image || "https://placehold.jp/150x150.png";
  if (statusLabel === '販売中') {
    displayImage = getVegetableImage(vegetable.name, vegetable.category || '', displayImage);
  }

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
            {/* ★ 魔法の関数で決めた画像を表示 */}
            <img src={displayImage} alt={vegetable.name} className={styles.itemImage} />
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