// Imports the Google Cloud client library
import speech from '@google-cloud/speech'
import fs from 'fs'

export const fileToStt = async (filename) => {
    // Creates a client
    var dirname = process.cwd()
    const configFile = `${dirname}\\plucky-order-381607-0c91d47b7f16.json`
    const cnf = { projectId: 'plucky-order-381607', keyFilename:configFile}
    const client = new speech.SpeechClient(cnf)

    const config = {
        encoding: 'LINEAR16', //encoding,
        sampleRateHertz: 48000, //sampleRateHertz,
        languageCode: 'iw-IL', // languageCode,
    }

    /**
     * Note that transcription is limited to 60 seconds audio.
     * Use a GCS file for audio longer than 1 minute.
     */
    const audio = {
        content: fs.readFileSync(filename).toString('base64'),
    }
    //console.log(3,(new Date()).getTime())
    const request = {
        config: config,
        audio: audio,
    }

    // Detects speech in the audio file. This creates a recognition job that you
    // can wait for now, or get its result later.
    //const [operation] = await client.longRunningRecognize(request)  // long proccessing
    const [response] = await client.recognize(request);

    // Get a Promise representation of the final result of the job
    //const [response] = await operation.promise(); // for longRunningRecognize
    const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n')
    return transcription    
}