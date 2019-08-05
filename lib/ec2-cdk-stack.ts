import cdk = require('@aws-cdk/core');
import ec2 = require('@aws-cdk/aws-ec2');
import { CfnInstance } from '@aws-cdk/aws-ec2';

export class Ec2CdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // Open port 22 for SSH connection from anywhere
    const vpc = ec2.Vpc.fromLookup(this, 'VPC', {
      isDefault: true
    });

    const SecurityGroup = new ec2.SecurityGroup(this, 'SecurityGroup', {
      vpc,
      securityGroupName: "nat-test-sg",
      description: "Allow ssh access to ec2 instances from anywhere",
      allowAllOutbound: true
    });
    SecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'allows public ssh access')

    // We are using the latest AMAZON LINUX AMI
    const awsAMI = new ec2.AmazonLinuxImage({generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2});

    // instance details
    const ec2Instance = new CfnInstance(this, 'nat-test-instance', {
      imageId: 'ami-0c7b1050b1d0171bd',
      instanceType: "t2.micro",
      monitoring: false,
      tags: [
        {"key": "Name", value: "nat-test-instance"}
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
  }
}
