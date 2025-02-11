import React, { useState } from 'react';
import { Card, Button, Input, Row, Col, message, Menu, Modal  } from 'antd';
import { green, red } from "@ant-design/colors";
import { Link } from 'react-router-dom';
const EditProfile = () => {

    const [form, setForm] = useState({
        fullname: '',
        address: '',
        dob: '',
        phone: '',
    });
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [selectedKey, setSelectedKey] = useState('1');
        const [isModalVisible, setIsModalVisible] = useState(false);
    
        const handleMenuClick = (e) => {
            if (e.key === '4') {
                setIsModalVisible(true);
            } else {
                setSelectedKey(e.key);
            }
        };
    
        const handleDeleteConfirm = () => {
            setIsModalVisible(false);
            console.log("Account deleted"); // Replace with actual delete function
        };
    
        const handleCancel = () => {
            setIsModalVisible(false);
        };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        let newErrors = {};
        if (!form.fullname) newErrors.fullname = 'Email is ...';
        if (!form.address) newErrors.address = 'Username is ...';
        if (!form.phone) newErrors.phone = 'Phone number is ...';
        
        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            setSuccessMessage('Profile details update successfully');
            message.success('Profile updated successfully!');
        }
    };

    return(
        <Row>
            <Col span={2}></Col>
            <Col span={4}>
                <Menu
                    mode="vertical"
                    selectedKeys={[selectedKey]}
                    onClick={handleMenuClick}
                    style={{ width: 250, borderRadius: '0', border: 'none', backgroundColor: '#fafafa' }}
                >
                    <Menu.Item key="1" style={{ backgroundColor: selectedKey === '1' ? '#e6f7ff' : 'transparent', borderRight: selectedKey === '1' ? '3px solid #1890ff' : 'none', borderRadius: '0' }}><Link to={"/profile/edit-profile"}>Profile settings</Link></Menu.Item>
                    <Menu.Item key="2" style={{ backgroundColor: selectedKey === '2' ? '#e6f7ff' : 'transparent', borderRight: selectedKey === '2' ? '3px solid #1890ff' : 'none', borderRadius: '0' }}><Link to={"/profile/change-password"}> Change password</Link> </Menu.Item>
                    <Menu.Item key="3" style={{ backgroundColor: selectedKey === '3' ? '#e6f7ff' : 'transparent', borderRight: selectedKey === '3' ? '3px solid #1890ff' : 'none', borderRadius: '0' }}>Logout</Menu.Item>
                    <Menu.Item key="4" style={{ backgroundColor: selectedKey === '4' ? '#e6f7ff' : 'transparent', borderRight: selectedKey === '4' ? '3px solid #1890ff' : 'none', borderRadius: '0', color: red[6] }}>Delete Account</Menu.Item>
                </Menu>
            </Col>
        <Col span={18} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '80%', textAlign: 'left' }}>
                <h2>Profile Setting</h2>
            </div>
            <Card style={{ width: '80%', padding: '20px', borderRadius: '0' }}>
                <Row gutter={[8, 8]} style={{ marginBottom: '20px' }}>
                    <Col span={6}><label>Fullname</label></Col>
                    <Col span={12}><Input name="fullname" value={form.fullname} onChange={handleChange} placeholder="Email" style={{ borderRadius: '0' }} /></Col>
                    <Col span={6} style={{ color: 'red' }}>{errors.fullname}</Col>
                </Row>
                <Row gutter={[8, 8]} style={{ marginBottom: '20px' }}>
                    <Col span={6}><label>Address</label></Col>
                    <Col span={12}><Input name="address" value={form.address} onChange={handleChange} style={{ borderRadius: '0' }} /></Col>
                    <Col span={6} style={{ color: 'red' }}>{errors.address}</Col>
                </Row>
                <Row gutter={[8, 8]} style={{ marginBottom: '20px' }}>
                    <Col span={6}><label>Date of birth</label></Col>
                    <Col span={12}><Input name="dob" value={form.dob} onChange={handleChange} placeholder="Password" style={{ borderRadius: '0' }} /></Col>
                </Row>
                <Row gutter={[8, 8]} style={{ marginBottom: '20px' }}>
                    <Col span={6}><label>Phone number</label></Col>
                    <Col span={12}><Input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone number" style={{ borderRadius: '0' }} /></Col>
                    <Col span={6} style={{ color: 'red' }}>{errors.phone}</Col>
                </Row>
                <Row gutter={[8, 8]} style={{ marginTop: '20px' }}>
                    <Col span={10} style={{ textAlign: 'right', marginLeft:"-19px" }}>
                        <Button type="primary" onClick={handleSave} style={{ backgroundColor: green[6], borderColor: 'green', borderRadius: '0' }}>Save changes</Button>
                    </Col>
                    <Col span={13}>
                        <Button type="primary" style={{ borderRadius: '0', backgroundColor: red[6] }}>Discard changes</Button>
                    </Col>
                </Row>
                {successMessage && (
                    <Row style={{ marginTop: '10px', textAlign: 'center' }}>
                        <Col span={19} style={{marginLeft:"-15px", marginTop:"10px"}}>
                            <span style={{ backgroundColor: '#f6ffed', padding: '5px', border: '1px solid #b7eb8f' }}>{successMessage}</span>
                        </Col>
                    </Row>
                )}
            </Card>
        </Col>
        <Modal
                title="Confirm Deletion"
                visible={isModalVisible}
                onOk={handleDeleteConfirm}
                onCancel={handleCancel}
                okText="Yes"
                cancelText="No"
            >
                <p>Are you sure you want to delete your account? This action cannot be undone.</p>
            </Modal>
        </Row>
    )
};

export default EditProfile;
