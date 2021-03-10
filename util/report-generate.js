const excel = require('node-excel-export');

exports.generate = async (data) => {
  return new Promise((resolve, reject) => {
    try {
      if (!Array.isArray(data)) {
        const error = new CustomError(data);
        reject(error);
      }

      const styles = {
        headerAshTwo: {
          fill: {
            fgColor: {
              rgb: 'B2BEB5'
            }
          },
          font: {
            color: {
              rgb: 'FFFFFFFF'
            },
            sz: 14,
            bold: true,
            underline: false
          },
          alignment: {
            horizontal: 'center'
          }
        },
        headerAshOne: {
          fill: {
            fgColor: {
              rgb: '66695C'
            }
          },
          font: {
            color: {
              rgb: 'FFFFFFFF'
            },
            sz: 14,
            bold: true,
            underline: false
          },
          alignment: {
            horizontal: 'center'
          }
        }
      };

      let width = [];
      let columnNames = [];
      Object.keys(data[0]).map(item => {
        width.push({ wch: item.length * 10 });
        columnNames.push(item);
      });
      for (const element in data) {
        let value = Object.values(data[element]);
        for (let j = 0; j < value.length; j++) {
          if (value[j] !== null && value[j].length * 10 > width[j].wch) {
            width[j].wch = value[j].length * 10;
          }
        }
      }

      let specification = {};
      for (let i = 0; i < columnNames.length; i++) {
        specification[columnNames[i]] = {
          displayName: columnNames[i],
          headerStyle: i % 2 == 0 ? styles.headerAshOne : styles.headerAshTwo,
          cellStyle: {
            alignment: {
              horizontal: 'center'
            }
          },
          width: width[i].wch
        }
      };

      const report = excel.buildExport(
        [
          {
            name: 'Report',
            specification: specification,
            data: data
          }
        ]
      );

      // const fs = require('fs');
      // fs.appendFile('Filename.xlsx', report, (err) => {
      //   if (err) throw err;
      //   console.log('File created');
      // });

      resolve(report.toString('base64'));
    }
    catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      reject(err);
    }
  });
}

class CustomError extends Error {
  constructor(value, ...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TypeError);
    };

    this.name = 'Input Error';
    if (!this.message) {
      this.message = `The value should be an Array`;
    };
  };
};