const fs = require("fs");
const NodeRSA = require('node-rsa');
const PORT = process.env.PORT || 3005;

function getPort() {
    return PORT;
}

function generateKey() {
    try {
        // Generate a secure random key of the desired length (e.g., 32 bytes for AES-256)
        const keyLengthInBytes = 32; // For AES-256, use 32 bytes (256 bits)
        const secureRandomKey = crypto.randomBytes(keyLengthInBytes);
        console.log(secureRandomKey.byteLength);

        // Convert the random bytes to a hexadecimal string for use as a key
        const secretKey = secureRandomKey.toString('hex');
        console.log(Buffer.byteLength(secretKey, 'hex'))
        // Save the secret key to a file (key.txt)
        fs.writeFileSync('key.txt', secureRandomKey, 'hex');

        console.log('Key has been generated and saved to key.txt');
    } catch (error) {
        console.error('Error generating or saving the key:', error);
    }
}

function getKey() {
    try {
        return fs.readFileSync('key.txt', 'hex');
    } catch (error) {
        console.error('Error reading/parsing keys file:', error);
        throw error;
    }
}

function bufferToHex(buffer) {
    return Array.prototype.map.call(buffer, (byte) => {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('');
}

module.exports = { getPort, getKey, generateKey };