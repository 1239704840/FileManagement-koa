/*
 * @Author: your name
 * @Date: 2021-02-28 22:22:34
 * @LastEditTime: 2021-03-03 16:21:56
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \koa-quickstart\src\util\components\projectCompetence.ts
 */

import { getManager } from 'typeorm';
import {ProjectCompetence} from '../../entity/projectCompetence'
import {RepeatException} from '../../exceptions'
import {User} from '../../entity/user'
import UserUtil from './user'
export default class ProjectCompetenceUtil {

  // 添加关系
  public static async addCompetence(projectId:number, userId:number){
    const projectCompetenceRepository = getManager().getRepository(ProjectCompetence);

    const haveCompetence = await projectCompetenceRepository
      .createQueryBuilder()
      .where({user_id: userId, project_id: projectId})
      .getMany();

    if(haveCompetence && haveCompetence.length > 0){
      throw new RepeatException()
    }
    
    const newCompetence = new ProjectCompetence();
    newCompetence.project_id = projectId;
    newCompetence.user_id = userId;
    const competence = await projectCompetenceRepository.save(newCompetence)
    return competence
  }

  // 删除关系
  public static async deleteCompetence(projectId: number, userId: number){
    const projectCompetenceRepository = getManager().getRepository(ProjectCompetence);
    
    const haveCompetence = await projectCompetenceRepository
      .createQueryBuilder()
      .where({user_id: userId, project_id: projectId})
      .getOne();
    if(haveCompetence && haveCompetence.id){
      await projectCompetenceRepository.delete(haveCompetence.id)
      return true
    }else{
      return false
    }
  }

  // 查询项目下的所有用户
  public static async selectCompetenceForProject(project_id: number){
    const projectCompetenceRepository = getManager().getRepository(ProjectCompetence);
    const competenceList = await projectCompetenceRepository
      .createQueryBuilder()
      .where({project_id: project_id})
      .getMany()
    
    const returnList:User[] = []
    for(let i=0; i<competenceList.length; i++){
      let user = await UserUtil.getUserInfo(competenceList[i].user_id)
      if(user){
        returnList.push(user)
      }
    }
    return returnList
  }
}