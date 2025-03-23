import { blue, cyan, gray, green, orange, red } from "@ant-design/colors";
import {
    DeleteOutlined,
    EllipsisOutlined,
    FireOutlined,
    FormOutlined,
    PlusOutlined,
    ExclamationCircleOutlined,
    CloseOutlined,
    UserOutlined,
    PieChartOutlined,
    CalendarOutlined,
    FileTextOutlined,
    DoubleRightOutlined,
    MinusOutlined,
    UpOutlined,
    DownOutlined,
} from "@ant-design/icons";
import {
    Avatar,
    Button,
    Card,
    Col,
    DatePicker,
    Divider,
    Dropdown,
    Flex,
    Image,
    Input,
    Menu,
    Modal,
    Progress,
    Row,
    Select,
    Space,
    Tag,
    TimePicker,
    Tooltip,
    message,
} from "antd";
import React, { useContext, useState } from "react";
import { AppContext } from "../../../../context/AppContext";
import Title from "antd/es/typography/Title";
import { Option } from "antd/es/mentions";
import TextArea from "antd/es/input/TextArea";
import ActivityDetail from "../../../Activity/ActivityDetail";
import DeleteActivityModal from "../DeleteActivityModal";
import { DndContext, DragOverlay } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import KanbanActivity from "../../../Activity/KanbanActivity";
import DropContainer from "../Sprint/DropContainer";
function KanbanBody({ sprint, stage }) {
    const { activity, setActivity, activities, searchActivity, activeDragActivity, setActiveDragActivity, setSearchActivity, handleActivityCreate, createActivityModal, setCreateActivityModal, activityName, setActivityName, activityModal, setActivityModal, showActivity, closeActivity, showDeleteActivity, handleDelete, handleCloseDeleteActivityModal, deleteActivity, setDeleteActivity, activityToDelete, setActivityToDelete, confirmActivity, setConfirmActivity, showNotification } = useContext(AppContext);





    const [filterActivityType, setFliterActivityType] = useState(["task"]);
    const filteredActivitites = activities?.filter((activity) => activity && activity?.activityTitle.toUpperCase().includes(searchActivity?.toUpperCase()))
        .filter((a) => a && (filterActivityType.length > 0 ? filterActivityType.includes(a?.type?.typeName) : true));
    const [createActivityStageId, setCreateActivityStageId] = useState(null);


    return (
        <Col span={6} >

            <Card style={{ borderRadius: "0", background: "#F5F5F5", minHeight: "50% " }} bodyStyle={{ padding: "2%" }}>
                <SortableContext
                    id={stage?._id}
                    items={filteredActivitites?.filter(activity => activity?.stage?._id === stage?._id && activity?.sprint?._id == sprint?._id).map(a => a._id)}
                    strategy={verticalListSortingStrategy}
                >
                    <DropContainer id={stage?._id}>
                        {filteredActivitites?.filter(activity => activity?.stage?._id == stage?._id && activity?.sprint?._id == sprint?._id).map((a) => (
                            <KanbanActivity key={a?._id} a={a} />
                        ))}
                    </DropContainer>
                </SortableContext>


                {createActivityModal && createActivityStageId == stage._id ? (
                    <Input
                        value={activityName}
                        autoFocus
                        onChange={(e) => setActivityName(e.target.value)}
                        onPressEnter={() => {
                            handleActivityCreate(sprint?.sprintName, stage?.stageName, "task", null);
                            setCreateActivityModal(false);
                            setCreateActivityStageId(null);
                        }}
                        onBlur={() => {
                            setCreateActivityModal(false);
                            setCreateActivityStageId(null);
                        }}
                        placeholder="Enter activity name"
                        prefix={<FormOutlined />}
                        style={{ borderRadius: 0 }}
                    />
                ) : (
                    <Button
                        type="text"
                        style={{ width: "100%", borderRadius: "0", color: gray[4] }}
                        onClick={() => {
                            setCreateActivityModal(true);
                            setCreateActivityStageId(stage._id);
                        }}
                    >
                        <PlusOutlined /> Create activity
                    </Button>
                )}

            </Card>


            {/* Modal hiển thị chi tiết Activity */}


            <DragOverlay>
                {activeDragActivity && (
                    <KanbanActivity
                        key={activeDragActivity?._id}
                        a={activeDragActivity}
                        isDragging={true}
                    />
                )}
            </DragOverlay>
        </Col>
    );
}

export default KanbanBody;
