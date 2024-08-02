const express = require('express');
const router = express.Router();
const assistantController = require('../../controllers/gpt_api/assistantController')

router.post('/assistant', assistantController.createAssistant);

module.exports = router;
