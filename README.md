理科基礎マスター — PWA 配置一式
================================

【Netlifyへの公開】
このフォルダの中身（dist の中身）をまるごと Netlify にドラッグ＆ドロップするだけです。
※フォルダごとではなく「中のファイル」を選択してドロップしてください。

【ファイル構成】
  index.html               アプリ本体（単一ファイル）
  manifest.json            PWA設定（名前・アイコン・ショートカット）
  sw.js                    Service Worker（オフライン対応・キャッシュ）
  offline.html             オフライン時のフォールバック画面
  icon-192.png / 512.png       通常アイコン
  icon-maskable-192 / 512.png  Android用（角丸・円形マスク対応）
  apple-touch-icon.png         iOSホーム画面用（180px）
  favicon-32.png               ブラウザタブ用
  questions.json           ←Sheetsから書き出してここに置く（任意）

【questions.json について】
  index.html と同じ階層に置くと自動で読み込みます。
  無い場合はアプリ内蔵のサンプル問題で動作します。
  形式は配列。choices形式 / M_Questions(choice_1..4)形式 のどちらも対応。

【更新時の注意】
  問題やアプリを更新したら sw.js の VERSION を上げてください
  （例 "rikakiso-v2" → "rikakiso-v3"）。HTMLとquestions.jsonは常に最新を取得し、新SWは自動で切り替わり画面もリロードされます。

【ホーム画面に追加すると】
  ・全画面（アドレスバーなし）で起動
  ・一度開けばオフラインでも学習可能
  ・アイコン長押しで「ランダム10」「復習モード」へ直接ジャンプ

================================
【GitHub Pages で公開する場合】
GitHub Pages はリポジトリ名のサブパス
  https://ユーザー名.github.io/リポジトリ名/
で配信されますが、本アプリは全て相対パス（./）で書いてあるため
そのまま動きます。以下の手順で公開できます。

  1. GitHubで公開リポジトリを新規作成（例：rika-kiso）
  2. この dist フォルダの中身（.nojekyll を含む全ファイル）を
     リポジトリのルートに push、またはWeb上でドラッグ＆ドロップ
  3. リポジトリの Settings → Pages を開く
  4. 「Build and deployment」の Source を
     「Deploy from a branch」、Branch を「main / (root)」に設定して Save
  5. 数分待つと https://ユーザー名.github.io/リポジトリ名/ で公開

【重要】.nojekyll を必ず含めること
  GitHub Pages は既定で Jekyll が走り、特定のファイルを無視することがあります。
  空ファイル .nojekyll をルートに置くと Jekyll を無効化でき、
  Service Worker やアイコンが確実に配信されます。

【ユーザーサイト（username.github.io）として使う場合】
  リポジトリ名を「ユーザー名.github.io」にするとルート（/）配信になり、
  サブパスを気にする必要もありません。

【更新の反映】
  ファイルを更新したら sw.js の VERSION を1つ上げて push してください。
  HTML と questions.json は常に最新を取得し、新SWは自動で切り替わります。
