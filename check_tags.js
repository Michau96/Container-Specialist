const fs = require('fs');
const content = fs.readFileSync('src/components/MyCropsView.tsx', 'utf8');

let divCount = 0;
let lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const opens = (line.match(/<div(\s|>)/g) || []).length;
    const closes = (line.match(/<\/div>/g) || []).length;
    divCount += opens - closes;
    if (i > 200 && (opens > 0 || closes > 0)) {
        // console.log(`${i+1}: ${divCount} (opens: ${opens}, closes: ${closes}) - ${line.trim()}`);
    }
}
console.log("Final div count: ", divCount);
