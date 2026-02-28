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

  
// 数字ボタン（class="num-btn"）が押された時の処理
$(".num-btn").on("click", function() {
  // ① 押されたボタンの文字（7とか8）を取得する
  const pushedNum = $(this).text();
  
  // ② 今、画面に出ている文字を取得する
  const currentText = $("#calc-display").text();

  const lastChar = currentText.slice(-1);       // 最後の一文字
  const secondLast = currentText.slice(-2, -1); // 最後から二番目

  // ③ 画面が「0」なら新しい数字に入れ替え、そうじゃなければ数字を後ろに付け足す
/// 1. 画面が「0」ちょうどの時
  if (currentText === "0") {
    if (pushedNum === "00") {
      // 0の時に00を押しても、0のままにする（000になるのを防ぐ）
      return; 
    } else if (pushedNum === ".") {
      // 0の時に . を押したら 「0.」 にする
      $("#calc-display").text(currentText + pushedNum);
    } else {
      // それ以外の数字（1〜9）なら、0を消してその数字にする
      $("#calc-display").text(pushedNum);
    }
  } 
// 2. 記号の直後が「0」の時（例: 1+0 の状態）
  else if (lastChar === "0" && (secondLast === "+" || secondLast === "-" || secondLast === "*" || secondLast === "/")) {
    if (pushedNum === ".") {
      $("#calc-display").text(currentText + pushedNum);
    } else if (pushedNum === "0" || pushedNum === "00") {
      return; // 1+0 の後に 0 や 00 を押しても無視（これが一番大事！）
    } else {
      // 0を消して新しい数字（2など）にする
      $("#calc-display").text(currentText.slice(0, -1) + pushedNum);
    }
  }
  // 3. 記号の直後に「00」が押された時（例: 1+ の次に 00）
  else if ((lastChar === "+" || lastChar === "-" || lastChar === "*" || lastChar === "/") && pushedNum === "00") {
    // 00 をそのまま出さず、0 一つにする
    $("#calc-display").text(currentText + "0");

  }
  // 4. それ以外（普通の付け足し）
  else {
    if (pushedNum === ".") {
      // 画面の文字を「記号」で分割して、最後の塊を取り出す
      const parts = currentText.split(/[\+\-\*\/]/);
      const lastPart = parts[parts.length - 1];

      // すでにドットがあれば何もしない
      if (lastPart.includes(".")) {
        return;
      }
    }
    
    // ★ここが抜けていました！★
    // チェックを通り抜けた数字（またはドット）を、ここで画面に追加します
    $("#calc-display").text(currentText + pushedNum);
  }
});

// クリアボタン（id="clear"）が押されたら「0」に戻す
$("#clear").on("click", () => {
  $("#calc-display").text("0");
});

// 演算子ボタン（class="operator"）が押された時の処理
$(".operator").on("click", function() {
  const pushedOp = $(this).text();
  const currentText = $("#calc-display").text();
  const lastChar = currentText.slice(-1); // 画面の一番右の文字を取得

  // ★ここを追加！ 
  // もし最後の一文字が「+」「-」「*」「/」「.」だったら、記号は足さない
  if (lastChar === "+" || lastChar === "-" || lastChar === "*" || lastChar === "/" || lastChar === ".") {
    return; // ここで処理を中断（連打禁止！）
  }

  // 記号を後ろに付け足す（例：123 + ）
  $("#calc-display").text(currentText + pushedOp);
});

// イコールボタン（id="equal"）が押された時の処理
$("#equal").on("click", function() {
  const currentText = $("#calc-display").text();
  
  // evalを使って、画面の文字列を計算し、結果を出す
  // 例："1+2+3" を 6 という数字に変えてくれる！
  const result = eval(currentText);
  
  // 計算結果を画面に表示する
  $("#calc-display").text(result);
});