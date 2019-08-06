import cdk = require('@aws-cdk/core');
import ec2 = require('@aws-cdk/aws-ec2');

export class EC2CdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPC for the Database instance
    const vpc = new ec2.Vpc(this, 'VPC', {
      cidr: "10.0.0.0/16",
      maxAzs: 3
    });

    // Instance security group
    const SecurityGroup = new ec2.SecurityGroup(this, 'SecurityGroup', {
      vpc,
      securityGroupName: "nat-test-sg",
      description: "Allow ssh access to ec2 instances from anywhere",
      allowAllOutbound: true
    });
    SecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'allows public ssh access')


    // Instance details
    const ec2Instance = new ec2.CfnInstance(this, 'nat-test-instance', {
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
