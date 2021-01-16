import Express from 'express';
import http from 'http';
import path from 'path';

const app = Express();
const port = process.env.PORT || 9000;
const server = http.createServer(app);

// CORSを許可する
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// public以下に配置したファイルは直リンクで見れるようにする
app.use(Express.static(path.resolve(__dirname, 'public')));

// 疎通テスト用のレスポンス
app.get('/api/health', (req, res) => {
  return res.send('I am OK!');
});

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
