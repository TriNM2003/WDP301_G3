import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Row, Col, message, Breadcrumb, Menu, Upload, Modal} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { green, red, gray } from "@ant-design/colors";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
const EditProfile = () => {
    const [selectedKey, setSelectedKey] = useState('1');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form, setForm] = useState({  
        fullName: '',
        address: '',
        dob: '',
        phoneNumber: '',
        username: '',
        email: ''
    });
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [modalSuccess, setModalSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:9999/users/user-profile', {
            headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
        })
            .then(response => {
                setForm(response.data);
            })
            .catch(error => {
                message.error("Failed to load user data");
            });
    }, []);

    const handleMenuClick = (e) => {
        if (e.key === '4') {
            setIsModalVisible(true);
        } else {
            setSelectedKey(e.key);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        let newErrors = {};
        if (!form.fullName) newErrors.fullName = 'fullName is required';
        if (!form.address) newErrors.address = 'Address is required';
        if (!form.phoneNumber) newErrors.phoneNumber = 'phoneNumber number is required';
        if (!form.dob) newErrors.dob = 'Date of birth is required';

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        axios.put('http://localhost:9999/users/edit-profile', form, {
            headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
        })
            .then(() => {
                console.log(form)
                setModalSuccess(true);
            })
            .catch(error => {
                message.error(error.response?.data?.message);
                setErrors({ Profile: error.response?.data?.message });
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
                            title: <a href="/profile/edit-profile">Edit Profile</a>,
                        },
                    ]}
                />

                <Menu mode="vertical" selectedKeys={[selectedKey]} onClick={handleMenuClick} style={{ width: 250, borderRadius: '0', border: 'none', backgroundColor: '#fafafa' }}>
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
                </Menu>
            </Col>
            <Col span={18} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '80%', textAlign: 'left' }}>
                    <h2>Profile Setting</h2>
                </div>
                <Card style={{ width: '80%', margin: '0 auto', padding: '20px', borderRadius: '0' }}>
                    <Row gutter={[8, 8]} style={{ marginBottom: '20px' }}>
                        <Col span={6}><label>Avatar</label></Col>
                        <Col span={12}>
                            <Upload >
                                <Button icon={<UploadOutlined />}>Click to Upload</Button>
                            </Upload>
                        </Col>
                        <Col span={6} style={{ color: 'red' }}>{errors.fullName}</Col>
                    </Row>
                    <Row gutter={[8, 8]} style={{ marginBottom: '20px' }}>
                        <Col span={6}><label>Username</label></Col>
                        <Col span={12}><div style={{ border: "1px solid #d9d9d9", textAlign: "left", paddingLeft:"10px" }}>{form.username}</div></Col>
                    </Row>
                    <Row gutter={[8, 8]} style={{ marginBottom: '20px' }}>
                        <Col span={6}><label>Email</label></Col>
                        <Col span={12}><div style={{ border: "1px solid #d9d9d9", textAlign: "left", paddingLeft:"10px" }}>{form.email}</div></Col>
                    </Row>
                    <Row gutter={[8, 8]} style={{ marginBottom: '20px' }}>
                        <Col span={6}><label>Fullname</label></Col>
                        <Col span={12}><Input name="fullName" value={form.fullName} onChange={handleChange} placeholder="fullName" style={{ borderRadius: '0' }} /></Col>
                        <Col span={6} style={{ color: 'red' }}>{errors.fullName}</Col>
                    </Row>
                    <Row gutter={[8, 8]} style={{ marginBottom: '20px' }}>
                        <Col span={6}><label>Address</label></Col>
                        <Col span={12}><Input name="address" value={form.address} onChange={handleChange} placeholder='Address' style={{ borderRadius: '0' }} /></Col>
                        <Col span={6} style={{ color: 'red' }}>{errors.address}</Col>
                    </Row>
                    <Row gutter={[8, 8]} style={{ marginBottom: '20px' }}>
                        <Col span={6}><label>Date of birth</label></Col>
                        <Col span={12}><Input name="dob" type="date" value={form.dob ? new Date(form.dob).toISOString().split('T')[0] : ''} onChange={handleChange} style={{ borderRadius: '0' }} /></Col>
                    </Row>
                    <Row gutter={[8, 8]} style={{ marginBottom: '20px' }}>
                        <Col span={6}><label>Phone number</label></Col>
                        <Col span={12}><Input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} placeholder="phone number" style={{ borderRadius: '0' }} /></Col>
                        <Col span={6} style={{ color: 'red' }}>{errors.phoneNumber}</Col>
                    </Row>
                    <Row gutter={[8, 8]} style={{ marginTop: '20px' }}>
                        <Col span={10} style={{ textAlign: 'right', marginLeft: "-19px" }}>
                            <Button type="primary" onClick={handleSave} style={{ backgroundColor: green[6], borderColor: 'green', borderRadius: '0' }}>Save changes</Button>
                        </Col>
                        <Col span={13}>
                            <Button type="primary" onClick={handleDiscard} style={{ borderRadius: '0', backgroundColor: red[6] }}>Discard changes</Button>
                        </Col>
                    </Row>
                    {successMessage && (
                        <Row style={{ marginTop: '10px', textAlign: 'center' }}>
                            <Col span={19} style={{ marginLeft: "-15px", marginTop: "10px" }}>
                                <span style={{ backgroundColor: '#f6ffed', padding: '5px', border: '1px solid #b7eb8f' }}>{successMessage}</span>
                            </Col>
                        </Row>
                    )}
                </Card>
            </Col>
            <Modal title="Success" visible={modalSuccess} onOk={() => setModalSuccess(false)} footer={[<Button key="ok" type="primary" onClick={() => setModalSuccess(false)}>OK</Button>]}>
                <p>Profile changed successfully!</p>
            </Modal>
        </Row >
    )
};

export default EditProfile;
