const { LiveTranscriptionEvents } = require('@deepgram/sdk')
const dotenv = require('dotenv')
const ffmpeg = require('fluent-ffmpeg')
const deepgramClient = require('./deepgram/deepgram-client')

dotenv.config();

const rtmpUrl = 'rtmp://localhost:1935/live/test';

const live = async () => {
  const connection = deepgramClient.listen.live({ model: 'nova-2', language: 'en-US', smart_format: true })

  connection.on(LiveTranscriptionEvents.Open, () => {
    connection.on(LiveTranscriptionEvents.Close, () => {
      console.log('Connection closed.')
    })

    connection.on(LiveTranscriptionEvents.Transcript, data => {
      console.log(data.channel.alternatives[0].transcript)
    })

    connection.on(LiveTranscriptionEvents.Metadata, data => {
      console.log(data)
    })

    connection.on(LiveTranscriptionEvents.Error, err => {
      console.error(err)
    })

    const command = ffmpeg(rtmpUrl)
      .format('mp3')
      .audioCodec('libmp3lame')
      .on('error', err => {
        console.error('An error occurred: ', err.message);
      })
      .on('end', () => {
        console.log('Conversion complete.');
      })
      .pipe();

    // Stream converted audio data to another service
    command.on('data', chunk => {
      connection.send(chunk)
    });
  })
}

live();
