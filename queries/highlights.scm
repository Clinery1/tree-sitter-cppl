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
(const_keyword) @keyword
(static_keyword) @keyword
(and_keyword) @keyword
(or_keyword) @keyword
(in_keyword) @keyword
(is_keyword) @keyword
(true_keyword) @boolean
(false_keyword) @boolean

; function things
(function name:(word) @function)
(function_signature name:(word) @function)
(parameter name:(word) @variable.parameter)

; type things
(named_type name:(word) @type)
(builtin_type) @type.builtin
(visibility) @keyword
(object_type_field name:(word) @field)

; enum things
(enum_stmt name:(word) @type.definition)

; expr things
(object_field name:(word) @field)
(var
  (word) @error
)
(var
  (word) @variable
)
(var
  (word) @constant
  (#match? @constant "^[A-Z_][A-Z0-9_]$"))
(field_path right:(word) @field)
(associated_path path:(word) @include)
; function/method call things
(method_call (field_path right:(word) @function.method))
(function_call name:(word) @function)
(function_call path:(associated_path last:(word) @function))

; imports
(import_path
  path:(word) @include
  (#match? @include "^[a-z_][a-z0-9_]*$"))
(import_path
  path:(word) @type
  (#match? @type "^[A-Z][A-Za-z0-9_]*$"))
(import_path
  path:(word) @constant
  (#match? @constant "^[A-Z][A-Z0-9_]*$"))

; typedef
(type_def name:(word) @type.definition)

; interface
(interface_def name:(word) @type)

; match things
(match_pattern
  method_name:(word) @function.method)
(match_pattern
  var:(word) @variable)
(match_pattern_structure
  type:(word) @type)
(match_pattern_structure_item
  field:(word) @field)
(match_pattern_structure_item
  rename:(word) @var)

; var things
(var_decl name:(word) @variable)
(var_decl
  (const_keyword)
  name:(word) @constant)
(var_decl
  (static_keyword)
  name:(word) @constant)

; labels
(label) @label

; literal values
(number) @number
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

"&" @punctuation.operator
"|" @punctuation.operator
"=" @punctuation.operator
"!=" @punctuation.operator
">=" @punctuation.operator
"<=" @punctuation.operator
">" @punctuation.operator
"<" @punctuation.operator
"-" @punctuation.operator
"+" @punctuation.operator
"*" @punctuation.operator
"/" @punctuation.operator
"%" @punctuation.operator

"::" @punctuation.delimiter
"." @punctuation.delimiter
"," @punctuation.delimiter

";" @punctuation
":" @punctuation

"<-" @punctuation.special
":=" @punctuation.special
(var_decl ":" @punctuation.special) ; these two are for the `NAME:TYPE=VALUE` syntax
(var_decl "=" @punctuation.special)

"..." @property

; comments
(comment) @comment
(doc_comment) @property
