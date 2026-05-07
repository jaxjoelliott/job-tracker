# ApplicationFlow

![deploy](https://github.com/jaxjoelliott/application-flow/actions/workflows/deploy.yml/badge.svg)

Deployed serverless HTTP API to track job application information.

# What Problem it Solves

Keeping track of your job applications is always a chore. ApplicationFlow is a serverless REST API that organizes that data with full CRUD operations.

## Stack

Lambda · API Gateway · DynamoDB · Node.js · TypeScript · Terraform · GitHub Actions

## Structure

src/handlers/ — Lambda functions
terraform/ — infrastructure as code (DynamoDB table, Lambda functions, IAM roles, policies, attachments)

## Architecture

POST /applications → API Gateway → createApplication Lambda → DynamoDB
GET /applications → API Gateway → listApplications Lambda → DynamoDB
GET /applications/{id} → API Gateway → getApplication Lambda → DynamoDB
PUT /applications/{id} → API Gateway → updateApplication Lambda → DynamoDB
DELETE /applications/{id} → API Gateway → deleteApplication Lambda → DynamoDB

## Base URL
`https://a52etcbuk7.execute-api.us-east-1.amazonaws.com`

## Data Model

id: id of application, used to access for updates/deletion/get
company: Name of company applied to
position: Name of position applied to
status: Current application status (submitted | in consideration | rejected | accepted)
date_applied: Date applied to position
wage: Projected wage
link: link to company website
contact: contact info
free_notes: Free space to add extra notes on position

## Setup

1. Clone the repo
2. Run `npm install`
3. Configure AWS CLI: `aws configure sso`
4. Build: `npm run build`
5. Zip functions into terraform folder `zip -r terraform/function.zip dist`
6. Deploy infrastructure: `cd terraform && terraform apply`

## Deployment

Automatically deployed with Terraform through GitHub Actions

## CI/CD

Every push to `main` triggers a GitHub Actions pipeline that:

1. Installs dependencies and runs lint and tests
2. Configures AWS credentials
3. Compiles TypeScript and zips the output
4. Runs `terraform apply` to deploy to AWS

## Testing

npm test
