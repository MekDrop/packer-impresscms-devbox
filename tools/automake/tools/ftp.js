const FTP  = require('ftp'),
    { URL } = require('url'),
    fs = require('fs'),
    path = require('path'),
    os = require('os'),
    crypto = require('crypto');

module.exports = class {

    constructor(address) {
        var self = this;
        this.url = new URL(address);
        this.ftp = new FTP();
        this.ftp.on('ready', function () {
            if (self.action) {
                self.action();
            }
        });
    }

    close() {
        var self = this;
        return new Promise(
            function (resolve) {
                self.ftp.end();
            }
        );
    }

    connect() {
        var self = this;
        return new Promise(
            function (resolve) {
                self.action = async function() {
                    await self.cd(self.url.pathname);
                    resolve();
                    self.action = null;
                };
                self.ftp.connect({
                    host: self.url.host,
                    port: self.url.port?self.url.port:21,
                    user: self.url.username? self.url.username: 'anonymous',
                    password: self.url.password ? self.url.password : ''
                });
            }
        );
    }

    list() {
        var self = this;
        return new Promise(
            function (resolve) {
                self.ftp.list(function(err, list) {
                    if (err) {
                        throw err;
                    } else {
                        resolve(list);
                    }
                });
            }
        );
    }

    cd(path) {
        var self = this;
        return new Promise(
            function (resolve) {
                self.ftp.cwd(path, function(err, currentDir) {
                    if (err) {
                        throw err;
                    } else {
                        resolve(currentDir);
                    }
                });
            }
        );
    }

    get(file) {
        var self = this;
        return new Promise(
            function (resolve) {
                self.ftp.get(file, function (err, stream) {
                    if (err) throw err;
                    resolve(stream);
                });
            }
        );
    }

    readFileToString(file) {
        var local_file = path.join(
            os.tmpdir(),
            crypto.createHash('md5').update(file).digest("hex") + '.tmp'
        );
        var self = this;
        return new Promise(
            function (resolve) {
                self.ftp.get(file, function (err, stream) {
                    if (err) throw err;
                    stream.once('close',
                        function() {
                            fs.readFile(local_file, "utf8", (err, data) => {
                                if (err) throw err;
                                fs.unlink(local_file, (err) => {
                                    if (err) throw err;
                                    resolve(data);
                                });
                            });
                        }
                    );
                    stream.pipe(
                        fs.createWriteStream(local_file)
                    );
                });
            }
        );
    }

}
