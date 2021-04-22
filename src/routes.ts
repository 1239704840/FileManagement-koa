/*
 * @Author: your name
 * @Date: 2021-02-28 22:22:33
 * @LastEditTime: 2021-04-19 11:26:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \koa-quickstart\src\routes.ts
 */

import Router from '@koa/router';

import AuthController from './controllers/auth';
import UserController from './controllers/user';
import ProjectController from './controllers/project';
import FileController from './controllers/file';
import ProjectTypeController from './controllers/projectType';

import Test from './controllers/test'

const unprotectedRouter = new Router();

// auth 相关的路由
unprotectedRouter.post('/auth/login', AuthController.login);
unprotectedRouter.post('/auth/register', AuthController.register);
unprotectedRouter.get('/auth/checkUsername', AuthController.checkUsername)

// test
unprotectedRouter.get('/auth/get', Test.get);
unprotectedRouter.post('/auth/post', Test.post);

const protectedRouter = new Router();

// users 相关的路由
protectedRouter.post('/auth/login', AuthController.login);
protectedRouter.post('/users', UserController.listUsers);
// protectedRouter.post('/users/detail', UserController.showMyDetail);
protectedRouter.post('/users/updateUserPassword', UserController.updateUserPassword);
protectedRouter.post('/users/deleteUser', UserController.deleteUser);

// project 相关
// 添加项目
protectedRouter.post('/project/addProject', ProjectController.addProject)
// 查项目
protectedRouter.get('/project/getProject', ProjectController.getProject)
protectedRouter.post('/project/selectOnlyProject',ProjectController.selectOnlyProject)
// 为项目添加用户
protectedRouter.post('/project/addCompetence', ProjectController.addCompetence)
protectedRouter.post('/project/deleteCompetence', ProjectController.deleteCompetence)
protectedRouter.post('/project/deleteProject', ProjectController.deleteProject)
protectedRouter.post('/project/renameProject', ProjectController.renameProject)

// file 相关
protectedRouter.post('/file/uploadFile', FileController.uploadFile)//新建文件
protectedRouter.post('/file/uploadFile2', FileController.uploadFile2)//新建文件
protectedRouter.post('/file/selectFiles', FileController.selectFile)
protectedRouter.post('/file/selectOnlyFile',FileController.selectOnlyFile)
protectedRouter.post('/file/deleteFile', FileController.deleteFile)
unprotectedRouter.get('/file/downloadFile', FileController.downLoadFile)
protectedRouter.post('/file/renameFile', FileController.renameFile)
protectedRouter.post('/file/moveFile', FileController.moveFile)
protectedRouter.post('/file/uploadFolder',FileController.uploadFolder)//新建文件夹
protectedRouter.post('/file/selectFileTree',FileController.selectFileTree)//查询文件树
protectedRouter.post('/file/selectFileTreeByID',FileController.selectFileTreeByID)//查询文件树

//projectType 相关
protectedRouter.post('/projectType/addProjectType',ProjectTypeController.addProjectType)
protectedRouter.post('/projectType',ProjectTypeController.listTypes)
protectedRouter.post('/projectType/getTypeInfo',ProjectTypeController.getTypeInfo)

//导出模块
export { protectedRouter, unprotectedRouter };
