虹靈御所《八字人生兵法》 v7 Protected
Build: 2025-08-08

這是前端靜態網站的「軟性防護版」。重點：
1) 啟動前需輸入授權序號（本示範可使用 DEMO key）。
2) 會於頁面套用浮水印（顯示授權使用者）。
3) 基礎防護（禁右鍵/複製/列印/部分快捷鍵），僅作嚇阻，可被繞過。
4) 驗證採前端 HMAC 簽章（可被拆解），如需強保護，建議加上伺服器端驗證。

★ DEMO License Key
eyJvd25lciI6IkRFTU8tVVNFUiIsImV4cGlyeSI6IjIwMjYtMTItMzEifQ.LfY5TbtK4kVmfsxD5lruxkS0b8IHh9ZdXm-6xXLuM_4

★ 產生正式授權
請提供 owner(授權抬頭) 與 expiry(YYYY-MM-DD)，我可幫你產生專屬 key，或升級為「線上驗證」版本。

檔案一覽：
- index.html（已注入 protection.js）
- protection.js（授權、水印、防護）
- app.js（你的原始應用）
- style.css（原樣）
