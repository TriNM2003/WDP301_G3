import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Row, Col, message, Menu, Modal, Input, Breadcrumb } from 'antd';
import { ExclamationCircleOutlined, LockOutlined, UserOutlined, LogoutOutlined, DeleteOutlined } from '@ant-design/icons';
import { green, red } from "@ant-design/colors";
import { Link } from 'react-router-dom';
import axios from 'axios';

const ChangePassword = () => {
    const [form, setForm] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [selectedKey, setSelectedKey] = useState('2');
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [errors, setErrors] = useState({});
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loading, setLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        let newErrors = {};

        if (!form.oldPassword) newErrors.oldPassword = 'Old password is required';
        if (!form.newPassword) {
            newErrors.newPassword = 'New password is required';
        } else {
            if (form.newPassword.length < 8) newErrors.newPassword = 'Password must be at least 8 characters';
            if (form.newPassword.includes(" ")) newErrors.newPassword = 'Password must not contain spaces';
        }

        if (!form.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your new password';
        } else if (form.newPassword !== form.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    useEffect(() => {
        axios.get('http://localhost:9999/users/user-profile', {
            headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
        })
            .then(response => setForm(response.data))
            .catch(() => message.error("Failed to load user data"));
    }, []);

    const handleSave = async () => {
        if (!validateForm()) return;

        await axios.put('http://localhost:9999/users/change-password',
            {
                oldPassword: form.oldPassword,
                newPassword: form.newPassword,
                confirmPassword: form.confirmPassword,
            },
            {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
            })
            .then(() => {
                messageApi.open({ content: 'Password changed successfully!', duration: 2, type: 'success' });
                setForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
                setErrors({});
            })
            .catch(error => setErrors({ oldPassword: error.response?.data?.message }));
    };

    const handleDiscard = () => {
        setForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
        setErrors({});
    };

    const handleDeleteRequest = async () => {
        if (!password) {
            setPasswordError("Please enter your password");
            return;
        }

        setLoading(true);
        axios.post('http://localhost:9999/users/send-delete-email', { password }, {
            headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
        })
            .then(() => {
                message.success("A confirmation email has been sent to your email address.");
                setIsDeleteModalVisible(false);
                setPassword('');
                setPasswordError('');
            })
            .catch(error => {
                setPasswordError(error.response?.data?.message);
            })
            .finally(() => setLoading(false));
    };

    const handleMenuClick = (e) => {
        if (e.key === '4') {
            setIsDeleteModalVisible(true);
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
            <Row gutter={[16, 16]} justify="center" style={{ minHeight: '100vh', padding: '20px' }}>
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
                                <Button type="primary" onClick={handleSave} style={{ marginRight: '10px' }}>Save changes</Button>
                                <Button danger onClick={handleDiscard}>Discard changes</Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>

            <Modal
                title="Confirm Account Deletion"
                open={isDeleteModalVisible}
                onCancel={() => setIsDeleteModalVisible(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsDeleteModalVisible(false)}>Cancel</Button>,
                    <Button key="delete" type="primary" danger loading={loading} onClick={handleDeleteRequest}>Delete Account</Button>
                ]}
            >
                <p>Please enter your password to proceed with account deletion.</p>
                <Input.Password value={password} onChange={(e) => { setPassword(e.target.value); setPasswordError(''); }} placeholder="Enter your password" />
                {passwordError && <p style={{ color: "red", marginTop: "5px" }}>{passwordError}</p>}
            </Modal>
        </>
    );
};

export default ChangePassword;
