import React, { useContext, useEffect } from 'react'
import { Avatar, Badge, Button, Col, Divider, Dropdown, Flex, List, Menu, Row, Space, Text, Typography } from 'antd'
import { blue, grey, orange, yellow } from '@ant-design/colors'
import Title from 'antd/es/typography/Title'
import MenuItem from 'antd/es/menu/MenuItem';
import { BellFilled, BellOutlined, DownOutlined, LogoutOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons'

import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import moment from 'moment';
function AppHeader() {
    const { accessToken, user, setUser, notifications, setNotifications } = useContext(AppContext);
    const navigate = useNavigate();
    const isAdmin = user?.roles?.some(role => role.roleName == "admin");

    const handleIsSeen = async (notificationId) => {
        if (notificationId) {
            axios.put(`http://localhost:9999/notifications/${notificationId}/is-seen`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                })
                .then((res) => {
                    setNotifications(res?.data?.notifications);
                })
                .catch((err) => { })
        }
    }

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
                    <Title level={3} style={{ margin: 0, cursor: "pointer" }} onClick={() => navigate('/home')} >SkrumIO</Title>
                </Flex>
            </Col>
            <Col span={10} align="start" >
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
            {accessToken && <Col span={2} align="end" justify="center" >
                <Flex style={{ width: "100%", height: "100%" }} justify='space-around' align='center' >
                    <Dropdown style={{ height: "100%" }}
                        placement="bottomRight"
                        overlayStyle={{ width: "300px", height: "60vh", backgroundColor: "white", padding: "5px 0 5px 20px ", boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }}
                        overlay={
                            <List style={{ height: "100%", width: "100%", overflow: "auto" }}>
                                <Title level={4} style={{ margin: "2% 0" }}>Notifications</Title>
                                <Divider style={{ margin: "2% 0" }} />
                                {notifications.map((notification) => {
                                    return <List.Item key={notification?._id} style={{
                                        cursor: "pointer",
                                        transition: "background-color 0.3s ease",
                                        padding: "12px 16px",
                                        borderRadius: "8px",
                                    }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f0f2f5"}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                                        onClick={() => handleIsSeen(notification._id)}
                                    >
                                        <List.Item.Meta
                                            avatar={<Avatar src={notification?.from?.userAvatar} />}
                                            description={<span style={{
                                                color: notification?.isSeen == false ? "black" : "",
                                                fontWeight: notification?.isSeen == false ? "bolder" : "",
                                            }
                                            }>
                                                {notification.content}
                                                <br />
                                                <small style={{ color: "#888" }}>{moment(notification?.createdAt).fromNow()}</small>
                                            </span>
                                            }
                                        />
                                    </List.Item>
                                })}

                            </List>

                        }
                        trigger={"click"}
                    >

                        <Badge count={notifications?.filter((noti) => noti?.isSeen == false)?.length || 0} size="small" >
                            <Avatar shape='square' icon={<BellFilled style={{ color: orange[3] }} />} size="default" style={{ background: "white", cursor: "pointer" }} />
                        </Badge>

                    </Dropdown>
                    <Dropdown style={{ height: "100%" }}
                        overlay={
                            <Menu>
                                <Menu.Item key="1" disabled>My Account</Menu.Item>
                                <Menu.Divider />
                                <Menu.Item key="2" extra="⌘P" onClick={() => navigate('/profile/profile-info')}>Profile</Menu.Item>
                                <Menu.Item key="3" extra="⌘B" onClick={() => navigate('/profile/edit-profile')}>Edit profile</Menu.Item>
                                <Menu.Item key="4" extra="⌘B" onClick={() => navigate('/profile/change-password')}>Change password</Menu.Item>
                                {isAdmin ?
                                    <>
                                        <Menu.Item key="5" extra="⌘B" onClick={() => navigate('/admin/manage-sites')}>Manage sites</Menu.Item>
                                        <Menu.Item key="6" extra="⌘B" onClick={() => navigate('/admin/dashboard')}>View dashboard</Menu.Item>
                                        <Menu.Divider />
                                        <Menu.Item key="7" icon={<LogoutOutlined style={{ color: "red", fontWeight: "bolder" }} />} extra="⌘S" onClick={() => handleLogout()}> Logout</Menu.Item>
                                    </> :
                                    <>
                                        <Menu.Divider />
                                        <Menu.Item key="7" icon={<LogoutOutlined style={{ color: "red", fontWeight: "bolder" }} />} extra="⌘S" onClick={() => handleLogout()}> Logout</Menu.Item>
                                    </>
                                }
                            </Menu>
                        }
                        trigger={"click"}
                    >

                        <Avatar onClick={(e) => e.preventDefault()} src={<img src={user?.userAvatar} alt="avatar" />} style={{ cursor: "pointer" }} />

                    </Dropdown>
                </Flex>
            </Col>}
        </Row>
    )
}

export default AppHeader
