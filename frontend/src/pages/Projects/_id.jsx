import { red } from '@ant-design/colors'
import { DeleteOutlined, GroupOutlined, MoreOutlined, SettingOutlined, UserAddOutlined } from '@ant-design/icons'
import { Button, Col, Dropdown, Menu, Row, Space, Tabs } from 'antd'

import TabPane from 'antd/es/tabs/TabPane'
import React from 'react'
import Summary from '../../components/Project/Detail/Summary'
import Title from 'antd/es/typography/Title'

function _id() {
  return (
    <div>
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
            <Row>
                <Col span={24} >
                    <Tabs  defaultActiveKey="1">
                        <TabPane   key="0">
                        </TabPane>
                        <TabPane  tab="Summary" key="1">
                            <Summary/>
                        </TabPane>
                        <TabPane tab="Your tasks" key="2">
                            Nội dung Tab Your Tasks
                        </TabPane>
                        <TabPane tab="Sprint" key="3">
                            Nội dung Tab Sprint
                        </TabPane>
                        <TabPane tab="Board" key="4">
                            Nội dung Tab Board
                        </TabPane>
                    </Tabs>
                </Col>
            </Row>
    </div>
  )
}

export default _id
