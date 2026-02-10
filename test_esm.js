import path from 'path';
try {
    console.log(__dirname);
    console.log("Success");
} catch (e) {
    console.error("Error accessing __dirname:", e.message);
}
