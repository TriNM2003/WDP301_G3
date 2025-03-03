const { User } = require("../models");
const SiteService = require("../services/site.service");

const getSiteById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const site = await SiteService.getSiteById(id)
        res.status(200).json(site);
    } catch (error) {
        res.status(400).json({ 
            message: error.message 
        });
    }
}

const createSite = async (req, res, next) => {
    try {
        const hasFile= req.file;
        const requestData = req.body;
        const userId = req.payload.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        let site;
        if(hasFile){
            site = await SiteService.createSite(requestData, hasFile, userId);
        }else{
            site = await SiteService.createSite(requestData, null, userId);
        }
        
        res.status(200).json(site);
    } catch (error) {
        res.status(400).json({ 
            message: error.message 
        });
    }
}

const SiteController = {
    getSiteById,
    createSite,
}

module.exports = SiteController;