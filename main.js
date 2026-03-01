'use strict';

// jQueryを使って、HTMLの要素をJavaScriptの変数に代入します
const timeDisplay = $("#time");   // 時間を表示する場所
const startBtn    = $("#start");  // スタートボタン
const stopBtn     = $("#stop");   // ストップボタン
const resetBtn    = $("#reset");  // リセットボタン

let timerId;

//Date.now(): 現在の時刻をミリ秒単位で取得する命令です。
//setInterval: 指定した時間（例えば1ミリ秒）ごとに、特定の処理を繰り返し実行する命令です。

startBtn.on('click', () => {
  clearInterval(timerId);
  let startMs = Date.now(); //開始時間ミリ秒

    startBtn.prop('disabled', true); 
    stopBtn.prop('disabled', false); 
    resetBtn.prop('disabled', false); 

     timerId= setInterval(() => {
    const nowMs = Date.now();
    const elapsedMs = nowMs - startMs;

    const m = Math.floor(elapsedMs / 60000);              // 分
    const s = Math.floor((elapsedMs % 60000) / 1000);      // 秒
    const ms = elapsedMs % 1000;                           // ミリ秒（の残り）

    const formattedTime =`${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms}`;  
    timeDisplay.text(formattedTime);

    }, 100); //
    });

    stopBtn.on('click', () => {
    clearInterval(timerId); // メモ帳にある番号のタイマーを消去（stop）せよ！

  startBtn.prop('disabled', false); 
  // ③スタートボタンの「無効設定」を「false（いいえ、無効じゃない）」に戻す。
  // これで、また時間を測り始めることができるようになります。

  stopBtn.prop('disabled', true); 
  // ④ストップボタンは、今はもう止まっているので「true（はい、無効）」にする。
  // 止まっているのに何度もストップを押せないようにします。
    });

    // リセットボタンが押された時の処理
    resetBtn.on('click', () => {
    // 1. 動いているタイマーを止める（お掃除）
    clearInterval(timerId);
    // 2. 表示を最初の「00:00.0」に書き換える
     timeDisplay.text("00:00.0");
    });

  
