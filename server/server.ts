import Express from 'express';
import http from 'http';
import path from 'path';
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

// 疎通テスト用のレスポンス
app.get('/api/health', (req, res) => {
  return res.send('I am OK!');
});

app.post('/api/upload', upload.single('file'), (req, res) => {
  res.send('upload succeeded.');
});

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
