const users = [];

export default {
  findOne(query) {
    return users.find((u) => u.email === query.email) || null;
  },

  async create(data) {
    const newUser = {
      _id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: data.name,
      email: data.email,
      password: data.password,
      createdAt: new Date(),
    };
    users.push(newUser);
    return newUser;
  },
};
