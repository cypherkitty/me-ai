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
var _a2, _e, _t2, _r2, _n2, _a3, _s2, _o2, _i2, _l2, _c2, _ma_instances, d_fn, f_fn, p_fn, v_fn, u_fn, _e2, _t3, _r3, _n3, _a4, _s3, _o3, _i3, _l3, _c3, _d2, _f2, _p2, _v2, _u2, _b2, _hh_instances, x_fn, y_fn, w_fn, h_fn, g_fn, m_fn, __fn, _b3, _e3, _t4, _r4, _n4, _a5, _s4, _o4, _c4, _e4, _t5, _r5, _n5, _Ou_instances, a_fn, s_fn, _e5, _t6, _e6, _t7, _e7, _e8, _t8, _e9, _e10, _t9, _e11, _t10, _e12, _t11, _p1_instances, r_fn, n_fn, _e13, _t12, _r6, _n6, _e14, _t13, _r7, _e15, _t14, _r8, _n7, _a6, _s5, _o5, _e16, _t15, _e17, _e18, _e19, _t16, _e20, _Mg_instances, t_fn, _e21, _t17, _r9, _e22, _e23, _t18, _r10, _n8, _a7, _s6, _o6, _i4, _l4, _c5, _e24, _t19, _r11, _n9, _e25, _t20, _e26, _t21, _e27, _t22, _e28, _t23, _e29, _t24, _r12, _n10, _a8, _s7, _e30, _t25, _r13, _e31, _t26, _r14, _e32, _t27, _r15, _fd_instances, n_fn2, _a9, _e33, _t28, _r16, _n11, _e34, _t29, _r17, _n12, _md_instances, e_fn, _t30, _r18, _n13, _e35, _t31, _e36, _t32, _e37, _t33, _e38, _t34, _e39, _t35, _r19, _n14, _wd_instances, a_fn2, _s8, _d3;
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
const Em = false;
var Kl = Array.isArray, Cm = Array.prototype.indexOf, is = Array.prototype.includes, pi = Array.from, pf = Object.defineProperty, pa = Object.getOwnPropertyDescriptor, vf = Object.getOwnPropertyDescriptors, Im = Object.prototype, Pm = Array.prototype, Xl = Object.getPrototypeOf, qd = Object.isExtensible;
function ks(t) {
  return typeof t == "function";
}
const ut = () => {
};
function $m(t) {
  return t();
}
function il(t) {
  for (var e = 0; e < t.length; e++) t[e]();
}
function gf() {
  var t, e, r = new Promise((n, a) => {
    t = n, e = a;
  });
  return { promise: r, resolve: t, reject: e };
}
function mf(t, e) {
  if (Array.isArray(t)) return t;
  if (!(Symbol.iterator in t)) return Array.from(t);
  const r = [];
  for (const n of t) if (r.push(n), r.length === e) break;
  return r;
}
const xr = 2, ls = 4, ro = 8, Zl = 1 << 24, ba = 16, wn = 32, Ma = 64, ll = 128, nn = 512, mr = 1024, Ir = 2048, Ln = 4096, Qr = 8192, an = 16384, Ua = 32768, cl = 1 << 25, Xn = 65536, Yd = 1 << 17, Nm = 1 << 18, bs = 1 << 19, hf = 1 << 20, In = 1 << 25, za = 65536, dl = 1 << 21, Jl = 1 << 22, va = 1 << 23, Nn = Symbol("$state"), _f = Symbol("legacy props"), Rm = Symbol(""), Vn = new class extends Error {
  constructor() {
    super(...arguments);
    __publicField(this, "name", "StaleReactionError");
    __publicField(this, "message", "The reaction that called `getAbortSignal()` was re-run or destroyed");
  }
}(), bf = !!((_a2 = globalThis.document) == null ? void 0 : _a2.contentType) && globalThis.document.contentType.includes("xml");
function xf(t) {
  throw new Error("https://svelte.dev/e/lifecycle_outside_component");
}
function Mm() {
  throw new Error("https://svelte.dev/e/async_derived_orphan");
}
function zm(t, e, r) {
  throw new Error("https://svelte.dev/e/each_key_duplicate");
}
function Om(t) {
  throw new Error("https://svelte.dev/e/effect_in_teardown");
}
function Dm() {
  throw new Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function Lm(t) {
  throw new Error("https://svelte.dev/e/effect_orphan");
}
function jm() {
  throw new Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function Bm(t) {
  throw new Error("https://svelte.dev/e/props_invalid_value");
}
function Fm() {
  throw new Error("https://svelte.dev/e/state_descriptors_fixed");
}
function Um() {
  throw new Error("https://svelte.dev/e/state_prototype_fixed");
}
function Gm() {
  throw new Error("https://svelte.dev/e/state_unsafe_mutation");
}
function Wm() {
  throw new Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
const Vm = 1, Hm = 2, yf = 4, qm = 8, Ym = 16, Km = 1, Xm = 2, wf = 4, Zm = 8, Jm = 16, kf = 1, Qm = 2, hr = Symbol(), Sf = "http://www.w3.org/1999/xhtml", Tf = "http://www.w3.org/2000/svg", eh = "http://www.w3.org/1998/Math/MathML", Af = "@attach";
function th() {
  console.warn("https://svelte.dev/e/select_multiple_invalid_value");
}
function rh() {
  console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
function Ef(t) {
  return t === this.v;
}
function Cf(t, e) {
  return t != t ? e == e : t !== e || t !== null && typeof t == "object" || typeof t == "function";
}
function If(t) {
  return !Cf(t, this.v);
}
let xs = false, nh = false;
function ah() {
  xs = true;
}
let Kt = null;
function cs(t) {
  Kt = t;
}
function Kd(t) {
  return Ql().get(t);
}
function sh(t, e) {
  return Ql().set(t, e), e;
}
function oh(t) {
  return Ql().has(t);
}
function Be(t, e = false, r) {
  Kt = { p: Kt, i: false, c: null, e: null, s: t, x: null, r: _t, l: xs && !e ? { s: null, u: null, $: [] } : null };
}
function Fe(t) {
  var e = Kt, r = e.e;
  if (r !== null) {
    e.e = null;
    for (var n of r) ep(n);
  }
  return t !== void 0 && (e.x = t), e.i = true, Kt = e.p, t ?? {};
}
function ys() {
  return !xs || Kt !== null && Kt.l === null;
}
function Ql(t) {
  return Kt === null && xf(), Kt.c ?? (Kt.c = new Map(ih(Kt) || void 0));
}
function ih(t) {
  let e = t.p;
  for (; e !== null; ) {
    const r = e.c;
    if (r !== null) return r;
    e = e.p;
  }
  return null;
}
let Ia = [];
function Pf() {
  var t = Ia;
  Ia = [], il(t);
}
function Yn(t) {
  if (Ia.length === 0 && !Gs) {
    var e = Ia;
    queueMicrotask(() => {
      e === Ia && Pf();
    });
  }
  Ia.push(t);
}
function lh() {
  for (; Ia.length > 0; ) Pf();
}
function $f(t) {
  var e = _t;
  if (e === null) return St.f |= va, t;
  if ((e.f & Ua) === 0 && (e.f & ls) === 0) throw t;
  fa(t, e);
}
function fa(t, e) {
  for (; e !== null; ) {
    if ((e.f & ll) !== 0) {
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
const ch = -7169;
function cr(t, e) {
  t.f = t.f & ch | e;
}
function ec(t) {
  (t.f & nn) !== 0 || t.deps === null ? cr(t, mr) : cr(t, Ln);
}
function Nf(t) {
  if (t !== null) for (const e of t) (e.f & xr) === 0 || (e.f & za) === 0 || (e.f ^= za, Nf(e.deps));
}
function Rf(t, e, r) {
  (t.f & Ir) !== 0 ? e.add(t) : (t.f & Ln) !== 0 && r.add(t), Nf(t.deps), cr(t, mr);
}
function Mf(t, e, r) {
  if (t == null) return e(void 0), ut;
  const n = yr(() => t.subscribe(e, r));
  return n.unsubscribe ? () => n.unsubscribe() : n;
}
const Ja = [];
function dh(t, e = ut) {
  let r = null;
  const n = /* @__PURE__ */ new Set();
  function a(l) {
    if (Cf(t, l) && (t = l, r)) {
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
  function i(l, c = ut) {
    const f = [l, c];
    return n.add(f), n.size === 1 && (r = e(a, o) || ut), l(t), () => {
      n.delete(f), n.size === 0 && r && (r(), r = null);
    };
  }
  return { set: a, update: o, subscribe: i };
}
function vi(t) {
  let e;
  return Mf(t, (r) => e = r)(), e;
}
let To = false, ul = Symbol();
function zf(t, e, r) {
  const n = r[e] ?? (r[e] = { store: null, source: qf(void 0), unsubscribe: ut });
  if (n.store !== t && !(ul in r)) if (n.unsubscribe(), n.store = t ?? null, t == null) n.source.v = void 0, n.unsubscribe = ut;
  else {
    var a = true;
    n.unsubscribe = Mf(t, (o) => {
      a ? n.source.v = o : g(n.source, o);
    }), a = false;
  }
  return t && ul in r ? vi(t) : s(n.source);
}
function Of() {
  const t = {};
  function e() {
    so(() => {
      for (var r in t) t[r].unsubscribe();
      pf(t, ul, { enumerable: false, value: true });
    });
  }
  return [t, e];
}
function uh(t) {
  var e = To;
  try {
    return To = false, [t(), To];
  } finally {
    To = e;
  }
}
const Qa = /* @__PURE__ */ new Set();
let At = null, _n = null, fl = null, Gs = false, Gi = false, rs = null, Lo = null;
var Xd = 0;
let fh = 1;
const _ma = class _ma {
  constructor() {
    __privateAdd(this, _ma_instances);
    __publicField(this, "id", fh++);
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
      for (n of r.m) cr(n, Ln), this.schedule(n);
    }
  }
  capture(e, r) {
    r !== hr && !this.previous.has(e) && this.previous.set(e, r), (e.f & va) === 0 && (this.current.set(e, e.v), _n == null ? void 0 : _n.set(e, e.v));
  }
  activate() {
    At = this;
  }
  deactivate() {
    At = null, _n = null;
  }
  flush() {
    try {
      Gi = true, At = this, __privateMethod(this, _ma_instances, f_fn).call(this);
    } finally {
      Xd = 0, fl = null, rs = null, Lo = null, Gi = false, At = null, _n = null, ga.clear();
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
    __privateSet(this, _r2, __privateGet(this, _r2) - 1), e && __privateSet(this, _n2, __privateGet(this, _n2) - 1), !(__privateGet(this, _c2) || r) && (__privateSet(this, _c2, true), Yn(() => {
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
    return (__privateGet(this, _a3) ?? __privateSet(this, _a3, gf())).promise;
  }
  static ensure() {
    if (At === null) {
      const e = At = new _ma();
      Gi || (Qa.add(At), Gs || Yn(() => {
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
    if (fl = e, ((_a10 = e.b) == null ? void 0 : _a10.is_pending) && (e.f & (ls | ro | Zl)) !== 0 && (e.f & Ua) === 0) {
      e.b.defer_effect(e);
      return;
    }
    for (var r = e; r.parent !== null; ) {
      r = r.parent;
      var n = r.f;
      if (rs !== null && r === _t && (St === null || (St.f & xr) === 0)) return;
      if ((n & (Ma | wn)) !== 0) {
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
_ma_instances = new WeakSet();
d_fn = function() {
  return this.is_fork || __privateGet(this, _n2) > 0;
};
f_fn = function() {
  var _a10, _b4;
  if (Xd++ > 1e3 && (Qa.delete(this), vh()), !__privateMethod(this, _ma_instances, d_fn).call(this)) {
    for (const l of __privateGet(this, _o2)) __privateGet(this, _i2).delete(l), cr(l, Ir), this.schedule(l);
    for (const l of __privateGet(this, _i2)) cr(l, Ln), this.schedule(l);
  }
  const e = __privateGet(this, _s2);
  __privateSet(this, _s2, []), this.apply();
  var r = rs = [], n = [], a = Lo = [];
  for (const l of e) try {
    __privateMethod(this, _ma_instances, p_fn).call(this, l, r, n);
  } catch (c) {
    throw Bf(l), c;
  }
  if (At = null, a.length > 0) {
    var o = _ma.ensure();
    for (const l of a) o.schedule(l);
  }
  if (rs = null, Lo = null, __privateMethod(this, _ma_instances, d_fn).call(this)) {
    __privateMethod(this, _ma_instances, v_fn).call(this, n), __privateMethod(this, _ma_instances, v_fn).call(this, r);
    for (const [l, c] of __privateGet(this, _l2)) jf(l, c);
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
  i !== null && (Qa.add(i), __privateMethod(_b4 = i, _ma_instances, f_fn).call(_b4)), Qa.has(this) || __privateMethod(this, _ma_instances, u_fn).call(this);
};
p_fn = function(e, r, n) {
  e.f ^= mr;
  for (var a = e.first; a !== null; ) {
    var o = a.f, i = (o & (wn | Ma)) !== 0, l = i && (o & mr) !== 0, c = l || (o & Qr) !== 0 || __privateGet(this, _l2).has(a);
    if (!c && a.fn !== null) {
      i ? a.f ^= mr : (o & ls) !== 0 ? r.push(a) : oo(a) && ((o & ba) !== 0 && __privateGet(this, _i2).add(a), us(a));
      var f = a.first;
      if (f !== null) {
        a = f;
        continue;
      }
    }
    for (; a !== null; ) {
      var v = a.next;
      if (v !== null) {
        a = v;
        break;
      }
      a = a.parent;
    }
  }
};
v_fn = function(e) {
  for (var r = 0; r < e.length; r += 1) Rf(e[r], __privateGet(this, _o2), __privateGet(this, _i2));
};
u_fn = function() {
  var _a10;
  for (const c of Qa) {
    var e = c.id < this.id, r = [];
    for (const [f, v] of this.current) {
      if (c.current.has(f)) if (e && v !== c.current.get(f)) c.current.set(f, v);
      else continue;
      r.push(f);
    }
    if (r.length !== 0) {
      var n = [...c.current.keys()].filter((f) => !this.current.has(f));
      if (n.length > 0) {
        c.activate();
        var a = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Map();
        for (var i of r) Df(i, n, a, o);
        if (__privateGet(c, _s2).length > 0) {
          c.apply();
          for (var l of __privateGet(c, _s2)) __privateMethod(_a10 = c, _ma_instances, p_fn).call(_a10, l, [], []);
          __privateSet(c, _s2, []);
        }
        c.deactivate();
      }
    }
  }
};
let ma = _ma;
function ph(t) {
  var e = Gs;
  Gs = true;
  try {
    for (var r; ; ) {
      if (lh(), At === null) return r;
      At.flush();
    }
  } finally {
    Gs = e;
  }
}
function vh() {
  try {
    jm();
  } catch (t) {
    fa(t, fl);
  }
}
let Gn = null;
function Zd(t) {
  var e = t.length;
  if (e !== 0) {
    for (var r = 0; r < e; ) {
      var n = t[r++];
      if ((n.f & (an | Qr)) === 0 && oo(n) && (Gn = /* @__PURE__ */ new Set(), us(n), n.deps === null && n.first === null && n.nodes === null && n.teardown === null && n.ac === null && ap(n), (Gn == null ? void 0 : Gn.size) > 0)) {
        ga.clear();
        for (const a of Gn) {
          if ((a.f & (an | Qr)) !== 0) continue;
          const o = [a];
          let i = a.parent;
          for (; i !== null; ) Gn.has(i) && (Gn.delete(i), o.push(i)), i = i.parent;
          for (let l = o.length - 1; l >= 0; l--) {
            const c = o[l];
            (c.f & (an | Qr)) === 0 && us(c);
          }
        }
        Gn.clear();
      }
    }
    Gn = null;
  }
}
function Df(t, e, r, n) {
  if (!r.has(t) && (r.add(t), t.reactions !== null)) for (const a of t.reactions) {
    const o = a.f;
    (o & xr) !== 0 ? Df(a, e, r, n) : (o & (Jl | ba)) !== 0 && (o & Ir) === 0 && Lf(a, e, n) && (cr(a, Ir), tc(a));
  }
}
function Lf(t, e, r) {
  const n = r.get(t);
  if (n !== void 0) return n;
  if (t.deps !== null) for (const a of t.deps) {
    if (is.call(e, a)) return true;
    if ((a.f & xr) !== 0 && Lf(a, e, r)) return r.set(a, true), true;
  }
  return r.set(t, false), false;
}
function tc(t) {
  At.schedule(t);
}
function jf(t, e) {
  if (!((t.f & wn) !== 0 && (t.f & mr) !== 0)) {
    (t.f & Ir) !== 0 ? e.d.push(t) : (t.f & Ln) !== 0 && e.m.push(t), cr(t, mr);
    for (var r = t.first; r !== null; ) jf(r, e), r = r.next;
  }
}
function Bf(t) {
  cr(t, mr);
  for (var e = t.first; e !== null; ) Bf(e), e = e.next;
}
function Ff(t) {
  let e = 0, r = Zn(0), n;
  return () => {
    oc() && (s(r), _i(() => (e === 0 && (n = yr(() => t(() => Cn(r)))), e += 1, () => {
      Yn(() => {
        e -= 1, e === 0 && (n == null ? void 0 : n(), n = void 0, Cn(r));
      });
    })));
  };
}
var gh = Xn | bs;
function mh(t, e, r, n) {
  new hh(t, e, r, n);
}
class hh {
  constructor(e, r, n, a) {
    __privateAdd(this, _hh_instances);
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
    __privateAdd(this, _b2, Ff(() => (__privateSet(this, _u2, Zn(__privateGet(this, _c3))), () => {
      __privateSet(this, _u2, null);
    })));
    var _a10;
    __privateSet(this, _e2, e), __privateSet(this, _r3, r), __privateSet(this, _n3, (o) => {
      var i = _t;
      i.b = this, i.f |= ll, n(o);
    }), this.parent = _t.b, this.transform_error = a ?? ((_a10 = this.parent) == null ? void 0 : _a10.transform_error) ?? ((o) => o), __privateSet(this, _a4, Ga(() => {
      __privateMethod(this, _hh_instances, h_fn).call(this);
    }, gh));
  }
  defer_effect(e) {
    Rf(e, __privateGet(this, _p2), __privateGet(this, _v2));
  }
  is_rendered() {
    return !this.is_pending && (!this.parent || this.parent.is_rendered());
  }
  has_pending_snippet() {
    return !!__privateGet(this, _r3).pending;
  }
  update_pending_count(e, r) {
    __privateMethod(this, _hh_instances, __fn).call(this, e, r), __privateSet(this, _c3, __privateGet(this, _c3) + e), !(!__privateGet(this, _u2) || __privateGet(this, _f2)) && (__privateSet(this, _f2, true), Yn(() => {
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
        rh();
        return;
      }
      a = true, o && Wm(), __privateGet(this, _i3) !== null && $a(__privateGet(this, _i3), () => {
        __privateSet(this, _i3, null);
      }), __privateMethod(this, _hh_instances, m_fn).call(this, () => {
        __privateMethod(this, _hh_instances, h_fn).call(this);
      });
    }, l = (c) => {
      try {
        o = true, r == null ? void 0 : r(c, i), o = false;
      } catch (f) {
        fa(f, __privateGet(this, _a4) && __privateGet(this, _a4).parent);
      }
      n && __privateSet(this, _i3, __privateMethod(this, _hh_instances, m_fn).call(this, () => {
        try {
          return Gr(() => {
            var f = _t;
            f.b = this, f.f |= ll, n(__privateGet(this, _e2), () => c, () => i);
          });
        } catch (f) {
          return fa(f, __privateGet(this, _a4).parent), null;
        }
      }));
    };
    Yn(() => {
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
_hh_instances = new WeakSet();
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
  e && (this.is_pending = true, __privateSet(this, _o3, Gr(() => e(__privateGet(this, _e2)))), Yn(() => {
    var r = __privateSet(this, _l3, document.createDocumentFragment()), n = Rn();
    r.append(n), __privateSet(this, _s3, __privateMethod(this, _hh_instances, m_fn).call(this, () => Gr(() => __privateGet(this, _n3).call(this, n)))), __privateGet(this, _d2) === 0 && (__privateGet(this, _e2).before(r), __privateSet(this, _l3, null), $a(__privateGet(this, _o3), () => {
      __privateSet(this, _o3, null);
    }), __privateMethod(this, _hh_instances, g_fn).call(this, At));
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
    } else __privateMethod(this, _hh_instances, g_fn).call(this, At);
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
    return ma.ensure(), e();
  } catch (o) {
    return $f(o), null;
  } finally {
    ln(r), on(n), cs(a);
  }
};
__fn = function(e, r) {
  var _a10;
  if (!this.has_pending_snippet()) {
    this.parent && __privateMethod(_a10 = this.parent, _hh_instances, __fn).call(_a10, e, r);
    return;
  }
  __privateSet(this, _d2, __privateGet(this, _d2) + e), __privateGet(this, _d2) === 0 && (__privateMethod(this, _hh_instances, g_fn).call(this, r), __privateGet(this, _o3) && $a(__privateGet(this, _o3), () => {
    __privateSet(this, _o3, null);
  }), __privateGet(this, _l3) && (__privateGet(this, _e2).before(__privateGet(this, _l3)), __privateSet(this, _l3, null)));
};
function Uf(t, e, r, n) {
  const a = ys() ? no : rc;
  var o = t.filter((m) => !m.settled);
  if (r.length === 0 && o.length === 0) {
    n(e.map(a));
    return;
  }
  var i = _t, l = _h(), c = o.length === 1 ? o[0].promise : o.length > 1 ? Promise.all(o.map((m) => m.promise)) : null;
  function f(m) {
    l();
    try {
      n(m);
    } catch (y) {
      (i.f & an) === 0 && fa(y, i);
    }
    Vo();
  }
  if (r.length === 0) {
    c.then(() => f(e.map(a)));
    return;
  }
  var v = Gf();
  function x() {
    Promise.all(r.map((m) => bh(m))).then((m) => f([...e.map(a), ...m])).catch((m) => fa(m, i)).finally(() => v());
  }
  c ? c.then(() => {
    l(), x(), Vo();
  }) : x();
}
function _h() {
  var t = _t, e = St, r = Kt, n = At;
  return function(o = true) {
    ln(t), on(e), cs(r), o && (t.f & an) === 0 && (n == null ? void 0 : n.activate(), n == null ? void 0 : n.apply());
  };
}
function Vo(t = true) {
  ln(null), on(null), cs(null), t && (At == null ? void 0 : At.deactivate());
}
function Gf() {
  var t = _t.b, e = At, r = t.is_rendered();
  return t.update_pending_count(1, e), e.increment(r), (n = false) => {
    t.update_pending_count(-1, e), e.decrement(r, n);
  };
}
function no(t) {
  var e = xr | Ir, r = St !== null && (St.f & xr) !== 0 ? St : null;
  return _t !== null && (_t.f |= bs), { ctx: Kt, deps: null, effects: null, equals: Ef, f: e, fn: t, reactions: null, rv: 0, v: hr, wv: 0, parent: r ?? _t, ac: null };
}
function bh(t, e, r) {
  let n = _t;
  n === null && Mm();
  var a = void 0, o = Zn(hr), i = !St, l = /* @__PURE__ */ new Map();
  return $h(() => {
    var _a10;
    var c = _t, f = gf();
    a = f.promise;
    try {
      Promise.resolve(t()).then(f.resolve, f.reject).finally(Vo);
    } catch (y) {
      f.reject(y), Vo();
    }
    var v = At;
    if (i) {
      if ((c.f & Ua) !== 0) var x = Gf();
      if (n.b.is_rendered()) (_a10 = l.get(v)) == null ? void 0 : _a10.reject(Vn), l.delete(v);
      else {
        for (const y of l.values()) y.reject(Vn);
        l.clear();
      }
      l.set(v, f);
    }
    const m = (y, h = void 0) => {
      if (x) {
        var b = h === Vn;
        x(b);
      }
      if (!(h === Vn || (c.f & an) !== 0)) {
        if (v.activate(), h) o.f |= va, ds(o, h);
        else {
          (o.f & va) !== 0 && (o.f ^= va), ds(o, y);
          for (const [w, D] of l) {
            if (l.delete(w), w === v) break;
            D.reject(Vn);
          }
        }
        v.deactivate();
      }
    };
    f.promise.then(m, (y) => m(null, y || "unknown"));
  }), so(() => {
    for (const c of l.values()) c.reject(Vn);
  }), new Promise((c) => {
    function f(v) {
      function x() {
        v === a ? c(o) : f(a);
      }
      v.then(x, x);
    }
    f(a);
  });
}
function H(t) {
  const e = no(t);
  return ip(e), e;
}
function rc(t) {
  const e = no(t);
  return e.equals = If, e;
}
function xh(t) {
  var e = t.effects;
  if (e !== null) {
    t.effects = null;
    for (var r = 0; r < e.length; r += 1) Tr(e[r]);
  }
}
function yh(t) {
  for (var e = t.parent; e !== null; ) {
    if ((e.f & xr) === 0) return (e.f & an) === 0 ? e : null;
    e = e.parent;
  }
  return null;
}
function nc(t) {
  var e, r = _t;
  ln(yh(t));
  try {
    t.f &= ~za, xh(t), e = up(t);
  } finally {
    ln(r);
  }
  return e;
}
function Wf(t) {
  var e = t.v, r = nc(t);
  if (!t.equals(r) && (t.wv = cp(), (!(At == null ? void 0 : At.is_fork) || t.deps === null) && (t.v = r, At == null ? void 0 : At.capture(t, e), t.deps === null))) {
    cr(t, mr);
    return;
  }
  ha || (_n !== null ? (oc() || (At == null ? void 0 : At.is_fork)) && _n.set(t, r) : ec(t));
}
function wh(t) {
  var _a10, _b4;
  if (t.effects !== null) for (const e of t.effects) (e.teardown || e.ac) && ((_a10 = e.teardown) == null ? void 0 : _a10.call(e), (_b4 = e.ac) == null ? void 0 : _b4.abort(Vn), e.teardown = ut, e.ac = null, Zs(e, 0), ic(e));
}
function Vf(t) {
  if (t.effects !== null) for (const e of t.effects) e.teardown && us(e);
}
let pl = /* @__PURE__ */ new Set();
const ga = /* @__PURE__ */ new Map();
let Hf = false;
function Zn(t, e) {
  var r = { f: 0, v: t, reactions: null, equals: Ef, rv: 0, wv: 0 };
  return r;
}
function te(t, e) {
  const r = Zn(t);
  return ip(r), r;
}
function qf(t, e = false, r = true) {
  var _a10;
  const n = Zn(t);
  return e || (n.equals = If), xs && r && Kt !== null && Kt.l !== null && ((_a10 = Kt.l).s ?? (_a10.s = [])).push(n), n;
}
function g(t, e, r = false) {
  St !== null && (!bn || (St.f & Yd) !== 0) && ys() && (St.f & (xr | ba | Jl | Yd)) !== 0 && (sn === null || !is.call(sn, t)) && Gm();
  let n = r ? nt(e) : e;
  return ds(t, n, Lo);
}
function ds(t, e, r = null) {
  if (!t.equals(e)) {
    var n = t.v;
    ha ? ga.set(t, e) : ga.set(t, n), t.v = e;
    var a = ma.ensure();
    if (a.capture(t, n), (t.f & xr) !== 0) {
      const o = t;
      (t.f & Ir) !== 0 && nc(o), _n === null && ec(o);
    }
    t.wv = cp(), Yf(t, Ir, r), ys() && _t !== null && (_t.f & mr) !== 0 && (_t.f & (wn | Ma)) === 0 && (tn === null ? Rh([t]) : tn.push(t)), !a.is_fork && pl.size > 0 && !Hf && kh();
  }
  return e;
}
function kh() {
  Hf = false;
  for (const t of pl) (t.f & mr) !== 0 && cr(t, Ln), oo(t) && us(t);
  pl.clear();
}
function Jd(t, e = 1) {
  var r = s(t), n = e === 1 ? r++ : r--;
  return g(t, r), n;
}
function Cn(t) {
  g(t, t.v + 1);
}
function Yf(t, e, r) {
  var n = t.reactions;
  if (n !== null) for (var a = ys(), o = n.length, i = 0; i < o; i++) {
    var l = n[i], c = l.f;
    if (!(!a && l === _t)) {
      var f = (c & Ir) === 0;
      if (f && cr(l, e), (c & xr) !== 0) {
        var v = l;
        _n == null ? void 0 : _n.delete(v), (c & za) === 0 && (c & nn && (l.f |= za), Yf(v, Ln, r));
      } else if (f) {
        var x = l;
        (c & ba) !== 0 && Gn !== null && Gn.add(x), r !== null ? r.push(x) : tc(x);
      }
    }
  }
}
function nt(t) {
  if (typeof t != "object" || t === null || Nn in t) return t;
  const e = Xl(t);
  if (e !== Im && e !== Pm) return t;
  var r = /* @__PURE__ */ new Map(), n = Kl(t), a = te(0), o = Kn, i = (l) => {
    if (Kn === o) return l();
    var c = St, f = Kn;
    on(null), nu(o);
    var v = l();
    return on(c), nu(f), v;
  };
  return n && r.set("length", te(t.length)), new Proxy(t, { defineProperty(l, c, f) {
    (!("value" in f) || f.configurable === false || f.enumerable === false || f.writable === false) && Fm();
    var v = r.get(c);
    return v === void 0 ? i(() => {
      var x = te(f.value);
      return r.set(c, x), x;
    }) : g(v, f.value, true), true;
  }, deleteProperty(l, c) {
    var f = r.get(c);
    if (f === void 0) {
      if (c in l) {
        const v = i(() => te(hr));
        r.set(c, v), Cn(a);
      }
    } else g(f, hr), Cn(a);
    return true;
  }, get(l, c, f) {
    var _a10;
    if (c === Nn) return t;
    var v = r.get(c), x = c in l;
    if (v === void 0 && (!x || ((_a10 = pa(l, c)) == null ? void 0 : _a10.writable)) && (v = i(() => {
      var y = nt(x ? l[c] : hr), h = te(y);
      return h;
    }), r.set(c, v)), v !== void 0) {
      var m = s(v);
      return m === hr ? void 0 : m;
    }
    return Reflect.get(l, c, f);
  }, getOwnPropertyDescriptor(l, c) {
    var f = Reflect.getOwnPropertyDescriptor(l, c);
    if (f && "value" in f) {
      var v = r.get(c);
      v && (f.value = s(v));
    } else if (f === void 0) {
      var x = r.get(c), m = x == null ? void 0 : x.v;
      if (x !== void 0 && m !== hr) return { enumerable: true, configurable: true, value: m, writable: true };
    }
    return f;
  }, has(l, c) {
    var _a10;
    if (c === Nn) return true;
    var f = r.get(c), v = f !== void 0 && f.v !== hr || Reflect.has(l, c);
    if (f !== void 0 || _t !== null && (!v || ((_a10 = pa(l, c)) == null ? void 0 : _a10.writable))) {
      f === void 0 && (f = i(() => {
        var m = v ? nt(l[c]) : hr, y = te(m);
        return y;
      }), r.set(c, f));
      var x = s(f);
      if (x === hr) return false;
    }
    return v;
  }, set(l, c, f, v) {
    var _a10;
    var x = r.get(c), m = c in l;
    if (n && c === "length") for (var y = f; y < x.v; y += 1) {
      var h = r.get(y + "");
      h !== void 0 ? g(h, hr) : y in l && (h = i(() => te(hr)), r.set(y + "", h));
    }
    if (x === void 0) (!m || ((_a10 = pa(l, c)) == null ? void 0 : _a10.writable)) && (x = i(() => te(void 0)), g(x, nt(f)), r.set(c, x));
    else {
      m = x.v !== hr;
      var b = i(() => nt(f));
      g(x, b);
    }
    var w = Reflect.getOwnPropertyDescriptor(l, c);
    if ((w == null ? void 0 : w.set) && w.set.call(v, f), !m) {
      if (n && typeof c == "string") {
        var D = r.get("length"), F = Number(c);
        Number.isInteger(F) && F >= D.v && g(D, F + 1);
      }
      Cn(a);
    }
    return true;
  }, ownKeys(l) {
    s(a);
    var c = Reflect.ownKeys(l).filter((x) => {
      var m = r.get(x);
      return m === void 0 || m.v !== hr;
    });
    for (var [f, v] of r) v.v !== hr && !(f in l) && c.push(f);
    return c;
  }, setPrototypeOf() {
    Um();
  } });
}
function Qd(t) {
  try {
    if (t !== null && typeof t == "object" && Nn in t) return t[Nn];
  } catch {
  }
  return t;
}
function Sh(t, e) {
  return Object.is(Qd(t), Qd(e));
}
var eu, Kf, Xf, Zf;
function Th() {
  if (eu === void 0) {
    eu = window, Kf = /Firefox/.test(navigator.userAgent);
    var t = Element.prototype, e = Node.prototype, r = Text.prototype;
    Xf = pa(e, "firstChild").get, Zf = pa(e, "nextSibling").get, qd(t) && (t.__click = void 0, t.__className = void 0, t.__attributes = null, t.__style = void 0, t.__e = void 0), qd(r) && (r.__t = void 0);
  }
}
function Rn(t = "") {
  return document.createTextNode(t);
}
function Jr(t) {
  return Xf.call(t);
}
function ao(t) {
  return Zf.call(t);
}
function d(t, e) {
  return Jr(t);
}
function ae(t, e = false) {
  {
    var r = Jr(t);
    return r instanceof Comment && r.data === "" ? ao(r) : r;
  }
}
function p(t, e = 1, r = false) {
  let n = t;
  for (; e--; ) n = ao(n);
  return n;
}
function Ah(t) {
  t.textContent = "";
}
function Jf() {
  return false;
}
function ac(t, e, r) {
  return document.createElementNS(e ?? Sf, t, void 0);
}
function Eh(t, e) {
  if (e) {
    const r = document.body;
    t.autofocus = true, Yn(() => {
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
function Qf(t) {
  _t === null && (St === null && Lm(), Dm()), ha && Om();
}
function Ih(t, e) {
  var r = e.last;
  r === null ? e.last = e.first = t : (r.next = t, t.prev = r, e.last = t);
}
function kn(t, e) {
  var r = _t;
  r !== null && (r.f & Qr) !== 0 && (t |= Qr);
  var n = { ctx: Kt, deps: null, nodes: null, f: t | Ir | nn, first: null, fn: e, last: null, next: null, parent: r, b: r && r.b, prev: null, teardown: null, wv: 0, ac: null }, a = n;
  if ((t & ls) !== 0) rs !== null ? rs.push(n) : ma.ensure().schedule(n);
  else if (e !== null) {
    try {
      us(n);
    } catch (i) {
      throw Tr(n), i;
    }
    a.deps === null && a.teardown === null && a.nodes === null && a.first === a.last && (a.f & bs) === 0 && (a = a.first, (t & ba) !== 0 && (t & Xn) !== 0 && a !== null && (a.f |= Xn));
  }
  if (a !== null && (a.parent = r, r !== null && Ih(a, r), St !== null && (St.f & xr) !== 0 && (t & Ma) === 0)) {
    var o = St;
    (o.effects ?? (o.effects = [])).push(a);
  }
  return n;
}
function oc() {
  return St !== null && !bn;
}
function so(t) {
  const e = kn(ro, null);
  return cr(e, mr), e.teardown = t, e;
}
function Ut(t) {
  Qf();
  var e = _t.f, r = !St && (e & wn) !== 0 && (e & Ua) === 0;
  if (r) {
    var n = Kt;
    (n.e ?? (n.e = [])).push(t);
  } else return ep(t);
}
function ep(t) {
  return kn(ls | hf, t);
}
function mi(t) {
  return Qf(), kn(ro | hf, t);
}
function Ph(t) {
  ma.ensure();
  const e = kn(Ma | bs, t);
  return (r = {}) => new Promise((n) => {
    r.outro ? $a(e, () => {
      Tr(e), n(void 0);
    }) : (Tr(e), n(void 0));
  });
}
function hi(t) {
  return kn(ls, t);
}
function $h(t) {
  return kn(Jl | bs, t);
}
function _i(t, e = 0) {
  return kn(ro | e, t);
}
function j(t, e = [], r = [], n = []) {
  Uf(n, e, r, (a) => {
    kn(ro, () => t(...a.map(s)));
  });
}
function Ga(t, e = 0) {
  var r = kn(ba | e, t);
  return r;
}
function tp(t, e = 0) {
  var r = kn(Zl | e, t);
  return r;
}
function Gr(t) {
  return kn(wn | bs, t);
}
function rp(t) {
  var e = t.teardown;
  if (e !== null) {
    const r = ha, n = St;
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
      a.abort(Vn);
    });
    var n = r.next;
    (r.f & Ma) !== 0 ? r.parent = null : Tr(r, e), r = n;
  }
}
function Nh(t) {
  for (var e = t.first; e !== null; ) {
    var r = e.next;
    (e.f & wn) === 0 && Tr(e), e = r;
  }
}
function Tr(t, e = true) {
  var r = false;
  (e || (t.f & Nm) !== 0) && t.nodes !== null && t.nodes.end !== null && (np(t.nodes.start, t.nodes.end), r = true), cr(t, cl), ic(t, e && !r), Zs(t, 0);
  var n = t.nodes && t.nodes.t;
  if (n !== null) for (const o of n) o.stop();
  rp(t), t.f ^= cl, t.f |= an;
  var a = t.parent;
  a !== null && a.first !== null && ap(t), t.next = t.prev = t.teardown = t.ctx = t.deps = t.fn = t.nodes = t.ac = null;
}
function np(t, e) {
  for (; t !== null; ) {
    var r = t === e ? null : ao(t);
    t.remove(), t = r;
  }
}
function ap(t) {
  var e = t.parent, r = t.prev, n = t.next;
  r !== null && (r.next = n), n !== null && (n.prev = r), e !== null && (e.first === t && (e.first = n), e.last === t && (e.last = r));
}
function $a(t, e, r = true) {
  var n = [];
  sp(t, n, true);
  var a = () => {
    r && Tr(t), e && e();
  }, o = n.length;
  if (o > 0) {
    var i = () => --o || a();
    for (var l of n) l.out(i);
  } else a();
}
function sp(t, e, r) {
  if ((t.f & Qr) === 0) {
    t.f ^= Qr;
    var n = t.nodes && t.nodes.t;
    if (n !== null) for (const l of n) (l.is_global || r) && e.push(l);
    for (var a = t.first; a !== null; ) {
      var o = a.next, i = (a.f & Xn) !== 0 || (a.f & wn) !== 0 && (t.f & ba) !== 0;
      sp(a, e, i ? r : false), a = o;
    }
  }
}
function lc(t) {
  op(t, true);
}
function op(t, e) {
  if ((t.f & Qr) !== 0) {
    t.f ^= Qr, (t.f & mr) === 0 && (cr(t, Ir), ma.ensure().schedule(t));
    for (var r = t.first; r !== null; ) {
      var n = r.next, a = (r.f & Xn) !== 0 || (r.f & wn) !== 0;
      op(r, a ? e : false), r = n;
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
let jo = false, ha = false;
function ru(t) {
  ha = t;
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
function ip(t) {
  St !== null && (sn === null ? sn = [t] : sn.push(t));
}
let Ur = null, qr = 0, tn = null;
function Rh(t) {
  tn = t;
}
let lp = 1, Pa = 0, Kn = Pa;
function nu(t) {
  Kn = t;
}
function cp() {
  return ++lp;
}
function oo(t) {
  var e = t.f;
  if ((e & Ir) !== 0) return true;
  if (e & xr && (t.f &= ~za), (e & Ln) !== 0) {
    for (var r = t.deps, n = r.length, a = 0; a < n; a++) {
      var o = r[a];
      if (oo(o) && Wf(o), o.wv > t.wv) return true;
    }
    (e & nn) !== 0 && _n === null && cr(t, mr);
  }
  return false;
}
function dp(t, e, r = true) {
  var n = t.reactions;
  if (n !== null && !(sn !== null && is.call(sn, t))) for (var a = 0; a < n.length; a++) {
    var o = n[a];
    (o.f & xr) !== 0 ? dp(o, e, false) : e === o && (r ? cr(o, Ir) : (o.f & mr) !== 0 && cr(o, Ln), tc(o));
  }
}
function up(t) {
  var _a10;
  var e = Ur, r = qr, n = tn, a = St, o = sn, i = Kt, l = bn, c = Kn, f = t.f;
  Ur = null, qr = 0, tn = null, St = (f & (wn | Ma)) === 0 ? t : null, sn = null, cs(t.ctx), bn = false, Kn = ++Pa, t.ac !== null && (gi(() => {
    t.ac.abort(Vn);
  }), t.ac = null);
  try {
    t.f |= dl;
    var v = t.fn, x = v();
    t.f |= Ua;
    var m = t.deps, y = At == null ? void 0 : At.is_fork;
    if (Ur !== null) {
      var h;
      if (y || Zs(t, qr), m !== null && qr > 0) for (m.length = qr + Ur.length, h = 0; h < Ur.length; h++) m[qr + h] = Ur[h];
      else t.deps = m = Ur;
      if (oc() && (t.f & nn) !== 0) for (h = qr; h < m.length; h++) ((_a10 = m[h]).reactions ?? (_a10.reactions = [])).push(t);
    } else !y && m !== null && qr < m.length && (Zs(t, qr), m.length = qr);
    if (ys() && tn !== null && !bn && m !== null && (t.f & (xr | Ln | Ir)) === 0) for (h = 0; h < tn.length; h++) dp(tn[h], t);
    if (a !== null && a !== t) {
      if (Pa++, a.deps !== null) for (let b = 0; b < r; b += 1) a.deps[b].rv = Pa;
      if (e !== null) for (const b of e) b.rv = Pa;
      tn !== null && (n === null ? n = tn : n.push(...tn));
    }
    return (t.f & va) !== 0 && (t.f ^= va), x;
  } catch (b) {
    return $f(b);
  } finally {
    t.f ^= dl, Ur = e, qr = r, tn = n, St = a, sn = o, cs(i), bn = l, Kn = c;
  }
}
function Mh(t, e) {
  let r = e.reactions;
  if (r !== null) {
    var n = Cm.call(r, t);
    if (n !== -1) {
      var a = r.length - 1;
      a === 0 ? r = e.reactions = null : (r[n] = r[a], r.pop());
    }
  }
  if (r === null && (e.f & xr) !== 0 && (Ur === null || !is.call(Ur, e))) {
    var o = e;
    (o.f & nn) !== 0 && (o.f ^= nn, o.f &= ~za), ec(o), wh(o), Zs(o, 0);
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
    var r = _t, n = jo;
    _t = t, jo = true;
    try {
      (e & (ba | Zl)) !== 0 ? Nh(t) : ic(t), rp(t);
      var a = up(t);
      t.teardown = typeof a == "function" ? a : null, t.wv = lp;
      var o;
      Em && nh && (t.f & Ir) !== 0 && t.deps;
    } finally {
      jo = n, _t = r;
    }
  }
}
async function dc() {
  await Promise.resolve(), ph();
}
function s(t) {
  var e = t.f, r = (e & xr) !== 0;
  if (St !== null && !bn) {
    var n = _t !== null && (_t.f & an) !== 0;
    if (!n && (sn === null || !is.call(sn, t))) {
      var a = St.deps;
      if ((St.f & dl) !== 0) t.rv < Pa && (t.rv = Pa, Ur === null && a !== null && a[qr] === t ? qr++ : Ur === null ? Ur = [t] : Ur.push(t));
      else {
        (St.deps ?? (St.deps = [])).push(t);
        var o = t.reactions;
        o === null ? t.reactions = [St] : is.call(o, St) || o.push(St);
      }
    }
  }
  if (ha && ga.has(t)) return ga.get(t);
  if (r) {
    var i = t;
    if (ha) {
      var l = i.v;
      return ((i.f & mr) === 0 && i.reactions !== null || pp(i)) && (l = nc(i)), ga.set(i, l), l;
    }
    var c = (i.f & nn) === 0 && !bn && St !== null && (jo || (St.f & nn) !== 0), f = (i.f & Ua) === 0;
    oo(i) && (c && (i.f |= nn), Wf(i)), c && !f && (Vf(i), fp(i));
  }
  if (_n == null ? void 0 : _n.has(t)) return _n.get(t);
  if ((t.f & va) !== 0) throw t.v;
  return t.v;
}
function fp(t) {
  if (t.f |= nn, t.deps !== null) for (const e of t.deps) (e.reactions ?? (e.reactions = [])).push(t), (e.f & xr) !== 0 && (e.f & nn) === 0 && (Vf(e), fp(e));
}
function pp(t) {
  if (t.v === hr) return true;
  if (t.deps === null) return false;
  for (const e of t.deps) if (ga.has(e) || (e.f & xr) !== 0 && pp(e)) return true;
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
function Ta(t) {
  if (!(typeof t != "object" || !t || t instanceof EventTarget)) {
    if (Nn in t) vl(t);
    else if (!Array.isArray(t)) for (let e in t) {
      const r = t[e];
      typeof r == "object" && r && Nn in r && vl(r);
    }
  }
}
function vl(t, e = /* @__PURE__ */ new Set()) {
  if (typeof t == "object" && t !== null && !(t instanceof EventTarget) && !e.has(t)) {
    e.add(t), t instanceof Date && t.getTime();
    for (let n in t) try {
      vl(t[n], e);
    } catch {
    }
    const r = Xl(t);
    if (r !== Object.prototype && r !== Array.prototype && r !== Map.prototype && r !== Set.prototype && r !== Date.prototype) {
      const n = vf(r);
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
  return Symbol(Af);
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
const Ls = Symbol("events"), vp = /* @__PURE__ */ new Set(), gl = /* @__PURE__ */ new Set();
function uc(t, e, r, n = {}) {
  function a(o) {
    if (n.capture || ml.call(e, o), !o.cancelBubble) return gi(() => r == null ? void 0 : r.call(this, o));
  }
  return t.startsWith("pointer") || t.startsWith("touch") || t === "wheel" ? Yn(() => {
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
  (e === document.body || e === window || e === document || e instanceof HTMLMediaElement) && so(() => {
    e.removeEventListener(t, i, o);
  });
}
function Ne(t, e, r) {
  (e[Ls] ?? (e[Ls] = {}))[t] = r;
}
function Zt(t) {
  for (var e = 0; e < t.length; e++) vp.add(t[e]);
  for (var r of gl) r(t);
}
let au = null;
function ml(t) {
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
    pf(t, "currentTarget", { configurable: true, get() {
      return o || r;
    } });
    var v = St, x = _t;
    on(null), ln(null);
    try {
      for (var m, y = []; o !== null; ) {
        var h = o.assignedSlot || o.parentNode || o.host || null;
        try {
          var b = (_b4 = o[Ls]) == null ? void 0 : _b4[n];
          b != null && (!o.disabled || t.target === o) && b.call(o, t);
        } catch (w) {
          m ? y.push(w) : m = w;
        }
        if (t.cancelBubble || h === e || h === null) break;
        o = h;
      }
      if (m) {
        for (let w of y) queueMicrotask(() => {
          throw w;
        });
        throw m;
      }
    } finally {
      t[Ls] = e, delete t.currentTarget, on(v), ln(x);
    }
  }
}
const Wh = ((_b3 = globalThis == null ? void 0 : globalThis.window) == null ? void 0 : _b3.trustedTypes) && globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (t) => t });
function Vh(t) {
  return (Wh == null ? void 0 : Wh.createHTML(t)) ?? t;
}
function gp(t) {
  var e = ac("template");
  return e.innerHTML = Vh(t.replaceAll("<!>", "<!---->")), e.content;
}
function Jn(t, e) {
  var r = _t;
  r.nodes === null && (r.nodes = { start: t, end: e, a: null, t: null });
}
function _(t, e) {
  var r = (e & kf) !== 0, n = (e & Qm) !== 0, a, o = !t.startsWith("<!>");
  return () => {
    a === void 0 && (a = gp(o ? t : "<!>" + t), r || (a = Jr(a)));
    var i = n || Kf ? document.importNode(a, true) : a.cloneNode(true);
    if (r) {
      var l = Jr(i), c = i.lastChild;
      Jn(l, c);
    } else Jn(i, i);
    return i;
  };
}
function Hh(t, e, r = "svg") {
  var n = !t.startsWith("<!>"), a = (e & kf) !== 0, o = `<${r}>${n ? t : "<!>" + t}</${r}>`, i;
  return () => {
    if (!i) {
      var l = gp(o), c = Jr(l);
      if (a) for (i = document.createDocumentFragment(); Jr(c); ) i.appendChild(Jr(c));
      else i = Jr(c);
    }
    var f = i.cloneNode(true);
    if (a) {
      var v = Jr(f), x = f.lastChild;
      Jn(v, x);
    } else Jn(f, f);
    return f;
  };
}
function dn(t, e) {
  return Hh(t, e, "svg");
}
function Ue(t = "") {
  {
    var e = Rn(t + "");
    return Jn(e, e), e;
  }
}
function ke() {
  var t = document.createDocumentFragment(), e = document.createComment(""), r = Rn();
  return t.append(e, r), Jn(e, r), t;
}
function u(t, e) {
  t !== null && t.before(e);
}
function Pr() {
  var _a10;
  return (_a10 = window.__svelte ?? (window.__svelte = {})).uid ?? (_a10.uid = 1), `c${window.__svelte.uid++}`;
}
function T(t, e) {
  var r = e == null ? "" : typeof e == "object" ? `${e}` : e;
  r !== (t.__t ?? (t.__t = t.nodeValue)) && (t.__t = r, t.nodeValue = `${r}`);
}
function qh(t, e) {
  return Yh(t, e);
}
const Ao = /* @__PURE__ */ new Map();
function Yh(t, { target: e, anchor: r, props: n = {}, events: a, context: o, intro: i = true, transformError: l }) {
  Th();
  var c = void 0, f = Ph(() => {
    var v = r ?? e.appendChild(Rn());
    mh(v, { pending: () => {
    } }, (y) => {
      Be({});
      var h = Kt;
      o && (h.c = o), a && (n.$$events = a), c = t(y, n) || {}, Fe();
    }, l);
    var x = /* @__PURE__ */ new Set(), m = (y) => {
      for (var h = 0; h < y.length; h++) {
        var b = y[h];
        if (!x.has(b)) {
          x.add(b);
          var w = Uh(b);
          for (const B of [e, document]) {
            var D = Ao.get(B);
            D === void 0 && (D = /* @__PURE__ */ new Map(), Ao.set(B, D));
            var F = D.get(b);
            F === void 0 ? (B.addEventListener(b, ml, { passive: w }), D.set(b, 1)) : D.set(b, F + 1);
          }
        }
      }
    };
    return m(pi(vp)), gl.add(m), () => {
      var _a10;
      for (var y of x) for (const w of [e, document]) {
        var h = Ao.get(w), b = h.get(y);
        --b == 0 ? (w.removeEventListener(y, ml), h.delete(y), h.size === 0 && Ao.delete(w)) : h.set(y, b);
      }
      gl.delete(m), v !== r && ((_a10 = v.parentNode) == null ? void 0 : _a10.removeChild(v));
    };
  });
  return Kh.set(c, f), c;
}
let Kh = /* @__PURE__ */ new WeakMap();
class io {
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
              cc(i, f), f.append(Rn()), __privateGet(this, _r4).set(o, { effect: i, fragment: f });
            } else Tr(i);
            __privateGet(this, _n4).delete(o), __privateGet(this, _t4).delete(o);
          };
          __privateGet(this, _a5) || !n ? (__privateGet(this, _n4).add(o), $a(i, l, false)) : l();
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
    var n = At, a = Jf();
    if (r && !__privateGet(this, _t4).has(e) && !__privateGet(this, _r4).has(e)) if (a) {
      var o = document.createDocumentFragment(), i = Rn();
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
  var n = new io(t), a = r ? Xn : 0;
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
  var n = new io(t), a = !ys();
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
    let x = e[l];
    $a(x, () => {
      if (o) {
        if (o.pending.delete(x), o.done.add(x), o.pending.size === 0) {
          var m = t.outrogroups;
          hl(t, pi(o.done)), m.delete(o), m.size === 0 && (t.outrogroups = null);
        }
      } else i -= 1;
    }, false);
  }
  if (i === 0) {
    var c = n.length === 0 && r !== null;
    if (c) {
      var f = r, v = f.parentNode;
      Ah(v), v.append(f), t.items.clear();
    }
    hl(t, e, !c);
  } else o = { pending: new Set(e), done: /* @__PURE__ */ new Set() }, (t.outrogroups ?? (t.outrogroups = /* @__PURE__ */ new Set())).add(o);
}
function hl(t, e, r = true) {
  var n;
  if (t.pending.size > 0) {
    n = /* @__PURE__ */ new Set();
    for (const i of t.pending.values()) for (const l of i) n.add(t.items.get(l).e);
  }
  for (var a = 0; a < e.length; a++) {
    var o = e[a];
    if (n == null ? void 0 : n.has(o)) {
      o.f |= In;
      const i = document.createDocumentFragment();
      cc(o, i);
    } else Tr(e[a], r);
  }
}
var su;
function Ve(t, e, r, n, a, o = null) {
  var i = t, l = /* @__PURE__ */ new Map(), c = (e & yf) !== 0;
  if (c) {
    var f = t;
    i = f.appendChild(Rn());
  }
  var v = null, x = rc(() => {
    var B = r();
    return Kl(B) ? B : B == null ? [] : pi(B);
  }), m, y = /* @__PURE__ */ new Map(), h = true;
  function b(B) {
    (F.effect.f & an) === 0 && (F.pending.delete(B), F.fallback = v, Qh(F, m, i, e, n), v !== null && (m.length === 0 ? (v.f & In) === 0 ? lc(v) : (v.f ^= In, js(v, null, i)) : $a(v, () => {
      v = null;
    })));
  }
  function w(B) {
    F.pending.delete(B);
  }
  var D = Ga(() => {
    m = s(x);
    for (var B = m.length, M = /* @__PURE__ */ new Set(), Z = At, U = Jf(), P = 0; P < B; P += 1) {
      var E = m[P], S = n(E, P), $ = h ? null : l.get(S);
      $ ? ($.v && ds($.v, E), $.i && ds($.i, P), U && Z.unskip_effect($.e)) : ($ = e_(l, h ? i : su ?? (su = Rn()), E, S, P, a, e, r), h || ($.e.f |= In), l.set(S, $)), M.add(S);
    }
    if (B === 0 && o && !v && (h ? v = Gr(() => o(i)) : (v = Gr(() => o(su ?? (su = Rn()))), v.f |= In)), B > M.size && zm(), !h) if (y.set(Z, M), U) {
      for (const [J, W] of l) M.has(J) || Z.skip_effect(W.e);
      Z.oncommit(b), Z.ondiscard(w);
    } else b(Z);
    s(x);
  }), F = { effect: D, items: l, pending: y, outrogroups: null, fallback: v };
  h = false;
}
function Ss(t) {
  for (; t !== null && (t.f & wn) === 0; ) t = t.next;
  return t;
}
function Qh(t, e, r, n, a) {
  var _a10, _b4, _c6, _d4, _e40, _f3, _g2, _h2, _i5;
  var o = (n & qm) !== 0, i = e.length, l = t.items, c = Ss(t.effect.first), f, v = null, x, m = [], y = [], h, b, w, D;
  if (o) for (D = 0; D < i; D += 1) h = e[D], b = a(h, D), w = l.get(b).e, (w.f & In) === 0 && ((_b4 = (_a10 = w.nodes) == null ? void 0 : _a10.a) == null ? void 0 : _b4.measure(), (x ?? (x = /* @__PURE__ */ new Set())).add(w));
  for (D = 0; D < i; D += 1) {
    if (h = e[D], b = a(h, D), w = l.get(b).e, t.outrogroups !== null) for (const $ of t.outrogroups) $.pending.delete(w), $.done.delete(w);
    if ((w.f & In) !== 0) if (w.f ^= In, w === c) js(w, null, r);
    else {
      var F = v ? v.next : c;
      w === t.effect.last && (t.effect.last = w.prev), w.prev && (w.prev.next = w.next), w.next && (w.next.prev = w.prev), oa(t, v, w), oa(t, w, F), js(w, F, r), v = w, m = [], y = [], c = Ss(v.next);
      continue;
    }
    if ((w.f & Qr) !== 0 && (lc(w), o && ((_d4 = (_c6 = w.nodes) == null ? void 0 : _c6.a) == null ? void 0 : _d4.unfix(), (x ?? (x = /* @__PURE__ */ new Set())).delete(w))), w !== c) {
      if (f !== void 0 && f.has(w)) {
        if (m.length < y.length) {
          var B = y[0], M;
          v = B.prev;
          var Z = m[0], U = m[m.length - 1];
          for (M = 0; M < m.length; M += 1) js(m[M], B, r);
          for (M = 0; M < y.length; M += 1) f.delete(y[M]);
          oa(t, Z.prev, U.next), oa(t, v, Z), oa(t, U, B), c = B, v = U, D -= 1, m = [], y = [];
        } else f.delete(w), js(w, c, r), oa(t, w.prev, w.next), oa(t, w, v === null ? t.effect.first : v.next), oa(t, v, w), v = w;
        continue;
      }
      for (m = [], y = []; c !== null && c !== w; ) (f ?? (f = /* @__PURE__ */ new Set())).add(c), y.push(c), c = Ss(c.next);
      if (c === null) continue;
    }
    (w.f & In) === 0 && m.push(w), v = w, c = Ss(w.next);
  }
  if (t.outrogroups !== null) {
    for (const $ of t.outrogroups) $.pending.size === 0 && (hl(t, pi($.done)), (_e40 = t.outrogroups) == null ? void 0 : _e40.delete($));
    t.outrogroups.size === 0 && (t.outrogroups = null);
  }
  if (c !== null || f !== void 0) {
    var P = [];
    if (f !== void 0) for (w of f) (w.f & Qr) === 0 && P.push(w);
    for (; c !== null; ) (c.f & Qr) === 0 && c !== t.fallback && P.push(c), c = Ss(c.next);
    var E = P.length;
    if (E > 0) {
      var S = (n & yf) !== 0 && i === 0 ? r : null;
      if (o) {
        for (D = 0; D < E; D += 1) (_g2 = (_f3 = P[D].nodes) == null ? void 0 : _f3.a) == null ? void 0 : _g2.measure();
        for (D = 0; D < E; D += 1) (_i5 = (_h2 = P[D].nodes) == null ? void 0 : _h2.a) == null ? void 0 : _i5.fix();
      }
      Jh(t, P, S);
    }
  }
  o && Yn(() => {
    var _a11, _b5;
    if (x !== void 0) for (w of x) (_b5 = (_a11 = w.nodes) == null ? void 0 : _a11.a) == null ? void 0 : _b5.apply();
  });
}
function e_(t, e, r, n, a, o, i, l) {
  var c = (i & Vm) !== 0 ? (i & Ym) === 0 ? qf(r, false, false) : Zn(r) : null, f = (i & Hm) !== 0 ? Zn(a) : null;
  return { v: c, i: f, e: Gr(() => (o(e, c ?? r, f ?? a, l), () => {
    t.delete(n);
  })) };
}
function js(t, e, r) {
  if (t.nodes) for (var n = t.nodes.start, a = t.nodes.end, o = e && (e.f & In) === 0 ? e.nodes.start : r; n !== null; ) {
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
  j(() => {
    var f = _t;
    if (l !== (l = e() ?? "")) {
      if (r) {
        f.nodes = null, c.innerHTML = l, l !== "" && Jn(Jr(c), c.lastChild);
        return;
      }
      if (f.nodes !== null && (np(f.nodes.start, f.nodes.end), f.nodes = null), l !== "") {
        var v = n ? Tf : a ? eh : void 0, x = ac(n ? "svg" : a ? "math" : "template", v);
        x.innerHTML = l;
        var m = n || a ? x : x.content;
        if (Jn(Jr(m), m.lastChild), n || a) for (; Jr(m); ) i.before(Jr(m));
        else i.before(m);
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
  var n = new io(t);
  Ga(() => {
    const a = e() ?? null;
    n.ensure(a, a && ((o) => a(o, ...r)));
  }, Xn);
}
function dr(t, e, r) {
  var n = new io(t);
  Ga(() => {
    var a = e() ?? null;
    n.ensure(a, a && ((o) => r(o, a)));
  }, Xn);
}
function mp(t, e, r, n, a, o) {
  var i = null, l = t, c = new io(l, false);
  Ga(() => {
    const f = e() || null;
    var v = r || f === "svg" ? Tf : void 0;
    if (f === null) {
      c.ensure(null, null);
      return;
    }
    return c.ensure(f, (x) => {
      if (f) {
        if (i = ac(f, v), Jn(i, i), n) {
          var m = i.appendChild(Rn());
          n(i, m);
        }
        _t.nodes.end = i, x.before(i);
      }
    }), () => {
    };
  }, Xn), so(() => {
  });
}
function t_(t, e) {
  var r = void 0, n;
  tp(() => {
    r !== (r = e()) && (n && (Tr(n), n = null), r && (n = Gr(() => {
      hi(() => r(t));
    })));
  });
}
function hp(t) {
  var e, r, n = "";
  if (typeof t == "string" || typeof t == "number") n += t;
  else if (typeof t == "object") if (Array.isArray(t)) {
    var a = t.length;
    for (e = 0; e < a; e++) t[e] && (r = hp(t[e])) && (n && (n += " "), n += r);
  } else for (r in t) t[r] && (n && (n += " "), n += r);
  return n;
}
function Ws() {
  for (var t, e, r = 0, n = "", a = arguments.length; r < a; r++) (t = arguments[r]) && (e = hp(t)) && (n && (n += " "), n += e);
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
function Wi(t) {
  return t[0] !== "-" || t[1] !== "-" ? t.toLowerCase() : t;
}
function n_(t, e) {
  if (e) {
    var r = "", n, a;
    if (Array.isArray(e) ? (n = e[0], a = e[1]) : n = e, t) {
      t = String(t).replaceAll(/\s*\/\*.*?\*\/\s*/g, "").trim();
      var o = false, i = 0, l = false, c = [];
      n && c.push(...Object.keys(n).map(Wi)), a && c.push(...Object.keys(a).map(Wi));
      var f = 0, v = -1;
      const b = t.length;
      for (var x = 0; x < b; x++) {
        var m = t[x];
        if (l ? m === "/" && t[x - 1] === "*" && (l = false) : o ? o === m && (o = false) : m === "/" && t[x + 1] === "*" ? l = true : m === '"' || m === "'" ? o = m : m === "(" ? i++ : m === ")" && i--, !l && o === false && i === 0) {
          if (m === ":" && v === -1) v = x;
          else if (m === ";" || x === b - 1) {
            if (v !== -1) {
              var y = Wi(t.substring(f, v).trim());
              if (!c.includes(y)) {
                m !== ";" && x++;
                var h = t.substring(f, x).trim();
                r += " " + h + ";";
              }
            }
            f = x + 1, v = -1;
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
function Vi(t, e = {}, r, n) {
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
  } else n && (Array.isArray(n) ? (Vi(t, r == null ? void 0 : r[0], n[0]), Vi(t, r == null ? void 0 : r[1], n[1], "important")) : Vi(t, r, n));
  return n;
}
function Js(t, e, r = false) {
  if (t.multiple) {
    if (e == null) return;
    if (!Kl(e)) return th();
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
  e.observe(t, { childList: true, subtree: true, attributes: true, attributeFilter: ["value"] }), so(() => {
    e.disconnect();
  });
}
function Mn(t, e, r = e) {
  var n = /* @__PURE__ */ new WeakSet(), a = true;
  sc(t, "change", (o) => {
    var i = o ? "[selected]" : ":checked", l;
    if (t.multiple) l = [].map.call(t.querySelectorAll(i), Vs);
    else {
      var c = t.querySelector(i) ?? t.querySelector("option:not([disabled])");
      l = c && Vs(c);
    }
    r(l), t.__value = l, At !== null && n.add(At);
  }), hi(() => {
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
const Ts = Symbol("class"), As = Symbol("style"), _p = Symbol("is custom element"), bp = Symbol("is html"), a_ = bf ? "option" : "OPTION", s_ = bf ? "select" : "SELECT";
function o_(t, e) {
  e ? t.hasAttribute("selected") || t.setAttribute("selected", "") : t.removeAttribute("selected");
}
function br(t, e, r, n) {
  var a = xp(t);
  a[e] !== (a[e] = r) && (e === "loading" && (t[Rm] = r), r == null ? t.removeAttribute(e) : typeof r != "string" && yp(t).includes(e) ? t[e] = r : t.setAttribute(e, r));
}
function i_(t, e, r, n, a = false, o = false) {
  var i = xp(t), l = i[_p], c = !i[bp], f = e || {}, v = t.nodeName === a_;
  for (var x in e) x in r || (r[x] = null);
  r.class ? r.class = Et(r.class) : r[Ts] && (r.class = null), r[As] && (r.style ?? (r.style = null));
  var m = yp(t);
  for (const B in r) {
    let M = r[B];
    if (v && B === "value" && M == null) {
      t.value = t.__value = "", f[B] = M;
      continue;
    }
    if (B === "class") {
      var y = t.namespaceURI === "http://www.w3.org/1999/xhtml";
      rt(t, y, M, n, e == null ? void 0 : e[Ts], r[Ts]), f[B] = M, f[Ts] = r[Ts];
      continue;
    }
    if (B === "style") {
      Rt(t, M, e == null ? void 0 : e[As], r[As]), f[B] = M, f[As] = r[As];
      continue;
    }
    var h = f[B];
    if (!(M === h && !(M === void 0 && t.hasAttribute(B)))) {
      f[B] = M;
      var b = B[0] + B[1];
      if (b !== "$$") if (b === "on") {
        const Z = {}, U = "$$" + B;
        let P = B.slice(2);
        var w = Lh(P);
        if (Oh(P) && (P = P.slice(0, -7), Z.capture = true), !w && h) {
          if (M != null) continue;
          t.removeEventListener(P, f[U], Z), f[U] = null;
        }
        if (w) Ne(P, t, M), Zt([P]);
        else if (M != null) {
          let E = function(S) {
            f[B].call(this, S);
          };
          f[U] = uc(P, t, E, Z);
        }
      } else if (B === "style") br(t, B, M);
      else if (B === "autofocus") Eh(t, !!M);
      else if (!l && (B === "__value" || B === "value" && M != null)) t.value = t.__value = M;
      else if (B === "selected" && v) o_(t, M);
      else {
        var D = B;
        c || (D = Bh(D));
        var F = D === "defaultValue" || D === "defaultChecked";
        if (M == null && !l && !F) if (i[B] = null, D === "value" || D === "checked") {
          let Z = t;
          const U = e === void 0;
          if (D === "value") {
            let P = Z.defaultValue;
            Z.removeAttribute(D), Z.defaultValue = P, Z.value = Z.__value = U ? P : null;
          } else {
            let P = Z.defaultChecked;
            Z.removeAttribute(D), Z.defaultChecked = P, Z.checked = U ? P : false;
          }
        } else t.removeAttribute(B);
        else F || m.includes(D) && (l || typeof M != "string") ? (t[D] = M, D in i && (i[D] = hr)) : typeof M != "function" && br(t, D, M);
      }
    }
  }
  return f;
}
function Gt(t, e, r = [], n = [], a = [], o, i = false, l = false) {
  Uf(a, r, n, (c) => {
    var f = void 0, v = {}, x = t.nodeName === s_, m = false;
    if (tp(() => {
      var h = e(...c.map(s)), b = i_(t, f, h, o, i, l);
      m && x && "value" in h && Js(t, h.value);
      for (let D of Object.getOwnPropertySymbols(v)) h[D] || Tr(v[D]);
      for (let D of Object.getOwnPropertySymbols(h)) {
        var w = h[D];
        D.description === Af && (!f || w !== f[D]) && (v[D] && Tr(v[D]), v[D] = Gr(() => t_(t, () => w))), b[D] = w;
      }
      f = b;
    }), x) {
      var y = t;
      hi(() => {
        Js(y, f.value, true), pc(y);
      });
    }
    m = true;
  });
}
function xp(t) {
  return t.__attributes ?? (t.__attributes = { [_p]: t.nodeName.includes("-"), [bp]: t.namespaceURI === Sf });
}
var lu = /* @__PURE__ */ new Map();
function yp(t) {
  var e = t.getAttribute("is") || t.nodeName, r = lu.get(e);
  if (r) return r;
  lu.set(e, r = []);
  for (var n, a = t, o = Element.prototype; o !== a; ) {
    n = vf(a);
    for (var i in n) n[i].set && r.push(i);
    a = Xl(a);
  }
  return r;
}
function qn(t, e, r = e) {
  var n = /* @__PURE__ */ new WeakSet();
  sc(t, "input", async (a) => {
    var o = a ? t.defaultValue : t.value;
    if (o = Hi(t) ? qi(o) : o, r(o), At !== null && n.add(At), await dc(), o !== (o = e())) {
      var i = t.selectionStart, l = t.selectionEnd, c = t.value.length;
      if (t.value = o ?? "", l !== null) {
        var f = t.value.length;
        i === l && l === c && f > c ? (t.selectionStart = f, t.selectionEnd = f) : (t.selectionStart = i, t.selectionEnd = Math.min(l, f));
      }
    }
  }), yr(e) == null && t.value && (r(Hi(t) ? qi(t.value) : t.value), At !== null && n.add(At)), _i(() => {
    var a = e();
    if (t === document.activeElement) {
      var o = At;
      if (n.has(o)) return;
    }
    Hi(t) && a === qi(t.value) || t.type === "date" && !a && !t.value || a !== t.value && (t.value = a ?? "");
  });
}
function Hi(t) {
  var e = t.type;
  return e === "number" || e === "range";
}
function qi(t) {
  return t === "" ? null : +t;
}
function l_(t, e, r = e) {
  sc(t, "change", () => {
    r(t.files);
  }), _i(() => {
    t.files = e();
  });
}
function cu(t, e) {
  return t === e || (t == null ? void 0 : t[Nn]) === e;
}
function Qn(t = {}, e, r, n) {
  var a = Kt.r, o = _t;
  return hi(() => {
    var i, l;
    return _i(() => {
      i = l, l = [], yr(() => {
        t !== r(...l) && (e(t, ...l), i && cu(r(...i), t) && e(null, ...i));
      });
    }), () => {
      let c = o;
      for (; c !== a && c.parent !== null && c.parent.f & cl; ) c = c.parent;
      const f = () => {
        l && cu(r(...l), t) && e(null, ...l);
      }, v = c.teardown;
      c.teardown = () => {
        f(), v == null ? void 0 : v();
      };
    };
  }), t;
}
function wp(t = false) {
  const e = Kt, r = e.l.u;
  if (!r) return;
  let n = () => Ta(e.s);
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
  r.b.length && mi(() => {
    du(e, n), il(r.b);
  }), Ut(() => {
    const a = yr(() => r.m.map($m));
    return () => {
      for (const o of a) typeof o == "function" && o();
    };
  }), r.a.length && Ut(() => {
    du(e, n), il(r.a);
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
function ft(t, e, r) {
  return new Proxy({ props: t, exclude: e }, c_);
}
const d_ = { get(t, e) {
  if (!t.exclude.includes(e)) return s(t.version), e in t.special ? t.special[e]() : t.props[e];
}, set(t, e, r) {
  if (!(e in t.special)) {
    var n = _t;
    try {
      ln(t.parent_effect), t.special[e] = oe({ get [e]() {
        return t.props[e];
      } }, e, wf);
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
  return new Proxy({ props: t, exclude: e, special: {}, version: Zn(0), parent_effect: _t }, d_);
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
    const o = pa(a, e);
    if (o && o.set) return o.set(r), true;
  }
  return false;
}, getOwnPropertyDescriptor(t, e) {
  let r = t.props.length;
  for (; r--; ) {
    let n = t.props[r];
    if (ks(n) && (n = n()), typeof n == "object" && n !== null && e in n) {
      const a = pa(n, e);
      return a && !a.configurable && (a.configurable = true), a;
    }
  }
}, has(t, e) {
  if (e === Nn || e === _f) return false;
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
function oe(t, e, r, n) {
  var _a10;
  var a = !xs || (r & Xm) !== 0, o = (r & Zm) !== 0, i = (r & Jm) !== 0, l = n, c = true, f = () => (c && (c = false, l = i ? yr(n) : n), l);
  let v;
  if (o) {
    var x = Nn in t || _f in t;
    v = ((_a10 = pa(t, e)) == null ? void 0 : _a10.set) ?? (x && e in t ? (B) => t[e] = B : void 0);
  }
  var m, y = false;
  o ? [m, y] = uh(() => t[e]) : m = t[e], m === void 0 && n !== void 0 && (m = f(), v && (a && Bm(), v(m)));
  var h;
  if (a ? h = () => {
    var B = t[e];
    return B === void 0 ? f() : (c = true, B);
  } : h = () => {
    var B = t[e];
    return B !== void 0 && (l = void 0), B === void 0 ? l : B;
  }, a && (r & wf) === 0) return h;
  if (v) {
    var b = t.$$legacy;
    return (function(B, M) {
      return arguments.length > 0 ? ((!a || !M || b || y) && v(M ? h() : B), B) : h();
    });
  }
  var w = false, D = ((r & Km) !== 0 ? no : rc)(() => (w = false, h()));
  o && s(D);
  var F = _t;
  return (function(B, M) {
    if (arguments.length > 0) {
      const Z = M ? s(D) : a && o ? nt(B) : B;
      return g(D, Z), w = true, l !== void 0 && (l = Z), B;
    }
    return ha && w || (F.f & an) !== 0 ? D.v : s(D);
  });
}
function Xt(t) {
  Kt === null && xf(), xs && Kt.l !== null ? f_(Kt).m.push(t) : Ut(() => {
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
    const r = je(e, z.__wbindgen_malloc, z.__wbindgen_realloc), n = De;
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
    const r = je(e, z.__wbindgen_malloc, z.__wbindgen_realloc), n = De;
    return z.meaicore_deleteEmailClassification(this.__wbg_ptr, r, n);
  }
  deleteEmailClassificationsByAction(e) {
    const r = je(e, z.__wbindgen_malloc, z.__wbindgen_realloc), n = De;
    return z.meaicore_deleteEmailClassificationsByAction(this.__wbg_ptr, r, n);
  }
  deleteEventType(e) {
    const r = je(e, z.__wbindgen_malloc, z.__wbindgen_realloc), n = De;
    return z.meaicore_deleteEventType(this.__wbg_ptr, r, n);
  }
  deleteItemsByIds(e) {
    return z.meaicore_deleteItemsByIds(this.__wbg_ptr, e);
  }
  deleteItemsBySource(e) {
    const r = je(e, z.__wbindgen_malloc, z.__wbindgen_realloc), n = De;
    return z.meaicore_deleteItemsBySource(this.__wbg_ptr, r, n);
  }
  deleteRule(e) {
    const r = je(e, z.__wbindgen_malloc, z.__wbindgen_realloc), n = De;
    return z.meaicore_deleteRule(this.__wbg_ptr, r, n);
  }
  deleteSyncState(e) {
    const r = je(e, z.__wbindgen_malloc, z.__wbindgen_realloc), n = De;
    return z.meaicore_deleteSyncState(this.__wbg_ptr, r, n);
  }
  executePipeline(e, r, n, a, o) {
    const i = je(n, z.__wbindgen_malloc, z.__wbindgen_realloc), l = De;
    return z.meaicore_executePipeline(this.__wbg_ptr, e, r, i, l, vt(a) ? 0 : Zr(a), vt(o) ? 0 : Zr(o));
  }
  executePipelineBatch(e, r, n, a, o) {
    const i = je(n, z.__wbindgen_malloc, z.__wbindgen_realloc), l = De;
    return z.meaicore_executePipelineBatch(this.__wbg_ptr, e, r, i, l, vt(a) ? 0 : Zr(a), vt(o) ? 0 : Zr(o));
  }
  getActions() {
    return z.meaicore_getActions(this.__wbg_ptr);
  }
  getApiModelInfo(e) {
    const r = je(e, z.__wbindgen_malloc, z.__wbindgen_realloc), n = De, a = z.meaicore_getApiModelInfo(this.__wbg_ptr, r, n);
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
    const r = je(e, z.__wbindgen_malloc, z.__wbindgen_realloc), n = De, a = z.meaicore_getAvailableActions(this.__wbg_ptr, r, n);
    if (a[2]) throw Hr(a[1]);
    return Hr(a[0]);
  }
  getCategoryPipelineActions(e) {
    const r = je(e, z.__wbindgen_malloc, z.__wbindgen_realloc), n = De;
    return z.meaicore_getCategoryPipelineActions(this.__wbg_ptr, r, n);
  }
  getContactByEmail(e) {
    const r = je(e, z.__wbindgen_malloc, z.__wbindgen_realloc), n = De;
    return z.meaicore_getContactByEmail(this.__wbg_ptr, r, n);
  }
  getContactsCount() {
    return z.meaicore_getContactsCount(this.__wbg_ptr);
  }
  getEmailClassifications(e, r) {
    var n = vt(e) ? 0 : je(e, z.__wbindgen_malloc, z.__wbindgen_realloc), a = De;
    return z.meaicore_getEmailClassifications(this.__wbg_ptr, n, a, vt(r) ? 4294967297 : r >>> 0);
  }
  getEmailClassificationsCount() {
    return z.meaicore_getEmailClassificationsCount(this.__wbg_ptr);
  }
  getEventCategories() {
    return z.meaicore_getEventCategories(this.__wbg_ptr);
  }
  getEventCategoryPolicy(e) {
    const r = je(e, z.__wbindgen_malloc, z.__wbindgen_realloc), n = De;
    return z.meaicore_getEventCategoryPolicy(this.__wbg_ptr, r, n);
  }
  getEventTypeCategory(e) {
    const r = je(e, z.__wbindgen_malloc, z.__wbindgen_realloc), n = De;
    return z.meaicore_getEventTypeCategory(this.__wbg_ptr, r, n);
  }
  getEventTypes() {
    return z.meaicore_getEventTypes(this.__wbg_ptr);
  }
  getEvents(e, r) {
    return z.meaicore_getEvents(this.__wbg_ptr, e, r);
  }
  getItemById(e) {
    const r = je(e, z.__wbindgen_malloc, z.__wbindgen_realloc), n = De;
    return z.meaicore_getItemById(this.__wbg_ptr, r, n);
  }
  getItemsBySource(e, r, n) {
    const a = je(e, z.__wbindgen_malloc, z.__wbindgen_realloc), o = De;
    return z.meaicore_getItemsBySource(this.__wbg_ptr, a, o, r, n);
  }
  getItemsCount() {
    return z.meaicore_getItemsCount(this.__wbg_ptr);
  }
  getItemsCountBySource(e) {
    const r = je(e, z.__wbindgen_malloc, z.__wbindgen_realloc), n = De;
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
    const r = je(e, z.__wbindgen_malloc, z.__wbindgen_realloc), n = De;
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
    const n = je(e, z.__wbindgen_malloc, z.__wbindgen_realloc), a = De, o = je(r, z.__wbindgen_malloc, z.__wbindgen_realloc), i = De, l = z.meaicore_getRequiredScopes(this.__wbg_ptr, n, a, o, i);
    if (l[2]) throw Hr(l[1]);
    return Hr(l[0]);
  }
  getRule(e) {
    const r = je(e, z.__wbindgen_malloc, z.__wbindgen_realloc), n = De;
    return z.meaicore_getRule(this.__wbg_ptr, r, n);
  }
  getRules() {
    return z.meaicore_getRules(this.__wbg_ptr);
  }
  getSetting(e) {
    const r = je(e, z.__wbindgen_malloc, z.__wbindgen_realloc), n = De;
    return z.meaicore_getSetting(this.__wbg_ptr, r, n);
  }
  getSources() {
    return z.meaicore_getSources(this.__wbg_ptr);
  }
  getSyncState(e) {
    const r = je(e, z.__wbindgen_malloc, z.__wbindgen_realloc), n = De;
    return z.meaicore_getSyncState(this.__wbg_ptr, r, n);
  }
  getTableCount(e) {
    const r = je(e, z.__wbindgen_malloc, z.__wbindgen_realloc), n = De;
    return z.meaicore_getTableCount(this.__wbg_ptr, r, n);
  }
  getTypePipelineActions(e) {
    const r = je(e, z.__wbindgen_malloc, z.__wbindgen_realloc), n = De;
    return z.meaicore_getTypePipelineActions(this.__wbg_ptr, r, n);
  }
  insertContactsBatch(e) {
    return z.meaicore_insertContactsBatch(this.__wbg_ptr, e);
  }
  insertEvent(e, r, n, a, o, i, l, c, f, v, x, m) {
    const y = je(e, z.__wbindgen_malloc, z.__wbindgen_realloc), h = De;
    var b = vt(r) ? 0 : je(r, z.__wbindgen_malloc, z.__wbindgen_realloc), w = De, D = vt(n) ? 0 : je(n, z.__wbindgen_malloc, z.__wbindgen_realloc), F = De, B = vt(a) ? 0 : je(a, z.__wbindgen_malloc, z.__wbindgen_realloc), M = De, Z = vt(i) ? 0 : je(i, z.__wbindgen_malloc, z.__wbindgen_realloc), U = De, P = vt(l) ? 0 : je(l, z.__wbindgen_malloc, z.__wbindgen_realloc), E = De, S = vt(c) ? 0 : je(c, z.__wbindgen_malloc, z.__wbindgen_realloc), $ = De, J = vt(f) ? 0 : je(f, z.__wbindgen_malloc, z.__wbindgen_realloc), W = De, C = vt(v) ? 0 : je(v, z.__wbindgen_malloc, z.__wbindgen_realloc), A = De, k = vt(x) ? 0 : je(x, z.__wbindgen_malloc, z.__wbindgen_realloc), N = De, O = vt(m) ? 0 : je(m, z.__wbindgen_malloc, z.__wbindgen_realloc), Y = De;
    return z.meaicore_insertEvent(this.__wbg_ptr, y, h, b, w, D, F, B, M, o, Z, U, P, E, S, $, J, W, C, A, k, N, O, Y);
  }
  insertItemsBatch(e) {
    return z.meaicore_insertItemsBatch(this.__wbg_ptr, e);
  }
  insertSyncStateBatch(e) {
    return z.meaicore_insertSyncStateBatch(this.__wbg_ptr, e);
  }
  logAuditExecution(e, r, n, a, o, i, l, c, f) {
    const v = je(e, z.__wbindgen_malloc, z.__wbindgen_realloc), x = De, m = je(r, z.__wbindgen_malloc, z.__wbindgen_realloc), y = De, h = je(n, z.__wbindgen_malloc, z.__wbindgen_realloc), b = De, w = je(a, z.__wbindgen_malloc, z.__wbindgen_realloc), D = De, F = je(o, z.__wbindgen_malloc, z.__wbindgen_realloc), B = De, M = je(c, z.__wbindgen_malloc, z.__wbindgen_realloc), Z = De, U = je(f, z.__wbindgen_malloc, z.__wbindgen_realloc), P = De;
    return z.meaicore_logAuditExecution(this.__wbg_ptr, v, x, m, y, h, b, w, D, F, B, i, l, M, Z, U, P);
  }
  constructor() {
    return z.meaicore_new();
  }
  putEmailClassification(e, r, n, a, o, i, l, c, f, v, x) {
    const m = je(e, z.__wbindgen_malloc, z.__wbindgen_realloc), y = De;
    var h = vt(r) ? 0 : je(r, z.__wbindgen_malloc, z.__wbindgen_realloc), b = De, w = vt(n) ? 0 : je(n, z.__wbindgen_malloc, z.__wbindgen_realloc), D = De, F = vt(a) ? 0 : je(a, z.__wbindgen_malloc, z.__wbindgen_realloc), B = De, M = vt(o) ? 0 : je(o, z.__wbindgen_malloc, z.__wbindgen_realloc), Z = De, U = vt(i) ? 0 : je(i, z.__wbindgen_malloc, z.__wbindgen_realloc), P = De, E = vt(l) ? 0 : je(l, z.__wbindgen_malloc, z.__wbindgen_realloc), S = De, $ = vt(c) ? 0 : je(c, z.__wbindgen_malloc, z.__wbindgen_realloc), J = De, W = vt(x) ? 0 : je(x, z.__wbindgen_malloc, z.__wbindgen_realloc), C = De;
    return z.meaicore_putEmailClassification(this.__wbg_ptr, m, y, h, b, w, D, F, B, M, Z, U, P, E, S, $, J, !vt(f), vt(f) ? 0 : f, !vt(v), vt(v) ? 0 : v, W, C);
  }
  removeSetting(e) {
    const r = je(e, z.__wbindgen_malloc, z.__wbindgen_realloc), n = De;
    return z.meaicore_removeSetting(this.__wbg_ptr, r, n);
  }
  resolvePluginId(e) {
    let r, n;
    try {
      const a = je(e, z.__wbindgen_malloc, z.__wbindgen_realloc), o = De, i = z.meaicore_resolvePluginId(this.__wbg_ptr, a, o);
      return r = i[0], n = i[1], gr(i[0], i[1]);
    } finally {
      z.__wbindgen_free(r, n, 1);
    }
  }
  saveRule(e) {
    return z.meaicore_saveRule(this.__wbg_ptr, e);
  }
  setPluginEnabled(e, r) {
    const n = je(e, z.__wbindgen_malloc, z.__wbindgen_realloc), a = De;
    return z.meaicore_setPluginEnabled(this.__wbg_ptr, n, a, r);
  }
  setSetting(e, r) {
    const n = je(e, z.__wbindgen_malloc, z.__wbindgen_realloc), a = De, o = je(r, z.__wbindgen_malloc, z.__wbindgen_realloc), i = De;
    return z.meaicore_setSetting(this.__wbg_ptr, n, a, o, i);
  }
  setSourceEnabled(e, r) {
    const n = je(e, z.__wbindgen_malloc, z.__wbindgen_realloc), a = De;
    return z.meaicore_setSourceEnabled(this.__wbg_ptr, n, a, r);
  }
  streamChat(e, r, n, a, o) {
    const i = je(e, z.__wbindgen_malloc, z.__wbindgen_realloc), l = De, c = je(r, z.__wbindgen_malloc, z.__wbindgen_realloc), f = De;
    return z.meaicore_streamChat(this.__wbg_ptr, i, l, c, f, n, a, o);
  }
  syncAfterAuditExecution(e, r) {
    const n = je(e, z.__wbindgen_malloc, z.__wbindgen_realloc), a = De;
    return z.meaicore_syncAfterAuditExecution(this.__wbg_ptr, n, a, r);
  }
  testApiConnection(e, r) {
    const n = je(e, z.__wbindgen_malloc, z.__wbindgen_realloc), a = De, o = je(r, z.__wbindgen_malloc, z.__wbindgen_realloc), i = De;
    return z.meaicore_testApiConnection(this.__wbg_ptr, n, a, o, i);
  }
  updateCategoryPipeline(e, r) {
    const n = je(e, z.__wbindgen_malloc, z.__wbindgen_realloc), a = De;
    return z.meaicore_updateCategoryPipeline(this.__wbg_ptr, n, a, r);
  }
  updateCategoryPolicy(e, r) {
    const n = je(e, z.__wbindgen_malloc, z.__wbindgen_realloc), a = De, o = je(r, z.__wbindgen_malloc, z.__wbindgen_realloc), i = De;
    return z.meaicore_updateCategoryPolicy(this.__wbg_ptr, n, a, o, i);
  }
  updateEmailClassificationStatus(e, r) {
    const n = je(e, z.__wbindgen_malloc, z.__wbindgen_realloc), a = De, o = je(r, z.__wbindgen_malloc, z.__wbindgen_realloc), i = De;
    return z.meaicore_updateEmailClassificationStatus(this.__wbg_ptr, n, a, o, i);
  }
  updateEventStatus(e, r) {
    const n = je(e, z.__wbindgen_malloc, z.__wbindgen_realloc), a = De, o = je(r, z.__wbindgen_malloc, z.__wbindgen_realloc), i = De;
    return z.meaicore_updateEventStatus(this.__wbg_ptr, n, a, o, i);
  }
  updateEventTypeCategory(e, r) {
    const n = je(e, z.__wbindgen_malloc, z.__wbindgen_realloc), a = De, o = je(r, z.__wbindgen_malloc, z.__wbindgen_realloc), i = De;
    return z.meaicore_updateEventTypeCategory(this.__wbg_ptr, n, a, o, i);
  }
  upsertContact(e, r, n, a) {
    const o = je(e, z.__wbindgen_malloc, z.__wbindgen_realloc), i = De, l = je(r, z.__wbindgen_malloc, z.__wbindgen_realloc), c = De;
    return z.meaicore_upsertContact(this.__wbg_ptr, o, i, l, c, n, a);
  }
  upsertEventType(e, r, n, a) {
    const o = je(e, z.__wbindgen_malloc, z.__wbindgen_realloc), i = De, l = je(r, z.__wbindgen_malloc, z.__wbindgen_realloc), c = De, f = je(n, z.__wbindgen_malloc, z.__wbindgen_realloc), v = De;
    return z.meaicore_upsertEventType(this.__wbg_ptr, o, i, l, c, f, v, a);
  }
  upsertSyncState(e, r, n, a, o) {
    const i = je(e, z.__wbindgen_malloc, z.__wbindgen_realloc), l = De, c = je(r, z.__wbindgen_malloc, z.__wbindgen_realloc), f = De, v = je(o, z.__wbindgen_malloc, z.__wbindgen_realloc), x = De;
    return z.meaicore_upsertSyncState(this.__wbg_ptr, i, l, c, f, n, a, v, x);
  }
}
Symbol.dispose && (fs.prototype[Symbol.dispose] = fs.prototype.free);
function v_() {
  return { __proto__: null, "./me_ai_core_bg.js": { __proto__: null, __wbg_Error_83742b46f01ce22d: function(e, r) {
    return Error(gr(e, r));
  }, __wbg_Number_a5a435bd7bbec835: function(e) {
    return Number(e);
  }, __wbg_String_8564e559799eccda: function(e, r) {
    const n = String(r), a = je(n, z.__wbindgen_malloc, z.__wbindgen_realloc), o = De;
    jr().setInt32(e + 4, o, true), jr().setInt32(e + 0, a, true);
  }, __wbg___wbindgen_bigint_get_as_i64_447a76b5c6ef7bda: function(e, r) {
    const n = r, a = typeof n == "bigint" ? n : void 0;
    jr().setBigInt64(e + 8, vt(a) ? BigInt(0) : a, true), jr().setInt32(e + 0, !vt(a), true);
  }, __wbg___wbindgen_boolean_get_c0f3f60bac5a78d1: function(e) {
    const r = e, n = typeof r == "boolean" ? r : void 0;
    return vt(n) ? 16777215 : n ? 1 : 0;
  }, __wbg___wbindgen_debug_string_5398f5bb970e0daa: function(e, r) {
    const n = _l(r), a = je(n, z.__wbindgen_malloc, z.__wbindgen_realloc), o = De;
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
    jr().setFloat64(e + 8, vt(a) ? 0 : a, true), jr().setInt32(e + 0, !vt(a), true);
  }, __wbg___wbindgen_string_get_395e606bd0ee4427: function(e, r) {
    const n = r, a = typeof n == "string" ? n : void 0;
    var o = vt(a) ? 0 : je(a, z.__wbindgen_malloc, z.__wbindgen_realloc), i = De;
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
    return vt(r) ? 0 : Zr(r);
  }, __wbg_error_74898554122344a8: function() {
    return ct(function(e) {
      const r = e.error;
      return vt(r) ? 0 : Zr(r);
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
    var o = vt(a) ? 0 : je(a, z.__wbindgen_malloc, z.__wbindgen_realloc), i = De;
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
    return vt(e) ? 0 : Zr(e);
  }, __wbg_static_accessor_GLOBAL_THIS_ad356e0db91c7913: function() {
    const e = typeof globalThis > "u" ? null : globalThis;
    return vt(e) ? 0 : Zr(e);
  }, __wbg_static_accessor_SELF_f207c857566db248: function() {
    const e = typeof self > "u" ? null : self;
    return vt(e) ? 0 : Zr(e);
  }, __wbg_static_accessor_WINDOW_bb9f1ba69d61b386: function() {
    const e = typeof window > "u" ? null : window;
    return vt(e) ? 0 : Zr(e);
  }, __wbg_status_318629ab93a22955: function(e) {
    return e.status;
  }, __wbg_stringify_5ae93966a84901ac: function() {
    return ct(function(e) {
      return JSON.stringify(e);
    }, arguments);
  }, __wbg_target_7bc90f314634b37b: function(e) {
    const r = e.target;
    return vt(r) ? 0 : Zr(r);
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
    return vt(r) ? 0 : Zr(r);
  }, __wbg_unique_3329c63c37e586a7: function(e) {
    return e.unique;
  }, __wbg_url_7fefc1820fba4e0c: function(e, r) {
    const n = r.url, a = je(n, z.__wbindgen_malloc, z.__wbindgen_realloc), o = De;
    jr().setInt32(e + 4, o, true), jr().setInt32(e + 0, a, true);
  }, __wbg_value_21fc78aab0322612: function(e) {
    return e.value;
  }, __wbg_value_79629bd10d556879: function() {
    return ct(function(e) {
      return e.value;
    }, arguments);
  }, __wbindgen_cast_0000000000000001: function(e, r) {
    return Eo(e, r, z.wasm_bindgen__closure__destroy__heedac0890341c2a7, m_);
  }, __wbindgen_cast_0000000000000002: function(e, r) {
    return Eo(e, r, z.wasm_bindgen__closure__destroy__h67a8c841ac8fc7de, g_);
  }, __wbindgen_cast_0000000000000003: function(e, r) {
    return Eo(e, r, z.wasm_bindgen__closure__destroy__h8069e08c8e9d16c4, __);
  }, __wbindgen_cast_0000000000000004: function(e, r) {
    return Eo(e, r, z.wasm_bindgen__closure__destroy__h977d29423189e3cf, h_);
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
function _l(t) {
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
    a > 0 && (o += _l(t[0]));
    for (let i = 1; i < a; i++) o += ", " + _l(t[i]);
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
let Aa = null;
function jr() {
  return (Aa === null || Aa.buffer.detached === true || Aa.buffer.detached === void 0 && Aa.buffer !== z.memory.buffer) && (Aa = new DataView(z.memory.buffer)), Aa;
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
function vt(t) {
  return t == null;
}
function Eo(t, e, r, n) {
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
function je(t, e, r) {
  if (r === void 0) {
    const l = qs.encode(t), c = e(l.length, 1) >>> 0;
    return Hs().subarray(c, c + l.length).set(l), De = l.length, c;
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
  return De = i, a;
}
function Hr(t) {
  const e = z.__wbindgen_externrefs.get(t);
  return z.__externref_table_dealloc(t), e;
}
let Bo = new TextDecoder("utf-8", { ignoreBOM: true, fatal: true });
Bo.decode();
const T_ = 2146435072;
let Yi = 0;
function A_(t, e) {
  return Yi += e, Yi >= T_ && (Bo = new TextDecoder("utf-8", { ignoreBOM: true, fatal: true }), Bo.decode(), Yi = e), Bo.decode(Hs().subarray(t, t + e));
}
const qs = new TextEncoder();
"encodeInto" in qs || (qs.encodeInto = function(t, e) {
  const r = qs.encode(t);
  return e.set(r), { read: t.length, written: r.length };
});
let De = 0, z;
function E_(t, e) {
  return z = t.exports, Aa = null, Bs = null, z.__wbindgen_start(), z;
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
const Oa = dh({ core: null, initFailed: false });
function P_() {
  const t = vi(Oa);
  if (!t.core) throw t.initFailed ? new Error("Core init failed previously.") : new Error("Core not initialized. Call initCore() first.");
  return t.core;
}
function $_() {
  return vi(Oa).initFailed;
}
async function kp() {
  try {
    await I_({ module_or_path: "/me-ai/wasm/me_ai_core_bg.wasm" });
    const r = await new fs();
    await r.createSchemaAndMigrations(), Oa.set({ core: r, initFailed: false });
  } catch (t) {
    throw Oa.set({ core: null, initFailed: true }), t;
  }
}
function He() {
  return P_();
}
async function Sp() {
  return He().getEventTypes();
}
async function bi() {
  return He().getEventCategories();
}
async function Tp() {
  return He().getSources();
}
async function N_() {
  return He().getActions();
}
async function ws() {
  return He().getItemsCountGmail();
}
async function xi() {
  return He().getContactsCount();
}
async function Ap() {
  return He().getItemsDateMin();
}
async function Ep() {
  return He().getItemsDateMax();
}
async function yi() {
  return He().getEmailClassificationsCount();
}
async function vc(t) {
  return He().getSetting(t);
}
async function Cp(t, e) {
  return He().setSetting(t, e);
}
async function Ip(t) {
  return He().removeSetting(t);
}
async function Pp(t) {
  return He().getTableCount(t);
}
async function gc() {
  return He().clearAllData();
}
async function $p(t, e, r) {
  return He().getAuditLog(t, e, r);
}
async function Np() {
  return He().getAuditStats();
}
async function Rp() {
  return He().clearAuditLog();
}
async function Mp(t, e, r, n, a, o, i, l, c) {
  return He().logAuditExecution(t, e, r, n, a, o, i, l, c);
}
async function zp(t, e) {
  return He().syncAfterAuditExecution(t, e);
}
async function mc(t) {
  return He().getCategoryPipelineActions(t);
}
async function Op(t) {
  return He().getTypePipelineActions(t);
}
async function Dp(t) {
  return He().getEventTypeCategory(t);
}
async function Lp(t) {
  return He().getEventCategoryPolicy(t);
}
async function jp(t, e) {
  return He().updateCategoryPipeline(t, e);
}
async function Bp(t, e) {
  return He().updateCategoryPolicy(t, e);
}
async function Fp(t, e) {
  return He().updateEventTypeCategory(t, e);
}
async function Up(t) {
  return He().clearEventTypeCategory(t);
}
async function Gp(t) {
  return He().deleteEventType(t);
}
async function R_(t, e) {
  return He().setSourceEnabled(t, e);
}
async function Wp(t, e) {
  return He().setPluginEnabled(t, e);
}
async function M_(t, e, r, n) {
  return He().upsertEventType(t, e, r, n);
}
async function hc(t) {
  return He().deleteSyncState(t);
}
async function Vp(t) {
  return He().deleteItemsBySource(t);
}
async function Hp() {
  return He().clearContacts();
}
async function z_() {
  return He().clearItemsSyncContacts();
}
async function _c(t) {
  return He().getItemsCountBySource(t);
}
async function bc(t) {
  return He().getSyncState(t);
}
async function Qs(t, e, r, n, a) {
  return He().upsertSyncState(t, e, r, n, a);
}
async function xc(t) {
  return He().insertItemsBatch(t);
}
async function O_(t) {
  return He().insertSyncStateBatch(t);
}
async function D_(t) {
  return He().insertContactsBatch(t);
}
async function qp(t) {
  return He().deleteItemsByIds(t);
}
async function Yp(t) {
  return He().getContactByEmail(t);
}
async function bl(t, e, r, n) {
  return He().upsertContact(t, e, r, n);
}
async function Kp(t) {
  return He().getNewestSourceId(t);
}
async function Xp() {
  return He().getPlugins();
}
function Zp() {
  return He().getPluginRegistry();
}
function Jp(t) {
  return He().getAvailableActions(t);
}
function L_(t, e) {
  return He().getRequiredScopes(t, e);
}
function j_(t) {
  return He().resolvePluginId(t);
}
function Qp() {
  return He().getPluginsForPrompt();
}
async function ev(t, e, r, n, a) {
  return He().executePipeline(t, e, r, n, a);
}
async function B_(t, e, r, n, a) {
  return He().executePipelineBatch(t, e, r, n, a);
}
async function tv() {
  return He().getRules();
}
async function rv(t) {
  return He().getRule(t);
}
async function nv(t) {
  return He().saveRule(t);
}
async function F_(t) {
  return He().deleteRule(t);
}
async function U_(t, e) {
  return He().getEvents(t, e);
}
async function G_(t, e) {
  return He().updateEventStatus(t, e);
}
async function W_() {
  return He().clearEvents();
}
async function V_(t, e, r, n, a, o, i, l, c, f, v, x) {
  return He().insertEvent(t, e ?? void 0, r ?? void 0, n ?? void 0, a ?? 0, o ?? void 0, i ?? void 0, l ?? void 0, c ?? void 0, f ?? void 0, v ?? void 0, x ?? void 0);
}
async function lo(t) {
  return He().getItemById(t);
}
async function ps(t) {
  return He().getItemsGmailByDateDesc(t);
}
async function av(t, e, r) {
  return He().getItemsBySource(t, e, r);
}
async function ta(t, e) {
  return He().getEmailClassifications(t ?? void 0, e ?? void 0);
}
async function yc(t, e) {
  return He().updateEmailClassificationStatus(t, e);
}
async function sv() {
  return He().clearEmailClassifications();
}
async function ov(t) {
  return He().deleteEmailClassification(t);
}
async function iv(t) {
  return He().deleteEmailClassificationsByAction(t);
}
async function lv(t, e, r, n, a, o, i, l, c, f, v) {
  return He().putEmailClassification(t, e ?? void 0, r ?? void 0, n ?? void 0, a ?? void 0, o ?? void 0, i ?? void 0, l ?? void 0, c ?? void 0, f ?? void 0, v ?? void 0);
}
async function cv() {
  const t = {};
  for (const n of ["sm_rules", "sm_rule_triggers", "sm_rule_commands", "sm_events", "items", "emailClassifications", "contacts", "settings"]) try {
    t[n] = Number(await Pp(n)) ?? 0;
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
async function dv() {
  await gc();
}
function H_() {
  return He().getApiModels();
}
function xl(t) {
  return He().getApiModelInfo(t);
}
async function uv(t, e) {
  return He().testApiConnection(t, e);
}
async function fv(t, e, r, n, a) {
  return He().streamChat(t, e, r, n, a);
}
const pv = Object.freeze(Object.defineProperty({ __proto__: null, clearAllData: gc, clearAllDataAndCheckpoint: dv, clearAuditLog: Rp, clearContacts: Hp, clearEmailClassifications: sv, clearEventTypeCategory: Up, clearEvents: W_, clearItemsSyncContacts: z_, deleteEmailClassification: ov, deleteEmailClassificationsByAction: iv, deleteEventType: Gp, deleteItemsByIds: qp, deleteItemsBySource: Vp, deleteRule: F_, deleteSyncState: hc, executePipeline: ev, executePipelineBatch: B_, getActions: N_, getApiModelInfo: xl, getApiModels: H_, getAuditLog: $p, getAuditStats: Np, getAvailableActions: Jp, getCategoryPipelineActions: mc, getContactByEmail: Yp, getContactsCount: xi, getEmailClassifications: ta, getEmailClassificationsCount: yi, getEventCategories: bi, getEventCategoryPolicy: Lp, getEventTypeCategory: Dp, getEventTypes: Sp, getEvents: U_, getItemById: lo, getItemsBySource: av, getItemsCountBySource: _c, getItemsCountGmail: ws, getItemsDateMax: Ep, getItemsDateMin: Ap, getItemsGmailByDateDesc: ps, getNewestSourceId: Kp, getPluginRegistry: Zp, getPlugins: Xp, getPluginsForPrompt: Qp, getRequiredScopes: L_, getRule: rv, getRules: tv, getSetting: vc, getSources: Tp, getStorageStats: cv, getSyncState: bc, getTableCount: Pp, getTypePipelineActions: Op, initCore: kp, insertContactsBatch: D_, insertEvent: V_, insertItemsBatch: xc, insertSyncStateBatch: O_, isCoreInitFailed: $_, logAuditExecution: Mp, putEmailClassification: lv, removeSetting: Ip, resolvePluginId: j_, saveRule: nv, setPluginEnabled: Wp, setSetting: Cp, setSourceEnabled: R_, streamChat: fv, syncAfterAuditExecution: zp, testApiConnection: uv, updateCategoryPipeline: jp, updateCategoryPolicy: Bp, updateEmailClassificationStatus: yc, updateEventStatus: G_, updateEventTypeCategory: Fp, upsertContact: bl, upsertEventType: M_, upsertSyncState: Qs }, Symbol.toStringTag, { value: "Module" }));
async function vv() {
  await gc(), typeof window < "u" && window.location.reload();
}
async function q_() {
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
function gv(t, e) {
  return `${t}:${e}`;
}
function eo(t) {
  return JSON.stringify(t ?? null);
}
function ea(t, e) {
  if (t == null) return e;
  try {
    return JSON.parse(t);
  } catch {
    return e;
  }
}
async function mv() {
  const t = await Tp();
  return Array.isArray(t) ? t : [];
}
async function hv() {
  const t = await Xp();
  return Array.isArray(t) ? t : [];
}
async function _v() {
  return (await tv() ?? []).map((e) => ({ ...e, enabled: !!e.enabled, triggers: e.triggers ?? [], actions: e.actions ?? [] }));
}
async function bv(t) {
  const e = await rv(t);
  if (e == null || e === void 0) return null;
  const r = e;
  return { id: r.id, name: r.name, description: r.description ?? "", enabled: !!r.enabled, priority: r.priority ?? 5, created_at: r.created_at, triggers: r.triggers ?? [], actions: r.actions ?? [] };
}
async function xv(t, e) {
  const r = await bv(t);
  if (!r) return;
  const n = { ...r, ...e, triggers: e.triggers ?? r.triggers, actions: e.actions ?? r.actions }, a = { id: t, name: n.name, description: n.description ?? "", enabled: n.enabled, priority: n.priority ?? 5, created_at: n.created_at, triggers: n.triggers.map((o) => ({ type: o.type, name: o.name })), actions: n.actions.map((o) => ({ id: o.id, pluginId: o.pluginId, commandId: o.commandId, name: o.name, description: o.description, icon: o.icon ?? null })) };
  await nv(a);
}
async function wi() {
  const [t, e, r] = await Promise.all([ta(), bi(), Np()]), n = t ?? [], a = e ?? [], o = new Set(a.filter((v) => String(v.policy ?? "").toLowerCase() === "manual").map((v) => String(v.name ?? "").toLowerCase()));
  let i = 0, l = 0;
  for (const v of n) {
    const x = String(v.status ?? ""), m = String(v.category ?? "").toLowerCase();
    x === "pending" && o.has(m) ? i += 1 : x === "escalated" && (l += 1);
  }
  const c = Number((r == null ? void 0 : r.completed) ?? 0), f = Number((r == null ? void 0 : r.failed) ?? 0);
  return { awaiting_user: i, escalated: l, completed: c, failed: f, total: i + l + c + f };
}
async function wc({ limit: t = 100 } = {}) {
  const [e, r] = await Promise.all([ta(), bi()]), n = r ?? [], a = new Set(n.filter((c) => String(c.policy ?? "").toLowerCase() === "manual").map((c) => String(c.name ?? "").toLowerCase())), i = (e ?? []).filter((c) => c.status === "pending" && a.has(String(c.category ?? "").toLowerCase())).sort((c, f) => Number(f.date ?? 0) - Number(c.date ?? 0)).slice(0, t), l = [];
  for (const c of i) {
    const f = c.emailId ?? c.id;
    let v = null;
    f && typeof f == "string" && f.trim().length > 0 && f !== "null" && f !== "undefined" && (v = await lo(f));
    const x = (v == null ? void 0 : v.subject) ?? c.subject, m = (v == null ? void 0 : v.from) ?? c.from;
    l.push({ id: f, subject: x, source_name: m, content: (v == null ? void 0 : v.body) ?? "", timestamp: c.date ?? (v == null ? void 0 : v.date) ?? 0, event_category: c.category, event_type: c.action, reason: c.reason, summary: c.summary, status: c.status, sender: m, from: m, actions_taken: [], rule_name: `Manual Review: ${c.category}` });
  }
  return l;
}
async function yv(t) {
  const e = await ta(), r = t.trim().toLowerCase();
  return (e ?? []).filter((n) => {
    const a = String(n.category ?? "").trim().toLowerCase(), o = String(n.status ?? "");
    return a === r && (o === "pending" || o === "escalated");
  }).length;
}
async function wv(t, { limit: e = 500 } = {}) {
  const r = await ta(), n = t.trim().toLowerCase(), a = (r ?? []).filter((i) => {
    const l = String(i.category ?? "").trim().toLowerCase(), c = String(i.status ?? "");
    return l === n && (c === "pending" || c === "escalated");
  }).sort((i, l) => Number(l.date ?? 0) - Number(i.date ?? 0)).slice(0, e), o = [];
  for (const i of a) {
    const l = i.emailId ?? i.id;
    let c = null;
    l && typeof l == "string" && l.trim().length > 0 && l !== "null" && l !== "undefined" && (c = await lo(l)), o.push({ id: l ?? "", emailId: l ?? "", subject: i.subject ?? (c == null ? void 0 : c.subject) ?? "", from: i.from ?? (c == null ? void 0 : c.from) ?? "", eventType: i.action ?? "UNKNOWN", event_category: i.category ?? t, sourceType: (c == null ? void 0 : c.sourceType) ?? "gmail", status: i.status ?? "pending" });
  }
  return o;
}
async function kv(t) {
  await yc(t, "escalated");
}
async function kc(t, e) {
  return (await _v()).filter((a) => a.enabled).filter((a) => {
    const o = a.triggers.filter((f) => f.type === "event_type"), i = a.triggers.filter((f) => f.type === "event_category"), l = o.length === 0 || o.some((f) => f.name === t), c = i.length === 0 || i.some((f) => f.name === e);
    return l && c;
  }).sort((a, o) => o.priority - a.priority);
}
async function Sv(t) {
  var _a10;
  const e = ((_a10 = t == null ? void 0 : t.toUpperCase) == null ? void 0 : _a10.call(t).replace(/\s+/g, "_").replace(/[^A-Z0-9_]/g, "")) || "", [r, n] = await Promise.all([Op(e), Dp(e)]), a = n ?? "critical", i = await Lp(a) ?? "manual";
  return (r == null ? void 0 : r.length) > 0 ? { actions: r.map((c) => ({ pluginId: c.plugin_id, commandId: c.command_id, order: c.action_idx })), policy: i, category: a, isOverride: true } : { actions: (await mc(a) ?? []).map((c) => ({ pluginId: c.plugin_id, commandId: c.command_id, order: c.action_idx })), policy: i, category: a, isOverride: false };
}
async function Sc() {
  const [t, e] = await Promise.all([bi(), Sp()]), r = t ?? [], n = e ?? [], a = [];
  for (const o of r) {
    const i = o.name, l = await mc(i);
    a.push({ category: i, label: o.label ?? i, priority: o.priority ?? 0, policy: o.policy ?? "manual", actions: (l ?? []).map((c) => ({ pluginId: c.plugin_id, commandId: c.command_id, order: c.action_idx })), eventTypes: n.filter((c) => String(c.category_name ?? "") === i).map((c) => ({ name: c.name, label: c.label ?? c.name, autoCreated: c.auto_created ?? false })) });
  }
  return a;
}
async function Tv(t, e) {
  await jp(t, e);
}
async function Av(t, e) {
  await Bp(t, e);
}
async function Ev(t, e) {
  await Fp(t, e);
}
async function Cv(t) {
  await Up(t);
}
async function Iv(t) {
  await Gp(t);
}
async function Pv(t, e) {
  await Wp(t, e);
}
const Y_ = Object.freeze(Object.defineProperty({ __proto__: null, deleteEventType: Iv, findMatchingRules: kc, getCategoryPipelines: Sc, getEventStats: wi, getPendingApprovals: wc, getPendingCountByCategory: yv, getPendingItemsByCategory: wv, getPipelineForEvent: Sv, getPlugins: hv, getRule: bv, getRules: _v, getSources: mv, moveEventTypeToCategory: Ev, rejectClassification: kv, setPluginEnabled: Pv, unassignEventTypeFromCategory: Cv, updateCategoryPipeline: Tv, updateCategoryPolicy: Av, updateRule: xv }, Symbol.toStringTag, { value: "Module" })), K_ = /* @__PURE__ */ new Set(["trash", "delete", "mark_spam"]), X_ = /* @__PURE__ */ new Set(["archive"]);
async function $v({ emailId: t, subject: e, from: r, eventType: n, actions: a, results: o, success: i, error: l }) {
  const c = (o ?? []).map((f, v) => {
    var _a10, _b4, _c6, _d4;
    return { actionId: f.actionId ?? ((_a10 = a == null ? void 0 : a[v]) == null ? void 0 : _a10.id) ?? "", actionName: f.actionName ?? ((_b4 = a == null ? void 0 : a[v]) == null ? void 0 : _b4.name) ?? f.actionId ?? "", commandId: f.commandId ?? ((_c6 = a == null ? void 0 : a[v]) == null ? void 0 : _c6.commandId) ?? "", pluginId: f.pluginId ?? ((_d4 = a == null ? void 0 : a[v]) == null ? void 0 : _d4.pluginId) ?? "", success: f.success ?? false, message: f.message ?? "" };
  });
  await Mp(crypto.randomUUID(), t, e ?? "(no subject)", r ?? "", n, Date.now(), !!i, l ?? "", eo(c));
}
async function Nv(t, e) {
  if (!t) return;
  const r = (e ?? []).filter((i) => i.success).map((i) => i.commandId).filter(Boolean), n = r.some((i) => K_.has(i)), a = r.some((i) => X_.has(i));
  await zp(t, n || a);
}
async function Z_({ limit: t = 50, offset: e = 0, failuresOnly: r = false } = {}) {
  const n = await $p(t, e, r);
  return { entries: (n.entries ?? []).map((o) => ({ ...o, steps: ea(o.steps, []), success: !!o.success })), total: n.total ?? 0 };
}
async function J_() {
  await Rp();
}
const Q_ = "modulepreload", eb = function(t) {
  return "/me-ai/" + t;
}, vu = {}, wr = function(e, r, n) {
  let a = Promise.resolve();
  if (r && r.length > 0) {
    let i = function(f) {
      return Promise.all(f.map((v) => Promise.resolve(v).then((x) => ({ status: "fulfilled", value: x }), (x) => ({ status: "rejected", reason: x }))));
    };
    document.getElementsByTagName("link");
    const l = document.querySelector("meta[property=csp-nonce]"), c = (l == null ? void 0 : l.nonce) || (l == null ? void 0 : l.getAttribute("nonce"));
    a = i(r.map((f) => {
      if (f = eb(f), f in vu) return;
      vu[f] = true;
      const v = f.endsWith(".css"), x = v ? '[rel="stylesheet"]' : "";
      if (document.querySelector(`link[href="${f}"]${x}`)) return;
      const m = document.createElement("link");
      if (m.rel = v ? "stylesheet" : Q_, v || (m.as = "script"), m.crossOrigin = "", m.href = f, c && m.setAttribute("nonce", c), document.head.appendChild(m), v) return new Promise((y, h) => {
        m.addEventListener("load", y), m.addEventListener("error", () => h(new Error(`Unable to preload CSS for ${f}`)));
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
}, Rv = "me-ai-events", Mv = "me-ai-event-categories", Pn = { NOISE: { id: "NOISE", label: "Noise", description: "Unimportant messages that can be safely deleted automatically.", autoExecute: true, requiresApproval: false, color: "#6b7280" }, INFO: { id: "INFO", label: "Info", description: "Useful but not urgent \u2014 will be silently archived.", autoExecute: true, requiresApproval: false, color: "#3b82f6" }, CRITICAL: { id: "CRITICAL", label: "Critical", description: "Requires attention. User must review before any action runs.", autoExecute: false, requiresApproval: true, color: "#ef4444" } }, yl = "CRITICAL", tb = { noise: { name: "noise", label: "Noise", priority: 1, color: "#6b7280", policy: "auto" }, info: { name: "info", label: "Info", priority: 2, color: "#3b82f6", policy: "auto" }, critical: { name: "critical", label: "Critical", priority: 3, color: "#ef4444", policy: "manual" } };
function rb(t) {
  const e = (t || "").toUpperCase();
  return e === "NOISE" ? "noise" : e === "INFO" ? "info" : "critical";
}
async function Tc() {
  const { getSetting: t } = await wr(async () => {
    const { getSetting: e } = await Promise.resolve().then(() => un);
    return { getSetting: e };
  }, void 0);
  return await t(Rv) || {};
}
async function nb(t) {
  const { setSetting: e } = await wr(async () => {
    const { setSetting: r } = await Promise.resolve().then(() => un);
    return { setSetting: r };
  }, void 0);
  await e(Rv, t);
}
async function zv() {
  const { getSetting: t } = await wr(async () => {
    const { getSetting: e } = await Promise.resolve().then(() => un);
    return { getSetting: e };
  }, void 0);
  return await t(Mv) || {};
}
async function ab(t) {
  const { setSetting: e } = await wr(async () => {
    const { setSetting: r } = await Promise.resolve().then(() => un);
    return { setSetting: r };
  }, void 0);
  await e(Mv, t);
}
async function sb() {
  try {
    const { getEmailClassifications: t } = await wr(async () => {
      const { getEmailClassifications: n } = await Promise.resolve().then(() => pv);
      return { getEmailClassifications: n };
    }, void 0), e = await t();
    return [...new Set((e ?? []).map((n) => n.action).filter(Boolean))].sort();
  } catch {
    return [];
  }
}
async function ob() {
  const t = await Tc(), e = await sb();
  return [.../* @__PURE__ */ new Set([...Object.keys(t), ...e])].sort();
}
function ib(t) {
  const e = (t || "").toUpperCase();
  return e === "NOISE" ? "NOISE" : e === "INFO" || e === "INFORMATIONAL" ? "INFO" : e === "CRITICAL" || e === "IMPORTANT" || e === "URGENT" ? "CRITICAL" : yl;
}
async function co(t) {
  var _a10;
  const e = ((_a10 = t == null ? void 0 : t.toUpperCase) == null ? void 0 : _a10.call(t)) || "", r = await zv();
  return ib(r[e]);
}
async function ki(t) {
  var _a10, _b4;
  const e = ((_a10 = t == null ? void 0 : t.toUpperCase) == null ? void 0 : _a10.call(t).replace(/\s+/g, "_").replace(/[^A-Z0-9_]/g, "")) || "";
  if (!e) return [];
  const n = (await Tc())[e];
  if (Array.isArray(n) && n.length > 0) return n;
  const { getPipelineForEvent: a } = await wr(async () => {
    const { getPipelineForEvent: i } = await Promise.resolve().then(() => Y_);
    return { getPipelineForEvent: i };
  }, void 0), o = await a(t);
  return ((_b4 = o == null ? void 0 : o.actions) == null ? void 0 : _b4.length) ? o.actions.map((i, l) => ({ id: (i.commandId || "cmd") + "_" + l, pluginId: i.pluginId ?? "", commandId: i.commandId ?? "", name: (i.commandId ?? "").replace(/_/g, " "), description: "" })) : [];
}
async function lb(t, e, r) {
  const n = t.toUpperCase().replace(/\s+/g, "_").replace(/[^A-Z0-9_]/g, "");
  if (!n) return;
  const a = ["noise", "info", "critical"];
  let o = (e || "").toLowerCase().trim();
  a.includes(o) || (o === "noise" || e === "NOISE" ? o = "noise" : o === "informational" ? o = "info" : o = "critical");
  const i = o === "noise" ? "NOISE" : o === "info" ? "INFO" : "CRITICAL", l = await zv();
  n in l || (l[n] = i, await ab(l));
  try {
    const { upsertEventType: f } = await wr(async () => {
      const { upsertEventType: x } = await Promise.resolve().then(() => pv);
      return { upsertEventType: x };
    }, void 0), v = n.replace(/_/g, " ");
    await f(n, v, o, true);
  } catch (f) {
    console.warn("[events] Failed to persist event type in DB:", n, (f == null ? void 0 : f.message) ?? f);
  }
  const c = await Tc();
  n in c || (c[n] = [], await nb(c));
}
async function cb(t, e) {
  const r = t.categoryTier ?? await co(t.action), n = { type: t.action, source: "gmail", data: { subject: e.subject, from: e.from != null ? String(e.from) : void 0, date: e.date != null ? String(e.date) : void 0, snippet: e.snippet || (typeof e.body == "string" ? e.body.slice(0, 200) : "") || "" }, metadata: { reason: t.reason, summary: t.summary, tags: t.tags || [], category: r, classifiedAt: Date.now() } }, a = await ki(t.action);
  return { event: n, commands: a };
}
async function db(t) {
  return { role: "assistant", type: "event-batch", items: await Promise.all(t.filter((r) => r.success && r.classification && r.email).map(async (r) => {
    const { event: n, commands: a } = await cb(r.classification, r.email);
    return { event: n, commands: a };
  })), content: "" };
}
async function Co(t) {
  const e = await Promise.all(t.order.map(async (n) => {
    const a = t.categories[n] || [], o = await ki(n), i = await co(n), l = a.map((c) => ({ emailId: c.emailId, subject: c.subject || "(no subject)", from: c.from || "", date: c.date, summary: c.summary || "", reason: c.reason || "", tags: c.tags || [], status: c.status || "pending" }));
    return { eventType: n, category: i, emails: l, commands: o };
  })), r = e.reduce((n, a) => n + a.emails.length, 0);
  return { role: "assistant", type: "events-by-category", categories: e, total: r, content: "" };
}
const gu = "https://accounts.google.com/gsi/client", ub = "https://www.googleapis.com/auth/gmail.modify", Ac = "me-ai:oauth-token", Ec = "me-ai:oauth-token", Ho = 300 * 1e3;
let to = null, Ys = null, zn = 0;
function Ov(t, e) {
  try {
    localStorage.setItem(Ec, JSON.stringify({ access_token: t, expires_at: e }));
  } catch {
  }
}
function Dv() {
  try {
    localStorage.removeItem(Ec);
  } catch {
  }
}
function fb() {
  try {
    const t = localStorage.getItem(Ec);
    return t ? JSON.parse(t) : null;
  } catch {
    return null;
  }
}
async function Lv(t, e) {
  zn = Date.now() + e * 1e3, Ov(t, zn);
  try {
    const { setSetting: r } = await wr(async () => {
      const { setSetting: n } = await Promise.resolve().then(() => un);
      return { setSetting: n };
    }, void 0);
    await r(Ac, { access_token: t, expires_at: zn });
  } catch {
  }
}
async function wl() {
  zn = 0, Dv();
  try {
    const { removeSetting: t } = await wr(async () => {
      const { removeSetting: e } = await Promise.resolve().then(() => un);
      return { removeSetting: e };
    }, void 0);
    await t(Ac);
  } catch {
  }
}
async function _a() {
  const t = fb();
  if ((t == null ? void 0 : t.access_token) && Date.now() < t.expires_at - Ho) return zn = t.expires_at, { access_token: t.access_token };
  try {
    const { getSetting: e } = await wr(async () => {
      const { getSetting: o } = await Promise.resolve().then(() => un);
      return { getSetting: o };
    }, void 0), r = await e(Ac);
    if (!r) return Dv(), null;
    const { access_token: n, expires_at: a } = r;
    return !n || !a || Date.now() > a - Ho ? (await wl(), null) : (zn = a, Ov(n, a), { access_token: n });
  } catch {
    return await wl(), null;
  }
}
function Cc() {
  return zn > 0 && Date.now() < zn - Ho;
}
function kl() {
  return zn <= 0 ? 0 : Math.max(0, zn - Ho - Date.now());
}
function mu() {
  return new Promise((t, e) => {
    if (!to) {
      e(new Error("Google Auth not initialized."));
      return;
    }
    Ys = async (r) => {
      r.error ? e(new Error(r.error_description || r.error)) : (await Lv(r.access_token, r.expires_in), t({ access_token: r.access_token, expires_in: r.expires_in }));
    }, to.requestAccessToken({ prompt: "" });
  });
}
function pb() {
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
  await pb(), to = window.google.accounts.oauth2.initTokenClient({ client_id: t, scope: ub, callback: (e) => {
    Ys && (Ys(e), Ys = null);
  } });
}
function jv() {
  return new Promise((t, e) => {
    if (!to) {
      e(new Error("Google Auth not initialized. Call initGoogleAuth first."));
      return;
    }
    Ys = async (r) => {
      r.error ? e(new Error(r.error_description || r.error)) : (await Lv(r.access_token, r.expires_in), t({ access_token: r.access_token, expires_in: r.expires_in }));
    }, to.requestAccessToken();
  });
}
async function Bv(t) {
  return await wl(), new Promise((e) => {
    var _a10, _b4;
    ((_b4 = (_a10 = window.google) == null ? void 0 : _a10.accounts) == null ? void 0 : _b4.oauth2) ? window.google.accounts.oauth2.revoke(t, () => e()) : e();
  });
}
const vb = "me-ai-filesystem", Da = "handles", Ic = "rootDirectory";
function Pc() {
  return new Promise((t, e) => {
    const r = indexedDB.open(vb, 1);
    r.onerror = () => e(r.error), r.onsuccess = () => t(r.result), r.onupgradeneeded = () => {
      r.result.createObjectStore(Da, { keyPath: "key" });
    };
  });
}
async function qo() {
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
async function gb(t) {
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
async function mb() {
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
function hb(t) {
  const e = t.data ?? {}, r = e.path ?? e.filePath ?? e.file;
  return r != null ? String(r).trim() : null;
}
function hu(t) {
  const e = t.data ?? {}, r = e.content ?? e.text ?? e.body;
  return r != null ? String(r) : null;
}
async function Ki(t, e, r = false) {
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
async function _b(t, e, r) {
  const n = t.replace(/^filesystem:/, "").toLowerCase(), a = hb(e);
  try {
    switch (n) {
      case "read_file": {
        if (!a) return { success: false, message: "read_file requires path in event.data" };
        const i = await (await Ki(r, a, false)).getFile();
        return { success: true, message: "File read", data: { content: await i.text(), size: i.size } };
      }
      case "write_file": {
        if (!a) return { success: false, message: "write_file requires path in event.data" };
        const o = hu(e) ?? "", l = await (await Ki(r, a, true)).createWritable();
        return await l.write(o), await l.close(), { success: true, message: `Wrote ${o.length} bytes to ${a}` };
      }
      case "list_dir": {
        const i = await _u(r, a ?? ".", false), l = [];
        for await (const [c, f] of i) l.push({ name: c, kind: f.kind });
        return { success: true, message: `Listed ${l.length} entries`, data: { entries: l } };
      }
      case "create_file": {
        if (!a) return { success: false, message: "create_file requires path in event.data" };
        const o = hu(e) ?? "", l = await (await Ki(r, a, true)).createWritable();
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
async function Fv(t, e, r) {
  var _a10;
  const n = t.filter((y) => !ns(y)), a = t.filter((y) => ns(y));
  if (n.length > 0 && !((_a10 = await _a()) == null ? void 0 : _a10.access_token)) throw new Error("Not authenticated. Please sign in to Gmail first.");
  if (a.length > 0 && !await qo()) throw new Error("Choose a directory in Filesystem plugin settings.");
  const o = [], i = /* @__PURE__ */ new Map();
  if (n.length > 0) {
    const h = (await _a()).access_token, b = await ev(n, e, h, r);
    o.push(...b.results ?? []);
  }
  if (a.length > 0) {
    const y = await qo();
    if (y) for (let h = 0; h < t.length; h++) {
      const b = t[h];
      if (!ns(b)) continue;
      const w = await _b(b.commandId, e, y);
      i.set(h, { actionId: b.id, actionName: b.name, commandId: b.commandId, pluginId: b.pluginId, success: w.success, message: w.message });
    }
  }
  const l = [];
  let c = 0;
  for (let y = 0; y < t.length; y++) if (ns(t[y])) {
    const h = i.get(y);
    h ? l.push(h) : l.push({ success: false, message: "Filesystem action failed" });
  } else c < o.length && (l.push(o[c]), c++);
  const f = l.every((y) => y.success), v = l.filter((y) => y.success).map((y) => y.commandId ?? "").join(", "), x = l.filter((y) => !y.success).map((y) => `${y.commandId}: ${y.message ?? ""}`).join("; "), m = f ? `Successfully executed: ${v}` : `Pipeline failed: ${x}`;
  return { success: f, results: l, message: m };
}
async function uo(t, e, r = false, n = {}) {
  var _a10, _b4, _c6;
  try {
    e == null ? void 0 : e({ phase: "starting", event: t });
    const { actionsOverride: a } = n;
    let o = "INFO", i = false, l = [], c = "", f;
    if (a == null ? void 0 : a.length) l = bu(a), c = "manual", i = true, o = "CRITICAL";
    else {
      const h = (((_a10 = t.metadata) == null ? void 0 : _a10.category) || ((_b4 = t.data) == null ? void 0 : _b4.category) || "" || "").toString().toLowerCase().trim();
      if (f = (await kc(t.type, h))[0], f && (c = f.policy ?? "", c === "manual" ? (i = true, o = "CRITICAL") : c === "auto" ? o = "NOISE" : o = "INFO", l = (f.actions || []).map((w, D) => ({ id: (w.commandId || w.id) + "_" + D, pluginId: w.pluginId ?? "gmail", commandId: w.commandId ?? w.id, name: (w.name ?? w.commandId ?? "").replace(/_/g, " ") || "" }))), !(l == null ? void 0 : l.length)) {
        const w = await Sv(t.type);
        ((_c6 = w == null ? void 0 : w.actions) == null ? void 0 : _c6.length) && (c = w.policy ?? "manual", c === "manual" ? (i = true, o = "CRITICAL") : c === "auto" ? o = "NOISE" : o = "INFO", l = bu(w.actions));
      }
    }
    if (!(l == null ? void 0 : l.length)) return { success: true, message: f ? `No actions defined for rule: ${f.name}` : `No enabled pipeline rule or category pipeline matches event type: ${t.type}`, results: [] };
    if (e == null ? void 0 : e({ phase: "policy_check", category: o, policy: c }), i && !r) return { success: false, requiresApproval: true, category: o, actions: l, message: "This event type is CRITICAL \u2014 review the actions below and confirm before executing." };
    e == null ? void 0 : e({ phase: "pipeline_loaded", actions: l, actionCount: l.length });
    const v = await Fv(l, t, e), x = t.data, m = (x == null ? void 0 : x.emailId) ?? (x == null ? void 0 : x.id);
    return await Promise.all([$v({ emailId: m ?? "", subject: x == null ? void 0 : x.subject, from: x == null ? void 0 : x.from, eventType: t.type, actions: l, results: v.results ?? [], success: v.success }), Nv(m ?? "", v.results ?? [])]), e == null ? void 0 : e({ phase: "done", result: v }), v;
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
    let c = "INFO", f = false, v = [];
    if (l) l.policy === "manual" ? (f = true, c = "CRITICAL") : l.policy === "auto" ? c = "NOISE" : c = "INFO", v = l.actions || [];
    else return { success: true, message: `No enabled pipeline rule matches event type: ${t}`, results: [], total: 0, successful: 0, failed: 0 };
    if (f && !n) return { success: false, requiresApproval: true, category: c, actions: v, total: e.length, successful: 0, failed: 0, message: "This event type is CRITICAL \u2014 review the actions below and confirm before executing." };
    if (!(v == null ? void 0 : v.length)) return { success: true, message: `No actions defined for rule: ${l.name}`, results: [], total: 0, successful: 0, failed: 0 };
    if (v.some((F) => !ns(F)) && !((_c6 = await _a()) == null ? void 0 : _c6.access_token)) throw new Error("Not authenticated. Please sign in to Gmail first.");
    if (v.some(ns) && !await qo()) throw new Error("Choose a directory in Filesystem plugin settings.");
    r == null ? void 0 : r({ phase: "pipeline_loaded", actions: v, actionCount: v.length });
    const y = v.map((F, B) => ({ id: (F.commandId ?? F.id) + "_" + B, pluginId: F.pluginId ?? "gmail", commandId: F.commandId ?? F.id ?? "", name: (F.name ?? F.commandId ?? "").replace(/_/g, " ") || "" })), h = [];
    for (let F = 0; F < e.length; F++) {
      const B = e[F], M = { type: t, source: "gmail", data: B };
      r == null ? void 0 : r({ phase: "batch_event", eventIndex: F, totalEvents: e.length, event: M });
      const Z = await Fv(y, M, r);
      h.push({ event: M, results: Z.results, success: Z.success, message: Z.message });
    }
    await Promise.all(h.map(async (F) => {
      var _a11;
      const B = (_a11 = F.event) == null ? void 0 : _a11.data, M = (B == null ? void 0 : B.emailId) ?? (B == null ? void 0 : B.id);
      await Promise.all([$v({ emailId: M ?? "", subject: B == null ? void 0 : B.subject, from: B == null ? void 0 : B.from, eventType: t, actions: v, results: F.results ?? [], success: F.success ?? false }), Nv(M ?? "", F.results ?? [])]);
    }));
    const b = h.filter((F) => F.success).length, w = h.length - b, D = { success: w === 0, results: h, total: h.length, successful: b, failed: w, message: `Processed ${h.length} event(s): ${b} successful, ${w} failed` };
    return r == null ? void 0 : r({ phase: "done", result: D }), D;
  } catch (a) {
    const o = a;
    return r == null ? void 0 : r({ phase: "error", error: o.message }), { success: false, error: a, message: o.message || "Unknown error", total: e.length, successful: 0, failed: e.length };
  }
}
function Nc(t) {
  const e = Jp(t);
  return Array.isArray(e) ? e : [];
}
async function Yo() {
  var _a10;
  return !!((_a10 = await _a()) == null ? void 0 : _a10.access_token);
}
const bb = Object.freeze(Object.defineProperty({ __proto__: null, EVENT_CATEGORY_TIERS: Pn, executePipeline: uo, executePipelineBatch: $c, getAvailableActions: Nc, isAuthenticated: Yo }, Symbol.toStringTag, { value: "Module" }));
function Tl(t) {
  if (t === 0) return "0 B";
  const e = 1024, r = ["B", "KB", "MB", "GB"], n = Math.floor(Math.log(t) / Math.log(e));
  return (t / Math.pow(e, n)).toFixed(1) + " " + r[n];
}
function Xi(t) {
  if (t === 0) return "0 B";
  const e = 1024, r = ["B", "KB", "MB", "GB"], n = Math.floor(Math.log(t) / Math.log(e)), a = t / Math.pow(e, n), o = n >= 2 ? 2 : n >= 1 ? 1 : 0;
  return a.toFixed(o) + " " + r[n];
}
function xb(t, e) {
  return !e || e <= 0 ? null : Math.min(100, t / e * 100);
}
function yb(t, e) {
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
function Uv(t) {
  if (!t) return "Unknown";
  const e = t.match(/^"?([^"<]+)"?\s*</);
  return e ? e[1].trim() : t.split("@")[0];
}
function wb(t) {
  return Uv(t).charAt(0).toUpperCase();
}
function kb(t) {
  try {
    const e = new Date(t), r = e.getFullYear(), n = String(e.getMonth() + 1).padStart(2, "0"), a = String(e.getDate()).padStart(2, "0");
    return `${r}-${n}-${a}`;
  } catch {
    return "email";
  }
}
function Sb(t) {
  return (t || "email").replace(/[^a-zA-Z0-9 _-]/g, "").replace(/\s+/g, "-").slice(0, 60).replace(/-+$/, "");
}
function Gv(t, e) {
  return `${kb(t.date)}_${Sb(t.subject)}.${e}`;
}
function Wv(t) {
  const e = {};
  for (const n of t) {
    const a = n.action || "UNKNOWN";
    e[a] || (e[a] = []), e[a].push(n);
  }
  for (const n of Object.keys(e)) e[n].sort((a, o) => (o.date || 0) - (a.date || 0));
  const r = Object.keys(e).sort((n, a) => e[a].length - e[n].length);
  return { categories: e, order: r };
}
const Ko = [{ label: "GPT-OSS", models: [{ id: "onnx-community/gpt-oss-20b-ONNX", name: "20B", size: "~12 GB", contextWindow: 131072, maxEmailTokens: 16e3, description: "OpenAI open-source, 128k context, built-in reasoning", gpuWarning: "Requires powerful GPU (12 GB+ VRAM). ~12 GB download.", isExperimental: true, recommendedForEmailProcessing: true }] }, { label: "Qwen 3.5", models: [{ id: "onnx-community/Qwen3.5-0.8B-ONNX", name: "0.8B", size: "~647 MB", contextWindow: 262144, maxEmailTokens: 4e3, description: "Fastest, 256k context, hybrid attention" }, { id: "onnx-community/Qwen3.5-2B-ONNX", name: "2B", size: "~1.6 GB", contextWindow: 262144, maxEmailTokens: 6e3, description: "Balanced speed and quality, 256k context", recommendedForEmailProcessing: true }, { id: "onnx-community/Qwen3.5-4B-ONNX", name: "4B", size: "~3 GB", contextWindow: 262144, maxEmailTokens: 12e3, description: "Best reasoning, 256k context", recommendedForEmailProcessing: true, gpuWarning: "Requires good GPU (8 GB+ VRAM recommended)" }] }], On = Ko.flatMap((t) => t.models);
function Si(t) {
  return On.find((e) => e.id === t);
}
const Tb = Object.freeze(Object.defineProperty({ __proto__: null, MODELS: On, MODEL_GROUPS: Ko, getModelInfo: Si }, Symbol.toStringTag, { value: "Module" })), yn = [{ name: "qwen3:4b", displayName: "Qwen3 4B", params: "4B", contextWindow: 131072, maxEmailTokens: 1e5, description: "Latest Qwen, 128k context, enhanced reasoning", tags: ["multilingual", "reasoning", "general"], recommended: true, recommendedForEmailProcessing: true }, { name: "qwen3:8b", displayName: "Qwen3 8B", params: "8B", contextWindow: 131072, maxEmailTokens: 1e5, description: "Powerful reasoning, 128k context, 100+ languages", tags: ["multilingual", "reasoning", "advanced"], recommended: true, recommendedForEmailProcessing: true }, { name: "qwen3:14b", displayName: "Qwen3 14B", params: "14B", contextWindow: 131072, maxEmailTokens: 1e5, description: "Most capable Qwen3, best for complex tasks", tags: ["multilingual", "reasoning", "advanced"], recommended: true, recommendedForEmailProcessing: true }, { name: "ministral-3:3b", displayName: "Ministral 3 3B", params: "3B", contextWindow: 262144, maxEmailTokens: 2e5, description: "Mistral's smallest, 256k context, Apache 2.0", tags: ["fast", "long-context", "efficient"], recommended: true, recommendedForEmailProcessing: true }, { name: "ministral-3:8b", displayName: "Ministral 3 8B", params: "8B", contextWindow: 262144, maxEmailTokens: 2e5, description: "Balanced performance, 256k context, vision capable", tags: ["general", "long-context", "vision"], recommended: true, recommendedForEmailProcessing: true }, { name: "ministral-3:14b", displayName: "Ministral 3 14B", params: "14B", contextWindow: 262144, maxEmailTokens: 2e5, description: "Most capable Ministral, 256k context, function calling", tags: ["advanced", "long-context", "vision"], recommended: true, recommendedForEmailProcessing: true }, { name: "gpt-oss:20b", displayName: "GPT-OSS 20B", params: "20B", contextWindow: 131072, maxEmailTokens: 1e5, description: "OpenAI's open model, strong reasoning, Apache 2.0", tags: ["reasoning", "cot", "openai"], recommended: true, recommendedForEmailProcessing: true }, { name: "gemma3:4b", displayName: "Gemma3 4B", params: "4B", contextWindow: 131072, maxEmailTokens: 1e5, description: "Google, 128k context, multimodal (text + images)", tags: ["multimodal", "vision", "multilingual"], recommended: true, recommendedForEmailProcessing: true }, { name: "gemma3:12b", displayName: "Gemma3 12B", params: "12B", contextWindow: 131072, maxEmailTokens: 1e5, description: "Powerful multimodal, 128k context, 140+ languages", tags: ["multimodal", "vision", "multilingual", "advanced"], recommended: true, recommendedForEmailProcessing: true }, { name: "gemma3n:e2b", displayName: "Gemma3N E2B", params: "2B effective", contextWindow: 32768, maxEmailTokens: 25e3, description: "Efficient 2B, multimodal, MatFormer architecture", tags: ["efficient", "multimodal", "fast"], recommendedForEmailProcessing: false }, { name: "gemma3n:e4b", displayName: "Gemma3N E4B", params: "4B effective", contextWindow: 32768, maxEmailTokens: 25e3, description: "Efficient 4B, multimodal, selective parameter activation", tags: ["efficient", "multimodal", "balanced"], recommendedForEmailProcessing: false }, { name: "deepseek-r1:7b", displayName: "DeepSeek R1 7B", params: "7B", contextWindow: 65536, maxEmailTokens: 5e4, description: "Strong chain-of-thought reasoning, research-focused", tags: ["reasoning", "cot"], recommended: true, recommendedForEmailProcessing: true }, { name: "deepseek-r1:14b", displayName: "DeepSeek R1 14B", params: "14B", contextWindow: 65536, maxEmailTokens: 5e4, description: "Advanced CoT reasoning, slower but thorough", tags: ["reasoning", "cot", "advanced"], recommended: true, recommendedForEmailProcessing: true }];
function Vv() {
  return yn.filter((t) => t.recommended);
}
function zc(t) {
  return yn.find((e) => e.name === t || e.name.startsWith(t + ":"));
}
const Ab = Object.freeze(Object.defineProperty({ __proto__: null, OLLAMA_MODELS: yn, getOllamaModelInfo: zc, getRecommendedOllamaModels: Vv }, Symbol.toStringTag, { value: "Module" })), Eb = 20, Hv = { maxTokens: 2048, enableThinking: false, doSample: false };
function qv(t) {
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
function Yv() {
  const t = Qp();
  return Array.isArray(t) ? t.map((e) => ({ pluginId: e.plugin_id ?? "", pluginName: e.pluginName ?? "", actions: (e.actions ?? []).map((r) => ({ actionId: r.actionId ?? "" })) })) : [];
}
function Cb() {
  return qv(Yv());
}
async function Kv(t, e = {}) {
  const { count: r = Eb, force: n = false, onProgress: a = () => {
  }, signal: o } = e;
  if (!t.isReady) throw new Error("Model not loaded. Please load a model first.");
  a({ phase: "loading", message: "Loading recent emails..." });
  let i, l = 0;
  if (n) i = (await ps(r)).map((J) => xu(J));
  else {
    const [$, J] = await Promise.all([ps(5e3), ta(null, 5e3)]), W = new Set((J ?? []).map((C) => C.emailId).filter(Boolean));
    i = ($ ?? []).filter((C) => !W.has(C.id)).slice(0, r).map((C) => xu(C)), l = Number(await yi() ?? 0);
  }
  if (i.length === 0) {
    const $ = n ? "No emails to scan." : `All emails already classified (${l} total). Use "Rescan All" to reclassify.`;
    return a({ phase: "done", message: $, classified: 0 }), { scanned: 0, classified: 0, skipped: l, errors: 0 };
  }
  const c = Date.now(), f = performance.now();
  let v = 0, x = 0, m = 0, y = 0;
  const h = [], b = Yv(), w = qv(b), D = new Set(b.flatMap(($) => $.actions.map((J) => J.actionId))), F = t.modelId, B = Si(F ?? "") ?? zc(F ?? "");
  if (!B) throw new Error(`Unknown model: ${F}`);
  const M = B.displayName ?? B.name;
  if (!B.recommendedForEmailProcessing && i.length > 0) {
    const { MODELS: $ } = await wr(async () => {
      const { MODELS: C } = await Promise.resolve().then(() => Tb);
      return { MODELS: C };
    }, void 0), { OLLAMA_MODELS: J } = await wr(async () => {
      const { OLLAMA_MODELS: C } = await Promise.resolve().then(() => Ab);
      return { OLLAMA_MODELS: C };
    }, void 0), W = [...$.filter((C) => C.recommendedForEmailProcessing).map((C) => C.name), ...J.filter((C) => C.recommendedForEmailProcessing).map((C) => C.displayName)];
    console.warn(`\u26A0\uFE0F Current model (${M}) is not optimized for email processing. For best results with long emails, use: ${W.join(", ")}. Some emails may fail due to memory limits.`);
  }
  for (let $ = 0; $ < i.length && !(o == null ? void 0 : o.aborted); $++) {
    const J = i[$], W = Jv(J), C = [{ role: "system", content: w }, { role: "user", content: W }];
    a({ phase: "scanning", current: $ + 1, total: i.length, classified: v, errors: x, results: h, email: { subject: J.subject, from: J.from, date: J.date != null ? String(J.date) : void 0 }, prompt: { system: w, user: W }, systemPromptLength: w.length, live: null, lastResult: null, totals: { outputTokens: m, inputTokens: y, elapsed: performance.now() - f } });
    const A = performance.now();
    try {
      const { text: k, tps: N, numTokens: O, inputTokens: Y } = await t.generateFull(C, { maxTokens: Hv.maxTokens, enableThinking: false, temperature: 0 }, (ne) => {
        a({ phase: "generating", current: $ + 1, total: i.length, classified: v, errors: x, results: h, email: { subject: J.subject, from: J.from, date: J.date != null ? String(J.date) : void 0 }, live: { tps: ne.tps, numTokens: ne.numTokens }, streamingText: ne.text || "", totals: { outputTokens: m, inputTokens: y, elapsed: performance.now() - f } });
      });
      m += O, y += Y;
      const V = $b(k, D), q = performance.now() - A;
      if (V) {
        await lv(J.id, V.action, V.categoryTier, V.reason, V.summary, eo(V.tags), J.subject || "(no subject)", J.from || "", J.date ?? null, c, "pending"), await lb(V.action, V.category, V.suggestedActions), v++;
        const ne = { success: true, email: { subject: J.subject, from: J.from, date: J.date }, classification: V, rawResponse: k, stats: { tps: N, numTokens: O, inputTokens: Y, elapsed: q }, promptSize: W.length };
        h.push(ne), a({ phase: "classified", current: $ + 1, total: i.length, classified: v, errors: x, results: h, email: { subject: J.subject, from: J.from, date: J.date != null ? String(J.date) : void 0 }, result: V, rawResponse: k, emailStats: { tps: N, numTokens: O, inputTokens: Y, elapsed: q }, totals: { outputTokens: m, inputTokens: y, elapsed: performance.now() - f } });
      }
    } catch (k) {
      const N = k instanceof Error ? k : new Error(String(k));
      console.error(`Triage email ${$ + 1} failed:`, N), x++;
      const O = N.message, Y = O.length > 200 ? O.slice(0, 200) + "..." : O;
      h.push({ success: false, email: { subject: J.subject, from: J.from, date: J.date }, error: Y, promptSize: W.length });
    }
  }
  const Z = performance.now() - f, U = h.length > 0 ? Math.round(h.reduce(($, J) => $ + (J.promptSize ?? 0), 0) / h.length) : 0, P = h.filter(($) => {
    var _a10;
    return $.success && ((_a10 = $.stats) == null ? void 0 : _a10.tps);
  }), E = P.length > 0 ? Math.round(P.reduce(($, J) => {
    var _a10;
    return $ + (((_a10 = J.stats) == null ? void 0 : _a10.tps) ?? 0);
  }, 0) / P.length) : null, S = B;
  return a({ phase: "done", current: i.length, total: i.length, classified: v, errors: x, results: h, summary: { avgPromptSize: U, avgTps: E, systemPromptSize: w.length, processed: i.length, skipped: l, modelName: S.displayName ?? S.name, modelContextWindow: S.contextWindow, modelMaxEmailTokens: S.maxEmailTokens }, totals: { outputTokens: m, inputTokens: y, elapsed: Z } }), { scanned: i.length, classified: v, skipped: l, errors: x };
}
async function as(t = {}) {
  let r = (await ta(null, 5e3) ?? []).map((n) => Pb(n));
  return t.pendingOnly === true && (r = r.filter((n) => n.status === "pending" || n.status === "escalated")), Wv(r);
}
async function Xv() {
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
async function Ib() {
  await sv();
}
async function Oc(t) {
  await iv(t);
}
async function Zv(t) {
  await ov(t);
}
async function Al() {
  const [t, e] = await Promise.all([ws().then((r) => Number(r ?? 0)), yi().then((r) => Number(r ?? 0))]);
  return { totalEmails: t, classified: e, unclassified: Math.max(0, t - e) };
}
function xu(t) {
  return { ...t, date: t.date != null ? Number(t.date) : null, syncedAt: t.syncedAt != null ? Number(t.syncedAt) : null, labels: ea(String(t.labels ?? ""), []), raw: ea(t.raw != null ? String(t.raw) : null, null) };
}
function Pb(t) {
  return { ...t, date: t.date != null ? Number(t.date) : null, scannedAt: t.scannedAt != null ? Number(t.scannedAt) : null, tags: ea(t.tags != null ? String(t.tags) : null, []) };
}
function Jv(t) {
  const e = t.date != null ? new Date(t.date).toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric" }) : "Unknown date", r = t.body ?? t.snippet ?? "";
  return [`Subject: ${t.subject}`, `From: ${t.from}`, `To: ${t.to ?? "me"}`, `Date: ${e}`, `Labels: ${(t.labels ?? []).join(", ")}`, "", r].join(`
`);
}
function $b(t, e) {
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
    const v = Nb(f);
    if (!v) return console.warn("Triage: missing or invalid action field"), null;
    if (v.length > 50 || /POSTGRES|SSLMODE|REQUIRE|CONNECTION/.test(v)) return console.warn("Triage: action rejected as jargon:", v.slice(0, 40)), null;
    const x = ["noise", "info", "critical"], m = String(c.category ?? "").toLowerCase().trim(), y = c.categoryTier;
    let h;
    x.includes(m) ? h = m : m === "noise" || y === "NOISE" ? h = "noise" : m === "informational" ? h = "info" : h = "critical";
    const b = h === "noise" ? "NOISE" : h === "info" ? "INFO" : "CRITICAL", w = [];
    let D = [];
    Array.isArray(c.tags) && (D = c.tags.filter((Z) => typeof Z == "string" && Z.trim().length > 0).map((Z) => Z.trim().toLowerCase()).slice(0, 10));
    const F = (Z) => {
      let U = String(Z ?? "").trim();
      return U = U.replace(/\bpostgres[-\s]?sslmode\s*=\s*require\b/gi, ""), U = U.replace(/\s*--set\s+/gi, " ").replace(/\s{2,}/g, " ").trim(), U.slice(0, 500);
    }, B = F(c.reason).slice(0, 300), M = F(c.summary).slice(0, 500);
    return { action: v, category: h, categoryTier: b, suggestedActions: w, reason: B, summary: M, tags: D };
  } catch (c) {
    return console.warn("Triage: failed to parse JSON response:", c instanceof Error ? c.message : c), null;
  }
}
function Nb(t) {
  return !t || typeof t != "string" ? null : t.trim().toUpperCase().replace(/[\s-]+/g, "_").replace(/[^A-Z0-9_]/g, "") || null;
}
function Xo(t) {
  return `hsl(${Rc(t)}, 55%, 55%)`;
}
function Rb(t) {
  return `hsl(${Rc(t)}, 40%, 35%)`;
}
const Mb = (t, e) => {
  const r = new Array(t.length + e.length);
  for (let n = 0; n < t.length; n++) r[n] = t[n];
  for (let n = 0; n < e.length; n++) r[t.length + n] = e[n];
  return r;
}, zb = (t, e) => ({ classGroupId: t, validator: e }), Qv = (t = /* @__PURE__ */ new Map(), e = null, r) => ({ nextPart: t, validators: e, classGroupId: r }), Zo = "-", yu = [], Ob = "arbitrary..", Db = (t) => {
  const e = jb(t), { conflictingClassGroups: r, conflictingClassGroupModifiers: n } = t;
  return { getClassGroupId: (i) => {
    if (i.startsWith("[") && i.endsWith("]")) return Lb(i);
    const l = i.split(Zo), c = l[0] === "" && l.length > 1 ? 1 : 0;
    return eg(l, c, e);
  }, getConflictingClassGroupIds: (i, l) => {
    if (l) {
      const c = n[i], f = r[i];
      return c ? f ? Mb(f, c) : c : f || yu;
    }
    return r[i] || yu;
  } };
}, eg = (t, e, r) => {
  if (t.length - e === 0) return r.classGroupId;
  const a = t[e], o = r.nextPart.get(a);
  if (o) {
    const f = eg(t, e + 1, o);
    if (f) return f;
  }
  const i = r.validators;
  if (i === null) return;
  const l = e === 0 ? t.join(Zo) : t.slice(e).join(Zo), c = i.length;
  for (let f = 0; f < c; f++) {
    const v = i[f];
    if (v.validator(l)) return v.classGroupId;
  }
}, Lb = (t) => t.slice(1, -1).indexOf(":") === -1 ? void 0 : (() => {
  const e = t.slice(1, -1), r = e.indexOf(":"), n = e.slice(0, r);
  return n ? Ob + n : void 0;
})(), jb = (t) => {
  const { theme: e, classGroups: r } = t;
  return Bb(r, e);
}, Bb = (t, e) => {
  const r = Qv();
  for (const n in t) {
    const a = t[n];
    Dc(a, r, n, e);
  }
  return r;
}, Dc = (t, e, r, n) => {
  const a = t.length;
  for (let o = 0; o < a; o++) {
    const i = t[o];
    Fb(i, e, r, n);
  }
}, Fb = (t, e, r, n) => {
  if (typeof t == "string") {
    Ub(t, e, r);
    return;
  }
  if (typeof t == "function") {
    Gb(t, e, r, n);
    return;
  }
  Wb(t, e, r, n);
}, Ub = (t, e, r) => {
  const n = t === "" ? e : tg(e, t);
  n.classGroupId = r;
}, Gb = (t, e, r, n) => {
  if (Vb(t)) {
    Dc(t(n), e, r, n);
    return;
  }
  e.validators === null && (e.validators = []), e.validators.push(zb(r, t));
}, Wb = (t, e, r, n) => {
  const a = Object.entries(t), o = a.length;
  for (let i = 0; i < o; i++) {
    const [l, c] = a[i];
    Dc(c, tg(e, l), r, n);
  }
}, tg = (t, e) => {
  let r = t;
  const n = e.split(Zo), a = n.length;
  for (let o = 0; o < a; o++) {
    const i = n[o];
    let l = r.nextPart.get(i);
    l || (l = Qv(), r.nextPart.set(i, l)), r = l;
  }
  return r;
}, Vb = (t) => "isThemeGetter" in t && t.isThemeGetter === true, Hb = (t) => {
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
}, El = "!", wu = ":", qb = [], ku = (t, e, r, n, a) => ({ modifiers: t, hasImportantModifier: e, baseClassName: r, maybePostfixModifierPosition: n, isExternal: a }), Yb = (t) => {
  const { prefix: e, experimentalParseClassName: r } = t;
  let n = (a) => {
    const o = [];
    let i = 0, l = 0, c = 0, f;
    const v = a.length;
    for (let b = 0; b < v; b++) {
      const w = a[b];
      if (i === 0 && l === 0) {
        if (w === wu) {
          o.push(a.slice(c, b)), c = b + 1;
          continue;
        }
        if (w === "/") {
          f = b;
          continue;
        }
      }
      w === "[" ? i++ : w === "]" ? i-- : w === "(" ? l++ : w === ")" && l--;
    }
    const x = o.length === 0 ? a : a.slice(c);
    let m = x, y = false;
    x.endsWith(El) ? (m = x.slice(0, -1), y = true) : x.startsWith(El) && (m = x.slice(1), y = true);
    const h = f && f > c ? f - c : void 0;
    return ku(o, y, m, h);
  };
  if (e) {
    const a = e + wu, o = n;
    n = (i) => i.startsWith(a) ? o(i.slice(a.length)) : ku(qb, false, i, void 0, true);
  }
  if (r) {
    const a = n;
    n = (o) => r({ className: o, parseClassName: a });
  }
  return n;
}, Kb = (t) => {
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
}, Xb = (t) => ({ cache: Hb(t.cacheSize), parseClassName: Yb(t), sortModifiers: Kb(t), ...Db(t) }), Zb = /\s+/, Jb = (t, e) => {
  const { parseClassName: r, getClassGroupId: n, getConflictingClassGroupIds: a, sortModifiers: o } = e, i = [], l = t.trim().split(Zb);
  let c = "";
  for (let f = l.length - 1; f >= 0; f -= 1) {
    const v = l[f], { isExternal: x, modifiers: m, hasImportantModifier: y, baseClassName: h, maybePostfixModifierPosition: b } = r(v);
    if (x) {
      c = v + (c.length > 0 ? " " + c : c);
      continue;
    }
    let w = !!b, D = n(w ? h.substring(0, b) : h);
    if (!D) {
      if (!w) {
        c = v + (c.length > 0 ? " " + c : c);
        continue;
      }
      if (D = n(h), !D) {
        c = v + (c.length > 0 ? " " + c : c);
        continue;
      }
      w = false;
    }
    const F = m.length === 0 ? "" : m.length === 1 ? m[0] : o(m).join(":"), B = y ? F + El : F, M = B + D;
    if (i.indexOf(M) > -1) continue;
    i.push(M);
    const Z = a(D, w);
    for (let U = 0; U < Z.length; ++U) {
      const P = Z[U];
      i.push(B + P);
    }
    c = v + (c.length > 0 ? " " + c : c);
  }
  return c;
}, Qb = (...t) => {
  let e = 0, r, n, a = "";
  for (; e < t.length; ) (r = t[e++]) && (n = rg(r)) && (a && (a += " "), a += n);
  return a;
}, rg = (t) => {
  if (typeof t == "string") return t;
  let e, r = "";
  for (let n = 0; n < t.length; n++) t[n] && (e = rg(t[n])) && (r && (r += " "), r += e);
  return r;
}, Cl = (t, ...e) => {
  let r, n, a, o;
  const i = (c) => {
    const f = e.reduce((v, x) => x(v), t());
    return r = Xb(f), n = r.cache.get, a = r.cache.set, o = l, l(c);
  }, l = (c) => {
    const f = n(c);
    if (f) return f;
    const v = Jb(c, r);
    return a(c, v), v;
  };
  return o = i, (...c) => o(Qb(...c));
}, ex = [], vr = (t) => {
  const e = (r) => r[t] || ex;
  return e.isThemeGetter = true, e;
}, ng = /^\[(?:(\w[\w-]*):)?(.+)\]$/i, ag = /^\((?:(\w[\w-]*):)?(.+)\)$/i, tx = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/, rx = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, nx = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, ax = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, sx = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, ox = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, ia = (t) => tx.test(t), ht = (t) => !!t && !Number.isNaN(Number(t)), la = (t) => !!t && Number.isInteger(Number(t)), Zi = (t) => t.endsWith("%") && ht(t.slice(0, -1)), Fn = (t) => rx.test(t), sg = () => true, ix = (t) => nx.test(t) && !ax.test(t), Lc = () => false, lx = (t) => sx.test(t), cx = (t) => ox.test(t), dx = (t) => !Xe(t) && !Ze(t), ux = (t) => xa(t, lg, Lc), Xe = (t) => ng.test(t), Sa = (t) => xa(t, cg, ix), Su = (t) => xa(t, bx, ht), fx = (t) => xa(t, ug, sg), px = (t) => xa(t, dg, Lc), Tu = (t) => xa(t, og, Lc), vx = (t) => xa(t, ig, cx), Io = (t) => xa(t, fg, lx), Ze = (t) => ag.test(t), Es = (t) => Wa(t, cg), gx = (t) => Wa(t, dg), Au = (t) => Wa(t, og), mx = (t) => Wa(t, lg), hx = (t) => Wa(t, ig), Po = (t) => Wa(t, fg, true), _x = (t) => Wa(t, ug, true), xa = (t, e, r) => {
  const n = ng.exec(t);
  return n ? n[1] ? e(n[1]) : r(n[2]) : false;
}, Wa = (t, e, r = false) => {
  const n = ag.exec(t);
  return n ? n[1] ? e(n[1]) : r : false;
}, og = (t) => t === "position" || t === "percentage", ig = (t) => t === "image" || t === "url", lg = (t) => t === "length" || t === "size" || t === "bg-size", cg = (t) => t === "length", bx = (t) => t === "number", dg = (t) => t === "family-name", ug = (t) => t === "number" || t === "weight", fg = (t) => t === "shadow", Il = () => {
  const t = vr("color"), e = vr("font"), r = vr("text"), n = vr("font-weight"), a = vr("tracking"), o = vr("leading"), i = vr("breakpoint"), l = vr("container"), c = vr("spacing"), f = vr("radius"), v = vr("shadow"), x = vr("inset-shadow"), m = vr("text-shadow"), y = vr("drop-shadow"), h = vr("blur"), b = vr("perspective"), w = vr("aspect"), D = vr("ease"), F = vr("animate"), B = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], M = () => ["center", "top", "bottom", "left", "right", "top-left", "left-top", "top-right", "right-top", "bottom-right", "right-bottom", "bottom-left", "left-bottom"], Z = () => [...M(), Ze, Xe], U = () => ["auto", "hidden", "clip", "visible", "scroll"], P = () => ["auto", "contain", "none"], E = () => [Ze, Xe, c], S = () => [ia, "full", "auto", ...E()], $ = () => [la, "none", "subgrid", Ze, Xe], J = () => ["auto", { span: ["full", la, Ze, Xe] }, la, Ze, Xe], W = () => [la, "auto", Ze, Xe], C = () => ["auto", "min", "max", "fr", Ze, Xe], A = () => ["start", "end", "center", "between", "around", "evenly", "stretch", "baseline", "center-safe", "end-safe"], k = () => ["start", "end", "center", "stretch", "center-safe", "end-safe"], N = () => ["auto", ...E()], O = () => [ia, "auto", "full", "dvw", "dvh", "lvw", "lvh", "svw", "svh", "min", "max", "fit", ...E()], Y = () => [ia, "screen", "full", "dvw", "lvw", "svw", "min", "max", "fit", ...E()], V = () => [ia, "screen", "full", "lh", "dvh", "lvh", "svh", "min", "max", "fit", ...E()], q = () => [t, Ze, Xe], ne = () => [...M(), Au, Tu, { position: [Ze, Xe] }], K = () => ["no-repeat", { repeat: ["", "x", "y", "space", "round"] }], R = () => ["auto", "cover", "contain", mx, ux, { size: [Ze, Xe] }], L = () => [Zi, Es, Sa], G = () => ["", "none", "full", f, Ze, Xe], Q = () => ["", ht, Es, Sa], re = () => ["solid", "dashed", "dotted", "double"], ie = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], le = () => [ht, Zi, Au, Tu], ce = () => ["", "none", h, Ze, Xe], fe = () => ["none", ht, Ze, Xe], ve = () => ["none", ht, Ze, Xe], be = () => [ht, Ze, Xe], _e40 = () => [ia, "full", ...E()];
  return { cacheSize: 500, theme: { animate: ["spin", "ping", "pulse", "bounce"], aspect: ["video"], blur: [Fn], breakpoint: [Fn], color: [sg], container: [Fn], "drop-shadow": [Fn], ease: ["in", "out", "in-out"], font: [dx], "font-weight": ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black"], "inset-shadow": [Fn], leading: ["none", "tight", "snug", "normal", "relaxed", "loose"], perspective: ["dramatic", "near", "normal", "midrange", "distant", "none"], radius: [Fn], shadow: [Fn], spacing: ["px", ht], text: [Fn], "text-shadow": [Fn], tracking: ["tighter", "tight", "normal", "wide", "wider", "widest"] }, classGroups: { aspect: [{ aspect: ["auto", "square", ia, Xe, Ze, w] }], container: ["container"], columns: [{ columns: [ht, Xe, Ze, l] }], "break-after": [{ "break-after": B() }], "break-before": [{ "break-before": B() }], "break-inside": [{ "break-inside": ["auto", "avoid", "avoid-page", "avoid-column"] }], "box-decoration": [{ "box-decoration": ["slice", "clone"] }], box: [{ box: ["border", "content"] }], display: ["block", "inline-block", "inline", "flex", "inline-flex", "table", "inline-table", "table-caption", "table-cell", "table-column", "table-column-group", "table-footer-group", "table-header-group", "table-row-group", "table-row", "flow-root", "grid", "inline-grid", "contents", "list-item", "hidden"], sr: ["sr-only", "not-sr-only"], float: [{ float: ["right", "left", "none", "start", "end"] }], clear: [{ clear: ["left", "right", "both", "none", "start", "end"] }], isolation: ["isolate", "isolation-auto"], "object-fit": [{ object: ["contain", "cover", "fill", "none", "scale-down"] }], "object-position": [{ object: Z() }], overflow: [{ overflow: U() }], "overflow-x": [{ "overflow-x": U() }], "overflow-y": [{ "overflow-y": U() }], overscroll: [{ overscroll: P() }], "overscroll-x": [{ "overscroll-x": P() }], "overscroll-y": [{ "overscroll-y": P() }], position: ["static", "fixed", "absolute", "relative", "sticky"], inset: [{ inset: S() }], "inset-x": [{ "inset-x": S() }], "inset-y": [{ "inset-y": S() }], start: [{ "inset-s": S(), start: S() }], end: [{ "inset-e": S(), end: S() }], "inset-bs": [{ "inset-bs": S() }], "inset-be": [{ "inset-be": S() }], top: [{ top: S() }], right: [{ right: S() }], bottom: [{ bottom: S() }], left: [{ left: S() }], visibility: ["visible", "invisible", "collapse"], z: [{ z: [la, "auto", Ze, Xe] }], basis: [{ basis: [ia, "full", "auto", l, ...E()] }], "flex-direction": [{ flex: ["row", "row-reverse", "col", "col-reverse"] }], "flex-wrap": [{ flex: ["nowrap", "wrap", "wrap-reverse"] }], flex: [{ flex: [ht, ia, "auto", "initial", "none", Xe] }], grow: [{ grow: ["", ht, Ze, Xe] }], shrink: [{ shrink: ["", ht, Ze, Xe] }], order: [{ order: [la, "first", "last", "none", Ze, Xe] }], "grid-cols": [{ "grid-cols": $() }], "col-start-end": [{ col: J() }], "col-start": [{ "col-start": W() }], "col-end": [{ "col-end": W() }], "grid-rows": [{ "grid-rows": $() }], "row-start-end": [{ row: J() }], "row-start": [{ "row-start": W() }], "row-end": [{ "row-end": W() }], "grid-flow": [{ "grid-flow": ["row", "col", "dense", "row-dense", "col-dense"] }], "auto-cols": [{ "auto-cols": C() }], "auto-rows": [{ "auto-rows": C() }], gap: [{ gap: E() }], "gap-x": [{ "gap-x": E() }], "gap-y": [{ "gap-y": E() }], "justify-content": [{ justify: [...A(), "normal"] }], "justify-items": [{ "justify-items": [...k(), "normal"] }], "justify-self": [{ "justify-self": ["auto", ...k()] }], "align-content": [{ content: ["normal", ...A()] }], "align-items": [{ items: [...k(), { baseline: ["", "last"] }] }], "align-self": [{ self: ["auto", ...k(), { baseline: ["", "last"] }] }], "place-content": [{ "place-content": A() }], "place-items": [{ "place-items": [...k(), "baseline"] }], "place-self": [{ "place-self": ["auto", ...k()] }], p: [{ p: E() }], px: [{ px: E() }], py: [{ py: E() }], ps: [{ ps: E() }], pe: [{ pe: E() }], pbs: [{ pbs: E() }], pbe: [{ pbe: E() }], pt: [{ pt: E() }], pr: [{ pr: E() }], pb: [{ pb: E() }], pl: [{ pl: E() }], m: [{ m: N() }], mx: [{ mx: N() }], my: [{ my: N() }], ms: [{ ms: N() }], me: [{ me: N() }], mbs: [{ mbs: N() }], mbe: [{ mbe: N() }], mt: [{ mt: N() }], mr: [{ mr: N() }], mb: [{ mb: N() }], ml: [{ ml: N() }], "space-x": [{ "space-x": E() }], "space-x-reverse": ["space-x-reverse"], "space-y": [{ "space-y": E() }], "space-y-reverse": ["space-y-reverse"], size: [{ size: O() }], "inline-size": [{ inline: ["auto", ...Y()] }], "min-inline-size": [{ "min-inline": ["auto", ...Y()] }], "max-inline-size": [{ "max-inline": ["none", ...Y()] }], "block-size": [{ block: ["auto", ...V()] }], "min-block-size": [{ "min-block": ["auto", ...V()] }], "max-block-size": [{ "max-block": ["none", ...V()] }], w: [{ w: [l, "screen", ...O()] }], "min-w": [{ "min-w": [l, "screen", "none", ...O()] }], "max-w": [{ "max-w": [l, "screen", "none", "prose", { screen: [i] }, ...O()] }], h: [{ h: ["screen", "lh", ...O()] }], "min-h": [{ "min-h": ["screen", "lh", "none", ...O()] }], "max-h": [{ "max-h": ["screen", "lh", ...O()] }], "font-size": [{ text: ["base", r, Es, Sa] }], "font-smoothing": ["antialiased", "subpixel-antialiased"], "font-style": ["italic", "not-italic"], "font-weight": [{ font: [n, _x, fx] }], "font-stretch": [{ "font-stretch": ["ultra-condensed", "extra-condensed", "condensed", "semi-condensed", "normal", "semi-expanded", "expanded", "extra-expanded", "ultra-expanded", Zi, Xe] }], "font-family": [{ font: [gx, px, e] }], "font-features": [{ "font-features": [Xe] }], "fvn-normal": ["normal-nums"], "fvn-ordinal": ["ordinal"], "fvn-slashed-zero": ["slashed-zero"], "fvn-figure": ["lining-nums", "oldstyle-nums"], "fvn-spacing": ["proportional-nums", "tabular-nums"], "fvn-fraction": ["diagonal-fractions", "stacked-fractions"], tracking: [{ tracking: [a, Ze, Xe] }], "line-clamp": [{ "line-clamp": [ht, "none", Ze, Su] }], leading: [{ leading: [o, ...E()] }], "list-image": [{ "list-image": ["none", Ze, Xe] }], "list-style-position": [{ list: ["inside", "outside"] }], "list-style-type": [{ list: ["disc", "decimal", "none", Ze, Xe] }], "text-alignment": [{ text: ["left", "center", "right", "justify", "start", "end"] }], "placeholder-color": [{ placeholder: q() }], "text-color": [{ text: q() }], "text-decoration": ["underline", "overline", "line-through", "no-underline"], "text-decoration-style": [{ decoration: [...re(), "wavy"] }], "text-decoration-thickness": [{ decoration: [ht, "from-font", "auto", Ze, Sa] }], "text-decoration-color": [{ decoration: q() }], "underline-offset": [{ "underline-offset": [ht, "auto", Ze, Xe] }], "text-transform": ["uppercase", "lowercase", "capitalize", "normal-case"], "text-overflow": ["truncate", "text-ellipsis", "text-clip"], "text-wrap": [{ text: ["wrap", "nowrap", "balance", "pretty"] }], indent: [{ indent: E() }], "vertical-align": [{ align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", Ze, Xe] }], whitespace: [{ whitespace: ["normal", "nowrap", "pre", "pre-line", "pre-wrap", "break-spaces"] }], break: [{ break: ["normal", "words", "all", "keep"] }], wrap: [{ wrap: ["break-word", "anywhere", "normal"] }], hyphens: [{ hyphens: ["none", "manual", "auto"] }], content: [{ content: ["none", Ze, Xe] }], "bg-attachment": [{ bg: ["fixed", "local", "scroll"] }], "bg-clip": [{ "bg-clip": ["border", "padding", "content", "text"] }], "bg-origin": [{ "bg-origin": ["border", "padding", "content"] }], "bg-position": [{ bg: ne() }], "bg-repeat": [{ bg: K() }], "bg-size": [{ bg: R() }], "bg-image": [{ bg: ["none", { linear: [{ to: ["t", "tr", "r", "br", "b", "bl", "l", "tl"] }, la, Ze, Xe], radial: ["", Ze, Xe], conic: [la, Ze, Xe] }, hx, vx] }], "bg-color": [{ bg: q() }], "gradient-from-pos": [{ from: L() }], "gradient-via-pos": [{ via: L() }], "gradient-to-pos": [{ to: L() }], "gradient-from": [{ from: q() }], "gradient-via": [{ via: q() }], "gradient-to": [{ to: q() }], rounded: [{ rounded: G() }], "rounded-s": [{ "rounded-s": G() }], "rounded-e": [{ "rounded-e": G() }], "rounded-t": [{ "rounded-t": G() }], "rounded-r": [{ "rounded-r": G() }], "rounded-b": [{ "rounded-b": G() }], "rounded-l": [{ "rounded-l": G() }], "rounded-ss": [{ "rounded-ss": G() }], "rounded-se": [{ "rounded-se": G() }], "rounded-ee": [{ "rounded-ee": G() }], "rounded-es": [{ "rounded-es": G() }], "rounded-tl": [{ "rounded-tl": G() }], "rounded-tr": [{ "rounded-tr": G() }], "rounded-br": [{ "rounded-br": G() }], "rounded-bl": [{ "rounded-bl": G() }], "border-w": [{ border: Q() }], "border-w-x": [{ "border-x": Q() }], "border-w-y": [{ "border-y": Q() }], "border-w-s": [{ "border-s": Q() }], "border-w-e": [{ "border-e": Q() }], "border-w-bs": [{ "border-bs": Q() }], "border-w-be": [{ "border-be": Q() }], "border-w-t": [{ "border-t": Q() }], "border-w-r": [{ "border-r": Q() }], "border-w-b": [{ "border-b": Q() }], "border-w-l": [{ "border-l": Q() }], "divide-x": [{ "divide-x": Q() }], "divide-x-reverse": ["divide-x-reverse"], "divide-y": [{ "divide-y": Q() }], "divide-y-reverse": ["divide-y-reverse"], "border-style": [{ border: [...re(), "hidden", "none"] }], "divide-style": [{ divide: [...re(), "hidden", "none"] }], "border-color": [{ border: q() }], "border-color-x": [{ "border-x": q() }], "border-color-y": [{ "border-y": q() }], "border-color-s": [{ "border-s": q() }], "border-color-e": [{ "border-e": q() }], "border-color-bs": [{ "border-bs": q() }], "border-color-be": [{ "border-be": q() }], "border-color-t": [{ "border-t": q() }], "border-color-r": [{ "border-r": q() }], "border-color-b": [{ "border-b": q() }], "border-color-l": [{ "border-l": q() }], "divide-color": [{ divide: q() }], "outline-style": [{ outline: [...re(), "none", "hidden"] }], "outline-offset": [{ "outline-offset": [ht, Ze, Xe] }], "outline-w": [{ outline: ["", ht, Es, Sa] }], "outline-color": [{ outline: q() }], shadow: [{ shadow: ["", "none", v, Po, Io] }], "shadow-color": [{ shadow: q() }], "inset-shadow": [{ "inset-shadow": ["none", x, Po, Io] }], "inset-shadow-color": [{ "inset-shadow": q() }], "ring-w": [{ ring: Q() }], "ring-w-inset": ["ring-inset"], "ring-color": [{ ring: q() }], "ring-offset-w": [{ "ring-offset": [ht, Sa] }], "ring-offset-color": [{ "ring-offset": q() }], "inset-ring-w": [{ "inset-ring": Q() }], "inset-ring-color": [{ "inset-ring": q() }], "text-shadow": [{ "text-shadow": ["none", m, Po, Io] }], "text-shadow-color": [{ "text-shadow": q() }], opacity: [{ opacity: [ht, Ze, Xe] }], "mix-blend": [{ "mix-blend": [...ie(), "plus-darker", "plus-lighter"] }], "bg-blend": [{ "bg-blend": ie() }], "mask-clip": [{ "mask-clip": ["border", "padding", "content", "fill", "stroke", "view"] }, "mask-no-clip"], "mask-composite": [{ mask: ["add", "subtract", "intersect", "exclude"] }], "mask-image-linear-pos": [{ "mask-linear": [ht] }], "mask-image-linear-from-pos": [{ "mask-linear-from": le() }], "mask-image-linear-to-pos": [{ "mask-linear-to": le() }], "mask-image-linear-from-color": [{ "mask-linear-from": q() }], "mask-image-linear-to-color": [{ "mask-linear-to": q() }], "mask-image-t-from-pos": [{ "mask-t-from": le() }], "mask-image-t-to-pos": [{ "mask-t-to": le() }], "mask-image-t-from-color": [{ "mask-t-from": q() }], "mask-image-t-to-color": [{ "mask-t-to": q() }], "mask-image-r-from-pos": [{ "mask-r-from": le() }], "mask-image-r-to-pos": [{ "mask-r-to": le() }], "mask-image-r-from-color": [{ "mask-r-from": q() }], "mask-image-r-to-color": [{ "mask-r-to": q() }], "mask-image-b-from-pos": [{ "mask-b-from": le() }], "mask-image-b-to-pos": [{ "mask-b-to": le() }], "mask-image-b-from-color": [{ "mask-b-from": q() }], "mask-image-b-to-color": [{ "mask-b-to": q() }], "mask-image-l-from-pos": [{ "mask-l-from": le() }], "mask-image-l-to-pos": [{ "mask-l-to": le() }], "mask-image-l-from-color": [{ "mask-l-from": q() }], "mask-image-l-to-color": [{ "mask-l-to": q() }], "mask-image-x-from-pos": [{ "mask-x-from": le() }], "mask-image-x-to-pos": [{ "mask-x-to": le() }], "mask-image-x-from-color": [{ "mask-x-from": q() }], "mask-image-x-to-color": [{ "mask-x-to": q() }], "mask-image-y-from-pos": [{ "mask-y-from": le() }], "mask-image-y-to-pos": [{ "mask-y-to": le() }], "mask-image-y-from-color": [{ "mask-y-from": q() }], "mask-image-y-to-color": [{ "mask-y-to": q() }], "mask-image-radial": [{ "mask-radial": [Ze, Xe] }], "mask-image-radial-from-pos": [{ "mask-radial-from": le() }], "mask-image-radial-to-pos": [{ "mask-radial-to": le() }], "mask-image-radial-from-color": [{ "mask-radial-from": q() }], "mask-image-radial-to-color": [{ "mask-radial-to": q() }], "mask-image-radial-shape": [{ "mask-radial": ["circle", "ellipse"] }], "mask-image-radial-size": [{ "mask-radial": [{ closest: ["side", "corner"], farthest: ["side", "corner"] }] }], "mask-image-radial-pos": [{ "mask-radial-at": M() }], "mask-image-conic-pos": [{ "mask-conic": [ht] }], "mask-image-conic-from-pos": [{ "mask-conic-from": le() }], "mask-image-conic-to-pos": [{ "mask-conic-to": le() }], "mask-image-conic-from-color": [{ "mask-conic-from": q() }], "mask-image-conic-to-color": [{ "mask-conic-to": q() }], "mask-mode": [{ mask: ["alpha", "luminance", "match"] }], "mask-origin": [{ "mask-origin": ["border", "padding", "content", "fill", "stroke", "view"] }], "mask-position": [{ mask: ne() }], "mask-repeat": [{ mask: K() }], "mask-size": [{ mask: R() }], "mask-type": [{ "mask-type": ["alpha", "luminance"] }], "mask-image": [{ mask: ["none", Ze, Xe] }], filter: [{ filter: ["", "none", Ze, Xe] }], blur: [{ blur: ce() }], brightness: [{ brightness: [ht, Ze, Xe] }], contrast: [{ contrast: [ht, Ze, Xe] }], "drop-shadow": [{ "drop-shadow": ["", "none", y, Po, Io] }], "drop-shadow-color": [{ "drop-shadow": q() }], grayscale: [{ grayscale: ["", ht, Ze, Xe] }], "hue-rotate": [{ "hue-rotate": [ht, Ze, Xe] }], invert: [{ invert: ["", ht, Ze, Xe] }], saturate: [{ saturate: [ht, Ze, Xe] }], sepia: [{ sepia: ["", ht, Ze, Xe] }], "backdrop-filter": [{ "backdrop-filter": ["", "none", Ze, Xe] }], "backdrop-blur": [{ "backdrop-blur": ce() }], "backdrop-brightness": [{ "backdrop-brightness": [ht, Ze, Xe] }], "backdrop-contrast": [{ "backdrop-contrast": [ht, Ze, Xe] }], "backdrop-grayscale": [{ "backdrop-grayscale": ["", ht, Ze, Xe] }], "backdrop-hue-rotate": [{ "backdrop-hue-rotate": [ht, Ze, Xe] }], "backdrop-invert": [{ "backdrop-invert": ["", ht, Ze, Xe] }], "backdrop-opacity": [{ "backdrop-opacity": [ht, Ze, Xe] }], "backdrop-saturate": [{ "backdrop-saturate": [ht, Ze, Xe] }], "backdrop-sepia": [{ "backdrop-sepia": ["", ht, Ze, Xe] }], "border-collapse": [{ border: ["collapse", "separate"] }], "border-spacing": [{ "border-spacing": E() }], "border-spacing-x": [{ "border-spacing-x": E() }], "border-spacing-y": [{ "border-spacing-y": E() }], "table-layout": [{ table: ["auto", "fixed"] }], caption: [{ caption: ["top", "bottom"] }], transition: [{ transition: ["", "all", "colors", "opacity", "shadow", "transform", "none", Ze, Xe] }], "transition-behavior": [{ transition: ["normal", "discrete"] }], duration: [{ duration: [ht, "initial", Ze, Xe] }], ease: [{ ease: ["linear", "initial", D, Ze, Xe] }], delay: [{ delay: [ht, Ze, Xe] }], animate: [{ animate: ["none", F, Ze, Xe] }], backface: [{ backface: ["hidden", "visible"] }], perspective: [{ perspective: [b, Ze, Xe] }], "perspective-origin": [{ "perspective-origin": Z() }], rotate: [{ rotate: fe() }], "rotate-x": [{ "rotate-x": fe() }], "rotate-y": [{ "rotate-y": fe() }], "rotate-z": [{ "rotate-z": fe() }], scale: [{ scale: ve() }], "scale-x": [{ "scale-x": ve() }], "scale-y": [{ "scale-y": ve() }], "scale-z": [{ "scale-z": ve() }], "scale-3d": ["scale-3d"], skew: [{ skew: be() }], "skew-x": [{ "skew-x": be() }], "skew-y": [{ "skew-y": be() }], transform: [{ transform: [Ze, Xe, "", "none", "gpu", "cpu"] }], "transform-origin": [{ origin: Z() }], "transform-style": [{ transform: ["3d", "flat"] }], translate: [{ translate: _e40() }], "translate-x": [{ "translate-x": _e40() }], "translate-y": [{ "translate-y": _e40() }], "translate-z": [{ "translate-z": _e40() }], "translate-none": ["translate-none"], accent: [{ accent: q() }], appearance: [{ appearance: ["none", "auto"] }], "caret-color": [{ caret: q() }], "color-scheme": [{ scheme: ["normal", "dark", "light", "light-dark", "only-dark", "only-light"] }], cursor: [{ cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", Ze, Xe] }], "field-sizing": [{ "field-sizing": ["fixed", "content"] }], "pointer-events": [{ "pointer-events": ["auto", "none"] }], resize: [{ resize: ["none", "", "y", "x"] }], "scroll-behavior": [{ scroll: ["auto", "smooth"] }], "scroll-m": [{ "scroll-m": E() }], "scroll-mx": [{ "scroll-mx": E() }], "scroll-my": [{ "scroll-my": E() }], "scroll-ms": [{ "scroll-ms": E() }], "scroll-me": [{ "scroll-me": E() }], "scroll-mbs": [{ "scroll-mbs": E() }], "scroll-mbe": [{ "scroll-mbe": E() }], "scroll-mt": [{ "scroll-mt": E() }], "scroll-mr": [{ "scroll-mr": E() }], "scroll-mb": [{ "scroll-mb": E() }], "scroll-ml": [{ "scroll-ml": E() }], "scroll-p": [{ "scroll-p": E() }], "scroll-px": [{ "scroll-px": E() }], "scroll-py": [{ "scroll-py": E() }], "scroll-ps": [{ "scroll-ps": E() }], "scroll-pe": [{ "scroll-pe": E() }], "scroll-pbs": [{ "scroll-pbs": E() }], "scroll-pbe": [{ "scroll-pbe": E() }], "scroll-pt": [{ "scroll-pt": E() }], "scroll-pr": [{ "scroll-pr": E() }], "scroll-pb": [{ "scroll-pb": E() }], "scroll-pl": [{ "scroll-pl": E() }], "snap-align": [{ snap: ["start", "end", "center", "align-none"] }], "snap-stop": [{ snap: ["normal", "always"] }], "snap-type": [{ snap: ["none", "x", "y", "both"] }], "snap-strictness": [{ snap: ["mandatory", "proximity"] }], touch: [{ touch: ["auto", "none", "manipulation"] }], "touch-x": [{ "touch-pan": ["x", "left", "right"] }], "touch-y": [{ "touch-pan": ["y", "up", "down"] }], "touch-pz": ["touch-pinch-zoom"], select: [{ select: ["none", "text", "all", "auto"] }], "will-change": [{ "will-change": ["auto", "scroll", "contents", "transform", Ze, Xe] }], fill: [{ fill: ["none", ...q()] }], "stroke-w": [{ stroke: [ht, Es, Sa, Su] }], stroke: [{ stroke: ["none", ...q()] }], "forced-color-adjust": [{ "forced-color-adjust": ["auto", "none"] }] }, conflictingClassGroups: { overflow: ["overflow-x", "overflow-y"], overscroll: ["overscroll-x", "overscroll-y"], inset: ["inset-x", "inset-y", "inset-bs", "inset-be", "start", "end", "top", "right", "bottom", "left"], "inset-x": ["right", "left"], "inset-y": ["top", "bottom"], flex: ["basis", "grow", "shrink"], gap: ["gap-x", "gap-y"], p: ["px", "py", "ps", "pe", "pbs", "pbe", "pt", "pr", "pb", "pl"], px: ["pr", "pl"], py: ["pt", "pb"], m: ["mx", "my", "ms", "me", "mbs", "mbe", "mt", "mr", "mb", "ml"], mx: ["mr", "ml"], my: ["mt", "mb"], size: ["w", "h"], "font-size": ["leading"], "fvn-normal": ["fvn-ordinal", "fvn-slashed-zero", "fvn-figure", "fvn-spacing", "fvn-fraction"], "fvn-ordinal": ["fvn-normal"], "fvn-slashed-zero": ["fvn-normal"], "fvn-figure": ["fvn-normal"], "fvn-spacing": ["fvn-normal"], "fvn-fraction": ["fvn-normal"], "line-clamp": ["display", "overflow"], rounded: ["rounded-s", "rounded-e", "rounded-t", "rounded-r", "rounded-b", "rounded-l", "rounded-ss", "rounded-se", "rounded-ee", "rounded-es", "rounded-tl", "rounded-tr", "rounded-br", "rounded-bl"], "rounded-s": ["rounded-ss", "rounded-es"], "rounded-e": ["rounded-se", "rounded-ee"], "rounded-t": ["rounded-tl", "rounded-tr"], "rounded-r": ["rounded-tr", "rounded-br"], "rounded-b": ["rounded-br", "rounded-bl"], "rounded-l": ["rounded-tl", "rounded-bl"], "border-spacing": ["border-spacing-x", "border-spacing-y"], "border-w": ["border-w-x", "border-w-y", "border-w-s", "border-w-e", "border-w-bs", "border-w-be", "border-w-t", "border-w-r", "border-w-b", "border-w-l"], "border-w-x": ["border-w-r", "border-w-l"], "border-w-y": ["border-w-t", "border-w-b"], "border-color": ["border-color-x", "border-color-y", "border-color-s", "border-color-e", "border-color-bs", "border-color-be", "border-color-t", "border-color-r", "border-color-b", "border-color-l"], "border-color-x": ["border-color-r", "border-color-l"], "border-color-y": ["border-color-t", "border-color-b"], translate: ["translate-x", "translate-y", "translate-none"], "translate-none": ["translate", "translate-x", "translate-y", "translate-z"], "scroll-m": ["scroll-mx", "scroll-my", "scroll-ms", "scroll-me", "scroll-mbs", "scroll-mbe", "scroll-mt", "scroll-mr", "scroll-mb", "scroll-ml"], "scroll-mx": ["scroll-mr", "scroll-ml"], "scroll-my": ["scroll-mt", "scroll-mb"], "scroll-p": ["scroll-px", "scroll-py", "scroll-ps", "scroll-pe", "scroll-pbs", "scroll-pbe", "scroll-pt", "scroll-pr", "scroll-pb", "scroll-pl"], "scroll-px": ["scroll-pr", "scroll-pl"], "scroll-py": ["scroll-pt", "scroll-pb"], touch: ["touch-x", "touch-y", "touch-pz"], "touch-x": ["touch"], "touch-y": ["touch"], "touch-pz": ["touch"] }, conflictingClassGroupModifiers: { "font-size": ["leading"] }, orderSensitiveModifiers: ["*", "**", "after", "backdrop", "before", "details-content", "file", "first-letter", "first-line", "marker", "placeholder", "selection"] };
}, xx = (t, { cacheSize: e, prefix: r, experimentalParseClassName: n, extend: a = {}, override: o = {} }) => (Fs(t, "cacheSize", e), Fs(t, "prefix", r), Fs(t, "experimentalParseClassName", n), $o(t.theme, o.theme), $o(t.classGroups, o.classGroups), $o(t.conflictingClassGroups, o.conflictingClassGroups), $o(t.conflictingClassGroupModifiers, o.conflictingClassGroupModifiers), Fs(t, "orderSensitiveModifiers", o.orderSensitiveModifiers), No(t.theme, a.theme), No(t.classGroups, a.classGroups), No(t.conflictingClassGroups, a.conflictingClassGroups), No(t.conflictingClassGroupModifiers, a.conflictingClassGroupModifiers), pg(t, a, "orderSensitiveModifiers"), t), Fs = (t, e, r) => {
  r !== void 0 && (t[e] = r);
}, $o = (t, e) => {
  if (e) for (const r in e) Fs(t, r, e[r]);
}, No = (t, e) => {
  if (e) for (const r in e) pg(t, e, r);
}, pg = (t, e, r) => {
  const n = e[r];
  n !== void 0 && (t[r] = t[r] ? t[r].concat(n) : n);
}, yx = (t, ...e) => typeof t == "function" ? Cl(Il, t, ...e) : Cl(() => xx(Il(), t), ...e), vg = Cl(Il);
function Je(...t) {
  return vg(Ws(t));
}
ah();
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
const wx = { xmlns: "http://www.w3.org/2000/svg", width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": 2, "stroke-linecap": "round", "stroke-linejoin": "round" };
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
const kx = (t) => {
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
var Sx = dn("<svg><!><!></svg>");
function Dt(t, e) {
  const r = $t(e, ["children", "$$slots", "$$events", "$$legacy"]), n = $t(r, ["name", "color", "size", "strokeWidth", "absoluteStrokeWidth", "iconNode"]);
  Be(e, false);
  let a = oe(e, "name", 8, void 0), o = oe(e, "color", 8, "currentColor"), i = oe(e, "size", 8, 24), l = oe(e, "strokeWidth", 8, 2), c = oe(e, "absoluteStrokeWidth", 8, false), f = oe(e, "iconNode", 24, () => []);
  wp();
  var v = Sx();
  Gt(v, (y, h, b) => ({ ...wx, ...y, ...n, width: i(), height: i(), stroke: o(), "stroke-width": h, class: b }), [() => kx(n) ? void 0 : { "aria-hidden": "true" }, () => (Ta(c()), Ta(l()), Ta(i()), yr(() => c() ? Number(l()) * 24 / Number(i()) : l())), () => (Ta(Eu), Ta(a()), Ta(r), yr(() => Eu("lucide-icon", "lucide", a() ? `lucide-${a()}` : "", r.class)))]);
  var x = d(v);
  Ve(x, 1, f, Qe, (y, h) => {
    var b = H(() => mf(s(h), 2));
    let w = () => s(b)[0], D = () => s(b)[1];
    var F = ke(), B = ae(F);
    mp(B, w, true, (M, Z) => {
      Gt(M, () => ({ ...D() }));
    }), u(y, F);
  });
  var m = p(x);
  zt(m, e, "default", {}), u(t, v), Fe();
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
  const n = [["path", { d: "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" }]];
  Dt(t, et({ name: "activity" }, () => r, { get iconNode() {
    return n;
  }, children: (a, o) => {
    var i = ke(), l = ae(i);
    zt(l, e, "default", {}), u(a, i);
  }, $$slots: { default: true } }));
}
function Ro(t, e) {
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
    var i = ke(), l = ae(i);
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
  const n = [["path", { d: "M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" }], ["path", { d: "M9 13a4.5 4.5 0 0 0 3-4" }], ["path", { d: "M6.003 5.125A3 3 0 0 0 6.401 6.5" }], ["path", { d: "M3.477 10.896a4 4 0 0 1 .585-.396" }], ["path", { d: "M6 18a4 4 0 0 1-1.967-.516" }], ["path", { d: "M12 13h4" }], ["path", { d: "M12 18h6a2 2 0 0 1 2 2v1" }], ["path", { d: "M12 8h8" }], ["path", { d: "M16 8V5a2 2 0 0 1 2-2" }], ["circle", { cx: "16", cy: "13", r: ".5" }], ["circle", { cx: "18", cy: "3", r: ".5" }], ["circle", { cx: "20", cy: "21", r: ".5" }], ["circle", { cx: "20", cy: "8", r: ".5" }]];
  Dt(t, et({ name: "brain-circuit" }, () => r, { get iconNode() {
    return n;
  }, children: (a, o) => {
    var i = ke(), l = ae(i);
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
  const n = [["path", { d: "m6 9 6 6 6-6" }]];
  Dt(t, et({ name: "chevron-down" }, () => r, { get iconNode() {
    return n;
  }, children: (a, o) => {
    var i = ke(), l = ae(i);
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
  const n = [["path", { d: "m9 18 6-6-6-6" }]];
  Dt(t, et({ name: "chevron-right" }, () => r, { get iconNode() {
    return n;
  }, children: (a, o) => {
    var i = ke(), l = ae(i);
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
  const n = [["circle", { cx: "12", cy: "12", r: "10" }], ["line", { x1: "12", x2: "12", y1: "8", y2: "12" }], ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16" }]];
  Dt(t, et({ name: "circle-alert" }, () => r, { get iconNode() {
    return n;
  }, children: (a, o) => {
    var i = ke(), l = ae(i);
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
    var i = ke(), l = ae(i);
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
    var i = ke(), l = ae(i);
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
  const n = [["circle", { cx: "12", cy: "12", r: "10" }], ["path", { d: "m15 9-6 6" }], ["path", { d: "m9 9 6 6" }]];
  Dt(t, et({ name: "circle-x" }, () => r, { get iconNode() {
    return n;
  }, children: (a, o) => {
    var i = ke(), l = ae(i);
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
    var i = ke(), l = ae(i);
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
    var i = ke(), l = ae(i);
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
    var i = ke(), l = ae(i);
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
  const n = [["path", { d: "M15 6a9 9 0 0 0-9 9V3" }], ["circle", { cx: "18", cy: "6", r: "3" }], ["circle", { cx: "6", cy: "18", r: "3" }]];
  Dt(t, et({ name: "git-branch" }, () => r, { get iconNode() {
    return n;
  }, children: (a, o) => {
    var i = ke(), l = ae(i);
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
  const n = [["path", { d: "M10 16h.01" }], ["path", { d: "M2.212 11.577a2 2 0 0 0-.212.896V18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5.527a2 2 0 0 0-.212-.896L18.55 5.11A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" }], ["path", { d: "M21.946 12.013H2.054" }], ["path", { d: "M6 16h.01" }]];
  Dt(t, et({ name: "hard-drive" }, () => r, { get iconNode() {
    return n;
  }, children: (a, o) => {
    var i = ke(), l = ae(i);
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
  const n = [["circle", { cx: "12", cy: "12", r: "10" }], ["path", { d: "M12 16v-4" }], ["path", { d: "M12 8h.01" }]];
  Dt(t, et({ name: "info" }, () => r, { get iconNode() {
    return n;
  }, children: (a, o) => {
    var i = ke(), l = ae(i);
    zt(l, e, "default", {}), u(a, i);
  }, $$slots: { default: true } }));
}
function fo(t, e) {
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
    var i = ke(), l = ae(i);
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
    var i = ke(), l = ae(i);
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
    var i = ke(), l = ae(i);
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
    var i = ke(), l = ae(i);
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
  const n = [["path", { d: "M5 12h14" }], ["path", { d: "M12 5v14" }]];
  Dt(t, et({ name: "plus" }, () => r, { get iconNode() {
    return n;
  }, children: (a, o) => {
    var i = ke(), l = ae(i);
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
  const n = [["path", { d: "M15.39 4.39a1 1 0 0 0 1.68-.474 2.5 2.5 0 1 1 3.014 3.015 1 1 0 0 0-.474 1.68l1.683 1.682a2.414 2.414 0 0 1 0 3.414L19.61 15.39a1 1 0 0 1-1.68-.474 2.5 2.5 0 1 0-3.014 3.015 1 1 0 0 1 .474 1.68l-1.683 1.682a2.414 2.414 0 0 1-3.414 0L8.61 19.61a1 1 0 0 0-1.68.474 2.5 2.5 0 1 1-3.014-3.015 1 1 0 0 0 .474-1.68l-1.683-1.682a2.414 2.414 0 0 1 0-3.414L4.39 8.61a1 1 0 0 1 1.68.474 2.5 2.5 0 1 0 3.014-3.015 1 1 0 0 1-.474-1.68l1.683-1.682a2.414 2.414 0 0 1 3.414 0z" }]];
  Dt(t, et({ name: "puzzle" }, () => r, { get iconNode() {
    return n;
  }, children: (a, o) => {
    var i = ke(), l = ae(i);
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
    var i = ke(), l = ae(i);
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
  const n = [["path", { d: "M3 7V5a2 2 0 0 1 2-2h2" }], ["path", { d: "M17 3h2a2 2 0 0 1 2 2v2" }], ["path", { d: "M21 17v2a2 2 0 0 1-2 2h-2" }], ["path", { d: "M7 21H5a2 2 0 0 1-2-2v-2" }], ["circle", { cx: "12", cy: "12", r: "3" }], ["path", { d: "m16 16-1.9-1.9" }]];
  Dt(t, et({ name: "scan-search" }, () => r, { get iconNode() {
    return n;
  }, children: (a, o) => {
    var i = ke(), l = ae(i);
    zt(l, e, "default", {}), u(a, i);
  }, $$slots: { default: true } }));
}
function Jo(t, e) {
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
    var i = ke(), l = ae(i);
    zt(l, e, "default", {}), u(a, i);
  }, $$slots: { default: true } }));
}
function xg(t, e) {
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
    var i = ke(), l = ae(i);
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
  const n = [["path", { d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" }]];
  Dt(t, et({ name: "shield" }, () => r, { get iconNode() {
    return n;
  }, children: (a, o) => {
    var i = ke(), l = ae(i);
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
  const n = [["path", { d: "M21 10.656V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12.344" }], ["path", { d: "m9 11 3 3L22 4" }]];
  Dt(t, et({ name: "square-check-big" }, () => r, { get iconNode() {
    return n;
  }, children: (a, o) => {
    var i = ke(), l = ae(i);
    zt(l, e, "default", {}), u(a, i);
  }, $$slots: { default: true } }));
}
function Mx(t, e) {
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
    var i = ke(), l = ae(i);
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
  const n = [["path", { d: "M10 11v6" }], ["path", { d: "M14 11v6" }], ["path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" }], ["path", { d: "M3 6h18" }], ["path", { d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" }]];
  Dt(t, et({ name: "trash-2" }, () => r, { get iconNode() {
    return n;
  }, children: (a, o) => {
    var i = ke(), l = ae(i);
    zt(l, e, "default", {}), u(a, i);
  }, $$slots: { default: true } }));
}
function yg(t, e) {
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
    var i = ke(), l = ae(i);
    zt(l, e, "default", {}), u(a, i);
  }, $$slots: { default: true } }));
}
function wg(t, e) {
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
    var i = ke(), l = ae(i);
    zt(l, e, "default", {}), u(a, i);
  }, $$slots: { default: true } }));
}
var zx = _('<div class="absolute left-[13px] top-7 w-px h-7 bg-border"></div>'), Ox = _('<div class="size-1.5 rounded-full bg-white animate-ping"></div>'), Dx = _('<div class="size-1.5 rounded-full bg-muted-foreground/30"></div>'), Lx = _('<code class="text-foreground font-mono text-xs bg-accent px-1.5 py-0.5 rounded truncate max-w-[200px]"> </code>'), jx = _("<span> </span>"), Bx = _('<div class="flex items-center gap-3 mt-1 mb-4 relative last:mb-0"><!> <div><!></div> <div class="flex flex-col min-w-0"><span class="text-sm text-muted-foreground flex items-center gap-1.5 flex-wrap"><span><!></span> <!></span> <!></div></div>'), Fx = _('<div><p class="text-[0.62rem] font-bold uppercase tracking-widest text-muted-foreground mb-3">Execution Trace</p> <div class="flex flex-col relative"></div></div>');
function kg(t, e) {
  Be(e, true);
  let r = oe(e, "steps", 19, () => []);
  var n = ke(), a = ae(n);
  {
    var o = (i) => {
      var l = Fx(), c = p(d(l), 2);
      Ve(c, 21, r, Qe, (f, v, x) => {
        const m = H(() => s(v).success === true || s(v).status === "done"), y = H(() => s(v).success === false || s(v).status === "error"), h = H(() => s(v).status === "running"), b = H(() => s(v).status === "pending" || !s(m) && !s(y) && !s(h)), w = H(() => s(v).actionName || s(v).commandId || s(v).label), D = H(() => s(v).message || s(v).error || (s(v).status === "error" ? "Execution failed" : ""));
        var F = Bx(), B = d(F);
        {
          var M = (R) => {
            var L = zx();
            u(R, L);
          };
          I(B, (R) => {
            x < r().length - 1 && R(M);
          });
        }
        var Z = p(B, 2), U = d(Z);
        {
          var P = (R) => {
            Ks(R, { class: "size-3.5 text-white" });
          }, E = (R) => {
            yg(R, { class: "size-3.5 text-white" });
          }, S = (R) => {
            var L = Ox();
            u(R, L);
          }, $ = (R) => {
            var L = Dx();
            u(R, L);
          };
          I(U, (R) => {
            s(m) ? R(P) : s(y) ? R(E, 1) : s(h) ? R(S, 2) : R($, -1);
          });
        }
        var J = p(Z, 2), W = d(J), C = d(W), A = d(C);
        {
          var k = (R) => {
            var L = Ue("Executed");
            u(R, L);
          }, N = (R) => {
            var L = Ue("Failed");
            u(R, L);
          }, O = (R) => {
            var L = Ue("Running\u2026");
            u(R, L);
          }, Y = (R) => {
            var L = Ue("Pending");
            u(R, L);
          };
          I(A, (R) => {
            s(m) ? R(k) : s(y) ? R(N, 1) : s(h) ? R(O, 2) : R(Y, -1);
          });
        }
        var V = p(C, 2);
        {
          var q = (R) => {
            var L = Lx(), G = d(L);
            j(() => {
              br(L, "title", s(w)), T(G, s(w));
            }), u(R, L);
          };
          I(V, (R) => {
            s(w) && R(q);
          });
        }
        var ne = p(W, 2);
        {
          var K = (R) => {
            var L = jx(), G = d(L);
            j((Q) => {
              rt(L, 1, Q), T(G, s(D));
            }, [() => Et(Je("text-[0.65rem] mt-0.5 leading-snug", s(y) ? "text-destructive" : "text-muted-foreground/60"))]), u(R, L);
          };
          I(ne, (R) => {
            s(D) && !s(b) && R(K);
          });
        }
        j((R, L) => {
          rt(Z, 1, R), rt(C, 1, L);
        }, [() => Et(Je("size-7 rounded-full flex items-center justify-center shrink-0 z-10 transition-colors", s(m) && "bg-node-action", s(y) && "bg-destructive", s(h) && "bg-primary border-2 border-primary/30 animate-pulse", s(b) && "bg-muted border border-border")), () => Et(Je("opacity-70", s(h) && "text-primary font-medium opacity-100"))]), u(f, F);
      }), j((f) => rt(l, 1, f), [() => Et(Je("rounded bg-trace-bg border border-border px-4 py-3", e.class))]), u(i, l);
    };
    I(a, (i) => {
      var _a10;
      ((_a10 = r()) == null ? void 0 : _a10.length) && i(o);
    });
  }
  u(t, n), Fe();
}
var Ux = /\s+/g, Gx = (t) => typeof t != "string" || !t ? t : t.replace(Ux, " ").trim(), ei = (...t) => {
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
  return e.length > 0 ? Gx(e.join(" ")) : void 0;
}, Pu = (t) => t === false ? "false" : t === true ? "true" : t === 0 ? "0" : t, Fr = (t) => {
  if (!t || typeof t != "object") return true;
  for (const e in t) return false;
  return true;
}, Wx = (t, e) => {
  if (t === e) return true;
  if (!t || !e) return false;
  const r = Object.keys(t), n = Object.keys(e);
  if (r.length !== n.length) return false;
  for (let a = 0; a < r.length; a++) {
    const o = r[a];
    if (!n.includes(o) || t[o] !== e[o]) return false;
  }
  return true;
}, Vx = (t, e) => {
  for (const r in e) if (Object.prototype.hasOwnProperty.call(e, r)) {
    const n = e[r];
    r in t ? t[r] = ei(t[r], n) : t[r] = n;
  }
  return t;
}, Sg = (t, e) => {
  for (let r = 0; r < t.length; r++) {
    const n = t[r];
    Array.isArray(n) ? Sg(n, e) : n && e.push(n);
  }
}, Tg = (...t) => {
  const e = [];
  Sg(t, e);
  const r = [];
  for (let n = 0; n < e.length; n++) e[n] && r.push(e[n]);
  return r;
}, Nl = (t, e) => {
  const r = {};
  for (const n in t) {
    const a = t[n];
    if (n in e) {
      const o = e[n];
      Array.isArray(a) || Array.isArray(o) ? r[n] = Tg(o, a) : typeof a == "object" && typeof o == "object" && a && o ? r[n] = Nl(a, o) : r[n] = o + " " + a;
    } else r[n] = a;
  }
  for (const n in e) n in t || (r[n] = e[n]);
  return r;
}, Hx = { twMerge: true, twMergeConfig: {} };
function qx() {
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
var Hn = qx(), Yx = (t) => {
  const e = (n, a) => {
    const { extend: o = null, slots: i = {}, variants: l = {}, compoundVariants: c = [], compoundSlots: f = [], defaultVariants: v = {} } = n, x = { ...Hx, ...a }, m = (o == null ? void 0 : o.base) ? ei(o.base, n == null ? void 0 : n.base) : n == null ? void 0 : n.base, y = (o == null ? void 0 : o.variants) && !Fr(o.variants) ? Nl(l, o.variants) : l, h = (o == null ? void 0 : o.defaultVariants) && !Fr(o.defaultVariants) ? { ...o.defaultVariants, ...v } : v;
    !Fr(x.twMergeConfig) && !Wx(x.twMergeConfig, Hn.cachedTwMergeConfig) && (Hn.didTwMergeConfigChange = true, Hn.cachedTwMergeConfig = x.twMergeConfig);
    const b = Fr(o == null ? void 0 : o.slots), w = Fr(i) ? {} : { base: ei(n == null ? void 0 : n.base, b && (o == null ? void 0 : o.base)), ...i }, D = b ? w : Vx({ ...o == null ? void 0 : o.slots }, Fr(w) ? { base: n == null ? void 0 : n.base } : w), F = Fr(o == null ? void 0 : o.compoundVariants) ? c : Tg(o == null ? void 0 : o.compoundVariants, c), B = (Z) => {
      if (Fr(y) && Fr(i) && b) return t(m, Z == null ? void 0 : Z.class, Z == null ? void 0 : Z.className)(x);
      if (F && !Array.isArray(F)) throw new TypeError(`The "compoundVariants" prop must be an array. Received: ${typeof F}`);
      if (f && !Array.isArray(f)) throw new TypeError(`The "compoundSlots" prop must be an array. Received: ${typeof f}`);
      const U = (A, k = y, N = null, O = null) => {
        const Y = k[A];
        if (!Y || Fr(Y)) return null;
        const V = (O == null ? void 0 : O[A]) ?? (Z == null ? void 0 : Z[A]);
        if (V === null) return null;
        const q = Pu(V);
        if (typeof q == "object") return null;
        const ne = h == null ? void 0 : h[A], K = q ?? Pu(ne);
        return Y[K || "false"];
      }, P = () => {
        if (!y) return null;
        const A = Object.keys(y), k = [];
        for (let N = 0; N < A.length; N++) {
          const O = U(A[N], y);
          O && k.push(O);
        }
        return k;
      }, E = (A, k) => {
        if (!y || typeof y != "object") return null;
        const N = [];
        for (const O in y) {
          const Y = U(O, y, A, k), V = A === "base" && typeof Y == "string" ? Y : Y && Y[A];
          V && N.push(V);
        }
        return N;
      }, S = {};
      for (const A in Z) {
        const k = Z[A];
        k !== void 0 && (S[A] = k);
      }
      const $ = (A, k) => {
        var _a10;
        const N = typeof (Z == null ? void 0 : Z[A]) == "object" ? { [A]: (_a10 = Z[A]) == null ? void 0 : _a10.initial } : {};
        return { ...h, ...S, ...N, ...k };
      }, J = (A = [], k) => {
        const N = [], O = A.length;
        for (let Y = 0; Y < O; Y++) {
          const { class: V, className: q, ...ne } = A[Y];
          let K = true;
          const R = $(null, k);
          for (const L in ne) {
            const G = ne[L], Q = R[L];
            if (Array.isArray(G)) {
              if (!G.includes(Q)) {
                K = false;
                break;
              }
            } else {
              if ((G == null || G === false) && (Q == null || Q === false)) continue;
              if (Q !== G) {
                K = false;
                break;
              }
            }
          }
          K && (V && N.push(V), q && N.push(q));
        }
        return N;
      }, W = (A) => {
        const k = J(F, A);
        if (!Array.isArray(k)) return k;
        const N = {}, O = t;
        for (let Y = 0; Y < k.length; Y++) {
          const V = k[Y];
          if (typeof V == "string") N.base = O(N.base, V)(x);
          else if (typeof V == "object") for (const q in V) N[q] = O(N[q], V[q])(x);
        }
        return N;
      }, C = (A) => {
        if (f.length < 1) return null;
        const k = {}, N = $(null, A);
        for (let O = 0; O < f.length; O++) {
          const { slots: Y = [], class: V, className: q, ...ne } = f[O];
          if (!Fr(ne)) {
            let K = true;
            for (const R in ne) {
              const L = N[R], G = ne[R];
              if (L === void 0 || (Array.isArray(G) ? !G.includes(L) : G !== L)) {
                K = false;
                break;
              }
            }
            if (!K) continue;
          }
          for (let K = 0; K < Y.length; K++) {
            const R = Y[K];
            k[R] || (k[R] = []), k[R].push([V, q]);
          }
        }
        return k;
      };
      if (!Fr(i) || !b) {
        const A = {};
        if (typeof D == "object" && !Fr(D)) {
          const k = t;
          for (const N in D) A[N] = (O) => {
            const Y = W(O), V = C(O);
            return k(D[N], E(N, O), Y ? Y[N] : void 0, V ? V[N] : void 0, O == null ? void 0 : O.class, O == null ? void 0 : O.className)(x);
          };
        }
        return A;
      }
      return t(m, P(), J(F), Z == null ? void 0 : Z.class, Z == null ? void 0 : Z.className)(x);
    }, M = () => {
      if (!(!y || typeof y != "object")) return Object.keys(y);
    };
    return B.variantKeys = M(), B.extend = o, B.base = m, B.slots = D, B.variants = y, B.defaultVariants = h, B.compoundSlots = f, B.compoundVariants = F, B;
  };
  return { tv: e, createTV: (n) => (a, o) => e(a, o ? Nl(n, o) : n) };
}, Kx = (t) => Fr(t) ? vg : yx({ ...t, extend: { theme: t.theme, classGroups: t.classGroups, conflictingClassGroupModifiers: t.conflictingClassGroupModifiers, conflictingClassGroups: t.conflictingClassGroups, ...t.extend } }), Xx = (t, e) => {
  const r = ei(t);
  return !r || !((e == null ? void 0 : e.twMerge) ?? true) ? r : ((!Hn.cachedTwMerge || Hn.didTwMergeConfigChange) && (Hn.didTwMergeConfigChange = false, Hn.cachedTwMerge = Kx(Hn.cachedTwMergeConfig)), Hn.cachedTwMerge(r) || void 0);
}, Zx = (...t) => (e) => Xx(t, e), { tv: Ag } = Yx(Zx);
const $u = Ag({ base: "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", variants: { variant: { default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs", destructive: "bg-destructive hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 text-white shadow-xs", outline: "bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 border shadow-xs", secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-xs", ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50", link: "text-primary underline-offset-4 hover:underline" }, size: { default: "h-9 px-4 py-2 has-[>svg]:px-3", sm: "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5", lg: "h-10 rounded-md px-6 has-[>svg]:px-4", icon: "size-9", "icon-sm": "size-8", "icon-lg": "size-10" } }, defaultVariants: { variant: "default", size: "default" } });
var Jx = _("<a><!></a>"), Qx = _("<button><!></button>");
function tt(t, e) {
  Be(e, true);
  let r = oe(e, "class", 3, void 0), n = oe(e, "variant", 3, "default"), a = oe(e, "size", 3, "default"), o = oe(e, "ref", 15, null), i = oe(e, "href", 3, void 0), l = oe(e, "type", 3, "button"), c = oe(e, "disabled", 3, void 0), f = oe(e, "children", 3, void 0), v = ft(e, ["$$slots", "$$events", "$$legacy", "class", "variant", "size", "ref", "href", "type", "disabled", "children"]);
  var x = ke(), m = ae(x);
  {
    var y = (b) => {
      var w = Jx();
      Gt(w, (F) => ({ "data-slot": "button", class: F, href: c() ? void 0 : i(), "aria-disabled": c(), role: c() ? "link" : void 0, tabindex: c() ? -1 : void 0, ...v }), [() => Je($u({ variant: n(), size: a() }), r())]);
      var D = d(w);
      bt(D, () => f() ?? ut), Qn(w, (F) => o(F), () => o()), u(b, w);
    }, h = (b) => {
      var w = Qx();
      Gt(w, (F) => ({ "data-slot": "button", class: F, type: l(), disabled: c(), ...v }), [() => Je($u({ variant: n(), size: a() }), r())]);
      var D = d(w);
      bt(D, () => f() ?? ut), Qn(w, (F) => o(F), () => o()), u(b, w);
    };
    I(m, (b) => {
      i() ? b(y) : b(h, -1);
    });
  }
  u(t, x), Fe();
}
const e0 = Ag({ base: "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] [&>svg]:pointer-events-none [&>svg]:size-3", variants: { variant: { default: "bg-primary text-primary-foreground [a&]:hover:bg-primary/90 border-transparent", secondary: "bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90 border-transparent", destructive: "bg-destructive [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/70 border-transparent text-white", outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground" } }, defaultVariants: { variant: "default" } });
function Cr(t, e) {
  Be(e, true);
  let r = oe(e, "ref", 15, null), n = oe(e, "href", 3, void 0), a = oe(e, "class", 3, void 0), o = oe(e, "variant", 3, "default"), i = oe(e, "children", 3, void 0), l = ft(e, ["$$slots", "$$events", "$$legacy", "ref", "href", "class", "variant", "children"]);
  var c = ke(), f = ae(c);
  mp(f, () => n() ? "a" : "span", false, (v, x) => {
    Qn(v, (h) => r(h), () => r()), Gt(v, (h) => ({ "data-slot": "badge", href: n(), class: h, ...l }), [() => Je(e0({ variant: o() }), a())]);
    var m = ke(), y = ae(m);
    bt(y, () => i() ?? ut), u(x, m);
  }), u(t, c), Fe();
}
var t0 = _("<input/>"), r0 = _("<input/>");
function $n(t, e) {
  Be(e, true);
  let r = oe(e, "ref", 15, null), n = oe(e, "value", 15), a = oe(e, "files", 15), o = oe(e, "data-slot", 3, "input"), i = ft(e, ["$$slots", "$$events", "$$legacy", "ref", "value", "type", "files", "class", "data-slot"]);
  var l = ke(), c = ae(l);
  {
    var f = (x) => {
      var m = t0();
      Gt(m, (y) => ({ "data-slot": o(), class: y, type: "file", ...i }), [() => Je("selection:bg-primary dark:bg-input/30 selection:text-primary-foreground border-input ring-offset-background placeholder:text-muted-foreground flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 pt-1.5 text-sm font-medium shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50", "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]", "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive", e.class)], void 0, void 0, void 0, true), Qn(m, (y) => r(y), () => r()), l_(m, a), qn(m, n), u(x, m);
    }, v = (x) => {
      var m = r0();
      Gt(m, (y) => ({ "data-slot": o(), class: y, type: e.type, ...i }), [() => Je("border-input bg-background selection:bg-primary dark:bg-input/30 selection:text-primary-foreground ring-offset-background placeholder:text-muted-foreground flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]", "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive", e.class)], void 0, void 0, void 0, true), Qn(m, (y) => r(y), () => r()), qn(m, n), u(x, m);
    };
    I(c, (x) => {
      e.type === "file" ? x(f) : x(v, -1);
    });
  }
  u(t, l), Fe();
}
function n0(t) {
  return typeof t == "function";
}
function po(t) {
  return t !== null && typeof t == "object";
}
const a0 = ["string", "number", "bigint", "boolean"];
function Rl(t) {
  return t == null || a0.includes(typeof t) ? true : Array.isArray(t) ? t.every((e) => Rl(e)) : typeof t == "object" ? Object.getPrototypeOf(t) === Object.prototype : false;
}
const hs = Symbol("box"), Ti = Symbol("is-writable");
function Ke(t, e) {
  const r = H(t);
  return e ? { [hs]: true, [Ti]: true, get current() {
    return s(r);
  }, set current(n) {
    e(n);
  } } : { [hs]: true, get current() {
    return t();
  } };
}
function vo(t) {
  return po(t) && hs in t;
}
function Bc(t) {
  return vo(t) && Ti in t;
}
function s0(t) {
  return vo(t) ? t : n0(t) ? Ke(t) : ti(t);
}
function o0(t) {
  return Object.entries(t).reduce((e, [r, n]) => vo(n) ? (Bc(n) ? Object.defineProperty(e, r, { get() {
    return n.current;
  }, set(a) {
    n.current = a;
  } }) : Object.defineProperty(e, r, { get() {
    return n.current;
  } }), e) : Object.assign(e, { [r]: n }), {});
}
function i0(t) {
  return Bc(t) ? { [hs]: true, get current() {
    return t.current;
  } } : t;
}
function ti(t) {
  let e = te(nt(t));
  return { [hs]: true, [Ti]: true, get current() {
    return s(e);
  }, set current(r) {
    g(e, r, true);
  } };
}
function Va(t) {
  let e = te(nt(t));
  return { [hs]: true, [Ti]: true, get current() {
    return s(e);
  }, set current(r) {
    g(e, r, true);
  } };
}
Va.from = s0;
Va.with = Ke;
Va.flatten = o0;
Va.readonly = i0;
Va.isBox = vo;
Va.isWritableBox = Bc;
function l0(...t) {
  return function(e) {
    var _a10;
    for (const r of t) if (r) {
      if (e.defaultPrevented) return;
      typeof r == "function" ? r.call(this, e) : (_a10 = r.current) == null ? void 0 : _a10.call(this, e);
    }
  };
}
var Nu = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g, c0 = /\n/g, d0 = /^\s*/, u0 = /^(\*?[-#/*\\\w]+(\[[0-9a-z_-]+\])?)\s*/, f0 = /^:\s*/, p0 = /^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};])+)/, v0 = /^[;\s]*/, g0 = /^\s+|\s+$/g, m0 = `
`, Ru = "/", Mu = "*", Ea = "", h0 = "comment", _0 = "declaration";
function b0(t, e) {
  if (typeof t != "string") throw new TypeError("First argument must be a string");
  if (!t) return [];
  e = e || {};
  var r = 1, n = 1;
  function a(h) {
    var b = h.match(c0);
    b && (r += b.length);
    var w = h.lastIndexOf(m0);
    n = ~w ? h.length - w : n + h.length;
  }
  function o() {
    var h = { line: r, column: n };
    return function(b) {
      return b.position = new i(h), f(), b;
    };
  }
  function i(h) {
    this.start = h, this.end = { line: r, column: n }, this.source = e.source;
  }
  i.prototype.content = t;
  function l(h) {
    var b = new Error(e.source + ":" + r + ":" + n + ": " + h);
    if (b.reason = h, b.filename = e.source, b.line = r, b.column = n, b.source = t, !e.silent) throw b;
  }
  function c(h) {
    var b = h.exec(t);
    if (b) {
      var w = b[0];
      return a(w), t = t.slice(w.length), b;
    }
  }
  function f() {
    c(d0);
  }
  function v(h) {
    var b;
    for (h = h || []; b = x(); ) b !== false && h.push(b);
    return h;
  }
  function x() {
    var h = o();
    if (!(Ru != t.charAt(0) || Mu != t.charAt(1))) {
      for (var b = 2; Ea != t.charAt(b) && (Mu != t.charAt(b) || Ru != t.charAt(b + 1)); ) ++b;
      if (b += 2, Ea === t.charAt(b - 1)) return l("End of comment missing");
      var w = t.slice(2, b - 2);
      return n += 2, a(w), t = t.slice(b), n += 2, h({ type: h0, comment: w });
    }
  }
  function m() {
    var h = o(), b = c(u0);
    if (b) {
      if (x(), !c(f0)) return l("property missing ':'");
      var w = c(p0), D = h({ type: _0, property: zu(b[0].replace(Nu, Ea)), value: w ? zu(w[0].replace(Nu, Ea)) : Ea });
      return c(v0), D;
    }
  }
  function y() {
    var h = [];
    v(h);
    for (var b; b = m(); ) b !== false && (h.push(b), v(h));
    return h;
  }
  return f(), y();
}
function zu(t) {
  return t ? t.replace(g0, Ea) : Ea;
}
function x0(t, e) {
  let r = null;
  if (!t || typeof t != "string") return r;
  const n = b0(t), a = typeof e == "function";
  return n.forEach((o) => {
    if (o.type !== "declaration") return;
    const { property: i, value: l } = o;
    a ? e(i, l, o) : l && (r = r || {}, r[i] = l);
  }), r;
}
const y0 = /\d/, w0 = ["-", "_", "/", "."];
function k0(t = "") {
  if (!y0.test(t)) return t !== t.toLowerCase();
}
function S0(t) {
  const e = [];
  let r = "", n, a;
  for (const o of t) {
    const i = w0.includes(o);
    if (i === true) {
      e.push(r), r = "", n = void 0;
      continue;
    }
    const l = k0(o);
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
function Eg(t) {
  return t ? S0(t).map((e) => A0(e)).join("") : "";
}
function T0(t) {
  return E0(Eg(t || ""));
}
function A0(t) {
  return t ? t[0].toUpperCase() + t.slice(1) : "";
}
function E0(t) {
  return t ? t[0].toLowerCase() + t.slice(1) : "";
}
function Mo(t) {
  if (!t) return {};
  const e = {};
  function r(n, a) {
    if (n.startsWith("-moz-") || n.startsWith("-webkit-") || n.startsWith("-ms-") || n.startsWith("-o-")) {
      e[Eg(n)] = a;
      return;
    }
    if (n.startsWith("--")) {
      e[n] = a;
      return;
    }
    e[T0(n)] = a;
  }
  return x0(t, r), e;
}
function Fc(...t) {
  return (...e) => {
    for (const r of t) typeof r == "function" && r(...e);
  };
}
function C0(t, e) {
  const r = RegExp(t, "g");
  return (n) => {
    if (typeof n != "string") throw new TypeError(`expected an argument of type string, but got ${typeof n}`);
    return n.match(r) ? n.replace(r, e) : n;
  };
}
const I0 = C0(/[A-Z]/, (t) => `-${t.toLowerCase()}`);
function P0(t) {
  if (!t || typeof t != "object" || Array.isArray(t)) throw new TypeError(`expected an argument of type object, but got ${typeof t}`);
  return Object.keys(t).map((e) => `${I0(e)}: ${t[e]};`).join(`
`);
}
function Cg(t = {}) {
  return P0(t).replace(`
`, " ");
}
const $0 = ["onabort", "onanimationcancel", "onanimationend", "onanimationiteration", "onanimationstart", "onauxclick", "onbeforeinput", "onbeforetoggle", "onblur", "oncancel", "oncanplay", "oncanplaythrough", "onchange", "onclick", "onclose", "oncompositionend", "oncompositionstart", "oncompositionupdate", "oncontextlost", "oncontextmenu", "oncontextrestored", "oncopy", "oncuechange", "oncut", "ondblclick", "ondrag", "ondragend", "ondragenter", "ondragleave", "ondragover", "ondragstart", "ondrop", "ondurationchange", "onemptied", "onended", "onerror", "onfocus", "onfocusin", "onfocusout", "onformdata", "ongotpointercapture", "oninput", "oninvalid", "onkeydown", "onkeypress", "onkeyup", "onload", "onloadeddata", "onloadedmetadata", "onloadstart", "onlostpointercapture", "onmousedown", "onmouseenter", "onmouseleave", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "onpaste", "onpause", "onplay", "onplaying", "onpointercancel", "onpointerdown", "onpointerenter", "onpointerleave", "onpointermove", "onpointerout", "onpointerover", "onpointerup", "onprogress", "onratechange", "onreset", "onresize", "onscroll", "onscrollend", "onsecuritypolicyviolation", "onseeked", "onseeking", "onselect", "onselectionchange", "onselectstart", "onslotchange", "onstalled", "onsubmit", "onsuspend", "ontimeupdate", "ontoggle", "ontouchcancel", "ontouchend", "ontouchmove", "ontouchstart", "ontransitioncancel", "ontransitionend", "ontransitionrun", "ontransitionstart", "onvolumechange", "onwaiting", "onwebkitanimationend", "onwebkitanimationiteration", "onwebkitanimationstart", "onwebkittransitionend", "onwheel"], N0 = new Set($0);
function R0(t) {
  return N0.has(t);
}
function tr(...t) {
  const e = { ...t[0] };
  for (let r = 1; r < t.length; r++) {
    const n = t[r];
    if (n) {
      for (const a of Object.keys(n)) {
        const o = e[a], i = n[a], l = typeof o == "function", c = typeof i == "function";
        if (l && R0(a)) {
          const f = o, v = i;
          e[a] = l0(f, v);
        } else if (l && c) e[a] = Fc(o, i);
        else if (a === "class") {
          const f = Rl(o), v = Rl(i);
          f && v ? e[a] = Ws(o, i) : f ? e[a] = Ws(o) : v && (e[a] = Ws(i));
        } else if (a === "style") {
          const f = typeof o == "object", v = typeof i == "object", x = typeof o == "string", m = typeof i == "string";
          if (f && v) e[a] = { ...o, ...i };
          else if (f && m) {
            const y = Mo(i);
            e[a] = { ...o, ...y };
          } else if (x && v) {
            const y = Mo(o);
            e[a] = { ...y, ...i };
          } else if (x && m) {
            const y = Mo(o), h = Mo(i);
            e[a] = { ...y, ...h };
          } else f ? e[a] = o : v ? e[a] = i : x ? e[a] = o : m && (e[a] = i);
        } else e[a] = i !== void 0 ? i : o;
      }
      for (const a of Object.getOwnPropertySymbols(n)) {
        const o = e[a], i = n[a];
        e[a] = i !== void 0 ? i : o;
      }
    }
  }
  return typeof e.style == "object" && (e.style = Cg(e.style).replaceAll(`
`, " ")), e.hidden === false && (e.hidden = void 0, delete e.hidden), e.disabled === false && (e.disabled = void 0, delete e.disabled), e;
}
const M0 = { position: "absolute", width: "1px", height: "1px", padding: "0", margin: "-1px", overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", borderWidth: "0", transform: "translateX(-100%)" }, z0 = Cg(M0), O0 = typeof window < "u" ? window : void 0;
function D0(t) {
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
    __privateAdd(this, _t5, te(0));
    __privateAdd(this, _r5, te(0));
    __privateAdd(this, _n5, Kn || -1);
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
    if (a === void 0) a = __privateMethod(this, _Ou_instances, a_fn).call(this, 0), n.set(e, a), g(__privateGet(this, _r5), super.size), Cn(l);
    else if (o !== r) {
      Cn(a);
      var c = l.reactions === null ? null : new Set(l.reactions), f = c === null || !((_a10 = a.reactions) == null ? void 0 : _a10.every((v) => c.has(v)));
      f && Cn(l);
    }
    return i;
  }
  delete(e) {
    var r = __privateGet(this, _e4), n = r.get(e), a = super.delete(e);
    return n !== void 0 && (r.delete(e), g(n, -1)), a && (g(__privateGet(this, _r5), super.size), Cn(__privateGet(this, _t5))), a;
  }
  clear() {
    if (super.size !== 0) {
      super.clear();
      var e = __privateGet(this, _e4);
      g(__privateGet(this, _r5), 0);
      for (var r of e.values()) g(r, -1);
      Cn(__privateGet(this, _t5)), e.clear();
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
  return Kn === __privateGet(this, _n5) ? te(e) : Zn(e);
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
class L0 {
  constructor(e = {}) {
    __privateAdd(this, _e5);
    __privateAdd(this, _t6);
    const { window: r = O0, document: n = r == null ? void 0 : r.document } = e;
    r !== void 0 && (__privateSet(this, _e5, n), __privateSet(this, _t6, Ff((a) => {
      const o = xn(r, "focusin", a), i = xn(r, "focusout", a);
      return () => {
        o(), i();
      };
    })));
  }
  get current() {
    var _a10;
    return (_a10 = __privateGet(this, _t6)) == null ? void 0 : _a10.call(this), __privateGet(this, _e5) ? D0(__privateGet(this, _e5)) : null;
  }
}
_e5 = new WeakMap();
_t6 = new WeakMap();
new L0();
function j0(t) {
  return typeof t == "function";
}
function B0(t, e) {
  if (j0(t)) {
    const n = t();
    return n === void 0 ? e : n;
  }
  return t === void 0 ? e : t;
}
class ya {
  constructor(e) {
    __privateAdd(this, _e6);
    __privateAdd(this, _t7);
    __privateSet(this, _e6, e), __privateSet(this, _t7, Symbol(e));
  }
  get key() {
    return __privateGet(this, _t7);
  }
  exists() {
    return oh(__privateGet(this, _t7));
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
    return sh(__privateGet(this, _t7), e);
  }
}
_e6 = new WeakMap();
_t7 = new WeakMap();
function Ai(t, e) {
  let r = te(null);
  const n = H(() => B0(e, 250));
  function a(...o) {
    if (s(r)) s(r).timeout && clearTimeout(s(r).timeout);
    else {
      let i, l;
      const c = new Promise((f, v) => {
        i = f, l = v;
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
function F0(t, e) {
  switch (t) {
    case "post":
      Ut(e);
      break;
    case "pre":
      mi(e);
      break;
  }
}
function Ig(t, e, r, n = {}) {
  const { lazy: a = false } = n;
  let o = !a, i = Array.isArray(t) ? [] : void 0;
  F0(e, () => {
    const l = Array.isArray(t) ? t.map((f) => f()) : t();
    if (!o) {
      o = true, i = l;
      return;
    }
    const c = yr(() => r(l, i));
    return i = l, c;
  });
}
function Dn(t, e, r) {
  Ig(t, "post", e, r);
}
function U0(t, e, r) {
  Ig(t, "pre", e, r);
}
Dn.pre = U0;
class Uc {
  constructor() {
    __privateAdd(this, _e7, te(false));
    Ut(() => (yr(() => g(__privateGet(this, _e7), true)), () => {
      g(__privateGet(this, _e7), false);
    }));
  }
  get current() {
    return s(__privateGet(this, _e7));
  }
}
_e7 = new WeakMap();
class G0 {
  constructor(e, r) {
    __privateAdd(this, _e8, () => {
    });
    __privateAdd(this, _t8, H(() => __privateGet(this, _e8).call(this)));
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
function W0(t) {
  Ut(() => () => {
    t();
  });
}
function Pg(t) {
  dc().then(t);
}
const V0 = 1, H0 = 9, q0 = 11;
function Y0(t) {
  return po(t) && t.nodeType === V0 && typeof t.nodeName == "string";
}
function $g(t) {
  return po(t) && t.nodeType === H0;
}
function K0(t) {
  var _a10;
  return po(t) && ((_a10 = t.constructor) == null ? void 0 : _a10.name) === "VisualViewport";
}
function X0(t) {
  return po(t) && t.nodeType !== void 0;
}
function Z0(t) {
  return X0(t) && t.nodeType === q0 && "host" in t;
}
function J0(t) {
  return $g(t) ? t : K0(t) ? t.document : (t == null ? void 0 : t.ownerDocument) ?? document;
}
function Ng(t) {
  var _a10;
  return Z0(t) ? Ng(t.host) : $g(t) ? t.defaultView ?? window : Y0(t) ? ((_a10 = t.ownerDocument) == null ? void 0 : _a10.defaultView) ?? window : window;
}
function Q0(t) {
  let e = t.activeElement;
  for (; e == null ? void 0 : e.shadowRoot; ) {
    const r = e.shadowRoot.activeElement;
    if (r === e) break;
    e = r;
  }
  return e;
}
class e1 {
  constructor(e) {
    __publicField(this, "element");
    __privateAdd(this, _e9, H(() => this.element.current ? this.element.current.getRootNode() ?? document : document));
    __publicField(this, "getDocument", () => J0(this.root));
    __publicField(this, "getWindow", () => this.getDocument().defaultView ?? window);
    __publicField(this, "getActiveElement", () => Q0(this.root));
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
  return { [zh()]: (r) => vo(t) ? (t.current = r, yr(() => e == null ? void 0 : e(r)), () => {
    "isConnected" in r && r.isConnected || (t.current = null, e == null ? void 0 : e(null));
  }) : (t(r), yr(() => e == null ? void 0 : e(r)), () => {
    "isConnected" in r && r.isConnected || (t(null), e == null ? void 0 : e(null));
  }) };
}
function Gc(t) {
  return t ? "true" : "false";
}
function t1(t) {
  return t ? "true" : void 0;
}
function La(t) {
  return t ? "" : void 0;
}
function Rg(t) {
  return t ? true : void 0;
}
function Wc(t) {
  return t ? "open" : "closed";
}
function r1(t) {
  return t ? "checked" : "unchecked";
}
function n1(t, e) {
  return t ? "true" : "false";
}
class a1 {
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
  const e = new a1(t);
  return { ...e.attrs, selector: e.selector, getAttr: e.getAttr };
}
const Ml = "ArrowDown", Vc = "ArrowLeft", Hc = "ArrowRight", zl = "ArrowUp", s1 = "End", qc = "Enter", o1 = "Home", Yc = " ";
function i1(t) {
  return window.getComputedStyle(t).getPropertyValue("direction");
}
function l1(t = "ltr", e = "horizontal") {
  return { horizontal: t === "rtl" ? Vc : Hc, vertical: Ml }[e];
}
function c1(t = "ltr", e = "horizontal") {
  return { horizontal: t === "rtl" ? Hc : Vc, vertical: zl }[e];
}
function d1(t = "ltr", e = "horizontal") {
  return ["ltr", "rtl"].includes(t) || (t = "ltr"), ["horizontal", "vertical"].includes(e) || (e = "horizontal"), { nextKey: l1(t, e), prevKey: c1(t, e) };
}
function u1(t) {
  return t instanceof HTMLElement;
}
class f1 {
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
    const i = o.indexOf(e), l = i1(a), { nextKey: c, prevKey: f } = d1(l, __privateGet(this, _e11).orientation.current), v = __privateGet(this, _e11).loop.current, x = { [c]: i + 1, [f]: i - 1, [o1]: 0, [s1]: o.length - 1 };
    if (n) {
      const h = c === Ml ? Hc : Ml, b = f === zl ? Vc : zl;
      x[h] = i + 1, x[b] = i - 1;
    }
    let m = x[r.key];
    if (m === void 0) return;
    r.preventDefault(), m < 0 && v ? m = o.length - 1 : m === o.length && v && (m = 0);
    const y = o[m];
    if (y) return y.focus(), __privateGet(this, _t10).current = y.id, (_b4 = (_a10 = __privateGet(this, _e11)).onCandidateFocus) == null ? void 0 : _b4.call(_a10, y), y;
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
    !r || !u1(r) || r.focus();
  }
}
_e11 = new WeakMap();
_t10 = new WeakMap();
class p1 {
  constructor(e) {
    __privateAdd(this, _p1_instances);
    __privateAdd(this, _e12);
    __privateAdd(this, _t11, null);
    __privateSet(this, _e12, e), W0(() => __privateMethod(this, _p1_instances, r_fn).call(this));
  }
  run(e) {
    __privateMethod(this, _p1_instances, r_fn).call(this);
    const r = __privateGet(this, _e12).ref.current;
    if (r) {
      if (typeof r.getAnimations != "function") {
        __privateMethod(this, _p1_instances, n_fn).call(this, e);
        return;
      }
      __privateSet(this, _t11, window.requestAnimationFrame(() => {
        const n = r.getAnimations();
        if (n.length === 0) {
          __privateMethod(this, _p1_instances, n_fn).call(this, e);
          return;
        }
        Promise.allSettled(n.map((a) => a.finished)).then(() => {
          __privateMethod(this, _p1_instances, n_fn).call(this, e);
        });
      }));
    }
  }
}
_e12 = new WeakMap();
_t11 = new WeakMap();
_p1_instances = new WeakSet();
r_fn = function() {
  __privateGet(this, _t11) && (window.cancelAnimationFrame(__privateGet(this, _t11)), __privateSet(this, _t11, null));
};
n_fn = function(e) {
  const r = () => {
    e();
  };
  __privateGet(this, _e12).afterTick ? Pg(r) : r();
};
class v1 {
  constructor(e) {
    __privateAdd(this, _e13);
    __privateAdd(this, _t12);
    __privateAdd(this, _r6);
    __privateAdd(this, _n6, te(false));
    __privateSet(this, _e13, e), g(__privateGet(this, _n6), e.open.current, true), __privateSet(this, _t12, e.enabled ?? true), __privateSet(this, _r6, new p1({ ref: __privateGet(this, _e13).ref, afterTick: __privateGet(this, _e13).open })), Dn(() => __privateGet(this, _e13).open.current, (r) => {
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
function ri() {
}
function $r(t, e) {
  return `bits-${t}`;
}
globalThis.bitsIdCounter ?? (globalThis.bitsIdCounter = { current: 0 });
function g1(t = "bits") {
  return globalThis.bitsIdCounter.current++, `${t}-${globalThis.bitsIdCounter.current}`;
}
var m1 = _("<input/>"), h1 = _("<input/>");
function _1(t, e) {
  Be(e, true);
  let r = oe(e, "value", 15), n = ft(e, ["$$slots", "$$events", "$$legacy", "value"]);
  const a = H(() => tr(n, { "aria-hidden": "true", tabindex: -1, style: z0 }));
  var o = ke(), i = ae(o);
  {
    var l = (f) => {
      var v = m1();
      Gt(v, () => ({ ...s(a), value: r() }), void 0, void 0, void 0, void 0, true), u(f, v);
    }, c = (f) => {
      var v = h1();
      Gt(v, () => ({ ...s(a) }), void 0, void 0, void 0, void 0, true), qn(v, r), u(f, v);
    };
    I(i, (f) => {
      s(a).type === "checkbox" ? f(l) : f(c, -1);
    });
  }
  u(t, o), Fe();
}
const Kc = Ha({ component: "collapsible", parts: ["root", "content", "trigger"] }), Xc = new ya("Collapsible.Root");
const _Zc = class _Zc {
  constructor(e) {
    __publicField(this, "opts");
    __publicField(this, "attachment");
    __privateAdd(this, _e14, te(null));
    __publicField(this, "contentPresence");
    __privateAdd(this, _t13, te(void 0));
    __privateAdd(this, _r7, H(() => ({ id: this.opts.id.current, "data-state": Wc(this.opts.open.current), "data-disabled": La(this.opts.disabled.current), [Kc.root]: "", ...this.attachment })));
    this.opts = e, this.toggleOpen = this.toggleOpen.bind(this), this.attachment = kr(this.opts.ref), this.contentPresence = new v1({ ref: Ke(() => this.contentNode), open: this.opts.open, onComplete: () => {
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
    __privateAdd(this, _e15, H(() => this.opts.hiddenUntilFound.current ? this.root.opts.open.current : this.opts.forceMount.current || this.root.opts.open.current));
    __privateAdd(this, _t14);
    __privateAdd(this, _r8, te(false));
    __privateAdd(this, _n7, te(0));
    __privateAdd(this, _a6, te(0));
    __privateAdd(this, _s5, H(() => ({ open: this.root.opts.open.current })));
    __privateAdd(this, _o5, H(() => ({ id: this.opts.id.current, style: { "--bits-collapsible-content-height": s(__privateGet(this, _a6)) ? `${s(__privateGet(this, _a6))}px` : void 0, "--bits-collapsible-content-width": s(__privateGet(this, _n7)) ? `${s(__privateGet(this, _n7))}px` : void 0 }, hidden: this.opts.hiddenUntilFound.current && !this.root.opts.open.current ? "until-found" : void 0, "data-state": Wc(this.root.opts.open.current), "data-disabled": La(this.root.opts.disabled.current), [Kc.content]: "", ...this.opts.hiddenUntilFound.current && !this.shouldRender ? {} : { hidden: this.opts.hiddenUntilFound.current ? !this.shouldRender : this.opts.forceMount.current ? void 0 : !this.shouldRender }, ...this.attachment })));
    this.opts = e, this.root = r, g(__privateGet(this, _r8), r.opts.open.current, true), this.root.contentId = this.opts.id.current, this.attachment = kr(this.opts.ref, (n) => this.root.contentNode = n), Dn.pre(() => this.opts.id.current, (n) => {
      this.root.contentId = n;
    }), mi(() => {
      const n = requestAnimationFrame(() => {
        g(__privateGet(this, _r8), false);
      });
      return () => {
        cancelAnimationFrame(n);
      };
    }), Dn.pre([() => this.opts.ref.current, () => this.opts.hiddenUntilFound.current], ([n, a]) => !n || !a ? void 0 : xn(n, "beforematch", () => {
      this.root.opts.open.current || requestAnimationFrame(() => {
        this.root.opts.open.current = true;
      });
    })), Dn([() => this.opts.ref.current, () => this.present], ([n]) => {
      n && Pg(() => {
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
    __privateAdd(this, _e16, H(() => this.opts.disabled.current || this.root.opts.disabled.current));
    __privateAdd(this, _t15, H(() => ({ id: this.opts.id.current, type: "button", disabled: s(__privateGet(this, _e16)), "aria-controls": this.root.contentId, "aria-expanded": Gc(this.root.opts.open.current), "data-state": Wc(this.root.opts.open.current), "data-disabled": La(s(__privateGet(this, _e16))), [Kc.trigger]: "", onclick: this.onclick, onkeydown: this.onkeydown, ...this.attachment })));
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
var b1 = _("<div><!></div>");
function x1(t, e) {
  const r = Pr();
  Be(e, true);
  let n = oe(e, "id", 19, () => $r(r)), a = oe(e, "ref", 15, null), o = oe(e, "open", 15, false), i = oe(e, "disabled", 3, false), l = oe(e, "onOpenChange", 3, ri), c = oe(e, "onOpenChangeComplete", 3, ri), f = ft(e, ["$$slots", "$$events", "$$legacy", "children", "child", "id", "ref", "open", "disabled", "onOpenChange", "onOpenChangeComplete"]);
  const v = Zc.create({ open: Ke(() => o(), (w) => {
    o(w), l()(w);
  }), disabled: Ke(() => i()), id: Ke(() => n()), ref: Ke(() => a(), (w) => a(w)), onOpenChangeComplete: Ke(() => c()) }), x = H(() => tr(f, v.props));
  var m = ke(), y = ae(m);
  {
    var h = (w) => {
      var D = ke(), F = ae(D);
      bt(F, () => e.child, () => ({ props: s(x) })), u(w, D);
    }, b = (w) => {
      var D = b1();
      Gt(D, () => ({ ...s(x) }));
      var F = d(D);
      bt(F, () => e.children ?? ut), u(w, D);
    };
    I(y, (w) => {
      e.child ? w(h) : w(b, -1);
    });
  }
  u(t, m), Fe();
}
var y1 = _("<div><!></div>");
function w1(t, e) {
  const r = Pr();
  Be(e, true);
  let n = oe(e, "ref", 15, null), a = oe(e, "forceMount", 3, false), o = oe(e, "hiddenUntilFound", 3, false), i = oe(e, "id", 19, () => $r(r)), l = ft(e, ["$$slots", "$$events", "$$legacy", "child", "ref", "forceMount", "hiddenUntilFound", "children", "id"]);
  const c = Jc.create({ id: Ke(() => i()), forceMount: Ke(() => a()), hiddenUntilFound: Ke(() => o()), ref: Ke(() => n(), (h) => n(h)) }), f = H(() => tr(l, c.props));
  var v = ke(), x = ae(v);
  {
    var m = (h) => {
      var b = ke(), w = ae(b);
      {
        let D = H(() => ({ ...c.snippetProps, props: s(f) }));
        bt(w, () => e.child, () => s(D));
      }
      u(h, b);
    }, y = (h) => {
      var b = y1();
      Gt(b, () => ({ ...s(f) }));
      var w = d(b);
      bt(w, () => e.children ?? ut), u(h, b);
    };
    I(x, (h) => {
      e.child ? h(m) : h(y, -1);
    });
  }
  u(t, v), Fe();
}
var k1 = _("<button><!></button>");
function S1(t, e) {
  const r = Pr();
  Be(e, true);
  let n = oe(e, "ref", 15, null), a = oe(e, "id", 19, () => $r(r)), o = oe(e, "disabled", 3, false), i = ft(e, ["$$slots", "$$events", "$$legacy", "children", "child", "ref", "id", "disabled"]);
  const l = Qc.create({ id: Ke(() => a()), ref: Ke(() => n(), (y) => n(y)), disabled: Ke(() => o()) }), c = H(() => tr(i, l.props));
  var f = ke(), v = ae(f);
  {
    var x = (y) => {
      var h = ke(), b = ae(h);
      bt(b, () => e.child, () => ({ props: s(c) })), u(y, h);
    }, m = (y) => {
      var h = k1();
      Gt(h, () => ({ ...s(c) }));
      var b = d(h);
      bt(b, () => e.children ?? ut), u(y, h);
    };
    I(v, (y) => {
      e.child ? y(x) : y(m, -1);
    });
  }
  u(t, f), Fe();
}
const T1 = Ha({ component: "separator", parts: ["root"] });
const _ed = class _ed {
  constructor(e) {
    __publicField(this, "opts");
    __publicField(this, "attachment");
    __privateAdd(this, _e17, H(() => ({ id: this.opts.id.current, role: this.opts.decorative.current ? "none" : "separator", "aria-orientation": this.opts.orientation.current, "aria-hidden": t1(this.opts.decorative.current), "data-orientation": this.opts.orientation.current, [T1.root]: "", ...this.attachment })));
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
var A1 = _("<div><!></div>");
function E1(t, e) {
  const r = Pr();
  Be(e, true);
  let n = oe(e, "id", 19, () => $r(r)), a = oe(e, "ref", 15, null), o = oe(e, "decorative", 3, false), i = oe(e, "orientation", 3, "horizontal"), l = ft(e, ["$$slots", "$$events", "$$legacy", "id", "ref", "child", "children", "decorative", "orientation"]);
  const c = ed.create({ ref: Ke(() => a(), (h) => a(h)), id: Ke(() => n()), decorative: Ke(() => o()), orientation: Ke(() => i()) }), f = H(() => tr(l, c.props));
  var v = ke(), x = ae(v);
  {
    var m = (h) => {
      var b = ke(), w = ae(b);
      bt(w, () => e.child, () => ({ props: s(f) })), u(h, b);
    }, y = (h) => {
      var b = A1();
      Gt(b, () => ({ ...s(f) }));
      var w = d(b);
      bt(w, () => e.children ?? ut), u(h, b);
    };
    I(x, (h) => {
      e.child ? h(m) : h(y, -1);
    });
  }
  u(t, v), Fe();
}
const C1 = Ha({ component: "label", parts: ["root"] });
const _td = class _td {
  constructor(e) {
    __publicField(this, "opts");
    __publicField(this, "attachment");
    __privateAdd(this, _e18, H(() => ({ id: this.opts.id.current, [C1.root]: "", onmousedown: this.onmousedown, ...this.attachment })));
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
var I1 = _("<label><!></label>");
function P1(t, e) {
  const r = Pr();
  Be(e, true);
  let n = oe(e, "id", 19, () => $r(r)), a = oe(e, "ref", 15, null), o = ft(e, ["$$slots", "$$events", "$$legacy", "children", "child", "id", "ref", "for"]);
  const i = td.create({ id: Ke(() => n()), ref: Ke(() => a(), (m) => a(m)) }), l = H(() => tr(o, i.props, { for: e.for }));
  var c = ke(), f = ae(c);
  {
    var v = (m) => {
      var y = ke(), h = ae(y);
      bt(h, () => e.child, () => ({ props: s(l) })), u(m, y);
    }, x = (m) => {
      var y = I1();
      Gt(y, () => ({ ...s(l), for: e.for }));
      var h = d(y);
      bt(h, () => e.children ?? ut), u(m, y);
    };
    I(f, (m) => {
      e.child ? m(v) : m(x, -1);
    });
  }
  u(t, c), Fe();
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
class Mg {
  constructor(e, r) {
    __privateAdd(this, _Mg_instances);
    __publicField(this, "state");
    __privateAdd(this, _e20);
    this.state = ti(e), __privateSet(this, _e20, r), this.dispatch = this.dispatch.bind(this);
  }
  dispatch(e) {
    this.state.current = __privateMethod(this, _Mg_instances, t_fn).call(this, e);
  }
}
_e20 = new WeakMap();
_Mg_instances = new WeakSet();
t_fn = function(e) {
  return __privateGet(this, _e20)[this.state.current][e] ?? this.state.current;
};
const Du = /* @__PURE__ */ new WeakMap(), $1 = 16, N1 = { mounted: { UNMOUNT: "unmounted", ANIMATION_OUT: "unmountSuspended" }, unmountSuspended: { MOUNT: "mounted", ANIMATION_END: "unmounted" }, unmounted: { MOUNT: "mounted" } };
class R1 {
  constructor(e) {
    __publicField(this, "opts");
    __privateAdd(this, _e21, te("none"));
    __privateAdd(this, _t17, te(nt({ display: "", animationName: "none" })));
    __publicField(this, "initialStatus");
    __publicField(this, "previousPresent");
    __publicField(this, "machine");
    __publicField(this, "present");
    __privateAdd(this, _r9, H(() => ["mounted", "unmountSuspended"].includes(this.machine.state.current)));
    this.opts = e, this.present = this.opts.open, this.initialStatus = e.open.current ? "mounted" : "unmounted", this.previousPresent = new G0(() => this.present.current), this.machine = new Mg(this.initialStatus, N1), this.handleAnimationEnd = this.handleAnimationEnd.bind(this), this.handleAnimationStart = this.handleAnimationStart.bind(this), M1(this), z1(this), O1(this);
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
    const r = this.styles.animationName || ni(this.opts.ref.current), n = r.includes(e.animationName) || r === "none";
    e.target === this.opts.ref.current && n && this.machine.dispatch("ANIMATION_END");
  }
  handleAnimationStart(e) {
    if (this.opts.ref.current && e.target === this.opts.ref.current) {
      const r = ni(this.opts.ref.current, true);
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
function M1(t) {
  Dn(() => t.present.current, () => {
    if (!t.opts.ref.current || !(t.present.current !== t.previousPresent.current)) return;
    const r = t.prevAnimationNameState, n = ni(t.opts.ref.current, true);
    if (t.styles.animationName = n, t.present.current) t.machine.dispatch("MOUNT");
    else if (n === "none" || t.styles.display === "none") t.machine.dispatch("UNMOUNT");
    else {
      const a = r !== n;
      t.previousPresent.current && a ? t.machine.dispatch("ANIMATION_OUT") : t.machine.dispatch("UNMOUNT");
    }
  });
}
function z1(t) {
  Dn(() => t.machine.state.current, () => {
    if (!t.opts.ref.current) return;
    const e = t.machine.state.current === "mounted" ? ni(t.opts.ref.current, true) : "none";
    t.prevAnimationNameState = e, t.styles.animationName = e;
  });
}
function O1(t) {
  Dn(() => t.opts.ref.current, () => {
    if (!t.opts.ref.current) return;
    const e = getComputedStyle(t.opts.ref.current);
    return t.styles = { display: e.display, animationName: e.animationName || "none" }, Fc(xn(t.opts.ref.current, "animationstart", t.handleAnimationStart), xn(t.opts.ref.current, "animationcancel", t.handleAnimationEnd), xn(t.opts.ref.current, "animationend", t.handleAnimationEnd));
  });
}
function ni(t, e = false) {
  if (!t) return "none";
  const r = performance.now(), n = Du.get(t);
  if (!e && n && r - n.timestamp < $1) return n.value;
  const a = getComputedStyle(t).animationName || "none";
  return Du.set(t, { value: a, timestamp: r }), a;
}
function Ei(t, e) {
  Be(e, true);
  const r = new R1({ open: Ke(() => e.open), ref: e.ref });
  var n = ke(), a = ae(n);
  {
    var o = (i) => {
      var l = ke(), c = ae(l);
      bt(c, () => e.presence ?? ut, () => ({ present: r.isPresent })), u(i, l);
    };
    I(a, (i) => {
      (e.forceMount || e.open || r.isPresent) && i(o);
    });
  }
  u(t, n), Fe();
}
const D1 = Ha({ component: "progress", parts: ["root"] });
const _rd = class _rd {
  constructor(e) {
    __publicField(this, "opts");
    __publicField(this, "attachment");
    __privateAdd(this, _e22, H(() => ({ role: "progressbar", value: this.opts.value.current, "aria-valuemin": this.opts.min.current, "aria-valuemax": this.opts.max.current, "aria-valuenow": this.opts.value.current === null ? void 0 : this.opts.value.current, "data-value": this.opts.value.current === null ? void 0 : this.opts.value.current, "data-state": L1(this.opts.value.current, this.opts.max.current), "data-max": this.opts.max.current, "data-min": this.opts.min.current, "data-indeterminate": this.opts.value.current === null ? "" : void 0, [D1.root]: "", ...this.attachment })));
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
function L1(t, e) {
  return t === null ? "indeterminate" : t === e ? "loaded" : "loading";
}
var j1 = _("<div><!></div>");
function B1(t, e) {
  const r = Pr();
  Be(e, true);
  let n = oe(e, "value", 3, 0), a = oe(e, "max", 3, 100), o = oe(e, "min", 3, 0), i = oe(e, "id", 19, () => $r(r)), l = oe(e, "ref", 15, null), c = ft(e, ["$$slots", "$$events", "$$legacy", "child", "children", "value", "max", "min", "id", "ref"]);
  const f = rd.create({ value: Ke(() => n()), max: Ke(() => a()), min: Ke(() => o()), id: Ke(() => i()), ref: Ke(() => l(), (b) => l(b)) }), v = H(() => tr(c, f.props));
  var x = ke(), m = ae(x);
  {
    var y = (b) => {
      var w = ke(), D = ae(w);
      bt(D, () => e.child, () => ({ props: s(v) })), u(b, w);
    }, h = (b) => {
      var w = j1();
      Gt(w, () => ({ ...s(v) }));
      var D = d(w);
      bt(D, () => e.children ?? ut), u(b, w);
    };
    I(m, (b) => {
      e.child ? b(y) : b(h, -1);
    });
  }
  u(t, x), Fe();
}
function F1(t, e, r) {
  return Math.min(r, Math.max(e, t));
}
const go = Ha({ component: "scroll-area", parts: ["root", "viewport", "corner", "thumb", "scrollbar"] }), mo = new ya("ScrollArea.Root"), ho = new ya("ScrollArea.Scrollbar"), Ci = new ya("ScrollArea.ScrollbarVisible"), nd = new ya("ScrollArea.ScrollbarAxis"), zg = new ya("ScrollArea.ScrollbarShared");
const _ad = class _ad {
  constructor(e) {
    __publicField(this, "opts");
    __publicField(this, "attachment");
    __privateAdd(this, _e23, te(null));
    __privateAdd(this, _t18, te(null));
    __privateAdd(this, _r10, te(null));
    __privateAdd(this, _n8, te(null));
    __privateAdd(this, _a7, te(null));
    __privateAdd(this, _s6, te(0));
    __privateAdd(this, _o6, te(0));
    __privateAdd(this, _i4, te(false));
    __privateAdd(this, _l4, te(false));
    __publicField(this, "domContext");
    __privateAdd(this, _c5, H(() => ({ id: this.opts.id.current, dir: this.opts.dir.current, style: { position: "relative", "--bits-scroll-area-corner-height": `${this.cornerHeight}px`, "--bits-scroll-area-corner-width": `${this.cornerWidth}px` }, [go.root]: "", ...this.attachment })));
    this.opts = e, this.attachment = kr(e.ref, (r) => this.scrollAreaNode = r), this.domContext = new e1(e.ref);
  }
  static create(e) {
    return mo.set(new _ad(e));
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
    __privateAdd(this, _e24, ti(g1()));
    __privateAdd(this, _t19, ti(null));
    __publicField(this, "contentAttachment", kr(__privateGet(this, _t19), (e) => this.root.contentNode = e));
    __privateAdd(this, _r11, H(() => ({ id: this.opts.id.current, style: { overflowX: this.root.scrollbarXEnabled ? "scroll" : "hidden", overflowY: this.root.scrollbarYEnabled ? "scroll" : "hidden" }, [go.viewport]: "", ...this.attachment })));
    __privateAdd(this, _n9, H(() => ({ id: __privateGet(this, _e24).current, "data-scroll-area-content": "", style: { minWidth: this.root.scrollbarXEnabled ? "fit-content" : void 0 }, ...this.contentAttachment })));
    this.opts = e, this.root = r, this.attachment = kr(e.ref, (n) => this.root.viewportNode = n);
  }
  static create(e) {
    return new _sd(e, mo.get());
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
    __privateAdd(this, _e25, H(() => this.opts.orientation.current === "horizontal"));
    __privateAdd(this, _t20, te(false));
    this.opts = e, this.root = r, Dn(() => this.isHorizontal, (n) => n ? (this.root.scrollbarXEnabled = true, () => {
      this.root.scrollbarXEnabled = false;
    }) : (this.root.scrollbarYEnabled = true, () => {
      this.root.scrollbarYEnabled = false;
    }));
  }
  static create(e) {
    return ho.set(new _od(e, mo.get()));
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
    __privateAdd(this, _e26, te(false));
    __privateAdd(this, _t21, H(() => ({ "data-state": this.isVisible ? "visible" : "hidden" })));
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
    return new _id(ho.get());
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
    __publicField(this, "machine", new Mg("hidden", { hidden: { SCROLL: "scrolling" }, scrolling: { SCROLL_END: "idle", POINTER_ENTER: "interacting" }, interacting: { SCROLL: "interacting", POINTER_LEAVE: "idle" }, idle: { HIDE: "hidden", SCROLL: "scrolling", POINTER_ENTER: "interacting" } }));
    __privateAdd(this, _e27, H(() => this.machine.state.current === "hidden"));
    __privateAdd(this, _t22, H(() => ({ "data-state": this.machine.state.current === "hidden" ? "hidden" : "visible", onpointerenter: this.onpointerenter, onpointerleave: this.onpointerleave })));
    this.scrollbar = e, this.root = e.root;
    const r = Ai(() => this.machine.dispatch("SCROLL_END"), 100);
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
    return new _ld(ho.get());
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
const _Ii = class _Ii {
  constructor(e) {
    __publicField(this, "scrollbar");
    __publicField(this, "root");
    __privateAdd(this, _e28, te(false));
    __privateAdd(this, _t23, H(() => ({ "data-state": this.isVisible ? "visible" : "hidden" })));
    this.scrollbar = e, this.root = e.root;
    const r = Ai(() => {
      const n = this.root.viewportNode;
      if (!n) return;
      const a = n.offsetWidth < n.scrollWidth, o = n.offsetHeight < n.scrollHeight;
      this.isVisible = this.scrollbar.isHorizontal ? a : o;
    }, 10);
    new _s(() => this.root.viewportNode, r), new _s(() => this.root.contentNode, r);
  }
  static create() {
    return new _Ii(ho.get());
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
let Ii = _Ii;
const _cd = class _cd {
  constructor(e) {
    __publicField(this, "scrollbar");
    __publicField(this, "root");
    __privateAdd(this, _e29, te(null));
    __privateAdd(this, _t24, te(0));
    __privateAdd(this, _r12, te({ content: 0, viewport: 0, scrollbar: { size: 0, paddingStart: 0, paddingEnd: 0 } }));
    __privateAdd(this, _n10, H(() => Og(this.sizes.viewport, this.sizes.content)));
    __privateAdd(this, _a8, H(() => this.thumbRatio > 0 && this.thumbRatio < 1));
    __privateAdd(this, _s7, te(""));
    this.scrollbar = e, this.root = e.root, Ut(() => {
      this.scrollbar.hasThumb = this.hasThumb;
    }), Ut(() => {
      !this.scrollbar.hasThumb && this.thumbNode && (this.prevTransformStyle = this.thumbNode.style.transform);
    });
  }
  static create() {
    return Ci.set(new _cd(ho.get()));
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
    return U1({ pointerPos: e, pointerOffset: this.pointerOffset, sizes: this.sizes, dir: r });
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
    __privateAdd(this, _e30, te());
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
      this.scrollbarVis.xOnWheelScroll(n), Lg(n, r) && e.preventDefault();
    });
    __publicField(this, "onResize", () => {
      this.scrollbar.opts.ref.current && this.root.viewportNode && this.computedStyle && this.scrollbarVis.setSizes({ content: this.root.viewportNode.scrollWidth, viewport: this.root.viewportNode.offsetWidth, scrollbar: { size: this.scrollbar.opts.ref.current.clientWidth, paddingStart: ai(this.computedStyle.paddingLeft), paddingEnd: ai(this.computedStyle.paddingRight) } });
    });
    __privateAdd(this, _t25, H(() => Pi(this.scrollbarVis.sizes)));
    __privateAdd(this, _r13, H(() => ({ id: this.scrollbar.opts.id.current, "data-orientation": "horizontal", style: { bottom: 0, left: this.root.opts.dir.current === "rtl" ? "var(--bits-scroll-area-corner-width)" : 0, right: this.root.opts.dir.current === "ltr" ? "var(--bits-scroll-area-corner-width)" : 0, "--bits-scroll-area-thumb-width": `${this.thumbSize}px` }, ...this.attachment })));
    this.opts = e, this.scrollbarVis = r, this.root = r.root, this.scrollbar = r.scrollbar, this.attachment = kr(this.scrollbar.opts.ref, (n) => this.root.scrollbarXNode = n), Ut(() => {
      this.scrollbar.opts.ref.current && this.opts.mounted.current && (this.computedStyle = getComputedStyle(this.scrollbar.opts.ref.current));
    }), Ut(() => {
      this.onResize();
    });
  }
  static create(e) {
    return nd.set(new _dd(e, Ci.get()));
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
    __privateAdd(this, _e31, te());
    __privateAdd(this, _t26, H(() => Pi(this.scrollbarVis.sizes)));
    __privateAdd(this, _r14, H(() => ({ id: this.scrollbar.opts.id.current, "data-orientation": "vertical", style: { top: 0, right: this.root.opts.dir.current === "ltr" ? 0 : void 0, left: this.root.opts.dir.current === "rtl" ? 0 : void 0, bottom: "var(--bits-scroll-area-corner-height)", "--bits-scroll-area-thumb-height": `${this.thumbSize}px` }, ...this.attachment })));
    this.opts = e, this.scrollbarVis = r, this.root = r.root, this.scrollbar = r.scrollbar, this.attachment = kr(this.scrollbar.opts.ref, (n) => this.root.scrollbarYNode = n), Ut(() => {
      this.scrollbar.opts.ref.current && this.opts.mounted.current && (this.computedStyle = getComputedStyle(this.scrollbar.opts.ref.current));
    }), Ut(() => {
      this.onResize();
    }), this.onThumbPointerDown = this.onThumbPointerDown.bind(this), this.onDragScroll = this.onDragScroll.bind(this), this.onThumbPointerUp = this.onThumbPointerUp.bind(this), this.onThumbPositionChange = this.onThumbPositionChange.bind(this), this.onWheelScroll = this.onWheelScroll.bind(this), this.onResize = this.onResize.bind(this);
  }
  static create(e) {
    return nd.set(new _ud(e, Ci.get()));
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
    this.scrollbarVis.yOnWheelScroll(n), Lg(n, r) && e.preventDefault();
  }
  onResize() {
    this.scrollbar.opts.ref.current && this.root.viewportNode && this.computedStyle && this.scrollbarVis.setSizes({ content: this.root.viewportNode.scrollHeight, viewport: this.root.viewportNode.offsetHeight, scrollbar: { size: this.scrollbar.opts.ref.current.clientHeight, paddingStart: ai(this.computedStyle.paddingTop), paddingEnd: ai(this.computedStyle.paddingBottom) } });
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
    __privateAdd(this, _e32, te(null));
    __privateAdd(this, _t27, te(""));
    __publicField(this, "handleResize");
    __publicField(this, "handleThumbPositionChange");
    __publicField(this, "handleWheelScroll");
    __publicField(this, "handleThumbPointerDown");
    __publicField(this, "handleThumbPointerUp");
    __privateAdd(this, _r15, H(() => this.scrollbarVis.sizes.content - this.scrollbarVis.sizes.viewport));
    __privateAdd(this, _a9, H(() => tr({ ...this.scrollbarState.props, style: { position: "absolute", ...this.scrollbarState.props.style }, [go.scrollbar]: "", onpointerdown: this.onpointerdown, onpointermove: this.onpointermove, onpointerup: this.onpointerup, onlostpointercapture: this.onlostpointercapture })));
    this.scrollbarState = e, this.root = e.root, this.scrollbarVis = e.scrollbarVis, this.scrollbar = e.scrollbarVis.scrollbar, this.handleResize = Ai(() => this.scrollbarState.onResize(), 10), this.handleThumbPositionChange = this.scrollbarState.onThumbPositionChange, this.handleWheelScroll = this.scrollbarState.onWheelScroll, this.handleThumbPointerDown = this.scrollbarState.onThumbPointerDown, this.handleThumbPointerUp = this.scrollbarState.onThumbPointerUp, Ut(() => {
      const r = this.maxScrollPos, n = this.scrollbar.opts.ref.current;
      this.root.viewportNode;
      const a = (i) => {
        const l = i.target;
        (n == null ? void 0 : n.contains(l)) && this.handleWheelScroll(i, r);
      };
      return xn(this.root.domContext.getDocument(), "wheel", a, { passive: false });
    }), mi(() => {
      this.scrollbarVis.sizes, yr(() => this.handleThumbPositionChange());
    }), new _s(() => this.scrollbar.opts.ref.current, this.handleResize), new _s(() => this.root.contentNode, this.handleResize), this.onpointerdown = this.onpointerdown.bind(this), this.onpointermove = this.onpointermove.bind(this), this.onpointerup = this.onpointerup.bind(this), this.onlostpointercapture = this.onlostpointercapture.bind(this);
  }
  static create() {
    return zg.set(new _fd(nd.get()));
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
    __privateAdd(this, _t28, te());
    __privateAdd(this, _r16, Ai(() => {
      s(__privateGet(this, _t28)) && (s(__privateGet(this, _t28))(), g(__privateGet(this, _t28), void 0));
    }, 100));
    __privateAdd(this, _n11, H(() => ({ id: this.opts.id.current, "data-state": this.scrollbarState.scrollbarVis.hasThumb ? "visible" : "hidden", style: { width: "var(--bits-scroll-area-thumb-width)", height: "var(--bits-scroll-area-thumb-height)", transform: this.scrollbarState.scrollbarVis.prevTransformStyle }, onpointerdowncapture: this.onpointerdowncapture, onpointerup: this.onpointerup, [go.thumb]: "", ...this.attachment })));
    this.opts = e, this.scrollbarState = r, __privateSet(this, _e33, r.root), this.attachment = kr(this.opts.ref, (n) => this.scrollbarState.scrollbarVis.thumbNode = n), Ut(() => {
      const n = __privateGet(this, _e33).viewportNode;
      if (!n) return;
      const a = () => {
        if (__privateGet(this, _r16).call(this), !s(__privateGet(this, _t28))) {
          const i = G1(n, this.scrollbarState.handleThumbPositionChange);
          g(__privateGet(this, _t28), i, true), this.scrollbarState.handleThumbPositionChange();
        }
      };
      return yr(() => this.scrollbarState.handleThumbPositionChange()), xn(n, "scroll", a);
    }), this.onpointerdowncapture = this.onpointerdowncapture.bind(this), this.onpointerup = this.onpointerup.bind(this);
  }
  static create(e) {
    return new _pd(e, zg.get());
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
    __privateAdd(this, _e34, te(0));
    __privateAdd(this, _t29, te(0));
    __privateAdd(this, _r17, H(() => !!(s(__privateGet(this, _e34)) && s(__privateGet(this, _t29)))));
    __privateAdd(this, _n12, H(() => ({ id: this.opts.id.current, style: { width: s(__privateGet(this, _e34)), height: s(__privateGet(this, _t29)), position: "absolute", right: this.root.opts.dir.current === "ltr" ? 0 : void 0, left: this.root.opts.dir.current === "rtl" ? 0 : void 0, bottom: 0 }, [go.corner]: "", ...this.attachment })));
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
    return new _vd(e, mo.get());
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
function ai(t) {
  return t ? Number.parseInt(t, 10) : 0;
}
function Og(t, e) {
  const r = t / e;
  return Number.isNaN(r) ? 0 : r;
}
function Pi(t) {
  const e = Og(t.viewport, t.content), r = t.scrollbar.paddingStart + t.scrollbar.paddingEnd, n = (t.scrollbar.size - r) * e;
  return Math.max(n, 18);
}
function U1({ pointerPos: t, pointerOffset: e, sizes: r, dir: n = "ltr" }) {
  const a = Pi(r), o = a / 2, i = e || o, l = a - i, c = r.scrollbar.paddingStart + i, f = r.scrollbar.size - r.scrollbar.paddingEnd - l, v = r.content - r.viewport, x = n === "ltr" ? [0, v] : [v * -1, 0];
  return Dg([c, f], x)(t);
}
function Lu({ scrollPos: t, sizes: e, dir: r = "ltr" }) {
  const n = Pi(e), a = e.scrollbar.paddingStart + e.scrollbar.paddingEnd, o = e.scrollbar.size - a, i = e.content - e.viewport, l = o - n, c = r === "ltr" ? [0, i] : [i * -1, 0], f = F1(t, c[0], c[1]);
  return Dg([0, i], [0, l])(f);
}
function Dg(t, e) {
  return (r) => {
    if (t[0] === t[1] || e[0] === e[1]) return e[0];
    const n = (e[1] - e[0]) / (t[1] - t[0]);
    return e[0] + n * (r - t[0]);
  };
}
function Lg(t, e) {
  return t > 0 && t < e;
}
function G1(t, e) {
  let r = { left: t.scrollLeft, top: t.scrollTop }, n = 0;
  const a = Ng(t);
  return (function o() {
    const i = { left: t.scrollLeft, top: t.scrollTop }, l = r.left !== i.left, c = r.top !== i.top;
    (l || c) && e(), r = i, n = a.requestAnimationFrame(o);
  })(), () => a.cancelAnimationFrame(n);
}
var W1 = _("<div><!></div>");
function V1(t, e) {
  const r = Pr();
  Be(e, true);
  let n = oe(e, "ref", 15, null), a = oe(e, "id", 19, () => $r(r)), o = oe(e, "type", 3, "hover"), i = oe(e, "dir", 3, "ltr"), l = oe(e, "scrollHideDelay", 3, 600), c = ft(e, ["$$slots", "$$events", "$$legacy", "ref", "id", "type", "dir", "scrollHideDelay", "children", "child"]);
  const f = ad.create({ type: Ke(() => o()), dir: Ke(() => i()), scrollHideDelay: Ke(() => l()), id: Ke(() => a()), ref: Ke(() => n(), (b) => n(b)) }), v = H(() => tr(c, f.props));
  var x = ke(), m = ae(x);
  {
    var y = (b) => {
      var w = ke(), D = ae(w);
      bt(D, () => e.child, () => ({ props: s(v) })), u(b, w);
    }, h = (b) => {
      var w = W1();
      Gt(w, () => ({ ...s(v) }));
      var D = d(w);
      bt(D, () => e.children ?? ut), u(b, w);
    };
    I(m, (b) => {
      e.child ? b(y) : b(h, -1);
    });
  }
  u(t, x), Fe();
}
var H1 = _("<div><div><!></div></div>");
function q1(t, e) {
  const r = Pr();
  Be(e, true);
  let n = oe(e, "ref", 15, null), a = oe(e, "id", 19, () => $r(r)), o = ft(e, ["$$slots", "$$events", "$$legacy", "ref", "id", "children"]);
  const i = sd.create({ id: Ke(() => a()), ref: Ke(() => n(), (m) => n(m)) }), l = H(() => tr(o, i.props)), c = H(() => tr({}, i.contentProps));
  var f = H1();
  Gt(f, () => ({ ...s(l) }));
  var v = d(f);
  Gt(v, () => ({ ...s(c) }));
  var x = d(v);
  bt(x, () => e.children ?? ut), u(t, f), Fe();
}
var Y1 = _("<div><!></div>");
function jg(t, e) {
  Be(e, true);
  let r = ft(e, ["$$slots", "$$events", "$$legacy", "child", "children"]);
  const n = fd.create(), a = H(() => tr(r, n.props));
  var o = ke(), i = ae(o);
  {
    var l = (f) => {
      var v = ke(), x = ae(v);
      bt(x, () => e.child, () => ({ props: s(a) })), u(f, v);
    }, c = (f) => {
      var v = Y1();
      Gt(v, () => ({ ...s(a) }));
      var x = d(v);
      bt(x, () => e.children ?? ut), u(f, v);
    };
    I(i, (f) => {
      e.child ? f(l) : f(c, -1);
    });
  }
  u(t, o), Fe();
}
function K1(t, e) {
  Be(e, true);
  let r = ft(e, ["$$slots", "$$events", "$$legacy"]);
  const n = new Uc(), a = dd.create({ mounted: Ke(() => n.current) }), o = H(() => tr(r, a.props));
  jg(t, et(() => s(o))), Fe();
}
function X1(t, e) {
  Be(e, true);
  let r = ft(e, ["$$slots", "$$events", "$$legacy"]);
  const n = new Uc(), a = ud.create({ mounted: Ke(() => n.current) }), o = H(() => tr(r, a.props));
  jg(t, et(() => s(o))), Fe();
}
function $i(t, e) {
  Be(e, true);
  let r = ft(e, ["$$slots", "$$events", "$$legacy"]);
  const n = cd.create();
  var a = ke(), o = ae(a);
  {
    var i = (c) => {
      K1(c, et(() => r));
    }, l = (c) => {
      X1(c, et(() => r));
    };
    I(o, (c) => {
      n.scrollbar.opts.orientation.current === "horizontal" ? c(i) : c(l, -1);
    });
  }
  u(t, a), Fe();
}
function Z1(t, e) {
  Be(e, true);
  let r = oe(e, "forceMount", 3, false), n = ft(e, ["$$slots", "$$events", "$$legacy", "forceMount"]);
  const a = Ii.create(), o = H(() => tr(n, a.props));
  {
    const i = (c) => {
      $i(c, et(() => s(o)));
    };
    let l = H(() => r() || a.isVisible);
    Ei(t, { get open() {
      return s(l);
    }, get ref() {
      return a.scrollbar.opts.ref;
    }, presence: i, $$slots: { presence: true } });
  }
  Fe();
}
function J1(t, e) {
  Be(e, true);
  let r = oe(e, "forceMount", 3, false), n = ft(e, ["$$slots", "$$events", "$$legacy", "forceMount"]);
  const a = ld.create(), o = H(() => tr(n, a.props));
  {
    const i = (c) => {
      $i(c, et(() => s(o)));
    };
    let l = H(() => r() || !a.isHidden);
    Ei(t, et(() => s(o), { get open() {
      return s(l);
    }, get ref() {
      return a.scrollbar.opts.ref;
    }, presence: i, $$slots: { presence: true } }));
  }
  Fe();
}
function Q1(t, e) {
  Be(e, true);
  let r = oe(e, "forceMount", 3, false), n = ft(e, ["$$slots", "$$events", "$$legacy", "forceMount"]);
  const a = id.create(), o = Ii.create(), i = H(() => tr(n, a.props, o.props, { "data-state": a.isVisible ? "visible" : "hidden" })), l = H(() => r() || a.isVisible && o.isVisible);
  Ei(t, { get open() {
    return s(l);
  }, get ref() {
    return o.scrollbar.opts.ref;
  }, presence: (f) => {
    $i(f, et(() => s(i)));
  }, $$slots: { presence: true } }), Fe();
}
function ey(t, e) {
  const r = Pr();
  Be(e, true);
  let n = oe(e, "ref", 15, null), a = oe(e, "id", 19, () => $r(r)), o = ft(e, ["$$slots", "$$events", "$$legacy", "ref", "id", "orientation"]);
  const i = od.create({ orientation: Ke(() => e.orientation), id: Ke(() => a()), ref: Ke(() => n(), (h) => n(h)) }), l = H(() => i.root.opts.type.current);
  var c = ke(), f = ae(c);
  {
    var v = (h) => {
      Q1(h, et(() => o, { get id() {
        return a();
      } }));
    }, x = (h) => {
      J1(h, et(() => o, { get id() {
        return a();
      } }));
    }, m = (h) => {
      Z1(h, et(() => o, { get id() {
        return a();
      } }));
    }, y = (h) => {
      $i(h, et(() => o, { get id() {
        return a();
      } }));
    };
    I(f, (h) => {
      s(l) === "hover" ? h(v) : s(l) === "scroll" ? h(x, 1) : s(l) === "auto" ? h(m, 2) : s(l) === "always" && h(y, 3);
    });
  }
  u(t, c), Fe();
}
var ty = _("<div><!></div>");
function ry(t, e) {
  Be(e, true);
  let r = oe(e, "ref", 15, null), n = ft(e, ["$$slots", "$$events", "$$legacy", "ref", "id", "child", "children", "present"]);
  const a = new Uc(), o = pd.create({ id: Ke(() => e.id), ref: Ke(() => r(), (x) => r(x)), mounted: Ke(() => a.current) }), i = H(() => tr(n, o.props, { style: { hidden: !e.present } }));
  var l = ke(), c = ae(l);
  {
    var f = (x) => {
      var m = ke(), y = ae(m);
      bt(y, () => e.child, () => ({ props: s(i) })), u(x, m);
    }, v = (x) => {
      var m = ty();
      Gt(m, () => ({ ...s(i) }));
      var y = d(m);
      bt(y, () => e.children ?? ut), u(x, m);
    };
    I(c, (x) => {
      e.child ? x(f) : x(v, -1);
    });
  }
  u(t, l), Fe();
}
function ny(t, e) {
  const r = Pr();
  Be(e, true);
  let n = oe(e, "id", 19, () => $r(r)), a = oe(e, "ref", 15, null), o = oe(e, "forceMount", 3, false), i = ft(e, ["$$slots", "$$events", "$$legacy", "id", "ref", "forceMount"]);
  const l = Ci.get();
  {
    const c = (v, x) => {
      let m = () => x == null ? void 0 : x().present;
      ry(v, et(() => i, { get id() {
        return n();
      }, get present() {
        return m();
      }, get ref() {
        return a();
      }, set ref(y) {
        a(y);
      } }));
    };
    let f = H(() => o() || l.hasThumb);
    Ei(t, { get open() {
      return s(f);
    }, get ref() {
      return l.scrollbar.opts.ref;
    }, presence: c, $$slots: { presence: true } });
  }
  Fe();
}
var ay = _("<div><!></div>");
function sy(t, e) {
  Be(e, true);
  let r = oe(e, "ref", 15, null), n = ft(e, ["$$slots", "$$events", "$$legacy", "ref", "id", "children", "child"]);
  const a = vd.create({ id: Ke(() => e.id), ref: Ke(() => r(), (v) => r(v)) }), o = H(() => tr(n, a.props));
  var i = ke(), l = ae(i);
  {
    var c = (v) => {
      var x = ke(), m = ae(x);
      bt(m, () => e.child, () => ({ props: s(o) })), u(v, x);
    }, f = (v) => {
      var x = ay();
      Gt(x, () => ({ ...s(o) }));
      var m = d(x);
      bt(m, () => e.children ?? ut), u(v, x);
    };
    I(l, (v) => {
      e.child ? v(c) : v(f, -1);
    });
  }
  u(t, i), Fe();
}
function oy(t, e) {
  const r = Pr();
  Be(e, true);
  let n = oe(e, "ref", 15, null), a = oe(e, "id", 19, () => $r(r)), o = ft(e, ["$$slots", "$$events", "$$legacy", "ref", "id"]);
  const i = mo.get(), l = H(() => !!(i.scrollbarXNode && i.scrollbarYNode)), c = H(() => i.opts.type.current !== "scroll" && s(l));
  var f = ke(), v = ae(f);
  {
    var x = (m) => {
      sy(m, et(() => o, { get id() {
        return a();
      }, get ref() {
        return n();
      }, set ref(y) {
        n(y);
      } }));
    };
    I(v, (m) => {
      s(c) && m(x);
    });
  }
  u(t, f), Fe();
}
const Bg = Ha({ component: "switch", parts: ["root", "thumb"] }), gd = new ya("Switch.Root");
const _md = class _md {
  constructor(e) {
    __privateAdd(this, _md_instances);
    __publicField(this, "opts");
    __publicField(this, "attachment");
    __privateAdd(this, _t30, H(() => ({ "data-disabled": La(this.opts.disabled.current), "data-state": r1(this.opts.checked.current), "data-required": La(this.opts.required.current) })));
    __privateAdd(this, _r18, H(() => ({ checked: this.opts.checked.current })));
    __privateAdd(this, _n13, H(() => ({ ...this.sharedProps, id: this.opts.id.current, role: "switch", disabled: Rg(this.opts.disabled.current), "aria-checked": n1(this.opts.checked.current), "aria-required": Gc(this.opts.required.current), [Bg.root]: "", onclick: this.onclick, onkeydown: this.onkeydown, ...this.attachment })));
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
    __privateAdd(this, _e35, H(() => this.root.opts.name.current !== void 0));
    __privateAdd(this, _t31, H(() => ({ type: "checkbox", name: this.root.opts.name.current, value: this.root.opts.value.current, checked: this.root.opts.checked.current, disabled: this.root.opts.disabled.current, required: this.root.opts.required.current })));
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
    __privateAdd(this, _e36, H(() => ({ checked: this.root.opts.checked.current })));
    __privateAdd(this, _t32, H(() => ({ ...this.root.sharedProps, id: this.opts.id.current, [Bg.thumb]: "", ...this.attachment })));
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
function iy(t, e) {
  Be(e, false);
  const r = hd.create();
  wp();
  var n = ke(), a = ae(n);
  {
    var o = (i) => {
      _1(i, et(() => r.props));
    };
    I(a, (i) => {
      r.shouldRender && i(o);
    });
  }
  u(t, n), Fe();
}
var ly = _("<button><!></button>"), cy = _("<!> <!>", 1);
function dy(t, e) {
  const r = Pr();
  Be(e, true);
  let n = oe(e, "ref", 15, null), a = oe(e, "id", 19, () => $r(r)), o = oe(e, "disabled", 3, false), i = oe(e, "required", 3, false), l = oe(e, "checked", 15, false), c = oe(e, "value", 3, "on"), f = oe(e, "name", 3, void 0), v = oe(e, "type", 3, "button"), x = oe(e, "onCheckedChange", 3, ri), m = ft(e, ["$$slots", "$$events", "$$legacy", "child", "children", "ref", "id", "disabled", "required", "checked", "value", "name", "type", "onCheckedChange"]);
  const y = md.create({ checked: Ke(() => l(), (M) => {
    var _a10;
    l(M), (_a10 = x()) == null ? void 0 : _a10(M);
  }), disabled: Ke(() => o() ?? false), required: Ke(() => i()), value: Ke(() => c()), name: Ke(() => f()), id: Ke(() => a()), ref: Ke(() => n(), (M) => n(M)) }), h = H(() => tr(m, y.props, { type: v() }));
  var b = cy(), w = ae(b);
  {
    var D = (M) => {
      var Z = ke(), U = ae(Z);
      {
        let P = H(() => ({ props: s(h), ...y.snippetProps }));
        bt(U, () => e.child, () => s(P));
      }
      u(M, Z);
    }, F = (M) => {
      var Z = ly();
      Gt(Z, () => ({ ...s(h) }));
      var U = d(Z);
      bt(U, () => e.children ?? ut, () => y.snippetProps), u(M, Z);
    };
    I(w, (M) => {
      e.child ? M(D) : M(F, -1);
    });
  }
  var B = p(w, 2);
  iy(B, {}), u(t, b), Fe();
}
var uy = _("<span><!></span>");
function fy(t, e) {
  const r = Pr();
  Be(e, true);
  let n = oe(e, "ref", 15, null), a = oe(e, "id", 19, () => $r(r)), o = ft(e, ["$$slots", "$$events", "$$legacy", "child", "children", "ref", "id"]);
  const i = _d.create({ id: Ke(() => a()), ref: Ke(() => n(), (m) => n(m)) }), l = H(() => tr(o, i.props));
  var c = ke(), f = ae(c);
  {
    var v = (m) => {
      var y = ke(), h = ae(y);
      {
        let b = H(() => ({ props: s(l), ...i.snippetProps }));
        bt(h, () => e.child, () => s(b));
      }
      u(m, y);
    }, x = (m) => {
      var y = uy();
      Gt(y, () => ({ ...s(l) }));
      var h = d(y);
      bt(h, () => e.children ?? ut, () => i.snippetProps), u(m, y);
    };
    I(f, (m) => {
      e.child ? m(v) : m(x, -1);
    });
  }
  u(t, c), Fe();
}
const si = Ha({ component: "tabs", parts: ["root", "list", "trigger", "content"] }), bd = new ya("Tabs.Root");
const _xd = class _xd {
  constructor(e) {
    __publicField(this, "opts");
    __publicField(this, "attachment");
    __publicField(this, "rovingFocusGroup");
    __privateAdd(this, _e37, te(nt([])));
    __publicField(this, "valueToTriggerId", new Ou());
    __publicField(this, "valueToContentId", new Ou());
    __privateAdd(this, _t33, H(() => ({ id: this.opts.id.current, "data-orientation": this.opts.orientation.current, [si.root]: "", ...this.attachment })));
    this.opts = e, this.attachment = kr(e.ref), this.rovingFocusGroup = new f1({ candidateAttr: si.trigger, rootNode: this.opts.ref, loop: this.opts.loop, orientation: this.opts.orientation });
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
    __privateAdd(this, _e38, H(() => this.root.opts.disabled.current));
    __privateAdd(this, _t34, H(() => ({ id: this.opts.id.current, role: "tablist", "aria-orientation": this.root.opts.orientation.current, "data-orientation": this.root.opts.orientation.current, [si.list]: "", "data-disabled": La(s(__privateGet(this, _e38))), ...this.attachment })));
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
    __privateAdd(this, _e39, te(0));
    __privateAdd(this, _t35, H(() => this.root.opts.value.current === this.opts.value.current));
    __privateAdd(this, _r19, H(() => this.opts.disabled.current || this.root.opts.disabled.current));
    __privateAdd(this, _n14, H(() => this.root.valueToContentId.get(this.opts.value.current)));
    __privateAdd(this, _s8, H(() => ({ id: this.opts.id.current, role: "tab", "data-state": py(s(__privateGet(this, _t35))), "data-value": this.opts.value.current, "data-orientation": this.root.opts.orientation.current, "data-disabled": La(s(__privateGet(this, _r19))), "aria-selected": Gc(s(__privateGet(this, _t35))), "aria-controls": s(__privateGet(this, _n14)), [si.trigger]: "", disabled: Rg(s(__privateGet(this, _r19))), tabindex: s(__privateGet(this, _e39)), onclick: this.onclick, onfocus: this.onfocus, onkeydown: this.onkeydown, ...this.attachment })));
    this.opts = e, this.root = r, this.attachment = kr(e.ref), Dn([() => this.opts.id.current, () => this.opts.value.current], ([n, a]) => this.root.registerTrigger(n, a)), Ut(() => {
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
function py(t) {
  return t ? "active" : "inactive";
}
var vy = _("<div><!></div>");
function gy(t, e) {
  const r = Pr();
  Be(e, true);
  let n = oe(e, "id", 19, () => $r(r)), a = oe(e, "ref", 15, null), o = oe(e, "value", 15, ""), i = oe(e, "onValueChange", 3, ri), l = oe(e, "orientation", 3, "horizontal"), c = oe(e, "loop", 3, true), f = oe(e, "activationMode", 3, "automatic"), v = oe(e, "disabled", 3, false), x = ft(e, ["$$slots", "$$events", "$$legacy", "id", "ref", "value", "onValueChange", "orientation", "loop", "activationMode", "disabled", "children", "child"]);
  const m = xd.create({ id: Ke(() => n()), value: Ke(() => o(), (F) => {
    o(F), i()(F);
  }), orientation: Ke(() => l()), loop: Ke(() => c()), activationMode: Ke(() => f()), disabled: Ke(() => v()), ref: Ke(() => a(), (F) => a(F)) }), y = H(() => tr(x, m.props));
  var h = ke(), b = ae(h);
  {
    var w = (F) => {
      var B = ke(), M = ae(B);
      bt(M, () => e.child, () => ({ props: s(y) })), u(F, B);
    }, D = (F) => {
      var B = vy();
      Gt(B, () => ({ ...s(y) }));
      var M = d(B);
      bt(M, () => e.children ?? ut), u(F, B);
    };
    I(b, (F) => {
      e.child ? F(w) : F(D, -1);
    });
  }
  u(t, h), Fe();
}
var my = _("<div><!></div>");
function hy(t, e) {
  const r = Pr();
  Be(e, true);
  let n = oe(e, "id", 19, () => $r(r)), a = oe(e, "ref", 15, null), o = ft(e, ["$$slots", "$$events", "$$legacy", "child", "children", "id", "ref"]);
  const i = yd.create({ id: Ke(() => n()), ref: Ke(() => a(), (m) => a(m)) }), l = H(() => tr(o, i.props));
  var c = ke(), f = ae(c);
  {
    var v = (m) => {
      var y = ke(), h = ae(y);
      bt(h, () => e.child, () => ({ props: s(l) })), u(m, y);
    }, x = (m) => {
      var y = my();
      Gt(y, () => ({ ...s(l) }));
      var h = d(y);
      bt(h, () => e.children ?? ut), u(m, y);
    };
    I(f, (m) => {
      e.child ? m(v) : m(x, -1);
    });
  }
  u(t, c), Fe();
}
var _y = _("<button><!></button>");
function by(t, e) {
  const r = Pr();
  Be(e, true);
  let n = oe(e, "disabled", 3, false), a = oe(e, "id", 19, () => $r(r)), o = oe(e, "type", 3, "button"), i = oe(e, "ref", 15, null), l = ft(e, ["$$slots", "$$events", "$$legacy", "child", "children", "disabled", "id", "type", "value", "ref"]);
  const c = wd.create({ id: Ke(() => a()), disabled: Ke(() => n() ?? false), value: Ke(() => e.value), ref: Ke(() => i(), (h) => i(h)) }), f = H(() => tr(l, c.props, { type: o() }));
  var v = ke(), x = ae(v);
  {
    var m = (h) => {
      var b = ke(), w = ae(b);
      bt(w, () => e.child, () => ({ props: s(f) })), u(h, b);
    }, y = (h) => {
      var b = _y();
      Gt(b, () => ({ ...s(f) }));
      var w = d(b);
      bt(w, () => e.children ?? ut), u(h, b);
    };
    I(x, (h) => {
      e.child ? h(m) : h(y, -1);
    });
  }
  u(t, v), Fe();
}
var xy = _("<!> <!>", 1);
function ju(t, e) {
  Be(e, true);
  let r = oe(e, "ref", 15, null), n = oe(e, "orientation", 3, "vertical"), a = ft(e, ["$$slots", "$$events", "$$legacy", "ref", "class", "orientation", "children"]);
  var o = ke(), i = ae(o);
  {
    let l = H(() => Je("flex touch-none p-px transition-colors select-none", n() === "vertical" && "h-full w-2.5 border-s border-s-transparent", n() === "horizontal" && "h-2.5 flex-col border-t border-t-transparent", e.class));
    dr(i, () => ey, (c, f) => {
      f(c, et({ "data-slot": "scroll-area-scrollbar", get orientation() {
        return n();
      }, get class() {
        return s(l);
      } }, () => a, { get ref() {
        return r();
      }, set ref(v) {
        r(v);
      }, children: (v, x) => {
        var m = xy(), y = ae(m);
        bt(y, () => e.children ?? ut);
        var h = p(y, 2);
        dr(h, () => ny, (b, w) => {
          w(b, { "data-slot": "scroll-area-thumb", class: "bg-border relative flex-1 rounded-full" });
        }), u(v, m);
      }, $$slots: { default: true } }));
    });
  }
  u(t, o), Fe();
}
var yy = _("<!> <!> <!> <!>", 1);
function jn(t, e) {
  Be(e, true);
  let r = oe(e, "ref", 15, null), n = oe(e, "viewportRef", 15, null), a = oe(e, "orientation", 3, "vertical"), o = oe(e, "scrollbarXClasses", 3, ""), i = oe(e, "scrollbarYClasses", 3, ""), l = ft(e, ["$$slots", "$$events", "$$legacy", "ref", "viewportRef", "class", "orientation", "scrollbarXClasses", "scrollbarYClasses", "children"]);
  var c = ke(), f = ae(c);
  {
    let v = H(() => Je("relative", e.class));
    dr(f, () => V1, (x, m) => {
      m(x, et({ "data-slot": "scroll-area", get class() {
        return s(v);
      } }, () => l, { get ref() {
        return r();
      }, set ref(y) {
        r(y);
      }, children: (y, h) => {
        var b = yy(), w = ae(b);
        dr(w, () => q1, (U, P) => {
          P(U, { "data-slot": "scroll-area-viewport", class: "ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] focus-visible:ring-4 focus-visible:outline-1", get ref() {
            return n();
          }, set ref(E) {
            n(E);
          }, children: (E, S) => {
            var $ = ke(), J = ae($);
            bt(J, () => e.children ?? ut), u(E, $);
          }, $$slots: { default: true } });
        });
        var D = p(w, 2);
        {
          var F = (U) => {
            ju(U, { orientation: "vertical", get class() {
              return i();
            } });
          };
          I(D, (U) => {
            (a() === "vertical" || a() === "both") && U(F);
          });
        }
        var B = p(D, 2);
        {
          var M = (U) => {
            ju(U, { orientation: "horizontal", get class() {
              return o();
            } });
          };
          I(B, (U) => {
            (a() === "horizontal" || a() === "both") && U(M);
          });
        }
        var Z = p(B, 2);
        dr(Z, () => oy, (U, P) => {
          P(U, {});
        }), u(y, b);
      }, $$slots: { default: true } }));
    });
  }
  u(t, c), Fe();
}
var wy = _(' <span class="ml-1 opacity-50 tabular-nums"> </span>', 1), ky = _('<div class="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground"><div class="size-6 rounded-full border-2 border-border border-t-primary animate-spin"></div> <span class="text-sm">Loading events\u2026</span></div>'), Sy = _('<div class="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground"><!> <span class="text-sm">No events found</span></div>'), Ty = _("<!> ", 1), Ay = _("<!> Running\u2026", 1), Ey = _("<!> Done", 1), Cy = _("<!> Execute manually", 1), Iy = _('<div class="px-5 pb-4 pt-1 flex justify-end"><!></div>'), Py = _('<div class="mx-3 mb-3"><!></div>'), $y = _('<div class="rounded-xl border bg-card/60 backdrop-blur-md border-border/50 shadow-sm overflow-hidden hover:border-primary/30 transition-all"><div class="flex items-start gap-3 px-5 pt-4 pb-3.5"><div class="size-8 rounded flex items-center justify-center shrink-0 mt-0.5"><!></div> <div class="flex-1 min-w-0"><div class="flex items-center gap-2 mb-2"><span class="text-sm font-medium text-foreground truncate"> </span> <span class="text-muted-foreground/30">\xB7</span> <span class="flex items-center gap-1 text-xs text-muted-foreground shrink-0"><!> </span></div> <h3 class="text-base font-semibold text-foreground leading-snug mb-3"> </h3> <div class="flex items-center gap-2 flex-wrap"><!> <!></div></div></div> <!> <!></div>'), Ny = _('<div class="flex flex-col gap-3 max-w-3xl"></div>'), Ry = _('<div class="flex flex-col h-full overflow-hidden"><div class="px-8 pt-5 pb-4 shrink-0 border-b border-border"><div class="flex items-center gap-2 mb-0.5"><h1 class="text-sm font-semibold tracking-tight text-foreground">Event Stream</h1> <span class="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground/50">/ live</span></div> <p class="text-xs text-muted-foreground">Unified log of ingested events and execution traces.</p></div> <div class="flex items-center gap-3 px-8 py-2.5 shrink-0 border-b border-border"><div class="flex items-center gap-1"></div> <div class="flex-1"></div> <div class="relative w-52"><!> <!></div> <!></div> <!></div>');
function My(t, e) {
  Be(e, true);
  let r = te(nt([])), n = te(nt({ total: 0, completed: 0, awaiting_user: 0, escalated: 0, failed: 0 })), a = te(true), o = te(""), i = te(""), l = nt({});
  const c = { gmail: "#ea4335", telegram: "#26a5e4", instagram: "#e1306c", youtube: "#ff0000", slack: "#611f69", twitter: "#1da1f2" };
  async function f() {
    g(a, true);
    try {
      const [{ entries: P }, E, S] = await Promise.all([Z_({ limit: 200 }), wc({ limit: 200 }).then((A) => A ?? []), wi()]), $ = P.map((A) => ({ ...A, _streamStatus: A.success ? "completed" : "failed" })), J = E.map((A) => ({ ...A, from: A.sender, _streamStatus: A.status === "escalated" ? "escalated" : "awaiting_user", success: null, steps: [] })), W = new Set($.map((A) => A.emailId)), C = J.filter((A) => !W.has(A.id ?? ""));
      g(r, [...$, ...C].sort((A, k) => Number(k.executedAt ?? k.timestamp ?? 0) - Number(A.executedAt ?? A.timestamp ?? 0)), true), g(n, S, true);
    } catch (P) {
      console.error("StreamView:", P);
    }
    g(a, false);
  }
  Xt(f);
  let v = H(() => s(r).filter((P) => {
    var _a10, _b4, _c6, _d4;
    let E = true;
    if (s(o) === "completed" ? E = P._streamStatus === "completed" : s(o) === "failed" ? E = P._streamStatus === "failed" : s(o) === "awaiting_user" && (E = P._streamStatus === "awaiting_user"), !E) return false;
    if (!s(i)) return true;
    const S = s(i).toLowerCase();
    return ((_a10 = P.subject) == null ? void 0 : _a10.toLowerCase().includes(S)) || ((_b4 = P.from) == null ? void 0 : _b4.toLowerCase().includes(S)) || ((_c6 = P.sender) == null ? void 0 : _c6.toLowerCase().includes(S)) || ((_d4 = P.eventType) == null ? void 0 : _d4.toLowerCase().includes(S));
  }));
  function x(P) {
    if (!P) return "";
    const E = new Date(Number(P)), S = Math.round((Date.now() - E.getTime()) / 6e4);
    if (S < 60) return `${S}m ago`;
    const $ = Math.round(S / 60);
    return $ < 24 ? `${$}h ago` : E.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
  function m(P) {
    return (P == null ? void 0 : P.replace(/_/g, " ")) ?? "";
  }
  async function y(P) {
    const E = P.id ?? P.emailId ?? "";
    if (!E || E === "null" || E === "undefined") {
      console.warn("StreamView: cannot execute item with invalid id:", E);
      return;
    }
    let S = {};
    try {
      E && typeof E == "string" && E.trim().length > 0 && (S = await lo(E) ?? {});
    } catch {
    }
    l[E] = { running: true, steps: [] }, g(r, s(r).map((W) => W.id === E || W.emailId === E ? { ...W, _execId: E } : W), true);
    const $ = { type: P.eventType || P.event_type || "UNKNOWN", source: S.sourceType || "gmail", data: { emailId: E, subject: S.subject ?? P.subject, from: S.from ?? P.from ?? P.sender ?? P.source_name, ...S }, metadata: { category: P.event_category } }, J = await uo($, (W) => {
      const C = l[E] || { running: true, steps: [] };
      if (W.phase === "pipeline_loaded") l[E] = { ...C, steps: (W.actions ?? []).map((A) => {
        const k = A;
        return { label: k.name ?? k.commandId, commandId: k.commandId, status: "pending" };
      }) };
      else if (W.phase === "action_start") l[E] = { ...C, steps: C.steps.map((A) => A.commandId === (W.actionId ?? W.commandId) ? { ...A, status: "running" } : A) };
      else if (W.phase === "action_complete") {
        const A = W.result, k = (A == null ? void 0 : A.success) !== false;
        l[E] = { ...C, steps: C.steps.map((N) => N.commandId === (W.actionId ?? W.commandId) ? { ...N, status: k ? "done" : "error", message: A == null ? void 0 : A.message } : N) };
      }
    }, true);
    if (l[E] = { ...l[E], running: false, success: J.success }, J.success) {
      try {
        await vs(E, "executed");
      } catch {
      }
      setTimeout(() => {
        f();
      }, 1500);
    }
  }
  const h = [{ key: "", label: "All", count: () => s(n).total }, { key: "completed", label: "Completed", count: () => s(n).completed }, { key: "awaiting_user", label: "Awaiting", count: () => s(n).awaiting_user }, { key: "failed", label: "Failed", count: () => s(n).failed }];
  var b = Ry(), w = p(d(b), 2), D = d(w);
  Ve(D, 21, () => h, Qe, (P, E) => {
    {
      let S = H(() => s(o) === s(E).key ? "secondary" : "ghost");
      tt(P, { get variant() {
        return s(S);
      }, size: "sm", onclick: () => {
        g(o, s(o) === s(E).key && s(E).key !== "" ? "" : s(E).key, true), f();
      }, class: "h-7 text-xs tracking-tight", children: ($, J) => {
        var W = wy(), C = ae(W), A = p(C), k = d(A);
        j((N) => {
          T(C, `${s(E).label ?? ""} `), T(k, N);
        }, [() => s(E).count()]), u($, W);
      }, $$slots: { default: true } });
    }
  });
  var F = p(D, 4), B = d(F);
  Jo(B, { class: "absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" });
  var M = p(B, 2);
  $n(M, { placeholder: "Search events\u2026", class: "pl-9 h-8 text-xs", get value() {
    return s(i);
  }, set value(P) {
    g(i, P, true);
  } });
  var Z = p(F, 2);
  {
    let P = H(() => Je(s(a) && "[&_svg]:animate-spin"));
    tt(Z, { variant: "ghost", size: "icon-sm", onclick: f, get class() {
      return s(P);
    }, children: (E, S) => {
      ms(E, { class: "size-3.5" });
    }, $$slots: { default: true } });
  }
  var U = p(w, 2);
  jn(U, { class: "flex-1 px-8 py-5", children: (P, E) => {
    var S = ke(), $ = ae(S);
    {
      var J = (A) => {
        var k = ky();
        u(A, k);
      }, W = (A) => {
        var k = Sy(), N = d(k);
        gg(N, { class: "size-12 opacity-20" }), u(A, k);
      }, C = (A) => {
        var k = Ny();
        Ve(k, 21, () => s(v), (N) => N.id ?? N.emailId ?? "", (N, O) => {
          const Y = H(() => c[String(s(O).source_name ?? "")] ?? "#6b7280"), V = H(() => s(O).id ?? s(O).emailId ?? ""), q = H(() => l[s(V)]), ne = H(() => {
            var _a10, _b4;
            return ((_a10 = s(O).steps) == null ? void 0 : _a10.length) ? s(O).steps : ((_b4 = s(q)) == null ? void 0 : _b4.steps) || [];
          });
          var K = $y(), R = d(K), L = d(R), G = d(L);
          gs(G, { class: "size-4", get style() {
            return `color:${s(Y) ?? ""};`;
          } });
          var Q = p(L, 2), re = d(Q), ie = d(re), le = d(ie), ce = p(ie, 4), fe = d(ce);
          Pl(fe, { class: "size-3" });
          var ve = p(fe), be = p(re, 2), _e40 = d(be), xe = p(be, 2), Ae = d(xe);
          {
            var Ee = (we) => {
              Cr(we, { variant: "outline", class: "gap-1.5 h-6 text-xs font-medium", children: (ye, Te) => {
                var Oe = Ty(), X = ae(Oe);
                Mx(X, { class: "size-3 shrink-0" });
                var se = p(X);
                j((he) => T(se, ` ${he ?? ""}`), [() => m(s(O).event_type)]), u(ye, Oe);
              }, $$slots: { default: true } });
            };
            I(Ae, (we) => {
              s(O).event_type && we(Ee);
            });
          }
          var Se = p(Ae, 2);
          {
            var Pe = (we) => {
              Cr(we, { variant: "secondary", class: "h-6 text-xs capitalize", children: (ye, Te) => {
                var Oe = Ue();
                j(() => T(Oe, s(O).event_category)), u(ye, Oe);
              }, $$slots: { default: true } });
            };
            I(Se, (we) => {
              s(O).event_category && we(Pe);
            });
          }
          var pe = p(R, 2);
          {
            var de = (we) => {
              var ye = Iy(), Te = d(ye);
              {
                let Oe = H(() => {
                  var _a10, _b4;
                  return ((_a10 = s(q)) == null ? void 0 : _a10.running) || ((_b4 = s(q)) == null ? void 0 : _b4.success) === true;
                });
                tt(Te, { variant: "outline", size: "sm", class: "gap-1.5 h-7 text-xs", get disabled() {
                  return s(Oe);
                }, onclick: () => y(s(O)), children: (X, se) => {
                  var he = ke(), ge = ae(he);
                  {
                    var $e = (Re) => {
                      var Le = Ay(), We = ae(Le);
                      fo(We, { class: "size-3 animate-spin" }), u(Re, Le);
                    }, Ie = (Re) => {
                      var Le = Ey(), We = ae(Le);
                      ss(We, { class: "size-3 text-emerald-500" }), u(Re, Le);
                    }, ze = (Re) => {
                      var Le = Cy(), We = ae(Le);
                      jc(We, { class: "size-3" }), u(Re, Le);
                    };
                    I(ge, (Re) => {
                      var _a10, _b4;
                      ((_a10 = s(q)) == null ? void 0 : _a10.running) ? Re($e) : ((_b4 = s(q)) == null ? void 0 : _b4.success) === true ? Re(Ie, 1) : Re(ze, -1);
                    });
                  }
                  u(X, he);
                }, $$slots: { default: true } });
              }
              u(we, ye);
            };
            I(pe, (we) => {
              (s(O)._streamStatus === "awaiting_user" || s(O)._streamStatus === "escalated") && !s(O).success && we(de);
            });
          }
          var ue = p(pe, 2);
          {
            var me = (we) => {
              var ye = Py(), Te = d(ye);
              kg(Te, { get steps() {
                return s(ne);
              } }), u(we, ye);
            };
            I(ue, (we) => {
              s(ne).length && we(me);
            });
          }
          j((we) => {
            Rt(L, `background:${s(Y) ?? ""}15;`), T(le, s(O).sender || s(O).source_name || "Unknown"), T(ve, ` ${we ?? ""}`), T(_e40, s(O).subject || s(O).content || "(no subject)");
          }, [() => x(s(O).timestamp)]), u(N, K);
        }), u(A, k);
      };
      I($, (A) => {
        s(a) ? A(J) : s(v).length === 0 ? A(W, 1) : A(C, -1);
      });
    }
    u(P, S);
  }, $$slots: { default: true } }), u(t, b), Fe();
}
var zy = _('<div class="flex items-center gap-2"><label class="text-xs font-bold text-muted-foreground" for="pe-name">NAME</label> <input id="pe-name" type="text" class="bg-black/20 border border-border px-2 py-1 rounded text-sm min-w-[200px]"/></div> <div class="flex items-center gap-2 flex-1"><label class="text-xs font-bold text-muted-foreground" for="pe-desc">DESC</label> <input id="pe-desc" type="text" class="bg-black/20 border border-border px-2 py-1 rounded text-sm w-full"/></div>', 1), Oy = _('<div class="group/chip inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/8 border border-blue-500/20 rounded-md text-xs text-blue-400 font-medium transition-all hover:border-blue-500/40"><span class="size-1.5 rounded-full bg-blue-500/60 shrink-0"></span> <button class="ml-0.5 text-blue-500/30 hover:text-red-400 transition-colors text-[10px] font-bold">\u2715</button></div>'), Dy = _('<div class="group/chip inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-md text-xs text-emerald-400 font-medium transition-all hover:border-emerald-500/50"><span class="size-1.5 rounded-full bg-emerald-500/60 shrink-0"></span> <span class="text-[9px] text-emerald-500/50 uppercase font-bold">new</span> <button class="ml-0.5 text-emerald-500/30 hover:text-red-400 transition-colors text-[10px] font-bold">\u2715</button></div>'), Ly = _('<div class="flex flex-wrap gap-1.5 mb-3"><!> <!></div>'), jy = _('<div class="mb-3 py-3 text-center text-xs text-muted-foreground/40 border border-dashed border-border/40 rounded-lg">No event types linked yet</div>'), By = _("<option> </option>"), Fy = _(`<p class="text-[11px] text-muted-foreground/60 leading-relaxed mb-3">Event types linked to this
                                                category. AI-classified emails
                                                matching these types will
                                                trigger the pipeline.</p> <!> <select class="w-full bg-secondary/50 border border-border hover:border-blue-500/30 rounded-lg px-3 py-2.5 text-xs focus:border-blue-500/50 outline-none transition-colors cursor-pointer"><option disabled="" selected="">+ Add event type\u2026</option><!></select>`, 1), Uy = _("<option> </option>"), Gy = _(`<p class="text-xs text-muted-foreground leading-relaxed mb-3">Trigger this pipeline when the
                                                AI engine identifies the email's
                                                core purpose as this Event Type:</p> <select class="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm focus:border-blue-500 outline-none transition-colors"><option disabled="">Select Event Type...</option><!></select>`, 1), Wy = _('<div class="text-xs text-muted-foreground truncate"> </div>'), Vy = _('<div class="group relative bg-secondary/30 border border-border/50 hover:border-border hover:bg-secondary/50 rounded-xl p-3 flex items-center gap-4 transition-all"><div class="size-7 rounded border border-border/50 bg-background/50 flex justify-center items-center text-xs font-mono text-muted-foreground shrink-0"></div> <div class="size-8 rounded-full bg-background border border-border/50 flex items-center justify-center shadow-sm shrink-0 text-lg"> </div> <div class="flex-1 min-w-0"><div class="font-medium text-sm truncate"> </div> <!></div> <div class="action-controls opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 pr-2"><button class="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-background transition-colors" title="Edit"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path></svg></button> <button class="p-2 text-muted-foreground hover:text-destructive rounded-lg hover:bg-destructive/10 transition-colors" title="Remove"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg></button></div></div>'), Hy = _('<div class="flex items-stretch justify-center max-w-5xl w-full gap-5 mx-auto mt-8"><div class="w-[340px] shrink-0 flex flex-col items-center z-10"><div class="w-full border border-border bg-card rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.5)] overflow-hidden"><div class="px-5 py-4 border-b border-border/50 flex items-center gap-4 bg-secondary/20"><div class="size-10 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-500 flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg></div> <div class="flex flex-col"><span class="text-[10px] font-bold uppercase tracking-widest text-blue-500/80 mb-0.5">Trigger</span> <span class="text-base font-semibold">Detect AI Event Type</span></div></div> <div class="p-5 bg-background border-t border-border/50"><div class="mb-3"><!></div></div></div></div> <div class="flex flex-col items-center w-12 pt-[64px] shrink-0"><div class="w-full h-px bg-border flex items-center justify-center"><div class="size-4 rounded-full border border-border bg-card flex items-center justify-center"><div class="size-1.5 rounded-full bg-muted-foreground/30"></div></div></div></div> <div class="w-[420px] shrink-0 border border-border bg-card rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.5)] overflow-hidden z-10 flex flex-col"><div class="px-5 py-4 border-b border-border/50 flex items-center gap-4 bg-secondary/20 shrink-0"><div class="size-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-5 fill-emerald-500/20"><polygon points="6 3 20 12 6 21 6 3"></polygon></svg></div> <div class="flex flex-col"><span class="text-[10px] font-bold uppercase tracking-widest text-emerald-500/80 mb-0.5">Actions</span> <span class="text-base font-semibold">Execute in order</span></div></div> <div class="p-5 bg-background flex-1 flex flex-col gap-3 min-h-[300px]"><!> <button class="w-full mt-2 py-4 rounded-xl border-2 border-dashed border-border/40 hover:border-emerald-500/40 hover:bg-emerald-500/5 text-sm text-muted-foreground font-medium transition-colors flex items-center justify-center gap-2"><span class="text-xl leading-none mb-0.5">+</span> Add Action</button></div></div></div>'), qy = _('<span class="text-[10px] uppercase font-bold text-emerald-500 mt-auto">\u2713 Added</span>'), Yy = _('<button><span class="text-2xl text-muted-foreground group-hover:text-foreground transition-colors"> </span> <span class="text-xs font-semibold text-foreground/80"> </span> <!></button>'), Ky = _('<div class="flex flex-col gap-3"><div><span class="text-xs font-bold uppercase tracking-widest text-blue-500 bg-blue-500/10 px-2 py-1 rounded-md"> </span></div> <div class="grid grid-cols-2 gap-3"></div></div>'), Xy = _('<div class="fixed inset-0 z-40 bg-background/50 backdrop-blur-sm" aria-hidden="true"></div> <div class="fixed right-0 top-0 bottom-0 w-[400px] bg-card border-l border-border/60 z-50 flex flex-col shadow-2xl transition-transform"><div class="flex items-center justify-between px-6 py-4 border-b border-border/50"><h3 class="text-base font-semibold text-foreground">Select Action</h3> <button class="close-btn-small svelte-10fvsp5">&#10005;</button></div> <div class="flex-1 overflow-y-auto p-6 flex flex-col gap-6"></div></div>', 1), Zy = _("<option> </option>"), Jy = _("<optgroup></optgroup>"), Qy = _('<div class="fixed inset-0 z-40 bg-background/50 backdrop-blur-sm" aria-hidden="true"></div> <div class="fixed right-0 top-0 bottom-0 w-[400px] bg-card border-l border-border/60 z-50 flex flex-col shadow-2xl transition-transform"><div class="flex items-center justify-between px-6 py-4 border-b border-border/50"><h3 class="text-base font-semibold flex items-center gap-2"><span class="text-xl"> </span> </h3> <button class="close-btn-small svelte-10fvsp5">&#10005;</button></div> <div class="flex-1 overflow-y-auto p-6 flex flex-col gap-6"><div class="flex flex-col gap-4"><div class="flex gap-4"><div class="flex flex-col gap-2 w-16 shrink-0"><label for="edit-icon" class="text-xs font-bold text-muted-foreground/80 uppercase">Icon</label> <input id="edit-icon" type="text" class="bg-secondary/50 border border-border px-3 py-2.5 rounded-lg text-sm focus:border-blue-500 focus:bg-secondary outline-none transition-all text-center"/></div> <div class="flex flex-col gap-2 flex-1"><label for="edit-name" class="text-xs font-bold text-muted-foreground/80 uppercase">Name</label> <input id="edit-name" type="text" class="bg-secondary/50 border border-border px-3 py-2.5 rounded-lg text-sm focus:border-blue-500 focus:bg-secondary outline-none transition-all"/></div></div> <div class="flex flex-col gap-2"><label for="edit-desc" class="text-xs font-bold text-muted-foreground/80 uppercase">Description</label> <input id="edit-desc" type="text" class="bg-secondary/50 border border-border px-3 py-2.5 rounded-lg text-sm focus:border-blue-500 focus:bg-secondary outline-none transition-all"/></div> <div class="flex flex-col gap-2 mt-4 pt-4 border-t border-border/50"><label for="edit-handler" class="text-xs font-bold text-muted-foreground/80 uppercase">Plugin Handler</label> <select id="edit-handler" class="bg-secondary/50 border border-border px-3 py-2.5 rounded-lg text-sm focus:border-blue-500 focus:bg-secondary outline-none transition-all cursor-pointer"><option disabled="">Select handler function...</option><!></select></div></div></div> <div class="p-5 border-t border-border/50 flex gap-3 bg-card/50"><button class="flex-1 bg-secondary text-foreground text-sm font-medium py-2.5 rounded-lg hover:bg-secondary/80 transition-colors border border-border">Cancel</button> <button class="flex-1 bg-blue-600/90 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-blue-600 transition-colors">Save Config</button></div></div>', 1), ew = _('<div class="editor-overlay svelte-10fvsp5" role="dialog"><div class="editor-panel svelte-10fvsp5"><div class="editor-header svelte-10fvsp5"><div class="header-left border-r border-border pr-4 mr-4 shrink-0"><h2 class="svelte-10fvsp5">Unified Pipeline Editor</h2> <span class="subtitle font-mono text-muted-foreground"> </span></div> <div class="header-center flex gap-4 flex-1 items-center"><!></div> <div class="header-right shrink-0 flex items-center gap-3"><button class="small-btn primary svelte-10fvsp5">Save Pipeline</button> <button class="close-btn svelte-10fvsp5">&#10005;</button></div></div> <div class="editor-body p-8 flex flex-col items-center bg-black"><!></div> <!> <!></div></div>');
function tw(t, e) {
  Be(e, true);
  let r = oe(e, "open", 15, false), n = oe(e, "rule", 15, null), a = oe(e, "customSave", 3, false), o = te(nt([])), i = te(nt([])), l = te(nt([])), c = te(nt([])), f = te(nt([])), v = te(null), x = te(false);
  const m = [{ pluginId: "gmail", pluginName: "Gmail", actions: Nc("gmail") }], y = { mark_read: "\u2713", mark_unread: "\u25CB", star: "\u2605", unstar: "\u2606", trash: "\u{1F5D1}", delete: "\u2715", mark_spam: "\u26A0", archive: "\u2193", apply_label: "\u{1F3F7}", remove_label: "\u{1F3F7}", mark_important: "!", mark_not_important: "\u2013" };
  Xt(async () => {
    g(o, await ob(), true);
  }), Ut(() => {
    const S = r(), $ = n();
    yr(() => {
      if (S && $) {
        const J = y;
        g(i, ($.actions || []).map((W) => {
          var _a10;
          const C = { ...W };
          if (C.id || (C.id = (C.commandId || "cmd") + "_" + Math.random().toString(36).substring(7)), C.commandId && C.pluginId && C.commandId.startsWith(C.pluginId + ":") && (C.commandId = C.commandId.slice(C.pluginId.length + 1)), !C.name || !C.description) {
            const k = (_a10 = m.find((N) => N.pluginId === C.pluginId)) == null ? void 0 : _a10.actions.find((N) => N.actionId === C.commandId);
            k ? (C.name = C.name || k.name, C.description = C.description || k.description, C.icon = C.icon || J[k.actionId]) : (C.name = C.name || C.commandId || "Unknown action", C.description = C.description || (C.pluginId ? `${C.pluginId} \xB7 ${C.commandId}` : ""));
          }
          return C;
        }), true), g(l, ($.triggers || []).map((W) => ({ ...W })), true), g(c, [], true), g(f, [], true);
      } else g(i, [], true), g(l, [], true), g(c, [], true), g(f, [], true);
    });
  });
  const h = y;
  function b(S, $) {
    g(i, [...s(i), { id: S.actionId + "_" + Date.now(), pluginId: $, commandId: S.actionId, name: S.name, description: S.description, icon: h[S.actionId] }], true), g(x, false);
  }
  function w(S) {
    return s(i).some(($) => $.commandId === S);
  }
  function D(S) {
    g(i, s(i).filter(($) => $.id !== S), true);
  }
  function F(S) {
    g(x, false), g(v, { ...S, pluginCommandKey: S.pluginId && S.commandId ? `${S.pluginId}:${S.commandId}` : "" }, true);
  }
  function B() {
    if (!s(v)) return;
    const S = s(i).findIndex(($) => $.id === s(v).id);
    S !== -1 && (s(i)[S] = { ...s(i)[S], name: s(v).name, description: s(v).description, icon: s(v).icon, pluginId: s(v).pluginId, commandId: s(v).commandId }), g(v, null);
  }
  function M() {
    g(v, null);
  }
  async function Z() {
    var _a10, _b4;
    try {
      n() && (n(n().actions = s(i), true), n(n().triggers = s(l).filter((S) => S.name !== ""), true), a() ? (_a10 = e.onSave) == null ? void 0 : _a10.call(e, n().actions, s(c), s(f)) : (await xv(n().id, { actions: n().actions, triggers: n().triggers, name: n().name, description: n().description, priority: n().priority }), (_b4 = e.onSave) == null ? void 0 : _b4.call(e)));
    } catch (S) {
      console.error("[PipelineEditor] save failed:", S);
    } finally {
      r(false);
    }
  }
  var U = ke(), P = ae(U);
  {
    var E = (S) => {
      var $ = ew(), J = d($), W = d(J), C = d(W), A = p(d(C), 2), k = d(A), N = p(C, 2), O = d(N);
      {
        var Y = (le) => {
          var ce = zy(), fe = ae(ce), ve = p(d(fe), 2), be = p(fe, 2), _e40 = p(d(be), 2);
          qn(ve, () => n().name, (xe) => n(n().name = xe, true)), qn(_e40, () => n().description, (xe) => n(n().description = xe, true)), u(le, ce);
        };
        I(O, (le) => {
          n() && le(Y);
        });
      }
      var V = p(N, 2), q = d(V), ne = p(q, 2), K = p(W, 2), R = d(K);
      {
        var L = (le) => {
          var ce = Hy(), fe = d(ce), ve = d(fe), be = p(d(ve), 2), _e40 = d(be), xe = d(_e40);
          {
            var Ae = (ue) => {
              var me = Fy(), we = p(ae(me), 2);
              {
                var ye = (ge) => {
                  var $e = Ly(), Ie = d($e);
                  Ve(Ie, 17, () => {
                    var _a10;
                    return (((_a10 = n()) == null ? void 0 : _a10._eventTypes) || []).filter((Re) => !s(f).includes(Re.name));
                  }, Qe, (Re, Le) => {
                    var We = Oy(), st = p(d(We)), gt = p(st);
                    j(() => {
                      T(st, ` ${s(Le).name ?? ""} `), br(gt, "aria-label", `Remove ${s(Le).name ?? ""} from category`);
                    }), Ne("click", gt, () => {
                      g(f, [...s(f), s(Le).name], true), g(c, s(c).filter((Lt) => Lt !== s(Le).name), true);
                    }), u(Re, We);
                  });
                  var ze = p(Ie, 2);
                  Ve(ze, 17, () => s(c), Qe, (Re, Le) => {
                    var We = Dy(), st = p(d(We)), gt = p(st, 3);
                    j(() => {
                      T(st, ` ${s(Le) ?? ""} `), br(gt, "aria-label", `Undo adding ${s(Le) ?? ""}`);
                    }), Ne("click", gt, () => g(c, s(c).filter((Lt) => Lt !== s(Le)), true)), u(Re, We);
                  }), u(ge, $e);
                }, Te = H(() => {
                  var _a10;
                  return (((_a10 = n()) == null ? void 0 : _a10._eventTypes) || []).filter((ge) => !s(f).includes(ge.name)).length > 0 || s(c).length > 0;
                }), Oe = (ge) => {
                  var $e = jy();
                  u(ge, $e);
                };
                I(we, (ge) => {
                  s(Te) ? ge(ye) : ge(Oe, -1);
                });
              }
              var X = p(we, 2), se = d(X);
              se.value = se.__value = "";
              var he = p(se);
              Ve(he, 17, () => s(o).filter((ge) => {
                var _a10;
                const $e = (((_a10 = n()) == null ? void 0 : _a10._eventTypes) || []).some((ze) => ze.name === ge), Ie = s(f).includes(ge);
                return (!$e || Ie) && !s(c).includes(ge);
              }), Qe, (ge, $e) => {
                var Ie = By(), ze = d(Ie), Re = {};
                j((Le) => {
                  T(ze, Le), Re !== (Re = s($e)) && (Ie.value = (Ie.__value = s($e)) ?? "");
                }, [() => s($e).toLowerCase().replace(/_/g, " ").replace(/\b([a-z])/g, (Le) => Le.toUpperCase())]), u(ge, Ie);
              }), Ne("change", X, (ge) => {
                const $e = ge.currentTarget, Ie = $e.value;
                Ie && !s(c).includes(Ie) && (g(c, [...s(c), Ie], true), g(f, s(f).filter((ze) => ze !== Ie), true)), $e.selectedIndex = 0;
              }), u(ue, me);
            }, Ee = (ue) => {
              var me = Gy(), we = p(ae(me), 2), ye = d(we);
              ye.value = ye.__value = "";
              var Te = p(ye);
              Ve(Te, 17, () => s(o), Qe, (Oe, X) => {
                var se = Uy(), he = d(se), ge = {};
                j(($e) => {
                  T(he, $e), ge !== (ge = s(X)) && (se.value = (se.__value = s(X)) ?? "");
                }, [() => s(X).toLowerCase().replace(/_/g, " ").replace(/\b([a-z])/g, ($e) => $e.toUpperCase())]), u(Oe, se);
              }), Mn(we, () => s(l)[0].name, (Oe) => s(l)[0].name = Oe), u(ue, me);
            };
            I(xe, (ue) => {
              s(l).length > 0 && s(l)[0].type === "event_category" ? ue(Ae) : s(l).length > 0 && ue(Ee, 1);
            });
          }
          var Se = p(fe, 4), Pe = p(d(Se), 2), pe = d(Pe);
          Ve(pe, 17, () => s(i), Qe, (ue, me, we) => {
            var ye = Vy(), Te = d(ye);
            Te.textContent = we + 1;
            var Oe = p(Te, 2), X = d(Oe), se = p(Oe, 2), he = d(se), ge = d(he), $e = p(he, 2);
            {
              var Ie = (We) => {
                var st = Wy(), gt = d(st);
                j(() => T(gt, s(me).description)), u(We, st);
              };
              I($e, (We) => {
                s(me).description && We(Ie);
              });
            }
            var ze = p(se, 2), Re = d(ze), Le = p(Re, 2);
            j(() => {
              T(X, s(me).icon || "\u2699\uFE0F"), T(ge, s(me).name);
            }), Ne("click", Re, () => F(s(me))), Ne("click", Le, () => D(s(me).id)), u(ue, ye);
          });
          var de = p(pe, 2);
          Ne("click", de, () => {
            g(x, true), g(v, null);
          }), u(le, ce);
        };
        I(R, (le) => {
          n() && n().triggers && le(L);
        });
      }
      var G = p(K, 2);
      {
        var Q = (le) => {
          var ce = Xy(), fe = ae(ce), ve = p(fe, 2), be = d(ve), _e40 = p(d(be), 2), xe = p(be, 2);
          Ve(xe, 21, () => m, Qe, (Ae, Ee) => {
            var Se = Ky(), Pe = d(Se), pe = d(Pe), de = d(pe), ue = p(Pe, 2);
            Ve(ue, 21, () => s(Ee).actions, Qe, (me, we) => {
              const ye = H(() => w(s(we).actionId));
              var Te = Yy();
              let Oe;
              var X = d(Te), se = d(X), he = p(X, 2), ge = d(he), $e = p(he, 2);
              {
                var Ie = (ze) => {
                  var Re = qy();
                  u(ze, Re);
                };
                I($e, (ze) => {
                  s(ye) && ze(Ie);
                });
              }
              j(() => {
                Oe = rt(Te, 1, "flex flex-col gap-2 p-3 bg-[#111] border border-border rounded-xl hover:bg-secondary hover:border-blue-500/50 transition-all text-left group", null, Oe, { "border-emerald-500": s(ye), "bg-emerald-500_10": s(ye) }), br(Te, "title", s(we).description), T(se, h[s(we).actionId] ?? "\xB7"), T(ge, s(we).name);
              }), Ne("click", Te, () => b(s(we), s(Ee).pluginId)), u(me, Te);
            }), j(() => T(de, s(Ee).pluginName)), u(Ae, Se);
          }), Ne("click", fe, () => g(x, false)), Ne("click", _e40, () => g(x, false)), u(le, ce);
        };
        I(G, (le) => {
          s(x) && le(Q);
        });
      }
      var re = p(G, 2);
      {
        var ie = (le) => {
          var ce = Qy(), fe = ae(ce), ve = p(fe, 2), be = d(ve), _e40 = d(be), xe = d(_e40), Ae = d(xe), Ee = p(xe), Se = p(_e40, 2), Pe = p(be, 2), pe = d(Pe), de = d(pe), ue = d(de), me = p(d(ue), 2), we = p(ue, 2), ye = p(d(we), 2), Te = p(de, 2), Oe = p(d(Te), 2), X = p(Te, 2), se = p(d(X), 2), he = d(se);
          he.value = he.__value = "";
          var ge = p(he);
          Ve(ge, 17, () => m, Qe, (Re, Le) => {
            var We = Jy();
            Ve(We, 21, () => s(Le).actions, Qe, (st, gt) => {
              var Lt = Zy(), dt = d(Lt), Jt = {};
              j(() => {
                T(dt, s(gt).name), Jt !== (Jt = `${s(Le).pluginId ?? ""}:${s(gt).actionId ?? ""}`) && (Lt.value = Lt.__value = `${s(Le).pluginId ?? ""}:${s(gt).actionId ?? ""}`);
              }), u(st, Lt);
            }), j(() => br(We, "label", s(Le).pluginName)), u(Re, We);
          });
          var $e = p(Pe, 2), Ie = d($e), ze = p(Ie, 2);
          j(() => {
            T(Ae, s(v).icon || "\u2699\uFE0F"), T(Ee, ` ${(s(v).name || "Edit Action") ?? ""}`);
          }), Ne("click", fe, M), Ne("click", Se, M), qn(me, () => s(v).icon, (Re) => s(v).icon = Re), qn(ye, () => s(v).name, (Re) => s(v).name = Re), qn(Oe, () => s(v).description, (Re) => s(v).description = Re), Mn(se, () => s(v).pluginCommandKey, (Re) => s(v).pluginCommandKey = Re), Ne("click", Ie, M), Ne("click", ze, B), u(le, ce);
        };
        I(re, (le) => {
          s(v) && le(ie);
        });
      }
      j((le) => T(k, le), [() => {
        var _a10, _b4;
        return (_b4 = (_a10 = n()) == null ? void 0 : _a10.id) == null ? void 0 : _b4.slice(0, 8);
      }]), Ne("click", q, Z), Ne("click", ne, () => r(false)), u(S, $);
    };
    I(P, (S) => {
      r() && S(E);
    });
  }
  u(t, U), Fe();
}
Zt(["click", "change"]);
var rw = _('<span class="text-[9px] px-1.5 py-0.5 rounded bg-secondary/60 text-muted-foreground border border-border/50 uppercase truncate max-w-full"> </span>'), nw = _('<div class="flex flex-wrap gap-1 mt-1 pl-4"></div>'), aw = _('<div class="flex items-center w-[20px] shrink-0 -mx-3 z-10"><div class="h-[2px] bg-border flex-1"></div> <div class="text-border text-[10px] -ml-1">\u25B6</div></div>'), sw = _('<div class="text-[10px] text-muted-foreground leading-snug line-clamp-1 pl-4 opacity-80"> </div>'), ow = _('<div class="mt-1 ml-4 text-[8px] font-bold text-warning bg-warning/10 px-1 py-0.5 rounded-[3px] self-start uppercase">Unbound</div>'), iw = _('<div class="flex items-center w-[20px] shrink-0 -mx-3 z-10"><div class="h-[2px] bg-border flex-1"></div> <div class="text-border text-[10px] -ml-1">\u25B6</div></div>'), lw = _('<div class="shrink-0 bg-card border border-border rounded-xl w-[260px] text-foreground flex flex-col shadow-sm relative group"><div class="p-2.5 pb-2 border-b border-border/50 flex items-center justify-between bg-card rounded-t-xl"><div class="flex items-center gap-2"><div class="size-5 rounded bg-secondary flex items-center justify-center text-foreground text-[10px] shrink-0 shadow-sm border border-border/50"> </div> <span class="text-[10px] font-bold uppercase tracking-wider text-muted-foreground truncate"> </span></div></div> <div class="p-3 pt-2 flex flex-col gap-1 bg-background rounded-b-xl"><div class="font-semibold text-xs text-foreground flex items-baseline gap-1.5"><span class="text-muted-foreground text-[10px] font-mono"></span> <span class="truncate"> </span></div> <!> <!></div></div> <!>', 1), cw = _('<div class="flex items-center overflow-x-auto py-3 gap-6"><div class="shrink-0 bg-card border border-border rounded-xl w-[260px] text-foreground flex flex-col shadow-sm"><div class="p-2.5 pb-2 border-b border-border/50 flex items-center justify-between bg-card rounded-t-xl"><div class="flex items-center gap-2"><div class="size-5 rounded bg-primary/10 flex items-center justify-center text-primary text-[10px] shrink-0 shadow-sm border border-primary/20">\u26A1</div> <span class="text-[10px] font-bold uppercase tracking-wider text-muted-foreground truncate"> </span></div> <span> </span></div> <div class="p-3 pt-2 flex flex-col gap-1.5 relative bg-background rounded-b-xl"><div class="font-semibold text-xs text-foreground flex items-baseline gap-1.5"><span class="text-muted-foreground text-[10px] font-mono">1.</span> <span class="truncate"> </span></div> <!></div></div> <!> <!></div>');
function os(t, e) {
  Be(e, true);
  let r = oe(e, "eventTypes", 3, null), n = oe(e, "commands", 19, () => []);
  oe(e, "onExecute", 3, void 0), oe(e, "executionState", 3, null);
  let a = oe(e, "policy", 3, "auto"), o = H(() => e.category && Pn[e.category] || Pn[yl]);
  const i = [{ pluginId: "gmail", pluginName: "Gmail", actions: Nc("gmail") }], l = { mark_read: "\u2713", mark_unread: "\u25CB", star: "\u2605", unstar: "\u2606", trash: "\u{1F5D1}", delete: "\u2715", mark_spam: "\u26A0", archive: "\u2193", apply_label: "\u{1F3F7}", remove_label: "\u{1F3F7}", mark_important: "!", mark_not_important: "\u2013" };
  let c = H(() => n().map((W) => {
    var _a10;
    const C = { ...W };
    C.commandId && C.pluginId && C.commandId.startsWith(C.pluginId + ":") && (C.commandId = C.commandId.slice(C.pluginId.length + 1));
    const k = (_a10 = i.find((N) => N.pluginId === C.pluginId)) == null ? void 0 : _a10.actions.find((N) => N.actionId === C.commandId);
    return k ? (C.name = C.name || k.name, C.description = C.description || k.description, C.icon = C.icon || l[k.actionId]) : C.name = C.name || C.commandId || "Unknown action", C;
  }));
  var f = cw(), v = d(f), x = d(v), m = d(x), y = p(d(m), 2);
  let h;
  var b = d(y), w = p(m, 2);
  let D;
  var F = d(w), B = p(x, 2), M = d(B), Z = p(d(M), 2), U = d(Z), P = p(M, 2);
  {
    var E = (W) => {
      var C = nw();
      Ve(C, 21, r, Qe, (A, k) => {
        var N = rw(), O = d(N);
        j(() => T(O, s(k))), u(A, N);
      }), u(W, C);
    };
    I(P, (W) => {
      r() && r().length > 0 && W(E);
    });
  }
  var S = p(v, 2);
  {
    var $ = (W) => {
      var C = aw();
      u(W, C);
    };
    I(S, (W) => {
      n().length > 0 && W($);
    });
  }
  var J = p(S, 2);
  Ve(J, 17, () => s(c), Qe, (W, C, A) => {
    var k = lw(), N = ae(k), O = d(N), Y = d(O), V = d(Y), q = d(V), ne = p(V, 2), K = d(ne), R = p(O, 2), L = d(R), G = d(L);
    G.textContent = `${A + 2}.`;
    var Q = p(G, 2), re = d(Q), ie = p(L, 2);
    {
      var le = (_e40) => {
        var xe = sw(), Ae = d(xe);
        j(() => {
          br(xe, "aria-label", s(C).description), T(Ae, s(C).description);
        }), u(_e40, xe);
      };
      I(ie, (_e40) => {
        s(C).description && _e40(le);
      });
    }
    var ce = p(ie, 2);
    {
      var fe = (_e40) => {
        var xe = ow();
        u(_e40, xe);
      };
      I(ce, (_e40) => {
        (!s(C).pluginId || !s(C).commandId) && _e40(fe);
      });
    }
    var ve = p(N, 2);
    {
      var be = (_e40) => {
        var xe = iw();
        u(_e40, xe);
      };
      I(ve, (_e40) => {
        A < n().length - 1 && _e40(be);
      });
    }
    j(() => {
      T(q, s(C).icon || "\u2699\uFE0F"), T(K, s(C).pluginId ? s(C).pluginId : "ACTION"), br(Q, "title", s(C).name), T(re, s(C).name);
    }), u(W, k);
  }), j(() => {
    var _a10, _b4;
    h = Rt(y, "", h, { color: (_a10 = s(o)) == null ? void 0 : _a10.color }), T(b, ((_b4 = s(o)) == null ? void 0 : _b4.label) || "Event"), D = rt(w, 1, "px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest bg-secondary", null, D, { "text-green-400": a() === "auto", "text-red-400": a() === "manual" }), T(F, a()), br(Z, "title", e.eventType), T(U, e.eventType);
  }), u(t, f), Fe();
}
var dw = _('<div class="flex flex-col items-center justify-center gap-3 py-24 text-muted-foreground"><div class="size-6 border-2 border-border border-t-primary rounded-full animate-spin"></div> Loading\u2026</div>'), uw = _("<!> Running\u2026", 1), fw = _("<!> ", 1), pw = _("<!> Edit Actions", 1), vw = _('<div class="flex items-center gap-2 mt-2 text-xs text-muted-foreground/30 italic">No default actions \u2014 user must act manually</div>'), gw = _('<p class="text-xs text-muted-foreground/30 mt-2 italic">No event types assigned yet</p>'), mw = _('<div class="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted/5 border border-border/30 opacity-80"><span class="text-xs font-mono text-foreground/80"> </span> <!> <div class="ml-auto flex items-center gap-1.5"><button class="text-muted-foreground/40 hover:text-destructive transition-colors px-1 h-5" title="Delete Event Type"><!></button></div></div>'), hw = _('<div class="flex flex-col gap-1 mt-2"></div>'), _w = _('<div class="px-6 pb-4 border-t border-border/40 pt-3"><span class="text-[0.6rem] uppercase tracking-wider text-muted-foreground/40 font-semibold">Event Types in this Category</span> <!></div>'), bw = _('<div class="rounded-xl border bg-card/60 backdrop-blur-md border-border/50 shadow-sm hover:border-primary/30 transition-all"><div class="flex items-center gap-3 px-6 py-4"><div class="size-10 rounded-lg flex items-center justify-center text-lg shrink-0"> </div> <div class="flex-1 min-w-0"><div class="flex items-center gap-2"><h3 class="text-base font-bold text-foreground"> </h3> <!></div> <div class="flex items-center gap-2 mt-1"><span class="text-xs text-muted-foreground/50">Policy:</span> <select class="h-6 px-1.5 text-xs rounded border border-input bg-background text-foreground"><option>Auto-execute</option><option>User approval</option></select></div></div> <button class="p-2 text-muted-foreground/40 hover:text-foreground transition-colors"><!></button></div> <div class="px-6 pb-4 border-t border-border/40 pt-3 flex flex-col items-start gap-1"><div class="flex items-center justify-between w-full gap-2 flex-wrap"><span class="text-[0.6rem] uppercase tracking-wider text-muted-foreground/40 font-semibold">Default Pipeline</span> <div class="flex items-center gap-2"><!> <!></div></div> <!></div> <!></div>'), xw = _('<div class="flex flex-col gap-4 max-w-4xl"></div>'), yw = _(`<div class="flex flex-col h-full overflow-hidden"><div class="flex items-center justify-between px-8 pt-5 pb-4 shrink-0 border-b border-border"><div><div class="flex items-center gap-2 mb-0.5"><!> <h2 class="text-xl font-bold tracking-tight text-foreground">Category Pipelines</h2></div> <p class="text-sm text-muted-foreground/60">Categories carry default action pipelines. AI assigns event types to
        categories.</p></div></div> <!> <!></div>`);
function ww(t, e) {
  Be(e, true);
  let r = te(nt([])), n = te(true), a = te(nt({})), o = te(nt({})), i = te(null), l = te(false), c = te(null);
  const f = { noise: "#6b7280", info: "#3b82f6", critical: "#ef4444" }, v = { noise: "\u{1F5D1}", info: "\u{1F4CB}", critical: "\u{1F6A8}" };
  Xt(x);
  async function x() {
    g(n, true);
    try {
      const S = await Sc();
      g(r, S, true);
      const $ = await Promise.all(S.map(async (J) => [J.category, await yv(J.category)]));
      g(o, Object.fromEntries($), true);
    } catch (S) {
      console.error("Failed to load category pipelines:", S);
    } finally {
      g(n, false);
    }
  }
  async function m(S) {
    if (!await Yo()) {
      alert("Please sign in to Gmail first (Dashboard page)");
      return;
    }
    if (S.actions.length === 0) {
      alert("No actions in this category pipeline \u2014 add actions first (Edit Actions).");
      return;
    }
    const $ = await wv(S.category);
    if ($.length === 0) {
      alert(`No pending items in ${S.label}.`);
      return;
    }
    g(i, S.category, true);
    let J = 0, W = 0;
    try {
      for (const C of $) {
        const A = { type: C.eventType, source: C.sourceType ?? "gmail", data: { id: C.id, emailId: C.id, subject: C.subject, from: C.from }, metadata: { category: C.event_category } };
        (await uo(A, void 0, true, { actionsOverride: S.actions })).success ? J += 1 : W += 1;
      }
      W > 0 && alert(`Done: ${J} succeeded, ${W} failed.`), g(o, { ...s(o), [S.category]: 0 }, true);
    } catch (C) {
      console.error("Execute category failed:", C), alert(`Execution failed: ${C.message}`);
    } finally {
      g(i, null);
    }
  }
  function y(S) {
    g(a, { ...s(a), [S]: !s(a)[S] }, true);
  }
  async function h(S, $) {
    await Av(S, $), await x();
  }
  function b(S) {
    const $ = s(r).find((J) => J.category === S);
    $ && (g(c, { id: `cat:${$.category}`, name: `Category: ${$.label}`, description: "", triggers: [{ type: "event_category", name: $.category }], actions: JSON.parse(JSON.stringify($.actions)), enabled: true, priority: $.priority, _eventTypes: $.eventTypes || [] }, true), g(l, true));
  }
  async function w(S, $, J) {
    if (!s(c) || !s(c).id.startsWith("cat:") || !S) return;
    const W = s(c).id.split(":")[1], C = S.map((A, k) => ({ pluginId: A.pluginId, commandId: A.commandId, order: k }));
    if (await Tv(W, C), $ && $.length > 0) for (const A of $) await Ev(A, W);
    if (J && J.length > 0) for (const A of J) await Cv(A);
    await x();
  }
  async function D(S) {
    confirm(`Are you sure you want to delete event type '${S}'?`) && (await Iv(S), await x());
  }
  var F = yw(), B = d(F), M = d(B), Z = d(M), U = d(Z);
  Nx(U, { class: "size-5 text-primary/60" });
  var P = p(B, 2);
  jn(P, { class: "flex-1 min-h-0 px-8 py-6", children: (S, $) => {
    var J = ke(), W = ae(J);
    {
      var C = (k) => {
        var N = dw();
        u(k, N);
      }, A = (k) => {
        var N = xw();
        Ve(N, 21, () => s(r), (O) => O.category, (O, Y) => {
          const V = H(() => f[s(Y).category] || "#888"), q = H(() => v[s(Y).category] || "\u{1F4E6}");
          var ne = bw(), K = d(ne), R = d(K), L = d(R), G = p(R, 2), Q = d(G), re = d(Q), ie = d(re), le = p(re, 2);
          Cr(le, { variant: "outline", class: "text-[0.6rem] px-1.5 py-0", get style() {
            return `color: ${s(V) ?? ""}; border-color: ${s(V) ?? ""}40`;
          }, children: (se, he) => {
            var ge = Ue();
            j(() => T(ge, `${s(Y).eventTypes.length ?? ""} type${s(Y).eventTypes.length !== 1 ? "s" : ""}`)), u(se, ge);
          }, $$slots: { default: true } });
          var ce = p(Q, 2), fe = p(d(ce), 2), ve = d(fe);
          ve.value = ve.__value = "auto";
          var be = p(ve);
          be.value = be.__value = "manual";
          var _e40;
          pc(fe);
          var xe = p(G, 2), Ae = d(xe);
          {
            var Ee = (se) => {
              mg(se, { class: "size-4" });
            }, Se = (se) => {
              hg(se, { class: "size-4" });
            };
            I(Ae, (se) => {
              s(a)[s(Y).category] ? se(Ee) : se(Se, -1);
            });
          }
          var Pe = p(K, 2), pe = d(Pe), de = p(d(pe), 2), ue = d(de);
          {
            let se = H(() => s(i) === s(Y).category || s(Y).actions.length === 0 || (s(o)[s(Y).category] ?? 0) === 0);
            tt(ue, { variant: "default", size: "sm", class: "gap-2 h-7 text-xs", get disabled() {
              return s(se);
            }, onclick: () => m(s(Y)), children: (he, ge) => {
              var $e = ke(), Ie = ae($e);
              {
                var ze = (Le) => {
                  var We = uw(), st = ae(We);
                  fo(st, { class: "size-3 animate-spin" }), u(Le, We);
                }, Re = (Le) => {
                  var We = fw(), st = ae(We);
                  jc(st, { class: "size-3" });
                  var gt = p(st);
                  j(() => T(gt, ` Execute${s(o)[s(Y).category] ? ` (${s(o)[s(Y).category]})` : ""}`)), u(Le, We);
                };
                I(Ie, (Le) => {
                  s(i) === s(Y).category ? Le(ze) : Le(Re, -1);
                });
              }
              u(he, $e);
            }, $$slots: { default: true } });
          }
          var me = p(ue, 2);
          tt(me, { variant: "outline", size: "sm", class: "gap-2 h-7 text-xs", onclick: () => b(s(Y).category), children: (se, he) => {
            var ge = pw(), $e = ae(ge);
            Ix($e, { class: "size-3" }), u(se, ge);
          }, $$slots: { default: true } });
          var we = p(pe, 2);
          {
            var ye = (se) => {
              var he = vw();
              u(se, he);
            }, Te = (se) => {
              {
                let he = H(() => `Any ${s(Y).label} event`), ge = H(() => s(Y).eventTypes.map((Ie) => Ie.name)), $e = H(() => s(Y).category.toUpperCase());
                os(se, { get commands() {
                  return s(Y).actions;
                }, get eventType() {
                  return s(he);
                }, get eventTypes() {
                  return s(ge);
                }, get category() {
                  return s($e);
                }, get policy() {
                  return s(Y).policy;
                } });
              }
            };
            I(we, (se) => {
              s(Y).actions.length === 0 ? se(ye) : se(Te, -1);
            });
          }
          var Oe = p(Pe, 2);
          {
            var X = (se) => {
              var he = _w(), ge = p(d(he), 2);
              {
                var $e = (ze) => {
                  var Re = gw();
                  u(ze, Re);
                }, Ie = (ze) => {
                  var Re = hw();
                  Ve(Re, 21, () => s(Y).eventTypes, Qe, (Le, We) => {
                    var st = mw(), gt = d(st), Lt = d(gt), dt = p(gt, 2);
                    {
                      var Jt = (Nt) => {
                        Cr(Nt, { variant: "outline", class: "text-[0.55rem] px-1 py-0 text-muted-foreground/40 border-border/30", children: (Sr, ra) => {
                          var na = Ue("AI");
                          u(Sr, na);
                        }, $$slots: { default: true } });
                      };
                      I(dt, (Nt) => {
                        s(We).autoCreated && Nt(Jt);
                      });
                    }
                    var Wt = p(dt, 2), Nr = d(Wt), Rr = d(Nr);
                    Qo(Rr, { class: "size-3.5" }), j(() => T(Lt, s(We).name)), Ne("click", Nr, () => D(s(We).name)), u(Le, st);
                  }), u(ze, Re);
                };
                I(ge, (ze) => {
                  s(Y).eventTypes.length === 0 ? ze($e) : ze(Ie, -1);
                });
              }
              u(se, he);
            };
            I(Oe, (se) => {
              s(a)[s(Y).category] && se(X);
            });
          }
          j(() => {
            Rt(R, `background: ${s(V) ?? ""}18; color: ${s(V) ?? ""}`), T(L, s(q)), T(ie, s(Y).label), _e40 !== (_e40 = s(Y).policy) && (fe.value = (fe.__value = s(Y).policy) ?? "", Js(fe, s(Y).policy));
          }), Ne("change", fe, (se) => h(s(Y).category, se.target.value)), Ne("click", xe, () => y(s(Y).category)), u(O, ne);
        }), u(k, N);
      };
      I(W, (k) => {
        s(n) ? k(C) : k(A, -1);
      });
    }
    u(S, J);
  }, $$slots: { default: true } });
  var E = p(P, 2);
  tw(E, { customSave: true, onSave: w, get open() {
    return s(l);
  }, set open(S) {
    g(l, S, true);
  }, get rule() {
    return s(c);
  }, set rule(S) {
    g(c, S, true);
  } }), u(t, F), Fe();
}
Zt(["change", "click"]);
function kw(t, e) {
  Be(e, true);
  let r = oe(e, "ref", 15, null), n = oe(e, "data-slot", 3, "separator"), a = ft(e, ["$$slots", "$$events", "$$legacy", "ref", "class", "data-slot"]);
  var o = ke(), i = ae(o);
  {
    let l = H(() => Je("bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:min-h-full data-[orientation=vertical]:w-px", e.class));
    dr(i, () => E1, (c, f) => {
      f(c, et({ get "data-slot"() {
        return n();
      }, get class() {
        return s(l);
      } }, () => a, { get ref() {
        return r();
      }, set ref(v) {
        r(v);
      } }));
    });
  }
  u(t, o), Fe();
}
var Sw = _('<span class="text-[0.6rem] font-bold tabular-nums px-1.5 py-px rounded bg-warning/15 text-warning"> </span>'), Tw = _('<div class="flex items-center justify-center py-16 text-muted-foreground"><div class="size-5 rounded-full border-2 border-border border-t-primary animate-spin"></div></div>'), Aw = _('<div class="flex flex-col items-center justify-center gap-2 py-16 text-muted-foreground px-4 text-center"><!> <span class="text-sm">No pending approvals</span></div>'), Ew = _('<div role="button" tabindex="0"><div class="flex items-center gap-2"><div class="flex items-center gap-1.5 flex-1 min-w-0"><!> <span class="text-xs text-muted-foreground truncate"> </span></div> <span class="text-[0.65rem] text-muted-foreground/60 shrink-0 flex items-center gap-1"><!> </span></div> <p class="text-sm font-semibold text-foreground leading-snug line-clamp-2"> </p> <!></div>'), Cw = _('<div class="flex flex-col gap-1 px-3 pb-4"></div>'), Iw = _('<div class="flex flex-col gap-1.5"><p class="text-xs font-bold uppercase tracking-widest text-muted-foreground">Content</p> <p class="text-sm text-muted-foreground leading-relaxed"> </p></div>'), Pw = _('<!> <div class="flex flex-col gap-3"><p class="text-xs font-bold uppercase tracking-widest text-muted-foreground">Matched Workflow</p> <div class="flex items-center gap-2.5 px-4 py-3 rounded bg-muted/40 border border-border"><div class="size-6 rounded bg-primary/15 flex items-center justify-center shrink-0"><!></div> <div><p class="text-sm font-semibold tracking-tight text-foreground"> </p> <p class="text-xs text-muted-foreground">Paused \u2014 awaiting approval to proceed</p></div></div></div>', 1), $w = _('<div class="flex items-center gap-2 flex-wrap"><!> <!></div>'), Nw = _('<div class="flex flex-col gap-6 max-w-xl"><div class="flex flex-col gap-1.5"><p class="text-xs font-bold uppercase tracking-widest text-muted-foreground">From</p> <p class="text-sm text-foreground"> </p></div> <div class="flex flex-col gap-1.5"><p class="text-xs font-bold uppercase tracking-widest text-muted-foreground">Subject</p> <h3 class="text-lg font-semibold tracking-tight text-foreground leading-snug"> </h3></div> <!> <!> <!></div>'), Rw = _('<p class="text-xs text-destructive mt-2"> </p>'), Mw = _('<div class="px-7 py-4 border-t border-border shrink-0"><!> <!></div>'), zw = _("<!> Reject", 1), Ow = _("<!> Running\u2026", 1), Dw = _("<!> Done!", 1), Lw = _("<!> Review &amp; Execute", 1), jw = _('<!> <div class="px-7 py-4 border-t border-border shrink-0 flex gap-3"><!> <!></div>', 1), Bw = _('<div class="flex-1 min-w-0 flex flex-col overflow-hidden"><div class="flex items-center gap-3 px-7 py-4 border-b border-border shrink-0 bg-warning/5"><div class="size-2 rounded-full bg-warning animate-pulse"></div> <span class="text-xs font-bold uppercase tracking-widest text-warning">Action Paused</span> <span class="text-xs text-muted-foreground ml-auto"> </span></div> <!> <!></div>'), Fw = _('<div class="flex-1 flex items-center justify-center text-muted-foreground"><div class="flex flex-col items-center gap-2"><!> <span class="text-sm">Select an event to review</span></div></div>'), Uw = _('<div class="flex h-full overflow-hidden"><div class="w-72 shrink-0 flex flex-col border-r border-border overflow-hidden"><div class="flex items-center justify-between px-5 pt-4 pb-3 shrink-0 border-b border-border"><div><div class="flex items-center gap-2"><h2 class="text-sm font-semibold tracking-tight text-foreground">Action Required</h2> <!></div> <p class="text-xs text-muted-foreground/60 mt-0.5">Awaiting approval to proceed</p></div> <!></div> <!></div> <!></div>');
function Gw(t, e) {
  Be(e, true);
  let r = te(nt([])), n = te(true), a = te(null), o = te(nt({}));
  async function i() {
    g(n, true), g(o, {}, true);
    try {
      g(r, await wc({ limit: 100 }), true);
    } catch (U) {
      console.error("ApprovalsView:", U);
    }
    g(n, false), s(r).length && !s(a) && g(a, s(r)[0], true);
  }
  Xt(i);
  async function l(U) {
    var _a10;
    const P = U.id;
    let E;
    try {
      E = await lo(P) ?? {};
    } catch {
      E = {};
    }
    s(o)[P] = { running: true, steps: [] };
    const S = { type: U.event_type || "UNKNOWN", source: E.sourceType || "gmail", data: { id: P, emailId: P, subject: E.subject ?? U.subject, from: E.from ?? U.from ?? U.source_name, ...E }, metadata: { category: U.event_category } }, $ = String(U.event_category ?? "").toLowerCase().trim(), W = (await Sc()).find((k) => {
      var _a11;
      return ((_a11 = k.category) == null ? void 0 : _a11.toLowerCase().trim()) === $;
    }), C = ((_a10 = W == null ? void 0 : W.actions) == null ? void 0 : _a10.length) ? W.actions : void 0, A = await uo(S, (k) => {
      const N = s(o)[P] || { running: true, steps: [] };
      if (k.phase === "pipeline_loaded") s(o)[P] = { ...N, steps: (k.actions ?? []).map((O) => {
        const Y = O;
        return { label: Y.name ?? Y.commandId, commandId: Y.commandId, status: "pending" };
      }) };
      else if (k.phase === "action_start") s(o)[P] = { ...N, steps: N.steps.map((O) => O.commandId === (k.actionId ?? k.commandId) ? { ...O, status: "running" } : O) };
      else if (k.phase === "action_complete") {
        const O = k.result, Y = (O == null ? void 0 : O.success) !== false;
        s(o)[P] = { ...N, steps: N.steps.map((V) => V.commandId === (k.actionId ?? k.commandId) ? { ...V, status: Y ? "done" : "error", message: O == null ? void 0 : O.message } : V) };
      }
    }, true, C ? { actionsOverride: C } : void 0);
    if (s(o)[P] = { ...s(o)[P], running: false, success: A.success, error: A.message }, A.success) {
      try {
        await vs(P, "executed");
      } catch {
      }
      setTimeout(() => {
        var _a11;
        g(r, s(r).filter((k) => k.id !== P), true), ((_a11 = s(a)) == null ? void 0 : _a11.id) === P && g(a, s(r)[0] ?? null, true), delete s(o)[P];
      }, 1500);
    }
  }
  async function c(U) {
    var _a10;
    try {
      await kv(U.id), g(r, s(r).filter((P) => P.id !== U.id), true), ((_a10 = s(a)) == null ? void 0 : _a10.id) === U.id && g(a, s(r)[0] ?? null, true);
    } catch (P) {
      console.error("Reject:", P);
    }
  }
  function f(U) {
    if (!U) return "";
    const P = new Date(Number(U)), E = Math.round((Date.now() - P.getTime()) / 6e4);
    if (E < 60) return `${E}m ago`;
    const S = Math.round(E / 60);
    return S < 24 ? `${S}h ago` : P.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
  var v = Uw(), x = d(v), m = d(x), y = d(m), h = d(y), b = p(d(h), 2);
  {
    var w = (U) => {
      var P = Sw(), E = d(P);
      j(() => T(E, s(r).length)), u(U, P);
    };
    I(b, (U) => {
      s(r).length > 0 && U(w);
    });
  }
  var D = p(y, 2);
  {
    let U = H(() => Je(s(n) && "[&_svg]:animate-spin"));
    tt(D, { variant: "ghost", size: "icon-sm", onclick: i, get class() {
      return s(U);
    }, children: (P, E) => {
      ms(P, { class: "size-3.5" });
    }, $$slots: { default: true } });
  }
  var F = p(m, 2);
  jn(F, { class: "flex-1", children: (U, P) => {
    var E = ke(), S = ae(E);
    {
      var $ = (C) => {
        var A = Tw();
        u(C, A);
      }, J = (C) => {
        var A = Aw(), k = d(A);
        ss(k, { class: "size-10 opacity-20" }), u(C, A);
      }, W = (C) => {
        var A = Cw();
        Ve(A, 21, () => s(r), (k) => k.id, (k, N) => {
          var O = Ew(), Y = d(O), V = d(Y), q = d(V);
          gs(q, { class: "size-3 text-muted-foreground shrink-0" });
          var ne = p(q, 2), K = d(ne), R = p(V, 2), L = d(R);
          Pl(L, { class: "size-2.5" });
          var G = p(L, 1, true), Q = p(Y, 2), re = d(Q), ie = p(Q, 2);
          {
            var le = (ce) => {
              Cr(ce, { variant: "outline", class: "text-xs w-fit", children: (fe, ve) => {
                var be = Ue();
                j(() => T(be, s(N).rule_name)), u(fe, be);
              }, $$slots: { default: true } });
            };
            I(ie, (ce) => {
              s(N).rule_name && ce(le);
            });
          }
          j((ce, fe) => {
            rt(O, 1, ce), T(K, s(N).source_name ?? "unknown"), T(G, fe), T(re, s(N).subject || s(N).content || "(no subject)");
          }, [() => {
            var _a10;
            return Et(Je("relative flex flex-col gap-1.5 px-3 py-3 rounded border cursor-pointer transition-colors", "border-l-2", ((_a10 = s(a)) == null ? void 0 : _a10.id) === s(N).id ? "bg-accent border-warning/40 border-l-warning" : "bg-card border-border border-l-warning/30 hover:border-l-warning/70"));
          }, () => f(s(N).timestamp)]), Ne("click", O, () => g(a, s(N), true)), Ne("keydown", O, (ce) => ce.key === "Enter" && g(a, s(N), true)), u(k, O);
        }), u(C, A);
      };
      I(S, (C) => {
        s(n) ? C($) : s(r).length === 0 ? C(J, 1) : C(W, -1);
      });
    }
    u(U, E);
  }, $$slots: { default: true } });
  var B = p(x, 2);
  {
    var M = (U) => {
      var P = Bw(), E = d(P), S = p(d(E), 4), $ = d(S), J = p(E, 2);
      jn(J, { class: "flex-1 px-7 py-6", children: (A, k) => {
        var N = Nw(), O = d(N), Y = p(d(O), 2), V = d(Y), q = p(O, 2), ne = p(d(q), 2), K = d(ne), R = p(q, 2);
        {
          var L = (le) => {
            var ce = Iw(), fe = p(d(ce), 2), ve = d(fe);
            j(() => T(ve, s(a).content)), u(le, ce);
          };
          I(R, (le) => {
            s(a).content && le(L);
          });
        }
        var G = p(R, 2);
        {
          var Q = (le) => {
            var ce = Pw(), fe = ae(ce);
            kw(fe, {});
            var ve = p(fe, 2), be = p(d(ve), 2), _e40 = d(be), xe = d(_e40);
            Pl(xe, { class: "size-3.5 text-primary" });
            var Ae = p(_e40, 2), Ee = d(Ae), Se = d(Ee);
            j(() => T(Se, s(a).rule_name)), u(le, ce);
          };
          I(G, (le) => {
            s(a).rule_name && le(Q);
          });
        }
        var re = p(G, 2);
        {
          var ie = (le) => {
            var ce = $w(), fe = d(ce);
            {
              var ve = (xe) => {
                Cr(xe, { variant: "outline", class: "text-xs", children: (Ae, Ee) => {
                  var Se = Ue();
                  j((Pe) => T(Se, Pe), [() => s(a).event_type.replace(/_/g, " ")]), u(Ae, Se);
                }, $$slots: { default: true } });
              };
              I(fe, (xe) => {
                s(a).event_type && xe(ve);
              });
            }
            var be = p(fe, 2);
            {
              var _e40 = (xe) => {
                Cr(xe, { variant: "secondary", class: "text-xs capitalize", children: (Ae, Ee) => {
                  var Se = Ue();
                  j(() => T(Se, s(a).event_category)), u(Ae, Se);
                }, $$slots: { default: true } });
              };
              I(be, (xe) => {
                s(a).event_category && xe(_e40);
              });
            }
            u(le, ce);
          };
          I(re, (le) => {
            (s(a).event_type || s(a).event_category) && le(ie);
          });
        }
        j(() => {
          T(V, s(a).sender || s(a).source_name || "Unknown"), T(K, s(a).subject || "(no subject)");
        }), u(A, N);
      }, $$slots: { default: true } });
      var W = p(J, 2);
      {
        var C = (A) => {
          const k = H(() => s(o)[s(a).id]);
          var N = jw(), O = ae(N);
          {
            var Y = (K) => {
              var R = Mw(), L = d(R);
              kg(L, { get steps() {
                return s(k).steps;
              } });
              var G = p(L, 2);
              {
                var Q = (re) => {
                  var ie = Rw(), le = d(ie);
                  j(() => T(le, s(k).error)), u(re, ie);
                };
                I(G, (re) => {
                  !s(k).running && s(k).success === false && s(k).error && re(Q);
                });
              }
              u(K, R);
            };
            I(O, (K) => {
              var _a10, _b4;
              ((_b4 = (_a10 = s(k)) == null ? void 0 : _a10.steps) == null ? void 0 : _b4.length) && K(Y);
            });
          }
          var V = p(O, 2), q = d(V);
          {
            let K = H(() => {
              var _a10;
              return (_a10 = s(k)) == null ? void 0 : _a10.running;
            });
            tt(q, { variant: "destructive", class: "flex-1 gap-2", get disabled() {
              return s(K);
            }, onclick: () => s(a) && c(s(a)), children: (R, L) => {
              var G = zw(), Q = ae(G);
              Ax(Q, { class: "size-4" }), u(R, G);
            }, $$slots: { default: true } });
          }
          var ne = p(q, 2);
          {
            let K = H(() => {
              var _a10, _b4;
              return ((_a10 = s(k)) == null ? void 0 : _a10.running) || ((_b4 = s(k)) == null ? void 0 : _b4.success) === true;
            });
            tt(ne, { class: "flex-1 gap-2", get disabled() {
              return s(K);
            }, onclick: () => s(a) != null && l(s(a)), children: (R, L) => {
              var G = ke(), Q = ae(G);
              {
                var re = (ce) => {
                  var fe = Ow(), ve = ae(fe);
                  fo(ve, { class: "size-4 animate-spin" }), u(ce, fe);
                }, ie = (ce) => {
                  var fe = Dw(), ve = ae(fe);
                  ss(ve, { class: "size-4" }), u(ce, fe);
                }, le = (ce) => {
                  var fe = Lw(), ve = ae(fe);
                  jc(ve, { class: "size-4" }), u(ce, fe);
                };
                I(Q, (ce) => {
                  var _a10, _b4;
                  ((_a10 = s(k)) == null ? void 0 : _a10.running) ? ce(re) : ((_b4 = s(k)) == null ? void 0 : _b4.success) === true ? ce(ie, 1) : ce(le, -1);
                });
              }
              u(R, G);
            }, $$slots: { default: true } });
          }
          u(A, N);
        };
        I(W, (A) => {
          s(a) && A(C);
        });
      }
      j((A) => T($, A), [() => f(s(a).timestamp)]), u(U, P);
    }, Z = (U) => {
      var P = Fw(), E = d(P), S = d(E);
      ss(S, { class: "size-12 opacity-20" }), u(U, P);
    };
    I(B, (U) => {
      s(a) ? U(M) : s(n) || U(Z, 1);
    });
  }
  u(t, v), Fe();
}
Zt(["click", "keydown"]);
async function sr(t, e = null) {
  const r = await vc(t);
  return r == null || r === void 0 ? e : ea(String(r), e);
}
async function _r(t, e) {
  await Cp(t, eo(e));
}
async function oi(t) {
  await Ip(t);
}
async function Ww(t) {
  if (t.length === 0) return {};
  const e = await Promise.all(t.map(async (r) => [r, ea(String(await vc(r) ?? ""), null)]));
  return Object.fromEntries(e);
}
const un = Object.freeze(Object.defineProperty({ __proto__: null, getSetting: sr, getSettings: Ww, removeSetting: oi, setSetting: _r }, Symbol.toStringTag, { value: "Module" })), Vw = "https://gmail.googleapis.com/gmail/v1/users/me";
class Fg extends Error {
  constructor(e, r, n) {
    super(e);
    __publicField(this, "status");
    __publicField(this, "code");
    this.name = "GmailApiError", this.status = r, this.code = n ?? null;
  }
}
function Hw(t) {
  return { Authorization: `Bearer ${t}` };
}
async function Ni(t, e) {
  var _a10, _b4, _c6, _d4;
  const r = await fetch(`${Vw}${e}`, { headers: Hw(t) });
  if (!r.ok) {
    const n = await r.json().catch(() => ({})), a = ((_a10 = n.error) == null ? void 0 : _a10.message) || `Gmail API error: ${r.status}`, o = (_d4 = (_c6 = (_b4 = n.error) == null ? void 0 : _b4.errors) == null ? void 0 : _c6[0]) == null ? void 0 : _d4.reason;
    throw new Fg(a, r.status, o);
  }
  return r.json();
}
function Ug(t) {
  return Ni(t, "/profile");
}
function Gg(t, { maxResults: e = 20, pageToken: r, q: n } = {}) {
  const a = new URLSearchParams();
  return a.set("maxResults", String(e)), r && a.set("pageToken", r), n && a.set("q", n), Ni(t, `/messages?${a}`);
}
function Wg(t, e, r = "full") {
  return Ni(t, `/messages/${e}?format=${r}`);
}
function qw(t, { startHistoryId: e, pageToken: r, maxResults: n = 500 }) {
  const a = new URLSearchParams();
  return a.set("startHistoryId", e), a.set("maxResults", String(n)), a.append("historyTypes", "messageAdded"), a.append("historyTypes", "messageDeleted"), r && a.set("pageToken", r), Ni(t, `/history?${a}`);
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
function ii(t, e) {
  for (const r of t) {
    if (r.mimeType === e) return r;
    if (r.parts) {
      const n = ii(r.parts, e);
      if (n) return n;
    }
  }
}
function Yw(t) {
  var _a10;
  try {
    const e = new DOMParser().parseFromString(t, "text/html");
    for (const r of e.querySelectorAll("style, script")) r.remove();
    return (((_a10 = e.body) == null ? void 0 : _a10.textContent) || "").replace(/\s+/g, " ").trim();
  } catch {
    return t.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "").replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "").replace(/<[^>]+>/g, " ").replace(/&#x([0-9a-f]+);/gi, (e, r) => String.fromCodePoint(parseInt(r, 16))).replace(/&#(\d+);/g, (e, r) => String.fromCodePoint(Number(r))).replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/\s+/g, " ").trim();
  }
}
function Kw(t) {
  var _a10, _b4;
  const e = t == null ? void 0 : t.payload;
  if (!e) return "";
  const r = e.body;
  if (r == null ? void 0 : r.data) return Xs(r.data);
  const n = e.parts || [], a = ii(n, "text/plain");
  if ((_a10 = a == null ? void 0 : a.body) == null ? void 0 : _a10.data) return Xs(a.body.data);
  const o = ii(n, "text/html");
  return ((_b4 = o == null ? void 0 : o.body) == null ? void 0 : _b4.data) ? Yw(Xs(o.body.data)) : "(no body)";
}
function Xw(t) {
  var _a10;
  const e = t == null ? void 0 : t.payload;
  if (!e) return null;
  if (e.mimeType === "text/html") {
    const a = e.body;
    if (a == null ? void 0 : a.data) return Xs(a.data);
  }
  const r = e.parts || [], n = ii(r, "text/html");
  return ((_a10 = n == null ? void 0 : n.body) == null ? void 0 : _a10.data) ? Xs(n.body.data) : null;
}
const en = "gmail", Bu = 8, Vg = 50, Hg = 100;
async function Zw(t, { limit: e = Vg, onProgress: r = () => {
}, signal: n } = {}) {
  var _a10;
  const a = await Sd(en);
  if (a == null ? void 0 : a.historyId) try {
    return await t2(t, a, r, n);
  } catch (i) {
    if (i instanceof Fg && (i.status === 404 || i.code === "notFound") || ((_a10 = i == null ? void 0 : i.message) == null ? void 0 : _a10.includes("Start history id"))) r({ phase: "info", message: "History expired, performing full re-sync..." }), await hc(en);
    else throw i;
  }
  return await Qw(t, e === 0 ? 1 / 0 : e, r, n);
}
async function Jw(t, { limit: e = Vg, onProgress: r = () => {
}, signal: n } = {}) {
  const a = await Sd(en);
  return (a == null ? void 0 : a.oldestPageToken) ? await e2(t, a, e === 0 ? 1 / 0 : e, r, n) : (r({ phase: "done", message: "All messages already synced" }), { added: 0, errors: 0 });
}
async function qg() {
  const t = await Sd(en);
  return t ? { synced: true, totalItems: t.totalItems || 0, lastSyncAt: t.lastSyncAt, historyId: t.historyId, hasMore: !!t.oldestPageToken } : { synced: false, totalItems: 0, lastSyncAt: null, hasMore: false };
}
async function kd() {
  return Number(await _c(en) ?? 0);
}
async function Qw(t, e, r, n) {
  r({ phase: "counting", message: "Getting mailbox info..." }), ja(n);
  const a = await Ug(t);
  r({ phase: "listing", message: "Listing messages...", current: 0, total: Math.min(a.messagesTotal ?? e, e) });
  const o = [];
  let i, l = null;
  for (; o.length < e; ) {
    ja(n);
    const x = e - o.length, m = await Gg(t, { maxResults: Math.min(Hg, x), pageToken: i }), y = (m.messages || []).map((h) => h.id);
    if (o.push(...y), r({ phase: "listing", message: `Listed ${o.length} messages...`, current: o.length, total: Math.min(a.messagesTotal ?? e, e) }), i = m.nextPageToken, !i || y.length === 0) break;
  }
  if (l = i || null, o.length === 0) return await Ol({ sourceType: en, historyId: a.historyId ?? "", lastSyncAt: Date.now(), totalItems: 0, oldestPageToken: "" }), { added: 0, deleted: 0, errors: 0 };
  const { added: c, errors: f } = await Yg(t, o, r, n), v = await kd();
  return await Ol({ sourceType: en, historyId: a.historyId ?? "", lastSyncAt: Date.now(), totalItems: v, oldestPageToken: l ?? "" }), r({ phase: "done", message: `Synced ${c} messages`, current: c, total: c }), { added: c, deleted: 0, errors: f };
}
async function e2(t, e, r, n, a) {
  n({ phase: "listing", message: "Loading more messages...", current: 0 }), ja(a);
  const o = [];
  let i = e.oldestPageToken || void 0, l = null;
  for (; o.length < r; ) {
    ja(a);
    const x = r - o.length, m = await Gg(t, { maxResults: Math.min(Hg, x), pageToken: i }), y = (m.messages || []).map((h) => h.id);
    if (o.push(...y), n({ phase: "listing", message: `Listed ${o.length} more messages...`, current: o.length }), i = m.nextPageToken, !i || y.length === 0) break;
  }
  if (l = i || null, o.length === 0) return await Qs(en, e.historyId ?? "", Date.now(), e.totalItems ?? 0, ""), n({ phase: "done", message: "All messages synced" }), { added: 0, errors: 0 };
  const { added: c, errors: f } = await Yg(t, o, n, a), v = await kd();
  return await Qs(en, e.historyId ?? "", Date.now(), v, l ?? ""), n({ phase: "done", message: l ? `Downloaded ${c} more (more available)` : `Downloaded ${c} more (all synced)`, current: v, total: v }), { added: c, errors: f };
}
async function t2(t, e, r, n) {
  r({ phase: "syncing", message: "Checking for changes..." }), ja(n);
  let a = 0, o = 0, i = 0, l, c = e.historyId;
  do {
    ja(n);
    const v = await qw(t, { startHistoryId: e.historyId, pageToken: l });
    if (c = v.historyId ?? c, l = v.nextPageToken, !!v.history) {
      for (const x of v.history) {
        if (x.messagesAdded) {
          const m = x.messagesAdded.map((h) => h.message.id), y = [...new Set(m.filter(Boolean))];
          if (y.length > 0) {
            const h = await Promise.allSettled(y.map((w) => Wg(t, w))), b = [];
            for (const w of h) w.status === "fulfilled" ? b.push(Kg(w.value)) : i++;
            b.length > 0 && (await Xg(b), await Zg(b), a += b.length);
          }
        }
        if (x.messagesDeleted) {
          const m = x.messagesDeleted.map((y) => gv(en, y.message.id)).filter(Boolean);
          m.length > 0 && (await r2(m), o += m.length);
        }
      }
      r({ phase: "syncing", message: `Changes: +${a} -${o}`, current: a + o });
    }
  } while (l);
  const f = await kd();
  return await Ol({ sourceType: en, historyId: c, lastSyncAt: Date.now(), totalItems: f, oldestPageToken: e.oldestPageToken ?? "" }), r({ phase: "done", message: a === 0 && o === 0 ? "Already up to date" : `Synced: +${a} -${o}`, current: f, total: f }), { added: a, deleted: o, errors: i };
}
async function Yg(t, e, r, n) {
  r({ phase: "downloading", message: "Downloading messages...", current: 0, total: e.length });
  let a = 0, o = 0;
  for (let i = 0; i < e.length; i += Bu) {
    ja(n);
    const l = e.slice(i, i + Bu), c = await Promise.allSettled(l.map((v) => Wg(t, v))), f = [];
    for (const v of c) v.status === "fulfilled" ? f.push(Kg(v.value)) : o++;
    f.length > 0 && (await Xg(f), await Zg(f)), a += f.length, r({ phase: "downloading", message: `Downloaded ${a} of ${e.length} messages`, current: a, total: e.length });
  }
  return { added: a, errors: o };
}
function Kg(t) {
  const e = t, r = ca(e, "From") ?? "", n = ca(e, "To") ?? "", a = ca(e, "Cc") ?? "", o = ca(e, "Subject") || "(no subject)", i = ca(e, "Date"), l = ca(e, "Message-ID") ?? "", c = ca(e, "In-Reply-To") ?? "", f = ca(e, "References") ?? "";
  let v;
  try {
    v = i ? new Date(i).getTime() : t.internalDate ? Number(t.internalDate) : Date.now();
  } catch {
    v = Date.now();
  }
  return { id: gv(en, t.id), sourceType: en, sourceId: t.id, threadKey: `gmail:${t.threadId ?? "unknown"}`, type: "email", from: r, to: n, cc: a, subject: o, snippet: t.snippet || "", body: Kw(e) ?? "", htmlBody: Xw(e) ?? "", date: v, labels: t.labelIds || [], messageId: l, inReplyTo: c, references: f, raw: t, syncedAt: Date.now() };
}
async function Xg(t) {
  const e = t.map((r) => ({ id: r.id, sourceType: r.sourceType, sourceId: r.sourceId ?? null, threadKey: r.threadKey ?? null, type: r.type ?? null, from: r.from ?? null, to: r.to ?? null, cc: r.cc ?? null, subject: r.subject ?? null, snippet: r.snippet ?? null, body: r.body ?? null, htmlBody: r.htmlBody ?? null, date: r.date ?? null, labels: eo(r.labels), messageId: r.messageId ?? null, inReplyTo: r.inReplyTo ?? null, references: r.references ?? null, raw: eo(r.raw), syncedAt: r.syncedAt ?? null }));
  await xc(e);
}
async function r2(t) {
  await qp(t);
}
async function Zg(t) {
  const e = /* @__PURE__ */ new Map();
  for (const r of t) for (const n of [r.from, r.to, r.cc]) {
    if (!n) continue;
    const a = n.split(",").map((o) => o.trim()).filter(Boolean);
    for (const o of a) {
      const i = n2(o);
      i && !e.has(i.email) && e.set(i.email, { ...i, date: r.date ?? Date.now() });
    }
  }
  for (const [r, { name: n, date: a }] of e) {
    const o = await Yp(r);
    if (o != null) {
      const i = o;
      await bl(r, i.name || n || "", Number(i.firstSeen) || a, Math.max(a, Number(i.lastSeen) || 0));
    } else await bl(r, n || "", a, a);
  }
}
function n2(t) {
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
async function a2() {
  const [t, e] = await Promise.all([ws().then((o) => Number(o ?? 0)), xi().then((o) => Number(o ?? 0))]);
  if (t === 0) return null;
  const r = [`Stored data: ${t} emails, ${e} contacts.`], { oldest: n, newest: a } = await Jg();
  if (n && a) {
    const o = new Date(n.date).toLocaleDateString(), i = new Date(a.date).toLocaleDateString();
    r.push(`Date range: ${o} to ${i}.`);
  }
  return r.join(" ");
}
async function s2() {
  const [t, e] = await Promise.all([ws().then((o) => Number(o ?? 0)), xi().then((o) => Number(o ?? 0))]);
  if (t === 0) return "No emails stored locally.";
  const r = ["## Data Summary", `- **Emails:** ${t}`, `- **Contacts:** ${e}`], { oldest: n, newest: a } = await Jg();
  if (n && a) {
    const o = new Date(n.date).toLocaleDateString(), i = new Date(a.date).toLocaleDateString();
    r.push(`- **Date range:** ${o} \u2014 ${i}`);
  }
  return r.join(`
`);
}
async function o2(t = 10) {
  const e = await ps(t);
  return (e == null ? void 0 : e.length) ? e.map((r) => Qg(Td(r))).join(`

---

`) : "No emails stored locally.";
}
async function i2(t, e = 10) {
  if (!t) return "No search query provided.";
  const r = await ps(e * 5), n = t.toLowerCase(), a = (r ?? []).filter((o) => {
    const i = String(o.subject ?? "").toLowerCase(), l = String(o.from ?? "").toLowerCase(), c = String(o.to ?? "").toLowerCase(), f = String(o.snippet ?? "").toLowerCase(), v = String(o.body ?? "").toLowerCase();
    return i.includes(n) || l.includes(n) || c.includes(n) || f.includes(n) || v.includes(n);
  }).slice(0, e);
  return a.length === 0 ? "No matching emails found." : a.map((o) => Qg(Td(o))).join(`

---

`);
}
async function li() {
  const e = (await ta() ?? []).filter((o) => o.status === "pending");
  if (e.length === 0) return null;
  const r = e.map((o) => ({ ...o, tags: ea(o.tags, []) })), { categories: n, order: a } = Wv(r);
  return { categories: n, order: a, total: r.length };
}
async function l2({ query: t, limit: e = 50, offset: r = 0 } = {}) {
  const n = t ? 2e3 : e + r;
  let o = await ps(n) ?? [];
  if (t) {
    const c = t.toLowerCase();
    o = o.filter((f) => {
      const v = String(f.subject ?? "").toLowerCase(), x = String(f.from ?? "").toLowerCase(), m = String(f.to ?? "").toLowerCase(), y = String(f.snippet ?? "").toLowerCase();
      return v.includes(c) || x.includes(c) || m.includes(c) || y.includes(c);
    });
  }
  const i = t ? o.length : Number(await ws() ?? 0);
  return { items: o.slice(r, r + e).map((c) => Td(c)), total: i };
}
async function Jg() {
  const [t, e] = await Promise.all([Ap(), Ep()]), r = t != null ? Number(t) : null, n = e != null ? Number(e) : null;
  return { oldest: r != null ? { date: r } : null, newest: n != null ? { date: n } : null };
}
function Td(t) {
  return { ...t, id: t.id, sourceType: t.sourceType, sourceId: t.sourceId, threadKey: t.threadKey, type: t.type, from: t.from, to: t.to, cc: t.cc, subject: t.subject, snippet: t.snippet, body: t.body, htmlBody: t.htmlBody, date: t.date != null ? Number(t.date) : null, syncedAt: t.syncedAt != null ? Number(t.syncedAt) : null, labels: ea(t.labels, []), raw: ea(t.raw, null), messageId: t.messageId ?? "", inReplyTo: t.inReplyTo ?? "", references: t.references ?? "" };
}
function Qg(t) {
  const e = t.date ? new Date(t.date).toLocaleString() : "Unknown date", r = yb(t.body || t.snippet || "", 500);
  switch (t.type) {
    case "email":
      return [`**Subject:** ${t.subject}`, `**From:** ${t.from}`, `**To:** ${t.to}`, t.cc ? `**CC:** ${t.cc}` : "", `**Date:** ${e}`, `**Labels:** ${(t.labels || []).join(", ")}`, "", r].filter(Boolean).join(`
`);
    default:
      return [`**From:** ${t.from}`, `**Date:** ${e}`, "", r].join(`
`);
  }
}
const c2 = "https://twitter.com/i/oauth2/authorize", em = "https://api.twitter.com/2/oauth2/token", d2 = "https://api.twitter.com/2/oauth2/revoke", u2 = ["tweet.read", "users.read", "like.read", "like.write", "bookmark.read", "bookmark.write", "offline.access"].join(" "), Ad = "me-ai:twitter-token", Dl = "me-ai:twitter-pkce-verifier", Ll = "me-ai:twitter-pkce-state", Ed = "me-ai:twitter-token", Fu = 300 * 1e3;
let Ba = null, Cd = null, ci = 0;
function Uu(t = 64) {
  const e = new Uint8Array(t);
  return crypto.getRandomValues(e), Array.from(e, (r) => r.toString(16).padStart(2, "0")).join("").slice(0, t);
}
async function f2(t) {
  const e = new TextEncoder().encode(t);
  return crypto.subtle.digest("SHA-256", e);
}
function p2(t) {
  const e = new Uint8Array(t);
  let r = "";
  for (const n of e) r += String.fromCharCode(n);
  return btoa(r).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
async function v2(t) {
  const e = await f2(t);
  return p2(e);
}
function tm(t) {
  try {
    localStorage.setItem(Ad, JSON.stringify(t));
  } catch {
  }
}
function rm() {
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
async function nm(t, e, r) {
  const n = Date.now() + r * 1e3;
  ci = n;
  const a = { access_token: t, refresh_token: e, expires_at: n };
  tm(a);
  try {
    const { setSetting: o } = await wr(async () => {
      const { setSetting: i } = await Promise.resolve().then(() => un);
      return { setSetting: i };
    }, void 0);
    await o(Ed, a);
  } catch {
  }
}
async function Fo() {
  ci = 0, rm();
  try {
    const { removeSetting: t } = await wr(async () => {
      const { removeSetting: e } = await Promise.resolve().then(() => un);
      return { removeSetting: e };
    }, void 0);
    await t(Ed);
  } catch {
  }
}
function Ji(t, e) {
  Ba = t, Cd = `${window.location.origin}/#oauth-twitter`;
}
async function g2() {
  if (!Ba) throw new Error("Twitter Auth not initialized. Call initTwitterAuth first.");
  const t = Uu(64), e = await v2(t), r = Uu(32);
  localStorage.setItem(Dl, t), localStorage.setItem(Ll, r);
  const n = new URLSearchParams({ response_type: "code", client_id: Ba, redirect_uri: Cd ?? `${window.location.origin}/#oauth-twitter`, scope: u2, state: r, code_challenge: e, code_challenge_method: "S256" });
  window.location.href = `${c2}?${n}`;
}
async function m2(t, e) {
  const r = localStorage.getItem(Ll), n = localStorage.getItem(Dl);
  if (localStorage.removeItem(Ll), localStorage.removeItem(Dl), !r || r !== e) throw new Error("Invalid state parameter \u2014 possible CSRF attack.");
  if (!n) throw new Error("Missing PKCE code verifier \u2014 auth flow may have been interrupted.");
  const a = new URLSearchParams({ grant_type: "authorization_code", code: t, redirect_uri: Cd ?? `${window.location.origin}/#oauth-twitter`, client_id: Ba, code_verifier: n }), o = await fetch(em, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: a });
  if (!o.ok) {
    const l = await o.json().catch(() => ({}));
    throw new Error(l.error_description || l.error || `Token exchange failed: ${o.status}`);
  }
  const i = await o.json();
  return await nm(i.access_token, i.refresh_token, i.expires_in ?? 7200), { access_token: i.access_token, refresh_token: i.refresh_token };
}
async function am() {
  const t = Id();
  if ((t == null ? void 0 : t.access_token) && Date.now() < t.expires_at - Fu) return ci = t.expires_at, { access_token: t.access_token, refresh_token: t.refresh_token ?? "" };
  try {
    const { getSetting: e } = await wr(async () => {
      const { getSetting: n } = await Promise.resolve().then(() => un);
      return { getSetting: n };
    }, void 0), r = await e(Ed);
    if (!(r == null ? void 0 : r.access_token)) return rm(), null;
    if (Date.now() > r.expires_at - Fu) {
      if (r.refresh_token) try {
        return await h2(r.refresh_token);
      } catch {
        return await Fo(), null;
      }
      return await Fo(), null;
    }
    return ci = r.expires_at, tm(r), { access_token: r.access_token, refresh_token: r.refresh_token ?? "" };
  } catch {
    return await Fo(), null;
  }
}
async function h2(t) {
  var _a10;
  let e = t;
  if (e || (e = (_a10 = Id()) == null ? void 0 : _a10.refresh_token), !e) throw new Error("No refresh token available.");
  const r = new URLSearchParams({ grant_type: "refresh_token", refresh_token: e, client_id: Ba }), n = await fetch(em, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: r });
  if (!n.ok) {
    const o = await n.json().catch(() => ({}));
    throw new Error(o.error_description || o.error || `Token refresh failed: ${n.status}`);
  }
  const a = await n.json();
  return await nm(a.access_token, a.refresh_token ?? e, a.expires_in ?? 7200), { access_token: a.access_token, refresh_token: a.refresh_token ?? e };
}
async function _2() {
  const t = Id();
  if ((t == null ? void 0 : t.access_token) && Ba) try {
    await fetch(d2, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ token: t.access_token, client_id: Ba }) });
  } catch {
  }
  await Fo();
}
const b2 = "https://api.twitter.com/2";
class x2 extends Error {
  constructor(e, r, n) {
    super(e);
    __publicField(this, "status");
    __publicField(this, "code");
    this.name = "TwitterApiError", this.status = r, this.code = n ?? null;
  }
}
function y2(t) {
  return { Authorization: `Bearer ${t}` };
}
async function sm(t, e) {
  const r = await fetch(`${b2}${e}`, { headers: y2(t) });
  if (!r.ok) {
    const n = await r.json().catch(() => ({})), a = n.detail || n.title || `Twitter API error: ${r.status}`, o = n.type ?? void 0;
    throw new x2(a, r.status, o);
  }
  return r.json();
}
function Pd(t) {
  return sm(t, "/users/me?user.fields=id,name,username,profile_image_url,public_metrics");
}
function $d(t, e, r = {}) {
  const { maxResults: n = 10, paginationToken: a } = r, o = new URLSearchParams({ max_results: String(Math.min(n, 100)), "tweet.fields": "created_at,author_id,public_metrics,referenced_tweets,conversation_id,text", "user.fields": "username,name", expansions: "author_id" });
  return a && o.set("pagination_token", a), sm(t, `/users/${e}/tweets?${o}`);
}
function Nd(t) {
  var _a10;
  const e = /* @__PURE__ */ new Map(), r = (_a10 = t == null ? void 0 : t.includes) == null ? void 0 : _a10.users;
  if (r) for (const n of r) e.set(n.id, { username: n.username, name: n.name });
  return e;
}
const om = 50;
async function w2(t, { limit: e = om, onProgress: r = () => {
}, signal: n } = {}) {
  var _a10, _b4;
  _o(n);
  const a = await Pd(t), o = (_a10 = a.data) == null ? void 0 : _a10.id, i = (_b4 = a.data) == null ? void 0 : _b4.username;
  if (!o || !i) throw new Error("Twitter me.data missing");
  const l = await zd("twitter");
  return l ? await A2(t, o, i, l, e, r, n) : await T2(t, o, i, e, r, n);
}
async function k2(t, { limit: e = om, onProgress: r = () => {
}, signal: n } = {}) {
  var _a10, _b4;
  _o(n);
  const a = await Pd(t), o = (_a10 = a.data) == null ? void 0 : _a10.id, i = (_b4 = a.data) == null ? void 0 : _b4.username;
  if (!o || !i) throw new Error("Twitter me.data missing");
  const l = await zd("twitter");
  return (l == null ? void 0 : l.oldestPageToken) ? await E2(t, o, i, l, e, r, n) : { added: 0, errors: 0 };
}
async function im() {
  const t = await zd("twitter");
  return t ? { synced: true, totalItems: t.totalItems || 0, lastSyncAt: t.lastSyncAt, hasMore: !!t.oldestPageToken } : { synced: false, totalItems: 0, lastSyncAt: null, hasMore: false };
}
async function S2() {
  await Vp("twitter"), await hc("twitter");
}
async function T2(t, e, r, n, a, o) {
  var _a10;
  let i = 0, l = 0, c, f = null, v = null;
  for (a({ phase: "listing", message: "Fetching tweets\u2026", current: 0, total: n }); i < n; ) {
    _o(o);
    const x = Math.min(n - i, 100);
    let m;
    try {
      m = await $d(t, e, { maxResults: x, paginationToken: c });
    } catch (D) {
      l++, console.warn("[twitter-sync] API error:", D == null ? void 0 : D.message);
      break;
    }
    const y = (m == null ? void 0 : m.data) ?? [];
    if (y.length === 0) break;
    const h = Nd(m), b = y.map((D) => Rd(D, h, r));
    !f && b.length > 0 && (f = b[0].sourceId), await Md(b), i += b.length, a({ phase: "fetching", message: `Downloaded ${i} tweets\u2026`, current: i, total: n });
    const w = (_a10 = m == null ? void 0 : m.meta) == null ? void 0 : _a10.next_token;
    if (!w) break;
    c = w, v = w;
  }
  return await Od({ sourceType: "twitter", historyId: f || "", lastSyncAt: Date.now(), totalItems: i, oldestPageToken: v || "" }), a({ phase: "done", message: `Synced ${i} tweets`, current: i, total: i }), { added: i, errors: l };
}
async function A2(t, e, r, n, a, o, i) {
  var _a10;
  let l = 0, c = 0, f;
  for (o({ phase: "incremental", message: "Checking for new tweets\u2026", current: 0, total: 0 }); l < a; ) {
    _o(i);
    const m = Math.min(a - l, 100);
    let y;
    try {
      y = await $d(t, e, { maxResults: m, paginationToken: f });
    } catch (F) {
      c++, console.warn("[twitter-sync] Incremental sync error:", F == null ? void 0 : F.message);
      break;
    }
    const h = (y == null ? void 0 : y.data) ?? [];
    if (h.length === 0) break;
    const b = Nd(y), w = [];
    let D = false;
    for (const F of h) {
      if (F.id === n.historyId) {
        D = true;
        break;
      }
      w.push(F);
    }
    if (w.length > 0) {
      const F = w.map((B) => Rd(B, b, r));
      await Md(F), l += F.length, o({ phase: "incremental", message: `${l} new tweets\u2026`, current: l, total: 0 });
    }
    if (D || !((_a10 = y == null ? void 0 : y.meta) == null ? void 0 : _a10.next_token)) break;
    f = y.meta.next_token;
  }
  const v = (n.totalItems || 0) + l, x = l > 0 && await C2() || n.historyId;
  return await Od({ sourceType: "twitter", historyId: x, lastSyncAt: Date.now(), totalItems: v, oldestPageToken: n.oldestPageToken }), o({ phase: "done", message: l > 0 ? `${l} new tweets synced` : "Already up to date", current: l, total: l }), { added: l, errors: c };
}
async function E2(t, e, r, n, a, o, i) {
  var _a10;
  let l = 0, c = 0, f = n.oldestPageToken;
  for (o({ phase: "fetching", message: "Fetching older tweets\u2026", current: 0, total: a }); l < a && f; ) {
    _o(i);
    const v = Math.min(a - l, 100);
    let x;
    try {
      x = await $d(t, e, { maxResults: v, paginationToken: f });
    } catch {
      c++;
      break;
    }
    const m = (x == null ? void 0 : x.data) ?? [];
    if (m.length === 0) break;
    const y = Nd(x), h = m.map((b) => Rd(b, y, r));
    await Md(h), l += h.length, o({ phase: "fetching", message: `Downloaded ${n.totalItems + l} tweets total\u2026`, current: l, total: a }), f = ((_a10 = x == null ? void 0 : x.meta) == null ? void 0 : _a10.next_token) || null;
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
async function C2() {
  try {
    return await Kp("twitter") ?? null;
  } catch {
    return null;
  }
}
function _o(t) {
  if (t == null ? void 0 : t.aborted) throw new DOMException("Aborted", "AbortError");
}
const I2 = typeof localStorage < "u" && localStorage.getItem("debug") === "true";
function Gu(...t) {
  I2 && console.log("[debug]", ...t);
}
function qa(t) {
  return Gu(`[MOUNT] ${t}`), () => Gu(`[DESTROY] ${t}`);
}
var P2 = _('<button class="flex gap-3 px-4 py-3.5 bg-card border-b border-border last:border-b-0 text-left hover:bg-accent transition-colors w-full"><div class="size-[34px] rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-semibold shrink-0"> </div> <div class="flex-1 min-w-0 flex flex-col gap-0.5"><div class="flex items-baseline justify-between gap-2"><span class="text-[0.84rem] font-semibold text-foreground truncate"> </span> <span class="text-[0.68rem] text-muted-foreground/40 whitespace-nowrap shrink-0"> </span></div> <div class="text-[0.8rem] text-foreground/70 truncate"> </div> <div class="text-[0.73rem] text-muted-foreground/50 truncate"> </div></div></button>'), $2 = _('<div class="flex flex-col rounded border border-border overflow-hidden"></div>');
function Wu(t, e) {
  Be(e, true);
  let r = oe(e, "messages", 19, () => []);
  Xt(() => qa("MessageList"));
  var n = $2();
  Ve(n, 21, r, Qe, (a, o) => {
    var i = P2(), l = d(i), c = d(l), f = p(l, 2), v = d(f), x = d(v), m = d(x), y = p(x, 2), h = d(y), b = p(v, 2), w = d(b), D = p(b, 2), F = d(D);
    j((B, M, Z) => {
      T(c, B), T(m, M), T(h, Z), T(w, s(o).subject), T(F, s(o).snippet);
    }, [() => wb(s(o).from), () => Uv(s(o).from), () => Mc(s(o).date)]), Ne("click", i, () => e.onselect(s(o))), u(a, i);
  }), u(t, n), Fe();
}
Zt(["click"]);
function Dd() {
  return { async: false, breaks: false, extensions: null, gfm: true, hooks: null, pedantic: false, renderer: null, silent: false, tokenizer: null, walkTokens: null };
}
var Ya = Dd();
function lm(t) {
  Ya = t;
}
var Ca = { exec: () => null };
function Ct(t, e = "") {
  let r = typeof t == "string" ? t : t.source, n = { replace: (a, o) => {
    let i = typeof o == "string" ? o : o.source;
    return i = i.replace(Or.caret, "$1"), r = r.replace(a, i), n;
  }, getRegex: () => new RegExp(r, e) };
  return n;
}
var N2 = (() => {
  try {
    return !!new RegExp("(?<=1)(?<!1)");
  } catch {
    return false;
  }
})(), Or = { codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] +\S/, listReplaceTask: /^\[[ xX]\] +/, listTaskCheckbox: /\[[ xX]\]/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (t) => new RegExp(`^( {0,3}${t})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), hrRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), fencesBeginRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}(?:\`\`\`|~~~)`), headingBeginRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}#`), htmlBeginRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}<(?:[a-z].*>|!--)`, "i"), blockquoteBeginRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}>`) }, R2 = /^(?:[ \t]*(?:\n|$))+/, M2 = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, z2 = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, bo = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, O2 = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, Ld = / {0,3}(?:[*+-]|\d{1,9}[.)])/, cm = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, dm = Ct(cm).replace(/bull/g, Ld).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), D2 = Ct(cm).replace(/bull/g, Ld).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), jd = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, L2 = /^[^\n]+/, Bd = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, j2 = Ct(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", Bd).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), B2 = Ct(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, Ld).getRegex(), Ri = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", Fd = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, F2 = Ct("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", Fd).replace("tag", Ri).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), um = Ct(jd).replace("hr", bo).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Ri).getRegex(), U2 = Ct(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", um).getRegex(), Ud = { blockquote: U2, code: M2, def: j2, fences: z2, heading: O2, hr: bo, html: F2, lheading: dm, list: B2, newline: R2, paragraph: um, table: Ca, text: L2 }, Vu = Ct("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", bo).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Ri).getRegex(), G2 = { ...Ud, lheading: D2, table: Vu, paragraph: Ct(jd).replace("hr", bo).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", Vu).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Ri).getRegex() }, W2 = { ...Ud, html: Ct(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", Fd).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: Ca, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: Ct(jd).replace("hr", bo).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", dm).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, V2 = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, H2 = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, fm = /^( {2,}|\\)\n(?!\s*$)/, q2 = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, Mi = /[\p{P}\p{S}]/u, Gd = /[\s\p{P}\p{S}]/u, pm = /[^\s\p{P}\p{S}]/u, Y2 = Ct(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, Gd).getRegex(), vm = /(?!~)[\p{P}\p{S}]/u, K2 = /(?!~)[\s\p{P}\p{S}]/u, X2 = /(?:[^\s\p{P}\p{S}]|~)/u, gm = /(?![*_])[\p{P}\p{S}]/u, Z2 = /(?![*_])[\s\p{P}\p{S}]/u, J2 = /(?:[^\s\p{P}\p{S}]|[*_])/u, Q2 = Ct(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", N2 ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), mm = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, ek = Ct(mm, "u").replace(/punct/g, Mi).getRegex(), tk = Ct(mm, "u").replace(/punct/g, vm).getRegex(), hm = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", rk = Ct(hm, "gu").replace(/notPunctSpace/g, pm).replace(/punctSpace/g, Gd).replace(/punct/g, Mi).getRegex(), nk = Ct(hm, "gu").replace(/notPunctSpace/g, X2).replace(/punctSpace/g, K2).replace(/punct/g, vm).getRegex(), ak = Ct("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, pm).replace(/punctSpace/g, Gd).replace(/punct/g, Mi).getRegex(), sk = Ct(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, gm).getRegex(), ok = "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", ik = Ct(ok, "gu").replace(/notPunctSpace/g, J2).replace(/punctSpace/g, Z2).replace(/punct/g, gm).getRegex(), lk = Ct(/\\(punct)/, "gu").replace(/punct/g, Mi).getRegex(), ck = Ct(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), dk = Ct(Fd).replace("(?:-->|$)", "-->").getRegex(), uk = Ct("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", dk).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), di = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/, fk = Ct(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label", di).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), _m = Ct(/^!?\[(label)\]\[(ref)\]/).replace("label", di).replace("ref", Bd).getRegex(), bm = Ct(/^!?\[(ref)\](?:\[\])?/).replace("ref", Bd).getRegex(), pk = Ct("reflink|nolink(?!\\()", "g").replace("reflink", _m).replace("nolink", bm).getRegex(), Hu = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, Wd = { _backpedal: Ca, anyPunctuation: lk, autolink: ck, blockSkip: Q2, br: fm, code: H2, del: Ca, delLDelim: Ca, delRDelim: Ca, emStrongLDelim: ek, emStrongRDelimAst: rk, emStrongRDelimUnd: ak, escape: V2, link: fk, nolink: bm, punctuation: Y2, reflink: _m, reflinkSearch: pk, tag: uk, text: q2, url: Ca }, vk = { ...Wd, link: Ct(/^!?\[(label)\]\((.*?)\)/).replace("label", di).getRegex(), reflink: Ct(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", di).getRegex() }, jl = { ...Wd, emStrongRDelimAst: nk, emStrongLDelim: tk, delLDelim: sk, delRDelim: ik, url: Ct(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", Hu).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: Ct(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", Hu).getRegex() }, gk = { ...jl, br: Ct(fm).replace("{2,}", "*").getRegex(), text: Ct(jl.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() }, zo = { normal: Ud, gfm: G2, pedantic: W2 }, Cs = { normal: Wd, gfm: jl, breaks: gk, pedantic: vk }, mk = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, qu = (t) => mk[t];
function An(t, e) {
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
function hk(t, e) {
  if (t.indexOf(e[1]) === -1) return -1;
  let r = 0;
  for (let n = 0; n < t.length; n++) if (t[n] === "\\") n++;
  else if (t[n] === e[0]) r++;
  else if (t[n] === e[1] && (r--, r < 0)) return n;
  return r > 0 ? -2 : -1;
}
function _k(t, e = 0) {
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
function bk(t, e, r) {
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
var ui = class {
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
      let r = e[0], n = bk(r, e[3] || "", this.rules);
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
`), v = f.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        n = n ? `${n}
${f}` : f, a = a ? `${a}
${v}` : v;
        let x = this.lexer.state.top;
        if (this.lexer.state.top = true, this.lexer.blockTokens(v, o, true), this.lexer.state.top = x, r.length === 0) break;
        let m = o.at(-1);
        if ((m == null ? void 0 : m.type) === "code") break;
        if ((m == null ? void 0 : m.type) === "blockquote") {
          let y = m, h = y.raw + `
` + r.join(`
`), b = this.blockquote(h);
          o[o.length - 1] = b, n = n.substring(0, n.length - y.raw.length) + b.raw, a = a.substring(0, a.length - y.text.length) + b.text;
          break;
        } else if ((m == null ? void 0 : m.type) === "list") {
          let y = m, h = y.raw + `
` + r.join(`
`), b = this.list(h);
          o[o.length - 1] = b, n = n.substring(0, n.length - m.raw.length) + b.raw, a = a.substring(0, a.length - y.raw.length) + b.raw, r = h.substring(o.at(-1).raw.length).split(`
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
        let c = false, f = "", v = "";
        if (!(e = o.exec(t)) || this.rules.block.hr.test(t)) break;
        f = e[0], t = t.substring(f.length);
        let x = _k(e[2].split(`
`, 1)[0], e[1].length), m = t.split(`
`, 1)[0], y = !x.trim(), h = 0;
        if (this.options.pedantic ? (h = 2, v = x.trimStart()) : y ? h = e[1].length + 1 : (h = x.search(this.rules.other.nonSpaceChar), h = h > 4 ? 1 : h, v = x.slice(h), h += e[1].length), y && this.rules.other.blankLine.test(m) && (f += m + `
`, t = t.substring(m.length + 1), c = true), !c) {
          let b = this.rules.other.nextBulletRegex(h), w = this.rules.other.hrRegex(h), D = this.rules.other.fencesBeginRegex(h), F = this.rules.other.headingBeginRegex(h), B = this.rules.other.htmlBeginRegex(h), M = this.rules.other.blockquoteBeginRegex(h);
          for (; t; ) {
            let Z = t.split(`
`, 1)[0], U;
            if (m = Z, this.options.pedantic ? (m = m.replace(this.rules.other.listReplaceNesting, "  "), U = m) : U = m.replace(this.rules.other.tabCharGlobal, "    "), D.test(m) || F.test(m) || B.test(m) || M.test(m) || b.test(m) || w.test(m)) break;
            if (U.search(this.rules.other.nonSpaceChar) >= h || !m.trim()) v += `
` + U.slice(h);
            else {
              if (y || x.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || D.test(x) || F.test(x) || w.test(x)) break;
              v += `
` + m;
            }
            y = !m.trim(), f += Z + `
`, t = t.substring(Z.length + 1), x = U.slice(h);
          }
        }
        a.loose || (i ? a.loose = true : this.rules.other.doubleBlankLine.test(f) && (i = true)), a.items.push({ type: "list_item", raw: f, task: !!this.options.gfm && this.rules.other.listIsTask.test(v), loose: false, text: v, tokens: [] }), a.raw += f;
      }
      let l = a.items.at(-1);
      if (l) l.raw = l.raw.trimEnd(), l.text = l.text.trimEnd();
      else return;
      a.raw = a.raw.trimEnd();
      for (let c of a.items) {
        if (this.lexer.state.top = false, c.tokens = this.lexer.blockTokens(c.text, []), c.task) {
          if (c.text = c.text.replace(this.rules.other.listReplaceTask, ""), ((_a10 = c.tokens[0]) == null ? void 0 : _a10.type) === "text" || ((_b4 = c.tokens[0]) == null ? void 0 : _b4.type) === "paragraph") {
            c.tokens[0].raw = c.tokens[0].raw.replace(this.rules.other.listReplaceTask, ""), c.tokens[0].text = c.tokens[0].text.replace(this.rules.other.listReplaceTask, "");
            for (let v = this.lexer.inlineQueue.length - 1; v >= 0; v--) if (this.rules.other.listIsTask.test(this.lexer.inlineQueue[v].src)) {
              this.lexer.inlineQueue[v].src = this.lexer.inlineQueue[v].src.replace(this.rules.other.listReplaceTask, "");
              break;
            }
          }
          let f = this.rules.other.listTaskCheckbox.exec(c.raw);
          if (f) {
            let v = { type: "checkbox", raw: f[0] + " ", checked: f[0] !== "[ ]" };
            c.checked = v.checked, a.loose ? c.tokens[0] && ["paragraph", "text"].includes(c.tokens[0].type) && "tokens" in c.tokens[0] && c.tokens[0].tokens ? (c.tokens[0].raw = v.raw + c.tokens[0].raw, c.tokens[0].text = v.raw + c.tokens[0].text, c.tokens[0].tokens.unshift(v)) : c.tokens.unshift({ type: "paragraph", raw: v.raw, text: v.raw, tokens: [v] }) : c.tokens.unshift(v);
          }
        }
        if (!a.loose) {
          let f = c.tokens.filter((x) => x.type === "space"), v = f.length > 0 && f.some((x) => this.rules.other.anyLine.test(x.raw));
          a.loose = v;
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
        let o = hk(e[2], "()");
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
        let v = [...n[0]][0].length, x = t.slice(0, a + n.index + v + i);
        if (Math.min(a, i) % 2) {
          let y = x.slice(1, -1);
          return { type: "em", raw: x, text: y, tokens: this.lexer.inlineTokens(y) };
        }
        let m = x.slice(2, -2);
        return { type: "strong", raw: x, text: m, tokens: this.lexer.inlineTokens(m) };
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
        let f = [...n[0]][0].length, v = t.slice(0, a + n.index + f + i), x = v.slice(a, -a);
        return { type: "del", raw: v, text: x, tokens: this.lexer.inlineTokens(x) };
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
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || Ya, this.options.tokenizer = this.options.tokenizer || new ui(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: false, inRawBlock: false, top: true };
    let r = { other: Or, block: zo.normal, inline: Cs.normal };
    this.options.pedantic ? (r.block = zo.pedantic, r.inline = Cs.pedantic) : this.options.gfm && (r.block = zo.gfm, this.options.breaks ? r.inline = Cs.breaks : r.inline = Cs.gfm), this.tokenizer.rules = r;
  }
  static get rules() {
    return { block: zo, inline: Cs };
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
      if ((_d4 = (_c6 = this.options.extensions) == null ? void 0 : _c6.inline) == null ? void 0 : _d4.some((v) => (c = v.call({ lexer: this }, e, r)) ? (e = e.substring(c.raw.length), r.push(c), true) : false)) continue;
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
        let v = r.at(-1);
        c.type === "text" && (v == null ? void 0 : v.type) === "text" ? (v.raw += c.raw, v.text += c.text) : r.push(c);
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
        let v = 1 / 0, x = e.slice(1), m;
        this.options.extensions.startInline.forEach((y) => {
          m = y.call({ lexer: this }, x), typeof m == "number" && m >= 0 && (v = Math.min(v, m));
        }), v < 1 / 0 && v >= 0 && (f = e.substring(0, v + 1));
      }
      if (c = this.tokenizer.inlineText(f)) {
        e = e.substring(c.raw.length), c.raw.slice(-1) !== "_" && (l = c.raw.slice(-1)), i = true;
        let v = r.at(-1);
        (v == null ? void 0 : v.type) === "text" ? (v.raw += c.raw, v.text += c.text) : r.push(c);
        continue;
      }
      if (e) {
        let v = "Infinite loop on byte: " + e.charCodeAt(0);
        if (this.options.silent) {
          console.error(v);
          break;
        } else throw new Error(v);
      }
    }
    return r;
  }
}, fi = class {
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
    return n ? '<pre><code class="language-' + An(n) + '">' + (r ? a : An(a, true)) + `</code></pre>
` : "<pre><code>" + (r ? a : An(a, true)) + `</code></pre>
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
    return `<code>${An(t, true)}</code>`;
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
    return e && (o += ' title="' + An(e) + '"'), o += ">" + n + "</a>", o;
  }
  image({ href: t, title: e, text: r, tokens: n }) {
    n && (r = this.parser.parseInline(n, this.parser.textRenderer));
    let a = Yu(t);
    if (a === null) return An(r);
    t = a;
    let o = `<img src="${t}" alt="${An(r)}"`;
    return e && (o += ` title="${An(e)}"`), o += ">", o;
  }
  text(t) {
    return "tokens" in t && t.tokens ? this.parser.parseInline(t.tokens) : "escaped" in t && t.escaped ? t.text : An(t.text);
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
    this.options = e || Ya, this.options.renderer = this.options.renderer || new fi(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new Vd();
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
}, __publicField(_d3, "passThroughHooks", /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens", "emStrongMask"])), __publicField(_d3, "passThroughHooksRespectAsync", /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens"])), _d3), xk = class {
  constructor(...t) {
    __publicField(this, "defaults", Dd());
    __publicField(this, "options", this.setOptions);
    __publicField(this, "parse", this.parseMarkdown(true));
    __publicField(this, "parseInline", this.parseMarkdown(false));
    __publicField(this, "Parser", mn);
    __publicField(this, "Renderer", fi);
    __publicField(this, "TextRenderer", Vd);
    __publicField(this, "Lexer", gn);
    __publicField(this, "Tokenizer", ui);
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
        let a = this.defaults.renderer || new fi(this.defaults);
        for (let o in r.renderer) {
          if (!(o in a)) throw new Error(`renderer '${o}' does not exist`);
          if (["options", "parser"].includes(o)) continue;
          let i = o, l = r.renderer[i], c = a[i];
          a[i] = (...f) => {
            let v = l.apply(a, f);
            return v === false && (v = c.apply(a, f)), v || "";
          };
        }
        n.renderer = a;
      }
      if (r.tokenizer) {
        let a = this.defaults.tokenizer || new ui(this.defaults);
        for (let o in r.tokenizer) {
          if (!(o in a)) throw new Error(`tokenizer '${o}' does not exist`);
          if (["options", "rules", "lexer"].includes(o)) continue;
          let i = o, l = r.tokenizer[i], c = a[i];
          a[i] = (...f) => {
            let v = l.apply(a, f);
            return v === false && (v = c.apply(a, f)), v;
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
              let x = await l.call(a, f);
              return c.call(a, x);
            })();
            let v = l.call(a, f);
            return c.call(a, v);
          } : a[i] = (...f) => {
            if (this.defaults.async) return (async () => {
              let x = await l.apply(a, f);
              return x === false && (x = await c.apply(a, f)), x;
            })();
            let v = l.apply(a, f);
            return v === false && (v = c.apply(a, f)), v;
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
        let n = "<p>An error occurred:</p><pre>" + An(r.message + "", true) + "</pre>";
        return e ? Promise.resolve(n) : n;
      }
      if (e) return Promise.reject(r);
      throw r;
    };
  }
}, Fa = new xk();
function Mt(t, e) {
  return Fa.parse(t, e);
}
Mt.options = Mt.setOptions = function(t) {
  return Fa.setOptions(t), Mt.defaults = Fa.defaults, lm(Mt.defaults), Mt;
};
Mt.getDefaults = Dd;
Mt.defaults = Ya;
Mt.use = function(...t) {
  return Fa.use(...t), Mt.defaults = Fa.defaults, lm(Mt.defaults), Mt;
};
Mt.walkTokens = function(t, e) {
  return Fa.walkTokens(t, e);
};
Mt.parseInline = Fa.parseInline;
Mt.Parser = mn;
Mt.parser = mn.parse;
Mt.Renderer = fi;
Mt.TextRenderer = Vd;
Mt.Lexer = gn;
Mt.lexer = gn.lex;
Mt.Tokenizer = ui;
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
const { entries: xm, setPrototypeOf: Zu, isFrozen: yk, getPrototypeOf: wk, getOwnPropertyDescriptor: kk } = Object;
let { freeze: Dr, seal: cn, create: Uo } = Object, { apply: Ul, construct: Gl } = typeof Reflect < "u" && Reflect;
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
const Oo = Lr(Array.prototype.forEach), Sk = Lr(Array.prototype.lastIndexOf), Ju = Lr(Array.prototype.pop), Ps = Lr(Array.prototype.push), Tk = Lr(Array.prototype.splice), Go = Lr(String.prototype.toLowerCase), Qi = Lr(String.prototype.toString), el = Lr(String.prototype.match), $s = Lr(String.prototype.replace), Ak = Lr(String.prototype.indexOf), Ek = Lr(String.prototype.trim), Yr = Lr(Object.prototype.hasOwnProperty), zr = Lr(RegExp.prototype.test), Ns = Ck(TypeError);
function Lr(t) {
  return function(e) {
    e instanceof RegExp && (e.lastIndex = 0);
    for (var r = arguments.length, n = new Array(r > 1 ? r - 1 : 0), a = 1; a < r; a++) n[a - 1] = arguments[a];
    return Ul(t, e, n);
  };
}
function Ck(t) {
  return function() {
    for (var e = arguments.length, r = new Array(e), n = 0; n < e; n++) r[n] = arguments[n];
    return Gl(t, r);
  };
}
function yt(t, e) {
  let r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : Go;
  Zu && Zu(t, null);
  let n = e.length;
  for (; n--; ) {
    let a = e[n];
    if (typeof a == "string") {
      const o = r(a);
      o !== a && (yk(e) || (e[n] = o), a = o);
    }
    t[a] = true;
  }
  return t;
}
function Ik(t) {
  for (let e = 0; e < t.length; e++) Yr(t, e) || (t[e] = null);
  return t;
}
function En(t) {
  const e = Uo(null);
  for (const [r, n] of xm(t)) Yr(t, r) && (Array.isArray(n) ? e[r] = Ik(n) : n && typeof n == "object" && n.constructor === Object ? e[r] = En(n) : e[r] = n);
  return e;
}
function Rs(t, e) {
  for (; t !== null; ) {
    const n = kk(t, e);
    if (n) {
      if (n.get) return Lr(n.get);
      if (typeof n.value == "function") return Lr(n.value);
    }
    t = wk(t);
  }
  function r() {
    return null;
  }
  return r;
}
const Qu = Dr(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "search", "section", "select", "shadow", "slot", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]), tl = Dr(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "enterkeyhint", "exportparts", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "inputmode", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "part", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]), rl = Dr(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]), Pk = Dr(["animate", "color-profile", "cursor", "discard", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]), nl = Dr(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "mprescripts"]), $k = Dr(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]), ef = Dr(["#text"]), tf = Dr(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "exportparts", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inert", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "part", "pattern", "placeholder", "playsinline", "popover", "popovertarget", "popovertargetaction", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "slot", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "wrap", "xmlns", "slot"]), al = Dr(["accent-height", "accumulate", "additive", "alignment-baseline", "amplitude", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dur", "edgemode", "elevation", "end", "exponent", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "intercept", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "mask-type", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "slope", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "tablevalues", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]), rf = Dr(["accent", "accentunder", "align", "bevelled", "close", "columnsalign", "columnlines", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lspace", "lquote", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]), Do = Dr(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]), Nk = cn(/\{\{[\w\W]*|[\w\W]*\}\}/gm), Rk = cn(/<%[\w\W]*|[\w\W]*%>/gm), Mk = cn(/\$\{[\w\W]*/gm), zk = cn(/^data-[\-\w.\u00B7-\uFFFF]+$/), Ok = cn(/^aria-[\-\w]+$/), ym = cn(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i), Dk = cn(/^(?:\w+script|data):/i), Lk = cn(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g), wm = cn(/^html$/i), jk = cn(/^[a-z][.\w]*(-[.\w]+)+$/i);
var nf = Object.freeze({ __proto__: null, ARIA_ATTR: Ok, ATTR_WHITESPACE: Lk, CUSTOM_ELEMENT: jk, DATA_ATTR: zk, DOCTYPE_NAME: wm, ERB_EXPR: Rk, IS_ALLOWED_URI: ym, IS_SCRIPT_OR_DATA: Dk, MUSTACHE_EXPR: Nk, TMPLIT_EXPR: Mk });
const Ms = { element: 1, text: 3, progressingInstruction: 7, comment: 8, document: 9 }, Bk = function() {
  return typeof window > "u" ? null : window;
}, Fk = function(e, r) {
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
function km() {
  let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : Bk();
  const e = (qe) => km(qe);
  if (e.version = "3.3.3", e.removed = [], !t || !t.document || t.document.nodeType !== Ms.document || !t.Element) return e.isSupported = false, e;
  let { document: r } = t;
  const n = r, a = n.currentScript, { DocumentFragment: o, HTMLTemplateElement: i, Node: l, Element: c, NodeFilter: f, NamedNodeMap: v = t.NamedNodeMap || t.MozNamedAttrMap, HTMLFormElement: x, DOMParser: m, trustedTypes: y } = t, h = c.prototype, b = Rs(h, "cloneNode"), w = Rs(h, "remove"), D = Rs(h, "nextSibling"), F = Rs(h, "childNodes"), B = Rs(h, "parentNode");
  if (typeof i == "function") {
    const qe = r.createElement("template");
    qe.content && qe.content.ownerDocument && (r = qe.content.ownerDocument);
  }
  let M, Z = "";
  const { implementation: U, createNodeIterator: P, createDocumentFragment: E, getElementsByTagName: S } = r, { importNode: $ } = n;
  let J = af();
  e.isSupported = typeof xm == "function" && typeof B == "function" && U && U.createHTMLDocument !== void 0;
  const { MUSTACHE_EXPR: W, ERB_EXPR: C, TMPLIT_EXPR: A, DATA_ATTR: k, ARIA_ATTR: N, IS_SCRIPT_OR_DATA: O, ATTR_WHITESPACE: Y, CUSTOM_ELEMENT: V } = nf;
  let { IS_ALLOWED_URI: q } = nf, ne = null;
  const K = yt({}, [...Qu, ...tl, ...rl, ...nl, ...ef]);
  let R = null;
  const L = yt({}, [...tf, ...al, ...rf, ...Do]);
  let G = Object.seal(Uo(null, { tagNameCheck: { writable: true, configurable: false, enumerable: true, value: null }, attributeNameCheck: { writable: true, configurable: false, enumerable: true, value: null }, allowCustomizedBuiltInElements: { writable: true, configurable: false, enumerable: true, value: false } })), Q = null, re = null;
  const ie = Object.seal(Uo(null, { tagCheck: { writable: true, configurable: false, enumerable: true, value: null }, attributeCheck: { writable: true, configurable: false, enumerable: true, value: null } }));
  let le = true, ce = true, fe = false, ve = true, be = false, _e40 = true, xe = false, Ae = false, Ee = false, Se = false, Pe = false, pe = false, de = true, ue = false;
  const me = "user-content-";
  let we = true, ye = false, Te = {}, Oe = null;
  const X = yt({}, ["annotation-xml", "audio", "colgroup", "desc", "foreignobject", "head", "iframe", "math", "mi", "mn", "mo", "ms", "mtext", "noembed", "noframes", "noscript", "plaintext", "script", "style", "svg", "template", "thead", "title", "video", "xmp"]);
  let se = null;
  const he = yt({}, ["audio", "video", "img", "source", "image", "track"]);
  let ge = null;
  const $e = yt({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]), Ie = "http://www.w3.org/1998/Math/MathML", ze = "http://www.w3.org/2000/svg", Re = "http://www.w3.org/1999/xhtml";
  let Le = Re, We = false, st = null;
  const gt = yt({}, [Ie, ze, Re], Qi);
  let Lt = yt({}, ["mi", "mo", "mn", "ms", "mtext"]), dt = yt({}, ["annotation-xml"]);
  const Jt = yt({}, ["title", "style", "font", "a", "script"]);
  let Wt = null;
  const Nr = ["application/xhtml+xml", "text/html"], Rr = "text/html";
  let Nt = null, Sr = null;
  const ra = r.createElement("form"), na = function(ee) {
    return ee instanceof RegExp || ee instanceof Function;
  }, wa = function() {
    let ee = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (!(Sr && Sr === ee)) {
      if ((!ee || typeof ee != "object") && (ee = {}), ee = En(ee), Wt = Nr.indexOf(ee.PARSER_MEDIA_TYPE) === -1 ? Rr : ee.PARSER_MEDIA_TYPE, Nt = Wt === "application/xhtml+xml" ? Qi : Go, ne = Yr(ee, "ALLOWED_TAGS") ? yt({}, ee.ALLOWED_TAGS, Nt) : K, R = Yr(ee, "ALLOWED_ATTR") ? yt({}, ee.ALLOWED_ATTR, Nt) : L, st = Yr(ee, "ALLOWED_NAMESPACES") ? yt({}, ee.ALLOWED_NAMESPACES, Qi) : gt, ge = Yr(ee, "ADD_URI_SAFE_ATTR") ? yt(En($e), ee.ADD_URI_SAFE_ATTR, Nt) : $e, se = Yr(ee, "ADD_DATA_URI_TAGS") ? yt(En(he), ee.ADD_DATA_URI_TAGS, Nt) : he, Oe = Yr(ee, "FORBID_CONTENTS") ? yt({}, ee.FORBID_CONTENTS, Nt) : X, Q = Yr(ee, "FORBID_TAGS") ? yt({}, ee.FORBID_TAGS, Nt) : En({}), re = Yr(ee, "FORBID_ATTR") ? yt({}, ee.FORBID_ATTR, Nt) : En({}), Te = Yr(ee, "USE_PROFILES") ? ee.USE_PROFILES : false, le = ee.ALLOW_ARIA_ATTR !== false, ce = ee.ALLOW_DATA_ATTR !== false, fe = ee.ALLOW_UNKNOWN_PROTOCOLS || false, ve = ee.ALLOW_SELF_CLOSE_IN_ATTR !== false, be = ee.SAFE_FOR_TEMPLATES || false, _e40 = ee.SAFE_FOR_XML !== false, xe = ee.WHOLE_DOCUMENT || false, Se = ee.RETURN_DOM || false, Pe = ee.RETURN_DOM_FRAGMENT || false, pe = ee.RETURN_TRUSTED_TYPE || false, Ee = ee.FORCE_BODY || false, de = ee.SANITIZE_DOM !== false, ue = ee.SANITIZE_NAMED_PROPS || false, we = ee.KEEP_CONTENT !== false, ye = ee.IN_PLACE || false, q = ee.ALLOWED_URI_REGEXP || ym, Le = ee.NAMESPACE || Re, Lt = ee.MATHML_TEXT_INTEGRATION_POINTS || Lt, dt = ee.HTML_INTEGRATION_POINTS || dt, G = ee.CUSTOM_ELEMENT_HANDLING || {}, ee.CUSTOM_ELEMENT_HANDLING && na(ee.CUSTOM_ELEMENT_HANDLING.tagNameCheck) && (G.tagNameCheck = ee.CUSTOM_ELEMENT_HANDLING.tagNameCheck), ee.CUSTOM_ELEMENT_HANDLING && na(ee.CUSTOM_ELEMENT_HANDLING.attributeNameCheck) && (G.attributeNameCheck = ee.CUSTOM_ELEMENT_HANDLING.attributeNameCheck), ee.CUSTOM_ELEMENT_HANDLING && typeof ee.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements == "boolean" && (G.allowCustomizedBuiltInElements = ee.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements), be && (ce = false), Pe && (Se = true), Te && (ne = yt({}, ef), R = Uo(null), Te.html === true && (yt(ne, Qu), yt(R, tf)), Te.svg === true && (yt(ne, tl), yt(R, al), yt(R, Do)), Te.svgFilters === true && (yt(ne, rl), yt(R, al), yt(R, Do)), Te.mathMl === true && (yt(ne, nl), yt(R, rf), yt(R, Do))), Yr(ee, "ADD_TAGS") || (ie.tagCheck = null), Yr(ee, "ADD_ATTR") || (ie.attributeCheck = null), ee.ADD_TAGS && (typeof ee.ADD_TAGS == "function" ? ie.tagCheck = ee.ADD_TAGS : (ne === K && (ne = En(ne)), yt(ne, ee.ADD_TAGS, Nt))), ee.ADD_ATTR && (typeof ee.ADD_ATTR == "function" ? ie.attributeCheck = ee.ADD_ATTR : (R === L && (R = En(R)), yt(R, ee.ADD_ATTR, Nt))), ee.ADD_URI_SAFE_ATTR && yt(ge, ee.ADD_URI_SAFE_ATTR, Nt), ee.FORBID_CONTENTS && (Oe === X && (Oe = En(Oe)), yt(Oe, ee.FORBID_CONTENTS, Nt)), ee.ADD_FORBID_CONTENTS && (Oe === X && (Oe = En(Oe)), yt(Oe, ee.ADD_FORBID_CONTENTS, Nt)), we && (ne["#text"] = true), xe && yt(ne, ["html", "head", "body"]), ne.table && (yt(ne, ["tbody"]), delete Q.tbody), ee.TRUSTED_TYPES_POLICY) {
        if (typeof ee.TRUSTED_TYPES_POLICY.createHTML != "function") throw Ns('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
        if (typeof ee.TRUSTED_TYPES_POLICY.createScriptURL != "function") throw Ns('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
        M = ee.TRUSTED_TYPES_POLICY, Z = M.createHTML("");
      } else M === void 0 && (M = Fk(y, a)), M !== null && typeof Z == "string" && (Z = M.createHTML(""));
      Dr && Dr(ee), Sr = ee;
    }
  }, Ka = yt({}, [...tl, ...rl, ...Pk]), Xa = yt({}, [...nl, ...$k]), xt = function(ee) {
    let Ce = B(ee);
    (!Ce || !Ce.tagName) && (Ce = { namespaceURI: Le, tagName: "template" });
    const Ye = Go(ee.tagName), wt = Go(Ce.tagName);
    return st[ee.namespaceURI] ? ee.namespaceURI === ze ? Ce.namespaceURI === Re ? Ye === "svg" : Ce.namespaceURI === Ie ? Ye === "svg" && (wt === "annotation-xml" || Lt[wt]) : !!Ka[Ye] : ee.namespaceURI === Ie ? Ce.namespaceURI === Re ? Ye === "math" : Ce.namespaceURI === ze ? Ye === "math" && dt[wt] : !!Xa[Ye] : ee.namespaceURI === Re ? Ce.namespaceURI === ze && !dt[wt] || Ce.namespaceURI === Ie && !Lt[wt] ? false : !Xa[Ye] && (Jt[Ye] || !Ka[Ye]) : !!(Wt === "application/xhtml+xml" && st[ee.namespaceURI]) : false;
  }, Ft = function(ee) {
    Ps(e.removed, { element: ee });
    try {
      B(ee).removeChild(ee);
    } catch {
      w(ee);
    }
  }, ur = function(ee, Ce) {
    try {
      Ps(e.removed, { attribute: Ce.getAttributeNode(ee), from: Ce });
    } catch {
      Ps(e.removed, { attribute: null, from: Ce });
    }
    if (Ce.removeAttribute(ee), ee === "is") if (Se || Pe) try {
      Ft(Ce);
    } catch {
    }
    else try {
      Ce.setAttribute(ee, "");
    } catch {
    }
  }, Sn = function(ee) {
    let Ce = null, Ye = null;
    if (Ee) ee = "<remove></remove>" + ee;
    else {
      const Ot = el(ee, /^[\r\n\t ]+/);
      Ye = Ot && Ot[0];
    }
    Wt === "application/xhtml+xml" && Le === Re && (ee = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + ee + "</body></html>");
    const wt = M ? M.createHTML(ee) : ee;
    if (Le === Re) try {
      Ce = new m().parseFromString(wt, Wt);
    } catch {
    }
    if (!Ce || !Ce.documentElement) {
      Ce = U.createDocument(Le, "template", null);
      try {
        Ce.documentElement.innerHTML = We ? Z : wt;
      } catch {
      }
    }
    const jt = Ce.body || Ce.documentElement;
    return ee && Ye && jt.insertBefore(r.createTextNode(Ye), jt.childNodes[0] || null), Le === Re ? S.call(Ce, xe ? "html" : "body")[0] : xe ? Ce.documentElement : jt;
  }, ka = function(ee) {
    return P.call(ee.ownerDocument || ee, ee, f.SHOW_ELEMENT | f.SHOW_COMMENT | f.SHOW_TEXT | f.SHOW_PROCESSING_INSTRUCTION | f.SHOW_CDATA_SECTION, null);
  }, Me = function(ee) {
    return ee instanceof x && (typeof ee.nodeName != "string" || typeof ee.textContent != "string" || typeof ee.removeChild != "function" || !(ee.attributes instanceof v) || typeof ee.removeAttribute != "function" || typeof ee.setAttribute != "function" || typeof ee.namespaceURI != "string" || typeof ee.insertBefore != "function" || typeof ee.hasChildNodes != "function");
  }, at = function(ee) {
    return typeof l == "function" && ee instanceof l;
  };
  function ot(qe, ee, Ce) {
    Oo(qe, (Ye) => {
      Ye.call(e, ee, Ce, Sr);
    });
  }
  const Qt = function(ee) {
    let Ce = null;
    if (ot(J.beforeSanitizeElements, ee, null), Me(ee)) return Ft(ee), true;
    const Ye = Nt(ee.nodeName);
    if (ot(J.uponSanitizeElement, ee, { tagName: Ye, allowedTags: ne }), _e40 && ee.hasChildNodes() && !at(ee.firstElementChild) && zr(/<[/\w!]/g, ee.innerHTML) && zr(/<[/\w!]/g, ee.textContent) || ee.nodeType === Ms.progressingInstruction || _e40 && ee.nodeType === Ms.comment && zr(/<[/\w]/g, ee.data)) return Ft(ee), true;
    if (!(ie.tagCheck instanceof Function && ie.tagCheck(Ye)) && (!ne[Ye] || Q[Ye])) {
      if (!Q[Ye] && It(Ye) && (G.tagNameCheck instanceof RegExp && zr(G.tagNameCheck, Ye) || G.tagNameCheck instanceof Function && G.tagNameCheck(Ye))) return false;
      if (we && !Oe[Ye]) {
        const wt = B(ee) || ee.parentNode, jt = F(ee) || ee.childNodes;
        if (jt && wt) {
          const Ot = jt.length;
          for (let Ht = Ot - 1; Ht >= 0; --Ht) {
            const ir = b(jt[Ht], true);
            ir.__removalCount = (ee.__removalCount || 0) + 1, wt.insertBefore(ir, D(ee));
          }
        }
      }
      return Ft(ee), true;
    }
    return ee instanceof c && !xt(ee) || (Ye === "noscript" || Ye === "noembed" || Ye === "noframes") && zr(/<\/no(script|embed|frames)/i, ee.innerHTML) ? (Ft(ee), true) : (be && ee.nodeType === Ms.text && (Ce = ee.textContent, Oo([W, C, A], (wt) => {
      Ce = $s(Ce, wt, " ");
    }), ee.textContent !== Ce && (Ps(e.removed, { element: ee.cloneNode() }), ee.textContent = Ce)), ot(J.afterSanitizeElements, ee, null), false);
  }, ar = function(ee, Ce, Ye) {
    if (re[Ce] || de && (Ce === "id" || Ce === "name") && (Ye in r || Ye in ra)) return false;
    if (!(ce && !re[Ce] && zr(k, Ce))) {
      if (!(le && zr(N, Ce))) {
        if (!(ie.attributeCheck instanceof Function && ie.attributeCheck(Ce, ee))) {
          if (!R[Ce] || re[Ce]) {
            if (!(It(ee) && (G.tagNameCheck instanceof RegExp && zr(G.tagNameCheck, ee) || G.tagNameCheck instanceof Function && G.tagNameCheck(ee)) && (G.attributeNameCheck instanceof RegExp && zr(G.attributeNameCheck, Ce) || G.attributeNameCheck instanceof Function && G.attributeNameCheck(Ce, ee)) || Ce === "is" && G.allowCustomizedBuiltInElements && (G.tagNameCheck instanceof RegExp && zr(G.tagNameCheck, Ye) || G.tagNameCheck instanceof Function && G.tagNameCheck(Ye)))) return false;
          } else if (!ge[Ce]) {
            if (!zr(q, $s(Ye, Y, ""))) {
              if (!((Ce === "src" || Ce === "xlink:href" || Ce === "href") && ee !== "script" && Ak(Ye, "data:") === 0 && se[ee])) {
                if (!(fe && !zr(O, $s(Ye, Y, "")))) {
                  if (Ye) return false;
                }
              }
            }
          }
        }
      }
    }
    return true;
  }, It = function(ee) {
    return ee !== "annotation-xml" && el(ee, V);
  }, rr = function(ee) {
    ot(J.beforeSanitizeAttributes, ee, null);
    const { attributes: Ce } = ee;
    if (!Ce || Me(ee)) return;
    const Ye = { attrName: "", attrValue: "", keepAttr: true, allowedAttributes: R, forceKeepAttr: void 0 };
    let wt = Ce.length;
    for (; wt--; ) {
      const jt = Ce[wt], { name: Ot, namespaceURI: Ht, value: ir } = jt, lr = Nt(Ot), Bt = ir;
      let mt = Ot === "value" ? Bt : Ek(Bt);
      if (Ye.attrName = lr, Ye.attrValue = mt, Ye.keepAttr = true, Ye.forceKeepAttr = void 0, ot(J.uponSanitizeAttribute, ee, Ye), mt = Ye.attrValue, ue && (lr === "id" || lr === "name") && (ur(Ot, ee), mt = me + mt), _e40 && zr(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i, mt)) {
        ur(Ot, ee);
        continue;
      }
      if (lr === "attributename" && el(mt, "href")) {
        ur(Ot, ee);
        continue;
      }
      if (Ye.forceKeepAttr) continue;
      if (!Ye.keepAttr) {
        ur(Ot, ee);
        continue;
      }
      if (!ve && zr(/\/>/i, mt)) {
        ur(Ot, ee);
        continue;
      }
      be && Oo([W, C, A], (kt) => {
        mt = $s(mt, kt, " ");
      });
      const Yt = Nt(ee.nodeName);
      if (!ar(Yt, lr, mt)) {
        ur(Ot, ee);
        continue;
      }
      if (M && typeof y == "object" && typeof y.getAttributeType == "function" && !Ht) switch (y.getAttributeType(Yt, lr)) {
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
        Ht ? ee.setAttributeNS(Ht, Ot, mt) : ee.setAttribute(Ot, mt), Me(ee) ? Ft(ee) : Ju(e.removed);
      } catch {
        ur(Ot, ee);
      }
    }
    ot(J.afterSanitizeAttributes, ee, null);
  }, qt = function qe(ee) {
    let Ce = null;
    const Ye = ka(ee);
    for (ot(J.beforeSanitizeShadowDOM, ee, null); Ce = Ye.nextNode(); ) ot(J.uponSanitizeShadowNode, Ce, null), Qt(Ce), rr(Ce), Ce.content instanceof o && qe(Ce.content);
    ot(J.afterSanitizeShadowDOM, ee, null);
  };
  return e.sanitize = function(qe) {
    let ee = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, Ce = null, Ye = null, wt = null, jt = null;
    if (We = !qe, We && (qe = "<!-->"), typeof qe != "string" && !at(qe)) if (typeof qe.toString == "function") {
      if (qe = qe.toString(), typeof qe != "string") throw Ns("dirty is not a string, aborting");
    } else throw Ns("toString is not a function");
    if (!e.isSupported) return qe;
    if (Ae || wa(ee), e.removed = [], typeof qe == "string" && (ye = false), ye) {
      if (qe.nodeName) {
        const ir = Nt(qe.nodeName);
        if (!ne[ir] || Q[ir]) throw Ns("root node is forbidden and cannot be sanitized in-place");
      }
    } else if (qe instanceof l) Ce = Sn("<!---->"), Ye = Ce.ownerDocument.importNode(qe, true), Ye.nodeType === Ms.element && Ye.nodeName === "BODY" || Ye.nodeName === "HTML" ? Ce = Ye : Ce.appendChild(Ye);
    else {
      if (!Se && !be && !xe && qe.indexOf("<") === -1) return M && pe ? M.createHTML(qe) : qe;
      if (Ce = Sn(qe), !Ce) return Se ? null : pe ? Z : "";
    }
    Ce && Ee && Ft(Ce.firstChild);
    const Ot = ka(ye ? qe : Ce);
    for (; wt = Ot.nextNode(); ) Qt(wt), rr(wt), wt.content instanceof o && qt(wt.content);
    if (ye) return qe;
    if (Se) {
      if (Pe) for (jt = E.call(Ce.ownerDocument); Ce.firstChild; ) jt.appendChild(Ce.firstChild);
      else jt = Ce;
      return (R.shadowroot || R.shadowrootmode) && (jt = $.call(n, jt, true)), jt;
    }
    let Ht = xe ? Ce.outerHTML : Ce.innerHTML;
    return xe && ne["!doctype"] && Ce.ownerDocument && Ce.ownerDocument.doctype && Ce.ownerDocument.doctype.name && zr(wm, Ce.ownerDocument.doctype.name) && (Ht = "<!DOCTYPE " + Ce.ownerDocument.doctype.name + `>
` + Ht), be && Oo([W, C, A], (ir) => {
      Ht = $s(Ht, ir, " ");
    }), M && pe ? M.createHTML(Ht) : Ht;
  }, e.setConfig = function() {
    let qe = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    wa(qe), Ae = true;
  }, e.clearConfig = function() {
    Sr = null, Ae = false;
  }, e.isValidAttribute = function(qe, ee, Ce) {
    Sr || wa({});
    const Ye = Nt(qe), wt = Nt(ee);
    return ar(Ye, wt, Ce);
  }, e.addHook = function(qe, ee) {
    typeof ee == "function" && Ps(J[qe], ee);
  }, e.removeHook = function(qe, ee) {
    if (ee !== void 0) {
      const Ce = Sk(J[qe], ee);
      return Ce === -1 ? void 0 : Tk(J[qe], Ce, 1)[0];
    }
    return Ju(J[qe]);
  }, e.removeHooks = function(qe) {
    J[qe] = [];
  }, e.removeAllHooks = function() {
    J = af();
  }, e;
}
var Wl = km();
function Uk(t) {
  const e = [];
  e.push(`# ${t.subject}`), e.push(""), e.push("| | |"), e.push("|---|---|"), e.push(`| **From** | ${sf(t.from)} |`), e.push(`| **To** | ${sf(t.to)} |`), e.push(`| **Date** | ${Mc(t.date)} |`), e.push(""), e.push("---"), e.push("");
  const r = t.htmlBody ? Gk(t.htmlBody) : null;
  return e.push(r || t.body || "*(no body)*"), e.push(""), e.join(`
`);
}
function sf(t) {
  return (t || "").replace(/\|/g, "\\|");
}
function Gk(t) {
  try {
    const e = new DOMParser().parseFromString(t, "text/html");
    for (const r of e.querySelectorAll("style, script, head")) r.remove();
    return Vl(e.body).replace(/\n{3,}/g, `

`).trim();
  } catch {
    return null;
  }
}
function Wk(t, e) {
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
    return Wk(e, o) ? "" : `![${i}](${o})`;
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
function Vk(t) {
  return Gv(t, "md");
}
function of(t, e, r = "text/markdown;charset=utf-8") {
  const n = new Blob([t], { type: r }), a = URL.createObjectURL(n), o = document.createElement("a");
  o.href = a, o.download = e, document.body.appendChild(o), o.click(), document.body.removeChild(o), URL.revokeObjectURL(a);
}
function Hk(t) {
  return t.raw ?? null;
}
function qk(t) {
  const e = Hk(t);
  return e ? JSON.stringify(e, null, 2) : "null";
}
function Yk(t) {
  return Gv(t, "json");
}
var Kk = _('<button title="View as Markdown">.md</button>'), Xk = _('<div class="md-toolbar svelte-1b0rzpb"><span class="toolbar-label svelte-1b0rzpb">JSON</span> <button class="action-btn download-btn svelte-1b0rzpb" title="Download .json file">Download</button></div> <div class="md-body svelte-1b0rzpb"><pre class="md-raw svelte-1b0rzpb"> </pre></div>', 1), Zk = _('<pre class="md-raw svelte-1b0rzpb"> </pre>'), Jk = _('<div class="md-preview svelte-1b0rzpb"></div>'), Qk = _('<div class="md-toolbar svelte-1b0rzpb"><div class="md-tabs svelte-1b0rzpb"><button>Raw</button> <button>Preview</button></div> <button class="action-btn download-btn svelte-1b0rzpb" title="Download .md file">Download</button></div> <div class="md-body svelte-1b0rzpb"><!></div>', 1), eS = _('<div class="loading-state svelte-1b0rzpb"><span class="spinner svelte-1b0rzpb"></span> <span>Loading message...</span></div>'), tS = _('<iframe class="html-frame svelte-1b0rzpb" sandbox="allow-same-origin" title="Email content"></iframe>'), rS = _('<pre class="message-text svelte-1b0rzpb"> </pre>'), nS = _('<p class="empty-body svelte-1b0rzpb">Loading...</p>'), aS = _('<div class="modal-meta svelte-1b0rzpb"><div class="meta-row svelte-1b0rzpb"><span class="meta-label svelte-1b0rzpb">From:</span> <span> </span></div> <div class="meta-row svelte-1b0rzpb"><span class="meta-label svelte-1b0rzpb">To:</span> <span> </span></div> <div class="meta-row svelte-1b0rzpb"><span class="meta-label svelte-1b0rzpb">Date:</span> <span> </span></div></div> <div class="modal-body svelte-1b0rzpb"><!></div>', 1), sS = _('<div class="modal-overlay svelte-1b0rzpb" role="dialog" aria-modal="true"><div class="modal-content svelte-1b0rzpb" role="document"><div class="modal-header svelte-1b0rzpb"><h3 class="modal-subject svelte-1b0rzpb"> </h3> <div class="header-actions svelte-1b0rzpb"><button title="View as JSON">.json</button> <!> <button class="modal-close svelte-1b0rzpb">\u2715</button></div></div> <!></div></div>');
function oS(t, e) {
  Be(e, true);
  let r = oe(e, "loading", 3, false);
  Xt(() => qa("MessageModal"));
  const n = new Mt.Renderer();
  n.link = ({ href: A, title: k, text: N }) => {
    const O = k ? ` title="${k}"` : "";
    return `<a href="${A}"${O} target="_blank" rel="noopener">${N}</a>`;
  }, Mt.setOptions({ breaks: true, gfm: true, renderer: n });
  let a = te("email"), o = H(() => e.message.body ? Uk(e.message) : ""), i = H(() => qk(e.message)), l = te("raw");
  function c(A) {
    g(a, s(a) === A ? "email" : A, true), A === "markdown" && g(l, "raw");
  }
  function f() {
    of(s(o), Vk(e.message));
  }
  function v() {
    of(s(i), Yk(e.message), "application/json;charset=utf-8");
  }
  function x(A) {
    const k = Mt.parse(A);
    return Wl.sanitize(k, { ADD_ATTR: ["target"], ALLOW_TAGS: ["h1", "h2", "h3", "h4", "h5", "h6", "p", "br", "hr", "blockquote", "pre", "code", "strong", "b", "em", "i", "a", "img", "ul", "ol", "li", "table", "thead", "tbody", "tr", "th", "td", "del", "s"] });
  }
  function m(A) {
    let k = A.replace(/<script\b[\s\S]*?<\/script>/gi, "");
    return k = k.replace(/<iframe\b[\s\S]*?<\/iframe>/gi, ""), k = k.replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, " "), k = k.replace(/\s+on\w+\s*=\s*[^\s>]+/gi, " "), Wl.sanitize(k, { ALLOWED_TAGS: ["h1", "h2", "h3", "h4", "h5", "h6", "p", "br", "hr", "div", "span", "a", "img", "strong", "b", "em", "i", "u", "s", "sub", "sup", "ul", "ol", "li", "blockquote", "pre", "code", "table", "thead", "tbody", "tfoot", "tr", "th", "td", "style", "font"], ALLOWED_ATTR: ["href", "src", "alt", "title", "target", "style", "width", "height", "border", "align", "color", "size", "face"], ADD_ATTR: ["target"] });
  }
  const y = `
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
  `, h = H(() => {
    var _a10;
    return ((_a10 = e.message) == null ? void 0 : _a10.htmlBody) && !r() ? `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${y}</style></head><body>${m(e.message.htmlBody)}</body></html>` : "";
  });
  var b = sS(), w = d(b), D = d(w), F = d(D), B = d(F), M = p(F, 2), Z = d(M);
  let U;
  var P = p(Z, 2);
  {
    var E = (A) => {
      var k = Kk();
      let N;
      j(() => N = rt(k, 1, "action-btn svelte-1b0rzpb", null, N, { active: s(a) === "markdown" })), Ne("click", k, () => c("markdown")), u(A, k);
    };
    I(P, (A) => {
      e.message.body && A(E);
    });
  }
  var S = p(P, 2), $ = p(D, 2);
  {
    var J = (A) => {
      var k = Xk(), N = ae(k), O = p(d(N), 2), Y = p(N, 2), V = d(Y), q = d(V);
      j(() => T(q, s(i))), Ne("click", O, v), u(A, k);
    }, W = (A) => {
      var k = Qk(), N = ae(k), O = d(N), Y = d(O);
      let V;
      var q = p(Y, 2);
      let ne;
      var K = p(O, 2), R = p(N, 2), L = d(R);
      {
        var G = (re) => {
          var ie = Zk(), le = d(ie);
          j(() => T(le, s(o))), u(re, ie);
        }, Q = (re) => {
          var ie = Jk();
          fc(ie, () => x(s(o)), true), u(re, ie);
        };
        I(L, (re) => {
          s(l) === "raw" ? re(G) : re(Q, -1);
        });
      }
      j(() => {
        V = rt(Y, 1, "md-tab svelte-1b0rzpb", null, V, { active: s(l) === "raw" }), ne = rt(q, 1, "md-tab svelte-1b0rzpb", null, ne, { active: s(l) === "preview" });
      }), Ne("click", Y, () => g(l, "raw")), Ne("click", q, () => g(l, "preview")), Ne("click", K, f), u(A, k);
    }, C = (A) => {
      var k = aS(), N = ae(k), O = d(N), Y = p(d(O), 2), V = d(Y), q = p(O, 2), ne = p(d(q), 2), K = d(ne), R = p(q, 2), L = p(d(R), 2), G = d(L), Q = p(N, 2), re = d(Q);
      {
        var ie = (ve) => {
          var be = eS();
          u(ve, be);
        }, le = (ve) => {
          var be = tS();
          j(() => br(be, "srcdoc", s(h))), u(ve, be);
        }, ce = (ve) => {
          var be = rS(), _e40 = d(be);
          j(() => T(_e40, e.message.body)), u(ve, be);
        }, fe = (ve) => {
          var be = nS();
          u(ve, be);
        };
        I(re, (ve) => {
          r() ? ve(ie) : e.message.htmlBody ? ve(le, 1) : e.message.body ? ve(ce, 2) : ve(fe, -1);
        });
      }
      j((ve) => {
        T(V, e.message.from), T(K, e.message.to), T(G, ve);
      }, [() => Mc(e.message.date)]), u(A, k);
    };
    I($, (A) => {
      s(a) === "json" ? A(J) : s(a) === "markdown" ? A(W, 1) : A(C, -1);
    });
  }
  j(() => {
    T(B, e.message.subject), U = rt(Z, 1, "action-btn svelte-1b0rzpb", null, U, { active: s(a) === "json" });
  }), Ne("click", b, function(...A) {
    var _a10;
    (_a10 = e.onclose) == null ? void 0 : _a10.apply(this, A);
  }), Ne("click", w, (A) => A.stopPropagation()), Ne("click", Z, () => c("json")), Ne("click", S, function(...A) {
    var _a10;
    (_a10 = e.onclose) == null ? void 0 : _a10.apply(this, A);
  }), u(t, b), Fe();
}
Zt(["click"]);
var iS = _('<div data-slot="progress-indicator" class="bg-primary h-full w-full flex-1 transition-all"></div>');
function Hl(t, e) {
  Be(e, true);
  let r = oe(e, "ref", 15, null), n = oe(e, "max", 3, 100), a = ft(e, ["$$slots", "$$events", "$$legacy", "ref", "class", "max", "value"]);
  var o = ke(), i = ae(o);
  {
    let l = H(() => Je("bg-primary/20 relative h-2 w-full overflow-hidden rounded-full", e.class));
    dr(i, () => B1, (c, f) => {
      f(c, et({ "data-slot": "progress", get class() {
        return s(l);
      }, get value() {
        return e.value;
      }, get max() {
        return n();
      } }, () => a, { get ref() {
        return r();
      }, set ref(v) {
        r(v);
      }, children: (v, x) => {
        var m = iS();
        j(() => Rt(m, `transform: translateX(-${100 - 100 * (e.value ?? 0) / (n() ?? 1)}%)`)), u(v, m);
      }, $$slots: { default: true } }));
    });
  }
  u(t, o), Fe();
}
var lS = _('<p class="fs-unsupported svelte-ydmozk">File System Access API is not supported. Use Chrome or Edge.</p>'), cS = _('<span class="fs-status svelte-ydmozk">Loading\u2026</span>'), dS = _('<button class="fs-btn fs-btn-clear svelte-ydmozk" type="button">Clear</button>'), uS = _('<p class="fs-error svelte-ydmozk"> </p>'), fS = _('<div class="fs-row svelte-ydmozk"><span class="fs-path svelte-ydmozk"> </span> <div class="fs-buttons svelte-ydmozk"><button class="fs-btn svelte-ydmozk" type="button">Choose directory</button> <!></div></div> <!>', 1), pS = _('<div class="fs-settings svelte-ydmozk"><span class="fs-label svelte-ydmozk">Root directory</span> <!></div>');
function Sm(t, e) {
  Be(e, true);
  let r = te(null), n = te(true), a = te(null);
  const o = typeof window < "u" && "showDirectoryPicker" in window;
  async function i() {
    g(n, true), g(a, null);
    try {
      const h = await qo();
      g(r, (h == null ? void 0 : h.name) ?? null, true);
    } catch (h) {
      g(a, h instanceof Error ? h.message : String(h), true);
    }
    g(n, false);
  }
  Xt(i);
  async function l() {
    if (o) {
      g(a, null);
      try {
        const h = await window.showDirectoryPicker({ mode: "readwrite" });
        await gb(h), g(r, h.name, true);
      } catch (h) {
        if (h.name === "AbortError") return;
        g(a, h instanceof Error ? h.message : String(h), true);
      }
    }
  }
  async function c() {
    g(a, null);
    try {
      await mb(), g(r, null);
    } catch (h) {
      g(a, h instanceof Error ? h.message : String(h), true);
    }
  }
  var f = pS(), v = p(d(f), 2);
  {
    var x = (h) => {
      var b = lS();
      u(h, b);
    }, m = (h) => {
      var b = cS();
      u(h, b);
    }, y = (h) => {
      var b = fS(), w = ae(b), D = d(w), F = d(D), B = p(D, 2), M = d(B), Z = p(M, 2);
      {
        var U = (S) => {
          var $ = dS();
          Ne("click", $, c), u(S, $);
        };
        I(Z, (S) => {
          s(r) && S(U);
        });
      }
      var P = p(w, 2);
      {
        var E = (S) => {
          var $ = uS(), J = d($);
          j(() => T(J, s(a))), u(S, $);
        };
        I(P, (S) => {
          s(a) && S(E);
        });
      }
      j(() => {
        br(D, "title", s(r) ?? "No directory chosen"), T(F, s(r) ?? "No directory chosen");
      }), Ne("click", M, l), u(h, b);
    };
    I(v, (h) => {
      o ? s(n) ? h(m, 1) : h(y, -1) : h(x);
    });
  }
  u(t, f), Fe();
}
Zt(["click"]);
var vS = _('<span class="size-1.5 rounded-full bg-success shrink-0"></span>'), gS = _('<span class="size-1.5 rounded-full bg-muted-foreground/20 shrink-0"></span>'), mS = _('<span class="text-[0.55rem] font-medium text-muted-foreground/30 shrink-0">Soon</span>'), hS = _('<button><div class="size-8 rounded-lg flex items-center justify-center text-sm font-black shrink-0"> </div> <div class="flex-1 min-w-0"><p> </p> <p class="text-[0.65rem] text-muted-foreground/50 truncate"> </p></div> <!></button>'), _S = _('<div class="px-2 pb-4 flex flex-col gap-0.5"></div>'), bS = _('<span class="text-xs text-muted-foreground/60"> </span>'), xS = _('<span class="text-xs text-muted-foreground/40"> </span>'), yS = _("<option> </option>"), wS = _("<!> ", 1), kS = _('<div class="mx-4 mt-2 px-3 py-2 rounded border border-destructive/30 bg-destructive/8 text-xs text-destructive flex items-center justify-between shrink-0"><span> </span> <button class="ml-2 opacity-60 hover:opacity-100">\u2715</button></div>'), SS = _('<span class="text-xs text-muted-foreground/40 shrink-0 whitespace-nowrap"> </span>'), TS = _('<div class="flex justify-center pt-4"><!></div>'), AS = _("<!> <!>", 1), ES = _('<div class="flex items-center justify-center gap-2.5 py-16 text-sm text-muted-foreground/50"><div class="size-4 border-2 border-border border-t-primary rounded-full animate-spin shrink-0"></div> Loading messages\u2026</div>'), CS = _('<div class="flex flex-col items-center justify-center gap-3 py-20 text-center"><!> <p class="text-sm text-muted-foreground/40"> </p></div>'), IS = _('<div class="flex items-center gap-2"><span class="text-xs text-muted-foreground/50">Delete all local emails?</span> <!> <!></div>'), PS = _('<button class="flex items-center gap-1 text-[0.65rem] text-muted-foreground/25 hover:text-destructive transition-colors"><!>Clear local data</button>'), $S = _('<div class="px-4 py-2 border-t border-border shrink-0 flex items-center justify-end"><!></div>'), NS = _('<div class="flex items-center gap-3 px-8 pt-5 pb-4 border-b border-border shrink-0 bg-transparent"><div class="flex items-center gap-2 min-w-0"><div class="size-7 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary shrink-0"> </div> <span class="text-sm font-medium text-foreground truncate max-w-[180px]"> </span> <span class="size-1.5 rounded-full bg-success shrink-0"></span></div> <div class="flex items-center gap-2 ml-auto shrink-0"><!> <select class="h-7 px-1.5 text-xs rounded border border-input bg-background text-foreground"></select> <!> <!> <button class="text-muted-foreground/30 hover:text-destructive transition-colors p-1 rounded" title="Sign out"><!></button></div></div> <!> <!> <div class="flex items-center gap-2 px-4 py-2.5 border-b border-border shrink-0"><div class="relative flex-1"><!> <!></div> <!> <!></div> <div class="flex-1 min-h-0 overflow-y-auto"><div class="p-3"><!></div></div> <!>', 1), RS = _('<p class="text-sm text-destructive text-center max-w-xs"> </p>'), MS = _('<div class="size-4 border-2 border-zinc-300 border-t-zinc-700 rounded-full animate-spin shrink-0"></div> Signing in\u2026', 1), zS = dn('<svg viewBox="0 0 24 24" width="16" height="16" class="shrink-0"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"></path><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path></svg> Sign in with Google', 1), OS = _('<div class="flex items-center gap-1.5 text-[0.65rem] text-muted-foreground/30"><span> </span> <button class="text-primary hover:underline ml-auto">Change</button></div>'), DS = _('<div class="flex flex-col gap-1.5"><!> <div class="flex gap-1.5"><!> <!></div></div>'), LS = _('<div class="flex flex-col items-center justify-center h-full gap-5 px-8"><div class="size-14 rounded-2xl flex items-center justify-center text-2xl font-black" style="background:#ea433518; color:#ea4335;">M</div> <div class="text-center"><p class="text-base font-semibold text-foreground mb-1">Connect Gmail</p> <p class="text-sm text-muted-foreground/60 max-w-xs leading-relaxed">Sign in with Google to sync and browse your emails.</p></div> <!> <div class="flex flex-col items-center gap-2 w-full max-w-[260px]"><button class="flex items-center justify-center gap-2.5 w-full h-10 px-4 rounded-lg border border-border bg-white text-zinc-800 text-sm font-medium hover:bg-zinc-50 disabled:opacity-50 transition-colors shadow-sm"><!></button> <a href="#oauth-redirect" class="text-xs text-muted-foreground/40 hover:text-primary transition-colors">Popup blocked? Use redirect flow</a></div> <div class="w-full max-w-[260px]"><!></div></div>'), jS = _('<span class="text-xs text-muted-foreground/60"> </span>'), BS = _('<span class="text-xs text-muted-foreground/40"> </span>'), FS = _("<option> </option>"), US = _("<!> ", 1), GS = _('<div class="mx-4 mt-2 px-3 py-2 rounded border border-destructive/30 bg-destructive/8 text-xs text-destructive flex items-center justify-between shrink-0"><span> </span> <button class="ml-2 opacity-60 hover:opacity-100">\u2715</button></div>'), WS = _('<span class="text-xs text-muted-foreground/40 shrink-0 whitespace-nowrap"> </span>'), VS = _('<div class="flex justify-center pt-4"><!></div>'), HS = _("<!> <!>", 1), qS = _('<div class="flex items-center justify-center gap-2.5 py-16 text-sm text-muted-foreground/50"><div class="size-4 border-2 border-border border-t-primary rounded-full animate-spin shrink-0"></div> Loading tweets\u2026</div>'), YS = _('<div class="flex flex-col items-center justify-center gap-3 py-20 text-center"><!> <p class="text-sm text-muted-foreground/40"> </p></div>'), KS = _('<div class="flex items-center gap-2"><span class="text-xs text-muted-foreground/50">Delete all local tweets?</span> <!> <!></div>'), XS = _('<button class="flex items-center gap-1 text-[0.65rem] text-muted-foreground/25 hover:text-destructive transition-colors"><!>Clear local data</button>'), ZS = _('<div class="px-4 py-2 border-t border-border shrink-0 flex items-center justify-end"><!></div>'), JS = _('<div class="flex items-center gap-3 px-8 pt-5 pb-4 border-b border-border shrink-0 bg-transparent"><div class="flex items-center gap-2 min-w-0"><div class="size-7 rounded-full bg-[#1da1f2]/15 flex items-center justify-center text-xs font-bold text-[#1da1f2] shrink-0">X</div> <span class="text-sm font-medium text-foreground truncate max-w-[180px]"> </span> <span class="size-1.5 rounded-full bg-success shrink-0"></span></div> <div class="flex items-center gap-2 ml-auto shrink-0"><!> <select class="h-7 px-1.5 text-xs rounded border border-input bg-background text-foreground"></select> <!> <!> <button class="text-muted-foreground/30 hover:text-destructive transition-colors p-1 rounded" title="Sign out"><!></button></div></div> <!> <!> <div class="flex items-center gap-2 px-4 py-2.5 border-b border-border shrink-0"><div class="relative flex-1"><!> <!></div> <!> <!></div> <div class="flex-1 min-h-0 overflow-y-auto"><div class="p-3"><!></div></div> <!>', 1), QS = _('<p class="text-sm text-destructive text-center max-w-xs"> </p>'), e5 = _('<div class="size-4 border-2 border-zinc-600 border-t-white rounded-full animate-spin shrink-0"></div> Signing in\u2026', 1), t5 = dn('<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" class="shrink-0"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg> Sign in with X', 1), r5 = _('<div class="flex items-center gap-1.5 text-[0.65rem] text-muted-foreground/30"><span> </span> <button class="text-primary hover:underline ml-auto">Change</button></div>'), n5 = _('<div class="flex flex-col gap-1.5"><!> <div class="flex gap-1.5"><!> <!></div></div>'), a5 = _('<div class="flex flex-col items-center justify-center h-full gap-5 px-8"><div class="size-14 rounded-2xl flex items-center justify-center text-2xl font-black" style="background:#1da1f218; color:#1da1f2;">X</div> <div class="text-center"><p class="text-base font-semibold text-foreground mb-1">Connect Twitter/X</p> <p class="text-sm text-muted-foreground/60 max-w-xs leading-relaxed">Sign in with Twitter to sync and browse your tweets.</p> <p class="text-xs text-muted-foreground/40 max-w-xs leading-relaxed mt-1">Get your Client ID from the <a href="https://developer.x.com/en/portal/dashboard" target="_blank" rel="noopener" class="text-[#1da1f2] hover:underline">X Developer Portal</a>. Create a project \u2192 App \u2192 enable OAuth 2.0 as <a href="https://developer.x.com/en/docs/authentication/oauth-2-0/authorization-code" target="_blank" rel="noopener" class="text-[#1da1f2] hover:underline">Public Client</a>, and set the redirect URI to <code class="text-[0.65rem] bg-muted/30 px-1 py-0.5 rounded"></code></p></div> <!> <div class="flex flex-col items-center gap-2 w-full max-w-[260px]"><button class="flex items-center justify-center gap-2.5 w-full h-10 px-4 rounded-lg border border-border bg-black text-white text-sm font-medium hover:bg-zinc-900 disabled:opacity-50 transition-colors shadow-sm"><!></button></div> <div class="w-full max-w-[260px]"><!></div></div>'), s5 = _(`<div class="flex flex-col h-full overflow-hidden"><div class="flex items-center gap-3 px-8 pt-5 pb-4 border-b border-border shrink-0 bg-transparent"><div class="flex items-center gap-2 min-w-0"><div class="size-7 rounded-full bg-[#10b981]/15 flex items-center justify-center text-xs font-bold text-[#10b981] shrink-0">F</div> <span class="text-sm font-medium text-foreground truncate">Local Filesystem</span></div></div> <div class="flex-1 overflow-auto px-8 py-6"><div class="max-w-xl"><p class="text-sm text-muted-foreground mb-4">Choose a directory to allow pipeline actions (read_file, write_file, list_dir, etc.)
              to operate on your local files. Requires Chrome or Edge.</p> <div class="rounded-lg border border-border bg-card p-4"><!></div></div></div></div>`), o5 = _('<div class="flex flex-col items-center justify-center h-full gap-4 text-center px-8"><div class="size-14 rounded-2xl flex items-center justify-center text-2xl font-black"> </div> <div><p class="text-base font-semibold text-foreground mb-1"> </p> <p class="text-sm text-muted-foreground/50"> </p></div> <span class="px-3 py-1 rounded-full border border-border text-xs text-muted-foreground/50">Coming soon</span></div>'), i5 = _('<div class="flex h-full overflow-hidden"><div class="w-56 shrink-0 flex flex-col border-r border-border bg-sidebar overflow-hidden"><div class="px-3 pt-4 pb-2 shrink-0"><p class="text-[0.6rem] font-semibold uppercase tracking-widest text-muted-foreground/50">Sources</p></div> <!></div> <div class="flex-1 overflow-hidden flex flex-col bg-background"><!></div></div> <!>', 1);
function l5(t, e) {
  Be(e, true);
  const r = { gmail: { color: "#ea4335", icon: "M", label: "Gmail", platform: "Email", live: true }, telegram: { color: "#26a5e4", icon: "T", label: "Telegram", platform: "Messenger", live: false }, instagram: { color: "#e1306c", icon: "I", label: "Instagram", platform: "Social", live: false }, youtube: { color: "#ff0000", icon: "Y", label: "YouTube", platform: "Video", live: false }, slack: { color: "#611f69", icon: "S", label: "Slack", platform: "Messenger", live: false }, twitter: { color: "#1da1f2", icon: "X", label: "Twitter/X", platform: "Social", live: true }, filesystem: { color: "#10b981", icon: "F", label: "Local Filesystem", platform: "Files", live: true } }, n = ["gmail", "twitter", "filesystem", "telegram", "instagram", "slack", "youtube"];
  let a = te(nt([])), o = te(true), i = te("gmail");
  async function l() {
    g(o, true);
    try {
      g(a, await mv(), true);
    } catch {
    }
    g(o, false);
  }
  Xt(l);
  const c = "562478245230-1gohf6dtsajqo1lu3kge9k7cthm4sdv6.apps.googleusercontent.com";
  let f = te(nt(c)), v = te(nt(c)), x = te(false), m = te(false), y = te(null), h = te(null), b = te(null), w = te(false), D = te(nt([])), F = te(0), B = te(0), M = te(false), Z = te(""), U = te(null), P = te(null), E = te(null), S = te(false), $ = te(50), J = te(false), W = te(null);
  const C = [50, 100, 200, 500], A = 50;
  function k(Me) {
    return Me == null ? "Unknown error" : typeof Me == "string" ? Me : (Me == null ? void 0 : Me.message) ?? String(Me);
  }
  const N = H(() => !!s(y)), O = H(() => s(f) === c), Y = H(() => s(D).length < s(F));
  Xt(async () => {
    const Me = await sr("googleClientId");
    return g(f, Me || c, true), g(v, Me || c, true), window.addEventListener("keydown", V), () => {
      window.removeEventListener("keydown", V), s(W) && clearTimeout(s(W));
    };
  });
  function V(Me) {
    Me.key === "Escape" && s(U) && g(U, null);
  }
  Ut(() => {
    s(f) && !s(x) && Sl(s(f)).then(async () => {
      g(x, true);
      const Me = await _a();
      Me && (g(y, Me.access_token, true), q(), G());
    }).catch((Me) => {
      g(b, `Auth init failed: ${k(Me)}`);
    });
  }), Ut(() => {
    s(y) && (le(), Q());
  });
  function q() {
    s(W) && clearTimeout(s(W));
    const Me = kl();
    if (Me <= 0) return;
    const at = Math.max(0, Me - 120 * 1e3);
    g(W, setTimeout(async () => {
      try {
        const ot = await mu();
        g(y, ot.access_token, true), q();
      } catch {
        g(y, null), g(h, null), g(b, "Session expired. Please sign in again.");
      }
    }, at), true);
  }
  async function ne() {
    if (Cc()) return s(y);
    try {
      const Me = await mu();
      return g(y, Me.access_token, true), q(), s(y);
    } catch {
      return g(y, null), g(h, null), g(b, "Session expired. Please sign in again."), null;
    }
  }
  async function K() {
    const Me = s(v).trim();
    Me && (await _r("googleClientId", Me), g(f, Me, true), g(b, null), g(m, false));
  }
  async function R() {
    g(b, null), g(w, true);
    try {
      s(x) || (await Sl(s(f)), g(x, true));
      const Me = await jv();
      g(y, Me.access_token, true), q(), await G();
    } catch (Me) {
      g(b, k(Me), true);
    } finally {
      g(w, false);
    }
  }
  async function L() {
    if (s(W) && clearTimeout(s(W)), s(y)) try {
      await Bv(s(y));
    } catch {
    }
    g(y, null), g(h, null), g(D, [], true), g(F, 0), g(U, null), g(b, null), await oi("gmail-profile");
  }
  async function G() {
    try {
      const Me = await Ug(s(y));
      if (!s(y)) return;
      g(h, Me, true), await _r("gmail-profile", Me);
    } catch (Me) {
      if (!s(y)) return;
      g(b, `Profile fetch failed: ${k(Me)}`);
    }
  }
  async function Q(Me = false) {
    g(M, true);
    try {
      const at = Me ? s(B) : 0, ot = await l2({ query: s(Z) || void 0, limit: A, offset: at });
      g(D, Me ? [...s(D), ...ot.items] : ot.items, true), g(F, ot.total, true), g(B, s(D).length, true);
    } catch (at) {
      g(b, `Failed to load messages: ${k(at)}`);
    } finally {
      g(M, false);
    }
  }
  function re() {
    g(B, 0), Q(false);
  }
  function ie() {
    Q(true);
  }
  async function le() {
    try {
      g(P, await qg(), true);
    } catch {
    }
  }
  async function ce(Me) {
    if (s(S) || !s(y)) return;
    const at = await ne();
    if (at) {
      g(b, null), g(S, true), g(E, null);
      try {
        await Zw(at, { limit: Me, onProgress: (ot) => {
          g(E, { ...ot }, true);
        } }), await le(), await Q(false);
      } catch (ot) {
        (ot == null ? void 0 : ot.name) !== "AbortError" && s(y) && g(b, `Sync failed: ${k(ot)}`);
      } finally {
        g(S, false);
      }
    }
  }
  async function fe(Me) {
    if (s(S) || !s(y)) return;
    const at = await ne();
    if (at) {
      g(b, null), g(S, true), g(E, null);
      try {
        await Jw(at, { limit: Me, onProgress: (ot) => {
          g(E, { ...ot }, true);
        } }), await le(), await Q(false);
      } catch (ot) {
        (ot == null ? void 0 : ot.name) !== "AbortError" && s(y) && g(b, `Sync more failed: ${k(ot)}`);
      } finally {
        g(S, false);
      }
    }
  }
  async function ve() {
    try {
      await vv(), await le(), g(D, [], true), g(F, 0), g(B, 0), g(J, false);
    } catch (Me) {
      g(b, `Failed to clear data: ${k(Me)}`);
    }
  }
  function be(Me) {
    if (!Me) return "never";
    const at = Math.floor((Date.now() - Me) / 1e3);
    if (at < 60) return "just now";
    const ot = Math.floor(at / 60);
    if (ot < 60) return `${ot}m ago`;
    const Qt = Math.floor(ot / 60);
    return Qt < 24 ? `${Qt}h ago` : `${Math.floor(Qt / 24)}d ago`;
  }
  function _e40() {
    var _a10, _b4;
    return !((_a10 = s(E)) == null ? void 0 : _a10.total) || !((_b4 = s(E)) == null ? void 0 : _b4.current) ? 0 : Math.round(s(E).current / s(E).total * 100);
  }
  const xe = 50;
  let Ae = te(""), Ee = te(""), Se = te(false), Pe = te(null), pe = te(null), de = te(null), ue = te(false), me = te(nt([])), we = te(0), ye = te(0), Te = te(false), Oe = te(""), X = te(null), se = te(null), he = te(false), ge = te(50), $e = te(false);
  const Ie = H(() => !!s(Pe));
  Xt(async () => {
    const Me = await sr("twitterClientId");
    if (g(Ae, Me || "", true), g(Ee, Me || "", true), s(Ae) && Ji(s(Ae)), window.location.hash.includes("oauth-twitter")) {
      const ot = new URL(window.location.href.replace("/#", "/?")), Qt = ot.searchParams.get("code"), ar = ot.searchParams.get("state");
      if (Qt && ar) try {
        const It = await m2(Qt, ar);
        g(Pe, It.access_token, true), await We(), window.location.hash = "#sources";
      } catch (It) {
        g(de, `Auth failed: ${k(It)}`);
      }
    }
    if (!s(Pe)) try {
      const ot = await am();
      ot && (g(Pe, ot.access_token, true), await We());
    } catch {
    }
  });
  async function ze() {
    const Me = s(Ee).trim();
    Me && (await _r("twitterClientId", Me), g(Ae, Me, true), Ji(Me), g(Se, false));
  }
  async function Re() {
    g(de, null), g(ue, true);
    try {
      if (!s(Ae)) {
        g(de, "Set your Twitter Client ID first"), g(ue, false);
        return;
      }
      Ji(s(Ae)), await g2();
    } catch (Me) {
      g(de, k(Me), true), g(ue, false);
    }
  }
  async function Le() {
    try {
      await _2();
    } catch {
    }
    g(Pe, null), g(pe, null), g(me, [], true), g(we, 0), g(de, null), await oi("twitter-profile");
  }
  async function We() {
    try {
      const Me = await Pd(s(Pe));
      g(pe, Me.data, true), await _r("twitter-profile", Me.data), await dt(), await st(false);
    } catch (Me) {
      g(de, `Profile fetch failed: ${k(Me)}`);
    }
  }
  async function st(Me = false) {
    g(Te, true);
    try {
      const at = Me ? s(ye) : 0, ot = s(Oe) ? 2e3 : xe + at;
      let ar = await av("twitter", ot, 0) ?? [];
      if (s(Oe)) {
        const qt = s(Oe).toLowerCase();
        ar = ar.filter((qe) => String(qe.subject ?? "").toLowerCase().includes(qt) || String(qe.body ?? "").toLowerCase().includes(qt) || String(qe.from ?? "").toLowerCase().includes(qt));
      }
      const It = s(Oe) ? ar.length : Number(await _c("twitter") ?? 0), rr = ar.slice(at, at + xe);
      g(me, Me ? [...s(me), ...rr] : rr, true), g(we, It, true), g(ye, s(me).length, true);
    } catch (at) {
      g(de, `Failed to load tweets: ${k(at)}`);
    } finally {
      g(Te, false);
    }
  }
  function gt() {
    g(ye, 0), st(false);
  }
  function Lt() {
    st(true);
  }
  async function dt() {
    try {
      g(X, await im(), true);
    } catch {
    }
  }
  async function Jt(Me) {
    if (!(s(he) || !s(Pe))) {
      g(de, null), g(he, true), g(se, null);
      try {
        await w2(s(Pe), { limit: Me, onProgress: (at) => {
          g(se, { ...at }, true);
        } }), await dt(), await st(false);
      } catch (at) {
        (at == null ? void 0 : at.name) !== "AbortError" && g(de, `Sync failed: ${k(at)}`);
      } finally {
        g(he, false);
      }
    }
  }
  async function Wt(Me) {
    if (!(s(he) || !s(Pe))) {
      g(de, null), g(he, true), g(se, null);
      try {
        await k2(s(Pe), { limit: Me, onProgress: (at) => {
          g(se, { ...at }, true);
        } }), await dt(), await st(false);
      } catch (at) {
        (at == null ? void 0 : at.name) !== "AbortError" && g(de, `Sync more failed: ${k(at)}`);
      } finally {
        g(he, false);
      }
    }
  }
  async function Nr() {
    try {
      await S2(), await dt(), g(me, [], true), g(we, 0), g(ye, 0), g($e, false);
    } catch (Me) {
      g(de, `Failed to clear data: ${k(Me)}`);
    }
  }
  function Rr() {
    var _a10, _b4;
    return !((_a10 = s(se)) == null ? void 0 : _a10.total) || !((_b4 = s(se)) == null ? void 0 : _b4.current) ? 0 : Math.round(s(se).current / s(se).total * 100);
  }
  var Nt = i5(), Sr = ae(Nt), ra = d(Sr), na = p(d(ra), 2);
  jn(na, { class: "flex-1", children: (Me, at) => {
    var ot = _S();
    Ve(ot, 21, () => n, Qe, (Qt, ar) => {
      const It = H(() => r[s(ar)]), rr = H(() => s(i) === s(ar)), qt = H(() => s(It).live), qe = H(() => s(qt) && s(N));
      var ee = hS(), Ce = d(ee), Ye = d(Ce), wt = p(Ce, 2), jt = d(wt), Ot = d(jt), Ht = p(jt, 2), ir = d(Ht), lr = p(wt, 2);
      {
        var Bt = (Yt) => {
          var kt = ke(), nr = ae(kt);
          {
            var fr = (pr) => {
              var Ar = vS();
              u(pr, Ar);
            }, Mr = (pr) => {
              var Ar = gS();
              u(pr, Ar);
            };
            I(nr, (pr) => {
              s(qe) ? pr(fr) : pr(Mr, -1);
            });
          }
          u(Yt, kt);
        }, mt = (Yt) => {
          var kt = mS();
          u(Yt, kt);
        };
        I(lr, (Yt) => {
          s(qt) ? Yt(Bt) : Yt(mt, -1);
        });
      }
      j((Yt, kt) => {
        ee.disabled = !s(qt), rt(ee, 1, Yt), Rt(Ce, `background:${s(It).color ?? ""}18; color:${s(It).color ?? ""};`), T(Ye, s(It).icon), rt(jt, 1, kt), T(Ot, s(It).label), T(ir, s(It).platform);
      }, [() => Et(Je("w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-colors", s(rr) && s(qt) ? "bg-sidebar-accent border border-primary/20" : s(qt) ? "hover:bg-sidebar-accent/60 border border-transparent" : "opacity-40 cursor-default border border-transparent")), () => Et(Je("text-sm font-medium truncate", s(rr) && s(qt) ? "text-foreground" : "text-foreground/80"))]), Ne("click", ee, () => g(i, s(ar), true)), u(Qt, ee);
    }), u(Me, ot);
  }, $$slots: { default: true } });
  var wa = p(ra, 2), Ka = d(wa);
  {
    var Xa = (Me) => {
      var at = ke(), ot = ae(at);
      {
        var Qt = (It) => {
          var rr = NS(), qt = ae(rr), qe = d(qt), ee = d(qe), Ce = d(ee), Ye = p(ee, 2), wt = d(Ye), jt = p(qe, 2), Ot = d(jt);
          {
            var Ht = (Ge) => {
              var it = bS(), pt = d(it);
              j(() => T(pt, s(E).message || "Syncing\u2026")), u(Ge, it);
            }, ir = (Ge) => {
              var it = xS(), pt = d(it);
              j((Pt, er) => T(pt, `${Pt ?? ""} emails \xB7 ${er ?? ""}`), [() => s(P).totalItems.toLocaleString(), () => be(s(P).lastSyncAt)]), u(Ge, it);
            };
            I(Ot, (Ge) => {
              var _a10;
              s(S) && s(E) ? Ge(Ht) : ((_a10 = s(P)) == null ? void 0 : _a10.synced) && Ge(ir, 1);
            });
          }
          var lr = p(Ot, 2);
          Ve(lr, 21, () => C, Qe, (Ge, it) => {
            var pt = yS(), Pt = d(pt), er = {};
            j(() => {
              T(Pt, s(it)), er !== (er = s(it)) && (pt.value = (pt.__value = s(it)) ?? "");
            }), u(Ge, pt);
          });
          var Bt = p(lr, 2);
          tt(Bt, { size: "sm", onclick: () => ce(s($)), get disabled() {
            return s(S);
          }, class: "h-7 gap-1.5 text-xs", children: (Ge, it) => {
            var pt = wS(), Pt = ae(pt);
            {
              let or = H(() => Je("size-3", s(S) && "animate-spin"));
              ms(Pt, { get class() {
                return s(or);
              } });
            }
            var er = p(Pt);
            j(() => {
              var _a10;
              return T(er, ` ${s(S) ? "Syncing\u2026" : ((_a10 = s(P)) == null ? void 0 : _a10.synced) ? "Sync New" : "Download"}`);
            }), u(Ge, pt);
          }, $$slots: { default: true } });
          var mt = p(Bt, 2);
          {
            var Yt = (Ge) => {
              tt(Ge, { variant: "outline", size: "sm", onclick: () => fe(s($)), get disabled() {
                return s(S);
              }, class: "h-7 text-xs", children: (it, pt) => {
                var Pt = Ue("More");
                u(it, Pt);
              }, $$slots: { default: true } });
            };
            I(mt, (Ge) => {
              var _a10;
              ((_a10 = s(P)) == null ? void 0 : _a10.synced) && s(P).hasMore && Ge(Yt);
            });
          }
          var kt = p(mt, 2), nr = d(kt);
          Iu(nr, { class: "size-3.5" });
          var fr = p(qt, 2);
          {
            var Mr = (Ge) => {
              {
                let it = H(_e40);
                Hl(Ge, { get value() {
                  return s(it);
                }, class: "h-0.5 rounded-none" });
              }
            };
            I(fr, (Ge) => {
              var _a10;
              s(S) && ((_a10 = s(E)) == null ? void 0 : _a10.total) && Ge(Mr);
            });
          }
          var pr = p(fr, 2);
          {
            var Ar = (Ge) => {
              var it = kS(), pt = d(it), Pt = d(pt), er = p(pt, 2);
              j(() => T(Pt, s(b))), Ne("click", er, () => g(b, null)), u(Ge, it);
            };
            I(pr, (Ge) => {
              s(b) && Ge(Ar);
            });
          }
          var fn = p(pr, 2), Za = d(fn), Bn = d(Za);
          Jo(Bn, { class: "absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/40 pointer-events-none" });
          var zi = p(Bn, 2);
          $n(zi, { type: "text", placeholder: "Search subjects, senders, or snippets\u2026", onkeydown: (Ge) => Ge.key === "Enter" && re(), class: "pl-9 h-8 text-sm", get value() {
            return s(Z);
          }, set value(Ge) {
            g(Z, Ge, true);
          } });
          var yo = p(Za, 2);
          tt(yo, { onclick: re, get disabled() {
            return s(M);
          }, variant: "outline", size: "sm", class: "shrink-0 h-8", children: (Ge, it) => {
            var pt = Ue();
            j(() => T(pt, s(M) ? "\u2026" : "Search")), u(Ge, pt);
          }, $$slots: { default: true } });
          var wo = p(yo, 2);
          {
            var Oi = (Ge) => {
              var it = SS(), pt = d(it);
              j((Pt) => T(pt, `${s(D).length ?? ""} of ${Pt ?? ""}`), [() => s(F).toLocaleString()]), u(Ge, it);
            };
            I(wo, (Ge) => {
              s(F) > 0 && Ge(Oi);
            });
          }
          var ko = p(fn, 2), Di = d(ko), Li = d(Di);
          {
            var ji = (Ge) => {
              var it = AS(), pt = ae(it);
              Wu(pt, { get messages() {
                return s(D);
              }, onselect: (or) => g(U, or, true) });
              var Pt = p(pt, 2);
              {
                var er = (or) => {
                  var Wr = TS(), pn = d(Wr);
                  tt(pn, { variant: "outline", onclick: ie, get disabled() {
                    return s(M);
                  }, children: (aa, sa) => {
                    var So = Ue();
                    j(() => T(So, s(M) ? "Loading\u2026" : "Load More")), u(aa, So);
                  }, $$slots: { default: true } }), u(or, Wr);
                };
                I(Pt, (or) => {
                  s(Y) && or(er);
                });
              }
              u(Ge, it);
            }, Bi = (Ge) => {
              var it = ES();
              u(Ge, it);
            }, Fi = (Ge) => {
              var it = CS(), pt = d(it);
              $l(pt, { class: "size-8 text-muted-foreground/15" });
              var Pt = p(pt, 2), er = d(Pt);
              j(() => T(er, s(Z) ? `No emails match "${s(Z)}"` : "No emails synced yet \u2014 click Download above")), u(Ge, it);
            };
            I(Li, (Ge) => {
              s(D).length > 0 ? Ge(ji) : s(M) ? Ge(Bi, 1) : Ge(Fi, -1);
            });
          }
          var lt = p(ko, 2);
          {
            var Tt = (Ge) => {
              var it = $S(), pt = d(it);
              {
                var Pt = (or) => {
                  var Wr = IS(), pn = p(d(Wr), 2);
                  tt(pn, { variant: "destructive", size: "sm", onclick: ve, class: "h-6 text-xs px-2", children: (sa, So) => {
                    var Ui = Ue("Delete");
                    u(sa, Ui);
                  }, $$slots: { default: true } });
                  var aa = p(pn, 2);
                  tt(aa, { variant: "outline", size: "sm", onclick: () => g(J, false), class: "h-6 text-xs px-2", children: (sa, So) => {
                    var Ui = Ue("Cancel");
                    u(sa, Ui);
                  }, $$slots: { default: true } }), u(or, Wr);
                }, er = (or) => {
                  var Wr = PS(), pn = d(Wr);
                  Qo(pn, { class: "size-3" }), Ne("click", Wr, () => g(J, true)), u(or, Wr);
                };
                I(pt, (or) => {
                  s(J) ? or(Pt) : or(er, -1);
                });
              }
              u(Ge, it);
            };
            I(lt, (Ge) => {
              var _a10;
              ((_a10 = s(P)) == null ? void 0 : _a10.synced) && Ge(Tt);
            });
          }
          j((Ge) => {
            var _a10;
            T(Ce, Ge), T(wt, ((_a10 = s(h)) == null ? void 0 : _a10.emailAddress) ?? "Gmail"), lr.disabled = s(S);
          }, [() => {
            var _a10, _b4, _c6;
            return ((_c6 = (_b4 = (_a10 = s(h)) == null ? void 0 : _a10.emailAddress) == null ? void 0 : _b4[0]) == null ? void 0 : _c6.toUpperCase()) ?? "G";
          }]), Mn(lr, () => s($), (Ge) => g($, Ge)), Ne("click", kt, L), u(It, rr);
        }, ar = (It) => {
          var rr = LS(), qt = p(d(rr), 4);
          {
            var qe = (Bt) => {
              var mt = RS(), Yt = d(mt);
              j(() => T(Yt, s(b))), u(Bt, mt);
            };
            I(qt, (Bt) => {
              s(b) && Bt(qe);
            });
          }
          var ee = p(qt, 2), Ce = d(ee), Ye = d(Ce);
          {
            var wt = (Bt) => {
              var mt = MS();
              u(Bt, mt);
            }, jt = (Bt) => {
              var mt = zS();
              u(Bt, mt);
            };
            I(Ye, (Bt) => {
              s(w) ? Bt(wt) : Bt(jt, -1);
            });
          }
          var Ot = p(ee, 2), Ht = d(Ot);
          {
            var ir = (Bt) => {
              var mt = OS(), Yt = d(mt), kt = d(Yt), nr = p(Yt, 2);
              j((fr) => T(kt, `Client ID: ${fr ?? ""}`), [() => s(O) ? "shared default" : s(f).slice(0, 16) + "\u2026"]), Ne("click", nr, () => g(m, true)), u(Bt, mt);
            }, lr = (Bt) => {
              var mt = DS(), Yt = d(mt);
              $n(Yt, { placeholder: "Paste your Client ID\u2026", class: "h-8 text-xs font-mono", get value() {
                return s(v);
              }, set value(Mr) {
                g(v, Mr, true);
              } });
              var kt = p(Yt, 2), nr = d(kt);
              tt(nr, { size: "sm", onclick: K, class: "flex-1 h-7 text-xs", children: (Mr, pr) => {
                var Ar = Ue("Save");
                u(Mr, Ar);
              }, $$slots: { default: true } });
              var fr = p(nr, 2);
              tt(fr, { variant: "outline", size: "sm", onclick: () => g(m, false), class: "flex-1 h-7 text-xs", children: (Mr, pr) => {
                var Ar = Ue("Cancel");
                u(Mr, Ar);
              }, $$slots: { default: true } }), u(Bt, mt);
            };
            I(Ht, (Bt) => {
              s(m) ? Bt(lr, -1) : Bt(ir);
            });
          }
          j(() => Ce.disabled = s(w)), Ne("click", Ce, R), u(It, rr);
        };
        I(ot, (It) => {
          s(N) ? It(Qt) : It(ar, -1);
        });
      }
      u(Me, at);
    }, xt = (Me) => {
      var at = ke(), ot = ae(at);
      {
        var Qt = (It) => {
          var rr = JS(), qt = ae(rr), qe = d(qt), ee = p(d(qe), 2), Ce = d(ee), Ye = p(qe, 2), wt = d(Ye);
          {
            var jt = (lt) => {
              var Tt = jS(), Ge = d(Tt);
              j(() => T(Ge, s(se).message || "Syncing\u2026")), u(lt, Tt);
            }, Ot = (lt) => {
              var Tt = BS(), Ge = d(Tt);
              j((it, pt) => T(Ge, `${it ?? ""} tweets \xB7 ${pt ?? ""}`), [() => s(X).totalItems.toLocaleString(), () => be(s(X).lastSyncAt)]), u(lt, Tt);
            };
            I(wt, (lt) => {
              var _a10;
              s(he) && s(se) ? lt(jt) : ((_a10 = s(X)) == null ? void 0 : _a10.synced) && lt(Ot, 1);
            });
          }
          var Ht = p(wt, 2);
          Ve(Ht, 21, () => C, Qe, (lt, Tt) => {
            var Ge = FS(), it = d(Ge), pt = {};
            j(() => {
              T(it, s(Tt)), pt !== (pt = s(Tt)) && (Ge.value = (Ge.__value = s(Tt)) ?? "");
            }), u(lt, Ge);
          });
          var ir = p(Ht, 2);
          tt(ir, { size: "sm", onclick: () => Jt(s(ge)), get disabled() {
            return s(he);
          }, class: "h-7 gap-1.5 text-xs", children: (lt, Tt) => {
            var Ge = US(), it = ae(Ge);
            {
              let Pt = H(() => Je("size-3", s(he) && "animate-spin"));
              ms(it, { get class() {
                return s(Pt);
              } });
            }
            var pt = p(it);
            j(() => {
              var _a10;
              return T(pt, ` ${s(he) ? "Syncing\u2026" : ((_a10 = s(X)) == null ? void 0 : _a10.synced) ? "Sync New" : "Download"}`);
            }), u(lt, Ge);
          }, $$slots: { default: true } });
          var lr = p(ir, 2);
          {
            var Bt = (lt) => {
              tt(lt, { variant: "outline", size: "sm", onclick: () => Wt(s(ge)), get disabled() {
                return s(he);
              }, class: "h-7 text-xs", children: (Tt, Ge) => {
                var it = Ue("More");
                u(Tt, it);
              }, $$slots: { default: true } });
            };
            I(lr, (lt) => {
              var _a10;
              ((_a10 = s(X)) == null ? void 0 : _a10.synced) && s(X).hasMore && lt(Bt);
            });
          }
          var mt = p(lr, 2), Yt = d(mt);
          Iu(Yt, { class: "size-3.5" });
          var kt = p(qt, 2);
          {
            var nr = (lt) => {
              {
                let Tt = H(Rr);
                Hl(lt, { get value() {
                  return s(Tt);
                }, class: "h-0.5 rounded-none" });
              }
            };
            I(kt, (lt) => {
              var _a10;
              s(he) && ((_a10 = s(se)) == null ? void 0 : _a10.total) && lt(nr);
            });
          }
          var fr = p(kt, 2);
          {
            var Mr = (lt) => {
              var Tt = GS(), Ge = d(Tt), it = d(Ge), pt = p(Ge, 2);
              j(() => T(it, s(de))), Ne("click", pt, () => g(de, null)), u(lt, Tt);
            };
            I(fr, (lt) => {
              s(de) && lt(Mr);
            });
          }
          var pr = p(fr, 2), Ar = d(pr), fn = d(Ar);
          Jo(fn, { class: "absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/40 pointer-events-none" });
          var Za = p(fn, 2);
          $n(Za, { type: "text", placeholder: "Search tweets\u2026", onkeydown: (lt) => lt.key === "Enter" && gt(), class: "pl-9 h-8 text-sm", get value() {
            return s(Oe);
          }, set value(lt) {
            g(Oe, lt, true);
          } });
          var Bn = p(Ar, 2);
          tt(Bn, { onclick: gt, get disabled() {
            return s(Te);
          }, variant: "outline", size: "sm", class: "shrink-0 h-8", children: (lt, Tt) => {
            var Ge = Ue();
            j(() => T(Ge, s(Te) ? "\u2026" : "Search")), u(lt, Ge);
          }, $$slots: { default: true } });
          var zi = p(Bn, 2);
          {
            var yo = (lt) => {
              var Tt = WS(), Ge = d(Tt);
              j((it) => T(Ge, `${s(me).length ?? ""} of ${it ?? ""}`), [() => s(we).toLocaleString()]), u(lt, Tt);
            };
            I(zi, (lt) => {
              s(we) > 0 && lt(yo);
            });
          }
          var wo = p(pr, 2), Oi = d(wo), ko = d(Oi);
          {
            var Di = (lt) => {
              var Tt = HS(), Ge = ae(Tt);
              Wu(Ge, { get messages() {
                return s(me);
              }, onselect: (Pt) => g(U, Pt, true) });
              var it = p(Ge, 2);
              {
                var pt = (Pt) => {
                  var er = VS(), or = d(er);
                  tt(or, { variant: "outline", onclick: Lt, get disabled() {
                    return s(Te);
                  }, children: (Wr, pn) => {
                    var aa = Ue();
                    j(() => T(aa, s(Te) ? "Loading\u2026" : "Load More")), u(Wr, aa);
                  }, $$slots: { default: true } }), u(Pt, er);
                };
                I(it, (Pt) => {
                  s(me).length < s(we) && Pt(pt);
                });
              }
              u(lt, Tt);
            }, Li = (lt) => {
              var Tt = qS();
              u(lt, Tt);
            }, ji = (lt) => {
              var Tt = YS(), Ge = d(Tt);
              $l(Ge, { class: "size-8 text-muted-foreground/15" });
              var it = p(Ge, 2), pt = d(it);
              j(() => T(pt, s(Oe) ? `No tweets match "${s(Oe)}"` : "No tweets synced yet \u2014 click Download above")), u(lt, Tt);
            };
            I(ko, (lt) => {
              s(me).length > 0 ? lt(Di) : s(Te) ? lt(Li, 1) : lt(ji, -1);
            });
          }
          var Bi = p(wo, 2);
          {
            var Fi = (lt) => {
              var Tt = ZS(), Ge = d(Tt);
              {
                var it = (Pt) => {
                  var er = KS(), or = p(d(er), 2);
                  tt(or, { variant: "destructive", size: "sm", onclick: Nr, class: "h-6 text-xs px-2", children: (pn, aa) => {
                    var sa = Ue("Delete");
                    u(pn, sa);
                  }, $$slots: { default: true } });
                  var Wr = p(or, 2);
                  tt(Wr, { variant: "outline", size: "sm", onclick: () => g($e, false), class: "h-6 text-xs px-2", children: (pn, aa) => {
                    var sa = Ue("Cancel");
                    u(pn, sa);
                  }, $$slots: { default: true } }), u(Pt, er);
                }, pt = (Pt) => {
                  var er = XS(), or = d(er);
                  Qo(or, { class: "size-3" }), Ne("click", er, () => g($e, true)), u(Pt, er);
                };
                I(Ge, (Pt) => {
                  s($e) ? Pt(it) : Pt(pt, -1);
                });
              }
              u(lt, Tt);
            };
            I(Bi, (lt) => {
              var _a10;
              ((_a10 = s(X)) == null ? void 0 : _a10.synced) && lt(Fi);
            });
          }
          j(() => {
            var _a10;
            T(Ce, `@${((_a10 = s(pe)) == null ? void 0 : _a10.username) ?? "Twitter" ?? ""}`), Ht.disabled = s(he);
          }), Mn(Ht, () => s(ge), (lt) => g(ge, lt)), Ne("click", mt, Le), u(It, rr);
        }, ar = (It) => {
          var rr = a5(), qt = p(d(rr), 2), qe = p(d(qt), 4), ee = p(d(qe), 5);
          ee.textContent = `${window.location.origin ?? ""}/#oauth-twitter`;
          var Ce = p(qt, 2);
          {
            var Ye = (kt) => {
              var nr = QS(), fr = d(nr);
              j(() => T(fr, s(de))), u(kt, nr);
            };
            I(Ce, (kt) => {
              s(de) && kt(Ye);
            });
          }
          var wt = p(Ce, 2), jt = d(wt), Ot = d(jt);
          {
            var Ht = (kt) => {
              var nr = e5();
              u(kt, nr);
            }, ir = (kt) => {
              var nr = t5();
              u(kt, nr);
            };
            I(Ot, (kt) => {
              s(ue) ? kt(Ht) : kt(ir, -1);
            });
          }
          var lr = p(wt, 2), Bt = d(lr);
          {
            var mt = (kt) => {
              var nr = r5(), fr = d(nr), Mr = d(fr), pr = p(fr, 2);
              j((Ar) => T(Mr, `Client ID: ${Ar ?? ""}`), [() => s(Ae) ? s(Ae).slice(0, 16) + "\u2026" : "not set"]), Ne("click", pr, () => g(Se, true)), u(kt, nr);
            }, Yt = (kt) => {
              var nr = n5(), fr = d(nr);
              $n(fr, { placeholder: "Paste your Twitter Client ID\u2026", class: "h-8 text-xs font-mono", get value() {
                return s(Ee);
              }, set value(fn) {
                g(Ee, fn, true);
              } });
              var Mr = p(fr, 2), pr = d(Mr);
              tt(pr, { size: "sm", onclick: ze, class: "flex-1 h-7 text-xs", children: (fn, Za) => {
                var Bn = Ue("Save");
                u(fn, Bn);
              }, $$slots: { default: true } });
              var Ar = p(pr, 2);
              tt(Ar, { variant: "outline", size: "sm", onclick: () => g(Se, false), class: "flex-1 h-7 text-xs", children: (fn, Za) => {
                var Bn = Ue("Cancel");
                u(fn, Bn);
              }, $$slots: { default: true } }), u(kt, nr);
            };
            I(Bt, (kt) => {
              s(Se) ? kt(Yt, -1) : kt(mt);
            });
          }
          j(() => jt.disabled = s(ue)), Ne("click", jt, Re), u(It, rr);
        };
        I(ot, (It) => {
          s(Ie) ? It(Qt) : It(ar, -1);
        });
      }
      u(Me, at);
    }, Ft = (Me) => {
      var at = s5(), ot = p(d(at), 2), Qt = d(ot), ar = p(d(Qt), 2), It = d(ar);
      Sm(It, {}), u(Me, at);
    }, ur = (Me) => {
      const at = H(() => r[s(i)]);
      var ot = o5(), Qt = d(ot), ar = d(Qt), It = p(Qt, 2), rr = d(It), qt = d(rr), qe = p(rr, 2), ee = d(qe);
      j(() => {
        var _a10, _b4, _c6, _d4, _e41;
        Rt(Qt, `background:${((_a10 = s(at)) == null ? void 0 : _a10.color) ?? "#888" ?? ""}18; color:${((_b4 = s(at)) == null ? void 0 : _b4.color) ?? "#888" ?? ""};`), T(ar, ((_c6 = s(at)) == null ? void 0 : _c6.icon) ?? "?"), T(qt, ((_d4 = s(at)) == null ? void 0 : _d4.label) ?? s(i)), T(ee, (_e41 = s(at)) == null ? void 0 : _e41.platform);
      }), u(Me, ot);
    };
    I(Ka, (Me) => {
      s(i) === "gmail" ? Me(Xa) : s(i) === "twitter" ? Me(xt, 1) : s(i) === "filesystem" ? Me(Ft, 2) : Me(ur, -1);
    });
  }
  var Sn = p(Sr, 2);
  {
    var ka = (Me) => {
      var at = ke(), ot = ae(at);
      Zh(ot, () => s(U).id || s(U).messageId || "modal", (Qt) => {
        oS(Qt, { get message() {
          return s(U);
        }, loading: false, onclose: () => g(U, null) });
      }), u(Me, at);
    };
    I(Sn, (Me) => {
      s(U) && Me(ka);
    });
  }
  u(t, Nt), Fe();
}
Zt(["click"]);
function ql(t, e) {
  Be(e, true);
  let r = oe(e, "ref", 15, null), n = oe(e, "checked", 15, false), a = ft(e, ["$$slots", "$$events", "$$legacy", "ref", "class", "checked"]);
  var o = ke(), i = ae(o);
  {
    let l = H(() => Je("data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 peer inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50", e.class));
    dr(i, () => dy, (c, f) => {
      f(c, et({ "data-slot": "switch", get class() {
        return s(l);
      } }, () => a, { get ref() {
        return r();
      }, set ref(v) {
        r(v);
      }, get checked() {
        return n();
      }, set checked(v) {
        n(v);
      }, children: (v, x) => {
        var m = ke(), y = ae(m);
        {
          let h = H(() => Je("bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0"));
          dr(y, () => fy, (b, w) => {
            w(b, { "data-slot": "switch-thumb", get class() {
              return s(h);
            } });
          });
        }
        u(v, m);
      }, $$slots: { default: true } }));
    });
  }
  u(t, o), Fe();
}
var c5 = _('<div class="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground"><div class="size-5 rounded-full border-2 border-border border-t-primary animate-spin"></div> <span class="text-xs">Loading plugins\u2026</span></div>'), d5 = _('<div class="flex flex-col gap-1 pt-2 border-t border-border/40"><span class="text-[0.6rem] font-bold uppercase tracking-wider text-muted-foreground/40">Actions</span> <div class="flex flex-wrap gap-1"></div></div>'), u5 = _('<div class="flex flex-col gap-1 pt-2 border-t border-border/40"><span class="text-[0.6rem] font-bold uppercase tracking-wider text-muted-foreground/40">Handles</span> <div class="flex flex-wrap gap-1"></div></div>'), f5 = _('<div><div class="flex items-start gap-2.5"><div class="size-8 rounded flex items-center justify-center text-sm font-black shrink-0"> </div> <div class="flex-1 min-w-0"><div class="flex items-baseline gap-1.5 mb-0.5"><span class="text-sm font-semibold text-foreground"> </span> <code class="text-[0.62rem] text-muted-foreground/50 font-mono"> </code></div> <span class="text-xs text-muted-foreground"> </span></div> <div class="shrink-0"><!></div></div> <!> <!></div>'), p5 = _(`<div class="flex flex-col gap-3"><div class="grid gap-2" style="grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));"></div> <div class="flex items-start gap-2.5 px-3.5 py-3 rounded border border-border/40 bg-muted/20 text-muted-foreground mt-1"><!> <p class="text-xs leading-relaxed">Plugins provide Actions and handle Sources. Disabling a plugin makes all its actions
            unavailable at runtime \u2014 existing rules that reference those actions will be skipped.
            The <strong class="text-muted-foreground/80">AI Classifier</strong> plugin is always active; it runs before all rules
            and assigns EventType + EventCategory to every incoming event.</p></div></div>`), v5 = _('<div class="flex flex-col h-full overflow-hidden"><div class="px-8 pt-5 pb-4 shrink-0 border-b border-border"><div class="flex items-center gap-2 mb-0.5"><h1 class="text-sm font-semibold tracking-tight text-foreground">Plugins</h1> <span class="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground/50">/ registry</span></div> <p class="text-xs text-muted-foreground"> </p></div> <!></div>');
function g5(t, e) {
  Be(e, true);
  let r = te(nt([])), n = te(true);
  const a = { gmail_plugin: { color: "#ea4335", icon: "G", desc: "Gmail email management" }, telegram_plugin: { color: "#26a5e4", icon: "T", desc: "Telegram messaging" }, instagram_plugin: { color: "#e1306c", icon: "I", desc: "Instagram interactions" }, ai_summarizer: { color: "#8b5cf6", icon: "\u2211", desc: "AI-powered content summarization" }, notifier: { color: "#f59e0b", icon: "N", desc: "User notifications and escalation" }, ai_classifier: { color: "#10b981", icon: "C", desc: "AI event classification (runs first on all events)" } };
  async function o() {
    g(n, true);
    try {
      g(r, await hv(), true);
    } catch (m) {
      console.error("PluginsView load error:", m);
    }
    g(n, false);
  }
  Xt(o);
  async function i(m) {
    m.name !== "ai_classifier" && (await Pv(m.name, !m.enabled), m.enabled = !m.enabled);
  }
  var l = v5(), c = d(l), f = p(d(c), 2), v = d(f), x = p(c, 2);
  jn(x, { class: "flex-1 px-8 pb-6", children: (m, y) => {
    var h = ke(), b = ae(h);
    {
      var w = (F) => {
        var B = c5();
        u(F, B);
      }, D = (F) => {
        var B = p5(), M = d(B);
        Ve(M, 23, () => s(r), (P, E) => P.name ?? `plugin-${E}`, (P, E) => {
          const S = H(() => a[s(E).name] ?? { color: "#6366f1", icon: "P", desc: "" });
          var $ = f5(), J = d($), W = d(J), C = d(W), A = p(W, 2), k = d(A), N = d(k), O = d(N), Y = p(N, 2), V = d(Y), q = p(k, 2), ne = d(q), K = p(A, 2), R = d(K);
          {
            var L = (ce) => {
              Cr(ce, { variant: "default", class: "text-xs", children: (fe, ve) => {
                var be = Ue("System");
                u(fe, be);
              }, $$slots: { default: true } });
            }, G = (ce) => {
              {
                let fe = H(() => s(E).enabled ? `Disable ${s(E).label}` : `Enable ${s(E).label}`);
                ql(ce, { get checked() {
                  return s(E).enabled;
                }, onCheckedChange: () => i(s(E)), get "aria-label"() {
                  return s(fe);
                } });
              }
            };
            I(R, (ce) => {
              s(E).name === "ai_classifier" ? ce(L) : ce(G, -1);
            });
          }
          var Q = p(J, 2);
          {
            var re = (ce) => {
              var fe = d5(), ve = p(d(fe), 2);
              Ve(ve, 21, () => s(E).actions, Qe, (be, _e40) => {
                Cr(be, { variant: "secondary", class: "text-xs px-1.5 h-4", children: (xe, Ae) => {
                  var Ee = Ue();
                  j(() => T(Ee, s(_e40).label)), u(xe, Ee);
                }, $$slots: { default: true } });
              }), u(ce, fe);
            };
            I(Q, (ce) => {
              var _a10;
              ((_a10 = s(E).actions) == null ? void 0 : _a10.length) && ce(re);
            });
          }
          var ie = p(Q, 2);
          {
            var le = (ce) => {
              var fe = u5(), ve = p(d(fe), 2);
              Ve(ve, 21, () => s(E).sources, Qe, (be, _e40) => {
                Cr(be, { variant: "outline", class: "text-xs px-1.5 h-4", children: (xe, Ae) => {
                  var Ee = Ue();
                  j(() => T(Ee, s(_e40).label)), u(xe, Ee);
                }, $$slots: { default: true } });
              }), u(ce, fe);
            };
            I(ie, (ce) => {
              var _a10;
              ((_a10 = s(E).sources) == null ? void 0 : _a10.length) && ce(le);
            });
          }
          j((ce) => {
            rt($, 1, ce), Rt(W, `background:${s(S).color ?? ""}15;color:${s(S).color ?? ""};`), T(C, s(S).icon), T(O, s(E).label), T(V, `v${s(E).version ?? ""}`), T(ne, s(S).desc);
          }, [() => Et(Je("flex flex-col gap-2.5 p-3.5 rounded border bg-card transition-colors", "border-border/50 hover:border-border", !s(E).enabled && "opacity-50"))]), u(P, $);
        });
        var Z = p(M, 2), U = d(Z);
        Cx(U, { class: "size-3.5 shrink-0 mt-0.5 opacity-60" }), u(F, B);
      };
      I(b, (F) => {
        s(n) ? F(w) : F(D, -1);
      });
    }
    u(m, h);
  }, $$slots: { default: true } }), j((m) => T(v, `${m ?? ""} active \u2014 plugins provide actions and handle sources.`), [() => s(r).filter((m) => m.enabled).length]), u(t, l), Fe();
}
var m5 = _('<div class="flex items-center justify-center py-16 text-muted-foreground gap-3"><div class="size-4 rounded-full border-2 border-border border-t-primary animate-spin"></div> <span class="text-xs">Scanning cache\u2026</span></div>'), h5 = _('<div class="flex items-center gap-2 text-amber-500/70 text-xs py-8"><!> Cache API is not available in this browser.</div>'), _5 = _('<span class="text-[0.6rem] text-muted-foreground/40 bg-muted/30 px-1.5 py-0.5 rounded font-mono"> </span>'), b5 = _('<p class="text-xs text-muted-foreground/50 py-4">No models cached yet.</p>'), x5 = _('<span class="text-muted-foreground/30"> </span>'), y5 = _('<span class="text-[0.7rem] text-muted-foreground/60 mr-1">Delete?</span> <button class="text-[0.7rem] text-muted-foreground/60 hover:text-foreground underline transition-colors">Cancel</button> <button class="text-[0.7rem] text-destructive hover:text-destructive/80 underline font-medium ml-2 disabled:opacity-40 transition-colors">Delete</button>', 1), w5 = _('<div class="size-3 rounded-full border border-border border-t-foreground animate-spin"></div>'), k5 = _('<div><div class="flex items-start gap-3 px-4 py-3"><div class="shrink-0 mt-0.5"><!></div> <div class="flex-1 min-w-0"><div class="flex items-center gap-2 flex-wrap"><span class="text-xs font-medium text-foreground"> </span> <!></div> <p class="text-[0.65rem] font-mono text-muted-foreground/40 mt-0.5 truncate"> </p> <div class="flex items-center gap-3 mt-1.5 flex-wrap"><span class="text-[0.65rem] text-muted-foreground/50 flex items-center gap-1"><!> <!></span> <span class="text-[0.65rem] text-muted-foreground/40"> </span></div></div> <div class="shrink-0 flex items-center gap-1"><!></div></div></div>'), S5 = _('<div class="flex flex-col gap-2"></div>'), T5 = _('<div class="flex items-center gap-3 px-4 py-2.5 rounded border border-border/30 bg-muted/5 opacity-60"><!> <div class="flex-1 min-w-0"><span class="text-xs text-muted-foreground/60"> </span> <span class="text-[0.65rem] text-muted-foreground/30 ml-2"> </span></div> <span class="text-[0.6rem] text-muted-foreground/30 font-mono truncate max-w-[140px]"> </span></div>'), A5 = _('<section class="flex flex-col gap-3"><h2 class="text-xs font-semibold tracking-tight text-muted-foreground/50">Available but not downloaded</h2> <div class="flex flex-col gap-1"></div></section>'), E5 = _(`<div class="flex items-start gap-2 px-3 py-2.5 rounded border border-border/20 bg-muted/10 text-[0.65rem] text-muted-foreground/40"><!> <span>Models are stored in the browser's <code class="font-mono">Cache API</code> (not OPFS).
              Deleting a model here only removes the cached weights \u2014 you can re-download it by loading it in the Chat view.</span></div>`), C5 = _('<div class="flex flex-col gap-8 max-w-2xl"><section class="flex flex-col gap-3"><div class="flex items-center gap-2"><h2 class="text-xs font-semibold tracking-tight text-foreground">Downloaded</h2> <!></div> <!></section> <!> <!></div>'), I5 = _('<div class="flex flex-col h-full overflow-hidden"><div class="flex items-center justify-between px-8 pt-5 pb-4 shrink-0 border-b border-border"><div><div class="flex items-center gap-2 mb-0.5"><h1 class="text-sm font-semibold tracking-tight text-foreground">Local Models</h1> <span class="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground/50">/ cache</span></div> <p class="text-xs text-muted-foreground">ONNX model weights cached in the browser via Transformers.js (<code class="font-mono text-[0.65rem]">transformers-cache</code>).</p></div> <!></div> <!></div>');
function P5(t, e) {
  Be(e, true);
  const r = "transformers-cache", n = "https://huggingface.co/";
  let a = te(nt([])), o = te(nt([])), i = te(true), l = te(null), c = te(null), f = te(true);
  function v(F) {
    return F === 0 ? "\u2014" : F < 1024 ? `${F} B` : F < 1024 * 1024 ? `${(F / 1024).toFixed(1)} KB` : F < 1024 * 1024 * 1024 ? `${(F / (1024 * 1024)).toFixed(1)} MB` : `${(F / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  }
  function x(F) {
    if (!F.startsWith(n)) return null;
    const B = F.slice(n.length), M = B.indexOf("/resolve/");
    return M === -1 ? null : B.slice(0, M);
  }
  async function m() {
    g(i, true);
    try {
      if (!("caches" in window)) {
        g(f, false);
        return;
      }
      const F = await caches.open(r), B = await F.keys(), M = /* @__PURE__ */ new Map();
      for (const P of B) {
        const E = x(P.url);
        if (!E) continue;
        M.has(E) || M.set(E, []);
        let S = 0;
        try {
          const $ = await F.match(P);
          $ && (S = (await $.blob()).size);
        } catch {
        }
        M.get(E).push({ url: P.url, bytes: S });
      }
      const Z = new Set(M.keys()), U = [];
      for (const [P, E] of M) {
        const S = On.find(($) => $.id === P);
        U.push({ id: P, name: (S == null ? void 0 : S.name) ?? null, declaredSize: (S == null ? void 0 : S.size) ?? null, files: E, totalBytes: E.reduce(($, J) => $ + J.bytes, 0), isKnown: !!S });
      }
      U.sort((P, E) => P.isKnown !== E.isKnown ? P.isKnown ? -1 : 1 : (P.name ?? P.id).localeCompare(E.name ?? E.id)), g(a, U, true), g(o, On.filter((P) => !Z.has(P.id)), true);
    } finally {
      g(i, false);
    }
  }
  async function y(F) {
    g(l, F, true), g(c, null);
    try {
      const B = await caches.open(r), M = await B.keys();
      await Promise.all(M.filter((Z) => x(Z.url) === F).map((Z) => B.delete(Z))), await m();
    } finally {
      g(l, null);
    }
  }
  Xt(m);
  var h = I5(), b = d(h), w = p(d(b), 2);
  {
    let F = H(() => Je(s(i) && "[&_svg]:animate-spin"));
    tt(w, { variant: "ghost", size: "icon-sm", onclick: m, title: "Refresh", get class() {
      return s(F);
    }, children: (B, M) => {
      ms(B, { class: "size-3.5" });
    }, $$slots: { default: true } });
  }
  var D = p(b, 2);
  jn(D, { class: "flex-1 min-h-0 px-8 py-6", children: (F, B) => {
    var M = ke(), Z = ae(M);
    {
      var U = (S) => {
        var $ = m5();
        u(S, $);
      }, P = (S) => {
        var $ = h5(), J = d($);
        yg(J, { class: "size-4 shrink-0" }), u(S, $);
      }, E = (S) => {
        var $ = C5(), J = d($), W = d(J), C = p(d(W), 2);
        {
          var A = (K) => {
            var R = _5(), L = d(R);
            j((G) => T(L, `${s(a).length ?? ""} model${s(a).length !== 1 ? "s" : ""} \xB7 ${G ?? ""} total`), [() => v(s(a).reduce((G, Q) => G + Q.totalBytes, 0))]), u(K, R);
          };
          I(C, (K) => {
            s(a).length > 0 && K(A);
          });
        }
        var k = p(W, 2);
        {
          var N = (K) => {
            var R = b5();
            u(K, R);
          }, O = (K) => {
            var R = S5();
            Ve(R, 21, () => s(a), (L) => L.id, (L, G) => {
              const Q = H(() => s(l) === s(G).id), re = H(() => s(c) === s(G).id);
              var ie = k5(), le = d(ie), ce = d(le), fe = d(ce);
              Cu(fe, { class: "size-3.5 text-muted-foreground/40" });
              var ve = p(ce, 2), be = d(ve), _e40 = d(be), xe = d(_e40), Ae = p(_e40, 2);
              {
                var Ee = (Ie) => {
                  Cr(Ie, { variant: "outline", class: "text-[0.6rem] px-1.5 py-0 text-amber-500/70 border-amber-500/30", children: (ze, Re) => {
                    var Le = Ue("legacy");
                    u(ze, Le);
                  }, $$slots: { default: true } });
                };
                I(Ae, (Ie) => {
                  s(G).isKnown || Ie(Ee);
                });
              }
              var Se = p(be, 2), Pe = d(Se), pe = p(Se, 2), de = d(pe), ue = d(de);
              Ex(ue, { class: "size-3" });
              var me = p(ue), we = p(me);
              {
                var ye = (Ie) => {
                  var ze = x5(), Re = d(ze);
                  j(() => T(Re, `(declared ${s(G).declaredSize ?? ""})`)), u(Ie, ze);
                }, Te = H(() => s(G).declaredSize && s(G).declaredSize !== v(s(G).totalBytes));
                I(we, (Ie) => {
                  s(Te) && Ie(ye);
                });
              }
              var Oe = p(de, 2), X = d(Oe), se = p(ve, 2), he = d(se);
              {
                var ge = (Ie) => {
                  var ze = y5(), Re = p(ae(ze), 2), Le = p(Re, 2);
                  j(() => Le.disabled = s(Q)), Ne("click", Re, () => g(c, null)), Ne("click", Le, () => y(s(G).id)), u(Ie, ze);
                }, $e = (Ie) => {
                  {
                    let ze = H(() => s(Q) || s(l) !== null);
                    tt(Ie, { variant: "ghost", size: "icon-sm", get disabled() {
                      return s(ze);
                    }, onclick: () => g(c, s(G).id, true), title: "Remove from cache", class: "text-muted-foreground/40 hover:text-destructive", children: (Re, Le) => {
                      var We = ke(), st = ae(We);
                      {
                        var gt = (dt) => {
                          var Jt = w5();
                          u(dt, Jt);
                        }, Lt = (dt) => {
                          Qo(dt, { class: "size-3.5" });
                        };
                        I(st, (dt) => {
                          s(Q) ? dt(gt) : dt(Lt, -1);
                        });
                      }
                      u(Re, We);
                    }, $$slots: { default: true } });
                  }
                };
                I(he, (Ie) => {
                  s(re) ? Ie(ge) : Ie($e, -1);
                });
              }
              j((Ie, ze, Re) => {
                rt(ie, 1, Ie), T(xe, ze), T(Pe, s(G).id), T(me, ` ${Re ?? ""} `), T(X, `${s(G).files.length ?? ""} file${s(G).files.length !== 1 ? "s" : ""}`);
              }, [() => Et(Je("rounded border transition-colors", s(re) ? "border-destructive/30 bg-destructive/5" : "border-border/50 bg-card")), () => s(G).name ?? s(G).id.split("/").pop(), () => v(s(G).totalBytes)]), u(L, ie);
            }), u(K, R);
          };
          I(k, (K) => {
            s(a).length === 0 ? K(N) : K(O, -1);
          });
        }
        var Y = p(J, 2);
        {
          var V = (K) => {
            var R = A5(), L = p(d(R), 2);
            Ve(L, 21, () => s(o), (G) => G.id, (G, Q) => {
              var re = T5(), ie = d(re);
              Cu(ie, { class: "size-3.5 text-muted-foreground/30 shrink-0" });
              var le = p(ie, 2), ce = d(le), fe = d(ce), ve = p(ce, 2), be = d(ve), _e40 = p(le, 2), xe = d(_e40);
              j((Ae) => {
                T(fe, s(Q).name), T(be, s(Q).size), T(xe, Ae);
              }, [() => s(Q).id.split("/").pop()]), u(G, re);
            }), u(K, R);
          };
          I(Y, (K) => {
            s(o).length > 0 && K(V);
          });
        }
        var q = p(Y, 2);
        {
          var ne = (K) => {
            var R = E5(), L = d(R);
            Ks(L, { class: "size-3.5 shrink-0 mt-0.5 text-muted-foreground/30" }), u(K, R);
          };
          I(q, (K) => {
            s(a).length > 0 && K(ne);
          });
        }
        u(S, $);
      };
      I(Z, (S) => {
        s(i) ? S(U) : s(f) ? S(E, -1) : S(P, 1);
      });
    }
    u(F, M);
  }, $$slots: { default: true } }), u(t, h), Fe();
}
Zt(["click"]);
var $5 = _('<div class="flex items-center justify-center py-16 text-muted-foreground gap-3"><div class="size-4 rounded-full border-2 border-border border-t-primary animate-spin"></div> <span class="text-xs">Loading\u2026</span></div>'), N5 = _('<span class="text-[0.6rem] text-amber-500/70 bg-amber-500/10 px-1.5 py-0.5 rounded">Storage API unavailable</span>'), R5 = _('<div class="flex flex-col items-center px-3 py-2.5 rounded border bg-card border-border/50"><span class="text-sm font-bold tabular-nums text-foreground"> </span> <span class="text-[0.6rem] uppercase tracking-wider text-muted-foreground/50 mt-0.5"> </span></div>'), M5 = _('<div class="flex items-center flex-wrap gap-2 px-3 py-2.5 rounded border border-destructive/20 bg-destructive/5 text-[0.7rem] text-muted-foreground/60"><span> </span> <button class="hover:text-foreground underline transition-colors">Cancel</button> <button class="text-destructive hover:text-destructive/80 underline font-medium disabled:opacity-40 transition-colors">Delete</button></div>'), z5 = _('<button class="flex flex-col items-start gap-0.5 px-3 py-2 rounded border border-transparent hover:bg-muted/20 hover:border-border/40 disabled:opacity-40 transition-colors w-full text-left"><span class="text-xs text-foreground/80 font-medium"> </span> <span class="text-[0.65rem] text-muted-foreground/40"> </span></button>'), O5 = _('<div class="grid grid-cols-3 sm:grid-cols-4 gap-2"><div class="flex flex-col items-center px-3 py-2.5 rounded border bg-card border-border/50"><span class="text-sm font-bold tabular-nums text-foreground"> </span> <span class="text-[0.6rem] uppercase tracking-wider text-muted-foreground/50 mt-0.5">Storage used</span></div> <!></div> <div class="flex flex-col gap-1"></div>', 1), D5 = _('<div class="flex flex-col items-center px-3 py-2.5 rounded border bg-card border-border/50"><span class="text-sm font-bold tabular-nums text-foreground"> </span> <span class="text-[0.6rem] uppercase tracking-wider text-muted-foreground/50 mt-0.5 text-center"> </span></div>'), L5 = _('<p class="text-[0.65rem] text-muted-foreground/40">Origin storage (IndexedDB + browser caches): <span class="font-mono"> </span></p>'), j5 = _('<div class="grid grid-cols-3 gap-2"></div> <!>', 1), B5 = _('<span class="inline-flex items-center gap-2 text-[0.7rem] text-muted-foreground/60 px-2 py-1 rounded border border-destructive/20 bg-destructive/5"> <button class="hover:text-foreground underline transition-colors">No</button> <button class="text-destructive hover:text-destructive/80 underline disabled:opacity-40 transition-colors">Yes</button></span>'), F5 = _('<button class="text-[0.7rem] px-2 py-1 rounded border border-border/40 text-muted-foreground/60 bg-muted/20 hover:text-destructive hover:border-destructive/30 disabled:opacity-40 transition-colors"> </button>'), U5 = _('<div class="flex flex-col gap-2"><span class="text-[0.6rem] font-bold uppercase tracking-wider text-muted-foreground/40">Clear by category</span> <div class="flex flex-wrap gap-1.5"></div></div>'), G5 = _('<div class="flex items-center flex-wrap gap-2 px-3 py-2.5 rounded border border-destructive/20 bg-destructive/5 text-[0.7rem] text-muted-foreground/60"><span> </span> <button class="hover:text-foreground underline transition-colors">Cancel</button> <button class="text-destructive hover:text-destructive/80 underline font-medium disabled:opacity-40 transition-colors">Delete</button></div>'), W5 = _('<button class="flex flex-col items-start gap-0.5 px-3 py-2 rounded border border-transparent hover:bg-muted/20 hover:border-border/40 disabled:opacity-40 transition-colors w-full text-left"><span class="text-xs text-foreground/80 font-medium"> </span> <span class="text-[0.65rem] text-muted-foreground/40"> </span></button>'), V5 = _(`<div class="flex items-start flex-wrap gap-2 px-3 py-2.5 rounded border border-destructive/40 bg-destructive/8 text-[0.7rem] text-muted-foreground/60"><span class="flex-1"><strong class="text-destructive/80 font-semibold">This cannot be undone.</strong> Deletes IndexedDB and caches, all cached
                model weights (Cache API), and localStorage. The page will reload
                fresh.</span> <div class="flex items-center gap-3 shrink-0"><button class="hover:text-foreground underline transition-colors">Cancel</button> <button class="text-destructive hover:text-destructive/80 underline font-semibold disabled:opacity-40 transition-colors">Wipe everything</button></div></div>`), H5 = _('<button class="flex flex-col items-start gap-0.5 px-3 py-2 rounded border border-destructive/20 hover:bg-destructive/8 hover:border-destructive/40 disabled:opacity-40 transition-colors w-full text-left"><span class="text-xs text-destructive/80 font-semibold">Wipe everything</span> <span class="text-[0.65rem] text-muted-foreground/40">IndexedDB \xB7 model cache \xB7 localStorage \u2014 full reset.</span></button>'), q5 = _('<div class="absolute inset-0 rounded bg-background/60 flex items-center justify-center backdrop-blur-sm z-10"><span class="text-xs text-muted-foreground">Working\u2026</span></div>'), Y5 = _('<div class="flex flex-col gap-8 max-w-2xl relative"><section class="flex flex-col gap-4"><div class="flex items-center gap-2"><h2 class="text-xs font-semibold tracking-tight text-foreground">IndexedDB</h2> <span class="text-[0.6rem] font-mono text-muted-foreground/40 bg-muted/30 px-1.5 py-0.5 rounded">me-ai</span> <!></div> <!></section> <div class="border-t border-border/40"></div> <section class="flex flex-col gap-4"><div class="flex items-center gap-2"><h2 class="text-xs font-semibold tracking-tight text-foreground">Cached data</h2> <span class="text-[0.6rem] text-muted-foreground/40 bg-muted/30 px-1.5 py-0.5 rounded font-mono">emails \xB7 classifications \xB7 contacts</span></div> <!> <!> <div class="flex flex-col gap-1"></div></section> <div class="border-t border-border/40"></div> <section class="flex flex-col gap-3"><h2 class="text-xs font-semibold tracking-tight text-muted-foreground/60 uppercase tracking-wider">Danger zone</h2> <!></section> <!></div>'), K5 = _('<div class="flex flex-col h-full overflow-hidden"><div class="flex items-center justify-between px-8 pt-5 pb-4 shrink-0 border-b border-border"><div><div class="flex items-center gap-2 mb-0.5"><h1 class="text-sm font-semibold tracking-tight text-foreground">Data Management</h1> <span class="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground/50">/ storage</span></div> <p class="text-xs text-muted-foreground">Manage local storage \u2014 emails, classifications, pipelines, audit trail.</p></div> <!></div> <!></div>');
function X5(t, e) {
  Be(e, true);
  let r = te(null), n = te(false), a = te(true), o = te(nt([])), i = te(null), l = te(null);
  async function c() {
    var _a10, _b4;
    g(a, true);
    try {
      const [w, D, F] = await Promise.all([ws().then((Z) => Number(Z ?? 0)), yi().then((Z) => Number(Z ?? 0)), xi().then((Z) => Number(Z ?? 0))]);
      let B = 0;
      try {
        B = ((_b4 = await ((_a10 = navigator.storage) == null ? void 0 : _a10.estimate())) == null ? void 0 : _b4.usage) ?? 0;
      } catch {
      }
      g(l, { emailCount: w, classCount: D, contactCount: F, idbBytes: B }, true), g(i, await cv(), true);
      const M = await as();
      g(o, M.order, true);
    } finally {
      g(a, false);
    }
  }
  Xt(c);
  function f(w) {
    return w ? w < 1024 ? `${w} B` : w < 1024 * 1024 ? `${(w / 1024).toFixed(1)} KB` : `${(w / (1024 * 1024)).toFixed(1)} MB` : "\u2014";
  }
  async function v(w) {
    g(n, true), g(r, null);
    try {
      await w(), await c();
    } finally {
      g(n, false);
    }
  }
  function x(w) {
    return w.split("_").map((D) => D.charAt(0) + D.slice(1).toLowerCase()).join(" ");
  }
  var m = K5(), y = d(m), h = p(d(y), 2);
  {
    let w = H(() => Je(s(a) && "[&_svg]:animate-spin"));
    tt(h, { variant: "ghost", size: "icon-sm", onclick: c, title: "Refresh", get class() {
      return s(w);
    }, children: (D, F) => {
      ms(D, { class: "size-3.5" });
    }, $$slots: { default: true } });
  }
  var b = p(y, 2);
  jn(b, { class: "flex-1 min-h-0 px-8 py-6", children: (w, D) => {
    var F = ke(), B = ae(F);
    {
      var M = (U) => {
        var P = $5();
        u(U, P);
      }, Z = (U) => {
        var P = Y5(), E = d(P), S = d(E), $ = p(d(S), 4);
        {
          var J = (Q) => {
            var re = N5();
            u(Q, re);
          };
          I($, (Q) => {
            s(i) && !s(i).supported && Q(J);
          });
        }
        var W = p(S, 2);
        {
          var C = (Q) => {
            var re = O5(), ie = ae(re), le = d(ie), ce = d(le), fe = d(ce), ve = p(le, 2);
            Ve(ve, 16, () => [{ key: "sm_rules", label: "Rules" }, { key: "sm_events", label: "Events" }, { key: "items", label: "Emails" }], Qe, (_e40, xe) => {
              var Ae = R5(), Ee = d(Ae), Se = d(Ee), Pe = p(Ee, 2), pe = d(Pe);
              j(() => {
                T(Se, s(i).tables[xe.key] ?? 0), T(pe, xe.label);
              }), u(_e40, Ae);
            });
            var be = p(ie, 2);
            Ve(be, 20, () => [{ key: "clear-audit", label: "Clear execution log", desc: "Delete all auditLog entries (Event Stream / pipeline execution history).", action: () => v(() => J_()) }, { key: "clear-all", label: "Clear all data", desc: "Reset pipelines, rules, events, emails and classifications from IndexedDB.", action: () => v(() => dv()) }], Qe, (_e40, xe) => {
              var Ae = ke(), Ee = ae(Ae);
              {
                var Se = (pe) => {
                  var de = M5(), ue = d(de), me = d(ue), we = p(ue, 2), ye = p(we, 2);
                  j((Te) => {
                    T(me, `Delete ${Te ?? ""}?`), ye.disabled = s(n);
                  }, [() => xe.label.toLowerCase()]), Ne("click", we, () => g(r, null)), Ne("click", ye, function(...Te) {
                    var _a10;
                    (_a10 = xe.action) == null ? void 0 : _a10.apply(this, Te);
                  }), u(pe, de);
                }, Pe = (pe) => {
                  var de = z5(), ue = d(de), me = d(ue), we = p(ue, 2), ye = d(we);
                  j(() => {
                    de.disabled = s(n), T(me, xe.label), T(ye, xe.desc);
                  }), Ne("click", de, () => g(r, xe.key, true)), u(pe, de);
                };
                I(Ee, (pe) => {
                  s(r) === xe.key ? pe(Se) : pe(Pe, -1);
                });
              }
              u(_e40, Ae);
            }), j((_e40) => T(fe, _e40), [() => f(s(i).usageBytes)]), u(Q, re);
          };
          I(W, (Q) => {
            s(i) && Q(C);
          });
        }
        var A = p(E, 4), k = p(d(A), 2);
        {
          var N = (Q) => {
            var re = j5(), ie = ae(re);
            Ve(ie, 21, () => [{ label: "Emails", val: s(l).emailCount }, { label: "Classifications", val: s(l).classCount }, { label: "Contacts", val: s(l).contactCount }], Qe, (fe, ve) => {
              var be = D5(), _e40 = d(be), xe = d(_e40), Ae = p(_e40, 2), Ee = d(Ae);
              j(() => {
                T(xe, s(ve).val), T(Ee, s(ve).label);
              }), u(fe, be);
            });
            var le = p(ie, 2);
            {
              var ce = (fe) => {
                var ve = L5(), be = p(d(ve)), _e40 = d(be);
                j((xe) => T(_e40, xe), [() => f(s(l).idbBytes)]), u(fe, ve);
              };
              I(le, (fe) => {
                s(l).idbBytes > 0 && fe(ce);
              });
            }
            u(Q, re);
          };
          I(k, (Q) => {
            s(l) && Q(N);
          });
        }
        var O = p(k, 2);
        {
          var Y = (Q) => {
            var re = U5(), ie = p(d(re), 2);
            Ve(ie, 21, () => s(o), Qe, (le, ce) => {
              var fe = ke(), ve = ae(fe);
              {
                var be = (xe) => {
                  var Ae = B5(), Ee = d(Ae), Se = p(Ee), Pe = p(Se, 2);
                  j((pe) => {
                    T(Ee, `Delete ${pe ?? ""}? `), Pe.disabled = s(n);
                  }, [() => x(s(ce))]), Ne("click", Se, () => g(r, null)), Ne("click", Pe, () => v(() => Oc(s(ce)))), u(xe, Ae);
                }, _e40 = (xe) => {
                  var Ae = F5(), Ee = d(Ae);
                  j((Se) => {
                    Ae.disabled = s(n), T(Ee, `${Se ?? ""} \u2715`);
                  }, [() => x(s(ce))]), Ne("click", Ae, () => g(r, `category:${s(ce)}`)), u(xe, Ae);
                };
                I(ve, (xe) => {
                  s(r) === `category:${s(ce)}` ? xe(be) : xe(_e40, -1);
                });
              }
              u(le, fe);
            }), u(Q, re);
          };
          I(O, (Q) => {
            s(o).length > 0 && Q(Y);
          });
        }
        var V = p(O, 2);
        Ve(V, 20, () => [{ key: "classifications", label: "Clear all classifications", desc: "Remove all LLM scan results. Emails stay.", action: () => v(() => Ib()) }, { key: "emails", label: "Clear all email data", desc: "Wipes emails from IndexedDB (Rexie), then reloads.", action: () => {
          g(r, null), g(n, true), vv();
        } }, { key: "contacts", label: "Clear contacts", desc: "Remove extracted contacts from the database.", action: () => v(async () => {
          await Hp();
        }) }], Qe, (Q, re) => {
          var ie = ke(), le = ae(ie);
          {
            var ce = (ve) => {
              var be = G5(), _e40 = d(be), xe = d(_e40), Ae = p(_e40, 2), Ee = p(Ae, 2);
              j((Se) => {
                T(xe, `Delete ${Se ?? ""}?`), Ee.disabled = s(n);
              }, [() => re.label.toLowerCase()]), Ne("click", Ae, () => g(r, null)), Ne("click", Ee, function(...Se) {
                var _a10;
                (_a10 = re.action) == null ? void 0 : _a10.apply(this, Se);
              }), u(ve, be);
            }, fe = (ve) => {
              var be = W5(), _e40 = d(be), xe = d(_e40), Ae = p(_e40, 2), Ee = d(Ae);
              j(() => {
                be.disabled = s(n), T(xe, re.label), T(Ee, re.desc);
              }), Ne("click", be, () => g(r, re.key, true)), u(ve, be);
            };
            I(le, (ve) => {
              s(r) === re.key ? ve(ce) : ve(fe, -1);
            });
          }
          u(Q, ie);
        });
        var q = p(A, 4), ne = p(d(q), 2);
        {
          var K = (Q) => {
            var re = V5(), ie = p(d(re), 2), le = d(ie), ce = p(le, 2);
            j(() => ce.disabled = s(n)), Ne("click", le, () => g(r, null)), Ne("click", ce, async () => {
              g(n, true), g(r, null);
              try {
                await q_();
              } catch (fe) {
                g(n, false), console.error(fe), alert("Error wiping data: " + (fe instanceof Error ? fe.message : String(fe)));
              }
            }), u(Q, re);
          }, R = (Q) => {
            var re = H5();
            j(() => re.disabled = s(n)), Ne("click", re, () => g(r, "nuke-all")), u(Q, re);
          };
          I(ne, (Q) => {
            s(r) === "nuke-all" ? Q(K) : Q(R, -1);
          });
        }
        var L = p(q, 2);
        {
          var G = (Q) => {
            var re = q5();
            u(Q, re);
          };
          I(L, (Q) => {
            s(n) && Q(G);
          });
        }
        u(U, P);
      };
      I(B, (U) => {
        s(a) ? U(M) : U(Z, -1);
      });
    }
    u(w, F);
  }, $$slots: { default: true } }), u(t, m), Fe();
}
Zt(["click"]);
var Z5 = _('<span class="text-[0.55rem] font-mono px-1.5 py-0.5 rounded bg-primary/10 text-primary"> </span>'), J5 = _('<div class="flex flex-wrap gap-1 mt-1"></div>'), Q5 = _('<div class="mt-1.5"><button type="button" class="text-[0.6rem] text-muted-foreground hover:text-foreground"><!> </button> <!></div>'), e3 = _('<div class="flex items-start gap-3 px-4 py-2.5 hover:bg-muted/20 transition-colors"><div class="size-8 rounded flex items-center justify-center text-sm shrink-0 bg-muted"> </div> <div class="flex-1 min-w-0"><div class="flex items-center gap-2 flex-wrap"><span class="text-sm font-medium text-foreground"> </span> <code class="text-[0.6rem] text-muted-foreground font-mono"> </code></div> <p class="text-xs text-muted-foreground mt-0.5"> </p> <!></div></div>'), t3 = _('<div class="border-t border-border"><!></div>'), r3 = _('<div class="divide-y divide-border"></div> <!>', 1), n3 = _('<div class="rounded-lg border border-border bg-card overflow-hidden"><button type="button" class="flex items-center justify-between w-full px-4 py-3 bg-muted/30 border-b border-border hover:bg-muted/50 transition-colors text-left"><div class="flex items-center gap-2"><span class="text-[0.7rem] text-muted-foreground w-4 shrink-0"> </span> <span class="text-sm font-semibold text-foreground"> </span> <code class="text-[0.65rem] text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded"> </code> <span class="text-[0.6rem] font-medium text-success">\u25CF active</span></div> <span class="text-xs text-muted-foreground"> </span></button> <!></div>'), a3 = _('<div class="py-12 text-center text-muted-foreground text-sm">No plugins registered. Add plugins in <code class="bg-muted px-1 rounded">me-ai-core/src/plugins</code>.</div>'), s3 = _('<div class="flex flex-col h-full overflow-hidden"><div class="px-6 pt-5 pb-4 shrink-0 border-b border-border"><h1 class="text-sm font-semibold tracking-tight text-foreground">Plugin Registry</h1> <p class="text-xs text-muted-foreground mt-1"> </p></div> <div class="flex-1 min-h-0 overflow-y-auto px-6 pb-6"><div class="flex flex-col gap-4 py-4"><!> <!></div></div></div>');
function o3(t, e) {
  Be(e, true);
  const r = H(() => {
    try {
      const B = Zp();
      return Array.isArray(B) ? B.map((M) => ({ id: M.pluginId ?? "", name: M.pluginName ?? "", actions: (M.actions ?? []).map((Z) => ({ id: Z.actionId ?? "", name: Z.name ?? "", description: Z.description ?? "", scopes: Z.requiredScopes || [] })) })) : [];
    } catch {
      return [];
    }
  }), n = H(() => s(r).reduce((B, M) => B + M.actions.length, 0)), a = { mark_read: "\u2713", mark_unread: "\u25CB", star: "\u2605", unstar: "\u2606", trash: "\u{1F5D1}", delete: "\u2715", mark_spam: "\u26A0", archive: "\u2193", apply_label: "\u{1F3F7}", remove_label: "\u{1F3F7}", mark_important: "!", mark_not_important: "\u2013", read_file: "\u{1F4C4}", write_file: "\u270F", list_dir: "\u{1F4C1}", create_file: "\u2795", delete_file: "\u{1F5D1}" };
  let o = te(nt(/* @__PURE__ */ new Set())), i = te(nt(/* @__PURE__ */ new Set()));
  function l(B) {
    const M = new Set(s(i));
    M.has(B) ? M.delete(B) : M.add(B), g(i, M, true);
  }
  function c(B) {
    const M = new Set(s(o));
    M.has(B) ? M.delete(B) : M.add(B), g(o, M, true);
  }
  function f(B) {
    return B.replace(/^https?:\/\/[^/]+\/auth\//, "");
  }
  var v = s3(), x = d(v), m = p(d(x), 2), y = d(m), h = p(x, 2), b = d(h), w = d(b);
  Ve(w, 17, () => s(r), Qe, (B, M) => {
    const Z = H(() => s(i).has(s(M).id));
    var U = n3(), P = d(U), E = d(P), S = d(E), $ = d(S), J = p(S, 2), W = d(J), C = p(J, 2), A = d(C), k = p(E, 2), N = d(k), O = p(P, 2);
    {
      var Y = (V) => {
        var q = r3(), ne = ae(q);
        Ve(ne, 21, () => s(M).actions, Qe, (L, G) => {
          const Q = H(() => `${s(M).id}:${s(G).id}`), re = H(() => s(o).has(s(Q)));
          var ie = e3(), le = d(ie), ce = d(le), fe = p(le, 2), ve = d(fe), be = d(ve), _e40 = d(be), xe = p(be, 2), Ae = d(xe), Ee = p(ve, 2), Se = d(Ee), Pe = p(Ee, 2);
          {
            var pe = (de) => {
              var ue = Q5(), me = d(ue), we = d(me);
              {
                var ye = (he) => {
                  var ge = Ue("\u25BE");
                  u(he, ge);
                }, Te = (he) => {
                  var ge = Ue("\u25B8");
                  u(he, ge);
                };
                I(we, (he) => {
                  s(re) ? he(ye) : he(Te, -1);
                });
              }
              var Oe = p(we), X = p(me, 2);
              {
                var se = (he) => {
                  var ge = J5();
                  Ve(ge, 21, () => s(G).scopes, Qe, ($e, Ie) => {
                    var ze = Z5(), Re = d(ze);
                    j((Le) => {
                      br(ze, "title", s(Ie)), T(Re, Le);
                    }, [() => f(s(Ie))]), u($e, ze);
                  }), u(he, ge);
                };
                I(X, (he) => {
                  s(re) && he(se);
                });
              }
              j(() => T(Oe, ` ${s(G).scopes.length ?? ""} scope${s(G).scopes.length === 1 ? "" : "s"}`)), Ne("click", me, () => c(s(Q))), u(de, ue);
            };
            I(Pe, (de) => {
              s(G).scopes.length && de(pe);
            });
          }
          j(() => {
            T(ce, a[s(G).id] ?? "\xB7"), T(_e40, s(G).name), T(Ae, s(G).id), T(Se, s(G).description);
          }), u(L, ie);
        });
        var K = p(ne, 2);
        {
          var R = (L) => {
            var G = t3(), Q = d(G);
            Sm(Q, {}), u(L, G);
          };
          I(K, (L) => {
            s(M).id === "filesystem" && L(R);
          });
        }
        u(V, q);
      };
      I(O, (V) => {
        s(Z) && V(Y);
      });
    }
    j(() => {
      T($, s(Z) ? "\u25BE" : "\u25B8"), T(W, s(M).name), T(A, s(M).id), T(N, `${s(M).actions.length ?? ""} action${s(M).actions.length === 1 ? "" : "s"}`);
    }), Ne("click", P, () => l(s(M).id)), u(B, U);
  });
  var D = p(w, 2);
  {
    var F = (B) => {
      var M = a3();
      u(B, M);
    };
    I(D, (B) => {
      s(r).length === 0 && B(F);
    });
  }
  j(() => T(y, `${s(r).length ?? ""} plugin${s(r).length === 1 ? "" : "s"} \xB7 ${s(n) ?? ""} actions available.
      No LLM required to view or configure.`)), u(t, v), Fe();
}
Zt(["click"]);
var i3 = _('<span class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-primary rounded-full"></span>'), l3 = _('<button><!> <!> <span class="flex-1 tracking-tight"> </span></button>'), c3 = _('<div class="flex flex-1 min-h-0 overflow-hidden"><aside class="w-48 shrink-0 flex flex-col bg-sidebar border-r border-sidebar-border overflow-hidden"><div class="px-4 pt-4 pb-2 shrink-0"><span class="text-[0.6rem] font-semibold uppercase tracking-widest text-muted-foreground/40">Dashboard</span></div> <nav class="flex flex-col flex-1 overflow-y-auto py-1"></nav></aside> <main class="flex-1 min-h-0 overflow-hidden flex flex-col bg-background"><!></main></div>');
function d3(t, e) {
  Be(e, true);
  let r = te("models");
  const n = [{ id: "models", label: "Local Models", icon: Tx }, { id: "data", label: "Data Management", icon: $l }, { id: "plugins", label: "Plugins", icon: Px }];
  var a = c3(), o = d(a), i = p(d(o), 2);
  Ve(i, 21, () => n, Qe, (m, y) => {
    var h = l3(), b = d(h);
    {
      var w = (M) => {
        var Z = i3();
        u(M, Z);
      };
      I(b, (M) => {
        s(r) === s(y).id && M(w);
      });
    }
    var D = p(b, 2);
    dr(D, () => s(y).icon, (M, Z) => {
      Z(M, { class: "size-3.5 shrink-0" });
    });
    var F = p(D, 2), B = d(F);
    j((M) => {
      rt(h, 1, M), T(B, s(y).label);
    }, [() => Et(Je("relative flex items-center gap-2.5 px-4 py-2 text-sm transition-colors text-left w-full", s(r) === s(y).id ? "text-foreground font-medium bg-sidebar-accent" : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"))]), Ne("click", h, () => {
      g(r, s(y).id, true);
    }), u(m, h);
  });
  var l = p(o, 2), c = d(l);
  {
    var f = (m) => {
      P5(m, {});
    }, v = (m) => {
      X5(m, {});
    }, x = (m) => {
      o3(m, {});
    };
    I(c, (m) => {
      s(r) === "models" ? m(f) : s(r) === "data" ? m(v, 1) : s(r) === "plugins" && m(x, 2);
    });
  }
  u(t, a), Fe();
}
Zt(["click"]);
const lf = (t) => {
  var e = u3();
  u(t, e);
};
var u3 = dn('<svg class="size-4 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"></path><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"></path><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"></path><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"></path></svg>'), f3 = _("<!> Go to Sources", 1), p3 = _('<div class="flex items-center gap-3 p-3 rounded border border-success/25 bg-success/8"><!> <div class="flex-1 min-w-0"><p class="text-sm font-medium text-foreground">Connected</p> <p class="text-xs text-muted-foreground truncate"> </p></div> <!></div> <div class="flex flex-col gap-2"><!> <!></div>', 1), v3 = _('<div class="flex flex-col items-center gap-3 py-4"><!> <p class="text-sm text-muted-foreground">Opening Google sign-in\u2026</p></div>'), g3 = _("<!> Try again", 1), m3 = _('<div class="flex items-start gap-3 p-3 rounded border border-destructive/25 bg-destructive/8"><!> <div class="flex-1 min-w-0"><p class="text-sm font-medium text-destructive">Authentication failed</p> <p class="text-xs text-muted-foreground mt-0.5 break-words"> </p></div></div> <!>', 1), h3 = _("<!> Sign in with Google", 1), _3 = _(`<div class="flex flex-col gap-3"><p class="text-sm text-muted-foreground leading-relaxed">Sign in with Google to let me-ai read and manage your Gmail messages
            for automated pipeline processing.</p> <div class="rounded border border-border bg-muted/40 p-3 flex flex-col gap-1.5 text-xs text-muted-foreground"><div class="flex items-center gap-2"><span class="size-1 rounded-full bg-success shrink-0"></span> Read and modify Gmail messages</div> <div class="flex items-center gap-2"><span class="size-1 rounded-full bg-success shrink-0"></span> Token stored locally \u2014 never sent to any server</div> <div class="flex items-center gap-2"><span class="size-1 rounded-full bg-success shrink-0"></span> Revoke access at any time from Google Account settings</div></div></div> <!> <p class="text-center text-[0.65rem] text-muted-foreground/60">Client ID: <span class="font-mono"> </span></p>`, 1), b3 = _('<div class="flex flex-col items-center justify-center min-h-full p-8"><div class="w-full max-w-md flex flex-col gap-6"><div class="flex flex-col items-center gap-3 text-center"><div class="size-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center"><!></div> <div><h1 class="text-xl font-semibold tracking-tight text-foreground">Google OAuth</h1> <p class="text-sm text-muted-foreground mt-1">Authorize me-ai to access your Gmail messages</p></div></div> <div class="rounded-lg border border-border bg-card p-6 flex flex-col gap-5"><!></div> <a href="#home" class="text-center text-xs text-muted-foreground hover:text-foreground transition-colors no-underline">\u2190 Back to Home</a></div></div>');
function x3(t, e) {
  Be(e, true);
  const r = "562478245230-1gohf6dtsajqo1lu3kge9k7cthm4sdv6.apps.googleusercontent.com";
  let n = te("idle"), a = te(""), o = te(null), i = te(0), l = te(false);
  async function c() {
    try {
      await Sl(r), g(l, true), await _a() && Cc() && (g(o, await sr("gmail-profile"), true), g(i, Math.floor(kl() / 6e4), true), g(n, "success"));
    } catch (U) {
      g(a, U instanceof Error ? U.message : String(U), true), g(n, "error");
    }
  }
  async function f() {
    g(n, "loading"), g(a, "");
    try {
      await jv(), g(o, await sr("gmail-profile"), true), g(i, Math.floor(kl() / 6e4), true), g(n, "success");
    } catch (U) {
      g(a, U instanceof Error ? U.message : String(U), true), g(n, "error");
    }
  }
  async function v() {
    const U = await _a();
    U && await Bv(U.access_token), g(o, null), g(i, 0), g(n, "idle");
  }
  Xt(c);
  var x = b3(), m = d(x), y = d(m), h = d(y), b = d(h);
  gs(b, { class: "size-6 text-primary" });
  var w = p(y, 2), D = d(w);
  {
    var F = (U) => {
      var P = p3(), E = ae(P), S = d(E);
      ss(S, { class: "size-4 text-success shrink-0" });
      var $ = p(S, 2), J = p(d($), 2), W = d(J), C = p($, 2);
      Cr(C, { variant: "outline", class: "text-success border-success/30 bg-success/10 shrink-0 text-[0.6rem]", children: (O, Y) => {
        var V = Ue();
        j(() => T(V, `${s(i) ?? ""}m left`)), u(O, V);
      }, $$slots: { default: true } });
      var A = p(E, 2), k = d(A);
      tt(k, { href: "#sources", class: "w-full gap-2", children: (O, Y) => {
        var V = f3(), q = ae(V);
        wg(q, { class: "size-3.5" }), u(O, V);
      }, $$slots: { default: true } });
      var N = p(k, 2);
      tt(N, { variant: "ghost", onclick: v, class: "w-full text-muted-foreground", children: (O, Y) => {
        var V = Ue("Disconnect");
        u(O, V);
      }, $$slots: { default: true } }), j(() => T(W, s(o).emailAddress ?? "Gmail account")), u(U, P);
    }, B = (U) => {
      var P = v3(), E = d(P);
      fo(E, { class: "size-5 text-primary animate-spin" }), u(U, P);
    }, M = (U) => {
      var P = m3(), E = ae(P), S = d(E);
      _g(S, { class: "size-4 text-destructive shrink-0 mt-0.5" });
      var $ = p(S, 2), J = p(d($), 2), W = d(J), C = p(E, 2);
      {
        let A = H(() => !s(l));
        tt(C, { onclick: f, class: "w-full gap-2", get disabled() {
          return s(A);
        }, children: (k, N) => {
          var O = g3(), Y = ae(O);
          lf(Y), u(k, O);
        }, $$slots: { default: true } });
      }
      j(() => T(W, s(a))), u(U, P);
    }, Z = (U) => {
      var P = _3(), E = p(ae(P), 2);
      {
        let W = H(() => !s(l));
        tt(E, { onclick: f, class: "w-full gap-2.5", get disabled() {
          return s(W);
        }, children: (C, A) => {
          var k = h3(), N = ae(k);
          lf(N), u(C, k);
        }, $$slots: { default: true } });
      }
      var S = p(E, 2), $ = p(d(S)), J = d($);
      j((W) => T(J, `${W ?? ""}\u2026`), [() => r.slice(0, 30)]), u(U, P);
    };
    I(D, (U) => {
      s(n) === "success" && s(o) ? U(F) : s(n) === "loading" ? U(B, 1) : s(n) === "error" ? U(M, 2) : U(Z, -1);
    });
  }
  u(t, x), Fe();
}
const cf = (t) => {
  var e = y3();
  u(t, e);
};
var y3 = dn('<svg class="size-4 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"></path><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"></path><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"></path><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"></path></svg>'), w3 = _('<div class="flex flex-col items-center gap-3 py-4"><!> <p class="text-sm text-muted-foreground">Processing authentication\u2026</p></div>'), k3 = _("<!> Go to Sources", 1), S3 = _('<div class="flex items-center gap-3 p-3 rounded border border-success/25 bg-success/8"><!> <div class="flex-1 min-w-0"><p class="text-sm font-medium text-foreground">Successfully authenticated</p> <p class="text-xs text-muted-foreground mt-0.5"> </p></div></div> <div class="flex flex-col gap-2"><!> <!></div>', 1), T3 = _("<!> Try again", 1), A3 = _('<div class="flex items-start gap-3 p-3 rounded border border-destructive/25 bg-destructive/8"><!> <div class="flex-1 min-w-0"><p class="text-sm font-medium text-destructive">Authentication failed</p> <p class="text-xs text-muted-foreground mt-0.5 break-words"> </p></div></div> <!>', 1), E3 = _("<!> Sign in with Google (redirect)", 1), C3 = _(`<div class="flex flex-col gap-3"><p class="text-sm text-muted-foreground leading-relaxed">This flow redirects you to Google and back. Useful in environments
            where popups are blocked (e.g. Cursor's embedded browser).</p> <div class="rounded border border-border bg-muted/40 p-3 flex flex-col gap-1.5 text-xs text-muted-foreground"><div class="flex items-center gap-2"><span class="size-1 rounded-full bg-primary shrink-0"></span> Click the button \u2014 you'll be redirected to Google</div> <div class="flex items-center gap-2"><span class="size-1 rounded-full bg-primary shrink-0"></span> After approval, you'll land back here automatically</div> <div class="flex items-center gap-2"><span class="size-1 rounded-full bg-primary shrink-0"></span> Token is saved locally and the app is ready to use</div></div></div> <!> <p class="text-center text-xs text-muted-foreground">Prefer popups? <a href="#auth" class="text-primary hover:underline no-underline">Use the standard flow</a></p>`, 1), I3 = _('<div class="flex flex-col items-center justify-center min-h-full p-8"><div class="w-full max-w-md flex flex-col gap-6"><div class="flex flex-col items-center gap-3 text-center"><div class="size-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center"><!></div> <div><h1 class="text-xl font-semibold tracking-tight text-foreground">Google OAuth</h1> <p class="text-sm text-muted-foreground mt-1">Redirect-based sign-in flow</p></div></div> <div class="rounded-lg border border-border bg-card p-6 flex flex-col gap-5"><!></div> <a href="#home" class="text-center text-xs text-muted-foreground hover:text-foreground transition-colors no-underline">\u2190 Back to Home</a></div></div>');
function P3(t, e) {
  Be(e, true);
  const r = "me-ai:oauth-token";
  let n = te("idle"), a = te(""), o = te(0), i = te(false);
  function l() {
    const Z = window.location.href, U = Z.indexOf("#", Z.indexOf("#") + 1);
    if (U === -1) return {};
    const P = Z.slice(U + 1);
    return Object.fromEntries(new URLSearchParams(P));
  }
  async function c() {
    g(n, "processing");
    const Z = l();
    if (Z.error) {
      g(a, Z.error_description ? decodeURIComponent(Z.error_description) : Z.error, true), g(n, "error");
      return;
    }
    if (!Z.access_token || !Z.expires_in) {
      g(n, "idle");
      return;
    }
    try {
      const U = parseInt(Z.expires_in, 10), P = Date.now() + U * 1e3;
      await _r(r, { access_token: Z.access_token, expires_at: P }), g(o, Math.floor(U / 60), true), g(i, true), history.replaceState(null, "", window.location.pathname + "#oauth-redirect");
    } catch {
      g(i, false);
    }
    g(n, "success");
  }
  function f() {
    const Z = "562478245230-1gohf6dtsajqo1lu3kge9k7cthm4sdv6.apps.googleusercontent.com", U = window.location.origin + window.location.pathname + "#oauth-redirect";
    return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(Z)}&redirect_uri=${encodeURIComponent(U)}&response_type=token&scope=${encodeURIComponent("https://www.googleapis.com/auth/gmail.modify")}&prompt=consent`;
  }
  Xt(c);
  var v = I3(), x = d(v), m = d(x), y = d(m), h = d(y);
  gs(h, { class: "size-6 text-primary" });
  var b = p(m, 2), w = d(b);
  {
    var D = (Z) => {
      var U = w3(), P = d(U);
      fo(P, { class: "size-5 text-primary animate-spin" }), u(Z, U);
    }, F = (Z) => {
      var U = S3(), P = ae(U), E = d(P);
      ss(E, { class: "size-4 text-success shrink-0" });
      var S = p(E, 2), $ = p(d(S), 2), J = d($), W = p(P, 2), C = d(W);
      tt(C, { href: "#sources", class: "w-full gap-2", children: (k, N) => {
        var O = k3(), Y = ae(O);
        gs(Y, { class: "size-3.5" }), u(k, O);
      }, $$slots: { default: true } });
      var A = p(C, 2);
      tt(A, { variant: "outline", href: "#home", class: "w-full", children: (k, N) => {
        var O = Ue("Back to Home");
        u(k, O);
      }, $$slots: { default: true } }), j(() => T(J, `Token saved \xB7 ${s(o) ?? ""} minutes remaining \xB7
              ${s(i) ? "stored \u2713" : "storage failed \u2717"}`)), u(Z, U);
    }, B = (Z) => {
      var U = A3(), P = ae(U), E = d(P);
      _g(E, { class: "size-4 text-destructive shrink-0 mt-0.5" });
      var S = p(E, 2), $ = p(d(S), 2), J = d($), W = p(P, 2);
      {
        let C = H(f);
        tt(W, { get href() {
          return s(C);
        }, class: "w-full gap-2.5", children: (A, k) => {
          var N = T3(), O = ae(N);
          cf(O), u(A, N);
        }, $$slots: { default: true } });
      }
      j(() => T(J, s(a))), u(Z, U);
    }, M = (Z) => {
      var U = C3(), P = p(ae(U), 2);
      {
        let E = H(f);
        tt(P, { get href() {
          return s(E);
        }, class: "w-full gap-2.5", children: (S, $) => {
          var J = E3(), W = ae(J);
          cf(W), u(S, J);
        }, $$slots: { default: true } });
      }
      u(Z, U);
    };
    I(w, (Z) => {
      s(n) === "processing" ? Z(D) : s(n) === "success" ? Z(F, 1) : s(n) === "error" ? Z(B, 2) : Z(M, -1);
    });
  }
  u(t, v), Fe();
}
let Xr = null, hn = "idle", Wn = null, Kr = /* @__PURE__ */ new Set();
function zs() {
  return typeof Worker > "u" ? Promise.reject(new Error("Web Workers are not supported in this environment")) : (Xr || (Xr = (async () => {
    const t = new Worker(new URL("/me-ai/assets/llm-worker-DdwtBPfP.js", import.meta.url), { type: "module" });
    t.onmessage = (r) => {
      const n = r.data;
      if (n.status === "loading" && (hn = "loading"), n.status === "ready" && (hn = "ready"), n.status === "start" && (hn = "generating"), (n.status === "complete" || n.status === "error") && (hn = Wn ? "ready" : "idle"), n.status === "status-report") {
        if (n.loaded && n.modelId) {
          Wn = n.modelId, hn = "ready";
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
function sl() {
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
      if (Xr && Wn != null && Wn !== t) {
        try {
          (await Xr).terminate();
        } catch {
        }
        Xr = null, Wn = null;
      }
      Wn = t, (await zs()).postMessage({ type: "load", modelId: t, options: e });
    } catch (r) {
      hn = "idle", Wn = null;
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
      const f = (x) => {
        switch (x.status) {
          case "start":
            c = x.inputTokens || 0;
            break;
          case "thinking":
          case "thinking-done":
            break;
          case "update":
            if (o += x.output ?? "", i = x.tps ?? i, l = x.numTokens ?? l, r) try {
              r({ tps: i, numTokens: l, text: o });
            } catch {
            }
            break;
          case "complete":
            v(), n({ text: o, tps: i, numTokens: l, inputTokens: c });
            break;
          case "error":
            v(), a(new Error(x.data));
            break;
        }
      }, v = () => Kr.delete(f);
      Kr.add(f), zs().then((x) => {
        x.postMessage({ type: "generate", data: t, options: e });
      }).catch((x) => {
        v(), a(x);
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
    return Wn;
  }, async terminate() {
    if (Xr) try {
      (await Xr).terminate();
    } catch {
    }
    Xr = null, hn = "idle", Wn = null, Kr.clear();
  } };
}
const df = "http://localhost:11434", $3 = "https://me-ai.metaelon.space";
function Tm() {
  try {
    const t = window.location.hostname;
    return t === "localhost" || t === "127.0.0.1" || t === "0.0.0.0" ? df : $3;
  } catch {
    return df;
  }
}
function xo() {
  return Tm();
}
async function N3() {
  const { getSetting: t } = await wr(async () => {
    const { getSetting: e } = await Promise.resolve().then(() => un);
    return { getSetting: e };
  }, void 0);
  return await t("ollamaUrl") || Tm();
}
async function R3(t) {
  const { setSetting: e } = await wr(async () => {
    const { setSetting: r } = await Promise.resolve().then(() => un);
    return { setSetting: r };
  }, void 0);
  await e("ollamaUrl", t);
}
async function Yl(t = xo()) {
  var _a10, _b4;
  try {
    const e = await fetch(`${t}/api/version`, { method: "GET", signal: AbortSignal.timeout(5e3) });
    return e.ok ? { connected: true, version: (await e.json()).version } : { connected: false, error: `HTTP ${e.status}` };
  } catch (e) {
    const r = e;
    return ((_a10 = r.message) == null ? void 0 : _a10.includes("CORS")) || ((_b4 = r.message) == null ? void 0 : _b4.includes("Failed to fetch")) || r.name === "TypeError" ? { connected: false, corsError: true, error: "CORS error: Server must allow requests from this origin. Configure Access-Control-Allow-Origin header." } : { connected: false, error: r.name === "TimeoutError" ? "Connection timeout" : r.message ?? String(e) };
  }
}
async function M3(t = xo()) {
  const e = await fetch(`${t}/api/tags`, { method: "GET", signal: AbortSignal.timeout(1e4) });
  if (!e.ok) throw new Error(`Failed to list models: HTTP ${e.status}`);
  return (await e.json()).models ?? [];
}
async function z3(t, e, r = {}, n = () => {
}, a = xo()) {
  var _a10;
  const { temperature: o = 0.7, maxTokens: i = 4096, keepAlive: l } = r, c = { model: t, messages: e, stream: true, options: { temperature: o, num_predict: i } };
  c.keep_alive = l !== void 0 ? l : "10m";
  const f = new AbortController(), v = setTimeout(() => f.abort(), 3e5), x = await fetch(`${a}/api/chat`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(c), signal: f.signal });
  if (clearTimeout(v), !x.ok) {
    const b = await x.text();
    throw new Error(`Ollama API error: ${b}`);
  }
  const m = x.body.getReader(), y = new TextDecoder();
  let h = "";
  try {
    for (; ; ) {
      const { done: b, value: w } = await m.read();
      if (b) break;
      const F = y.decode(w).split(`
`).filter(Boolean);
      for (const B of F) try {
        const M = JSON.parse(B);
        if (((_a10 = M.message) == null ? void 0 : _a10.content) && (h += M.message.content, n({ content: M.message.content, done: false, total_duration: M.total_duration, eval_count: M.eval_count, eval_duration: M.eval_duration })), M.done) {
          n({ content: "", done: true, total_duration: M.total_duration, eval_count: M.eval_count, eval_duration: M.eval_duration });
          break;
        }
      } catch {
      }
    }
  } finally {
    m.releaseLock();
  }
  return h;
}
let Vr = "idle", es = null;
const da = /* @__PURE__ */ new Set();
function vn(t) {
  for (const e of da) try {
    e(t);
  } catch {
  }
}
function O3() {
  return { async check() {
    Vr = "loading", vn({ status: "loading", data: "Testing Ollama connection..." });
    const t = await Yl();
    t.connected ? (Vr = "idle", vn({ status: "ready", data: { type: "ollama", version: t.version, url: xo() } })) : (Vr = "idle", vn({ status: "error", data: `Ollama not available: ${t.error}. Make sure Ollama is running.` }));
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
      await z3(es, t, { temperature: e.temperature ?? 0.7, maxTokens: e.maxTokens ?? 4096 }, (a) => {
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
      const f = (v) => {
        switch (v.status) {
          case "start":
            c = v.inputTokens ?? 0;
            break;
          case "update":
            if (o += v.output ?? "", i = v.tps ?? i, l = v.numTokens ?? l, r) try {
              r({ tps: i, numTokens: l, text: o });
            } catch {
            }
            break;
          case "complete":
            da.delete(f), n({ text: o, tps: i, numTokens: l, inputTokens: c });
            break;
          case "error":
            da.delete(f), a(new Error(v.data ?? "Unknown error"));
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
let Er = "idle", Os = null, ts = null, Ds = null, ua = /* @__PURE__ */ new Set(), Tn = null;
function Br(t) {
  for (const e of ua) try {
    e(t);
  } catch {
  }
}
function D3(t) {
  return { async check() {
    Er = "loading", Ds = t, Br({ status: "loading", data: `Checking ${t} connection...` });
    const e = await sr(`${t}ApiKey`);
    if (!e) {
      Er = "idle", Br({ status: "error", data: `${t} API key not found. Please configure it in settings.` });
      return;
    }
    try {
      await uv(t, e) ? (Er = "idle", Br({ status: "ready", data: { type: "api", provider: t } })) : (Er = "idle", Br({ status: "error", data: `${t} connection failed.` }));
    } catch (r) {
      Er = "idle", Br({ status: "error", data: `${t} connection failed: ${r instanceof Error ? r.message : String(r)}` });
    }
  }, async loadModel(e) {
    var _a10;
    const n = ((_a10 = xl(e)) == null ? void 0 : _a10.name) ?? e;
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
    Tn = new AbortController();
    try {
      const o = Os ? xl(Os) : null, i = { temperature: r.temperature ?? 0.7, maxTokens: r.maxTokens ?? 4096, reasoningEffort: o == null ? void 0 : o.reasoningEffort }, l = e.map((c) => ({ role: c.role, content: c.content ?? "" }));
      await fv(Ds, ts, l, i, (c) => {
        if (!(Tn == null ? void 0 : Tn.signal.aborted)) if (c.done) {
          Er = "ready";
          const f = (performance.now() - a) / 1e3, v = f > 0 ? n / f : null;
          Br({ status: "complete", tps: v !== null ? Math.round(v * 10) / 10 : null, numTokens: c.outputTokens ?? n, inputTokens: c.inputTokens ?? 0 });
        } else {
          n++;
          const f = performance.now() - a, v = f > 0 ? n / f * 1e3 : 0;
          Br({ status: "update", output: c.content, tps: Math.round(v * 10) / 10, numTokens: n });
        }
      });
    } catch (o) {
      (Tn == null ? void 0 : Tn.signal.aborted) ? (Er = "ready", Br({ status: "complete", tps: null, numTokens: n })) : (Er = "ready", Br({ status: "error", data: o instanceof Error ? o.message : String(o) }));
    } finally {
      Tn = null;
    }
  }, generateFull(e, r, n) {
    return new Promise((a, o) => {
      let i = "", l = null, c = 0, f = 0;
      const v = (x) => {
        switch (x.status) {
          case "start":
            f = x.inputTokens ?? 0;
            break;
          case "update":
            if (i += x.output ?? "", l = x.tps ?? l, c = x.numTokens ?? c, n) try {
              n({ tps: l, numTokens: c, text: i });
            } catch {
            }
            break;
          case "complete":
            ua.delete(v), a({ text: i, tps: l, numTokens: c, inputTokens: f });
            break;
          case "error":
            ua.delete(v), o(new Error(x.data ?? "Unknown error"));
            break;
        }
      };
      ua.add(v), this.generate(e, r);
    });
  }, interrupt() {
    Tn && Tn.abort();
  }, reset() {
    Tn && Tn.abort();
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
    Er = "idle", Os = null, ts = null, Tn && Tn.abort(), ua.clear();
  } };
}
function Am(t) {
  const { core: e } = vi(Oa);
  if (!e) return null;
  try {
    return e.getApiModelInfo(t);
  } catch {
    return null;
  }
}
let Un = null, Vt = null;
const ol = /* @__PURE__ */ new Set();
function L3(t) {
  if (t.startsWith("onnx-community/") || t.startsWith("microsoft/")) return "webgpu";
  const e = Am(t);
  return e ? e.provider : "ollama";
}
function Hd() {
  return { loadModel(t, e = {}) {
    const r = L3(t);
    if (Un !== r) {
      Vt && Vt.terminate(), Un = r, r === "webgpu" ? Vt = sl() : r === "ollama" ? Vt = O3() : Vt = D3(r);
      for (const n of ol) Vt.onMessage(n);
    }
    Vt.loadModel(t, e);
  }, check() {
    Vt || (Vt = sl(), Un = "webgpu"), Vt.check();
  }, generate(t, e) {
    if (!Vt) throw new Error("No engine loaded. Call loadModel() first.");
    Vt.generate(t, e);
  }, generateFull(t, e, r) {
    return Vt ? Vt.generateFull(t, e, r) : Promise.reject(new Error("No engine loaded. Call loadModel() first."));
  }, clearCache(t) {
    return Un === "webgpu" && (Vt == null ? void 0 : Vt.clearCache) ? Vt.clearCache(t) : Promise.resolve();
  }, interrupt() {
    Vt == null ? void 0 : Vt.interrupt();
  }, reset() {
    Vt == null ? void 0 : Vt.reset();
  }, onMessage(t) {
    return Vt || (Vt = sl(), Un = "webgpu"), ol.add(t), Vt.onMessage(t);
  }, offMessage(t) {
    ol.delete(t), Vt == null ? void 0 : Vt.offMessage(t);
  }, get status() {
    return (Vt == null ? void 0 : Vt.status) ?? "idle";
  }, get isReady() {
    return (Vt == null ? void 0 : Vt.isReady) ?? false;
  }, get isGenerating() {
    return (Vt == null ? void 0 : Vt.isGenerating) ?? false;
  }, get modelId() {
    return (Vt == null ? void 0 : Vt.modelId) ?? null;
  }, get backend() {
    return Un;
  }, getModelInfo() {
    const t = this.modelId;
    return t ? Un === "webgpu" ? Si(t) : Un === "ollama" ? zc(t) : Am(t) : null;
  }, terminate() {
    Vt == null ? void 0 : Vt.terminate(), Vt = null, Un = null;
  } };
}
async function j3() {
  const t = await a2();
  if (!t) return null;
  const e = ["You have access to the user's locally stored data.", t, "The user can ask you about their emails. If they do, you can see recent emails and search results that will be provided."], r = await li();
  if (r && r.total > 0) {
    const n = Object.keys(r.categories).map((a) => `${a} (${r.categories[a].length})`).join(", ");
    e.push(`Pending emails awaiting manual execution: ${n}.`, "If the user asks you to execute or handle a pending category, append [EXECUTE:CATEGORY:EVENT_TYPE] to the end of your response.", "If the user asks to SEE or MANAGE their events/emails/noise, append [SHOW:DASHBOARD] to the end of your response to spawn a visual dashboard for them.");
  }
  return e.join(" ");
}
async function B3(t) {
  const e = [], r = await s2();
  e.push(r);
  const n = await li();
  if (n && n.total > 0) {
    const a = Object.keys(n.categories).map((o) => `- ${o}: ${n.categories[o].length} emails`);
    e.push("", "## Pending Actions (Triage)", "The user has the following emails awaiting manual execution:", ...a, "", "## AI Control Actions", "If the user asks you to execute, process, or handle pending emails by category, you MUST output a special command tag at the very end of your response: [EXECUTE:CATEGORY:EVENT_TYPE]", "If the user asks to SEE, MANAGE, or REVIEW their events/noise/emails visually, output this tag at the very end of your response: [SHOW:DASHBOARD]", "Only output these tags if the user explicitly requests or confirms the action.");
  }
  if (t) {
    const a = await i2(t, 5);
    e.push("", "## Relevant Emails", a);
  } else {
    const a = await o2(5);
    e.push("", "## Recent Emails", a);
  }
  return e.join(`
`);
}
var F3 = _('<button><span class="text-2xl leading-none shrink-0"> </span> <div class="flex-1 min-w-0"><div> </div> <div class="text-xs text-muted-foreground"> </div></div></button>'), U3 = _('<p class="mt-2.5 px-3 py-2 text-xs text-warning bg-warning/8 border border-warning/20 rounded text-center">WebGPU not available in this browser. Use Ollama or upgrade your browser.</p>'), G3 = _('<div class="w-full mb-4"><p class="text-[0.68rem] font-bold uppercase tracking-widest text-foreground/50 text-left mb-3">AI Backend</p> <div class="flex flex-col gap-3"><div class="grid grid-cols-2 gap-3"></div> <!></div> <!></div>');
function W3(t, e) {
  Be(e, true);
  let r = oe(e, "backend", 15, "webgpu"), n = oe(e, "isWebGPUAvailable", 3, true);
  const a = [{ id: "webgpu", icon: "\u{1F537}", label: "WebGPU", desc: "Browser, private, no server", disabled: !n() }, { id: "ollama", icon: "\u{1F999}", label: "Ollama", desc: "Local server, larger models" }, { id: "cloud", icon: "\u2601\uFE0F", label: "Cloud APIs", desc: "ChatGPT, Claude, Gemini, Grok" }];
  var o = G3();
  {
    const x = (m, y = ut) => {
      var h = F3(), b = d(h), w = d(b), D = p(b, 2), F = d(D), B = d(F), M = p(F, 2), Z = d(M);
      j((U, P) => {
        h.disabled = y().disabled, rt(h, 1, U), T(w, y().icon), rt(F, 1, P), T(B, y().label), T(Z, y().desc);
      }, [() => Et(Je("flex items-center gap-3 p-3.5 text-left rounded border transition-all w-full", "disabled:opacity-40 disabled:cursor-not-allowed", r() === y().id ? "bg-primary/8 border-primary/40" : "bg-card border-border hover:bg-accent hover:border-primary/25")), () => Et(Je("text-sm font-semibold tracking-tight mb-0.5", r() === y().id ? "text-primary" : "text-foreground"))]), Ne("click", h, () => r(y().id)), u(m, h);
    };
    var i = p(d(o), 2), l = d(i);
    Ve(l, 21, () => a.slice(0, 2), Qe, (m, y) => {
      x(m, () => s(y));
    });
    var c = p(l, 2);
    Ve(c, 17, () => a.slice(2), Qe, (m, y) => {
      x(m, () => s(y));
    });
    var f = p(i, 2);
    {
      var v = (m) => {
        var y = U3();
        u(m, y);
      };
      I(f, (m) => {
        !n() && r() === "webgpu" && m(v);
      });
    }
  }
  u(t, o), Fe();
}
Zt(["click"]);
function rn(t, e) {
  Be(e, true);
  let r = oe(e, "ref", 15, null), n = ft(e, ["$$slots", "$$events", "$$legacy", "ref", "class"]);
  var a = ke(), o = ae(a);
  {
    let i = H(() => Je("flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50", e.class));
    dr(o, () => P1, (l, c) => {
      c(l, et({ "data-slot": "label", get class() {
        return s(i);
      } }, () => n, { get ref() {
        return r();
      }, set ref(f) {
        r(f);
      } }));
    });
  }
  u(t, a), Fe();
}
var V3 = _("<div><!></div>");
function Na(t, e) {
  Be(e, true);
  let r = oe(e, "ref", 15, null), n = ft(e, ["$$slots", "$$events", "$$legacy", "ref", "class", "children"]);
  var a = V3();
  Gt(a, (i) => ({ "data-slot": "card", class: i, ...n }), [() => Je("bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm", e.class)]);
  var o = d(a);
  bt(o, () => e.children ?? ut), Qn(a, (i) => r(i), () => r()), u(t, a), Fe();
}
var H3 = _("<div><!></div>");
function Ra(t, e) {
  Be(e, true);
  let r = oe(e, "ref", 15, null), n = ft(e, ["$$slots", "$$events", "$$legacy", "ref", "class", "children"]);
  var a = H3();
  Gt(a, (i) => ({ "data-slot": "card-content", class: i, ...n }), [() => Je("px-6", e.class)]);
  var o = d(a);
  bt(o, () => e.children ?? ut), Qn(a, (i) => r(i), () => r()), u(t, a), Fe();
}
var q3 = _("<option> </option>"), Y3 = _("<optgroup></optgroup>"), K3 = _('<p class="text-xs text-muted-foreground/60 italic"> </p>'), X3 = _("<option> </option>"), Z3 = _("<option> </option>"), J3 = _('<th class="text-left px-3 py-2 text-[0.6rem] font-bold uppercase tracking-wider text-muted-foreground/40 border-b border-border"> </th>'), Q3 = _('<span class="text-success">\u2705</span>'), eT = _('<span class="text-warning">\u26A0\uFE0F</span>'), tT = _('<span class="text-destructive">\u274C</span>'), rT = _('<tr><td class="px-3 py-2 font-medium text-foreground border-b border-border/50"> <!></td><td class="px-3 py-2 tabular-nums border-b border-border/50"><strong class="text-foreground"> </strong></td><td class="px-3 py-2 tabular-nums text-muted-foreground border-b border-border/50"> </td><td class="px-3 py-2 border-b border-border/50"><!></td></tr>'), nT = _('<tr><td colspan="4" class="px-3 pt-3 pb-1 text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground/40"> </td></tr> <!>', 1), aT = _('<div class="overflow-x-auto max-h-[260px] overflow-y-auto"><table class="w-full text-xs border-collapse"><thead class="sticky top-0 bg-card"><tr></tr></thead><tbody></tbody></table></div> <p class="px-3 pt-2 pb-1 text-[0.62rem] text-muted-foreground/40 leading-relaxed"><strong class="opacity-80">Context</strong> = max input. <strong class="opacity-80">Email Limit</strong> = WebGPU safe limit. \u2705 Recommended \xB7 \u26A0\uFE0F Limited \xB7 \u274C May fail</p>', 1), sT = _('<div class="flex justify-between text-xs"><span class="text-muted-foreground/50"> </span> <span class="text-foreground/75 text-right"> </span></div>'), oT = _('<div class="flex items-center gap-2 text-xs font-semibold text-success mb-2"><span class="size-2 rounded-full bg-success shrink-0"></span> WebGPU Active</div> <div class="flex flex-col gap-1"></div>', 1), iT = _('<p class="text-sm text-destructive"> </p> <!>', 1), lT = _('<div class="w-full flex flex-col items-center gap-5 text-center"><div class="w-full text-left flex flex-col gap-1.5"><!> <select id="model-select" class="w-full h-9 px-3 rounded border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"></select> <!></div> <div class="w-full grid grid-cols-2 gap-3 text-left"><div class="flex flex-col gap-1"><!> <select id="dtype-select" class="w-full h-9 px-3 rounded border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"></select></div> <div class="flex flex-col gap-1"><!> <select id="device-select" class="w-full h-9 px-3 rounded border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"></select></div></div> <details class="w-full group"><summary class="flex items-center gap-2 px-3 py-2 rounded border border-border bg-card text-xs font-semibold uppercase tracking-wider text-muted-foreground/50 cursor-pointer hover:bg-accent transition-colors list-none"><svg class="size-3 transition-transform group-open:rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg> Model Capabilities</summary> <!></details> <!> <!> <!></div>');
function cT(t, e) {
  Be(e, true);
  const r = [{ value: "q4f16", label: "q4f16 (recommended)" }, { value: "q4", label: "q4 (smaller)" }, { value: "fp16", label: "fp16 (best quality)" }], n = [{ value: "webgpu", label: "WebGPU" }, { value: "wasm", label: "WASM" }];
  let a = oe(e, "selectedModel", 15), o = oe(e, "loadDtype", 15, "q4f16"), i = oe(e, "loadDevice", 15, "webgpu"), l = oe(e, "gpuInfo", 3, null), c = oe(e, "error", 3, null);
  const f = H(() => On.find((A) => A.id === a()));
  Xt(() => qa("ModelSelector"));
  var v = lT(), x = d(v), m = d(x);
  rn(m, { for: "model-select", class: "text-[0.68rem] uppercase tracking-wider opacity-60", children: (A, k) => {
    var N = Ue("Choose Model");
    u(A, N);
  }, $$slots: { default: true } });
  var y = p(m, 2);
  Ve(y, 21, () => Ko, Qe, (A, k) => {
    var N = Y3();
    Ve(N, 21, () => s(k).models, Qe, (O, Y) => {
      var V = q3(), q = d(V), ne = {};
      j(() => {
        T(q, `${s(k).label ?? ""} ${s(Y).name ?? ""} \u2014 ${s(Y).size ?? ""}`), ne !== (ne = s(Y).id) && (V.value = (V.__value = s(Y).id) ?? "");
      }), u(O, V);
    }), j(() => br(N, "label", s(k).label)), u(A, N);
  });
  var h = p(y, 2);
  {
    var b = (A) => {
      var k = K3(), N = d(k);
      j(() => T(N, s(f).description)), u(A, k);
    };
    I(h, (A) => {
      s(f) && A(b);
    });
  }
  var w = p(x, 2), D = d(w), F = d(D);
  rn(F, { for: "dtype-select", class: "text-[0.68rem] uppercase tracking-wider opacity-60", children: (A, k) => {
    var N = Ue("Dtype");
    u(A, N);
  }, $$slots: { default: true } });
  var B = p(F, 2);
  Ve(B, 21, () => r, Qe, (A, k) => {
    var N = X3(), O = d(N), Y = {};
    j(() => {
      T(O, s(k).label), Y !== (Y = s(k).value) && (N.value = (N.__value = s(k).value) ?? "");
    }), u(A, N);
  });
  var M = p(D, 2), Z = d(M);
  rn(Z, { for: "device-select", class: "text-[0.68rem] uppercase tracking-wider opacity-60", children: (A, k) => {
    var N = Ue("Device");
    u(A, N);
  }, $$slots: { default: true } });
  var U = p(Z, 2);
  Ve(U, 21, () => n, Qe, (A, k) => {
    var N = Z3(), O = d(N), Y = {};
    j(() => {
      T(O, s(k).label), Y !== (Y = s(k).value) && (N.value = (N.__value = s(k).value) ?? "");
    }), u(A, N);
  });
  var P = p(w, 2), E = p(d(P), 2);
  Na(E, { class: "mt-1 w-full text-left", children: (A, k) => {
    Ra(A, { class: "pt-0 pb-2 px-0", children: (N, O) => {
      var Y = aT(), V = ae(Y), q = d(V), ne = d(q), K = d(ne);
      Ve(K, 20, () => ["Model", "Context", "Email Limit", "Status"], Qe, (L, G) => {
        var Q = J3(), re = d(Q);
        j(() => T(re, G)), u(L, Q);
      });
      var R = p(ne);
      Ve(R, 21, () => Ko, Qe, (L, G) => {
        var Q = nT(), re = ae(Q), ie = d(re), le = d(ie), ce = p(re, 2);
        Ve(ce, 17, () => s(G).models, Qe, (fe, ve) => {
          var be = rT(), _e40 = d(be), xe = d(_e40), Ae = p(xe);
          {
            var Ee = (X) => {
              Cr(X, { variant: "outline", class: "ml-1 text-[0.5rem] h-3.5 px-1 py-0 text-primary border-primary/30", children: (se, he) => {
                var ge = Ue("current");
                u(se, ge);
              }, $$slots: { default: true } });
            };
            I(Ae, (X) => {
              s(ve).id === a() && X(Ee);
            });
          }
          var Se = p(_e40), Pe = d(Se), pe = d(Pe), de = p(Se), ue = d(de), me = p(de), we = d(me);
          {
            var ye = (X) => {
              var se = Q3();
              u(X, se);
            }, Te = (X) => {
              var se = eT();
              u(X, se);
            }, Oe = (X) => {
              var se = tT();
              u(X, se);
            };
            I(we, (X) => {
              s(ve).recommendedForEmailProcessing ? X(ye) : s(ve).maxEmailTokens >= 6e3 ? X(Te, 1) : X(Oe, -1);
            });
          }
          j((X, se, he) => {
            rt(be, 1, X), T(xe, `${s(G).label ?? ""} ${s(ve).name ?? ""} `), T(pe, `${se ?? ""}k`), T(ue, `~${he ?? ""}k`);
          }, [() => Et(Je("transition-colors", s(ve).id === a() ? "bg-primary/5" : "hover:bg-accent")), () => (s(ve).contextWindow / 1024).toFixed(0), () => (s(ve).maxEmailTokens / 1e3).toFixed(0)]), u(fe, be);
        }), j(() => T(le, s(G).label)), u(L, Q);
      }), u(N, Y);
    }, $$slots: { default: true } });
  }, $$slots: { default: true } });
  var S = p(P, 2);
  {
    var $ = (A) => {
      Na(A, { class: "w-full text-left", children: (k, N) => {
        Ra(k, { class: "pt-3 pb-3 px-4", children: (O, Y) => {
          var V = oT(), q = p(ae(V), 2);
          Ve(q, 21, () => {
            var _a10;
            return [["Vendor", l().vendor], ["Architecture", l().architecture], ...((_a10 = l().limits) == null ? void 0 : _a10.maxBufferSize) ? [["Max Buffer", Tl(l().limits.maxBufferSize)]] : []];
          }, Qe, (ne, K) => {
            var R = H(() => mf(s(K), 2));
            let L = () => s(R)[0], G = () => s(R)[1];
            var Q = sT(), re = d(Q), ie = d(re), le = p(re, 2), ce = d(le);
            j(() => {
              T(ie, L()), T(ce, G());
            }), u(ne, Q);
          }), u(O, V);
        }, $$slots: { default: true } });
      }, $$slots: { default: true } });
    };
    I(S, (A) => {
      l() && A($);
    });
  }
  var J = p(S, 2);
  {
    var W = (A) => {
      var k = iT(), N = ae(k), O = d(N), Y = p(N, 2);
      tt(Y, { variant: "outline", get onclick() {
        return e.onclearcache;
      }, class: "w-full text-xs", children: (V, q) => {
        var ne = Ue("Clear cache & retry");
        u(V, ne);
      }, $$slots: { default: true } }), j(() => T(O, c())), u(A, k);
    };
    I(J, (A) => {
      c() && A(W);
    });
  }
  var C = p(J, 2);
  {
    let A = H(() => !!c());
    tt(C, { get onclick() {
      return e.onload;
    }, get disabled() {
      return s(A);
    }, class: "w-full", children: (k, N) => {
      var O = Ue("Load Model");
      u(k, O);
    }, $$slots: { default: true } });
  }
  Ne("change", y, () => {
    var _a10;
    return (_a10 = e.onclearerror) == null ? void 0 : _a10.call(e);
  }), Mn(y, a), Mn(B, o), Mn(U, i), u(t, v), Fe();
}
Zt(["change"]);
var dT = _("Ollama Server URL <!>", 1), uT = _("<span> </span>"), fT = _('<div class="mt-1 text-[0.65rem] leading-relaxed opacity-80"><strong class="text-destructive block mb-1">Fix CORS Error:</strong> <ul class="list-disc pl-4 space-y-0.5"><li>Cloudflare: Add Transform Rule setting <code class="bg-black/20 px-1 rounded font-mono"></code></li> <li>Or set <code class="bg-black/20 px-1 rounded font-mono"></code> on your server</li> <li>Testing locally: Use <code class="bg-black/20 px-1 rounded font-mono">http://localhost:5173</code></li></ul></div>'), pT = _("<span> </span> <!>", 1), vT = _('<div><span></span> <div class="flex flex-col gap-1"><!></div></div>'), gT = _('<div class="flex flex-col gap-1.5"><!> <div class="flex gap-2"><!> <!></div></div> <!>', 1), mT = _("<option> </option>"), hT = _("<option> </option>"), _T = _("<span>\xB7</span> <span> </span>", 1), bT = _('<p class="text-xs text-warning/80 bg-warning/6 border border-warning/15 rounded px-2 py-1.5">Not installed. Run: <code class="font-mono bg-black/20 px-1 rounded"> </code></p>'), xT = _('<p class="text-xs text-success bg-success/6 border border-success/15 rounded px-2 py-1.5">\u2713 Model installed and ready</p>'), yT = _('<div class="flex flex-col gap-1.5"><p class="text-xs text-muted-foreground"> </p> <div class="flex items-center gap-1.5 text-[0.68rem] text-muted-foreground/50"><span class="tabular-nums"> </span> <span>\xB7</span> <span> </span> <!></div> <!></div>'), wT = _('<div class="flex flex-col gap-1.5"><!> <select id="ollama-model" class="w-full h-9 px-3 rounded border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"><optgroup label="Recommended (ollama pull MODEL_NAME)"></optgroup><optgroup label="Other Models"></optgroup></select></div> <!>', 1), kT = _('<th class="text-left px-3 py-2 text-[0.6rem] font-bold uppercase tracking-wider text-muted-foreground/40 border-b border-border"> </th>'), ST = _('<span class="ml-1 text-success text-[0.65rem]">\u2713</span>'), TT = _('<span class="text-success mr-1">\u2705</span>'), AT = _('<tr><td class="px-3 py-1.5 font-medium text-foreground border-b border-border/50"> <!> <!></td><td class="px-3 py-1.5 tabular-nums text-muted-foreground border-b border-border/50"><strong class="text-foreground"> </strong></td><td class="px-3 py-1.5 tabular-nums text-muted-foreground border-b border-border/50"> </td><td class="px-3 py-1.5 text-muted-foreground/60 border-b border-border/50"><!> </td></tr>'), ET = _('<div class="overflow-x-auto"><table class="w-full text-xs border-collapse"><thead><tr></tr></thead><tbody></tbody></table></div> <p class="px-3 pt-2 pb-1 text-[0.62rem] text-muted-foreground/40">\u2713 = installed. Install: <code class="font-mono bg-muted px-1 rounded">ollama pull MODEL_NAME</code></p>', 1), CT = _('<p class="text-sm text-destructive text-center"> </p>'), IT = _('<div class="flex flex-col gap-5 w-full max-w-[520px] mx-auto"><!> <!> <details class="group"><summary class="flex items-center gap-2 px-3 py-2 rounded border border-border bg-card text-xs font-semibold uppercase tracking-wider text-muted-foreground/50 cursor-pointer hover:bg-accent transition-colors list-none"><svg class="size-3 transition-transform group-open:rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg> Ollama Model Capabilities</summary> <!></details> <!> <!></div>');
function PT(t, e) {
  Be(e, true);
  let r = oe(e, "selectedModel", 15), n = oe(e, "error", 15);
  const a = typeof window < "u" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
  let o = te(nt(xo())), i = te(false), l = te(null), c = te(nt([])), f = te(false);
  Ut(() => {
    N3().then((E) => {
      g(o, E, true), v();
    });
  });
  async function v() {
    g(i, true), g(l, null);
    const E = await Yl(s(o));
    g(l, E, true), g(i, false), E.connected && x();
  }
  async function x() {
    g(f, true);
    try {
      const E = await M3(s(o));
      g(c, E.map((S) => S.name), true);
    } catch {
      g(c, [], true);
    }
    g(f, false);
  }
  function m() {
    R3(s(o)), v();
  }
  function y() {
    if (!r()) {
      n("Please select a model");
      return;
    }
    e.onload();
  }
  function h(E) {
    return s(c).length > 0 && s(c).includes(E);
  }
  const b = Vv();
  var w = IT(), D = d(w);
  Na(D, { children: (E, S) => {
    Ra(E, { class: "pt-4 pb-4 px-4 flex flex-col gap-3", children: ($, J) => {
      var W = gT(), C = ae(W), A = d(C);
      rn(A, { for: "ollama-url", class: "text-[0.68rem] uppercase tracking-wider opacity-60", children: (q, ne) => {
        var K = dT(), R = p(ae(K));
        Cr(R, { variant: "outline", class: "ml-1.5 text-[0.55rem] h-4 px-1.5 normal-case tracking-normal", children: (L, G) => {
          var Q = Ue();
          j(() => T(Q, a ? "\u{1F5A5} local" : "\u2601\uFE0F remote")), u(L, Q);
        }, $$slots: { default: true } }), u(q, K);
      }, $$slots: { default: true } });
      var k = p(A, 2), N = d(k);
      {
        let q = H(() => a ? "http://localhost:11434" : "https://your-server.example.com");
        $n(N, { id: "ollama-url", type: "text", onchange: m, get placeholder() {
          return s(q);
        }, class: "font-mono text-xs", get value() {
          return s(o);
        }, set value(ne) {
          g(o, ne, true);
        } });
      }
      var O = p(N, 2);
      tt(O, { variant: "outline", size: "sm", onclick: v, get disabled() {
        return s(i);
      }, class: "shrink-0", children: (q, ne) => {
        var K = Ue();
        j(() => T(K, s(i) ? "Testing\u2026" : "Test")), u(q, K);
      }, $$slots: { default: true } });
      var Y = p(C, 2);
      {
        var V = (q) => {
          var ne = vT(), K = d(ne), R = p(K, 2), L = d(R);
          {
            var G = (re) => {
              var ie = uT(), le = d(ie);
              j(() => T(le, `Connected \xB7 v${s(l).version ?? ""}`)), u(re, ie);
            }, Q = (re) => {
              var ie = pT(), le = ae(ie), ce = d(le), fe = p(le, 2);
              {
                var ve = (be) => {
                  var _e40 = fT(), xe = p(d(_e40), 2), Ae = d(xe), Ee = p(d(Ae));
                  Ee.textContent = `Access-Control-Allow-Origin: ${window.location.origin ?? ""}`;
                  var Se = p(Ae, 2), Pe = p(d(Se));
                  Pe.textContent = `OLLAMA_ORIGINS=${window.location.origin ?? ""}`, u(be, _e40);
                };
                I(fe, (be) => {
                  s(l).corsError && be(ve);
                });
              }
              j(() => T(ce, `Disconnected: ${s(l).error ?? ""}`)), u(re, ie);
            };
            I(L, (re) => {
              s(l).connected ? re(G) : re(Q, -1);
            });
          }
          j((re, ie) => {
            rt(ne, 1, re), rt(K, 1, ie);
          }, [() => Et(Je("flex items-start gap-2 px-3 py-2 rounded border text-xs", s(l).connected ? "text-success border-success/20 bg-success/8" : "text-destructive border-destructive/20 bg-destructive/8")), () => Et(Je("size-1.5 rounded-full shrink-0 mt-0.5", s(l).connected ? "bg-success" : "bg-destructive"))]), u(q, ne);
        };
        I(Y, (q) => {
          s(l) && q(V);
        });
      }
      u($, W);
    }, $$slots: { default: true } });
  }, $$slots: { default: true } });
  var F = p(D, 2);
  Na(F, { children: (E, S) => {
    Ra(E, { class: "pt-4 pb-4 px-4 flex flex-col gap-3", children: ($, J) => {
      var W = wT(), C = ae(W), A = d(C);
      rn(A, { for: "ollama-model", class: "text-[0.68rem] uppercase tracking-wider opacity-60", children: (q, ne) => {
        var K = Ue("Choose Model");
        u(q, K);
      }, $$slots: { default: true } });
      var k = p(A, 2), N = d(k);
      Ve(N, 21, () => b, Qe, (q, ne) => {
        var K = mT(), R = d(K), L = {};
        j((G, Q) => {
          T(R, `${s(ne).displayName ?? ""} (${s(ne).params ?? ""}) \u2013 ${G ?? ""}k ctx${Q ?? ""}`), L !== (L = s(ne).name) && (K.value = (K.__value = s(ne).name) ?? "");
        }, [() => (s(ne).contextWindow / 1024).toFixed(0), () => h(s(ne).name) ? " \u2713" : ""]), u(q, K);
      });
      var O = p(N);
      Ve(O, 21, () => yn.filter((q) => !q.recommended), Qe, (q, ne) => {
        var K = hT(), R = d(K), L = {};
        j((G, Q) => {
          T(R, `${s(ne).displayName ?? ""} (${s(ne).params ?? ""}) \u2013 ${G ?? ""}k ctx${Q ?? ""}`), L !== (L = s(ne).name) && (K.value = (K.__value = s(ne).name) ?? "");
        }, [() => (s(ne).contextWindow / 1024).toFixed(0), () => h(s(ne).name) ? " \u2713" : ""]), u(q, K);
      });
      var Y = p(C, 2);
      {
        var V = (q) => {
          const ne = H(() => yn.find((G) => G.name === r()));
          var K = ke(), R = ae(K);
          {
            var L = (G) => {
              var Q = yT(), re = d(Q), ie = d(re), le = p(re, 2), ce = d(le), fe = d(ce), ve = p(ce, 4), be = d(ve), _e40 = p(ve, 2);
              {
                var xe = (pe) => {
                  var de = _T(), ue = p(ae(de), 2), me = d(ue);
                  j((we) => T(me, we), [() => s(ne).tags.slice(0, 2).join(", ")]), u(pe, de);
                };
                I(_e40, (pe) => {
                  var _a10;
                  ((_a10 = s(ne).tags) == null ? void 0 : _a10.length) && pe(xe);
                });
              }
              var Ae = p(le, 2);
              {
                var Ee = (pe) => {
                  var de = bT(), ue = p(d(de)), me = d(ue);
                  j(() => T(me, `ollama pull ${r() ?? ""}`)), u(pe, de);
                }, Se = H(() => !h(r())), Pe = (pe) => {
                  var de = xT();
                  u(pe, de);
                };
                I(Ae, (pe) => {
                  s(Se) ? pe(Ee) : pe(Pe, -1);
                });
              }
              j((pe) => {
                T(ie, s(ne).description), T(fe, `${pe ?? ""}k ctx`), T(be, s(ne).params);
              }, [() => (s(ne).contextWindow / 1024).toFixed(0)]), u(G, Q);
            };
            I(R, (G) => {
              s(ne) && G(L);
            });
          }
          u(q, K);
        };
        I(Y, (q) => {
          r() && q(V);
        });
      }
      Mn(k, r), u($, W);
    }, $$slots: { default: true } });
  }, $$slots: { default: true } });
  var B = p(F, 2), M = p(d(B), 2);
  Na(M, { class: "mt-1", children: (E, S) => {
    Ra(E, { class: "pt-0 pb-2 px-0", children: ($, J) => {
      var W = ET(), C = ae(W), A = d(C), k = d(A), N = d(k);
      Ve(N, 20, () => ["Model", "Context", "Params", "Strengths"], Qe, (Y, V) => {
        var q = kT(), ne = d(q);
        j(() => T(ne, V)), u(Y, q);
      });
      var O = p(k);
      Ve(O, 21, () => yn, Qe, (Y, V) => {
        var q = AT(), ne = d(q), K = d(ne), R = p(K);
        {
          var L = (Ee) => {
            Cr(Ee, { variant: "outline", class: "ml-1 text-[0.5rem] h-3.5 px-1 py-0 text-primary border-primary/30", children: (Se, Pe) => {
              var pe = Ue("current");
              u(Se, pe);
            }, $$slots: { default: true } });
          };
          I(R, (Ee) => {
            s(V).name === r() && Ee(L);
          });
        }
        var G = p(R, 2);
        {
          var Q = (Ee) => {
            var Se = ST();
            u(Ee, Se);
          }, re = H(() => h(s(V).name));
          I(G, (Ee) => {
            s(re) && Ee(Q);
          });
        }
        var ie = p(ne), le = d(ie), ce = d(le), fe = p(ie), ve = d(fe), be = p(fe), _e40 = d(be);
        {
          var xe = (Ee) => {
            var Se = TT();
            u(Ee, Se);
          };
          I(_e40, (Ee) => {
            s(V).recommended && Ee(xe);
          });
        }
        var Ae = p(_e40);
        j((Ee, Se, Pe) => {
          rt(q, 1, Ee), T(K, `${s(V).displayName ?? ""} `), T(ce, `${Se ?? ""}k`), T(ve, s(V).params), T(Ae, ` ${Pe ?? ""}`);
        }, [() => Et(Je("transition-colors", s(V).name === r() ? "bg-primary/5" : "hover:bg-accent", !h(s(V).name) && "opacity-50")), () => (s(V).contextWindow / 1024).toFixed(0), () => s(V).tags.slice(0, 2).join(", ")]), u(Y, q);
      }), u($, W);
    }, $$slots: { default: true } });
  }, $$slots: { default: true } });
  var Z = p(B, 2);
  {
    var U = (E) => {
      var S = CT(), $ = d(S);
      j(() => T($, n())), u(E, S);
    };
    I(Z, (E) => {
      n() && E(U);
    });
  }
  var P = p(Z, 2);
  {
    let E = H(() => {
      var _a10;
      return !((_a10 = s(l)) == null ? void 0 : _a10.connected) || !!n();
    });
    tt(P, { onclick: y, get disabled() {
      return s(E);
    }, class: "w-full", children: (S, $) => {
      var J = Ue("Load Model");
      u(S, J);
    }, $$slots: { default: true } });
  }
  u(t, w), Fe();
}
function $T(t, e) {
  Be(e, true);
  let r = oe(e, "ref", 15, null), n = oe(e, "value", 15, ""), a = ft(e, ["$$slots", "$$events", "$$legacy", "ref", "value", "class"]);
  var o = ke(), i = ae(o);
  {
    let l = H(() => Je("flex flex-col gap-2", e.class));
    dr(i, () => gy, (c, f) => {
      f(c, et({ "data-slot": "tabs", get class() {
        return s(l);
      } }, () => a, { get ref() {
        return r();
      }, set ref(v) {
        r(v);
      }, get value() {
        return n();
      }, set value(v) {
        n(v);
      } }));
    });
  }
  u(t, o), Fe();
}
function NT(t, e) {
  Be(e, true);
  let r = oe(e, "ref", 15, null), n = ft(e, ["$$slots", "$$events", "$$legacy", "ref", "class"]);
  var a = ke(), o = ae(a);
  {
    let i = H(() => Je("bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]", e.class));
    dr(o, () => hy, (l, c) => {
      c(l, et({ "data-slot": "tabs-list", get class() {
        return s(i);
      } }, () => n, { get ref() {
        return r();
      }, set ref(f) {
        r(f);
      } }));
    });
  }
  u(t, a), Fe();
}
function RT(t, e) {
  Be(e, true);
  let r = oe(e, "ref", 15, null), n = ft(e, ["$$slots", "$$events", "$$legacy", "ref", "class"]);
  var a = ke(), o = ae(a);
  {
    let i = H(() => Je("data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", e.class));
    dr(o, () => by, (l, c) => {
      c(l, et({ "data-slot": "tabs-trigger", get class() {
        return s(i);
      } }, () => n, { get ref() {
        return r();
      }, set ref(f) {
        r(f);
      } }));
    });
  }
  u(t, a), Fe();
}
var MT = _("<span> </span> <span> </span>", 1), zT = _("<option> </option>"), OT = _('<span class="text-warning font-medium">May struggle with long emails.</span>'), DT = _('<p class="text-xs text-muted-foreground leading-relaxed"> <!></p>'), LT = _('<p class="text-sm text-destructive text-center px-3 py-2 bg-destructive/8 border border-destructive/20 rounded"> </p>'), jT = _('<form class="flex flex-col gap-5"><!> <div class="flex flex-col gap-1.5"><!> <!> <p class="text-[0.68rem] text-muted-foreground/50 leading-relaxed"> </p></div> <div class="flex flex-col gap-1.5"><!> <select id="model-select" class="w-full h-9 px-3 rounded border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors"></select> <!></div> <!> <!></form>');
function BT(t, e) {
  Be(e, true);
  const r = () => zf(Oa, "$coreStore", n), [n, a] = Of();
  let o = oe(e, "selectedModel", 15), i = oe(e, "error", 15, null), l = te("openai"), c = nt({ openai: "", anthropic: "", google: "", xai: "" }), f = te(false), v = H(() => {
    const { core: h } = r();
    if (!h) return [];
    try {
      return h.getApiModels();
    } catch {
      return [];
    }
  }), x = H(() => s(v).filter((h) => h.provider === s(l)));
  Xt(async () => {
    var _a10;
    c.openai = await sr("openaiApiKey") || "", c.anthropic = await sr("anthropicApiKey") || "", c.google = await sr("googleApiKey") || "", c.xai = await sr("xaiApiKey") || "";
    const h = s(v).find((b) => b.id === o());
    h ? g(l, h.provider, true) : (g(l, "openai"), o((_a10 = s(x)[0]) == null ? void 0 : _a10.id));
  }), Ut(() => {
    var _a10;
    s(x).some((h) => h.id === o()) || o((_a10 = s(x)[0]) == null ? void 0 : _a10.id);
  });
  async function m() {
    var _a10;
    if (!c[s(l)]) {
      i(`API key for ${s(l)} is required`);
      return;
    }
    i(null), g(f, true), await _r(`${s(l)}ApiKey`, c[s(l)]), g(f, false), (_a10 = e.onload) == null ? void 0 : _a10.call(e);
  }
  const y = [{ id: "openai", icon: "\u26A1", label: "OpenAI" }, { id: "anthropic", icon: "\u{1F9E0}", label: "Anthropic" }, { id: "google", icon: "\u{1F50D}", label: "Google" }, { id: "xai", icon: "\u2716\uFE0F", label: "xAI" }];
  Na(t, { class: "w-full max-w-[440px] mx-auto", children: (h, b) => {
    Ra(h, { class: "pt-5 pb-5 px-5", children: (w, D) => {
      var F = jT(), B = d(F);
      $T(B, { get value() {
        return s(l);
      }, set value(O) {
        g(l, O, true);
      }, children: (O, Y) => {
        NT(O, { class: "w-full", children: (V, q) => {
          var ne = ke(), K = ae(ne);
          Ve(K, 17, () => y, Qe, (R, L) => {
            RT(R, { get value() {
              return s(L).id;
            }, class: "flex-1 gap-1.5", children: (G, Q) => {
              var re = MT(), ie = ae(re), le = d(ie), ce = p(ie, 2), fe = d(ce);
              j(() => {
                T(le, s(L).icon), T(fe, s(L).label);
              }), u(G, re);
            }, $$slots: { default: true } });
          }), u(V, ne);
        }, $$slots: { default: true } });
      }, $$slots: { default: true } });
      var M = p(B, 2), Z = d(M);
      rn(Z, { for: "api-key", class: "text-[0.68rem] uppercase tracking-wider opacity-60", children: (O, Y) => {
        var V = Ue();
        j((q) => T(V, `${q ?? ""} API Key`), [() => s(l).toUpperCase()]), u(O, V);
      }, $$slots: { default: true } });
      var U = p(Z, 2);
      $n(U, { id: "api-key", type: "password", placeholder: "Enter your API key\u2026", autocomplete: "off", get value() {
        return c[s(l)];
      }, set value(O) {
        c[s(l)] = O;
      } });
      var P = p(U, 2), E = d(P), S = p(M, 2), $ = d(S);
      rn($, { for: "model-select", class: "text-[0.68rem] uppercase tracking-wider opacity-60", children: (O, Y) => {
        var V = Ue("Select Model");
        u(O, V);
      }, $$slots: { default: true } });
      var J = p($, 2);
      Ve(J, 21, () => s(x), Qe, (O, Y) => {
        var V = zT(), q = d(V), ne = {};
        j(() => {
          T(q, `${s(Y).displayName ?? ""}${s(Y).recommendedForEmailProcessing ? " \u2605" : ""}`), ne !== (ne = s(Y).id) && (V.value = (V.__value = s(Y).id) ?? "");
        }), u(O, V);
      });
      var W = p(J, 2);
      {
        var C = (O) => {
          const Y = H(() => s(x).find((K) => K.id === o()));
          var V = ke(), q = ae(V);
          {
            var ne = (K) => {
              var R = DT(), L = d(R), G = p(L);
              {
                var Q = (re) => {
                  var ie = OT();
                  u(re, ie);
                };
                I(G, (re) => {
                  s(Y).recommendedForEmailProcessing || re(Q);
                });
              }
              j((re) => T(L, `${s(Y).description ?? ""}. Context: ${re ?? ""} tokens. `), [() => s(Y).contextWindow.toLocaleString()]), u(K, R);
            };
            I(q, (K) => {
              s(Y) && K(ne);
            });
          }
          u(O, V);
        };
        I(W, (O) => {
          o() && O(C);
        });
      }
      var A = p(S, 2);
      {
        let O = H(() => s(f) || !c[s(l)]);
        tt(A, { type: "submit", get disabled() {
          return s(O);
        }, class: "w-full", children: (Y, V) => {
          var q = Ue();
          j(() => T(q, s(f) ? "Checking\u2026" : "Load Model")), u(Y, q);
        }, $$slots: { default: true } });
      }
      var k = p(A, 2);
      {
        var N = (O) => {
          var Y = LT(), V = d(Y);
          j(() => T(V, i())), u(O, Y);
        };
        I(k, (O) => {
          i() && O(N);
        });
      }
      j((O) => T(E, `Stored locally in IndexedDB. Sent only to ${O ?? ""}.`), [() => s(l).toUpperCase()]), Gh("submit", F, (O) => {
        O.preventDefault(), m();
      }), Mn(J, o), u(w, F);
    }, $$slots: { default: true } });
  }, $$slots: { default: true } }), Fe(), a();
}
var FT = _('<span class="text-sm font-semibold text-primary tabular-nums shrink-0 svelte-r5fnze"> </span>'), UT = _('<!> <div class="flex items-baseline gap-1.5 flex-wrap text-xs text-muted-foreground tabular-nums svelte-r5fnze"><span class="text-foreground font-medium svelte-r5fnze"> </span> <span class="opacity-30 svelte-r5fnze">/</span> <span class="opacity-60 svelte-r5fnze"> </span> <span class="text-[0.62rem] opacity-35 ml-1 svelte-r5fnze"> </span></div>', 1), GT = _('<span class="text-foreground font-medium svelte-r5fnze"> </span> <span class="opacity-35 ml-1 svelte-r5fnze"> </span>', 1), WT = _('<span class="italic opacity-50 svelte-r5fnze">downloading\u2026</span>'), VT = _('<div class="h-1 w-full bg-muted rounded-full overflow-hidden mb-2 svelte-r5fnze"><div class="h-full w-[30%] bg-primary rounded-full animate-[slide_1.5s_ease-in-out_infinite] svelte-r5fnze"></div></div> <div class="text-xs text-muted-foreground tabular-nums svelte-r5fnze"><!></div>', 1), HT = _('<div class="flex items-center justify-between gap-2 mb-2 svelte-r5fnze"><span class="text-xs text-muted-foreground truncate flex-1 min-w-0 svelte-r5fnze"> </span> <!></div> <!>', 1), qT = _('<div class="max-w-[520px] mx-auto p-8 flex flex-col items-center text-center gap-3 svelte-r5fnze"><p class="text-sm text-muted-foreground tracking-tight svelte-r5fnze"> </p> <!></div>');
function YT(t, e) {
  Be(e, true);
  let r = oe(e, "message", 3, ""), n = oe(e, "items", 19, () => []);
  Xt(() => qa("LoadingProgress"));
  var a = qT(), o = d(a), i = d(o), l = p(o, 2);
  Ve(l, 17, n, Qe, (c, f) => {
    const v = H(() => s(f).total ? xb(s(f).loaded || 0, s(f).total) : null);
    Na(c, { class: "w-full", children: (x, m) => {
      Ra(x, { class: "pt-4 pb-3 px-4", children: (y, h) => {
        var b = HT(), w = ae(b), D = d(w), F = d(D), B = p(D, 2);
        {
          var M = (E) => {
            var S = FT(), $ = d(S);
            j((J) => T($, `${J ?? ""}%`), [() => s(v).toFixed(1)]), u(E, S);
          };
          I(B, (E) => {
            s(v) !== null && E(M);
          });
        }
        var Z = p(w, 2);
        {
          var U = (E) => {
            var S = UT(), $ = ae(S);
            {
              let Y = H(() => s(v) ?? 0);
              Hl($, { get value() {
                return s(Y);
              }, class: "h-1 mb-2" });
            }
            var J = p($, 2), W = d(J), C = d(W), A = p(W, 4), k = d(A), N = p(A, 2), O = d(N);
            j((Y, V, q, ne) => {
              T(C, Y), T(k, V), T(O, `(${q ?? ""} / ${ne ?? ""} B)`);
            }, [() => Xi(s(f).loaded || 0), () => Xi(s(f).total), () => (s(f).loaded || 0).toLocaleString(), () => s(f).total.toLocaleString()]), u(E, S);
          }, P = (E) => {
            var S = VT(), $ = p(ae(S), 2), J = d($);
            {
              var W = (A) => {
                var k = GT(), N = ae(k), O = d(N), Y = p(N, 2), V = d(Y);
                j((q, ne) => {
                  T(O, q), T(V, `(${ne ?? ""} B)`);
                }, [() => Xi(s(f).loaded), () => s(f).loaded.toLocaleString()]), u(A, k);
              }, C = (A) => {
                var k = WT();
                u(A, k);
              };
              I(J, (A) => {
                s(f).loaded ? A(W) : A(C, -1);
              });
            }
            u(E, S);
          };
          I(Z, (E) => {
            s(f).total ? E(U) : E(P, -1);
          });
        }
        j(() => {
          br(D, "title", s(f).file), T(F, s(f).file);
        }), u(y, b);
      }, $$slots: { default: true } });
    }, $$slots: { default: true } });
  }), j(() => T(i, r())), u(t, a), Fe();
}
function KT(t, e) {
  Be(e, true);
  let r = oe(e, "ref", 15, null), n = oe(e, "open", 15, false), a = ft(e, ["$$slots", "$$events", "$$legacy", "ref", "open"]);
  var o = ke(), i = ae(o);
  dr(i, () => x1, (l, c) => {
    c(l, et({ "data-slot": "collapsible" }, () => a, { get ref() {
      return r();
    }, set ref(f) {
      r(f);
    }, get open() {
      return n();
    }, set open(f) {
      n(f);
    } }));
  }), u(t, o), Fe();
}
function XT(t, e) {
  Be(e, true);
  let r = oe(e, "ref", 15, null), n = ft(e, ["$$slots", "$$events", "$$legacy", "ref"]);
  var a = ke(), o = ae(a);
  dr(o, () => S1, (i, l) => {
    l(i, et({ "data-slot": "collapsible-trigger" }, () => n, { get ref() {
      return r();
    }, set ref(c) {
      r(c);
    } }));
  }), u(t, a), Fe();
}
function ZT(t, e) {
  Be(e, true);
  let r = oe(e, "ref", 15, null), n = ft(e, ["$$slots", "$$events", "$$legacy", "ref"]);
  var a = ke(), o = ae(a);
  dr(o, () => w1, (i, l) => {
    l(i, et({ "data-slot": "collapsible-content" }, () => n, { get ref() {
      return r();
    }, set ref(c) {
      r(c);
    } }));
  }), u(t, a), Fe();
}
var JT = _('<div class="flex justify-end py-0.5 svelte-11gjw00"><div class="max-w-[72%] bg-primary text-primary-foreground px-4 py-2 text-sm leading-relaxed word-break-words whitespace-pre-wrap tracking-tight svelte-11gjw00" style="border-radius: 18px 18px 4px 18px"> </div></div>'), QT = _('<span class="text-xs text-muted-foreground/30 svelte-11gjw00"> </span>'), eA = _('<span class="text-[0.62rem] tabular-nums not-italic opacity-60 ml-0.5 svelte-11gjw00"> </span>'), tA = _('<span class="inline-flex items-center gap-1.5 text-xs text-primary/60 italic svelte-11gjw00"><span class="size-1.5 rounded-full bg-primary animate-pulse svelte-11gjw00"></span> Thinking\u2026<!></span>'), rA = _('<span class="inline-flex items-center gap-1.5 text-xs text-muted-foreground/40 italic svelte-11gjw00"><span class="size-1.5 rounded-full bg-muted-foreground/40 animate-pulse svelte-11gjw00"></span> Preparing\u2026</span>'), nA = _('<span class="inline-flex items-center gap-1.5 text-xs text-primary/50 italic svelte-11gjw00"><span class="size-1.5 rounded-full bg-primary/50 animate-pulse svelte-11gjw00"></span> Generating\u2026</span>'), aA = _('<!> Internal reasoning <span class="text-[0.58rem] opacity-50 ml-0.5 svelte-11gjw00"> </span>', 1), sA = _('<pre class="text-[0.73rem] text-muted-foreground leading-relaxed px-3 py-2 rounded rounded-t-none border border-t-0 border-primary/15 bg-primary/[0.03] border-l-2 border-l-primary/15 max-h-[280px] overflow-y-auto whitespace-pre-wrap break-words font-[inherit] m-0 svelte-11gjw00"> </pre>'), oA = _("<!> <!>", 1), iA = _('<div class="flex gap-1 py-1.5 svelte-11gjw00"><span class="size-1.5 rounded-full bg-muted-foreground/30 animate-[dotBounce_1.2s_ease-in-out_infinite] svelte-11gjw00"></span> <span class="size-1.5 rounded-full bg-muted-foreground/30 animate-[dotBounce_1.2s_ease-in-out_0.18s_infinite] svelte-11gjw00"></span> <span class="size-1.5 rounded-full bg-muted-foreground/30 animate-[dotBounce_1.2s_ease-in-out_0.36s_infinite] svelte-11gjw00"></span></div>'), lA = _('<span class="cursor svelte-11gjw00">\u258B</span>'), cA = _('<div class="md-body svelte-11gjw00"><!><!></div>'), dA = _('<span class="cursor svelte-11gjw00">\u258B</span>'), uA = _('<div class="md-body plain svelte-11gjw00"> <!></div>'), fA = _('<div class="flex flex-col gap-1.5 py-2.5 pb-3 border-b border-border last:border-b-0 svelte-11gjw00"><div class="flex items-center gap-2 flex-wrap svelte-11gjw00"><span class="text-[0.65rem] font-bold uppercase tracking-wider px-1.5 py-px rounded border shrink-0 svelte-11gjw00"> </span> <!> <!></div> <!> <div class="min-h-[1.2em] svelte-11gjw00"><!></div></div>');
function pA(t, e) {
  Be(e, true);
  let r = oe(e, "isLast", 3, false), n = oe(e, "isRunning", 3, false), a = oe(e, "generationPhase", 3, null), o = oe(e, "numTokens", 3, null), i = oe(e, "backend", 3, null), l = oe(e, "showModelName", 3, false);
  Xt(() => qa(`MessageBubble[${e.msg.role}]`));
  const c = { webgpu: "WebGPU", ollama: "Ollama", openai: "OpenAI", anthropic: "Claude", google: "Gemini", xai: "Grok" }, f = { webgpu: "#4ade80", ollama: "#a78bfa", openai: "#10b981", anthropic: "#f59e0b", google: "#3b82f6", xai: "#e8e8e8" };
  let v = H(() => i() ? c[i()] ?? i() : "AI"), x = H(() => i() ? f[i()] ?? "#888" : "#888"), m = H(() => {
    if (!e.msg.model) return null;
    const M = Si(e.msg.model);
    return M ? M.name : e.msg.model.split("/").pop().replace(/[-_](ONNX|onnx)([-_](GQA|MHA|web|DQ))*$/i, "").replace(/[-_]/g, " ").trim();
  }), y = H(() => {
    if (e.msg.role !== "assistant" || !e.msg.content) return "";
    try {
      const M = Mt.parse(e.msg.content, { breaks: true, gfm: true });
      return Wl.sanitize(M);
    } catch {
      return e.msg.content;
    }
  }), h = H(() => n() && r()), b = te(false);
  var w = ke(), D = ae(w);
  {
    var F = (M) => {
      var Z = JT(), U = d(Z), P = d(U);
      j(() => T(P, e.msg.content)), u(M, Z);
    }, B = (M) => {
      var Z = fA(), U = d(Z), P = d(U);
      let E;
      var S = d(P), $ = p(P, 2);
      {
        var J = (R) => {
          var L = QT(), G = d(L);
          j(() => T(G, s(m))), u(R, L);
        };
        I($, (R) => {
          l() && s(m) && R(J);
        });
      }
      var W = p($, 2);
      {
        var C = (R) => {
          var L = tA(), G = p(d(L), 2);
          {
            var Q = (re) => {
              var ie = eA(), le = d(ie);
              j(() => T(le, `${o() ?? ""} tok`)), u(re, ie);
            };
            I(G, (re) => {
              o() && re(Q);
            });
          }
          u(R, L);
        }, A = (R) => {
          var L = rA();
          u(R, L);
        }, k = (R) => {
          var L = nA();
          u(R, L);
        };
        I(W, (R) => {
          s(h) && a() === "thinking" ? R(C) : s(h) && a() === "preparing" ? R(A, 1) : s(h) && a() === "generating" && R(k, 2);
        });
      }
      var N = p(U, 2);
      {
        var O = (R) => {
          var L = ke(), G = ae(L);
          dr(G, () => KT, (Q, re) => {
            re(Q, { class: "mt-0.5", get open() {
              return s(b);
            }, set open(ie) {
              g(b, ie, true);
            }, children: (ie, le) => {
              var ce = oA(), fe = ae(ce);
              {
                let be = H(() => Je("inline-flex items-center gap-1.5 cursor-pointer text-[0.72rem] text-primary/60 hover:text-primary/90 px-2 py-1 rounded border border-primary/15 bg-primary/5 transition-colors select-none w-full text-left", s(b) && "rounded-b-none"));
                dr(fe, () => XT, (_e40, xe) => {
                  xe(_e40, { get class() {
                    return s(be);
                  }, children: (Ae, Ee) => {
                    var Se = aA(), Pe = ae(Se);
                    {
                      let ue = H(() => Je("size-3 shrink-0 transition-transform", s(b) && "rotate-90"));
                      hg(Pe, { get class() {
                        return s(ue);
                      } });
                    }
                    var pe = p(Pe, 2), de = d(pe);
                    j((ue) => T(de, `${ue ?? ""} words`), [() => e.msg.thinking.split(/\s+/).filter(Boolean).length]), u(Ae, Se);
                  }, $$slots: { default: true } });
                });
              }
              var ve = p(fe, 2);
              dr(ve, () => ZT, (be, _e40) => {
                _e40(be, { children: (xe, Ae) => {
                  var Ee = sA(), Se = d(Ee);
                  j(() => T(Se, e.msg.thinking)), u(xe, Ee);
                }, $$slots: { default: true } });
              }), u(ie, ce);
            }, $$slots: { default: true } });
          }), u(R, L);
        };
        I(N, (R) => {
          e.msg.thinking && R(O);
        });
      }
      var Y = p(N, 2), V = d(Y);
      {
        var q = (R) => {
          var L = iA();
          u(R, L);
        }, ne = (R) => {
          var L = cA(), G = d(L);
          fc(G, () => s(y));
          var Q = p(G);
          {
            var re = (ie) => {
              var le = lA();
              u(ie, le);
            };
            I(Q, (ie) => {
              s(h) && ie(re);
            });
          }
          u(R, L);
        }, K = (R) => {
          var L = uA(), G = d(L), Q = p(G);
          {
            var re = (ie) => {
              var le = dA();
              u(ie, le);
            };
            I(Q, (ie) => {
              s(h) && ie(re);
            });
          }
          j(() => T(G, e.msg.content)), u(R, L);
        };
        I(V, (R) => {
          s(h) && !e.msg.content && a() !== "thinking" ? R(q) : s(y) ? R(ne, 1) : e.msg.content && R(K, 2);
        });
      }
      j(() => {
        E = Rt(P, "", E, { color: s(x), "border-color": "color-mix(in srgb," + s(x) + " 28%, transparent)", background: "color-mix(in srgb," + s(x) + " 8%, transparent)" }), T(S, s(v));
      }), u(M, Z);
    };
    I(D, (M) => {
      e.msg.role === "user" ? M(F) : M(B, -1);
    });
  }
  u(t, w), Fe();
}
Zt(["click"]);
var vA = dn('<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="3" width="20" height="14" rx="2"></rect><path d="M8 21h8M12 17v4"></path></svg>'), gA = dn('<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-success"><polyline points="20 6 9 17 4 12"></polyline></svg>'), mA = dn('<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-destructive"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>'), hA = _('<span class="inline-flex items-center gap-1 text-[0.64rem] font-semibold px-1.5 py-px rounded border shrink-0"><svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"></path></svg> </span>'), _A = _('<div class="px-3.5 py-2.5 text-[0.8rem] text-muted-foreground leading-relaxed border-t border-border whitespace-pre-wrap"> </div>'), bA = _('<span class="size-2.5 rounded-full border border-border border-t-primary animate-spin"></span>'), xA = dn('<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>'), yA = dn('<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'), wA = dn('<svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="4"></circle></svg>'), kA = _('<span class="text-[0.58rem] font-bold uppercase tracking-wider px-1.5 py-px rounded border"> </span>'), SA = _('<span class="flex gap-1 shrink-0"></span>'), TA = _("<span><!> <!></span>"), AA = dn('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>'), EA = _("<span><!></span> <span> </span> <!> <!> <!>", 1), CA = _('<button class="flex items-center gap-2 w-full px-3.5 py-2 text-left hover:bg-accent transition-colors"><!></button>'), IA = _('<div class="flex items-center gap-2 px-3.5 py-2"><!></div>'), PA = _('<img alt="screenshot" class="max-w-[260px] w-full rounded border border-border"/>'), $A = _('<span class="text-[0.63rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded border"> </span>'), NA = _('<div class="flex flex-wrap gap-1.5"></div>'), RA = _('<pre class="font-[inherit] text-[0.74rem] text-muted-foreground leading-relaxed whitespace-pre-wrap break-words m-0"> </pre>'), MA = _('<div class="px-3.5 pb-2.5 pt-1 pl-9 border-t border-border bg-foreground/[0.01] flex flex-col gap-2"><!> <!> <!></div>'), zA = _('<div class="border-b border-border last:border-b-0"><!> <!></div>'), OA = _('<div class="pr-2"></div>'), DA = _("<!> <!>", 1), LA = _('<div><button class="w-full flex items-center gap-2 px-3.5 py-2.5 bg-transparent hover:bg-accent transition-colors text-left"><span><!></span> <span class="flex-1 text-[0.82rem] font-medium text-foreground/85 truncate tracking-tight"> </span> <!> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg></button> <!></div>');
function Wo(t, e) {
  Be(e, true);
  const r = { webgpu: "WebGPU", ollama: "Ollama", openai: "GPT", anthropic: "Claude", google: "Gemini", xai: "Grok" }, n = { webgpu: "#4ade80", ollama: "#a78bfa", openai: "#10b981", anthropic: "#f59e0b", google: "#3b82f6", xai: "#e2e2e2" }, a = { NOISE: { bg: "color-mix(in srgb, #9ca3af 10%, transparent)", text: "#9ca3af", border: "color-mix(in srgb, #9ca3af 20%, transparent)" }, INFO: { bg: "color-mix(in srgb, #60a5fa 10%, transparent)", text: "#60a5fa", border: "color-mix(in srgb, #60a5fa 20%, transparent)" }, CRITICAL: { bg: "color-mix(in srgb, #ef4444 10%, transparent)", text: "#ef4444", border: "color-mix(in srgb, #ef4444 20%, transparent)" }, COMMAND: { bg: "color-mix(in srgb, #fbbf24 10%, transparent)", text: "#fbbf24", border: "color-mix(in srgb, #fbbf24 20%, transparent)" } };
  let o = te(true), i = te(nt(/* @__PURE__ */ new Set()));
  function l() {
    g(o, !s(o));
  }
  function c(C) {
    const A = new Set(s(i));
    A.has(C) ? A.delete(C) : A.add(C), g(i, A, true);
  }
  let f = H(() => e.msg.model ? r[e.msg.model] ?? e.msg.model : null), v = H(() => e.msg.model ? n[e.msg.model] ?? "#888" : "#888");
  function x(C) {
    if (!C) return "";
    const A = Math.round((Date.now() - C) / 1e3);
    return A < 60 ? `${A}s` : `${Math.floor(A / 60)}m ${A % 60}s`;
  }
  function m(C) {
    return a[C] ?? { bg: "color-mix(in srgb, white 4%, transparent)", text: "var(--color-muted-foreground)", border: "color-mix(in srgb, white 8%, transparent)" };
  }
  function y(C) {
    return { running: "text-foreground/70", done: "text-muted-foreground/40", error: "text-destructive", pending: "text-muted-foreground/25" }[C] ?? "text-muted-foreground/40";
  }
  function h(C) {
    return { running: "text-primary", done: "text-success", error: "text-destructive", pending: "text-muted-foreground/25" }[C] ?? "text-muted-foreground/25";
  }
  var b = LA(), w = d(b), D = d(w), F = d(D);
  {
    var B = (C) => {
      var A = vA();
      u(C, A);
    }, M = (C) => {
      var A = gA();
      u(C, A);
    }, Z = (C) => {
      var A = mA();
      u(C, A);
    };
    I(F, (C) => {
      e.msg.status === "running" ? C(B) : e.msg.status === "done" ? C(M, 1) : C(Z, -1);
    });
  }
  var U = p(D, 2), P = d(U), E = p(U, 2);
  {
    var S = (C) => {
      var A = hA();
      let k;
      var N = p(d(A));
      j(() => {
        k = Rt(A, "", k, { color: s(v), "border-color": "color-mix(in srgb," + s(v) + " 22%, transparent)", background: "color-mix(in srgb," + s(v) + " 7%, transparent)" }), T(N, ` ${s(f) ?? ""}`);
      }), u(C, A);
    };
    I(E, (C) => {
      s(f) && C(S);
    });
  }
  var $ = p(E, 2), J = p(w, 2);
  {
    var W = (C) => {
      var A = DA(), k = ae(A);
      {
        var N = (V) => {
          var q = _A(), ne = d(q);
          j(() => T(ne, e.msg.description)), u(V, q);
        };
        I(k, (V) => {
          e.msg.description && V(N);
        });
      }
      var O = p(k, 2);
      {
        var Y = (V) => {
          jn(V, { class: "border-t border-border h-[min(320px,50vh)]", children: (q, ne) => {
            var K = OA();
            Ve(K, 21, () => e.msg.steps, (R) => R.id, (R, L) => {
              const G = H(() => s(i).has(s(L).id)), Q = H(() => {
                var _a10;
                return s(L).expandable && (s(L).subContent || s(L).thumbnail || ((_a10 = s(L).badges) == null ? void 0 : _a10.length));
              });
              var re = zA();
              {
                const be = (_e40) => {
                  var xe = EA(), Ae = ae(xe), Ee = d(Ae);
                  {
                    var Se = (he) => {
                      var ge = bA();
                      u(he, ge);
                    }, Pe = (he) => {
                      var ge = xA();
                      u(he, ge);
                    }, pe = (he) => {
                      var ge = yA();
                      u(he, ge);
                    }, de = (he) => {
                      var ge = wA();
                      u(he, ge);
                    };
                    I(Ee, (he) => {
                      s(L).status === "running" ? he(Se) : s(L).status === "done" ? he(Pe, 1) : s(L).status === "error" ? he(pe, 2) : he(de, -1);
                    });
                  }
                  var ue = p(Ae, 2), me = d(ue), we = p(ue, 2);
                  {
                    var ye = (he) => {
                      var ge = SA();
                      Ve(ge, 21, () => s(L).badges, Qe, ($e, Ie) => {
                        const ze = H(() => m(s(Ie)));
                        var Re = kA();
                        let Le;
                        var We = d(Re);
                        j(() => {
                          Le = Rt(Re, "", Le, { background: s(ze).bg, color: s(ze).text, "border-color": s(ze).border }), T(We, s(Ie));
                        }), u($e, Re);
                      }), u(he, ge);
                    };
                    I(we, (he) => {
                      var _a10;
                      ((_a10 = s(L).badges) == null ? void 0 : _a10.length) && he(ye);
                    });
                  }
                  var Te = p(we, 2);
                  {
                    var Oe = (he) => {
                      var ge = TA(), $e = d(ge);
                      {
                        var Ie = (Le) => {
                          var We = Ue();
                          j(() => T(We, s(L).detail)), u(Le, We);
                        };
                        I($e, (Le) => {
                          s(L).detail && Le(Ie);
                        });
                      }
                      var ze = p($e, 2);
                      {
                        var Re = (Le) => {
                          var We = Ue();
                          j((st) => T(We, `\xB7 ${st ?? ""}`), [() => x(s(L).startedAt)]), u(Le, We);
                        };
                        I(ze, (Le) => {
                          s(L).startedAt && s(L).status === "running" && Le(Re);
                        });
                      }
                      j((Le) => rt(ge, 1, Le), [() => Et(Je("text-[0.68rem] tabular-nums shrink-0", y(s(L).status)))]), u(he, ge);
                    };
                    I(Te, (he) => {
                      (s(L).detail || s(L).startedAt && s(L).status === "running") && he(Oe);
                    });
                  }
                  var X = p(Te, 2);
                  {
                    var se = (he) => {
                      var ge = AA();
                      j(($e) => rt(ge, 0, $e), [() => Et(Je("size-2.5 text-muted-foreground/30 shrink-0 transition-transform", s(G) && "rotate-180"))]), u(he, ge);
                    };
                    I(X, (he) => {
                      s(Q) && he(se);
                    });
                  }
                  j((he, ge) => {
                    rt(Ae, 1, he), rt(ue, 1, ge), T(me, s(L).label);
                  }, [() => Et(Je("size-4 flex items-center justify-center shrink-0", h(s(L).status))), () => Et(Je("flex-1 min-w-0 truncate text-[0.78rem]", y(s(L).status)))]), u(_e40, xe);
                };
                var ie = d(re);
                {
                  var le = (_e40) => {
                    var xe = CA(), Ae = d(xe);
                    be(Ae), Ne("click", xe, () => c(s(L).id)), u(_e40, xe);
                  }, ce = (_e40) => {
                    var xe = IA(), Ae = d(xe);
                    be(Ae), u(_e40, xe);
                  };
                  I(ie, (_e40) => {
                    s(Q) ? _e40(le) : _e40(ce, -1);
                  });
                }
                var fe = p(ie, 2);
                {
                  var ve = (_e40) => {
                    var xe = MA(), Ae = d(xe);
                    {
                      var Ee = (ue) => {
                        var me = PA();
                        j(() => br(me, "src", s(L).thumbnail)), u(ue, me);
                      };
                      I(Ae, (ue) => {
                        s(L).thumbnail && ue(Ee);
                      });
                    }
                    var Se = p(Ae, 2);
                    {
                      var Pe = (ue) => {
                        var me = NA();
                        Ve(me, 21, () => s(L).badges, Qe, (we, ye) => {
                          const Te = H(() => m(s(ye)));
                          var Oe = $A();
                          let X;
                          var se = d(Oe);
                          j(() => {
                            X = Rt(Oe, "", X, { background: s(Te).bg, color: s(Te).text, "border-color": s(Te).border }), T(se, s(ye));
                          }), u(we, Oe);
                        }), u(ue, me);
                      };
                      I(Se, (ue) => {
                        var _a10;
                        ((_a10 = s(L).badges) == null ? void 0 : _a10.length) && ue(Pe);
                      });
                    }
                    var pe = p(Se, 2);
                    {
                      var de = (ue) => {
                        var me = RA(), we = d(me);
                        j(() => T(we, s(L).subContent)), u(ue, me);
                      };
                      I(pe, (ue) => {
                        s(L).subContent && ue(de);
                      });
                    }
                    u(_e40, xe);
                  };
                  I(fe, (_e40) => {
                    s(Q) && s(G) && _e40(ve);
                  });
                }
              }
              u(R, re);
            }), u(q, K);
          }, $$slots: { default: true } });
        };
        I(O, (V) => {
          var _a10;
          ((_a10 = e.msg.steps) == null ? void 0 : _a10.length) > 0 && V(Y);
        });
      }
      u(C, A);
    };
    I(J, (C) => {
      s(o) && C(W);
    });
  }
  j((C, A, k) => {
    rt(b, 1, C), rt(D, 1, A), T(P, e.msg.title), rt($, 0, k);
  }, [() => Et(Je("w-full max-w-[680px] rounded border overflow-hidden text-[0.82rem] bg-card transition-colors self-start", e.msg.status === "done" ? "border-success/15" : e.msg.status === "error" ? "border-destructive/15" : "border-border")), () => Et(Je("size-[22px] flex items-center justify-center rounded shrink-0", "bg-foreground/4 border border-foreground/6", e.msg.status === "running" && "text-primary animate-pulse")), () => Et(Je("size-3 text-muted-foreground/30 shrink-0 transition-transform", s(o) && "rotate-180"))]), Ne("click", w, l), u(t, b), Fe();
}
Zt(["click"]);
var jA = _('<p class="text-[0.62rem] text-muted-foreground leading-relaxed"></p>'), BA = _("<span> </span>"), FA = _('<span class="opacity-60"> </span>'), UA = _('<li><!> <strong class="text-foreground/70"> </strong> <!></li>'), GA = _('<ul class="list-disc pl-4 text-[0.6rem] text-muted-foreground space-y-0.5"></ul>'), WA = _('<div><div class="flex items-center gap-1.5"><span class="text-sm">\u26A0\uFE0F</span> <span class="text-xs font-bold text-warning"> </span></div> <!> <!> <div class="flex gap-1.5"><!> <!></div></div>'), VA = _('<span class="text-[0.66rem] text-muted-foreground truncate flex-1"> </span>'), HA = _('<div class="text-[0.76rem] font-medium text-foreground leading-snug"> </div>'), qA = _('<span class="opacity-70"> </span>'), YA = _('<div class="text-[0.58rem] text-muted-foreground/40"><!> <!></div>'), KA = _('<div class="text-[0.66rem] text-muted-foreground/70 leading-relaxed"> </div>'), XA = _('<span class="text-[0.52rem] font-semibold text-muted-foreground bg-foreground/4 px-1.5 py-0.5 rounded"> </span>'), ZA = _('<div class="flex flex-wrap gap-1"></div>'), JA = _('<div class="text-[0.58rem] text-muted-foreground/40 italic"> </div>'), QA = _('<div><div class="flex items-center gap-2"><span class="text-[0.55rem] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-success/8 text-success"> </span> <span class="text-[0.52rem] uppercase tracking-wide text-muted-foreground/40"> </span> <!></div> <!> <!> <!> <!> <!></div>'), e4 = _('<div class="mt-1 w-full"><!></div>'), t4 = _('<div class="flex items-center justify-between gap-2"><span class="text-[0.55rem] font-bold uppercase tracking-wider text-muted-foreground/35">Action Pipeline</span> <!></div> <!> <!> <!>', 1), r4 = _('<div class="self-start max-w-[90%] flex flex-col gap-1.5"><!> <!></div>'), n4 = _('<div class="rounded border border-border bg-background px-3 py-2.5 flex flex-col gap-1.5"><!> <!></div>'), a4 = _('<div class="self-start max-w-[90%] flex flex-col gap-2"><p class="text-[0.68rem] font-semibold uppercase tracking-wider text-muted-foreground/50"> </p> <!></div>'), s4 = _('<span class="text-[0.5rem] font-bold uppercase tracking-wider shrink-0"> </span>'), o4 = _('<div class="px-3 pb-3"><!></div>'), i4 = _('<div class="px-3 pb-3"><!></div>'), l4 = _('<span class="opacity-70"> </span>'), c4 = _('<span class="opacity-50"> </span>'), d4 = _('<div class="text-[0.63rem] text-muted-foreground/60 leading-relaxed mt-0.5"> </div>'), u4 = _('<span class="text-[0.52rem] font-semibold text-muted-foreground bg-foreground/4 px-1.5 py-0.5 rounded"> </span>'), f4 = _('<div class="flex flex-wrap gap-1 mt-0.5"></div>'), p4 = _('<p class="text-[0.58rem] text-muted-foreground/35 italic">No actions defined \u2014 configure in Control Board</p>'), v4 = _('<div class="mt-0.5"><!></div>'), g4 = _('<div class="flex flex-col gap-2 px-3.5 py-2.5 border-b border-border last:border-b-0"><div class="flex flex-col gap-0.5"><div class="text-[0.73rem] font-medium text-foreground leading-snug"> </div> <div class="text-[0.58rem] text-muted-foreground/40"><!> <!></div> <!> <!></div> <div class="flex flex-col gap-1.5"><div class="flex items-center justify-between gap-2"><span class="text-[0.55rem] font-bold uppercase tracking-wider text-muted-foreground/35">Action Pipeline</span> <!></div> <!> <!> <!></div></div>'), m4 = _('<div class="border-t border-border flex flex-col"></div>'), h4 = _('<div class="rounded border border-border bg-card overflow-hidden"><div class="flex items-center gap-2 px-1 py-0.5"><button class="flex items-center gap-2 flex-1 px-3 py-2.5 text-left hover:bg-accent transition-colors"><span class="text-[0.58rem] font-bold tracking-wider px-1.5 py-0.5 rounded text-white shrink-0"> </span> <!> <span class="text-sm font-semibold text-foreground min-w-[18px]"> </span> <span class="flex-1"></span> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg></button> <!></div> <!> <!> <!></div>'), _4 = _('<div class="self-start w-full max-w-[95%] flex flex-col gap-2"><div class="flex items-baseline gap-3 py-1"><span class="text-xs font-bold uppercase tracking-wider text-foreground">Events</span> <span class="text-[0.62rem] text-muted-foreground/40"> </span></div> <!></div>');
function b4(t, e) {
  Be(e, true);
  const r = (S, $ = ut, J = ut, W = ut, C = ut, A = ut) => {
    {
      let k = H(() => {
        var _a10;
        return Je("h-6 text-[0.6rem] font-bold uppercase tracking-wider px-2 shrink-0 pointer-events-auto", J() ? "text-warning border-warning/25 bg-warning/6 hover:bg-warning/12 hover:border-warning/40" : "text-primary border-primary/25 bg-primary/6 hover:bg-primary/12 hover:border-primary/40", ((_a10 = C()) == null ? void 0 : _a10.success) && "hover:opacity-80 !border-green-500/50 !text-green-500 !bg-green-500/10 cursor-pointer !ring-0 !ring-offset-0");
      });
      tt(S, { variant: "outline", size: "sm", onclick: () => {
        var _a10, _b4, _c6;
        ((_a10 = C()) == null ? void 0 : _a10.success) ? ((_b4 = e.onexecuted) == null ? void 0 : _b4.call(e), (_c6 = e.ondismiss) == null ? void 0 : _c6.call(e)) : A()();
      }, get disabled() {
        return W();
      }, get class() {
        return s(k);
      }, children: (N, O) => {
        var Y = ke(), V = ae(Y);
        {
          var q = (L) => {
            var G = Ue("Running\u2026");
            u(L, G);
          }, ne = (L) => {
            var G = Ue();
            j(() => T(G, C().success ? "Done (Dismiss)" : "Failed")), u(L, G);
          }, K = (L) => {
            var G = Ue("Review");
            u(L, G);
          }, R = (L) => {
            var G = Ue();
            j(() => T(G, $())), u(L, G);
          };
          I(V, (L) => {
            W() ? L(q) : C() ? L(ne, 1) : J() ? L(K, 2) : L(R, -1);
          });
        }
        u(N, Y);
      }, $$slots: { default: true } });
    }
  }, n = (S, $ = ut, J = ut, W = ut, C = ut, A = ut) => {
    var k = WA(), N = d(k), O = p(d(N), 2), Y = d(O), V = p(N, 2);
    {
      var q = (Q) => {
        var re = jA();
        fc(re, J, true), u(Q, re);
      };
      I(V, (Q) => {
        J() && Q(q);
      });
    }
    var ne = p(V, 2);
    {
      var K = (Q) => {
        var re = GA();
        Ve(re, 21, W, Qe, (ie, le) => {
          var ce = UA(), fe = d(ce);
          {
            var ve = (Ee) => {
              var Se = BA(), Pe = d(Se);
              j(() => T(Pe, s(le).icon)), u(Ee, Se);
            };
            I(fe, (Ee) => {
              s(le).icon && Ee(ve);
            });
          }
          var be = p(fe, 2), _e40 = d(be), xe = p(be, 2);
          {
            var Ae = (Ee) => {
              var Se = FA(), Pe = d(Se);
              j(() => T(Pe, `\u2014 ${s(le).description ?? ""}`)), u(Ee, Se);
            };
            I(xe, (Ee) => {
              s(le).description && Ee(Ae);
            });
          }
          j(() => T(_e40, s(le).name)), u(ie, ce);
        }), u(Q, re);
      };
      I(ne, (Q) => {
        var _a10;
        ((_a10 = W()) == null ? void 0 : _a10.length) && Q(K);
      });
    }
    var R = p(ne, 2), L = d(R);
    tt(L, { variant: "outline", size: "sm", onclick: () => h(C()), class: "h-6 text-[0.6rem] font-bold text-warning border-warning/30 bg-warning/10 hover:bg-warning/20 px-2", children: (Q, re) => {
      var ie = Ue("\u2713 Confirm");
      u(Q, ie);
    }, $$slots: { default: true } });
    var G = p(L, 2);
    tt(G, { variant: "ghost", size: "sm", onclick: () => b(C()), class: "h-6 text-[0.6rem] opacity-60 hover:opacity-100 px-2", children: (Q, re) => {
      var ie = Ue("Cancel");
      u(Q, ie);
    }, $$slots: { default: true } }), j((Q) => {
      rt(k, 1, Q), T(Y, $());
    }, [() => Et(Je("rounded border border-warning/25 bg-warning/6", A() ? "flex flex-wrap items-center gap-2 px-3 py-2" : "flex flex-col gap-2 px-3 py-2.5"))]), u(S, k);
  }, a = (S, $ = ut, J = ut) => {
    var W = QA(), C = d(W), A = d(C), k = d(A), N = p(A, 2), O = d(N), Y = p(N, 2);
    {
      var V = (ce) => {
        var fe = VA(), ve = d(fe);
        j(() => T(ve, $().data.subject)), u(ce, fe);
      };
      I(Y, (ce) => {
        var _a10;
        J() && ((_a10 = $().data) == null ? void 0 : _a10.subject) && ce(V);
      });
    }
    var q = p(C, 2);
    {
      var ne = (ce) => {
        var fe = HA(), ve = d(fe);
        j(() => T(ve, $().data.subject)), u(ce, fe);
      };
      I(q, (ce) => {
        var _a10;
        !J() && ((_a10 = $().data) == null ? void 0 : _a10.subject) && ce(ne);
      });
    }
    var K = p(q, 2);
    {
      var R = (ce) => {
        var fe = YA(), ve = d(fe);
        {
          var be = (Ae) => {
            var Ee = Ue();
            j((Se) => T(Ee, Se), [() => f($().data.from)]), u(Ae, Ee);
          };
          I(ve, (Ae) => {
            var _a10;
            ((_a10 = $().data) == null ? void 0 : _a10.from) && Ae(be);
          });
        }
        var _e40 = p(ve, 2);
        {
          var xe = (Ae) => {
            var Ee = qA(), Se = d(Ee);
            j((Pe) => T(Se, `\xB7 ${Pe ?? ""}`), [() => v($().data.date)]), u(Ae, Ee);
          };
          I(_e40, (Ae) => {
            var _a10;
            ((_a10 = $().data) == null ? void 0 : _a10.date) && Ae(xe);
          });
        }
        u(ce, fe);
      };
      I(K, (ce) => {
        var _a10, _b4;
        (((_a10 = $().data) == null ? void 0 : _a10.from) || ((_b4 = $().data) == null ? void 0 : _b4.date)) && ce(R);
      });
    }
    var L = p(K, 2);
    {
      var G = (ce) => {
        var fe = KA(), ve = d(fe);
        j(() => T(ve, $().metadata.summary)), u(ce, fe);
      };
      I(L, (ce) => {
        var _a10;
        ((_a10 = $().metadata) == null ? void 0 : _a10.summary) && ce(G);
      });
    }
    var Q = p(L, 2);
    {
      var re = (ce) => {
        var fe = ZA();
        Ve(fe, 21, () => $().metadata.tags, Qe, (ve, be) => {
          var _e40 = XA(), xe = d(_e40);
          j(() => T(xe, s(be))), u(ve, _e40);
        }), u(ce, fe);
      };
      I(Q, (ce) => {
        var _a10, _b4;
        ((_b4 = (_a10 = $().metadata) == null ? void 0 : _a10.tags) == null ? void 0 : _b4.length) && ce(re);
      });
    }
    var ie = p(Q, 2);
    {
      var le = (ce) => {
        var fe = JA(), ve = d(fe);
        j(() => T(ve, $().metadata.reason)), u(ce, fe);
      };
      I(ie, (ce) => {
        var _a10;
        ((_a10 = $().metadata) == null ? void 0 : _a10.reason) && ce(le);
      });
    }
    j((ce) => {
      rt(W, 1, ce), T(k, $().type), T(O, $().source);
    }, [() => Et(Je("rounded border border-border flex flex-col gap-1", J() ? "bg-transparent border-none p-0" : "bg-card px-3 py-2.5"))]), u(S, W);
  };
  let o = te(nt({})), i = nt({}), l = te(nt({})), c = te(nt({}));
  function f(S) {
    if (!S) return "\u2014";
    const $ = S.replace(/<.*>/, "").trim();
    return $.length > 40 ? $.slice(0, 38) + "\u2026" : $;
  }
  function v(S) {
    if (!S) return "";
    try {
      return new Date(S).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
    } catch {
      return "";
    }
  }
  function x(S, $, J) {
    var _a10;
    const W = s(c)[S] ?? { type: "task-card", role: "assistant", title: J, model: null, status: "running", steps: [] };
    if ($.phase === "pipeline_loaded") W.steps = $.actions.map((C) => ({ id: C.id ?? C.commandId, label: C.name ?? C.commandId, status: "pending" }));
    else if ($.phase === "action_start") W.steps = W.steps.map((C) => C.id === ($.actionId ?? $.commandId) ? { ...C, status: "running", startedAt: Date.now() } : C);
    else if ($.phase === "action_complete") {
      const C = ((_a10 = $.result) == null ? void 0 : _a10.success) !== false;
      W.steps = W.steps.map((A) => {
        var _a11, _b4;
        return A.id === ($.actionId ?? $.commandId) ? { ...A, status: C ? "done" : "error", expandable: !!((_a11 = $.result) == null ? void 0 : _a11.message), subContent: ((_b4 = $.result) == null ? void 0 : _b4.message) ?? "" } : A;
      });
    } else $.phase === "done" ? W.status = W.steps.every((C) => C.status !== "error") ? "done" : "error" : $.phase === "error" && (W.status = "error", W.steps = [...W.steps.filter((C) => C.status !== "running"), { id: "__err", label: $.error ?? "Execution failed", status: "error" }]);
    g(c, { ...s(c), [S]: { ...W } }, true);
  }
  async function m(S, $, J = false) {
    var _a10, _b4;
    if (!await Yo()) {
      alert("Please sign in to Gmail first (Dashboard page)");
      return;
    }
    const W = `single_${$}`, C = ((_a10 = S.data) == null ? void 0 : _a10.subject) ?? S.type, A = C.length > 38 ? C.slice(0, 36) + "\u2026" : C;
    i[W] = { running: true, progress: null, result: null }, g(c, { ...s(c), [W]: { type: "task-card", role: "assistant", title: A, model: null, status: "running", steps: [] } }, true);
    try {
      const k = await uo(S, (N) => {
        i[W] = { ...i[W], progress: N }, x(W, N, A);
      }, J);
      if (k.requiresApproval) {
        i[W] = { running: false, progress: null, result: null }, delete s(c)[W], g(c, { ...s(c) }, true), s(l)[W] = { event: S, emailId: $, actions: k.actions, category: k.category, isBatch: false };
        return;
      }
      i[W] = { running: false, progress: null, result: k }, k.success && ((_b4 = e.onexecuted) == null ? void 0 : _b4.call(e));
    } catch (k) {
      i[W] = { running: false, progress: null, result: { success: false, message: k.message } }, x(W, { phase: "error", error: k.message }, A);
    }
  }
  async function y(S, $, J = false) {
    var _a10;
    if (!await Yo()) {
      alert("Please sign in to Gmail first (Dashboard page)");
      return;
    }
    const W = `batch_${S}`, C = `${D(S)} (${$.length})`;
    i[W] = { running: true, progress: null, result: null }, g(c, { ...s(c), [W]: { type: "task-card", role: "assistant", title: C, model: null, status: "running", steps: [] } }, true);
    try {
      const A = await $c(S, $, (k) => {
        i[W] = { ...i[W], progress: k }, x(W, k, C);
      }, J);
      if (A.requiresApproval) {
        i[W] = { running: false, progress: null, result: null }, delete s(c)[W], g(c, { ...s(c) }, true), s(l)[W] = { eventType: S, emails: $, actions: A.actions, category: A.category, isBatch: true };
        return;
      }
      i[W] = { running: false, progress: null, result: A }, A.success && ((_a10 = e.onexecuted) == null ? void 0 : _a10.call(e));
    } catch (A) {
      i[W] = { running: false, progress: null, result: { success: false, message: A.message } }, x(W, { phase: "error", error: A.message }, C);
    }
  }
  async function h(S) {
    const $ = s(l)[S];
    $ && (delete s(l)[S], g(l, { ...s(l) }, true), $.isBatch ? await y($.eventType, $.emails, true) : await m($.event, $.emailId, true));
  }
  function b(S) {
    delete s(l)[S], g(l, { ...s(l) }, true);
  }
  function w(S) {
    g(o, { ...s(o), [S]: !s(o)[S] }, true);
  }
  function D(S) {
    return S.split("_").map(($) => $.charAt(0) + $.slice(1).toLowerCase()).join(" ");
  }
  function F(S) {
    return `hsl(${Rc(S)}, 55%, 55%)`;
  }
  function B(S) {
    return i[S];
  }
  var M = ke(), Z = ae(M);
  {
    var U = (S) => {
      var $ = r4(), J = d($);
      a(J, () => e.msg.event, () => false);
      var W = p(J, 2);
      {
        var C = (A) => {
          const k = H(() => `single_${e.msg.event.data.emailId || Date.now()}`), N = H(() => B(s(k))), O = H(() => s(l)[s(k)]), Y = H(() => {
            var _a10;
            return ((_a10 = e.msg.event.metadata) == null ? void 0 : _a10.category) ? Pn[e.msg.event.metadata.category] || Pn.CRITICAL : null;
          });
          var V = t4(), q = ae(V), ne = p(d(q), 2);
          {
            var K = (ie) => {
              r(ie, () => "Execute", () => {
                var _a10;
                return (_a10 = s(Y)) == null ? void 0 : _a10.requiresApproval;
              }, () => {
                var _a10;
                return (_a10 = s(N)) == null ? void 0 : _a10.running;
              }, () => {
                var _a10;
                return (_a10 = s(N)) == null ? void 0 : _a10.result;
              }, () => () => m(e.msg.event, e.msg.event.data.emailId));
            };
            I(ne, (ie) => {
              s(O) || ie(K);
            });
          }
          var R = p(q, 2);
          {
            var L = (ie) => {
              n(ie, () => "Confirm execution?", () => null, () => null, () => s(k), () => true);
            };
            I(R, (ie) => {
              s(O) && ie(L);
            });
          }
          var G = p(R, 2);
          {
            let ie = H(() => {
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
          var Q = p(G, 2);
          {
            var re = (ie) => {
              var le = e4(), ce = d(le);
              Wo(ce, { get msg() {
                return s(c)[s(k)];
              } }), u(ie, le);
            };
            I(Q, (ie) => {
              var _a10;
              s(c)[s(k)] && ((_a10 = s(c)[s(k)].steps) == null ? void 0 : _a10.length) > 0 && ie(re);
            });
          }
          u(A, V);
        };
        I(W, (A) => {
          var _a10;
          ((_a10 = e.msg.commands) == null ? void 0 : _a10.length) && A(C);
        });
      }
      u(S, $);
    }, P = (S) => {
      var $ = a4(), J = d($), W = d(J), C = p(J, 2);
      Ve(C, 17, () => e.msg.items, Qe, (A, k) => {
        var N = n4(), O = d(N);
        a(O, () => s(k).event, () => true);
        var Y = p(O, 2);
        {
          let V = H(() => {
            var _a10;
            return (_a10 = s(k).event.metadata) == null ? void 0 : _a10.category;
          });
          os(Y, { get eventType() {
            return s(k).event.type;
          }, get category() {
            return s(V);
          }, get commands() {
            return s(k).commands;
          } });
        }
        u(A, N);
      }), j(() => T(W, `Processed ${e.msg.items.length ?? ""} email${e.msg.items.length === 1 ? "" : "s"}`)), u(S, $);
    }, E = (S) => {
      var $ = _4(), J = d($), W = p(d(J), 2), C = d(W), A = p(J, 2);
      Ve(A, 17, () => e.msg.categories, Qe, (k, N) => {
        const O = H(() => s(o)[s(N).eventType] ?? true), Y = H(() => `batch_${s(N).eventType}`), V = H(() => B(s(Y))), q = H(() => s(l)[s(Y)]), ne = H(() => s(N).category ? Pn[s(N).category] || Pn.CRITICAL : null);
        var K = h4(), R = d(K), L = d(R), G = d(L);
        let Q;
        var re = d(G), ie = p(G, 2);
        {
          var le = (ue) => {
            var me = s4();
            let we;
            var ye = d(me);
            j(() => {
              br(me, "title", s(ne).description), we = Rt(me, "", we, { color: s(ne).color }), T(ye, s(ne).label);
            }), u(ue, me);
          };
          I(ie, (ue) => {
            s(ne) && ue(le);
          });
        }
        var ce = p(ie, 2), fe = d(ce), ve = p(ce, 4), be = p(L, 2);
        {
          var _e40 = (ue) => {
            {
              let me = H(() => {
                var _a10;
                return (_a10 = s(V)) == null ? void 0 : _a10.running;
              }), we = H(() => {
                var _a10, _b4, _c6;
                return Je("h-6 text-[0.6rem] font-bold uppercase tracking-wider px-2 mr-2 shrink-0 pointer-events-auto", ((_a10 = s(ne)) == null ? void 0 : _a10.requiresApproval) ? "text-warning border-warning/25 bg-warning/6 hover:bg-warning/12 hover:border-warning/40" : "text-primary border-primary/25 bg-primary/6 hover:bg-primary/12 hover:border-primary/40", ((_c6 = (_b4 = s(V)) == null ? void 0 : _b4.result) == null ? void 0 : _c6.success) && "hover:opacity-80 !border-green-500/50 !text-green-500 !bg-green-500/10 cursor-pointer !ring-0 !ring-offset-0");
              });
              tt(ue, { variant: "outline", size: "sm", onclick: (ye) => {
                var _a10, _b4, _c6, _d4;
                ye.stopPropagation(), ((_b4 = (_a10 = s(V)) == null ? void 0 : _a10.result) == null ? void 0 : _b4.success) ? ((_c6 = e.onexecuted) == null ? void 0 : _c6.call(e), (_d4 = e.ondismiss) == null ? void 0 : _d4.call(e)) : y(s(N).eventType, s(N).emails.filter((Te) => Te.status !== "executed"));
              }, get disabled() {
                return s(me);
              }, get class() {
                return s(we);
              }, children: (ye, Te) => {
                var Oe = ke(), X = ae(Oe);
                {
                  var se = (Ie) => {
                    var ze = Ue("Running\u2026");
                    u(Ie, ze);
                  }, he = (Ie) => {
                    var ze = Ue();
                    j(() => T(ze, s(V).result.success ? `Done (Dismiss) (${s(V).result.successful ?? "?"}/${s(V).result.total ?? "?"})` : "Failed")), u(Ie, ze);
                  }, ge = (Ie) => {
                    var ze = Ue();
                    j((Re) => T(ze, `Review & Execute (${Re ?? ""})`), [() => s(N).emails.filter((Re) => Re.status !== "executed").length]), u(Ie, ze);
                  }, $e = (Ie) => {
                    var ze = Ue();
                    j((Re) => T(ze, `Execute All (${Re ?? ""})`), [() => s(N).emails.filter((Re) => Re.status !== "executed").length]), u(Ie, ze);
                  };
                  I(X, (Ie) => {
                    var _a10, _b4, _c6;
                    ((_a10 = s(V)) == null ? void 0 : _a10.running) ? Ie(se) : ((_b4 = s(V)) == null ? void 0 : _b4.result) ? Ie(he, 1) : ((_c6 = s(ne)) == null ? void 0 : _c6.requiresApproval) ? Ie(ge, 2) : Ie($e, -1);
                  });
                }
                u(ye, Oe);
              }, $$slots: { default: true } });
            }
          }, xe = H(() => !s(q) && s(N).emails.some((ue) => ue.status !== "executed"));
          I(be, (ue) => {
            s(xe) && ue(_e40);
          });
        }
        var Ae = p(R, 2);
        {
          var Ee = (ue) => {
            var me = o4(), we = d(me);
            n(we, () => "Review required \u2014 this is a CRITICAL event type", () => `The following actions will run on <strong>${s(N).emails.length} email${s(N).emails.length === 1 ? "" : "s"}</strong>. This changes email state and cannot be undone easily.`, () => s(q).actions, () => s(Y), () => false), u(ue, me);
          };
          I(Ae, (ue) => {
            s(q) && ue(Ee);
          });
        }
        var Se = p(Ae, 2);
        {
          var Pe = (ue) => {
            var me = i4(), we = d(me);
            Wo(we, { get msg() {
              return s(c)[s(Y)];
            } }), u(ue, me);
          };
          I(Se, (ue) => {
            var _a10;
            s(c)[s(Y)] && !s(q) && ((_a10 = s(c)[s(Y)].steps) == null ? void 0 : _a10.length) > 0 && ue(Pe);
          });
        }
        var pe = p(Se, 2);
        {
          var de = (ue) => {
            var me = m4();
            Ve(me, 21, () => s(N).emails, Qe, (we, ye) => {
              const Te = H(() => `single_${s(ye).emailId}`), Oe = H(() => B(s(Te))), X = H(() => s(l)[s(Te)]);
              var se = g4(), he = d(se), ge = d(he), $e = d(ge), Ie = p(ge, 2), ze = d(Ie);
              {
                var Re = (xt) => {
                  var Ft = l4(), ur = d(Ft);
                  j((Sn) => T(ur, Sn), [() => f(s(ye).from)]), u(xt, Ft);
                };
                I(ze, (xt) => {
                  s(ye).from && xt(Re);
                });
              }
              var Le = p(ze, 2);
              {
                var We = (xt) => {
                  var Ft = c4(), ur = d(Ft);
                  j((Sn) => T(ur, `\xB7 ${Sn ?? ""}`), [() => v(s(ye).date)]), u(xt, Ft);
                };
                I(Le, (xt) => {
                  s(ye).date && xt(We);
                });
              }
              var st = p(Ie, 2);
              {
                var gt = (xt) => {
                  var Ft = d4(), ur = d(Ft);
                  j(() => T(ur, s(ye).summary)), u(xt, Ft);
                };
                I(st, (xt) => {
                  s(ye).summary && xt(gt);
                });
              }
              var Lt = p(st, 2);
              {
                var dt = (xt) => {
                  var Ft = f4();
                  Ve(Ft, 21, () => s(ye).tags, Qe, (ur, Sn) => {
                    var ka = u4(), Me = d(ka);
                    j(() => T(Me, s(Sn))), u(ur, ka);
                  }), u(xt, Ft);
                };
                I(Lt, (xt) => {
                  var _a10;
                  ((_a10 = s(ye).tags) == null ? void 0 : _a10.length) && xt(dt);
                });
              }
              var Jt = p(he, 2), Wt = d(Jt), Nr = p(d(Wt), 2);
              {
                var Rr = (xt) => {
                  r(xt, () => "Execute", () => {
                    var _a10;
                    return (_a10 = s(ne)) == null ? void 0 : _a10.requiresApproval;
                  }, () => {
                    var _a10;
                    return (_a10 = s(Oe)) == null ? void 0 : _a10.running;
                  }, () => {
                    var _a10;
                    return (_a10 = s(Oe)) == null ? void 0 : _a10.result;
                  }, () => () => m({ type: s(N).eventType, source: "gmail", data: s(ye) }, s(ye).emailId));
                };
                I(Nr, (xt) => {
                  s(ye).status !== "executed" && !s(X) && xt(Rr);
                });
              }
              var Nt = p(Wt, 2);
              {
                var Sr = (xt) => {
                  n(xt, () => "Confirm execution?", () => null, () => null, () => s(Te), () => true);
                };
                I(Nt, (xt) => {
                  s(ye).status !== "executed" && s(X) && xt(Sr);
                });
              }
              var ra = p(Nt, 2);
              {
                var na = (xt) => {
                  os(xt, { get eventType() {
                    return s(N).eventType;
                  }, get category() {
                    return s(N).category;
                  }, get commands() {
                    return s(N).commands;
                  } });
                }, wa = (xt) => {
                  var Ft = p4();
                  u(xt, Ft);
                };
                I(ra, (xt) => {
                  var _a10;
                  ((_a10 = s(N).commands) == null ? void 0 : _a10.length) ? xt(na) : xt(wa, -1);
                });
              }
              var Ka = p(ra, 2);
              {
                var Xa = (xt) => {
                  var Ft = v4(), ur = d(Ft);
                  Wo(ur, { get msg() {
                    return s(c)[s(Te)];
                  } }), u(xt, Ft);
                };
                I(Ka, (xt) => {
                  var _a10;
                  s(c)[s(Te)] && !s(X) && ((_a10 = s(c)[s(Te)].steps) == null ? void 0 : _a10.length) > 0 && xt(Xa);
                });
              }
              j(() => T($e, s(ye).subject)), u(we, se);
            }), u(ue, me);
          };
          I(pe, (ue) => {
            s(O) && ue(de);
          });
        }
        j((ue, me, we) => {
          Q = Rt(G, "", Q, ue), T(re, me), T(fe, s(N).emails.length), rt(ve, 0, we);
        }, [() => ({ background: F(s(N).eventType) }), () => D(s(N).eventType), () => Et(Je("size-3.5 text-muted-foreground/30 transition-transform", s(O) && "rotate-180"))]), Ne("click", L, () => w(s(N).eventType)), u(k, K);
      }), j(() => T(C, `${e.msg.total ?? ""} email${e.msg.total === 1 ? "" : "s"} in ${e.msg.categories.length ?? ""} event
        type${e.msg.categories.length === 1 ? "" : "s"}`)), u(S, $);
    };
    I(Z, (S) => {
      e.msg.type === "event" ? S(U) : e.msg.type === "event-batch" ? S(P, 1) : e.msg.type === "events-by-category" && S(E, 2);
    });
  }
  u(t, M), Fe();
}
Zt(["click"]);
var x4 = _('<button><span class="size-1.5 rounded-full shrink-0"></span> <span> </span></button>'), y4 = _('<span class="opacity-70"> </span>'), w4 = _('<div class="flex items-center gap-1.5 py-1 border-b border-border last:border-b-0 group/row"><button class="flex-1 min-w-0 flex flex-col gap-px text-left" title="Ask AI about this email"><span class="text-[0.7rem] font-medium text-foreground/80 truncate group-hover/row:text-foreground transition-colors tracking-tight"> </span> <span class="flex gap-1.5 text-[0.58rem] text-muted-foreground/35"><span> </span> <!></span></button> <div class="flex gap-0.5 opacity-30 group-hover/row:opacity-100 transition-opacity"><button title="Handled" class="size-5 flex items-center justify-center text-[0.64rem] font-bold rounded transition-all hover:bg-success/12 hover:text-success text-muted-foreground">\u2713</button> <button title="Dismiss" class="size-5 flex items-center justify-center text-[0.64rem] font-bold rounded transition-all hover:bg-destructive/12 hover:text-destructive text-muted-foreground">\u2715</button></div></div>'), k4 = _('<button class="text-[0.6rem] font-medium text-muted-foreground/60 hover:text-foreground hover:bg-accent px-1.5 py-0.5 rounded transition-all">All handled</button> <button class="text-[0.6rem] font-medium text-muted-foreground/40 hover:text-foreground hover:bg-accent px-1.5 py-0.5 rounded transition-all">Clear category</button>', 1), S4 = _('<span class="text-[0.6rem] text-muted-foreground/40 mr-auto"> </span> <button class="text-[0.6rem] text-muted-foreground/60 hover:text-foreground hover:bg-accent px-1.5 py-0.5 rounded transition-all">Cancel</button> <button class="text-[0.6rem] text-destructive/70 hover:text-destructive hover:bg-destructive/8 px-1.5 py-0.5 rounded transition-all">Delete</button>', 1), T4 = _('<div class="mt-2 pt-2 border-t border-border"><div class="flex items-center gap-1.5 pb-2 mb-2 border-b-2"><button class="text-xs text-muted-foreground/50 hover:text-foreground transition-colors px-1 py-0.5 rounded hover:bg-accent">\u2190</button> <span class="text-xs font-semibold text-foreground tracking-tight flex-1"> </span> <span class="text-[0.6rem] text-muted-foreground/40"> </span></div> <div class="mb-2 bg-background p-1 px-2 rounded border border-border"><!></div> <div class="flex flex-col"></div> <div class="flex items-center justify-end gap-1.5 pt-2 mt-1 border-t border-border"><!></div></div>'), A4 = _('<div class="max-w-[420px] w-full rounded border border-border bg-card px-2.5 py-2 self-start"><p class="text-xs text-muted-foreground/60 font-medium mb-2 tracking-tight"> </p> <div class="flex flex-wrap gap-1"></div> <!></div>');
function E4(t, e) {
  Be(e, true);
  let r = oe(e, "pendingData", 3, null), n = te(null), a = te(null), o = te(nt([])), i = te(null);
  function l(b) {
    g(n, s(n) === b ? null : b, true), g(a, null);
  }
  Ut(() => {
    s(n) ? (ki(s(n)).then((b) => g(o, b, true)), co(s(n)).then((b) => g(i, b, true))) : (g(o, [], true), g(i, null));
  });
  function c(b) {
    return b.split("_").map((w) => w.charAt(0) + w.slice(1).toLowerCase()).join(" ");
  }
  function f(b) {
    if (!b) return "";
    try {
      return new Date(b).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch {
      return "";
    }
  }
  function v(b) {
    if (!b) return "";
    const w = b.replace(/<.*>/, "").trim();
    return w.length > 24 ? w.slice(0, 22) + "\u2026" : w;
  }
  var x = { toggleCategory: l }, m = ke(), y = ae(m);
  {
    var h = (b) => {
      var w = A4(), D = d(w), F = d(D), B = p(D, 2);
      Ve(B, 20, () => r().order, (U) => U, (U, P) => {
        const E = H(() => r().categories[P]), S = H(() => Xo(P)), $ = H(() => s(n) === P);
        var J = x4(), W = d(J);
        let C;
        var A = p(W), k = p(A), N = d(k);
        j((O, Y, V) => {
          rt(J, 1, O), Rt(J, s($) ? `background: color-mix(in srgb, ${s(S)} 10%, transparent); border-color: color-mix(in srgb, ${s(S)} 40%, transparent); color: ${s(S)}` : ""), C = Rt(W, "", C, { background: s(S) }), T(A, ` ${Y ?? ""} `), rt(k, 1, V), T(N, s(E).length);
        }, [() => Et(Je("inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-[0.64rem] font-medium transition-all whitespace-nowrap", s($) ? "border-transparent text-foreground" : "bg-transparent border-border text-muted-foreground hover:bg-accent hover:text-foreground")), () => c(P), () => Et(Je("text-[0.58rem] font-bold min-w-[14px] text-center", s($) ? "opacity-70" : "opacity-50"))]), Ne("click", J, () => l(P)), u(U, J);
      });
      var M = p(B, 2);
      {
        var Z = (U) => {
          const P = H(() => r().categories[s(n)]), E = H(() => Xo(s(n)));
          var S = T4(), $ = d(S);
          let J;
          var W = d($), C = p(W, 2), A = d(C), k = p(C, 2), N = d(k), O = p($, 2), Y = d(O);
          os(Y, { get eventType() {
            return s(n);
          }, get category() {
            return s(i);
          }, get commands() {
            return s(o);
          } });
          var V = p(O, 2);
          Ve(V, 21, () => s(P), (L) => L.emailId, (L, G) => {
            var Q = w4(), re = d(Q), ie = d(re), le = d(ie), ce = p(ie, 2), fe = d(ce), ve = d(fe), be = p(fe, 2);
            {
              var _e40 = (Se) => {
                var Pe = y4(), pe = d(Pe);
                j((de) => T(pe, de), [() => f(s(G).date)]), u(Se, Pe);
              };
              I(be, (Se) => {
                s(G).date && Se(_e40);
              });
            }
            var xe = p(re, 2), Ae = d(xe), Ee = p(Ae, 2);
            j((Se) => {
              T(le, s(G).subject), T(ve, Se);
            }, [() => v(s(G).from)]), Ne("click", re, () => {
              var _a10;
              return (_a10 = e.onaskai) == null ? void 0 : _a10.call(e, `Tell me about the email "${s(G).subject}" from ${s(G).from}`);
            }), Ne("click", Ae, () => {
              var _a10;
              return (_a10 = e.onmarkacted) == null ? void 0 : _a10.call(e, s(G).emailId);
            }), Ne("click", Ee, () => {
              var _a10;
              return (_a10 = e.ondismiss) == null ? void 0 : _a10.call(e, s(G).emailId);
            }), u(L, Q);
          });
          var q = p(V, 2), ne = d(q);
          {
            var K = (L) => {
              var G = k4(), Q = ae(G), re = p(Q, 2);
              Ne("click", Q, () => s(P).forEach((ie) => {
                var _a10;
                return (_a10 = e.onmarkacted) == null ? void 0 : _a10.call(e, ie.emailId);
              })), Ne("click", re, () => g(a, s(n), true)), u(L, G);
            }, R = (L) => {
              var G = S4(), Q = ae(G), re = d(Q), ie = p(Q, 2), le = p(ie, 2);
              j(() => T(re, `Remove ${s(P).length ?? ""}?`)), Ne("click", ie, () => g(a, null)), Ne("click", le, () => {
                var _a10;
                (_a10 = e.onclearcategory) == null ? void 0 : _a10.call(e, s(n)), g(a, null), g(n, null);
              }), u(L, G);
            };
            I(ne, (L) => {
              s(a) !== s(n) ? L(K) : L(R, -1);
            });
          }
          j((L) => {
            J = Rt($, "", J, { "border-color": s(E) }), T(A, L), T(N, s(P).length);
          }, [() => c(s(n))]), Ne("click", W, () => {
            g(n, null), g(a, null);
          }), u(U, S);
        };
        I(M, (U) => {
          s(n) && r().categories[s(n)] && U(Z);
        });
      }
      j(() => T(F, `${r().total ?? ""} item${r().total !== 1 ? "s" : ""} need attention`)), u(b, w);
    };
    I(y, (b) => {
      r() && r().total > 0 && b(h);
    });
  }
  return u(t, m), Fe(x);
}
Zt(["click"]);
var C4 = _('<span class="inline-flex items-center gap-1.5 px-2 py-1 rounded border border-border bg-card text-xs text-muted-foreground/50"><span class="size-2.5 rounded-full border border-border border-t-primary animate-spin shrink-0"></span> Scanning\u2026</span>'), I4 = _('<button class="inline-flex items-center gap-1.5 px-2 py-1 rounded border border-primary/25 bg-primary/6 text-xs text-primary hover:bg-primary/12 hover:border-primary/40 transition-colors"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path></svg> Scan Emails</button>'), P4 = _('<div class="flex gap-1.5 px-6 py-2 shrink-0 border-t border-border"><!></div>');
function $4(t, e) {
  let r = oe(e, "hasScanData", 3, false), n = oe(e, "engineReady", 3, false), a = oe(e, "isScanning", 3, false), o = H(() => n() && !r() && !a()), i = H(() => s(o) || a());
  var l = ke(), c = ae(l);
  {
    var f = (v) => {
      var x = P4(), m = d(x);
      {
        var y = (b) => {
          var w = C4();
          u(b, w);
        }, h = (b) => {
          var w = I4();
          Ne("click", w, function(...D) {
            var _a10;
            (_a10 = e.onscan) == null ? void 0 : _a10.apply(this, D);
          }), u(b, w);
        };
        I(m, (b) => {
          a() ? b(y) : s(o) && b(h, 1);
        });
      }
      u(v, x);
    };
    I(c, (v) => {
      s(i) && v(f);
    });
  }
  u(t, l);
}
Zt(["click"]);
var N4 = _('<div class="flex flex-col gap-px"><span class="text-[0.62rem] font-bold uppercase tracking-wider text-muted-foreground/40"> </span> <span> </span></div>'), R4 = _('<span class="text-[0.58rem] font-mono text-muted-foreground/60 bg-muted border border-border px-1.5 py-0.5 rounded"> </span>'), M4 = _('<div class="col-span-2 flex flex-col gap-1.5"><span class="text-[0.62rem] font-bold uppercase tracking-wider text-muted-foreground/40"> </span> <div class="flex flex-wrap gap-1"></div></div>'), z4 = _('<div class="bg-card border-b border-border px-4 py-3 animate-[slideDown_0.15s_ease-out]"><div class="grid grid-cols-2 gap-x-6 gap-y-2"><!> <!></div></div>');
function O4(t, e) {
  Be(e, true), Xt(() => qa("GpuPanel"));
  const r = H(() => {
    var _a10, _b4, _c6;
    return [{ label: "Status", value: "Active", ok: true }, { label: "Vendor", value: e.gpuInfo.vendor }, { label: "Architecture", value: e.gpuInfo.architecture }, ...e.gpuInfo.device && e.gpuInfo.device !== "unknown" ? [{ label: "Device", value: e.gpuInfo.device }] : [], ...((_a10 = e.gpuInfo.limits) == null ? void 0 : _a10.maxBufferSize) ? [{ label: "Max Buffer", value: Tl(e.gpuInfo.limits.maxBufferSize) }] : [], ...((_b4 = e.gpuInfo.limits) == null ? void 0 : _b4.maxComputeInvocationsPerWorkgroup) ? [{ label: "Max Compute", value: String(e.gpuInfo.limits.maxComputeInvocationsPerWorkgroup) }] : [], ...((_c6 = e.gpuInfo.limits) == null ? void 0 : _c6.maxComputeWorkgroupStorageSize) ? [{ label: "Workgroup Storage", value: Tl(e.gpuInfo.limits.maxComputeWorkgroupStorageSize) }] : []];
  });
  var n = z4(), a = d(n), o = d(a);
  Ve(o, 17, () => s(r), Qe, (c, f) => {
    var v = N4(), x = d(v), m = d(x), y = p(x, 2), h = d(y);
    j(() => {
      T(m, s(f).label), rt(y, 1, Et(s(f).ok ? "text-[0.78rem] font-semibold text-success" : "text-[0.78rem] text-foreground/75 tracking-tight")), T(h, s(f).value);
    }), u(c, v);
  });
  var i = p(o, 2);
  {
    var l = (c) => {
      var f = M4(), v = d(f), x = d(v), m = p(v, 2);
      Ve(m, 21, () => e.gpuInfo.features, Qe, (y, h) => {
        var b = R4(), w = d(b);
        j(() => T(w, s(h))), u(y, b);
      }), j(() => T(x, `Features (${e.gpuInfo.features.length ?? ""})`)), u(c, f);
    };
    I(i, (c) => {
      var _a10;
      ((_a10 = e.gpuInfo.features) == null ? void 0 : _a10.length) && c(l);
    });
  }
  u(t, n), Fe();
}
var D4 = _("<textarea></textarea>");
function L4(t, e) {
  Be(e, true);
  let r = oe(e, "ref", 15, null), n = oe(e, "value", 15), a = oe(e, "data-slot", 3, "textarea"), o = ft(e, ["$$slots", "$$events", "$$legacy", "ref", "value", "class", "data-slot"]);
  var i = D4();
  Gt(i, (l) => ({ "data-slot": a(), class: l, ...o }), [() => Je("border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", e.class)]), Qn(i, (l) => r(l), () => r()), qn(i, n), u(t, i), Fe();
}
var j4 = _('<button class="w-full flex items-center justify-between text-left px-2 py-1.5 text-xs text-foreground/80 hover:bg-accent rounded-md transition-all group/btn disabled:opacity-50"><span class="flex items-center gap-1.5 min-w-0 pr-2"><span class="size-1.5 rounded-full shrink-0 shadow-sm"></span> <span class="truncate tracking-tight group-hover/btn:text-foreground"> </span></span> <span class="flex items-center gap-1.5 shrink-0"><span class="text-[0.55rem] font-bold opacity-60 tabular-nums"> </span> <span class="text-[0.55rem] font-bold tracking-wider text-muted-foreground/40 group-hover/btn:text-primary transition-colors border border-border/50 bg-background/50 px-1 rounded opacity-0 group-hover/btn:opacity-100">RUN</span></span></button>'), B4 = _('<div class="space-y-1"><div class="text-[0.65rem] font-bold text-muted-foreground/60 uppercase tracking-wider px-1 pb-1 flex justify-between items-center">Pending Actions <span class="bg-warning/20 text-warning px-1 rounded text-[0.55rem] font-black"> </span></div> <!></div>'), F4 = _('<div class="px-2 py-3 border border-dashed border-border/60 rounded-md text-center"><p class="text-[0.65rem] text-muted-foreground">No pending items.</p> <button class="mt-1.5 text-[0.65rem] font-medium text-primary hover:underline">Scan Inbox Now</button></div>'), U4 = _('<span class="text-xs text-muted-foreground/50 tabular-nums"> </span>'), G4 = _('<span class="text-xs text-muted-foreground/40 italic animate-pulse">preparing\u2026</span>'), W4 = _('<span class="text-xs text-muted-foreground/40 italic animate-pulse"> </span>'), V4 = _('<span class="text-xs text-muted-foreground/50 tabular-nums"> </span>'), H4 = _('<div class="flex items-center gap-2"><!> <!></div>'), q4 = _('<div class="flex flex-col gap-1 min-w-[70px]"><!> <!></div>'), Y4 = _('<div class="px-6 py-3 border-t border-border bg-muted/20 flex flex-wrap gap-4"><div class="flex flex-col gap-1 min-w-[70px]"><!> <!></div> <div class="flex items-center gap-2 pt-5"><!> <!></div> <!> <div class="flex flex-col gap-1 min-w-[70px]"><!> <!></div></div>'), K4 = _('<div class="m-auto flex flex-col items-center gap-2 text-center py-12"><span class="text-2xl text-muted-foreground/30">\u2726</span> <span class="text-sm font-medium text-foreground/90 tracking-tight">Start a conversation</span> <span class="text-xs text-muted-foreground/80">Ask about your emails, events, or anything else.</span></div>'), X4 = _('<div class="flex h-full w-full overflow-hidden"><div class="w-64 border-r border-border bg-card/30 flex flex-col shrink-0 overflow-y-auto hidden md:flex"><div class="px-4 py-4 border-b border-border/50 sticky top-0 bg-card/95 backdrop-blur z-10"><h3 class="text-xs font-semibold text-foreground tracking-tight flex items-center gap-2"><span class="text-[0.6rem] bg-primary/20 text-primary px-1.5 py-0.5 rounded-sm uppercase">AI Control Plane</span></h3> <p class="text-[0.65rem] text-muted-foreground mt-1.5 leading-tight">Interactive commands mapped directly to the local AI engine.</p></div> <div class="p-3 space-y-4"><div class="space-y-1"><div class="text-[0.65rem] font-bold text-muted-foreground/60 uppercase tracking-wider px-1 pb-1">Overview</div> <button class="w-full flex items-center justify-between text-left px-2.5 py-1.5 text-xs text-foreground/80 hover:text-foreground hover:bg-accent rounded-md transition-colors disabled:opacity-50"><span class="flex items-center gap-2"><span class="text-muted-foreground">\u{1F4CA}</span> Event Dashboard</span> <span class="text-[0.55rem] text-muted-foreground/50 border border-border px-1 rounded bg-background">UI</span></button></div> <!></div></div> <div class="flex flex-col h-full flex-1 min-w-0 min-h-0 bg-background"><div class="flex flex-col border-b border-border shrink-0"><div class="flex items-center gap-3 px-6 h-10 bg-card/10"><!> <!> <span class="flex-1"></span> <!> <!> <!></div> <!></div> <!> <div class="flex-1 min-h-0 overflow-y-auto px-6 py-5 flex flex-col gap-2"><!> <!></div> <!> <div class="flex items-end gap-2 px-6 py-3 pb-4 border-t border-border shrink-0"><!> <!></div></div></div>');
function Z4(t, e) {
  Be(e, true), Xt(() => qa("ChatView"));
  let r = oe(e, "messages", 23, () => []), n = oe(e, "pendingData", 3, null), a = oe(e, "hasScanData", 3, false), o = oe(e, "engineReady", 3, false), i = oe(e, "isScanning", 3, false), l = oe(e, "isRunning", 3, false), c = oe(e, "tps", 3, null), f = oe(e, "numTokens", 3, null), v = oe(e, "generationPhase", 3, null), x = oe(e, "gpuInfo", 3, null), m = oe(e, "enableThinking", 15, false), y = oe(e, "maxTokens", 15, 4096), h = oe(e, "doSample", 15, false), b = oe(e, "temperature", 15, 0.7), w = oe(e, "repetitionPenalty", 15, 1.1), D = oe(e, "backend", 3, "webgpu"), F = oe(e, "chatContainer", 15), B = te(""), M = te(false), Z = te(false);
  function U(X) {
    X.key === "Enter" && !X.shiftKey && (X.preventDefault(), P());
  }
  function P() {
    const X = s(B).trim();
    !X || l() || (g(B, ""), e.onsend(X));
  }
  function E(X) {
    l() || e.onsend(X);
  }
  function S(X) {
    X && !l() && e.onsend(X);
  }
  const $ = { ollama: { label: "Ollama", color: "text-primary border-primary/30 bg-primary/8" }, openai: { label: "OpenAI", color: "text-success border-success/30 bg-success/8" }, anthropic: { label: "Anthropic", color: "text-warning border-warning/30 bg-warning/8" }, google: { label: "Google", color: "text-info border-info/30 bg-info/8" }, xai: { label: "xAI", color: "text-foreground border-border bg-muted/30" } };
  var J = X4(), W = d(J), C = p(d(W), 2), A = d(C), k = p(d(A), 2), N = p(A, 2);
  {
    var O = (X) => {
      var se = B4(), he = d(se), ge = p(d(he)), $e = d(ge), Ie = p(he, 2);
      Ve(Ie, 16, () => n().order, (ze) => ze, (ze, Re) => {
        const Le = H(() => n().categories[Re].length), We = H(() => Xo(Re));
        var st = j4(), gt = d(st), Lt = d(gt);
        let dt;
        var Jt = p(Lt, 2), Wt = d(Jt), Nr = p(gt, 2), Rr = d(Nr), Nt = d(Rr);
        j((Sr) => {
          st.disabled = l(), dt = Rt(Lt, "", dt, { background: s(We) }), T(Wt, Sr), T(Nt, s(Le));
        }, [() => Re.split("_").join(" ")]), Ne("click", st, () => E(`[EXECUTE:CATEGORY:${Re}]`)), u(ze, st);
      }), j(() => T($e, n().total)), u(X, se);
    }, Y = (X) => {
      var se = F4(), he = p(d(se), 2);
      Ne("click", he, function(...ge) {
        var _a10;
        (_a10 = e.onscan) == null ? void 0 : _a10.apply(this, ge);
      }), u(X, se);
    };
    I(N, (X) => {
      n() && n().total > 0 ? X(O) : o() && X(Y, 1);
    });
  }
  var V = p(W, 2), q = d(V), ne = d(q), K = d(ne);
  {
    var R = (X) => {
      tt(X, { variant: "outline", size: "sm", onclick: () => g(M, !s(M)), class: "h-5 px-1.5 text-[0.6rem] font-bold uppercase tracking-wider text-success border-success/30 bg-success/8 hover:bg-success/14", children: (se, he) => {
        var ge = Ue();
        j(() => T(ge, `WebGPU ${s(M) ? "\u25B2" : "\u25BC"}`)), u(se, ge);
      }, $$slots: { default: true } });
    }, L = (X) => {
      const se = H(() => $[D()]);
      {
        let he = H(() => Je("text-[0.6rem] font-bold uppercase tracking-wider h-5 px-1.5", s(se).color));
        Cr(X, { variant: "outline", get class() {
          return s(he);
        }, children: (ge, $e) => {
          var Ie = Ue();
          j(() => T(Ie, s(se).label)), u(ge, Ie);
        }, $$slots: { default: true } });
      }
    };
    I(K, (X) => {
      x() ? X(R) : $[D()] && X(L, 1);
    });
  }
  var G = p(K, 2);
  {
    var Q = (X) => {
      var se = U4(), he = d(se);
      j((ge, $e) => T(he, `${f() ?? ""} tok \xB7 ${ge ?? ""}s \xB7 ${$e ?? ""}
            tok/s`), [() => (f() / c()).toFixed(1), () => c().toFixed(1)]), u(X, se);
    }, re = (X) => {
      var se = G4();
      u(X, se);
    }, ie = (X) => {
      var se = W4(), he = d(se);
      j((ge) => T(he, `thinking\u2026 ${ge ?? ""}`), [() => c() ? `${c().toFixed(0)} tok/s` : ""]), u(X, se);
    }, le = (X) => {
      var se = V4(), he = d(se);
      j((ge) => T(he, `${ge ?? ""} tok/s`), [() => c().toFixed(1)]), u(X, se);
    };
    I(G, (X) => {
      c() && !l() ? X(Q) : l() && v() === "preparing" ? X(re, 1) : l() && v() === "thinking" ? X(ie, 2) : c() && l() && X(le, 3);
    });
  }
  var ce = p(G, 4);
  {
    var fe = (X) => {
      var se = H4(), he = d(se);
      rn(he, { for: "thinking-switch", class: "text-xs text-muted-foreground/60 cursor-pointer", children: ($e, Ie) => {
        var ze = Ue("Thinking");
        u($e, ze);
      }, $$slots: { default: true } });
      var ge = p(he, 2);
      ql(ge, { id: "thinking-switch", get disabled() {
        return l();
      }, class: "scale-90", get checked() {
        return m();
      }, set checked($e) {
        m($e);
      } }), u(X, se);
    };
    I(ce, (X) => {
      x() && X(fe);
    });
  }
  var ve = p(ce, 2);
  {
    let X = H(() => Je("h-6 text-[0.6rem] font-semibold uppercase tracking-wider px-2", s(Z) ? "bg-accent/50 text-foreground" : "text-muted-foreground/50 hover:bg-accent/50"));
    tt(ve, { variant: "ghost", size: "sm", onclick: () => g(Z, !s(Z)), get class() {
      return s(X);
    }, children: (se, he) => {
      var ge = Ue();
      j(() => T(ge, `Generation ${s(Z) ? "\u25B2" : "\u25BC"}`)), u(se, ge);
    }, $$slots: { default: true } });
  }
  var be = p(ve, 2);
  tt(be, { variant: "ghost", size: "sm", get onclick() {
    return e.onreset;
  }, get disabled() {
    return l();
  }, class: "h-6 text-xs px-2", children: (X, se) => {
    var he = Ue("Reset");
    u(X, he);
  }, $$slots: { default: true } });
  var _e40 = p(ne, 2);
  {
    var xe = (X) => {
      var se = Y4(), he = d(se), ge = d(he);
      rn(ge, { for: "max-tokens", class: "text-[0.6rem] opacity-60", children: (dt, Jt) => {
        var Wt = Ue("Max tokens");
        u(dt, Wt);
      }, $$slots: { default: true } });
      var $e = p(ge, 2);
      $n($e, { id: "max-tokens", type: "number", min: 256, max: 32768, step: 256, get disabled() {
        return l();
      }, class: "h-7 text-xs", get value() {
        return y();
      }, set value(dt) {
        y(dt);
      } });
      var Ie = p(he, 2), ze = d(Ie);
      rn(ze, { for: "do-sample", class: "text-[0.6rem] opacity-60", children: (dt, Jt) => {
        var Wt = Ue("Sample");
        u(dt, Wt);
      }, $$slots: { default: true } });
      var Re = p(ze, 2);
      ql(Re, { id: "do-sample", get disabled() {
        return l();
      }, class: "scale-90", get checked() {
        return h();
      }, set checked(dt) {
        h(dt);
      } });
      var Le = p(Ie, 2);
      {
        var We = (dt) => {
          var Jt = q4(), Wt = d(Jt);
          rn(Wt, { for: "temperature", class: "text-[0.6rem] opacity-60", children: (Rr, Nt) => {
            var Sr = Ue("Temperature");
            u(Rr, Sr);
          }, $$slots: { default: true } });
          var Nr = p(Wt, 2);
          $n(Nr, { id: "temperature", type: "number", min: 0, max: 2, step: 0.1, get disabled() {
            return l();
          }, class: "h-7 text-xs", get value() {
            return b();
          }, set value(Rr) {
            b(Rr);
          } }), u(dt, Jt);
        };
        I(Le, (dt) => {
          h() && dt(We);
        });
      }
      var st = p(Le, 2), gt = d(st);
      rn(gt, { for: "repetition-penalty", class: "text-[0.6rem] opacity-60", children: (dt, Jt) => {
        var Wt = Ue("Rep. penalty");
        u(dt, Wt);
      }, $$slots: { default: true } });
      var Lt = p(gt, 2);
      $n(Lt, { id: "repetition-penalty", type: "number", min: 1, max: 2, step: 0.05, get disabled() {
        return l();
      }, class: "h-7 text-xs", get value() {
        return w();
      }, set value(dt) {
        w(dt);
      } }), u(X, se);
    };
    I(_e40, (X) => {
      s(Z) && X(xe);
    });
  }
  var Ae = p(q, 2);
  {
    var Ee = (X) => {
      O4(X, { get gpuInfo() {
        return x();
      } });
    };
    I(Ae, (X) => {
      s(M) && x() && X(Ee);
    });
  }
  var Se = p(Ae, 2), Pe = d(Se);
  {
    var pe = (X) => {
      var se = K4();
      u(X, se);
    };
    I(Pe, (X) => {
      r().length === 0 && X(pe);
    });
  }
  var de = p(Pe, 2);
  Ve(de, 17, r, Qe, (X, se, he) => {
    var ge = ke(), $e = ae(ge);
    {
      var Ie = (We) => {
        E4(We, { get pendingData() {
          return s(se).pendingData;
        }, get onmarkacted() {
          return e.onmarkacted;
        }, get ondismiss() {
          return e.ondismiss;
        }, get onremove() {
          return e.onremove;
        }, get onclearcategory() {
          return e.onclearcategory;
        }, onaskai: S });
      }, ze = (We) => {
        Wo(We, { get msg() {
          return s(se);
        } });
      }, Re = (We) => {
        b4(We, { get msg() {
          return s(se);
        }, get oncommand() {
          return e.oncommand;
        }, get onexecuted() {
          return e.onexecuted;
        }, ondismiss: () => r(r().filter((st, gt) => gt !== he)) });
      }, Le = (We) => {
        const st = H(() => {
          var _a10;
          return (_a10 = r().slice(0, he).filter((gt) => gt.role === "assistant").at(-1)) == null ? void 0 : _a10.model;
        });
        {
          let gt = H(() => he === r().length - 1), Lt = H(() => s(se).role === "assistant" && !!s(se).model && s(se).model !== s(st));
          pA(We, { get msg() {
            return s(se);
          }, get isLast() {
            return s(gt);
          }, get isRunning() {
            return l();
          }, get generationPhase() {
            return v();
          }, get numTokens() {
            return f();
          }, get backend() {
            return D();
          }, get showModelName() {
            return s(Lt);
          } });
        }
      };
      I($e, (We) => {
        s(se).type === "dashboard" ? We(Ie) : s(se).type === "task-card" ? We(ze, 1) : s(se).type === "event" || s(se).type === "event-batch" || s(se).type === "events-by-category" ? We(Re, 2) : We(Le, -1);
      });
    }
    u(X, ge);
  }), Qn(Se, (X) => F(X), () => F());
  var ue = p(Se, 2);
  $4(ue, { get hasScanData() {
    return a();
  }, get engineReady() {
    return o();
  }, get isScanning() {
    return i();
  }, get onscan() {
    return e.onscan;
  } });
  var me = p(ue, 2), we = d(me);
  L4(we, { rows: 1, placeholder: "Type a message\u2026", onkeydown: U, get disabled() {
    return l();
  }, class: "flex-1 resize-none min-h-[42px] max-h-[160px] overflow-y-auto leading-relaxed py-2.5", get value() {
    return s(B);
  }, set value(X) {
    g(B, X, true);
  } });
  var ye = p(we, 2);
  {
    var Te = (X) => {
      tt(X, { variant: "outline", size: "sm", get onclick() {
        return e.onstop;
      }, class: "h-[42px] px-4", children: (se, he) => {
        var ge = Ue("Stop");
        u(se, ge);
      }, $$slots: { default: true } });
    }, Oe = (X) => {
      {
        let se = H(() => !s(B).trim());
        tt(X, { size: "sm", onclick: P, get disabled() {
          return s(se);
        }, class: "h-[42px] px-4", children: (he, ge) => {
          var $e = Ue("Send");
          u(he, $e);
        }, $$slots: { default: true } });
      }
    };
    I(ye, (X) => {
      l() ? X(Te) : X(Oe, -1);
    });
  }
  j(() => k.disabled = l()), Ne("click", k, () => E("[SHOW:DASHBOARD]")), u(t, J), Fe();
}
Zt(["click"]);
var J4 = _('<div class="shrink-0 px-3 py-2 text-center text-sm bg-amber-500/20 text-amber-200 border-b border-amber-500/30" role="alert">Storage unavailable (e.g. private browsing). Settings and data are not persisted.</div>'), Q4 = _('<div class="w-full h-full overflow-y-auto flex justify-center"><div class="w-full max-w-2xl px-4 py-8 flex flex-col gap-0"><!> <!></div></div>'), eE = _('<div class="w-full h-full flex flex-col overflow-hidden"><!> <!></div>');
function tE(t, e) {
  Be(e, true);
  const r = () => zf(Oa, "$coreStore", n), [n, a] = Of(), o = !!navigator.gpu, i = Hd();
  let l = te("webgpu"), c = te("onnx-community/gpt-oss-20b-ONNX"), f = H(() => {
    const { core: pe } = r();
    if (!pe) return [];
    try {
      return pe.getApiModels();
    } catch {
      return [];
    }
  }), v = te(null), x = te(null), m = te(""), y = false, h = te(nt([])), b = te(nt([])), w = te(false), D = te(null), F = te(null), B = te(false), M = te("q4f16"), Z = te("webgpu"), U = te(4096), P = te(false), E = te(0.7), S = te(1.1), $ = te(null), J = te(null), W = te(null), C = te(null), A = te(false), k = te(false), N = false, O = te(false);
  Xt(async () => {
    try {
      const [de, ue, me, we, ye, Te, Oe, X, se] = await Promise.all([sr("aiBackend"), sr("selectedModel"), sr("enableThinking"), sr("loadDtype"), sr("loadDevice"), sr("maxTokens"), sr("doSample"), sr("temperature"), sr("repetitionPenalty")]);
      de && g(l, de, true), ue && g(c, ue, true), me !== void 0 && g(B, me, true), we && g(M, we, true), ye && g(Z, ye, true), Te != null && g(U, Te, true), Oe !== void 0 && g(P, Oe, true), X != null && g(E, X, true), se != null && g(S, se, true);
    } catch {
      g(O, true);
    }
    i.status === "idle" && i.check(), i.isReady && Y();
    const pe = i.onMessage((de) => {
      switch (de.status) {
        case "webgpu-info":
          g(J, de.data, true);
          break;
        case "loading":
          g(v, "loading"), g(m, de.data, true);
          break;
        case "initiate":
          g(h, [...s(h), de], true);
          break;
        case "progress":
          g(h, s(h).map((me) => me.file === de.file ? { ...me, ...de } : me), true);
          break;
        case "done":
          g(h, s(h).filter((me) => me.file !== de.file), true);
          break;
        case "ready":
          g(v, "ready"), Y();
          break;
        case "start":
          if (!s(w)) break;
          g(W, de.phase || "preparing", true), g(b, [...s(b), { role: "assistant", content: "", thinking: "", model: s(c) }], true);
          break;
        case "phase":
          if (!s(w)) break;
          g(W, de.phase, true);
          break;
        case "thinking": {
          if (!s(w)) break;
          g(D, de.tps, true), g(F, de.numTokens, true);
          const me = s(b)[s(b).length - 1];
          g(b, [...s(b).slice(0, -1), { ...me, thinking: (me.thinking || "") + de.content }], true), re(false);
          break;
        }
        case "thinking-done": {
          if (!s(w)) break;
          g(D, de.tps, true), g(F, de.numTokens, true);
          const me = s(b)[s(b).length - 1];
          g(b, [...s(b).slice(0, -1), { ...me, thinking: de.content }], true);
          break;
        }
        case "update": {
          if (!s(w)) break;
          g(D, de.tps, true), g(F, de.numTokens, true);
          const me = s(b)[s(b).length - 1];
          g(b, [...s(b).slice(0, -1), { ...me, content: me.content + de.output }], true), re(false);
          break;
        }
        case "complete":
          if (!s(w)) break;
          de.tps !== void 0 && g(D, de.tps, true), de.numTokens !== void 0 && g(F, de.numTokens, true), g(w, false), g(W, null);
          const ue = s(b)[s(b).length - 1];
          if (ue && ue.role === "assistant" && ue.content) {
            let me = ue.content, we = false;
            const ye = /\[EXECUTE:CATEGORY:([A-Z_]+)\]/g;
            let Te;
            const Oe = [];
            for (; (Te = ye.exec(me)) !== null; ) Oe.push(Te[1]);
            if (Oe.length > 0) {
              me = me.replace(/\[EXECUTE:CATEGORY:[A-Z_]+\]/g, "").trim(), we = true;
              for (const X of Oe) s(C) && s(C).categories && s(C).categories[X] && q(X, s(C).categories[X]);
            }
            me.includes("[SHOW:DASHBOARD]") && (me = me.replace(/\[SHOW:DASHBOARD\]/g, "").trim(), we = true, as({ pendingOnly: true }).then((X) => {
              X.order.length > 0 && Co(X).then((se) => {
                g(b, [...s(b), se], true), re();
              });
            }).catch((X) => {
              g(b, [...s(b), { role: "assistant", content: `Failed to load events dashboard: ${X.message}` }], true);
            })), we && g(b, [...s(b).slice(0, -1), { ...ue, content: me === "" ? "Okay, here you go:" : me }], true);
          }
          V();
          break;
        case "error":
          if (y && g(x, de.data, true), s(v) === "loading" && g(v, null), s(w)) {
            g(w, false), g(W, null);
            const me = s(b)[s(b).length - 1];
            me && me.role === "assistant" && !me.content && g(b, [...s(b).slice(0, -1), { ...me, content: `Error: ${de.data || "Unknown error"}` }], true);
          }
          break;
      }
    });
    return () => pe();
  });
  async function Y() {
    if (!(N || s(b).length > 0)) try {
      const pe = await li();
      g(C, pe, true), pe && (N = true, g(b, [{ role: "assistant", type: "dashboard", pendingData: pe }], true), re());
      const de = await Al();
      g(A, de.classified > 0);
    } catch {
    }
  }
  async function V() {
    try {
      const pe = await li();
      g(C, pe, true);
      const de = s(b).findIndex((we) => we.type === "dashboard");
      de !== -1 && (pe && pe.total > 0 ? g(b, s(b).map((we, ye) => ye === de ? { ...we, pendingData: pe } : we), true) : g(b, s(b).filter((we, ye) => ye !== de), true));
      const ue = s(b).findLastIndex((we) => we.type === "events-by-category");
      if (ue !== -1) {
        const we = await as({ pendingOnly: true });
        if (we.order.length === 0) g(b, s(b).filter((ye, Te) => Te !== ue), true);
        else {
          const ye = await Co(we);
          g(b, s(b).map((Te, Oe) => Oe === ue ? ye : Te), true);
        }
      }
      const me = await Al();
      g(A, me.classified > 0);
    } catch {
    }
  }
  async function q(pe, de) {
    if (!i.isReady) return;
    const ue = s(b).length, me = `${pe.split("_").map((ye) => ye.charAt(0) + ye.slice(1).toLowerCase()).join(" ")} (${de.length})`;
    g(b, [...s(b), { role: "assistant", type: "task-card", title: `Executing ${me}`, status: "running", steps: [] }], true), re();
    const we = (ye) => Object.assign(s(b)[ue], ye);
    try {
      (await $c(pe, de, (Te) => {
        var _a10;
        const Oe = s(b)[ue].steps || [];
        if (Te.phase === "pipeline_loaded") we({ steps: Te.actions.map((X) => ({ id: X.id ?? X.commandId, label: X.name ?? X.commandId, status: "pending" })) });
        else if (Te.phase === "action_start") we({ steps: Oe.map((X) => X.id === (Te.actionId ?? Te.commandId) ? { ...X, status: "running", startedAt: Date.now() } : X) });
        else if (Te.phase === "action_complete") {
          const X = ((_a10 = Te.result) == null ? void 0 : _a10.success) !== false;
          we({ steps: Oe.map((se) => {
            var _a11, _b4;
            return se.id === (Te.actionId ?? Te.commandId) ? { ...se, status: X ? "done" : "error", expandable: !!((_a11 = Te.result) == null ? void 0 : _a11.message), subContent: ((_b4 = Te.result) == null ? void 0 : _b4.message) ?? "" } : se;
          }) });
        } else Te.phase === "done" ? we({ status: (s(b)[ue].steps || []).every((X) => X.status !== "error") ? "done" : "error" }) : Te.phase === "error" && we({ status: "error", steps: [...Oe.filter((X) => X.status !== "running"), { id: "__err", label: Te.error ?? "Execution failed", status: "error" }] });
      }, true)).success && await V();
    } catch (ye) {
      we({ status: "error", steps: [...(s(b)[ue].steps ?? []).filter((Te) => Te.status !== "running"), { id: "error", label: `Execution failed: ${ye.message}`, status: "error" }] });
    }
  }
  async function ne(pe) {
    await vs(pe, "acted"), await V();
  }
  async function K(pe) {
    await vs(pe, "dismissed"), await V();
  }
  async function R(pe) {
    await Zv(pe), await V();
  }
  async function L(pe) {
    await Oc(pe), await V();
  }
  async function G() {
    var _a10;
    if (s(k) || !i.isReady) return;
    g(k, true);
    const pe = s(l) === "cloud" ? ((_a10 = s(f).find((Te) => Te.id === s(c))) == null ? void 0 : _a10.provider) || "cloud" : s(l), de = s(b).length;
    g(b, [...s(b), { role: "assistant", type: "task-card", title: "Scanning Emails", model: pe, status: "running", steps: [{ id: "fetch", label: "Fetching recent emails\u2026", status: "running", startedAt: Date.now() }] }], true), re();
    const ue = (Te) => Object.assign(s(b)[de], Te);
    let me = null, we = 0;
    const ye = [];
    try {
      let Te = null, Oe = 0;
      await Kv(i, { count: 20, onProgress: (se) => {
        var _a11, _b4, _c6;
        if (se.phase === "loading") s(b)[de].steps = [{ id: "fetch", label: "Loading recent emails\u2026", status: "running", startedAt: Date.now() }];
        else if (se.phase === "scanning") {
          Oe = se.total ?? 0, Te || (Te = Date.now());
          const he = ((_a11 = se.email) == null ? void 0 : _a11.subject) ?? "unknown", ge = he.length > 46 ? he.slice(0, 44) + "\u2026" : he;
          s(b)[de].steps = [{ id: "fetch", label: `Found ${Oe} emails to scan`, status: "done", detail: `${Oe} messages` }, ...ye, { id: `email-${se.current}`, label: ge, status: "running", startedAt: Te, detail: `${se.current}/${se.total}` }];
        } else if (se.phase === "classified") {
          const he = ((_b4 = se.email) == null ? void 0 : _b4.subject) ?? "unknown", ge = he.length > 46 ? he.slice(0, 44) + "\u2026" : he, $e = se.result, Ie = ($e == null ? void 0 : $e.categoryTier) ?? ($e == null ? void 0 : $e.category) ?? "", ze = ($e == null ? void 0 : $e.action) ?? "", Re = ($e == null ? void 0 : $e.reason) ?? "", Le = ($e == null ? void 0 : $e.summary) ?? "", We = [];
          Le && We.push(Le), ze && We.push(`Action: ${ze}`), Re && We.push(`Reason: ${Re}`), ye.push({ id: `email-${se.current}`, label: ge, status: "done", detail: ze || Ie, expandable: true, badges: [Ie, ze].filter(Boolean), subContent: We.join(`
`) }), s(b)[de].steps = [{ id: "fetch", label: `Found ${Oe} emails to scan`, status: "done", detail: `${Oe} messages` }, ...ye];
        } else se.phase === "done" && (((_c6 = se.results) == null ? void 0 : _c6.length) > 0 && (me = se.results), we = Oe);
      } });
      const X = ye.length;
      if (s(b)[de].steps = [{ id: "fetch", label: `Fetched ${we} emails`, status: "done", detail: `${we} messages` }, ...ye], s(b)[de].description = X > 0 ? `Classified ${X} email${X !== 1 ? "s" : ""} into event types. Expand any row to see classification details.` : "No new emails to classify.", ue({ status: "done", title: `Scanned ${we} Emails` }), await V(), (me == null ? void 0 : me.length) > 0) {
        const se = await db(me);
        g(b, [...s(b), se], true), re();
      }
      s(C) && !s(b).some((se) => se.type === "dashboard") && (g(b, [{ role: "assistant", type: "dashboard", pendingData: s(C) }, ...s(b)], true), re());
    } catch (Te) {
      console.error("Scan failed:", Te), s(b)[de].status = "error", s(b)[de].steps = [...(s(b)[de].steps ?? []).filter((Oe) => Oe.status !== "running"), { id: "error", label: `Scan failed: ${Te.message}`, status: "error" }];
    } finally {
      g(k, false);
    }
  }
  function Q({ event: pe, commandId: de }) {
    var _a10, _b4;
    `${de}${pe.type}${((_a10 = pe.data) == null ? void 0 : _a10.subject) || "unknown"}`, g(b, [...s(b), { role: "assistant", content: `Command: ${de}

This command is not yet implemented. In the future, "${de}" will be executed on the ${pe.source} event "${((_b4 = pe.data) == null ? void 0 : _b4.subject) || ""}".` }], true), re();
  }
  function re(pe = true) {
    dc().then(() => {
      if (!s($)) return;
      const { scrollTop: de, scrollHeight: ue, clientHeight: me } = s($), we = ue - de - me < 80;
      (pe || we) && (s($).scrollTop = s($).scrollHeight);
    });
  }
  async function ie() {
    g(v, "loading"), g(x, null), y = true;
    try {
      await _r("selectedModel", s(c)), await _r("aiBackend", s(l)), await _r("loadDtype", s(M)), await _r("loadDevice", s(Z));
    } catch {
      g(O, true);
    }
    s(l) !== "webgpu" && g(J, null);
    const pe = s(l) === "webgpu" ? { dtype: s(M), device: s(Z) } : {};
    i.loadModel(s(c), pe);
  }
  async function le() {
    g(x, null), g(v, "loading"), await i.clearCache(s(c)), await ie();
  }
  Ut(() => {
    s(l) === "webgpu" && !On.find((pe) => pe.id === s(c)) ? On[0] && g(c, On[0].id, true) : s(l) === "ollama" && !yn.find((pe) => pe.name === s(c)) ? yn[0] && g(c, yn[0].name, true) : s(l) === "cloud" && !s(f).find((pe) => pe.id === s(c)) && s(f)[0] && g(c, s(f)[0].id, true);
  }), Ut(() => {
    const pe = s(B), de = s(U), ue = s(P), me = s(E), we = s(S);
    (async () => {
      try {
        await _r("enableThinking", pe), await _r("maxTokens", de), await _r("doSample", ue), await _r("temperature", me), await _r("repetitionPenalty", we);
      } catch {
        g(O, true);
      }
    })();
  });
  async function ce(pe) {
    if (!pe || s(w)) return;
    if (pe.trim() === "[SHOW:DASHBOARD]") {
      try {
        const ye = await as({ pendingOnly: true });
        if (!ye.order.length) g(b, [...s(b), { role: "assistant", content: "No pending classified emails. Run a scan first or all events are already handled." }], true);
        else {
          const Te = await Co(ye);
          g(b, [...s(b), Te], true);
        }
      } catch (ye) {
        g(b, [...s(b), { role: "assistant", content: `Failed to load events dashboard: ${ye.message}` }], true);
      }
      re();
      return;
    }
    const ue = /^\[EXECUTE:CATEGORY:([A-Z_]+)\]$/.exec(pe.trim());
    if (ue) {
      const ye = ue[1];
      s(C) && s(C).categories && s(C).categories[ye] && q(ye, s(C).categories[ye]);
      return;
    }
    if (pe.trim().toLowerCase() === "/events") {
      g(b, [...s(b), { role: "user", content: pe }], true);
      try {
        const ye = await as({ pendingOnly: true });
        if (!ye.order.length) g(b, [...s(b), { role: "assistant", content: "No pending classified emails. Run a scan first or all events are already handled." }], true);
        else {
          const Te = await Co(ye);
          g(b, [...s(b), Te], true);
        }
      } catch (ye) {
        g(b, [...s(b), { role: "assistant", content: `Failed to load events: ${ye.message}` }], true);
      }
      re();
      return;
    }
    g(b, [...s(b), { role: "user", content: pe }], true), g(D, null), g(w, true);
    let me = [];
    try {
      const Te = /\b(email|mail|inbox|message|sent|sender|from|subject|unread|gmail|pending|action|archive|delete|reply|follow.?up|prioriti|triage|urgent)\b/i.test(pe) ? await B3(pe) : await j3();
      Te && (me = [{ role: "system", content: Te }]);
    } catch {
    }
    const we = s(b).filter((ye) => ye.type !== "dashboard" && ye.type !== "events-by-category" && ye.type !== "event-batch" && ye.type !== "event").map((ye) => ({ role: ye.role, content: ye.content }));
    i.generate([...me, ...we], { enableThinking: s(B), maxTokens: s(U), do_sample: s(P), temperature: s(E), top_p: 0.95, top_k: 50, repetition_penalty: s(S) }), re();
  }
  function fe() {
    i.interrupt();
  }
  function ve() {
    i.reset(), g(b, [], true), g(D, null), g(F, null), N = false, Y();
  }
  var be = eE(), _e40 = d(be);
  {
    var xe = (pe) => {
      var de = J4();
      u(pe, de);
    };
    I(_e40, (pe) => {
      s(O) && pe(xe);
    });
  }
  var Ae = p(_e40, 2);
  {
    var Ee = (pe) => {
      var de = Q4(), ue = d(de), me = d(ue);
      W3(me, { get isWebGPUAvailable() {
        return o;
      }, get backend() {
        return s(l);
      }, set backend(X) {
        g(l, X, true);
      } });
      var we = p(me, 2);
      {
        var ye = (X) => {
          cT(X, { get gpuInfo() {
            return s(J);
          }, get error() {
            return s(x);
          }, onload: ie, onclearerror: () => {
            g(x, null);
          }, onclearcache: le, get selectedModel() {
            return s(c);
          }, set selectedModel(se) {
            g(c, se, true);
          }, get loadDtype() {
            return s(M);
          }, set loadDtype(se) {
            g(M, se, true);
          }, get loadDevice() {
            return s(Z);
          }, set loadDevice(se) {
            g(Z, se, true);
          } });
        }, Te = (X) => {
          PT(X, { onload: ie, get selectedModel() {
            return s(c);
          }, set selectedModel(se) {
            g(c, se, true);
          }, get error() {
            return s(x);
          }, set error(se) {
            g(x, se, true);
          } });
        }, Oe = (X) => {
          BT(X, { onload: ie, get selectedModel() {
            return s(c);
          }, set selectedModel(se) {
            g(c, se, true);
          }, get error() {
            return s(x);
          }, set error(se) {
            g(x, se, true);
          } });
        };
        I(we, (X) => {
          s(l) === "webgpu" ? X(ye) : s(l) === "ollama" ? X(Te, 1) : s(l) === "cloud" && X(Oe, 2);
        });
      }
      u(pe, de);
    }, Se = (pe) => {
      YT(pe, { get message() {
        return s(m);
      }, get items() {
        return s(h);
      } });
    }, Pe = (pe) => {
      {
        let de = H(() => {
          var _a10;
          return s(l) === "cloud" ? ((_a10 = s(f).find((ue) => ue.id === s(c))) == null ? void 0 : _a10.provider) || "cloud" : s(l);
        });
        Z4(pe, { get messages() {
          return s(b);
        }, get pendingData() {
          return s(C);
        }, get hasScanData() {
          return s(A);
        }, get engineReady() {
          return i.isReady;
        }, get isScanning() {
          return s(k);
        }, get isRunning() {
          return s(w);
        }, get tps() {
          return s(D);
        }, get numTokens() {
          return s(F);
        }, get generationPhase() {
          return s(W);
        }, get gpuInfo() {
          return s(J);
        }, get backend() {
          return s(de);
        }, onsend: ce, onstop: fe, onreset: ve, onmarkacted: ne, ondismiss: K, onremove: R, onclearcategory: L, onscan: G, oncommand: Q, onexecuted: V, get enableThinking() {
          return s(B);
        }, set enableThinking(ue) {
          g(B, ue, true);
        }, get maxTokens() {
          return s(U);
        }, set maxTokens(ue) {
          g(U, ue, true);
        }, get doSample() {
          return s(P);
        }, set doSample(ue) {
          g(P, ue, true);
        }, get temperature() {
          return s(E);
        }, set temperature(ue) {
          g(E, ue, true);
        }, get repetitionPenalty() {
          return s(S);
        }, set repetitionPenalty(ue) {
          g(S, ue, true);
        }, get chatContainer() {
          return s($);
        }, set chatContainer(ue) {
          g($, ue, true);
        } });
      }
    };
    I(Ae, (pe) => {
      s(v) === null ? pe(Ee) : s(v) === "loading" ? pe(Se, 1) : pe(Pe, -1);
    });
  }
  u(t, be), Fe(), a();
}
var rE = _('<div class="flex items-center justify-center gap-4 animate-pulse h-10"><div class="h-8 w-32 bg-muted/40 rounded-full"></div> <div class="h-px w-8 bg-muted/40"></div> <div class="h-8 w-32 bg-muted/40 rounded-full"></div> <div class="h-px w-8 bg-muted/40"></div> <div class="h-8 w-32 bg-muted/40 rounded-full"></div></div>'), nE = _('<span class="text-[0.6rem] opacity-80 mt-1 leading-none"> </span>'), aE = _('<span class="text-[0.6rem] opacity-80 mt-1 leading-none">Sync needed</span>'), sE = _('<span class="text-[0.6rem] opacity-60 mt-1 leading-none">Start here</span>'), oE = _('<span class="text-[0.6rem] opacity-80 mt-1 leading-none"> </span>'), iE = _('<span class="text-[0.6rem] opacity-80 mt-1 leading-none">Ready to run</span>'), lE = _('<span class="text-[0.6rem] opacity-80 mt-1 leading-none text-amber-400/80">Load AI first</span>'), cE = _('<span class="text-[0.6rem] opacity-60 mt-1 leading-none">Pending sources</span>'), dE = _('<span class="text-[0.6rem] opacity-80 mt-1 leading-none"> </span>'), uE = _('<span class="text-[0.6rem] opacity-80 mt-1 leading-none">Configure rules</span>'), fE = _('<span class="text-[0.6rem] opacity-60 mt-1 leading-none">Pending scan</span>'), pE = _('<div class="flex items-center justify-center gap-0"><nav aria-label="Progress" class="flex items-center"><a href="#sources" class="relative flex items-center group no-underline"><div><div><!></div> <div class="flex flex-col"><span class="text-[0.7rem] font-bold uppercase tracking-wider leading-none">Sources</span> <!></div></div></a> <div></div> <a href="#scan"><div><div><!></div> <div class="flex flex-col"><span class="text-[0.7rem] font-bold uppercase tracking-wider leading-none">Scan</span> <!></div></div></a> <div></div> <a href="#pipelines" class="relative flex items-center group no-underline"><div><div><!></div> <div class="flex flex-col"><span class="text-[0.7rem] font-bold uppercase tracking-wider leading-none">Control</span> <!></div></div></a> <div class="h-8 w-px bg-border/80 ml-6 mr-1 shrink-0" aria-hidden="true"></div> <a href="#admin" class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[0.7rem] font-medium text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/60 transition-colors no-underline shrink-0" title="Admin dashboard"><!> <span class="tracking-tight">Admin</span></a></nav></div>'), vE = _('<div class="flex flex-col h-full overflow-hidden"><div class="flex items-center gap-2 px-4 h-11 shrink-0 border-b border-border bg-sidebar"><div class="size-6 rounded bg-primary flex items-center justify-center shrink-0"><!></div> <span class="text-sm font-semibold tracking-tight text-foreground">me-ai</span></div> <div class="shrink-0 border-b border-border bg-card/40 backdrop-blur-sm px-6 py-2.5"><!></div> <div class="flex-1 min-h-0 overflow-hidden flex flex-col"><!></div></div>');
function gE(t, e) {
  Be(e, true);
  let r = te(false), n = te(0), a = te(0), o = te(0), i = te(true);
  const l = Hd();
  let c = te(nt(l.isReady));
  Ut(() => l.onMessage((E) => {
    E.status === "ready" && g(c, true);
  })), Xt(async () => {
    try {
      await _a() && Cc() && g(r, true);
    } catch {
    }
    try {
      const P = await qg();
      g(n, P.totalItems ?? 0, true);
    } catch {
    }
    try {
      const P = await im();
      g(n, s(n) + (P.totalItems ?? 0));
    } catch {
    }
    try {
      await am() && g(r, true);
    } catch {
    }
    try {
      const P = await Xv();
      g(a, P.total ?? 0, true);
    } catch {
    }
    try {
      const P = await wi();
      g(o, P.total ?? 0, true);
    } catch {
    }
    g(i, false);
  });
  const f = H(() => s(r) ? s(n) > 0 ? "done" : "active" : "idle"), v = H(() => s(n) > 0 && s(c) ? s(a) > 0 ? "done" : "active" : "idle"), x = H(() => s(n) > 0 && !s(c)), m = H(() => s(a) > 0 ? s(o) > 0 ? "done" : "active" : "idle");
  var y = vE(), h = d(y), b = d(h), w = d(b);
  wg(w, { class: "size-3.5 text-primary-foreground" });
  var D = p(h, 2), F = d(D);
  {
    var B = (P) => {
      var E = rE();
      u(P, E);
    }, M = (P) => {
      var E = pE(), S = d(E), $ = d(S), J = d($), W = d(J), C = d(W);
      {
        var A = (X) => {
          Ks(X, { class: "size-3" });
        }, k = (X) => {
          gs(X, { class: "size-3" });
        };
        I(C, (X) => {
          s(f) === "done" ? X(A) : X(k, -1);
        });
      }
      var N = p(W, 2), O = p(d(N), 2);
      {
        var Y = (X) => {
          var se = nE(), he = d(se);
          j((ge) => T(he, `${ge ?? ""} emails`), [() => s(n).toLocaleString()]), u(X, se);
        }, V = (X) => {
          var se = aE();
          u(X, se);
        }, q = (X) => {
          var se = sE();
          u(X, se);
        };
        I(O, (X) => {
          s(f) === "done" ? X(Y) : s(f) === "active" ? X(V, 1) : X(q, -1);
        });
      }
      var ne = p($, 2), K = p(ne, 2), R = d(K), L = d(R), G = d(L);
      {
        var Q = (X) => {
          Ks(X, { class: "size-3" });
        }, re = (X) => {
          $x(X, { class: "size-3" });
        };
        I(G, (X) => {
          s(v) === "done" ? X(Q) : X(re, -1);
        });
      }
      var ie = p(L, 2), le = p(d(ie), 2);
      {
        var ce = (X) => {
          var se = oE(), he = d(se);
          j((ge) => T(he, `${ge ?? ""} classified`), [() => s(a).toLocaleString()]), u(X, se);
        }, fe = (X) => {
          var se = iE();
          u(X, se);
        }, ve = (X) => {
          var se = lE();
          u(X, se);
        }, be = (X) => {
          var se = cE();
          u(X, se);
        };
        I(le, (X) => {
          s(v) === "done" ? X(ce) : s(v) === "active" ? X(fe, 1) : s(x) ? X(ve, 2) : X(be, -1);
        });
      }
      var _e40 = p(K, 2), xe = p(_e40, 2), Ae = d(xe), Ee = d(Ae), Se = d(Ee);
      {
        var Pe = (X) => {
          Ks(X, { class: "size-3" });
        }, pe = (X) => {
          bg(X, { class: "size-3" });
        };
        I(Se, (X) => {
          s(m) === "done" ? X(Pe) : X(pe, -1);
        });
      }
      var de = p(Ee, 2), ue = p(d(de), 2);
      {
        var me = (X) => {
          var se = dE(), he = d(se);
          j(() => T(he, `${s(o) ?? ""}
                    ${s(o) === 1 ? "rule" : "rules"} active`)), u(X, se);
        }, we = (X) => {
          var se = uE();
          u(X, se);
        }, ye = (X) => {
          var se = fE();
          u(X, se);
        };
        I(ue, (X) => {
          s(m) === "done" ? X(me) : s(m) === "active" ? X(we, 1) : X(ye, -1);
        });
      }
      var Te = p(xe, 4), Oe = d(Te);
      xg(Oe, { class: "size-3.5 shrink-0" }), j(() => {
        rt(J, 1, `flex items-center gap-2.5 px-3 py-1.5 rounded-full transition-all duration-300 ${s(f) === "done" ? "bg-success/10 hover:bg-success/20 text-success" : s(f) === "active" ? "bg-primary/10 hover:bg-primary/20 text-primary ring-1 ring-primary/30 shadow-sm" : "hover:bg-muted/50 text-muted-foreground"}`), rt(W, 1, `flex items-center justify-center size-5 rounded-full shrink-0 transition-colors ${s(f) === "done" ? "bg-success text-success-foreground" : s(f) === "active" ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted-foreground/20 text-muted-foreground"}`), rt(ne, 1, `w-6 sm:w-12 md:w-16 h-px mx-2 transition-colors duration-500 ${s(v) !== "idle" ? "bg-primary/40" : "bg-border/60"}`), rt(K, 1, `relative flex items-center group no-underline ${s(v) === "idle" ? "pointer-events-none opacity-40 mix-blend-luminosity hover:mix-blend-normal transition-all" : ""}`), rt(R, 1, `flex items-center gap-2.5 px-3 py-1.5 rounded-full transition-all duration-300 ${s(v) === "done" ? "bg-amber-500/10 hover:bg-amber-500/20 text-amber-500" : s(v) === "active" ? "bg-primary/10 hover:bg-primary/20 text-primary ring-1 ring-primary/30 shadow-sm" : "hover:bg-muted/50 text-muted-foreground"}`), rt(L, 1, `flex items-center justify-center size-5 rounded-full shrink-0 transition-colors ${s(v) === "done" ? "bg-amber-500 text-white" : s(v) === "active" ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted-foreground/20 text-muted-foreground"}`), rt(_e40, 1, `w-6 sm:w-12 md:w-16 h-px mx-2 transition-colors duration-500 ${s(m) !== "idle" ? "bg-primary/40" : "bg-border/60"}`), rt(Ae, 1, `flex items-center gap-2.5 px-3 py-1.5 rounded-full transition-all duration-300 ${s(m) === "done" ? "bg-primary/10 hover:bg-primary/20 text-primary" : s(m) === "active" ? "bg-primary/10 hover:bg-primary/20 text-primary ring-1 ring-primary/30 shadow-sm" : "hover:bg-muted/50 text-muted-foreground"}`), rt(Ee, 1, `flex items-center justify-center size-5 rounded-full shrink-0 transition-colors ${s(m) === "done" ? "bg-primary text-primary-foreground" : s(m) === "active" ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted-foreground/20 text-muted-foreground"}`);
      }), u(P, E);
    };
    I(F, (P) => {
      s(i) ? P(B) : P(M, -1);
    });
  }
  var Z = p(D, 2), U = d(Z);
  tE(U, {}), u(t, y), Fe();
}
var mE = _('<span class="size-1.5 rounded-full shrink-0 bg-[var(--color-success)]"></span> <span class="text-[0.72rem] font-semibold text-[var(--color-success)]">Scan complete</span>', 1), hE = _('<span class="size-1.5 rounded-full shrink-0 bg-[var(--color-warning)] animate-pulse"></span> <span class="text-[0.72rem] font-medium text-muted-foreground">Loading emails\u2026</span>', 1), _E = _('<span class="size-1.5 rounded-full shrink-0 bg-primary animate-pulse"></span> <span class="text-[0.72rem] font-medium text-muted-foreground">Scanning email <strong class="text-foreground"> </strong> of <strong class="text-foreground"> </strong></span>', 1), bE = _('<span class="flex items-center gap-1 text-[0.64rem] font-medium text-destructive"><span class="opacity-70">\u2717</span> </span>'), xE = _('<span class="flex items-center gap-1 text-[0.64rem] font-medium text-muted-foreground"><span class="opacity-70">\u26A1</span> </span>'), yE = _('<div class="flex flex-wrap gap-x-3 gap-y-1 mb-2"><span class="flex items-center gap-1 text-[0.64rem] font-medium text-[var(--color-success)]"><span class="opacity-70">\u2713</span> </span> <!> <span class="flex items-center gap-1 text-[0.64rem] font-medium text-muted-foreground"><span class="opacity-70">\u23F1</span> </span> <!></div>'), wE = _('<span class="text-muted-foreground/80"> </span>'), kE = _('<span class="ml-auto text-muted-foreground/70"> </span>'), SE = _('<div class="rounded-lg border border-border bg-card p-2.5 mb-2"><div class="mb-1.5 pb-1.5 border-b border-border"><div class="text-[0.72rem] font-semibold text-foreground truncate"> </div> <div class="text-[0.6rem] text-muted-foreground"> <!></div></div> <div class="flex items-center gap-1.5 text-[0.62rem] text-muted-foreground mb-1.5"><span></span> <span> </span> <!></div> <pre class="m-0 p-2 text-[0.65rem] text-muted-foreground font-mono leading-relaxed whitespace-pre-wrap break-words max-h-[200px] overflow-y-auto rounded bg-muted/50 border border-border"> </pre></div>'), TE = _('<span class="text-[0.52rem] font-bold uppercase tracking-wide shrink-0 opacity-80"> </span>'), AE = _('<span class="text-[0.56rem] font-bold text-[var(--color-success)] uppercase tracking-wide bg-[var(--color-success)]/10 px-1.5 py-0.5 rounded shrink-0"> </span> <!>', 1), EE = _('<span class="text-[0.56rem] font-bold text-destructive bg-destructive/10 px-1.5 py-0.5 rounded shrink-0">Error</span>'), CE = _('<span class="text-muted-foreground/60">\xB7</span> ', 1), IE = _('<div class="text-[0.63rem] text-muted-foreground leading-snug mb-0.5"> </div>'), PE = _('<div class="text-[0.57rem] text-muted-foreground/80"><!> </div>'), $E = _('<div class="text-[0.62rem] text-destructive mt-0.5"> </div>'), NE = _('<details class="mt-1"><summary class="text-[0.58rem] text-muted-foreground cursor-pointer select-none hover:text-foreground">Raw AI output</summary> <pre class="mt-1 p-2 bg-muted/50 border border-border rounded text-[0.6rem] text-muted-foreground font-mono whitespace-pre-wrap break-words max-h-[200px] overflow-y-auto leading-tight"> </pre></details>'), RE = _('<div><div class="flex items-center gap-1.5 mb-0.5"><span class="text-[0.58rem] font-bold text-muted-foreground tabular-nums shrink-0"></span> <span class="text-[0.68rem] font-medium text-foreground truncate flex-1"> </span> <!></div> <div class="text-[0.58rem] text-muted-foreground mb-0.5"> <!></div> <!> <!> <!> <!></div>'), ME = _('<div class="mb-2"><div class="flex justify-between items-center mb-1.5"><span class="text-[0.62rem] font-bold text-muted-foreground uppercase tracking-wider">Processed emails</span> <span class="text-[0.6rem] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded"> </span></div> <!></div>'), zE = _('<div class="flex flex-col gap-0.5"><span class="text-base font-bold text-destructive leading-none"> </span> <span class="text-[0.58rem] text-muted-foreground uppercase tracking-wide">Errors</span></div>'), OE = _('<div class="flex flex-col gap-0.5"><span class="text-base font-bold text-muted-foreground leading-none"> </span> <span class="text-[0.58rem] text-muted-foreground uppercase tracking-wide">Skipped</span></div>'), DE = _('<div class="p-2.5 rounded-lg border border-border bg-muted/20 mb-2"><div class="flex gap-6 mb-1.5"><div class="flex flex-col gap-0.5"><span class="text-base font-bold text-foreground leading-none"> </span> <span class="text-[0.58rem] text-muted-foreground uppercase tracking-wide">Emails scanned</span></div> <div class="flex flex-col gap-0.5"><span class="text-base font-bold text-[var(--color-success)] leading-none"> </span> <span class="text-[0.58rem] text-muted-foreground uppercase tracking-wide">Classified</span></div> <!> <!></div> <div class="text-[0.6rem] text-muted-foreground"><!> <!></div></div>'), LE = _("<!> <!>", 1), jE = _("<!> <!>", 1), BE = _('<div class="mt-2 p-3 rounded-xl border border-border bg-card"><div class="flex justify-between items-center mb-1.5"><div class="flex items-center gap-1.5"><!></div> <span class="text-[0.68rem] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded"> </span></div> <div class="h-0.5 rounded bg-muted overflow-hidden mb-2"><div></div></div> <!> <!> <!> <!> <div class="flex gap-1.5 justify-end mt-2"><!></div></div>');
function FE(t, e) {
  Be(e, true);
  let r = oe(e, "progress", 3, null);
  function n(y) {
    return !y || y < 0 ? "\u2014" : y < 1e3 ? `${Math.round(y)}ms` : y < 6e4 ? `${(y / 1e3).toFixed(1)}s` : `${Math.floor(y / 6e4)}m ${Math.floor(y % 6e4 / 1e3)}s`;
  }
  function a(y) {
    return y ? y >= 1e3 ? `${(y / 1e3).toFixed(1)}k` : String(y) : "0";
  }
  function o(y) {
    if (!y) return "\u2014";
    const h = y.replace(/<.*>/, "").trim();
    return h.length > 30 ? h.slice(0, 28) + "\u2026" : h;
  }
  function i(y) {
    if (!y) return "";
    try {
      return new Date(y).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch {
      return "";
    }
  }
  let l = H(() => {
    var _a10;
    return ((_a10 = r()) == null ? void 0 : _a10.total) ? Math.round(r().current / r().total * 100) : 0;
  }), c = H(() => {
    var _a10;
    return ((_a10 = r()) == null ? void 0 : _a10.phase) === "done";
  }), f = H(() => r() ? r().phase === "loading" ? "Loading emails from database" : r().phase === "generating" || r().phase === "scanning" ? r().streamingText ? "Reading email & reasoning" : "Sending to AI model\u2026" : "Processing" : "");
  var v = ke(), x = ae(v);
  {
    var m = (y) => {
      var h = BE(), b = d(h), w = d(b), D = d(w);
      {
        var F = (K) => {
          var R = mE();
          u(K, R);
        }, B = (K) => {
          var R = hE();
          u(K, R);
        }, M = (K) => {
          var R = _E(), L = p(ae(R), 2), G = p(d(L)), Q = d(G), re = p(G, 2), ie = d(re);
          j(() => {
            T(Q, r().current ?? 0), T(ie, r().total ?? 0);
          }), u(K, R);
        };
        I(D, (K) => {
          s(c) ? K(F) : r().phase === "loading" ? K(B, 1) : K(M, -1);
        });
      }
      var Z = p(w, 2), U = d(Z), P = p(b, 2), E = d(P);
      let S;
      var $ = p(P, 2);
      {
        var J = (K) => {
          var R = yE(), L = d(R), G = p(d(L)), Q = p(L, 2);
          {
            var re = (ve) => {
              var be = bE(), _e40 = p(d(be));
              j(() => T(_e40, ` ${r().errors ?? ""} error${r().errors !== 1 ? "s" : ""}`)), u(ve, be);
            };
            I(Q, (ve) => {
              r().errors && ve(re);
            });
          }
          var ie = p(Q, 2), le = p(d(ie)), ce = p(ie, 2);
          {
            var fe = (ve) => {
              var be = xE(), _e40 = p(d(be));
              j((xe) => T(_e40, ` ${xe ?? ""} tok/s`), [() => r().live.tps.toFixed(0)]), u(ve, be);
            };
            I(ce, (ve) => {
              var _a10;
              ((_a10 = r().live) == null ? void 0 : _a10.tps) && ve(fe);
            });
          }
          j((ve) => {
            T(G, ` ${(r().classified || 0) ?? ""} classified`), T(le, ` ${ve ?? ""}`);
          }, [() => n(r().totals.elapsed)]), u(K, R);
        };
        I($, (K) => {
          r().totals && !s(c) && K(J);
        });
      }
      var W = p($, 2);
      {
        var C = (K) => {
          var R = SE(), L = d(R), G = d(L), Q = d(G), re = p(G, 2), ie = d(re), le = p(ie);
          {
            var ce = (Pe) => {
              var pe = wE(), de = d(pe);
              j((ue) => T(de, `\xB7 ${ue ?? ""}`), [() => i(r().email.date)]), u(Pe, pe);
            };
            I(le, (Pe) => {
              r().email.date && Pe(ce);
            });
          }
          var fe = p(L, 2), ve = d(fe), be = p(ve, 2), _e40 = d(be), xe = p(be, 2);
          {
            var Ae = (Pe) => {
              var pe = kE(), de = d(pe);
              j(() => T(de, `${r().live.numTokens ?? ""} tokens`)), u(Pe, pe);
            };
            I(xe, (Pe) => {
              var _a10;
              ((_a10 = r().live) == null ? void 0 : _a10.numTokens) && Pe(Ae);
            });
          }
          var Ee = p(fe, 2), Se = d(Ee);
          j((Pe, pe) => {
            T(Q, r().email.subject || "(no subject)"), T(ie, `${Pe ?? ""} `), rt(ve, 1, pe), T(_e40, s(f)), T(Se, r().streamingText || "Waiting for AI response\u2026");
          }, [() => o(r().email.from), () => Et(Je("size-1.5 rounded-full shrink-0", r().streamingText ? "bg-[var(--color-success)]" : "bg-primary/50 animate-pulse"))]), u(K, R);
        };
        I(W, (K) => {
          !s(c) && r().email && (r().phase === "generating" || r().phase === "scanning") && K(C);
        });
      }
      var A = p(W, 2);
      {
        var k = (K) => {
          var R = ME(), L = d(R), G = p(d(L), 2), Q = d(G), re = p(L, 2);
          Ve(re, 17, () => r().results, Qe, (ie, le, ce) => {
            var fe = RE(), ve = d(fe), be = d(ve);
            be.textContent = `#${ce + 1}`;
            var _e40 = p(be, 2), xe = d(_e40), Ae = p(_e40, 2);
            {
              var Ee = (ge) => {
                var $e = AE(), Ie = ae($e), ze = d(Ie), Re = p(Ie, 2);
                {
                  var Le = (We) => {
                    const st = H(() => Pn[s(le).classification.categoryTier] || Pn.CRITICAL);
                    var gt = ke(), Lt = ae(gt);
                    {
                      var dt = (Jt) => {
                        var Wt = TE();
                        let Nr;
                        var Rr = d(Wt);
                        j(() => {
                          br(Wt, "title", s(st).description), Nr = Rt(Wt, "", Nr, { color: s(st).color }), T(Rr, s(st).label);
                        }), u(Jt, Wt);
                      };
                      I(Lt, (Jt) => {
                        s(st) && Jt(dt);
                      });
                    }
                    u(We, gt);
                  };
                  I(Re, (We) => {
                    s(le).classification.categoryTier && We(Le);
                  });
                }
                j(() => T(ze, s(le).classification.action)), u(ge, $e);
              }, Se = (ge) => {
                var $e = EE();
                u(ge, $e);
              };
              I(Ae, (ge) => {
                s(le).success ? ge(Ee) : ge(Se, -1);
              });
            }
            var Pe = p(ve, 2), pe = d(Pe), de = p(pe);
            {
              var ue = (ge) => {
                var $e = CE(), Ie = p(ae($e), 1, true);
                j((ze) => T(Ie, ze), [() => i(s(le).email.date)]), u(ge, $e);
              };
              I(de, (ge) => {
                s(le).email.date && ge(ue);
              });
            }
            var me = p(Pe, 2);
            {
              var we = (ge) => {
                var $e = IE(), Ie = d($e);
                j(() => T(Ie, s(le).classification.summary)), u(ge, $e);
              };
              I(me, (ge) => {
                s(le).success && s(le).classification.summary && ge(we);
              });
            }
            var ye = p(me, 2);
            {
              var Te = (ge) => {
                var $e = PE(), Ie = d($e);
                {
                  var ze = (Le) => {
                    var We = Ue();
                    j((st) => T(We, `${st ?? ""} tok/s \xB7`), [() => s(le).stats.tps.toFixed(0)]), u(Le, We);
                  };
                  I(Ie, (Le) => {
                    s(le).stats.tps && Le(ze);
                  });
                }
                var Re = p(Ie);
                j((Le) => T(Re, `${(s(le).stats.inputTokens || 0) ?? ""} in \xB7 ${(s(le).stats.numTokens || 0) ?? ""} out \xB7 ${Le ?? ""}`), [() => n(s(le).stats.elapsed)]), u(ge, $e);
              };
              I(ye, (ge) => {
                s(le).success && s(le).stats && ge(Te);
              });
            }
            var Oe = p(ye, 2);
            {
              var X = (ge) => {
                var $e = $E(), Ie = d($e);
                j(() => T(Ie, s(le).error)), u(ge, $e);
              };
              I(Oe, (ge) => {
                s(le).success || ge(X);
              });
            }
            var se = p(Oe, 2);
            {
              var he = (ge) => {
                var $e = NE(), Ie = p(d($e), 2), ze = d(Ie);
                j(() => T(ze, s(le).rawResponse)), u(ge, $e);
              };
              I(se, (ge) => {
                s(le).rawResponse && ge(he);
              });
            }
            j((ge) => {
              rt(fe, 1, `p-2 rounded-lg border mb-1 ${s(le).success ? "border-border bg-muted/20" : "border-destructive/20 bg-destructive/5"}`), T(xe, s(le).email.subject || "(no subject)"), T(pe, ge);
            }, [() => o(s(le).email.from)]), u(ie, fe);
          }), j(() => T(Q, `${r().results.length ?? ""} / ${r().total ?? 0 ?? ""}`)), u(K, R);
        };
        I(A, (K) => {
          var _a10;
          ((_a10 = r().results) == null ? void 0 : _a10.length) > 0 && K(k);
        });
      }
      var N = p(A, 2);
      {
        var O = (K) => {
          var R = DE(), L = d(R), G = d(L), Q = d(G), re = d(Q), ie = p(G, 2), le = d(ie), ce = d(le), fe = p(ie, 2);
          {
            var ve = (de) => {
              var ue = zE(), me = d(ue), we = d(me);
              j(() => T(we, r().errors)), u(de, ue);
            };
            I(fe, (de) => {
              r().errors > 0 && de(ve);
            });
          }
          var be = p(fe, 2);
          {
            var _e40 = (de) => {
              var ue = OE(), me = d(ue), we = d(me);
              j(() => T(we, r().summary.skipped)), u(de, ue);
            };
            I(be, (de) => {
              var _a10;
              ((_a10 = r().summary) == null ? void 0 : _a10.skipped) && de(_e40);
            });
          }
          var xe = p(L, 2), Ae = d(xe);
          {
            var Ee = (de) => {
              var ue = Ue();
              j(() => T(ue, `Avg speed: ${r().summary.avgTps ?? ""} tok/s \xB7`)), u(de, ue);
            };
            I(Ae, (de) => {
              var _a10;
              ((_a10 = r().summary) == null ? void 0 : _a10.avgTps) && de(Ee);
            });
          }
          var Se = p(Ae), Pe = p(Se);
          {
            var pe = (de) => {
              var ue = Ue();
              j(() => T(ue, `\xB7 ${r().summary.modelName ?? ""}`)), u(de, ue);
            };
            I(Pe, (de) => {
              var _a10;
              ((_a10 = r().summary) == null ? void 0 : _a10.modelName) && de(pe);
            });
          }
          j((de, ue, me) => {
            var _a10;
            T(re, ((_a10 = r().summary) == null ? void 0 : _a10.processed) || r().total || 0), T(ce, r().classified || 0), T(Se, ` Tokens: ${de ?? ""} in / ${ue ?? ""} out \xB7 Time: ${me ?? ""} `);
          }, [() => a(r().totals.inputTokens), () => a(r().totals.outputTokens), () => n(r().totals.elapsed)]), u(K, R);
        };
        I(N, (K) => {
          s(c) && r().totals && K(O);
        });
      }
      var Y = p(N, 2), V = d(Y);
      {
        var q = (K) => {
          var R = LE(), L = ae(R);
          tt(L, { variant: "outline", size: "sm", get onclick() {
            return e.oninspect;
          }, class: "text-xs h-7", children: (Q, re) => {
            var ie = Ue("View Prompt");
            u(Q, ie);
          }, $$slots: { default: true } });
          var G = p(L, 2);
          tt(G, { size: "sm", get onclick() {
            return e.onclose;
          }, class: "text-xs h-7", children: (Q, re) => {
            var ie = Ue("Done");
            u(Q, ie);
          }, $$slots: { default: true } }), u(K, R);
        }, ne = (K) => {
          var R = jE(), L = ae(R);
          tt(L, { variant: "outline", size: "sm", get onclick() {
            return e.oninspect;
          }, class: "text-xs h-7", children: (Q, re) => {
            var ie = Ue("View Prompt");
            u(Q, ie);
          }, $$slots: { default: true } });
          var G = p(L, 2);
          tt(G, { variant: "destructive", size: "sm", get onclick() {
            return e.onstop;
          }, class: "text-xs h-7", children: (Q, re) => {
            var ie = Ue("Stop");
            u(Q, ie);
          }, $$slots: { default: true } }), u(K, R);
        };
        I(V, (K) => {
          s(c) ? K(q) : K(ne, -1);
        });
      }
      j(() => {
        T(U, `${s(l) ?? ""}%`), rt(E, 1, `h-full rounded transition-[width] duration-300 ${s(c) ? "bg-[var(--color-success)]" : "bg-primary"}`), S = Rt(E, "", S, { width: `${s(l) ?? ""}%` });
      }), u(y, h);
    };
    I(x, (y) => {
      r() && y(m);
    });
  }
  u(t, v), Fe();
}
var UE = _('<div class="size-3.5 border-2 border-border border-t-primary rounded-full animate-spin"></div>'), GE = _('<div class="flex items-center gap-2 px-4 py-2 border-b border-border/40 text-xs text-muted-foreground/60"><span class="tabular-nums"> </span> <span class="text-muted-foreground/20">\xB7</span> <span class="tabular-nums"> </span> <span class="text-muted-foreground/20">\xB7</span> <span class="tabular-nums"> </span></div>'), WE = _("<option> </option>"), VE = _('<p class="px-4 pb-3 -mt-1 text-xs text-muted-foreground/40 italic">Load a model on the Chat page first, then come back to scan.</p>'), HE = _('<div class="rounded border border-border bg-card mb-4 overflow-hidden"><div class="flex items-center gap-3 px-4 py-3 border-b border-border"><div class="size-7 rounded border border-border bg-muted/30 flex items-center justify-center shrink-0 text-muted-foreground"><!></div> <div class="flex-1 min-w-0"><div class="flex items-center gap-2 mb-0.5"><span class="text-sm font-semibold tracking-tight text-foreground">Email Triage</span> <button class="flex items-center gap-1 px-1.5 py-0.5 rounded border border-border text-[0.6rem] text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors">Prompt</button></div> <div class="flex items-center gap-1.5"><span class="size-1.5 rounded-full shrink-0"></span> <span class="text-xs text-muted-foreground"> </span></div></div></div> <!> <div class="flex items-center gap-3 px-4 py-3"><div class="flex items-center gap-2"><span class="text-xs text-muted-foreground">Emails:</span> <select class="h-7 rounded border border-input bg-background px-2 text-xs text-foreground disabled:opacity-50"></select></div> <div class="flex items-center gap-1.5 ml-auto"><!> <!></div></div> <!> <!></div>');
function qE(t, e) {
  Be(e, true);
  let r = oe(e, "engineStatus", 3, "idle"), n = oe(e, "modelName", 3, ""), a = oe(e, "isScanning", 3, false), o = oe(e, "scanProgress", 3, null), i = oe(e, "scanCount", 15, 20), l = oe(e, "stats", 3, null);
  const c = [{ value: 1, label: "1" }, { value: 3, label: "3" }, { value: 5, label: "5" }, { value: 10, label: "10" }, { value: 20, label: "20" }, { value: 50, label: "50" }, { value: 100, label: "100" }, { value: 500, label: "500" }];
  function f() {
    return r() === "ready" ? `${n()} ready` : r() === "loading" ? "Loading model..." : r() === "generating" ? "Model busy..." : "No model loaded";
  }
  function v() {
    return r() === "ready" ? "var(--color-success)" : r() === "loading" ? "var(--color-warning)" : "var(--color-muted-foreground)";
  }
  function x() {
    return r() === "ready" && !a();
  }
  let m = H(() => {
    var _a10;
    return a() && ((_a10 = o()) == null ? void 0 : _a10.phase) !== "done";
  });
  var y = HE(), h = d(y), b = d(h), w = d(b);
  {
    var D = (R) => {
      var L = UE();
      u(R, L);
    }, F = (R) => {
      Jo(R, { class: "size-3.5" });
    };
    I(w, (R) => {
      s(m) ? R(D) : R(F, -1);
    });
  }
  var B = p(b, 2), M = d(B), Z = p(d(M), 2), U = p(M, 2), P = d(U);
  let E;
  var S = p(P, 2), $ = d(S), J = p(h, 2);
  {
    var W = (R) => {
      var L = GE(), G = d(L), Q = d(G), re = p(G, 4), ie = d(re), le = p(re, 4), ce = d(le);
      j(() => {
        T(Q, `${l().totalEmails ?? ""} in storage`), T(ie, `${l().classified ?? ""} classified`), T(ce, `${l().unclassified ?? ""} new`);
      }), u(R, L);
    };
    I(J, (R) => {
      l() && R(W);
    });
  }
  var C = p(J, 2), A = d(C), k = p(d(A), 2);
  Ve(k, 21, () => c, Qe, (R, L) => {
    var G = WE(), Q = d(G), re = {};
    j(() => {
      T(Q, s(L).label), re !== (re = s(L).value) && (G.value = (G.__value = s(L).value) ?? "");
    }), u(R, G);
  });
  var N = p(A, 2), O = d(N);
  {
    let R = H(() => !x());
    tt(O, { variant: "default", size: "sm", get onclick() {
      return e.onscan;
    }, get disabled() {
      return s(R);
    }, class: "h-7 text-xs", children: (L, G) => {
      var Q = Ue();
      j(() => T(Q, s(m) ? "Scanning\u2026" : a() ? "Finalizing\u2026" : "Scan New")), u(L, Q);
    }, $$slots: { default: true } });
  }
  var Y = p(O, 2);
  {
    let R = H(() => !x());
    tt(Y, { variant: "outline", size: "sm", get onclick() {
      return e.onrescan;
    }, get disabled() {
      return s(R);
    }, class: "h-7 text-xs", children: (L, G) => {
      var Q = Ue("Rescan All");
      u(L, Q);
    }, $$slots: { default: true } });
  }
  var V = p(C, 2);
  {
    var q = (R) => {
      var L = VE();
      u(R, L);
    };
    I(V, (R) => {
      r() !== "ready" && r() !== "loading" && R(q);
    });
  }
  var ne = p(V, 2);
  {
    var K = (R) => {
      FE(R, { get progress() {
        return o();
      }, get onstop() {
        return e.onstop;
      }, get oninspect() {
        return e.oninspect;
      }, get onclose() {
        return e.oncloseprogress;
      } });
    };
    I(ne, (R) => {
      var _a10;
      (a() || ((_a10 = o()) == null ? void 0 : _a10.phase) === "done") && R(K);
    });
  }
  j((R, L) => {
    E = Rt(P, "", E, R), T($, L), k.disabled = a();
  }, [() => ({ background: v() }), f]), Ne("click", Z, function(...R) {
    var _a10;
    (_a10 = e.oninspect) == null ? void 0 : _a10.apply(this, R);
  }), Mn(k, i), u(t, y), Fe();
}
Zt(["click"]);
var YE = _('<span class="row-date svelte-1czytqk"> </span>'), KE = _('<span class="tag svelte-1czytqk"> </span>'), XE = _('<span class="row-tags svelte-1czytqk"></span>'), ZE = _('<span class="row-reason svelte-1czytqk"><strong class="opacity-50 text-[0.6rem] uppercase tracking-widest mr-1">Reason:</strong> </span>'), JE = _('<button class="icon-btn exec-btn svelte-1czytqk" title="Execute actions"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg></button>'), QE = _('<!> <button class="icon-btn done-btn svelte-1czytqk" title="Mark handled"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg></button> <button class="icon-btn dismiss-btn svelte-1czytqk" title="Dismiss"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>', 1), eC = _('<span class="status-label svelte-1czytqk"> </span>'), tC = _('<button class="icon-btn remove-btn svelte-1czytqk" title="Remove classification"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"></path><path d="M8 6V4h8v2"></path><path d="m19 6-.867 12.142A2 2 0 0 1 16.138 20H7.862a2 2 0 0 1-1.995-1.858L5 6"></path></svg></button>'), rC = _('<p class="summary-reason svelte-1czytqk"><strong class="opacity-50 text-[0.6rem] uppercase tracking-widest mr-1">Reason:</strong> </p>'), nC = _('<div class="summary-panel svelte-1czytqk"><p class="summary-text svelte-1czytqk"> </p> <!></div>'), aC = _('<div><button class="row-left svelte-1czytqk"><span class="row-subject svelte-1czytqk"> </span> <span class="row-meta svelte-1czytqk"><span class="row-from svelte-1czytqk"> </span> <!></span> <!> <!></button> <div class="row-actions svelte-1czytqk"><!> <!></div></div> <!>', 1);
function uf(t, e) {
  Be(e, true);
  let r = oe(e, "actionColor", 3, "#666"), n = oe(e, "dimmed", 3, false);
  function a(k) {
    if (!k) return "";
    try {
      return new Date(k).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch {
      return "";
    }
  }
  let o = H(() => e.item.status === "pending"), i = te(false);
  var l = aC(), c = ae(l);
  let f;
  var v = d(c);
  let x;
  var m = d(v), y = d(m), h = p(m, 2), b = d(h), w = d(b), D = p(b, 2);
  {
    var F = (k) => {
      var N = YE(), O = d(N);
      j((Y) => T(O, Y), [() => a(e.item.date)]), u(k, N);
    };
    I(D, (k) => {
      e.item.date && k(F);
    });
  }
  var B = p(h, 2);
  {
    var M = (k) => {
      var N = XE();
      Ve(N, 21, () => e.item.tags, Qe, (O, Y) => {
        var V = KE();
        let q;
        var ne = d(V);
        j((K) => {
          q = Rt(V, "", q, K), T(ne, s(Y));
        }, [() => ({ background: Rb(s(Y)) })]), u(O, V);
      }), u(k, N);
    };
    I(B, (k) => {
      e.item.tags && e.item.tags.length > 0 && k(M);
    });
  }
  var Z = p(B, 2);
  {
    var U = (k) => {
      var N = ZE(), O = p(d(N));
      j(() => T(O, ` ${e.item.reason ?? ""}`)), u(k, N);
    };
    I(Z, (k) => {
      e.item.reason && !s(i) && k(U);
    });
  }
  var P = p(v, 2), E = d(P);
  {
    var S = (k) => {
      var N = QE(), O = ae(N);
      {
        var Y = (ne) => {
          var K = JE();
          Ne("click", K, (R) => {
            R.stopPropagation(), e.onexecute(e.item);
          }), u(ne, K);
        };
        I(O, (ne) => {
          e.onexecute && ne(Y);
        });
      }
      var V = p(O, 2), q = p(V, 2);
      Ne("click", V, (ne) => {
        ne.stopPropagation(), e.onmarkacted(e.item.emailId);
      }), Ne("click", q, (ne) => {
        ne.stopPropagation(), e.ondismiss(e.item.emailId);
      }), u(k, N);
    }, $ = (k) => {
      var N = eC(), O = d(N);
      j(() => T(O, e.item.status)), u(k, N);
    };
    I(E, (k) => {
      s(o) ? k(S) : k($, -1);
    });
  }
  var J = p(E, 2);
  {
    var W = (k) => {
      var N = tC();
      Ne("click", N, (O) => {
        O.stopPropagation(), e.onremove(e.item.emailId);
      }), u(k, N);
    };
    I(J, (k) => {
      e.onremove && k(W);
    });
  }
  var C = p(c, 2);
  {
    var A = (k) => {
      var N = nC();
      let O;
      var Y = d(N), V = d(Y), q = p(Y, 2);
      {
        var ne = (K) => {
          var R = rC(), L = p(d(R));
          j(() => T(L, ` ${e.item.reason ?? ""}`)), u(K, R);
        };
        I(q, (K) => {
          e.item.reason && K(ne);
        });
      }
      j(() => {
        O = Rt(N, "", O, { "border-left-color": r() }), T(V, e.item.summary);
      }), u(k, N);
    };
    I(C, (k) => {
      s(i) && e.item.summary && k(A);
    });
  }
  j(() => {
    f = rt(c, 1, "email-row svelte-1czytqk", null, f, { dimmed: n() }), x = Rt(v, "", x, { "border-left-color": r() }), T(y, e.item.subject), T(w, e.item.from);
  }), Ne("click", v, () => g(i, !s(i))), u(t, l), Fe();
}
Zt(["click"]);
var sC = _('<span class="text-xs text-muted-foreground/40"> </span>'), oC = _('<div class="text-[0.65rem] font-bold text-muted-foreground/50 uppercase tracking-widest pl-1 pt-1 pb-2">Category Pipeline</div>'), iC = _('<p class="text-xs text-muted-foreground/40 text-center py-6">No emails in this category.</p>'), lC = _('<details class="border-t border-border/40"><summary class="px-4 py-2 text-xs text-muted-foreground/40 cursor-pointer hover:text-muted-foreground select-none transition-colors"> </summary> <!></details>'), cC = _('<button class="text-xs text-muted-foreground/40 hover:text-muted-foreground underline transition-colors">Clear category</button>'), dC = _('<div class="flex items-center gap-2 text-xs text-muted-foreground/60"><span> </span> <button class="hover:text-foreground transition-colors">Cancel</button> <button class="text-destructive hover:text-destructive/80 transition-colors">Delete</button></div>'), uC = _('<div class="border-t border-border/40"><div class="bg-background/50 border-b border-border/40 p-2 overflow-x-auto"><!> <!></div> <!> <!> <!> <div class="flex justify-end px-4 py-2 border-t border-border/40"><!></div></div>'), fC = _('<div class="rounded border border-border bg-card overflow-hidden"><button class="flex items-center gap-2.5 w-full px-4 py-2.5 text-left hover:bg-accent/30 transition-colors"><span class="text-[0.6rem] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded text-white shrink-0"> </span> <span class="text-sm font-semibold tabular-nums text-foreground"> </span> <!> <span class="flex-1"></span> <!></button> <!></div>');
function pC(t, e) {
  Be(e, true);
  let r = oe(e, "color", 3, "#888");
  oe(e, "count", 3, 0);
  let n = oe(e, "items", 19, () => []), a = oe(e, "expanded", 3, false), o = H(() => n().filter((P) => P.status === "pending")), i = H(() => n().filter((P) => P.status !== "pending")), l = te(false), c = te(nt([])), f = te(null);
  Ut(() => {
    a() && e.action && (ki(e.action).then((P) => g(c, P, true)), co(e.action).then((P) => g(f, P, true)));
  });
  function v(P) {
    return P.split("_").map((E) => E.charAt(0) + E.slice(1).toLowerCase()).join(" ");
  }
  var x = fC(), m = d(x), y = d(m);
  let h;
  var b = d(y), w = p(y, 2), D = d(w), F = p(w, 2);
  {
    var B = (P) => {
      var E = sC(), S = d(E);
      j(() => T(S, `${s(i).length ?? ""} handled`)), u(P, E);
    };
    I(F, (P) => {
      s(i).length > 0 && P(B);
    });
  }
  var M = p(F, 4);
  {
    let P = H(() => Je("size-3.5 text-muted-foreground/40 transition-transform", a() && "rotate-180"));
    mg(M, { get class() {
      return s(P);
    } });
  }
  var Z = p(m, 2);
  {
    var U = (P) => {
      var E = uC(), S = d(E), $ = d(S);
      {
        var J = (K) => {
          var R = oC();
          u(K, R);
        };
        I($, (K) => {
          s(f) && K(J);
        });
      }
      var W = p($, 2);
      os(W, { get eventType() {
        return e.action;
      }, get category() {
        return s(f);
      }, get commands() {
        return s(c);
      } });
      var C = p(S, 2);
      {
        var A = (K) => {
          var R = iC();
          u(K, R);
        };
        I(C, (K) => {
          s(o).length === 0 && s(i).length === 0 && K(A);
        });
      }
      var k = p(C, 2);
      Ve(k, 17, () => s(o), (K) => K.emailId, (K, R) => {
        uf(K, { get item() {
          return s(R);
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
      var N = p(k, 2);
      {
        var O = (K) => {
          var R = lC(), L = d(R), G = d(L), Q = p(L, 2);
          Ve(Q, 17, () => s(i), (re) => re.emailId, (re, ie) => {
            uf(re, { get item() {
              return s(ie);
            }, get actionColor() {
              return r();
            }, get onremove() {
              return e.onremove;
            }, dimmed: true });
          }), j(() => T(G, `${s(i).length ?? ""} handled`)), u(K, R);
        };
        I(N, (K) => {
          s(i).length > 0 && K(O);
        });
      }
      var Y = p(N, 2), V = d(Y);
      {
        var q = (K) => {
          var R = cC();
          Ne("click", R, () => g(l, true)), u(K, R);
        }, ne = (K) => {
          var R = dC(), L = d(R), G = d(L), Q = p(L, 2), re = p(Q, 2);
          j(() => T(G, `Clear ${n().length ?? ""} items?`)), Ne("click", Q, () => g(l, false)), Ne("click", re, () => {
            e.onclearcategory(), g(l, false);
          }), u(K, R);
        };
        I(V, (K) => {
          s(l) ? K(ne, -1) : K(q);
        });
      }
      u(P, E);
    };
    I(Z, (P) => {
      a() && P(U);
    });
  }
  j((P) => {
    h = Rt(y, "", h, { background: r() }), T(b, P), T(D, s(o).length);
  }, [() => v(e.action)]), Ne("click", m, function(...P) {
    var _a10;
    (_a10 = e.ontoggle) == null ? void 0 : _a10.apply(this, P);
  }), u(t, x), Fe();
}
Zt(["click"]);
var vC = _(`<div class="section-desc svelte-10pcy9j">This is the system prompt sent to the LLM before each email. It instructs the model
            on how to classify emails and what JSON format to produce.</div> <pre class="code-block svelte-10pcy9j"> </pre>`, 1), gC = _('<div class="template-format svelte-10pcy9j"><div class="format-label svelte-10pcy9j">Sample (first scanned email):</div> <pre class="code-block sample svelte-10pcy9j"> </pre></div>'), mC = _('<div class="section-desc svelte-10pcy9j" style="margin-top: 0.5rem;">No emails scanned yet. Run a scan to see a real example here.</div>'), hC = _(`<div class="section-desc svelte-10pcy9j">Each email is formatted into this template and sent as the user message.
            The full email body is included.</div> <div class="template-format svelte-10pcy9j"><div class="format-label svelte-10pcy9j">Format:</div> <pre class="code-block template svelte-10pcy9j"></pre></div> <!>`, 1), _C = _(`<div class="section-desc svelte-10pcy9j">These generation parameters control how the LLM produces its output
            for email classification.</div> <div class="config-grid svelte-10pcy9j"><div class="config-row svelte-10pcy9j"><span class="config-key svelte-10pcy9j">max_new_tokens</span> <span class="config-val svelte-10pcy9j"> </span> <span class="config-desc svelte-10pcy9j">Maximum tokens in the response (classification needs ~150)</span></div> <div class="config-row svelte-10pcy9j"><span class="config-key svelte-10pcy9j">enable_thinking</span> <span class="config-val svelte-10pcy9j"> </span> <span class="config-desc svelte-10pcy9j">Thinking mode disabled \u2014 structured JSON doesn't need reasoning</span></div> <div class="config-row svelte-10pcy9j"><span class="config-key svelte-10pcy9j">do_sample</span> <span class="config-val svelte-10pcy9j"> </span> <span class="config-desc svelte-10pcy9j">Greedy decoding \u2014 deterministic, consistent output</span></div></div> <div class="section-desc svelte-10pcy9j" style="margin-top: 1rem;">The full message array sent to the model:</div> <pre class="code-block svelte-10pcy9j"></pre>`, 1), bC = _('<div class="backdrop svelte-10pcy9j"><div class="modal svelte-10pcy9j" role="dialog" aria-label="Prompt Inspector"><div class="modal-header svelte-10pcy9j"><h2 class="svelte-10pcy9j">Prompt Inspector</h2> <button class="close-btn svelte-10pcy9j" aria-label="Close">\u2715</button></div> <div class="tabs svelte-10pcy9j"><button>System Prompt</button> <button>Email Template</button> <button>Generation Config</button></div> <div class="modal-body svelte-10pcy9j"><!></div></div></div>');
function xC(t, e) {
  Be(e, true);
  let r = oe(e, "open", 15, false), n = oe(e, "sampleEmail", 3, null), a = te("system");
  function o() {
    return n() ? Jv(n()) : null;
  }
  function i() {
    r(false);
  }
  function l(x) {
    x.target === x.currentTarget && i();
  }
  var c = ke(), f = ae(c);
  {
    var v = (x) => {
      var m = bC(), y = d(m), h = d(y), b = p(d(h), 2), w = p(h, 2), D = d(w);
      let F;
      var B = p(D, 2);
      let M;
      var Z = p(B, 2);
      let U;
      var P = p(w, 2), E = d(P);
      {
        var S = (W) => {
          var C = vC(), A = p(ae(C), 2), k = d(A);
          j((N) => T(k, N), [Cb]), u(W, C);
        }, $ = (W) => {
          var C = hC(), A = p(ae(C), 2), k = p(d(A), 2);
          k.textContent = `Subject: {email.subject}
From: {email.from}
To: {email.to}
Date: {formatted date}
Labels: {email.labels}

{email.body (full content)`;
          var N = p(A, 2);
          {
            var O = (q) => {
              var ne = gC(), K = p(d(ne), 2), R = d(K);
              j((L) => T(R, L), [o]), u(q, ne);
            }, Y = H(() => o()), V = (q) => {
              var ne = mC();
              u(q, ne);
            };
            I(N, (q) => {
              s(Y) ? q(O) : q(V, -1);
            });
          }
          u(W, C);
        }, J = (W) => {
          var C = _C(), A = p(ae(C), 2), k = d(A), N = p(d(k), 2), O = d(N), Y = p(k, 2), V = p(d(Y), 2), q = d(V), ne = p(Y, 2), K = p(d(ne), 2), R = d(K), L = p(A, 4);
          L.textContent = `[
  { role: "system", content: getSystemPrompt() },
  { role: "user",   content: formatEmailPrompt(email) }
]`, j(() => {
            T(O, Hv.maxTokens), T(q, "false"), T(R, "false");
          }), u(W, C);
        };
        I(E, (W) => {
          s(a) === "system" ? W(S) : s(a) === "email" ? W($, 1) : s(a) === "config" && W(J, 2);
        });
      }
      j(() => {
        F = rt(D, 1, "tab svelte-10pcy9j", null, F, { active: s(a) === "system" }), M = rt(B, 1, "tab svelte-10pcy9j", null, M, { active: s(a) === "email" }), U = rt(Z, 1, "tab svelte-10pcy9j", null, U, { active: s(a) === "config" });
      }), Ne("click", m, l), Ne("keydown", m, (W) => W.key === "Escape" && i()), Ne("click", b, i), Ne("click", D, () => g(a, "system")), Ne("click", B, () => g(a, "email")), Ne("click", Z, () => g(a, "config")), u(x, m);
    };
    I(f, (x) => {
      r() && x(v);
    });
  }
  u(t, c), Fe();
}
Zt(["click", "keydown"]);
var yC = _('<div class="flex items-center justify-between px-3 py-2 rounded border border-destructive/30 bg-destructive/8 text-xs text-destructive mb-4"><span> </span> <button class="text-destructive/60 hover:text-destructive ml-3 transition-colors">\u2715</button></div>'), wC = _('<div class="flex items-center justify-between px-3 py-2 rounded border border-success/30 bg-success/8 text-xs text-success mb-4"><span> </span> <button class="text-success/60 hover:text-success ml-3 transition-colors">\u2715</button></div>'), kC = _('<span class="ml-auto text-[10px] font-bold uppercase text-emerald-500/80 bg-emerald-500/10 px-1.5 py-0.5 rounded">Auto</span>'), SC = _('<span class="ml-auto text-[10px] uppercase text-muted-foreground/40 font-medium"> </span>'), TC = _('<div class="flex flex-col gap-2"><div class="flex items-center gap-2 mb-1 pl-1"><span class="size-2 rounded-full"></span> <h3 class="text-xs font-bold uppercase tracking-widest text-muted-foreground/70"> </h3> <!></div> <div class="flex flex-col gap-2"></div></div>'), AC = _('<div class="flex flex-col gap-6"></div> <div class="pt-3 mt-1 border-t border-border"><span class="text-xs text-muted-foreground/40 tabular-nums"> </span></div>', 1), EC = _(`<div class="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="opacity-20"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"></path><rect x="9" y="3" width="6" height="4" rx="1"></rect><path d="m9 14 2 2 4-4"></path></svg> <span class="text-sm">No emails classified yet</span> <p class="text-xs text-muted-foreground/50 text-center max-w-[340px] leading-relaxed">Click <strong class="text-muted-foreground/70">Scan New</strong> to classify
          your recent emails. The LLM will determine action types, tags, and summaries
          automatically.</p></div>`), CC = _("<!> <!> <!> <!>", 1), IC = _('<div class="flex flex-col h-full overflow-hidden"><div class="flex items-center justify-between px-8 pt-5 pb-4 shrink-0 border-b border-border"><div><div class="flex items-center gap-2 mb-0.5"><h1 class="text-sm font-semibold tracking-tight text-foreground">Email Triage</h1> <span class="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground/50">/ scan</span></div> <p class="text-xs text-muted-foreground">Classify emails using AI and execute actions by category.</p></div> <div class="flex items-center gap-1"><a href="#admin" class="inline-flex items-center gap-1.5 h-7 px-2 text-xs text-muted-foreground hover:text-foreground transition-colors rounded hover:bg-accent no-underline"><!>Admin</a></div></div> <!> <!></div>');
function PC(t, e) {
  Be(e, true);
  let r = oe(e, "categories", 19, () => ({})), n = oe(e, "categoryOrder", 19, () => []), a = oe(e, "eventTypeToCategory", 19, () => ({})), o = oe(e, "counts", 19, () => ({})), i = oe(e, "stats", 3, null), l = oe(e, "expandedCategory", 3, null), c = oe(e, "isScanning", 3, false), f = oe(e, "scanProgress", 3, null), v = oe(e, "scanCount", 15, 20), x = oe(e, "error", 3, null), m = oe(e, "successMsg", 3, null), y = te(false), h = H(() => {
    for (const E of n()) {
      const S = r()[E];
      if ((S == null ? void 0 : S.length) > 0) return S[0];
    }
    return null;
  });
  const b = ["critical", "info", "noise"];
  let w = H(() => {
    const E = [];
    for (const $ of b) {
      const J = n().filter((W) => a()[W] === $);
      J.length > 0 && E.push({ name: $, category: tb[$], actionIds: J });
    }
    const S = n().filter(($) => !b.includes(a()[$]));
    return S.length > 0 && E.push({ name: "unknown", category: { name: "unknown", label: "Other", color: "#888", policy: "manual" }, actionIds: S }), E;
  });
  var D = IC(), F = d(D), B = p(d(F), 2), M = d(B), Z = d(M);
  xg(Z, { class: "size-3.5" });
  var U = p(F, 2);
  xC(U, { get sampleEmail() {
    return s(h);
  }, get open() {
    return s(y);
  }, set open(E) {
    g(y, E, true);
  } });
  var P = p(U, 2);
  jn(P, { class: "flex-1 min-h-0 px-8 py-5", children: (E, S) => {
    var $ = CC(), J = ae($);
    {
      var W = (V) => {
        var q = yC(), ne = d(q), K = d(ne), R = p(ne, 2);
        j(() => T(K, x())), Ne("click", R, function(...L) {
          var _a10;
          (_a10 = e.ondismisserror) == null ? void 0 : _a10.apply(this, L);
        }), u(V, q);
      };
      I(J, (V) => {
        x() && V(W);
      });
    }
    var C = p(J, 2);
    {
      var A = (V) => {
        var q = wC(), ne = d(q), K = d(ne), R = p(ne, 2);
        j(() => T(K, m())), Ne("click", R, function(...L) {
          var _a10;
          (_a10 = e.ondismisssuccess) == null ? void 0 : _a10.apply(this, L);
        }), u(V, q);
      };
      I(C, (V) => {
        m() && V(A);
      });
    }
    var k = p(C, 2);
    qE(k, { get engineStatus() {
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
    }, oninspect: () => g(y, true), get scanCount() {
      return v();
    }, set scanCount(V) {
      v(V);
    } });
    var N = p(k, 2);
    {
      var O = (V) => {
        var q = AC(), ne = ae(q);
        Ve(ne, 21, () => s(w), (G) => G.name, (G, Q) => {
          var re = TC(), ie = d(re), le = d(ie);
          let ce;
          var fe = p(le, 2);
          let ve;
          var be = d(fe), _e40 = p(fe, 2);
          {
            var xe = (Se) => {
              var Pe = kC();
              u(Se, Pe);
            }, Ae = (Se) => {
              var Pe = SC(), pe = d(Pe);
              j(() => T(pe, s(Q).category.policy)), u(Se, Pe);
            };
            I(_e40, (Se) => {
              s(Q).category.policy === "auto" ? Se(xe) : Se(Ae, -1);
            });
          }
          var Ee = p(ie, 2);
          Ve(Ee, 20, () => s(Q).actionIds, (Se) => Se, (Se, Pe) => {
            {
              let pe = H(() => Xo(Pe)), de = H(() => {
                var _a10;
                return ((_a10 = r()[Pe]) == null ? void 0 : _a10.length) || 0;
              }), ue = H(() => r()[Pe] || []), me = H(() => l() === Pe);
              pC(Se, { get action() {
                return Pe;
              }, get color() {
                return s(pe);
              }, get count() {
                return s(de);
              }, get items() {
                return s(ue);
              }, get expanded() {
                return s(me);
              }, ontoggle: () => e.ontogglecategory(Pe), onexecute: (we) => e.onexecute(Pe, we), get onmarkacted() {
                return e.onmarkacted;
              }, get ondismiss() {
                return e.ondismiss;
              }, get onremove() {
                return e.onremove;
              }, onclearcategory: () => e.onclearcategory(Pe) });
            }
          }), j(() => {
            ce = Rt(le, "", ce, { background: s(Q).category.color }), ve = Rt(fe, "", ve, { color: s(Q).category.color }), T(be, s(Q).category.label);
          }), u(G, re);
        });
        var K = p(ne, 2), R = d(K), L = d(R);
        j(() => T(L, `${o().total ?? ""} emails classified into ${n().length ?? ""} categories`)), u(V, q);
      }, Y = (V) => {
        var q = EC();
        u(V, q);
      };
      I(N, (V) => {
        o().total > 0 ? V(O) : c() || V(Y, 1);
      });
    }
    u(E, $);
  }, $$slots: { default: true } }), u(t, D), Fe();
}
Zt(["click"]);
var $C = _('<div class="flex flex-col h-full min-h-0"><!></div>');
function NC(t, e) {
  Be(e, true);
  const r = Hd();
  let n = te(nt(r.status)), a = te(""), o = te(nt({})), i = te(nt([])), l = te(nt({})), c = te(nt({ total: 0 })), f = te(null), v = te(null), x = te(false), m = te(null), y = te(3), h = te(null), b = te(null), w = te(null);
  const D = "me-ai-scan-history";
  async function F() {
    return await sr(D);
  }
  async function B(O) {
    !O || O.phase !== "done" || await _r(D, { timestamp: Date.now(), classified: O.classified || 0, errors: O.errors || 0, total: O.total || 0, totals: O.totals || {}, summary: O.summary || {} });
  }
  Xt(async () => {
    const O = r.onMessage((V) => {
      if (V.status === "ready") {
        g(n, "ready");
        const q = On.find((R) => R.id === r.modelId), ne = yn.find((R) => R.name === r.modelId), K = q || ne;
        g(a, (K == null ? void 0 : K.name) || (K == null ? void 0 : K.displayName) || r.modelId || "", true);
      }
      V.status === "loading" && g(n, "loading");
    });
    if (g(n, r.status, true), r.modelId) {
      const V = On.find((K) => K.id === r.modelId), q = yn.find((K) => K.name === r.modelId), ne = V || q;
      g(a, (ne == null ? void 0 : ne.name) || (ne == null ? void 0 : ne.displayName) || r.modelId || "", true);
    }
    const Y = await F();
    return Y && g(m, { phase: "done", ...Y }, true), M(), () => O();
  });
  async function M() {
    try {
      const O = await as(), Y = await Xv(), V = await Al(), q = {};
      for (const ne of O.order) {
        const K = await co(ne);
        q[ne] = rb(K);
      }
      g(o, O.categories, true), g(i, O.order, true), g(c, Y, true), g(f, V, true), g(l, q, true);
    } catch (O) {
      g(h, `Failed to load data: ${O.message}`);
    }
  }
  async function Z() {
    await P(false);
  }
  async function U() {
    await P(true);
  }
  async function P(O) {
    if (s(x) || !r.isReady) return;
    g(h, null), g(b, null), g(x, true), g(m, null);
    const Y = new AbortController();
    g(w, Y, true);
    try {
      await Kv(r, { count: s(y), force: O, signal: Y.signal, onProgress: (V) => {
        g(m, { ...V }, true), V.phase === "done" && B(V);
      } }), await M();
    } catch (V) {
      Y.signal.aborted || g(h, `Scan failed: ${V.message}`);
    } finally {
      g(x, false), g(w, null);
    }
  }
  function E() {
    var _a10;
    (_a10 = s(w)) == null ? void 0 : _a10.abort();
  }
  async function S(O) {
    await vs(O, "acted"), await M();
  }
  async function $(O, Y) {
    const { executePipeline: V, isAuthenticated: q } = await wr(async () => {
      const { executePipeline: ne, isAuthenticated: K } = await Promise.resolve().then(() => bb);
      return { executePipeline: ne, isAuthenticated: K };
    }, void 0);
    if (!await q()) {
      alert("Please sign in to Gmail first (Dashboard page)");
      return;
    }
    try {
      const K = await V({ type: O, source: "gmail", data: Y }, (R) => {
        console.log("Pipeline progress:", R);
      }, true);
      K.success ? (g(b, K.message, true), g(h, null), await S(Y.emailId)) : (g(h, `Execution failed: ${K.message}`), g(b, null));
    } catch (ne) {
      g(h, `Execution error: ${ne.message}`), g(b, null);
    }
  }
  async function J(O) {
    await vs(O, "dismissed"), await M();
  }
  async function W(O) {
    await Zv(O), await M();
  }
  async function C(O) {
    await Oc(O), await M();
  }
  function A(O) {
    g(v, s(v) === O ? null : O, true);
  }
  var k = $C(), N = d(k);
  PC(N, { get engineStatus() {
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
    return s(v);
  }, get isScanning() {
    return s(x);
  }, get scanProgress() {
    return s(m);
  }, get error() {
    return s(h);
  }, get successMsg() {
    return s(b);
  }, onscan: Z, onrescan: U, ontogglecategory: A, onexecute: $, onmarkacted: S, ondismiss: J, onremove: W, onclearcategory: C, ondismisserror: () => g(h, null), ondismisssuccess: () => g(b, null), onstop: E, oncloseprogress: async () => {
    g(m, null), await oi(D);
  }, get scanCount() {
    return s(y);
  }, set scanCount(O) {
    g(y, O, true);
  } }), u(t, k), Fe();
}
var RC = _('<div class="flex flex-col h-full w-full overflow-hidden bg-background"><!></div>'), MC = _('<div class="h-full w-full overflow-hidden"><!></div>'), zC = _(`<div class="flex flex-col h-full w-full overflow-hidden"><header class="flex items-center gap-3 px-5 h-11 border-b border-border bg-sidebar shrink-0"><a href="#home" class="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground
         transition-colors no-underline shrink-0"><!> <span class="tracking-tight">Home</span></a> <div class="w-px h-4 bg-border shrink-0"></div> <div class="size-6 rounded overflow-hidden flex items-center justify-center shrink-0"><img src="/logo.png" alt="me-ai logo" class="size-full object-cover"/></div> <span class="text-sm font-semibold tracking-tight text-foreground">Sources</span></header> <div class="flex-1 min-h-0 overflow-hidden flex flex-col"><div><!></div> <div><!></div></div></div>`), OC = _(`<div class="flex flex-col h-full w-full overflow-hidden"><header class="flex items-center gap-3 px-5 h-11 border-b border-border bg-sidebar shrink-0"><a href="#home" class="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground
         transition-colors no-underline shrink-0"><!> <span class="tracking-tight">Home</span></a> <div class="w-px h-4 bg-border shrink-0"></div> <div class="size-6 rounded overflow-hidden flex items-center justify-center shrink-0"><img src="/logo.png" alt="me-ai logo" class="size-full object-cover"/></div> <span class="text-sm font-semibold tracking-tight text-foreground">Scan</span></header> <div class="flex-1 min-h-0 overflow-hidden flex flex-col"><!></div></div>`), DC = _(`<div class="flex flex-col h-full w-full overflow-hidden"><header class="flex items-center gap-3 px-5 h-11 border-b border-border bg-sidebar shrink-0"><a href="#home" class="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground
         transition-colors no-underline shrink-0"><!> <span class="tracking-tight">Home</span></a> <div class="w-px h-4 bg-border shrink-0"></div> <div class="size-6 rounded overflow-hidden flex items-center justify-center shrink-0"><img src="/logo.png" alt="me-ai logo" class="size-full object-cover"/></div> <span class="text-sm font-semibold tracking-tight text-foreground">Admin</span></header> <div class="flex-1 min-h-0 overflow-hidden flex flex-col"><!></div></div>`), LC = _('<span class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-primary rounded-full"></span>'), jC = _('<span class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-primary rounded-full"></span>'), BC = _('<span class="text-[0.6rem] font-bold tabular-nums px-1.5 py-px rounded bg-primary/15 text-primary mr-1"> </span>'), FC = _('<span class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-primary rounded-full"></span>'), UC = _('<span class="text-[0.6rem] font-bold tabular-nums px-1.5 py-px rounded bg-primary text-primary-foreground mr-1"> </span>'), GC = _(`<div class="flex h-full w-full overflow-hidden"><aside class="w-52 shrink-0 flex flex-col bg-sidebar border-r border-sidebar-border overflow-hidden"><div class="flex items-center gap-3 px-4 h-11 border-b border-sidebar-border shrink-0"><a href="#home" class="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground
           transition-colors no-underline shrink-0"><!> <span class="tracking-tight">Home</span></a> <div class="w-px h-4 bg-sidebar-border shrink-0"></div> <div class="size-6 rounded overflow-hidden flex items-center justify-center shrink-0"><img src="/logo.png" alt="me-ai logo" class="size-full object-cover"/></div> <span class="text-sm font-semibold tracking-tight text-foreground">me-ai</span></div> <nav class="flex flex-col flex-1 overflow-y-auto py-1.5"><div class="px-4 pt-1 pb-0.5"><span class="text-[0.6rem] font-semibold uppercase tracking-widest text-muted-foreground/50">Control Plane</span></div> <a href="#stream"><!> <!> <span class="flex-1 tracking-tight">Event Stream</span></a> <a href="#pipelines"><!> <!> <span class="flex-1 tracking-tight">Pipelines</span> <!></a> <a href="#approvals"><!> <!> <span class="flex-1 tracking-tight">Approvals</span> <!></a></nav></aside> <main class="flex-1 min-h-0 overflow-hidden flex flex-col bg-background"><div class="flex-1 min-h-0 flex flex-col overflow-hidden"><!></div> <div class="flex-1 min-h-0 flex flex-col overflow-hidden"><!></div> <div class="flex-1 min-h-0 flex flex-col overflow-hidden"><!></div></main></div>`), WC = _('<div class="h-full w-full overflow-hidden"><!></div>');
function VC(t, e) {
  Be(e, true);
  var r = WC(), n = d(r);
  {
    var a = (v) => {
      var x = RC(), m = d(x);
      {
        var y = (b) => {
          x3(b, {});
        }, h = (b) => {
          P3(b, {});
        };
        I(m, (b) => {
          e.page === "auth" ? b(y) : b(h, -1);
        });
      }
      u(v, x);
    }, o = (v) => {
      var x = MC(), m = d(x);
      gE(m, {}), u(v, x);
    }, i = (v) => {
      var x = zC(), m = d(x), y = d(m), h = d(y);
      Ro(h, { class: "size-3.5" });
      var b = p(m, 2), w = d(b);
      let D;
      var F = d(w);
      l5(F, {});
      var B = p(w, 2);
      let M;
      var Z = d(B);
      g5(Z, {}), j(() => {
        D = Rt(w, "", D, { display: e.page === "sources" ? "contents" : "none" }), M = Rt(B, "", M, { display: e.page === "plugins" ? "contents" : "none" });
      }), u(v, x);
    }, l = (v) => {
      var x = OC(), m = d(x), y = d(m), h = d(y);
      Ro(h, { class: "size-3.5" });
      var b = p(m, 2), w = d(b);
      NC(w, {}), u(v, x);
    }, c = (v) => {
      var x = DC(), m = d(x), y = d(m), h = d(y);
      Ro(h, { class: "size-3.5" });
      var b = p(m, 2), w = d(b);
      d3(w, {}), u(v, x);
    }, f = (v) => {
      var x = GC(), m = d(x), y = d(m), h = d(y), b = d(h);
      Ro(b, { class: "size-3.5" });
      var w = p(y, 2), D = p(d(w), 2), F = d(D);
      {
        var B = (re) => {
          var ie = LC();
          u(re, ie);
        };
        I(F, (re) => {
          e.page === "stream" && re(B);
        });
      }
      var M = p(F, 2);
      gg(M, { class: "size-3.5 shrink-0" });
      var Z = p(D, 2), U = d(Z);
      {
        var P = (re) => {
          var ie = jC();
          u(re, ie);
        };
        I(U, (re) => {
          e.page === "pipelines" && re(P);
        });
      }
      var E = p(U, 2);
      bg(E, { class: "size-3.5 shrink-0" });
      var S = p(E, 4);
      {
        var $ = (re) => {
          var ie = BC(), le = d(ie);
          j(() => T(le, e.stats.total)), u(re, ie);
        };
        I(S, (re) => {
          e.stats.total > 0 && re($);
        });
      }
      var J = p(Z, 2), W = d(J);
      {
        var C = (re) => {
          var ie = FC();
          u(re, ie);
        };
        I(W, (re) => {
          e.page === "approvals" && re(C);
        });
      }
      var A = p(W, 2);
      Rx(A, { class: "size-3.5 shrink-0" });
      var k = p(A, 4);
      {
        var N = (re) => {
          var ie = UC(), le = d(ie);
          j(() => T(le, e.stats.awaiting_user)), u(re, ie);
        };
        I(k, (re) => {
          e.stats.awaiting_user > 0 && re(N);
        });
      }
      var O = p(m, 2), Y = d(O);
      let V;
      var q = d(Y);
      My(q, {});
      var ne = p(Y, 2);
      let K;
      var R = d(ne);
      ww(R, {});
      var L = p(ne, 2);
      let G;
      var Q = d(L);
      Gw(Q, {}), j((re, ie, le) => {
        rt(D, 1, re), rt(Z, 1, ie), rt(J, 1, le), V = Rt(Y, "", V, { display: e.page === "stream" ? "flex" : "none" }), K = Rt(ne, "", K, { display: e.page === "pipelines" ? "flex" : "none" }), G = Rt(L, "", G, { display: e.page === "approvals" ? "flex" : "none" });
      }, [() => Et(Je("relative flex items-center gap-2.5 px-4 py-2 text-sm transition-colors no-underline", e.page === "stream" ? "text-foreground font-medium bg-sidebar-accent" : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50")), () => Et(Je("relative flex items-center gap-2.5 px-4 py-2 text-sm transition-colors no-underline", e.page === "pipelines" ? "text-foreground font-medium bg-sidebar-accent" : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50")), () => Et(Je("relative flex items-center gap-2.5 px-4 py-2 text-sm transition-colors no-underline", e.page === "approvals" ? "text-foreground font-medium bg-sidebar-accent" : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"))]), u(v, x);
    };
    I(n, (v) => {
      e.inOAuth ? v(a) : e.inHome ? v(o, 1) : e.inSources ? v(i, 2) : e.inScan ? v(l, 3) : e.inAdmin ? v(c, 4) : v(f, -1);
    });
  }
  u(t, r), Fe();
}
var HC = _('<div class="h-dvh w-full overflow-hidden"><!></div>');
function qC(t, e) {
  Be(e, true);
  const r = ["stream", "pipelines", "approvals"], n = ["auth", "oauth-redirect"], a = ["sources", "plugins"], o = ["scan"], i = ["admin"], l = [...n, ...a, ...o, ...r, ...i, "home", "chat"];
  function c() {
    const M = location.hash.replace("#", "");
    return M === "chat" ? "home" : l.includes(M) ? M : "home";
  }
  let f = te(nt(c()));
  const v = H(() => n.includes(s(f))), x = H(() => a.includes(s(f))), m = H(() => o.includes(s(f))), y = H(() => r.includes(s(f))), h = H(() => i.includes(s(f))), b = H(() => s(f) === "home");
  let w = te(nt({ total: 0, completed: 0, awaiting_user: 0, escalated: 0, failed: 0 }));
  async function D() {
    try {
      g(w, await wi(), true);
    } catch {
    }
  }
  Xt(() => {
    const M = () => {
      g(f, c(), true), r.includes(c()) && D();
    };
    return window.addEventListener("hashchange", M), s(y) && D(), () => window.removeEventListener("hashchange", M);
  });
  var F = HC(), B = d(F);
  VC(B, { get page() {
    return s(f);
  }, get inOAuth() {
    return s(v);
  }, get inHome() {
    return s(b);
  }, get inSources() {
    return s(x);
  }, get inScan() {
    return s(m);
  }, get inAdmin() {
    return s(h);
  }, get stats() {
    return s(w);
  } }), u(t, F), Fe();
}
async function ff() {
  try {
    await kp();
  } catch (t) {
    console.error("[core] init failed", t);
  } finally {
    const t = document.getElementById("app");
    if (!t) throw new Error("Missing #app element");
    qh(qC, { target: t });
  }
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", ff) : ff();
window.__setSetting = _r;
window.__getSetting = sr;
