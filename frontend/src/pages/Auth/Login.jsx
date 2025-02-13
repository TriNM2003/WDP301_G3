import { Layout} from "antd";
import {Outlet} from "react-router-dom"
import React from "react";


const Login = () => {
  return (
    <Layout
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: "url('/images/Login_Background_Image.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Outlet />
    </Layout>
  );
};

export default Login;
