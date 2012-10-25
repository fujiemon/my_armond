function class__Scanner__(window) {	var classId = arguments.callee.toString().match(/class__(\w+)__/)[1];	var F = window[classId] = function(strSource) {		var length = strSource.length;		this.source = new Array(length);		for (var i = 0; i < length; i++)			this.source[i] = strSource.charAt(i);//		this.lineSeparator = '\n';		this.startPosition = 0;		this.currentPosition = 0;		this.eofPosition = length;//		this.currentChar = '\0';		this.keywordScanner = new KeywordScanner(this.source);		if (this.constructor !== F)			this.constructor == F;	};	var FP = F.prototype;	for (var i in Symbols)		if (i.indexOf("TOKEN_ID") == 0)			F[i] = Symbols[i];	FP.getCurrentChar = function() {		return this.source[this.currentPosition];	};	FP.getCurrentToken = function() {		var token = "";		for (var i = this.startPosition; i < this.currentPosition; i++) {			//var ch = this.source[i];			//if (i == this.currentPosition - 1 && (ch == '\n' || ch == '\r'))			//	break;			token += this.source[i];		}		return token;	};	/**	 * 次の文字を調べる．	 * boolean f(char ch)	 * @return chにマッチするとき真，マッチしないとき偽．	 */	FP.$isNextChar1 = function(ch) {		if (this.currentPosition >= this.eofPosition) {			this.currentPosition = this.eofPosition;			return false;		}		if (this.source[this.currentPosition] == ch) {			this.currentPosition++;			return true;		} else {			return false;		}	};	/**	 * 次の文字を調べる．	 * int f(char ch0, char ch1)	 * @return ch0にマッチするとき0，ch1にマッチするとき1	 * どちらにもマッチしないとき-1．	 */	FP.$isNextChar2 = function(ch0, ch1) {		var i = this.currentPosition;		if (i >= this.eofPosition) {			this.currentPosition = this.eofPosition;			return -1;		}		switch (this.source[i]) {			case ch0 :				this.currentPosition++;				return 0;			case ch1 :				this.currentPosition++;				return 1;			default :				return -1;		}	};	/**	 * 次の文字を調べる．	 * int f(char ch0, char ch1, char ch2)	 * @return ch0にマッチするとき0，ch1にマッチするとき1	 * ch2にマッチするとき2，どれにもマッチしないとき-1．	 */	FP.$isNextChar3 = function(ch0, ch1, ch2) {		var i = this.currentPosition;		if (i >= this.eofPosition) {			this.currentPosition = this.eofPosition;			return -1;		}		switch (this.source[i]) {			case ch0 :				this.currentPosition++;				return 0;			case ch1 :				this.currentPosition++;				return 1;			case ch2 :				this.currentPosition++;				return 2;			default :				return -1;		}	};	/**	 * 次の要素のIDを返す．	 * currentPositionから検索し，トークンが見つかった時点で値を返す．	 * 空白部，コメント部も返す．	 * int f()	 * @return 要素のID．	 * 不正な文字が存在したり，構文にエラーが在る場合，	 * Symbols.TOKEN_ID__ERRORを返す．	 * ファイル終端に来たとき，Symbols.TOKEN_ID__EOFを返す．	 * @see Symbols	 */	FP.getNextTokenId = function() {		if (this.currentPosition >= this.eofPosition)			return Symbols.TOKEN_ID__EOF;		this.startPosition = this.currentPosition++;		var i = this.startPosition;		var ch = this.currentChar = this.source[i];		switch (ch) {			case '(' :				return Symbols.TOKEN_ID__LeftParen;			case ')' :				return Symbols.TOKEN_ID__RightParen;			case '{' :				return Symbols.TOKEN_ID__LeftBrace;			case '}' :				return Symbols.TOKEN_ID__RightBrace;			case '[' :				return Symbols.TOKEN_ID__LeftBracket;			case ']' :				return Symbols.TOKEN_ID__RightBracket;			case '?' :				return Symbols.TOKEN_ID__Question;			case ':' :				return Symbols.TOKEN_ID__Colon;			case ';' :				return Symbols.TOKEN_ID__Semicolon;			case '.' : // DOT or NUMBER				if (i + 1 >= this.eofPosition) {					this.currentPosition = this.eofPosition;					return Symbols.TOKEN_ID__Dot;				}				switch (this.source[i + 1]) {					case '0' :					case '1' :					case '2' :					case '3' :					case '4' :					case '5' :					case '6' :					case '7' :					case '8' :					case '9' :						if (this.$numberLiteral(i, '.'))							return Symbols.TOKEN_ID__NumberLiteral;						return Symbols.TOKEN_ID__ERROR;					default :						return Symbols.TOKEN_ID__Dot;				}			case ',' :				return Symbols.TOKEN_ID__Comma;			case '?' :				return Symbols.TOKEN_ID__Question;			case '!' :				if (this.$isNextChar1('='))					if (this.$isNextChar1('='))						return Symbols.TOKEN_ID__NotEqualEqual; //■■■ !==					return Symbols.TOKEN_ID__NotEqual; //■■■ !=				return Symbols.TOKEN_ID__Not; //■■■ !			case '|' :				switch (this.$isNextChar2('|', '=')) {					case 0 :						return Symbols.TOKEN_ID__OrOr; //■■■ ||					case 1 :						return Symbols.TOKEN_ID__OrEqual; //■■■ |=					default :						return Symbols.TOKEN_ID__Or; //■■■ |				}			case '&' :				switch (this.$isNextChar2('&', '=')) {					case 0 :						return Symbols.TOKEN_ID__AndAnd; //■■■ &&					case 1 :						return Symbols.TOKEN_ID__AndEqual; //■■■ &=					default :						return Symbols.TOKEN_ID__And; //■■■ &				}			case '^' :				if (this.$isNextChar1('='))					return Symbols.TOKEN_ID__XorEqual; //■■■ ^=				return Symbols.TOKEN_ID__Xor; //■■■ ^			case '~' :				return Symbols.TOKEN_ID__Twiddle;			case '<' :				switch (this.$isNextChar2('=', '<')) {					case 0 :						return Symbols.TOKEN_ID__LessEqual; //■■■ <=					case 1 :						if (this.$isNextChar1('='))							return Symbols.TOKEN_ID__LeftShiftEqual; //■■■ <<=						return Symbols.TOKEN_ID__LeftShift; //■■■ <<					default :						return Symbols.TOKEN_ID__Less; //■■■ <				}			case '>' :				switch (this.$isNextChar2('=', '>')) {					case 0 :						return Symbols.TOKEN_ID__GreaterEqual; //■■■ >=					case 1 :						switch (this.$isNextChar2('=', '>')) {							case 0 :								return Symbols.TOKEN_ID__RightShiftEqual; //■■■ >>=							case 1 :								if (this.$isNextChar1('='))									return Symbols.TOKEN_ID__UnsignedRightShiftEqual; //■■■ >>>=								return Symbols.TOKEN_ID__UnsignedRightShift; //■■■ >>>							default :								return Symbols.TOKEN_ID__RightShift; //■■■ >>						}					default :						return Symbols.TOKEN_ID__Greater; //■■■ >				}			case '0' :			case '1' :			case '2' :			case '3' :			case '4' :			case '5' :			case '6' :			case '7' :			case '8' :			case '9' :				if (this.$numberLiteral(i, ch))					return Symbols.TOKEN_ID__NumberLiteral; //■■■ NumberLiteral				return Symbols.TOKEN_ID__ERROR;			case '*' :				if (this.$isNextChar1('='))					return Symbols.TOKEN_ID__MultiplyEqual; //■■■ *=				return Symbols.TOKEN_ID__Multiply; //■■■ *			case '%' :				if (this.$isNextChar1('='))					return Symbols.TOKEN_ID__RemainderEqual; //■■■ %=				return Symbols.TOKEN_ID__Remainder; //■■■ %			case '+' :				switch (this.$isNextChar2('+', '=')) {					case 0 :						return Symbols.TOKEN_ID__PlusPlus; //■■■ ++					case 1 :						return Symbols.TOKEN_ID__PlusEqual; //■■■ +=					default :						return Symbols.TOKEN_ID__Plus; //■■■ +				}			case '-' :				switch (this.$isNextChar2('-', '=')) {					case 0 :						return Symbols.TOKEN_ID__MinusMinus; //■■■ --					case 1 :						return Symbols.TOKEN_ID__MinusEqual; //■■■ -=					default :						return Symbols.TOKEN_ID__Minus; //■■■ -				}			case '/' :				// 正規表現リテラルはすぐ後ろにスラッシュ (/) の続かないスラッシュで始まる (2つのスラッシュは1行コメントを表す)。JavaScript 1.5 のように、正規表現リテラルは除算 (/) や 除算代入 (/=) の各トークンと区別が付かない。/ や /= が構文的文法によって次のトークンとして妥当な場合はレクサはこれらを除算、除算代入として扱う。そうでなければ / や /= は正規表現リテラルの始まりとして扱われる				switch (this.$isNextChar3('/', '*', '=')) {					case 0 :						for (i += 2; i < this.eofPosition; i++) {							switch (this.source[i]) {								case '\f' :								case '\n' :								case '\r' :									this.currentPosition = i + 1;									return Symbols.TOKEN_ID__COMMENT_LINE; //■■■ CommentLine							}						}						this.currentPosition = this.eofPosition;						return Symbols.TOKEN_ID__COMMENT_LINE;					case 1 :						for (i += 2; i < this.eofPosition - 1; i++) {							if (this.source[i] == '*'								&& this.source[i + 1] == '/') {								this.currentPosition = i + 2;								return Symbols.TOKEN_ID__COMMENT_BLOCK; //■■■ CommentBlock							}						}						return Symbols.TOKEN_ID__ERROR;					case 2 :						return Symbols.TOKEN_ID__DivideEqual; //■■■ /=					default : {						/*var regexp = false;						for (var j = i + 1; j < this.eofPosition; j++) {							var ch0 = this.source[j];							switch (ch0) {								case '\\' :									j++;									break;								case '/' : {									for (var k = j + 1; k < this.eofPosition; k++) {										var ch1 = this.source[j + 1];										switch (ch1) {											case 'm' :											case 'g' :											case 'i' :												break;											case ';' :											case '\n' :											case '\r' :												this.currentPosition = k;												return Symbols.TOKEN_ID__RegExpLiteral;												break;										}									}									break;								}							}						}*/						return Symbols.TOKEN_ID__Divide;					}				}			case '=' :				if (this.$isNextChar1('='))					if (this.$isNextChar1('='))						return Symbols.TOKEN_ID__EqualEqualEqual; //■■■ ===					return Symbols.TOKEN_ID__EqualEqual; //■■■ ==				return Symbols.TOKEN_ID__Equal; //■■■ =			case '\"' :				for (++i; i < this.eofPosition; i++) {					switch (this.source[i]) {						case '\"' :							this.currentPosition = i + 1;							return Symbols.TOKEN_ID__DoubleQuotationStringLiteral; //■■■ DoubleQuotation StringListeral						case '\\' :							i++;							break;					}				}				return Symbols.TOKEN_ID__ERROR;			case '\'' :				for (++i; i < this.eofPosition; i++) {					switch (this.source[i]) {						case '\'' :							this.currentPosition = i + 1;							return Symbols.TOKEN_ID__SingleQuotationStringLiteral; //■■■ SingleQuotation StringListeral						case '\\' :							i++;							break;					}				}				return Symbols.TOKEN_ID__ERROR;			case 'b' :				if (this.$break(1)) {					return Symbols.TOKEN_ID__break;				} else if (this.$identifier()){					return Symbols.TOKEN_ID__identifier;				}				return Symbols.TOKEN_ID__ERROR;			case 'c' :				if (this.$case(1)) {					return Symbols.TOKEN_ID__case;				} else if (this.$continue(1)) {					return Symbols.TOKEN_ID__continue;				} else if (this.$catch(1)) {					return Symbols.TOKEN_ID__catch;				}  else if (this.$class(1)) {					return Symbols.TOKEN_ID__class;				} else if (this.$identifier()){					return Symbols.TOKEN_ID__identifier;				}				return Symbols.TOKEN_ID__ERROR;			case 'd' :				if (this.$default()) {					return Symbols.TOKEN_ID__default;				} else if (this.$do(1)) {					return Symbols.TOKEN_ID__do;				}  else if (this.$delete(1)) {					return Symbols.TOKEN_ID__delete;				} else if (this.$identifier()){					return Symbols.TOKEN_ID__identifier;				}				return Symbols.TOKEN_ID__ERROR;			case 'e' :				if (this.$else(1)) {					return Symbols.TOKEN_ID__else;				} else if (this.$identifier()){					return Symbols.TOKEN_ID__identifier;				}				return Symbols.TOKEN_ID__ERROR;			case 'f' :				if (this.$for(1)) {					return Symbols.TOKEN_ID__for;				} else if (this.$function(1)) {					return Symbols.TOKEN_ID__function;				} else if (this.$false(1)) {					return Symbols.TOKEN_ID__false;				} else if (this.$finally(1)) {					return Symbols.TOKEN_ID__finally;				} else if (this.$identifier()){					return Symbols.TOKEN_ID__identifier;				}				return Symbols.TOKEN_ID__ERROR;			case 'i' : {				if (this.$if(1)) {					return Symbols.TOKEN_ID__if;				} else if (this.$in(1)) {					return Symbols.TOKEN_ID__in;				} else if (this.$identifier()){					return Symbols.TOKEN_ID__identifier;				}				return Symbols.TOKEN_ID__ERROR;			}			case 'n' :				if (this.$new(1)) {					return Symbols.TOKEN_ID__new;				} else if (this.$null(1)) {					return Symbols.TOKEN_ID__null;				} else if (this.$identifier()){					return Symbols.TOKEN_ID__identifier;				}				return Symbols.TOKEN_ID__ERROR;			case 'r' :				if (this.$return(1)) {					return Symbols.TOKEN_ID__return;				} else if (this.$identifier()){					return Symbols.TOKEN_ID__identifier;				}				return Symbols.TOKEN_ID__ERROR;			case 's' :				if (this.$switch(1)) {					return Symbols.TOKEN_ID__switch;				} else if (this.$identifier()){					return Symbols.TOKEN_ID__identifier;				}				return Symbols.TOKEN_ID__ERROR;			case 't' :				if (this.$true(1)) {					return Symbols.TOKEN_ID__true;				} else if (this.$this(1)) {					return Symbols.TOKEN_ID__this;				} else if (this.$typeof(1)) {					return Symbols.TOKEN_ID__typeof;				} else if (this.$try(1)) {					return Symbols.TOKEN_ID__try;				} else if (this.$throw(1)) {					return Symbols.TOKEN_ID__throw;				} else if (this.$identifier()){					return Symbols.TOKEN_ID__identifier;				}				return Symbols.TOKEN_ID__ERROR;			case 'u' :				if (this.$undefined(1)) {					return Symbols.TOKEN_ID__undefined;				} else if (this.$identifier()){					return Symbols.TOKEN_ID__identifier;				}				return Symbols.TOKEN_ID__ERROR;			case 'v' :				if (this.$var(1)) {					return Symbols.TOKEN_ID__var;				} else if (this.$void(1)) {					return Symbols.TOKEN_ID__void;				} else if (this.$identifier()){					return Symbols.TOKEN_ID__identifier;				}				return Symbols.TOKEN_ID__ERROR;			case 'w' :				if (this.$while(1)) {					return Symbols.TOKEN_ID__while;				} else if (this.$with(1)) {					return Symbols.TOKEN_ID__with;				} else if (this.$identifier()){					return Symbols.TOKEN_ID__identifier;				}				return Symbols.TOKEN_ID__ERROR;			case ' ' :			case '\t' :			case '\f' :			case '\n' :			case '\r' :				var bNotWhiteSpace = false;				for (++i; i < this.eofPosition; i++) {					switch (this.source[i]) {						case ' ' :						case '\t' :						case '\f' :						case '\n' :						case '\r' :							break;						default :							bNotWhiteSpace = true;					}					if (bNotWhiteSpace)						break;				}				this.currentPosition = i;				return Symbols.TOKEN_ID__WHITESPACE;			default :				if (this.$identifier())					return Symbols.TOKEN_ID__identifier;				return Symbols.TOKEN_ID__ERROR;		}	};//	var NUMBER_SPLIT_PATTEN = new RegExp("");//	NUMBER_SPLIT_PATTEN.compile("[\\s\\(\\)\\[\\]\\{\\}\\+\\-\\*\\/\\%\\=\\<\\>\\;\\:\\?\\,\\.\\!\\|\\&\\^\\~]");//	var HEX_NUMBER_PATTEN = new RegExp("");//	HEX_NUMBER_PATTEN.compile("[0-9A-Fa-f]");	/**	 * 数値リテラルかを調べる．	 * 但し，符号はチェックしない．	 * 数値リテラル : 1, 2.0, 3e4, +1, -1, -3.0e+23, 0xff, -0xd, ...	 * 整数型リテラル : [+-]?(0[0-7]+|[0-9]+|0x[0-9A-Fa-f]+)	 * 浮動小数点型リテラル : [+-]?([0-9]*\.|)[0-9]+([eE][+-]?[0-9]+|)	 * int f(char startChar)	 * @param startChar 最初の一文字を指定する．	 * '0'のとき8進法表記整数型リテラル（整数型リテラル），	 * 16進法表記整数型リテラル，浮動小数点型リテラルの可能性がある．	 * '1'～'9'のとき，整数型リテラル，浮動小数点型リテラルの可能性がある．	 * '.'のとき浮動小数点型リテラルの可能性がある．	 * それ以外は返り値に偽を返す．	 * @return 数値リテラルのとき真，そうでないとき偽．	 */	FP.$numberLiteral = function(startPosition, startChar) {		var NUMBER = 1;		var DOT = 2;		var i = startPosition;		var preCode = -1;		var include_dot = false; // .を含むとき真		switch (startChar) {			case '0' : { // 0???				if (i + 1 >= this.eofPosition) {					this.currentPosition = this.eofPosition;					return true; //■■■ '0'という数値リテラル．				}				var nextCh = this.source[i + 1];				switch (nextCh) {					case 'x' : //■■■ 16進数						return this.$hexNumberLiteral(i, false);					case '0' :					case '1' :					case '2' :					case '3' :					case '4' :					case '5' :					case '6' :					case '7' :					case '8' :					case '9' : //■■■ 8進数（又は整数）						return this.$octalNumberLiteral(i, false);					case '.' : // 0.???						preCode = DOT;						include_dot = true;						i += 2;						break;					default : // 0???						if (F.$isNumberSplit(nextCh)) {							this.currentPosition = i + 1;							return true; //■■■ '0'という数値リテラル．						}						return false;				}			}			case '1' :			case '2' :			case '3' :			case '4' :			case '5' :			case '6' :			case '7' :			case '8' :			case '9' :				preCode = NUMBER;				i++;				break;			case '.' :				preCode = DOT;				include_dot = true;				i++;				break;			default :				return false;		}		while (true) {			if (i >= this.eofPosition) {				if (preCode == NUMBER) {					this.currentPosition = this.eofPosition;					return true;				}				return false;			}			var ch = this.source[i];			switch (preCode) {				case NUMBER : // next char [0-9\.eE]					switch (ch) {						case '0' :						case '1' :						case '2' :						case '3' :						case '4' :						case '5' :						case '6' :						case '7' :						case '8' :						case '9' :							preCode = NUMBER;							i++;							break;						case '.' :							if (include_dot)								return false;							include_dot = true;							preCode = DOT;							i++;							break;						case 'e' :						case 'E' : // 以降は整数．							if (++i >= this.eofPosition)								return false;							ch = this.source[i];							if (ch == '+' || ch == '-')								i++;							return this.$integerNumberLiteral(i);						default :							if (F.$isNumberSplit(ch)) {								this.currentPosition = i;								return true;							}							return false;					}					break;				case DOT : // next char [0-9]					switch (ch) {						case '0' :						case '1' :						case '2' :						case '3' :						case '4' :						case '5' :						case '6' :						case '7' :						case '8' :						case '9' :							preCode = NUMBER;							i++;							break;						default :							return false;					}					break;			}		}		return false;	};	/**	 * 16進法表記整数型リテラルかを調べる．	 * 但し，符号はチェックせず，0x以降がチェック対象になる．	 * 16進法表記整数型リテラル : [+-]?0x[0-9A-Fa-f]+	 * boolean f(int startPosition, boolean checkHeader)	 * @param startPosition スタート位置．	 * "0x"の'0'の位置を指定する．	 * @param checkHeader "0x"をチェックするとき真．	 * チェック如何によらず，startPositionは	 * "0x"の'0'の位置を指定することに注意．	 * @return 16進法数字のとき真，そうでないとき偽．	 */	FP.$hexNumberLiteral = function(startPosition, checkHeader) {		var i = startPosition;		// "0x"の次の文字が存在しない場合，偽		if (i + 2 >= this.eofPosition)			return false;		if (checkHeader) {			var ch0 = this.source[i];			var ch1 = this.source[i + 1];			if (ch0 + "" + ch1 != "0x")				return false;		}		// "0x"の次の文字をチェック		switch (this.source[i += 2]) {			case '0' :			case '1' :			case '2' :			case '3' :			case '4' :			case '5' :			case '6' :			case '7' :			case '8' :			case '9' :			case 'A' :			case 'B' :			case 'C' :			case 'D' :			case 'E' :			case 'F' :			case 'a' :			case 'b' :			case 'c' :			case 'd' :			case 'e' :			case 'f' :				i++;				break;			default :				return false;		}		var ch;		while (true) {			if (i >= this.eofPosition) {				this.currentPosition = this.eofPosition;				return true;			}			switch (ch = this.source[i]) {				case '0' :				case '1' :				case '2' :				case '3' :				case '4' :				case '5' :				case '6' :				case '7' :				case '8' :				case '9' :				case 'A' :				case 'B' :				case 'C' :				case 'D' :				case 'E' :				case 'F' :				case 'a' :				case 'b' :				case 'c' :				case 'd' :				case 'e' :				case 'f' :					i++;					break;				default :					if (F.$isNumberSplit(ch)) {						this.currentPosition = i;						return true;					}					return false;			}		}		return false;	};	/**	 * 8進法表記整数型リテラル（または0で始まる	 * 2桁以上の整数型リテラル）かを調べる．	 * 但し，符号はチェックせず，'0'以降がチェック対象になる．	 * 8進法表記整数型リテラル : [+-]?0[0-7]+	 * （0で始まる2桁以上の整数型リテラル : [+-]?0[0-9]+）	 * boolean f(int startPosition, boolean checkHeader)	 * @param startPosition スタート位置．	 * "0nnnn"の'0'の位置を指定する．	 * @param checkHeader "0n"をチェックするとき真．	 * チェック如何によらず，startPositionは	 * "0nnnn"の'0'の位置を指定することに注意．	 * この値が偽のときスタート位置の文字が"0n"であることが	 * 保障されている必要がある．	 * @return 8進法表記整数型リテラルまたは0で始まる	 * 2桁以上の整数型リテラル）のとき真．	 * （＊0で始まる2桁以上の整数リテラルであり，	 * '0'で終点に達したとき，偽を返すことに注意．）	 */	FP.$octalNumberLiteral = function(startPosition, checkHeader) {		var i = startPosition;		if (checkHeader) {			if (i + 1 >= this.eofPosition)				return false;			if(this.source[i] != '0')				return false;			switch (this.source[i + 1]) {				case '0' :				case '1' :				case '2' :				case '3' :				case '4' :				case '5' :				case '6' :				case '7' :					break;				case '8' :				case '9' :					break;				default :					return false;			}		}		i += 2;		var ch;		while (true) {			if (i >= this.eofPosition) {				this.currentPosition = this.eofPosition;				return true;			}			switch (ch = this.source[i]) {				case '0' :				case '1' :				case '2' :				case '3' :				case '4' :				case '5' :				case '6' :				case '7' :					i++;					break;				case '8' :				case '9' :					i++;					break;				default :					if (F.$isNumberSplit(ch)) {						this.currentPosition = i;						return true;					}					return false;			}		}		return false;	};	/**	 * 整数型リテラルかを調べる．	 * 但し，符号はチェックせず，8進法，16進法表記はマッチしない．	 * 整数型リテラル : [+-]?(0[0-7]+|[0-9]+|0x[0-9A-Fa-f]+)	 * boolean f(int startPosition)	 * @param startPosition スタート位置．	 * @return 整数型リテラルのとき真．	 */	FP.$integerNumberLiteral = function(startPosition) {		var i = startPosition;		var ch;		// 一文字目のチェック		switch (ch = this.source[i]) {			case '0' :			case '1' :			case '2' :			case '3' :			case '4' :			case '5' :			case '6' :			case '7' :			case '8' :			case '9' :				i++;				break;			default :				return false;		}		while (true) {			if (i >= this.eofPosition) {				this.currentPosition = this.eofPosition;				return true;			}			switch (ch = this.source[i]) {				case '0' :				case '1' :				case '2' :				case '3' :				case '4' :				case '5' :				case '6' :				case '7' :				case '8' :				case '9' :					i++;					break;				default :					if (F.$isNumberSplit(ch)) {						this.currentPosition = i;						return true;					}					return false;			}		}		return false;	};	/**	 * 文字が数値リテラルの区切り文字かを調べる．	 * boolean f(char ch)	 */	F.$isNumberSplit = function(ch) {		switch (ch) {			case ' ' :			case '\t' :			case '\f' :			case '\r' :			case '\n' :			case '(' :			case ')' :			case '[' :			case ']' :			case '{' :			case '}' :			case '+' :			case '-' :			case '*' :			case '/' :			case '%' :			case '=' :			case '<' :			case '>' :			case ';' :			case ':' :			case '?' :			case ',' :			case '!' :			case '|' :			case '&' :			case '~' :			case '^' :				return true;			default :				return false;		}	};	/**	 * 識別子かを調べる．	 * 識別子 : [A-Za-z_\$][A-Za-z0-9_\$]*	 * boolean f()	 * @return 識別子のとき真，そうでないとき偽．	 */	FP.$identifier = function() {		var i = this.startPosition;		if (i >= this.eofPosition)			return false;		// 一文字目		switch (this.source[i]) {			case '$' :			case 'A' :			case 'B' :			case 'C' :			case 'D' :			case 'E' :			case 'F' :			case 'G' :			case 'H' :			case 'I' :			case 'J' :			case 'K' :			case 'L' :			case 'M' :			case 'N' :			case 'O' :			case 'P' :			case 'Q' :			case 'R' :			case 'S' :			case 'T' :			case 'U' :			case 'V' :			case 'W' :			case 'X' :			case 'Y' :			case 'Z' :			case '_' :			case 'a' :			case 'b' :			case 'c' :			case 'd' :			case 'e' :			case 'f' :			case 'g' :			case 'h' :			case 'i' :			case 'j' :			case 'k' :			case 'l' :			case 'm' :			case 'n' :			case 'o' :			case 'p' :			case 'q' :			case 'r' :			case 's' :			case 't' :			case 'u' :			case 'v' :			case 'w' :			case 'x' :			case 'y' :			case 'z' :				break;			default :				return false;		}		while (true) {			if (++i >= this.eofPosition) {				this.currentPosition = this.eofPosition;				return true;			}			switch (this.source[i]) {				case '$' :				case '0' :				case '1' :				case '2' :				case '3' :				case '4' :				case '5' :				case '6' :				case '7' :				case '8' :				case '9' :				case 'A' :				case 'B' :				case 'C' :				case 'D' :				case 'E' :				case 'F' :				case 'G' :				case 'H' :				case 'I' :				case 'J' :				case 'K' :				case 'L' :				case 'M' :				case 'N' :				case 'O' :				case 'P' :				case 'Q' :				case 'R' :				case 'S' :				case 'T' :				case 'U' :				case 'V' :				case 'W' :				case 'X' :				case 'Y' :				case 'Z' :				case '_' :				case 'a' :				case 'b' :				case 'c' :				case 'd' :				case 'e' :				case 'f' :				case 'g' :				case 'h' :				case 'i' :				case 'j' :				case 'k' :				case 'l' :				case 'm' :				case 'n' :				case 'o' :				case 'p' :				case 'q' :				case 'r' :				case 's' :				case 't' :				case 'u' :				case 'v' :				case 'w' :				case 'x' :				case 'y' :				case 'z' :					break;				case ' ' :				case '\f' :				case '\n' :				case '\r' :				case '\t' :				case '\v' :				case '(' :				case ')' :				case '[' :				case ']' :				case '{' :				case '}' :				case '\"' :				case '\'' :				case '+' :				case '-' :				case '*' :				case '/' :				case '%' :				case '=' :				case '<' :				case '>' :				case ';' :				case ':' :				case '?' :				case ',' :				case '.' :				case '!' :				case '|' :				case '&' :				case '^' :				case '~' :					this.currentPosition = i;					return true;				default :					return false;			}		}		return false;	};	FP.$break = function(offset) {		var b = this.keywordScanner.test_break(this.startPosition, offset);		if (b)			this.currentPosition = this.startPosition + 5;		return b;	};	FP.$case = function(offset) {		var b = this.keywordScanner.test_case(this.startPosition, offset);		if (b)			this.currentPosition = this.startPosition + 4;		return b;	};	FP.$catch = function(offset) {		var b = this.keywordScanner.test_catch(this.startPosition, offset);		if (b)			this.currentPosition = this.startPosition + 5;		return b;	};	FP.$class = function(offset) {		var b = this.keywordScanner.test_class(this.startPosition, offset);		if (b)			this.currentPosition = this.startPosition + 5;		return b;	};	FP.$continue = function(offset) {		var b = this.keywordScanner.test_continue(this.startPosition, offset);		if (b)			this.currentPosition = this.startPosition + 8;		return b;	};	FP.$else = function(offset) {		var b = this.keywordScanner.test_else(this.startPosition, offset);		if (b)			this.currentPosition = this.startPosition + 4;		return b;	};	FP.$default = function(offset) {		var b = this.keywordScanner.test_default(this.startPosition, offset);		if (b)			this.currentPosition = this.startPosition + 7;		return b;	}	FP.$delete = function(offset) {		var b = this.keywordScanner.test_delete(this.startPosition, offset);		if (b)			this.currentPosition = this.startPosition + 6;		return b;	};	FP.$do = function(offset) {		var b = this.keywordScanner.test_do(this.startPosition, offset);		if (b)			this.currentPosition = this.startPosition + 2;		return b;	};	FP.$false = function(offset) {		var b = this.keywordScanner.test_false(this.startPosition, offset);		if (b)			this.currentPosition = this.startPosition + 5;		return b;	};	FP.$for = function(offset) {		var b = this.keywordScanner.test_for(this.startPosition, offset);		if (b)			this.currentPosition = this.startPosition + 3;		return b;	};	FP.$finally = function(offset) {		var b = this.keywordScanner.test_finally(this.startPosition, offset);		if (b)			this.currentPosition = this.startPosition + 7;		return b;	};	FP.$function = function(offset) {		var b = this.keywordScanner.test_function(this.startPosition, offset);		if (b)			this.currentPosition = this.startPosition + 8;		return b;	};	FP.$if = function(offset) {		var b = this.keywordScanner.test_if(this.startPosition, offset);		if (b)			this.currentPosition = this.startPosition + 2;		return b;	};	FP.$in = function(offset) {		var b = this.keywordScanner.test_in(this.startPosition, offset);		if (b)			this.currentPosition = this.startPosition + 2;		return b;	};	FP.$new = function(offset) {		var b = this.keywordScanner.test_new(this.startPosition, offset);		if (b)			this.currentPosition = this.startPosition + 3;		return b;	};	FP.$null = function(offset) {		var b = this.keywordScanner.test_null(this.startPosition, offset);		if (b)			this.currentPosition = this.startPosition + 4;		return b;	};	FP.$return = function(offset) {		var b = this.keywordScanner.test_return(this.startPosition, offset);		if (b)			this.currentPosition = this.startPosition + 6;		return b;	};	FP.$switch = function(offset) {		var b = this.keywordScanner.test_switch(this.startPosition, offset);		if (b)			this.currentPosition = this.startPosition + 6;		return b;	};	FP.$this = function(offset) {		var b = this.keywordScanner.test_this(this.startPosition, offset);		if (b)			this.currentPosition = this.startPosition + 4;		return b;	}	FP.$throw = function(offset) {		var b = this.keywordScanner.test_throw(this.startPosition, offset);		if (b)			this.currentPosition = this.startPosition + 5;		return b;	}	FP.$true = function(offset) {		var b = this.keywordScanner.test_true(this.startPosition, offset);		if (b)			this.currentPosition = this.startPosition + 4;		return b;	};	FP.$try = function(offset) {		var b = this.keywordScanner.test_try(this.startPosition, offset);		if (b)			this.currentPosition = this.startPosition + 3;		return b;	};	FP.$typeof = function(offset) {		var b = this.keywordScanner.test_typeof(this.startPosition, offset);		if (b)			this.currentPosition = this.startPosition + 6;		return b;	};	FP.$undefined = function(offset) {		var b = this.keywordScanner.test_undefined(this.startPosition, offset);		if (b)			this.currentPosition = this.startPosition + 9;		return b;	};	FP.$var = function(offset) {		var b = this.keywordScanner.test_var(this.startPosition, offset);		if (b)			this.currentPosition = this.startPosition + 3;		return b;	}	FP.$void = function(offset) {		var b = this.keywordScanner.test_void(this.startPosition, offset);		if (b)			this.currentPosition = this.startPosition + 4;		return b;	};	FP.$while = function(offset) {		var b = this.keywordScanner.test_while(this.startPosition, offset);		if (b)			this.currentPosition = this.startPosition + 5;		return b;	};	FP.$with = function(offset) {		var b = this.keywordScanner.test_with(this.startPosition, offset);		if (b)			this.currentPosition = this.startPosition + 4;		return b;	};} class__Scanner__(window);