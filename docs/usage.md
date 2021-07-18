```
let secplugs = require('@secplugs/filescan').getInstance()

async function asyncQuickTest(fileToScan) {
    secplugs.isClean(fileToScan)
        .then(res => console.log(res));
}

async function simpleTestScan() {
    let result = await secplugs.isClean("./package.json")
    console.log(result);
}

let fileToScan = process.argv.slice(2)[0];
simpleTestScan();
asyncQuickTest(fileToScan);
```
