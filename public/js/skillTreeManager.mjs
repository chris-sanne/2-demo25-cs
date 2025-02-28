import fs from "node:fs/promises";
import HTTP_CODES from "../../utils/httpCodes.mjs";

const skillTreeFile = "./data/skillTree.json";

export async function getSkillTree(req, res, next) {
    try {
        const data = await fs.readFile(skillTreeFile);
        console.log(JSON.parse(data));
        res.status(HTTP_CODES.SUCCESS.OK).json(JSON.parse(data)).end();
    } catch (error) {
        console.log(`Error loading skill tree: ${error}`);
        res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).send(`Error displaying skill tree`).end();
    }
};