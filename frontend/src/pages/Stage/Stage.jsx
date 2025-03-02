import React, { useState, useLayoutEffect, useRef } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, useSortable, arrayMove, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, Button, Input, Select, Form } from "antd";

const { Option } = Select;

// Màu sắc tương ứng với stageStatus
const statusColors = {
  todo: "#89CFF0", // Xanh dương nhạt
  doing: "#FFD700", // Vàng nhạt
  done: "#90EE90", // Xanh lá nhạt
};

// Component Stage Item (Sortable)
const StageItem = ({ stage, setRefs }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: stage.id });

  const itemRef = useRef(null);

  useLayoutEffect(() => {
    if (itemRef.current) {
      setRefs(stage.id, itemRef.current);
    }
  }, [setRefs, stage.id]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginBottom: "8px",
    padding: "10px",
    textAlign: "center",
    backgroundColor: statusColors[stage.stageStatus] || "#f5f5f5",
    cursor: "grab",
    minWidth: "120px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    position: "relative",
  };

  return (
    <Card ref={(el) => { setNodeRef(el); itemRef.current = el; }} style={style} {...attributes} {...listeners}>
      {stage.stageName}
    </Card>
  );
};

const Stage = () => {
  const [stages, setStages] = useState([
    { id: "1", stageName: "To Do", stageStatus: "todo", parent: null },
    { id: "2", stageName: "Doing", stageStatus: "doing", parent: "1" },
    { id: "3", stageName: "Done", stageStatus: "done", parent: "2" },
  ]);

  const [newStageName, setNewStageName] = useState("");
  const [newStageStatus, setNewStageStatus] = useState("todo");
  const [connections, setConnections] = useState([]);

  const stageRefs = useRef({});

  // Lưu vị trí của từng stage
  const setRefs = (id, element) => {
    stageRefs.current[id] = element;
  };

  // Hàm cập nhật mũi tên kết nối
  const updateConnections = () => {
    const newConnections = stages
      .filter((stage) => stage.parent) // Chỉ lấy các stage có parent
      .map((stage) => {
        const parentElement = stageRefs.current[stage.parent];
        const childElement = stageRefs.current[stage.id];

        if (!parentElement || !childElement) return null;

        const parentRect = parentElement.getBoundingClientRect();
        const childRect = childElement.getBoundingClientRect();

        return {
          id: stage.id,
          x1: parentRect.right, // Điểm cuối cùng bên phải của parent
          y1: parentRect.top + parentRect.height / 10, // Giữa chiều cao của parent
          x2: childRect.left - 10, // Điểm đầu tiên bên trái của child
          y2: childRect.top + childRect.height / 10, // Giữa chiều cao của child
        };
      })
      .filter(Boolean);

    setConnections(newConnections);
  };

  // Cập nhật kết nối ngay sau khi render xong
  useLayoutEffect(() => {
    updateConnections();
  }, [stages]);

  // Xử lý khi kéo thả stage
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = stages.findIndex((s) => s.id === active.id);
    const newIndex = stages.findIndex((s) => s.id === over.id);

    const newStages = arrayMove(stages, oldIndex, newIndex);

    // Cập nhật quan hệ `parent`
    newStages.forEach((stage, index) => {
      stage.parent = index > 0 ? newStages[index - 1].id : null;
    });

    setStages([...newStages]);
  };

  // Xử lý thêm stage mới
  const handleAddStage = () => {
    if (!newStageName.trim()) return;

    const lastStage = stages[stages.length - 1]; // Lấy stage cuối cùng để làm parent
    const newStage = {
      id: (stages.length + 1).toString(),
      stageName: newStageName,
      stageStatus: newStageStatus,
      parent: lastStage ? lastStage.id : null,
    };

    setStages([...stages, newStage]);
    setNewStageName(""); // Reset input
  };

  return (
    <div style={{ padding: "20px", position: "relative" }}>
      {/* Form thêm stage mới */}
      <Form layout="inline" style={{ marginBottom: "20px" }}>
        <Form.Item>
          <Input placeholder="Stage Name" value={newStageName} onChange={(e) => setNewStageName(e.target.value)} />
        </Form.Item>
        <Form.Item>
          <Select value={newStageStatus} onChange={setNewStageStatus} style={{ width: 120 }}>
            <Option value="todo">To Do</Option>
            <Option value="doing">Doing</Option>
            <Option value="done">Done</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={handleAddStage}>Add Stage</Button>
        </Form.Item>
      </Form>

      {/* SVG Arrow Lines */}
      <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
        {connections.map(({ id, x1, y1, x2, y2 }) => (
          <line key={id} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#888" strokeWidth="2" markerEnd="url(#arrowhead)" />
        ))}
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="5" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#888" />
          </marker>
        </defs>
      </svg>

      {/* Danh sách Stage */}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={stages.map((s) => s.id)} strategy={horizontalListSortingStrategy}>
          <div style={{ display: "flex", gap: "100px", padding: "20px", position: "relative" }}>
            {stages.map((stage) => (
              <StageItem key={stage.id} stage={stage} setRefs={setRefs} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default Stage;
