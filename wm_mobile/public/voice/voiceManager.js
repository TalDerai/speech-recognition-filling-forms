class VoiceManager {
    constructor(win, cbData, cbFinal) {

        this.window = win
        //connection to socket
        this.socket = io.connect()

        //================= CONFIG =================
        // Stream Audio
        this.bufferSize = 2048
        this.AudioContext = null
        this.context = null
        this.processor = null
        this.input = null
        this.globalStream = null

        //vars
        this.audioElement = document.querySelector('audio')
        this.finalWord = false
        this.isRunning = false
        this.removeLastSentence = true
        //this.streamStreaming = false

        //audioStream constraints
        this.constraints = {
            audio: true,
            video: false,
        }

        //================= SOCKET IO =================
        let _this = this
        this.socket.on('connect', function (data) {
            console.log('connected to socket')
            _this.socket.emit('join', 'Server Connected to Client')
        })

        this.socket.on('messages', function (data) {
            console.log(data)
        })

        this.socket.on('speechData', function (data) {
            if (data && data.final) {
                console.log("Google Speech sent 'final' Sentence.");
                console.log('final:', data)
                cbFinal(data)
                //finalWord = true;
                _this.stopRecording()
            } else {
                //console.log('temp', data)
                cbData(data)
            }
        })
    }
    async initRecording() {
        this.socket.emit('startGoogleCloudStream', '') //init socket Google Speech Connection
        this.AudioContext = this.window.AudioContext || this.window.webkitAudioContext
        this.context = new this.AudioContext({
            // if Non-interactive, use 'playback' or 'balanced' 
            // https://developer.mozilla.org/en-US/docs/Web/API/AudioContextLatencyCategory
            latencyHint: 'interactive',
        })

        await this.context.audioWorklet.addModule('./voice/recorderWorkletProcessor.js')
        this.context.resume()

        this.globalStream = await navigator.mediaDevices.getUserMedia(this.constraints)
        this.input = this.context.createMediaStreamSource(this.globalStream)
        this.processor = new window.AudioWorkletNode(
            this.context,
            'recorder.worklet'
        )
        this.processor.connect(this.context.destination);
        this.context.resume()
        this.input.connect(this.processor)
        this.processor.port.onmessage = (e) => {
            const audioData = e.data;
            this.microphoneProcess(audioData)
        }
    }
    microphoneProcess(buffer) {
        this.socket.emit('binaryData', buffer);
    }
    startRecording() {
        this.isRunning = true
        this.initRecording()
    }
    stopRecording() {
        if (this.input) {
            this.isRunning = false

            try {
                this.socket.emit('endGoogleCloudStream', '')
                let track = this.globalStream.getTracks()[0]
                track.stop()

                this.input.disconnect(this.processor)
                this.processor.disconnect(this.context.destination)
                let _this = this
                this.context.close().then(function () {
                    _this.input = null
                    _this.processor = null
                    _this.context = null
                    _this.AudioContext = null
                })
            } catch (e) {
                // 
            }
        }
    }
}