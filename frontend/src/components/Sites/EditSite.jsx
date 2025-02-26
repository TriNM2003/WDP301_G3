import React, { useState } from "react";
import { Form, Input, Button, Card, Row, Col, Typography, Dropdown, Breadcrumb, Avatar, Upload, Modal, message } from "antd";
import {  EllipsisOutlined, ExclamationCircleOutlined, UploadOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Title } = Typography;

const EditSite = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [showDeactivate, setShowDeactivate] = useState(false);
    const [isDeactivateModalVisible, setIsDeactivateModalVisible] = useState(false);
    const [confirmSiteName, setConfirmSiteName] = useState("");
    const [siteName, setSiteName] = useState("Example Site");

    const handleSubmit = (values) => {
        console.log("Form values:", values);
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            console.log("Changes saved!");
        }, 2000);
    };

    const handleDeactivateSite = () => {
        setIsDeactivateModalVisible(true);
    };

    const handleConfirmDeactivate = () => {
        if (confirmSiteName === siteName) {
            setIsDeactivateModalVisible(false);
            message.success(`Site "${siteName}" has been deactivated.`);
            setConfirmSiteName("");
        } else {
            message.error("Site name does not match!");
        }
    };

    return (
        <div style={{ padding: "24px", minHeight: "100%" }}>
            <Row justify="space-between" align="middle" style={{ margin: "0 150px 20px" }}>
                {/* Breadcrumb */}
                <Col>
                    <Breadcrumb style={{ marginBottom: '16px' }}>
                        <Breadcrumb.Item><Link to="/site">Site</Link></Breadcrumb.Item>
                        <Breadcrumb.Item><Link to="/site/site-setting">Site Setting</Link></Breadcrumb.Item>
                    </Breadcrumb>
                    <Row>
                        <Title level={2}>Site Setting</Title>
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
                                onClick={handleDeactivateSite}
                            >
                                Deactivate Site
                            </Button>
                        }
                        trigger={["click"]}
                        onOpenChange={(visible) => setShowDeactivate(visible)}
                    >
                        <Button shape="rectangle" icon={<EllipsisOutlined />} style={{ marginBottom: "10px" }} />
                    </Dropdown>
                </Col>
            </Row>

            <Row justify="center">
                <Col xs={24} sm={16} md={12}>
                    <Card style={{ borderRadius: "5px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", padding: "0 100px" }}>
                        <Row justify="center" style={{ marginBottom: '20px' }}>
                            <Avatar size={100} style={{ borderRadius: '0' }} src="https://via.placeholder.com/100" />
                        </Row>
                        <Form.Item>
                            <Upload showUploadList={false} beforeUpload={() => false}>
                                <Button icon={<UploadOutlined />}>Upload Image</Button>
                            </Upload>
                        </Form.Item>
                        <Form layout="vertical" form={form} onFinish={handleSubmit}>
                            {/* Site Owner */}
                            <Form.Item label="Site Owner" name="siteOwner">
                                <p style={{ border: "1px solid #d9d9d9", borderRadius: "8px", padding: '5px', textAlign: "left" }}>Admin</p>
                            </Form.Item>

                            {/* Site Name */}
                            <Form.Item label="Site Name" name="siteName">
                                <Input placeholder="Enter site name" value={siteName} onChange={(e) => setSiteName(e.target.value)} />
                            </Form.Item>

                            {/* Save Change Button */}
                            <Form.Item style={{ textAlign: "left" }}>
                                <Button type="primary" htmlType="submit" loading={loading} style={{
                                    width: "100%",
                                    borderRadius: "0",
                                    fontSize: "16px",
                                    padding: "10px",
                                }}>
                                    Save Change
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>

            {/* Deactivate Confirmation Modal */}
            <Modal
                title={
                    <span>
                        <ExclamationCircleOutlined style={{ color: "red", fontSize: "24px", marginRight: "10px" }} />
                        Confirm Site Deactivation
                    </span>
                }
                open={isDeactivateModalVisible}
                onCancel={() => setIsDeactivateModalVisible(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsDeactivateModalVisible(false)}>Cancel</Button>,
                    <Button key="confirm" type="primary" danger onClick={handleConfirmDeactivate}>Deactivate</Button>
                ]}
            >
                
                <p>To confirm deactivation, please type the site name: <strong>{siteName}</strong></p>
                <Input
                    placeholder="Enter site name"
                    value={confirmSiteName}
                    onChange={(e) => setConfirmSiteName(e.target.value)}
                />
            </Modal>
        </div>
    );
};

export default EditSite;