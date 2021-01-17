import Express from 'express';
import http from 'http';
import path from 'path';
import fs from 'fs';
import multer from 'multer';

const app = Express();
const port = process.env.PORT || 9000;
const server = http.createServer(app);

app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));

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

// 画像アップロード（base64版）
app.post('/api/upload-base64', (req, res) => {
  const { fileName, base64 } = req.body as { fileName: string, base64: string };
  const match = base64.match(/^data:image\/([a-z]+);/);
  if (match == null) {
    res.status(400).send('error');
    return;
  }
  const ext = match[1];
  const base64Content = base64.split(',')[1];
  const buffer = Buffer.from(base64Content, 'base64');
  fs.writeFile(path.resolve(__dirname, `./uploads/${fileName}.${ext}`), buffer, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('error');
      return;
    }
    res.send('upload succeeded.');
  });
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
