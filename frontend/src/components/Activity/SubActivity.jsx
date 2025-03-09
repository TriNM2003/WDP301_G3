import { blue, cyan, gray, orange, red, yellow } from '@ant-design/colors'
import { BugOutlined, CalendarOutlined, CloseOutlined, CommentOutlined, DeleteOutlined, DoubleRightOutlined, DownOutlined, EditOutlined, EllipsisOutlined, FireOutlined, FormOutlined, MinusOutlined, MoreOutlined, PaperClipOutlined, PieChartOutlined, PlusOutlined, SendOutlined, UpOutlined, UserAddOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Button, Col, DatePicker, Dropdown, Flex, Input, List, Menu, Modal, Popconfirm, Progress, Row, Select, Space, Tag, Tooltip, Typography, message } from 'antd'

import { Option } from 'antd/es/mentions'

import React, { useContext, useState } from 'react'
import { AppContext } from '../../context/AppContext'

function SubActivity({ activity }) {
    const { showActivity } = useContext(AppContext)
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

                        {activity?.priority == "highest" && <Tooltip title="highest"><DoubleRightOutlined rotate="-90" style={{ color: red[6] }} />    </Tooltip>}
                        {activity?.priority == "high" && <Tooltip title="high"><UpOutlined style={{ color: orange[6] }} />  </Tooltip>}
                        {activity?.priority == "medium" && <Tooltip title="medium"><MinusOutlined style={{ color: blue[6] }} />   </Tooltip>}
                        {activity?.priority == "low" && <Tooltip title="low"><DownOutlined style={{ color: cyan[6] }} />   </Tooltip>}
                        {activity?.priority == "lowest" && <Tooltip title="lowest"><DoubleRightOutlined rotate="90" style={{ color: cyan[4] }} /> </Tooltip>}

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
                        <Button size="small" variant="outlined" color="default" style={{ borderRadius: 0 }}>{activity?.stage?.stageName?.toUpperCase()}</Button>

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
