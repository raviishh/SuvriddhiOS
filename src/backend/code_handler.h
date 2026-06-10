#pragma once

#ifndef CODE_HANDLER_H
#define CODE_HANDLER_H

#include "libs/civetweb/include/civetweb.h"
#include <string>

struct CodeHandler {
	static int HandleSave(struct mg_connection *conn, void *);
	static int HandleLoad(struct mg_connection *conn, void *);
	static int HandleList(struct mg_connection *conn, void *);
};

#endif // CODE_HANDLER_H
