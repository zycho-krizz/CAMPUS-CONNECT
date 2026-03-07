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
    console.log("\n---- 2. Verify OTP ----");
    const verifyData = JSON.stringify({ email: 'apptest@cea.ac.in', otp: '781797' });
    const res2 = await makeRequest('/api/auth/verify-otp', verifyData);
    console.log(res2);

    console.log("\n---- 3. Login User ----");
    const loginData = JSON.stringify({ email: 'apptest@cea.ac.in', password: 'password123' });
    const res3 = await makeRequest('/api/auth/login', loginData);
    console.log("Login Status:", res3.status);
    console.log("Got JWT Token:", !!res3.body.token);

    if (res3.body.token) {
        console.log("\n---- 4. Fetch Users (Admin) ----");
        // We need an admin token. Let's try mocking an admin login.
        const adminLogin = JSON.stringify({ email: 'admin@campus.edu', password: 'admin' });
        const resAdmin = await makeRequest('/api/auth/login', adminLogin);

        if (resAdmin.body.token) {
            const resUsers = await makeRequest('/api/admin/users', null, 'GET', {
                'Authorization': `Bearer ${resAdmin.body.token}`
            });
            console.log("Admin Users Fetch Status:", resUsers.status);
            console.log("Users fetched:", resUsers.body.length);
        } else {
            console.log("Could not log in as admin. Make sure 'admin@campus.edu' exists in MySQL.");
        }
    }
}

runTests();
