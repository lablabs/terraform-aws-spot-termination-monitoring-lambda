# EC2Spot Instance Termination Monitoring Lambda

![Terraform validation](https://github.com/lablabs/terraform-aws-sf/workflows/Terraform%20validation/badge.svg?branch=master)

## Overview

Deploy a lambda function triggered by Spot instance interruption warning event.
Creates custom CloudWatch metrics indicating when the interruption event occured.

Creates a metric called `SpotTerminationEvent` with the following dimensions:
  * instance-type
  * ASG, AZ, instance-id, instance-type
  * ASG
  * AZ

## Examples

See [Basic example](examples/basic/README.md) for further information.

<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
## Requirements

No requirements.

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| aws\_region | n/a | `any` | n/a | yes |
| name | n/a | `any` | n/a | yes |
| tags | n/a | `any` | n/a | yes |
| lambda\_function\_version | Version of lambda function. See https://github.com/lablabs/terraform-aws-spot-termination-monitoring-lambda/releases | `string` | `"0.0.1"` | no |
| lambda\_function\_zip\_base\_url | Base URL of zip file with lambda function code. Path part with version number (see `lambda_function_version` variable) will be added automatically) | `string` | `"https://github.com/lablabs/terraform-aws-spot-termination-monitoring-lambda/releases/download/"` | no |
| lambda\_function\_zip\_filename | Filename of zip file with lambda function code. Version number (see `lambda_function_version` variable) and `.zip` extension will be added automatically. | `string` | `"aws-spot-termination-monitoring-lambda-"` | no |

## Outputs

No output.

<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
