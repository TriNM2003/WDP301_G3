import React, { useState } from "react";
import { Layout, Menu, Form, Input, Button, Card, Row, Col, Typography, Dropdown, Breadcrumb, Avatar, Upload, Select } from "antd";
import { ProjectOutlined, EllipsisOutlined, UploadOutlined, UserSwitchOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Sider, Content } = Layout;
const { Title } = Typography;

const EditProject = () => {
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
                <Title level={5} style={{ marginBottom: "20px", textAlign: "center", borderBottom: "1px solid #ddd" }}>
                    <ArrowLeftOutlined /> Project Setting
                </Title>
                <Menu
                    mode="inline"
                    selectedKeys={[selectedKey]}
                    style={{ borderRight: 0 }}
                >
                    <Menu.Item key="1" icon={<ProjectOutlined />} style={{ textAlign: 'left' }}>
                        <Link to="/project/project-setting">Project settings</Link>
                    </Menu.Item>
                    <Menu.Item key="2" icon={<UserSwitchOutlined />} style={{ textAlign: 'left' }}>
                        <Link to="/project/project-setting">Access</Link>
                    </Menu.Item>
                </Menu>
            </Sider>

            {/* Main Content */}
            <Layout style={{ padding: "24px", width: "100%" }}>
                <Content>
                    <Row justify="space-between" align="middle" style={{ marginLeft: "150px", marginRight: "150px", marginBottom: "20px" }}>
                        {/* Breadcrumb */}
                        <Col>
                            <Breadcrumb>
                                <Breadcrumb.Item><Link to="/projects">Projects</Link></Breadcrumb.Item>
                                <Breadcrumb.Item><Link to="/projects/project-setting">Project Setting</Link></Breadcrumb.Item>
                            </Breadcrumb>
                            {/* Title */}
                            <Row style={{ justifyContent: "left" }} >
                                <Title level={3}>Project Setting</Title>
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
                                        onClick={() => alert("Delete Project")}
                                    >
                                        Delete Project
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
                                }}
                            >
                                <Row justify="center" style={{ marginBottom: '20px' }}>
                                    <Avatar size={100} style={{ borderRadius: '0' }} src={"https://steamuserimages-a.akamaihd.net/ugc/948474504894470428/A2935C316283E70322CFF16DB671B2B61C602507/"} />
                                </Row>
                                <Form.Item>
                                    <Upload
                                        showUploadList={false}
                                        beforeUpload={() => false}
                                    >
                                        <Button icon={<UploadOutlined />}>Upload Image</Button>
                                    </Upload>
                                </Form.Item>
                                <Form
                                    layout="vertical"
                                    form={form}
                                    onFinish={handleSubmit}
                                >


                                    <Form.Item
                                        label="Project Name"
                                        name="label3"
                                        rules={[
                                            { required: true, message: "This field is required!" },
                                        ]}
                                    >
                                        <Input placeholder="Enter site name" />
                                    </Form.Item>

                                    <Form.Item
                                        label="Leader"
                                    >
                                        <Select
                                            defaultValue="lucy"
                                            style={{ width: '100%' }}
                                            options={[
                                                { value: 'jack', label: 'Jack' },
                                                { value: 'lucy', label: 'Lucy' },
                                                { value: 'Yiminghe', label: 'yiminghe' },
                                                { value: 'disabled', label: 'Disabled', disabled: true },
                                            ]}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label="Default assignee"
                                    >
                                        <Select
                                            defaultValue="lucy"
                                            style={{ width: '100%' }}
                                            options={[
                                                { value: 'jack', label: 'Jack' },
                                                { value: 'lucy', label: 'Lucy' },
                                            ]}
                                        />
                                    </Form.Item>




                                    {/* Save Change Button */}
                                    <Form.Item style={{ textAlign: "left" }}>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            loading={loading}
                                            style={{
                                                width: "20%",
                                                borderRadius: "6px",
                                                fontSize: "16px",
                                                padding: "20px",
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

export default EditProject;
