const { User } = require("../models");
const SiteService = require("../services/site.service");
const db = require('../models');
const JWT = require('jsonwebtoken');
const bcrypt = require("bcrypt")
const morgan = require("morgan")
const createHttpErrors = require("http-errors");
const { siteService } = require('../services');
const cloudinaryFile = require('../configs/cloudinary')

const getAllSites = async (req, res, next) => {
    try {
        const sites = await siteService.getAllSites();
        res.status(200).json(sites);
    } catch (error) {
        next(error);
    }
}

const getSiteById = async (req, res, next) => {
    try {

        const {siteId} = req.params;

        const site = await SiteService.getSiteById(siteId)
        res.status(200).json(site);
    } catch (error) {
        res.status(400).json({ 
            message: error.message 
        });
    }
}

const getSiteMembersById = async (req, res, next) => {
    try {
        const siteId = req.params.siteId;
        const siteMember = await siteService.getSiteMembersById(siteId);
        res.status(200).json(siteMember);
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
        let site;
        if(hasFile){
            site = await SiteService.createSite(requestData, hasFile);
        }else{
            site = await SiteService.createSite(requestData, null);
        }
        
        res.status(200).json(site);
    } catch (error) {
        res.status(400).json({ 
            message: error.message 
        });
    }
}

const getSiteByUserId = async (req, res, next) => {
    try {
        const {id} = req.payload;
            const site = await siteService.getSiteByUserId(id);
            if(!site){
                return res.status(404).json({ error: { status: 404, message: "Site not found" } })
            }
            res.status(200).json(site);
    } catch (error) {
        next(error);
    }
}

const inviteMembersByEmail = async (req, res, next) => {
    try {
        const {id} = req.payload;
        const {siteId} = req.params;
        const receiver = req.body.receiver;
        console.log(id, siteId, receiver);
        const message = await siteService.inviteMembersByEmail(id, receiver, siteId)
        res.status(200).json({message: message});
    } catch (error) {
        next(error);
    }
}

// get all user in site

const getAllUsersInSite = async (req, res, next) => {
    try {
        const { siteId } = req.params;
        const users = await siteService.getAllUsersInSite(siteId);

        if (!users || users.length === 0) {
            return res.status(404).json({ error: { status: 404, message: "No members found in this site" } });
        }

        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

const revokeSiteMemberAccess = async (req, res, next) => {
    try {
        const siteId = req.params.siteId;
        const siteMemberId = req.params.siteMemberId;
        const result = await siteService.revokeSiteMemberAccess(siteId, siteMemberId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

const siteController = {
    getSiteById,
    createSite,
    getSiteByUserId,
    inviteMembersByEmail,
    getAllSites,
    getSiteMembersById,
    getAllUsersInSite,
    revokeSiteMemberAccess,
}

module.exports = siteController;
