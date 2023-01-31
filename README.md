# rnDetoxCucumberTesting

Paso a paso de como instalar Detox en un proyecto de React Native
Instalaciones

Instalar detox-cli
yarn global add detox-cli
npm install detox-cli –global

Si nuestro SO es MacOs, se debe hacer un paso más para la instalación
brew tap wix/brew
brew install applesimutils

Instalar jest para el entorno de desarrollo
npm install "jest@^29" --save-dev
yarn add "jest@^29" --dev

Instalar detox
npm install detox --save-dev
yarn add detox --dev

Inicializar detox para la creación de documentos de configuración
npx detox init
Se verán estos outputs en la terminal
Created a file at path: .detoxrc.js
Created a file at path: e2e/jest.config.js
Created a file at path: e2e/starter.test.js

#Configuración de la aplicación
En el archivo .detoxrc.js, reemplazar la YOUR_APP por el nombre de la app. Tanto para
android como para ios.

apps: {
'ios.debug': {
type: 'ios.app',
- binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/YOUR_APP.app',
+ binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/example.app',
- build: 'xcodebuild -workspace ios/YOUR_APP.xcworkspace -scheme YOUR_APP -
configuration Debug -sdk iphonesimulator -derivedDataPath ios/build'
+ build: 'xcodebuild -workspace ios/example.xcworkspace -scheme example -
configuration Debug -sdk iphonesimulator -derivedDataPath ios/build'
},
'ios.release': {
type: 'ios.app',
- binaryPath: 'ios/build/Build/Products/Release-iphonesimulator/YOUR_APP.app',
+ binaryPath: 'ios/build/Build/Products/Release-iphonesimulator/example.app',
- build: 'xcodebuild -workspace ios/YOUR_APP.xcworkspace -scheme YOUR_APP -
configuration Release -sdk iphonesimulator -derivedDataPath ios/build'
+ build: 'xcodebuild -workspace ios/example.xcworkspace -scheme example -
configuration Release -sdk iphonesimulator -derivedDataPath ios/build'
},
'android.debug': {
type: 'android.apk',
binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
build: 'cd android && ./gradlew assembleDebug assembleAndroidTest -
DtestBuildType=debug'
},
'android.release': {
type: 'android.apk',
binaryPath: 'android/app/build/outputs/apk/release/app-release.apk',
build: 'cd android && ./gradlew assembleRelease assembleAndroidTest -
DtestBuildType=release'
},

Configurar los dispositivos que se van a utilizar para realizar las pruebas.
En el archivo .detoxrc.js, colocar el nombre de los dispositivos tanto de android como de ios.

module.exports = {
// ...
devices: {
simulator: {
type: 'ios.simulator',
device: {
type: 'iPhone 12',
},
},
attached: {
type: 'android.attached',
device: {
adbName: '.*', // any attached device
},
},
emulator: {
type: 'android.emulator',
device: {
avdName: 'Pixel_3a_API_30_x86',
},
},
},
};

--- Nota: Si se desconoce el listado de dispositivos que tenemos disponible para cada SO,
ejecutar los diferentes comandos:
IOS: xcrun simctl list devicetypes
Android: emulator -list-avds

Esto devuelve un listado de nombres que son los necesarios para completar el archivo .detoxrc.js

Configuración extra para android
Agregar las siguientes líneas de código en los siguientes archivos

android/build.gradle

buildscript {
ext {
buildToolsVersion = "31.0.0"
minSdkVersion = 21 // (1)
compileSdkVersion = 30
targetSdkVersion = 30
+ kotlinVersion = 'X.Y.Z' // (2)
}
...
dependencies {
classpath("com.android.tools.build:gradle:7.1.1")
classpath("com.facebook.react:react-native-gradle-plugin")
classpath("de.undercouch:gradle-download-task:5.0.1")
+ classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlinVersion") // (3)
...
allprojects {
repositories {
...
google()
+ maven { // (4)
+ url("$rootDir/../node_modules/detox/Detox-android")
+ }
maven { url 'https://www.jitpack.io' }
}
android/app/build.gradle
android {
...
defaultConfig {
...
versionCode 1
versionName "1.0"
+ testBuildType System.getProperty('testBuildType', 'debug')
+ testInstrumentationRunner 'androidx.test.runner.AndroidJUnitRunner'
...
buildTypes {
release {
minifyEnabled true
proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
+ proguardFile
"${rootProject.projectDir}/../node_modules/detox/android/detox/proguard-rules-app.pro"
signingConfig signingConfigs.release
}
}
...
dependencies {
+ androidTestImplementation('com.wix:detox:+')
+ implementation 'androidx.appcompat:appcompat:1.1.0'
implementation fileTree(dir: "libs", include: ["*.jar"])

Agregar archivo de test en android En el directorio android/app/src/androidTest/java/com/<your.package.name>/DetoxTest.java

package com.<your.package>; // (1)
import com.wix.detox.Detox;
import com.wix.detox.config.DetoxConfig;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.filters.LargeTest;
import androidx.test.rule.ActivityTestRule;
@RunWith(AndroidJUnit4.class)
@LargeTest
public class DetoxTest {
@Rule // (2)
public ActivityTestRule<MainActivity> mActivityRule = new
ActivityTestRule<>(MainActivity.class, false, false);
@Test
public void runDetoxTests() {
DetoxConfig detoxConfig = new DetoxConfig();
detoxConfig.idlePolicyConfig.masterTimeoutSec = 90;
detoxConfig.idlePolicyConfig.idleResourceTimeoutSec = 60;
detoxConfig.rnContextLoadTimeoutSec = (BuildConfig.DEBUG ? 180 : 60);
Detox.runTests(mActivityRule, detoxConfig);
}
}

--- Referencias:
Cambiar por el package que se está utilizando (android/app/src/main/java/com/<your.package>/MainActivity.java)

Colocarle un nombre diferente a la función, que no se llame igual que android:name=".MainActivity", que se encuentra en
android/app/src/main/AndroidManifest.xml

Habilitación del tráfico sin cifrar para Detox
Crear un archivo xml en android/app/src/main/res/xml/network_security_config.xml con el
siguiente contenido

<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
<domain-config cleartextTrafficPermitted="true">
<domain includeSubdomains="true">10.0.2.2</domain>
<domain includeSubdomains="true">localhost</domain>
</domain-config>
</network-security-config>
Si no estaba la configuración de seguridad de red antes, significa que también se debe registrar
después de la creación:
android/app/src/main/AndroidManifest.xml
<manifest>
<application
...
+ android:networkSecurityConfig="@xml/network_security_config">
</application>
</manifest>

Compilar la app
Donde luego de –configuration va el tipo de dispositivo y el nombre que se le colocó en el archivo .detoxrc.js

Modo debug
detox build --configuration ios.sim.debug
detox build --configuration android.emu.debug

Modo release
detox build --configuration ios.sim.release
detox build --configuration android.emu.release

Ejecutar test
Donde luego de –configuration va el tipo de dispositivo y el nombre que se le colocó en el archivo .detoxrc.js

Modo debug
detox test --configuration ios.sim.debug
detox test --configuration android.emu.debug

Modo release
detox test --configuration ios.sim.release
detox test --configuration android.emu.release
