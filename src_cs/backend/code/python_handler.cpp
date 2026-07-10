#include "python_handler.h"

#include <cstdlib>

#include "test_handler.h"

#include <filesystem>

#include <iostream>

using json = nlohmann::json;

int HandlePython(struct mg_connection *conn, void *)
{
	json req = GetJsonReq(conn);

	std::string code = req["code"];
	json tests = req.value("tests", json::array());
	std::string token = GenerateToken(16);
	std::string path = "/tmp/" + token + ".py";

	WriteFile(path, code);

	json res = RunTests(tests, token, Language::kPython);

	std::filesystem::remove(path);

	SendResponse(conn, res.dump());
	std::cout << req.dump(4) << std::endl;

    return 200;
}
static void TrimTrailingWhitespace(std::string &s)
{
    while (!s.empty() &&
          (s.back() == '\n' ||
           s.back() == '\r' ||
           s.back() == ' '  ||
           s.back() == '\t'))
    {
        s.pop_back();
    }
}