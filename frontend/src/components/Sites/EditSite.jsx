import React, { useState } from "react";
import {
    Layout,
    Menu,
    Form,
    Input,
    Button,
    Card,
    Row,
    Col,
    Tooltip,
    Typography,
    Dropdown,
    Breadcrumb,
    Avatar,
    Upload
} from "antd";
import {
    SettingOutlined,
    ProjectOutlined,
    TeamOutlined,
    LockOutlined,
    EllipsisOutlined,
    ExclamationCircleOutlined,
    RightOutlined,
    LeftOutlined,
    UploadOutlined
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Sider, Content } = Layout;
const { Title } = Typography;

const EditSite = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [showDeactivate, setShowDeactivate] = useState(false);
    const [selectedKey, setSelectedKey] = useState("1");

    const handleSubmit = (values) => {
        console.log("Form values:", values);
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            console.log("Changes saved!");
        }, 2000);
    };

    const handleMenuClick = (key) => {
        setSelectedKey(key);
    };

    const menuItems = [
        { key: "1", label: "Site Setting ", icon: <SettingOutlined /> },
        { key: "2", label: "Project Management ", icon: <ProjectOutlined /> },
        { key: "3", label: "Access Management ", icon: <LockOutlined /> },
        { key: "4", label: "Team Management ", icon: <TeamOutlined /> },
    ];

    return (
        <Layout style={{ minHeight: "100vh", display: "flex" }}>
            {/* Sidebar Menu */}
            <Sider
                width={270}
                style={{
                    background: "#fff",
                    padding: "20px",
                    borderRight: "1px solid #ddd",
                    borderTop: "1px solid #ddd",
                    borderBottom: "1px solid #ddd"
                }}
            >
                <Title level={5} style={{ marginBottom: "20px", textAlign: "center",  borderBottom: "1px solid #ddd"}}>
                    Your Site
                </Title>
                <Menu
                    mode="inline"
                    selectedKeys={[selectedKey]}
                    style={{ borderRight: 0 }}
                >
                    {menuItems.map((item) => (
                        <Menu.Item
                            key={item.key}
                            icon={item.icon}
                            onClick={() => handleMenuClick(item.key)}
                            style={{
                                display: "flex",
                                textAlign: "left",
                            }}
                        >
                            {item.label}
                        </Menu.Item>
                    ))}
                </Menu>
            </Sider>

            {/* Main Content */}
            <Layout style={{ padding: "24px", width: "100%" }}>
                <Content>
                    <Row justify="space-between" align="middle" style={{ marginLeft: "150px", marginRight: "150px", marginBottom: "20px" }}>
                        {/* Breadcrumb */}
                        <Col>
                            <Breadcrumb style={{ marginBottom: '16px' }}>
                                <Breadcrumb.Item><Link to="/site">Site</Link></Breadcrumb.Item>
                                <Breadcrumb.Item><Link to="/site/site-setting">Site Setting</Link></Breadcrumb.Item>
                            </Breadcrumb>
                            {/* Title */}
                            <Row style={{ justifyContent: "left" }} >
                                <Title level={3}>Site Setting</Title>
                            </Row>
                        </Col>


                        {/* More Options Button */}
                        <Col>
                            <Dropdown
                                overlay={
                                    <Button
                                        type="primary"
                                        danger
                                        style={{
                                            width: "100%",
                                            maxWidth: "180px",
                                            height: "45px",
                                            fontSize: "16px",
                                            borderRadius: "6px",
                                            display: showDeactivate ? "block" : "none",
                                        }}
                                        onClick={() => alert("Deactivate Site")}
                                    >
                                        Deactivate Site
                                    </Button>
                                }
                                trigger={["click"]}
                                onOpenChange={(visible) => setShowDeactivate(visible)}
                            >
                                <Button
                                    shape="rectangle"
                                    icon={<EllipsisOutlined />}
                                    style={{ marginBottom: "10px" }}
                                />
                            </Dropdown>
                        </Col>
                    </Row>




                    {/* Form Section */}
                    <Row justify="center">
                        <Col xs={24} sm={16} md={12}>
                            <Card
                                style={{
                                    borderRadius: "8px",
                                    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                                    padding: "0 150px",
                                }}
                            >
                                <Row justify="center" style={{ marginBottom: '20px' }}>
                                    <Avatar size={100} style={{ borderRadius: '0' }} src={"https://via.placeholder.com/100"} />
                                </Row>
                                <Form.Item>
                                    <Upload
                                        showUploadList={false}
                                        beforeUpload={() => false}  // Ngăn tải lên tự động
                                    >
                                        <Button icon={<UploadOutlined />}>Upload Image</Button>
                                    </Upload>
                                </Form.Item>
                                <Form
                                    layout="vertical"
                                    form={form}
                                    onFinish={handleSubmit}
                                    initialValues={{
                                        siteOwner: "Nigga",
                                    }}
                                >

                                    {/* Site Name */}
                                    <Form.Item label="Site Owner" name="siteOwner">
                                        <p style={{border: "1px solid #d9d9d9", borderRadius: "8px", padding: '5px', textAlign: "left"}}>Bigger</p>
                                    </Form.Item>

                                    <Form.Item label="Site Name" name="siteName">
                                        <Input placeholder="Enter site name" />
                                    </Form.Item>




                                    {/* Save Change Button */}
                                    <Form.Item style={{ textAlign: "left" }}>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            loading={loading}
                                            style={{
                                                width: "35%",
                                                borderRadius: "6px",
                                                fontSize: "16px",
                                                padding: "10px",
                                            }}
                                        >
                                            Save Change
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </Card>
                        </Col>
                    </Row>
                </Content>
            </Layout>
        </Layout>
    );
};

export default EditSite;
