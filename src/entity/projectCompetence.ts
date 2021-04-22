/*
 * @Author: your name
 * @Date: 2021-02-28 22:22:34
 * @LastEditTime: 2021-03-03 16:21:21
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \koa-quickstart\src\entity\projectCompetence.ts
 */
/*

 * @Description: 用户权限表
 */

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProjectCompetence {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_id: number;

    @Column()
    project_id: number
}