import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Row, Col, message, Menu, Modal, Input, Breadcrumb } from 'antd';
import { ExclamationCircleOutlined, LockOutlined, UserOutlined, LogoutOutlined, DeleteOutlined } from '@ant-design/icons';
import { green, red } from "@ant-design/colors";
import { Link } from 'react-router-dom';
import axios from 'axios';
import authAxios from '../../utils/authAxios'
const ChangePassword = () => {
    const [form, setForm] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [selectedKey, setSelectedKey] = useState('2');
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [errors, setErrors] = useState({});
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        authAxios.get('http://localhost:9999/users/user-profile')
            .then(response => setForm(response.data))
            .catch(() => message.error("Failed to load user data"));
    }, []);

    const validateInput = (name, value) => {
        let error = '';

        if (name === "newPassword") {
            if (value.length < 8) error = "New password must be at least 8 characters";
            else if (/\s/.test(value)) error = "New password must not contain spaces";
            else if (value === form.oldPassword) error = "New password must not be the same as the old password";
        }

        if (name === "confirmPassword" && value !== form.newPassword) {
            error = "New password and confirmation do not match";
        }

        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        validateInput(name, value); 
    };

    const validateForm = () => {
        let newErrors = {};

        if (!form.oldPassword) newErrors.oldPassword = 'Old password is required';
        if (!form.newPassword) newErrors.newPassword = 'New password is required';
        if (!form.confirmPassword) newErrors.confirmPassword = 'Please confirm your new password';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) return;
        setLoading(true);
        setTimeout(async () => {
            await authAxios.put('http://localhost:9999/users/change-password',
                {
                    oldPassword: form.oldPassword,
                    newPassword: form.newPassword,
                    confirmPassword: form.confirmPassword,
                })
                .then(() => {
                    message.success("Password changed successfully");
                    setForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
                    setErrors({});
                })
                .catch(error => {
                    const errorMessage = error.response?.data?.message;
                    if (errorMessage === "New password must not be the same as the old password") {
                        setErrors({ newPassword: errorMessage });
                    } else {
                        setErrors({ oldPassword: errorMessage });
                    }
                })
                .finally(() => setLoading(false));
        }, 1000);
    };

    const handleDiscard = () => {
        setForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
        setErrors({});
    };

    // Xử lý mở Modal xóa tài khoản
    const openDeleteModal = () => {
        setEmail('');
        setEmailError('');
        setIsDeleteModalVisible(true);
    };

    // Xử lý đóng Modal xóa tài khoản
    const closeDeleteModal = () => {
        setEmail('');
        setEmailError('');
        setIsDeleteModalVisible(false);
    };

    const handleDeleteRequest = async () => {
        if (!email) {
            setEmailError("Please enter your email");
            return;
        }

        setDeleteLoading(true);
        authAxios.post('http://localhost:9999/users/send-delete-email', { email })
            .then(() => {
                message.success("A confirmation email has been sent to your email address.");
                setIsDeleteModalVisible(false);
                setEmail('');
                setEmailError('');
            })
            .catch(error => {
                setEmailError(error.response?.data?.message);
            })
            .finally(() => setDeleteLoading(false));
    };

    const handleMenuClick = (e) => {
        if (e.key === '4') {
            openDeleteModal();
        } else {
            setSelectedKey(e.key);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        window.location.href = '/auth/login';
    };

    return (
        <>
            {contextHolder}
            <Row gutter={[16, 16]} justify="center" style={{ minHeight: '100%', padding: '20px' }}>
                <Col xs={24} sm={8} md={6} lg={4}>
                    <Breadcrumb style={{ marginBottom: '16px' }}>
                        <Breadcrumb.Item><Link to="/profile/profile-info">Profile</Link></Breadcrumb.Item>
                        <Breadcrumb.Item><Link to="/profile/change-password">Change Password</Link></Breadcrumb.Item>
                    </Breadcrumb>

                    <Menu mode="vertical" selectedKeys={[selectedKey]} onClick={handleMenuClick}
                        style={{ width: '100%', borderRadius: '8px', border: 'none', backgroundColor: '#fafafa', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
                        <Menu.Item key="1" icon={<UserOutlined />} style={{ borderRadius: '8px' }}>
                            <Link to="/profile/edit-profile">Profile settings</Link>
                        </Menu.Item>
                        <Menu.Item key="2" icon={<LockOutlined />} style={{ borderRadius: '8px', borderRight: '3px solid #1890ff' }}>
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
                        <h2 style={{ textAlign: 'center' }}>Change Password</h2>
                        <Form layout="vertical">
                            <Form.Item label="Old Password" validateStatus={errors.oldPassword ? "error" : ""} help={errors.oldPassword}>
                                <Input.Password name="oldPassword" value={form.oldPassword} onChange={handleChange} />
                            </Form.Item>

                            <Form.Item label="New Password" validateStatus={errors.newPassword ? "error" : ""} help={errors.newPassword}>
                                <Input.Password name="newPassword" value={form.newPassword} onChange={handleChange} />
                            </Form.Item>

                            <Form.Item label="Confirm New Password" validateStatus={errors.confirmPassword ? "error" : ""} help={errors.confirmPassword}>
                                <Input.Password name="confirmPassword" value={form.confirmPassword} onChange={handleChange} />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" onClick={handleSave} loading={loading} style={{ marginRight: '10px' }}>Save changes</Button>
                                <Button danger onClick={handleDiscard}>Discard changes</Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>

            <Modal
                title="Confirm Account Deletion"
                open={isDeleteModalVisible}
                onCancel={closeDeleteModal}
                footer={[
                    <Button key="cancel" onClick={closeDeleteModal}>Cancel</Button>,
                    <Button key="delete" type="primary" danger loading={deleteLoading} onClick={handleDeleteRequest}>Delete Account</Button>
                ]}
            >
                <p>Please enter your email to proceed with account deletion.</p>
                <Input value={email} onChange={(e) => { setEmail(e.target.value); setEmailError(''); }} placeholder="Enter your email" />
                {emailError && <p style={{ color: "red", marginTop: "5px" }}>{emailError}</p>}
            </Modal>
        </>
    );
};

export default ChangePassword;
