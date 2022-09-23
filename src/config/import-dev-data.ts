import fs from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import State from './../models/stateSchema';
import LGA from './../models/LGASchema';

import { config } from './config';

mongoose
    .connect('mongodb://127.0.0.1:27017/MagneeDB')
    .then(() => {
        console.log(`mongoose connected on port ${config.server.port}`);
    })
    .catch((error: unknown) => {
        console.log(
            `An error has occured in the Database connection , details below ${error}`
        );
    });


//READ JSON FILE OF STATES AND LGAS

const states = JSON.parse(fs.readFileSync(`${__dirname}/../../dev-data/nigeria-state-and-lgas.json`, 'utf-8'));



let i = 0
let j = 0

// while(i<38){
//     //console.log(states.length)
//     while(j<states[i].lgas.length){
//     try{
//     console.log(states[i].lgas[j])
//     }catch(err){
        
//     }
//     j=j+1}
//     i = i + 1;

//     //console.log(i)
// }



//Getting the array of LGAs
let full_list: String[]=[];
let localGovernments: String[] = [];

let ObjValuesArray: string;
for (let i = 0; i < states.length; i++) {
    let statesArrayItemsAsObjects: Object = states[i];

    let tempArrayOfValues: Array<String | Array<String>>;
    tempArrayOfValues = Object.values(statesArrayItemsAsObjects);
    ///console.log(tempArrayOfValues)
    tempArrayOfValues[2].forEach((element: String) => {   
            full_list.push(element);
    
    });
}

const LGAArray:Array<Object> =[];

full_list.forEach(element => {
    let tempObj: object={};
    tempObj={"name":element}
    LGAArray.push(tempObj)
});

console.log(LGAArray)

const importData = async () => {
    try {
        await State.create(states);
        await LGA.create(LGAArray)
        console.log('Data successfully loaded!');
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await State.deleteMany();
    await LGA.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
}

if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}


// for (let i = 0; i < states.length; i++) {
//     let statesArrayItemsAsObjects: Object = states[i];
//     for (let key in statesArrayItemsAsObjects) {
//         if (key == 'lgas') {
//             console.log(key);
//             for (let k = 0; k < statesArrayItemsAsObjects.key.length; k++) {
//                 const element = statesArrayItemsAsObjects[k];
//             }
//         }
//     }
// }