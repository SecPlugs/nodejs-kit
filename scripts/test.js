let secplugs = require('../filescan/filescan').getInstance()
let fileToScan = process.argv.slice(2)[0];

async function testScan() {
    //const secplugs = new Secplugs();
    let cksum = await secplugs.computeSha256Sum("./package.json");
    let uploadInfo = await secplugs.getPresignedUploadUrl(cksum);
    await secplugs.uploadFile(uploadInfo, "./package.json");
    let result = await secplugs.quickScan();
    console.log(result.score);
}


testScan(fileToScan);

secplugs.quickScan(fileToScan)
    .catch(err => {
        console.log(err.status);
        if (err.code == 404) {
            secplugs.computeSha256Sum(fileToScan)
                .then(cksum => secplugs.getPresignedUploadUrl(cksum)
                      .catch(err => console.log(err)))
                .then(uploadInfo => secplugs.uploadFile(uploadInfo, fileToScan)
                      .catch(err => console.log(err)))
                .then(() => secplugs.quickScan()
                      .catch(err => console.log(err)))
                .then(json => console.log(json.score))
                .catch(err => console.log(err));
        } else {
            console.log(err);
        }
    })
    .then(res => { if(res) {console.log(res.score);}});
        
secplugs.scanFile(fileToScan).then(res => console.log(res.score));

secplugs.isClean(fileToScan).then(res => console.log(res));

