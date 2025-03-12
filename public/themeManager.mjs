export async function loadSettings() {
    try {
        const response = await fetch("/settings");
        const settings = await response.json();
        return settings;
    } catch (error) {
        console.error("Error loading settings:", error);
        return { theme: "light" };
    }
}

export async function saveSettings(settings) {
    try {
        const response = await fetch("/settings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(settings),
        });

        if (!response.ok) {
            throw new Error("Error saving settings");
        }
    } catch (error) {
        console.error("Error saving settings: ", error);
    }
}

export async function applyTheme(theme) {
    if (theme === "dark") {
        document.body.classList.add("darkmode");
    } else {
        document.body.classList.remove("darkmode");
    }
}

export async function toggleTheme() {
    try {
        const settings = await loadSettings();
        const newTheme = settings.theme === "dark" ? "light" : "dark";

        const newSettings = { theme: newTheme };
        await saveSettings(newSettings);

        await applyTheme(newTheme);
    } catch (error) {
        console.error("Error toggling theme: ", error);
    }
}

export async function startup() {
    try {
        const settings = await loadSettings();
        await applyTheme(settings.theme);
    } catch (error) {
        console.error("Error starting theme: ", error);
    }
}