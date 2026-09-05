const audio = document.querySelector('audio');
const playBtn = document.getElementById('play');
const progressBar = document.getElementById('progress');
const durationSpan = document.getElementById('duration');
const changePbRate = document.getElementById('changePbRate');
const changeVolume = document.getElementById('changeVolume');
const enableLoop = document.getElementById('enableLoop');
const keepPitch = document.getElementById('preservePitch');
const matchToPbRate = document.getElementById('matchToPbRate');
const optionsBtn = document.getElementById('openOptions');
const dropZone = document.querySelector('.drop-zone');
const options = document.querySelector('.settings');
const errorContainer = document.querySelector('.error-container');
const filenameDisplay = document.querySelector('.file-name');
const fileInput = document.querySelector('.file');
let includePbRate = false;

changePbRate.addEventListener('input', (e) => {
  changeAudioPbRate(e.target.value);
});

changeVolume.addEventListener('input', (e) => {
  changeAudioVolume(e.target.value);
});

optionsBtn.addEventListener('click', () => {
  options.classList.toggle('show');
});

enableLoop.addEventListener('change', (e) => {
  audio.loop = e.target.checked;
});

keepPitch.addEventListener('change', (e) => {
  audio.preservesPitch = e.target.checked;
});

matchToPbRate.addEventListener('change', (e) => {
  includePbRate = e.target.checked;
  updateTime();
});

dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
});

dropZone.addEventListener('click', () => {
  fileInput.click();
});

dropZone.addEventListener('change', (e) => {
  const file = e.target.files[0];
  handleAudio(file);
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();

  const files = e.dataTransfer.files;
  if (files.length > 0) {
    handleAudio(files[0]);
    errorContainer.textContent = '';
    errorContainer.classList.remove('show');
    console.log(`recieved ${files.length} file:`, files);
  }
});

function dropHandler(e) {
  e.preventDefault();
}

function handleAudio(file) {
  if (file && file.type.startsWith('audio/')) {
    const fileURL = URL.createObjectURL(file);
    audio.src = fileURL;
    if (filenameDisplay) {
      filenameDisplay.textContent = file.name;
      document.title = `Audio Player - ${file.name}`;
    }
  } else {
    errorContainer.classList.add('show');
    errorContainer.textContent = 'Please select a valid audio file like .mp3, .wav, or .ogg';
  }
}

function changeAudioPbRate(pbRate) {
  if (pbRate === '' || pbRate.endsWith('.')) {
    errorContainer.classList.remove('show');
    return; 
  }
  const parsedRate = parseFloat(pbRate);
  errorContainer.classList.remove('show');
  if (isNaN(parsedRate)) {
    errorContainer.classList.remove('show');
    return;
  }
  if (parsedRate < 0.1) {
    void errorContainer.offsetWidth;
    errorContainer.classList.add('show');
    errorContainer.textContent = 'Too low. Minimum is 0.1';
    return;
  }
  if (parsedRate > 4) {
    void errorContainer.offsetWidth;
    errorContainer.classList.add('show');
    errorContainer.textContent = 'Too high. Maximum is 4';
    return;
  }
  errorContainer.textContent = '';
  audio.playbackRate = parsedRate;
  updateTime();
}

function changeAudioVolume(vol) {
  if (vol === '' || vol.endsWith('.')) {
    errorContainer.classList.remove('show');
    return;
  }
  const parsedVol = parseFloat(vol);
  errorContainer.classList.remove('show');
  if (isNaN(parsedVol)) {
    errorContainer.classList.remove('show');
    return;
  }
  if (parsedVol < 0) {
    void errorContainer.offsetWidth;
    errorContainer.classList.add('show');
    errorContainer.textContent = 'Volume cannot be below 0';
    return;
  }
  if (parsedVol > 1) {
    void errorContainer.offsetWidth;
    errorContainer.classList.add('show');
    errorContainer.textContent = 'Volume cannot be above 1';
    return;
  }
  errorContainer.textContent = '';
  audio.volume = parsedVol;
}

function togglePlay() {
  if (!audio.src || audio.src === window.location.href) {
    void errorContainer.offsetWidth;
    errorContainer.classList.add('show');
    errorContainer.textContent = 'Please select an audio file.';
    return;
  }

  if (audio.paused) {
    audio.play();
    playBtn.textContent = 'Pause';
  } else {
    audio.pause();
    playBtn.textContent = 'Play';
  }
  errorContainer.classList.remove('show');
  errorContainer.textContent = '';
}

playBtn.addEventListener('click', togglePlay);

function formatTime(time) {
  const mins = Math.floor(time / 60);
  const secs = Math.floor(time % 60);

  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function updateTime() {
  const currentSecs = includePbRate ? (audio.currentTime / audio.playbackRate) : audio.currentTime;
  const totalSecs = includePbRate ? ((audio.duration || 0) / audio.playbackRate) : (audio.duration || 0);

  const current = formatTime(currentSecs);
  const total = formatTime(totalSecs);

  durationSpan.textContent = `${current} / ${total}`;
}

audio.addEventListener('loadedmetadata', updateTime);

audio.addEventListener('timeupdate', updateTime);

audio.addEventListener('loadedmetadata', () => {
  progressBar.max = audio.duration;
});

audio.addEventListener('timeupdate', () => {
  if (!audio.duration) return;
  progressBar.value = audio.currentTime;
});

progressBar.addEventListener('input', () => {
  if (!audio.duration) return;
  audio.currentTime = progressBar.value;
});

progressBar.addEventListener('keydown', (e) => {
  if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
    e.preventDefault();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    togglePlay();
  } else if (e.code === 'ArrowLeft') {
    audio.currentTime = Math.max((audio.currentTime - 5), 0);
  } else if (e.code === 'ArrowRight') {
    audio.currentTime = Math.min((audio.currentTime + 5), audio.duration);
  }
});