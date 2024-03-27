const NodeMediaServer = require('node-media-server')

// RTMP server configuration
const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 60,
    ping_timeout: 30
  },
  http: {
    port: 8000,
    allow_origin: '*'
  }
}

// Create a NodeMediaServer instance
const nms = new NodeMediaServer(config)

// Start the RTMP server
nms.run()

nms.on('preConnect', (id, args) => {
  console.log(
    '[NodeEvent on preConnect]',
    `id=${id} args=${JSON.stringify(args)}`
  )
})

nms.on('postConnect', (id, args) => {
  console.log(
    '[NodeEvent on postConnect]',
    `id=${id} args=${JSON.stringify(args)}`
  )
})

nms.on('postPublish', (id, StreamPath, args) => {
  console.log(
    '[NodeEvent on postPublish]',
    `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`
  )
})
