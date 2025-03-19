const db = require('../models');
const JWT = require('jsonwebtoken');
const bcrypt = require("bcrypt")
const morgan = require("morgan")
const createHttpErrors = require("http-errors");
const { sprintService, activityService } = require('../services');

const getByProjectId = async (req, res, next) => {
    try {
        const { id } = req.payload;
        const { projectId } = req.params;

        const sprints = await sprintService.getByProjectId(projectId);
        return res.status(200).json({ status: 200, sprints: sprints })
    } catch (error) {
        next(error)
    }

}

const createSprint = async (req, res, next) => {
    try {
        const { id } = req.payload;
        const { projectId } = req.params;

        const createdSprint = await sprintService.create(req.body, projectId);
        return res.status(200).json({ status: 200, createdSprint: createdSprint })

    } catch (error) {
        next(error)
    }
}

const editSprint = async (req, res, next) => {
    try {
        const { sprintId, projectId } = req.params;
        const { sprintName, sprintGoal, startDate, dueDate, sprintStatus } = req.body;

        const sprint = await db.Sprint.findOne({ _id: sprintId });
        if (!sprint) {
            return res.status(404).json({ status: 404, message: "Sprint does not exist" })

        }


        if (sprintStatus !== undefined) {
            if (!["planning", "active"].includes(sprintStatus)) {

                return res.status(404).json({ status: 404, message: "Invalid sprint status" })

            }
        }

        const updatedSprint = await sprintService.edit(req.body,projectId, sprintId)
        return res.status(200).json({ status: 200, message: "Sprint updated successfully", sprint: updatedSprint })

    } catch (error) {
        next(error)
    }
};


const deleteSprint = async (req, res, next) => {
    try {
        const { sprintId } = req.params;
        const { newSprint } = req.body;

       
        const sprint = await db.Sprint.findOne({ _id: sprintId });
        if (!sprint) {
            return res.status(404).json({ status: 404, message: "Sprint does not exist" });
        }


        const activities = await db.Activity.find({ sprint: sprintId, isDestroyed: { $ne: true } });

        if (activities.length > 0) {
            if (!newSprint) {
                return res.status(400).json({ status: 400, message: "Sprint has activities. Please provide a new sprint to move them." });
            }


            const targetSprint = await db.Sprint.findOne({ _id: newSprint });
            if (!targetSprint) {
                return res.status(404).json({ status: 404, message: "New sprint does not exist" });
            }
            if (targetSprint.sprintStatus == "completed") {
                return res.status(400).json({ status: 400, message: "Cannot move activities to a completed sprint." });
            }

            for (const activity of activities) {
                await activityService.moveActivity({ sprint: newSprint }, activity._id);
            }
        }

        const deletedSprint = await sprintService.deleteSprint(sprintId);

        if (deletedSprint.deletedCount === 0) {
            return res.status(500).json({ status: 500, message: "Sprint could not be deleted. Please try again." });
        }

        return res.status(204).json({ status: 204, message: "Sprint deleted successfully" });

    } catch (error) {
        next(error);
    }
};


const completeSprint = async (req, res, next) => {
    try {
        const { sprintId } = req.params;
        const { newSprintId } = req.body;


        const sprint = await db.Sprint.findOne({ _id: sprintId });
        if (!sprint) {
            return res.status(404).json({ status: 404, message: "Sprint does not exist" });
        }


        if (sprint.sprintStatus !== "active") {
            return res.status(400).json({ status: 400, message: "Only active sprints can be completed." });
        }


        const activities = await db.Activity.find({ sprint: sprintId }).populate("stage");


        const incompleteActivities = activities?.filter(activity => activity.stage?.stageStatus != "done");

        if (incompleteActivities?.length > 0) {
            const targetSprintId = newSprintId || null;


            if (newSprintId) {
                const newSprint = await db.Sprint.findOne({ _id: newSprintId, isDestroyed: { $ne: true } });
                if (!newSprint || newSprint.sprintStatus !== "planning") {
                    return res.status(400).json({ status: 400, message: "New sprint must have status 'PLANNING'." });
                }
            }

            for (const activity of incompleteActivities) {
                await activityService.moveActivity({ sprint: targetSprintId }, activity._id);
            }
        }

        const updatedSprint = await db.Sprint.findOneAndUpdate(
            { _id: sprintId },
            { $set: { sprintStatus: "completed" } },
            { new: true, runValidators: true }
        );

        return res.status(200).json({ status: 200, message: "Sprint completed successfully", sprint: incompleteActivities });

    } catch (error) {
        next(error);
    }
};



const sprintController = {
    getByProjectId,
    createSprint,
    editSprint,
    deleteSprint,
    completeSprint
}

module.exports = sprintController;