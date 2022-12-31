import nodemailer from "nodemailer";
import path from "path";
import { IOptions } from "../@types/email-options";

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST as string,
  port: process.env.MAIL_PORT as unknown as number,
  requireTLS: false,
  secure: true,
  auth: {
    user: process.env.MAIL_USER as string,
    pass: process.env.MAIL_PASS as string,
  },
  logger: false,
});

transporter.verify(function (error: unknown) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

export const sendMail = async (options: IOptions) => {
  const mailOptions = {
    from: options.from,
    to: options.to,
    subject: options.subject,
    html: `<h2> ${options.message} </h2>`,
    text: options.message,
    attachments: [
      {
        filename: "welcome.jpg",
        path: path.resolve(__dirname, "../../public/assets/welcome.jpg"),
        cid: "welcome_image",
      },
    ],
  };

  try {
    const mailInfo = await transporter.sendMail(mailOptions);
    return Promise.resolve(mailInfo);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};
