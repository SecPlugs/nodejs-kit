var fetch = require('node-fetch');
var shaSum = require('sha256-file');
var fs = require('fs');
var FormData = require('form-data');
var path = require('path');
const SECPLUGS_CLEAN_MID = 70;

class ScanObjectNotFound extends Error {
    constructor(fileName) {
        super(fileName + " not found");
        this.status = 404;
        this.code = 404;
        this.name = this.constructor.name;
    }
}


class Secplugs {
    constructor(apiKey="GW5sb8sj8D9CtvVrjsTC22FNljxhoVuL1UoM6fFL") {
        this.apiKey = apiKey;
        this.baseUrl = "https://api.live.secplugs.com/security";
        this.fileUploadUrl = this.baseUrl + "/file/upload";
        this.quickScanUrl = this.baseUrl + "/file/quickscan";
        this.uploadInfo = {};
        this.pluginVersion = '3.14.159.26';
        this.clientUuid = '6491f6d0-40b5-11eb-b378-0242ac130002';
        this.fileName = '';
        this.cksum = '';
        this.scanContext = {'client_uuid': this.clientUuid, 'plugin_version': this.pluginVersion};
    }

    get uploadUrl() {
        return this.uploadInfo;
    }
    
    async computeSha256Sum(filePath) {
        this.fileName = path.basename(filePath);
        this.cksum = shaSum(filePath);
        return this.cksum;
    }
    
    async getPresignedUploadUrl(cksum) {
        let url = this.fileUploadUrl + "?sha256=" + cksum;
        let headers = {"x-api-key": this.apiKey};
        let result;
        let response = await fetch(url, {method: "GET", headers: headers});
        if (response.ok) {
            return response.json();
        } else {
            throw new Error(response.statusText);
        }
    }

    async uploadFile(uploadInfo, filePath) {
        if (uploadInfo === null) {
            throw new Error("uploadInfo is undefined");
        }
        let url = uploadInfo.upload_post.url;
        let formFields = uploadInfo.upload_post.fields;
        const stream = fs.createReadStream(filePath);
        const form = new FormData();
        Object.keys(formFields).forEach(function(key) {
            var val = formFields[key];
            form.append(key, val);
        });
        form.append("file", fs.readFileSync(filePath));
        let response = await fetch(url, {method: "POST", body: form});
        return response.ok;
    }

    async quickScan(filePath = "") {
        if (filePath.length > 0) {
            this.scanContext['file_name'] = path.basename(filePath);
            await this.computeSha256Sum(filePath);
        } else if (this.fileName.length > 0) {
            this.scanContext['filename'] = this.fileName;
        } else {
            throw new Error("Secplugs not initialised, or no file provided for analysis");
        }
        let encodedScanContext = encodeURIComponent(JSON.stringify(this.scanContext));
        let url = this.quickScanUrl + "?sha256=" + this.cksum + "&scancontext=" + encodedScanContext;
        let headers = {"x-api-key": this.apiKey};
        let result = await fetch(url, {method: "GET", headers: headers});
        if (result.ok) {
            return result.json();
        } else if (result.status == 404) {
            throw new ScanObjectNotFound(this.scanContext['filename']);
        } else {
            throw new Error(result.statusText);
        }
    }

    async scanFile(filePath) {
        try {
            let scanResult = await this.quickScan(filePath);
            return scanResult;
        } catch (err) {
            if (err.code == 404) {
                let cksum = await this.computeSha256Sum(filePath);
                let uploadInfo = await this.getPresignedUploadUrl(cksum);
                await this.uploadFile(uploadInfo, filePath);
                let result = await this.quickScan();
                return result;
            } else {
                throw err;
            }
        }
    }

    async isClean(filePath) {
        try {
            let result = await this.scanFile(filePath);
            if (result.score < SECPLUGS_CLEAN_MID) {
                return false;
            } else {
                return true;
            }
        }
        catch (err) {
            throw err;
        }
    }
    
    static getInstance(apiKey = "GW5sb8sj8D9CtvVrjsTC22FNljxhoVuL1UoM6fFL") {
        return new Secplugs(apiKey);
    }
}

module.exports = Secplugs;
