/*
 * @Author: your name
 * @Date: 2021-02-28 22:22:33
 * @LastEditTime: 2021-03-03 16:20:26
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \koa-quickstart\src\controllers\auth.ts
 */

import { Context } from 'koa';
import * as argon2 from 'argon2';
import { getManager } from 'typeorm';
import jwt from 'jsonwebtoken';

import { User } from '../entity/user';
import { JWT_SECRET } from '../constants';
import { UnauthorizedException, ForbiddenException } from '../exceptions';

import {ProjectUtil} from '../util'

export default class AuthController {
  public static async login(ctx: Context) {
    const userRepository = getManager().getRepository(User);

    const user = await userRepository
      .createQueryBuilder()
      .where({ username: ctx.request.body.username })
      .addSelect('User.password')
      .getOne();

    if (!user) {
      throw new UnauthorizedException('用户名不存在');
    } else if (await argon2.verify(user.password, ctx.request.body.password)) {
      ctx.status = 200;
      // 获取当前用户有权限的项目id列表
      const projectList = await ProjectUtil.getProjetc(user.id)
      // 鉴权： Authorization: Bearer <JWT_TOKEN>
      ctx.body = { token: jwt.sign({ id: user.id, isAdmin: user.admin, userProject: projectList }, JWT_SECRET), isAdmin: user.admin, user: user };
    } else {
      throw new UnauthorizedException('密码错误');
    }
  }

  public static async register(ctx: Context) {
    const userRepository = getManager().getRepository(User);

    const haveUser = await userRepository
      .createQueryBuilder()
      .where({username: ctx.request.body.username})
      .getOne()
    
    if (haveUser){
      throw new ForbiddenException('用户名已经存在')
    }else{
      const newUser = new User();
      newUser.name = ctx.request.body.name;
      newUser.username = ctx.request.body.username;
      newUser.password = await argon2.hash(ctx.request.body.password);

      // 保存到数据库
      const user = await userRepository.save(newUser);

      ctx.status = 200;
      ctx.body = 'success';
    }
  }

  public static async checkUsername(ctx: Context){
    const username:string = ctx.request.query.username

    const userRepository = getManager().getRepository(User);

    const haveUser = await userRepository
      .createQueryBuilder()
      .where({username: username})
      .getOne()
    
    if (haveUser){
      ctx.status = 200;
      ctx.body = 'repeat';
    }else{
      ctx.status = 200;
      ctx.body = 'success';
    }
  }
}
