const db = require('../models');
const JWT = require('jsonwebtoken');
const bcrypt = require("bcrypt")
const morgan = require("morgan")
const createHttpErrors = require("http-errors");

const COLOR_LIST = ["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#FFD700", "#8A2BE2", "#00CED1", "#DC143C"];

const getAllByProject = async (projectId) => {
    try {
        const stages = await db.Stage.find({ project: projectId, isDestroyed: { $ne: true } })
            .populate("activities")
            .populate("project")
            .populate("parent")
            .lean(); //  Convert Mongoose documents to plain objects

        //  Xây dựng danh sách theo cấu trúc cây cha - con
        const stageMap = new Map();
        stages.forEach(stage => {
            stageMap.set(stage._id.toString(), { ...stage, children: [] });
        });

        //  Xây dựng cây từ danh sách stages
        let rootStages = [];
        stages.forEach(stage => {
            if (stage.parent) {
                const parentStage = stageMap.get(stage.parent._id.toString());
                if (parentStage) {
                    parentStage.children.push(stageMap.get(stage._id.toString())); // Thêm vào danh sách con
                }
            } else {
                rootStages.push(stageMap.get(stage._id.toString())); // Nếu không có parent, nó là root
            }
        });

        //  Duyệt cây để sắp xếp danh sách theo quan hệ cha - con
        const sortedStages = [];
        const traverse = (nodes) => {
            nodes.forEach(node => {
                sortedStages.push(node); // Thêm node vào danh sách
                if (node.children.length > 0) {
                    traverse(node.children); // Đệ quy xử lý children
                }
            });
        };

        traverse(rootStages); // Bắt đầu duyệt từ root stages
        return sortedStages;
    } catch (error) {
        throw error;
    }
};
const updateStageParents = async (updates) => {
    try {
        const bulkOps = updates.map(({ stageId, parentId }) => ({
            updateOne: {
                filter: { _id: stageId },
                update: { parent: parentId || null }
            }
        }));

        await db.Stage.bulkWrite(bulkOps);
        return { message: "Stage parent relationships updated successfully." };
    } catch (error) {
        throw error;
    }
};

const getRandomColor = (existingColors) => {
    const availableColors = COLOR_LIST.filter(color => !existingColors.includes(color));
    if (availableColors.length === 0) return "#f0f0f0";
    return availableColors[Math.floor(Math.random() * availableColors.length)];
};

const addStage = async ({ stageName, stageStatus, parent, child, projectId }) => {
    try {
        //  Lấy danh sách stages đã sắp xếp
        const existingStages = await getAllByProject(projectId);
        const existingColors = existingStages.map(stage => stage.stageColor).filter(Boolean);
        const stageColor = getRandomColor(existingColors);

        //  Nếu không có parent, lấy stage cuối cùng trong danh sách
        if (!parent && existingStages.length > 0) {
            parent = existingStages[existingStages.length - 1]._id;
        }

        console.log("Parent before creating new stage:", parent);


        const newStage = new db.Stage({
            stageName,
            stageStatus,
            parent: parent || null,
            project: projectId,
            stageColor,
        });

        await newStage.save();

        console.log("New Stage created with ID:", newStage._id, "Parent:", newStage.parent);

        //  Nếu có child, cập nhật parent của child về stage mới
        if (child) {
            await db.Stage.findByIdAndUpdate(child, { parent: newStage._id });
        }


        // Nếu có parent, cập nhật nextStage (stage đứng sau `parent`)
        if (parent) {
            const nextStage = await db.Stage.findOne({ parent: parent, _id: { $ne: newStage._id } }).exec();

            // Kiểm tra nếu `nextStage` tồn tại thì cập nhật, nếu không thì bỏ qua
            if (nextStage) {
                console.log("Updating next stage:", nextStage._id, "with new parent:", newStage._id);
                await db.Stage.findByIdAndUpdate(nextStage._id, { parent: newStage._id });
            }
        }

        return newStage;
    } catch (error) {
        console.error("Error adding stage:", error);
        throw error;
    }
};

// edit stage
const editStage = async (stageId, updateData) => {
    try {
        const updatedStage = await db.Stage.findByIdAndUpdate(stageId, updateData, { new: true });

        return updatedStage;
    } catch (error) {
        throw error;
    }
};

const deleteStage = async ({ stageId, projectId, targetStageId }) => {
    try {
        const stages = await getAllByProject(projectId);

        if (stages.length <= 3) {
            throw new Error("Cannot delete stage. A project must have at least three stages.");
        }

        const stageToDelete = await db.Stage.findById(stageId).populate("activities");
        if (!stageToDelete) {
            throw new Error("Stage not found.");
        }

        const otherStages = stages.filter(stage => stage._id.toString() !== stageId);
        const stageStatuses = otherStages.map(stage => stage.stageStatus);
        if (!["todo", "doing", "done"].every(status => stageStatuses.includes(status))) {
            throw new Error("Cannot delete this stage. The project must have at least 'To Do', 'Doing', and 'Done' stages.");
        }


        // Lấy stage cha của stage bị xoá
        const previousStage = stages.find(stage => stage._id.toString() === stageToDelete.parent?.toString());

        // Cập nhật tất cả các stage con có parent là stage bị xoá, chuyển parent về stage khác (neu khong co parent, chuyển parent về null)
        await db.Stage.updateMany(
            { parent: stageId },
            { parent: previousStage ? previousStage._id : null }
        );


        // Nếu có activities, chuyển sang stage khác
        if (stageToDelete.activities?.length > 0 && targetStageId) {
            const targetStage = await db.Stage.findById(targetStageId);
            if (!targetStage || targetStage.project.toString() !== projectId) {
                throw new Error("Target stage is invalid or does not belong to the same project.");
            }

            await db.Activity.updateMany(
                { _id: { $in: stageToDelete.activities.map(a => a._id) } },
                { stage: targetStageId }
            );
        }
        // Cập nhật lại field `activities` trong targetStage 
        await db.Stage.findByIdAndUpdate(
            targetStageId,
            { $push: { activities: { $each: stageToDelete.activities.map(a => a._id) } } }
        );

        // Xoá danh sách activities trong stage bị xoá
        await db.Stage.findByIdAndUpdate(
            stageId,
            { $set: { activities: [] } }
        );


        // Xóa mềm
        await db.Stage.findByIdAndUpdate(stageId, {
            isDestroyed: true,
            parent: null,
        });

        return { message: "Stage deleted successfully and relationships updated." };
    } catch (error) {
        console.error("Error in deleteStage:", error);
        throw error;
    }
};




const stageService = {
    getAllByProject,
    updateStageParents,
    addStage,
    editStage,
    deleteStage


}

module.exports = stageService;