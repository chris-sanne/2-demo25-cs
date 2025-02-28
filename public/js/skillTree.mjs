"use strict";

const skillTreeElement = document.getElementById("skillTreeElement");

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
          name: "Cure II",
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

console.log(skillTree);

function showSkillTree(skill, parentElement) {
  const listItem = document.createElement("li");
  listItem.innerText = skill.name + (skill.unlocked ? " ✅ " : " ❌ ");
  listItem.id = skill.name.replaceAll(" ", "-");
  parentElement.appendChild(listItem);
  
  if (skill.subskills.length > 0) {
    const unorderedList = document.createElement("ul");
    listItem.appendChild(unorderedList);
    skill.subskills.forEach(subskill => showSkillTree(subskill, unorderedList));
  }
}

showSkillTree(skillTree, skillTreeElement);