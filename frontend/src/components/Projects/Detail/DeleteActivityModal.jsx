import { blue, cyan, gray, green } from "@ant-design/colors";
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
import { AppContext } from "../../../context/AppContext";


function DeleteActivityModal() {
    const { activity, setActivity, handleActivityCreate, createActivityModal, setCreateActivityModal,
        activityName, setActivityName, activityModal, setActivityModal, showActivity, closeActivity, showDeleteActivity,
        handleDelete, handleCloseDeleteActivityModal, deleteActivity, setDeleteActivity, activityToDelete, setActivityToDelete,
        confirmActivity, setConfirmActivity, showNotification }
        = useContext(AppContext);

    return (
        <Modal
            title={
                <Flex align="center">
                    <ExclamationCircleOutlined style={{ color: "red", marginRight: 8 }} />
                    Confirm Delete Activity
                </Flex>
            }
            open={deleteActivity}
            onCancel={handleCloseDeleteActivityModal}
            footer={[
                <Button key="cancel" onClick={handleCloseDeleteActivityModal}>
                    Cancel
                </Button>,
                <Button key="delete" type="primary" danger onClick={handleDelete} disabled={confirmActivity !== activityToDelete}>
                    Delete
                </Button>,
            ]}
        >
            <p>Are you sure you want to delete <strong>{activityToDelete}</strong>?</p>
            <p>Please type <strong>"{activityToDelete}"</strong> to confirm:</p>
            <Input placeholder="Enter activity name" value={confirmActivity} onChange={(e) => setConfirmActivity(e.target.value)} />
        </Modal>
    )
}

export default DeleteActivityModal
