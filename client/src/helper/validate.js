import toast from "react-hot-toast";
import { authenticate } from "./helper";

export async function usernamevalidate(values) {
  const errors = usernameVerfy({}, values);
  if (values.username) {
    const { status } = await authenticate(values.username);
    if (status !== 200) {
      errors.exist = toast.error("user doesnot exist !");
    }
  }
  return errors;
}
export async function passwordValidate(values) {
  const errors = passwordVerify({}, values);

  return errors;
}
function emailVerify(error = {}, values) {
  if (!values.email) {
    error.email = toast.error("Email Required...!");
  } else if (values.email.includes(" ")) {
    error.email = toast.error("Wrong Email...!");
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    error.email = toast.error("Invalid email address...!");
  }

  return error;
}
function usernameVerfy(error = {}, values) {
  if (!values.username) {
    error.username = toast.error("Username is required");
  } else if (values.username.includes(" ")) {
    error.username = toast.error("Invalid username");
  }
  return error;
}
function passwordVerify(errors = {}, values) {
  const specialChars = /[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/;

  if (!values.password) {
    errors.password = toast.error("password is required");
  } else if (values.password.includes(" ")) {
    errors.password = toast.error("wrong password");
  } else if (values.password.length < 4) {
    errors.password = toast.error("Password must be at least 4 characters");
  } else if (!specialChars.test(values.password)) {
    errors.password = toast.error("Password must have special character");
  }
  return errors;
}

export async function ResetPasswordvalidate(values) {
  const errors = passwordVerify({}, values);
  if (values.password !== values.confirm_pwd) {
    errors.exist = toast.error("Password not match ...!");
  }
  return errors;
}
export async function registerValidation(values) {
  const errors = usernameVerfy({}, values);
  passwordVerify(errors, values);
  emailVerify(errors, values);

  return errors;
}
export async function profileValidation(values) {
  const errors = emailVerify({}, values);
  return errors;
}
