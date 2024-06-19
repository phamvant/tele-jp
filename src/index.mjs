/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

import https from "https";
import { callAI } from "./openai.js";

export const handler = async (event) => {
  const body = JSON.parse(event.body);

  if (body.message) {
    const chatId = body.message.chat.id;
    const resMsg = await callAI(body.message.text);

    const responseMessage = {
      chat_id: chatId,
      text: resMsg,
    };

    const postData = JSON.stringify(responseMessage);

    const options = {
      hostname: "api.telegram.org",
      port: 443,
      path: `/bot${process.env.TELEGRAM_BOT}/sendMessage`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(postData),
      },
    };

    await new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        res.setEncoding("utf8");
        res.on("data", (chunk) => {
          console.log(`BODY: ${chunk}`);
        });
        res.on("end", () => {
          console.log("No more data in response.");
          resolve();
        });
      });

      req.on("error", (e) => {
        console.error(`Problem with request: ${e.message}`);
        reject(e);
      });

      req.write(postData);
      req.end();
    });

    return {
      statusCode: 200,
      body: JSON.stringify("Message sent!"),
    };
  } else {
    return {
      statusCode: 404,
      body: JSON.stringify(event.body),
    };
  }
};
