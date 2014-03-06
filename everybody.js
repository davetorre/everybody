var context, // the audio context
    synth,   // synth object
    everybodyAudio = document.getElementById('everybodyAudio'),
    playButton = document.getElementById('playButton'),
    pauseButton = document.getElementById('pauseButton'),
    stopButton = document.getElementById('stopButton'),
    squareButton = document.getElementById('squareButton'),
    sawButton = document.getElementById('sawButton'),
    octaveButton = document.getElementById('octaveButton');

synth = {
    gainNode: null,
    filter: null,
    oscillator: null,
    oscType: 1,
    currentKeyCode: null,
    octave: 1,
    turnMeOn: function () {
        this.gainNode = context.createGain();
        this.gainNode.gain.value = 0.04;
        this.gainNode.connect(context.destination);
        this.filter = context.createBiquadFilter();
        this.filter.type = 0;  //lowpass filter
        this.filter.frequency.value = 8000;
        this.filter.connect(this.gainNode);
    },
    playNote: function (freq, delay) {
        this.oscillator = context.createOscillator();
        this.oscillator.type = this.oscType;
        if (this.oscType === 2) {
            this.gainNode.gain.value = 0.05;  //turn up the gain if sawtooth
        } else {
            this.gainNode.gain.value = 0.04;
        }
        this.oscillator.frequency.value = freq * this.octave;
        this.oscillator.connect(this.filter);
        this.oscillator.start(delay);
    },
    getFrequency: function (keyCode) {
        switch (keyCode) {
        case 65:
            return 233.082;
        case 83:
            return 246.942;
        case 68:
            return 277.183;
        case 70:
            return 311.127;
        case 71:
            return 329.628;
        case 72:
            return 369.994;
        case 74:
            return 415.305;
        case 75:
            return 466.164;
        case 76:
            return 493.883;
        case 186:
            return 554.365;
        case 222:
            return 622.254;
        default:
            return null;
        }
    },
    pressKey: function (keyCode) {
        // If you hold down a key, document.onkeydown gets called repeatedly
        // So if that happens, leave the function
        if (keyCode === this.currentKeyCode) {
            return;
        }
        var freq = this.getFrequency(keyCode);
        if (freq) {
            if (this.currentKeyCode) {
                // Turn off the current note if one exists
                this.oscillator.stop(0);
            }
            this.currentKeyCode = keyCode;
            this.playNote(freq, 0);
        }
    },
    liftKey: function (keyCode) {
        if (keyCode === this.currentKeyCode) {
            this.oscillator.stop(0);
            this.currentKeyCode = null;
        }
    }
};

everybodyAudio.oncanplaythrough = function () {
    document.getElementById('title').innerHTML = 'Everybody Wants You';
};

playButton.onclick = function () {
    everybodyAudio.play();
};

pauseButton.onclick = function () {
    everybodyAudio.pause();
};

stopButton.onclick = function () {
    everybodyAudio.pause();
    everybodyAudio.currentTime = 0;
};

window.onload = function () {
    try {
        context = new AudioContext();
    } catch (e) {
        alert("No web audio support in this browser :(");
        return;
    }

    synth.turnMeOn();

    document.onkeydown = function (event) {
        synth.pressKey(event.keyCode);
    };

    document.onkeyup = function (event) {
        synth.liftKey(event.keyCode);
    };

    squareButton.onclick = function () {
        if (synth.oscType === 2) {
            synth.oscType = 1;
            squareButton.style.background = '#FFFFFF';
            sawButton.style.background = '#5d5d5d';
        }
    };

    sawButton.onclick = function () {
        if (synth.oscType === 1) {
            synth.oscType = 2;
            sawButton.style.background = '#FFFFFF';
            squareButton.style.background = '#5d5d5d';
        }
    };

    octaveButton.onclick = function () {
        if (synth.octave === 1) {
            synth.octave = 2;
            octaveButton.style.background = '#FFFFFF';
        } else {
            synth.octave = 1;
            octaveButton.style.background = '#5d5d5d';
        }
    };
};