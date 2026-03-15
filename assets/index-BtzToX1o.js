var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __reflectGet = Reflect.get;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var __superGet = (cls, obj, key) => __reflectGet(__getProtoOf(cls), key, obj);
var _a2, _e, _t2, _r2, _n2, _a3, _s2, _o2, _i2, _l2, _c2, _ha_instances, d_fn, f_fn, p_fn, v_fn, u_fn, _e2, _t3, _r3, _n3, _a4, _s3, _o3, _i3, _l3, _c3, _d2, _f2, _p2, _v2, _u2, _b2, _mh_instances, x_fn, y_fn, w_fn, h_fn, g_fn, m_fn, __fn, _b3, _e3, _t4, _r4, _n4, _a5, _s4, _o4, _c4, _e4, _t5, _r5, _n5, _Ou_instances, a_fn, s_fn, _e5, _t6, _e6, _t7, _e7, _e8, _t8, _e9, _e10, _t9, _e11, _t10, _e12, _t11, _f1_instances, r_fn, n_fn, _e13, _t12, _r6, _n6, _e14, _t13, _r7, _e15, _t14, _r8, _n7, _a6, _s5, _o5, _e16, _t15, _e17, _e18, _e19, _t16, _e20, _$g_instances, t_fn, _e21, _t17, _r9, _e22, _e23, _t18, _r10, _n8, _a7, _s6, _o6, _i4, _l4, _c5, _e24, _t19, _r11, _n9, _e25, _t20, _e26, _t21, _e27, _t22, _e28, _t23, _e29, _t24, _r12, _n10, _a8, _s7, _e30, _t25, _r13, _e31, _t26, _r14, _e32, _t27, _r15, _fd_instances, n_fn2, _a9, _e33, _t28, _r16, _n11, _e34, _t29, _r17, _n12, _md_instances, e_fn, _t30, _r18, _n13, _e35, _t31, _e36, _t32, _e37, _t33, _e38, _t34, _e39, _t35, _r19, _n14, _wd_instances, a_fn2, _s8, _d3;
(function() {
  const e = document.createElement("link").relList;
  if (e && e.supports && e.supports("modulepreload")) return;
  for (const a of document.querySelectorAll('link[rel="modulepreload"]')) n(a);
  new MutationObserver((a) => {
    for (const o of a) if (o.type === "childList") for (const i of o.addedNodes) i.tagName === "LINK" && i.rel === "modulepreload" && n(i);
  }).observe(document, { childList: true, subtree: true });
  function r(a) {
    const o = {};
    return a.integrity && (o.integrity = a.integrity), a.referrerPolicy && (o.referrerPolicy = a.referrerPolicy), a.crossOrigin === "use-credentials" ? o.credentials = "include" : a.crossOrigin === "anonymous" ? o.credentials = "omit" : o.credentials = "same-origin", o;
  }
  function n(a) {
    if (a.ep) return;
    a.ep = true;
    const o = r(a);
    fetch(a.href, o);
  }
})();
const Sm = false;
var Kl = Array.isArray, Tm = Array.prototype.indexOf, is = Array.prototype.includes, vi = Array.from, Am = Object.defineProperty, va = Object.getOwnPropertyDescriptor, pf = Object.getOwnPropertyDescriptors, Em = Object.prototype, Cm = Array.prototype, Xl = Object.getPrototypeOf, qd = Object.isExtensible;
function ks(t) {
  return typeof t == "function";
}
const vt = () => {
};
function Im(t) {
  return t();
}
function cl(t) {
  for (var e = 0; e < t.length; e++) t[e]();
}
function vf() {
  var t, e, r = new Promise((n, a) => {
    t = n, e = a;
  });
  return { promise: r, resolve: t, reject: e };
}
function gf(t, e) {
  if (Array.isArray(t)) return t;
  if (!(Symbol.iterator in t)) return Array.from(t);
  const r = [];
  for (const n of t) if (r.push(n), r.length === e) break;
  return r;
}
const xr = 2, ls = 4, ro = 8, Zl = 1 << 24, xa = 16, yn = 32, za = 64, dl = 128, nn = 512, mr = 1024, Ir = 2048, Dn = 4096, Qr = 8192, an = 16384, Ua = 32768, ul = 1 << 25, Kn = 65536, Yd = 1 << 17, Pm = 1 << 18, bs = 1 << 19, mf = 1 << 20, Cn = 1 << 25, Oa = 65536, fl = 1 << 21, Jl = 1 << 22, ga = 1 << 23, $n = Symbol("$state"), hf = Symbol("legacy props"), $m = Symbol(""), Wn = new class extends Error {
  constructor() {
    super(...arguments);
    __publicField(this, "name", "StaleReactionError");
    __publicField(this, "message", "The reaction that called `getAbortSignal()` was re-run or destroyed");
  }
}(), _f = !!((_a2 = globalThis.document) == null ? void 0 : _a2.contentType) && globalThis.document.contentType.includes("xml");
function bf(t) {
  throw new Error("https://svelte.dev/e/lifecycle_outside_component");
}
function Nm() {
  throw new Error("https://svelte.dev/e/async_derived_orphan");
}
function Rm(t, e, r) {
  throw new Error("https://svelte.dev/e/each_key_duplicate");
}
function Mm(t) {
  throw new Error("https://svelte.dev/e/effect_in_teardown");
}
function zm() {
  throw new Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function Om(t) {
  throw new Error("https://svelte.dev/e/effect_orphan");
}
function Dm() {
  throw new Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function Lm(t) {
  throw new Error("https://svelte.dev/e/props_invalid_value");
}
function jm() {
  throw new Error("https://svelte.dev/e/state_descriptors_fixed");
}
function Bm() {
  throw new Error("https://svelte.dev/e/state_prototype_fixed");
}
function Fm() {
  throw new Error("https://svelte.dev/e/state_unsafe_mutation");
}
function Um() {
  throw new Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
const Gm = 1, Wm = 2, xf = 4, Vm = 8, Hm = 16, qm = 1, Ym = 2, yf = 4, Km = 8, Xm = 16, wf = 1, Zm = 2, hr = Symbol(), kf = "http://www.w3.org/1999/xhtml", Sf = "http://www.w3.org/2000/svg", Jm = "http://www.w3.org/1998/Math/MathML", Tf = "@attach";
function Qm() {
  console.warn("https://svelte.dev/e/select_multiple_invalid_value");
}
function eh() {
  console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
function Af(t) {
  return t === this.v;
}
function Ef(t, e) {
  return t != t ? e == e : t !== e || t !== null && typeof t == "object" || typeof t == "function";
}
function Cf(t) {
  return !Ef(t, this.v);
}
let xs = false, th = false;
function rh() {
  xs = true;
}
let Kt = null;
function cs(t) {
  Kt = t;
}
function Kd(t) {
  return Ql().get(t);
}
function nh(t, e) {
  return Ql().set(t, e), e;
}
function ah(t) {
  return Ql().has(t);
}
function De(t, e = false, r) {
  Kt = { p: Kt, i: false, c: null, e: null, s: t, x: null, r: _t, l: xs && !e ? { s: null, u: null, $: [] } : null };
}
function Le(t) {
  var e = Kt, r = e.e;
  if (r !== null) {
    e.e = null;
    for (var n of r) Xf(n);
  }
  return t !== void 0 && (e.x = t), e.i = true, Kt = e.p, t ?? {};
}
function ys() {
  return !xs || Kt !== null && Kt.l === null;
}
function Ql(t) {
  return Kt === null && bf(), Kt.c ?? (Kt.c = new Map(sh(Kt) || void 0));
}
function sh(t) {
  let e = t.p;
  for (; e !== null; ) {
    const r = e.c;
    if (r !== null) return r;
    e = e.p;
  }
  return null;
}
let Pa = [];
function If() {
  var t = Pa;
  Pa = [], cl(t);
}
function qn(t) {
  if (Pa.length === 0 && !Gs) {
    var e = Pa;
    queueMicrotask(() => {
      e === Pa && If();
    });
  }
  Pa.push(t);
}
function oh() {
  for (; Pa.length > 0; ) If();
}
function Pf(t) {
  var e = _t;
  if (e === null) return St.f |= ga, t;
  if ((e.f & Ua) === 0 && (e.f & ls) === 0) throw t;
  fa(t, e);
}
function fa(t, e) {
  for (; e !== null; ) {
    if ((e.f & dl) !== 0) {
      if ((e.f & Ua) === 0) throw t;
      try {
        e.b.error(t);
        return;
      } catch (r) {
        t = r;
      }
    }
    e = e.parent;
  }
  throw t;
}
const ih = -7169;
function cr(t, e) {
  t.f = t.f & ih | e;
}
function ec(t) {
  (t.f & nn) !== 0 || t.deps === null ? cr(t, mr) : cr(t, Dn);
}
function $f(t) {
  if (t !== null) for (const e of t) (e.f & xr) === 0 || (e.f & Oa) === 0 || (e.f ^= Oa, $f(e.deps));
}
function Nf(t, e, r) {
  (t.f & Ir) !== 0 ? e.add(t) : (t.f & Dn) !== 0 && r.add(t), $f(t.deps), cr(t, mr);
}
function lh(t, e, r) {
  if (t == null) return e(void 0), vt;
  const n = yr(() => t.subscribe(e, r));
  return n.unsubscribe ? () => n.unsubscribe() : n;
}
const Ja = [];
function ch(t, e = vt) {
  let r = null;
  const n = /* @__PURE__ */ new Set();
  function a(l) {
    if (Ef(t, l) && (t = l, r)) {
      const c = !Ja.length;
      for (const f of n) f[1](), Ja.push(f, t);
      if (c) {
        for (let f = 0; f < Ja.length; f += 2) Ja[f][0](Ja[f + 1]);
        Ja.length = 0;
      }
    }
  }
  function o(l) {
    a(l(t));
  }
  function i(l, c = vt) {
    const f = [l, c];
    return n.add(f), n.size === 1 && (r = e(a, o) || vt), l(t), () => {
      n.delete(f), n.size === 0 && r && (r(), r = null);
    };
  }
  return { set: a, update: o, subscribe: i };
}
function Rf(t) {
  let e;
  return lh(t, (r) => e = r)(), e;
}
let So = false;
function dh(t) {
  var e = So;
  try {
    return So = false, [t(), So];
  } finally {
    So = e;
  }
}
const Qa = /* @__PURE__ */ new Set();
let At = null, _n = null, pl = null, Gs = false, Wi = false, rs = null, Do = null;
var Xd = 0;
let uh = 1;
const _ha = class _ha {
  constructor() {
    __privateAdd(this, _ha_instances);
    __publicField(this, "id", uh++);
    __publicField(this, "current", /* @__PURE__ */ new Map());
    __publicField(this, "previous", /* @__PURE__ */ new Map());
    __privateAdd(this, _e, /* @__PURE__ */ new Set());
    __privateAdd(this, _t2, /* @__PURE__ */ new Set());
    __privateAdd(this, _r2, 0);
    __privateAdd(this, _n2, 0);
    __privateAdd(this, _a3, null);
    __privateAdd(this, _s2, []);
    __privateAdd(this, _o2, /* @__PURE__ */ new Set());
    __privateAdd(this, _i2, /* @__PURE__ */ new Set());
    __privateAdd(this, _l2, /* @__PURE__ */ new Map());
    __publicField(this, "is_fork", false);
    __privateAdd(this, _c2, false);
  }
  skip_effect(e) {
    __privateGet(this, _l2).has(e) || __privateGet(this, _l2).set(e, { d: [], m: [] });
  }
  unskip_effect(e) {
    var r = __privateGet(this, _l2).get(e);
    if (r) {
      __privateGet(this, _l2).delete(e);
      for (var n of r.d) cr(n, Ir), this.schedule(n);
      for (n of r.m) cr(n, Dn), this.schedule(n);
    }
  }
  capture(e, r) {
    r !== hr && !this.previous.has(e) && this.previous.set(e, r), (e.f & ga) === 0 && (this.current.set(e, e.v), _n == null ? void 0 : _n.set(e, e.v));
  }
  activate() {
    At = this;
  }
  deactivate() {
    At = null, _n = null;
  }
  flush() {
    try {
      Wi = true, At = this, __privateMethod(this, _ha_instances, f_fn).call(this);
    } finally {
      Xd = 0, pl = null, rs = null, Do = null, Wi = false, At = null, _n = null, ma.clear();
    }
  }
  discard() {
    for (const e of __privateGet(this, _t2)) e(this);
    __privateGet(this, _t2).clear();
  }
  increment(e) {
    __privateSet(this, _r2, __privateGet(this, _r2) + 1), e && __privateSet(this, _n2, __privateGet(this, _n2) + 1);
  }
  decrement(e, r) {
    __privateSet(this, _r2, __privateGet(this, _r2) - 1), e && __privateSet(this, _n2, __privateGet(this, _n2) - 1), !(__privateGet(this, _c2) || r) && (__privateSet(this, _c2, true), qn(() => {
      __privateSet(this, _c2, false), this.flush();
    }));
  }
  transfer_effects(e, r) {
    for (const n of e) __privateGet(this, _o2).add(n);
    for (const n of r) __privateGet(this, _i2).add(n);
    e.clear(), r.clear();
  }
  oncommit(e) {
    __privateGet(this, _e).add(e);
  }
  ondiscard(e) {
    __privateGet(this, _t2).add(e);
  }
  settled() {
    return (__privateGet(this, _a3) ?? __privateSet(this, _a3, vf())).promise;
  }
  static ensure() {
    if (At === null) {
      const e = At = new _ha();
      Wi || (Qa.add(At), Gs || qn(() => {
        At === e && e.flush();
      }));
    }
    return At;
  }
  apply() {
    {
      _n = null;
      return;
    }
  }
  schedule(e) {
    var _a10;
    if (pl = e, ((_a10 = e.b) == null ? void 0 : _a10.is_pending) && (e.f & (ls | ro | Zl)) !== 0 && (e.f & Ua) === 0) {
      e.b.defer_effect(e);
      return;
    }
    for (var r = e; r.parent !== null; ) {
      r = r.parent;
      var n = r.f;
      if (rs !== null && r === _t && (St === null || (St.f & xr) === 0)) return;
      if ((n & (za | yn)) !== 0) {
        if ((n & mr) === 0) return;
        r.f ^= mr;
      }
    }
    __privateGet(this, _s2).push(r);
  }
};
_e = new WeakMap();
_t2 = new WeakMap();
_r2 = new WeakMap();
_n2 = new WeakMap();
_a3 = new WeakMap();
_s2 = new WeakMap();
_o2 = new WeakMap();
_i2 = new WeakMap();
_l2 = new WeakMap();
_c2 = new WeakMap();
_ha_instances = new WeakSet();
d_fn = function() {
  return this.is_fork || __privateGet(this, _n2) > 0;
};
f_fn = function() {
  var _a10, _b4;
  if (Xd++ > 1e3 && (Qa.delete(this), ph()), !__privateMethod(this, _ha_instances, d_fn).call(this)) {
    for (const l of __privateGet(this, _o2)) __privateGet(this, _i2).delete(l), cr(l, Ir), this.schedule(l);
    for (const l of __privateGet(this, _i2)) cr(l, Dn), this.schedule(l);
  }
  const e = __privateGet(this, _s2);
  __privateSet(this, _s2, []), this.apply();
  var r = rs = [], n = [], a = Do = [];
  for (const l of e) try {
    __privateMethod(this, _ha_instances, p_fn).call(this, l, r, n);
  } catch (c) {
    throw Df(l), c;
  }
  if (At = null, a.length > 0) {
    var o = _ha.ensure();
    for (const l of a) o.schedule(l);
  }
  if (rs = null, Do = null, __privateMethod(this, _ha_instances, d_fn).call(this)) {
    __privateMethod(this, _ha_instances, v_fn).call(this, n), __privateMethod(this, _ha_instances, v_fn).call(this, r);
    for (const [l, c] of __privateGet(this, _l2)) Of(l, c);
  } else {
    __privateGet(this, _r2) === 0 && Qa.delete(this), __privateGet(this, _o2).clear(), __privateGet(this, _i2).clear();
    for (const l of __privateGet(this, _e)) l(this);
    __privateGet(this, _e).clear(), Zd(n), Zd(r), (_a10 = __privateGet(this, _a3)) == null ? void 0 : _a10.resolve();
  }
  var i = At;
  if (__privateGet(this, _s2).length > 0) {
    const l = i ?? (i = this);
    __privateGet(l, _s2).push(...__privateGet(this, _s2).filter((c) => !__privateGet(l, _s2).includes(c)));
  }
  i !== null && (Qa.add(i), __privateMethod(_b4 = i, _ha_instances, f_fn).call(_b4)), Qa.has(this) || __privateMethod(this, _ha_instances, u_fn).call(this);
};
p_fn = function(e, r, n) {
  e.f ^= mr;
  for (var a = e.first; a !== null; ) {
    var o = a.f, i = (o & (yn | za)) !== 0, l = i && (o & mr) !== 0, c = l || (o & Qr) !== 0 || __privateGet(this, _l2).has(a);
    if (!c && a.fn !== null) {
      i ? a.f ^= mr : (o & ls) !== 0 ? r.push(a) : so(a) && ((o & xa) !== 0 && __privateGet(this, _i2).add(a), us(a));
      var f = a.first;
      if (f !== null) {
        a = f;
        continue;
      }
    }
    for (; a !== null; ) {
      var p = a.next;
      if (p !== null) {
        a = p;
        break;
      }
      a = a.parent;
    }
  }
};
v_fn = function(e) {
  for (var r = 0; r < e.length; r += 1) Nf(e[r], __privateGet(this, _o2), __privateGet(this, _i2));
};
u_fn = function() {
  var _a10;
  for (const c of Qa) {
    var e = c.id < this.id, r = [];
    for (const [f, p] of this.current) {
      if (c.current.has(f)) if (e && p !== c.current.get(f)) c.current.set(f, p);
      else continue;
      r.push(f);
    }
    if (r.length !== 0) {
      var n = [...c.current.keys()].filter((f) => !this.current.has(f));
      if (n.length > 0) {
        c.activate();
        var a = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Map();
        for (var i of r) Mf(i, n, a, o);
        if (__privateGet(c, _s2).length > 0) {
          c.apply();
          for (var l of __privateGet(c, _s2)) __privateMethod(_a10 = c, _ha_instances, p_fn).call(_a10, l, [], []);
          __privateSet(c, _s2, []);
        }
        c.deactivate();
      }
    }
  }
};
let ha = _ha;
function fh(t) {
  var e = Gs;
  Gs = true;
  try {
    for (var r; ; ) {
      if (oh(), At === null) return r;
      At.flush();
    }
  } finally {
    Gs = e;
  }
}
function ph() {
  try {
    Dm();
  } catch (t) {
    fa(t, pl);
  }
}
let Un = null;
function Zd(t) {
  var e = t.length;
  if (e !== 0) {
    for (var r = 0; r < e; ) {
      var n = t[r++];
      if ((n.f & (an | Qr)) === 0 && so(n) && (Un = /* @__PURE__ */ new Set(), us(n), n.deps === null && n.first === null && n.nodes === null && n.teardown === null && n.ac === null && ep(n), (Un == null ? void 0 : Un.size) > 0)) {
        ma.clear();
        for (const a of Un) {
          if ((a.f & (an | Qr)) !== 0) continue;
          const o = [a];
          let i = a.parent;
          for (; i !== null; ) Un.has(i) && (Un.delete(i), o.push(i)), i = i.parent;
          for (let l = o.length - 1; l >= 0; l--) {
            const c = o[l];
            (c.f & (an | Qr)) === 0 && us(c);
          }
        }
        Un.clear();
      }
    }
    Un = null;
  }
}
function Mf(t, e, r, n) {
  if (!r.has(t) && (r.add(t), t.reactions !== null)) for (const a of t.reactions) {
    const o = a.f;
    (o & xr) !== 0 ? Mf(a, e, r, n) : (o & (Jl | xa)) !== 0 && (o & Ir) === 0 && zf(a, e, n) && (cr(a, Ir), tc(a));
  }
}
function zf(t, e, r) {
  const n = r.get(t);
  if (n !== void 0) return n;
  if (t.deps !== null) for (const a of t.deps) {
    if (is.call(e, a)) return true;
    if ((a.f & xr) !== 0 && zf(a, e, r)) return r.set(a, true), true;
  }
  return r.set(t, false), false;
}
function tc(t) {
  At.schedule(t);
}
function Of(t, e) {
  if (!((t.f & yn) !== 0 && (t.f & mr) !== 0)) {
    (t.f & Ir) !== 0 ? e.d.push(t) : (t.f & Dn) !== 0 && e.m.push(t), cr(t, mr);
    for (var r = t.first; r !== null; ) Of(r, e), r = r.next;
  }
}
function Df(t) {
  cr(t, mr);
  for (var e = t.first; e !== null; ) Df(e), e = e.next;
}
function Lf(t) {
  let e = 0, r = Xn(0), n;
  return () => {
    oc() && (s(r), bi(() => (e === 0 && (n = yr(() => t(() => En(r)))), e += 1, () => {
      qn(() => {
        e -= 1, e === 0 && (n == null ? void 0 : n(), n = void 0, En(r));
      });
    })));
  };
}
var vh = Kn | bs;
function gh(t, e, r, n) {
  new mh(t, e, r, n);
}
class mh {
  constructor(e, r, n, a) {
    __privateAdd(this, _mh_instances);
    __publicField(this, "parent");
    __publicField(this, "is_pending", false);
    __publicField(this, "transform_error");
    __privateAdd(this, _e2);
    __privateAdd(this, _t3, null);
    __privateAdd(this, _r3);
    __privateAdd(this, _n3);
    __privateAdd(this, _a4);
    __privateAdd(this, _s3, null);
    __privateAdd(this, _o3, null);
    __privateAdd(this, _i3, null);
    __privateAdd(this, _l3, null);
    __privateAdd(this, _c3, 0);
    __privateAdd(this, _d2, 0);
    __privateAdd(this, _f2, false);
    __privateAdd(this, _p2, /* @__PURE__ */ new Set());
    __privateAdd(this, _v2, /* @__PURE__ */ new Set());
    __privateAdd(this, _u2, null);
    __privateAdd(this, _b2, Lf(() => (__privateSet(this, _u2, Xn(__privateGet(this, _c3))), () => {
      __privateSet(this, _u2, null);
    })));
    var _a10;
    __privateSet(this, _e2, e), __privateSet(this, _r3, r), __privateSet(this, _n3, (o) => {
      var i = _t;
      i.b = this, i.f |= dl, n(o);
    }), this.parent = _t.b, this.transform_error = a ?? ((_a10 = this.parent) == null ? void 0 : _a10.transform_error) ?? ((o) => o), __privateSet(this, _a4, Ga(() => {
      __privateMethod(this, _mh_instances, h_fn).call(this);
    }, vh));
  }
  defer_effect(e) {
    Nf(e, __privateGet(this, _p2), __privateGet(this, _v2));
  }
  is_rendered() {
    return !this.is_pending && (!this.parent || this.parent.is_rendered());
  }
  has_pending_snippet() {
    return !!__privateGet(this, _r3).pending;
  }
  update_pending_count(e, r) {
    __privateMethod(this, _mh_instances, __fn).call(this, e, r), __privateSet(this, _c3, __privateGet(this, _c3) + e), !(!__privateGet(this, _u2) || __privateGet(this, _f2)) && (__privateSet(this, _f2, true), qn(() => {
      __privateSet(this, _f2, false), __privateGet(this, _u2) && ds(__privateGet(this, _u2), __privateGet(this, _c3));
    }));
  }
  get_effect_pending() {
    return __privateGet(this, _b2).call(this), s(__privateGet(this, _u2));
  }
  error(e) {
    var r = __privateGet(this, _r3).onerror;
    let n = __privateGet(this, _r3).failed;
    if (!r && !n) throw e;
    __privateGet(this, _s3) && (Tr(__privateGet(this, _s3)), __privateSet(this, _s3, null)), __privateGet(this, _o3) && (Tr(__privateGet(this, _o3)), __privateSet(this, _o3, null)), __privateGet(this, _i3) && (Tr(__privateGet(this, _i3)), __privateSet(this, _i3, null));
    var a = false, o = false;
    const i = () => {
      if (a) {
        eh();
        return;
      }
      a = true, o && Um(), __privateGet(this, _i3) !== null && Na(__privateGet(this, _i3), () => {
        __privateSet(this, _i3, null);
      }), __privateMethod(this, _mh_instances, m_fn).call(this, () => {
        __privateMethod(this, _mh_instances, h_fn).call(this);
      });
    }, l = (c) => {
      try {
        o = true, r == null ? void 0 : r(c, i), o = false;
      } catch (f) {
        fa(f, __privateGet(this, _a4) && __privateGet(this, _a4).parent);
      }
      n && __privateSet(this, _i3, __privateMethod(this, _mh_instances, m_fn).call(this, () => {
        try {
          return Gr(() => {
            var f = _t;
            f.b = this, f.f |= dl, n(__privateGet(this, _e2), () => c, () => i);
          });
        } catch (f) {
          return fa(f, __privateGet(this, _a4).parent), null;
        }
      }));
    };
    qn(() => {
      var c;
      try {
        c = this.transform_error(e);
      } catch (f) {
        fa(f, __privateGet(this, _a4) && __privateGet(this, _a4).parent);
        return;
      }
      c !== null && typeof c == "object" && typeof c.then == "function" ? c.then(l, (f) => fa(f, __privateGet(this, _a4) && __privateGet(this, _a4).parent)) : l(c);
    });
  }
}
_e2 = new WeakMap();
_t3 = new WeakMap();
_r3 = new WeakMap();
_n3 = new WeakMap();
_a4 = new WeakMap();
_s3 = new WeakMap();
_o3 = new WeakMap();
_i3 = new WeakMap();
_l3 = new WeakMap();
_c3 = new WeakMap();
_d2 = new WeakMap();
_f2 = new WeakMap();
_p2 = new WeakMap();
_v2 = new WeakMap();
_u2 = new WeakMap();
_b2 = new WeakMap();
_mh_instances = new WeakSet();
x_fn = function() {
  try {
    __privateSet(this, _s3, Gr(() => __privateGet(this, _n3).call(this, __privateGet(this, _e2))));
  } catch (e) {
    this.error(e);
  }
};
y_fn = function(e) {
  const r = __privateGet(this, _r3).failed;
  r && __privateSet(this, _i3, Gr(() => {
    r(__privateGet(this, _e2), () => e, () => () => {
    });
  }));
};
w_fn = function() {
  const e = __privateGet(this, _r3).pending;
  e && (this.is_pending = true, __privateSet(this, _o3, Gr(() => e(__privateGet(this, _e2)))), qn(() => {
    var r = __privateSet(this, _l3, document.createDocumentFragment()), n = Nn();
    r.append(n), __privateSet(this, _s3, __privateMethod(this, _mh_instances, m_fn).call(this, () => Gr(() => __privateGet(this, _n3).call(this, n)))), __privateGet(this, _d2) === 0 && (__privateGet(this, _e2).before(r), __privateSet(this, _l3, null), Na(__privateGet(this, _o3), () => {
      __privateSet(this, _o3, null);
    }), __privateMethod(this, _mh_instances, g_fn).call(this, At));
  }));
};
h_fn = function() {
  try {
    if (this.is_pending = this.has_pending_snippet(), __privateSet(this, _d2, 0), __privateSet(this, _c3, 0), __privateSet(this, _s3, Gr(() => {
      __privateGet(this, _n3).call(this, __privateGet(this, _e2));
    })), __privateGet(this, _d2) > 0) {
      var e = __privateSet(this, _l3, document.createDocumentFragment());
      cc(__privateGet(this, _s3), e);
      const r = __privateGet(this, _r3).pending;
      __privateSet(this, _o3, Gr(() => r(__privateGet(this, _e2))));
    } else __privateMethod(this, _mh_instances, g_fn).call(this, At);
  } catch (r) {
    this.error(r);
  }
};
g_fn = function(e) {
  this.is_pending = false, e.transfer_effects(__privateGet(this, _p2), __privateGet(this, _v2));
};
m_fn = function(e) {
  var r = _t, n = St, a = Kt;
  ln(__privateGet(this, _a4)), on(__privateGet(this, _a4)), cs(__privateGet(this, _a4).ctx);
  try {
    return ha.ensure(), e();
  } catch (o) {
    return Pf(o), null;
  } finally {
    ln(r), on(n), cs(a);
  }
};
__fn = function(e, r) {
  var _a10;
  if (!this.has_pending_snippet()) {
    this.parent && __privateMethod(_a10 = this.parent, _mh_instances, __fn).call(_a10, e, r);
    return;
  }
  __privateSet(this, _d2, __privateGet(this, _d2) + e), __privateGet(this, _d2) === 0 && (__privateMethod(this, _mh_instances, g_fn).call(this, r), __privateGet(this, _o3) && Na(__privateGet(this, _o3), () => {
    __privateSet(this, _o3, null);
  }), __privateGet(this, _l3) && (__privateGet(this, _e2).before(__privateGet(this, _l3)), __privateSet(this, _l3, null)));
};
function jf(t, e, r, n) {
  const a = ys() ? no : rc;
  var o = t.filter((h) => !h.settled);
  if (r.length === 0 && o.length === 0) {
    n(e.map(a));
    return;
  }
  var i = _t, l = hh(), c = o.length === 1 ? o[0].promise : o.length > 1 ? Promise.all(o.map((h) => h.promise)) : null;
  function f(h) {
    l();
    try {
      n(h);
    } catch (x) {
      (i.f & an) === 0 && fa(x, i);
    }
    Wo();
  }
  if (r.length === 0) {
    c.then(() => f(e.map(a)));
    return;
  }
  var p = Bf();
  function m() {
    Promise.all(r.map((h) => _h(h))).then((h) => f([...e.map(a), ...h])).catch((h) => fa(h, i)).finally(() => p());
  }
  c ? c.then(() => {
    l(), m(), Wo();
  }) : m();
}
function hh() {
  var t = _t, e = St, r = Kt, n = At;
  return function(o = true) {
    ln(t), on(e), cs(r), o && (t.f & an) === 0 && (n == null ? void 0 : n.activate(), n == null ? void 0 : n.apply());
  };
}
function Wo(t = true) {
  ln(null), on(null), cs(null), t && (At == null ? void 0 : At.deactivate());
}
function Bf() {
  var t = _t.b, e = At, r = t.is_rendered();
  return t.update_pending_count(1, e), e.increment(r), (n = false) => {
    t.update_pending_count(-1, e), e.decrement(r, n);
  };
}
function no(t) {
  var e = xr | Ir, r = St !== null && (St.f & xr) !== 0 ? St : null;
  return _t !== null && (_t.f |= bs), { ctx: Kt, deps: null, effects: null, equals: Af, f: e, fn: t, reactions: null, rv: 0, v: hr, wv: 0, parent: r ?? _t, ac: null };
}
function _h(t, e, r) {
  let n = _t;
  n === null && Nm();
  var a = void 0, o = Xn(hr), i = !St, l = /* @__PURE__ */ new Map();
  return $h(() => {
    var _a10;
    var c = _t, f = vf();
    a = f.promise;
    try {
      Promise.resolve(t()).then(f.resolve, f.reject).finally(Wo);
    } catch (x) {
      f.reject(x), Wo();
    }
    var p = At;
    if (i) {
      if ((c.f & Ua) !== 0) var m = Bf();
      if (n.b.is_rendered()) (_a10 = l.get(p)) == null ? void 0 : _a10.reject(Wn), l.delete(p);
      else {
        for (const x of l.values()) x.reject(Wn);
        l.clear();
      }
      l.set(p, f);
    }
    const h = (x, b = void 0) => {
      if (m) {
        var y = b === Wn;
        m(y);
      }
      if (!(b === Wn || (c.f & an) !== 0)) {
        if (p.activate(), b) o.f |= ga, ds(o, b);
        else {
          (o.f & ga) !== 0 && (o.f ^= ga), ds(o, x);
          for (const [k, D] of l) {
            if (l.delete(k), k === p) break;
            D.reject(Wn);
          }
        }
        p.deactivate();
      }
    };
    f.promise.then(h, (x) => h(null, x || "unknown"));
  }), mi(() => {
    for (const c of l.values()) c.reject(Wn);
  }), new Promise((c) => {
    function f(p) {
      function m() {
        p === a ? c(o) : f(a);
      }
      p.then(m, m);
    }
    f(a);
  });
}
function V(t) {
  const e = no(t);
  return np(e), e;
}
function rc(t) {
  const e = no(t);
  return e.equals = Cf, e;
}
function bh(t) {
  var e = t.effects;
  if (e !== null) {
    t.effects = null;
    for (var r = 0; r < e.length; r += 1) Tr(e[r]);
  }
}
function xh(t) {
  for (var e = t.parent; e !== null; ) {
    if ((e.f & xr) === 0) return (e.f & an) === 0 ? e : null;
    e = e.parent;
  }
  return null;
}
function nc(t) {
  var e, r = _t;
  ln(xh(t));
  try {
    t.f &= ~Oa, bh(t), e = ip(t);
  } finally {
    ln(r);
  }
  return e;
}
function Ff(t) {
  var e = t.v, r = nc(t);
  if (!t.equals(r) && (t.wv = sp(), (!(At == null ? void 0 : At.is_fork) || t.deps === null) && (t.v = r, At == null ? void 0 : At.capture(t, e), t.deps === null))) {
    cr(t, mr);
    return;
  }
  _a || (_n !== null ? (oc() || (At == null ? void 0 : At.is_fork)) && _n.set(t, r) : ec(t));
}
function yh(t) {
  var _a10, _b4;
  if (t.effects !== null) for (const e of t.effects) (e.teardown || e.ac) && ((_a10 = e.teardown) == null ? void 0 : _a10.call(e), (_b4 = e.ac) == null ? void 0 : _b4.abort(Wn), e.teardown = vt, e.ac = null, Zs(e, 0), ic(e));
}
function Uf(t) {
  if (t.effects !== null) for (const e of t.effects) e.teardown && us(e);
}
let vl = /* @__PURE__ */ new Set();
const ma = /* @__PURE__ */ new Map();
let Gf = false;
function Xn(t, e) {
  var r = { f: 0, v: t, reactions: null, equals: Af, rv: 0, wv: 0 };
  return r;
}
function ee(t, e) {
  const r = Xn(t);
  return np(r), r;
}
function wh(t, e = false, r = true) {
  var _a10;
  const n = Xn(t);
  return e || (n.equals = Cf), xs && r && Kt !== null && Kt.l !== null && ((_a10 = Kt.l).s ?? (_a10.s = [])).push(n), n;
}
function g(t, e, r = false) {
  St !== null && (!bn || (St.f & Yd) !== 0) && ys() && (St.f & (xr | xa | Jl | Yd)) !== 0 && (sn === null || !is.call(sn, t)) && Fm();
  let n = r ? nt(e) : e;
  return ds(t, n, Do);
}
function ds(t, e, r = null) {
  if (!t.equals(e)) {
    var n = t.v;
    _a ? ma.set(t, e) : ma.set(t, n), t.v = e;
    var a = ha.ensure();
    if (a.capture(t, n), (t.f & xr) !== 0) {
      const o = t;
      (t.f & Ir) !== 0 && nc(o), _n === null && ec(o);
    }
    t.wv = sp(), Wf(t, Ir, r), ys() && _t !== null && (_t.f & mr) !== 0 && (_t.f & (yn | za)) === 0 && (tn === null ? Rh([t]) : tn.push(t)), !a.is_fork && vl.size > 0 && !Gf && kh();
  }
  return e;
}
function kh() {
  Gf = false;
  for (const t of vl) (t.f & mr) !== 0 && cr(t, Dn), so(t) && us(t);
  vl.clear();
}
function Jd(t, e = 1) {
  var r = s(t), n = e === 1 ? r++ : r--;
  return g(t, r), n;
}
function En(t) {
  g(t, t.v + 1);
}
function Wf(t, e, r) {
  var n = t.reactions;
  if (n !== null) for (var a = ys(), o = n.length, i = 0; i < o; i++) {
    var l = n[i], c = l.f;
    if (!(!a && l === _t)) {
      var f = (c & Ir) === 0;
      if (f && cr(l, e), (c & xr) !== 0) {
        var p = l;
        _n == null ? void 0 : _n.delete(p), (c & Oa) === 0 && (c & nn && (l.f |= Oa), Wf(p, Dn, r));
      } else if (f) {
        var m = l;
        (c & xa) !== 0 && Un !== null && Un.add(m), r !== null ? r.push(m) : tc(m);
      }
    }
  }
}
function nt(t) {
  if (typeof t != "object" || t === null || $n in t) return t;
  const e = Xl(t);
  if (e !== Em && e !== Cm) return t;
  var r = /* @__PURE__ */ new Map(), n = Kl(t), a = ee(0), o = Yn, i = (l) => {
    if (Yn === o) return l();
    var c = St, f = Yn;
    on(null), nu(o);
    var p = l();
    return on(c), nu(f), p;
  };
  return n && r.set("length", ee(t.length)), new Proxy(t, { defineProperty(l, c, f) {
    (!("value" in f) || f.configurable === false || f.enumerable === false || f.writable === false) && jm();
    var p = r.get(c);
    return p === void 0 ? i(() => {
      var m = ee(f.value);
      return r.set(c, m), m;
    }) : g(p, f.value, true), true;
  }, deleteProperty(l, c) {
    var f = r.get(c);
    if (f === void 0) {
      if (c in l) {
        const p = i(() => ee(hr));
        r.set(c, p), En(a);
      }
    } else g(f, hr), En(a);
    return true;
  }, get(l, c, f) {
    var _a10;
    if (c === $n) return t;
    var p = r.get(c), m = c in l;
    if (p === void 0 && (!m || ((_a10 = va(l, c)) == null ? void 0 : _a10.writable)) && (p = i(() => {
      var x = nt(m ? l[c] : hr), b = ee(x);
      return b;
    }), r.set(c, p)), p !== void 0) {
      var h = s(p);
      return h === hr ? void 0 : h;
    }
    return Reflect.get(l, c, f);
  }, getOwnPropertyDescriptor(l, c) {
    var f = Reflect.getOwnPropertyDescriptor(l, c);
    if (f && "value" in f) {
      var p = r.get(c);
      p && (f.value = s(p));
    } else if (f === void 0) {
      var m = r.get(c), h = m == null ? void 0 : m.v;
      if (m !== void 0 && h !== hr) return { enumerable: true, configurable: true, value: h, writable: true };
    }
    return f;
  }, has(l, c) {
    var _a10;
    if (c === $n) return true;
    var f = r.get(c), p = f !== void 0 && f.v !== hr || Reflect.has(l, c);
    if (f !== void 0 || _t !== null && (!p || ((_a10 = va(l, c)) == null ? void 0 : _a10.writable))) {
      f === void 0 && (f = i(() => {
        var h = p ? nt(l[c]) : hr, x = ee(h);
        return x;
      }), r.set(c, f));
      var m = s(f);
      if (m === hr) return false;
    }
    return p;
  }, set(l, c, f, p) {
    var _a10;
    var m = r.get(c), h = c in l;
    if (n && c === "length") for (var x = f; x < m.v; x += 1) {
      var b = r.get(x + "");
      b !== void 0 ? g(b, hr) : x in l && (b = i(() => ee(hr)), r.set(x + "", b));
    }
    if (m === void 0) (!h || ((_a10 = va(l, c)) == null ? void 0 : _a10.writable)) && (m = i(() => ee(void 0)), g(m, nt(f)), r.set(c, m));
    else {
      h = m.v !== hr;
      var y = i(() => nt(f));
      g(m, y);
    }
    var k = Reflect.getOwnPropertyDescriptor(l, c);
    if ((k == null ? void 0 : k.set) && k.set.call(p, f), !h) {
      if (n && typeof c == "string") {
        var D = r.get("length"), U = Number(c);
        Number.isInteger(U) && U >= D.v && g(D, U + 1);
      }
      En(a);
    }
    return true;
  }, ownKeys(l) {
    s(a);
    var c = Reflect.ownKeys(l).filter((m) => {
      var h = r.get(m);
      return h === void 0 || h.v !== hr;
    });
    for (var [f, p] of r) p.v !== hr && !(f in l) && c.push(f);
    return c;
  }, setPrototypeOf() {
    Bm();
  } });
}
function Qd(t) {
  try {
    if (t !== null && typeof t == "object" && $n in t) return t[$n];
  } catch {
  }
  return t;
}
function Sh(t, e) {
  return Object.is(Qd(t), Qd(e));
}
var eu, Vf, Hf, qf;
function Th() {
  if (eu === void 0) {
    eu = window, Vf = /Firefox/.test(navigator.userAgent);
    var t = Element.prototype, e = Node.prototype, r = Text.prototype;
    Hf = va(e, "firstChild").get, qf = va(e, "nextSibling").get, qd(t) && (t.__click = void 0, t.__className = void 0, t.__attributes = null, t.__style = void 0, t.__e = void 0), qd(r) && (r.__t = void 0);
  }
}
function Nn(t = "") {
  return document.createTextNode(t);
}
function Jr(t) {
  return Hf.call(t);
}
function ao(t) {
  return qf.call(t);
}
function d(t, e) {
  return Jr(t);
}
function re(t, e = false) {
  {
    var r = Jr(t);
    return r instanceof Comment && r.data === "" ? ao(r) : r;
  }
}
function v(t, e = 1, r = false) {
  let n = t;
  for (; e--; ) n = ao(n);
  return n;
}
function Ah(t) {
  t.textContent = "";
}
function Yf() {
  return false;
}
function ac(t, e, r) {
  return document.createElementNS(e ?? kf, t, void 0);
}
function Eh(t, e) {
  if (e) {
    const r = document.body;
    t.autofocus = true, qn(() => {
      document.activeElement === r && t.focus();
    });
  }
}
let tu = false;
function Ch() {
  tu || (tu = true, document.addEventListener("reset", (t) => {
    Promise.resolve().then(() => {
      var _a10;
      if (!t.defaultPrevented) for (const e of t.target.elements) (_a10 = e.__on_r) == null ? void 0 : _a10.call(e);
    });
  }, { capture: true }));
}
function gi(t) {
  var e = St, r = _t;
  on(null), ln(null);
  try {
    return t();
  } finally {
    on(e), ln(r);
  }
}
function sc(t, e, r, n = r) {
  t.addEventListener(e, () => gi(r));
  const a = t.__on_r;
  a ? t.__on_r = () => {
    a(), n(true);
  } : t.__on_r = () => n(true), Ch();
}
function Kf(t) {
  _t === null && (St === null && Om(), zm()), _a && Mm();
}
function Ih(t, e) {
  var r = e.last;
  r === null ? e.last = e.first = t : (r.next = t, t.prev = r, e.last = t);
}
function wn(t, e) {
  var r = _t;
  r !== null && (r.f & Qr) !== 0 && (t |= Qr);
  var n = { ctx: Kt, deps: null, nodes: null, f: t | Ir | nn, first: null, fn: e, last: null, next: null, parent: r, b: r && r.b, prev: null, teardown: null, wv: 0, ac: null }, a = n;
  if ((t & ls) !== 0) rs !== null ? rs.push(n) : ha.ensure().schedule(n);
  else if (e !== null) {
    try {
      us(n);
    } catch (i) {
      throw Tr(n), i;
    }
    a.deps === null && a.teardown === null && a.nodes === null && a.first === a.last && (a.f & bs) === 0 && (a = a.first, (t & xa) !== 0 && (t & Kn) !== 0 && a !== null && (a.f |= Kn));
  }
  if (a !== null && (a.parent = r, r !== null && Ih(a, r), St !== null && (St.f & xr) !== 0 && (t & za) === 0)) {
    var o = St;
    (o.effects ?? (o.effects = [])).push(a);
  }
  return n;
}
function oc() {
  return St !== null && !bn;
}
function mi(t) {
  const e = wn(ro, null);
  return cr(e, mr), e.teardown = t, e;
}
function Ut(t) {
  Kf();
  var e = _t.f, r = !St && (e & yn) !== 0 && (e & Ua) === 0;
  if (r) {
    var n = Kt;
    (n.e ?? (n.e = [])).push(t);
  } else return Xf(t);
}
function Xf(t) {
  return wn(ls | mf, t);
}
function hi(t) {
  return Kf(), wn(ro | mf, t);
}
function Ph(t) {
  ha.ensure();
  const e = wn(za | bs, t);
  return (r = {}) => new Promise((n) => {
    r.outro ? Na(e, () => {
      Tr(e), n(void 0);
    }) : (Tr(e), n(void 0));
  });
}
function _i(t) {
  return wn(ls, t);
}
function $h(t) {
  return wn(Jl | bs, t);
}
function bi(t, e = 0) {
  return wn(ro | e, t);
}
function L(t, e = [], r = [], n = []) {
  jf(n, e, r, (a) => {
    wn(ro, () => t(...a.map(s)));
  });
}
function Ga(t, e = 0) {
  var r = wn(xa | e, t);
  return r;
}
function Zf(t, e = 0) {
  var r = wn(Zl | e, t);
  return r;
}
function Gr(t) {
  return wn(yn | bs, t);
}
function Jf(t) {
  var e = t.teardown;
  if (e !== null) {
    const r = _a, n = St;
    ru(true), on(null);
    try {
      e.call(null);
    } finally {
      ru(r), on(n);
    }
  }
}
function ic(t, e = false) {
  var r = t.first;
  for (t.first = t.last = null; r !== null; ) {
    const a = r.ac;
    a !== null && gi(() => {
      a.abort(Wn);
    });
    var n = r.next;
    (r.f & za) !== 0 ? r.parent = null : Tr(r, e), r = n;
  }
}
function Nh(t) {
  for (var e = t.first; e !== null; ) {
    var r = e.next;
    (e.f & yn) === 0 && Tr(e), e = r;
  }
}
function Tr(t, e = true) {
  var r = false;
  (e || (t.f & Pm) !== 0) && t.nodes !== null && t.nodes.end !== null && (Qf(t.nodes.start, t.nodes.end), r = true), cr(t, ul), ic(t, e && !r), Zs(t, 0);
  var n = t.nodes && t.nodes.t;
  if (n !== null) for (const o of n) o.stop();
  Jf(t), t.f ^= ul, t.f |= an;
  var a = t.parent;
  a !== null && a.first !== null && ep(t), t.next = t.prev = t.teardown = t.ctx = t.deps = t.fn = t.nodes = t.ac = null;
}
function Qf(t, e) {
  for (; t !== null; ) {
    var r = t === e ? null : ao(t);
    t.remove(), t = r;
  }
}
function ep(t) {
  var e = t.parent, r = t.prev, n = t.next;
  r !== null && (r.next = n), n !== null && (n.prev = r), e !== null && (e.first === t && (e.first = n), e.last === t && (e.last = r));
}
function Na(t, e, r = true) {
  var n = [];
  tp(t, n, true);
  var a = () => {
    r && Tr(t), e && e();
  }, o = n.length;
  if (o > 0) {
    var i = () => --o || a();
    for (var l of n) l.out(i);
  } else a();
}
function tp(t, e, r) {
  if ((t.f & Qr) === 0) {
    t.f ^= Qr;
    var n = t.nodes && t.nodes.t;
    if (n !== null) for (const l of n) (l.is_global || r) && e.push(l);
    for (var a = t.first; a !== null; ) {
      var o = a.next, i = (a.f & Kn) !== 0 || (a.f & yn) !== 0 && (t.f & xa) !== 0;
      tp(a, e, i ? r : false), a = o;
    }
  }
}
function lc(t) {
  rp(t, true);
}
function rp(t, e) {
  if ((t.f & Qr) !== 0) {
    t.f ^= Qr, (t.f & mr) === 0 && (cr(t, Ir), ha.ensure().schedule(t));
    for (var r = t.first; r !== null; ) {
      var n = r.next, a = (r.f & Kn) !== 0 || (r.f & yn) !== 0;
      rp(r, a ? e : false), r = n;
    }
    var o = t.nodes && t.nodes.t;
    if (o !== null) for (const i of o) (i.is_global || e) && i.in();
  }
}
function cc(t, e) {
  if (t.nodes) for (var r = t.nodes.start, n = t.nodes.end; r !== null; ) {
    var a = r === n ? null : ao(r);
    e.append(r), r = a;
  }
}
let Lo = false, _a = false;
function ru(t) {
  _a = t;
}
let St = null, bn = false;
function on(t) {
  St = t;
}
let _t = null;
function ln(t) {
  _t = t;
}
let sn = null;
function np(t) {
  St !== null && (sn === null ? sn = [t] : sn.push(t));
}
let Ur = null, qr = 0, tn = null;
function Rh(t) {
  tn = t;
}
let ap = 1, $a = 0, Yn = $a;
function nu(t) {
  Yn = t;
}
function sp() {
  return ++ap;
}
function so(t) {
  var e = t.f;
  if ((e & Ir) !== 0) return true;
  if (e & xr && (t.f &= ~Oa), (e & Dn) !== 0) {
    for (var r = t.deps, n = r.length, a = 0; a < n; a++) {
      var o = r[a];
      if (so(o) && Ff(o), o.wv > t.wv) return true;
    }
    (e & nn) !== 0 && _n === null && cr(t, mr);
  }
  return false;
}
function op(t, e, r = true) {
  var n = t.reactions;
  if (n !== null && !(sn !== null && is.call(sn, t))) for (var a = 0; a < n.length; a++) {
    var o = n[a];
    (o.f & xr) !== 0 ? op(o, e, false) : e === o && (r ? cr(o, Ir) : (o.f & mr) !== 0 && cr(o, Dn), tc(o));
  }
}
function ip(t) {
  var _a10;
  var e = Ur, r = qr, n = tn, a = St, o = sn, i = Kt, l = bn, c = Yn, f = t.f;
  Ur = null, qr = 0, tn = null, St = (f & (yn | za)) === 0 ? t : null, sn = null, cs(t.ctx), bn = false, Yn = ++$a, t.ac !== null && (gi(() => {
    t.ac.abort(Wn);
  }), t.ac = null);
  try {
    t.f |= fl;
    var p = t.fn, m = p();
    t.f |= Ua;
    var h = t.deps, x = At == null ? void 0 : At.is_fork;
    if (Ur !== null) {
      var b;
      if (x || Zs(t, qr), h !== null && qr > 0) for (h.length = qr + Ur.length, b = 0; b < Ur.length; b++) h[qr + b] = Ur[b];
      else t.deps = h = Ur;
      if (oc() && (t.f & nn) !== 0) for (b = qr; b < h.length; b++) ((_a10 = h[b]).reactions ?? (_a10.reactions = [])).push(t);
    } else !x && h !== null && qr < h.length && (Zs(t, qr), h.length = qr);
    if (ys() && tn !== null && !bn && h !== null && (t.f & (xr | Dn | Ir)) === 0) for (b = 0; b < tn.length; b++) op(tn[b], t);
    if (a !== null && a !== t) {
      if ($a++, a.deps !== null) for (let y = 0; y < r; y += 1) a.deps[y].rv = $a;
      if (e !== null) for (const y of e) y.rv = $a;
      tn !== null && (n === null ? n = tn : n.push(...tn));
    }
    return (t.f & ga) !== 0 && (t.f ^= ga), m;
  } catch (y) {
    return Pf(y);
  } finally {
    t.f ^= fl, Ur = e, qr = r, tn = n, St = a, sn = o, cs(i), bn = l, Yn = c;
  }
}
function Mh(t, e) {
  let r = e.reactions;
  if (r !== null) {
    var n = Tm.call(r, t);
    if (n !== -1) {
      var a = r.length - 1;
      a === 0 ? r = e.reactions = null : (r[n] = r[a], r.pop());
    }
  }
  if (r === null && (e.f & xr) !== 0 && (Ur === null || !is.call(Ur, e))) {
    var o = e;
    (o.f & nn) !== 0 && (o.f ^= nn, o.f &= ~Oa), ec(o), yh(o), Zs(o, 0);
  }
}
function Zs(t, e) {
  var r = t.deps;
  if (r !== null) for (var n = e; n < r.length; n++) Mh(t, r[n]);
}
function us(t) {
  var e = t.f;
  if ((e & an) === 0) {
    cr(t, mr);
    var r = _t, n = Lo;
    _t = t, Lo = true;
    try {
      (e & (xa | Zl)) !== 0 ? Nh(t) : ic(t), Jf(t);
      var a = ip(t);
      t.teardown = typeof a == "function" ? a : null, t.wv = ap;
      var o;
      Sm && th && (t.f & Ir) !== 0 && t.deps;
    } finally {
      Lo = n, _t = r;
    }
  }
}
async function dc() {
  await Promise.resolve(), fh();
}
function s(t) {
  var e = t.f, r = (e & xr) !== 0;
  if (St !== null && !bn) {
    var n = _t !== null && (_t.f & an) !== 0;
    if (!n && (sn === null || !is.call(sn, t))) {
      var a = St.deps;
      if ((St.f & fl) !== 0) t.rv < $a && (t.rv = $a, Ur === null && a !== null && a[qr] === t ? qr++ : Ur === null ? Ur = [t] : Ur.push(t));
      else {
        (St.deps ?? (St.deps = [])).push(t);
        var o = t.reactions;
        o === null ? t.reactions = [St] : is.call(o, St) || o.push(St);
      }
    }
  }
  if (_a && ma.has(t)) return ma.get(t);
  if (r) {
    var i = t;
    if (_a) {
      var l = i.v;
      return ((i.f & mr) === 0 && i.reactions !== null || cp(i)) && (l = nc(i)), ma.set(i, l), l;
    }
    var c = (i.f & nn) === 0 && !bn && St !== null && (Lo || (St.f & nn) !== 0), f = (i.f & Ua) === 0;
    so(i) && (c && (i.f |= nn), Ff(i)), c && !f && (Uf(i), lp(i));
  }
  if (_n == null ? void 0 : _n.has(t)) return _n.get(t);
  if ((t.f & ga) !== 0) throw t.v;
  return t.v;
}
function lp(t) {
  if (t.f |= nn, t.deps !== null) for (const e of t.deps) (e.reactions ?? (e.reactions = [])).push(t), (e.f & xr) !== 0 && (e.f & nn) === 0 && (Uf(e), lp(e));
}
function cp(t) {
  if (t.v === hr) return true;
  if (t.deps === null) return false;
  for (const e of t.deps) if (ma.has(e) || (e.f & xr) !== 0 && cp(e)) return true;
  return false;
}
function yr(t) {
  var e = bn;
  try {
    return bn = true, t();
  } finally {
    bn = e;
  }
}
function Aa(t) {
  if (!(typeof t != "object" || !t || t instanceof EventTarget)) {
    if ($n in t) gl(t);
    else if (!Array.isArray(t)) for (let e in t) {
      const r = t[e];
      typeof r == "object" && r && $n in r && gl(r);
    }
  }
}
function gl(t, e = /* @__PURE__ */ new Set()) {
  if (typeof t == "object" && t !== null && !(t instanceof EventTarget) && !e.has(t)) {
    e.add(t), t instanceof Date && t.getTime();
    for (let n in t) try {
      gl(t[n], e);
    } catch {
    }
    const r = Xl(t);
    if (r !== Object.prototype && r !== Array.prototype && r !== Map.prototype && r !== Set.prototype && r !== Date.prototype) {
      const n = pf(r);
      for (let a in n) {
        const o = n[a].get;
        if (o) try {
          o.call(t);
        } catch {
        }
      }
    }
  }
}
function zh() {
  return Symbol(Tf);
}
function Oh(t) {
  return t.endsWith("capture") && t !== "gotpointercapture" && t !== "lostpointercapture";
}
const Dh = ["beforeinput", "click", "change", "dblclick", "contextmenu", "focusin", "focusout", "input", "keydown", "keyup", "mousedown", "mousemove", "mouseout", "mouseover", "mouseup", "pointerdown", "pointermove", "pointerout", "pointerover", "pointerup", "touchend", "touchmove", "touchstart"];
function Lh(t) {
  return Dh.includes(t);
}
const jh = { formnovalidate: "formNoValidate", ismap: "isMap", nomodule: "noModule", playsinline: "playsInline", readonly: "readOnly", defaultvalue: "defaultValue", defaultchecked: "defaultChecked", srcobject: "srcObject", novalidate: "noValidate", allowfullscreen: "allowFullscreen", disablepictureinpicture: "disablePictureInPicture", disableremoteplayback: "disableRemotePlayback" };
function Bh(t) {
  return t = t.toLowerCase(), jh[t] ?? t;
}
const Fh = ["touchstart", "touchmove"];
function Uh(t) {
  return Fh.includes(t);
}
const Ls = Symbol("events"), dp = /* @__PURE__ */ new Set(), ml = /* @__PURE__ */ new Set();
function uc(t, e, r, n = {}) {
  function a(o) {
    if (n.capture || hl.call(e, o), !o.cancelBubble) return gi(() => r == null ? void 0 : r.call(this, o));
  }
  return t.startsWith("pointer") || t.startsWith("touch") || t === "wheel" ? qn(() => {
    e.addEventListener(t, a, n);
  }) : e.addEventListener(t, a, n), a;
}
function xn(t, e, r, n = {}) {
  var a = uc(e, t, r, n);
  return () => {
    t.removeEventListener(e, a, n);
  };
}
function Gh(t, e, r, n, a) {
  var o = { capture: n, passive: a }, i = uc(t, e, r, o);
  (e === document.body || e === window || e === document || e instanceof HTMLMediaElement) && mi(() => {
    e.removeEventListener(t, i, o);
  });
}
function Pe(t, e, r) {
  (e[Ls] ?? (e[Ls] = {}))[t] = r;
}
function Zt(t) {
  for (var e = 0; e < t.length; e++) dp.add(t[e]);
  for (var r of ml) r(t);
}
let au = null;
function hl(t) {
  var _a10, _b4;
  var e = this, r = e.ownerDocument, n = t.type, a = ((_a10 = t.composedPath) == null ? void 0 : _a10.call(t)) || [], o = a[0] || t.target;
  au = t;
  var i = 0, l = au === t && t[Ls];
  if (l) {
    var c = a.indexOf(l);
    if (c !== -1 && (e === document || e === window)) {
      t[Ls] = e;
      return;
    }
    var f = a.indexOf(e);
    if (f === -1) return;
    c <= f && (i = c);
  }
  if (o = a[i] || t.target, o !== e) {
    Am(t, "currentTarget", { configurable: true, get() {
      return o || r;
    } });
    var p = St, m = _t;
    on(null), ln(null);
    try {
      for (var h, x = []; o !== null; ) {
        var b = o.assignedSlot || o.parentNode || o.host || null;
        try {
          var y = (_b4 = o[Ls]) == null ? void 0 : _b4[n];
          y != null && (!o.disabled || t.target === o) && y.call(o, t);
        } catch (k) {
          h ? x.push(k) : h = k;
        }
        if (t.cancelBubble || b === e || b === null) break;
        o = b;
      }
      if (h) {
        for (let k of x) queueMicrotask(() => {
          throw k;
        });
        throw h;
      }
    } finally {
      t[Ls] = e, delete t.currentTarget, on(p), ln(m);
    }
  }
}
const Wh = ((_b3 = globalThis == null ? void 0 : globalThis.window) == null ? void 0 : _b3.trustedTypes) && globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (t) => t });
function Vh(t) {
  return (Wh == null ? void 0 : Wh.createHTML(t)) ?? t;
}
function up(t) {
  var e = ac("template");
  return e.innerHTML = Vh(t.replaceAll("<!>", "<!---->")), e.content;
}
function Zn(t, e) {
  var r = _t;
  r.nodes === null && (r.nodes = { start: t, end: e, a: null, t: null });
}
function _(t, e) {
  var r = (e & wf) !== 0, n = (e & Zm) !== 0, a, o = !t.startsWith("<!>");
  return () => {
    a === void 0 && (a = up(o ? t : "<!>" + t), r || (a = Jr(a)));
    var i = n || Vf ? document.importNode(a, true) : a.cloneNode(true);
    if (r) {
      var l = Jr(i), c = i.lastChild;
      Zn(l, c);
    } else Zn(i, i);
    return i;
  };
}
function Hh(t, e, r = "svg") {
  var n = !t.startsWith("<!>"), a = (e & wf) !== 0, o = `<${r}>${n ? t : "<!>" + t}</${r}>`, i;
  return () => {
    if (!i) {
      var l = up(o), c = Jr(l);
      if (a) for (i = document.createDocumentFragment(); Jr(c); ) i.appendChild(Jr(c));
      else i = Jr(c);
    }
    var f = i.cloneNode(true);
    if (a) {
      var p = Jr(f), m = f.lastChild;
      Zn(p, m);
    } else Zn(f, f);
    return f;
  };
}
function dn(t, e) {
  return Hh(t, e, "svg");
}
function Be(t = "") {
  {
    var e = Nn(t + "");
    return Zn(e, e), e;
  }
}
function Ae() {
  var t = document.createDocumentFragment(), e = document.createComment(""), r = Nn();
  return t.append(e, r), Zn(e, r), t;
}
function u(t, e) {
  t !== null && t.before(e);
}
function Pr() {
  var _a10;
  return (_a10 = window.__svelte ?? (window.__svelte = {})).uid ?? (_a10.uid = 1), `c${window.__svelte.uid++}`;
}
function E(t, e) {
  var r = e == null ? "" : typeof e == "object" ? `${e}` : e;
  r !== (t.__t ?? (t.__t = t.nodeValue)) && (t.__t = r, t.nodeValue = `${r}`);
}
function qh(t, e) {
  return Yh(t, e);
}
const To = /* @__PURE__ */ new Map();
function Yh(t, { target: e, anchor: r, props: n = {}, events: a, context: o, intro: i = true, transformError: l }) {
  Th();
  var c = void 0, f = Ph(() => {
    var p = r ?? e.appendChild(Nn());
    gh(p, { pending: () => {
    } }, (x) => {
      De({});
      var b = Kt;
      o && (b.c = o), a && (n.$$events = a), c = t(x, n) || {}, Le();
    }, l);
    var m = /* @__PURE__ */ new Set(), h = (x) => {
      for (var b = 0; b < x.length; b++) {
        var y = x[b];
        if (!m.has(y)) {
          m.add(y);
          var k = Uh(y);
          for (const j of [e, document]) {
            var D = To.get(j);
            D === void 0 && (D = /* @__PURE__ */ new Map(), To.set(j, D));
            var U = D.get(y);
            U === void 0 ? (j.addEventListener(y, hl, { passive: k }), D.set(y, 1)) : D.set(y, U + 1);
          }
        }
      }
    };
    return h(vi(dp)), ml.add(h), () => {
      var _a10;
      for (var x of m) for (const k of [e, document]) {
        var b = To.get(k), y = b.get(x);
        --y == 0 ? (k.removeEventListener(x, hl), b.delete(x), b.size === 0 && To.delete(k)) : b.set(x, y);
      }
      ml.delete(h), p !== r && ((_a10 = p.parentNode) == null ? void 0 : _a10.removeChild(p));
    };
  });
  return Kh.set(c, f), c;
}
let Kh = /* @__PURE__ */ new WeakMap();
class oo {
  constructor(e, r = true) {
    __publicField(this, "anchor");
    __privateAdd(this, _e3, /* @__PURE__ */ new Map());
    __privateAdd(this, _t4, /* @__PURE__ */ new Map());
    __privateAdd(this, _r4, /* @__PURE__ */ new Map());
    __privateAdd(this, _n4, /* @__PURE__ */ new Set());
    __privateAdd(this, _a5, true);
    __privateAdd(this, _s4, (e) => {
      if (__privateGet(this, _e3).has(e)) {
        var r = __privateGet(this, _e3).get(e), n = __privateGet(this, _t4).get(r);
        if (n) lc(n), __privateGet(this, _n4).delete(r);
        else {
          var a = __privateGet(this, _r4).get(r);
          a && (__privateGet(this, _t4).set(r, a.effect), __privateGet(this, _r4).delete(r), a.fragment.lastChild.remove(), this.anchor.before(a.fragment), n = a.effect);
        }
        for (const [o, i] of __privateGet(this, _e3)) {
          if (__privateGet(this, _e3).delete(o), o === e) break;
          const l = __privateGet(this, _r4).get(i);
          l && (Tr(l.effect), __privateGet(this, _r4).delete(i));
        }
        for (const [o, i] of __privateGet(this, _t4)) {
          if (o === r || __privateGet(this, _n4).has(o)) continue;
          const l = () => {
            if (Array.from(__privateGet(this, _e3).values()).includes(o)) {
              var f = document.createDocumentFragment();
              cc(i, f), f.append(Nn()), __privateGet(this, _r4).set(o, { effect: i, fragment: f });
            } else Tr(i);
            __privateGet(this, _n4).delete(o), __privateGet(this, _t4).delete(o);
          };
          __privateGet(this, _a5) || !n ? (__privateGet(this, _n4).add(o), Na(i, l, false)) : l();
        }
      }
    });
    __privateAdd(this, _o4, (e) => {
      __privateGet(this, _e3).delete(e);
      const r = Array.from(__privateGet(this, _e3).values());
      for (const [n, a] of __privateGet(this, _r4)) r.includes(n) || (Tr(a.effect), __privateGet(this, _r4).delete(n));
    });
    this.anchor = e, __privateSet(this, _a5, r);
  }
  ensure(e, r) {
    var n = At, a = Yf();
    if (r && !__privateGet(this, _t4).has(e) && !__privateGet(this, _r4).has(e)) if (a) {
      var o = document.createDocumentFragment(), i = Nn();
      o.append(i), __privateGet(this, _r4).set(e, { effect: Gr(() => r(i)), fragment: o });
    } else __privateGet(this, _t4).set(e, Gr(() => r(this.anchor)));
    if (__privateGet(this, _e3).set(n, e), a) {
      for (const [l, c] of __privateGet(this, _t4)) l === e ? n.unskip_effect(c) : n.skip_effect(c);
      for (const [l, c] of __privateGet(this, _r4)) l === e ? n.unskip_effect(c.effect) : n.skip_effect(c.effect);
      n.oncommit(__privateGet(this, _s4)), n.ondiscard(__privateGet(this, _o4));
    } else __privateGet(this, _s4).call(this, n);
  }
}
_e3 = new WeakMap();
_t4 = new WeakMap();
_r4 = new WeakMap();
_n4 = new WeakMap();
_a5 = new WeakMap();
_s4 = new WeakMap();
_o4 = new WeakMap();
function I(t, e, r = false) {
  var n = new oo(t), a = r ? Kn : 0;
  function o(i, l) {
    n.ensure(i, l);
  }
  Ga(() => {
    var i = false;
    e((l, c = 0) => {
      i = true, o(c, l);
    }), i || o(-1, null);
  }, a);
}
const Xh = Symbol("NaN");
function Zh(t, e, r) {
  var n = new oo(t), a = !ys();
  Ga(() => {
    var o = e();
    o !== o && (o = Xh), a && o !== null && typeof o == "object" && (o = {}), n.ensure(o, r);
  });
}
function Qe(t, e) {
  return e;
}
function Jh(t, e, r) {
  for (var n = [], a = e.length, o, i = e.length, l = 0; l < a; l++) {
    let m = e[l];
    Na(m, () => {
      if (o) {
        if (o.pending.delete(m), o.done.add(m), o.pending.size === 0) {
          var h = t.outrogroups;
          _l(t, vi(o.done)), h.delete(o), h.size === 0 && (t.outrogroups = null);
        }
      } else i -= 1;
    }, false);
  }
  if (i === 0) {
    var c = n.length === 0 && r !== null;
    if (c) {
      var f = r, p = f.parentNode;
      Ah(p), p.append(f), t.items.clear();
    }
    _l(t, e, !c);
  } else o = { pending: new Set(e), done: /* @__PURE__ */ new Set() }, (t.outrogroups ?? (t.outrogroups = /* @__PURE__ */ new Set())).add(o);
}
function _l(t, e, r = true) {
  var n;
  if (t.pending.size > 0) {
    n = /* @__PURE__ */ new Set();
    for (const i of t.pending.values()) for (const l of i) n.add(t.items.get(l).e);
  }
  for (var a = 0; a < e.length; a++) {
    var o = e[a];
    if (n == null ? void 0 : n.has(o)) {
      o.f |= Cn;
      const i = document.createDocumentFragment();
      cc(o, i);
    } else Tr(e[a], r);
  }
}
var su;
function Ge(t, e, r, n, a, o = null) {
  var i = t, l = /* @__PURE__ */ new Map(), c = (e & xf) !== 0;
  if (c) {
    var f = t;
    i = f.appendChild(Nn());
  }
  var p = null, m = rc(() => {
    var j = r();
    return Kl(j) ? j : j == null ? [] : vi(j);
  }), h, x = /* @__PURE__ */ new Map(), b = true;
  function y(j) {
    (U.effect.f & an) === 0 && (U.pending.delete(j), U.fallback = p, Qh(U, h, i, e, n), p !== null && (h.length === 0 ? (p.f & Cn) === 0 ? lc(p) : (p.f ^= Cn, js(p, null, i)) : Na(p, () => {
      p = null;
    })));
  }
  function k(j) {
    U.pending.delete(j);
  }
  var D = Ga(() => {
    h = s(m);
    for (var j = h.length, M = /* @__PURE__ */ new Set(), q = At, F = Yf(), P = 0; P < j; P += 1) {
      var C = h[P], T = n(C, P), N = b ? null : l.get(T);
      N ? (N.v && ds(N.v, C), N.i && ds(N.i, P), F && q.unskip_effect(N.e)) : (N = e_(l, b ? i : su ?? (su = Nn()), C, T, P, a, e, r), b || (N.e.f |= Cn), l.set(T, N)), M.add(T);
    }
    if (j === 0 && o && !p && (b ? p = Gr(() => o(i)) : (p = Gr(() => o(su ?? (su = Nn()))), p.f |= Cn)), j > M.size && Rm(), !b) if (x.set(q, M), F) {
      for (const [K, W] of l) M.has(K) || q.skip_effect(W.e);
      q.oncommit(y), q.ondiscard(k);
    } else y(q);
    s(m);
  }), U = { effect: D, items: l, pending: x, outrogroups: null, fallback: p };
  b = false;
}
function Ss(t) {
  for (; t !== null && (t.f & yn) === 0; ) t = t.next;
  return t;
}
function Qh(t, e, r, n, a) {
  var _a10, _b4, _c6, _d4, _e40, _f3, _g2, _h2, _i5;
  var o = (n & Vm) !== 0, i = e.length, l = t.items, c = Ss(t.effect.first), f, p = null, m, h = [], x = [], b, y, k, D;
  if (o) for (D = 0; D < i; D += 1) b = e[D], y = a(b, D), k = l.get(y).e, (k.f & Cn) === 0 && ((_b4 = (_a10 = k.nodes) == null ? void 0 : _a10.a) == null ? void 0 : _b4.measure(), (m ?? (m = /* @__PURE__ */ new Set())).add(k));
  for (D = 0; D < i; D += 1) {
    if (b = e[D], y = a(b, D), k = l.get(y).e, t.outrogroups !== null) for (const N of t.outrogroups) N.pending.delete(k), N.done.delete(k);
    if ((k.f & Cn) !== 0) if (k.f ^= Cn, k === c) js(k, null, r);
    else {
      var U = p ? p.next : c;
      k === t.effect.last && (t.effect.last = k.prev), k.prev && (k.prev.next = k.next), k.next && (k.next.prev = k.prev), oa(t, p, k), oa(t, k, U), js(k, U, r), p = k, h = [], x = [], c = Ss(p.next);
      continue;
    }
    if ((k.f & Qr) !== 0 && (lc(k), o && ((_d4 = (_c6 = k.nodes) == null ? void 0 : _c6.a) == null ? void 0 : _d4.unfix(), (m ?? (m = /* @__PURE__ */ new Set())).delete(k))), k !== c) {
      if (f !== void 0 && f.has(k)) {
        if (h.length < x.length) {
          var j = x[0], M;
          p = j.prev;
          var q = h[0], F = h[h.length - 1];
          for (M = 0; M < h.length; M += 1) js(h[M], j, r);
          for (M = 0; M < x.length; M += 1) f.delete(x[M]);
          oa(t, q.prev, F.next), oa(t, p, q), oa(t, F, j), c = j, p = F, D -= 1, h = [], x = [];
        } else f.delete(k), js(k, c, r), oa(t, k.prev, k.next), oa(t, k, p === null ? t.effect.first : p.next), oa(t, p, k), p = k;
        continue;
      }
      for (h = [], x = []; c !== null && c !== k; ) (f ?? (f = /* @__PURE__ */ new Set())).add(c), x.push(c), c = Ss(c.next);
      if (c === null) continue;
    }
    (k.f & Cn) === 0 && h.push(k), p = k, c = Ss(k.next);
  }
  if (t.outrogroups !== null) {
    for (const N of t.outrogroups) N.pending.size === 0 && (_l(t, vi(N.done)), (_e40 = t.outrogroups) == null ? void 0 : _e40.delete(N));
    t.outrogroups.size === 0 && (t.outrogroups = null);
  }
  if (c !== null || f !== void 0) {
    var P = [];
    if (f !== void 0) for (k of f) (k.f & Qr) === 0 && P.push(k);
    for (; c !== null; ) (c.f & Qr) === 0 && c !== t.fallback && P.push(c), c = Ss(c.next);
    var C = P.length;
    if (C > 0) {
      var T = (n & xf) !== 0 && i === 0 ? r : null;
      if (o) {
        for (D = 0; D < C; D += 1) (_g2 = (_f3 = P[D].nodes) == null ? void 0 : _f3.a) == null ? void 0 : _g2.measure();
        for (D = 0; D < C; D += 1) (_i5 = (_h2 = P[D].nodes) == null ? void 0 : _h2.a) == null ? void 0 : _i5.fix();
      }
      Jh(t, P, T);
    }
  }
  o && qn(() => {
    var _a11, _b5;
    if (m !== void 0) for (k of m) (_b5 = (_a11 = k.nodes) == null ? void 0 : _a11.a) == null ? void 0 : _b5.apply();
  });
}
function e_(t, e, r, n, a, o, i, l) {
  var c = (i & Gm) !== 0 ? (i & Hm) === 0 ? wh(r, false, false) : Xn(r) : null, f = (i & Wm) !== 0 ? Xn(a) : null;
  return { v: c, i: f, e: Gr(() => (o(e, c ?? r, f ?? a, l), () => {
    t.delete(n);
  })) };
}
function js(t, e, r) {
  if (t.nodes) for (var n = t.nodes.start, a = t.nodes.end, o = e && (e.f & Cn) === 0 ? e.nodes.start : r; n !== null; ) {
    var i = ao(n);
    if (o.before(n), n === a) return;
    n = i;
  }
}
function oa(t, e, r) {
  e === null ? t.effect.first = r : e.next = r, r === null ? t.effect.last = e : r.prev = e;
}
function fc(t, e, r = false, n = false, a = false, o = false) {
  var i = t, l = "";
  if (r) var c = t;
  L(() => {
    var f = _t;
    if (l !== (l = e() ?? "")) {
      if (r) {
        f.nodes = null, c.innerHTML = l, l !== "" && Zn(Jr(c), c.lastChild);
        return;
      }
      if (f.nodes !== null && (Qf(f.nodes.start, f.nodes.end), f.nodes = null), l !== "") {
        var p = n ? Sf : a ? Jm : void 0, m = ac(n ? "svg" : a ? "math" : "template", p);
        m.innerHTML = l;
        var h = n || a ? m : m.content;
        if (Zn(Jr(h), h.lastChild), n || a) for (; Jr(h); ) i.before(Jr(h));
        else i.before(h);
      }
    }
  });
}
function zt(t, e, r, n, a) {
  var _a10;
  var o = (_a10 = e.$$slots) == null ? void 0 : _a10[r], i = false;
  o === true && (o = e.children, i = true), o === void 0 || o(t, i ? () => n : n);
}
function bt(t, e, ...r) {
  var n = new oo(t);
  Ga(() => {
    const a = e() ?? null;
    n.ensure(a, a && ((o) => a(o, ...r)));
  }, Kn);
}
function dr(t, e, r) {
  var n = new oo(t);
  Ga(() => {
    var a = e() ?? null;
    n.ensure(a, a && ((o) => r(o, a)));
  }, Kn);
}
function fp(t, e, r, n, a, o) {
  var i = null, l = t, c = new oo(l, false);
  Ga(() => {
    const f = e() || null;
    var p = r || f === "svg" ? Sf : void 0;
    if (f === null) {
      c.ensure(null, null);
      return;
    }
    return c.ensure(f, (m) => {
      if (f) {
        if (i = ac(f, p), Zn(i, i), n) {
          var h = i.appendChild(Nn());
          n(i, h);
        }
        _t.nodes.end = i, m.before(i);
      }
    }), () => {
    };
  }, Kn), mi(() => {
  });
}
function t_(t, e) {
  var r = void 0, n;
  Zf(() => {
    r !== (r = e()) && (n && (Tr(n), n = null), r && (n = Gr(() => {
      _i(() => r(t));
    })));
  });
}
function pp(t) {
  var e, r, n = "";
  if (typeof t == "string" || typeof t == "number") n += t;
  else if (typeof t == "object") if (Array.isArray(t)) {
    var a = t.length;
    for (e = 0; e < a; e++) t[e] && (r = pp(t[e])) && (n && (n += " "), n += r);
  } else for (r in t) t[r] && (n && (n += " "), n += r);
  return n;
}
function Ws() {
  for (var t, e, r = 0, n = "", a = arguments.length; r < a; r++) (t = arguments[r]) && (e = pp(t)) && (n && (n += " "), n += e);
  return n;
}
function Et(t) {
  return typeof t == "object" ? Ws(t) : t ?? "";
}
const ou = [...` 	
\r\f\xA0\v\uFEFF`];
function r_(t, e, r) {
  var n = t == null ? "" : "" + t;
  if (e && (n = n ? n + " " + e : e), r) {
    for (var a of Object.keys(r)) if (r[a]) n = n ? n + " " + a : a;
    else if (n.length) for (var o = a.length, i = 0; (i = n.indexOf(a, i)) >= 0; ) {
      var l = i + o;
      (i === 0 || ou.includes(n[i - 1])) && (l === n.length || ou.includes(n[l])) ? n = (i === 0 ? "" : n.substring(0, i)) + n.substring(l + 1) : i = l;
    }
  }
  return n === "" ? null : n;
}
function iu(t, e = false) {
  var r = e ? " !important;" : ";", n = "";
  for (var a of Object.keys(t)) {
    var o = t[a];
    o != null && o !== "" && (n += " " + a + ": " + o + r);
  }
  return n;
}
function Vi(t) {
  return t[0] !== "-" || t[1] !== "-" ? t.toLowerCase() : t;
}
function n_(t, e) {
  if (e) {
    var r = "", n, a;
    if (Array.isArray(e) ? (n = e[0], a = e[1]) : n = e, t) {
      t = String(t).replaceAll(/\s*\/\*.*?\*\/\s*/g, "").trim();
      var o = false, i = 0, l = false, c = [];
      n && c.push(...Object.keys(n).map(Vi)), a && c.push(...Object.keys(a).map(Vi));
      var f = 0, p = -1;
      const y = t.length;
      for (var m = 0; m < y; m++) {
        var h = t[m];
        if (l ? h === "/" && t[m - 1] === "*" && (l = false) : o ? o === h && (o = false) : h === "/" && t[m + 1] === "*" ? l = true : h === '"' || h === "'" ? o = h : h === "(" ? i++ : h === ")" && i--, !l && o === false && i === 0) {
          if (h === ":" && p === -1) p = m;
          else if (h === ";" || m === y - 1) {
            if (p !== -1) {
              var x = Vi(t.substring(f, p).trim());
              if (!c.includes(x)) {
                h !== ";" && m++;
                var b = t.substring(f, m).trim();
                r += " " + b + ";";
              }
            }
            f = m + 1, p = -1;
          }
        }
      }
    }
    return n && (r += iu(n)), a && (r += iu(a, true)), r = r.trim(), r === "" ? null : r;
  }
  return t == null ? null : String(t);
}
function rt(t, e, r, n, a, o) {
  var i = t.__className;
  if (i !== r || i === void 0) {
    var l = r_(r, n, o);
    l == null ? t.removeAttribute("class") : e ? t.className = l : t.setAttribute("class", l), t.__className = r;
  } else if (o && a !== o) for (var c in o) {
    var f = !!o[c];
    (a == null || f !== !!a[c]) && t.classList.toggle(c, f);
  }
  return o;
}
function Hi(t, e = {}, r, n) {
  for (var a in r) {
    var o = r[a];
    e[a] !== o && (r[a] == null ? t.style.removeProperty(a) : t.style.setProperty(a, o, n));
  }
}
function Rt(t, e, r, n) {
  var a = t.__style;
  if (a !== e) {
    var o = n_(e, n);
    o == null ? t.removeAttribute("style") : t.style.cssText = o, t.__style = e;
  } else n && (Array.isArray(n) ? (Hi(t, r == null ? void 0 : r[0], n[0]), Hi(t, r == null ? void 0 : r[1], n[1], "important")) : Hi(t, r, n));
  return n;
}
function Js(t, e, r = false) {
  if (t.multiple) {
    if (e == null) return;
    if (!Kl(e)) return Qm();
    for (var n of t.options) n.selected = e.includes(Vs(n));
    return;
  }
  for (n of t.options) {
    var a = Vs(n);
    if (Sh(a, e)) {
      n.selected = true;
      return;
    }
  }
  (!r || e !== void 0) && (t.selectedIndex = -1);
}
function pc(t) {
  var e = new MutationObserver(() => {
    Js(t, t.__value);
  });
  e.observe(t, { childList: true, subtree: true, attributes: true, attributeFilter: ["value"] }), mi(() => {
    e.disconnect();
  });
}
function Rn(t, e, r = e) {
  var n = /* @__PURE__ */ new WeakSet(), a = true;
  sc(t, "change", (o) => {
    var i = o ? "[selected]" : ":checked", l;
    if (t.multiple) l = [].map.call(t.querySelectorAll(i), Vs);
    else {
      var c = t.querySelector(i) ?? t.querySelector("option:not([disabled])");
      l = c && Vs(c);
    }
    r(l), t.__value = l, At !== null && n.add(At);
  }), _i(() => {
    var o = e();
    if (t === document.activeElement) {
      var i = At;
      if (n.has(i)) return;
    }
    if (Js(t, o, a), a && o === void 0) {
      var l = t.querySelector(":checked");
      l !== null && (o = Vs(l), r(o));
    }
    t.__value = o, a = false;
  }), pc(t);
}
function Vs(t) {
  return "__value" in t ? t.__value : t.value;
}
const Ts = Symbol("class"), As = Symbol("style"), vp = Symbol("is custom element"), gp = Symbol("is html"), a_ = _f ? "option" : "OPTION", s_ = _f ? "select" : "SELECT";
function o_(t, e) {
  e ? t.hasAttribute("selected") || t.setAttribute("selected", "") : t.removeAttribute("selected");
}
function br(t, e, r, n) {
  var a = mp(t);
  a[e] !== (a[e] = r) && (e === "loading" && (t[$m] = r), r == null ? t.removeAttribute(e) : typeof r != "string" && hp(t).includes(e) ? t[e] = r : t.setAttribute(e, r));
}
function i_(t, e, r, n, a = false, o = false) {
  var i = mp(t), l = i[vp], c = !i[gp], f = e || {}, p = t.nodeName === a_;
  for (var m in e) m in r || (r[m] = null);
  r.class ? r.class = Et(r.class) : r[Ts] && (r.class = null), r[As] && (r.style ?? (r.style = null));
  var h = hp(t);
  for (const j in r) {
    let M = r[j];
    if (p && j === "value" && M == null) {
      t.value = t.__value = "", f[j] = M;
      continue;
    }
    if (j === "class") {
      var x = t.namespaceURI === "http://www.w3.org/1999/xhtml";
      rt(t, x, M, n, e == null ? void 0 : e[Ts], r[Ts]), f[j] = M, f[Ts] = r[Ts];
      continue;
    }
    if (j === "style") {
      Rt(t, M, e == null ? void 0 : e[As], r[As]), f[j] = M, f[As] = r[As];
      continue;
    }
    var b = f[j];
    if (!(M === b && !(M === void 0 && t.hasAttribute(j)))) {
      f[j] = M;
      var y = j[0] + j[1];
      if (y !== "$$") if (y === "on") {
        const q = {}, F = "$$" + j;
        let P = j.slice(2);
        var k = Lh(P);
        if (Oh(P) && (P = P.slice(0, -7), q.capture = true), !k && b) {
          if (M != null) continue;
          t.removeEventListener(P, f[F], q), f[F] = null;
        }
        if (k) Pe(P, t, M), Zt([P]);
        else if (M != null) {
          let C = function(T) {
            f[j].call(this, T);
          };
          f[F] = uc(P, t, C, q);
        }
      } else if (j === "style") br(t, j, M);
      else if (j === "autofocus") Eh(t, !!M);
      else if (!l && (j === "__value" || j === "value" && M != null)) t.value = t.__value = M;
      else if (j === "selected" && p) o_(t, M);
      else {
        var D = j;
        c || (D = Bh(D));
        var U = D === "defaultValue" || D === "defaultChecked";
        if (M == null && !l && !U) if (i[j] = null, D === "value" || D === "checked") {
          let q = t;
          const F = e === void 0;
          if (D === "value") {
            let P = q.defaultValue;
            q.removeAttribute(D), q.defaultValue = P, q.value = q.__value = F ? P : null;
          } else {
            let P = q.defaultChecked;
            q.removeAttribute(D), q.defaultChecked = P, q.checked = F ? P : false;
          }
        } else t.removeAttribute(j);
        else U || h.includes(D) && (l || typeof M != "string") ? (t[D] = M, D in i && (i[D] = hr)) : typeof M != "function" && br(t, D, M);
      }
    }
  }
  return f;
}
function Gt(t, e, r = [], n = [], a = [], o, i = false, l = false) {
  jf(a, r, n, (c) => {
    var f = void 0, p = {}, m = t.nodeName === s_, h = false;
    if (Zf(() => {
      var b = e(...c.map(s)), y = i_(t, f, b, o, i, l);
      h && m && "value" in b && Js(t, b.value);
      for (let D of Object.getOwnPropertySymbols(p)) b[D] || Tr(p[D]);
      for (let D of Object.getOwnPropertySymbols(b)) {
        var k = b[D];
        D.description === Tf && (!f || k !== f[D]) && (p[D] && Tr(p[D]), p[D] = Gr(() => t_(t, () => k))), y[D] = k;
      }
      f = y;
    }), m) {
      var x = t;
      _i(() => {
        Js(x, f.value, true), pc(x);
      });
    }
    h = true;
  });
}
function mp(t) {
  return t.__attributes ?? (t.__attributes = { [vp]: t.nodeName.includes("-"), [gp]: t.namespaceURI === kf });
}
var lu = /* @__PURE__ */ new Map();
function hp(t) {
  var e = t.getAttribute("is") || t.nodeName, r = lu.get(e);
  if (r) return r;
  lu.set(e, r = []);
  for (var n, a = t, o = Element.prototype; o !== a; ) {
    n = pf(a);
    for (var i in n) n[i].set && r.push(i);
    a = Xl(a);
  }
  return r;
}
function Hn(t, e, r = e) {
  var n = /* @__PURE__ */ new WeakSet();
  sc(t, "input", async (a) => {
    var o = a ? t.defaultValue : t.value;
    if (o = qi(t) ? Yi(o) : o, r(o), At !== null && n.add(At), await dc(), o !== (o = e())) {
      var i = t.selectionStart, l = t.selectionEnd, c = t.value.length;
      if (t.value = o ?? "", l !== null) {
        var f = t.value.length;
        i === l && l === c && f > c ? (t.selectionStart = f, t.selectionEnd = f) : (t.selectionStart = i, t.selectionEnd = Math.min(l, f));
      }
    }
  }), yr(e) == null && t.value && (r(qi(t) ? Yi(t.value) : t.value), At !== null && n.add(At)), bi(() => {
    var a = e();
    if (t === document.activeElement) {
      var o = At;
      if (n.has(o)) return;
    }
    qi(t) && a === Yi(t.value) || t.type === "date" && !a && !t.value || a !== t.value && (t.value = a ?? "");
  });
}
function qi(t) {
  var e = t.type;
  return e === "number" || e === "range";
}
function Yi(t) {
  return t === "" ? null : +t;
}
function l_(t, e, r = e) {
  sc(t, "change", () => {
    r(t.files);
  }), bi(() => {
    t.files = e();
  });
}
function cu(t, e) {
  return t === e || (t == null ? void 0 : t[$n]) === e;
}
function Jn(t = {}, e, r, n) {
  var a = Kt.r, o = _t;
  return _i(() => {
    var i, l;
    return bi(() => {
      i = l, l = [], yr(() => {
        t !== r(...l) && (e(t, ...l), i && cu(r(...i), t) && e(null, ...i));
      });
    }), () => {
      let c = o;
      for (; c !== a && c.parent !== null && c.parent.f & ul; ) c = c.parent;
      const f = () => {
        l && cu(r(...l), t) && e(null, ...l);
      }, p = c.teardown;
      c.teardown = () => {
        f(), p == null ? void 0 : p();
      };
    };
  }), t;
}
function _p(t = false) {
  const e = Kt, r = e.l.u;
  if (!r) return;
  let n = () => Aa(e.s);
  if (t) {
    let a = 0, o = {};
    const i = no(() => {
      let l = false;
      const c = e.s;
      for (const f in c) c[f] !== o[f] && (o[f] = c[f], l = true);
      return l && a++, a;
    });
    n = () => s(i);
  }
  r.b.length && hi(() => {
    du(e, n), cl(r.b);
  }), Ut(() => {
    const a = yr(() => r.m.map(Im));
    return () => {
      for (const o of a) typeof o == "function" && o();
    };
  }), r.a.length && Ut(() => {
    du(e, n), cl(r.a);
  });
}
function du(t, e) {
  if (t.l.s) for (const r of t.l.s) s(r);
  e();
}
const c_ = { get(t, e) {
  if (!t.exclude.includes(e)) return t.props[e];
}, set(t, e) {
  return false;
}, getOwnPropertyDescriptor(t, e) {
  if (!t.exclude.includes(e) && e in t.props) return { enumerable: true, configurable: true, value: t.props[e] };
}, has(t, e) {
  return t.exclude.includes(e) ? false : e in t.props;
}, ownKeys(t) {
  return Reflect.ownKeys(t.props).filter((e) => !t.exclude.includes(e));
} };
function ut(t, e, r) {
  return new Proxy({ props: t, exclude: e }, c_);
}
const d_ = { get(t, e) {
  if (!t.exclude.includes(e)) return s(t.version), e in t.special ? t.special[e]() : t.props[e];
}, set(t, e, r) {
  if (!(e in t.special)) {
    var n = _t;
    try {
      ln(t.parent_effect), t.special[e] = ae({ get [e]() {
        return t.props[e];
      } }, e, yf);
    } finally {
      ln(n);
    }
  }
  return t.special[e](r), Jd(t.version), true;
}, getOwnPropertyDescriptor(t, e) {
  if (!t.exclude.includes(e) && e in t.props) return { enumerable: true, configurable: true, value: t.props[e] };
}, deleteProperty(t, e) {
  return t.exclude.includes(e) || (t.exclude.push(e), Jd(t.version)), true;
}, has(t, e) {
  return t.exclude.includes(e) ? false : e in t.props;
}, ownKeys(t) {
  return Reflect.ownKeys(t.props).filter((e) => !t.exclude.includes(e));
} };
function $t(t, e) {
  return new Proxy({ props: t, exclude: e, special: {}, version: Xn(0), parent_effect: _t }, d_);
}
const u_ = { get(t, e) {
  let r = t.props.length;
  for (; r--; ) {
    let n = t.props[r];
    if (ks(n) && (n = n()), typeof n == "object" && n !== null && e in n) return n[e];
  }
}, set(t, e, r) {
  let n = t.props.length;
  for (; n--; ) {
    let a = t.props[n];
    ks(a) && (a = a());
    const o = va(a, e);
    if (o && o.set) return o.set(r), true;
  }
  return false;
}, getOwnPropertyDescriptor(t, e) {
  let r = t.props.length;
  for (; r--; ) {
    let n = t.props[r];
    if (ks(n) && (n = n()), typeof n == "object" && n !== null && e in n) {
      const a = va(n, e);
      return a && !a.configurable && (a.configurable = true), a;
    }
  }
}, has(t, e) {
  if (e === $n || e === hf) return false;
  for (let r of t.props) if (ks(r) && (r = r()), r != null && e in r) return true;
  return false;
}, ownKeys(t) {
  const e = [];
  for (let r of t.props) if (ks(r) && (r = r()), !!r) {
    for (const n in r) e.includes(n) || e.push(n);
    for (const n of Object.getOwnPropertySymbols(r)) e.includes(n) || e.push(n);
  }
  return e;
} };
function et(...t) {
  return new Proxy({ props: t }, u_);
}
function ae(t, e, r, n) {
  var _a10;
  var a = !xs || (r & Ym) !== 0, o = (r & Km) !== 0, i = (r & Xm) !== 0, l = n, c = true, f = () => (c && (c = false, l = i ? yr(n) : n), l);
  let p;
  if (o) {
    var m = $n in t || hf in t;
    p = ((_a10 = va(t, e)) == null ? void 0 : _a10.set) ?? (m && e in t ? (j) => t[e] = j : void 0);
  }
  var h, x = false;
  o ? [h, x] = dh(() => t[e]) : h = t[e], h === void 0 && n !== void 0 && (h = f(), p && (a && Lm(), p(h)));
  var b;
  if (a ? b = () => {
    var j = t[e];
    return j === void 0 ? f() : (c = true, j);
  } : b = () => {
    var j = t[e];
    return j !== void 0 && (l = void 0), j === void 0 ? l : j;
  }, a && (r & yf) === 0) return b;
  if (p) {
    var y = t.$$legacy;
    return (function(j, M) {
      return arguments.length > 0 ? ((!a || !M || y || x) && p(M ? b() : j), j) : b();
    });
  }
  var k = false, D = ((r & qm) !== 0 ? no : rc)(() => (k = false, b()));
  o && s(D);
  var U = _t;
  return (function(j, M) {
    if (arguments.length > 0) {
      const q = M ? s(D) : a && o ? nt(j) : j;
      return g(D, q), k = true, l !== void 0 && (l = q), j;
    }
    return _a && k || (U.f & an) !== 0 ? D.v : s(D);
  });
}
function Xt(t) {
  Kt === null && bf(), xs && Kt.l !== null ? f_(Kt).m.push(t) : Ut(() => {
    const e = yr(t);
    if (typeof e == "function") return e;
  });
}
function f_(t) {
  var e = t.l;
  return e.u ?? (e.u = { a: [], b: [], m: [] });
}
const p_ = "5";
typeof window < "u" && ((_c4 = window.__svelte ?? (window.__svelte = {})).v ?? (_c4.v = /* @__PURE__ */ new Set())).add(p_);
class fs {
  static __wrap(e) {
    e = e >>> 0;
    const r = Object.create(fs.prototype);
    return r.__wbg_ptr = e, uu.register(r, r.__wbg_ptr, r), r;
  }
  __destroy_into_raw() {
    const e = this.__wbg_ptr;
    return this.__wbg_ptr = 0, uu.unregister(this), e;
  }
  free() {
    const e = this.__destroy_into_raw();
    z.__wbg_meaicore_free(e, 0);
  }
  clearAllData() {
    return z.meaicore_clearAllData(this.__wbg_ptr);
  }
  clearAuditLog() {
    return z.meaicore_clearAuditLog(this.__wbg_ptr);
  }
  clearContacts() {
    return z.meaicore_clearContacts(this.__wbg_ptr);
  }
  clearEmailClassifications() {
    return z.meaicore_clearEmailClassifications(this.__wbg_ptr);
  }
  clearEventTypeCategory(e) {
    const r = Oe(e, z.__wbindgen_malloc, z.__wbindgen_realloc), n = Me;
    return z.meaicore_clearEventTypeCategory(this.__wbg_ptr, r, n);
  }
  clearEvents() {
    return z.meaicore_clearEvents(this.__wbg_ptr);
  }
  clearItemsSyncContacts() {
    return z.meaicore_clearItemsSyncContacts(this.__wbg_ptr);
  }
  createSchemaAndMigrations() {
    return z.meaicore_createSchemaAndMigrations(this.__wbg_ptr);
  }
  deleteEmailClassification(e) {
    const r = Oe(e, z.__wbindgen_malloc, z.__wbindgen_realloc), n = Me;
    return z.meaicore_deleteEmailClassification(this.__wbg_ptr, r, n);
  }
  deleteEmailClassificationsByAction(e) {
    const r = Oe(e, z.__wbindgen_malloc, z.__wbindgen_realloc), n = Me;
    return z.meaicore_deleteEmailClassificationsByAction(this.__wbg_ptr, r, n);
  }
  deleteEventType(e) {
    const r = Oe(e, z.__wbindgen_malloc, z.__wbindgen_realloc), n = Me;
    return z.meaicore_deleteEventType(this.__wbg_ptr, r, n);
  }
  deleteItemsByIds(e) {
    return z.meaicore_deleteItemsByIds(this.__wbg_ptr, e);
  }
  deleteItemsBySource(e) {
    const r = Oe(e, z.__wbindgen_malloc, z.__wbindgen_realloc), n = Me;
    return z.meaicore_deleteItemsBySource(this.__wbg_ptr, r, n);
  }
  deleteRule(e) {
    const r = Oe(e, z.__wbindgen_malloc, z.__wbindgen_realloc), n = Me;
    return z.meaicore_deleteRule(this.__wbg_ptr, r, n);
  }
  deleteSyncState(e) {
    const r = Oe(e, z.__wbindgen_malloc, z.__wbindgen_realloc), n = Me;
    return z.meaicore_deleteSyncState(this.__wbg_ptr, r, n);
  }
  executePipeline(e, r, n, a, o) {
    const i = Oe(n, z.__wbindgen_malloc, z.__wbindgen_realloc), l = Me;
    return z.meaicore_executePipeline(this.__wbg_ptr, e, r, i, l, pt(a) ? 0 : Zr(a), pt(o) ? 0 : Zr(o));
  }
  executePipelineBatch(e, r, n, a, o) {
    const i = Oe(n, z.__wbindgen_malloc, z.__wbindgen_realloc), l = Me;
    return z.meaicore_executePipelineBatch(this.__wbg_ptr, e, r, i, l, pt(a) ? 0 : Zr(a), pt(o) ? 0 : Zr(o));
  }
  getActions() {
    return z.meaicore_getActions(this.__wbg_ptr);
  }
  getApiModelInfo(e) {
    const r = Oe(e, z.__wbindgen_malloc, z.__wbindgen_realloc), n = Me, a = z.meaicore_getApiModelInfo(this.__wbg_ptr, r, n);
    if (a[2]) throw Hr(a[1]);
    return Hr(a[0]);
  }
  getApiModels() {
    const e = z.meaicore_getApiModels(this.__wbg_ptr);
    if (e[2]) throw Hr(e[1]);
    return Hr(e[0]);
  }
  getAuditLog(e, r, n) {
    return z.meaicore_getAuditLog(this.__wbg_ptr, e, r, n);
  }
  getAuditStats() {
    return z.meaicore_getAuditStats(this.__wbg_ptr);
  }
  getAvailableActions(e) {
    const r = Oe(e, z.__wbindgen_malloc, z.__wbindgen_realloc), n = Me, a = z.meaicore_getAvailableActions(this.__wbg_ptr, r, n);
    if (a[2]) throw Hr(a[1]);
    return Hr(a[0]);
  }
  getCategoryPipelineActions(e) {
    const r = Oe(e, z.__wbindgen_malloc, z.__wbindgen_realloc), n = Me;
    return z.meaicore_getCategoryPipelineActions(this.__wbg_ptr, r, n);
  }
  getContactByEmail(e) {
    const r = Oe(e, z.__wbindgen_malloc, z.__wbindgen_realloc), n = Me;
    return z.meaicore_getContactByEmail(this.__wbg_ptr, r, n);
  }
  getContactsCount() {
    return z.meaicore_getContactsCount(this.__wbg_ptr);
  }
  getEmailClassifications(e, r) {
    var n = pt(e) ? 0 : Oe(e, z.__wbindgen_malloc, z.__wbindgen_realloc), a = Me;
    return z.meaicore_getEmailClassifications(this.__wbg_ptr, n, a, pt(r) ? 4294967297 : r >>> 0);
  }
  getEmailClassificationsCount() {
    return z.meaicore_getEmailClassificationsCount(this.__wbg_ptr);
  }
  getEventCategories() {
    return z.meaicore_getEventCategories(this.__wbg_ptr);
  }
  getEventCategoryPolicy(e) {
    const r = Oe(e, z.__wbindgen_malloc, z.__wbindgen_realloc), n = Me;
    return z.meaicore_getEventCategoryPolicy(this.__wbg_ptr, r, n);
  }
  getEventTypeCategory(e) {
    const r = Oe(e, z.__wbindgen_malloc, z.__wbindgen_realloc), n = Me;
    return z.meaicore_getEventTypeCategory(this.__wbg_ptr, r, n);
  }
  getEventTypes() {
    return z.meaicore_getEventTypes(this.__wbg_ptr);
  }
  getEvents(e, r) {
    return z.meaicore_getEvents(this.__wbg_ptr, e, r);
  }
  getItemById(e) {
    const r = Oe(e, z.__wbindgen_malloc, z.__wbindgen_realloc), n = Me;
    return z.meaicore_getItemById(this.__wbg_ptr, r, n);
  }
  getItemsBySource(e, r, n) {
    const a = Oe(e, z.__wbindgen_malloc, z.__wbindgen_realloc), o = Me;
    return z.meaicore_getItemsBySource(this.__wbg_ptr, a, o, r, n);
  }
  getItemsCount() {
    return z.meaicore_getItemsCount(this.__wbg_ptr);
  }
  getItemsCountBySource(e) {
    const r = Oe(e, z.__wbindgen_malloc, z.__wbindgen_realloc), n = Me;
    return z.meaicore_getItemsCountBySource(this.__wbg_ptr, r, n);
  }
  getItemsCountGmail() {
    return z.meaicore_getItemsCountGmail(this.__wbg_ptr);
  }
  getItemsDateMax() {
    return z.meaicore_getItemsDateMax(this.__wbg_ptr);
  }
  getItemsDateMin() {
    return z.meaicore_getItemsDateMin(this.__wbg_ptr);
  }
  getItemsGmailByDateDesc(e) {
    return z.meaicore_getItemsGmailByDateDesc(this.__wbg_ptr, e);
  }
  getNewestSourceId(e) {
    const r = Oe(e, z.__wbindgen_malloc, z.__wbindgen_realloc), n = Me;
    return z.meaicore_getNewestSourceId(this.__wbg_ptr, r, n);
  }
  getPluginRegistry() {
    const e = z.meaicore_getPluginRegistry(this.__wbg_ptr);
    if (e[2]) throw Hr(e[1]);
    return Hr(e[0]);
  }
  getPlugins() {
    return z.meaicore_getPlugins(this.__wbg_ptr);
  }
  getPluginsForPrompt() {
    const e = z.meaicore_getPluginsForPrompt(this.__wbg_ptr);
    if (e[2]) throw Hr(e[1]);
    return Hr(e[0]);
  }
  getRequiredScopes(e, r) {
    const n = Oe(e, z.__wbindgen_malloc, z.__wbindgen_realloc), a = Me, o = Oe(r, z.__wbindgen_malloc, z.__wbindgen_realloc), i = Me, l = z.meaicore_getRequiredScopes(this.__wbg_ptr, n, a, o, i);
    if (l[2]) throw Hr(l[1]);
    return Hr(l[0]);
  }
  getRule(e) {
    const r = Oe(e, z.__wbindgen_malloc, z.__wbindgen_realloc), n = Me;
    return z.meaicore_getRule(this.__wbg_ptr, r, n);
  }
  getRules() {
    return z.meaicore_getRules(this.__wbg_ptr);
  }
  getSetting(e) {
    const r = Oe(e, z.__wbindgen_malloc, z.__wbindgen_realloc), n = Me;
    return z.meaicore_getSetting(this.__wbg_ptr, r, n);
  }
  getSources() {
    return z.meaicore_getSources(this.__wbg_ptr);
  }
  getSyncState(e) {
    const r = Oe(e, z.__wbindgen_malloc, z.__wbindgen_realloc), n = Me;
    return z.meaicore_getSyncState(this.__wbg_ptr, r, n);
  }
  getTableCount(e) {
    const r = Oe(e, z.__wbindgen_malloc, z.__wbindgen_realloc), n = Me;
    return z.meaicore_getTableCount(this.__wbg_ptr, r, n);
  }
  getTypePipelineActions(e) {
    const r = Oe(e, z.__wbindgen_malloc, z.__wbindgen_realloc), n = Me;
    return z.meaicore_getTypePipelineActions(this.__wbg_ptr, r, n);
  }
  insertContactsBatch(e) {
    return z.meaicore_insertContactsBatch(this.__wbg_ptr, e);
  }
  insertEvent(e, r, n, a, o, i, l, c, f, p, m, h) {
    const x = Oe(e, z.__wbindgen_malloc, z.__wbindgen_realloc), b = Me;
    var y = pt(r) ? 0 : Oe(r, z.__wbindgen_malloc, z.__wbindgen_realloc), k = Me, D = pt(n) ? 0 : Oe(n, z.__wbindgen_malloc, z.__wbindgen_realloc), U = Me, j = pt(a) ? 0 : Oe(a, z.__wbindgen_malloc, z.__wbindgen_realloc), M = Me, q = pt(i) ? 0 : Oe(i, z.__wbindgen_malloc, z.__wbindgen_realloc), F = Me, P = pt(l) ? 0 : Oe(l, z.__wbindgen_malloc, z.__wbindgen_realloc), C = Me, T = pt(c) ? 0 : Oe(c, z.__wbindgen_malloc, z.__wbindgen_realloc), N = Me, K = pt(f) ? 0 : Oe(f, z.__wbindgen_malloc, z.__wbindgen_realloc), W = Me, A = pt(p) ? 0 : Oe(p, z.__wbindgen_malloc, z.__wbindgen_realloc), S = Me, w = pt(m) ? 0 : Oe(m, z.__wbindgen_malloc, z.__wbindgen_realloc), R = Me, B = pt(h) ? 0 : Oe(h, z.__wbindgen_malloc, z.__wbindgen_realloc), Z = Me;
    return z.meaicore_insertEvent(this.__wbg_ptr, x, b, y, k, D, U, j, M, o, q, F, P, C, T, N, K, W, A, S, w, R, B, Z);
  }
  insertItemsBatch(e) {
    return z.meaicore_insertItemsBatch(this.__wbg_ptr, e);
  }
  insertSyncStateBatch(e) {
    return z.meaicore_insertSyncStateBatch(this.__wbg_ptr, e);
  }
  logAuditExecution(e, r, n, a, o, i, l, c, f) {
    const p = Oe(e, z.__wbindgen_malloc, z.__wbindgen_realloc), m = Me, h = Oe(r, z.__wbindgen_malloc, z.__wbindgen_realloc), x = Me, b = Oe(n, z.__wbindgen_malloc, z.__wbindgen_realloc), y = Me, k = Oe(a, z.__wbindgen_malloc, z.__wbindgen_realloc), D = Me, U = Oe(o, z.__wbindgen_malloc, z.__wbindgen_realloc), j = Me, M = Oe(c, z.__wbindgen_malloc, z.__wbindgen_realloc), q = Me, F = Oe(f, z.__wbindgen_malloc, z.__wbindgen_realloc), P = Me;
    return z.meaicore_logAuditExecution(this.__wbg_ptr, p, m, h, x, b, y, k, D, U, j, i, l, M, q, F, P);
  }
  constructor() {
    return z.meaicore_new();
  }
  putEmailClassification(e, r, n, a, o, i, l, c, f, p, m) {
    const h = Oe(e, z.__wbindgen_malloc, z.__wbindgen_realloc), x = Me;
    var b = pt(r) ? 0 : Oe(r, z.__wbindgen_malloc, z.__wbindgen_realloc), y = Me, k = pt(n) ? 0 : Oe(n, z.__wbindgen_malloc, z.__wbindgen_realloc), D = Me, U = pt(a) ? 0 : Oe(a, z.__wbindgen_malloc, z.__wbindgen_realloc), j = Me, M = pt(o) ? 0 : Oe(o, z.__wbindgen_malloc, z.__wbindgen_realloc), q = Me, F = pt(i) ? 0 : Oe(i, z.__wbindgen_malloc, z.__wbindgen_realloc), P = Me, C = pt(l) ? 0 : Oe(l, z.__wbindgen_malloc, z.__wbindgen_realloc), T = Me, N = pt(c) ? 0 : Oe(c, z.__wbindgen_malloc, z.__wbindgen_realloc), K = Me, W = pt(m) ? 0 : Oe(m, z.__wbindgen_malloc, z.__wbindgen_realloc), A = Me;
    return z.meaicore_putEmailClassification(this.__wbg_ptr, h, x, b, y, k, D, U, j, M, q, F, P, C, T, N, K, !pt(f), pt(f) ? 0 : f, !pt(p), pt(p) ? 0 : p, W, A);
  }
  removeSetting(e) {
    const r = Oe(e, z.__wbindgen_malloc, z.__wbindgen_realloc), n = Me;
    return z.meaicore_removeSetting(this.__wbg_ptr, r, n);
  }
  resolvePluginId(e) {
    let r, n;
    try {
      const a = Oe(e, z.__wbindgen_malloc, z.__wbindgen_realloc), o = Me, i = z.meaicore_resolvePluginId(this.__wbg_ptr, a, o);
      return r = i[0], n = i[1], gr(i[0], i[1]);
    } finally {
      z.__wbindgen_free(r, n, 1);
    }
  }
  saveRule(e) {
    return z.meaicore_saveRule(this.__wbg_ptr, e);
  }
  setPluginEnabled(e, r) {
    const n = Oe(e, z.__wbindgen_malloc, z.__wbindgen_realloc), a = Me;
    return z.meaicore_setPluginEnabled(this.__wbg_ptr, n, a, r);
  }
  setSetting(e, r) {
    const n = Oe(e, z.__wbindgen_malloc, z.__wbindgen_realloc), a = Me, o = Oe(r, z.__wbindgen_malloc, z.__wbindgen_realloc), i = Me;
    return z.meaicore_setSetting(this.__wbg_ptr, n, a, o, i);
  }
  setSourceEnabled(e, r) {
    const n = Oe(e, z.__wbindgen_malloc, z.__wbindgen_realloc), a = Me;
    return z.meaicore_setSourceEnabled(this.__wbg_ptr, n, a, r);
  }
  streamChat(e, r, n, a, o) {
    const i = Oe(e, z.__wbindgen_malloc, z.__wbindgen_realloc), l = Me, c = Oe(r, z.__wbindgen_malloc, z.__wbindgen_realloc), f = Me;
    return z.meaicore_streamChat(this.__wbg_ptr, i, l, c, f, n, a, o);
  }
  syncAfterAuditExecution(e, r) {
    const n = Oe(e, z.__wbindgen_malloc, z.__wbindgen_realloc), a = Me;
    return z.meaicore_syncAfterAuditExecution(this.__wbg_ptr, n, a, r);
  }
  testApiConnection(e, r) {
    const n = Oe(e, z.__wbindgen_malloc, z.__wbindgen_realloc), a = Me, o = Oe(r, z.__wbindgen_malloc, z.__wbindgen_realloc), i = Me;
    return z.meaicore_testApiConnection(this.__wbg_ptr, n, a, o, i);
  }
  updateCategoryPipeline(e, r) {
    const n = Oe(e, z.__wbindgen_malloc, z.__wbindgen_realloc), a = Me;
    return z.meaicore_updateCategoryPipeline(this.__wbg_ptr, n, a, r);
  }
  updateCategoryPolicy(e, r) {
    const n = Oe(e, z.__wbindgen_malloc, z.__wbindgen_realloc), a = Me, o = Oe(r, z.__wbindgen_malloc, z.__wbindgen_realloc), i = Me;
    return z.meaicore_updateCategoryPolicy(this.__wbg_ptr, n, a, o, i);
  }
  updateEmailClassificationStatus(e, r) {
    const n = Oe(e, z.__wbindgen_malloc, z.__wbindgen_realloc), a = Me, o = Oe(r, z.__wbindgen_malloc, z.__wbindgen_realloc), i = Me;
    return z.meaicore_updateEmailClassificationStatus(this.__wbg_ptr, n, a, o, i);
  }
  updateEventStatus(e, r) {
    const n = Oe(e, z.__wbindgen_malloc, z.__wbindgen_realloc), a = Me, o = Oe(r, z.__wbindgen_malloc, z.__wbindgen_realloc), i = Me;
    return z.meaicore_updateEventStatus(this.__wbg_ptr, n, a, o, i);
  }
  updateEventTypeCategory(e, r) {
    const n = Oe(e, z.__wbindgen_malloc, z.__wbindgen_realloc), a = Me, o = Oe(r, z.__wbindgen_malloc, z.__wbindgen_realloc), i = Me;
    return z.meaicore_updateEventTypeCategory(this.__wbg_ptr, n, a, o, i);
  }
  upsertContact(e, r, n, a) {
    const o = Oe(e, z.__wbindgen_malloc, z.__wbindgen_realloc), i = Me, l = Oe(r, z.__wbindgen_malloc, z.__wbindgen_realloc), c = Me;
    return z.meaicore_upsertContact(this.__wbg_ptr, o, i, l, c, n, a);
  }
  upsertEventType(e, r, n, a) {
    const o = Oe(e, z.__wbindgen_malloc, z.__wbindgen_realloc), i = Me, l = Oe(r, z.__wbindgen_malloc, z.__wbindgen_realloc), c = Me, f = Oe(n, z.__wbindgen_malloc, z.__wbindgen_realloc), p = Me;
    return z.meaicore_upsertEventType(this.__wbg_ptr, o, i, l, c, f, p, a);
  }
  upsertSyncState(e, r, n, a, o) {
    const i = Oe(e, z.__wbindgen_malloc, z.__wbindgen_realloc), l = Me, c = Oe(r, z.__wbindgen_malloc, z.__wbindgen_realloc), f = Me, p = Oe(o, z.__wbindgen_malloc, z.__wbindgen_realloc), m = Me;
    return z.meaicore_upsertSyncState(this.__wbg_ptr, i, l, c, f, n, a, p, m);
  }
}
Symbol.dispose && (fs.prototype[Symbol.dispose] = fs.prototype.free);
function v_() {
  return { __proto__: null, "./me_ai_core_bg.js": { __proto__: null, __wbg_Error_83742b46f01ce22d: function(e, r) {
    return Error(gr(e, r));
  }, __wbg_Number_a5a435bd7bbec835: function(e) {
    return Number(e);
  }, __wbg_String_8564e559799eccda: function(e, r) {
    const n = String(r), a = Oe(n, z.__wbindgen_malloc, z.__wbindgen_realloc), o = Me;
    jr().setInt32(e + 4, o, true), jr().setInt32(e + 0, a, true);
  }, __wbg___wbindgen_bigint_get_as_i64_447a76b5c6ef7bda: function(e, r) {
    const n = r, a = typeof n == "bigint" ? n : void 0;
    jr().setBigInt64(e + 8, pt(a) ? BigInt(0) : a, true), jr().setInt32(e + 0, !pt(a), true);
  }, __wbg___wbindgen_boolean_get_c0f3f60bac5a78d1: function(e) {
    const r = e, n = typeof r == "boolean" ? r : void 0;
    return pt(n) ? 16777215 : n ? 1 : 0;
  }, __wbg___wbindgen_debug_string_5398f5bb970e0daa: function(e, r) {
    const n = bl(r), a = Oe(n, z.__wbindgen_malloc, z.__wbindgen_realloc), o = Me;
    jr().setInt32(e + 4, o, true), jr().setInt32(e + 0, a, true);
  }, __wbg___wbindgen_in_41dbb8413020e076: function(e, r) {
    return e in r;
  }, __wbg___wbindgen_is_bigint_e2141d4f045b7eda: function(e) {
    return typeof e == "bigint";
  }, __wbg___wbindgen_is_function_3c846841762788c1: function(e) {
    return typeof e == "function";
  }, __wbg___wbindgen_is_null_0b605fc6b167c56f: function(e) {
    return e === null;
  }, __wbg___wbindgen_is_object_781bc9f159099513: function(e) {
    const r = e;
    return typeof r == "object" && r !== null;
  }, __wbg___wbindgen_is_string_7ef6b97b02428fae: function(e) {
    return typeof e == "string";
  }, __wbg___wbindgen_is_undefined_52709e72fb9f179c: function(e) {
    return e === void 0;
  }, __wbg___wbindgen_jsval_eq_ee31bfad3e536463: function(e, r) {
    return e === r;
  }, __wbg___wbindgen_jsval_loose_eq_5bcc3bed3c69e72b: function(e, r) {
    return e == r;
  }, __wbg___wbindgen_number_get_34bb9d9dcfa21373: function(e, r) {
    const n = r, a = typeof n == "number" ? n : void 0;
    jr().setFloat64(e + 8, pt(a) ? 0 : a, true), jr().setInt32(e + 0, !pt(a), true);
  }, __wbg___wbindgen_string_get_395e606bd0ee4427: function(e, r) {
    const n = r, a = typeof n == "string" ? n : void 0;
    var o = pt(a) ? 0 : Oe(a, z.__wbindgen_malloc, z.__wbindgen_realloc), i = Me;
    jr().setInt32(e + 4, i, true), jr().setInt32(e + 0, o, true);
  }, __wbg___wbindgen_throw_6ddd609b62940d55: function(e, r) {
    throw new Error(gr(e, r));
  }, __wbg__wbg_cb_unref_6b5b6b8576d35cb1: function(e) {
    e._wbg_cb_unref();
  }, __wbg_abort_5ef96933660780b7: function(e) {
    e.abort();
  }, __wbg_abort_6479c2d794ebf2ee: function(e, r) {
    e.abort(r);
  }, __wbg_advance_670851c833f4530f: function() {
    return ct(function(e, r) {
      e.advance(r >>> 0);
    }, arguments);
  }, __wbg_append_608dfb635ee8998f: function() {
    return ct(function(e, r, n, a, o) {
      e.append(gr(r, n), gr(a, o));
    }, arguments);
  }, __wbg_arrayBuffer_eb8e9ca620af2a19: function() {
    return ct(function(e) {
      return e.arrayBuffer();
    }, arguments);
  }, __wbg_call_2d781c1f4d5c0ef8: function() {
    return ct(function(e, r, n) {
      return e.call(r, n);
    }, arguments);
  }, __wbg_call_e133b57c9155d22c: function() {
    return ct(function(e, r) {
      return e.call(r);
    }, arguments);
  }, __wbg_clearTimeout_6b8d9a38b9263d65: function(e) {
    return clearTimeout(e);
  }, __wbg_clear_1885f7bf35006b0c: function() {
    return ct(function(e) {
      return e.clear();
    }, arguments);
  }, __wbg_close_cbf870bdad0aad99: function(e) {
    e.close();
  }, __wbg_continue_44abcf9ba406e87e: function() {
    return ct(function(e) {
      e.continue();
    }, arguments);
  }, __wbg_continue_ce5c8448357fe72d: function() {
    return ct(function(e, r) {
      e.continue(r);
    }, arguments);
  }, __wbg_count_788ed31b2dfcb569: function() {
    return ct(function(e, r) {
      return e.count(r);
    }, arguments);
  }, __wbg_count_8e33bb4fa72dbb75: function() {
    return ct(function(e) {
      return e.count();
    }, arguments);
  }, __wbg_count_9e4655e0ae60b3fa: function() {
    return ct(function(e) {
      return e.count();
    }, arguments);
  }, __wbg_count_c6fb7d5ecbe69368: function() {
    return ct(function(e, r) {
      return e.count(r);
    }, arguments);
  }, __wbg_createIndex_323cb0213cc21d9b: function() {
    return ct(function(e, r, n, a, o) {
      return e.createIndex(gr(r, n), a, o);
    }, arguments);
  }, __wbg_createIndex_38ef2e77937beaca: function() {
    return ct(function(e, r, n, a) {
      return e.createIndex(gr(r, n), a);
    }, arguments);
  }, __wbg_createObjectStore_4709de9339ffc6c0: function() {
    return ct(function(e, r, n, a) {
      return e.createObjectStore(gr(r, n), a);
    }, arguments);
  }, __wbg_deleteIndex_9391b8bace7b0b18: function() {
    return ct(function(e, r, n) {
      e.deleteIndex(gr(r, n));
    }, arguments);
  }, __wbg_deleteObjectStore_65401ab024ac08c1: function() {
    return ct(function(e, r, n) {
      e.deleteObjectStore(gr(r, n));
    }, arguments);
  }, __wbg_delete_40db93c05c546fb9: function() {
    return ct(function(e, r) {
      return e.delete(r);
    }, arguments);
  }, __wbg_done_08ce71ee07e3bd17: function(e) {
    return e.done;
  }, __wbg_entries_e8a20ff8c9757101: function(e) {
    return Object.entries(e);
  }, __wbg_error_57ef6dadfcb01843: function(e) {
    const r = e.error;
    return pt(r) ? 0 : Zr(r);
  }, __wbg_error_74898554122344a8: function() {
    return ct(function(e) {
      const r = e.error;
      return pt(r) ? 0 : Zr(r);
    }, arguments);
  }, __wbg_fetch_5550a88cf343aaa9: function(e, r) {
    return e.fetch(r);
  }, __wbg_fetch_9dad4fe911207b37: function(e) {
    return fetch(e);
  }, __wbg_getAll_1c496368e98193a6: function() {
    return ct(function(e, r, n) {
      return e.getAll(r, n >>> 0);
    }, arguments);
  }, __wbg_getAll_5ed401da69904dee: function() {
    return ct(function(e) {
      return e.getAll();
    }, arguments);
  }, __wbg_getAll_690f659b57ae2d51: function() {
    return ct(function(e) {
      return e.getAll();
    }, arguments);
  }, __wbg_getAll_a959860fbb7a424a: function() {
    return ct(function(e, r) {
      return e.getAll(r);
    }, arguments);
  }, __wbg_getAll_abff748aa6f1c273: function() {
    return ct(function(e, r) {
      return e.getAll(r);
    }, arguments);
  }, __wbg_getAll_b4181cf52224a271: function() {
    return ct(function(e, r, n) {
      return e.getAll(r, n >>> 0);
    }, arguments);
  }, __wbg_get_326e41e095fb2575: function() {
    return ct(function(e, r) {
      return Reflect.get(e, r);
    }, arguments);
  }, __wbg_get_3ef1eba1850ade27: function() {
    return ct(function(e, r) {
      return Reflect.get(e, r);
    }, arguments);
  }, __wbg_get_6ac8c8119f577720: function() {
    return ct(function(e, r) {
      return e.get(r);
    }, arguments);
  }, __wbg_get_7873e3afa59bad00: function(e, r, n) {
    const a = r[n >>> 0];
    var o = pt(a) ? 0 : Oe(a, z.__wbindgen_malloc, z.__wbindgen_realloc), i = Me;
    jr().setInt32(e + 4, i, true), jr().setInt32(e + 0, o, true);
  }, __wbg_get_a8ee5c45dabc1b3b: function(e, r) {
    return e[r >>> 0];
  }, __wbg_get_unchecked_329cfe50afab7352: function(e, r) {
    return e[r >>> 0];
  }, __wbg_get_with_ref_key_6412cf3094599694: function(e, r) {
    return e[r];
  }, __wbg_has_926ef2ff40b308cf: function() {
    return ct(function(e, r) {
      return Reflect.has(e, r);
    }, arguments);
  }, __wbg_headers_eb2234545f9ff993: function(e) {
    return e.headers;
  }, __wbg_indexNames_3a9be68017fb9405: function(e) {
    return e.indexNames;
  }, __wbg_index_f1b3b30c5d5af6fb: function() {
    return ct(function(e, r, n) {
      return e.index(gr(r, n));
    }, arguments);
  }, __wbg_instanceof_ArrayBuffer_101e2bf31071a9f6: function(e) {
    let r;
    try {
      r = e instanceof ArrayBuffer;
    } catch {
      r = false;
    }
    return r;
  }, __wbg_instanceof_IdbCursorWithValue_77f7f7b68bcfb704: function(e) {
    let r;
    try {
      r = e instanceof IDBCursorWithValue;
    } catch {
      r = false;
    }
    return r;
  }, __wbg_instanceof_IdbDatabase_5f436cc89cc07f14: function(e) {
    let r;
    try {
      r = e instanceof IDBDatabase;
    } catch {
      r = false;
    }
    return r;
  }, __wbg_instanceof_IdbFactory_efcffbfd9020e4ac: function(e) {
    let r;
    try {
      r = e instanceof IDBFactory;
    } catch {
      r = false;
    }
    return r;
  }, __wbg_instanceof_IdbOpenDbRequest_10c2576001eb6613: function(e) {
    let r;
    try {
      r = e instanceof IDBOpenDBRequest;
    } catch {
      r = false;
    }
    return r;
  }, __wbg_instanceof_IdbRequest_6a0e24572d4f1d46: function(e) {
    let r;
    try {
      r = e instanceof IDBRequest;
    } catch {
      r = false;
    }
    return r;
  }, __wbg_instanceof_IdbTransaction_125db5cfd1c1bfd2: function(e) {
    let r;
    try {
      r = e instanceof IDBTransaction;
    } catch {
      r = false;
    }
    return r;
  }, __wbg_instanceof_Map_f194b366846aca0c: function(e) {
    let r;
    try {
      r = e instanceof Map;
    } catch {
      r = false;
    }
    return r;
  }, __wbg_instanceof_Response_9b4d9fd451e051b1: function(e) {
    let r;
    try {
      r = e instanceof Response;
    } catch {
      r = false;
    }
    return r;
  }, __wbg_instanceof_Uint8Array_740438561a5b956d: function(e) {
    let r;
    try {
      r = e instanceof Uint8Array;
    } catch {
      r = false;
    }
    return r;
  }, __wbg_isArray_33b91feb269ff46e: function(e) {
    return Array.isArray(e);
  }, __wbg_isSafeInteger_ecd6a7f9c3e053cd: function(e) {
    return Number.isSafeInteger(e);
  }, __wbg_iterator_d8f549ec8fb061b1: function() {
    return Symbol.iterator;
  }, __wbg_keyPath_f17010debffed49a: function() {
    return ct(function(e) {
      return e.keyPath;
    }, arguments);
  }, __wbg_key_581f2698de7f8240: function() {
    return ct(function(e) {
      return e.key;
    }, arguments);
  }, __wbg_length_02c4f6002306a824: function(e) {
    return e.length;
  }, __wbg_length_b3416cf66a5452c8: function(e) {
    return e.length;
  }, __wbg_length_ea16607d7b61445b: function(e) {
    return e.length;
  }, __wbg_meaicore_new: function(e) {
    return fs.__wrap(e);
  }, __wbg_multiEntry_fd907a11ddf44df1: function(e) {
    return e.multiEntry;
  }, __wbg_new_0837727332ac86ba: function() {
    return ct(function() {
      return new Headers();
    }, arguments);
  }, __wbg_new_49d5571bd3f0c4d4: function() {
    return /* @__PURE__ */ new Map();
  }, __wbg_new_5f486cdf45a04d78: function(e) {
    return new Uint8Array(e);
  }, __wbg_new_a70fbab9066b301f: function() {
    return new Array();
  }, __wbg_new_ab79df5bd7c26067: function() {
    return new Object();
  }, __wbg_new_c518c60af666645b: function() {
    return ct(function() {
      return new AbortController();
    }, arguments);
  }, __wbg_new_from_slice_22da9388ac046e50: function(e, r) {
    return new Uint8Array(pu(e, r));
  }, __wbg_new_no_args_d15c5c26a5dbe2e7: function(e, r) {
    return new Function(gr(e, r));
  }, __wbg_new_typed_aaaeaf29cf802876: function(e, r) {
    try {
      var n = { a: e, b: r }, a = (i, l) => {
        const c = n.a;
        n.a = 0;
        try {
          return b_(c, n.b, i, l);
        } finally {
          n.a = c;
        }
      };
      return new Promise(a);
    } finally {
      n.a = n.b = 0;
    }
  }, __wbg_new_typed_bccac67128ed885a: function() {
    return new Array();
  }, __wbg_new_with_str_and_init_b4b54d1a819bc724: function() {
    return ct(function(e, r, n) {
      return new Request(gr(e, r), n);
    }, arguments);
  }, __wbg_next_11b99ee6237339e3: function() {
    return ct(function(e) {
      return e.next();
    }, arguments);
  }, __wbg_next_e01a967809d1aa68: function(e) {
    return e.next;
  }, __wbg_objectStoreNames_564985d2e9ae7523: function(e) {
    return e.objectStoreNames;
  }, __wbg_objectStore_f314ab152a5c7bd0: function() {
    return ct(function(e, r, n) {
      return e.objectStore(gr(r, n));
    }, arguments);
  }, __wbg_only_71ec27fd794d4b29: function() {
    return ct(function(e) {
      return IDBKeyRange.only(e);
    }, arguments);
  }, __wbg_openCursor_600cc3399e227945: function() {
    return ct(function(e, r, n) {
      return e.openCursor(r, x_[n]);
    }, arguments);
  }, __wbg_openCursor_e845b9a1bdca92b8: function() {
    return ct(function(e) {
      return e.openCursor();
    }, arguments);
  }, __wbg_openCursor_e8f8c35163e2eca2: function() {
    return ct(function(e, r) {
      return e.openCursor(r);
    }, arguments);
  }, __wbg_open_e7a9d3d6344572f6: function() {
    return ct(function(e, r, n, a) {
      return e.open(gr(r, n), a >>> 0);
    }, arguments);
  }, __wbg_open_f3dc09caa3990bc4: function() {
    return ct(function(e, r, n) {
      return e.open(gr(r, n));
    }, arguments);
  }, __wbg_prototypesetcall_d62e5099504357e6: function(e, r, n) {
    Uint8Array.prototype.set.call(pu(e, r), n);
  }, __wbg_push_e87b0e732085a946: function(e, r) {
    return e.push(r);
  }, __wbg_put_ae369598c083f1f5: function() {
    return ct(function(e, r) {
      return e.put(r);
    }, arguments);
  }, __wbg_put_f1673d719f93ce22: function() {
    return ct(function(e, r, n) {
      return e.put(r, n);
    }, arguments);
  }, __wbg_queueMicrotask_0c399741342fb10f: function(e) {
    return e.queueMicrotask;
  }, __wbg_queueMicrotask_a082d78ce798393e: function(e) {
    queueMicrotask(e);
  }, __wbg_request_2be8be207f60d46c: function(e) {
    return e.request;
  }, __wbg_resolve_ae8d83246e5bcc12: function(e) {
    return Promise.resolve(e);
  }, __wbg_result_c5baa2d3d690a01a: function() {
    return ct(function(e) {
      return e.result;
    }, arguments);
  }, __wbg_setTimeout_f757f00851f76c42: function(e, r) {
    return setTimeout(e, r);
  }, __wbg_set_282384002438957f: function(e, r, n) {
    e[r >>> 0] = n;
  }, __wbg_set_6be42768c690e380: function(e, r, n) {
    e[r] = n;
  }, __wbg_set_auto_increment_ffc3cd6470763a4c: function(e, r) {
    e.autoIncrement = r !== 0;
  }, __wbg_set_bf7251625df30a02: function(e, r, n) {
    return e.set(r, n);
  }, __wbg_set_body_a3d856b097dfda04: function(e, r) {
    e.body = r;
  }, __wbg_set_cache_ec7e430c6056ebda: function(e, r) {
    e.cache = w_[r];
  }, __wbg_set_credentials_ed63183445882c65: function(e, r) {
    e.credentials = k_[r];
  }, __wbg_set_headers_3c8fecc693b75327: function(e, r) {
    e.headers = r;
  }, __wbg_set_key_path_3c45a8ff0b89e678: function(e, r) {
    e.keyPath = r;
  }, __wbg_set_method_8c015e8bcafd7be1: function(e, r, n) {
    e.method = gr(r, n);
  }, __wbg_set_mode_5a87f2c809cf37c2: function(e, r) {
    e.mode = S_[r];
  }, __wbg_set_multi_entry_38c253febe05d3be: function(e, r) {
    e.multiEntry = r !== 0;
  }, __wbg_set_name_02d633afec2e2bf0: function(e, r, n) {
    e.name = gr(r, n);
  }, __wbg_set_onabort_63885d8d7841a8d5: function(e, r) {
    e.onabort = r;
  }, __wbg_set_oncomplete_f31e6dc6d16c1ff8: function(e, r) {
    e.oncomplete = r;
  }, __wbg_set_onerror_8a268cb237177bba: function(e, r) {
    e.onerror = r;
  }, __wbg_set_onerror_c1ecd6233c533c08: function(e, r) {
    e.onerror = r;
  }, __wbg_set_onsuccess_fca94ded107b64af: function(e, r) {
    e.onsuccess = r;
  }, __wbg_set_onupgradeneeded_860ce42184f987e7: function(e, r) {
    e.onupgradeneeded = r;
  }, __wbg_set_onversionchange_3d88930f82c97b92: function(e, r) {
    e.onversionchange = r;
  }, __wbg_set_signal_0cebecb698f25d21: function(e, r) {
    e.signal = r;
  }, __wbg_set_unique_a39d85db47f8e025: function(e, r) {
    e.unique = r !== 0;
  }, __wbg_signal_166e1da31adcac18: function(e) {
    return e.signal;
  }, __wbg_static_accessor_GLOBAL_8adb955bd33fac2f: function() {
    const e = typeof global > "u" ? null : global;
    return pt(e) ? 0 : Zr(e);
  }, __wbg_static_accessor_GLOBAL_THIS_ad356e0db91c7913: function() {
    const e = typeof globalThis > "u" ? null : globalThis;
    return pt(e) ? 0 : Zr(e);
  }, __wbg_static_accessor_SELF_f207c857566db248: function() {
    const e = typeof self > "u" ? null : self;
    return pt(e) ? 0 : Zr(e);
  }, __wbg_static_accessor_WINDOW_bb9f1ba69d61b386: function() {
    const e = typeof window > "u" ? null : window;
    return pt(e) ? 0 : Zr(e);
  }, __wbg_status_318629ab93a22955: function(e) {
    return e.status;
  }, __wbg_stringify_5ae93966a84901ac: function() {
    return ct(function(e) {
      return JSON.stringify(e);
    }, arguments);
  }, __wbg_target_7bc90f314634b37b: function(e) {
    const r = e.target;
    return pt(r) ? 0 : Zr(r);
  }, __wbg_then_098abe61755d12f6: function(e, r) {
    return e.then(r);
  }, __wbg_then_9e335f6dd892bc11: function(e, r, n) {
    return e.then(r, n);
  }, __wbg_toString_3272fa0dfd05dd87: function(e) {
    return e.toString();
  }, __wbg_transaction_3223f7c8d0f40129: function() {
    return ct(function(e, r, n) {
      return e.transaction(r, y_[n]);
    }, arguments);
  }, __wbg_transaction_fda57653957fee06: function(e) {
    const r = e.transaction;
    return pt(r) ? 0 : Zr(r);
  }, __wbg_unique_3329c63c37e586a7: function(e) {
    return e.unique;
  }, __wbg_url_7fefc1820fba4e0c: function(e, r) {
    const n = r.url, a = Oe(n, z.__wbindgen_malloc, z.__wbindgen_realloc), o = Me;
    jr().setInt32(e + 4, o, true), jr().setInt32(e + 0, a, true);
  }, __wbg_value_21fc78aab0322612: function(e) {
    return e.value;
  }, __wbg_value_79629bd10d556879: function() {
    return ct(function(e) {
      return e.value;
    }, arguments);
  }, __wbindgen_cast_0000000000000001: function(e, r) {
    return Ao(e, r, z.wasm_bindgen__closure__destroy__heedac0890341c2a7, m_);
  }, __wbindgen_cast_0000000000000002: function(e, r) {
    return Ao(e, r, z.wasm_bindgen__closure__destroy__h67a8c841ac8fc7de, g_);
  }, __wbindgen_cast_0000000000000003: function(e, r) {
    return Ao(e, r, z.wasm_bindgen__closure__destroy__h8069e08c8e9d16c4, __);
  }, __wbindgen_cast_0000000000000004: function(e, r) {
    return Ao(e, r, z.wasm_bindgen__closure__destroy__h977d29423189e3cf, h_);
  }, __wbindgen_cast_0000000000000005: function(e) {
    return e;
  }, __wbindgen_cast_0000000000000006: function(e) {
    return e;
  }, __wbindgen_cast_0000000000000007: function(e, r) {
    return gr(e, r);
  }, __wbindgen_cast_0000000000000008: function(e) {
    return BigInt.asUintN(64, e);
  }, __wbindgen_init_externref_table: function() {
    const e = z.__wbindgen_externrefs, r = e.grow(4);
    e.set(0, void 0), e.set(r + 0, void 0), e.set(r + 1, null), e.set(r + 2, true), e.set(r + 3, false);
  } } };
}
function g_(t, e) {
  z.wasm_bindgen__convert__closures_____invoke__h29b15ff5f8a3bf3a(t, e);
}
function m_(t, e, r) {
  z.wasm_bindgen__convert__closures_____invoke__hf812eb332429c660(t, e, r);
}
function h_(t, e, r) {
  z.wasm_bindgen__convert__closures_____invoke__hab718df87d55d7a8(t, e, r);
}
function __(t, e, r) {
  const n = z.wasm_bindgen__convert__closures_____invoke__h0d4dd8ab4895cb88(t, e, r);
  if (n[1]) throw Hr(n[0]);
}
function b_(t, e, r, n) {
  z.wasm_bindgen__convert__closures_____invoke__h449f825a019ba2b1(t, e, r, n);
}
const x_ = ["next", "nextunique", "prev", "prevunique"], y_ = ["readonly", "readwrite", "versionchange", "readwriteflush", "cleanup"], w_ = ["default", "no-store", "reload", "no-cache", "force-cache", "only-if-cached"], k_ = ["omit", "same-origin", "include"], S_ = ["same-origin", "no-cors", "cors", "navigate"], uu = typeof FinalizationRegistry > "u" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((t) => z.__wbg_meaicore_free(t >>> 0, 1));
function Zr(t) {
  const e = z.__externref_table_alloc();
  return z.__wbindgen_externrefs.set(e, t), e;
}
const fu = typeof FinalizationRegistry > "u" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((t) => t.dtor(t.a, t.b));
function bl(t) {
  const e = typeof t;
  if (e == "number" || e == "boolean" || t == null) return `${t}`;
  if (e == "string") return `"${t}"`;
  if (e == "symbol") {
    const a = t.description;
    return a == null ? "Symbol" : `Symbol(${a})`;
  }
  if (e == "function") {
    const a = t.name;
    return typeof a == "string" && a.length > 0 ? `Function(${a})` : "Function";
  }
  if (Array.isArray(t)) {
    const a = t.length;
    let o = "[";
    a > 0 && (o += bl(t[0]));
    for (let i = 1; i < a; i++) o += ", " + bl(t[i]);
    return o += "]", o;
  }
  const r = /\[object ([^\]]+)\]/.exec(toString.call(t));
  let n;
  if (r && r.length > 1) n = r[1];
  else return toString.call(t);
  if (n == "Object") try {
    return "Object(" + JSON.stringify(t) + ")";
  } catch {
    return "Object";
  }
  return t instanceof Error ? `${t.name}: ${t.message}
${t.stack}` : n;
}
function pu(t, e) {
  return t = t >>> 0, Hs().subarray(t / 1, t / 1 + e);
}
let Ea = null;
function jr() {
  return (Ea === null || Ea.buffer.detached === true || Ea.buffer.detached === void 0 && Ea.buffer !== z.memory.buffer) && (Ea = new DataView(z.memory.buffer)), Ea;
}
function gr(t, e) {
  return t = t >>> 0, A_(t, e);
}
let Bs = null;
function Hs() {
  return (Bs === null || Bs.byteLength === 0) && (Bs = new Uint8Array(z.memory.buffer)), Bs;
}
function ct(t, e) {
  try {
    return t.apply(this, e);
  } catch (r) {
    const n = Zr(r);
    z.__wbindgen_exn_store(n);
  }
}
function pt(t) {
  return t == null;
}
function Ao(t, e, r, n) {
  const a = { a: t, b: e, cnt: 1, dtor: r }, o = (...i) => {
    a.cnt++;
    const l = a.a;
    a.a = 0;
    try {
      return n(l, a.b, ...i);
    } finally {
      a.a = l, o._wbg_cb_unref();
    }
  };
  return o._wbg_cb_unref = () => {
    --a.cnt === 0 && (a.dtor(a.a, a.b), a.a = 0, fu.unregister(a));
  }, fu.register(o, a, a), o;
}
function Oe(t, e, r) {
  if (r === void 0) {
    const l = qs.encode(t), c = e(l.length, 1) >>> 0;
    return Hs().subarray(c, c + l.length).set(l), Me = l.length, c;
  }
  let n = t.length, a = e(n, 1) >>> 0;
  const o = Hs();
  let i = 0;
  for (; i < n; i++) {
    const l = t.charCodeAt(i);
    if (l > 127) break;
    o[a + i] = l;
  }
  if (i !== n) {
    i !== 0 && (t = t.slice(i)), a = r(a, n, n = i + t.length * 3, 1) >>> 0;
    const l = Hs().subarray(a + i, a + n), c = qs.encodeInto(t, l);
    i += c.written, a = r(a, n, i, 1) >>> 0;
  }
  return Me = i, a;
}
function Hr(t) {
  const e = z.__wbindgen_externrefs.get(t);
  return z.__externref_table_dealloc(t), e;
}
let jo = new TextDecoder("utf-8", { ignoreBOM: true, fatal: true });
jo.decode();
const T_ = 2146435072;
let Ki = 0;
function A_(t, e) {
  return Ki += e, Ki >= T_ && (jo = new TextDecoder("utf-8", { ignoreBOM: true, fatal: true }), jo.decode(), Ki = e), jo.decode(Hs().subarray(t, t + e));
}
const qs = new TextEncoder();
"encodeInto" in qs || (qs.encodeInto = function(t, e) {
  const r = qs.encode(t);
  return e.set(r), { read: t.length, written: r.length };
});
let Me = 0, z;
function E_(t, e) {
  return z = t.exports, Ea = null, Bs = null, z.__wbindgen_start(), z;
}
async function C_(t, e) {
  if (typeof Response == "function" && t instanceof Response) {
    if (typeof WebAssembly.instantiateStreaming == "function") try {
      return await WebAssembly.instantiateStreaming(t, e);
    } catch (a) {
      if (t.ok && r(t.type) && t.headers.get("Content-Type") !== "application/wasm") console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", a);
      else throw a;
    }
    const n = await t.arrayBuffer();
    return await WebAssembly.instantiate(n, e);
  } else {
    const n = await WebAssembly.instantiate(t, e);
    return n instanceof WebAssembly.Instance ? { instance: n, module: t } : n;
  }
  function r(n) {
    switch (n) {
      case "basic":
      case "cors":
      case "default":
        return true;
    }
    return false;
  }
}
async function I_(t) {
  if (z !== void 0) return z;
  t !== void 0 && (Object.getPrototypeOf(t) === Object.prototype ? { module_or_path: t } = t : console.warn("using deprecated parameters for the initialization function; pass a single object instead")), t === void 0 && (t = new URL("/me-ai/assets/me_ai_core_bg-QgTKKK9Y.wasm", import.meta.url));
  const e = v_();
  (typeof t == "string" || typeof Request == "function" && t instanceof Request || typeof URL == "function" && t instanceof URL) && (t = fetch(t));
  const { instance: r, module: n } = await C_(await t, e);
  return E_(r);
}
const Vo = ch({ core: null, initFailed: false });
function P_() {
  const t = Rf(Vo);
  if (!t.core) throw t.initFailed ? new Error("Core init failed previously.") : new Error("Core not initialized. Call initCore() first.");
  return t.core;
}
function $_() {
  return Rf(Vo).initFailed;
}
async function bp() {
  try {
    await I_({ module_or_path: "/me-ai/wasm/me_ai_core_bg.wasm" });
    const r = await new fs();
    await r.createSchemaAndMigrations(), Vo.set({ core: r, initFailed: false });
  } catch (t) {
    throw Vo.set({ core: null, initFailed: true }), t;
  }
}
function We() {
  return P_();
}
async function xp() {
  return We().getEventTypes();
}
async function xi() {
  return We().getEventCategories();
}
async function yp() {
  return We().getSources();
}
async function N_() {
  return We().getActions();
}
async function ws() {
  return We().getItemsCountGmail();
}
async function yi() {
  return We().getContactsCount();
}
async function wp() {
  return We().getItemsDateMin();
}
async function kp() {
  return We().getItemsDateMax();
}
async function wi() {
  return We().getEmailClassificationsCount();
}
async function vc(t) {
  return We().getSetting(t);
}
async function Sp(t, e) {
  return We().setSetting(t, e);
}
async function Tp(t) {
  return We().removeSetting(t);
}
async function Ap(t) {
  return We().getTableCount(t);
}
async function gc() {
  return We().clearAllData();
}
async function Ep(t, e, r) {
  return We().getAuditLog(t, e, r);
}
async function Cp() {
  return We().getAuditStats();
}
async function Ip() {
  return We().clearAuditLog();
}
async function Pp(t, e, r, n, a, o, i, l, c) {
  return We().logAuditExecution(t, e, r, n, a, o, i, l, c);
}
async function $p(t, e) {
  return We().syncAfterAuditExecution(t, e);
}
async function mc(t) {
  return We().getCategoryPipelineActions(t);
}
async function Np(t) {
  return We().getTypePipelineActions(t);
}
async function Rp(t) {
  return We().getEventTypeCategory(t);
}
async function Mp(t) {
  return We().getEventCategoryPolicy(t);
}
async function zp(t, e) {
  return We().updateCategoryPipeline(t, e);
}
async function Op(t, e) {
  return We().updateCategoryPolicy(t, e);
}
async function Dp(t, e) {
  return We().updateEventTypeCategory(t, e);
}
async function Lp(t) {
  return We().clearEventTypeCategory(t);
}
async function jp(t) {
  return We().deleteEventType(t);
}
async function R_(t, e) {
  return We().setSourceEnabled(t, e);
}
async function Bp(t, e) {
  return We().setPluginEnabled(t, e);
}
async function M_(t, e, r, n) {
  return We().upsertEventType(t, e, r, n);
}
async function hc(t) {
  return We().deleteSyncState(t);
}
async function Fp(t) {
  return We().deleteItemsBySource(t);
}
async function Up() {
  return We().clearContacts();
}
async function z_() {
  return We().clearItemsSyncContacts();
}
async function _c(t) {
  return We().getItemsCountBySource(t);
}
async function bc(t) {
  return We().getSyncState(t);
}
async function Qs(t, e, r, n, a) {
  return We().upsertSyncState(t, e, r, n, a);
}
async function xc(t) {
  return We().insertItemsBatch(t);
}
async function O_(t) {
  return We().insertSyncStateBatch(t);
}
async function D_(t) {
  return We().insertContactsBatch(t);
}
async function Gp(t) {
  return We().deleteItemsByIds(t);
}
async function Wp(t) {
  return We().getContactByEmail(t);
}
async function xl(t, e, r, n) {
  return We().upsertContact(t, e, r, n);
}
async function Vp(t) {
  return We().getNewestSourceId(t);
}
async function Hp() {
  return We().getPlugins();
}
function qp() {
  return We().getPluginRegistry();
}
function Yp(t) {
  return We().getAvailableActions(t);
}
function L_(t, e) {
  return We().getRequiredScopes(t, e);
}
function j_(t) {
  return We().resolvePluginId(t);
}
function Kp() {
  return We().getPluginsForPrompt();
}
async function Xp(t, e, r, n, a) {
  return We().executePipeline(t, e, r, n, a);
}
async function B_(t, e, r, n, a) {
  return We().executePipelineBatch(t, e, r, n, a);
}
async function Zp() {
  return We().getRules();
}
async function Jp(t) {
  return We().getRule(t);
}
async function Qp(t) {
  return We().saveRule(t);
}
async function F_(t) {
  return We().deleteRule(t);
}
async function U_(t, e) {
  return We().getEvents(t, e);
}
async function G_(t, e) {
  return We().updateEventStatus(t, e);
}
async function W_() {
  return We().clearEvents();
}
async function V_(t, e, r, n, a, o, i, l, c, f, p, m) {
  return We().insertEvent(t, e ?? void 0, r ?? void 0, n ?? void 0, a ?? 0, o ?? void 0, i ?? void 0, l ?? void 0, c ?? void 0, f ?? void 0, p ?? void 0, m ?? void 0);
}
async function io(t) {
  return We().getItemById(t);
}
async function ps(t) {
  return We().getItemsGmailByDateDesc(t);
}
async function ev(t, e, r) {
  return We().getItemsBySource(t, e, r);
}
async function ta(t, e) {
  return We().getEmailClassifications(t ?? void 0, e ?? void 0);
}
async function yc(t, e) {
  return We().updateEmailClassificationStatus(t, e);
}
async function tv() {
  return We().clearEmailClassifications();
}
async function rv(t) {
  return We().deleteEmailClassification(t);
}
async function nv(t) {
  return We().deleteEmailClassificationsByAction(t);
}
async function av(t, e, r, n, a, o, i, l, c, f, p) {
  return We().putEmailClassification(t, e ?? void 0, r ?? void 0, n ?? void 0, a ?? void 0, o ?? void 0, i ?? void 0, l ?? void 0, c ?? void 0, f ?? void 0, p ?? void 0);
}
async function sv() {
  const t = {};
  for (const n of ["sm_rules", "sm_rule_triggers", "sm_rule_commands", "sm_events", "items", "emailClassifications", "contacts", "settings"]) try {
    t[n] = Number(await Ap(n)) ?? 0;
  } catch {
    t[n] = 0;
  }
  let e = 0;
  const r = typeof navigator < "u" && "storage" in navigator && "estimate" in navigator.storage;
  if (r) try {
    e = (await navigator.storage.estimate()).usage ?? 0;
  } catch {
  }
  return { supported: r, usageBytes: e, tables: t };
}
async function ov() {
  await gc();
}
function iv() {
  return We().getApiModels();
}
function Ho(t) {
  return We().getApiModelInfo(t);
}
async function lv(t, e) {
  return We().testApiConnection(t, e);
}
async function cv(t, e, r, n, a) {
  return We().streamChat(t, e, r, n, a);
}
const dv = Object.freeze(Object.defineProperty({ __proto__: null, clearAllData: gc, clearAllDataAndCheckpoint: ov, clearAuditLog: Ip, clearContacts: Up, clearEmailClassifications: tv, clearEventTypeCategory: Lp, clearEvents: W_, clearItemsSyncContacts: z_, deleteEmailClassification: rv, deleteEmailClassificationsByAction: nv, deleteEventType: jp, deleteItemsByIds: Gp, deleteItemsBySource: Fp, deleteRule: F_, deleteSyncState: hc, executePipeline: Xp, executePipelineBatch: B_, getActions: N_, getApiModelInfo: Ho, getApiModels: iv, getAuditLog: Ep, getAuditStats: Cp, getAvailableActions: Yp, getCategoryPipelineActions: mc, getContactByEmail: Wp, getContactsCount: yi, getEmailClassifications: ta, getEmailClassificationsCount: wi, getEventCategories: xi, getEventCategoryPolicy: Mp, getEventTypeCategory: Rp, getEventTypes: xp, getEvents: U_, getItemById: io, getItemsBySource: ev, getItemsCountBySource: _c, getItemsCountGmail: ws, getItemsDateMax: kp, getItemsDateMin: wp, getItemsGmailByDateDesc: ps, getNewestSourceId: Vp, getPluginRegistry: qp, getPlugins: Hp, getPluginsForPrompt: Kp, getRequiredScopes: L_, getRule: Jp, getRules: Zp, getSetting: vc, getSources: yp, getStorageStats: sv, getSyncState: bc, getTableCount: Ap, getTypePipelineActions: Np, initCore: bp, insertContactsBatch: D_, insertEvent: V_, insertItemsBatch: xc, insertSyncStateBatch: O_, isCoreInitFailed: $_, logAuditExecution: Pp, putEmailClassification: av, removeSetting: Tp, resolvePluginId: j_, saveRule: Qp, setPluginEnabled: Bp, setSetting: Sp, setSourceEnabled: R_, streamChat: cv, syncAfterAuditExecution: $p, testApiConnection: lv, updateCategoryPipeline: zp, updateCategoryPolicy: Op, updateEmailClassificationStatus: yc, updateEventStatus: G_, updateEventTypeCategory: Dp, upsertContact: xl, upsertEventType: M_, upsertSyncState: Qs }, Symbol.toStringTag, { value: "Module" }));
async function uv() {
  await gc(), typeof window < "u" && window.location.reload();
}
async function H_() {
  var _a10;
  try {
    const t = await ((_a10 = indexedDB.databases) == null ? void 0 : _a10.call(indexedDB)) ?? [];
    for (const { name: e } of t) e && await new Promise((r) => {
      const n = indexedDB.deleteDatabase(e);
      n.onsuccess = () => r(), n.onerror = () => r(), n.onblocked = () => r(), setTimeout(r, 3e3);
    });
  } catch (t) {
    console.warn("[db] nukeAllLocalData: IDB sweep failed:", t == null ? void 0 : t.message);
  }
  try {
    if ("caches" in globalThis) {
      const t = await caches.keys();
      await Promise.allSettled(t.map((e) => caches.delete(e)));
    }
  } catch (t) {
    console.warn("[db] nukeAllLocalData: Cache API failed:", t == null ? void 0 : t.message);
  }
  try {
    localStorage.clear(), sessionStorage.clear();
  } catch {
  }
  typeof window < "u" && window.location.reload();
}
function fv(t, e) {
  return `${t}:${e}`;
}
function eo(t) {
  return JSON.stringify(t ?? null);
}
function Qn(t, e) {
  if (t == null) return e;
  try {
    return JSON.parse(t);
  } catch {
    return e;
  }
}
async function pv() {
  const t = await yp();
  return Array.isArray(t) ? t : [];
}
async function vv() {
  const t = await Hp();
  return Array.isArray(t) ? t : [];
}
async function gv() {
  return (await Zp() ?? []).map((e) => ({ ...e, enabled: !!e.enabled, triggers: e.triggers ?? [], actions: e.actions ?? [] }));
}
async function mv(t) {
  const e = await Jp(t);
  if (e == null || e === void 0) return null;
  const r = e;
  return { id: r.id, name: r.name, description: r.description ?? "", enabled: !!r.enabled, priority: r.priority ?? 5, created_at: r.created_at, triggers: r.triggers ?? [], actions: r.actions ?? [] };
}
async function hv(t, e) {
  const r = await mv(t);
  if (!r) return;
  const n = { ...r, ...e, triggers: e.triggers ?? r.triggers, actions: e.actions ?? r.actions }, a = { id: t, name: n.name, description: n.description ?? "", enabled: n.enabled, priority: n.priority ?? 5, created_at: n.created_at, triggers: n.triggers.map((o) => ({ type: o.type, name: o.name })), actions: n.actions.map((o) => ({ id: o.id, pluginId: o.pluginId, commandId: o.commandId, name: o.name, description: o.description, icon: o.icon ?? null })) };
  await Qp(a);
}
async function ki() {
  const [t, e, r] = await Promise.all([ta(), xi(), Cp()]), n = t ?? [], a = e ?? [], o = new Set(a.filter((p) => String(p.policy ?? "").toLowerCase() === "manual").map((p) => String(p.name ?? "").toLowerCase()));
  let i = 0, l = 0;
  for (const p of n) {
    const m = String(p.status ?? ""), h = String(p.category ?? "").toLowerCase();
    m === "pending" && o.has(h) ? i += 1 : m === "escalated" && (l += 1);
  }
  const c = Number((r == null ? void 0 : r.completed) ?? 0), f = Number((r == null ? void 0 : r.failed) ?? 0);
  return { awaiting_user: i, escalated: l, completed: c, failed: f, total: i + l + c + f };
}
async function wc({ limit: t = 100 } = {}) {
  const [e, r] = await Promise.all([ta(), xi()]), n = r ?? [], a = new Set(n.filter((c) => String(c.policy ?? "").toLowerCase() === "manual").map((c) => String(c.name ?? "").toLowerCase())), i = (e ?? []).filter((c) => c.status === "pending" && a.has(String(c.category ?? "").toLowerCase())).sort((c, f) => Number(f.date ?? 0) - Number(c.date ?? 0)).slice(0, t), l = [];
  for (const c of i) {
    const f = c.emailId ?? c.id;
    let p = null;
    f && typeof f == "string" && f.trim().length > 0 && f !== "null" && f !== "undefined" && (p = await io(f));
    const m = (p == null ? void 0 : p.subject) ?? c.subject, h = (p == null ? void 0 : p.from) ?? c.from;
    l.push({ id: f, subject: m, source_name: h, content: (p == null ? void 0 : p.body) ?? "", timestamp: c.date ?? (p == null ? void 0 : p.date) ?? 0, event_category: c.category, event_type: c.action, reason: c.reason, summary: c.summary, status: c.status, sender: h, from: h, actions_taken: [], rule_name: `Manual Review: ${c.category}` });
  }
  return l;
}
async function _v(t) {
  const e = await ta(), r = t.trim().toLowerCase();
  return (e ?? []).filter((n) => {
    const a = String(n.category ?? "").trim().toLowerCase(), o = String(n.status ?? "");
    return a === r && (o === "pending" || o === "escalated");
  }).length;
}
async function bv(t, { limit: e = 500 } = {}) {
  const r = await ta(), n = t.trim().toLowerCase(), a = (r ?? []).filter((i) => {
    const l = String(i.category ?? "").trim().toLowerCase(), c = String(i.status ?? "");
    return l === n && (c === "pending" || c === "escalated");
  }).sort((i, l) => Number(l.date ?? 0) - Number(i.date ?? 0)).slice(0, e), o = [];
  for (const i of a) {
    const l = i.emailId ?? i.id;
    let c = null;
    l && typeof l == "string" && l.trim().length > 0 && l !== "null" && l !== "undefined" && (c = await io(l)), o.push({ id: l ?? "", emailId: l ?? "", subject: i.subject ?? (c == null ? void 0 : c.subject) ?? "", from: i.from ?? (c == null ? void 0 : c.from) ?? "", eventType: i.action ?? "UNKNOWN", event_category: i.category ?? t, sourceType: (c == null ? void 0 : c.sourceType) ?? "gmail", status: i.status ?? "pending" });
  }
  return o;
}
async function xv(t) {
  await yc(t, "escalated");
}
async function kc(t, e) {
  return (await gv()).filter((a) => a.enabled).filter((a) => {
    const o = a.triggers.filter((f) => f.type === "event_type"), i = a.triggers.filter((f) => f.type === "event_category"), l = o.length === 0 || o.some((f) => f.name === t), c = i.length === 0 || i.some((f) => f.name === e);
    return l && c;
  }).sort((a, o) => o.priority - a.priority);
}
async function yv(t) {
  var _a10;
  const e = ((_a10 = t == null ? void 0 : t.toUpperCase) == null ? void 0 : _a10.call(t).replace(/\s+/g, "_").replace(/[^A-Z0-9_]/g, "")) || "", [r, n] = await Promise.all([Np(e), Rp(e)]), a = n ?? "critical", i = await Mp(a) ?? "manual";
  return (r == null ? void 0 : r.length) > 0 ? { actions: r.map((c) => ({ pluginId: c.plugin_id, commandId: c.command_id, order: c.action_idx })), policy: i, category: a, isOverride: true } : { actions: (await mc(a) ?? []).map((c) => ({ pluginId: c.plugin_id, commandId: c.command_id, order: c.action_idx })), policy: i, category: a, isOverride: false };
}
async function Sc() {
  const [t, e] = await Promise.all([xi(), xp()]), r = t ?? [], n = e ?? [], a = [];
  for (const o of r) {
    const i = o.name, l = await mc(i);
    a.push({ category: i, label: o.label ?? i, priority: o.priority ?? 0, policy: o.policy ?? "manual", actions: (l ?? []).map((c) => ({ pluginId: c.plugin_id, commandId: c.command_id, order: c.action_idx })), eventTypes: n.filter((c) => String(c.category_name ?? "") === i).map((c) => ({ name: c.name, label: c.label ?? c.name, autoCreated: c.auto_created ?? false })) });
  }
  return a;
}
async function wv(t, e) {
  await zp(t, e);
}
async function kv(t, e) {
  await Op(t, e);
}
async function Sv(t, e) {
  await Dp(t, e);
}
async function Tv(t) {
  await Lp(t);
}
async function Av(t) {
  await jp(t);
}
async function Ev(t, e) {
  await Bp(t, e);
}
const q_ = Object.freeze(Object.defineProperty({ __proto__: null, deleteEventType: Av, findMatchingRules: kc, getCategoryPipelines: Sc, getEventStats: ki, getPendingApprovals: wc, getPendingCountByCategory: _v, getPendingItemsByCategory: bv, getPipelineForEvent: yv, getPlugins: vv, getRule: mv, getRules: gv, getSources: pv, moveEventTypeToCategory: Sv, rejectClassification: xv, setPluginEnabled: Ev, unassignEventTypeFromCategory: Tv, updateCategoryPipeline: wv, updateCategoryPolicy: kv, updateRule: hv }, Symbol.toStringTag, { value: "Module" })), Y_ = /* @__PURE__ */ new Set(["trash", "delete", "mark_spam"]), K_ = /* @__PURE__ */ new Set(["archive"]);
async function Cv({ emailId: t, subject: e, from: r, eventType: n, actions: a, results: o, success: i, error: l }) {
  const c = (o ?? []).map((f, p) => {
    var _a10, _b4, _c6, _d4;
    return { actionId: f.actionId ?? ((_a10 = a == null ? void 0 : a[p]) == null ? void 0 : _a10.id) ?? "", actionName: f.actionName ?? ((_b4 = a == null ? void 0 : a[p]) == null ? void 0 : _b4.name) ?? f.actionId ?? "", commandId: f.commandId ?? ((_c6 = a == null ? void 0 : a[p]) == null ? void 0 : _c6.commandId) ?? "", pluginId: f.pluginId ?? ((_d4 = a == null ? void 0 : a[p]) == null ? void 0 : _d4.pluginId) ?? "", success: f.success ?? false, message: f.message ?? "" };
  });
  await Pp(crypto.randomUUID(), t, e ?? "(no subject)", r ?? "", n, Date.now(), !!i, l ?? "", eo(c));
}
async function Iv(t, e) {
  if (!t) return;
  const r = (e ?? []).filter((i) => i.success).map((i) => i.commandId).filter(Boolean), n = r.some((i) => Y_.has(i)), a = r.some((i) => K_.has(i));
  await $p(t, n || a);
}
async function X_({ limit: t = 50, offset: e = 0, failuresOnly: r = false } = {}) {
  const n = await Ep(t, e, r);
  return { entries: (n.entries ?? []).map((o) => ({ ...o, steps: Qn(o.steps, []), success: !!o.success })), total: n.total ?? 0 };
}
async function Z_() {
  await Ip();
}
const J_ = "modulepreload", Q_ = function(t) {
  return "/me-ai/" + t;
}, vu = {}, wr = function(e, r, n) {
  let a = Promise.resolve();
  if (r && r.length > 0) {
    let i = function(f) {
      return Promise.all(f.map((p) => Promise.resolve(p).then((m) => ({ status: "fulfilled", value: m }), (m) => ({ status: "rejected", reason: m }))));
    };
    document.getElementsByTagName("link");
    const l = document.querySelector("meta[property=csp-nonce]"), c = (l == null ? void 0 : l.nonce) || (l == null ? void 0 : l.getAttribute("nonce"));
    a = i(r.map((f) => {
      if (f = Q_(f), f in vu) return;
      vu[f] = true;
      const p = f.endsWith(".css"), m = p ? '[rel="stylesheet"]' : "";
      if (document.querySelector(`link[href="${f}"]${m}`)) return;
      const h = document.createElement("link");
      if (h.rel = p ? "stylesheet" : J_, p || (h.as = "script"), h.crossOrigin = "", h.href = f, c && h.setAttribute("nonce", c), document.head.appendChild(h), p) return new Promise((x, b) => {
        h.addEventListener("load", x), h.addEventListener("error", () => b(new Error(`Unable to preload CSS for ${f}`)));
      });
    }));
  }
  function o(i) {
    const l = new Event("vite:preloadError", { cancelable: true });
    if (l.payload = i, window.dispatchEvent(l), !l.defaultPrevented) throw i;
  }
  return a.then((i) => {
    for (const l of i || []) l.status === "rejected" && o(l.reason);
    return e().catch(o);
  });
}, Pv = "me-ai-events", $v = "me-ai-event-categories", In = { NOISE: { id: "NOISE", label: "Noise", description: "Unimportant messages that can be safely deleted automatically.", autoExecute: true, requiresApproval: false, color: "#6b7280" }, INFO: { id: "INFO", label: "Info", description: "Useful but not urgent \u2014 will be silently archived.", autoExecute: true, requiresApproval: false, color: "#3b82f6" }, CRITICAL: { id: "CRITICAL", label: "Critical", description: "Requires attention. User must review before any action runs.", autoExecute: false, requiresApproval: true, color: "#ef4444" } }, yl = "CRITICAL", eb = { noise: { name: "noise", label: "Noise", priority: 1, color: "#6b7280", policy: "auto" }, info: { name: "info", label: "Info", priority: 2, color: "#3b82f6", policy: "auto" }, critical: { name: "critical", label: "Critical", priority: 3, color: "#ef4444", policy: "manual" } };
function tb(t) {
  const e = (t || "").toUpperCase();
  return e === "NOISE" ? "noise" : e === "INFO" ? "info" : "critical";
}
async function Tc() {
  const { getSetting: t } = await wr(async () => {
    const { getSetting: e } = await Promise.resolve().then(() => un);
    return { getSetting: e };
  }, void 0);
  return await t(Pv) || {};
}
async function rb(t) {
  const { setSetting: e } = await wr(async () => {
    const { setSetting: r } = await Promise.resolve().then(() => un);
    return { setSetting: r };
  }, void 0);
  await e(Pv, t);
}
async function Nv() {
  const { getSetting: t } = await wr(async () => {
    const { getSetting: e } = await Promise.resolve().then(() => un);
    return { getSetting: e };
  }, void 0);
  return await t($v) || {};
}
async function nb(t) {
  const { setSetting: e } = await wr(async () => {
    const { setSetting: r } = await Promise.resolve().then(() => un);
    return { setSetting: r };
  }, void 0);
  await e($v, t);
}
async function ab() {
  try {
    const { getEmailClassifications: t } = await wr(async () => {
      const { getEmailClassifications: n } = await Promise.resolve().then(() => dv);
      return { getEmailClassifications: n };
    }, void 0), e = await t();
    return [...new Set((e ?? []).map((n) => n.action).filter(Boolean))].sort();
  } catch {
    return [];
  }
}
async function sb() {
  const t = await Tc(), e = await ab();
  return [.../* @__PURE__ */ new Set([...Object.keys(t), ...e])].sort();
}
function ob(t) {
  const e = (t || "").toUpperCase();
  return e === "NOISE" ? "NOISE" : e === "INFO" || e === "INFORMATIONAL" ? "INFO" : e === "CRITICAL" || e === "IMPORTANT" || e === "URGENT" ? "CRITICAL" : yl;
}
async function lo(t) {
  var _a10;
  const e = ((_a10 = t == null ? void 0 : t.toUpperCase) == null ? void 0 : _a10.call(t)) || "", r = await Nv();
  return ob(r[e]);
}
async function Si(t) {
  var _a10, _b4;
  const e = ((_a10 = t == null ? void 0 : t.toUpperCase) == null ? void 0 : _a10.call(t).replace(/\s+/g, "_").replace(/[^A-Z0-9_]/g, "")) || "";
  if (!e) return [];
  const n = (await Tc())[e];
  if (Array.isArray(n) && n.length > 0) return n;
  const { getPipelineForEvent: a } = await wr(async () => {
    const { getPipelineForEvent: i } = await Promise.resolve().then(() => q_);
    return { getPipelineForEvent: i };
  }, void 0), o = await a(t);
  return ((_b4 = o == null ? void 0 : o.actions) == null ? void 0 : _b4.length) ? o.actions.map((i, l) => ({ id: (i.commandId || "cmd") + "_" + l, pluginId: i.pluginId ?? "", commandId: i.commandId ?? "", name: (i.commandId ?? "").replace(/_/g, " "), description: "" })) : [];
}
async function ib(t, e, r) {
  const n = t.toUpperCase().replace(/\s+/g, "_").replace(/[^A-Z0-9_]/g, "");
  if (!n) return;
  const a = ["noise", "info", "critical"];
  let o = (e || "").toLowerCase().trim();
  a.includes(o) || (o === "noise" || e === "NOISE" ? o = "noise" : o === "informational" ? o = "info" : o = "critical");
  const i = o === "noise" ? "NOISE" : o === "info" ? "INFO" : "CRITICAL", l = await Nv();
  n in l || (l[n] = i, await nb(l));
  try {
    const { upsertEventType: f } = await wr(async () => {
      const { upsertEventType: m } = await Promise.resolve().then(() => dv);
      return { upsertEventType: m };
    }, void 0), p = n.replace(/_/g, " ");
    await f(n, p, o, true);
  } catch (f) {
    console.warn("[events] Failed to persist event type in DB:", n, (f == null ? void 0 : f.message) ?? f);
  }
  const c = await Tc();
  n in c || (c[n] = [], await rb(c));
}
async function lb(t, e) {
  const r = t.categoryTier ?? await lo(t.action), n = { type: t.action, source: "gmail", data: { subject: e.subject, from: e.from != null ? String(e.from) : void 0, date: e.date != null ? String(e.date) : void 0, snippet: e.snippet || (typeof e.body == "string" ? e.body.slice(0, 200) : "") || "" }, metadata: { reason: t.reason, summary: t.summary, tags: t.tags || [], category: r, classifiedAt: Date.now() } }, a = await Si(t.action);
  return { event: n, commands: a };
}
async function cb(t) {
  return { role: "assistant", type: "event-batch", items: await Promise.all(t.filter((r) => r.success && r.classification && r.email).map(async (r) => {
    const { event: n, commands: a } = await lb(r.classification, r.email);
    return { event: n, commands: a };
  })), content: "" };
}
async function Eo(t) {
  const e = await Promise.all(t.order.map(async (n) => {
    const a = t.categories[n] || [], o = await Si(n), i = await lo(n), l = a.map((c) => ({ emailId: c.emailId, subject: c.subject || "(no subject)", from: c.from || "", date: c.date, summary: c.summary || "", reason: c.reason || "", tags: c.tags || [], status: c.status || "pending" }));
    return { eventType: n, category: i, emails: l, commands: o };
  })), r = e.reduce((n, a) => n + a.emails.length, 0);
  return { role: "assistant", type: "events-by-category", categories: e, total: r, content: "" };
}
const gu = "https://accounts.google.com/gsi/client", db = "https://www.googleapis.com/auth/gmail.modify", Ac = "me-ai:oauth-token", Ec = "me-ai:oauth-token", qo = 300 * 1e3;
let to = null, Ys = null, Mn = 0;
function Rv(t, e) {
  try {
    localStorage.setItem(Ec, JSON.stringify({ access_token: t, expires_at: e }));
  } catch {
  }
}
function Mv() {
  try {
    localStorage.removeItem(Ec);
  } catch {
  }
}
function ub() {
  try {
    const t = localStorage.getItem(Ec);
    return t ? JSON.parse(t) : null;
  } catch {
    return null;
  }
}
async function zv(t, e) {
  Mn = Date.now() + e * 1e3, Rv(t, Mn);
  try {
    const { setSetting: r } = await wr(async () => {
      const { setSetting: n } = await Promise.resolve().then(() => un);
      return { setSetting: n };
    }, void 0);
    await r(Ac, { access_token: t, expires_at: Mn });
  } catch {
  }
}
async function wl() {
  Mn = 0, Mv();
  try {
    const { removeSetting: t } = await wr(async () => {
      const { removeSetting: e } = await Promise.resolve().then(() => un);
      return { removeSetting: e };
    }, void 0);
    await t(Ac);
  } catch {
  }
}
async function ba() {
  const t = ub();
  if ((t == null ? void 0 : t.access_token) && Date.now() < t.expires_at - qo) return Mn = t.expires_at, { access_token: t.access_token };
  try {
    const { getSetting: e } = await wr(async () => {
      const { getSetting: o } = await Promise.resolve().then(() => un);
      return { getSetting: o };
    }, void 0), r = await e(Ac);
    if (!r) return Mv(), null;
    const { access_token: n, expires_at: a } = r;
    return !n || !a || Date.now() > a - qo ? (await wl(), null) : (Mn = a, Rv(n, a), { access_token: n });
  } catch {
    return await wl(), null;
  }
}
function Cc() {
  return Mn > 0 && Date.now() < Mn - qo;
}
function kl() {
  return Mn <= 0 ? 0 : Math.max(0, Mn - qo - Date.now());
}
function mu() {
  return new Promise((t, e) => {
    if (!to) {
      e(new Error("Google Auth not initialized."));
      return;
    }
    Ys = async (r) => {
      r.error ? e(new Error(r.error_description || r.error)) : (await zv(r.access_token, r.expires_in), t({ access_token: r.access_token, expires_in: r.expires_in }));
    }, to.requestAccessToken({ prompt: "" });
  });
}
function fb() {
  return new Promise((t, e) => {
    var _a10, _b4;
    if ((_b4 = (_a10 = window.google) == null ? void 0 : _a10.accounts) == null ? void 0 : _b4.oauth2) {
      t();
      return;
    }
    const r = document.querySelector(`script[src="${gu}"]`);
    if (r) {
      r.addEventListener("load", () => t()), r.addEventListener("error", () => e(new Error("Failed to load Google Identity Services")));
      return;
    }
    const n = document.createElement("script");
    n.src = gu, n.async = true, n.defer = true, n.onload = () => t(), n.onerror = () => e(new Error("Failed to load Google Identity Services")), document.head.appendChild(n);
  });
}
async function Sl(t) {
  await fb(), to = window.google.accounts.oauth2.initTokenClient({ client_id: t, scope: db, callback: (e) => {
    Ys && (Ys(e), Ys = null);
  } });
}
function Ov() {
  return new Promise((t, e) => {
    if (!to) {
      e(new Error("Google Auth not initialized. Call initGoogleAuth first."));
      return;
    }
    Ys = async (r) => {
      r.error ? e(new Error(r.error_description || r.error)) : (await zv(r.access_token, r.expires_in), t({ access_token: r.access_token, expires_in: r.expires_in }));
    }, to.requestAccessToken();
  });
}
async function Dv(t) {
  return await wl(), new Promise((e) => {
    var _a10, _b4;
    ((_b4 = (_a10 = window.google) == null ? void 0 : _a10.accounts) == null ? void 0 : _b4.oauth2) ? window.google.accounts.oauth2.revoke(t, () => e()) : e();
  });
}
const pb = "me-ai-filesystem", Da = "handles", Ic = "rootDirectory";
function Pc() {
  return new Promise((t, e) => {
    const r = indexedDB.open(pb, 1);
    r.onerror = () => e(r.error), r.onsuccess = () => t(r.result), r.onupgradeneeded = () => {
      r.result.createObjectStore(Da, { keyPath: "key" });
    };
  });
}
async function Yo() {
  const t = await Pc();
  return new Promise((e, r) => {
    const o = t.transaction(Da, "readonly").objectStore(Da).get(Ic);
    o.onerror = () => {
      t.close(), r(o.error);
    }, o.onsuccess = () => {
      t.close();
      const i = o.result;
      e((i == null ? void 0 : i.handle) ?? null);
    };
  });
}
async function vb(t) {
  const e = await Pc();
  return new Promise((r, n) => {
    const i = e.transaction(Da, "readwrite").objectStore(Da).put({ key: Ic, handle: t });
    i.onerror = () => {
      e.close(), n(i.error);
    }, i.onsuccess = () => {
      e.close(), r();
    };
  });
}
async function gb() {
  const t = await Pc();
  return new Promise((e, r) => {
    const o = t.transaction(Da, "readwrite").objectStore(Da).delete(Ic);
    o.onerror = () => {
      t.close(), r(o.error);
    }, o.onsuccess = () => {
      t.close(), e();
    };
  });
}
function mb(t) {
  const e = t.data ?? {}, r = e.path ?? e.filePath ?? e.file;
  return r != null ? String(r).trim() : null;
}
function hu(t) {
  const e = t.data ?? {}, r = e.content ?? e.text ?? e.body;
  return r != null ? String(r) : null;
}
async function Xi(t, e, r = false) {
  const n = e.split("/").filter(Boolean);
  if (n.length === 0) throw new Error("Invalid path: must specify a file name");
  let a = t;
  for (let i = 0; i < n.length - 1; i++) a = await a.getDirectoryHandle(n[i], { create: r });
  const o = n[n.length - 1];
  return a.getFileHandle(o, { create: r });
}
async function _u(t, e, r = false) {
  const n = e.split("/").filter(Boolean);
  if (n.length === 0) return t;
  let a = t;
  for (const o of n) a = await a.getDirectoryHandle(o, { create: r });
  return a;
}
async function hb(t, e, r) {
  const n = t.replace(/^filesystem:/, "").toLowerCase(), a = mb(e);
  try {
    switch (n) {
      case "read_file": {
        if (!a) return { success: false, message: "read_file requires path in event.data" };
        const i = await (await Xi(r, a, false)).getFile();
        return { success: true, message: "File read", data: { content: await i.text(), size: i.size } };
      }
      case "write_file": {
        if (!a) return { success: false, message: "write_file requires path in event.data" };
        const o = hu(e) ?? "", l = await (await Xi(r, a, true)).createWritable();
        return await l.write(o), await l.close(), { success: true, message: `Wrote ${o.length} bytes to ${a}` };
      }
      case "list_dir": {
        const i = await _u(r, a ?? ".", false), l = [];
        for await (const [c, f] of i) l.push({ name: c, kind: f.kind });
        return { success: true, message: `Listed ${l.length} entries`, data: { entries: l } };
      }
      case "create_file": {
        if (!a) return { success: false, message: "create_file requires path in event.data" };
        const o = hu(e) ?? "", l = await (await Xi(r, a, true)).createWritable();
        return await l.write(o), await l.close(), { success: true, message: `Created file ${a}` };
      }
      case "delete_file": {
        if (!a) return { success: false, message: "delete_file requires path in event.data" };
        const o = a.split("/").filter(Boolean);
        if (o.length === 0) return { success: false, message: "Invalid path for delete_file" };
        const i = o.slice(0, -1).join("/"), l = o[o.length - 1];
        return await (i.length > 0 ? await _u(r, i, false) : r).removeEntry(l, { recursive: false }), { success: true, message: `Deleted ${a}` };
      }
      default:
        return { success: false, message: `Unknown filesystem action: ${t}` };
    }
  } catch (o) {
    return { success: false, message: o instanceof Error ? o.message : String(o) };
  }
}
function ns(t) {
  return (t.pluginId ?? "").toLowerCase().trim() === "filesystem";
}
function bu(t) {
  return (t == null ? void 0 : t.length) ? t.map((e, r) => ({ id: (e.commandId || e.id) + "_" + r, pluginId: e.pluginId ?? "gmail", commandId: e.commandId ?? e.id ?? "", name: (e.name ?? e.commandId ?? "").replace(/_/g, " ") || "" })) : [];
}
async function Lv(t, e, r) {
  var _a10;
  const n = t.filter((x) => !ns(x)), a = t.filter((x) => ns(x));
  if (n.length > 0 && !((_a10 = await ba()) == null ? void 0 : _a10.access_token)) throw new Error("Not authenticated. Please sign in to Gmail first.");
  if (a.length > 0 && !await Yo()) throw new Error("Choose a directory in Filesystem plugin settings.");
  const o = [], i = /* @__PURE__ */ new Map();
  if (n.length > 0) {
    const b = (await ba()).access_token, y = await Xp(n, e, b, r);
    o.push(...y.results ?? []);
  }
  if (a.length > 0) {
    const x = await Yo();
    if (x) for (let b = 0; b < t.length; b++) {
      const y = t[b];
      if (!ns(y)) continue;
      const k = await hb(y.commandId, e, x);
      i.set(b, { actionId: y.id, actionName: y.name, commandId: y.commandId, pluginId: y.pluginId, success: k.success, message: k.message });
    }
  }
  const l = [];
  let c = 0;
  for (let x = 0; x < t.length; x++) if (ns(t[x])) {
    const b = i.get(x);
    b ? l.push(b) : l.push({ success: false, message: "Filesystem action failed" });
  } else c < o.length && (l.push(o[c]), c++);
  const f = l.every((x) => x.success), p = l.filter((x) => x.success).map((x) => x.commandId ?? "").join(", "), m = l.filter((x) => !x.success).map((x) => `${x.commandId}: ${x.message ?? ""}`).join("; "), h = f ? `Successfully executed: ${p}` : `Pipeline failed: ${m}`;
  return { success: f, results: l, message: h };
}
async function co(t, e, r = false, n = {}) {
  var _a10, _b4, _c6;
  try {
    e == null ? void 0 : e({ phase: "starting", event: t });
    const { actionsOverride: a } = n;
    let o = "INFO", i = false, l = [], c = "", f;
    if (a == null ? void 0 : a.length) l = bu(a), c = "manual", i = true, o = "CRITICAL";
    else {
      const b = (((_a10 = t.metadata) == null ? void 0 : _a10.category) || ((_b4 = t.data) == null ? void 0 : _b4.category) || "" || "").toString().toLowerCase().trim();
      if (f = (await kc(t.type, b))[0], f && (c = f.policy ?? "", c === "manual" ? (i = true, o = "CRITICAL") : c === "auto" ? o = "NOISE" : o = "INFO", l = (f.actions || []).map((k, D) => ({ id: (k.commandId || k.id) + "_" + D, pluginId: k.pluginId ?? "gmail", commandId: k.commandId ?? k.id, name: (k.name ?? k.commandId ?? "").replace(/_/g, " ") || "" }))), !(l == null ? void 0 : l.length)) {
        const k = await yv(t.type);
        ((_c6 = k == null ? void 0 : k.actions) == null ? void 0 : _c6.length) && (c = k.policy ?? "manual", c === "manual" ? (i = true, o = "CRITICAL") : c === "auto" ? o = "NOISE" : o = "INFO", l = bu(k.actions));
      }
    }
    if (!(l == null ? void 0 : l.length)) return { success: true, message: f ? `No actions defined for rule: ${f.name}` : `No enabled pipeline rule or category pipeline matches event type: ${t.type}`, results: [] };
    if (e == null ? void 0 : e({ phase: "policy_check", category: o, policy: c }), i && !r) return { success: false, requiresApproval: true, category: o, actions: l, message: "This event type is CRITICAL \u2014 review the actions below and confirm before executing." };
    e == null ? void 0 : e({ phase: "pipeline_loaded", actions: l, actionCount: l.length });
    const p = await Lv(l, t, e), m = t.data, h = (m == null ? void 0 : m.emailId) ?? (m == null ? void 0 : m.id);
    return await Promise.all([Cv({ emailId: h ?? "", subject: m == null ? void 0 : m.subject, from: m == null ? void 0 : m.from, eventType: t.type, actions: l, results: p.results ?? [], success: p.success }), Iv(h ?? "", p.results ?? [])]), e == null ? void 0 : e({ phase: "done", result: p }), p;
  } catch (a) {
    const o = a;
    return e == null ? void 0 : e({ phase: "error", error: o.message }), { success: false, error: a, message: o.message || "Unknown error" };
  }
}
async function $c(t, e, r, n = false) {
  var _a10, _b4, _c6;
  try {
    r == null ? void 0 : r({ phase: "starting", eventType: t, eventCount: e.length });
    const o = (((_a10 = e[0]) == null ? void 0 : _a10.metadata) || ((_b4 = e[0]) == null ? void 0 : _b4.category) || "" || "").toString().toLowerCase().trim(), l = (await kc(t, o))[0];
    let c = "INFO", f = false, p = [];
    if (l) l.policy === "manual" ? (f = true, c = "CRITICAL") : l.policy === "auto" ? c = "NOISE" : c = "INFO", p = l.actions || [];
    else return { success: true, message: `No enabled pipeline rule matches event type: ${t}`, results: [], total: 0, successful: 0, failed: 0 };
    if (f && !n) return { success: false, requiresApproval: true, category: c, actions: p, total: e.length, successful: 0, failed: 0, message: "This event type is CRITICAL \u2014 review the actions below and confirm before executing." };
    if (!(p == null ? void 0 : p.length)) return { success: true, message: `No actions defined for rule: ${l.name}`, results: [], total: 0, successful: 0, failed: 0 };
    if (p.some((U) => !ns(U)) && !((_c6 = await ba()) == null ? void 0 : _c6.access_token)) throw new Error("Not authenticated. Please sign in to Gmail first.");
    if (p.some(ns) && !await Yo()) throw new Error("Choose a directory in Filesystem plugin settings.");
    r == null ? void 0 : r({ phase: "pipeline_loaded", actions: p, actionCount: p.length });
    const x = p.map((U, j) => ({ id: (U.commandId ?? U.id) + "_" + j, pluginId: U.pluginId ?? "gmail", commandId: U.commandId ?? U.id ?? "", name: (U.name ?? U.commandId ?? "").replace(/_/g, " ") || "" })), b = [];
    for (let U = 0; U < e.length; U++) {
      const j = e[U], M = { type: t, source: "gmail", data: j };
      r == null ? void 0 : r({ phase: "batch_event", eventIndex: U, totalEvents: e.length, event: M });
      const q = await Lv(x, M, r);
      b.push({ event: M, results: q.results, success: q.success, message: q.message });
    }
    await Promise.all(b.map(async (U) => {
      var _a11;
      const j = (_a11 = U.event) == null ? void 0 : _a11.data, M = (j == null ? void 0 : j.emailId) ?? (j == null ? void 0 : j.id);
      await Promise.all([Cv({ emailId: M ?? "", subject: j == null ? void 0 : j.subject, from: j == null ? void 0 : j.from, eventType: t, actions: p, results: U.results ?? [], success: U.success ?? false }), Iv(M ?? "", U.results ?? [])]);
    }));
    const y = b.filter((U) => U.success).length, k = b.length - y, D = { success: k === 0, results: b, total: b.length, successful: y, failed: k, message: `Processed ${b.length} event(s): ${y} successful, ${k} failed` };
    return r == null ? void 0 : r({ phase: "done", result: D }), D;
  } catch (a) {
    const o = a;
    return r == null ? void 0 : r({ phase: "error", error: o.message }), { success: false, error: a, message: o.message || "Unknown error", total: e.length, successful: 0, failed: e.length };
  }
}
function Nc(t) {
  const e = Yp(t);
  return Array.isArray(e) ? e : [];
}
async function Ko() {
  var _a10;
  return !!((_a10 = await ba()) == null ? void 0 : _a10.access_token);
}
const _b = Object.freeze(Object.defineProperty({ __proto__: null, EVENT_CATEGORY_TIERS: In, executePipeline: co, executePipelineBatch: $c, getAvailableActions: Nc, isAuthenticated: Ko }, Symbol.toStringTag, { value: "Module" }));
function Tl(t) {
  if (t === 0) return "0 B";
  const e = 1024, r = ["B", "KB", "MB", "GB"], n = Math.floor(Math.log(t) / Math.log(e));
  return (t / Math.pow(e, n)).toFixed(1) + " " + r[n];
}
function Zi(t) {
  if (t === 0) return "0 B";
  const e = 1024, r = ["B", "KB", "MB", "GB"], n = Math.floor(Math.log(t) / Math.log(e)), a = t / Math.pow(e, n), o = n >= 2 ? 2 : n >= 1 ? 1 : 0;
  return a.toFixed(o) + " " + r[n];
}
function bb(t, e) {
  return !e || e <= 0 ? null : Math.min(100, t / e * 100);
}
function xb(t, e) {
  return t ? t.length <= e ? t : t.slice(0, e) + "..." : "";
}
function Rc(t) {
  let e = 0;
  for (let r = 0; r < t.length; r++) e = t.charCodeAt(r) + ((e << 5) - e);
  return Math.abs(e) % 360;
}
function Mc(t) {
  if (!t) return "";
  try {
    return new Date(t).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
  } catch {
    return String(t);
  }
}
function jv(t) {
  if (!t) return "Unknown";
  const e = t.match(/^"?([^"<]+)"?\s*</);
  return e ? e[1].trim() : t.split("@")[0];
}
function yb(t) {
  return jv(t).charAt(0).toUpperCase();
}
function wb(t) {
  try {
    const e = new Date(t), r = e.getFullYear(), n = String(e.getMonth() + 1).padStart(2, "0"), a = String(e.getDate()).padStart(2, "0");
    return `${r}-${n}-${a}`;
  } catch {
    return "email";
  }
}
function kb(t) {
  return (t || "email").replace(/[^a-zA-Z0-9 _-]/g, "").replace(/\s+/g, "-").slice(0, 60).replace(/-+$/, "");
}
function Bv(t, e) {
  return `${wb(t.date)}_${kb(t.subject)}.${e}`;
}
function Fv(t) {
  const e = {};
  for (const n of t) {
    const a = n.action || "UNKNOWN";
    e[a] || (e[a] = []), e[a].push(n);
  }
  for (const n of Object.keys(e)) e[n].sort((a, o) => (o.date || 0) - (a.date || 0));
  const r = Object.keys(e).sort((n, a) => e[a].length - e[n].length);
  return { categories: e, order: r };
}
const Xo = [{ label: "GPT-OSS", models: [{ id: "onnx-community/gpt-oss-20b-ONNX", name: "20B", size: "~12 GB", contextWindow: 131072, maxEmailTokens: 16e3, description: "OpenAI open-source, 128k context, built-in reasoning", gpuWarning: "Requires powerful GPU (12 GB+ VRAM). ~12 GB download.", isExperimental: true, recommendedForEmailProcessing: true }] }, { label: "Qwen 3.5", models: [{ id: "onnx-community/Qwen3.5-0.8B-ONNX", name: "0.8B", size: "~647 MB", contextWindow: 262144, maxEmailTokens: 4e3, description: "Fastest, 256k context, hybrid attention" }, { id: "onnx-community/Qwen3.5-2B-ONNX", name: "2B", size: "~1.6 GB", contextWindow: 262144, maxEmailTokens: 6e3, description: "Balanced speed and quality, 256k context", recommendedForEmailProcessing: true }, { id: "onnx-community/Qwen3.5-4B-ONNX", name: "4B", size: "~3 GB", contextWindow: 262144, maxEmailTokens: 12e3, description: "Best reasoning, 256k context", recommendedForEmailProcessing: true, gpuWarning: "Requires good GPU (8 GB+ VRAM recommended)" }] }], ea = Xo.flatMap((t) => t.models);
function Ti(t) {
  return ea.find((e) => e.id === t);
}
const Sb = Object.freeze(Object.defineProperty({ __proto__: null, MODELS: ea, MODEL_GROUPS: Xo, getModelInfo: Ti }, Symbol.toStringTag, { value: "Module" })), zn = [{ name: "qwen3:4b", displayName: "Qwen3 4B", params: "4B", contextWindow: 131072, maxEmailTokens: 1e5, description: "Latest Qwen, 128k context, enhanced reasoning", tags: ["multilingual", "reasoning", "general"], recommended: true, recommendedForEmailProcessing: true }, { name: "qwen3:8b", displayName: "Qwen3 8B", params: "8B", contextWindow: 131072, maxEmailTokens: 1e5, description: "Powerful reasoning, 128k context, 100+ languages", tags: ["multilingual", "reasoning", "advanced"], recommended: true, recommendedForEmailProcessing: true }, { name: "qwen3:14b", displayName: "Qwen3 14B", params: "14B", contextWindow: 131072, maxEmailTokens: 1e5, description: "Most capable Qwen3, best for complex tasks", tags: ["multilingual", "reasoning", "advanced"], recommended: true, recommendedForEmailProcessing: true }, { name: "ministral-3:3b", displayName: "Ministral 3 3B", params: "3B", contextWindow: 262144, maxEmailTokens: 2e5, description: "Mistral's smallest, 256k context, Apache 2.0", tags: ["fast", "long-context", "efficient"], recommended: true, recommendedForEmailProcessing: true }, { name: "ministral-3:8b", displayName: "Ministral 3 8B", params: "8B", contextWindow: 262144, maxEmailTokens: 2e5, description: "Balanced performance, 256k context, vision capable", tags: ["general", "long-context", "vision"], recommended: true, recommendedForEmailProcessing: true }, { name: "ministral-3:14b", displayName: "Ministral 3 14B", params: "14B", contextWindow: 262144, maxEmailTokens: 2e5, description: "Most capable Ministral, 256k context, function calling", tags: ["advanced", "long-context", "vision"], recommended: true, recommendedForEmailProcessing: true }, { name: "gpt-oss:20b", displayName: "GPT-OSS 20B", params: "20B", contextWindow: 131072, maxEmailTokens: 1e5, description: "OpenAI's open model, strong reasoning, Apache 2.0", tags: ["reasoning", "cot", "openai"], recommended: true, recommendedForEmailProcessing: true }, { name: "gemma3:4b", displayName: "Gemma3 4B", params: "4B", contextWindow: 131072, maxEmailTokens: 1e5, description: "Google, 128k context, multimodal (text + images)", tags: ["multimodal", "vision", "multilingual"], recommended: true, recommendedForEmailProcessing: true }, { name: "gemma3:12b", displayName: "Gemma3 12B", params: "12B", contextWindow: 131072, maxEmailTokens: 1e5, description: "Powerful multimodal, 128k context, 140+ languages", tags: ["multimodal", "vision", "multilingual", "advanced"], recommended: true, recommendedForEmailProcessing: true }, { name: "gemma3n:e2b", displayName: "Gemma3N E2B", params: "2B effective", contextWindow: 32768, maxEmailTokens: 25e3, description: "Efficient 2B, multimodal, MatFormer architecture", tags: ["efficient", "multimodal", "fast"], recommendedForEmailProcessing: false }, { name: "gemma3n:e4b", displayName: "Gemma3N E4B", params: "4B effective", contextWindow: 32768, maxEmailTokens: 25e3, description: "Efficient 4B, multimodal, selective parameter activation", tags: ["efficient", "multimodal", "balanced"], recommendedForEmailProcessing: false }, { name: "deepseek-r1:7b", displayName: "DeepSeek R1 7B", params: "7B", contextWindow: 65536, maxEmailTokens: 5e4, description: "Strong chain-of-thought reasoning, research-focused", tags: ["reasoning", "cot"], recommended: true, recommendedForEmailProcessing: true }, { name: "deepseek-r1:14b", displayName: "DeepSeek R1 14B", params: "14B", contextWindow: 65536, maxEmailTokens: 5e4, description: "Advanced CoT reasoning, slower but thorough", tags: ["reasoning", "cot", "advanced"], recommended: true, recommendedForEmailProcessing: true }];
function Uv() {
  return zn.filter((t) => t.recommended);
}
function zc(t) {
  return zn.find((e) => e.name === t || e.name.startsWith(t + ":"));
}
const Tb = Object.freeze(Object.defineProperty({ __proto__: null, OLLAMA_MODELS: zn, getOllamaModelInfo: zc, getRecommendedOllamaModels: Uv }, Symbol.toStringTag, { value: "Module" })), Ab = 20, Gv = { maxTokens: 2048, enableThinking: false, doSample: false };
function Wv(t) {
  return `You are a message classifier. Analyze this message and produce a classification.

Output ONLY a valid JSON object \u2014 no markdown, no explanation, no extra text.

Format:
{
  "action": "EVENT_TYPE_NAME",
  "category": "noise",
  "reason": "One sentence explaining why",
  "summary": "2-3 sentence summary of the message content",
  "tags": ["tag1", "tag2", "tag3"]
}

Guidelines for "action" (Event Type):
- Condense the message's core purpose into a distinct, high-level event type.
- This MUST be a flexible, dynamically generated string categorizing the *nature* of the message.
- Examples: RECEIPT, SHIPPING_UPDATE, NEWSLETTER, SECURITY_ALERT, ACCOUNT_NOTICE, PROMOTION, BILLING_REMINDER, JOB_ALERT, SOCIAL_MENTION
- Do not use verbs. Use noun phrases that describe the event type.
- Reuse existing event types when the message fits \u2014 avoid creating very similar types.

Guidelines for "category" (Event Category \u2014 exactly three tiers):
- "noise"    \u2014 Pure spam, mass marketing, social media digests, promotional blasts. Will be automatically deleted. Use ONLY when you are certain.
- "info"     \u2014 Useful but not urgent: newsletters, shipping updates, social notifications, automated confirmations. Will be silently archived.
- "critical" \u2014 Requires attention: personal messages, work emails, invoices, account changes, financial transactions, security alerts. User must review.
- When in doubt, always use "critical" \u2014 it is safer.
- "noise" auto-deletes, so be extremely conservative with it.

Guidelines for "tags":
- 2-5 short lowercase tags describing the message's nature
- Examples: ad, promotion, newsletter, delivery, billing, personal, work, social, receipt, shipping, subscription, security, update, notification, finance, travel
- Be descriptive and specific

Guidelines for "summary":
- 2-3 sentences capturing the key information
- Include specific details: amounts, dates, names, tracking numbers, deadlines
- Write from the perspective of what matters to the recipient

Active integrations: ${t.filter((r) => r.actions.length).map((r) => r.pluginName).join(", ") || "(none)"}

Rules:
- Output ONLY the JSON object, nothing else. No prefixes like ---set or --set, no markdown, no code fences.
- "action" must be UPPER_SNAKE_CASE and describe the message type (e.g. PROMOTION, RECEIPT). Never use connection strings, config values, or technical jargon.
- "category" must be exactly one of: "noise", "info", "critical"
- "reason" and "summary" must be plain English about the message content only. Do not insert config variables or technical strings.
- "tags" must be an array of lowercase strings
- "summary" must be a string`;
}
function Vv() {
  const t = Kp();
  return Array.isArray(t) ? t.map((e) => ({ pluginId: e.plugin_id ?? "", pluginName: e.pluginName ?? "", actions: (e.actions ?? []).map((r) => ({ actionId: r.actionId ?? "" })) })) : [];
}
function Eb() {
  return Wv(Vv());
}
async function Hv(t, e = {}) {
  const { count: r = Ab, force: n = false, onProgress: a = () => {
  }, signal: o } = e;
  if (!t.isReady) throw new Error("Model not loaded. Please load a model first.");
  a({ phase: "loading", message: "Loading recent emails..." });
  let i, l = 0;
  if (n) i = (await ps(r)).map((K) => xu(K));
  else {
    const [N, K] = await Promise.all([ps(5e3), ta(null, 5e3)]), W = new Set((K ?? []).map((A) => A.emailId).filter(Boolean));
    i = (N ?? []).filter((A) => !W.has(A.id)).slice(0, r).map((A) => xu(A)), l = Number(await wi() ?? 0);
  }
  if (i.length === 0) {
    const N = n ? "No emails to scan." : `All emails already classified (${l} total). Use "Rescan All" to reclassify.`;
    return a({ phase: "done", message: N, classified: 0 }), { scanned: 0, classified: 0, skipped: l, errors: 0 };
  }
  const c = Date.now(), f = performance.now();
  let p = 0, m = 0, h = 0, x = 0;
  const b = [], y = Vv(), k = Wv(y), D = new Set(y.flatMap((N) => N.actions.map((K) => K.actionId))), U = t.modelId, j = Ti(U ?? "") ?? zc(U ?? "");
  if (!j) throw new Error(`Unknown model: ${U}`);
  const M = j.displayName ?? j.name;
  if (!j.recommendedForEmailProcessing && i.length > 0) {
    const { MODELS: N } = await wr(async () => {
      const { MODELS: A } = await Promise.resolve().then(() => Sb);
      return { MODELS: A };
    }, void 0), { OLLAMA_MODELS: K } = await wr(async () => {
      const { OLLAMA_MODELS: A } = await Promise.resolve().then(() => Tb);
      return { OLLAMA_MODELS: A };
    }, void 0), W = [...N.filter((A) => A.recommendedForEmailProcessing).map((A) => A.name), ...K.filter((A) => A.recommendedForEmailProcessing).map((A) => A.displayName)];
    console.warn(`\u26A0\uFE0F Current model (${M}) is not optimized for email processing. For best results with long emails, use: ${W.join(", ")}. Some emails may fail due to memory limits.`);
  }
  for (let N = 0; N < i.length && !(o == null ? void 0 : o.aborted); N++) {
    const K = i[N], W = Kv(K), A = [{ role: "system", content: k }, { role: "user", content: W }];
    a({ phase: "scanning", current: N + 1, total: i.length, classified: p, errors: m, results: b, email: { subject: K.subject, from: K.from, date: K.date != null ? String(K.date) : void 0 }, prompt: { system: k, user: W }, systemPromptLength: k.length, live: null, lastResult: null, totals: { outputTokens: h, inputTokens: x, elapsed: performance.now() - f } });
    const S = performance.now();
    try {
      const { text: w, tps: R, numTokens: B, inputTokens: Z } = await t.generateFull(A, { maxTokens: Gv.maxTokens, enableThinking: false, temperature: 0 }, (te) => {
        a({ phase: "generating", current: N + 1, total: i.length, classified: p, errors: m, results: b, email: { subject: K.subject, from: K.from, date: K.date != null ? String(K.date) : void 0 }, live: { tps: te.tps, numTokens: te.numTokens }, streamingText: te.text || "", totals: { outputTokens: h, inputTokens: x, elapsed: performance.now() - f } });
      });
      h += B, x += Z;
      const X = Pb(w, D), H = performance.now() - S;
      if (X) {
        await av(K.id, X.action, X.categoryTier, X.reason, X.summary, eo(X.tags), K.subject || "(no subject)", K.from || "", K.date ?? null, c, "pending"), await ib(X.action, X.category, X.suggestedActions), p++;
        const te = { success: true, email: { subject: K.subject, from: K.from, date: K.date }, classification: X, rawResponse: w, stats: { tps: R, numTokens: B, inputTokens: Z, elapsed: H }, promptSize: W.length };
        b.push(te), a({ phase: "classified", current: N + 1, total: i.length, classified: p, errors: m, results: b, email: { subject: K.subject, from: K.from, date: K.date != null ? String(K.date) : void 0 }, result: X, rawResponse: w, emailStats: { tps: R, numTokens: B, inputTokens: Z, elapsed: H }, totals: { outputTokens: h, inputTokens: x, elapsed: performance.now() - f } });
      }
    } catch (w) {
      const R = w instanceof Error ? w : new Error(String(w));
      console.error(`Triage email ${N + 1} failed:`, R), m++;
      const B = R.message, Z = B.length > 200 ? B.slice(0, 200) + "..." : B;
      b.push({ success: false, email: { subject: K.subject, from: K.from, date: K.date }, error: Z, promptSize: W.length });
    }
  }
  const q = performance.now() - f, F = b.length > 0 ? Math.round(b.reduce((N, K) => N + (K.promptSize ?? 0), 0) / b.length) : 0, P = b.filter((N) => {
    var _a10;
    return N.success && ((_a10 = N.stats) == null ? void 0 : _a10.tps);
  }), C = P.length > 0 ? Math.round(P.reduce((N, K) => {
    var _a10;
    return N + (((_a10 = K.stats) == null ? void 0 : _a10.tps) ?? 0);
  }, 0) / P.length) : null, T = j;
  return a({ phase: "done", current: i.length, total: i.length, classified: p, errors: m, results: b, summary: { avgPromptSize: F, avgTps: C, systemPromptSize: k.length, processed: i.length, skipped: l, modelName: T.displayName ?? T.name, modelContextWindow: T.contextWindow, modelMaxEmailTokens: T.maxEmailTokens }, totals: { outputTokens: h, inputTokens: x, elapsed: q } }), { scanned: i.length, classified: p, skipped: l, errors: m };
}
async function as(t = {}) {
  let r = (await ta(null, 5e3) ?? []).map((n) => Ib(n));
  return t.pendingOnly === true && (r = r.filter((n) => n.status === "pending" || n.status === "escalated")), Fv(r);
}
async function qv() {
  const t = await ta(null, 5e4), r = { total: (t ?? []).length };
  for (const n of t ?? []) {
    const a = n.action ?? "UNKNOWN";
    r[a] = (r[a] ?? 0) + 1;
  }
  return r;
}
async function vs(t, e) {
  await yc(t, e);
}
async function Cb() {
  await tv();
}
async function Oc(t) {
  await nv(t);
}
async function Yv(t) {
  await rv(t);
}
async function Al() {
  const [t, e] = await Promise.all([ws().then((r) => Number(r ?? 0)), wi().then((r) => Number(r ?? 0))]);
  return { totalEmails: t, classified: e, unclassified: Math.max(0, t - e) };
}
function xu(t) {
  return { ...t, date: t.date != null ? Number(t.date) : null, syncedAt: t.syncedAt != null ? Number(t.syncedAt) : null, labels: Qn(String(t.labels ?? ""), []), raw: Qn(t.raw != null ? String(t.raw) : null, null) };
}
function Ib(t) {
  return { ...t, date: t.date != null ? Number(t.date) : null, scannedAt: t.scannedAt != null ? Number(t.scannedAt) : null, tags: Qn(t.tags != null ? String(t.tags) : null, []) };
}
function Kv(t) {
  const e = t.date != null ? new Date(t.date).toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric" }) : "Unknown date", r = t.body ?? t.snippet ?? "";
  return [`Subject: ${t.subject}`, `From: ${t.from}`, `To: ${t.to ?? "me"}`, `Date: ${e}`, `Labels: ${(t.labels ?? []).join(", ")}`, "", r].join(`
`);
}
function Pb(t, e) {
  if (t == null || typeof t != "string" || !t.trim()) return null;
  let r = t.trim();
  r = r.replace(/<think>[\s\S]*?<\/think>/gi, "").trim(), r = r.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, ""), r = r.replace(/^[\s\-]*set\s+/gi, "").replace(/^---+\s*/, ""), r = r.trim();
  const n = r.indexOf("["), a = r.indexOf("{"), o = r.lastIndexOf("]"), i = r.lastIndexOf("}");
  if (n !== -1 && (a === -1 || n < a)) {
    const c = r.slice(n, o + 1);
    try {
      const f = JSON.parse(c);
      if (Array.isArray(f)) return null;
    } catch {
    }
  }
  if (a === -1 || i === -1 || i <= a) return console.warn("Triage: no JSON object found in response"), null;
  let l = r.slice(a, i + 1);
  l = l.replace(/\s*--set\s+/gi, " ");
  try {
    const c = JSON.parse(l);
    if (!c || typeof c != "object" || Array.isArray(c)) return null;
    const f = String(c.action ?? "").trim();
    if (/[=]|postgres|sslmode|require|connection|config/i.test(f)) return console.warn("Triage: invalid action (looks like config/jargon):", f.slice(0, 60)), null;
    const p = $b(f);
    if (!p) return console.warn("Triage: missing or invalid action field"), null;
    if (p.length > 50 || /POSTGRES|SSLMODE|REQUIRE|CONNECTION/.test(p)) return console.warn("Triage: action rejected as jargon:", p.slice(0, 40)), null;
    const m = ["noise", "info", "critical"], h = String(c.category ?? "").toLowerCase().trim(), x = c.categoryTier;
    let b;
    m.includes(h) ? b = h : h === "noise" || x === "NOISE" ? b = "noise" : h === "informational" ? b = "info" : b = "critical";
    const y = b === "noise" ? "NOISE" : b === "info" ? "INFO" : "CRITICAL", k = [];
    let D = [];
    Array.isArray(c.tags) && (D = c.tags.filter((q) => typeof q == "string" && q.trim().length > 0).map((q) => q.trim().toLowerCase()).slice(0, 10));
    const U = (q) => {
      let F = String(q ?? "").trim();
      return F = F.replace(/\bpostgres[-\s]?sslmode\s*=\s*require\b/gi, ""), F = F.replace(/\s*--set\s+/gi, " ").replace(/\s{2,}/g, " ").trim(), F.slice(0, 500);
    }, j = U(c.reason).slice(0, 300), M = U(c.summary).slice(0, 500);
    return { action: p, category: b, categoryTier: y, suggestedActions: k, reason: j, summary: M, tags: D };
  } catch (c) {
    return console.warn("Triage: failed to parse JSON response:", c instanceof Error ? c.message : c), null;
  }
}
function $b(t) {
  return !t || typeof t != "string" ? null : t.trim().toUpperCase().replace(/[\s-]+/g, "_").replace(/[^A-Z0-9_]/g, "") || null;
}
function Zo(t) {
  return `hsl(${Rc(t)}, 55%, 55%)`;
}
function Nb(t) {
  return `hsl(${Rc(t)}, 40%, 35%)`;
}
const Rb = (t, e) => {
  const r = new Array(t.length + e.length);
  for (let n = 0; n < t.length; n++) r[n] = t[n];
  for (let n = 0; n < e.length; n++) r[t.length + n] = e[n];
  return r;
}, Mb = (t, e) => ({ classGroupId: t, validator: e }), Xv = (t = /* @__PURE__ */ new Map(), e = null, r) => ({ nextPart: t, validators: e, classGroupId: r }), Jo = "-", yu = [], zb = "arbitrary..", Ob = (t) => {
  const e = Lb(t), { conflictingClassGroups: r, conflictingClassGroupModifiers: n } = t;
  return { getClassGroupId: (i) => {
    if (i.startsWith("[") && i.endsWith("]")) return Db(i);
    const l = i.split(Jo), c = l[0] === "" && l.length > 1 ? 1 : 0;
    return Zv(l, c, e);
  }, getConflictingClassGroupIds: (i, l) => {
    if (l) {
      const c = n[i], f = r[i];
      return c ? f ? Rb(f, c) : c : f || yu;
    }
    return r[i] || yu;
  } };
}, Zv = (t, e, r) => {
  if (t.length - e === 0) return r.classGroupId;
  const a = t[e], o = r.nextPart.get(a);
  if (o) {
    const f = Zv(t, e + 1, o);
    if (f) return f;
  }
  const i = r.validators;
  if (i === null) return;
  const l = e === 0 ? t.join(Jo) : t.slice(e).join(Jo), c = i.length;
  for (let f = 0; f < c; f++) {
    const p = i[f];
    if (p.validator(l)) return p.classGroupId;
  }
}, Db = (t) => t.slice(1, -1).indexOf(":") === -1 ? void 0 : (() => {
  const e = t.slice(1, -1), r = e.indexOf(":"), n = e.slice(0, r);
  return n ? zb + n : void 0;
})(), Lb = (t) => {
  const { theme: e, classGroups: r } = t;
  return jb(r, e);
}, jb = (t, e) => {
  const r = Xv();
  for (const n in t) {
    const a = t[n];
    Dc(a, r, n, e);
  }
  return r;
}, Dc = (t, e, r, n) => {
  const a = t.length;
  for (let o = 0; o < a; o++) {
    const i = t[o];
    Bb(i, e, r, n);
  }
}, Bb = (t, e, r, n) => {
  if (typeof t == "string") {
    Fb(t, e, r);
    return;
  }
  if (typeof t == "function") {
    Ub(t, e, r, n);
    return;
  }
  Gb(t, e, r, n);
}, Fb = (t, e, r) => {
  const n = t === "" ? e : Jv(e, t);
  n.classGroupId = r;
}, Ub = (t, e, r, n) => {
  if (Wb(t)) {
    Dc(t(n), e, r, n);
    return;
  }
  e.validators === null && (e.validators = []), e.validators.push(Mb(r, t));
}, Gb = (t, e, r, n) => {
  const a = Object.entries(t), o = a.length;
  for (let i = 0; i < o; i++) {
    const [l, c] = a[i];
    Dc(c, Jv(e, l), r, n);
  }
}, Jv = (t, e) => {
  let r = t;
  const n = e.split(Jo), a = n.length;
  for (let o = 0; o < a; o++) {
    const i = n[o];
    let l = r.nextPart.get(i);
    l || (l = Xv(), r.nextPart.set(i, l)), r = l;
  }
  return r;
}, Wb = (t) => "isThemeGetter" in t && t.isThemeGetter === true, Vb = (t) => {
  if (t < 1) return { get: () => {
  }, set: () => {
  } };
  let e = 0, r = /* @__PURE__ */ Object.create(null), n = /* @__PURE__ */ Object.create(null);
  const a = (o, i) => {
    r[o] = i, e++, e > t && (e = 0, n = r, r = /* @__PURE__ */ Object.create(null));
  };
  return { get(o) {
    let i = r[o];
    if (i !== void 0) return i;
    if ((i = n[o]) !== void 0) return a(o, i), i;
  }, set(o, i) {
    o in r ? r[o] = i : a(o, i);
  } };
}, El = "!", wu = ":", Hb = [], ku = (t, e, r, n, a) => ({ modifiers: t, hasImportantModifier: e, baseClassName: r, maybePostfixModifierPosition: n, isExternal: a }), qb = (t) => {
  const { prefix: e, experimentalParseClassName: r } = t;
  let n = (a) => {
    const o = [];
    let i = 0, l = 0, c = 0, f;
    const p = a.length;
    for (let y = 0; y < p; y++) {
      const k = a[y];
      if (i === 0 && l === 0) {
        if (k === wu) {
          o.push(a.slice(c, y)), c = y + 1;
          continue;
        }
        if (k === "/") {
          f = y;
          continue;
        }
      }
      k === "[" ? i++ : k === "]" ? i-- : k === "(" ? l++ : k === ")" && l--;
    }
    const m = o.length === 0 ? a : a.slice(c);
    let h = m, x = false;
    m.endsWith(El) ? (h = m.slice(0, -1), x = true) : m.startsWith(El) && (h = m.slice(1), x = true);
    const b = f && f > c ? f - c : void 0;
    return ku(o, x, h, b);
  };
  if (e) {
    const a = e + wu, o = n;
    n = (i) => i.startsWith(a) ? o(i.slice(a.length)) : ku(Hb, false, i, void 0, true);
  }
  if (r) {
    const a = n;
    n = (o) => r({ className: o, parseClassName: a });
  }
  return n;
}, Yb = (t) => {
  const e = /* @__PURE__ */ new Map();
  return t.orderSensitiveModifiers.forEach((r, n) => {
    e.set(r, 1e6 + n);
  }), (r) => {
    const n = [];
    let a = [];
    for (let o = 0; o < r.length; o++) {
      const i = r[o], l = i[0] === "[", c = e.has(i);
      l || c ? (a.length > 0 && (a.sort(), n.push(...a), a = []), n.push(i)) : a.push(i);
    }
    return a.length > 0 && (a.sort(), n.push(...a)), n;
  };
}, Kb = (t) => ({ cache: Vb(t.cacheSize), parseClassName: qb(t), sortModifiers: Yb(t), ...Ob(t) }), Xb = /\s+/, Zb = (t, e) => {
  const { parseClassName: r, getClassGroupId: n, getConflictingClassGroupIds: a, sortModifiers: o } = e, i = [], l = t.trim().split(Xb);
  let c = "";
  for (let f = l.length - 1; f >= 0; f -= 1) {
    const p = l[f], { isExternal: m, modifiers: h, hasImportantModifier: x, baseClassName: b, maybePostfixModifierPosition: y } = r(p);
    if (m) {
      c = p + (c.length > 0 ? " " + c : c);
      continue;
    }
    let k = !!y, D = n(k ? b.substring(0, y) : b);
    if (!D) {
      if (!k) {
        c = p + (c.length > 0 ? " " + c : c);
        continue;
      }
      if (D = n(b), !D) {
        c = p + (c.length > 0 ? " " + c : c);
        continue;
      }
      k = false;
    }
    const U = h.length === 0 ? "" : h.length === 1 ? h[0] : o(h).join(":"), j = x ? U + El : U, M = j + D;
    if (i.indexOf(M) > -1) continue;
    i.push(M);
    const q = a(D, k);
    for (let F = 0; F < q.length; ++F) {
      const P = q[F];
      i.push(j + P);
    }
    c = p + (c.length > 0 ? " " + c : c);
  }
  return c;
}, Jb = (...t) => {
  let e = 0, r, n, a = "";
  for (; e < t.length; ) (r = t[e++]) && (n = Qv(r)) && (a && (a += " "), a += n);
  return a;
}, Qv = (t) => {
  if (typeof t == "string") return t;
  let e, r = "";
  for (let n = 0; n < t.length; n++) t[n] && (e = Qv(t[n])) && (r && (r += " "), r += e);
  return r;
}, Cl = (t, ...e) => {
  let r, n, a, o;
  const i = (c) => {
    const f = e.reduce((p, m) => m(p), t());
    return r = Kb(f), n = r.cache.get, a = r.cache.set, o = l, l(c);
  }, l = (c) => {
    const f = n(c);
    if (f) return f;
    const p = Zb(c, r);
    return a(c, p), p;
  };
  return o = i, (...c) => o(Jb(...c));
}, Qb = [], vr = (t) => {
  const e = (r) => r[t] || Qb;
  return e.isThemeGetter = true, e;
}, eg = /^\[(?:(\w[\w-]*):)?(.+)\]$/i, tg = /^\((?:(\w[\w-]*):)?(.+)\)$/i, ex = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/, tx = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, rx = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, nx = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, ax = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, sx = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, ia = (t) => ex.test(t), ht = (t) => !!t && !Number.isNaN(Number(t)), la = (t) => !!t && Number.isInteger(Number(t)), Ji = (t) => t.endsWith("%") && ht(t.slice(0, -1)), Bn = (t) => tx.test(t), rg = () => true, ox = (t) => rx.test(t) && !nx.test(t), Lc = () => false, ix = (t) => ax.test(t), lx = (t) => sx.test(t), cx = (t) => !Xe(t) && !Ze(t), dx = (t) => ya(t, sg, Lc), Xe = (t) => eg.test(t), Ta = (t) => ya(t, og, ox), Su = (t) => ya(t, _x, ht), ux = (t) => ya(t, lg, rg), fx = (t) => ya(t, ig, Lc), Tu = (t) => ya(t, ng, Lc), px = (t) => ya(t, ag, lx), Co = (t) => ya(t, cg, ix), Ze = (t) => tg.test(t), Es = (t) => Wa(t, og), vx = (t) => Wa(t, ig), Au = (t) => Wa(t, ng), gx = (t) => Wa(t, sg), mx = (t) => Wa(t, ag), Io = (t) => Wa(t, cg, true), hx = (t) => Wa(t, lg, true), ya = (t, e, r) => {
  const n = eg.exec(t);
  return n ? n[1] ? e(n[1]) : r(n[2]) : false;
}, Wa = (t, e, r = false) => {
  const n = tg.exec(t);
  return n ? n[1] ? e(n[1]) : r : false;
}, ng = (t) => t === "position" || t === "percentage", ag = (t) => t === "image" || t === "url", sg = (t) => t === "length" || t === "size" || t === "bg-size", og = (t) => t === "length", _x = (t) => t === "number", ig = (t) => t === "family-name", lg = (t) => t === "number" || t === "weight", cg = (t) => t === "shadow", Il = () => {
  const t = vr("color"), e = vr("font"), r = vr("text"), n = vr("font-weight"), a = vr("tracking"), o = vr("leading"), i = vr("breakpoint"), l = vr("container"), c = vr("spacing"), f = vr("radius"), p = vr("shadow"), m = vr("inset-shadow"), h = vr("text-shadow"), x = vr("drop-shadow"), b = vr("blur"), y = vr("perspective"), k = vr("aspect"), D = vr("ease"), U = vr("animate"), j = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], M = () => ["center", "top", "bottom", "left", "right", "top-left", "left-top", "top-right", "right-top", "bottom-right", "right-bottom", "bottom-left", "left-bottom"], q = () => [...M(), Ze, Xe], F = () => ["auto", "hidden", "clip", "visible", "scroll"], P = () => ["auto", "contain", "none"], C = () => [Ze, Xe, c], T = () => [ia, "full", "auto", ...C()], N = () => [la, "none", "subgrid", Ze, Xe], K = () => ["auto", { span: ["full", la, Ze, Xe] }, la, Ze, Xe], W = () => [la, "auto", Ze, Xe], A = () => ["auto", "min", "max", "fr", Ze, Xe], S = () => ["start", "end", "center", "between", "around", "evenly", "stretch", "baseline", "center-safe", "end-safe"], w = () => ["start", "end", "center", "stretch", "center-safe", "end-safe"], R = () => ["auto", ...C()], B = () => [ia, "auto", "full", "dvw", "dvh", "lvw", "lvh", "svw", "svh", "min", "max", "fit", ...C()], Z = () => [ia, "screen", "full", "dvw", "lvw", "svw", "min", "max", "fit", ...C()], X = () => [ia, "screen", "full", "lh", "dvh", "lvh", "svh", "min", "max", "fit", ...C()], H = () => [t, Ze, Xe], te = () => [...M(), Au, Tu, { position: [Ze, Xe] }], Y = () => ["no-repeat", { repeat: ["", "x", "y", "space", "round"] }], $ = () => ["auto", "cover", "contain", gx, dx, { size: [Ze, Xe] }], O = () => [Ji, Es, Ta], G = () => ["", "none", "full", f, Ze, Xe], J = () => ["", ht, Es, Ta], se = () => ["solid", "dashed", "dotted", "double"], ie = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], oe = () => [ht, Ji, Au, Tu], de = () => ["", "none", b, Ze, Xe], ve = () => ["none", ht, Ze, Xe], me = () => ["none", ht, Ze, Xe], ke = () => [ht, Ze, Xe], ye = () => [ia, "full", ...C()];
  return { cacheSize: 500, theme: { animate: ["spin", "ping", "pulse", "bounce"], aspect: ["video"], blur: [Bn], breakpoint: [Bn], color: [rg], container: [Bn], "drop-shadow": [Bn], ease: ["in", "out", "in-out"], font: [cx], "font-weight": ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black"], "inset-shadow": [Bn], leading: ["none", "tight", "snug", "normal", "relaxed", "loose"], perspective: ["dramatic", "near", "normal", "midrange", "distant", "none"], radius: [Bn], shadow: [Bn], spacing: ["px", ht], text: [Bn], "text-shadow": [Bn], tracking: ["tighter", "tight", "normal", "wide", "wider", "widest"] }, classGroups: { aspect: [{ aspect: ["auto", "square", ia, Xe, Ze, k] }], container: ["container"], columns: [{ columns: [ht, Xe, Ze, l] }], "break-after": [{ "break-after": j() }], "break-before": [{ "break-before": j() }], "break-inside": [{ "break-inside": ["auto", "avoid", "avoid-page", "avoid-column"] }], "box-decoration": [{ "box-decoration": ["slice", "clone"] }], box: [{ box: ["border", "content"] }], display: ["block", "inline-block", "inline", "flex", "inline-flex", "table", "inline-table", "table-caption", "table-cell", "table-column", "table-column-group", "table-footer-group", "table-header-group", "table-row-group", "table-row", "flow-root", "grid", "inline-grid", "contents", "list-item", "hidden"], sr: ["sr-only", "not-sr-only"], float: [{ float: ["right", "left", "none", "start", "end"] }], clear: [{ clear: ["left", "right", "both", "none", "start", "end"] }], isolation: ["isolate", "isolation-auto"], "object-fit": [{ object: ["contain", "cover", "fill", "none", "scale-down"] }], "object-position": [{ object: q() }], overflow: [{ overflow: F() }], "overflow-x": [{ "overflow-x": F() }], "overflow-y": [{ "overflow-y": F() }], overscroll: [{ overscroll: P() }], "overscroll-x": [{ "overscroll-x": P() }], "overscroll-y": [{ "overscroll-y": P() }], position: ["static", "fixed", "absolute", "relative", "sticky"], inset: [{ inset: T() }], "inset-x": [{ "inset-x": T() }], "inset-y": [{ "inset-y": T() }], start: [{ "inset-s": T(), start: T() }], end: [{ "inset-e": T(), end: T() }], "inset-bs": [{ "inset-bs": T() }], "inset-be": [{ "inset-be": T() }], top: [{ top: T() }], right: [{ right: T() }], bottom: [{ bottom: T() }], left: [{ left: T() }], visibility: ["visible", "invisible", "collapse"], z: [{ z: [la, "auto", Ze, Xe] }], basis: [{ basis: [ia, "full", "auto", l, ...C()] }], "flex-direction": [{ flex: ["row", "row-reverse", "col", "col-reverse"] }], "flex-wrap": [{ flex: ["nowrap", "wrap", "wrap-reverse"] }], flex: [{ flex: [ht, ia, "auto", "initial", "none", Xe] }], grow: [{ grow: ["", ht, Ze, Xe] }], shrink: [{ shrink: ["", ht, Ze, Xe] }], order: [{ order: [la, "first", "last", "none", Ze, Xe] }], "grid-cols": [{ "grid-cols": N() }], "col-start-end": [{ col: K() }], "col-start": [{ "col-start": W() }], "col-end": [{ "col-end": W() }], "grid-rows": [{ "grid-rows": N() }], "row-start-end": [{ row: K() }], "row-start": [{ "row-start": W() }], "row-end": [{ "row-end": W() }], "grid-flow": [{ "grid-flow": ["row", "col", "dense", "row-dense", "col-dense"] }], "auto-cols": [{ "auto-cols": A() }], "auto-rows": [{ "auto-rows": A() }], gap: [{ gap: C() }], "gap-x": [{ "gap-x": C() }], "gap-y": [{ "gap-y": C() }], "justify-content": [{ justify: [...S(), "normal"] }], "justify-items": [{ "justify-items": [...w(), "normal"] }], "justify-self": [{ "justify-self": ["auto", ...w()] }], "align-content": [{ content: ["normal", ...S()] }], "align-items": [{ items: [...w(), { baseline: ["", "last"] }] }], "align-self": [{ self: ["auto", ...w(), { baseline: ["", "last"] }] }], "place-content": [{ "place-content": S() }], "place-items": [{ "place-items": [...w(), "baseline"] }], "place-self": [{ "place-self": ["auto", ...w()] }], p: [{ p: C() }], px: [{ px: C() }], py: [{ py: C() }], ps: [{ ps: C() }], pe: [{ pe: C() }], pbs: [{ pbs: C() }], pbe: [{ pbe: C() }], pt: [{ pt: C() }], pr: [{ pr: C() }], pb: [{ pb: C() }], pl: [{ pl: C() }], m: [{ m: R() }], mx: [{ mx: R() }], my: [{ my: R() }], ms: [{ ms: R() }], me: [{ me: R() }], mbs: [{ mbs: R() }], mbe: [{ mbe: R() }], mt: [{ mt: R() }], mr: [{ mr: R() }], mb: [{ mb: R() }], ml: [{ ml: R() }], "space-x": [{ "space-x": C() }], "space-x-reverse": ["space-x-reverse"], "space-y": [{ "space-y": C() }], "space-y-reverse": ["space-y-reverse"], size: [{ size: B() }], "inline-size": [{ inline: ["auto", ...Z()] }], "min-inline-size": [{ "min-inline": ["auto", ...Z()] }], "max-inline-size": [{ "max-inline": ["none", ...Z()] }], "block-size": [{ block: ["auto", ...X()] }], "min-block-size": [{ "min-block": ["auto", ...X()] }], "max-block-size": [{ "max-block": ["none", ...X()] }], w: [{ w: [l, "screen", ...B()] }], "min-w": [{ "min-w": [l, "screen", "none", ...B()] }], "max-w": [{ "max-w": [l, "screen", "none", "prose", { screen: [i] }, ...B()] }], h: [{ h: ["screen", "lh", ...B()] }], "min-h": [{ "min-h": ["screen", "lh", "none", ...B()] }], "max-h": [{ "max-h": ["screen", "lh", ...B()] }], "font-size": [{ text: ["base", r, Es, Ta] }], "font-smoothing": ["antialiased", "subpixel-antialiased"], "font-style": ["italic", "not-italic"], "font-weight": [{ font: [n, hx, ux] }], "font-stretch": [{ "font-stretch": ["ultra-condensed", "extra-condensed", "condensed", "semi-condensed", "normal", "semi-expanded", "expanded", "extra-expanded", "ultra-expanded", Ji, Xe] }], "font-family": [{ font: [vx, fx, e] }], "font-features": [{ "font-features": [Xe] }], "fvn-normal": ["normal-nums"], "fvn-ordinal": ["ordinal"], "fvn-slashed-zero": ["slashed-zero"], "fvn-figure": ["lining-nums", "oldstyle-nums"], "fvn-spacing": ["proportional-nums", "tabular-nums"], "fvn-fraction": ["diagonal-fractions", "stacked-fractions"], tracking: [{ tracking: [a, Ze, Xe] }], "line-clamp": [{ "line-clamp": [ht, "none", Ze, Su] }], leading: [{ leading: [o, ...C()] }], "list-image": [{ "list-image": ["none", Ze, Xe] }], "list-style-position": [{ list: ["inside", "outside"] }], "list-style-type": [{ list: ["disc", "decimal", "none", Ze, Xe] }], "text-alignment": [{ text: ["left", "center", "right", "justify", "start", "end"] }], "placeholder-color": [{ placeholder: H() }], "text-color": [{ text: H() }], "text-decoration": ["underline", "overline", "line-through", "no-underline"], "text-decoration-style": [{ decoration: [...se(), "wavy"] }], "text-decoration-thickness": [{ decoration: [ht, "from-font", "auto", Ze, Ta] }], "text-decoration-color": [{ decoration: H() }], "underline-offset": [{ "underline-offset": [ht, "auto", Ze, Xe] }], "text-transform": ["uppercase", "lowercase", "capitalize", "normal-case"], "text-overflow": ["truncate", "text-ellipsis", "text-clip"], "text-wrap": [{ text: ["wrap", "nowrap", "balance", "pretty"] }], indent: [{ indent: C() }], "vertical-align": [{ align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", Ze, Xe] }], whitespace: [{ whitespace: ["normal", "nowrap", "pre", "pre-line", "pre-wrap", "break-spaces"] }], break: [{ break: ["normal", "words", "all", "keep"] }], wrap: [{ wrap: ["break-word", "anywhere", "normal"] }], hyphens: [{ hyphens: ["none", "manual", "auto"] }], content: [{ content: ["none", Ze, Xe] }], "bg-attachment": [{ bg: ["fixed", "local", "scroll"] }], "bg-clip": [{ "bg-clip": ["border", "padding", "content", "text"] }], "bg-origin": [{ "bg-origin": ["border", "padding", "content"] }], "bg-position": [{ bg: te() }], "bg-repeat": [{ bg: Y() }], "bg-size": [{ bg: $() }], "bg-image": [{ bg: ["none", { linear: [{ to: ["t", "tr", "r", "br", "b", "bl", "l", "tl"] }, la, Ze, Xe], radial: ["", Ze, Xe], conic: [la, Ze, Xe] }, mx, px] }], "bg-color": [{ bg: H() }], "gradient-from-pos": [{ from: O() }], "gradient-via-pos": [{ via: O() }], "gradient-to-pos": [{ to: O() }], "gradient-from": [{ from: H() }], "gradient-via": [{ via: H() }], "gradient-to": [{ to: H() }], rounded: [{ rounded: G() }], "rounded-s": [{ "rounded-s": G() }], "rounded-e": [{ "rounded-e": G() }], "rounded-t": [{ "rounded-t": G() }], "rounded-r": [{ "rounded-r": G() }], "rounded-b": [{ "rounded-b": G() }], "rounded-l": [{ "rounded-l": G() }], "rounded-ss": [{ "rounded-ss": G() }], "rounded-se": [{ "rounded-se": G() }], "rounded-ee": [{ "rounded-ee": G() }], "rounded-es": [{ "rounded-es": G() }], "rounded-tl": [{ "rounded-tl": G() }], "rounded-tr": [{ "rounded-tr": G() }], "rounded-br": [{ "rounded-br": G() }], "rounded-bl": [{ "rounded-bl": G() }], "border-w": [{ border: J() }], "border-w-x": [{ "border-x": J() }], "border-w-y": [{ "border-y": J() }], "border-w-s": [{ "border-s": J() }], "border-w-e": [{ "border-e": J() }], "border-w-bs": [{ "border-bs": J() }], "border-w-be": [{ "border-be": J() }], "border-w-t": [{ "border-t": J() }], "border-w-r": [{ "border-r": J() }], "border-w-b": [{ "border-b": J() }], "border-w-l": [{ "border-l": J() }], "divide-x": [{ "divide-x": J() }], "divide-x-reverse": ["divide-x-reverse"], "divide-y": [{ "divide-y": J() }], "divide-y-reverse": ["divide-y-reverse"], "border-style": [{ border: [...se(), "hidden", "none"] }], "divide-style": [{ divide: [...se(), "hidden", "none"] }], "border-color": [{ border: H() }], "border-color-x": [{ "border-x": H() }], "border-color-y": [{ "border-y": H() }], "border-color-s": [{ "border-s": H() }], "border-color-e": [{ "border-e": H() }], "border-color-bs": [{ "border-bs": H() }], "border-color-be": [{ "border-be": H() }], "border-color-t": [{ "border-t": H() }], "border-color-r": [{ "border-r": H() }], "border-color-b": [{ "border-b": H() }], "border-color-l": [{ "border-l": H() }], "divide-color": [{ divide: H() }], "outline-style": [{ outline: [...se(), "none", "hidden"] }], "outline-offset": [{ "outline-offset": [ht, Ze, Xe] }], "outline-w": [{ outline: ["", ht, Es, Ta] }], "outline-color": [{ outline: H() }], shadow: [{ shadow: ["", "none", p, Io, Co] }], "shadow-color": [{ shadow: H() }], "inset-shadow": [{ "inset-shadow": ["none", m, Io, Co] }], "inset-shadow-color": [{ "inset-shadow": H() }], "ring-w": [{ ring: J() }], "ring-w-inset": ["ring-inset"], "ring-color": [{ ring: H() }], "ring-offset-w": [{ "ring-offset": [ht, Ta] }], "ring-offset-color": [{ "ring-offset": H() }], "inset-ring-w": [{ "inset-ring": J() }], "inset-ring-color": [{ "inset-ring": H() }], "text-shadow": [{ "text-shadow": ["none", h, Io, Co] }], "text-shadow-color": [{ "text-shadow": H() }], opacity: [{ opacity: [ht, Ze, Xe] }], "mix-blend": [{ "mix-blend": [...ie(), "plus-darker", "plus-lighter"] }], "bg-blend": [{ "bg-blend": ie() }], "mask-clip": [{ "mask-clip": ["border", "padding", "content", "fill", "stroke", "view"] }, "mask-no-clip"], "mask-composite": [{ mask: ["add", "subtract", "intersect", "exclude"] }], "mask-image-linear-pos": [{ "mask-linear": [ht] }], "mask-image-linear-from-pos": [{ "mask-linear-from": oe() }], "mask-image-linear-to-pos": [{ "mask-linear-to": oe() }], "mask-image-linear-from-color": [{ "mask-linear-from": H() }], "mask-image-linear-to-color": [{ "mask-linear-to": H() }], "mask-image-t-from-pos": [{ "mask-t-from": oe() }], "mask-image-t-to-pos": [{ "mask-t-to": oe() }], "mask-image-t-from-color": [{ "mask-t-from": H() }], "mask-image-t-to-color": [{ "mask-t-to": H() }], "mask-image-r-from-pos": [{ "mask-r-from": oe() }], "mask-image-r-to-pos": [{ "mask-r-to": oe() }], "mask-image-r-from-color": [{ "mask-r-from": H() }], "mask-image-r-to-color": [{ "mask-r-to": H() }], "mask-image-b-from-pos": [{ "mask-b-from": oe() }], "mask-image-b-to-pos": [{ "mask-b-to": oe() }], "mask-image-b-from-color": [{ "mask-b-from": H() }], "mask-image-b-to-color": [{ "mask-b-to": H() }], "mask-image-l-from-pos": [{ "mask-l-from": oe() }], "mask-image-l-to-pos": [{ "mask-l-to": oe() }], "mask-image-l-from-color": [{ "mask-l-from": H() }], "mask-image-l-to-color": [{ "mask-l-to": H() }], "mask-image-x-from-pos": [{ "mask-x-from": oe() }], "mask-image-x-to-pos": [{ "mask-x-to": oe() }], "mask-image-x-from-color": [{ "mask-x-from": H() }], "mask-image-x-to-color": [{ "mask-x-to": H() }], "mask-image-y-from-pos": [{ "mask-y-from": oe() }], "mask-image-y-to-pos": [{ "mask-y-to": oe() }], "mask-image-y-from-color": [{ "mask-y-from": H() }], "mask-image-y-to-color": [{ "mask-y-to": H() }], "mask-image-radial": [{ "mask-radial": [Ze, Xe] }], "mask-image-radial-from-pos": [{ "mask-radial-from": oe() }], "mask-image-radial-to-pos": [{ "mask-radial-to": oe() }], "mask-image-radial-from-color": [{ "mask-radial-from": H() }], "mask-image-radial-to-color": [{ "mask-radial-to": H() }], "mask-image-radial-shape": [{ "mask-radial": ["circle", "ellipse"] }], "mask-image-radial-size": [{ "mask-radial": [{ closest: ["side", "corner"], farthest: ["side", "corner"] }] }], "mask-image-radial-pos": [{ "mask-radial-at": M() }], "mask-image-conic-pos": [{ "mask-conic": [ht] }], "mask-image-conic-from-pos": [{ "mask-conic-from": oe() }], "mask-image-conic-to-pos": [{ "mask-conic-to": oe() }], "mask-image-conic-from-color": [{ "mask-conic-from": H() }], "mask-image-conic-to-color": [{ "mask-conic-to": H() }], "mask-mode": [{ mask: ["alpha", "luminance", "match"] }], "mask-origin": [{ "mask-origin": ["border", "padding", "content", "fill", "stroke", "view"] }], "mask-position": [{ mask: te() }], "mask-repeat": [{ mask: Y() }], "mask-size": [{ mask: $() }], "mask-type": [{ "mask-type": ["alpha", "luminance"] }], "mask-image": [{ mask: ["none", Ze, Xe] }], filter: [{ filter: ["", "none", Ze, Xe] }], blur: [{ blur: de() }], brightness: [{ brightness: [ht, Ze, Xe] }], contrast: [{ contrast: [ht, Ze, Xe] }], "drop-shadow": [{ "drop-shadow": ["", "none", x, Io, Co] }], "drop-shadow-color": [{ "drop-shadow": H() }], grayscale: [{ grayscale: ["", ht, Ze, Xe] }], "hue-rotate": [{ "hue-rotate": [ht, Ze, Xe] }], invert: [{ invert: ["", ht, Ze, Xe] }], saturate: [{ saturate: [ht, Ze, Xe] }], sepia: [{ sepia: ["", ht, Ze, Xe] }], "backdrop-filter": [{ "backdrop-filter": ["", "none", Ze, Xe] }], "backdrop-blur": [{ "backdrop-blur": de() }], "backdrop-brightness": [{ "backdrop-brightness": [ht, Ze, Xe] }], "backdrop-contrast": [{ "backdrop-contrast": [ht, Ze, Xe] }], "backdrop-grayscale": [{ "backdrop-grayscale": ["", ht, Ze, Xe] }], "backdrop-hue-rotate": [{ "backdrop-hue-rotate": [ht, Ze, Xe] }], "backdrop-invert": [{ "backdrop-invert": ["", ht, Ze, Xe] }], "backdrop-opacity": [{ "backdrop-opacity": [ht, Ze, Xe] }], "backdrop-saturate": [{ "backdrop-saturate": [ht, Ze, Xe] }], "backdrop-sepia": [{ "backdrop-sepia": ["", ht, Ze, Xe] }], "border-collapse": [{ border: ["collapse", "separate"] }], "border-spacing": [{ "border-spacing": C() }], "border-spacing-x": [{ "border-spacing-x": C() }], "border-spacing-y": [{ "border-spacing-y": C() }], "table-layout": [{ table: ["auto", "fixed"] }], caption: [{ caption: ["top", "bottom"] }], transition: [{ transition: ["", "all", "colors", "opacity", "shadow", "transform", "none", Ze, Xe] }], "transition-behavior": [{ transition: ["normal", "discrete"] }], duration: [{ duration: [ht, "initial", Ze, Xe] }], ease: [{ ease: ["linear", "initial", D, Ze, Xe] }], delay: [{ delay: [ht, Ze, Xe] }], animate: [{ animate: ["none", U, Ze, Xe] }], backface: [{ backface: ["hidden", "visible"] }], perspective: [{ perspective: [y, Ze, Xe] }], "perspective-origin": [{ "perspective-origin": q() }], rotate: [{ rotate: ve() }], "rotate-x": [{ "rotate-x": ve() }], "rotate-y": [{ "rotate-y": ve() }], "rotate-z": [{ "rotate-z": ve() }], scale: [{ scale: me() }], "scale-x": [{ "scale-x": me() }], "scale-y": [{ "scale-y": me() }], "scale-z": [{ "scale-z": me() }], "scale-3d": ["scale-3d"], skew: [{ skew: ke() }], "skew-x": [{ "skew-x": ke() }], "skew-y": [{ "skew-y": ke() }], transform: [{ transform: [Ze, Xe, "", "none", "gpu", "cpu"] }], "transform-origin": [{ origin: q() }], "transform-style": [{ transform: ["3d", "flat"] }], translate: [{ translate: ye() }], "translate-x": [{ "translate-x": ye() }], "translate-y": [{ "translate-y": ye() }], "translate-z": [{ "translate-z": ye() }], "translate-none": ["translate-none"], accent: [{ accent: H() }], appearance: [{ appearance: ["none", "auto"] }], "caret-color": [{ caret: H() }], "color-scheme": [{ scheme: ["normal", "dark", "light", "light-dark", "only-dark", "only-light"] }], cursor: [{ cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", Ze, Xe] }], "field-sizing": [{ "field-sizing": ["fixed", "content"] }], "pointer-events": [{ "pointer-events": ["auto", "none"] }], resize: [{ resize: ["none", "", "y", "x"] }], "scroll-behavior": [{ scroll: ["auto", "smooth"] }], "scroll-m": [{ "scroll-m": C() }], "scroll-mx": [{ "scroll-mx": C() }], "scroll-my": [{ "scroll-my": C() }], "scroll-ms": [{ "scroll-ms": C() }], "scroll-me": [{ "scroll-me": C() }], "scroll-mbs": [{ "scroll-mbs": C() }], "scroll-mbe": [{ "scroll-mbe": C() }], "scroll-mt": [{ "scroll-mt": C() }], "scroll-mr": [{ "scroll-mr": C() }], "scroll-mb": [{ "scroll-mb": C() }], "scroll-ml": [{ "scroll-ml": C() }], "scroll-p": [{ "scroll-p": C() }], "scroll-px": [{ "scroll-px": C() }], "scroll-py": [{ "scroll-py": C() }], "scroll-ps": [{ "scroll-ps": C() }], "scroll-pe": [{ "scroll-pe": C() }], "scroll-pbs": [{ "scroll-pbs": C() }], "scroll-pbe": [{ "scroll-pbe": C() }], "scroll-pt": [{ "scroll-pt": C() }], "scroll-pr": [{ "scroll-pr": C() }], "scroll-pb": [{ "scroll-pb": C() }], "scroll-pl": [{ "scroll-pl": C() }], "snap-align": [{ snap: ["start", "end", "center", "align-none"] }], "snap-stop": [{ snap: ["normal", "always"] }], "snap-type": [{ snap: ["none", "x", "y", "both"] }], "snap-strictness": [{ snap: ["mandatory", "proximity"] }], touch: [{ touch: ["auto", "none", "manipulation"] }], "touch-x": [{ "touch-pan": ["x", "left", "right"] }], "touch-y": [{ "touch-pan": ["y", "up", "down"] }], "touch-pz": ["touch-pinch-zoom"], select: [{ select: ["none", "text", "all", "auto"] }], "will-change": [{ "will-change": ["auto", "scroll", "contents", "transform", Ze, Xe] }], fill: [{ fill: ["none", ...H()] }], "stroke-w": [{ stroke: [ht, Es, Ta, Su] }], stroke: [{ stroke: ["none", ...H()] }], "forced-color-adjust": [{ "forced-color-adjust": ["auto", "none"] }] }, conflictingClassGroups: { overflow: ["overflow-x", "overflow-y"], overscroll: ["overscroll-x", "overscroll-y"], inset: ["inset-x", "inset-y", "inset-bs", "inset-be", "start", "end", "top", "right", "bottom", "left"], "inset-x": ["right", "left"], "inset-y": ["top", "bottom"], flex: ["basis", "grow", "shrink"], gap: ["gap-x", "gap-y"], p: ["px", "py", "ps", "pe", "pbs", "pbe", "pt", "pr", "pb", "pl"], px: ["pr", "pl"], py: ["pt", "pb"], m: ["mx", "my", "ms", "me", "mbs", "mbe", "mt", "mr", "mb", "ml"], mx: ["mr", "ml"], my: ["mt", "mb"], size: ["w", "h"], "font-size": ["leading"], "fvn-normal": ["fvn-ordinal", "fvn-slashed-zero", "fvn-figure", "fvn-spacing", "fvn-fraction"], "fvn-ordinal": ["fvn-normal"], "fvn-slashed-zero": ["fvn-normal"], "fvn-figure": ["fvn-normal"], "fvn-spacing": ["fvn-normal"], "fvn-fraction": ["fvn-normal"], "line-clamp": ["display", "overflow"], rounded: ["rounded-s", "rounded-e", "rounded-t", "rounded-r", "rounded-b", "rounded-l", "rounded-ss", "rounded-se", "rounded-ee", "rounded-es", "rounded-tl", "rounded-tr", "rounded-br", "rounded-bl"], "rounded-s": ["rounded-ss", "rounded-es"], "rounded-e": ["rounded-se", "rounded-ee"], "rounded-t": ["rounded-tl", "rounded-tr"], "rounded-r": ["rounded-tr", "rounded-br"], "rounded-b": ["rounded-br", "rounded-bl"], "rounded-l": ["rounded-tl", "rounded-bl"], "border-spacing": ["border-spacing-x", "border-spacing-y"], "border-w": ["border-w-x", "border-w-y", "border-w-s", "border-w-e", "border-w-bs", "border-w-be", "border-w-t", "border-w-r", "border-w-b", "border-w-l"], "border-w-x": ["border-w-r", "border-w-l"], "border-w-y": ["border-w-t", "border-w-b"], "border-color": ["border-color-x", "border-color-y", "border-color-s", "border-color-e", "border-color-bs", "border-color-be", "border-color-t", "border-color-r", "border-color-b", "border-color-l"], "border-color-x": ["border-color-r", "border-color-l"], "border-color-y": ["border-color-t", "border-color-b"], translate: ["translate-x", "translate-y", "translate-none"], "translate-none": ["translate", "translate-x", "translate-y", "translate-z"], "scroll-m": ["scroll-mx", "scroll-my", "scroll-ms", "scroll-me", "scroll-mbs", "scroll-mbe", "scroll-mt", "scroll-mr", "scroll-mb", "scroll-ml"], "scroll-mx": ["scroll-mr", "scroll-ml"], "scroll-my": ["scroll-mt", "scroll-mb"], "scroll-p": ["scroll-px", "scroll-py", "scroll-ps", "scroll-pe", "scroll-pbs", "scroll-pbe", "scroll-pt", "scroll-pr", "scroll-pb", "scroll-pl"], "scroll-px": ["scroll-pr", "scroll-pl"], "scroll-py": ["scroll-pt", "scroll-pb"], touch: ["touch-x", "touch-y", "touch-pz"], "touch-x": ["touch"], "touch-y": ["touch"], "touch-pz": ["touch"] }, conflictingClassGroupModifiers: { "font-size": ["leading"] }, orderSensitiveModifiers: ["*", "**", "after", "backdrop", "before", "details-content", "file", "first-letter", "first-line", "marker", "placeholder", "selection"] };
}, bx = (t, { cacheSize: e, prefix: r, experimentalParseClassName: n, extend: a = {}, override: o = {} }) => (Fs(t, "cacheSize", e), Fs(t, "prefix", r), Fs(t, "experimentalParseClassName", n), Po(t.theme, o.theme), Po(t.classGroups, o.classGroups), Po(t.conflictingClassGroups, o.conflictingClassGroups), Po(t.conflictingClassGroupModifiers, o.conflictingClassGroupModifiers), Fs(t, "orderSensitiveModifiers", o.orderSensitiveModifiers), $o(t.theme, a.theme), $o(t.classGroups, a.classGroups), $o(t.conflictingClassGroups, a.conflictingClassGroups), $o(t.conflictingClassGroupModifiers, a.conflictingClassGroupModifiers), dg(t, a, "orderSensitiveModifiers"), t), Fs = (t, e, r) => {
  r !== void 0 && (t[e] = r);
}, Po = (t, e) => {
  if (e) for (const r in e) Fs(t, r, e[r]);
}, $o = (t, e) => {
  if (e) for (const r in e) dg(t, e, r);
}, dg = (t, e, r) => {
  const n = e[r];
  n !== void 0 && (t[r] = t[r] ? t[r].concat(n) : n);
}, xx = (t, ...e) => typeof t == "function" ? Cl(Il, t, ...e) : Cl(() => bx(Il(), t), ...e), ug = Cl(Il);
function Je(...t) {
  return ug(Ws(t));
}
rh();
/**
* @license lucide-svelte v0.575.0 - ISC
*
* ISC License
* 
* Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2026 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2026.
* 
* Permission to use, copy, modify, and/or distribute this software for any
* purpose with or without fee is hereby granted, provided that the above
* copyright notice and this permission notice appear in all copies.
* 
* THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
* WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
* MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
* ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
* WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
* ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
* OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
* 
* ---
* 
* The MIT License (MIT) (for portions derived from Feather)
* 
* Copyright (c) 2013-2026 Cole Bemis
* 
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
* 
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
* 
*/
const yx = { xmlns: "http://www.w3.org/2000/svg", width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": 2, "stroke-linecap": "round", "stroke-linejoin": "round" };
/**
* @license lucide-svelte v0.575.0 - ISC
*
* ISC License
* 
* Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2026 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2026.
* 
* Permission to use, copy, modify, and/or distribute this software for any
* purpose with or without fee is hereby granted, provided that the above
* copyright notice and this permission notice appear in all copies.
* 
* THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
* WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
* MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
* ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
* WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
* ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
* OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
* 
* ---
* 
* The MIT License (MIT) (for portions derived from Feather)
* 
* Copyright (c) 2013-2026 Cole Bemis
* 
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
* 
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
* 
*/
const wx = (t) => {
  for (const e in t) if (e.startsWith("aria-") || e === "role" || e === "title") return true;
  return false;
};
/**
* @license lucide-svelte v0.575.0 - ISC
*
* ISC License
* 
* Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2026 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2026.
* 
* Permission to use, copy, modify, and/or distribute this software for any
* purpose with or without fee is hereby granted, provided that the above
* copyright notice and this permission notice appear in all copies.
* 
* THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
* WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
* MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
* ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
* WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
* ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
* OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
* 
* ---
* 
* The MIT License (MIT) (for portions derived from Feather)
* 
* Copyright (c) 2013-2026 Cole Bemis
* 
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
* 
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
* 
*/
const Eu = (...t) => t.filter((e, r, n) => !!e && e.trim() !== "" && n.indexOf(e) === r).join(" ").trim();
var kx = dn("<svg><!><!></svg>");
function Dt(t, e) {
  const r = $t(e, ["children", "$$slots", "$$events", "$$legacy"]), n = $t(r, ["name", "color", "size", "strokeWidth", "absoluteStrokeWidth", "iconNode"]);
  De(e, false);
  let a = ae(e, "name", 8, void 0), o = ae(e, "color", 8, "currentColor"), i = ae(e, "size", 8, 24), l = ae(e, "strokeWidth", 8, 2), c = ae(e, "absoluteStrokeWidth", 8, false), f = ae(e, "iconNode", 24, () => []);
  _p();
  var p = kx();
  Gt(p, (x, b, y) => ({ ...yx, ...x, ...n, width: i(), height: i(), stroke: o(), "stroke-width": b, class: y }), [() => wx(n) ? void 0 : { "aria-hidden": "true" }, () => (Aa(c()), Aa(l()), Aa(i()), yr(() => c() ? Number(l()) * 24 / Number(i()) : l())), () => (Aa(Eu), Aa(a()), Aa(r), yr(() => Eu("lucide-icon", "lucide", a() ? `lucide-${a()}` : "", r.class)))]);
  var m = d(p);
  Ge(m, 1, f, Qe, (x, b) => {
    var y = V(() => gf(s(b), 2));
    let k = () => s(y)[0], D = () => s(y)[1];
    var U = Ae(), j = re(U);
    fp(j, k, true, (M, q) => {
      Gt(M, () => ({ ...D() }));
    }), u(x, U);
  });
  var h = v(m);
  zt(h, e, "default", {}), u(t, p), Le();
}
function fg(t, e) {
  const r = $t(e, ["children", "$$slots", "$$events", "$$legacy"]);
  /**
  * @license lucide-svelte v0.575.0 - ISC
  *
  * ISC License
  *
  * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2026 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2026.
  *
  * Permission to use, copy, modify, and/or distribute this software for any
  * purpose with or without fee is hereby granted, provided that the above
  * copyright notice and this permission notice appear in all copies.
  *
  * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
  * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
  * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
  * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
  * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
  * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
  * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
  *
  * ---
  *
  * The MIT License (MIT) (for portions derived from Feather)
  *
  * Copyright (c) 2013-2026 Cole Bemis
  *
  * Permission is hereby granted, free of charge, to any person obtaining a copy
  * of this software and associated documentation files (the "Software"), to deal
  * in the Software without restriction, including without limitation the rights
  * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  * copies of the Software, and to permit persons to whom the Software is
  * furnished to do so, subject to the following conditions:
  *
  * The above copyright notice and this permission notice shall be included in all
  * copies or substantial portions of the Software.
  *
  * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  * SOFTWARE.
  *
  */
  const n = [["path", { d: "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" }]];
  Dt(t, et({ name: "activity" }, () => r, { get iconNode() {
    return n;
  }, children: (a, o) => {
    var i = Ae(), l = re(i);
    zt(l, e, "default", {}), u(a, i);
  }, $$slots: { default: true } }));
}
function No(t, e) {
  const r = $t(e, ["children", "$$slots", "$$events", "$$legacy"]);
  /**
  * @license lucide-svelte v0.575.0 - ISC
  *
  * ISC License
  *
  * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2026 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2026.
  *
  * Permission to use, copy, modify, and/or distribute this software for any
  * purpose with or without fee is hereby granted, provided that the above
  * copyright notice and this permission notice appear in all copies.
  *
  * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
  * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
  * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
  * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
  * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
  * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
  * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
  *
  * ---
  *
  * The MIT License (MIT) (for portions derived from Feather)
  *
  * Copyright (c) 2013-2026 Cole Bemis
  *
  * Permission is hereby granted, free of charge, to any person obtaining a copy
  * of this software and associated documentation files (the "Software"), to deal
  * in the Software without restriction, including without limitation the rights
  * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  * copies of the Software, and to permit persons to whom the Software is
  * furnished to do so, subject to the following conditions:
  *
  * The above copyright notice and this permission notice shall be included in all
  * copies or substantial portions of the Software.
  *
  * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  * SOFTWARE.
  *
  */
  const n = [["path", { d: "m12 19-7-7 7-7" }], ["path", { d: "M19 12H5" }]];
  Dt(t, et({ name: "arrow-left" }, () => r, { get iconNode() {
    return n;
  }, children: (a, o) => {
    var i = Ae(), l = re(i);
    zt(l, e, "default", {}), u(a, i);
  }, $$slots: { default: true } }));
}
function Sx(t, e) {
  const r = $t(e, ["children", "$$slots", "$$events", "$$legacy"]);
  /**
  * @license lucide-svelte v0.575.0 - ISC
  *
  * ISC License
  *
  * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2026 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2026.
  *
  * Permission to use, copy, modify, and/or distribute this software for any
  * purpose with or without fee is hereby granted, provided that the above
  * copyright notice and this permission notice appear in all copies.
  *
  * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
  * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
  * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
  * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
  * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
  * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
  * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
  *
  * ---
  *
  * The MIT License (MIT) (for portions derived from Feather)
  *
  * Copyright (c) 2013-2026 Cole Bemis
  *
  * Permission is hereby granted, free of charge, to any person obtaining a copy
  * of this software and associated documentation files (the "Software"), to deal
  * in the Software without restriction, including without limitation the rights
  * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  * copies of the Software, and to permit persons to whom the Software is
  * furnished to do so, subject to the following conditions:
  *
  * The above copyright notice and this permission notice shall be included in all
  * copies or substantial portions of the Software.
  *
  * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  * SOFTWARE.
  *
  */
  const n = [["path", { d: "M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" }], ["path", { d: "M9 13a4.5 4.5 0 0 0 3-4" }], ["path", { d: "M6.003 5.125A3 3 0 0 0 6.401 6.5" }], ["path", { d: "M3.477 10.896a4 4 0 0 1 .585-.396" }], ["path", { d: "M6 18a4 4 0 0 1-1.967-.516" }], ["path", { d: "M12 13h4" }], ["path", { d: "M12 18h6a2 2 0 0 1 2 2v1" }], ["path", { d: "M12 8h8" }], ["path", { d: "M16 8V5a2 2 0 0 1 2-2" }], ["circle", { cx: "16", cy: "13", r: ".5" }], ["circle", { cx: "18", cy: "3", r: ".5" }], ["circle", { cx: "20", cy: "21", r: ".5" }], ["circle", { cx: "20", cy: "8", r: ".5" }]];
  Dt(t, et({ name: "brain-circuit" }, () => r, { get iconNode() {
    return n;
  }, children: (a, o) => {
    var i = Ae(), l = re(i);
    zt(l, e, "default", {}), u(a, i);
  }, $$slots: { default: true } }));
}
function pg(t, e) {
  const r = $t(e, ["children", "$$slots", "$$events", "$$legacy"]);
  /**
  * @license lucide-svelte v0.575.0 - ISC
  *
  * ISC License
  *
  * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2026 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2026.
  *
  * Permission to use, copy, modify, and/or distribute this software for any
  * purpose with or without fee is hereby granted, provided that the above
  * copyright notice and this permission notice appear in all copies.
  *
  * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
  * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
  * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
  * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
  * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
  * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
  * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
  *
  * ---
  *
  * The MIT License (MIT) (for portions derived from Feather)
  *
  * Copyright (c) 2013-2026 Cole Bemis
  *
  * Permission is hereby granted, free of charge, to any person obtaining a copy
  * of this software and associated documentation files (the "Software"), to deal
  * in the Software without restriction, including without limitation the rights
  * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  * copies of the Software, and to permit persons to whom the Software is
  * furnished to do so, subject to the following conditions:
  *
  * The above copyright notice and this permission notice shall be included in all
  * copies or substantial portions of the Software.
  *
  * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  * SOFTWARE.
  *
  */
  const n = [["path", { d: "m6 9 6 6 6-6" }]];
  Dt(t, et({ name: "chevron-down" }, () => r, { get iconNode() {
    return n;
  }, children: (a, o) => {
    var i = Ae(), l = re(i);
    zt(l, e, "default", {}), u(a, i);
  }, $$slots: { default: true } }));
}
function vg(t, e) {
  const r = $t(e, ["children", "$$slots", "$$events", "$$legacy"]);
  /**
  * @license lucide-svelte v0.575.0 - ISC
  *
  * ISC License
  *
  * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2026 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2026.
  *
  * Permission to use, copy, modify, and/or distribute this software for any
  * purpose with or without fee is hereby granted, provided that the above
  * copyright notice and this permission notice appear in all copies.
  *
  * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
  * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
  * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
  * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
  * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
  * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
  * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
  *
  * ---
  *
  * The MIT License (MIT) (for portions derived from Feather)
  *
  * Copyright (c) 2013-2026 Cole Bemis
  *
  * Permission is hereby granted, free of charge, to any person obtaining a copy
  * of this software and associated documentation files (the "Software"), to deal
  * in the Software without restriction, including without limitation the rights
  * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  * copies of the Software, and to permit persons to whom the Software is
  * furnished to do so, subject to the following conditions:
  *
  * The above copyright notice and this permission notice shall be included in all
  * copies or substantial portions of the Software.
  *
  * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  * SOFTWARE.
  *
  */
  const n = [["path", { d: "m9 18 6-6-6-6" }]];
  Dt(t, et({ name: "chevron-right" }, () => r, { get iconNode() {
    return n;
  }, children: (a, o) => {
    var i = Ae(), l = re(i);
    zt(l, e, "default", {}), u(a, i);
  }, $$slots: { default: true } }));
}
function gg(t, e) {
  const r = $t(e, ["children", "$$slots", "$$events", "$$legacy"]);
  /**
  * @license lucide-svelte v0.575.0 - ISC
  *
  * ISC License
  *
  * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2026 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2026.
  *
  * Permission to use, copy, modify, and/or distribute this software for any
  * purpose with or without fee is hereby granted, provided that the above
  * copyright notice and this permission notice appear in all copies.
  *
  * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
  * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
  * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
  * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
  * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
  * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
  * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
  *
  * ---
  *
  * The MIT License (MIT) (for portions derived from Feather)
  *
  * Copyright (c) 2013-2026 Cole Bemis
  *
  * Permission is hereby granted, free of charge, to any person obtaining a copy
  * of this software and associated documentation files (the "Software"), to deal
  * in the Software without restriction, including without limitation the rights
  * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  * copies of the Software, and to permit persons to whom the Software is
  * furnished to do so, subject to the following conditions:
  *
  * The above copyright notice and this permission notice shall be included in all
  * copies or substantial portions of the Software.
  *
  * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  * SOFTWARE.
  *
  */
  const n = [["circle", { cx: "12", cy: "12", r: "10" }], ["line", { x1: "12", x2: "12", y1: "8", y2: "12" }], ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16" }]];
  Dt(t, et({ name: "circle-alert" }, () => r, { get iconNode() {
    return n;
  }, children: (a, o) => {
    var i = Ae(), l = re(i);
    zt(l, e, "default", {}), u(a, i);
  }, $$slots: { default: true } }));
}
function Ks(t, e) {
  const r = $t(e, ["children", "$$slots", "$$events", "$$legacy"]);
  /**
  * @license lucide-svelte v0.575.0 - ISC
  *
  * ISC License
  *
  * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2026 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2026.
  *
  * Permission to use, copy, modify, and/or distribute this software for any
  * purpose with or without fee is hereby granted, provided that the above
  * copyright notice and this permission notice appear in all copies.
  *
  * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
  * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
  * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
  * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
  * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
  * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
  * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
  *
  * ---
  *
  * The MIT License (MIT) (for portions derived from Feather)
  *
  * Copyright (c) 2013-2026 Cole Bemis
  *
  * Permission is hereby granted, free of charge, to any person obtaining a copy
  * of this software and associated documentation files (the "Software"), to deal
  * in the Software without restriction, including without limitation the rights
  * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  * copies of the Software, and to permit persons to whom the Software is
  * furnished to do so, subject to the following conditions:
  *
  * The above copyright notice and this permission notice shall be included in all
  * copies or substantial portions of the Software.
  *
  * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  * SOFTWARE.
  *
  */
  const n = [["circle", { cx: "12", cy: "12", r: "10" }], ["path", { d: "m9 12 2 2 4-4" }]];
  Dt(t, et({ name: "circle-check" }, () => r, { get iconNode() {
    return n;
  }, children: (a, o) => {
    var i = Ae(), l = re(i);
    zt(l, e, "default", {}), u(a, i);
  }, $$slots: { default: true } }));
}
function ss(t, e) {
  const r = $t(e, ["children", "$$slots", "$$events", "$$legacy"]);
  /**
  * @license lucide-svelte v0.575.0 - ISC
  *
  * ISC License
  *
  * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2026 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2026.
  *
  * Permission to use, copy, modify, and/or distribute this software for any
  * purpose with or without fee is hereby granted, provided that the above
  * copyright notice and this permission notice appear in all copies.
  *
  * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
  * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
  * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
  * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
  * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
  * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
  * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
  *
  * ---
  *
  * The MIT License (MIT) (for portions derived from Feather)
  *
  * Copyright (c) 2013-2026 Cole Bemis
  *
  * Permission is hereby granted, free of charge, to any person obtaining a copy
  * of this software and associated documentation files (the "Software"), to deal
  * in the Software without restriction, including without limitation the rights
  * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  * copies of the Software, and to permit persons to whom the Software is
  * furnished to do so, subject to the following conditions:
  *
  * The above copyright notice and this permission notice shall be included in all
  * copies or substantial portions of the Software.
  *
  * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  * SOFTWARE.
  *
  */
  const n = [["path", { d: "M21.801 10A10 10 0 1 1 17 3.335" }], ["path", { d: "m9 11 3 3L22 4" }]];
  Dt(t, et({ name: "circle-check-big" }, () => r, { get iconNode() {
    return n;
  }, children: (a, o) => {
    var i = Ae(), l = re(i);
    zt(l, e, "default", {}), u(a, i);
  }, $$slots: { default: true } }));
}
function Tx(t, e) {
  const r = $t(e, ["children", "$$slots", "$$events", "$$legacy"]);
  /**
  * @license lucide-svelte v0.575.0 - ISC
  *
  * ISC License
  *
  * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2026 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2026.
  *
  * Permission to use, copy, modify, and/or distribute this software for any
  * purpose with or without fee is hereby granted, provided that the above
  * copyright notice and this permission notice appear in all copies.
  *
  * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
  * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
  * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
  * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
  * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
  * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
  * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
  *
  * ---
  *
  * The MIT License (MIT) (for portions derived from Feather)
  *
  * Copyright (c) 2013-2026 Cole Bemis
  *
  * Permission is hereby granted, free of charge, to any person obtaining a copy
  * of this software and associated documentation files (the "Software"), to deal
  * in the Software without restriction, including without limitation the rights
  * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  * copies of the Software, and to permit persons to whom the Software is
  * furnished to do so, subject to the following conditions:
  *
  * The above copyright notice and this permission notice shall be included in all
  * copies or substantial portions of the Software.
  *
  * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  * SOFTWARE.
  *
  */
  const n = [["circle", { cx: "12", cy: "12", r: "10" }], ["path", { d: "m15 9-6 6" }], ["path", { d: "m9 9 6 6" }]];
  Dt(t, et({ name: "circle-x" }, () => r, { get iconNode() {
    return n;
  }, children: (a, o) => {
    var i = Ae(), l = re(i);
    zt(l, e, "default", {}), u(a, i);
  }, $$slots: { default: true } }));
}
function Pl(t, e) {
  const r = $t(e, ["children", "$$slots", "$$events", "$$legacy"]);
  /**
  * @license lucide-svelte v0.575.0 - ISC
  *
  * ISC License
  *
  * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2026 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2026.
  *
  * Permission to use, copy, modify, and/or distribute this software for any
  * purpose with or without fee is hereby granted, provided that the above
  * copyright notice and this permission notice appear in all copies.
  *
  * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
  * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
  * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
  * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
  * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
  * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
  * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
  *
  * ---
  *
  * The MIT License (MIT) (for portions derived from Feather)
  *
  * Copyright (c) 2013-2026 Cole Bemis
  *
  * Permission is hereby granted, free of charge, to any person obtaining a copy
  * of this software and associated documentation files (the "Software"), to deal
  * in the Software without restriction, including without limitation the rights
  * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  * copies of the Software, and to permit persons to whom the Software is
  * furnished to do so, subject to the following conditions:
  *
  * The above copyright notice and this permission notice shall be included in all
  * copies or substantial portions of the Software.
  *
  * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  * SOFTWARE.
  *
  */
  const n = [["circle", { cx: "12", cy: "12", r: "10" }], ["path", { d: "M12 6v6l4 2" }]];
  Dt(t, et({ name: "clock" }, () => r, { get iconNode() {
    return n;
  }, children: (a, o) => {
    var i = Ae(), l = re(i);
    zt(l, e, "default", {}), u(a, i);
  }, $$slots: { default: true } }));
}
function Cu(t, e) {
  const r = $t(e, ["children", "$$slots", "$$events", "$$legacy"]);
  /**
  * @license lucide-svelte v0.575.0 - ISC
  *
  * ISC License
  *
  * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2026 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2026.
  *
  * Permission to use, copy, modify, and/or distribute this software for any
  * purpose with or without fee is hereby granted, provided that the above
  * copyright notice and this permission notice appear in all copies.
  *
  * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
  * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
  * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
  * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
  * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
  * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
  * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
  *
  * ---
  *
  * The MIT License (MIT) (for portions derived from Feather)
  *
  * Copyright (c) 2013-2026 Cole Bemis
  *
  * Permission is hereby granted, free of charge, to any person obtaining a copy
  * of this software and associated documentation files (the "Software"), to deal
  * in the Software without restriction, including without limitation the rights
  * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  * copies of the Software, and to permit persons to whom the Software is
  * furnished to do so, subject to the following conditions:
  *
  * The above copyright notice and this permission notice shall be included in all
  * copies or substantial portions of the Software.
  *
  * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  * SOFTWARE.
  *
  */
  const n = [["path", { d: "M12 20v2" }], ["path", { d: "M12 2v2" }], ["path", { d: "M17 20v2" }], ["path", { d: "M17 2v2" }], ["path", { d: "M2 12h2" }], ["path", { d: "M2 17h2" }], ["path", { d: "M2 7h2" }], ["path", { d: "M20 12h2" }], ["path", { d: "M20 17h2" }], ["path", { d: "M20 7h2" }], ["path", { d: "M7 20v2" }], ["path", { d: "M7 2v2" }], ["rect", { x: "4", y: "4", width: "16", height: "16", rx: "2" }], ["rect", { x: "8", y: "8", width: "8", height: "8", rx: "1" }]];
  Dt(t, et({ name: "cpu" }, () => r, { get iconNode() {
    return n;
  }, children: (a, o) => {
    var i = Ae(), l = re(i);
    zt(l, e, "default", {}), u(a, i);
  }, $$slots: { default: true } }));
}
function $l(t, e) {
  const r = $t(e, ["children", "$$slots", "$$events", "$$legacy"]);
  /**
  * @license lucide-svelte v0.575.0 - ISC
  *
  * ISC License
  *
  * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2026 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2026.
  *
  * Permission to use, copy, modify, and/or distribute this software for any
  * purpose with or without fee is hereby granted, provided that the above
  * copyright notice and this permission notice appear in all copies.
  *
  * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
  * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
  * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
  * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
  * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
  * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
  * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
  *
  * ---
  *
  * The MIT License (MIT) (for portions derived from Feather)
  *
  * Copyright (c) 2013-2026 Cole Bemis
  *
  * Permission is hereby granted, free of charge, to any person obtaining a copy
  * of this software and associated documentation files (the "Software"), to deal
  * in the Software without restriction, including without limitation the rights
  * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  * copies of the Software, and to permit persons to whom the Software is
  * furnished to do so, subject to the following conditions:
  *
  * The above copyright notice and this permission notice shall be included in all
  * copies or substantial portions of the Software.
  *
  * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  * SOFTWARE.
  *
  */
  const n = [["ellipse", { cx: "12", cy: "5", rx: "9", ry: "3" }], ["path", { d: "M3 5V19A9 3 0 0 0 21 19V5" }], ["path", { d: "M3 12A9 3 0 0 0 21 12" }]];
  Dt(t, et({ name: "database" }, () => r, { get iconNode() {
    return n;
  }, children: (a, o) => {
    var i = Ae(), l = re(i);
    zt(l, e, "default", {}), u(a, i);
  }, $$slots: { default: true } }));
}
function mg(t, e) {
  const r = $t(e, ["children", "$$slots", "$$events", "$$legacy"]);
  /**
  * @license lucide-svelte v0.575.0 - ISC
  *
  * ISC License
  *
  * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2026 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2026.
  *
  * Permission to use, copy, modify, and/or distribute this software for any
  * purpose with or without fee is hereby granted, provided that the above
  * copyright notice and this permission notice appear in all copies.
  *
  * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
  * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
  * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
  * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
  * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
  * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
  * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
  *
  * ---
  *
  * The MIT License (MIT) (for portions derived from Feather)
  *
  * Copyright (c) 2013-2026 Cole Bemis
  *
  * Permission is hereby granted, free of charge, to any person obtaining a copy
  * of this software and associated documentation files (the "Software"), to deal
  * in the Software without restriction, including without limitation the rights
  * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  * copies of the Software, and to permit persons to whom the Software is
  * furnished to do so, subject to the following conditions:
  *
  * The above copyright notice and this permission notice shall be included in all
  * copies or substantial portions of the Software.
  *
  * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  * SOFTWARE.
  *
  */
  const n = [["path", { d: "M15 6a9 9 0 0 0-9 9V3" }], ["circle", { cx: "18", cy: "6", r: "3" }], ["circle", { cx: "6", cy: "18", r: "3" }]];
  Dt(t, et({ name: "git-branch" }, () => r, { get iconNode() {
    return n;
  }, children: (a, o) => {
    var i = Ae(), l = re(i);
    zt(l, e, "default", {}), u(a, i);
  }, $$slots: { default: true } }));
}
function Ax(t, e) {
  const r = $t(e, ["children", "$$slots", "$$events", "$$legacy"]);
  /**
  * @license lucide-svelte v0.575.0 - ISC
  *
  * ISC License
  *
  * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2026 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2026.
  *
  * Permission to use, copy, modify, and/or distribute this software for any
  * purpose with or without fee is hereby granted, provided that the above
  * copyright notice and this permission notice appear in all copies.
  *
  * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
  * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
  * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
  * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
  * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
  * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
  * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
  *
  * ---
  *
  * The MIT License (MIT) (for portions derived from Feather)
  *
  * Copyright (c) 2013-2026 Cole Bemis
  *
  * Permission is hereby granted, free of charge, to any person obtaining a copy
  * of this software and associated documentation files (the "Software"), to deal
  * in the Software without restriction, including without limitation the rights
  * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  * copies of the Software, and to permit persons to whom the Software is
  * furnished to do so, subject to the following conditions:
  *
  * The above copyright notice and this permission notice shall be included in all
  * copies or substantial portions of the Software.
  *
  * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  * SOFTWARE.
  *
  */
  const n = [["path", { d: "M10 16h.01" }], ["path", { d: "M2.212 11.577a2 2 0 0 0-.212.896V18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5.527a2 2 0 0 0-.212-.896L18.55 5.11A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" }], ["path", { d: "M21.946 12.013H2.054" }], ["path", { d: "M6 16h.01" }]];
  Dt(t, et({ name: "hard-drive" }, () => r, { get iconNode() {
    return n;
  }, children: (a, o) => {
    var i = Ae(), l = re(i);
    zt(l, e, "default", {}), u(a, i);
  }, $$slots: { default: true } }));
}
function Ex(t, e) {
  const r = $t(e, ["children", "$$slots", "$$events", "$$legacy"]);
  /**
  * @license lucide-svelte v0.575.0 - ISC
  *
  * ISC License
  *
  * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2026 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2026.
  *
  * Permission to use, copy, modify, and/or distribute this software for any
  * purpose with or without fee is hereby granted, provided that the above
  * copyright notice and this permission notice appear in all copies.
  *
  * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
  * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
  * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
  * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
  * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
  * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
  * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
  *
  * ---
  *
  * The MIT License (MIT) (for portions derived from Feather)
  *
  * Copyright (c) 2013-2026 Cole Bemis
  *
  * Permission is hereby granted, free of charge, to any person obtaining a copy
  * of this software and associated documentation files (the "Software"), to deal
  * in the Software without restriction, including without limitation the rights
  * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  * copies of the Software, and to permit persons to whom the Software is
  * furnished to do so, subject to the following conditions:
  *
  * The above copyright notice and this permission notice shall be included in all
  * copies or substantial portions of the Software.
  *
  * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  * SOFTWARE.
  *
  */
  const n = [["circle", { cx: "12", cy: "12", r: "10" }], ["path", { d: "M12 16v-4" }], ["path", { d: "M12 8h.01" }]];
  Dt(t, et({ name: "info" }, () => r, { get iconNode() {
    return n;
  }, children: (a, o) => {
    var i = Ae(), l = re(i);
    zt(l, e, "default", {}), u(a, i);
  }, $$slots: { default: true } }));
}
function uo(t, e) {
  const r = $t(e, ["children", "$$slots", "$$events", "$$legacy"]);
  /**
  * @license lucide-svelte v0.575.0 - ISC
  *
  * ISC License
  *
  * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2026 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2026.
  *
  * Permission to use, copy, modify, and/or distribute this software for any
  * purpose with or without fee is hereby granted, provided that the above
  * copyright notice and this permission notice appear in all copies.
  *
  * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
  * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
  * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
  * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
  * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
  * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
  * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
  *
  * ---
  *
  * The MIT License (MIT) (for portions derived from Feather)
  *
  * Copyright (c) 2013-2026 Cole Bemis
  *
  * Permission is hereby granted, free of charge, to any person obtaining a copy
  * of this software and associated documentation files (the "Software"), to deal
  * in the Software without restriction, including without limitation the rights
  * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  * copies of the Software, and to permit persons to whom the Software is
  * furnished to do so, subject to the following conditions:
  *
  * The above copyright notice and this permission notice shall be included in all
  * copies or substantial portions of the Software.
  *
  * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  * SOFTWARE.
  *
  */
  const n = [["path", { d: "M12 2v4" }], ["path", { d: "m16.2 7.8 2.9-2.9" }], ["path", { d: "M18 12h4" }], ["path", { d: "m16.2 16.2 2.9 2.9" }], ["path", { d: "M12 18v4" }], ["path", { d: "m4.9 19.1 2.9-2.9" }], ["path", { d: "M2 12h4" }], ["path", { d: "m4.9 4.9 2.9 2.9" }]];
  Dt(t, et({ name: "loader" }, () => r, { get iconNode() {
    return n;
  }, children: (a, o) => {
    var i = Ae(), l = re(i);
    zt(l, e, "default", {}), u(a, i);
  }, $$slots: { default: true } }));
}
function Iu(t, e) {
  const r = $t(e, ["children", "$$slots", "$$events", "$$legacy"]);
  /**
  * @license lucide-svelte v0.575.0 - ISC
  *
  * ISC License
  *
  * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2026 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2026.
  *
  * Permission to use, copy, modify, and/or distribute this software for any
  * purpose with or without fee is hereby granted, provided that the above
  * copyright notice and this permission notice appear in all copies.
  *
  * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
  * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
  * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
  * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
  * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
  * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
  * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
  *
  * ---
  *
  * The MIT License (MIT) (for portions derived from Feather)
  *
  * Copyright (c) 2013-2026 Cole Bemis
  *
  * Permission is hereby granted, free of charge, to any person obtaining a copy
  * of this software and associated documentation files (the "Software"), to deal
  * in the Software without restriction, including without limitation the rights
  * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  * copies of the Software, and to permit persons to whom the Software is
  * furnished to do so, subject to the following conditions:
  *
  * The above copyright notice and this permission notice shall be included in all
  * copies or substantial portions of the Software.
  *
  * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  * SOFTWARE.
  *
  */
  const n = [["path", { d: "m16 17 5-5-5-5" }], ["path", { d: "M21 12H9" }], ["path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" }]];
  Dt(t, et({ name: "log-out" }, () => r, { get iconNode() {
    return n;
  }, children: (a, o) => {
    var i = Ae(), l = re(i);
    zt(l, e, "default", {}), u(a, i);
  }, $$slots: { default: true } }));
}
function gs(t, e) {
  const r = $t(e, ["children", "$$slots", "$$events", "$$legacy"]);
  /**
  * @license lucide-svelte v0.575.0 - ISC
  *
  * ISC License
  *
  * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2026 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2026.
  *
  * Permission to use, copy, modify, and/or distribute this software for any
  * purpose with or without fee is hereby granted, provided that the above
  * copyright notice and this permission notice appear in all copies.
  *
  * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
  * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
  * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
  * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
  * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
  * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
  * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
  *
  * ---
  *
  * The MIT License (MIT) (for portions derived from Feather)
  *
  * Copyright (c) 2013-2026 Cole Bemis
  *
  * Permission is hereby granted, free of charge, to any person obtaining a copy
  * of this software and associated documentation files (the "Software"), to deal
  * in the Software without restriction, including without limitation the rights
  * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  * copies of the Software, and to permit persons to whom the Software is
  * furnished to do so, subject to the following conditions:
  *
  * The above copyright notice and this permission notice shall be included in all
  * copies or substantial portions of the Software.
  *
  * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  * SOFTWARE.
  *
  */
  const n = [["path", { d: "m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" }], ["rect", { x: "2", y: "4", width: "20", height: "16", rx: "2" }]];
  Dt(t, et({ name: "mail" }, () => r, { get iconNode() {
    return n;
  }, children: (a, o) => {
    var i = Ae(), l = re(i);
    zt(l, e, "default", {}), u(a, i);
  }, $$slots: { default: true } }));
}
function jc(t, e) {
  const r = $t(e, ["children", "$$slots", "$$events", "$$legacy"]);
  /**
  * @license lucide-svelte v0.575.0 - ISC
  *
  * ISC License
  *
  * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2026 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2026.
  *
  * Permission to use, copy, modify, and/or distribute this software for any
  * purpose with or without fee is hereby granted, provided that the above
  * copyright notice and this permission notice appear in all copies.
  *
  * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
  * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
  * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
  * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
  * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
  * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
  * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
  *
  * ---
  *
  * The MIT License (MIT) (for portions derived from Feather)
  *
  * Copyright (c) 2013-2026 Cole Bemis
  *
  * Permission is hereby granted, free of charge, to any person obtaining a copy
  * of this software and associated documentation files (the "Software"), to deal
  * in the Software without restriction, including without limitation the rights
  * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  * copies of the Software, and to permit persons to whom the Software is
  * furnished to do so, subject to the following conditions:
  *
  * The above copyright notice and this permission notice shall be included in all
  * copies or substantial portions of the Software.
  *
  * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  * SOFTWARE.
  *
  */
  const n = [["path", { d: "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" }]];
  Dt(t, et({ name: "play" }, () => r, { get iconNode() {
    return n;
  }, children: (a, o) => {
    var i = Ae(), l = re(i);
    zt(l, e, "default", {}), u(a, i);
  }, $$slots: { default: true } }));
}
function Cx(t, e) {
  const r = $t(e, ["children", "$$slots", "$$events", "$$legacy"]);
  /**
  * @license lucide-svelte v0.575.0 - ISC
  *
  * ISC License
  *
  * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2026 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2026.
  *
  * Permission to use, copy, modify, and/or distribute this software for any
  * purpose with or without fee is hereby granted, provided that the above
  * copyright notice and this permission notice appear in all copies.
  *
  * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
  * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
  * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
  * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
  * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
  * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
  * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
  *
  * ---
  *
  * The MIT License (MIT) (for portions derived from Feather)
  *
  * Copyright (c) 2013-2026 Cole Bemis
  *
  * Permission is hereby granted, free of charge, to any person obtaining a copy
  * of this software and associated documentation files (the "Software"), to deal
  * in the Software without restriction, including without limitation the rights
  * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  * copies of the Software, and to permit persons to whom the Software is
  * furnished to do so, subject to the following conditions:
  *
  * The above copyright notice and this permission notice shall be included in all
  * copies or substantial portions of the Software.
  *
  * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  * SOFTWARE.
  *
  */
  const n = [["path", { d: "M5 12h14" }], ["path", { d: "M12 5v14" }]];
  Dt(t, et({ name: "plus" }, () => r, { get iconNode() {
    return n;
  }, children: (a, o) => {
    var i = Ae(), l = re(i);
    zt(l, e, "default", {}), u(a, i);
  }, $$slots: { default: true } }));
}
function Ix(t, e) {
  const r = $t(e, ["children", "$$slots", "$$events", "$$legacy"]);
  /**
  * @license lucide-svelte v0.575.0 - ISC
  *
  * ISC License
  *
  * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2026 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2026.
  *
  * Permission to use, copy, modify, and/or distribute this software for any
  * purpose with or without fee is hereby granted, provided that the above
  * copyright notice and this permission notice appear in all copies.
  *
  * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
  * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
  * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
  * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
  * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
  * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
  * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
  *
  * ---
  *
  * The MIT License (MIT) (for portions derived from Feather)
  *
  * Copyright (c) 2013-2026 Cole Bemis
  *
  * Permission is hereby granted, free of charge, to any person obtaining a copy
  * of this software and associated documentation files (the "Software"), to deal
  * in the Software without restriction, including without limitation the rights
  * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  * copies of the Software, and to permit persons to whom the Software is
  * furnished to do so, subject to the following conditions:
  *
  * The above copyright notice and this permission notice shall be included in all
  * copies or substantial portions of the Software.
  *
  * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  * SOFTWARE.
  *
  */
  const n = [["path", { d: "M15.39 4.39a1 1 0 0 0 1.68-.474 2.5 2.5 0 1 1 3.014 3.015 1 1 0 0 0-.474 1.68l1.683 1.682a2.414 2.414 0 0 1 0 3.414L19.61 15.39a1 1 0 0 1-1.68-.474 2.5 2.5 0 1 0-3.014 3.015 1 1 0 0 1 .474 1.68l-1.683 1.682a2.414 2.414 0 0 1-3.414 0L8.61 19.61a1 1 0 0 0-1.68.474 2.5 2.5 0 1 1-3.014-3.015 1 1 0 0 0 .474-1.68l-1.683-1.682a2.414 2.414 0 0 1 0-3.414L4.39 8.61a1 1 0 0 1 1.68.474 2.5 2.5 0 1 0 3.014-3.015 1 1 0 0 1-.474-1.68l1.683-1.682a2.414 2.414 0 0 1 3.414 0z" }]];
  Dt(t, et({ name: "puzzle" }, () => r, { get iconNode() {
    return n;
  }, children: (a, o) => {
    var i = Ae(), l = re(i);
    zt(l, e, "default", {}), u(a, i);
  }, $$slots: { default: true } }));
}
function ms(t, e) {
  const r = $t(e, ["children", "$$slots", "$$events", "$$legacy"]);
  /**
  * @license lucide-svelte v0.575.0 - ISC
  *
  * ISC License
  *
  * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2026 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2026.
  *
  * Permission to use, copy, modify, and/or distribute this software for any
  * purpose with or without fee is hereby granted, provided that the above
  * copyright notice and this permission notice appear in all copies.
  *
  * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
  * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
  * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
  * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
  * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
  * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
  * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
  *
  * ---
  *
  * The MIT License (MIT) (for portions derived from Feather)
  *
  * Copyright (c) 2013-2026 Cole Bemis
  *
  * Permission is hereby granted, free of charge, to any person obtaining a copy
  * of this software and associated documentation files (the "Software"), to deal
  * in the Software without restriction, including without limitation the rights
  * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  * copies of the Software, and to permit persons to whom the Software is
  * furnished to do so, subject to the following conditions:
  *
  * The above copyright notice and this permission notice shall be included in all
  * copies or substantial portions of the Software.
  *
  * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  * SOFTWARE.
  *
  */
  const n = [["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" }], ["path", { d: "M21 3v5h-5" }], ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" }], ["path", { d: "M8 16H3v5" }]];
  Dt(t, et({ name: "refresh-cw" }, () => r, { get iconNode() {
    return n;
  }, children: (a, o) => {
    var i = Ae(), l = re(i);
    zt(l, e, "default", {}), u(a, i);
  }, $$slots: { default: true } }));
}
function Px(t, e) {
  const r = $t(e, ["children", "$$slots", "$$events", "$$legacy"]);
  /**
  * @license lucide-svelte v0.575.0 - ISC
  *
  * ISC License
  *
  * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2026 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2026.
  *
  * Permission to use, copy, modify, and/or distribute this software for any
  * purpose with or without fee is hereby granted, provided that the above
  * copyright notice and this permission notice appear in all copies.
  *
  * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
  * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
  * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
  * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
  * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
  * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
  * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
  *
  * ---
  *
  * The MIT License (MIT) (for portions derived from Feather)
  *
  * Copyright (c) 2013-2026 Cole Bemis
  *
  * Permission is hereby granted, free of charge, to any person obtaining a copy
  * of this software and associated documentation files (the "Software"), to deal
  * in the Software without restriction, including without limitation the rights
  * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  * copies of the Software, and to permit persons to whom the Software is
  * furnished to do so, subject to the following conditions:
  *
  * The above copyright notice and this permission notice shall be included in all
  * copies or substantial portions of the Software.
  *
  * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  * SOFTWARE.
  *
  */
  const n = [["path", { d: "M3 7V5a2 2 0 0 1 2-2h2" }], ["path", { d: "M17 3h2a2 2 0 0 1 2 2v2" }], ["path", { d: "M21 17v2a2 2 0 0 1-2 2h-2" }], ["path", { d: "M7 21H5a2 2 0 0 1-2-2v-2" }], ["circle", { cx: "12", cy: "12", r: "3" }], ["path", { d: "m16 16-1.9-1.9" }]];
  Dt(t, et({ name: "scan-search" }, () => r, { get iconNode() {
    return n;
  }, children: (a, o) => {
    var i = Ae(), l = re(i);
    zt(l, e, "default", {}), u(a, i);
  }, $$slots: { default: true } }));
}
function Qo(t, e) {
  const r = $t(e, ["children", "$$slots", "$$events", "$$legacy"]);
  /**
  * @license lucide-svelte v0.575.0 - ISC
  *
  * ISC License
  *
  * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2026 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2026.
  *
  * Permission to use, copy, modify, and/or distribute this software for any
  * purpose with or without fee is hereby granted, provided that the above
  * copyright notice and this permission notice appear in all copies.
  *
  * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
  * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
  * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
  * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
  * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
  * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
  * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
  *
  * ---
  *
  * The MIT License (MIT) (for portions derived from Feather)
  *
  * Copyright (c) 2013-2026 Cole Bemis
  *
  * Permission is hereby granted, free of charge, to any person obtaining a copy
  * of this software and associated documentation files (the "Software"), to deal
  * in the Software without restriction, including without limitation the rights
  * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  * copies of the Software, and to permit persons to whom the Software is
  * furnished to do so, subject to the following conditions:
  *
  * The above copyright notice and this permission notice shall be included in all
  * copies or substantial portions of the Software.
  *
  * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  * SOFTWARE.
  *
  */
  const n = [["path", { d: "m21 21-4.34-4.34" }], ["circle", { cx: "11", cy: "11", r: "8" }]];
  Dt(t, et({ name: "search" }, () => r, { get iconNode() {
    return n;
  }, children: (a, o) => {
    var i = Ae(), l = re(i);
    zt(l, e, "default", {}), u(a, i);
  }, $$slots: { default: true } }));
}
function hg(t, e) {
  const r = $t(e, ["children", "$$slots", "$$events", "$$legacy"]);
  /**
  * @license lucide-svelte v0.575.0 - ISC
  *
  * ISC License
  *
  * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2026 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2026.
  *
  * Permission to use, copy, modify, and/or distribute this software for any
  * purpose with or without fee is hereby granted, provided that the above
  * copyright notice and this permission notice appear in all copies.
  *
  * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
  * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
  * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
  * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
  * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
  * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
  * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
  *
  * ---
  *
  * The MIT License (MIT) (for portions derived from Feather)
  *
  * Copyright (c) 2013-2026 Cole Bemis
  *
  * Permission is hereby granted, free of charge, to any person obtaining a copy
  * of this software and associated documentation files (the "Software"), to deal
  * in the Software without restriction, including without limitation the rights
  * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  * copies of the Software, and to permit persons to whom the Software is
  * furnished to do so, subject to the following conditions:
  *
  * The above copyright notice and this permission notice shall be included in all
  * copies or substantial portions of the Software.
  *
  * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  * SOFTWARE.
  *
  */
  const n = [["path", { d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" }], ["path", { d: "m9 12 2 2 4-4" }]];
  Dt(t, et({ name: "shield-check" }, () => r, { get iconNode() {
    return n;
  }, children: (a, o) => {
    var i = Ae(), l = re(i);
    zt(l, e, "default", {}), u(a, i);
  }, $$slots: { default: true } }));
}
function $x(t, e) {
  const r = $t(e, ["children", "$$slots", "$$events", "$$legacy"]);
  /**
  * @license lucide-svelte v0.575.0 - ISC
  *
  * ISC License
  *
  * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2026 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2026.
  *
  * Permission to use, copy, modify, and/or distribute this software for any
  * purpose with or without fee is hereby granted, provided that the above
  * copyright notice and this permission notice appear in all copies.
  *
  * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
  * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
  * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
  * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
  * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
  * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
  * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
  *
  * ---
  *
  * The MIT License (MIT) (for portions derived from Feather)
  *
  * Copyright (c) 2013-2026 Cole Bemis
  *
  * Permission is hereby granted, free of charge, to any person obtaining a copy
  * of this software and associated documentation files (the "Software"), to deal
  * in the Software without restriction, including without limitation the rights
  * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  * copies of the Software, and to permit persons to whom the Software is
  * furnished to do so, subject to the following conditions:
  *
  * The above copyright notice and this permission notice shall be included in all
  * copies or substantial portions of the Software.
  *
  * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  * SOFTWARE.
  *
  */
  const n = [["path", { d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" }]];
  Dt(t, et({ name: "shield" }, () => r, { get iconNode() {
    return n;
  }, children: (a, o) => {
    var i = Ae(), l = re(i);
    zt(l, e, "default", {}), u(a, i);
  }, $$slots: { default: true } }));
}
function Nx(t, e) {
  const r = $t(e, ["children", "$$slots", "$$events", "$$legacy"]);
  /**
  * @license lucide-svelte v0.575.0 - ISC
  *
  * ISC License
  *
  * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2026 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2026.
  *
  * Permission to use, copy, modify, and/or distribute this software for any
  * purpose with or without fee is hereby granted, provided that the above
  * copyright notice and this permission notice appear in all copies.
  *
  * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
  * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
  * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
  * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
  * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
  * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
  * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
  *
  * ---
  *
  * The MIT License (MIT) (for portions derived from Feather)
  *
  * Copyright (c) 2013-2026 Cole Bemis
  *
  * Permission is hereby granted, free of charge, to any person obtaining a copy
  * of this software and associated documentation files (the "Software"), to deal
  * in the Software without restriction, including without limitation the rights
  * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  * copies of the Software, and to permit persons to whom the Software is
  * furnished to do so, subject to the following conditions:
  *
  * The above copyright notice and this permission notice shall be included in all
  * copies or substantial portions of the Software.
  *
  * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  * SOFTWARE.
  *
  */
  const n = [["path", { d: "M21 10.656V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12.344" }], ["path", { d: "m9 11 3 3L22 4" }]];
  Dt(t, et({ name: "square-check-big" }, () => r, { get iconNode() {
    return n;
  }, children: (a, o) => {
    var i = Ae(), l = re(i);
    zt(l, e, "default", {}), u(a, i);
  }, $$slots: { default: true } }));
}
function Rx(t, e) {
  const r = $t(e, ["children", "$$slots", "$$events", "$$legacy"]);
  /**
  * @license lucide-svelte v0.575.0 - ISC
  *
  * ISC License
  *
  * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2026 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2026.
  *
  * Permission to use, copy, modify, and/or distribute this software for any
  * purpose with or without fee is hereby granted, provided that the above
  * copyright notice and this permission notice appear in all copies.
  *
  * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
  * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
  * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
  * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
  * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
  * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
  * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
  *
  * ---
  *
  * The MIT License (MIT) (for portions derived from Feather)
  *
  * Copyright (c) 2013-2026 Cole Bemis
  *
  * Permission is hereby granted, free of charge, to any person obtaining a copy
  * of this software and associated documentation files (the "Software"), to deal
  * in the Software without restriction, including without limitation the rights
  * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  * copies of the Software, and to permit persons to whom the Software is
  * furnished to do so, subject to the following conditions:
  *
  * The above copyright notice and this permission notice shall be included in all
  * copies or substantial portions of the Software.
  *
  * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  * SOFTWARE.
  *
  */
  const n = [["path", { d: "M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" }], ["circle", { cx: "7.5", cy: "7.5", r: ".5", fill: "currentColor" }]];
  Dt(t, et({ name: "tag" }, () => r, { get iconNode() {
    return n;
  }, children: (a, o) => {
    var i = Ae(), l = re(i);
    zt(l, e, "default", {}), u(a, i);
  }, $$slots: { default: true } }));
}
function ei(t, e) {
  const r = $t(e, ["children", "$$slots", "$$events", "$$legacy"]);
  /**
  * @license lucide-svelte v0.575.0 - ISC
  *
  * ISC License
  *
  * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2026 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2026.
  *
  * Permission to use, copy, modify, and/or distribute this software for any
  * purpose with or without fee is hereby granted, provided that the above
  * copyright notice and this permission notice appear in all copies.
  *
  * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
  * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
  * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
  * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
  * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
  * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
  * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
  *
  * ---
  *
  * The MIT License (MIT) (for portions derived from Feather)
  *
  * Copyright (c) 2013-2026 Cole Bemis
  *
  * Permission is hereby granted, free of charge, to any person obtaining a copy
  * of this software and associated documentation files (the "Software"), to deal
  * in the Software without restriction, including without limitation the rights
  * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  * copies of the Software, and to permit persons to whom the Software is
  * furnished to do so, subject to the following conditions:
  *
  * The above copyright notice and this permission notice shall be included in all
  * copies or substantial portions of the Software.
  *
  * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  * SOFTWARE.
  *
  */
  const n = [["path", { d: "M10 11v6" }], ["path", { d: "M14 11v6" }], ["path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" }], ["path", { d: "M3 6h18" }], ["path", { d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" }]];
  Dt(t, et({ name: "trash-2" }, () => r, { get iconNode() {
    return n;
  }, children: (a, o) => {
    var i = Ae(), l = re(i);
    zt(l, e, "default", {}), u(a, i);
  }, $$slots: { default: true } }));
}
function _g(t, e) {
  const r = $t(e, ["children", "$$slots", "$$events", "$$legacy"]);
  /**
  * @license lucide-svelte v0.575.0 - ISC
  *
  * ISC License
  *
  * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2026 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2026.
  *
  * Permission to use, copy, modify, and/or distribute this software for any
  * purpose with or without fee is hereby granted, provided that the above
  * copyright notice and this permission notice appear in all copies.
  *
  * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
  * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
  * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
  * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
  * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
  * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
  * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
  *
  * ---
  *
  * The MIT License (MIT) (for portions derived from Feather)
  *
  * Copyright (c) 2013-2026 Cole Bemis
  *
  * Permission is hereby granted, free of charge, to any person obtaining a copy
  * of this software and associated documentation files (the "Software"), to deal
  * in the Software without restriction, including without limitation the rights
  * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  * copies of the Software, and to permit persons to whom the Software is
  * furnished to do so, subject to the following conditions:
  *
  * The above copyright notice and this permission notice shall be included in all
  * copies or substantial portions of the Software.
  *
  * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  * SOFTWARE.
  *
  */
  const n = [["path", { d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" }], ["path", { d: "M12 9v4" }], ["path", { d: "M12 17h.01" }]];
  Dt(t, et({ name: "triangle-alert" }, () => r, { get iconNode() {
    return n;
  }, children: (a, o) => {
    var i = Ae(), l = re(i);
    zt(l, e, "default", {}), u(a, i);
  }, $$slots: { default: true } }));
}
function bg(t, e) {
  const r = $t(e, ["children", "$$slots", "$$events", "$$legacy"]);
  /**
  * @license lucide-svelte v0.575.0 - ISC
  *
  * ISC License
  *
  * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2026 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2026.
  *
  * Permission to use, copy, modify, and/or distribute this software for any
  * purpose with or without fee is hereby granted, provided that the above
  * copyright notice and this permission notice appear in all copies.
  *
  * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
  * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
  * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
  * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
  * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
  * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
  * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
  *
  * ---
  *
  * The MIT License (MIT) (for portions derived from Feather)
  *
  * Copyright (c) 2013-2026 Cole Bemis
  *
  * Permission is hereby granted, free of charge, to any person obtaining a copy
  * of this software and associated documentation files (the "Software"), to deal
  * in the Software without restriction, including without limitation the rights
  * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  * copies of the Software, and to permit persons to whom the Software is
  * furnished to do so, subject to the following conditions:
  *
  * The above copyright notice and this permission notice shall be included in all
  * copies or substantial portions of the Software.
  *
  * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  * SOFTWARE.
  *
  */
  const n = [["path", { d: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" }]];
  Dt(t, et({ name: "zap" }, () => r, { get iconNode() {
    return n;
  }, children: (a, o) => {
    var i = Ae(), l = re(i);
    zt(l, e, "default", {}), u(a, i);
  }, $$slots: { default: true } }));
}
var Mx = _('<div class="absolute left-[13px] top-7 w-px h-7 bg-border"></div>'), zx = _('<div class="size-1.5 rounded-full bg-white animate-ping"></div>'), Ox = _('<div class="size-1.5 rounded-full bg-muted-foreground/30"></div>'), Dx = _('<code class="text-foreground font-mono text-xs bg-accent px-1.5 py-0.5 rounded truncate max-w-[200px]"> </code>'), Lx = _("<span> </span>"), jx = _('<div class="flex items-center gap-3 mt-1 mb-4 relative last:mb-0"><!> <div><!></div> <div class="flex flex-col min-w-0"><span class="text-sm text-muted-foreground flex items-center gap-1.5 flex-wrap"><span><!></span> <!></span> <!></div></div>'), Bx = _('<div><p class="text-[0.62rem] font-bold uppercase tracking-widest text-muted-foreground mb-3">Execution Trace</p> <div class="flex flex-col relative"></div></div>');
function xg(t, e) {
  De(e, true);
  let r = ae(e, "steps", 19, () => []);
  var n = Ae(), a = re(n);
  {
    var o = (i) => {
      var l = Bx(), c = v(d(l), 2);
      Ge(c, 21, r, Qe, (f, p, m) => {
        const h = V(() => s(p).success === true || s(p).status === "done"), x = V(() => s(p).success === false || s(p).status === "error"), b = V(() => s(p).status === "running"), y = V(() => s(p).status === "pending" || !s(h) && !s(x) && !s(b)), k = V(() => s(p).actionName || s(p).commandId || s(p).label), D = V(() => s(p).message || s(p).error || (s(p).status === "error" ? "Execution failed" : ""));
        var U = jx(), j = d(U);
        {
          var M = ($) => {
            var O = Mx();
            u($, O);
          };
          I(j, ($) => {
            m < r().length - 1 && $(M);
          });
        }
        var q = v(j, 2), F = d(q);
        {
          var P = ($) => {
            Ks($, { class: "size-3.5 text-white" });
          }, C = ($) => {
            _g($, { class: "size-3.5 text-white" });
          }, T = ($) => {
            var O = zx();
            u($, O);
          }, N = ($) => {
            var O = Ox();
            u($, O);
          };
          I(F, ($) => {
            s(h) ? $(P) : s(x) ? $(C, 1) : s(b) ? $(T, 2) : $(N, -1);
          });
        }
        var K = v(q, 2), W = d(K), A = d(W), S = d(A);
        {
          var w = ($) => {
            var O = Be("Executed");
            u($, O);
          }, R = ($) => {
            var O = Be("Failed");
            u($, O);
          }, B = ($) => {
            var O = Be("Running\u2026");
            u($, O);
          }, Z = ($) => {
            var O = Be("Pending");
            u($, O);
          };
          I(S, ($) => {
            s(h) ? $(w) : s(x) ? $(R, 1) : s(b) ? $(B, 2) : $(Z, -1);
          });
        }
        var X = v(A, 2);
        {
          var H = ($) => {
            var O = Dx(), G = d(O);
            L(() => {
              br(O, "title", s(k)), E(G, s(k));
            }), u($, O);
          };
          I(X, ($) => {
            s(k) && $(H);
          });
        }
        var te = v(W, 2);
        {
          var Y = ($) => {
            var O = Lx(), G = d(O);
            L((J) => {
              rt(O, 1, J), E(G, s(D));
            }, [() => Et(Je("text-[0.65rem] mt-0.5 leading-snug", s(x) ? "text-destructive" : "text-muted-foreground/60"))]), u($, O);
          };
          I(te, ($) => {
            s(D) && !s(y) && $(Y);
          });
        }
        L(($, O) => {
          rt(q, 1, $), rt(A, 1, O);
        }, [() => Et(Je("size-7 rounded-full flex items-center justify-center shrink-0 z-10 transition-colors", s(h) && "bg-node-action", s(x) && "bg-destructive", s(b) && "bg-primary border-2 border-primary/30 animate-pulse", s(y) && "bg-muted border border-border")), () => Et(Je("opacity-70", s(b) && "text-primary font-medium opacity-100"))]), u(f, U);
      }), L((f) => rt(l, 1, f), [() => Et(Je("rounded bg-trace-bg border border-border px-4 py-3", e.class))]), u(i, l);
    };
    I(a, (i) => {
      var _a10;
      ((_a10 = r()) == null ? void 0 : _a10.length) && i(o);
    });
  }
  u(t, n), Le();
}
var Fx = /\s+/g, Ux = (t) => typeof t != "string" || !t ? t : t.replace(Fx, " ").trim(), ti = (...t) => {
  const e = [], r = (n) => {
    if (!n && n !== 0 && n !== 0n) return;
    if (Array.isArray(n)) {
      for (let o = 0, i = n.length; o < i; o++) r(n[o]);
      return;
    }
    const a = typeof n;
    if (a === "string" || a === "number" || a === "bigint") {
      if (a === "number" && n !== n) return;
      e.push(String(n));
    } else if (a === "object") {
      const o = Object.keys(n);
      for (let i = 0, l = o.length; i < l; i++) {
        const c = o[i];
        n[c] && e.push(c);
      }
    }
  };
  for (let n = 0, a = t.length; n < a; n++) {
    const o = t[n];
    o != null && r(o);
  }
  return e.length > 0 ? Ux(e.join(" ")) : void 0;
}, Pu = (t) => t === false ? "false" : t === true ? "true" : t === 0 ? "0" : t, Fr = (t) => {
  if (!t || typeof t != "object") return true;
  for (const e in t) return false;
  return true;
}, Gx = (t, e) => {
  if (t === e) return true;
  if (!t || !e) return false;
  const r = Object.keys(t), n = Object.keys(e);
  if (r.length !== n.length) return false;
  for (let a = 0; a < r.length; a++) {
    const o = r[a];
    if (!n.includes(o) || t[o] !== e[o]) return false;
  }
  return true;
}, Wx = (t, e) => {
  for (const r in e) if (Object.prototype.hasOwnProperty.call(e, r)) {
    const n = e[r];
    r in t ? t[r] = ti(t[r], n) : t[r] = n;
  }
  return t;
}, yg = (t, e) => {
  for (let r = 0; r < t.length; r++) {
    const n = t[r];
    Array.isArray(n) ? yg(n, e) : n && e.push(n);
  }
}, wg = (...t) => {
  const e = [];
  yg(t, e);
  const r = [];
  for (let n = 0; n < e.length; n++) e[n] && r.push(e[n]);
  return r;
}, Nl = (t, e) => {
  const r = {};
  for (const n in t) {
    const a = t[n];
    if (n in e) {
      const o = e[n];
      Array.isArray(a) || Array.isArray(o) ? r[n] = wg(o, a) : typeof a == "object" && typeof o == "object" && a && o ? r[n] = Nl(a, o) : r[n] = o + " " + a;
    } else r[n] = a;
  }
  for (const n in e) n in t || (r[n] = e[n]);
  return r;
}, Vx = { twMerge: true, twMergeConfig: {} };
function Hx() {
  let t = null, e = {}, r = false;
  return { get cachedTwMerge() {
    return t;
  }, set cachedTwMerge(n) {
    t = n;
  }, get cachedTwMergeConfig() {
    return e;
  }, set cachedTwMergeConfig(n) {
    e = n;
  }, get didTwMergeConfigChange() {
    return r;
  }, set didTwMergeConfigChange(n) {
    r = n;
  }, reset() {
    t = null, e = {}, r = false;
  } };
}
var Vn = Hx(), qx = (t) => {
  const e = (n, a) => {
    const { extend: o = null, slots: i = {}, variants: l = {}, compoundVariants: c = [], compoundSlots: f = [], defaultVariants: p = {} } = n, m = { ...Vx, ...a }, h = (o == null ? void 0 : o.base) ? ti(o.base, n == null ? void 0 : n.base) : n == null ? void 0 : n.base, x = (o == null ? void 0 : o.variants) && !Fr(o.variants) ? Nl(l, o.variants) : l, b = (o == null ? void 0 : o.defaultVariants) && !Fr(o.defaultVariants) ? { ...o.defaultVariants, ...p } : p;
    !Fr(m.twMergeConfig) && !Gx(m.twMergeConfig, Vn.cachedTwMergeConfig) && (Vn.didTwMergeConfigChange = true, Vn.cachedTwMergeConfig = m.twMergeConfig);
    const y = Fr(o == null ? void 0 : o.slots), k = Fr(i) ? {} : { base: ti(n == null ? void 0 : n.base, y && (o == null ? void 0 : o.base)), ...i }, D = y ? k : Wx({ ...o == null ? void 0 : o.slots }, Fr(k) ? { base: n == null ? void 0 : n.base } : k), U = Fr(o == null ? void 0 : o.compoundVariants) ? c : wg(o == null ? void 0 : o.compoundVariants, c), j = (q) => {
      if (Fr(x) && Fr(i) && y) return t(h, q == null ? void 0 : q.class, q == null ? void 0 : q.className)(m);
      if (U && !Array.isArray(U)) throw new TypeError(`The "compoundVariants" prop must be an array. Received: ${typeof U}`);
      if (f && !Array.isArray(f)) throw new TypeError(`The "compoundSlots" prop must be an array. Received: ${typeof f}`);
      const F = (S, w = x, R = null, B = null) => {
        const Z = w[S];
        if (!Z || Fr(Z)) return null;
        const X = (B == null ? void 0 : B[S]) ?? (q == null ? void 0 : q[S]);
        if (X === null) return null;
        const H = Pu(X);
        if (typeof H == "object") return null;
        const te = b == null ? void 0 : b[S], Y = H ?? Pu(te);
        return Z[Y || "false"];
      }, P = () => {
        if (!x) return null;
        const S = Object.keys(x), w = [];
        for (let R = 0; R < S.length; R++) {
          const B = F(S[R], x);
          B && w.push(B);
        }
        return w;
      }, C = (S, w) => {
        if (!x || typeof x != "object") return null;
        const R = [];
        for (const B in x) {
          const Z = F(B, x, S, w), X = S === "base" && typeof Z == "string" ? Z : Z && Z[S];
          X && R.push(X);
        }
        return R;
      }, T = {};
      for (const S in q) {
        const w = q[S];
        w !== void 0 && (T[S] = w);
      }
      const N = (S, w) => {
        var _a10;
        const R = typeof (q == null ? void 0 : q[S]) == "object" ? { [S]: (_a10 = q[S]) == null ? void 0 : _a10.initial } : {};
        return { ...b, ...T, ...R, ...w };
      }, K = (S = [], w) => {
        const R = [], B = S.length;
        for (let Z = 0; Z < B; Z++) {
          const { class: X, className: H, ...te } = S[Z];
          let Y = true;
          const $ = N(null, w);
          for (const O in te) {
            const G = te[O], J = $[O];
            if (Array.isArray(G)) {
              if (!G.includes(J)) {
                Y = false;
                break;
              }
            } else {
              if ((G == null || G === false) && (J == null || J === false)) continue;
              if (J !== G) {
                Y = false;
                break;
              }
            }
          }
          Y && (X && R.push(X), H && R.push(H));
        }
        return R;
      }, W = (S) => {
        const w = K(U, S);
        if (!Array.isArray(w)) return w;
        const R = {}, B = t;
        for (let Z = 0; Z < w.length; Z++) {
          const X = w[Z];
          if (typeof X == "string") R.base = B(R.base, X)(m);
          else if (typeof X == "object") for (const H in X) R[H] = B(R[H], X[H])(m);
        }
        return R;
      }, A = (S) => {
        if (f.length < 1) return null;
        const w = {}, R = N(null, S);
        for (let B = 0; B < f.length; B++) {
          const { slots: Z = [], class: X, className: H, ...te } = f[B];
          if (!Fr(te)) {
            let Y = true;
            for (const $ in te) {
              const O = R[$], G = te[$];
              if (O === void 0 || (Array.isArray(G) ? !G.includes(O) : G !== O)) {
                Y = false;
                break;
              }
            }
            if (!Y) continue;
          }
          for (let Y = 0; Y < Z.length; Y++) {
            const $ = Z[Y];
            w[$] || (w[$] = []), w[$].push([X, H]);
          }
        }
        return w;
      };
      if (!Fr(i) || !y) {
        const S = {};
        if (typeof D == "object" && !Fr(D)) {
          const w = t;
          for (const R in D) S[R] = (B) => {
            const Z = W(B), X = A(B);
            return w(D[R], C(R, B), Z ? Z[R] : void 0, X ? X[R] : void 0, B == null ? void 0 : B.class, B == null ? void 0 : B.className)(m);
          };
        }
        return S;
      }
      return t(h, P(), K(U), q == null ? void 0 : q.class, q == null ? void 0 : q.className)(m);
    }, M = () => {
      if (!(!x || typeof x != "object")) return Object.keys(x);
    };
    return j.variantKeys = M(), j.extend = o, j.base = h, j.slots = D, j.variants = x, j.defaultVariants = b, j.compoundSlots = f, j.compoundVariants = U, j;
  };
  return { tv: e, createTV: (n) => (a, o) => e(a, o ? Nl(n, o) : n) };
}, Yx = (t) => Fr(t) ? ug : xx({ ...t, extend: { theme: t.theme, classGroups: t.classGroups, conflictingClassGroupModifiers: t.conflictingClassGroupModifiers, conflictingClassGroups: t.conflictingClassGroups, ...t.extend } }), Kx = (t, e) => {
  const r = ti(t);
  return !r || !((e == null ? void 0 : e.twMerge) ?? true) ? r : ((!Vn.cachedTwMerge || Vn.didTwMergeConfigChange) && (Vn.didTwMergeConfigChange = false, Vn.cachedTwMerge = Yx(Vn.cachedTwMergeConfig)), Vn.cachedTwMerge(r) || void 0);
}, Xx = (...t) => (e) => Kx(t, e), { tv: kg } = qx(Xx);
const $u = kg({ base: "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", variants: { variant: { default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs", destructive: "bg-destructive hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 text-white shadow-xs", outline: "bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 border shadow-xs", secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-xs", ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50", link: "text-primary underline-offset-4 hover:underline" }, size: { default: "h-9 px-4 py-2 has-[>svg]:px-3", sm: "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5", lg: "h-10 rounded-md px-6 has-[>svg]:px-4", icon: "size-9", "icon-sm": "size-8", "icon-lg": "size-10" } }, defaultVariants: { variant: "default", size: "default" } });
var Zx = _("<a><!></a>"), Jx = _("<button><!></button>");
function tt(t, e) {
  De(e, true);
  let r = ae(e, "class", 3, void 0), n = ae(e, "variant", 3, "default"), a = ae(e, "size", 3, "default"), o = ae(e, "ref", 15, null), i = ae(e, "href", 3, void 0), l = ae(e, "type", 3, "button"), c = ae(e, "disabled", 3, void 0), f = ae(e, "children", 3, void 0), p = ut(e, ["$$slots", "$$events", "$$legacy", "class", "variant", "size", "ref", "href", "type", "disabled", "children"]);
  var m = Ae(), h = re(m);
  {
    var x = (y) => {
      var k = Zx();
      Gt(k, (U) => ({ "data-slot": "button", class: U, href: c() ? void 0 : i(), "aria-disabled": c(), role: c() ? "link" : void 0, tabindex: c() ? -1 : void 0, ...p }), [() => Je($u({ variant: n(), size: a() }), r())]);
      var D = d(k);
      bt(D, () => f() ?? vt), Jn(k, (U) => o(U), () => o()), u(y, k);
    }, b = (y) => {
      var k = Jx();
      Gt(k, (U) => ({ "data-slot": "button", class: U, type: l(), disabled: c(), ...p }), [() => Je($u({ variant: n(), size: a() }), r())]);
      var D = d(k);
      bt(D, () => f() ?? vt), Jn(k, (U) => o(U), () => o()), u(y, k);
    };
    I(h, (y) => {
      i() ? y(x) : y(b, -1);
    });
  }
  u(t, m), Le();
}
const Qx = kg({ base: "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] [&>svg]:pointer-events-none [&>svg]:size-3", variants: { variant: { default: "bg-primary text-primary-foreground [a&]:hover:bg-primary/90 border-transparent", secondary: "bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90 border-transparent", destructive: "bg-destructive [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/70 border-transparent text-white", outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground" } }, defaultVariants: { variant: "default" } });
function Cr(t, e) {
  De(e, true);
  let r = ae(e, "ref", 15, null), n = ae(e, "href", 3, void 0), a = ae(e, "class", 3, void 0), o = ae(e, "variant", 3, "default"), i = ae(e, "children", 3, void 0), l = ut(e, ["$$slots", "$$events", "$$legacy", "ref", "href", "class", "variant", "children"]);
  var c = Ae(), f = re(c);
  fp(f, () => n() ? "a" : "span", false, (p, m) => {
    Jn(p, (b) => r(b), () => r()), Gt(p, (b) => ({ "data-slot": "badge", href: n(), class: b, ...l }), [() => Je(Qx({ variant: o() }), a())]);
    var h = Ae(), x = re(h);
    bt(x, () => i() ?? vt), u(m, h);
  }), u(t, c), Le();
}
var e0 = _("<input/>"), t0 = _("<input/>");
function Pn(t, e) {
  De(e, true);
  let r = ae(e, "ref", 15, null), n = ae(e, "value", 15), a = ae(e, "files", 15), o = ae(e, "data-slot", 3, "input"), i = ut(e, ["$$slots", "$$events", "$$legacy", "ref", "value", "type", "files", "class", "data-slot"]);
  var l = Ae(), c = re(l);
  {
    var f = (m) => {
      var h = e0();
      Gt(h, (x) => ({ "data-slot": o(), class: x, type: "file", ...i }), [() => Je("selection:bg-primary dark:bg-input/30 selection:text-primary-foreground border-input ring-offset-background placeholder:text-muted-foreground flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 pt-1.5 text-sm font-medium shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50", "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]", "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive", e.class)], void 0, void 0, void 0, true), Jn(h, (x) => r(x), () => r()), l_(h, a), Hn(h, n), u(m, h);
    }, p = (m) => {
      var h = t0();
      Gt(h, (x) => ({ "data-slot": o(), class: x, type: e.type, ...i }), [() => Je("border-input bg-background selection:bg-primary dark:bg-input/30 selection:text-primary-foreground ring-offset-background placeholder:text-muted-foreground flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]", "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive", e.class)], void 0, void 0, void 0, true), Jn(h, (x) => r(x), () => r()), Hn(h, n), u(m, h);
    };
    I(c, (m) => {
      e.type === "file" ? m(f) : m(p, -1);
    });
  }
  u(t, l), Le();
}
function r0(t) {
  return typeof t == "function";
}
function fo(t) {
  return t !== null && typeof t == "object";
}
const n0 = ["string", "number", "bigint", "boolean"];
function Rl(t) {
  return t == null || n0.includes(typeof t) ? true : Array.isArray(t) ? t.every((e) => Rl(e)) : typeof t == "object" ? Object.getPrototypeOf(t) === Object.prototype : false;
}
const hs = Symbol("box"), Ai = Symbol("is-writable");
function Ke(t, e) {
  const r = V(t);
  return e ? { [hs]: true, [Ai]: true, get current() {
    return s(r);
  }, set current(n) {
    e(n);
  } } : { [hs]: true, get current() {
    return t();
  } };
}
function po(t) {
  return fo(t) && hs in t;
}
function Bc(t) {
  return po(t) && Ai in t;
}
function a0(t) {
  return po(t) ? t : r0(t) ? Ke(t) : ri(t);
}
function s0(t) {
  return Object.entries(t).reduce((e, [r, n]) => po(n) ? (Bc(n) ? Object.defineProperty(e, r, { get() {
    return n.current;
  }, set(a) {
    n.current = a;
  } }) : Object.defineProperty(e, r, { get() {
    return n.current;
  } }), e) : Object.assign(e, { [r]: n }), {});
}
function o0(t) {
  return Bc(t) ? { [hs]: true, get current() {
    return t.current;
  } } : t;
}
function ri(t) {
  let e = ee(nt(t));
  return { [hs]: true, [Ai]: true, get current() {
    return s(e);
  }, set current(r) {
    g(e, r, true);
  } };
}
function Va(t) {
  let e = ee(nt(t));
  return { [hs]: true, [Ai]: true, get current() {
    return s(e);
  }, set current(r) {
    g(e, r, true);
  } };
}
Va.from = a0;
Va.with = Ke;
Va.flatten = s0;
Va.readonly = o0;
Va.isBox = po;
Va.isWritableBox = Bc;
function i0(...t) {
  return function(e) {
    var _a10;
    for (const r of t) if (r) {
      if (e.defaultPrevented) return;
      typeof r == "function" ? r.call(this, e) : (_a10 = r.current) == null ? void 0 : _a10.call(this, e);
    }
  };
}
var Nu = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g, l0 = /\n/g, c0 = /^\s*/, d0 = /^(\*?[-#/*\\\w]+(\[[0-9a-z_-]+\])?)\s*/, u0 = /^:\s*/, f0 = /^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};])+)/, p0 = /^[;\s]*/, v0 = /^\s+|\s+$/g, g0 = `
`, Ru = "/", Mu = "*", Ca = "", m0 = "comment", h0 = "declaration";
function _0(t, e) {
  if (typeof t != "string") throw new TypeError("First argument must be a string");
  if (!t) return [];
  e = e || {};
  var r = 1, n = 1;
  function a(b) {
    var y = b.match(l0);
    y && (r += y.length);
    var k = b.lastIndexOf(g0);
    n = ~k ? b.length - k : n + b.length;
  }
  function o() {
    var b = { line: r, column: n };
    return function(y) {
      return y.position = new i(b), f(), y;
    };
  }
  function i(b) {
    this.start = b, this.end = { line: r, column: n }, this.source = e.source;
  }
  i.prototype.content = t;
  function l(b) {
    var y = new Error(e.source + ":" + r + ":" + n + ": " + b);
    if (y.reason = b, y.filename = e.source, y.line = r, y.column = n, y.source = t, !e.silent) throw y;
  }
  function c(b) {
    var y = b.exec(t);
    if (y) {
      var k = y[0];
      return a(k), t = t.slice(k.length), y;
    }
  }
  function f() {
    c(c0);
  }
  function p(b) {
    var y;
    for (b = b || []; y = m(); ) y !== false && b.push(y);
    return b;
  }
  function m() {
    var b = o();
    if (!(Ru != t.charAt(0) || Mu != t.charAt(1))) {
      for (var y = 2; Ca != t.charAt(y) && (Mu != t.charAt(y) || Ru != t.charAt(y + 1)); ) ++y;
      if (y += 2, Ca === t.charAt(y - 1)) return l("End of comment missing");
      var k = t.slice(2, y - 2);
      return n += 2, a(k), t = t.slice(y), n += 2, b({ type: m0, comment: k });
    }
  }
  function h() {
    var b = o(), y = c(d0);
    if (y) {
      if (m(), !c(u0)) return l("property missing ':'");
      var k = c(f0), D = b({ type: h0, property: zu(y[0].replace(Nu, Ca)), value: k ? zu(k[0].replace(Nu, Ca)) : Ca });
      return c(p0), D;
    }
  }
  function x() {
    var b = [];
    p(b);
    for (var y; y = h(); ) y !== false && (b.push(y), p(b));
    return b;
  }
  return f(), x();
}
function zu(t) {
  return t ? t.replace(v0, Ca) : Ca;
}
function b0(t, e) {
  let r = null;
  if (!t || typeof t != "string") return r;
  const n = _0(t), a = typeof e == "function";
  return n.forEach((o) => {
    if (o.type !== "declaration") return;
    const { property: i, value: l } = o;
    a ? e(i, l, o) : l && (r = r || {}, r[i] = l);
  }), r;
}
const x0 = /\d/, y0 = ["-", "_", "/", "."];
function w0(t = "") {
  if (!x0.test(t)) return t !== t.toLowerCase();
}
function k0(t) {
  const e = [];
  let r = "", n, a;
  for (const o of t) {
    const i = y0.includes(o);
    if (i === true) {
      e.push(r), r = "", n = void 0;
      continue;
    }
    const l = w0(o);
    if (a === false) {
      if (n === false && l === true) {
        e.push(r), r = o, n = l;
        continue;
      }
      if (n === true && l === false && r.length > 1) {
        const c = r.at(-1);
        e.push(r.slice(0, Math.max(0, r.length - 1))), r = c + o, n = l;
        continue;
      }
    }
    r += o, n = l, a = i;
  }
  return e.push(r), e;
}
function Sg(t) {
  return t ? k0(t).map((e) => T0(e)).join("") : "";
}
function S0(t) {
  return A0(Sg(t || ""));
}
function T0(t) {
  return t ? t[0].toUpperCase() + t.slice(1) : "";
}
function A0(t) {
  return t ? t[0].toLowerCase() + t.slice(1) : "";
}
function Ro(t) {
  if (!t) return {};
  const e = {};
  function r(n, a) {
    if (n.startsWith("-moz-") || n.startsWith("-webkit-") || n.startsWith("-ms-") || n.startsWith("-o-")) {
      e[Sg(n)] = a;
      return;
    }
    if (n.startsWith("--")) {
      e[n] = a;
      return;
    }
    e[S0(n)] = a;
  }
  return b0(t, r), e;
}
function Fc(...t) {
  return (...e) => {
    for (const r of t) typeof r == "function" && r(...e);
  };
}
function E0(t, e) {
  const r = RegExp(t, "g");
  return (n) => {
    if (typeof n != "string") throw new TypeError(`expected an argument of type string, but got ${typeof n}`);
    return n.match(r) ? n.replace(r, e) : n;
  };
}
const C0 = E0(/[A-Z]/, (t) => `-${t.toLowerCase()}`);
function I0(t) {
  if (!t || typeof t != "object" || Array.isArray(t)) throw new TypeError(`expected an argument of type object, but got ${typeof t}`);
  return Object.keys(t).map((e) => `${C0(e)}: ${t[e]};`).join(`
`);
}
function Tg(t = {}) {
  return I0(t).replace(`
`, " ");
}
const P0 = ["onabort", "onanimationcancel", "onanimationend", "onanimationiteration", "onanimationstart", "onauxclick", "onbeforeinput", "onbeforetoggle", "onblur", "oncancel", "oncanplay", "oncanplaythrough", "onchange", "onclick", "onclose", "oncompositionend", "oncompositionstart", "oncompositionupdate", "oncontextlost", "oncontextmenu", "oncontextrestored", "oncopy", "oncuechange", "oncut", "ondblclick", "ondrag", "ondragend", "ondragenter", "ondragleave", "ondragover", "ondragstart", "ondrop", "ondurationchange", "onemptied", "onended", "onerror", "onfocus", "onfocusin", "onfocusout", "onformdata", "ongotpointercapture", "oninput", "oninvalid", "onkeydown", "onkeypress", "onkeyup", "onload", "onloadeddata", "onloadedmetadata", "onloadstart", "onlostpointercapture", "onmousedown", "onmouseenter", "onmouseleave", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "onpaste", "onpause", "onplay", "onplaying", "onpointercancel", "onpointerdown", "onpointerenter", "onpointerleave", "onpointermove", "onpointerout", "onpointerover", "onpointerup", "onprogress", "onratechange", "onreset", "onresize", "onscroll", "onscrollend", "onsecuritypolicyviolation", "onseeked", "onseeking", "onselect", "onselectionchange", "onselectstart", "onslotchange", "onstalled", "onsubmit", "onsuspend", "ontimeupdate", "ontoggle", "ontouchcancel", "ontouchend", "ontouchmove", "ontouchstart", "ontransitioncancel", "ontransitionend", "ontransitionrun", "ontransitionstart", "onvolumechange", "onwaiting", "onwebkitanimationend", "onwebkitanimationiteration", "onwebkitanimationstart", "onwebkittransitionend", "onwheel"], $0 = new Set(P0);
function N0(t) {
  return $0.has(t);
}
function tr(...t) {
  const e = { ...t[0] };
  for (let r = 1; r < t.length; r++) {
    const n = t[r];
    if (n) {
      for (const a of Object.keys(n)) {
        const o = e[a], i = n[a], l = typeof o == "function", c = typeof i == "function";
        if (l && N0(a)) {
          const f = o, p = i;
          e[a] = i0(f, p);
        } else if (l && c) e[a] = Fc(o, i);
        else if (a === "class") {
          const f = Rl(o), p = Rl(i);
          f && p ? e[a] = Ws(o, i) : f ? e[a] = Ws(o) : p && (e[a] = Ws(i));
        } else if (a === "style") {
          const f = typeof o == "object", p = typeof i == "object", m = typeof o == "string", h = typeof i == "string";
          if (f && p) e[a] = { ...o, ...i };
          else if (f && h) {
            const x = Ro(i);
            e[a] = { ...o, ...x };
          } else if (m && p) {
            const x = Ro(o);
            e[a] = { ...x, ...i };
          } else if (m && h) {
            const x = Ro(o), b = Ro(i);
            e[a] = { ...x, ...b };
          } else f ? e[a] = o : p ? e[a] = i : m ? e[a] = o : h && (e[a] = i);
        } else e[a] = i !== void 0 ? i : o;
      }
      for (const a of Object.getOwnPropertySymbols(n)) {
        const o = e[a], i = n[a];
        e[a] = i !== void 0 ? i : o;
      }
    }
  }
  return typeof e.style == "object" && (e.style = Tg(e.style).replaceAll(`
`, " ")), e.hidden === false && (e.hidden = void 0, delete e.hidden), e.disabled === false && (e.disabled = void 0, delete e.disabled), e;
}
const R0 = { position: "absolute", width: "1px", height: "1px", padding: "0", margin: "-1px", overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", borderWidth: "0", transform: "translateX(-100%)" }, M0 = Tg(R0), z0 = typeof window < "u" ? window : void 0;
function O0(t) {
  let e = t.activeElement;
  for (; e == null ? void 0 : e.shadowRoot; ) {
    const r = e.shadowRoot.activeElement;
    if (r === e) break;
    e = r;
  }
  return e;
}
const _Ou = class _Ou extends Map {
  constructor(e) {
    super();
    __privateAdd(this, _Ou_instances);
    __privateAdd(this, _e4, /* @__PURE__ */ new Map());
    __privateAdd(this, _t5, ee(0));
    __privateAdd(this, _r5, ee(0));
    __privateAdd(this, _n5, Yn || -1);
    if (e) {
      for (var [r, n] of e) super.set(r, n);
      __privateGet(this, _r5).v = super.size;
    }
  }
  has(e) {
    var r = __privateGet(this, _e4), n = r.get(e);
    if (n === void 0) if (super.has(e)) n = __privateMethod(this, _Ou_instances, a_fn).call(this, 0), r.set(e, n);
    else return s(__privateGet(this, _t5)), false;
    return s(n), true;
  }
  forEach(e, r) {
    __privateMethod(this, _Ou_instances, s_fn).call(this), super.forEach(e, r);
  }
  get(e) {
    var r = __privateGet(this, _e4), n = r.get(e);
    if (n === void 0) if (super.has(e)) n = __privateMethod(this, _Ou_instances, a_fn).call(this, 0), r.set(e, n);
    else {
      s(__privateGet(this, _t5));
      return;
    }
    return s(n), super.get(e);
  }
  set(e, r) {
    var _a10;
    var n = __privateGet(this, _e4), a = n.get(e), o = super.get(e), i = super.set(e, r), l = __privateGet(this, _t5);
    if (a === void 0) a = __privateMethod(this, _Ou_instances, a_fn).call(this, 0), n.set(e, a), g(__privateGet(this, _r5), super.size), En(l);
    else if (o !== r) {
      En(a);
      var c = l.reactions === null ? null : new Set(l.reactions), f = c === null || !((_a10 = a.reactions) == null ? void 0 : _a10.every((p) => c.has(p)));
      f && En(l);
    }
    return i;
  }
  delete(e) {
    var r = __privateGet(this, _e4), n = r.get(e), a = super.delete(e);
    return n !== void 0 && (r.delete(e), g(n, -1)), a && (g(__privateGet(this, _r5), super.size), En(__privateGet(this, _t5))), a;
  }
  clear() {
    if (super.size !== 0) {
      super.clear();
      var e = __privateGet(this, _e4);
      g(__privateGet(this, _r5), 0);
      for (var r of e.values()) g(r, -1);
      En(__privateGet(this, _t5)), e.clear();
    }
  }
  keys() {
    return s(__privateGet(this, _t5)), super.keys();
  }
  values() {
    return __privateMethod(this, _Ou_instances, s_fn).call(this), super.values();
  }
  entries() {
    return __privateMethod(this, _Ou_instances, s_fn).call(this), super.entries();
  }
  [Symbol.iterator]() {
    return this.entries();
  }
  get size() {
    return s(__privateGet(this, _r5)), super.size;
  }
};
_e4 = new WeakMap();
_t5 = new WeakMap();
_r5 = new WeakMap();
_n5 = new WeakMap();
_Ou_instances = new WeakSet();
a_fn = function(e) {
  return Yn === __privateGet(this, _n5) ? ee(e) : Xn(e);
};
s_fn = function() {
  s(__privateGet(this, _t5));
  var e = __privateGet(this, _e4);
  if (__privateGet(this, _r5).v !== e.size) {
    for (var r of __superGet(_Ou.prototype, this, "keys").call(this)) if (!e.has(r)) {
      var n = __privateMethod(this, _Ou_instances, a_fn).call(this, 0);
      e.set(r, n);
    }
  }
  for ([, n] of __privateGet(this, _e4)) s(n);
};
let Ou = _Ou;
class D0 {
  constructor(e = {}) {
    __privateAdd(this, _e5);
    __privateAdd(this, _t6);
    const { window: r = z0, document: n = r == null ? void 0 : r.document } = e;
    r !== void 0 && (__privateSet(this, _e5, n), __privateSet(this, _t6, Lf((a) => {
      const o = xn(r, "focusin", a), i = xn(r, "focusout", a);
      return () => {
        o(), i();
      };
    })));
  }
  get current() {
    var _a10;
    return (_a10 = __privateGet(this, _t6)) == null ? void 0 : _a10.call(this), __privateGet(this, _e5) ? O0(__privateGet(this, _e5)) : null;
  }
}
_e5 = new WeakMap();
_t6 = new WeakMap();
new D0();
function L0(t) {
  return typeof t == "function";
}
function j0(t, e) {
  if (L0(t)) {
    const n = t();
    return n === void 0 ? e : n;
  }
  return t === void 0 ? e : t;
}
class wa {
  constructor(e) {
    __privateAdd(this, _e6);
    __privateAdd(this, _t7);
    __privateSet(this, _e6, e), __privateSet(this, _t7, Symbol(e));
  }
  get key() {
    return __privateGet(this, _t7);
  }
  exists() {
    return ah(__privateGet(this, _t7));
  }
  get() {
    const e = Kd(__privateGet(this, _t7));
    if (e === void 0) throw new Error(`Context "${__privateGet(this, _e6)}" not found`);
    return e;
  }
  getOr(e) {
    const r = Kd(__privateGet(this, _t7));
    return r === void 0 ? e : r;
  }
  set(e) {
    return nh(__privateGet(this, _t7), e);
  }
}
_e6 = new WeakMap();
_t7 = new WeakMap();
function Ei(t, e) {
  let r = ee(null);
  const n = V(() => j0(e, 250));
  function a(...o) {
    if (s(r)) s(r).timeout && clearTimeout(s(r).timeout);
    else {
      let i, l;
      const c = new Promise((f, p) => {
        i = f, l = p;
      });
      g(r, { timeout: null, runner: null, promise: c, resolve: i, reject: l }, true);
    }
    return s(r).runner = async () => {
      if (!s(r)) return;
      const i = s(r);
      g(r, null);
      try {
        i.resolve(await t.apply(this, o));
      } catch (l) {
        i.reject(l);
      }
    }, s(r).timeout = setTimeout(s(r).runner, s(n)), s(r).promise;
  }
  return a.cancel = async () => {
    (!s(r) || s(r).timeout === null) && (await new Promise((o) => setTimeout(o, 0)), !s(r) || s(r).timeout === null) || (clearTimeout(s(r).timeout), s(r).reject("Cancelled"), g(r, null));
  }, a.runScheduledNow = async () => {
    var _a10, _b4;
    (!s(r) || !s(r).timeout) && (await new Promise((o) => setTimeout(o, 0)), !s(r) || !s(r).timeout) || (clearTimeout(s(r).timeout), s(r).timeout = null, await ((_b4 = (_a10 = s(r)).runner) == null ? void 0 : _b4.call(_a10)));
  }, Object.defineProperty(a, "pending", { enumerable: true, get() {
    var _a10;
    return !!((_a10 = s(r)) == null ? void 0 : _a10.timeout);
  } }), a;
}
function B0(t, e) {
  switch (t) {
    case "post":
      Ut(e);
      break;
    case "pre":
      hi(e);
      break;
  }
}
function Ag(t, e, r, n = {}) {
  const { lazy: a = false } = n;
  let o = !a, i = Array.isArray(t) ? [] : void 0;
  B0(e, () => {
    const l = Array.isArray(t) ? t.map((f) => f()) : t();
    if (!o) {
      o = true, i = l;
      return;
    }
    const c = yr(() => r(l, i));
    return i = l, c;
  });
}
function On(t, e, r) {
  Ag(t, "post", e, r);
}
function F0(t, e, r) {
  Ag(t, "pre", e, r);
}
On.pre = F0;
class Uc {
  constructor() {
    __privateAdd(this, _e7, ee(false));
    Ut(() => (yr(() => g(__privateGet(this, _e7), true)), () => {
      g(__privateGet(this, _e7), false);
    }));
  }
  get current() {
    return s(__privateGet(this, _e7));
  }
}
_e7 = new WeakMap();
class U0 {
  constructor(e, r) {
    __privateAdd(this, _e8, () => {
    });
    __privateAdd(this, _t8, V(() => __privateGet(this, _e8).call(this)));
    let n;
    r !== void 0 && (n = r), __privateSet(this, _e8, () => {
      try {
        return n;
      } finally {
        n = e();
      }
    });
  }
  get current() {
    return s(__privateGet(this, _t8));
  }
}
_e8 = new WeakMap();
_t8 = new WeakMap();
function G0(t) {
  Ut(() => () => {
    t();
  });
}
function Eg(t) {
  dc().then(t);
}
const W0 = 1, V0 = 9, H0 = 11;
function q0(t) {
  return fo(t) && t.nodeType === W0 && typeof t.nodeName == "string";
}
function Cg(t) {
  return fo(t) && t.nodeType === V0;
}
function Y0(t) {
  var _a10;
  return fo(t) && ((_a10 = t.constructor) == null ? void 0 : _a10.name) === "VisualViewport";
}
function K0(t) {
  return fo(t) && t.nodeType !== void 0;
}
function X0(t) {
  return K0(t) && t.nodeType === H0 && "host" in t;
}
function Z0(t) {
  return Cg(t) ? t : Y0(t) ? t.document : (t == null ? void 0 : t.ownerDocument) ?? document;
}
function Ig(t) {
  var _a10;
  return X0(t) ? Ig(t.host) : Cg(t) ? t.defaultView ?? window : q0(t) ? ((_a10 = t.ownerDocument) == null ? void 0 : _a10.defaultView) ?? window : window;
}
function J0(t) {
  let e = t.activeElement;
  for (; e == null ? void 0 : e.shadowRoot; ) {
    const r = e.shadowRoot.activeElement;
    if (r === e) break;
    e = r;
  }
  return e;
}
class Q0 {
  constructor(e) {
    __publicField(this, "element");
    __privateAdd(this, _e9, V(() => this.element.current ? this.element.current.getRootNode() ?? document : document));
    __publicField(this, "getDocument", () => Z0(this.root));
    __publicField(this, "getWindow", () => this.getDocument().defaultView ?? window);
    __publicField(this, "getActiveElement", () => J0(this.root));
    __publicField(this, "isActiveElement", (e) => e === this.getActiveElement());
    __publicField(this, "querySelector", (e) => this.root ? this.root.querySelector(e) : null);
    __publicField(this, "querySelectorAll", (e) => this.root ? this.root.querySelectorAll(e) : []);
    __publicField(this, "setTimeout", (e, r) => this.getWindow().setTimeout(e, r));
    __publicField(this, "clearTimeout", (e) => this.getWindow().clearTimeout(e));
    typeof e == "function" ? this.element = Ke(e) : this.element = e;
  }
  get root() {
    return s(__privateGet(this, _e9));
  }
  set root(e) {
    g(__privateGet(this, _e9), e);
  }
  getElementById(e) {
    return this.root.getElementById(e);
  }
}
_e9 = new WeakMap();
function kr(t, e) {
  return { [zh()]: (r) => po(t) ? (t.current = r, yr(() => e == null ? void 0 : e(r)), () => {
    "isConnected" in r && r.isConnected || (t.current = null, e == null ? void 0 : e(null));
  }) : (t(r), yr(() => e == null ? void 0 : e(r)), () => {
    "isConnected" in r && r.isConnected || (t(null), e == null ? void 0 : e(null));
  }) };
}
function Gc(t) {
  return t ? "true" : "false";
}
function e1(t) {
  return t ? "true" : void 0;
}
function La(t) {
  return t ? "" : void 0;
}
function Pg(t) {
  return t ? true : void 0;
}
function Wc(t) {
  return t ? "open" : "closed";
}
function t1(t) {
  return t ? "checked" : "unchecked";
}
function r1(t, e) {
  return t ? "true" : "false";
}
class n1 {
  constructor(e) {
    __privateAdd(this, _e10);
    __privateAdd(this, _t9);
    __publicField(this, "attrs");
    __privateSet(this, _e10, e.getVariant ? e.getVariant() : null), __privateSet(this, _t9, __privateGet(this, _e10) ? `data-${__privateGet(this, _e10)}-` : `data-${e.component}-`), this.getAttr = this.getAttr.bind(this), this.selector = this.selector.bind(this), this.attrs = Object.fromEntries(e.parts.map((r) => [r, this.getAttr(r)]));
  }
  getAttr(e, r) {
    return r ? `data-${r}-${e}` : `${__privateGet(this, _t9)}${e}`;
  }
  selector(e, r) {
    return `[${this.getAttr(e, r)}]`;
  }
}
_e10 = new WeakMap();
_t9 = new WeakMap();
function Ha(t) {
  const e = new n1(t);
  return { ...e.attrs, selector: e.selector, getAttr: e.getAttr };
}
const Ml = "ArrowDown", Vc = "ArrowLeft", Hc = "ArrowRight", zl = "ArrowUp", a1 = "End", qc = "Enter", s1 = "Home", Yc = " ";
function o1(t) {
  return window.getComputedStyle(t).getPropertyValue("direction");
}
function i1(t = "ltr", e = "horizontal") {
  return { horizontal: t === "rtl" ? Vc : Hc, vertical: Ml }[e];
}
function l1(t = "ltr", e = "horizontal") {
  return { horizontal: t === "rtl" ? Hc : Vc, vertical: zl }[e];
}
function c1(t = "ltr", e = "horizontal") {
  return ["ltr", "rtl"].includes(t) || (t = "ltr"), ["horizontal", "vertical"].includes(e) || (e = "horizontal"), { nextKey: i1(t, e), prevKey: l1(t, e) };
}
function d1(t) {
  return t instanceof HTMLElement;
}
class u1 {
  constructor(e) {
    __privateAdd(this, _e11);
    __privateAdd(this, _t10, Va(null));
    __privateSet(this, _e11, e);
  }
  getCandidateNodes() {
    return __privateGet(this, _e11).rootNode.current ? __privateGet(this, _e11).candidateSelector ? Array.from(__privateGet(this, _e11).rootNode.current.querySelectorAll(__privateGet(this, _e11).candidateSelector)) : __privateGet(this, _e11).candidateAttr ? Array.from(__privateGet(this, _e11).rootNode.current.querySelectorAll(`[${__privateGet(this, _e11).candidateAttr}]:not([data-disabled])`)) : [] : [];
  }
  focusFirstCandidate() {
    var _a10;
    const e = this.getCandidateNodes();
    e.length && ((_a10 = e[0]) == null ? void 0 : _a10.focus());
  }
  handleKeydown(e, r, n = false) {
    var _a10, _b4;
    const a = __privateGet(this, _e11).rootNode.current;
    if (!a || !e) return;
    const o = this.getCandidateNodes();
    if (!o.length) return;
    const i = o.indexOf(e), l = o1(a), { nextKey: c, prevKey: f } = c1(l, __privateGet(this, _e11).orientation.current), p = __privateGet(this, _e11).loop.current, m = { [c]: i + 1, [f]: i - 1, [s1]: 0, [a1]: o.length - 1 };
    if (n) {
      const b = c === Ml ? Hc : Ml, y = f === zl ? Vc : zl;
      m[b] = i + 1, m[y] = i - 1;
    }
    let h = m[r.key];
    if (h === void 0) return;
    r.preventDefault(), h < 0 && p ? h = o.length - 1 : h === o.length && p && (h = 0);
    const x = o[h];
    if (x) return x.focus(), __privateGet(this, _t10).current = x.id, (_b4 = (_a10 = __privateGet(this, _e11)).onCandidateFocus) == null ? void 0 : _b4.call(_a10, x), x;
  }
  getTabIndex(e) {
    const r = this.getCandidateNodes(), n = __privateGet(this, _t10).current !== null;
    return e && !n && r[0] === e ? (__privateGet(this, _t10).current = e.id, 0) : (e == null ? void 0 : e.id) === __privateGet(this, _t10).current ? 0 : -1;
  }
  setCurrentTabStopId(e) {
    __privateGet(this, _t10).current = e;
  }
  focusCurrentTabStop() {
    var _a10;
    const e = __privateGet(this, _t10).current;
    if (!e) return;
    const r = (_a10 = __privateGet(this, _e11).rootNode.current) == null ? void 0 : _a10.querySelector(`#${e}`);
    !r || !d1(r) || r.focus();
  }
}
_e11 = new WeakMap();
_t10 = new WeakMap();
class f1 {
  constructor(e) {
    __privateAdd(this, _f1_instances);
    __privateAdd(this, _e12);
    __privateAdd(this, _t11, null);
    __privateSet(this, _e12, e), G0(() => __privateMethod(this, _f1_instances, r_fn).call(this));
  }
  run(e) {
    __privateMethod(this, _f1_instances, r_fn).call(this);
    const r = __privateGet(this, _e12).ref.current;
    if (r) {
      if (typeof r.getAnimations != "function") {
        __privateMethod(this, _f1_instances, n_fn).call(this, e);
        return;
      }
      __privateSet(this, _t11, window.requestAnimationFrame(() => {
        const n = r.getAnimations();
        if (n.length === 0) {
          __privateMethod(this, _f1_instances, n_fn).call(this, e);
          return;
        }
        Promise.allSettled(n.map((a) => a.finished)).then(() => {
          __privateMethod(this, _f1_instances, n_fn).call(this, e);
        });
      }));
    }
  }
}
_e12 = new WeakMap();
_t11 = new WeakMap();
_f1_instances = new WeakSet();
r_fn = function() {
  __privateGet(this, _t11) && (window.cancelAnimationFrame(__privateGet(this, _t11)), __privateSet(this, _t11, null));
};
n_fn = function(e) {
  const r = () => {
    e();
  };
  __privateGet(this, _e12).afterTick ? Eg(r) : r();
};
class p1 {
  constructor(e) {
    __privateAdd(this, _e13);
    __privateAdd(this, _t12);
    __privateAdd(this, _r6);
    __privateAdd(this, _n6, ee(false));
    __privateSet(this, _e13, e), g(__privateGet(this, _n6), e.open.current, true), __privateSet(this, _t12, e.enabled ?? true), __privateSet(this, _r6, new f1({ ref: __privateGet(this, _e13).ref, afterTick: __privateGet(this, _e13).open })), On(() => __privateGet(this, _e13).open.current, (r) => {
      r && g(__privateGet(this, _n6), true), __privateGet(this, _t12) && __privateGet(this, _r6).run(() => {
        var _a10, _b4;
        r === __privateGet(this, _e13).open.current && (__privateGet(this, _e13).open.current || g(__privateGet(this, _n6), false), (_b4 = (_a10 = __privateGet(this, _e13)).onComplete) == null ? void 0 : _b4.call(_a10));
      });
    });
  }
  get shouldRender() {
    return s(__privateGet(this, _n6));
  }
}
_e13 = new WeakMap();
_t12 = new WeakMap();
_r6 = new WeakMap();
_n6 = new WeakMap();
function ni() {
}
function $r(t, e) {
  return `bits-${t}`;
}
globalThis.bitsIdCounter ?? (globalThis.bitsIdCounter = { current: 0 });
function v1(t = "bits") {
  return globalThis.bitsIdCounter.current++, `${t}-${globalThis.bitsIdCounter.current}`;
}
var g1 = _("<input/>"), m1 = _("<input/>");
function h1(t, e) {
  De(e, true);
  let r = ae(e, "value", 15), n = ut(e, ["$$slots", "$$events", "$$legacy", "value"]);
  const a = V(() => tr(n, { "aria-hidden": "true", tabindex: -1, style: M0 }));
  var o = Ae(), i = re(o);
  {
    var l = (f) => {
      var p = g1();
      Gt(p, () => ({ ...s(a), value: r() }), void 0, void 0, void 0, void 0, true), u(f, p);
    }, c = (f) => {
      var p = m1();
      Gt(p, () => ({ ...s(a) }), void 0, void 0, void 0, void 0, true), Hn(p, r), u(f, p);
    };
    I(i, (f) => {
      s(a).type === "checkbox" ? f(l) : f(c, -1);
    });
  }
  u(t, o), Le();
}
const Kc = Ha({ component: "collapsible", parts: ["root", "content", "trigger"] }), Xc = new wa("Collapsible.Root");
const _Zc = class _Zc {
  constructor(e) {
    __publicField(this, "opts");
    __publicField(this, "attachment");
    __privateAdd(this, _e14, ee(null));
    __publicField(this, "contentPresence");
    __privateAdd(this, _t13, ee(void 0));
    __privateAdd(this, _r7, V(() => ({ id: this.opts.id.current, "data-state": Wc(this.opts.open.current), "data-disabled": La(this.opts.disabled.current), [Kc.root]: "", ...this.attachment })));
    this.opts = e, this.toggleOpen = this.toggleOpen.bind(this), this.attachment = kr(this.opts.ref), this.contentPresence = new p1({ ref: Ke(() => this.contentNode), open: this.opts.open, onComplete: () => {
      this.opts.onOpenChangeComplete.current(this.opts.open.current);
    } });
  }
  static create(e) {
    return Xc.set(new _Zc(e));
  }
  get contentNode() {
    return s(__privateGet(this, _e14));
  }
  set contentNode(e) {
    g(__privateGet(this, _e14), e, true);
  }
  get contentId() {
    return s(__privateGet(this, _t13));
  }
  set contentId(e) {
    g(__privateGet(this, _t13), e, true);
  }
  toggleOpen() {
    this.opts.open.current = !this.opts.open.current;
  }
  get props() {
    return s(__privateGet(this, _r7));
  }
  set props(e) {
    g(__privateGet(this, _r7), e);
  }
};
_e14 = new WeakMap();
_t13 = new WeakMap();
_r7 = new WeakMap();
let Zc = _Zc;
const _Jc = class _Jc {
  constructor(e, r) {
    __publicField(this, "opts");
    __publicField(this, "root");
    __publicField(this, "attachment");
    __privateAdd(this, _e15, V(() => this.opts.hiddenUntilFound.current ? this.root.opts.open.current : this.opts.forceMount.current || this.root.opts.open.current));
    __privateAdd(this, _t14);
    __privateAdd(this, _r8, ee(false));
    __privateAdd(this, _n7, ee(0));
    __privateAdd(this, _a6, ee(0));
    __privateAdd(this, _s5, V(() => ({ open: this.root.opts.open.current })));
    __privateAdd(this, _o5, V(() => ({ id: this.opts.id.current, style: { "--bits-collapsible-content-height": s(__privateGet(this, _a6)) ? `${s(__privateGet(this, _a6))}px` : void 0, "--bits-collapsible-content-width": s(__privateGet(this, _n7)) ? `${s(__privateGet(this, _n7))}px` : void 0 }, hidden: this.opts.hiddenUntilFound.current && !this.root.opts.open.current ? "until-found" : void 0, "data-state": Wc(this.root.opts.open.current), "data-disabled": La(this.root.opts.disabled.current), [Kc.content]: "", ...this.opts.hiddenUntilFound.current && !this.shouldRender ? {} : { hidden: this.opts.hiddenUntilFound.current ? !this.shouldRender : this.opts.forceMount.current ? void 0 : !this.shouldRender }, ...this.attachment })));
    this.opts = e, this.root = r, g(__privateGet(this, _r8), r.opts.open.current, true), this.root.contentId = this.opts.id.current, this.attachment = kr(this.opts.ref, (n) => this.root.contentNode = n), On.pre(() => this.opts.id.current, (n) => {
      this.root.contentId = n;
    }), hi(() => {
      const n = requestAnimationFrame(() => {
        g(__privateGet(this, _r8), false);
      });
      return () => {
        cancelAnimationFrame(n);
      };
    }), On.pre([() => this.opts.ref.current, () => this.opts.hiddenUntilFound.current], ([n, a]) => !n || !a ? void 0 : xn(n, "beforematch", () => {
      this.root.opts.open.current || requestAnimationFrame(() => {
        this.root.opts.open.current = true;
      });
    })), On([() => this.opts.ref.current, () => this.present], ([n]) => {
      n && Eg(() => {
        if (!this.opts.ref.current) return;
        __privateSet(this, _t14, __privateGet(this, _t14) || { transitionDuration: n.style.transitionDuration, animationName: n.style.animationName }), n.style.transitionDuration = "0s", n.style.animationName = "none";
        const a = n.getBoundingClientRect();
        if (g(__privateGet(this, _a6), a.height, true), g(__privateGet(this, _n7), a.width, true), !s(__privateGet(this, _r8))) {
          const { animationName: o, transitionDuration: i } = __privateGet(this, _t14);
          n.style.transitionDuration = i, n.style.animationName = o;
        }
      });
    });
  }
  static create(e) {
    return new _Jc(e, Xc.get());
  }
  get present() {
    return s(__privateGet(this, _e15));
  }
  set present(e) {
    g(__privateGet(this, _e15), e);
  }
  get shouldRender() {
    return this.root.contentPresence.shouldRender;
  }
  get snippetProps() {
    return s(__privateGet(this, _s5));
  }
  set snippetProps(e) {
    g(__privateGet(this, _s5), e);
  }
  get props() {
    return s(__privateGet(this, _o5));
  }
  set props(e) {
    g(__privateGet(this, _o5), e);
  }
};
_e15 = new WeakMap();
_t14 = new WeakMap();
_r8 = new WeakMap();
_n7 = new WeakMap();
_a6 = new WeakMap();
_s5 = new WeakMap();
_o5 = new WeakMap();
let Jc = _Jc;
const _Qc = class _Qc {
  constructor(e, r) {
    __publicField(this, "opts");
    __publicField(this, "root");
    __publicField(this, "attachment");
    __privateAdd(this, _e16, V(() => this.opts.disabled.current || this.root.opts.disabled.current));
    __privateAdd(this, _t15, V(() => ({ id: this.opts.id.current, type: "button", disabled: s(__privateGet(this, _e16)), "aria-controls": this.root.contentId, "aria-expanded": Gc(this.root.opts.open.current), "data-state": Wc(this.root.opts.open.current), "data-disabled": La(s(__privateGet(this, _e16))), [Kc.trigger]: "", onclick: this.onclick, onkeydown: this.onkeydown, ...this.attachment })));
    this.opts = e, this.root = r, this.attachment = kr(this.opts.ref), this.onclick = this.onclick.bind(this), this.onkeydown = this.onkeydown.bind(this);
  }
  static create(e) {
    return new _Qc(e, Xc.get());
  }
  onclick(e) {
    if (!s(__privateGet(this, _e16))) {
      if (e.button !== 0) return e.preventDefault();
      this.root.toggleOpen();
    }
  }
  onkeydown(e) {
    s(__privateGet(this, _e16)) || (e.key === Yc || e.key === qc) && (e.preventDefault(), this.root.toggleOpen());
  }
  get props() {
    return s(__privateGet(this, _t15));
  }
  set props(e) {
    g(__privateGet(this, _t15), e);
  }
};
_e16 = new WeakMap();
_t15 = new WeakMap();
let Qc = _Qc;
var _1 = _("<div><!></div>");
function b1(t, e) {
  const r = Pr();
  De(e, true);
  let n = ae(e, "id", 19, () => $r(r)), a = ae(e, "ref", 15, null), o = ae(e, "open", 15, false), i = ae(e, "disabled", 3, false), l = ae(e, "onOpenChange", 3, ni), c = ae(e, "onOpenChangeComplete", 3, ni), f = ut(e, ["$$slots", "$$events", "$$legacy", "children", "child", "id", "ref", "open", "disabled", "onOpenChange", "onOpenChangeComplete"]);
  const p = Zc.create({ open: Ke(() => o(), (k) => {
    o(k), l()(k);
  }), disabled: Ke(() => i()), id: Ke(() => n()), ref: Ke(() => a(), (k) => a(k)), onOpenChangeComplete: Ke(() => c()) }), m = V(() => tr(f, p.props));
  var h = Ae(), x = re(h);
  {
    var b = (k) => {
      var D = Ae(), U = re(D);
      bt(U, () => e.child, () => ({ props: s(m) })), u(k, D);
    }, y = (k) => {
      var D = _1();
      Gt(D, () => ({ ...s(m) }));
      var U = d(D);
      bt(U, () => e.children ?? vt), u(k, D);
    };
    I(x, (k) => {
      e.child ? k(b) : k(y, -1);
    });
  }
  u(t, h), Le();
}
var x1 = _("<div><!></div>");
function y1(t, e) {
  const r = Pr();
  De(e, true);
  let n = ae(e, "ref", 15, null), a = ae(e, "forceMount", 3, false), o = ae(e, "hiddenUntilFound", 3, false), i = ae(e, "id", 19, () => $r(r)), l = ut(e, ["$$slots", "$$events", "$$legacy", "child", "ref", "forceMount", "hiddenUntilFound", "children", "id"]);
  const c = Jc.create({ id: Ke(() => i()), forceMount: Ke(() => a()), hiddenUntilFound: Ke(() => o()), ref: Ke(() => n(), (b) => n(b)) }), f = V(() => tr(l, c.props));
  var p = Ae(), m = re(p);
  {
    var h = (b) => {
      var y = Ae(), k = re(y);
      {
        let D = V(() => ({ ...c.snippetProps, props: s(f) }));
        bt(k, () => e.child, () => s(D));
      }
      u(b, y);
    }, x = (b) => {
      var y = x1();
      Gt(y, () => ({ ...s(f) }));
      var k = d(y);
      bt(k, () => e.children ?? vt), u(b, y);
    };
    I(m, (b) => {
      e.child ? b(h) : b(x, -1);
    });
  }
  u(t, p), Le();
}
var w1 = _("<button><!></button>");
function k1(t, e) {
  const r = Pr();
  De(e, true);
  let n = ae(e, "ref", 15, null), a = ae(e, "id", 19, () => $r(r)), o = ae(e, "disabled", 3, false), i = ut(e, ["$$slots", "$$events", "$$legacy", "children", "child", "ref", "id", "disabled"]);
  const l = Qc.create({ id: Ke(() => a()), ref: Ke(() => n(), (x) => n(x)), disabled: Ke(() => o()) }), c = V(() => tr(i, l.props));
  var f = Ae(), p = re(f);
  {
    var m = (x) => {
      var b = Ae(), y = re(b);
      bt(y, () => e.child, () => ({ props: s(c) })), u(x, b);
    }, h = (x) => {
      var b = w1();
      Gt(b, () => ({ ...s(c) }));
      var y = d(b);
      bt(y, () => e.children ?? vt), u(x, b);
    };
    I(p, (x) => {
      e.child ? x(m) : x(h, -1);
    });
  }
  u(t, f), Le();
}
const S1 = Ha({ component: "separator", parts: ["root"] });
const _ed = class _ed {
  constructor(e) {
    __publicField(this, "opts");
    __publicField(this, "attachment");
    __privateAdd(this, _e17, V(() => ({ id: this.opts.id.current, role: this.opts.decorative.current ? "none" : "separator", "aria-orientation": this.opts.orientation.current, "aria-hidden": e1(this.opts.decorative.current), "data-orientation": this.opts.orientation.current, [S1.root]: "", ...this.attachment })));
    this.opts = e, this.attachment = kr(e.ref);
  }
  static create(e) {
    return new _ed(e);
  }
  get props() {
    return s(__privateGet(this, _e17));
  }
  set props(e) {
    g(__privateGet(this, _e17), e);
  }
};
_e17 = new WeakMap();
let ed = _ed;
var T1 = _("<div><!></div>");
function A1(t, e) {
  const r = Pr();
  De(e, true);
  let n = ae(e, "id", 19, () => $r(r)), a = ae(e, "ref", 15, null), o = ae(e, "decorative", 3, false), i = ae(e, "orientation", 3, "horizontal"), l = ut(e, ["$$slots", "$$events", "$$legacy", "id", "ref", "child", "children", "decorative", "orientation"]);
  const c = ed.create({ ref: Ke(() => a(), (b) => a(b)), id: Ke(() => n()), decorative: Ke(() => o()), orientation: Ke(() => i()) }), f = V(() => tr(l, c.props));
  var p = Ae(), m = re(p);
  {
    var h = (b) => {
      var y = Ae(), k = re(y);
      bt(k, () => e.child, () => ({ props: s(f) })), u(b, y);
    }, x = (b) => {
      var y = T1();
      Gt(y, () => ({ ...s(f) }));
      var k = d(y);
      bt(k, () => e.children ?? vt), u(b, y);
    };
    I(m, (b) => {
      e.child ? b(h) : b(x, -1);
    });
  }
  u(t, p), Le();
}
const E1 = Ha({ component: "label", parts: ["root"] });
const _td = class _td {
  constructor(e) {
    __publicField(this, "opts");
    __publicField(this, "attachment");
    __privateAdd(this, _e18, V(() => ({ id: this.opts.id.current, [E1.root]: "", onmousedown: this.onmousedown, ...this.attachment })));
    this.opts = e, this.attachment = kr(this.opts.ref), this.onmousedown = this.onmousedown.bind(this);
  }
  static create(e) {
    return new _td(e);
  }
  onmousedown(e) {
    e.detail > 1 && e.preventDefault();
  }
  get props() {
    return s(__privateGet(this, _e18));
  }
  set props(e) {
    g(__privateGet(this, _e18), e);
  }
};
_e18 = new WeakMap();
let td = _td;
var C1 = _("<label><!></label>");
function I1(t, e) {
  const r = Pr();
  De(e, true);
  let n = ae(e, "id", 19, () => $r(r)), a = ae(e, "ref", 15, null), o = ut(e, ["$$slots", "$$events", "$$legacy", "children", "child", "id", "ref", "for"]);
  const i = td.create({ id: Ke(() => n()), ref: Ke(() => a(), (h) => a(h)) }), l = V(() => tr(o, i.props, { for: e.for }));
  var c = Ae(), f = re(c);
  {
    var p = (h) => {
      var x = Ae(), b = re(x);
      bt(b, () => e.child, () => ({ props: s(l) })), u(h, x);
    }, m = (h) => {
      var x = C1();
      Gt(x, () => ({ ...s(l), for: e.for }));
      var b = d(x);
      bt(b, () => e.children ?? vt), u(h, x);
    };
    I(f, (h) => {
      e.child ? h(p) : h(m, -1);
    });
  }
  u(t, c), Le();
}
class _s {
  constructor(e, r) {
    __privateAdd(this, _e19);
    __privateAdd(this, _t16);
    __privateSet(this, _e19, e), __privateSet(this, _t16, r), this.handler = this.handler.bind(this), Ut(this.handler);
  }
  handler() {
    let e = 0;
    const r = __privateGet(this, _e19).call(this);
    if (!r) return;
    const n = new ResizeObserver(() => {
      cancelAnimationFrame(e), e = window.requestAnimationFrame(__privateGet(this, _t16));
    });
    return n.observe(r), () => {
      window.cancelAnimationFrame(e), n.unobserve(r);
    };
  }
}
_e19 = new WeakMap();
_t16 = new WeakMap();
class $g {
  constructor(e, r) {
    __privateAdd(this, _$g_instances);
    __publicField(this, "state");
    __privateAdd(this, _e20);
    this.state = ri(e), __privateSet(this, _e20, r), this.dispatch = this.dispatch.bind(this);
  }
  dispatch(e) {
    this.state.current = __privateMethod(this, _$g_instances, t_fn).call(this, e);
  }
}
_e20 = new WeakMap();
_$g_instances = new WeakSet();
t_fn = function(e) {
  return __privateGet(this, _e20)[this.state.current][e] ?? this.state.current;
};
const Du = /* @__PURE__ */ new WeakMap(), P1 = 16, $1 = { mounted: { UNMOUNT: "unmounted", ANIMATION_OUT: "unmountSuspended" }, unmountSuspended: { MOUNT: "mounted", ANIMATION_END: "unmounted" }, unmounted: { MOUNT: "mounted" } };
class N1 {
  constructor(e) {
    __publicField(this, "opts");
    __privateAdd(this, _e21, ee("none"));
    __privateAdd(this, _t17, ee(nt({ display: "", animationName: "none" })));
    __publicField(this, "initialStatus");
    __publicField(this, "previousPresent");
    __publicField(this, "machine");
    __publicField(this, "present");
    __privateAdd(this, _r9, V(() => ["mounted", "unmountSuspended"].includes(this.machine.state.current)));
    this.opts = e, this.present = this.opts.open, this.initialStatus = e.open.current ? "mounted" : "unmounted", this.previousPresent = new U0(() => this.present.current), this.machine = new $g(this.initialStatus, $1), this.handleAnimationEnd = this.handleAnimationEnd.bind(this), this.handleAnimationStart = this.handleAnimationStart.bind(this), R1(this), M1(this), z1(this);
  }
  get prevAnimationNameState() {
    return s(__privateGet(this, _e21));
  }
  set prevAnimationNameState(e) {
    g(__privateGet(this, _e21), e, true);
  }
  get styles() {
    return s(__privateGet(this, _t17));
  }
  set styles(e) {
    g(__privateGet(this, _t17), e, true);
  }
  handleAnimationEnd(e) {
    if (!this.opts.ref.current) return;
    const r = this.styles.animationName || ai(this.opts.ref.current), n = r.includes(e.animationName) || r === "none";
    e.target === this.opts.ref.current && n && this.machine.dispatch("ANIMATION_END");
  }
  handleAnimationStart(e) {
    if (this.opts.ref.current && e.target === this.opts.ref.current) {
      const r = ai(this.opts.ref.current, true);
      this.prevAnimationNameState = r, this.styles.animationName = r;
    }
  }
  get isPresent() {
    return s(__privateGet(this, _r9));
  }
  set isPresent(e) {
    g(__privateGet(this, _r9), e);
  }
}
_e21 = new WeakMap();
_t17 = new WeakMap();
_r9 = new WeakMap();
function R1(t) {
  On(() => t.present.current, () => {
    if (!t.opts.ref.current || !(t.present.current !== t.previousPresent.current)) return;
    const r = t.prevAnimationNameState, n = ai(t.opts.ref.current, true);
    if (t.styles.animationName = n, t.present.current) t.machine.dispatch("MOUNT");
    else if (n === "none" || t.styles.display === "none") t.machine.dispatch("UNMOUNT");
    else {
      const a = r !== n;
      t.previousPresent.current && a ? t.machine.dispatch("ANIMATION_OUT") : t.machine.dispatch("UNMOUNT");
    }
  });
}
function M1(t) {
  On(() => t.machine.state.current, () => {
    if (!t.opts.ref.current) return;
    const e = t.machine.state.current === "mounted" ? ai(t.opts.ref.current, true) : "none";
    t.prevAnimationNameState = e, t.styles.animationName = e;
  });
}
function z1(t) {
  On(() => t.opts.ref.current, () => {
    if (!t.opts.ref.current) return;
    const e = getComputedStyle(t.opts.ref.current);
    return t.styles = { display: e.display, animationName: e.animationName || "none" }, Fc(xn(t.opts.ref.current, "animationstart", t.handleAnimationStart), xn(t.opts.ref.current, "animationcancel", t.handleAnimationEnd), xn(t.opts.ref.current, "animationend", t.handleAnimationEnd));
  });
}
function ai(t, e = false) {
  if (!t) return "none";
  const r = performance.now(), n = Du.get(t);
  if (!e && n && r - n.timestamp < P1) return n.value;
  const a = getComputedStyle(t).animationName || "none";
  return Du.set(t, { value: a, timestamp: r }), a;
}
function Ci(t, e) {
  De(e, true);
  const r = new N1({ open: Ke(() => e.open), ref: e.ref });
  var n = Ae(), a = re(n);
  {
    var o = (i) => {
      var l = Ae(), c = re(l);
      bt(c, () => e.presence ?? vt, () => ({ present: r.isPresent })), u(i, l);
    };
    I(a, (i) => {
      (e.forceMount || e.open || r.isPresent) && i(o);
    });
  }
  u(t, n), Le();
}
const O1 = Ha({ component: "progress", parts: ["root"] });
const _rd = class _rd {
  constructor(e) {
    __publicField(this, "opts");
    __publicField(this, "attachment");
    __privateAdd(this, _e22, V(() => ({ role: "progressbar", value: this.opts.value.current, "aria-valuemin": this.opts.min.current, "aria-valuemax": this.opts.max.current, "aria-valuenow": this.opts.value.current === null ? void 0 : this.opts.value.current, "data-value": this.opts.value.current === null ? void 0 : this.opts.value.current, "data-state": D1(this.opts.value.current, this.opts.max.current), "data-max": this.opts.max.current, "data-min": this.opts.min.current, "data-indeterminate": this.opts.value.current === null ? "" : void 0, [O1.root]: "", ...this.attachment })));
    this.opts = e, this.attachment = kr(this.opts.ref);
  }
  static create(e) {
    return new _rd(e);
  }
  get props() {
    return s(__privateGet(this, _e22));
  }
  set props(e) {
    g(__privateGet(this, _e22), e);
  }
};
_e22 = new WeakMap();
let rd = _rd;
function D1(t, e) {
  return t === null ? "indeterminate" : t === e ? "loaded" : "loading";
}
var L1 = _("<div><!></div>");
function j1(t, e) {
  const r = Pr();
  De(e, true);
  let n = ae(e, "value", 3, 0), a = ae(e, "max", 3, 100), o = ae(e, "min", 3, 0), i = ae(e, "id", 19, () => $r(r)), l = ae(e, "ref", 15, null), c = ut(e, ["$$slots", "$$events", "$$legacy", "child", "children", "value", "max", "min", "id", "ref"]);
  const f = rd.create({ value: Ke(() => n()), max: Ke(() => a()), min: Ke(() => o()), id: Ke(() => i()), ref: Ke(() => l(), (y) => l(y)) }), p = V(() => tr(c, f.props));
  var m = Ae(), h = re(m);
  {
    var x = (y) => {
      var k = Ae(), D = re(k);
      bt(D, () => e.child, () => ({ props: s(p) })), u(y, k);
    }, b = (y) => {
      var k = L1();
      Gt(k, () => ({ ...s(p) }));
      var D = d(k);
      bt(D, () => e.children ?? vt), u(y, k);
    };
    I(h, (y) => {
      e.child ? y(x) : y(b, -1);
    });
  }
  u(t, m), Le();
}
function B1(t, e, r) {
  return Math.min(r, Math.max(e, t));
}
const vo = Ha({ component: "scroll-area", parts: ["root", "viewport", "corner", "thumb", "scrollbar"] }), go = new wa("ScrollArea.Root"), mo = new wa("ScrollArea.Scrollbar"), Ii = new wa("ScrollArea.ScrollbarVisible"), nd = new wa("ScrollArea.ScrollbarAxis"), Ng = new wa("ScrollArea.ScrollbarShared");
const _ad = class _ad {
  constructor(e) {
    __publicField(this, "opts");
    __publicField(this, "attachment");
    __privateAdd(this, _e23, ee(null));
    __privateAdd(this, _t18, ee(null));
    __privateAdd(this, _r10, ee(null));
    __privateAdd(this, _n8, ee(null));
    __privateAdd(this, _a7, ee(null));
    __privateAdd(this, _s6, ee(0));
    __privateAdd(this, _o6, ee(0));
    __privateAdd(this, _i4, ee(false));
    __privateAdd(this, _l4, ee(false));
    __publicField(this, "domContext");
    __privateAdd(this, _c5, V(() => ({ id: this.opts.id.current, dir: this.opts.dir.current, style: { position: "relative", "--bits-scroll-area-corner-height": `${this.cornerHeight}px`, "--bits-scroll-area-corner-width": `${this.cornerWidth}px` }, [vo.root]: "", ...this.attachment })));
    this.opts = e, this.attachment = kr(e.ref, (r) => this.scrollAreaNode = r), this.domContext = new Q0(e.ref);
  }
  static create(e) {
    return go.set(new _ad(e));
  }
  get scrollAreaNode() {
    return s(__privateGet(this, _e23));
  }
  set scrollAreaNode(e) {
    g(__privateGet(this, _e23), e, true);
  }
  get viewportNode() {
    return s(__privateGet(this, _t18));
  }
  set viewportNode(e) {
    g(__privateGet(this, _t18), e, true);
  }
  get contentNode() {
    return s(__privateGet(this, _r10));
  }
  set contentNode(e) {
    g(__privateGet(this, _r10), e, true);
  }
  get scrollbarXNode() {
    return s(__privateGet(this, _n8));
  }
  set scrollbarXNode(e) {
    g(__privateGet(this, _n8), e, true);
  }
  get scrollbarYNode() {
    return s(__privateGet(this, _a7));
  }
  set scrollbarYNode(e) {
    g(__privateGet(this, _a7), e, true);
  }
  get cornerWidth() {
    return s(__privateGet(this, _s6));
  }
  set cornerWidth(e) {
    g(__privateGet(this, _s6), e, true);
  }
  get cornerHeight() {
    return s(__privateGet(this, _o6));
  }
  set cornerHeight(e) {
    g(__privateGet(this, _o6), e, true);
  }
  get scrollbarXEnabled() {
    return s(__privateGet(this, _i4));
  }
  set scrollbarXEnabled(e) {
    g(__privateGet(this, _i4), e, true);
  }
  get scrollbarYEnabled() {
    return s(__privateGet(this, _l4));
  }
  set scrollbarYEnabled(e) {
    g(__privateGet(this, _l4), e, true);
  }
  get props() {
    return s(__privateGet(this, _c5));
  }
  set props(e) {
    g(__privateGet(this, _c5), e);
  }
};
_e23 = new WeakMap();
_t18 = new WeakMap();
_r10 = new WeakMap();
_n8 = new WeakMap();
_a7 = new WeakMap();
_s6 = new WeakMap();
_o6 = new WeakMap();
_i4 = new WeakMap();
_l4 = new WeakMap();
_c5 = new WeakMap();
let ad = _ad;
const _sd = class _sd {
  constructor(e, r) {
    __publicField(this, "opts");
    __publicField(this, "root");
    __publicField(this, "attachment");
    __privateAdd(this, _e24, ri(v1()));
    __privateAdd(this, _t19, ri(null));
    __publicField(this, "contentAttachment", kr(__privateGet(this, _t19), (e) => this.root.contentNode = e));
    __privateAdd(this, _r11, V(() => ({ id: this.opts.id.current, style: { overflowX: this.root.scrollbarXEnabled ? "scroll" : "hidden", overflowY: this.root.scrollbarYEnabled ? "scroll" : "hidden" }, [vo.viewport]: "", ...this.attachment })));
    __privateAdd(this, _n9, V(() => ({ id: __privateGet(this, _e24).current, "data-scroll-area-content": "", style: { minWidth: this.root.scrollbarXEnabled ? "fit-content" : void 0 }, ...this.contentAttachment })));
    this.opts = e, this.root = r, this.attachment = kr(e.ref, (n) => this.root.viewportNode = n);
  }
  static create(e) {
    return new _sd(e, go.get());
  }
  get props() {
    return s(__privateGet(this, _r11));
  }
  set props(e) {
    g(__privateGet(this, _r11), e);
  }
  get contentProps() {
    return s(__privateGet(this, _n9));
  }
  set contentProps(e) {
    g(__privateGet(this, _n9), e);
  }
};
_e24 = new WeakMap();
_t19 = new WeakMap();
_r11 = new WeakMap();
_n9 = new WeakMap();
let sd = _sd;
const _od = class _od {
  constructor(e, r) {
    __publicField(this, "opts");
    __publicField(this, "root");
    __privateAdd(this, _e25, V(() => this.opts.orientation.current === "horizontal"));
    __privateAdd(this, _t20, ee(false));
    this.opts = e, this.root = r, On(() => this.isHorizontal, (n) => n ? (this.root.scrollbarXEnabled = true, () => {
      this.root.scrollbarXEnabled = false;
    }) : (this.root.scrollbarYEnabled = true, () => {
      this.root.scrollbarYEnabled = false;
    }));
  }
  static create(e) {
    return mo.set(new _od(e, go.get()));
  }
  get isHorizontal() {
    return s(__privateGet(this, _e25));
  }
  set isHorizontal(e) {
    g(__privateGet(this, _e25), e);
  }
  get hasThumb() {
    return s(__privateGet(this, _t20));
  }
  set hasThumb(e) {
    g(__privateGet(this, _t20), e, true);
  }
};
_e25 = new WeakMap();
_t20 = new WeakMap();
let od = _od;
const _id = class _id {
  constructor(e) {
    __publicField(this, "scrollbar");
    __publicField(this, "root");
    __privateAdd(this, _e26, ee(false));
    __privateAdd(this, _t21, V(() => ({ "data-state": this.isVisible ? "visible" : "hidden" })));
    this.scrollbar = e, this.root = e.root, Ut(() => {
      const r = this.root.scrollAreaNode, n = this.root.opts.scrollHideDelay.current;
      let a = 0;
      if (!r) return;
      const o = () => {
        this.root.domContext.clearTimeout(a), yr(() => this.isVisible = true);
      }, i = () => {
        a && this.root.domContext.clearTimeout(a), a = this.root.domContext.setTimeout(() => {
          yr(() => {
            this.scrollbar.hasThumb = false, this.isVisible = false;
          });
        }, n);
      }, l = Fc(xn(r, "pointerenter", o), xn(r, "pointerleave", i));
      return () => {
        this.root.domContext.getWindow().clearTimeout(a), l();
      };
    });
  }
  static create() {
    return new _id(mo.get());
  }
  get isVisible() {
    return s(__privateGet(this, _e26));
  }
  set isVisible(e) {
    g(__privateGet(this, _e26), e, true);
  }
  get props() {
    return s(__privateGet(this, _t21));
  }
  set props(e) {
    g(__privateGet(this, _t21), e);
  }
};
_e26 = new WeakMap();
_t21 = new WeakMap();
let id = _id;
const _ld = class _ld {
  constructor(e) {
    __publicField(this, "scrollbar");
    __publicField(this, "root");
    __publicField(this, "machine", new $g("hidden", { hidden: { SCROLL: "scrolling" }, scrolling: { SCROLL_END: "idle", POINTER_ENTER: "interacting" }, interacting: { SCROLL: "interacting", POINTER_LEAVE: "idle" }, idle: { HIDE: "hidden", SCROLL: "scrolling", POINTER_ENTER: "interacting" } }));
    __privateAdd(this, _e27, V(() => this.machine.state.current === "hidden"));
    __privateAdd(this, _t22, V(() => ({ "data-state": this.machine.state.current === "hidden" ? "hidden" : "visible", onpointerenter: this.onpointerenter, onpointerleave: this.onpointerleave })));
    this.scrollbar = e, this.root = e.root;
    const r = Ei(() => this.machine.dispatch("SCROLL_END"), 100);
    Ut(() => {
      const n = this.machine.state.current, a = this.root.opts.scrollHideDelay.current;
      if (n === "idle") {
        const o = this.root.domContext.setTimeout(() => this.machine.dispatch("HIDE"), a);
        return () => this.root.domContext.clearTimeout(o);
      }
    }), Ut(() => {
      const n = this.root.viewportNode;
      if (!n) return;
      const a = this.scrollbar.isHorizontal ? "scrollLeft" : "scrollTop";
      let o = n[a];
      return xn(n, "scroll", () => {
        const c = n[a];
        o !== c && (this.machine.dispatch("SCROLL"), r()), o = c;
      });
    }), this.onpointerenter = this.onpointerenter.bind(this), this.onpointerleave = this.onpointerleave.bind(this);
  }
  static create() {
    return new _ld(mo.get());
  }
  get isHidden() {
    return s(__privateGet(this, _e27));
  }
  set isHidden(e) {
    g(__privateGet(this, _e27), e);
  }
  onpointerenter(e) {
    this.machine.dispatch("POINTER_ENTER");
  }
  onpointerleave(e) {
    this.machine.dispatch("POINTER_LEAVE");
  }
  get props() {
    return s(__privateGet(this, _t22));
  }
  set props(e) {
    g(__privateGet(this, _t22), e);
  }
};
_e27 = new WeakMap();
_t22 = new WeakMap();
let ld = _ld;
const _Pi = class _Pi {
  constructor(e) {
    __publicField(this, "scrollbar");
    __publicField(this, "root");
    __privateAdd(this, _e28, ee(false));
    __privateAdd(this, _t23, V(() => ({ "data-state": this.isVisible ? "visible" : "hidden" })));
    this.scrollbar = e, this.root = e.root;
    const r = Ei(() => {
      const n = this.root.viewportNode;
      if (!n) return;
      const a = n.offsetWidth < n.scrollWidth, o = n.offsetHeight < n.scrollHeight;
      this.isVisible = this.scrollbar.isHorizontal ? a : o;
    }, 10);
    new _s(() => this.root.viewportNode, r), new _s(() => this.root.contentNode, r);
  }
  static create() {
    return new _Pi(mo.get());
  }
  get isVisible() {
    return s(__privateGet(this, _e28));
  }
  set isVisible(e) {
    g(__privateGet(this, _e28), e, true);
  }
  get props() {
    return s(__privateGet(this, _t23));
  }
  set props(e) {
    g(__privateGet(this, _t23), e);
  }
};
_e28 = new WeakMap();
_t23 = new WeakMap();
let Pi = _Pi;
const _cd = class _cd {
  constructor(e) {
    __publicField(this, "scrollbar");
    __publicField(this, "root");
    __privateAdd(this, _e29, ee(null));
    __privateAdd(this, _t24, ee(0));
    __privateAdd(this, _r12, ee({ content: 0, viewport: 0, scrollbar: { size: 0, paddingStart: 0, paddingEnd: 0 } }));
    __privateAdd(this, _n10, V(() => Rg(this.sizes.viewport, this.sizes.content)));
    __privateAdd(this, _a8, V(() => this.thumbRatio > 0 && this.thumbRatio < 1));
    __privateAdd(this, _s7, ee(""));
    this.scrollbar = e, this.root = e.root, Ut(() => {
      this.scrollbar.hasThumb = this.hasThumb;
    }), Ut(() => {
      !this.scrollbar.hasThumb && this.thumbNode && (this.prevTransformStyle = this.thumbNode.style.transform);
    });
  }
  static create() {
    return Ii.set(new _cd(mo.get()));
  }
  get thumbNode() {
    return s(__privateGet(this, _e29));
  }
  set thumbNode(e) {
    g(__privateGet(this, _e29), e, true);
  }
  get pointerOffset() {
    return s(__privateGet(this, _t24));
  }
  set pointerOffset(e) {
    g(__privateGet(this, _t24), e, true);
  }
  get sizes() {
    return s(__privateGet(this, _r12));
  }
  set sizes(e) {
    g(__privateGet(this, _r12), e);
  }
  get thumbRatio() {
    return s(__privateGet(this, _n10));
  }
  set thumbRatio(e) {
    g(__privateGet(this, _n10), e);
  }
  get hasThumb() {
    return s(__privateGet(this, _a8));
  }
  set hasThumb(e) {
    g(__privateGet(this, _a8), e);
  }
  get prevTransformStyle() {
    return s(__privateGet(this, _s7));
  }
  set prevTransformStyle(e) {
    g(__privateGet(this, _s7), e, true);
  }
  setSizes(e) {
    this.sizes = e;
  }
  getScrollPosition(e, r) {
    return F1({ pointerPos: e, pointerOffset: this.pointerOffset, sizes: this.sizes, dir: r });
  }
  onThumbPointerUp() {
    this.pointerOffset = 0;
  }
  onThumbPointerDown(e) {
    this.pointerOffset = e;
  }
  xOnThumbPositionChange() {
    if (!(this.root.viewportNode && this.thumbNode)) return;
    const e = this.root.viewportNode.scrollLeft, n = `translate3d(${Lu({ scrollPos: e, sizes: this.sizes, dir: this.root.opts.dir.current })}px, 0, 0)`;
    this.thumbNode.style.transform = n, this.prevTransformStyle = n;
  }
  xOnWheelScroll(e) {
    this.root.viewportNode && (this.root.viewportNode.scrollLeft = e);
  }
  xOnDragScroll(e) {
    this.root.viewportNode && (this.root.viewportNode.scrollLeft = this.getScrollPosition(e, this.root.opts.dir.current));
  }
  yOnThumbPositionChange() {
    if (!(this.root.viewportNode && this.thumbNode)) return;
    const e = this.root.viewportNode.scrollTop, n = `translate3d(0, ${Lu({ scrollPos: e, sizes: this.sizes })}px, 0)`;
    this.thumbNode.style.transform = n, this.prevTransformStyle = n;
  }
  yOnWheelScroll(e) {
    this.root.viewportNode && (this.root.viewportNode.scrollTop = e);
  }
  yOnDragScroll(e) {
    this.root.viewportNode && (this.root.viewportNode.scrollTop = this.getScrollPosition(e, this.root.opts.dir.current));
  }
};
_e29 = new WeakMap();
_t24 = new WeakMap();
_r12 = new WeakMap();
_n10 = new WeakMap();
_a8 = new WeakMap();
_s7 = new WeakMap();
let cd = _cd;
const _dd = class _dd {
  constructor(e, r) {
    __publicField(this, "opts");
    __publicField(this, "scrollbarVis");
    __publicField(this, "root");
    __publicField(this, "scrollbar");
    __publicField(this, "attachment");
    __privateAdd(this, _e30, ee());
    __publicField(this, "onThumbPointerDown", (e) => {
      this.scrollbarVis.onThumbPointerDown(e.x);
    });
    __publicField(this, "onDragScroll", (e) => {
      this.scrollbarVis.xOnDragScroll(e.x);
    });
    __publicField(this, "onThumbPointerUp", () => {
      this.scrollbarVis.onThumbPointerUp();
    });
    __publicField(this, "onThumbPositionChange", () => {
      this.scrollbarVis.xOnThumbPositionChange();
    });
    __publicField(this, "onWheelScroll", (e, r) => {
      if (!this.root.viewportNode) return;
      const n = this.root.viewportNode.scrollLeft + e.deltaX;
      this.scrollbarVis.xOnWheelScroll(n), zg(n, r) && e.preventDefault();
    });
    __publicField(this, "onResize", () => {
      this.scrollbar.opts.ref.current && this.root.viewportNode && this.computedStyle && this.scrollbarVis.setSizes({ content: this.root.viewportNode.scrollWidth, viewport: this.root.viewportNode.offsetWidth, scrollbar: { size: this.scrollbar.opts.ref.current.clientWidth, paddingStart: si(this.computedStyle.paddingLeft), paddingEnd: si(this.computedStyle.paddingRight) } });
    });
    __privateAdd(this, _t25, V(() => $i(this.scrollbarVis.sizes)));
    __privateAdd(this, _r13, V(() => ({ id: this.scrollbar.opts.id.current, "data-orientation": "horizontal", style: { bottom: 0, left: this.root.opts.dir.current === "rtl" ? "var(--bits-scroll-area-corner-width)" : 0, right: this.root.opts.dir.current === "ltr" ? "var(--bits-scroll-area-corner-width)" : 0, "--bits-scroll-area-thumb-width": `${this.thumbSize}px` }, ...this.attachment })));
    this.opts = e, this.scrollbarVis = r, this.root = r.root, this.scrollbar = r.scrollbar, this.attachment = kr(this.scrollbar.opts.ref, (n) => this.root.scrollbarXNode = n), Ut(() => {
      this.scrollbar.opts.ref.current && this.opts.mounted.current && (this.computedStyle = getComputedStyle(this.scrollbar.opts.ref.current));
    }), Ut(() => {
      this.onResize();
    });
  }
  static create(e) {
    return nd.set(new _dd(e, Ii.get()));
  }
  get computedStyle() {
    return s(__privateGet(this, _e30));
  }
  set computedStyle(e) {
    g(__privateGet(this, _e30), e, true);
  }
  get thumbSize() {
    return s(__privateGet(this, _t25));
  }
  set thumbSize(e) {
    g(__privateGet(this, _t25), e);
  }
  get props() {
    return s(__privateGet(this, _r13));
  }
  set props(e) {
    g(__privateGet(this, _r13), e);
  }
};
_e30 = new WeakMap();
_t25 = new WeakMap();
_r13 = new WeakMap();
let dd = _dd;
const _ud = class _ud {
  constructor(e, r) {
    __publicField(this, "opts");
    __publicField(this, "scrollbarVis");
    __publicField(this, "root");
    __publicField(this, "scrollbar");
    __publicField(this, "attachment");
    __privateAdd(this, _e31, ee());
    __privateAdd(this, _t26, V(() => $i(this.scrollbarVis.sizes)));
    __privateAdd(this, _r14, V(() => ({ id: this.scrollbar.opts.id.current, "data-orientation": "vertical", style: { top: 0, right: this.root.opts.dir.current === "ltr" ? 0 : void 0, left: this.root.opts.dir.current === "rtl" ? 0 : void 0, bottom: "var(--bits-scroll-area-corner-height)", "--bits-scroll-area-thumb-height": `${this.thumbSize}px` }, ...this.attachment })));
    this.opts = e, this.scrollbarVis = r, this.root = r.root, this.scrollbar = r.scrollbar, this.attachment = kr(this.scrollbar.opts.ref, (n) => this.root.scrollbarYNode = n), Ut(() => {
      this.scrollbar.opts.ref.current && this.opts.mounted.current && (this.computedStyle = getComputedStyle(this.scrollbar.opts.ref.current));
    }), Ut(() => {
      this.onResize();
    }), this.onThumbPointerDown = this.onThumbPointerDown.bind(this), this.onDragScroll = this.onDragScroll.bind(this), this.onThumbPointerUp = this.onThumbPointerUp.bind(this), this.onThumbPositionChange = this.onThumbPositionChange.bind(this), this.onWheelScroll = this.onWheelScroll.bind(this), this.onResize = this.onResize.bind(this);
  }
  static create(e) {
    return nd.set(new _ud(e, Ii.get()));
  }
  get computedStyle() {
    return s(__privateGet(this, _e31));
  }
  set computedStyle(e) {
    g(__privateGet(this, _e31), e, true);
  }
  onThumbPointerDown(e) {
    this.scrollbarVis.onThumbPointerDown(e.y);
  }
  onDragScroll(e) {
    this.scrollbarVis.yOnDragScroll(e.y);
  }
  onThumbPointerUp() {
    this.scrollbarVis.onThumbPointerUp();
  }
  onThumbPositionChange() {
    this.scrollbarVis.yOnThumbPositionChange();
  }
  onWheelScroll(e, r) {
    if (!this.root.viewportNode) return;
    const n = this.root.viewportNode.scrollTop + e.deltaY;
    this.scrollbarVis.yOnWheelScroll(n), zg(n, r) && e.preventDefault();
  }
  onResize() {
    this.scrollbar.opts.ref.current && this.root.viewportNode && this.computedStyle && this.scrollbarVis.setSizes({ content: this.root.viewportNode.scrollHeight, viewport: this.root.viewportNode.offsetHeight, scrollbar: { size: this.scrollbar.opts.ref.current.clientHeight, paddingStart: si(this.computedStyle.paddingTop), paddingEnd: si(this.computedStyle.paddingBottom) } });
  }
  get thumbSize() {
    return s(__privateGet(this, _t26));
  }
  set thumbSize(e) {
    g(__privateGet(this, _t26), e);
  }
  get props() {
    return s(__privateGet(this, _r14));
  }
  set props(e) {
    g(__privateGet(this, _r14), e);
  }
};
_e31 = new WeakMap();
_t26 = new WeakMap();
_r14 = new WeakMap();
let ud = _ud;
const _fd = class _fd {
  constructor(e) {
    __privateAdd(this, _fd_instances);
    __publicField(this, "scrollbarState");
    __publicField(this, "root");
    __publicField(this, "scrollbarVis");
    __publicField(this, "scrollbar");
    __privateAdd(this, _e32, ee(null));
    __privateAdd(this, _t27, ee(""));
    __publicField(this, "handleResize");
    __publicField(this, "handleThumbPositionChange");
    __publicField(this, "handleWheelScroll");
    __publicField(this, "handleThumbPointerDown");
    __publicField(this, "handleThumbPointerUp");
    __privateAdd(this, _r15, V(() => this.scrollbarVis.sizes.content - this.scrollbarVis.sizes.viewport));
    __privateAdd(this, _a9, V(() => tr({ ...this.scrollbarState.props, style: { position: "absolute", ...this.scrollbarState.props.style }, [vo.scrollbar]: "", onpointerdown: this.onpointerdown, onpointermove: this.onpointermove, onpointerup: this.onpointerup, onlostpointercapture: this.onlostpointercapture })));
    this.scrollbarState = e, this.root = e.root, this.scrollbarVis = e.scrollbarVis, this.scrollbar = e.scrollbarVis.scrollbar, this.handleResize = Ei(() => this.scrollbarState.onResize(), 10), this.handleThumbPositionChange = this.scrollbarState.onThumbPositionChange, this.handleWheelScroll = this.scrollbarState.onWheelScroll, this.handleThumbPointerDown = this.scrollbarState.onThumbPointerDown, this.handleThumbPointerUp = this.scrollbarState.onThumbPointerUp, Ut(() => {
      const r = this.maxScrollPos, n = this.scrollbar.opts.ref.current;
      this.root.viewportNode;
      const a = (i) => {
        const l = i.target;
        (n == null ? void 0 : n.contains(l)) && this.handleWheelScroll(i, r);
      };
      return xn(this.root.domContext.getDocument(), "wheel", a, { passive: false });
    }), hi(() => {
      this.scrollbarVis.sizes, yr(() => this.handleThumbPositionChange());
    }), new _s(() => this.scrollbar.opts.ref.current, this.handleResize), new _s(() => this.root.contentNode, this.handleResize), this.onpointerdown = this.onpointerdown.bind(this), this.onpointermove = this.onpointermove.bind(this), this.onpointerup = this.onpointerup.bind(this), this.onlostpointercapture = this.onlostpointercapture.bind(this);
  }
  static create() {
    return Ng.set(new _fd(nd.get()));
  }
  get rect() {
    return s(__privateGet(this, _e32));
  }
  set rect(e) {
    g(__privateGet(this, _e32), e);
  }
  get prevWebkitUserSelect() {
    return s(__privateGet(this, _t27));
  }
  set prevWebkitUserSelect(e) {
    g(__privateGet(this, _t27), e, true);
  }
  get maxScrollPos() {
    return s(__privateGet(this, _r15));
  }
  set maxScrollPos(e) {
    g(__privateGet(this, _r15), e);
  }
  handleDragScroll(e) {
    if (!this.rect) return;
    const r = e.clientX - this.rect.left, n = e.clientY - this.rect.top;
    this.scrollbarState.onDragScroll({ x: r, y: n });
  }
  onpointerdown(e) {
    var _a10;
    if (e.button !== 0) return;
    e.target.setPointerCapture(e.pointerId), this.rect = ((_a10 = this.scrollbar.opts.ref.current) == null ? void 0 : _a10.getBoundingClientRect()) ?? null, this.prevWebkitUserSelect = this.root.domContext.getDocument().body.style.webkitUserSelect, this.root.domContext.getDocument().body.style.webkitUserSelect = "none", this.root.viewportNode && (this.root.viewportNode.style.scrollBehavior = "auto"), this.handleDragScroll(e);
  }
  onpointermove(e) {
    this.handleDragScroll(e);
  }
  onpointerup(e) {
    const r = e.target;
    r.hasPointerCapture(e.pointerId) && r.releasePointerCapture(e.pointerId), __privateMethod(this, _fd_instances, n_fn2).call(this);
  }
  onlostpointercapture(e) {
    __privateMethod(this, _fd_instances, n_fn2).call(this);
  }
  get props() {
    return s(__privateGet(this, _a9));
  }
  set props(e) {
    g(__privateGet(this, _a9), e);
  }
};
_e32 = new WeakMap();
_t27 = new WeakMap();
_r15 = new WeakMap();
_fd_instances = new WeakSet();
n_fn2 = function() {
  this.rect !== null && (this.root.domContext.getDocument().body.style.webkitUserSelect = this.prevWebkitUserSelect, this.root.viewportNode && (this.root.viewportNode.style.scrollBehavior = ""), this.rect = null);
};
_a9 = new WeakMap();
let fd = _fd;
const _pd = class _pd {
  constructor(e, r) {
    __publicField(this, "opts");
    __publicField(this, "scrollbarState");
    __publicField(this, "attachment");
    __privateAdd(this, _e33);
    __privateAdd(this, _t28, ee());
    __privateAdd(this, _r16, Ei(() => {
      s(__privateGet(this, _t28)) && (s(__privateGet(this, _t28))(), g(__privateGet(this, _t28), void 0));
    }, 100));
    __privateAdd(this, _n11, V(() => ({ id: this.opts.id.current, "data-state": this.scrollbarState.scrollbarVis.hasThumb ? "visible" : "hidden", style: { width: "var(--bits-scroll-area-thumb-width)", height: "var(--bits-scroll-area-thumb-height)", transform: this.scrollbarState.scrollbarVis.prevTransformStyle }, onpointerdowncapture: this.onpointerdowncapture, onpointerup: this.onpointerup, [vo.thumb]: "", ...this.attachment })));
    this.opts = e, this.scrollbarState = r, __privateSet(this, _e33, r.root), this.attachment = kr(this.opts.ref, (n) => this.scrollbarState.scrollbarVis.thumbNode = n), Ut(() => {
      const n = __privateGet(this, _e33).viewportNode;
      if (!n) return;
      const a = () => {
        if (__privateGet(this, _r16).call(this), !s(__privateGet(this, _t28))) {
          const i = U1(n, this.scrollbarState.handleThumbPositionChange);
          g(__privateGet(this, _t28), i, true), this.scrollbarState.handleThumbPositionChange();
        }
      };
      return yr(() => this.scrollbarState.handleThumbPositionChange()), xn(n, "scroll", a);
    }), this.onpointerdowncapture = this.onpointerdowncapture.bind(this), this.onpointerup = this.onpointerup.bind(this);
  }
  static create(e) {
    return new _pd(e, Ng.get());
  }
  onpointerdowncapture(e) {
    const r = e.target;
    if (!r) return;
    const n = r.getBoundingClientRect(), a = e.clientX - n.left, o = e.clientY - n.top;
    this.scrollbarState.handleThumbPointerDown({ x: a, y: o });
  }
  onpointerup(e) {
    this.scrollbarState.handleThumbPointerUp();
  }
  get props() {
    return s(__privateGet(this, _n11));
  }
  set props(e) {
    g(__privateGet(this, _n11), e);
  }
};
_e33 = new WeakMap();
_t28 = new WeakMap();
_r16 = new WeakMap();
_n11 = new WeakMap();
let pd = _pd;
const _vd = class _vd {
  constructor(e, r) {
    __publicField(this, "opts");
    __publicField(this, "root");
    __publicField(this, "attachment");
    __privateAdd(this, _e34, ee(0));
    __privateAdd(this, _t29, ee(0));
    __privateAdd(this, _r17, V(() => !!(s(__privateGet(this, _e34)) && s(__privateGet(this, _t29)))));
    __privateAdd(this, _n12, V(() => ({ id: this.opts.id.current, style: { width: s(__privateGet(this, _e34)), height: s(__privateGet(this, _t29)), position: "absolute", right: this.root.opts.dir.current === "ltr" ? 0 : void 0, left: this.root.opts.dir.current === "rtl" ? 0 : void 0, bottom: 0 }, [vo.corner]: "", ...this.attachment })));
    this.opts = e, this.root = r, this.attachment = kr(this.opts.ref), new _s(() => this.root.scrollbarXNode, () => {
      var _a10;
      const n = ((_a10 = this.root.scrollbarXNode) == null ? void 0 : _a10.offsetHeight) || 0;
      this.root.cornerHeight = n, g(__privateGet(this, _t29), n, true);
    }), new _s(() => this.root.scrollbarYNode, () => {
      var _a10;
      const n = ((_a10 = this.root.scrollbarYNode) == null ? void 0 : _a10.offsetWidth) || 0;
      this.root.cornerWidth = n, g(__privateGet(this, _e34), n, true);
    });
  }
  static create(e) {
    return new _vd(e, go.get());
  }
  get hasSize() {
    return s(__privateGet(this, _r17));
  }
  set hasSize(e) {
    g(__privateGet(this, _r17), e);
  }
  get props() {
    return s(__privateGet(this, _n12));
  }
  set props(e) {
    g(__privateGet(this, _n12), e);
  }
};
_e34 = new WeakMap();
_t29 = new WeakMap();
_r17 = new WeakMap();
_n12 = new WeakMap();
let vd = _vd;
function si(t) {
  return t ? Number.parseInt(t, 10) : 0;
}
function Rg(t, e) {
  const r = t / e;
  return Number.isNaN(r) ? 0 : r;
}
function $i(t) {
  const e = Rg(t.viewport, t.content), r = t.scrollbar.paddingStart + t.scrollbar.paddingEnd, n = (t.scrollbar.size - r) * e;
  return Math.max(n, 18);
}
function F1({ pointerPos: t, pointerOffset: e, sizes: r, dir: n = "ltr" }) {
  const a = $i(r), o = a / 2, i = e || o, l = a - i, c = r.scrollbar.paddingStart + i, f = r.scrollbar.size - r.scrollbar.paddingEnd - l, p = r.content - r.viewport, m = n === "ltr" ? [0, p] : [p * -1, 0];
  return Mg([c, f], m)(t);
}
function Lu({ scrollPos: t, sizes: e, dir: r = "ltr" }) {
  const n = $i(e), a = e.scrollbar.paddingStart + e.scrollbar.paddingEnd, o = e.scrollbar.size - a, i = e.content - e.viewport, l = o - n, c = r === "ltr" ? [0, i] : [i * -1, 0], f = B1(t, c[0], c[1]);
  return Mg([0, i], [0, l])(f);
}
function Mg(t, e) {
  return (r) => {
    if (t[0] === t[1] || e[0] === e[1]) return e[0];
    const n = (e[1] - e[0]) / (t[1] - t[0]);
    return e[0] + n * (r - t[0]);
  };
}
function zg(t, e) {
  return t > 0 && t < e;
}
function U1(t, e) {
  let r = { left: t.scrollLeft, top: t.scrollTop }, n = 0;
  const a = Ig(t);
  return (function o() {
    const i = { left: t.scrollLeft, top: t.scrollTop }, l = r.left !== i.left, c = r.top !== i.top;
    (l || c) && e(), r = i, n = a.requestAnimationFrame(o);
  })(), () => a.cancelAnimationFrame(n);
}
var G1 = _("<div><!></div>");
function W1(t, e) {
  const r = Pr();
  De(e, true);
  let n = ae(e, "ref", 15, null), a = ae(e, "id", 19, () => $r(r)), o = ae(e, "type", 3, "hover"), i = ae(e, "dir", 3, "ltr"), l = ae(e, "scrollHideDelay", 3, 600), c = ut(e, ["$$slots", "$$events", "$$legacy", "ref", "id", "type", "dir", "scrollHideDelay", "children", "child"]);
  const f = ad.create({ type: Ke(() => o()), dir: Ke(() => i()), scrollHideDelay: Ke(() => l()), id: Ke(() => a()), ref: Ke(() => n(), (y) => n(y)) }), p = V(() => tr(c, f.props));
  var m = Ae(), h = re(m);
  {
    var x = (y) => {
      var k = Ae(), D = re(k);
      bt(D, () => e.child, () => ({ props: s(p) })), u(y, k);
    }, b = (y) => {
      var k = G1();
      Gt(k, () => ({ ...s(p) }));
      var D = d(k);
      bt(D, () => e.children ?? vt), u(y, k);
    };
    I(h, (y) => {
      e.child ? y(x) : y(b, -1);
    });
  }
  u(t, m), Le();
}
var V1 = _("<div><div><!></div></div>");
function H1(t, e) {
  const r = Pr();
  De(e, true);
  let n = ae(e, "ref", 15, null), a = ae(e, "id", 19, () => $r(r)), o = ut(e, ["$$slots", "$$events", "$$legacy", "ref", "id", "children"]);
  const i = sd.create({ id: Ke(() => a()), ref: Ke(() => n(), (h) => n(h)) }), l = V(() => tr(o, i.props)), c = V(() => tr({}, i.contentProps));
  var f = V1();
  Gt(f, () => ({ ...s(l) }));
  var p = d(f);
  Gt(p, () => ({ ...s(c) }));
  var m = d(p);
  bt(m, () => e.children ?? vt), u(t, f), Le();
}
var q1 = _("<div><!></div>");
function Og(t, e) {
  De(e, true);
  let r = ut(e, ["$$slots", "$$events", "$$legacy", "child", "children"]);
  const n = fd.create(), a = V(() => tr(r, n.props));
  var o = Ae(), i = re(o);
  {
    var l = (f) => {
      var p = Ae(), m = re(p);
      bt(m, () => e.child, () => ({ props: s(a) })), u(f, p);
    }, c = (f) => {
      var p = q1();
      Gt(p, () => ({ ...s(a) }));
      var m = d(p);
      bt(m, () => e.children ?? vt), u(f, p);
    };
    I(i, (f) => {
      e.child ? f(l) : f(c, -1);
    });
  }
  u(t, o), Le();
}
function Y1(t, e) {
  De(e, true);
  let r = ut(e, ["$$slots", "$$events", "$$legacy"]);
  const n = new Uc(), a = dd.create({ mounted: Ke(() => n.current) }), o = V(() => tr(r, a.props));
  Og(t, et(() => s(o))), Le();
}
function K1(t, e) {
  De(e, true);
  let r = ut(e, ["$$slots", "$$events", "$$legacy"]);
  const n = new Uc(), a = ud.create({ mounted: Ke(() => n.current) }), o = V(() => tr(r, a.props));
  Og(t, et(() => s(o))), Le();
}
function Ni(t, e) {
  De(e, true);
  let r = ut(e, ["$$slots", "$$events", "$$legacy"]);
  const n = cd.create();
  var a = Ae(), o = re(a);
  {
    var i = (c) => {
      Y1(c, et(() => r));
    }, l = (c) => {
      K1(c, et(() => r));
    };
    I(o, (c) => {
      n.scrollbar.opts.orientation.current === "horizontal" ? c(i) : c(l, -1);
    });
  }
  u(t, a), Le();
}
function X1(t, e) {
  De(e, true);
  let r = ae(e, "forceMount", 3, false), n = ut(e, ["$$slots", "$$events", "$$legacy", "forceMount"]);
  const a = Pi.create(), o = V(() => tr(n, a.props));
  {
    const i = (c) => {
      Ni(c, et(() => s(o)));
    };
    let l = V(() => r() || a.isVisible);
    Ci(t, { get open() {
      return s(l);
    }, get ref() {
      return a.scrollbar.opts.ref;
    }, presence: i, $$slots: { presence: true } });
  }
  Le();
}
function Z1(t, e) {
  De(e, true);
  let r = ae(e, "forceMount", 3, false), n = ut(e, ["$$slots", "$$events", "$$legacy", "forceMount"]);
  const a = ld.create(), o = V(() => tr(n, a.props));
  {
    const i = (c) => {
      Ni(c, et(() => s(o)));
    };
    let l = V(() => r() || !a.isHidden);
    Ci(t, et(() => s(o), { get open() {
      return s(l);
    }, get ref() {
      return a.scrollbar.opts.ref;
    }, presence: i, $$slots: { presence: true } }));
  }
  Le();
}
function J1(t, e) {
  De(e, true);
  let r = ae(e, "forceMount", 3, false), n = ut(e, ["$$slots", "$$events", "$$legacy", "forceMount"]);
  const a = id.create(), o = Pi.create(), i = V(() => tr(n, a.props, o.props, { "data-state": a.isVisible ? "visible" : "hidden" })), l = V(() => r() || a.isVisible && o.isVisible);
  Ci(t, { get open() {
    return s(l);
  }, get ref() {
    return o.scrollbar.opts.ref;
  }, presence: (f) => {
    Ni(f, et(() => s(i)));
  }, $$slots: { presence: true } }), Le();
}
function Q1(t, e) {
  const r = Pr();
  De(e, true);
  let n = ae(e, "ref", 15, null), a = ae(e, "id", 19, () => $r(r)), o = ut(e, ["$$slots", "$$events", "$$legacy", "ref", "id", "orientation"]);
  const i = od.create({ orientation: Ke(() => e.orientation), id: Ke(() => a()), ref: Ke(() => n(), (b) => n(b)) }), l = V(() => i.root.opts.type.current);
  var c = Ae(), f = re(c);
  {
    var p = (b) => {
      J1(b, et(() => o, { get id() {
        return a();
      } }));
    }, m = (b) => {
      Z1(b, et(() => o, { get id() {
        return a();
      } }));
    }, h = (b) => {
      X1(b, et(() => o, { get id() {
        return a();
      } }));
    }, x = (b) => {
      Ni(b, et(() => o, { get id() {
        return a();
      } }));
    };
    I(f, (b) => {
      s(l) === "hover" ? b(p) : s(l) === "scroll" ? b(m, 1) : s(l) === "auto" ? b(h, 2) : s(l) === "always" && b(x, 3);
    });
  }
  u(t, c), Le();
}
var ey = _("<div><!></div>");
function ty(t, e) {
  De(e, true);
  let r = ae(e, "ref", 15, null), n = ut(e, ["$$slots", "$$events", "$$legacy", "ref", "id", "child", "children", "present"]);
  const a = new Uc(), o = pd.create({ id: Ke(() => e.id), ref: Ke(() => r(), (m) => r(m)), mounted: Ke(() => a.current) }), i = V(() => tr(n, o.props, { style: { hidden: !e.present } }));
  var l = Ae(), c = re(l);
  {
    var f = (m) => {
      var h = Ae(), x = re(h);
      bt(x, () => e.child, () => ({ props: s(i) })), u(m, h);
    }, p = (m) => {
      var h = ey();
      Gt(h, () => ({ ...s(i) }));
      var x = d(h);
      bt(x, () => e.children ?? vt), u(m, h);
    };
    I(c, (m) => {
      e.child ? m(f) : m(p, -1);
    });
  }
  u(t, l), Le();
}
function ry(t, e) {
  const r = Pr();
  De(e, true);
  let n = ae(e, "id", 19, () => $r(r)), a = ae(e, "ref", 15, null), o = ae(e, "forceMount", 3, false), i = ut(e, ["$$slots", "$$events", "$$legacy", "id", "ref", "forceMount"]);
  const l = Ii.get();
  {
    const c = (p, m) => {
      let h = () => m == null ? void 0 : m().present;
      ty(p, et(() => i, { get id() {
        return n();
      }, get present() {
        return h();
      }, get ref() {
        return a();
      }, set ref(x) {
        a(x);
      } }));
    };
    let f = V(() => o() || l.hasThumb);
    Ci(t, { get open() {
      return s(f);
    }, get ref() {
      return l.scrollbar.opts.ref;
    }, presence: c, $$slots: { presence: true } });
  }
  Le();
}
var ny = _("<div><!></div>");
function ay(t, e) {
  De(e, true);
  let r = ae(e, "ref", 15, null), n = ut(e, ["$$slots", "$$events", "$$legacy", "ref", "id", "children", "child"]);
  const a = vd.create({ id: Ke(() => e.id), ref: Ke(() => r(), (p) => r(p)) }), o = V(() => tr(n, a.props));
  var i = Ae(), l = re(i);
  {
    var c = (p) => {
      var m = Ae(), h = re(m);
      bt(h, () => e.child, () => ({ props: s(o) })), u(p, m);
    }, f = (p) => {
      var m = ny();
      Gt(m, () => ({ ...s(o) }));
      var h = d(m);
      bt(h, () => e.children ?? vt), u(p, m);
    };
    I(l, (p) => {
      e.child ? p(c) : p(f, -1);
    });
  }
  u(t, i), Le();
}
function sy(t, e) {
  const r = Pr();
  De(e, true);
  let n = ae(e, "ref", 15, null), a = ae(e, "id", 19, () => $r(r)), o = ut(e, ["$$slots", "$$events", "$$legacy", "ref", "id"]);
  const i = go.get(), l = V(() => !!(i.scrollbarXNode && i.scrollbarYNode)), c = V(() => i.opts.type.current !== "scroll" && s(l));
  var f = Ae(), p = re(f);
  {
    var m = (h) => {
      ay(h, et(() => o, { get id() {
        return a();
      }, get ref() {
        return n();
      }, set ref(x) {
        n(x);
      } }));
    };
    I(p, (h) => {
      s(c) && h(m);
    });
  }
  u(t, f), Le();
}
const Dg = Ha({ component: "switch", parts: ["root", "thumb"] }), gd = new wa("Switch.Root");
const _md = class _md {
  constructor(e) {
    __privateAdd(this, _md_instances);
    __publicField(this, "opts");
    __publicField(this, "attachment");
    __privateAdd(this, _t30, V(() => ({ "data-disabled": La(this.opts.disabled.current), "data-state": t1(this.opts.checked.current), "data-required": La(this.opts.required.current) })));
    __privateAdd(this, _r18, V(() => ({ checked: this.opts.checked.current })));
    __privateAdd(this, _n13, V(() => ({ ...this.sharedProps, id: this.opts.id.current, role: "switch", disabled: Pg(this.opts.disabled.current), "aria-checked": r1(this.opts.checked.current), "aria-required": Gc(this.opts.required.current), [Dg.root]: "", onclick: this.onclick, onkeydown: this.onkeydown, ...this.attachment })));
    this.opts = e, this.attachment = kr(e.ref), this.onkeydown = this.onkeydown.bind(this), this.onclick = this.onclick.bind(this);
  }
  static create(e) {
    return gd.set(new _md(e));
  }
  onkeydown(e) {
    !(e.key === qc || e.key === Yc) || this.opts.disabled.current || (e.preventDefault(), __privateMethod(this, _md_instances, e_fn).call(this));
  }
  onclick(e) {
    this.opts.disabled.current || __privateMethod(this, _md_instances, e_fn).call(this);
  }
  get sharedProps() {
    return s(__privateGet(this, _t30));
  }
  set sharedProps(e) {
    g(__privateGet(this, _t30), e);
  }
  get snippetProps() {
    return s(__privateGet(this, _r18));
  }
  set snippetProps(e) {
    g(__privateGet(this, _r18), e);
  }
  get props() {
    return s(__privateGet(this, _n13));
  }
  set props(e) {
    g(__privateGet(this, _n13), e);
  }
};
_md_instances = new WeakSet();
e_fn = function() {
  this.opts.checked.current = !this.opts.checked.current;
};
_t30 = new WeakMap();
_r18 = new WeakMap();
_n13 = new WeakMap();
let md = _md;
const _hd = class _hd {
  constructor(e) {
    __publicField(this, "root");
    __privateAdd(this, _e35, V(() => this.root.opts.name.current !== void 0));
    __privateAdd(this, _t31, V(() => ({ type: "checkbox", name: this.root.opts.name.current, value: this.root.opts.value.current, checked: this.root.opts.checked.current, disabled: this.root.opts.disabled.current, required: this.root.opts.required.current })));
    this.root = e;
  }
  static create() {
    return new _hd(gd.get());
  }
  get shouldRender() {
    return s(__privateGet(this, _e35));
  }
  set shouldRender(e) {
    g(__privateGet(this, _e35), e);
  }
  get props() {
    return s(__privateGet(this, _t31));
  }
  set props(e) {
    g(__privateGet(this, _t31), e);
  }
};
_e35 = new WeakMap();
_t31 = new WeakMap();
let hd = _hd;
const __d = class __d {
  constructor(e, r) {
    __publicField(this, "opts");
    __publicField(this, "root");
    __publicField(this, "attachment");
    __privateAdd(this, _e36, V(() => ({ checked: this.root.opts.checked.current })));
    __privateAdd(this, _t32, V(() => ({ ...this.root.sharedProps, id: this.opts.id.current, [Dg.thumb]: "", ...this.attachment })));
    this.opts = e, this.root = r, this.attachment = kr(e.ref);
  }
  static create(e) {
    return new __d(e, gd.get());
  }
  get snippetProps() {
    return s(__privateGet(this, _e36));
  }
  set snippetProps(e) {
    g(__privateGet(this, _e36), e);
  }
  get props() {
    return s(__privateGet(this, _t32));
  }
  set props(e) {
    g(__privateGet(this, _t32), e);
  }
};
_e36 = new WeakMap();
_t32 = new WeakMap();
let _d = __d;
function oy(t, e) {
  De(e, false);
  const r = hd.create();
  _p();
  var n = Ae(), a = re(n);
  {
    var o = (i) => {
      h1(i, et(() => r.props));
    };
    I(a, (i) => {
      r.shouldRender && i(o);
    });
  }
  u(t, n), Le();
}
var iy = _("<button><!></button>"), ly = _("<!> <!>", 1);
function cy(t, e) {
  const r = Pr();
  De(e, true);
  let n = ae(e, "ref", 15, null), a = ae(e, "id", 19, () => $r(r)), o = ae(e, "disabled", 3, false), i = ae(e, "required", 3, false), l = ae(e, "checked", 15, false), c = ae(e, "value", 3, "on"), f = ae(e, "name", 3, void 0), p = ae(e, "type", 3, "button"), m = ae(e, "onCheckedChange", 3, ni), h = ut(e, ["$$slots", "$$events", "$$legacy", "child", "children", "ref", "id", "disabled", "required", "checked", "value", "name", "type", "onCheckedChange"]);
  const x = md.create({ checked: Ke(() => l(), (M) => {
    var _a10;
    l(M), (_a10 = m()) == null ? void 0 : _a10(M);
  }), disabled: Ke(() => o() ?? false), required: Ke(() => i()), value: Ke(() => c()), name: Ke(() => f()), id: Ke(() => a()), ref: Ke(() => n(), (M) => n(M)) }), b = V(() => tr(h, x.props, { type: p() }));
  var y = ly(), k = re(y);
  {
    var D = (M) => {
      var q = Ae(), F = re(q);
      {
        let P = V(() => ({ props: s(b), ...x.snippetProps }));
        bt(F, () => e.child, () => s(P));
      }
      u(M, q);
    }, U = (M) => {
      var q = iy();
      Gt(q, () => ({ ...s(b) }));
      var F = d(q);
      bt(F, () => e.children ?? vt, () => x.snippetProps), u(M, q);
    };
    I(k, (M) => {
      e.child ? M(D) : M(U, -1);
    });
  }
  var j = v(k, 2);
  oy(j, {}), u(t, y), Le();
}
var dy = _("<span><!></span>");
function uy(t, e) {
  const r = Pr();
  De(e, true);
  let n = ae(e, "ref", 15, null), a = ae(e, "id", 19, () => $r(r)), o = ut(e, ["$$slots", "$$events", "$$legacy", "child", "children", "ref", "id"]);
  const i = _d.create({ id: Ke(() => a()), ref: Ke(() => n(), (h) => n(h)) }), l = V(() => tr(o, i.props));
  var c = Ae(), f = re(c);
  {
    var p = (h) => {
      var x = Ae(), b = re(x);
      {
        let y = V(() => ({ props: s(l), ...i.snippetProps }));
        bt(b, () => e.child, () => s(y));
      }
      u(h, x);
    }, m = (h) => {
      var x = dy();
      Gt(x, () => ({ ...s(l) }));
      var b = d(x);
      bt(b, () => e.children ?? vt, () => i.snippetProps), u(h, x);
    };
    I(f, (h) => {
      e.child ? h(p) : h(m, -1);
    });
  }
  u(t, c), Le();
}
const oi = Ha({ component: "tabs", parts: ["root", "list", "trigger", "content"] }), bd = new wa("Tabs.Root");
const _xd = class _xd {
  constructor(e) {
    __publicField(this, "opts");
    __publicField(this, "attachment");
    __publicField(this, "rovingFocusGroup");
    __privateAdd(this, _e37, ee(nt([])));
    __publicField(this, "valueToTriggerId", new Ou());
    __publicField(this, "valueToContentId", new Ou());
    __privateAdd(this, _t33, V(() => ({ id: this.opts.id.current, "data-orientation": this.opts.orientation.current, [oi.root]: "", ...this.attachment })));
    this.opts = e, this.attachment = kr(e.ref), this.rovingFocusGroup = new u1({ candidateAttr: oi.trigger, rootNode: this.opts.ref, loop: this.opts.loop, orientation: this.opts.orientation });
  }
  static create(e) {
    return bd.set(new _xd(e));
  }
  get triggerIds() {
    return s(__privateGet(this, _e37));
  }
  set triggerIds(e) {
    g(__privateGet(this, _e37), e, true);
  }
  registerTrigger(e, r) {
    return this.triggerIds.push(e), this.valueToTriggerId.set(r, e), () => {
      this.triggerIds = this.triggerIds.filter((n) => n !== e), this.valueToTriggerId.delete(r);
    };
  }
  registerContent(e, r) {
    return this.valueToContentId.set(r, e), () => {
      this.valueToContentId.delete(r);
    };
  }
  setValue(e) {
    this.opts.value.current = e;
  }
  get props() {
    return s(__privateGet(this, _t33));
  }
  set props(e) {
    g(__privateGet(this, _t33), e);
  }
};
_e37 = new WeakMap();
_t33 = new WeakMap();
let xd = _xd;
const _yd = class _yd {
  constructor(e, r) {
    __publicField(this, "opts");
    __publicField(this, "root");
    __publicField(this, "attachment");
    __privateAdd(this, _e38, V(() => this.root.opts.disabled.current));
    __privateAdd(this, _t34, V(() => ({ id: this.opts.id.current, role: "tablist", "aria-orientation": this.root.opts.orientation.current, "data-orientation": this.root.opts.orientation.current, [oi.list]: "", "data-disabled": La(s(__privateGet(this, _e38))), ...this.attachment })));
    this.opts = e, this.root = r, this.attachment = kr(e.ref);
  }
  static create(e) {
    return new _yd(e, bd.get());
  }
  get props() {
    return s(__privateGet(this, _t34));
  }
  set props(e) {
    g(__privateGet(this, _t34), e);
  }
};
_e38 = new WeakMap();
_t34 = new WeakMap();
let yd = _yd;
const _wd = class _wd {
  constructor(e, r) {
    __privateAdd(this, _wd_instances);
    __publicField(this, "opts");
    __publicField(this, "root");
    __publicField(this, "attachment");
    __privateAdd(this, _e39, ee(0));
    __privateAdd(this, _t35, V(() => this.root.opts.value.current === this.opts.value.current));
    __privateAdd(this, _r19, V(() => this.opts.disabled.current || this.root.opts.disabled.current));
    __privateAdd(this, _n14, V(() => this.root.valueToContentId.get(this.opts.value.current)));
    __privateAdd(this, _s8, V(() => ({ id: this.opts.id.current, role: "tab", "data-state": fy(s(__privateGet(this, _t35))), "data-value": this.opts.value.current, "data-orientation": this.root.opts.orientation.current, "data-disabled": La(s(__privateGet(this, _r19))), "aria-selected": Gc(s(__privateGet(this, _t35))), "aria-controls": s(__privateGet(this, _n14)), [oi.trigger]: "", disabled: Pg(s(__privateGet(this, _r19))), tabindex: s(__privateGet(this, _e39)), onclick: this.onclick, onfocus: this.onfocus, onkeydown: this.onkeydown, ...this.attachment })));
    this.opts = e, this.root = r, this.attachment = kr(e.ref), On([() => this.opts.id.current, () => this.opts.value.current], ([n, a]) => this.root.registerTrigger(n, a)), Ut(() => {
      this.root.triggerIds.length, s(__privateGet(this, _t35)) || !this.root.opts.value.current ? g(__privateGet(this, _e39), 0) : g(__privateGet(this, _e39), -1);
    }), this.onfocus = this.onfocus.bind(this), this.onclick = this.onclick.bind(this), this.onkeydown = this.onkeydown.bind(this);
  }
  static create(e) {
    return new _wd(e, bd.get());
  }
  onfocus(e) {
    this.root.opts.activationMode.current !== "automatic" || s(__privateGet(this, _r19)) || __privateMethod(this, _wd_instances, a_fn2).call(this);
  }
  onclick(e) {
    s(__privateGet(this, _r19)) || __privateMethod(this, _wd_instances, a_fn2).call(this);
  }
  onkeydown(e) {
    if (!s(__privateGet(this, _r19))) {
      if (e.key === Yc || e.key === qc) {
        e.preventDefault(), __privateMethod(this, _wd_instances, a_fn2).call(this);
        return;
      }
      this.root.rovingFocusGroup.handleKeydown(this.opts.ref.current, e);
    }
  }
  get props() {
    return s(__privateGet(this, _s8));
  }
  set props(e) {
    g(__privateGet(this, _s8), e);
  }
};
_e39 = new WeakMap();
_t35 = new WeakMap();
_r19 = new WeakMap();
_n14 = new WeakMap();
_wd_instances = new WeakSet();
a_fn2 = function() {
  this.root.opts.value.current !== this.opts.value.current && this.root.setValue(this.opts.value.current);
};
_s8 = new WeakMap();
let wd = _wd;
function fy(t) {
  return t ? "active" : "inactive";
}
var py = _("<div><!></div>");
function vy(t, e) {
  const r = Pr();
  De(e, true);
  let n = ae(e, "id", 19, () => $r(r)), a = ae(e, "ref", 15, null), o = ae(e, "value", 15, ""), i = ae(e, "onValueChange", 3, ni), l = ae(e, "orientation", 3, "horizontal"), c = ae(e, "loop", 3, true), f = ae(e, "activationMode", 3, "automatic"), p = ae(e, "disabled", 3, false), m = ut(e, ["$$slots", "$$events", "$$legacy", "id", "ref", "value", "onValueChange", "orientation", "loop", "activationMode", "disabled", "children", "child"]);
  const h = xd.create({ id: Ke(() => n()), value: Ke(() => o(), (U) => {
    o(U), i()(U);
  }), orientation: Ke(() => l()), loop: Ke(() => c()), activationMode: Ke(() => f()), disabled: Ke(() => p()), ref: Ke(() => a(), (U) => a(U)) }), x = V(() => tr(m, h.props));
  var b = Ae(), y = re(b);
  {
    var k = (U) => {
      var j = Ae(), M = re(j);
      bt(M, () => e.child, () => ({ props: s(x) })), u(U, j);
    }, D = (U) => {
      var j = py();
      Gt(j, () => ({ ...s(x) }));
      var M = d(j);
      bt(M, () => e.children ?? vt), u(U, j);
    };
    I(y, (U) => {
      e.child ? U(k) : U(D, -1);
    });
  }
  u(t, b), Le();
}
var gy = _("<div><!></div>");
function my(t, e) {
  const r = Pr();
  De(e, true);
  let n = ae(e, "id", 19, () => $r(r)), a = ae(e, "ref", 15, null), o = ut(e, ["$$slots", "$$events", "$$legacy", "child", "children", "id", "ref"]);
  const i = yd.create({ id: Ke(() => n()), ref: Ke(() => a(), (h) => a(h)) }), l = V(() => tr(o, i.props));
  var c = Ae(), f = re(c);
  {
    var p = (h) => {
      var x = Ae(), b = re(x);
      bt(b, () => e.child, () => ({ props: s(l) })), u(h, x);
    }, m = (h) => {
      var x = gy();
      Gt(x, () => ({ ...s(l) }));
      var b = d(x);
      bt(b, () => e.children ?? vt), u(h, x);
    };
    I(f, (h) => {
      e.child ? h(p) : h(m, -1);
    });
  }
  u(t, c), Le();
}
var hy = _("<button><!></button>");
function _y(t, e) {
  const r = Pr();
  De(e, true);
  let n = ae(e, "disabled", 3, false), a = ae(e, "id", 19, () => $r(r)), o = ae(e, "type", 3, "button"), i = ae(e, "ref", 15, null), l = ut(e, ["$$slots", "$$events", "$$legacy", "child", "children", "disabled", "id", "type", "value", "ref"]);
  const c = wd.create({ id: Ke(() => a()), disabled: Ke(() => n() ?? false), value: Ke(() => e.value), ref: Ke(() => i(), (b) => i(b)) }), f = V(() => tr(l, c.props, { type: o() }));
  var p = Ae(), m = re(p);
  {
    var h = (b) => {
      var y = Ae(), k = re(y);
      bt(k, () => e.child, () => ({ props: s(f) })), u(b, y);
    }, x = (b) => {
      var y = hy();
      Gt(y, () => ({ ...s(f) }));
      var k = d(y);
      bt(k, () => e.children ?? vt), u(b, y);
    };
    I(m, (b) => {
      e.child ? b(h) : b(x, -1);
    });
  }
  u(t, p), Le();
}
var by = _("<!> <!>", 1);
function ju(t, e) {
  De(e, true);
  let r = ae(e, "ref", 15, null), n = ae(e, "orientation", 3, "vertical"), a = ut(e, ["$$slots", "$$events", "$$legacy", "ref", "class", "orientation", "children"]);
  var o = Ae(), i = re(o);
  {
    let l = V(() => Je("flex touch-none p-px transition-colors select-none", n() === "vertical" && "h-full w-2.5 border-s border-s-transparent", n() === "horizontal" && "h-2.5 flex-col border-t border-t-transparent", e.class));
    dr(i, () => Q1, (c, f) => {
      f(c, et({ "data-slot": "scroll-area-scrollbar", get orientation() {
        return n();
      }, get class() {
        return s(l);
      } }, () => a, { get ref() {
        return r();
      }, set ref(p) {
        r(p);
      }, children: (p, m) => {
        var h = by(), x = re(h);
        bt(x, () => e.children ?? vt);
        var b = v(x, 2);
        dr(b, () => ry, (y, k) => {
          k(y, { "data-slot": "scroll-area-thumb", class: "bg-border relative flex-1 rounded-full" });
        }), u(p, h);
      }, $$slots: { default: true } }));
    });
  }
  u(t, o), Le();
}
var xy = _("<!> <!> <!> <!>", 1);
function Ln(t, e) {
  De(e, true);
  let r = ae(e, "ref", 15, null), n = ae(e, "viewportRef", 15, null), a = ae(e, "orientation", 3, "vertical"), o = ae(e, "scrollbarXClasses", 3, ""), i = ae(e, "scrollbarYClasses", 3, ""), l = ut(e, ["$$slots", "$$events", "$$legacy", "ref", "viewportRef", "class", "orientation", "scrollbarXClasses", "scrollbarYClasses", "children"]);
  var c = Ae(), f = re(c);
  {
    let p = V(() => Je("relative", e.class));
    dr(f, () => W1, (m, h) => {
      h(m, et({ "data-slot": "scroll-area", get class() {
        return s(p);
      } }, () => l, { get ref() {
        return r();
      }, set ref(x) {
        r(x);
      }, children: (x, b) => {
        var y = xy(), k = re(y);
        dr(k, () => H1, (F, P) => {
          P(F, { "data-slot": "scroll-area-viewport", class: "ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] focus-visible:ring-4 focus-visible:outline-1", get ref() {
            return n();
          }, set ref(C) {
            n(C);
          }, children: (C, T) => {
            var N = Ae(), K = re(N);
            bt(K, () => e.children ?? vt), u(C, N);
          }, $$slots: { default: true } });
        });
        var D = v(k, 2);
        {
          var U = (F) => {
            ju(F, { orientation: "vertical", get class() {
              return i();
            } });
          };
          I(D, (F) => {
            (a() === "vertical" || a() === "both") && F(U);
          });
        }
        var j = v(D, 2);
        {
          var M = (F) => {
            ju(F, { orientation: "horizontal", get class() {
              return o();
            } });
          };
          I(j, (F) => {
            (a() === "horizontal" || a() === "both") && F(M);
          });
        }
        var q = v(j, 2);
        dr(q, () => sy, (F, P) => {
          P(F, {});
        }), u(x, y);
      }, $$slots: { default: true } }));
    });
  }
  u(t, c), Le();
}
var yy = _(' <span class="ml-1 opacity-50 tabular-nums"> </span>', 1), wy = _('<div class="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground"><div class="size-6 rounded-full border-2 border-border border-t-primary animate-spin"></div> <span class="text-sm">Loading events\u2026</span></div>'), ky = _('<div class="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground"><!> <span class="text-sm">No events found</span></div>'), Sy = _("<!> ", 1), Ty = _("<!> Running\u2026", 1), Ay = _("<!> Done", 1), Ey = _("<!> Execute manually", 1), Cy = _('<div class="px-5 pb-4 pt-1 flex justify-end"><!></div>'), Iy = _('<div class="mx-3 mb-3"><!></div>'), Py = _('<div class="rounded-xl border bg-card/60 backdrop-blur-md border-border/50 shadow-sm overflow-hidden hover:border-primary/30 transition-all"><div class="flex items-start gap-3 px-5 pt-4 pb-3.5"><div class="size-8 rounded flex items-center justify-center shrink-0 mt-0.5"><!></div> <div class="flex-1 min-w-0"><div class="flex items-center gap-2 mb-2"><span class="text-sm font-medium text-foreground truncate"> </span> <span class="text-muted-foreground/30">\xB7</span> <span class="flex items-center gap-1 text-xs text-muted-foreground shrink-0"><!> </span></div> <h3 class="text-base font-semibold text-foreground leading-snug mb-3"> </h3> <div class="flex items-center gap-2 flex-wrap"><!> <!></div></div></div> <!> <!></div>'), $y = _('<div class="flex flex-col gap-3 max-w-3xl"></div>'), Ny = _('<div class="flex flex-col h-full overflow-hidden"><div class="px-8 pt-5 pb-4 shrink-0 border-b border-border"><div class="flex items-center gap-2 mb-0.5"><h1 class="text-sm font-semibold tracking-tight text-foreground">Event Stream</h1> <span class="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground/50">/ live</span></div> <p class="text-xs text-muted-foreground">Unified log of ingested events and execution traces.</p></div> <div class="flex items-center gap-3 px-8 py-2.5 shrink-0 border-b border-border"><div class="flex items-center gap-1"></div> <div class="flex-1"></div> <div class="relative w-52"><!> <!></div> <!></div> <!></div>');
function Ry(t, e) {
  De(e, true);
  let r = ee(nt([])), n = ee(nt({ total: 0, completed: 0, awaiting_user: 0, escalated: 0, failed: 0 })), a = ee(true), o = ee(""), i = ee(""), l = nt({});
  const c = { gmail: "#ea4335", telegram: "#26a5e4", instagram: "#e1306c", youtube: "#ff0000", slack: "#611f69", twitter: "#1da1f2" };
  async function f() {
    g(a, true);
    try {
      const [{ entries: P }, C, T] = await Promise.all([X_({ limit: 200 }), wc({ limit: 200 }).then((S) => S ?? []), ki()]), N = P.map((S) => ({ ...S, _streamStatus: S.success ? "completed" : "failed" })), K = C.map((S) => ({ ...S, from: S.sender, _streamStatus: S.status === "escalated" ? "escalated" : "awaiting_user", success: null, steps: [] })), W = new Set(N.map((S) => S.emailId)), A = K.filter((S) => !W.has(S.id ?? ""));
      g(r, [...N, ...A].sort((S, w) => Number(w.executedAt ?? w.timestamp ?? 0) - Number(S.executedAt ?? S.timestamp ?? 0)), true), g(n, T, true);
    } catch (P) {
      console.error("StreamView:", P);
    }
    g(a, false);
  }
  Xt(f);
  let p = V(() => s(r).filter((P) => {
    var _a10, _b4, _c6, _d4;
    let C = true;
    if (s(o) === "completed" ? C = P._streamStatus === "completed" : s(o) === "failed" ? C = P._streamStatus === "failed" : s(o) === "awaiting_user" && (C = P._streamStatus === "awaiting_user"), !C) return false;
    if (!s(i)) return true;
    const T = s(i).toLowerCase();
    return ((_a10 = P.subject) == null ? void 0 : _a10.toLowerCase().includes(T)) || ((_b4 = P.from) == null ? void 0 : _b4.toLowerCase().includes(T)) || ((_c6 = P.sender) == null ? void 0 : _c6.toLowerCase().includes(T)) || ((_d4 = P.eventType) == null ? void 0 : _d4.toLowerCase().includes(T));
  }));
  function m(P) {
    if (!P) return "";
    const C = new Date(Number(P)), T = Math.round((Date.now() - C.getTime()) / 6e4);
    if (T < 60) return `${T}m ago`;
    const N = Math.round(T / 60);
    return N < 24 ? `${N}h ago` : C.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
  function h(P) {
    return (P == null ? void 0 : P.replace(/_/g, " ")) ?? "";
  }
  async function x(P) {
    const C = P.id ?? P.emailId ?? "";
    if (!C || C === "null" || C === "undefined") {
      console.warn("StreamView: cannot execute item with invalid id:", C);
      return;
    }
    let T = {};
    try {
      C && typeof C == "string" && C.trim().length > 0 && (T = await io(C) ?? {});
    } catch {
    }
    l[C] = { running: true, steps: [] }, g(r, s(r).map((W) => W.id === C || W.emailId === C ? { ...W, _execId: C } : W), true);
    const N = { type: P.eventType || P.event_type || "UNKNOWN", source: T.sourceType || "gmail", data: { emailId: C, subject: T.subject ?? P.subject, from: T.from ?? P.from ?? P.sender ?? P.source_name, ...T }, metadata: { category: P.event_category } }, K = await co(N, (W) => {
      const A = l[C] || { running: true, steps: [] };
      if (W.phase === "pipeline_loaded") l[C] = { ...A, steps: (W.actions ?? []).map((S) => {
        const w = S;
        return { label: w.name ?? w.commandId, commandId: w.commandId, status: "pending" };
      }) };
      else if (W.phase === "action_start") l[C] = { ...A, steps: A.steps.map((S) => S.commandId === (W.actionId ?? W.commandId) ? { ...S, status: "running" } : S) };
      else if (W.phase === "action_complete") {
        const S = W.result, w = (S == null ? void 0 : S.success) !== false;
        l[C] = { ...A, steps: A.steps.map((R) => R.commandId === (W.actionId ?? W.commandId) ? { ...R, status: w ? "done" : "error", message: S == null ? void 0 : S.message } : R) };
      }
    }, true);
    if (l[C] = { ...l[C], running: false, success: K.success }, K.success) {
      try {
        await vs(C, "executed");
      } catch {
      }
      setTimeout(() => {
        f();
      }, 1500);
    }
  }
  const b = [{ key: "", label: "All", count: () => s(n).total }, { key: "completed", label: "Completed", count: () => s(n).completed }, { key: "awaiting_user", label: "Awaiting", count: () => s(n).awaiting_user }, { key: "failed", label: "Failed", count: () => s(n).failed }];
  var y = Ny(), k = v(d(y), 2), D = d(k);
  Ge(D, 21, () => b, Qe, (P, C) => {
    {
      let T = V(() => s(o) === s(C).key ? "secondary" : "ghost");
      tt(P, { get variant() {
        return s(T);
      }, size: "sm", onclick: () => {
        g(o, s(o) === s(C).key && s(C).key !== "" ? "" : s(C).key, true), f();
      }, class: "h-7 text-xs tracking-tight", children: (N, K) => {
        var W = yy(), A = re(W), S = v(A), w = d(S);
        L((R) => {
          E(A, `${s(C).label ?? ""} `), E(w, R);
        }, [() => s(C).count()]), u(N, W);
      }, $$slots: { default: true } });
    }
  });
  var U = v(D, 4), j = d(U);
  Qo(j, { class: "absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" });
  var M = v(j, 2);
  Pn(M, { placeholder: "Search events\u2026", class: "pl-9 h-8 text-xs", get value() {
    return s(i);
  }, set value(P) {
    g(i, P, true);
  } });
  var q = v(U, 2);
  {
    let P = V(() => Je(s(a) && "[&_svg]:animate-spin"));
    tt(q, { variant: "ghost", size: "icon-sm", onclick: f, get class() {
      return s(P);
    }, children: (C, T) => {
      ms(C, { class: "size-3.5" });
    }, $$slots: { default: true } });
  }
  var F = v(k, 2);
  Ln(F, { class: "flex-1 px-8 py-5", children: (P, C) => {
    var T = Ae(), N = re(T);
    {
      var K = (S) => {
        var w = wy();
        u(S, w);
      }, W = (S) => {
        var w = ky(), R = d(w);
        fg(R, { class: "size-12 opacity-20" }), u(S, w);
      }, A = (S) => {
        var w = $y();
        Ge(w, 21, () => s(p), (R) => R.id ?? R.emailId ?? "", (R, B) => {
          const Z = V(() => c[String(s(B).source_name ?? "")] ?? "#6b7280"), X = V(() => s(B).id ?? s(B).emailId ?? ""), H = V(() => l[s(X)]), te = V(() => {
            var _a10, _b4;
            return ((_a10 = s(B).steps) == null ? void 0 : _a10.length) ? s(B).steps : ((_b4 = s(H)) == null ? void 0 : _b4.steps) || [];
          });
          var Y = Py(), $ = d(Y), O = d($), G = d(O);
          gs(G, { class: "size-4", get style() {
            return `color:${s(Z) ?? ""};`;
          } });
          var J = v(O, 2), se = d(J), ie = d(se), oe = d(ie), de = v(ie, 4), ve = d(de);
          Pl(ve, { class: "size-3" });
          var me = v(ve), ke = v(se, 2), ye = d(ke), we = v(ke, 2), le = d(we);
          {
            var ce = (xe) => {
              Cr(xe, { variant: "outline", class: "gap-1.5 h-6 text-xs font-medium", children: (Se, Fe) => {
                var qe = Sy(), ne = re(qe);
                Rx(ne, { class: "size-3 shrink-0" });
                var fe = v(ne);
                L((be) => E(fe, ` ${be ?? ""}`), [() => h(s(B).event_type)]), u(Se, qe);
              }, $$slots: { default: true } });
            };
            I(le, (xe) => {
              s(B).event_type && xe(ce);
            });
          }
          var pe = v(le, 2);
          {
            var ge = (xe) => {
              Cr(xe, { variant: "secondary", class: "h-6 text-xs capitalize", children: (Se, Fe) => {
                var qe = Be();
                L(() => E(qe, s(B).event_category)), u(Se, qe);
              }, $$slots: { default: true } });
            };
            I(pe, (xe) => {
              s(B).event_category && xe(ge);
            });
          }
          var Te = v($, 2);
          {
            var he = (xe) => {
              var Se = Cy(), Fe = d(Se);
              {
                let qe = V(() => {
                  var _a10, _b4;
                  return ((_a10 = s(H)) == null ? void 0 : _a10.running) || ((_b4 = s(H)) == null ? void 0 : _b4.success) === true;
                });
                tt(Fe, { variant: "outline", size: "sm", class: "gap-1.5 h-7 text-xs", get disabled() {
                  return s(qe);
                }, onclick: () => x(s(B)), children: (ne, fe) => {
                  var be = Ae(), _e40 = re(be);
                  {
                    var $e = (Re) => {
                      var je = Ty(), Ve = re(je);
                      uo(Ve, { class: "size-3 animate-spin" }), u(Re, je);
                    }, Ce = (Re) => {
                      var je = Ay(), Ve = re(je);
                      ss(Ve, { class: "size-3 text-emerald-500" }), u(Re, je);
                    }, ze = (Re) => {
                      var je = Ey(), Ve = re(je);
                      jc(Ve, { class: "size-3" }), u(Re, je);
                    };
                    I(_e40, (Re) => {
                      var _a10, _b4;
                      ((_a10 = s(H)) == null ? void 0 : _a10.running) ? Re($e) : ((_b4 = s(H)) == null ? void 0 : _b4.success) === true ? Re(Ce, 1) : Re(ze, -1);
                    });
                  }
                  u(ne, be);
                }, $$slots: { default: true } });
              }
              u(xe, Se);
            };
            I(Te, (xe) => {
              (s(B)._streamStatus === "awaiting_user" || s(B)._streamStatus === "escalated") && !s(B).success && xe(he);
            });
          }
          var ue = v(Te, 2);
          {
            var Ee = (xe) => {
              var Se = Iy(), Fe = d(Se);
              xg(Fe, { get steps() {
                return s(te);
              } }), u(xe, Se);
            };
            I(ue, (xe) => {
              s(te).length && xe(Ee);
            });
          }
          L((xe) => {
            Rt(O, `background:${s(Z) ?? ""}15;`), E(oe, s(B).sender || s(B).source_name || "Unknown"), E(me, ` ${xe ?? ""}`), E(ye, s(B).subject || s(B).content || "(no subject)");
          }, [() => m(s(B).timestamp)]), u(R, Y);
        }), u(S, w);
      };
      I(N, (S) => {
        s(a) ? S(K) : s(p).length === 0 ? S(W, 1) : S(A, -1);
      });
    }
    u(P, T);
  }, $$slots: { default: true } }), u(t, y), Le();
}
var My = _('<div class="flex items-center gap-2"><label class="text-xs font-bold text-muted-foreground" for="pe-name">NAME</label> <input id="pe-name" type="text" class="bg-black/20 border border-border px-2 py-1 rounded text-sm min-w-[200px]"/></div> <div class="flex items-center gap-2 flex-1"><label class="text-xs font-bold text-muted-foreground" for="pe-desc">DESC</label> <input id="pe-desc" type="text" class="bg-black/20 border border-border px-2 py-1 rounded text-sm w-full"/></div>', 1), zy = _('<div class="group/chip inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/8 border border-blue-500/20 rounded-md text-xs text-blue-400 font-medium transition-all hover:border-blue-500/40"><span class="size-1.5 rounded-full bg-blue-500/60 shrink-0"></span> <button class="ml-0.5 text-blue-500/30 hover:text-red-400 transition-colors text-[10px] font-bold">\u2715</button></div>'), Oy = _('<div class="group/chip inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-md text-xs text-emerald-400 font-medium transition-all hover:border-emerald-500/50"><span class="size-1.5 rounded-full bg-emerald-500/60 shrink-0"></span> <span class="text-[9px] text-emerald-500/50 uppercase font-bold">new</span> <button class="ml-0.5 text-emerald-500/30 hover:text-red-400 transition-colors text-[10px] font-bold">\u2715</button></div>'), Dy = _('<div class="flex flex-wrap gap-1.5 mb-3"><!> <!></div>'), Ly = _('<div class="mb-3 py-3 text-center text-xs text-muted-foreground/40 border border-dashed border-border/40 rounded-lg">No event types linked yet</div>'), jy = _("<option> </option>"), By = _(`<p class="text-[11px] text-muted-foreground/60 leading-relaxed mb-3">Event types linked to this
                                                category. AI-classified emails
                                                matching these types will
                                                trigger the pipeline.</p> <!> <select class="w-full bg-secondary/50 border border-border hover:border-blue-500/30 rounded-lg px-3 py-2.5 text-xs focus:border-blue-500/50 outline-none transition-colors cursor-pointer"><option disabled="" selected="">+ Add event type\u2026</option><!></select>`, 1), Fy = _("<option> </option>"), Uy = _(`<p class="text-xs text-muted-foreground leading-relaxed mb-3">Trigger this pipeline when the
                                                AI engine identifies the email's
                                                core purpose as this Event Type:</p> <select class="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm focus:border-blue-500 outline-none transition-colors"><option disabled="">Select Event Type...</option><!></select>`, 1), Gy = _('<div class="text-xs text-muted-foreground truncate"> </div>'), Wy = _('<div class="group relative bg-secondary/30 border border-border/50 hover:border-border hover:bg-secondary/50 rounded-xl p-3 flex items-center gap-4 transition-all"><div class="size-7 rounded border border-border/50 bg-background/50 flex justify-center items-center text-xs font-mono text-muted-foreground shrink-0"></div> <div class="size-8 rounded-full bg-background border border-border/50 flex items-center justify-center shadow-sm shrink-0 text-lg"> </div> <div class="flex-1 min-w-0"><div class="font-medium text-sm truncate"> </div> <!></div> <div class="action-controls opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 pr-2"><button class="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-background transition-colors" title="Edit"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path></svg></button> <button class="p-2 text-muted-foreground hover:text-destructive rounded-lg hover:bg-destructive/10 transition-colors" title="Remove"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg></button></div></div>'), Vy = _('<div class="flex items-stretch justify-center max-w-5xl w-full gap-5 mx-auto mt-8"><div class="w-[340px] shrink-0 flex flex-col items-center z-10"><div class="w-full border border-border bg-card rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.5)] overflow-hidden"><div class="px-5 py-4 border-b border-border/50 flex items-center gap-4 bg-secondary/20"><div class="size-10 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-500 flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg></div> <div class="flex flex-col"><span class="text-[10px] font-bold uppercase tracking-widest text-blue-500/80 mb-0.5">Trigger</span> <span class="text-base font-semibold">Detect AI Event Type</span></div></div> <div class="p-5 bg-background border-t border-border/50"><div class="mb-3"><!></div></div></div></div> <div class="flex flex-col items-center w-12 pt-[64px] shrink-0"><div class="w-full h-px bg-border flex items-center justify-center"><div class="size-4 rounded-full border border-border bg-card flex items-center justify-center"><div class="size-1.5 rounded-full bg-muted-foreground/30"></div></div></div></div> <div class="w-[420px] shrink-0 border border-border bg-card rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.5)] overflow-hidden z-10 flex flex-col"><div class="px-5 py-4 border-b border-border/50 flex items-center gap-4 bg-secondary/20 shrink-0"><div class="size-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-5 fill-emerald-500/20"><polygon points="6 3 20 12 6 21 6 3"></polygon></svg></div> <div class="flex flex-col"><span class="text-[10px] font-bold uppercase tracking-widest text-emerald-500/80 mb-0.5">Actions</span> <span class="text-base font-semibold">Execute in order</span></div></div> <div class="p-5 bg-background flex-1 flex flex-col gap-3 min-h-[300px]"><!> <button class="w-full mt-2 py-4 rounded-xl border-2 border-dashed border-border/40 hover:border-emerald-500/40 hover:bg-emerald-500/5 text-sm text-muted-foreground font-medium transition-colors flex items-center justify-center gap-2"><span class="text-xl leading-none mb-0.5">+</span> Add Action</button></div></div></div>'), Hy = _('<span class="text-[10px] uppercase font-bold text-emerald-500 mt-auto">\u2713 Added</span>'), qy = _('<button><span class="text-2xl text-muted-foreground group-hover:text-foreground transition-colors"> </span> <span class="text-xs font-semibold text-foreground/80"> </span> <!></button>'), Yy = _('<div class="flex flex-col gap-3"><div><span class="text-xs font-bold uppercase tracking-widest text-blue-500 bg-blue-500/10 px-2 py-1 rounded-md"> </span></div> <div class="grid grid-cols-2 gap-3"></div></div>'), Ky = _('<div class="fixed inset-0 z-40 bg-background/50 backdrop-blur-sm" aria-hidden="true"></div> <div class="fixed right-0 top-0 bottom-0 w-[400px] bg-card border-l border-border/60 z-50 flex flex-col shadow-2xl transition-transform"><div class="flex items-center justify-between px-6 py-4 border-b border-border/50"><h3 class="text-base font-semibold text-foreground">Select Action</h3> <button class="close-btn-small svelte-10fvsp5">&#10005;</button></div> <div class="flex-1 overflow-y-auto p-6 flex flex-col gap-6"></div></div>', 1), Xy = _("<option> </option>"), Zy = _("<optgroup></optgroup>"), Jy = _('<div class="fixed inset-0 z-40 bg-background/50 backdrop-blur-sm" aria-hidden="true"></div> <div class="fixed right-0 top-0 bottom-0 w-[400px] bg-card border-l border-border/60 z-50 flex flex-col shadow-2xl transition-transform"><div class="flex items-center justify-between px-6 py-4 border-b border-border/50"><h3 class="text-base font-semibold flex items-center gap-2"><span class="text-xl"> </span> </h3> <button class="close-btn-small svelte-10fvsp5">&#10005;</button></div> <div class="flex-1 overflow-y-auto p-6 flex flex-col gap-6"><div class="flex flex-col gap-4"><div class="flex gap-4"><div class="flex flex-col gap-2 w-16 shrink-0"><label for="edit-icon" class="text-xs font-bold text-muted-foreground/80 uppercase">Icon</label> <input id="edit-icon" type="text" class="bg-secondary/50 border border-border px-3 py-2.5 rounded-lg text-sm focus:border-blue-500 focus:bg-secondary outline-none transition-all text-center"/></div> <div class="flex flex-col gap-2 flex-1"><label for="edit-name" class="text-xs font-bold text-muted-foreground/80 uppercase">Name</label> <input id="edit-name" type="text" class="bg-secondary/50 border border-border px-3 py-2.5 rounded-lg text-sm focus:border-blue-500 focus:bg-secondary outline-none transition-all"/></div></div> <div class="flex flex-col gap-2"><label for="edit-desc" class="text-xs font-bold text-muted-foreground/80 uppercase">Description</label> <input id="edit-desc" type="text" class="bg-secondary/50 border border-border px-3 py-2.5 rounded-lg text-sm focus:border-blue-500 focus:bg-secondary outline-none transition-all"/></div> <div class="flex flex-col gap-2 mt-4 pt-4 border-t border-border/50"><label for="edit-handler" class="text-xs font-bold text-muted-foreground/80 uppercase">Plugin Handler</label> <select id="edit-handler" class="bg-secondary/50 border border-border px-3 py-2.5 rounded-lg text-sm focus:border-blue-500 focus:bg-secondary outline-none transition-all cursor-pointer"><option disabled="">Select handler function...</option><!></select></div></div></div> <div class="p-5 border-t border-border/50 flex gap-3 bg-card/50"><button class="flex-1 bg-secondary text-foreground text-sm font-medium py-2.5 rounded-lg hover:bg-secondary/80 transition-colors border border-border">Cancel</button> <button class="flex-1 bg-blue-600/90 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-blue-600 transition-colors">Save Config</button></div></div>', 1), Qy = _('<div class="editor-overlay svelte-10fvsp5" role="dialog"><div class="editor-panel svelte-10fvsp5"><div class="editor-header svelte-10fvsp5"><div class="header-left border-r border-border pr-4 mr-4 shrink-0"><h2 class="svelte-10fvsp5">Unified Pipeline Editor</h2> <span class="subtitle font-mono text-muted-foreground"> </span></div> <div class="header-center flex gap-4 flex-1 items-center"><!></div> <div class="header-right shrink-0 flex items-center gap-3"><button class="small-btn primary svelte-10fvsp5">Save Pipeline</button> <button class="close-btn svelte-10fvsp5">&#10005;</button></div></div> <div class="editor-body p-8 flex flex-col items-center bg-black"><!></div> <!> <!></div></div>');
function ew(t, e) {
  De(e, true);
  let r = ae(e, "open", 15, false), n = ae(e, "rule", 15, null), a = ae(e, "customSave", 3, false), o = ee(nt([])), i = ee(nt([])), l = ee(nt([])), c = ee(nt([])), f = ee(nt([])), p = ee(null), m = ee(false);
  const h = [{ pluginId: "gmail", pluginName: "Gmail", actions: Nc("gmail") }], x = { mark_read: "\u2713", mark_unread: "\u25CB", star: "\u2605", unstar: "\u2606", trash: "\u{1F5D1}", delete: "\u2715", mark_spam: "\u26A0", archive: "\u2193", apply_label: "\u{1F3F7}", remove_label: "\u{1F3F7}", mark_important: "!", mark_not_important: "\u2013" };
  Xt(async () => {
    g(o, await sb(), true);
  }), Ut(() => {
    const T = r(), N = n();
    yr(() => {
      if (T && N) {
        const K = x;
        g(i, (N.actions || []).map((W) => {
          var _a10;
          const A = { ...W };
          if (A.id || (A.id = (A.commandId || "cmd") + "_" + Math.random().toString(36).substring(7)), A.commandId && A.pluginId && A.commandId.startsWith(A.pluginId + ":") && (A.commandId = A.commandId.slice(A.pluginId.length + 1)), !A.name || !A.description) {
            const w = (_a10 = h.find((R) => R.pluginId === A.pluginId)) == null ? void 0 : _a10.actions.find((R) => R.actionId === A.commandId);
            w ? (A.name = A.name || w.name, A.description = A.description || w.description, A.icon = A.icon || K[w.actionId]) : (A.name = A.name || A.commandId || "Unknown action", A.description = A.description || (A.pluginId ? `${A.pluginId} \xB7 ${A.commandId}` : ""));
          }
          return A;
        }), true), g(l, (N.triggers || []).map((W) => ({ ...W })), true), g(c, [], true), g(f, [], true);
      } else g(i, [], true), g(l, [], true), g(c, [], true), g(f, [], true);
    });
  });
  const b = x;
  function y(T, N) {
    g(i, [...s(i), { id: T.actionId + "_" + Date.now(), pluginId: N, commandId: T.actionId, name: T.name, description: T.description, icon: b[T.actionId] }], true), g(m, false);
  }
  function k(T) {
    return s(i).some((N) => N.commandId === T);
  }
  function D(T) {
    g(i, s(i).filter((N) => N.id !== T), true);
  }
  function U(T) {
    g(m, false), g(p, { ...T, pluginCommandKey: T.pluginId && T.commandId ? `${T.pluginId}:${T.commandId}` : "" }, true);
  }
  function j() {
    if (!s(p)) return;
    const T = s(i).findIndex((N) => N.id === s(p).id);
    T !== -1 && (s(i)[T] = { ...s(i)[T], name: s(p).name, description: s(p).description, icon: s(p).icon, pluginId: s(p).pluginId, commandId: s(p).commandId }), g(p, null);
  }
  function M() {
    g(p, null);
  }
  async function q() {
    var _a10, _b4;
    try {
      n() && (n(n().actions = s(i), true), n(n().triggers = s(l).filter((T) => T.name !== ""), true), a() ? (_a10 = e.onSave) == null ? void 0 : _a10.call(e, n().actions, s(c), s(f)) : (await hv(n().id, { actions: n().actions, triggers: n().triggers, name: n().name, description: n().description, priority: n().priority }), (_b4 = e.onSave) == null ? void 0 : _b4.call(e)));
    } catch (T) {
      console.error("[PipelineEditor] save failed:", T);
    } finally {
      r(false);
    }
  }
  var F = Ae(), P = re(F);
  {
    var C = (T) => {
      var N = Qy(), K = d(N), W = d(K), A = d(W), S = v(d(A), 2), w = d(S), R = v(A, 2), B = d(R);
      {
        var Z = (oe) => {
          var de = My(), ve = re(de), me = v(d(ve), 2), ke = v(ve, 2), ye = v(d(ke), 2);
          Hn(me, () => n().name, (we) => n(n().name = we, true)), Hn(ye, () => n().description, (we) => n(n().description = we, true)), u(oe, de);
        };
        I(B, (oe) => {
          n() && oe(Z);
        });
      }
      var X = v(R, 2), H = d(X), te = v(H, 2), Y = v(W, 2), $ = d(Y);
      {
        var O = (oe) => {
          var de = Vy(), ve = d(de), me = d(ve), ke = v(d(me), 2), ye = d(ke), we = d(ye);
          {
            var le = (ue) => {
              var Ee = By(), xe = v(re(Ee), 2);
              {
                var Se = (_e40) => {
                  var $e = Dy(), Ce = d($e);
                  Ge(Ce, 17, () => {
                    var _a10;
                    return (((_a10 = n()) == null ? void 0 : _a10._eventTypes) || []).filter((Re) => !s(f).includes(Re.name));
                  }, Qe, (Re, je) => {
                    var Ve = zy(), st = v(d(Ve)), gt = v(st);
                    L(() => {
                      E(st, ` ${s(je).name ?? ""} `), br(gt, "aria-label", `Remove ${s(je).name ?? ""} from category`);
                    }), Pe("click", gt, () => {
                      g(f, [...s(f), s(je).name], true), g(c, s(c).filter((Lt) => Lt !== s(je).name), true);
                    }), u(Re, Ve);
                  });
                  var ze = v(Ce, 2);
                  Ge(ze, 17, () => s(c), Qe, (Re, je) => {
                    var Ve = Oy(), st = v(d(Ve)), gt = v(st, 3);
                    L(() => {
                      E(st, ` ${s(je) ?? ""} `), br(gt, "aria-label", `Undo adding ${s(je) ?? ""}`);
                    }), Pe("click", gt, () => g(c, s(c).filter((Lt) => Lt !== s(je)), true)), u(Re, Ve);
                  }), u(_e40, $e);
                }, Fe = V(() => {
                  var _a10;
                  return (((_a10 = n()) == null ? void 0 : _a10._eventTypes) || []).filter((_e40) => !s(f).includes(_e40.name)).length > 0 || s(c).length > 0;
                }), qe = (_e40) => {
                  var $e = Ly();
                  u(_e40, $e);
                };
                I(xe, (_e40) => {
                  s(Fe) ? _e40(Se) : _e40(qe, -1);
                });
              }
              var ne = v(xe, 2), fe = d(ne);
              fe.value = fe.__value = "";
              var be = v(fe);
              Ge(be, 17, () => s(o).filter((_e40) => {
                var _a10;
                const $e = (((_a10 = n()) == null ? void 0 : _a10._eventTypes) || []).some((ze) => ze.name === _e40), Ce = s(f).includes(_e40);
                return (!$e || Ce) && !s(c).includes(_e40);
              }), Qe, (_e40, $e) => {
                var Ce = jy(), ze = d(Ce), Re = {};
                L((je) => {
                  E(ze, je), Re !== (Re = s($e)) && (Ce.value = (Ce.__value = s($e)) ?? "");
                }, [() => s($e).toLowerCase().replace(/_/g, " ").replace(/\b([a-z])/g, (je) => je.toUpperCase())]), u(_e40, Ce);
              }), Pe("change", ne, (_e40) => {
                const $e = _e40.currentTarget, Ce = $e.value;
                Ce && !s(c).includes(Ce) && (g(c, [...s(c), Ce], true), g(f, s(f).filter((ze) => ze !== Ce), true)), $e.selectedIndex = 0;
              }), u(ue, Ee);
            }, ce = (ue) => {
              var Ee = Uy(), xe = v(re(Ee), 2), Se = d(xe);
              Se.value = Se.__value = "";
              var Fe = v(Se);
              Ge(Fe, 17, () => s(o), Qe, (qe, ne) => {
                var fe = Fy(), be = d(fe), _e40 = {};
                L(($e) => {
                  E(be, $e), _e40 !== (_e40 = s(ne)) && (fe.value = (fe.__value = s(ne)) ?? "");
                }, [() => s(ne).toLowerCase().replace(/_/g, " ").replace(/\b([a-z])/g, ($e) => $e.toUpperCase())]), u(qe, fe);
              }), Rn(xe, () => s(l)[0].name, (qe) => s(l)[0].name = qe), u(ue, Ee);
            };
            I(we, (ue) => {
              s(l).length > 0 && s(l)[0].type === "event_category" ? ue(le) : s(l).length > 0 && ue(ce, 1);
            });
          }
          var pe = v(ve, 4), ge = v(d(pe), 2), Te = d(ge);
          Ge(Te, 17, () => s(i), Qe, (ue, Ee, xe) => {
            var Se = Wy(), Fe = d(Se);
            Fe.textContent = xe + 1;
            var qe = v(Fe, 2), ne = d(qe), fe = v(qe, 2), be = d(fe), _e40 = d(be), $e = v(be, 2);
            {
              var Ce = (Ve) => {
                var st = Gy(), gt = d(st);
                L(() => E(gt, s(Ee).description)), u(Ve, st);
              };
              I($e, (Ve) => {
                s(Ee).description && Ve(Ce);
              });
            }
            var ze = v(fe, 2), Re = d(ze), je = v(Re, 2);
            L(() => {
              E(ne, s(Ee).icon || "\u2699\uFE0F"), E(_e40, s(Ee).name);
            }), Pe("click", Re, () => U(s(Ee))), Pe("click", je, () => D(s(Ee).id)), u(ue, Se);
          });
          var he = v(Te, 2);
          Pe("click", he, () => {
            g(m, true), g(p, null);
          }), u(oe, de);
        };
        I($, (oe) => {
          n() && n().triggers && oe(O);
        });
      }
      var G = v(Y, 2);
      {
        var J = (oe) => {
          var de = Ky(), ve = re(de), me = v(ve, 2), ke = d(me), ye = v(d(ke), 2), we = v(ke, 2);
          Ge(we, 21, () => h, Qe, (le, ce) => {
            var pe = Yy(), ge = d(pe), Te = d(ge), he = d(Te), ue = v(ge, 2);
            Ge(ue, 21, () => s(ce).actions, Qe, (Ee, xe) => {
              const Se = V(() => k(s(xe).actionId));
              var Fe = qy();
              let qe;
              var ne = d(Fe), fe = d(ne), be = v(ne, 2), _e40 = d(be), $e = v(be, 2);
              {
                var Ce = (ze) => {
                  var Re = Hy();
                  u(ze, Re);
                };
                I($e, (ze) => {
                  s(Se) && ze(Ce);
                });
              }
              L(() => {
                qe = rt(Fe, 1, "flex flex-col gap-2 p-3 bg-[#111] border border-border rounded-xl hover:bg-secondary hover:border-blue-500/50 transition-all text-left group", null, qe, { "border-emerald-500": s(Se), "bg-emerald-500_10": s(Se) }), br(Fe, "title", s(xe).description), E(fe, b[s(xe).actionId] ?? "\xB7"), E(_e40, s(xe).name);
              }), Pe("click", Fe, () => y(s(xe), s(ce).pluginId)), u(Ee, Fe);
            }), L(() => E(he, s(ce).pluginName)), u(le, pe);
          }), Pe("click", ve, () => g(m, false)), Pe("click", ye, () => g(m, false)), u(oe, de);
        };
        I(G, (oe) => {
          s(m) && oe(J);
        });
      }
      var se = v(G, 2);
      {
        var ie = (oe) => {
          var de = Jy(), ve = re(de), me = v(ve, 2), ke = d(me), ye = d(ke), we = d(ye), le = d(we), ce = v(we), pe = v(ye, 2), ge = v(ke, 2), Te = d(ge), he = d(Te), ue = d(he), Ee = v(d(ue), 2), xe = v(ue, 2), Se = v(d(xe), 2), Fe = v(he, 2), qe = v(d(Fe), 2), ne = v(Fe, 2), fe = v(d(ne), 2), be = d(fe);
          be.value = be.__value = "";
          var _e40 = v(be);
          Ge(_e40, 17, () => h, Qe, (Re, je) => {
            var Ve = Zy();
            Ge(Ve, 21, () => s(je).actions, Qe, (st, gt) => {
              var Lt = Xy(), dt = d(Lt), Jt = {};
              L(() => {
                E(dt, s(gt).name), Jt !== (Jt = `${s(je).pluginId ?? ""}:${s(gt).actionId ?? ""}`) && (Lt.value = Lt.__value = `${s(je).pluginId ?? ""}:${s(gt).actionId ?? ""}`);
              }), u(st, Lt);
            }), L(() => br(Ve, "label", s(je).pluginName)), u(Re, Ve);
          });
          var $e = v(ge, 2), Ce = d($e), ze = v(Ce, 2);
          L(() => {
            E(le, s(p).icon || "\u2699\uFE0F"), E(ce, ` ${(s(p).name || "Edit Action") ?? ""}`);
          }), Pe("click", ve, M), Pe("click", pe, M), Hn(Ee, () => s(p).icon, (Re) => s(p).icon = Re), Hn(Se, () => s(p).name, (Re) => s(p).name = Re), Hn(qe, () => s(p).description, (Re) => s(p).description = Re), Rn(fe, () => s(p).pluginCommandKey, (Re) => s(p).pluginCommandKey = Re), Pe("click", Ce, M), Pe("click", ze, j), u(oe, de);
        };
        I(se, (oe) => {
          s(p) && oe(ie);
        });
      }
      L((oe) => E(w, oe), [() => {
        var _a10, _b4;
        return (_b4 = (_a10 = n()) == null ? void 0 : _a10.id) == null ? void 0 : _b4.slice(0, 8);
      }]), Pe("click", H, q), Pe("click", te, () => r(false)), u(T, N);
    };
    I(P, (T) => {
      r() && T(C);
    });
  }
  u(t, F), Le();
}
Zt(["click", "change"]);
var tw = _('<span class="text-[9px] px-1.5 py-0.5 rounded bg-secondary/60 text-muted-foreground border border-border/50 uppercase truncate max-w-full"> </span>'), rw = _('<div class="flex flex-wrap gap-1 mt-1 pl-4"></div>'), nw = _('<div class="flex items-center w-[20px] shrink-0 -mx-3 z-10"><div class="h-[2px] bg-border flex-1"></div> <div class="text-border text-[10px] -ml-1">\u25B6</div></div>'), aw = _('<div class="text-[10px] text-muted-foreground leading-snug line-clamp-1 pl-4 opacity-80"> </div>'), sw = _('<div class="mt-1 ml-4 text-[8px] font-bold text-warning bg-warning/10 px-1 py-0.5 rounded-[3px] self-start uppercase">Unbound</div>'), ow = _('<div class="flex items-center w-[20px] shrink-0 -mx-3 z-10"><div class="h-[2px] bg-border flex-1"></div> <div class="text-border text-[10px] -ml-1">\u25B6</div></div>'), iw = _('<div class="shrink-0 bg-card border border-border rounded-xl w-[260px] text-foreground flex flex-col shadow-sm relative group"><div class="p-2.5 pb-2 border-b border-border/50 flex items-center justify-between bg-card rounded-t-xl"><div class="flex items-center gap-2"><div class="size-5 rounded bg-secondary flex items-center justify-center text-foreground text-[10px] shrink-0 shadow-sm border border-border/50"> </div> <span class="text-[10px] font-bold uppercase tracking-wider text-muted-foreground truncate"> </span></div></div> <div class="p-3 pt-2 flex flex-col gap-1 bg-background rounded-b-xl"><div class="font-semibold text-xs text-foreground flex items-baseline gap-1.5"><span class="text-muted-foreground text-[10px] font-mono"></span> <span class="truncate"> </span></div> <!> <!></div></div> <!>', 1), lw = _('<div class="flex items-center overflow-x-auto py-3 gap-6"><div class="shrink-0 bg-card border border-border rounded-xl w-[260px] text-foreground flex flex-col shadow-sm"><div class="p-2.5 pb-2 border-b border-border/50 flex items-center justify-between bg-card rounded-t-xl"><div class="flex items-center gap-2"><div class="size-5 rounded bg-primary/10 flex items-center justify-center text-primary text-[10px] shrink-0 shadow-sm border border-primary/20">\u26A1</div> <span class="text-[10px] font-bold uppercase tracking-wider text-muted-foreground truncate"> </span></div> <span> </span></div> <div class="p-3 pt-2 flex flex-col gap-1.5 relative bg-background rounded-b-xl"><div class="font-semibold text-xs text-foreground flex items-baseline gap-1.5"><span class="text-muted-foreground text-[10px] font-mono">1.</span> <span class="truncate"> </span></div> <!></div></div> <!> <!></div>');
function os(t, e) {
  De(e, true);
  let r = ae(e, "eventTypes", 3, null), n = ae(e, "commands", 19, () => []);
  ae(e, "onExecute", 3, void 0), ae(e, "executionState", 3, null);
  let a = ae(e, "policy", 3, "auto"), o = V(() => e.category && In[e.category] || In[yl]);
  const i = [{ pluginId: "gmail", pluginName: "Gmail", actions: Nc("gmail") }], l = { mark_read: "\u2713", mark_unread: "\u25CB", star: "\u2605", unstar: "\u2606", trash: "\u{1F5D1}", delete: "\u2715", mark_spam: "\u26A0", archive: "\u2193", apply_label: "\u{1F3F7}", remove_label: "\u{1F3F7}", mark_important: "!", mark_not_important: "\u2013" };
  let c = V(() => n().map((W) => {
    var _a10;
    const A = { ...W };
    A.commandId && A.pluginId && A.commandId.startsWith(A.pluginId + ":") && (A.commandId = A.commandId.slice(A.pluginId.length + 1));
    const w = (_a10 = i.find((R) => R.pluginId === A.pluginId)) == null ? void 0 : _a10.actions.find((R) => R.actionId === A.commandId);
    return w ? (A.name = A.name || w.name, A.description = A.description || w.description, A.icon = A.icon || l[w.actionId]) : A.name = A.name || A.commandId || "Unknown action", A;
  }));
  var f = lw(), p = d(f), m = d(p), h = d(m), x = v(d(h), 2);
  let b;
  var y = d(x), k = v(h, 2);
  let D;
  var U = d(k), j = v(m, 2), M = d(j), q = v(d(M), 2), F = d(q), P = v(M, 2);
  {
    var C = (W) => {
      var A = rw();
      Ge(A, 21, r, Qe, (S, w) => {
        var R = tw(), B = d(R);
        L(() => E(B, s(w))), u(S, R);
      }), u(W, A);
    };
    I(P, (W) => {
      r() && r().length > 0 && W(C);
    });
  }
  var T = v(p, 2);
  {
    var N = (W) => {
      var A = nw();
      u(W, A);
    };
    I(T, (W) => {
      n().length > 0 && W(N);
    });
  }
  var K = v(T, 2);
  Ge(K, 17, () => s(c), Qe, (W, A, S) => {
    var w = iw(), R = re(w), B = d(R), Z = d(B), X = d(Z), H = d(X), te = v(X, 2), Y = d(te), $ = v(B, 2), O = d($), G = d(O);
    G.textContent = `${S + 2}.`;
    var J = v(G, 2), se = d(J), ie = v(O, 2);
    {
      var oe = (ye) => {
        var we = aw(), le = d(we);
        L(() => {
          br(we, "aria-label", s(A).description), E(le, s(A).description);
        }), u(ye, we);
      };
      I(ie, (ye) => {
        s(A).description && ye(oe);
      });
    }
    var de = v(ie, 2);
    {
      var ve = (ye) => {
        var we = sw();
        u(ye, we);
      };
      I(de, (ye) => {
        (!s(A).pluginId || !s(A).commandId) && ye(ve);
      });
    }
    var me = v(R, 2);
    {
      var ke = (ye) => {
        var we = ow();
        u(ye, we);
      };
      I(me, (ye) => {
        S < n().length - 1 && ye(ke);
      });
    }
    L(() => {
      E(H, s(A).icon || "\u2699\uFE0F"), E(Y, s(A).pluginId ? s(A).pluginId : "ACTION"), br(J, "title", s(A).name), E(se, s(A).name);
    }), u(W, w);
  }), L(() => {
    var _a10, _b4;
    b = Rt(x, "", b, { color: (_a10 = s(o)) == null ? void 0 : _a10.color }), E(y, ((_b4 = s(o)) == null ? void 0 : _b4.label) || "Event"), D = rt(k, 1, "px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest bg-secondary", null, D, { "text-green-400": a() === "auto", "text-red-400": a() === "manual" }), E(U, a()), br(q, "title", e.eventType), E(F, e.eventType);
  }), u(t, f), Le();
}
var cw = _('<div class="flex flex-col items-center justify-center gap-3 py-24 text-muted-foreground"><div class="size-6 border-2 border-border border-t-primary rounded-full animate-spin"></div> Loading\u2026</div>'), dw = _("<!> Running\u2026", 1), uw = _("<!> ", 1), fw = _("<!> Edit Actions", 1), pw = _('<div class="flex items-center gap-2 mt-2 text-xs text-muted-foreground/30 italic">No default actions \u2014 user must act manually</div>'), vw = _('<p class="text-xs text-muted-foreground/30 mt-2 italic">No event types assigned yet</p>'), gw = _('<div class="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted/5 border border-border/30 opacity-80"><span class="text-xs font-mono text-foreground/80"> </span> <!> <div class="ml-auto flex items-center gap-1.5"><button class="text-muted-foreground/40 hover:text-destructive transition-colors px-1 h-5" title="Delete Event Type"><!></button></div></div>'), mw = _('<div class="flex flex-col gap-1 mt-2"></div>'), hw = _('<div class="px-6 pb-4 border-t border-border/40 pt-3"><span class="text-[0.6rem] uppercase tracking-wider text-muted-foreground/40 font-semibold">Event Types in this Category</span> <!></div>'), _w = _('<div class="rounded-xl border bg-card/60 backdrop-blur-md border-border/50 shadow-sm hover:border-primary/30 transition-all"><div class="flex items-center gap-3 px-6 py-4"><div class="size-10 rounded-lg flex items-center justify-center text-lg shrink-0"> </div> <div class="flex-1 min-w-0"><div class="flex items-center gap-2"><h3 class="text-base font-bold text-foreground"> </h3> <!></div> <div class="flex items-center gap-2 mt-1"><span class="text-xs text-muted-foreground/50">Policy:</span> <select class="h-6 px-1.5 text-xs rounded border border-input bg-background text-foreground"><option>Auto-execute</option><option>User approval</option></select></div></div> <button class="p-2 text-muted-foreground/40 hover:text-foreground transition-colors"><!></button></div> <div class="px-6 pb-4 border-t border-border/40 pt-3 flex flex-col items-start gap-1"><div class="flex items-center justify-between w-full gap-2 flex-wrap"><span class="text-[0.6rem] uppercase tracking-wider text-muted-foreground/40 font-semibold">Default Pipeline</span> <div class="flex items-center gap-2"><!> <!></div></div> <!></div> <!></div>'), bw = _('<div class="flex flex-col gap-4 max-w-4xl"></div>'), xw = _(`<div class="flex flex-col h-full overflow-hidden"><div class="flex items-center justify-between px-8 pt-5 pb-4 shrink-0 border-b border-border"><div><div class="flex items-center gap-2 mb-0.5"><!> <h2 class="text-xl font-bold tracking-tight text-foreground">Category Pipelines</h2></div> <p class="text-sm text-muted-foreground/60">Categories carry default action pipelines. AI assigns event types to
        categories.</p></div></div> <!> <!></div>`);
function yw(t, e) {
  De(e, true);
  let r = ee(nt([])), n = ee(true), a = ee(nt({})), o = ee(nt({})), i = ee(null), l = ee(false), c = ee(null);
  const f = { noise: "#6b7280", info: "#3b82f6", critical: "#ef4444" }, p = { noise: "\u{1F5D1}", info: "\u{1F4CB}", critical: "\u{1F6A8}" };
  Xt(m);
  async function m() {
    g(n, true);
    try {
      const T = await Sc();
      g(r, T, true);
      const N = await Promise.all(T.map(async (K) => [K.category, await _v(K.category)]));
      g(o, Object.fromEntries(N), true);
    } catch (T) {
      console.error("Failed to load category pipelines:", T);
    } finally {
      g(n, false);
    }
  }
  async function h(T) {
    if (!await Ko()) {
      alert("Please sign in to Gmail first (Dashboard page)");
      return;
    }
    if (T.actions.length === 0) {
      alert("No actions in this category pipeline \u2014 add actions first (Edit Actions).");
      return;
    }
    const N = await bv(T.category);
    if (N.length === 0) {
      alert(`No pending items in ${T.label}.`);
      return;
    }
    g(i, T.category, true);
    let K = 0, W = 0;
    try {
      for (const A of N) {
        const S = { type: A.eventType, source: A.sourceType ?? "gmail", data: { id: A.id, emailId: A.id, subject: A.subject, from: A.from }, metadata: { category: A.event_category } };
        (await co(S, void 0, true, { actionsOverride: T.actions })).success ? K += 1 : W += 1;
      }
      W > 0 && alert(`Done: ${K} succeeded, ${W} failed.`), g(o, { ...s(o), [T.category]: 0 }, true);
    } catch (A) {
      console.error("Execute category failed:", A), alert(`Execution failed: ${A.message}`);
    } finally {
      g(i, null);
    }
  }
  function x(T) {
    g(a, { ...s(a), [T]: !s(a)[T] }, true);
  }
  async function b(T, N) {
    await kv(T, N), await m();
  }
  function y(T) {
    const N = s(r).find((K) => K.category === T);
    N && (g(c, { id: `cat:${N.category}`, name: `Category: ${N.label}`, description: "", triggers: [{ type: "event_category", name: N.category }], actions: JSON.parse(JSON.stringify(N.actions)), enabled: true, priority: N.priority, _eventTypes: N.eventTypes || [] }, true), g(l, true));
  }
  async function k(T, N, K) {
    if (!s(c) || !s(c).id.startsWith("cat:") || !T) return;
    const W = s(c).id.split(":")[1], A = T.map((S, w) => ({ pluginId: S.pluginId, commandId: S.commandId, order: w }));
    if (await wv(W, A), N && N.length > 0) for (const S of N) await Sv(S, W);
    if (K && K.length > 0) for (const S of K) await Tv(S);
    await m();
  }
  async function D(T) {
    confirm(`Are you sure you want to delete event type '${T}'?`) && (await Av(T), await m());
  }
  var U = xw(), j = d(U), M = d(j), q = d(M), F = d(q);
  $x(F, { class: "size-5 text-primary/60" });
  var P = v(j, 2);
  Ln(P, { class: "flex-1 min-h-0 px-8 py-6", children: (T, N) => {
    var K = Ae(), W = re(K);
    {
      var A = (w) => {
        var R = cw();
        u(w, R);
      }, S = (w) => {
        var R = bw();
        Ge(R, 21, () => s(r), (B) => B.category, (B, Z) => {
          const X = V(() => f[s(Z).category] || "#888"), H = V(() => p[s(Z).category] || "\u{1F4E6}");
          var te = _w(), Y = d(te), $ = d(Y), O = d($), G = v($, 2), J = d(G), se = d(J), ie = d(se), oe = v(se, 2);
          Cr(oe, { variant: "outline", class: "text-[0.6rem] px-1.5 py-0", get style() {
            return `color: ${s(X) ?? ""}; border-color: ${s(X) ?? ""}40`;
          }, children: (fe, be) => {
            var _e40 = Be();
            L(() => E(_e40, `${s(Z).eventTypes.length ?? ""} type${s(Z).eventTypes.length !== 1 ? "s" : ""}`)), u(fe, _e40);
          }, $$slots: { default: true } });
          var de = v(J, 2), ve = v(d(de), 2), me = d(ve);
          me.value = me.__value = "auto";
          var ke = v(me);
          ke.value = ke.__value = "manual";
          var ye;
          pc(ve);
          var we = v(G, 2), le = d(we);
          {
            var ce = (fe) => {
              pg(fe, { class: "size-4" });
            }, pe = (fe) => {
              vg(fe, { class: "size-4" });
            };
            I(le, (fe) => {
              s(a)[s(Z).category] ? fe(ce) : fe(pe, -1);
            });
          }
          var ge = v(Y, 2), Te = d(ge), he = v(d(Te), 2), ue = d(he);
          {
            let fe = V(() => s(i) === s(Z).category || s(Z).actions.length === 0 || (s(o)[s(Z).category] ?? 0) === 0);
            tt(ue, { variant: "default", size: "sm", class: "gap-2 h-7 text-xs", get disabled() {
              return s(fe);
            }, onclick: () => h(s(Z)), children: (be, _e40) => {
              var $e = Ae(), Ce = re($e);
              {
                var ze = (je) => {
                  var Ve = dw(), st = re(Ve);
                  uo(st, { class: "size-3 animate-spin" }), u(je, Ve);
                }, Re = (je) => {
                  var Ve = uw(), st = re(Ve);
                  jc(st, { class: "size-3" });
                  var gt = v(st);
                  L(() => E(gt, ` Execute${s(o)[s(Z).category] ? ` (${s(o)[s(Z).category]})` : ""}`)), u(je, Ve);
                };
                I(Ce, (je) => {
                  s(i) === s(Z).category ? je(ze) : je(Re, -1);
                });
              }
              u(be, $e);
            }, $$slots: { default: true } });
          }
          var Ee = v(ue, 2);
          tt(Ee, { variant: "outline", size: "sm", class: "gap-2 h-7 text-xs", onclick: () => y(s(Z).category), children: (fe, be) => {
            var _e40 = fw(), $e = re(_e40);
            Cx($e, { class: "size-3" }), u(fe, _e40);
          }, $$slots: { default: true } });
          var xe = v(Te, 2);
          {
            var Se = (fe) => {
              var be = pw();
              u(fe, be);
            }, Fe = (fe) => {
              {
                let be = V(() => `Any ${s(Z).label} event`), _e40 = V(() => s(Z).eventTypes.map((Ce) => Ce.name)), $e = V(() => s(Z).category.toUpperCase());
                os(fe, { get commands() {
                  return s(Z).actions;
                }, get eventType() {
                  return s(be);
                }, get eventTypes() {
                  return s(_e40);
                }, get category() {
                  return s($e);
                }, get policy() {
                  return s(Z).policy;
                } });
              }
            };
            I(xe, (fe) => {
              s(Z).actions.length === 0 ? fe(Se) : fe(Fe, -1);
            });
          }
          var qe = v(ge, 2);
          {
            var ne = (fe) => {
              var be = hw(), _e40 = v(d(be), 2);
              {
                var $e = (ze) => {
                  var Re = vw();
                  u(ze, Re);
                }, Ce = (ze) => {
                  var Re = mw();
                  Ge(Re, 21, () => s(Z).eventTypes, Qe, (je, Ve) => {
                    var st = gw(), gt = d(st), Lt = d(gt), dt = v(gt, 2);
                    {
                      var Jt = (Nt) => {
                        Cr(Nt, { variant: "outline", class: "text-[0.55rem] px-1 py-0 text-muted-foreground/40 border-border/30", children: (Sr, ra) => {
                          var na = Be("AI");
                          u(Sr, na);
                        }, $$slots: { default: true } });
                      };
                      I(dt, (Nt) => {
                        s(Ve).autoCreated && Nt(Jt);
                      });
                    }
                    var Wt = v(dt, 2), Nr = d(Wt), Rr = d(Nr);
                    ei(Rr, { class: "size-3.5" }), L(() => E(Lt, s(Ve).name)), Pe("click", Nr, () => D(s(Ve).name)), u(je, st);
                  }), u(ze, Re);
                };
                I(_e40, (ze) => {
                  s(Z).eventTypes.length === 0 ? ze($e) : ze(Ce, -1);
                });
              }
              u(fe, be);
            };
            I(qe, (fe) => {
              s(a)[s(Z).category] && fe(ne);
            });
          }
          L(() => {
            Rt($, `background: ${s(X) ?? ""}18; color: ${s(X) ?? ""}`), E(O, s(H)), E(ie, s(Z).label), ye !== (ye = s(Z).policy) && (ve.value = (ve.__value = s(Z).policy) ?? "", Js(ve, s(Z).policy));
          }), Pe("change", ve, (fe) => b(s(Z).category, fe.target.value)), Pe("click", we, () => x(s(Z).category)), u(B, te);
        }), u(w, R);
      };
      I(W, (w) => {
        s(n) ? w(A) : w(S, -1);
      });
    }
    u(T, K);
  }, $$slots: { default: true } });
  var C = v(P, 2);
  ew(C, { customSave: true, onSave: k, get open() {
    return s(l);
  }, set open(T) {
    g(l, T, true);
  }, get rule() {
    return s(c);
  }, set rule(T) {
    g(c, T, true);
  } }), u(t, U), Le();
}
Zt(["change", "click"]);
function ww(t, e) {
  De(e, true);
  let r = ae(e, "ref", 15, null), n = ae(e, "data-slot", 3, "separator"), a = ut(e, ["$$slots", "$$events", "$$legacy", "ref", "class", "data-slot"]);
  var o = Ae(), i = re(o);
  {
    let l = V(() => Je("bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:min-h-full data-[orientation=vertical]:w-px", e.class));
    dr(i, () => A1, (c, f) => {
      f(c, et({ get "data-slot"() {
        return n();
      }, get class() {
        return s(l);
      } }, () => a, { get ref() {
        return r();
      }, set ref(p) {
        r(p);
      } }));
    });
  }
  u(t, o), Le();
}
var kw = _('<span class="text-[0.6rem] font-bold tabular-nums px-1.5 py-px rounded bg-warning/15 text-warning"> </span>'), Sw = _('<div class="flex items-center justify-center py-16 text-muted-foreground"><div class="size-5 rounded-full border-2 border-border border-t-primary animate-spin"></div></div>'), Tw = _('<div class="flex flex-col items-center justify-center gap-2 py-16 text-muted-foreground px-4 text-center"><!> <span class="text-sm">No pending approvals</span></div>'), Aw = _('<div role="button" tabindex="0"><div class="flex items-center gap-2"><div class="flex items-center gap-1.5 flex-1 min-w-0"><!> <span class="text-xs text-muted-foreground truncate"> </span></div> <span class="text-[0.65rem] text-muted-foreground/60 shrink-0 flex items-center gap-1"><!> </span></div> <p class="text-sm font-semibold text-foreground leading-snug line-clamp-2"> </p> <!></div>'), Ew = _('<div class="flex flex-col gap-1 px-3 pb-4"></div>'), Cw = _('<div class="flex flex-col gap-1.5"><p class="text-xs font-bold uppercase tracking-widest text-muted-foreground">Content</p> <p class="text-sm text-muted-foreground leading-relaxed"> </p></div>'), Iw = _('<!> <div class="flex flex-col gap-3"><p class="text-xs font-bold uppercase tracking-widest text-muted-foreground">Matched Workflow</p> <div class="flex items-center gap-2.5 px-4 py-3 rounded bg-muted/40 border border-border"><div class="size-6 rounded bg-primary/15 flex items-center justify-center shrink-0"><!></div> <div><p class="text-sm font-semibold tracking-tight text-foreground"> </p> <p class="text-xs text-muted-foreground">Paused \u2014 awaiting approval to proceed</p></div></div></div>', 1), Pw = _('<div class="flex items-center gap-2 flex-wrap"><!> <!></div>'), $w = _('<div class="flex flex-col gap-6 max-w-xl"><div class="flex flex-col gap-1.5"><p class="text-xs font-bold uppercase tracking-widest text-muted-foreground">From</p> <p class="text-sm text-foreground"> </p></div> <div class="flex flex-col gap-1.5"><p class="text-xs font-bold uppercase tracking-widest text-muted-foreground">Subject</p> <h3 class="text-lg font-semibold tracking-tight text-foreground leading-snug"> </h3></div> <!> <!> <!></div>'), Nw = _('<p class="text-xs text-destructive mt-2"> </p>'), Rw = _('<div class="px-7 py-4 border-t border-border shrink-0"><!> <!></div>'), Mw = _("<!> Reject", 1), zw = _("<!> Running\u2026", 1), Ow = _("<!> Done!", 1), Dw = _("<!> Review &amp; Execute", 1), Lw = _('<!> <div class="px-7 py-4 border-t border-border shrink-0 flex gap-3"><!> <!></div>', 1), jw = _('<div class="flex-1 min-w-0 flex flex-col overflow-hidden"><div class="flex items-center gap-3 px-7 py-4 border-b border-border shrink-0 bg-warning/5"><div class="size-2 rounded-full bg-warning animate-pulse"></div> <span class="text-xs font-bold uppercase tracking-widest text-warning">Action Paused</span> <span class="text-xs text-muted-foreground ml-auto"> </span></div> <!> <!></div>'), Bw = _('<div class="flex-1 flex items-center justify-center text-muted-foreground"><div class="flex flex-col items-center gap-2"><!> <span class="text-sm">Select an event to review</span></div></div>'), Fw = _('<div class="flex h-full overflow-hidden"><div class="w-72 shrink-0 flex flex-col border-r border-border overflow-hidden"><div class="flex items-center justify-between px-5 pt-4 pb-3 shrink-0 border-b border-border"><div><div class="flex items-center gap-2"><h2 class="text-sm font-semibold tracking-tight text-foreground">Action Required</h2> <!></div> <p class="text-xs text-muted-foreground/60 mt-0.5">Awaiting approval to proceed</p></div> <!></div> <!></div> <!></div>');
function Uw(t, e) {
  De(e, true);
  let r = ee(nt([])), n = ee(true), a = ee(null), o = ee(nt({}));
  async function i() {
    g(n, true), g(o, {}, true);
    try {
      g(r, await wc({ limit: 100 }), true);
    } catch (F) {
      console.error("ApprovalsView:", F);
    }
    g(n, false), s(r).length && !s(a) && g(a, s(r)[0], true);
  }
  Xt(i);
  async function l(F) {
    var _a10;
    const P = F.id;
    let C;
    try {
      C = await io(P) ?? {};
    } catch {
      C = {};
    }
    s(o)[P] = { running: true, steps: [] };
    const T = { type: F.event_type || "UNKNOWN", source: C.sourceType || "gmail", data: { id: P, emailId: P, subject: C.subject ?? F.subject, from: C.from ?? F.from ?? F.source_name, ...C }, metadata: { category: F.event_category } }, N = String(F.event_category ?? "").toLowerCase().trim(), W = (await Sc()).find((w) => {
      var _a11;
      return ((_a11 = w.category) == null ? void 0 : _a11.toLowerCase().trim()) === N;
    }), A = ((_a10 = W == null ? void 0 : W.actions) == null ? void 0 : _a10.length) ? W.actions : void 0, S = await co(T, (w) => {
      const R = s(o)[P] || { running: true, steps: [] };
      if (w.phase === "pipeline_loaded") s(o)[P] = { ...R, steps: (w.actions ?? []).map((B) => {
        const Z = B;
        return { label: Z.name ?? Z.commandId, commandId: Z.commandId, status: "pending" };
      }) };
      else if (w.phase === "action_start") s(o)[P] = { ...R, steps: R.steps.map((B) => B.commandId === (w.actionId ?? w.commandId) ? { ...B, status: "running" } : B) };
      else if (w.phase === "action_complete") {
        const B = w.result, Z = (B == null ? void 0 : B.success) !== false;
        s(o)[P] = { ...R, steps: R.steps.map((X) => X.commandId === (w.actionId ?? w.commandId) ? { ...X, status: Z ? "done" : "error", message: B == null ? void 0 : B.message } : X) };
      }
    }, true, A ? { actionsOverride: A } : void 0);
    if (s(o)[P] = { ...s(o)[P], running: false, success: S.success, error: S.message }, S.success) {
      try {
        await vs(P, "executed");
      } catch {
      }
      setTimeout(() => {
        var _a11;
        g(r, s(r).filter((w) => w.id !== P), true), ((_a11 = s(a)) == null ? void 0 : _a11.id) === P && g(a, s(r)[0] ?? null, true), delete s(o)[P];
      }, 1500);
    }
  }
  async function c(F) {
    var _a10;
    try {
      await xv(F.id), g(r, s(r).filter((P) => P.id !== F.id), true), ((_a10 = s(a)) == null ? void 0 : _a10.id) === F.id && g(a, s(r)[0] ?? null, true);
    } catch (P) {
      console.error("Reject:", P);
    }
  }
  function f(F) {
    if (!F) return "";
    const P = new Date(Number(F)), C = Math.round((Date.now() - P.getTime()) / 6e4);
    if (C < 60) return `${C}m ago`;
    const T = Math.round(C / 60);
    return T < 24 ? `${T}h ago` : P.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
  var p = Fw(), m = d(p), h = d(m), x = d(h), b = d(x), y = v(d(b), 2);
  {
    var k = (F) => {
      var P = kw(), C = d(P);
      L(() => E(C, s(r).length)), u(F, P);
    };
    I(y, (F) => {
      s(r).length > 0 && F(k);
    });
  }
  var D = v(x, 2);
  {
    let F = V(() => Je(s(n) && "[&_svg]:animate-spin"));
    tt(D, { variant: "ghost", size: "icon-sm", onclick: i, get class() {
      return s(F);
    }, children: (P, C) => {
      ms(P, { class: "size-3.5" });
    }, $$slots: { default: true } });
  }
  var U = v(h, 2);
  Ln(U, { class: "flex-1", children: (F, P) => {
    var C = Ae(), T = re(C);
    {
      var N = (A) => {
        var S = Sw();
        u(A, S);
      }, K = (A) => {
        var S = Tw(), w = d(S);
        ss(w, { class: "size-10 opacity-20" }), u(A, S);
      }, W = (A) => {
        var S = Ew();
        Ge(S, 21, () => s(r), (w) => w.id, (w, R) => {
          var B = Aw(), Z = d(B), X = d(Z), H = d(X);
          gs(H, { class: "size-3 text-muted-foreground shrink-0" });
          var te = v(H, 2), Y = d(te), $ = v(X, 2), O = d($);
          Pl(O, { class: "size-2.5" });
          var G = v(O, 1, true), J = v(Z, 2), se = d(J), ie = v(J, 2);
          {
            var oe = (de) => {
              Cr(de, { variant: "outline", class: "text-xs w-fit", children: (ve, me) => {
                var ke = Be();
                L(() => E(ke, s(R).rule_name)), u(ve, ke);
              }, $$slots: { default: true } });
            };
            I(ie, (de) => {
              s(R).rule_name && de(oe);
            });
          }
          L((de, ve) => {
            rt(B, 1, de), E(Y, s(R).source_name ?? "unknown"), E(G, ve), E(se, s(R).subject || s(R).content || "(no subject)");
          }, [() => {
            var _a10;
            return Et(Je("relative flex flex-col gap-1.5 px-3 py-3 rounded border cursor-pointer transition-colors", "border-l-2", ((_a10 = s(a)) == null ? void 0 : _a10.id) === s(R).id ? "bg-accent border-warning/40 border-l-warning" : "bg-card border-border border-l-warning/30 hover:border-l-warning/70"));
          }, () => f(s(R).timestamp)]), Pe("click", B, () => g(a, s(R), true)), Pe("keydown", B, (de) => de.key === "Enter" && g(a, s(R), true)), u(w, B);
        }), u(A, S);
      };
      I(T, (A) => {
        s(n) ? A(N) : s(r).length === 0 ? A(K, 1) : A(W, -1);
      });
    }
    u(F, C);
  }, $$slots: { default: true } });
  var j = v(m, 2);
  {
    var M = (F) => {
      var P = jw(), C = d(P), T = v(d(C), 4), N = d(T), K = v(C, 2);
      Ln(K, { class: "flex-1 px-7 py-6", children: (S, w) => {
        var R = $w(), B = d(R), Z = v(d(B), 2), X = d(Z), H = v(B, 2), te = v(d(H), 2), Y = d(te), $ = v(H, 2);
        {
          var O = (oe) => {
            var de = Cw(), ve = v(d(de), 2), me = d(ve);
            L(() => E(me, s(a).content)), u(oe, de);
          };
          I($, (oe) => {
            s(a).content && oe(O);
          });
        }
        var G = v($, 2);
        {
          var J = (oe) => {
            var de = Iw(), ve = re(de);
            ww(ve, {});
            var me = v(ve, 2), ke = v(d(me), 2), ye = d(ke), we = d(ye);
            Pl(we, { class: "size-3.5 text-primary" });
            var le = v(ye, 2), ce = d(le), pe = d(ce);
            L(() => E(pe, s(a).rule_name)), u(oe, de);
          };
          I(G, (oe) => {
            s(a).rule_name && oe(J);
          });
        }
        var se = v(G, 2);
        {
          var ie = (oe) => {
            var de = Pw(), ve = d(de);
            {
              var me = (we) => {
                Cr(we, { variant: "outline", class: "text-xs", children: (le, ce) => {
                  var pe = Be();
                  L((ge) => E(pe, ge), [() => s(a).event_type.replace(/_/g, " ")]), u(le, pe);
                }, $$slots: { default: true } });
              };
              I(ve, (we) => {
                s(a).event_type && we(me);
              });
            }
            var ke = v(ve, 2);
            {
              var ye = (we) => {
                Cr(we, { variant: "secondary", class: "text-xs capitalize", children: (le, ce) => {
                  var pe = Be();
                  L(() => E(pe, s(a).event_category)), u(le, pe);
                }, $$slots: { default: true } });
              };
              I(ke, (we) => {
                s(a).event_category && we(ye);
              });
            }
            u(oe, de);
          };
          I(se, (oe) => {
            (s(a).event_type || s(a).event_category) && oe(ie);
          });
        }
        L(() => {
          E(X, s(a).sender || s(a).source_name || "Unknown"), E(Y, s(a).subject || "(no subject)");
        }), u(S, R);
      }, $$slots: { default: true } });
      var W = v(K, 2);
      {
        var A = (S) => {
          const w = V(() => s(o)[s(a).id]);
          var R = Lw(), B = re(R);
          {
            var Z = (Y) => {
              var $ = Rw(), O = d($);
              xg(O, { get steps() {
                return s(w).steps;
              } });
              var G = v(O, 2);
              {
                var J = (se) => {
                  var ie = Nw(), oe = d(ie);
                  L(() => E(oe, s(w).error)), u(se, ie);
                };
                I(G, (se) => {
                  !s(w).running && s(w).success === false && s(w).error && se(J);
                });
              }
              u(Y, $);
            };
            I(B, (Y) => {
              var _a10, _b4;
              ((_b4 = (_a10 = s(w)) == null ? void 0 : _a10.steps) == null ? void 0 : _b4.length) && Y(Z);
            });
          }
          var X = v(B, 2), H = d(X);
          {
            let Y = V(() => {
              var _a10;
              return (_a10 = s(w)) == null ? void 0 : _a10.running;
            });
            tt(H, { variant: "destructive", class: "flex-1 gap-2", get disabled() {
              return s(Y);
            }, onclick: () => s(a) && c(s(a)), children: ($, O) => {
              var G = Mw(), J = re(G);
              Tx(J, { class: "size-4" }), u($, G);
            }, $$slots: { default: true } });
          }
          var te = v(H, 2);
          {
            let Y = V(() => {
              var _a10, _b4;
              return ((_a10 = s(w)) == null ? void 0 : _a10.running) || ((_b4 = s(w)) == null ? void 0 : _b4.success) === true;
            });
            tt(te, { class: "flex-1 gap-2", get disabled() {
              return s(Y);
            }, onclick: () => s(a) != null && l(s(a)), children: ($, O) => {
              var G = Ae(), J = re(G);
              {
                var se = (de) => {
                  var ve = zw(), me = re(ve);
                  uo(me, { class: "size-4 animate-spin" }), u(de, ve);
                }, ie = (de) => {
                  var ve = Ow(), me = re(ve);
                  ss(me, { class: "size-4" }), u(de, ve);
                }, oe = (de) => {
                  var ve = Dw(), me = re(ve);
                  jc(me, { class: "size-4" }), u(de, ve);
                };
                I(J, (de) => {
                  var _a10, _b4;
                  ((_a10 = s(w)) == null ? void 0 : _a10.running) ? de(se) : ((_b4 = s(w)) == null ? void 0 : _b4.success) === true ? de(ie, 1) : de(oe, -1);
                });
              }
              u($, G);
            }, $$slots: { default: true } });
          }
          u(S, R);
        };
        I(W, (S) => {
          s(a) && S(A);
        });
      }
      L((S) => E(N, S), [() => f(s(a).timestamp)]), u(F, P);
    }, q = (F) => {
      var P = Bw(), C = d(P), T = d(C);
      ss(T, { class: "size-12 opacity-20" }), u(F, P);
    };
    I(j, (F) => {
      s(a) ? F(M) : s(n) || F(q, 1);
    });
  }
  u(t, p), Le();
}
Zt(["click", "keydown"]);
async function sr(t, e = null) {
  const r = await vc(t);
  return r == null || r === void 0 ? e : Qn(String(r), e);
}
async function _r(t, e) {
  await Sp(t, eo(e));
}
async function ii(t) {
  await Tp(t);
}
async function Gw(t) {
  if (t.length === 0) return {};
  const e = await Promise.all(t.map(async (r) => [r, Qn(String(await vc(r) ?? ""), null)]));
  return Object.fromEntries(e);
}
const un = Object.freeze(Object.defineProperty({ __proto__: null, getSetting: sr, getSettings: Gw, removeSetting: ii, setSetting: _r }, Symbol.toStringTag, { value: "Module" })), Ww = "https://gmail.googleapis.com/gmail/v1/users/me";
class Lg extends Error {
  constructor(e, r, n) {
    super(e);
    __publicField(this, "status");
    __publicField(this, "code");
    this.name = "GmailApiError", this.status = r, this.code = n ?? null;
  }
}
function Vw(t) {
  return { Authorization: `Bearer ${t}` };
}
async function Ri(t, e) {
  var _a10, _b4, _c6, _d4;
  const r = await fetch(`${Ww}${e}`, { headers: Vw(t) });
  if (!r.ok) {
    const n = await r.json().catch(() => ({})), a = ((_a10 = n.error) == null ? void 0 : _a10.message) || `Gmail API error: ${r.status}`, o = (_d4 = (_c6 = (_b4 = n.error) == null ? void 0 : _b4.errors) == null ? void 0 : _c6[0]) == null ? void 0 : _d4.reason;
    throw new Lg(a, r.status, o);
  }
  return r.json();
}
function jg(t) {
  return Ri(t, "/profile");
}
function Bg(t, { maxResults: e = 20, pageToken: r, q: n } = {}) {
  const a = new URLSearchParams();
  return a.set("maxResults", String(e)), r && a.set("pageToken", r), n && a.set("q", n), Ri(t, `/messages?${a}`);
}
function Fg(t, e, r = "full") {
  return Ri(t, `/messages/${e}?format=${r}`);
}
function Hw(t, { startHistoryId: e, pageToken: r, maxResults: n = 500 }) {
  const a = new URLSearchParams();
  return a.set("startHistoryId", e), a.set("maxResults", String(n)), a.append("historyTypes", "messageAdded"), a.append("historyTypes", "messageDeleted"), r && a.set("pageToken", r), Ri(t, `/history?${a}`);
}
function ca(t, e) {
  var _a10, _b4;
  const r = ((_a10 = t == null ? void 0 : t.payload) == null ? void 0 : _a10.headers) || [], n = e.toLowerCase();
  return ((_b4 = r.find((o) => o.name.toLowerCase() === n)) == null ? void 0 : _b4.value) || "";
}
function Xs(t) {
  let e = t.replace(/-/g, "+").replace(/_/g, "/");
  const r = e.length % 4;
  r && (e += "=".repeat(4 - r));
  const n = atob(e), a = Uint8Array.from(n, (o) => o.charCodeAt(0));
  return new TextDecoder().decode(a);
}
function li(t, e) {
  for (const r of t) {
    if (r.mimeType === e) return r;
    if (r.parts) {
      const n = li(r.parts, e);
      if (n) return n;
    }
  }
}
function qw(t) {
  var _a10;
  try {
    const e = new DOMParser().parseFromString(t, "text/html");
    for (const r of e.querySelectorAll("style, script")) r.remove();
    return (((_a10 = e.body) == null ? void 0 : _a10.textContent) || "").replace(/\s+/g, " ").trim();
  } catch {
    return t.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "").replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "").replace(/<[^>]+>/g, " ").replace(/&#x([0-9a-f]+);/gi, (e, r) => String.fromCodePoint(parseInt(r, 16))).replace(/&#(\d+);/g, (e, r) => String.fromCodePoint(Number(r))).replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/\s+/g, " ").trim();
  }
}
function Yw(t) {
  var _a10, _b4;
  const e = t == null ? void 0 : t.payload;
  if (!e) return "";
  const r = e.body;
  if (r == null ? void 0 : r.data) return Xs(r.data);
  const n = e.parts || [], a = li(n, "text/plain");
  if ((_a10 = a == null ? void 0 : a.body) == null ? void 0 : _a10.data) return Xs(a.body.data);
  const o = li(n, "text/html");
  return ((_b4 = o == null ? void 0 : o.body) == null ? void 0 : _b4.data) ? qw(Xs(o.body.data)) : "(no body)";
}
function Kw(t) {
  var _a10;
  const e = t == null ? void 0 : t.payload;
  if (!e) return null;
  if (e.mimeType === "text/html") {
    const a = e.body;
    if (a == null ? void 0 : a.data) return Xs(a.data);
  }
  const r = e.parts || [], n = li(r, "text/html");
  return ((_a10 = n == null ? void 0 : n.body) == null ? void 0 : _a10.data) ? Xs(n.body.data) : null;
}
const en = "gmail", Bu = 8, Ug = 50, Gg = 100;
async function Xw(t, { limit: e = Ug, onProgress: r = () => {
}, signal: n } = {}) {
  var _a10;
  const a = await Sd(en);
  if (a == null ? void 0 : a.historyId) try {
    return await e2(t, a, r, n);
  } catch (i) {
    if (i instanceof Lg && (i.status === 404 || i.code === "notFound") || ((_a10 = i == null ? void 0 : i.message) == null ? void 0 : _a10.includes("Start history id"))) r({ phase: "info", message: "History expired, performing full re-sync..." }), await hc(en);
    else throw i;
  }
  return await Jw(t, e === 0 ? 1 / 0 : e, r, n);
}
async function Zw(t, { limit: e = Ug, onProgress: r = () => {
}, signal: n } = {}) {
  const a = await Sd(en);
  return (a == null ? void 0 : a.oldestPageToken) ? await Qw(t, a, e === 0 ? 1 / 0 : e, r, n) : (r({ phase: "done", message: "All messages already synced" }), { added: 0, errors: 0 });
}
async function Wg() {
  const t = await Sd(en);
  return t ? { synced: true, totalItems: t.totalItems || 0, lastSyncAt: t.lastSyncAt, historyId: t.historyId, hasMore: !!t.oldestPageToken } : { synced: false, totalItems: 0, lastSyncAt: null, hasMore: false };
}
async function kd() {
  return Number(await _c(en) ?? 0);
}
async function Jw(t, e, r, n) {
  r({ phase: "counting", message: "Getting mailbox info..." }), ja(n);
  const a = await jg(t);
  r({ phase: "listing", message: "Listing messages...", current: 0, total: Math.min(a.messagesTotal ?? e, e) });
  const o = [];
  let i, l = null;
  for (; o.length < e; ) {
    ja(n);
    const m = e - o.length, h = await Bg(t, { maxResults: Math.min(Gg, m), pageToken: i }), x = (h.messages || []).map((b) => b.id);
    if (o.push(...x), r({ phase: "listing", message: `Listed ${o.length} messages...`, current: o.length, total: Math.min(a.messagesTotal ?? e, e) }), i = h.nextPageToken, !i || x.length === 0) break;
  }
  if (l = i || null, o.length === 0) return await Ol({ sourceType: en, historyId: a.historyId ?? "", lastSyncAt: Date.now(), totalItems: 0, oldestPageToken: "" }), { added: 0, deleted: 0, errors: 0 };
  const { added: c, errors: f } = await Vg(t, o, r, n), p = await kd();
  return await Ol({ sourceType: en, historyId: a.historyId ?? "", lastSyncAt: Date.now(), totalItems: p, oldestPageToken: l ?? "" }), r({ phase: "done", message: `Synced ${c} messages`, current: c, total: c }), { added: c, deleted: 0, errors: f };
}
async function Qw(t, e, r, n, a) {
  n({ phase: "listing", message: "Loading more messages...", current: 0 }), ja(a);
  const o = [];
  let i = e.oldestPageToken || void 0, l = null;
  for (; o.length < r; ) {
    ja(a);
    const m = r - o.length, h = await Bg(t, { maxResults: Math.min(Gg, m), pageToken: i }), x = (h.messages || []).map((b) => b.id);
    if (o.push(...x), n({ phase: "listing", message: `Listed ${o.length} more messages...`, current: o.length }), i = h.nextPageToken, !i || x.length === 0) break;
  }
  if (l = i || null, o.length === 0) return await Qs(en, e.historyId ?? "", Date.now(), e.totalItems ?? 0, ""), n({ phase: "done", message: "All messages synced" }), { added: 0, errors: 0 };
  const { added: c, errors: f } = await Vg(t, o, n, a), p = await kd();
  return await Qs(en, e.historyId ?? "", Date.now(), p, l ?? ""), n({ phase: "done", message: l ? `Downloaded ${c} more (more available)` : `Downloaded ${c} more (all synced)`, current: p, total: p }), { added: c, errors: f };
}
async function e2(t, e, r, n) {
  r({ phase: "syncing", message: "Checking for changes..." }), ja(n);
  let a = 0, o = 0, i = 0, l, c = e.historyId;
  do {
    ja(n);
    const p = await Hw(t, { startHistoryId: e.historyId, pageToken: l });
    if (c = p.historyId ?? c, l = p.nextPageToken, !!p.history) {
      for (const m of p.history) {
        if (m.messagesAdded) {
          const h = m.messagesAdded.map((b) => b.message.id), x = [...new Set(h.filter(Boolean))];
          if (x.length > 0) {
            const b = await Promise.allSettled(x.map((k) => Fg(t, k))), y = [];
            for (const k of b) k.status === "fulfilled" ? y.push(Hg(k.value)) : i++;
            y.length > 0 && (await qg(y), await Yg(y), a += y.length);
          }
        }
        if (m.messagesDeleted) {
          const h = m.messagesDeleted.map((x) => fv(en, x.message.id)).filter(Boolean);
          h.length > 0 && (await t2(h), o += h.length);
        }
      }
      r({ phase: "syncing", message: `Changes: +${a} -${o}`, current: a + o });
    }
  } while (l);
  const f = await kd();
  return await Ol({ sourceType: en, historyId: c, lastSyncAt: Date.now(), totalItems: f, oldestPageToken: e.oldestPageToken ?? "" }), r({ phase: "done", message: a === 0 && o === 0 ? "Already up to date" : `Synced: +${a} -${o}`, current: f, total: f }), { added: a, deleted: o, errors: i };
}
async function Vg(t, e, r, n) {
  r({ phase: "downloading", message: "Downloading messages...", current: 0, total: e.length });
  let a = 0, o = 0;
  for (let i = 0; i < e.length; i += Bu) {
    ja(n);
    const l = e.slice(i, i + Bu), c = await Promise.allSettled(l.map((p) => Fg(t, p))), f = [];
    for (const p of c) p.status === "fulfilled" ? f.push(Hg(p.value)) : o++;
    f.length > 0 && (await qg(f), await Yg(f)), a += f.length, r({ phase: "downloading", message: `Downloaded ${a} of ${e.length} messages`, current: a, total: e.length });
  }
  return { added: a, errors: o };
}
function Hg(t) {
  const e = t, r = ca(e, "From") ?? "", n = ca(e, "To") ?? "", a = ca(e, "Cc") ?? "", o = ca(e, "Subject") || "(no subject)", i = ca(e, "Date"), l = ca(e, "Message-ID") ?? "", c = ca(e, "In-Reply-To") ?? "", f = ca(e, "References") ?? "";
  let p;
  try {
    p = i ? new Date(i).getTime() : t.internalDate ? Number(t.internalDate) : Date.now();
  } catch {
    p = Date.now();
  }
  return { id: fv(en, t.id), sourceType: en, sourceId: t.id, threadKey: `gmail:${t.threadId ?? "unknown"}`, type: "email", from: r, to: n, cc: a, subject: o, snippet: t.snippet || "", body: Yw(e) ?? "", htmlBody: Kw(e) ?? "", date: p, labels: t.labelIds || [], messageId: l, inReplyTo: c, references: f, raw: t, syncedAt: Date.now() };
}
async function qg(t) {
  const e = t.map((r) => ({ id: r.id, sourceType: r.sourceType, sourceId: r.sourceId ?? null, threadKey: r.threadKey ?? null, type: r.type ?? null, from: r.from ?? null, to: r.to ?? null, cc: r.cc ?? null, subject: r.subject ?? null, snippet: r.snippet ?? null, body: r.body ?? null, htmlBody: r.htmlBody ?? null, date: r.date ?? null, labels: eo(r.labels), messageId: r.messageId ?? null, inReplyTo: r.inReplyTo ?? null, references: r.references ?? null, raw: eo(r.raw), syncedAt: r.syncedAt ?? null }));
  await xc(e);
}
async function t2(t) {
  await Gp(t);
}
async function Yg(t) {
  const e = /* @__PURE__ */ new Map();
  for (const r of t) for (const n of [r.from, r.to, r.cc]) {
    if (!n) continue;
    const a = n.split(",").map((o) => o.trim()).filter(Boolean);
    for (const o of a) {
      const i = r2(o);
      i && !e.has(i.email) && e.set(i.email, { ...i, date: r.date ?? Date.now() });
    }
  }
  for (const [r, { name: n, date: a }] of e) {
    const o = await Wp(r);
    if (o != null) {
      const i = o;
      await xl(r, i.name || n || "", Number(i.firstSeen) || a, Math.max(a, Number(i.lastSeen) || 0));
    } else await xl(r, n || "", a, a);
  }
}
function r2(t) {
  if (!t) return null;
  const e = t.match(/<([^>]+)>/);
  if (e) {
    const n = e[1].toLowerCase().trim(), a = t.slice(0, t.indexOf("<")).replace(/"/g, "").trim();
    return { email: n, name: a };
  }
  const r = t.toLowerCase().trim();
  return r.includes("@") ? { email: r, name: "" } : null;
}
async function Sd(t) {
  const e = await bc(t);
  if (e == null) return null;
  const r = e;
  return { sourceType: r.sourceType, historyId: r.historyId, lastSyncAt: r.lastSyncAt != null ? Number(r.lastSyncAt) : null, totalItems: r.totalItems != null ? Number(r.totalItems) : 0, oldestPageToken: r.oldestPageToken ?? "" };
}
async function Ol({ sourceType: t, historyId: e, lastSyncAt: r, totalItems: n, oldestPageToken: a }) {
  await Qs(t, e, r ?? 0, n, a ?? "");
}
function ja(t) {
  if (t == null ? void 0 : t.aborted) throw new DOMException("Sync was cancelled", "AbortError");
}
async function n2() {
  const [t, e] = await Promise.all([ws().then((o) => Number(o ?? 0)), yi().then((o) => Number(o ?? 0))]);
  if (t === 0) return null;
  const r = [`Stored data: ${t} emails, ${e} contacts.`], { oldest: n, newest: a } = await Kg();
  if (n && a) {
    const o = new Date(n.date).toLocaleDateString(), i = new Date(a.date).toLocaleDateString();
    r.push(`Date range: ${o} to ${i}.`);
  }
  return r.join(" ");
}
async function a2() {
  const [t, e] = await Promise.all([ws().then((o) => Number(o ?? 0)), yi().then((o) => Number(o ?? 0))]);
  if (t === 0) return "No emails stored locally.";
  const r = ["## Data Summary", `- **Emails:** ${t}`, `- **Contacts:** ${e}`], { oldest: n, newest: a } = await Kg();
  if (n && a) {
    const o = new Date(n.date).toLocaleDateString(), i = new Date(a.date).toLocaleDateString();
    r.push(`- **Date range:** ${o} \u2014 ${i}`);
  }
  return r.join(`
`);
}
async function s2(t = 10) {
  const e = await ps(t);
  return (e == null ? void 0 : e.length) ? e.map((r) => Xg(Td(r))).join(`

---

`) : "No emails stored locally.";
}
async function o2(t, e = 10) {
  if (!t) return "No search query provided.";
  const r = await ps(e * 5), n = t.toLowerCase(), a = (r ?? []).filter((o) => {
    const i = String(o.subject ?? "").toLowerCase(), l = String(o.from ?? "").toLowerCase(), c = String(o.to ?? "").toLowerCase(), f = String(o.snippet ?? "").toLowerCase(), p = String(o.body ?? "").toLowerCase();
    return i.includes(n) || l.includes(n) || c.includes(n) || f.includes(n) || p.includes(n);
  }).slice(0, e);
  return a.length === 0 ? "No matching emails found." : a.map((o) => Xg(Td(o))).join(`

---

`);
}
async function ci() {
  const e = (await ta() ?? []).filter((o) => o.status === "pending");
  if (e.length === 0) return null;
  const r = e.map((o) => ({ ...o, tags: Qn(o.tags, []) })), { categories: n, order: a } = Fv(r);
  return { categories: n, order: a, total: r.length };
}
async function i2({ query: t, limit: e = 50, offset: r = 0 } = {}) {
  const n = t ? 2e3 : e + r;
  let o = await ps(n) ?? [];
  if (t) {
    const c = t.toLowerCase();
    o = o.filter((f) => {
      const p = String(f.subject ?? "").toLowerCase(), m = String(f.from ?? "").toLowerCase(), h = String(f.to ?? "").toLowerCase(), x = String(f.snippet ?? "").toLowerCase();
      return p.includes(c) || m.includes(c) || h.includes(c) || x.includes(c);
    });
  }
  const i = t ? o.length : Number(await ws() ?? 0);
  return { items: o.slice(r, r + e).map((c) => Td(c)), total: i };
}
async function Kg() {
  const [t, e] = await Promise.all([wp(), kp()]), r = t != null ? Number(t) : null, n = e != null ? Number(e) : null;
  return { oldest: r != null ? { date: r } : null, newest: n != null ? { date: n } : null };
}
function Td(t) {
  return { ...t, id: t.id, sourceType: t.sourceType, sourceId: t.sourceId, threadKey: t.threadKey, type: t.type, from: t.from, to: t.to, cc: t.cc, subject: t.subject, snippet: t.snippet, body: t.body, htmlBody: t.htmlBody, date: t.date != null ? Number(t.date) : null, syncedAt: t.syncedAt != null ? Number(t.syncedAt) : null, labels: Qn(t.labels, []), raw: Qn(t.raw, null), messageId: t.messageId ?? "", inReplyTo: t.inReplyTo ?? "", references: t.references ?? "" };
}
function Xg(t) {
  const e = t.date ? new Date(t.date).toLocaleString() : "Unknown date", r = xb(t.body || t.snippet || "", 500);
  switch (t.type) {
    case "email":
      return [`**Subject:** ${t.subject}`, `**From:** ${t.from}`, `**To:** ${t.to}`, t.cc ? `**CC:** ${t.cc}` : "", `**Date:** ${e}`, `**Labels:** ${(t.labels || []).join(", ")}`, "", r].filter(Boolean).join(`
`);
    default:
      return [`**From:** ${t.from}`, `**Date:** ${e}`, "", r].join(`
`);
  }
}
const l2 = "https://twitter.com/i/oauth2/authorize", Zg = "https://api.twitter.com/2/oauth2/token", c2 = "https://api.twitter.com/2/oauth2/revoke", d2 = ["tweet.read", "users.read", "like.read", "like.write", "bookmark.read", "bookmark.write", "offline.access"].join(" "), Ad = "me-ai:twitter-token", Dl = "me-ai:twitter-pkce-verifier", Ll = "me-ai:twitter-pkce-state", Ed = "me-ai:twitter-token", Fu = 300 * 1e3;
let Ba = null, Cd = null, di = 0;
function Uu(t = 64) {
  const e = new Uint8Array(t);
  return crypto.getRandomValues(e), Array.from(e, (r) => r.toString(16).padStart(2, "0")).join("").slice(0, t);
}
async function u2(t) {
  const e = new TextEncoder().encode(t);
  return crypto.subtle.digest("SHA-256", e);
}
function f2(t) {
  const e = new Uint8Array(t);
  let r = "";
  for (const n of e) r += String.fromCharCode(n);
  return btoa(r).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
async function p2(t) {
  const e = await u2(t);
  return f2(e);
}
function Jg(t) {
  try {
    localStorage.setItem(Ad, JSON.stringify(t));
  } catch {
  }
}
function Qg() {
  try {
    localStorage.removeItem(Ad);
  } catch {
  }
}
function Id() {
  try {
    const t = localStorage.getItem(Ad);
    return t ? JSON.parse(t) : null;
  } catch {
    return null;
  }
}
async function em(t, e, r) {
  const n = Date.now() + r * 1e3;
  di = n;
  const a = { access_token: t, refresh_token: e, expires_at: n };
  Jg(a);
  try {
    const { setSetting: o } = await wr(async () => {
      const { setSetting: i } = await Promise.resolve().then(() => un);
      return { setSetting: i };
    }, void 0);
    await o(Ed, a);
  } catch {
  }
}
async function Bo() {
  di = 0, Qg();
  try {
    const { removeSetting: t } = await wr(async () => {
      const { removeSetting: e } = await Promise.resolve().then(() => un);
      return { removeSetting: e };
    }, void 0);
    await t(Ed);
  } catch {
  }
}
function Qi(t, e) {
  Ba = t, Cd = `${window.location.origin}/#oauth-twitter`;
}
async function v2() {
  if (!Ba) throw new Error("Twitter Auth not initialized. Call initTwitterAuth first.");
  const t = Uu(64), e = await p2(t), r = Uu(32);
  localStorage.setItem(Dl, t), localStorage.setItem(Ll, r);
  const n = new URLSearchParams({ response_type: "code", client_id: Ba, redirect_uri: Cd ?? `${window.location.origin}/#oauth-twitter`, scope: d2, state: r, code_challenge: e, code_challenge_method: "S256" });
  window.location.href = `${l2}?${n}`;
}
async function g2(t, e) {
  const r = localStorage.getItem(Ll), n = localStorage.getItem(Dl);
  if (localStorage.removeItem(Ll), localStorage.removeItem(Dl), !r || r !== e) throw new Error("Invalid state parameter \u2014 possible CSRF attack.");
  if (!n) throw new Error("Missing PKCE code verifier \u2014 auth flow may have been interrupted.");
  const a = new URLSearchParams({ grant_type: "authorization_code", code: t, redirect_uri: Cd ?? `${window.location.origin}/#oauth-twitter`, client_id: Ba, code_verifier: n }), o = await fetch(Zg, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: a });
  if (!o.ok) {
    const l = await o.json().catch(() => ({}));
    throw new Error(l.error_description || l.error || `Token exchange failed: ${o.status}`);
  }
  const i = await o.json();
  return await em(i.access_token, i.refresh_token, i.expires_in ?? 7200), { access_token: i.access_token, refresh_token: i.refresh_token };
}
async function tm() {
  const t = Id();
  if ((t == null ? void 0 : t.access_token) && Date.now() < t.expires_at - Fu) return di = t.expires_at, { access_token: t.access_token, refresh_token: t.refresh_token ?? "" };
  try {
    const { getSetting: e } = await wr(async () => {
      const { getSetting: n } = await Promise.resolve().then(() => un);
      return { getSetting: n };
    }, void 0), r = await e(Ed);
    if (!(r == null ? void 0 : r.access_token)) return Qg(), null;
    if (Date.now() > r.expires_at - Fu) {
      if (r.refresh_token) try {
        return await m2(r.refresh_token);
      } catch {
        return await Bo(), null;
      }
      return await Bo(), null;
    }
    return di = r.expires_at, Jg(r), { access_token: r.access_token, refresh_token: r.refresh_token ?? "" };
  } catch {
    return await Bo(), null;
  }
}
async function m2(t) {
  var _a10;
  let e = t;
  if (e || (e = (_a10 = Id()) == null ? void 0 : _a10.refresh_token), !e) throw new Error("No refresh token available.");
  const r = new URLSearchParams({ grant_type: "refresh_token", refresh_token: e, client_id: Ba }), n = await fetch(Zg, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: r });
  if (!n.ok) {
    const o = await n.json().catch(() => ({}));
    throw new Error(o.error_description || o.error || `Token refresh failed: ${n.status}`);
  }
  const a = await n.json();
  return await em(a.access_token, a.refresh_token ?? e, a.expires_in ?? 7200), { access_token: a.access_token, refresh_token: a.refresh_token ?? e };
}
async function h2() {
  const t = Id();
  if ((t == null ? void 0 : t.access_token) && Ba) try {
    await fetch(c2, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ token: t.access_token, client_id: Ba }) });
  } catch {
  }
  await Bo();
}
const _2 = "https://api.twitter.com/2";
class b2 extends Error {
  constructor(e, r, n) {
    super(e);
    __publicField(this, "status");
    __publicField(this, "code");
    this.name = "TwitterApiError", this.status = r, this.code = n ?? null;
  }
}
function x2(t) {
  return { Authorization: `Bearer ${t}` };
}
async function rm(t, e) {
  const r = await fetch(`${_2}${e}`, { headers: x2(t) });
  if (!r.ok) {
    const n = await r.json().catch(() => ({})), a = n.detail || n.title || `Twitter API error: ${r.status}`, o = n.type ?? void 0;
    throw new b2(a, r.status, o);
  }
  return r.json();
}
function Pd(t) {
  return rm(t, "/users/me?user.fields=id,name,username,profile_image_url,public_metrics");
}
function $d(t, e, r = {}) {
  const { maxResults: n = 10, paginationToken: a } = r, o = new URLSearchParams({ max_results: String(Math.min(n, 100)), "tweet.fields": "created_at,author_id,public_metrics,referenced_tweets,conversation_id,text", "user.fields": "username,name", expansions: "author_id" });
  return a && o.set("pagination_token", a), rm(t, `/users/${e}/tweets?${o}`);
}
function Nd(t) {
  var _a10;
  const e = /* @__PURE__ */ new Map(), r = (_a10 = t == null ? void 0 : t.includes) == null ? void 0 : _a10.users;
  if (r) for (const n of r) e.set(n.id, { username: n.username, name: n.name });
  return e;
}
const nm = 50;
async function y2(t, { limit: e = nm, onProgress: r = () => {
}, signal: n } = {}) {
  var _a10, _b4;
  ho(n);
  const a = await Pd(t), o = (_a10 = a.data) == null ? void 0 : _a10.id, i = (_b4 = a.data) == null ? void 0 : _b4.username;
  if (!o || !i) throw new Error("Twitter me.data missing");
  const l = await zd("twitter");
  return l ? await T2(t, o, i, l, e, r, n) : await S2(t, o, i, e, r, n);
}
async function w2(t, { limit: e = nm, onProgress: r = () => {
}, signal: n } = {}) {
  var _a10, _b4;
  ho(n);
  const a = await Pd(t), o = (_a10 = a.data) == null ? void 0 : _a10.id, i = (_b4 = a.data) == null ? void 0 : _b4.username;
  if (!o || !i) throw new Error("Twitter me.data missing");
  const l = await zd("twitter");
  return (l == null ? void 0 : l.oldestPageToken) ? await A2(t, o, i, l, e, r, n) : { added: 0, errors: 0 };
}
async function am() {
  const t = await zd("twitter");
  return t ? { synced: true, totalItems: t.totalItems || 0, lastSyncAt: t.lastSyncAt, hasMore: !!t.oldestPageToken } : { synced: false, totalItems: 0, lastSyncAt: null, hasMore: false };
}
async function k2() {
  await Fp("twitter"), await hc("twitter");
}
async function S2(t, e, r, n, a, o) {
  var _a10;
  let i = 0, l = 0, c, f = null, p = null;
  for (a({ phase: "listing", message: "Fetching tweets\u2026", current: 0, total: n }); i < n; ) {
    ho(o);
    const m = Math.min(n - i, 100);
    let h;
    try {
      h = await $d(t, e, { maxResults: m, paginationToken: c });
    } catch (D) {
      l++, console.warn("[twitter-sync] API error:", D == null ? void 0 : D.message);
      break;
    }
    const x = (h == null ? void 0 : h.data) ?? [];
    if (x.length === 0) break;
    const b = Nd(h), y = x.map((D) => Rd(D, b, r));
    !f && y.length > 0 && (f = y[0].sourceId), await Md(y), i += y.length, a({ phase: "fetching", message: `Downloaded ${i} tweets\u2026`, current: i, total: n });
    const k = (_a10 = h == null ? void 0 : h.meta) == null ? void 0 : _a10.next_token;
    if (!k) break;
    c = k, p = k;
  }
  return await Od({ sourceType: "twitter", historyId: f || "", lastSyncAt: Date.now(), totalItems: i, oldestPageToken: p || "" }), a({ phase: "done", message: `Synced ${i} tweets`, current: i, total: i }), { added: i, errors: l };
}
async function T2(t, e, r, n, a, o, i) {
  var _a10;
  let l = 0, c = 0, f;
  for (o({ phase: "incremental", message: "Checking for new tweets\u2026", current: 0, total: 0 }); l < a; ) {
    ho(i);
    const h = Math.min(a - l, 100);
    let x;
    try {
      x = await $d(t, e, { maxResults: h, paginationToken: f });
    } catch (U) {
      c++, console.warn("[twitter-sync] Incremental sync error:", U == null ? void 0 : U.message);
      break;
    }
    const b = (x == null ? void 0 : x.data) ?? [];
    if (b.length === 0) break;
    const y = Nd(x), k = [];
    let D = false;
    for (const U of b) {
      if (U.id === n.historyId) {
        D = true;
        break;
      }
      k.push(U);
    }
    if (k.length > 0) {
      const U = k.map((j) => Rd(j, y, r));
      await Md(U), l += U.length, o({ phase: "incremental", message: `${l} new tweets\u2026`, current: l, total: 0 });
    }
    if (D || !((_a10 = x == null ? void 0 : x.meta) == null ? void 0 : _a10.next_token)) break;
    f = x.meta.next_token;
  }
  const p = (n.totalItems || 0) + l, m = l > 0 && await E2() || n.historyId;
  return await Od({ sourceType: "twitter", historyId: m, lastSyncAt: Date.now(), totalItems: p, oldestPageToken: n.oldestPageToken }), o({ phase: "done", message: l > 0 ? `${l} new tweets synced` : "Already up to date", current: l, total: l }), { added: l, errors: c };
}
async function A2(t, e, r, n, a, o, i) {
  var _a10;
  let l = 0, c = 0, f = n.oldestPageToken;
  for (o({ phase: "fetching", message: "Fetching older tweets\u2026", current: 0, total: a }); l < a && f; ) {
    ho(i);
    const p = Math.min(a - l, 100);
    let m;
    try {
      m = await $d(t, e, { maxResults: p, paginationToken: f });
    } catch {
      c++;
      break;
    }
    const h = (m == null ? void 0 : m.data) ?? [];
    if (h.length === 0) break;
    const x = Nd(m), b = h.map((y) => Rd(y, x, r));
    await Md(b), l += b.length, o({ phase: "fetching", message: `Downloaded ${n.totalItems + l} tweets total\u2026`, current: l, total: a }), f = ((_a10 = m == null ? void 0 : m.meta) == null ? void 0 : _a10.next_token) || null;
  }
  return await Od({ sourceType: "twitter", historyId: n.historyId, lastSyncAt: Date.now(), totalItems: (n.totalItems || 0) + l, oldestPageToken: f || "" }), o({ phase: "done", message: `Fetched ${l} more tweets`, current: l, total: l }), { added: l, errors: c };
}
function Rd(t, e, r) {
  var _a10, _b4;
  const a = ((_a10 = e == null ? void 0 : e.get(t.author_id ?? "")) == null ? void 0 : _a10.username) || r || "unknown", o = t.text || "", i = o.slice(0, 120).replace(/\n/g, " "), l = t.created_at ? new Date(t.created_at).getTime() : Date.now(), c = t.public_metrics ? JSON.stringify([`\u2661${t.public_metrics.like_count ?? 0}`, `\u{1F504}${t.public_metrics.retweet_count ?? 0}`]) : "[]";
  return { id: `twitter:${t.id}`, sourceType: "twitter", sourceId: t.id, threadKey: t.conversation_id || t.id, type: ((_b4 = t.referenced_tweets) == null ? void 0 : _b4.length) ? "retweet" : "tweet", from: `@${a}`, to: "", cc: "", subject: i, snippet: o.slice(0, 200), body: o, htmlBody: null, date: l, labels: c, messageId: t.id, inReplyTo: "", references: "", raw: JSON.stringify(t), syncedAt: Date.now() };
}
async function Md(t) {
  if (!t.length) return;
  const e = t.map((r) => ({ id: r.id, sourceType: r.sourceType, sourceId: r.sourceId ?? null, threadKey: r.threadKey ?? null, type: r.type ?? null, from: r.from ?? null, to: r.to ?? null, cc: r.cc ?? null, subject: r.subject ?? null, snippet: r.snippet ?? null, body: r.body ?? null, htmlBody: r.htmlBody ?? null, date: r.date ?? null, labels: typeof r.labels == "string" ? r.labels : JSON.stringify(r.labels ?? []), messageId: r.messageId ?? null, inReplyTo: r.inReplyTo ?? null, references: r.references ?? null, raw: typeof r.raw == "string" ? r.raw : JSON.stringify(r.raw ?? null), syncedAt: r.syncedAt ?? null }));
  try {
    await xc(e);
  } catch {
  }
}
async function zd(t) {
  try {
    const e = await bc(t);
    if (e == null) return null;
    const r = e;
    return { sourceType: r.sourceType, historyId: r.historyId, lastSyncAt: Number(r.lastSyncAt), totalItems: Number(r.totalItems), oldestPageToken: r.oldestPageToken || "" };
  } catch {
    return null;
  }
}
async function Od({ sourceType: t, historyId: e, lastSyncAt: r, totalItems: n, oldestPageToken: a }) {
  await Qs(t, e, r ?? 0, n ?? 0, a || "");
}
async function E2() {
  try {
    return await Vp("twitter") ?? null;
  } catch {
    return null;
  }
}
function ho(t) {
  if (t == null ? void 0 : t.aborted) throw new DOMException("Aborted", "AbortError");
}
const C2 = typeof localStorage < "u" && localStorage.getItem("debug") === "true";
function Gu(...t) {
  C2 && console.log("[debug]", ...t);
}
function qa(t) {
  return Gu(`[MOUNT] ${t}`), () => Gu(`[DESTROY] ${t}`);
}
var I2 = _('<button class="flex gap-3 px-4 py-3.5 bg-card border-b border-border last:border-b-0 text-left hover:bg-accent transition-colors w-full"><div class="size-[34px] rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-semibold shrink-0"> </div> <div class="flex-1 min-w-0 flex flex-col gap-0.5"><div class="flex items-baseline justify-between gap-2"><span class="text-[0.84rem] font-semibold text-foreground truncate"> </span> <span class="text-[0.68rem] text-muted-foreground/40 whitespace-nowrap shrink-0"> </span></div> <div class="text-[0.8rem] text-foreground/70 truncate"> </div> <div class="text-[0.73rem] text-muted-foreground/50 truncate"> </div></div></button>'), P2 = _('<div class="flex flex-col rounded border border-border overflow-hidden"></div>');
function Wu(t, e) {
  De(e, true);
  let r = ae(e, "messages", 19, () => []);
  Xt(() => qa("MessageList"));
  var n = P2();
  Ge(n, 21, r, Qe, (a, o) => {
    var i = I2(), l = d(i), c = d(l), f = v(l, 2), p = d(f), m = d(p), h = d(m), x = v(m, 2), b = d(x), y = v(p, 2), k = d(y), D = v(y, 2), U = d(D);
    L((j, M, q) => {
      E(c, j), E(h, M), E(b, q), E(k, s(o).subject), E(U, s(o).snippet);
    }, [() => yb(s(o).from), () => jv(s(o).from), () => Mc(s(o).date)]), Pe("click", i, () => e.onselect(s(o))), u(a, i);
  }), u(t, n), Le();
}
Zt(["click"]);
function Dd() {
  return { async: false, breaks: false, extensions: null, gfm: true, hooks: null, pedantic: false, renderer: null, silent: false, tokenizer: null, walkTokens: null };
}
var Ya = Dd();
function sm(t) {
  Ya = t;
}
var Ia = { exec: () => null };
function Ct(t, e = "") {
  let r = typeof t == "string" ? t : t.source, n = { replace: (a, o) => {
    let i = typeof o == "string" ? o : o.source;
    return i = i.replace(Or.caret, "$1"), r = r.replace(a, i), n;
  }, getRegex: () => new RegExp(r, e) };
  return n;
}
var $2 = (() => {
  try {
    return !!new RegExp("(?<=1)(?<!1)");
  } catch {
    return false;
  }
})(), Or = { codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] +\S/, listReplaceTask: /^\[[ xX]\] +/, listTaskCheckbox: /\[[ xX]\]/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (t) => new RegExp(`^( {0,3}${t})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), hrRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), fencesBeginRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}(?:\`\`\`|~~~)`), headingBeginRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}#`), htmlBeginRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}<(?:[a-z].*>|!--)`, "i"), blockquoteBeginRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}>`) }, N2 = /^(?:[ \t]*(?:\n|$))+/, R2 = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, M2 = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, _o = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, z2 = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, Ld = / {0,3}(?:[*+-]|\d{1,9}[.)])/, om = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, im = Ct(om).replace(/bull/g, Ld).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), O2 = Ct(om).replace(/bull/g, Ld).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), jd = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, D2 = /^[^\n]+/, Bd = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, L2 = Ct(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", Bd).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), j2 = Ct(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, Ld).getRegex(), Mi = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", Fd = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, B2 = Ct("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", Fd).replace("tag", Mi).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), lm = Ct(jd).replace("hr", _o).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Mi).getRegex(), F2 = Ct(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", lm).getRegex(), Ud = { blockquote: F2, code: R2, def: L2, fences: M2, heading: z2, hr: _o, html: B2, lheading: im, list: j2, newline: N2, paragraph: lm, table: Ia, text: D2 }, Vu = Ct("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", _o).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Mi).getRegex(), U2 = { ...Ud, lheading: O2, table: Vu, paragraph: Ct(jd).replace("hr", _o).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", Vu).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Mi).getRegex() }, G2 = { ...Ud, html: Ct(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", Fd).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: Ia, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: Ct(jd).replace("hr", _o).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", im).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, W2 = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, V2 = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, cm = /^( {2,}|\\)\n(?!\s*$)/, H2 = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, zi = /[\p{P}\p{S}]/u, Gd = /[\s\p{P}\p{S}]/u, dm = /[^\s\p{P}\p{S}]/u, q2 = Ct(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, Gd).getRegex(), um = /(?!~)[\p{P}\p{S}]/u, Y2 = /(?!~)[\s\p{P}\p{S}]/u, K2 = /(?:[^\s\p{P}\p{S}]|~)/u, fm = /(?![*_])[\p{P}\p{S}]/u, X2 = /(?![*_])[\s\p{P}\p{S}]/u, Z2 = /(?:[^\s\p{P}\p{S}]|[*_])/u, J2 = Ct(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", $2 ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), pm = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, Q2 = Ct(pm, "u").replace(/punct/g, zi).getRegex(), ek = Ct(pm, "u").replace(/punct/g, um).getRegex(), vm = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", tk = Ct(vm, "gu").replace(/notPunctSpace/g, dm).replace(/punctSpace/g, Gd).replace(/punct/g, zi).getRegex(), rk = Ct(vm, "gu").replace(/notPunctSpace/g, K2).replace(/punctSpace/g, Y2).replace(/punct/g, um).getRegex(), nk = Ct("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, dm).replace(/punctSpace/g, Gd).replace(/punct/g, zi).getRegex(), ak = Ct(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, fm).getRegex(), sk = "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", ok = Ct(sk, "gu").replace(/notPunctSpace/g, Z2).replace(/punctSpace/g, X2).replace(/punct/g, fm).getRegex(), ik = Ct(/\\(punct)/, "gu").replace(/punct/g, zi).getRegex(), lk = Ct(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), ck = Ct(Fd).replace("(?:-->|$)", "-->").getRegex(), dk = Ct("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", ck).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), ui = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/, uk = Ct(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label", ui).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), gm = Ct(/^!?\[(label)\]\[(ref)\]/).replace("label", ui).replace("ref", Bd).getRegex(), mm = Ct(/^!?\[(ref)\](?:\[\])?/).replace("ref", Bd).getRegex(), fk = Ct("reflink|nolink(?!\\()", "g").replace("reflink", gm).replace("nolink", mm).getRegex(), Hu = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, Wd = { _backpedal: Ia, anyPunctuation: ik, autolink: lk, blockSkip: J2, br: cm, code: V2, del: Ia, delLDelim: Ia, delRDelim: Ia, emStrongLDelim: Q2, emStrongRDelimAst: tk, emStrongRDelimUnd: nk, escape: W2, link: uk, nolink: mm, punctuation: q2, reflink: gm, reflinkSearch: fk, tag: dk, text: H2, url: Ia }, pk = { ...Wd, link: Ct(/^!?\[(label)\]\((.*?)\)/).replace("label", ui).getRegex(), reflink: Ct(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", ui).getRegex() }, jl = { ...Wd, emStrongRDelimAst: rk, emStrongLDelim: ek, delLDelim: ak, delRDelim: ok, url: Ct(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", Hu).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: Ct(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", Hu).getRegex() }, vk = { ...jl, br: Ct(cm).replace("{2,}", "*").getRegex(), text: Ct(jl.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() }, Mo = { normal: Ud, gfm: U2, pedantic: G2 }, Cs = { normal: Wd, gfm: jl, breaks: vk, pedantic: pk }, gk = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, qu = (t) => gk[t];
function Tn(t, e) {
  if (e) {
    if (Or.escapeTest.test(t)) return t.replace(Or.escapeReplace, qu);
  } else if (Or.escapeTestNoEncode.test(t)) return t.replace(Or.escapeReplaceNoEncode, qu);
  return t;
}
function Yu(t) {
  try {
    t = encodeURI(t).replace(Or.percentDecode, "%");
  } catch {
    return null;
  }
  return t;
}
function Ku(t, e) {
  var _a10;
  let r = t.replace(Or.findPipe, (o, i, l) => {
    let c = false, f = i;
    for (; --f >= 0 && l[f] === "\\"; ) c = !c;
    return c ? "|" : " |";
  }), n = r.split(Or.splitPipe), a = 0;
  if (n[0].trim() || n.shift(), n.length > 0 && !((_a10 = n.at(-1)) == null ? void 0 : _a10.trim()) && n.pop(), e) if (n.length > e) n.splice(e);
  else for (; n.length < e; ) n.push("");
  for (; a < n.length; a++) n[a] = n[a].trim().replace(Or.slashPipe, "|");
  return n;
}
function Is(t, e, r) {
  let n = t.length;
  if (n === 0) return "";
  let a = 0;
  for (; a < n && t.charAt(n - a - 1) === e; ) a++;
  return t.slice(0, n - a);
}
function mk(t, e) {
  if (t.indexOf(e[1]) === -1) return -1;
  let r = 0;
  for (let n = 0; n < t.length; n++) if (t[n] === "\\") n++;
  else if (t[n] === e[0]) r++;
  else if (t[n] === e[1] && (r--, r < 0)) return n;
  return r > 0 ? -2 : -1;
}
function hk(t, e = 0) {
  let r = e, n = "";
  for (let a of t) if (a === "	") {
    let o = 4 - r % 4;
    n += " ".repeat(o), r += o;
  } else n += a, r++;
  return n;
}
function Xu(t, e, r, n, a) {
  let o = e.href, i = e.title || null, l = t[1].replace(a.other.outputLinkReplace, "$1");
  n.state.inLink = true;
  let c = { type: t[0].charAt(0) === "!" ? "image" : "link", raw: r, href: o, title: i, text: l, tokens: n.inlineTokens(l) };
  return n.state.inLink = false, c;
}
function _k(t, e, r) {
  let n = t.match(r.other.indentCodeCompensation);
  if (n === null) return e;
  let a = n[1];
  return e.split(`
`).map((o) => {
    let i = o.match(r.other.beginningSpace);
    if (i === null) return o;
    let [l] = i;
    return l.length >= a.length ? o.slice(a.length) : o;
  }).join(`
`);
}
var fi = class {
  constructor(t) {
    __publicField(this, "options");
    __publicField(this, "rules");
    __publicField(this, "lexer");
    this.options = t || Ya;
  }
  space(t) {
    let e = this.rules.block.newline.exec(t);
    if (e && e[0].length > 0) return { type: "space", raw: e[0] };
  }
  code(t) {
    let e = this.rules.block.code.exec(t);
    if (e) {
      let r = e[0].replace(this.rules.other.codeRemoveIndent, "");
      return { type: "code", raw: e[0], codeBlockStyle: "indented", text: this.options.pedantic ? r : Is(r, `
`) };
    }
  }
  fences(t) {
    let e = this.rules.block.fences.exec(t);
    if (e) {
      let r = e[0], n = _k(r, e[3] || "", this.rules);
      return { type: "code", raw: r, lang: e[2] ? e[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : e[2], text: n };
    }
  }
  heading(t) {
    let e = this.rules.block.heading.exec(t);
    if (e) {
      let r = e[2].trim();
      if (this.rules.other.endingHash.test(r)) {
        let n = Is(r, "#");
        (this.options.pedantic || !n || this.rules.other.endingSpaceChar.test(n)) && (r = n.trim());
      }
      return { type: "heading", raw: e[0], depth: e[1].length, text: r, tokens: this.lexer.inline(r) };
    }
  }
  hr(t) {
    let e = this.rules.block.hr.exec(t);
    if (e) return { type: "hr", raw: Is(e[0], `
`) };
  }
  blockquote(t) {
    let e = this.rules.block.blockquote.exec(t);
    if (e) {
      let r = Is(e[0], `
`).split(`
`), n = "", a = "", o = [];
      for (; r.length > 0; ) {
        let i = false, l = [], c;
        for (c = 0; c < r.length; c++) if (this.rules.other.blockquoteStart.test(r[c])) l.push(r[c]), i = true;
        else if (!i) l.push(r[c]);
        else break;
        r = r.slice(c);
        let f = l.join(`
`), p = f.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        n = n ? `${n}
${f}` : f, a = a ? `${a}
${p}` : p;
        let m = this.lexer.state.top;
        if (this.lexer.state.top = true, this.lexer.blockTokens(p, o, true), this.lexer.state.top = m, r.length === 0) break;
        let h = o.at(-1);
        if ((h == null ? void 0 : h.type) === "code") break;
        if ((h == null ? void 0 : h.type) === "blockquote") {
          let x = h, b = x.raw + `
` + r.join(`
`), y = this.blockquote(b);
          o[o.length - 1] = y, n = n.substring(0, n.length - x.raw.length) + y.raw, a = a.substring(0, a.length - x.text.length) + y.text;
          break;
        } else if ((h == null ? void 0 : h.type) === "list") {
          let x = h, b = x.raw + `
` + r.join(`
`), y = this.list(b);
          o[o.length - 1] = y, n = n.substring(0, n.length - h.raw.length) + y.raw, a = a.substring(0, a.length - x.raw.length) + y.raw, r = b.substring(o.at(-1).raw.length).split(`
`);
          continue;
        }
      }
      return { type: "blockquote", raw: n, tokens: o, text: a };
    }
  }
  list(t) {
    var _a10, _b4;
    let e = this.rules.block.list.exec(t);
    if (e) {
      let r = e[1].trim(), n = r.length > 1, a = { type: "list", raw: "", ordered: n, start: n ? +r.slice(0, -1) : "", loose: false, items: [] };
      r = n ? `\\d{1,9}\\${r.slice(-1)}` : `\\${r}`, this.options.pedantic && (r = n ? r : "[*+-]");
      let o = this.rules.other.listItemRegex(r), i = false;
      for (; t; ) {
        let c = false, f = "", p = "";
        if (!(e = o.exec(t)) || this.rules.block.hr.test(t)) break;
        f = e[0], t = t.substring(f.length);
        let m = hk(e[2].split(`
`, 1)[0], e[1].length), h = t.split(`
`, 1)[0], x = !m.trim(), b = 0;
        if (this.options.pedantic ? (b = 2, p = m.trimStart()) : x ? b = e[1].length + 1 : (b = m.search(this.rules.other.nonSpaceChar), b = b > 4 ? 1 : b, p = m.slice(b), b += e[1].length), x && this.rules.other.blankLine.test(h) && (f += h + `
`, t = t.substring(h.length + 1), c = true), !c) {
          let y = this.rules.other.nextBulletRegex(b), k = this.rules.other.hrRegex(b), D = this.rules.other.fencesBeginRegex(b), U = this.rules.other.headingBeginRegex(b), j = this.rules.other.htmlBeginRegex(b), M = this.rules.other.blockquoteBeginRegex(b);
          for (; t; ) {
            let q = t.split(`
`, 1)[0], F;
            if (h = q, this.options.pedantic ? (h = h.replace(this.rules.other.listReplaceNesting, "  "), F = h) : F = h.replace(this.rules.other.tabCharGlobal, "    "), D.test(h) || U.test(h) || j.test(h) || M.test(h) || y.test(h) || k.test(h)) break;
            if (F.search(this.rules.other.nonSpaceChar) >= b || !h.trim()) p += `
` + F.slice(b);
            else {
              if (x || m.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || D.test(m) || U.test(m) || k.test(m)) break;
              p += `
` + h;
            }
            x = !h.trim(), f += q + `
`, t = t.substring(q.length + 1), m = F.slice(b);
          }
        }
        a.loose || (i ? a.loose = true : this.rules.other.doubleBlankLine.test(f) && (i = true)), a.items.push({ type: "list_item", raw: f, task: !!this.options.gfm && this.rules.other.listIsTask.test(p), loose: false, text: p, tokens: [] }), a.raw += f;
      }
      let l = a.items.at(-1);
      if (l) l.raw = l.raw.trimEnd(), l.text = l.text.trimEnd();
      else return;
      a.raw = a.raw.trimEnd();
      for (let c of a.items) {
        if (this.lexer.state.top = false, c.tokens = this.lexer.blockTokens(c.text, []), c.task) {
          if (c.text = c.text.replace(this.rules.other.listReplaceTask, ""), ((_a10 = c.tokens[0]) == null ? void 0 : _a10.type) === "text" || ((_b4 = c.tokens[0]) == null ? void 0 : _b4.type) === "paragraph") {
            c.tokens[0].raw = c.tokens[0].raw.replace(this.rules.other.listReplaceTask, ""), c.tokens[0].text = c.tokens[0].text.replace(this.rules.other.listReplaceTask, "");
            for (let p = this.lexer.inlineQueue.length - 1; p >= 0; p--) if (this.rules.other.listIsTask.test(this.lexer.inlineQueue[p].src)) {
              this.lexer.inlineQueue[p].src = this.lexer.inlineQueue[p].src.replace(this.rules.other.listReplaceTask, "");
              break;
            }
          }
          let f = this.rules.other.listTaskCheckbox.exec(c.raw);
          if (f) {
            let p = { type: "checkbox", raw: f[0] + " ", checked: f[0] !== "[ ]" };
            c.checked = p.checked, a.loose ? c.tokens[0] && ["paragraph", "text"].includes(c.tokens[0].type) && "tokens" in c.tokens[0] && c.tokens[0].tokens ? (c.tokens[0].raw = p.raw + c.tokens[0].raw, c.tokens[0].text = p.raw + c.tokens[0].text, c.tokens[0].tokens.unshift(p)) : c.tokens.unshift({ type: "paragraph", raw: p.raw, text: p.raw, tokens: [p] }) : c.tokens.unshift(p);
          }
        }
        if (!a.loose) {
          let f = c.tokens.filter((m) => m.type === "space"), p = f.length > 0 && f.some((m) => this.rules.other.anyLine.test(m.raw));
          a.loose = p;
        }
      }
      if (a.loose) for (let c of a.items) {
        c.loose = true;
        for (let f of c.tokens) f.type === "text" && (f.type = "paragraph");
      }
      return a;
    }
  }
  html(t) {
    let e = this.rules.block.html.exec(t);
    if (e) return { type: "html", block: true, raw: e[0], pre: e[1] === "pre" || e[1] === "script" || e[1] === "style", text: e[0] };
  }
  def(t) {
    let e = this.rules.block.def.exec(t);
    if (e) {
      let r = e[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "), n = e[2] ? e[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", a = e[3] ? e[3].substring(1, e[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : e[3];
      return { type: "def", tag: r, raw: e[0], href: n, title: a };
    }
  }
  table(t) {
    var _a10;
    let e = this.rules.block.table.exec(t);
    if (!e || !this.rules.other.tableDelimiter.test(e[2])) return;
    let r = Ku(e[1]), n = e[2].replace(this.rules.other.tableAlignChars, "").split("|"), a = ((_a10 = e[3]) == null ? void 0 : _a10.trim()) ? e[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], o = { type: "table", raw: e[0], header: [], align: [], rows: [] };
    if (r.length === n.length) {
      for (let i of n) this.rules.other.tableAlignRight.test(i) ? o.align.push("right") : this.rules.other.tableAlignCenter.test(i) ? o.align.push("center") : this.rules.other.tableAlignLeft.test(i) ? o.align.push("left") : o.align.push(null);
      for (let i = 0; i < r.length; i++) o.header.push({ text: r[i], tokens: this.lexer.inline(r[i]), header: true, align: o.align[i] });
      for (let i of a) o.rows.push(Ku(i, o.header.length).map((l, c) => ({ text: l, tokens: this.lexer.inline(l), header: false, align: o.align[c] })));
      return o;
    }
  }
  lheading(t) {
    let e = this.rules.block.lheading.exec(t);
    if (e) return { type: "heading", raw: e[0], depth: e[2].charAt(0) === "=" ? 1 : 2, text: e[1], tokens: this.lexer.inline(e[1]) };
  }
  paragraph(t) {
    let e = this.rules.block.paragraph.exec(t);
    if (e) {
      let r = e[1].charAt(e[1].length - 1) === `
` ? e[1].slice(0, -1) : e[1];
      return { type: "paragraph", raw: e[0], text: r, tokens: this.lexer.inline(r) };
    }
  }
  text(t) {
    let e = this.rules.block.text.exec(t);
    if (e) return { type: "text", raw: e[0], text: e[0], tokens: this.lexer.inline(e[0]) };
  }
  escape(t) {
    let e = this.rules.inline.escape.exec(t);
    if (e) return { type: "escape", raw: e[0], text: e[1] };
  }
  tag(t) {
    let e = this.rules.inline.tag.exec(t);
    if (e) return !this.lexer.state.inLink && this.rules.other.startATag.test(e[0]) ? this.lexer.state.inLink = true : this.lexer.state.inLink && this.rules.other.endATag.test(e[0]) && (this.lexer.state.inLink = false), !this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(e[0]) ? this.lexer.state.inRawBlock = true : this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(e[0]) && (this.lexer.state.inRawBlock = false), { type: "html", raw: e[0], inLink: this.lexer.state.inLink, inRawBlock: this.lexer.state.inRawBlock, block: false, text: e[0] };
  }
  link(t) {
    let e = this.rules.inline.link.exec(t);
    if (e) {
      let r = e[2].trim();
      if (!this.options.pedantic && this.rules.other.startAngleBracket.test(r)) {
        if (!this.rules.other.endAngleBracket.test(r)) return;
        let o = Is(r.slice(0, -1), "\\");
        if ((r.length - o.length) % 2 === 0) return;
      } else {
        let o = mk(e[2], "()");
        if (o === -2) return;
        if (o > -1) {
          let i = (e[0].indexOf("!") === 0 ? 5 : 4) + e[1].length + o;
          e[2] = e[2].substring(0, o), e[0] = e[0].substring(0, i).trim(), e[3] = "";
        }
      }
      let n = e[2], a = "";
      if (this.options.pedantic) {
        let o = this.rules.other.pedanticHrefTitle.exec(n);
        o && (n = o[1], a = o[3]);
      } else a = e[3] ? e[3].slice(1, -1) : "";
      return n = n.trim(), this.rules.other.startAngleBracket.test(n) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(r) ? n = n.slice(1) : n = n.slice(1, -1)), Xu(e, { href: n && n.replace(this.rules.inline.anyPunctuation, "$1"), title: a && a.replace(this.rules.inline.anyPunctuation, "$1") }, e[0], this.lexer, this.rules);
    }
  }
  reflink(t, e) {
    let r;
    if ((r = this.rules.inline.reflink.exec(t)) || (r = this.rules.inline.nolink.exec(t))) {
      let n = (r[2] || r[1]).replace(this.rules.other.multipleSpaceGlobal, " "), a = e[n.toLowerCase()];
      if (!a) {
        let o = r[0].charAt(0);
        return { type: "text", raw: o, text: o };
      }
      return Xu(r, a, r[0], this.lexer, this.rules);
    }
  }
  emStrong(t, e, r = "") {
    let n = this.rules.inline.emStrongLDelim.exec(t);
    if (!(!n || n[3] && r.match(this.rules.other.unicodeAlphaNumeric)) && (!(n[1] || n[2]) || !r || this.rules.inline.punctuation.exec(r))) {
      let a = [...n[0]].length - 1, o, i, l = a, c = 0, f = n[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (f.lastIndex = 0, e = e.slice(-1 * t.length + a); (n = f.exec(e)) != null; ) {
        if (o = n[1] || n[2] || n[3] || n[4] || n[5] || n[6], !o) continue;
        if (i = [...o].length, n[3] || n[4]) {
          l += i;
          continue;
        } else if ((n[5] || n[6]) && a % 3 && !((a + i) % 3)) {
          c += i;
          continue;
        }
        if (l -= i, l > 0) continue;
        i = Math.min(i, i + l + c);
        let p = [...n[0]][0].length, m = t.slice(0, a + n.index + p + i);
        if (Math.min(a, i) % 2) {
          let x = m.slice(1, -1);
          return { type: "em", raw: m, text: x, tokens: this.lexer.inlineTokens(x) };
        }
        let h = m.slice(2, -2);
        return { type: "strong", raw: m, text: h, tokens: this.lexer.inlineTokens(h) };
      }
    }
  }
  codespan(t) {
    let e = this.rules.inline.code.exec(t);
    if (e) {
      let r = e[2].replace(this.rules.other.newLineCharGlobal, " "), n = this.rules.other.nonSpaceChar.test(r), a = this.rules.other.startingSpaceChar.test(r) && this.rules.other.endingSpaceChar.test(r);
      return n && a && (r = r.substring(1, r.length - 1)), { type: "codespan", raw: e[0], text: r };
    }
  }
  br(t) {
    let e = this.rules.inline.br.exec(t);
    if (e) return { type: "br", raw: e[0] };
  }
  del(t, e, r = "") {
    let n = this.rules.inline.delLDelim.exec(t);
    if (n && (!n[1] || !r || this.rules.inline.punctuation.exec(r))) {
      let a = [...n[0]].length - 1, o, i, l = a, c = this.rules.inline.delRDelim;
      for (c.lastIndex = 0, e = e.slice(-1 * t.length + a); (n = c.exec(e)) != null; ) {
        if (o = n[1] || n[2] || n[3] || n[4] || n[5] || n[6], !o || (i = [...o].length, i !== a)) continue;
        if (n[3] || n[4]) {
          l += i;
          continue;
        }
        if (l -= i, l > 0) continue;
        i = Math.min(i, i + l);
        let f = [...n[0]][0].length, p = t.slice(0, a + n.index + f + i), m = p.slice(a, -a);
        return { type: "del", raw: p, text: m, tokens: this.lexer.inlineTokens(m) };
      }
    }
  }
  autolink(t) {
    let e = this.rules.inline.autolink.exec(t);
    if (e) {
      let r, n;
      return e[2] === "@" ? (r = e[1], n = "mailto:" + r) : (r = e[1], n = r), { type: "link", raw: e[0], text: r, href: n, tokens: [{ type: "text", raw: r, text: r }] };
    }
  }
  url(t) {
    var _a10;
    let e;
    if (e = this.rules.inline.url.exec(t)) {
      let r, n;
      if (e[2] === "@") r = e[0], n = "mailto:" + r;
      else {
        let a;
        do
          a = e[0], e[0] = ((_a10 = this.rules.inline._backpedal.exec(e[0])) == null ? void 0 : _a10[0]) ?? "";
        while (a !== e[0]);
        r = e[0], e[1] === "www." ? n = "http://" + e[0] : n = e[0];
      }
      return { type: "link", raw: e[0], text: r, href: n, tokens: [{ type: "text", raw: r, text: r }] };
    }
  }
  inlineText(t) {
    let e = this.rules.inline.text.exec(t);
    if (e) {
      let r = this.lexer.state.inRawBlock;
      return { type: "text", raw: e[0], text: e[0], escaped: r };
    }
  }
}, gn = class Bl {
  constructor(e) {
    __publicField(this, "tokens");
    __publicField(this, "options");
    __publicField(this, "state");
    __publicField(this, "inlineQueue");
    __publicField(this, "tokenizer");
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || Ya, this.options.tokenizer = this.options.tokenizer || new fi(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: false, inRawBlock: false, top: true };
    let r = { other: Or, block: Mo.normal, inline: Cs.normal };
    this.options.pedantic ? (r.block = Mo.pedantic, r.inline = Cs.pedantic) : this.options.gfm && (r.block = Mo.gfm, this.options.breaks ? r.inline = Cs.breaks : r.inline = Cs.gfm), this.tokenizer.rules = r;
  }
  static get rules() {
    return { block: Mo, inline: Cs };
  }
  static lex(e, r) {
    return new Bl(r).lex(e);
  }
  static lexInline(e, r) {
    return new Bl(r).inlineTokens(e);
  }
  lex(e) {
    e = e.replace(Or.carriageReturn, `
`), this.blockTokens(e, this.tokens);
    for (let r = 0; r < this.inlineQueue.length; r++) {
      let n = this.inlineQueue[r];
      this.inlineTokens(n.src, n.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(e, r = [], n = false) {
    var _a10, _b4, _c6;
    for (this.options.pedantic && (e = e.replace(Or.tabCharGlobal, "    ").replace(Or.spaceLine, "")); e; ) {
      let a;
      if ((_b4 = (_a10 = this.options.extensions) == null ? void 0 : _a10.block) == null ? void 0 : _b4.some((i) => (a = i.call({ lexer: this }, e, r)) ? (e = e.substring(a.raw.length), r.push(a), true) : false)) continue;
      if (a = this.tokenizer.space(e)) {
        e = e.substring(a.raw.length);
        let i = r.at(-1);
        a.raw.length === 1 && i !== void 0 ? i.raw += `
` : r.push(a);
        continue;
      }
      if (a = this.tokenizer.code(e)) {
        e = e.substring(a.raw.length);
        let i = r.at(-1);
        (i == null ? void 0 : i.type) === "paragraph" || (i == null ? void 0 : i.type) === "text" ? (i.raw += (i.raw.endsWith(`
`) ? "" : `
`) + a.raw, i.text += `
` + a.text, this.inlineQueue.at(-1).src = i.text) : r.push(a);
        continue;
      }
      if (a = this.tokenizer.fences(e)) {
        e = e.substring(a.raw.length), r.push(a);
        continue;
      }
      if (a = this.tokenizer.heading(e)) {
        e = e.substring(a.raw.length), r.push(a);
        continue;
      }
      if (a = this.tokenizer.hr(e)) {
        e = e.substring(a.raw.length), r.push(a);
        continue;
      }
      if (a = this.tokenizer.blockquote(e)) {
        e = e.substring(a.raw.length), r.push(a);
        continue;
      }
      if (a = this.tokenizer.list(e)) {
        e = e.substring(a.raw.length), r.push(a);
        continue;
      }
      if (a = this.tokenizer.html(e)) {
        e = e.substring(a.raw.length), r.push(a);
        continue;
      }
      if (a = this.tokenizer.def(e)) {
        e = e.substring(a.raw.length);
        let i = r.at(-1);
        (i == null ? void 0 : i.type) === "paragraph" || (i == null ? void 0 : i.type) === "text" ? (i.raw += (i.raw.endsWith(`
`) ? "" : `
`) + a.raw, i.text += `
` + a.raw, this.inlineQueue.at(-1).src = i.text) : this.tokens.links[a.tag] || (this.tokens.links[a.tag] = { href: a.href, title: a.title }, r.push(a));
        continue;
      }
      if (a = this.tokenizer.table(e)) {
        e = e.substring(a.raw.length), r.push(a);
        continue;
      }
      if (a = this.tokenizer.lheading(e)) {
        e = e.substring(a.raw.length), r.push(a);
        continue;
      }
      let o = e;
      if ((_c6 = this.options.extensions) == null ? void 0 : _c6.startBlock) {
        let i = 1 / 0, l = e.slice(1), c;
        this.options.extensions.startBlock.forEach((f) => {
          c = f.call({ lexer: this }, l), typeof c == "number" && c >= 0 && (i = Math.min(i, c));
        }), i < 1 / 0 && i >= 0 && (o = e.substring(0, i + 1));
      }
      if (this.state.top && (a = this.tokenizer.paragraph(o))) {
        let i = r.at(-1);
        n && (i == null ? void 0 : i.type) === "paragraph" ? (i.raw += (i.raw.endsWith(`
`) ? "" : `
`) + a.raw, i.text += `
` + a.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = i.text) : r.push(a), n = o.length !== e.length, e = e.substring(a.raw.length);
        continue;
      }
      if (a = this.tokenizer.text(e)) {
        e = e.substring(a.raw.length);
        let i = r.at(-1);
        (i == null ? void 0 : i.type) === "text" ? (i.raw += (i.raw.endsWith(`
`) ? "" : `
`) + a.raw, i.text += `
` + a.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = i.text) : r.push(a);
        continue;
      }
      if (e) {
        let i = "Infinite loop on byte: " + e.charCodeAt(0);
        if (this.options.silent) {
          console.error(i);
          break;
        } else throw new Error(i);
      }
    }
    return this.state.top = true, r;
  }
  inline(e, r = []) {
    return this.inlineQueue.push({ src: e, tokens: r }), r;
  }
  inlineTokens(e, r = []) {
    var _a10, _b4, _c6, _d4, _e40;
    let n = e, a = null;
    if (this.tokens.links) {
      let c = Object.keys(this.tokens.links);
      if (c.length > 0) for (; (a = this.tokenizer.rules.inline.reflinkSearch.exec(n)) != null; ) c.includes(a[0].slice(a[0].lastIndexOf("[") + 1, -1)) && (n = n.slice(0, a.index) + "[" + "a".repeat(a[0].length - 2) + "]" + n.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
    }
    for (; (a = this.tokenizer.rules.inline.anyPunctuation.exec(n)) != null; ) n = n.slice(0, a.index) + "++" + n.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
    let o;
    for (; (a = this.tokenizer.rules.inline.blockSkip.exec(n)) != null; ) o = a[2] ? a[2].length : 0, n = n.slice(0, a.index + o) + "[" + "a".repeat(a[0].length - o - 2) + "]" + n.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    n = ((_b4 = (_a10 = this.options.hooks) == null ? void 0 : _a10.emStrongMask) == null ? void 0 : _b4.call({ lexer: this }, n)) ?? n;
    let i = false, l = "";
    for (; e; ) {
      i || (l = ""), i = false;
      let c;
      if ((_d4 = (_c6 = this.options.extensions) == null ? void 0 : _c6.inline) == null ? void 0 : _d4.some((p) => (c = p.call({ lexer: this }, e, r)) ? (e = e.substring(c.raw.length), r.push(c), true) : false)) continue;
      if (c = this.tokenizer.escape(e)) {
        e = e.substring(c.raw.length), r.push(c);
        continue;
      }
      if (c = this.tokenizer.tag(e)) {
        e = e.substring(c.raw.length), r.push(c);
        continue;
      }
      if (c = this.tokenizer.link(e)) {
        e = e.substring(c.raw.length), r.push(c);
        continue;
      }
      if (c = this.tokenizer.reflink(e, this.tokens.links)) {
        e = e.substring(c.raw.length);
        let p = r.at(-1);
        c.type === "text" && (p == null ? void 0 : p.type) === "text" ? (p.raw += c.raw, p.text += c.text) : r.push(c);
        continue;
      }
      if (c = this.tokenizer.emStrong(e, n, l)) {
        e = e.substring(c.raw.length), r.push(c);
        continue;
      }
      if (c = this.tokenizer.codespan(e)) {
        e = e.substring(c.raw.length), r.push(c);
        continue;
      }
      if (c = this.tokenizer.br(e)) {
        e = e.substring(c.raw.length), r.push(c);
        continue;
      }
      if (c = this.tokenizer.del(e, n, l)) {
        e = e.substring(c.raw.length), r.push(c);
        continue;
      }
      if (c = this.tokenizer.autolink(e)) {
        e = e.substring(c.raw.length), r.push(c);
        continue;
      }
      if (!this.state.inLink && (c = this.tokenizer.url(e))) {
        e = e.substring(c.raw.length), r.push(c);
        continue;
      }
      let f = e;
      if ((_e40 = this.options.extensions) == null ? void 0 : _e40.startInline) {
        let p = 1 / 0, m = e.slice(1), h;
        this.options.extensions.startInline.forEach((x) => {
          h = x.call({ lexer: this }, m), typeof h == "number" && h >= 0 && (p = Math.min(p, h));
        }), p < 1 / 0 && p >= 0 && (f = e.substring(0, p + 1));
      }
      if (c = this.tokenizer.inlineText(f)) {
        e = e.substring(c.raw.length), c.raw.slice(-1) !== "_" && (l = c.raw.slice(-1)), i = true;
        let p = r.at(-1);
        (p == null ? void 0 : p.type) === "text" ? (p.raw += c.raw, p.text += c.text) : r.push(c);
        continue;
      }
      if (e) {
        let p = "Infinite loop on byte: " + e.charCodeAt(0);
        if (this.options.silent) {
          console.error(p);
          break;
        } else throw new Error(p);
      }
    }
    return r;
  }
}, pi = class {
  constructor(t) {
    __publicField(this, "options");
    __publicField(this, "parser");
    this.options = t || Ya;
  }
  space(t) {
    return "";
  }
  code({ text: t, lang: e, escaped: r }) {
    var _a10;
    let n = (_a10 = (e || "").match(Or.notSpaceStart)) == null ? void 0 : _a10[0], a = t.replace(Or.endingNewline, "") + `
`;
    return n ? '<pre><code class="language-' + Tn(n) + '">' + (r ? a : Tn(a, true)) + `</code></pre>
` : "<pre><code>" + (r ? a : Tn(a, true)) + `</code></pre>
`;
  }
  blockquote({ tokens: t }) {
    return `<blockquote>
${this.parser.parse(t)}</blockquote>
`;
  }
  html({ text: t }) {
    return t;
  }
  def(t) {
    return "";
  }
  heading({ tokens: t, depth: e }) {
    return `<h${e}>${this.parser.parseInline(t)}</h${e}>
`;
  }
  hr(t) {
    return `<hr>
`;
  }
  list(t) {
    let e = t.ordered, r = t.start, n = "";
    for (let i = 0; i < t.items.length; i++) {
      let l = t.items[i];
      n += this.listitem(l);
    }
    let a = e ? "ol" : "ul", o = e && r !== 1 ? ' start="' + r + '"' : "";
    return "<" + a + o + `>
` + n + "</" + a + `>
`;
  }
  listitem(t) {
    return `<li>${this.parser.parse(t.tokens)}</li>
`;
  }
  checkbox({ checked: t }) {
    return "<input " + (t ? 'checked="" ' : "") + 'disabled="" type="checkbox"> ';
  }
  paragraph({ tokens: t }) {
    return `<p>${this.parser.parseInline(t)}</p>
`;
  }
  table(t) {
    let e = "", r = "";
    for (let a = 0; a < t.header.length; a++) r += this.tablecell(t.header[a]);
    e += this.tablerow({ text: r });
    let n = "";
    for (let a = 0; a < t.rows.length; a++) {
      let o = t.rows[a];
      r = "";
      for (let i = 0; i < o.length; i++) r += this.tablecell(o[i]);
      n += this.tablerow({ text: r });
    }
    return n && (n = `<tbody>${n}</tbody>`), `<table>
<thead>
` + e + `</thead>
` + n + `</table>
`;
  }
  tablerow({ text: t }) {
    return `<tr>
${t}</tr>
`;
  }
  tablecell(t) {
    let e = this.parser.parseInline(t.tokens), r = t.header ? "th" : "td";
    return (t.align ? `<${r} align="${t.align}">` : `<${r}>`) + e + `</${r}>
`;
  }
  strong({ tokens: t }) {
    return `<strong>${this.parser.parseInline(t)}</strong>`;
  }
  em({ tokens: t }) {
    return `<em>${this.parser.parseInline(t)}</em>`;
  }
  codespan({ text: t }) {
    return `<code>${Tn(t, true)}</code>`;
  }
  br(t) {
    return "<br>";
  }
  del({ tokens: t }) {
    return `<del>${this.parser.parseInline(t)}</del>`;
  }
  link({ href: t, title: e, tokens: r }) {
    let n = this.parser.parseInline(r), a = Yu(t);
    if (a === null) return n;
    t = a;
    let o = '<a href="' + t + '"';
    return e && (o += ' title="' + Tn(e) + '"'), o += ">" + n + "</a>", o;
  }
  image({ href: t, title: e, text: r, tokens: n }) {
    n && (r = this.parser.parseInline(n, this.parser.textRenderer));
    let a = Yu(t);
    if (a === null) return Tn(r);
    t = a;
    let o = `<img src="${t}" alt="${Tn(r)}"`;
    return e && (o += ` title="${Tn(e)}"`), o += ">", o;
  }
  text(t) {
    return "tokens" in t && t.tokens ? this.parser.parseInline(t.tokens) : "escaped" in t && t.escaped ? t.text : Tn(t.text);
  }
}, Vd = class {
  strong({ text: t }) {
    return t;
  }
  em({ text: t }) {
    return t;
  }
  codespan({ text: t }) {
    return t;
  }
  del({ text: t }) {
    return t;
  }
  html({ text: t }) {
    return t;
  }
  text({ text: t }) {
    return t;
  }
  link({ text: t }) {
    return "" + t;
  }
  image({ text: t }) {
    return "" + t;
  }
  br() {
    return "";
  }
  checkbox({ raw: t }) {
    return t;
  }
}, mn = class Fl {
  constructor(e) {
    __publicField(this, "options");
    __publicField(this, "renderer");
    __publicField(this, "textRenderer");
    this.options = e || Ya, this.options.renderer = this.options.renderer || new pi(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new Vd();
  }
  static parse(e, r) {
    return new Fl(r).parse(e);
  }
  static parseInline(e, r) {
    return new Fl(r).parseInline(e);
  }
  parse(e) {
    var _a10, _b4;
    let r = "";
    for (let n = 0; n < e.length; n++) {
      let a = e[n];
      if ((_b4 = (_a10 = this.options.extensions) == null ? void 0 : _a10.renderers) == null ? void 0 : _b4[a.type]) {
        let i = a, l = this.options.extensions.renderers[i.type].call({ parser: this }, i);
        if (l !== false || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "def", "paragraph", "text"].includes(i.type)) {
          r += l || "";
          continue;
        }
      }
      let o = a;
      switch (o.type) {
        case "space": {
          r += this.renderer.space(o);
          break;
        }
        case "hr": {
          r += this.renderer.hr(o);
          break;
        }
        case "heading": {
          r += this.renderer.heading(o);
          break;
        }
        case "code": {
          r += this.renderer.code(o);
          break;
        }
        case "table": {
          r += this.renderer.table(o);
          break;
        }
        case "blockquote": {
          r += this.renderer.blockquote(o);
          break;
        }
        case "list": {
          r += this.renderer.list(o);
          break;
        }
        case "checkbox": {
          r += this.renderer.checkbox(o);
          break;
        }
        case "html": {
          r += this.renderer.html(o);
          break;
        }
        case "def": {
          r += this.renderer.def(o);
          break;
        }
        case "paragraph": {
          r += this.renderer.paragraph(o);
          break;
        }
        case "text": {
          r += this.renderer.text(o);
          break;
        }
        default: {
          let i = 'Token with "' + o.type + '" type was not found.';
          if (this.options.silent) return console.error(i), "";
          throw new Error(i);
        }
      }
    }
    return r;
  }
  parseInline(e, r = this.renderer) {
    var _a10, _b4;
    let n = "";
    for (let a = 0; a < e.length; a++) {
      let o = e[a];
      if ((_b4 = (_a10 = this.options.extensions) == null ? void 0 : _a10.renderers) == null ? void 0 : _b4[o.type]) {
        let l = this.options.extensions.renderers[o.type].call({ parser: this }, o);
        if (l !== false || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(o.type)) {
          n += l || "";
          continue;
        }
      }
      let i = o;
      switch (i.type) {
        case "escape": {
          n += r.text(i);
          break;
        }
        case "html": {
          n += r.html(i);
          break;
        }
        case "link": {
          n += r.link(i);
          break;
        }
        case "image": {
          n += r.image(i);
          break;
        }
        case "checkbox": {
          n += r.checkbox(i);
          break;
        }
        case "strong": {
          n += r.strong(i);
          break;
        }
        case "em": {
          n += r.em(i);
          break;
        }
        case "codespan": {
          n += r.codespan(i);
          break;
        }
        case "br": {
          n += r.br(i);
          break;
        }
        case "del": {
          n += r.del(i);
          break;
        }
        case "text": {
          n += r.text(i);
          break;
        }
        default: {
          let l = 'Token with "' + i.type + '" type was not found.';
          if (this.options.silent) return console.error(l), "";
          throw new Error(l);
        }
      }
    }
    return n;
  }
}, Us = (_d3 = class {
  constructor(t) {
    __publicField(this, "options");
    __publicField(this, "block");
    this.options = t || Ya;
  }
  preprocess(t) {
    return t;
  }
  postprocess(t) {
    return t;
  }
  processAllTokens(t) {
    return t;
  }
  emStrongMask(t) {
    return t;
  }
  provideLexer() {
    return this.block ? gn.lex : gn.lexInline;
  }
  provideParser() {
    return this.block ? mn.parse : mn.parseInline;
  }
}, __publicField(_d3, "passThroughHooks", /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens", "emStrongMask"])), __publicField(_d3, "passThroughHooksRespectAsync", /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens"])), _d3), bk = class {
  constructor(...t) {
    __publicField(this, "defaults", Dd());
    __publicField(this, "options", this.setOptions);
    __publicField(this, "parse", this.parseMarkdown(true));
    __publicField(this, "parseInline", this.parseMarkdown(false));
    __publicField(this, "Parser", mn);
    __publicField(this, "Renderer", pi);
    __publicField(this, "TextRenderer", Vd);
    __publicField(this, "Lexer", gn);
    __publicField(this, "Tokenizer", fi);
    __publicField(this, "Hooks", Us);
    this.use(...t);
  }
  walkTokens(t, e) {
    var _a10, _b4;
    let r = [];
    for (let n of t) switch (r = r.concat(e.call(this, n)), n.type) {
      case "table": {
        let a = n;
        for (let o of a.header) r = r.concat(this.walkTokens(o.tokens, e));
        for (let o of a.rows) for (let i of o) r = r.concat(this.walkTokens(i.tokens, e));
        break;
      }
      case "list": {
        let a = n;
        r = r.concat(this.walkTokens(a.items, e));
        break;
      }
      default: {
        let a = n;
        ((_b4 = (_a10 = this.defaults.extensions) == null ? void 0 : _a10.childTokens) == null ? void 0 : _b4[a.type]) ? this.defaults.extensions.childTokens[a.type].forEach((o) => {
          let i = a[o].flat(1 / 0);
          r = r.concat(this.walkTokens(i, e));
        }) : a.tokens && (r = r.concat(this.walkTokens(a.tokens, e)));
      }
    }
    return r;
  }
  use(...t) {
    let e = this.defaults.extensions || { renderers: {}, childTokens: {} };
    return t.forEach((r) => {
      let n = { ...r };
      if (n.async = this.defaults.async || n.async || false, r.extensions && (r.extensions.forEach((a) => {
        if (!a.name) throw new Error("extension name required");
        if ("renderer" in a) {
          let o = e.renderers[a.name];
          o ? e.renderers[a.name] = function(...i) {
            let l = a.renderer.apply(this, i);
            return l === false && (l = o.apply(this, i)), l;
          } : e.renderers[a.name] = a.renderer;
        }
        if ("tokenizer" in a) {
          if (!a.level || a.level !== "block" && a.level !== "inline") throw new Error("extension level must be 'block' or 'inline'");
          let o = e[a.level];
          o ? o.unshift(a.tokenizer) : e[a.level] = [a.tokenizer], a.start && (a.level === "block" ? e.startBlock ? e.startBlock.push(a.start) : e.startBlock = [a.start] : a.level === "inline" && (e.startInline ? e.startInline.push(a.start) : e.startInline = [a.start]));
        }
        "childTokens" in a && a.childTokens && (e.childTokens[a.name] = a.childTokens);
      }), n.extensions = e), r.renderer) {
        let a = this.defaults.renderer || new pi(this.defaults);
        for (let o in r.renderer) {
          if (!(o in a)) throw new Error(`renderer '${o}' does not exist`);
          if (["options", "parser"].includes(o)) continue;
          let i = o, l = r.renderer[i], c = a[i];
          a[i] = (...f) => {
            let p = l.apply(a, f);
            return p === false && (p = c.apply(a, f)), p || "";
          };
        }
        n.renderer = a;
      }
      if (r.tokenizer) {
        let a = this.defaults.tokenizer || new fi(this.defaults);
        for (let o in r.tokenizer) {
          if (!(o in a)) throw new Error(`tokenizer '${o}' does not exist`);
          if (["options", "rules", "lexer"].includes(o)) continue;
          let i = o, l = r.tokenizer[i], c = a[i];
          a[i] = (...f) => {
            let p = l.apply(a, f);
            return p === false && (p = c.apply(a, f)), p;
          };
        }
        n.tokenizer = a;
      }
      if (r.hooks) {
        let a = this.defaults.hooks || new Us();
        for (let o in r.hooks) {
          if (!(o in a)) throw new Error(`hook '${o}' does not exist`);
          if (["options", "block"].includes(o)) continue;
          let i = o, l = r.hooks[i], c = a[i];
          Us.passThroughHooks.has(o) ? a[i] = (f) => {
            if (this.defaults.async && Us.passThroughHooksRespectAsync.has(o)) return (async () => {
              let m = await l.call(a, f);
              return c.call(a, m);
            })();
            let p = l.call(a, f);
            return c.call(a, p);
          } : a[i] = (...f) => {
            if (this.defaults.async) return (async () => {
              let m = await l.apply(a, f);
              return m === false && (m = await c.apply(a, f)), m;
            })();
            let p = l.apply(a, f);
            return p === false && (p = c.apply(a, f)), p;
          };
        }
        n.hooks = a;
      }
      if (r.walkTokens) {
        let a = this.defaults.walkTokens, o = r.walkTokens;
        n.walkTokens = function(i) {
          let l = [];
          return l.push(o.call(this, i)), a && (l = l.concat(a.call(this, i))), l;
        };
      }
      this.defaults = { ...this.defaults, ...n };
    }), this;
  }
  setOptions(t) {
    return this.defaults = { ...this.defaults, ...t }, this;
  }
  lexer(t, e) {
    return gn.lex(t, e ?? this.defaults);
  }
  parser(t, e) {
    return mn.parse(t, e ?? this.defaults);
  }
  parseMarkdown(t) {
    return (e, r) => {
      let n = { ...r }, a = { ...this.defaults, ...n }, o = this.onError(!!a.silent, !!a.async);
      if (this.defaults.async === true && n.async === false) return o(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof e > "u" || e === null) return o(new Error("marked(): input parameter is undefined or null"));
      if (typeof e != "string") return o(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(e) + ", string expected"));
      if (a.hooks && (a.hooks.options = a, a.hooks.block = t), a.async) return (async () => {
        let i = a.hooks ? await a.hooks.preprocess(e) : e, l = await (a.hooks ? await a.hooks.provideLexer() : t ? gn.lex : gn.lexInline)(i, a), c = a.hooks ? await a.hooks.processAllTokens(l) : l;
        a.walkTokens && await Promise.all(this.walkTokens(c, a.walkTokens));
        let f = await (a.hooks ? await a.hooks.provideParser() : t ? mn.parse : mn.parseInline)(c, a);
        return a.hooks ? await a.hooks.postprocess(f) : f;
      })().catch(o);
      try {
        a.hooks && (e = a.hooks.preprocess(e));
        let i = (a.hooks ? a.hooks.provideLexer() : t ? gn.lex : gn.lexInline)(e, a);
        a.hooks && (i = a.hooks.processAllTokens(i)), a.walkTokens && this.walkTokens(i, a.walkTokens);
        let l = (a.hooks ? a.hooks.provideParser() : t ? mn.parse : mn.parseInline)(i, a);
        return a.hooks && (l = a.hooks.postprocess(l)), l;
      } catch (i) {
        return o(i);
      }
    };
  }
  onError(t, e) {
    return (r) => {
      if (r.message += `
Please report this to https://github.com/markedjs/marked.`, t) {
        let n = "<p>An error occurred:</p><pre>" + Tn(r.message + "", true) + "</pre>";
        return e ? Promise.resolve(n) : n;
      }
      if (e) return Promise.reject(r);
      throw r;
    };
  }
}, Fa = new bk();
function Mt(t, e) {
  return Fa.parse(t, e);
}
Mt.options = Mt.setOptions = function(t) {
  return Fa.setOptions(t), Mt.defaults = Fa.defaults, sm(Mt.defaults), Mt;
};
Mt.getDefaults = Dd;
Mt.defaults = Ya;
Mt.use = function(...t) {
  return Fa.use(...t), Mt.defaults = Fa.defaults, sm(Mt.defaults), Mt;
};
Mt.walkTokens = function(t, e) {
  return Fa.walkTokens(t, e);
};
Mt.parseInline = Fa.parseInline;
Mt.Parser = mn;
Mt.parser = mn.parse;
Mt.Renderer = pi;
Mt.TextRenderer = Vd;
Mt.Lexer = gn;
Mt.lexer = gn.lex;
Mt.Tokenizer = fi;
Mt.Hooks = Us;
Mt.parse = Mt;
Mt.options;
Mt.setOptions;
Mt.use;
Mt.walkTokens;
Mt.parseInline;
mn.parse;
gn.lex;
/*! @license DOMPurify 3.3.3 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.3.3/LICENSE */
const { entries: hm, setPrototypeOf: Zu, isFrozen: xk, getPrototypeOf: yk, getOwnPropertyDescriptor: wk } = Object;
let { freeze: Dr, seal: cn, create: Fo } = Object, { apply: Ul, construct: Gl } = typeof Reflect < "u" && Reflect;
Dr || (Dr = function(e) {
  return e;
});
cn || (cn = function(e) {
  return e;
});
Ul || (Ul = function(e, r) {
  for (var n = arguments.length, a = new Array(n > 2 ? n - 2 : 0), o = 2; o < n; o++) a[o - 2] = arguments[o];
  return e.apply(r, a);
});
Gl || (Gl = function(e) {
  for (var r = arguments.length, n = new Array(r > 1 ? r - 1 : 0), a = 1; a < r; a++) n[a - 1] = arguments[a];
  return new e(...n);
});
const zo = Lr(Array.prototype.forEach), kk = Lr(Array.prototype.lastIndexOf), Ju = Lr(Array.prototype.pop), Ps = Lr(Array.prototype.push), Sk = Lr(Array.prototype.splice), Uo = Lr(String.prototype.toLowerCase), el = Lr(String.prototype.toString), tl = Lr(String.prototype.match), $s = Lr(String.prototype.replace), Tk = Lr(String.prototype.indexOf), Ak = Lr(String.prototype.trim), Yr = Lr(Object.prototype.hasOwnProperty), zr = Lr(RegExp.prototype.test), Ns = Ek(TypeError);
function Lr(t) {
  return function(e) {
    e instanceof RegExp && (e.lastIndex = 0);
    for (var r = arguments.length, n = new Array(r > 1 ? r - 1 : 0), a = 1; a < r; a++) n[a - 1] = arguments[a];
    return Ul(t, e, n);
  };
}
function Ek(t) {
  return function() {
    for (var e = arguments.length, r = new Array(e), n = 0; n < e; n++) r[n] = arguments[n];
    return Gl(t, r);
  };
}
function yt(t, e) {
  let r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : Uo;
  Zu && Zu(t, null);
  let n = e.length;
  for (; n--; ) {
    let a = e[n];
    if (typeof a == "string") {
      const o = r(a);
      o !== a && (xk(e) || (e[n] = o), a = o);
    }
    t[a] = true;
  }
  return t;
}
function Ck(t) {
  for (let e = 0; e < t.length; e++) Yr(t, e) || (t[e] = null);
  return t;
}
function An(t) {
  const e = Fo(null);
  for (const [r, n] of hm(t)) Yr(t, r) && (Array.isArray(n) ? e[r] = Ck(n) : n && typeof n == "object" && n.constructor === Object ? e[r] = An(n) : e[r] = n);
  return e;
}
function Rs(t, e) {
  for (; t !== null; ) {
    const n = wk(t, e);
    if (n) {
      if (n.get) return Lr(n.get);
      if (typeof n.value == "function") return Lr(n.value);
    }
    t = yk(t);
  }
  function r() {
    return null;
  }
  return r;
}
const Qu = Dr(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "search", "section", "select", "shadow", "slot", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]), rl = Dr(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "enterkeyhint", "exportparts", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "inputmode", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "part", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]), nl = Dr(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]), Ik = Dr(["animate", "color-profile", "cursor", "discard", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]), al = Dr(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "mprescripts"]), Pk = Dr(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]), ef = Dr(["#text"]), tf = Dr(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "exportparts", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inert", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "part", "pattern", "placeholder", "playsinline", "popover", "popovertarget", "popovertargetaction", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "slot", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "wrap", "xmlns", "slot"]), sl = Dr(["accent-height", "accumulate", "additive", "alignment-baseline", "amplitude", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dur", "edgemode", "elevation", "end", "exponent", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "intercept", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "mask-type", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "slope", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "tablevalues", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]), rf = Dr(["accent", "accentunder", "align", "bevelled", "close", "columnsalign", "columnlines", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lspace", "lquote", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]), Oo = Dr(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]), $k = cn(/\{\{[\w\W]*|[\w\W]*\}\}/gm), Nk = cn(/<%[\w\W]*|[\w\W]*%>/gm), Rk = cn(/\$\{[\w\W]*/gm), Mk = cn(/^data-[\-\w.\u00B7-\uFFFF]+$/), zk = cn(/^aria-[\-\w]+$/), _m = cn(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i), Ok = cn(/^(?:\w+script|data):/i), Dk = cn(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g), bm = cn(/^html$/i), Lk = cn(/^[a-z][.\w]*(-[.\w]+)+$/i);
var nf = Object.freeze({ __proto__: null, ARIA_ATTR: zk, ATTR_WHITESPACE: Dk, CUSTOM_ELEMENT: Lk, DATA_ATTR: Mk, DOCTYPE_NAME: bm, ERB_EXPR: Nk, IS_ALLOWED_URI: _m, IS_SCRIPT_OR_DATA: Ok, MUSTACHE_EXPR: $k, TMPLIT_EXPR: Rk });
const Ms = { element: 1, text: 3, progressingInstruction: 7, comment: 8, document: 9 }, jk = function() {
  return typeof window > "u" ? null : window;
}, Bk = function(e, r) {
  if (typeof e != "object" || typeof e.createPolicy != "function") return null;
  let n = null;
  const a = "data-tt-policy-suffix";
  r && r.hasAttribute(a) && (n = r.getAttribute(a));
  const o = "dompurify" + (n ? "#" + n : "");
  try {
    return e.createPolicy(o, { createHTML(i) {
      return i;
    }, createScriptURL(i) {
      return i;
    } });
  } catch {
    return console.warn("TrustedTypes policy " + o + " could not be created."), null;
  }
}, af = function() {
  return { afterSanitizeAttributes: [], afterSanitizeElements: [], afterSanitizeShadowDOM: [], beforeSanitizeAttributes: [], beforeSanitizeElements: [], beforeSanitizeShadowDOM: [], uponSanitizeAttribute: [], uponSanitizeElement: [], uponSanitizeShadowNode: [] };
};
function xm() {
  let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : jk();
  const e = (He) => xm(He);
  if (e.version = "3.3.3", e.removed = [], !t || !t.document || t.document.nodeType !== Ms.document || !t.Element) return e.isSupported = false, e;
  let { document: r } = t;
  const n = r, a = n.currentScript, { DocumentFragment: o, HTMLTemplateElement: i, Node: l, Element: c, NodeFilter: f, NamedNodeMap: p = t.NamedNodeMap || t.MozNamedAttrMap, HTMLFormElement: m, DOMParser: h, trustedTypes: x } = t, b = c.prototype, y = Rs(b, "cloneNode"), k = Rs(b, "remove"), D = Rs(b, "nextSibling"), U = Rs(b, "childNodes"), j = Rs(b, "parentNode");
  if (typeof i == "function") {
    const He = r.createElement("template");
    He.content && He.content.ownerDocument && (r = He.content.ownerDocument);
  }
  let M, q = "";
  const { implementation: F, createNodeIterator: P, createDocumentFragment: C, getElementsByTagName: T } = r, { importNode: N } = n;
  let K = af();
  e.isSupported = typeof hm == "function" && typeof j == "function" && F && F.createHTMLDocument !== void 0;
  const { MUSTACHE_EXPR: W, ERB_EXPR: A, TMPLIT_EXPR: S, DATA_ATTR: w, ARIA_ATTR: R, IS_SCRIPT_OR_DATA: B, ATTR_WHITESPACE: Z, CUSTOM_ELEMENT: X } = nf;
  let { IS_ALLOWED_URI: H } = nf, te = null;
  const Y = yt({}, [...Qu, ...rl, ...nl, ...al, ...ef]);
  let $ = null;
  const O = yt({}, [...tf, ...sl, ...rf, ...Oo]);
  let G = Object.seal(Fo(null, { tagNameCheck: { writable: true, configurable: false, enumerable: true, value: null }, attributeNameCheck: { writable: true, configurable: false, enumerable: true, value: null }, allowCustomizedBuiltInElements: { writable: true, configurable: false, enumerable: true, value: false } })), J = null, se = null;
  const ie = Object.seal(Fo(null, { tagCheck: { writable: true, configurable: false, enumerable: true, value: null }, attributeCheck: { writable: true, configurable: false, enumerable: true, value: null } }));
  let oe = true, de = true, ve = false, me = true, ke = false, ye = true, we = false, le = false, ce = false, pe = false, ge = false, Te = false, he = true, ue = false;
  const Ee = "user-content-";
  let xe = true, Se = false, Fe = {}, qe = null;
  const ne = yt({}, ["annotation-xml", "audio", "colgroup", "desc", "foreignobject", "head", "iframe", "math", "mi", "mn", "mo", "ms", "mtext", "noembed", "noframes", "noscript", "plaintext", "script", "style", "svg", "template", "thead", "title", "video", "xmp"]);
  let fe = null;
  const be = yt({}, ["audio", "video", "img", "source", "image", "track"]);
  let _e40 = null;
  const $e = yt({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]), Ce = "http://www.w3.org/1998/Math/MathML", ze = "http://www.w3.org/2000/svg", Re = "http://www.w3.org/1999/xhtml";
  let je = Re, Ve = false, st = null;
  const gt = yt({}, [Ce, ze, Re], el);
  let Lt = yt({}, ["mi", "mo", "mn", "ms", "mtext"]), dt = yt({}, ["annotation-xml"]);
  const Jt = yt({}, ["title", "style", "font", "a", "script"]);
  let Wt = null;
  const Nr = ["application/xhtml+xml", "text/html"], Rr = "text/html";
  let Nt = null, Sr = null;
  const ra = r.createElement("form"), na = function(Q) {
    return Q instanceof RegExp || Q instanceof Function;
  }, ka = function() {
    let Q = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (!(Sr && Sr === Q)) {
      if ((!Q || typeof Q != "object") && (Q = {}), Q = An(Q), Wt = Nr.indexOf(Q.PARSER_MEDIA_TYPE) === -1 ? Rr : Q.PARSER_MEDIA_TYPE, Nt = Wt === "application/xhtml+xml" ? el : Uo, te = Yr(Q, "ALLOWED_TAGS") ? yt({}, Q.ALLOWED_TAGS, Nt) : Y, $ = Yr(Q, "ALLOWED_ATTR") ? yt({}, Q.ALLOWED_ATTR, Nt) : O, st = Yr(Q, "ALLOWED_NAMESPACES") ? yt({}, Q.ALLOWED_NAMESPACES, el) : gt, _e40 = Yr(Q, "ADD_URI_SAFE_ATTR") ? yt(An($e), Q.ADD_URI_SAFE_ATTR, Nt) : $e, fe = Yr(Q, "ADD_DATA_URI_TAGS") ? yt(An(be), Q.ADD_DATA_URI_TAGS, Nt) : be, qe = Yr(Q, "FORBID_CONTENTS") ? yt({}, Q.FORBID_CONTENTS, Nt) : ne, J = Yr(Q, "FORBID_TAGS") ? yt({}, Q.FORBID_TAGS, Nt) : An({}), se = Yr(Q, "FORBID_ATTR") ? yt({}, Q.FORBID_ATTR, Nt) : An({}), Fe = Yr(Q, "USE_PROFILES") ? Q.USE_PROFILES : false, oe = Q.ALLOW_ARIA_ATTR !== false, de = Q.ALLOW_DATA_ATTR !== false, ve = Q.ALLOW_UNKNOWN_PROTOCOLS || false, me = Q.ALLOW_SELF_CLOSE_IN_ATTR !== false, ke = Q.SAFE_FOR_TEMPLATES || false, ye = Q.SAFE_FOR_XML !== false, we = Q.WHOLE_DOCUMENT || false, pe = Q.RETURN_DOM || false, ge = Q.RETURN_DOM_FRAGMENT || false, Te = Q.RETURN_TRUSTED_TYPE || false, ce = Q.FORCE_BODY || false, he = Q.SANITIZE_DOM !== false, ue = Q.SANITIZE_NAMED_PROPS || false, xe = Q.KEEP_CONTENT !== false, Se = Q.IN_PLACE || false, H = Q.ALLOWED_URI_REGEXP || _m, je = Q.NAMESPACE || Re, Lt = Q.MATHML_TEXT_INTEGRATION_POINTS || Lt, dt = Q.HTML_INTEGRATION_POINTS || dt, G = Q.CUSTOM_ELEMENT_HANDLING || {}, Q.CUSTOM_ELEMENT_HANDLING && na(Q.CUSTOM_ELEMENT_HANDLING.tagNameCheck) && (G.tagNameCheck = Q.CUSTOM_ELEMENT_HANDLING.tagNameCheck), Q.CUSTOM_ELEMENT_HANDLING && na(Q.CUSTOM_ELEMENT_HANDLING.attributeNameCheck) && (G.attributeNameCheck = Q.CUSTOM_ELEMENT_HANDLING.attributeNameCheck), Q.CUSTOM_ELEMENT_HANDLING && typeof Q.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements == "boolean" && (G.allowCustomizedBuiltInElements = Q.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements), ke && (de = false), ge && (pe = true), Fe && (te = yt({}, ef), $ = Fo(null), Fe.html === true && (yt(te, Qu), yt($, tf)), Fe.svg === true && (yt(te, rl), yt($, sl), yt($, Oo)), Fe.svgFilters === true && (yt(te, nl), yt($, sl), yt($, Oo)), Fe.mathMl === true && (yt(te, al), yt($, rf), yt($, Oo))), Yr(Q, "ADD_TAGS") || (ie.tagCheck = null), Yr(Q, "ADD_ATTR") || (ie.attributeCheck = null), Q.ADD_TAGS && (typeof Q.ADD_TAGS == "function" ? ie.tagCheck = Q.ADD_TAGS : (te === Y && (te = An(te)), yt(te, Q.ADD_TAGS, Nt))), Q.ADD_ATTR && (typeof Q.ADD_ATTR == "function" ? ie.attributeCheck = Q.ADD_ATTR : ($ === O && ($ = An($)), yt($, Q.ADD_ATTR, Nt))), Q.ADD_URI_SAFE_ATTR && yt(_e40, Q.ADD_URI_SAFE_ATTR, Nt), Q.FORBID_CONTENTS && (qe === ne && (qe = An(qe)), yt(qe, Q.FORBID_CONTENTS, Nt)), Q.ADD_FORBID_CONTENTS && (qe === ne && (qe = An(qe)), yt(qe, Q.ADD_FORBID_CONTENTS, Nt)), xe && (te["#text"] = true), we && yt(te, ["html", "head", "body"]), te.table && (yt(te, ["tbody"]), delete J.tbody), Q.TRUSTED_TYPES_POLICY) {
        if (typeof Q.TRUSTED_TYPES_POLICY.createHTML != "function") throw Ns('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
        if (typeof Q.TRUSTED_TYPES_POLICY.createScriptURL != "function") throw Ns('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
        M = Q.TRUSTED_TYPES_POLICY, q = M.createHTML("");
      } else M === void 0 && (M = Bk(x, a)), M !== null && typeof q == "string" && (q = M.createHTML(""));
      Dr && Dr(Q), Sr = Q;
    }
  }, Ka = yt({}, [...rl, ...nl, ...Ik]), Xa = yt({}, [...al, ...Pk]), xt = function(Q) {
    let Ie = j(Q);
    (!Ie || !Ie.tagName) && (Ie = { namespaceURI: je, tagName: "template" });
    const Ye = Uo(Q.tagName), wt = Uo(Ie.tagName);
    return st[Q.namespaceURI] ? Q.namespaceURI === ze ? Ie.namespaceURI === Re ? Ye === "svg" : Ie.namespaceURI === Ce ? Ye === "svg" && (wt === "annotation-xml" || Lt[wt]) : !!Ka[Ye] : Q.namespaceURI === Ce ? Ie.namespaceURI === Re ? Ye === "math" : Ie.namespaceURI === ze ? Ye === "math" && dt[wt] : !!Xa[Ye] : Q.namespaceURI === Re ? Ie.namespaceURI === ze && !dt[wt] || Ie.namespaceURI === Ce && !Lt[wt] ? false : !Xa[Ye] && (Jt[Ye] || !Ka[Ye]) : !!(Wt === "application/xhtml+xml" && st[Q.namespaceURI]) : false;
  }, Ft = function(Q) {
    Ps(e.removed, { element: Q });
    try {
      j(Q).removeChild(Q);
    } catch {
      k(Q);
    }
  }, ur = function(Q, Ie) {
    try {
      Ps(e.removed, { attribute: Ie.getAttributeNode(Q), from: Ie });
    } catch {
      Ps(e.removed, { attribute: null, from: Ie });
    }
    if (Ie.removeAttribute(Q), Q === "is") if (pe || ge) try {
      Ft(Ie);
    } catch {
    }
    else try {
      Ie.setAttribute(Q, "");
    } catch {
    }
  }, kn = function(Q) {
    let Ie = null, Ye = null;
    if (ce) Q = "<remove></remove>" + Q;
    else {
      const Ot = tl(Q, /^[\r\n\t ]+/);
      Ye = Ot && Ot[0];
    }
    Wt === "application/xhtml+xml" && je === Re && (Q = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + Q + "</body></html>");
    const wt = M ? M.createHTML(Q) : Q;
    if (je === Re) try {
      Ie = new h().parseFromString(wt, Wt);
    } catch {
    }
    if (!Ie || !Ie.documentElement) {
      Ie = F.createDocument(je, "template", null);
      try {
        Ie.documentElement.innerHTML = Ve ? q : wt;
      } catch {
      }
    }
    const jt = Ie.body || Ie.documentElement;
    return Q && Ye && jt.insertBefore(r.createTextNode(Ye), jt.childNodes[0] || null), je === Re ? T.call(Ie, we ? "html" : "body")[0] : we ? Ie.documentElement : jt;
  }, Sa = function(Q) {
    return P.call(Q.ownerDocument || Q, Q, f.SHOW_ELEMENT | f.SHOW_COMMENT | f.SHOW_TEXT | f.SHOW_PROCESSING_INSTRUCTION | f.SHOW_CDATA_SECTION, null);
  }, Ne = function(Q) {
    return Q instanceof m && (typeof Q.nodeName != "string" || typeof Q.textContent != "string" || typeof Q.removeChild != "function" || !(Q.attributes instanceof p) || typeof Q.removeAttribute != "function" || typeof Q.setAttribute != "function" || typeof Q.namespaceURI != "string" || typeof Q.insertBefore != "function" || typeof Q.hasChildNodes != "function");
  }, at = function(Q) {
    return typeof l == "function" && Q instanceof l;
  };
  function ot(He, Q, Ie) {
    zo(He, (Ye) => {
      Ye.call(e, Q, Ie, Sr);
    });
  }
  const Qt = function(Q) {
    let Ie = null;
    if (ot(K.beforeSanitizeElements, Q, null), Ne(Q)) return Ft(Q), true;
    const Ye = Nt(Q.nodeName);
    if (ot(K.uponSanitizeElement, Q, { tagName: Ye, allowedTags: te }), ye && Q.hasChildNodes() && !at(Q.firstElementChild) && zr(/<[/\w!]/g, Q.innerHTML) && zr(/<[/\w!]/g, Q.textContent) || Q.nodeType === Ms.progressingInstruction || ye && Q.nodeType === Ms.comment && zr(/<[/\w]/g, Q.data)) return Ft(Q), true;
    if (!(ie.tagCheck instanceof Function && ie.tagCheck(Ye)) && (!te[Ye] || J[Ye])) {
      if (!J[Ye] && It(Ye) && (G.tagNameCheck instanceof RegExp && zr(G.tagNameCheck, Ye) || G.tagNameCheck instanceof Function && G.tagNameCheck(Ye))) return false;
      if (xe && !qe[Ye]) {
        const wt = j(Q) || Q.parentNode, jt = U(Q) || Q.childNodes;
        if (jt && wt) {
          const Ot = jt.length;
          for (let Ht = Ot - 1; Ht >= 0; --Ht) {
            const ir = y(jt[Ht], true);
            ir.__removalCount = (Q.__removalCount || 0) + 1, wt.insertBefore(ir, D(Q));
          }
        }
      }
      return Ft(Q), true;
    }
    return Q instanceof c && !xt(Q) || (Ye === "noscript" || Ye === "noembed" || Ye === "noframes") && zr(/<\/no(script|embed|frames)/i, Q.innerHTML) ? (Ft(Q), true) : (ke && Q.nodeType === Ms.text && (Ie = Q.textContent, zo([W, A, S], (wt) => {
      Ie = $s(Ie, wt, " ");
    }), Q.textContent !== Ie && (Ps(e.removed, { element: Q.cloneNode() }), Q.textContent = Ie)), ot(K.afterSanitizeElements, Q, null), false);
  }, ar = function(Q, Ie, Ye) {
    if (se[Ie] || he && (Ie === "id" || Ie === "name") && (Ye in r || Ye in ra)) return false;
    if (!(de && !se[Ie] && zr(w, Ie))) {
      if (!(oe && zr(R, Ie))) {
        if (!(ie.attributeCheck instanceof Function && ie.attributeCheck(Ie, Q))) {
          if (!$[Ie] || se[Ie]) {
            if (!(It(Q) && (G.tagNameCheck instanceof RegExp && zr(G.tagNameCheck, Q) || G.tagNameCheck instanceof Function && G.tagNameCheck(Q)) && (G.attributeNameCheck instanceof RegExp && zr(G.attributeNameCheck, Ie) || G.attributeNameCheck instanceof Function && G.attributeNameCheck(Ie, Q)) || Ie === "is" && G.allowCustomizedBuiltInElements && (G.tagNameCheck instanceof RegExp && zr(G.tagNameCheck, Ye) || G.tagNameCheck instanceof Function && G.tagNameCheck(Ye)))) return false;
          } else if (!_e40[Ie]) {
            if (!zr(H, $s(Ye, Z, ""))) {
              if (!((Ie === "src" || Ie === "xlink:href" || Ie === "href") && Q !== "script" && Tk(Ye, "data:") === 0 && fe[Q])) {
                if (!(ve && !zr(B, $s(Ye, Z, "")))) {
                  if (Ye) return false;
                }
              }
            }
          }
        }
      }
    }
    return true;
  }, It = function(Q) {
    return Q !== "annotation-xml" && tl(Q, X);
  }, rr = function(Q) {
    ot(K.beforeSanitizeAttributes, Q, null);
    const { attributes: Ie } = Q;
    if (!Ie || Ne(Q)) return;
    const Ye = { attrName: "", attrValue: "", keepAttr: true, allowedAttributes: $, forceKeepAttr: void 0 };
    let wt = Ie.length;
    for (; wt--; ) {
      const jt = Ie[wt], { name: Ot, namespaceURI: Ht, value: ir } = jt, lr = Nt(Ot), Bt = ir;
      let mt = Ot === "value" ? Bt : Ak(Bt);
      if (Ye.attrName = lr, Ye.attrValue = mt, Ye.keepAttr = true, Ye.forceKeepAttr = void 0, ot(K.uponSanitizeAttribute, Q, Ye), mt = Ye.attrValue, ue && (lr === "id" || lr === "name") && (ur(Ot, Q), mt = Ee + mt), ye && zr(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i, mt)) {
        ur(Ot, Q);
        continue;
      }
      if (lr === "attributename" && tl(mt, "href")) {
        ur(Ot, Q);
        continue;
      }
      if (Ye.forceKeepAttr) continue;
      if (!Ye.keepAttr) {
        ur(Ot, Q);
        continue;
      }
      if (!me && zr(/\/>/i, mt)) {
        ur(Ot, Q);
        continue;
      }
      ke && zo([W, A, S], (kt) => {
        mt = $s(mt, kt, " ");
      });
      const Yt = Nt(Q.nodeName);
      if (!ar(Yt, lr, mt)) {
        ur(Ot, Q);
        continue;
      }
      if (M && typeof x == "object" && typeof x.getAttributeType == "function" && !Ht) switch (x.getAttributeType(Yt, lr)) {
        case "TrustedHTML": {
          mt = M.createHTML(mt);
          break;
        }
        case "TrustedScriptURL": {
          mt = M.createScriptURL(mt);
          break;
        }
      }
      if (mt !== Bt) try {
        Ht ? Q.setAttributeNS(Ht, Ot, mt) : Q.setAttribute(Ot, mt), Ne(Q) ? Ft(Q) : Ju(e.removed);
      } catch {
        ur(Ot, Q);
      }
    }
    ot(K.afterSanitizeAttributes, Q, null);
  }, qt = function He(Q) {
    let Ie = null;
    const Ye = Sa(Q);
    for (ot(K.beforeSanitizeShadowDOM, Q, null); Ie = Ye.nextNode(); ) ot(K.uponSanitizeShadowNode, Ie, null), Qt(Ie), rr(Ie), Ie.content instanceof o && He(Ie.content);
    ot(K.afterSanitizeShadowDOM, Q, null);
  };
  return e.sanitize = function(He) {
    let Q = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, Ie = null, Ye = null, wt = null, jt = null;
    if (Ve = !He, Ve && (He = "<!-->"), typeof He != "string" && !at(He)) if (typeof He.toString == "function") {
      if (He = He.toString(), typeof He != "string") throw Ns("dirty is not a string, aborting");
    } else throw Ns("toString is not a function");
    if (!e.isSupported) return He;
    if (le || ka(Q), e.removed = [], typeof He == "string" && (Se = false), Se) {
      if (He.nodeName) {
        const ir = Nt(He.nodeName);
        if (!te[ir] || J[ir]) throw Ns("root node is forbidden and cannot be sanitized in-place");
      }
    } else if (He instanceof l) Ie = kn("<!---->"), Ye = Ie.ownerDocument.importNode(He, true), Ye.nodeType === Ms.element && Ye.nodeName === "BODY" || Ye.nodeName === "HTML" ? Ie = Ye : Ie.appendChild(Ye);
    else {
      if (!pe && !ke && !we && He.indexOf("<") === -1) return M && Te ? M.createHTML(He) : He;
      if (Ie = kn(He), !Ie) return pe ? null : Te ? q : "";
    }
    Ie && ce && Ft(Ie.firstChild);
    const Ot = Sa(Se ? He : Ie);
    for (; wt = Ot.nextNode(); ) Qt(wt), rr(wt), wt.content instanceof o && qt(wt.content);
    if (Se) return He;
    if (pe) {
      if (ge) for (jt = C.call(Ie.ownerDocument); Ie.firstChild; ) jt.appendChild(Ie.firstChild);
      else jt = Ie;
      return ($.shadowroot || $.shadowrootmode) && (jt = N.call(n, jt, true)), jt;
    }
    let Ht = we ? Ie.outerHTML : Ie.innerHTML;
    return we && te["!doctype"] && Ie.ownerDocument && Ie.ownerDocument.doctype && Ie.ownerDocument.doctype.name && zr(bm, Ie.ownerDocument.doctype.name) && (Ht = "<!DOCTYPE " + Ie.ownerDocument.doctype.name + `>
` + Ht), ke && zo([W, A, S], (ir) => {
      Ht = $s(Ht, ir, " ");
    }), M && Te ? M.createHTML(Ht) : Ht;
  }, e.setConfig = function() {
    let He = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    ka(He), le = true;
  }, e.clearConfig = function() {
    Sr = null, le = false;
  }, e.isValidAttribute = function(He, Q, Ie) {
    Sr || ka({});
    const Ye = Nt(He), wt = Nt(Q);
    return ar(Ye, wt, Ie);
  }, e.addHook = function(He, Q) {
    typeof Q == "function" && Ps(K[He], Q);
  }, e.removeHook = function(He, Q) {
    if (Q !== void 0) {
      const Ie = kk(K[He], Q);
      return Ie === -1 ? void 0 : Sk(K[He], Ie, 1)[0];
    }
    return Ju(K[He]);
  }, e.removeHooks = function(He) {
    K[He] = [];
  }, e.removeAllHooks = function() {
    K = af();
  }, e;
}
var Wl = xm();
function Fk(t) {
  const e = [];
  e.push(`# ${t.subject}`), e.push(""), e.push("| | |"), e.push("|---|---|"), e.push(`| **From** | ${sf(t.from)} |`), e.push(`| **To** | ${sf(t.to)} |`), e.push(`| **Date** | ${Mc(t.date)} |`), e.push(""), e.push("---"), e.push("");
  const r = t.htmlBody ? Uk(t.htmlBody) : null;
  return e.push(r || t.body || "*(no body)*"), e.push(""), e.join(`
`);
}
function sf(t) {
  return (t || "").replace(/\|/g, "\\|");
}
function Uk(t) {
  try {
    const e = new DOMParser().parseFromString(t, "text/html");
    for (const r of e.querySelectorAll("style, script, head")) r.remove();
    return Vl(e.body).replace(/\n{3,}/g, `

`).trim();
  } catch {
    return null;
  }
}
function Gk(t, e) {
  if (!e || e.startsWith("data:")) return true;
  const r = parseInt(t.getAttribute("width") ?? "", 10), n = parseInt(t.getAttribute("height") ?? "", 10);
  if (r > 0 && r <= 3 || n > 0 && n <= 3) return true;
  const a = e.toLowerCase();
  return a.includes("spacer") || a.includes("transparent") || a.includes("transp.gif") || a.includes("/track") && a.includes("pixel") || /amazon\.com\/gp\/r\.html\?/.test(e) || /[?&](open|track|beacon|pixel|img)=/i.test(a) ? true : a.includes("mail.google.com/mail/u/") && a.includes("view=fimg") ? false : !!(/ci\d+\.\w+\.com\//.test(a) || a.endsWith(".gif") && a.includes("1x1"));
}
function Vl(t) {
  var _a10;
  if (t.nodeType === 3) return (t.textContent ?? "").replace(/[ \t]+/g, " ");
  if (t.nodeType !== 1) return "";
  const e = t, r = e.tagName.toLowerCase();
  if (r === "br") return `
`;
  if (r === "hr") return `

---

`;
  if (r === "img") {
    const o = e.getAttribute("src") || "", i = e.getAttribute("alt") || "";
    return Gk(e, o) ? "" : `![${i}](${o})`;
  }
  const n = Array.from(t.childNodes).map(Vl).join(""), a = n.trim();
  if (!a && !["img", "br", "hr"].includes(r)) return n;
  if (r === "p" || r === "div") return `

${a}

`;
  if (r === "blockquote") return `

> ${a.replace(/\n/g, `
> `)}

`;
  if (/^h[1-6]$/.test(r)) {
    const o = Number(r[1]);
    return `

${"#".repeat(o)} ${a}

`;
  }
  if (r === "ul" || r === "ol") return `

${n}

`;
  if (r === "li") return `${((_a10 = e.parentElement) == null ? void 0 : _a10.tagName.toLowerCase()) === "ol" ? "1." : "-"} ${a}
`;
  if (r === "a") {
    const o = e.getAttribute("href") || "";
    return !o || o.startsWith("mailto:") ? a : a === o ? o : `[${a}](${o})`;
  }
  if (r === "strong" || r === "b") return `**${a}**`;
  if (r === "em" || r === "i") return `*${a}*`;
  if (r === "code") return `\`${a}\``;
  if (r === "table") return `

${n}

`;
  if (r === "tr") return `| ${Array.from(e.children).map((i) => Vl(i).trim()).join(" | ")} |
`;
  if (r === "td" || r === "th") return n;
  if (r === "thead") {
    const o = n.trim(), i = (o.match(/\|/g) || []).length - 1, l = "| " + Array(Math.max(i, 1)).fill("---").join(" | ") + " |";
    return `${o}${l}
`;
  }
  return n;
}
function Wk(t) {
  return Bv(t, "md");
}
function of(t, e, r = "text/markdown;charset=utf-8") {
  const n = new Blob([t], { type: r }), a = URL.createObjectURL(n), o = document.createElement("a");
  o.href = a, o.download = e, document.body.appendChild(o), o.click(), document.body.removeChild(o), URL.revokeObjectURL(a);
}
function Vk(t) {
  return t.raw ?? null;
}
function Hk(t) {
  const e = Vk(t);
  return e ? JSON.stringify(e, null, 2) : "null";
}
function qk(t) {
  return Bv(t, "json");
}
var Yk = _('<button title="View as Markdown">.md</button>'), Kk = _('<div class="md-toolbar svelte-1b0rzpb"><span class="toolbar-label svelte-1b0rzpb">JSON</span> <button class="action-btn download-btn svelte-1b0rzpb" title="Download .json file">Download</button></div> <div class="md-body svelte-1b0rzpb"><pre class="md-raw svelte-1b0rzpb"> </pre></div>', 1), Xk = _('<pre class="md-raw svelte-1b0rzpb"> </pre>'), Zk = _('<div class="md-preview svelte-1b0rzpb"></div>'), Jk = _('<div class="md-toolbar svelte-1b0rzpb"><div class="md-tabs svelte-1b0rzpb"><button>Raw</button> <button>Preview</button></div> <button class="action-btn download-btn svelte-1b0rzpb" title="Download .md file">Download</button></div> <div class="md-body svelte-1b0rzpb"><!></div>', 1), Qk = _('<div class="loading-state svelte-1b0rzpb"><span class="spinner svelte-1b0rzpb"></span> <span>Loading message...</span></div>'), eS = _('<iframe class="html-frame svelte-1b0rzpb" sandbox="allow-same-origin" title="Email content"></iframe>'), tS = _('<pre class="message-text svelte-1b0rzpb"> </pre>'), rS = _('<p class="empty-body svelte-1b0rzpb">Loading...</p>'), nS = _('<div class="modal-meta svelte-1b0rzpb"><div class="meta-row svelte-1b0rzpb"><span class="meta-label svelte-1b0rzpb">From:</span> <span> </span></div> <div class="meta-row svelte-1b0rzpb"><span class="meta-label svelte-1b0rzpb">To:</span> <span> </span></div> <div class="meta-row svelte-1b0rzpb"><span class="meta-label svelte-1b0rzpb">Date:</span> <span> </span></div></div> <div class="modal-body svelte-1b0rzpb"><!></div>', 1), aS = _('<div class="modal-overlay svelte-1b0rzpb" role="dialog" aria-modal="true"><div class="modal-content svelte-1b0rzpb" role="document"><div class="modal-header svelte-1b0rzpb"><h3 class="modal-subject svelte-1b0rzpb"> </h3> <div class="header-actions svelte-1b0rzpb"><button title="View as JSON">.json</button> <!> <button class="modal-close svelte-1b0rzpb">\u2715</button></div></div> <!></div></div>');
function sS(t, e) {
  De(e, true);
  let r = ae(e, "loading", 3, false);
  Xt(() => qa("MessageModal"));
  const n = new Mt.Renderer();
  n.link = ({ href: S, title: w, text: R }) => {
    const B = w ? ` title="${w}"` : "";
    return `<a href="${S}"${B} target="_blank" rel="noopener">${R}</a>`;
  }, Mt.setOptions({ breaks: true, gfm: true, renderer: n });
  let a = ee("email"), o = V(() => e.message.body ? Fk(e.message) : ""), i = V(() => Hk(e.message)), l = ee("raw");
  function c(S) {
    g(a, s(a) === S ? "email" : S, true), S === "markdown" && g(l, "raw");
  }
  function f() {
    of(s(o), Wk(e.message));
  }
  function p() {
    of(s(i), qk(e.message), "application/json;charset=utf-8");
  }
  function m(S) {
    const w = Mt.parse(S);
    return Wl.sanitize(w, { ADD_ATTR: ["target"], ALLOW_TAGS: ["h1", "h2", "h3", "h4", "h5", "h6", "p", "br", "hr", "blockquote", "pre", "code", "strong", "b", "em", "i", "a", "img", "ul", "ol", "li", "table", "thead", "tbody", "tr", "th", "td", "del", "s"] });
  }
  function h(S) {
    let w = S.replace(/<script\b[\s\S]*?<\/script>/gi, "");
    return w = w.replace(/<iframe\b[\s\S]*?<\/iframe>/gi, ""), w = w.replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, " "), w = w.replace(/\s+on\w+\s*=\s*[^\s>]+/gi, " "), Wl.sanitize(w, { ALLOWED_TAGS: ["h1", "h2", "h3", "h4", "h5", "h6", "p", "br", "hr", "div", "span", "a", "img", "strong", "b", "em", "i", "u", "s", "sub", "sup", "ul", "ol", "li", "blockquote", "pre", "code", "table", "thead", "tbody", "tfoot", "tr", "th", "td", "style", "font"], ALLOWED_ATTR: ["href", "src", "alt", "title", "target", "style", "width", "height", "border", "align", "color", "size", "face"], ADD_ATTR: ["target"] });
  }
  const x = `
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 14px;
      line-height: 1.5;
      color: #e0e0e0;
      background: #1a1a1a;
      margin: 0;
      padding: 16px;
      word-break: break-word;
    }
    a { color: #60a5fa; }
    img { max-width: 100%; height: auto; }
    table { border-collapse: collapse; max-width: 100%; }
    td, th { padding: 4px 8px; }
  `, b = V(() => {
    var _a10;
    return ((_a10 = e.message) == null ? void 0 : _a10.htmlBody) && !r() ? `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${x}</style></head><body>${h(e.message.htmlBody)}</body></html>` : "";
  });
  var y = aS(), k = d(y), D = d(k), U = d(D), j = d(U), M = v(U, 2), q = d(M);
  let F;
  var P = v(q, 2);
  {
    var C = (S) => {
      var w = Yk();
      let R;
      L(() => R = rt(w, 1, "action-btn svelte-1b0rzpb", null, R, { active: s(a) === "markdown" })), Pe("click", w, () => c("markdown")), u(S, w);
    };
    I(P, (S) => {
      e.message.body && S(C);
    });
  }
  var T = v(P, 2), N = v(D, 2);
  {
    var K = (S) => {
      var w = Kk(), R = re(w), B = v(d(R), 2), Z = v(R, 2), X = d(Z), H = d(X);
      L(() => E(H, s(i))), Pe("click", B, p), u(S, w);
    }, W = (S) => {
      var w = Jk(), R = re(w), B = d(R), Z = d(B);
      let X;
      var H = v(Z, 2);
      let te;
      var Y = v(B, 2), $ = v(R, 2), O = d($);
      {
        var G = (se) => {
          var ie = Xk(), oe = d(ie);
          L(() => E(oe, s(o))), u(se, ie);
        }, J = (se) => {
          var ie = Zk();
          fc(ie, () => m(s(o)), true), u(se, ie);
        };
        I(O, (se) => {
          s(l) === "raw" ? se(G) : se(J, -1);
        });
      }
      L(() => {
        X = rt(Z, 1, "md-tab svelte-1b0rzpb", null, X, { active: s(l) === "raw" }), te = rt(H, 1, "md-tab svelte-1b0rzpb", null, te, { active: s(l) === "preview" });
      }), Pe("click", Z, () => g(l, "raw")), Pe("click", H, () => g(l, "preview")), Pe("click", Y, f), u(S, w);
    }, A = (S) => {
      var w = nS(), R = re(w), B = d(R), Z = v(d(B), 2), X = d(Z), H = v(B, 2), te = v(d(H), 2), Y = d(te), $ = v(H, 2), O = v(d($), 2), G = d(O), J = v(R, 2), se = d(J);
      {
        var ie = (me) => {
          var ke = Qk();
          u(me, ke);
        }, oe = (me) => {
          var ke = eS();
          L(() => br(ke, "srcdoc", s(b))), u(me, ke);
        }, de = (me) => {
          var ke = tS(), ye = d(ke);
          L(() => E(ye, e.message.body)), u(me, ke);
        }, ve = (me) => {
          var ke = rS();
          u(me, ke);
        };
        I(se, (me) => {
          r() ? me(ie) : e.message.htmlBody ? me(oe, 1) : e.message.body ? me(de, 2) : me(ve, -1);
        });
      }
      L((me) => {
        E(X, e.message.from), E(Y, e.message.to), E(G, me);
      }, [() => Mc(e.message.date)]), u(S, w);
    };
    I(N, (S) => {
      s(a) === "json" ? S(K) : s(a) === "markdown" ? S(W, 1) : S(A, -1);
    });
  }
  L(() => {
    E(j, e.message.subject), F = rt(q, 1, "action-btn svelte-1b0rzpb", null, F, { active: s(a) === "json" });
  }), Pe("click", y, function(...S) {
    var _a10;
    (_a10 = e.onclose) == null ? void 0 : _a10.apply(this, S);
  }), Pe("click", k, (S) => S.stopPropagation()), Pe("click", q, () => c("json")), Pe("click", T, function(...S) {
    var _a10;
    (_a10 = e.onclose) == null ? void 0 : _a10.apply(this, S);
  }), u(t, y), Le();
}
Zt(["click"]);
var oS = _('<div data-slot="progress-indicator" class="bg-primary h-full w-full flex-1 transition-all"></div>');
function Hl(t, e) {
  De(e, true);
  let r = ae(e, "ref", 15, null), n = ae(e, "max", 3, 100), a = ut(e, ["$$slots", "$$events", "$$legacy", "ref", "class", "max", "value"]);
  var o = Ae(), i = re(o);
  {
    let l = V(() => Je("bg-primary/20 relative h-2 w-full overflow-hidden rounded-full", e.class));
    dr(i, () => j1, (c, f) => {
      f(c, et({ "data-slot": "progress", get class() {
        return s(l);
      }, get value() {
        return e.value;
      }, get max() {
        return n();
      } }, () => a, { get ref() {
        return r();
      }, set ref(p) {
        r(p);
      }, children: (p, m) => {
        var h = oS();
        L(() => Rt(h, `transform: translateX(-${100 - 100 * (e.value ?? 0) / (n() ?? 1)}%)`)), u(p, h);
      }, $$slots: { default: true } }));
    });
  }
  u(t, o), Le();
}
var iS = _('<p class="fs-unsupported svelte-ydmozk">File System Access API is not supported. Use Chrome or Edge.</p>'), lS = _('<span class="fs-status svelte-ydmozk">Loading\u2026</span>'), cS = _('<button class="fs-btn fs-btn-clear svelte-ydmozk" type="button">Clear</button>'), dS = _('<p class="fs-error svelte-ydmozk"> </p>'), uS = _('<div class="fs-row svelte-ydmozk"><span class="fs-path svelte-ydmozk"> </span> <div class="fs-buttons svelte-ydmozk"><button class="fs-btn svelte-ydmozk" type="button">Choose directory</button> <!></div></div> <!>', 1), fS = _('<div class="fs-settings svelte-ydmozk"><span class="fs-label svelte-ydmozk">Root directory</span> <!></div>');
function ym(t, e) {
  De(e, true);
  let r = ee(null), n = ee(true), a = ee(null);
  const o = typeof window < "u" && "showDirectoryPicker" in window;
  async function i() {
    g(n, true), g(a, null);
    try {
      const b = await Yo();
      g(r, (b == null ? void 0 : b.name) ?? null, true);
    } catch (b) {
      g(a, b instanceof Error ? b.message : String(b), true);
    }
    g(n, false);
  }
  Xt(i);
  async function l() {
    if (o) {
      g(a, null);
      try {
        const b = await window.showDirectoryPicker({ mode: "readwrite" });
        await vb(b), g(r, b.name, true);
      } catch (b) {
        if (b.name === "AbortError") return;
        g(a, b instanceof Error ? b.message : String(b), true);
      }
    }
  }
  async function c() {
    g(a, null);
    try {
      await gb(), g(r, null);
    } catch (b) {
      g(a, b instanceof Error ? b.message : String(b), true);
    }
  }
  var f = fS(), p = v(d(f), 2);
  {
    var m = (b) => {
      var y = iS();
      u(b, y);
    }, h = (b) => {
      var y = lS();
      u(b, y);
    }, x = (b) => {
      var y = uS(), k = re(y), D = d(k), U = d(D), j = v(D, 2), M = d(j), q = v(M, 2);
      {
        var F = (T) => {
          var N = cS();
          Pe("click", N, c), u(T, N);
        };
        I(q, (T) => {
          s(r) && T(F);
        });
      }
      var P = v(k, 2);
      {
        var C = (T) => {
          var N = dS(), K = d(N);
          L(() => E(K, s(a))), u(T, N);
        };
        I(P, (T) => {
          s(a) && T(C);
        });
      }
      L(() => {
        br(D, "title", s(r) ?? "No directory chosen"), E(U, s(r) ?? "No directory chosen");
      }), Pe("click", M, l), u(b, y);
    };
    I(p, (b) => {
      o ? s(n) ? b(h, 1) : b(x, -1) : b(m);
    });
  }
  u(t, f), Le();
}
Zt(["click"]);
var pS = _('<span class="size-1.5 rounded-full bg-success shrink-0"></span>'), vS = _('<span class="size-1.5 rounded-full bg-muted-foreground/20 shrink-0"></span>'), gS = _('<span class="text-[0.55rem] font-medium text-muted-foreground/30 shrink-0">Soon</span>'), mS = _('<button><div class="size-8 rounded-lg flex items-center justify-center text-sm font-black shrink-0"> </div> <div class="flex-1 min-w-0"><p> </p> <p class="text-[0.65rem] text-muted-foreground/50 truncate"> </p></div> <!></button>'), hS = _('<div class="px-2 pb-4 flex flex-col gap-0.5"></div>'), _S = _('<span class="text-xs text-muted-foreground/60"> </span>'), bS = _('<span class="text-xs text-muted-foreground/40"> </span>'), xS = _("<option> </option>"), yS = _("<!> ", 1), wS = _('<div class="mx-4 mt-2 px-3 py-2 rounded border border-destructive/30 bg-destructive/8 text-xs text-destructive flex items-center justify-between shrink-0"><span> </span> <button class="ml-2 opacity-60 hover:opacity-100">\u2715</button></div>'), kS = _('<span class="text-xs text-muted-foreground/40 shrink-0 whitespace-nowrap"> </span>'), SS = _('<div class="flex justify-center pt-4"><!></div>'), TS = _("<!> <!>", 1), AS = _('<div class="flex items-center justify-center gap-2.5 py-16 text-sm text-muted-foreground/50"><div class="size-4 border-2 border-border border-t-primary rounded-full animate-spin shrink-0"></div> Loading messages\u2026</div>'), ES = _('<div class="flex flex-col items-center justify-center gap-3 py-20 text-center"><!> <p class="text-sm text-muted-foreground/40"> </p></div>'), CS = _('<div class="flex items-center gap-2"><span class="text-xs text-muted-foreground/50">Delete all local emails?</span> <!> <!></div>'), IS = _('<button class="flex items-center gap-1 text-[0.65rem] text-muted-foreground/25 hover:text-destructive transition-colors"><!>Clear local data</button>'), PS = _('<div class="px-4 py-2 border-t border-border shrink-0 flex items-center justify-end"><!></div>'), $S = _('<div class="flex items-center gap-3 px-8 pt-5 pb-4 border-b border-border shrink-0 bg-transparent"><div class="flex items-center gap-2 min-w-0"><div class="size-7 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary shrink-0"> </div> <span class="text-sm font-medium text-foreground truncate max-w-[180px]"> </span> <span class="size-1.5 rounded-full bg-success shrink-0"></span></div> <div class="flex items-center gap-2 ml-auto shrink-0"><!> <select class="h-7 px-1.5 text-xs rounded border border-input bg-background text-foreground"></select> <!> <!> <button class="text-muted-foreground/30 hover:text-destructive transition-colors p-1 rounded" title="Sign out"><!></button></div></div> <!> <!> <div class="flex items-center gap-2 px-4 py-2.5 border-b border-border shrink-0"><div class="relative flex-1"><!> <!></div> <!> <!></div> <div class="flex-1 min-h-0 overflow-y-auto"><div class="p-3"><!></div></div> <!>', 1), NS = _('<p class="text-sm text-destructive text-center max-w-xs"> </p>'), RS = _('<div class="size-4 border-2 border-zinc-300 border-t-zinc-700 rounded-full animate-spin shrink-0"></div> Signing in\u2026', 1), MS = dn('<svg viewBox="0 0 24 24" width="16" height="16" class="shrink-0"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"></path><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path></svg> Sign in with Google', 1), zS = _('<div class="flex items-center gap-1.5 text-[0.65rem] text-muted-foreground/30"><span> </span> <button class="text-primary hover:underline ml-auto">Change</button></div>'), OS = _('<div class="flex flex-col gap-1.5"><!> <div class="flex gap-1.5"><!> <!></div></div>'), DS = _('<div class="flex flex-col items-center justify-center h-full gap-5 px-8"><div class="size-14 rounded-2xl flex items-center justify-center text-2xl font-black" style="background:#ea433518; color:#ea4335;">M</div> <div class="text-center"><p class="text-base font-semibold text-foreground mb-1">Connect Gmail</p> <p class="text-sm text-muted-foreground/60 max-w-xs leading-relaxed">Sign in with Google to sync and browse your emails.</p></div> <!> <div class="flex flex-col items-center gap-2 w-full max-w-[260px]"><button class="flex items-center justify-center gap-2.5 w-full h-10 px-4 rounded-lg border border-border bg-white text-zinc-800 text-sm font-medium hover:bg-zinc-50 disabled:opacity-50 transition-colors shadow-sm"><!></button> <a href="#oauth-redirect" class="text-xs text-muted-foreground/40 hover:text-primary transition-colors">Popup blocked? Use redirect flow</a></div> <div class="w-full max-w-[260px]"><!></div></div>'), LS = _('<span class="text-xs text-muted-foreground/60"> </span>'), jS = _('<span class="text-xs text-muted-foreground/40"> </span>'), BS = _("<option> </option>"), FS = _("<!> ", 1), US = _('<div class="mx-4 mt-2 px-3 py-2 rounded border border-destructive/30 bg-destructive/8 text-xs text-destructive flex items-center justify-between shrink-0"><span> </span> <button class="ml-2 opacity-60 hover:opacity-100">\u2715</button></div>'), GS = _('<span class="text-xs text-muted-foreground/40 shrink-0 whitespace-nowrap"> </span>'), WS = _('<div class="flex justify-center pt-4"><!></div>'), VS = _("<!> <!>", 1), HS = _('<div class="flex items-center justify-center gap-2.5 py-16 text-sm text-muted-foreground/50"><div class="size-4 border-2 border-border border-t-primary rounded-full animate-spin shrink-0"></div> Loading tweets\u2026</div>'), qS = _('<div class="flex flex-col items-center justify-center gap-3 py-20 text-center"><!> <p class="text-sm text-muted-foreground/40"> </p></div>'), YS = _('<div class="flex items-center gap-2"><span class="text-xs text-muted-foreground/50">Delete all local tweets?</span> <!> <!></div>'), KS = _('<button class="flex items-center gap-1 text-[0.65rem] text-muted-foreground/25 hover:text-destructive transition-colors"><!>Clear local data</button>'), XS = _('<div class="px-4 py-2 border-t border-border shrink-0 flex items-center justify-end"><!></div>'), ZS = _('<div class="flex items-center gap-3 px-8 pt-5 pb-4 border-b border-border shrink-0 bg-transparent"><div class="flex items-center gap-2 min-w-0"><div class="size-7 rounded-full bg-[#1da1f2]/15 flex items-center justify-center text-xs font-bold text-[#1da1f2] shrink-0">X</div> <span class="text-sm font-medium text-foreground truncate max-w-[180px]"> </span> <span class="size-1.5 rounded-full bg-success shrink-0"></span></div> <div class="flex items-center gap-2 ml-auto shrink-0"><!> <select class="h-7 px-1.5 text-xs rounded border border-input bg-background text-foreground"></select> <!> <!> <button class="text-muted-foreground/30 hover:text-destructive transition-colors p-1 rounded" title="Sign out"><!></button></div></div> <!> <!> <div class="flex items-center gap-2 px-4 py-2.5 border-b border-border shrink-0"><div class="relative flex-1"><!> <!></div> <!> <!></div> <div class="flex-1 min-h-0 overflow-y-auto"><div class="p-3"><!></div></div> <!>', 1), JS = _('<p class="text-sm text-destructive text-center max-w-xs"> </p>'), QS = _('<div class="size-4 border-2 border-zinc-600 border-t-white rounded-full animate-spin shrink-0"></div> Signing in\u2026', 1), e5 = dn('<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" class="shrink-0"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg> Sign in with X', 1), t5 = _('<div class="flex items-center gap-1.5 text-[0.65rem] text-muted-foreground/30"><span> </span> <button class="text-primary hover:underline ml-auto">Change</button></div>'), r5 = _('<div class="flex flex-col gap-1.5"><!> <div class="flex gap-1.5"><!> <!></div></div>'), n5 = _('<div class="flex flex-col items-center justify-center h-full gap-5 px-8"><div class="size-14 rounded-2xl flex items-center justify-center text-2xl font-black" style="background:#1da1f218; color:#1da1f2;">X</div> <div class="text-center"><p class="text-base font-semibold text-foreground mb-1">Connect Twitter/X</p> <p class="text-sm text-muted-foreground/60 max-w-xs leading-relaxed">Sign in with Twitter to sync and browse your tweets.</p> <p class="text-xs text-muted-foreground/40 max-w-xs leading-relaxed mt-1">Get your Client ID from the <a href="https://developer.x.com/en/portal/dashboard" target="_blank" rel="noopener" class="text-[#1da1f2] hover:underline">X Developer Portal</a>. Create a project \u2192 App \u2192 enable OAuth 2.0 as <a href="https://developer.x.com/en/docs/authentication/oauth-2-0/authorization-code" target="_blank" rel="noopener" class="text-[#1da1f2] hover:underline">Public Client</a>, and set the redirect URI to <code class="text-[0.65rem] bg-muted/30 px-1 py-0.5 rounded"></code></p></div> <!> <div class="flex flex-col items-center gap-2 w-full max-w-[260px]"><button class="flex items-center justify-center gap-2.5 w-full h-10 px-4 rounded-lg border border-border bg-black text-white text-sm font-medium hover:bg-zinc-900 disabled:opacity-50 transition-colors shadow-sm"><!></button></div> <div class="w-full max-w-[260px]"><!></div></div>'), a5 = _(`<div class="flex flex-col h-full overflow-hidden"><div class="flex items-center gap-3 px-8 pt-5 pb-4 border-b border-border shrink-0 bg-transparent"><div class="flex items-center gap-2 min-w-0"><div class="size-7 rounded-full bg-[#10b981]/15 flex items-center justify-center text-xs font-bold text-[#10b981] shrink-0">F</div> <span class="text-sm font-medium text-foreground truncate">Local Filesystem</span></div></div> <div class="flex-1 overflow-auto px-8 py-6"><div class="max-w-xl"><p class="text-sm text-muted-foreground mb-4">Choose a directory to allow pipeline actions (read_file, write_file, list_dir, etc.)
              to operate on your local files. Requires Chrome or Edge.</p> <div class="rounded-lg border border-border bg-card p-4"><!></div></div></div></div>`), s5 = _('<div class="flex flex-col items-center justify-center h-full gap-4 text-center px-8"><div class="size-14 rounded-2xl flex items-center justify-center text-2xl font-black"> </div> <div><p class="text-base font-semibold text-foreground mb-1"> </p> <p class="text-sm text-muted-foreground/50"> </p></div> <span class="px-3 py-1 rounded-full border border-border text-xs text-muted-foreground/50">Coming soon</span></div>'), o5 = _('<div class="flex h-full overflow-hidden"><div class="w-56 shrink-0 flex flex-col border-r border-border bg-sidebar overflow-hidden"><div class="px-3 pt-4 pb-2 shrink-0"><p class="text-[0.6rem] font-semibold uppercase tracking-widest text-muted-foreground/50">Sources</p></div> <!></div> <div class="flex-1 overflow-hidden flex flex-col bg-background"><!></div></div> <!>', 1);
function i5(t, e) {
  De(e, true);
  const r = { gmail: { color: "#ea4335", icon: "M", label: "Gmail", platform: "Email", live: true }, telegram: { color: "#26a5e4", icon: "T", label: "Telegram", platform: "Messenger", live: false }, instagram: { color: "#e1306c", icon: "I", label: "Instagram", platform: "Social", live: false }, youtube: { color: "#ff0000", icon: "Y", label: "YouTube", platform: "Video", live: false }, slack: { color: "#611f69", icon: "S", label: "Slack", platform: "Messenger", live: false }, twitter: { color: "#1da1f2", icon: "X", label: "Twitter/X", platform: "Social", live: true }, filesystem: { color: "#10b981", icon: "F", label: "Local Filesystem", platform: "Files", live: true } }, n = ["gmail", "twitter", "filesystem", "telegram", "instagram", "slack", "youtube"];
  let a = ee(nt([])), o = ee(true), i = ee("gmail");
  async function l() {
    g(o, true);
    try {
      g(a, await pv(), true);
    } catch {
    }
    g(o, false);
  }
  Xt(l);
  const c = "562478245230-1gohf6dtsajqo1lu3kge9k7cthm4sdv6.apps.googleusercontent.com";
  let f = ee(nt(c)), p = ee(nt(c)), m = ee(false), h = ee(false), x = ee(null), b = ee(null), y = ee(null), k = ee(false), D = ee(nt([])), U = ee(0), j = ee(0), M = ee(false), q = ee(""), F = ee(null), P = ee(null), C = ee(null), T = ee(false), N = ee(50), K = ee(false), W = ee(null);
  const A = [50, 100, 200, 500], S = 50;
  function w(Ne) {
    return Ne == null ? "Unknown error" : typeof Ne == "string" ? Ne : (Ne == null ? void 0 : Ne.message) ?? String(Ne);
  }
  const R = V(() => !!s(x)), B = V(() => s(f) === c), Z = V(() => s(D).length < s(U));
  Xt(async () => {
    const Ne = await sr("googleClientId");
    return g(f, Ne || c, true), g(p, Ne || c, true), window.addEventListener("keydown", X), () => {
      window.removeEventListener("keydown", X), s(W) && clearTimeout(s(W));
    };
  });
  function X(Ne) {
    Ne.key === "Escape" && s(F) && g(F, null);
  }
  Ut(() => {
    s(f) && !s(m) && Sl(s(f)).then(async () => {
      g(m, true);
      const Ne = await ba();
      Ne && (g(x, Ne.access_token, true), H(), G());
    }).catch((Ne) => {
      g(y, `Auth init failed: ${w(Ne)}`);
    });
  }), Ut(() => {
    s(x) && (oe(), J());
  });
  function H() {
    s(W) && clearTimeout(s(W));
    const Ne = kl();
    if (Ne <= 0) return;
    const at = Math.max(0, Ne - 120 * 1e3);
    g(W, setTimeout(async () => {
      try {
        const ot = await mu();
        g(x, ot.access_token, true), H();
      } catch {
        g(x, null), g(b, null), g(y, "Session expired. Please sign in again.");
      }
    }, at), true);
  }
  async function te() {
    if (Cc()) return s(x);
    try {
      const Ne = await mu();
      return g(x, Ne.access_token, true), H(), s(x);
    } catch {
      return g(x, null), g(b, null), g(y, "Session expired. Please sign in again."), null;
    }
  }
  async function Y() {
    const Ne = s(p).trim();
    Ne && (await _r("googleClientId", Ne), g(f, Ne, true), g(y, null), g(h, false));
  }
  async function $() {
    g(y, null), g(k, true);
    try {
      s(m) || (await Sl(s(f)), g(m, true));
      const Ne = await Ov();
      g(x, Ne.access_token, true), H(), await G();
    } catch (Ne) {
      g(y, w(Ne), true);
    } finally {
      g(k, false);
    }
  }
  async function O() {
    if (s(W) && clearTimeout(s(W)), s(x)) try {
      await Dv(s(x));
    } catch {
    }
    g(x, null), g(b, null), g(D, [], true), g(U, 0), g(F, null), g(y, null), await ii("gmail-profile");
  }
  async function G() {
    try {
      const Ne = await jg(s(x));
      if (!s(x)) return;
      g(b, Ne, true), await _r("gmail-profile", Ne);
    } catch (Ne) {
      if (!s(x)) return;
      g(y, `Profile fetch failed: ${w(Ne)}`);
    }
  }
  async function J(Ne = false) {
    g(M, true);
    try {
      const at = Ne ? s(j) : 0, ot = await i2({ query: s(q) || void 0, limit: S, offset: at });
      g(D, Ne ? [...s(D), ...ot.items] : ot.items, true), g(U, ot.total, true), g(j, s(D).length, true);
    } catch (at) {
      g(y, `Failed to load messages: ${w(at)}`);
    } finally {
      g(M, false);
    }
  }
  function se() {
    g(j, 0), J(false);
  }
  function ie() {
    J(true);
  }
  async function oe() {
    try {
      g(P, await Wg(), true);
    } catch {
    }
  }
  async function de(Ne) {
    if (s(T) || !s(x)) return;
    const at = await te();
    if (at) {
      g(y, null), g(T, true), g(C, null);
      try {
        await Xw(at, { limit: Ne, onProgress: (ot) => {
          g(C, { ...ot }, true);
        } }), await oe(), await J(false);
      } catch (ot) {
        (ot == null ? void 0 : ot.name) !== "AbortError" && s(x) && g(y, `Sync failed: ${w(ot)}`);
      } finally {
        g(T, false);
      }
    }
  }
  async function ve(Ne) {
    if (s(T) || !s(x)) return;
    const at = await te();
    if (at) {
      g(y, null), g(T, true), g(C, null);
      try {
        await Zw(at, { limit: Ne, onProgress: (ot) => {
          g(C, { ...ot }, true);
        } }), await oe(), await J(false);
      } catch (ot) {
        (ot == null ? void 0 : ot.name) !== "AbortError" && s(x) && g(y, `Sync more failed: ${w(ot)}`);
      } finally {
        g(T, false);
      }
    }
  }
  async function me() {
    try {
      await uv(), await oe(), g(D, [], true), g(U, 0), g(j, 0), g(K, false);
    } catch (Ne) {
      g(y, `Failed to clear data: ${w(Ne)}`);
    }
  }
  function ke(Ne) {
    if (!Ne) return "never";
    const at = Math.floor((Date.now() - Ne) / 1e3);
    if (at < 60) return "just now";
    const ot = Math.floor(at / 60);
    if (ot < 60) return `${ot}m ago`;
    const Qt = Math.floor(ot / 60);
    return Qt < 24 ? `${Qt}h ago` : `${Math.floor(Qt / 24)}d ago`;
  }
  function ye() {
    var _a10, _b4;
    return !((_a10 = s(C)) == null ? void 0 : _a10.total) || !((_b4 = s(C)) == null ? void 0 : _b4.current) ? 0 : Math.round(s(C).current / s(C).total * 100);
  }
  const we = 50;
  let le = ee(""), ce = ee(""), pe = ee(false), ge = ee(null), Te = ee(null), he = ee(null), ue = ee(false), Ee = ee(nt([])), xe = ee(0), Se = ee(0), Fe = ee(false), qe = ee(""), ne = ee(null), fe = ee(null), be = ee(false), _e40 = ee(50), $e = ee(false);
  const Ce = V(() => !!s(ge));
  Xt(async () => {
    const Ne = await sr("twitterClientId");
    if (g(le, Ne || "", true), g(ce, Ne || "", true), s(le) && Qi(s(le)), window.location.hash.includes("oauth-twitter")) {
      const ot = new URL(window.location.href.replace("/#", "/?")), Qt = ot.searchParams.get("code"), ar = ot.searchParams.get("state");
      if (Qt && ar) try {
        const It = await g2(Qt, ar);
        g(ge, It.access_token, true), await Ve(), window.location.hash = "#sources";
      } catch (It) {
        g(he, `Auth failed: ${w(It)}`);
      }
    }
    if (!s(ge)) try {
      const ot = await tm();
      ot && (g(ge, ot.access_token, true), await Ve());
    } catch {
    }
  });
  async function ze() {
    const Ne = s(ce).trim();
    Ne && (await _r("twitterClientId", Ne), g(le, Ne, true), Qi(Ne), g(pe, false));
  }
  async function Re() {
    g(he, null), g(ue, true);
    try {
      if (!s(le)) {
        g(he, "Set your Twitter Client ID first"), g(ue, false);
        return;
      }
      Qi(s(le)), await v2();
    } catch (Ne) {
      g(he, w(Ne), true), g(ue, false);
    }
  }
  async function je() {
    try {
      await h2();
    } catch {
    }
    g(ge, null), g(Te, null), g(Ee, [], true), g(xe, 0), g(he, null), await ii("twitter-profile");
  }
  async function Ve() {
    try {
      const Ne = await Pd(s(ge));
      g(Te, Ne.data, true), await _r("twitter-profile", Ne.data), await dt(), await st(false);
    } catch (Ne) {
      g(he, `Profile fetch failed: ${w(Ne)}`);
    }
  }
  async function st(Ne = false) {
    g(Fe, true);
    try {
      const at = Ne ? s(Se) : 0, ot = s(qe) ? 2e3 : we + at;
      let ar = await ev("twitter", ot, 0) ?? [];
      if (s(qe)) {
        const qt = s(qe).toLowerCase();
        ar = ar.filter((He) => String(He.subject ?? "").toLowerCase().includes(qt) || String(He.body ?? "").toLowerCase().includes(qt) || String(He.from ?? "").toLowerCase().includes(qt));
      }
      const It = s(qe) ? ar.length : Number(await _c("twitter") ?? 0), rr = ar.slice(at, at + we);
      g(Ee, Ne ? [...s(Ee), ...rr] : rr, true), g(xe, It, true), g(Se, s(Ee).length, true);
    } catch (at) {
      g(he, `Failed to load tweets: ${w(at)}`);
    } finally {
      g(Fe, false);
    }
  }
  function gt() {
    g(Se, 0), st(false);
  }
  function Lt() {
    st(true);
  }
  async function dt() {
    try {
      g(ne, await am(), true);
    } catch {
    }
  }
  async function Jt(Ne) {
    if (!(s(be) || !s(ge))) {
      g(he, null), g(be, true), g(fe, null);
      try {
        await y2(s(ge), { limit: Ne, onProgress: (at) => {
          g(fe, { ...at }, true);
        } }), await dt(), await st(false);
      } catch (at) {
        (at == null ? void 0 : at.name) !== "AbortError" && g(he, `Sync failed: ${w(at)}`);
      } finally {
        g(be, false);
      }
    }
  }
  async function Wt(Ne) {
    if (!(s(be) || !s(ge))) {
      g(he, null), g(be, true), g(fe, null);
      try {
        await w2(s(ge), { limit: Ne, onProgress: (at) => {
          g(fe, { ...at }, true);
        } }), await dt(), await st(false);
      } catch (at) {
        (at == null ? void 0 : at.name) !== "AbortError" && g(he, `Sync more failed: ${w(at)}`);
      } finally {
        g(be, false);
      }
    }
  }
  async function Nr() {
    try {
      await k2(), await dt(), g(Ee, [], true), g(xe, 0), g(Se, 0), g($e, false);
    } catch (Ne) {
      g(he, `Failed to clear data: ${w(Ne)}`);
    }
  }
  function Rr() {
    var _a10, _b4;
    return !((_a10 = s(fe)) == null ? void 0 : _a10.total) || !((_b4 = s(fe)) == null ? void 0 : _b4.current) ? 0 : Math.round(s(fe).current / s(fe).total * 100);
  }
  var Nt = o5(), Sr = re(Nt), ra = d(Sr), na = v(d(ra), 2);
  Ln(na, { class: "flex-1", children: (Ne, at) => {
    var ot = hS();
    Ge(ot, 21, () => n, Qe, (Qt, ar) => {
      const It = V(() => r[s(ar)]), rr = V(() => s(i) === s(ar)), qt = V(() => s(It).live), He = V(() => s(qt) && s(R));
      var Q = mS(), Ie = d(Q), Ye = d(Ie), wt = v(Ie, 2), jt = d(wt), Ot = d(jt), Ht = v(jt, 2), ir = d(Ht), lr = v(wt, 2);
      {
        var Bt = (Yt) => {
          var kt = Ae(), nr = re(kt);
          {
            var fr = (pr) => {
              var Ar = pS();
              u(pr, Ar);
            }, Mr = (pr) => {
              var Ar = vS();
              u(pr, Ar);
            };
            I(nr, (pr) => {
              s(He) ? pr(fr) : pr(Mr, -1);
            });
          }
          u(Yt, kt);
        }, mt = (Yt) => {
          var kt = gS();
          u(Yt, kt);
        };
        I(lr, (Yt) => {
          s(qt) ? Yt(Bt) : Yt(mt, -1);
        });
      }
      L((Yt, kt) => {
        Q.disabled = !s(qt), rt(Q, 1, Yt), Rt(Ie, `background:${s(It).color ?? ""}18; color:${s(It).color ?? ""};`), E(Ye, s(It).icon), rt(jt, 1, kt), E(Ot, s(It).label), E(ir, s(It).platform);
      }, [() => Et(Je("w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-colors", s(rr) && s(qt) ? "bg-sidebar-accent border border-primary/20" : s(qt) ? "hover:bg-sidebar-accent/60 border border-transparent" : "opacity-40 cursor-default border border-transparent")), () => Et(Je("text-sm font-medium truncate", s(rr) && s(qt) ? "text-foreground" : "text-foreground/80"))]), Pe("click", Q, () => g(i, s(ar), true)), u(Qt, Q);
    }), u(Ne, ot);
  }, $$slots: { default: true } });
  var ka = v(ra, 2), Ka = d(ka);
  {
    var Xa = (Ne) => {
      var at = Ae(), ot = re(at);
      {
        var Qt = (It) => {
          var rr = $S(), qt = re(rr), He = d(qt), Q = d(He), Ie = d(Q), Ye = v(Q, 2), wt = d(Ye), jt = v(He, 2), Ot = d(jt);
          {
            var Ht = (Ue) => {
              var it = _S(), ft = d(it);
              L(() => E(ft, s(C).message || "Syncing\u2026")), u(Ue, it);
            }, ir = (Ue) => {
              var it = bS(), ft = d(it);
              L((Pt, er) => E(ft, `${Pt ?? ""} emails \xB7 ${er ?? ""}`), [() => s(P).totalItems.toLocaleString(), () => ke(s(P).lastSyncAt)]), u(Ue, it);
            };
            I(Ot, (Ue) => {
              var _a10;
              s(T) && s(C) ? Ue(Ht) : ((_a10 = s(P)) == null ? void 0 : _a10.synced) && Ue(ir, 1);
            });
          }
          var lr = v(Ot, 2);
          Ge(lr, 21, () => A, Qe, (Ue, it) => {
            var ft = xS(), Pt = d(ft), er = {};
            L(() => {
              E(Pt, s(it)), er !== (er = s(it)) && (ft.value = (ft.__value = s(it)) ?? "");
            }), u(Ue, ft);
          });
          var Bt = v(lr, 2);
          tt(Bt, { size: "sm", onclick: () => de(s(N)), get disabled() {
            return s(T);
          }, class: "h-7 gap-1.5 text-xs", children: (Ue, it) => {
            var ft = yS(), Pt = re(ft);
            {
              let or = V(() => Je("size-3", s(T) && "animate-spin"));
              ms(Pt, { get class() {
                return s(or);
              } });
            }
            var er = v(Pt);
            L(() => {
              var _a10;
              return E(er, ` ${s(T) ? "Syncing\u2026" : ((_a10 = s(P)) == null ? void 0 : _a10.synced) ? "Sync New" : "Download"}`);
            }), u(Ue, ft);
          }, $$slots: { default: true } });
          var mt = v(Bt, 2);
          {
            var Yt = (Ue) => {
              tt(Ue, { variant: "outline", size: "sm", onclick: () => ve(s(N)), get disabled() {
                return s(T);
              }, class: "h-7 text-xs", children: (it, ft) => {
                var Pt = Be("More");
                u(it, Pt);
              }, $$slots: { default: true } });
            };
            I(mt, (Ue) => {
              var _a10;
              ((_a10 = s(P)) == null ? void 0 : _a10.synced) && s(P).hasMore && Ue(Yt);
            });
          }
          var kt = v(mt, 2), nr = d(kt);
          Iu(nr, { class: "size-3.5" });
          var fr = v(qt, 2);
          {
            var Mr = (Ue) => {
              {
                let it = V(ye);
                Hl(Ue, { get value() {
                  return s(it);
                }, class: "h-0.5 rounded-none" });
              }
            };
            I(fr, (Ue) => {
              var _a10;
              s(T) && ((_a10 = s(C)) == null ? void 0 : _a10.total) && Ue(Mr);
            });
          }
          var pr = v(fr, 2);
          {
            var Ar = (Ue) => {
              var it = wS(), ft = d(it), Pt = d(ft), er = v(ft, 2);
              L(() => E(Pt, s(y))), Pe("click", er, () => g(y, null)), u(Ue, it);
            };
            I(pr, (Ue) => {
              s(y) && Ue(Ar);
            });
          }
          var fn = v(pr, 2), Za = d(fn), jn = d(Za);
          Qo(jn, { class: "absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/40 pointer-events-none" });
          var Oi = v(jn, 2);
          Pn(Oi, { type: "text", placeholder: "Search subjects, senders, or snippets\u2026", onkeydown: (Ue) => Ue.key === "Enter" && se(), class: "pl-9 h-8 text-sm", get value() {
            return s(q);
          }, set value(Ue) {
            g(q, Ue, true);
          } });
          var xo = v(Za, 2);
          tt(xo, { onclick: se, get disabled() {
            return s(M);
          }, variant: "outline", size: "sm", class: "shrink-0 h-8", children: (Ue, it) => {
            var ft = Be();
            L(() => E(ft, s(M) ? "\u2026" : "Search")), u(Ue, ft);
          }, $$slots: { default: true } });
          var yo = v(xo, 2);
          {
            var Di = (Ue) => {
              var it = kS(), ft = d(it);
              L((Pt) => E(ft, `${s(D).length ?? ""} of ${Pt ?? ""}`), [() => s(U).toLocaleString()]), u(Ue, it);
            };
            I(yo, (Ue) => {
              s(U) > 0 && Ue(Di);
            });
          }
          var wo = v(fn, 2), Li = d(wo), ji = d(Li);
          {
            var Bi = (Ue) => {
              var it = TS(), ft = re(it);
              Wu(ft, { get messages() {
                return s(D);
              }, onselect: (or) => g(F, or, true) });
              var Pt = v(ft, 2);
              {
                var er = (or) => {
                  var Wr = SS(), pn = d(Wr);
                  tt(pn, { variant: "outline", onclick: ie, get disabled() {
                    return s(M);
                  }, children: (aa, sa) => {
                    var ko = Be();
                    L(() => E(ko, s(M) ? "Loading\u2026" : "Load More")), u(aa, ko);
                  }, $$slots: { default: true } }), u(or, Wr);
                };
                I(Pt, (or) => {
                  s(Z) && or(er);
                });
              }
              u(Ue, it);
            }, Fi = (Ue) => {
              var it = AS();
              u(Ue, it);
            }, Ui = (Ue) => {
              var it = ES(), ft = d(it);
              $l(ft, { class: "size-8 text-muted-foreground/15" });
              var Pt = v(ft, 2), er = d(Pt);
              L(() => E(er, s(q) ? `No emails match "${s(q)}"` : "No emails synced yet \u2014 click Download above")), u(Ue, it);
            };
            I(ji, (Ue) => {
              s(D).length > 0 ? Ue(Bi) : s(M) ? Ue(Fi, 1) : Ue(Ui, -1);
            });
          }
          var lt = v(wo, 2);
          {
            var Tt = (Ue) => {
              var it = PS(), ft = d(it);
              {
                var Pt = (or) => {
                  var Wr = CS(), pn = v(d(Wr), 2);
                  tt(pn, { variant: "destructive", size: "sm", onclick: me, class: "h-6 text-xs px-2", children: (sa, ko) => {
                    var Gi = Be("Delete");
                    u(sa, Gi);
                  }, $$slots: { default: true } });
                  var aa = v(pn, 2);
                  tt(aa, { variant: "outline", size: "sm", onclick: () => g(K, false), class: "h-6 text-xs px-2", children: (sa, ko) => {
                    var Gi = Be("Cancel");
                    u(sa, Gi);
                  }, $$slots: { default: true } }), u(or, Wr);
                }, er = (or) => {
                  var Wr = IS(), pn = d(Wr);
                  ei(pn, { class: "size-3" }), Pe("click", Wr, () => g(K, true)), u(or, Wr);
                };
                I(ft, (or) => {
                  s(K) ? or(Pt) : or(er, -1);
                });
              }
              u(Ue, it);
            };
            I(lt, (Ue) => {
              var _a10;
              ((_a10 = s(P)) == null ? void 0 : _a10.synced) && Ue(Tt);
            });
          }
          L((Ue) => {
            var _a10;
            E(Ie, Ue), E(wt, ((_a10 = s(b)) == null ? void 0 : _a10.emailAddress) ?? "Gmail"), lr.disabled = s(T);
          }, [() => {
            var _a10, _b4, _c6;
            return ((_c6 = (_b4 = (_a10 = s(b)) == null ? void 0 : _a10.emailAddress) == null ? void 0 : _b4[0]) == null ? void 0 : _c6.toUpperCase()) ?? "G";
          }]), Rn(lr, () => s(N), (Ue) => g(N, Ue)), Pe("click", kt, O), u(It, rr);
        }, ar = (It) => {
          var rr = DS(), qt = v(d(rr), 4);
          {
            var He = (Bt) => {
              var mt = NS(), Yt = d(mt);
              L(() => E(Yt, s(y))), u(Bt, mt);
            };
            I(qt, (Bt) => {
              s(y) && Bt(He);
            });
          }
          var Q = v(qt, 2), Ie = d(Q), Ye = d(Ie);
          {
            var wt = (Bt) => {
              var mt = RS();
              u(Bt, mt);
            }, jt = (Bt) => {
              var mt = MS();
              u(Bt, mt);
            };
            I(Ye, (Bt) => {
              s(k) ? Bt(wt) : Bt(jt, -1);
            });
          }
          var Ot = v(Q, 2), Ht = d(Ot);
          {
            var ir = (Bt) => {
              var mt = zS(), Yt = d(mt), kt = d(Yt), nr = v(Yt, 2);
              L((fr) => E(kt, `Client ID: ${fr ?? ""}`), [() => s(B) ? "shared default" : s(f).slice(0, 16) + "\u2026"]), Pe("click", nr, () => g(h, true)), u(Bt, mt);
            }, lr = (Bt) => {
              var mt = OS(), Yt = d(mt);
              Pn(Yt, { placeholder: "Paste your Client ID\u2026", class: "h-8 text-xs font-mono", get value() {
                return s(p);
              }, set value(Mr) {
                g(p, Mr, true);
              } });
              var kt = v(Yt, 2), nr = d(kt);
              tt(nr, { size: "sm", onclick: Y, class: "flex-1 h-7 text-xs", children: (Mr, pr) => {
                var Ar = Be("Save");
                u(Mr, Ar);
              }, $$slots: { default: true } });
              var fr = v(nr, 2);
              tt(fr, { variant: "outline", size: "sm", onclick: () => g(h, false), class: "flex-1 h-7 text-xs", children: (Mr, pr) => {
                var Ar = Be("Cancel");
                u(Mr, Ar);
              }, $$slots: { default: true } }), u(Bt, mt);
            };
            I(Ht, (Bt) => {
              s(h) ? Bt(lr, -1) : Bt(ir);
            });
          }
          L(() => Ie.disabled = s(k)), Pe("click", Ie, $), u(It, rr);
        };
        I(ot, (It) => {
          s(R) ? It(Qt) : It(ar, -1);
        });
      }
      u(Ne, at);
    }, xt = (Ne) => {
      var at = Ae(), ot = re(at);
      {
        var Qt = (It) => {
          var rr = ZS(), qt = re(rr), He = d(qt), Q = v(d(He), 2), Ie = d(Q), Ye = v(He, 2), wt = d(Ye);
          {
            var jt = (lt) => {
              var Tt = LS(), Ue = d(Tt);
              L(() => E(Ue, s(fe).message || "Syncing\u2026")), u(lt, Tt);
            }, Ot = (lt) => {
              var Tt = jS(), Ue = d(Tt);
              L((it, ft) => E(Ue, `${it ?? ""} tweets \xB7 ${ft ?? ""}`), [() => s(ne).totalItems.toLocaleString(), () => ke(s(ne).lastSyncAt)]), u(lt, Tt);
            };
            I(wt, (lt) => {
              var _a10;
              s(be) && s(fe) ? lt(jt) : ((_a10 = s(ne)) == null ? void 0 : _a10.synced) && lt(Ot, 1);
            });
          }
          var Ht = v(wt, 2);
          Ge(Ht, 21, () => A, Qe, (lt, Tt) => {
            var Ue = BS(), it = d(Ue), ft = {};
            L(() => {
              E(it, s(Tt)), ft !== (ft = s(Tt)) && (Ue.value = (Ue.__value = s(Tt)) ?? "");
            }), u(lt, Ue);
          });
          var ir = v(Ht, 2);
          tt(ir, { size: "sm", onclick: () => Jt(s(_e40)), get disabled() {
            return s(be);
          }, class: "h-7 gap-1.5 text-xs", children: (lt, Tt) => {
            var Ue = FS(), it = re(Ue);
            {
              let Pt = V(() => Je("size-3", s(be) && "animate-spin"));
              ms(it, { get class() {
                return s(Pt);
              } });
            }
            var ft = v(it);
            L(() => {
              var _a10;
              return E(ft, ` ${s(be) ? "Syncing\u2026" : ((_a10 = s(ne)) == null ? void 0 : _a10.synced) ? "Sync New" : "Download"}`);
            }), u(lt, Ue);
          }, $$slots: { default: true } });
          var lr = v(ir, 2);
          {
            var Bt = (lt) => {
              tt(lt, { variant: "outline", size: "sm", onclick: () => Wt(s(_e40)), get disabled() {
                return s(be);
              }, class: "h-7 text-xs", children: (Tt, Ue) => {
                var it = Be("More");
                u(Tt, it);
              }, $$slots: { default: true } });
            };
            I(lr, (lt) => {
              var _a10;
              ((_a10 = s(ne)) == null ? void 0 : _a10.synced) && s(ne).hasMore && lt(Bt);
            });
          }
          var mt = v(lr, 2), Yt = d(mt);
          Iu(Yt, { class: "size-3.5" });
          var kt = v(qt, 2);
          {
            var nr = (lt) => {
              {
                let Tt = V(Rr);
                Hl(lt, { get value() {
                  return s(Tt);
                }, class: "h-0.5 rounded-none" });
              }
            };
            I(kt, (lt) => {
              var _a10;
              s(be) && ((_a10 = s(fe)) == null ? void 0 : _a10.total) && lt(nr);
            });
          }
          var fr = v(kt, 2);
          {
            var Mr = (lt) => {
              var Tt = US(), Ue = d(Tt), it = d(Ue), ft = v(Ue, 2);
              L(() => E(it, s(he))), Pe("click", ft, () => g(he, null)), u(lt, Tt);
            };
            I(fr, (lt) => {
              s(he) && lt(Mr);
            });
          }
          var pr = v(fr, 2), Ar = d(pr), fn = d(Ar);
          Qo(fn, { class: "absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/40 pointer-events-none" });
          var Za = v(fn, 2);
          Pn(Za, { type: "text", placeholder: "Search tweets\u2026", onkeydown: (lt) => lt.key === "Enter" && gt(), class: "pl-9 h-8 text-sm", get value() {
            return s(qe);
          }, set value(lt) {
            g(qe, lt, true);
          } });
          var jn = v(Ar, 2);
          tt(jn, { onclick: gt, get disabled() {
            return s(Fe);
          }, variant: "outline", size: "sm", class: "shrink-0 h-8", children: (lt, Tt) => {
            var Ue = Be();
            L(() => E(Ue, s(Fe) ? "\u2026" : "Search")), u(lt, Ue);
          }, $$slots: { default: true } });
          var Oi = v(jn, 2);
          {
            var xo = (lt) => {
              var Tt = GS(), Ue = d(Tt);
              L((it) => E(Ue, `${s(Ee).length ?? ""} of ${it ?? ""}`), [() => s(xe).toLocaleString()]), u(lt, Tt);
            };
            I(Oi, (lt) => {
              s(xe) > 0 && lt(xo);
            });
          }
          var yo = v(pr, 2), Di = d(yo), wo = d(Di);
          {
            var Li = (lt) => {
              var Tt = VS(), Ue = re(Tt);
              Wu(Ue, { get messages() {
                return s(Ee);
              }, onselect: (Pt) => g(F, Pt, true) });
              var it = v(Ue, 2);
              {
                var ft = (Pt) => {
                  var er = WS(), or = d(er);
                  tt(or, { variant: "outline", onclick: Lt, get disabled() {
                    return s(Fe);
                  }, children: (Wr, pn) => {
                    var aa = Be();
                    L(() => E(aa, s(Fe) ? "Loading\u2026" : "Load More")), u(Wr, aa);
                  }, $$slots: { default: true } }), u(Pt, er);
                };
                I(it, (Pt) => {
                  s(Ee).length < s(xe) && Pt(ft);
                });
              }
              u(lt, Tt);
            }, ji = (lt) => {
              var Tt = HS();
              u(lt, Tt);
            }, Bi = (lt) => {
              var Tt = qS(), Ue = d(Tt);
              $l(Ue, { class: "size-8 text-muted-foreground/15" });
              var it = v(Ue, 2), ft = d(it);
              L(() => E(ft, s(qe) ? `No tweets match "${s(qe)}"` : "No tweets synced yet \u2014 click Download above")), u(lt, Tt);
            };
            I(wo, (lt) => {
              s(Ee).length > 0 ? lt(Li) : s(Fe) ? lt(ji, 1) : lt(Bi, -1);
            });
          }
          var Fi = v(yo, 2);
          {
            var Ui = (lt) => {
              var Tt = XS(), Ue = d(Tt);
              {
                var it = (Pt) => {
                  var er = YS(), or = v(d(er), 2);
                  tt(or, { variant: "destructive", size: "sm", onclick: Nr, class: "h-6 text-xs px-2", children: (pn, aa) => {
                    var sa = Be("Delete");
                    u(pn, sa);
                  }, $$slots: { default: true } });
                  var Wr = v(or, 2);
                  tt(Wr, { variant: "outline", size: "sm", onclick: () => g($e, false), class: "h-6 text-xs px-2", children: (pn, aa) => {
                    var sa = Be("Cancel");
                    u(pn, sa);
                  }, $$slots: { default: true } }), u(Pt, er);
                }, ft = (Pt) => {
                  var er = KS(), or = d(er);
                  ei(or, { class: "size-3" }), Pe("click", er, () => g($e, true)), u(Pt, er);
                };
                I(Ue, (Pt) => {
                  s($e) ? Pt(it) : Pt(ft, -1);
                });
              }
              u(lt, Tt);
            };
            I(Fi, (lt) => {
              var _a10;
              ((_a10 = s(ne)) == null ? void 0 : _a10.synced) && lt(Ui);
            });
          }
          L(() => {
            var _a10;
            E(Ie, `@${((_a10 = s(Te)) == null ? void 0 : _a10.username) ?? "Twitter" ?? ""}`), Ht.disabled = s(be);
          }), Rn(Ht, () => s(_e40), (lt) => g(_e40, lt)), Pe("click", mt, je), u(It, rr);
        }, ar = (It) => {
          var rr = n5(), qt = v(d(rr), 2), He = v(d(qt), 4), Q = v(d(He), 5);
          Q.textContent = `${window.location.origin ?? ""}/#oauth-twitter`;
          var Ie = v(qt, 2);
          {
            var Ye = (kt) => {
              var nr = JS(), fr = d(nr);
              L(() => E(fr, s(he))), u(kt, nr);
            };
            I(Ie, (kt) => {
              s(he) && kt(Ye);
            });
          }
          var wt = v(Ie, 2), jt = d(wt), Ot = d(jt);
          {
            var Ht = (kt) => {
              var nr = QS();
              u(kt, nr);
            }, ir = (kt) => {
              var nr = e5();
              u(kt, nr);
            };
            I(Ot, (kt) => {
              s(ue) ? kt(Ht) : kt(ir, -1);
            });
          }
          var lr = v(wt, 2), Bt = d(lr);
          {
            var mt = (kt) => {
              var nr = t5(), fr = d(nr), Mr = d(fr), pr = v(fr, 2);
              L((Ar) => E(Mr, `Client ID: ${Ar ?? ""}`), [() => s(le) ? s(le).slice(0, 16) + "\u2026" : "not set"]), Pe("click", pr, () => g(pe, true)), u(kt, nr);
            }, Yt = (kt) => {
              var nr = r5(), fr = d(nr);
              Pn(fr, { placeholder: "Paste your Twitter Client ID\u2026", class: "h-8 text-xs font-mono", get value() {
                return s(ce);
              }, set value(fn) {
                g(ce, fn, true);
              } });
              var Mr = v(fr, 2), pr = d(Mr);
              tt(pr, { size: "sm", onclick: ze, class: "flex-1 h-7 text-xs", children: (fn, Za) => {
                var jn = Be("Save");
                u(fn, jn);
              }, $$slots: { default: true } });
              var Ar = v(pr, 2);
              tt(Ar, { variant: "outline", size: "sm", onclick: () => g(pe, false), class: "flex-1 h-7 text-xs", children: (fn, Za) => {
                var jn = Be("Cancel");
                u(fn, jn);
              }, $$slots: { default: true } }), u(kt, nr);
            };
            I(Bt, (kt) => {
              s(pe) ? kt(Yt, -1) : kt(mt);
            });
          }
          L(() => jt.disabled = s(ue)), Pe("click", jt, Re), u(It, rr);
        };
        I(ot, (It) => {
          s(Ce) ? It(Qt) : It(ar, -1);
        });
      }
      u(Ne, at);
    }, Ft = (Ne) => {
      var at = a5(), ot = v(d(at), 2), Qt = d(ot), ar = v(d(Qt), 2), It = d(ar);
      ym(It, {}), u(Ne, at);
    }, ur = (Ne) => {
      const at = V(() => r[s(i)]);
      var ot = s5(), Qt = d(ot), ar = d(Qt), It = v(Qt, 2), rr = d(It), qt = d(rr), He = v(rr, 2), Q = d(He);
      L(() => {
        var _a10, _b4, _c6, _d4, _e41;
        Rt(Qt, `background:${((_a10 = s(at)) == null ? void 0 : _a10.color) ?? "#888" ?? ""}18; color:${((_b4 = s(at)) == null ? void 0 : _b4.color) ?? "#888" ?? ""};`), E(ar, ((_c6 = s(at)) == null ? void 0 : _c6.icon) ?? "?"), E(qt, ((_d4 = s(at)) == null ? void 0 : _d4.label) ?? s(i)), E(Q, (_e41 = s(at)) == null ? void 0 : _e41.platform);
      }), u(Ne, ot);
    };
    I(Ka, (Ne) => {
      s(i) === "gmail" ? Ne(Xa) : s(i) === "twitter" ? Ne(xt, 1) : s(i) === "filesystem" ? Ne(Ft, 2) : Ne(ur, -1);
    });
  }
  var kn = v(Sr, 2);
  {
    var Sa = (Ne) => {
      var at = Ae(), ot = re(at);
      Zh(ot, () => s(F).id || s(F).messageId || "modal", (Qt) => {
        sS(Qt, { get message() {
          return s(F);
        }, loading: false, onclose: () => g(F, null) });
      }), u(Ne, at);
    };
    I(kn, (Ne) => {
      s(F) && Ne(Sa);
    });
  }
  u(t, Nt), Le();
}
Zt(["click"]);
function ql(t, e) {
  De(e, true);
  let r = ae(e, "ref", 15, null), n = ae(e, "checked", 15, false), a = ut(e, ["$$slots", "$$events", "$$legacy", "ref", "class", "checked"]);
  var o = Ae(), i = re(o);
  {
    let l = V(() => Je("data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 peer inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50", e.class));
    dr(i, () => cy, (c, f) => {
      f(c, et({ "data-slot": "switch", get class() {
        return s(l);
      } }, () => a, { get ref() {
        return r();
      }, set ref(p) {
        r(p);
      }, get checked() {
        return n();
      }, set checked(p) {
        n(p);
      }, children: (p, m) => {
        var h = Ae(), x = re(h);
        {
          let b = V(() => Je("bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0"));
          dr(x, () => uy, (y, k) => {
            k(y, { "data-slot": "switch-thumb", get class() {
              return s(b);
            } });
          });
        }
        u(p, h);
      }, $$slots: { default: true } }));
    });
  }
  u(t, o), Le();
}
var l5 = _('<div class="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground"><div class="size-5 rounded-full border-2 border-border border-t-primary animate-spin"></div> <span class="text-xs">Loading plugins\u2026</span></div>'), c5 = _('<div class="flex flex-col gap-1 pt-2 border-t border-border/40"><span class="text-[0.6rem] font-bold uppercase tracking-wider text-muted-foreground/40">Actions</span> <div class="flex flex-wrap gap-1"></div></div>'), d5 = _('<div class="flex flex-col gap-1 pt-2 border-t border-border/40"><span class="text-[0.6rem] font-bold uppercase tracking-wider text-muted-foreground/40">Handles</span> <div class="flex flex-wrap gap-1"></div></div>'), u5 = _('<div><div class="flex items-start gap-2.5"><div class="size-8 rounded flex items-center justify-center text-sm font-black shrink-0"> </div> <div class="flex-1 min-w-0"><div class="flex items-baseline gap-1.5 mb-0.5"><span class="text-sm font-semibold text-foreground"> </span> <code class="text-[0.62rem] text-muted-foreground/50 font-mono"> </code></div> <span class="text-xs text-muted-foreground"> </span></div> <div class="shrink-0"><!></div></div> <!> <!></div>'), f5 = _(`<div class="flex flex-col gap-3"><div class="grid gap-2" style="grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));"></div> <div class="flex items-start gap-2.5 px-3.5 py-3 rounded border border-border/40 bg-muted/20 text-muted-foreground mt-1"><!> <p class="text-xs leading-relaxed">Plugins provide Actions and handle Sources. Disabling a plugin makes all its actions
            unavailable at runtime \u2014 existing rules that reference those actions will be skipped.
            The <strong class="text-muted-foreground/80">AI Classifier</strong> plugin is always active; it runs before all rules
            and assigns EventType + EventCategory to every incoming event.</p></div></div>`), p5 = _('<div class="flex flex-col h-full overflow-hidden"><div class="px-8 pt-5 pb-4 shrink-0 border-b border-border"><div class="flex items-center gap-2 mb-0.5"><h1 class="text-sm font-semibold tracking-tight text-foreground">Plugins</h1> <span class="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground/50">/ registry</span></div> <p class="text-xs text-muted-foreground"> </p></div> <!></div>');
function v5(t, e) {
  De(e, true);
  let r = ee(nt([])), n = ee(true);
  const a = { gmail_plugin: { color: "#ea4335", icon: "G", desc: "Gmail email management" }, telegram_plugin: { color: "#26a5e4", icon: "T", desc: "Telegram messaging" }, instagram_plugin: { color: "#e1306c", icon: "I", desc: "Instagram interactions" }, ai_summarizer: { color: "#8b5cf6", icon: "\u2211", desc: "AI-powered content summarization" }, notifier: { color: "#f59e0b", icon: "N", desc: "User notifications and escalation" }, ai_classifier: { color: "#10b981", icon: "C", desc: "AI event classification (runs first on all events)" } };
  async function o() {
    g(n, true);
    try {
      g(r, await vv(), true);
    } catch (h) {
      console.error("PluginsView load error:", h);
    }
    g(n, false);
  }
  Xt(o);
  async function i(h) {
    h.name !== "ai_classifier" && (await Ev(h.name, !h.enabled), h.enabled = !h.enabled);
  }
  var l = p5(), c = d(l), f = v(d(c), 2), p = d(f), m = v(c, 2);
  Ln(m, { class: "flex-1 px-8 pb-6", children: (h, x) => {
    var b = Ae(), y = re(b);
    {
      var k = (U) => {
        var j = l5();
        u(U, j);
      }, D = (U) => {
        var j = f5(), M = d(j);
        Ge(M, 23, () => s(r), (P, C) => P.name ?? `plugin-${C}`, (P, C) => {
          const T = V(() => a[s(C).name] ?? { color: "#6366f1", icon: "P", desc: "" });
          var N = u5(), K = d(N), W = d(K), A = d(W), S = v(W, 2), w = d(S), R = d(w), B = d(R), Z = v(R, 2), X = d(Z), H = v(w, 2), te = d(H), Y = v(S, 2), $ = d(Y);
          {
            var O = (de) => {
              Cr(de, { variant: "default", class: "text-xs", children: (ve, me) => {
                var ke = Be("System");
                u(ve, ke);
              }, $$slots: { default: true } });
            }, G = (de) => {
              {
                let ve = V(() => s(C).enabled ? `Disable ${s(C).label}` : `Enable ${s(C).label}`);
                ql(de, { get checked() {
                  return s(C).enabled;
                }, onCheckedChange: () => i(s(C)), get "aria-label"() {
                  return s(ve);
                } });
              }
            };
            I($, (de) => {
              s(C).name === "ai_classifier" ? de(O) : de(G, -1);
            });
          }
          var J = v(K, 2);
          {
            var se = (de) => {
              var ve = c5(), me = v(d(ve), 2);
              Ge(me, 21, () => s(C).actions, Qe, (ke, ye) => {
                Cr(ke, { variant: "secondary", class: "text-xs px-1.5 h-4", children: (we, le) => {
                  var ce = Be();
                  L(() => E(ce, s(ye).label)), u(we, ce);
                }, $$slots: { default: true } });
              }), u(de, ve);
            };
            I(J, (de) => {
              var _a10;
              ((_a10 = s(C).actions) == null ? void 0 : _a10.length) && de(se);
            });
          }
          var ie = v(J, 2);
          {
            var oe = (de) => {
              var ve = d5(), me = v(d(ve), 2);
              Ge(me, 21, () => s(C).sources, Qe, (ke, ye) => {
                Cr(ke, { variant: "outline", class: "text-xs px-1.5 h-4", children: (we, le) => {
                  var ce = Be();
                  L(() => E(ce, s(ye).label)), u(we, ce);
                }, $$slots: { default: true } });
              }), u(de, ve);
            };
            I(ie, (de) => {
              var _a10;
              ((_a10 = s(C).sources) == null ? void 0 : _a10.length) && de(oe);
            });
          }
          L((de) => {
            rt(N, 1, de), Rt(W, `background:${s(T).color ?? ""}15;color:${s(T).color ?? ""};`), E(A, s(T).icon), E(B, s(C).label), E(X, `v${s(C).version ?? ""}`), E(te, s(T).desc);
          }, [() => Et(Je("flex flex-col gap-2.5 p-3.5 rounded border bg-card transition-colors", "border-border/50 hover:border-border", !s(C).enabled && "opacity-50"))]), u(P, N);
        });
        var q = v(M, 2), F = d(q);
        Ex(F, { class: "size-3.5 shrink-0 mt-0.5 opacity-60" }), u(U, j);
      };
      I(y, (U) => {
        s(n) ? U(k) : U(D, -1);
      });
    }
    u(h, b);
  }, $$slots: { default: true } }), L((h) => E(p, `${h ?? ""} active \u2014 plugins provide actions and handle sources.`), [() => s(r).filter((h) => h.enabled).length]), u(t, l), Le();
}
var g5 = _('<div class="flex items-center justify-center py-16 text-muted-foreground gap-3"><div class="size-4 rounded-full border-2 border-border border-t-primary animate-spin"></div> <span class="text-xs">Scanning cache\u2026</span></div>'), m5 = _('<div class="flex items-center gap-2 text-amber-500/70 text-xs py-8"><!> Cache API is not available in this browser.</div>'), h5 = _('<span class="text-[0.6rem] text-muted-foreground/40 bg-muted/30 px-1.5 py-0.5 rounded font-mono"> </span>'), _5 = _('<p class="text-xs text-muted-foreground/50 py-4">No models cached yet.</p>'), b5 = _('<span class="text-muted-foreground/30"> </span>'), x5 = _('<span class="text-[0.7rem] text-muted-foreground/60 mr-1">Delete?</span> <button class="text-[0.7rem] text-muted-foreground/60 hover:text-foreground underline transition-colors">Cancel</button> <button class="text-[0.7rem] text-destructive hover:text-destructive/80 underline font-medium ml-2 disabled:opacity-40 transition-colors">Delete</button>', 1), y5 = _('<div class="size-3 rounded-full border border-border border-t-foreground animate-spin"></div>'), w5 = _('<div><div class="flex items-start gap-3 px-4 py-3"><div class="shrink-0 mt-0.5"><!></div> <div class="flex-1 min-w-0"><div class="flex items-center gap-2 flex-wrap"><span class="text-xs font-medium text-foreground"> </span> <!></div> <p class="text-[0.65rem] font-mono text-muted-foreground/40 mt-0.5 truncate"> </p> <div class="flex items-center gap-3 mt-1.5 flex-wrap"><span class="text-[0.65rem] text-muted-foreground/50 flex items-center gap-1"><!> <!></span> <span class="text-[0.65rem] text-muted-foreground/40"> </span></div></div> <div class="shrink-0 flex items-center gap-1"><!></div></div></div>'), k5 = _('<div class="flex flex-col gap-2"></div>'), S5 = _('<div class="flex items-center gap-3 px-4 py-2.5 rounded border border-border/30 bg-muted/5 opacity-60"><!> <div class="flex-1 min-w-0"><span class="text-xs text-muted-foreground/60"> </span> <span class="text-[0.65rem] text-muted-foreground/30 ml-2"> </span></div> <span class="text-[0.6rem] text-muted-foreground/30 font-mono truncate max-w-[140px]"> </span></div>'), T5 = _('<section class="flex flex-col gap-3"><h2 class="text-xs font-semibold tracking-tight text-muted-foreground/50">Available but not downloaded</h2> <div class="flex flex-col gap-1"></div></section>'), A5 = _(`<div class="flex items-start gap-2 px-3 py-2.5 rounded border border-border/20 bg-muted/10 text-[0.65rem] text-muted-foreground/40"><!> <span>Models are stored in the browser's <code class="font-mono">Cache API</code> (not OPFS).
              Deleting a model here only removes the cached weights \u2014 you can re-download it by loading it in the Chat view.</span></div>`), E5 = _('<div class="flex flex-col gap-8 max-w-2xl"><section class="flex flex-col gap-3"><div class="flex items-center gap-2"><h2 class="text-xs font-semibold tracking-tight text-foreground">Downloaded</h2> <!></div> <!></section> <!> <!></div>'), C5 = _('<div class="flex flex-col h-full overflow-hidden"><div class="flex items-center justify-between px-8 pt-5 pb-4 shrink-0 border-b border-border"><div><div class="flex items-center gap-2 mb-0.5"><h1 class="text-sm font-semibold tracking-tight text-foreground">Local Models</h1> <span class="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground/50">/ cache</span></div> <p class="text-xs text-muted-foreground">ONNX model weights cached in the browser via Transformers.js (<code class="font-mono text-[0.65rem]">transformers-cache</code>).</p></div> <!></div> <!></div>');
function I5(t, e) {
  De(e, true);
  const r = "transformers-cache", n = "https://huggingface.co/";
  let a = ee(nt([])), o = ee(nt([])), i = ee(true), l = ee(null), c = ee(null), f = ee(true);
  function p(U) {
    return U === 0 ? "\u2014" : U < 1024 ? `${U} B` : U < 1024 * 1024 ? `${(U / 1024).toFixed(1)} KB` : U < 1024 * 1024 * 1024 ? `${(U / (1024 * 1024)).toFixed(1)} MB` : `${(U / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  }
  function m(U) {
    if (!U.startsWith(n)) return null;
    const j = U.slice(n.length), M = j.indexOf("/resolve/");
    return M === -1 ? null : j.slice(0, M);
  }
  async function h() {
    g(i, true);
    try {
      if (!("caches" in window)) {
        g(f, false);
        return;
      }
      const U = await caches.open(r), j = await U.keys(), M = /* @__PURE__ */ new Map();
      for (const P of j) {
        const C = m(P.url);
        if (!C) continue;
        M.has(C) || M.set(C, []);
        let T = 0;
        try {
          const N = await U.match(P);
          N && (T = (await N.blob()).size);
        } catch {
        }
        M.get(C).push({ url: P.url, bytes: T });
      }
      const q = new Set(M.keys()), F = [];
      for (const [P, C] of M) {
        const T = ea.find((N) => N.id === P);
        F.push({ id: P, name: (T == null ? void 0 : T.name) ?? null, declaredSize: (T == null ? void 0 : T.size) ?? null, files: C, totalBytes: C.reduce((N, K) => N + K.bytes, 0), isKnown: !!T });
      }
      F.sort((P, C) => P.isKnown !== C.isKnown ? P.isKnown ? -1 : 1 : (P.name ?? P.id).localeCompare(C.name ?? C.id)), g(a, F, true), g(o, ea.filter((P) => !q.has(P.id)), true);
    } finally {
      g(i, false);
    }
  }
  async function x(U) {
    g(l, U, true), g(c, null);
    try {
      const j = await caches.open(r), M = await j.keys();
      await Promise.all(M.filter((q) => m(q.url) === U).map((q) => j.delete(q))), await h();
    } finally {
      g(l, null);
    }
  }
  Xt(h);
  var b = C5(), y = d(b), k = v(d(y), 2);
  {
    let U = V(() => Je(s(i) && "[&_svg]:animate-spin"));
    tt(k, { variant: "ghost", size: "icon-sm", onclick: h, title: "Refresh", get class() {
      return s(U);
    }, children: (j, M) => {
      ms(j, { class: "size-3.5" });
    }, $$slots: { default: true } });
  }
  var D = v(y, 2);
  Ln(D, { class: "flex-1 min-h-0 px-8 py-6", children: (U, j) => {
    var M = Ae(), q = re(M);
    {
      var F = (T) => {
        var N = g5();
        u(T, N);
      }, P = (T) => {
        var N = m5(), K = d(N);
        _g(K, { class: "size-4 shrink-0" }), u(T, N);
      }, C = (T) => {
        var N = E5(), K = d(N), W = d(K), A = v(d(W), 2);
        {
          var S = (Y) => {
            var $ = h5(), O = d($);
            L((G) => E(O, `${s(a).length ?? ""} model${s(a).length !== 1 ? "s" : ""} \xB7 ${G ?? ""} total`), [() => p(s(a).reduce((G, J) => G + J.totalBytes, 0))]), u(Y, $);
          };
          I(A, (Y) => {
            s(a).length > 0 && Y(S);
          });
        }
        var w = v(W, 2);
        {
          var R = (Y) => {
            var $ = _5();
            u(Y, $);
          }, B = (Y) => {
            var $ = k5();
            Ge($, 21, () => s(a), (O) => O.id, (O, G) => {
              const J = V(() => s(l) === s(G).id), se = V(() => s(c) === s(G).id);
              var ie = w5(), oe = d(ie), de = d(oe), ve = d(de);
              Cu(ve, { class: "size-3.5 text-muted-foreground/40" });
              var me = v(de, 2), ke = d(me), ye = d(ke), we = d(ye), le = v(ye, 2);
              {
                var ce = (Ce) => {
                  Cr(Ce, { variant: "outline", class: "text-[0.6rem] px-1.5 py-0 text-amber-500/70 border-amber-500/30", children: (ze, Re) => {
                    var je = Be("legacy");
                    u(ze, je);
                  }, $$slots: { default: true } });
                };
                I(le, (Ce) => {
                  s(G).isKnown || Ce(ce);
                });
              }
              var pe = v(ke, 2), ge = d(pe), Te = v(pe, 2), he = d(Te), ue = d(he);
              Ax(ue, { class: "size-3" });
              var Ee = v(ue), xe = v(Ee);
              {
                var Se = (Ce) => {
                  var ze = b5(), Re = d(ze);
                  L(() => E(Re, `(declared ${s(G).declaredSize ?? ""})`)), u(Ce, ze);
                }, Fe = V(() => s(G).declaredSize && s(G).declaredSize !== p(s(G).totalBytes));
                I(xe, (Ce) => {
                  s(Fe) && Ce(Se);
                });
              }
              var qe = v(he, 2), ne = d(qe), fe = v(me, 2), be = d(fe);
              {
                var _e40 = (Ce) => {
                  var ze = x5(), Re = v(re(ze), 2), je = v(Re, 2);
                  L(() => je.disabled = s(J)), Pe("click", Re, () => g(c, null)), Pe("click", je, () => x(s(G).id)), u(Ce, ze);
                }, $e = (Ce) => {
                  {
                    let ze = V(() => s(J) || s(l) !== null);
                    tt(Ce, { variant: "ghost", size: "icon-sm", get disabled() {
                      return s(ze);
                    }, onclick: () => g(c, s(G).id, true), title: "Remove from cache", class: "text-muted-foreground/40 hover:text-destructive", children: (Re, je) => {
                      var Ve = Ae(), st = re(Ve);
                      {
                        var gt = (dt) => {
                          var Jt = y5();
                          u(dt, Jt);
                        }, Lt = (dt) => {
                          ei(dt, { class: "size-3.5" });
                        };
                        I(st, (dt) => {
                          s(J) ? dt(gt) : dt(Lt, -1);
                        });
                      }
                      u(Re, Ve);
                    }, $$slots: { default: true } });
                  }
                };
                I(be, (Ce) => {
                  s(se) ? Ce(_e40) : Ce($e, -1);
                });
              }
              L((Ce, ze, Re) => {
                rt(ie, 1, Ce), E(we, ze), E(ge, s(G).id), E(Ee, ` ${Re ?? ""} `), E(ne, `${s(G).files.length ?? ""} file${s(G).files.length !== 1 ? "s" : ""}`);
              }, [() => Et(Je("rounded border transition-colors", s(se) ? "border-destructive/30 bg-destructive/5" : "border-border/50 bg-card")), () => s(G).name ?? s(G).id.split("/").pop(), () => p(s(G).totalBytes)]), u(O, ie);
            }), u(Y, $);
          };
          I(w, (Y) => {
            s(a).length === 0 ? Y(R) : Y(B, -1);
          });
        }
        var Z = v(K, 2);
        {
          var X = (Y) => {
            var $ = T5(), O = v(d($), 2);
            Ge(O, 21, () => s(o), (G) => G.id, (G, J) => {
              var se = S5(), ie = d(se);
              Cu(ie, { class: "size-3.5 text-muted-foreground/30 shrink-0" });
              var oe = v(ie, 2), de = d(oe), ve = d(de), me = v(de, 2), ke = d(me), ye = v(oe, 2), we = d(ye);
              L((le) => {
                E(ve, s(J).name), E(ke, s(J).size), E(we, le);
              }, [() => s(J).id.split("/").pop()]), u(G, se);
            }), u(Y, $);
          };
          I(Z, (Y) => {
            s(o).length > 0 && Y(X);
          });
        }
        var H = v(Z, 2);
        {
          var te = (Y) => {
            var $ = A5(), O = d($);
            Ks(O, { class: "size-3.5 shrink-0 mt-0.5 text-muted-foreground/30" }), u(Y, $);
          };
          I(H, (Y) => {
            s(a).length > 0 && Y(te);
          });
        }
        u(T, N);
      };
      I(q, (T) => {
        s(i) ? T(F) : s(f) ? T(C, -1) : T(P, 1);
      });
    }
    u(U, M);
  }, $$slots: { default: true } }), u(t, b), Le();
}
Zt(["click"]);
var P5 = _('<div class="flex items-center justify-center py-16 text-muted-foreground gap-3"><div class="size-4 rounded-full border-2 border-border border-t-primary animate-spin"></div> <span class="text-xs">Loading\u2026</span></div>'), $5 = _('<span class="text-[0.6rem] text-amber-500/70 bg-amber-500/10 px-1.5 py-0.5 rounded">Storage API unavailable</span>'), N5 = _('<div class="flex flex-col items-center px-3 py-2.5 rounded border bg-card border-border/50"><span class="text-sm font-bold tabular-nums text-foreground"> </span> <span class="text-[0.6rem] uppercase tracking-wider text-muted-foreground/50 mt-0.5"> </span></div>'), R5 = _('<div class="flex items-center flex-wrap gap-2 px-3 py-2.5 rounded border border-destructive/20 bg-destructive/5 text-[0.7rem] text-muted-foreground/60"><span> </span> <button class="hover:text-foreground underline transition-colors">Cancel</button> <button class="text-destructive hover:text-destructive/80 underline font-medium disabled:opacity-40 transition-colors">Delete</button></div>'), M5 = _('<button class="flex flex-col items-start gap-0.5 px-3 py-2 rounded border border-transparent hover:bg-muted/20 hover:border-border/40 disabled:opacity-40 transition-colors w-full text-left"><span class="text-xs text-foreground/80 font-medium"> </span> <span class="text-[0.65rem] text-muted-foreground/40"> </span></button>'), z5 = _('<div class="grid grid-cols-3 sm:grid-cols-4 gap-2"><div class="flex flex-col items-center px-3 py-2.5 rounded border bg-card border-border/50"><span class="text-sm font-bold tabular-nums text-foreground"> </span> <span class="text-[0.6rem] uppercase tracking-wider text-muted-foreground/50 mt-0.5">Storage used</span></div> <!></div> <div class="flex flex-col gap-1"></div>', 1), O5 = _('<div class="flex flex-col items-center px-3 py-2.5 rounded border bg-card border-border/50"><span class="text-sm font-bold tabular-nums text-foreground"> </span> <span class="text-[0.6rem] uppercase tracking-wider text-muted-foreground/50 mt-0.5 text-center"> </span></div>'), D5 = _('<p class="text-[0.65rem] text-muted-foreground/40">Origin storage (IndexedDB + browser caches): <span class="font-mono"> </span></p>'), L5 = _('<div class="grid grid-cols-3 gap-2"></div> <!>', 1), j5 = _('<span class="inline-flex items-center gap-2 text-[0.7rem] text-muted-foreground/60 px-2 py-1 rounded border border-destructive/20 bg-destructive/5"> <button class="hover:text-foreground underline transition-colors">No</button> <button class="text-destructive hover:text-destructive/80 underline disabled:opacity-40 transition-colors">Yes</button></span>'), B5 = _('<button class="text-[0.7rem] px-2 py-1 rounded border border-border/40 text-muted-foreground/60 bg-muted/20 hover:text-destructive hover:border-destructive/30 disabled:opacity-40 transition-colors"> </button>'), F5 = _('<div class="flex flex-col gap-2"><span class="text-[0.6rem] font-bold uppercase tracking-wider text-muted-foreground/40">Clear by category</span> <div class="flex flex-wrap gap-1.5"></div></div>'), U5 = _('<div class="flex items-center flex-wrap gap-2 px-3 py-2.5 rounded border border-destructive/20 bg-destructive/5 text-[0.7rem] text-muted-foreground/60"><span> </span> <button class="hover:text-foreground underline transition-colors">Cancel</button> <button class="text-destructive hover:text-destructive/80 underline font-medium disabled:opacity-40 transition-colors">Delete</button></div>'), G5 = _('<button class="flex flex-col items-start gap-0.5 px-3 py-2 rounded border border-transparent hover:bg-muted/20 hover:border-border/40 disabled:opacity-40 transition-colors w-full text-left"><span class="text-xs text-foreground/80 font-medium"> </span> <span class="text-[0.65rem] text-muted-foreground/40"> </span></button>'), W5 = _(`<div class="flex items-start flex-wrap gap-2 px-3 py-2.5 rounded border border-destructive/40 bg-destructive/8 text-[0.7rem] text-muted-foreground/60"><span class="flex-1"><strong class="text-destructive/80 font-semibold">This cannot be undone.</strong> Deletes IndexedDB and caches, all cached
                model weights (Cache API), and localStorage. The page will reload
                fresh.</span> <div class="flex items-center gap-3 shrink-0"><button class="hover:text-foreground underline transition-colors">Cancel</button> <button class="text-destructive hover:text-destructive/80 underline font-semibold disabled:opacity-40 transition-colors">Wipe everything</button></div></div>`), V5 = _('<button class="flex flex-col items-start gap-0.5 px-3 py-2 rounded border border-destructive/20 hover:bg-destructive/8 hover:border-destructive/40 disabled:opacity-40 transition-colors w-full text-left"><span class="text-xs text-destructive/80 font-semibold">Wipe everything</span> <span class="text-[0.65rem] text-muted-foreground/40">IndexedDB \xB7 model cache \xB7 localStorage \u2014 full reset.</span></button>'), H5 = _('<div class="absolute inset-0 rounded bg-background/60 flex items-center justify-center backdrop-blur-sm z-10"><span class="text-xs text-muted-foreground">Working\u2026</span></div>'), q5 = _('<div class="flex flex-col gap-8 max-w-2xl relative"><section class="flex flex-col gap-4"><div class="flex items-center gap-2"><h2 class="text-xs font-semibold tracking-tight text-foreground">IndexedDB</h2> <span class="text-[0.6rem] font-mono text-muted-foreground/40 bg-muted/30 px-1.5 py-0.5 rounded">me-ai</span> <!></div> <!></section> <div class="border-t border-border/40"></div> <section class="flex flex-col gap-4"><div class="flex items-center gap-2"><h2 class="text-xs font-semibold tracking-tight text-foreground">Cached data</h2> <span class="text-[0.6rem] text-muted-foreground/40 bg-muted/30 px-1.5 py-0.5 rounded font-mono">emails \xB7 classifications \xB7 contacts</span></div> <!> <!> <div class="flex flex-col gap-1"></div></section> <div class="border-t border-border/40"></div> <section class="flex flex-col gap-3"><h2 class="text-xs font-semibold tracking-tight text-muted-foreground/60 uppercase tracking-wider">Danger zone</h2> <!></section> <!></div>'), Y5 = _('<div class="flex flex-col h-full overflow-hidden"><div class="flex items-center justify-between px-8 pt-5 pb-4 shrink-0 border-b border-border"><div><div class="flex items-center gap-2 mb-0.5"><h1 class="text-sm font-semibold tracking-tight text-foreground">Data Management</h1> <span class="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground/50">/ storage</span></div> <p class="text-xs text-muted-foreground">Manage local storage \u2014 emails, classifications, pipelines, audit trail.</p></div> <!></div> <!></div>');
function K5(t, e) {
  De(e, true);
  let r = ee(null), n = ee(false), a = ee(true), o = ee(nt([])), i = ee(null), l = ee(null);
  async function c() {
    var _a10, _b4;
    g(a, true);
    try {
      const [k, D, U] = await Promise.all([ws().then((q) => Number(q ?? 0)), wi().then((q) => Number(q ?? 0)), yi().then((q) => Number(q ?? 0))]);
      let j = 0;
      try {
        j = ((_b4 = await ((_a10 = navigator.storage) == null ? void 0 : _a10.estimate())) == null ? void 0 : _b4.usage) ?? 0;
      } catch {
      }
      g(l, { emailCount: k, classCount: D, contactCount: U, idbBytes: j }, true), g(i, await sv(), true);
      const M = await as();
      g(o, M.order, true);
    } finally {
      g(a, false);
    }
  }
  Xt(c);
  function f(k) {
    return k ? k < 1024 ? `${k} B` : k < 1024 * 1024 ? `${(k / 1024).toFixed(1)} KB` : `${(k / (1024 * 1024)).toFixed(1)} MB` : "\u2014";
  }
  async function p(k) {
    g(n, true), g(r, null);
    try {
      await k(), await c();
    } finally {
      g(n, false);
    }
  }
  function m(k) {
    return k.split("_").map((D) => D.charAt(0) + D.slice(1).toLowerCase()).join(" ");
  }
  var h = Y5(), x = d(h), b = v(d(x), 2);
  {
    let k = V(() => Je(s(a) && "[&_svg]:animate-spin"));
    tt(b, { variant: "ghost", size: "icon-sm", onclick: c, title: "Refresh", get class() {
      return s(k);
    }, children: (D, U) => {
      ms(D, { class: "size-3.5" });
    }, $$slots: { default: true } });
  }
  var y = v(x, 2);
  Ln(y, { class: "flex-1 min-h-0 px-8 py-6", children: (k, D) => {
    var U = Ae(), j = re(U);
    {
      var M = (F) => {
        var P = P5();
        u(F, P);
      }, q = (F) => {
        var P = q5(), C = d(P), T = d(C), N = v(d(T), 4);
        {
          var K = (J) => {
            var se = $5();
            u(J, se);
          };
          I(N, (J) => {
            s(i) && !s(i).supported && J(K);
          });
        }
        var W = v(T, 2);
        {
          var A = (J) => {
            var se = z5(), ie = re(se), oe = d(ie), de = d(oe), ve = d(de), me = v(oe, 2);
            Ge(me, 16, () => [{ key: "sm_rules", label: "Rules" }, { key: "sm_events", label: "Events" }, { key: "items", label: "Emails" }], Qe, (ye, we) => {
              var le = N5(), ce = d(le), pe = d(ce), ge = v(ce, 2), Te = d(ge);
              L(() => {
                E(pe, s(i).tables[we.key] ?? 0), E(Te, we.label);
              }), u(ye, le);
            });
            var ke = v(ie, 2);
            Ge(ke, 20, () => [{ key: "clear-audit", label: "Clear execution log", desc: "Delete all auditLog entries (Event Stream / pipeline execution history).", action: () => p(() => Z_()) }, { key: "clear-all", label: "Clear all data", desc: "Reset pipelines, rules, events, emails and classifications from IndexedDB.", action: () => p(() => ov()) }], Qe, (ye, we) => {
              var le = Ae(), ce = re(le);
              {
                var pe = (Te) => {
                  var he = R5(), ue = d(he), Ee = d(ue), xe = v(ue, 2), Se = v(xe, 2);
                  L((Fe) => {
                    E(Ee, `Delete ${Fe ?? ""}?`), Se.disabled = s(n);
                  }, [() => we.label.toLowerCase()]), Pe("click", xe, () => g(r, null)), Pe("click", Se, function(...Fe) {
                    var _a10;
                    (_a10 = we.action) == null ? void 0 : _a10.apply(this, Fe);
                  }), u(Te, he);
                }, ge = (Te) => {
                  var he = M5(), ue = d(he), Ee = d(ue), xe = v(ue, 2), Se = d(xe);
                  L(() => {
                    he.disabled = s(n), E(Ee, we.label), E(Se, we.desc);
                  }), Pe("click", he, () => g(r, we.key, true)), u(Te, he);
                };
                I(ce, (Te) => {
                  s(r) === we.key ? Te(pe) : Te(ge, -1);
                });
              }
              u(ye, le);
            }), L((ye) => E(ve, ye), [() => f(s(i).usageBytes)]), u(J, se);
          };
          I(W, (J) => {
            s(i) && J(A);
          });
        }
        var S = v(C, 4), w = v(d(S), 2);
        {
          var R = (J) => {
            var se = L5(), ie = re(se);
            Ge(ie, 21, () => [{ label: "Emails", val: s(l).emailCount }, { label: "Classifications", val: s(l).classCount }, { label: "Contacts", val: s(l).contactCount }], Qe, (ve, me) => {
              var ke = O5(), ye = d(ke), we = d(ye), le = v(ye, 2), ce = d(le);
              L(() => {
                E(we, s(me).val), E(ce, s(me).label);
              }), u(ve, ke);
            });
            var oe = v(ie, 2);
            {
              var de = (ve) => {
                var me = D5(), ke = v(d(me)), ye = d(ke);
                L((we) => E(ye, we), [() => f(s(l).idbBytes)]), u(ve, me);
              };
              I(oe, (ve) => {
                s(l).idbBytes > 0 && ve(de);
              });
            }
            u(J, se);
          };
          I(w, (J) => {
            s(l) && J(R);
          });
        }
        var B = v(w, 2);
        {
          var Z = (J) => {
            var se = F5(), ie = v(d(se), 2);
            Ge(ie, 21, () => s(o), Qe, (oe, de) => {
              var ve = Ae(), me = re(ve);
              {
                var ke = (we) => {
                  var le = j5(), ce = d(le), pe = v(ce), ge = v(pe, 2);
                  L((Te) => {
                    E(ce, `Delete ${Te ?? ""}? `), ge.disabled = s(n);
                  }, [() => m(s(de))]), Pe("click", pe, () => g(r, null)), Pe("click", ge, () => p(() => Oc(s(de)))), u(we, le);
                }, ye = (we) => {
                  var le = B5(), ce = d(le);
                  L((pe) => {
                    le.disabled = s(n), E(ce, `${pe ?? ""} \u2715`);
                  }, [() => m(s(de))]), Pe("click", le, () => g(r, `category:${s(de)}`)), u(we, le);
                };
                I(me, (we) => {
                  s(r) === `category:${s(de)}` ? we(ke) : we(ye, -1);
                });
              }
              u(oe, ve);
            }), u(J, se);
          };
          I(B, (J) => {
            s(o).length > 0 && J(Z);
          });
        }
        var X = v(B, 2);
        Ge(X, 20, () => [{ key: "classifications", label: "Clear all classifications", desc: "Remove all LLM scan results. Emails stay.", action: () => p(() => Cb()) }, { key: "emails", label: "Clear all email data", desc: "Wipes emails from IndexedDB (Rexie), then reloads.", action: () => {
          g(r, null), g(n, true), uv();
        } }, { key: "contacts", label: "Clear contacts", desc: "Remove extracted contacts from the database.", action: () => p(async () => {
          await Up();
        }) }], Qe, (J, se) => {
          var ie = Ae(), oe = re(ie);
          {
            var de = (me) => {
              var ke = U5(), ye = d(ke), we = d(ye), le = v(ye, 2), ce = v(le, 2);
              L((pe) => {
                E(we, `Delete ${pe ?? ""}?`), ce.disabled = s(n);
              }, [() => se.label.toLowerCase()]), Pe("click", le, () => g(r, null)), Pe("click", ce, function(...pe) {
                var _a10;
                (_a10 = se.action) == null ? void 0 : _a10.apply(this, pe);
              }), u(me, ke);
            }, ve = (me) => {
              var ke = G5(), ye = d(ke), we = d(ye), le = v(ye, 2), ce = d(le);
              L(() => {
                ke.disabled = s(n), E(we, se.label), E(ce, se.desc);
              }), Pe("click", ke, () => g(r, se.key, true)), u(me, ke);
            };
            I(oe, (me) => {
              s(r) === se.key ? me(de) : me(ve, -1);
            });
          }
          u(J, ie);
        });
        var H = v(S, 4), te = v(d(H), 2);
        {
          var Y = (J) => {
            var se = W5(), ie = v(d(se), 2), oe = d(ie), de = v(oe, 2);
            L(() => de.disabled = s(n)), Pe("click", oe, () => g(r, null)), Pe("click", de, async () => {
              g(n, true), g(r, null);
              try {
                await H_();
              } catch (ve) {
                g(n, false), console.error(ve), alert("Error wiping data: " + (ve instanceof Error ? ve.message : String(ve)));
              }
            }), u(J, se);
          }, $ = (J) => {
            var se = V5();
            L(() => se.disabled = s(n)), Pe("click", se, () => g(r, "nuke-all")), u(J, se);
          };
          I(te, (J) => {
            s(r) === "nuke-all" ? J(Y) : J($, -1);
          });
        }
        var O = v(H, 2);
        {
          var G = (J) => {
            var se = H5();
            u(J, se);
          };
          I(O, (J) => {
            s(n) && J(G);
          });
        }
        u(F, P);
      };
      I(j, (F) => {
        s(a) ? F(M) : F(q, -1);
      });
    }
    u(k, U);
  }, $$slots: { default: true } }), u(t, h), Le();
}
Zt(["click"]);
var X5 = _('<span class="text-[0.55rem] font-mono px-1.5 py-0.5 rounded bg-primary/10 text-primary"> </span>'), Z5 = _('<div class="flex flex-wrap gap-1 mt-1"></div>'), J5 = _('<div class="mt-1.5"><button type="button" class="text-[0.6rem] text-muted-foreground hover:text-foreground"><!> </button> <!></div>'), Q5 = _('<div class="flex items-start gap-3 px-4 py-2.5 hover:bg-muted/20 transition-colors"><div class="size-8 rounded flex items-center justify-center text-sm shrink-0 bg-muted"> </div> <div class="flex-1 min-w-0"><div class="flex items-center gap-2 flex-wrap"><span class="text-sm font-medium text-foreground"> </span> <code class="text-[0.6rem] text-muted-foreground font-mono"> </code></div> <p class="text-xs text-muted-foreground mt-0.5"> </p> <!></div></div>'), e3 = _('<div class="border-t border-border"><!></div>'), t3 = _('<div class="divide-y divide-border"></div> <!>', 1), r3 = _('<div class="rounded-lg border border-border bg-card overflow-hidden"><button type="button" class="flex items-center justify-between w-full px-4 py-3 bg-muted/30 border-b border-border hover:bg-muted/50 transition-colors text-left"><div class="flex items-center gap-2"><span class="text-[0.7rem] text-muted-foreground w-4 shrink-0"> </span> <span class="text-sm font-semibold text-foreground"> </span> <code class="text-[0.65rem] text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded"> </code> <span class="text-[0.6rem] font-medium text-success">\u25CF active</span></div> <span class="text-xs text-muted-foreground"> </span></button> <!></div>'), n3 = _('<div class="py-12 text-center text-muted-foreground text-sm">No plugins registered. Add plugins in <code class="bg-muted px-1 rounded">me-ai-core/src/plugins</code>.</div>'), a3 = _('<div class="flex flex-col h-full overflow-hidden"><div class="px-6 pt-5 pb-4 shrink-0 border-b border-border"><h1 class="text-sm font-semibold tracking-tight text-foreground">Plugin Registry</h1> <p class="text-xs text-muted-foreground mt-1"> </p></div> <div class="flex-1 min-h-0 overflow-y-auto px-6 pb-6"><div class="flex flex-col gap-4 py-4"><!> <!></div></div></div>');
function s3(t, e) {
  De(e, true);
  const r = V(() => {
    try {
      const j = qp();
      return Array.isArray(j) ? j.map((M) => ({ id: M.pluginId ?? "", name: M.pluginName ?? "", actions: (M.actions ?? []).map((q) => ({ id: q.actionId ?? "", name: q.name ?? "", description: q.description ?? "", scopes: q.requiredScopes || [] })) })) : [];
    } catch {
      return [];
    }
  }), n = V(() => s(r).reduce((j, M) => j + M.actions.length, 0)), a = { mark_read: "\u2713", mark_unread: "\u25CB", star: "\u2605", unstar: "\u2606", trash: "\u{1F5D1}", delete: "\u2715", mark_spam: "\u26A0", archive: "\u2193", apply_label: "\u{1F3F7}", remove_label: "\u{1F3F7}", mark_important: "!", mark_not_important: "\u2013", read_file: "\u{1F4C4}", write_file: "\u270F", list_dir: "\u{1F4C1}", create_file: "\u2795", delete_file: "\u{1F5D1}" };
  let o = ee(nt(/* @__PURE__ */ new Set())), i = ee(nt(/* @__PURE__ */ new Set()));
  function l(j) {
    const M = new Set(s(i));
    M.has(j) ? M.delete(j) : M.add(j), g(i, M, true);
  }
  function c(j) {
    const M = new Set(s(o));
    M.has(j) ? M.delete(j) : M.add(j), g(o, M, true);
  }
  function f(j) {
    return j.replace(/^https?:\/\/[^/]+\/auth\//, "");
  }
  var p = a3(), m = d(p), h = v(d(m), 2), x = d(h), b = v(m, 2), y = d(b), k = d(y);
  Ge(k, 17, () => s(r), Qe, (j, M) => {
    const q = V(() => s(i).has(s(M).id));
    var F = r3(), P = d(F), C = d(P), T = d(C), N = d(T), K = v(T, 2), W = d(K), A = v(K, 2), S = d(A), w = v(C, 2), R = d(w), B = v(P, 2);
    {
      var Z = (X) => {
        var H = t3(), te = re(H);
        Ge(te, 21, () => s(M).actions, Qe, (O, G) => {
          const J = V(() => `${s(M).id}:${s(G).id}`), se = V(() => s(o).has(s(J)));
          var ie = Q5(), oe = d(ie), de = d(oe), ve = v(oe, 2), me = d(ve), ke = d(me), ye = d(ke), we = v(ke, 2), le = d(we), ce = v(me, 2), pe = d(ce), ge = v(ce, 2);
          {
            var Te = (he) => {
              var ue = J5(), Ee = d(ue), xe = d(Ee);
              {
                var Se = (be) => {
                  var _e40 = Be("\u25BE");
                  u(be, _e40);
                }, Fe = (be) => {
                  var _e40 = Be("\u25B8");
                  u(be, _e40);
                };
                I(xe, (be) => {
                  s(se) ? be(Se) : be(Fe, -1);
                });
              }
              var qe = v(xe), ne = v(Ee, 2);
              {
                var fe = (be) => {
                  var _e40 = Z5();
                  Ge(_e40, 21, () => s(G).scopes, Qe, ($e, Ce) => {
                    var ze = X5(), Re = d(ze);
                    L((je) => {
                      br(ze, "title", s(Ce)), E(Re, je);
                    }, [() => f(s(Ce))]), u($e, ze);
                  }), u(be, _e40);
                };
                I(ne, (be) => {
                  s(se) && be(fe);
                });
              }
              L(() => E(qe, ` ${s(G).scopes.length ?? ""} scope${s(G).scopes.length === 1 ? "" : "s"}`)), Pe("click", Ee, () => c(s(J))), u(he, ue);
            };
            I(ge, (he) => {
              s(G).scopes.length && he(Te);
            });
          }
          L(() => {
            E(de, a[s(G).id] ?? "\xB7"), E(ye, s(G).name), E(le, s(G).id), E(pe, s(G).description);
          }), u(O, ie);
        });
        var Y = v(te, 2);
        {
          var $ = (O) => {
            var G = e3(), J = d(G);
            ym(J, {}), u(O, G);
          };
          I(Y, (O) => {
            s(M).id === "filesystem" && O($);
          });
        }
        u(X, H);
      };
      I(B, (X) => {
        s(q) && X(Z);
      });
    }
    L(() => {
      E(N, s(q) ? "\u25BE" : "\u25B8"), E(W, s(M).name), E(S, s(M).id), E(R, `${s(M).actions.length ?? ""} action${s(M).actions.length === 1 ? "" : "s"}`);
    }), Pe("click", P, () => l(s(M).id)), u(j, F);
  });
  var D = v(k, 2);
  {
    var U = (j) => {
      var M = n3();
      u(j, M);
    };
    I(D, (j) => {
      s(r).length === 0 && j(U);
    });
  }
  L(() => E(x, `${s(r).length ?? ""} plugin${s(r).length === 1 ? "" : "s"} \xB7 ${s(n) ?? ""} actions available.
      No LLM required to view or configure.`)), u(t, p), Le();
}
Zt(["click"]);
var o3 = _('<span class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-primary rounded-full"></span>'), i3 = _('<button><!> <!> <span class="flex-1 tracking-tight"> </span></button>'), l3 = _('<div class="flex flex-1 min-h-0 overflow-hidden"><aside class="w-48 shrink-0 flex flex-col bg-sidebar border-r border-sidebar-border overflow-hidden"><div class="px-4 pt-4 pb-2 shrink-0"><span class="text-[0.6rem] font-semibold uppercase tracking-widest text-muted-foreground/40">Dashboard</span></div> <nav class="flex flex-col flex-1 overflow-y-auto py-1"></nav></aside> <main class="flex-1 min-h-0 overflow-hidden flex flex-col bg-background"><!></main></div>');
function c3(t, e) {
  De(e, true);
  let r = ee("models");
  const n = [{ id: "models", label: "Local Models", icon: Sx }, { id: "data", label: "Data Management", icon: $l }, { id: "plugins", label: "Plugins", icon: Ix }];
  var a = l3(), o = d(a), i = v(d(o), 2);
  Ge(i, 21, () => n, Qe, (h, x) => {
    var b = i3(), y = d(b);
    {
      var k = (M) => {
        var q = o3();
        u(M, q);
      };
      I(y, (M) => {
        s(r) === s(x).id && M(k);
      });
    }
    var D = v(y, 2);
    dr(D, () => s(x).icon, (M, q) => {
      q(M, { class: "size-3.5 shrink-0" });
    });
    var U = v(D, 2), j = d(U);
    L((M) => {
      rt(b, 1, M), E(j, s(x).label);
    }, [() => Et(Je("relative flex items-center gap-2.5 px-4 py-2 text-sm transition-colors text-left w-full", s(r) === s(x).id ? "text-foreground font-medium bg-sidebar-accent" : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"))]), Pe("click", b, () => {
      g(r, s(x).id, true);
    }), u(h, b);
  });
  var l = v(o, 2), c = d(l);
  {
    var f = (h) => {
      I5(h, {});
    }, p = (h) => {
      K5(h, {});
    }, m = (h) => {
      s3(h, {});
    };
    I(c, (h) => {
      s(r) === "models" ? h(f) : s(r) === "data" ? h(p, 1) : s(r) === "plugins" && h(m, 2);
    });
  }
  u(t, a), Le();
}
Zt(["click"]);
const lf = (t) => {
  var e = d3();
  u(t, e);
};
var d3 = dn('<svg class="size-4 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"></path><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"></path><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"></path><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"></path></svg>'), u3 = _("<!> Go to Sources", 1), f3 = _('<div class="flex items-center gap-3 p-3 rounded border border-success/25 bg-success/8"><!> <div class="flex-1 min-w-0"><p class="text-sm font-medium text-foreground">Connected</p> <p class="text-xs text-muted-foreground truncate"> </p></div> <!></div> <div class="flex flex-col gap-2"><!> <!></div>', 1), p3 = _('<div class="flex flex-col items-center gap-3 py-4"><!> <p class="text-sm text-muted-foreground">Opening Google sign-in\u2026</p></div>'), v3 = _("<!> Try again", 1), g3 = _('<div class="flex items-start gap-3 p-3 rounded border border-destructive/25 bg-destructive/8"><!> <div class="flex-1 min-w-0"><p class="text-sm font-medium text-destructive">Authentication failed</p> <p class="text-xs text-muted-foreground mt-0.5 break-words"> </p></div></div> <!>', 1), m3 = _("<!> Sign in with Google", 1), h3 = _(`<div class="flex flex-col gap-3"><p class="text-sm text-muted-foreground leading-relaxed">Sign in with Google to let me-ai read and manage your Gmail messages
            for automated pipeline processing.</p> <div class="rounded border border-border bg-muted/40 p-3 flex flex-col gap-1.5 text-xs text-muted-foreground"><div class="flex items-center gap-2"><span class="size-1 rounded-full bg-success shrink-0"></span> Read and modify Gmail messages</div> <div class="flex items-center gap-2"><span class="size-1 rounded-full bg-success shrink-0"></span> Token stored locally \u2014 never sent to any server</div> <div class="flex items-center gap-2"><span class="size-1 rounded-full bg-success shrink-0"></span> Revoke access at any time from Google Account settings</div></div></div> <!> <p class="text-center text-[0.65rem] text-muted-foreground/60">Client ID: <span class="font-mono"> </span></p>`, 1), _3 = _('<div class="flex flex-col items-center justify-center min-h-full p-8"><div class="w-full max-w-md flex flex-col gap-6"><div class="flex flex-col items-center gap-3 text-center"><div class="size-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center"><!></div> <div><h1 class="text-xl font-semibold tracking-tight text-foreground">Google OAuth</h1> <p class="text-sm text-muted-foreground mt-1">Authorize me-ai to access your Gmail messages</p></div></div> <div class="rounded-lg border border-border bg-card p-6 flex flex-col gap-5"><!></div> <a href="#home" class="text-center text-xs text-muted-foreground hover:text-foreground transition-colors no-underline">\u2190 Back to Home</a></div></div>');
function b3(t, e) {
  De(e, true);
  const r = "562478245230-1gohf6dtsajqo1lu3kge9k7cthm4sdv6.apps.googleusercontent.com";
  let n = ee("idle"), a = ee(""), o = ee(null), i = ee(0), l = ee(false);
  async function c() {
    try {
      await Sl(r), g(l, true), await ba() && Cc() && (g(o, await sr("gmail-profile"), true), g(i, Math.floor(kl() / 6e4), true), g(n, "success"));
    } catch (F) {
      g(a, F instanceof Error ? F.message : String(F), true), g(n, "error");
    }
  }
  async function f() {
    g(n, "loading"), g(a, "");
    try {
      await Ov(), g(o, await sr("gmail-profile"), true), g(i, Math.floor(kl() / 6e4), true), g(n, "success");
    } catch (F) {
      g(a, F instanceof Error ? F.message : String(F), true), g(n, "error");
    }
  }
  async function p() {
    const F = await ba();
    F && await Dv(F.access_token), g(o, null), g(i, 0), g(n, "idle");
  }
  Xt(c);
  var m = _3(), h = d(m), x = d(h), b = d(x), y = d(b);
  gs(y, { class: "size-6 text-primary" });
  var k = v(x, 2), D = d(k);
  {
    var U = (F) => {
      var P = f3(), C = re(P), T = d(C);
      ss(T, { class: "size-4 text-success shrink-0" });
      var N = v(T, 2), K = v(d(N), 2), W = d(K), A = v(N, 2);
      Cr(A, { variant: "outline", class: "text-success border-success/30 bg-success/10 shrink-0 text-[0.6rem]", children: (B, Z) => {
        var X = Be();
        L(() => E(X, `${s(i) ?? ""}m left`)), u(B, X);
      }, $$slots: { default: true } });
      var S = v(C, 2), w = d(S);
      tt(w, { href: "#sources", class: "w-full gap-2", children: (B, Z) => {
        var X = u3(), H = re(X);
        bg(H, { class: "size-3.5" }), u(B, X);
      }, $$slots: { default: true } });
      var R = v(w, 2);
      tt(R, { variant: "ghost", onclick: p, class: "w-full text-muted-foreground", children: (B, Z) => {
        var X = Be("Disconnect");
        u(B, X);
      }, $$slots: { default: true } }), L(() => E(W, s(o).emailAddress ?? "Gmail account")), u(F, P);
    }, j = (F) => {
      var P = p3(), C = d(P);
      uo(C, { class: "size-5 text-primary animate-spin" }), u(F, P);
    }, M = (F) => {
      var P = g3(), C = re(P), T = d(C);
      gg(T, { class: "size-4 text-destructive shrink-0 mt-0.5" });
      var N = v(T, 2), K = v(d(N), 2), W = d(K), A = v(C, 2);
      {
        let S = V(() => !s(l));
        tt(A, { onclick: f, class: "w-full gap-2", get disabled() {
          return s(S);
        }, children: (w, R) => {
          var B = v3(), Z = re(B);
          lf(Z), u(w, B);
        }, $$slots: { default: true } });
      }
      L(() => E(W, s(a))), u(F, P);
    }, q = (F) => {
      var P = h3(), C = v(re(P), 2);
      {
        let W = V(() => !s(l));
        tt(C, { onclick: f, class: "w-full gap-2.5", get disabled() {
          return s(W);
        }, children: (A, S) => {
          var w = m3(), R = re(w);
          lf(R), u(A, w);
        }, $$slots: { default: true } });
      }
      var T = v(C, 2), N = v(d(T)), K = d(N);
      L((W) => E(K, `${W ?? ""}\u2026`), [() => r.slice(0, 30)]), u(F, P);
    };
    I(D, (F) => {
      s(n) === "success" && s(o) ? F(U) : s(n) === "loading" ? F(j, 1) : s(n) === "error" ? F(M, 2) : F(q, -1);
    });
  }
  u(t, m), Le();
}
const cf = (t) => {
  var e = x3();
  u(t, e);
};
var x3 = dn('<svg class="size-4 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"></path><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"></path><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"></path><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"></path></svg>'), y3 = _('<div class="flex flex-col items-center gap-3 py-4"><!> <p class="text-sm text-muted-foreground">Processing authentication\u2026</p></div>'), w3 = _("<!> Go to Sources", 1), k3 = _('<div class="flex items-center gap-3 p-3 rounded border border-success/25 bg-success/8"><!> <div class="flex-1 min-w-0"><p class="text-sm font-medium text-foreground">Successfully authenticated</p> <p class="text-xs text-muted-foreground mt-0.5"> </p></div></div> <div class="flex flex-col gap-2"><!> <!></div>', 1), S3 = _("<!> Try again", 1), T3 = _('<div class="flex items-start gap-3 p-3 rounded border border-destructive/25 bg-destructive/8"><!> <div class="flex-1 min-w-0"><p class="text-sm font-medium text-destructive">Authentication failed</p> <p class="text-xs text-muted-foreground mt-0.5 break-words"> </p></div></div> <!>', 1), A3 = _("<!> Sign in with Google (redirect)", 1), E3 = _(`<div class="flex flex-col gap-3"><p class="text-sm text-muted-foreground leading-relaxed">This flow redirects you to Google and back. Useful in environments
            where popups are blocked (e.g. Cursor's embedded browser).</p> <div class="rounded border border-border bg-muted/40 p-3 flex flex-col gap-1.5 text-xs text-muted-foreground"><div class="flex items-center gap-2"><span class="size-1 rounded-full bg-primary shrink-0"></span> Click the button \u2014 you'll be redirected to Google</div> <div class="flex items-center gap-2"><span class="size-1 rounded-full bg-primary shrink-0"></span> After approval, you'll land back here automatically</div> <div class="flex items-center gap-2"><span class="size-1 rounded-full bg-primary shrink-0"></span> Token is saved locally and the app is ready to use</div></div></div> <!> <p class="text-center text-xs text-muted-foreground">Prefer popups? <a href="#auth" class="text-primary hover:underline no-underline">Use the standard flow</a></p>`, 1), C3 = _('<div class="flex flex-col items-center justify-center min-h-full p-8"><div class="w-full max-w-md flex flex-col gap-6"><div class="flex flex-col items-center gap-3 text-center"><div class="size-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center"><!></div> <div><h1 class="text-xl font-semibold tracking-tight text-foreground">Google OAuth</h1> <p class="text-sm text-muted-foreground mt-1">Redirect-based sign-in flow</p></div></div> <div class="rounded-lg border border-border bg-card p-6 flex flex-col gap-5"><!></div> <a href="#home" class="text-center text-xs text-muted-foreground hover:text-foreground transition-colors no-underline">\u2190 Back to Home</a></div></div>');
function I3(t, e) {
  De(e, true);
  const r = "me-ai:oauth-token";
  let n = ee("idle"), a = ee(""), o = ee(0), i = ee(false);
  function l() {
    const q = window.location.href, F = q.indexOf("#", q.indexOf("#") + 1);
    if (F === -1) return {};
    const P = q.slice(F + 1);
    return Object.fromEntries(new URLSearchParams(P));
  }
  async function c() {
    g(n, "processing");
    const q = l();
    if (q.error) {
      g(a, q.error_description ? decodeURIComponent(q.error_description) : q.error, true), g(n, "error");
      return;
    }
    if (!q.access_token || !q.expires_in) {
      g(n, "idle");
      return;
    }
    try {
      const F = parseInt(q.expires_in, 10), P = Date.now() + F * 1e3;
      await _r(r, { access_token: q.access_token, expires_at: P }), g(o, Math.floor(F / 60), true), g(i, true), history.replaceState(null, "", window.location.pathname + "#oauth-redirect");
    } catch {
      g(i, false);
    }
    g(n, "success");
  }
  function f() {
    const q = "562478245230-1gohf6dtsajqo1lu3kge9k7cthm4sdv6.apps.googleusercontent.com", F = window.location.origin + window.location.pathname + "#oauth-redirect";
    return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(q)}&redirect_uri=${encodeURIComponent(F)}&response_type=token&scope=${encodeURIComponent("https://www.googleapis.com/auth/gmail.modify")}&prompt=consent`;
  }
  Xt(c);
  var p = C3(), m = d(p), h = d(m), x = d(h), b = d(x);
  gs(b, { class: "size-6 text-primary" });
  var y = v(h, 2), k = d(y);
  {
    var D = (q) => {
      var F = y3(), P = d(F);
      uo(P, { class: "size-5 text-primary animate-spin" }), u(q, F);
    }, U = (q) => {
      var F = k3(), P = re(F), C = d(P);
      ss(C, { class: "size-4 text-success shrink-0" });
      var T = v(C, 2), N = v(d(T), 2), K = d(N), W = v(P, 2), A = d(W);
      tt(A, { href: "#sources", class: "w-full gap-2", children: (w, R) => {
        var B = w3(), Z = re(B);
        gs(Z, { class: "size-3.5" }), u(w, B);
      }, $$slots: { default: true } });
      var S = v(A, 2);
      tt(S, { variant: "outline", href: "#home", class: "w-full", children: (w, R) => {
        var B = Be("Back to Home");
        u(w, B);
      }, $$slots: { default: true } }), L(() => E(K, `Token saved \xB7 ${s(o) ?? ""} minutes remaining \xB7
              ${s(i) ? "stored \u2713" : "storage failed \u2717"}`)), u(q, F);
    }, j = (q) => {
      var F = T3(), P = re(F), C = d(P);
      gg(C, { class: "size-4 text-destructive shrink-0 mt-0.5" });
      var T = v(C, 2), N = v(d(T), 2), K = d(N), W = v(P, 2);
      {
        let A = V(f);
        tt(W, { get href() {
          return s(A);
        }, class: "w-full gap-2.5", children: (S, w) => {
          var R = S3(), B = re(R);
          cf(B), u(S, R);
        }, $$slots: { default: true } });
      }
      L(() => E(K, s(a))), u(q, F);
    }, M = (q) => {
      var F = E3(), P = v(re(F), 2);
      {
        let C = V(f);
        tt(P, { get href() {
          return s(C);
        }, class: "w-full gap-2.5", children: (T, N) => {
          var K = A3(), W = re(K);
          cf(W), u(T, K);
        }, $$slots: { default: true } });
      }
      u(q, F);
    };
    I(k, (q) => {
      s(n) === "processing" ? q(D) : s(n) === "success" ? q(U, 1) : s(n) === "error" ? q(j, 2) : q(M, -1);
    });
  }
  u(t, p), Le();
}
let Xr = null, hn = "idle", Gn = null, Kr = /* @__PURE__ */ new Set();
function zs() {
  return typeof Worker > "u" ? Promise.reject(new Error("Web Workers are not supported in this environment")) : (Xr || (Xr = (async () => {
    const t = new Worker(new URL("/me-ai/assets/llm-worker-DdwtBPfP.js", import.meta.url), { type: "module" });
    t.onmessage = (r) => {
      const n = r.data;
      if (n.status === "loading" && (hn = "loading"), n.status === "ready" && (hn = "ready"), n.status === "start" && (hn = "generating"), (n.status === "complete" || n.status === "error") && (hn = Gn ? "ready" : "idle"), n.status === "status-report") {
        if (n.loaded && n.modelId) {
          Gn = n.modelId, hn = "ready";
          for (const a of Kr) try {
            a({ status: "ready", _recovered: true });
          } catch {
          }
        }
        return;
      }
      for (const a of Kr) try {
        a(n);
      } catch {
      }
    };
    const e = { postMessage: (r, n = []) => {
      t.postMessage(r, n);
    }, terminate: () => {
      t.terminate();
    } };
    return e.postMessage({ type: "getStatus" }), e;
  })()), Xr);
}
function ol() {
  return { async check() {
    try {
      (await zs()).postMessage({ type: "check" });
    } catch (t) {
      const e = t instanceof Error ? t.message : String(t);
      for (const r of Kr) r({ status: "error", data: `Worker init failed: ${e}` });
    }
  }, async loadModel(t, e = {}) {
    hn = "loading";
    try {
      if (Xr && Gn != null && Gn !== t) {
        try {
          (await Xr).terminate();
        } catch {
        }
        Xr = null, Gn = null;
      }
      Gn = t, (await zs()).postMessage({ type: "load", modelId: t, options: e });
    } catch (r) {
      hn = "idle", Gn = null;
      const n = r instanceof Error ? r.message : String(r);
      for (const a of Kr) a({ status: "error", data: `Worker init failed: ${n}` });
    }
  }, async generate(t, e) {
    try {
      (await zs()).postMessage({ type: "generate", data: t, options: e });
    } catch (r) {
      const n = r instanceof Error ? r.message : String(r);
      for (const a of Kr) a({ status: "error", data: `Worker init failed: ${n}` });
    }
  }, generateFull(t, e, r) {
    return new Promise((n, a) => {
      let o = "", i = null, l = 0, c = 0;
      const f = (m) => {
        switch (m.status) {
          case "start":
            c = m.inputTokens || 0;
            break;
          case "thinking":
          case "thinking-done":
            break;
          case "update":
            if (o += m.output ?? "", i = m.tps ?? i, l = m.numTokens ?? l, r) try {
              r({ tps: i, numTokens: l, text: o });
            } catch {
            }
            break;
          case "complete":
            p(), n({ text: o, tps: i, numTokens: l, inputTokens: c });
            break;
          case "error":
            p(), a(new Error(m.data));
            break;
        }
      }, p = () => Kr.delete(f);
      Kr.add(f), zs().then((m) => {
        m.postMessage({ type: "generate", data: t, options: e });
      }).catch((m) => {
        p(), a(m);
      });
    });
  }, clearCache(t) {
    return new Promise((e, r) => {
      const n = (a) => {
        a.status === "cacheCleared" && (Kr.delete(n), e());
      };
      Kr.add(n), zs().then((a) => {
        a.postMessage({ type: "clearCache", modelId: t });
      }).catch(r);
    });
  }, async interrupt() {
    if (!Xr) return;
    (await Xr).postMessage({ type: "interrupt" });
  }, async reset() {
    if (!Xr) return;
    (await Xr).postMessage({ type: "reset" });
  }, onMessage(t) {
    return Kr.add(t), () => Kr.delete(t);
  }, offMessage(t) {
    Kr.delete(t);
  }, get status() {
    return hn;
  }, get isReady() {
    return hn === "ready";
  }, get isGenerating() {
    return hn === "generating";
  }, get modelId() {
    return Gn;
  }, async terminate() {
    if (Xr) try {
      (await Xr).terminate();
    } catch {
    }
    Xr = null, hn = "idle", Gn = null, Kr.clear();
  } };
}
const df = "http://localhost:11434", P3 = "https://me-ai.metaelon.space";
function wm() {
  try {
    const t = window.location.hostname;
    return t === "localhost" || t === "127.0.0.1" || t === "0.0.0.0" ? df : P3;
  } catch {
    return df;
  }
}
function bo() {
  return wm();
}
async function $3() {
  const { getSetting: t } = await wr(async () => {
    const { getSetting: e } = await Promise.resolve().then(() => un);
    return { getSetting: e };
  }, void 0);
  return await t("ollamaUrl") || wm();
}
async function N3(t) {
  const { setSetting: e } = await wr(async () => {
    const { setSetting: r } = await Promise.resolve().then(() => un);
    return { setSetting: r };
  }, void 0);
  await e("ollamaUrl", t);
}
async function Yl(t = bo()) {
  var _a10, _b4;
  try {
    const e = await fetch(`${t}/api/version`, { method: "GET", signal: AbortSignal.timeout(5e3) });
    return e.ok ? { connected: true, version: (await e.json()).version } : { connected: false, error: `HTTP ${e.status}` };
  } catch (e) {
    const r = e;
    return ((_a10 = r.message) == null ? void 0 : _a10.includes("CORS")) || ((_b4 = r.message) == null ? void 0 : _b4.includes("Failed to fetch")) || r.name === "TypeError" ? { connected: false, corsError: true, error: "CORS error: Server must allow requests from this origin. Configure Access-Control-Allow-Origin header." } : { connected: false, error: r.name === "TimeoutError" ? "Connection timeout" : r.message ?? String(e) };
  }
}
async function R3(t = bo()) {
  const e = await fetch(`${t}/api/tags`, { method: "GET", signal: AbortSignal.timeout(1e4) });
  if (!e.ok) throw new Error(`Failed to list models: HTTP ${e.status}`);
  return (await e.json()).models ?? [];
}
async function M3(t, e, r = {}, n = () => {
}, a = bo()) {
  var _a10;
  const { temperature: o = 0.7, maxTokens: i = 4096, keepAlive: l } = r, c = { model: t, messages: e, stream: true, options: { temperature: o, num_predict: i } };
  c.keep_alive = l !== void 0 ? l : "10m";
  const f = new AbortController(), p = setTimeout(() => f.abort(), 3e5), m = await fetch(`${a}/api/chat`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(c), signal: f.signal });
  if (clearTimeout(p), !m.ok) {
    const y = await m.text();
    throw new Error(`Ollama API error: ${y}`);
  }
  const h = m.body.getReader(), x = new TextDecoder();
  let b = "";
  try {
    for (; ; ) {
      const { done: y, value: k } = await h.read();
      if (y) break;
      const U = x.decode(k).split(`
`).filter(Boolean);
      for (const j of U) try {
        const M = JSON.parse(j);
        if (((_a10 = M.message) == null ? void 0 : _a10.content) && (b += M.message.content, n({ content: M.message.content, done: false, total_duration: M.total_duration, eval_count: M.eval_count, eval_duration: M.eval_duration })), M.done) {
          n({ content: "", done: true, total_duration: M.total_duration, eval_count: M.eval_count, eval_duration: M.eval_duration });
          break;
        }
      } catch {
      }
    }
  } finally {
    h.releaseLock();
  }
  return b;
}
let Vr = "idle", es = null;
const da = /* @__PURE__ */ new Set();
function vn(t) {
  for (const e of da) try {
    e(t);
  } catch {
  }
}
function z3() {
  return { async check() {
    Vr = "loading", vn({ status: "loading", data: "Testing Ollama connection..." });
    const t = await Yl();
    t.connected ? (Vr = "idle", vn({ status: "ready", data: { type: "ollama", version: t.version, url: bo() } })) : (Vr = "idle", vn({ status: "error", data: `Ollama not available: ${t.error}. Make sure Ollama is running.` }));
  }, async loadModel(t) {
    es = t, Vr = "loading", vn({ status: "loading", data: `Connecting to Ollama model: ${t}...` });
    const e = await Yl();
    if (!e.connected) {
      Vr = "idle", es = null, vn({ status: "error", data: `Ollama not available: ${e.error}` });
      return;
    }
    Vr = "ready", vn({ status: "ready" });
  }, async generate(t, e = {}) {
    if (!es) {
      vn({ status: "error", data: "No Ollama model selected" });
      return;
    }
    Vr = "generating", vn({ status: "start", inputTokens: 0 });
    let r = 0;
    const n = performance.now();
    try {
      await M3(es, t, { temperature: e.temperature ?? 0.7, maxTokens: e.maxTokens ?? 4096 }, (a) => {
        if (a.content) {
          r++;
          const o = performance.now() - n, i = o > 0 ? r / o * 1e3 : 0;
          vn({ status: "update", output: a.content, tps: Math.round(i * 10) / 10, numTokens: r });
        }
        a.done && (Vr = "ready", vn({ status: "complete", tps: a.eval_duration != null ? Math.round((a.eval_count ?? 0) / (a.eval_duration / 1e9) * 10) / 10 : null, numTokens: a.eval_count ?? r }));
      });
    } catch (a) {
      Vr = "ready", vn({ status: "error", data: a instanceof Error ? a.message : String(a) });
    }
  }, generateFull(t, e, r) {
    return new Promise((n, a) => {
      let o = "", i = null, l = 0, c = 0;
      const f = (p) => {
        switch (p.status) {
          case "start":
            c = p.inputTokens ?? 0;
            break;
          case "update":
            if (o += p.output ?? "", i = p.tps ?? i, l = p.numTokens ?? l, r) try {
              r({ tps: i, numTokens: l, text: o });
            } catch {
            }
            break;
          case "complete":
            da.delete(f), n({ text: o, tps: i, numTokens: l, inputTokens: c });
            break;
          case "error":
            da.delete(f), a(new Error(p.data ?? "Unknown error"));
            break;
        }
      };
      da.add(f), this.generate(t, e);
    });
  }, interrupt() {
    console.warn("Ollama doesn't support generation interruption");
  }, reset() {
  }, onMessage(t) {
    return da.add(t), () => da.delete(t);
  }, offMessage(t) {
    da.delete(t);
  }, get status() {
    return Vr;
  }, get isReady() {
    return Vr === "ready";
  }, get isGenerating() {
    return Vr === "generating";
  }, get modelId() {
    return es;
  }, get backend() {
    return "ollama";
  }, terminate() {
    Vr = "idle", es = null, da.clear();
  } };
}
let Er = "idle", Os = null, ts = null, Ds = null, ua = /* @__PURE__ */ new Set(), Sn = null;
function Br(t) {
  for (const e of ua) try {
    e(t);
  } catch {
  }
}
function O3(t) {
  return { async check() {
    Er = "loading", Ds = t, Br({ status: "loading", data: `Checking ${t} connection...` });
    const e = await sr(`${t}ApiKey`);
    if (!e) {
      Er = "idle", Br({ status: "error", data: `${t} API key not found. Please configure it in settings.` });
      return;
    }
    try {
      await lv(t, e) ? (Er = "idle", Br({ status: "ready", data: { type: "api", provider: t } })) : (Er = "idle", Br({ status: "error", data: `${t} connection failed.` }));
    } catch (r) {
      Er = "idle", Br({ status: "error", data: `${t} connection failed: ${r instanceof Error ? r.message : String(r)}` });
    }
  }, async loadModel(e) {
    var _a10;
    const n = ((_a10 = Ho(e)) == null ? void 0 : _a10.name) ?? e;
    if (Os = e, ts = n, Ds = t, Er = "loading", Br({ status: "loading", data: `Connecting to ${t} model: ${n}...` }), !await sr(`${t}ApiKey`)) {
      Er = "idle", Os = null, ts = null, Br({ status: "error", data: `${t} API key not configured.` });
      return;
    }
    Er = "ready", Br({ status: "ready" });
  }, async generate(e, r = {}) {
    if (!ts || !Ds) {
      Br({ status: "error", data: "No model or provider selected" });
      return;
    }
    Er = "generating", Br({ status: "start", inputTokens: 0 });
    let n = 0;
    const a = performance.now();
    Sn = new AbortController();
    try {
      const o = Os ? Ho(Os) : null, i = { temperature: r.temperature ?? 0.7, maxTokens: r.maxTokens ?? 4096, reasoningEffort: o == null ? void 0 : o.reasoningEffort }, l = e.map((c) => ({ role: c.role, content: c.content ?? "" }));
      await cv(Ds, ts, l, i, (c) => {
        if (!(Sn == null ? void 0 : Sn.signal.aborted)) if (c.done) {
          Er = "ready";
          const f = (performance.now() - a) / 1e3, p = f > 0 ? n / f : null;
          Br({ status: "complete", tps: p !== null ? Math.round(p * 10) / 10 : null, numTokens: c.outputTokens ?? n, inputTokens: c.inputTokens ?? 0 });
        } else {
          n++;
          const f = performance.now() - a, p = f > 0 ? n / f * 1e3 : 0;
          Br({ status: "update", output: c.content, tps: Math.round(p * 10) / 10, numTokens: n });
        }
      });
    } catch (o) {
      (Sn == null ? void 0 : Sn.signal.aborted) ? (Er = "ready", Br({ status: "complete", tps: null, numTokens: n })) : (Er = "ready", Br({ status: "error", data: o instanceof Error ? o.message : String(o) }));
    } finally {
      Sn = null;
    }
  }, generateFull(e, r, n) {
    return new Promise((a, o) => {
      let i = "", l = null, c = 0, f = 0;
      const p = (m) => {
        switch (m.status) {
          case "start":
            f = m.inputTokens ?? 0;
            break;
          case "update":
            if (i += m.output ?? "", l = m.tps ?? l, c = m.numTokens ?? c, n) try {
              n({ tps: l, numTokens: c, text: i });
            } catch {
            }
            break;
          case "complete":
            ua.delete(p), a({ text: i, tps: l, numTokens: c, inputTokens: f });
            break;
          case "error":
            ua.delete(p), o(new Error(m.data ?? "Unknown error"));
            break;
        }
      };
      ua.add(p), this.generate(e, r);
    });
  }, interrupt() {
    Sn && Sn.abort();
  }, reset() {
    Sn && Sn.abort();
  }, onMessage(e) {
    return ua.add(e), () => ua.delete(e);
  }, offMessage(e) {
    ua.delete(e);
  }, get status() {
    return Er;
  }, get isReady() {
    return Er === "ready";
  }, get isGenerating() {
    return Er === "generating";
  }, get modelId() {
    return ts;
  }, get backend() {
    return Ds;
  }, terminate() {
    Er = "idle", Os = null, ts = null, Sn && Sn.abort(), ua.clear();
  } };
}
let il = null;
const pa = new Proxy([], { get(t, e, r) {
  return il === null && (il = iv()), Reflect.get(il, e, r);
} });
function km(t) {
  return Ho(t);
}
let Fn = null, Vt = null;
const ll = /* @__PURE__ */ new Set();
function D3(t) {
  if (t.startsWith("onnx-community/") || t.startsWith("microsoft/")) return "webgpu";
  const e = km(t);
  return e ? e.provider : "ollama";
}
function Hd() {
  return { loadModel(t, e = {}) {
    const r = D3(t);
    if (Fn !== r) {
      Vt && Vt.terminate(), Fn = r, r === "webgpu" ? Vt = ol() : r === "ollama" ? Vt = z3() : Vt = O3(r);
      for (const n of ll) Vt.onMessage(n);
    }
    Vt.loadModel(t, e);
  }, check() {
    Vt || (Vt = ol(), Fn = "webgpu"), Vt.check();
  }, generate(t, e) {
    if (!Vt) throw new Error("No engine loaded. Call loadModel() first.");
    Vt.generate(t, e);
  }, generateFull(t, e, r) {
    return Vt ? Vt.generateFull(t, e, r) : Promise.reject(new Error("No engine loaded. Call loadModel() first."));
  }, clearCache(t) {
    return Fn === "webgpu" && (Vt == null ? void 0 : Vt.clearCache) ? Vt.clearCache(t) : Promise.resolve();
  }, interrupt() {
    Vt == null ? void 0 : Vt.interrupt();
  }, reset() {
    Vt == null ? void 0 : Vt.reset();
  }, onMessage(t) {
    return Vt || (Vt = ol(), Fn = "webgpu"), ll.add(t), Vt.onMessage(t);
  }, offMessage(t) {
    ll.delete(t), Vt == null ? void 0 : Vt.offMessage(t);
  }, get status() {
    return (Vt == null ? void 0 : Vt.status) ?? "idle";
  }, get isReady() {
    return (Vt == null ? void 0 : Vt.isReady) ?? false;
  }, get isGenerating() {
    return (Vt == null ? void 0 : Vt.isGenerating) ?? false;
  }, get modelId() {
    return (Vt == null ? void 0 : Vt.modelId) ?? null;
  }, get backend() {
    return Fn;
  }, getModelInfo() {
    const t = this.modelId;
    return t ? Fn === "webgpu" ? Ti(t) : Fn === "ollama" ? zc(t) : km(t) : null;
  }, terminate() {
    Vt == null ? void 0 : Vt.terminate(), Vt = null, Fn = null;
  } };
}
async function L3() {
  const t = await n2();
  if (!t) return null;
  const e = ["You have access to the user's locally stored data.", t, "The user can ask you about their emails. If they do, you can see recent emails and search results that will be provided."], r = await ci();
  if (r && r.total > 0) {
    const n = Object.keys(r.categories).map((a) => `${a} (${r.categories[a].length})`).join(", ");
    e.push(`Pending emails awaiting manual execution: ${n}.`, "If the user asks you to execute or handle a pending category, append [EXECUTE:CATEGORY:EVENT_TYPE] to the end of your response.", "If the user asks to SEE or MANAGE their events/emails/noise, append [SHOW:DASHBOARD] to the end of your response to spawn a visual dashboard for them.");
  }
  return e.join(" ");
}
async function j3(t) {
  const e = [], r = await a2();
  e.push(r);
  const n = await ci();
  if (n && n.total > 0) {
    const a = Object.keys(n.categories).map((o) => `- ${o}: ${n.categories[o].length} emails`);
    e.push("", "## Pending Actions (Triage)", "The user has the following emails awaiting manual execution:", ...a, "", "## AI Control Actions", "If the user asks you to execute, process, or handle pending emails by category, you MUST output a special command tag at the very end of your response: [EXECUTE:CATEGORY:EVENT_TYPE]", "If the user asks to SEE, MANAGE, or REVIEW their events/noise/emails visually, output this tag at the very end of your response: [SHOW:DASHBOARD]", "Only output these tags if the user explicitly requests or confirms the action.");
  }
  if (t) {
    const a = await o2(t, 5);
    e.push("", "## Relevant Emails", a);
  } else {
    const a = await s2(5);
    e.push("", "## Recent Emails", a);
  }
  return e.join(`
`);
}
var B3 = _('<button><span class="text-2xl leading-none shrink-0"> </span> <div class="flex-1 min-w-0"><div> </div> <div class="text-xs text-muted-foreground"> </div></div></button>'), F3 = _('<p class="mt-2.5 px-3 py-2 text-xs text-warning bg-warning/8 border border-warning/20 rounded text-center">WebGPU not available in this browser. Use Ollama or upgrade your browser.</p>'), U3 = _('<div class="w-full mb-4"><p class="text-[0.68rem] font-bold uppercase tracking-widest text-foreground/50 text-left mb-3">AI Backend</p> <div class="flex flex-col gap-3"><div class="grid grid-cols-2 gap-3"></div> <!></div> <!></div>');
function G3(t, e) {
  De(e, true);
  let r = ae(e, "backend", 15, "webgpu"), n = ae(e, "isWebGPUAvailable", 3, true);
  const a = [{ id: "webgpu", icon: "\u{1F537}", label: "WebGPU", desc: "Browser, private, no server", disabled: !n() }, { id: "ollama", icon: "\u{1F999}", label: "Ollama", desc: "Local server, larger models" }, { id: "cloud", icon: "\u2601\uFE0F", label: "Cloud APIs", desc: "ChatGPT, Claude, Gemini, Grok" }];
  var o = U3();
  {
    const m = (h, x = vt) => {
      var b = B3(), y = d(b), k = d(y), D = v(y, 2), U = d(D), j = d(U), M = v(U, 2), q = d(M);
      L((F, P) => {
        b.disabled = x().disabled, rt(b, 1, F), E(k, x().icon), rt(U, 1, P), E(j, x().label), E(q, x().desc);
      }, [() => Et(Je("flex items-center gap-3 p-3.5 text-left rounded border transition-all w-full", "disabled:opacity-40 disabled:cursor-not-allowed", r() === x().id ? "bg-primary/8 border-primary/40" : "bg-card border-border hover:bg-accent hover:border-primary/25")), () => Et(Je("text-sm font-semibold tracking-tight mb-0.5", r() === x().id ? "text-primary" : "text-foreground"))]), Pe("click", b, () => r(x().id)), u(h, b);
    };
    var i = v(d(o), 2), l = d(i);
    Ge(l, 21, () => a.slice(0, 2), Qe, (h, x) => {
      m(h, () => s(x));
    });
    var c = v(l, 2);
    Ge(c, 17, () => a.slice(2), Qe, (h, x) => {
      m(h, () => s(x));
    });
    var f = v(i, 2);
    {
      var p = (h) => {
        var x = F3();
        u(h, x);
      };
      I(f, (h) => {
        !n() && r() === "webgpu" && h(p);
      });
    }
  }
  u(t, o), Le();
}
Zt(["click"]);
function rn(t, e) {
  De(e, true);
  let r = ae(e, "ref", 15, null), n = ut(e, ["$$slots", "$$events", "$$legacy", "ref", "class"]);
  var a = Ae(), o = re(a);
  {
    let i = V(() => Je("flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50", e.class));
    dr(o, () => I1, (l, c) => {
      c(l, et({ "data-slot": "label", get class() {
        return s(i);
      } }, () => n, { get ref() {
        return r();
      }, set ref(f) {
        r(f);
      } }));
    });
  }
  u(t, a), Le();
}
var W3 = _("<div><!></div>");
function Ra(t, e) {
  De(e, true);
  let r = ae(e, "ref", 15, null), n = ut(e, ["$$slots", "$$events", "$$legacy", "ref", "class", "children"]);
  var a = W3();
  Gt(a, (i) => ({ "data-slot": "card", class: i, ...n }), [() => Je("bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm", e.class)]);
  var o = d(a);
  bt(o, () => e.children ?? vt), Jn(a, (i) => r(i), () => r()), u(t, a), Le();
}
var V3 = _("<div><!></div>");
function Ma(t, e) {
  De(e, true);
  let r = ae(e, "ref", 15, null), n = ut(e, ["$$slots", "$$events", "$$legacy", "ref", "class", "children"]);
  var a = V3();
  Gt(a, (i) => ({ "data-slot": "card-content", class: i, ...n }), [() => Je("px-6", e.class)]);
  var o = d(a);
  bt(o, () => e.children ?? vt), Jn(a, (i) => r(i), () => r()), u(t, a), Le();
}
var H3 = _("<option> </option>"), q3 = _("<optgroup></optgroup>"), Y3 = _('<p class="text-xs text-muted-foreground/60 italic"> </p>'), K3 = _("<option> </option>"), X3 = _("<option> </option>"), Z3 = _('<th class="text-left px-3 py-2 text-[0.6rem] font-bold uppercase tracking-wider text-muted-foreground/40 border-b border-border"> </th>'), J3 = _('<span class="text-success">\u2705</span>'), Q3 = _('<span class="text-warning">\u26A0\uFE0F</span>'), eT = _('<span class="text-destructive">\u274C</span>'), tT = _('<tr><td class="px-3 py-2 font-medium text-foreground border-b border-border/50"> <!></td><td class="px-3 py-2 tabular-nums border-b border-border/50"><strong class="text-foreground"> </strong></td><td class="px-3 py-2 tabular-nums text-muted-foreground border-b border-border/50"> </td><td class="px-3 py-2 border-b border-border/50"><!></td></tr>'), rT = _('<tr><td colspan="4" class="px-3 pt-3 pb-1 text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground/40"> </td></tr> <!>', 1), nT = _('<div class="overflow-x-auto max-h-[260px] overflow-y-auto"><table class="w-full text-xs border-collapse"><thead class="sticky top-0 bg-card"><tr></tr></thead><tbody></tbody></table></div> <p class="px-3 pt-2 pb-1 text-[0.62rem] text-muted-foreground/40 leading-relaxed"><strong class="opacity-80">Context</strong> = max input. <strong class="opacity-80">Email Limit</strong> = WebGPU safe limit. \u2705 Recommended \xB7 \u26A0\uFE0F Limited \xB7 \u274C May fail</p>', 1), aT = _('<div class="flex justify-between text-xs"><span class="text-muted-foreground/50"> </span> <span class="text-foreground/75 text-right"> </span></div>'), sT = _('<div class="flex items-center gap-2 text-xs font-semibold text-success mb-2"><span class="size-2 rounded-full bg-success shrink-0"></span> WebGPU Active</div> <div class="flex flex-col gap-1"></div>', 1), oT = _('<p class="text-sm text-destructive"> </p> <!>', 1), iT = _('<div class="w-full flex flex-col items-center gap-5 text-center"><div class="w-full text-left flex flex-col gap-1.5"><!> <select id="model-select" class="w-full h-9 px-3 rounded border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"></select> <!></div> <div class="w-full grid grid-cols-2 gap-3 text-left"><div class="flex flex-col gap-1"><!> <select id="dtype-select" class="w-full h-9 px-3 rounded border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"></select></div> <div class="flex flex-col gap-1"><!> <select id="device-select" class="w-full h-9 px-3 rounded border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"></select></div></div> <details class="w-full group"><summary class="flex items-center gap-2 px-3 py-2 rounded border border-border bg-card text-xs font-semibold uppercase tracking-wider text-muted-foreground/50 cursor-pointer hover:bg-accent transition-colors list-none"><svg class="size-3 transition-transform group-open:rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg> Model Capabilities</summary> <!></details> <!> <!> <!></div>');
function lT(t, e) {
  De(e, true);
  const r = [{ value: "q4f16", label: "q4f16 (recommended)" }, { value: "q4", label: "q4 (smaller)" }, { value: "fp16", label: "fp16 (best quality)" }], n = [{ value: "webgpu", label: "WebGPU" }, { value: "wasm", label: "WASM" }];
  let a = ae(e, "selectedModel", 15), o = ae(e, "loadDtype", 15, "q4f16"), i = ae(e, "loadDevice", 15, "webgpu"), l = ae(e, "gpuInfo", 3, null), c = ae(e, "error", 3, null);
  const f = V(() => ea.find((S) => S.id === a()));
  Xt(() => qa("ModelSelector"));
  var p = iT(), m = d(p), h = d(m);
  rn(h, { for: "model-select", class: "text-[0.68rem] uppercase tracking-wider opacity-60", children: (S, w) => {
    var R = Be("Choose Model");
    u(S, R);
  }, $$slots: { default: true } });
  var x = v(h, 2);
  Ge(x, 21, () => Xo, Qe, (S, w) => {
    var R = q3();
    Ge(R, 21, () => s(w).models, Qe, (B, Z) => {
      var X = H3(), H = d(X), te = {};
      L(() => {
        E(H, `${s(w).label ?? ""} ${s(Z).name ?? ""} \u2014 ${s(Z).size ?? ""}`), te !== (te = s(Z).id) && (X.value = (X.__value = s(Z).id) ?? "");
      }), u(B, X);
    }), L(() => br(R, "label", s(w).label)), u(S, R);
  });
  var b = v(x, 2);
  {
    var y = (S) => {
      var w = Y3(), R = d(w);
      L(() => E(R, s(f).description)), u(S, w);
    };
    I(b, (S) => {
      s(f) && S(y);
    });
  }
  var k = v(m, 2), D = d(k), U = d(D);
  rn(U, { for: "dtype-select", class: "text-[0.68rem] uppercase tracking-wider opacity-60", children: (S, w) => {
    var R = Be("Dtype");
    u(S, R);
  }, $$slots: { default: true } });
  var j = v(U, 2);
  Ge(j, 21, () => r, Qe, (S, w) => {
    var R = K3(), B = d(R), Z = {};
    L(() => {
      E(B, s(w).label), Z !== (Z = s(w).value) && (R.value = (R.__value = s(w).value) ?? "");
    }), u(S, R);
  });
  var M = v(D, 2), q = d(M);
  rn(q, { for: "device-select", class: "text-[0.68rem] uppercase tracking-wider opacity-60", children: (S, w) => {
    var R = Be("Device");
    u(S, R);
  }, $$slots: { default: true } });
  var F = v(q, 2);
  Ge(F, 21, () => n, Qe, (S, w) => {
    var R = X3(), B = d(R), Z = {};
    L(() => {
      E(B, s(w).label), Z !== (Z = s(w).value) && (R.value = (R.__value = s(w).value) ?? "");
    }), u(S, R);
  });
  var P = v(k, 2), C = v(d(P), 2);
  Ra(C, { class: "mt-1 w-full text-left", children: (S, w) => {
    Ma(S, { class: "pt-0 pb-2 px-0", children: (R, B) => {
      var Z = nT(), X = re(Z), H = d(X), te = d(H), Y = d(te);
      Ge(Y, 20, () => ["Model", "Context", "Email Limit", "Status"], Qe, (O, G) => {
        var J = Z3(), se = d(J);
        L(() => E(se, G)), u(O, J);
      });
      var $ = v(te);
      Ge($, 21, () => Xo, Qe, (O, G) => {
        var J = rT(), se = re(J), ie = d(se), oe = d(ie), de = v(se, 2);
        Ge(de, 17, () => s(G).models, Qe, (ve, me) => {
          var ke = tT(), ye = d(ke), we = d(ye), le = v(we);
          {
            var ce = (ne) => {
              Cr(ne, { variant: "outline", class: "ml-1 text-[0.5rem] h-3.5 px-1 py-0 text-primary border-primary/30", children: (fe, be) => {
                var _e40 = Be("current");
                u(fe, _e40);
              }, $$slots: { default: true } });
            };
            I(le, (ne) => {
              s(me).id === a() && ne(ce);
            });
          }
          var pe = v(ye), ge = d(pe), Te = d(ge), he = v(pe), ue = d(he), Ee = v(he), xe = d(Ee);
          {
            var Se = (ne) => {
              var fe = J3();
              u(ne, fe);
            }, Fe = (ne) => {
              var fe = Q3();
              u(ne, fe);
            }, qe = (ne) => {
              var fe = eT();
              u(ne, fe);
            };
            I(xe, (ne) => {
              s(me).recommendedForEmailProcessing ? ne(Se) : s(me).maxEmailTokens >= 6e3 ? ne(Fe, 1) : ne(qe, -1);
            });
          }
          L((ne, fe, be) => {
            rt(ke, 1, ne), E(we, `${s(G).label ?? ""} ${s(me).name ?? ""} `), E(Te, `${fe ?? ""}k`), E(ue, `~${be ?? ""}k`);
          }, [() => Et(Je("transition-colors", s(me).id === a() ? "bg-primary/5" : "hover:bg-accent")), () => (s(me).contextWindow / 1024).toFixed(0), () => (s(me).maxEmailTokens / 1e3).toFixed(0)]), u(ve, ke);
        }), L(() => E(oe, s(G).label)), u(O, J);
      }), u(R, Z);
    }, $$slots: { default: true } });
  }, $$slots: { default: true } });
  var T = v(P, 2);
  {
    var N = (S) => {
      Ra(S, { class: "w-full text-left", children: (w, R) => {
        Ma(w, { class: "pt-3 pb-3 px-4", children: (B, Z) => {
          var X = sT(), H = v(re(X), 2);
          Ge(H, 21, () => {
            var _a10;
            return [["Vendor", l().vendor], ["Architecture", l().architecture], ...((_a10 = l().limits) == null ? void 0 : _a10.maxBufferSize) ? [["Max Buffer", Tl(l().limits.maxBufferSize)]] : []];
          }, Qe, (te, Y) => {
            var $ = V(() => gf(s(Y), 2));
            let O = () => s($)[0], G = () => s($)[1];
            var J = aT(), se = d(J), ie = d(se), oe = v(se, 2), de = d(oe);
            L(() => {
              E(ie, O()), E(de, G());
            }), u(te, J);
          }), u(B, X);
        }, $$slots: { default: true } });
      }, $$slots: { default: true } });
    };
    I(T, (S) => {
      l() && S(N);
    });
  }
  var K = v(T, 2);
  {
    var W = (S) => {
      var w = oT(), R = re(w), B = d(R), Z = v(R, 2);
      tt(Z, { variant: "outline", get onclick() {
        return e.onclearcache;
      }, class: "w-full text-xs", children: (X, H) => {
        var te = Be("Clear cache & retry");
        u(X, te);
      }, $$slots: { default: true } }), L(() => E(B, c())), u(S, w);
    };
    I(K, (S) => {
      c() && S(W);
    });
  }
  var A = v(K, 2);
  {
    let S = V(() => !!c());
    tt(A, { get onclick() {
      return e.onload;
    }, get disabled() {
      return s(S);
    }, class: "w-full", children: (w, R) => {
      var B = Be("Load Model");
      u(w, B);
    }, $$slots: { default: true } });
  }
  Pe("change", x, () => {
    var _a10;
    return (_a10 = e.onclearerror) == null ? void 0 : _a10.call(e);
  }), Rn(x, a), Rn(j, o), Rn(F, i), u(t, p), Le();
}
Zt(["change"]);
var cT = _("Ollama Server URL <!>", 1), dT = _("<span> </span>"), uT = _('<div class="mt-1 text-[0.65rem] leading-relaxed opacity-80"><strong class="text-destructive block mb-1">Fix CORS Error:</strong> <ul class="list-disc pl-4 space-y-0.5"><li>Cloudflare: Add Transform Rule setting <code class="bg-black/20 px-1 rounded font-mono"></code></li> <li>Or set <code class="bg-black/20 px-1 rounded font-mono"></code> on your server</li> <li>Testing locally: Use <code class="bg-black/20 px-1 rounded font-mono">http://localhost:5173</code></li></ul></div>'), fT = _("<span> </span> <!>", 1), pT = _('<div><span></span> <div class="flex flex-col gap-1"><!></div></div>'), vT = _('<div class="flex flex-col gap-1.5"><!> <div class="flex gap-2"><!> <!></div></div> <!>', 1), gT = _("<option> </option>"), mT = _("<option> </option>"), hT = _("<span>\xB7</span> <span> </span>", 1), _T = _('<p class="text-xs text-warning/80 bg-warning/6 border border-warning/15 rounded px-2 py-1.5">Not installed. Run: <code class="font-mono bg-black/20 px-1 rounded"> </code></p>'), bT = _('<p class="text-xs text-success bg-success/6 border border-success/15 rounded px-2 py-1.5">\u2713 Model installed and ready</p>'), xT = _('<div class="flex flex-col gap-1.5"><p class="text-xs text-muted-foreground"> </p> <div class="flex items-center gap-1.5 text-[0.68rem] text-muted-foreground/50"><span class="tabular-nums"> </span> <span>\xB7</span> <span> </span> <!></div> <!></div>'), yT = _('<div class="flex flex-col gap-1.5"><!> <select id="ollama-model" class="w-full h-9 px-3 rounded border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"><optgroup label="Recommended (ollama pull MODEL_NAME)"></optgroup><optgroup label="Other Models"></optgroup></select></div> <!>', 1), wT = _('<th class="text-left px-3 py-2 text-[0.6rem] font-bold uppercase tracking-wider text-muted-foreground/40 border-b border-border"> </th>'), kT = _('<span class="ml-1 text-success text-[0.65rem]">\u2713</span>'), ST = _('<span class="text-success mr-1">\u2705</span>'), TT = _('<tr><td class="px-3 py-1.5 font-medium text-foreground border-b border-border/50"> <!> <!></td><td class="px-3 py-1.5 tabular-nums text-muted-foreground border-b border-border/50"><strong class="text-foreground"> </strong></td><td class="px-3 py-1.5 tabular-nums text-muted-foreground border-b border-border/50"> </td><td class="px-3 py-1.5 text-muted-foreground/60 border-b border-border/50"><!> </td></tr>'), AT = _('<div class="overflow-x-auto"><table class="w-full text-xs border-collapse"><thead><tr></tr></thead><tbody></tbody></table></div> <p class="px-3 pt-2 pb-1 text-[0.62rem] text-muted-foreground/40">\u2713 = installed. Install: <code class="font-mono bg-muted px-1 rounded">ollama pull MODEL_NAME</code></p>', 1), ET = _('<p class="text-sm text-destructive text-center"> </p>'), CT = _('<div class="flex flex-col gap-5 w-full max-w-[520px] mx-auto"><!> <!> <details class="group"><summary class="flex items-center gap-2 px-3 py-2 rounded border border-border bg-card text-xs font-semibold uppercase tracking-wider text-muted-foreground/50 cursor-pointer hover:bg-accent transition-colors list-none"><svg class="size-3 transition-transform group-open:rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg> Ollama Model Capabilities</summary> <!></details> <!> <!></div>');
function IT(t, e) {
  De(e, true);
  let r = ae(e, "selectedModel", 15), n = ae(e, "error", 15);
  const a = typeof window < "u" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
  let o = ee(nt(bo())), i = ee(false), l = ee(null), c = ee(nt([])), f = ee(false);
  Ut(() => {
    $3().then((C) => {
      g(o, C, true), p();
    });
  });
  async function p() {
    g(i, true), g(l, null);
    const C = await Yl(s(o));
    g(l, C, true), g(i, false), C.connected && m();
  }
  async function m() {
    g(f, true);
    try {
      const C = await R3(s(o));
      g(c, C.map((T) => T.name), true);
    } catch {
      g(c, [], true);
    }
    g(f, false);
  }
  function h() {
    N3(s(o)), p();
  }
  function x() {
    if (!r()) {
      n("Please select a model");
      return;
    }
    e.onload();
  }
  function b(C) {
    return s(c).length > 0 && s(c).includes(C);
  }
  const y = Uv();
  var k = CT(), D = d(k);
  Ra(D, { children: (C, T) => {
    Ma(C, { class: "pt-4 pb-4 px-4 flex flex-col gap-3", children: (N, K) => {
      var W = vT(), A = re(W), S = d(A);
      rn(S, { for: "ollama-url", class: "text-[0.68rem] uppercase tracking-wider opacity-60", children: (H, te) => {
        var Y = cT(), $ = v(re(Y));
        Cr($, { variant: "outline", class: "ml-1.5 text-[0.55rem] h-4 px-1.5 normal-case tracking-normal", children: (O, G) => {
          var J = Be();
          L(() => E(J, a ? "\u{1F5A5} local" : "\u2601\uFE0F remote")), u(O, J);
        }, $$slots: { default: true } }), u(H, Y);
      }, $$slots: { default: true } });
      var w = v(S, 2), R = d(w);
      {
        let H = V(() => a ? "http://localhost:11434" : "https://your-server.example.com");
        Pn(R, { id: "ollama-url", type: "text", onchange: h, get placeholder() {
          return s(H);
        }, class: "font-mono text-xs", get value() {
          return s(o);
        }, set value(te) {
          g(o, te, true);
        } });
      }
      var B = v(R, 2);
      tt(B, { variant: "outline", size: "sm", onclick: p, get disabled() {
        return s(i);
      }, class: "shrink-0", children: (H, te) => {
        var Y = Be();
        L(() => E(Y, s(i) ? "Testing\u2026" : "Test")), u(H, Y);
      }, $$slots: { default: true } });
      var Z = v(A, 2);
      {
        var X = (H) => {
          var te = pT(), Y = d(te), $ = v(Y, 2), O = d($);
          {
            var G = (se) => {
              var ie = dT(), oe = d(ie);
              L(() => E(oe, `Connected \xB7 v${s(l).version ?? ""}`)), u(se, ie);
            }, J = (se) => {
              var ie = fT(), oe = re(ie), de = d(oe), ve = v(oe, 2);
              {
                var me = (ke) => {
                  var ye = uT(), we = v(d(ye), 2), le = d(we), ce = v(d(le));
                  ce.textContent = `Access-Control-Allow-Origin: ${window.location.origin ?? ""}`;
                  var pe = v(le, 2), ge = v(d(pe));
                  ge.textContent = `OLLAMA_ORIGINS=${window.location.origin ?? ""}`, u(ke, ye);
                };
                I(ve, (ke) => {
                  s(l).corsError && ke(me);
                });
              }
              L(() => E(de, `Disconnected: ${s(l).error ?? ""}`)), u(se, ie);
            };
            I(O, (se) => {
              s(l).connected ? se(G) : se(J, -1);
            });
          }
          L((se, ie) => {
            rt(te, 1, se), rt(Y, 1, ie);
          }, [() => Et(Je("flex items-start gap-2 px-3 py-2 rounded border text-xs", s(l).connected ? "text-success border-success/20 bg-success/8" : "text-destructive border-destructive/20 bg-destructive/8")), () => Et(Je("size-1.5 rounded-full shrink-0 mt-0.5", s(l).connected ? "bg-success" : "bg-destructive"))]), u(H, te);
        };
        I(Z, (H) => {
          s(l) && H(X);
        });
      }
      u(N, W);
    }, $$slots: { default: true } });
  }, $$slots: { default: true } });
  var U = v(D, 2);
  Ra(U, { children: (C, T) => {
    Ma(C, { class: "pt-4 pb-4 px-4 flex flex-col gap-3", children: (N, K) => {
      var W = yT(), A = re(W), S = d(A);
      rn(S, { for: "ollama-model", class: "text-[0.68rem] uppercase tracking-wider opacity-60", children: (H, te) => {
        var Y = Be("Choose Model");
        u(H, Y);
      }, $$slots: { default: true } });
      var w = v(S, 2), R = d(w);
      Ge(R, 21, () => y, Qe, (H, te) => {
        var Y = gT(), $ = d(Y), O = {};
        L((G, J) => {
          E($, `${s(te).displayName ?? ""} (${s(te).params ?? ""}) \u2013 ${G ?? ""}k ctx${J ?? ""}`), O !== (O = s(te).name) && (Y.value = (Y.__value = s(te).name) ?? "");
        }, [() => (s(te).contextWindow / 1024).toFixed(0), () => b(s(te).name) ? " \u2713" : ""]), u(H, Y);
      });
      var B = v(R);
      Ge(B, 21, () => zn.filter((H) => !H.recommended), Qe, (H, te) => {
        var Y = mT(), $ = d(Y), O = {};
        L((G, J) => {
          E($, `${s(te).displayName ?? ""} (${s(te).params ?? ""}) \u2013 ${G ?? ""}k ctx${J ?? ""}`), O !== (O = s(te).name) && (Y.value = (Y.__value = s(te).name) ?? "");
        }, [() => (s(te).contextWindow / 1024).toFixed(0), () => b(s(te).name) ? " \u2713" : ""]), u(H, Y);
      });
      var Z = v(A, 2);
      {
        var X = (H) => {
          const te = V(() => zn.find((G) => G.name === r()));
          var Y = Ae(), $ = re(Y);
          {
            var O = (G) => {
              var J = xT(), se = d(J), ie = d(se), oe = v(se, 2), de = d(oe), ve = d(de), me = v(de, 4), ke = d(me), ye = v(me, 2);
              {
                var we = (Te) => {
                  var he = hT(), ue = v(re(he), 2), Ee = d(ue);
                  L((xe) => E(Ee, xe), [() => s(te).tags.slice(0, 2).join(", ")]), u(Te, he);
                };
                I(ye, (Te) => {
                  var _a10;
                  ((_a10 = s(te).tags) == null ? void 0 : _a10.length) && Te(we);
                });
              }
              var le = v(oe, 2);
              {
                var ce = (Te) => {
                  var he = _T(), ue = v(d(he)), Ee = d(ue);
                  L(() => E(Ee, `ollama pull ${r() ?? ""}`)), u(Te, he);
                }, pe = V(() => !b(r())), ge = (Te) => {
                  var he = bT();
                  u(Te, he);
                };
                I(le, (Te) => {
                  s(pe) ? Te(ce) : Te(ge, -1);
                });
              }
              L((Te) => {
                E(ie, s(te).description), E(ve, `${Te ?? ""}k ctx`), E(ke, s(te).params);
              }, [() => (s(te).contextWindow / 1024).toFixed(0)]), u(G, J);
            };
            I($, (G) => {
              s(te) && G(O);
            });
          }
          u(H, Y);
        };
        I(Z, (H) => {
          r() && H(X);
        });
      }
      Rn(w, r), u(N, W);
    }, $$slots: { default: true } });
  }, $$slots: { default: true } });
  var j = v(U, 2), M = v(d(j), 2);
  Ra(M, { class: "mt-1", children: (C, T) => {
    Ma(C, { class: "pt-0 pb-2 px-0", children: (N, K) => {
      var W = AT(), A = re(W), S = d(A), w = d(S), R = d(w);
      Ge(R, 20, () => ["Model", "Context", "Params", "Strengths"], Qe, (Z, X) => {
        var H = wT(), te = d(H);
        L(() => E(te, X)), u(Z, H);
      });
      var B = v(w);
      Ge(B, 21, () => zn, Qe, (Z, X) => {
        var H = TT(), te = d(H), Y = d(te), $ = v(Y);
        {
          var O = (ce) => {
            Cr(ce, { variant: "outline", class: "ml-1 text-[0.5rem] h-3.5 px-1 py-0 text-primary border-primary/30", children: (pe, ge) => {
              var Te = Be("current");
              u(pe, Te);
            }, $$slots: { default: true } });
          };
          I($, (ce) => {
            s(X).name === r() && ce(O);
          });
        }
        var G = v($, 2);
        {
          var J = (ce) => {
            var pe = kT();
            u(ce, pe);
          }, se = V(() => b(s(X).name));
          I(G, (ce) => {
            s(se) && ce(J);
          });
        }
        var ie = v(te), oe = d(ie), de = d(oe), ve = v(ie), me = d(ve), ke = v(ve), ye = d(ke);
        {
          var we = (ce) => {
            var pe = ST();
            u(ce, pe);
          };
          I(ye, (ce) => {
            s(X).recommended && ce(we);
          });
        }
        var le = v(ye);
        L((ce, pe, ge) => {
          rt(H, 1, ce), E(Y, `${s(X).displayName ?? ""} `), E(de, `${pe ?? ""}k`), E(me, s(X).params), E(le, ` ${ge ?? ""}`);
        }, [() => Et(Je("transition-colors", s(X).name === r() ? "bg-primary/5" : "hover:bg-accent", !b(s(X).name) && "opacity-50")), () => (s(X).contextWindow / 1024).toFixed(0), () => s(X).tags.slice(0, 2).join(", ")]), u(Z, H);
      }), u(N, W);
    }, $$slots: { default: true } });
  }, $$slots: { default: true } });
  var q = v(j, 2);
  {
    var F = (C) => {
      var T = ET(), N = d(T);
      L(() => E(N, n())), u(C, T);
    };
    I(q, (C) => {
      n() && C(F);
    });
  }
  var P = v(q, 2);
  {
    let C = V(() => {
      var _a10;
      return !((_a10 = s(l)) == null ? void 0 : _a10.connected) || !!n();
    });
    tt(P, { onclick: x, get disabled() {
      return s(C);
    }, class: "w-full", children: (T, N) => {
      var K = Be("Load Model");
      u(T, K);
    }, $$slots: { default: true } });
  }
  u(t, k), Le();
}
function PT(t, e) {
  De(e, true);
  let r = ae(e, "ref", 15, null), n = ae(e, "value", 15, ""), a = ut(e, ["$$slots", "$$events", "$$legacy", "ref", "value", "class"]);
  var o = Ae(), i = re(o);
  {
    let l = V(() => Je("flex flex-col gap-2", e.class));
    dr(i, () => vy, (c, f) => {
      f(c, et({ "data-slot": "tabs", get class() {
        return s(l);
      } }, () => a, { get ref() {
        return r();
      }, set ref(p) {
        r(p);
      }, get value() {
        return n();
      }, set value(p) {
        n(p);
      } }));
    });
  }
  u(t, o), Le();
}
function $T(t, e) {
  De(e, true);
  let r = ae(e, "ref", 15, null), n = ut(e, ["$$slots", "$$events", "$$legacy", "ref", "class"]);
  var a = Ae(), o = re(a);
  {
    let i = V(() => Je("bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]", e.class));
    dr(o, () => my, (l, c) => {
      c(l, et({ "data-slot": "tabs-list", get class() {
        return s(i);
      } }, () => n, { get ref() {
        return r();
      }, set ref(f) {
        r(f);
      } }));
    });
  }
  u(t, a), Le();
}
function NT(t, e) {
  De(e, true);
  let r = ae(e, "ref", 15, null), n = ut(e, ["$$slots", "$$events", "$$legacy", "ref", "class"]);
  var a = Ae(), o = re(a);
  {
    let i = V(() => Je("data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", e.class));
    dr(o, () => _y, (l, c) => {
      c(l, et({ "data-slot": "tabs-trigger", get class() {
        return s(i);
      } }, () => n, { get ref() {
        return r();
      }, set ref(f) {
        r(f);
      } }));
    });
  }
  u(t, a), Le();
}
var RT = _("<span> </span> <span> </span>", 1), MT = _("<option> </option>"), zT = _('<span class="text-warning font-medium">May struggle with long emails.</span>'), OT = _('<p class="text-xs text-muted-foreground leading-relaxed"> <!></p>'), DT = _('<p class="text-sm text-destructive text-center px-3 py-2 bg-destructive/8 border border-destructive/20 rounded"> </p>'), LT = _('<form class="flex flex-col gap-5"><!> <div class="flex flex-col gap-1.5"><!> <!> <p class="text-[0.68rem] text-muted-foreground/50 leading-relaxed"> </p></div> <div class="flex flex-col gap-1.5"><!> <select id="model-select" class="w-full h-9 px-3 rounded border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors"></select> <!></div> <!> <!></form>');
function jT(t, e) {
  De(e, true);
  let r = ae(e, "selectedModel", 15), n = ae(e, "error", 15, null), a = ee("openai"), o = nt({ openai: "", anthropic: "", google: "", xai: "" }), i = ee(false), l = V(() => pa.filter((p) => p.provider === s(a)));
  Xt(async () => {
    var _a10;
    o.openai = await sr("openaiApiKey") || "", o.anthropic = await sr("anthropicApiKey") || "", o.google = await sr("googleApiKey") || "", o.xai = await sr("xaiApiKey") || "";
    const p = pa.find((m) => m.id === r());
    p ? g(a, p.provider, true) : (g(a, "openai"), r((_a10 = s(l)[0]) == null ? void 0 : _a10.id));
  }), Ut(() => {
    var _a10;
    pa.filter((p) => p.provider === s(a)).some((p) => p.id === r()) || r((_a10 = pa.filter((p) => p.provider === s(a))[0]) == null ? void 0 : _a10.id);
  });
  async function c() {
    var _a10;
    if (!o[s(a)]) {
      n(`API key for ${s(a)} is required`);
      return;
    }
    n(null), g(i, true), await _r(`${s(a)}ApiKey`, o[s(a)]), g(i, false), (_a10 = e.onload) == null ? void 0 : _a10.call(e);
  }
  const f = [{ id: "openai", icon: "\u26A1", label: "OpenAI" }, { id: "anthropic", icon: "\u{1F9E0}", label: "Anthropic" }, { id: "google", icon: "\u{1F50D}", label: "Google" }, { id: "xai", icon: "\u2716\uFE0F", label: "xAI" }];
  Ra(t, { class: "w-full max-w-[440px] mx-auto", children: (p, m) => {
    Ma(p, { class: "pt-5 pb-5 px-5", children: (h, x) => {
      var b = LT(), y = d(b);
      PT(y, { get value() {
        return s(a);
      }, set value(A) {
        g(a, A, true);
      }, children: (A, S) => {
        $T(A, { class: "w-full", children: (w, R) => {
          var B = Ae(), Z = re(B);
          Ge(Z, 17, () => f, Qe, (X, H) => {
            NT(X, { get value() {
              return s(H).id;
            }, class: "flex-1 gap-1.5", children: (te, Y) => {
              var $ = RT(), O = re($), G = d(O), J = v(O, 2), se = d(J);
              L(() => {
                E(G, s(H).icon), E(se, s(H).label);
              }), u(te, $);
            }, $$slots: { default: true } });
          }), u(w, B);
        }, $$slots: { default: true } });
      }, $$slots: { default: true } });
      var k = v(y, 2), D = d(k);
      rn(D, { for: "api-key", class: "text-[0.68rem] uppercase tracking-wider opacity-60", children: (A, S) => {
        var w = Be();
        L((R) => E(w, `${R ?? ""} API Key`), [() => s(a).toUpperCase()]), u(A, w);
      }, $$slots: { default: true } });
      var U = v(D, 2);
      Pn(U, { id: "api-key", type: "password", placeholder: "Enter your API key\u2026", autocomplete: "off", get value() {
        return o[s(a)];
      }, set value(A) {
        o[s(a)] = A;
      } });
      var j = v(U, 2), M = d(j), q = v(k, 2), F = d(q);
      rn(F, { for: "model-select", class: "text-[0.68rem] uppercase tracking-wider opacity-60", children: (A, S) => {
        var w = Be("Select Model");
        u(A, w);
      }, $$slots: { default: true } });
      var P = v(F, 2);
      Ge(P, 21, () => s(l), Qe, (A, S) => {
        var w = MT(), R = d(w), B = {};
        L(() => {
          E(R, `${s(S).displayName ?? ""}${s(S).recommendedForEmailProcessing ? " \u2605" : ""}`), B !== (B = s(S).id) && (w.value = (w.__value = s(S).id) ?? "");
        }), u(A, w);
      });
      var C = v(P, 2);
      {
        var T = (A) => {
          const S = V(() => s(l).find((Z) => Z.id === r()));
          var w = Ae(), R = re(w);
          {
            var B = (Z) => {
              var X = OT(), H = d(X), te = v(H);
              {
                var Y = ($) => {
                  var O = zT();
                  u($, O);
                };
                I(te, ($) => {
                  s(S).recommendedForEmailProcessing || $(Y);
                });
              }
              L(($) => E(H, `${s(S).description ?? ""}. Context: ${$ ?? ""} tokens. `), [() => s(S).contextWindow.toLocaleString()]), u(Z, X);
            };
            I(R, (Z) => {
              s(S) && Z(B);
            });
          }
          u(A, w);
        };
        I(C, (A) => {
          r() && A(T);
        });
      }
      var N = v(q, 2);
      {
        let A = V(() => s(i) || !o[s(a)]);
        tt(N, { type: "submit", get disabled() {
          return s(A);
        }, class: "w-full", children: (S, w) => {
          var R = Be();
          L(() => E(R, s(i) ? "Checking\u2026" : "Load Model")), u(S, R);
        }, $$slots: { default: true } });
      }
      var K = v(N, 2);
      {
        var W = (A) => {
          var S = DT(), w = d(S);
          L(() => E(w, n())), u(A, S);
        };
        I(K, (A) => {
          n() && A(W);
        });
      }
      L((A) => E(M, `Stored locally in IndexedDB. Sent only to ${A ?? ""}.`), [() => s(a).toUpperCase()]), Gh("submit", b, (A) => {
        A.preventDefault(), c();
      }), Rn(P, r), u(h, b);
    }, $$slots: { default: true } });
  }, $$slots: { default: true } }), Le();
}
var BT = _('<span class="text-sm font-semibold text-primary tabular-nums shrink-0 svelte-r5fnze"> </span>'), FT = _('<!> <div class="flex items-baseline gap-1.5 flex-wrap text-xs text-muted-foreground tabular-nums svelte-r5fnze"><span class="text-foreground font-medium svelte-r5fnze"> </span> <span class="opacity-30 svelte-r5fnze">/</span> <span class="opacity-60 svelte-r5fnze"> </span> <span class="text-[0.62rem] opacity-35 ml-1 svelte-r5fnze"> </span></div>', 1), UT = _('<span class="text-foreground font-medium svelte-r5fnze"> </span> <span class="opacity-35 ml-1 svelte-r5fnze"> </span>', 1), GT = _('<span class="italic opacity-50 svelte-r5fnze">downloading\u2026</span>'), WT = _('<div class="h-1 w-full bg-muted rounded-full overflow-hidden mb-2 svelte-r5fnze"><div class="h-full w-[30%] bg-primary rounded-full animate-[slide_1.5s_ease-in-out_infinite] svelte-r5fnze"></div></div> <div class="text-xs text-muted-foreground tabular-nums svelte-r5fnze"><!></div>', 1), VT = _('<div class="flex items-center justify-between gap-2 mb-2 svelte-r5fnze"><span class="text-xs text-muted-foreground truncate flex-1 min-w-0 svelte-r5fnze"> </span> <!></div> <!>', 1), HT = _('<div class="max-w-[520px] mx-auto p-8 flex flex-col items-center text-center gap-3 svelte-r5fnze"><p class="text-sm text-muted-foreground tracking-tight svelte-r5fnze"> </p> <!></div>');
function qT(t, e) {
  De(e, true);
  let r = ae(e, "message", 3, ""), n = ae(e, "items", 19, () => []);
  Xt(() => qa("LoadingProgress"));
  var a = HT(), o = d(a), i = d(o), l = v(o, 2);
  Ge(l, 17, n, Qe, (c, f) => {
    const p = V(() => s(f).total ? bb(s(f).loaded || 0, s(f).total) : null);
    Ra(c, { class: "w-full", children: (m, h) => {
      Ma(m, { class: "pt-4 pb-3 px-4", children: (x, b) => {
        var y = VT(), k = re(y), D = d(k), U = d(D), j = v(D, 2);
        {
          var M = (C) => {
            var T = BT(), N = d(T);
            L((K) => E(N, `${K ?? ""}%`), [() => s(p).toFixed(1)]), u(C, T);
          };
          I(j, (C) => {
            s(p) !== null && C(M);
          });
        }
        var q = v(k, 2);
        {
          var F = (C) => {
            var T = FT(), N = re(T);
            {
              let Z = V(() => s(p) ?? 0);
              Hl(N, { get value() {
                return s(Z);
              }, class: "h-1 mb-2" });
            }
            var K = v(N, 2), W = d(K), A = d(W), S = v(W, 4), w = d(S), R = v(S, 2), B = d(R);
            L((Z, X, H, te) => {
              E(A, Z), E(w, X), E(B, `(${H ?? ""} / ${te ?? ""} B)`);
            }, [() => Zi(s(f).loaded || 0), () => Zi(s(f).total), () => (s(f).loaded || 0).toLocaleString(), () => s(f).total.toLocaleString()]), u(C, T);
          }, P = (C) => {
            var T = WT(), N = v(re(T), 2), K = d(N);
            {
              var W = (S) => {
                var w = UT(), R = re(w), B = d(R), Z = v(R, 2), X = d(Z);
                L((H, te) => {
                  E(B, H), E(X, `(${te ?? ""} B)`);
                }, [() => Zi(s(f).loaded), () => s(f).loaded.toLocaleString()]), u(S, w);
              }, A = (S) => {
                var w = GT();
                u(S, w);
              };
              I(K, (S) => {
                s(f).loaded ? S(W) : S(A, -1);
              });
            }
            u(C, T);
          };
          I(q, (C) => {
            s(f).total ? C(F) : C(P, -1);
          });
        }
        L(() => {
          br(D, "title", s(f).file), E(U, s(f).file);
        }), u(x, y);
      }, $$slots: { default: true } });
    }, $$slots: { default: true } });
  }), L(() => E(i, r())), u(t, a), Le();
}
function YT(t, e) {
  De(e, true);
  let r = ae(e, "ref", 15, null), n = ae(e, "open", 15, false), a = ut(e, ["$$slots", "$$events", "$$legacy", "ref", "open"]);
  var o = Ae(), i = re(o);
  dr(i, () => b1, (l, c) => {
    c(l, et({ "data-slot": "collapsible" }, () => a, { get ref() {
      return r();
    }, set ref(f) {
      r(f);
    }, get open() {
      return n();
    }, set open(f) {
      n(f);
    } }));
  }), u(t, o), Le();
}
function KT(t, e) {
  De(e, true);
  let r = ae(e, "ref", 15, null), n = ut(e, ["$$slots", "$$events", "$$legacy", "ref"]);
  var a = Ae(), o = re(a);
  dr(o, () => k1, (i, l) => {
    l(i, et({ "data-slot": "collapsible-trigger" }, () => n, { get ref() {
      return r();
    }, set ref(c) {
      r(c);
    } }));
  }), u(t, a), Le();
}
function XT(t, e) {
  De(e, true);
  let r = ae(e, "ref", 15, null), n = ut(e, ["$$slots", "$$events", "$$legacy", "ref"]);
  var a = Ae(), o = re(a);
  dr(o, () => y1, (i, l) => {
    l(i, et({ "data-slot": "collapsible-content" }, () => n, { get ref() {
      return r();
    }, set ref(c) {
      r(c);
    } }));
  }), u(t, a), Le();
}
var ZT = _('<div class="flex justify-end py-0.5 svelte-11gjw00"><div class="max-w-[72%] bg-primary text-primary-foreground px-4 py-2 text-sm leading-relaxed word-break-words whitespace-pre-wrap tracking-tight svelte-11gjw00" style="border-radius: 18px 18px 4px 18px"> </div></div>'), JT = _('<span class="text-xs text-muted-foreground/30 svelte-11gjw00"> </span>'), QT = _('<span class="text-[0.62rem] tabular-nums not-italic opacity-60 ml-0.5 svelte-11gjw00"> </span>'), eA = _('<span class="inline-flex items-center gap-1.5 text-xs text-primary/60 italic svelte-11gjw00"><span class="size-1.5 rounded-full bg-primary animate-pulse svelte-11gjw00"></span> Thinking\u2026<!></span>'), tA = _('<span class="inline-flex items-center gap-1.5 text-xs text-muted-foreground/40 italic svelte-11gjw00"><span class="size-1.5 rounded-full bg-muted-foreground/40 animate-pulse svelte-11gjw00"></span> Preparing\u2026</span>'), rA = _('<span class="inline-flex items-center gap-1.5 text-xs text-primary/50 italic svelte-11gjw00"><span class="size-1.5 rounded-full bg-primary/50 animate-pulse svelte-11gjw00"></span> Generating\u2026</span>'), nA = _('<!> Internal reasoning <span class="text-[0.58rem] opacity-50 ml-0.5 svelte-11gjw00"> </span>', 1), aA = _('<pre class="text-[0.73rem] text-muted-foreground leading-relaxed px-3 py-2 rounded rounded-t-none border border-t-0 border-primary/15 bg-primary/[0.03] border-l-2 border-l-primary/15 max-h-[280px] overflow-y-auto whitespace-pre-wrap break-words font-[inherit] m-0 svelte-11gjw00"> </pre>'), sA = _("<!> <!>", 1), oA = _('<div class="flex gap-1 py-1.5 svelte-11gjw00"><span class="size-1.5 rounded-full bg-muted-foreground/30 animate-[dotBounce_1.2s_ease-in-out_infinite] svelte-11gjw00"></span> <span class="size-1.5 rounded-full bg-muted-foreground/30 animate-[dotBounce_1.2s_ease-in-out_0.18s_infinite] svelte-11gjw00"></span> <span class="size-1.5 rounded-full bg-muted-foreground/30 animate-[dotBounce_1.2s_ease-in-out_0.36s_infinite] svelte-11gjw00"></span></div>'), iA = _('<span class="cursor svelte-11gjw00">\u258B</span>'), lA = _('<div class="md-body svelte-11gjw00"><!><!></div>'), cA = _('<span class="cursor svelte-11gjw00">\u258B</span>'), dA = _('<div class="md-body plain svelte-11gjw00"> <!></div>'), uA = _('<div class="flex flex-col gap-1.5 py-2.5 pb-3 border-b border-border last:border-b-0 svelte-11gjw00"><div class="flex items-center gap-2 flex-wrap svelte-11gjw00"><span class="text-[0.65rem] font-bold uppercase tracking-wider px-1.5 py-px rounded border shrink-0 svelte-11gjw00"> </span> <!> <!></div> <!> <div class="min-h-[1.2em] svelte-11gjw00"><!></div></div>');
function fA(t, e) {
  De(e, true);
  let r = ae(e, "isLast", 3, false), n = ae(e, "isRunning", 3, false), a = ae(e, "generationPhase", 3, null), o = ae(e, "numTokens", 3, null), i = ae(e, "backend", 3, null), l = ae(e, "showModelName", 3, false);
  Xt(() => qa(`MessageBubble[${e.msg.role}]`));
  const c = { webgpu: "WebGPU", ollama: "Ollama", openai: "OpenAI", anthropic: "Claude", google: "Gemini", xai: "Grok" }, f = { webgpu: "#4ade80", ollama: "#a78bfa", openai: "#10b981", anthropic: "#f59e0b", google: "#3b82f6", xai: "#e8e8e8" };
  let p = V(() => i() ? c[i()] ?? i() : "AI"), m = V(() => i() ? f[i()] ?? "#888" : "#888"), h = V(() => {
    if (!e.msg.model) return null;
    const M = Ti(e.msg.model);
    return M ? M.name : e.msg.model.split("/").pop().replace(/[-_](ONNX|onnx)([-_](GQA|MHA|web|DQ))*$/i, "").replace(/[-_]/g, " ").trim();
  }), x = V(() => {
    if (e.msg.role !== "assistant" || !e.msg.content) return "";
    try {
      const M = Mt.parse(e.msg.content, { breaks: true, gfm: true });
      return Wl.sanitize(M);
    } catch {
      return e.msg.content;
    }
  }), b = V(() => n() && r()), y = ee(false);
  var k = Ae(), D = re(k);
  {
    var U = (M) => {
      var q = ZT(), F = d(q), P = d(F);
      L(() => E(P, e.msg.content)), u(M, q);
    }, j = (M) => {
      var q = uA(), F = d(q), P = d(F);
      let C;
      var T = d(P), N = v(P, 2);
      {
        var K = ($) => {
          var O = JT(), G = d(O);
          L(() => E(G, s(h))), u($, O);
        };
        I(N, ($) => {
          l() && s(h) && $(K);
        });
      }
      var W = v(N, 2);
      {
        var A = ($) => {
          var O = eA(), G = v(d(O), 2);
          {
            var J = (se) => {
              var ie = QT(), oe = d(ie);
              L(() => E(oe, `${o() ?? ""} tok`)), u(se, ie);
            };
            I(G, (se) => {
              o() && se(J);
            });
          }
          u($, O);
        }, S = ($) => {
          var O = tA();
          u($, O);
        }, w = ($) => {
          var O = rA();
          u($, O);
        };
        I(W, ($) => {
          s(b) && a() === "thinking" ? $(A) : s(b) && a() === "preparing" ? $(S, 1) : s(b) && a() === "generating" && $(w, 2);
        });
      }
      var R = v(F, 2);
      {
        var B = ($) => {
          var O = Ae(), G = re(O);
          dr(G, () => YT, (J, se) => {
            se(J, { class: "mt-0.5", get open() {
              return s(y);
            }, set open(ie) {
              g(y, ie, true);
            }, children: (ie, oe) => {
              var de = sA(), ve = re(de);
              {
                let ke = V(() => Je("inline-flex items-center gap-1.5 cursor-pointer text-[0.72rem] text-primary/60 hover:text-primary/90 px-2 py-1 rounded border border-primary/15 bg-primary/5 transition-colors select-none w-full text-left", s(y) && "rounded-b-none"));
                dr(ve, () => KT, (ye, we) => {
                  we(ye, { get class() {
                    return s(ke);
                  }, children: (le, ce) => {
                    var pe = nA(), ge = re(pe);
                    {
                      let ue = V(() => Je("size-3 shrink-0 transition-transform", s(y) && "rotate-90"));
                      vg(ge, { get class() {
                        return s(ue);
                      } });
                    }
                    var Te = v(ge, 2), he = d(Te);
                    L((ue) => E(he, `${ue ?? ""} words`), [() => e.msg.thinking.split(/\s+/).filter(Boolean).length]), u(le, pe);
                  }, $$slots: { default: true } });
                });
              }
              var me = v(ve, 2);
              dr(me, () => XT, (ke, ye) => {
                ye(ke, { children: (we, le) => {
                  var ce = aA(), pe = d(ce);
                  L(() => E(pe, e.msg.thinking)), u(we, ce);
                }, $$slots: { default: true } });
              }), u(ie, de);
            }, $$slots: { default: true } });
          }), u($, O);
        };
        I(R, ($) => {
          e.msg.thinking && $(B);
        });
      }
      var Z = v(R, 2), X = d(Z);
      {
        var H = ($) => {
          var O = oA();
          u($, O);
        }, te = ($) => {
          var O = lA(), G = d(O);
          fc(G, () => s(x));
          var J = v(G);
          {
            var se = (ie) => {
              var oe = iA();
              u(ie, oe);
            };
            I(J, (ie) => {
              s(b) && ie(se);
            });
          }
          u($, O);
        }, Y = ($) => {
          var O = dA(), G = d(O), J = v(G);
          {
            var se = (ie) => {
              var oe = cA();
              u(ie, oe);
            };
            I(J, (ie) => {
              s(b) && ie(se);
            });
          }
          L(() => E(G, e.msg.content)), u($, O);
        };
        I(X, ($) => {
          s(b) && !e.msg.content && a() !== "thinking" ? $(H) : s(x) ? $(te, 1) : e.msg.content && $(Y, 2);
        });
      }
      L(() => {
        C = Rt(P, "", C, { color: s(m), "border-color": "color-mix(in srgb," + s(m) + " 28%, transparent)", background: "color-mix(in srgb," + s(m) + " 8%, transparent)" }), E(T, s(p));
      }), u(M, q);
    };
    I(D, (M) => {
      e.msg.role === "user" ? M(U) : M(j, -1);
    });
  }
  u(t, k), Le();
}
Zt(["click"]);
var pA = dn('<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="3" width="20" height="14" rx="2"></rect><path d="M8 21h8M12 17v4"></path></svg>'), vA = dn('<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-success"><polyline points="20 6 9 17 4 12"></polyline></svg>'), gA = dn('<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-destructive"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>'), mA = _('<span class="inline-flex items-center gap-1 text-[0.64rem] font-semibold px-1.5 py-px rounded border shrink-0"><svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"></path></svg> </span>'), hA = _('<div class="px-3.5 py-2.5 text-[0.8rem] text-muted-foreground leading-relaxed border-t border-border whitespace-pre-wrap"> </div>'), _A = _('<span class="size-2.5 rounded-full border border-border border-t-primary animate-spin"></span>'), bA = dn('<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>'), xA = dn('<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'), yA = dn('<svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="4"></circle></svg>'), wA = _('<span class="text-[0.58rem] font-bold uppercase tracking-wider px-1.5 py-px rounded border"> </span>'), kA = _('<span class="flex gap-1 shrink-0"></span>'), SA = _("<span><!> <!></span>"), TA = dn('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>'), AA = _("<span><!></span> <span> </span> <!> <!> <!>", 1), EA = _('<button class="flex items-center gap-2 w-full px-3.5 py-2 text-left hover:bg-accent transition-colors"><!></button>'), CA = _('<div class="flex items-center gap-2 px-3.5 py-2"><!></div>'), IA = _('<img alt="screenshot" class="max-w-[260px] w-full rounded border border-border"/>'), PA = _('<span class="text-[0.63rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded border"> </span>'), $A = _('<div class="flex flex-wrap gap-1.5"></div>'), NA = _('<pre class="font-[inherit] text-[0.74rem] text-muted-foreground leading-relaxed whitespace-pre-wrap break-words m-0"> </pre>'), RA = _('<div class="px-3.5 pb-2.5 pt-1 pl-9 border-t border-border bg-foreground/[0.01] flex flex-col gap-2"><!> <!> <!></div>'), MA = _('<div class="border-b border-border last:border-b-0"><!> <!></div>'), zA = _('<div class="pr-2"></div>'), OA = _("<!> <!>", 1), DA = _('<div><button class="w-full flex items-center gap-2 px-3.5 py-2.5 bg-transparent hover:bg-accent transition-colors text-left"><span><!></span> <span class="flex-1 text-[0.82rem] font-medium text-foreground/85 truncate tracking-tight"> </span> <!> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg></button> <!></div>');
function Go(t, e) {
  De(e, true);
  const r = { webgpu: "WebGPU", ollama: "Ollama", openai: "GPT", anthropic: "Claude", google: "Gemini", xai: "Grok" }, n = { webgpu: "#4ade80", ollama: "#a78bfa", openai: "#10b981", anthropic: "#f59e0b", google: "#3b82f6", xai: "#e2e2e2" }, a = { NOISE: { bg: "color-mix(in srgb, #9ca3af 10%, transparent)", text: "#9ca3af", border: "color-mix(in srgb, #9ca3af 20%, transparent)" }, INFO: { bg: "color-mix(in srgb, #60a5fa 10%, transparent)", text: "#60a5fa", border: "color-mix(in srgb, #60a5fa 20%, transparent)" }, CRITICAL: { bg: "color-mix(in srgb, #ef4444 10%, transparent)", text: "#ef4444", border: "color-mix(in srgb, #ef4444 20%, transparent)" }, COMMAND: { bg: "color-mix(in srgb, #fbbf24 10%, transparent)", text: "#fbbf24", border: "color-mix(in srgb, #fbbf24 20%, transparent)" } };
  let o = ee(true), i = ee(nt(/* @__PURE__ */ new Set()));
  function l() {
    g(o, !s(o));
  }
  function c(A) {
    const S = new Set(s(i));
    S.has(A) ? S.delete(A) : S.add(A), g(i, S, true);
  }
  let f = V(() => e.msg.model ? r[e.msg.model] ?? e.msg.model : null), p = V(() => e.msg.model ? n[e.msg.model] ?? "#888" : "#888");
  function m(A) {
    if (!A) return "";
    const S = Math.round((Date.now() - A) / 1e3);
    return S < 60 ? `${S}s` : `${Math.floor(S / 60)}m ${S % 60}s`;
  }
  function h(A) {
    return a[A] ?? { bg: "color-mix(in srgb, white 4%, transparent)", text: "var(--color-muted-foreground)", border: "color-mix(in srgb, white 8%, transparent)" };
  }
  function x(A) {
    return { running: "text-foreground/70", done: "text-muted-foreground/40", error: "text-destructive", pending: "text-muted-foreground/25" }[A] ?? "text-muted-foreground/40";
  }
  function b(A) {
    return { running: "text-primary", done: "text-success", error: "text-destructive", pending: "text-muted-foreground/25" }[A] ?? "text-muted-foreground/25";
  }
  var y = DA(), k = d(y), D = d(k), U = d(D);
  {
    var j = (A) => {
      var S = pA();
      u(A, S);
    }, M = (A) => {
      var S = vA();
      u(A, S);
    }, q = (A) => {
      var S = gA();
      u(A, S);
    };
    I(U, (A) => {
      e.msg.status === "running" ? A(j) : e.msg.status === "done" ? A(M, 1) : A(q, -1);
    });
  }
  var F = v(D, 2), P = d(F), C = v(F, 2);
  {
    var T = (A) => {
      var S = mA();
      let w;
      var R = v(d(S));
      L(() => {
        w = Rt(S, "", w, { color: s(p), "border-color": "color-mix(in srgb," + s(p) + " 22%, transparent)", background: "color-mix(in srgb," + s(p) + " 7%, transparent)" }), E(R, ` ${s(f) ?? ""}`);
      }), u(A, S);
    };
    I(C, (A) => {
      s(f) && A(T);
    });
  }
  var N = v(C, 2), K = v(k, 2);
  {
    var W = (A) => {
      var S = OA(), w = re(S);
      {
        var R = (X) => {
          var H = hA(), te = d(H);
          L(() => E(te, e.msg.description)), u(X, H);
        };
        I(w, (X) => {
          e.msg.description && X(R);
        });
      }
      var B = v(w, 2);
      {
        var Z = (X) => {
          Ln(X, { class: "border-t border-border h-[min(320px,50vh)]", children: (H, te) => {
            var Y = zA();
            Ge(Y, 21, () => e.msg.steps, ($) => $.id, ($, O) => {
              const G = V(() => s(i).has(s(O).id)), J = V(() => {
                var _a10;
                return s(O).expandable && (s(O).subContent || s(O).thumbnail || ((_a10 = s(O).badges) == null ? void 0 : _a10.length));
              });
              var se = MA();
              {
                const ke = (ye) => {
                  var we = AA(), le = re(we), ce = d(le);
                  {
                    var pe = (be) => {
                      var _e40 = _A();
                      u(be, _e40);
                    }, ge = (be) => {
                      var _e40 = bA();
                      u(be, _e40);
                    }, Te = (be) => {
                      var _e40 = xA();
                      u(be, _e40);
                    }, he = (be) => {
                      var _e40 = yA();
                      u(be, _e40);
                    };
                    I(ce, (be) => {
                      s(O).status === "running" ? be(pe) : s(O).status === "done" ? be(ge, 1) : s(O).status === "error" ? be(Te, 2) : be(he, -1);
                    });
                  }
                  var ue = v(le, 2), Ee = d(ue), xe = v(ue, 2);
                  {
                    var Se = (be) => {
                      var _e40 = kA();
                      Ge(_e40, 21, () => s(O).badges, Qe, ($e, Ce) => {
                        const ze = V(() => h(s(Ce)));
                        var Re = wA();
                        let je;
                        var Ve = d(Re);
                        L(() => {
                          je = Rt(Re, "", je, { background: s(ze).bg, color: s(ze).text, "border-color": s(ze).border }), E(Ve, s(Ce));
                        }), u($e, Re);
                      }), u(be, _e40);
                    };
                    I(xe, (be) => {
                      var _a10;
                      ((_a10 = s(O).badges) == null ? void 0 : _a10.length) && be(Se);
                    });
                  }
                  var Fe = v(xe, 2);
                  {
                    var qe = (be) => {
                      var _e40 = SA(), $e = d(_e40);
                      {
                        var Ce = (je) => {
                          var Ve = Be();
                          L(() => E(Ve, s(O).detail)), u(je, Ve);
                        };
                        I($e, (je) => {
                          s(O).detail && je(Ce);
                        });
                      }
                      var ze = v($e, 2);
                      {
                        var Re = (je) => {
                          var Ve = Be();
                          L((st) => E(Ve, `\xB7 ${st ?? ""}`), [() => m(s(O).startedAt)]), u(je, Ve);
                        };
                        I(ze, (je) => {
                          s(O).startedAt && s(O).status === "running" && je(Re);
                        });
                      }
                      L((je) => rt(_e40, 1, je), [() => Et(Je("text-[0.68rem] tabular-nums shrink-0", x(s(O).status)))]), u(be, _e40);
                    };
                    I(Fe, (be) => {
                      (s(O).detail || s(O).startedAt && s(O).status === "running") && be(qe);
                    });
                  }
                  var ne = v(Fe, 2);
                  {
                    var fe = (be) => {
                      var _e40 = TA();
                      L(($e) => rt(_e40, 0, $e), [() => Et(Je("size-2.5 text-muted-foreground/30 shrink-0 transition-transform", s(G) && "rotate-180"))]), u(be, _e40);
                    };
                    I(ne, (be) => {
                      s(J) && be(fe);
                    });
                  }
                  L((be, _e40) => {
                    rt(le, 1, be), rt(ue, 1, _e40), E(Ee, s(O).label);
                  }, [() => Et(Je("size-4 flex items-center justify-center shrink-0", b(s(O).status))), () => Et(Je("flex-1 min-w-0 truncate text-[0.78rem]", x(s(O).status)))]), u(ye, we);
                };
                var ie = d(se);
                {
                  var oe = (ye) => {
                    var we = EA(), le = d(we);
                    ke(le), Pe("click", we, () => c(s(O).id)), u(ye, we);
                  }, de = (ye) => {
                    var we = CA(), le = d(we);
                    ke(le), u(ye, we);
                  };
                  I(ie, (ye) => {
                    s(J) ? ye(oe) : ye(de, -1);
                  });
                }
                var ve = v(ie, 2);
                {
                  var me = (ye) => {
                    var we = RA(), le = d(we);
                    {
                      var ce = (ue) => {
                        var Ee = IA();
                        L(() => br(Ee, "src", s(O).thumbnail)), u(ue, Ee);
                      };
                      I(le, (ue) => {
                        s(O).thumbnail && ue(ce);
                      });
                    }
                    var pe = v(le, 2);
                    {
                      var ge = (ue) => {
                        var Ee = $A();
                        Ge(Ee, 21, () => s(O).badges, Qe, (xe, Se) => {
                          const Fe = V(() => h(s(Se)));
                          var qe = PA();
                          let ne;
                          var fe = d(qe);
                          L(() => {
                            ne = Rt(qe, "", ne, { background: s(Fe).bg, color: s(Fe).text, "border-color": s(Fe).border }), E(fe, s(Se));
                          }), u(xe, qe);
                        }), u(ue, Ee);
                      };
                      I(pe, (ue) => {
                        var _a10;
                        ((_a10 = s(O).badges) == null ? void 0 : _a10.length) && ue(ge);
                      });
                    }
                    var Te = v(pe, 2);
                    {
                      var he = (ue) => {
                        var Ee = NA(), xe = d(Ee);
                        L(() => E(xe, s(O).subContent)), u(ue, Ee);
                      };
                      I(Te, (ue) => {
                        s(O).subContent && ue(he);
                      });
                    }
                    u(ye, we);
                  };
                  I(ve, (ye) => {
                    s(J) && s(G) && ye(me);
                  });
                }
              }
              u($, se);
            }), u(H, Y);
          }, $$slots: { default: true } });
        };
        I(B, (X) => {
          var _a10;
          ((_a10 = e.msg.steps) == null ? void 0 : _a10.length) > 0 && X(Z);
        });
      }
      u(A, S);
    };
    I(K, (A) => {
      s(o) && A(W);
    });
  }
  L((A, S, w) => {
    rt(y, 1, A), rt(D, 1, S), E(P, e.msg.title), rt(N, 0, w);
  }, [() => Et(Je("w-full max-w-[680px] rounded border overflow-hidden text-[0.82rem] bg-card transition-colors self-start", e.msg.status === "done" ? "border-success/15" : e.msg.status === "error" ? "border-destructive/15" : "border-border")), () => Et(Je("size-[22px] flex items-center justify-center rounded shrink-0", "bg-foreground/4 border border-foreground/6", e.msg.status === "running" && "text-primary animate-pulse")), () => Et(Je("size-3 text-muted-foreground/30 shrink-0 transition-transform", s(o) && "rotate-180"))]), Pe("click", k, l), u(t, y), Le();
}
Zt(["click"]);
var LA = _('<p class="text-[0.62rem] text-muted-foreground leading-relaxed"></p>'), jA = _("<span> </span>"), BA = _('<span class="opacity-60"> </span>'), FA = _('<li><!> <strong class="text-foreground/70"> </strong> <!></li>'), UA = _('<ul class="list-disc pl-4 text-[0.6rem] text-muted-foreground space-y-0.5"></ul>'), GA = _('<div><div class="flex items-center gap-1.5"><span class="text-sm">\u26A0\uFE0F</span> <span class="text-xs font-bold text-warning"> </span></div> <!> <!> <div class="flex gap-1.5"><!> <!></div></div>'), WA = _('<span class="text-[0.66rem] text-muted-foreground truncate flex-1"> </span>'), VA = _('<div class="text-[0.76rem] font-medium text-foreground leading-snug"> </div>'), HA = _('<span class="opacity-70"> </span>'), qA = _('<div class="text-[0.58rem] text-muted-foreground/40"><!> <!></div>'), YA = _('<div class="text-[0.66rem] text-muted-foreground/70 leading-relaxed"> </div>'), KA = _('<span class="text-[0.52rem] font-semibold text-muted-foreground bg-foreground/4 px-1.5 py-0.5 rounded"> </span>'), XA = _('<div class="flex flex-wrap gap-1"></div>'), ZA = _('<div class="text-[0.58rem] text-muted-foreground/40 italic"> </div>'), JA = _('<div><div class="flex items-center gap-2"><span class="text-[0.55rem] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-success/8 text-success"> </span> <span class="text-[0.52rem] uppercase tracking-wide text-muted-foreground/40"> </span> <!></div> <!> <!> <!> <!> <!></div>'), QA = _('<div class="mt-1 w-full"><!></div>'), e4 = _('<div class="flex items-center justify-between gap-2"><span class="text-[0.55rem] font-bold uppercase tracking-wider text-muted-foreground/35">Action Pipeline</span> <!></div> <!> <!> <!>', 1), t4 = _('<div class="self-start max-w-[90%] flex flex-col gap-1.5"><!> <!></div>'), r4 = _('<div class="rounded border border-border bg-background px-3 py-2.5 flex flex-col gap-1.5"><!> <!></div>'), n4 = _('<div class="self-start max-w-[90%] flex flex-col gap-2"><p class="text-[0.68rem] font-semibold uppercase tracking-wider text-muted-foreground/50"> </p> <!></div>'), a4 = _('<span class="text-[0.5rem] font-bold uppercase tracking-wider shrink-0"> </span>'), s4 = _('<div class="px-3 pb-3"><!></div>'), o4 = _('<div class="px-3 pb-3"><!></div>'), i4 = _('<span class="opacity-70"> </span>'), l4 = _('<span class="opacity-50"> </span>'), c4 = _('<div class="text-[0.63rem] text-muted-foreground/60 leading-relaxed mt-0.5"> </div>'), d4 = _('<span class="text-[0.52rem] font-semibold text-muted-foreground bg-foreground/4 px-1.5 py-0.5 rounded"> </span>'), u4 = _('<div class="flex flex-wrap gap-1 mt-0.5"></div>'), f4 = _('<p class="text-[0.58rem] text-muted-foreground/35 italic">No actions defined \u2014 configure in Control Board</p>'), p4 = _('<div class="mt-0.5"><!></div>'), v4 = _('<div class="flex flex-col gap-2 px-3.5 py-2.5 border-b border-border last:border-b-0"><div class="flex flex-col gap-0.5"><div class="text-[0.73rem] font-medium text-foreground leading-snug"> </div> <div class="text-[0.58rem] text-muted-foreground/40"><!> <!></div> <!> <!></div> <div class="flex flex-col gap-1.5"><div class="flex items-center justify-between gap-2"><span class="text-[0.55rem] font-bold uppercase tracking-wider text-muted-foreground/35">Action Pipeline</span> <!></div> <!> <!> <!></div></div>'), g4 = _('<div class="border-t border-border flex flex-col"></div>'), m4 = _('<div class="rounded border border-border bg-card overflow-hidden"><div class="flex items-center gap-2 px-1 py-0.5"><button class="flex items-center gap-2 flex-1 px-3 py-2.5 text-left hover:bg-accent transition-colors"><span class="text-[0.58rem] font-bold tracking-wider px-1.5 py-0.5 rounded text-white shrink-0"> </span> <!> <span class="text-sm font-semibold text-foreground min-w-[18px]"> </span> <span class="flex-1"></span> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg></button> <!></div> <!> <!> <!></div>'), h4 = _('<div class="self-start w-full max-w-[95%] flex flex-col gap-2"><div class="flex items-baseline gap-3 py-1"><span class="text-xs font-bold uppercase tracking-wider text-foreground">Events</span> <span class="text-[0.62rem] text-muted-foreground/40"> </span></div> <!></div>');
function _4(t, e) {
  De(e, true);
  const r = (T, N = vt, K = vt, W = vt, A = vt, S = vt) => {
    {
      let w = V(() => {
        var _a10;
        return Je("h-6 text-[0.6rem] font-bold uppercase tracking-wider px-2 shrink-0 pointer-events-auto", K() ? "text-warning border-warning/25 bg-warning/6 hover:bg-warning/12 hover:border-warning/40" : "text-primary border-primary/25 bg-primary/6 hover:bg-primary/12 hover:border-primary/40", ((_a10 = A()) == null ? void 0 : _a10.success) && "hover:opacity-80 !border-green-500/50 !text-green-500 !bg-green-500/10 cursor-pointer !ring-0 !ring-offset-0");
      });
      tt(T, { variant: "outline", size: "sm", onclick: () => {
        var _a10, _b4, _c6;
        ((_a10 = A()) == null ? void 0 : _a10.success) ? ((_b4 = e.onexecuted) == null ? void 0 : _b4.call(e), (_c6 = e.ondismiss) == null ? void 0 : _c6.call(e)) : S()();
      }, get disabled() {
        return W();
      }, get class() {
        return s(w);
      }, children: (R, B) => {
        var Z = Ae(), X = re(Z);
        {
          var H = (O) => {
            var G = Be("Running\u2026");
            u(O, G);
          }, te = (O) => {
            var G = Be();
            L(() => E(G, A().success ? "Done (Dismiss)" : "Failed")), u(O, G);
          }, Y = (O) => {
            var G = Be("Review");
            u(O, G);
          }, $ = (O) => {
            var G = Be();
            L(() => E(G, N())), u(O, G);
          };
          I(X, (O) => {
            W() ? O(H) : A() ? O(te, 1) : K() ? O(Y, 2) : O($, -1);
          });
        }
        u(R, Z);
      }, $$slots: { default: true } });
    }
  }, n = (T, N = vt, K = vt, W = vt, A = vt, S = vt) => {
    var w = GA(), R = d(w), B = v(d(R), 2), Z = d(B), X = v(R, 2);
    {
      var H = (J) => {
        var se = LA();
        fc(se, K, true), u(J, se);
      };
      I(X, (J) => {
        K() && J(H);
      });
    }
    var te = v(X, 2);
    {
      var Y = (J) => {
        var se = UA();
        Ge(se, 21, W, Qe, (ie, oe) => {
          var de = FA(), ve = d(de);
          {
            var me = (ce) => {
              var pe = jA(), ge = d(pe);
              L(() => E(ge, s(oe).icon)), u(ce, pe);
            };
            I(ve, (ce) => {
              s(oe).icon && ce(me);
            });
          }
          var ke = v(ve, 2), ye = d(ke), we = v(ke, 2);
          {
            var le = (ce) => {
              var pe = BA(), ge = d(pe);
              L(() => E(ge, `\u2014 ${s(oe).description ?? ""}`)), u(ce, pe);
            };
            I(we, (ce) => {
              s(oe).description && ce(le);
            });
          }
          L(() => E(ye, s(oe).name)), u(ie, de);
        }), u(J, se);
      };
      I(te, (J) => {
        var _a10;
        ((_a10 = W()) == null ? void 0 : _a10.length) && J(Y);
      });
    }
    var $ = v(te, 2), O = d($);
    tt(O, { variant: "outline", size: "sm", onclick: () => b(A()), class: "h-6 text-[0.6rem] font-bold text-warning border-warning/30 bg-warning/10 hover:bg-warning/20 px-2", children: (J, se) => {
      var ie = Be("\u2713 Confirm");
      u(J, ie);
    }, $$slots: { default: true } });
    var G = v(O, 2);
    tt(G, { variant: "ghost", size: "sm", onclick: () => y(A()), class: "h-6 text-[0.6rem] opacity-60 hover:opacity-100 px-2", children: (J, se) => {
      var ie = Be("Cancel");
      u(J, ie);
    }, $$slots: { default: true } }), L((J) => {
      rt(w, 1, J), E(Z, N());
    }, [() => Et(Je("rounded border border-warning/25 bg-warning/6", S() ? "flex flex-wrap items-center gap-2 px-3 py-2" : "flex flex-col gap-2 px-3 py-2.5"))]), u(T, w);
  }, a = (T, N = vt, K = vt) => {
    var W = JA(), A = d(W), S = d(A), w = d(S), R = v(S, 2), B = d(R), Z = v(R, 2);
    {
      var X = (de) => {
        var ve = WA(), me = d(ve);
        L(() => E(me, N().data.subject)), u(de, ve);
      };
      I(Z, (de) => {
        var _a10;
        K() && ((_a10 = N().data) == null ? void 0 : _a10.subject) && de(X);
      });
    }
    var H = v(A, 2);
    {
      var te = (de) => {
        var ve = VA(), me = d(ve);
        L(() => E(me, N().data.subject)), u(de, ve);
      };
      I(H, (de) => {
        var _a10;
        !K() && ((_a10 = N().data) == null ? void 0 : _a10.subject) && de(te);
      });
    }
    var Y = v(H, 2);
    {
      var $ = (de) => {
        var ve = qA(), me = d(ve);
        {
          var ke = (le) => {
            var ce = Be();
            L((pe) => E(ce, pe), [() => f(N().data.from)]), u(le, ce);
          };
          I(me, (le) => {
            var _a10;
            ((_a10 = N().data) == null ? void 0 : _a10.from) && le(ke);
          });
        }
        var ye = v(me, 2);
        {
          var we = (le) => {
            var ce = HA(), pe = d(ce);
            L((ge) => E(pe, `\xB7 ${ge ?? ""}`), [() => p(N().data.date)]), u(le, ce);
          };
          I(ye, (le) => {
            var _a10;
            ((_a10 = N().data) == null ? void 0 : _a10.date) && le(we);
          });
        }
        u(de, ve);
      };
      I(Y, (de) => {
        var _a10, _b4;
        (((_a10 = N().data) == null ? void 0 : _a10.from) || ((_b4 = N().data) == null ? void 0 : _b4.date)) && de($);
      });
    }
    var O = v(Y, 2);
    {
      var G = (de) => {
        var ve = YA(), me = d(ve);
        L(() => E(me, N().metadata.summary)), u(de, ve);
      };
      I(O, (de) => {
        var _a10;
        ((_a10 = N().metadata) == null ? void 0 : _a10.summary) && de(G);
      });
    }
    var J = v(O, 2);
    {
      var se = (de) => {
        var ve = XA();
        Ge(ve, 21, () => N().metadata.tags, Qe, (me, ke) => {
          var ye = KA(), we = d(ye);
          L(() => E(we, s(ke))), u(me, ye);
        }), u(de, ve);
      };
      I(J, (de) => {
        var _a10, _b4;
        ((_b4 = (_a10 = N().metadata) == null ? void 0 : _a10.tags) == null ? void 0 : _b4.length) && de(se);
      });
    }
    var ie = v(J, 2);
    {
      var oe = (de) => {
        var ve = ZA(), me = d(ve);
        L(() => E(me, N().metadata.reason)), u(de, ve);
      };
      I(ie, (de) => {
        var _a10;
        ((_a10 = N().metadata) == null ? void 0 : _a10.reason) && de(oe);
      });
    }
    L((de) => {
      rt(W, 1, de), E(w, N().type), E(B, N().source);
    }, [() => Et(Je("rounded border border-border flex flex-col gap-1", K() ? "bg-transparent border-none p-0" : "bg-card px-3 py-2.5"))]), u(T, W);
  };
  let o = ee(nt({})), i = nt({}), l = ee(nt({})), c = ee(nt({}));
  function f(T) {
    if (!T) return "\u2014";
    const N = T.replace(/<.*>/, "").trim();
    return N.length > 40 ? N.slice(0, 38) + "\u2026" : N;
  }
  function p(T) {
    if (!T) return "";
    try {
      return new Date(T).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
    } catch {
      return "";
    }
  }
  function m(T, N, K) {
    var _a10;
    const W = s(c)[T] ?? { type: "task-card", role: "assistant", title: K, model: null, status: "running", steps: [] };
    if (N.phase === "pipeline_loaded") W.steps = N.actions.map((A) => ({ id: A.id ?? A.commandId, label: A.name ?? A.commandId, status: "pending" }));
    else if (N.phase === "action_start") W.steps = W.steps.map((A) => A.id === (N.actionId ?? N.commandId) ? { ...A, status: "running", startedAt: Date.now() } : A);
    else if (N.phase === "action_complete") {
      const A = ((_a10 = N.result) == null ? void 0 : _a10.success) !== false;
      W.steps = W.steps.map((S) => {
        var _a11, _b4;
        return S.id === (N.actionId ?? N.commandId) ? { ...S, status: A ? "done" : "error", expandable: !!((_a11 = N.result) == null ? void 0 : _a11.message), subContent: ((_b4 = N.result) == null ? void 0 : _b4.message) ?? "" } : S;
      });
    } else N.phase === "done" ? W.status = W.steps.every((A) => A.status !== "error") ? "done" : "error" : N.phase === "error" && (W.status = "error", W.steps = [...W.steps.filter((A) => A.status !== "running"), { id: "__err", label: N.error ?? "Execution failed", status: "error" }]);
    g(c, { ...s(c), [T]: { ...W } }, true);
  }
  async function h(T, N, K = false) {
    var _a10, _b4;
    if (!await Ko()) {
      alert("Please sign in to Gmail first (Dashboard page)");
      return;
    }
    const W = `single_${N}`, A = ((_a10 = T.data) == null ? void 0 : _a10.subject) ?? T.type, S = A.length > 38 ? A.slice(0, 36) + "\u2026" : A;
    i[W] = { running: true, progress: null, result: null }, g(c, { ...s(c), [W]: { type: "task-card", role: "assistant", title: S, model: null, status: "running", steps: [] } }, true);
    try {
      const w = await co(T, (R) => {
        i[W] = { ...i[W], progress: R }, m(W, R, S);
      }, K);
      if (w.requiresApproval) {
        i[W] = { running: false, progress: null, result: null }, delete s(c)[W], g(c, { ...s(c) }, true), s(l)[W] = { event: T, emailId: N, actions: w.actions, category: w.category, isBatch: false };
        return;
      }
      i[W] = { running: false, progress: null, result: w }, w.success && ((_b4 = e.onexecuted) == null ? void 0 : _b4.call(e));
    } catch (w) {
      i[W] = { running: false, progress: null, result: { success: false, message: w.message } }, m(W, { phase: "error", error: w.message }, S);
    }
  }
  async function x(T, N, K = false) {
    var _a10;
    if (!await Ko()) {
      alert("Please sign in to Gmail first (Dashboard page)");
      return;
    }
    const W = `batch_${T}`, A = `${D(T)} (${N.length})`;
    i[W] = { running: true, progress: null, result: null }, g(c, { ...s(c), [W]: { type: "task-card", role: "assistant", title: A, model: null, status: "running", steps: [] } }, true);
    try {
      const S = await $c(T, N, (w) => {
        i[W] = { ...i[W], progress: w }, m(W, w, A);
      }, K);
      if (S.requiresApproval) {
        i[W] = { running: false, progress: null, result: null }, delete s(c)[W], g(c, { ...s(c) }, true), s(l)[W] = { eventType: T, emails: N, actions: S.actions, category: S.category, isBatch: true };
        return;
      }
      i[W] = { running: false, progress: null, result: S }, S.success && ((_a10 = e.onexecuted) == null ? void 0 : _a10.call(e));
    } catch (S) {
      i[W] = { running: false, progress: null, result: { success: false, message: S.message } }, m(W, { phase: "error", error: S.message }, A);
    }
  }
  async function b(T) {
    const N = s(l)[T];
    N && (delete s(l)[T], g(l, { ...s(l) }, true), N.isBatch ? await x(N.eventType, N.emails, true) : await h(N.event, N.emailId, true));
  }
  function y(T) {
    delete s(l)[T], g(l, { ...s(l) }, true);
  }
  function k(T) {
    g(o, { ...s(o), [T]: !s(o)[T] }, true);
  }
  function D(T) {
    return T.split("_").map((N) => N.charAt(0) + N.slice(1).toLowerCase()).join(" ");
  }
  function U(T) {
    return `hsl(${Rc(T)}, 55%, 55%)`;
  }
  function j(T) {
    return i[T];
  }
  var M = Ae(), q = re(M);
  {
    var F = (T) => {
      var N = t4(), K = d(N);
      a(K, () => e.msg.event, () => false);
      var W = v(K, 2);
      {
        var A = (S) => {
          const w = V(() => `single_${e.msg.event.data.emailId || Date.now()}`), R = V(() => j(s(w))), B = V(() => s(l)[s(w)]), Z = V(() => {
            var _a10;
            return ((_a10 = e.msg.event.metadata) == null ? void 0 : _a10.category) ? In[e.msg.event.metadata.category] || In.CRITICAL : null;
          });
          var X = e4(), H = re(X), te = v(d(H), 2);
          {
            var Y = (ie) => {
              r(ie, () => "Execute", () => {
                var _a10;
                return (_a10 = s(Z)) == null ? void 0 : _a10.requiresApproval;
              }, () => {
                var _a10;
                return (_a10 = s(R)) == null ? void 0 : _a10.running;
              }, () => {
                var _a10;
                return (_a10 = s(R)) == null ? void 0 : _a10.result;
              }, () => () => h(e.msg.event, e.msg.event.data.emailId));
            };
            I(te, (ie) => {
              s(B) || ie(Y);
            });
          }
          var $ = v(H, 2);
          {
            var O = (ie) => {
              n(ie, () => "Confirm execution?", () => null, () => null, () => s(w), () => true);
            };
            I($, (ie) => {
              s(B) && ie(O);
            });
          }
          var G = v($, 2);
          {
            let ie = V(() => {
              var _a10;
              return (_a10 = e.msg.event.metadata) == null ? void 0 : _a10.category;
            });
            os(G, { get eventType() {
              return e.msg.event.type;
            }, get category() {
              return s(ie);
            }, get commands() {
              return e.msg.commands;
            } });
          }
          var J = v(G, 2);
          {
            var se = (ie) => {
              var oe = QA(), de = d(oe);
              Go(de, { get msg() {
                return s(c)[s(w)];
              } }), u(ie, oe);
            };
            I(J, (ie) => {
              var _a10;
              s(c)[s(w)] && ((_a10 = s(c)[s(w)].steps) == null ? void 0 : _a10.length) > 0 && ie(se);
            });
          }
          u(S, X);
        };
        I(W, (S) => {
          var _a10;
          ((_a10 = e.msg.commands) == null ? void 0 : _a10.length) && S(A);
        });
      }
      u(T, N);
    }, P = (T) => {
      var N = n4(), K = d(N), W = d(K), A = v(K, 2);
      Ge(A, 17, () => e.msg.items, Qe, (S, w) => {
        var R = r4(), B = d(R);
        a(B, () => s(w).event, () => true);
        var Z = v(B, 2);
        {
          let X = V(() => {
            var _a10;
            return (_a10 = s(w).event.metadata) == null ? void 0 : _a10.category;
          });
          os(Z, { get eventType() {
            return s(w).event.type;
          }, get category() {
            return s(X);
          }, get commands() {
            return s(w).commands;
          } });
        }
        u(S, R);
      }), L(() => E(W, `Processed ${e.msg.items.length ?? ""} email${e.msg.items.length === 1 ? "" : "s"}`)), u(T, N);
    }, C = (T) => {
      var N = h4(), K = d(N), W = v(d(K), 2), A = d(W), S = v(K, 2);
      Ge(S, 17, () => e.msg.categories, Qe, (w, R) => {
        const B = V(() => s(o)[s(R).eventType] ?? true), Z = V(() => `batch_${s(R).eventType}`), X = V(() => j(s(Z))), H = V(() => s(l)[s(Z)]), te = V(() => s(R).category ? In[s(R).category] || In.CRITICAL : null);
        var Y = m4(), $ = d(Y), O = d($), G = d(O);
        let J;
        var se = d(G), ie = v(G, 2);
        {
          var oe = (ue) => {
            var Ee = a4();
            let xe;
            var Se = d(Ee);
            L(() => {
              br(Ee, "title", s(te).description), xe = Rt(Ee, "", xe, { color: s(te).color }), E(Se, s(te).label);
            }), u(ue, Ee);
          };
          I(ie, (ue) => {
            s(te) && ue(oe);
          });
        }
        var de = v(ie, 2), ve = d(de), me = v(de, 4), ke = v(O, 2);
        {
          var ye = (ue) => {
            {
              let Ee = V(() => {
                var _a10;
                return (_a10 = s(X)) == null ? void 0 : _a10.running;
              }), xe = V(() => {
                var _a10, _b4, _c6;
                return Je("h-6 text-[0.6rem] font-bold uppercase tracking-wider px-2 mr-2 shrink-0 pointer-events-auto", ((_a10 = s(te)) == null ? void 0 : _a10.requiresApproval) ? "text-warning border-warning/25 bg-warning/6 hover:bg-warning/12 hover:border-warning/40" : "text-primary border-primary/25 bg-primary/6 hover:bg-primary/12 hover:border-primary/40", ((_c6 = (_b4 = s(X)) == null ? void 0 : _b4.result) == null ? void 0 : _c6.success) && "hover:opacity-80 !border-green-500/50 !text-green-500 !bg-green-500/10 cursor-pointer !ring-0 !ring-offset-0");
              });
              tt(ue, { variant: "outline", size: "sm", onclick: (Se) => {
                var _a10, _b4, _c6, _d4;
                Se.stopPropagation(), ((_b4 = (_a10 = s(X)) == null ? void 0 : _a10.result) == null ? void 0 : _b4.success) ? ((_c6 = e.onexecuted) == null ? void 0 : _c6.call(e), (_d4 = e.ondismiss) == null ? void 0 : _d4.call(e)) : x(s(R).eventType, s(R).emails.filter((Fe) => Fe.status !== "executed"));
              }, get disabled() {
                return s(Ee);
              }, get class() {
                return s(xe);
              }, children: (Se, Fe) => {
                var qe = Ae(), ne = re(qe);
                {
                  var fe = (Ce) => {
                    var ze = Be("Running\u2026");
                    u(Ce, ze);
                  }, be = (Ce) => {
                    var ze = Be();
                    L(() => E(ze, s(X).result.success ? `Done (Dismiss) (${s(X).result.successful ?? "?"}/${s(X).result.total ?? "?"})` : "Failed")), u(Ce, ze);
                  }, _e40 = (Ce) => {
                    var ze = Be();
                    L((Re) => E(ze, `Review & Execute (${Re ?? ""})`), [() => s(R).emails.filter((Re) => Re.status !== "executed").length]), u(Ce, ze);
                  }, $e = (Ce) => {
                    var ze = Be();
                    L((Re) => E(ze, `Execute All (${Re ?? ""})`), [() => s(R).emails.filter((Re) => Re.status !== "executed").length]), u(Ce, ze);
                  };
                  I(ne, (Ce) => {
                    var _a10, _b4, _c6;
                    ((_a10 = s(X)) == null ? void 0 : _a10.running) ? Ce(fe) : ((_b4 = s(X)) == null ? void 0 : _b4.result) ? Ce(be, 1) : ((_c6 = s(te)) == null ? void 0 : _c6.requiresApproval) ? Ce(_e40, 2) : Ce($e, -1);
                  });
                }
                u(Se, qe);
              }, $$slots: { default: true } });
            }
          }, we = V(() => !s(H) && s(R).emails.some((ue) => ue.status !== "executed"));
          I(ke, (ue) => {
            s(we) && ue(ye);
          });
        }
        var le = v($, 2);
        {
          var ce = (ue) => {
            var Ee = s4(), xe = d(Ee);
            n(xe, () => "Review required \u2014 this is a CRITICAL event type", () => `The following actions will run on <strong>${s(R).emails.length} email${s(R).emails.length === 1 ? "" : "s"}</strong>. This changes email state and cannot be undone easily.`, () => s(H).actions, () => s(Z), () => false), u(ue, Ee);
          };
          I(le, (ue) => {
            s(H) && ue(ce);
          });
        }
        var pe = v(le, 2);
        {
          var ge = (ue) => {
            var Ee = o4(), xe = d(Ee);
            Go(xe, { get msg() {
              return s(c)[s(Z)];
            } }), u(ue, Ee);
          };
          I(pe, (ue) => {
            var _a10;
            s(c)[s(Z)] && !s(H) && ((_a10 = s(c)[s(Z)].steps) == null ? void 0 : _a10.length) > 0 && ue(ge);
          });
        }
        var Te = v(pe, 2);
        {
          var he = (ue) => {
            var Ee = g4();
            Ge(Ee, 21, () => s(R).emails, Qe, (xe, Se) => {
              const Fe = V(() => `single_${s(Se).emailId}`), qe = V(() => j(s(Fe))), ne = V(() => s(l)[s(Fe)]);
              var fe = v4(), be = d(fe), _e40 = d(be), $e = d(_e40), Ce = v(_e40, 2), ze = d(Ce);
              {
                var Re = (xt) => {
                  var Ft = i4(), ur = d(Ft);
                  L((kn) => E(ur, kn), [() => f(s(Se).from)]), u(xt, Ft);
                };
                I(ze, (xt) => {
                  s(Se).from && xt(Re);
                });
              }
              var je = v(ze, 2);
              {
                var Ve = (xt) => {
                  var Ft = l4(), ur = d(Ft);
                  L((kn) => E(ur, `\xB7 ${kn ?? ""}`), [() => p(s(Se).date)]), u(xt, Ft);
                };
                I(je, (xt) => {
                  s(Se).date && xt(Ve);
                });
              }
              var st = v(Ce, 2);
              {
                var gt = (xt) => {
                  var Ft = c4(), ur = d(Ft);
                  L(() => E(ur, s(Se).summary)), u(xt, Ft);
                };
                I(st, (xt) => {
                  s(Se).summary && xt(gt);
                });
              }
              var Lt = v(st, 2);
              {
                var dt = (xt) => {
                  var Ft = u4();
                  Ge(Ft, 21, () => s(Se).tags, Qe, (ur, kn) => {
                    var Sa = d4(), Ne = d(Sa);
                    L(() => E(Ne, s(kn))), u(ur, Sa);
                  }), u(xt, Ft);
                };
                I(Lt, (xt) => {
                  var _a10;
                  ((_a10 = s(Se).tags) == null ? void 0 : _a10.length) && xt(dt);
                });
              }
              var Jt = v(be, 2), Wt = d(Jt), Nr = v(d(Wt), 2);
              {
                var Rr = (xt) => {
                  r(xt, () => "Execute", () => {
                    var _a10;
                    return (_a10 = s(te)) == null ? void 0 : _a10.requiresApproval;
                  }, () => {
                    var _a10;
                    return (_a10 = s(qe)) == null ? void 0 : _a10.running;
                  }, () => {
                    var _a10;
                    return (_a10 = s(qe)) == null ? void 0 : _a10.result;
                  }, () => () => h({ type: s(R).eventType, source: "gmail", data: s(Se) }, s(Se).emailId));
                };
                I(Nr, (xt) => {
                  s(Se).status !== "executed" && !s(ne) && xt(Rr);
                });
              }
              var Nt = v(Wt, 2);
              {
                var Sr = (xt) => {
                  n(xt, () => "Confirm execution?", () => null, () => null, () => s(Fe), () => true);
                };
                I(Nt, (xt) => {
                  s(Se).status !== "executed" && s(ne) && xt(Sr);
                });
              }
              var ra = v(Nt, 2);
              {
                var na = (xt) => {
                  os(xt, { get eventType() {
                    return s(R).eventType;
                  }, get category() {
                    return s(R).category;
                  }, get commands() {
                    return s(R).commands;
                  } });
                }, ka = (xt) => {
                  var Ft = f4();
                  u(xt, Ft);
                };
                I(ra, (xt) => {
                  var _a10;
                  ((_a10 = s(R).commands) == null ? void 0 : _a10.length) ? xt(na) : xt(ka, -1);
                });
              }
              var Ka = v(ra, 2);
              {
                var Xa = (xt) => {
                  var Ft = p4(), ur = d(Ft);
                  Go(ur, { get msg() {
                    return s(c)[s(Fe)];
                  } }), u(xt, Ft);
                };
                I(Ka, (xt) => {
                  var _a10;
                  s(c)[s(Fe)] && !s(ne) && ((_a10 = s(c)[s(Fe)].steps) == null ? void 0 : _a10.length) > 0 && xt(Xa);
                });
              }
              L(() => E($e, s(Se).subject)), u(xe, fe);
            }), u(ue, Ee);
          };
          I(Te, (ue) => {
            s(B) && ue(he);
          });
        }
        L((ue, Ee, xe) => {
          J = Rt(G, "", J, ue), E(se, Ee), E(ve, s(R).emails.length), rt(me, 0, xe);
        }, [() => ({ background: U(s(R).eventType) }), () => D(s(R).eventType), () => Et(Je("size-3.5 text-muted-foreground/30 transition-transform", s(B) && "rotate-180"))]), Pe("click", O, () => k(s(R).eventType)), u(w, Y);
      }), L(() => E(A, `${e.msg.total ?? ""} email${e.msg.total === 1 ? "" : "s"} in ${e.msg.categories.length ?? ""} event
        type${e.msg.categories.length === 1 ? "" : "s"}`)), u(T, N);
    };
    I(q, (T) => {
      e.msg.type === "event" ? T(F) : e.msg.type === "event-batch" ? T(P, 1) : e.msg.type === "events-by-category" && T(C, 2);
    });
  }
  u(t, M), Le();
}
Zt(["click"]);
var b4 = _('<button><span class="size-1.5 rounded-full shrink-0"></span> <span> </span></button>'), x4 = _('<span class="opacity-70"> </span>'), y4 = _('<div class="flex items-center gap-1.5 py-1 border-b border-border last:border-b-0 group/row"><button class="flex-1 min-w-0 flex flex-col gap-px text-left" title="Ask AI about this email"><span class="text-[0.7rem] font-medium text-foreground/80 truncate group-hover/row:text-foreground transition-colors tracking-tight"> </span> <span class="flex gap-1.5 text-[0.58rem] text-muted-foreground/35"><span> </span> <!></span></button> <div class="flex gap-0.5 opacity-30 group-hover/row:opacity-100 transition-opacity"><button title="Handled" class="size-5 flex items-center justify-center text-[0.64rem] font-bold rounded transition-all hover:bg-success/12 hover:text-success text-muted-foreground">\u2713</button> <button title="Dismiss" class="size-5 flex items-center justify-center text-[0.64rem] font-bold rounded transition-all hover:bg-destructive/12 hover:text-destructive text-muted-foreground">\u2715</button></div></div>'), w4 = _('<button class="text-[0.6rem] font-medium text-muted-foreground/60 hover:text-foreground hover:bg-accent px-1.5 py-0.5 rounded transition-all">All handled</button> <button class="text-[0.6rem] font-medium text-muted-foreground/40 hover:text-foreground hover:bg-accent px-1.5 py-0.5 rounded transition-all">Clear category</button>', 1), k4 = _('<span class="text-[0.6rem] text-muted-foreground/40 mr-auto"> </span> <button class="text-[0.6rem] text-muted-foreground/60 hover:text-foreground hover:bg-accent px-1.5 py-0.5 rounded transition-all">Cancel</button> <button class="text-[0.6rem] text-destructive/70 hover:text-destructive hover:bg-destructive/8 px-1.5 py-0.5 rounded transition-all">Delete</button>', 1), S4 = _('<div class="mt-2 pt-2 border-t border-border"><div class="flex items-center gap-1.5 pb-2 mb-2 border-b-2"><button class="text-xs text-muted-foreground/50 hover:text-foreground transition-colors px-1 py-0.5 rounded hover:bg-accent">\u2190</button> <span class="text-xs font-semibold text-foreground tracking-tight flex-1"> </span> <span class="text-[0.6rem] text-muted-foreground/40"> </span></div> <div class="mb-2 bg-background p-1 px-2 rounded border border-border"><!></div> <div class="flex flex-col"></div> <div class="flex items-center justify-end gap-1.5 pt-2 mt-1 border-t border-border"><!></div></div>'), T4 = _('<div class="max-w-[420px] w-full rounded border border-border bg-card px-2.5 py-2 self-start"><p class="text-xs text-muted-foreground/60 font-medium mb-2 tracking-tight"> </p> <div class="flex flex-wrap gap-1"></div> <!></div>');
function A4(t, e) {
  De(e, true);
  let r = ae(e, "pendingData", 3, null), n = ee(null), a = ee(null), o = ee(nt([])), i = ee(null);
  function l(y) {
    g(n, s(n) === y ? null : y, true), g(a, null);
  }
  Ut(() => {
    s(n) ? (Si(s(n)).then((y) => g(o, y, true)), lo(s(n)).then((y) => g(i, y, true))) : (g(o, [], true), g(i, null));
  });
  function c(y) {
    return y.split("_").map((k) => k.charAt(0) + k.slice(1).toLowerCase()).join(" ");
  }
  function f(y) {
    if (!y) return "";
    try {
      return new Date(y).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch {
      return "";
    }
  }
  function p(y) {
    if (!y) return "";
    const k = y.replace(/<.*>/, "").trim();
    return k.length > 24 ? k.slice(0, 22) + "\u2026" : k;
  }
  var m = { toggleCategory: l }, h = Ae(), x = re(h);
  {
    var b = (y) => {
      var k = T4(), D = d(k), U = d(D), j = v(D, 2);
      Ge(j, 20, () => r().order, (F) => F, (F, P) => {
        const C = V(() => r().categories[P]), T = V(() => Zo(P)), N = V(() => s(n) === P);
        var K = b4(), W = d(K);
        let A;
        var S = v(W), w = v(S), R = d(w);
        L((B, Z, X) => {
          rt(K, 1, B), Rt(K, s(N) ? `background: color-mix(in srgb, ${s(T)} 10%, transparent); border-color: color-mix(in srgb, ${s(T)} 40%, transparent); color: ${s(T)}` : ""), A = Rt(W, "", A, { background: s(T) }), E(S, ` ${Z ?? ""} `), rt(w, 1, X), E(R, s(C).length);
        }, [() => Et(Je("inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-[0.64rem] font-medium transition-all whitespace-nowrap", s(N) ? "border-transparent text-foreground" : "bg-transparent border-border text-muted-foreground hover:bg-accent hover:text-foreground")), () => c(P), () => Et(Je("text-[0.58rem] font-bold min-w-[14px] text-center", s(N) ? "opacity-70" : "opacity-50"))]), Pe("click", K, () => l(P)), u(F, K);
      });
      var M = v(j, 2);
      {
        var q = (F) => {
          const P = V(() => r().categories[s(n)]), C = V(() => Zo(s(n)));
          var T = S4(), N = d(T);
          let K;
          var W = d(N), A = v(W, 2), S = d(A), w = v(A, 2), R = d(w), B = v(N, 2), Z = d(B);
          os(Z, { get eventType() {
            return s(n);
          }, get category() {
            return s(i);
          }, get commands() {
            return s(o);
          } });
          var X = v(B, 2);
          Ge(X, 21, () => s(P), (O) => O.emailId, (O, G) => {
            var J = y4(), se = d(J), ie = d(se), oe = d(ie), de = v(ie, 2), ve = d(de), me = d(ve), ke = v(ve, 2);
            {
              var ye = (pe) => {
                var ge = x4(), Te = d(ge);
                L((he) => E(Te, he), [() => f(s(G).date)]), u(pe, ge);
              };
              I(ke, (pe) => {
                s(G).date && pe(ye);
              });
            }
            var we = v(se, 2), le = d(we), ce = v(le, 2);
            L((pe) => {
              E(oe, s(G).subject), E(me, pe);
            }, [() => p(s(G).from)]), Pe("click", se, () => {
              var _a10;
              return (_a10 = e.onaskai) == null ? void 0 : _a10.call(e, `Tell me about the email "${s(G).subject}" from ${s(G).from}`);
            }), Pe("click", le, () => {
              var _a10;
              return (_a10 = e.onmarkacted) == null ? void 0 : _a10.call(e, s(G).emailId);
            }), Pe("click", ce, () => {
              var _a10;
              return (_a10 = e.ondismiss) == null ? void 0 : _a10.call(e, s(G).emailId);
            }), u(O, J);
          });
          var H = v(X, 2), te = d(H);
          {
            var Y = (O) => {
              var G = w4(), J = re(G), se = v(J, 2);
              Pe("click", J, () => s(P).forEach((ie) => {
                var _a10;
                return (_a10 = e.onmarkacted) == null ? void 0 : _a10.call(e, ie.emailId);
              })), Pe("click", se, () => g(a, s(n), true)), u(O, G);
            }, $ = (O) => {
              var G = k4(), J = re(G), se = d(J), ie = v(J, 2), oe = v(ie, 2);
              L(() => E(se, `Remove ${s(P).length ?? ""}?`)), Pe("click", ie, () => g(a, null)), Pe("click", oe, () => {
                var _a10;
                (_a10 = e.onclearcategory) == null ? void 0 : _a10.call(e, s(n)), g(a, null), g(n, null);
              }), u(O, G);
            };
            I(te, (O) => {
              s(a) !== s(n) ? O(Y) : O($, -1);
            });
          }
          L((O) => {
            K = Rt(N, "", K, { "border-color": s(C) }), E(S, O), E(R, s(P).length);
          }, [() => c(s(n))]), Pe("click", W, () => {
            g(n, null), g(a, null);
          }), u(F, T);
        };
        I(M, (F) => {
          s(n) && r().categories[s(n)] && F(q);
        });
      }
      L(() => E(U, `${r().total ?? ""} item${r().total !== 1 ? "s" : ""} need attention`)), u(y, k);
    };
    I(x, (y) => {
      r() && r().total > 0 && y(b);
    });
  }
  return u(t, h), Le(m);
}
Zt(["click"]);
var E4 = _('<span class="inline-flex items-center gap-1.5 px-2 py-1 rounded border border-border bg-card text-xs text-muted-foreground/50"><span class="size-2.5 rounded-full border border-border border-t-primary animate-spin shrink-0"></span> Scanning\u2026</span>'), C4 = _('<button class="inline-flex items-center gap-1.5 px-2 py-1 rounded border border-primary/25 bg-primary/6 text-xs text-primary hover:bg-primary/12 hover:border-primary/40 transition-colors"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path></svg> Scan Emails</button>'), I4 = _('<div class="flex gap-1.5 px-6 py-2 shrink-0 border-t border-border"><!></div>');
function P4(t, e) {
  let r = ae(e, "hasScanData", 3, false), n = ae(e, "engineReady", 3, false), a = ae(e, "isScanning", 3, false), o = V(() => n() && !r() && !a()), i = V(() => s(o) || a());
  var l = Ae(), c = re(l);
  {
    var f = (p) => {
      var m = I4(), h = d(m);
      {
        var x = (y) => {
          var k = E4();
          u(y, k);
        }, b = (y) => {
          var k = C4();
          Pe("click", k, function(...D) {
            var _a10;
            (_a10 = e.onscan) == null ? void 0 : _a10.apply(this, D);
          }), u(y, k);
        };
        I(h, (y) => {
          a() ? y(x) : s(o) && y(b, 1);
        });
      }
      u(p, m);
    };
    I(c, (p) => {
      s(i) && p(f);
    });
  }
  u(t, l);
}
Zt(["click"]);
var $4 = _('<div class="flex flex-col gap-px"><span class="text-[0.62rem] font-bold uppercase tracking-wider text-muted-foreground/40"> </span> <span> </span></div>'), N4 = _('<span class="text-[0.58rem] font-mono text-muted-foreground/60 bg-muted border border-border px-1.5 py-0.5 rounded"> </span>'), R4 = _('<div class="col-span-2 flex flex-col gap-1.5"><span class="text-[0.62rem] font-bold uppercase tracking-wider text-muted-foreground/40"> </span> <div class="flex flex-wrap gap-1"></div></div>'), M4 = _('<div class="bg-card border-b border-border px-4 py-3 animate-[slideDown_0.15s_ease-out]"><div class="grid grid-cols-2 gap-x-6 gap-y-2"><!> <!></div></div>');
function z4(t, e) {
  De(e, true), Xt(() => qa("GpuPanel"));
  const r = V(() => {
    var _a10, _b4, _c6;
    return [{ label: "Status", value: "Active", ok: true }, { label: "Vendor", value: e.gpuInfo.vendor }, { label: "Architecture", value: e.gpuInfo.architecture }, ...e.gpuInfo.device && e.gpuInfo.device !== "unknown" ? [{ label: "Device", value: e.gpuInfo.device }] : [], ...((_a10 = e.gpuInfo.limits) == null ? void 0 : _a10.maxBufferSize) ? [{ label: "Max Buffer", value: Tl(e.gpuInfo.limits.maxBufferSize) }] : [], ...((_b4 = e.gpuInfo.limits) == null ? void 0 : _b4.maxComputeInvocationsPerWorkgroup) ? [{ label: "Max Compute", value: String(e.gpuInfo.limits.maxComputeInvocationsPerWorkgroup) }] : [], ...((_c6 = e.gpuInfo.limits) == null ? void 0 : _c6.maxComputeWorkgroupStorageSize) ? [{ label: "Workgroup Storage", value: Tl(e.gpuInfo.limits.maxComputeWorkgroupStorageSize) }] : []];
  });
  var n = M4(), a = d(n), o = d(a);
  Ge(o, 17, () => s(r), Qe, (c, f) => {
    var p = $4(), m = d(p), h = d(m), x = v(m, 2), b = d(x);
    L(() => {
      E(h, s(f).label), rt(x, 1, Et(s(f).ok ? "text-[0.78rem] font-semibold text-success" : "text-[0.78rem] text-foreground/75 tracking-tight")), E(b, s(f).value);
    }), u(c, p);
  });
  var i = v(o, 2);
  {
    var l = (c) => {
      var f = R4(), p = d(f), m = d(p), h = v(p, 2);
      Ge(h, 21, () => e.gpuInfo.features, Qe, (x, b) => {
        var y = N4(), k = d(y);
        L(() => E(k, s(b))), u(x, y);
      }), L(() => E(m, `Features (${e.gpuInfo.features.length ?? ""})`)), u(c, f);
    };
    I(i, (c) => {
      var _a10;
      ((_a10 = e.gpuInfo.features) == null ? void 0 : _a10.length) && c(l);
    });
  }
  u(t, n), Le();
}
var O4 = _("<textarea></textarea>");
function D4(t, e) {
  De(e, true);
  let r = ae(e, "ref", 15, null), n = ae(e, "value", 15), a = ae(e, "data-slot", 3, "textarea"), o = ut(e, ["$$slots", "$$events", "$$legacy", "ref", "value", "class", "data-slot"]);
  var i = O4();
  Gt(i, (l) => ({ "data-slot": a(), class: l, ...o }), [() => Je("border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", e.class)]), Jn(i, (l) => r(l), () => r()), Hn(i, n), u(t, i), Le();
}
var L4 = _('<button class="w-full flex items-center justify-between text-left px-2 py-1.5 text-xs text-foreground/80 hover:bg-accent rounded-md transition-all group/btn disabled:opacity-50"><span class="flex items-center gap-1.5 min-w-0 pr-2"><span class="size-1.5 rounded-full shrink-0 shadow-sm"></span> <span class="truncate tracking-tight group-hover/btn:text-foreground"> </span></span> <span class="flex items-center gap-1.5 shrink-0"><span class="text-[0.55rem] font-bold opacity-60 tabular-nums"> </span> <span class="text-[0.55rem] font-bold tracking-wider text-muted-foreground/40 group-hover/btn:text-primary transition-colors border border-border/50 bg-background/50 px-1 rounded opacity-0 group-hover/btn:opacity-100">RUN</span></span></button>'), j4 = _('<div class="space-y-1"><div class="text-[0.65rem] font-bold text-muted-foreground/60 uppercase tracking-wider px-1 pb-1 flex justify-between items-center">Pending Actions <span class="bg-warning/20 text-warning px-1 rounded text-[0.55rem] font-black"> </span></div> <!></div>'), B4 = _('<div class="px-2 py-3 border border-dashed border-border/60 rounded-md text-center"><p class="text-[0.65rem] text-muted-foreground">No pending items.</p> <button class="mt-1.5 text-[0.65rem] font-medium text-primary hover:underline">Scan Inbox Now</button></div>'), F4 = _('<span class="text-xs text-muted-foreground/50 tabular-nums"> </span>'), U4 = _('<span class="text-xs text-muted-foreground/40 italic animate-pulse">preparing\u2026</span>'), G4 = _('<span class="text-xs text-muted-foreground/40 italic animate-pulse"> </span>'), W4 = _('<span class="text-xs text-muted-foreground/50 tabular-nums"> </span>'), V4 = _('<div class="flex items-center gap-2"><!> <!></div>'), H4 = _('<div class="flex flex-col gap-1 min-w-[70px]"><!> <!></div>'), q4 = _('<div class="px-6 py-3 border-t border-border bg-muted/20 flex flex-wrap gap-4"><div class="flex flex-col gap-1 min-w-[70px]"><!> <!></div> <div class="flex items-center gap-2 pt-5"><!> <!></div> <!> <div class="flex flex-col gap-1 min-w-[70px]"><!> <!></div></div>'), Y4 = _('<div class="m-auto flex flex-col items-center gap-2 text-center py-12"><span class="text-2xl text-muted-foreground/30">\u2726</span> <span class="text-sm font-medium text-foreground/90 tracking-tight">Start a conversation</span> <span class="text-xs text-muted-foreground/80">Ask about your emails, events, or anything else.</span></div>'), K4 = _('<div class="flex h-full w-full overflow-hidden"><div class="w-64 border-r border-border bg-card/30 flex flex-col shrink-0 overflow-y-auto hidden md:flex"><div class="px-4 py-4 border-b border-border/50 sticky top-0 bg-card/95 backdrop-blur z-10"><h3 class="text-xs font-semibold text-foreground tracking-tight flex items-center gap-2"><span class="text-[0.6rem] bg-primary/20 text-primary px-1.5 py-0.5 rounded-sm uppercase">AI Control Plane</span></h3> <p class="text-[0.65rem] text-muted-foreground mt-1.5 leading-tight">Interactive commands mapped directly to the local AI engine.</p></div> <div class="p-3 space-y-4"><div class="space-y-1"><div class="text-[0.65rem] font-bold text-muted-foreground/60 uppercase tracking-wider px-1 pb-1">Overview</div> <button class="w-full flex items-center justify-between text-left px-2.5 py-1.5 text-xs text-foreground/80 hover:text-foreground hover:bg-accent rounded-md transition-colors disabled:opacity-50"><span class="flex items-center gap-2"><span class="text-muted-foreground">\u{1F4CA}</span> Event Dashboard</span> <span class="text-[0.55rem] text-muted-foreground/50 border border-border px-1 rounded bg-background">UI</span></button></div> <!></div></div> <div class="flex flex-col h-full flex-1 min-w-0 min-h-0 bg-background"><div class="flex flex-col border-b border-border shrink-0"><div class="flex items-center gap-3 px-6 h-10 bg-card/10"><!> <!> <span class="flex-1"></span> <!> <!> <!></div> <!></div> <!> <div class="flex-1 min-h-0 overflow-y-auto px-6 py-5 flex flex-col gap-2"><!> <!></div> <!> <div class="flex items-end gap-2 px-6 py-3 pb-4 border-t border-border shrink-0"><!> <!></div></div></div>');
function X4(t, e) {
  De(e, true), Xt(() => qa("ChatView"));
  let r = ae(e, "messages", 23, () => []), n = ae(e, "pendingData", 3, null), a = ae(e, "hasScanData", 3, false), o = ae(e, "engineReady", 3, false), i = ae(e, "isScanning", 3, false), l = ae(e, "isRunning", 3, false), c = ae(e, "tps", 3, null), f = ae(e, "numTokens", 3, null), p = ae(e, "generationPhase", 3, null), m = ae(e, "gpuInfo", 3, null), h = ae(e, "enableThinking", 15, false), x = ae(e, "maxTokens", 15, 4096), b = ae(e, "doSample", 15, false), y = ae(e, "temperature", 15, 0.7), k = ae(e, "repetitionPenalty", 15, 1.1), D = ae(e, "backend", 3, "webgpu"), U = ae(e, "chatContainer", 15), j = ee(""), M = ee(false), q = ee(false);
  function F(ne) {
    ne.key === "Enter" && !ne.shiftKey && (ne.preventDefault(), P());
  }
  function P() {
    const ne = s(j).trim();
    !ne || l() || (g(j, ""), e.onsend(ne));
  }
  function C(ne) {
    l() || e.onsend(ne);
  }
  function T(ne) {
    ne && !l() && e.onsend(ne);
  }
  const N = { ollama: { label: "Ollama", color: "text-primary border-primary/30 bg-primary/8" }, openai: { label: "OpenAI", color: "text-success border-success/30 bg-success/8" }, anthropic: { label: "Anthropic", color: "text-warning border-warning/30 bg-warning/8" }, google: { label: "Google", color: "text-info border-info/30 bg-info/8" }, xai: { label: "xAI", color: "text-foreground border-border bg-muted/30" } };
  var K = K4(), W = d(K), A = v(d(W), 2), S = d(A), w = v(d(S), 2), R = v(S, 2);
  {
    var B = (ne) => {
      var fe = j4(), be = d(fe), _e40 = v(d(be)), $e = d(_e40), Ce = v(be, 2);
      Ge(Ce, 16, () => n().order, (ze) => ze, (ze, Re) => {
        const je = V(() => n().categories[Re].length), Ve = V(() => Zo(Re));
        var st = L4(), gt = d(st), Lt = d(gt);
        let dt;
        var Jt = v(Lt, 2), Wt = d(Jt), Nr = v(gt, 2), Rr = d(Nr), Nt = d(Rr);
        L((Sr) => {
          st.disabled = l(), dt = Rt(Lt, "", dt, { background: s(Ve) }), E(Wt, Sr), E(Nt, s(je));
        }, [() => Re.split("_").join(" ")]), Pe("click", st, () => C(`[EXECUTE:CATEGORY:${Re}]`)), u(ze, st);
      }), L(() => E($e, n().total)), u(ne, fe);
    }, Z = (ne) => {
      var fe = B4(), be = v(d(fe), 2);
      Pe("click", be, function(..._e40) {
        var _a10;
        (_a10 = e.onscan) == null ? void 0 : _a10.apply(this, _e40);
      }), u(ne, fe);
    };
    I(R, (ne) => {
      n() && n().total > 0 ? ne(B) : o() && ne(Z, 1);
    });
  }
  var X = v(W, 2), H = d(X), te = d(H), Y = d(te);
  {
    var $ = (ne) => {
      tt(ne, { variant: "outline", size: "sm", onclick: () => g(M, !s(M)), class: "h-5 px-1.5 text-[0.6rem] font-bold uppercase tracking-wider text-success border-success/30 bg-success/8 hover:bg-success/14", children: (fe, be) => {
        var _e40 = Be();
        L(() => E(_e40, `WebGPU ${s(M) ? "\u25B2" : "\u25BC"}`)), u(fe, _e40);
      }, $$slots: { default: true } });
    }, O = (ne) => {
      const fe = V(() => N[D()]);
      {
        let be = V(() => Je("text-[0.6rem] font-bold uppercase tracking-wider h-5 px-1.5", s(fe).color));
        Cr(ne, { variant: "outline", get class() {
          return s(be);
        }, children: (_e40, $e) => {
          var Ce = Be();
          L(() => E(Ce, s(fe).label)), u(_e40, Ce);
        }, $$slots: { default: true } });
      }
    };
    I(Y, (ne) => {
      m() ? ne($) : N[D()] && ne(O, 1);
    });
  }
  var G = v(Y, 2);
  {
    var J = (ne) => {
      var fe = F4(), be = d(fe);
      L((_e40, $e) => E(be, `${f() ?? ""} tok \xB7 ${_e40 ?? ""}s \xB7 ${$e ?? ""}
            tok/s`), [() => (f() / c()).toFixed(1), () => c().toFixed(1)]), u(ne, fe);
    }, se = (ne) => {
      var fe = U4();
      u(ne, fe);
    }, ie = (ne) => {
      var fe = G4(), be = d(fe);
      L((_e40) => E(be, `thinking\u2026 ${_e40 ?? ""}`), [() => c() ? `${c().toFixed(0)} tok/s` : ""]), u(ne, fe);
    }, oe = (ne) => {
      var fe = W4(), be = d(fe);
      L((_e40) => E(be, `${_e40 ?? ""} tok/s`), [() => c().toFixed(1)]), u(ne, fe);
    };
    I(G, (ne) => {
      c() && !l() ? ne(J) : l() && p() === "preparing" ? ne(se, 1) : l() && p() === "thinking" ? ne(ie, 2) : c() && l() && ne(oe, 3);
    });
  }
  var de = v(G, 4);
  {
    var ve = (ne) => {
      var fe = V4(), be = d(fe);
      rn(be, { for: "thinking-switch", class: "text-xs text-muted-foreground/60 cursor-pointer", children: ($e, Ce) => {
        var ze = Be("Thinking");
        u($e, ze);
      }, $$slots: { default: true } });
      var _e40 = v(be, 2);
      ql(_e40, { id: "thinking-switch", get disabled() {
        return l();
      }, class: "scale-90", get checked() {
        return h();
      }, set checked($e) {
        h($e);
      } }), u(ne, fe);
    };
    I(de, (ne) => {
      m() && ne(ve);
    });
  }
  var me = v(de, 2);
  {
    let ne = V(() => Je("h-6 text-[0.6rem] font-semibold uppercase tracking-wider px-2", s(q) ? "bg-accent/50 text-foreground" : "text-muted-foreground/50 hover:bg-accent/50"));
    tt(me, { variant: "ghost", size: "sm", onclick: () => g(q, !s(q)), get class() {
      return s(ne);
    }, children: (fe, be) => {
      var _e40 = Be();
      L(() => E(_e40, `Generation ${s(q) ? "\u25B2" : "\u25BC"}`)), u(fe, _e40);
    }, $$slots: { default: true } });
  }
  var ke = v(me, 2);
  tt(ke, { variant: "ghost", size: "sm", get onclick() {
    return e.onreset;
  }, get disabled() {
    return l();
  }, class: "h-6 text-xs px-2", children: (ne, fe) => {
    var be = Be("Reset");
    u(ne, be);
  }, $$slots: { default: true } });
  var ye = v(te, 2);
  {
    var we = (ne) => {
      var fe = q4(), be = d(fe), _e40 = d(be);
      rn(_e40, { for: "max-tokens", class: "text-[0.6rem] opacity-60", children: (dt, Jt) => {
        var Wt = Be("Max tokens");
        u(dt, Wt);
      }, $$slots: { default: true } });
      var $e = v(_e40, 2);
      Pn($e, { id: "max-tokens", type: "number", min: 256, max: 32768, step: 256, get disabled() {
        return l();
      }, class: "h-7 text-xs", get value() {
        return x();
      }, set value(dt) {
        x(dt);
      } });
      var Ce = v(be, 2), ze = d(Ce);
      rn(ze, { for: "do-sample", class: "text-[0.6rem] opacity-60", children: (dt, Jt) => {
        var Wt = Be("Sample");
        u(dt, Wt);
      }, $$slots: { default: true } });
      var Re = v(ze, 2);
      ql(Re, { id: "do-sample", get disabled() {
        return l();
      }, class: "scale-90", get checked() {
        return b();
      }, set checked(dt) {
        b(dt);
      } });
      var je = v(Ce, 2);
      {
        var Ve = (dt) => {
          var Jt = H4(), Wt = d(Jt);
          rn(Wt, { for: "temperature", class: "text-[0.6rem] opacity-60", children: (Rr, Nt) => {
            var Sr = Be("Temperature");
            u(Rr, Sr);
          }, $$slots: { default: true } });
          var Nr = v(Wt, 2);
          Pn(Nr, { id: "temperature", type: "number", min: 0, max: 2, step: 0.1, get disabled() {
            return l();
          }, class: "h-7 text-xs", get value() {
            return y();
          }, set value(Rr) {
            y(Rr);
          } }), u(dt, Jt);
        };
        I(je, (dt) => {
          b() && dt(Ve);
        });
      }
      var st = v(je, 2), gt = d(st);
      rn(gt, { for: "repetition-penalty", class: "text-[0.6rem] opacity-60", children: (dt, Jt) => {
        var Wt = Be("Rep. penalty");
        u(dt, Wt);
      }, $$slots: { default: true } });
      var Lt = v(gt, 2);
      Pn(Lt, { id: "repetition-penalty", type: "number", min: 1, max: 2, step: 0.05, get disabled() {
        return l();
      }, class: "h-7 text-xs", get value() {
        return k();
      }, set value(dt) {
        k(dt);
      } }), u(ne, fe);
    };
    I(ye, (ne) => {
      s(q) && ne(we);
    });
  }
  var le = v(H, 2);
  {
    var ce = (ne) => {
      z4(ne, { get gpuInfo() {
        return m();
      } });
    };
    I(le, (ne) => {
      s(M) && m() && ne(ce);
    });
  }
  var pe = v(le, 2), ge = d(pe);
  {
    var Te = (ne) => {
      var fe = Y4();
      u(ne, fe);
    };
    I(ge, (ne) => {
      r().length === 0 && ne(Te);
    });
  }
  var he = v(ge, 2);
  Ge(he, 17, r, Qe, (ne, fe, be) => {
    var _e40 = Ae(), $e = re(_e40);
    {
      var Ce = (Ve) => {
        A4(Ve, { get pendingData() {
          return s(fe).pendingData;
        }, get onmarkacted() {
          return e.onmarkacted;
        }, get ondismiss() {
          return e.ondismiss;
        }, get onremove() {
          return e.onremove;
        }, get onclearcategory() {
          return e.onclearcategory;
        }, onaskai: T });
      }, ze = (Ve) => {
        Go(Ve, { get msg() {
          return s(fe);
        } });
      }, Re = (Ve) => {
        _4(Ve, { get msg() {
          return s(fe);
        }, get oncommand() {
          return e.oncommand;
        }, get onexecuted() {
          return e.onexecuted;
        }, ondismiss: () => r(r().filter((st, gt) => gt !== be)) });
      }, je = (Ve) => {
        const st = V(() => {
          var _a10;
          return (_a10 = r().slice(0, be).filter((gt) => gt.role === "assistant").at(-1)) == null ? void 0 : _a10.model;
        });
        {
          let gt = V(() => be === r().length - 1), Lt = V(() => s(fe).role === "assistant" && !!s(fe).model && s(fe).model !== s(st));
          fA(Ve, { get msg() {
            return s(fe);
          }, get isLast() {
            return s(gt);
          }, get isRunning() {
            return l();
          }, get generationPhase() {
            return p();
          }, get numTokens() {
            return f();
          }, get backend() {
            return D();
          }, get showModelName() {
            return s(Lt);
          } });
        }
      };
      I($e, (Ve) => {
        s(fe).type === "dashboard" ? Ve(Ce) : s(fe).type === "task-card" ? Ve(ze, 1) : s(fe).type === "event" || s(fe).type === "event-batch" || s(fe).type === "events-by-category" ? Ve(Re, 2) : Ve(je, -1);
      });
    }
    u(ne, _e40);
  }), Jn(pe, (ne) => U(ne), () => U());
  var ue = v(pe, 2);
  P4(ue, { get hasScanData() {
    return a();
  }, get engineReady() {
    return o();
  }, get isScanning() {
    return i();
  }, get onscan() {
    return e.onscan;
  } });
  var Ee = v(ue, 2), xe = d(Ee);
  D4(xe, { rows: 1, placeholder: "Type a message\u2026", onkeydown: F, get disabled() {
    return l();
  }, class: "flex-1 resize-none min-h-[42px] max-h-[160px] overflow-y-auto leading-relaxed py-2.5", get value() {
    return s(j);
  }, set value(ne) {
    g(j, ne, true);
  } });
  var Se = v(xe, 2);
  {
    var Fe = (ne) => {
      tt(ne, { variant: "outline", size: "sm", get onclick() {
        return e.onstop;
      }, class: "h-[42px] px-4", children: (fe, be) => {
        var _e40 = Be("Stop");
        u(fe, _e40);
      }, $$slots: { default: true } });
    }, qe = (ne) => {
      {
        let fe = V(() => !s(j).trim());
        tt(ne, { size: "sm", onclick: P, get disabled() {
          return s(fe);
        }, class: "h-[42px] px-4", children: (be, _e40) => {
          var $e = Be("Send");
          u(be, $e);
        }, $$slots: { default: true } });
      }
    };
    I(Se, (ne) => {
      l() ? ne(Fe) : ne(qe, -1);
    });
  }
  L(() => w.disabled = l()), Pe("click", w, () => C("[SHOW:DASHBOARD]")), u(t, K), Le();
}
Zt(["click"]);
var Z4 = _('<div class="shrink-0 px-3 py-2 text-center text-sm bg-amber-500/20 text-amber-200 border-b border-amber-500/30" role="alert">Storage unavailable (e.g. private browsing). Settings and data are not persisted.</div>'), J4 = _('<div class="w-full h-full overflow-y-auto flex justify-center"><div class="w-full max-w-2xl px-4 py-8 flex flex-col gap-0"><!> <!></div></div>'), Q4 = _('<div class="w-full h-full flex flex-col overflow-hidden"><!> <!></div>');
function eE(t, e) {
  De(e, true);
  const r = !!navigator.gpu, n = Hd();
  let a = ee("webgpu"), o = ee("onnx-community/gpt-oss-20b-ONNX"), i = ee(null), l = ee(null), c = ee(""), f = false, p = ee(nt([])), m = ee(nt([])), h = ee(false), x = ee(null), b = ee(null), y = ee(false), k = ee("q4f16"), D = ee("webgpu"), U = ee(4096), j = ee(false), M = ee(0.7), q = ee(1.1), F = ee(null), P = ee(null), C = ee(null), T = ee(null), N = ee(false), K = ee(false), W = false, A = ee(false);
  Xt(async () => {
    try {
      const [ce, pe, ge, Te, he, ue, Ee, xe, Se] = await Promise.all([sr("aiBackend"), sr("selectedModel"), sr("enableThinking"), sr("loadDtype"), sr("loadDevice"), sr("maxTokens"), sr("doSample"), sr("temperature"), sr("repetitionPenalty")]);
      ce && g(a, ce, true), pe && g(o, pe, true), ge !== void 0 && g(y, ge, true), Te && g(k, Te, true), he && g(D, he, true), ue != null && g(U, ue, true), Ee !== void 0 && g(j, Ee, true), xe != null && g(M, xe, true), Se != null && g(q, Se, true);
    } catch {
      g(A, true);
    }
    n.status === "idle" && n.check(), n.isReady && S();
    const le = n.onMessage((ce) => {
      switch (ce.status) {
        case "webgpu-info":
          g(P, ce.data, true);
          break;
        case "loading":
          g(i, "loading"), g(c, ce.data, true);
          break;
        case "initiate":
          g(p, [...s(p), ce], true);
          break;
        case "progress":
          g(p, s(p).map((ge) => ge.file === ce.file ? { ...ge, ...ce } : ge), true);
          break;
        case "done":
          g(p, s(p).filter((ge) => ge.file !== ce.file), true);
          break;
        case "ready":
          g(i, "ready"), S();
          break;
        case "start":
          if (!s(h)) break;
          g(C, ce.phase || "preparing", true), g(m, [...s(m), { role: "assistant", content: "", thinking: "", model: s(o) }], true);
          break;
        case "phase":
          if (!s(h)) break;
          g(C, ce.phase, true);
          break;
        case "thinking": {
          if (!s(h)) break;
          g(x, ce.tps, true), g(b, ce.numTokens, true);
          const ge = s(m)[s(m).length - 1];
          g(m, [...s(m).slice(0, -1), { ...ge, thinking: (ge.thinking || "") + ce.content }], true), $(false);
          break;
        }
        case "thinking-done": {
          if (!s(h)) break;
          g(x, ce.tps, true), g(b, ce.numTokens, true);
          const ge = s(m)[s(m).length - 1];
          g(m, [...s(m).slice(0, -1), { ...ge, thinking: ce.content }], true);
          break;
        }
        case "update": {
          if (!s(h)) break;
          g(x, ce.tps, true), g(b, ce.numTokens, true);
          const ge = s(m)[s(m).length - 1];
          g(m, [...s(m).slice(0, -1), { ...ge, content: ge.content + ce.output }], true), $(false);
          break;
        }
        case "complete":
          if (!s(h)) break;
          ce.tps !== void 0 && g(x, ce.tps, true), ce.numTokens !== void 0 && g(b, ce.numTokens, true), g(h, false), g(C, null);
          const pe = s(m)[s(m).length - 1];
          if (pe && pe.role === "assistant" && pe.content) {
            let ge = pe.content, Te = false;
            const he = /\[EXECUTE:CATEGORY:([A-Z_]+)\]/g;
            let ue;
            const Ee = [];
            for (; (ue = he.exec(ge)) !== null; ) Ee.push(ue[1]);
            if (Ee.length > 0) {
              ge = ge.replace(/\[EXECUTE:CATEGORY:[A-Z_]+\]/g, "").trim(), Te = true;
              for (const xe of Ee) s(T) && s(T).categories && s(T).categories[xe] && R(xe, s(T).categories[xe]);
            }
            ge.includes("[SHOW:DASHBOARD]") && (ge = ge.replace(/\[SHOW:DASHBOARD\]/g, "").trim(), Te = true, as({ pendingOnly: true }).then((xe) => {
              xe.order.length > 0 && Eo(xe).then((Se) => {
                g(m, [...s(m), Se], true), $();
              });
            }).catch((xe) => {
              g(m, [...s(m), { role: "assistant", content: `Failed to load events dashboard: ${xe.message}` }], true);
            })), Te && g(m, [...s(m).slice(0, -1), { ...pe, content: ge === "" ? "Okay, here you go:" : ge }], true);
          }
          w();
          break;
        case "error":
          if (f && g(l, ce.data, true), s(i) === "loading" && g(i, null), s(h)) {
            g(h, false), g(C, null);
            const ge = s(m)[s(m).length - 1];
            ge && ge.role === "assistant" && !ge.content && g(m, [...s(m).slice(0, -1), { ...ge, content: `Error: ${ce.data || "Unknown error"}` }], true);
          }
          break;
      }
    });
    return () => le();
  });
  async function S() {
    if (!(W || s(m).length > 0)) try {
      const le = await ci();
      g(T, le, true), le && (W = true, g(m, [{ role: "assistant", type: "dashboard", pendingData: le }], true), $());
      const ce = await Al();
      g(N, ce.classified > 0);
    } catch {
    }
  }
  async function w() {
    try {
      const le = await ci();
      g(T, le, true);
      const ce = s(m).findIndex((Te) => Te.type === "dashboard");
      ce !== -1 && (le && le.total > 0 ? g(m, s(m).map((Te, he) => he === ce ? { ...Te, pendingData: le } : Te), true) : g(m, s(m).filter((Te, he) => he !== ce), true));
      const pe = s(m).findLastIndex((Te) => Te.type === "events-by-category");
      if (pe !== -1) {
        const Te = await as({ pendingOnly: true });
        if (Te.order.length === 0) g(m, s(m).filter((he, ue) => ue !== pe), true);
        else {
          const he = await Eo(Te);
          g(m, s(m).map((ue, Ee) => Ee === pe ? he : ue), true);
        }
      }
      const ge = await Al();
      g(N, ge.classified > 0);
    } catch {
    }
  }
  async function R(le, ce) {
    if (!n.isReady) return;
    const pe = s(m).length, ge = `${le.split("_").map((he) => he.charAt(0) + he.slice(1).toLowerCase()).join(" ")} (${ce.length})`;
    g(m, [...s(m), { role: "assistant", type: "task-card", title: `Executing ${ge}`, status: "running", steps: [] }], true), $();
    const Te = (he) => Object.assign(s(m)[pe], he);
    try {
      (await $c(le, ce, (ue) => {
        var _a10;
        const Ee = s(m)[pe].steps || [];
        if (ue.phase === "pipeline_loaded") Te({ steps: ue.actions.map((xe) => ({ id: xe.id ?? xe.commandId, label: xe.name ?? xe.commandId, status: "pending" })) });
        else if (ue.phase === "action_start") Te({ steps: Ee.map((xe) => xe.id === (ue.actionId ?? ue.commandId) ? { ...xe, status: "running", startedAt: Date.now() } : xe) });
        else if (ue.phase === "action_complete") {
          const xe = ((_a10 = ue.result) == null ? void 0 : _a10.success) !== false;
          Te({ steps: Ee.map((Se) => {
            var _a11, _b4;
            return Se.id === (ue.actionId ?? ue.commandId) ? { ...Se, status: xe ? "done" : "error", expandable: !!((_a11 = ue.result) == null ? void 0 : _a11.message), subContent: ((_b4 = ue.result) == null ? void 0 : _b4.message) ?? "" } : Se;
          }) });
        } else ue.phase === "done" ? Te({ status: (s(m)[pe].steps || []).every((xe) => xe.status !== "error") ? "done" : "error" }) : ue.phase === "error" && Te({ status: "error", steps: [...Ee.filter((xe) => xe.status !== "running"), { id: "__err", label: ue.error ?? "Execution failed", status: "error" }] });
      }, true)).success && await w();
    } catch (he) {
      Te({ status: "error", steps: [...(s(m)[pe].steps ?? []).filter((ue) => ue.status !== "running"), { id: "error", label: `Execution failed: ${he.message}`, status: "error" }] });
    }
  }
  async function B(le) {
    await vs(le, "acted"), await w();
  }
  async function Z(le) {
    await vs(le, "dismissed"), await w();
  }
  async function X(le) {
    await Yv(le), await w();
  }
  async function H(le) {
    await Oc(le), await w();
  }
  async function te() {
    var _a10;
    if (s(K) || !n.isReady) return;
    g(K, true);
    const le = s(a) === "cloud" ? ((_a10 = pa.find((ue) => ue.id === s(o))) == null ? void 0 : _a10.provider) || "cloud" : s(a), ce = s(m).length;
    g(m, [...s(m), { role: "assistant", type: "task-card", title: "Scanning Emails", model: le, status: "running", steps: [{ id: "fetch", label: "Fetching recent emails\u2026", status: "running", startedAt: Date.now() }] }], true), $();
    const pe = (ue) => Object.assign(s(m)[ce], ue);
    let ge = null, Te = 0;
    const he = [];
    try {
      let ue = null, Ee = 0;
      await Hv(n, { count: 20, onProgress: (Se) => {
        var _a11, _b4, _c6;
        if (Se.phase === "loading") s(m)[ce].steps = [{ id: "fetch", label: "Loading recent emails\u2026", status: "running", startedAt: Date.now() }];
        else if (Se.phase === "scanning") {
          Ee = Se.total ?? 0, ue || (ue = Date.now());
          const Fe = ((_a11 = Se.email) == null ? void 0 : _a11.subject) ?? "unknown", qe = Fe.length > 46 ? Fe.slice(0, 44) + "\u2026" : Fe;
          s(m)[ce].steps = [{ id: "fetch", label: `Found ${Ee} emails to scan`, status: "done", detail: `${Ee} messages` }, ...he, { id: `email-${Se.current}`, label: qe, status: "running", startedAt: ue, detail: `${Se.current}/${Se.total}` }];
        } else if (Se.phase === "classified") {
          const Fe = ((_b4 = Se.email) == null ? void 0 : _b4.subject) ?? "unknown", qe = Fe.length > 46 ? Fe.slice(0, 44) + "\u2026" : Fe, ne = Se.result, fe = (ne == null ? void 0 : ne.categoryTier) ?? (ne == null ? void 0 : ne.category) ?? "", be = (ne == null ? void 0 : ne.action) ?? "", _e40 = (ne == null ? void 0 : ne.reason) ?? "", $e = (ne == null ? void 0 : ne.summary) ?? "", Ce = [];
          $e && Ce.push($e), be && Ce.push(`Action: ${be}`), _e40 && Ce.push(`Reason: ${_e40}`), he.push({ id: `email-${Se.current}`, label: qe, status: "done", detail: be || fe, expandable: true, badges: [fe, be].filter(Boolean), subContent: Ce.join(`
`) }), s(m)[ce].steps = [{ id: "fetch", label: `Found ${Ee} emails to scan`, status: "done", detail: `${Ee} messages` }, ...he];
        } else Se.phase === "done" && (((_c6 = Se.results) == null ? void 0 : _c6.length) > 0 && (ge = Se.results), Te = Ee);
      } });
      const xe = he.length;
      if (s(m)[ce].steps = [{ id: "fetch", label: `Fetched ${Te} emails`, status: "done", detail: `${Te} messages` }, ...he], s(m)[ce].description = xe > 0 ? `Classified ${xe} email${xe !== 1 ? "s" : ""} into event types. Expand any row to see classification details.` : "No new emails to classify.", pe({ status: "done", title: `Scanned ${Te} Emails` }), await w(), (ge == null ? void 0 : ge.length) > 0) {
        const Se = await cb(ge);
        g(m, [...s(m), Se], true), $();
      }
      s(T) && !s(m).some((Se) => Se.type === "dashboard") && (g(m, [{ role: "assistant", type: "dashboard", pendingData: s(T) }, ...s(m)], true), $());
    } catch (ue) {
      console.error("Scan failed:", ue), s(m)[ce].status = "error", s(m)[ce].steps = [...(s(m)[ce].steps ?? []).filter((Ee) => Ee.status !== "running"), { id: "error", label: `Scan failed: ${ue.message}`, status: "error" }];
    } finally {
      g(K, false);
    }
  }
  function Y({ event: le, commandId: ce }) {
    var _a10, _b4;
    `${ce}${le.type}${((_a10 = le.data) == null ? void 0 : _a10.subject) || "unknown"}`, g(m, [...s(m), { role: "assistant", content: `Command: ${ce}

This command is not yet implemented. In the future, "${ce}" will be executed on the ${le.source} event "${((_b4 = le.data) == null ? void 0 : _b4.subject) || ""}".` }], true), $();
  }
  function $(le = true) {
    dc().then(() => {
      if (!s(F)) return;
      const { scrollTop: ce, scrollHeight: pe, clientHeight: ge } = s(F), Te = pe - ce - ge < 80;
      (le || Te) && (s(F).scrollTop = s(F).scrollHeight);
    });
  }
  async function O() {
    g(i, "loading"), g(l, null), f = true;
    try {
      await _r("selectedModel", s(o)), await _r("aiBackend", s(a)), await _r("loadDtype", s(k)), await _r("loadDevice", s(D));
    } catch {
      g(A, true);
    }
    s(a) !== "webgpu" && g(P, null);
    const le = s(a) === "webgpu" ? { dtype: s(k), device: s(D) } : {};
    n.loadModel(s(o), le);
  }
  async function G() {
    g(l, null), g(i, "loading"), await n.clearCache(s(o)), await O();
  }
  Ut(() => {
    s(a) === "webgpu" && !ea.find((le) => le.id === s(o)) ? g(o, ea[0].id, true) : s(a) === "ollama" && !zn.find((le) => le.name === s(o)) ? g(o, zn[0].name, true) : s(a) === "cloud" && !pa.find((le) => le.id === s(o)) && g(o, pa[0].id, true);
  }), Ut(() => {
    const le = s(y), ce = s(U), pe = s(j), ge = s(M), Te = s(q);
    (async () => {
      try {
        await _r("enableThinking", le), await _r("maxTokens", ce), await _r("doSample", pe), await _r("temperature", ge), await _r("repetitionPenalty", Te);
      } catch {
        g(A, true);
      }
    })();
  });
  async function J(le) {
    if (!le || s(h)) return;
    if (le.trim() === "[SHOW:DASHBOARD]") {
      try {
        const he = await as({ pendingOnly: true });
        if (!he.order.length) g(m, [...s(m), { role: "assistant", content: "No pending classified emails. Run a scan first or all events are already handled." }], true);
        else {
          const ue = await Eo(he);
          g(m, [...s(m), ue], true);
        }
      } catch (he) {
        g(m, [...s(m), { role: "assistant", content: `Failed to load events dashboard: ${he.message}` }], true);
      }
      $();
      return;
    }
    const pe = /^\[EXECUTE:CATEGORY:([A-Z_]+)\]$/.exec(le.trim());
    if (pe) {
      const he = pe[1];
      s(T) && s(T).categories && s(T).categories[he] && R(he, s(T).categories[he]);
      return;
    }
    if (le.trim().toLowerCase() === "/events") {
      g(m, [...s(m), { role: "user", content: le }], true);
      try {
        const he = await as({ pendingOnly: true });
        if (!he.order.length) g(m, [...s(m), { role: "assistant", content: "No pending classified emails. Run a scan first or all events are already handled." }], true);
        else {
          const ue = await Eo(he);
          g(m, [...s(m), ue], true);
        }
      } catch (he) {
        g(m, [...s(m), { role: "assistant", content: `Failed to load events: ${he.message}` }], true);
      }
      $();
      return;
    }
    g(m, [...s(m), { role: "user", content: le }], true), g(x, null), g(h, true);
    let ge = [];
    try {
      const ue = /\b(email|mail|inbox|message|sent|sender|from|subject|unread|gmail|pending|action|archive|delete|reply|follow.?up|prioriti|triage|urgent)\b/i.test(le) ? await j3(le) : await L3();
      ue && (ge = [{ role: "system", content: ue }]);
    } catch {
    }
    const Te = s(m).filter((he) => he.type !== "dashboard" && he.type !== "events-by-category" && he.type !== "event-batch" && he.type !== "event").map((he) => ({ role: he.role, content: he.content }));
    n.generate([...ge, ...Te], { enableThinking: s(y), maxTokens: s(U), do_sample: s(j), temperature: s(M), top_p: 0.95, top_k: 50, repetition_penalty: s(q) }), $();
  }
  function se() {
    n.interrupt();
  }
  function ie() {
    n.reset(), g(m, [], true), g(x, null), g(b, null), W = false, S();
  }
  var oe = Q4(), de = d(oe);
  {
    var ve = (le) => {
      var ce = Z4();
      u(le, ce);
    };
    I(de, (le) => {
      s(A) && le(ve);
    });
  }
  var me = v(de, 2);
  {
    var ke = (le) => {
      var ce = J4(), pe = d(ce), ge = d(pe);
      G3(ge, { get isWebGPUAvailable() {
        return r;
      }, get backend() {
        return s(a);
      }, set backend(xe) {
        g(a, xe, true);
      } });
      var Te = v(ge, 2);
      {
        var he = (xe) => {
          lT(xe, { get gpuInfo() {
            return s(P);
          }, get error() {
            return s(l);
          }, onload: O, onclearerror: () => {
            g(l, null);
          }, onclearcache: G, get selectedModel() {
            return s(o);
          }, set selectedModel(Se) {
            g(o, Se, true);
          }, get loadDtype() {
            return s(k);
          }, set loadDtype(Se) {
            g(k, Se, true);
          }, get loadDevice() {
            return s(D);
          }, set loadDevice(Se) {
            g(D, Se, true);
          } });
        }, ue = (xe) => {
          IT(xe, { onload: O, get selectedModel() {
            return s(o);
          }, set selectedModel(Se) {
            g(o, Se, true);
          }, get error() {
            return s(l);
          }, set error(Se) {
            g(l, Se, true);
          } });
        }, Ee = (xe) => {
          jT(xe, { onload: O, get selectedModel() {
            return s(o);
          }, set selectedModel(Se) {
            g(o, Se, true);
          }, get error() {
            return s(l);
          }, set error(Se) {
            g(l, Se, true);
          } });
        };
        I(Te, (xe) => {
          s(a) === "webgpu" ? xe(he) : s(a) === "ollama" ? xe(ue, 1) : s(a) === "cloud" && xe(Ee, 2);
        });
      }
      u(le, ce);
    }, ye = (le) => {
      qT(le, { get message() {
        return s(c);
      }, get items() {
        return s(p);
      } });
    }, we = (le) => {
      {
        let ce = V(() => {
          var _a10;
          return s(a) === "cloud" ? ((_a10 = pa.find((pe) => pe.id === s(o))) == null ? void 0 : _a10.provider) || "cloud" : s(a);
        });
        X4(le, { get messages() {
          return s(m);
        }, get pendingData() {
          return s(T);
        }, get hasScanData() {
          return s(N);
        }, get engineReady() {
          return n.isReady;
        }, get isScanning() {
          return s(K);
        }, get isRunning() {
          return s(h);
        }, get tps() {
          return s(x);
        }, get numTokens() {
          return s(b);
        }, get generationPhase() {
          return s(C);
        }, get gpuInfo() {
          return s(P);
        }, get backend() {
          return s(ce);
        }, onsend: J, onstop: se, onreset: ie, onmarkacted: B, ondismiss: Z, onremove: X, onclearcategory: H, onscan: te, oncommand: Y, onexecuted: w, get enableThinking() {
          return s(y);
        }, set enableThinking(pe) {
          g(y, pe, true);
        }, get maxTokens() {
          return s(U);
        }, set maxTokens(pe) {
          g(U, pe, true);
        }, get doSample() {
          return s(j);
        }, set doSample(pe) {
          g(j, pe, true);
        }, get temperature() {
          return s(M);
        }, set temperature(pe) {
          g(M, pe, true);
        }, get repetitionPenalty() {
          return s(q);
        }, set repetitionPenalty(pe) {
          g(q, pe, true);
        }, get chatContainer() {
          return s(F);
        }, set chatContainer(pe) {
          g(F, pe, true);
        } });
      }
    };
    I(me, (le) => {
      s(i) === null ? le(ke) : s(i) === "loading" ? le(ye, 1) : le(we, -1);
    });
  }
  u(t, oe), Le();
}
var tE = _('<div class="flex items-center justify-center gap-4 animate-pulse h-10"><div class="h-8 w-32 bg-muted/40 rounded-full"></div> <div class="h-px w-8 bg-muted/40"></div> <div class="h-8 w-32 bg-muted/40 rounded-full"></div> <div class="h-px w-8 bg-muted/40"></div> <div class="h-8 w-32 bg-muted/40 rounded-full"></div></div>'), rE = _('<span class="text-[0.6rem] opacity-80 mt-1 leading-none"> </span>'), nE = _('<span class="text-[0.6rem] opacity-80 mt-1 leading-none">Sync needed</span>'), aE = _('<span class="text-[0.6rem] opacity-60 mt-1 leading-none">Start here</span>'), sE = _('<span class="text-[0.6rem] opacity-80 mt-1 leading-none"> </span>'), oE = _('<span class="text-[0.6rem] opacity-80 mt-1 leading-none">Ready to run</span>'), iE = _('<span class="text-[0.6rem] opacity-80 mt-1 leading-none text-amber-400/80">Load AI first</span>'), lE = _('<span class="text-[0.6rem] opacity-60 mt-1 leading-none">Pending sources</span>'), cE = _('<span class="text-[0.6rem] opacity-80 mt-1 leading-none"> </span>'), dE = _('<span class="text-[0.6rem] opacity-80 mt-1 leading-none">Configure rules</span>'), uE = _('<span class="text-[0.6rem] opacity-60 mt-1 leading-none">Pending scan</span>'), fE = _('<div class="flex items-center justify-center gap-0"><nav aria-label="Progress" class="flex items-center"><a href="#sources" class="relative flex items-center group no-underline"><div><div><!></div> <div class="flex flex-col"><span class="text-[0.7rem] font-bold uppercase tracking-wider leading-none">Sources</span> <!></div></div></a> <div></div> <a href="#scan"><div><div><!></div> <div class="flex flex-col"><span class="text-[0.7rem] font-bold uppercase tracking-wider leading-none">Scan</span> <!></div></div></a> <div></div> <a href="#pipelines" class="relative flex items-center group no-underline"><div><div><!></div> <div class="flex flex-col"><span class="text-[0.7rem] font-bold uppercase tracking-wider leading-none">Control</span> <!></div></div></a> <div class="h-8 w-px bg-border/80 ml-6 mr-1 shrink-0" aria-hidden="true"></div> <a href="#admin" class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[0.7rem] font-medium text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/60 transition-colors no-underline shrink-0" title="Admin dashboard"><!> <span class="tracking-tight">Admin</span></a></nav></div>'), pE = _('<div class="flex flex-col h-full overflow-hidden"><div class="flex items-center gap-2 px-4 h-11 shrink-0 border-b border-border bg-sidebar"><div class="size-6 rounded bg-primary flex items-center justify-center shrink-0"><!></div> <span class="text-sm font-semibold tracking-tight text-foreground">me-ai</span></div> <div class="shrink-0 border-b border-border bg-card/40 backdrop-blur-sm px-6 py-2.5"><!></div> <div class="flex-1 min-h-0 overflow-hidden flex flex-col"><!></div></div>');
function vE(t, e) {
  De(e, true);
  let r = ee(false), n = ee(0), a = ee(0), o = ee(0), i = ee(true);
  const l = Hd();
  let c = ee(nt(l.isReady));
  Ut(() => l.onMessage((C) => {
    C.status === "ready" && g(c, true);
  })), Xt(async () => {
    try {
      await ba() && Cc() && g(r, true);
    } catch {
    }
    try {
      const P = await Wg();
      g(n, P.totalItems ?? 0, true);
    } catch {
    }
    try {
      const P = await am();
      g(n, s(n) + (P.totalItems ?? 0));
    } catch {
    }
    try {
      await tm() && g(r, true);
    } catch {
    }
    try {
      const P = await qv();
      g(a, P.total ?? 0, true);
    } catch {
    }
    try {
      const P = await ki();
      g(o, P.total ?? 0, true);
    } catch {
    }
    g(i, false);
  });
  const f = V(() => s(r) ? s(n) > 0 ? "done" : "active" : "idle"), p = V(() => s(n) > 0 && s(c) ? s(a) > 0 ? "done" : "active" : "idle"), m = V(() => s(n) > 0 && !s(c)), h = V(() => s(a) > 0 ? s(o) > 0 ? "done" : "active" : "idle");
  var x = pE(), b = d(x), y = d(b), k = d(y);
  bg(k, { class: "size-3.5 text-primary-foreground" });
  var D = v(b, 2), U = d(D);
  {
    var j = (P) => {
      var C = tE();
      u(P, C);
    }, M = (P) => {
      var C = fE(), T = d(C), N = d(T), K = d(N), W = d(K), A = d(W);
      {
        var S = (ne) => {
          Ks(ne, { class: "size-3" });
        }, w = (ne) => {
          gs(ne, { class: "size-3" });
        };
        I(A, (ne) => {
          s(f) === "done" ? ne(S) : ne(w, -1);
        });
      }
      var R = v(W, 2), B = v(d(R), 2);
      {
        var Z = (ne) => {
          var fe = rE(), be = d(fe);
          L((_e40) => E(be, `${_e40 ?? ""} emails`), [() => s(n).toLocaleString()]), u(ne, fe);
        }, X = (ne) => {
          var fe = nE();
          u(ne, fe);
        }, H = (ne) => {
          var fe = aE();
          u(ne, fe);
        };
        I(B, (ne) => {
          s(f) === "done" ? ne(Z) : s(f) === "active" ? ne(X, 1) : ne(H, -1);
        });
      }
      var te = v(N, 2), Y = v(te, 2), $ = d(Y), O = d($), G = d(O);
      {
        var J = (ne) => {
          Ks(ne, { class: "size-3" });
        }, se = (ne) => {
          Px(ne, { class: "size-3" });
        };
        I(G, (ne) => {
          s(p) === "done" ? ne(J) : ne(se, -1);
        });
      }
      var ie = v(O, 2), oe = v(d(ie), 2);
      {
        var de = (ne) => {
          var fe = sE(), be = d(fe);
          L((_e40) => E(be, `${_e40 ?? ""} classified`), [() => s(a).toLocaleString()]), u(ne, fe);
        }, ve = (ne) => {
          var fe = oE();
          u(ne, fe);
        }, me = (ne) => {
          var fe = iE();
          u(ne, fe);
        }, ke = (ne) => {
          var fe = lE();
          u(ne, fe);
        };
        I(oe, (ne) => {
          s(p) === "done" ? ne(de) : s(p) === "active" ? ne(ve, 1) : s(m) ? ne(me, 2) : ne(ke, -1);
        });
      }
      var ye = v(Y, 2), we = v(ye, 2), le = d(we), ce = d(le), pe = d(ce);
      {
        var ge = (ne) => {
          Ks(ne, { class: "size-3" });
        }, Te = (ne) => {
          mg(ne, { class: "size-3" });
        };
        I(pe, (ne) => {
          s(h) === "done" ? ne(ge) : ne(Te, -1);
        });
      }
      var he = v(ce, 2), ue = v(d(he), 2);
      {
        var Ee = (ne) => {
          var fe = cE(), be = d(fe);
          L(() => E(be, `${s(o) ?? ""}
                    ${s(o) === 1 ? "rule" : "rules"} active`)), u(ne, fe);
        }, xe = (ne) => {
          var fe = dE();
          u(ne, fe);
        }, Se = (ne) => {
          var fe = uE();
          u(ne, fe);
        };
        I(ue, (ne) => {
          s(h) === "done" ? ne(Ee) : s(h) === "active" ? ne(xe, 1) : ne(Se, -1);
        });
      }
      var Fe = v(we, 4), qe = d(Fe);
      hg(qe, { class: "size-3.5 shrink-0" }), L(() => {
        rt(K, 1, `flex items-center gap-2.5 px-3 py-1.5 rounded-full transition-all duration-300 ${s(f) === "done" ? "bg-success/10 hover:bg-success/20 text-success" : s(f) === "active" ? "bg-primary/10 hover:bg-primary/20 text-primary ring-1 ring-primary/30 shadow-sm" : "hover:bg-muted/50 text-muted-foreground"}`), rt(W, 1, `flex items-center justify-center size-5 rounded-full shrink-0 transition-colors ${s(f) === "done" ? "bg-success text-success-foreground" : s(f) === "active" ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted-foreground/20 text-muted-foreground"}`), rt(te, 1, `w-6 sm:w-12 md:w-16 h-px mx-2 transition-colors duration-500 ${s(p) !== "idle" ? "bg-primary/40" : "bg-border/60"}`), rt(Y, 1, `relative flex items-center group no-underline ${s(p) === "idle" ? "pointer-events-none opacity-40 mix-blend-luminosity hover:mix-blend-normal transition-all" : ""}`), rt($, 1, `flex items-center gap-2.5 px-3 py-1.5 rounded-full transition-all duration-300 ${s(p) === "done" ? "bg-amber-500/10 hover:bg-amber-500/20 text-amber-500" : s(p) === "active" ? "bg-primary/10 hover:bg-primary/20 text-primary ring-1 ring-primary/30 shadow-sm" : "hover:bg-muted/50 text-muted-foreground"}`), rt(O, 1, `flex items-center justify-center size-5 rounded-full shrink-0 transition-colors ${s(p) === "done" ? "bg-amber-500 text-white" : s(p) === "active" ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted-foreground/20 text-muted-foreground"}`), rt(ye, 1, `w-6 sm:w-12 md:w-16 h-px mx-2 transition-colors duration-500 ${s(h) !== "idle" ? "bg-primary/40" : "bg-border/60"}`), rt(le, 1, `flex items-center gap-2.5 px-3 py-1.5 rounded-full transition-all duration-300 ${s(h) === "done" ? "bg-primary/10 hover:bg-primary/20 text-primary" : s(h) === "active" ? "bg-primary/10 hover:bg-primary/20 text-primary ring-1 ring-primary/30 shadow-sm" : "hover:bg-muted/50 text-muted-foreground"}`), rt(ce, 1, `flex items-center justify-center size-5 rounded-full shrink-0 transition-colors ${s(h) === "done" ? "bg-primary text-primary-foreground" : s(h) === "active" ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted-foreground/20 text-muted-foreground"}`);
      }), u(P, C);
    };
    I(U, (P) => {
      s(i) ? P(j) : P(M, -1);
    });
  }
  var q = v(D, 2), F = d(q);
  eE(F, {}), u(t, x), Le();
}
var gE = _('<span class="size-1.5 rounded-full shrink-0 bg-[var(--color-success)]"></span> <span class="text-[0.72rem] font-semibold text-[var(--color-success)]">Scan complete</span>', 1), mE = _('<span class="size-1.5 rounded-full shrink-0 bg-[var(--color-warning)] animate-pulse"></span> <span class="text-[0.72rem] font-medium text-muted-foreground">Loading emails\u2026</span>', 1), hE = _('<span class="size-1.5 rounded-full shrink-0 bg-primary animate-pulse"></span> <span class="text-[0.72rem] font-medium text-muted-foreground">Scanning email <strong class="text-foreground"> </strong> of <strong class="text-foreground"> </strong></span>', 1), _E = _('<span class="flex items-center gap-1 text-[0.64rem] font-medium text-destructive"><span class="opacity-70">\u2717</span> </span>'), bE = _('<span class="flex items-center gap-1 text-[0.64rem] font-medium text-muted-foreground"><span class="opacity-70">\u26A1</span> </span>'), xE = _('<div class="flex flex-wrap gap-x-3 gap-y-1 mb-2"><span class="flex items-center gap-1 text-[0.64rem] font-medium text-[var(--color-success)]"><span class="opacity-70">\u2713</span> </span> <!> <span class="flex items-center gap-1 text-[0.64rem] font-medium text-muted-foreground"><span class="opacity-70">\u23F1</span> </span> <!></div>'), yE = _('<span class="text-muted-foreground/80"> </span>'), wE = _('<span class="ml-auto text-muted-foreground/70"> </span>'), kE = _('<div class="rounded-lg border border-border bg-card p-2.5 mb-2"><div class="mb-1.5 pb-1.5 border-b border-border"><div class="text-[0.72rem] font-semibold text-foreground truncate"> </div> <div class="text-[0.6rem] text-muted-foreground"> <!></div></div> <div class="flex items-center gap-1.5 text-[0.62rem] text-muted-foreground mb-1.5"><span></span> <span> </span> <!></div> <pre class="m-0 p-2 text-[0.65rem] text-muted-foreground font-mono leading-relaxed whitespace-pre-wrap break-words max-h-[200px] overflow-y-auto rounded bg-muted/50 border border-border"> </pre></div>'), SE = _('<span class="text-[0.52rem] font-bold uppercase tracking-wide shrink-0 opacity-80"> </span>'), TE = _('<span class="text-[0.56rem] font-bold text-[var(--color-success)] uppercase tracking-wide bg-[var(--color-success)]/10 px-1.5 py-0.5 rounded shrink-0"> </span> <!>', 1), AE = _('<span class="text-[0.56rem] font-bold text-destructive bg-destructive/10 px-1.5 py-0.5 rounded shrink-0">Error</span>'), EE = _('<span class="text-muted-foreground/60">\xB7</span> ', 1), CE = _('<div class="text-[0.63rem] text-muted-foreground leading-snug mb-0.5"> </div>'), IE = _('<div class="text-[0.57rem] text-muted-foreground/80"><!> </div>'), PE = _('<div class="text-[0.62rem] text-destructive mt-0.5"> </div>'), $E = _('<details class="mt-1"><summary class="text-[0.58rem] text-muted-foreground cursor-pointer select-none hover:text-foreground">Raw AI output</summary> <pre class="mt-1 p-2 bg-muted/50 border border-border rounded text-[0.6rem] text-muted-foreground font-mono whitespace-pre-wrap break-words max-h-[200px] overflow-y-auto leading-tight"> </pre></details>'), NE = _('<div><div class="flex items-center gap-1.5 mb-0.5"><span class="text-[0.58rem] font-bold text-muted-foreground tabular-nums shrink-0"></span> <span class="text-[0.68rem] font-medium text-foreground truncate flex-1"> </span> <!></div> <div class="text-[0.58rem] text-muted-foreground mb-0.5"> <!></div> <!> <!> <!> <!></div>'), RE = _('<div class="mb-2"><div class="flex justify-between items-center mb-1.5"><span class="text-[0.62rem] font-bold text-muted-foreground uppercase tracking-wider">Processed emails</span> <span class="text-[0.6rem] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded"> </span></div> <!></div>'), ME = _('<div class="flex flex-col gap-0.5"><span class="text-base font-bold text-destructive leading-none"> </span> <span class="text-[0.58rem] text-muted-foreground uppercase tracking-wide">Errors</span></div>'), zE = _('<div class="flex flex-col gap-0.5"><span class="text-base font-bold text-muted-foreground leading-none"> </span> <span class="text-[0.58rem] text-muted-foreground uppercase tracking-wide">Skipped</span></div>'), OE = _('<div class="p-2.5 rounded-lg border border-border bg-muted/20 mb-2"><div class="flex gap-6 mb-1.5"><div class="flex flex-col gap-0.5"><span class="text-base font-bold text-foreground leading-none"> </span> <span class="text-[0.58rem] text-muted-foreground uppercase tracking-wide">Emails scanned</span></div> <div class="flex flex-col gap-0.5"><span class="text-base font-bold text-[var(--color-success)] leading-none"> </span> <span class="text-[0.58rem] text-muted-foreground uppercase tracking-wide">Classified</span></div> <!> <!></div> <div class="text-[0.6rem] text-muted-foreground"><!> <!></div></div>'), DE = _("<!> <!>", 1), LE = _("<!> <!>", 1), jE = _('<div class="mt-2 p-3 rounded-xl border border-border bg-card"><div class="flex justify-between items-center mb-1.5"><div class="flex items-center gap-1.5"><!></div> <span class="text-[0.68rem] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded"> </span></div> <div class="h-0.5 rounded bg-muted overflow-hidden mb-2"><div></div></div> <!> <!> <!> <!> <div class="flex gap-1.5 justify-end mt-2"><!></div></div>');
function BE(t, e) {
  De(e, true);
  let r = ae(e, "progress", 3, null);
  function n(x) {
    return !x || x < 0 ? "\u2014" : x < 1e3 ? `${Math.round(x)}ms` : x < 6e4 ? `${(x / 1e3).toFixed(1)}s` : `${Math.floor(x / 6e4)}m ${Math.floor(x % 6e4 / 1e3)}s`;
  }
  function a(x) {
    return x ? x >= 1e3 ? `${(x / 1e3).toFixed(1)}k` : String(x) : "0";
  }
  function o(x) {
    if (!x) return "\u2014";
    const b = x.replace(/<.*>/, "").trim();
    return b.length > 30 ? b.slice(0, 28) + "\u2026" : b;
  }
  function i(x) {
    if (!x) return "";
    try {
      return new Date(x).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch {
      return "";
    }
  }
  let l = V(() => {
    var _a10;
    return ((_a10 = r()) == null ? void 0 : _a10.total) ? Math.round(r().current / r().total * 100) : 0;
  }), c = V(() => {
    var _a10;
    return ((_a10 = r()) == null ? void 0 : _a10.phase) === "done";
  }), f = V(() => r() ? r().phase === "loading" ? "Loading emails from database" : r().phase === "generating" || r().phase === "scanning" ? r().streamingText ? "Reading email & reasoning" : "Sending to AI model\u2026" : "Processing" : "");
  var p = Ae(), m = re(p);
  {
    var h = (x) => {
      var b = jE(), y = d(b), k = d(y), D = d(k);
      {
        var U = (Y) => {
          var $ = gE();
          u(Y, $);
        }, j = (Y) => {
          var $ = mE();
          u(Y, $);
        }, M = (Y) => {
          var $ = hE(), O = v(re($), 2), G = v(d(O)), J = d(G), se = v(G, 2), ie = d(se);
          L(() => {
            E(J, r().current ?? 0), E(ie, r().total ?? 0);
          }), u(Y, $);
        };
        I(D, (Y) => {
          s(c) ? Y(U) : r().phase === "loading" ? Y(j, 1) : Y(M, -1);
        });
      }
      var q = v(k, 2), F = d(q), P = v(y, 2), C = d(P);
      let T;
      var N = v(P, 2);
      {
        var K = (Y) => {
          var $ = xE(), O = d($), G = v(d(O)), J = v(O, 2);
          {
            var se = (me) => {
              var ke = _E(), ye = v(d(ke));
              L(() => E(ye, ` ${r().errors ?? ""} error${r().errors !== 1 ? "s" : ""}`)), u(me, ke);
            };
            I(J, (me) => {
              r().errors && me(se);
            });
          }
          var ie = v(J, 2), oe = v(d(ie)), de = v(ie, 2);
          {
            var ve = (me) => {
              var ke = bE(), ye = v(d(ke));
              L((we) => E(ye, ` ${we ?? ""} tok/s`), [() => r().live.tps.toFixed(0)]), u(me, ke);
            };
            I(de, (me) => {
              var _a10;
              ((_a10 = r().live) == null ? void 0 : _a10.tps) && me(ve);
            });
          }
          L((me) => {
            E(G, ` ${(r().classified || 0) ?? ""} classified`), E(oe, ` ${me ?? ""}`);
          }, [() => n(r().totals.elapsed)]), u(Y, $);
        };
        I(N, (Y) => {
          r().totals && !s(c) && Y(K);
        });
      }
      var W = v(N, 2);
      {
        var A = (Y) => {
          var $ = kE(), O = d($), G = d(O), J = d(G), se = v(G, 2), ie = d(se), oe = v(ie);
          {
            var de = (ge) => {
              var Te = yE(), he = d(Te);
              L((ue) => E(he, `\xB7 ${ue ?? ""}`), [() => i(r().email.date)]), u(ge, Te);
            };
            I(oe, (ge) => {
              r().email.date && ge(de);
            });
          }
          var ve = v(O, 2), me = d(ve), ke = v(me, 2), ye = d(ke), we = v(ke, 2);
          {
            var le = (ge) => {
              var Te = wE(), he = d(Te);
              L(() => E(he, `${r().live.numTokens ?? ""} tokens`)), u(ge, Te);
            };
            I(we, (ge) => {
              var _a10;
              ((_a10 = r().live) == null ? void 0 : _a10.numTokens) && ge(le);
            });
          }
          var ce = v(ve, 2), pe = d(ce);
          L((ge, Te) => {
            E(J, r().email.subject || "(no subject)"), E(ie, `${ge ?? ""} `), rt(me, 1, Te), E(ye, s(f)), E(pe, r().streamingText || "Waiting for AI response\u2026");
          }, [() => o(r().email.from), () => Et(Je("size-1.5 rounded-full shrink-0", r().streamingText ? "bg-[var(--color-success)]" : "bg-primary/50 animate-pulse"))]), u(Y, $);
        };
        I(W, (Y) => {
          !s(c) && r().email && (r().phase === "generating" || r().phase === "scanning") && Y(A);
        });
      }
      var S = v(W, 2);
      {
        var w = (Y) => {
          var $ = RE(), O = d($), G = v(d(O), 2), J = d(G), se = v(O, 2);
          Ge(se, 17, () => r().results, Qe, (ie, oe, de) => {
            var ve = NE(), me = d(ve), ke = d(me);
            ke.textContent = `#${de + 1}`;
            var ye = v(ke, 2), we = d(ye), le = v(ye, 2);
            {
              var ce = (_e40) => {
                var $e = TE(), Ce = re($e), ze = d(Ce), Re = v(Ce, 2);
                {
                  var je = (Ve) => {
                    const st = V(() => In[s(oe).classification.categoryTier] || In.CRITICAL);
                    var gt = Ae(), Lt = re(gt);
                    {
                      var dt = (Jt) => {
                        var Wt = SE();
                        let Nr;
                        var Rr = d(Wt);
                        L(() => {
                          br(Wt, "title", s(st).description), Nr = Rt(Wt, "", Nr, { color: s(st).color }), E(Rr, s(st).label);
                        }), u(Jt, Wt);
                      };
                      I(Lt, (Jt) => {
                        s(st) && Jt(dt);
                      });
                    }
                    u(Ve, gt);
                  };
                  I(Re, (Ve) => {
                    s(oe).classification.categoryTier && Ve(je);
                  });
                }
                L(() => E(ze, s(oe).classification.action)), u(_e40, $e);
              }, pe = (_e40) => {
                var $e = AE();
                u(_e40, $e);
              };
              I(le, (_e40) => {
                s(oe).success ? _e40(ce) : _e40(pe, -1);
              });
            }
            var ge = v(me, 2), Te = d(ge), he = v(Te);
            {
              var ue = (_e40) => {
                var $e = EE(), Ce = v(re($e), 1, true);
                L((ze) => E(Ce, ze), [() => i(s(oe).email.date)]), u(_e40, $e);
              };
              I(he, (_e40) => {
                s(oe).email.date && _e40(ue);
              });
            }
            var Ee = v(ge, 2);
            {
              var xe = (_e40) => {
                var $e = CE(), Ce = d($e);
                L(() => E(Ce, s(oe).classification.summary)), u(_e40, $e);
              };
              I(Ee, (_e40) => {
                s(oe).success && s(oe).classification.summary && _e40(xe);
              });
            }
            var Se = v(Ee, 2);
            {
              var Fe = (_e40) => {
                var $e = IE(), Ce = d($e);
                {
                  var ze = (je) => {
                    var Ve = Be();
                    L((st) => E(Ve, `${st ?? ""} tok/s \xB7`), [() => s(oe).stats.tps.toFixed(0)]), u(je, Ve);
                  };
                  I(Ce, (je) => {
                    s(oe).stats.tps && je(ze);
                  });
                }
                var Re = v(Ce);
                L((je) => E(Re, `${(s(oe).stats.inputTokens || 0) ?? ""} in \xB7 ${(s(oe).stats.numTokens || 0) ?? ""} out \xB7 ${je ?? ""}`), [() => n(s(oe).stats.elapsed)]), u(_e40, $e);
              };
              I(Se, (_e40) => {
                s(oe).success && s(oe).stats && _e40(Fe);
              });
            }
            var qe = v(Se, 2);
            {
              var ne = (_e40) => {
                var $e = PE(), Ce = d($e);
                L(() => E(Ce, s(oe).error)), u(_e40, $e);
              };
              I(qe, (_e40) => {
                s(oe).success || _e40(ne);
              });
            }
            var fe = v(qe, 2);
            {
              var be = (_e40) => {
                var $e = $E(), Ce = v(d($e), 2), ze = d(Ce);
                L(() => E(ze, s(oe).rawResponse)), u(_e40, $e);
              };
              I(fe, (_e40) => {
                s(oe).rawResponse && _e40(be);
              });
            }
            L((_e40) => {
              rt(ve, 1, `p-2 rounded-lg border mb-1 ${s(oe).success ? "border-border bg-muted/20" : "border-destructive/20 bg-destructive/5"}`), E(we, s(oe).email.subject || "(no subject)"), E(Te, _e40);
            }, [() => o(s(oe).email.from)]), u(ie, ve);
          }), L(() => E(J, `${r().results.length ?? ""} / ${r().total ?? 0 ?? ""}`)), u(Y, $);
        };
        I(S, (Y) => {
          var _a10;
          ((_a10 = r().results) == null ? void 0 : _a10.length) > 0 && Y(w);
        });
      }
      var R = v(S, 2);
      {
        var B = (Y) => {
          var $ = OE(), O = d($), G = d(O), J = d(G), se = d(J), ie = v(G, 2), oe = d(ie), de = d(oe), ve = v(ie, 2);
          {
            var me = (he) => {
              var ue = ME(), Ee = d(ue), xe = d(Ee);
              L(() => E(xe, r().errors)), u(he, ue);
            };
            I(ve, (he) => {
              r().errors > 0 && he(me);
            });
          }
          var ke = v(ve, 2);
          {
            var ye = (he) => {
              var ue = zE(), Ee = d(ue), xe = d(Ee);
              L(() => E(xe, r().summary.skipped)), u(he, ue);
            };
            I(ke, (he) => {
              var _a10;
              ((_a10 = r().summary) == null ? void 0 : _a10.skipped) && he(ye);
            });
          }
          var we = v(O, 2), le = d(we);
          {
            var ce = (he) => {
              var ue = Be();
              L(() => E(ue, `Avg speed: ${r().summary.avgTps ?? ""} tok/s \xB7`)), u(he, ue);
            };
            I(le, (he) => {
              var _a10;
              ((_a10 = r().summary) == null ? void 0 : _a10.avgTps) && he(ce);
            });
          }
          var pe = v(le), ge = v(pe);
          {
            var Te = (he) => {
              var ue = Be();
              L(() => E(ue, `\xB7 ${r().summary.modelName ?? ""}`)), u(he, ue);
            };
            I(ge, (he) => {
              var _a10;
              ((_a10 = r().summary) == null ? void 0 : _a10.modelName) && he(Te);
            });
          }
          L((he, ue, Ee) => {
            var _a10;
            E(se, ((_a10 = r().summary) == null ? void 0 : _a10.processed) || r().total || 0), E(de, r().classified || 0), E(pe, ` Tokens: ${he ?? ""} in / ${ue ?? ""} out \xB7 Time: ${Ee ?? ""} `);
          }, [() => a(r().totals.inputTokens), () => a(r().totals.outputTokens), () => n(r().totals.elapsed)]), u(Y, $);
        };
        I(R, (Y) => {
          s(c) && r().totals && Y(B);
        });
      }
      var Z = v(R, 2), X = d(Z);
      {
        var H = (Y) => {
          var $ = DE(), O = re($);
          tt(O, { variant: "outline", size: "sm", get onclick() {
            return e.oninspect;
          }, class: "text-xs h-7", children: (J, se) => {
            var ie = Be("View Prompt");
            u(J, ie);
          }, $$slots: { default: true } });
          var G = v(O, 2);
          tt(G, { size: "sm", get onclick() {
            return e.onclose;
          }, class: "text-xs h-7", children: (J, se) => {
            var ie = Be("Done");
            u(J, ie);
          }, $$slots: { default: true } }), u(Y, $);
        }, te = (Y) => {
          var $ = LE(), O = re($);
          tt(O, { variant: "outline", size: "sm", get onclick() {
            return e.oninspect;
          }, class: "text-xs h-7", children: (J, se) => {
            var ie = Be("View Prompt");
            u(J, ie);
          }, $$slots: { default: true } });
          var G = v(O, 2);
          tt(G, { variant: "destructive", size: "sm", get onclick() {
            return e.onstop;
          }, class: "text-xs h-7", children: (J, se) => {
            var ie = Be("Stop");
            u(J, ie);
          }, $$slots: { default: true } }), u(Y, $);
        };
        I(X, (Y) => {
          s(c) ? Y(H) : Y(te, -1);
        });
      }
      L(() => {
        E(F, `${s(l) ?? ""}%`), rt(C, 1, `h-full rounded transition-[width] duration-300 ${s(c) ? "bg-[var(--color-success)]" : "bg-primary"}`), T = Rt(C, "", T, { width: `${s(l) ?? ""}%` });
      }), u(x, b);
    };
    I(m, (x) => {
      r() && x(h);
    });
  }
  u(t, p), Le();
}
var FE = _('<div class="size-3.5 border-2 border-border border-t-primary rounded-full animate-spin"></div>'), UE = _('<div class="flex items-center gap-2 px-4 py-2 border-b border-border/40 text-xs text-muted-foreground/60"><span class="tabular-nums"> </span> <span class="text-muted-foreground/20">\xB7</span> <span class="tabular-nums"> </span> <span class="text-muted-foreground/20">\xB7</span> <span class="tabular-nums"> </span></div>'), GE = _("<option> </option>"), WE = _('<p class="px-4 pb-3 -mt-1 text-xs text-muted-foreground/40 italic">Load a model on the Chat page first, then come back to scan.</p>'), VE = _('<div class="rounded border border-border bg-card mb-4 overflow-hidden"><div class="flex items-center gap-3 px-4 py-3 border-b border-border"><div class="size-7 rounded border border-border bg-muted/30 flex items-center justify-center shrink-0 text-muted-foreground"><!></div> <div class="flex-1 min-w-0"><div class="flex items-center gap-2 mb-0.5"><span class="text-sm font-semibold tracking-tight text-foreground">Email Triage</span> <button class="flex items-center gap-1 px-1.5 py-0.5 rounded border border-border text-[0.6rem] text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors">Prompt</button></div> <div class="flex items-center gap-1.5"><span class="size-1.5 rounded-full shrink-0"></span> <span class="text-xs text-muted-foreground"> </span></div></div></div> <!> <div class="flex items-center gap-3 px-4 py-3"><div class="flex items-center gap-2"><span class="text-xs text-muted-foreground">Emails:</span> <select class="h-7 rounded border border-input bg-background px-2 text-xs text-foreground disabled:opacity-50"></select></div> <div class="flex items-center gap-1.5 ml-auto"><!> <!></div></div> <!> <!></div>');
function HE(t, e) {
  De(e, true);
  let r = ae(e, "engineStatus", 3, "idle"), n = ae(e, "modelName", 3, ""), a = ae(e, "isScanning", 3, false), o = ae(e, "scanProgress", 3, null), i = ae(e, "scanCount", 15, 20), l = ae(e, "stats", 3, null);
  const c = [{ value: 1, label: "1" }, { value: 3, label: "3" }, { value: 5, label: "5" }, { value: 10, label: "10" }, { value: 20, label: "20" }, { value: 50, label: "50" }, { value: 100, label: "100" }, { value: 500, label: "500" }];
  function f() {
    return r() === "ready" ? `${n()} ready` : r() === "loading" ? "Loading model..." : r() === "generating" ? "Model busy..." : "No model loaded";
  }
  function p() {
    return r() === "ready" ? "var(--color-success)" : r() === "loading" ? "var(--color-warning)" : "var(--color-muted-foreground)";
  }
  function m() {
    return r() === "ready" && !a();
  }
  let h = V(() => {
    var _a10;
    return a() && ((_a10 = o()) == null ? void 0 : _a10.phase) !== "done";
  });
  var x = VE(), b = d(x), y = d(b), k = d(y);
  {
    var D = ($) => {
      var O = FE();
      u($, O);
    }, U = ($) => {
      Qo($, { class: "size-3.5" });
    };
    I(k, ($) => {
      s(h) ? $(D) : $(U, -1);
    });
  }
  var j = v(y, 2), M = d(j), q = v(d(M), 2), F = v(M, 2), P = d(F);
  let C;
  var T = v(P, 2), N = d(T), K = v(b, 2);
  {
    var W = ($) => {
      var O = UE(), G = d(O), J = d(G), se = v(G, 4), ie = d(se), oe = v(se, 4), de = d(oe);
      L(() => {
        E(J, `${l().totalEmails ?? ""} in storage`), E(ie, `${l().classified ?? ""} classified`), E(de, `${l().unclassified ?? ""} new`);
      }), u($, O);
    };
    I(K, ($) => {
      l() && $(W);
    });
  }
  var A = v(K, 2), S = d(A), w = v(d(S), 2);
  Ge(w, 21, () => c, Qe, ($, O) => {
    var G = GE(), J = d(G), se = {};
    L(() => {
      E(J, s(O).label), se !== (se = s(O).value) && (G.value = (G.__value = s(O).value) ?? "");
    }), u($, G);
  });
  var R = v(S, 2), B = d(R);
  {
    let $ = V(() => !m());
    tt(B, { variant: "default", size: "sm", get onclick() {
      return e.onscan;
    }, get disabled() {
      return s($);
    }, class: "h-7 text-xs", children: (O, G) => {
      var J = Be();
      L(() => E(J, s(h) ? "Scanning\u2026" : a() ? "Finalizing\u2026" : "Scan New")), u(O, J);
    }, $$slots: { default: true } });
  }
  var Z = v(B, 2);
  {
    let $ = V(() => !m());
    tt(Z, { variant: "outline", size: "sm", get onclick() {
      return e.onrescan;
    }, get disabled() {
      return s($);
    }, class: "h-7 text-xs", children: (O, G) => {
      var J = Be("Rescan All");
      u(O, J);
    }, $$slots: { default: true } });
  }
  var X = v(A, 2);
  {
    var H = ($) => {
      var O = WE();
      u($, O);
    };
    I(X, ($) => {
      r() !== "ready" && r() !== "loading" && $(H);
    });
  }
  var te = v(X, 2);
  {
    var Y = ($) => {
      BE($, { get progress() {
        return o();
      }, get onstop() {
        return e.onstop;
      }, get oninspect() {
        return e.oninspect;
      }, get onclose() {
        return e.oncloseprogress;
      } });
    };
    I(te, ($) => {
      var _a10;
      (a() || ((_a10 = o()) == null ? void 0 : _a10.phase) === "done") && $(Y);
    });
  }
  L(($, O) => {
    C = Rt(P, "", C, $), E(N, O), w.disabled = a();
  }, [() => ({ background: p() }), f]), Pe("click", q, function(...$) {
    var _a10;
    (_a10 = e.oninspect) == null ? void 0 : _a10.apply(this, $);
  }), Rn(w, i), u(t, x), Le();
}
Zt(["click"]);
var qE = _('<span class="row-date svelte-1czytqk"> </span>'), YE = _('<span class="tag svelte-1czytqk"> </span>'), KE = _('<span class="row-tags svelte-1czytqk"></span>'), XE = _('<span class="row-reason svelte-1czytqk"><strong class="opacity-50 text-[0.6rem] uppercase tracking-widest mr-1">Reason:</strong> </span>'), ZE = _('<button class="icon-btn exec-btn svelte-1czytqk" title="Execute actions"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg></button>'), JE = _('<!> <button class="icon-btn done-btn svelte-1czytqk" title="Mark handled"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg></button> <button class="icon-btn dismiss-btn svelte-1czytqk" title="Dismiss"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>', 1), QE = _('<span class="status-label svelte-1czytqk"> </span>'), eC = _('<button class="icon-btn remove-btn svelte-1czytqk" title="Remove classification"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"></path><path d="M8 6V4h8v2"></path><path d="m19 6-.867 12.142A2 2 0 0 1 16.138 20H7.862a2 2 0 0 1-1.995-1.858L5 6"></path></svg></button>'), tC = _('<p class="summary-reason svelte-1czytqk"><strong class="opacity-50 text-[0.6rem] uppercase tracking-widest mr-1">Reason:</strong> </p>'), rC = _('<div class="summary-panel svelte-1czytqk"><p class="summary-text svelte-1czytqk"> </p> <!></div>'), nC = _('<div><button class="row-left svelte-1czytqk"><span class="row-subject svelte-1czytqk"> </span> <span class="row-meta svelte-1czytqk"><span class="row-from svelte-1czytqk"> </span> <!></span> <!> <!></button> <div class="row-actions svelte-1czytqk"><!> <!></div></div> <!>', 1);
function uf(t, e) {
  De(e, true);
  let r = ae(e, "actionColor", 3, "#666"), n = ae(e, "dimmed", 3, false);
  function a(w) {
    if (!w) return "";
    try {
      return new Date(w).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch {
      return "";
    }
  }
  let o = V(() => e.item.status === "pending"), i = ee(false);
  var l = nC(), c = re(l);
  let f;
  var p = d(c);
  let m;
  var h = d(p), x = d(h), b = v(h, 2), y = d(b), k = d(y), D = v(y, 2);
  {
    var U = (w) => {
      var R = qE(), B = d(R);
      L((Z) => E(B, Z), [() => a(e.item.date)]), u(w, R);
    };
    I(D, (w) => {
      e.item.date && w(U);
    });
  }
  var j = v(b, 2);
  {
    var M = (w) => {
      var R = KE();
      Ge(R, 21, () => e.item.tags, Qe, (B, Z) => {
        var X = YE();
        let H;
        var te = d(X);
        L((Y) => {
          H = Rt(X, "", H, Y), E(te, s(Z));
        }, [() => ({ background: Nb(s(Z)) })]), u(B, X);
      }), u(w, R);
    };
    I(j, (w) => {
      e.item.tags && e.item.tags.length > 0 && w(M);
    });
  }
  var q = v(j, 2);
  {
    var F = (w) => {
      var R = XE(), B = v(d(R));
      L(() => E(B, ` ${e.item.reason ?? ""}`)), u(w, R);
    };
    I(q, (w) => {
      e.item.reason && !s(i) && w(F);
    });
  }
  var P = v(p, 2), C = d(P);
  {
    var T = (w) => {
      var R = JE(), B = re(R);
      {
        var Z = (te) => {
          var Y = ZE();
          Pe("click", Y, ($) => {
            $.stopPropagation(), e.onexecute(e.item);
          }), u(te, Y);
        };
        I(B, (te) => {
          e.onexecute && te(Z);
        });
      }
      var X = v(B, 2), H = v(X, 2);
      Pe("click", X, (te) => {
        te.stopPropagation(), e.onmarkacted(e.item.emailId);
      }), Pe("click", H, (te) => {
        te.stopPropagation(), e.ondismiss(e.item.emailId);
      }), u(w, R);
    }, N = (w) => {
      var R = QE(), B = d(R);
      L(() => E(B, e.item.status)), u(w, R);
    };
    I(C, (w) => {
      s(o) ? w(T) : w(N, -1);
    });
  }
  var K = v(C, 2);
  {
    var W = (w) => {
      var R = eC();
      Pe("click", R, (B) => {
        B.stopPropagation(), e.onremove(e.item.emailId);
      }), u(w, R);
    };
    I(K, (w) => {
      e.onremove && w(W);
    });
  }
  var A = v(c, 2);
  {
    var S = (w) => {
      var R = rC();
      let B;
      var Z = d(R), X = d(Z), H = v(Z, 2);
      {
        var te = (Y) => {
          var $ = tC(), O = v(d($));
          L(() => E(O, ` ${e.item.reason ?? ""}`)), u(Y, $);
        };
        I(H, (Y) => {
          e.item.reason && Y(te);
        });
      }
      L(() => {
        B = Rt(R, "", B, { "border-left-color": r() }), E(X, e.item.summary);
      }), u(w, R);
    };
    I(A, (w) => {
      s(i) && e.item.summary && w(S);
    });
  }
  L(() => {
    f = rt(c, 1, "email-row svelte-1czytqk", null, f, { dimmed: n() }), m = Rt(p, "", m, { "border-left-color": r() }), E(x, e.item.subject), E(k, e.item.from);
  }), Pe("click", p, () => g(i, !s(i))), u(t, l), Le();
}
Zt(["click"]);
var aC = _('<span class="text-xs text-muted-foreground/40"> </span>'), sC = _('<div class="text-[0.65rem] font-bold text-muted-foreground/50 uppercase tracking-widest pl-1 pt-1 pb-2">Category Pipeline</div>'), oC = _('<p class="text-xs text-muted-foreground/40 text-center py-6">No emails in this category.</p>'), iC = _('<details class="border-t border-border/40"><summary class="px-4 py-2 text-xs text-muted-foreground/40 cursor-pointer hover:text-muted-foreground select-none transition-colors"> </summary> <!></details>'), lC = _('<button class="text-xs text-muted-foreground/40 hover:text-muted-foreground underline transition-colors">Clear category</button>'), cC = _('<div class="flex items-center gap-2 text-xs text-muted-foreground/60"><span> </span> <button class="hover:text-foreground transition-colors">Cancel</button> <button class="text-destructive hover:text-destructive/80 transition-colors">Delete</button></div>'), dC = _('<div class="border-t border-border/40"><div class="bg-background/50 border-b border-border/40 p-2 overflow-x-auto"><!> <!></div> <!> <!> <!> <div class="flex justify-end px-4 py-2 border-t border-border/40"><!></div></div>'), uC = _('<div class="rounded border border-border bg-card overflow-hidden"><button class="flex items-center gap-2.5 w-full px-4 py-2.5 text-left hover:bg-accent/30 transition-colors"><span class="text-[0.6rem] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded text-white shrink-0"> </span> <span class="text-sm font-semibold tabular-nums text-foreground"> </span> <!> <span class="flex-1"></span> <!></button> <!></div>');
function fC(t, e) {
  De(e, true);
  let r = ae(e, "color", 3, "#888");
  ae(e, "count", 3, 0);
  let n = ae(e, "items", 19, () => []), a = ae(e, "expanded", 3, false), o = V(() => n().filter((P) => P.status === "pending")), i = V(() => n().filter((P) => P.status !== "pending")), l = ee(false), c = ee(nt([])), f = ee(null);
  Ut(() => {
    a() && e.action && (Si(e.action).then((P) => g(c, P, true)), lo(e.action).then((P) => g(f, P, true)));
  });
  function p(P) {
    return P.split("_").map((C) => C.charAt(0) + C.slice(1).toLowerCase()).join(" ");
  }
  var m = uC(), h = d(m), x = d(h);
  let b;
  var y = d(x), k = v(x, 2), D = d(k), U = v(k, 2);
  {
    var j = (P) => {
      var C = aC(), T = d(C);
      L(() => E(T, `${s(i).length ?? ""} handled`)), u(P, C);
    };
    I(U, (P) => {
      s(i).length > 0 && P(j);
    });
  }
  var M = v(U, 4);
  {
    let P = V(() => Je("size-3.5 text-muted-foreground/40 transition-transform", a() && "rotate-180"));
    pg(M, { get class() {
      return s(P);
    } });
  }
  var q = v(h, 2);
  {
    var F = (P) => {
      var C = dC(), T = d(C), N = d(T);
      {
        var K = (Y) => {
          var $ = sC();
          u(Y, $);
        };
        I(N, (Y) => {
          s(f) && Y(K);
        });
      }
      var W = v(N, 2);
      os(W, { get eventType() {
        return e.action;
      }, get category() {
        return s(f);
      }, get commands() {
        return s(c);
      } });
      var A = v(T, 2);
      {
        var S = (Y) => {
          var $ = oC();
          u(Y, $);
        };
        I(A, (Y) => {
          s(o).length === 0 && s(i).length === 0 && Y(S);
        });
      }
      var w = v(A, 2);
      Ge(w, 17, () => s(o), (Y) => Y.emailId, (Y, $) => {
        uf(Y, { get item() {
          return s($);
        }, get actionColor() {
          return r();
        }, get onexecute() {
          return e.onexecute;
        }, get onmarkacted() {
          return e.onmarkacted;
        }, get ondismiss() {
          return e.ondismiss;
        }, get onremove() {
          return e.onremove;
        } });
      });
      var R = v(w, 2);
      {
        var B = (Y) => {
          var $ = iC(), O = d($), G = d(O), J = v(O, 2);
          Ge(J, 17, () => s(i), (se) => se.emailId, (se, ie) => {
            uf(se, { get item() {
              return s(ie);
            }, get actionColor() {
              return r();
            }, get onremove() {
              return e.onremove;
            }, dimmed: true });
          }), L(() => E(G, `${s(i).length ?? ""} handled`)), u(Y, $);
        };
        I(R, (Y) => {
          s(i).length > 0 && Y(B);
        });
      }
      var Z = v(R, 2), X = d(Z);
      {
        var H = (Y) => {
          var $ = lC();
          Pe("click", $, () => g(l, true)), u(Y, $);
        }, te = (Y) => {
          var $ = cC(), O = d($), G = d(O), J = v(O, 2), se = v(J, 2);
          L(() => E(G, `Clear ${n().length ?? ""} items?`)), Pe("click", J, () => g(l, false)), Pe("click", se, () => {
            e.onclearcategory(), g(l, false);
          }), u(Y, $);
        };
        I(X, (Y) => {
          s(l) ? Y(te, -1) : Y(H);
        });
      }
      u(P, C);
    };
    I(q, (P) => {
      a() && P(F);
    });
  }
  L((P) => {
    b = Rt(x, "", b, { background: r() }), E(y, P), E(D, s(o).length);
  }, [() => p(e.action)]), Pe("click", h, function(...P) {
    var _a10;
    (_a10 = e.ontoggle) == null ? void 0 : _a10.apply(this, P);
  }), u(t, m), Le();
}
Zt(["click"]);
var pC = _(`<div class="section-desc svelte-10pcy9j">This is the system prompt sent to the LLM before each email. It instructs the model
            on how to classify emails and what JSON format to produce.</div> <pre class="code-block svelte-10pcy9j"> </pre>`, 1), vC = _('<div class="template-format svelte-10pcy9j"><div class="format-label svelte-10pcy9j">Sample (first scanned email):</div> <pre class="code-block sample svelte-10pcy9j"> </pre></div>'), gC = _('<div class="section-desc svelte-10pcy9j" style="margin-top: 0.5rem;">No emails scanned yet. Run a scan to see a real example here.</div>'), mC = _(`<div class="section-desc svelte-10pcy9j">Each email is formatted into this template and sent as the user message.
            The full email body is included.</div> <div class="template-format svelte-10pcy9j"><div class="format-label svelte-10pcy9j">Format:</div> <pre class="code-block template svelte-10pcy9j"></pre></div> <!>`, 1), hC = _(`<div class="section-desc svelte-10pcy9j">These generation parameters control how the LLM produces its output
            for email classification.</div> <div class="config-grid svelte-10pcy9j"><div class="config-row svelte-10pcy9j"><span class="config-key svelte-10pcy9j">max_new_tokens</span> <span class="config-val svelte-10pcy9j"> </span> <span class="config-desc svelte-10pcy9j">Maximum tokens in the response (classification needs ~150)</span></div> <div class="config-row svelte-10pcy9j"><span class="config-key svelte-10pcy9j">enable_thinking</span> <span class="config-val svelte-10pcy9j"> </span> <span class="config-desc svelte-10pcy9j">Thinking mode disabled \u2014 structured JSON doesn't need reasoning</span></div> <div class="config-row svelte-10pcy9j"><span class="config-key svelte-10pcy9j">do_sample</span> <span class="config-val svelte-10pcy9j"> </span> <span class="config-desc svelte-10pcy9j">Greedy decoding \u2014 deterministic, consistent output</span></div></div> <div class="section-desc svelte-10pcy9j" style="margin-top: 1rem;">The full message array sent to the model:</div> <pre class="code-block svelte-10pcy9j"></pre>`, 1), _C = _('<div class="backdrop svelte-10pcy9j"><div class="modal svelte-10pcy9j" role="dialog" aria-label="Prompt Inspector"><div class="modal-header svelte-10pcy9j"><h2 class="svelte-10pcy9j">Prompt Inspector</h2> <button class="close-btn svelte-10pcy9j" aria-label="Close">\u2715</button></div> <div class="tabs svelte-10pcy9j"><button>System Prompt</button> <button>Email Template</button> <button>Generation Config</button></div> <div class="modal-body svelte-10pcy9j"><!></div></div></div>');
function bC(t, e) {
  De(e, true);
  let r = ae(e, "open", 15, false), n = ae(e, "sampleEmail", 3, null), a = ee("system");
  function o() {
    return n() ? Kv(n()) : null;
  }
  function i() {
    r(false);
  }
  function l(m) {
    m.target === m.currentTarget && i();
  }
  var c = Ae(), f = re(c);
  {
    var p = (m) => {
      var h = _C(), x = d(h), b = d(x), y = v(d(b), 2), k = v(b, 2), D = d(k);
      let U;
      var j = v(D, 2);
      let M;
      var q = v(j, 2);
      let F;
      var P = v(k, 2), C = d(P);
      {
        var T = (W) => {
          var A = pC(), S = v(re(A), 2), w = d(S);
          L((R) => E(w, R), [Eb]), u(W, A);
        }, N = (W) => {
          var A = mC(), S = v(re(A), 2), w = v(d(S), 2);
          w.textContent = `Subject: {email.subject}
From: {email.from}
To: {email.to}
Date: {formatted date}
Labels: {email.labels}

{email.body (full content)`;
          var R = v(S, 2);
          {
            var B = (H) => {
              var te = vC(), Y = v(d(te), 2), $ = d(Y);
              L((O) => E($, O), [o]), u(H, te);
            }, Z = V(() => o()), X = (H) => {
              var te = gC();
              u(H, te);
            };
            I(R, (H) => {
              s(Z) ? H(B) : H(X, -1);
            });
          }
          u(W, A);
        }, K = (W) => {
          var A = hC(), S = v(re(A), 2), w = d(S), R = v(d(w), 2), B = d(R), Z = v(w, 2), X = v(d(Z), 2), H = d(X), te = v(Z, 2), Y = v(d(te), 2), $ = d(Y), O = v(S, 4);
          O.textContent = `[
  { role: "system", content: getSystemPrompt() },
  { role: "user",   content: formatEmailPrompt(email) }
]`, L(() => {
            E(B, Gv.maxTokens), E(H, "false"), E($, "false");
          }), u(W, A);
        };
        I(C, (W) => {
          s(a) === "system" ? W(T) : s(a) === "email" ? W(N, 1) : s(a) === "config" && W(K, 2);
        });
      }
      L(() => {
        U = rt(D, 1, "tab svelte-10pcy9j", null, U, { active: s(a) === "system" }), M = rt(j, 1, "tab svelte-10pcy9j", null, M, { active: s(a) === "email" }), F = rt(q, 1, "tab svelte-10pcy9j", null, F, { active: s(a) === "config" });
      }), Pe("click", h, l), Pe("keydown", h, (W) => W.key === "Escape" && i()), Pe("click", y, i), Pe("click", D, () => g(a, "system")), Pe("click", j, () => g(a, "email")), Pe("click", q, () => g(a, "config")), u(m, h);
    };
    I(f, (m) => {
      r() && m(p);
    });
  }
  u(t, c), Le();
}
Zt(["click", "keydown"]);
var xC = _('<div class="flex items-center justify-between px-3 py-2 rounded border border-destructive/30 bg-destructive/8 text-xs text-destructive mb-4"><span> </span> <button class="text-destructive/60 hover:text-destructive ml-3 transition-colors">\u2715</button></div>'), yC = _('<div class="flex items-center justify-between px-3 py-2 rounded border border-success/30 bg-success/8 text-xs text-success mb-4"><span> </span> <button class="text-success/60 hover:text-success ml-3 transition-colors">\u2715</button></div>'), wC = _('<span class="ml-auto text-[10px] font-bold uppercase text-emerald-500/80 bg-emerald-500/10 px-1.5 py-0.5 rounded">Auto</span>'), kC = _('<span class="ml-auto text-[10px] uppercase text-muted-foreground/40 font-medium"> </span>'), SC = _('<div class="flex flex-col gap-2"><div class="flex items-center gap-2 mb-1 pl-1"><span class="size-2 rounded-full"></span> <h3 class="text-xs font-bold uppercase tracking-widest text-muted-foreground/70"> </h3> <!></div> <div class="flex flex-col gap-2"></div></div>'), TC = _('<div class="flex flex-col gap-6"></div> <div class="pt-3 mt-1 border-t border-border"><span class="text-xs text-muted-foreground/40 tabular-nums"> </span></div>', 1), AC = _(`<div class="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="opacity-20"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"></path><rect x="9" y="3" width="6" height="4" rx="1"></rect><path d="m9 14 2 2 4-4"></path></svg> <span class="text-sm">No emails classified yet</span> <p class="text-xs text-muted-foreground/50 text-center max-w-[340px] leading-relaxed">Click <strong class="text-muted-foreground/70">Scan New</strong> to classify
          your recent emails. The LLM will determine action types, tags, and summaries
          automatically.</p></div>`), EC = _("<!> <!> <!> <!>", 1), CC = _('<div class="flex flex-col h-full overflow-hidden"><div class="flex items-center justify-between px-8 pt-5 pb-4 shrink-0 border-b border-border"><div><div class="flex items-center gap-2 mb-0.5"><h1 class="text-sm font-semibold tracking-tight text-foreground">Email Triage</h1> <span class="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground/50">/ scan</span></div> <p class="text-xs text-muted-foreground">Classify emails using AI and execute actions by category.</p></div> <div class="flex items-center gap-1"><a href="#admin" class="inline-flex items-center gap-1.5 h-7 px-2 text-xs text-muted-foreground hover:text-foreground transition-colors rounded hover:bg-accent no-underline"><!>Admin</a></div></div> <!> <!></div>');
function IC(t, e) {
  De(e, true);
  let r = ae(e, "categories", 19, () => ({})), n = ae(e, "categoryOrder", 19, () => []), a = ae(e, "eventTypeToCategory", 19, () => ({})), o = ae(e, "counts", 19, () => ({})), i = ae(e, "stats", 3, null), l = ae(e, "expandedCategory", 3, null), c = ae(e, "isScanning", 3, false), f = ae(e, "scanProgress", 3, null), p = ae(e, "scanCount", 15, 20), m = ae(e, "error", 3, null), h = ae(e, "successMsg", 3, null), x = ee(false), b = V(() => {
    for (const C of n()) {
      const T = r()[C];
      if ((T == null ? void 0 : T.length) > 0) return T[0];
    }
    return null;
  });
  const y = ["critical", "info", "noise"];
  let k = V(() => {
    const C = [];
    for (const N of y) {
      const K = n().filter((W) => a()[W] === N);
      K.length > 0 && C.push({ name: N, category: eb[N], actionIds: K });
    }
    const T = n().filter((N) => !y.includes(a()[N]));
    return T.length > 0 && C.push({ name: "unknown", category: { name: "unknown", label: "Other", color: "#888", policy: "manual" }, actionIds: T }), C;
  });
  var D = CC(), U = d(D), j = v(d(U), 2), M = d(j), q = d(M);
  hg(q, { class: "size-3.5" });
  var F = v(U, 2);
  bC(F, { get sampleEmail() {
    return s(b);
  }, get open() {
    return s(x);
  }, set open(C) {
    g(x, C, true);
  } });
  var P = v(F, 2);
  Ln(P, { class: "flex-1 min-h-0 px-8 py-5", children: (C, T) => {
    var N = EC(), K = re(N);
    {
      var W = (X) => {
        var H = xC(), te = d(H), Y = d(te), $ = v(te, 2);
        L(() => E(Y, m())), Pe("click", $, function(...O) {
          var _a10;
          (_a10 = e.ondismisserror) == null ? void 0 : _a10.apply(this, O);
        }), u(X, H);
      };
      I(K, (X) => {
        m() && X(W);
      });
    }
    var A = v(K, 2);
    {
      var S = (X) => {
        var H = yC(), te = d(H), Y = d(te), $ = v(te, 2);
        L(() => E(Y, h())), Pe("click", $, function(...O) {
          var _a10;
          (_a10 = e.ondismisssuccess) == null ? void 0 : _a10.apply(this, O);
        }), u(X, H);
      };
      I(A, (X) => {
        h() && X(S);
      });
    }
    var w = v(A, 2);
    HE(w, { get engineStatus() {
      return e.engineStatus;
    }, get modelName() {
      return e.modelName;
    }, get isScanning() {
      return c();
    }, get scanProgress() {
      return f();
    }, get stats() {
      return i();
    }, get onscan() {
      return e.onscan;
    }, get onrescan() {
      return e.onrescan;
    }, get onstop() {
      return e.onstop;
    }, get oncloseprogress() {
      return e.oncloseprogress;
    }, oninspect: () => g(x, true), get scanCount() {
      return p();
    }, set scanCount(X) {
      p(X);
    } });
    var R = v(w, 2);
    {
      var B = (X) => {
        var H = TC(), te = re(H);
        Ge(te, 21, () => s(k), (G) => G.name, (G, J) => {
          var se = SC(), ie = d(se), oe = d(ie);
          let de;
          var ve = v(oe, 2);
          let me;
          var ke = d(ve), ye = v(ve, 2);
          {
            var we = (pe) => {
              var ge = wC();
              u(pe, ge);
            }, le = (pe) => {
              var ge = kC(), Te = d(ge);
              L(() => E(Te, s(J).category.policy)), u(pe, ge);
            };
            I(ye, (pe) => {
              s(J).category.policy === "auto" ? pe(we) : pe(le, -1);
            });
          }
          var ce = v(ie, 2);
          Ge(ce, 20, () => s(J).actionIds, (pe) => pe, (pe, ge) => {
            {
              let Te = V(() => Zo(ge)), he = V(() => {
                var _a10;
                return ((_a10 = r()[ge]) == null ? void 0 : _a10.length) || 0;
              }), ue = V(() => r()[ge] || []), Ee = V(() => l() === ge);
              fC(pe, { get action() {
                return ge;
              }, get color() {
                return s(Te);
              }, get count() {
                return s(he);
              }, get items() {
                return s(ue);
              }, get expanded() {
                return s(Ee);
              }, ontoggle: () => e.ontogglecategory(ge), onexecute: (xe) => e.onexecute(ge, xe), get onmarkacted() {
                return e.onmarkacted;
              }, get ondismiss() {
                return e.ondismiss;
              }, get onremove() {
                return e.onremove;
              }, onclearcategory: () => e.onclearcategory(ge) });
            }
          }), L(() => {
            de = Rt(oe, "", de, { background: s(J).category.color }), me = Rt(ve, "", me, { color: s(J).category.color }), E(ke, s(J).category.label);
          }), u(G, se);
        });
        var Y = v(te, 2), $ = d(Y), O = d($);
        L(() => E(O, `${o().total ?? ""} emails classified into ${n().length ?? ""} categories`)), u(X, H);
      }, Z = (X) => {
        var H = AC();
        u(X, H);
      };
      I(R, (X) => {
        o().total > 0 ? X(B) : c() || X(Z, 1);
      });
    }
    u(C, N);
  }, $$slots: { default: true } }), u(t, D), Le();
}
Zt(["click"]);
var PC = _('<div class="flex flex-col h-full min-h-0"><!></div>');
function $C(t, e) {
  De(e, true);
  const r = Hd();
  let n = ee(nt(r.status)), a = ee(""), o = ee(nt({})), i = ee(nt([])), l = ee(nt({})), c = ee(nt({ total: 0 })), f = ee(null), p = ee(null), m = ee(false), h = ee(null), x = ee(3), b = ee(null), y = ee(null), k = ee(null);
  const D = "me-ai-scan-history";
  async function U() {
    return await sr(D);
  }
  async function j(B) {
    !B || B.phase !== "done" || await _r(D, { timestamp: Date.now(), classified: B.classified || 0, errors: B.errors || 0, total: B.total || 0, totals: B.totals || {}, summary: B.summary || {} });
  }
  Xt(async () => {
    const B = r.onMessage((X) => {
      if (X.status === "ready") {
        g(n, "ready");
        const H = ea.find(($) => $.id === r.modelId), te = zn.find(($) => $.name === r.modelId), Y = H || te;
        g(a, (Y == null ? void 0 : Y.name) || (Y == null ? void 0 : Y.displayName) || r.modelId || "", true);
      }
      X.status === "loading" && g(n, "loading");
    });
    if (g(n, r.status, true), r.modelId) {
      const X = ea.find((Y) => Y.id === r.modelId), H = zn.find((Y) => Y.name === r.modelId), te = X || H;
      g(a, (te == null ? void 0 : te.name) || (te == null ? void 0 : te.displayName) || r.modelId || "", true);
    }
    const Z = await U();
    return Z && g(h, { phase: "done", ...Z }, true), M(), () => B();
  });
  async function M() {
    try {
      const B = await as(), Z = await qv(), X = await Al(), H = {};
      for (const te of B.order) {
        const Y = await lo(te);
        H[te] = tb(Y);
      }
      g(o, B.categories, true), g(i, B.order, true), g(c, Z, true), g(f, X, true), g(l, H, true);
    } catch (B) {
      g(b, `Failed to load data: ${B.message}`);
    }
  }
  async function q() {
    await P(false);
  }
  async function F() {
    await P(true);
  }
  async function P(B) {
    if (s(m) || !r.isReady) return;
    g(b, null), g(y, null), g(m, true), g(h, null);
    const Z = new AbortController();
    g(k, Z, true);
    try {
      await Hv(r, { count: s(x), force: B, signal: Z.signal, onProgress: (X) => {
        g(h, { ...X }, true), X.phase === "done" && j(X);
      } }), await M();
    } catch (X) {
      Z.signal.aborted || g(b, `Scan failed: ${X.message}`);
    } finally {
      g(m, false), g(k, null);
    }
  }
  function C() {
    var _a10;
    (_a10 = s(k)) == null ? void 0 : _a10.abort();
  }
  async function T(B) {
    await vs(B, "acted"), await M();
  }
  async function N(B, Z) {
    const { executePipeline: X, isAuthenticated: H } = await wr(async () => {
      const { executePipeline: te, isAuthenticated: Y } = await Promise.resolve().then(() => _b);
      return { executePipeline: te, isAuthenticated: Y };
    }, void 0);
    if (!await H()) {
      alert("Please sign in to Gmail first (Dashboard page)");
      return;
    }
    try {
      const Y = await X({ type: B, source: "gmail", data: Z }, ($) => {
        console.log("Pipeline progress:", $);
      }, true);
      Y.success ? (g(y, Y.message, true), g(b, null), await T(Z.emailId)) : (g(b, `Execution failed: ${Y.message}`), g(y, null));
    } catch (te) {
      g(b, `Execution error: ${te.message}`), g(y, null);
    }
  }
  async function K(B) {
    await vs(B, "dismissed"), await M();
  }
  async function W(B) {
    await Yv(B), await M();
  }
  async function A(B) {
    await Oc(B), await M();
  }
  function S(B) {
    g(p, s(p) === B ? null : B, true);
  }
  var w = PC(), R = d(w);
  IC(R, { get engineStatus() {
    return s(n);
  }, get modelName() {
    return s(a);
  }, get categories() {
    return s(o);
  }, get categoryOrder() {
    return s(i);
  }, get eventTypeToCategory() {
    return s(l);
  }, get counts() {
    return s(c);
  }, get stats() {
    return s(f);
  }, get expandedCategory() {
    return s(p);
  }, get isScanning() {
    return s(m);
  }, get scanProgress() {
    return s(h);
  }, get error() {
    return s(b);
  }, get successMsg() {
    return s(y);
  }, onscan: q, onrescan: F, ontogglecategory: S, onexecute: N, onmarkacted: T, ondismiss: K, onremove: W, onclearcategory: A, ondismisserror: () => g(b, null), ondismisssuccess: () => g(y, null), onstop: C, oncloseprogress: async () => {
    g(h, null), await ii(D);
  }, get scanCount() {
    return s(x);
  }, set scanCount(B) {
    g(x, B, true);
  } }), u(t, w), Le();
}
var NC = _('<div class="flex flex-col h-full w-full overflow-hidden bg-background"><!></div>'), RC = _('<div class="h-full w-full overflow-hidden"><!></div>'), MC = _(`<div class="flex flex-col h-full w-full overflow-hidden"><header class="flex items-center gap-3 px-5 h-11 border-b border-border bg-sidebar shrink-0"><a href="#home" class="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground
         transition-colors no-underline shrink-0"><!> <span class="tracking-tight">Home</span></a> <div class="w-px h-4 bg-border shrink-0"></div> <div class="size-6 rounded overflow-hidden flex items-center justify-center shrink-0"><img src="/logo.png" alt="me-ai logo" class="size-full object-cover"/></div> <span class="text-sm font-semibold tracking-tight text-foreground">Sources</span></header> <div class="flex-1 min-h-0 overflow-hidden flex flex-col"><div><!></div> <div><!></div></div></div>`), zC = _(`<div class="flex flex-col h-full w-full overflow-hidden"><header class="flex items-center gap-3 px-5 h-11 border-b border-border bg-sidebar shrink-0"><a href="#home" class="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground
         transition-colors no-underline shrink-0"><!> <span class="tracking-tight">Home</span></a> <div class="w-px h-4 bg-border shrink-0"></div> <div class="size-6 rounded overflow-hidden flex items-center justify-center shrink-0"><img src="/logo.png" alt="me-ai logo" class="size-full object-cover"/></div> <span class="text-sm font-semibold tracking-tight text-foreground">Scan</span></header> <div class="flex-1 min-h-0 overflow-hidden flex flex-col"><!></div></div>`), OC = _(`<div class="flex flex-col h-full w-full overflow-hidden"><header class="flex items-center gap-3 px-5 h-11 border-b border-border bg-sidebar shrink-0"><a href="#home" class="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground
         transition-colors no-underline shrink-0"><!> <span class="tracking-tight">Home</span></a> <div class="w-px h-4 bg-border shrink-0"></div> <div class="size-6 rounded overflow-hidden flex items-center justify-center shrink-0"><img src="/logo.png" alt="me-ai logo" class="size-full object-cover"/></div> <span class="text-sm font-semibold tracking-tight text-foreground">Admin</span></header> <div class="flex-1 min-h-0 overflow-hidden flex flex-col"><!></div></div>`), DC = _('<span class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-primary rounded-full"></span>'), LC = _('<span class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-primary rounded-full"></span>'), jC = _('<span class="text-[0.6rem] font-bold tabular-nums px-1.5 py-px rounded bg-primary/15 text-primary mr-1"> </span>'), BC = _('<span class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-primary rounded-full"></span>'), FC = _('<span class="text-[0.6rem] font-bold tabular-nums px-1.5 py-px rounded bg-primary text-primary-foreground mr-1"> </span>'), UC = _(`<div class="flex h-full w-full overflow-hidden"><aside class="w-52 shrink-0 flex flex-col bg-sidebar border-r border-sidebar-border overflow-hidden"><div class="flex items-center gap-3 px-4 h-11 border-b border-sidebar-border shrink-0"><a href="#home" class="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground
           transition-colors no-underline shrink-0"><!> <span class="tracking-tight">Home</span></a> <div class="w-px h-4 bg-sidebar-border shrink-0"></div> <div class="size-6 rounded overflow-hidden flex items-center justify-center shrink-0"><img src="/logo.png" alt="me-ai logo" class="size-full object-cover"/></div> <span class="text-sm font-semibold tracking-tight text-foreground">me-ai</span></div> <nav class="flex flex-col flex-1 overflow-y-auto py-1.5"><div class="px-4 pt-1 pb-0.5"><span class="text-[0.6rem] font-semibold uppercase tracking-widest text-muted-foreground/50">Control Plane</span></div> <a href="#stream"><!> <!> <span class="flex-1 tracking-tight">Event Stream</span></a> <a href="#pipelines"><!> <!> <span class="flex-1 tracking-tight">Pipelines</span> <!></a> <a href="#approvals"><!> <!> <span class="flex-1 tracking-tight">Approvals</span> <!></a></nav></aside> <main class="flex-1 min-h-0 overflow-hidden flex flex-col bg-background"><div class="flex-1 min-h-0 flex flex-col overflow-hidden"><!></div> <div class="flex-1 min-h-0 flex flex-col overflow-hidden"><!></div> <div class="flex-1 min-h-0 flex flex-col overflow-hidden"><!></div></main></div>`), GC = _('<div class="h-full w-full overflow-hidden"><!></div>');
function WC(t, e) {
  De(e, true);
  var r = GC(), n = d(r);
  {
    var a = (p) => {
      var m = NC(), h = d(m);
      {
        var x = (y) => {
          b3(y, {});
        }, b = (y) => {
          I3(y, {});
        };
        I(h, (y) => {
          e.page === "auth" ? y(x) : y(b, -1);
        });
      }
      u(p, m);
    }, o = (p) => {
      var m = RC(), h = d(m);
      vE(h, {}), u(p, m);
    }, i = (p) => {
      var m = MC(), h = d(m), x = d(h), b = d(x);
      No(b, { class: "size-3.5" });
      var y = v(h, 2), k = d(y);
      let D;
      var U = d(k);
      i5(U, {});
      var j = v(k, 2);
      let M;
      var q = d(j);
      v5(q, {}), L(() => {
        D = Rt(k, "", D, { display: e.page === "sources" ? "contents" : "none" }), M = Rt(j, "", M, { display: e.page === "plugins" ? "contents" : "none" });
      }), u(p, m);
    }, l = (p) => {
      var m = zC(), h = d(m), x = d(h), b = d(x);
      No(b, { class: "size-3.5" });
      var y = v(h, 2), k = d(y);
      $C(k, {}), u(p, m);
    }, c = (p) => {
      var m = OC(), h = d(m), x = d(h), b = d(x);
      No(b, { class: "size-3.5" });
      var y = v(h, 2), k = d(y);
      c3(k, {}), u(p, m);
    }, f = (p) => {
      var m = UC(), h = d(m), x = d(h), b = d(x), y = d(b);
      No(y, { class: "size-3.5" });
      var k = v(x, 2), D = v(d(k), 2), U = d(D);
      {
        var j = (se) => {
          var ie = DC();
          u(se, ie);
        };
        I(U, (se) => {
          e.page === "stream" && se(j);
        });
      }
      var M = v(U, 2);
      fg(M, { class: "size-3.5 shrink-0" });
      var q = v(D, 2), F = d(q);
      {
        var P = (se) => {
          var ie = LC();
          u(se, ie);
        };
        I(F, (se) => {
          e.page === "pipelines" && se(P);
        });
      }
      var C = v(F, 2);
      mg(C, { class: "size-3.5 shrink-0" });
      var T = v(C, 4);
      {
        var N = (se) => {
          var ie = jC(), oe = d(ie);
          L(() => E(oe, e.stats.total)), u(se, ie);
        };
        I(T, (se) => {
          e.stats.total > 0 && se(N);
        });
      }
      var K = v(q, 2), W = d(K);
      {
        var A = (se) => {
          var ie = BC();
          u(se, ie);
        };
        I(W, (se) => {
          e.page === "approvals" && se(A);
        });
      }
      var S = v(W, 2);
      Nx(S, { class: "size-3.5 shrink-0" });
      var w = v(S, 4);
      {
        var R = (se) => {
          var ie = FC(), oe = d(ie);
          L(() => E(oe, e.stats.awaiting_user)), u(se, ie);
        };
        I(w, (se) => {
          e.stats.awaiting_user > 0 && se(R);
        });
      }
      var B = v(h, 2), Z = d(B);
      let X;
      var H = d(Z);
      Ry(H, {});
      var te = v(Z, 2);
      let Y;
      var $ = d(te);
      yw($, {});
      var O = v(te, 2);
      let G;
      var J = d(O);
      Uw(J, {}), L((se, ie, oe) => {
        rt(D, 1, se), rt(q, 1, ie), rt(K, 1, oe), X = Rt(Z, "", X, { display: e.page === "stream" ? "flex" : "none" }), Y = Rt(te, "", Y, { display: e.page === "pipelines" ? "flex" : "none" }), G = Rt(O, "", G, { display: e.page === "approvals" ? "flex" : "none" });
      }, [() => Et(Je("relative flex items-center gap-2.5 px-4 py-2 text-sm transition-colors no-underline", e.page === "stream" ? "text-foreground font-medium bg-sidebar-accent" : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50")), () => Et(Je("relative flex items-center gap-2.5 px-4 py-2 text-sm transition-colors no-underline", e.page === "pipelines" ? "text-foreground font-medium bg-sidebar-accent" : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50")), () => Et(Je("relative flex items-center gap-2.5 px-4 py-2 text-sm transition-colors no-underline", e.page === "approvals" ? "text-foreground font-medium bg-sidebar-accent" : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"))]), u(p, m);
    };
    I(n, (p) => {
      e.inOAuth ? p(a) : e.inHome ? p(o, 1) : e.inSources ? p(i, 2) : e.inScan ? p(l, 3) : e.inAdmin ? p(c, 4) : p(f, -1);
    });
  }
  u(t, r), Le();
}
var VC = _('<div class="h-dvh w-full overflow-hidden"><!></div>');
function HC(t, e) {
  De(e, true);
  const r = ["stream", "pipelines", "approvals"], n = ["auth", "oauth-redirect"], a = ["sources", "plugins"], o = ["scan"], i = ["admin"], l = [...n, ...a, ...o, ...r, ...i, "home", "chat"];
  function c() {
    const M = location.hash.replace("#", "");
    return M === "chat" ? "home" : l.includes(M) ? M : "home";
  }
  let f = ee(nt(c()));
  const p = V(() => n.includes(s(f))), m = V(() => a.includes(s(f))), h = V(() => o.includes(s(f))), x = V(() => r.includes(s(f))), b = V(() => i.includes(s(f))), y = V(() => s(f) === "home");
  let k = ee(nt({ total: 0, completed: 0, awaiting_user: 0, escalated: 0, failed: 0 }));
  async function D() {
    try {
      g(k, await ki(), true);
    } catch {
    }
  }
  Xt(() => {
    const M = () => {
      g(f, c(), true), r.includes(c()) && D();
    };
    return window.addEventListener("hashchange", M), s(x) && D(), () => window.removeEventListener("hashchange", M);
  });
  var U = VC(), j = d(U);
  WC(j, { get page() {
    return s(f);
  }, get inOAuth() {
    return s(p);
  }, get inHome() {
    return s(y);
  }, get inSources() {
    return s(m);
  }, get inScan() {
    return s(h);
  }, get inAdmin() {
    return s(b);
  }, get stats() {
    return s(k);
  } }), u(t, U), Le();
}
async function ff() {
  try {
    await bp();
  } catch (t) {
    console.error("[core] init failed", t);
  } finally {
    const t = document.getElementById("app");
    if (!t) throw new Error("Missing #app element");
    qh(HC, { target: t });
  }
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", ff) : ff();
window.__setSetting = _r;
window.__getSetting = sr;
