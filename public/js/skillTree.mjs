"use strict";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js");
}

const btnNewSkillTree = document.getElementById("btnNewSkillTree");
const btnGetSkillTree = document.getElementById("btnGetSkillTree");
const inputSkillName = document.getElementById("inputSkillName");
const btnUnlockSkill = document.getElementById("btnUnlockSkill");
const btnDeleteSkill = document.getElementById("btnDeleteSkill");

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
  } catch (error) {
    console.error("Error parsing JSON:", error)
  }
});

btnUnlockSkill.addEventListener("click", async () => {
  const skillName = inputSkillName.value;
  const response = await fetch(`/api/skill-tree/${skillName}`, { method: "PATCH" });
  try {
    const data = await response.json();
    console.log("Attempting to update skill...", data);
  } catch (error) {
    console.error("Error updating skill", error);
  }
});

btnDeleteSkill.addEventListener("click", async () => {
  const skillName = inputSkillName.value;
  const response = await fetch(`/api/skill-tree/${skillName}`, { method: "DELETE" });
  try {
    const data = await response.json();
    console.log("Attempting to delete skill...", data);
  } catch (error) {
    console.error("Error updating skill", error);
  }
});