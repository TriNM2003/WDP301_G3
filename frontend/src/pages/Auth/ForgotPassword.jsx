import React, { useState } from "react";
import { Card, Input, Button, Typography, message } from "antd";
import { MailOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleSendEmail = () => {
    if (!email) {
      message.error("Please enter your email!");
      return;
    }
    message.success("Password reset email sent successfully!");
    // Gọi API reset password tại đây
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
        <div style={{ marginBottom: "20px"}}>
          <img src="https://t3.ftcdn.net/jpg/04/92/75/18/360_F_492751838_Ybun2zwpQC8AZv11AwZLdXJk4cUrTt5z.jpg" alt="Forgot Password" width="190px" />
        </div>

        <Title level={3}>Forgot your password?</Title>
        <Text>Enter your email so that we can send you a password reset link.</Text>

        {/* Input Email */}
        <div style={{ marginTop: "20px",textAlign: "left" }}>
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
            backgroundColor: isHovered ? "#5cdbd3" : "#13c2c2",
            borderColor: isHovered ? "#5cdbd3" : "#13c2c2",
            borderRadius: "20px",
            transform: isHovered ? "scale(1.05)" : "scale(1)", 
            transition: "all 0.3s ease",
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleSendEmail}
        >
          Send Email
        </Button>
        {/* Quay lại Login */}
        <div style={{ marginTop: "15px" }}>
          <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => navigate("/login")}>
            Back to Login
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ForgotPassword;
