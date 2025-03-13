import React, { useState, useLayoutEffect, useRef, useEffect } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, useSortable, arrayMove, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, Button, Input, Select, Modal } from "antd";
import Layout, { Content } from "antd/es/layout/layout";

const { Option } = Select;

const statusColors = {
  todo: "#89CFF0",
  doing: "#FFD700",
  done: "#90EE90",
};

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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const stageRefs = useRef({});

  const showAddStageModal = (index) => {
    setSelectedIndex(index);
    setIsModalVisible(true);
  };

  const setRefs = (id, element) => {
    stageRefs.current[id] = element;
  };

 

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = stages.findIndex((s) => s.id === active.id);
    const newIndex = stages.findIndex((s) => s.id === over.id);
    const newStages = arrayMove(stages, oldIndex, newIndex);

    newStages.forEach((stage, index) => {
      stage.parent = index > 0 ? newStages[index - 1].id : null;
    });

    setStages([...newStages]);
  };

  // Hàm cập nhật connections
const updateConnections = () => {
  const newConnections = stages
    .filter((stage) => stage.parent)
    .map((stage) => {
      const parentElement = stageRefs.current[stage.parent];
      const childElement = stageRefs.current[stage.id];

      if (!parentElement || !childElement) return null;

      const parentRect = parentElement.getBoundingClientRect();
      const childRect = childElement.getBoundingClientRect();

      return {
        id: stage.id,
        x1: parentRect.right + 5 ,
        y1: parentRect.top + parentRect.height / 2,
        x2: childRect.left -15,
        y2: childRect.top + childRect.height / 2,
      };
    })
    .filter(Boolean);

  setConnections(newConnections);
};

const handleAddStage = () => {
  if (!newStageName.trim()) return;

  const newStage = {
    id: (stages.length + 1).toString(),
    stageName: newStageName,
    stageStatus: newStageStatus,
    parent: selectedIndex !== null ? stages[selectedIndex]?.id : (stages.length > 0 ? stages[stages.length - 1].id : null),
  };

  let updatedStages = [...stages, newStage];
  updatedStages.splice(selectedIndex + 1, 0, newStage);

  setStages(updatedStages);
  setNewStageName("");
  setNewStageStatus("todo");
  setIsModalVisible(false);

  // Chờ React render xong để cập nhật connections
  setTimeout(updateConnections, 0);
};



// useEffect chạy khi stages thay đổi
useEffect(() => {
  setTimeout(updateConnections, 0);
}, [stages]);

  


  return (
    <Layout>
      <Content >
        <Button type="primary" onClick={() => showAddStageModal(null)} style={{ marginBottom: "20px" }}>
          Add Stage
        </Button>

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

        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={stages.map((s) => s.id)} strategy={horizontalListSortingStrategy}>
            <div style={{ display: "flex", gap: "10px",  position: "relative", height: "100px" , width: "50px"}}>
              {stages.map((stage, index) => (
                <React.Fragment key={stage.id}>
                  <StageItem stage={stage} setRefs={setRefs} />
                  {index < stages.length - 1 && (
                    <Button onClick={() => showAddStageModal(index)} type="dashed">+</Button>
                  )}
                </React.Fragment>
              ))}
            </div>
          </SortableContext>
        </DndContext>

        <Modal title="Add new stage" open={isModalVisible} onOk={handleAddStage} onCancel={() => setIsModalVisible(false)}>
          <Input placeholder="Stage Name" value={newStageName} onChange={(e) => setNewStageName(e.target.value)} style={{ marginBottom: "10px" }} />
          <Select value={newStageStatus} onChange={setNewStageStatus} style={{ width: "100%" }}>
            <Option value="todo">To Do</Option>
            <Option value="doing">Doing</Option>
            <Option value="done">Done</Option>
          </Select>
        </Modal>
      </Content>
    </Layout>
  );
};

export default Stage;
