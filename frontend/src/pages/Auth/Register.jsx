import React, { useState } from "react";
import { Layout, Form, Input, Button, Typography, Divider, Row, Col, message, Modal } from "antd";
import { GoogleOutlined, EyeInvisibleOutlined, EyeTwoTone, LoadingOutlined } from "@ant-design/icons";
import { blue, gray, red } from "@ant-design/colors";

const { Title, Text, Link } = Typography;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  // Xử lý khi nhấn nút Register
  const handleRegister = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      messageApi.open({
        type: "success",
        content: "Registration successful!",
      });
      form.resetFields();
    }, 2000);
  };

  return (
    <Layout
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: "url('/images/Register_Background_Image.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "20px",
      }}
    >
      {contextHolder} {/* Hiển thị thông báo */}

      <Modal
        open={true}
        footer={null}
        closable={false}
        width={900}
        centered
        style={{
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
          marginTop: "10vh",
          marginBottom: "10vh"
        }}
      >
        <div style={{ padding: "30px" }}>
          <Row gutter={10} align="middle">
            <Col span={24} style={{ textAlign: "center", display: "inline" }}>
              <img
                src="/images/logo-placeholder-image.png"
                alt="SkrumIO Logo"
                style={{ width: 70 }}
              />
              <Title>SkrumIO</Title>
            </Col>
          </Row>

          <Row gutter={32} align="middle">
            {/* Cột bên trái - Form đăng ký */}
            <Col span={14}>
              <Title level={4} style={{ textAlign: "center" }}>Create an account</Title>
              <Text style={{ display: "block", textAlign: "center", marginBottom: 20 }}>
                Already have an account? <Link href="/login">Log in</Link>
              </Text>

              <Form
                layout="vertical"
                form={form}
                onFinish={handleRegister}
                requiredMark={false}
              >
                <Form.Item
                  label="Username"
                  name="username"
                  rules={[
                    { required: true, message: "Username is required!" },
                    { min: 3, message: "Username must be at least 3 characters!" }
                  ]}
                  hasFeedback
                >
                  <Input placeholder="Enter your username" />
                </Form.Item>

                <Form.Item
                  label="Email address"
                  name="email"
                  rules={[
                    { required: true, message: "Email is required!" },
                    { type: "email", message: "Invalid email format!" }
                  ]}
                  hasFeedback
                >
                  <Input placeholder="Enter your email" />
                </Form.Item>

                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    { required: true, message: "Password is required!" },
                    { min: 5, message: "Password must be at least 5 characters!" },
                    { pattern: /^\S*$/, message: "Password cannot contain spaces!" }
                  ]}
                  hasFeedback
                >
                  <Input.Password
                    placeholder="Enter your password"
                    iconRender={(visible) =>
                      visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                  />
                </Form.Item>

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
                      }
                    })
                  ]}
                  hasFeedback
                >
                  <Input.Password
                    placeholder="Re-enter your password"
                    iconRender={(visible) =>
                      visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                  />
                </Form.Item>

                {/* Nút Register với hiệu ứng loading */}
                <Button
                  type="primary"
                  block
                  style={{
                    backgroundColor: loading ? blue[4] : blue[6],
                    color: gray[13],
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "45px",
                    fontSize: "16px",
                    borderRadius: "25px",
                  }}
                  htmlType="submit"
                  disabled={loading}
                >
                  {loading ? <LoadingOutlined spin /> : "Register"}
                </Button>
              </Form>
            </Col>

            {/* Cột phân chia */}
            <Col span={1}>
              <Divider type="vertical" style={{ height: "100%", background: "#ccc", width: "1px" }} />
            </Col>

            {/* Cột bên phải - Đăng ký với Google */}
            <Col span={9} style={{ textAlign: "center" }}>
              <Divider>Or</Divider>

              <Button
                style={{
                  width: "100%",
                  backgroundColor: "#fff",
                  color: "#000",
                  borderRadius: "25px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                  height: "45px",
                  border: "1px solid #ccc",
                  boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
                }}
                icon={<GoogleOutlined style={{ fontSize: "20px", marginRight: "10px", color: "#FF0000" }} />}
                onClick={() => alert("Google Signup Clicked")}
              >
                Sign up with Google
              </Button>
            </Col>
          </Row>
        </div>
      </Modal>
    </Layout>
  );
};

export default Register;
