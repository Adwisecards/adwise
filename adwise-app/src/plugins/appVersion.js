import axios from "axios";
import _typeof from "@babel/runtime/helpers/typeof";
import _inherits from "@babel/runtime/helpers/inherits";
import _wrapNativeSuper from "@babel/runtime/helpers/wrapNativeSuper";

function _wrapRegExp(re, groups) { _wrapRegExp = function _wrapRegExp(re, groups) { return new BabelRegExp(re, undefined, groups); }; var _RegExp = _wrapNativeSuper(RegExp); var _super = RegExp.prototype; var _groups = new WeakMap(); function BabelRegExp(re, flags, groups) { var _this = _RegExp.call(this, re, flags); _groups.set(_this, groups || _groups.get(re)); return _this; } _inherits(BabelRegExp, _RegExp); BabelRegExp.prototype.exec = function (str) { var result = _super.exec.call(this, str); if (result) result.groups = buildGroups(result, this); return result; }; BabelRegExp.prototype[Symbol.replace] = function (str, substitution) { if (typeof substitution === "string") { var groups = _groups.get(this); return _super[Symbol.replace].call(this, str, substitution.replace(/\$<([^>]+)>/g, function (_, name) { return "$" + groups[name]; })); } else if (typeof substitution === "function") { var _this = this; return _super[Symbol.replace].call(this, str, function () { var args = []; args.push.apply(args, arguments); if (_typeof(args[args.length - 1]) !== "object") { args.push(buildGroups(args, _this)); } return substitution.apply(this, args); }); } else { return _super[Symbol.replace].call(this, str, substitution); } }; function buildGroups(result, re) { var g = _groups.get(re); return Object.keys(g).reduce(function (groups, name) { groups[name] = result[g[name]]; return groups; }, Object.create(null)); } return _wrapRegExp.apply(this, arguments); }

var APP_STORE_URL = 'https://apps.apple.com/ru/app/adwise-cards/id1537570348';
var IOS_REGEX = /*#__PURE__*/_wrapRegExp(/>Версия[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*([0-9]+.[0-9]+.[0-9]+)</gm, {
    version: 1
});

export function getIosVersion(id) {
    return new Promise(function (resolve, reject) {
        axios.get(`${APP_STORE_URL}`).then(function (_ref2) {
            var data = _ref2.data;
            var regex = new RegExp(IOS_REGEX);
            var result = regex.exec(data);

            if (result && result[1]) {
                resolve(result[1]);
            } else {
                resolve("");
            }
        }, function (err) {
            resolve("");
        });
    });
}
