const http = require('http');

function makeRequest(path, postData = null, method = 'POST', headers = {}) {
    return new Promise((resolve, reject) => {
        const defaultHeaders = { 'Content-Type': 'application/json' };
        if (postData) {
            defaultHeaders['Content-Length'] = Buffer.byteLength(postData);
        }

        const options = {
            hostname: 'localhost',
            port: 5000,
            path: path,
            method: method,
            headers: { ...defaultHeaders, ...headers }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, body: data ? JSON.parse(data) : {} });
                } catch (e) {
                    resolve({ status: res.statusCode, body: data });
                }
            });
        });

        req.on('error', reject);
        if (postData) req.write(postData);
        req.end();
    });
}

async function runTests() {
    console.log("---- 1. Start Register (Send OTP) ----");
    const regData = JSON.stringify({ fullName: 'App Test User', email: 'apptest@cea.ac.in', password: 'password123' });
    const res1 = await makeRequest('/api/auth/send-otp', regData);
    console.log(res1);

    // Give it 2 seconds to ensure email mock completes before we look at server logs for OTP
    await new Promise(r => setTimeout(r, 2000));
}

runTests();
