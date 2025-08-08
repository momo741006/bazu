
/* 虹靈御所《八字人生兵法》 v7 Protected build 2025-08-08
 * 軟性前端防護：授權驗證、水印、避免複製、簡易防拆（可被繞過，僅作嚇阻）。
 */
(function(){'use strict';
  const APP_NAME="虹靈御所《八字人生兵法》";
  const APP_VERSION="v7 Protected";
  const BUILD_DATE="2025-08-08";
  const b64=(s)=>atob(s.replace(/-/g,'+').replace(/_/g,'/')+('==='.slice((s.length+3)%4)));
  function hmacSha256(key, msg){ // minimal HMAC-SHA256 (WebCrypto)
    const enc = new TextEncoder();
    return crypto.subtle.importKey("raw", enc.encode(key), {name:"HMAC", hash:"SHA-256"}, false, ["sign"])
      .then(k=>crypto.subtle.sign("HMAC", k, enc.encode(msg)))
      .then(buf=>Array.from(new Uint8Array(buf)).map(b=>String.fromCharCode(b)).join(''))
      .then(raw=>btoa(raw).replace(/\=+$/,''));
  }
  // secret pepper split（僅降低直觀度，非安全）：
  const PEPPER_PARTS = ["cnNw","XzIwMjU","fc2VjcmV0X3BlcHBlcg=="];
  const PEPPER = atob(PEPPER_PARTS[0]) + atob(PEPPER_PARTS[1]) + atob(PEPPER_PARTS[2]);
  function parseLicense(key){
    if(!key||!key.includes('.')) return null;
    const [p,s]=key.split('.');
    try{const payload = JSON.parse(b64(p)); return {payload, p, s}}catch(e){return null;}
  }
  async function verifyLicense(key){
    const data = parseLicense(key);
    if(!data) return { ok:false, reason:"格式錯誤" };
    const {payload,p,s} = data;
    const now = new Date().toISOString().slice(0,10);
    if(payload.expiry && now>payload.expiry) return {ok:false, reason:"已過期"};
    const expected = await hmacSha256(PEPPER, JSON.stringify(payload));
    if(expected !== s) return {ok:false, reason:"簽章不符"};
    return {ok:true, owner:payload.owner, expiry:payload.expiry};
  }
  async function gate(){
    // 若 localStorage 有通過的授權，直接進入
    let lic = localStorage.getItem('RSP_LICENSE');
    let v = lic ? await verifyLicense(lic) : {ok:false};
    while(!v.ok){
      lic = prompt("請輸入授權序號（License Key）\n如未購買，請聯繫版權方。\n提示：本示範金鑰可用：\neyJvd25lciI6IkRFTU8tVVNFUiIsImV4cGlyeSI6IjIwMjYtMTItMzEifQ.LfY5TbtK4kVmfsxD5lruxkS0b8IHh9ZdXm-6xXLuM_4");
      if(lic===null){ document.body.innerHTML = "<h2 style='padding:2rem'>未授權，已退出。</h2>"; throw new Error("No license"); }
      v = await verifyLicense(lic);
      if(!v.ok) alert("授權無效：" + v.reason);
    }
    localStorage.setItem('RSP_LICENSE', lic);
    // 啟用浮水印
    enableWatermark(v.owner || "UNKNOWN");
    // 顯示版本條
    banner(APP_NAME + " " + APP_VERSION + " | 授權："+ (v.owner||'') +" | 到期："+ (v.expiry||'無'));
    window.__RSP_LICENSE_INFO__ = v;
  }
  function banner(text){
    const bar = document.createElement('div');
    bar.id='rsp-banner';
    bar.textContent = text;
    Object.assign(bar.style,{position:'fixed',left:'0',right:'0',bottom:'0',padding:'6px 10px',fontSize:'12px',background:'rgba(0,0,0,.6)',color:'#fff',backdropFilter:'blur(6px)',zIndex:2147483647, pointerEvents:'none'});
    document.addEventListener('DOMContentLoaded',()=>document.body.appendChild(bar));
  }
  function enableWatermark(owner){
    const wm = document.createElement('div');
    wm.id='rsp-watermark';
    wm.setAttribute('aria-hidden','true');
    wm.textContent = owner + " | 虹靈御所《八字人生兵法》";
    Object.assign(wm.style,{position:'fixed',inset:'0',pointerEvents:'none',zIndex:2147483646,opacity:.12,whiteSpace:'pre',fontSize:'16px',transform:'rotate(-24deg)'});
    document.addEventListener('DOMContentLoaded',()=>{
      document.body.appendChild(wm);
      const pattern = owner + " | 虹靈御所《八字人生兵法》 | v7 Protected | " + new Date().toISOString().slice(0,10) + "  ";
      const rows = 20, cols = 20;
      wm.innerHTML = Array.from({length:rows}).map(()=>pattern.repeat(cols)).join("\n");
    });
  }
  // 基本複製保護（可被繞過）
  function basicGuards(){
    const block = (e)=>{ e.preventDefault(); return false; };
    document.addEventListener('copy', block); document.addEventListener('cut', block);
    document.addEventListener('contextmenu', block);
    document.addEventListener('keydown', (e)=>{ 
      if((e.ctrlKey||e.metaKey) && ['s','u','p','c','x','a'].includes(e.key.toLowerCase())) e.preventDefault();
      if(e.key==='PrintScreen') e.preventDefault();
    });
    const style = document.createElement('style'); style.textContent = `
      *::selection { background: transparent !important; }
      @media print { body { display:none !important; } }
    `; document.head.appendChild(style);
  }
  // 嘗試偵測 DevTools 開啟（僅提示）
  function devtoolsHint(){
    let fired=false; const threshold = 160;
    setInterval(()=>{
      const w = window.outerWidth - window.innerWidth;
      const h = window.outerHeight - window.innerHeight;
      if(!fired && (w>threshold || h>threshold)) {
        fired=true; alert("偵測到開發者工具可能已開啟。請尊重著作權，勿逆向/散播。");
      }
    }, 2000);
  }
  window.__RSP_PROTECTION__ = { gate, verifyLicense };
  basicGuards(); devtoolsHint();
  // 等待頁面完成再執行 gate
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', gate);
  else gate();
})();
