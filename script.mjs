import express from 'express'
import HTTP_CODES from './utils/httpCodes.mjs';
import fs from "node:fs/promises";
import { createSkillTree, updateSkill, getSkillTree, deleteSkill } from "./public/skillTreeManager.mjs";

const server = express();
const port = (process.env.PORT || 8000);
const settingsFile = "./settings/settings.json";

server.set('port', port);
server.use(express.static('public'));

server.post("/", createSkillTree);
server.get("/api/skill-tree", getSkillTree);
server.patch("/api/skill-tree/:skillName", updateSkill);
server.delete("/api/skill-tree/:skillName", deleteSkill);

server.listen(server.get('port'), function () {
    console.log('server running', server.get('port'));
});

// Server calls for saving/loading dark/light mode middleware
 server.get("/settings", async (req, res, next) => {
    try {
        const data = await fs.readFile(settingsFile);
        res.json(JSON.parse(data));
    } catch (error) {
        console.error("Error loading settings: ", error);
        res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).send("No settings found").end();
    }
});

server.post("/settings", express.json(), async (req, res, next) => {
    try {
        const settings = req.body;
        const data = JSON.stringify(settings);
        await fs.writeFile(settingsFile, data);
        res.status(HTTP_CODES.SUCCESS.OK).send("Settings saved").end();
    } catch (error) {
        console.error("Error saving settings: ", error);
        res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).send("Error saving settings");
    }
});