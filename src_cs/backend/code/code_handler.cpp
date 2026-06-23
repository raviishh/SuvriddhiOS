#include <civetweb.h>
#include <fstream>
#include <string>
#include <filesystem>
#include "utils.h"
#include "json.hpp"
#include "constants.h"

int handle_save(struct mg_connection *conn, void *)
{
	json req = GetJsonReq(conn);
	std::string filename = req.value("filename", "");
	std::string code = req.value("code", "");
	std::string safe_name = sanitize_filename(filename);
	write_file((std::string(kSaveDir) + "/" + safe_name + ".c"), code);

	json res = { { "filename", safe_name } };
	std::string out = res.dump();
	send_response(conn, out);
	return 200;
}

int handle_load(struct mg_connection *conn, void *)
{
	json req = GetJsonReq(conn);
	std::string filename = req.value("filename", "");
	std::string safe_name = sanitize_filename(filename);
	std::ifstream file(std::string(kSaveDir) + "/" + safe_name + ".c");
	std::string code((std::istreambuf_iterator<char>(file)), std::istreambuf_iterator<char>());
	file.close();

	json res = { { "code", code } };
	send_response(conn, res.dump(););
	return 200;
}

int handle_list(struct mg_connection *conn, void *)
{
	json res;
	res["files"] = json::array();
	for (auto &p : std::filesystem::directory_iterator(kSaveDir)) {
		res["files"].push_back(p.path().stem().string());
	}
	send_response(conn, res.dump());
	return 200;
}
