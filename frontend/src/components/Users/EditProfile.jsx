import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Row, Col, message, Breadcrumb, Menu, Upload, Modal, Avatar, Form } from 'antd';
import { UploadOutlined, ExclamationCircleOutlined, UserOutlined, LockOutlined, LogoutOutlined, DeleteOutlined, } from '@ant-design/icons';
import { green, red, gray } from "@ant-design/colors";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
const EditProfile = () => {
    const [selectedKey, setSelectedKey] = useState('1');
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [isConfirmDeleteModalVisible, setIsConfirmDeleteModalVisible] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [form, setForm] = useState({  
        fullName: '',
        address: '',
        dob: '',
        phoneNumber: '',
        username: '',
        email: '',
        userAvatar: '',
    });
    const [errors, setErrors] = useState({});
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:9999/users/user-profile', {
            headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
        })
            .then(response => {
                setForm(response.data);
                setImagePreview(response.data.userAvatar);
            })
            .catch(error => {
                message.error("Failed to load user data");
            });
    }, []);


    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

     // Xử lý chọn ảnh và hiển thị ngay lập tức
     const handleFileChange = ({ file }) => {
        const fileReader = new FileReader();
        fileReader.onload = () => setImagePreview(fileReader.result);
        fileReader.readAsDataURL(file);
        setSelectedFile(file);
    };

    // Xử lý lưu thông tin user
    const handleSave = async () => {
        const formData = new FormData();
        formData.append("fullName", form.fullName);
        formData.append("address", form.address);
        formData.append("dob", form.dob);
        formData.append("phoneNumber", form.phoneNumber);

        if (selectedFile) {
            formData.append("userAvatar", selectedFile);  // Gửi file ảnh
        }

        axios.put('http://localhost:9999/users/edit-profile', formData, {
            headers: { 
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
            console.log(response.data);
            messageApi.open({ content: 'Profile updated successfully!', duration: 2, type: 'success' });
            setImagePreview(response.data.userAvatar);  // Cập nhật ảnh Cloudinary
            setTimeout(window.location.reload(), 3000);
        })
        .catch(error => {
            message.error(error.response?.data?.message );
        });
    };

    const handleDiscard = () => {
        setForm({ 
            fullName: '',
            address: '',
            dob: '',
            phoneNumber: '', });
        setErrors({});
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        window.location.href = '/auth/login';
    };

    const handleDeleteAccount = async () => {
        axios.delete('http://localhost:9999/users/delete-user', {
            headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
        })
            .then(() => {
                localStorage.removeItem('accessToken');
                messageApi.success('Account deleted successfully!', 2);
                window.location.reload();
                window.location.href = '/auth/login';
            })
            .catch(error => {
                messageApi.error(error.response?.data?.message);
            });

        setIsConfirmDeleteModalVisible(false);
        setIsDeleteModalVisible(false);
    };

    const handleMenuClick = (e) => {
        if (e.key === '4') {
            setIsDeleteModalVisible(true);
        } else {
            setSelectedKey(e.key);
        }
    };


    return (
        <div style={{ minHeight: '100vh', width: '100%', padding: '20px' }}>
        {contextHolder}
        <Row gutter={[16, 16]} justify="center">
        <Col xs={24} sm={8} md={6} lg={4}>
                    <Breadcrumb style={{ marginBottom: '16px' }}>
                        <Breadcrumb.Item><Link to="/profile/profile-info">Profile</Link></Breadcrumb.Item>
                        <Breadcrumb.Item><Link to="/profile/edit-profile">Edit Profile</Link></Breadcrumb.Item>
                    </Breadcrumb>

                    <Menu mode="vertical" selectedKeys={[selectedKey]}  onClick={handleMenuClick}
                        style={{ width: '100%', borderRadius: '8px', border: 'none', backgroundColor: '#fafafa', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
                        <Menu.Item key="1" icon={<UserOutlined />} style={{ borderRadius: '8px', borderRight: '3px solid #1890ff' }}>
                            <Link to="/profile/edit-profile">Profile settings</Link>
                        </Menu.Item>
                        <Menu.Item key="2" icon={<LockOutlined />} style={{ borderRadius: '8px' }}>
                            <Link to="/profile/change-password">Change password</Link>
                        </Menu.Item>
                        <Menu.Item key="3" icon={<LogoutOutlined />} style={{ borderRadius: '8px' }} onClick={handleLogout}>
                            Logout
                        </Menu.Item>
                        <Menu.Item key="4" icon={<DeleteOutlined />} style={{ borderRadius: '8px', color: red[6] }}>
                            Delete Account
                        </Menu.Item>
                    </Menu>
                </Col>
            <Col xs={24} sm={16} md={12} lg={10}>
            <Card style={{ width: '100%', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
                        <h2 style={{ textAlign: 'center' }}>Edit Profile</h2>
                        
                        <Row justify="center" style={{ marginBottom: '20px' }}>
                            <Avatar size={100} src={imagePreview || "https://via.placeholder.com/100"} />
                        </Row>

                        <Form layout="vertical">
                            <Form.Item label="Avatar">
                            <Upload 
                            showUploadList={false}
                            beforeUpload={() => false}  // Ngăn tải lên tự động
                            onChange={handleFileChange}
                        >
                            <Button icon={<UploadOutlined />}>Upload Image</Button>
                        </Upload>
                            </Form.Item>

                            <Form.Item label="Username">
                                <div style={{ backgroundColor: '#f0f0f0', padding: '8px', borderRadius: '6px' , textAlign:'left' }}>
                                    {form.username}
                                </div>
                            </Form.Item>

                            <Form.Item label="Email">
                                <div style={{ backgroundColor: '#f0f0f0', padding: '8px', borderRadius: '6px', textAlign:'left' }}>
                                    {form.email}
                                </div>
                            </Form.Item>

                            <Form.Item label="Full Name" validateStatus={errors.fullName ? "error" : ""} help={errors.fullName}>
                                <Input name="fullName" value={form.fullName} onChange={handleChange} />
                            </Form.Item>

                            <Form.Item label="Address" validateStatus={errors.address ? "error" : ""} help={errors.address}>
                                <Input name="address" value={form.address} onChange={handleChange} />
                            </Form.Item>

                            <Form.Item label="Date of Birth" validateStatus={errors.dob ? "error" : ""} help={errors.dob}>
                                <Input name="dob" type="date" value={form.dob ? new Date(form.dob).toISOString().split('T')[0] : ''} onChange={handleChange} />
                            </Form.Item>

                            <Form.Item label="Phone Number" validateStatus={errors.phoneNumber ? "error" : ""} help={errors.phoneNumber}>
                                <Input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" onClick={handleSave} style={{ marginRight: '10px' }}>Save</Button>
                                <Button danger onClick={handleDiscard}>Discard</Button>
                            </Form.Item>
                        </Form>
                    </Card>
            </Col>
        </Row >
        <Modal
                title="Confirm Account Deletion"
                visible={isDeleteModalVisible}
                onCancel={() => setIsDeleteModalVisible(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsDeleteModalVisible(false)}>Cancel</Button>,
                    <Button key="delete" type="primary" danger onClick={() => setIsConfirmDeleteModalVisible(true)}>Delete Account</Button>
                ]}
            >
                <p><b>Full Name:</b> {form.fullName}</p>
                <p><b>Email:</b> {form.email}</p>
                <p><b>Phone Number:</b> {form.phoneNumber}</p>
                <p><b>Address:</b> {form.address}</p>
            </Modal>

            {/* Modal xác nhận trước khi xóa */}
            <Modal
                title="Are you sure?"
                visible={isConfirmDeleteModalVisible}
                onCancel={() => setIsConfirmDeleteModalVisible(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsConfirmDeleteModalVisible(false)}>Cancel</Button>,
                    <Button key="confirmDelete" type="primary" danger onClick={handleDeleteAccount}>Confirm Delete</Button>
                ]}
            >
                <ExclamationCircleOutlined style={{ color: 'red', fontSize: '24px', marginBottom: '10px' }} />
                <p>Are you sure you want to delete your account? This action is irreversible.</p>
            </Modal>
        </div>
        

    )
};

export default EditProfile;
