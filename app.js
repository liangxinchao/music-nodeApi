const Koa = require('koa');
const koaStatic = require('koa-static');
const KoaBody = require('koa-body');
const path = require('path');
const cors = require('koa2-cors');
const config = require('./config/index.js');
const router = require('./routes/index.js');
const Tips = require('./util/tips.js');

const app = new Koa();

// 跨域配置
app.use(cors({ origin: '*' }));

// 托管静态文件
app.use(koaStatic(path.resolve(__dirname, 'static')));

// 处理 post 请求
app.use(KoaBody({ multipart: true }));

// 参数校验
app.use(async (ctx, next) => {
    if (/(detail|lyric)/.test(ctx.url)) {
        if (!ctx.query.id) {
            ctx.body = Tips[1001];
            return;
        }
    }
    await next();
});

// 调用路由中间件
app.use(router.routes());
app.use(router.allowedMethods());

// 端口
const PORT = config.PORT;

// 启动服务
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
