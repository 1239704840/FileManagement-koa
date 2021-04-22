/*
 * @Author: your name
 * @Date: 2021-02-28 22:22:34
 * @LastEditTime: 2021-04-13 15:00:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \koa-quickstart\src\util\components\file.ts
 */

// 添加文件
// 删除文件
// 修改文件名 -- 次要
import { getManager } from 'typeorm';
import { File } from '../../entity/file'
import { Project } from '../../entity/project'
import { ProjectCompetence } from '../../entity/projectCompetence'
import fs from 'fs'
import path from 'path'
export default class FileUtil {
  // 添加文件
  public static async addFile(projectId: number, pid: number, fileName: string, saveFile: string, uploadUserId: number, isFolder: boolean) {
    console.log('添加文件')
    try {
      const fileRepository = getManager().getRepository(File);

      const newFile = new File();
      newFile.project_id = projectId;
      newFile.pid = pid;
      newFile.date = new Date().getTime();
      newFile.file_name = fileName;
      newFile.save_file = saveFile;
      newFile.uploadUserId = uploadUserId;
      newFile.isFolder = isFolder;

      const file = await fileRepository.save(newFile);

      return file

    } catch (error) {
      console.log('have some error')
      console.log(error)
      return error
    }
  }

  // 删除文件
  public static async deleteFile(fileId: number) {
    const fileRepository = getManager().getRepository(File);

    await fileRepository.delete(fileId)
  }

  // 查询某项目的全部文件
  public static async selectFile(projectId: number, pid: number, pageNum: number, pageSize: number) {
    const fileRepository = getManager().getRepository(File);

    const fileListSize = await fileRepository
      .createQueryBuilder()
      //.where({ project_id: projectId }).andWhere({ pid: pid })
      .where("project_id =:projectId AND pid =:pid", { projectId: projectId, pid: pid })
      .getCount()

    const fileList = await fileRepository
      .createQueryBuilder()
      //.where({ project_id: projectId }).andWhere({ pid: pid })
      .where("project_id =:projectId AND pid =:pid", { projectId: projectId, pid: pid })
      .skip((pageNum - 1) * pageSize)
      .take(pageSize)
      .getMany()

    return { fileList, fileListSize }
  }

  // 通过文件id查询文件信息
  public static async selectOnlyFile(fileId: number) {
    const fileRepository = getManager().getRepository(File);
    const fileMessage = await fileRepository.findOne(fileId)
    return fileMessage;
  }

  // 通过项目id查询此项目下的文件树
  public static async selectFileTree(projectId: number) {
    const fileRepository = getManager().getRepository(File);
    const fileTree = await fileRepository.createQueryBuilder().where({ project_id: projectId }).getMany()
    return fileTree;
  }

  //通过id查询其下的文件树，即pid为此id的，并循环，这是第一层
  public static async selectFileTreeByID(fileId: number, pageNum: number, pageSize: number) {
    const fileRepository = getManager().getRepository(File);
    const fileListSize = await fileRepository
      .createQueryBuilder()
      .where({ pid: fileId })
      .getCount()

    const fileList = await fileRepository
      .createQueryBuilder()
      .where({ pid: fileId })
      .skip((pageNum - 1) * pageSize)
      .take(pageSize)
      .getMany()

    return { fileList, fileListSize }

  }

  //查询文件夹是否存在
  public static async selectFileName(fileName: string, projectName: string) {
    const fileRepository = getManager().getRepository(File);
    const fileMessage = await fileRepository
      .createQueryBuilder()
      .where({ file_name: fileName, save_file: projectName })
      .getMany()

    if (fileMessage.length > 0) {
      return true
    } else {
      return false
    }
  }

  // 文件重命名
  public static async renameFile(fileId: number, newName: string) {
    const fileRepository = getManager().getRepository(File);
    const fileMessage = await this.selectOnlyFile(fileId)
    if (fileMessage?.isFolder === true) {
      //先检测是否有文件夹，没有就创建,然后修改文件夹

      await fileRepository.update(fileId, { file_name: newName });

    } else {
      let fileName: Array<string> | string | undefined = fileMessage?.file_name.split('.')
      if (fileName?.length) {
        fileName = fileName[fileName?.length - 1 || 0]
      }

      await fileRepository.update(fileId, { file_name: newName + '.' + fileName });

      const filePath = path.join(__dirname, '../../upload/' + fileMessage?.save_file);

      fs.rename(filePath + '/' + fileMessage?.file_name, filePath + '/' + newName + '.' + fileName, err => {
        if (err) {
          throw err
        }
      })
    }
  }

  // 移动文件
  public static async moveFile(fileId: number, projectId: number) {
    const fileRepository = getManager().getRepository(File);
    const fileMessage = await this.selectOnlyFile(fileId)
    // await fileRepository.update(fileId, {file_name: newName});
    const projectRepository = getManager().getRepository(Project);
    const projectMessage = await projectRepository.findOne(projectId);

    if (!fileMessage?.isFolder === true) {
      // 更新文件信息,这里只修改了当前文件夹的savefile，并未查询子树下面所有的类
      await fileRepository.update(fileId, { save_file: projectMessage?.project_name, project_id: projectId });

    } else {
      // 更新文件信息
      await fileRepository.update(fileId, { save_file: projectMessage?.project_name, project_id: projectId });

      // 移动文件
      const filePath = path.join(__dirname, '../../upload/' + fileMessage?.save_file);
      const newFilePath = path.join(__dirname, '../../upload/' + projectMessage?.project_name);

      fs.rename(filePath + '/' + fileMessage?.file_name, newFilePath + '/' + fileMessage?.file_name, err => {
        if (err) {
          throw err
        }
      })
    }
  }
}