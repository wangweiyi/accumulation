 /**
 *  @description 在text中查找regex
 *  @param {char} regex 正则
 *  @param {char} text 要匹配的文本
 *  @return {int} 成功返回1，失败返回0
 */
int match(char *regex, char *text) {
	if ( regex[0] == '^' ) {
		return matchStart(regex+1, text);
	}
	do {
		if ( matchStart(regex, text) ) {
			return 1;
		}
	} while (*text++ != '\0');
	return 0;
}

/**
 * @description 在text开头查找regex
 * @param {char} regex 正则
 * @param {char} text 要匹配的文本
 * @return {int} 成功返回1，失败返回0
 */
int matchStart(char *regex, char *text) {
	if ( regex[0] == '\0' ) { //正则为空字串符
		return 1;
	}
	if ( regex[0] == '$' && regex[1] == "\0" ) {
		return *text == "\0";
	}
	if ( *text != "\0" && (regex[0] == '.' || regex[0] == *text) ) {
		return matchStart(regex+1, text+1);
	}
	return 0;
}

/**
 * @description 在text开头查找0到多个字符c
 * @param {int} c 要匹配的字符
 * @param {char} regex 正则
 * @param {char} text 要匹配的文本
 * @return {int} 成功返回1，失败返回0
 */
int matchCharactar(int c, char *regex, char *text) {
	do { /* 通配符 * 匹配0或多个实例 */
		if ( matchStart(regex, text) ) {
			return 1;
		}
	} while(*text != '\0' && (*text++ == c || c == '.'));
	return 0;
}