const db = require('../models');
const JWT = require('jsonwebtoken');
const bcrypt = require("bcrypt")
const morgan = require("morgan")
const createHttpErrors = require("http-errors");
const projectService = require('../services/project.service');

const {cloudinary} = require('../configs/cloudinary');
const path = require('path');
const fs = require('fs');

const { userService } = require('../services');

const getAllProjects = async (req, res, next) => {
    try {
      
        const project = await projectService.getAllProjects()
        if (!project) {
            return res.status(404).json({ error: { status: 404, message: "Project not found" } })
        }
        res.status(200).json(project);
    } catch (error) {
        next(error);
    }
}

const getProjectsInSite = async (req, res, next) => {
    try {
        const { siteId } = req.params;

        const projects = await projectService.getProjectsInSite(siteId); 
        if (!projects || projects.length === 0) {
            return res.status(404).json({ error: { status: 404, message: "Không tìm thấy dự án nào" } });
        }

        // Populate 
        const populatedProjects = await db.Project.populate(projects, {
            path: "projectMember._id",
            select: "username userAvatar email fullName"
        });

        res.status(200).json(populatedProjects);
    } catch (error) {
        next(error);
    }
};

// create project

const createProject = async (req, res, next) => {
    try {
        const creatorId = req.payload.id;
        const siteId = req.params.siteId;

        const newProject = await projectService.createProject(req.body, creatorId, siteId);

        res.status(201).json({
            message: "Project created successfully!",
            project: newProject
        });
    } catch (error) {
        res.status(400).json({ error: { status: 400, message: error.message } });
    }
};






const getProjectById = async (req, res, next) => {
    try {
        const projectId = req.params.projectId;
        
        // Truy vấn trực tiếp từ model thay vì thông qua service nếu service không hỗ trợ populate
        const project = await projectService.getProjectById(projectId);
        if (!project) {
            return res.status(404).json({ error: { status: 404, message: "Project not found" } });
        }

        res.status(200).json(project);
    } catch (error) {
        next(error);
    }
};

const editProject = async (req, res, next) => {
    try {
        const  projectId  = req.params.projectId//"67c6ce54eca28a980463e475";
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
                // slug:slugify(...Name)
                project.projectName = projectName;
                project.projectAvatar = newProjectAvatar;
                await project.save();
                res.status(200).json(project);
    } catch (error) {
        console.error("Error updating project:", error);
        return res.status(500).json({ message: error.message });
    }
}


const removeToTrash = async (req, res, next) => {
    try {
        const projectId = req.params.projectId;
        const project = await projectService.getProjectById(projectId);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Cập nhật trạng thái project thành "archived"
        project.projectStatus = "archived";
        await project.save();

        res.status(200).json({ message: "Project moved to trash successfully!" });
    } catch (error) {
        console.error("Error updating project:", error);
        return res.status(500).json({ message: error.message });
    }
};

const restoreProject = async (req, res, next) => {
    try {
        const projectId = req.params.projectId;
        const project = await projectService.getProjectById(projectId);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Cập nhật trạng thái project thành "active"
        project.projectStatus = "active";
        await project.save();

        res.status(200).json({ message: "Project restored successfully!" });
    } catch (error) {
        console.error("Error updating project:", error);
        return res.status(500).json({ message: error.message });
    }
}

const getProjectTrash = async (req, res, next) => {
    try {
        // Lấy tất cả project có status "archived"
        const projects = await db.Project.find({ projectStatus: "archived" })
            .populate({
                path: "projectMember._id",
                select: "fullName username email"
            });

        // Lọc ra người có vai trò "projectManager" trong từng project
        const projectsWithManager = projects.map(project => {
            const manager = project.projectMember.find(member => member.roles.includes("projectManager"));

            return {
                _id: project._id,
                projectName: project.projectName,
                projectAvatar: project.projectAvatar,
                projectStatus: project.projectStatus,
                projectManager: manager ? manager._id.username : "Unknown",
                updatedAt: project.updatedAt,
                deletedIn: calculateDaysLeft(project.updatedAt), // Thời gian còn lại trước khi bị xóa
            };
        });

        res.status(200).json(projectsWithManager);
    } catch (error) {
        console.error("Error fetching projects:", error);
        return res.status(500).json({ message: error.message });
    }
};

// Hàm tính số ngày còn lại trước khi bị xóa vĩnh viễn (sau 30 ngày)
const calculateDaysLeft = (deletedDate) => {
    const now = new Date();
    const deletedTime = new Date(deletedDate);
    const timeDiff = 30 - Math.floor((now - deletedTime) / (1000 * 60 * 60 * 24)); 
    return timeDiff > 0 ? `In ${timeDiff} days` : "Expired";
};
    

const deleteProject = async (req, res, next) => {
    try {
        const projectId = req.params.projectId;
        const project = await projectService.getProjectById(projectId);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Xóa project khỏi database
        await project.remove();

        res.status(200).json({ message: "Project deleted successfully!" });
    } catch (error) {
        console.error("Error deleting project:", error);
        return res.status(500).json({ message: error.message });
    }
}

// const checkProjectManager = async (req, res, next) => {
//     try {
//         const projectId = req.params.projectId;
//         const userId = req.user._id; 

//         const project = await db.Project.findById(projectId).populate({
//             path: "projectMember._id",
//             select: "fullName username"
//         });

//         if (!project) {
//             return res.status(404).json({ message: "Project not found" });
//         }

//         const isManager = project.projectMember.some(member => 
//             member._id._id.toString() === userId.toString() && member.roles.includes("projectManager")
//         );

//         if (!isManager) {
//             return res.status(403).json({ message: "Access denied." });
//         }

//         res.status(200).json({ isManager: true });
//     } catch (error) {
//         console.error("Error checking project manager:", error);
//         return res.status(500).json({ message: error.message });
//     }
// };

const projectController = {
    getProjectById,
    editProject,
    removeToTrash,
    getProjectTrash,
    restoreProject,
    deleteProject,
    //checkProjectManager
    getAllProjects,
    getProjectsInSite,
    createProject

}

module.exports = projectController;