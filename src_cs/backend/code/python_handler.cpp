#include "python_handler.h"
#include "utils.h"
#include "json.hpp"
#include <fstream>
#include <iostream>
#include <string>
#include <cstdlib>
#include "test_handler.h"

using json = nlohmann::json;

int handle_python(struct mg_connection *conn, void *)
{
	json req = GetJsonReq(struct mg_connection *conn);
	json tests = req.value("tests", json::array());
	json res = RunTests(tests, generate_token(16), Language::kPython);
	send_response(conn, res.dump());
	return 200;
}
