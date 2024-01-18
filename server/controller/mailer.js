import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import ENV from "../config.js";

let nodeConfig = {
  //   host: "smtp.ethereal.email",
  //
  service: "gmail",
  secure: false,
  auth: {
    user: ENV.MYEMAIL,
    pass: ENV.MYPASS,
  },
};
let transporter = nodemailer.createTransport(nodeConfig);
let Mailgenerator = new Mailgen({
  theme: "default",
  product: {
    name: "Mailgen",
    link: "https://mailgen.js/",
  },
});
export const registerMail = async (req, res) => {
  const { username, userEmail, text, subject } = req.body;
  var email = {
    body: {
      name: username,
      intro: text || "hello there",
      outro: "if you have any question just reply we'd like to help",
    },
  };
  var emailbody = Mailgenerator.generate(email);
  let message = {
    from: ENV.MYEMAIL,
    to: userEmail,
    subject: subject || " Signup succesfull ",
    html: emailbody,
  };
  transporter
    .sendMail(message)
    .then(() => {
      return res
        .status(201)
        .send({ msg: "You should have recived an email from us " });
    })
    .catch((error) => res.status(500).send({ error }));
};
