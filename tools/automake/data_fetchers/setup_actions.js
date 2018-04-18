const fs = require('fs');

var actions = [
    {
        "inline": [
            "mkdir -p /srv/backup",
            "mkdir -p /srv/backup/www",
            "mkdir -p /srv/backup/sql",
            "mkdir -p /tmp/data"
        ],
        "type": "shell"
    }
];
const actions_dir = '../../setup-actions';
var dirs = fs.readdirSync(actions_dir).sort().filter(
    (file) => fs.lstatSync(actions_dir + '/' + file).isDirectory()
).map(
    (dir) => {
        return {
            name: dir,
            step_name: dir.substr(3).replace(/-/g, ' '),
            local_path: actions_dir + '/' + dir + '/',
            tpl_path: './setup-actions/' + dir + '/',
            short_name: dir.substr(3)
        };
    }
);

dirs.forEach(
    (dir) => {
        if (fs.existsSync(dir.local_path + 'sources.list')) {
            actions.push({
                "source": dir.tpl_path + 'sources.list',
                "destination": "/etc/apt/sources.list.d/" + dir.short_name + ".list",
                "type": "file"
            });
        }
        if (fs.existsSync(dir.local_path + 'preinstall.sh')) {
            actions.push({
                "script": dir.tpl_path + 'preinstall.sh',
                "type": "shell"
            });
        }
        if (fs.existsSync(dir.local_path + 'bin')) {
            let b_local_path = dir.local_path + 'bin';
            let b_tpl_path =  dir.tpl_path + 'bin';
            fs.readdirSync(b_local_path).filter(
                (file) => fs.lstatSync(b_local_path + '/' + file).isFile()
            ).forEach(
                (file) => {
                    actions.push({
                        "source": b_tpl_path + '/' + file,
                        "destination": '/usr/local/bin/' + file,
                        "type": "file"
                    });
                    actions.push({
                        "inline": [
                            "chown vagrant:vagrant /usr/local/bin/" + file,
                            "chmod +x /usr/local/bin/" + file
                        ],
                        "type": "shell"
                    });
                }
            );
        }
        if (fs.existsSync(dir.local_path + 'services')) {
            let b_local_path = dir.local_path + 'services';
            let b_tpl_path =  dir.tpl_path + 'services';
            fs.readdirSync(b_local_path).filter(
                (file) => fs.lstatSync(b_local_path + '/' + file).isFile()
            ).forEach(
                (file) => {
                    actions.push({
                        "source": b_tpl_path + '/' + file,
                        "destination": '/etc/systemd/system/' + file,
                        "type": "file"
                    });
                }
            );
        }
        if (fs.existsSync(dir.local_path + 'sql')) {
            let b_local_path = dir.local_path + 'sql';
            let b_tpl_path =  dir.tpl_path + 'sql';
            fs.readdirSync(b_local_path).filter(
                (file) => fs.lstatSync(b_local_path + '/' + file).isFile()
            ).forEach(
                (file) => {
                    actions.push({
                        "source": b_tpl_path + '/' + file,
                        "destination": '/srv/backup/sql/' + file,
                        "type": "file"
                    });
                }
            );
        }
    }
);

actions.push({
    "inline": [
        "apt-get update -q -y",
        "apt-get upgrade -q -y",
        "apt-get dist-upgrade -q -y"
    ],
    "type": "shell"
});

dirs.forEach(
    (dir) => {
        if (fs.existsSync(dir.local_path + 'websites')) {
            let b_local_path = dir.local_path + 'websites';
            let b_tpl_path =  dir.tpl_path + 'websites';
            fs.readdirSync(b_local_path).filter(
                (file) => fs.lstatSync(b_local_path + '/' + file).isFile()
            ).forEach(
                (file) => {
                    actions.push({
                        "source": b_tpl_path + '/' + file,
                        "destination": '/etc/apache2/sites-available/' + file,
                        "type": "file"
                    });
                }
            );
        }
        if (fs.existsSync(dir.local_path + 'data')) {
            actions.push({
                "source": dir.tpl_path + 'data',
                "destination": "/tmp/data/" + dir.short_name,
                "type": "file"
            });
        }
        if (fs.existsSync(dir.local_path + 'install.sh')) {
            actions.push({
                "script": dir.tpl_path + 'install.sh',
                "type": "shell"
            });
        }
        if (fs.existsSync(dir.local_path + 'etc')) {
            actions.push({
                "source": dir.tpl_path + 'etc',
                "destination": "/etc",
                "type": "file"
            });
        }
        if (fs.existsSync(dir.local_path + 'sql')) {
            let b_local_path = dir.local_path + 'sql';
            fs.readdirSync(b_local_path).filter(
                (file) => fs.lstatSync(b_local_path + '/' + file).isFile()
            ).forEach(
                (file) => {
                    let db = require('path').parse(file).name;
                    actions.push({
                        "inline": [
                            'mysql -uroot -e "create database `'+db+'`; use `'+db+'`; source /srv/backup/sql/'+file+';"'
                        ],
                        "type": "shell"
                    });
                }
            );
        }
    }
);

dirs.forEach(
    (dir) => {
        if (fs.existsSync(dir.local_path + 'postinstall.sh')) {
            actions.push({
                "script": dir.tpl_path + 'postinstall.sh',
                "type": "shell"
            });
        }
        if (fs.existsSync(dir.local_path + 'services')) {
            let b_local_path = dir.local_path + 'services';
            fs.readdirSync(b_local_path).filter(
                (file) => fs.lstatSync(b_local_path + '/' + file).isFile()
            ).forEach(
                (file) => {
                    actions.push({
                        "inline": [
                            'systemctl enable ' + file
                        ],
                        "type": "shell"
                    });
                }
            );
        }
    }
);

actions.push({
    "inline": [
        "rm -rf /tmp/data",
        "cd /etc/apache2/sites-available/ && a2ensite *",
        "service apache2 restart"
    ],
    "type": "shell"
});

dirs.forEach(
    (dir) => {
        if (fs.existsSync(dir.local_path + 'endinstall.sh')) {
            actions.push({
                "script": dir.tpl_path + 'endinstall.sh',
                "type": "shell"
            });
        }
    }
);

module.exports = actions.map(
    (action) => {
        action.override = {
            "virtualbox-iso": {
                "execute_command": "echo 'vagrant'|sudo -S bash '{{.Path}}'"
            }
        };
        return action;
    }
);
