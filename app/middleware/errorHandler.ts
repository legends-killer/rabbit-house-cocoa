export default () => {
  return async function errorHandler(ctx, next) {
    try {
      await next()
    } catch (err) {
      console.log('error handler get')
      // record log
      ctx.app.emit('error', err, ctx)

      const status = err.status || 500
      // filter 500 errors when env is prod
      const error = status === 500 && ctx.app.config.env === 'prod' ? 'Internal Server Error' : err.message

      // set common error message
      ctx.body = { error }
      console.log('!!!ERR!!!', err.code, err.message, err.status)

      if (status === 422) {
        ctx.body.code = 42200 // hack 422 error response
        ctx.status = status
        ctx.body.msg = 'failed'
        ctx.body.error = err.errors
      } else if (status !== undefined) {
        ctx.body.code = err.code
        ctx.body.msg = 'failed'
        ctx.status = status
      } else {
        ctx.status = 500
        ctx.body.code = 50000 // fallback
        ctx.body.msg = 'uncaught error'
      }
    }
  }
}
