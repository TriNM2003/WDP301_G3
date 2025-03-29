import { useState, useEffect, useContext,useRef } from "react"
import { DndContext, closestCenter } from "@dnd-kit/core"
import { SortableContext, useSortable, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card, Button, Layout, Modal, Input, Select, message, Breadcrumb, Form } from "antd"
import { LeftOutlined, PlusCircleOutlined, EditOutlined, ExclamationCircleOutlined } from "@ant-design/icons"
import { AppContext } from "../../context/AppContext"
import axios from "axios"
import { Link } from 'react-router-dom';
import authAxios from './../../utils/authAxios';
import { useSensor, useSensors, MouseSensor } from "@dnd-kit/core";


const { Content, Sider } = Layout
const { Option } = Select
const { confirm } = Modal




// Separate component for better organization


const SortableItem = ({ stage, onSelect, sequenceLabel }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: stage?._id,
  });

  const wasDragging = useRef(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    textAlign: "center",
    backgroundColor: stage?.stageColor || "#f5f5f5",
    cursor: "pointer",
    width: "250px",
    marginBottom: "30px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    position: "relative",
  };

  const handlePointerDown = () => {
    wasDragging.current = false;
  };

  const handleDragStart = () => {
    wasDragging.current = true;
  };

  const handleClick = () => {
    if (!wasDragging.current) {
      onSelect({ ...stage });
    }
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      {...attributes}
      {...listeners}
    >
      <div
        style={{
          position: "absolute",
          top: "-15px",
          left: "10px",
          background: "#1890ff",
          color: "white",
          borderRadius: "12px",
          padding: "2px 8px",
          fontSize: "12px",
          fontWeight: "bold",
        }}
      >
        {sequenceLabel}
      </div>
      {stage?.stageName}
    </Card>
  );
};


// Separate component for better organization
const AddStageIcon = ({ onClick }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginBottom: "30px",
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      <PlusCircleOutlined
        style={{
          fontSize: "24px",
          color: "#1890ff",
          transition: "transform 0.3s",
        }}
        className="add-icon-hover"
      />
      <style jsx global>{`
        .add-icon-hover:hover {
          transform: scale(1.2);
        }
      `}</style>
    </div>
  )
}

const StageManagement = () => {
  // const [stages, setStages] = useState([])
  const [selectedStage, setSelectedStage] = useState(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newStageName, setNewStageName] = useState("")
  const [newStageStatus, setNewStageStatus] = useState("todo")
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editStageName, setEditStageName] = useState("")
  const [editStageStatus, setEditStageStatus] = useState("")
  const [insertPosition, setInsertPosition] = useState(null)
  const [loading, setLoading] = useState(false)
  const { accessToken, siteAPI, site, project, stages, setStages, activities, showNotification, setRefreshNoti, user, activityModalLoading } = useContext(AppContext)
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();


  const breadCrumbItems = [
    { title: <Link to="/Home">Home</Link> },
    { title: <Link to="/site">Site</Link> },
    { title: <Link to="/site/list/projects">Projects</Link> },
    {
      title: project ? (
        <Link to={"/site/list/projects/" + (project.projectSlug || "error")}>
          {project.projectName || "Not found"}
        </Link>
      ) : "Project"
    },
    { title: "Project Workflow" }
  ];


  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 5, // di chuyển ít nhất 5px mới tính là drag
    },
  });
  const sensors = useSensors(mouseSensor);

  // Fetch stages data
  const fetchStages = () => {
    if (!site?._id || !accessToken || !project?._id) return

    setLoading(true)
    authAxios
      .get(`${siteAPI}/${site._id}/projects/${project._id}/stages/get-all`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => {
        setStages(res?.data?.stages || [])
      })
      .catch((err) => {
        console.error("Error fetching stages:", err)
        message.error("Failed to load stages")
      })
      .finally(() => {
        setLoading(false)
      })
  }

  // Update the useEffect to use the fetchStages function
  useEffect(() => {
    fetchStages()
  }, [site, accessToken, siteAPI, project])

  // Open detail panel when a stage is selected
  useEffect(() => {
    if (selectedStage) {
      setIsDetailOpen(true)
    }
  }, [selectedStage])


  const sortStagesByParent = (stageList) => {
    if (!Array.isArray(stageList) || stageList.length === 0) return [];

    // Tạo một Map để dễ dàng tra cứu stage
    const stageMap = new Map();
    stageList.forEach((stage) => {
      if (stage?._id) {
        stageMap.set(stage._id, { ...stage, children: [] });
      }
    });

    // Xây dựng quan hệ parent-child
    const rootStages = [];
    stageList.forEach((stage) => {
      if (stage?.parent && stage?.parent?._id && stageMap.has(stage.parent._id)) {
        // Nếu có parent, thêm vào danh sách children của parent
        const parentStage = stageMap.get(stage.parent._id);
        const currentStage = stageMap.get(stage._id);
        if (parentStage && currentStage) {
          parentStage.children.push(currentStage);
        }
      } else if (stage?._id) {
        // Nếu không có parent, thêm vào danh sách root
        rootStages.push(stageMap.get(stage._id));
      }
    });

    // Sắp xếp children theo thời gian tạo (hoặc một tiêu chí khác nếu cần)
    const sortChildren = (stage) => {
      if (stage.children.length > 1) {
        stage.children.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      }
      stage.children.forEach(sortChildren);
    };
    rootStages.forEach(sortChildren);

    // Duyệt cây bằng DFS để tạo danh sách stage theo thứ tự
    const sortedStages = [];
    const traverse = (nodes) => {
      nodes.forEach((node) => {
        sortedStages.push(node);
        if (node?.children?.length > 0) {
          traverse(node.children);
        }
      });
    };

    traverse(rootStages);
    return sortedStages;
  };


  // Handle drag end event
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = stages.findIndex((s) => s?._id === active.id);
    const newIndex = stages.findIndex((s) => s?._id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const newStages = arrayMove(stages, oldIndex, newIndex);

    // Ngăn chặn stage "done" ở đầu danh sách
    if (newStages[0]?.stageStatus === "done") {
      message.warning("The 'Done' stage cannot be placed at the top.");
      return;
    }

    newStages.forEach((stage, index) => {
      stage.parent = index > 0 ? { _id: newStages[index - 1]?._id } : null;
    });

    setStages([...newStages]);

    const draggedStage = newStages.find((stage) => stage._id === active.id);
    if (draggedStage) {
      setSelectedStage(draggedStage);
      setIsDetailOpen(true);
    }

    updateStagesInDatabase(newStages);
  };


  // Add this new function to handle database updates after drag and drop
  const updateStagesInDatabase = async (updatedStages) => {
    if (!site?._id || !accessToken || !project?._id) return

    try {
      // Create an array of updates with stage ID and its parent ID
      const updates = updatedStages.map((stage) => ({
        stageId: stage?._id,
        parentId: stage?.parent ? stage.parent?._id : null,
      }))

      // Send the updates to the API
      await authAxios.post(
        `${siteAPI}/${site._id}/projects/${project._id}/stages/update-parents`,
        { updates },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      )

      message.success("Stage order updated successfully")
      showNotification(
        "Stage order updated",
        `You just updated stage order in project: "${project?.projectName}"`
      );
      setRefreshNoti((prev) => !prev);
    } catch (error) {
      if (error?.response?.data?.error?.message) {
        message.error(error.response.data.error.message);
      } else if (error?.errorFields) {
        return;
      } else {
        console.error("Error update stage:", error);
        message.error("Failed to update stage");
      }
    }
  };

  // Add stage at a specific position
  const handleAddStageAtPosition = (afterStageId) => {
    setInsertPosition(afterStageId)
    setIsModalOpen(true)
  }

  // Add stage at the end
  const handleAddStageAtEnd = () => {
    setInsertPosition(null)
    setIsModalOpen(true)
  }

  const handleAddStage = async () => {
    try {
      const values = await form.validateFields();
      const { stageName, stageStatus } = values;
  
      let parentId = null;
      let childId = null;
  
      if (insertPosition === null) {
        const lastStage = stages.length > 0 ? stages[stages.length - 1] : null;
        parentId = lastStage ? lastStage._id : null;
      } else {
        const insertIndex = stages.findIndex(stage => stage?._id === insertPosition);
        if (insertIndex !== -1) {
          parentId = insertPosition;
          childId = insertIndex + 1 < stages.length ? stages[insertIndex + 1]?._id : null;
        }
      }
  
      const response = await authAxios.post(
        `${siteAPI}/${site._id}/projects/${project._id}/stages/add`,
        {
          stageName,
          stageStatus,
          parent: parentId,
          child: childId,
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
  
      if (response?.data?.stage) {
        const newStage = response.data.stage;
        let updatedStages = [...stages];
  
        if (insertPosition !== null) {
          const insertIndex = updatedStages.findIndex(stage => stage._id === insertPosition);
          if (insertIndex !== -1) {
            updatedStages.splice(insertIndex + 1, 0, newStage);
          }
        } else {
          updatedStages.push(newStage);
        }
  
        if (childId) {
          updatedStages = updatedStages.map(stage =>
            stage._id === childId ? { ...stage, parent: { _id: newStage._id } } : stage
          );
        }
  
        updatedStages = sortStagesByParent(updatedStages);
        setStages(updatedStages);
        setSelectedStage(newStage);
  
        message.success("Stage added successfully");
        showNotification("Stage created", `You just created a new stage: "${stageName}"`);
        setRefreshNoti(prev => !prev);
  
        setIsModalOpen(false);
        setInsertPosition(null);
        form.resetFields();
      }
    } catch (error) {
      if (error?.response?.data?.error?.message) {
        message.error(error.response.data.error.message);
      } else if (error?.errorFields) {
        return;
      } else {
        console.error("Error adding stage:", error);
        message.error("Failed to add stage");
      }
    }
  };
  


  useEffect(() => {

  }, [stages]);


  // Render stages with add icons between them
  const renderStagesWithAddIcons = () => {
    const sortedStages = sortStagesByParent(stages)
    const result = []

    if (!sortedStages || sortedStages.length === 0) {
      // If no stages, show a message and a button to add the first stage
      return (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p>No stages found. Add your first stage to get started.</p>
          <Button type="primary" onClick={handleAddStageAtEnd} style={{ marginTop: "20px" }}>
            Add First Stage
          </Button>
        </div>
      )
    }

    sortedStages.forEach((stage, index) => {
      // Determine sequence label
      let sequenceLabel
      if (index === 0) {
        sequenceLabel = "start"
      } else if (index === sortedStages.length - 1) {
        sequenceLabel = "end"
      } else {
        sequenceLabel = (index + 1).toString()
      }

      result.push(
        <SortableItem key={stage?._id} stage={stage} onSelect={setSelectedStage} sequenceLabel={sequenceLabel} />,
      )

      // Add "AddStageIcon" between stages, not after the last one
      if (index < sortedStages.length - 1) {
        result.push(
          <AddStageIcon key={`add-after-${stage?._id}`} onClick={() => handleAddStageAtPosition(stage?._id)} />,
        )
      }
    })

    return result
  }

  // Open edit modal
  const openEditModal = () => {
    if (selectedStage) {
      editForm.setFieldsValue({
        stageName: selectedStage.stageName || "",
        stageStatus: selectedStage.stageStatus || "todo",
      });
      setIsEditModalOpen(true);
    }
  };


  // Save changes to the stages list
  const handleEditStage = async () => {
    try {
      const values = await editForm.validateFields();
      const { stageName, stageStatus } = values;

      const updatedStages = stages.map(stage =>
        stage._id === selectedStage?._id
          ? { ...stage, stageName, stageStatus } // Giả lập stage sau khi update
          : stage
      );

      const hasTodo = updatedStages.some(stage => stage.stageStatus === "todo");
      const hasDone = updatedStages.some(stage => stage.stageStatus === "done");
      const hasDoing = updatedStages.some(stage => stage.stageStatus === "doing");
      if (!hasTodo || !hasDone || !hasDoing) {
        return message.error("Project must always contain at least one 'To Do', one 'Doing' and one 'Done' stage.");
      }

      // Nếu hợp lệ thì gửi API
      await authAxios.post(
        `${siteAPI}/${site._id}/projects/${project._id}/stages/update`,
        {
          stageId: selectedStage?._id,
          stageName,
          stageStatus,
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      // Update UI...
      setStages((prev) =>
        prev.map((stage) =>
          stage._id === selectedStage?._id
            ? { ...stage, stageName, stageStatus }
            : stage
        )
      );

      setSelectedStage((prev) => ({
        ...prev,
        stageName,
        stageStatus,
      }));

      message.success("Stage updated successfully");

      const nameChanged = stageName.trim() !== selectedStage?.stageName;
      const statusChanged = stageStatus !== selectedStage?.stageStatus;

      let messageContent = "";


      if (nameChanged && statusChanged) {
        messageContent = `You just edited stage: "${selectedStage?.stageName}" ➝ "${stageName}", and status: "${selectedStage?.stageStatus}" ➝ "${stageStatus}"`;
      } else if (nameChanged) {
        messageContent = `You just changed stage name: "${selectedStage?.stageName}" ➝ "${stageName}"`;
      } else if (statusChanged) {
        messageContent = `You just changed status of stage "${selectedStage?.stageName}" ➝ "${stageStatus}"`;
      }


      if (messageContent) {
        showNotification("Stage edited", messageContent);
      }



      setIsEditModalOpen(false);
      editForm.resetFields();
      setRefreshNoti(prev => !prev);
    } catch (error) {
      if (error?.response?.data?.error?.message) {
        message.error(error.response.data.error.message);
      } else if (error?.errorFields) {
        return;
      } else {
        console.error("Error update stage:", error);
        message.error("Failed to update stage");
      }
    }
  };



  // Hàm xử lý xóa stage
  const handleDeleteStage = (stageId) => {
    if (!stageId) return;

    const stageToDelete = stages.find((stage) => stage._id === stageId);
    if (!stageToDelete) return;

    const otherStages = stages.filter((stage) => stage._id !== stageId);

    // Đảm bảo luôn có ít nhất 3 stage mặc định
    const stageStatuses = otherStages.map((stage) => stage.stageStatus);
    if (!["todo", "doing", "done"].every((status) => stageStatuses.includes(status))) {
      return message.error("Cannot delete this stage. The project must have at least 'To Do', 'Doing', and 'Done' stages.");
    }

    // Nếu stage có activities → yêu cầu chọn stage để di chuyển
    openDeleteConfirmation(stageToDelete, otherStages);
  };

  // Hiển thị modal xác nhận xóa (và chọn nơi chuyển công việc nếu có)
  const openDeleteConfirmation = (stageToDelete, allOtherStages) => {
    const hasActivities = stageToDelete.activities?.length > 0;

    // Loại bỏ các stage có stageStatus === "done"
    const eligibleTargetStages = allOtherStages.filter(stage => stage.stageStatus !== "done");

    if (hasActivities && eligibleTargetStages.length === 0) {
      return message.warning("Cannot delete this stage because no valid target stage (excluding DONE) is available to move activities.");
    }

    // Mặc định chọn stage đầu tiên hợp lệ
    let selectedTargetStage = eligibleTargetStages[0]?._id;

    Modal.confirm({
      title: hasActivities
        ? `Move work from "${stageToDelete.stageName}" column`
        : "Are you sure you want to delete this stage?",
      icon: <ExclamationCircleOutlined style={{ color: "#ff4d4f", fontSize: "24px" }} />,
      content: hasActivities ? (
        <div style={{ marginTop: "20px" }}>
          <p>{`Select a new home for any work in "${stageToDelete.stageName}" (excluding Done).`}</p>
          <div style={{ display: "flex", alignItems: "center", gap: "20px", marginTop: "20px" }}>
            <StageBadge stage={stageToDelete} />
            <div style={{ fontSize: "20px" }}>→</div>
            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: "8px", color: "#666" }}>Move existing work items to:</div>
              <Select
                defaultValue={selectedTargetStage}
                style={{ width: "100%" }}
                onChange={(value) => (selectedTargetStage = value)}
              >
                {eligibleTargetStages.map((stage) => (
                  <Option key={stage._id} value={stage._id}>
                    {stage.stageName}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
        </div>
      ) : "This action cannot be undone.",
      okText: "Delete",
      okButtonProps: { danger: true },
      cancelText: "Cancel",
      width: 600,
      onOk: () =>
        handleDelete(
          stageToDelete._id,
          hasActivities ? selectedTargetStage : null
        ),
    });
  };


  // Component hiển thị badge stage
  const StageBadge = ({ stage }) => (
    <div>
      <div style={{ marginBottom: "8px", color: "#666" }}>This status will be deleted:</div>
      <div style={{
        padding: "4px 8px",
        border: "1px solid #d9d9d9",
        borderRadius: "2px",
        backgroundColor: stage.stageColor || "#f5f5f5",
        display: "inline-block",
      }}>
        {stage.stageName}
      </div>
    </div>
  );

  // Gọi API để xóa stage (và di chuyển activities nếu có)
  const handleDelete = async (stageId, targetStageId = null) => {
    if (!site?._id || !accessToken || !project?._id) return;

    try {
      const response = await authAxios.post(
        `${siteAPI}/${site._id}/projects/${project._id}/stages/delete`,
        { stageId, ...(targetStageId && { targetStageId }) },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      // Cập nhật state sau khi xóa
      setStages((prevStages) =>
        prevStages
          .filter((stage) => stage._id !== stageId)
          .map((stage) =>
            stage.parent?._id === stageId ? { ...stage, parent: null } : stage
          )
      );

      setSelectedStage(null);

      //  Notification 
      const deletedStage = stages.find((s) => s._id === stageId);
      const movedToStage = stages.find((s) => s._id === targetStageId);

      if (deletedStage) {
        const messageContent = targetStageId
          ? `You just deleted stage "${deletedStage.stageName}" and moved its activities to "${movedToStage?.stageName || "another stage"}".`
          : `You just deleted stage "${deletedStage.stageName}".`;

        showNotification("Stage deleted", messageContent);
      }

      message.success(
        targetStageId
          ? "Stage deleted and activities moved successfully"
          : "Stage deleted successfully"
      );

      setRefreshNoti((prev) => !prev);
      activityModalLoading();
    } catch (error) {
      if (error?.response?.data?.error?.message) {
        message.error(error.response.data.error.message);
      } else if (error?.errorFields) {
        return;
      } else {
        console.error("Error delete stage:", error);
        message.error("Failed to delete stage");
      }
    }
  };



  return (
    <Layout style={{ maxHeight: "100%", position: "relative" }}>
      {/* Toggle sidebar button */}
      <Button
        type="text"
        shape="circle"
        style={{
          position: "absolute",
          top: "50%",
          right: isDetailOpen ? "330px" : "65px",
          transform: "translateY(-50%)",
          zIndex: 1000,
          background: "#f5f5f5",
          border: "1px solid #ccc",
        }}
        onClick={() => setIsDetailOpen(!isDetailOpen)}
        icon={<LeftOutlined rotate={isDetailOpen ? 180 : 0} />}
      />

      {/* Main content area */}
      <Content style={{ flex: 1, padding: "20px", background: "#f5f5f5", overflow: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "50px" }}>
          <Breadcrumb items={breadCrumbItems} />
          {stages && stages.length > 0 && (
            <Button type="primary" onClick={handleAddStageAtEnd}>
              Add Stage
            </Button>
          )}
        </div>


        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>Loading stages...</div>
        ) : (
          <DndContext  sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext
              items={stages?.map((s) => s?._id).filter(Boolean) || []}
              strategy={verticalListSortingStrategy}
            >
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                {renderStagesWithAddIcons()}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </Content>

      {/* Details sidebar */}
      <Sider
        width={350}
        style={{
          background: "white",
          padding: "20px",
          borderLeft: "1px solid #ddd",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
        collapsed={!isDetailOpen}
      >
        {isDetailOpen && (
          <>
            <div>
              <div
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}
              >
                <h3 style={{ margin: 0 }}>Stage Details</h3>
                {selectedStage && (
                  <EditOutlined
                    style={{ fontSize: "18px", cursor: "pointer", color: "#1890ff" }}
                    onClick={openEditModal}
                  />
                )}
              </div>

              {selectedStage ? (
                <Card>
                  <div
                    style={{
                      height: "20px",
                      backgroundColor: selectedStage?.stageColor || "#f5f5f5",
                      borderRadius: "4px",
                      marginTop: "10px",
                    }}
                  />
                  <p>
                    <strong>Name:</strong> {selectedStage?.stageName}

                  </p>
                  <p>
                    <strong>Status:</strong> {selectedStage?.stageStatus?.toUpperCase()}
                  </p>

                </Card>
              ) : (
                <p>Select a stage to view details</p>
              )}
            </div>

            {selectedStage && (
              <Button
                type="primary"
                danger
                onClick={() => handleDeleteStage(selectedStage?._id)}
                style={{ marginTop: "100%" }}
              >
                Delete Stage
              </Button>
            )}
          </>
        )}
      </Sider>

      {/* Add stage modal */}
      <Modal
        title={insertPosition ? "Insert New Stage" : "Add New Stage"}
        open={isModalOpen}
        onOk={handleAddStage}
        onCancel={() => {
          setIsModalOpen(false);
          setInsertPosition(null);
          form.resetFields();
        }}
        bodyStyle={{ paddingTop: 15 }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Stage Name"
            name="stageName"
            rules={[
              { required: true, message: "Please enter the stage name" },
              { whitespace: true, message: "Stage name cannot be empty" },
              { min: 3, message: "Stage name must be at least 3 characters long" },
              { max: 30, message: "Stage name cannot exceed 30 characters" }
            ]}
          >
            <Input placeholder="Stage Name" />
          </Form.Item>

          <Form.Item
            label="Stage Status"
            name="stageStatus"
            initialValue="todo"
            rules={[{ required: true, message: "Please select stage status" }]}
          >
            <Select>
              <Option value="todo">To Do</Option>
              <Option value="doing">Doing</Option>
              <Option value="done">Done</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>


      {/* Edit stage modal */}
      <Modal
        title="Edit Stage"
        open={isEditModalOpen}
        onOk={handleEditStage}
        onCancel={() => {
          setIsEditModalOpen(false);
          editForm.resetFields(); // reset khi đóng
        }}
        bodyStyle={{ paddingTop: 15 }}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            label="Stage Name"
            name="stageName"
            rules={[
              { required: true, message: "Please enter the stage name" },
              { whitespace: true, message: "Stage name cannot be empty" },
              { min: 3, message: "Stage name must be at least 3 characters long" },
              { max: 30, message: "Stage name cannot exceed 30 characters" },
            ]}
          >
            <Input placeholder="Enter stage name" />
          </Form.Item>

          <Form.Item
            label="Stage Status"
            name="stageStatus"
            rules={[{ required: true, message: "Please select stage status" }]}
          >
            <Select style={{ width: "100%" }}>
              <Select.Option value="todo">To Do</Select.Option>
              <Select.Option value="doing">Doing</Select.Option>
              <Select.Option value="done">Done</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

    </Layout>
  )
}

export default StageManagement

