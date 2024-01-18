import React from "react";
import { Link, useNavigate } from "react-router-dom";
import avatar from "../assets/profile.png";
import styles from "../styles/user.module.css";
import toast, { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { passwordValidate } from "../helper/validate";
import { useAuthStore } from "../store/store";
import { verifyPassword } from "../helper/helper";
import useFetch from "../hooks/fetch.hook";
export default function Password() {
  const navigate = useNavigate();
  const { username } = useAuthStore((state) => state.auth);
  const [{ isLoading, apiData, serverError }] = useFetch(`/user/${username}`);
  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validate: passwordValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        let loginPromise = verifyPassword({
          username,
          password: values.password,
        });

        // Use toast.promise to show loading, success, and error messages
        toast.promise(loginPromise, {
          loading: "Creating...",
          success: <b>Login Successfully</b>,
          error: <b>Incorrect password</b>,
        });

        const res = await loginPromise; // Wait for the promise to resolve

        let { token } = res.data;
        localStorage.setItem("token", token);

        navigate("/profile");
      } catch (error) {
        // Handle errors here
        console.error("An error occurred:", error);

        // You can show a specific error message to the user if needed
        toast.error("An error occurred during login");
      }

      console.log(values);
    },
  });
  if (isLoading) return <h1 className="text-2xl font-bold">isLoading</h1>;
  if (serverError)
    return <h1 className="text-xl text-red-500">{serverError.message}</h1>;

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>

      <div className="flex justify-center items-center h-screen">
        <div className={styles.glasss}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">
              Hello {apiData?.firstName || apiData?.username}
            </h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              Explore More by connecting with us.
            </span>
          </div>

          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4">
              <img
                src={apiData?.profile || avatar}
                className={styles.profile_img}
                alt="avatar"
              />
            </div>

            <div className="textbox flex flex-col items-center gap-6">
              <input
                {...formik.getFieldProps("password")}
                className={styles.textbox}
                type="text"
                placeholder="password"
              />
              <button className={styles.btn} type="submit">
                Sign in
              </button>
            </div>

            <div className="text-center py-4">
              <span className="text-gray-500">
                Forgot password ?
                <Link className="text-red-500" to="/recover">
                  Recover Now
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
