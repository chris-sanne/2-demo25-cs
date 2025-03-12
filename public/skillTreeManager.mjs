import fs from "node:fs/promises";
import HTTP_CODES from "../utils/httpCodes.mjs";

const skillTree = {
  name: "Swiftcast",
  unlocked: true,
  subskills: [
    {
      name: "Fireball",
      unlocked: false,
      subskills: [
        {
          name: "Greater Fireball",
          unlocked: false,
          subskills: []
        },
        {
          name: "Firestorm",
          unlocked: false,
          subskills: []
        }
      ]
    },
    {
      name: "Cure",
      unlocked: false,
      subskills: [
        {
          name: "Cure 2",
          unlocked: false,
          subskills: []
        },
        {
          name: "Regen",
          unlocked: false,
          subskills: []
        }
      ]
    }
  ]
};

let activeSkillTree = JSON.parse(JSON.stringify(skillTree));

export function createSkillTree(req, res, next) {
    activeSkillTree = JSON.parse(JSON.stringify(skillTree));
    console.log("New skill tree generated:");
    console.log(activeSkillTree);
    res.status(HTTP_CODES.SUCCESS.OK).json(activeSkillTree).end();
}

export function getSkillTree(req, res, next) {
    console.log("My skill tree: ", activeSkillTree);
    res.status(HTTP_CODES.SUCCESS.OK).json(activeSkillTree).end();
}

function findSkill(skillName) {
    const stack = [...activeSkillTree.subskills];

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
        console.log(`${skillName} unlocked: ${skill.unlocked}`);
        console.log(activeSkillTree);
    } else {
        res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).json(`Skill '${skillName}' not found, check spelling`);
    }
}

export function deleteSkill(req, res, next) {
    const skillName = req.params.skillName;
    const skillsArray = [];
    skillsArray.push(activeSkillTree);

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