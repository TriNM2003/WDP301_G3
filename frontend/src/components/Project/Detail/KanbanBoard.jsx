
import React from "react";
import { Row, Col, Card, Typography } from "antd";
import { cyan, gray, grey, greyDark, red } from "@ant-design/colors";

const { Title } = Typography;

const KanbanBoard = () => {
    const columns = ["To Do", "In Progress", "Review", "Done", "Done 2"];

    return (
        <div style={{ height: "100%", margin: 0,  overflowX: "auto", overflowY: "unset",}}>

            <Row gutter={16} style={{  margin: "0 2%", flexWrap: "nowrap" }}>
                {columns.map((column, index) => (
                    <Col key={index} span={6}>
                        <Card
                            style={{ maxHeight: "", overflowY: "auto", borderRadius:"0",background: red[0] }}
                            bodyStyle={{ padding: '2%' }}
                            >
                                <small style={{ margin: 0, fontWeight:"bolder", color:grey[4] }}>column</small>
                        </Card>
                    </Col>
                ))}
            </Row>
            <Row gutter={16} style={{  margin: "0 2%", overflowX: "auto", overflowY: "unset", flexWrap: "nowrap" }}>
                {columns.map((column, index) => (
                    <Col key={index} span={6}>
                        <Card
                            style={{ maxHeight: "", overflowY: "auto", borderRadius:"0",background: red[0] }}
                            bodyStyle={{ padding: '2%' }}
                            >
                                <text>okok</text>
                                <text>okok</text>
                                <text>okok</text>
                                <text>okok</text>
                                <text>okok</text>
                                <text>okok</text>
                                <text>okok</text>
                                <text>okok</text>
                                <text>okok</text>
                                <text>okok</text>
                                <text>okok</text>
                                <text>okok</text>
                                <text>okok</text>
                                <text>okok</text>
                                <text>okok</text>
                                <text>okok</text>
                                <text>okok</text>
                                <text>okok</text>
                                <text>okok</text>
                                <text>okok</text>
                                <text>okok</text>
                                <text>okok</text>
                                <text>okok</text>
                                <text>okok</text>
                                <text>okok</text>
                                <text>okok</text>
                                <text>okok</text>
                                <text>okok</text>
                                <text>okok</text>
                                <text>okok</text>
                                <text>okok</text>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default KanbanBoard;
