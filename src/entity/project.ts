/*
 * @Author: your name
 * @Date: 2021-02-28 22:22:34
 * @LastEditTime: 2021-03-09 10:50:59
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Editcm
 * @FilePath: \koa-quickstart\src\entity\project.ts
 */

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Project {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    project_name: string;

    @Column()
    year: number;

    @Column()
    month: number;

    @Column('bigint')
    createDate: number;

    @Column()
    type_id:number;
}