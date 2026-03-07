const http = require('http');

function makeRequest(postData) {
    return new Promise((resolve) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: '/api/auth/send-otp',
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
    console.log("---- Testing Invalid Domain ----");
    const data1 = JSON.stringify({ fullName: 'Test', email: 'test@gmail.com', password: 'password123' });
    const res1 = await makeRequest(data1);
    console.log(res1);

    console.log("\n---- Testing Valid Domain ----");
    const data2 = JSON.stringify({ fullName: 'Student', email: 'student@cea.ac.in', password: 'password123' });
    const res2 = await makeRequest(data2);
    console.log(res2);
}

runTests();
