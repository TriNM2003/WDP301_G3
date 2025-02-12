import React, { useState } from "react";
import { Card, Input, Button, Typography, Modal, Form, message } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { Title } = Typography;

const ResetPassword = () => {
  const [form] = Form.useForm();
  const [isHovered, setIsHovered] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();

  const handleSaveChange = async () => {
    try {
        const token = localStorage.getItem("resetToken");
        if (!token) {
            message.error("Reset token is missing or expired. Please request again.");
            return;
        }

        const values = await form.validateFields();

        const response = await axios.post("http://localhost:9999/auth/reset-password", {
            password: values.password,
            confirmPassword: values.confirmPassword,
            token: token, // Gửi token trong body request
        });
        console.log(response.token);
        console.log(response.data);
        
        localStorage.removeItem("resetToken"); // Xóa token sau khi đặt lại mật khẩu
        message.success(response?.data?.status);
        
        
        setIsModalVisible(true); 
    } catch (error) {
        message.error(error.response?.data?.status);
        console.log(error.response?.data?.status);
        
    }
};


  const handleLoginRedirect = () => {
    navigate("/login"); // Chuyển đến trang đăng nhập
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <Card style={{ width: 450, textAlign: "center", borderRadius: 10, boxShadow: "0 4px 10px rgba(0,0,0,0.1)", padding: "20px" }}>
        <div style={{ marginBottom: "20px" }}>
          <img src="https://png.pngtree.com/png-clipart/20230925/original/pngtree-comic-style-login-icon-with-padlock-and-password-vector-png-image_12861183.png" alt="Reset Password" width="180px" />
        </div>

        <Title level={3}>Reset your password</Title>

        <Form form={form} layout="vertical">
          {/* Input New Password */}
          <Form.Item
            label="New password"
            name="password"
            rules={[
              { required: true, message: "Please enter your new password!" },
              { min: 6, message: "Password must be at least 6 characters long!" },
            ]}
            hasFeedback
          >
            <Input.Password size="large" placeholder="Enter your new password" prefix={<LockOutlined />} />
          </Form.Item>

          {/* Input Confirm Password */}
          <Form.Item
            label="Re-enter password"
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match!"));
                },
              }),
            ]}
            hasFeedback
          >
            <Input.Password size="large" placeholder="Re-enter your new password" prefix={<LockOutlined />} />
          </Form.Item>

          {/* Button Save Change */}
          <Button
            type="primary"
            size="large"
            block
            style={{
              backgroundColor: isHovered ? "#5cdbd3" : "#13c2c2",
              borderColor: isHovered ? "#5cdbd3" : "#13c2c2",
              borderRadius: "20px",
              transform: isHovered ? "scale(1.05)" : "scale(1)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleSaveChange}
          >
            Save Change
          </Button>
        </Form>
      </Card>

      {/* Modal thông báo thành công */}
      <Modal
  open={isModalVisible}
  maskClosable={false} // Không thể đóng modal khi click ra ngoài
  closable={false} // Ẩn nút X
  footer={[
    <div key="footer" style={{ textAlign: "center" }}>
      <Button key="login" type="primary" size="large" onClick={handleLoginRedirect}>
        Log in now
      </Button>
    </div>,
  ]}
>
  {/* Ảnh ở đầu modal */}
  <div style={{ textAlign: "center", marginBottom: "10px" }}>
    <img
      src="https://thumb.ac-illust.com/43/43279289c9190a2e4089b13f752a09fc_t.jpeg"
      alt="Success"
      width="100"
    />
  </div>

  {/* Title sau ảnh */}
  <div style={{ fontSize: "22px", fontWeight: "bold", textAlign: "center", marginBottom: "10px" }}>
    Password Reset Successful !
  </div>

  {/* Nội dung modal */}
  <p style={{ textAlign: "center", fontSize: "16px" }}>Your password has been successfully updated.</p>
</Modal>


    </div>
  );
};

export default ResetPassword;