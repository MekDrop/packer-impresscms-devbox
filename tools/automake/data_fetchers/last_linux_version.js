const FTP = require('../tools/ftp.js');
const compare = require('node-version-compare');
const url = require('./package-extra.js').image_ftp;

var ftp = new FTP(url);

module.exports = async function () {
    await ftp.connect();
    var list = await ftp.list();
    var items = list.filter(
        (item) => ((item.type == 'l') || (item.type == 'd')) && /\d/.test(item.name)
    ).sort(
        (a, b) => compare(a.name, b.name)
    ).reverse().map(
        (item) => item.name
    );
    var rez = [];
    var rez_files = [];
    for (var i = 0; i < items.length; i++) {
        await ftp.cd(items[i]);
        let files = await ftp.list();
        rez = files.filter(
            (item) => (item.name == 'ubuntu-' + items[i] + '-server-i386.iso') /*||
            (item.name == 'ubuntu-' + items[i] + '-server-amd64.iso')*/
        ).map(
            (item) => item.name
        );
        if (rez.length > 0) {
            var data = await ftp.readFileToString('MD5SUMS');
            rez_files = data.split("\n").map(
                (line) => line.trim().split(' *', 2)
            ).filter(
                (parts) => (parts.length == 2)
            ).map(
                (parts) => {
                    return {
                        name: parts[1],
                        hash: parts[0],
                        version: items[i],
                        url: url + '/' + items[i] + '/' + parts[1]
                    };
                }
            ).filter(
                (item) => (item.name == 'ubuntu-' + items[i] + '-server-i386.iso') /*||
                (item.name == 'ubuntu-' + items[i] + '-server-amd64.iso')*/
            );
            break;
        }
        await ftp.cd('..');
    }
    ftp.close();
    return rez_files;
}
