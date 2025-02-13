import React, { useEffect, useState } from "react";
import { Steps, Button, message, Card, Typography, Spin } from "antd";
import { CheckCircleFilled, MailFilled, SmileOutlined, LoadingOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const { Step } = Steps;
const { Title, Text } = Typography;

const ActiveAccount = () => {
  const [current, setCurrent] = useState(1); // Mặc định là bước "Verify Email"
  const [isWaiting, setIsWaiting] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Lấy token từ URL khi người dùng truy cập link active từ email
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      // Lưu token vào localStorage
      localStorage.setItem("activationToken", token);

      // Xóa token khỏi URL mà không cần reload trang
      window.history.replaceState({}, document.title, "/active-account");

      // Gửi token để xác thực tài khoản
      verifyAccount(token);
    } else {
      const storedToken = localStorage.getItem("activationToken");
      if (!storedToken) {
        navigate("/not-found"); // Nếu không có token nào thì chuyển hướng
      }
    }
  }, [location, navigate]);

  const verifyAccount = async (token) => {
    setIsWaiting(true);
    try {
      const response = await axios.post("http://localhost:9999/auth/verify-account", { token });

      if (response.status === 200) {
        message.success(response?.data?.message);
        setCurrent(2);
        localStorage.removeItem("activationToken"); // Xóa token sau khi kích hoạt thành công
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
  
      const response = await axios.post("http://localhost:9999/auth/send-activation-email", { token });
  
      message.success({ content: "Activation email sent successfully! Check your inbox.", key: "activate" });
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to send activation email!");
    } finally {
      setIsWaiting(false);
    }
  };

  const goToHome = () => {
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
            {current === 2 && "Welcome to our service!"}
          </Text>

          {current === 1 && (
            <Button type="primary" size="large" style={{ backgroundColor: "#1890ff", borderColor: "#1890ff" }} onClick={sendActivationEmail}>
              ACTIVATE ACCOUNT
            </Button>
          )}
          {current === 2 && (
            <Button type="primary" size="large" style={{ backgroundColor: "#1890ff", borderColor: "#1890ff" }} onClick={goToHome}>
              Come to Homepage
            </Button>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ActiveAccount;
