'use client';

import React, { useEffect, useState } from 'react';
import styles from "./page.module.css";
import "./seminar.css";
import { liff } from '@line/liff';

export default function Home() {
  // 環境変数から値を取得します
  const LIFF_ID = process.env.NEXT_PUBLIC_LIFF_ID || "";
  const GAS_URL = process.env.NEXT_PUBLIC_GAS_URL || "";
  
  // デモモード（true: デモモード、false: 実際のLINE連携）
  const isDemoMode = process.env.NEXT_PUBLIC_IS_DEMO_MODE === 'true';

  const ageOptions = ['10代', '20代', '30代', '40代', '50代', '60代以上'];
  const genderOptions = ['男性', '女性', 'その他'];
  const interestOptions = ['新築', 'リフォーム', '土地探し', '資金計画', 'その他'];
  const timeframeOptions = ['半年以内', '1年以内', '2年以内', '3年以内', '未定'];
  const familyOptions = ['単身', '夫婦のみ', '子供あり', '親との同居', 'その他'];
  const houseTypeOptions = ['一戸建て', 'マンション', 'タウンハウス', 'その他'];
  const budgetOptions = ['2000万円以下', '2000-3000万円', '3000-4000万円', '4000-5000万円', '5000万円以上'];
  const sourceOptions = ['インターネット', 'チラシ', '知人の紹介', 'SNS', 'その他'];

  const [name, setName] = useState(isDemoMode ? 'デモユーザー' : '');
  const [userId, setUserId] = useState(isDemoMode ? 'demo-user-id' : '');
  const [age, setAge] = useState(ageOptions[0]);
  const [gender, setGender] = useState(genderOptions[0]);
  const [interest, setInterest] = useState(interestOptions[0]);
  const [timeframe, setTimeframe] = useState(timeframeOptions[0]);
  const [family, setFamily] = useState(familyOptions[0]);
  const [houseType, setHouseType] = useState(houseTypeOptions[0]);
  const [budget, setBudget] = useState(budgetOptions[0]);
  const [source, setSource] = useState(sourceOptions[0]);
  const [otherText, setOtherText] = useState('');
  const [isLiffInitialized, setIsLiffInitialized] = useState(isDemoMode);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // デモモードの場合はLIFF初期化をスキップ
    if (isDemoMode) return;

    const initLiff = async () => {
      try {
        await liff.init({ liffId: LIFF_ID });
        setIsLiffInitialized(true);
        
        if (liff.isLoggedIn()) {
          const profile = await liff.getProfile();
          setName(profile.displayName);
          setUserId(profile.userId);
        } else {
          liff.login();
        }
      } catch (error) {
        console.error('LIFFの初期化に失敗しました', error);
      }
    };

    initLiff();
  }, [isDemoMode, LIFF_ID]);

  const handleAgeChange = (e: React.ChangeEvent<HTMLSelectElement>) => setAge(e.target.value);
  const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => setGender(e.target.value);
  const handleInterestChange = (e: React.ChangeEvent<HTMLSelectElement>) => setInterest(e.target.value);
  const handleTimeframeChange = (e: React.ChangeEvent<HTMLSelectElement>) => setTimeframe(e.target.value);
  const handleFamilyChange = (e: React.ChangeEvent<HTMLSelectElement>) => setFamily(e.target.value);
  const handleHouseTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => setHouseType(e.target.value);
  const handleBudgetChange = (e: React.ChangeEvent<HTMLSelectElement>) => setBudget(e.target.value);
  const handleSourceChange = (e: React.ChangeEvent<HTMLSelectElement>) => setSource(e.target.value);
  const handleOtherTextChange = (e: React.ChangeEvent<HTMLInputElement>) => setOtherText(e.target.value);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // 送信データの準備
    const submitData = { 
      userId, 
      name, 
      age, 
      gender, 
      interest, 
      timeframe, 
      family, 
      houseType, 
      budget, 
      source, 
      otherText 
    };
    console.log('送信データ:', submitData);

    if (isDemoMode) {
      // デモモードの場合は送信をシミュレート
      setTimeout(() => {
        setIsLoading(false);
        alert('デモモード: 送信が完了しました。');
        console.log('デモモード: 送信完了', submitData);
      }, 1000);
    } else {
      // 実際のAPIに送信
      fetch(GAS_URL, {
        method: 'POST',
        body: JSON.stringify(submitData),
      })
        .then((response) => {
          setIsLoading(false);
          if (response.ok) {
            alert('送信しました。');
            if (isLiffInitialized) {
              liff.closeWindow();
            }
            return response.json();
          } else {
            alert('送信に失敗しました。もう一度お試しください。');
          }
        })
        .then((json) => {
          console.log(json);
        })
        .catch((error) => {
          setIsLoading(false);
          console.error('Error:', error);
        });
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>住宅展示会アンケート</h1>
        <div id="profile">お名前： <span className="user-name">{name}</span></div>
        <div id="form-container">
          <form id="survey-form" onSubmit={handleSubmit}>
            
            <div className="form-group">
              <label htmlFor="age">年代: </label>
              <select id="age" name="age" value={age} onChange={handleAgeChange}>
                {ageOptions.map((ageOption, index) =>
                  <option value={ageOption} key={index}>{ageOption}</option>
                )}
              </select>
            </div>
            
            <div className="form-group">
              <label>性別: </label>
              <div className="radio-group">
                {genderOptions.map((option, index) => (
                  <div key={index}>
                    <input 
                      type="radio" 
                      id={option} 
                      name="gender" 
                      value={option} 
                      checked={gender === option} 
                      onChange={handleGenderChange} 
                    />
                    <label htmlFor={option} className="gender-label">{option}</label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="interest">関心のある項目: </label>
              <select id="interest" name="interest" value={interest} onChange={handleInterestChange}>
                {interestOptions.map((option, index) =>
                  <option value={option} key={index}>{option}</option>
                )}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="timeframe">住宅購入予定時期: </label>
              <select id="timeframe" name="timeframe" value={timeframe} onChange={handleTimeframeChange}>
                {timeframeOptions.map((option, index) =>
                  <option value={option} key={index}>{option}</option>
                )}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="family">家族構成: </label>
              <select id="family" name="family" value={family} onChange={handleFamilyChange}>
                {familyOptions.map((option, index) =>
                  <option value={option} key={index}>{option}</option>
                )}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="houseType">希望する住宅の種類: </label>
              <select id="houseType" name="houseType" value={houseType} onChange={handleHouseTypeChange}>
                {houseTypeOptions.map((option, index) =>
                  <option value={option} key={index}>{option}</option>
                )}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="budget">予算範囲: </label>
              <select id="budget" name="budget" value={budget} onChange={handleBudgetChange}>
                {budgetOptions.map((option, index) =>
                  <option value={option} key={index}>{option}</option>
                )}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="source">住宅展示会を知ったきっかけ: </label>
              <select id="source" name="source" value={source} onChange={handleSourceChange}>
                {sourceOptions.map((option, index) =>
                  <option value={option} key={index}>{option}</option>
                )}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="text">その他ご要望: </label>
              <input type="text" id="text" name="text" value={otherText} onChange={handleOtherTextChange} placeholder="ご自由にお書きください" />
            </div>
            <button id="submit" type="submit" disabled={isLoading}>
              {isLoading ? (
                <span className="loading-spinner">送信中...</span>
              ) : (
                '送信'
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
