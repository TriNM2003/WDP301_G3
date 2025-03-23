import { CheckSquareFilled, WarningFilled } from '@ant-design/icons'
import { Button, Divider, Modal, Select } from 'antd'
import Title from 'antd/es/skeleton/Title'
import React, { useContext } from 'react'
import { AppContext } from '../../../../context/AppContext'
import { green, orange } from '@ant-design/colors'
import { Option } from 'antd/es/mentions'

function CompleteSprintModal() {
    const { handleActivityCreate, activities, stages, sprints, isCompletedSprint,selectedSprint, setSelectedSprint, setIsCompletedSprint,createActivityModal, setCreateActivityModal, activityName, setActivityName, completedSprint, setCompletedSprint, showCompletedSprint, handleCompletedSprint, handleCompletedCancel } = useContext(AppContext)

    const completedActivities = activities?.filter((activity) => {
        return activity?.sprint?._id == completedSprint?._id && activity?.stage?.stageStatus?.toUpperCase() == "DONE"
    })
    const uncompletedActivities = activities?.filter((activity) => {
        return activity?.sprint?._id == completedSprint?._id && activity?.stage?.stageStatus?.toUpperCase() != "DONE"
    })
    return (
        <Modal
            title={
                <div style={{ textAlign: "center" }}>
                    <img src="https://cdn-icons-png.flaticon.com/512/616/616490.png" alt="Medal" width={50} />
                    <Title level={3} style={{ marginTop: 10 }}>
                        Complete "Sprint name"
                    </Title>
                </div>
            }
            open={isCompletedSprint}
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
            <span>This sprint<strong> {completedSprint?.sprintName}</strong> contains:</span>
            <ul>
                <li><CheckSquareFilled style={{ color: green[6] }} /> {completedActivities?.length || 0} completed activities</li>
                <li><WarningFilled style={{ color: orange[4] }} /> {uncompletedActivities?.length || 0} uncompleted activities</li>
            </ul>

            <Divider />

            <strong strong>Complete or move uncompleted activities to:</strong>
                <Select
                    value={selectedSprint || "Backlog"}
                    onSelect={(value)=>setSelectedSprint(value)}
                    style={{ width: "100%", marginTop: 5, marginBottom: 15 }}
                >
                    <Option value="Backlog">Backlog</Option>
                    {sprints
                        .filter(s => s?._id !== completedSprint?._id)
                        .map(s => (
                            <Select.Option key={s?._id} value={s?._id} disabled={s?.sprintStatus == "completed"}>
                                {s.sprintName}
                            </Select.Option>
                        ))}
                </Select>
        </Modal>
    )
}

export default CompleteSprintModal
