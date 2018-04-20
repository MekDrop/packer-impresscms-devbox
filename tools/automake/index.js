const cd = process.cwd();
process.chdir(__dirname);

const getVersions = require(__dirname + '/data_fetchers/last_linux_version.js');
const os = require('os');
const fs = require('fs');

(async function () {

    const versions = await getVersions();

    var variables = require(__dirname + '/data_fetchers/package-extra.js').variables;
    variables.box_version = versions[0].version;

    var ret = {
        variables: variables,
        "push": require(__dirname + '/data/push.json'),
        "provisioners": require('./data_fetchers/setup_actions.js'),
        "builders": [
            {
                "type": "virtualbox-iso",
                "boot_command": require(__dirname + '/data/boot_command.json'),
                "headless": true,
                "boot_wait": "5s",
                "disk_size": 20480,
                "guest_os_type": "Ubuntu",
                "http_directory": "http",
                "iso_checksum": versions[0].hash,
                "iso_checksum_type": "md5",
                "iso_url": versions[0].url,
                "ssh_username": "vagrant",
                "ssh_password": "vagrant",
                "ssh_port": 22,
                "ssh_wait_timeout": "10000s",
                "shutdown_command": "echo '/sbin/halt -h -p' > shutdown.sh; echo 'vagrant'|sudo -S bash 'shutdown.sh'",
                "guest_additions_path": "VBoxGuestAdditions_{{.Version}}.iso",
                "virtualbox_version_file": ".vbox_version"
            }
        ],
        "post-processors": require(__dirname + '/data/post-processors.json')
    };

    fs.writeFile(__dirname + '/../../templates/ubuntu.json', JSON.stringify(ret, null, 2), (err) => {
        if (err) throw err;

        console.log("The file was succesfully saved!");
    });

    process.chdir(cd);

})();
