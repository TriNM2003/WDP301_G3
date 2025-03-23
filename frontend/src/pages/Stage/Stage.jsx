import { useState, useEffect, useContext } from "react"
import { DndContext, closestCenter } from "@dnd-kit/core"
import { SortableContext, useSortable, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card, Button, Layout, Modal, Input, Select, message, Breadcrumb, Form } from "antd"
import { LeftOutlined, PlusCircleOutlined, EditOutlined, ExclamationCircleOutlined } from "@ant-design/icons"
import { AppContext } from "../../context/AppContext"
import axios from "axios"
import { Link } from 'react-router-dom';

const { Content, Sider } = Layout
const { Option } = Select
const { confirm } = Modal


// Separate component for better organization
const SortableItem = ({ stage, onSelect, sequenceLabel }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: stage?._id,
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  })

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
  }

  const handleClick = () => {
    onSelect({ ...stage })
  }

  return (
    <Card ref={setNodeRef} style={style} onClick={handleClick} {...attributes} {...listeners}>
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
  )
}

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
  const { accessToken, siteAPI, site, project, stages, setStages, activities } = useContext(AppContext)



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




  // Fetch stages data
  const fetchStages = () => {
    if (!site?._id || !accessToken || !project?._id) return

    setLoading(true)
    axios
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


    newStages.forEach((stage, index) => {
      stage.parent = index > 0 ? { _id: newStages[index - 1]?._id } : null;
    });

    setStages([...newStages]);

    const draggedStage = newStages.find((stage) => stage._id === active.id);
    if (draggedStage) {
      setSelectedStage(draggedStage);
      setIsDetailOpen(true); // đảm bảo mở sidebar nếu đang đóng
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
      await axios.post(
        `${siteAPI}/${site._id}/projects/${project._id}/stages/update-parents`,
        { updates },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      )

      message.success("Stage order updated successfully")
    } catch (error) {
      console.error("Error updating stage order:", error)
      message.error("Failed to update stage order")

      // Optionally, you could fetch the stages again to ensure UI is in sync with database
      // fetchStages()
    }
  }

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
    if (!newStageName?.trim()) {
      message.warning("Stage name cannot be empty");
      return;
    }

    let parentId = null;
    let childId = null;

    if (insertPosition === null) {
      //  Tìm stage cuối cùng trong danh sách đã sắp xếp
      const lastStage = stages.length > 0 ? stages[stages.length - 1] : null;
      parentId = lastStage ? lastStage._id : null;  //  Đảm bảo lấy đúng parent cuối cùng
    } else {
      // Nếu thêm vào giữa danh sách
      const insertIndex = stages.findIndex(stage => stage?._id === insertPosition);
      if (insertIndex !== -1) {
        parentId = insertPosition;
        childId = insertIndex + 1 < stages.length ? stages[insertIndex + 1]?._id : null;
      }
    }



    try {
      const response = await axios.post(
        `${siteAPI}/${site._id}/projects/${project._id}/stages/add`,
        {
          stageName: newStageName,
          stageStatus: newStageStatus,
          parent: parentId,
          child: childId,
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      if (response?.data?.stage) {
        const newStage = response.data.stage;
        let updatedStages = [...stages];

        //  Chèn stage mới vào đúng vị trí
        if (insertPosition !== null) {
          const insertIndex = updatedStages.findIndex(stage => stage._id === insertPosition);
          if (insertIndex !== -1) {
            updatedStages.splice(insertIndex + 1, 0, newStage);
          }
        } else {
          updatedStages.push(newStage);  //  Đẩy vào cuối danh sách
        }

        //  Nếu có childId, cập nhật parent của child về stage mới
        if (childId) {
          updatedStages = updatedStages.map(stage =>
            stage._id === childId ? { ...stage, parent: { _id: newStage._id } } : stage
          );
        }

        updatedStages = sortStagesByParent(updatedStages);
        setStages(updatedStages);
        setSelectedStage(newStage);
        message.success("Stage added successfully");

        setIsModalOpen(false);
        setNewStageName("");
        setNewStageStatus("todo");
        setInsertPosition(null);
      }
    } catch (error) {
      console.error("Error adding stage:", error);
      message.error("Failed to add stage");
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
      setEditStageName(selectedStage.stageName || "")
      setEditStageStatus(selectedStage.stageStatus || "todo")
      setIsEditModalOpen(true)
    }
  }

  // Save changes to the stages list
  const handleEditStage = async () => {
    if (!site?._id || !accessToken || !project?._id) return

    if (!editStageName?.trim()) {
      message.warning("Stage name cannot be empty")
      return
    }

    try {
      // Gửi dữ liệu cập nhật lên API
      await axios.post(
        `${siteAPI}/${site._id}/projects/${project._id}/stages/update`,
        {
          stageId: selectedStage?._id,
          stageName: editStageName,
          stageStatus: editStageStatus,
        },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      )

      // Cập nhật UI sau khi chỉnh sửa thành công
      setStages((prevStages) =>
        prevStages.map((stage) =>
          stage?._id === selectedStage?._id
            ? { ...stage, stageName: editStageName, stageStatus: editStageStatus }
            : stage,
        ),
      )

      // Update the selectedStage to reflect the changes
      setSelectedStage({
        ...selectedStage,
        stageName: editStageName,
        stageStatus: editStageStatus,
      })

      message.success("Stage updated successfully")
      setIsEditModalOpen(false)
    } catch (error) {
      console.error("Error updating stage:", error)
      message.error("Failed to update stage")
    }
  }



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
  const openDeleteConfirmation = (stageToDelete, otherStages) => {
    let selectedTargetStage = otherStages[0]?._id;

    Modal.confirm({
      title: stageToDelete.activities?.length > 0
        ? `Move work from ${stageToDelete.stageName} column`
        : "Are you sure you want to delete this stage?",
      icon: <ExclamationCircleOutlined style={{ color: "#ff4d4f", fontSize: "24px" }} />,
      content: stageToDelete.activities?.length > 0 ? (
        <div style={{ marginTop: "20px" }}>
          <p>{`Select a new home for any work with the ${stageToDelete.stageName} status, including work in the backlog.`}</p>
          <div style={{ display: "flex", alignItems: "center", gap: "20px", marginTop: "20px" }}>
            <StageBadge stage={stageToDelete} />
            <div style={{ fontSize: "20px" }}>→</div>
            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: "8px", color: "#666" }}>Move existing work items to:</div>
              <Select defaultValue={selectedTargetStage} style={{ width: "100%" }} onChange={(value) => selectedTargetStage = value}>
                {otherStages.map((stage) => (
                  <Option key={stage._id} value={stage._id}>{stage.stageName}</Option>
                ))}
              </Select>
            </div>
          </div>
        </div>
      ) : "This action cannot be undone.",
      okText: "Delete",
      okButtonProps: { danger: true },
      cancelText: "Cancel",
      onOk: () => handleDelete(stageToDelete._id, stageToDelete.activities?.length > 0 ? selectedTargetStage : null),
      width: 600,
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
      await axios.post(
        `${siteAPI}/${site._id}/projects/${project._id}/stages/delete`,
        { stageId, ...(targetStageId && { targetStageId }) },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      // Cập nhật state sau khi xóa
      setStages((prevStages) =>
        prevStages.filter((stage) => stage._id !== stageId).map((stage) =>
          stage.parent?._id === stageId ? { ...stage, parent: null } : stage
        )
      );

      setSelectedStage(null);
      message.success(targetStageId ? "Stage deleted and activities moved successfully" : "Stage deleted successfully");
    } catch (error) {
      console.error("Error deleting stage:", error);
      message.error("Failed to delete stage");
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
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
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
          setIsModalOpen(false)
          setInsertPosition(null)
        }}
        bodyStyle={{ paddingTop: 15 }}
      >
        <Form layout="vertical">
          <Form.Item
            label="Stage Name"
            name="stageName"
            rules={[
              { required: true, message: "Please enter the stage name" },
              { max: 30, message: "Stage name cannot exceed 30 characters" }, // Giới hạn ký tự
            ]}
          >
            <Input
              placeholder="Stage Name"
              value={newStageName}
              onChange={(e) => setNewStageName(e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Stage Status">
            <Select value={newStageStatus} onChange={setNewStageStatus} style={{ width: "100%" }}>
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
        onCancel={() => setIsEditModalOpen(false)}
        bodyStyle={{ paddingTop: 15 }}
      >
        <Form layout="vertical">
          <Form.Item label="Stage Name">
            <Input
              placeholder="Enter stage name"
              value={editStageName}
              onChange={(e) => setEditStageName(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Stage Status">
            <Select
              value={editStageStatus}
              onChange={setEditStageStatus}
              style={{ width: "100%" }}
            >
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

