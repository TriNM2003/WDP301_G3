import { green } from '@ant-design/colors'
import { DeleteOutlined, EllipsisOutlined, FireOutlined } from '@ant-design/icons'
import { Avatar, Card, Col, Dropdown, Flex, Menu, Progress, Row, Tag, Tooltip } from 'antd'
import React from 'react'

function KanbanBody() {
    return (
        <Col span={6}>
            <Card
                style={{ borderRadius: "0", background: "#F5F5F5" }}
                bodyStyle={{ padding: '2%' }}

            >
                <Card
                    hoverable
                    style={{ width: "100%", borderRadius: "1%", margin: "5% 0" }}
                    bodyStyle={{ padding: '2%' }} s
                    headStyle={{ padding: '2%', border: "0" }}
                    cover={
                        <img src="https://i.pinimg.com/736x/45/3c/80/453c80d19293395102b3362b7b74be29.jpg" style={{ borderRadius: "0", padding: "1% 3%" }}
                        />}
                    title={<Flex justify="space-between" align="center" style={{ padding: "1% 3%", height: "100%" }}>
                        <p style={{ margin: 0, color: "black" }}>Task</p>
                        <Dropdown style={{ height: "100%" }}
                            overlay={
                                <Menu>
                                    <Menu.Item key="1" icon={<DeleteOutlined />} danger="true"> Delete column</Menu.Item>

                                </Menu>
                            }

                        >
                            <EllipsisOutlined onClick={(e) => e.preventDefault()} />
                        </Dropdown>

                    </Flex>}
                >
                    <Row justify="space-between" style={{ padding: "2% 3%" }}>
                        <Col span={24} style={{ height: "100%" }} >
                            <Progress
                                percent={10}
                                percentPosition={{
                                    align: 'end',
                                    type: 'outer',
                                }}

                                strokeColor={green[6]}
                            />
                        </Col>
                        <Col
                            span={8}
                            align="start"
                            style={{

                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <Tag color="red" bordered={false}><strong><FireOutlined /> Highest</strong></Tag>
                        </Col>

                        <Col span={8} style={{ height: "100%" }} align="end">
                            <Avatar.Group max={{
                                count: 2
                            }}>
                                <Tooltip title="Ant User" placement="top">
                                    <Avatar
                                        src="https://i.pinimg.com/736x/45/3c/80/453c80d19293395102b3362b7b74be29.jpg"

                                    >

                                    </Avatar>
                                </Tooltip>
                                <Tooltip title="Ant User" placement="top">
                                    <Avatar
                                        src="https://i.pinimg.com/736x/45/3c/80/453c80d19293395102b3362b7b74be29.jpg"

                                    >

                                    </Avatar>
                                </Tooltip>
                                <Tooltip title="Ant User" placement="top">
                                    <Avatar
                                        src="https://i.pinimg.com/736x/45/3c/80/453c80d19293395102b3362b7b74be29.jpg"

                                    >

                                    </Avatar>
                                </Tooltip>
                            </Avatar.Group>
                        </Col>
                    </Row>

                </Card>

                <Card
                    hoverable
                    style={{ width: "100%", borderRadius: "1%", margin: "5% 0" }}
                    bodyStyle={{ padding: '2%' }} s
                    headStyle={{ padding: '2%', border: "0" }}

                    title={<Flex justify="space-between" align="center" style={{ padding: "1% 3%", height: "100%" }}>
                        <p style={{ margin: 0, color: "black" }}>Task</p>
                        <Dropdown style={{ height: "100%" }}
                            overlay={
                                <Menu>
                                    <Menu.Item key="1" icon={<DeleteOutlined />} danger="true"> Delete column</Menu.Item>

                                </Menu>
                            }

                        >
                            <EllipsisOutlined onClick={(e) => e.preventDefault()} />
                        </Dropdown>

                    </Flex>}
                >
                    <Row justify="space-between" style={{ padding: "2% 3%" }}>
                        <Col span={24} style={{ height: "100%" }} >
                            <Progress
                                percent={10}
                                percentPosition={{
                                    align: 'end',
                                    type: 'outer',
                                }}

                                strokeColor={green[6]}
                            />
                        </Col>
                        <Col
                            span={8}
                            align="start"
                            style={{

                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <Tag color="red" bordered={false}><strong><FireOutlined /> Highest</strong></Tag>
                        </Col>

                        <Col span={8} style={{ height: "100%" }} align="end">
                            <Avatar.Group max={{
                                count: 2
                            }}>
                                <Tooltip title="Ant User" placement="top">
                                    <Avatar
                                        src="https://i.pinimg.com/736x/45/3c/80/453c80d19293395102b3362b7b74be29.jpg"

                                    >

                                    </Avatar>
                                </Tooltip>
                                <Tooltip title="Ant User" placement="top">
                                    <Avatar
                                        src="https://i.pinimg.com/736x/45/3c/80/453c80d19293395102b3362b7b74be29.jpg"

                                    >

                                    </Avatar>
                                </Tooltip>
                                <Tooltip title="Ant User" placement="top">
                                    <Avatar
                                        src="https://i.pinimg.com/736x/45/3c/80/453c80d19293395102b3362b7b74be29.jpg"

                                    >

                                    </Avatar>
                                </Tooltip>
                            </Avatar.Group>
                        </Col>
                    </Row>

                </Card>

                <Card
                    hoverable
                    style={{ width: "100%", borderRadius: "1%", margin: "5% 0" }}
                    bodyStyle={{ padding: '2%' }} s
                    headStyle={{ padding: '2%', border: "0" }}
                    cover={
                        <img src="https://i.pinimg.com/474x/80/d8/0f/80d80f2202c2b21a73c85aa8abf5d673.jpg" style={{
                            width: "100%",
                            borderRadius: "0",
                            padding: "1% 3%",
                         
                        }}
                        />}
                    title={<Flex justify="space-between" align="center" style={{ padding: "1% 3%", height: "100%" }}>
                        <p style={{ margin: 0, color: "black" }}>Task</p>
                        <Dropdown style={{ height: "100%" }}
                            overlay={
                                <Menu>
                                    <Menu.Item key="1" icon={<DeleteOutlined />} danger="true"> Delete column</Menu.Item>

                                </Menu>
                            }

                        >
                            <EllipsisOutlined onClick={(e) => e.preventDefault()} />
                        </Dropdown>

                    </Flex>}
                >
                    <Row justify="space-between" style={{ padding: "2% 3%" }}>
                        <Col span={24} style={{ height: "100%" }} >
                            <Progress
                                percent={10}
                                percentPosition={{
                                    align: 'end',
                                    type: 'outer',
                                }}

                                strokeColor={green[6]}
                            />
                        </Col>
                        <Col
                            span={8}
                            align="start"
                            style={{

                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <Tag color="red" bordered={false}><strong><FireOutlined /> Highest</strong></Tag>
                        </Col>

                        <Col span={8} style={{ height: "100%" }} align="end">
                            <Avatar.Group max={{
                                count: 2
                            }}>
                                <Tooltip title="Ant User" placement="top">
                                    <Avatar
                                        src="https://i.pinimg.com/736x/45/3c/80/453c80d19293395102b3362b7b74be29.jpg"

                                    >

                                    </Avatar>
                                </Tooltip>
                                <Tooltip title="Ant User" placement="top">
                                    <Avatar
                                        src="https://i.pinimg.com/736x/45/3c/80/453c80d19293395102b3362b7b74be29.jpg"

                                    >

                                    </Avatar>
                                </Tooltip>
                                <Tooltip title="Ant User" placement="top">
                                    <Avatar
                                        src="https://i.pinimg.com/736x/45/3c/80/453c80d19293395102b3362b7b74be29.jpg"

                                    >

                                    </Avatar>
                                </Tooltip>
                            </Avatar.Group>
                        </Col>
                    </Row>

                </Card>
            </Card>
        </Col>
    )
}

export default KanbanBody
