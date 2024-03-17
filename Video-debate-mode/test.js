async function runTimer() {
    await startTimer(30);
    console.log("5 seconds gap");
    await delay(5000); // Wait for 5 seconds
    await startTimer(30);
    console.log("5 seconds gap");
    await delay(5000); // Wait for 5 seconds
    await startTimer(120);
}

async function startTimer(totalSeconds) {
    let remainingTime = totalSeconds;

    while (remainingTime >= 0) {
        console.log(formatTime(remainingTime));
        await delay(1000); // Wait for 1 second
        remainingTime--;
    }
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Start the timer
runTimer();
