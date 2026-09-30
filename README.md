# 旅圖誌 Travel Atlas — VOL.01

> 一份旅遊刊物式的網站｜學員編號：04｜姓名：CheungChunKin
> 最後更新：2026 年

---

## 1. 刊物簡介

「旅圖誌」是一份**旅遊刊物式**的網站，VOL.01 收錄四個國度的專題：

| 專題 | 國家 | 頁面 | 閱讀時間 |
| --- | --- | --- | --- |
| 馬拉喀什：紅色之城，黃昏之前 | 摩洛哥 | `marrakesh.html` | 8 分鐘 |
| 撒馬爾罕：絲路上的藍 | 烏茲別克 | `samarkand.html` | 7 分鐘 |
| 瓦拉納西：河邊的三千年 | 印度 | `varanasi.html` | 7 分鐘 |
| 復活節島：背向大海的巨人 | 智利 | `rapanui.html` | 7 分鐘 |

網站共 **7 個頁面**：封面（`index.html`）、本期目錄（`destinations.html`）、四篇專題、版權頁（`about.html`）。

每篇專題包含歷史簡介（250 至 300 字）、文化特色（220 至 280 字）、四個景點圖版、旅行者實用資料，以及一段 YouTube 影片。

**技術重點**

- 只用純 HTML、CSS、JavaScript 手寫，**沒有任何前端框架**。
- **沒有引入任何 CDN 或外部字體**，字體全部使用系統字體。
- 零 build tool、零 npm、零本機伺服器：**直接雙擊 `index.html` 就可以開啟**。
- 響應式設計為 mobile-first，斷點 768px（平板）與 1024px（桌面）。

---

## 2. 檔案結構

```text
04_CheungChunKin_webpage/
├── index.html          封面＋本期目錄＋跨頁圖＋編者的話＋編輯精選＋影片
├── destinations.html   本期目錄：篩選、排序、卡片／索引表雙檢視
├── marrakesh.html      摩洛哥 馬拉喀什
├── samarkand.html      烏茲別克 撒馬爾罕
├── varanasi.html       印度 瓦拉納西
├── rapanui.html        智利 復活節島
├── about.html          版權頁：刊物資料、聯絡表單、常見問題
├── README.md           本檔案
├── css/
│   └── style.css       全站樣式（30 個區塊，含 768px／1024px 斷點、手機專屬規則與列印樣式）
├── js/
│   └── script.js       全站互動（11 個功能模組）
└── images/
    └── 30 張 .jpg      目前全部是佔位圖，請按第 4 節替換
```

---

## 3. 圖片清單（共 30 張）

全部是程式產生的佔位圖，每張圖上都印有大字檔名，方便逐張對應替換。

### 封面與跨頁（2 張）

| 檔名 | 尺寸 | 用途 |
| --- | --- | --- |
| `index-cover.jpg` | 1600 × 900 | 封面大圖。**`destinations.html` 的頁首圖共用此檔** |
| `index-wide.jpg` | 1600 × 686 | 封面的 21:9 跨頁編輯圖 |

### 每個地點 7 張（共 28 張）

以馬拉喀什為例，其餘三個地點把 `marrakesh` 換成 `samarkand`、`varanasi`、`rapanui` 即可：

| 檔名 | 尺寸 | 用途 |
| --- | --- | --- |
| `marrakesh-hero.jpg` | 1600 × 900 | 專題頁大圖。**首頁目錄卡與目錄頁卡片共用此檔**（以 4:5 直幅出現） |
| `marrakesh-spot-1.jpg` | 800 × 600 | 景點一，以 21:9 全寬出現（圖文錯位） |
| `marrakesh-spot-2.jpg` | 800 × 600 | 景點二，以 3:2 跨 7 欄出現 |
| `marrakesh-spot-3.jpg` | 800 × 600 | 景點三，以 4:5 直幅跨 5 欄出現（高度錯開） |
| `marrakesh-spot-4.jpg` | 800 × 600 | 景點四，以 1:1 方圖縮排出現 |
| `marrakesh-scene-1.jpg` | 800 × 600 | 環境圖一，放在歷史段落之後，半寬靠右 |
| `marrakesh-scene-2.jpg` | 1600 × 686 | 跨頁環境圖，21:9 全出血，配 pull quote |

> **同一張圖會在不同位置以不同比例出現**，這是刻意的編輯手法，不算重複。四個景點刻意使用四種不同比例（21:9／3:2／4:5／1:1），避免「每個景點一張圖平均分配」的作業感。

---

## 4. 如何替換圖片

1. 準備好你的照片。
2. 把照片**改名成上表其中一個檔名**。
3. 直接覆蓋 `images/` 資料夾內的同名檔案。

**HTML 完全不需要修改。**

### 建議的真實照片尺寸

| 用途 | 建議像素 | 建議比例 | 備註 |
| --- | --- | --- | --- |
| 大圖（`*-hero.jpg`、`index-cover.jpg`） | 1920 × 1080 或以上 | 16:9 | 文字會疊在下半部，主體不要放正中間 |
| 跨頁圖（`*-scene-2.jpg`、`index-wide.jpg`） | 2400 × 1030 或以上 | 21:9 | 橫向全景效果最好 |
| 景點圖（`*-spot-*.jpg`） | 1200 × 900 或以上 | 4:3 | 會用 `object-fit: cover` 裁切，主體放中間最安全 |
| 環境圖（`*-scene-1.jpg`） | 1200 × 900 或以上 | 4:3 | 同上 |

### 兩個要注意的地方

- **`alt` 文字要一併更新**：每個 `<img>` 的 `alt` 描述的是「預期的那張照片」。如果換上的照片內容不同，請修改該 `alt` 屬性。
- **圖說也要更新**：`.spot-caption` 與 `.figcaption` 內的文字（例如「圖版 02 · 黃昏之後，廣場中央先出現的是食物檔」）描述的是原本預期的畫面。

---

## 5. YouTube 影片清單

全部以 `youtube-nocookie.com` 隱私加強模式嵌入，並加上 `loading="lazy"`。

| 頁面 | 影片 ID | 標題 | 頻道 |
| --- | --- | --- | --- |
| `index.html` | `a-8XiE7W7u4` | Most Beautiful Places in the World in 4K UHD | Beautiful World 4K Film Music |
| `marrakesh.html` | `Gqs5eDnyDPM` | How to Spend 48 Hours in Marrakesh | Kristina's Travels |
| `samarkand.html` | `B9GavSzElXM` | TOP 10 Places in SAMARKAND | Reigne Or Shine |
| `varanasi.html` | `KDIttO1Wvg4` | VARANASI TRAVEL GUIDE | Samuel and Audrey |
| `rapanui.html` | `7PHoYmmGM3c` | Easter Island/Rapa Nui Travel Guide | Global Nomads |

> **示範提示**：直接用雙擊（`file://`）開啟網站時，YouTube 有可能無法播放嵌入的影片，播放器會顯示錯誤訊息。**示範、錄影或截圖前，建議改用本機伺服器開啟網站**（例如在資料夾內執行 `python -m http.server`，再瀏覽 `localhost:8000`），影片就會正常播放。每個影片下方已加上一行後備提示。

### 如何更換影片

1. 在 YouTube 找到想用的影片，複製網址中 `watch?v=` 後面那一段。例如網址寫 `www.youtube.com/watch?v=XXXXXXXXXXX`，要複製的 ID 就是 `XXXXXXXXXXX`（共 11 個字元）。
2. 在對應的 HTML 檔案中搜尋 `youtube-nocookie.com/embed/`，把舊 ID 換成新 ID。
3. 同時修改該 `<iframe>` 的 `title` 屬性。
4. 部分影片不允許嵌入，更換後請實際開啟確認能播放。

> 目前這 5 個 ID 都用 YouTube oEmbed API 驗證過，確認影片存在並允許嵌入。

---

## 6. 技術決定記錄

| 項目 | 決定 | 原因 |
| --- | --- | --- |
| 框架 | 完全不使用 | 純手寫 HTML／CSS／JS |
| 網格 | 桌面 12 欄、平板 12 欄（窄版）、手機單欄 | 12 欄才做得出 7/5、8/4 這種不對稱跨欄關係 |
| 圖片比例詞彙 | 只有五種：21:9、16:9、3:2、4:5、1:1 | 比例種類少而固定，才會有編輯感而不是隨機 |
| 首頁目錄 | 一大三細（主打跨 7 欄、其餘三條清單） | 首頁要有主次，不是四張等大的卡 |
| 景點圖版 | 四張圖用四種比例、四種寬度 | 避免「每個景點一張圖平均分配」的作業感 |
| 目的地頁 | 卡片檢視（4:5 直幅）＋索引表檢視，桌面可切換 | 索引頁保持克制，內頁才戲劇化；兩種檢視分別服務「瀏覽」與「查資料」 |
| 手機版索引表 | 375px 下 `#view-table` 強制隱藏 | 不硬塞表格；所有欄位資料（座標、季節、閱讀時間）都已放在卡片上 |
| 卡片編號 | 純 CSS counter | 篩選之後編號會自動重編，不需要 JavaScript |
| 捲動動畫 | 只有圖片淡入（opacity + 12px 位移） | 克制；不做視差、縮放或旋轉 |
| 閱讀進度線 | 2px 黃線，用 `requestAnimationFrame` 節流 | 無動畫，只反映位置 |
| FAQ | 純 `<details>`／`<summary>` | 原生已支援鍵盤與螢幕報讀器 |
| 表單驗證 | 表單加 `novalidate`，驗證全部交由 JavaScript | 保留原生驗證會先用英文氣泡擋下提交，看不到自訂中文訊息 |
| 檢視切換狀態 | 只存記憶體，**不用 localStorage** | `file://` 下的 localStorage 行為不可靠 |
| 橫向滾動 | 沒有使用 `overflow-x: hidden` | 改用 `min-width: 0`、`max-width: 100%`、`aspect-ratio` 由根本解決 |
| 無障礙 | skip link、圖片全部有 `alt`、互動元素有 `aria`、`:focus-visible` 有明顯外框、尊重 `prefers-reduced-motion` | 提升易用性 |
| 列印樣式 | `@media print` 隱藏導覽、影片、表單等互動元素 | 刊物應該印得出來 |

### JavaScript 模組（11 個）

| 模組 | 功能 |
| --- | --- |
| `initSkipLink` | 跳至主要內容後把焦點移到 `#main` |
| `initNavToggle` | 手機漢堡菜單 |
| `initReadingProgress` | 頂部 2px 閱讀進度線 |
| `initChapterRail` | 內頁章節欄，標示目前讀到哪一節 |
| `initFigureReveal` | 圖片進入畫面時淡入 |
| `initDestinationFilter` | 篩選、排序（5 種排序、可升可降）、卡片與表格同步 |
| `initViewSwitch` | 卡片檢視／索引表檢視切換 |
| `initRail` | 編輯精選橫向滑動 |
| `initLightbox` | 圖片放大、前後張導覽、鍵盤左右鍵、圖版編號 |
| `initContactForm` | 表單前端驗證 |
| `initBackToTop` | 返回頂部 |

### 想新增第五個地點時

1. 複製任何一個專題頁（例如 `marrakesh.html`），改成新檔名。
2. 在 `destinations.html` 加一張 `<article class="card" data-destination="…">`，填好 `data-country`、`data-country-en`、`data-season`、`data-season-order`、`data-name-en`、`data-reading`。
3. 在索引表的 `<tbody>` 加一列 `<tr data-destination="…">`，值要與卡片一致。
4. 在七個頁面的導覽列與頁尾加連結。
5. 新增季節時，記得在 `#filter-season` 加入對應的 `<option>`。
6. **注意**：`[data-destination-grid]` 內的四張卡必須保持為**直接子元素**（JavaScript 用 `grid.appendChild` 重排）；`tr[data-destination]` 必須保持 `<tbody>` 直接子元素。

---

## 7. 待辦事項（發佈或交作業前要自己完成）

- [ ] **找齊 30 張真實照片**，按第 4 節的方式覆蓋 `images/` 內的同名檔案。
- [ ] **更新 `alt` 文字與圖說**（`.spot-caption`、`.figcaption`）。
- [ ] **檢查 5 段 YouTube 影片仍可播放**（見第 5 節）。
- [ ] **校對內容**：歷史、文化、簽證與安全提示雖然已盡量查證，但政策會變動，建議再快速核對一次。
- [ ] **壓縮成 ZIP**：把整個資料夾壓縮，檔名建議為 `04_CheungChunKin_webpage.zip`。
- [ ] **最後測試**：雙擊 `index.html`，確認 7 個頁面都能開啟，並用開發者工具（F12）確認 Console 沒有錯誤。

---

## 8. 聲明

- 本網站為**網頁設計課程的課堂習作**，同時以公開展示為目標設計，只作學習與示範用途。
- 內容整理自公開的旅遊資訊、各地官方旅遊局與博物館網站，僅供參考。**簽證、入境要求與安全狀況會隨時變動，出發前請務必查閱目的地官方領事館或入境部門的最新公告。**
- 目前 `images/` 內的 30 張圖片全部是**程式產生的佔位圖**，並非真實照片。
- 替換圖片時，**請使用你有權使用的照片**。使用免費圖庫（例如 Unsplash、Pexels、Pixabay）時，建議記錄來源與作者；若圖片來自其他網站，請先確認授權條款。
- 網站嵌入的 YouTube 影片版權均屬原作者所有，本站僅以 YouTube 官方提供的嵌入方式引用。
- 聯絡表單只作 JavaScript 前端驗證示範，**不會傳送或儲存任何資料**。
