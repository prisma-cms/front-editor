import express from 'express'
import next from 'next'
import { createProxyMiddleware } from 'http-proxy-middleware'
import { endpoint } from './config'

const port = (process.env.PORT && parseInt(process.env.PORT, 10)) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const createProxy = (props: any) => {
  return createProxyMiddleware({
    target: endpoint,
    changeOrigin: true,
    onError: (err, _req, res) => {
      console.error('apiPropxy onError err', err)

      try {
        res.writeHead(500, {
          'Content-Type': 'text/plain',
        })
      } catch (error) {
        console.error(error)
      }

      res.end(
        'Something went wrong. And we are reporting a custom error message.'
      )
    },
    ...props,
  })
}

const apiProxy = createProxy({
  ws: true,
  pathRewrite: {
    '^/api(/|$)': '/',
  },
})

app.prepare().then(() => {
  const server = express()

  server.use(
    '/images/',
    createProxy({
      pathRewrite: {
        '^/images/resized/([^/]+)/uploads/(.+)': '/images/$1/$2',
        '^/images/resized/([^/]+)/(.+)': '/images/$1/$2',
        '^/images/([^/]+)/uploads/(.+)': '/images/$1/$2',
      },
    })
  )

  server.use('/api/', apiProxy)

  server.all('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, (err?: Error) => {
    if (err) throw err
    // eslint-disable-next-line no-console
    console.info(`> Ready on http://localhost:${port}`)
  })
})
