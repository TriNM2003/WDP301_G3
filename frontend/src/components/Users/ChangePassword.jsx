import React, { useState } from 'react';
import { Card, Button, Form, Row, Col, message, Menu, Modal, Input, Breadcrumb } from 'antd';
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
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [errors, setErrors] = useState({});
    const [modalSuccess, setModalSuccess] = useState(false);

    const handleMenuClick = (e) => {
        if (e.key === '4') {
            setIsModalVisible(true);
        } else {
            setSelectedKey(e.key);
        }
    };

    const handleDeleteConfirm = () => {
        setIsModalVisible(false);
        console.log("Account deleted");
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        let newErrors = {};
        if (!form.oldPassword) newErrors.oldPassword = 'Old password is required';
        if (!form.newPassword) newErrors.newPassword = 'New password is required';
        if (!form.confirmPassword) newErrors.confirmPassword = 'Please confirm your new password';
        if (form.newPassword !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        await axios.put('http://localhost:9999/users/change-password', {
            userId: "67a9b1664bc75243014a4d17",
            oldPassword: form.oldPassword,
            newPassword: form.newPassword,
        }).then((response) => {
            console.log(response.data);
            setModalSuccess(true);
            setForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
            setErrors({});
        }).catch((error) => {
            console.log(error?.response?.data?.message);
            setErrors({ oldPassword: error.response?.data?.message });
        });

    };

    const handleDiscard = () => {
        setForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
        setErrors({});
    };

    return (
        <Row>
            <Col span={2}></Col>
            <Col span={4}>
                <Breadcrumb style={{ margin: '16px 0' }}
                    items={[
                        {
                            title: <a href="/profile/profile-info">Profile</a>,
                        },
                        {
                            title: <a href="/profile/change-password">Change Password</a>,
                        },
                    ]}
                />

                <Menu mode="vertical" selectedKeys={[selectedKey]} onClick={handleMenuClick} style={{ width: 250, borderRadius: '0', border: 'none', backgroundColor: '#fafafa' }}>
                    <Menu.Item key="1"><Link to="/profile/edit-profile">Profile settings</Link></Menu.Item>
                    <Menu.Item key="2" style={{ borderRadius: '0', borderRight: '3px solid #1890ff' }}><Link to="/profile/change-password"> Change password</Link></Menu.Item>
                    <Menu.Item key="3">Logout</Menu.Item>
                    <Menu.Item key="4" style={{ color: red[6] }}>Delete Account</Menu.Item>
                </Menu>
            </Col>
            <Col span={18} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '80%', textAlign: 'left' }}>
                    <h2>Change Password</h2>
                </div>
                <Card style={{ width: '80%', padding: '20px', borderRadius: '0' }}>
                    <Row gutter={[8, 8]} style={{ marginBottom: '20px' }}>
                        <Col span={6} style={{ textAlign: 'right' }}><label>Old password</label></Col>
                        <Col span={12}><Input.Password name="oldPassword" value={form.oldPassword} onChange={handleChange} placeholder="Old password" style={{ borderRadius: '0' }} /></Col>
                        <Col span={6} style={{ color: 'red' }}>{errors.oldPassword}</Col>
                    </Row>
                    <Row gutter={[8, 8]} style={{ marginBottom: '20px' }}>
                        <Col span={6} style={{ textAlign: 'right' }}><label>New password</label></Col>
                        <Col span={12}><Input.Password name="newPassword" value={form.newPassword} onChange={handleChange} placeholder="New password" style={{ borderRadius: '0' }} /></Col>
                        <Col span={6} style={{ color: 'red' }}>{errors.newPassword}</Col>
                    </Row>
                    <Row gutter={[8, 8]} style={{ marginBottom: '20px' }}>
                        <Col span={6} style={{ textAlign: 'right' }}><label>Confirm new password</label></Col>
                        <Col span={12}><Input.Password name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Confirm new password" style={{ borderRadius: '0' }} /></Col>
                        <Col span={6} style={{ color: 'red' }}>{errors.confirmPassword}</Col>
                    </Row>
                    <Row gutter={[8, 8]} style={{ marginTop: '20px',}}>
                        <Col span={9} style={{ textAlign: 'right',  marginLeft: '5px' }}>
                            <Button type="primary" onClick={handleSave} style={{ backgroundColor: green[6], borderColor: 'green', borderRadius: '0' }}>Save changes</Button>
                        </Col>
                        <Col span={13} style={{ marginLeft: '22px' }}>
                            <Button type="primary" danger onClick={handleDiscard} style={{ borderRadius: '0', backgroundColor: red[6] }}>Discard changes</Button>
                        </Col>
                    </Row>
                </Card>
            </Col>
            <Modal title="Success" visible={modalSuccess} onOk={() => setModalSuccess(false)} footer={[<Button key="ok" type="primary" onClick={() => setModalSuccess(false)}>OK</Button>]}>
                <p>Password changed successfully!</p>
            </Modal>
        </Row>
    );
};

export default ChangePassword;