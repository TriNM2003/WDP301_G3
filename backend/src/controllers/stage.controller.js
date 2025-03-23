const db = require('../models');
const JWT = require('jsonwebtoken');
const bcrypt = require("bcrypt")
const morgan = require("morgan")
const createHttpErrors = require("http-errors");
const { stageService } = require('../services');

const getStagesByProjectId = async (req, res, next) => {
    try {
        const { projectId } = req.params;
        const stages = await stageService.getAllByProject(projectId);
        res.status(200).json({ status: 200, stages });
    } catch (error) {
        next(error);
    }
};


const updateStageParents = async (req, res, next) => {
    try {
        const { updates } = req.body;
        if (!Array.isArray(updates) || updates.length === 0) {
            return res.status(400).json({ message: "Invalid request data." });
        }

        const result = await stageService.updateStageParents(updates);
        res.status(200).json({ status: 200, ...result });
    } catch (error) {
        next(error);
    }
};

const addStage = async (req, res, next) => {
    try {
        const { stageName, stageStatus, parent } = req.body;
        const { projectId } = req.params;

        if (!stageName) {
            return res.status(400).json({ message: "Stage name is required" });
        }

        const newStage = await stageService.addStage({ stageName, stageStatus, parent, projectId });

        res.status(201).json({ status: 201, message: "Stage created successfully", stage: newStage });
    } catch (error) {
        next(error);
    }
};

// edit stage
const updateStage = async (req, res, next) => {
    try {
        const { stageId, stageName, stageStatus } = req.body; 

        if (!stageId) {
            return res.status(400).json({ error: { status: 400, message: "Stage ID is required" } });
        }

        const stage = await db.Stage.findById(stageId);

        if (!stage) {
            return res.status(400).json({ error: { status: 400, message: "Stage not found" } });
        }

        if (!stageName?.trim()) {
            return res.status(400).json({ error: { status: 400, message: "Stage name cannot be empty" } });
        }

        const updatedStage = await stageService.editStage(stageId, { stageName, stageStatus });

        if (!updatedStage) {
            return res.status(400).json({ error: { status: 400, message: "Stage update failed" } });
        }

        res.status(200).json({
            status: 200,
            message: "Stage updated successfully",
            stage: updatedStage,
        });
    } catch (error) {
        next(error);
    }
};

const deleteStage = async (req, res) => {
    try {
        const { stageId, targetStageId } = req.body;
        const { projectId } = req.params;

        if (!stageId || !projectId) {
            return res.status(400).json({ message: "Stage ID and Project ID are required." });
        }

        const result = await stageService.deleteStage({ stageId, projectId, targetStageId });

        res.status(200).json({ status: 200, ...result });
    } catch (error) {
        res.status(400).json({ status: 400, message: error.message });
    }
};

const stageController = {
    getStagesByProjectId,
    updateStageParents,
    addStage,
    updateStage,
    deleteStage

}

module.exports = stageController;