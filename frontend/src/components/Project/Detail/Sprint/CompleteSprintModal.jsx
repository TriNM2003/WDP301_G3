import { CheckSquareFilled, WarningFilled } from '@ant-design/icons'
import { Button, Divider, Modal, Select } from 'antd'
import Title from 'antd/es/skeleton/Title'
import React, { useContext } from 'react'
import { AppContext } from '../../../../context/AppContext'
import { green, orange } from '@ant-design/colors'
import { Option } from 'antd/es/mentions'

function CompleteSprintModal() {
    const { handleActivityCreate, createActivityModal, setCreateActivityModal, activityName, setActivityName, completedSprint, setCompletedSprint, showCompletedSprint, handleCompletedSprint, handleCompletedCancel } = useContext(AppContext)
  
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
            open={completedSprint}
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
    )
}

export default CompleteSprintModal
