const Koa = require('koa');
const serve = require('koa-static');
const compress = require('koa-compress');
const applicaion = new Koa();
const port = process.env.PORT || 80;

applicaion.use(compress({
  threshold: 2048,
  flush: require('zlib').constants.Z_SYNC_FLUSH
}));
applicaion.use(serve('static'));

applicaion.listen(port, error => {
  if (error) {
    console.error(error);
    process.exit(1);
  }
  console.log(`Server is ready on ${port} port`);
});
