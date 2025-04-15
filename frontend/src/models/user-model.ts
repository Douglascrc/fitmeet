type UserModel = {
  id?: number;
  name?: string;
  email?: string;
  cpf?: string;
  password?: string;
  avatar?: string;
  xp?: number;
  level?: number;
  achievements?: string[];
};

export default UserModel;
