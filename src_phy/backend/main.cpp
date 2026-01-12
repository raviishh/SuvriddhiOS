#include <civetweb.h>
#include "compile_handler.h"
#include <cstring>
#include <unistd.h>
#include "run_handler.h"
#include "code_handler.h"
#include <filesystem>
#include "constants.h"
#include <iostream>
#include "python_handler.h"

int main() {
    
    if (!std::filesystem::is_directory(SAVE_DIR)) {
        std::cout << "SAVE_DIR doesn't exist" << std::endl;
        return 0;
    }

    const char *options[] = {
        "listening_ports", "8000",
        nullptr
    };

    struct mg_callbacks callbacks;
    memset(&callbacks, 0, sizeof(callbacks));

    mg_context *ctx = mg_start(&callbacks, nullptr, options);

    mg_set_request_handler(ctx, "/api/compile", handle_compile, nullptr);
    mg_set_request_handler(ctx, "/api/run", handle_run, nullptr);
    mg_set_request_handler(ctx, "/api/save", handle_save, nullptr);
    mg_set_request_handler(ctx, "/api/load", handle_load, nullptr);
    mg_set_request_handler(ctx, "/api/list", handle_list, nullptr);
    mg_set_request_handler(ctx, "/api/python", handle_python, nullptr);

    pause();
    
    mg_stop(ctx);
    
    return 0;
}
