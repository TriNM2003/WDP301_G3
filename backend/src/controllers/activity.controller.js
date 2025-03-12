const db = require('../models');
const JWT = require('jsonwebtoken');
const bcrypt = require("bcrypt")
const morgan = require("morgan")
const createHttpErrors = require("http-errors");
const { activityService } = require('../services');




const getActivityByProjectId = async (req, res, next) => {
    try {
        const { projectId } = req.params;
        const activities = await activityService.getActivitiesByProjectId(projectId)
         res.status(200).json({  status: 200, activities:activities  })

    } catch (error) {
        next(error);
    }
}

const getById = async (req, res, next) => {
    try {
        const { activityId } = req.params;
        const activity = await activityService.getById(activityId)
         res.status(200).json({  status: 200, activity:activity  })

    } catch (error) {
        next(error);
    }
}

const createActivity = async (req, res, next) => {
    try {
        const { activityTitle, stage, type,sprint, createBy, parent } = req.body;
        const {projectId} = req.params;

        if (!activityTitle) {

            return res.status(400).json({ error: { status: 400, message: "Missing required field: activityTitle"  }})

        }
        if (!projectId) {

            return res.status(400).json({ error: { status: 400, message: "Missing required field: project"  }})

        }
        const checkProject =await db.Project.findById(projectId)
        if(!checkProject){
            return res.status(400).json({ error: { status: 400, message: "Project not found!"  }})

        }
        if (!stage) {

            return res.status(400).json({ error: { status: 400, message: "Missing required field: stage"  }})

        }
        if (!type) {
            return res.status(400).json({ error: { status: 400, message: "Missing required field: type"  }})

        }
        if (!createBy) {
            return res.status(400).json({ error: { status: 400, message: "Missing required field: createBy"  }})

        }

        const newActivity = await activityService.create(req.body,projectId);
        if (!newActivity) {
            return res.status(400).json({ error: { status: 400, message: "Activity created fail" }})

        }

        const updatedSprint = await db.Sprint.findByIdAndUpdate(sprint,{$addToSet:{activities: newActivity._id}});
        const updatedStage = await db.Stage.findByIdAndUpdate(stage,{$addToSet:{activities: newActivity._id}});
        const updatedParent = await db.Activity.findByIdAndUpdate(parent,{$addToSet:{child: newActivity._id}});
        


        res.status(201).json({  status: 201,  message: "Activity created successfully", activity: newActivity  })
    } catch (error) {
        next(error);
    }
}

const editActivity = async (req, res, next) => {
    try {
        const {activityId} = req.params;
        const { activityTitle } = req.body;
        const activity = await db.Activity.findById(activityId).populate("project");

        if (!activity) {
            return res.status(400).json({ error: { status: 400, message: "Activity not found" }})

        }
        if (new Date(req.body.dueDate) < new Date(activity?.startDate)||new Date(activity?.dueDate) < new Date(req.body.startDate)) {
            return res.status(400).json({ error: { status: 400, message: "Due date must be later than start date!" } })
            
        }
        const updatedActivity = await activityService.edit(req.body,activityId)
        if (!updatedActivity) {
            return res.status(400).json({ error: { status: 400, message: "Activity updated fail" }})

        }
         res.status(201).json({ status: 201, message: "Activity updated successfully", activity: updatedActivity  })
    } catch (error) {
        next(error);
    }
}
const assignMember = async (req, res, next) => {
    try {
        const {activityId, projectId} = req.params;
        const { member } = req.body;
        const activity = await db.Activity.findById(activityId).populate("project");

        if (!activity) {
            return res.status(400).json({ error: { status: 400, message: "Activity not found" } })
            
        }
        
        const checkMember = await db.User.findById(member)
        if(checkMember?.status !="active" || !checkMember?.projects.find((p)=>p == projectId)){
            return res.status(400).json({ error: { status: 400, message: "Member does not valid"} })

        }
        if (!member) {
            return res.status(400).json({ error: { status: 400, message: "Missing required field: member"} })

        }
        const updatedActivity = await activityService.assignMember(member,activityId)
        if (!updatedActivity) {
            return res.status(400).json({ error: { status: 400, message: "Activity updated fail" }})


        }
         res.status(200).json({status: 200, message: "Assign member successfully", activity: updatedActivity  })

    } catch (error) {
        next(error);
    }
}

const removeAssignMember = async (req, res, next) => {
    try {
        const {activityId, projectId} = req.params;
        const { member } = req.body;
        const activity = await db.Activity.findById(activityId).populate("project");

        if (!activity) {
            return res.status(400).json({ error: { status: 400, message: "Activity not found" } })
            
        }
        
        const checkMember = await db.User.findById(member)
        if (!member) {
            return res.status(400).json({ error: { status: 400, message: "Missing required field: member"} })

        }
        const updatedActivity = await activityService.removeAssignMember(member,activityId)
        if (!updatedActivity) {
            return res.status(400).json({ error: { status: 400, message: "Activity updated fail" }})


        }
         res.status(200).json({status: 200, message: "Remove assignee successfully", activity: updatedActivity  })

    } catch (error) {
        next(error);
    }
}

const removeActivity = async (req, res, next) => {
    try {
        const {activityId} = req.params;
        const activity = await db.Activity.findOne({_id:activityId, isDestroyed: { $ne: true }}).populate("project");

        if (!activity) {
            return res.status(400).json({ error: { status: 400, message: "Activity not found." } })

        }
        const deletedActivity = await activityService.remove(activityId)

        res.status(200).json({ status: 200, message: "Activity deleted successfully", deletedActivity  })

    } catch (error) {
        next(error);
    }
}

const activityController = {
    getActivityByProjectId,
    getById,
    createActivity,
    editActivity,
    assignMember,
    removeAssignMember,
    removeActivity,
}

module.exports = activityController;