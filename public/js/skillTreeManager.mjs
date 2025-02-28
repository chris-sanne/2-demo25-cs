import fs from "node:fs/promises";
import HTTP_CODES from "../../utils/httpCodes.mjs";
import { skillTree } from "../js/skillTree.mjs";

export function createSkillTree(req, res, next) {
    const newSkillTree = JSON.parse(JSON.stringify(skillTree));

    console.log("New skill tree generated:");
    console.log(newSkillTree);

    res.status(HTTP_CODES.SUCCESS.OK).json(newSkillTree);
}