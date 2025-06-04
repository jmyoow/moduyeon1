const express = require('express'); // 모듈을 사용할 때 require 사용
const path = require('path'); // 파일 경로를 편리하게 사용
const app = express();
const PORT = 3000;

// 미들웨어(함수) 사용하도록 추가
app.use(express.static(path.join(__dirname, '../')));

// 어떤 경로로 요청하든 index.html을 전송
app.get('/*any', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중!`);
});
