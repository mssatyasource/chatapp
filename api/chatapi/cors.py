
from rest_framework.response import Response

class CorsMiddleware(object):

    def process_response(self, req, resp):
        resp["Access-Control-Allow-Origin"] = "*"
        return resp