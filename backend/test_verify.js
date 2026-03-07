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
    console.log("---- Testing Invalid Domain ----");
    const data1 = JSON.stringify({ fullName: 'Test', email: 'test@gmail.com', password: 'password123' });
    const res1 = await makeRequest('/api/auth/send-otp', data1);
    console.log(res1);

    console.log("\n---- Testing Valid Domain ----");
    const data2 = JSON.stringify({ fullName: 'Student', email: 'student2@cea.ac.in', password: 'password123' });
    const res2 = await makeRequest('/api/auth/send-otp', data2);
    console.log(res2);

    // Attempt invalid verify
    console.log("\n---- Testing Invalid Verify ----");
    const data3 = JSON.stringify({ email: 'student2@cea.ac.in', otp: '111111' });
    const res3 = await makeRequest('/api/auth/verify-otp', data3);
    console.log(res3);
}

runTests();
