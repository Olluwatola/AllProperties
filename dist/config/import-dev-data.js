"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const mongoose_1 = __importDefault(require("mongoose"));
const stateSchema_1 = __importDefault(require("./../models/stateSchema"));
const LGASchema_1 = __importDefault(require("./../models/LGASchema"));
const config_1 = require("./config");
mongoose_1.default
    .connect('mongodb://127.0.0.1:27017/MagneeDB')
    .then(() => {
    console.log(`mongoose connected on port ${config_1.config.server.port}`);
})
    .catch((error) => {
    console.log(`An error has occured in the Database connection , details below ${error}`);
});
//READ JSON FILE OF STATES AND LGAS
const states = JSON.parse(fs_1.default.readFileSync(`${__dirname}/../../dev-data/nigeria-state-and-lgas.json`, 'utf-8'));
let i = 0;
let j = 0;
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
let full_list = [];
let localGovernments = [];
let ObjValuesArray;
for (let i = 0; i < states.length; i++) {
    let statesArrayItemsAsObjects = states[i];
    let tempArrayOfValues;
    tempArrayOfValues = Object.values(statesArrayItemsAsObjects);
    ///console.log(tempArrayOfValues)
    tempArrayOfValues[2].forEach((element) => {
        full_list.push(element);
    });
}
const LGAArray = [];
full_list.forEach(element => {
    let tempObj = {};
    tempObj = { "name": element };
    LGAArray.push(tempObj);
});
console.log(LGAArray);
const importData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield stateSchema_1.default.create(states);
        yield LGASchema_1.default.create(LGAArray);
        console.log('Data successfully loaded!');
    }
    catch (err) {
        console.log(err);
    }
    process.exit();
});
// DELETE ALL DATA FROM DB
const deleteData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield stateSchema_1.default.deleteMany();
        yield LGASchema_1.default.deleteMany();
        console.log('Data successfully deleted!');
    }
    catch (err) {
        console.log(err);
    }
    process.exit();
});
if (process.argv[2] === '--import') {
    importData();
}
else if (process.argv[2] === '--delete') {
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
