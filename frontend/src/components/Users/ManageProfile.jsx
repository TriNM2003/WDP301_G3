import React, { useState } from 'react';
import { Row, Col, Menu, Modal } from 'antd';
import { Outlet, Link } from 'react-router-dom';
import { blue, red } from "@ant-design/colors";

const ManageProfile = () => {
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

    return (
        <Row>
            <Col span={2}></Col>
            <Col span={4}>
                <Menu
                    mode="vertical"
                    selectedKeys={[selectedKey]}
                    onClick={handleMenuClick}
                    style={{ width: 250, borderRadius: '0', border: 'none', backgroundColor: '#fafafa' }}
                >
                    <Menu.Item key="1" style={{ backgroundColor: selectedKey === '1' ? '#e6f7ff' : 'transparent', borderRight: selectedKey === '1' ? '3px solid #1890ff' : 'none', borderRadius: '0' }}><Link to={"/profile/manage-profile/edit-profile"}>Profile settings</Link></Menu.Item>
                    <Menu.Item key="2" style={{ backgroundColor: selectedKey === '2' ? '#e6f7ff' : 'transparent', borderRight: selectedKey === '2' ? '3px solid #1890ff' : 'none', borderRadius: '0' }}><Link to={"/profile/manage-profile/change-password"}> Change password</Link> </Menu.Item>
                    <Menu.Item key="3" style={{ backgroundColor: selectedKey === '3' ? '#e6f7ff' : 'transparent', borderRight: selectedKey === '3' ? '3px solid #1890ff' : 'none', borderRadius: '0' }}>Logout</Menu.Item>
                    <Menu.Item key="4" style={{ backgroundColor: selectedKey === '4' ? '#e6f7ff' : 'transparent', borderRight: selectedKey === '4' ? '3px solid #1890ff' : 'none', borderRadius: '0', color: red[6] }}>Delete Account</Menu.Item>
                </Menu>
            </Col>
            
            <Outlet />
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
    );
};

export default ManageProfile;
