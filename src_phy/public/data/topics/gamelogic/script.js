// // Don't redeclare STORAGE_KEYS - it's already defined in achievements/script.js

function reportNuggetCompletion(jsonData) {
    try {
        console.log('reportNuggetCompletion called with data:', jsonData);
        const data = JSON.parse(jsonData);
        console.log('Nugget completed:', data);
        let { score, tries } = data;
        // Validate inputs to avoid NaN propagation
        score = Number(score) || 0;
        tries = Number(tries) || 1; // avoid div-by-zero and NaN
        
        // Calculate percentage
        const percentage = (score / tries) * 100;
        
        // Get current values using getValue function
        let points = getValue('points');
        let perfection = getValue('perfection');
        let streak = getValue('streak');
        let correct = getValue('correct');
        let questions = getValue('questions');
        const lastPlayedRaw = getValue('lastPlayed'); // Get the timestamp
        
        // Compute today's normalized timestamp (midnight start)
        const now = Date.now();
        const todayNormalized = new Date(new Date(now).getFullYear(), new Date(now).getMonth(), new Date(now).getDate()).getTime();
        
        // Handle points based on accuracy
        if (percentage > 95) {
            points += 50;
            perfection += 3;
        } else if (percentage > 75) {
            points += 30;
            perfection += 1;
        } else {
            points += 20; // Just completed, no %age
        }
        
        const ONE_DAY_MS = 1000 * 60 * 60 * 24;
        
        if (lastPlayedRaw < todayNormalized) {
            
            const yesterdayNormalized = todayNormalized - ONE_DAY_MS;

            if (lastPlayedRaw === yesterdayNormalized) {
                streak += 1;
            } else {
                streak = 1;
            }

            // Award points for the streak
            const streakPoints = Math.min(streak, 50); 
            points += streakPoints;
            
            setValue('lastPlayed', todayNormalized);
        } 

        // Update correct and questions
        correct += score;
        questions += tries;

        // Use setValue function to save all updated values (pass numbers, not strings)
        setValue('points', points);
        setValue('perfection', perfection);
        setValue('streak', streak);
        setValue('correct', correct);
        setValue('questions', questions);

        console.log(`Game completed: Score ${score}/${tries} (${percentage.toFixed(1)}%)`);
        console.log(`Updated stats - Points: ${points}, Perfection: ${perfection}, Streak: ${streak}, Correct: ${correct}, Questions: ${questions}`);
        
    } catch (error) {
        console.error('Error processing game completion:', error);
    }
    return 0;
}