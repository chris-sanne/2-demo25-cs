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
        res.status(HTTP_CODES.SUCCESS.OK).send(`${skill.name} unlocked: ${skill.unlocked}`);
        console.log(skillTree);
    } else {
        res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).send(`Skill '${skillName}' not found, check spelling`);
    }
}

export function deleteSkill(req, res, next) {
    const skillName = req.params.skillName;
    const skillsArray = [];
    skillsArray.push(skillTree);

    function skillNameMatcher(subskill) {
        if (subskill.name === skillName) {
            return true;
        } else {
            return false;
        }
    }

    while (skillsArray.length > 0) {
        const skill = skillsArray.pop();
        const index = skill.subskills.findIndex(skillNameMatcher);

        if (index !== -1) {
            skill.subskills.splice(index, 1);
            return res.status(HTTP_CODES.SUCCESS.OK).json(`Deleted skill: ${skillName}`);
        }
        skillsArray.push(...skill.subskills);
    }
    return res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).json(`Skill: '${skillName}' not found, check spelling`);
}