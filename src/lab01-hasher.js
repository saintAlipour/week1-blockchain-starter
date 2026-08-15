const crypto = require('crypto');

//(Genesis Block)
const block = {
    index: 0,
    previousHash: "0",
    timestamp: 1715000000,
    data: "Genesis Block"
};


function calculateHash(block) {
    
    const dataString = block.index + block.previousHash + block.timestamp + block.data;
    

    return crypto
        .createHash('sha256')
        .update(dataString)
        .digest('hex');
}

console.log("main block:");
console.log(block);
console.log("hash SHA-256:");
const originalHash = calculateHash(block);
console.log(originalHash);


console.log(" change data 'Genesis Block!'...");
const modifiedBlock = {
    ...block,
    data: "Genesis Block!"
};

// نمایش بلاک تغییر یافته
console.log(" بلاک تغییر یافته:");
console.log(modifiedBlock);
console.log(" هش جدید:");
const newHash = calculateHash(modifiedBlock);
console.log(newHash);

// مقایسه هش‌ها
console.log(" مقایسه:");
console.log(`main hash:     ${originalHash}`);
console.log(`new hash:     ${newHash}`);
console.log(`same ? ${originalHash === newHash ? ' بله' : ' نه - اثر بهمنی!'}`);

// بررسی اثر بهمنی (Avalanche Effect)
console.log(" اثر بهمنی:");
console.log(`طول هش اصلی: ${originalHash.length} کاراکتر`);
console.log(`طول هش جدید: ${newHash.length} کاراکتر`);
console.log(`تغییر: ${originalHash.substring(0, 5)}... → ${newHash.substring(0, 5)}...`);
console.log(`کاملاً متفاوت هستند!`);