# AWS Well-Architectured Review

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

**What's Missing** No retry logic, no graceful error handling, no input validation

**What I'd Improve** Check what type of error happens for Lambdas in try/catch blocks

## Performance Efficiency -

## Cost Optimization

## Sustainability
