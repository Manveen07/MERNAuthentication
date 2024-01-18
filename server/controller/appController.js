import UserModel from "../model/usermodel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ENV from "../config.js";
import otpGenerator from "otp-generator";

//middleware configuration
export async function verifyuser(req, res, next) {
  try {
    const { username } = req.method == "GET" ? req.query : req.body;
    let exists = await UserModel.findOne({ username });
    if (!exists) return res.status(404).send({ error: "Cant find user " });
    next();
  } catch (error) {
    return res.status(404).send({ error: "Authentication Error" });
  }
}

export async function register(req, res) {
  try {
    const { username, password, profile, email } = req.body;

    const existingUserName = UserModel.findOne({ username }).exec();
    const existingUserEmail = UserModel.findOne({ email }).exec();

    Promise.all([existingUserName, existingUserEmail])
      .then(([existingUserByName, existingUserByMail]) => {
        if (existingUserByName) {
          throw { error: "Please use a unique username" };
        }
        if (existingUserByMail) {
          throw { error: "Email already in use" };
        }

        if (password) {
          bcrypt
            .hash(password, 10)
            .then((hashedPassword) => {
              const user = new UserModel({
                username,
                password: hashedPassword,
                profile: profile || "",
                email,
              });
              return user.save();
            })
            .then((result) =>
              res.status(201).send({ msg: "User registered successfully" })
            )
            .catch((error) => res.status(500).send({ error }));
        }
      })
      .catch((error) => {
        return res.status(500).send(error);
      });
  } catch (error) {
    return res.status(500).send(error);
  }
}
export async function login(req, res) {
  const { username, password } = req.body;

  try {
    UserModel.findOne({ username })
      .then((user) =>
        bcrypt
          .compare(password, user.password)
          .then((passwordCheck) => {
            if (!passwordCheck) {
              return res.status(404).send({ error: "Dont have password" });
            }
            //create jwt
            const token = jwt.sign(
              {
                userId: user._id,
                username: user.username,
              },
              ENV.JWT_SECRET,
              { expiresIn: "24h" }
            );
            return res.status(200).send({
              msg: "Login Successful...!",
              username: user.username,
              token,
            });
          })
          .catch((error) =>
            res.status(404).send({ error: "password mismatch" })
          )
      )
      .catch((error) => res.status(404).send({ error: "Username not found" }));
  } catch (error) {
    return res.status(500).send({ error });
  }
}

export async function getUser(req, res) {
  const { username } = req.params;

  try {
    if (!username) return res.status(501).send({ error: "Invalid username" });
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    const { password, ...rest } = Object.assign({}, user.toJSON());

    return res.status(201).send(rest);
  } catch (error) {
    return res.status(404).send({ error: "Username not found" });
  }
}
export async function updateUser(req, res) {
  const { userId } = req.user;
  try {
    const body = req.body;
    if (userId) {
      const user = await UserModel.updateOne({ _id: userId }, body);
      if (!user) {
        return res.status(401).send({ error: "User not found" });
      }
      return res.status(200).send({ msg: "Record updated successfully" });
    } else {
      return res.status(401).send({ error: "User not found !" });
    }
  } catch (error) {
    return res.status(401).send({ error });
  }
}
export async function generateotp(req, res) {
  req.app.locals.OTP = await otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  res.status(201).send({ code: req.app.locals.OTP });
}
export async function verifyOTP(req, res) {
  let { code } = req.query;
  if (parseInt(req.app.locals.OTP) == parseInt(code)) {
    req.app.locals.OTP = null;
    req.app.locals.resetsession = true;
    return res.status(201).send({ msg: "Verified succesfully" });
  }
  return res.status(400).send({ error: "Invalid otp" });
}

export async function createResetSession(req, res) {
  if (req.app.locals.resetsession) {
    return res.status(201).send({ flag: req.app.locals.resetsession });
  }
  return res.status(440).send({ error: "Session expired" });
}

export async function resetPassword(req, res) {
  try {
    const { username, password } = req.body;
    if (!req.app.locals.resetsession) {
      return res.status(440).send({ error: "Session expired" });
    }

    // Find the user based on the username
    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(404).send({ error: "Username not found" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password
    await UserModel.updateOne(
      { username: user.username },
      { password: hashedPassword }
    );
    req.app.locals.resetsession = false;

    return res.status(201).send({ msg: "Password reset successfully" });
  } catch (error) {
    return res.status(500).send({ error: "Unable to reset password" });
  }
}
