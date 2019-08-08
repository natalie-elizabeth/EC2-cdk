import cdk = require('@aws-cdk/core');
import cloudwatch = require('@aws-cdk/aws-cloudwatch');
import { GraphWidget, Metric, AlarmWidget } from '@aws-cdk/aws-cloudwatch';

export class CloudwatchAppStack extends cdk.Stack {
    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const metric = new Metric({
            namespace: 'AWS/SQS',
            metricName: 'ApproximateNumberOfMessagesVisible',
        });

        const alarm = new cloudwatch.Alarm(this, 'SfAlarm', {
            metric: metric,
            threshold: 100,
            evaluationPeriods: 3,
            datapointsToAlarm: 2
        })

        const sfdashboard = new cloudwatch.Dashboard(this, 'SfDashboard', {
            dashboardName: 'SfDashboard'
        });

        sfdashboard.addWidgets(new GraphWidget({
            title: "Experiment one",
            left: [metric],
            right: [metric]

        }));
        sfdashboard.addWidgets(new AlarmWidget({
            title: "Alarm Widget",
            alarm
        }))
    }
}