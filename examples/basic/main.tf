locals {
  region = "eu-west-1"
}

provider "aws" {
  region  = local.region
  version = "~> 3.10"
}

module "monitoring-lambda" {
  source     = "../.."
  name       = "ec2spot-termination-monitoring"
  aws_region = local.region
  tags = {
    environment = "dev",
    project     = "shared"
    service     = "monitoring"
  }
}
