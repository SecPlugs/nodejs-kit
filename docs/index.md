---
layout: none
---
# Node.js Kit

Ready to use samples written in Node.js makes the {brand-name} platform really easy to use from client or server side Java Script.

The tool is open source so you can modify as you wish.
Also see [Node,js Kit Listing](/plugin-list/plugin-secplugs-nodejs-kit)

## Installation
Get the node module by running the command below at the root of your node project (i.e. the directory that has `package.json` file)
```bash
npm i @secplugs/filescan
```

This will now add the secplugs filescan node module to the package.json

## Usage
Usage pattern is to get an instance and then uses its methods to scan objects.

## Scan A File
Here, a very simple example of how to scan a file

```javascript
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
### Use Your Own API Key
To use additional features and the privacy of your own account, after registering with {brand-name}, sign in with your username and [create an API key](docs?doc=docs/HowTo/CreateKey) 

After creating a key, the only change to the code sample above would be

```javascript
let secplugs = require('@secplugs/filescan').getInstance("your-api-key")
```

Everything else remains the same.

## Contact
Having trouble? [Contact {brand-name} ](https://{brand-root-domain}/contacts)
