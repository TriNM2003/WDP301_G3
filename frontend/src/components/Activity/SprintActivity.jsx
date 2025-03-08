import React, { useContext } from "react";
import { Collapse, Button, Tag, Space, Flex, Dropdown, Menu, Avatar, Tooltip, DatePicker, Progress, Input, Modal } from "antd";
import { BugOutlined, CheckOutlined, DoubleRightOutlined, DownOutlined, EllipsisOutlined, FieldTimeOutlined, FormOutlined, MinusOutlined, PaperClipOutlined, PlusOutlined, UpOutlined, UserAddOutlined, UserOutlined } from "@ant-design/icons";
import { blue, cyan, gray, grey, orange, red, yellow } from "@ant-design/colors";
import { AppContext } from "../../context/AppContext";



function SprintActivity({ activity }) {
    const { showDeleteActivity, activities, setActivities, sprints, setSprints, activityModal, setActivityModal, showActivity, closeActivity, handleActivityCreate, createActivityModal, setCreateActivityModal, activityName, setActivityName, completedSprint, setCompletedSprint, showCompletedSprint, handleCompletedSprint, handleCompletedCancel } = useContext(AppContext)
    return (
        <Flex onClick={() => showActivity(activity)} justify="space-between" align="center" style={{ background: "white", border: `0.5px solid ${cyan[2]}`, padding: "0.5% 1%", cursor: "pointer" }}>
            <Space>
                {activity.type.typeName == "task" && <FormOutlined style={{ color: blue[6] }} />}
                {activity.type.typeName == "subtask" && <PaperClipOutlined style={{ color: blue[6] }} />}
                {activity.type.typeName == "bug" && <BugOutlined style={{ color: yellow[6] }} />}
                <text>

                    {activity?.activityTitle}
                </text>
            </Space>
            <Space align="center">
                <Tooltip title={`38 of 38 activity completed`} placement="top">
                    <Progress type="circle" percent={100} size={15} showInfo={false} />

                </Tooltip>
                <Button size="small" variant="outlined" color="default" style={{ borderRadius: 0 }}>{activity?.stage?.stageName?.toUpperCase()}</Button>

                {/* Due date */}
                {activity?.dueDate && (
                    <Button
                        size="small"
                        variant="outlined"
                        color="red"
                        style={{ borderRadius: 0 }}

                    >
                        <FieldTimeOutlined style={{ marginRight: 5 }} />
                        {new Date(activity.dueDate).toLocaleDateString()}
                    </Button>
                )}

                {/* Priority */}
                {activity?.priority == "highest" && <DoubleRightOutlined rotate="-90" style={{ color: red[6] }} />}
                {activity?.priority == "high" && <UpOutlined style={{ color: orange[6] }} />}
                {activity?.priority == "medium" && <MinusOutlined style={{ color: blue[6] }} />}
                {activity?.priority == "low" && <DownOutlined style={{ color: cyan[6] }} />}
                {activity?.priority == "lowest" && <DoubleRightOutlined rotate="90" style={{ color: cyan[4] }} />}

                {activity?.assignee.length > 0 ?
                    <Avatar.Group max={{ count: 2 }} >
                        {activity?.assignee?.map((a) => {
                            return (
                                <Tooltip title={a.username} placement="top" >
                                    <Avatar src="https://i.pinimg.com/736x/45/3c/80/453c80d19293395102b3362b7b74be29.jpg" size="small" />
                                </Tooltip>


                            )
                        })}
                        
                    </Avatar.Group > :
                    <Tooltip title="Unassigned">
                        <Avatar icon={<UserOutlined />} size="small" />
                    </Tooltip>
                }
                <Dropdown
                    overlay={
                        <Menu onClick={(e) => e.domEvent.stopPropagation()}>
                            <Menu.Item onClick={() => { showActivity(activity) }}>Show activity detail</Menu.Item>
                            <Menu.Item onClick={() => { showDeleteActivity(activity?.activityTitle) }} danger>Delete activity</Menu.Item>
                        </Menu>
                    }
                    trigger={["click"]}
                >
                    <Button
                        size="small"
                        variant="text"
                        color="default"
                        style={{ borderRadius: "0%" }}
                        onClick={(e) => e.stopPropagation()} // Ngăn sự kiện click lan ra ngoài
                    >
                        <EllipsisOutlined />
                    </Button>
                </Dropdown>
            </Space>
        </Flex >
    )
}

export default SprintActivity
