#include "python_handler.h"
#include "utils.h"
#include "json.hpp"
#include <fstream>
#include <iostream>
#include <cstdlib>

using json = nlohmann::json;

int handle_python(struct mg_connection *conn, void *ignored) {
    (void)ignored;

    char buf[8192];
    int req_bytes = mg_read(conn, buf, sizeof(buf));

    std::string body(buf, req_bytes);
    json req = json::parse(body);

    std::string code = req["code"];
    json tests = req.value("tests", json::array());

    std::string token = generate_token(16);
    std::string srcPath = "/tmp/" + token + ".py";

    std::ofstream out(srcPath);
    out << code;
    out.close();

    std::string lastInput, lastExpected, lastOutput;
    bool success = true;
    std::string err;

    if (tests.empty()) {
        std::string tmpOut = "/tmp/" + token + ".out";
        std::string runCmd = "python3 " + srcPath + " > " + tmpOut + " 2>&1";
        int ret = std::system(runCmd.c_str());

        lastInput = "";
        lastExpected = "";
        lastOutput = read_file(tmpOut);

        if (ret != 0) {
            success = false;
            err = "Runtime Error";
        }
    } else {
        for (auto &t : tests) {
            std::string input = t.value("input", "");
            std::string expected = t.value("expected", "");

            std::string tmpIn = "/tmp/" + token + ".in";
            std::string tmpOut = "/tmp/" + token + ".out";
            write_file(tmpIn, input);
            std::string runCmd = "timeout 5s python3 " + srcPath + " < " + tmpIn + " > " + tmpOut + " 2>&1";
            int ret = std::system(runCmd.c_str());

            std::string output = read_file(tmpOut);

            lastInput = input;
            lastExpected = expected;
            lastOutput = output;

            if (ret != 0) {
                success = false;
                err = "Runtime Error";
                break;
            }

            if (output != expected) {
                success = false;
                err = "Output is wrong";
                break;
            }

            if (WEXITSTATUS(ret) == 124) {
                err = "Process timed out!";
            }
        }
    }

    json res = {
        {"success", success},
        {"input", lastInput},
        {"expected", lastExpected},
        {"output", lastOutput},
        {"error", success ? json(nullptr) : json(err)}
    };

    std::string output = res.dump();
    send_response(conn, output);

    return 200;
}

