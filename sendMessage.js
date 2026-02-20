const https = require("https");
const querystring = require("querystring");

const sendMessage = ({ phone, message }) => {
  return new Promise((resolve, reject) => {
    const postData = querystring.stringify({
      key: process.env.ALIGO_API_KEY,
      user_id: process.env.ALIGO_USER_ID,
      sender: process.env.ALIGO_SENDER_PHONE,
      receiver: phone,
      msg: message,
      msg_type: "LMS",
      title: "[성균극회 130회 대공연 예매 안내]", // 130회로 수정
      testmode_yn: "N", 
    });

    const options = {
      hostname: "apis.aligo.in",
      path: "/send/",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(postData),
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error("알리고 응답 파싱 에러"));
        }
      });
    });

    req.on("error", (e) => reject(e));
    req.write(postData);
    req.end();
  });
};

module.exports = { sendMessage };