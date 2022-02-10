const request = require("request");
const readline = require("readline");
const fs = require("fs");
const args = process.argv.slice(2);
const r1 = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

request(args[0], (error, response, body) => {
  if (error) {
    console.log("error:", error);
    return;
  }
  if (response.statusCode !== 200) {
    console.log("Status:", response.statusCode);
  }
  fs.stat(args[1], (err, stats) => {
    if (err) {
      console.log("File doesn't exist");
    } else if (stats) {
      r1.question("This file already exists. Overwrite? [Y/N]", (response) => {
        if (response.toUpperCase() === "Y") {
          fs.writeFile(String(args[1]), body, (error) => {
            if (error) {
              console.log("Failed to download.");
              return;
            }
          });
          console.log(
            `Downloaded and saved ${stats.size} bytes to ${args[1]}!`
          );
          r1.close();
        } else if (response.toUpperCase() === "N") {
          console.log("Understood. Closing.");
          r1.close();
        }
      });
    }
  });
});
