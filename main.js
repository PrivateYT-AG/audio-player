const audio = document.querySelector('audio');
const playBtn = document.getElementById('play');
const progressBar = document.getElementById('progress');
const durationSpan = document.getElementById('duration');
const changeSpeed = document.getElementById('changePbRate');
const changeVolume = document.getElementById('changeVolume');
const enableLoop = document.getElementById('enableLoop');
const keepPitch = document.getElementById('preservePitch');
const matchToSpeed = document.getElementById('matchToPbRate');
const optionsBtn = document.getElementById('openOptions');
const dropZone = document.querySelector('.drop-zone');
const options = document.querySelector('.settings');
const errorContainer = document.querySelector('.error-container');
const diVol = document.querySelector('.di-vol');
const diSpeed = document.querySelector('.di-pbrate');
const filenameDisplay = document.querySelector('.file-name');
const fileInput = document.querySelector('.file');
const SPEED_VOLUME_CHANGE = '0.05';
const SPEED_VOLUME_CHANGE_PRECISE = '0.01';
let includeSpeed = false;

changeSpeed.addEventListener('input', () => {
  const value = parseFloat(changeSpeed.value);
  audio.playbackRate = value;
  diSpeed.textContent = `${value.toFixed(2)}x`;
});

changeSpeed.addEventListener('keydown', (e) => {
  if (e.shiftKey) {
    changeSpeed.step = SPEED_VOLUME_CHANGE_PRECISE;
  }
});

changeSpeed.addEventListener('keyup', (e) => {
  if (!e.shiftKey) {
    changeSpeed.step = SPEED_VOLUME_CHANGE;
  }
});

changeVolume.addEventListener('input', () => {
  const value = parseFloat(changeVolume.value);
  audio.volume = value;
  diVol.textContent = `${Math.round(value * 100)}%`;
});

changeVolume.addEventListener('keydown', (e) => {
  if (e.shiftKey) {
    changeVolume.step = SPEED_VOLUME_CHANGE_PRECISE;
  }
});

changeVolume.addEventListener('keyup', (e) => {
  if (!e.shiftKey) {
    changeVolume.step = SPEED_VOLUME_CHANGE;
  }
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

matchToSpeed.addEventListener('change', (e) => {
  includeSpeed = e.target.checked;
  updateTime();
});

dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
});

dropZone.addEventListener('click', () => {
  fileInput.click();
});

dropZone.addEventListener('keydown', (e) => {
  if (e.code === 'Enter') {
    e.preventDefault();
    e.target.click();
  }
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
      document.title = `${file.name} - Audio Player`;
    }
  } else {
    errorContainer.classList.add('show');
    errorContainer.textContent = 'Please select a valid audio file like .mp3, .wav, or .ogg';
  }
}

function togglePlay() {
  if (!audio.src || audio.src === window.location.href) {
    void errorContainer.offsetWidth;
    errorContainer.classList.add('show');
    errorContainer.textContent = 'Please select an audio file.';
    return;
  }
  audio.addEventListener('play', () => {
    playBtn.textContent = 'Pause';
  });
  
  audio.addEventListener('pause', () => {
    playBtn.textContent = 'Play';
  });
  
  audio.addEventListener('ended', () => {
    playBtn.textContent = 'Play';
  });
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
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
  const currentSecs = includeSpeed ? (audio.currentTime / audio.playbackRate) : audio.currentTime;
  const totalSecs = includeSpeed ? ((audio.duration || 0) / audio.playbackRate) : (audio.duration || 0);

  const current = formatTime(currentSecs);
  const total = formatTime(totalSecs);

  durationSpan.textContent = `${current} / ${total}`;
}

audio.addEventListener('loadedmetadata', updateTime);

audio.addEventListener('timeupdate', updateTime);

audio.addEventListener('loadedmetadata', () => {
  audio.playbackRate = changeSpeed.value;
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
  if (e.code === 'ArrowLeft' || e.code === 'ArrowRight' || e.code === 'ArrowUp' || e.code === 'ArrowDown') {
    e.preventDefault();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    const isKeyboardClickable = e.target.matches('input[type=checkbox], button');
    if (!isKeyboardClickable) {
      e.preventDefault();
      togglePlay();
    }
  } else if (e.code === 'ArrowLeft') {
    audio.currentTime = Math.max((audio.currentTime - 5 * audio.playbackRate), 0);
  } else if (e.code === 'ArrowRight') {
    audio.currentTime = Math.min((audio.currentTime + 5 * audio.playbackRate), audio.duration);
  }
});