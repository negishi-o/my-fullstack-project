import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { AppStage } from './stage';

export class PipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, 'MyPipeline', {
      pipelineName: 'MyFullstackProjectPipeline',
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('negishi-o/my-fullstack-project', 'main', {
          authentication: cdk.SecretValue.secretsManager('github-token'),
        }),
        commands: [
          'npm ci',
          'npm run build',
          'npx cdk synth'
        ],
      }),
    });

    pipeline.addStage(new AppStage(this, 'DeployStage'));
  }
}
