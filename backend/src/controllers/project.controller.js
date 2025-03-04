const db = require('../models');
const JWT = require('jsonwebtoken');
const bcrypt = require("bcrypt")
const morgan = require("morgan")
const createHttpErrors = require("http-errors");
const projectService = require('../services/project.service');
const {cloudinary} = require('../configs/cloudinary');
const path = require('path');
const fs = require('fs');

const getProjectById = async (req, res, next) => {
    try {
        const { projectId } = "67c6ce54eca28a980463e475";
        const project = await projectService.getProjectById(projectId)
        if (!project) {
            return res.status(404).json({ error: { status: 404, message: "Project not found" } })
        }
        res.status(200).json(project);
    } catch (error) {
        next(error);
    }
}

const editProject = async (req, res, next) => {
    try {
        const  projectId  = "67c6ce54eca28a980463e475";
        const {projectName} = req.body;
        const project = await projectService.getProjectById(projectId)
        if (!project) {
            return res.status(404).json({ error: { status: 404, message: "Project not found" } })
        }
        let newProjectAvatar = project.projectAvatar;
         if (req.file) {
                    try {
                        const result = await cloudinary.uploader.upload(req.file.path);
                        if (result && result.secure_url) {
                            newProjectAvatar = result.secure_url;
                            // Xóa ảnh cục bộ sau khi upload thành công
                            fs.unlink(req.file.path, (err) => {
                                if (err) console.error("Error deleting local file:", err);
                            });
                        } else {
                            return res.status(500).json({ message: "Failed to upload image" });
                        }
                    } catch (error) {
                        console.error("Cloudinary Upload Error:", error);
                        fs.unlink(req.file.path, () => {});
                        return res.status(500).json({ message: "Can't upload image now!" });
                    }
                }

                project.projectName = projectName;
                project.projectAvatar = newProjectAvatar;
                await project.save();
                res.status(200).json(project);
    } catch (error) {
        console.error("Error updating project:", error);
        return res.status(500).json({ message: error.message });
    }
}

const projectController = {
    getProjectById,
    editProject,
}

module.exports = projectController;