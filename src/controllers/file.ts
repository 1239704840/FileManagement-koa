/*
 * @Author: your name
 * @Date: 2021-02-28 22:22:33
 * @LastEditTime: 2021-05-07 21:01:37
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \koa-quickstart\src\controllers\file.ts
 */

import { Context } from 'koa';
import fs from 'fs';
import path from 'path'
import { FileException, ForbiddenException } from '../exceptions';
import { FileUtil, ProjectUtil, UserUtil } from '../util'
import send from 'koa-send'
// import { getManager } from 'typeorm';
// import { ProjectUtil, ProjectCompetenceUtil } from '../util/index';
// import { NotFoundException, ForbiddenException } from '../exceptions';
// import { Project } from '../entity/project';
export default class FileController {
  //上传文件pid为0 的根目录
  public static async uploadFile(ctx: Context) {
    console.log(ctx.request.body)
    interface ProjectInfo {
      id: string
      project_name: string
      year: string
      month: string
      createDate: string
      'userList[]': string[]
      isFolder: boolean
      pid: string
    }
    //生成实体
    const projectInfo: ProjectInfo = ctx.request.body
    if (projectInfo.pid === undefined) {
      projectInfo.pid = "0";
    }
    if (projectInfo.isFolder === undefined) {
      projectInfo.isFolder = false;
    }

    const file: any = (ctx.request.files as any).file;
    // 读取文件流
    const fileReader = fs.createReadStream(file.path);

    const filePath = path.join(__dirname, '../upload/' + projectInfo.project_name);
    // 组装成绝对路径
    const fileResource = filePath + `/${file.name}`;

    const haveFile = await FileUtil.selectFileName(file.name, projectInfo.project_name)
    if (haveFile) {
      ctx.status = 500;
      ctx.body = {
        code: 0,
        message: '当前文件已存在'
      };
      return false;
    }
    // 判断 /static/upload 文件夹是否存在，如果不在的话就创建一个
    if (!fs.existsSync(filePath)) {

      // 利用promise对象解决fs.mkdir的异步问题，创建目录
      await new Promise((resolve, reject) => {
        fs.mkdir(filePath, async (err: any) => {
          if (err) {
            throw new FileException();
          } else {
            /*
            使用 createWriteStream 写入数据，然后使用管道流pipe拼接
            */
            const writeStream = fs.createWriteStream(fileResource);
            fileReader.pipe(writeStream);
            await FileUtil.addFile(+projectInfo.id, +projectInfo.pid, file.name, projectInfo.project_name, ctx.state.user.id, projectInfo.isFolder)
            ctx.status = 200;
            ctx.body = {
              code: 0,
              message: '上传成功'
            };
            resolve(true);
          }
        });
      })
    } else {
      /*
      使用 createWriteStream 写入数据，然后使用管道流pipe拼接
      */
      const writeStream = fs.createWriteStream(fileResource);
      fileReader.pipe(writeStream);
      await FileUtil.addFile(+projectInfo.id, +projectInfo.pid, file.name, projectInfo.project_name, ctx.state.user.id, projectInfo.isFolder)
      ctx.status = 200;
      ctx.body = {
        code: 0,
        message: '上传成功'
      };
    }
  }
  //上传pid存在的文件
  public static async uploadFile2(ctx: Context) {
    interface fileInfo {
      id: string
      pid: string
      project_id: string
      file_name: string
      save_file: string
      date: string
      uploadUserId: string
      isFolder: boolean
      username: string
    }

    //生成实体
    const fileInfo: fileInfo = ctx.request.body

    fileInfo.pid = fileInfo.id;
    fileInfo.isFolder = false;

    const file: any = (ctx.request.files as any).file;
    // 读取文件流
    const fileReader = fs.createReadStream(file.path);

    const filePath = path.join(__dirname, '../upload/' + fileInfo.save_file);
    // 组装成绝对路径
    const fileResource = filePath + `/${file.name}`;

    const haveFile = await FileUtil.selectFileName(file.name, fileInfo.file_name)
    if (haveFile) {
      ctx.status = 500;
      ctx.body = {
        code: 0,
        message: '当前文件已存在'
      };
      return false;
    }
    // 判断 /static/upload 文件夹是否存在，如果不在的话就创建一个
    if (!fs.existsSync(filePath)) {

      // 利用promise对象解决fs.mkdir的异步问题，创建目录
      await new Promise((resolve, reject) => {
        fs.mkdir(filePath, async (err: any) => {
          if (err) {
            throw new FileException();
          } else {
            /*
            使用 createWriteStream 写入数据，然后使用管道流pipe拼接
            */
            const writeStream = fs.createWriteStream(fileResource);
            fileReader.pipe(writeStream);
            await FileUtil.addFile(+fileInfo.project_id, +fileInfo.pid, file.name, fileInfo.save_file, ctx.state.user.id, fileInfo.isFolder)
            ctx.status = 200;
            ctx.body = {
              code: 0,
              message: '上传成功'
            };
            resolve(true);
          }
        });
      })
    } else {
      /*
      使用 createWriteStream 写入数据，然后使用管道流pipe拼接
      */
      const writeStream = fs.createWriteStream(fileResource);
      fileReader.pipe(writeStream);
      await FileUtil.addFile(+fileInfo.project_id, +fileInfo.pid, file.name, fileInfo.save_file, ctx.state.user.id, fileInfo.isFolder)
      ctx.status = 200;
      ctx.body = {
        code: 0,
        message: '上传成功'
      };
    }
  }
  //不上传文件，仅更新数据库,新建文件夹
  public static async uploadFolder(ctx: Context) {
    //console.log(ctx.request.body)
    // if (!ctx.state.user.isAdmin) {
    //   throw new ForbiddenException()
    // }
    const projectId = ctx.request.body.projectId;
    const pid = ctx.request.body.pid;
    const fileName = ctx.request.body.fileName;
    const saveFile = ctx.request.body.saveFile;
    const uploadUserId = ctx.request.body.uploadUserId;
    const isFolder = ctx.request.body.isFolder;

    let pro = await FileUtil.addFile(projectId, pid, fileName, saveFile, uploadUserId, isFolder);
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
  //上传文件树，上传文件夹
  public static async uploadFolder2(ctx: Context) {
    interface ProjectInfo {
      id: string
      project_name: string
      year: string
      month: string
      createDate: string
      'userList[]': string[]
      isFolder: boolean
      pid: string
    }

    //根据文件名区别
    const file: any = (ctx.request.files as any).file;
    // 读取文件流
    const fileReader = fs.createReadStream(file.path);
    let strs: string[] = file.name.split("/");
    for (var _i = 0; _i < strs.length; _i++) {
      //分割后前几部分判断是否有此文件夹，如果没有则在数据库里面创建
      if (_i < strs.length - 1) {
        //非最后一位则为文件夹，生成
        
      } else {//最后一位，为文件，则修改文件名并上传文件
        file.name = strs[_i];

      }
    }
    //生成实体
    const projectInfo: ProjectInfo = ctx.request.body
    if (projectInfo.pid === undefined) {
      projectInfo.pid = "0";
    }
    if (projectInfo.isFolder === undefined) {
      projectInfo.isFolder = false;
    }



    const filePath = path.join(__dirname, '../upload/' + projectInfo.project_name);
    // 组装成绝对路径
    const fileResource = filePath + `/${file.name}`;

    const haveFile = await FileUtil.selectFileName(file.name, projectInfo.project_name)
    if (haveFile) {
      ctx.status = 500;
      ctx.body = {
        code: 0,
        message: '当前文件已存在'
      };
      return false;
    }
    // 判断 /static/upload 文件夹是否存在，如果不在的话就创建一个
    if (!fs.existsSync(filePath)) {

      // 利用promise对象解决fs.mkdir的异步问题，创建目录
      await new Promise((resolve, reject) => {
        fs.mkdir(filePath, async (err: any) => {
          if (err) {
            throw new FileException();
          } else {
            /*
            使用 createWriteStream 写入数据，然后使用管道流pipe拼接
            */
            const writeStream = fs.createWriteStream(fileResource);
            fileReader.pipe(writeStream);
            await FileUtil.addFile(+projectInfo.id, +projectInfo.pid, file.name, projectInfo.project_name, ctx.state.user.id, projectInfo.isFolder)
            ctx.status = 200;
            ctx.body = {
              code: 0,
              message: '上传成功'
            };
            resolve(true);
          }
        });
      })
    } else {
      /*
      使用 createWriteStream 写入数据，然后使用管道流pipe拼接
      */
      const writeStream = fs.createWriteStream(fileResource);
      fileReader.pipe(writeStream);
      await FileUtil.addFile(+projectInfo.id, +projectInfo.pid, file.name, projectInfo.project_name, ctx.state.user.id, projectInfo.isFolder)
      ctx.status = 200;
      ctx.body = {
        code: 0,
        message: '上传成功'
      };
    }
  }

  public static async selectFile(ctx: Context) {
    const projectId: number = +ctx.request.body.projectId
    const pid: number = +ctx.request.body.pid
    const pageNum: number = +ctx.request.body.pageNum
    const pageSize: number = +ctx.request.body.pageSize
    interface LooseObject {
      [key: string]: any
    }
    const fileListObj: LooseObject = await FileUtil.selectFile(projectId, pid, pageNum, pageSize)

    for (let i = 0; i < fileListObj.fileList.length; i++) {
      const userInfo = await UserUtil.getUserInfo(fileListObj.fileList[i].uploadUserId)
      fileListObj.fileList[i]['username'] = userInfo?.name
    }

    ctx.status = 200;
    ctx.body = {
      code: 0,
      message: fileListObj
    }
  }

  //根据id查文件
  public static async selectOnlyFile(ctx: Context) {
    const file_id = ctx.request.body.fileId;
    let projectMessage = await FileUtil.selectOnlyFile(file_id);
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

  public static async selectFileTree(ctx: Context) {
    const projectId: number = +ctx.request.body.projectId;
    const fileTree = await FileUtil.selectFileTree(projectId);
    ctx.status = 200;
    ctx.body = {
      code: 0,
      message: fileTree
    }
  }

  public static async selectFileTreeByID(ctx: Context) {
    const fileId: number = +ctx.request.body.fileId;
    const pageNum: number = +ctx.request.body.pageNum
    const pageSize: number = +ctx.request.body.pageSize
    interface LooseObject {
      [key: string]: any
    }
    const fileTree: LooseObject = await FileUtil.selectFileTreeByID(fileId, pageNum, pageSize);

    for (let i = 0; i < fileTree.fileList.length; i++) {
      const userInfo = await UserUtil.getUserInfo(fileTree.fileList[i].uploadUserId)
      fileTree.fileList[i]['username'] = userInfo?.name
    }

    //树循环
    console.log(fileTree)
    ctx.status = 200;
    ctx.body = {
      code: 0,
      message: fileTree
    }
    if (!fileTree) {

    }
  }

  public static async deleteFile(ctx: Context) {
    console.log(ctx.request.body)
    const fileId: number = +ctx.request.body.FileId
    const projectName: string = ctx.request.body.projectName

    const fileMessage = await FileUtil.selectOnlyFile(fileId);
    if (fileMessage?.isFolder === true) {
      await FileUtil.deleteFile(fileId);
      ctx.status = 200;
      ctx.body = {
        code: 0,
        message: '文件删除成功'
      }
    } else {
      const filePath = path.join(__dirname, '../upload/' + projectName);
      // 组装成绝对路径
      const fileResource = filePath + `/${fileMessage?.file_name}`;

      await new Promise((resolve, reject) => {
        fs.unlink(fileResource, async function (error) {
          if (error) {
            console.log(error);
            ctx.status = 500;
            ctx.body = {
              code: 0,
              message: '文件删除失败'
            }
            resolve(true)
          } else {
            await FileUtil.deleteFile(fileId)
            ctx.status = 200;
            ctx.body = {
              code: 0,
              message: '文件删除成功'
            }
            resolve(true)
          }
        })
      })
    }
  }

  public static async downLoadFile(ctx: any) {
    // koa-send - https://www.npmjs.com/package/koa-send
    const fileId: number = +ctx.request.query.fileId

    const fileMessage = await FileUtil.selectOnlyFile(fileId)

    const fileResource = 'src/upload/' + fileMessage?.save_file + '/' + fileMessage?.file_name

    ctx.attachment(fileResource);
    await send(ctx, fileResource);
  }

  public static async renameFile(ctx: Context) {
    const fileId: number = ctx.request.body.FileId;
    const newFileName: string = ctx.request.body.newFileName;

    await FileUtil.renameFile(fileId, newFileName)

    ctx.status = 200;
    ctx.body = {
      code: 0,
      message: '修改成功'
    };
  }

  public static async moveFile(ctx: Context) {
    const fileId: number = ctx.request.body.FileId
    const projectId: number = ctx.request.body.ProjectId

    let projectMessage = await ProjectUtil.selectOnlyProject(fileId)
    console.log(projectId)
    console.log(projectMessage?.project_name)

    const filePath = path.join(__dirname, '../upload/' + projectMessage?.project_name);
    // 组装成绝对路径

    //添加判断此项目id是否存在文件名 1.根据id寻找路径2.根据路径判断是否存在，否则创建
    //await FileUtil.moveFile(fileId, projectId)

    if (!fs.existsSync(filePath)) {

      // 利用promise对象解决fs.mkdir的异步问题，创建目录
      await new Promise((resolve, reject) => {
        fs.mkdir(filePath, async (err: any) => {
          if (err) {
            throw new FileException();
          } else {
            await FileUtil.moveFile(fileId, projectId)
            ctx.status = 200;
            ctx.body = {
              code: 0,
              message: '上传成功'
            };
            resolve(true);
          }
        });
      })
    } else {
      await FileUtil.moveFile(fileId, projectId)
      ctx.status = 200;
      ctx.body = {
        code: 0,
        message: '上传成功'
      };
    }
  }
}
