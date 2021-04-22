/*
 * @Author: your name
 * @Date: 2021-02-28 22:22:34
 * @LastEditTime: 2021-03-25 13:02:48
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \koa-quickstart\src\entity\file.ts
 */
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class File {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    pid: number;
//if  isFolder为true，那么此file代表了文件夹
// if  pid为number，则代表其父倍id为pid，pid为0时则为第一级
    @Column()
    project_id: number;

    @Column()
    file_name: string;

    @Column()
    save_file: string;

    @Column('bigint')
    date: number;

    @Column()
    uploadUserId: number;

    @Column({default: () => false})
    isFolder: boolean;
}