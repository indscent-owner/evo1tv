package com.tvwrap.ev01

import android.annotation.SuppressLint
import android.app.Activity
import android.app.AlertDialog
import android.app.UiModeManager
import android.content.Context
import android.content.res.Configuration
import android.graphics.Color
import android.graphics.drawable.GradientDrawable
import android.os.Bundle
import android.os.Message
import android.os.SystemClock
import android.view.Gravity
import android.view.KeyEvent
import android.view.MotionEvent
import android.view.View
import android.view.ViewGroup
import android.view.WindowManager
import android.view.inputmethod.InputMethodManager
import android.webkit.*
import android.widget.FrameLayout
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast
import org.json.JSONArray
import org.json.JSONObject
import java.io.ByteArrayInputStream

class MainActivity : Activity() {
    private val startUrl = "https://ev01.ws/home"
    private lateinit var root: FrameLayout
    private lateinit var web: WebView
    private lateinit var pad: LinearLayout
    private lateinit var tog: TextView
    private var customView: View? = null
    private var customCb: WebChromeClient.CustomViewCallback? = null
    private var editing = false
    private var isTv = false
    private val blocked = HashSet<String>()
    private var navJs = ""
    private val chrome = Chrome()

    override fun onCreate(b: Bundle?) {
        super.onCreate(b)
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
        isTv = (getSystemService(Context.UI_MODE_SERVICE) as UiModeManager).currentModeType == Configuration.UI_MODE_TYPE_TELEVISION
        assets.open("hosts.txt").bufferedReader().useLines { ls ->
            ls.map { it.trim().lowercase() }.filter { it.isNotEmpty() && !it.startsWith("#") }.forEach { blocked.add(it) }
        }
        navJs = assets.open("nav.js").bufferedReader().readText()
        root = FrameLayout(this)
        web = WebView(this)
        root.addView(web, ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT)
        setContentView(root)
        setupWeb()
        buildPad()
        web.loadUrl(startUrl)
    }

    private fun isBlocked(host: String): Boolean {
        var h = host
        while (true) {
            if (blocked.contains(h)) return true
            val i = h.indexOf('.')
            if (i < 0) return false
            h = h.substring(i + 1)
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun setupWeb() {
        val s = web.settings
        s.javaScriptEnabled = true
        s.domStorageEnabled = true
        s.mediaPlaybackRequiresUserGesture = false
        s.setSupportMultipleWindows(false)
        s.javaScriptCanOpenWindowsAutomatically = false
        s.mixedContentMode = WebSettings.MIXED_CONTENT_COMPATIBILITY_MODE
        s.useWideViewPort = true
        s.loadWithOverviewMode = true
        s.userAgentString = "Mozilla/5.0 (Linux; Android 13; TV) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
        CookieManager.getInstance().setAcceptThirdPartyCookies(web, true)
        web.setBackgroundColor(Color.BLACK)
        web.addJavascriptInterface(Bridge(), "Android")
        web.webChromeClient = chrome
        web.webViewClient = object : WebViewClient() {
            override fun shouldInterceptRequest(v: WebView?, r: WebResourceRequest?): WebResourceResponse? {
                val h = r?.url?.host?.lowercase() ?: return null
                return if (isBlocked(h))
                    WebResourceResponse("text/plain", "utf-8", 403, "Blocked", emptyMap(), ByteArrayInputStream(ByteArray(0)))
                else null
            }

            override fun shouldOverrideUrlLoading(v: WebView?, r: WebResourceRequest?): Boolean {
                if (r == null || !r.isForMainFrame) return false
                val u = r.url
                if (u.scheme != "http" && u.scheme != "https") return true
                val h = u.host?.lowercase() ?: return true
                return !h.contains("ev01") // true = block navigation away from the site
            }

            override fun onPageStarted(v: WebView?, url: String?, f: android.graphics.Bitmap?) {
                editing = false
                web.evaluateJavascript(navJs, null)
            }

            override fun onPageFinished(v: WebView?, url: String?) {
                web.evaluateJavascript(navJs, null)
            }
        }
    }

    inner class Chrome : WebChromeClient() {
        override fun onCreateWindow(v: WebView?, d: Boolean, g: Boolean, m: Message?): Boolean = false
        override fun onJsAlert(v: WebView?, u: String?, m: String?, r: JsResult?): Boolean { r?.cancel(); return true }
        override fun onJsConfirm(v: WebView?, u: String?, m: String?, r: JsResult?): Boolean { r?.cancel(); return true }
        override fun onJsPrompt(v: WebView?, u: String?, m: String?, d: String?, r: JsPromptResult?): Boolean { r?.cancel(); return true }
        override fun onJsBeforeUnload(v: WebView?, u: String?, m: String?, r: JsResult?): Boolean { r?.confirm(); return true }

        override fun onShowCustomView(v: View?, cb: CustomViewCallback?) {
            if (v == null) return
            if (customView != null) { cb?.onCustomViewHidden(); return }
            customView = v; customCb = cb
            web.visibility = View.GONE
            pad.visibility = View.GONE; tog.visibility = View.GONE
            root.addView(v, ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT)
            immersive(true)
        }

        override fun onHideCustomView() {
            val v = customView ?: return
            root.removeView(v)
            customView = null
            customCb?.onCustomViewHidden()
            web.visibility = View.VISIBLE
            if (!isTv) { pad.visibility = View.VISIBLE; tog.visibility = View.VISIBLE }
            immersive(false)
        }
    }

    @Suppress("DEPRECATION")
    private fun immersive(on: Boolean) {
        window.decorView.systemUiVisibility = if (on)
            View.SYSTEM_UI_FLAG_FULLSCREEN or View.SYSTEM_UI_FLAG_HIDE_NAVIGATION or View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
        else 0
    }

    inner class Bridge {
        @JavascriptInterface fun setEditing(b: Boolean) { editing = b }
        @JavascriptInterface fun showKeyboard() = runOnUiThread {
            web.requestFocus()
            (getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager).showSoftInput(web, 0)
        }
        @JavascriptInterface fun showOptions(json: String) = runOnUiThread { showGroups(json) }
    }

    // ---------- Remote navigation ----------
    @Suppress("DEPRECATION")
    private fun nav(dir: String) {
        web.evaluateJavascript("window.__tvNav&&__tvNav('$dir')") { v ->
            val r = v?.trim('"') ?: return@evaluateJavascript
            if (r.startsWith("tap:")) {
                val p = r.substring(4).split(",").map { it.toFloat() }
                tap(p[0] * web.scale, p[1] * web.scale)
            }
        }
    }

    private fun tap(x: Float, y: Float) {
        val t = SystemClock.uptimeMillis()
        val d = MotionEvent.obtain(t, t, MotionEvent.ACTION_DOWN, x, y, 0)
        web.dispatchTouchEvent(d); d.recycle()
        val u = MotionEvent.obtain(t, t + 60, MotionEvent.ACTION_UP, x, y, 0)
        web.dispatchTouchEvent(u); u.recycle()
    }

    private fun scanOptions() = web.evaluateJavascript("window.__tvOptions&&__tvOptions()", null)

    private fun blurInput() {
        (getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager).hideSoftInputFromWindow(web.windowToken, 0)
        web.evaluateJavascript("document.activeElement&&document.activeElement.blur()", null)
        editing = false
    }

    override fun dispatchKeyEvent(e: KeyEvent): Boolean {
        if (customView != null) return super.dispatchKeyEvent(e)
        val k = e.keyCode
        val dir = when (k) {
            KeyEvent.KEYCODE_DPAD_UP -> "up"
            KeyEvent.KEYCODE_DPAD_DOWN -> "down"
            KeyEvent.KEYCODE_DPAD_LEFT -> "left"
            KeyEvent.KEYCODE_DPAD_RIGHT -> "right"
            KeyEvent.KEYCODE_DPAD_CENTER, KeyEvent.KEYCODE_ENTER, KeyEvent.KEYCODE_NUMPAD_ENTER -> "ok"
            else -> null
        }
        val menu = k == KeyEvent.KEYCODE_MENU
        if (dir == null && !menu) return super.dispatchKeyEvent(e)
        if (editing && dir != "up" && dir != "down") return super.dispatchKeyEvent(e)
        if (e.action == KeyEvent.ACTION_DOWN) {
            if (editing) blurInput()
            if (menu) scanOptions()
            else if (!(dir == "ok" && e.repeatCount > 0)) nav(dir!!)
        }
        return true
    }

    @Suppress("DEPRECATION", "OVERRIDE_DEPRECATION")
    override fun onBackPressed() {
        when {
            customView != null -> chrome.onHideCustomView()
            editing -> blurInput()
            web.canGoBack() -> web.goBack()
            else -> super.onBackPressed()
        }
    }

    // ---------- Options dialogs ----------
    private fun showGroups(json: String) {
        val arr = JSONArray(json)
        if (arr.length() == 0) {
            Toast.makeText(this, "No options found on this page", Toast.LENGTH_SHORT).show(); return
        }
        val names = Array(arr.length()) { val g = arr.getJSONObject(it); "${g.getString("name")} (${g.getJSONArray("items").length()})" }
        AlertDialog.Builder(this).setTitle("Options").setItems(names) { _, i -> showItems(arr.getJSONObject(i)) }.show()
    }

    private fun showItems(g: JSONObject) {
        val items = g.getJSONArray("items")
        val labels = Array(items.length()) { items.getJSONObject(it).getString("t") }
        AlertDialog.Builder(this).setTitle(g.getString("name")).setItems(labels) { _, i ->
            web.evaluateJavascript("__tvClick(${items.getJSONObject(i).getInt("i")})", null)
        }.show()
    }

    // ---------- On-screen D-pad (phone testing only) ----------
    private fun buildPad() {
        val dp = resources.displayMetrics.density
        fun btn(label: String, a: () -> Unit): TextView = TextView(this).apply {
            text = label; setTextColor(Color.WHITE); textSize = 16f; gravity = Gravity.CENTER
            background = GradientDrawable().apply {
                cornerRadius = 12 * dp; setColor(Color.argb(150, 30, 30, 30)); setStroke(2, Color.argb(170, 255, 255, 255))
            }
            isFocusable = false; isFocusableInTouchMode = false
            layoutParams = LinearLayout.LayoutParams((52 * dp).toInt(), (44 * dp).toInt()).apply { setMargins(3, 3, 3, 3) }
            setOnClickListener { a() }
        }
        fun row(vararg v: View): LinearLayout = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL; gravity = Gravity.CENTER_HORIZONTAL
            v.forEach { addView(it) }
        }
        pad = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL; alpha = 0.9f
            addView(row(btn("\u2699") { scanOptions() }, btn("\u25B2") { nav("up") }, btn("\u21A9") { onBackPressed() }))
            addView(row(btn("\u25C0") { nav("left") }, btn("OK") { nav("ok") }, btn("\u25B6") { nav("right") }))
            addView(row(btn("\u2302") { web.loadUrl(startUrl) }, btn("\u25BC") { nav("down") }, btn("\u00D7") { pad.visibility = View.GONE }))
        }
        val m = (10 * dp).toInt()
        root.addView(pad, FrameLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT, Gravity.BOTTOM or Gravity.START).apply { setMargins(m, m, m, m) })
        tog = btn("\uD83C\uDFAE") { pad.visibility = if (pad.visibility == View.VISIBLE) View.GONE else View.VISIBLE }
        root.addView(tog, FrameLayout.LayoutParams((52 * dp).toInt(), (44 * dp).toInt(), Gravity.TOP or Gravity.END).apply { setMargins(m, m, m, m) })
        if (isTv) { pad.visibility = View.GONE; tog.visibility = View.GONE }
    }

    override fun onPause() { super.onPause(); web.onPause() }
    override fun onResume() { super.onResume(); web.onResume() }
    override fun onDestroy() { web.destroy(); super.onDestroy() }
}
