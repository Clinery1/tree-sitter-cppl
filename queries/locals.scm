; scopes
(block) @local.scope
(function) @local.scope
(anon_function) @local.scope
(source_file) @local.scope


; definitions
(parameter
  name:(word) @local.definition)
(function
  name:(word) @local.definition)
(function_signature
  name:(word) @local.definition)
(var_decl
  name:(word) @local.definition)
(interface_def
  name:(word) @local.definition)
(type_def
  name:(word) @local.definition)
(match_pattern
  var:(word) @local.definition)


; refs
(function_call
  name:(word) @local.reference)
(function_call
  path:(associated_path) @local.reference)
(var
  (word) @local.reference)
(object_field
  name:(word) @local.reference)
