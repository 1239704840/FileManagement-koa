/*
 * @Author: your name
 * @Date: 2021-02-28 22:22:33
 * @LastEditTime: 2021-03-03 16:22:29
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \koa-quickstart\src\server.ts
 */

import Koa from 'koa';
import cors from '@koa/cors';
import koaBody from 'koa-body'
// import bodyParser from 'koa-bodyparser';
import { createConnection } from 'typeorm';
import jwt from 'koa-jwt';
import 'reflect-metadata';

import { protectedRouter, unprotectedRouter } from './routes';
import { logger } from './logger';
import { JWT_SECRET } from './constants';

createConnection()
  .then(() => {
    // 初始化 Koa 应用实例
    const app = new Koa();

    // 注册中间件
    app.use(logger());
    app.use(cors());
    // app.use(bodyParser());
    app.use(koaBody({
      multipart: true,
      formidable: {
        maxFileSize: 1024**1024*1024    // 设置上传文件大小最大限制，默认2M
      }
    }));

    app.use(async (ctx, next) => {
      try {
        await next();
      } catch (err) {
        // 只返回 JSON 格式的响应
        ctx.status = err.status || 500;
        ctx.body = { message: err.message };
      }
    });

    // 无需 JWT Token 即可访问
    app.use(unprotectedRouter.routes()).use(unprotectedRouter.allowedMethods());

    // 注册 JWT 中间件
    app.use(jwt({ secret: JWT_SECRET }));

    // 需要 JWT Token 才可访问
    app.use(protectedRouter.routes()).use(protectedRouter.allowedMethods());

    // 运行服务器
    app.listen(3000);
  })
  .catch((err: string) => console.log('TypeORM connection error:', err));
