import React, { useState, useContext, useEffect } from "react";
import { Form, Input, Button, Card, Row, Col, Typography, Dropdown, Breadcrumb, Avatar, Upload, Modal, message, Spin } from "antd";
import { EllipsisOutlined, ExclamationCircleOutlined, UploadOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from '../../context/AppContext';
import axios from "axios";

const { Title } = Typography;

const EditSite = () => {
    const { showNotification, siteAPI, site, accessToken, user } = useContext(AppContext);
    const [loading, setLoading] = useState(true);
    const [showDeactivate, setShowDeactivate] = useState(false);
    const [isDeactivateModalVisible, setIsDeactivateModalVisible] = useState(false);
    const [confirmSiteName, setConfirmSiteName] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [hasPermission, setHasPermission] = useState(false);
    const [isDeactivated, setIsDeactivated] = useState(false);
    const navigate = useNavigate();
    const [siteData, setSiteData] = useState({
        siteName: '',
        siteAvatar: '',
        siteOwner: '',
        siteDescription: '',
        siteSlug:''
    });

    useEffect(() => {
        if (site._id && accessToken) {
            fetchSiteData();
        }
    }, [site, accessToken]);

    const fetchSiteData = async () => {
    try {
        //  Bước 1: Fetch dữ liệu user
        const userResponse = await axios.get(`http://localhost:9999/users/user-profile`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
        });

        if (!userResponse.data) {
            message.error("Failed to load user data.");
            return;
        }

        const fetchedUser = userResponse.data;
        const isAdmin = fetchedUser?.roles?.some(role => role?.roleName === "admin");

        //  Bước 2: Fetch dữ liệu của site
        const siteResponse = await axios.get(`${siteAPI}/${site._id}/get-by-id`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
        });

        if (!siteResponse.data) {
            message.error("Failed to load site data.");
            return;
        }

        const { siteName, siteAvatar, siteMember, siteDescription, siteSlug, siteStatus } = siteResponse.data;
        if (siteStatus === "deactivated") {
            setIsDeactivated(true);
            setLoading(false);
            setSiteData([])
            return;
        }

        //  Bước 3: Kiểm tra role trong site
        const userInSite = siteMember?.find(member => member?._id?._id.toString() === fetchedUser?._id.toString());
        const isSiteOwner = userInSite ? userInSite?.roles.includes("siteOwner") : false;

        //  Nếu user không phải admin và không phải siteOwner → Chặn truy cập
        if (!isAdmin && !isSiteOwner) {
            message.error("Access Denied! You don't have permission to edit this site.");
            navigate("/site");
            return;
        }

        //  Nếu là admin hoặc siteOwner, cho phép truy cập
        setHasPermission(true);
        setSiteData({
            siteName,
            siteAvatar,
            siteOwner: isSiteOwner ? fetchedUser.username : "Unkhown",
            siteDescription,
            siteSlug
        });

        setImagePreview(siteAvatar);
        setShowDeactivate(isAdmin || isSiteOwner);
    } catch (error) {
        console.error("Error fetching site data:", error);
        message.error("Failed to load site data.");
    } finally {
        setLoading(false);
    }
};

    const handleFileChange = (file) => {
        setSelectedFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("siteName", siteData?.siteName);
            formData.append("siteDescription", siteData?.siteDescription);
            formData.append("siteSlug", siteData?.siteSlug);
            if (selectedFile) formData.append("siteAvatar", selectedFile);

            await axios.put(`${siteAPI}/${site._id}/edit`, formData, {
                headers: { 
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    "Content-Type": "multipart/form-data"
                }
            });

            message.success("Site updated successfully!");
            showNotification("Site Updated", `The site "${siteData.siteName}" has been updated successfully.`);
            fetchSiteData();
        } catch (error) {
            console.error("Error updating site:", error);
            message.error("Failed to update site.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeactivateSite = () => {
        setIsDeactivateModalVisible(true);
    };

    const handleConfirmDeactivate = async () => {
        if (confirmSiteName !== siteData?.siteName) {
            message.error("Site name does not match!");
            return;
        }

        try {
            await axios.put(`${siteAPI}/${site._id}/deactivate`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
            });

            message.success(`Site "${siteData.siteName}" has been deactivated.`);
            showNotification("Site Deactivated", `The site "${siteData.siteName}" has been deactivated.`);
            setIsDeactivateModalVisible(false);
            navigate("/site"); // Chuyển hướng sau khi deactive
        } catch (error) {
            console.error("Error deactivating site:", error);
            message.error("Failed to deactivate site.");
        }
    };

    if (isDeactivated) {
        return (
            <div style={{ textAlign: "center", marginTop: "100px" }}>
                <ExclamationCircleOutlined style={{ fontSize: "50px", color: "red" }} />
                <Title level={2} style={{ color: "red" }}>This site has been deactivated.</Title>
                <p>Please contact the administrator if you need further assistance.</p>
                <Button type="primary" onClick={() => navigate("/home")}>Go Back</Button>
            </div>
        );
    }

    if (!hasPermission) return null;

    return (
        <div style={{ padding: "24px", minHeight: "100%" }}>
            <Row justify="space-between" align="middle" style={{ margin: "0 100px 20px" }}>
                <Col>
                    <Breadcrumb style={{ marginBottom: '16px' }}>
                        <Breadcrumb.Item><Link to="/site">Site</Link></Breadcrumb.Item>
                        <Breadcrumb.Item><Link to="/site/site-setting">Site Setting</Link></Breadcrumb.Item>
                    </Breadcrumb>
                    <Row>
                        <Title level={2}>Site Setting</Title>
                    </Row>
                </Col>

                {showDeactivate && (
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
                )}
            </Row>

            <Row justify="center">
                <Col xs={24} sm={16} md={12}>
                    <Card style={{ borderRadius: "5px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", padding: "0 100px" }}>
                        <Row justify="center" style={{ marginBottom: '20px' }}>
                            <Avatar size={100} style={{ borderRadius: '0' }} src={imagePreview || "https://via.placeholder.com/100"} />
                        </Row>
                        <Form.Item>
                            <Upload showUploadList={false} beforeUpload={handleFileChange}>
                                <Button icon={<UploadOutlined />}>Upload Image</Button>
                            </Upload>
                        </Form.Item>
                        <Form layout="vertical" onFinish={handleSubmit}>
                            <Form.Item label="Site Owner">
                                <p style={{ border: "1px solid #d9d9d9", borderRadius: "8px", padding: '5px', textAlign: "left" }}>
                                    {siteData.siteOwner}
                                </p>
                            </Form.Item>

                            <Form.Item label="Site Name">
                                <Input value={siteData.siteName} onChange={(e) => setSiteData({ ...siteData, siteName: e.target.value })} />
                            </Form.Item>

                            <Form.Item label="Site Description">
                                <Input.TextArea value={siteData.siteDescription} onChange={(e) => setSiteData({ ...siteData, siteDescription: e.target.value })} />
                            </Form.Item>

                            <Form.Item label="Site Slug">
                                <Input value={siteData.siteSlug} onChange={(e) => setSiteData({ ...siteData, siteSlug: e.target.value })} />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={loading} style={{ width: "100%" }}>
                                    Save Changes
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
                <p>To confirm deactivation, please type the site name: <strong>{siteData.siteName}</strong></p>
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