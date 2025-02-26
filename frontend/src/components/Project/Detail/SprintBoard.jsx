import React from "react";
import { Collapse, Button, Tag, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { Panel } = Collapse;

const SprintBoard = () => {
  return (
    <div style={{ padding: 20 }}>
      <Collapse defaultActiveKey={["1", "2", "3"]} ghost>
        {/* Sprint Active */}
        <Panel header="TEST Sprint 6  (17 Feb - 20 Feb)" key="1">
          <Space direction="vertical" style={{ width: "100%" }}>
            <Space style={{ justifyContent: "space-between", width: "100%" }}>
              <span>TEST-6 St3</span>
              <Tag color="blue">DOING</Tag>
            </Space>
            <Space style={{ justifyContent: "space-between", width: "100%" }}>
              <span>TEST-3 ok3</span>
              <Tag color="green">DONE</Tag>
            </Space>
            <Button type="primary">Complete sprint</Button>
          </Space>
        </Panel>

        {/* Sprint Planning */}
        <Panel header="TEST Sprint 6 (0 issues)" key="2">
          <p>Plan a sprint by dragging issues here.</p>
          <Button type="dashed" icon={<PlusOutlined />}>
            Create issue
          </Button>
        </Panel>

        {/* Backlog */}
        <Panel header="Backlog (4 issues)" key="3">
          <Space direction="vertical" style={{ width: "100%" }}>
            <Space style={{ justifyContent: "space-between", width: "100%" }}>
              <span>TEST-4 St1</span>
              <Tag color="green">DONE</Tag>
            </Space>
            <Space style={{ justifyContent: "space-between", width: "100%" }}>
              <span>TEST-5 St2</span>
              <Tag color="green">DONE</Tag>
            </Space>
            <Space style={{ justifyContent: "space-between", width: "100%" }}>
              <span>TEST-4 ok1</span>
              <Tag color="green">DONE</Tag>
            </Space>
            <Space style={{ justifyContent: "space-between", width: "100%" }}>
              <span>TEST-2 ok2</span>
              <Tag color="green">DONE</Tag>
            </Space>
            <Button type="dashed" icon={<PlusOutlined />}>
              Create issue
            </Button>
          </Space>
        </Panel>
      </Collapse>
    </div>
  );
};

export default SprintBoard;
