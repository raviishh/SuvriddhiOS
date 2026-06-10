#include "libs/civetweb/include/civetweb.h"
#include "compile_handler.h"
#include <cstring>
#include <unistd.h>
#include "run_handler.h"
#include "code_handler.h"
#include <filesystem>
#include "constants.h"
#include <iostream>
#include "python_handler.h"

int main()
{
	if (!std::filesystem::is_directory(kSaveDir)) {
		std::cout << "Save directory (" << kSaveDir << ") doesn't exist" << std::endl;
		return 0;
	}
	const char *options[] = { "listening_ports", "8000", nullptr };
	struct mg_callbacks callbacks;
	memset(&callbacks, 0, sizeof(callbacks));

	mg_context *ctx = mg_start(&callbacks, nullptr, options);
	mg_set_request_handler(ctx, "/api/compile", HandleCPPCompile, nullptr);
	mg_set_request_handler(ctx, "/api/run", HandleRun, nullptr);
	mg_set_request_handler(ctx, "/api/save", CodeHandler::HandleSave, nullptr);
	mg_set_request_handler(ctx, "/api/load", CodeHandler::HandleLoad, nullptr);
	mg_set_request_handler(ctx, "/api/list", CodeHandler::HandleList, nullptr);
	mg_set_request_handler(ctx, "/api/python", HandlePython, nullptr);

	pause();
	mg_stop(ctx);
	return 0;
}
