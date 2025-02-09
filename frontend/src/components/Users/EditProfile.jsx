import React, { useState } from 'react';
import { Card, Button, Input, Row, Col,  message } from 'antd';
import { green, red } from "@ant-design/colors";
const EditProfile = () => {

    const [form, setForm] = useState({
        fullname: '',
        address: '',
        dob: '',
        phone: '',
    });
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

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
        <Col span={18}>
            <Card style={{ width: '80%', margin: '0 auto', padding: '20px', borderRadius: '0' }}>
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
    )
};

export default EditProfile;
