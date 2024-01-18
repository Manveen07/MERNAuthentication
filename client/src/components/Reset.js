import React, { useEffect } from "react";
import { resetPassword } from "../helper/helper";
import styles from "../styles/user.module.css";
import toast, { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { ResetPasswordvalidate } from "../helper/validate";
import { Navigate, useNavigate } from "react-router-dom";
import useFetch from "../hooks/fetch.hook";

import { useAuthStore } from "../store/store";
export default function Reset() {
  const navigate = useNavigate();
  const { username } = useAuthStore((state) => state.auth);
  const [{ isLoading, apiData, status, serverError }] =
    useFetch("createResetSession");

  const formik = useFormik({
    initialValues: {
      password: "",
      confirm_pwd: "",
    },
    validate: ResetPasswordvalidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      let resetPromise = resetPassword({ username, password: values.password });
      toast.promise(resetPromise, {
        Loading: "updating password",
        success: <b>Reset succesfully....</b>,
        error: <b>Could not Reset</b>,
      });
      resetPromise.then(() => {
        navigate("/password");
      });
    },
  });
  if (isLoading) return <h1 className="text-2xl font-bold">isLoading</h1>;
  if (serverError)
    return <h1 className="text-xl text-red-500">{serverError.message}</h1>;
  if (status && status !== 201) return <Navigate to={"/password"}></Navigate>;
  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>

      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass} style={{ width: "50%", height: "80%" }}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Reset!</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              Enter new password.
            </span>
          </div>

          <form className="py-20" onSubmit={formik.handleSubmit}>
            <div className="textbox flex flex-col items-center gap-6">
              <input
                {...formik.getFieldProps("password")}
                className={styles.textbox}
                type="text"
                placeholder="New password"
              />
              <input
                {...formik.getFieldProps("confirm_pwd")}
                className={styles.textbox}
                type="text"
                placeholder=" confirm password"
              />
              <button className={styles.btn} type="submit">
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
