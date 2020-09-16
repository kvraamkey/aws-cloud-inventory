const fs = require('fs');
const yargs = require('yargs');
const AWS = require("aws-sdk");
const aws_services = require("aws-sdk/clients/all");

const argv = yargs
    // .command('aws_list_all','List AWS resources on one account across regions and services. Saves result into JSON files')
    .option('list-services', {
        alias: 'ls',
        description: 'List the services',
        type: 'boolean',
        default: false
    })
    .option('list-operations', {
        alias: 'lo',
        description: 'List the operations',
        type: 'boolean',
        default: false
    })
    .help().alias('help', 'h')
    .argv;

if (argv.ls) {
    awsServices = Object.keys(aws_services).sort()
    awsServices.map(service => {
        console.log(service)
    })
} 
else if(argv.lo){

    ['us-east-1','us-east-2'].map( region => {
        AWS.config.update({region});
        const ec2  = new AWS.EC2();
        ec2['describeInstances']({}, function(err, data) {
            if (err) {
                console.log("Error", err.stack);
            } else {
                const fileName = `./export/${'ec2'}_${'describeInstances'}_${region}.json`;
                const jsonData = JSON.stringify({"service": "ec2", region, "operation": "describeInstances",...data}, null, 2)
                fs.writeFileSync(fileName, jsonData, (err) => {
                    if (err) console.log(err);
                    console.log('Data written to file');
                });
                console.log('This is after the write call');
            }
        });
    })

} else {
    yargs.showHelp()
}

