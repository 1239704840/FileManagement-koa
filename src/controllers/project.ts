/*
 * @Author: your name
 * @Date: 2021-02-28 22:22:33
 * @LastEditTime: 2021-04-20 13:00:54
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \koa-quickstart\src\controllers\project.ts
 */

import { Context } from 'koa';
import { getManager } from 'typeorm';
import { ProjectUtil, ProjectCompetenceUtil, FileUtil } from '../util/index';
import { NotFoundException, ForbiddenException } from '../exceptions';
import { Project } from '../entity/project';

export default class ProjectController {
  // 查项目
  public static async getProject(ctx: Context) {
    const momentStar = ctx.request.query.momentStar;
    const momentEnd = ctx.request.query.momentEnd;//非管理员不执行下面代码，但是不知道这里面为什么能读取typename
    if (ctx.state.user.isAdmin) {
      // ctx.status = 200,
      const projectList = await ProjectUtil.getProjectForDate(momentStar, momentEnd);
      // 为超级用户的查询添加项目下的用户
      let returnProjectList: any[] = [];
      for (let i = 0; i < projectList.length; i++) {
        let newEle: any = projectList[i]
        let userList = await ProjectCompetenceUtil.selectCompetenceForProject(projectList[i].id)
        let userIdList: string[] = []
        userList.forEach(ele => {
          userIdList.push(ele.id.toString())
        })
        newEle['userList'] = userIdList
        returnProjectList.push(newEle)
      }
      ctx.status = 200;
      ctx.body = returnProjectList;
      return
    }
    const userProjectList = await ProjectUtil.getProjetc(ctx.state.user.id);
    let projectList: Project[] = [];
    userProjectList.forEach(ele => {
      if (momentStar && momentEnd) {
        if (ele.createDate > momentStar && ele.createDate < momentEnd) {
          projectList.push(ele)
        }
      } else {
        projectList.push(ele)
      }
    })
    ctx.status = 200;
    ctx.body = projectList
  }

  //根据id查项目
  public static async selectOnlyProject(ctx: Context) {
    const project_id = ctx.request.body.projectId;
    //console.log(project_id)
    let projectMessage = await ProjectUtil.selectOnlyProject(project_id);
    if (projectMessage) {
      ctx.status = 200;
      ctx.body = projectMessage;
      return
    } else {
      ctx.status = 200;
      ctx.body = {
        message: '失败'
      }
    }
  }

  // 添加项目
  public static async addProject(ctx: Context) {
    if (!ctx.state.user.isAdmin) {
      throw new ForbiddenException()
    }
    const projectName = ctx.request.body.projectName;
    const typeId = ctx.request.body.typeId;
    const year = ctx.request.body.year;
    const month = ctx.request.body.month;

    let pro = await ProjectUtil.addProject(projectName, typeId, year, month);

    if (pro) {
      ctx.status = 200
      ctx.body = 'success'
    } else {
      ctx.status = 200
      ctx.body = {
        message: '失败'
      }
    }
  }

  // 为项目添加用户
  public static async addCompetence(ctx: Context) {
    if (!ctx.state.user.isAdmin) {
      throw new ForbiddenException()
    }

    const projectId = ctx.request.body.projectId
    const userId = ctx.request.body.userId
    let competence = true
    for (let i = 0; i < userId.length; i++) {
      let type = await ProjectCompetenceUtil.addCompetence(+projectId, +userId[i])
      if (!type) {
        competence = false
      }
    }
    if (competence) {
      ctx.status = 200
      ctx.body = 'success'
    } else {
      ctx.status = 200
      ctx.body = '有用户添加失败'
    }
  }

  // 为项目删除用户
  public static async deleteCompetence(ctx: Context) {
    if (!ctx.state.user.isAdmin) {
      throw new ForbiddenException()
    }

    const projectId = ctx.request.body.projectId
    const userId = ctx.request.body.userId
    let competence = true
    for (let i = 0; i < userId.length; i++) {
      let type = await ProjectCompetenceUtil.deleteCompetence(+projectId, +userId[i])
      if (!type) {
        competence = false
      }
    }
    if (competence) {
      ctx.status = 200
      ctx.body = 'success'
    } else {
      ctx.status = 200
      ctx.body = '有用户删除失败'
    }
  }

  public static async deleteProject(ctx: Context) {
    if (!ctx.state.user.isAdmin) {
      throw new ForbiddenException()
    }
    const projectId = ctx.request.body.projectId
    await ProjectUtil.deleteProject(projectId)

    ctx.status = 200
    ctx.body = 'success'
  }

  //重命名项目
  public static async renameProject(ctx: Context) {
    const projectId: number = ctx.request.body.projectId;
    const newName: string = ctx.request.body.newProjectName;
    let pro = await ProjectUtil.renameProject(projectId, newName);

      ctx.status = 200
      ctx.body = 'success'

  }
}