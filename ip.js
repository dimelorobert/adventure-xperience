var ip2location = require("ip-to-location");

const { getUserAgent } = require("universal-user-agent");
// or import { getUserAgent } from "universal-user-agent";

// userAgent will look like this
// in browser: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:61.0) Gecko/20100101 Firefox/61.0"
// in node: Node.js/v8.9.4 (macOS High Sierra; x64)

ip2location.fetch("87.219.90.6", function (err, res) {
	const userAgent = getUserAgent();
	console.log("ESTE ES RES;::::", res, userAgent);
	//  {
	//     ip: '209.58.139.51',
	//     country_code: 'US',
	//     country_name: 'United States',
	//     region_code: 'CA',
	//     region_name: 'California',
	//     city: 'San Jose',
	//     zip_code: '95131',
	//     time_zone: 'America/Los_Angeles',
	//     latitude: 37.3874,
	//     longitude: -121.9024,
	//     metro_code: 807
	// }
});
