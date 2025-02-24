import { grey } from '@ant-design/colors'
import { DeleteOutlined, EllipsisOutlined } from '@ant-design/icons'
import { Card, Col, Dropdown, Flex, Menu } from 'antd'
import React from 'react'

function KanbanTitle() {
    return (
        <Col span={6}>
            <Card
                style={{ height: `100%`, borderRadius: "0", background: "#F5F5F5" }}
                bodyStyle={{ height: `100%`, padding: '2%' }}
            >
                <Flex justify="space-between" align="center" style={{ padding: "0 2%", height: "100%" }}>
                    <small style={{ margin: 0, fontWeight: "bolder", color: grey[2] }}>COLUMN</small>
                    <Dropdown style={{ height: "100%" }}
                        overlay={
                            <Menu>
                                <Menu.Item key="1" icon={<DeleteOutlined />} danger="true"> Delete column</Menu.Item>

                            </Menu>
                        }

                    >
                        <EllipsisOutlined style={{ color: grey[2] }} onClick={(e) => e.preventDefault()} />
                    </Dropdown>

                </Flex>
            </Card>
        </Col>
    )
}

export default KanbanTitle
