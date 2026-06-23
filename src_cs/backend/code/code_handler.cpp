#include "code_handler.h"
#include <fstream>

int HandleSave(struct mg_connection *conn, void *)
{
	json req = GetJsonReq(conn);
	std::string filename = req.value("filename", "");
	std::string code = req.value("code", "");
	std::string safe_name = SanitizeFilename(filename);
	WriteFile((std::string(kSaveDir) + "/" + safe_name + ".c"), code);

	json res = { { "filename", safe_name } };
	std::string out = res.dump();
	SendResponse(conn, out);
	return 200;
}

int HandleLoad(struct mg_connection *conn, void *)
{
	json req = GetJsonReq(conn);
	std::string filename = req.value("filename", "");
	std::string safe_name = SanitizeFilename(filename);
	std::ifstream file(std::string(kSaveDir) + "/" + safe_name + ".c");
	std::string code((std::istreambuf_iterator<char>(file)), std::istreambuf_iterator<char>());
	file.close();

	json res = { { "code", code } };
	SendResponse(conn, res.dump());
	return 200;
}

int HandleList(struct mg_connection *conn, void *)
{
	json res;
	res["files"] = json::array();
	for (auto &p : std::filesystem::directory_iterator(kSaveDir)) {
		res["files"].push_back(p.path().stem().string());
	}
	SendResponse(conn, res.dump());
	return 200;
}
