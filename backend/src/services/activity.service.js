const db = require('../models');
const JWT = require('jsonwebtoken');
const bcrypt = require("bcrypt")
const morgan = require("morgan")
const createHttpErrors = require("http-errors");
const { default: mongoose } = require('mongoose');
const notificationService = require('./notification.service');

const getActivitiesByProjectId = async (projectId) => {
    try {
        const activities = await db.Activity.find({ project: projectId, isDestroyed: { $ne: true } })
            .populate("createBy")
            .populate("assignee")
            .populate("type")
            .populate("project")
            .populate("sprint")
            .populate("stage");
        return activities;
    } catch (error) {
        throw error;
    }
}

const getById = async (id) => {
    try {
        const activity = await db.Activity.findOne({ _id: id, isDestroyed: { $ne: true } })
            .populate("createBy")
            .populate("assignee")
            .populate("type")
            .populate("project")
            .populate("sprint")
            .populate("stage");
        return activity;
    } catch (error) {
        throw error;
    }
}

const create = async (data, project) => {
    try {
        const {
            activityTitle,
            sprint,
            stage,
            parent,
            type,
            createBy,
        } = data;

        if (data?.parent) {
            const parentActivity = await db.Activity.findById(parent).populate("type");
            const inputType = await db.ActivityType.findById(type);
            if (!parentActivity) {
                throw new Error("Parent activity not found.");
            }

            if (parentActivity?.type.typeName == "task") {
                if (inputType.typeName !== "subtask" && inputType.typeName !== "bug") {
                    throw new Error("Invalid subactivity type. A task can only have subtasks or bugs.");
                }
            } else if (parentActivity?.type.typeName == "subtask") {
                if (inputType.typeName !== "bug") {
                    throw new Error("Invalid subactivity type. A subtask can only have bugs.");
                }
            } else if (parentActivity?.type.typeName == "bug") {
                throw new Error("A bug cannot have subactivities.");
            }
        }

        const newActivity = new db.Activity({
            activityTitle,
            project,
            sprint,
            parent,
            stage,
            type,
            createBy,
        });
        const createdActivity = await newActivity.save();
        await db.User.findByIdAndUpdate(
            createBy, {
            $addToSet: { activities: createdActivity._id }
        }
        )
        
        return createdActivity;
    } catch (error) {
        throw error;
    }
}

const edit = async (data, activityId) => {
    try {
        // Tìm activity để kiểm tra trước khi cập nhật
        const currentActivity = await db.Activity.findOne({
            _id: activityId,
            isDestroyed: { $ne: true }
        });

        if (!currentActivity) {
            throw new Error("Activity not found or already deleted");
        }

        // Lấy dữ liệu cập nhật từ `data`
        const { activityTitle, description, parent, priority, startDate, dueDate, child } = data;

        // Cập nhật activity
        const updatedActivity = await db.Activity.findOneAndUpdate(
            { _id: activityId, isDestroyed: { $ne: true } },
            {
                $set: {
                    activityTitle: activityTitle || currentActivity.activityTitle,
                    description: description !== undefined ? description : currentActivity.description,
                    parent: parent || currentActivity.parent,
                    priority: priority || currentActivity.priority,
                    startDate: startDate ,
                    dueDate: dueDate,
                    child: child || currentActivity.child,
                }
            },
            { new: true, runValidators: true }
        );

        if (!updatedActivity) {
            throw new Error("Failed to update activity");
        }

        // Nếu có thay đổi `parent`, cập nhật parent mới và parent cũ
        if (parent && parent !== currentActivity.parent) {
            // Xóa activity khỏi parent cũ
            await db.Activity.findOneAndUpdate(
                { _id: currentActivity.parent, isDestroyed: { $ne: true } },
                { $pull: { child: activityId } }
            );

            // Thêm activity vào parent mới
            await db.Activity.findOneAndUpdate(
                { _id: parent, isDestroyed: { $ne: true } },
                { $addToSet: { child: activityId } }
            );
        }

        return updatedActivity;
    } catch (error) {
        console.error("Error updating activity:", error);
        throw error;
    }
};

const moveActivity = async (data, activityId) => {
    try {
        // Kiểm tra nếu người dùng gửi cả sprint và stage
        if (data.sprint && data.stage) {
            throw new Error("You can only update either sprint or stage at a time.");
        }

        // Tìm activity gốc và populate subactivities
        const currentActivity = await db.Activity.findOne({
            _id: activityId,
            isDestroyed: { $ne: true }
        }).populate("child");

        if (!currentActivity) {
            throw new Error("Activity not found or already deleted");
        }

        let updatedActivity = null;

        // Nếu cập nhật `stage`
        if (data.stage) {
            const newStage = data.stage;
            const newStageData = await db.Stage.findOne({ _id: newStage });

            if (!newStageData) {
                throw new Error("Stage not found");
            }

            // Nếu stage mới có `stageStatus` là "done", kiểm tra subactivities
            if (newStageData.stageStatus === "done") {
                const unfinishedSubActivities = await db.Activity.find({
                    parent: activityId,
                    isDestroyed: { $ne: true }
                }).populate("stage");

                // Kiểm tra nếu có subactivity nào chưa có stage "done"
                const hasUnfinishedSubActivities = unfinishedSubActivities.some(sub => sub.stage.stageStatus !== "done");

                if (hasUnfinishedSubActivities) {
                    throw new Error(`Cannot move activity to ${newStageData?.stageName}. Please complete all subactivities first.`);
                }
            }

            // Cập nhật `stage`
            updatedActivity = await db.Activity.findOneAndUpdate(
                { _id: activityId, isDestroyed: { $ne: true } },
                { $set: { stage: newStage } },
                { new: true, runValidators: true }
            );

            if (!updatedActivity) {
                throw new Error("Failed to update activity stage.");
            }

        }
        // Nếu cập nhật `sprint`
        else {
            const newSprint = data.sprint; // Sprint có thể null (Backlog)

            // Cập nhật activity gốc
            updatedActivity = await db.Activity.findOneAndUpdate(
                { _id: activityId, isDestroyed: { $ne: true } },
                { $set: { sprint: newSprint } },
                { new: true, runValidators: true }
            );

            if (!updatedActivity) {
                throw new Error("Failed to update activity sprint.");
            }

            // Hàm đệ quy để cập nhật tất cả subactivities
            const updateSubActivities = async (parentId, newSprint) => {
                const subActivities = await db.Activity.find({
                    parent: parentId,
                    isDestroyed: { $ne: true }
                });

                for (const sub of subActivities) {
                    await db.Activity.findOneAndUpdate(
                        { _id: sub._id },
                        { $set: { sprint: newSprint } },
                        { new: true }
                    );

                    // Đệ quy cập nhật tiếp subactivity con
                    await updateSubActivities(sub._id, newSprint);
                }
            };

            // Nếu activity có Sprint mới, cập nhật cho tất cả subactivities
            await updateSubActivities(activityId, newSprint);
        }

        return updatedActivity;
    } catch (error) {
        console.error("Error updating activity:", error);
        throw error;
    }
};


const assignMember = async (data, activityId) => {
    try {

        const updatedActivity = await db.Activity.findOneAndUpdate(
            { _id: activityId, isDestroyed: { $ne: true } },
            { $addToSet: { assignee: data } }, // Tránh trùng lặp thành viên
            { new: true, runValidators: true }
        );

        if (!updatedActivity) {
            throw new Error("Activity not found");
        }
        const updateUser = await db.User.findByIdAndUpdate(
            data,
            { $addToSet: { activities: activityId } },
            { new: true, runValidators: true }
        )

        return updatedActivity;
    } catch (error) {
        throw error;
    }
};

const removeAssignMember = async (data, activityId) => {
    try {

        const updatedActivity = await db.Activity.findOneAndUpdate(
            { _id: activityId, isDestroyed: { $ne: true } },
            { $pull: { assignee: data } },
            { new: true, runValidators: true }
        );

        if (!updatedActivity) {
            throw new Error("Activity not found");
        }
        const updateUser = await db.User.findByIdAndUpdate(
            data,
            { $pull: { activities: activityId } },
            { new: true, runValidators: true }
        )

        return updatedActivity;
    } catch (error) {
        throw error;
    }
};


const remove = async (activityId) => {
    try {
        // Tìm và xóa activity theo ID
        await db.Activity.updateOne({ _id: activityId }, { $set: { isDestroyed: true } });

        return;
    } catch (error) {
        throw error;
    }
};

const getAllComments = async (activityId) => {
    try {
 
        const activity = await db.Activity.findOne(
            { _id: activityId, isDestroyed: { $ne: true } }
        ).populate({
            path: "comments.commenter",
            select: "username userAvatar"
        });
        if (!activity) {
            throw new Error("Activity not found or already deleted");
        }
        const comments = activity.comments?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));


        return comments
    } catch (error) {
        throw error;

    }
}

const createComment = async (activityId, userId, content) => {
    try {

        const activity = await db.Activity.findOne({ _id: activityId, isDestroyed: { $ne: true } })
        if (!activity) {
            throw new Error("Activity not found or already deleted");
        }
        const newComment = {
            _id: new mongoose.Types.ObjectId(),
            commenter: userId,
            content: content,
        }
        const updateActivity = await db.Activity.findOneAndUpdate({ _id: activityId }, { $addToSet: { comments: newComment } }, { new: true, runValidators: true })

        return updateActivity
    } catch (error) {
        throw error;

    }
}

const editComment = async (activityId, commentId, newContent) => {
    try {
        const updatedActivity = await db.Activity.findOneAndUpdate(
            { _id: activityId, isDestroyed: { $ne: true }, "comments._id": commentId },
            { $set: { "comments.$.content": newContent } },
            { new: true, runValidators: true }
        );

        if (!updatedActivity) {
            throw new Error("Activity not found, already deleted, or comment does not exist.");
        }

        return updatedActivity;
    } catch (error) {
        console.error("Error editing comment:", error.message);
        throw error;
    }
};


const deleteComment = async (activityId, commentId) => {
    try {
        // Tìm và cập nhật activity để xóa comment có _id tương ứng
        const updatedActivity = await db.Activity.findOneAndUpdate(
            { _id: activityId, isDestroyed: { $ne: true }, "comments._id": commentId }, 
            { $pull: { comments: { _id: commentId } } }, 
            { new: true, runValidators: true }
        );

        if (!updatedActivity) {
            throw new Error("Activity not found, already deleted, or comment does not exist.");
        }

        return updatedActivity;
    } catch (error) {
        console.error("Error deleting comment:", error.message);
        throw error;
    }
};


const activityService = {
    getActivitiesByProjectId,
    getById,
    create,
    edit,
    moveActivity,
    assignMember,
    removeAssignMember,
    remove,
    //comment
    getAllComments,
    createComment,
    editComment,
    deleteComment
}

module.exports = activityService;