import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { Users } from './user.entity';

@Injectable()
export class UsersRepository extends Repository<Users> {
  userObjectArray: Users[] = [];

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
    this.save(this.userObjectArray);
  }
}
