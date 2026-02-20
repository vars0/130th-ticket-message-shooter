const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { sendMessage } = require("./sendMessage");

const app = express();
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

app.post("/webhook", async (req, res) => {
  try {
    const data = req.body;

    const name = data["이름"];
    const phone = (data["전화번호 (ex. 01012345678)"] || "").replace(/[^0-9]/g, ""); // 숫자만
    
    // 예매 회차 처리: "2회차 3/6(금) 19시 30분 (0/70명)" -> "2회차 3/6(금) 19시 30분"만 추출
    const rawSession = data["예매 회차"] || "";
    const cleanSession = rawSession.split(" (")[0]; // 첫 번째 괄호 앞부분만 가져옴

    if (!phone || !name) {
      return res.status(400).json({ error: "필수 정보(이름/번호) 누락" });
    }

    // 130회 대공연 맞춤 메시지 템플릿
    const message = `안녕하세요, ${name}님
예매가 완료되었습니다.

<회장님의 위인전>

공연 일시: ${cleanSession}
러닝 타임: 80분
공연 장소: 예술공간 혜화
(서울특별시 종로구 혜화로 10-3)

문의: 기획팀장 65기 김윤형 010-4120-6938

공연 당일 10분 전까지 입장 부탁드립니다.

즐거운 관람 되세요!`;

console.log("------------------------------------------");
    console.log("📱 [문자 발송 시뮬레이션]");
    console.log("수신 번호:", phone);
    console.log("메시지 내용:\n", message);
    console.log("------------------------------------------");

    // 가짜 응답 전송 (알리고 API 성공 응답과 비슷한 형태)
    res.status(200).json({ result_code: "1", message: "테스트 모드 전송 완료" });
    // const result = await sendMessage({ phone, message });
    // console.log(`${name}님(${phone}) 발송 성공:`, cleanSession);
    
    // res.status(200).json(result);
  } catch (e) {
    console.error("오류 발생:", e.message);
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));