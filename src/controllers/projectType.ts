/*
 * @Author: your name
 * @Date: 2021-03-09 11:16:48
 * @LastEditTime: 2021-04-20 12:10:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \koa-quickstart\src\controllers\projectType.TS
 */
import { Context } from 'koa';
import { ProjectTypeUtil } from '../util/index';
import { NotFoundException, ForbiddenException } from '../exceptions';
import { ProjectType } from '../entity/projectType';

export default class ProjectTypeController {
    //添加项目类型
    public static async addProjectType(ctx: Context) {
        if (!ctx.state.user.isAdmin) {
            throw new ForbiddenException()
        }
        const projectTypeName = ctx.request.body.projectTypeName;

        let pro = await ProjectTypeUtil.addProjectType(projectTypeName)
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

    //查找所有项目类型
    public static async listTypes(ctx: Context) {
        // if (ctx.state.user.isAdmin) {
            let types = await ProjectTypeUtil.listProjectType();
            ctx.status = 200;
            ctx.body = types;
        // } else {
        //     throw new ForbiddenException();
        // }
    }

    //根据id 查找项目类型
    public static async getTypeInfo(ctx:Context){
        const typeId=ctx.request.body.typeId;
        // if(ctx.state.user.isAdmin){
            let type_name=await ProjectTypeUtil.getTypeInfo(typeId);
            ctx.status=200;
            ctx.body=type_name;
        // }else{
        //     throw new ForbiddenException();
        // }

    }
    
}