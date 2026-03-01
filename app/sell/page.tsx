// app/sell/page.tsx
'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; 
import styles from "./sell.module.css";

export default function SellPage() {
  // ★現在のステップを管理する変数（1 = 農家情報, 2 = 野菜情報）
  const [step, setStep] = useState(1);

  // --- Step 1: 農家情報 ---
  const [farmerName, setFarmerName] = useState('');
  const [location, setLocation] = useState('');
  const [experience, setExperience] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');

  // --- Step 2: 野菜情報 ---
  const [vegName, setVegName] = useState('');
  const [category, setCategory] = useState('果菜類'); // 初期値
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');
  const [vegDescription, setVegDescription] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- 次へ進む処理（保存はまだしない） ---
  const handleNext = () => {
    if (!farmerName || !location || !phone) {
      alert("必須項目（農園名、所在地、電話番号）を入力してください！");
      return;
    }
    setStep(2); // Step 2へ切り替え！
  };

  // --- 最終出品処理（まとめてFirebaseへ！） ---
  const handleSubmit = async () => {
    if (!vegName || !price || !originalPrice || !quantity || !reason || !vegDescription) {
      alert("必須項目をすべて入力してください！");
      return;
    }

    setIsSubmitting(true);

    try {
      // 今回は検索しやすいように「vegetables」という箱に全てまとめます
      await addDoc(collection(db, "vegetables"), {
        // 農家情報
        farmer: farmerName,
        location: location,
        phone: phone,
        // 野菜情報
        name: vegName,
        category: category,
        price: Number(price), // 数字として保存
        originalPrice: Number(originalPrice),
        stock: quantity, // 出品数量
        tag: reason, // 規格外理由
        description: vegDescription,
        // 画像は未実装なので仮のものを入れます
        image: "https://placehold.jp/24/cccccc/ffffff/400x300.png?text=審査中",
        createdAt: serverTimestamp(),
      });

      alert("出品が完了しました！審査結果をお待ちください。");
      
      // 入力欄を空にしてStep1に戻す
      setStep(1);
      setFarmerName(''); setLocation(''); setExperience(''); setDescription(''); setPhone('');
      setVegName(''); setCategory('果菜類'); setPrice(''); setOriginalPrice(''); setQuantity(''); setReason(''); setVegDescription('');
      
    } catch (error) {
      console.error("エラー: ", error);
      alert("出品に失敗しました。もう一度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>規格外野菜を出品する</h2>
        <p className={styles.pageSubtitle}>形が不揃いな野菜も、価値を理解してくれる消費者に届けましょう</p>
      </div>

      {/* ステップバー */}
      <div className={styles.stepper}>
        <div className={`${styles.step} ${step >= 1 ? styles.stepActive : ''}`}>
          <div className={styles.stepNumber}>1</div>
          <span>農家情報</span>
        </div>
        {/* Step2の時は緑の線を引く */}
        <div className={styles.stepLine} style={{ backgroundColor: step === 2 ? '#00A040' : '#EAEAEA' }}></div>
        <div className={`${styles.step} ${step === 2 ? styles.stepActive : ''}`}>
          <div className={styles.stepNumber}>2</div>
          <span>野菜情報</span>
        </div>
      </div>

      <div className={styles.formCard}>
        {/* =========== Step 1 の画面 =========== */}
        {step === 1 ? (
          <>
            <h3 className={styles.formTitle}>農家情報の登録</h3>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className={styles.formGroup}>
                <label className={styles.label}>農園名 / 農家名 <span className={styles.required}>*</span></label>
                <input type="text" className={styles.input} placeholder="例: 田中農園" value={farmerName} onChange={(e) => setFarmerName(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>所在地 <span className={styles.required}>*</span></label>
                <input type="text" className={styles.input} placeholder="例: 佐賀県佐賀市" value={location} onChange={(e) => setLocation(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>農業経験年数</label>
                <input type="text" className={styles.input} placeholder="例: 20年" value={experience} onChange={(e) => setExperience(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>農園の紹介</label>
                <textarea className={styles.textarea} placeholder="農園のこだわり等..." value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>電話番号 <span className={styles.required}>*</span></label>
                <input type="tel" className={styles.input} placeholder="例: 090-1234-5678" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>

              <button type="button" className={styles.submitBtn} onClick={handleNext}>
                次へ：野菜情報の登録
              </button>
            </form>
          </>
        ) : (
        /* =========== Step 2 の画面 =========== */
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 className={styles.formTitle} style={{ margin: 0 }}>野菜情報の登録</h3>
              <button type="button" onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: '#00A040', cursor: 'pointer', fontWeight: 'bold' }}>
                ← 農家情報に戻る
              </button>
            </div>
            
            <form onSubmit={(e) => e.preventDefault()}>
              <div className={styles.formGroup}>
                <label className={styles.label}>野菜名 <span className={styles.required}>*</span></label>
                <input type="text" className={styles.input} placeholder="例: 曲がりきゅうり" value={vegName} onChange={(e) => setVegName(e.target.value)} />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>カテゴリー <span className={styles.required}>*</span></label>
                <select className={styles.select} value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="果菜類">果菜類（トマト、きゅうり等）</option>
                  <option value="根菜類">根菜類（大根、人参等）</option>
                  <option value="葉菜類">葉菜類（キャベツ、ほうれん草等）</option>
                </select>
              </div>

              {/* 価格は横並びにすると綺麗です */}
              <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                <div style={{ flex: 1 }}>
                  <label className={styles.label}>通常価格(円/kg) <span className={styles.required}>*</span></label>
                  <input type="number" className={styles.input} placeholder="例: 300" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} />
                </div>
                <div style={{ flex: 1 }}>
                  <label className={styles.label}>販売価格(円/kg) <span className={styles.required}>*</span></label>
                  <input type="number" className={styles.input} placeholder="例: 150" value={price} onChange={(e) => setPrice(e.target.value)} />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>出品数量(kg) <span className={styles.required}>*</span></label>
                <input type="text" className={styles.input} placeholder="例: 50kg" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>規格外理由 <span className={styles.required}>*</span></label>
                <input type="text" className={styles.input} placeholder="例: サイズ不揃い、曲がりあり" value={reason} onChange={(e) => setReason(e.target.value)} />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>商品説明 <span className={styles.required}>*</span></label>
                <textarea className={styles.textarea} placeholder="味の特徴やおすすめの食べ方などを教えてください" value={vegDescription} onChange={(e) => setVegDescription(e.target.value)} />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>野菜の写真 <span className={styles.required}>*</span></label>
                <div className={styles.uploadArea}>
                  <div className={styles.uploadIcon}>📷</div>
                  <p className={styles.uploadText}>クリックして画像をアップロード (最大5枚)</p>
                </div>
              </div>

              {/* 注意書き */}
              <div className={styles.warningText}>
                ⚠️ 出品後、運営チームによる審査が行われます。審査には1-2営業日かかる場合があります。
              </div>

              {/* 横並びのボタン */}
              <div className={styles.buttonGroup}>
                <button type="button" className={styles.backBtn} onClick={() => setStep(1)}>戻る</button>
                <button type="button" className={styles.primaryBtn} onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? "出品処理中..." : "出品する"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}