import React, { useState } from 'react';
import { Card, Button, Input, Row, Col, message } from 'antd';
import { green, red } from "@ant-design/colors";

const ChangePassword = () => {
    const [form, setForm] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        if (form.newPassword !== form.confirmPassword) {
            message.error('New password and confirmation do not match!');
            return;
        }
        message.success('Password changed successfully!');
    };

    return (
        <div style={{ width: '100%', minHeight: '100vh', background: '#fff' }}>
            <div style={{ width: '100%', height: '150px', background: 'linear-gradient(to right, #a1c4fd, #c2e9fb)', marginBottom: '20px' }}></div>
            <Row justify="center">
                <Col span={12}>
                    <h2>Change password</h2>
                    <Card style={{ padding: '20px', borderRadius: '0', border: '1px solid #ccc' }}>
                        <Row gutter={[16, 16]} align="middle">
                            <Col span={8}><label>Old password</label></Col>
                            <Col span={16}><Input.Password name="oldPassword" value={form.oldPassword} onChange={handleChange} placeholder="Old password" style={{ borderRadius: '0' }} /></Col>
                        </Row>
                        <Row gutter={[16, 16]} align="middle" style={{ marginTop: '10px' }}>
                            <Col span={8}><label>New password</label></Col>
                            <Col span={16}><Input.Password name="newPassword" value={form.newPassword} onChange={handleChange} placeholder="New password" style={{ borderRadius: '0' }} /></Col>
                        </Row>
                        <Row gutter={[16, 16]} align="middle" style={{ marginTop: '10px' }}>
                            <Col span={8}><label>Confirm new password</label></Col>
                            <Col span={16}><Input.Password name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Confirm new password" style={{ borderRadius: '0' }} /></Col>
                        </Row>
                        <Row style={{ marginTop: '20px' }}>
                            <Col span={8}></Col>
                            <Col span={3} style={{marginLeft:"5px"}}>
                                <Button type="primary" onClick={handleSave} style={{ backgroundColor: green[6], borderColor: 'green', borderRadius: '0', width: '150px' }}>Save changes</Button>
                            </Col>
                            <Col span={5} style={{marginLeft:"212px"}}>
                                <Button type="primary" danger style={{ borderRadius: '0', backgroundColor: red[6], width: '150px' }}>Discard changes</Button>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ChangePassword;
