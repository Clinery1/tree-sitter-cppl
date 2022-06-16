// Copied from https://github.com/tree-sitter/tree-sitter-rust/blob/09d8c029c3e5c8b09ec66434e86f916a95c41c5f/src/scanner.c
// (tree-sitter-rust/src/scanner.c in commit 09d8c02)


#include <tree_sitter/parser.h>
#include <wctype.h>

enum TokenType {
    RAW_STRING,
};

void *tree_sitter_cppl_external_scanner_create() { return NULL; }
void tree_sitter_cppl_external_scanner_destroy(void *p) {}
void tree_sitter_cppl_external_scanner_reset(void *p) {}
unsigned tree_sitter_cppl_external_scanner_serialize(void *p, char *buffer) { return 0; }
void tree_sitter_cppl_external_scanner_deserialize(void *p, const char *b, unsigned n) {}

bool tree_sitter_cppl_external_scanner_scan(void *payload,TSLexer *lexer,const bool *valid_symbols) {
    while (iswspace(lexer->lookahead)) lexer->advance(lexer, true);
    if (valid_symbols[RAW_STRING]) {
        if (lexer->lookahead == 'r') {
            lexer->result_symbol=RAW_STRING;
            lexer->advance(lexer,false);
            unsigned opening_hash_count=0;
            while (lexer->lookahead=='#') {
                lexer->advance(lexer,false);
                opening_hash_count++;
            }
            if (opening_hash_count==0) {
                return false;
            }
            unsigned hash_count = 0;
            for (;;) {
                if (lexer->lookahead==0) {
                    return false;
                } else if (lexer->lookahead=='#') {
                    hash_count++;
                } else {
                    hash_count=0;
                }
                lexer->advance(lexer,false);
                if (hash_count==opening_hash_count) {
                    return true;
                }
            }
        }
    }
    return false;
}
