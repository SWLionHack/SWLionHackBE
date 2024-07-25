// routes/chat.js
const express = require('express');
const router = express.Router();

// 채팅 페이지 렌더링 또는 다른 엔드포인트를 여기서 정의할 수 있습니다.
router.get('/', (req, res) => {
    res.send('Chat server is running.');
});

module.exports = router;