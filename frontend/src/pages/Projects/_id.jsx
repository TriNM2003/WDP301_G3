
import TabPane from 'antd/es/tabs/TabPane'
import React, { useState } from 'react'
import Summary from '../../components/Project/Detail/Summary'
import Title from 'antd/es/typography/Title'
import SprintBoard from '../../components/Project/Detail/SprintBoard'

import { red } from '@ant-design/colors'
import { BarChartOutlined, BarsOutlined, DeleteOutlined, GroupOutlined, MoreOutlined, SettingOutlined, SyncOutlined, TableOutlined, UserAddOutlined } from '@ant-design/icons'
import { Button, Col, Dropdown, Flex, Menu, Row, Space, Tabs } from 'antd'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

function _id() {
    const nav = useNavigate();
    const location = useLocation();

   
    const getActiveKey = () => {
        if (location.pathname.includes("summary")) return "summary";
        if (location.pathname.includes("sprint")) return "sprint";
        if (location.pathname.includes("board")) return "board";
        return "summary"; 
    };
    return (
        <Flex vertical  style={{ height: "100%"}}>
            <Row justify='space-around'>
                <Col span={6} align='start'>
                    <Title level={4}> Project name </Title>
                </Col>
                <Col span={8}>

                </Col>
                <Col span={6} align='end'>
                    <Space style={{ height: "100%" }} align='center'>
                        <Button color='primary' variant='solid' style={{ 'border-radius': "5%" }}><UserAddOutlined />Invite</Button>


                        <Dropdown style={{ height: "100%" }}
                            overlay={
                                <Menu>
                                    <Menu.Item key="1" icon={<SettingOutlined />} > Project settings</Menu.Item>
                                    <Menu.Item key="2" icon={<GroupOutlined />} > Manage members</Menu.Item>
                                    <Menu.Item key="3" icon={<DeleteOutlined style={{ color: red[6] }} />} > Delete project</Menu.Item>

                                </Menu>
                            }

                        >
                            <Title style={{ margin: "0", height: "100%" }} level={5} onClick={(e) => e.preventDefault()}>
                                <Space style={{ height: "100%" }}>
                                    <Button icon={<MoreOutlined />} />


                                </Space>
                            </Title>
                        </Dropdown>
                    </Space>
                </Col>

            </Row>
            <Row style={{flex:"1"}} >
                <Col span={24} style={{height:"100%"}}>
                    <Tabs activeKey={getActiveKey()} onChange={(key) => {nav(key); }}>
                        <TabPane />
                        <TabPane tab="Summary" key="summary" icon={<BarChartOutlined />}/>
                        <TabPane tab="Sprint" key="sprint" icon={<SyncOutlined />} />
                        <TabPane tab="Board" key="board" icon={<TableOutlined />}/>

                    </Tabs>
                    <Outlet/>
                </Col>
            </Row>
        </Flex>
    )
}

export default _id
