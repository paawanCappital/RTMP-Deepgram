# Setting Up a Local RTMP Server for Testing

1. Open your command prompt and enter 'node-media-server' to start a local RTMP server. You can access it at http://localhost:8000/admin.

# Streaming Configuration

1. Configure your streaming platform (e.g.,OBS Studio) to stream video/audio to the local RTMP server:
    - In OBS Studio, navigate to Settings > Stream.
    - Set the service to 'rtmp://localhost:1935/live/' and enter 'test' as the Stream Key.
    - Begin streaming by using your microphone or playing a pre-recorded media source (e.g., an MP4 video).

# Repository Setup
1. In your repository:
    - Open the index.js file and replace 'rtmpUrl' with your RTMP URL. For a local server, it would be 'rtmp://localhost:1935/live/test'. Ensure this URL matches the one   configured in your streaming platform (e.g., OBS Studio).
    - Enter 'node index.js' in the command prompt to initiate live transcription.