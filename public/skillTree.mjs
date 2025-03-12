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
    showSkillTree(data, skillTreeElement);
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
    showSkillTree(skillTreeData, skillTreeElement);
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
    showSkillTree(skillTreeData, skillTreeElement);
  } catch (error) {
    console.error("Error updating skill", error);
  }
});