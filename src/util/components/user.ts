/*
 * @Author: your name
 * @Date: 2021-02-28 22:22:34
 * @LastEditTime: 2021-03-03 16:22:03
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \koa-quickstart\src\util\components\user.ts
 */

import { getManager } from 'typeorm';
import {User} from '../../entity/user'
export default class UserUtil {
  public static async getUserInfo(userId:number){
    const userRepository = getManager().getRepository(User)

    const userInfo = await userRepository.findOne(userId)

    return userInfo
  }
}