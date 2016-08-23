
	
// Disclaimer
// By Michael Brown

function isEmpty(map) {
	for(var key in map) {
		if (map.hasOwnProperty(key)) return false;
	}
	return true;
}

var reserved_signs = [

	"\n",
	"--",
	"(",
	")",
	":="
];

// AKA Keywords
var reserved_identifiers = [

	"class",
	"end",
	"reference",
	"using",
	"do",
	"if",
	"then",
	"return"
];

var reserved_whitespace = ['\t','\v','\f', ' '];


class SyntaxNode {
	constructor() {
		this.childNodes = [];
		this.index = {};
		this.length = 0;
		this.attributes = {};
	}

	addAttribute(value, key) {
		this.attributes[key] = value;
	}
	
	getAttribute(key) {
		return this.attributes[key];	
	}

	addIndexedNode(node, indexName) {
		this.childNodes.push(node);
		if (this.index[indexName] === undefined) this.index[indexName] = [];
		this.index[indexName].push( this.childNodes.length - 1 );
		this.length += node.length;
	}

	getNodes(indexName) {
		var res = [];
		for(let i in this.index[indexName]) {
			res.push(this.childNodes[this.index[indexName][i]]);
		}
		return res;
	}

	getValue(indexName) {
		return this.childNodes[this.index[indexName][0]].text();
	}
	
	addNode(node) {
		this.childNodes.push(node);
		this.length += node.length;
	}

	text() {
		var res = '';
		for(let child of this.childNodes) {
			res += child.text();
		}
		return res;
	}

	toXML(role, depth) {
		role = role || "root";
		depth = depth || 0;

		var res = "\t".repeat(depth) + '<' + role;
		for (var a in this.attributes) {
			res += ' ' + a + '="' + this.attributes[a] + '"';
		}
		if (isEmpty(this.index)) {
			res += '/>';
		} else {
			res += '>\n';

			for(var c in this.index) {
				for(var d in this.index[c]) {
					res += this.childNodes[this.index[c][d]].toXML(c, depth+1) + '\n';
				}
			}
			res += "\t".repeat(depth) + '</' + role + '>';
		}
		
		return res;
		
	}
	toHTML() {
		var thisClassName = this.constructor.name;
		var res = '<span class="' + thisClassName + '">';

		for(var i = 0, len = this.childNodes.length; i < len; i++) {
			res += this.childNodes[i].toHTML();
		}
		res += '</span>';
		return res;
	}
}

// Lexing Nodes
// We need to add methods to the created Objects (Parse tree).
// We do this with inheritence. Create a variable with the name of the token match name
// to add methods to those token types.

class LexNode {
	constructor() {
		this.value = undefined;
		this.length = 0;
		this.attributes = {};
	}
	
	toHTML() {
		var thisClassName = this.constructor.name;
		return "<span class='" + thisClassName + "'>" + this.text() + "</span>";
	}
	
	text() {
		// EOF represented with \n with length 0
		if (this.length != 0) return this.value;
		return '';
	}

	addAttribute(value,key) {
		this.attributes[key] = value;
	}	

	getAttribute(key) {
		return this.attributes[key];
	}

	toXML(role, depth) {
		var res;
		res = "\t".repeat(depth) + '<' + role;
		for (var a in this.attributes) {
			res += ' ' + a + '="' + this.attributes[a] + '"';
		}
		res += '>' + this.text() + '</' + role + '>';
		return res;
	}
};

// Lexical Nodes, whitespace, selector, identifier, number.

class commentString extends LexNode {
	constructor(inputstream) {
		super();

		var re = new RegExp("^[^\n]*");
		var res = re.exec(inputstream);
		
		if (res === null) throw "Expected comment string";
		
		this.length = res[0].length;
		this.value = res[0];
	}
}

class whitespace extends LexNode {
	constructor(inputstream) {
		super();

		var re = new RegExp("^[ \t\v\f]+");
		var res = re.exec(inputstream);
		
		if (res === null) throw "Expected whitespace";
		
		this.length = res[0].length;
		this.value = res[0];
	}
}

class selector extends LexNode {
	constructor(inputstream) {
		super();

		var re = new RegExp("^[a-zA-Z_][a-zA-Z0-9_]*:");
		var res = re.exec(inputstream);

		if (res === null) throw "Expected selector";

		this.length = res[0].length;
		this.value = res[0];
	}
}

class identifier extends LexNode {
	constructor(inputstream) {
		super();
		var re = new RegExp("^[a-zA-Z_][a-zA-Z0-9_]*:?");
		var res = re.exec(inputstream);
		
		if (res === null) throw "Expected identifier";
		if (res[0].substr(-1) === ":") throw "Identifier's can not end with :";
		
		this.length = res[0].length;
		this.value = res[0];
	}
}

class sign extends LexNode {
	constructor(inputstream) {
		super();

		// Conveience Tool #1 If EOF, insert a newline
		if (inputstream === "") {
			this.length = 0;
			this.value = '\n';
			return;
		}

		// _ might not be a reserved sign?
		var re = new RegExp("^[^\t\v\f a-zA-Z0-9_]+");
		var res = re.exec(inputstream);

		if (res === null) throw "Expected Sign";

		this.length = res[0].length;
		this.value = res[0];
	}
}

class number extends LexNode {
	constructor(inputstream) {
		super();
		// Complex numbers? (i-?[0-9]+)?
		var pattern = /^[0-9]+(\.[0-9]+)?(e-?[0-9]+)?(\(.+?\))?/i
		var regexres = pattern.exec(inputstream);

		if (regexres === null) throw "Expected Number";
		this.value = regexres[0];
		this.length = regexres[0].length;
	}
};


		
	class lineBegin extends SyntaxNode {
		constructor(inputstream) {
			super();
			var tmp;

			
			try {
	tmp = new whitespace(inputstream);
	super.addNode(tmp);
	inputstream = inputstream.substr(tmp.length);
	} catch(e) { }
		
		}
	};


		
	class lineEnd extends SyntaxNode {
		constructor(inputstream) {
			super();
			var tmp;

			
			try {
	tmp = new whitespace(inputstream);
	super.addNode(tmp);
	inputstream = inputstream.substr(tmp.length);
	} catch(e) { }
			try { // optional
	tmp = new comment(inputstream);
	super.addNode(tmp);
	inputstream = inputstream.substr(tmp.length);
	} catch(e) { }
			
	tmp = new sign(inputstream);
	if (tmp.value.startsWith('\n') === false) { throw "Expected '\n' keyword"; }
			tmp.value = '\n';
			tmp.length = tmp.value.length;
	super.addNode(tmp);
	inputstream = inputstream.substr(tmp.length);
	
		
		}
	};


		
	class blankline extends SyntaxNode {
		constructor(inputstream) {
			super();
			var tmp;

			
			
	tmp = new lineEnd(inputstream);
	super.addNode(tmp);
	inputstream = inputstream.substr(tmp.length);
	
		
		}
	};


		
	class comment extends SyntaxNode {
		constructor(inputstream) {
			super();
			var tmp;

			
			
	tmp = new sign(inputstream);
	if (tmp.value.startsWith('--') === false) { throw "Expected '--' keyword"; }
			tmp.value = '--';
			tmp.length = tmp.value.length;
	super.addNode(tmp);
	inputstream = inputstream.substr(tmp.length);
	
			
	tmp = new commentString(inputstream);
	super.addNode(tmp);
	inputstream = inputstream.substr(tmp.length);
	
		
		}
	};


		
	class langSyntaxTree extends SyntaxNode {
		constructor(inputstream) {
			super();
			var tmp;

			
			
	var one_or_more_count = 0;
	try {
		while(inputstream != '') {
			
				
	var one_or_more_count = 0;
	try {
		while(inputstream != '') {
			
					
	tmp = new blankline(inputstream);
	super.addNode(tmp);
	inputstream = inputstream.substr(tmp.length);
	
				

			one_or_more_count += 1;

			
		}
	} catch(e) {}


				
	tmp = new class_declaration(inputstream);
	super.addIndexedNode(tmp, 'class');
	inputstream = inputstream.substr(tmp.length);
	
				
	var one_or_more_count = 0;
	try {
		while(inputstream != '') {
			
					
	tmp = new blankline(inputstream);
	super.addNode(tmp);
	inputstream = inputstream.substr(tmp.length);
	
				

			one_or_more_count += 1;

			
		}
	} catch(e) {}

			

			one_or_more_count += 1;

			
		}
	} catch(e) {}

			
	if (inputstream != '') throw "Expected EOF";

		
		}
	};


		
	class class_declaration extends SyntaxNode {
		constructor(inputstream) {
			super();
			var tmp;

			
			
			
	tmp = new lineBegin(inputstream);
	super.addNode(tmp);
	inputstream = inputstream.substr(tmp.length);
	
			
	tmp = new identifier(inputstream);
	if (tmp.value != 'class') { throw "Expected 'class' keyword"; }super.addNode(tmp);
	inputstream = inputstream.substr(tmp.length);
	
			
	tmp = new whitespace(inputstream);
	super.addNode(tmp);
	inputstream = inputstream.substr(tmp.length);
	
			
	tmp = new identifier(inputstream);
	
			super.addNode(tmp);
			super.addAttribute(tmp.value, 'name');
		
	inputstream = inputstream.substr(tmp.length);
	
			
	tmp = new lineEnd(inputstream);
	super.addNode(tmp);
	inputstream = inputstream.substr(tmp.length);
	
			
	var one_or_more_count = 0;
	try {
		while(inputstream != '') {
			
				
	tmp = new blankline(inputstream);
	super.addNode(tmp);
	inputstream = inputstream.substr(tmp.length);
	
			

			one_or_more_count += 1;

			
		}
	} catch(e) {}

			try { // optional
	tmp = new using_header(inputstream);
	super.addIndexedNode(tmp, 'usings');
	inputstream = inputstream.substr(tmp.length);
	} catch(e) { }
			
	var one_or_more_count = 0;
	try {
		while(inputstream != '') {
			
				
	tmp = new blankline(inputstream);
	super.addNode(tmp);
	inputstream = inputstream.substr(tmp.length);
	
			

			one_or_more_count += 1;

			
		}
	} catch(e) {}

			try { // optional
	tmp = new reference_header(inputstream);
	super.addIndexedNode(tmp, 'references');
	inputstream = inputstream.substr(tmp.length);
	} catch(e) { }
			
	var one_or_more_count = 0;
	try {
		while(inputstream != '') {
			
				
	tmp = new blankline(inputstream);
	super.addNode(tmp);
	inputstream = inputstream.substr(tmp.length);
	
			

			one_or_more_count += 1;

			
		}
	} catch(e) {}


			
	var one_or_more_count = 0;
	try {
		while(inputstream != '') {
			
				
	tmp = new method_declaration(inputstream);
	super.addIndexedNode(tmp, 'method');
	inputstream = inputstream.substr(tmp.length);
	
			

			one_or_more_count += 1;

			
		}
	} catch(e) {}


			
	tmp = new lineBegin(inputstream);
	super.addNode(tmp);
	inputstream = inputstream.substr(tmp.length);
	
			
	tmp = new identifier(inputstream);
	if (tmp.value != 'end') { throw "Expected 'end' keyword"; }super.addNode(tmp);
	inputstream = inputstream.substr(tmp.length);
	
			
	tmp = new lineEnd(inputstream);
	super.addNode(tmp);
	inputstream = inputstream.substr(tmp.length);
	
		
		}
	};


		
	class reference_header extends SyntaxNode {
		constructor(inputstream) {
			super();
			var tmp;

			
			
	tmp = new lineBegin(inputstream);
	super.addNode(tmp);
	inputstream = inputstream.substr(tmp.length);
	
			
	tmp = new identifier(inputstream);
	if (tmp.value != 'reference') { throw "Expected 'reference' keyword"; }super.addNode(tmp);
	inputstream = inputstream.substr(tmp.length);
	
			
	tmp = new whitespace(inputstream);
	super.addNode(tmp);
	inputstream = inputstream.substr(tmp.length);
	
			
	var one_or_more_count = 0;
	try {
		while(inputstream != '') {
			
				
	tmp = new identifier(inputstream);
	super.addIndexedNode(tmp, 'referenceName');
	inputstream = inputstream.substr(tmp.length);
	
			

			one_or_more_count += 1;

			
	try {
		tmp = new whitespace(inputstream);
		super.addNode(tmp);
		inputstream = inputstream.substr(tmp.length);
	} catch (e) {}

			// If we fail, end the loop.
			tmp = new sign(inputstream);
			if (tmp.value != ',') { throw "Not delimiter"; }
			super.addNode(tmp);
			inputstream = inputstream.substr(tmp.length);
			
	try {
		tmp = new whitespace(inputstream);
		super.addNode(tmp);
		inputstream = inputstream.substr(tmp.length);
	} catch (e) {}

		}
	} catch(e) {if (one_or_more_count === 0) throw "One-or-more failed, " + e;}

			
	tmp = new lineEnd(inputstream);
	super.addNode(tmp);
	inputstream = inputstream.substr(tmp.length);
	
		
		}
	};


		
	class using_header extends SyntaxNode {
		constructor(inputstream) {
			super();
			var tmp;

			
			
	tmp = new lineBegin(inputstream);
	super.addNode(tmp);
	inputstream = inputstream.substr(tmp.length);
	
			
	tmp = new identifier(inputstream);
	if (tmp.value != 'using') { throw "Expected 'using' keyword"; }super.addNode(tmp);
	inputstream = inputstream.substr(tmp.length);
	
			
	tmp = new whitespace(inputstream);
	super.addNode(tmp);
	inputstream = inputstream.substr(tmp.length);
	
			
	var one_or_more_count = 0;
	try {
		while(inputstream != '') {
			
				
	tmp = new identifier(inputstream);
	super.addIndexedNode(tmp, 'usingItem');
	inputstream = inputstream.substr(tmp.length);
	
			

			one_or_more_count += 1;

			
	try {
		tmp = new whitespace(inputstream);
		super.addNode(tmp);
		inputstream = inputstream.substr(tmp.length);
	} catch (e) {}

			// If we fail, end the loop.
			tmp = new sign(inputstream);
			if (tmp.value != ',') { throw "Not delimiter"; }
			super.addNode(tmp);
			inputstream = inputstream.substr(tmp.length);
			
	try {
		tmp = new whitespace(inputstream);
		super.addNode(tmp);
		inputstream = inputstream.substr(tmp.length);
	} catch (e) {}

		}
	} catch(e) {if (one_or_more_count === 0) throw "One-or-more failed, " + e;}

			
	tmp = new lineEnd(inputstream);
	super.addNode(tmp);
	inputstream = inputstream.substr(tmp.length);
	
		
		}
	};


		
	class method_declaration extends SyntaxNode {
		constructor(inputstream) {
			super();
			var tmp;

			
			
	tmp = new method_header(inputstream);
	super.addIndexedNode(tmp, 'header');
	inputstream = inputstream.substr(tmp.length);
	
			
	tmp = new body_declaration(inputstream);
	super.addIndexedNode(tmp, 'body');
	inputstream = inputstream.substr(tmp.length);
	
			
	var one_or_more_count = 0;
	try {
		while(inputstream != '') {
			
				
	tmp = new blankline(inputstream);
	super.addNode(tmp);
	inputstream = inputstream.substr(tmp.length);
	
			

			one_or_more_count += 1;

			
		}
	} catch(e) {}

		
		}
	};


		
	class body_declaration extends SyntaxNode {
		constructor(inputstream) {
			super();
			var tmp;

			
			
	tmp = new lineBegin(inputstream);
	super.addNode(tmp);
	inputstream = inputstream.substr(tmp.length);
	
			
	tmp = new identifier(inputstream);
	if (tmp.value != 'do') { throw "Expected 'do' keyword"; }super.addNode(tmp);
	inputstream = inputstream.substr(tmp.length);
	
			
	tmp = new lineEnd(inputstream);
	super.addNode(tmp);
	inputstream = inputstream.substr(tmp.length);
	
			
	var one_or_more_count = 0;
	try {
		while(inputstream != '') {
			
				
	tmp = new blankline(inputstream);
	super.addNode(tmp);
	inputstream = inputstream.substr(tmp.length);
	
			

			one_or_more_count += 1;

			
		}
	} catch(e) {}

			
	var one_or_more_count = 0;
	try {
		while(inputstream != '') {
			
				
	tmp = new lineBegin(inputstream);
	super.addNode(tmp);
	inputstream = inputstream.substr(tmp.length);
	
				
		try {
			
	tmp = new ifStatement(inputstream);
	tmp.addAttribute('ifStatement', 'type');super.addIndexedNode(tmp, 'instruction');
	inputstream = inputstream.substr(tmp.length);
	
		} catch(e) {
	
		try {
			
	tmp = new returnStatement(inputstream);
	tmp.addAttribute('returnStatement', 'type');super.addIndexedNode(tmp, 'instruction');
	inputstream = inputstream.substr(tmp.length);
	
		} catch(e) {
	
		try {
			
	tmp = new assignmentOperation(inputstream);
	tmp.addAttribute('assignmentOperation', 'type');super.addIndexedNode(tmp, 'instruction');
	inputstream = inputstream.substr(tmp.length);
	
		} catch(e) {
	
		try {
			
	tmp = new unaryMessage(inputstream);
	tmp.addAttribute('unaryMessage', 'type');super.addIndexedNode(tmp, 'instruction');
	inputstream = inputstream.substr(tmp.length);
	
		} catch(e) {
	
		try {
			
	tmp = new naryMessage(inputstream);
	tmp.addAttribute('naryMessage', 'type');super.addIndexedNode(tmp, 'instruction');
	inputstream = inputstream.substr(tmp.length);
	
		} catch(e) {
	
		throw ": one-of didnt match";
	} } } } } 
				
	tmp = new lineEnd(inputstream);
	super.addNode(tmp);
	inputstream = inputstream.substr(tmp.length);
	
				
	var one_or_more_count = 0;
	try {
		while(inputstream != '') {
			
					
	tmp = new blankline(inputstream);
	super.addNode(tmp);
	inputstream = inputstream.substr(tmp.length);
	
				

			one_or_more_count += 1;

			
		}
	} catch(e) {}

			

			one_or_more_count += 1;

			
		}
	} catch(e) {}

			
	tmp = new lineBegin(inputstream);
	super.addNode(tmp);
	inputstream = inputstream.substr(tmp.length);
	
			
	tmp = new identifier(inputstream);
	if (tmp.value != 'end') { throw "Expected 'end' keyword"; }super.addNode(tmp);
	inputstream = inputstream.substr(tmp.length);
	
			
	tmp = new lineEnd(inputstream);
	super.addNode(tmp);
	inputstream = inputstream.substr(tmp.length);
	
		
		}
	};


		
	class ifStatement extends SyntaxNode {
		constructor(inputstream) {
			super();
			var tmp;

			
			
	tmp = new identifier(inputstream);
	if (tmp.value != 'if') { throw "Expected 'if' keyword"; }super.addNode(tmp);
	inputstream = inputstream.substr(tmp.length);
	
			
	tmp = new whitespace(inputstream);
	super.addNode(tmp);
	inputstream = inputstream.substr(tmp.length);
	
			
	tmp = new sign(inputstream);
	if (tmp.value.startsWith('(') === false) { throw "Expected '(' keyword"; }
			tmp.value = '(';
			tmp.length = tmp.value.length;
	super.addNode(tmp);
	inputstream = inputstream.substr(tmp.length);
	
			
		try {
			
	tmp = new naryMessage(inputstream);
	tmp.addAttribute('naryMessage', 'type');super.addIndexedNode(tmp, 'predicate');
	inputstream = inputstream.substr(tmp.length);
	
		} catch(e) {
	
		try {
			
	tmp = new unaryMessage(inputstream);
	tmp.addAttribute('unaryMessage', 'type');super.addIndexedNode(tmp, 'predicate');
	inputstream = inputstream.substr(tmp.length);
	
		} catch(e) {
	
		throw "ifStatement: one-of didnt match";
	} } 
			
	tmp = new sign(inputstream);
	if (tmp.value.startsWith(')') === false) { throw "Expected ')' keyword"; }
			tmp.value = ')';
			tmp.length = tmp.value.length;
	super.addNode(tmp);
	inputstream = inputstream.substr(tmp.length);
	
			
	tmp = new whitespace(inputstream);
	super.addNode(tmp);
	inputstream = inputstream.substr(tmp.length);
	
			
	tmp = new identifier(inputstream);
	if (tmp.value != 'then') { throw "Expected 'then' keyword"; }super.addNode(tmp);
	inputstream = inputstream.substr(tmp.length);
	
			
	tmp = new lineEnd(inputstream);
	super.addNode(tmp);
	inputstream = inputstream.substr(tmp.length);
	

			
	var one_or_more_count = 0;
	try {
		while(inputstream != '') {
			
				
	tmp = new lineBegin(inputstream);
	super.addNode(tmp);
	inputstream = inputstream.substr(tmp.length);
	
				
		try {
			
	tmp = new ifStatement(inputstream);
	tmp.addAttribute('ifStatement', 'type');super.addIndexedNode(tmp, 'instruction');
	inputstream = inputstream.substr(tmp.length);
	
		} catch(e) {
	
		try {
			
	tmp = new returnStatement(inputstream);
	tmp.addAttribute('returnStatement', 'type');super.addIndexedNode(tmp, 'instruction');
	inputstream = inputstream.substr(tmp.length);
	
		} catch(e) {
	
		try {
			
	tmp = new assignmentOperation(inputstream);
	tmp.addAttribute('assignmentOperation', 'type');super.addIndexedNode(tmp, 'instruction');
	inputstream = inputstream.substr(tmp.length);
	
		} catch(e) {
	
		try {
			
	tmp = new unaryMessage(inputstream);
	tmp.addAttribute('unaryMessage', 'type');super.addIndexedNode(tmp, 'instruction');
	inputstream = inputstream.substr(tmp.length);
	
		} catch(e) {
	
		try {
			
	tmp = new naryMessage(inputstream);
	tmp.addAttribute('naryMessage', 'type');super.addIndexedNode(tmp, 'instruction');
	inputstream = inputstream.substr(tmp.length);
	
		} catch(e) {
	
		throw ": one-of didnt match";
	} } } } } 
				
	tmp = new lineEnd(inputstream);
	super.addNode(tmp);
	inputstream = inputstream.substr(tmp.length);
	
				
	var one_or_more_count = 0;
	try {
		while(inputstream != '') {
			
					
	tmp = new blankline(inputstream);
	super.addNode(tmp);
	inputstream = inputstream.substr(tmp.length);
	
				

			one_or_more_count += 1;

			
		}
	} catch(e) {}

			

			one_or_more_count += 1;

			
		}
	} catch(e) {}


			
	tmp = new lineBegin(inputstream);
	super.addNode(tmp);
	inputstream = inputstream.substr(tmp.length);
	
			
	tmp = new identifier(inputstream);
	if (tmp.value != 'end') { throw "Expected 'end' keyword"; }super.addNode(tmp);
	inputstream = inputstream.substr(tmp.length);
	
			
	tmp = new lineEnd(inputstream);
	super.addNode(tmp);
	inputstream = inputstream.substr(tmp.length);
	
		
		}
	};


		
	class returnStatement extends SyntaxNode {
		constructor(inputstream) {
			super();
			var tmp;

			
			
	tmp = new identifier(inputstream);
	if (tmp.value != 'return') { throw "Expected 'return' keyword"; }super.addNode(tmp);
	inputstream = inputstream.substr(tmp.length);
	
			
	tmp = new whitespace(inputstream);
	super.addNode(tmp);
	inputstream = inputstream.substr(tmp.length);
	
			
		try {
			
	tmp = new naryMessage(inputstream);
	tmp.addAttribute('naryMessage', 'type');super.addIndexedNode(tmp, 'result');
	inputstream = inputstream.substr(tmp.length);
	
		} catch(e) {
	
		try {
			
	tmp = new unaryMessage(inputstream);
	tmp.addAttribute('unaryMessage', 'type');super.addIndexedNode(tmp, 'result');
	inputstream = inputstream.substr(tmp.length);
	
		} catch(e) {
	
		throw "returnStatement: one-of didnt match";
	} } 
		
		}
	};


		
	class method_header extends SyntaxNode {
		constructor(inputstream) {
			super();
			var tmp;

			
			
	tmp = new lineBegin(inputstream);
	super.addNode(tmp);
	inputstream = inputstream.substr(tmp.length);
	
			
		try {
			
	tmp = new narySigniture(inputstream);
	tmp.addAttribute('narySigniture', 'type');super.addIndexedNode(tmp, 'signiture');
	inputstream = inputstream.substr(tmp.length);
	
		} catch(e) {
	
		try {
			
	tmp = new unarySigniture(inputstream);
	tmp.addAttribute('unarySigniture', 'type');super.addIndexedNode(tmp, 'signiture');
	inputstream = inputstream.substr(tmp.length);
	
		} catch(e) {
	
		throw "method_header: one-of didnt match";
	} } 
			
	tmp = new lineEnd(inputstream);
	super.addNode(tmp);
	inputstream = inputstream.substr(tmp.length);
	
		
		}
	};


		
	class unarySigniture extends SyntaxNode {
		constructor(inputstream) {
			super();
			var tmp;

			
			
	tmp = new identifier(inputstream);
	
			super.addNode(tmp);
			super.addAttribute(tmp.value, 'selector');
		
	inputstream = inputstream.substr(tmp.length);
	
		
		}
	};


		
	class narySigniture extends SyntaxNode {
		constructor(inputstream) {
			super();
			var tmp;

			
			
	var one_or_more_count = 0;
	try {
		while(inputstream != '') {
			
				
	tmp = new selector(inputstream);
	super.addIndexedNode(tmp, 'selectorSegment');
	inputstream = inputstream.substr(tmp.length);
	
				try {
	tmp = new whitespace(inputstream);
	super.addNode(tmp);
	inputstream = inputstream.substr(tmp.length);
	} catch(e) { }
				
	tmp = new identifier(inputstream);
	super.addIndexedNode(tmp, 'operandName');
	inputstream = inputstream.substr(tmp.length);
	
				
				try {
	tmp = new whitespace(inputstream);
	super.addNode(tmp);
	inputstream = inputstream.substr(tmp.length);
	} catch(e) { }
			

			one_or_more_count += 1;

			
		}
	} catch(e) {if (one_or_more_count === 0) throw "One-or-more failed, " + e;}

		
		}
	};


		
	class naryMessage extends SyntaxNode {
		constructor(inputstream) {
			super();
			var tmp;

			
			
		try {
			
	tmp = new annoymousObject(inputstream);
	tmp.addAttribute('annoymousObject', 'type');super.addIndexedNode(tmp, 'receiver');
	inputstream = inputstream.substr(tmp.length);
	
		} catch(e) {
	
		try {
			
	tmp = new identifier(inputstream);
	tmp.addAttribute('identifier', 'type');super.addIndexedNode(tmp, 'receiver');
	inputstream = inputstream.substr(tmp.length);
	
		} catch(e) {
	
		throw "naryMessage: one-of didnt match";
	} } 
			
	tmp = new whitespace(inputstream);
	super.addNode(tmp);
	inputstream = inputstream.substr(tmp.length);
	
			
	var one_or_more_count = 0;
	try {
		while(inputstream != '') {
			
				
	tmp = new selector(inputstream);
	super.addIndexedNode(tmp, 'selectorSegment');
	inputstream = inputstream.substr(tmp.length);
	
				try {
	tmp = new whitespace(inputstream);
	super.addNode(tmp);
	inputstream = inputstream.substr(tmp.length);
	} catch(e) { }
				
		try {
			
	tmp = new unaryMessage(inputstream);
	tmp.addAttribute('unaryMessage', 'type');super.addIndexedNode(tmp, 'operand');
	inputstream = inputstream.substr(tmp.length);
	
		} catch(e) {
	
		throw ": one-of didnt match";
	} 
				
				try {
	tmp = new whitespace(inputstream);
	super.addNode(tmp);
	inputstream = inputstream.substr(tmp.length);
	} catch(e) { }
			

			one_or_more_count += 1;

			
		}
	} catch(e) {if (one_or_more_count === 0) throw "One-or-more failed, " + e;}

		
		}
	};


		
	class assignmentOperation extends SyntaxNode {
		constructor(inputstream) {
			super();
			var tmp;

			
			
	tmp = new identifier(inputstream);
	
			super.addNode(tmp);
			super.addAttribute(tmp.value, 'receiver');
		
	inputstream = inputstream.substr(tmp.length);
	
			
	tmp = new whitespace(inputstream);
	super.addNode(tmp);
	inputstream = inputstream.substr(tmp.length);
	
			
	tmp = new sign(inputstream);
	if (tmp.value.startsWith(':=') === false) { throw "Expected ':=' keyword"; }
			tmp.value = ':=';
			tmp.length = tmp.value.length;
	
			super.addNode(tmp);
			super.addAttribute(tmp.value, 'selector');
		
	inputstream = inputstream.substr(tmp.length);
	
			
	tmp = new whitespace(inputstream);
	super.addNode(tmp);
	inputstream = inputstream.substr(tmp.length);
	
			
		try {
			
	tmp = new naryMessage(inputstream);
	tmp.addAttribute('naryMessage', 'type');super.addIndexedNode(tmp, 'assignment_operand');
	inputstream = inputstream.substr(tmp.length);
	
		} catch(e) {
	
		try {
			
	tmp = new unaryMessage(inputstream);
	tmp.addAttribute('unaryMessage', 'type');super.addIndexedNode(tmp, 'assignment_operand');
	inputstream = inputstream.substr(tmp.length);
	
		} catch(e) {
	
		throw "assignmentOperation: one-of didnt match";
	} } 
		
		}
	};


		
	class unaryMessage extends SyntaxNode {
		constructor(inputstream) {
			super();
			var tmp;

			
			
		try {
			
	tmp = new annoymousObject(inputstream);
	tmp.addAttribute('annoymousObject', 'type');super.addIndexedNode(tmp, 'receiver');
	inputstream = inputstream.substr(tmp.length);
	
		} catch(e) {
	
		try {
			
	tmp = new identifier(inputstream);
	tmp.addAttribute('identifier', 'type');super.addIndexedNode(tmp, 'receiver');
	inputstream = inputstream.substr(tmp.length);
	
		} catch(e) {
	
		throw "unaryMessage: one-of didnt match";
	} } 
			
	tmp = new whitespace(inputstream);
	super.addNode(tmp);
	inputstream = inputstream.substr(tmp.length);
	
			
		try {
			
	tmp = new identifier(inputstream);
	tmp.addAttribute('identifier', 'type');super.addIndexedNode(tmp, 'selector');
	inputstream = inputstream.substr(tmp.length);
	
		} catch(e) {
	
		try {
			
	tmp = new number(inputstream);
	tmp.addAttribute('number', 'type');super.addIndexedNode(tmp, 'selector');
	inputstream = inputstream.substr(tmp.length);
	
		} catch(e) {
	
		throw "unaryMessage: one-of didnt match";
	} } 
		
		}
	};


		
	class annoymousObject extends SyntaxNode {
		constructor(inputstream) {
			super();
			var tmp;

			
			
	tmp = new sign(inputstream);
	if (tmp.value.startsWith('(') === false) { throw "Expected '(' keyword"; }
			tmp.value = '(';
			tmp.length = tmp.value.length;
	super.addNode(tmp);
	inputstream = inputstream.substr(tmp.length);
	
			
		try {
			
	tmp = new naryMessage(inputstream);
	tmp.addAttribute('naryMessage', 'type');super.addIndexedNode(tmp, 'expression');
	inputstream = inputstream.substr(tmp.length);
	
		} catch(e) {
	
		try {
			
	tmp = new unaryMessage(inputstream);
	tmp.addAttribute('unaryMessage', 'type');super.addIndexedNode(tmp, 'expression');
	inputstream = inputstream.substr(tmp.length);
	
		} catch(e) {
	
		throw "annoymousObject: one-of didnt match";
	} } 
			
	tmp = new sign(inputstream);
	if (tmp.value.startsWith(')') === false) { throw "Expected ')' keyword"; }
			tmp.value = ')';
			tmp.length = tmp.value.length;
	super.addNode(tmp);
	inputstream = inputstream.substr(tmp.length);
	
		
		}
	};


	
