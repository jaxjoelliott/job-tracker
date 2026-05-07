

terraform {
  backend "s3" {
    bucket = "applicationflow-dev-jackson"
    key    = "applicationflow/terraform.tfstate"
    region = "us-east-1"
  }
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

// IAM Role for Lambda function with basic permissions and Put_Item_Policy
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
// Policy to allow Lambda function to put items into job-applications table
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
        Resource = aws_dynamodb_table.job_applications_table.arn
      },
    ]
  })
}


// Policy to allow Lambda function to list items from job-applications table
resource "aws_iam_policy" "List_Items_Policy" {
  name        = "ListItemsPolicy"
  path        = "/"
  description = "DynamoDB ListItems policy for Lambda function"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "dynamodb:Scan"
        ]
        Effect   = "Allow"
        Resource = aws_dynamodb_table.job_applications_table.arn
      },
    ]
  })
}

// Policy to allow Lambda function to get item from job-applications table
resource "aws_iam_policy" "Get_Item_Policy" {
  name        = "GetItemPolicy"
  path        = "/"
  description = "DynamoDB GetItem policy for Lambda function"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "dynamodb:GetItem"
        ]
        Effect   = "Allow"
        Resource = aws_dynamodb_table.job_applications_table.arn
      },
    ]
  })
}

// Policy to allow Lambda function to update item in job-applications table
resource "aws_iam_policy" "Update_Item_Policy" {
  name        = "UpdateItemPolicy"
  path        = "/"
  description = "DynamoDB UpdateItem policy for Lambda function"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "dynamodb:UpdateItem"
        ]
        Effect   = "Allow"
        Resource = aws_dynamodb_table.job_applications_table.arn
      },
    ]
  })
}

// Policy to allow Lambda function to delete item from job-applications table
resource "aws_iam_policy" "Delete_Item_Policy" {
  name        = "DeleteItemPolicy"
  path        = "/"
  description = "DynamoDB DeleteItem policy for Lambda function"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "dynamodb:DeleteItem"
        ]
        Effect   = "Allow"
        Resource = aws_dynamodb_table.job_applications_table.arn
      },
    ]
  })
}

// Attach AWSLambdaBasicExecutionRole to basic_lambda_role
resource "aws_iam_role_policy_attachment" "basic_lambda_policy_attachment" {
  role     = aws_iam_role.basic_lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

// Attach Put_Item_Policy to basic_lambda_role
resource "aws_iam_role_policy_attachment" "DynamoDBPutItemPolicyAttachment" {
  role     = aws_iam_role.basic_lambda_role.name
  policy_arn = aws_iam_policy.Put_Item_Policy.arn
}

// Attach List_Items_Policy to basic_lambda_role
resource "aws_iam_role_policy_attachment" "DynamoDBListItemsPolicyAttachment" {
  role     = aws_iam_role.basic_lambda_role.name
  policy_arn = aws_iam_policy.List_Items_Policy.arn
}

// Attach Get_Item_Policy to basic_lambda_role
resource "aws_iam_role_policy_attachment" "DynamoDBGetItemPolicyAttachment" {
  role     = aws_iam_role.basic_lambda_role.name
  policy_arn = aws_iam_policy.Get_Item_Policy.arn
}

// Attach Update_Item_Policy to basic_lambda_role
resource "aws_iam_role_policy_attachment" "DynamoDBUpdateItemPolicyAttachment" {
  role     = aws_iam_role.basic_lambda_role.name
  policy_arn = aws_iam_policy.Update_Item_Policy.arn
}

//. Attach Delete_Item_Policy to basic_lambda_role
resource "aws_iam_role_policy_attachment" "DynamoDBDeleteItemPolicyAttachment" {
  role     = aws_iam_role.basic_lambda_role.name
  policy_arn = aws_iam_policy.Delete_Item_Policy.arn
}

// DynamoDB table resource for job applications
resource "aws_dynamodb_table" "job_applications_table" {
  name = "job-applications"
  billing_mode = "PAY_PER_REQUEST"
  hash_key = "id"
  attribute {
    name = "id"
    type = "S"
  }
}

// Lambda function resource createApplication
resource "aws_lambda_function" "create_application" {
  function_name = "createApplication"
  role          = aws_iam_role.basic_lambda_role.arn
  handler       = "dist/handlers/createApplication.handler"
  runtime       = "nodejs22.x"
  filename      = "function.zip"
  source_code_hash = filebase64sha256("function.zip")

  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.job_applications_table.name
    }
  }
}
// Lambda function resource listApplications
resource "aws_lambda_function" "list_applications" {
  function_name = "listApplications"
  role          = aws_iam_role.basic_lambda_role.arn
  handler       = "dist/handlers/listApplications.handler"
  runtime       = "nodejs22.x"
  filename      = "function.zip"
  source_code_hash = filebase64sha256("function.zip")
  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.job_applications_table.name
    }
  }
}

// Lambda function resource getApplication
resource "aws_lambda_function" "get_application" {
  function_name = "getApplication"
  role          = aws_iam_role.basic_lambda_role.arn
  handler       = "dist/handlers/getApplication.handler"
  runtime       = "nodejs22.x"
  filename      = "function.zip"
  source_code_hash = filebase64sha256("function.zip")
  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.job_applications_table.name
    }
  }
}

// Lambda function resource updateApplication
resource "aws_lambda_function" "update_application" {
  function_name = "updateApplication"
  role          = aws_iam_role.basic_lambda_role.arn
  handler       = "dist/handlers/updateApplication.handler"
  runtime       = "nodejs22.x"
  filename      = "function.zip"
  source_code_hash = filebase64sha256("function.zip")
  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.job_applications_table.name
    }
  }
}

// Lambda function resource deleteApplication
resource "aws_lambda_function" "delete_application" {
  function_name = "deleteApplication"
  role          = aws_iam_role.basic_lambda_role.arn
  handler       = "dist/handlers/deleteApplication.handler"
  runtime       = "nodejs22.x"
  filename      = "function.zip"
  source_code_hash = filebase64sha256("function.zip")

  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.job_applications_table.name
    }
  }
}




