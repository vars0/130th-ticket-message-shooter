const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); 
const { sendMessage } = require("./sendMessage");

const app = express();

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

// 구글 폼에서 데이터를 받는 엔드포인트
app.post("/webhook", async (req, res) => {
  try {
    const data = req.body;
    
    // 구글 폼의 질문 제목과 정확히 일치해야 합니다.
    const name = data["성함"] || data["이름"];
    const phone = (data["전화번호"] || "").replace(/[^0-9]/g, ""); // 숫자만 추출
    const date = data["관람 날짜"];   // 예: 2025.08.31(일)
    const time = data["관람 시간"];   // 예: 17:00
    const session = data["회차"];     // 예: 6
    const seatNum = data["매수"] || data["좌석 수"];

    if (!phone) return res.status(400).json({ error: "전화번호 누락" });

    // 130회 대공연 맞춤 메시지 템플릿
    const message = `[Web발신]
안녕하세요, ${name}님
예매가 완료되었습니다.

<회장님의 위인전>

공연 일시: ${date} ${time} (${session}회차)
러닝 타임: 80분
좌석 수: ${seatNum}석
공연 장소: 예술공간 혜화
(서울특별시 종로구 혜화로 10-3)

문의: 기획팀장 65기 김윤형 010-4120-6938

공연 당일 10분 전까지 입장 부탁드립니다.

즐거운 관람 되세요!`;

    const result = await sendMessage({ phone, message });
    console.log(`${name}님에게 문자 발송 완료:`, result);
    res.status(200).json(result);

  } catch (e) {
    console.error("오류 발생:", e.message);
    res.status(500).json({ error: e.message });
  }
});

app.get("/", (req, res) => {
  res.send("✅ 130회 성균극회 알리고 프록시 서버 실행 중");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));