
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

const { Title } = Typography;

const KanbanBoard = () => {
    const { showNotification, completedSprint, setCompletedSprint, showCompletedSprint, handleCompletedSprint, handleCompletedCancel } = useContext(AppContext)

    const columns = ["To Do", "In Progress", "Review", "Done", "Done 2"];



    const [filters, setFilters] = useState({
        assigned: false,
        reviewed: false,
    });

    // Hàm cập nhật state chung
    const handleChangeFilter = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };
    const onSearch = (e) => {
        console.log("Tìm kiếm:", e.target.value);
    };
    return (
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
                        <Button variant="solid" color="green" style={{ borderRadius: "0%" }} onClick={showCompletedSprint}><CheckOutlined /> Complete sprint</Button>
                        <CompleteSprintModal />

                    </Flex>
                </Col>

            </Row>

            <Row gutter={16} style={{
                height: `7 % `, position: 'sticky',
                top: 0,
                zIndex: 10, margin: "0 2%", flexWrap: "nowrap"
            }}>
                <KanbanTitle column={"COLUMN"} />

            </Row>
            <Row gutter={16} style={{ height: `83 % `, margin: "0 2%", flexWrap: "nowrap" }}>
                <KanbanBody />

            </Row>
        </div>
    );
};

export default KanbanBoard;
