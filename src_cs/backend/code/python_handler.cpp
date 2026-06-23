#include "python_handler.h"

#include <cstdlib>

#include "test_handler.h"

using json = nlohmann::json;

int HandlePython(struct mg_connection *conn, void *)
{
	json req = GetJsonReq(conn);
	json tests = req.value("tests", json::array());
	json res = RunTests(tests, GenerateToken(16), Language::kPython);
	SendResponse(conn, res.dump());
	return 200;
}
