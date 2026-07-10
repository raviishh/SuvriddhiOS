#!/usr/bin/env node
/**
 * generate_exercises.js
 *
 * Walks the course topics file, finds every item of type "exercise",
 * cross-references it against the exercise-definitions file, and:
 *
 *   1. Renders a description HTML page per exercise (one file per
 *      `contentFile` path) — this is what ExerciseView fetches via
 *      `fetch(`/data/${item.contentFile}`)`.
 *
 *   2. Builds the `tests` array ExerciseView needs when it POSTs
 *      `{ code, tests: item.tests }` to the grading backend. Each task
 *      in an exercise becomes one test condition: { taskId, title,
 *      checkMode, expectedOutput }. The backend is expected to run the
 *      student's whole script once per test, capture stdout, and compare
 *      it against `expectedOutput` using `checkMode` ("exact" | "contains").
 *
 *   3. Writes a compiled topics file where every exercise item gets
 *      `starterCode`, `lead`, and `tests` merged in — ready to be consumed
 *      directly as ExerciseItem[] by the frontend, instead of the raw
 *      topics.json + a separate lookup at runtime.
 *
 * USAGE
 *   node generate_exercises.js \
 *     --topics ./topics.json \
 *     --exercises ./exercises.json \
 *     --outDir ./public/data
 *
 * All flags are optional; defaults shown above are used if omitted.
 */

const fs = require("fs");
const path = require("path");

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------

function parseArgs(argv) {
    const args = {
        topics: "./topics.json",
        exercises: "./exercises.json",
        outDir: "./public/data",
        topicsOut: null, // defaults to <outDir>/topics_compiled.json if not set
    };
    for (let i = 0; i < argv.length; i++) {
        const a = argv[i];
        if (a === "--topics") args.topics = argv[++i];
        else if (a === "--exercises") args.exercises = argv[++i];
        else if (a === "--outDir") args.outDir = argv[++i];
        else if (a === "--topicsOut") args.topicsOut = argv[++i];
        else if (a === "--help" || a === "-h") {
            printHelpAndExit();
        }
    }
    return args;
}

function printHelpAndExit() {
    console.log(`
Usage: node generate_exercises.js [options]

Options:
  --topics <path>     Path to the raw topics file          (default: ./topics.json)
  --exercises <path>  Path to exercises.json               (default: ./exercises.json)
  --outDir <path>     Output root for generated HTML pages (default: ./public/data)
  --topicsOut <path>  Where to write the compiled topics    (default: <outDir>/topics_compiled.json)
                      Pass the SAME path as --topics to overwrite it in place.
  -h, --help          Show this help
`);
    process.exit(0);
}

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

function readJson(filePath) {
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
}

function writeFileEnsuringDir(filePath, contents) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, contents, "utf8");
}

function escapeHtml(str) {
    if (str === null || str === undefined) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function renderList(items) {
    if (!items || items.length === 0) return "";
    return `<ul>\n${items.map((i) => `  <li>${escapeHtml(i)}</li>`).join("\n")}\n</ul>`;
}

// ---------------------------------------------------------------------------
// 1. HTML rendering for a single exercise's description page
// ---------------------------------------------------------------------------

function renderTaskHtml(task) {
    const difficultyBadge = task.difficulty
        ? `<span class="difficulty-badge difficulty-${escapeHtml(task.difficulty)}">${escapeHtml(task.difficulty)}</span>`
        : "";

    const backgroundBlock = task.background
        ? `<p class="task-background">${escapeHtml(task.background)}</p>`
        : "";

    const backgroundCodeBlock = task.backgroundCode
        ? `<pre class="code-block"><code>${escapeHtml(task.backgroundCode)}</code></pre>`
        : "";

    const backgroundCodeOutputBlock = task.backgroundCodeOutput
        ? `<div class="code-output-label">Output:</div><pre class="code-output"><code>${escapeHtml(
              task.backgroundCodeOutput
          )}</code></pre>`
        : "";

    const instructionsBlock = task.instructions && task.instructions.length
        ? `<div class="task-instructions"><h4>What to do</h4>${renderList(task.instructions)}</div>`
        : "";

    const hintsBlock = task.hints && task.hints.length
        ? `<details class="task-hints">
  <summary>Hints (${task.hints.length})</summary>
  ${renderList(task.hints)}
</details>`
        : "";

    const warningsBlock = task.warnings && task.warnings.length
        ? `<div class="task-warnings">
  <h4>Watch out for</h4>
  ${renderList(task.warnings)}
</div>`
        : "";

    return `
<section class="exercise-task" id="${escapeHtml(task.taskId)}">
  <h3>${escapeHtml(task.title)} ${difficultyBadge}</h3>
  ${backgroundBlock}
  ${backgroundCodeBlock}
  ${backgroundCodeOutputBlock}
  ${instructionsBlock}
  ${warningsBlock}
  ${hintsBlock}
</section>`.trim();
}

function renderExerciseHtml(exercise) {
    const taskSections = exercise.tasks.map(renderTaskHtml).join("\n\n");

    return `<div class="exercise-content">
  <h2>${escapeHtml(exercise.title)}</h2>
  <p class="exercise-lead">${escapeHtml(exercise.lead)}</p>

  ${taskSections}
</div>
`;
}

// ---------------------------------------------------------------------------
// 2. Test-condition extraction — turns each task's checkMode +
//    expectedOutput into the shape ExerciseView will send to the grader
//    as `item.tests`.
// ---------------------------------------------------------------------------

function buildTestsForExercise(exercise) {
    return exercise.tasks.map((task) => {
        if (task.checkMode !== "exact" && task.checkMode !== "contains") {
            console.warn(
                `  ! Unknown checkMode "${task.checkMode}" on task "${task.taskId}" — defaulting to "contains".`
            );
        }
        return {
            taskId: task.taskId,
            title: task.title,
            checkMode: task.checkMode === "exact" ? "exact" : "contains",
            expectedOutput: task.expectedOutput,
        };
    });
}

// ---------------------------------------------------------------------------
// 3. Main pass over topics.json
// ---------------------------------------------------------------------------

function main() {
    const args = parseArgs(process.argv.slice(2));

    const topicsPath = path.resolve(args.topics);
    const exercisesPath = path.resolve(args.exercises);
    const outDir = path.resolve(args.outDir);

    console.log(`Reading topics from:    ${topicsPath}`);
    console.log(`Reading exercises from: ${exercisesPath}`);
    console.log(`Writing output to:      ${outDir}\n`);

    const topics = readJson(topicsPath); // array of units, each with .items[]
    const exercises = readJson(exercisesPath); // map: exerciseId -> exercise def

    let generated = 0;
    let missing = 0;

    const compiledTopics = topics.map((unit) => {
        const compiledItems = unit.items.map((item) => {
            if (item.type !== "exercise") {
                return item; // lessons/quizzes/projects pass through untouched
            }

            const exercise = exercises[item.id];
            if (!exercise) {
                console.warn(`  ! No exercise definition found for id "${item.id}" (unit "${unit.id}") — skipping.`);
                missing++;
                return item;
            }

            // 1. Render + write the description HTML
            const html = renderExerciseHtml(exercise);
            const outPath = path.join(outDir, item.contentFile);
            writeFileEnsuringDir(outPath, html);

            // 2. Build the grading conditions
            const tests = buildTestsForExercise(exercise);

            generated++;
            console.log(`  ✓ ${item.id} -> ${path.relative(outDir, outPath)} (${tests.length} test condition${tests.length === 1 ? "" : "s"})`);

            // 3. Return the enriched item for the compiled topics file
            return {
                ...item,
                lead: exercise.lead,
                starterCode: exercise.starterCode,
                tests,
            };
        });

        return { ...unit, items: compiledItems };
    });

    const compiledTopicsPath = args.topicsOut
        ? path.resolve(args.topicsOut)
        : path.join(outDir, "topics_compiled.json");
    writeFileEnsuringDir(compiledTopicsPath, JSON.stringify(compiledTopics, null, 2));

    console.log(`\nDone. Generated ${generated} exercise page(s), ${missing} missing definition(s).`);
    console.log(`Compiled topics written to: ${compiledTopicsPath}`);
}

main();
