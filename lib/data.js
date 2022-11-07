// dependencies
const fs = require("fs");
const path = require("path");

const lib = {};

// base directory of the data folder
lib.basedir = path.join(__dirname, "/../.data/");

// write data to file
lib.create = function (dir, file, data, callback) {
  // open file for writing
  fs.open(
    lib.basedir + dir + "/" + file + ".json",
    "wx",
    function (err, fileDescriptor) {
      if (!err && fileDescriptor) {
        // convert data to string
        const stringData = JSON.stringify(data);

        // write data to file and then close it
        fs.writeFile(fileDescriptor, stringData, function (err2) {
          if (!err2) {
            fs.close(fileDescriptor, function (err3) {
              if (!err3) {
                callback(false);
              } else {
                callback("error closing the new file!");
              }
            });
          } else {
            callback("Error writing to new file!");
          }
        });
      } else {
        callback("There was an error, file may already exists");
      }
    }
  );
};

lib.read = function (dir, file, callback) {
  fs.readFile(
    lib.basedir + dir + "/" + file + ".json",
    "utf8",
    function (err, data) {
      callback(err, data);
    }
  );
};

// update
lib.update = function (dir, file, data, callback) {
  // file open for writing
  fs.open(
    lib.basedir + dir + "/" + file + ".json",
    "r+",
    function (err, fileDescriptor) {
      if (!err && fileDescriptor) {
        // convert the data to string
        const stringData = JSON.stringify(data);

        // truncate the file
        fs.ftruncate(fileDescriptor, function (err) {
          if (!err) {
            // write to the file and close it
            fs.writeFile(fileDescriptor, stringData, function (err) {
              if (!err) {
                // close the file
                fs.close(fileDescriptor, function (err) {
                  if (!err) {
                    callback(false);
                  } else {
                    ("error closing file");
                  }
                });
              } else {
                callback("error closing file");
              }
            });
          } else {
            callback("error truncating file");
          }
        });
      } else {
        callback("file already updated");
      }
    }
  );
};

// delete existing file
lib.delete = (dir, file, callback) => {
  // unlink file
  fs.unlink(lib.basedir + dir + "/" + file + ".json", (err) => {
    if (!err) {
      callback(false);
    } else {
      callback("Error deleting file");
    }
  });
};

module.exports = lib;
