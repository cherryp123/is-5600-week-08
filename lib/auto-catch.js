module.exports = function autoCatch(handlers) {
  const wrapped = {}
  Object.keys(handlers).forEach(k => {
    const fn = handlers[k]
    wrapped[k] = function (req, res, next) {
      Promise.resolve(fn(req, res, next)).catch(next)
    }
  })
  return wrapped
}
