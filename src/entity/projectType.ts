/*
 * @Author: your name
 * @Date: 2021-03-09 10:45:53
 * @LastEditTime: 2021-03-09 10:48:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \koa-quickstart\src\entity\projectType.ts
 */
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProjectType {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    type_name: string;
}