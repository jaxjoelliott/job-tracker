

terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

provider "aws" {
  region = var.region_name
}

resource "aws_iam_role" "basic_lambda_role" {
  name = "application-flow-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_policy" "Put_Item_Policy" {
  name        = "PutItemPolicy"
  path        = "/"
  description = "DynamoDB PutItem policy for Lambda function"

  # Terraform's "jsonencode" function converts a
  # Terraform expression result to valid JSON syntax.
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "dynamodb:PutItem"
        ]
        Effect   = "Allow"
        Resource = aws_dynamodb_table.basic_dynamodb_table.arn
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "basic_lambda_policy_attachment" {
  role     = aws_iam_role.basic_lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "DynamoDBPutItemPolicyAttachment" {
  role     = aws_iam_role.basic_lambda_role.name
  policy_arn = aws_iam_policy.Put_Item_Policy.arn
}

resource "aws_dynamodb_table" "basic_dynamodb_table" {
  name = "job-applications"
  billing_mode = "PAY_PER_REQUEST"
  hash_key = "id"
  attribute {
    name = "id"
    type = "S"
  }
}

resource "aws_lambda_function" "basic_lambda_function" {
  function_name = "createApplication"
  role          = aws_iam_role.basic_lambda_role.arn
  handler       = "dist/handlers/createApplication.handler"
  runtime       = "nodejs22.x"

  filename      = "function.zip"

  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.basic_dynamodb_table.name
    }
  }
}







