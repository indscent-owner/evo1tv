plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}
android {
    namespace = "com.tvwrap.ev01"
    compileSdk = 34
    defaultConfig {
        applicationId = "com.tvwrap.evostream"
        minSdk = 24
        targetSdk = 34
        versionCode = 1062
        versionName = "1.0.6.2"
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions { jvmTarget = "17" }
}
dependencies {
    implementation("androidx.webkit:webkit:1.11.0")
}
