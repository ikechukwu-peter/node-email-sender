import * as dotenv from "dotenv";
dotenv.config();
import express, { Request, Response, Application } from "express";
import { ValidateEmail } from "./lib/validate-email";
import { IOptions } from "./@types/email-options.d";
import { sendMail } from "./lib/mailer";

const app: Application = express();

app.use(express.static("public"));

//configure view engine
app.set("views", "views");
app.set("view engine", "pug");

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.render("index", { title: "Node Email Sender" });
});

app.post("/email", async (req: Request, res: Response) => {
  const { to, subject, message } = req.body;

  if (!subject) {
    res.status(400).send(`Please provide a subject`);
  }

  if (!message) {
    res.status(400).send(` Please provide a message`);
  }

  if (!to || to.length < 1) {
    res.status(400).send(` Please provide a list of recipients`);
  }

  for (let i = 0; i < to.length; i++) {
    if (!ValidateEmail(to[i])) {
      res.status(400).send(`${to[i]} is an invalid email`);
      break;
    }
  }

  try {
    const options: IOptions = {
      from: process.env.MAIL_USER,
      to,
      subject,
      message,
    };

    const response = await sendMail(options);
    console.log(response);

    if (response) {
      res.send("Email sent");
    } else {
      res.status(500).send("An error occured while processing your request");
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
