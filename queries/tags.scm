; definitions
(parameter
  name:(word) @name) @definition.parameter
(function
  name:(word) @name) @definition.function
(function_signature
  name:(word) @name) @definition.function
(var_decl
  (static_keyword)
  name:(word) @name) @definition.static
(var_decl
  (const_keyword)
  name:(word) @name) @definition.constant
(var_decl
  name:(word) @name
  data:(anon_function)) @definition.function
(var_decl
  name:(word) @name) @definition.var
(interface_def
  name:(word) @name) @definition.interface
(type_def
  name:(word) @name) @definition.class


; refs
(function_call
  name:(word) @name) @reference.call
(function_call
  path:(associated_path) @name) @reference.call
(var
  (word) @name) @reference.var
(object_field
  name:(word) @name) @reference.var
