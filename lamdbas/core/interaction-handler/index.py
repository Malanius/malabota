from cmath import log
import json
import os

from aws_lambda_powertools import Logger
from aws_lambda_powertools.utilities import parameters
from nacl.signing import VerifyKey
from nacl.exceptions import BadSignatureError


ALLOWED_ORIGIN = os.getenv("ALLOWED_ORIGIN", "*")
SECRET_NAME = os.getenv("DISCORD_APP_SECRET_NAME")
PUBLIC_KEY_FIELD = os.getenv("DISCORD_PUBLIC_KEY_FIELD")
PUBLIC_KEY = parameters.get_secret(SECRET_NAME, "json")[PUBLIC_KEY_FIELD]
verify_key = VerifyKey(bytes.fromhex(PUBLIC_KEY))
logger = Logger()


def error_response(code: int, message: str):
    return{
        "statusCode": code,
        "headers": {
            "Access-Control-Allow-Origin": ALLOWED_ORIGIN
        },
        "body": json.dumps({"error": message}),
        "isBase64Encoded": False
    }


@logger.inject_lambda_context(log_event=True)
def handler(event, context):
    raw_body = event["body"]
    logger.debug("Raw body: %s", raw_body)
    request_body = json.loads(raw_body)
    logger.debug("Parsed body: %s", request_body)
    request_headers = event["headers"]
    signature = request_headers["x-signature-ed25519"]
    logger.debug("Signature: %s", signature)
    timestamp = request_headers["x-signature-timestamp"]
    logger.debug("Timestamp: %s", timestamp)

    try:
        verify_key.verify(f"{timestamp}{raw_body}".encode(), bytes.fromhex(signature))
    except BadSignatureError:
        logger.exception("Failed to verify signature!")
        return error_response(401, "invalid request signature")

    # TODO: check and reply for ping
    # TODO: send interaction message to EventBridge
    # TODO: respond to interaction with defer
