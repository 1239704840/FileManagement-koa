/*
 * @Author: your name
 * @Date: 2021-02-28 22:22:34
 * @LastEditTime: 2021-03-03 16:21:33
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \koa-quickstart\src\entity\user.ts
 */

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ select: false })
  password: string;

  @Column()
  username: string;

  @Column({
    default: false
  })
  admin: boolean;
}
