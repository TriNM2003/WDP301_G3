import React, { useEffect, useState, useContext } from "react";
import { Steps, Button, message, Card, Typography, Spin } from "antd";
import { CheckCircleFilled, MailFilled, SmileOutlined, LoadingOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../../context/AppContext";

const { Step } = Steps;
const { Title, Text } = Typography;

const ActiveAccount = () => {
  const [current, setCurrent] = useState(1);
  const [isWaiting, setIsWaiting] = useState(false);
  const [tempAccessToken, setTempAccessToken] = useState(null);
  const [tempUser, setTempUser] = useState(null);
  const [tempAccessTokenExp, setTempAccessTokenExp] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { setAccessToken, setUser } = useContext(AppContext);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("activationToken", token);
      window.history.replaceState({}, document.title, "/active-account");

      if (current < 2 && localStorage.getItem("activationToken")) {
        verifyAccount(token);
      }
    } else {
      const storedToken = localStorage.getItem("activationToken");
      if (!storedToken && current < 2) {
        navigate("/not-found");
      }
    }
  }, [location, navigate, current]);

  const verifyAccount = async (token) => {
    setIsWaiting(true);
    try {
      const response = await axios.post("http://localhost:9999/auth/verify-account", { token });

      if (response.status === 200) {
        if (!response.data.alreadyActivated) {
          message.success({ content: "Account activated successfully!", key: "activate" });
        }
        // Lưu token và user vào state tạm thời, nhưng không đăng nhập ngay
        const { accessToken, user, accessTokenExp } = response.data;
        if (accessToken && user) {
          setTempAccessToken(accessToken);
          setTempAccessTokenExp(accessTokenExp)
          setTempUser(user);
        }
        setCurrent(2);
      } else {
        message.error("Activation failed!");
        navigate("/not-found");
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Something went wrong!");
      navigate("/not-found");
    } finally {
      setIsWaiting(false);
    }
  };

  const sendActivationEmail = async () => {
    setIsWaiting(true);
    message.loading({ content: "Sending activation email...", key: "activate", duration: 2 });

    try {
      const token = localStorage.getItem("activationToken");

      if (!token) {
        message.error("Activation token is missing! Please login again.");
        setIsWaiting(false);
        return;
      }

      await axios.post("http://localhost:9999/auth/send-activation-email", { token });

      message.success({ content: "Activation email sent successfully! Check your inbox.", key: "activate" });
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to send activation email!");
    } finally {
      setIsWaiting(false);
    }
  };

  const goToHome = () => {
    if (tempAccessToken && tempUser) {
      localStorage.setItem("accessToken", tempAccessToken);
      localStorage.removeItem("activationToken");
      localStorage.setItem("accessTokenExp", tempAccessTokenExp);
      localStorage.setItem("userId", tempUser._id)
      
      setUser(tempUser);
    }

    navigate("/home");
  };

  return (
    <div style={{ backgroundColor: "#f5f5f5", padding: "120px 0", minHeight: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Card
          style={{
            width: 800,
            textAlign: "center",
            borderRadius: 10,
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            padding: "20px",
          }}
        >
          <Title style={{ marginBottom: "50px", marginTop: "1px" }} level={3}>
            Activate your Account
          </Title>

          {/* Progress Steps */}
          <Steps current={current} size="small" style={{ marginBottom: "20px" }}>
            <Step title="Create Account" icon={<CheckCircleFilled style={{ color: "#1890ff" }} />} />
            <Step
              title="Verify Email"
              icon={
                isWaiting ? (
                  <Spin indicator={<LoadingOutlined style={{ fontSize: 18, color: "#1890ff" }} spin />} />
                ) : (
                  <MailFilled style={{ color: current >= 1 ? "#1890ff" : "#d9d9d9" }} />
                )
              }
            />
            <Step title="Enjoy Service" icon={<SmileOutlined style={{ color: current === 2 ? "#1890ff" : "#d9d9d9" }} />} />
          </Steps>

          <Text style={{ display: "block", marginBottom: "20px" }}>
            {current === 0 && "Your account has been created successfully."}
            {current === 1 && "Check your email and click the verification link."}
            {current === 2 && "Welcome to our service! Click 'Come to Homepage' to continue."}
          </Text>

          {current === 1 && (
            <Button
              type="primary"
              size="large"
              style={{ backgroundColor: "#1890ff", borderColor: "#1890ff" }}
              onClick={sendActivationEmail}
            >
              ACTIVATE ACCOUNT
            </Button>
          )}
          {current === 2 && (
            <Button
              type="primary"
              size="large"
              style={{ backgroundColor: "#1890ff", borderColor: "#1890ff" }}
              onClick={goToHome}
            >
              Come to Homepage
            </Button>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ActiveAccount;
