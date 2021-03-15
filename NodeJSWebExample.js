//
// Title: NodeJS Example Secplugs Web Plugin
// Author: TheStig@secplugs.com
//
// Purpose: This example submits a url to web/quickscan, waits on the report_id 
// and then prints out the results. It uses the asynchronous mock vendor 
// and sends context data containing version and client uuid
//
// Concepts: Web End Points, API Keys, A synchronous, context data, mock vendor
// 


// We'll use fetch for the REST calls
// https://www.npmjs.com/package/node-fetch
const fetch = require('node-fetch');

// To create a uuid see http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/21963136#21963136
// Note: generate at install time
const client_uuid = '6491f6d0-40b5-11eb-b378-0242ac130002';

// Version format is the same as https://developer.chrome.com/docs/extensions/mv2/manifest/version/
// Note: generate at build time
const plugin_version = '3.14.159.26';

// Api key to use, we'll use the mock asynch api key
// Note: The below keys are public domain and do not need to be kept secret. They are protected from abuse with usage quotas.
const mock_async_api_key = "GW5sb8sj8D9CtvVrjsTC22FNljxhoVuL1UoM6fFL";

// We will poll every second
const polling_interval = 1000;

// The production api
const web_quickscan_endpoint = "https://api.live.secplugs.com/security/web/quickscan";
const report_endpoint = "https://api.live.secplugs.com/security/report";

// Scan context
const scan_context = {
  'client_uuid': client_uuid,
  'plugin_version': plugin_version
};

// Stringify and encode the scan context
const encoded_scancontext = encodeURIComponent(JSON.stringify(scan_context));

// Make the headers with the api key
const headers = {
  "accept": "application/json",
  "x-api-key": mock_async_api_key
};

// A call back function to poll for the report
function poll_for_report(report_id) {

  // Build the url to poll for the report
  let poll_request_url = `${report_endpoint}/${report_id}`;
  fetch(poll_request_url, { method: "GET", headers: headers })
    .then(response => {

      // check ok
      console.assert(response.ok);

      // Load json
      response.json()
        .then(json_response => {

          // Check status
          const status = json_response['status'];
          if (status == 'pending') {

            // If its still pending - schedule another poll
            process.stdout.write(".");
            setTimeout(function() { poll_for_report(report_id); }, polling_interval);
          }
          else {

            // Done, print summary
            process.stdout.write(".Done");
            const score = json_response['score'];
            const verdict = json_response['verdict'];
            const duration = json_response['duration'];
            const threat_object = JSON.stringify(json_response['threat_object']);
            const vendor_config_name = json_response['meta_data']['vendor_info']['vendor_config_name'];
            console.log("");
            console.log("--- Analysis Summary ---");
            console.log(`Score: ${score}`);
            console.log(`Verdict: ${verdict}`);
            console.log(`Duration: ${duration}`);
            console.log(`Threat Object: ${threat_object}`);
            console.log(`Vendor Cfg. Used: ${vendor_config_name}`);
            console.log(`Full Report: https://secplugs.com/plugin_landing/viewreport.php?report_id=${report_id}`);
          }

        });

    });
}

// Function to start the analysis
function submit_for_analysis(url_2_scan) {

  // Trace
  console.log(`Doing a quickscan on '${url_2_scan}'`);

  // Build the web quickscan GET url
  const encoded_url = encodeURIComponent(url_2_scan);
  let submit_request_url = `${web_quickscan_endpoint}?url=${encoded_url}&scancontext=${encoded_scancontext}`;

  // Make the request
  fetch(submit_request_url, { method: "GET", headers: headers })
    .then(response => {

      // check ok
      console.assert(response.ok);

      // Load json
      response.json()
        .then(json_response => {

          // Log out report_id
          const report_id = json_response['report_id'];
          console.log(`Submitted, report_id: ${report_id}`);

          // Start the poll loop
          process.stdout.write("Polling.");
          setTimeout(function() { poll_for_report(report_id); }, polling_interval);

        });

    });

}

// Salutations
console.log(`Welcome to the Node JS Example Secplugs Web Plugin version ${plugin_version} `);

// This is the url we will scan by default
var url_2_scan = 'http://example.com';

// See if a url specified
var args = process.argv.slice(2);
if (args.length > 0 && args[0].startsWith("http")) {
  url_2_scan = args[0];
}
else {

  // Use default
  console.log(`No url specified, default to ${url_2_scan}`);
}

// Kick off the analysis
submit_for_analysis(url_2_scan);
