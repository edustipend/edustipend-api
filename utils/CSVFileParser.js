const fs = require("fs");
const { parse } = require("csv-parse");

const parseRecords = ({ fileName, startLine }) => {
  const records = [];
  fs.createReadStream(fileName)
    .pipe(parse({ delimiter: ",", from_line: startLine }))
    .on("data", function (row) {
      console.log(row);
      records.push(row);
    })
    .on("end", function () {
      console.log("File parsing complete");
    })
    .on("error", function (error) {
      console.error("Error parsing file");
      console.log(error.message);
    });
  return records;
};

module.exports = {
  parse: parseRecords
};
