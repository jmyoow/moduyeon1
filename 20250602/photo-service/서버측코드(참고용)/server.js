const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
const port = process.env.PORT || 3000;

// CORS 설정
app.use(cors());
app.use(express.json());

// 정적 파일 제공
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// 파일 업로드를 위한 multer 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// 파일 필터링 함수 추가
const fileFilter = (req, file, cb) => {
  if (file.originalname.length < 6) {
    cb(new Error('❌ 파일 이름이 너무 짧습니다!'), false);
    return;
  }
  cb(null, true);
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter
});

// 1. 사진 업로드 API
app.post('/api/upload', upload.single('photo'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: '❌ 파일이 없습니다!' });
  }

  const photoId = `PHOTO_${Date.now()}`;
  res.json({ 
    photoId,
    message: `📤 ${req.file.originalname} 업로드 완료`
  });
});

// 2. 액자 선택 API
app.post('/api/choose-frame', (req, res) => {
  const { photoId } = req.body;
  if (!photoId) {
    return res.status(400).json({ error: '❌ photoId가 필요합니다!' });
  }

  const orderId = `ORDER_${Math.floor(Math.random() * 10000)}`;
  res.json({
    orderId,
    message: `🖼️ ${photoId}에 액자 선택 완료`
  });
});

// 3. 배달 요청 API
app.post('/api/delivery', (req, res) => {
  const { orderId } = req.body;
  if (!orderId) {
    return res.status(400).json({ error: '❌ orderId가 필요합니다!' });
  }

  res.json({
    message: `📦 ${orderId} 배달 요청 완료`
  });
});

// 업로드된 이미지 목록 반환 API
app.get('/api/photos', (req, res) => {
  fs.readdir(uploadsDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: '이미지 목록을 불러올 수 없습니다.' });
    }
    const imageFiles = files.filter(file =>
      /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(file)
    );
    res.json({ photos: imageFiles });
  });
});

// 업로드된 이미지 삭제 API
app.delete('/api/photos/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadsDir, filename);
  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(404).json({ error: '파일을 찾을 수 없습니다.' });
    }
    res.json({ message: '삭제 완료' });
  });
});

// 에러 핸들링 미들웨어 추가
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  }
  return res.status(400).json({ error: err.message });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});