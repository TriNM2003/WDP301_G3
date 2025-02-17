import React, { useEffect, useState } from "react";
import { Steps, Button, message, Card, Typography,Spin  } from "antd";
import { CheckCircleFilled, MailFilled, SmileOutlined,LoadingOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Step } = Steps;
const { Title, Text } = Typography;

const ActiveAccount = ({ isEmailVerified }) => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();
  const [isWaiting, setIsWaiting] = useState(false);

  useEffect(() => {
    if (isEmailVerified) {
      setCurrent(2); // Nếu email đã xác thực, chuyển đến bước "Enjoy Service"
    } else {
      setCurrent(1); // Nếu chưa, thì ở bước "Verify Email"
    }
  }, [isEmailVerified]);

  const activateAccount = () => {
    setIsWaiting(true); // Hiển thị hiệu ứng loading
    message.loading({ content: "Processing activation...", key: "activate", duration: 2 });

    // Giả lập thời gian chờ xác nhận (API call giả định)
    setTimeout(() => {
      setIsWaiting(false);
      message.success({ content: "Account activated!", key: "activate" });
      setCurrent(2); // Chuyển đến bước "Enjoy Service"
    }, 5000); // Chờ 3 giây để mô phỏng API
  };

  const afterActiveAccount = () => {
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
      
        <Title style={{ marginBottom: "50px", marginTop: "1px" }} level={3}>Activate your Account</Title>

          {/* Progress Steps */}
          <Steps current={current} size="small" style={{ marginBottom: "20px" }}>
            <Step title="Create Account" icon={<CheckCircleFilled style={{ color: "#1890ff" }} />} />
            <Step 
              title="Verify Email" 
              icon={
                isWaiting 
                  ? <Spin indicator={<LoadingOutlined style={{ fontSize: 18, color: "#1890ff" }} spin />} /> 
                  : <MailFilled style={{ color: current >= 1 ? "#1890ff" : "#d9d9d9" }} />
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
            <Button type="primary" size="large" style={{ backgroundColor: "#1890ff", borderColor: "#1890ff" }} onClick={activateAccount}>
              ACTIVATE ACCOUNT
            </Button>
          )}
          {current === 2 && (
            <Button type="primary" size="large" style={{ backgroundColor: "#1890ff", borderColor: "#1890ff" }} onClick={afterActiveAccount}>
              Come to Homepage
            </Button>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ActiveAccount;
