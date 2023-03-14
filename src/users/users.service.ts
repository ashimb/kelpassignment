import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { readFileSync } from 'fs';
import { Repository } from 'typeorm';
import { Users } from './user.entity';

@Injectable()
export class UsersService {
  propertyName: any;
  userObjectArray: Users[] = [];
  constructor(@InjectRepository(Users) private usersRepo: Repository<Users>) {}

  getData() {
    this.csvToJson();
  }

  async getReport() {
    const query = await this.usersRepo
      .createQueryBuilder('user')
      .select('user.age, COUNT(user.age)', 'count')
      .groupBy('user.age')
      .getRawMany();

    console.log('query', query);
  }

  csvToJson() {
    const csvFileContent = readFileSync('./files/samplecsv1.csv', {
      encoding: 'utf-8',
    });
    const fileArr = csvFileContent.trim().split('\n');
    const headers = fileArr.shift().split(',');
    const resultArr = [];

    fileArr.forEach((row) => {
      const values = row.split(',');
      const obj = {};
      values.forEach((value, index) => {
        const keys = headers[index].split('.');
        let currentObj = obj;
        keys.forEach((key, i) => {
          if (i === keys.length - 1) {
            currentObj[key] = value;
          } else {
            currentObj[key] = currentObj[key] || {};
            currentObj = currentObj[key];
          }
        });
      });
      resultArr.push(obj);
    });

    const additionalInfoArr = this.addToAdditionalInfo(resultArr);
    this.saveUserData(resultArr, additionalInfoArr);
  }

  //seggregating other keys in an another object Array
  addToAdditionalInfo(resultArr: any) {
    const addInfoArr: any = [];
    resultArr.forEach((obj: string) => {
      let resNewObj = {};
      Object.keys(obj).forEach((key) => {
        const newObj = {};
        if (!(key == 'name' || key == 'age' || key == 'address')) {
          newObj[key] = obj[key];
          if (resNewObj.hasOwnProperty('additionalInfo')) {
            resNewObj['additionalInfo'][key] = newObj;
          } else {
            resNewObj = { additionalInfo: { ...newObj } };
          }
        }
      });
      addInfoArr.push(resNewObj);
    });
    return addInfoArr;
  }

  //Saving data to DB
  saveUserData(userArray: string[], additionalInfo: any) {
    userArray.forEach((element, index) => {
      const userObj = new Users();
      userObj.name =
        element['name']['firstName'] + ' ' + element['name']['LastName'];
      userObj.age = Number(element['age']);
      userObj.address = element['address'];
      userObj.additionalInfo = additionalInfo[index]['additionalInfo'];

      this.userObjectArray.push(userObj);
    });
    this.usersRepo.save(this.userObjectArray);
  }
}
