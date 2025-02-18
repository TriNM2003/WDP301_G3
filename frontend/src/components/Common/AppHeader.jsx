import React, { useContext, useEffect } from 'react'
import { Avatar, Button, Col, Dropdown, Flex, Menu, Row, Space, Text, Typography } from 'antd'
import { blue } from '@ant-design/colors'
import Title from 'antd/es/typography/Title'
import MenuItem from 'antd/es/menu/MenuItem';
import { DownOutlined, LogoutOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons'

import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
function AppHeader() {
    const { accessToken, user, setUser } = useContext(AppContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const userId = localStorage.getItem("userId");
    
            await axios.post('http://localhost:9999/auth/logout', { id: userId });
    
            console.log("Logout successfully");
    
            // Xóa dữ liệu trong localStorage
            localStorage.removeItem("accessToken");
            localStorage.removeItem("accessTokenExp");
            localStorage.removeItem("userId");
            setUser({});
    
            // Chuyển hướng đến trang login
            navigate('/auth/login');
        } catch (error) {
            console.log("Logout failed:", error);
        }
    };
    

    return (
        <Row justify="space-between" style={{ width: "100%", height: "100%", backgroundColor: "#fff", padding: "0 20px" }} >
            <Col span={3} align="start">
                <Flex justify='center' align='center' style={{ height: "100%" }}>
                    <Title level={3} style={{ margin: 0, cursor:"pointer" }} onClick={() => navigate('/home')} >SkrumIO</Title>
                </Flex>
            </Col>
            <Col span={12} align="start" >
                {/* <Flex justify='start' align='center'  style={{ height: "100%" }}>
                    <Menu mode="horizontal">
                        <MenuItem icon={<MailOutlined />}  title="Item1">Icon</MenuItem>
                        <MenuItem icon={<MailOutlined />}  title="Item2">Icon</MenuItem>
                        <MenuItem icon={<MailOutlined />}  title="Item3">Icon</MenuItem>
                        <MenuItem icon={<MailOutlined />}  title="Item4">Icon</MenuItem>
                        <MenuItem icon={<MailOutlined />}  title="Item5">Icon</MenuItem>
                    </Menu>
                </Flex> */}
            </Col>
            {!accessToken && <Col span={8} >
                <Flex gap="small" justify='end' align='center' style={{ height: "100%" }}>
                    <Button href='/auth/login' color='default' variant='outlined'  >Login</Button>
                    <Button href='/auth/register' color='cyan' variant='solid'>Register </Button>
                </Flex>
            </Col>}
            {accessToken  && <Col span={2} align="end" justify="center" >
                <Dropdown style={{height:"100%"}}
                    overlay={
                        <Menu>
                            <Menu.Item key="1" disabled>My Account</Menu.Item>
                            <Menu.Divider />
                            <Menu.Item key="2" extra="⌘P"  onClick={() => navigate('/profile/profile-info')}>Profile</Menu.Item>
                            <Menu.Item key="3" extra="⌘B"  onClick={() => navigate('/profile/edit-profile')}>Edit profile</Menu.Item>
                            <Menu.Item key="4" extra="⌘B"  onClick={() => navigate('/profile/change-password')}>Change password</Menu.Item>
                            <Menu.Divider />
                            <Menu.Item key="5" icon={<LogoutOutlined style={{color:"red", fontWeight:"bolder"}}/>}  extra="⌘S"
                            onClick={() => handleLogout()}>
                                Logout
                            </Menu.Item>
                        </Menu>
                    }

                >
                    <Title style={{margin:"0",height:"100%"}} level={5} onClick={(e) => e.preventDefault()}>
                        <Space style={{height:"100%"}}>
                            <Avatar src={<img src={user?.avatar} alt="avatar" />} />
                            {user?.username}
                        
                        </Space>    
                    </Title>
                </Dropdown>
            </Col>}
        </Row>
    )
}

export default AppHeader
