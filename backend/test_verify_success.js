const http = require('http');

function makeRequest(path, postData) {
    return new Promise((resolve) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                resolve({ status: res.statusCode, body: JSON.parse(data) });
            });
        });

        req.write(postData);
        req.end();
    });
}

async function runTests() {
    console.log("\n---- Testing Valid Verify ----");
    const data3 = JSON.stringify({ email: 'student2@cea.ac.in', otp: '709633' });
    const res3 = await makeRequest('/api/auth/verify-otp', data3);
    console.log(res3);
}

runTests();
