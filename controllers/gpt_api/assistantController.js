const OpenAI = require('openai');

/**
 * 어시스턴트를 생성하는 함수입니다.
 * 실제로는 어시스턴트 ID가 .env 파일에 저장되어 있어, 어시스턴트 ID를 생성할 필요가 없습니다.
 * 이 함수는 어시스턴트 ID를 반환하거나, 어시스턴트가 생성되지 않은 경우 오류를 반환합니다.
 */
 exports.createAssistant = async (req, res) => {
    try {
      // .env 파일에서 어시스턴트 ID 가져오기
      const assistantId = process.env.OPENAI_ASSISTANT_ID;
      if (!assistantId) {
        return res.status(500).send('Assistant ID is not configured');
      }
      res.json({ assistantID: assistantId });
    } catch (error) {
      console.error('Failed to create assistant:', error);
      res.status(500).send('Failed to create assistant');
    }
  };