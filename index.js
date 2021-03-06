const AWS = require('aws-sdk');

exports.handler = async (event) => {
  AWS.config.update({ region: process.env.REGION });
  AWS.config.apiVersions = {
    cloudwatch: '2010-08-01',
    ec2: '2016-11-15',
    apiVersion: '2011-01-01'
  };

  const id = event.detail["instance-id"]
  const cloudwatch = new AWS.CloudWatch();
  const ec2 = new AWS.EC2();
  const autoscaling = new AWS.AutoScaling();

  console.info("Caught termination event for \n" + id)
  console.info("Getting more info about the instance")

  var instanceType;
  var instanceLaunchTime;
  var instanceAZ;
  var instanceASG;
  var instancePrivateIP;
  var instanceSubnet;
  var instanceVPC;
  var instanceUptime;

  var params = {
    InstanceIds: [
      id
    ]
  };

  await ec2.describeInstances(params, function (err, data) {
    if (err) {
      console.log(err, err.stack);
    }
    else {
      instanceType = data.Reservations[0].Instances[0].InstanceType;
      instanceLaunchTime = data.Reservations[0].Instances[0].LaunchTime;
      instanceAZ = data.Reservations[0].Instances[0].Placement.AvailabilityZone;
      instancePrivateIP = data.Reservations[0].Instances[0].PrivateIpAddress;
      instanceSubnet = data.Reservations[0].Instances[0].SubnetId;
      instanceVPC = data.Reservations[0].Instances[0].VpcId;
      instanceUptime = (new Date() - new Date(instanceLaunchTime)) / 1000;
    }
  }).promise();

  console.log("Instance type:", instanceType);
  console.log("Instance AZ:", instanceAZ);
  console.log("Instance VPC: ", instanceVPC);
  console.log("Instance subnet: ", instanceSubnet);
  console.log("Instance private IP: ", instancePrivateIP);
  console.log("Instance launch time:", instanceLaunchTime);
  console.log("Instance uptime: ", instanceUptime, "seconds");

  await autoscaling.describeAutoScalingInstances(params, function (err, data) {
    if (err) {
      console.log(err, err.stack);
    }
    else {
      instanceASG = data.AutoScalingInstances[0].AutoScalingGroupName;
    }
  }).promise();

  console.log("Instance ASG:", instanceASG);

  var params = {
    MetricData: [
      {
        MetricName: 'SpotTerminationEvent',

        Dimensions: [
          {
            Name: 'instance-id',
            Value: id,
          },
          {
            Name: 'ASG',
            Value: instanceASG,
          },
          {
            Name: 'AZ',
            Value: instanceAZ,
          },
          {
            Name: 'instance-type',
            Value: instanceType,
          },
          {
            Name: 'private-ip',
            Value: instancePrivateIP,
          },
          {
            Name: 'VPC',
            Value: instanceVPC,
          },
          {
            Name: 'subnet',
            Value: instanceSubnet,
          },
        ],
        Timestamp: new Date(),
        Value: '1',
      },
      {
        MetricName: 'SpotTerminationEvent',

        Dimensions: [
          {
            Name: 'instance-type',
            Value: instanceType,
          }
        ],
        Timestamp: new Date(),
        Value: '1',
      },
      {
        MetricName: 'SpotTerminationEvent',

        Dimensions: [
          {
            Name: 'AZ',
            Value: instanceAZ,
          }
        ],
        Timestamp: new Date(),
        Value: '1',
      },
      {
        MetricName: 'SpotTerminationEvent',

        Dimensions: [
          {
            Name: 'ASG',
            Value: instanceASG,
          }
        ],
        Timestamp: new Date(),
        Value: '1',
      },
      {
        MetricName: 'SpotTerminationEvent',

        Dimensions: [
          {
            Name: 'VPC',
            Value: instanceVPC,
          }
        ],
        Timestamp: new Date(),
        Value: '1',
      },
      {
        MetricName: 'SpotTerminationEvent',

        Dimensions: [
          {
            Name: 'subnet',
            Value: instanceSubnet,
          }
        ],
        Timestamp: new Date(),
        Value: '1',
      },
      {
        MetricName: 'SpotUptimeSeconds',

        Dimensions: [
          {
            Name: 'instance-id',
            Value: id,
          },
          {
            Name: 'ASG',
            Value: instanceASG,
          },
          {
            Name: 'AZ',
            Value: instanceAZ,
          },
          {
            Name: 'instance-type',
            Value: instanceType,
          },
          {
            Name: 'private-ip',
            Value: instancePrivateIP,
          },
          {
            Name: 'VPC',
            Value: instanceVPC,
          },
          {
            Name: 'subnet',
            Value: instanceSubnet,
          },
        ],
        Timestamp: new Date(),
        Value: instanceUptime,
      },

    ],
    Namespace: 'EC2Spot'
  };

  await cloudwatch.putMetricData(params, function (err, data) {
    if (err) {
      console.error(err, err.stack);
    }
  }).promise();
};
