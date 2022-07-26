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

  updateChanges() {
    fs.writeFile(dataJSONPath, JSON.stringify(this.DB), function (err) {
      if (err) return console.log(err);
    });
  }

  getDBProducts() {
    return new Promise((resolve) => 
      resolve(this.DB.products)
    );
  }

  getDBSkills() {
    return new Promise((resolve) => 
      resolve(this.DB.skills)
    );
  }

  updateDBSkill(params) {
    const { age, concerts, cities, years } = params;
    const skills = this.DB.skills;

    const updateSkill = (skill, skillId) => {
      skills.find(el => el.id === `${skillId}`).number = skill;
    };

    return new Promise((resolve) => {
  
      age && updateSkill(age, "age");
      concerts && updateSkill(concerts, "concerts");
      cities && updateSkill(cities, "cities");
      years && updateSkill(years, "years");

      this.updateChanges();

      resolve();
    })
  }

  addDBProduct(product) {
    return new Promise((resolve) => {
      this.DB.products.push(product);
      this.updateChanges();

      resolve(product);
    })
  }

  close() {
    this.DB = null;
  }
}


exports.Database = new Database()