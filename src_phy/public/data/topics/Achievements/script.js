// ---------------- LOCAL STORAGE KEYS ---------------- //
const STORAGE_KEYS = {
    points: 'ach_points',
    streak: 'ach_streak',
    correct: 'ach_correct',
    questions: 'ach_questions',
    perfection: 'ach_perfection',
    badges: 'ach_badges',
    hash: 'ach_hash',
    achievementsBitmap: 'ach_achievements',
    lastPlayed: 'ach_last_played'
};

// Debug short-circuit flags (Keep as is)
const DEBUG_SHORT_CIRCUIT_SET = false; 
const DEBUG_SHORT_CIRCUIT_GET = false; 
const DEBUG_SHORT_CIRCUIT_SAVE = false; 

// Feature flags (Keep as is)
const FEATURE_FLAGS = {
    createParticles: true, 
    saveStateServerSide: false, // Assuming server-side is now local encryption only
    verifyIntegrityServerSide: false, // Assuming server-side is now local encryption only
    updateStats: true, 
    renderAchievements: true,
    updateAchievementsBitmap: true,
    checkAchievementsAndUpdate: true,
    periodicCheck: true,
    postSetCheck: true
};

// ---------------- ACHIEVEMENTS DATA (Keep as is) ---------------- //
const ACHIEVEMENTS = {
    points: [
        { threshold: 50, name: "Getting Started", icon: "🌟" },
        { threshold: 200, name: "Point Collector", icon: "💎" },
        { threshold: 500, name: "Rising Scholar", icon: "📚" },
        { threshold: 1000, name: "Point Hoarder", icon: "💰" },
        { threshold: 5000, name: "Master", icon: "👑" },
        { threshold: 10000, name: "Legendary", icon: "🏆" },
        { threshold: 50000, name: "PHYSICS GOD?!", icon: "👽" }
    ],
    streak: [
        { threshold: 7, name: "Week One Wonder", icon: "📅" },
        { threshold: 10, name: "Double Digits", icon: "🔟" },
        { threshold: 30, name: "Month Maven", icon: "📆" },
        { threshold: 50, name: "Half-Century Hero", icon: "⭐" },
        { threshold: 100, name: "Century Streak", icon: "💯" },
    ],
    correct: [
        { threshold: 1, name: "A Start", icon: "✅" },
        { threshold: 10, name: "Getting It", icon: "✅" },
        { threshold: 100, name: "Brainiac", icon: "🧠" },
        { threshold: 1000, name: "Quiz Master", icon: "🏅" }
    ],
    questions: [
        { threshold: 1, name: "Questionable Start", icon: "❓" },
        { threshold: 10, name: "Curious Mind", icon: "🤔" },
        { threshold: 100, name: "Question Hoarder", icon: "📝" },
        { threshold: 1000, name: "Quizzilla", icon: "📊" }
    ],
    perfection: [
        { threshold: 1, name: "Near Perfect", icon: "⚡" },
        { threshold: 10, name: "Excellence", icon: "🎪" },
        { threshold: 100, name: "Perfectionist", icon: "💫" },
        { threshold: 500, name: "Flawless Legend", icon: "🌟" }
    ]
};

const CATEGORY_NAMES = {
    points: "Points Milestones",
    streak: "Streak Achievements", 
    correct: "Accuracy Awards",
    questions: "Question Achievements",
    perfection: "Perfection Badges"
};

// ---------------- LOCAL ENCRYPTION (Keep as is) ---------------- //
let localSecret = null;

function initializeLocalSecret() {
    if (localSecret === null) {
        const existingSecret = getCookie('ach_local_secret');
        if (existingSecret) {
            localSecret = parseInt(existingSecret, 10);
        } else {
            localSecret = Math.floor(Math.random() * 9000+1000);
            setCookie('ach_local_secret', String(localSecret)); 
        }
    }
    return localSecret;
}

function encryptValue(value) {
    const secret = initializeLocalSecret();
    return (secret * secret) + (44 * secret) + value;
}

function decryptValue(encryptedValue) {
    const secret = initializeLocalSecret();
    return encryptedValue - (secret * secret) - (44 * secret);
}

// ---------------- COOKIE HELPERS ---------------- //
// P0 FIX: Changed default days to a non-overflowing 100 years (36525 days)
function setCookie(name, value, days = 36525) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    const cookie = `${encodeURIComponent(name)}=${encodeURIComponent(String(value))}; Expires=${expires}; Path=/; Domain=.quarklearning.online; Secure; SameSite=None`;
    document.cookie = cookie;
}

function getCookie(name) {
    const cookies = document.cookie ? document.cookie.split('; ') : [];
    for (let i = 0; i < cookies.length; i++) {
        const parts = cookies[i].split('=');
        const key = decodeURIComponent(parts.shift());
        const val = parts.join('=');
        if (key === name) return decodeURIComponent(val);
    }
    return null;
}

function deleteCookie(name) {
    document.cookie = `${encodeURIComponent(name)}=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/; Domain=.quarklearning.online; Secure; SameSite=None`;
}

// ---------------- PARTICLES (Keep as is) ---------------- //
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    setInterval(() => {
        const currentCount = document.querySelectorAll('.particle').length;
        const maxCount = 1500;
        const particlesToAdd = Math.min(3, maxCount - currentCount);
        
        for (let i = 0; i < particlesToAdd; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + 'vw';
            particle.style.width = particle.style.height = Math.random() * 4 + 2 + 'px';
            
            const animationDuration = Math.random() * 3 + 6;
            particle.style.animationDuration = animationDuration + 's';
            particle.style.animationDelay = Math.random() * 1 + 's';
            
            particlesContainer.appendChild(particle);
            
            particle.addEventListener('animationend', () => {
                if (particle.parentNode) {
                    particle.remove();
                }
            });
        }
    }, 50);
}

// ---------------- STATE GET/SET ---------------- //

function getValue(key) {
    if (typeof DEBUG_SHORT_CIRCUIT_GET !== 'undefined' && DEBUG_SHORT_CIRCUIT_GET) {
        return 0;
    }

    if (typeof document === 'undefined' || typeof document.cookie === 'undefined') return 0;
    const raw = getCookie(STORAGE_KEYS[key]);
    
    if (!raw) return 0;
    
    const EXEMPT_FROM_DECRYPTION = ['achievementsBitmap', 'badges', 'hash'];
    
    if (EXEMPT_FROM_DECRYPTION.includes(key)) {
        return parseInt(raw, 10) || 0;
    }
    
    const rawValue = parseInt(raw, 10);
    if (!Number.isFinite(rawValue)) return 0;
    
    if (rawValue > 1000000) {
        try {
            const decrypted = decryptValue(rawValue);
            if (decrypted >= 0 && decrypted < 1000000) {
                return decrypted;
            } else {
                // PATCH: Decrypting resulted in a value outside the expected range (e.g., negative or too large).
                console.warn(`Decryption of ${key} resulted in an unexpected value: ${decrypted}. Treating as corrupt.`);
                return -1; // Return signal for corruption
            }
        } catch (error) {
            // PATCH: Decryption failed (e.g., local secret is gone/wrong).
            console.warn(`Failed to decrypt ${key}:`, error);
            return -1; // Return signal for corruption
        }
    }
    
    // If it's a small value (<= 1,000,000), treat it as an unencrypted stat.
    return (rawValue >= 0) ? rawValue : 0;
}

function setValue(key, val) {
    if (typeof DEBUG_SHORT_CIRCUIT_SET !== 'undefined' && DEBUG_SHORT_CIRCUIT_SET) {
        return;
    }

    if (typeof document !== 'undefined' && typeof document.cookie !== 'undefined') {
        const EXEMPT_FROM_CAP = ['achievementsBitmap', 'badges', 'hash'];

        if (EXEMPT_FROM_CAP.includes(key)) {
            setCookie(STORAGE_KEYS[key], String(val)); 
            return;
        }

        const numericVal = Number(val);
        if (!Number.isFinite(numericVal)) {
            console.warn(`Attempted to set ${key} to ${val}, which is not a finite number. Ignoring write.`);
            return;
        }

        const current = getValue(key); 
        const delta = numericVal - current;

        let valueToSave = numericVal;
        if (Math.abs(delta) > 50) {
            console.warn(`Attempted to set ${key} to ${numericVal}, which is an increase of ${delta}. Change exceeds limit, saving limit value.`);
            valueToSave = current + 50;
        }

        try {
            const encryptedValue = encryptValue(valueToSave);
            setCookie(STORAGE_KEYS[key], String(encryptedValue)); 
        } catch (error) {
            console.error(`Failed to encrypt ${key}, saving unencrypted:`, error);
            setCookie(STORAGE_KEYS[key], String(valueToSave)); 
        }
    }
}

// ---------------- ACHIEVEMENTS BITMAP ---------------- //
let isUpdatingAchievements = false;

function updateAchievementsBitmap() {
    if (!FEATURE_FLAGS.updateAchievementsBitmap) return false;

    if (isUpdatingAchievements) {
        console.warn('Skipping achievement update to avoid recursion.');
        return false;
    }

    isUpdatingAchievements = true;
    console.log('Updating achievements bitmap...');
    const stored = getValue('achievementsBitmap');
    const oldBitmapNum = Number.isFinite(Number(stored)) ? Number(stored) : 0;
    const oldBitmap = String(oldBitmapNum).padStart(5, '0');
    let newBitmap = '';
    const newAchievements = [];
    
    const categories = ['points','streak','correct','questions','perfection'];
    for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        const value = getValue(category);
        const maxTier = ACHIEVEMENTS[category].length;
        let tierUnlocked = 0;
        
        for (let j = 0; j < maxTier; j++) {
            if (value >= ACHIEVEMENTS[category][j].threshold) tierUnlocked = j + 1;
        }
        
        const oldTier = parseInt(oldBitmap[i]) || 0;
        if (tierUnlocked > oldTier) {
            const achievement = ACHIEVEMENTS[category][tierUnlocked - 1];
            newAchievements.push({
                id: `${category}_${tierUnlocked}`,
                icon: achievement.icon || '🏆',
                title: achievement.name,
                description: achievement.description
            });
        }
        
        newBitmap += tierUnlocked;
    }

    const newBitmapNum = Number.isFinite(Number(newBitmap)) ? Number(newBitmap) : 0;
    if (newBitmapNum !== oldBitmapNum) {
        setCookie(STORAGE_KEYS.achievementsBitmap, String(newBitmapNum));
    }
    
    isUpdatingAchievements = false;

    if (typeof addNewAchievement === 'function') {
        newAchievements.forEach(ach => {
            addNewAchievement(ach.id, ach.icon, ach.title, ach.description);
        });
    }
    
    return newAchievements.length > 0;
}

// ---------------- INITIALIZATION ---------------- //
function initializeAchievementSystem() {
    initializeLocalSecret();
    
    updateStats(); 
    if (typeof renderAchievements === 'function') {
        renderAchievements();
    }
}

// ---------------- RENDER FUNCTIONS ---------------- //
function updateStats() {
    if (!FEATURE_FLAGS.updateStats) return;

    const pointsElement = document.getElementById('points-display');
    const streakElement = document.getElementById('streak-display');
    const correctElement = document.getElementById('correct-display');
    const questionsElement = document.getElementById('questions-display');

    if (pointsElement) pointsElement.textContent = getValue('points').toLocaleString();
    if (streakElement) streakElement.textContent = getValue('streak');
    if (correctElement) correctElement.textContent = getValue('correct').toLocaleString();
    if (questionsElement) questionsElement.textContent = getValue('questions').toLocaleString();
    
    updateAchievementsBitmap(); 
}

function renderAchievements() {
    if (!FEATURE_FLAGS.renderAchievements) return;
    const container = document.getElementById('achievements-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    for (const category in ACHIEVEMENTS) {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category-section';
        const title = document.createElement('h2');
        title.className = 'category-title';
        title.textContent = CATEGORY_NAMES[category];
        categoryDiv.appendChild(title);

        const currentValue = getValue(category);

        ACHIEVEMENTS[category].forEach((achievement) => {
            const item = document.createElement('div');
            item.className = 'achievement-item';
            const unlocked = currentValue >= achievement.threshold;
            if (unlocked) item.classList.add('unlocked');

            const icon = document.createElement('div');
            icon.className = 'achievement-icon ' + (unlocked ? 'unlocked' : 'locked');
            icon.textContent = unlocked ? achievement.icon : '🔒';

            const content = document.createElement('div');
            content.className = 'achievement-content';
            
            const name = document.createElement('div');
            name.className = 'achievement-name ' + (unlocked ? 'unlocked' : 'locked');
            name.textContent = achievement.name;

            const threshold = document.createElement('div');
            threshold.className = 'achievement-threshold';
            threshold.textContent = `${achievement.threshold.toLocaleString()} ${category}`;

            const progressBar = document.createElement('div');
            progressBar.className = 'progress-bar';
            const progressFill = document.createElement('div');
            progressFill.className = 'progress-fill';
            const progress = Math.min(100, (currentValue / achievement.threshold) * 100);
            progressFill.style.width = `${progress}%`;
            progressBar.appendChild(progressFill);

            content.appendChild(name);
            content.appendChild(threshold);
            content.appendChild(progressBar);

            item.appendChild(icon);
            item.appendChild(content);
            categoryDiv.appendChild(item);
        });

        container.appendChild(categoryDiv);
    }
}

// ---------------- ACHIEVEMENT CHECK ---------------- //
function checkAchievementsAndUpdate() {
    if (!FEATURE_FLAGS.checkAchievementsAndUpdate) return false;
    updateStats(); 
    
    if (typeof renderAchievements === 'function') {
        renderAchievements();
    }
    
    return false;
}
const originalSetValueFunction = setValue; 

setValue = function(key, val) {
    originalSetValueFunction(key, val); 

    if (FEATURE_FLAGS.postSetCheck) {
        setTimeout(() => {
            checkAchievementsAndUpdate();
        }, 50);
    }
};

// ---------------- PERIODIC CHECK (Keep as is) ---------------- //
if (FEATURE_FLAGS.periodicCheck) {
    setInterval(() => {
        checkAchievementsAndUpdate();
    }, 15000);
}

// ---------------- RESET FUNCTION (Consolidated and Fixed) ---------------- //
function resetAllData() {
    console.log('Resetting all achievement data...');
    
    const cookiesToClear = [
        ...Object.values(STORAGE_KEYS),
        'ach_local_secret'
    ];
    
    cookiesToClear.forEach(cookieName => {
        deleteCookie(cookieName);
    });
    
    localSecret = null;
    initializeAchievementSystem();
    
    console.log('All achievement data cleared and re-initialized. Reloading page...');
    
    // alert('Achievement data has been reset! The page will now reload.');
    
    // window.location.reload(); 
}

// ---------------- KEYBOARD SEQUENCE DETECTOR (Keep as is) ---------------- //
let keySequence = '';
let sequenceTimeout;

function isInTextInput() {
    const activeElement = document.activeElement;
    const inputTypes = ['INPUT', 'TEXTAREA', 'SELECT'];
    const contentEditable = activeElement.contentEditable === 'true';
    
    return inputTypes.includes(activeElement.tagName) || contentEditable;
}

document.addEventListener('keydown', function(event) {
    if (isInTextInput()) {
        return;
    }
    
    clearTimeout(sequenceTimeout);
    
    keySequence += event.key;
    
    if (keySequence.length > 8) {
        keySequence = keySequence.slice(-8);
    }
    
    if (keySequence === 'Reset!!!') {
        console.log('Reset sequence detected!');
        keySequence = '';
        
        if (confirm('Are you sure you want to reset ALL achievement data? This cannot be undone!')) {
            resetAllData();
        }
        return;
    }
    
    sequenceTimeout = setTimeout(() => {
        keySequence = '';
    }, 2000);
});

console.log('Reset keyboard listener initialized. Type "Reset!!!" to clear achievement data.');


// ---------------- DOM READY (Finalized Corruption Check) ---------------- //
document.addEventListener('DOMContentLoaded', async () => {
    if (FEATURE_FLAGS.createParticles) createParticles();
    
    // IMPORTANT: initializeLocalSecret() is implicitly called by getValue() first time.

    // Check for corrupted data and reset if needed
    // NOTE: getValue() now returns -1 on decryption failure/corruption.
    const points = getValue('points');
    const streak = getValue('streak');
    const correct = getValue('correct');
    const questions = getValue('questions');
    
    // The check for < 0 now catches both genuinely negative values AND the -1 corruption signal!
    if (points < 0 || streak < 0 || correct < 0 || questions < 0 || 
        points > 1000000 || streak > 1000000 || correct > 1000000 || questions > 1000000) {
        console.warn('Detected corrupted data (value < 0 or > 1M), resetting...');
        resetAllData();
        return;
    }
    
    // Initializing the whole system if no corruption was found
    initializeAchievementSystem();
});

// ✅ Expose functions globally
window.addNewAchievement = typeof addNewAchievement !== 'undefined' ? addNewAchievement : () => {}; 
window.getValue = getValue;
window.setValue = setValue;
window.updateStatsDisplay = typeof updateStatsDisplay !== 'undefined' ? updateStatsDisplay : updateStats; 
window.resetAllData = resetAllData;