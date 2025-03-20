const db = require('../models');
const JWT = require('jsonwebtoken');
const bcrypt = require("bcrypt")
const morgan = require("morgan")
const createHttpErrors = require("http-errors");

const getByProjectId = async (projectId) => {
    try {
        const sprints = await db.Sprint.find({ project: projectId })
            .populate("activities");
        return sprints;
    } catch (error) {
        throw error;
    }
}

const create = async (data, project) => {
    try {
        const { sprintName } = data;
        const sprintStatus = "planning";
        const newSprint = new db.Sprint({
            sprintName,
            project,
            sprintStatus
        });
        const createdSprint = await newSprint.save();

        return createdSprint;
    } catch (error) {
        throw error;
    }
}

const edit = async (data, projectId, sprintId) => {
    try {
        const { sprintName, sprintGoal, sprintStatus, startDate, dueDate } = data;


        const sprint = await db.Sprint.findOne({ _id: sprintId });
        if (!sprint) {
            throw new Error("Sprint does not exist");
        }

  
        if (sprintStatus === "active") {
            // Kiểm tra xem có sprint nào khác đang ở trạng thái "active" không
            const activeSprint = await db.Sprint.findOne({ sprintStatus: "active",project:projectId, _id: { $ne: sprintId } });

            if (activeSprint) {
                throw new Error("Only one sprint can be active at a time. Please complete the current active sprint first.");
            }
        }


        const updatedSprint = await db.Sprint.findOneAndUpdate(
            { _id: sprintId },
            {
                $set: {
                    sprintName: sprintName || sprint.sprintName,
                    sprintGoal: sprintGoal !== undefined ? sprintGoal : sprint.sprintGoal,
                    startDate: startDate !== undefined ? startDate : sprint.startDate,
                    dueDate: dueDate !== undefined ? dueDate : sprint.dueDate,
                    sprintStatus: sprintStatus !== undefined ? sprintStatus : sprint.sprintStatus
                }
            },
            { new: true, runValidators: true }
        );

        return updatedSprint;
    } catch (error) {
        throw error;
    }
};


const deleteSprint = async (sprintId) => {
    try {
        // Kiểm tra sprint có tồn tại không
        const sprint = await db.Sprint.findOne({ _id: sprintId });
        if (!sprint) {
            throw new Error("Sprint does not exist");
        }


        const activities = await db.Activity.find({ sprint: sprintId });
        if (activities.length > 0) {
            throw new Error("Cannot delete sprint with active activities. Please move or delete them first.");
        }


        const deletedSprint = await db.Sprint.deleteOne({ _id: sprintId });

        if (deletedSprint.deletedCount === 0) {
            throw new Error("Sprint could not be deleted. Please try again.");
        }

        return { message: "Sprint deleted successfully" };
    } catch (error) {
        throw error;
    }
};

const completeSprint = async (sprintId) => {
    try {
        // Kiểm tra sprint có tồn tại không
        const sprint = await db.Sprint.findOne({ _id: sprintId });
        if (!sprint) {
            throw new Error("Sprint does not exist");
        }

        // Chỉ cho phép sprint có status "active" mới được complete
        if (sprint.sprintStatus != "active") {
            throw new Error("Only active sprints can be completed.");
        }

        // Lấy tất cả activities trong sprint
        const activities = await db.Activity.find({ sprint: sprintId }).populate("stage");

        // Kiểm tra nếu có activity nào chưa hoàn thành (stageStatus !== "done")
        const hasIncompleteActivities = activities.some(activity => activity.stage?.stageStatus !== "done");

        if (hasIncompleteActivities) {
            throw new Error("Cannot complete sprint. All activities must be in 'DONE' stage.");
        }

        // Nếu tất cả activity đều hoàn thành, cập nhật sprint thành "completed"
        const updatedSprint = await db.Sprint.findOneAndUpdate(
            { _id: sprintId },
            { $set: { sprintStatus: "completed" } },
            { new: true, runValidators: true }
        );

        return updatedSprint;
    } catch (error) {
        throw error;
    }
};





const sprintService = {
    getByProjectId,
    create,
    edit,
    completeSprint,
    deleteSprint
}

module.exports = sprintService;