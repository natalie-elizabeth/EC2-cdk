#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { EC2CdkStack } from '../lib/e_c2-cdk-stack';

const app = new cdk.App();
new EC2CdkStack(app, 'EC2CdkStack', {
    env: {
        region: "us-east-1",
        account: "773713188930"
    }
});