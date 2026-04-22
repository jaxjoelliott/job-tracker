

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

resource "aws_dynamodb_table" "basic-dynamodb-table" {
  name          = var.table_name
  billing_mode  = "PAY_PER_REQUEST"
  hash_key = "id"

  attribute {
  name = "id"
  type = "S"
}
}



