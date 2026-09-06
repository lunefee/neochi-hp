# neochi HP

neochi の個人サイト（静的サイト）。GitHub Pages で公開。

## 構成
- `index.html` / `style.css` / `script.js`
- `img/` 画像素材・ギャラリー写真
- `models/bear.glb` 浮遊する 3D くま（Three.js は jsDelivr から読み込み）

## ローカル確認
```
ruby -run -e httpd . -p 8080
# → http://localhost:8080/
```
`file://` で直接開くと YouTube 埋め込みと Three.js が動きません。必ずサーバー経由で。
