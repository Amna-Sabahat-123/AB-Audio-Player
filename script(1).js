// audio.autoplay = false; // Disable autoplay
var audioPlayer = document.getElementById("audio-player");
var playlist = document.getElementById("playlist");
var audio = new Audio();
var currentSongIndex = 0;
var playPauseButton = document.getElementById("play-pause");
var pauseButton = document.getElementById("pause");
var seekBar = document.getElementById("seek-bar");
var progressFill = document.getElementById("progress-fill");
var selectLinkAButton = document.getElementById("select-link-a");
var selectLinkBButton = document.getElementById("select-link-b");
var currentButton = selectLinkAButton; // Set the default button to A

function playPause() {
    if (audio.paused) {
        audio.play();
        playPauseButton.innerHTML = '<i class="fas fa-pause"></i>'; // Pause icon
    } else {
        audio.pause();
        playPauseButton.innerHTML = '<i class="fas fa-play"></i>'; // Play icon
    }
}
function pause() {
    audio.pause();
    playPauseButton.innerHTML = '<i class="fas fa-play"></i>'; // Change play icon when paused
}

function loadSong(index) {
    var song = playlist.children[index];
    var selectedSrc = (currentButton === selectLinkAButton) ? song.dataset.srcA : song.dataset.srcB;
    audio.src = selectedSrc;
    audio.load();
    audio.play();

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
}

// audio.addEventListener("timeupdate", updateTime);
audio.addEventListener("timeupdate", function () {
    updateTime();
    updateProgressBar();
});
audio.addEventListener("ended", nextSong);

playlist.addEventListener("click", function (event) {
    var clickedIndex = Array.from(playlist.children).indexOf(event.target);
    if (clickedIndex !== -1) {
        currentSongIndex = clickedIndex;
        loadSong(currentSongIndex);
    }
});
function switchToLinkA() {
    currentButton = selectLinkAButton;
    loadSong(currentSongIndex);
    selectLinkAButton.classList.add("active");
        selectLinkBButton.classList.remove("active");
}

function switchToLinkB() {
    currentButton = selectLinkBButton;
    loadSong(currentSongIndex);
    selectLinkAButton.classList.remove("active");
        selectLinkBButton.classList.add("active");
}

// Add click event listeners for A and B buttons
selectLinkAButton.addEventListener("click", switchToLinkA);
selectLinkBButton.addEventListener("click", switchToLinkB);

// document.getElementById("play-pause").addEventListener("click", playPause);
// document.getElementById("pause").addEventListener("click", pause)
playPauseButton.addEventListener("click", playPause);
pauseButton.addEventListener("click", pause);
document.getElementById("seek-bar").addEventListener("input", function () {
    audio.currentTime = (audio.duration / 100) * this.value;
});

// Load the first song initially
loadSong(currentSongIndex);