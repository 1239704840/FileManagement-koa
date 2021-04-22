/*
 * @Author: your name
 * @Date: 2021-02-28 22:22:33
 * @LastEditTime: 2021-03-12 10:46:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \koa-quickstart\src\controllers\test.ts
 */
import { Context } from 'koa';
import { getManager } from 'typeorm';
import { ProjectUtil, ProjectCompetenceUtil } from '../util/index';
import { NotFoundException, ForbiddenException } from '../exceptions';
import { Project } from '../entity/project';

export default class Test {
  public static async get (ctx: Context){
    const projectRepository = getManager().getRepository(Project);
    const projectList = await projectRepository.find()
    ctx.status = 200;
    ctx.body = ctx.request.query
  }

  public static async post (ctx: Context) {

  }
}