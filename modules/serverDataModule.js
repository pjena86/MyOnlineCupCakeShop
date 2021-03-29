const fs = require("fs");

let cupcakes = [];


module.exports.initialize = function () {
    return new Promise( (resolve, reject) => {
        fs.readFile('./data/cupcakes.json','utf8', (err, data) => {
            if (err) {
                reject(err); return;
            }
            cupcakes = JSON.parse(data);
                resolve();
            });
        });
}

//Get All CupCakes
module.exports.getAllCupckes = function(){
    return new Promise((resolve,reject)=>{
        if (cupcakes.length == 0) {
            reject("query returned 0 results"); return;
        }
  resolve(cupcakes);
    })
}

//  Add Cupcakes to inventory
module.exports.addCupcake = function (cupcakeData){

    return new Promise(function (resolve, reject) {
            let totalNumOfCupcakes = cupcakes.length;
                cupcakeData.cupcakeId = cupcakes.length+ 1;
                cupcakes.push(cupcakeData);

                if (cupcakes.length == (totalNumOfCupcakes + 1)) {
                    resolve("Cupcake is added") ; return;
                }
        
                reject("Cupcake is not added");
            })

        }

//Filter Out cupcakes By Date
module.exports.getCupCakesByLastModifiedDate = function (dateEntered) {
    return new Promise(function (resolve, reject) {
        var foundcupCakes = null;

        for (let i = 0; i < cupcakes.length; i++) {
            if (dateEntered = cupcakes[i].lastModifiedDate) {
                foundcupCakes = cupcakes[i];
            }
        }
        if (!foundcupCakes) {
            reject("query returned 0 results"); return;
        }
        resolve(foundcupCakes);
    });
};

//Filter out cupcakes by Name
module.exports.getCupcakesByName = function (name) {
    return new Promise(function (resolve, reject) {
        var cupCakesFound = null;

        for (let i = 0; i < cupcakes.length; i++) {
            if (cupcakes[i].cupcakeName == name) {
                cupCakesFound = cupcakes[i];
            }
        }
        if (!cupCakesFound) {
            reject("query returned 0 results"); return;
        }
      resolve(cupCakesFound);
    });
};

module.exports.updateCupCake = function (cupcakeData) {
    return new Promise((resolve,reject)=>{
        
        for(let i = 0; i<employees.length;i++){
            if(cupcakes[i].cupcakeName==cupcakeData.cupcakeName){
                 cupcakes[i] = cupcakeData ;
                 
               }   
            
        }
        resolve();
        })
}