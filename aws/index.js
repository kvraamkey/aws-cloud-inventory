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
    .option('query', {
        alias: 'q',
        description: 'Execute and query AWS',
        type: 'boolean',
        default: false
    })
    .option('region', {
        alias: 'r',
        description: 'Restrict the given action to the given region (can be specified multiple times)',
        type: 'array'
    })
    .option('service', {
        alias: 's',
        description: 'Restrict the given action to the given service (can be specified multiple times',
        type: 'array'
    })
    .option('operation', {
        alias: 'o',
        description: 'Restrict the given action to the given operation (can be specified multiple times)',
        type: 'array'
    })
    .help().alias('help', 'h')
    .argv;

// get_regions_by_service

let rawRegiondata = fs.readFileSync('./aws/service_regions.json');

function get_service_regions(requested_service){
    // Given a service name, return a list of region names where this service can have resources,restricted by a possible set of regions. 
    if (['iam', 'cloudfront', 's3', 'route53'].includes(requested_service))
        return []
    return JSON.parse(rawRegiondata)[service];
}

if (argv.ls) {
    awsServices = Object.keys(aws_services).sort()
    awsServices.map(service => {
        console.log(service)
    })
} 
else if(argv.lo){

    // service_region = get_service_regions('ec2');
    // console.log(service_region)

    // service_region.map( region => {
    //     AWS.config.update({region});
        region  = "us-east-1"
        const ec2  = new AWS.EC2({region});
        ec2['describeInstances']({}, function(err, data) {
            if (err) {
                console.log(err.message);
            } else {
                const fileName = `./export/${'ec2'}_${'describeInstances'}_${region}.json`;
                const jsonData = JSON.stringify({"service": "ec2", region, "operation": "describeInstances",...data}, null, 4)
                fs.writeFileSync(fileName, jsonData, (err) => {
                    if (err) console.log(err);
                    console.log('Data written to file');
                });
            }
        });
    // })

} 
else if(argv.query){
    // service
        // region
            // operation
    console.log("querying...",argv)
    const selected_services = argv.service
    console.log(selected_services)
    // selected_services.forEach(service => {
    //     console.log(service)
    // });


} else {
    yargs.showHelp()
}

