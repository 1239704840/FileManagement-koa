/*
 * @Author: your name
 * @Date: 2021-02-28 22:22:34
 * @LastEditTime: 2021-04-20 12:07:40
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \koa-quickstart\src\util\components\project.ts
 */

import { getManager } from 'typeorm';
import moment from 'moment'
import fs from 'fs'
import path from 'path'

import { ProjectCompetence } from '../../entity/projectCompetence'
import { Project } from '../../entity/project'
import { ProjectType } from '../../entity/projectType'
import { File } from '../../entity/file'
import { FileException } from '../../exceptions';

export default class ProjectUtil {
  // 根据日期获取项目
  public static async getProjectForDate(momentStar: number | undefined = undefined, momentEnd: number | undefined = undefined) {
    const projectRepository = getManager().getRepository(Project);
    const projectTypeRepository = getManager().getRepository(ProjectType);
    if (momentStar && momentEnd) {
      const projectList = await projectRepository
        .createQueryBuilder()
        .where("Project.createDate > :momentStar", { momentStar })
        .andWhere("Project.createDate < :momentEnd", { momentEnd })
        .getMany()

      let projectList2: any[] = [];
      //联合项目表
      for (let i = 0; i < projectList.length; i++) {
        let newEle: any = projectList[i]
        const typeId = projectList[i].type_id;
        const projectTypeRepository = getManager().getRepository(ProjectType)
        let typeInfoS = await projectTypeRepository
          .createQueryBuilder()
          .where({ id: typeId })
          .getMany()
        let typeInfo: string;
        typeInfoS.forEach(ele => {
          newEle['type_name'] = ele.type_name.toString()
        })
        projectList2.push(newEle)
      }
      return projectList2;
    }
    // const projectList = projectRepository.find()
    // return projectList

    const projectList = await projectRepository.find()
    let projectList2: any[] = [];
    //联合项目表
    for (let i = 0; i < projectList.length; i++) {
      let newEle: any = projectList[i]
      const typeId = projectList[i].type_id;
      const projectTypeRepository = getManager().getRepository(ProjectType)
      let typeInfoS = await projectTypeRepository
        .createQueryBuilder()
        .where({ id: typeId })
        .getMany()
      let typeInfo: string;
      typeInfoS.forEach(ele => {
        newEle['type_name'] = ele.type_name.toString()
      })
      projectList2.push(newEle)
    }
    return projectList2
  }

  // 获取当前用户有权限的项目列表
  public static async getProjetc(userId: number) {
    const projectCompetenceRepository = getManager().getRepository(ProjectCompetence)
    const projectRepository = getManager().getRepository(Project)

    const projectList = await projectCompetenceRepository
      .createQueryBuilder()
      .where({ user_id: userId })
      .getMany()

    let returnProjectList = []
    for (let i = 0; i < projectList.length; i++) {
      let project = await projectRepository.findOne(+projectList[i].project_id)
      if (project) {
        returnProjectList.push(project)
      }
    }

    return returnProjectList
  }

  // 通过项目id查询项目信息
  public static async selectOnlyProject(projectId: number) {
    const projectRepository = getManager().getRepository(Project);
    const projectMessage = await projectRepository.findOne(projectId)

    return projectMessage
  }

  // 添加项目
  public static async addProject(projectName: string, typeId: number, year: number, month: number) {
    const projectRepository = getManager().getRepository(Project)

    //const date = new Date().getTime();
    let time1 = new Date(year + '-' + month + '-01');
    const date = time1.getTime()
    // const year = +moment(date).format('YYYY')
    // const month = +moment(date).format('MM')

    const newProject = new Project();
    newProject.createDate = date;
    newProject.month = month;
    newProject.year = year;
    newProject.project_name = projectName;
    newProject.type_id = typeId;

    const project = await projectRepository.save(newProject)

    return project
  }

  // 删除项目
  public static async deleteProject(projectId: number) {
    const projectCompetenceRepository = getManager().getRepository(ProjectCompetence)
    const projectRepository = getManager().getRepository(Project)

    // 删除项目关系
    const comList = await projectCompetenceRepository
      .createQueryBuilder()
      .where({ project_id: projectId })
      .getMany()

    for (let i = 0; i < comList.length; i++) {
      await projectCompetenceRepository.delete(comList[i].id)
    }

    //TODO 删除项目文件

    await projectRepository.delete(projectId)

    return true
  }

  //重命名项目
  public static async renameProject(projectId: number, newName: string) {
    //重命名project表，file表中的savefile，重命名upload中的文件夹
    const projectRepository = getManager().getRepository(Project);
    const fileRepository = getManager().getRepository(File);
    const projectMessage = await this.selectOnlyProject(projectId);
    //更新表
    await projectRepository.update(projectId, { project_name: newName });
    await fileRepository.update({ project_id: projectId }, { save_file: newName });
    //更新 文件夹
    const projectPath = path.join(__dirname, '../../upload/');
    // 检查文件是否存在于当前目录中。
    fs.access(projectPath + projectMessage?.project_name, fs.constants.F_OK, async (err) => {
      console.log(`${projectPath} ${err ? '不存在' : '存在'}`);
      if (err) {
        fs.mkdir(projectPath + newName, async (err: any) => {
          if (err) {
            throw new FileException();
          }
        })
      } else {
        fs.rename(projectPath + projectMessage?.project_name, projectPath + newName, err => {
          if (err) {
            throw err
          }
        });
      }
    });
  }
}