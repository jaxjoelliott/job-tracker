# AWS Well-Architected Review

## Operational Excellence - How well you can run, monitor, and improve system over time

**What's Good** Lambda's log when requests are received and when errors occur, IAM least privilege refactor for Lambdas

**What's Missing** More detailed logs for endpoints, more robust alarms

**What I'd Improve** Alarms need to be provisioned in Terraform, splitting Terraform into multiple files

## Security - Protecting data, assets, and systems

**What's Good** IAM least privilege for Lambdas

**What's Missing** API Gateway has no authentication at all, no automated security

**What I'd Improve** Alarms are very basic testing purposes, not much intent behind them

## Reliability - Performing intended function correctly and consistently when expected to

**What's Good** Serverless gives a lot of reliability for free: Lambda and DynamoDB handle variable load well, try/catch in all functions

**What's Missing** No retry logic, no input validation

**What I'd Improve** Check what type of error happens for Lambdas in try/catch blocks

## Performance Efficiency - Using cloud resources efficiently to meet requirements

**What's Good** All resources are handled by AWS/serverless app, IaC via Terraform,

**What's Missing** Automatic performance tests

**What I'd Improve** Alarms provisioned in Terraform, metrics setup to measure KPIs, measure best timeout for Lambda functions, measure Lambda cold starts

## Cost Optimization - Ability to run systems that deliver value at lowest price

**What's Good** Consumption model, using managed services, efficient number of resources

**What's Missing** Usage and cost monitors/alarms, change control implementation

**What I'd Improve** Setup billing alarm in AWS for cost spikes

## Sustainability - Focuses on energy consumption and efficiency

**What's Good** Lambdas spin up only when in use, use of managed services, serverless, good region selection, aligned with demand (resume piece)

**What's Missing** No monitoring of resource utilization over time

**What I'd Improve** Review and right-size resources if usage patterns change
