/*
 * @Author: your name
 * @Date: 2021-03-09 10:56:24
 * @LastEditTime: 2021-03-22 17:30:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \koa-quickstart\src\util\components\projectType.ts
 */
import { getManager } from 'typeorm';

import { ProjectType } from '../../entity/projectType'

export default class ProjectTypeUtil {
    //添加项目类型
    public static async addProjectType(projectTypeName: string) {
        const projectTypeRepository=getManager().getRepository(ProjectType);

        const newProjectType=new ProjectType();
        newProjectType.type_name=projectTypeName;

        const projectType=await projectTypeRepository.save(newProjectType);
        return projectType;
    }

    //删除项目类型，与之相关的项目类型为？

    //列出所有typeid
    public static async listProjectType(){
        const projectTypeRepository=getManager().getRepository(ProjectType);
        const types = await projectTypeRepository.find();
        
        return types;
    }

    //根据id查找type
    public static async getTypeInfo(typeId:number){
        const projectTypeRepository = getManager().getRepository(ProjectType)
    
        const typeInfo = await projectTypeRepository.findOne(typeId)
    
        return typeInfo;
      }
}