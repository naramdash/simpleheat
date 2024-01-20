"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _SimpleHeat_instances, _SimpleHeat_ctx, _SimpleHeat_max, _SimpleHeat_data, _SimpleHeat_circle, _SimpleHeat_r, _SimpleHeat_grad, _SimpleHeat_animationFrameId, _SimpleHeat_colorize;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleHeat = void 0;
var DefaultRadius = 25;
var DefaultGradient = {
    0.4: "blue",
    0.6: "cyan",
    0.7: "lime",
    0.8: "yellow",
    1.0: "red",
};
var SimpleHeat = /** @class */ (function () {
    function SimpleHeat(canvas, width, height) {
        if (canvas === void 0) { canvas = document.createElement("canvas"); }
        if (width === void 0) { width = 500; }
        if (height === void 0) { height = 500; }
        _SimpleHeat_instances.add(this);
        _SimpleHeat_ctx.set(this, void 0);
        _SimpleHeat_max.set(this, void 0);
        _SimpleHeat_data.set(this, void 0);
        //#endregion
        //#region rendering configuration
        _SimpleHeat_circle.set(this, null);
        _SimpleHeat_r.set(this, null);
        _SimpleHeat_grad.set(this, null);
        //#endregion
        _SimpleHeat_animationFrameId.set(this, null);
        this.canvas = canvas;
        // https://html.spec.whatwg.org/multipage/canvas.html#concept-canvas-will-read-frequently
        // https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext#willreadfrequently
        __classPrivateFieldSet(this, _SimpleHeat_ctx, this.canvas.getContext("2d", { willReadFrequently: true }), "f");
        this.canvas.width = width;
        this.canvas.height = height;
        __classPrivateFieldSet(this, _SimpleHeat_max, 1, "f");
        __classPrivateFieldSet(this, _SimpleHeat_data, [], "f");
    }
    //#region data configuration
    SimpleHeat.prototype.data = function (data) {
        __classPrivateFieldSet(this, _SimpleHeat_data, data, "f");
        return this;
    };
    SimpleHeat.prototype.max = function (max) {
        __classPrivateFieldSet(this, _SimpleHeat_max, max, "f");
        return this;
    };
    SimpleHeat.prototype.add = function (point) {
        __classPrivateFieldGet(this, _SimpleHeat_data, "f").push(point);
        return this;
    };
    SimpleHeat.prototype.clear = function () {
        __classPrivateFieldSet(this, _SimpleHeat_data, [], "f");
        return this;
    };
    SimpleHeat.prototype.radius = function (radius, blur) {
        if (blur === void 0) { blur = 15; }
        var circle = (__classPrivateFieldSet(this, _SimpleHeat_circle, document.createElement("canvas"), "f"));
        var ctx = __classPrivateFieldGet(this, _SimpleHeat_circle, "f").getContext("2d");
        var r2 = (__classPrivateFieldSet(this, _SimpleHeat_r, radius + blur, "f"));
        circle.width = circle.height = r2 * 2;
        ctx.shadowOffsetX = ctx.shadowOffsetY = r2 * 2;
        ctx.shadowBlur = blur;
        ctx.shadowColor = "black";
        ctx.beginPath();
        ctx.arc(-r2, -r2, radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
        return this;
    };
    SimpleHeat.prototype.gradient = function (grad) {
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        var gradient = ctx.createLinearGradient(0, 0, 0, 256);
        canvas.width = 1;
        canvas.height = 256;
        for (var i in grad) {
            gradient.addColorStop(+i, grad[i]);
        }
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1, 256);
        __classPrivateFieldSet(this, _SimpleHeat_grad, ctx.getImageData(0, 0, 1, 256).data, "f");
        return this;
    };
    SimpleHeat.prototype.draw = function (minOpacity) {
        var _this = this;
        if (minOpacity === void 0) { minOpacity = 0.05; }
        if (__classPrivateFieldGet(this, _SimpleHeat_animationFrameId, "f"))
            cancelAnimationFrame(__classPrivateFieldGet(this, _SimpleHeat_animationFrameId, "f"));
        __classPrivateFieldSet(this, _SimpleHeat_animationFrameId, requestAnimationFrame(function () {
            if (!__classPrivateFieldGet(_this, _SimpleHeat_circle, "f"))
                _this.radius(DefaultRadius);
            if (!__classPrivateFieldGet(_this, _SimpleHeat_grad, "f"))
                _this.gradient(DefaultGradient);
            var ctx = __classPrivateFieldGet(_this, _SimpleHeat_ctx, "f");
            ctx.clearRect(0, 0, _this.canvas.width, _this.canvas.height);
            // draw a grayscale heatmap by putting a blurred circle at each data point
            for (var i = 0, len = __classPrivateFieldGet(_this, _SimpleHeat_data, "f").length, p = void 0; i < len; i++) {
                p = __classPrivateFieldGet(_this, _SimpleHeat_data, "f")[i];
                ctx.globalAlpha = Math.min(Math.max(p[2] / __classPrivateFieldGet(_this, _SimpleHeat_max, "f"), minOpacity), 1);
                ctx.drawImage(__classPrivateFieldGet(_this, _SimpleHeat_circle, "f"), p[0] - __classPrivateFieldGet(_this, _SimpleHeat_r, "f"), p[1] - __classPrivateFieldGet(_this, _SimpleHeat_r, "f"));
            }
            // colorize the heatmap, using opacity value of each pixel to get the right color from our gradient
            var colored = ctx.getImageData(0, 0, _this.canvas.width, _this.canvas.height);
            __classPrivateFieldGet(_this, _SimpleHeat_instances, "m", _SimpleHeat_colorize).call(_this, colored.data, __classPrivateFieldGet(_this, _SimpleHeat_grad, "f"));
            ctx.putImageData(colored, 0, 0);
            __classPrivateFieldSet(_this, _SimpleHeat_animationFrameId, null, "f");
        }), "f");
    };
    return SimpleHeat;
}());
exports.SimpleHeat = SimpleHeat;
_SimpleHeat_ctx = new WeakMap(), _SimpleHeat_max = new WeakMap(), _SimpleHeat_data = new WeakMap(), _SimpleHeat_circle = new WeakMap(), _SimpleHeat_r = new WeakMap(), _SimpleHeat_grad = new WeakMap(), _SimpleHeat_animationFrameId = new WeakMap(), _SimpleHeat_instances = new WeakSet(), _SimpleHeat_colorize = function _SimpleHeat_colorize(pixels, gradient) {
    for (var i = 0, len = pixels.length, j = void 0; i < len; i += 4) {
        j = pixels[i + 3] * 4; // get gradient color from opacity value
        if (j) {
            pixels[i] = gradient[j];
            pixels[i + 1] = gradient[j + 1];
            pixels[i + 2] = gradient[j + 2];
        }
    }
};
