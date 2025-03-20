import React, { useState, useEffect, useContext } from 'react';
import { Card, Button, Input, Row, Col, message, Breadcrumb, Menu, Upload, Modal, Avatar, Form } from 'antd';
import { UploadOutlined, ExclamationCircleOutlined, UserOutlined, LockOutlined, LogoutOutlined, DeleteOutlined, } from '@ant-design/icons';
import { green, red, gray } from "@ant-design/colors";
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext'
import axios from 'axios';
const EditProfile = () => {
    const { accessToken, user, setUser } = useContext(AppContext);
    const [selectedKey, setSelectedKey] = useState('1');
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
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
    const navigate = useNavigate();

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

    // Xử lý hiển thị lỗi ngay khi nhập dữ liệu
    const validateInput = (name, value) => {
        let error = '';

        if (name === "fullName" && value && !/^[a-zA-ZÀ-Ỹà-ỹ\s]+$/.test(value)) {
            error = "Full name is invalid. Only letters and spaces are allowed.";
        }

        if (name === "phoneNumber" && value && !/^(0[3|5|7|8|9])+([0-9]{8})$/.test(value)) {
            error = "Phone number is invalid. Please enter a valid phone number.";
        }

        if (name === "dob" && value) {
            const dobDate = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (dobDate >= today) {
                error = "Date of birth must be in the past.";
            }
        }

        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: error
        }));
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        validateInput(name, value);
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
        let validationErrors = {};

        Object.keys(form).forEach(key => {
            validateInput(key, form[key]);
            if (errors[key]) validationErrors[key] = errors[key];
        });

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        const formData = new FormData();
        formData.append("fullName", form.fullName);
        formData.append("address", form.address);
        formData.append("dob", form.dob);
        formData.append("phoneNumber", form.phoneNumber);

        if (selectedFile) {
            formData.append("userAvatar", selectedFile);  // Gửi file ảnh
        }
        setLoading(true)
        setTimeout(async () => {
            axios.put('http://localhost:9999/users/edit-profile', formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then(response => {
                    message.success("Profile updated successfully");
                    setImagePreview(response.data.userAvatar);
                    setUser(prevUser => ({
                        ...prevUser,
                        ...response.data
                    }));
                })
                .catch(error => {
                    message.error(error.response?.data?.message);
                })
                .finally(() => setLoading(false));
        }, 1000);
    };

    const handleDiscard = () => {
        setForm({
            fullName: '',
            address: '',
            dob: '',
            phoneNumber: '',
        });
        setErrors({});
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        window.location.href = '/auth/login';
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
            setEmailError("Please enter your email address");
            return;
        }

        setDeleteLoading(true);
        axios.post('http://localhost:9999/users/send-delete-email', { email }, {
            headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
        })
            .then(() => {
                message.success("A confirmation email has been sent to your email address.");
                setIsDeleteModalVisible(false);
                setEmail('');
                setEmailError('');
            })
            .catch(error => {
                setEmailError(error.response?.data?.message || "Incorrect password");
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


    return (
        <div style={{ minHeight: '100%', width: '100%', padding: '20px' }}>
            {contextHolder}
            <Row gutter={[16, 16]} justify="center">
                <Col xs={24} sm={8} md={6} lg={4}>
                    <Breadcrumb style={{ marginBottom: '16px' }}>
                        <Breadcrumb.Item><Link to="/profile/profile-info">Profile</Link></Breadcrumb.Item>
                        <Breadcrumb.Item><Link to="/profile/edit-profile">Edit Profile</Link></Breadcrumb.Item>
                    </Breadcrumb>

                    <Menu mode="vertical" selectedKeys={[selectedKey]} onClick={handleMenuClick}
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
                            <Avatar size={100} src={imagePreview || "https://www.w3schools.com/howto/img_avatar.png"} />
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
                                <div style={{ backgroundColor: '#f0f0f0', padding: '8px', borderRadius: '6px', textAlign: 'left' }}>
                                    {form.username}
                                </div>
                            </Form.Item>

                            <Form.Item label="Email">
                                <div style={{ backgroundColor: '#f0f0f0', padding: '8px', borderRadius: '6px', textAlign: 'left' }}>
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
                                <Button type="primary" onClick={handleSave} loading={loading} style={{ marginRight: '10px' }}>Save</Button>
                                <Button danger onClick={handleDiscard}>Discard</Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row >
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
        </div>


    )
};

export default EditProfile;
