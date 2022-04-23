---
layout: none
---

## About
Ready to use samples written in NodeJS makes the Secplugs platform really easy to use from client or server side Java Script.

The tool is open source so you can modify as you wish.
Also see [Node,js Kit Listing](/plugin-list/plugin-secplugs-nodejs-kit)

## Quick Start
Obtain the node module by simply running the command below at the root of your node project (i.e. the directory that has `package.json` file)
```bash
npm i @secplugs/filescan
```

This will now add the secplugs filescan node module to the package.json

## Usage
Here, a very simple example of how to integrate file scan with your node code base is provided

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

To use additional features and the privacy of your own account, after registering with {brand-name}, sign in with your username and [create an API key](docs?doc=docs/HowTo/CreateKey) 

After creating a key, the only change to the code sample above would be

```javascript
let secplugs = require('@secplugs/filescan').getInstance("xgSg33brMe3oIh872Azge8ZzCS170m0ja6r0LNJo")
```


Everything else remains the same.


## Contact
Having trouble? [Contact {brand-name} ](https://{brand-root-domain}/contacts)
