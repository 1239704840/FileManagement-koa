/*
 * @Author: your name
 * @Date: 2021-02-28 22:22:33
 * @LastEditTime: 2021-03-28 23:21:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \koa-quickstart\src\controllers\user.ts
 */

import { Context } from 'koa';
import { getManager } from 'typeorm';
import * as argon2 from 'argon2';

import { User } from '../entity/user';
import { ProjectCompetence } from '../entity/projectCompetence'
import { NotFoundException, ForbiddenException } from '../exceptions';

export default class UserController {
  // 获取用户列表
  public static async listUsers(ctx: Context) {
    if (ctx.state.user.isAdmin) {
      const userRepository = getManager().getRepository(User);
      const users = await userRepository.find();

      ctx.status = 200;
      ctx.body = users;
    }else{
      throw new ForbiddenException()
    }
  }

  // 获取单个用户详细信息  //仅限超级用户
  public static async showUserDetail(ctx: Context) {
    const userRepository = getManager().getRepository(User);
    let user = null
    if(ctx.state.user.isAdmin){
      user = await userRepository.findOne(+ctx.params.id);
    }else{
      // 非超级用户仅可以查自己
      user = await userRepository.findOne(ctx.state.user.id);
    }

    if (user) {
      ctx.status = 200;
      ctx.body = user;
    } else {
      throw new NotFoundException();
    }
  }
  //isAdmin的
  public static async showMyDetail(ctx:Context){
    const userRepository = getManager().getRepository(User);
    let user = null
    user=await userRepository.findOne(ctx.state.user.id);
    if (user) {
      ctx.status = 200;
      ctx.body = user;
    } else {
      throw new NotFoundException();
    }
  }

  // 更新用户密码
  public static async updateUserPassword(ctx: Context) {
    const userId = ctx.state.user.id

    const newPassword = await argon2.hash(ctx.request.body.password)

    const userRepository = getManager().getRepository(User);
    await userRepository.update(userId, {password: newPassword});
    const updatedUser = await userRepository.findOne(userId);

    if (updatedUser) {
      ctx.status = 200;
      ctx.body = updatedUser;
    } else {
      ctx.status = 404;
    }
  }

  // 删除信息
  public static async deleteUser(ctx: Context) {
    // 当前为超级用户
    let userId = null
    if(ctx.state.user.isAdmin){
      userId = +ctx.request.query.id
    }else {
      userId = +ctx.state.user.id
    }    

    const userRepository = getManager().getRepository(User);
    // 用户关系表
    const projectCompetenceRepository = getManager().getRepository(ProjectCompetence);
    await userRepository.delete(userId);

    // 删除用户的项目关系表
    const competence = await projectCompetenceRepository
      .createQueryBuilder()
      .where({user_id: userId})
      .getMany()

    for (let i=0; i<competence.length; i++){
      let competenceId = competence[i].id
      await projectCompetenceRepository.delete(competenceId)
    }

    ctx.status = 200;
    ctx.body = 'success';
  }

  
}
