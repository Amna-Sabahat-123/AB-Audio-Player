var audioPlayer = document.getElementById("audio-player");
var playlist = document.getElementById("playlist");
var audio = new Audio();
audio.autoplay = false;
var currentSongIndex = 0;
var playPauseButton = document.getElementById("play-pause");
var toggleFXButton = document.getElementById("toggle-fx");
var seekBar = document.getElementById("seek-bar")
var isFXOn = true; // Track whether FX is on or off

function playPause() {
    if (audio.paused){
        // Check if the audio has been started
        if (audio.readyState === 0) {
            // Load and play after user interaction
            audio.load();
            audio.play();
        } else {
            // Start playback if the audio has already been loaded
            audio.play();
        }
        playPauseButton.innerHTML = '<i class="fas fa-pause"></i>'; // Pause icon
    } else {
        audio.pause();
        playPauseButton.innerHTML = '<i class="fas fa-play"></i>'; // Play icon
    }
}

function loadSong(index) {
    var song = playlist.children[index];
    var selectedSrc = isFXOn ? song.dataset.srcA : song.dataset.srcB;

    // Store the current time before switching
    var currentTimeBeforeSwitch = audio.currentTime;

    audio.src = selectedSrc;
    audio.load();
    audio.currentTime = 0;

    // Set the current time after switching
    audio.currentTime = currentTimeBeforeSwitch;

    // Start playing if it was playing before switching
    if (audio.paused) {
        audio.play();
    }

    for (var i = 0; i < playlist.children.length; i++) {
        playlist.children[i].classList.remove("playing");
    }
    song.classList.add("playing");
}

function updateTime() {
    var currentTimeElement = document.getElementById("current-time");
    var durationElement = document.getElementById("duration");

    currentTimeElement.textContent = formatTime(audio.currentTime);

    if (!isNaN(audio.duration)) {
        durationElement.textContent = formatTime(audio.duration);
    }
}

function formatTime(seconds) {
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = Math.floor(seconds % 60);
    return minutes + ":" + (remainingSeconds < 10 ? "0" : "") + remainingSeconds;
}

function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % playlist.children.length;
    loadSong(currentSongIndex);
    audio.currentTime = 0;
}
function updateProgressBar(){
    var progressFill = document.getElementById("progress-fill");
    var seekBar = document.getElementById("seek-bar");

    var value = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width =  "100%";
    seekBar.value = value;
}

audio.addEventListener("timeupdate", function () {
    updateTime();
    updateProgressBar();
});

playlist.addEventListener("click", function (event) {
    var clickedIndex = Array.from(playlist.children).indexOf(event.target);
    if (clickedIndex !== -1) {
        currentSongIndex = clickedIndex;
        loadSong(currentSongIndex);
        audio.currentTime = 0;
    }
});

function toggleFX() {
    isFXOn = !isFXOn; // Toggle FX status

    // Change button text based on FX status
    toggleFXButton.textContent = isFXOn ? "Turn FX ON" : "Turn FX OFF";

    // Load the current song with the updated FX status
    loadSong(currentSongIndex);
}

toggleFXButton.addEventListener("click", toggleFX);
playPauseButton.addEventListener("click", playPause);

seekBar.addEventListener("input", function () {
    audio.currentTime = (audio.duration / 100) * this.value;
});

// Load the first song initially
loadSong(currentSongIndex);

