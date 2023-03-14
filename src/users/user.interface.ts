interface UserObj {
  name: {
    firstName: string;
    lastName: string;
  };
  age: number;
  address?: {
    line1: string;
    line2: string;
    city: string;
    state: string;
  };
  additionInfo?: {
    [key: string]: any;
  };
}
