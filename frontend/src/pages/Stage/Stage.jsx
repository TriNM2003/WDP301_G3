"use client"

import { useState, useRef, useEffect } from "react"
import { DndContext, closestCenter } from "@dnd-kit/core"
import { SortableContext, useSortable, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card, Button, Layout, Modal, Input, Select } from "antd"
import { RightOutlined, PlusCircleOutlined } from "@ant-design/icons"

const { Content, Sider } = Layout
const { Option } = Select

const statusColors = {
  todo: "#89CFF0",
  doing: "#FFD700",
  done: "#90EE90",
}

const SortableItem = ({ stage, onSelect, setRefs }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: stage.id,
    // Add this to prevent drag from starting immediately
    activationConstraint: {
      delay: 250, // Add a small delay before dragging starts
      tolerance: 5, // Allow small movements without starting drag
    },
  })
  const itemRef = useRef(null)

  useEffect(() => {
    if (itemRef.current) {
      setRefs(stage.id, itemRef.current)
    }
  }, [setRefs, stage.id])

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: "10px",
    textAlign: "center",
    backgroundColor: statusColors[stage.stageStatus] || "#f5f5f5",
    cursor: "pointer", // Changed from "grab" to "pointer" to indicate it's clickable
    width: "250px", // Set a fixed width for all stages
    marginBottom: "30px", // Increased spacing between stages
    border: "1px solid #ddd",
    borderRadius: "6px",
  }

  const handleClick = (e) => {
    // Prevent event propagation
    e.stopPropagation()
    // Select the stage immediately with a single click
    onSelect(stage)
  }

  return (
    <Card
      ref={(el) => {
        setNodeRef(el)
        itemRef.current = el
      }}
      style={style}
      onClick={handleClick}
      {...attributes}
      {...listeners}
    >
      {stage.stageName}
    </Card>
  )
}

// New component for the plus icon between stages
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

const sortStagesByParent = (stages) => {
  const stageMap = new Map(stages.map((stage) => [stage.id, stage]))
  const sortedStages = []

  const addChildren = (parentId) => {
    stages.forEach((stage) => {
      if (stage.parent === parentId) {
        sortedStages.push(stage)
        addChildren(stage.id)
      }
    })
  }

  stages.forEach((stage) => {
    if (!stage.parent) {
      sortedStages.push(stage)
      addChildren(stage.id)
    }
  })

  return sortedStages
}

const StageManagement = () => {
  const [stages, setStages] = useState([
    { id: "1", stageName: "To Do", stageStatus: "todo", parent: null },
    { id: "2", stageName: "Doing", stageStatus: "doing", parent: "1" },
    // { id: "3", stageName: "Done", stageStatus: "done", parent: "2" },
    // { id: "4", stageName: "Ngu", stageStatus: "done", parent: "3" },
  ])
  const [selectedStage, setSelectedStage] = useState(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newStageName, setNewStageName] = useState("")
  const [newStageStatus, setNewStageStatus] = useState("todo")
  const [insertPosition, setInsertPosition] = useState(null) // Track where to insert the new stage
  const stageRefs = useRef({})
  const [connections, setConnections] = useState([])

  const setRefs = (id, element) => {
    stageRefs.current[id] = element
  }
  useEffect(() => {
    updateConnections()
  }, [stages])

  const updateConnections = () => {
    const newConnections = stages
      .filter((stage) => stage.parent)
      .map((stage) => {
        const parentElement = stageRefs.current[stage.parent]
        const childElement = stageRefs.current[stage.id]

        if (!parentElement || !childElement) return null

        const parentRect = parentElement.getBoundingClientRect()
        const childRect = childElement.getBoundingClientRect()

        // Updated connection points for vertical layout
        return {
          id: stage.id,
          x1: parentRect.left + parentRect.width / 2,
          y1: parentRect.bottom ,
          x2: childRect.left + childRect.width / 2,
          y2: childRect.top ,
        }
      })
      .filter(Boolean)

    setConnections(newConnections)
  }

console.log("huhu",stages.map((stage) => stage.id));

  
  useEffect(() => {
    console.log("Stages List:")
    stages.forEach((stage) => {})
  }, [stages])

  useEffect(() => {
    if (selectedStage) {
      setIsDetailOpen(true)
    }
  }, [selectedStage])

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = stages.findIndex((s) => s.id === active.id)
    const newIndex = stages.findIndex((s) => s.id === over.id)
    const newStages = arrayMove(stages, oldIndex, newIndex)

    newStages.forEach((stage, index) => {
      stage.parent = index > 0 ? newStages[index - 1].id : null
    })

    setStages([...newStages])
    setSelectedStage(newStages.find((s) => s.id === active.id))
  }

  // Open modal to add a stage at a specific position
  const handleAddStageAtPosition = (afterStageId) => {
    setInsertPosition(afterStageId)
    setIsModalOpen(true)
  }

  // Add a stage at the end (from the main Add Stage button)
  const handleAddStageAtEnd = () => {
    setInsertPosition(null) // null means add at the end
    setIsModalOpen(true)
  }

  const handleAddStage = () => {
    if (!newStageName.trim()) return

    const newStageId = Date.now().toString() // Use timestamp for unique ID
    const newStage = {
      id: newStageId,
      stageName: newStageName,
      stageStatus: newStageStatus,
      parent: null, // Will be set correctly below
    }

    setStages((prevStages) => {
      const updatedStages = [...prevStages]

      if (insertPosition === null) {
        // Add at the end
        newStage.parent = updatedStages.length > 0 ? updatedStages[updatedStages.length - 1].id : null
        updatedStages.push(newStage)
      } else {
        // Insert after the specified stage
        const insertIndex = updatedStages.findIndex((s) => s.id === insertPosition)
        if (insertIndex !== -1) {
          // Set parent of new stage to the stage it's inserted after
          newStage.parent = insertPosition

          // Find any stage that had the insertPosition stage as parent
          const childIndex = updatedStages.findIndex((s) => s.parent === insertPosition)

          if (childIndex !== -1) {
            // If there was a child, it now becomes a child of the new stage
            updatedStages[childIndex].parent = newStageId
          }

          // Insert the new stage after the specified position
          updatedStages.splice(insertIndex + 1, 0, newStage)
        } else {
          // Fallback: add at the end if position not found
          newStage.parent = updatedStages.length > 0 ? updatedStages[updatedStages.length - 1].id : null
          updatedStages.push(newStage)
        }
      }

      return updatedStages
    })

    // Set the newly created stage as the selected stage to open the detail panel
    const newStageObj = {
      id: newStageId,
      stageName: newStageName,
      stageStatus: newStageStatus,
      parent: insertPosition,
    }
    setSelectedStage(newStageObj)

    setIsModalOpen(false)
    setNewStageName("")
    setNewStageStatus("todo")
    setInsertPosition(null)

    setTimeout(() => {
      updateConnections()
    }, 0)
  }

  useEffect(() => {
    setTimeout(updateConnections, 0)
  }, [stages])

  const sortStagesByConnections = (stages) => {
    const stageMap = new Map(stages.map((stage) => [stage.id, stage]))
    const sortedStages = []

    const addChildren = (parentId) => {
      stages.forEach((stage) => {
        if (stage.parent === parentId) {
          sortedStages.push(stage)
          addChildren(stage.id)
        }
      })
    }

    // Bắt đầu từ root (không có parent)
    stages.forEach((stage) => {
      if (!stage.parent) {
        sortedStages.push(stage)
        addChildren(stage.id)
      }
    })

    return sortedStages
  }

  // Render stages with plus icons between them
  const renderStagesWithAddIcons = () => {
    const sortedStages = sortStagesByParent(stages)
    const result = []

    // Add initial plus icon if there are no stages
    if (sortedStages.length === 0) {
      result.push(<AddStageIcon key="add-first" onClick={() => handleAddStageAtPosition(null)} />)
      return result
    }

    // Add stages and plus icons between them
    sortedStages.forEach((stage, index) => {
      result.push(<SortableItem key={stage.id} stage={stage} onSelect={setSelectedStage} setRefs={setRefs} />)

      // Add plus icon after each stage
      result.push(<AddStageIcon key={`add-after-${stage.id}`} onClick={() => handleAddStageAtPosition(stage.id)} />)
    })

    return result
  }

  return (
    <Layout style={{ height: "100vh", position: "relative" }}>
      <Button
        type="text"
        shape="circle"
        style={{
          position: "absolute",
          top: "50%",
          right: isDetailOpen ? "350px" : "0px",
          transform: "translateY(-50%)",
          zIndex: 1000,
          background: "#f5f5f5",
          border: "1px solid #ccc",
        }}
        onClick={() => setIsDetailOpen(!isDetailOpen)}
        icon={<RightOutlined rotate={isDetailOpen ? 180 : 0} />}
      />
      <Content style={{ flex: 1, padding: "20px", background: "#f5f5f5", overflow: "auto" }}>
        <Button type="primary" onClick={handleAddStageAtEnd} style={{ marginTop: "20px", marginBottom: "20px" }}>
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
          <SortableContext items={stages.map((s) => s.id)} strategy={verticalListSortingStrategy}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              {renderStagesWithAddIcons()}
            </div>
          </SortableContext>
        </DndContext>
      </Content>

      <Sider
        width={350}
        style={{ background: "white", padding: "20px", borderLeft: "1px solid #ddd", overflowY: "auto" }}
        collapsed={!isDetailOpen}
        collapsible
      >
        {isDetailOpen && (
          <>
            <h3>Stage Details</h3>
            {selectedStage ? (
              <Card>
                <p>
                  <b>Name:</b> {selectedStage.stageName}
                </p>
                <p>
                  <b>Status:</b> {selectedStage.stageStatus}
                </p>
              </Card>
            ) : (
              <p>Select a stage to view details</p>
            )}
          </>
        )}
      </Sider>
      <Modal
        title={insertPosition ? "Insert New Stage" : "Add New Stage"}
        visible={isModalOpen}
        onOk={handleAddStage}
        onCancel={() => {
          setIsModalOpen(false)
          setInsertPosition(null)
        }}
      >
        <Input
          placeholder="Stage Name"
          value={newStageName}
          onChange={(e) => setNewStageName(e.target.value)}
          style={{ marginBottom: "10px" }}
        />
        <Select value={newStageStatus} onChange={setNewStageStatus} style={{ width: "100%" }}>
          <Option value="todo">To Do</Option>
          <Option value="doing">Doing</Option>
          <Option value="done">Done</Option>
        </Select>
      </Modal>
    </Layout>
  )
}

export default StageManagement

