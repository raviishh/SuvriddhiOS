#include <civetweb.h>
#include <fstream>
#include <string>
#include <filesystem>
#include "utils.h"
#include "json.hpp"
#include "constants.h"

using json = nlohmann::json;

int handle_save(struct mg_connection *conn, void *cbdata) {

    char buf[8192];
    int req_bytes = mg_read(conn, buf, sizeof(buf));

    std::string body(buf, req_bytes);
    json req = json::parse(body);

    std::string filename = req.value("filename", "");
    std::string code = req.value("code", "");

    std::string safe_name = sanitize_filename(filename);
    std::ofstream file(std::string(SAVE_DIR) + "/" + safe_name + ".c");

    file << code;
    file.close();

    json res = {{"filename", safe_name}};
    std::string out = res.dump();

    send_response(conn, out);

    return 200;

}

int handle_load(struct mg_connection *conn, void *cbdata) {

    char buf[8192];
    int req_bytes = mg_read(conn, buf, sizeof(buf));

    std::string body(buf, req_bytes);
    json req = json::parse(body);

    std::string filename = req.value("filename", "");    
    std::string safe_name = sanitize_filename(filename);

    std::ifstream file(std::string(SAVE_DIR) + "/" + safe_name + ".c");
    std::string code((std::istreambuf_iterator<char>(file)), std::istreambuf_iterator<char>());
    file.close();

    json res = {{"code", code}};
    std::string out = res.dump();

    send_response(conn, out);

    return 200;
}

int handle_list(struct mg_connection *conn, void *cbdata) {


    json res;
    res["files"] = json::array();

    for (auto &p : std::filesystem::directory_iterator(SAVE_DIR)) {
        res["files"].push_back(p.path().stem().string());
    }

    // if (res["files"].empty()) {
    //     std::ofstream file(std::string(SAVE_DIR) + "/hello.c");
    //     file << "#include <stdio.h>\n\nint main() {\n\n\tprintf(\"Hello, World\");\n\n\treturn 0;\n}";
    //     file.close();
    //     res["files"].push_back("hello");
    // }

    std::string out = res.dump();

    send_response(conn, out);

    return 200;
}
