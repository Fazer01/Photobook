/*
 * Photobook
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * OpenAPI spec version: 1.0
 *
 * NOTE: This class is auto generated by OpenAPI Generator.
 * https://github.com/OpenAPITools/openapi-generator
 *
 * OpenAPI generator version: 5.3.1-SNAPSHOT
 */

import http from "k6/http";
import { group, check, sleep } from "k6";
import encoding from 'k6/encoding';

const BASE_URL = "http://host.docker.internal:8081"; // host.docker.internal
// Sleep duration between successive requests.
// You might want to edit the value of this variable or remove calls to the sleep function on the script.
const SLEEP_DURATION = 0.1;
// Global variables should be initialized.
let imageByte = open("/images/1.jpg", "b");
let file = {filename: '1.jpg', content_type: 'image/jpeg', data: encoding.b64encode(imageByte)};

function makeMultipart(file, key, transferEncoding) {
    return `--boundary\r\nContent-Disposition: form-data; name="${key}"; filename="${file.filename}"\r\n` +
      `Content-Type: ${file.content_type}\r\n${transferEncoding || ''}\r\n` + file.data + `\r\n\r\n`;
}

export default function() {
    // group("/photos", () => {
    //     let url = BASE_URL + `/photos`;
    //     // Request No. 1
    //     let body = makeMultipart(file, "file", 'Content-Transfer-Encoding: base64\r\n');
    //     let params = { headers: { 'Content-Type': 'multipart/form-data; boundary=boundary' }};
    //     let request = http.post(url, body, params);
    //     check(request, {
    //         "Success": (r) => r.status === 201
    //     });
    //     sleep(SLEEP_DURATION);

    //     // Request No. 2
    //     request = http.get(url);
    //     check(request, {
    //         "Success": (r) => r.status === 200
    //     });
    //     sleep(SLEEP_DURATION);       
    // });


    group("/photos/{id}", () => {
        let url = BASE_URL + `/photos`;
        // Request No. 1
        let body = makeMultipart(file, "file", 'Content-Transfer-Encoding: base64\r\n');
        let params = { headers: { 'Content-Type': 'multipart/form-data; boundary=boundary' }};
        let requestGetId = http.post(url, body, params);
        console.log(requestGetId.status);
        console.log(JSON.stringify(requestGetId.body));
        check(requestGetId, {
            "Success": (r) => r.status === 201
        });
        sleep(SLEEP_DURATION);
        let image = JSON.parse(requestGetId.body);

        url = BASE_URL + `/photos/${image.id}`;
        // Request No. 2
        let request = http.get(url);
        check(request, {
            "Success": (r) => r.status === 200
        });
        sleep(SLEEP_DURATION);

        // Request No. 3
        request = http.del(url);
        check(request, {
            "Success": (r) => r.status === 204
        });
        sleep(SLEEP_DURATION);
    });
}