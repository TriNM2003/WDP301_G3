
import React, { useContext, useState } from "react";
import { Row, Col, Card, Typography, Button, Flex, Menu, Dropdown, Tooltip, Progress, Avatar, Tag, Input, Switch, Checkbox, Modal, Divider, Select, message } from "antd";
import { cyan, gray, green, grey, greyDark, orange, red, yellow } from "@ant-design/colors";
import { CheckOutlined, CheckSquareFilled, DeleteOutlined, DownOutlined, EllipsisOutlined, FireOutlined, GroupOutlined, MoreOutlined, PlusOutlined, SearchOutlined, SettingOutlined, UpOutlined, WarningFilled } from "@ant-design/icons";
import Meta from "antd/es/card/Meta";
import KanbanBody from "./KanbanBody";
import KanbanTitle from "./KanbanTitle";
import Search from "antd/es/input/Search";
import { Option } from "antd/es/mentions";
import { AppContext } from "../../../../context/AppContext";
import CompleteSprintModal from "../Sprint/CompleteSprintModal";
import ActivityDetail from "../../../Activity/ActivityDetail";
import { DndContext, MouseSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";

const { Title } = Typography;

const KanbanBoard = () => {
    const { showNotification, sprints, activeDragActivity, activityModalLoading, setActiveDragActivity, activities, stages, setStages, handleMoveActivity, searchActivity, setSearchActivity, completedSprint, setCompletedSprint, showCompletedSprint, handleCompletedSprint, handleCompletedCancel } = useContext(AppContext)
    const [filterActivityType, setFliterActivityType] = useState(["task"]);
    const filteredActivitites = activities?.filter((activity) => activity && activity?.activityTitle.toUpperCase().includes(searchActivity?.toUpperCase()))
        .filter((a) => a && (filterActivityType.length > 0 ? filterActivityType.includes(a?.type?.typeName) : true));


    //DND
    const mouseSensor = useSensor(MouseSensor, {
        activationConstraint: {
            distance: 5, // Cần di chuyển chuột ít nhất 5px để kích hoạt drag
        },
    });

    const sensors = useSensors(mouseSensor);
    const handleDragStart = (event) => {
        const { active } = event;
        const draggedId = active?.id;
        const found = activities.find((a) => a._id == draggedId);
        if (found) {
            setActiveDragActivity(found);
        }
    };


    const handleDragEnd = (e) => {
  
        const { active, over } = e;

        if (!over || !activeDragActivity) {
            setActiveDragActivity(null);
            return;
        }

        const activity = activities.find((a) => a._id == active.id);
        const fromStageId = activity?.stage?._id;
        const toStageId = over?.id
        // console.log(activity._id,fromStageId, toStageId,fromStageId != toStageId );

        // Nếu khác thì tiến hành move
        if(fromStageId != toStageId && toStageId!=activity._id){
            handleMoveActivity("stage", activity, toStageId);
        }
        setActiveDragActivity(null);
    };




    const [filters, setFilters] = useState({
        assigned: false,
        reviewed: false,
    });

    // Hàm cập nhật state chung
    const handleChangeFilter = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };
    const onSearch = (e) => {
        // console.log("Tìm kiếm:", e.target.value);
        setSearchActivity(e.target.value)
    };
    const activeSprint = sprints.find((s) => s.sprintStatus == "active") || null;

    return (
        (activeSprint != null ? (
            <DndContext
                sensors={sensors}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}

            >
                <div style={{ height: "100%", width: "100%", padding: "0 2%", overflowX: "auto", overflowY: "unset" }}>
                    <Row style={{
                        height: `10% `, margin: "0 2%"
                    }} justify="space-between">
                        <Col span={6} align="center">
                            <Input
                                placeholder="Search activity"
                                allowClear
                                size="middle"
                                onChange={onSearch}
                                style={{ width: "100%", borderRadius: "2%" }}
                                prefix={<SearchOutlined />}
                            />

                        </Col>
                        <Col span={5}>
                            <Flex justify="space-around" >
                                <Dropdown overlay={
                                    <Menu>
                                        <Menu.Item key="1">
                                            <Checkbox checked={filters.assigned}
                                                onChange={(e) => handleChangeFilter("assigned", e.target.checked)} >
                                                Assigned to me
                                            </Checkbox>
                                        </Menu.Item>
                                        <Menu.Item key="2">
                                            <Checkbox checked={filters.recentlyUpdated}
                                                onChange={(e) => handleChangeFilter("recentlyUpdated", e.target.checked)}>
                                                Recently Updated
                                            </Checkbox>
                                        </Menu.Item>
                                    </Menu>
                                } trigger={["click"]}>
                                    <Button style={{ borderRadius: "0%" }}>
                                        Filter   <DownOutlined />
                                    </Button>
                                </Dropdown>
                                <Button variant="solid" style={{ borderRadius: "0%" }} onClick={showCompletedSprint}> Complete sprint</Button>
                                <CompleteSprintModal />

                            </Flex>
                        </Col>

                    </Row>

                    <Row gutter={16} style={{
                        height: `7 % `, position: 'sticky',
                        top: 0,
                        zIndex: 10, margin: "0 2%", flexWrap: "nowrap"
                    }}>
                        {stages?.map((stage) => {
                            return <KanbanTitle sprint={activeSprint} stage={stage} />
                        })}


                    </Row>
                    <Row gutter={16} style={{ height: `83 % `, margin: "0 2%", flexWrap: "nowrap" }}>

                        {stages?.map((stage) => {
                            return <KanbanBody sprint={activeSprint} stage={stage} />

                        })}

                    </Row>
                    <ActivityDetail />

                </div>
            </DndContext>
        ) : (
            <div style={{ height: "100%", width: "100%", padding: "0 2%", overflowX: "auto", overflowY: "unset" }}>
                <Flex justify="center">
                    <p>Please active sprint to display activities ...</p>
                </Flex>
            </div>
        ))
    );
};

export default KanbanBoard;
