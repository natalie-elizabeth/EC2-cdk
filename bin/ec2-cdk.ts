#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { Ec2CdkStack } from '../lib/ec2-cdk-stack';
import { CloudwatchAppStack } from '../lib/cloudwatch-stack';

const app = new cdk.App();
// new Ec2CdkStack(app, 'Ec2CdkStack', {
//     env: {
//         region: "us-east-1",
//         account: "773713188930"
//     }
// });

new CloudwatchAppStack(app, 'Ec2CdkStack', {
    env: {
        region: "us-east-1",
        account: "773713188930"
    }
});