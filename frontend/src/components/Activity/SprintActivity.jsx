import React, { useContext, useState } from "react";
import { Collapse, Button, Tag, Space, Flex, Dropdown, Menu, Avatar, Tooltip, DatePicker, Progress, Input, Modal } from "antd";
import { BugOutlined, CheckOutlined, DoubleRightOutlined, DownOutlined, EllipsisOutlined, FieldTimeOutlined, FormOutlined, MinusOutlined, PaperClipOutlined, PlusOutlined, UpOutlined, UserAddOutlined, UserOutlined } from "@ant-design/icons";
import { blue, cyan, gray, grey, orange, red, yellow } from "@ant-design/colors";
import { AppContext } from "../../context/AppContext";
import { DndContext } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';


function SprintActivity({ activity, isDragging }) {
    const { showDeleteActivity, activities, setActivities, sprints, setSprints, activityModal, setActivityModal, showActivity, closeActivity, handleActivityCreate, createActivityModal, setCreateActivityModal, activityName, setActivityName, completedSprint, setCompletedSprint, showCompletedSprint, handleCompletedSprint, handleCompletedCancel } = useContext(AppContext)

    //DND
    // const [isClicking, setIsClicking] = useState(false);
    const isFromCompletedSprint = activity?.sprint?.sprintStatus == "completed";
    // const handleMouseDown = () => setIsClicking(true);
    // const handleMouseMove = () => setIsClicking(false);
    // const handleMouseUp = () => {
    //     if (isClicking) {
    //         showActivity(activity); // Chỉ mở khi là click
    //     }
    // };
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: activity?._id,
        data: activity,
        disabled: isFromCompletedSprint,
    });

    const dndSprintActivity = {
        transform: CSS.Translate.toString(transform),
        transition,
        cursor: isFromCompletedSprint ? "not-allowed" : "grab",
        opacity: isDragging ? 0.5 : undefined
    };

    return (
        <Flex
            ref={setNodeRef}  {...attributes} {...(!isFromCompletedSprint ? listeners : {})}
            justify="space-between" align="center"
            style={Object.assign({}, dndSprintActivity, {
                background: "white", border: `0.5px solid ${cyan[2]}`, padding: "0.5% 1%", cursor: "pointer", opacity: isDragging ? 0.8 : 1,
                transform: isDragging ? "scale(1.05)" : "none",
                boxShadow: isDragging ? "0 4px 12px rgba(0,0,0,0.1)" : "none",
                transition: "all 0.2s ease",
            })}

        >
            <Space onClick={()=> showActivity(activity)} >
                {activity.type.typeName == "task" && <FormOutlined style={{ color: blue[6] }} />}
                {activity.type.typeName == "subtask" && <PaperClipOutlined style={{ color: blue[6] }} />}
                {activity.type.typeName == "bug" && <BugOutlined style={{ color: yellow[6] }} />}
                <text>

                    {activity?.activityTitle}
                </text>
                <Avatar shape="square" size={16} style={{ borderRadius: 0 }}>{activity?.child
                    ?.map((c) => activities.find((a) => a?._id == c))
                    .filter(Boolean)?.length}</Avatar>
            </Space>
            <Space align="center">

                <Button size="small" variant="outlined" color="default" style={{ borderRadius: 0 }}>{activity?.stage?.stageName?.toUpperCase()}</Button>

                {/* Due date */}
                {activity?.dueDate && (
                    <Button
                        size="small"
                        variant="outlined"
                        color={new Date(activity.dueDate) <= new Date() ? "red" : ""}
                        style={{ borderRadius: 0 }}

                    >
                        <FieldTimeOutlined style={{ marginRight: 5 }} />
                        {new Date(activity.dueDate).toLocaleDateString()}
                    </Button>
                )}

                {/* Priority */}
                {activity?.priority == "highest" && <Tooltip title="highest"><DoubleRightOutlined rotate="-90" style={{ color: red[6] }} />    </Tooltip>}
                {activity?.priority == "high" && <Tooltip title="high"><UpOutlined style={{ color: orange[6] }} />  </Tooltip>}
                {activity?.priority == "medium" && <Tooltip title="medium"><MinusOutlined style={{ color: blue[6] }} />   </Tooltip>}
                {activity?.priority == "low" && <Tooltip title="low"><DownOutlined style={{ color: cyan[6] }} />   </Tooltip>}
                {activity?.priority == "lowest" && <Tooltip title="lowest"><DoubleRightOutlined rotate="90" style={{ color: cyan[4] }} /> </Tooltip>}

                {activity?.assignee.length > 0 ?
                    <Avatar.Group max={{ count: 2 }} >
                        {activity.assignee.map((a) => (
                            <Tooltip key={a._id} title={a.username} placement="top">
                                <Avatar
                                    src={a.userAvatar || "https://i.pinimg.com/736x/45/3c/80/453c80d19293395102b3362b7b74be29.jpg"}
                                    size="small"
                                />
                            </Tooltip>
                        ))}

                    </Avatar.Group > :
                    <Tooltip title="Unassigned">
                        <Avatar icon={<UserOutlined />} size="small" />
                    </Tooltip>
                }
                <Dropdown
                    overlay={
                        <Menu onClick={(e) => e.domEvent.stopPropagation()} >
                            <Menu.Item onMouseUp={() => { showActivity(activity) }}>Show activity detail</Menu.Item>
                            <Menu.Item onMouseUp={() => { showDeleteActivity(activity) }} danger>Delete activity</Menu.Item>
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
