const path = require('path');
const fs = require('fs-extra');
const solc = require('solc');

const filePath = path.resolve(__dirname, 'contracts', 'Campaigns.sol');
const fileSource = fs.readFileSync(filePath, 'utf8');

const buildPath = path.resolve(__dirname, 'build');
//Cleanup the build directory
fs.removeSync(buildPath);
//Recreate the build directory
fs.ensureDirSync(buildPath);

const input = {
    language: 'Solidity',
    sources: {
        'Campaigns.sol': {
            content: fileSource
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['*']
            }
        }
    }
};
const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts;

for(let contract in output) {
    for(let obj in output[contract]) {
        fs.outputJSONSync(
            path.resolve(buildPath, obj + '.json'),
            output[contract][obj]
        )
    }
}
