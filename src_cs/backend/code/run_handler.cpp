#include "run_handler.h"

#include <cstdlib>

#include "test_handler.h"

using json = nlohmann::json;

int HandleRun(struct mg_connection *conn, void *)
{
	json req = GetJsonReq(conn);
	std::string token = req["token"];
	std::string exePath = "/tmp/" + token;
	if (!FileExists(exePath)) {
		json res = { { "success", false },
			     { "input", nullptr },
			     { "expected", nullptr },
			     { "output", nullptr },
			     { "error", "Code is not compiled" } };
		SendResponse(conn, res.dump());
		return 200;
	}

	json tests = req.value("tests", json::array());
	json res = RunTests(tests, token, Language::kC);
	SendResponse(conn, res.dump());
	return 200;
}
