variable "table_name" {
  description = "Name of DynamoDB table"
  type        = string
  default     = "job-applications"
}

variable "region_name" {
  description = "AWS region name"
  type        = string
  default     = "us-east-1"
}
