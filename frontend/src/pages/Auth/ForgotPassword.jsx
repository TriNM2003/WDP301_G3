import React, { useState } from "react";
import { Card, Input, Button, Typography, message } from "antd";
import { MailOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false); // Trạng thái loading khi gửi email
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});

  const handleSendEmail = async () => {
    if (!email.trim()) {
        message.error("Please enter your email!");
        return;
    }

    setLoading(true);
    const hideMessage = message.loading("Sending email...", 0); // Hiển thị loading

    try {
        const response = await fetch("http://localhost:9999/auth/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();
        hideMessage(); // Ẩn loading

        if (response.ok) {
            localStorage.setItem("resetToken", data.token); // Lưu token
            message.success("Password reset email sent successfully! Check your inbox.");
        } else {
            message.error(data.status);
        }
    } catch (error) {
        setErrors({ email: error.response?.data?.message });
        message.error(error.response?.data?.message);
    } finally {
        setLoading(false);
    }
};




  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <Card
        style={{
          width: 450,
          textAlign: "center",
          borderRadius: 10,
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          padding: "10px",
        }}
      >
        {/* Biểu tượng minh họa */}
        <div style={{ marginBottom: "20px" }}>
          <img src="https://t3.ftcdn.net/jpg/04/92/75/18/360_F_492751838_Ybun2zwpQC8AZv11AwZLdXJk4cUrTt5z.jpg" alt="Forgot Password" width="190px" />
        </div>

        <Title level={3}>Forgot your password?</Title>
        <Text>Enter your email so that we can send you a password reset link.</Text>

        {/* Input Email */}
        <div style={{ marginTop: "20px", textAlign: "left" }}>
          <Text strong>Email</Text>
          <Input
            size="large"
            placeholder="e.g. username@gmail.com"
            prefix={<MailOutlined />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ marginTop: "5px", borderRadius: "8px" }}
          />
        </div>

        {/* Button gửi email */}
        <Button
          type="primary"
          size="large"
          block
          style={{
            marginTop: "20px",
            borderRadius: "20px",
            transform: "scale(1)",
            transition: "all 0.3s ease",
          }}
          onClick={handleSendEmail}
          loading={loading} // Hiển thị trạng thái loading khi đang gửi email
        >
          Send Email
        </Button>

        {/* Quay lại Login */}
        <div style={{ marginTop: "15px" }}>
          <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => navigate("/auth/login")}>
            Back to Login
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ForgotPassword;
