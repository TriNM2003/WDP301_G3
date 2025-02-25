
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

const { Title } = Typography;

const KanbanBoard = () => {
    const {showNotification} =useContext(AppContext)

    const columns = ["To Do", "In Progress", "Review", "Done", "Done 2"];
    const [completedModal, setCompletedModal] = useState(false);

    const showCompletedModal = () => {
        setCompletedModal(true);
    };

    const handleCompletedCancel = () => {
        setCompletedModal(false);
    };

    const handleCompletedSprint = () => {
        message.success({
            content: `🎯 (Sprint name) has been completed successfully! 🚀 
                      - ✅ 10 (tasks) completed 
                      - ⚠️ 3 (uncompleted bugs) moved to {sprint}`,
            duration: 4, // Thời gian hiển thị message (4 giây)

        });
        showNotification(`Project update`, `🎯 (Sprint name) has been completed successfully! 🚀 
        - ✅ 10 (tasks) completed 
        - ⚠️ 3 (uncompleted bugs) moved to  {sprint}`)

        setCompletedModal(false);

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
                        <Button variant="solid" color="green" style={{ borderRadius: "0%" }} onClick={showCompletedModal}><CheckOutlined /> Complete sprint</Button>
                        <Modal
                            title={
                                <div style={{ textAlign: "center" }}>
                                    <img src="https://cdn-icons-png.flaticon.com/512/616/616490.png" alt="Medal" width={50} />
                                    <Title level={3} style={{ marginTop: 10 }}>
                                        Complete "Sprint name"
                                    </Title>
                                </div>
                            }
                            open={completedModal}
                            onOk={handleCompletedSprint}
                            onCancel={handleCompletedCancel}
                            footer={[
                                <Button key="cancel" onClick={handleCompletedCancel}>
                                    Cancel
                                </Button>,
                                <Button key="complete" variant="solid" color="green" style={{ borderRadius: "0%" }} onClick={handleCompletedSprint}>
                                    Complete
                                </Button>,
                            ]}
                        >
                            <strong>This sprint contains:</strong>
                            <ul>
                                <li><CheckSquareFilled style={{ color: green[6] }} /> 0 completed activities</li>
                                <li><WarningFilled style={{ color: orange[4] }} /> 7 uncompleted activities</li>
                            </ul>

                            <Divider />

                            <strong strong>Complete or move uncompleted activities to:</strong>
                            <Select
                                value="{moveTo}"
                                onChange="{setMoveTo}"
                                style={{ width: "100%", marginTop: 5, marginBottom: 15 }}
                            >
                                <Option value="New sprint">New sprint</Option>
                                <Option value="Backlog">Backlog</Option>
                            </Select>
                        </Modal>
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
