const path = require('path');
const util = require('util');
const fs = require('fs');
const res = require('express/lib/response');

const dataJSONPath = path.join(__dirname, 'data.json');

class Database {
  constructor() {
    this.init();
  }

  async init() {
    const data = await fs.promises.readFile(dataJSONPath, 'utf8');

    this.DB = JSON.parse(data);
  }

  close() {
    this.DB = null;
  }

  getDBProducts() {
    return new Promise((resolve) => 
      resolve(this.DB.products)
    )
  }

  getDBSkills() {
    return new Promise((resolve) => 
      resolve(this.DB.skills)
    )
  }

  updateDBSkill(params) {
    const { age, concerts, cities, years } = params

    return new Promise((resolve) => {
      const skills = this.DB.skills;

      skills.find(el => el.id === 'age').number = age
      skills.find(el => el.id === 'concerts').number = concerts
      skills.find(el => el.id === 'cities').number = cities
      skills.find(el => el.id === 'years').number = years

      resolve()
    })
  }

  addDBProduct(product) {
    return new Promise((resolve) => {
      this.DB.products.push(product)

      resolve(product)
    })
  }
}

exports.Database = new Database()