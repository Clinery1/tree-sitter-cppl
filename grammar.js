module.exports=grammar({
    name:"cppl",
    word:$=>$.word,
    extras:$=>[
        $.comment,
        $.doc_comment,
        /[\r\t\n ]/,
    ],
    externals:$=>[
        $.raw_string,
    ],
    conflicts:$=>[
        [$.var,$.object_field],
    ],
    rules:{
        source_file:$=>repeat($._statement),
        _statement:$=>choice(
            $.function,
            $.interface_def,
            $.impl_stmt,
            $.enum_stmt,
            seq($._expr,$._statement_end),
            seq($.type_def,$._statement_end),
            seq($.var_decl,$._statement_end),
            seq($.assign,$._statement_end),
            seq($.return_stmt,$._statement_end),
            seq($.continue_stmt,$._statement_end),
            seq($.import_stmt,$._statement_end),
            seq($.function_signature,$._statement_end),
            seq($.module_stmt,$._statement_end),
            "\n",
        ),
        impl_stmt:$=>seq(
            $.impl_keyword,
            optional($._type_parameters),
            optional(seq(field("interface",$._type),$.for_keyword)),
            field("type",$._type),
            $.block,
        ),
        module_stmt:$=>seq(
            $.module_keyword,
            field("name",$.word),
        ),
        enum_stmt:$=>seq(
            $.enum_keyword,
            field("name",$.word),
            optional($._type_parameters),
            "{",
            repeat(seq($._type,",")),
            $._type,
            optional(","),
            "}",
        ),
        import_stmt:$=>seq(
            $.import_keyword,
            $.import_path,
        ),
        import_path:$=>seq(
            field("path",$.word),
            repeat(seq("::",field("path",$.word))),
            optional($.import_block),
        ),
        import_block:$=>seq(
            "::",
            "{",
            repeat(seq($.import_path,",")),
            $.import_path,
            optional(","),
            "}",
        ),
        _expr:$=>choice(
            $.object_create,
            $.block,
            $.data,
            $.var,
            $.field_path,
            $.method_call,
            $.function_call,
            $.anon_function,
            $.boolean_ops,
            $.reference,
            $.comparison,
            $.operand,
            $.factor,
            $.associated_path,
            $.for_loop,
            $.forever_loop,
            $.while_loop,
            $.match,
            $.this_keyword,
            $.is_type,
            seq("(",$._expr,")"),
        ),
        is_type:$=>seq(
            $.is_keyword,
            $._type,
        ),
        reference:$=>prec.left(2,choice(
            seq("&",$._expr),
            seq("&",$.mut_keyword,$._expr),
        )),
        boolean_ops:$=>prec.left(3,choice(
            seq($._expr,$.and_keyword,$._expr),
            seq($._expr,$.or_keyword,$._expr),
        )),
        comparison:$=>prec.left(4,choice(
            seq($._expr,"=",$._expr),
            seq($._expr,"!=",$._expr),
            seq($._expr,">=",$._expr),
            seq($._expr,"<=",$._expr),
            seq($._expr,">",$._expr),
            seq($._expr,"<",$._expr),
        )),
        operand:$=>prec.left(5,choice(
            seq($._expr,"+",$._expr),
            seq($._expr,"-",$._expr),
        )),
        factor:$=>prec.left(6,choice(
            seq($._expr,"*",$._expr),
            seq($._expr,"/",$._expr),
            seq($._expr,"%",$._expr),
        )),
        while_loop:$=>seq(
            $.while_keyword,
            $._expr,
            $.block,
        ),
        for_loop:$=>seq(
            $.for_keyword,
            $.word,
            $.in_keyword,
            $._expr,
            $.block,
        ),
        forever_loop:$=>seq(
            $.loop_keyword,
            $.block,
        ),
        match_pattern:$=>choice(
            $.data,
            $.match_pattern_structure,
            seq(
                ".",
                field("method_name",$.word),
                "(",
                repeat(seq($._expr,",")),
                $._expr,
                optional(","),
                ")",
            ),
            seq(
                ".",
                field("method_name",$.word),
                "(",
                ")",
            ),
            field("var",$.word),
            seq(
                choice("=","!=",">=","<=",">","<"),
                $._expr
            ),
            seq(
                $.is_keyword,
                $._type,
            ),
        ),
        match_pattern_structure:$=>choice(
            seq(
                optional(field("type",$.word)),
                "{",
                repeat(seq($.match_pattern_structure_item,",")),
                $.match_pattern_structure_item,
                optional(seq(",",optional("..."))),
                "}",
            ),
            seq(
                optional(field("type",$.word)),
                "{",
                optional("..."),
                "}",
            ),
        ),
        match_pattern_structure_item:$=>choice(
            field("field",$.word),
            seq(field("field",$.word),":",field("rename",$.word)),
            seq(field("field",$.word),":",$.match_pattern_structure),
        ),
        match:$=>choice(
            seq($.match_keyword,$._expr,"{","}"),
            seq(
                $.match_keyword,
                $._expr,
                "{",
                repeat(seq($.match_pattern,"=>",$._expr,",")),
                seq($.match_pattern,"=>",$._expr),
                optional(","),
                "}",
            ),
        ),
        associated_path:$=>seq(
            field("path",$.word),
            repeat(seq("::",field("path",$.word))),
            seq("::",field("last",$.word)),
        ),
        function_call:$=>prec(2,choice(
            seq(
                field("name",$.word),
                "(",
                optional(seq(
                    repeat(seq(field("arg",$._expr),",")),
                    field("arg",$._expr),
                    optional(","),
                )),
                ")",
            ),
            seq(
                field("path",$.associated_path),
                "(",
                optional(seq(
                    repeat(seq(field("arg",$._expr),",")),
                    field("arg",$._expr),
                    optional(","),
                )),
                ")",
            ),
        )),
        method_call:$=>choice(
            seq(
                $.field_path,
                "(",
                repeat(seq(field("arg",$._expr),",")),
                field("arg",$._expr),
                optional(","),
                ")",
            ),
            seq(
                $.field_path,
                "(",
                ")",
            ),
        ),
        field_path:$=>seq(
            field("left",$._expr),
            ".",
            field("right",$.word),
        ),
        var:$=>$.word,
        object_create:$=>seq(
            "{",
            repeat(seq($.object_field,",",)),
            $.object_field,
            optional(","),
            "}",
        ),
        object_field:$=>choice(
            seq(
                optional($.public),
                optional($.mutable),
                field("name",$.word),
            ),
            seq(
                optional($.public),
                optional($.mutable),
                field("name",$.word),
                "=",
                field("data",$._expr),
            ),
        ),
        data:$=>choice(
            $.float,
            $.number,
            $.char,
            $.string,
            $.true_keyword,
            $.false_keyword,
        ),
        _statement_end:_=>choice(repeat1(";"),"\n"),
        return_stmt:$=>choice(
            seq(
                $.return_keyword,
                optional($.label),
            ),
            seq(
                $.return_keyword,
                optional($.label),
                field("data",$._expr),
            ),
        ),
        continue_stmt:$=>seq(
            $.continue_keyword,
            optional($.label),
        ),
        label:$=>seq(
            "^",
            field("name",$.word),
        ),
        function_signature:$=>seq(
            optional($.public),
            $.fn_keyword,
            field("name",$.word),
            field("parameter",$._parameters),
            optional(seq(":",field("ret_type",$._type))),
        ),
        function:$=>seq(
            optional($.public),
            $.fn_keyword,
            field("name",$.word),
            field("parameter",$._parameters),
            optional(seq(":",field("ret_type",$._type))),
            field("block",$.function_block),
        ),
        anon_function_sig:$=>seq(
            $.fn_keyword,
            field("parameter",$._parameters),
            optional(seq(":",field("ret_type",$._type))),
        ),
        anon_function:$=>seq(
            $.fn_keyword,
            field("parameter",$._parameters),
            optional(seq(":",field("ret_type",$._type))),
            field("block",$.function_block),
        ),
        function_block:$=>$._block,
        type_def:$=>seq(
            optional($.public),
            $.type_keyword,
            field("name",$.word),
            optional(field("type_parameter",$._type_parameters)),
            "=",
            $._type,
        ),
        interface_def:$=>seq(
            optional($.public),
            $.interface_keyword,
            field("name",$.word),
            optional(field("type_parameter",$._type_parameters)),
            field("block",$._block),
        ),
        var_decl:$=>choice(
            seq(    // no type
                optional($.public),
                optional($.mutable),
                field("name",$.word),
                ":=",
                field("data",$._expr),
            ),
            seq(    // typed
                optional($.public),
                optional($.static_keyword),
                optional($.mutable),
                field("name",$.word),
                ":",
                field("ty",$._type),
                "=",
                field("data",$._expr),
            ),
            seq(    // constant
                optional($.public),
                $.const_keyword,
                field("name",$.word),
                ":",
                field("ty",$._type),
                "=",
                field("data",$._expr),
            ),
        ),
        assign:$=>seq(
            field("left",$._expr),
            "<-",
            field("right",$._expr),
        ),
        block:$=>$._block,
        _block:$=>choice(
            seq("{","}"),
            seq(
                "{",
                repeat($._statement),
                "}",
            ),
        ),
        _parameters:$=>choice(
            seq("[","]"),
            seq(
                "[",
                $.this_keyword,
                repeat(seq(",",$.parameter)),
                optional($.var_arg_param),
                "]",
            ),
            seq(
                "[",
                $.mut_keyword,
                $.this_keyword,
                repeat(seq(",",$.parameter)),
                optional($.var_arg_param),
                "]",
            ),
            seq(
                "[",
                repeat(seq($.parameter,",")),
                $.parameter,
                optional($.var_arg_param),
                "]",
            ),
        ),
        var_arg_param:$=>seq(",","...",$.parameter),
        parameter:$=>seq(
            optional($.mut_keyword),
            field("name",$.word),
            ":",
            field("ty",$._type),
        ),
        _type_parameters:$=>seq(
            "[",
            repeat(seq($.type_parameter,",")),
            $.type_parameter,
            optional(","),
            "]",
        ),
        type_parameter:$=>seq(
            field("name",$.word),
            optional(seq(":",field("ty",$._type))),
        ),
        _type:$=>choice(
            $.composite_type,
            $.union_type,
            $.named_type,
            $.object_type,
            $.builtin_type,
            $.anon_function_sig,
            seq("(",$._type,")"),
        ),
        composite_type:$=>prec(-1,seq(
            $._type,
            repeat1(seq(
                "+",
                $._type,
            )),
        )),
        union_type:$=>prec(-1,seq(
            $._type,
            repeat1(seq(
                "|",
                $._type,
            )),
        )),
        named_type:$=>choice(
            field("name",$.word),
            seq(field("name",$.word),"(",field("generics",repeat(seq($._type,","))),$._type,")"),
        ),
        object_type:$=>choice(
            seq("{","}"),
            seq(
                "{",
                repeat(seq($.object_type_field,",")),
                $.object_type_field,
                optional(","),
                "}",
            ),
            seq(
                "{",
                repeat(seq($.object_type_field,",")),
                "...",
                "}",
            ),
        ),
        builtin_type:_=>prec(5,choice(
            "Float",
            "DoubleFloat",
            "Byte",
            "Int",
            "Uint",
            "Char",
            "Bool",
            "String",
            "Never",
        )),
        object_type_field:$=>seq(
            optional($.public),
            optional($.mutable),
            field("name",$.word),
            ":",
            field("ty",$._type),
        ),
        public:$=>choice(
            $.pub_keyword,
            seq($.pub_keyword,"(",$.visibility,")"),
        ),
        mutable:$=>choice(
            $.mut_keyword,
            seq($.mut_keyword,"(",$.visibility,")"),
        ),
        visibility:_=>choice(
            "lib",
            "local",
            "full",
        ),

        // # Tokens/Terminals
        // ## Keywords
        fn_keyword:_=>"fn",
        type_keyword:_=>"type",
        interface_keyword:_=>"interface",
        pub_keyword:_=>"pub",
        mut_keyword:_=>"mut",
        impl_keyword:_=>"impl",
        import_keyword:_=>"import",
        for_keyword:_=>"for",
        while_keyword:_=>"while",
        loop_keyword:_=>"loop",
        return_keyword:_=>"return",
        continue_keyword:_=>"continue",
        match_keyword:_=>"match",
        enum_keyword:_=>"enum",
        module_keyword:_=>"module",
        this_keyword:_=>"this",
        true_keyword:_=>"true",
        false_keyword:_=>"false",
        const_keyword:_=>"const",
        static_keyword:_=>"static",
        and_keyword:_=>"and",
        or_keyword:_=>"or",
        in_keyword:_=>"in",
        is_keyword:_=>"is",

        // ## Words, numbers, strings, chars
        word:_=>/[a-zA-Z_][a-zA-Z0-9_]*/,
        string:$=>choice(
            seq("\"",repeat(seq(/[^"\\]*/,$.string_escape)),/[^"\\]*/,"\""),
            $.raw_string,
        ),
        string_escape:_=>choice(
            "\\\\",
            "\\\"",
            "\\n",
            "\\r",
            "\\t",
            "\\0",
            "\\\\",
            /\\u\{[0-9a-fA-F]{1,6}\}/,
            /\\x[0-9a-fA-F]{2}/,
            /[^\\\n]/,
        ),
        number:$=>$._number_sym,
        _number_sym:_=>/[0-9][0-9_]*/,
        float:$=>choice(
            prec(4,seq($._number_sym,".",$._number_sym)),
            prec(3,seq($._number_sym,".")),
            prec(2,seq(".",$._number_sym)),
        ),
        char:_=>choice(
            "'\\\\'",
            "'\"'",
            "'\\n'",
            "'\\r'",
            "'\\t'",
            "'\\0'",
            "'\\\\'",
            /'\\u\{[0-9a-fA-F]{1,6}\}'/,
            /'\\x[0-9a-fA-F]{2}'/,
            /'[^\\\n]'/,
        ),

        // ## Doc comments
        doc_comment:$=>prec(10,seq(
            /\/\/\//,
            field("body",$.line_comment_body),
        )),
        line_comment_body:_=>/[^\n]*/,

        // ## Regular comments
        comment:_=>/\/\/[^/][^\n]*/,
    }
});
