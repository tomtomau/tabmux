'use strict';
var moment = require('moment');

module.exports = function (shipit) {
    shipit.initConfig({
        production: {
            deploy_to: '/opt/tabmux/', // Setup your paths you need
            deploy_from: 'export/', // You might want to deploy from a different path
            keepReleases: 5,
            servers: [{
                host: 'tabmux.net', // Add your servers ip address
                user: 'deploy' // Setup your own users
            }]
        }
    });

    var createDir = function (path) {
        return shipit.remote('mkdir -p ' + path);
    };

    var setupReleases = function (path) {
        return shipit.remote('test -d ' + path).then(result => {
            return createDir(path);
        }).catch(err => {
            // Doesn't exist, so let's try creating it
            return createDir(path);
        }).then(() => {
            console.log('Done creating releases directory');
        }).catch(err => {
            console.log("Error: Creating releases");
            throw err;
        });
    };

    var createReleaseDir = function (deployDirectory) {
        return shipit.remote('test -d ' + deployDirectory).then(result => {
            return createDir(deployDirectory);
        }).catch(err => {
            // Doesn't exist, so let's try creating it
            return createDir(deployDirectory);
        }).then(() => {
            console.log('Done creating release directory at ' + deployDirectory);
        }).catch(err => {
            console.log("Error: Creating release directory " + deployDirectory);
            throw err;
        });
    };

    var getTimestamp = function (date) {
        return moment(date).format('YYYY_MM_DD_HH_mm_ss');
    };

    shipit.task('setup', function () {
        let deployTo = this.config.deploy_to;
        let releases = deployTo + "/releases/";
        let current = deployTo + "/current";

        return setupReleases(deployTo);
    });

    shipit.task('deploy', function () {
        let timestamp = getTimestamp(new Date());
        let deployDirectory = this.config.deploy_to + '/releases/' + timestamp + '/';
        let deployTo = this.config.deploy_to;

        let current = deployTo + "/current";

        createReleaseDir(deployDirectory)
            .then(() => {
                // Copy up the deploy_from directory to the server
                return shipit.remoteCopy(this.config.deploy_from, deployDirectory)
            })
            .then(() => {
                console.log("Created deployment!");
            })
            .then(() => {
                let releases = this.config.keepReleases;

                // Trim the old releases we still have
                return shipit.remote('cd ' + this.config.deploy_to + '/releases/ && ls -1 | head -n -' + releases + ' | xargs rm -rf');
            }).then(() => {
            // Now to flick the symlink
            return shipit.remote('cd ' + this.config.deploy_to + '/releases/ && ls -1 | tail -n -1 | xargs -I{} ln -nfs ' + this.config.deploy_to + '/releases/{} ' + current)
        }).catch(err => {
            console.log(err);
            // Throw exit code 1, will cause an error to be thrown in CircleCI which will notify people.
            process.ext(1);
        });
    });

    shipit.task('pwd', function () {
        return shipit.remote('pwd');
    });
};