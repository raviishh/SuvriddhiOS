#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const TOPICS_PATH = path.join(__dirname, "../public/data/learn/topics_py.json");

const CHALLENGES_PATH = path.join(
    __dirname,
    "../public/data/learn/challenges.json",
);

// -----------------------------------------
// Load files
// -----------------------------------------

const topics = JSON.parse(fs.readFileSync(TOPICS_PATH, "utf8"));

const challenges = JSON.parse(fs.readFileSync(CHALLENGES_PATH, "utf8")).flat(
    Infinity,
);

// -----------------------------------------
// Group challenges by section
// -----------------------------------------

const challengeMap = {};

for (const challenge of challenges) {
    if (!challenge.section) {
        console.warn(
            `Skipping challenge "${challenge.id}" because it has no section.`,
        );
        continue;
    }

    if (!challengeMap[challenge.section]) {
        challengeMap[challenge.section] = [];
    }

    challengeMap[challenge.section].push(challenge);
}

console.log("Challenge sections:");
console.log(Object.keys(challengeMap));

console.log("\nTopic sections:");
console.log(topics.map((s) => s.id));

console.log("\nWriting to:");
console.log(TOPICS_PATH);

// -----------------------------------------
// Insert challenge references
// -----------------------------------------

for (const section of topics) {
    const sectionChallenges = challengeMap[section.id] || [];

    console.log(
        `${section.id}: found ${sectionChallenges.length} challenge(s)`,
    );

    // Remove old challenge entries so the script is idempotent
    section.items = section.items.filter((item) => item.type !== "challenge");

    if (sectionChallenges.length === 0) {
        continue;
    }

    // Insert after the last exercise, before quiz/project
    let insertIndex = section.items.findIndex(
        (item) => item.type === "quiz" || item.type === "project",
    );

    if (insertIndex === -1) {
        insertIndex = section.items.length;
    }

    const challengeEntries = sectionChallenges.map((challenge) => ({
        id: challenge.id,
        type: "challenge",
        title: challenge.title,

        // Change this if your frontend loads challenges differently
        contentFile: `topics_py/${section.id}/${challenge.id}.html`,
    }));

    section.items.splice(insertIndex, 0, ...challengeEntries);

    console.log(`  -> Inserted ${challengeEntries.length} challenge(s)`);
}

// -----------------------------------------
// Save
// -----------------------------------------

fs.writeFileSync(TOPICS_PATH, JSON.stringify(topics, null, 4) + "\n");

console.log("\n✔ Successfully updated topics_py.json");
