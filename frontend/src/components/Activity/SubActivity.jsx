import { blue, cyan, gray, orange, red, yellow } from '@ant-design/colors'
import { BugOutlined, CalendarOutlined, CloseOutlined, CommentOutlined, DeleteOutlined, DoubleRightOutlined, DownOutlined, EditOutlined, EllipsisOutlined, FireOutlined, FormOutlined, MinusOutlined, MoreOutlined, PaperClipOutlined, PieChartOutlined, PlusOutlined, SendOutlined, UpOutlined, UserAddOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Button, Col, DatePicker, Dropdown, Flex, Input, List, Menu, Modal, Popconfirm, Progress, Row, Select, Space, Tag, Tooltip, Typography, message } from 'antd'

import { Option } from 'antd/es/mentions'

import React, { useContext, useState } from 'react'
import { AppContext } from '../../context/AppContext'

function    SubActivity({ activity }) {
    const {showActivity} = useContext(AppContext)
    return (
        <List.Item style={{ width: "100%", }} >
            <Row style={{ width: "100%" }}>
                <Col span={12} align="start">
                    {activity?.type?.typeName == "subtask" && <PaperClipOutlined style={{ color: blue[6] }} />}
                    {activity?.type?.typeName == "bug" && <BugOutlined style={{ color: yellow[6] }} />}
                    <Typography.Text style={{ margin: "0" }} > {activity?.activityTitle}</Typography.Text>
                </Col>
                <Col span={12} align="end">

                    <Space align='center'>
                        <Dropdown
                            overlay={
                                <Menu>
                                    <Menu.Item key="1" icon={<DoubleRightOutlined rotate="-90" />} style={{ color: red[6] }} >
                                        Highest
                                    </Menu.Item>
                                    <Menu.Item key="2" icon={<UpOutlined />} style={{ color: orange[6] }} >
                                        High
                                    </Menu.Item>
                                    <Menu.Item key="3" icon={<MinusOutlined />} style={{ color: blue[6] }} >
                                        Medium
                                    </Menu.Item>
                                    <Menu.Item key="4" icon={<DownOutlined />} style={{ color: cyan[6] }} >
                                        Low
                                    </Menu.Item>
                                    <Menu.Item key="5" icon={<DoubleRightOutlined rotate="90" />} style={{ color: cyan[4] }} >
                                        Lowest
                                    </Menu.Item>
                                </Menu>
                            }
                        >
                            <span>
                                {activity?.priority == "highest" && <span><DoubleRightOutlined rotate="-90" style={{ color: red[6] }} />    </span>}
                                {activity?.priority == "high" && <span><UpOutlined style={{ color: orange[6] }} />  </span>}
                                {activity?.priority == "medium" && <span><MinusOutlined style={{ color: blue[6] }} />   </span>}
                                {activity?.priority == "low" && <span><DownOutlined style={{ color: cyan[6] }} />   </span>}
                                {activity?.priority == "lowest" && <span><DoubleRightOutlined rotate="90" style={{ color: cyan[4] }} /> </span>}
                            </span>
                        </Dropdown>
                        {activity?.assignee?.length > 0 ? (
                            <Avatar.Group max={2} size={25}>
                                {activity.assignee.map((a) => (
                                    <Tooltip key={a._id} title={a.username} placement="top">
                                        <Avatar
                                            src={a.userAvatar || "https://i.pinimg.com/736x/45/3c/80/453c80d19293395102b3362b7b74be29.jpg"}
                                            size="small"
                                        />
                                    </Tooltip>
                                ))}
                            </Avatar.Group>
                        ) : (
                            <Tooltip title="Unassigned">
                                <Avatar icon={<UserAddOutlined />} size="small" />
                            </Tooltip>
                        )}
                        <Select

                            value={`${activity?.stage.stageName.toUpperCase()}`}
                            onChange="{setMoveTo}"
                            style={{ borderRadius: "0" }}
                            size="small"
                            dropdownStyle={{ borderRadius: 0 }}

                        >
                            <Option value="Todo">Todo</Option>
                            <Option value="Doing">Doing</Option>
                            <Option value="Done">Done</Option>
                        </Select>
                        <Dropdown
                            overlay={
                                <Menu>
                                    <Menu.Item onClick={() => { showActivity(activity) }}>Show activity detail</Menu.Item>
                                    <Menu.Item icon={<DeleteOutlined />} danger > 

                                        Remove subactivity
                                    </Menu.Item>
                                </Menu>
                            }
                        >
                            <EllipsisOutlined onClick={(e) => e.preventDefault()} />
                        </Dropdown>
                    </Space>
                </Col>
            </Row>

        </List.Item>
    )
}

export default SubActivity
