const category= require('../../models/category')

module.exports = {

addCategory: (categoryName) => {
    try{
        return new Promise(async (resolve, reject) => {
            let categories = new category({categoryName});
            await categories.save().then((result) => {
                resolve(result);
            })
        })              
    } catch(err){
        console.log('Error while adding category: ' + err);
    }         
},


getCategoryByName: async (name) => {
    try {
      const regex = new RegExp(`^${name}$`, 'i'); // Create a case-insensitive regex pattern
      return category.findOne({ categoryName: regex });
    } catch (err) {
      console.log('Error while getting category by name: ' + err);
    }
  },

  allCategory: () => {
    try{
        return new Promise(async (resolve, reject) => {
            let categories = await category.find().lean().exec();
            resolve (categories);
        })
    } catch(err){
        console.log('Error while fetching categories: ' + err);
    }
}
}