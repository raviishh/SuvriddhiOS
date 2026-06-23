#include "run_handler.h"
#include "utils.h"
#include "json.hpp"
#include <fstream>
#include <iostream>
#include <cstdlib>
#include "test_handler.h"

using json = nlohmann::json;

int handle_run(struct mg_connection *conn, void *ignored)
{
	json req = GetJsonReq(struct mg_connection *conn);
	std::string token = req["token"];
	std::string exePath = "/tmp/" + token;
	if (!file_exists(exePath)) {
		json res = { { "success", false },
			     { "input", nullptr },
			     { "expected", nullptr },
			     { "output", nullptr },
			     { "error", "Code is not compiled" } };
		send_response(conn, res.dump());
		return 200;
	}

	json req = GetJsonReq(struct mg_connection *conn);
	json tests = req.value("tests", json::array());
	json res = RunTests(tests, token, Language::kC);
	send_response(conn, res.dump());
	return 200;
}
