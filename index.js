!function(){"use strict";function _typeof(e){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}var caseSign=["<=",">=","<",">","!=","==","="];function each(e,t,n){var r,a,o=[];for(a in e){if(e.hasOwnProperty(a)&&o.indexOf(e[a])<0&&(r=t(a,e[a])))break;"object"==_typeof(e[a])&&o.push(e[a])}return!!r}function update(n,r){return void 0!==r&&n.constructor===Array&&each(n,function(e,t){"object"==_typeof(r)?Object.assign(t,r):"function"==typeof r&&r.call(t,n.$path[e])&&Object.assign(t,r.call(t,n.$path[e]))}),n}function getInquiry(e){var t=new RegExp(caseSign.join("|"));return t.exec(e)?t.exec(e)[0]:"=="}function setSpecialValue(e){var t="";return null!=e&&(t=e.toString().toLocaleLowerCase()),t}function eachCondition(r){var a=[],e=[];return r.value&&"string"==typeof r.value?e=r.value.split("|"):r.value&&r.value.constructor==Array||(e=[r.value]),each(e,function(e,t){var n={key:r.key||"",val:t,mode:r.mode||"==",enable:"boolean"!=typeof r.enable||r.enable,strict:r.strict||!1};"*"==n.key&&(n.key=""),"*"==n.val&&(n.val=""),"string"==typeof n.key&&(n.key=n.key.trim()),"string"==typeof n.val&&(n.val=n.val.trim()),n.strict||(n.val=n.val||""),a.push(n)}),a}function parseByString(e){var o=[];return each(e?e.toString().split(","):[""],function(e,t){var n=getInquiry(t),r=t.split(n),a={key:r[0],value:r[1],mode:n};void 0===a.value&&(a.value=a.key||"",a.key=""),o=o.concat(eachCondition(a))}),o}function parseByObject(e){var n=[],t=e;return t.constructor!==Array&&(t=[e]),each(t,function(e,t){n=n.concat(eachCondition(t))}),n}function parseCondition(e){var t=[];return 0<=["string","boolean","number"].indexOf(_typeof(e))||null==e?t=parseByString(e=setSpecialValue(e)):e.constructor!=Array&&e.constructor!=Object||(t=parseByObject(e)),t}function bindAttr(e,t,n){t[t.length-2]&&!e.$parent&&Object.defineProperty(e,"$parent",{value:t[t.length-2]}),n&&!e.$parentKey&&Object.defineProperty(e,"$parentKey",{value:n}),t[t.length-2]&&n&&!e.$parentGet&&Object.defineProperty(e,"$parentGet",{value:function(e){for(var t=this,n=null;t.$parent&&!n;)n=(t=t.$parent)[e];return n}})}function mateEnter(e,t,n,r){var a=[];return r&&(n="whole "+n),e.constructor!=Array&&(e=[e]),Object.defineProperty(a,"$path",{value:[]}),t=parseCondition(t),e&&mateDepth(n,t,e,a),a}function mateDepth(n,r,e,a,t,o,c){var u=Object.assign([],t),i=Object.assign([],o);e&&-1<[Function,Object,Array].indexOf(e.constructor)&&(void 0!==c&&i.push(c),u.push(e),bindAttr(e,u,c),mateCondition(n,e,r)&&(a.push(u[u.length-1]),a.$path.push({key:i,value:u})),each(e,function(e,t){"object"==_typeof(t)&&mateDepth(n,r,t,a,u,i,e)}))}function mateCondition(r,t,a){var o=!1,c=0;return each(a,function(e,n){if(n.key&&"object"==_typeof(t)){if(n.key)return o=-1<Object.keys(t).indexOf(n.key)&&mateValues(t[n.key],n,r);each(t,function(e,t){return o=mateValues(t,n,r)})}else n.key||"object"!=_typeof(t)?o=mateValues(t,n,r):each(t,function(e,t){return o=mateValues(t,n,r)});return o&&0<=r.indexOf("whole")&&(o=++c==a.length),o}),o}function mateValues(value,cond,method){var result=!1;if(cond.strict?"search"==method&&(value=JSON.stringify(value)):(value=setSpecialValue(value),cond.val=setSpecialValue(cond.val)),!cond.enable)return result;if(0<=["object","function"].indexOf(_typeof(value))&&null!=value)return result;switch(cond.mode){case"=":case"==":result=0<=method.indexOf("get")?cond.strict?value===cond.val:value==cond.val:0<=value.indexOf(cond.val);break;case"!=":result=0<=method.indexOf("search")?value.indexOf(cond.val)<0:value!==cond.val;break;default:result=eval('"'+value+'"'+cond.mode+'"'+cond.val+'"')}return result}function arrayGet(e,t,n){return mateEnter(e,t,"get",n)}function arraySet(e,t){return update(e,t)}function arraySearch(e,t,n){return mateEnter(e,t,"search",n)}var cdah={arrayGet:arrayGet,arraySet:arraySet,arraySearch:arraySearch};module.exports=cdah}();
