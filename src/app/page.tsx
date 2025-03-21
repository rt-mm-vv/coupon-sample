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
  const isDemoMode = false;

  const ageOptions = ['10代', '20代', '30代', '40代', '50代', '60代以上'];
  const genderOptions = ['男性', '女性', 'その他'];
  const courseOptions = ['賃貸', '持ち家', 'その他'];

  const [name, setName] = useState(isDemoMode ? 'デモユーザー' : '');
  const [userId, setUserId] = useState(isDemoMode ? 'demo-user-id' : '');
  const [age, setAge] = useState(ageOptions[0]);
  const [date, setDate] = useState('');
  const [gender, setGender] = useState(genderOptions[0]);
  const [course, setCourse] = useState(courseOptions[0]);
  const [otherText, setOtherText] = useState('');
  const [isLiffInitialized, setIsLiffInitialized] = useState(isDemoMode);

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
  }, [isDemoMode]);

  const handleAgeChange = (e: React.ChangeEvent<HTMLSelectElement>) => setAge(e.target.value);
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => setDate(e.target.value);
  const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => setGender(e.target.value);
  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => setCourse(e.target.value);
  const handleOtherTextChange = (e: React.ChangeEvent<HTMLInputElement>) => setOtherText(e.target.value);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (date.length === 0) {
      alert('参加希望日を選択してください。');
      return;
    }

    // 送信データの準備
    const submitData = { userId, name, age, date, gender, course, otherText };
    console.log('送信データ:', submitData);

    if (isDemoMode) {
      // デモモードの場合は送信をシミュレート
      setTimeout(() => {
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
          console.error('Error:', error);
        });
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>まっしゅるブラザーズセミナー</h1>
        <div id="profile">お名前： {name}</div>
        <div id="form-container">
          <form id="survey-form" onSubmit={handleSubmit}>
            <label htmlFor="date">参加希望日: </label>
            <input type="date" id="date" name="date" value={date} onChange={handleDateChange} /><br />
            <label htmlFor="age">年代: </label>
            <select id="age" name="age" value={age} onChange={handleAgeChange}>
              {ageOptions.map((ageOption, index) =>
                <option value={ageOption} key={index}>{ageOption}</option>
              )}
            </select><br />
            <label>性別: </label>
            {genderOptions.map((option, index) => (
              <React.Fragment key={index}>
                <input type="radio" id={option} name="gender" value={option} checked={gender === option} onChange={handleGenderChange} />
                <label htmlFor={option} className="gender-label">{option}</label>
              </React.Fragment>
            ))}
            <label htmlFor="course">コース選択: </label>
            <select id="course" name="course" value={course} onChange={handleCourseChange}>
              {courseOptions.map((courseOption, index) =>
                <option value={courseOption} key={index}>{courseOption}</option>
              )}
            </select><br />
            <label htmlFor="text">その他: </label>
            <input type="text" id="text" name="text" value={otherText} onChange={handleOtherTextChange} /><br />
            <button id="submit" type="submit">送信</button>
          </form>
        </div>
      </main>
      <footer className={styles.footer}>
        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn
        </a>
        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Examples
        </a>
        <a
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
