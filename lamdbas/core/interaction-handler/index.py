import json
import os

from aws_lambda_powertools import Logger
logger = Logger()

ALLOWED_ORIGIN = os.getenv("ALLOWED_ORIGIN", "*")


@logger.inject_lambda_context(log_event=True)
def handler(event, context):
    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": ALLOWED_ORIGIN
        },
        "body": json.dumps({"status": "working"}),
        "isBase64Encoded": False
    }
