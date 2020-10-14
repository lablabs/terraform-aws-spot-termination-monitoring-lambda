variable "aws_region" {}
variable "name" {}
variable "tags" {}

variable "lambda_function_zip_filename" {
  type        = string
  description = "Filename of zip file with lambda function code. Version number (see `lambda_function_version` variable) and `.zip` extension will be added automatically."
  default     = "aws-spot-termination-monitoring-lambda-"
}

variable "lambda_function_version" {
  type        = string
  description = "Version of lambda function. See https://github.com/lablabs/terraform-aws-spot-termination-monitoring-lambda/releases"
  default     = "0.0.2"
}

variable "lambda_function_zip_base_url" {
  type        = string
  description = "Base URL of zip file with lambda function code. Path part with version number (see `lambda_function_version` variable) will be added automatically)"
  default     = "https://github.com/lablabs/terraform-aws-spot-termination-monitoring-lambda/releases/download/"
}
