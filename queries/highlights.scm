; keywords
(fn_keyword) @keyword
(type_keyword) @keyword
(interface_keyword) @keyword
(pub_keyword) @keyword
(mut_keyword) @keyword
(impl_keyword) @keyword
(import_keyword) @keyword
(for_keyword) @keyword
(while_keyword) @keyword
(loop_keyword) @keyword
(return_keyword) @keyword
(continue_keyword) @keyword
(match_keyword) @keyword
(enum_keyword) @keyword
(module_keyword) @keyword
(this_keyword) @keyword
(true_keyword) @boolean
(false_keyword) @boolean

; function things
(function name:(word) @function)
(parameter name:(word) @variable.parameter)
(named_type name:(word) @type)
(builtin_type) @type
(visibility) @keyword
(object_field name:(word) @field)

; typedef
(type_def name:(word) @type)

; interface
(interface_def name:(word) @type)

; var things
(var_decl name:(word) @variable)
(var_assign name:(word) @variable)

; labels
(label) @label

; literal values
(number) @constant.builtin
(string) @string
(string_escape) @string.escape
(float) @float
(char) @character

"(" @punctuation.bracket
")" @punctuation.bracket
"[" @punctuation.bracket
"]" @punctuation.bracket
"{" @punctuation.bracket
"}" @punctuation.bracket


";" @punctuation.delimiter
"..." @property

; comments
(comment) @comment
(doc_comment) @comment
