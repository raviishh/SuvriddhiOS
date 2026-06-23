#ifndef CODE_HANDLER_H
#define CODE_HANDLER_H

#include "../helpers/common.h"

int HandleSave(struct mg_connection *conn, void *);
int HandleLoad(struct mg_connection *conn, void *);
int HandleList(struct mg_connection *conn, void *);

#endif // CODE_HANDLER_H
