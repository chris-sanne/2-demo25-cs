import fs from "node:fs/promises";
import HTTP_CODES from "../../utils/httpCodes.mjs";
import { skillTree } from "../js/skillTree.mjs";

export function createSkillTree(req, res, next) {
    const newSkillTree = JSON.parse(JSON.stringify(skillTree));

    console.log("New skill tree generated:");
    console.log(newSkillTree);

    res.status(HTTP_CODES.SUCCESS.OK).json(newSkillTree);
}

export function getSkillTree(req, res, next) {
    console.log("My skill tree: ", skillTree);
    res.json(skillTree);
}

function findSkill(skillName) {
    const stack = [...skillTree.subskills];

    while (stack.length > 0) {
        const skill = stack.pop();
        if (skill.name === skillName) {
            return skill;
        }
        stack.push(...skill.subskills);
    }
}

export function updateSkill(req, res, next) {
    const skillName = req.params.skillName;
    const skill = findSkill(skillName);
    
    if (skill) {
        skill.unlocked = !skill.unlocked;
        res.status(HTTP_CODES.SUCCESS.OK).json(`${skill.name} unlocked: ${skill.unlocked}`);
        console.log(skillTree);
    } else {
        res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).send("Skill not found, check typing");
    }
}