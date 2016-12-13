/**
 * @fileOverview 无刷新表单提交，支持跨域
 * @author cathy
 *
 * 实现原理：
 * 	 	1.在页面（父窗口）插入一个隐藏的iframe（子窗口），并将form表单的target指向该iframe。
 * 	 
 *   	2.form提交时，会提交到该iframe，iframe跳转到请求的地址，响应结果也将输出到iframe页面上。
 *   
 *   	3.基于此原理，提交前，在父窗口的window对象上设置回调：window.callbackName = function(data) {...}, 
 *   提交后，返回一段js: <script>parent.window.callbackName(responseData);</script>则可在父窗口中得到数据。
 *   (因为js是在iframe中执行的，因此需要通过parent.window找到父窗口的window对象)
 *
 *
 * [change log]
 * 	2016-11-08 Created
 */