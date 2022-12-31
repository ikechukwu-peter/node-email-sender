import axios from "axios";
import { showAlert } from "./utils/show-alert";
import { ValidateEmail } from "./utils/validate-email";

//create an enum for response status type
enum TYPE {
  ERROR = "error",
  SUCCESS = "success",
}

//get variables from the dom
const subject = <HTMLInputElement>document.querySelector(".subject");
const recipients = <HTMLInputElement>document.querySelector(".recipients");
const message = <HTMLTextAreaElement>document.querySelector(".message");
const btn = <HTMLButtonElement>document.querySelector(".btn");

btn.addEventListener("click", async (e: MouseEvent) => {
  e.preventDefault();

  //validate
  if (subject.value.trim().length < 1) {
    showAlert(TYPE.ERROR, "Please provide a subject", 4);
    return;
  }

  if (recipients.value.length < 1) {
    showAlert(TYPE.ERROR, "Please provide one or more recipients", 4);
    return;
  }

  //split to array using the comma
  const getRecipients: string[] =
    recipients.value.length === 1
      ? [recipients.value]
      : recipients.value.split(",").filter((x) => x != "");

  const emailRecipients: string[] = [];

  for (let i = 0; i < getRecipients.length; i++) {
    if (!ValidateEmail(getRecipients[i].trim())) {
      showAlert(
        TYPE.ERROR,
        `${getRecipients[i]} is not a valid email address `,
        4
      );
      return;
    } else {
      emailRecipients.push(getRecipients[i].trim());
    }
  }

  //check for missing message
  if (message.value.trim().length < 1) {
    showAlert(TYPE.ERROR, "Please enter your message", 4);
    return;
  }

  //Send mail to server
  btn.innerHTML = "Sending...";
  try {
    const response = await axios.post("/email", {
      subject: subject.value.trim(),
      to: emailRecipients,
      message: message.value.trim(),
    });
    showAlert(TYPE.SUCCESS, response.data, 4);
    subject.value = "";
    message.value = "";
    recipients.value = "";
  } catch (error) {
    showAlert(TYPE.ERROR, error, 4);
  } finally {
    btn.innerHTML = "Send";
  }
});
