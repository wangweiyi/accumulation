/**
 * @fileOverview 分页
 * @author cathy
 *
 * [实现思路]
 * 最多显示10个按钮，不足10页时按实际页面输出，多于10页时按以下规则输出:
 * 	   当前页数为前5页时：输出前7页 + ...(链接到第8页) + 倒数2页
 *     当前页数为倒数5页时：输出前2页 + ...(链接到第3页) + 倒数7页
 *     当前页在第6页~倒数第6页之间时(例如共20页，当前为第9页)：
 *       1) 当前页大于总数的一半时：
 *         输出第1页 + ...(第2页) + 当前页的前2页（共2页） + 当前页 + 当前页的后2页（共2页） + ...(当前页后的第3页) + 倒数2页
 *         e.g.：共20页，当前为第12页，12 > 10(总数的一半), 输出：1 ...(点击跳转第2页) 10 11 12(当前页) 13 14 ...(跳转当前页后的第3页) 19 20
 *      
 *       2) 当前页小于等于总数的一半时：
 *      	输出前2页 + ...(第3页) + 当前页的前2页（共2页） + 当前页 + 当前页的后2页（共2页） + ...(当前页后的第3页) + 倒数第1页
 *       	e.g.：共20页，当前为第8页，8 < 10(总数的一半), 输出：1 2 ...(点击跳转第3页) 6 7 8(当前页) 9 10 ...(跳转当前页后的第3页) 20 
 *
 * [参数]
 * totalPage {Integer | required} 总页数
 * currentPage {Integer | optional} 当前页码，默认值1
 * 
 * [change log]
 * 2016-11-08 Created
 */
!function (fn) {
	if (typeof exports === 'object' && typeof module !== 'undefined') {
		module.exports = fn();

	} else if (typeof define === 'function' && define.amd) {
		define([], fn);

	} else {
		var f;
		typeof window !== 'undefined' ? f = window :
			typeof global !== 'undefined' ? f = global :
				typeof self !== 'undefined' ? f = self : f = {}, f.Paging = fn();
	}

} (function (totalPage) {
	'use strict';

	totalPage = +totalPage; //总页数
	if (!totalPage) {
		throw new Error('总页数未提供，paging初始化失败');
	}

	const MAX_DISPLAY = 10; //最多显示10个页码
	const HALF_DISPLAY = MAX_DISPLAY / 2; //中点

	function pageItem(text, pageNo) {
		return {
			text: text,
			pageNo: pageNo
		};
	}

	function displayNum(start, end) {
		if (typeof end === 'undefined') {
			end = start;
			start = 1;
		}

		var numArr = [];
		for (var i = start; i <= end; i++) {
			numArr.push(pageItem(i, i));
		}

		return numArr;
	}

	return function (currentPage) {
		currentPage = +currentPage || 1; //当前页码
		let pageNoArr = []; //页码数组 

		if (totalPage < MAX_DISPLAY) { //总数小于10时按实际页面输出
			pageNoArr =  displayNum(totalPage);

		} else { //总数大于MAX_DISPLAY
			if (currentPage <= HALF_DISPLAY) { //当前页数为前5页时：输出前7页 + ...(链接到第8页) + 倒数2页
				pageNoArr =  displayNum(7).concat([
					pageItem('...', 8),
					pageItem(totalPage - 1, totalPage - 1),
					pageItem(totalPage, totalPage)
				]);

			} else if (currentPage >= totalPage - 5 + 1/*totalPage本身算一页, 因此要少减1*/) { //当前页数为倒数5页时：输出前2页 + ...(链接到第3页) + 倒数7页
				pageNoArr =  displayNum(2).concat([
					pageItem('...', 3)
				]).concat(displayNum(totalPage - 7 + 1, totalPage));

			} else { // 当前页在第6页~倒数第6页之间(例如共20页，当前为第9页)
				const midPage = Math.ceil(totalPage / 2); //中间页码

				//当前页小于等于总数的一半时：
				//输出前2页 + ...(第3页) + 当前页的前2页（共2页） + 当前页 + 当前页的后2页（共2页） + ...(当前页后的第3页) + 倒数第1页
				if (currentPage <= midPage) {
					pageNoArr =  displayNum(2).concat([
						pageItem('...', 3)
					]).concat(displayNum(currentPage - 2, currentPage + 2))
						.concat([
							pageItem('...', currentPage + 3),
							pageItem(totalPage, totalPage)
						]);

				} else {
					//当前页大于总数的一半时：
					//输出第1页 + ...(第2页) + 当前页的前2页（共2页） + 当前页 + 当前页的后2页（共2页） + ...(当前页后的第3页) + 倒数2页
					pageNoArr =  [
						pageItem(1, 1),
						pageItem('...', 2)
					].concat(displayNum(currentPage - 2, currentPage + 2))
					.concat([
						pageItem('...', currentPage + 3),
						pageItem(totalPage - 1, totalPage - 1),
						pageItem(totalPage, totalPage)
					]);
				}
			}
		}

		return pageNoArr;
	};
});