package com.tvwrap.ev01

import android.annotation.SuppressLint
import android.app.Activity
import android.app.AlertDialog
import android.app.UiModeManager
import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.SharedPreferences
import android.content.res.Configuration
import android.graphics.Color
import android.graphics.Typeface
import android.graphics.drawable.GradientDrawable
import android.media.AudioManager
import android.net.Uri
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.os.Message
import android.os.SystemClock
import android.text.InputType
import android.view.Gravity
import android.view.KeyEvent
import android.view.MotionEvent
import android.view.View
import android.view.ViewGroup
import android.view.WindowManager
import android.view.inputmethod.EditorInfo
import android.view.inputmethod.InputMethodManager
import android.webkit.CookieManager
import android.webkit.JavascriptInterface
import android.webkit.JsPromptResult
import android.webkit.JsResult
import android.webkit.WebChromeClient
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebSettings
import android.webkit.WebStorage
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Button
import android.widget.EditText
import android.widget.FrameLayout
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast
import androidx.webkit.JavaScriptReplyProxy
import androidx.webkit.WebViewCompat
import androidx.webkit.WebViewFeature
import org.json.JSONArray
import org.json.JSONObject
import org.json.JSONTokener
import java.io.ByteArrayInputStream

class MainActivity : Activity() {
    private lateinit var prefs: SharedPreferences
    private lateinit var root: FrameLayout
    private lateinit var web: WebView
    private lateinit var pad: LinearLayout
    private lateinit var tog: TextView
    private lateinit var wiz: LinearLayout
    private lateinit var wTitle: TextView
    private lateinit var wMsg: TextView
    private lateinit var wInput: EditText
    private lateinit var wBtn1: Button
    private lateinit var wBtn2: Button
    private var customView: View? = null
    private var customCb: WebChromeClient.CustomViewCallback? = null
    private var editing = false
    private var isTv = false
    private var agentOk = false
    private var analyzing = false
    private var analyzeStart = 0L
    private var pendingUrl = ""
    private var lastUrl = ""
    private var siteUrl = ""
    private var siteHost = ""
    private var evoJs = ""
    private val blocked = HashSet<String>()
    private val frames = HashMap<String, JavaScriptReplyProxy>()
    private val ui = Handler(Looper.getMainLooper())
    private val chrome = Chrome()

    override fun onCreate(b: Bundle?) {
        super.onCreate(b)
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
        prefs = getSharedPreferences("evo", Context.MODE_PRIVATE)
        isTv = (getSystemService(Context.UI_MODE_SERVICE) as UiModeManager).currentModeType == Configuration.UI_MODE_TYPE_TELEVISION
        assets.open("hosts.txt").bufferedReader().useLines { ls ->
            ls.map { it.trim().lowercase() }.filter { it.isNotEmpty() && !it.startsWith("#") }.forEach { blocked.add(it) }
        }
        evoJs = assets.open("evo.js").bufferedReader().readText()
        val agentJs = assets.open("agent.js").bufferedReader().readText()
        siteUrl = prefs.getString("site", "") ?: ""
        setSiteHost()
        root = FrameLayout(this)
        web = WebView(this)
        root.addView(web, ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT)
        setContentView(root)
        setupWeb(agentJs)
        buildPad()
        buildWizard()
        if (siteUrl.isEmpty()) wizWelcome() else { wiz.visibility = View.GONE; web.loadUrl(siteUrl) }
    }

    private fun setSiteHost() {
        siteHost = try { Uri.parse(siteUrl).host?.lowercase() ?: "" } catch (e: Exception) { "" }
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

    private fun sameSite(h: String): Boolean {
        if (siteHost.isEmpty()) return true
        val base = siteHost.removePrefix("www.")
        val hh = h.removePrefix("www.")
        return hh == base || hh.endsWith(".$base")
    }

    // ---------------- WebView ----------------
    @SuppressLint("SetJavaScriptEnabled")
    private fun setupWeb(agentJs: String) {
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
        if (WebViewFeature.isFeatureSupported(WebViewFeature.WEB_MESSAGE_LISTENER) &&
            WebViewFeature.isFeatureSupported(WebViewFeature.DOCUMENT_START_SCRIPT)) {
            try {
                WebViewCompat.addWebMessageListener(web, "EvoFrame", setOf("*")) { _, message, _, _, reply ->
                    val d = message.data
                    if (d != null) {
                        try {
                            val f = JSONObject(d).optString("f")
                            if (f.isNotEmpty()) frames[f] = reply
                        } catch (_: Exception) {}
                        web.evaluateJavascript("window.__evoFrameMsg&&__evoFrameMsg(${JSONObject.quote(d)})", null)
                    }
                }
                WebViewCompat.addDocumentStartJavaScript(web, agentJs, setOf("*"))
                agentOk = true
            } catch (e: Exception) { agentOk = false }
        }
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
                if (isBlocked(h)) return true
                if (analyzing) return false
                return !sameSite(h) && !r.isRedirect
            }

            override fun onPageStarted(v: WebView?, url: String?, f: android.graphics.Bitmap?) {
                editing = false
                frames.clear()
                web.evaluateJavascript(evoJs, null)
            }

            override fun onPageFinished(v: WebView?, url: String?) {
                if (analyzing && url != null) lastUrl = url
                // the site moved to a mirror domain via redirect: follow it and remember it
                val nh = try { Uri.parse(url ?: "").host?.lowercase() } catch (e: Exception) { null }
                if (!analyzing && nh != null && siteUrl.isNotEmpty() && !sameSite(nh) && !isBlocked(nh)) {
                    siteUrl = "${Uri.parse(url).scheme}://$nh/"
                    prefs.edit().putString("site", siteUrl).apply()
                    setSiteHost()
                }
                web.evaluateJavascript(evoJs, null)
            }

            override fun onReceivedError(v: WebView?, r: WebResourceRequest?, e: WebResourceError?) {
                if (analyzing && r?.isForMainFrame == true) {
                    analyzing = false
                    wizWelcome("Couldn't open that site (${e?.description}). Check the address and your connection.")
                }
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
            root.addView(v, ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT)
            immersive(true)
        }

        override fun onHideCustomView() {
            val v = customView ?: return
            root.removeView(v)
            customView = null
            customCb?.onCustomViewHidden()
            web.visibility = View.VISIBLE
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
        @JavascriptInterface fun setImmersive(on: Boolean) = runOnUiThread { immersive(on) }
        @JavascriptInterface fun tap(x: Double, y: Double, delay: Int) {
            web.postDelayed({ tapCss(x.toFloat(), y.toFloat()) }, delay.toLong())
        }
        @JavascriptInterface fun openSettings() = runOnUiThread { showSettings() }
        @JavascriptInterface fun pref(k: String): String = prefs.getString(k, "") ?: ""
        @JavascriptInterface fun agentOk(): Boolean = agentOk
        @JavascriptInterface fun audioActive(): Boolean =
            (getSystemService(Context.AUDIO_SERVICE) as AudioManager).isMusicActive
        @JavascriptInterface fun startPath(): String = try {
            val p = Uri.parse(if (analyzing) pendingUrl else siteUrl).path
            if (p.isNullOrEmpty()) "/" else p
        } catch (e: Exception) { "/" }
        @JavascriptInterface fun frameCmd(json: String) {
            runOnUiThread {
                val it = frames.entries.iterator()
                while (it.hasNext()) {
                    val e = it.next()
                    try { e.value.postMessage(json) } catch (x: Exception) { it.remove() }
                }
            }
        }
    }

    // ---------------- Remote navigation ----------------
    private fun nav(dir: String) {
        web.evaluateJavascript("window.__tvNav&&__tvNav('$dir')", null)
    }

    @Suppress("DEPRECATION")
    private fun tapCss(x: Float, y: Float) = tap(x * web.scale, y * web.scale)

    private fun tap(x: Float, y: Float) {
        val t = SystemClock.uptimeMillis()
        val d = MotionEvent.obtain(t, t, MotionEvent.ACTION_DOWN, x, y, 0)
        web.dispatchTouchEvent(d); d.recycle()
        val u = MotionEvent.obtain(t, t + 60, MotionEvent.ACTION_UP, x, y, 0)
        web.dispatchTouchEvent(u); u.recycle()
    }

    private fun scanOptions() = web.evaluateJavascript("window.__tvOptions&&__tvOptions()", null)

    private fun hideKb() {
        (getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager).hideSoftInputFromWindow(window.decorView.windowToken, 0)
    }

    private fun blurInput() {
        hideKb()
        web.evaluateJavascript("document.activeElement&&document.activeElement.blur()", null)
        editing = false
    }

    override fun dispatchKeyEvent(e: KeyEvent): Boolean {
        if (wiz.visibility == View.VISIBLE || customView != null) return super.dispatchKeyEvent(e)
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
            wiz.visibility == View.VISIBLE -> {
                if (analyzing) { analyzing = false; wizWelcome() }
                else if (siteUrl.isNotEmpty()) wiz.visibility = View.GONE
                else finish()
            }
            customView != null -> chrome.onHideCustomView()
            editing -> blurInput()
            else -> web.evaluateJavascript("window.__evoBack?__evoBack():false") { r ->
                if (r != "true") { if (web.canGoBack()) web.goBack() else finish() }
            }
        }
    }

    // ---------------- Options + settings dialogs ----------------
    private fun showGroups(json: String) {
        val arr = JSONArray(json)
        if (arr.length() == 0) { Toast.makeText(this, "No options available", Toast.LENGTH_SHORT).show(); return }
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

    private fun showSettings() {
        val subsOff = (prefs.getString("subsOff", "1") ?: "1") == "1"
        val ver = try { packageManager.getPackageInfo(packageName, 0).versionName } catch (e: Exception) { "" }
        val items = arrayOf(
            "Site: ${if (siteHost.isEmpty()) "(none)" else siteHost}  \u2013  change",
            "Re-scan this site",
            "Subtitles by default: ${if (subsOff) "Off" else "On"}  (tap to switch)",
            "Copy site report (to send to support)",
            "Clear cookies and cache",
            "About EVO Stream $ver"
        )
        AlertDialog.Builder(this).setTitle("Settings").setItems(items) { _, i ->
            when (i) {
                0 -> wizWelcome()
                1 -> { if (siteUrl.isNotEmpty()) web.loadUrl(siteUrl) }
                2 -> { prefs.edit().putString("subsOff", if (subsOff) "0" else "1").apply(); Toast.makeText(this, "Subtitles default: ${if (subsOff) "On" else "Off"}", Toast.LENGTH_SHORT).show() }
                3 -> web.evaluateJavascript("window.__evoReport?__evoReport():null") { r ->
                    var txt: String? = null
                    try { if (r != null && r != "null") { val v = JSONTokener(r).nextValue(); if (v is String) txt = v } } catch (_: Exception) {}
                    if (txt == null) Toast.makeText(this, "No report available yet - wait for the page to load", Toast.LENGTH_LONG).show()
                    else {
                        (getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager).setPrimaryClip(ClipData.newPlainText("EVO report", txt))
                        Toast.makeText(this, "Report copied - paste it into the chat", Toast.LENGTH_LONG).show()
                    }
                }
                4 -> {
                    CookieManager.getInstance().removeAllCookies(null)
                    WebStorage.getInstance().deleteAllData()
                    web.clearCache(true); web.clearHistory()
                    Toast.makeText(this, "Cleared", Toast.LENGTH_SHORT).show()
                }
                5 -> Toast.makeText(this, "EVO Stream $ver", Toast.LENGTH_LONG).show()
            }
        }.show()
    }

    // ---------------- Setup wizard ----------------
    private fun buildWizard() {
        val dp = resources.displayMetrics.density
        wTitle = TextView(this).apply { textSize = 28f; setTextColor(Color.WHITE); typeface = Typeface.DEFAULT_BOLD }
        wMsg = TextView(this).apply {
            textSize = 16f; setTextColor(Color.parseColor("#cfcfda"))
            setPadding(0, (14 * dp).toInt(), 0, (14 * dp).toInt())
        }
        wInput = EditText(this).apply {
            hint = "example.com"; setHintTextColor(Color.GRAY); setTextColor(Color.WHITE)
            inputType = InputType.TYPE_CLASS_TEXT or InputType.TYPE_TEXT_VARIATION_URI
            imeOptions = EditorInfo.IME_ACTION_GO; setSingleLine(true)
        }
        wBtn1 = Button(this)
        wBtn2 = Button(this)
        wiz = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setBackgroundColor(Color.parseColor("#0b0b10"))
            gravity = Gravity.CENTER_VERTICAL
            setPadding((32 * dp).toInt(), (24 * dp).toInt(), (32 * dp).toInt(), (24 * dp).toInt())
            isClickable = true
            addView(wTitle); addView(wMsg); addView(wInput); addView(wBtn1); addView(wBtn2)
        }
        root.addView(wiz, ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT)
        wInput.setOnEditorActionListener { _, a, _ ->
            if (a == EditorInfo.IME_ACTION_GO || a == EditorInfo.IME_ACTION_DONE) { onSiteEntered(); true } else false
        }
    }

    private fun wizShow(title: String, msg: String, input: Boolean, b1: String?, a1: (() -> Unit)?, b2: String?, a2: (() -> Unit)?) {
        wiz.visibility = View.VISIBLE
        wTitle.text = title; wMsg.text = msg
        wInput.visibility = if (input) View.VISIBLE else View.GONE
        wBtn1.visibility = if (b1 != null) View.VISIBLE else View.GONE
        wBtn1.text = b1 ?: ""; wBtn1.setOnClickListener { a1?.invoke() }
        wBtn2.visibility = if (b2 != null) View.VISIBLE else View.GONE
        wBtn2.text = b2 ?: ""; wBtn2.setOnClickListener { a2?.invoke() }
        (if (input) wInput else if (b1 != null) wBtn1 else wBtn2).requestFocus()
    }

    private fun wizWelcome(err: String? = null) {
        analyzing = false
        if (err == null) wInput.setText(if (siteHost.isNotEmpty()) siteHost else "fmovies.org")
        wizShow(
            "EVO Stream setup",
            (if (err != null) "$err\n\n" else "") +
                "Type the address of the website you want to use, for example mysite.com.\n\nEVO Stream will look at the site and build a TV-friendly version of it.",
            true, "Next", { onSiteEntered() },
            if (siteUrl.isNotEmpty()) "Cancel" else null, { wiz.visibility = View.GONE }
        )
    }

    private fun onSiteEntered() {
        var s = wInput.text.toString().trim().lowercase()
        if (!s.contains(".")) { wizWelcome("Please type the full address including the ending, like example.com"); return }
        if (!s.startsWith("http")) s = "https://$s"
        hideKb()
        startAnalysis(s)
    }

    private fun startAnalysis(url: String) {
        analyzing = true; analyzeStart = SystemClock.uptimeMillis(); pendingUrl = url; lastUrl = url
        wizShow(
            "Checking site\u2026",
            "Opening ${Uri.parse(url).host}\n\nLooking at the menu, featured titles and sections. This takes a few seconds.",
            false, null, null, "Cancel", { analyzing = false; wizWelcome() }
        )
        web.loadUrl(url)
        ui.postDelayed(tick, 5000)
    }

    private val tick = object : Runnable {
        override fun run() {
            if (!analyzing) return
            web.evaluateJavascript("window.__evoAnalyze?__evoAnalyze():null") { r ->
                if (!analyzing) return@evaluateJavascript
                var o: JSONObject? = null
                try {
                    if (r != null && r != "null") { val s = JSONTokener(r).nextValue(); if (s is String) o = JSONObject(s) }
                } catch (_: Exception) {}
                val elapsed = SystemClock.uptimeMillis() - analyzeStart
                if ((o != null && o.optBoolean("ready")) || elapsed > 35000) { analyzing = false; wizResult(o ?: JSONObject()) }
                else ui.postDelayed(this, 2000)
            }
        }
    }

    private fun wizResult(o: JSONObject) {
        val menu = o.optInt("menu"); val hero = o.optInt("hero"); val secs = o.optInt("sections")
        val cards = o.optInt("cards"); val search = o.optBoolean("search")
        fun line(ok: Boolean, t: String) = (if (ok) "\u2714  " else "\u2718  ") + t
        val msg = listOf(
            line(menu > 0, "Menu: $menu links"),
            line(hero > 0, "Featured titles: $hero"),
            line(secs > 0, "Sections: $secs ($cards titles)"),
            line(search, "Search")
        ).joinToString("\n")
        val good = secs > 0
        wizShow(
            if (good) "Site looks good" else "Layout not recognised",
            msg + (if (good) "" else "\n\nEVO Stream couldn't find the usual sections on this page. You can continue and it will use the site's own pages with remote navigation, or try a different address."),
            false, if (good) "Finish" else "Use anyway", { finishSetup() }, "Change site", { wizWelcome() }
        )
    }

    private fun finishSetup() {
        val u = Uri.parse(if (lastUrl.isNotEmpty()) lastUrl else pendingUrl)
        siteUrl = "${u.scheme}://${u.host}${if (u.path.isNullOrEmpty()) "/" else u.path}"
        prefs.edit().putString("site", siteUrl).apply()
        setSiteHost()
        wiz.visibility = View.GONE
        web.loadUrl(siteUrl)
    }

    // ---------------- On-screen D-pad (phone testing only) ----------------
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
            addView(row(btn("\u2302") { if (siteUrl.isNotEmpty()) web.loadUrl(siteUrl) }, btn("\u25BC") { nav("down") }, btn("\u00D7") { pad.visibility = View.GONE }))
        }
        val m = (10 * dp).toInt()
        root.addView(pad, FrameLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT, Gravity.BOTTOM or Gravity.START).apply { setMargins(m, m, m, m) })
        tog = btn("\uD83C\uDFAE") { pad.visibility = if (pad.visibility == View.VISIBLE) View.GONE else View.VISIBLE }
        root.addView(tog, FrameLayout.LayoutParams((52 * dp).toInt(), (44 * dp).toInt(), Gravity.BOTTOM or Gravity.END).apply { setMargins(m, m, m, m) })
        if (isTv) { pad.visibility = View.GONE; tog.visibility = View.GONE }
    }

    override fun onPause() { super.onPause(); web.onPause() }
    override fun onResume() { super.onResume(); web.onResume() }
    override fun onDestroy() { ui.removeCallbacksAndMessages(null); web.destroy(); super.onDestroy() }
}
