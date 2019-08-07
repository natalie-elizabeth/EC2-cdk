import cdk = require('@aws-cdk/core');
import ec2 = require('@aws-cdk/aws-ec2');
import docdb = require('@aws-cdk/aws-docdb');


export class Ec2CdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // Open port 22 for SSH connection from anywhere
    const port = 27017;
    const vpc = new ec2.Vpc(this, 'nat-Vpc', {
      cidr: "10.0.0.0/16",
      maxAzs: 3
    });

    const SecurityGroup = new ec2.SecurityGroup(this, 'SecurityGroup', {
      vpc,
      securityGroupName: "nat-test-sg",
      description: "Allow ssh access to ec2 instances from anywhere",
      allowAllOutbound: true
    });
    SecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'allows public ssh access')

    // We are using the latest AMAZON LINUX AMI
    const awsAMI = new ec2.AmazonLinuxImage({ generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2 });

    // instance details
    const ec2Instance = new ec2.CfnInstance(this, 'nat-test-instance', {
      imageId: 'ami-0c7b1050b1d0171bd',
      instanceType: "t2.micro",
      monitoring: false,
      tags: [
        { "key": "Name", value: "nat-test-instance" }
      ],
      networkInterfaces: [
        {
          deviceIndex: "0",
          associatePublicIpAddress: true,
          subnetId: vpc.publicSubnets[0].subnetId,
          groupSet: [SecurityGroup.securityGroupId]
        }
      ]
    })
    // Docdb must have a DB subnet group and uses that and your AZ to select a subnet and IP to associate your cluster
    const sfdocCluster = new docdb.CfnDBCluster(this, "SfDocCluster", {
      storageEncrypted: true,
      availabilityZones: vpc.availabilityZones.splice(3),
      dbClusterIdentifier: "sf-docdb-cluster",
      masterUsername: process.env.MASTER_USERNAME,
      masterUserPassword: process.env.MASTER_PASSWORD,
      vpcSecurityGroupIds: [SecurityGroup.securityGroupName],
      port
    })


  }
}
