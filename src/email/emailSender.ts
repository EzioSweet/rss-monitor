import { SMTPClient } from "emailjs";
import { Logger } from "../logger/logger";
import { type MailConfig } from "../config/Config";

export async function sendEmail(
  mailConfig: MailConfig,
  subject: string,
  html: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    const client = new SMTPClient({
      user: mailConfig.smtp.user,
      password: mailConfig.smtp.password,
      host: mailConfig.smtp.host,
      port: mailConfig.smtp.port,
      ssl: true,
    });

    const message = {
      text: "您的邮件客户端不支持 HTML 格式的邮件。",
      from: mailConfig.from,
      to: mailConfig.to.join(", "),
      subject: subject,
      attachment: [{ data: html, alternative: true }],
    };

    client.send(message, (err, message) => {
      if (err) {
        Logger.error(`Failed to send email: ${err}`);
        return reject(err);
      }
      Logger.info("Email sent successfully.");
      resolve();
    });
  });
}
