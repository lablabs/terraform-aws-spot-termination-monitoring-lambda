resource "aws_iam_role" "this" {
  name = var.name

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_policy" "this" {
  name = var.name
  path = "/"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*",
      "Effect": "Allow"
    },
    {
      "Action": [
        "cloudwatch:PutMetricData",
        "ec2:DescribeInstances",
        "autoscaling:DescribeAutoScalingInstances"
      ],
      "Resource": "*",
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "this" {
  role       = aws_iam_role.this.name
  policy_arn = aws_iam_policy.this.arn
}

resource "aws_cloudwatch_log_group" "this" {
  name              = "/aws/lambda/${var.name}"
  retention_in_days = 14
}

resource "aws_lambda_function" "this" {
  filename      = "${path.module}/lambda.zip"
  function_name = var.name
  role          = aws_iam_role.this.arn
  handler       = "index.handler"

  timeout = "15"

  source_code_hash = filebase64sha256("${path.module}/lambda.zip")

  runtime = "nodejs12.x"

  environment {
    variables = {
      REGION = var.aws_region
    }
  }

  tags = var.tags
}

resource "aws_cloudwatch_event_rule" "this" {
  name        = var.name
  description = "this on Spot instance interruption warning"

  event_pattern = <<EOF
  {
    "detail-type": [
      "EC2 Spot Instance Interruption Warning"
    ],
    "source": [
      "aws.ec2"
    ]
  }
  EOF
}

resource "aws_cloudwatch_event_target" "this" {
  rule = aws_cloudwatch_event_rule.this.name
  arn  = aws_lambda_function.this.arn
}

resource "aws_lambda_permission" "this" {
  statement_id  = "${aws_lambda_function.this.function_name}-AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.this.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.this.arn
}
