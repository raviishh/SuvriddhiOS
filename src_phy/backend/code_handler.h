#pragma once
#include "civetweb.h"
#include <string>

int handle_save(struct mg_connection *conn, void *cbdata);
int handle_load(struct mg_connection *conn, void *cbdata);
int handle_list(struct mg_connection *conn, void *cbdata);