import Express from 'express';
import http from 'http';
import path from 'path';
import fs from 'fs';
import multer from 'multer';

const app = Express();
const port = process.env.PORT || 9000;
const server = http.createServer(app);

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.resolve(__dirname, './uploads/'));
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});
const upload = multer({ storage });

// CORSを許可する
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// static以下に配置したファイルは直リンクで見れるようにする
app.use(Express.static(path.resolve(__dirname, 'static')));
// uploads以下のファイルを見れるようにする
app.use('/uploads', Express.static(path.resolve(__dirname, './uploads')));

// 疎通テスト用のレスポンス
app.get('/api/health', (req, res) => {
  return res.send('I am OK!');
});

// 画像アップロード
app.post('/api/upload', upload.single('file'), (req, res) => {
  res.send('upload succeeded.');
});

// アップロードファイル一覧
app.get('/api/upload-files', (req, res) => {
  fs.readdir(path.resolve(__dirname, './uploads'), (err, files) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.send(files);
  });
});

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
