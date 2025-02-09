import React, { useState } from 'react';
import { Row, Col, Menu} from 'antd';
import { Outlet } from 'react-router-dom';
const ManageProfile = () => {
     
        const [selectedKey, setSelectedKey] = useState('1');


    return (
        <Row>
            <Col span={2}>
            </Col>
            <Col span={4}>
                <Menu
                    mode="vertical"
                    selectedKeys={[selectedKey]}
                    onClick={(e) => setSelectedKey(e.key)}
                    style={{ width: 250, borderRadius: '0', border: 'none' }}
                >
                    <Menu.Item key="1" style={{ backgroundColor: selectedKey === '1' ? '#e6f7ff' : 'transparent', borderRight: selectedKey === '1' ? '3px solid #1890ff' : 'none', borderRadius: '0' }}>Profile settings</Menu.Item>
                    <Menu.Item key="2" style={{ backgroundColor: selectedKey === '2' ? '#e6f7ff' : 'transparent', borderRight: selectedKey === '2' ? '3px solid #1890ff' : 'none', borderRadius: '0' }}>Change password</Menu.Item>
                    <Menu.Item key="3" style={{ backgroundColor: selectedKey === '3' ? '#e6f7ff' : 'transparent', borderRight: selectedKey === '3' ? '3px solid #1890ff' : 'none', borderRadius: '0' }}>Logout</Menu.Item>
                </Menu>
            </Col>
            <Outlet />
        </Row>
    );
}

export default ManageProfile;