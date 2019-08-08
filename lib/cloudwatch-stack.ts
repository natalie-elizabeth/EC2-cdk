import cdk = require('@aws-cdk/core');
import cloudwatch = require('@aws-cdk/aws-cloudwatch');
import { GraphWidget, Metric } from '@aws-cdk/aws-cloudwatch';

export class CdkAppStack extends cdk.Stack {
    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const sfdashboard = new cloudwatch.Dashboard(this, 'SfDashboard', { 
            dashboardName: 'SfDashboard'
        });
        
    }
}