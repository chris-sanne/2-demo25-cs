"use strict";

import { toggleTheme, startup } from "./themeManager.mjs"; 

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js");
}

const btnToggleTheme = document.getElementById("btnToggleTheme");
const btnNewSkillTree = document.getElementById("btnNewSkillTree");
const btnGetSkillTree = document.getElementById("btnGetSkillTree");
const inputSkillName = document.getElementById("inputSkillName");
const btnUnlockSkill = document.getElementById("btnUnlockSkill");
const btnDeleteSkill = document.getElementById("btnDeleteSkill");
const skillTreeElement = document.getElementById("skillTreeElement");

function buildNestedTree(skills) {
  const skillMap = new Map();
  skills.forEach(skill => skillMap.set(skill.name, { ...skill, subskills: [] }));

  const rootSkills = [];
  skills.forEach(skill => {
    if (skill.subskills) {
      const subskillNames = skill.subskills.split(",").map(name => name.trim());
      subskillNames.forEach(subName => {
        if (skillMap.has(subName)) {
          skillMap.get(skill.name).subskills.push(skillMap.get(subName));
        }
      });
    }
    if (!skills.some(s => s.subskills.includes(skill.name))) {
      rootSkills.push(skillMap.get(skill.name));
    }
  });
  return rootSkills;
}

function showSkillTree(skill, parentElement) {
  const listItem = document.createElement("li");
  const skillNameSpan = document.createElement("span");

  skillNameSpan.innerText = skill.name + (skill.unlocked ? " ✅ " : " ❌ ");
  skillNameSpan.id = skill.name.replaceAll(" ", "-");
  skillNameSpan.classList.add("skillBox");
  
  listItem.appendChild(skillNameSpan);
  parentElement.appendChild(listItem);
  
  if (skill.subskills.length > 0) {
    const unorderedList = document.createElement("ul");
    listItem.appendChild(unorderedList);
    skill.subskills.forEach(subskill => showSkillTree(subskill, unorderedList));
  }
}

btnToggleTheme.addEventListener("click", toggleTheme);
startup();

btnNewSkillTree.addEventListener("click", async () => {
  const response = await fetch("/", { method: "POST" });
  const data = await response.json();
  console.log("New skill tree requested from the server.");
  console.log(data);
});

btnGetSkillTree.addEventListener("click", async () => {
  const response = await fetch("/api/skill-tree", { method: "GET" });
  try {
    const data = await response.json();
    console.log("My skill tree requested from the server.");
    console.log(data);
    skillTreeElement.innerHTML = "";
    const nestedTree = buildNestedTree(data);
    nestedTree.forEach(skill => showSkillTree(skill, skillTreeElement));
  } catch (error) {
    console.error("Error parsing JSON:", error)
  }
});

btnUnlockSkill.addEventListener("click", async () => {
  const skillName = inputSkillName.value.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
  const response = await fetch(`/api/skill-tree/${skillName}`, { method: "PATCH" });
  try {
    const data = await response.json();
    console.log("Attempting to update skill...", data);
    const skillTreeResponse = await fetch("/api/skill-tree", { method: "GET" });
    const skillTreeData = await skillTreeResponse.json();
    skillTreeElement.innerHTML = "";
    const nestedTree = buildNestedTree(skillTreeData);
    nestedTree.forEach(skill => showSkillTree(skill, skillTreeElement));
  } catch (error) {
    console.error("Error updating skill", error);
  }
});

btnDeleteSkill.addEventListener("click", async () => {
  const skillName = inputSkillName.value.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
  const response = await fetch(`/api/skill-tree/${skillName}`, { method: "DELETE" });
  try {
    const data = await response.json();
    console.log("Attempting to delete skill...", data);
    const skillTreeResponse = await fetch("/api/skill-tree", { method: "GET" });
    const skillTreeData = await skillTreeResponse.json();
    skillTreeElement.innerHTML = "";
    const nestedTree = buildNestedTree(skillTreeData);
    nestedTree.forEach(skill => showSkillTree(skill, skillTreeElement));
  } catch (error) {
    console.error("Error updating skill", error);
  }
});