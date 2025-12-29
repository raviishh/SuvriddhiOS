#include "compile_handler.h"
#include "utils.h"
#include "json.hpp"
#include <fstream>
#include <iostream>
#include <cstdlib>

using json = nlohmann::json;

int handle_compile(struct mg_connection *conn, void *ignored) {
    (void)ignored;

    char buf[8192];
    int req_bytes = mg_read(conn, buf, sizeof(buf));

    std::string body(buf, req_bytes);
    json req = json::parse(body);

    std::string code = req["code"];
    std::string token = generate_token(16);
    std::string srcPath = "/tmp/" + token + ".c";
    std::string outPath = "/tmp/" + token;

    std::ofstream out(srcPath);
    out << code;
    out.close();

    std::string compileCmd = "gcc -std=c11 -O2 " + srcPath + " -o " + outPath + " 2>/tmp/" + token + ".log";
    int ret = std::system(compileCmd.c_str());

    json res;
    if (ret == 0) {
        res["token"] = token;
        res["error"] = nullptr;
    } else {
        res["token"] = nullptr;
        res["error"] = read_file("/tmp/" + token + ".log");
    }


    std::string output = res.dump();
    send_response(conn, output);

    return 200;
}
