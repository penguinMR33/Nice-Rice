// 設定値
const UNIT_PRICE = 2500; // 5kg 1袋あたりの価格
const SHIPPING_FEE = 800; // 郵送時の配送料

// 状態
let quantity = 1;

// DOM要素の取得
const btnMinus = document.getElementById('btn-minus');
const btnPlus = document.getElementById('btn-plus');
const counterVal = document.getElementById('counter-val');
const totalAmount = document.getElementById('total-amount');
const orderForm = document.getElementById('order-form');
const toast = document.getElementById('toast');
const toastText = document.getElementById('toast-text');

// 初期計算の実行
updateCalculator();

// イベントリスナー
btnMinus.addEventListener('click', () => {
  if (quantity > 1) {
    quantity--;
    updateCalculator();
  }
});

btnPlus.addEventListener('click', () => {
  quantity++;
  updateCalculator();
});

// ラジオボタンの変更イベント登録
document.querySelectorAll('input[name="delivery"]').forEach(radio => {
  radio.addEventListener('change', updateCalculator);
});

// 料金計算と画面反映
function updateCalculator() {
  counterVal.textContent = quantity;

  const deliveryMethod = document.querySelector('input[name="delivery"]:checked').value;
  const shipping = deliveryMethod === '郵送' ? SHIPPING_FEE : 0;
  
  const productPrice = quantity * UNIT_PRICE;
  const totalPrice = productPrice + shipping;

  totalAmount.textContent = `¥${totalPrice.toLocaleString()}`;
}

// フォーム送信（コピー処理）
orderForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('user-name').value.trim();
  const deliveryMethod = document.querySelector('input[name="delivery"]:checked').value;
  const message = document.getElementById('user-message').value.trim();

  const shipping = deliveryMethod === '郵送' ? SHIPPING_FEE : 0;
  const productPrice = quantity * UNIT_PRICE;
  const totalPrice = productPrice + shipping;

  // 注文日時の生成
  const now = new Date();
  const timestamp = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  // コピー用テキストの組み立て
  let orderText = `お米（コシヒカリ）注文するね！🌾\n\n`;
  orderText += `・注文日時：${timestamp}\n`;
  orderText += `・お名前：${name}\n`;
  orderText += `・数量：${quantity}袋 (${quantity * 5}kg)\n`;
  orderText += `・受け渡し：${deliveryMethod}\n`;
  orderText += `・合計金額：¥${totalPrice.toLocaleString()} (税込)\n`;
  if (message) {
    orderText += `・メッセージ：${message}\n`;
  }
  orderText += `\nよろしくおねがいします！`;

  // クリップボードにコピー
  navigator.clipboard.writeText(orderText)
    .then(() => {
      showToast('コピーしたよ！LINEやDMに貼り付けて送ってね。');
    })
    .catch(err => {
      console.error('コピー失敗:', err);
      showToast('コピーに失敗しちゃいました。直接コピーしてね。');
    });
});

// トースト通知の表示
function showToast(msg) {
  toastText.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}
