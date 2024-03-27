const ffmpeg = require('fluent-ffmpeg')
const deepgramClient = require('./deepgram/deepgram-client')
const { LiveTranscriptionEvents } = require('@deepgram/sdk')

// Input RTMP stream URL
const inputUrl = 'rtmp://localhost:1935/live/test'

const deepgram = deepgramClient.listen.live({ model: 'nova-2', smart_format: true })

const extractAudioAndSendToDeepgram = () => {
  try {
    // Spawn ffmpeg process to extract audio
    const command = ffmpeg(inputUrl)
      .noVideo() // Ignore video data
      .format('mp3') // Specify audio format as raw PCM
      // .audioCodec('pcm_s16le') // Specify audio codec
      .audioFrequency(44100) // Specify audio frequency (sample rate)
      .on('start', () => {
        console.log('Extracting audio from stream...')
      })
      .on('end', () => {
        console.log('Audio extraction finished')
      })
      .on('error', err => {
        console.error('Error extracting audio:', err)
      })

    // Stream audio data to Deepgram for live transcription
    command.pipe().on('data', data => {
      // console.log('data :>> ', data);
      deepgram.on(LiveTranscriptionEvents.Open, () => {
        console.log('Connection Opened');
        deepgram.send(data);

        // SEND AUDIO DATA TO DEEPGRAM
        deepgram.on(LiveTranscriptionEvents.Transcript, transcribedData => {
          console.log(
            'final data result ->>>>>',
            transcribedData.channel.alternatives[0].transcript
          )
        })
        deepgram.on(LiveTranscriptionEvents.Error, err => {
          console.error("LiveTranscriptionEvents err", err)
        })
      })
      return deepgram;
    })
  } catch (error) {
    console.log('error from extractAudioAndSendToDeepgram', error)
  }
}

extractAudioAndSendToDeepgram()

// // Output file path (in case you want to save the audio to a file)
// const outputFile = 'output.mp3'

// // Spawn ffmpeg process to extract audio
// ffmpeg(inputUrl)
//   .output(outputFile)
//   .on('end', () => {
//     console.log('Audio extraction finished')
//   })
//   .on('error', err => {
//     console.error('Error extracting audio:', err)
//   })
//   .run()